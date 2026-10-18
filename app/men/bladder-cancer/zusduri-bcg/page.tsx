import Image from "next/image";
import { redirect } from "next/navigation";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { BTN_MAKE_APPOINTMENT_HERO } from "@/app/lib/button-styles";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_FIXED_BACKDROP,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { pageMetadata } from "@/app/lib/site-metadata";

const HERO_BG = "/images/zusduri/zusduri.png";
const TEAM_IMG = encodeURI("/images/zusduri/zusduri group.png");

export const metadata = pageMetadata({
  path: "/men/bladder-cancer/zusduri-bcg",
  title: "Zusduri & BCG Bladder Cancer Treatment in San Antonio",
  description:
    "Advanced bladder cancer treatment options including Zusduri and BCG at The Urology Place in San Antonio.",
});

export default function ZusduriAndBcgPage() {
  redirect("/men/bladder-cancer/zusduri-bcg-en-block");
}

export function ZusduriBcgPageContent() {
  return (
    <div className="relative isolate min-h-screen text-slate-900">
      <div
        className={HERO_FIXED_BACKDROP}
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />

      <div className="relative z-10">
        <section className={HERO_IMAGE_SECTION}>
          <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className={HERO_TITLE_ON_IMAGE}>Zusduri, BCG &amp; En Block</h1>
            <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
              Advanced bladder cancer treatments at The Urology Place
            </p>
            <div className="mt-8">
              <a href="#men-zusduri-bcg-contact" className={BTN_MAKE_APPOINTMENT_HERO}>
                Make Appointment
              </a>
            </div>
          </div>
        </section>

        <section className={`${HERO_AFTER_SLIDE_BASE} bg-white`}>
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Advanced Bladder Cancer Treatments
            </h2>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              We are committed to providing our patients with the most advanced, effective,
              and accessible bladder cancer therapies available today. From breakthrough
              medications to precision surgical techniques, our clinic is leading the way in
              South Texas.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-[#e8edf5]">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Innovative BCG Therapy &amp; Access
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  Bacillus Calmette-Guerin (BCG) remains the gold standard for treating
                  non-muscle invasive bladder cancer (NMIBC). However, global shortages have
                  often limited patient access to this vital treatment.
                </p>
                <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                    <span>
                      <strong>rBCG (Recombinant BCG):</strong> We are proud to offer access
                      to <strong>rBCG</strong>, a specialized form of the therapy.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                    <span>
                      <strong>Cost-Free Access:</strong> We understand the financial burden
                      of cancer care. Our clinic provides rBCG to eligible patients{" "}
                      <strong>for FREE</strong>, ensuring that your recovery is determined by
                      medical need, not financial constraints.
                    </span>
                  </li>
                </ul>

                <h3 className="mt-10 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Adstiladrin (Zusduri): A San Antonio First
                </h3>
                <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
                  <p>
                    Innovation isn&apos;t just a goal; it&apos;s our standard. We are proud
                    to announce that our clinic was the <strong>first private clinic in San Antonio</strong> to
                    administer <strong>Zusduri</strong> (Adstiladrin).
                  </p>
                  <p>
                    This gene-based therapy is a breakthrough for patients with high-risk,
                    BCG-unresponsive NMIBC. By delivering a specific gene directly to the
                    bladder wall, Zusduri helps the body produce its own interferon to fight
                    cancer cells. Being the first in the region to offer this underscores our
                    commitment to bringing the latest FDA-approved breakthroughs to our
                    community.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
                <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={TEAM_IMG}
                    alt="The Urology Place team standing together in clinic"
                    width={582}
                    height={818}
                    className="h-auto w-full object-cover"
                    sizes="(min-width: 1024px) 34vw, 100vw"
                  />
                </div>
                <div className="px-2 pb-2 pt-5">
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-700">
                    South Texas Leadership
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                    Our team is focused on bringing advanced bladder cancer therapies to
                    patients locally, with expert guidance and access to newer treatment
                    options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  Precision surgery
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Laser En Bloc Resection
                </h2>
                <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-relaxed text-slate-800 md:text-base">
                  For the removal of select bladder tumors, we utilize{" "}
                  <strong>Laser En Bloc Resection</strong>, a sophisticated alternative to
                  traditional methods.
                </p>
              </div>

              <div className="mt-10 space-y-8">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 shadow-sm ring-1 ring-slate-200/60">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    The En Bloc Advantage
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                    Unlike traditional Transurethral Resection of Bladder Tumor (TURBT),
                    which removes the tumor in fragments, the <strong>En Bloc</strong>{" "}
                    technique removes the tumor in a single, whole piece using laser
                    precision.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    Why choose Laser En Bloc?
                  </h3>
                  <ul className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                      <span>
                        <strong>Better Pathological Samples:</strong> Removing the tumor in
                        one piece allows pathologists to see the exact margins and depth of
                        the cancer, leading to more accurate staging.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                      <span>
                        <strong>Reduced Recurrence:</strong> Research and clinical literature
                        suggest that the En Bloc technique may reduce the risk of
                        &quot;seeding&quot; (scattering) cancer cells during surgery,
                        potentially lowering recurrence rates.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                      <span>
                        <strong>Faster Recovery:</strong> The precision of the laser
                        minimizes bleeding and trauma to the surrounding bladder tissue.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-[#e8edf5]">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Why Choose The Urology Place?
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              When you choose us, you aren&apos;t just getting a doctor; you&apos;re
              getting a team that has stayed ahead of the curve so you can get back to
              your life!
            </p>
            <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>
                  <strong>Pioneering Care:</strong> The first to bring Zusduri to South
                  Texas.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>
                  <strong>Unmatched Access:</strong> Providing life-saving rBCG at no cost
                  to patients.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>
                  <strong>Surgical Excellence:</strong> Utilizing evidence-based laser
                  techniques for superior outcomes.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section
          id="men-zusduri-bcg-contact"
          className="relative scroll-mt-28 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Zusduri, BCG & En Block"
              serviceName="Zusduri, BCG & En Block"
              category="Men > Bladder Cancer"
              sourcePath="/men/bladder-cancer/zusduri-bcg-en-block"
              idPrefix="men-zusduri-bcg"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
