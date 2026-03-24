import Image from "next/image";
import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";
import { TulsaForProstateFaqAccordion } from "@/app/components/tulsa-for-prostate-faq-accordion";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

const HERO_BG = encodeURI("/images/tulsa for prostate/IMG-3622-2880w.jpg");

const TULSA_DIAGRAM = encodeURI("/images/tulsa for prostate/tulsa-2880w.jpg");

/** Local TULSA-PRO procedure animation (public folder; spaces encoded). */
const TULSA_HOW_IT_WORKS_MP4 = encodeURI(
  "/images/tulsa for prostate/TULSA-PRO prostate cancer treatment.mp4",
);

const PANEL_BLUE = "bg-[#e8edf5]";
const VIDEO_BAND = "bg-[#e6ebf5]";

const VIDEO_SHELL = "overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200";

const CONTENT_CARD =
  "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/60 md:p-8";

function FeatureIconMonitor() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M8 20h8" strokeLinecap="round" />
      <path d="M12 16v4" strokeLinecap="round" />
    </svg>
  );
}

function FeatureIconAtom() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-60 12 12)" />
    </svg>
  );
}

function FeatureIconFeedback() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 14c2-4 6-6 8-6s6 2 8 6" strokeLinecap="round" />
      <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "MRI Guided",
    body: "Customized treatment plan with real time imaging",
    icon: FeatureIconMonitor,
  },
  {
    title: "Tissue Ablation",
    body:
      "Directional thermal ultrasound to remove harmful tissues with continuous rotation without incisions",
    icon: FeatureIconAtom,
  },
  {
    title: "Closed-loop Feedback",
    body:
      "Temperature controlled feedback to make the procedure as comfortable and precise as possible",
    icon: FeatureIconFeedback,
  },
] as const;

export function TulsaForProstatePageContent() {
  return (
    <div className="relative isolate min-h-screen text-slate-900 -mt-4 md:-mt-6 lg:-mt-8">
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 top-14 z-0 md:top-[4.5rem]"
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative flex min-h-[48vh] flex-col items-center justify-center px-6 py-20 md:min-h-[52vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              TULSA-PRO
            </h1>
            <div className="mx-auto mt-6 h-px w-16 bg-white/90" aria-hidden />
            <p className="mt-6 text-base font-semibold uppercase italic leading-snug tracking-wide text-white md:text-lg lg:text-xl">
              TRANSURETHRAL ULTRASOUND ABLATION FOR PROSTATE CANCER AND ENLARGED PROSTATE
            </p>
            <p className="mt-4 text-base text-white md:text-lg">in San Antonio, Texas</p>
          </div>
        </section>

        {/* Features — sliding panel over fixed hero (PROJECT_RULES.md) */}
        <section
          className={`relative border-t border-slate-200/80 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] ${PANEL_BLUE} rounded-t-3xl`}
        >
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
            <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex flex-col items-center text-center">
                  <span
                    className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-slate-900 text-slate-900"
                    aria-hidden
                  >
                    <f.icon />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-slate-900 md:text-xl">{f.title}</h2>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-800 md:text-base">
                    {f.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA + What is TULSA + Why Choose */}
        <section className={`relative border-t border-slate-200/80 ${PANEL_BLUE}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="flex justify-center">
              <span
                className={`${BTN_PRIMARY_LARGE} inline-block cursor-default select-none`}
                aria-hidden
              >
                Ready to make an appointment?
              </span>
            </div>

            <div className="mt-16 grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80">
                <Image
                  src={TULSA_DIAGRAM}
                  alt="Diagram of the TULSA procedure: transurethral applicator, prostate, bladder, heating pattern, and endorectal cooling device"
                  fill
                  className="object-contain object-center p-3 sm:p-5"
                  sizes="(min-width: 768px) 42vw, 100vw"
                  priority
                />
              </div>
              <div className={CONTENT_CARD}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  What is TULSA?
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  TULSA-Pro is an MRI-guided and minimally-invasive procedure used to target and ablate
                  cancerous tissues of the prostate. This is a great option to precisely eliminate
                  harmful tissues without disrupting nearby organs. This procedure is done under general
                  anesthesia and can be completed in less than an hour. One major benefit to this
                  outpatient procedure is that there is minimal to no pain which leads to a speedy
                  recovery.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-16 max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Why Choose TULSA?
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-slate-700 md:text-base">
                One of the major benefits of this procedure is that we are able to protect surrounding tissues
                of the urethra and rectum as well as preserve function. As this is a minimally invasive
                procedure, the recovery time as well as the risk of impotence and incontinence are reduced.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                We use a device known as an ultrasound applicator that is guided through the urethra and into
                the prostate. The function of this device is to emit heat and break down cancerous cells.
                Throughout the procedure, we use an endorectal cooling device to protect nearby tissues from
                the ultrasound waves and preserve function.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                This procedure is customized as we use live MRI imaging to pinpoint the exact location of
                cancerous tissues. We are able to control the direction and strength of the sound waves to
                efficiently ablate harmful tissues and visually confirm that the cancerous cells are no longer
                present.
              </p>
            </div>
          </div>
        </section>

        {/* A New Treatment + How TULSA-PRO works — alternating */}
        <section className={`relative border-t border-slate-200/80 ${VIDEO_BAND}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
              <YouTubeEmbed
                videoId="NR_y1L0hfbg"
                title="Dr. Naveen Kella discusses TULSA-Pro prostate cancer treatment"
                className={VIDEO_SHELL}
              />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                  A New Treatment for Prostate Cancer
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  Check out this short video from board certified urologist, Dr. Naveen Kella discussing the new
                  prostate cancer treatment, TULSA-Pro.
                </p>
              </div>
            </div>

            <div className="mt-16 grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
              <div className={`md:order-2 ${VIDEO_SHELL} bg-black`}>
                <video
                  className="aspect-video w-full"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="TULSA-PRO procedure animation"
                >
                  <source src={TULSA_HOW_IT_WORKS_MP4} type="video/mp4" />
                </video>
              </div>
              <div className="md:order-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                  How TULSA-PRO works
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  Watch this short video depicting a live action of the TULSA procedure from beginning to end.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TULSA Experience */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
              <YouTubeEmbed
                videoId="usMHefr0O_k"
                title="Patient experience with TULSA-PRO at The Urology Place"
                className={VIDEO_SHELL}
              />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">TULSA Experience</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  Check out this short video of one of our first patients discussing his experience with
                  TULSA-PRO.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Publications */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              TULSA Publications
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col items-center border border-slate-200/90 bg-[#e8edf5] px-6 py-10 text-center shadow-sm">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900 text-slate-900"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-900 md:text-base">
                  FDA APPROVAL
                </h3>
                <span
                  className="mt-6 inline-block cursor-default select-none rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-violet-800 shadow-sm"
                  aria-hidden
                >
                  CLICK HERE
                </span>
              </div>
              <div className="flex flex-col items-center border border-slate-200/90 bg-[#e8edf5] px-6 py-10 text-center shadow-sm">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900 text-slate-900"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 4h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    <circle cx="10" cy="10" r="2" />
                    <path d="M14 14l4 4" strokeLinecap="round" />
                  </svg>
                </span>
                <h3 className="mt-5 text-sm font-bold uppercase leading-snug tracking-wide text-slate-900 md:text-base">
                  PROSTATE CANCER LOCALIZATION STUDY WITH TULSA
                </h3>
                <span
                  className="mt-6 inline-block cursor-default select-none rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-violet-800 shadow-sm"
                  aria-hidden
                >
                  CLICK HERE
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Coming from out of town */}
        <section className={`relative border-t border-slate-200 ${PANEL_BLUE}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold text-sky-800 md:text-3xl">Coming from Out of Town?</h2>
            <div className="mx-auto mt-4 h-px w-12 bg-sky-500/50" aria-hidden />
            <p className="mt-6 text-[15px] leading-relaxed text-slate-800 md:text-base">
              Board certified urologist, Dr. Naveen Kella is one of the nation&apos;s top prostate cancer
              surgeons. We have many patients from all over the country come to our office to see Dr. Kella
              given his experience. We can set up a virtual consultation to discuss options as well as
              coordinate surgery. After the surgery, you will be able to travel home the next day and you will
              follow-up with a local urologist to remove the catheter.
            </p>
            <span
              className="mt-8 inline-block cursor-default select-none rounded-full bg-slate-500 px-6 py-3 text-base font-semibold text-white shadow-sm"
              aria-hidden
            >
              Learn More Here
            </span>
          </div>
        </section>

        {/* FAQ — same pattern as Emsella for Incontinence */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <TulsaForProstateFaqAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
