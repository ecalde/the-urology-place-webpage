import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Robotic Prostatectomy in San Antonio",
};

export default function ContactUsForRoboticProstatectomyPage() {
  return (
    <ContactFormTemplate
      pageName="Robotic Prostatectomy"
      serviceName="Robotic Prostatectomy"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/robotic-prostatectomy/contact-us"
    />
  );
}

