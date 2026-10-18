import {
  HERO_AFTER_SLIDE_BASE,
  HERO_IMAGE_SECTION,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { pageMetadata } from "@/app/lib/site-metadata";

const IMG_DIR = "/images/privacy policy hippa";
const HERO_BG = `url(${encodeURI(`${IMG_DIR}/Doctor-with-Patient-scaled.jpg`)})`;

const FEE_ITEMS = [
  {
    label: "Canceled at least 48 business hours in advance",
    fee: "No fee",
  },
  {
    label: "Missed routine office visit",
    fee: "$30",
  },
  {
    label: "Missed procedure",
    fee: "$75",
  },
] as const;

export const metadata = pageMetadata({
  path: "/patient-resources/appointment-policy",
  title: "Appointment Policy in San Antonio",
  description:
    "Missed appointment and late cancellation policy for The Urology Place, including notice requirements and applicable fees.",
});

export default function AppointmentPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: HERO_BG,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Appointment Policy</h1>
        </div>
      </section>

      <section
        className={`${HERO_AFTER_SLIDE_BASE} bg-gradient-to-b from-slate-50 via-white to-slate-50/90`}
      >
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <div className="border-b border-blue-600 pb-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Missed Appointment / No-Show Policy
            </h2>
          </div>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
            <p>
              Our providers reserve appointment times specifically for each
              patient. If you are unable to keep your appointment, please notify
              us at least{" "}
              <strong className="font-semibold text-slate-900">
                48 business hours
              </strong>{" "}
              in advance.
            </p>
            <p>
              This fee is not covered by insurance and is the patient&apos;s
              responsibility.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">
              Fees
            </h3>
            <ul className="mt-4 space-y-3">
              {FEE_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col gap-1 border-b border-slate-200/80 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="text-slate-700">{item.label}</span>
                  <span className="shrink-0 font-semibold text-blue-700">
                    {item.fee}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
            <p>
              After 2–3 no-shows, patients may be required to prepay for future
              appointments or may be subject to dismissal from the practice.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
