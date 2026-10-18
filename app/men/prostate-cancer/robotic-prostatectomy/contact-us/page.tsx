import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/robotic-prostatectomy/contact-us",
  title: "Schedule Robotic Prostatectomy in San Antonio",
  description:
    "Request a robotic prostatectomy consultation with Dr. Naveen Kella at The Urology Place in San Antonio.",
});

export default function ContactUsForRoboticProstatectomyPage() {
  return (
    <ContactFormTemplate
      pageName="Robotic Prostatectomy"
      serviceName="Robotic Prostatectomy"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/robotic-prostatectomy/contact-us"
    />
  );
}

