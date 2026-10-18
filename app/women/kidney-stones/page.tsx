import { KidneyStonesPageContent } from "@/app/components/kidney-stones-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/women/kidney-stones",
  title: "Kidney Stone Treatment for Women in San Antonio",
  description:
    "Kidney stone diagnosis and treatment for women at The Urology Place in San Antonio, including prevention and procedure options.",
});

export default function KidneyStonesWomenPage() {
  return (
    <KidneyStonesPageContent
      category="Women"
      sourcePath="/women/kidney-stones"
      idPrefix="women-kidney-stones"
    />
  );
}

