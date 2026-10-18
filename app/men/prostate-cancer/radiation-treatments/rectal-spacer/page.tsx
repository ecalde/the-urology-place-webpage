import type { Metadata } from "next";
import Image from "next/image";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { BTN_MAKE_APPOINTMENT_HERO } from "@/app/lib/button-styles";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_FIXED_BACKDROP,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

const HERO_BG = "/images/brachytherapy/maxresdefault.png";
const PROCESS_IMG = encodeURI("/images/brachytherapy/rectal spacer process.png");

export const metadata: Metadata = {
  title: "Rectal Spacer for Prostate Radiation in San Antonio",
  description:
    "Rectal spacer information for prostate radiation treatment at The Urology Place in San Antonio.",
};

export default function RectalSpacerPage() {
  return (
    <div className="relative isolate min-h-screen text-slate-900">
      <div
        className={HERO_FIXED_BACKDROP}
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        <section className={HERO_IMAGE_SECTION}>
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className={HERO_TITLE_ON_IMAGE}>Rectal Spacer</h1>
            <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
              Enhanced protection during prostate radiation treatment
            </p>
            <div className="mt-8">
              <a href="#men-rectal-spacer-contact" className={BTN_MAKE_APPOINTMENT_HERO}>
                Make Appointment
              </a>
            </div>
          </div>
        </section>

        <section className={`${HERO_AFTER_SLIDE_BASE} bg-white`}>
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Enhanced Protection: The Rectal Spacer
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                We are committed to using advanced technology to make an already effective
                treatment even safer. One of the key innovations we utilize is the use of a
                rectal spacer, designed to protect surrounding healthy tissue during prostate
                treatment.
              </p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-[#e8edf5]">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What is a Rectal Spacer?
            </h2>
            <div className="relative mt-10 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 md:p-6">
              <Image
                src={PROCESS_IMG}
                alt="Diagram showing anatomy without SpaceOAR hydrogel, anatomy with SpaceOAR hydrogel, and SpaceOAR hydrogel with radiation therapy"
                width={1024}
                height={443}
                className="h-auto w-full object-contain"
                sizes="(min-width: 1024px) 896px, 100vw"
              />
            </div>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                A rectal spacer is placed between the prostate and the rectum to help protect
                healthy tissue during prostate radiation. Because these two structures sit very
                close together, the rectum can be exposed to unintended radiation during prostate
                treatments.
              </p>
              <p>
                One option is a <strong>temporary, absorbable hydrogel</strong> that is injected
                into the space between the prostate and rectum, where it forms a soft barrier.
                Another option is a <strong>biodegradable balloon spacer</strong>, which is placed
                in the same area and inflated with saline to create separation. Unlike hydrogel that
                sets in place after injection, a balloon spacer can be adjusted or repositioned if
                needed before treatment begins.
              </p>
              <p>
                In both cases, the spacer creates a small but important separation, helping to
                protect the rectum from radiation exposure. Both hydrogel and balloon spacers are
                naturally absorbed by the body over time after treatment.
              </p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              How It Works
            </h2>
            <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                During the procedure, the hydrogel is carefully injected into the space between
                the prostate and rectum using image guidance. Once in place, it forms a soft
                barrier that gently pushes the rectum away from the prostate.
              </p>
              <p>This added space can:</p>
            </div>
            <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Reduce radiation exposure to the rectum by up to 75%</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Minimize irritation to surrounding tissues</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Improve overall treatment precision</span>
              </li>
            </ul>
            <p className="mt-8 text-[15px] leading-relaxed text-slate-800 md:text-base">
              The hydrogel remains in place throughout treatment and is{" "}
              <strong>naturally absorbed by the body over time</strong>, typically within a few
              months.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-[#e8edf5]">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Benefits of a Rectal Spacer
            </h2>
            <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Significantly lowers the risk of bowel side effects</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Reduces irritation, discomfort, and long-term complications</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Helps preserve quality of life during and after treatment</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                <span>Enhances the safety and accuracy of prostate therapy</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What to Expect
            </h2>
            <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              <p>
                Placement of the rectal spacer is typically done at the time of your procedure and
                does not require a separate surgery. It is minimally invasive and performed with
                imaging guidance to ensure precise positioning.
              </p>
              <p>
                Most patients tolerate the placement well and do not feel the spacer once it is in
                place.
              </p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-[#e8edf5]">
          <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Why It Matters
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-800 md:text-base">
              Protecting surrounding healthy tissue is a critical part of modern prostate
              treatment. By incorporating a rectal spacer, we are able to deliver effective
              therapy while significantly reducing the risk of unwanted side effects.
            </p>
          </div>
        </section>

        <section
          id="men-rectal-spacer-contact"
          className="relative scroll-mt-28 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Rectal Spacer"
              serviceName="Rectal Spacer"
              category="Men > Prostate Cancer"
              sourcePath="/men/prostate-cancer/radiation-treatments/rectal-spacer"
              idPrefix="men-rectal-spacer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
