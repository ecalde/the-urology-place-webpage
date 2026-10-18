import type { Metadata } from "next";

export const SITE_NAME = "The Urology Place";
/** Apex domain. www redirects here and must not appear in canonical or Open Graph URLs. */
export const SITE_URL = "https://theurologyplace.com";
/** Root layout title template. Social titles use the same suffix. */
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;
const TITLE_SUFFIX = ` | ${SITE_NAME}`;
export const DEFAULT_TITLE = "Urologist in San Antonio | The Urology Place";
export const DEFAULT_DESCRIPTION =
  "Board-certified urologists in San Antonio for prostate cancer, enlarged prostate, kidney stones, sexual health, and women's urologic care at The Urology Place.";

export const DEFAULT_SHARE_IMAGE = {
  url: "/images/branding/og-share.jpg",
  width: 1200,
  height: 630,
  alt: "The Urology Place clinic in San Antonio",
} as const;

/**
 * Clinical patient photography, including the circumcision gallery.
 * Staff portraits, device graphics, and ordinary editorial images do not match.
 */
const CLINICAL_PATIENT_PHOTO =
  /circumcision|medical-educational|medical\s+educational|before[\s_-]*and[\s_-]*after|before[\s_-]*after|(?:^|[^\w])patient[\s_-]+[a-z0-9]{1,3}(?:[^\w]|$)|clinical[\s_-]*photo/i;

export function isClinicalPatientPhoto(
  ...values: Array<string | null | undefined>
): boolean {
  const raw = values.filter((value): value is string => Boolean(value)).join(" ");
  if (!raw) return false;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  return CLINICAL_PATIENT_PHOTO.test(raw) || CLINICAL_PATIENT_PHOTO.test(decoded);
}

export function canonicalUrl(path: string): string {
  const raw = (path || "/").trim();
  if (!raw || raw === "/") return SITE_URL;

  let pathname = raw;
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith("//")) {
    try {
      const parsed = new URL(raw, SITE_URL);
      const host = parsed.hostname.replace(/^www\./i, "");
      if (parsed.protocol !== "https:" || host !== "theurologyplace.com") {
        return SITE_URL;
      }
      pathname = parsed.pathname;
    } catch {
      return SITE_URL;
    }
  }

  pathname = pathname.split(/[?#]/)[0] ?? "";
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    });
  if (segments.length === 0) return SITE_URL;
  return `${SITE_URL}/${segments.join("/")}`;
}

export type ShareImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Original filename. Checked for clinical photos and omitted from the meta tag. */
  sourceName?: string;
};

export function clinicShareImage(image?: ShareImage | null): {
  url: string;
  width: number;
  height: number;
  alt: string;
} {
  if (
    !image?.url ||
    isClinicalPatientPhoto(image.url, image.alt, image.sourceName)
  ) {
    return { ...DEFAULT_SHARE_IMAGE };
  }
  return {
    url: image.url,
    width: image.width ?? 1200,
    height: image.height ?? 630,
    alt: image.alt?.trim() || DEFAULT_SHARE_IMAGE.alt,
  };
}

type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
  /** Skip the title template when the title already includes the clinic name. */
  absoluteTitle?: boolean;
  image?: ShareImage | null;
  robots?: Metadata["robots"];
  openGraphType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function pageMetadata({
  path,
  title,
  description,
  absoluteTitle = false,
  image,
  robots,
  openGraphType = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Metadata {
  const url = canonicalUrl(path);
  const trimmedTitle = title.trim();
  const alreadyBranded = trimmedTitle
    .toLowerCase()
    .endsWith(TITLE_SUFFIX.toLowerCase());
  const socialTitle = {
    absolute:
      absoluteTitle || alreadyBranded
        ? trimmedTitle
        : `${trimmedTitle}${TITLE_SUFFIX}`,
  };
  const shareImage = clinicShareImage(image);

  const openGraph: Metadata["openGraph"] =
    openGraphType === "article"
      ? {
          type: "article",
          siteName: SITE_NAME,
          locale: "en_US",
          url,
          title: socialTitle,
          description,
          images: [shareImage],
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
        }
      : {
          type: "website",
          siteName: SITE_NAME,
          locale: "en_US",
          url,
          title: socialTitle,
          description,
          images: [shareImage],
        };

  return {
    title:
      absoluteTitle || alreadyBranded ? { absolute: trimmedTitle } : trimmedTitle,
    description,
    alternates: { canonical: url },
    ...(robots ? { robots } : {}),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [shareImage.url],
    },
  };
}
