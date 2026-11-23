import {
  TreatmentRoutePage,
  treatmentRouteMetadata,
} from "@/app/components/treatment-page/treatment-route";
import { loadTreatmentStaticParams } from "@/app/lib/treatment-page-load";

/**
 * Published Men treatment pages. A concrete page.tsx, such as vasectomy,
 * still wins over this required catch-all. The literal revalidate value is
 * repeated in the Women route so Next.js can read both statically.
 */
export const revalidate = 86400;
export const dynamicParams = true;

type RouteParams = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return loadTreatmentStaticParams("men");
}

export function generateMetadata({ params }: RouteParams) {
  return treatmentRouteMetadata("men", params);
}

export default function MenTreatmentPage({ params }: RouteParams) {
  return TreatmentRoutePage({ section: "men", params });
}
