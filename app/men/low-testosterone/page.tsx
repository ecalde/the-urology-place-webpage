import { LowTestosteronePageContent } from "@/app/components/low-testosterone-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/low-testosterone",
  title: "Low Testosterone Treatment in San Antonio",
  description:
    "Low testosterone evaluation and treatment for men at The Urology Place in San Antonio.",
});

export default function LowTestosteronePage() {
  return <LowTestosteronePageContent />;
}
