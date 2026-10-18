import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule a Prostate Biopsy in San Antonio",
};

export default function ContactUsForProstateBiopsiesPage() {
  return (
    <ContactFormTemplate
      pageName="Prostate Biopsies"
      serviceName="Prostate Biopsies"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/prostate-biopsies/contact-us"
    />
  );
}

