import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export default function EnlargedProstatePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Enlarged Prostate (BPH)
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Placeholder content for enlarged prostate (BPH) evaluation, symptom
          management, and treatment options.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/men/enlarged-prostate/itind"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              iTind for Enlarged Prostate (BPH)
            </h2>
            <p className="mt-2 text-slate-700">
              Reshape the prostatic urethra for improved flow—no permanent implant.
            </p>
          </Link>
          <a
            href="#rezum"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Rezūm
            </h2>
            <p className="mt-2 text-slate-700">
              A water vapor therapy option for select BPH patients.
            </p>
          </a>
          <a
            href="#laser-treatment"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Enlarged Prostate Laser Treatment
            </h2>
            <p className="mt-2 text-slate-700">
              Laser-based approaches to relieve obstruction and improve symptoms.
            </p>
          </a>
          <a
            href="#urolift"
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50/70"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              UroLift
            </h2>
            <p className="mt-2 text-slate-700">
              A minimally invasive implant option to open the urinary channel.
            </p>
          </a>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="space-y-12">
            <div id="itind" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                iTind for Enlarged Prostate (BPH)
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Learn how iTind works, watch patient stories, and compare options on our{" "}
                <Link
                  href="/men/enlarged-prostate/itind"
                  className="font-semibold text-blue-600 underline-offset-2 hover:underline"
                >
                  iTind page
                </Link>
                .
              </p>
            </div>

            <div id="rezum" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Rezūm
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Details coming soon.
              </p>
            </div>

            <div id="laser-treatment" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Enlarged Prostate Laser Treatment
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Details coming soon.
              </p>
            </div>

            <div id="urolift" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                UroLift
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Details coming soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            title="Contact Us For Enlarged Prostate"
            serviceName="Enlarged Prostate (BPH)"
            category="Men"
            sourcePath="/men/enlarged-prostate"
            idPrefix="men-enlarged-prostate"
          />
        </div>
      </section>
    </main>
  );
}

