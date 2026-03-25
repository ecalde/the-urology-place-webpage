import Link from "next/link";

const HERO_BG = encodeURI("/images/out of town patients/plane.jpg").replace(/\+/g, "%2B");

const FEATURES = [
  "Easy virtual consultation",
  "Simple scheduling",
  "Hotel accommodations",
] as const;

const PROCEDURE_TILES = [
  { label: "Adult Circumcision", href: "/men/adult-circumcision", tone: "sky" as const },
  { label: "Vasectomy", href: "/men/vasectomy", tone: "muted" as const },
  {
    label: "CaverStem for Erectile Dysfunction",
    href: "/men/male-sexual-dysfunction",
    tone: "muted" as const,
  },
  {
    label: "Robotic Prostatectomy for Prostate Cancer",
    href: "/men/prostate-cancer/robotic-prostatectomy",
    tone: "muted" as const,
  },
  { label: "iTind for Enlarged Prostate", href: "/men/enlarged-prostate/itind", tone: "sky" as const },
  {
    label: "TULSA for Prostate Cancer",
    href: "/men/prostate-cancer/tulsa-for-prostate",
    tone: "sky" as const,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Consultation",
    body:
      "We will set up a virtual (video) consultation to discuss a plan for your procedure to make your trip to San Antonio as productive as possible.",
  },
  {
    n: "02",
    title: "Procedure",
    body:
      "Depending on the procedure you are looking to receive, we will schedule and complete the procedure in our office or have it arranged in a surgical facility.",
  },
  {
    n: "03",
    title: "Post-procedure",
    body:
      "You are able to travel back home right after your procedure in most cases. You can follow up with us virtually or with your local urologist about a week later.",
  },
] as const;

function CheckIcon() {
  return (
    <span
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-600/60 text-sky-700"
      aria-hidden
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function OutOfTownPatientsPageContent() {
  return (
    <main className="relative isolate min-h-screen text-slate-900 -mt-4 md:-mt-6 lg:-mt-8">
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
        <section className="relative flex min-h-[min(48vh,520px)] flex-col justify-center px-6 py-20 md:min-h-[52vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 mx-auto w-full max-w-4xl text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Coming to San Antonio from Out of Town?
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/95 md:mx-0 md:text-lg lg:text-xl">
              We have many patients visit us from all over the nation to have procedures done by board-certified
              urologist, Dr. Naveen Kella in San Antonio, Texas.
            </p>
          </div>
        </section>

        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {FEATURES.map((label) => (
                <li key={label} className="flex flex-col items-center text-center">
                  <CheckIcon />
                  <span className="mt-4 text-sm font-semibold leading-snug text-slate-900 md:text-[15px]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-slate-100">
          <div className="mx-auto max-w-4xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              We Love Patients from Out of Town
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-700 md:text-lg">
              Being one of the top prostate cancer surgeons in the nation and one of the few providers for HIFU and
              TULSA in the United States, we have many patients visit us from all over the nation. Vasectomies and
              Adult Circumcisions are routine procedures we perform within our clinic which makes our experience and
              skill stand out from other clinics around the country.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
            <blockquote className="border-l-4 border-blue-600 bg-slate-50 py-4 pl-6 pr-4 md:pl-8">
              <p className="text-base italic leading-relaxed text-slate-800 md:text-lg">
                &ldquo;I flew in for my circumcision with the Urology Place and was able to leave the following
                morning. They set up everything in advance after our initial telemedicine appointment. I was impressed
                that the staff was so kind even though it was busy in the office. Dr. Kella is nice, professional, and
                did a great job. It was way less painful than I imagined. I highly recommend the Urology Place.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROCEDURE_TILES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex min-h-[88px] items-center justify-center rounded-xl px-4 py-4 text-center text-sm font-bold leading-snug text-slate-900 shadow-sm ring-1 ring-slate-200/80 transition hover:opacity-95 md:text-[15px] ${
                      item.tone === "sky" ? "bg-sky-100 hover:bg-sky-200/80" : "bg-slate-200 hover:bg-slate-300/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-sm text-slate-600">
              Click any of the procedure names above for more information.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What to Expect
            </h2>
            <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((step) => (
                <li key={step.n} className="text-center md:text-left">
                  <p className="text-4xl font-bold tabular-nums text-slate-300 md:text-5xl">{step.n}</p>
                  <h3 className="mt-2 text-lg font-bold text-sky-600 md:text-xl">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-slate-100">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <div className="grid gap-10 md:grid-cols-2 md:gap-12 md:divide-x md:divide-slate-300">
              <div className="md:pr-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Travel accommodations
                </h2>
              </div>
              <div className="md:pl-10">
                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                  We have a reduced rate at the{" "}
                  <a
                    href="https://www.marriott.com/hotels/travel/satnw-san-antonio-marriott-northwest/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 underline decoration-blue-600/80 underline-offset-2 hover:text-blue-700"
                  >
                    Marriott Hotel
                  </a>
                  . You can easily Uber to our office and affiliated surgery centers from any of the mentioned hotels.
                  We cannot be responsible for costs associated with changing travel plans.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
