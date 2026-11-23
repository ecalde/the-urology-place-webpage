import { urlFor } from "@/lib/sanity";

import type { SanityImage } from "@/app/lib/treatment-pages";

/** Hero backgrounds stay near 1600px. Body images stay near 1200px. */
export const TREATMENT_HERO_IMAGE_WIDTH = 1600;
export const TREATMENT_BODY_IMAGE_WIDTH = 1200;

export function sanityImageDimensions(
  ref: string | undefined,
): { width: number; height: number } | null {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return null;
  return { width, height };
}

export function treatmentImageFrame(
  image: SanityImage,
  maxWidth: number,
): { width: number; height: number } {
  const dimensions = sanityImageDimensions(image.asset?._ref);
  if (!dimensions) return { width: maxWidth, height: Math.round(maxWidth * 0.66) };
  if (dimensions.width <= maxWidth) return dimensions;
  return {
    width: maxWidth,
    height: Math.max(1, Math.round((dimensions.height * maxWidth) / dimensions.width)),
  };
}

export function treatmentImageUrl(
  image: SanityImage | null | undefined,
  width: number,
  height?: number,
): string | null {
  const ref = image?.asset?._ref;
  if (!ref) return null;
  try {
    let builder = urlFor({
      asset: image.asset,
      hotspot: image.hotspot,
      crop: image.crop,
    }).width(width);
    if (height) builder = builder.height(height).fit("crop");
    return builder.url();
  } catch {
    return null;
  }
}

export function treatmentHeroPosition(image: SanityImage | null | undefined): string {
  const hotspot = image?.hotspot;
  if (typeof hotspot?.x === "number" && typeof hotspot?.y === "number") {
    return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
  }
  return "center";
}
