import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { GainswaveFaqAccordion } from "@/app/components/gainswave-faq-accordion";
import { SoundCloudEmbed } from "@/app/components/soundcloud-embed";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { GAINSWAVE_IN_THE_NEWS } from "@/app/data/gainswave-in-the-news";
import { BTN_PRIMARY, BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";

const HERO_BG = encodeURI("/images/gainswave/Testimonial+-+Facebook+D-2880w.png").replace(/\+/g, "%2B");

const PHONE_DISPLAY = "210-617-3670";
const PHONE_TEL = "2106173670";

const FEATURES = [
  "Drug free",
  "Surgery free in-office procedure",
  "Non-invasive",
  "Long lasting",
] as const;

/** Verified The Urology Place channel / related embeds */
const VIDEO = {
  patientExperience: "XGo1CovSXeE",
  sanAntonioExperience: "MtG1Rux0Cl0",
  greatDaySa: "WTgOy_E5jhE",
  scienceEdPeyronies: "AEkkoxAeKTc",
  testimonialAmazing: "umtepm67qvY",
  treatmentWithKella: "oxPdS4pNumY",
} as const;

function InTheNewsTile({ item }: { item: (typeof GAINSWAVE_IN_THE_NEWS)[number] }) {
  if (item.kind === "publication") {
    return (
      <div className="group flex min-h-[140px] flex-col justify-center rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:border-slate-300/80 hover:shadow-md">
        <p className="text-base font-semibold tracking-tight text-slate-900">{item.title}</p>
        <p className="mt-2 text-sm leading-snug text-slate-600">{item.subtitle}</p>
        <span className="mt-3 inline-block h-0.5 w-0 max-w-0 bg-blue-600 transition-all duration-300 group-hover:max-w-full group-hover:w-12" aria-hidden />
      </div>
    );
  }
  if (item.kind === "stat") {
    return (
      <div className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-5 text-center shadow-sm ring-1 ring-slate-100">
        <p className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">{item.line}</p>
      </div>
    );
  }
  if (item.kind === "quote") {
    return (
      <blockquote className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm italic leading-relaxed text-slate-700 md:text-[15px]">&ldquo;{item.quote}&rdquo;</p>
        <footer className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          — {item.attribution}
        </footer>
      </blockquote>
    );
  }
  /* brand */
  const brandStyles: Record<
    (typeof item)["variant"],
    string
  > = {
    "mens-health": "bg-[#e31937] text-white",
    maxim: "bg-black text-white",
    researchgate: "bg-[#00ccb1] text-white",
    journal: "bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 text-amber-50",
  };
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div
        className={`flex h-14 w-full max-w-[200px] items-center justify-center rounded-lg px-4 text-center text-sm font-bold ${brandStyles[item.variant]}`}
      >
        {item.label}
      </div>
      {item.variant === "journal" && (
        <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Journal
        </p>
      )}
    </div>
  );
}

export function GainswavePageContent() {
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
          <div className="absolute inset-0 bg-slate-900/25" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="sr-only">GAINSWave</h1>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Low-intensity shockwave therapy
            </p>
          </div>
        </section>

        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-sky-50/90 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
            <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {FEATURES.map((label) => (
                <li key={label} className="flex flex-col items-center text-center">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-sky-600/60 text-sky-700"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="mt-3 text-sm font-semibold leading-snug text-slate-900 md:text-[15px]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold italic tracking-tight text-blue-700 md:text-3xl">
              A Breakthrough Treatment for Men Seeking Better Erections
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-700 md:text-lg">
              Low intensity shockwave therapy is a scientifically proven treatment that uses acoustic waves to
              treat small tissue. The waves break up microplaque and stimulate tissue production. Studies report up
              to a 76% success rate.
            </p>
            <p className="mt-10">
              <a
                href={`tel:${PHONE_TEL}`}
                className={`inline-flex ${BTN_PRIMARY_LARGE}`}
              >
                Call now at our exclusive GAINSWave line
              </a>
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Sign up to receive a{" "}
              <span className="text-teal-700">free E-Book</span> about{" "}
              <span className="text-teal-700">GAINSWave</span> today!
            </h2>
            <p className="mt-2 text-center text-sm italic text-slate-500">
              E-book will be sent through your provided Email.
            </p>
            <form
              className="mx-auto mt-10 max-w-3xl"
              action="#"
              method="post"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="given-name"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:col-span-1"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <button type="submit" className={BTN_PRIMARY}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-gradient-to-b from-amber-50/40 via-white to-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Patient stories
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
              Real experiences from men who chose GAINSWave at The Urology Place.
            </p>
            <ul className="mt-12 grid gap-6 lg:grid-cols-3">
              <li className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <span className="text-4xl font-serif leading-none text-blue-600" aria-hidden>
                  &ldquo;
                </span>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  I&apos;m 63 years old. I went through prostate cancer surgery in 2005 and unfortunately already had
                  ED, which became worse afterwards. Pills had not worked. After hearing about GAINSWave, I decided to
                  give it a try because the shots were just not for me anymore. The doctor told me about the studies. I
                  was in a worse situation since I did not respond to pills. However, I was pretty healthy otherwise. He
                  thought I could become a pill responder if we tried GAINSWave and some P shots. We finished therapy in
                  January 2018, and I&apos;m excited to say that I can now get erections with just a small daily dose
                  of Cialis!
                </p>
                <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <span className="font-bold text-slate-900">G.B.</span>
                  <span className="block text-xs text-slate-500">The Urology Place, April 2018</span>
                </div>
              </li>
              <li className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100">
                <YouTubeEmbed
                  videoId={VIDEO.testimonialAmazing}
                  title="GAINSWave patient testimonial at The Urology Place"
                  className="rounded-none rounded-t-2xl"
                />
                <div className="p-5">
                  <p className="text-sm text-slate-700">
                    A short video describing GAINSWave at The Urology Place.
                  </p>
                </div>
              </li>
              <li className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <SoundCloudEmbed
                  title="GAINSWave testimonial at The Urology Place — J.T."
                  trackUrl="https://soundcloud.com/nalani-477501342/gainswave-testimonial-at-the-urology-place"
                />
                <p className="mt-5 text-sm leading-relaxed text-slate-700">
                  I&apos;m 60 years old. I&apos;m a prostate cancer survivor after having surgery over a year ago.
                  Luckily, I had function afterwards, but I missed having the ability to quickly regain erections. Six
                  GAINSWave sessions were done, one a week. I was nervous about results. I&apos;m at my 3-month follow-up
                  and am ecstatic about the results. My abilities are nearly the same as they were before surgery. Very
                  happy!
                </p>
                <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <span className="font-bold text-slate-900">J.T.</span>
                  <span className="block text-xs text-slate-500">The Urology Place, May 2018</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-2 lg:items-stretch">
            <div className="grid gap-6 px-6 py-14 text-center lg:px-10 lg:py-16">
              <YouTubeEmbed
                videoId={VIDEO.patientExperience}
                title="The Urology Place GAINSWave patient experience"
                className="rounded-2xl shadow-md ring-1 ring-slate-200/80"
              />
              <YouTubeEmbed
                videoId={VIDEO.sanAntonioExperience}
                title="GAINSWave experience at The Urology Place San Antonio"
                className="rounded-2xl shadow-md ring-1 ring-slate-200/80"
              />
            </div>
            <div className="flex flex-col justify-center bg-blue-600 px-6 py-14 text-center text-white lg:px-12 lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Our Patients&apos; Personal Experience with GAINSWave
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-white/80 lg:mx-0" aria-hidden />
              <p className="mt-6 text-base leading-relaxed text-white/95 md:text-lg">
                Check out these patient experiences with The Urology Place who had undergone the GAINSWave
                treatment.
              </p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-serif text-2xl font-bold italic tracking-tight text-slate-900 md:text-3xl">
                  As Seen On Great Day SA
                </h2>
                <div className="mt-3 h-px w-full max-w-xs bg-slate-900/80" aria-hidden />
                <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
                  Board Certified Urologist, Dr. Naveen Kella, had the opportunity to discuss the breakthrough
                  treatment for Erectile Dysfunction, GAINSWave, on{" "}
                  <a
                    href="https://www.kens5.com/great-day-sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 underline decoration-blue-600/80 underline-offset-2 hover:text-blue-700"
                  >
                    Great Day SA
                  </a>
                  .
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <YouTubeEmbed
                  videoId={VIDEO.greatDaySa}
                  title="Great Day SA: Dr. Naveen Kella discussing GAINSWave for ED"
                  className="rounded-2xl shadow-md ring-1 ring-slate-200/80"
                />
              </div>
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="order-2 lg:order-1">
                <YouTubeEmbed
                  videoId={VIDEO.scienceEdPeyronies}
                  title="GAINSWave for erectile dysfunction and Peyronie's disease in San Antonio"
                  className="rounded-2xl shadow-md ring-1 ring-slate-200/80"
                />
              </div>
              <div className="order-1 flex flex-col justify-center rounded-2xl bg-blue-600 px-6 py-10 text-center text-white lg:order-2 lg:px-10 lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">The Solution Is In The Science</h2>
                <div className="mx-auto mt-4 h-px w-16 bg-white/80 lg:mx-0" aria-hidden />
                <p className="mt-6 text-base leading-relaxed text-white/95 md:text-lg">
                  Dr. Naveen Kella explains the science behind the shockwave therapy to treat Erectile Dysfunction
                  and Peyronie&apos;s disease.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="text-xl font-bold italic tracking-tight text-slate-900 underline decoration-slate-400 underline-offset-4 md:text-2xl">
                  Patient of The Urology Place
                </h2>
                <div className="mt-3 h-px w-full max-w-xs bg-slate-300" aria-hidden />
                <p className="mt-6 text-lg font-medium leading-relaxed text-slate-700 md:text-xl">
                  &ldquo;I would recommend GAINSWave to anybody that wants to stay in the game. Period. It&apos;s
                  helped me.&rdquo;
                </p>
              </div>
              <div>
                <YouTubeEmbed
                  videoId={VIDEO.treatmentWithKella}
                  title="GAINSWave treatment for erectile dysfunction at The Urology Place with Dr. Naveen Kella"
                  className="rounded-2xl shadow-md ring-1 ring-slate-200/80"
                />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  As you mature, sexual health can change. GAINSWave is a non-invasive option many men discuss with
                  Dr. Kella during consultation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-slate-50/90">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-blue-700 md:text-3xl">
              In the news
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Press coverage and highlights.
            </p>
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {GAINSWAVE_IN_THE_NEWS.map((item, index) => (
                <li key={index}>
                  <InTheNewsTile item={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
            <GainswaveFaqAccordion />
          </div>
        </section>

        <section
          id="contact-gainswave"
          className="relative scroll-mt-28 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="GAINSWave"
              serviceName="GAINSWave"
              category="Men > Male Sexual Dysfunction"
              sourcePath="/men/male-sexual-dysfunction/gainswave"
              idPrefix="men-gainswave"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
