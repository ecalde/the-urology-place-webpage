import type { Metadata } from "next";
import { CherryFinancingWidget } from "@/app/components/cherry-financing-widget";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "Urology Patient Financing in San Antonio",
  description:
    "Explore flexible payment options for care at The Urology Place with Cherry patient financing.",
};

export default function FinancingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: "url(/images/financing/cherrybannerimage.png)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Patient financing</h1>
          <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
            Flexible payment options through Cherry, so you can focus on your health
          </p>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <CherryFinancingWidget />
        </div>
      </section>
    </div>
  );
}
