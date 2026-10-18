import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule TULSA-PRO in San Antonio",
};

export default function ContactUsForTulsaForProstatePage() {
  return (
    <ContactFormTemplate
      pageName="TULSA for Prostate"
      serviceName="TULSA for Prostate"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/tulsa-for-prostate/contact-us"
    />
  );
}

