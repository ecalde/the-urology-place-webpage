import Image from "next/image";

const HERO_BG =
  "/images/bph%20studies/pexels-photo-4194857-2880w.jpeg";

const BPH_STAGES = [
  {
    label: "Normal",
    src: "/images/bph studies/BPH+Normal-1000h.jpg",
    alt: "Cross-section illustration of a normal prostate and open urethra",
  },
  {
    label: "Stage 1 BPH",
    src: "/images/bph studies/Stage+1+BPH-1000h.jpg",
    alt: "Cross-section illustration of stage 1 benign prostatic hyperplasia",
  },
  {
    label: "Stage 2 BPH",
    src: "/images/bph studies/Stage+2+BPH-1000h.jpg",
    alt: "Cross-section illustration of stage 2 benign prostatic hyperplasia",
  },
  {
    label: "Stage 3 BPH",
    src: "/images/bph studies/Stage+3+BPH-1000h.jpg",
    alt: "Cross-section illustration of stage 3 benign prostatic hyperplasia",
  },
] as const;

const STUDY_SECTIONS = [
  {
    title:
      "A Randomized, International Study to Assess the Safety of iTind Compared to UroLift (MT-08)",
    titleUnderline: true,
    description:
      "Minimally invasive procedures such as UroLift and iTind can relieve lower urinary tract symptoms (LUTS) caused by benign prostatic enlargement. This study compares the safety of iTind with UroLift in patients for whom treatment is appropriate.",
    requirements: [
      "Diagnosis of lower urinary tract symptoms presumed to be secondary to benign prostatic enlargement causing bladder outlet obstruction for which treatment is recommended",
      "Males 50 years of age or older",
      "Screening PSA < 4 ng/mL",
      "Prostate volume up to 75 cc documented by TRUS or MRI",
    ],
    nct: "NCT04757116",
    image: "/images/bph studies/photo-1589447388921-2c2c70d26d0a-2880w.jpg",
    alt: "Walnuts on a green background illustrating prostate size comparison",
  },
  {
    title: "Customized TULSA-PRO Ablation Registry",
    description:
      "Data from patients who have undergone or are undergoing transurethral ultrasound ablation (TULSA) as part of clinical care are entered into this registry to evaluate long-term safety, effectiveness, and quality of life.",
    requirements: [
      "Male",
      ">18 years old",
      "Candidate for TULSA-PRO treatment",
      "Willing and able to sign the Informed Consent Form",
    ],
    nct: "NCT05001477",
    image:
      "/images/prostate cancer studies/Tulsa-Pro-diagram--2880w.png",
    alt: "Diagram of the TULSA-PRO procedure showing ultrasound applicator and thermal ablation of the prostate",
  },
] as const;

export default function BphStudiesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: fixed background; sliding content below (see PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[50vh] flex-col items-center justify-center px-6 py-24"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-sky-100 sm:text-4xl md:text-5xl lg:text-6xl">
            BPH / Enlarged Prostate Clinical Trials
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* BPH progression strip */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {BPH_STAGES.map((stage) => (
                <figure
                  key={stage.label}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-sm"
                >
                  <div className="relative aspect-[3/5] w-full bg-slate-900">
                    <Image
                      src={stage.src}
                      alt={stage.alt}
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <figcaption className="border-t border-slate-200 bg-white px-3 py-3 text-center text-sm font-semibold text-slate-900">
                    {stage.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {STUDY_SECTIONS.map((section, index) => {
          const reverse = index % 2 === 1;
          const titleUnderline =
            "titleUnderline" in section && section.titleUnderline;

          return (
            <section
              key={section.title}
              className={
                index % 2 === 0
                  ? "border-b border-slate-200 bg-slate-50/50"
                  : "border-b border-slate-200 bg-white"
              }
            >
              <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                <div
                  className={`grid grid-cols-1 items-center gap-10 lg:gap-16 ${
                    reverse
                      ? "lg:grid-cols-[1fr_minmax(0,520px)]"
                      : "lg:grid-cols-[minmax(0,520px)_1fr]"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl bg-slate-200 shadow-sm ring-1 ring-slate-200 ${
                      reverse ? "lg:order-2" : ""
                    }`}
                  >
                    <div className="relative aspect-[5/4] w-full">
                      <Image
                        src={section.image}
                        alt={section.alt}
                        fill
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-100 md:p-10 ${
                      reverse ? "lg:order-1" : ""
                    }`}
                  >
                    <h2
                      className={`text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl ${
                        titleUnderline
                          ? "underline decoration-slate-400 underline-offset-4"
                          : ""
                      }`}
                    >
                      {section.title}
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                      {section.description}
                    </p>
                    <div className="mt-6 max-w-2xl">
                      <h3 className="text-lg font-bold tracking-tight text-slate-900">
                        General Requirements
                      </h3>
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700">
                        {section.requirements.map((requirement) => (
                          <li key={requirement}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-8 border-t border-slate-100 pt-6">
                      <a
                        href={`https://clinicaltrials.gov/study/${section.nct}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold tracking-wide text-blue-700 underline decoration-blue-400 underline-offset-2 transition hover:text-blue-800"
                      >
                        {section.nct}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
