import { Navbar } from "@/app/components/navbar";
import { getTreatmentNav } from "@/app/lib/treatment-nav-load";

/** Server wrapper. The navbar stays a client component and does not call Sanity. */
export async function SiteNavbar() {
  const treatmentLinks = await getTreatmentNav();
  return <Navbar treatmentLinks={treatmentLinks} />;
}
