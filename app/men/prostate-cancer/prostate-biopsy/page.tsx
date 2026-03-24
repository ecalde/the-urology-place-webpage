import type { Metadata } from "next";
import { ProstateBiopsyPageContent } from "@/app/components/prostate-biopsy-page-content";

export const metadata: Metadata = {
  title: "Prostate Biopsy",
  description:
    "Fusion and transperineal prostate biopsy with UroNav at The Urology Place in San Antonio — MRI fusion targeting, office-based care, and experienced ultrasound support.",
};

export default function ProstateBiopsyPage() {
  return <ProstateBiopsyPageContent />;
}
