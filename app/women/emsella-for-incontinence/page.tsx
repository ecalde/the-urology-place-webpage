import Image from "next/image";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { EmsellaFaqAccordion } from "@/app/components/emsella-faq-accordion";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";

const HERO_BG =
  "/images/emsella%20for%20incontinence/photo-1488778578932-0f84d315fcae-2880w.jpg";

const IMG_DIR = "/images/emsella for incontinence";

const PUBMED_HIFEM =
  "https://pubmed.ncbi.nlm.nih.gov/?term=high-intensity+focused+electromagnetic+pelvic+floor+urinary+incontinence";

const SYMPTOMS = [
  "Urgency",
  "Frequency",
  "Bladder leaks",
  "Night walks",
  "Pelvic organ prolapse",
  "Weak sexual function",
] as const;

function IconWoman({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-1 7.5h2c.83 0 1.5.67 1.5 1.5v1.2l1.2 4.8H15l-.6-3h-.8l-.6 3H9.9l1.2-4.8V13c0-.83.67-1.5 1.5-1.5Z" />
    </svg>
  );
}

function IconArrowDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 4v14M5 11l7 7 7-7" />
    </svg>
  );
}

function IconCalendarCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function IconThumbsUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 21h4v-9H4v9Zm16-8c0-.55-.1-1.05-.3-1.52-.05-.13-.11-.26-.18-.38A2 2 0 0 0 18 10h-4.34l.78-3.77c.09-.46.05-.95-.12-1.38A2.06 2.06 0 0 0 12.38 4H12c-.55 0-1.05.22-1.41.59-.37.37-.59.87-.59 1.41v7.18L7.6 20.78c-.13.62.03 1.27.43 1.76.4.5.99.79 1.62.79H17c1.1 0 2-.9 2-2v-5l2.08-5.55c.1-.27.15-.55.15-.84l-.01-.39Z" />
    </svg>
  );
}

const WHY_POINTS = [
  { title: "Remain Fully Clothed", Icon: IconWoman },
  { title: "Treats entire pelvic floor area", Icon: IconArrowDown },
  { title: "FDA Cleared Treatment", Icon: IconCalendarCheck },
  { title: "Non-Invasive", Icon: IconThumbsUp },
] as const;

export default function EmsellaForIncontinencePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: fixed background (PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[50vh] flex-col items-center justify-center px-6 py-24"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Emsella for Incontinence
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/95 md:text-xl">
            New technology for an old problem
          </p>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Why EMSELLA */}
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-blue-700 md:text-3xl">
            Why Patients are saying yes to EMSELLA
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {WHY_POINTS.map(({ title, Icon }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center text-slate-900">
                  <Icon className="h-12 w-12" />
                </div>
                <p className="mt-4 text-sm font-bold leading-snug text-slate-900 md:text-base">
                  {title}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-14 max-w-3xl text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:text-sm">
            Body aging, childbirth, and menopause can lead to incontinence
          </p>
        </div>

        {/* Infographic: before / treatment / after */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
            <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={`${IMG_DIR}/em2-1920w.JPG`}
                alt="Chart comparing common Kegel exercise muscle contractions with BTL EMSELLA supramaximal contractions over time"
                width={1920}
                height={1080}
                className="h-auto w-full object-contain"
                sizes="(min-width: 1024px) 960px, 100vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Breakthrough + symptoms */}
        <div className="border-t border-slate-200 bg-slate-50/90">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
              A Breakthrough Treatment for Incontinence and Confidence
            </h2>
            <p className="mx-auto mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
              This unique technology revolutionizes women&apos;s intimate health
              and wellness by providing those suffering from incontinence with a
              completely non-invasive option. Emsella is able to strengthen
              pelvic floor muscles to reduce the following symptoms:
            </p>
            <ul className="mx-auto mt-10 max-w-md space-y-2 text-left text-base text-slate-800 md:text-lg">
              {SYMPTOMS.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="font-semibold text-blue-700">—</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The Kegel Throne */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              The Kegel Throne
            </h2>
            <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <Image
                  src={`${IMG_DIR}/two-1920w.JPG`}
                  alt="Two women seated on BTL Emsella treatment chairs"
                  width={1920}
                  height={1280}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              </div>
              <div className="space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
                <p>
                  BTL EMSELLA™ is a great option for women of any age who desire
                  a solution for urinary incontinence and improvement in their
                  quality of life. The treatment is FDA cleared in men and women.
                  Patients who leak with cough or who have leakage with sudden
                  urges to rush to the bathroom are candidates.
                </p>
                <p>
                  Your provider will tailor a treatment plan for you. A typical
                  treatment takes about 30 minutes and you will need about 6
                  sessions, scheduled once or twice a week.*
                </p>
                <p>
                  You will experience tingling and pelvic floor muscle
                  contractions during the procedure. Most of our patients remark
                  that it is a feeling unlike any other. You may resume daily
                  activities immediately after the treatment.
                </p>
                <p>
                  You may observe improvement after a single session. The results
                  will typically continue to improve over the next few weeks.
                </p>
                <p>
                  To read more about the efficacy behind Emsella,{" "}
                  <a
                    href={PUBMED_HIFEM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline decoration-blue-400 underline-offset-2 hover:text-blue-800"
                  >
                    click here
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dr. Kella + video */}
        <div className="border-t border-slate-200 bg-slate-50/80">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  A Conversation with Dr. Kella
                </h2>
                <div className="mt-4 h-px w-16 bg-slate-400" aria-hidden />
                <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
                  Board-certified urologist Dr. Naveen Kella discusses the
                  benefits behind Emsella for urinary incontinence.
                </p>
              </div>
              <YouTubeEmbed
                videoId="1n7VtgF8PG0"
                title="Dr. Kella on Emsella for urinary incontinence"
                className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Testimonial + video */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
              <YouTubeEmbed
                videoId="uibxWXwCRxw"
                title="Emsella patient testimonial at The Urology Place"
                className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
              />
              <div className="rounded-2xl bg-sky-700 px-8 py-10 text-white shadow-md md:px-10 md:py-12">
                <h3 className="text-xl font-bold tracking-tight underline decoration-white/50 underline-offset-8 md:text-2xl">
                  Patient Testimonial
                </h3>
                <p className="mt-8 text-base leading-relaxed text-white/95 md:text-lg">
                  Emsella is FDA cleared for both males and females. Check out
                  this testimonial from one of our patients who received the
                  Emsella treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kegel vs EMSELLA chart */}
        <div className="border-t border-slate-200 bg-slate-50/90">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Can you kegel like an Emsella? Probably not…
            </h2>
            <div className="relative mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={`${IMG_DIR}/Screen+Shot+2018-12-31+at+12.46.08+AM-1920w.png`}
                alt="Diagram: pelvic floor before EMSELLA treatment, during electromagnetic stimulation, and after improved support and bladder control"
                width={1920}
                height={1080}
                className="h-auto w-full object-contain"
                sizes="(min-width: 1024px) 896px, 100vw"
              />
            </div>
            <div className="mt-10 flex justify-center">
              <a
                href={PUBMED_HIFEM}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_PRIMARY_LARGE} inline-flex max-w-xl text-center leading-snug`}
              >
                Click here to read a study discussing the benefit of HIFEM
                technology for urinary incontinence and sexual function
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <EmsellaFaqAccordion />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            pageName="Emsella for Incontinence"
            serviceName="Emsella for Incontinence"
            category="Women"
            sourcePath="/women/emsella-for-incontinence"
            idPrefix="women-emsella"
          />
        </div>
      </section>
    </main>
  );
}
