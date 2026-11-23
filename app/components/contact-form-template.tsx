import { ContactFormFields } from "@/app/components/contact-form-fields";
import {
  APPOINTMENT_REASON_OPTIONS,
  getDefaultAppointmentReasonForPage,
  type AppointmentReasonOption,
} from "@/app/lib/contact-form-defaults";
import {
  HERO_FORM_SECTION_HEADING,
  HERO_SUBTITLE_ON_LIGHT,
  HERO_TITLE_ON_LIGHT,
} from "@/app/lib/hero";

export type ContactFormTemplateProps = {
  /**
   * Display name for the current page or service (e.g. "Kidney Stones", "Men's Wellness").
   * Used for the default appointment reason and for the heading `Contact Us For {pageName}`
   * unless `headingOverride` is set.
   */
  pageName: string;
  /**
   * Optional full heading when it should not be `Contact Us For {pageName}`
   * (e.g. the main Contact Us page uses "Contact Us" only).
   */
  headingOverride?: string;
  /** Hidden metadata */
  serviceName: string;
  /** Hidden metadata (e.g. "Men", "Women", "Men > Prostate Cancer") */
  category: string;
  /** Hidden metadata (path or page identifier) */
  sourcePath: string;
  /**
   * Render mode:
   * - "page": full page with h1 (used by dedicated contact-us routes)
   * - "embedded": section content only (used when embedding at bottom of a page)
   */
  variant?: "page" | "embedded";
  /** Optional prefix for form control IDs to avoid duplicates. */
  idPrefix?: string;
  /**
   * Listed appointment reason to select when the form opens.
   * When this is omitted, or is not one of the listed reasons, the page name
   * still chooses the reason. Visitors can change the selection, including Other.
   */
  defaultAppointmentReason?: AppointmentReasonOption;
};

export function ContactFormTemplate({
  pageName,
  headingOverride,
  serviceName,
  category,
  sourcePath,
  variant = "page",
  idPrefix,
  defaultAppointmentReason: requestedAppointmentReason,
}: ContactFormTemplateProps) {
  const heading = headingOverride ?? `Contact Us For ${pageName}`;
  const defaultAppointmentReason =
    requestedAppointmentReason &&
    (APPOINTMENT_REASON_OPTIONS as readonly string[]).includes(
      requestedAppointmentReason,
    )
      ? requestedAppointmentReason
      : getDefaultAppointmentReasonForPage(pageName);

  const content = (
    <div>
      {variant === "page" ? (
        <h1 className={HERO_TITLE_ON_LIGHT}>{heading}</h1>
      ) : (
        <h2 className={HERO_FORM_SECTION_HEADING}>
          {heading}
        </h2>
      )}
      <p className={`mt-4 max-w-2xl leading-relaxed ${HERO_SUBTITLE_ON_LIGHT}`}>
        Tell us a bit about what you’re looking for and our team will reach out
        shortly.
      </p>

      <div className="mt-10">
        <ContactFormFields
          idPrefix={idPrefix}
          pageName={pageName}
          defaultAppointmentReason={defaultAppointmentReason}
          serviceName={serviceName}
          category={category}
          sourcePath={sourcePath}
        />
      </div>
    </div>
  );

  if (variant === "embedded") return content;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-24">{content}</section>
    </main>
  );
}
