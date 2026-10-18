import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { HematuriaPageContent } from "@/app/components/hematuria-page";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/hematuria",
  title: "Hematuria Evaluation for Men in San Antonio",
  description:
    "Blood in the urine evaluation for men at The Urology Place in San Antonio, from testing through a clear follow-up plan.",
});

export default function HematuriaMenPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HematuriaPageContent contactSectionId="men-hematuria-contact" />
      <section
        id="men-hematuria-contact"
        className="scroll-mt-28 border-t border-slate-200 bg-slate-50/50"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            pageName="Hematuria"
            serviceName="Hematuria"
            category="Men"
            sourcePath="/men/hematuria"
            idPrefix="men-hematuria"
          />
        </div>
      </section>
    </main>
  );
}

