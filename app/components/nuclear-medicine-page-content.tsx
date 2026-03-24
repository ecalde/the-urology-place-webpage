import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { NuclearMedicineSideEffectsAccordion } from "@/app/components/nuclear-medicine-side-effects-accordion";

const IMG = (name: string) => encodeURI(`/images/nuclear medicine/${name}`);

const HERO_BG = IMG("pexels-photo-6011667-2880w.jpeg");
const IMG_WHO = IMG("e8fbc3e6-ca97-4cb5-818a-e37039e4c162-1920w.jpg");
const IMG_MECHANISM = IMG("32052ef4-d888-4e41-a65d-7b7446e1243e-1920w.jpg");
const IMG_FOLLOW_1 = IMG("69ef845c-7d68-476f-8379-439707fca857-1200h.jpg");
const IMG_FOLLOW_2 = IMG("f0ba0889-693a-40a8-90d8-f7fd280f454c-1200h.jpg");
const IMG_FOLLOW_3 = IMG("f74f40ae-d200-41ca-88d9-d24c745b3d46-1200h.jpg");
const IMG_FOLLOW_4 = IMG("Calendar_GettyImages-471258263.jpg");

const PANEL = "bg-[#e8edf5]";
const CONTENT_CARD = "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/60 md:p-8";
const ROUND_IMG = "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200/80";

const FOLLOW_CARDS = [
  {
    image: IMG_FOLLOW_1,
    alt: "Clinician reviewing imaging with a patient during a follow-up visit",
    title: "What to Expect During Follow-Ups",
    body:
      "During your follow-up visits, we will conduct various tests and evaluations to ensure that the treatment is effective. This may include blood tests, imaging studies, and discussions about any symptoms you may be experiencing. Our goal is to provide personalized care tailored to your needs.",
  },
  {
    image: IMG_FOLLOW_2,
    alt: "Healthcare provider performing a focused examination during follow-up care",
    title: "Managing Side Effects",
    body:
      "It's important to communicate any side effects you may encounter during your treatment. Our team is here to help you manage these effects effectively, ensuring that your treatment journey is as comfortable as possible. We will discuss strategies to alleviate any discomfort and improve your overall well-being.",
  },
  {
    image: IMG_FOLLOW_3,
    alt: "Doctor and patient in consultation about treatment planning",
    title: "Importance of Adherence",
    body:
      "Sticking to your treatment schedule and attending follow-up appointments is crucial for the success of your Pluvicto therapy. Consistent monitoring helps us catch any issues early and adjust your treatment as needed, maximizing the benefits of your care.",
  },
  {
    image: IMG_FOLLOW_4,
    alt: "Calendar pages marking follow-up appointment dates",
    title: "Your Support System",
    body:
      "Having a support system in place can make a significant difference during your treatment. Whether it's family, friends, or support groups, sharing your experiences and feelings can help you navigate this journey more effectively. Remember, you are not alone, and we are here to support you every step of the way.",
  },
] as const;

export function NuclearMedicinePageContent() {
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
        {/* Hero */}
        <section className="relative flex min-h-[48vh] flex-col items-center justify-center px-6 py-20 md:min-h-[52vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 max-w-4xl text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Lutetium-177 PSMA Therapy for Prostate Cancer (Pluvicto)
            </h1>
            <div className="mx-auto mt-6 h-px w-16 bg-white/90" aria-hidden />
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/95 md:text-base">
              Innovative treatment · San Antonio, Texas
            </p>
          </div>
        </section>

        {/* Intro — Targeted Treatment */}
        <section
          className={`relative border-t border-slate-200/80 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] ${PANEL} rounded-t-3xl`}
        >
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-16">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Targeted Treatment for Prostate Cancer: Pluvicto™
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                At <strong>The Urology Place</strong>, we want our patients to have access to the
                newest and most effective treatments for prostate cancer. <strong>Pluvicto™</strong> is
                an FDA-approved therapy for men with advanced prostate cancer that has spread to other
                parts of the body and no longer responds to standard treatments.
              </p>
              <p>
                Pluvicto works by finding a protein (called <strong>PSMA</strong>) that is commonly
                found on prostate cancer cells. Once it finds these cancer cells, it delivers a small
                amount of radiation directly to them, helping to kill the cancer while limiting damage
                to healthy cells.
              </p>
              <p>
                Our team will guide you through every step of the process — from deciding if Pluvicto
                is right for you to monitoring your progress during treatment. We work closely with your
                other doctors to make sure you receive safe, personalized, and effective care.
              </p>
            </div>
          </div>
        </section>

        {/* Understanding Pluvicto */}
        <section className="relative border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Innovative treatment for prostate cancer
            </p>
            <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Understanding Pluvicto
            </h2>

            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-14">
              <div>
                <div className={ROUND_IMG}>
                  <Image
                    src={IMG_WHO}
                    alt="Physician reviewing medical documents in a clinical office"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 42vw, 100vw"
                  />
                </div>
                <h3 className="mt-6 text-center text-lg font-bold text-slate-900 md:text-xl">
                  Who Qualifies For Pluvicto?
                </h3>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  <p>
                    Pluvicto is designed for men with <strong>advanced prostate cancer</strong> that
                    has <strong>spread to other parts of the body</strong> and{" "}
                    <strong>is no longer responding to standard treatments</strong> like hormone therapy
                    or chemotherapy. To see if Pluvicto is right for you, doctors look for:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <strong>PSMA-positive cancer:</strong> This means your cancer cells have a
                      protein called PSMA, which Pluvicto can target. A special scan (PSMA PET scan) is
                      used to check this.
                    </li>
                    <li>
                      <strong>Previous treatments:</strong> Pluvicto is typically used after other
                      standard therapies have been tried.
                    </li>
                    <li>
                      <strong>Overall health:</strong> Your doctor will review your health to make sure
                      the treatment is safe for you.
                    </li>
                  </ul>
                  <p>
                    Your urology and oncology team will review your medical history, scans, and lab
                    results to determine if Pluvicto is a suitable option.
                  </p>
                </div>
              </div>

              <div>
                <div className={ROUND_IMG}>
                  <Image
                    src={IMG_MECHANISM}
                    alt="Care team attending to a patient in a treatment setting"
                    fill
                    className="object-cover object-[center_30%]"
                    sizes="(min-width: 768px) 42vw, 100vw"
                  />
                </div>
                <h3 className="mt-6 text-center text-lg font-bold text-slate-900 md:text-xl">
                  What Is The Mechanism Behind Pluvicto?
                </h3>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  <p>
                    Pluvicto is a <strong>targeted therapy</strong> that helps fight advanced prostate
                    cancer. It works by finding a protein called PSMA that is often found on prostate
                    cancer cells. Once it attaches to these cells, Pluvicto delivers a{" "}
                    <strong>small amount of radiation directly to the cancer</strong>, helping to kill it
                    while leaving most healthy cells unharmed.
                  </p>
                  <p>
                    This targeted approach allows doctors to treat cancer that has spread, while
                    minimizing side effects compared to traditional treatments. Your care team at{" "}
                    <strong>The Urology Place</strong> will guide you through the treatment process and
                    monitor your progress every step of the way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Health Matters */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-2xl px-6 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Your Health Matters
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-slate-700 md:text-base">
              At The Urology Place, we prioritize your well-being. Understanding the side effects of
              treatments like Pluvicto is crucial for effective management. Our team is here to support
              you every step of the way.
            </p>
          </div>
        </section>

        {/* Side effects FAQ */}
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <NuclearMedicineSideEffectsAccordion />
          </div>
        </div>

        {/* Follow-up care */}
        <section className={`relative border-t border-slate-200/80 ${PANEL}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Follow-up care
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Understanding Your Follow-Up Period During Pluvicto Treatment
                </h2>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700 md:text-base lg:pt-7">
                After starting Pluvicto treatment, it&apos;s essential to have regular follow-up
                appointments to monitor your progress and manage any side effects. These visits allow
                our team at <strong>The Urology Place</strong> to assess how well the treatment is
                working and make any necessary adjustments to your care plan. Typically, follow-ups are
                scheduled every few weeks, but the exact timing may vary based on your individual
                response to the treatment.
              </p>
            </div>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {FOLLOW_CARDS.map((card) => (
                <div key={card.title} className={CONTENT_CARD}>
                  <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                  <h3 className="text-center text-base font-bold text-slate-900 md:text-lg">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-col items-center gap-4 border-t border-slate-200/80 pt-10 text-center">
              <p className="max-w-xl text-[15px] text-slate-700">
                Questions about Pluvicto or want to schedule a consultation?
              </p>
              <Link
                href="/men/prostate-cancer/nuclear-medicine/contact-us"
                className={BTN_PRIMARY}
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
