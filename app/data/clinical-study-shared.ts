export type ClinicalStudyStatus =
  | "Active and Enrolling"
  | "Active, Not Enrolling"
  | "Coming Soon";

export type ClinicalStudy = {
  name: string;
  fullName?: string;
  status: ClinicalStudyStatus;
  description: string;
  nct?: string;
  image: string;
  imageAlt: string;
};

export type ClinicalStudyFilter =
  | "all"
  | "enrolling"
  | "not-enrolling"
  | "coming-soon";

export const CLINICAL_STUDY_FILTERS: {
  id: ClinicalStudyFilter;
  label: string;
}[] = [
  { id: "all", label: "All Studies" },
  { id: "enrolling", label: "Active and Enrolling" },
  { id: "not-enrolling", label: "Active, Not Enrolling" },
  { id: "coming-soon", label: "Coming Soon" },
];

export function matchesClinicalStudyFilter(
  study: ClinicalStudy,
  filter: ClinicalStudyFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "enrolling") return study.status === "Active and Enrolling";
  if (filter === "not-enrolling") return study.status === "Active, Not Enrolling";
  return study.status === "Coming Soon";
}

export function clinicalStudyStatusColorClass(status: ClinicalStudyStatus): string {
  if (status === "Active and Enrolling") return "text-emerald-700";
  if (status === "Active, Not Enrolling") return "text-red-600";
  return "text-amber-700";
}
