import Image from "next/image";
import type { ReactNode } from "react";

import { TreatmentCallToAction } from "@/app/components/treatment-page/treatment-call-to-action";
import { TreatmentComparisonTable } from "@/app/components/treatment-page/treatment-comparison-table";
import { TreatmentFaqAccordion } from "@/app/components/treatment-page/treatment-faq-accordion";
import { TreatmentPortableText } from "@/app/components/treatment-page/treatment-portable-text";
import { TreatmentRelated } from "@/app/components/treatment-page/treatment-related";
import { TreatmentTwoColumn } from "@/app/components/treatment-page/treatment-two-column";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { isYouTubeVideoId } from "@/app/lib/treatment-links";
import {
  TREATMENT_BODY_IMAGE_WIDTH,
  treatmentImageFrame,
  treatmentImageUrl,
} from "@/app/lib/treatment-images";
import type { TreatmentBlock } from "@/app/lib/treatment-pages";

function skip(type: string, reason: string) {
  console.warn(`[treatment-page] skipped ${type}: ${reason}`);
  return null;
}

function TreatmentImageBlock({ block }: { block: TreatmentBlock }) {
  const alt = block.image?.alt?.trim();
  const src = treatmentImageUrl(block.image, TREATMENT_BODY_IMAGE_WIDTH);
  if (!src || !alt) return skip("treatmentImage", "missing image or alt text");
  const frame = treatmentImageFrame(block.image ?? {}, TREATMENT_BODY_IMAGE_WIDTH);
  const caption = block.caption?.trim();
  return (
    <figure className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200">
        <Image
          src={src}
          alt={alt}
          width={frame.width}
          height={frame.height}
          className="h-auto w-full object-cover"
          sizes="(min-width: 768px) 48rem, 100vw"
          unoptimized
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-slate-600">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function TreatmentVideoBlock({ block }: { block: TreatmentBlock }) {
  const title = block.title?.trim();
  if (!isYouTubeVideoId(block.videoId) || !title) {
    return skip("treatmentYouTube", "invalid video id or title");
  }
  const caption = block.caption?.trim();
  return (
    <figure className="mx-auto max-w-3xl">
      <YouTubeEmbed
        videoId={block.videoId}
        title={title}
        className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
      />
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-slate-600">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function TreatmentFaqBlock({ block }: { block: TreatmentBlock }) {
  const items = (block.items ?? []).flatMap((item, index) => {
    const question = item.question?.trim();
    if (!question || !Array.isArray(item.answer) || item.answer.length === 0) return [];
    return [
      {
        id: item._key || `question-${index}`,
        question,
        answer: item.answer,
      },
    ];
  });
  if (items.length === 0) return skip("treatmentFaq", "no questions");
  return <TreatmentFaqAccordion items={items} />;
}

function renderTreatmentBlock(block: TreatmentBlock): ReactNode {
  switch (block._type) {
    case "treatmentRichText":
      return <TreatmentPortableText value={block.content} variant="body" />;
    case "treatmentImage":
      return <TreatmentImageBlock block={block} />;
    case "treatmentYouTube":
      return <TreatmentVideoBlock block={block} />;
    case "treatmentFaq":
      return <TreatmentFaqBlock block={block} />;
    case "treatmentComparisonTable":
      return <TreatmentComparisonTable block={block} />;
    case "treatmentCallToAction":
      return <TreatmentCallToAction block={block} />;
    case "treatmentRelated":
      return <TreatmentRelated block={block} />;
    case "treatmentTwoColumn":
      return <TreatmentTwoColumn block={block} />;
    default:
      return skip(block._type || "unknown", "unknown block type");
  }
}

function sectionWidth(type: string | undefined): "prose" | "wide" | "faq" {
  if (type === "treatmentComparisonTable" || type === "treatmentTwoColumn") return "wide";
  if (type === "treatmentFaq") return "faq";
  return "prose";
}

export function TreatmentBlocks({ blocks }: { blocks?: TreatmentBlock[] | null }) {
  return (blocks ?? []).map((block, index) => {
    const content = renderTreatmentBlock(block);
    if (!content) return null;
    const width = sectionWidth(block._type);
    const max =
      width === "wide" ? "max-w-5xl" : width === "faq" ? "max-w-4xl" : "max-w-3xl";
    return (
      <div
        key={block._key || `${block._type || "block"}-${index}`}
        className={`${index === 0 ? "" : "border-t border-slate-200"} ${
          index % 2 === 1 ? "bg-slate-50/90" : "bg-white"
        }`}
      >
        <div className={`mx-auto px-6 py-16 md:py-20 ${max}`}>{content}</div>
      </div>
    );
  });
}
