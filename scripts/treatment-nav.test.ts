/**
 * Phase 4 checks for navbar merge, section cards, and sitemap paths.
 * Uses fixture rows. Does not call Sanity and does not write to the dataset.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { NAV_ITEMS_SORTED } from "../app/components/navbar";
import {
  TREATMENT_NAV_TAG,
  planTreatmentRevalidation,
} from "../app/lib/treatment-cache";
import { loadTreatmentNav } from "../app/lib/treatment-nav-load";
import {
  TREATMENT_NAV_QUERY,
  mergeTreatmentNav,
  publishedTreatmentNavFetchArgs,
  readTreatmentNavItems,
  treatmentNavFetchOptions,
  treatmentServiceCards,
  treatmentSitemapPaths,
  type TreatmentNavLink,
  type TreatmentNavTreeNode,
} from "../app/lib/treatment-nav";
import { TREATMENT_REVALIDATE_PROFILE } from "../app/lib/treatment-revalidate";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function findHref(
  nodes: readonly TreatmentNavTreeNode[] | undefined,
  href: string,
): TreatmentNavTreeNode | undefined {
  if (!nodes) return undefined;
  for (const node of nodes) {
    if (node.href === href) return node;
    const nested = findHref(node.children, href);
    if (nested) return nested;
  }
  return undefined;
}

type NavShape = {
  label: string;
  href?: string;
  badgeLabel?: string;
  children?: NavShape[];
};

function shape(nodes: readonly TreatmentNavTreeNode[] | undefined): NavShape[] {
  return (nodes ?? []).map((node) => ({
    label: node.label,
    href: node.href,
    badgeLabel: node.badgeLabel,
    children: node.children ? shape(node.children) : undefined,
  }));
}

function directIdentity(nodes: readonly TreatmentNavTreeNode[] | undefined) {
  return (nodes ?? []).map((node) => ({
    label: node.label,
    href: node.href,
    badgeLabel: node.badgeLabel,
  }));
}

function row(values: {
  title: string;
  section: "men" | "women";
  slug: string;
  parentPath?: string;
  menuLabel?: string;
  cardDescription?: string;
  sortOrder?: number;
  visibility?: string;
  _id?: string;
}) {
  return {
    _id: values._id,
    title: values.title,
    menuLabel: values.menuLabel,
    cardDescription: values.cardDescription,
    section: values.section,
    parentPath: values.parentPath ?? "",
    slug: values.slug,
    sortOrder: values.sortOrder ?? 0,
    visibility: values.visibility ?? "public",
  };
}

test("the nav query is a small cached public projection", () => {
  const [query, params, options] = publishedTreatmentNavFetchArgs();
  assert.equal(query, TREATMENT_NAV_QUERY);
  assert.deepEqual(params, {});
  assert.equal(options.useCdn, false);
  assert.equal(options.next.revalidate, 86400);
  assert.deepEqual(options.next.tags, [TREATMENT_NAV_TAG]);
  assert.deepEqual(treatmentNavFetchOptions().next.tags, [TREATMENT_NAV_TAG]);
  assert.match(query, /visibility == "public"/);
  assert.match(query, /drafts\.\*\*/);
  assert.match(query, /menuLabel/);
  assert.match(query, /cardDescription/);
  assert.match(query, /sortOrder/);
  assert.doesNotMatch(query, /\bbody\b|\bhero\b|portableText|treatmentRichText|treatmentFaq/);

  const plan = planTreatmentRevalidation({
    _id: "treatment-ed",
    _type: "treatmentPage",
    section: "men",
    parentPath: "",
    slug: "erectile-dysfunction",
  });
  assert.equal(plan.action, "revalidate");
  if (plan.action === "revalidate") {
    assert.deepEqual(plan.tags, ["treatment-page", TREATMENT_NAV_TAG]);
    assert.equal(plan.paths.includes("/"), false);
    assert.equal(plan.paths.includes("/men"), true);
    assert.equal(plan.paths.includes("/sitemap.xml"), true);
  }
  assert.equal(TREATMENT_REVALIDATE_PROFILE, "max");

  const layout = read("app/layout.tsx");
  const navbar = read("app/components/navbar.tsx");
  const sitemap = read("app/sitemap.ts");
  const loader = read("app/lib/treatment-nav-load.ts");
  assert.match(layout, /SiteNavbar/);
  assert.doesNotMatch(
    layout,
    /force-dynamic|cookies\(|headers\(|searchParams|client\.fetch|treatment-page-load/,
  );
  assert.doesNotMatch(navbar, /client\.fetch|getTreatmentNav|force-dynamic/);
  assert.match(navbar, /href: "\/men\/vasectomy"/);
  assert.match(navbar, /href: "\/women\/bulkamid-for-stress-incontinence"/);
  assert.match(navbar, /mergeTreatmentNav\(NAV_ITEMS_SORTED, treatmentLinks\)/);
  assert.match(sitemap, /https:\/\/www\.theurologyplace\.com/);
  assert.match(sitemap, /export const revalidate = 3600/);
  assert.match(sitemap, /getTreatmentNav/);
  assert.doesNotMatch(sitemap, /force-dynamic/);
  assert.match(loader, /publishedTreatmentNavFetchArgs/);
  assert.doesNotMatch(loader, /no-store|force-dynamic|cookies\(|headers\(|searchParams/);
  assert.doesNotMatch(read("app/api/revalidate/route.ts"), /["']layout["']/);
  assert.doesNotMatch(read("app/lib/site-metadata.ts"), /treatment-nav|treatmentPage/);
  assert.match(read("app/lib/site-metadata.ts"), /https:\/\/theurologyplace\.com/);
  assert.match(read("app/lib/treatment-page-metadata.ts"), /pageMetadata\(/);
  assert.doesNotMatch(read("app/components/contact-form-template.tsx"), /treatment-nav/);
  assert.doesNotMatch(read("app/api/contact/route.ts"), /treatment-nav/);
  assert.match(read("app/men/page.tsx"), /href: "\/men\/vasectomy"/);
  assert.match(read("app/men/page.tsx"), /treatmentServiceCards\(\s*"men"/);
  assert.match(read("app/women/page.tsx"), /href: "\/women\/bulkamid-for-stress-incontinence"/);
  assert.match(read("app/women/page.tsx"), /treatmentServiceCards\(\s*"women"/);
  assert.doesNotMatch(read("app/men/[...slug]/page.tsx"), /force-dynamic/);
  assert.doesNotMatch(read("app/women/[...slug]/page.tsx"), /force-dynamic/);
});

test("published public rows are kept and hidden rows are dropped", () => {
  const items = readTreatmentNavItems([
    row({
      title: "Erectile Dysfunction",
      menuLabel: "  ",
      section: "men",
      slug: "erectile-dysfunction",
      cardDescription: ` ${"A".repeat(210)} `,
      sortOrder: 2,
    }),
    row({
      title: "Later link",
      menuLabel: "Later link",
      section: "men",
      slug: "later-link",
      sortOrder: 2,
    }),
    row({
      title: "First link",
      menuLabel: "First link",
      section: "men",
      slug: "first-link",
      sortOrder: 1,
    }),
    row({
      title: "Duplicate",
      menuLabel: "Duplicate label",
      section: "men",
      slug: "erectile-dysfunction",
      sortOrder: 9,
    }),
    row({
      title: "Hidden preview",
      section: "women",
      slug: "form-hidden-preview",
      visibility: "unlisted",
    }),
    row({
      title: "Draft page",
      section: "men",
      slug: "draft-page",
      _id: "drafts.treatment-draft",
    }),
    row({
      title: "Missing visibility",
      section: "women",
      slug: "missing-visibility",
      visibility: "",
    }),
    row({
      title: "Wrong hub",
      section: "women",
      parentPath: "male-sexual-dysfunction",
      slug: "wrong-hub",
    }),
    row({
      title: "Bad slug",
      section: "men",
      slug: "Not A Slug",
    }),
    { visibility: "public", title: "No section" },
    "not-a-row",
  ]);

  assert.deepEqual(
    items.map((item) => item.href),
    ["/men/first-link", "/men/erectile-dysfunction", "/men/later-link"],
  );
  const erectile = items[1];
  assert.equal(erectile.menuLabel, "Erectile Dysfunction");
  assert.equal(erectile.title, "Erectile Dysfunction");
  assert.equal(erectile.cardDescription.length, 200);
  assert.equal(readTreatmentNavItems({ result: [] }).length, 0);
  assert.equal(readTreatmentNavItems(null).length, 0);
});

test("cms links append under the right section without moving hardcoded links", () => {
  const original = shape(NAV_ITEMS_SORTED);
  assert.deepEqual(shape(mergeTreatmentNav(NAV_ITEMS_SORTED, [])), original);
  const items = readTreatmentNavItems([
    row({
      title: "Erectile Dysfunction",
      menuLabel: "Erectile Dysfunction",
      section: "men",
      slug: "erectile-dysfunction",
      cardDescription: "Evaluation and treatment options for erectile dysfunction.",
      sortOrder: 2,
    }),
    row({
      title: "Evening clinic",
      menuLabel: "Evening clinic",
      section: "men",
      slug: "evening-clinic",
      sortOrder: 0,
    }),
    row({
      title: "Erectile dysfunction options",
      menuLabel: "ED options",
      section: "men",
      parentPath: "male-sexual-dysfunction",
      slug: "erectile-dysfunction-options",
      sortOrder: 4,
    }),
    row({
      title: "Spacer follow up",
      menuLabel: "Spacer follow up",
      section: "men",
      parentPath: "prostate-cancer/radiation-treatments",
      slug: "spacer-follow-up",
      sortOrder: 3,
    }),
    row({
      title: "Pelvic floor visit",
      menuLabel: "Pelvic floor visit",
      section: "women",
      slug: "pelvic-floor-visit",
      cardDescription: "A short card.",
      sortOrder: 1,
    }),
    row({
      title: "Pellet follow up",
      menuLabel: "Pellet follow up",
      section: "women",
      parentPath: "hormone-replacement-therapy",
      slug: "pellet-follow-up",
      sortOrder: 0,
    }),
    row({
      title: "Vasectomy",
      menuLabel: "Not the real vasectomy",
      section: "men",
      slug: "vasectomy",
      sortOrder: 0,
    }),
  ]);
  const orphan: TreatmentNavLink = {
    menuLabel: "Missing hub",
    title: "Missing hub",
    cardDescription: "",
    section: "men",
    parentPath: "not-a-hub",
    slug: "missing-hub",
    sortOrder: 0,
    href: "/men/not-a-hub/missing-hub",
  };

  const merged = mergeTreatmentNav(NAV_ITEMS_SORTED, [...items, orphan]);
  assert.deepEqual(shape(NAV_ITEMS_SORTED), original);

  const men = findHref(merged, "/men");
  const women = findHref(merged, "/women");
  assert.ok(men?.children);
  assert.ok(women?.children);
  const originalMen = findHref(NAV_ITEMS_SORTED, "/men");
  const originalWomen = findHref(NAV_ITEMS_SORTED, "/women");
  assert.deepEqual(
    directIdentity(men.children).slice(0, originalMen?.children?.length),
    directIdentity(originalMen?.children),
  );
  assert.deepEqual(
    directIdentity(women.children).slice(0, originalWomen?.children?.length),
    directIdentity(originalWomen?.children),
  );
  assert.deepEqual(men.children.slice(-2).map((item) => item.label), [
    "Evening clinic",
    "Erectile Dysfunction",
  ]);
  assert.equal(
    men.children.filter((item) => item.href === "/men/vasectomy").length,
    1,
  );
  assert.equal(men.children.find((item) => item.href === "/men/vasectomy")?.label, "Vasectomy");

  const sexualHealth = findHref(merged, "/men/male-sexual-dysfunction");
  const originalSexualHealth = findHref(NAV_ITEMS_SORTED, "/men/male-sexual-dysfunction");
  assert.deepEqual(
    sexualHealth?.children?.slice(0, originalSexualHealth?.children?.length),
    originalSexualHealth?.children,
  );
  assert.equal(sexualHealth?.children?.at(-1)?.href, "/men/male-sexual-dysfunction/erectile-dysfunction-options");
  assert.equal(sexualHealth?.children?.at(-1)?.label, "ED options");

  const radiation = findHref(merged, "/men/prostate-cancer/radiation-treatments");
  const originalRadiation = findHref(NAV_ITEMS_SORTED, "/men/prostate-cancer/radiation-treatments");
  assert.equal(originalRadiation?.children?.[0]?.badgeLabel, "New");
  assert.deepEqual(
    radiation?.children?.slice(0, originalRadiation?.children?.length),
    originalRadiation?.children,
  );
  assert.equal(
    radiation?.children?.at(-1)?.href,
    "/men/prostate-cancer/radiation-treatments/spacer-follow-up",
  );

  const hormone = findHref(merged, "/women/hormone-replacement-therapy");
  assert.equal(findHref(NAV_ITEMS_SORTED, "/women/hormone-replacement-therapy")?.children, undefined);
  assert.deepEqual(hormone?.children, [
    {
      label: "Pellet follow up",
      href: "/women/hormone-replacement-therapy/pellet-follow-up",
    },
  ]);
  assert.equal(women.children.at(-1)?.href, "/women/pelvic-floor-visit");
  assert.equal(findHref(merged, "/men/not-a-hub/missing-hub"), undefined);
  assert.equal(findHref(merged, "/men/vasectomy")?.label, "Vasectomy");
});

test("section cards list top-level public pages and the sitemap skips hidden paths", () => {
  const items = readTreatmentNavItems([
    row({
      title: "Erectile Dysfunction",
      section: "men",
      slug: "erectile-dysfunction",
      cardDescription: "Evaluation and treatment options for erectile dysfunction.",
      sortOrder: 2,
    }),
    row({
      title: "Evening clinic",
      section: "men",
      slug: "evening-clinic",
      cardDescription: "An added men's service.",
      sortOrder: 0,
    }),
    row({
      title: "ED options",
      section: "men",
      parentPath: "male-sexual-dysfunction",
      slug: "erectile-dysfunction-options",
      cardDescription: "Should stay under the hub.",
      sortOrder: 0,
    }),
    row({
      title: "Pelvic floor visit",
      section: "women",
      slug: "pelvic-floor-visit",
      cardDescription: "An added women's service.",
      sortOrder: 1,
    }),
    row({
      title: "Hidden preview",
      section: "women",
      slug: "form-hidden-preview",
      visibility: "unlisted",
    }),
    row({
      title: "Vasectomy",
      section: "men",
      slug: "vasectomy",
    }),
  ]);

  assert.deepEqual(
    treatmentServiceCards(
      "men",
      items,
      new Set(["/men/vasectomy"]),
    ),
    [
      {
        title: "Evening clinic",
        href: "/men/evening-clinic",
        description: "An added men's service.",
      },
      {
        title: "Erectile Dysfunction",
        href: "/men/erectile-dysfunction",
        description: "Evaluation and treatment options for erectile dysfunction.",
      },
    ],
  );
  assert.deepEqual(treatmentServiceCards("women", items), [
    {
      title: "Pelvic floor visit",
      href: "/women/pelvic-floor-visit",
      description: "An added women's service.",
    },
  ]);

  const paths = treatmentSitemapPaths(
    items,
    new Set(["/men/vasectomy", "/circumcision-photos"]),
  );
  assert.deepEqual(paths, [
    "/men/male-sexual-dysfunction/erectile-dysfunction-options",
    "/men/evening-clinic",
    "/women/pelvic-floor-visit",
    "/men/erectile-dysfunction",
  ]);
  assert.equal(paths.includes("/women/form-hidden-preview"), false);
  assert.equal(paths.includes("/men/vasectomy"), false);
});

test("a failed nav query returns no links and fixtures stay off the production path", async () => {
  const env = process.env as Record<string, string | undefined>;
  const previousNodeEnv = env.NODE_ENV;
  const previousFixtures = env.TREATMENT_PAGE_FIXTURES;
  const warnings: string[] = [];
  const error = console.error;
  console.error = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "));
  };
  try {
    env.NODE_ENV = "test";
    delete env.TREATMENT_PAGE_FIXTURES;
    let calls = 0;
    const failed = await loadTreatmentNav(async () => {
      calls += 1;
      throw new Error("sanity down");
    });
    assert.deepEqual(failed, []);
    assert.equal(calls, 1);
    assert.match(warnings.join("\n"), /navigation query failed/);

    const loaded = await loadTreatmentNav(async () => [
      row({
        title: "Erectile Dysfunction",
        section: "men",
        slug: "erectile-dysfunction",
        cardDescription: "Evaluation and treatment options for erectile dysfunction.",
      }),
      row({
        title: "Vasectomy",
        section: "men",
        slug: "vasectomy",
      }),
      row({
        title: "Hidden preview",
        section: "women",
        slug: "form-hidden-preview",
        visibility: "unlisted",
      }),
      row({
        title: "Draft page",
        section: "men",
        slug: "draft-page",
        _id: "drafts.treatment-draft",
      }),
    ]);
    assert.deepEqual(
      loaded.map((item) => item.href),
      ["/men/erectile-dysfunction"],
    );

    env.TREATMENT_PAGE_FIXTURES = "1";
    calls = 0;
    const fixtures = await loadTreatmentNav(async () => {
      calls += 1;
      return [];
    });
    assert.equal(calls, 0);
    assert.deepEqual(fixtures, []);

    env.NODE_ENV = "production";
    env.TREATMENT_PAGE_FIXTURES = "1";
    calls = 0;
    const production = await loadTreatmentNav(async () => {
      calls += 1;
      return [
        row({
          title: "Erectile Dysfunction",
          section: "men",
          slug: "erectile-dysfunction",
        }),
      ];
    });
    assert.equal(calls, 1);
    assert.deepEqual(
      production.map((item) => item.href),
      ["/men/erectile-dysfunction"],
    );
  } finally {
    console.error = error;
    if (previousNodeEnv === undefined) delete env.NODE_ENV;
    else env.NODE_ENV = previousNodeEnv;
    if (previousFixtures === undefined) delete env.TREATMENT_PAGE_FIXTURES;
    else env.TREATMENT_PAGE_FIXTURES = previousFixtures;
  }
});
