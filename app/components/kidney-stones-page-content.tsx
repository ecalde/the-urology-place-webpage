import type { ReactNode } from "react";
import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";

const HERO_BG = encodeURI(
  "/images/kidney stones/photo-1512615199361-5c7a110a8d11-2880w.jpg",
);

const SYMPTOMS = [
  "Blood in Urine",
  "Flank pain",
  "Fever",
  "Nausea with Chills and Vomiting",
] as const;

function SymptomCheckIcon() {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-800 shadow-inner"
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

type KidneyStonesPageContentProps = {
  category: "Men" | "Women";
  sourcePath: string;
  idPrefix: string;
};

export function KidneyStonesPageContent({
  category,
  sourcePath,
  idPrefix,
}: KidneyStonesPageContentProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Hero: fixed backdrop (PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[58vh] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[62vh] md:py-32"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 28%",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/50 to-slate-950/70"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/70">
            Kidney care
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-white md:text-5xl md:leading-tight lg:text-[3.25rem]">
            Kidney Stone Treatment in San Antonio
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-white/90 md:text-lg">
            Almost half of people who have had a kidney stone will experience a
            recurrence unless they take preventive measures.
          </p>
        </div>
      </section>

      {/* Sliding page */}
      <section className="relative z-10 rounded-t-[1.75rem] border-t border-white/10 bg-slate-50 shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.12)]">
        {/* Symptoms */}
        <div className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Signs to watch for
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Symptoms of Kidney Stones
            </p>
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {SYMPTOMS.map((label) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-8 text-center shadow-sm ring-1 ring-slate-900/[0.04] transition hover:border-slate-300/90 hover:shadow-md"
                >
                  <SymptomCheckIcon />
                  <span className="text-sm font-semibold leading-snug text-slate-800 md:text-[0.95rem]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What are kidney stones? */}
        <div className="border-t border-slate-200/80 bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/60 bg-gradient-to-b from-white to-slate-50/40 px-8 py-12 text-center shadow-sm md:px-12 md:py-14">
            <h2 className="text-2xl font-light tracking-tight text-slate-900 md:text-3xl">
              What are kidney stones?
            </h2>
            <p className="mt-8 text-base leading-[1.75] text-slate-600 md:text-lg">
              Kidney stones are crystal structures that solidify within the
              urinary tract. Nearly 12% of men and 5% of women in the U.S. will
              develop kidney stones. Most kidney stones are microscopic and
              leave the body unnoticed. However, larger stones can cause severe
              pain when passed or may need to be surgically removed.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="#kidney-stones-contact"
                className={BTN_PRIMARY_LARGE}
              >
                Get Treated Now
              </Link>
            </div>
          </div>
        </div>

        {/* Causes & prevention */}
        <div className="border-t border-slate-200/80 bg-slate-50 px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm md:p-10">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                What causes kidney stones?
              </h2>
              <ul className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-slate-600 marker:text-slate-400">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>Dehydration (the leading cause of kidney stones)</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>
                    High diet intake of:
                    <ul className="mt-3 space-y-2 border-l border-slate-200 pl-4 text-slate-600">
                      <li>Animal Protein</li>
                      <li>Sodium</li>
                      <li>Sugars</li>
                    </ul>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>
                    Patient or family history of disease, including Crohn&apos;s
                    disease or Irritable Bowel Syndrome
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>
                    Patient or family history of Kidney Stones with undetermined
                    cause
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm md:p-10">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                How can I prevent kidney stones?
              </h2>
              <p className="mt-6 text-[0.95rem] leading-[1.75] text-slate-600">
                The first step in preventing the development of kidney stones is
                to drink plenty of water. Recommended consumption is 8 to 10
                glasses a day, with urine being clear or pale yellow. Dark
                yellow urine is an indication that the patient is not drinking
                enough water. Dietary changes, such as reducing animal protein
                and salt intake, can also help in prevention. See our{" "}
                <Link
                  href="/patient-resources/blog"
                  className="font-semibold text-sky-600 underline decoration-sky-600/30 underline-offset-[3px] transition hover:text-sky-700"
                >
                  blog article
                </Link>{" "}
                for a simple guide to avoid kidney stones.
              </p>
            </div>
          </div>
        </div>

        {/* How we treat — intro */}
        <div className="border-t border-slate-200/80 bg-white px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              How do you treat kidney stones at The Urology Place?
            </h2>
            <p className="mt-6 text-base leading-[1.8] text-slate-600 md:text-[1.05rem]">
              The doctors at The Urology Place use a number of treatments for
              kidney stones depending on the shape of the stone and the
              severity of your condition. We use conservative therapies whenever
              possible. For example, certain medications can break the stones
              into smaller pieces for easier passage or allow the ureter to
              dilate to possibly pass the stones. Larger stones, however, are
              treated in one of the following ways:
            </p>
          </div>
        </div>

        {/* Treatment options */}
        <div className="border-t border-slate-200/80 bg-slate-50 px-5 pb-16 pt-4 md:px-8 md:pb-24 md:pt-8">
          <div className="mx-auto max-w-3xl space-y-5">
            <TreatmentCard
              title="ESWL or extracorporeal shock wave lithotripsy"
              body={
                <>
                  During this non-invasive treatment, the patient is sedated
                  while the surgeon uses X-ray imaging to target the kidney
                  stones and transmit high-energy sound waves directly to the
                  affected area. The waves pass through the body and break the
                  stones into smaller pieces that can then travel out of the body
                  through the urinary tract. We offer an affordable, self-pay
                  rate for this procedure which includes a possible stent,
                  anesthesia, and outpatient surgery center fees. Read more
                  about our self-pay option{" "}
                  <Link
                    href="/patient-resources/insurance"
                    className="font-semibold text-sky-600 underline decoration-sky-600/30 underline-offset-[3px] transition hover:text-sky-700"
                  >
                    here
                  </Link>
                  .
                </>
              }
            />
            <TreatmentCard
              title="Ureteroscopy"
              body="During this procedure, the doctor removes the kidney stone using a ureteroscope and lasers while the patient is anesthetized. This does not require incisions, but is a more invasive procedure. The ureteroscope allows the doctor to visually locate and remove the stones. If necessary, the doctor will implant a temporary stent, which is a floppy tube that holds the ureter open, allowing the kidney to drain safely."
            />
            <TreatmentCard
              title="Percutaneous nephrolithotomy"
              body="During this procedure, the doctor makes a small incision in the lower back and inserts a catheter into the kidney. The catheter allows the doctor to locate and view the stones with a microscopic camera and use specialized tools to remove the stone or break it into small pieces. The stone then drains through the catheter along with urine. This is more invasive and will require a 2–3 day hospital stay in most cases."
            />
            <TreatmentCard
              title="Robotic or traditional open surgery"
              body="Used only when other therapies are unsuccessful, during this procedure the doctor makes an incision into the abdomen or side to access the kidney and remove the stones. Once removed, the doctor places a catheter (small tube) into the kidney to drain urine until the patient has recovered. This procedure is rare and requires a more extensive hospital stay and recovery time."
            />
          </div>
        </div>

        <section
          id="kidney-stones-contact"
          className="scroll-mt-24 border-t border-slate-200/80 bg-white"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <ContactFormTemplate
              variant="embedded"
              pageName="Kidney Stones"
              serviceName="Kidney Stones"
              category={category}
              sourcePath={sourcePath}
              idPrefix={idPrefix}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function TreatmentCard({
  title,
  body,
}: {
  title: string;
  body: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm md:p-9">
      <div className="h-1 w-10 rounded-full bg-sky-500/90" aria-hidden />
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
        {title}
      </h3>
      <div className="mt-4 text-[0.95rem] leading-[1.8] text-slate-600">{body}</div>
    </article>
  );
}
