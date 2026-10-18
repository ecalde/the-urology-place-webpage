import { VasectomyPageContent } from "@/app/components/vasectomy-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/vasectomy",
  title: "No-Scalpel Vasectomy in San Antonio",
  description:
    "No-scalpel, no-needle vasectomy in the office at The Urology Place in San Antonio, with nitrous oxide available for comfort.",
});

export default function VasectomyPage() {
  return <VasectomyPageContent />;
}
