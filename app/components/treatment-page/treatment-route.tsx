import { notFound, redirect } from "next/navigation";

import { TreatmentPageView } from "@/app/components/treatment-page/treatment-page-view";
import { treatmentPageMetadata } from "@/app/lib/treatment-page-metadata";
import { getTreatmentPage } from "@/app/lib/treatment-page-load";
import type { TreatmentSection } from "@/studio/schemaTypes/treatmentPage/constants";

type RouteParams = Promise<{ slug: string[] }>;

async function loadTreatmentRoute(section: TreatmentSection, params: RouteParams) {
  const { slug } = await params;
  return getTreatmentPage(section, slug.join("/"));
}

export async function treatmentRouteMetadata(
  section: TreatmentSection,
  params: RouteParams,
) {
  const result = await loadTreatmentRoute(section, params);
  if (result.status === "redirect") redirect(result.path);
  // A thrown Sanity error must not reach this line. notFound() is only for a query that succeeded and found nothing.
  if (result.status !== "render") notFound();
  return treatmentPageMetadata(result.page);
}

export async function TreatmentRoutePage({
  section,
  params,
}: {
  section: TreatmentSection;
  params: RouteParams;
}) {
  const result = await loadTreatmentRoute(section, params);
  if (result.status === "redirect") redirect(result.path);
  // A thrown Sanity error must not reach this line. notFound() is only for a query that succeeded and found nothing.
  if (result.status !== "render") notFound();
  return <TreatmentPageView page={result.page} />;
}
