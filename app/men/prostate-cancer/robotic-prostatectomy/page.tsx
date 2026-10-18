import { RoboticProstatectomyPageContent } from "@/app/components/robotic-prostatectomy-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer/robotic-prostatectomy",
  title: "Robotic Prostatectomy in San Antonio",
  description:
    "Robotic prostatectomy with Dr. Naveen Kella at The Urology Place in San Antonio — experienced team, advanced technology, and resources for recovery.",
});

export default function RoboticProstatectomyPage() {
  return <RoboticProstatectomyPageContent />;
}
