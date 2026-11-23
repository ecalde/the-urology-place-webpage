import { cache } from "react";

import { client } from "@/lib/sanity";
import {
  TREATMENT_STATIC_PARAMS_QUERY,
  treatmentPageFetchOptions,
  treatmentStaticParamList,
  treatmentStaticParamsFetchOptions,
} from "@/app/lib/treatment-cache";
import { matchTreatmentFixtures } from "@/app/lib/treatment-page-fixtures";
import {
  TREATMENT_PAGE_BY_PATH_QUERY,
  loadTreatmentPage,
  type TreatmentPage,
  type TreatmentQuery,
} from "@/app/lib/treatment-pages";
import type { TreatmentSection } from "@/studio/schemaTypes/treatmentPage/constants";

/**
 * Local fixtures are for this machine only. Production ignores the switch,
 * including when the variable is present, so a deploy cannot serve fixture copy.
 */
export function treatmentFixturesEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.NODE_ENV !== "production" && env.TREATMENT_PAGE_FIXTURES === "1";
}

type FetchDeps = {
  enabled?: () => boolean;
  fixtures?: (section: string, path: string) => TreatmentPage[];
  fetchPublished?: (query: TreatmentQuery) => Promise<unknown>;
};

export async function fetchTreatmentDocuments(
  query: TreatmentQuery,
  deps: FetchDeps = {},
): Promise<unknown> {
  const enabled = deps.enabled ?? treatmentFixturesEnabled;
  if (enabled()) {
    const fixtures = deps.fixtures ?? matchTreatmentFixtures;
    return fixtures(query.section, query.path);
  }
  const fetchPublished = deps.fetchPublished ?? fetchPublishedTreatment;
  return fetchPublished(query);
}

/** Cached published-document read. A thrown client error is not turned into an empty list. */
export function publishedTreatmentFetchArgs(params: TreatmentQuery) {
  return [
    TREATMENT_PAGE_BY_PATH_QUERY,
    params,
    treatmentPageFetchOptions(params.path),
  ] as const;
}

export function fetchPublishedTreatment(params: TreatmentQuery) {
  const [query, queryParams, options] = publishedTreatmentFetchArgs(params);
  return client.fetch(query, queryParams, options);
}

async function fetchTreatmentStaticRows(section: string) {
  return client.fetch(
    TREATMENT_STATIC_PARAMS_QUERY,
    { section },
    treatmentStaticParamsFetchOptions(),
  );
}

/**
 * Published paths to prerender. A Sanity failure returns [] so the build still
 * succeeds. That empty list is not a cached 404 for any page.
 */
export async function loadTreatmentStaticParams(
  section: TreatmentSection,
  fetchRows: (section: string) => Promise<unknown> = fetchTreatmentStaticRows,
): Promise<{ slug: string[] }[]> {
  try {
    const rows = await fetchRows(section);
    return treatmentStaticParamList(section, rows);
  } catch (error) {
    console.error(
      `[treatment-page] generateStaticParams failed for ${section}:`,
      error instanceof Error ? error.message : "unknown error",
    );
    return [];
  }
}

/**
 * One published-document read per request. generateMetadata and the page share it.
 * The fetch is cached for 24 hours and tagged. A thrown Sanity error propagates,
 * so a failed regeneration is not stored as a 404.
 */
export const getTreatmentPage = cache(async (section: string, segmentsKey: string) =>
  loadTreatmentPage(section, segmentsKey.split("/").filter(Boolean), (params) =>
    fetchTreatmentDocuments(params),
  ),
);
