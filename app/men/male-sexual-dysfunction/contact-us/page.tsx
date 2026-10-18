import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/contact-us",
  title: "Schedule Sexual Health Care in San Antonio",
  description:
    "Request an appointment for erectile dysfunction and male sexual health care at The Urology Place in San Antonio.",
});

export default function ContactUsForMaleSexualDysfunctionPage() {
  return (
    <ContactFormTemplate
      pageName="Male Sexual Dysfunction"
      serviceName="Male Sexual Dysfunction"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/contact-us"
    />
  );
}

