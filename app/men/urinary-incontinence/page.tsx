import { MenUrinaryIncontinencePageContent } from "@/app/components/men-urinary-incontinence-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/urinary-incontinence",
  title: "Male Urinary Incontinence Treatment in San Antonio",
  description:
    "Male urinary incontinence treatment at The Urology Place in San Antonio, including evaluation and options to improve bladder control.",
});

export default function UrinaryIncontinenceMenPage() {
  return <MenUrinaryIncontinencePageContent />;
}
