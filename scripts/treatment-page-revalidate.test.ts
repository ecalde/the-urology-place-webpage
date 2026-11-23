/**
 * Phase 3 checks for caching, slug history, and the publish webhook.
 * Uses signed fixture payloads. Does not call Sanity and does not write to the dataset.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SIGNATURE_HEADER_NAME, encodeSignatureHeader } from "@sanity/webhook";

import {
  TREATMENT_NAV_TAG,
  TREATMENT_PAGE_TAG,
  TREATMENT_REVALIDATE_SECONDS,
  planTreatmentRevalidation,
  treatmentStaticParamList,
} from "../app/lib/treatment-cache";
import {
  loadTreatmentStaticParams,
  publishedTreatmentFetchArgs,
} from "../app/lib/treatment-page-load";
import { interpretTreatmentMatches, loadTreatmentPage } from "../app/lib/treatment-pages";
import {
  TREATMENT_REVALIDATE_PROFILE,
  TREATMENT_WEBHOOK_FILTER,
  TREATMENT_WEBHOOK_PATH,
  TREATMENT_WEBHOOK_PROJECTION,
  handleTreatmentRevalidate,
} from "../app/lib/treatment-revalidate";
import { treatmentFixtureByPath } from "../app/lib/treatment-page-fixtures";
import {
  previousPathsForPublish,
  treatmentDocumentPath,
  withTreatmentPublishAction,
} from "../studio/actions/previousPaths";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SECRET = "phase3-test-secret";

function read(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

async function signedRequest(body: string, secret = SECRET, header?: string) {
  const signature = header ?? (await encodeSignatureHeader(body, Date.now(), secret));
  return new Request(`https://theurologyplace.com${TREATMENT_WEBHOOK_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      [SIGNATURE_HEADER_NAME]: signature,
    },
    body,
  });
}

function recorder() {
  const paths: string[] = [];
  const tags: { tag: string; profile: string }[] = [];
  return {
    paths,
    tags,
    revalidatePath(path: string) {
      paths.push(path);
    },
    revalidateTag(tag: string, profile: typeof TREATMENT_REVALIDATE_PROFILE) {
      tags.push({ tag, profile });
    },
  };
}

async function deliver(body: unknown, secret: string | undefined = SECRET) {
  const payload = JSON.stringify(body);
  const calls = recorder();
  const response = await handleTreatmentRevalidate(await signedRequest(payload), {
    secret,
    revalidatePath: calls.revalidatePath,
    revalidateTag: calls.revalidateTag,
    waitForContentLake: false,
  });
  const json = (await response.json()) as { revalidated: boolean };
  return { response, json, payload, ...calls };
}

test("published treatment fetches are explicitly cached and a Sanity failure is not a 404", async () => {
  const [query, params, options] = publishedTreatmentFetchArgs({
    section: "men",
    path: "/men/erectile-dysfunction",
  });
  assert.match(query, /_type == "treatmentPage"/);
  assert.equal(params.path, "/men/erectile-dysfunction");
  assert.equal(options.useCdn, false);
  assert.equal(options.next.revalidate, 86400);
  assert.equal(TREATMENT_REVALIDATE_SECONDS, 86400);
  assert.deepEqual(options.next.tags, [
    TREATMENT_PAGE_TAG,
    `${TREATMENT_PAGE_TAG}:/men/erectile-dysfunction`,
  ]);

  const men = read("app/men/[...slug]/page.tsx");
  const women = read("app/women/[...slug]/page.tsx");
  assert.match(men, /export const revalidate = 86400/);
  assert.match(women, /export const revalidate = 86400/);
  assert.doesNotMatch(men, /force-dynamic/);
  assert.doesNotMatch(women, /force-dynamic/);
  assert.doesNotMatch(
    read("app/layout.tsx"),
    /force-dynamic|cookies\(|headers\(|searchParams|client\.fetch|treatment-page-load/,
  );
  assert.doesNotMatch(read("app/components/navbar.tsx"), /client\.fetch|getTreatmentNav/);
  assert.doesNotMatch(read("app/api/revalidate/route.ts"), /["']layout["']/);
  assert.match(read("app/lib/treatment-nav.ts"), /TREATMENT_NAV_TAG/);
  assert.doesNotMatch(read("app/sitemap.ts"), /force-dynamic/);

  await assert.rejects(
    () =>
      loadTreatmentPage("men", ["erectile-dysfunction"], async () => {
        throw new Error("sanity down");
      }),
    /sanity down/,
  );
  assert.equal(
    interpretTreatmentMatches("/men/erectile-dysfunction", []).status,
    "notFound",
  );

  const warnings: string[] = [];
  const error = console.error;
  console.error = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "));
  };
  try {
    assert.deepEqual(
      await loadTreatmentStaticParams("men", async () => {
        throw new Error("sanity down");
      }),
      [],
    );
  } finally {
    console.error = error;
  }
  assert.match(warnings.join("\n"), /generateStaticParams failed for men/);
  assert.doesNotMatch(warnings.join("\n"), /notFound/);
});

test("static params skip hardcoded pages and survive a bad response", () => {
  assert.deepEqual(
    treatmentStaticParamList("men", [
      { parentPath: "", slug: "erectile-dysfunction" },
      { parentPath: "male-sexual-dysfunction", slug: "erectile-dysfunction" },
      { parentPath: "", slug: "vasectomy" },
      { parentPath: "", slug: "Not A Slug" },
      { slug: { current: "cms-param-preview" } },
    ]),
    [
      { slug: ["erectile-dysfunction"] },
      { slug: ["male-sexual-dysfunction", "erectile-dysfunction"] },
      { slug: ["cms-param-preview"] },
    ],
  );
  assert.deepEqual(treatmentStaticParamList("women", { error: true }), []);
  assert.deepEqual(
    treatmentStaticParamList("women", [
      { slug: "bulkamid-for-stress-incontinence" },
      { slug: "form-hidden-preview" },
    ]),
    [{ slug: ["form-hidden-preview"] }],
  );
});

test("publish stores the previous address only when the public path changes", () => {
  const published = {
    section: "men",
    parentPath: "",
    slug: { _type: "slug", current: "ed-previous-address" },
    previousPaths: ["/men/older-address"],
  };
  const sameTitle = {
    ...published,
    title: "A new title",
    slug: { current: "ed-previous-address" },
  };
  assert.equal(previousPathsForPublish(sameTitle, published), null);
  assert.equal(previousPathsForPublish(sameTitle, null), null);
  assert.equal(treatmentDocumentPath(published), "/men/ed-previous-address");

  assert.deepEqual(
    previousPathsForPublish(
      {
        section: "men",
        slug: { current: "erectile-dysfunction" },
        previousPaths: ["/men/older-address"],
      },
      published,
    ),
    ["/men/older-address", "/men/ed-previous-address"],
  );

  const alreadyStored = {
    section: "men",
    slug: { current: "erectile-dysfunction" },
    previousPaths: ["/men/older-address", "/men/ed-previous-address"],
  };
  assert.equal(previousPathsForPublish(alreadyStored, published), null);

  assert.deepEqual(
    previousPathsForPublish(
      {
        section: "women",
        parentPath: "hormone-replacement-therapy",
        slug: { current: "form-hidden-preview" },
      },
      { section: "men", slug: { current: "form-hidden-preview" } },
    ),
    ["/men/form-hidden-preview"],
  );

  assert.equal(
    previousPathsForPublish(
      { section: "men", slug: { current: "Not A Slug" } },
      published,
    ),
    null,
  );

  const actions = [
    { action: "publish", label: "Publish" },
    { action: "unpublish", label: "Unpublish" },
    { action: "delete", label: "Delete" },
  ];
  assert.equal(withTreatmentPublishAction(actions, "post", (action) => action), actions);
  const wrapped = withTreatmentPublishAction(actions, "treatmentPage", (action) => ({
    ...action,
    label: "Publish with history",
  }));
  assert.equal(wrapped[0]?.label, "Publish with history");
  assert.equal(wrapped[1]?.label, "Unpublish");
  assert.equal(wrapped[2]?.label, "Delete");

  const actionSource = read("studio/actions/publishTreatmentPage.ts");
  assert.match(actionSource, /previousPathsForPublish/);
  assert.match(actionSource, /patch\.execute/);
  assert.match(actionSource, /Action\.action = 'publish'/);
  assert.match(read("studio/sanity.config.ts"), /withTreatmentPublishAction/);
});

test("a signed publish or edit revalidates without a deployment", async () => {
  const created = await deliver({
    _id: "treatment-ed",
    _type: "treatmentPage",
    operation: "create",
    before: null,
    after: {
      section: "men",
      parentPath: "",
      slug: "erectile-dysfunction",
      previousPaths: [],
      title: "Erectile Dysfunction",
    },
  });
  assert.equal(created.response.status, 200);
  assert.equal(created.json.revalidated, true);
  assert.equal(created.payload.includes("Erectile Dysfunction"), true);
  assert.equal(JSON.stringify(created.json).includes("Erectile Dysfunction"), false);
  assert.deepEqual(created.paths, [
    "/men",
    "/men/erectile-dysfunction",
    "/sitemap.xml",
  ]);
  assert.deepEqual(created.tags, [
    { tag: TREATMENT_PAGE_TAG, profile: "max" },
    { tag: TREATMENT_NAV_TAG, profile: "max" },
  ]);
  assert.equal(TREATMENT_REVALIDATE_PROFILE, "max");
  assert.equal(created.paths.includes("/men/vasectomy"), false);
  assert.equal(
    created.paths.includes("/women/bulkamid-for-stress-incontinence"),
    false,
  );

  const edited = await deliver({
    _id: "treatment-ed",
    _type: "treatmentPage",
    operation: "update",
    before: {
      section: "men",
      slug: "erectile-dysfunction",
      title: "Erectile Dysfunction",
    },
    after: {
      section: "men",
      slug: "erectile-dysfunction",
      title: "Erectile Dysfunction Care",
    },
  });
  assert.equal(edited.response.status, 200);
  assert.equal(edited.json.revalidated, true);
  assert.deepEqual(edited.paths, ["/men", "/men/erectile-dysfunction", "/sitemap.xml"]);

  const flat = planTreatmentRevalidation({
    _id: "treatment-ed",
    _type: "treatmentPage",
    section: "men",
    slug: { _type: "slug", current: "erectile-dysfunction" },
    title: "Erectile Dysfunction",
  });
  assert.equal(flat.action, "revalidate");
  if (flat.action === "revalidate") {
    assert.deepEqual(flat.paths, ["/men", "/men/erectile-dysfunction", "/sitemap.xml"]);
  }
});

test("slug and parent changes revalidate the old path and the loader redirects it", async () => {
  const moved = await deliver({
    _id: "treatment-ed",
    _type: "treatmentPage",
    operation: "update",
    before: {
      section: "men",
      parentPath: "",
      slug: "ed-previous-address",
      previousPaths: [],
    },
    after: {
      section: "men",
      parentPath: "male-sexual-dysfunction",
      slug: "erectile-dysfunction",
      previousPaths: ["/men/ed-previous-address"],
    },
  });
  assert.equal(moved.json.revalidated, true);
  assert.deepEqual(moved.paths, [
    "/men",
    "/men/ed-previous-address",
    "/men/male-sexual-dysfunction",
    "/men/male-sexual-dysfunction/erectile-dysfunction",
    "/sitemap.xml",
  ]);

  const fixture = treatmentFixtureByPath("/men/erectile-dysfunction");
  assert.ok(fixture);
  assert.deepEqual(interpretTreatmentMatches("/men/ed-previous-address", [fixture]), {
    status: "redirect",
    path: "/men/erectile-dysfunction",
  });
  assert.equal(moved.paths.includes("/"), false);
  assert.equal(moved.paths.includes("/men/vasectomy"), false);
});

test("unpublish and delete revalidate the removed path", async () => {
  const removed = await deliver({
    _id: "treatment-hidden",
    _type: "treatmentPage",
    operation: "delete",
    before: {
      section: "women",
      parentPath: "hormone-replacement-therapy",
      slug: "form-hidden-preview",
      previousPaths: ["/women/old-hidden-preview"],
    },
    after: null,
  });
  assert.equal(removed.response.status, 200);
  assert.equal(removed.json.revalidated, true);
  assert.deepEqual(removed.paths, [
    "/sitemap.xml",
    "/women",
    "/women/hormone-replacement-therapy",
    "/women/hormone-replacement-therapy/form-hidden-preview",
    "/women/old-hidden-preview",
  ]);
  assert.equal(
    interpretTreatmentMatches("/women/hormone-replacement-therapy/form-hidden-preview", [])
      .status,
    "notFound",
  );
});

test("invalid webhook signatures are rejected and do not revalidate", async () => {
  const body = JSON.stringify({
    _id: "treatment-ed",
    _type: "treatmentPage",
    section: "men",
    slug: "erectile-dysfunction",
    title: "Erectile Dysfunction",
  });

  const missingSecret = recorder();
  const missingSecretResponse = await handleTreatmentRevalidate(await signedRequest(body), {
    secret: undefined,
    revalidatePath: missingSecret.revalidatePath,
    revalidateTag: missingSecret.revalidateTag,
    waitForContentLake: false,
  });
  assert.equal(missingSecretResponse.status, 401);
  assert.deepEqual(missingSecret.paths, []);
  assert.deepEqual(missingSecret.tags, []);

  const blankSecret = recorder();
  const blankSecretResponse = await handleTreatmentRevalidate(await signedRequest(body), {
    secret: "  ",
    revalidatePath: blankSecret.revalidatePath,
    revalidateTag: blankSecret.revalidateTag,
    waitForContentLake: false,
  });
  assert.equal(blankSecretResponse.status, 401);
  assert.deepEqual(blankSecret.paths, []);

  const wrongSecret = await deliver(JSON.parse(body), "different-secret");
  assert.equal(wrongSecret.response.status, 401);
  assert.equal(wrongSecret.json.revalidated, false);
  assert.deepEqual(wrongSecret.paths, []);
  assert.deepEqual(wrongSecret.tags, []);

  const tampered = recorder();
  const tamperedResponse = await handleTreatmentRevalidate(
    await signedRequest(body, SECRET, await encodeSignatureHeader(body, Date.now(), "other-secret")),
    {
      secret: SECRET,
      revalidatePath: tampered.revalidatePath,
      revalidateTag: tampered.revalidateTag,
      waitForContentLake: false,
    },
  );
  assert.equal(tamperedResponse.status, 401);
  assert.deepEqual(tampered.paths, []);

  const unsigned = recorder();
  const unsignedResponse = await handleTreatmentRevalidate(
    new Request(`https://theurologyplace.com${TREATMENT_WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }),
    {
      secret: SECRET,
      revalidatePath: unsigned.revalidatePath,
      revalidateTag: unsigned.revalidateTag,
      waitForContentLake: false,
    },
  );
  assert.equal(unsignedResponse.status, 401);
  assert.deepEqual(unsigned.paths, []);

  const malformed = recorder();
  const malformedBody = "{";
  const malformedResponse = await handleTreatmentRevalidate(
    await signedRequest(malformedBody),
    {
      secret: SECRET,
      revalidatePath: malformed.revalidatePath,
      revalidateTag: malformed.revalidateTag,
      waitForContentLake: false,
    },
  );
  assert.equal(malformedResponse.status, 400);
  assert.deepEqual(malformed.paths, []);

  const route = read("app/api/revalidate/route.ts");
  assert.match(route, /process\.env\.SANITY_REVALIDATE_SECRET/);
  assert.doesNotMatch(route, /revalidateTag\([^,\n]+\)/);
  assert.doesNotMatch(route, /revalidatePath\(\s*["']\/["']\s*,\s*["']layout["']/);
  assert.match(TREATMENT_WEBHOOK_FILTER, /treatmentPage/);
  assert.match(TREATMENT_WEBHOOK_FILTER, /drafts/);
  assert.match(TREATMENT_WEBHOOK_PROJECTION, /delta::operation\(\)/);
  assert.match(TREATMENT_WEBHOOK_PROJECTION, /before\(\)/);
  assert.match(TREATMENT_WEBHOOK_PROJECTION, /after\(\)/);
  assert.equal(TREATMENT_WEBHOOK_PATH, "/api/revalidate");
});

test("drafts and other document types do not revalidate", async () => {
  const draft = await deliver({
    _id: "drafts.treatment-ed",
    _type: "treatmentPage",
    section: "men",
    slug: "erectile-dysfunction",
  });
  assert.equal(draft.response.status, 200);
  assert.equal(draft.json.revalidated, false);
  assert.deepEqual(draft.paths, []);
  assert.deepEqual(draft.tags, []);

  const post = await deliver({
    _id: "post-1",
    _type: "post",
    slug: { current: "hello" },
  });
  assert.equal(post.response.status, 200);
  assert.equal(post.json.revalidated, false);
  assert.deepEqual(post.paths, []);

  const ignoredPlan = planTreatmentRevalidation({
    _id: "treatment-ed",
    _type: "treatmentPage",
    previousPaths: ["javascript:alert(1)", "https://example.com", "/patients/secret"],
    section: "men",
    slug: "erectile-dysfunction",
  });
  assert.equal(ignoredPlan.action, "revalidate");
  if (ignoredPlan.action === "revalidate") {
    assert.equal(ignoredPlan.paths.includes("javascript:alert(1)"), false);
    assert.equal(ignoredPlan.paths.includes("https://example.com"), false);
    assert.equal(ignoredPlan.paths.includes("/men/vasectomy"), false);
    assert.equal(ignoredPlan.paths.includes("/men/erectile-dysfunction"), true);
  }
});

test("hardcoded treatment pages stay on their own files", () => {
  const bulkamid = read("app/women/bulkamid-for-stress-incontinence/page.tsx");
  const vasectomy = read("app/men/vasectomy/page.tsx");
  assert.match(bulkamid, /pageName="Bulkamid for Stress Incontinence"/);
  assert.doesNotMatch(bulkamid, /getTreatmentPage|TreatmentPageView|revalidateTag/);
  assert.doesNotMatch(vasectomy, /getTreatmentPage|TreatmentPageView|revalidateTag/);
  assert.doesNotMatch(read("app/api/contact/route.ts"), /treatmentPage|revalidateTag/);
  assert.doesNotMatch(read("app/components/contact-form-fields.tsx"), /treatmentPage/);
});
