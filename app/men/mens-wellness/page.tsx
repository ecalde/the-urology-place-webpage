import Image from "next/image";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { MensWellnessTabs } from "./mens-wellness-tabs";

const DIFFERENTIATORS = [
  { text: "Experienced\nBoard Certified\nUrologists" },
  { text: "Holistic\nHealthcare" },
  { text: "Customized\nTreatments" },
  { text: "Advanced\nTechnology &\nTechniques" },
];

function CheckIcon() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white">
      <svg className="h-3.5 w-3.5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function MensWellnessPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: static background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-24"
        style={{
          backgroundImage: "url(/images/men/MenWellness.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Men&apos;s Health and Wellness at The Urology Place
          </h1>
          <p className="mt-4 text-lg text-white/95 md:text-xl">
            Our team has expertise in sexual function, hormonal optimization, and weight loss.
          </p>
        </div>
      </section>

      {/* Sliding page: rounded top for window effect */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Differentiators: four checkmark blocks */}
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((item) => (
              <div key={item.text} className="flex items-start gap-4">
                <CheckIcon />
                <p className="whitespace-pre-line text-base font-bold leading-snug text-slate-900">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How can The Urology Place help me? */}
        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How can The Urology Place help me?
            </h2>
            <p className="mt-6 text-slate-700 leading-relaxed">
              Our team of providers are led by Board Certified Urologists with expanded skills into sexual wellness, hormonal optimization, and weight loss counseling. Our team stays current on the latest medical advancements to help our patients get the best possible care. We are happy to provide care in San Antonio and Austin, Texas.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="relative h-64 w-full max-w-xl overflow-hidden rounded-xl bg-slate-200 md:h-80">
                <Image
                  src="/images/men/KellaInOffice.png"
                  alt="Medical team at The Urology Place"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 768px) 672px, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed content: Erectile Dysfunction, Peyronie's, Low T, Weight Loss, Prostate */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <MensWellnessTabs />
          </div>
        </section>

        {/* Contact — site-wide form */}
        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Men's Wellness"
              serviceName="Men's Wellness"
              category="Men"
              sourcePath="/men/mens-wellness"
              idPrefix="mens-wellness"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
