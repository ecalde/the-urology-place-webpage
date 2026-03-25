import type { Metadata } from "next";
import { MaleSexualDysfunctionPageContent } from "@/app/components/male-sexual-dysfunction-page-content";

export const metadata: Metadata = {
  title: "Male Sexual Dysfunction",
  description:
    "Erectile dysfunction and male sexual health — symptoms, treatment options, and care at The Urology Place in San Antonio and Austin, Texas.",
};

export default function MaleSexualDysfunctionPage() {
  return <MaleSexualDysfunctionPageContent />;
}
