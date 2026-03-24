import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { VidscripPlaylistCarousel } from "@/app/components/vidscrip-playlist-carousel";
import { RezumFaqAccordion } from "@/app/components/rezum-faq-accordion";
import { REZUM_QUICK_10_VIDEOS, REZUM_QUICK_5_VIDEOS } from "@/app/lib/rezum-vidscrip-playlists";

const IMG = (name: string) => encodeURI(`/images/rezum/${name}`);

const HERO_BG = IMG("photo-1522841147685-ec3230fd52f9-2880w.jpg");
const IMG_CERTIFICATE = IMG("Facebook+(1)-2880w.JPG");
const IMG_DURING_AFTER = IMG("REZ1-1920w.JPG");
const IMG_BAR_CHART = IMG("th-1920w.jpg");
const IMG_CONSULT = IMG("photo-1533025782032-634283c7c7ad-1920w.jpg");

const VIDEO_UROLIFT_VS_REZUM_ID = "FvWgpfFP9_4";
const VIDEO_RESUME_YOUR_LIFE_ID = "WtYBYz5SGjk";

const PATIENT_STORY_VIDEOS = [
  {
    videoId: "_xQYPcbJl9A",
    title: "The Urology Place — Why Choose Rezum or Urolift?",
  },
  {
    videoId: "Yc63SlWJTyI",
    title: "Rezum testimonial from Dr. Kella's patient at 4 weeks post procedure",
  },
  {
    videoId: "Ndo_h8I3o14",
    title: "Rezum testimonial from Dr. Kella's patient at 3 months post procedure",
  },
] as const;

const QUICK_5_PART_TOPICS = [
  "What is Benign Prostatic Hyperplasia (BPH)?",
  "How common is BPH?",
  "Why does he offer Rezūm to his patients?",
  "What results have you seen with other patients who have chosen Rezūm?",
  "How does Rezūm work?",
] as const;

const QUICK_10_PART_TOPICS = [
  "How does Rezūm work?",
  "What is the success rate with Rezūm?",
  "How long will my BPH symptom relief last?",
  "What is the healing process my body will go through?",
  "Will I experience discomfort during or after the Rezūm procedure?",
  "Do I need to stop any current medications prior to the Rezūm procedure?",
  "Will I need to take any new medication before or after my Rezūm procedure?",
  "Will the Rezūm procedure effect my sexual function?",
  "When will I be able to go back to work?",
  "When will I be able to exercise after the Rezūm procedure?",
] as const;

const PANEL = "bg-[#e8edf5]";
const OVERVIEW_BLUE = "bg-[#5c84be]";
const VIDEO_SHELL = "overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200";
const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";

const FEATURE_ITEMS = [
  "Alternative to BPH medications",
  "Noticeable symptom improvement within few weeks",
  "Simple in-office therapy",
  "Preserves sexual and urinary functions",
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

export function RezumPageContent() {
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
          <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Rezum
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/95 md:text-lg">
              Rezum water vapor therapy is a safe and effective in-office option designed to transform
              your BPH treatment experience. Rezum improves your urinary symptoms better than
              medication can, without surgery.
            </p>
            <Link
              href="/men/enlarged-prostate/rezum/contact-us"
              className={`${BTN_PRIMARY} mt-8 inline-block px-6 py-3 text-base`}
            >
              Make Appointment
            </Link>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {FEATURE_ITEMS.map((label) => (
                <li key={label} className="flex flex-col items-center gap-3 text-center">
                  <CheckCircleIcon />
                  <span className="text-[15px] font-semibold leading-snug text-slate-900 md:text-base">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why choose Rezum */}
        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Why choose Rezum?
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                Rezum water vapor treatment is performed in San Antonio by our urologists for enlarged
                prostate. Dr Kella is experienced with over 150 cases of Rezum. The doctor can then
                perform this BPH procedure in the office in a few minutes. Rezum improves urination,
                eliminates the need for BPH medication, and avoids retrograde ejaculation sexual
                side-effects. Using only a few drops of water, Rezum delivers targeted, controlled
                doses of thermal energy in water vapor (or steam) directly to the prostate tissue that
                is causing your BPH symptoms.
              </p>
              <p>
                This treatment significantly improves in BPH symptoms — including urinary frequency,
                irregular flow, urgency, weak stream, straining and getting up at night to urinate.
              </p>
            </div>
          </div>
        </section>

        {/* Certificate + Expert */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-12">
              <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80">
                <Image
                  src={IMG_CERTIFICATE}
                  alt="Boston Scientific Rezūm Center of Excellence designation for Naveen Kella, MD"
                  width={1600}
                  height={837}
                  className="h-auto w-full object-contain"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </div>
              <div className="flex flex-col justify-center rounded-2xl bg-blue-600 px-8 py-10 text-white shadow-md md:px-10">
                <h2 className="text-2xl font-bold md:text-3xl">
                  <span className="border-b-2 border-white/80 pb-1">Expert</span> in Rezum
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-white/95 md:text-base">
                  Dr. Naveen Kella has been honored as a Center of Excellence provider in Rezum due to
                  his extensive experience in this treatment. If you are considering this in-office
                  procedure, it is important to choose a provider who has been recognized for their
                  success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Patient stories */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Patient stories
            </h2>
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
              {PATIENT_STORY_VIDEOS.map((card) => (
                <li key={card.videoId} className="flex flex-col">
                  <YouTubeEmbed videoId={card.videoId} title={card.title} className={VIDEO_SHELL} />
                  <p className="mt-3 text-center text-sm font-semibold leading-snug text-slate-900 md:text-base">
                    {card.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quick 5-Part Overview, how it works, diagrams (matches site reference layout) */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid overflow-hidden rounded-2xl border border-slate-200/80 shadow-md ring-1 ring-slate-200/80 md:grid-cols-2">
              <div className="bg-white p-4 md:p-6">
                <VidscripPlaylistCarousel
                  videos={REZUM_QUICK_5_VIDEOS}
                  label="Quick 5-part Rezūm overview"
                />
              </div>
              <div
                className={`flex flex-col justify-center px-6 py-8 text-white md:px-8 md:py-10 ${OVERVIEW_BLUE}`}
              >
                <h2 className="text-xl font-bold md:text-2xl">Quick 5-Part Overview</h2>
                <p className="mt-3 text-sm font-medium text-white/95">
                  In this short series, Board Certified Urologist, Dr. Naveen Kella will discuss the
                  following:
                </p>
                <ol className="mt-6 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-white/95 md:text-[15px]">
                  {QUICK_5_PART_TOPICS.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <h3 className="text-lg font-bold text-slate-900 md:text-xl">How does Rezum work?</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-800 md:text-base">
                Rezum water vapor therapy works by using a small, controlled burst of thermal energy to
                send sterile steam into the prostate tissue. The steam rushes around the overgrown cells
                in the prostate, then transforms to water. The heat from the steam breaks down cell
                walls, causing the cells to stop functioning and the tissue to shrink.
              </p>
              <h3 className="mt-8 text-lg font-bold text-slate-900 md:text-xl">Is Rezum painful?</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-800 md:text-base">
                Rezum is done in our San Antonio office. Any procedure can provoke anxiety. We take steps
                to minimize any pain and anxiety. For this water based treatment, we perform a prostate
                local block. In addition, we offer nitrous gas and oral medication to make Rezum painless
                as possible.
              </p>
            </div>

            <div className="mt-12">
              <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80">
                <Image
                  src={IMG_DURING_AFTER}
                  alt="Rezūm water vapor therapy: prostate cross-sections showing anatomy and steam delivery"
                  width={1590}
                  height={592}
                  className="h-auto w-full object-contain"
                  sizes="(min-width: 1024px) 960px, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Effectiveness + bar chart | Surgery + consult photo */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm">
                  <Image
                    src={IMG_BAR_CHART}
                    alt="Graphic of rising bars with an upward trend arrow, illustrating sustained improvement"
                    width={248}
                    height={205}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-base font-bold text-slate-900">
                  Excellent 5 year results with Rezum
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Is Rezum Effective?</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  <p>
                    In our experience, patients are very satisfied with their urinary symptoms at 3
                    month follow up. We do have patients who have noted less ejaculate afterwards. This
                    may be due to the fact that there is less tissue as well.
                  </p>
                  <p>
                    The FDA approved therapy has 5 year follow up with excellent results. Dr. Naveen
                    Kella has experience with over 150 Rezum cases in San Antonio.
                  </p>
                  <p>
                    Dr Kella has found most of his patients to be very satisfied with Rezum therapy. In
                    studies, there is an 11 point improvement in symptom scores, even 5 years after the
                    procedure. Only surgery does better.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="md:order-1">
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  How is Rezum different from surgery?
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  Dr Kella performs Rezum in the office. This can save time and significant money.
                  Patients walk out after the procedure. Tissue is not cut. This decreases the chance of
                  sexual side effects such as retrograde ejaculation. You may notice some decrease in
                  ejaculate volume, but it should be less than with surgery. You will need a catheter for
                  at least 72 hours after the procedure. There should be little to no bleeding after the
                  procedure. Rezum results are nearly as good as surgery without some of the side effects
                  and costs.
                </p>
              </div>
              <div className="relative aspect-[1920/1277] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200/80 md:order-2">
                <Image
                  src={IMG_CONSULT}
                  alt="Doctor reviewing health information on a laptop with a patient"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Urolift vs Rezum */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
              <YouTubeEmbed
                videoId={VIDEO_UROLIFT_VS_REZUM_ID}
                title="How Urolift and Rezum compare — Dr. Naveen Kella at The Urology Place"
                className={VIDEO_SHELL}
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  How does Urolift and Rezum compare?
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  Both therapies are FDA-approved. Urolift can be done in the office, but Dr Kella
                  performs to do the procedure with some light sedation in the operating room. Rezum has
                  a small chance of worsening your volume of ejaculate. Urolift should not affect your
                  function at all. Urolift does not eliminate tissue. Rezum will actually eliminate
                  tissue. Urolift has a quick recovery period. Rezum requires a catheter for a few days
                  and some patients may require a few weeks before starting to experience improvement.
                  Dr Kella has done hundreds of each procedure and can help with making your decision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Your Life — testimonial */}
        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-2xl font-bold italic tracking-tight text-slate-900 md:text-3xl">
                  Resume Your Life with{" "}
                  <span className="border-b-2 border-slate-900 pb-0.5 not-italic">Rezum</span>
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  One of our awesome patients shares his personal experience with Rezum and how the
                  procedure helped him get back to his life again.
                </p>
              </div>
              <YouTubeEmbed
                videoId={VIDEO_RESUME_YOUR_LIFE_ID}
                title="Resume your life with Rezum — patient experience at The Urology Place"
                className={VIDEO_SHELL}
              />
            </div>
          </div>
        </section>

        {/* Quick 10-Part Overview (series with Dr. Kella) */}
        <section className="relative border-t border-slate-200 bg-slate-100">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md ring-1 ring-slate-200/80 md:grid-cols-2">
              <div className="border-b border-slate-200/80 bg-white p-4 md:border-b-0 md:border-r md:p-6">
                <VidscripPlaylistCarousel
                  videos={REZUM_QUICK_10_VIDEOS}
                  label="Quick 10-part Rezūm overview"
                />
              </div>
              <div
                className={`flex flex-col justify-center px-6 py-8 text-white md:px-8 md:py-10 ${OVERVIEW_BLUE}`}
              >
                <h2 className="text-xl font-bold md:text-2xl">Quick 10-Part Overview</h2>
                <p className="mt-3 text-sm font-medium text-white/95">
                  In this short series, Board Certified Urologist, Dr. Naveen Kella will discuss the
                  following:
                </p>
                <ol className="mt-6 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-white/95 md:text-[15px]">
                  {QUICK_10_PART_TOPICS.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Compare treatments CTA */}
        <section className="relative border-t border-slate-200 bg-stone-100">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
              Compare{" "}
              <span className="inline-block border-b-2 border-slate-500 pb-0.5">
                Rezum to other
              </span>{" "}
              BPH treatments we offer
            </h2>
            <Link href="/men/enlarged-prostate" className={`${BTN_PRIMARY} mt-8 inline-block uppercase`}>
              Click here
            </Link>
          </div>
        </section>

        {/* FAQ accordion */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <RezumFaqAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
