import { ContactFormTemplate } from "@/app/components/contact-form-template";

export function HomeContactSection() {
  return (
    <section
      className="border-t border-slate-200 bg-slate-50/50"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 id="contact-heading" className="sr-only">
          Request an appointment and contact information
        </h2>
        <ContactFormTemplate
          variant="embedded"
          pageName="Home"
          serviceName="Home Page Inquiry"
          category="Home"
          sourcePath="/"
          idPrefix="home-contact"
        />
      </div>
    </section>
  );
}
