/**
 * Phase 2 checks for the treatment page template.
 * Renders local fixtures. Does not call Sanity and does not write to the dataset.
 */
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";

import { ContactFormTemplate } from "../app/components/contact-form-template";
import { TreatmentFaqAccordion } from "../app/components/treatment-page/treatment-faq-accordion";
import { TreatmentPageView } from "../app/components/treatment-page/treatment-page-view";
import { APPOINTMENT_REASON_OPTIONS } from "../app/lib/contact-form-defaults";
import { isYouTubeVideoId, safeTreatmentHref } from "../app/lib/treatment-links";
import { treatmentPageMetadata } from "../app/lib/treatment-page-metadata";
import {
  fetchTreatmentDocuments,
  treatmentFixturesEnabled,
} from "../app/lib/treatment-page-load";
import {
  matchTreatmentFixtures,
  treatmentFixtureByPath,
} from "../app/lib/treatment-page-fixtures";
import {
  TREATMENT_PAGE_BY_PATH_QUERY,
  interpretTreatmentMatches,
  loadTreatmentPage,
  resolveTreatmentAppointmentReason,
  treatmentContactCategory,
  treatmentFormIdPrefix,
  treatmentPublicPath,
  treatmentRequestPath,
  type TreatmentPage,
} from "../app/lib/treatment-pages";
import { siteLinkError, youtubeIdError } from "../studio/schemaTypes/treatmentPage/contentRules";
import { TREATMENT_PARENTS } from "../studio/schemaTypes/treatmentPage/constants";
import {
  formatTreatmentPath,
  parentPathError,
  staticTreatmentPathError,
} from "../studio/schemaTypes/treatmentPage/paths";
import { routeInventory } from "../studio/routeInventory.generated";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function render(node: React.ReactNode) {
  return renderToStaticMarkup(node);
}

function pageFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pageFiles(full));
    else if (entry.name === "page.tsx") out.push(full);
  }
  return out;
}

function withConsole(run: () => void) {
  const warnings: string[] = [];
  const errors: string[] = [];
  const warn = console.warn;
  const error = console.error;
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  };
  try {
    run();
  } finally {
    console.warn = warn;
    console.error = error;
  }
  return { warnings, errors };
}

test("safe links and YouTube ids match the Studio rules", () => {
  const links = [
    "/men/vasectomy",
    "https://theurologyplace.com/about-us",
    "http://example.com",
    "javascript:alert(1)",
    "//evil.example",
    "",
    "  /women/emsella-for-incontinence  ",
    "notaurl",
    "https://example.com/path",
  ];
  for (const sample of links) {
    assert.equal(
      safeTreatmentHref(sample) !== null,
      siteLinkError(sample) === true,
      sample,
    );
  }
  const videos = ["dQw4w9WgXcQ", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "short", ""];
  for (const sample of videos) {
    assert.equal(isYouTubeVideoId(sample), youtubeIdError(sample) === true, sample);
  }
});

test("public paths match the Studio path helper and reject the wrong hub", () => {
  const cases = [
    ["men", "", "erectile-dysfunction"],
    ["men", "male-sexual-dysfunction", "erectile-dysfunction-options"],
    ["men", "prostate-cancer/radiation-treatments", "spacer-notes"],
    ["women", "hormone-replacement-therapy", "pellet-preview"],
    ["women", "", "bulkamid-cms-preview"],
  ] as const;
  for (const [section, parent, slug] of cases) {
    assert.equal(
      treatmentPublicPath({ section, parentPath: parent, slug }),
      formatTreatmentPath(section, parent, slug),
    );
  }
  assert.equal(
    treatmentPublicPath({
      section: "women",
      parentPath: "prostate-cancer",
      slug: "example",
    }),
    null,
  );
  assert.notEqual(parentPathError("women", "prostate-cancer"), true);
  assert.equal(treatmentRequestPath("men", ["..", "vasectomy"]), null);
  assert.equal(treatmentRequestPath("men", []), null);
  assert.equal(
    treatmentRequestPath("men", ["male-sexual-dysfunction", "erectile-dysfunction-options"]),
    "/men/male-sexual-dysfunction/erectile-dysfunction-options",
  );
});

test("appointment reasons stay on the shared list", () => {
  assert.equal(
    resolveTreatmentAppointmentReason("Erectile Dysfunction", "Erectile Dysfunction Treatment"),
    "Erectile Dysfunction Treatment",
  );
  assert.equal(resolveTreatmentAppointmentReason("Erectile Dysfunction", "Other"), "Other");
  assert.equal(
    resolveTreatmentAppointmentReason("Bulkamid for Stress Incontinence", ""),
    "Urinary Incontinence",
  );
  assert.equal(
    resolveTreatmentAppointmentReason("Bulkamid for Stress Incontinence", undefined),
    "Urinary Incontinence",
  );
  assert.equal(resolveTreatmentAppointmentReason("Vasectomy", null), "Vasectomy");
  assert.equal(
    resolveTreatmentAppointmentReason("Erectile Dysfunction", "Made Up Reason"),
    "General Urology",
  );
  assert.equal(
    resolveTreatmentAppointmentReason("Evening Clinic Notes", undefined),
    "General Urology",
  );
  for (const reason of APPOINTMENT_REASON_OPTIONS) {
    assert.equal(resolveTreatmentAppointmentReason("Evening Clinic Notes", reason), reason);
  }
});

test("contact categories follow the existing Men and Women labels", () => {
  assert.equal(treatmentContactCategory("men", null), "Men");
  assert.equal(treatmentContactCategory("women", ""), "Women");
  assert.equal(
    treatmentContactCategory("men", "male-sexual-dysfunction"),
    "Men > Male Sexual Dysfunction",
  );
  assert.equal(
    treatmentContactCategory("men", "prostate-cancer/radiation-treatments"),
    "Men > Prostate Cancer",
  );
  assert.equal(
    treatmentContactCategory("women", "hormone-replacement-therapy"),
    "Women > Hormone Replacement Therapy",
  );
  for (const parent of TREATMENT_PARENTS) {
    const category = treatmentContactCategory(parent.section, parent.value);
    assert.match(category, parent.section === "men" ? /^Men > / : /^Women > /);
  }
});

test("a query with no document is notFound, and a Sanity error is not turned into one", async () => {
  let calls = 0;
  const missing = await loadTreatmentPage("men", ["erectile-dysfunction"], async () => {
    calls += 1;
    return [];
  });
  assert.equal(missing.status, "notFound");
  assert.equal(calls, 1);

  const badPath = await loadTreatmentPage("men", ["Not A Slug"], async () => {
    calls += 1;
    return [];
  });
  assert.equal(badPath.status, "notFound");
  assert.equal(calls, 1);

  await assert.rejects(
    () =>
      loadTreatmentPage("men", ["erectile-dysfunction"], async () => {
        throw new Error("sanity down");
      }),
    /sanity down/,
  );
  await assert.rejects(
    () => loadTreatmentPage("men", ["erectile-dysfunction"], async () => ({ _id: "x" })),
    /unexpected result/,
  );
});

test("duplicate documents and previous paths do not silently pick the first row", () => {
  const fixture = treatmentFixtureByPath("/men/erectile-dysfunction");
  assert.ok(fixture);
  const logs = withConsole(() => {
    const duplicate = interpretTreatmentMatches("/men/erectile-dysfunction", [
      fixture,
      { ...fixture, _id: "fixture-duplicate" },
    ]);
    assert.equal(duplicate.status, "notFound");
  });
  assert.match(logs.errors.join("\n"), /fixture-erectile-dysfunction, fixture-duplicate/);
  assert.doesNotMatch(logs.errors.join("\n"), /Erectile Dysfunction Treatment/);

  const previous = interpretTreatmentMatches("/men/ed-previous-address", [fixture]);
  assert.deepEqual(previous, { status: "redirect", path: "/men/erectile-dysfunction" });

  const untitled = interpretTreatmentMatches("/men/erectile-dysfunction", [
    { ...fixture, title: "  " },
  ]);
  assert.equal(untitled.status, "notFound");
});

test("fixture mode does not call the published Sanity fetch", async () => {
  assert.equal(
    treatmentFixturesEnabled({ NODE_ENV: "production", TREATMENT_PAGE_FIXTURES: "1" }),
    false,
  );
  assert.equal(
    treatmentFixturesEnabled({ NODE_ENV: "development", TREATMENT_PAGE_FIXTURES: "1" }),
    true,
  );
  assert.equal(treatmentFixturesEnabled({ NODE_ENV: "development" }), false);

  let publishedCalls = 0;
  const fromFixtures = await fetchTreatmentDocuments(
    { section: "men", path: "/men/erectile-dysfunction" },
    {
      enabled: () => true,
      fixtures: matchTreatmentFixtures,
      fetchPublished: async () => {
        publishedCalls += 1;
        return [];
      },
    },
  );
  assert.equal(publishedCalls, 0);
  assert.equal(Array.isArray(fromFixtures) && fromFixtures.length, 1);

  let fixtureCalls = 0;
  await fetchTreatmentDocuments(
    { section: "women", path: "/women/bulkamid-cms-preview" },
    {
      enabled: () => false,
      fixtures: () => {
        fixtureCalls += 1;
        return [];
      },
      fetchPublished: async (query) => {
        assert.equal(query.section, "women");
        assert.equal(query.path, "/women/bulkamid-cms-preview");
        return [];
      },
    },
  );
  assert.equal(fixtureCalls, 0);
  assert.match(TREATMENT_PAGE_BY_PATH_QUERY, /_type == "treatmentPage"/);
  assert.match(TREATMENT_PAGE_BY_PATH_QUERY, /previousPaths/);
  assert.doesNotMatch(TREATMENT_PAGE_BY_PATH_QUERY, /\[0\]/);
});

test("local fixtures resolve the configured reason, including empty and invalid values", async () => {
  const fetcher = async (query: { section: string; path: string }) =>
    matchTreatmentFixtures(query.section, query.path);

  const configured = await loadTreatmentPage("men", ["erectile-dysfunction"], fetcher);
  assert.equal(configured.status, "render");
  if (configured.status === "render") {
    assert.equal(
      resolveTreatmentAppointmentReason(
        configured.page.title,
        configured.page.defaultAppointmentReason,
      ),
      "Erectile Dysfunction Treatment",
    );
  }

  const invalid = await loadTreatmentPage("men", ["invalid-reason-preview"], fetcher);
  assert.equal(invalid.status, "render");
  if (invalid.status === "render") {
    assert.equal(
      resolveTreatmentAppointmentReason(invalid.page.title, invalid.page.defaultAppointmentReason),
      "General Urology",
    );
  }

  const mapped = await loadTreatmentPage("men", ["title-mapped-reason"], fetcher);
  assert.equal(mapped.status, "render");
  if (mapped.status === "render") {
    assert.equal(
      resolveTreatmentAppointmentReason(mapped.page.title, mapped.page.defaultAppointmentReason),
      "Vasectomy",
    );
  }

  const fallback = await loadTreatmentPage("men", ["general-reason-fallback"], fetcher);
  assert.equal(fallback.status, "render");
  if (fallback.status === "render") {
    assert.equal(
      resolveTreatmentAppointmentReason(
        fallback.page.title,
        fallback.page.defaultAppointmentReason,
      ),
      "General Urology",
    );
  }

  const hidden = await loadTreatmentPage("women", ["form-hidden-preview"], fetcher);
  assert.equal(hidden.status, "render");
  if (hidden.status === "render") {
    assert.equal(hidden.page.showContactForm, false);
  }
});

test("the contact form selects a listed reason and still offers every option", () => {
  const html = render(
    <ContactFormTemplate
      variant="embedded"
      pageName="Erectile Dysfunction"
      serviceName="Erectile Dysfunction"
      category="Men"
      sourcePath="/men/erectile-dysfunction"
      idPrefix="treatment-men-erectile-dysfunction"
      defaultAppointmentReason="Erectile Dysfunction Treatment"
    />,
  );
  const select = html.match(
    /<select[^>]*id="treatment-men-erectile-dysfunction-contact-appointment-reason"[^>]*>/,
  );
  assert.ok(select, html.slice(html.indexOf("appointment-reason"), html.indexOf("appointment-reason") + 400));
  assert.doesNotMatch(select[0], /\sdisabled(?:=|\s|>)/);
  assert.match(
    html,
    /<option[^>]*value="Erectile Dysfunction Treatment"[^>]*selected[^>]*>Erectile Dysfunction Treatment<\/option>|<option[^>]*selected[^>]*value="Erectile Dysfunction Treatment"[^>]*>Erectile Dysfunction Treatment<\/option>/,
  );
  const decodedOptions = html.replace(/&#x27;|&#39;|&apos;/g, "'");
  for (const reason of APPOINTMENT_REASON_OPTIONS) {
    assert.ok(decodedOptions.includes(`value="${reason}"`), reason);
  }
  assert.equal(html.includes("contact-other-appointment-reason"), false);

  const other = render(
    <ContactFormTemplate
      variant="embedded"
      pageName="Erectile Dysfunction"
      serviceName="Erectile Dysfunction"
      category="Men"
      sourcePath="/men/erectile-dysfunction"
      idPrefix="treatment-other"
      defaultAppointmentReason="Other"
    />,
  );
  assert.match(other, /id="treatment-other-contact-other-appointment-reason"/);

  const unchanged = render(
    <ContactFormTemplate
      variant="embedded"
      pageName="Bulkamid for Stress Incontinence"
      serviceName="Bulkamid for Stress Incontinence"
      category="Women"
      sourcePath="/women/bulkamid-for-stress-incontinence"
      idPrefix="women-bulkamid"
    />,
  );
  assert.match(unchanged, /value="Urinary Incontinence"[^>]*selected|selected[^>]*value="Urinary Incontinence"/);

  const ignored = render(
    <ContactFormTemplate
      variant="embedded"
      pageName="Vasectomy"
      serviceName="Vasectomy"
      category="Men"
      sourcePath="/men/title-mapped-reason"
      idPrefix="treatment-ignored"
      defaultAppointmentReason={"Made Up Reason" as "Vasectomy"}
    />,
  );
  assert.match(ignored, /value="Vasectomy"[^>]*selected|selected[^>]*value="Vasectomy"/);
  assert.equal(ignored.includes('value="Made Up Reason"'), false);
});

test("formatted FAQ answers render paragraphs, bold, lists, and safe links", () => {
  const fixture = treatmentFixtureByPath("/men/erectile-dysfunction");
  assert.ok(fixture);
  const faq = fixture.body?.find((block) => block._type === "treatmentFaq");
  assert.ok(faq?.items?.[0]);
  const html = render(
    <TreatmentFaqAccordion
      items={[
        {
          id: "q1",
          question: faq.items[0].question || "",
          answer: faq.items[0].answer,
        },
        {
          id: "unsafe",
          question: "Where can I read more?",
          answer: [
            {
              _type: "block",
              _key: "unsafe",
              style: "normal",
              markDefs: [
                { _key: "script", _type: "link", href: "javascript:alert(1)" },
                { _key: "http", _type: "link", href: "http://example.com" },
              ],
              children: [
                { _type: "span", _key: "a", text: "Script link", marks: ["script"] },
                { _type: "span", _key: "b", text: " and ", marks: [] },
                { _type: "span", _key: "c", text: "insecure link", marks: ["http"] },
              ],
            },
          ],
        },
      ]}
    />,
  );
  assert.match(html, /What should I ask at the first visit\?/);
  assert.match(html, /<strong[^>]*>Ask the clinic<\/strong>/);
  assert.match(html, /<ul[^>]*>/);
  assert.match(html, /How long the visit usually takes/);
  assert.match(html, /<ol[^>]*>/);
  assert.match(html, /Call the clinic if your symptoms change/);
  assert.match(html, /href="\/men\/male-sexual-dysfunction"/);
  assert.match(html, /href="https:\/\/theurologyplace.com\/about-us"/);
  assert.match(html, /Script link/);
  assert.match(html, /insecure link/);
  assert.doesNotMatch(html, /javascript:/);
  assert.doesNotMatch(html, /http:\/\/example\.com/);
  assert.doesNotMatch(html, /dangerouslySetInnerHTML|innerHTML/);
});

test("the fixture page renders the shared blocks and the configured form", () => {
  const fixture = treatmentFixtureByPath("/men/erectile-dysfunction");
  assert.ok(fixture);
  const logs = withConsole(() => {
    const html = render(<TreatmentPageView page={fixture} />);
    assert.match(html, /data-treatment-page="cms"/);
    assert.match(html, /<h1[^>]*>Erectile Dysfunction<\/h1>/);
    assert.match(html, /cdn\.sanity\.io\/images\/5zd6me01\/production\/treatmentherofixture01-1600x900\.jpg\?w=1600/);
    assert.match(html, /treatmentbodyfixture01-1200x800\.jpg\?w=1200/);
    assert.doesNotMatch(html, /\/_next\/image/);
    assert.match(html, /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
    assert.match(html, /Dr\. Naveen Kella/);
    assert.match(html, /Two ways to start the conversation/);
    assert.match(html, /href="\/patient-resources\/contact-us"/);
    assert.match(html, /Male Sexual Dysfunction/);
    assert.match(html, /Bulkamid CMS preview/);
    assert.match(html, /href="#treatment-men-erectile-dysfunction-contact"/);
    assert.match(html, /tel:2106173670/);
    assert.match(html, /210-617-3670/);
    assert.match(html, /name="category" value="Men"/);
    assert.match(html, /name="sourcePath" value="\/men\/erectile-dysfunction"/);
    assert.match(
      html,
      /value="Erectile Dysfunction Treatment"[^>]*selected|selected[^>]*value="Erectile Dysfunction Treatment"/,
    );
    assert.match(html, /<strong[^>]*>Ask the clinic<\/strong>/);

    const hidden = treatmentFixtureByPath("/women/form-hidden-preview");
    assert.ok(hidden);
    const hiddenHtml = render(<TreatmentPageView page={hidden} />);
    assert.match(hiddenHtml, /href="\/patient-resources\/contact-us"/);
    assert.doesNotMatch(hiddenHtml, /name="appointmentReason"/);
    assert.doesNotMatch(hiddenHtml, /Appointment Reason/);

    const parented = treatmentFixtureByPath(
      "/men/male-sexual-dysfunction/erectile-dysfunction-options",
    );
    assert.ok(parented);
    const parentedHtml = render(<TreatmentPageView page={parented} />);
    assert.match(parentedHtml, /name="category" value="Men &gt; Male Sexual Dysfunction"|name="category" value="Men > Male Sexual Dysfunction"/);
    assert.match(
      parentedHtml,
      /name="sourcePath" value="\/men\/male-sexual-dysfunction\/erectile-dysfunction-options"/,
    );

    const poisoned: TreatmentPage = {
      ...fixture,
      _id: "fixture-poisoned",
      body: [
        ...(fixture.body ?? []),
        {
          _key: "bad",
          _type: "treatmentHtml",
          label: "<script>alert(1)</script>",
        },
      ],
    };
    const poisonedLogs = withConsole(() => {
      const poisonedHtml = render(<TreatmentPageView page={poisoned} />);
      assert.doesNotMatch(poisonedHtml, /<script|alert\(1\)/);
    });
    assert.match(poisonedLogs.warnings.join("\n"), /treatmentHtml/);
    assert.doesNotMatch(poisonedLogs.warnings.join("\n"), /alert\(1\)/);
  });
  assert.equal(logs.errors.length, 0);
});

test("unlisted pages are noindex and a clinical share image is replaced", () => {
  const fixture = treatmentFixtureByPath("/men/erectile-dysfunction");
  assert.ok(fixture);
  const metadata = treatmentPageMetadata(fixture);
  assert.equal(
    metadata.alternates &&
      typeof metadata.alternates === "object" &&
      "canonical" in metadata.alternates
      ? metadata.alternates.canonical
      : undefined,
    "https://theurologyplace.com/men/erectile-dysfunction",
  );
  assert.equal(
    metadata.description,
    "Evaluation and treatment for erectile dysfunction at The Urology Place in San Antonio.",
  );
  assert.deepEqual(metadata.robots, { index: false });

  const publicMetadata = treatmentPageMetadata({ ...fixture, visibility: "public" });
  assert.equal(publicMetadata.robots, undefined);

  const clinical = treatmentPageMetadata({
    ...fixture,
    shareImage: {
      alt: "Clinic",
      sourceName: "patient-a-photo.jpg",
      asset: { _ref: "image-treatmentsharefixture01-1200x630-jpg" },
    },
  });
  const images = clinical.openGraph?.images;
  const first = Array.isArray(images) ? images[0] : images;
  const url = first && typeof first === "object" && "url" in first ? first.url : first;
  assert.equal(url, "/images/branding/og-share.jpg");

  const share = treatmentPageMetadata(fixture);
  const shareImages = share.openGraph?.images;
  const shareFirst = Array.isArray(shareImages) ? shareImages[0] : shareImages;
  const shareUrl =
    shareFirst && typeof shareFirst === "object" && "url" in shareFirst
      ? shareFirst.url
      : shareFirst;
  assert.match(String(shareUrl), /treatmentsharefixture01-1200x630\.jpg/);
  assert.match(String(shareUrl), /w=1200/);
  assert.match(String(shareUrl), /h=630/);
});

test("hardcoded treatment routes stay on their files and ahead of the catch-all", () => {
  for (const section of ["men", "women"]) {
    const pages = pageFiles(path.join(root, "app", section));
    for (const file of pages) {
      if (file.includes(`${path.sep}[...slug]${path.sep}`)) continue;
      const source = readFileSync(file, "utf8");
      assert.doesNotMatch(source, /TreatmentPageView|treatment-page-view|getTreatmentPage/);
    }
  }

  const bulkamid = readFileSync(
    path.join(root, "app/women/bulkamid-for-stress-incontinence/page.tsx"),
    "utf8",
  );
  assert.match(bulkamid, /pageName="Bulkamid for Stress Incontinence"/);
  assert.doesNotMatch(bulkamid, /defaultAppointmentReason/);
  assert.match(bulkamid, /Bulkamid for Stress Incontinence/);

  const menRoute = readFileSync(path.join(root, "app/men/[...slug]/page.tsx"), "utf8");
  const womenRoute = readFileSync(path.join(root, "app/women/[...slug]/page.tsx"), "utf8");
  assert.doesNotMatch(menRoute, /force-dynamic/);
  assert.doesNotMatch(womenRoute, /force-dynamic/);
  assert.match(menRoute, /export const revalidate = 86400/);
  assert.match(womenRoute, /export const revalidate = 86400/);
  assert.match(menRoute, /export const dynamicParams = true/);
  assert.match(womenRoute, /export const dynamicParams = true/);
  assert.match(menRoute, /generateStaticParams/);
  assert.match(womenRoute, /generateStaticParams/);
  assert.equal(existsSync(path.join(root, "app/men/[[...slug]]/page.tsx")), false);
  assert.equal(existsSync(path.join(root, "app/women/[[...slug]]/page.tsx")), false);
  assert.equal(existsSync(path.join(root, "app/api/revalidate/route.ts")), true);
  assert.equal(existsSync(path.join(root, "app/men/page.tsx")), true);
  assert.equal(existsSync(path.join(root, "app/women/page.tsx")), true);

  const bulkamidRoute = routeInventory.find(
    (entry) => entry.path === "/women/bulkamid-for-stress-incontinence",
  );
  assert.equal(bulkamidRoute?.kind, "static");
  assert.equal(bulkamidRoute?.sanityStatus, "hardcoded");
  assert.equal(
    bulkamidRoute?.sourceFile,
    "app/women/bulkamid-for-stress-incontinence/page.tsx",
  );
  const vasectomy = routeInventory.find((entry) => entry.path === "/men/vasectomy");
  assert.equal(vasectomy?.kind, "static");
  assert.equal(vasectomy?.sanityStatus, "hardcoded");
  assert.equal(routeInventory.find((entry) => entry.path === "/men")?.kind, "static");
  assert.equal(routeInventory.find((entry) => entry.path === "/women")?.kind, "static");

  for (const routePath of ["/men/[...slug]", "/women/[...slug]"]) {
    const entry = routeInventory.find((item) => item.path === routePath);
    assert.equal(entry?.kind, "dynamic");
    assert.equal(entry?.sanityStatus, "managed");
    assert.equal(entry?.title, "Treatment page (dynamic)");
    assert.equal(staticTreatmentPathError(routePath), true);
  }
  assert.notEqual(
    staticTreatmentPathError("/women/bulkamid-for-stress-incontinence"),
    true,
  );
  assert.notEqual(staticTreatmentPathError("/men/vasectomy"), true);

  const sitemap = readFileSync(path.join(root, "app/sitemap.ts"), "utf8");
  const navbar = readFileSync(path.join(root, "app/components/navbar.tsx"), "utf8");
  const layout = readFileSync(path.join(root, "app/layout.tsx"), "utf8");
  assert.match(navbar, /href: "\/men\/vasectomy"/);
  assert.match(navbar, /href: "\/women\/bulkamid-for-stress-incontinence"/);
  assert.doesNotMatch(navbar, /client\.fetch|force-dynamic/);
  assert.doesNotMatch(layout, /force-dynamic|cookies\(|headers\(|searchParams|client\.fetch/);
  assert.match(sitemap, /export const revalidate = 3600/);
  assert.doesNotMatch(sitemap, /force-dynamic/);
  assert.equal(treatmentFormIdPrefix("/men/erectile-dysfunction"), "treatment-men-erectile-dysfunction");
});
