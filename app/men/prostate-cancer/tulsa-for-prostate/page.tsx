import type { Metadata } from "next";
import { TulsaForProstatePageContent } from "@/app/components/tulsa-for-prostate-page-content";

export const metadata: Metadata = {
  title: "TULSA-PRO for Prostate Cancer in San Antonio",
  description: "TULSA-PRO transurethral ultrasound ablation for prostate cancer at The Urology Place in San Antonio.",
};

export default function TulsaForProstatePage() {
  return <TulsaForProstatePageContent />;
}
