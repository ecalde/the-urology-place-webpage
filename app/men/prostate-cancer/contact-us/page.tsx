import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Prostate Cancer Care in San Antonio",
};

export default function ContactUsForProstateCancerPage() {
  return (
    <ContactFormTemplate
      pageName="Prostate Cancer"
      serviceName="Prostate Cancer"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/contact-us"
    />
  );
}

