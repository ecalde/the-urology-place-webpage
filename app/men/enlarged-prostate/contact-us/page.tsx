import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Enlarged Prostate Care in San Antonio",
};

export default function ContactUsForEnlargedProstatePage() {
  return (
    <ContactFormTemplate
      pageName="Enlarged Prostate"
      serviceName="Enlarged Prostate (BPH)"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/contact-us"
    />
  );
}

