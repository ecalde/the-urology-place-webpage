import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/urolift/contact-us",
  title: "Schedule UroLift in San Antonio",
  description:
    "Request a UroLift appointment for enlarged prostate treatment at The Urology Place in San Antonio.",
});

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

