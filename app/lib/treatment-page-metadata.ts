import type { Metadata } from "next";

import { treatmentImageUrl } from "@/app/lib/treatment-images";
import {
  treatmentPublicPath,
  type TreatmentPage,
} from "@/app/lib/treatment-pages";
import { pageMetadata, type ShareImage } from "@/app/lib/site-metadata";

function treatmentShareImage(page: TreatmentPage): ShareImage | null {
  const image = page.shareImage;
  const url = treatmentImageUrl(image, 1200, 630);
  if (!url) return null;
  return {
    url,
    width: 1200,
    height: 630,
    alt: image?.alt?.trim() || undefined,
    sourceName: image?.sourceName?.trim() || undefined,
  };
}

export function treatmentPageMetadata(page: TreatmentPage): Metadata {
  const path = treatmentPublicPath(page) ?? "/";
  const title = page.seoTitle?.trim() || page.title.trim();
  const description =
    page.seoDescription?.trim() ||
    page.cardDescription?.trim() ||
    `${page.title.trim()} at The Urology Place in San Antonio.`;
  return pageMetadata({
    path,
    title,
    description,
    image: treatmentShareImage(page),
    robots: page.visibility === "public" ? undefined : { index: false },
  });
}
