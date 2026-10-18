import type { Metadata } from "next";
import { KidneyStonesPageContent } from "@/app/components/kidney-stones-page-content";

export const metadata: Metadata = {
  title: "Kidney Stone Treatment for Women in San Antonio",
};

export default function KidneyStonesWomenPage() {
  return (
    <KidneyStonesPageContent
      category="Women"
      sourcePath="/women/kidney-stones"
      idPrefix="women-kidney-stones"
    />
  );
}

