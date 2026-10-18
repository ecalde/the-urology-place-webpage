import Image from "next/image";
import { HERO_SUBTITLE_ON_LIGHT } from "@/app/lib/hero";
import type { CircumcisionPatientGallery } from "@/app/lib/circumcision-photos";

type Props = {
  galleries: CircumcisionPatientGallery[];
};

const SECTION_HEADING =
  "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl";

/** Shared chrome — identical on every tile. */
const IMAGE_CARD =
  "overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 shadow-md ring-1 ring-slate-200/60 transition-shadow duration-200 hover:shadow-lg";

/**
 * Uniform 1:1 frame for every image: width follows the grid column; height equals width.
 * Intrinsic bitmap dimensions never control layout (`fill` + `object-cover` inside).
 */
const IMAGE_CARD_SQUARE = `${IMAGE_CARD} relative aspect-square w-full min-h-0`;

export function CircumcisionPhotosGallery({ galleries }: Props) {
  if (galleries.length === 0) {
    return (
      <p className="text-center text-slate-600">
        Clinical photo galleries will appear here when images are available.
      </p>
    );
  }

  return (
    <div className="space-y-16 md:space-y-20 lg:space-y-24">
      {galleries.map((gallery) => (
        <section
          key={gallery.letter}
          aria-labelledby={`patient-${gallery.letter}-heading`}
          className="scroll-mt-8"
        >
          <h2 id={`patient-${gallery.letter}-heading`} className={SECTION_HEADING}>
            {gallery.label}
          </h2>
          {gallery.description != null && gallery.description.length > 0 ? (
            <p
              className={`mt-5 max-w-4xl leading-relaxed ${HERO_SUBTITLE_ON_LIGHT}`}
            >
              {gallery.description}
            </p>
          ) : null}
          <ul className="mt-8 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 lg:gap-10 xl:grid-cols-3 xl:gap-10">
            {gallery.imageSrcs.map((src, index) => (
              <li key={src} className={IMAGE_CARD_SQUARE}>
                <Image
                  src={src}
                  alt={`${gallery.label} — clinical photograph ${index + 1} of ${gallery.imageSrcs.length}, shown with consent for medical education`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 50vw, 33vw"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
