import { cache } from "react";

import { TREATMENT_PAGE_FIXTURES } from "@/app/lib/treatment-page-fixtures";
import {
  publishedTreatmentNavFetchArgs,
  readTreatmentNavItems,
  type TreatmentNavLink,
} from "@/app/lib/treatment-nav";
import type { TreatmentPage } from "@/app/lib/treatment-pages";
import { staticTreatmentPathError } from "@/studio/schemaTypes/treatmentPage/paths";
import { client } from "@/lib/sanity";

function treatmentNavFixturesEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" && process.env.TREATMENT_PAGE_FIXTURES === "1"
  );
}

function fixtureNavRows(pages: readonly TreatmentPage[]) {
  return pages.map((page) => ({
    _id: page._id,
    title: page.title,
    menuLabel: page.title,
    cardDescription: page.cardDescription ?? "",
    section: page.section,
    parentPath: page.parentPath ?? "",
    slug: page.slug,
    sortOrder: 0,
    visibility: page.visibility ?? "unlisted",
  }));
}

function withoutStaticPages(items: readonly TreatmentNavLink[]): TreatmentNavLink[] {
  return items.filter((item) => staticTreatmentPathError(item.href) === true);
}

async function fetchPublishedTreatmentNav() {
  const [query, params, options] = publishedTreatmentNavFetchArgs();
  return client.fetch(query, params, options);
}

/**
 * Public nav links, or an empty list when Sanity cannot be reached.
 * The fetch is cached for 24 hours and tagged treatment-nav. A failure
 * leaves the hardcoded menu in place.
 */
export async function loadTreatmentNav(
  fetchRows: () => Promise<unknown> = fetchPublishedTreatmentNav,
): Promise<TreatmentNavLink[]> {
  try {
    const rows = treatmentNavFixturesEnabled()
      ? fixtureNavRows(TREATMENT_PAGE_FIXTURES)
      : await fetchRows();
    return withoutStaticPages(readTreatmentNavItems(rows));
  } catch (error) {
    console.error(
      "[treatment-nav] navigation query failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return [];
  }
}

/** One nav read per request. Layout, section pages, and the sitemap share it. */
export const getTreatmentNav = cache(loadTreatmentNav);
