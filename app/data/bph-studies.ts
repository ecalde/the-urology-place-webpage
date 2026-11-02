import type { ClinicalStudy } from "@/app/data/clinical-study-shared";

const IMG = (filename: string) =>
  encodeURI(`/images/bph studies/${filename}`).replace(/\+/g, "%2B");

export const BPH_STUDIES: ClinicalStudy[] = [
  {
    name: "OLYMPUS",
    headline:
      "Enlarged Prostate Clinical Study: Comparing iTind™ vs. UroLift® at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you are experiencing urinary symptoms due to benign prostatic hyperplasia (BPH) or an enlarged prostate, The Urology Place is currently participating in a clinical research study evaluating two advanced, minimally invasive BPH treatments: the iTind™ procedure and the UroLift® System.",
    paragraphs: [
      "This clinical trial directly compares the safety and long-term effectiveness of both approaches for relieving lower urinary tract symptoms (LUTS):",
    ],
    sections: [
      {
        title: "The iTind™ Device",
        body: "A temporary, flexible nitinol implant placed for 5 to 7 days. It naturally reshapes the prostatic urethra using gentle, localized pressure before being completely removed.",
      },
      {
        title: "The UroLift® System",
        body: "A procedure using permanent micro-implants to hold enlarged prostate lobes out of the way, immediately opening the urethral channel without cutting or removing prostate tissue.",
      },
    ],
    closing:
      "Both options offer men an alternative to daily medications or invasive surgery. Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT04757116",
    image: IMG("photo-1589447388921-2c2c70d26d0a-2880w.jpg"),
    imageAlt:
      "Clinical research comparing iTind and UroLift for enlarged prostate symptoms",
  },
  {
    name: "ALPFA",
    headline:
      "Enlarged Prostate Clinical Study: Pulsed Field Ablation for BPH at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you are experiencing urinary symptoms from benign prostatic hyperplasia (BPH) or an enlarged prostate, The Urology Place is currently participating in a clinical research study of the investigational ALPFA GRAIL™ Pulsed Field Ablation (PFA) System.",
    paragraphs: [
      "This study is evaluating the safety of pulsed field ablation and whether it can improve lower urinary tract symptoms (LUTS) caused by an enlarged prostate. The system is still under study. It is not an approved treatment, and participation does not guarantee symptom relief.",
    ],
    sections: [
      {
        title: "The ALPFA GRAIL™ System",
        body: "A catheter is placed in the prostate through the urethra. It delivers pulsed field ablation, short pulses of electrical energy, to prostate tissue that may be narrowing the channel urine passes through. The procedure does not cut or remove prostate tissue.",
      },
      {
        title: "How the study is designed",
        body: "Men who qualify are assigned by chance. About two out of three receive the ALPFA procedure. About one out of three receive a comparison cystoscopy that looks like treatment but does not deliver ablation. After the early follow-up period, people in the comparison group may be able to receive the ALPFA procedure if they still qualify. Visits continue for up to five years to track safety and urinary symptoms.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT07592299",
    image: IMG("Stage+2+BPH-1000h.jpg"),
    imageAlt: "Cross-section illustration of stage 2 benign prostatic hyperplasia",
  },
];
