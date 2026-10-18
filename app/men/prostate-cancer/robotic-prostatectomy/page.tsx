import type { Metadata } from "next";
import { RoboticProstatectomyPageContent } from "@/app/components/robotic-prostatectomy-page-content";

export const metadata: Metadata = {
  title: "Robotic Prostatectomy in San Antonio",
  description:
    "Robotic prostatectomy with Dr. Naveen Kella at The Urology Place in San Antonio — experienced team, advanced technology, and resources for recovery.",
};

export default function RoboticProstatectomyPage() {
  return <RoboticProstatectomyPageContent />;
}
