import Link from "next/link";

import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { TreatmentBlocks } from "@/app/components/treatment-page/treatment-blocks";
import {
  TREATMENT_PROSE,
  TREATMENT_TEXT_LINK,
} from "@/app/components/treatment-page/treatment-styles";
import { BTN_MAKE_APPOINTMENT_HERO } from "@/app/lib/button-styles";
import { CLINIC_PHONE, clinicPhoneTelHref } from "@/app/lib/clinic-info";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import {
  TREATMENT_HERO_IMAGE_WIDTH,
  treatmentHeroPosition,
  treatmentImageUrl,
} from "@/app/lib/treatment-images";
import {
  resolveTreatmentAppointmentReason,
  treatmentContactCategory,
  treatmentFormIdPrefix,
  treatmentPublicPath,
  type TreatmentPage,
} from "@/app/lib/treatment-pages";

export function TreatmentPageView({ page }: { page: TreatmentPage }) {
  const path = treatmentPublicPath(page);
  if (!path) {
    throw new Error("Treatment page is missing a public path.");
  }

  const title = page.title.trim();
  const heroTitle = page.hero?.title?.trim() || title;
  const subtitle = page.hero?.subtitle?.trim() || "";
  const heroImage = page.hero?.image;
  const heroAlt = heroImage?.alt?.trim() || "";
  const heroUrl = treatmentImageUrl(heroImage, TREATMENT_HERO_IMAGE_WIDTH);
  const showForm = page.showContactForm !== false;
  const formPrefix = treatmentFormIdPrefix(path);
  const formId = `${formPrefix}-contact`;
  const reason = resolveTreatmentAppointmentReason(title, page.defaultAppointmentReason);
  const blocks = page.body ?? [];

  return (
    <div className="min-h-screen bg-white text-slate-900" data-treatment-page="cms">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: heroUrl ? `url(${heroUrl})` : undefined,
          backgroundColor: "#0f172a",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: treatmentHeroPosition(heroImage),
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {heroAlt ? <span className="sr-only">{heroAlt}</span> : null}
          <h1 className={HERO_TITLE_ON_IMAGE}>{heroTitle}</h1>
          {subtitle ? (
            <p className={`mx-auto mt-5 max-w-2xl ${HERO_SUBTITLE_ON_IMAGE}`}>{subtitle}</p>
          ) : null}
          <div className="mt-8">
            {showForm ? (
              <a href={`#${formId}`} className={BTN_MAKE_APPOINTMENT_HERO}>
                Make Appointment
              </a>
            ) : (
              <Link href="/patient-resources/contact-us" className={BTN_MAKE_APPOINTMENT_HERO}>
                Make Appointment
              </Link>
            )}
          </div>
        </div>
      </section>

      {blocks.length > 0 ? (
        <div className="rounded-t-3xl border-t border-slate-200 bg-white">
          <TreatmentBlocks blocks={blocks} />
        </div>
      ) : null}

      {showForm ? (
        <section
          id={formId}
          className="scroll-mt-28 border-t border-slate-200 bg-slate-50/50"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className={`mb-8 ${TREATMENT_PROSE}`}>
              Call The Urology Place at{" "}
              <a href={clinicPhoneTelHref()} className={TREATMENT_TEXT_LINK}>
                {CLINIC_PHONE}
              </a>
              , or send a request below.
            </p>
            <ContactFormTemplate
              variant="embedded"
              pageName={title}
              serviceName={title}
              category={treatmentContactCategory(page.section, page.parentPath)}
              sourcePath={path}
              idPrefix={formPrefix}
              defaultAppointmentReason={reason}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
