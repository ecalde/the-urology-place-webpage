import { VaricocelePageContent } from "@/app/components/varicocele-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction/varicocele",
  title: "Varicocele Treatment in San Antonio, TX",
  description:
    "Varicocele embolization at The Urology Place in San Antonio. Minimally invasive, image-guided treatment for pain relief and fertility support without surgery.",
});

export default function VaricocelePage() {
  return <VaricocelePageContent />;
}
