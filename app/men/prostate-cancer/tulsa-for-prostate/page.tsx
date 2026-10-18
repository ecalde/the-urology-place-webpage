import { TulsaForProstatePageContent } from "@/app/components/tulsa-for-prostate-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/tulsa-for-prostate",
  title: "TULSA-PRO for Prostate Cancer in San Antonio",
  description:
    "TULSA-PRO transurethral ultrasound ablation for prostate cancer at The Urology Place in San Antonio.",
});

export default function TulsaForProstatePage() {
  return <TulsaForProstatePageContent />;
}
