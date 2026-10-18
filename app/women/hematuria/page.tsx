import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { HematuriaPageContent } from "@/app/components/hematuria-page";

export const metadata: Metadata = {
  title: "Hematuria Evaluation for Women in San Antonio",
};

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

