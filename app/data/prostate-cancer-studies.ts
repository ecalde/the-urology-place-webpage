import type { ClinicalStudy } from "@/app/data/clinical-study-shared";

const IMG = (filename: string) =>
  encodeURI(`/images/prostate cancer studies/${filename}`);

export const PROSTATE_CANCER_STUDIES: ClinicalStudy[] = [
  {
    name: "CAPTAIN",
    status: "Active, Not Enrolling",
    description:
      "The CAPTAIN study is evaluating novel treatment approaches for patients with prostate cancer. Researchers are investigating whether these therapies can improve disease control and expand treatment options while maintaining quality of life.",
    nct: "NCT05027477",
    image: IMG("124937-prostate-cancer-2-2880w.jpg"),
    imageAlt: "Medical illustration representing a prostate cancer clinical trial",
  },
  {
    name: "CARE",
    status: "Active and Enrolling",
    description:
      "The CARE study is investigating new approaches for the treatment and management of prostate cancer. The goal of this research is to improve patient outcomes and provide additional therapeutic options for men with prostate cancer.",
    nct: "NCT05001477",
    image: IMG("Tulsa-Pro-diagram--2880w.png"),
    imageAlt: "Diagram of the TULSA-PRO ablation procedure",
  },
  {
    name: "Curium",
    status: "Active and Enrolling",
    description:
      "The Curium study is evaluating advanced PET imaging technology designed to improve the detection and staging of prostate cancer. This research may help physicians make more informed treatment decisions and better understand disease progression.",
    nct: "NCT06235151",
    image: IMG(
      "8ff1b012d447be34eddd86d50fa966a276126c0e-1200x1200-2880w.webp",
    ),
    imageAlt:
      "Scientific illustration representing PSMA PET imaging for prostate cancer",
  },
  {
    name: "CLARIFY",
    status: "Active and Enrolling",
    description:
      "The CLARIFY study is evaluating the use of Copper-64 SAR-bisPSMA PET imaging in men with high-risk prostate cancer. Researchers hope this imaging technology will improve the detection of lymph node involvement and assist in treatment planning.",
    nct: "NCT06056830",
    image: IMG("bisPSMA-e1717050832574-2880w.png"),
    imageAlt: "Scientific illustration representing the CLARIFY PET imaging study",
  },
  {
    name: "PYLARIFY Registry",
    status: "Active, Not Enrolling",
    description:
      "The PYLARIFY Registry is evaluating the real-world clinical utility of PYLARIFY PET imaging in patients with prostate cancer. Researchers aim to better understand how PSMA PET imaging influences treatment decisions and long-term outcomes.",
    nct: "NCT05712473",
    image: IMG("05-27-Lantheus-PYLARIFY-PET-2880w.png"),
    imageAlt:
      "PYLARIFY PET image representing the Piflufolastat F18 prostate cancer registry study",
  },
  {
    name: "Amplify",
    status: "Active, Not Enrolling",
    description:
      "The Amplify study is evaluating new treatment combinations for prostate cancer with the aim of improving disease control and patient outcomes. Researchers are studying the safety and effectiveness of these therapies in appropriate patients.",
    nct: "NCT06970847",
    image: IMG("photo-1628771065518-0d82f1938462-506666c8-2880w.jpg"),
    imageAlt: "Medication bottle representing prostate cancer treatment research",
  },
  {
    name: "Vapor",
    status: "Active, Not Enrolling",
    description:
      "The Vapor study is investigating innovative treatment strategies for prostate cancer. Researchers are studying the safety and effectiveness of these approaches with the goal of improving outcomes for patients.",
    nct: "NCT05683691",
    image: IMG("Tulsa-Pro-diagram--2880w.png"),
    imageAlt: "Diagram representing prostate cancer treatment research",
  },
  {
    name: "Vanquish",
    status: "Active and Enrolling",
    description:
      "The Vanquish study is evaluating novel therapies for prostate cancer. Researchers aim to determine whether these treatments can provide additional options and improve outcomes for patients.",
    image: IMG("124937-prostate-cancer-2-2880w.jpg"),
    imageAlt: "Medical illustration representing prostate cancer therapy research",
  },
  {
    name: "DIRECT-AI",
    fullName:
      "Decision Impact Study for Evaluation of Clinical Treatment with ArteraAI in Prostate Cancer",
    status: "Active and Enrolling",
    description:
      "The DIRECT-AI non-interventional observational registry follows patients receiving the ArteraAI Prostate Test as part of their standard care. Data collected will provide insights into how AI-powered prognostic and predictive information is used in clinical decision-making, including the impact of results on shifts in treatment choices and physician confidence.",
    image: IMG("cellular-microscopic-dna-2880w.jpg"),
    imageAlt:
      "Microscopic DNA image representing the DIRECT-AI precision medicine prostate cancer study",
  },
];
