import { LaserTreatmentPageContent } from "@/app/components/laser-treatment-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/laser-treatment",
  title: "Laser Treatment for BPH in San Antonio",
  description:
    "Greenlight and Thulium laser photoselective vaporization for BPH at The Urology Place in San Antonio. Symptom relief, safety, and how laser compares to TURP and other options.",
});

export default function LaserTreatmentPage() {
  return <LaserTreatmentPageContent />;
}
