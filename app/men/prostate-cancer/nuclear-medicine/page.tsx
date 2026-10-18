import { NuclearMedicinePageContent } from "@/app/components/nuclear-medicine-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/nuclear-medicine",
  title: "Pluvicto PSMA Therapy in San Antonio",
  description:
    "Lutetium-177 PSMA therapy (Pluvicto) for advanced prostate cancer at The Urology Place in San Antonio. Qualifications, how it works, follow-up care, and side effects.",
});

export default function NuclearMedicinePage() {
  return <NuclearMedicinePageContent />;
}
