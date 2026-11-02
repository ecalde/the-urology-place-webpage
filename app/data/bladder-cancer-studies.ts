import type { ClinicalStudy } from "@/app/data/clinical-study-shared";

const IMG = (filename: string) => encodeURI(`/images/bladder cancer/${filename}`);

export const BLADDER_CANCER_STUDIES: ClinicalStudy[] = [
  {
    name: "rBCG",
    headline:
      "Non-Muscle Invasive Bladder Cancer Study: Recombinant BCG at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have non-muscle invasive bladder cancer and have not been treated with BCG, The Urology Place is participating in a clinical research study of an investigational medicine called recombinant BCG (rBCG).",
    paragraphs: [
      "Standard BCG is placed in the bladder to treat this type of cancer. This study is evaluating a recombinant version of BCG in adults who are eligible for BCG and have not received it before. The first goal is to learn how safe this version is. It is still under study and is not a proven substitute for standard BCG.",
    ],
    sections: [
      {
        title: "How the medicine is given",
        body: "rBCG is placed into the bladder through a urinary catheter, in an induction course. Researchers follow side effects and how the cancer responds on later cystoscopy and urine tests.",
      },
      {
        title: "Who the study is for",
        body: "Adults with bladder cancer that has not grown into the bladder muscle. That includes carcinoma in situ, or Ta or T1 tumors, after the visible tumor has been resected. People who have already received BCG are not the group this trial is enrolling.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT06800963",
    image: IMG("pexels-photo-3900424-2880w.jpeg"),
    imageAlt:
      "Clinical research for non-muscle invasive bladder cancer treated with recombinant BCG",
  },
  {
    name: "AURA",
    headline:
      "Bladder Cancer Clinical Study: Investigational Tumor Injection at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have non-muscle invasive bladder cancer, The Urology Place is participating in a clinical research study of an investigational medicine called bel-sar (AU-011).",
    paragraphs: [
      "This early study is evaluating whether bel-sar can be given safely by injection into a bladder tumor, with or without a laser. Researchers are studying whether that approach is feasible. It is not an approved bladder cancer treatment, and participation does not mean the tumor will be controlled.",
    ],
    sections: [
      {
        title: "The study treatment",
        body: "Bel-sar is injected into the tumor in the bladder. Some participants also receive a laser application. The study is designed to fit around the bladder cancer care your urologist already plans.",
      },
      {
        title: "What researchers are measuring",
        body: "The main questions are safety and whether the injection can be performed as intended. The study does not promise better cancer control than the care you would otherwise receive.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT05483868",
    image: IMG("Blog_Post-Bladder_Cancer.webp"),
    imageAlt:
      "Clinical research for an investigational injection treatment in non-muscle invasive bladder cancer",
  },
  {
    name: "Cxbladder microDRIVE",
    headline:
      "Blood in the Urine Study: Cxbladder Urine Test at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have blood in your urine, whether it is microscopic or visible, and you are being evaluated with a cystoscopy, The Urology Place is participating in a clinical research study of the Cxbladder urine test.",
    paragraphs: [
      "Cystoscopy uses a camera to look inside the bladder for cancer when blood is found in the urine. This study is evaluating whether a noninvasive urine test, Cxbladder Triage Plus, can help identify who has a low chance of urothelial cancer and who needs closer evaluation. The test is still being validated.",
    ],
    sections: [
      {
        title: "What participation involves",
        body: "You continue the cystoscopy and other care your urologist has planned. The study adds one urine sample, collected at the clinic or at home. Cxbladder results from this study are not given to you or your doctor, so the test does not change your care while you are in it.",
      },
      {
        title: "Why the study exists",
        body: "If the test performs well, it may later help some people with microscopic hematuria avoid procedures that are unlikely to find cancer. This study is collecting that evidence. Joining it does not skip cystoscopy.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT05889195",
    image: IMG("pexels-photo-6129116-2880w.jpeg"),
    imageAlt:
      "Urine biomarker research for people being evaluated for blood in the urine",
  },
];
