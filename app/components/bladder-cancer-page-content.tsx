import Image from "next/image";
import Link from "next/link";
import { BladderCancerDiagnosisAccordion } from "@/app/components/bladder-cancer-diagnosis-accordion";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";

const HERO_BG = encodeURI(
  "/images/bladder cancer/pexels-photo-3900424-2880w.jpeg",
);

const IMG = (file: string) => `/images/bladder cancer/${file}`;

type BladderCancerPageContentProps = {
  category: "Men" | "Women";
  sourcePath: string;
  idPrefix: string;
};

export function BladderCancerPageContent({
  category,
  sourcePath,
  idPrefix,
}: BladderCancerPageContentProps) {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Hero: fixed backdrop (PROJECT_RULES.md) */}
      <section
        className="relative flex min-h-[52vh] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[58vh] md:py-32"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/45 to-slate-950/65"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl md:leading-tight lg:text-[3.25rem]">
            Understanding Bladder Cancer
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-normal text-white/95 md:text-xl">
            Your Health Matters—Seek Guidance Early
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="#bladder-cancer-contact" className={BTN_PRIMARY_LARGE}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 rounded-t-3xl border-t border-white/10 bg-white shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.1)]">
        {/* Intro */}
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <p className="text-base font-bold leading-relaxed text-slate-900 md:text-lg">
            Bladder cancer is a serious condition that affects the urinary
            system. Recognizing its symptoms and understanding risk factors can
            lead to early diagnosis and effective treatment.
          </p>
        </div>

        {/* Risk factors */}
        <div className="border-t border-slate-200 bg-white px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Understanding risks
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Risk Factors for Bladder Cancer
            </h2>
            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80 lg:col-span-5">
                <Image
                  src={IMG("pexels-photo-9202352-2880w.jpeg")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
                <div className="space-y-8">
                  <RiskBlock
                    title="Smoking"
                    body="Cigarette smoking is the most significant risk factor for bladder cancer. The harmful chemicals in tobacco can damage the bladder lining, increasing the likelihood of cancer development."
                  />
                  <RiskBlock
                    title="Chemical Exposure"
                    body="Prolonged exposure to certain industrial chemicals, such as aniline dyes and benzidine, can elevate the risk of bladder cancer, particularly in occupations involving these substances."
                  />
                  <RiskBlock
                    title="Chronic Inflammation"
                    body="Conditions that cause chronic irritation or inflammation of the bladder, such as recurrent urinary tract infections or bladder stones, may contribute to cancer risk over time."
                  />
                </div>
                <div className="space-y-8">
                  <RiskBlock
                    title="Age"
                    body="Bladder cancer risk increases with age, with most cases diagnosed in individuals over 55. Regular check-ups become increasingly important as you age."
                  />
                  <RiskBlock
                    title="Gender"
                    body="Men are more likely than women to develop bladder cancer, with a ratio of about 3:1. Understanding this can help in early detection and prevention efforts."
                  />
                  <RiskBlock
                    title="Family History"
                    body="A family history of bladder cancer can increase your risk. If you have relatives who have been diagnosed, it's essential to discuss this with your healthcare provider."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis accordion — Emsella-style */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <BladderCancerDiagnosisAccordion />
          </div>
        </div>

        {/* Hematuria */}
        <div className="border-t border-slate-200 bg-white px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Understanding hematuria
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Micro Hematuria vs. Gross Hematuria: What You Need to Know
                </h2>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Micro Hematuria
                  </h3>
                  <div className="relative mt-4 aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80">
                    <Image
                      src={IMG("pexels-photo-256262-b26f680d-1920w.jpeg")}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 40vw, 100vw"
                    />
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                    Micro hematuria refers to the presence of small amounts of
                    blood in the urine, often detectable only through lab tests.
                    While it may not be visible to the naked eye, it can
                    indicate underlying health issues that should be evaluated by
                    a urologist.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Gross Hematuria
                  </h3>
                  <div className="relative mt-4 aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80">
                    <Image
                      src={IMG("pexels-photo-7691884-1920w.jpeg")}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 40vw, 100vw"
                    />
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                    Gross hematuria is characterized by visible blood in the
                    urine. This condition can be alarming and may signal serious
                    health concerns, including bladder cancer. If you notice
                    blood in your urine, it&apos;s crucial to seek medical
                    attention promptly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment intro */}
        <div className="border-t border-slate-200 bg-slate-50/40 px-6 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Understanding your options
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Treatment Options for Bladder Cancer
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
                At The Urology Place, we understand that a bladder cancer
                diagnosis can be overwhelming. That&apos;s why we offer a range
                of treatment options tailored to your specific needs. From
                minimally invasive procedures to advanced therapies, our team is
                here to guide you every step of the way. We believe in a
                personalized approach, ensuring that you feel informed and
                empowered in your treatment journey.
              </p>
            </div>
          </div>
        </div>

        {/* Four treatments */}
        <div className="border-t border-slate-200 bg-white px-6 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <TreatmentCard
              title="Surgery"
              image={IMG("pexels-photo-5721559-1200h.jpeg")}
              body="Surgery is often the first line of treatment for bladder cancer. Depending on the stage and grade of the cancer, options may include transurethral resection (TURBT) to remove tumors or more extensive procedures like cystectomy, which involves removing part or all of the bladder."
            />
            <TreatmentCard
              title="Chemotherapy"
              image={IMG("pexels-photo-8428371-1200h.jpeg")}
              body="Chemotherapy uses powerful medications to target and kill cancer cells. It can be administered before surgery to shrink tumors or after to eliminate any remaining cancer cells. Our specialists will work with you to determine the best regimen for your situation."
            />
            <TreatmentCard
              title="Immunotherapy"
              image={IMG("pexels-photo-7722794-1200h.jpeg")}
              body={`Immunotherapy harnesses your body's immune system to fight cancer. This innovative treatment can be particularly effective for certain types of bladder cancer, helping to boost your immune response and improve outcomes.`}
            />
            <TreatmentCard
              title="Radiation Therapy"
              image={IMG("pexels-photo-11288654-1200h.jpeg")}
              body="Radiation therapy uses high-energy rays to target and destroy cancer cells. It may be used in conjunction with other treatments or as a standalone option, especially for patients who are not candidates for surgery."
            />
          </div>
        </div>

        {/* Clinical trials */}
        <div className="border-t border-slate-200 bg-white px-6 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3 lg:gap-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Understanding clinical trials
              </p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                Exploring New Frontiers in Bladder Cancer Treatment
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-slate-700">
                At The Urology Place, we offer expert bladder cancer care and
                stay at the forefront of research. Dr. Naveen Kella and our
                team can check if you&apos;re eligible for advanced diagnostic
                tools or clinical trials as part of ongoing studies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                What Are Clinical Trials?
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                Clinical trials are research studies that test new treatments and
                therapies for bladder cancer. They help us understand how
                effective these options are and can lead to breakthroughs in
                patient care.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Why Participate?
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                Participating in a clinical trial can give you access to
                cutting-edge treatments and contribute to medical research that
                may benefit future patients. Your involvement is crucial in
                advancing bladder cancer care.
              </p>
            </div>
          </div>
        </div>

        {/* Get expert guidance */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Get Expert Guidance on Bladder Cancer
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-slate-700 md:text-base">
                If you or a loved one are facing a bladder cancer diagnosis,
                don&apos;t go through it alone. Schedule an appointment at The
                Urology Place for a personalized consultation. Our expert team
                is here to guide you through your diagnosis, treatment options,
                and any questions you may have—with care and support every step
                of the way.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-200 shadow-sm ring-1 ring-slate-200/80">
              <Image
                src={IMG("pexels-photo-6129116-2880w.jpeg")}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </div>
        </div>

        <section
          id="bladder-cancer-contact"
          className="scroll-mt-24 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <ContactFormTemplate
              variant="embedded"
              pageName="Bladder Cancer"
              serviceName="Bladder Cancer"
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

function RiskBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 md:text-lg">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{body}</p>
    </div>
  );
}

function TreatmentCard({
  title,
  image,
  body,
}: {
  title: string;
  image: string;
  body: string;
}) {
  return (
    <article>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
        />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{body}</p>
    </article>
  );
}
