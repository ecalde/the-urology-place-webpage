import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Rezūm in San Antonio",
};

export default function ContactUsForRezumPage() {
  return (
    <ContactFormTemplate
      pageName="Rezūm"
      serviceName="Rezum"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/rezum/contact-us"
    />
  );
}

