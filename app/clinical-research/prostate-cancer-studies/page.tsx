import type { Metadata } from "next";
import { ProstateCancerStudiesList } from "@/app/components/prostate-cancer-studies-list";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "Prostate Cancer Clinical Trials in San Antonio",
};

export default function ProstateCancerStudiesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage:
            "url('/images/prostate%20cancer%20studies/photo-1522308300961-fdb949cac8aa-58602788-2880w.png')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Prostate Cancer Studies</h1>
          <p className={`mx-auto mt-6 max-w-3xl leading-relaxed ${HERO_SUBTITLE_ON_IMAGE}`}>
            Join us and participate in the new developments in medicine
          </p>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <ProstateCancerStudiesList />
      </section>
    </main>
  );
}
