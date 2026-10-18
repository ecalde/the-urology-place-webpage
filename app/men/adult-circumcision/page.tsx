import type { Metadata } from "next";
import { AdultCircumcisionPageContent } from "@/app/components/adult-circumcision-page-content";

export const metadata: Metadata = {
  title: "Adult Circumcision in San Antonio",
  description:
    "Board-certified urologists in San Antonio perform in-office adult circumcision with local anesthesia and nitrous oxide. Telemedicine for out-of-town patients. The Urology Place.",
};

export default function AdultCircumcisionPage() {
  return <AdultCircumcisionPageContent />;
}
