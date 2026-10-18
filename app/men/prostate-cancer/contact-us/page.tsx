import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/contact-us",
  title: "Schedule Prostate Cancer Care in San Antonio",
  description:
    "Request a prostate cancer consultation or second opinion with Dr. Naveen Kella at The Urology Place in San Antonio.",
});

export default function ContactUsForProstateCancerPage() {
  return (
    <ContactFormTemplate
      pageName="Prostate Cancer"
      serviceName="Prostate Cancer"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/contact-us"
    />
  );
}

