// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
//
// Regenerate with:  npm run routes:generate
// Verify freshness: npm run routes:check
//
// Source of truth: app/**/page.tsx and next.config.ts redirects.
// This manifest powers the read-only "Pages" inventory in Sanity Studio.
// It creates no Sanity documents and adds no Sanity fetches to public pages.

export type SanityStatus = "hardcoded" | "partial" | "managed";
export type RouteKind = "static" | "dynamic";

export interface RouteInventoryEntry {
  /** URL path as served by Next.js (e.g. "/men/vasectomy"). */
  path: string;
  /** Human-friendly label shown in Studio. */
  title: string;
  /** Display group (Home, Men, Women, ...). */
  group: string;
  /** Whether the route is static or contains a dynamic segment. */
  kind: RouteKind;
  /** Source file, relative to the repo root. */
  sourceFile: string;
  /** How much of the page is editable in Sanity today. */
  sanityStatus: SanityStatus;
  /** Optional detail about the current Sanity integration. */
  sanityNote?: string;
}

export interface RedirectEntry {
  source: string;
  destination: string;
  permanent: boolean;
}

/** Ordered list of display groups. */
export const routeGroups: string[] = [
  "Home",
  "Men",
  "Women",
  "Clinical Research",
  "Patient Resources",
  "Other"
];

/** Every public route template, excluding /studio. */
export const routeInventory: RouteInventoryEntry[] = [
  {
    "path": "/",
    "title": "Home",
    "group": "Home",
    "kind": "static",
    "sourceFile": "app/page.tsx",
    "sanityStatus": "partial",
    "sanityNote": "\"What's New\" announcement slider is Sanity-driven; the rest is hardcoded."
  },
  {
    "path": "/about-us",
    "title": "About Us",
    "group": "Other",
    "kind": "static",
    "sourceFile": "app/about-us/page.tsx",
    "sanityStatus": "partial",
    "sanityNote": "Team sections are Sanity-driven; intro/community content is hardcoded."
  },
  {
    "path": "/circumcision-photos",
    "title": "Circumcision Photos",
    "group": "Other",
    "kind": "static",
    "sourceFile": "app/circumcision-photos/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/clinical-research",
    "title": "Clinical Research",
    "group": "Clinical Research",
    "kind": "static",
    "sourceFile": "app/clinical-research/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/clinical-research/bladder-cancer-studies",
    "title": "Bladder Cancer Studies",
    "group": "Clinical Research",
    "kind": "static",
    "sourceFile": "app/clinical-research/bladder-cancer-studies/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/clinical-research/bph-studies",
    "title": "BPH Studies",
    "group": "Clinical Research",
    "kind": "static",
    "sourceFile": "app/clinical-research/bph-studies/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/clinical-research/prostate-cancer-studies",
    "title": "Prostate Cancer Studies",
    "group": "Clinical Research",
    "kind": "static",
    "sourceFile": "app/clinical-research/prostate-cancer-studies/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/clinical-research/renal-studies",
    "title": "Renal Studies",
    "group": "Clinical Research",
    "kind": "static",
    "sourceFile": "app/clinical-research/renal-studies/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/clinical-research/urinary-incontinence-studies",
    "title": "Urinary Incontinence Studies",
    "group": "Clinical Research",
    "kind": "static",
    "sourceFile": "app/clinical-research/urinary-incontinence-studies/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/financing",
    "title": "Financing",
    "group": "Other",
    "kind": "static",
    "sourceFile": "app/financing/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/in-office-anesthesia",
    "title": "In Office Anesthesia",
    "group": "Other",
    "kind": "static",
    "sourceFile": "app/in-office-anesthesia/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/join-our-team",
    "title": "Join Our Team",
    "group": "Other",
    "kind": "static",
    "sourceFile": "app/join-our-team/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men",
    "title": "Men",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/adult-circumcision",
    "title": "Adult Circumcision",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/adult-circumcision/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/bladder-cancer",
    "title": "Bladder Cancer",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/bladder-cancer/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/bladder-cancer/zusduri-bcg",
    "title": "Zusduri BCG",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/bladder-cancer/zusduri-bcg/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/bladder-cancer/zusduri-bcg-en-block",
    "title": "Zusduri BCG En Block",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/bladder-cancer/zusduri-bcg-en-block/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate",
    "title": "Enlarged Prostate",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/contact-us",
    "title": "Enlarged Prostate — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/itind",
    "title": "iTind",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/itind/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/itind/contact-us",
    "title": "iTind — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/itind/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/laser-treatment",
    "title": "Laser Treatment",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/laser-treatment/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/laser-treatment/contact-us",
    "title": "Laser Treatment — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/laser-treatment/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/prostatic-artery-embolization",
    "title": "Prostatic Artery Embolization",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/prostatic-artery-embolization/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/prostatic-artery-embolization/contact-us",
    "title": "Prostatic Artery Embolization — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/prostatic-artery-embolization/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/rezum",
    "title": "Rezum",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/rezum/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/rezum/contact-us",
    "title": "Rezum — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/rezum/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/urolift",
    "title": "Urolift",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/urolift/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/enlarged-prostate/urolift/contact-us",
    "title": "Urolift — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/enlarged-prostate/urolift/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/hematuria",
    "title": "Hematuria",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/hematuria/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/kidney-stones",
    "title": "Kidney Stones",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/kidney-stones/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/low-testosterone",
    "title": "Low Testosterone",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/low-testosterone/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction",
    "title": "Male Sexual Dysfunction",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/contact-us",
    "title": "Male Sexual Dysfunction — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/gainswave",
    "title": "Gainswave",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/gainswave/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/gainswave/contact-us",
    "title": "Gainswave — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/gainswave/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/peyronies",
    "title": "Peyronies",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/peyronies/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/peyronies/contact-us",
    "title": "Peyronies — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/peyronies/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/varicocele",
    "title": "Varicocele",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/varicocele/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/male-sexual-dysfunction/varicocele/contact-us",
    "title": "Varicocele — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/male-sexual-dysfunction/varicocele/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/mens-wellness",
    "title": "Mens Wellness",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/mens-wellness/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer",
    "title": "Prostate Cancer",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/contact-us",
    "title": "Prostate Cancer — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/nuclear-medicine",
    "title": "Nuclear Medicine",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/nuclear-medicine/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/nuclear-medicine/contact-us",
    "title": "Nuclear Medicine — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/nuclear-medicine/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/prostate-biopsies/contact-us",
    "title": "Prostate Biopsies — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/prostate-biopsies/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/prostate-biopsy",
    "title": "Prostate Biopsy",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/prostate-biopsy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/psa-transperineal-prostate-biopsy",
    "title": "PSA Transperineal Prostate Biopsy",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/psa-transperineal-prostate-biopsy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/radiation-treatments",
    "title": "Radiation Treatments",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/radiation-treatments/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/radiation-treatments/brachytherapy",
    "title": "Brachytherapy",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/radiation-treatments/brachytherapy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/radiation-treatments/rectal-spacer",
    "title": "Rectal Spacer",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/radiation-treatments/rectal-spacer/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/robotic-prostatectomy",
    "title": "Robotic Prostatectomy",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/robotic-prostatectomy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/robotic-prostatectomy/contact-us",
    "title": "Robotic Prostatectomy — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/robotic-prostatectomy/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/transperineal-prostate-biopsy",
    "title": "Transperineal Prostate Biopsy",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/transperineal-prostate-biopsy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/tulsa-for-prostate",
    "title": "TULSA For Prostate",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/tulsa-for-prostate/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/tulsa-for-prostate/contact-us",
    "title": "TULSA For Prostate — Contact Us",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/tulsa-for-prostate/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/prostate-cancer/vanquish",
    "title": "Vanquish",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/prostate-cancer/vanquish/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/urinary-incontinence",
    "title": "Urinary Incontinence",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/urinary-incontinence/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/men/vasectomy",
    "title": "Vasectomy",
    "group": "Men",
    "kind": "static",
    "sourceFile": "app/men/vasectomy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources",
    "title": "Patient Resources",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/appointment-policy",
    "title": "Appointment Policy",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/appointment-policy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/blog",
    "title": "Blog",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/blog/page.tsx",
    "sanityStatus": "managed",
    "sanityNote": "Post listing is fully Sanity-driven."
  },
  {
    "path": "/patient-resources/blog/[slug]",
    "title": "Blog Post (dynamic)",
    "group": "Patient Resources",
    "kind": "dynamic",
    "sourceFile": "app/patient-resources/blog/[slug]/page.tsx",
    "sanityStatus": "managed",
    "sanityNote": "Article, metadata, author, related posts and CTA are Sanity-driven."
  },
  {
    "path": "/patient-resources/contact-us",
    "title": "Patient Resources — Contact Us",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/contact-us/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/insurance",
    "title": "Insurance",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/insurance/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/out-of-town-patients",
    "title": "Out Of Town Patients",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/out-of-town-patients/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/patient-portal",
    "title": "Patient Portal",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/patient-portal/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/physician-referral",
    "title": "Physician Referral",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/physician-referral/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/patient-resources/privacy-policy-hipaa",
    "title": "Privacy Policy HIPAA",
    "group": "Patient Resources",
    "kind": "static",
    "sourceFile": "app/patient-resources/privacy-policy-hipaa/page.tsx",
    "sanityStatus": "partial",
    "sanityNote": "Policy body is Sanity-driven; page shell and hero are hardcoded."
  },
  {
    "path": "/women",
    "title": "Women",
    "group": "Women",
    "kind": "static",
    "sourceFile": "app/women/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/women/emsella-for-incontinence",
    "title": "Emsella For Incontinence",
    "group": "Women",
    "kind": "static",
    "sourceFile": "app/women/emsella-for-incontinence/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/women/hematuria",
    "title": "Hematuria",
    "group": "Women",
    "kind": "static",
    "sourceFile": "app/women/hematuria/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/women/hormone-replacement-therapy",
    "title": "Hormone Replacement Therapy",
    "group": "Women",
    "kind": "static",
    "sourceFile": "app/women/hormone-replacement-therapy/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/women/hormone-replacement-therapy/post-insertion-instructions",
    "title": "Post Insertion Instructions",
    "group": "Women",
    "kind": "static",
    "sourceFile": "app/women/hormone-replacement-therapy/post-insertion-instructions/page.tsx",
    "sanityStatus": "hardcoded"
  },
  {
    "path": "/women/kidney-stones",
    "title": "Kidney Stones",
    "group": "Women",
    "kind": "static",
    "sourceFile": "app/women/kidney-stones/page.tsx",
    "sanityStatus": "hardcoded"
  }
];

/** Redirects declared in next.config.ts. */
export const redirects: RedirectEntry[] = [
  {
    "source": "/:pae([Pp][Aa][Ee])",
    "destination": "/men/enlarged-prostate/prostatic-artery-embolization",
    "permanent": true
  },
  {
    "source": "/clinical-research/overactive-bladder",
    "destination": "/clinical-research/urinary-incontinence-studies",
    "permanent": true
  },
  {
    "source": "/men/prostate-cancer/transperineal-prostate-biopsy",
    "destination": "/men/prostate-cancer/psa-transperineal-prostate-biopsy",
    "permanent": true
  },
  {
    "source": "/patient-resources/order-supplements",
    "destination": "https://www.thorne.com/u/PR144207",
    "permanent": true
  },
  {
    "source": "/privacy-policy",
    "destination": "/patient-resources/privacy-policy-hipaa",
    "permanent": false
  }
];
