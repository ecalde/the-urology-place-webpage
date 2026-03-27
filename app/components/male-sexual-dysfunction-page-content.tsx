import type { ReactNode } from "react";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

const HERO_BG = encodeURI(
  "/images/male sexual dysfunction/photo-1525206809752-65312b959c88-2880w.jpg",
).replace(/\+/g, "%2B");

const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";

const ED_SYMPTOMS = [
  "Gradual Loss of Ability to Perform Sexually",
  "Loss of Libido or Sexual Desire",
  "Inability to Achieve Erection",
  "Inability to Maintain Erection",
] as const;

const ED_STATS = [
  "ED occurrence increases with age and currently affects an estimated 30 million men in the United States",
  "At age 40, approximately 40% of men have ED and at age 70, approximately 70% of men have ED",
  "Men between the ages of 50-59 are 3 times more likely to experience low libido and erection problems than men between the ages of 18-29",
] as const;

function SadFaceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M8 16s1.6 1.75 4 1.75 4-1.75 4-1.75" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SolutionIconCircle({ children }: { children: ReactNode }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700"
      aria-hidden
    >
      {children}
    </span>
  );
}

export function MaleSexualDysfunctionPageContent() {
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
              Male Sexual Dysfunction
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/95 md:text-lg">
              Our experienced Urologists understand the negative symptoms of Erectile Dysfunction and
              Peyronie&apos;s Disease. Our staff has the skills and cutting edge technology for ED and
              Peyronie&apos;s Disease. We are happy to offer ED treatments in both San Antonio and Austin,
              Texas.
            </p>
          </div>
        </section>

        <section className="relative rounded-t-3xl border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-5xl px-6 py-14 text-center md:py-20">
            <h2 className="text-xl font-bold tracking-tight text-blue-600 md:text-2xl">
              What are the symptoms of Erectile Dysfunction?
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {ED_SYMPTOMS.map((label) => (
                <li key={label} className="flex flex-col items-center">
                  <SadFaceIcon className="mx-auto h-14 w-14 text-slate-900" />
                  <p className="mt-4 text-sm font-bold leading-snug text-slate-900 md:text-base">
                    {label}
                  </p>
                </li>
              ))}
            </ul>

            <div className="my-10 border-t border-slate-200" aria-hidden />
            <ul className="mx-auto max-w-3xl list-disc space-y-3 pl-5 text-left text-sm leading-relaxed text-slate-800 marker:text-slate-400 md:text-center md:list-inside md:pl-0 md:text-base">
              {ED_STATS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="mt-10 border-t border-slate-200" aria-hidden />
          </div>
        </section>

        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-blue-600 md:text-3xl">
              What is Erectile Dysfunction?
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              Erectile Dysfunction (ED), also called impotence, affects up to 30 million men in the US. ED is the
              inability to achieve or maintain an erection sufficient to perform sexual intercourse. Although the
              incidence of ED increases with age, it is not a normal part of aging and can usually be successfully
              treated.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              Experiencing occasional erection trouble is typically not a cause for alarm. However, when erectile
              dysfunction becomes an ongoing concern, it may affect the quality of life. When ED has begun to cause
              stress, affect self-confidence, and get in the way of a relationship, it may be time to talk to a
              doctor about receiving medical treatment for ED in San Antonio, Texas.
            </p>

            <h2 className="mt-14 text-2xl font-bold tracking-tight text-blue-600 md:text-3xl md:mt-20">
              Can you treat Erectile Dysfunction?
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              Erectile dysfunction treatment in San Antonio usually involves examining the individual&apos;s medical
              history and lifestyle habits, as erection troubles may signal underlying health conditions that require
              treatment. The physicians at The Urology Place provide the appropriate solution to ED by identifying
              any underlying health issues that affect the patient&apos;s ability to get or keep an erection.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              ED can also be caused by hormonal imbalances such as low testosterone, often called &apos;Low
              T&apos;.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Simple &amp; Powerful Solutions
            </h2>
            <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-10">
              <li className="flex gap-4 text-left">
                <SolutionIconCircle>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </SolutionIconCircle>
                <p className="text-base font-medium text-teal-600">GAINSWave or Acoustic Therapy</p>
              </li>
              <li className="flex gap-4 text-left">
                <SolutionIconCircle>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </SolutionIconCircle>
                <p className="text-base font-medium text-teal-600">Injections such as PRP and Amnion</p>
              </li>
              <li className="flex gap-4 text-left">
                <SolutionIconCircle>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </SolutionIconCircle>
                <div>
                  <p className="text-base font-bold text-slate-900">Intraurethral Pellet Therapy</p>
                  <p className="mt-1 text-sm text-slate-600">
                    To increase blood flow to the penis, called Muse
                  </p>
                </div>
              </li>
              <li className="flex gap-4 text-left">
                <SolutionIconCircle>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <rect x="7" y="9" width="10" height="8" rx="1" />
                    <path d="M9 9V7a3 3 0 016 0v2" />
                    <circle cx="10" cy="13" r="0.75" fill="currentColor" stroke="none" />
                    <circle cx="12" cy="13" r="0.75" fill="currentColor" stroke="none" />
                    <circle cx="14" cy="13" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                </SolutionIconCircle>
                <div>
                  <p className="text-base font-bold text-slate-900">Medications</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Such as Cialis, Viagra, Staxyn, and Levitra
                  </p>
                </div>
              </li>
              <li className="flex gap-4 text-left">
                <SolutionIconCircle>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <rect x="6" y="10" width="12" height="5" rx="1" />
                    <path d="M9 10V8h6v2M12 15v4M10 19h4" strokeLinecap="round" />
                    <path d="M18 12.5h3M4 12.5h2" strokeLinecap="round" />
                  </svg>
                </SolutionIconCircle>
                <p className="text-base font-medium text-teal-600">
                  Hormone Therapy or Testosterone Injections
                </p>
              </li>
              <li className="flex gap-4 text-left">
                <SolutionIconCircle>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                  </svg>
                </SolutionIconCircle>
                <p className="text-base font-medium text-teal-600">CaverStem/Stem Cell Therapy</p>
              </li>
            </ul>
          </div>
        </section>

        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
              Should a Urologist Treat my Erectile Dysfunction?
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              A urologist is likely a man&apos;s best option for ED treatment. Here&apos;s why: Urologists specialize
              in the sexual anatomy. From sexual performance and circumcision to serious medical diagnoses such as
              urinary incontinence, penile pain, and prostate cancer, urologists know men. Further, they are trained to
              have a deep understanding of erectile dysfunction and can speak to you in depth about your specific
              condition.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              We make it easy to schedule appointments for ED and other private conditions online, as many patients
              feel more comfortable writing out their concerns versus speaking them over the phone. Our patient intake
              paperwork is fed through a secure HIPAA-compliant portal, so your data stays protected at all times.
            </p>

            <h2 className="mt-14 text-2xl font-bold tracking-tight text-slate-800 md:text-3xl md:mt-20">
              What should you do if you think you have Erectile Dysfunction?
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              If you think you have ED, or if you are experiencing any erection problems, it is important to schedule
              an appointment with your doctor. Erection problems could be a sign of a more serious underlying health
              condition, so should be assessed as early on as possible.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              Remember, Erectile Dysfunction is treatable in nearly all men and it is a very common condition – about
              50% of men experience ED at some point in their lives. Unfortunately, impotence is one of the leading
              causes of male depression and mental health decline. It can also put significant stress on relationships.
            </p>
          </div>
        </section>

        <section
          id="contact-male-sexual-dysfunction"
          className="relative scroll-mt-28 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Male Sexual Dysfunction"
              serviceName="Male Sexual Dysfunction"
              category="Men"
              sourcePath="/men/male-sexual-dysfunction"
              idPrefix="men-male-sexual-dysfunction"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
