import { KidneyStonesPageContent } from "@/app/components/kidney-stones-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/kidney-stones",
  title: "Kidney Stone Treatment for Men in San Antonio",
  description:
    "Kidney stone diagnosis and treatment for men at The Urology Place in San Antonio, including prevention and procedure options.",
});

export default function KidneyStonesMenPage() {
  return (
    <KidneyStonesPageContent
      category="Men"
      sourcePath="/men/kidney-stones"
      idPrefix="men-kidney-stones"
    />
  );
}

