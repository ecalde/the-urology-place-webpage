export type ClinicalStudyEligibility = {
  title: string;
  requirements: string[];
};

export const PROSTATE_CANCER_STUDY_ELIGIBILITY: ClinicalStudyEligibility = {
  title: "Prostate Cancer",
  requirements: [
    "Histologically confirmed prostate cancer",
    "Age 18 years or older",
    "Willing and able to provide informed consent",
    "Meeting additional study-specific eligibility requirements",
  ],
};

export const BLADDER_CANCER_STUDY_ELIGIBILITY: ClinicalStudyEligibility = {
  title: "Bladder Cancer",
  requirements: [
    "Diagnosis of bladder cancer or microscopic hematuria",
    "Age 18 years or older",
    "Willing and able to provide informed consent",
    "Meeting additional study-specific eligibility requirements",
  ],
};

export const BPH_STUDY_ELIGIBILITY: ClinicalStudyEligibility = {
  title: "BPH",
  requirements: [
    "Male patients with lower urinary tract symptoms due to benign prostatic hyperplasia",
    "Age requirements vary by study",
    "Willing and able to provide informed consent",
    "Meeting additional study-specific eligibility requirements",
  ],
};

export const URINARY_INCONTINENCE_STUDY_ELIGIBILITY: ClinicalStudyEligibility = {
  title: "Urinary Incontinence",
  requirements: [
    "Diagnosis of urinary incontinence or overactive bladder symptoms",
    "Age 18 years or older",
    "Willing and able to provide informed consent",
    "Meeting additional study-specific eligibility requirements",
  ],
};

export const HYPERTENSION_STUDY_ELIGIBILITY: ClinicalStudyEligibility = {
  title: "Hypertension",
  requirements: [
    "High blood pressure that remains above goal while taking blood pressure medication",
    "Age requirements vary by study",
    "Willing and able to provide informed consent",
    "Meeting additional study-specific eligibility requirements",
  ],
};
