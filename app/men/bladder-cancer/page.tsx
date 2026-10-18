import { BladderCancerPageContent } from "@/app/components/bladder-cancer-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/bladder-cancer",
  title: "Bladder Cancer Treatment in San Antonio",
  description:
    "Bladder cancer diagnosis and treatment for men at The Urology Place in San Antonio, including surveillance and office-based therapy.",
});

export default function BladderCancerMenPage() {
  return (
    <BladderCancerPageContent
      category="Men"
      sourcePath="/men/bladder-cancer"
      idPrefix="men-bladder-cancer"
    />
  );
}
