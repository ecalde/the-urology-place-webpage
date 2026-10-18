import { AdultCircumcisionPageContent } from "@/app/components/adult-circumcision-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/adult-circumcision",
  title: "Adult Circumcision in San Antonio",
  description:
    "Board-certified urologists in San Antonio perform in-office adult circumcision with local anesthesia and nitrous oxide. Telemedicine for out-of-town patients. The Urology Place.",
});

export default function AdultCircumcisionPage() {
  return <AdultCircumcisionPageContent />;
}
