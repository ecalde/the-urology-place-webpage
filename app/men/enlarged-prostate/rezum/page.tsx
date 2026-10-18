import { RezumPageContent } from "@/app/components/rezum-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/rezum",
  title: "Rezūm for Enlarged Prostate in San Antonio",
  description:
    "Rezūm water vapor therapy for BPH at The Urology Place in San Antonio. Center of Excellence, in-office treatment, and lasting symptom relief with Dr. Naveen Kella.",
});

export default function RezumPage() {
  return <RezumPageContent />;
}
