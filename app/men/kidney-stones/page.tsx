import type { Metadata } from "next";
import { KidneyStonesPageContent } from "@/app/components/kidney-stones-page-content";

export const metadata: Metadata = {
  title: "Kidney Stone Treatment for Men in San Antonio",
};

export default function KidneyStonesMenPage() {
  return (
    <KidneyStonesPageContent
      category="Men"
      sourcePath="/men/kidney-stones"
      idPrefix="men-kidney-stones"
    />
  );
}

