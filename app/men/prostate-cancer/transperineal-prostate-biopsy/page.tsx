import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProstateBiopsyPageContent } from "@/app/components/prostate-biopsy-page-content";

export const metadata: Metadata = {
  title: "Transperineal Prostate Biopsy in San Antonio",
  description:
    "Fusion and transperineal prostate biopsy with Navigo at The Urology Place in San Antonio — MRI fusion targeting, office-based care, and experienced ultrasound support.",
};

export default function TransperinealProstateBiopsyPage() {
  redirect("/men/prostate-cancer/psa-transperineal-prostate-biopsy");
}
