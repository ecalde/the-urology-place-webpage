import { ContactFormFields } from "@/app/components/contact-form-fields";
import { getDefaultAppointmentReasonForPage } from "@/app/lib/contact-form-defaults";

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
};

export function ContactFormTemplate({
  pageName,
  headingOverride,
  serviceName,
  category,
  sourcePath,
  variant = "page",
  idPrefix,
}: ContactFormTemplateProps) {
  const heading = headingOverride ?? `Contact Us For ${pageName}`;
  const defaultAppointmentReason = getDefaultAppointmentReasonForPage(pageName);

  const content = (
    <div>
      {variant === "page" ? (
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{heading}</h1>
      ) : (
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {heading}
        </h2>
      )}
      <p className="mt-4 max-w-2xl text-slate-700 leading-relaxed">
        Tell us a bit about what you’re looking for and our team will reach out
        shortly.
      </p>

      <div className="mt-10">
        <ContactFormFields
          idPrefix={idPrefix}
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
