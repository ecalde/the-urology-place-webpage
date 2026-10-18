import type { Metadata } from "next";
import { ClinicalStudiesList } from "@/app/components/clinical-studies-list";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { RENAL_STUDY_ELIGIBILITY } from "@/app/data/clinical-study-eligibility";
import { RENAL_STUDIES } from "@/app/data/renal-studies";

const HERO_BG = encodeURI(
  "/images/kidney stones/photo-1512615199361-5c7a110a8d11-2880w.jpg",
);

export const metadata: Metadata = {
  title: "Kidney Clinical Trials in San Antonio",
};

export default function RenalStudiesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Renal Studies</h1>
          <p className={`mx-auto mt-6 max-w-3xl leading-relaxed ${HERO_SUBTITLE_ON_IMAGE}`}>
            Join us and participate in the new developments in medicine
          </p>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <ClinicalStudiesList
          studies={RENAL_STUDIES}
          heading="Explore our renal studies"
          description="Filter by enrollment status to find studies that may be right for you. We value your participation in advancing care for kidney-related conditions."
          filterAriaLabel="Filter renal studies by status"
          eligibility={RENAL_STUDY_ELIGIBILITY}
        />
      </section>
    </main>
  );
}
