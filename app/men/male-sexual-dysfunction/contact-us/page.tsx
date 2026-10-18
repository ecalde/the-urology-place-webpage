import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Sexual Health Care in San Antonio",
};

export default function ContactUsForMaleSexualDysfunctionPage() {
  return (
    <ContactFormTemplate
      pageName="Male Sexual Dysfunction"
      serviceName="Male Sexual Dysfunction"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/contact-us"
    />
  );
}

