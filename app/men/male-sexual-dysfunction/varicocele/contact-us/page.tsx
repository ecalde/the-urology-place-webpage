import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

export const metadata: Metadata = {
  title: "Schedule Varicocele Treatment in San Antonio",
};

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
