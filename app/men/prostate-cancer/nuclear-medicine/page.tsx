import type { Metadata } from "next";
import { NuclearMedicinePageContent } from "@/app/components/nuclear-medicine-page-content";

export const metadata: Metadata = {
  title: "Nuclear Medicine — Pluvicto (Lutetium-177 PSMA)",
  description:
    "Lutetium-177 PSMA therapy (Pluvicto) for advanced prostate cancer at The Urology Place in San Antonio. Qualifications, how it works, follow-up care, and side effects.",
};

export default function NuclearMedicinePage() {
  return <NuclearMedicinePageContent />;
}
