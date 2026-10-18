import { redirect } from "next/navigation";
import { ProstateBiopsyPageContent } from "@/app/components/prostate-biopsy-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/transperineal-prostate-biopsy",
  title: "Transperineal Prostate Biopsy in San Antonio",
  description:
    "Fusion and transperineal prostate biopsy with Navigo at The Urology Place in San Antonio — MRI fusion targeting, office-based care, and experienced ultrasound support.",
});

export default function TransperinealProstateBiopsyPage() {
  redirect("/men/prostate-cancer/psa-transperineal-prostate-biopsy");
}
