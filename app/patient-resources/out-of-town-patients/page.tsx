import { OutOfTownPatientsPageContent } from "@/app/components/out-of-town-patients-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/patient-resources/out-of-town-patients",
  title: "Out-of-Town Urology Patients in San Antonio",
  description:
    "Traveling to San Antonio for care at The Urology Place — virtual consultation, scheduling, procedures, and hotel accommodations.",
});

export default function OutOfTownPatientsPage() {
  return <OutOfTownPatientsPageContent />;
}
