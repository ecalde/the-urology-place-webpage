import Image from "next/image";
import Link from "next/link";
import { VasectomyFaqAccordion } from "@/app/components/vasectomy-faq-accordion";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { VasectomyTabs } from "@/app/men/vasectomy/vasectomy-tabs";
import { BTN_SECONDARY } from "@/app/lib/button-styles";

const HERO_BG = encodeURI(
  "/images/vasectomy/photo-1449177009399-be6867ef0505-2880w.jpg",
);

const IMG = (name: string) => `/images/vasectomy/${name}`;

const FEATURES = [
  "Less than 1% failure rate",
  "No scalpel means less bleeding, risk of infection and pain",
  "A single opening for the procedure",
  "Nitrous Gas available to ease anxiety and discomfort",
] as const;

function FeatureCheckIcon() {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm"
      aria-hidden
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export function VasectomyPageContent() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Hero: fixed backdrop (PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[52vh] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[58vh] md:py-32"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            No-Scalpel, No-Needle Vasectomy
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/95 md:text-lg">
            No-scalpel, no-needle vasectomy with Nitrous gas. We strive to make
            your vasectomy as painless as possible and get you back on your feet
            quickly. We are excited to offer this nearly painless solution!
          </p>
        </div>
      </section>

      <section className="relative z-10 rounded-t-3xl border-t border-slate-200 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
        {/* Feature bar — marble-inspired */}
        <div
          className="border-b border-slate-200/80 px-6 py-14 md:py-16"
          style={{
            background:
              "linear-gradient(145deg, #ffffff 0%, #f4f4f4 45%, #ececec 100%)",
          }}
        >
          <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {FEATURES.map((text) => (
              <div
                key={text}
                className="flex flex-col items-center gap-4 text-center"
              >
                <FeatureCheckIcon />
                <p className="text-sm font-bold leading-snug text-slate-900 md:text-[15px]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Process */}
        <div className="border-t border-slate-200 bg-white px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Our Process
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-center text-[15px] leading-relaxed text-slate-700 md:text-base">
              Vasectomies at The Urology Place are performed by expert
              Urologists with hundreds of procedures of experience. In the
              videos below, Dr. Naveen Kella explains the steps taken to ensure
              your vasectomy is as safe and painless as possible. The
              age-restricted video shows an actual vasectomy.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <YouTubeEmbed
                videoId="bvwm3OhM0zE"
                title="Dr. Naveen Kella — vasectomy information at The Urology Place"
                className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
              />
              <YouTubeEmbed
                videoId="b4AyNyrN7rU"
                title="Vasectomy procedure (age-restricted content may require viewing on YouTube)"
                className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Dr. Kella */}
        <div className="border-t border-slate-200 bg-slate-600 px-6 py-16 text-white md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex justify-center lg:justify-start">
              <div className="relative h-56 w-56 overflow-hidden rounded-full bg-slate-500 shadow-xl ring-4 ring-white/20 md:h-64 md:w-64">
                <Image
                  src={IMG("dr+kella+headshot-1920w.JPG")}
                  alt="Dr. Naveen Kella"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Dr. Naveen Kella
              </h2>
              <p className="mt-2 text-lg font-semibold text-white/95">
                Founder and Experienced Vasectomy Doctor
              </p>
              <p className="mt-6 text-[15px] leading-relaxed text-white/90 md:text-base">
                Dr. Naveen Kella is board certified in urology, with a
                fellowship in Urologic Oncology and robotic surgery. He is known
                for his experience in treating prostate cancer and has performed
                over 3,000 robotic prostate cancer surgeries. Literature notes
                the best surgeons usually have a superior experience. Dr. Kella
                is the most experienced robotic prostate surgeon in San Antonio
                and South Texas. In fact, he is one of the most experienced in
                the nation.
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach — tabs */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <VasectomyTabs />
          </div>
        </div>

        {/* Concierge */}
        <div
          className="border-t border-slate-200 px-6 py-16 md:py-20"
          style={{
            background:
              "linear-gradient(145deg, #ffffff 0%, #f4f4f4 45%, #ececec 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Concierge Executive Vasectomy
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-slate-800 md:text-base">
              We offer after-hours and weekend appointments for busy patients,
              using no-scalpel and no-needle techniques with Nitrous gas for pain
              management.
            </p>
          </div>
        </div>

        {/* Out of town */}
        <div className="border-t border-slate-200 bg-sky-800/90 px-6 py-16 text-center text-white md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold md:text-3xl">
              Coming from Out of Town?
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-white/70" aria-hidden />
            <p className="mt-6 text-[15px] leading-relaxed text-white/95 md:text-base">
              We welcome patients traveling from outside the area with same-day
              consultations and a self-pay price of $825.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/patient-resources/out-of-town-patients"
                className={`inline-flex ${BTN_SECONDARY} bg-white text-blue-600 hover:bg-slate-50`}
              >
                Learn More Here
              </Link>
            </div>
          </div>
        </div>

        {/* Anesthesia */}
        <div className="border-t border-slate-200">
          <div
            className="px-6 py-7 text-center md:py-8"
            style={{
              background:
                "linear-gradient(145deg, #ffffff 0%, #f4f4f4 45%, #ececec 100%)",
            }}
          >
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Considering Having This Procedure Under Anesthesia?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
              Experience a smooth, stress-free vasectomy with our expert
              care—where precision meets comfort under anesthesia. Self pay price
              of $2200
            </p>
          </div>
          <div className="bg-[#9db2d6] px-6 py-7 md:py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 text-center lg:flex-row lg:gap-5">
              <div className="text-white lg:max-w-md">
                <p className="text-base font-semibold md:text-lg">
                  We can complete your Vasectomy consultation and Procedure
                  within an hour!
                </p>
                <p className="mt-3 text-[15px] leading-relaxed md:text-base">
                  Call us at{" "}
                  <a
                    href="tel:+12106173670"
                    className="font-semibold underline decoration-white/70 underline-offset-2"
                  >
                    (210) 617-3670
                  </a>{" "}
                  to schedule an appointment today!
                </p>
                <div className="mx-auto mt-4 h-px max-w-xs bg-white/50" aria-hidden />
              </div>
              <div className="relative aspect-[3/4] w-[min(100%,9rem)] shrink-0 overflow-hidden rounded-xl bg-slate-300 shadow-sm ring-1 ring-slate-200/80 sm:w-[10rem] md:w-[11rem]">
                <Image
                  src={IMG("man-smiling-grey-background-1920w.jpg")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aftercare */}
        <div
          className="border-t border-slate-200 px-6 py-16 md:py-24"
          style={{
            background:
              "linear-gradient(145deg, #ffffff 0%, #f4f4f4 45%, #ececec 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="border-b-2 border-blue-600 pb-3 text-center text-2xl font-bold text-blue-700 md:text-3xl">
              Vasectomy Aftercare: A Smooth Path to Recovery
            </h2>
            <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                Welcome to a new chapter! Your vasectomy is complete, and
                you&apos;re on your way to permanent birth control. This brochure
                will guide you through a smooth recovery process. Remember, these
                are general guidelines – always follow your doctor&apos;s specific
                instructions.
              </p>
              <section>
                <h3 className="font-bold text-slate-900">
                  Taking it Easy (First 24 Hours)
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Relax and unwind. Your body needs time to heal.</li>
                  <li>
                    Think of the word &quot;RICE&quot; Rest, ice, compress, and
                    elevate. (Don&apos;t worry about elevate)
                  </li>
                  <li>
                    Skip the heavy lifting – enlist a friend or family member to
                    help.
                  </li>
                  <li>
                    Do not lift any objects (or kids) if you risk bumping
                    yourself in the scrotum.
                  </li>
                  <li>
                    Ice packs on your shorts (not your skin) for 15 minutes on
                    and off works well.
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-slate-900">
                  Taming the Discomfort (Next Few Days)
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    It&apos;s normal to experience some soreness, swelling, and
                    bruising.
                  </li>
                  <li>
                    Over-the-counter pain relievers like tylenol or ibuprofen
                    can be your allies.
                  </li>
                  <li>
                    Ice packs applied for 15 minutes at a time can reduce
                    swelling and discomfort.
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-slate-900">
                  Keeping Things Clean (Post-Shower)
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    After 24 hours, showers are your friend – keep the area clean
                    and dry. You don&apos;t need to scrub with soap.
                  </li>
                  <li>You do not have to apply antibiotic ointment.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-slate-900">
                  Love Life on Hold (For Now)
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Hold off on sexual activity for at least one week.</li>
                  <li>
                    Remember, vasectomy doesn&apos;t mean instant sterilization.
                  </li>
                  <li>
                    Use another form of birth control until you test negative.
                    Get 30 ejaculations out of your system. (Think 10 a month).
                  </li>
                  <li>
                    The final test is with the at home kit. Dr Kella will let you
                    know if there are other options.
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-slate-900">
                  Supportive Comfort (First Week)
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    Supportive underwear, like an athletic supporter, is your
                    new best friend.
                  </li>
                  <li>
                    Give hot tubs, saunas, and swimming pools a miss for at least
                    a week.
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-slate-900">Listen to Your Body</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Gradually increase activity as you feel comfortable.</li>
                  <li>
                    Any signs of infection (fever, increasing redness, increasing
                    pain)? Give us a call!
                  </li>
                </ul>
              </section>
              <p className="font-bold text-slate-900">
                Congratulations! With a little TLC, you&apos;ll be back to your
                routine in no time.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-slate-200 bg-white px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <VasectomyFaqAccordion />
          </div>
        </div>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Vasectomy"
              serviceName="Vasectomy"
              category="Men"
              sourcePath="/men/vasectomy"
              idPrefix="men-vasectomy"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
