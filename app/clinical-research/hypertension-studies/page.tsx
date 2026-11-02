import { ClinicalStudiesList } from "@/app/components/clinical-studies-list";
import { HYPERTENSION_STUDY_ELIGIBILITY } from "@/app/data/clinical-study-eligibility";
import { HYPERTENSION_STUDIES } from "@/app/data/hypertension-studies";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { pageMetadata } from "@/app/lib/site-metadata";

const HERO_BG = encodeURI(
  "/images/kidney stones/photo-1512615199361-5c7a110a8d11-2880w.jpg",
);

export const metadata = pageMetadata({
  path: "/clinical-research/hypertension-studies",
  title: "Hypertension Clinical Trials in San Antonio",
  description:
    "High blood pressure clinical trials at The Urology Place in San Antonio for adults whose hypertension stays high despite blood pressure medication.",
});

export default function HypertensionStudiesPage() {
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
          <h1 className={HERO_TITLE_ON_IMAGE}>Hypertension Studies</h1>
          <p className={`mx-auto mt-6 max-w-3xl leading-relaxed ${HERO_SUBTITLE_ON_IMAGE}`}>
            Clinical studies in San Antonio for adults whose high blood pressure
            remains difficult to control
          </p>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <ClinicalStudiesList
          studies={HYPERTENSION_STUDIES}
          heading="Explore our hypertension studies"
          description="Filter by enrollment status to find a study that may be right for you. This research focuses on controlling high blood pressure that stays elevated despite medication."
          filterAriaLabel="Filter hypertension studies by status"
          eligibility={HYPERTENSION_STUDY_ELIGIBILITY}
        />
      </section>
    </main>
  );
}
