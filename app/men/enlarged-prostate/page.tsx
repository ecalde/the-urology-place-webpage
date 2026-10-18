import { EnlargedProstatePageContent } from "@/app/components/enlarged-prostate-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate",
  title: "Enlarged Prostate (BPH) Treatment in San Antonio",
  description:
    "Benign prostatic hyperplasia (BPH) — symptoms, staging, and treatment options at The Urology Place in San Antonio.",
});

export default function EnlargedProstatePage() {
  return <EnlargedProstatePageContent />;
}
