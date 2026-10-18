import type { Metadata } from "next";
import { EnlargedProstatePageContent } from "@/app/components/enlarged-prostate-page-content";

export const metadata: Metadata = {
  title: "Enlarged Prostate (BPH) Treatment in San Antonio",
  description:
    "Benign prostatic hyperplasia (BPH) — symptoms, staging, and treatment options at The Urology Place in San Antonio.",
};

export default function EnlargedProstatePage() {
  return <EnlargedProstatePageContent />;
}
