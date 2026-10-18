import { PeyroniesDiseasePageContent } from "@/app/components/peyronies-disease-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/peyronies",
  title: "Peyronie's Disease Treatment in San Antonio",
  description:
    "Peyronie's disease — curvature of the penis, symptoms, causes, and treatment options including Xiaflex and alternatives at The Urology Place.",
});

export default function PeyroniesDiseasePage() {
  return <PeyroniesDiseasePageContent />;
}
