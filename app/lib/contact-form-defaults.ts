/**
 * Appointment reason options for the site-wide contact form (order matches UX spec).
 */
export const APPOINTMENT_REASON_OPTIONS = [
  "General Urology",
  "Hematuria",
  "Prostate Cancer",
  "Vanquish (Water Vapor Ablation)",
  "Circumcision",
  "Enlarged Prostate",
  "Prostatic Artery Embolization (PAE)",
  "Elevated PSA",
  "Bladder Cancer",
  "Erectile Dysfunction Treatment",
  "CaverStem",
  "Peyronie's Disease",
  "GAINSWave",
  "Varicocele",
  "Vasectomy",
  "Low Testosterone",
  "Urinary Incontinence",
  "Kidney Stones",
  "Hormone Replacement Therapy",
  "Other",
] as const;

export type AppointmentReasonOption = (typeof APPOINTMENT_REASON_OPTIONS)[number];

export const BEST_WAY_TO_REACH_OPTIONS = ["Phone", "Text", "Email"] as const;

export const BEST_TIME_TO_REACH_OPTIONS = [
  "Morning",
  "Afternoon",
  "Evening",
  "ASAP",
  "Other",
] as const;

/** Normalize page/service labels for lookup (case, apostrophes, spacing). */
export function normalizePageKey(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\u2019/g, "'")
    .replace(/\u2032/g, "'")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/\s+/g, " ");
}

/**
 * Maps `pageName` (and similar labels) to the default appointment reason dropdown value.
 * Falls back to "General Urology" when there is no exact match.
 */
const PAGE_TO_DEFAULT_REASON: Record<string, AppointmentReasonOption> = {
  "adult circumcision": "Circumcision",
  "enlarged prostate laser treatment": "Enlarged Prostate",
  "robotic prostatectomy": "Prostate Cancer",
  "radiation treatments": "Prostate Cancer",
  brachytherapy: "Prostate Cancer",
  "rectal spacer": "Prostate Cancer",
  "low testosterone": "Low Testosterone",
  "male sexual dysfunction": "Erectile Dysfunction Treatment",
  "itind for enlarged prostate (bph)": "Enlarged Prostate",
  urolift: "Enlarged Prostate",
  gainswave: "GAINSWave",
  hematuria: "Hematuria",
  "nuclear medicine": "Prostate Cancer",
  "urinary incontinence": "Urinary Incontinence",
  rezum: "Enlarged Prostate",
  "bladder cancer": "Bladder Cancer",
  "zusduri, bcg & en block": "Bladder Cancer",
  "peyronie's disease": "Peyronie's Disease",
  "prostate biopsies": "Prostate Cancer",
  "prostate biopsy": "Prostate Cancer",
  "psa / transperineal prostate biopsy": "Prostate Cancer",
  "kidney stones": "Kidney Stones",
  "prostate cancer": "Prostate Cancer",
  "emsella for incontinence": "Urinary Incontinence",
  "bulkamid for stress incontinence": "Urinary Incontinence",
  "enlarged prostate": "Enlarged Prostate",
  vasectomy: "Vasectomy",
  "hormone replacement therapy": "Hormone Replacement Therapy",
  "tulsa for prostate": "Prostate Cancer",
  vanquish: "Vanquish (Water Vapor Ablation)",
  "prostatic artery embolization (pae)": "Prostatic Artery Embolization (PAE)",
  varicocele: "Varicocele",
  "men's wellness": "General Urology",
  home: "General Urology",
  "patient resources": "General Urology",
  "general inquiry": "General Urology",
};

export function getDefaultAppointmentReasonForPage(pageName: string): AppointmentReasonOption {
  const key = normalizePageKey(pageName);
  const mapped = PAGE_TO_DEFAULT_REASON[key];
  if (
    mapped &&
    (APPOINTMENT_REASON_OPTIONS as readonly string[]).includes(mapped)
  ) {
    return mapped;
  }
  return "General Urology";
}
