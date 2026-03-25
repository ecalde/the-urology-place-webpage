import type { Metadata } from "next";
import { OutOfTownPatientsPageContent } from "@/app/components/out-of-town-patients-page-content";

export const metadata: Metadata = {
  title: "Out of Town Patients",
  description:
    "Traveling to San Antonio for care at The Urology Place — virtual consultation, scheduling, procedures, and hotel accommodations.",
};

export default function OutOfTownPatientsPage() {
  return <OutOfTownPatientsPageContent />;
}
