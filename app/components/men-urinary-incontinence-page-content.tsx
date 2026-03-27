import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

const HERO_BG = encodeURI(
  "/images/urinary incontinence/photo-1501527022782-000a8cd28122-2880w.jpg",
);

const MARBLE_BG =
  "linear-gradient(145deg, #ffffff 0%, #f4f4f4 42%, #ebebeb 55%, #f6f6f6 100%)";

function FeatureCheckIcon() {
  return (
    <span
      className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-900 shadow-sm"
      aria-hidden
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.25}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

const TYPES = [
  {
    title: "Stress Urinary Incontinence",
    body: "Bladder leakage, or SUI, occurs during exercise, coughing, sneezing, or laughing. It can affect women following childbirth or menopause and men as a side effect of prostate cancer treatment, such as radical prostatectomy.",
  },
  {
    title: "Mixed Incontinence",
    body: "Mixed incontinence may be the most common in this family of disorders and is marked by symptoms of both stress and urgency incontinence. A skilled and experienced urologist can assess a patient's particular combination of symptoms and provide an effective combination of treatments tailored to address those symptoms.",
  },
  {
    title: "Urge Incontinence (Overactive Bladder)",
    body: "Overactive Bladder, or urinary urgency, is characterized by the urgent need to urinate and being unable to get to the bathroom in time. This is typically caused by damage to the nerves that allow the bladder to communicate with the brain, resulting in a sudden bladder contraction that cannot be stopped.",
  },
  {
    title: "Chronic Retention of Urine",
    body: "Chronic retention of urine is characterized by a weak urine stream that stops and starts, straining to urinate, or a feeling that the bladder never empties completely. As the bladder remains full, the patient may experience incontinence, frequent urination, or waking in the night to urinate. This can be caused by an enlarged prostate in men or pelvic organ prolapse in women, as well as diabetes and spinal cord injuries.",
  },
] as const;

export function MenUrinaryIncontinencePageContent() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Hero: fixed backdrop (PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[48vh] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[52vh] md:py-32"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-[0.12em] text-white md:text-4xl lg:text-5xl">
            URINARY INCONTINENCE
          </h1>
        </div>
      </section>

      <section className="relative z-10 rounded-t-3xl border-t border-slate-200 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
        {/* Intro */}
        <div className="border-b border-slate-200 px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center text-[15px] leading-relaxed text-slate-800 md:text-base">
            <p>
              As many as one in six U.S. adults live with this distressing
              condition, causing some to curtail social and work activities or
              even isolate themselves at home. Urinary urgency or incontinence
              is more common among women than men, occurring in 25% to 45% of
              women and 2% to 11% of men. The higher incidence in women is
              explained in part by the physical stress caused by pregnancy and
              childbirth. There are many effective treatments for urinary
              incontinence.
            </p>
          </div>
        </div>

        {/* Treatment options */}
        <div className="border-b border-slate-200 bg-slate-100/90 px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-serif text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Treatment options for Urinary Incontinence
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900 md:text-lg">
                  Lifestyle changes/ Medication:
                </h3>
                <p className="mt-3 text-sm italic text-slate-700 md:text-base">
                  The following lifestyle changes help many patients reduce the
                  occurrence of urinary incontinence:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  <li>Avoid caffeine and large amounts of liquid</li>
                  <li>Strengthen pelvic muscles with Kegel exercises</li>
                  <li>Consider lifelong medication therapy</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900 md:text-lg">
                  Procedures:
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  Botox, Emsella, Interstim and{" "}
                  <Link
                    href="/clinical-research/overactive-bladder"
                    className="font-semibold text-cyan-600 underline decoration-cyan-600/50 underline-offset-2 hover:text-cyan-700"
                  >
                    Revi
                  </Link>{" "}
                  are some options that can significantly improve OAB. Some are
                  permanent. Some need repeated treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Types — marble-inspired panel */}
        <div
          className="border-b border-slate-200 px-6 py-14 md:py-20"
          style={{ background: MARBLE_BG }}
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-left text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Types of Urinary Incontinence:
            </h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:gap-x-14">
              {TYPES.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center"
                >
                  <FeatureCheckIcon />
                  <h3 className="mt-5 text-base font-bold text-slate-900 md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-800 md:text-[15px]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dr. Kella + video */}
        <div className="border-b border-slate-200 bg-white px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
            <div>
              <h2 className="font-serif text-2xl font-bold italic tracking-tight text-slate-900 md:text-3xl">
                A Conversation with Dr. Kella
              </h2>
              <div className="mt-4 h-px w-full max-w-xs bg-slate-900/80" aria-hidden />
              <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
                Board Certified Urologist, Dr. Naveen Kella, discusses the
                benefits behind Emsella for urinary incontinence.
              </p>
              <p className="mt-6 text-base text-slate-800 md:text-lg">
                Learn more about Emsella,{" "}
                <Link
                  href="/women/emsella-for-incontinence"
                  className="font-semibold text-cyan-600 underline decoration-cyan-600/50 underline-offset-2 hover:text-cyan-700"
                >
                  here.
                </Link>
              </p>
            </div>
            <YouTubeEmbed
              videoId="1n7VtgF8PG0"
              title="Dr. Naveen Kella — Emsella for urinary incontinence at The Urology Place"
              className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
            />
          </div>
        </div>

        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Urinary Incontinence"
              serviceName="Urinary Incontinence"
              category="Men"
              sourcePath="/men/urinary-incontinence"
              idPrefix="men-urinary-incontinence"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
