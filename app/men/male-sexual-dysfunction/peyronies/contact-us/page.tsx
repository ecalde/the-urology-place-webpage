import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Peyronie's Disease Care in San Antonio",
};

export default function ContactUsForPeyroniesDiseasePage() {
  return (
    <ContactFormTemplate
      pageName="Peyronie's Disease"
      serviceName="Peyronies Disease"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/peyronies/contact-us"
    />
  );
}

