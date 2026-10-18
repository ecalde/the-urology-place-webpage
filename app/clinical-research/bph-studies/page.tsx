import type { Metadata } from "next";
import Image from "next/image";
import { ClinicalStudiesContactSection } from "@/app/components/clinical-studies-contact-section";
import { ClinicalStudiesList } from "@/app/components/clinical-studies-list";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { BPH_STUDIES } from "@/app/data/bph-studies";
import { BPH_STAGE_ILLUSTRATIONS } from "@/app/data/bph-stage-illustrations";
import { BPH_STUDY_ELIGIBILITY } from "@/app/data/clinical-study-eligibility";
import { HERO_IMAGE_SECTION, HERO_TITLE_BPH_TRIALS } from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "BPH Clinical Trials in San Antonio",
};

const HERO_BG = "/images/bph%20studies/pexels-photo-4194857-2880w.jpeg";

const YOUTUBE_VIDEO_ID = "XcDnlQSicfA";
const YOUTUBE_TITLE =
  "Dr. Naveen Kella discusses the MT-08 clinical trial comparing iTind and UroLift";

function bphStageImageSrc(path: string) {
  return encodeURI(path).replace(/\+/g, "%2B");
}

export default function BphStudiesPage() {
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
        <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className={HERO_TITLE_BPH_TRIALS}>
            Benign Prostatic Hyperplasia (BPH) Studies
          </h1>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <ClinicalStudiesList
          studies={BPH_STUDIES}
          heading="Explore our BPH studies"
          description="Filter by enrollment status to find studies that may be right for you. We value your participation in advancing care for enlarged prostate and lower urinary tract symptoms."
          filterAriaLabel="Filter BPH studies by status"
          eligibility={BPH_STUDY_ELIGIBILITY}
          showContactSection={false}
        />

        <div className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Understanding BPH
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                How prostate enlargement progresses
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                Benign prostatic hyperplasia can gradually compress the urethra
                and affect urinary flow. These illustrations show how the
                prostate changes from normal anatomy through progressive stages
                of enlargement.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {BPH_STAGE_ILLUSTRATIONS.map((stage) => (
                <figure
                  key={stage.label}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-sm"
                >
                  <div className="relative aspect-[3/5] w-full bg-slate-900">
                    <Image
                      src={bphStageImageSrc(stage.src)}
                      alt={stage.alt}
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <figcaption className="border-t border-slate-200 bg-white px-3 py-3 text-center text-sm font-semibold text-slate-900">
                    {stage.label}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200">
              <YouTubeEmbed videoId={YOUTUBE_VIDEO_ID} title={YOUTUBE_TITLE} />
            </div>

            <ClinicalStudiesContactSection />
          </div>
        </div>
      </section>
    </main>
  );
}
