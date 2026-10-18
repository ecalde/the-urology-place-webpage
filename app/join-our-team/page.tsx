import type { Metadata } from "next";
import Image from "next/image";
import {
  HERO_FIXED_BACKDROP,
  HERO_IMAGE_SECTION,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

const HERO_BG = encodeURI("/images/join our team/team-hands-in-middle-white-background.jpg").replace(
  /\+/g,
  "%2B",
);

export const metadata: Metadata = {
  title: "Urology Jobs in San Antonio",
};

export default function JoinOurTeamPage() {
  return (
    <div className="relative isolate min-h-screen text-slate-900">
      <div
        className={HERO_FIXED_BACKDROP}
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        <section className={HERO_IMAGE_SECTION}>
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className={HERO_TITLE_ON_IMAGE}>
              Join Our Team
            </h1>
          </div>
        </section>

        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <p className="text-lg leading-relaxed text-slate-700">
              At The Urology Place, we&apos;re dedicated to expanding access to quality care while putting our
              patients&apos; well-being at the heart of everything we do. We&apos;re looking for passionate, talented
              individuals who share our commitment to improving lives and delivering exceptional healthcare. Join us
              and make a meaningful difference every day.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl space-y-16 px-6 py-16 md:py-20">
            {/* Physician Assistant */}
            <article className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_1.1fr] md:items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src="/images/join our team/Canva+-+Work+Desk+of+a+Doctor-2880w.jpg"
                  alt="Physician workspace with laptop, stethoscope, and desk tools"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Physician Assistant (PA-C)
                </h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Full time or Part time
                </p>
                <p className="mt-4 leading-relaxed text-slate-700">
                  The Urology Place is seeking a dedicated Physician Assistant to join our dynamic and patient-focused
                  team. This position offers flexibility for experienced providers looking for part-time (minimum 3
                  days/week) or full-time opportunities.
                </p>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Responsibilities
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Conduct patient evaluations, follow-ups, and procedure preparation</li>
                  <li>Collaborate with physicians to manage urologic care plans</li>
                  <li>Assist in minor procedures and post-op care</li>
                  <li>Educate patients and support staff on treatment plans</li>
                </ul>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Requirements
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Active PA license in Texas</li>
                  <li>Experience in urology or a related specialty preferred</li>
                  <li>Excellent communication and teamwork skills</li>
                </ul>
              </div>
            </article>

            {/* Family Medicine Physician */}
            <article className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_1.1fr] md:items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src="/images/join our team/medical-appointment-doctor-healthcare-40568-2880w.jpeg"
                  alt="Medical appointment scene with doctor and chart"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Family Medicine Physician – Chronic Care &amp; Wellness
                </h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Full time or Part time
                </p>
                <p className="mt-4 leading-relaxed text-slate-700">
                  We are looking for a Family Medicine Physician with a passion for chronic disease management and
                  preventive care to join our innovative practice. This role focuses on in-office care for a growing
                  panel of patients with long-term wellness needs.
                </p>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Responsibilities
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Manage chronic conditions (e.g., hypertension, diabetes, BPH)</li>
                  <li>Provide preventive health consultations and wellness plans</li>
                  <li>Collaborate with urology providers and the broader care team</li>
                  <li>Build strong patient–provider relationships</li>
                </ul>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Requirements
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Board-certified (or board-eligible) in Family Medicine</li>
                  <li>Texas medical license (or eligibility)</li>
                  <li>Interest in men&apos;s health and long-term care models</li>
                </ul>
              </div>
            </article>

            {/* Digital Marketing / Social Media Specialist */}
            <article className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_1.1fr] md:items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src="/images/join our team/pexels-photo-2694434-2880w.jpeg"
                  alt="Neon social media icon on a building"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Digital Marketing / Social Media Specialist
                </h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Intern, Part-Time, or Full-Time
                </p>
                <p className="mt-4 leading-relaxed text-slate-700">
                  We&apos;re seeking a creative and tech-savvy individual to lead and manage our digital presence. This
                  role is perfect for a marketing student, recent graduate, or professional with a passion for
                  healthcare communication and branding.
                </p>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Responsibilities
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Manage and grow our social media accounts (Instagram, Facebook, etc.)</li>
                  <li>Develop and schedule engaging content (videos, graphics, posts)</li>
                  <li>Assist with website updates and digital ad campaigns</li>
                  <li>Monitor analytics and track engagement</li>
                </ul>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Requirements
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Experience with social media tools and platforms</li>
                  <li>Familiarity with Canva, Adobe Suite, or similar software a plus</li>
                  <li>Excellent writing and communication skills</li>
                  <li>Ability to work independently and bring new ideas to the table</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-slate-700 md:py-20">
            <p className="text-lg leading-relaxed">
              If you&apos;re interested in any of these opportunities, please send your resume to{" "}
              <a
                href="mailto:messages@theupi.com"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                messages@theupi.com
              </a>
              . We look forward to hearing from you! Thank you for considering The Urology Place as your next career
              home.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
