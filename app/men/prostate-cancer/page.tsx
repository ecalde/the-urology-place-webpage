import { ProstateCancerPageContent } from "@/app/components/prostate-cancer-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/prostate-cancer",
  title: "Prostate Cancer Treatment in San Antonio",
  description:
    "Prostate cancer treatment at The Urology Place in San Antonio — robotic surgery, radiation perspectives, active surveillance, and second opinions with Dr. Naveen Kella.",
});

export default function ProstateCancerMenPage() {
  return <ProstateCancerPageContent />;
}
