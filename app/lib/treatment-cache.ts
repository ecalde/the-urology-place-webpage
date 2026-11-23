import { normalizeTreatmentParent, treatmentPublicPath } from "@/app/lib/treatment-pages";
import {
  parentPathError,
  staticTreatmentPathError,
} from "@/studio/schemaTypes/treatmentPage/paths";

/** 24-hour fallback. The route files repeat this number so Next.js can read it statically. */
export const TREATMENT_REVALIDATE_SECONDS = 86400;

export const TREATMENT_PAGE_TAG = "treatment-page";
export const TREATMENT_NAV_TAG = "treatment-nav";

export const TREATMENT_REVALIDATE_TAGS = [TREATMENT_PAGE_TAG, TREATMENT_NAV_TAG] as const;

/**
 * Published treatment pages for one section. Drafts are excluded.
 * A failure must return an empty list from generateStaticParams, not fail the build.
 */
export const TREATMENT_STATIC_PARAMS_QUERY = `*[
  _type == "treatmentPage" &&
  section == $section &&
  !(_id in path("drafts.**"))
]{
  parentPath,
  "slug": slug.current
}`;

export function treatmentPageCacheTag(path: string): string {
  return `${TREATMENT_PAGE_TAG}:${path}`;
}

/**
 * Live API, cached by Next.js. useCdn stays false so a regeneration sees the
 * document that was just published. Ordinary cache hits do not call Sanity.
 */
export function treatmentPageFetchOptions(path: string) {
  return {
    useCdn: false as const,
    next: {
      revalidate: TREATMENT_REVALIDATE_SECONDS,
      tags: [TREATMENT_PAGE_TAG, treatmentPageCacheTag(path)],
    },
  };
}

export function treatmentStaticParamsFetchOptions() {
  return {
    useCdn: false as const,
    next: {
      revalidate: TREATMENT_REVALIDATE_SECONDS,
      tags: [TREATMENT_PAGE_TAG],
    },
  };
}

function slugValue(slug: unknown): string | undefined {
  if (typeof slug === "string") return slug;
  if (slug && typeof slug === "object" && typeof (slug as { current?: unknown }).current === "string") {
    return (slug as { current: string }).current;
  }
  return undefined;
}

function addTreatmentPath(paths: Set<string>, path: string) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 2) return;
  const section = parts[0];
  const segments = parts.slice(1);
  const canonical = treatmentPublicPath({
    section,
    parentPath: segments.length === 1 ? "" : segments.slice(0, -1).join("/"),
    slug: segments[segments.length - 1],
  });
  if (canonical !== path) return;
  paths.add(path);
  if (section === "men" || section === "women") {
    paths.add(`/${section}`);
    if (segments.length >= 2) {
      const parent = segments.slice(0, -1).join("/");
      if (parentPathError(section, parent) === true) {
        paths.add(`/${section}/${parent}`);
      }
    }
  }
}

function collectSnapshot(paths: Set<string>, snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object") return;
  const record = snapshot as Record<string, unknown>;
  if (record.section === "men" || record.section === "women") {
    paths.add(`/${record.section}`);
    const parent = normalizeTreatmentParent(record.parentPath);
    if (parent && parentPathError(record.section, parent) === true) {
      paths.add(`/${record.section}/${parent}`);
    }
  }
  const pagePath = treatmentPublicPath({
    section: record.section,
    parentPath: record.parentPath,
    slug: slugValue(record.slug),
  });
  if (pagePath) addTreatmentPath(paths, pagePath);
  if (!Array.isArray(record.previousPaths)) return;
  for (const item of record.previousPaths) {
    if (typeof item === "string") addTreatmentPath(paths, item);
  }
}

export type TreatmentRevalidatePlan =
  | { action: "ignore" }
  | {
      action: "revalidate";
      paths: string[];
      tags: readonly [typeof TREATMENT_PAGE_TAG, typeof TREATMENT_NAV_TAG];
    };

/**
 * Paths and tags to invalidate after a published treatment document changes.
 * Draft ids and other document types are ignored. The caller still returns 200
 * for those so Sanity does not retry the delivery.
 */
export function planTreatmentRevalidation(body: unknown): TreatmentRevalidatePlan {
  if (!body || typeof body !== "object") return { action: "ignore" };
  const record = body as Record<string, unknown>;
  if (typeof record._id === "string" && record._id.startsWith("drafts.")) {
    return { action: "ignore" };
  }
  if (record._type !== "treatmentPage") return { action: "ignore" };

  const paths = new Set<string>();
  if ("before" in record || "after" in record) {
    collectSnapshot(paths, record.before);
    collectSnapshot(paths, record.after);
  } else {
    collectSnapshot(paths, record);
  }
  paths.add("/sitemap.xml");
  return {
    action: "revalidate",
    paths: [...paths].sort(),
    tags: TREATMENT_REVALIDATE_TAGS,
  };
}

/**
 * Catch-all params for pages that are already published. Rows that collide with
 * a static file are skipped because that file wins and should not be prerendered
 * as a CMS page. An unavailable API is handled by the caller, which returns [].
 */
export function treatmentStaticParamList(
  section: string,
  rows: unknown,
): { slug: string[] }[] {
  if (!Array.isArray(rows)) return [];
  const params: { slug: string[] }[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as { parentPath?: unknown; slug?: unknown };
    const path = treatmentPublicPath({
      section,
      parentPath: record.parentPath,
      slug: slugValue(record.slug),
    });
    if (!path || seen.has(path) || staticTreatmentPathError(path) !== true) continue;
    seen.add(path);
    const segments = path.split("/").filter(Boolean).slice(1);
    if (segments.length === 0) continue;
    params.push({ slug: segments });
  }
  return params;
}
