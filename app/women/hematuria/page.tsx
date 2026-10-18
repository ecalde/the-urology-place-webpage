import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { HematuriaPageContent } from "@/app/components/hematuria-page";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/women/hematuria",
  title: "Hematuria Evaluation for Women in San Antonio",
  description:
    "Blood in the urine evaluation for women at The Urology Place in San Antonio, from testing through a clear follow-up plan.",
});

export default function HematuriaWomenPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HematuriaPageContent contactSectionId="women-hematuria-contact" />
      <section
        id="women-hematuria-contact"
        className="scroll-mt-28 border-t border-slate-200 bg-slate-50/50"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            pageName="Hematuria"
            serviceName="Hematuria"
            category="Women"
            sourcePath="/women/hematuria"
            idPrefix="women-hematuria"
          />
        </div>
      </section>
    </main>
  );
}

