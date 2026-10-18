import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/prostate-biopsies/contact-us",
  title: "Schedule a Prostate Biopsy in San Antonio",
  description:
    "Request a transperineal prostate biopsy appointment at The Urology Place in San Antonio.",
});

export default function ContactUsForProstateBiopsiesPage() {
  return (
    <ContactFormTemplate
      pageName="Prostate Biopsies"
      serviceName="Prostate Biopsies"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/prostate-biopsies/contact-us"
    />
  );
}

