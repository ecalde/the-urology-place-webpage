import { UroliftPageContent } from "@/app/components/urolift-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/enlarged-prostate/urolift",
  title: "UroLift for Enlarged Prostate in San Antonio",
  description:
    "UroLift System for BPH at The Urology Place in San Antonio. Minimally invasive implants, preserved sexual function, and how UroLift compares to other treatment options.",
});

export default function UroliftPage() {
  return <UroliftPageContent />;
}
