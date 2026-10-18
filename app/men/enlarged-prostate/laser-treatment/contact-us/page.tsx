import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/laser-treatment/contact-us",
  title: "Schedule Prostate Laser Treatment in San Antonio",
  description:
    "Request a GreenLight or thulium laser prostate treatment appointment at The Urology Place in San Antonio.",
});

export default function ContactUsForLaserTreatmentPage() {
  return (
    <ContactFormTemplate
      pageName="Enlarged Prostate Laser Treatment"
      serviceName="Enlarged Prostate Laser Treatment"
      category="Men > Enlarged Prostate"
      sourcePath="/men/enlarged-prostate/laser-treatment/contact-us"
    />
  );
}

