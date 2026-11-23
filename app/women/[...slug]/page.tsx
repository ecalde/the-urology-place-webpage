import {
  TreatmentRoutePage,
  treatmentRouteMetadata,
} from "@/app/components/treatment-page/treatment-route";
import { loadTreatmentStaticParams } from "@/app/lib/treatment-page-load";

/**
 * Published Women treatment pages. A concrete page.tsx, such as Bulkamid,
 * still wins over this required catch-all. The literal revalidate value is
 * repeated in the Men route so Next.js can read both statically.
 */
export const revalidate = 86400;
export const dynamicParams = true;

type RouteParams = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return loadTreatmentStaticParams("women");
}

export function generateMetadata({ params }: RouteParams) {
  return treatmentRouteMetadata("women", params);
}

export default function WomenTreatmentPage({ params }: RouteParams) {
  return TreatmentRoutePage({ section: "women", params });
}
