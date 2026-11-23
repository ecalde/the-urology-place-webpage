import type { PortableTextBlock } from "@portabletext/types";

import {
  APPOINTMENT_REASON_OPTIONS,
  getDefaultAppointmentReasonForPage,
  type AppointmentReasonOption,
} from "@/app/lib/contact-form-defaults";
import {
  TREATMENT_PARENTS,
  TREATMENT_SLUG_MAX_LENGTH,
  TREATMENT_SLUG_PATTERN,
  type TreatmentSection,
} from "@/studio/schemaTypes/treatmentPage/constants";

/**
 * Published treatment documents rendered by the Men and Women catch-all routes.
 * Image objects keep the Sanity asset reference so urlFor can build a sized URL.
 */
export type SanityImage = {
  alt?: string | null;
  hotspot?: { x?: number; y?: number; height?: number; width?: number } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
  asset?: { _ref?: string; _type?: string } | null;
  /** Original filename, when the query projects it. Used only to reject clinical share images. */
  sourceName?: string | null;
};

export type TreatmentFaqItem = {
  _key?: string;
  question?: string | null;
  answer?: PortableTextBlock[] | null;
};

export type TreatmentBlock = {
  _key?: string;
  _type?: string;
  content?: PortableTextBlock[] | null;
  text?: PortableTextBlock[] | null;
  image?: SanityImage | null;
  caption?: string | null;
  videoId?: string | null;
  title?: string | null;
  items?: TreatmentFaqItem[] | null;
  columns?: { _key?: string; heading?: string | null }[] | null;
  rows?: { _key?: string; cells?: { _key?: string; text?: string | null }[] | null }[] | null;
  label?: string | null;
  href?: string | null;
  linkKind?: string | null;
  manualPath?: string | null;
  treatment?: {
    _id?: string;
    title?: string | null;
    section?: string | null;
    parentPath?: string | null;
    slug?: string | null;
  } | null;
  media?: string | null;
  teamMember?: {
    _id?: string;
    name?: string | null;
    role?: string | null;
    profileImage?: SanityImage | null;
  } | null;
};

export type TreatmentPage = {
  _id: string;
  title: string;
  slug: string;
  section: TreatmentSection;
  parentPath?: string | null;
  cardDescription?: string | null;
  visibility?: "public" | "unlisted" | string | null;
  hero?: {
    title?: string | null;
    subtitle?: string | null;
    image?: SanityImage | null;
  } | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  shareImage?: SanityImage | null;
  showContactForm?: boolean | null;
  defaultAppointmentReason?: string | null;
  previousPaths?: string[] | null;
  body?: TreatmentBlock[] | null;
};

export type TreatmentQuery = {
  section: string;
  path: string;
};

export type TreatmentLoadResult =
  | { status: "render"; page: TreatmentPage }
  | { status: "redirect"; path: string }
  | { status: "notFound" };

export type TreatmentFetcher = (query: TreatmentQuery) => Promise<unknown>;

const PARENT_CATEGORY_LABEL: Record<
  (typeof TREATMENT_PARENTS)[number]["value"],
  string
> = {
  "prostate-cancer": "Prostate Cancer",
  "prostate-cancer/radiation-treatments": "Prostate Cancer",
  "enlarged-prostate": "Enlarged Prostate",
  "bladder-cancer": "Bladder Cancer",
  "male-sexual-dysfunction": "Male Sexual Dysfunction",
  "hormone-replacement-therapy": "Hormone Replacement Therapy",
};

/**
 * One published document for the requested path, or a document whose previous
 * path matches. Drafts are excluded. The route decides between render, redirect,
 * and notFound so a duplicate cannot win with [0].
 */
export const TREATMENT_PAGE_BY_PATH_QUERY = `*[
  _type == "treatmentPage" &&
  section == $section &&
  !(_id in path("drafts.**")) &&
  (
    select(
      defined(parentPath) && parentPath != "" => "/" + section + "/" + parentPath + "/" + slug.current,
      "/" + section + "/" + slug.current
    ) == $path
    || $path in previousPaths
  )
]{
  _id,
  title,
  "slug": slug.current,
  section,
  parentPath,
  cardDescription,
  visibility,
  seoTitle,
  seoDescription,
  shareImage{
    alt,
    hotspot,
    crop,
    asset,
    "sourceName": asset->originalFilename
  },
  hero{
    title,
    subtitle,
    image{
      alt,
      hotspot,
      crop,
      asset
    }
  },
  showContactForm,
  defaultAppointmentReason,
  previousPaths,
  body[]{
    ...,
    _type == "treatmentImage" => {
      image{
        alt,
        hotspot,
        crop,
        asset
      }
    },
    _type == "treatmentRelated" => {
      treatment->{
        _id,
        title,
        section,
        parentPath,
        "slug": slug.current
      }
    },
    _type == "treatmentTwoColumn" => {
      image{
        alt,
        hotspot,
        crop,
        asset
      },
      teamMember->{
        _id,
        name,
        role,
        profileImage{
          alt,
          hotspot,
          crop,
          asset
        }
      }
    }
  }
}`;

export function isTreatmentSection(value: unknown): value is TreatmentSection {
  return value === "men" || value === "women";
}

export function normalizeTreatmentParent(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/^\/+|\/+$/g, "");
}

export function treatmentPublicPath(page: {
  section?: unknown;
  parentPath?: unknown;
  slug?: unknown;
}): string | null {
  const section = page.section;
  const slug = page.slug;
  if (!isTreatmentSection(section) || typeof slug !== "string") return null;
  if (slug.length > TREATMENT_SLUG_MAX_LENGTH || !TREATMENT_SLUG_PATTERN.test(slug)) {
    return null;
  }
  const parent = normalizeTreatmentParent(page.parentPath);
  if (parent) {
    const allowed = TREATMENT_PARENTS.some(
      (option) => option.section === section && option.value === parent,
    );
    if (!allowed) return null;
  }
  const parts = parent ? [section, parent, slug] : [section, slug];
  return `/${parts.join("/")}`;
}

/**
 * Path from a catch-all request. Rejects segments that cannot be a treatment
 * address so those requests do not call Sanity.
 */
export function treatmentRequestPath(
  section: string,
  segments: string[],
): string | null {
  if (!isTreatmentSection(section)) return null;
  if (segments.length < 1 || segments.length > 3) return null;
  if (
    !segments.every(
      (segment) =>
        segment.length <= TREATMENT_SLUG_MAX_LENGTH &&
        TREATMENT_SLUG_PATTERN.test(segment),
    )
  ) {
    return null;
  }
  const slug = segments[segments.length - 1];
  const parent = segments.length === 1 ? "" : segments.slice(0, -1).join("/");
  return treatmentPublicPath({ section, parentPath: parent, slug });
}

export function treatmentContactCategory(
  section: TreatmentSection,
  parentPath: unknown,
): string {
  const sectionLabel = section === "men" ? "Men" : "Women";
  const parent = normalizeTreatmentParent(parentPath);
  if (!parent) return sectionLabel;
  const hub = PARENT_CATEGORY_LABEL[parent as keyof typeof PARENT_CATEGORY_LABEL];
  if (!hub) return sectionLabel;
  return `${sectionLabel} > ${hub}`;
}

export function treatmentFormIdPrefix(path: string): string {
  const slug = path
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `treatment-${slug}`;
}

export function treatmentLinkLabel(path: string): string {
  const segment = path.split("/").filter(Boolean).pop() ?? path;
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Listed reason, otherwise the existing page-title map, otherwise General Urology.
 * Never returns a string outside APPOINTMENT_REASON_OPTIONS.
 */
export function resolveTreatmentAppointmentReason(
  title: string,
  stored: unknown,
): AppointmentReasonOption {
  if (
    typeof stored === "string" &&
    (APPOINTMENT_REASON_OPTIONS as readonly string[]).includes(stored)
  ) {
    return stored as AppointmentReasonOption;
  }
  return getDefaultAppointmentReasonForPage(title);
}

function previousPathList(page: TreatmentPage): string[] {
  if (!Array.isArray(page.previousPaths)) return [];
  return page.previousPaths.filter(
    (item): item is string =>
      typeof item === "string" && item.startsWith("/") && !/\s/.test(item),
  );
}

function readPages(documents: unknown[]): TreatmentPage[] {
  const pages: TreatmentPage[] = [];
  for (const item of documents) {
    if (!item || typeof item !== "object" || typeof (item as { _id?: unknown })._id !== "string") {
      throw new Error("Treatment page query returned an unexpected result.");
    }
    pages.push(item as TreatmentPage);
  }
  return pages;
}

export function interpretTreatmentMatches(
  requestedPath: string,
  documents: unknown[],
): TreatmentLoadResult {
  const pages = readPages(documents);
  const current = pages.filter((page) => treatmentPublicPath(page) === requestedPath);
  if (current.length > 1) {
    console.error(
      `[treatment-page] duplicate published documents for ${requestedPath}: ${current
        .map((page) => page._id)
        .join(", ")}`,
    );
    return { status: "notFound" };
  }
  if (current.length === 1) {
    const page = current[0];
    if (typeof page.title !== "string" || page.title.trim() === "") {
      return { status: "notFound" };
    }
    return { status: "render", page };
  }

  const previous = pages.filter((page) => {
    const currentPath = treatmentPublicPath(page);
    if (!currentPath || currentPath === requestedPath) return false;
    return previousPathList(page).includes(requestedPath);
  });
  if (previous.length > 1) {
    console.error(
      `[treatment-page] duplicate previous paths for ${requestedPath}: ${previous
        .map((page) => page._id)
        .join(", ")}`,
    );
    return { status: "notFound" };
  }
  if (previous.length === 1) {
    const path = treatmentPublicPath(previous[0]);
    if (!path) return { status: "notFound" };
    return { status: "redirect", path };
  }
  return { status: "notFound" };
}

export async function loadTreatmentPage(
  section: string,
  segments: string[],
  fetchDocuments: TreatmentFetcher,
): Promise<TreatmentLoadResult> {
  const path = treatmentRequestPath(section, segments);
  if (!path) return { status: "notFound" };
  const documents = await fetchDocuments({ section, path });
  if (!Array.isArray(documents)) {
    throw new Error("Treatment page query returned an unexpected result.");
  }
  return interpretTreatmentMatches(path, documents);
}
