import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/prostatic-artery-embolization/contact-us",
  title: "Schedule Prostate Artery Embolization in San Antonio",
  description:
    "Request a prostatic artery embolization appointment for BPH at The Urology Place in San Antonio.",
});

export default function ContactUsForPaePage() {
  return (
    <ContactFormTemplate
      pageName="Prostatic Artery Embolization (PAE)"
      serviceName="Prostatic Artery Embolization (PAE)"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/prostatic-artery-embolization/contact-us"
    />
  );
}
