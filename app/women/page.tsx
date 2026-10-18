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
  title: "Women's Urology in San Antonio",
  description:
    "Women's urologic and pelvic health care at The Urology Place in San Antonio, including hematuria, Emsella for incontinence, hormone replacement therapy, and kidney stones.",
};

const SERVICES = [
  {
    title: "Hematuria",
    href: "/women/hematuria",
    description:
      "Evaluation when blood is visible in the urine or found on a routine urine test.",
  },
  {
    title: "Emsella for Incontinence",
    href: "/women/emsella-for-incontinence",
    description:
      "A non-invasive treatment that strengthens the pelvic floor to help with urgency, frequency, and bladder leaks.",
  },
  {
    title: "Hormone Replacement Therapy",
    href: "/women/hormone-replacement-therapy",
    description:
      "Hormone evaluation and treatment for symptoms such as fatigue, sleeplessness, reduced libido, and mood changes.",
  },
  {
    title: "Kidney Stones",
    href: "/women/kidney-stones",
    description:
      "Kidney stone treatment and prevention for patients in San Antonio.",
  },
] as const;

export default function WomenPage() {
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
          <h1 className={HERO_TITLE_ON_IMAGE}>Women&apos;s Urologic Care</h1>
          <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
            Urinary, pelvic, and hormone care at The Urology Place in San
            Antonio.
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
            Care for women at The Urology Place
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
            Board-certified urologists at The Urology Place evaluate blood in
            the urine, urinary incontinence, hormone concerns, and kidney
            stones. Choose a topic below to learn how we evaluate and treat it.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Women&apos;s services
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
