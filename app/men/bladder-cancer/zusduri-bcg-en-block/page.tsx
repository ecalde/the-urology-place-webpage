import type { Metadata } from "next";
import { ZusduriBcgPageContent } from "@/app/men/bladder-cancer/zusduri-bcg/page";

export const metadata: Metadata = {
  title: "Zusduri & BCG Bladder Cancer Treatment in San Antonio",
  description:
    "Advanced bladder cancer treatment options including Zusduri, BCG, and En Block at The Urology Place in San Antonio.",
};

export default function ZusduriBcgEnBlockPage() {
  return <ZusduriBcgPageContent />;
}

