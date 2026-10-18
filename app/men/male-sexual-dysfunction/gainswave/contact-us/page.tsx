import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule GAINSWave in San Antonio",
};

export default function ContactUsForGainswavePage() {
  return (
    <ContactFormTemplate
      pageName="GAINSWave"
      serviceName="GAINSWave"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/gainswave/contact-us"
    />
  );
}

