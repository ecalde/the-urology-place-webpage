import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule iTind in San Antonio",
};

export default function ContactUsForItindPage() {
  return (
    <ContactFormTemplate
      pageName="iTind for Enlarged Prostate (BPH)"
      serviceName="iTind for Enlarged Prostate (BPH)"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/itind/contact-us"
    />
  );
}

