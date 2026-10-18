import type { Metadata } from "next";
import { HERO_SUBTITLE_ON_LIGHT, HERO_TITLE_ON_LIGHT } from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "Urology Clinical Trials in San Antonio",
};

export default function ClinicalResearchPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className={HERO_TITLE_ON_LIGHT}>
          Clinical Research
        </h1>
        <p className={`mt-6 max-w-2xl ${HERO_SUBTITLE_ON_LIGHT}`}>
          Placeholder overview for clinical research opportunities and ongoing
          studies available through the clinic.
        </p>
      </section>
    </main>
  );
}

