import type { Metadata } from "next";
import { LowTestosteronePageContent } from "@/app/components/low-testosterone-page-content";

export const metadata: Metadata = {
  title: "Low Testosterone Treatment in San Antonio",
};

export default function LowTestosteronePage() {
  return <LowTestosteronePageContent />;
}
