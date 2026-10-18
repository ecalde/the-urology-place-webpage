import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/peyronies/contact-us",
  title: "Schedule Peyronie's Disease Care in San Antonio",
  description:
    "Request a Peyronie's disease evaluation and treatment appointment at The Urology Place in San Antonio.",
});

export default function ContactUsForPeyroniesDiseasePage() {
  return (
    <ContactFormTemplate
      pageName="Peyronie's Disease"
      serviceName="Peyronies Disease"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/peyronies/contact-us"
    />
  );
}

