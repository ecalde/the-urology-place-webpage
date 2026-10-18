import type { Metadata } from "next";
import { ProstateBiopsyPageContent } from "@/app/components/prostate-biopsy-page-content";

export const metadata: Metadata = {
  title: "Transperineal Prostate Biopsy in San Antonio",
  description:
    "PSA screening and transperineal prostate biopsy with Navigo at The Urology Place in San Antonio — MRI fusion targeting, office-based care, and experienced ultrasound support.",
};

export default function PsaTransperinealProstateBiopsyPage() {
  return <ProstateBiopsyPageContent />;
}

