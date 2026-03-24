import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export default function ProstateCancerMenPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Prostate Cancer
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Placeholder content for prostate cancer evaluation, diagnosis, and
          treatment options offered at the clinic.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/men/prostate-cancer/robotic-prostatectomy"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Robotic Prostatectomy
            </h2>
            <p className="mt-2 text-slate-700">
              Surgical treatment options using advanced robotic techniques.
            </p>
          </Link>
          <Link
            href="/men/prostate-cancer/prostate-biopsy"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Prostate Biopsy
            </h2>
            <p className="mt-2 text-slate-700">
              Fusion biopsy, transperineal approach, and what to expect.
            </p>
          </Link>
          <a
            href="#tulsa"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              TULSA for Prostate
            </h2>
            <p className="mt-2 text-slate-700">
              Minimally invasive treatment using ultrasound ablation.
            </p>
          </a>
          <Link
            href="/men/prostate-cancer/nuclear-medicine"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Nuclear Medicine
            </h2>
            <p className="mt-2 text-slate-700">
              Lutetium-177 PSMA therapy (Pluvicto) and other targeted options in prostate cancer care.
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="space-y-12">
            <div id="tulsa" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                TULSA for Prostate
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Details coming soon.
              </p>
            </div>

            <div id="nuclear-medicine" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Nuclear Medicine
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Learn about Lutetium-177 PSMA therapy (Pluvicto), qualifications, follow-up care, and
                side effects on our{" "}
                <Link
                  href="/men/prostate-cancer/nuclear-medicine"
                  className="font-semibold text-blue-600 underline-offset-2 hover:underline"
                >
                  Nuclear Medicine page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            title="Contact Us For Prostate Cancer"
            serviceName="Prostate Cancer"
            category="Men"
            sourcePath="/men/prostate-cancer"
            idPrefix="men-prostate-cancer"
          />
        </div>
      </section>
    </main>
  );
}

