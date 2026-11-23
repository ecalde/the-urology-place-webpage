import Link from "next/link";

import { safeTreatmentHref } from "@/app/lib/treatment-links";
import {
  treatmentLinkLabel,
  treatmentPublicPath,
  type TreatmentBlock,
} from "@/app/lib/treatment-pages";

function relatedTarget(block: TreatmentBlock): { href: string; title: string } | null {
  if (block.linkKind === "treatment") {
    const treatment = block.treatment;
    const title = treatment?.title?.trim();
    const href = treatment
      ? treatmentPublicPath({
          section: treatment.section,
          parentPath: treatment.parentPath,
          slug: treatment.slug,
        })
      : null;
    if (!title || !href) return null;
    return { href, title };
  }
  if (block.linkKind === "path") {
    const href = safeTreatmentHref(block.manualPath);
    if (!href || href.startsWith("https://")) return null;
    return { href, title: treatmentLinkLabel(href) };
  }
  return null;
}

export function TreatmentRelated({ block }: { block: TreatmentBlock }) {
  const target = relatedTarget(block);
  if (!target) {
    console.warn("[treatment-page] skipped treatmentRelated: missing link");
    return null;
  }
  return (
    <Link
      href={target.href}
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <h2 className="text-lg font-bold tracking-tight text-slate-900">{target.title}</h2>
      <span className="mt-5 text-sm font-semibold text-blue-600">Learn more</span>
    </Link>
  );
}
