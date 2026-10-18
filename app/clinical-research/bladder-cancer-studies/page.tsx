import type { Metadata } from "next";
import { ClinicalStudiesList } from "@/app/components/clinical-studies-list";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { BLADDER_CANCER_STUDIES } from "@/app/data/bladder-cancer-studies";
import { BLADDER_CANCER_STUDY_ELIGIBILITY } from "@/app/data/clinical-study-eligibility";

const HERO_BG = encodeURI("/images/bladder cancer/Blog_Post-Bladder_Cancer.webp");

export const metadata: Metadata = {
  title: "Bladder Cancer Clinical Trials in San Antonio",
};

export default function BladderCancerStudiesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Bladder Cancer Studies</h1>
          <p className={`mx-auto mt-6 max-w-3xl leading-relaxed ${HERO_SUBTITLE_ON_IMAGE}`}>
            Join us and participate in the new developments in medicine
          </p>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <ClinicalStudiesList
          studies={BLADDER_CANCER_STUDIES}
          heading="Explore our bladder cancer studies"
          description="Filter by enrollment status to find studies that may be right for you. We value your participation in advancing bladder cancer care."
          filterAriaLabel="Filter bladder cancer studies by status"
          eligibility={BLADDER_CANCER_STUDY_ELIGIBILITY}
        />
      </section>
    </main>
  );
}
