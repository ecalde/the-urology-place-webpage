import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Prostate Artery Embolization in San Antonio",
};

export default function ContactUsForPaePage() {
  return (
    <ContactFormTemplate
      pageName="Prostatic Artery Embolization (PAE)"
      serviceName="Prostatic Artery Embolization (PAE)"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/prostatic-artery-embolization/contact-us"
    />
  );
}
