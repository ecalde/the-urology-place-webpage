import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/gainswave/contact-us",
  title: "Schedule GAINSWave in San Antonio",
  description:
    "Request a GAINSWave shockwave therapy appointment for erectile dysfunction at The Urology Place in San Antonio.",
});

export default function ContactUsForGainswavePage() {
  return (
    <ContactFormTemplate
      pageName="GAINSWave"
      serviceName="GAINSWave"
      category="Men > Male Sexual Dysfunction"
      sourcePath="/men/male-sexual-dysfunction/gainswave/contact-us"
    />
  );
}

