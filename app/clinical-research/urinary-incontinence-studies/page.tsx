import type { Metadata } from "next";
import { ClinicalStudiesContactSection } from "@/app/components/clinical-studies-contact-section";
import { ClinicalStudiesList } from "@/app/components/clinical-studies-list";
import { UrinaryIncontinenceStudiesSupplementary } from "@/app/components/urinary-incontinence-studies-supplementary";
import { URINARY_INCONTINENCE_STUDY_ELIGIBILITY } from "@/app/data/clinical-study-eligibility";
import { URINARY_INCONTINENCE_STUDIES } from "@/app/data/urinary-incontinence-studies";
import { HERO_IMAGE_SECTION, HERO_TITLE_ON_IMAGE } from "@/app/lib/hero";

const HERO_BG =
  "/images/overactive%20bladder%20studies/pexels-photo-1705093-2880w.jpeg";

export const metadata: Metadata = {
  title: "Urinary Incontinence Clinical Trials in San Antonio",
};

export default function UrinaryIncontinenceStudiesPage() {
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
        <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Urinary Incontinence Studies</h1>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <ClinicalStudiesList
          studies={URINARY_INCONTINENCE_STUDIES}
          heading="Explore our urinary incontinence studies"
          description="Filter by enrollment status to find studies that may be right for you. We value your participation in advancing care for bladder control and incontinence."
          filterAriaLabel="Filter urinary incontinence studies by status"
          eligibility={URINARY_INCONTINENCE_STUDY_ELIGIBILITY}
          showContactSection={false}
        />

        <UrinaryIncontinenceStudiesSupplementary />

        <div className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
          <ClinicalStudiesContactSection />
        </div>
      </section>
    </main>
  );
}
