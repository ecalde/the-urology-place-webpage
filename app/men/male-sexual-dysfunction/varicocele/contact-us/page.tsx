import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/varicocele/contact-us",
  title: "Schedule Varicocele Treatment in San Antonio",
  description:
    "Request a varicocele evaluation and treatment appointment at The Urology Place in San Antonio.",
});

export default function ContactUsForVaricocelePage() {
  return (
    <ContactFormTemplate
      pageName="Varicocele"
      serviceName="Varicocele"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/varicocele/contact-us"
    />
  );
}
