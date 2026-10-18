import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/rezum/contact-us",
  title: "Schedule Rezūm in San Antonio",
  description:
    "Request a Rezūm water vapor therapy appointment for enlarged prostate at The Urology Place in San Antonio.",
});

export default function ContactUsForRezumPage() {
  return (
    <ContactFormTemplate
      pageName="Rezūm"
      serviceName="Rezum"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/rezum/contact-us"
    />
  );
}

