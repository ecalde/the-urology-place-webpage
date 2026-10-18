import type { Metadata } from "next";
import Link from "next/link";
import { BTN_MAKE_APPOINTMENT_HERO } from "@/app/lib/button-styles";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "Men's Urology in San Antonio",
  description:
    "Men's urologic care at The Urology Place in San Antonio and Austin, including prostate cancer, enlarged prostate, sexual health, vasectomy, bladder cancer, and kidney stones.",
};

const SERVICES = [
  {
    title: "Men's Wellness",
    href: "/men/mens-wellness",
    description:
      "Sexual function and hormonal optimization with board-certified urologists in San Antonio and Austin.",
  },
  {
    title: "Vasectomy",
    href: "/men/vasectomy",
    description:
      "No-scalpel, no-needle vasectomy in the office, with nitrous oxide available for comfort.",
  },
  {
    title: "Prostate Cancer",
    href: "/men/prostate-cancer",
    description:
      "Robotic prostatectomy, TULSA-PRO, radiation planning, nuclear medicine, Vanquish water vapor therapy, and second opinions.",
  },
  {
    title: "Enlarged Prostate",
    href: "/men/enlarged-prostate",
    description:
      "Symptoms, staging, and treatment for benign prostatic hyperplasia, including iTind, Rezūm, laser treatment, UroLift, and prostatic artery embolization.",
  },
  {
    title: "Bladder Cancer",
    href: "/men/bladder-cancer",
    description:
      "Symptoms, risk factors, and treatment options, including Zusduri, BCG, and en bloc resection.",
  },
  {
    title: "Adult Circumcision",
    href: "/men/adult-circumcision",
    description:
      "In-office adult circumcision with local anesthesia and nitrous oxide. Telemedicine is available for out-of-town patients.",
  },
  {
    title: "Hematuria",
    href: "/men/hematuria",
    description:
      "Evaluation when blood is visible in the urine or found on a routine urine test.",
  },
  {
    title: "Low Testosterone",
    href: "/men/low-testosterone",
    description:
      "Hormone evaluation and treatment for low testosterone, including fatigue, low energy, and reduced libido.",
  },
  {
    title: "Male Sexual Dysfunction",
    href: "/men/male-sexual-dysfunction",
    description:
      "Erectile dysfunction, Peyronie's disease, GAINSWave, and varicocele care in San Antonio and Austin.",
  },
  {
    title: "Urinary Incontinence",
    href: "/men/urinary-incontinence",
    description:
      "Evaluation and treatment for stress, urge, and mixed incontinence, and for chronic urinary retention.",
  },
  {
    title: "Kidney Stones",
    href: "/men/kidney-stones",
    description:
      "Kidney stone treatment and prevention for patients in San Antonio.",
  },
] as const;

export default function MenPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceBuilding.png)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Men&apos;s Urologic Care</h1>
          <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
            Prostate, bladder, kidney, and sexual health care at The Urology
            Place in San Antonio and Austin.
          </p>
          <div className="mt-8">
            <Link
              href="/patient-resources/contact-us"
              className={BTN_MAKE_APPOINTMENT_HERO}
            >
              Make Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className={`${HERO_AFTER_SLIDE_BASE} bg-white`}>
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Care for men at The Urology Place
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
            Board-certified urologists at The Urology Place treat prostate
            cancer, enlarged prostate, bladder cancer, kidney stones, urinary
            symptoms, and men&apos;s sexual and hormonal health. Choose a topic
            below to learn how we evaluate and treat it.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Men&apos;s services
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                    {service.description}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-blue-600">
                    Learn more
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
