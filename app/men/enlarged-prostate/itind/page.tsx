import type { Metadata } from "next";
import { ItindForBphPageContent } from "@/app/components/itind-for-bph-page-content";

export const metadata: Metadata = {
  title: "iTind for Enlarged Prostate (BPH)",
  description:
    "iTind reshapes the prostatic urethra to improve urine flow—no burning, cutting, or permanent implant. Outpatient procedure with Dr. Naveen Kella at The Urology Place in San Antonio.",
};

export default function ItindForBphPage() {
  return <ItindForBphPageContent />;
}
