import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

const IMG = (name: string) => encodeURI(`/images/itind for enlarged prostate/${name}`);

const HERO_BG = IMG("man-fishing-2880w.jpg");
const IMG_THREE_STEPS = IMG("itind_threesteps-1920w.png");
const IMG_PRODUCT = IMG("iTind_product-1920w.png");

const PANEL = "bg-[#e8edf5]";
const VIDEO_BAND = "bg-slate-700";
const VIDEO_SHELL = "overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200";

/** Intro: what is iTind (Olympus / general overview). */
const VIDEO_INTRO_ID = "LECewPxS4J4";
/** Patient testimonial at The Urology Place. */
const VIDEO_PATIENT_ID = "mRFjHuODI4M";
/** Treatment comparison: iTind vs Rezūm vs UroLift. */
const VIDEO_COMPARE_ID = "zm_VkyujvUQ";

const FEATURE_ITEMS = [
  "No Burning or Cutting",
  "15 Minute Outpatient Procedure",
  "No Permanent Implants",
  "90% of men do not need pain medications post-procedure",
] as const;

const BENEFITS = [
  "Rapid symptom relief",
  "No permanent implant as seen with UroLift",
  "No burning or cutting of the tissue",
  "FDA approved",
  "15 minute outpatient procedure",
  "95% of men do not need a urinary catheter post-procedure",
  "90% of patients do not require pain medications after the procedure",
  "Preserves sexual function—no ejaculatory side effects as seen with some procedures or medications",
  "3 year follow-up shows lasting results",
  "There are no head to head studies showing iTind being superior to Urolift or Rezum. However, iTind has elements that make it a serious option to consider.",
] as const;

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 text-slate-900"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ItindForBphPageContent() {
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
        {/* Hero — title on the right for open sky/water (screenshot layout) */}
        <section className="relative flex min-h-[48vh] flex-col justify-center px-6 py-20 md:min-h-[52vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl justify-end">
            <div className="max-w-xl text-right md:max-w-2xl">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                iTind for Enlarged Prostate (BPH)
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/95 md:text-lg">
                The iTind procedure simply reshapes the anatomy of the prostatic urethra, gently
                creating a wider opening for urine to flow freely.
              </p>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section
          className={`relative border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] rounded-t-3xl`}
        >
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {FEATURE_ITEMS.map((label) => (
                <li key={label} className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <span className="text-[15px] font-semibold leading-snug text-slate-900 md:text-base">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What is iTind + three-step graphic */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What is iTind?
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                The iTind procedure reshapes the anatomy of the prostatic urethra, gently creating a
                wider opening for urine to flow freely, without burning or cutting out tissue, and
                without leaving behind a permanent implant. The treatment is straightforward, does
                not require overnight hospitalization, and has none of the side effects associated with
                prescription medication.
              </p>
              <p>
                The iTind treatment is a simple procedure performed by Dr. Naveen Kella and the
                patient is sent home the same day. During the 5 to 7-day treatment, the iTind slowly
                expands and exerts gentle pressure at three precise points to widen the prostatic
                urethra opening through which urine can now flow. After 5 to 7 days, the device is
                completely removed in our office. Clinical trials have shown that the newly reshaped
                prostate will continue to provide long-lasting relief of BPH symptoms.
              </p>
            </div>
            <div className="relative mt-10 w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80">
              <Image
                src={IMG_THREE_STEPS}
                alt="Three steps of iTind: insertion, implantation period, and removal, widening the prostatic urethra"
                width={738}
                height={285}
                className="h-auto w-full object-contain"
                sizes="(min-width: 1024px) 896px, 100vw"
                priority
              />
            </div>
          </div>
        </section>

        {/* Video + intro copy */}
        <section className={`relative border-t border-slate-200/80 ${VIDEO_BAND}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-stretch gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              <YouTubeEmbed
                videoId={VIDEO_INTRO_ID}
                title="iTind for enlarged prostate treatment — overview"
                className={VIDEO_SHELL}
              />
              <div className="flex flex-col justify-center rounded-2xl bg-slate-600/90 px-6 py-8 text-white md:px-8">
                <h2 className="text-xl font-bold md:text-2xl">What is iTind?</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/95 md:text-base">
                  Check out this short video to learn more about iTind and find out if you are a
                  candidate for the simple outpatient procedure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits + product */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Benefits of iTind
                </h2>
                <ul className="mt-8 list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  {BENEFITS.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="relative mx-auto aspect-[360/285] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80 md:max-w-none">
                <Image
                  src={IMG_PRODUCT}
                  alt="iTind device and logo"
                  fill
                  className="object-contain object-center p-4"
                  sizes="(min-width: 768px) 42vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Patient experience */}
        <section className={`relative border-t border-slate-200/80 ${VIDEO_BAND}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-stretch gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              <div className="flex flex-col justify-center rounded-2xl bg-slate-600/90 px-6 py-8 text-white md:order-1 md:px-8">
                <h2 className="text-xl font-bold md:text-2xl">iTind Patient Experience</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/95 md:text-base">
                  Check out this video of one of our patient&apos;s personal experience with the iTind
                  procedure at The Urology Place with Dr. Naveen Kella.
                </p>
              </div>
              <div className="md:order-2">
                <YouTubeEmbed
                  videoId={VIDEO_PATIENT_ID}
                  title="iTind experience at The Urology Place to treat enlarged prostate (BPH)"
                  className={VIDEO_SHELL}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Comparison video */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
            <YouTubeEmbed
              videoId={VIDEO_COMPARE_ID}
              title="Enlarged prostate treatment options at The Urology Place: iTind vs Rezum vs UroLift"
              className={VIDEO_SHELL}
            />
          </div>
        </section>

        {/* Clinical publication */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              <span className="border-b-2 border-slate-900 pb-1">Clinical Publication</span>
            </h2>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              A 12-month study authored by Dr Bilal Chughtai, from Cornell in NYC, demonstrates that
              iTind provides rapid and sustained improvement in men with BPH, without adversely
              affecting patients&apos; sexual function. You can read an article discussing the
              publication{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/?term=iTind+benign+prostatic+hyperplasia+Chughtai"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>
        </section>

        {/* Compare treatments CTA */}
        <section className="relative border-t border-slate-200 bg-slate-100">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              <span className="border-b-2 border-slate-800 pb-1">
                Compare iTind to other BPH treatments we offer
              </span>
            </h2>
            <Link href="/men/enlarged-prostate" className={`${BTN_PRIMARY} mt-8 inline-block`}>
              Click here
            </Link>
          </div>
        </section>

        {/* Out of town */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold text-sky-800 md:text-3xl">
              <span className="border-b-2 border-sky-500/60 pb-1">Coming from Out of Town?</span>
            </h2>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              We offer various treatments for BPH and we are the first to provide iTind in Texas. We can
              set up a virtual consultation with board certified urologist, Dr. Naveen Kella to
              discuss options as well as coordinate surgery. As the iTind device will need to be removed
              5-7 days later, we will need to see you back in our office at that time. You are welcome
              to travel home after the procedure and return to our office a week later.
            </p>
            <Link
              href="/patient-resources/out-of-town-patients"
              className="mt-8 inline-block rounded-full bg-slate-400 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Learn More Here
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-xl px-6 py-14 text-center md:py-16">
            <p className="text-[15px] text-slate-800">
              Ready to learn whether iTind is right for you?
            </p>
            <Link
              href="/men/enlarged-prostate/itind/contact-us"
              className={`${BTN_PRIMARY} mt-6 inline-block`}
            >
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
