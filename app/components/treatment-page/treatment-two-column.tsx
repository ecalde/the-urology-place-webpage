import Image from "next/image";

import { TreatmentPortableText } from "@/app/components/treatment-page/treatment-portable-text";
import {
  TREATMENT_BODY_IMAGE_WIDTH,
  treatmentImageFrame,
  treatmentImageUrl,
} from "@/app/lib/treatment-images";
import type { SanityImage, TreatmentBlock } from "@/app/lib/treatment-pages";

function BandImage({ image, alt }: { image: SanityImage; alt: string }) {
  const src = treatmentImageUrl(image, TREATMENT_BODY_IMAGE_WIDTH);
  if (!src) return null;
  const frame = treatmentImageFrame(image, TREATMENT_BODY_IMAGE_WIDTH);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200">
      <Image
        src={src}
        alt={alt}
        width={frame.width}
        height={frame.height}
        className="h-auto w-full object-cover"
        sizes="(min-width: 1024px) 24rem, 100vw"
        unoptimized
      />
    </div>
  );
}

export function TreatmentTwoColumn({ block }: { block: TreatmentBlock }) {
  const hasText = Array.isArray(block.text) && block.text.length > 0;
  const text = hasText ? <TreatmentPortableText value={block.text} variant="body" /> : null;
  let media = null;

  if (block.media === "image") {
    const alt = block.image?.alt?.trim();
    if (block.image?.asset?._ref && alt) {
      media = <BandImage image={block.image} alt={alt} />;
    } else {
      console.warn("[treatment-page] skipped treatmentTwoColumn image: missing alt");
    }
  } else if (block.media === "teamMember") {
    const name = block.teamMember?.name?.trim();
    const portrait = block.teamMember?.profileImage;
    const src = portrait ? treatmentImageUrl(portrait, 800) : null;
    if (!name) {
      console.warn("[treatment-page] skipped treatmentTwoColumn team member: missing name");
    } else {
      const alt = portrait?.alt?.trim() || name;
      media = (
        <figure className="mx-auto max-w-xs">
          {src ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 200px, 40vw"
                unoptimized
              />
            </div>
          ) : null}
          <figcaption className="mt-3 text-center">
            <span className="block text-sm font-semibold text-slate-900">{name}</span>
            {block.teamMember?.role?.trim() ? (
              <span className="mt-0.5 block text-sm text-slate-600">
                {block.teamMember.role.trim()}
              </span>
            ) : null}
          </figcaption>
        </figure>
      );
    }
  } else {
    console.warn("[treatment-page] skipped treatmentTwoColumn: missing media");
  }

  if (!text && !media) return null;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,22rem)] lg:gap-14">
      <div>{text}</div>
      {media}
    </div>
  );
}
