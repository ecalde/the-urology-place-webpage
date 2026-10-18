import type { Metadata } from "next";
import { HERO_SUBTITLE_ON_LIGHT, HERO_TITLE_ON_LIGHT } from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "Patient Resources in San Antonio",
};

export default function PatientResourcesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className={HERO_TITLE_ON_LIGHT}>
          Patient Resources
        </h1>
        <p className={`mt-6 max-w-2xl ${HERO_SUBTITLE_ON_LIGHT}`}>
          Placeholder overview for patient resources, including contact
          information, forms, portal access, and more.
        </p>
      </section>
    </main>
  );
}

