import Image from "next/image";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

const WHEN_TO_SEE_DOCTOR = [
  {
    title: "Visible blood in your urine",
    subtitle: "(pink, red, or brown discoloration)",
    src: "/images/men/blood+in+urine-1000h.jpeg",
    alt: "A urine sample cup showing discolored urine",
  },
  {
    title: "Back or side pain",
    subtitle: "especially if it’s severe or comes with fever or chills",
    src: "/images/men/lower+back+pain-1000h.jpg",
    alt: "Person holding their lower back",
  },
  {
    title: "Sudden changes in urine color",
    subtitle: "with no clear explanation",
    src: "/images/men/urine-colors-new-e1bc7e64-1000h.png",
    alt: "Multiple urine sample tubes showing different colors",
  },
  {
    title: "Burning or discomfort",
    subtitle: "when urinating",
    src: "/images/men/pexels-photo-7991910-1000h.jpeg",
    alt: "Person indicating pelvic discomfort in a restroom setting",
  },
  {
    title: "Repeated urinary tract infections",
    subtitle: "",
    src: "/images/men/uti-2-3a354bbd-1000h.png",
    alt: "Illustration of a bladder",
  },
  {
    title: "Unexplained fatigue, weight loss, or swelling",
    subtitle: "",
    src: "/images/men/UTI-1000h.webp",
    alt: "Person standing on a scale",
  },
] as const;

export function HematuriaPageContent() {
  return (
    <>
      {/* Hero window: fixed background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[42vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage: "url(/images/men/pexels-photo-2280547-2880w.jpeg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            HEMATURIA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 md:text-base">
            Microscopic hematuria is found in up to 21% of adults during routine
            urine testing, and although many cases are benign, around 5% to 10%
            may be linked to a urologic cancer, especially in higher-risk
            individuals.
          </p>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Blue band: What is hematuria? */}
        <section className="bg-[#5c86c5]">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
            <h2 className="text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
              WHAT IS HEMATURIA?
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-white/90 leading-relaxed md:text-base">
              Hematuria refers to the presence of blood in the urine. It can be
              visible to the eye (gross hematuria) or only detected under a
              microscope (microscopic hematuria). While it’s not always a sign
              of a serious condition, hematuria should NEVER be ignored.
            </p>
          </div>
        </section>

        {/* Marble-style info + When should I see the doctor? */}
        <section
          className="border-t border-slate-200"
          style={{
            backgroundImage:
              "radial-gradient(1200px 600px at 10% 20%, rgba(15,23,42,0.06), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(15,23,42,0.05), transparent 55%), linear-gradient(#ffffff, #ffffff)",
          }}
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                POSSIBLE CAUSES OF HEMATURIA
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Hematuria can result from a variety of conditions, including:
              </p>
            </div>

            <ul className="mx-auto mt-6 max-w-xl list-disc space-y-1 pl-6 text-sm text-slate-700 md:text-base">
              <li>Urinary tract infections (UTIs)</li>
              <li>Kidney stones</li>
              <li>Bladder or kidney infections</li>
              <li>Enlarged prostate (in men)</li>
              <li>Vigorous exercise</li>
              <li>Trauma or injury</li>
              <li>Urologic cancers (kidney, bladder, or ureter)</li>
            </ul>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                WHEN SHOULD I SEE THE DOCTOR?
              </h3>
              <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                Even if you aren’t experiencing pain or other symptoms,
                hematuria can be an early sign of a serious issue. Contact a
                healthcare provider if you experience:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {WHEN_TO_SEE_DOCTOR.map((card) => (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 170px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-900">
                      {card.title}
                    </p>
                    {card.subtitle ? (
                      <p className="mt-1 text-[11px] text-slate-600">
                        {card.subtitle}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How is hematuria evaluated at our clinic? */}
        <section
          className="border-t border-slate-200"
          style={{
            backgroundImage:
              "radial-gradient(1200px 600px at 10% 20%, rgba(15,23,42,0.06), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(15,23,42,0.05), transparent 55%), linear-gradient(#ffffff, #ffffff)",
          }}
        >
          <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              HOW IS HEMATURIA EVALUATED AT OUR CLINIC?
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Depending on your age, risk factors, and symptoms, we may
              recommend:
            </p>

            <div className="mx-auto mt-8 max-w-3xl text-left text-slate-700">
              <ul className="space-y-5">
                <li>
                  <p className="font-semibold text-slate-900">
                    Urinalysis and Urine Culture
                  </p>
                  <p className="mt-1 text-sm leading-relaxed md:text-base">
                    To check for infection, inflammation, or abnormal cells.
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-slate-900">Imaging</p>
                  <p className="mt-1 text-sm leading-relaxed md:text-base">
                    An ultrasound, CT scan, or MRI may be used to look at your
                    kidneys, bladder, and urinary tract.
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-slate-900">Cystoscopy</p>
                  <p className="mt-1 text-sm leading-relaxed md:text-base">
                    A quick, in-office procedure using a small camera to look
                    inside the bladder and urethra.
                  </p>
                </li>
              </ul>

              <p className="mt-8 text-sm leading-relaxed md:text-base">
                These tests help us rule out serious causes like stones,
                infections, or even urologic cancers — many of which can be
                silent early on.
              </p>
              <p className="mt-4 text-sm leading-relaxed md:text-base">
                We’ll guide you through each step and tailor the evaluation to
                your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Discover a New Approach */}
        <section className="border-t border-slate-200 bg-blue-100/60">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Discover a New Approach to Hematuria Testing
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
              <div className="text-sm text-slate-700 leading-relaxed md:text-base">
                <p>
                  Urologic cancers — including bladder, kidney, and upper tract
                  cancers — can be difficult to detect in their early stages.
                  One of the most important warning signs is{" "}
                  <span className="font-semibold text-slate-900">hematuria</span>
                  , or blood in the urine.
                </p>
                <p className="mt-4">
                  We’re excited to share a new,{" "}
                  <span className="font-semibold text-slate-900">
                    non-invasive test currently under clinical investigation
                  </span>{" "}
                  that may significantly improve how we evaluate hematuria for
                  signs of these cancers. While the specifics remain
                  confidential due to its clinical trial status, this test has
                  the potential to:
                </p>

                <ul className="mt-5 list-disc space-y-2 pl-6">
                  <li>Detect urologic cancers earlier and more accurately</li>
                  <li>
                    Reduce reliance on invasive procedures like cystoscopy or
                    repeated imaging
                  </li>
                  <li>
                    Offer a faster, more patient-friendly way to investigate
                    blood in the urine
                  </li>
                </ul>

                <p className="mt-6 font-semibold text-slate-900">
                  In this video, Dr. Kella explains how this test fits into the
                  evaluation of hematuria and why it may be a game-changer in
                  detecting urologic cancers
                </p>
              </div>

              <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <YouTubeEmbed
                  videoId="_g_1PlfJ0_M"
                  title="Hematuria testing video"
                  className="overflow-hidden rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export function HematuriaPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HematuriaPageContent />
    </main>
  );
}

