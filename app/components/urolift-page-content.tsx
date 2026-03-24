import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY, BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

/** Paths under `public/images/urolift/` (encode spaces and `+` in filenames). */
const IMG = (name: string) => encodeURI(`/images/urolift/${name}`).replace(/\+/g, "%2B");

const HERO_BG = IMG("6fb7ebd5ffbb035f9d29f4938dc2cf5b28cc9775-2880w.jpg");
const DIAGRAM_TOP = IMG("URO1-1920w.JPG");
const DIAGRAM_BOTTOM = IMG("Uro2-1920w.JPG");
const ENDO_BEFORE = IMG("IMG_0751+2-1920w.jpg");
const ENDO_AFTER = IMG("IMG_0752+2-1920w.jpg");

const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";
const PANEL = "bg-[#e8edf5]";
const VIDEO_SHELL = "overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200";

const FEATURE_ITEMS = [
  "Rapid symptom relief",
  "Symptom relief better than reported for medications",
  "Preservation of sexual function",
  "Quick return to normal activity",
] as const;

const VIDEO_CARDS = [
  {
    videoId: "HWvs0oGs1gg",
    title: "Urolift and Rezum Procedures — The Urology Place",
    caption: "Urolift and Rezum Procedures",
  },
  {
    videoId: "NGhKJx18tBs",
    title: "Urolift testimonial — Dr. Kella's patient",
    caption: "Dr. Kella's Urolift patient testimonial",
  },
  {
    videoId: "_xQYPcbJl9A",
    title: "Urolift and Rezum at The Urology Place",
    caption: "Urolift and Rezum at The Urology Place",
  },
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

export function UroliftPageContent() {
  return (
    <div className="relative isolate min-h-screen text-slate-900 -mt-4 md:-mt-6 lg:-mt-8">
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 top-14 z-0 bg-slate-100 sm:top-16"
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          /* `cover` crops/zooms; `contain` shows the full image (letterboxing uses bg-slate-100). */
          backgroundSize: "contain",
          /* Top-align so there is no empty band above the artwork (center was leaving dead space). */
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        <section
          className="relative min-h-[min(40vh,420px)] md:min-h-[min(44vh,500px)]"
          aria-label="UroLift"
        />

        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center md:pb-12 md:pt-14">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
              <span className="block">Urolift for prostate gland enlargement</span>
            </h1>
            <Link
              href="/men/enlarged-prostate/urolift/contact-us"
              className={`${BTN_PRIMARY_LARGE} mt-8 inline-block`}
            >
              Make Appointment
            </Link>
          </div>

          <div className="mx-auto max-w-6xl border-t border-slate-200/80 px-6 py-10 md:py-14">
            <p className="mx-auto max-w-4xl text-center text-[15px] italic leading-relaxed text-slate-800 md:text-lg">
              A proven approach to treating BPH without ongoing medications, heating, cutting or
              removing tissue.
            </p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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

        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Over 500 million men in the world have BPH. You no longer have to be one of them!
            </h2>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              The UroLift System is a treatment that provides rapid and durable relief from the
              bothersome urinary symptoms associated with BPH. Clinically proven to be safe and
              effective, the UroLift System can improve symptoms better than what is reported with
              medication. The UroLift is a BPH treatment that does not remove a part of the prostate.
              UroLift does not negatively impact a man&apos;s sexual function. Dr. Kella performed the
              first UroLift procedure in Texas. He has performed procedures for over 5 years.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              How the UroLift System works
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div className="space-y-6">
                <figure className="overflow-hidden rounded-2xl bg-slate-50 shadow-md ring-1 ring-slate-200/80">
                  <Image
                    src={DIAGRAM_TOP}
                    alt="Medical illustrations: enlarged prostate narrowing the urethra, and the UroLift delivery device in place"
                    width={1920}
                    height={1080}
                    className="h-auto w-full object-contain"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </figure>
                <figure className="overflow-hidden rounded-2xl bg-slate-50 shadow-md ring-1 ring-slate-200/80">
                  <Image
                    src={DIAGRAM_BOTTOM}
                    alt="Medical illustrations: UroLift implants placed in the prostate, and open urethra after device removal"
                    width={1920}
                    height={1080}
                    className="h-auto w-full object-contain"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </figure>
              </div>
              <div className="space-y-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                    How does the UroLift System work?
                  </h3>
                  <p className="mt-3">
                    The doctor places small, permanent implants into the prostate to lift and hold the
                    enlarged tissue out of the way, relieving pressure on the urethra and allowing urine to
                    flow. There is no cutting, heating, or removal of prostate tissue required, which means
                    a minimally invasive, straightforward procedure and less downtime for patients.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                    How soon will I feel better after having the UroLift System treatment?
                  </h3>
                  <p className="mt-3">
                    Patients may experience improvement in their lower urinary tract symptoms as early as two
                    weeks after the procedure.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                    Will having the UroLift System treatment affect my sexual function?
                  </h3>
                  <p className="mt-3">
                    Sexual function has been preserved among the hundreds of patients treated in our
                    clinical studies. This is a unique benefit of the UroLift System treatment compared
                    with other BPH therapies such as TURP, laser, and even medication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <figure className="mx-auto w-full max-w-sm">
                <div className="relative mx-auto aspect-square max-h-[320px] max-w-[320px] overflow-hidden rounded-full bg-slate-900 shadow-lg ring-4 ring-white">
                  <Image
                    src={ENDO_BEFORE}
                    alt="Endoscopic view before UroLift: narrowed passage from enlarged prostate"
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
                <figcaption className="mt-4 text-center text-sm font-semibold text-slate-800">
                  Before Urolift (closed passage)
                </figcaption>
              </figure>
              <div>
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  What is it like having Urolift?
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  <p>
                    Dr. Kella can perform UroLift in the office. However, he prefers to do the
                    procedure under light sedation in the operating room. This allows maximum patient
                    comfort.
                  </p>
                  <p>
                    The procedure sometimes can be done within 10 minutes. Many times, you will not wake
                    up with a catheter, which is a relief for patients. If you can successfully urinate
                    afterwards, you can go home. Dr. Kella will prescribe a medication to help with any
                    urinary burning and an antibiotic to prevent any infection.
                  </p>
                  <p>
                    In 2–3 weeks, you will return for a quick follow up. Patients usually do not need any
                    pain medication. For the first two weeks, you may notice a sensation of heaviness in
                    the pelvic area. This is from the UroLift pulling things open. You also may have some
                    frequency or urgency. You should not have any incontinence.
                  </p>
                  <p>Downtime is minimal. Most patients can return to work right away.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="md:order-1">
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  What are my results with Urolift?
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  <p>
                    Results have been shown to last for at least 5 years. Our patients are usually
                    delighted knowing that they can stop their oral medication, get better results, and
                    avoid some of the sexual side effects with surgery.
                  </p>
                  <p>
                    Finally, UroLift does not prevent you from having any other therapies if necessary in
                    the future. The sutures are very fine and are used in surgery in other areas of the
                    body. In over 150 cases, we have not had any severe adverse events with UroLift.
                  </p>
                </div>
              </div>
              <figure className="mx-auto w-full max-w-sm md:order-2">
                <div className="relative mx-auto aspect-square max-h-[320px] max-w-[320px] overflow-hidden rounded-full bg-slate-900 shadow-lg ring-4 ring-white">
                  <Image
                    src={ENDO_AFTER}
                    alt="Endoscopic view after UroLift: open passage with implants holding tissue"
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
                <figcaption className="mt-4 text-center text-sm font-semibold text-slate-800">
                  After Urolift (open passage)
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <ul className="grid gap-8 md:grid-cols-3">
              {VIDEO_CARDS.map((card) => (
                <li key={card.videoId} className="flex flex-col rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200/90">
                  <YouTubeEmbed videoId={card.videoId} title={card.title} className={VIDEO_SHELL} />
                  <div className="mx-auto mt-4 h-px w-12 bg-slate-300" aria-hidden />
                  <p className="mt-4 text-center text-sm font-bold leading-snug text-slate-900 md:text-base">
                    {card.caption}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-stone-100">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
              Compare{" "}
              <span className="inline-block border-b-2 border-slate-500 pb-0.5">
                Urolift to other
              </span>{" "}
              BPH treatments we offer
            </h2>
            <Link href="/men/enlarged-prostate" className={`${BTN_PRIMARY} mt-8 inline-block uppercase`}>
              Click here
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
