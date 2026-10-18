import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/contact-us",
  title: "Schedule Enlarged Prostate Care in San Antonio",
  description:
    "Request an appointment for enlarged prostate (BPH) care with the urologists at The Urology Place in San Antonio.",
});

export default function ContactUsForEnlargedProstatePage() {
  return (
    <ContactFormTemplate
      pageName="Enlarged Prostate"
      serviceName="Enlarged Prostate (BPH)"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/contact-us"
    />
  );
}

