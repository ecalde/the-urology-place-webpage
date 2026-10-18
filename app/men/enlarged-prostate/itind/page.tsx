import { ItindForBphPageContent } from "@/app/components/itind-for-bph-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/itind",
  title: "iTind for Enlarged Prostate in San Antonio",
  description:
    "iTind reshapes the prostatic urethra to improve urine flow—no burning, cutting, or permanent implant. Outpatient procedure with Dr. Naveen Kella at The Urology Place in San Antonio.",
});

export default function ItindForBphPage() {
  return <ItindForBphPageContent />;
}
