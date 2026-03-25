import type { Metadata } from "next";
import { PeyroniesDiseasePageContent } from "@/app/components/peyronies-disease-page-content";

export const metadata: Metadata = {
  title: "Peyronie's Disease",
  description:
    "Peyronie's disease — curvature of the penis, symptoms, causes, and treatment options including Xiaflex and alternatives at The Urology Place.",
};

export default function PeyroniesDiseasePage() {
  return <PeyroniesDiseasePageContent />;
}
