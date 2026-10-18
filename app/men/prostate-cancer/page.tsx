import type { Metadata } from "next";
import { ProstateCancerPageContent } from "@/app/components/prostate-cancer-page-content";

export const metadata: Metadata = {
  title: "Prostate Cancer Treatment in San Antonio",
  description:
    "Prostate cancer treatment at The Urology Place in San Antonio — robotic surgery, radiation perspectives, active surveillance, and second opinions with Dr. Naveen Kella.",
};

export default function ProstateCancerMenPage() {
  return <ProstateCancerPageContent />;
}
