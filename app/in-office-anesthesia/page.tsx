import Image from "next/image";
import { AnesthesiaAccordion } from "../components/anesthesia-accordion";

export default function InOfficeAnesthesiaPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: fixed background; content scrolls over (see PROJECT_RULES.md) */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-24"
        style={{
          backgroundImage: "url(/images/branding/pexels-photo-8037024-2880w.jpeg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            In-Office Anesthesia Tailored for Urologic Care
          </h1>
          <p className="mt-4 text-lg text-white/95 md:text-xl">
            Prioritizing your comfort and safety throughout every treatment
          </p>
        </div>
      </section>

      {/* Sliding page: rounded top for window effect */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Removing your stress: two-column layout */}
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.35fr)_1fr] lg:gap-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Removing your stress
            </h2>
            <div className="border-l-2 border-slate-300 pl-8 md:pl-10">
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p>
                  Undergoing a procedure can bring about a wide range of emotions – most commonly anxiety and nervousness. This is completely normal, especially when the procedure involves a sensitive or personal area. At our clinic, we understand that patient comfort is just as important as clinical excellence. That is why we are proud to offer in-office anesthesia services for procedures such as vasectomies, circumcisions and others.
                </p>
                <p>
                  By partnering with a Certified Registered Nurse Anesthetist (CRNA), we are able to provide a higher level of comfort and relaxation during your procedure in a safe and controlled environment. This option allows patients to feel more at ease, minimizes procedural discomfort, and helps create a smoother overall experience.
                </p>
                <p>
                  Our goal is to ensure that patients feel informed, supported, and confident in their care. Offering in-office anesthesia provides a beneficial option for those who may experience procedural anxiety or simply prefer an added level of comfort during their treatment. We are committed to delivering high-quality urologic care while prioritizing your safety and peace of mind every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* More Information: image + accordion */}
        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-200 lg:aspect-auto lg:h-[420px]">
                <Image
                  src="/images/branding/pexels-photo-18798923-1920w.jpeg"
                  alt="Medical professional in a calm, controlled care environment"
                  fill
                  className="object-cover grayscale"
                  sizes="(min-width: 1024px) 340px, 100vw"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  More Information
                </h2>
                <div className="mt-8">
                  <AnesthesiaAccordion />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
