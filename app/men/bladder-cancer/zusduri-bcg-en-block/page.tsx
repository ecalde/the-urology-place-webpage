import { ZusduriBcgPageContent } from "@/app/men/bladder-cancer/zusduri-bcg/page";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/bladder-cancer/zusduri-bcg-en-block",
  title: "Zusduri & BCG Bladder Cancer Treatment in San Antonio",
  description:
    "Advanced bladder cancer treatment options including Zusduri, BCG, and En Block at The Urology Place in San Antonio.",
});

export default function ZusduriBcgEnBlockPage() {
  return <ZusduriBcgPageContent />;
}

