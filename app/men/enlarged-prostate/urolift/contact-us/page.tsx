import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule UroLift in San Antonio",
};

export default function ContactUsForUroliftPage() {
  return (
    <ContactFormTemplate
      pageName="UroLift"
      serviceName="UroLift"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/urolift/contact-us"
    />
  );
}

