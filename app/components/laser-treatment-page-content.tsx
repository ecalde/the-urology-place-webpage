import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { LaserTreatmentFaqAccordion } from "@/app/components/laser-treatment-faq-accordion";

/** Encode path for `public/images/enlarge prostate laser treatment/` (spaces and `+` in filenames). */
const IMG = (name: string) => encodeURI(`/images/enlarge prostate laser treatment/${name}`).replace(/\+/g, "%2B");

const HERO_BG = IMG("US_Only_Biopsy_Screen-2880w.jpg");
const IMG_ENLARGED = IMG("IMG_0751+2-1920w.jpg");

const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";

const FEATURE_ITEMS = [
  "Rapid symptom relief",
  "Symptom relief better than reported for medications",
  "Surgery center or Hospital based",
  "Quick return to normal activity",
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

export function LaserTreatmentPageContent() {
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
        <section className="relative flex min-h-[48vh] flex-col items-center justify-center px-6 py-20 md:min-h-[52vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Laser treatment for BPH
            </h1>
            <Link
              href="/men/enlarged-prostate/laser-treatment/contact-us"
              className={`${BTN_PRIMARY} mt-8 inline-block px-6 py-3 text-base`}
            >
              Make Appointment
            </Link>
          </div>
        </section>

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

        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Over 500 million men in the world have BPH. You no longer have to be one of them!
            </h2>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              Laser photoselective vaporization of the prostate. This is known as Greenlight or Thulium
              laser treatment for benign prostatic hyperplasia (BPH). The prostate is a donut-shaped gland
              between the urethra and bladder. As men grow older, the prostate grows and can constrict the
              urinary channel in the donut hole. The prostate secretes fluid into the urethra during
              ejaculation.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <LaserTreatmentFaqAccordion />
              <figure className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200/80">
                  <Image
                    src={IMG_ENLARGED}
                    alt="Endoscopic view illustrating enlarged prostate tissue"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
                <figcaption className="mt-4 text-center font-serif text-base italic text-slate-800 md:text-lg">
                  Enlarged Prostate
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-stone-100">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
              Compare{" "}
              <span className="inline-block border-b-2 border-slate-500 pb-0.5">
                Thulium laser TURP to other
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
