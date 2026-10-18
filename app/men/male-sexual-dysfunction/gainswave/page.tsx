import { GainswavePageContent } from "@/app/components/gainswave-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/gainswave",
  title: "GAINSWave for Erectile Dysfunction in San Antonio",
  description:
    "GAINSWave low-intensity shockwave therapy for erectile dysfunction — drug-free, non-invasive treatment at The Urology Place in San Antonio and Austin.",
});

export default function GainswavePage() {
  return <GainswavePageContent />;
}
