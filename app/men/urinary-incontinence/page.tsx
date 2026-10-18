import type { Metadata } from "next";
import { MenUrinaryIncontinencePageContent } from "@/app/components/men-urinary-incontinence-page-content";

export const metadata: Metadata = {
  title: "Male Urinary Incontinence Treatment in San Antonio",
};

export default function UrinaryIncontinenceMenPage() {
  return <MenUrinaryIncontinencePageContent />;
}
