import Link from "next/link";

import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { safeTreatmentHref } from "@/app/lib/treatment-links";
import type { TreatmentBlock } from "@/app/lib/treatment-pages";

export function TreatmentCallToAction({ block }: { block: TreatmentBlock }) {
  const label = block.label?.trim();
  const href = safeTreatmentHref(block.href);
  if (!label || !href) {
    console.warn("[treatment-page] skipped treatmentCallToAction: invalid link");
    return null;
  }
  const className = `inline-block ${BTN_PRIMARY}`;
  if (href.startsWith("https://")) {
    return (
      <div className="text-center">
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </div>
    );
  }
  return (
    <div className="text-center">
      <Link href={href} className={className}>
        {label}
      </Link>
    </div>
  );
}
