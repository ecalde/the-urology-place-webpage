import type { Metadata } from "next";
import { CircumcisionPhotosGate } from "@/app/components/circumcision-photos-gate";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

const HERO_BG = "/images/medical-educational-purpose/Marble+2-2880w.png";

export const metadata: Metadata = {
  title: "Adult Circumcision Photos in San Antonio",
  description:
    "Before and after photographs of adult circumcisions performed at The Urology Place in San Antonio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CircumcisionPhotosPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
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
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>
            <span className="block">Adult Circumcision</span>
            <span className="block">Before and After Photos</span>
          </h1>
          <p className={`mt-6 max-w-3xl leading-relaxed ${HERO_SUBTITLE_ON_IMAGE}`}>
            Adult circumcision photographs published with patient consent for medical
            education only.
          </p>
        </div>
      </section>

      <section
        className={`${HERO_AFTER_SLIDE_BASE} bg-white px-6 py-16 md:py-24 lg:py-28`}
      >
        <CircumcisionPhotosGate />
      </section>
    </main>
  );
}
