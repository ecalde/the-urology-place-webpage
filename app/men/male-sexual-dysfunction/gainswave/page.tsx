import type { Metadata } from "next";
import { GainswavePageContent } from "@/app/components/gainswave-page-content";

export const metadata: Metadata = {
  title: "GAINSWave for Erectile Dysfunction in San Antonio",
  description:
    "GAINSWave low-intensity shockwave therapy for erectile dysfunction — drug-free, non-invasive treatment at The Urology Place in San Antonio and Austin.",
};

export default function GainswavePage() {
  return <GainswavePageContent />;
}
