import type { Metadata } from "next";
import { RezumPageContent } from "@/app/components/rezum-page-content";

export const metadata: Metadata = {
  title: "Rezūm for Enlarged Prostate (BPH)",
  description:
    "Rezūm water vapor therapy for BPH at The Urology Place in San Antonio. Center of Excellence, in-office treatment, and lasting symptom relief with Dr. Naveen Kella.",
};

export default function RezumPage() {
  return <RezumPageContent />;
}
