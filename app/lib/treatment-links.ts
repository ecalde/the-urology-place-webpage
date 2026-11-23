/**
 * Link and YouTube checks for treatment pages.
 * Keep these in step with studio/schemaTypes/treatmentPage/contentRules.ts.
 * A page cannot publish a javascript: link or a raw video file.
 */

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function isYouTubeVideoId(value: unknown): value is string {
  return typeof value === "string" && YOUTUBE_ID_PATTERN.test(value);
}

/** A site path or an https address. Returns the trimmed href, or null. */
export function safeTreatmentHref(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const href = value.trim();
  if (!href) return null;
  if (href.startsWith("/") && !href.startsWith("//")) {
    if (/[\s\\]/.test(href)) return null;
    return href;
  }
  if (href.startsWith("https://")) {
    try {
      const url = new URL(href);
      if (url.protocol !== "https:") return null;
      return href;
    } catch {
      return null;
    }
  }
  return null;
}
