import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { HormoneReplacementFaqAccordion } from "@/app/components/hormone-replacement-faq-accordion";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { BTN_PRIMARY } from "@/app/lib/button-styles";

const HERO_BG = encodeURI(
  "/images/hormone replacement therapy/photo-1491582990992-68ec88e070a3-2880w.jpg",
);

const IMG = (file: string) =>
  `/images/hormone replacement therapy/${file}`;

const SYMPTOMS: { label: string; Icon: () => JSX.Element }[] = [
  {
    label: "Fatigue, Low Energy and Brain Fog",
    Icon: IconClipboard,
  },
  { label: "Sleeplessness", Icon: IconBox },
  { label: "Reduced Libido", Icon: IconArrowUp },
  { label: "Aches and Pains, Loss of Muscle", Icon: IconLock },
  { label: "Weight Gain", Icon: IconRocket },
  { label: "Depression, Anxiety or Changes in mood", Icon: IconTarget },
];

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-1.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export default function HormoneReplacementTherapyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: static background + overlay (PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[52vh] flex-col justify-center px-6 py-20 md:min-h-[56vh] md:py-28"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="max-w-2xl text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-[2.75rem]">
              Female Hormone Replacement Therapy
            </h1>
            <p className="mt-3 text-xl font-normal text-white md:text-2xl">
              at The Urology Place
            </p>
            <p className="mt-8 text-sm font-normal italic tracking-[0.2em] text-white md:text-base">
              A NEW BEGINNING
            </p>
          </div>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Intro + symptoms */}
        <div className="bg-[#E5E5E5] px-6 py-14 md:py-16">
          <div className="mx-auto max-w-4xl text-center text-slate-900">
            <p className="text-base font-semibold leading-relaxed md:text-lg">
              Hormones protect and prevent risks of age related diseases. Optimizing your hormones has proven to lessen the likelihood of Osteoporosis, Alzheimer&apos;s, Diabetes, Heart Disease, Impaired Vision and Many Cancers.
            </p>
            <p className="mt-8 text-base font-normal text-slate-800">
              Additionally, hormone therapy treats symptoms of:
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-14 md:py-16">
          <div className="mx-auto max-w-6xl">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {SYMPTOMS.map(({ label, Icon }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <Icon />
                  </span>
                  <span className="pt-1 text-base font-bold leading-snug text-slate-900">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* About San Antonio */}
        <section className="border-t border-slate-200 bg-white px-6 py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Hormone Replacement Therapy San Antonio
          </h2>
          <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200 ring-1 ring-slate-200 shadow-sm lg:aspect-auto lg:min-h-[320px]">
              <Image
                src={IMG("incrediblemarketing27-1920w.jpg")}
                alt="Medical providers collaborating at The Urology Place"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            <div className="space-y-6 text-base font-light italic leading-relaxed text-slate-800">
              <p>
                Research shows that balancing and optimizing your hormones makes you feel happier and younger. At The Urology Place we have Board Certified physicians that can assess your health and after one simple blood test, can restore your vitality!
              </p>
              <p>
                We offer different modalities of treatment all based on your unique needs and goals. Most commonly we recommend Hormone Pellets as they ensure the most effective optimization, assist with symptom relief and give patients the greatest freedom without having to remember to take a medication, cream or injection.
              </p>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="border-t border-slate-200 bg-white px-6 py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Methods of Hormone Replacement Therapy
          </h2>

          <div className="mx-auto mt-14 max-w-6xl space-y-20 md:space-y-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Injections</h3>
                <div className="mt-3 h-px w-12 bg-slate-900" aria-hidden />
                <p className="mt-4 text-sm font-bold text-slate-900">52–156 Injections Per Year</p>
                <p className="text-sm font-bold text-slate-900">1–3 Times per Week</p>
                <p className="mt-5 text-sm font-normal leading-relaxed text-slate-600">
                  Usually inexpensive but also the most painful. Shots are usually given once a week or every two weeks. The levels sharply spike after injection. Levels of testosterone rise above the normal range within the first 48 hours and fall below the normal range in the days prior to the next dose. This supra-physiologic rise and fall can be a matter of concern.
                </p>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 shadow-sm">
                <Image
                  src={IMG("handwithglove.jpg")}
                  alt="Medical professional preparing an injection"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 shadow-sm lg:order-1">
                <Image
                  src={IMG("photo-1535450246895-e8df524fc6bb-1920w.webp")}
                  alt="Applying hormone cream to the skin"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Cream</h3>
                <div className="mt-3 h-px w-12 bg-slate-900" aria-hidden />
                <p className="mt-4 text-sm font-bold text-slate-900">730 Per Year</p>
                <p className="text-sm font-bold text-slate-900">2 Times Daily</p>
                <p className="mt-5 text-sm font-normal leading-relaxed text-slate-600">
                  This is a painless way of applying testosterone. Transdermal testosterone formulations (patches, gels) can have limitations, such as local reactions, poor adhesion, fear of transmission to others, unpleasant odor, and high discontinuation rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pellets + pricing intro */}
        <section className="border-t border-slate-200 bg-white px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Bio-Identical Pellets</h3>
              <p className="mt-3 text-sm font-bold text-slate-900">2–4 Times per year!</p>
              <p className="mt-5 text-sm font-normal leading-relaxed text-slate-700">
                Testosterone pellets are bio-identical. In other words, it is the same type of testosterone as your body makes. Pellets can last for months at a time and have the benefit of holding steady levels. As a result, the erratic swings with other modes of therapy are avoided. The pellets are placed in the physician&apos;s office in a 5–10 minute procedure. The pellets are shaped like large grains of rice and are placed in the upper hips or buttocks. Patients may experience soreness for a couple of days. It is a procedure, so there is a small risk of infection. The procedure itself is usually painless. Pellets are sourced from FDA registered 503B facilities. The sterile pellets are derived from yams, irradiated with E-beams to sterilize, and are in compliance with CGMP, which is the same as large commercial drug manufacturers.
              </p>
              <div className="mt-8">
                <Link
                  href="/patient-resources/new-patient-forms"
                  className={`inline-flex ${BTN_PRIMARY}`}
                >
                  Post-Insertion Instructions
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 shadow-sm">
              <Image
                src={IMG("copyt-1920w.JPG")}
                alt="Bio-identical hormone pellets"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Pricing</h3>
            <p className="mt-6 text-base font-normal leading-relaxed text-slate-700">
              At the Urology Place we offer competitive pricing for Hormone Replacement Therapy. Our providers are experts in Hormone Optimization and offer treatment significantly cheaper than our competitors.
            </p>
          </div>
        </section>

        {/* Video + benefits + cards */}
        <section className="border-t border-slate-200 bg-slate-100/80 px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200/80 lg:grid-cols-2">
              <div className="bg-white p-4 sm:p-6">
                <YouTubeEmbed
                  videoId="HmR8rqVoyd0"
                  title="Bioidentical Pellets—Hormone Replacement Therapy in San Antonio, TX"
                  className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
                />
              </div>
              <div className="flex flex-col justify-center bg-sky-700 px-8 py-10 text-white sm:px-10 md:py-12">
                <h3 className="text-xl font-bold md:text-2xl">Benefits of Pellet Therapy</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/95 md:text-base">
                  Physician&apos;s assistant, Sho Grant, shares information about the benefits behind Bioidentical Pellets. This is a quick treatment that is done in our office that provides long-lasting effects compared to other hormone optimization therapy options.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
                <h4 className="text-lg font-bold text-slate-900">Initial Lab Work</h4>
                <p className="mt-4 text-lg font-semibold text-cyan-600">Call for pricing!</p>
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-500">Usually covered by insurance*</p>
                </div>
              </div>
              <div className="relative flex flex-col rounded-2xl border border-slate-200 bg-white px-6 pb-8 pt-10 text-center shadow-md ring-1 ring-slate-100">
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-emerald-500" aria-hidden />
                <h4 className="text-lg font-bold text-slate-900">Female Pelleting</h4>
                <p className="mt-4 text-2xl font-semibold text-cyan-600">$375.00</p>
                <p className="mt-2 text-sm text-slate-500">Per Treatment (Every 3–4 Months)</p>
                <div className="mt-6 flex-1 border-t border-slate-200 pt-4" />
              </div>
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
                <h4 className="text-lg font-bold text-slate-900">Male Pelleting</h4>
                <p className="mt-4 text-2xl font-semibold text-cyan-600">$575.00</p>
                <p className="mt-2 text-sm text-slate-500">Per Treatment (Every 4–6 Months)</p>
                <div className="mt-6 border-t border-slate-200 pt-4" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — matches Emsella accordion styling */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <HormoneReplacementFaqAccordion />
          </div>
        </div>

        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Hormone Replacement Therapy"
              serviceName="Hormone Replacement Therapy"
              category="Women"
              sourcePath="/women/hormone-replacement-therapy"
              idPrefix="women-hrt"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
