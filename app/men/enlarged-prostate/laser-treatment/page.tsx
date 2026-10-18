import type { Metadata } from "next";
import { LaserTreatmentPageContent } from "@/app/components/laser-treatment-page-content";

export const metadata: Metadata = {
  title: "Laser Treatment for BPH in San Antonio",
  description:
    "Greenlight and Thulium laser photoselective vaporization for BPH at The Urology Place in San Antonio. Symptom relief, safety, and how laser compares to TURP and other options.",
};

export default function LaserTreatmentPage() {
  return <LaserTreatmentPageContent />;
}
