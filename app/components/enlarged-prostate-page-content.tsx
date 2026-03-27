import Image from "next/image";
import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { EnlargedProstateFaqAccordion } from "@/app/components/enlarged-prostate-faq-accordion";
import { BPH_STAGE_ILLUSTRATIONS } from "@/app/data/bph-stage-illustrations";

const IMG = (name: string) => encodeURI(`/images/enlarged prostate/${name}`).replace(/\+/g, "%2B");

const HERO_BG = IMG("sunset.jpg");

const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";

const TREATMENT_OPTION_CARDS = [
  {
    label: "iTind",
    href: "/men/enlarged-prostate/itind",
    imageSrc: IMG("itind-card.png"),
    imageAlt: "iTind device for BPH",
  },
  {
    label: "UroLift",
    href: "/men/enlarged-prostate/urolift",
    imageSrc: IMG("urolift-73af3e07.png"),
    imageAlt: "UroLift implants holding the prostate lobes apart",
  },
  {
    label: "Rezum",
    href: "/men/enlarged-prostate/rezum",
    imageSrc: IMG("rezum-card.jpg"),
    imageAlt: "Water vapor therapy for BPH",
  },
  {
    label: "Laser Surgery",
    href: "/men/enlarged-prostate/laser-treatment",
    imageSrc: IMG("OR+PICTURE-2880w.JPG"),
    imageAlt: "Laser surgery for enlarged prostate",
  },
  {
    label: "TULSA",
    href: "/men/prostate-cancer/tulsa-for-prostate",
    imageSrc: IMG("tulsa-card.jpg"),
    imageAlt: "TULSA procedure diagram",
  },
  {
    label: "Lifestyle Changes and Medication",
    href: "#contact-enlarged-prostate",
    imageSrc: IMG("photo-1606940743881-b33f4b04d661.jpg"),
    imageAlt: "Medication and lifestyle for BPH",
  },
] as const;

const COMPARISON_CHART_IMAGE = IMG("Blue+and+Black+Comparison+Chart+Presentation-1920w.png");

function bphStudyImageSrc(path: string) {
  return encodeURI(path).replace(/\+/g, "%2B");
}

export function EnlargedProstatePageContent() {
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
        <section className="relative flex min-h-[min(52vh,520px)] flex-col items-center justify-center px-6 py-20 md:min-h-[56vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              ENLARGED PROSTATE
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/95 md:text-lg">
            60% of men over sixty and 80% of men over eighty years of age have been 
            diagnosed with Benign Prostate Hyperplasia (BPH)
            </p>
          </div>
        </section>

        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What is an Enlarged Prostate?
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-700 md:text-lg">
            Benign prostatic hyperplasia (BPH), often referred to simply as enlarged prostate, is called such 
            because it occurs when the prostate gland in the male sexual organ enlarges. This growth in and of 
            itself is completely harmless, or benign. Further, it’s both natural and normal. 
            Every man’s prostate grows as he ages because of changes in hormone balance and cell growth. 
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
            There are two things we watch out for as your prostate grows with age. The first is prostate cancer. 
            The second is whether or not, or “when”, its sheer size causes it to get in the way of other systems. 
            We say “when” because for most men, their prostate eventually gets in the way of their urinary tract. 
            Over 50% of men over the age of 75 experience uncomfortable urinary symptoms from an enlarged prostate, 
            and in many men the symptoms begin to occur at a much younger age. So just as most of us eventually 
            need glasses if we’re lucky enough to live a relatively long life, and many of us need surgery on our 
            knees, or hips or joints at some point, so too do most of us (men) need a little prostate tune-up at 
            some point.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Stages of BPH
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-slate-700 md:text-lg">
            As your prostate grows over time, it begins to put pressure on your urethra, impeding and eventually 
            cutting off your ability to urinate with ease. The images below depict this change over time.
            </p>
            <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {BPH_STAGE_ILLUSTRATIONS.map((stage) => (
                <li key={stage.label}>
                  <figure className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-sm">
                    <div className="relative aspect-[3/5] w-full bg-slate-900">
                      <Image
                        src={bphStudyImageSrc(stage.src)}
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
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Symptoms and Signs of BPH
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
            As your prostate grows bigger over time, it eventually begins to press on the urethra. 
            This is typically when the first symptoms of BPH begin, usually in the form of urination difficulties.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
            Men with a more advanced, or severe case, may also experience one or more of the following signs:
            </p>
            <ul className="mx-auto mt-8 max-w-xl list-disc space-y-2 pl-5 text-left text-base leading-relaxed text-slate-800 md:text-lg">
              <li>Dribbling at the end of urination</li>
              <li>Straining to urinate</li>
              <li>Being unable to control urination</li>
              <li>Having strong and sudden urges to urinate two to three times a night</li>
              <li>Having a weak urine flow</li>
              <li>Bleeding while urinating</li>
              <li>Not being able to urinate at all</li>
            </ul>
            <p className="mt-10 text-base font-bold leading-relaxed text-slate-900 md:text-lg">
            Uncomfortable urinary symptoms can be treated in a number of ways depending on the severity of your condition.
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {TREATMENT_OPTION_CARDS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group block h-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-100">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        className="object-cover transition group-hover:opacity-95"
                        sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      />
                    </div>
                    <div className="border-t border-slate-200 px-3 py-4">
                      <span className="text-sm font-bold leading-snug text-slate-900 md:text-[15px]">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <figure className="mx-auto w-full max-w-5xl">
              <Image
                src={COMPARISON_CHART_IMAGE}
                alt="Comparison chart of BPH treatment options: iTind, Rezūm, UroLift, and Thulium laser TURP"
                width={1477}
                height={1967}
                className="h-auto w-full rounded-lg shadow-sm ring-1 ring-slate-200/80"
                sizes="(min-width: 1024px) 960px, 100vw"
                priority={false}
              />
            </figure>

            <p className="mx-auto mt-12 max-w-3xl text-center text-base leading-relaxed text-slate-700 md:text-lg">
              In summary, no head to head studies exist at the moment. Patients should consider options that will
              solve their problem. After narrowing down options, the next step is to see how you can deal with
              possible side effects such as discomfort or sexual side-effects afterwards. Finally, patients should
              consider the downsides of any options that prevent future imaging or treatment of the prostate if
              needed.
            </p>

            <ol className="mx-auto mt-10 max-w-3xl list-decimal space-y-3 pl-5 text-left text-xs leading-relaxed text-slate-600 md:text-sm">
              <li>
                Porpiglia F, Fiori C, Bertolo R, Giordano A, Checcucci E, Garrou D, Cattaneo G, De Luca S, Amparore D.
                3-Year follow-up of temporary implantable nitinol device implantation for the treatment of benign
                prostatic obstruction. BJU Int. 2018 Jul;122(1):106-112. doi: 10.1111/bju.14141. Epub 2018 Feb 14.
                PMID: 29359881.
              </li>
              <li>
                Roehrborn CG, Barkin J, Gange SN, Shore ND, Giddens JL, Bolton DM, Cowan BE, Cantwell AL, McVary KT,
                Te AE, Gholami SS, Moseley WG, Chin PT, Dowling WT, Freedman SJ, Incze PF, Coffield KS, Herron S, Rashid
                P, Rukstalis DB. Five year results of the prospective randomized controlled prostatic urethral L.I.F.T.
                study. Can J Urol. 2017 Jun;24(3):8802-8813. PMID: 28646935.
              </li>
              <li>
                Leong, Jian Yau, Amir S. Patel, and Ranjith Ramasamy. &ldquo;Minimizing sexual dysfunction in BPH
                surgery.&rdquo; Current sexual health reports 11.3 (2019): 190-200.
              </li>
              <li>
                When technologies collide Defining Urolift artefact and risk of missing cancer on Magnetic Resonance
                Imaging (MRI) P. Chin, R. Jyoti,, D. Habashy (abstract)
              </li>
            </ol>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <EnlargedProstateFaqAccordion />
          </div>
        </section>

        <section
          id="contact-enlarged-prostate"
          className="relative border-t border-slate-200 bg-white scroll-mt-28"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Enlarged Prostate"
              serviceName="Enlarged Prostate (BPH)"
              category="Men"
              sourcePath="/men/enlarged-prostate"
              idPrefix="men-enlarged-prostate"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
