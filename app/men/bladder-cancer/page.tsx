import type { Metadata } from "next";
import { BladderCancerPageContent } from "@/app/components/bladder-cancer-page-content";

export const metadata: Metadata = {
  title: "Bladder Cancer Treatment in San Antonio",
};

export default function BladderCancerMenPage() {
  return (
    <BladderCancerPageContent
      category="Men"
      sourcePath="/men/bladder-cancer"
      idPrefix="men-bladder-cancer"
    />
  );
}
