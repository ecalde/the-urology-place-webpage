import type { Metadata } from "next";
import { UroliftPageContent } from "@/app/components/urolift-page-content";

export const metadata: Metadata = {
  title: "UroLift for Enlarged Prostate (BPH)",
  description:
    "UroLift System for BPH at The Urology Place in San Antonio. Minimally invasive implants, preserved sexual function, and how UroLift compares to other treatment options.",
};

export default function UroliftPage() {
  return <UroliftPageContent />;
}
