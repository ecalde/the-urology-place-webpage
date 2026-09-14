import Image from "next/image";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { SAN_ANTONIO_MEDICINE_PROSTATE_CANCER_ARTICLE_URL } from "@/app/lib/external-links";

const ARTICLE_IMAGE = "/images/vanquish/vanquishteam.png";

type FeaturedSanAntonioMedicineArticleProps = {
  /** Extra classes on the outer section (e.g. to sit cleanly after a hero). */
  className?: string;
};

export function FeaturedSanAntonioMedicineArticle({
  className = "",
}: FeaturedSanAntonioMedicineArticleProps) {
  return (
    <section className={`relative border-t border-slate-200 bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:gap-10 md:p-10">
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-md ring-1 ring-slate-200/80 md:aspect-[5/4] md:max-w-md">
              <Image
                src={ARTICLE_IMAGE}
                alt="The Urology Place team celebrating the first Vanquish patient treatment"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 28rem, 100vw"
              />
            </div>
            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                Featured in San Antonio Medicine
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Prostate Cancer: Staying Cutting Edge in Bexar County
              </h2>
              <div
                className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 md:mx-0"
                aria-hidden
              />
              <p className="mt-3 text-sm font-medium text-slate-500">
                Bexar County Medical Society · August 2026
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                San Antonio Medicine features Dr. Naveen Kella and The Urology Place on
                new developments in prostate cancer care in Bexar County, aiming for
                cancer control while preserving quality of life for appropriate patients.
              </p>
              <div className="mt-6">
                <a
                  href={SAN_ANTONIO_MEDICINE_PROSTATE_CANCER_ARTICLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block ${BTN_PRIMARY}`}
                >
                  Read the article
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
