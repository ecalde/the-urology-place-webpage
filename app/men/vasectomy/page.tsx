import type { Metadata } from "next";
import { VasectomyPageContent } from "@/app/components/vasectomy-page-content";

export const metadata: Metadata = {
  title: "No-Scalpel Vasectomy in San Antonio",
};

export default function VasectomyPage() {
  return <VasectomyPageContent />;
}
