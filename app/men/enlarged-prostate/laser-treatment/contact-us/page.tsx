import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Prostate Laser Treatment in San Antonio",
};

export default function ContactUsForLaserTreatmentPage() {
  return (
    <ContactFormTemplate
      pageName="Enlarged Prostate Laser Treatment"
      serviceName="Enlarged Prostate Laser Treatment"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/laser-treatment/contact-us"
    />
  );
}

