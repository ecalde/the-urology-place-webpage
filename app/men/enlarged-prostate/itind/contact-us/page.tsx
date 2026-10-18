import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/itind/contact-us",
  title: "Schedule iTind in San Antonio",
  description:
    "Request an iTind appointment for enlarged prostate treatment at The Urology Place in San Antonio.",
});

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

