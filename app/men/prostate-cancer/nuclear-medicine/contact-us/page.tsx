import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/nuclear-medicine/contact-us",
  title: "Schedule Pluvicto Treatment in San Antonio",
  description:
    "Request a Pluvicto PSMA therapy consultation for advanced prostate cancer at The Urology Place in San Antonio.",
});

export default function ContactUsForNuclearMedicinePage() {
  return (
    <ContactFormTemplate
      pageName="Nuclear Medicine"
      serviceName="Nuclear Medicine"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/nuclear-medicine/contact-us"
    />
  );
}

