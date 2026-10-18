import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/tulsa-for-prostate/contact-us",
  title: "Schedule TULSA-PRO in San Antonio",
  description:
    "Request a TULSA-PRO prostate treatment consultation at The Urology Place in San Antonio.",
});

export default function ContactUsForTulsaForProstatePage() {
  return (
    <ContactFormTemplate
      pageName="TULSA for Prostate"
      serviceName="TULSA for Prostate"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/tulsa-for-prostate/contact-us"
    />
  );
}

