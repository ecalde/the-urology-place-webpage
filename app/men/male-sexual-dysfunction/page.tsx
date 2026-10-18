import { MaleSexualDysfunctionPageContent } from "@/app/components/male-sexual-dysfunction-page-content";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/men/male-sexual-dysfunction",
  title: "Male Sexual Dysfunction Treatment in San Antonio",
  description:
    "Erectile dysfunction and male sexual health — symptoms, treatment options, and care at The Urology Place in San Antonio and Austin, Texas.",
});

export default function MaleSexualDysfunctionPage() {
  return <MaleSexualDysfunctionPageContent />;
}
