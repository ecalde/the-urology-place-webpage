import type { ClinicalStudy } from "@/app/data/clinical-study-shared";

const IMG = (filename: string) =>
  encodeURI(`/images/prostate cancer studies/${filename}`);

export const PROSTATE_CANCER_STUDIES: ClinicalStudy[] = [
  {
    name: "CAPTAIN",
    headline:
      "Localized Prostate Cancer Study: TULSA Procedure vs. Prostate Removal at The Urology Place",
    status: "Active, Not Enrolling",
    description:
      "If you have intermediate-risk prostate cancer that is still inside the prostate, The Urology Place participated in the CAPTAIN study comparing the TULSA procedure with surgical removal of the prostate.",
    paragraphs: [
      "This study is not enrolling new participants. Men who joined were assigned by chance. About two in three received the TULSA procedure, an MRI-guided ultrasound treatment through the urethra that heats targeted prostate tissue. About one in three had radical prostatectomy, the operation that removes the prostate. Researchers are following urinary control, erections, and cancer control for up to 10 years.",
    ],
    sections: [
      {
        title: "The TULSA procedure",
        body: "Ultrasound energy is delivered through the urethra while MRI shows the prostate. The aim is to destroy targeted prostate tissue without an incision through the skin.",
      },
      {
        title: "Prostate removal",
        body: "Radical prostatectomy removes the prostate gland through surgery. It is a standard treatment for this type of cancer. The study compares quality of life and cancer control between the two approaches. It does not promise that one is safer or more effective.",
      },
    ],
    closing:
      "This study is not taking new participants right now. Contact our research team to ask whether another prostate cancer study may be a fit.",
    nct: "NCT05027477",
    image: IMG("124937-prostate-cancer-2-2880w.jpg"),
    imageAlt:
      "Clinical research comparing the TULSA procedure with prostate removal",
  },
  {
    name: "CARE",
    headline:
      "Prostate Cancer Study: TULSA-PRO Ablation Registry at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have prostate cancer and you are considering TULSA-PRO, or you have already had the procedure, The Urology Place is enrolling men in the CARE registry.",
    paragraphs: [
      "TULSA-PRO is an MRI-guided treatment that uses ultrasound, delivered through the urethra, to heat and ablate prostate tissue. CARE does not test a new device. It follows men who receive this procedure as part of regular care so researchers can learn more about side effects, cancer control, urinary symptoms, and sexual function over time.",
    ],
    sections: [
      {
        title: "What participation involves",
        body: "Your treatment plan does not change because you join. The registry collects information from visits you would already have, including PSA tests and questionnaires about urinary and sexual health. Follow-up continues for years.",
      },
      {
        title: "Who can ask about it",
        body: "Men who are candidates for TULSA-PRO, and men who have already been treated with it, can ask the research team whether the registry is a fit.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT05001477",
    image: IMG("Tulsa-Pro-diagram--2880w.png"),
    imageAlt: "Diagram of the TULSA-PRO ablation procedure",
  },
  {
    name: "Curium",
    headline:
      "Prostate Cancer PET Scan Study: Copper-64 PSMA Imaging at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have newly diagnosed unfavorable intermediate-risk, high-risk, or very high-risk prostate cancer and you are planning prostate removal with lymph node removal, The Urology Place is participating in a PSMA PET scan study.",
    paragraphs: [
      "PSMA PET is an imaging test that looks for prostate cancer cells. This study is evaluating an investigational copper-64 PSMA imaging agent. Researchers want to learn how well one scan shows whether cancer has reached the lymph nodes in the pelvis. The scan is still under study. It does not prove where cancer is or is not.",
    ],
    sections: [
      {
        title: "What the visit involves",
        body: "You receive one intravenous injection of the imaging agent. A PET/CT scan is done about 1 to 4 hours later. The pictures are compared with the pathology results from surgery.",
      },
      {
        title: "Who the study is for",
        body: "Men with biopsy-proven prostate cancer in these higher-risk groups who have chosen radical prostatectomy with pelvic lymph node dissection, and who have not already started hormone therapy, chemotherapy, or radiation.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT06235151",
    image: IMG(
      "8ff1b012d447be34eddd86d50fa966a276126c0e-1200x1200-2880w.webp",
    ),
    imageAlt:
      "PSMA PET imaging research for newly diagnosed higher-risk prostate cancer",
  },
  {
    name: "CLARIFY",
    headline:
      "High-Risk Prostate Cancer PET Scan Study: Copper-64 bisPSMA Imaging at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have high-risk prostate cancer and you are planning to have your prostate removed along with pelvic lymph nodes, The Urology Place is participating in the CLARIFY clinical research study.",
    paragraphs: [
      "CLARIFY is evaluating an investigational PET imaging agent, 64Cu-SAR-bisPSMA, to see how well it detects prostate cancer in the pelvic lymph nodes before surgery. The scan is compared with the tissue removed at surgery. A research scan does not by itself prove where cancer is or is not.",
    ],
    sections: [
      {
        title: "What the visits involve",
        body: "You receive one intravenous injection of the imaging agent. PET images are taken the same day and again the next day. Researchers compare those images with the pathology from surgery.",
      },
      {
        title: "Who the study is for",
        body: "Men with untreated, biopsy-proven high-risk prostate cancer who have chosen radical prostatectomy with pelvic lymph node removal.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT06056830",
    image: IMG("bisPSMA-e1717050832574-2880w.png"),
    imageAlt: "Scientific illustration representing the CLARIFY PET imaging study",
  },
  {
    name: "PYLARIFY Registry",
    headline:
      "Prostate Cancer PET Scan Registry: PYLARIFY Imaging at The Urology Place",
    status: "Active, Not Enrolling",
    description:
      "If you have prostate cancer and your doctor has ordered a PYLARIFY PET scan, The Urology Place participated in a registry that follows how that scan is used in regular care.",
    paragraphs: [
      "PYLARIFY is a PSMA PET scan used to look for prostate cancer that may have spread, either before treatment starts or when PSA rises after treatment. This registry does not test a new drug. It records how the scan result fits into treatment decisions and follows men for up to five years. The registry is not enrolling new participants.",
    ],
    sections: [
      {
        title: "Who the registry followed",
        body: "Men newly diagnosed with prostate cancer who were referred for PYLARIFY before starting treatment, and men already treated whose rising PSA suggested the cancer might have come back.",
      },
      {
        title: "What participation involves",
        body: "The scan is the one your doctor already ordered. The registry collects information from routine prostate cancer visits. It does not add a treatment.",
      },
    ],
    closing:
      "This study is not taking new participants right now. Contact our research team to ask whether another prostate cancer study may be a fit.",
    nct: "NCT05712473",
    image: IMG("05-27-Lantheus-PYLARIFY-PET-2880w.png"),
    imageAlt:
      "PYLARIFY PET image representing the Piflufolastat F18 prostate cancer registry study",
  },
  {
    name: "Amplify",
    headline:
      "Rising PSA After Prostate Cancer Treatment: Copper-64 PET Scan Study at The Urology Place",
    status: "Active, Not Enrolling",
    description:
      "If your PSA is rising after prostate cancer treatment, The Urology Place participated in the AMPLIFY study of an investigational PET scan meant to look for where the cancer has returned.",
    paragraphs: [
      "The study is for men who finished prostate removal, radiation, seed implants, or cryotherapy and now have a PSA level that suggests the cancer may have come back. Each participant receives one intravenous injection of 64Cu-SAR-bisPSMA. PET images are taken the same day and the next day. Researchers are studying how often the scan correctly finds recurrent prostate cancer. The imaging agent is still under study, and a scan does not by itself prove where cancer is. This trial is not enrolling new participants.",
    ],
    sections: [
      {
        title: "Who it was for",
        body: "Men with biopsy-proven prostate cancer who completed treatment and could still be considered for treatment aimed at the area where cancer returned. After surgery, that includes a confirmed PSA of at least 0.2. After radiation, seeds, or freezing treatment, that includes a PSA at least 2 points above the lowest level reached.",
      },
      {
        title: "How a positive spot was checked",
        body: "When the scan showed a spot and a biopsy was safe, the study asked men to have that spot sampled so the image could be compared with tissue.",
      },
    ],
    closing:
      "This study is not taking new participants right now. Contact our research team to ask whether another prostate cancer study may be a fit.",
    nct: "NCT06970847",
    image: IMG("photo-1628771065518-0d82f1938462-506666c8-2880w.jpg"),
    imageAlt: "Medication bottle representing prostate cancer treatment research",
  },
  {
    name: "Vapor",
    headline:
      "Intermediate-Risk Prostate Cancer Study: Vanquish Water Vapor Ablation at The Urology Place",
    status: "Active, Not Enrolling",
    description:
      "If you have intermediate-risk prostate cancer that is still inside the prostate, The Urology Place participated in the VAPOR 2 study of the Vanquish water vapor ablation device.",
    paragraphs: [
      "Vanquish is passed through the urethra. It uses the heat in water vapor to ablate targeted prostate tissue without an incision through the skin. This study followed men with Grade Group 2 prostate cancer to learn about cancer control, urinary leakage, and sexual function. Enrollment is complete. Men already in the study continue follow-up. Vanquish is cleared to ablate prostate tissue. This trial is studying that use in prostate cancer and does not promise cancer control.",
    ],
    sections: [
      {
        title: "Who the study enrolled",
        body: "Men with localized intermediate-risk prostate cancer who had a prostate MRI and a recent fusion biopsy. New participants are no longer being accepted.",
      },
      {
        title: "How this differs from the Vanquish registry",
        body: "VAPOR 2 is the treatment study and is closed to enrollment. The separate Vanquish card on this page is the long-term registry for men receiving the therapy as part of their care.",
      },
    ],
    closing:
      "This study is not taking new participants right now. Contact our research team to ask whether another prostate cancer study may be a fit.",
    nct: "NCT05683691",
    image: IMG("Tulsa-Pro-diagram--2880w.png"),
    imageAlt: "Diagram representing prostate cancer treatment research",
  },
  {
    name: "Vanquish",
    headline:
      "Prostate Cancer Study: Vanquish Water Vapor Ablation Registry at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have prostate cancer and your doctor is considering Vanquish water vapor ablation, The Urology Place is enrolling men in a long-term registry.",
    paragraphs: [
      "Vanquish is a transurethral treatment that uses the heat in water vapor to ablate prostate tissue. This registry follows men who receive Vanquish as part of their care, including men who have already been treated and are continuing follow-up. Researchers collect real-world information on side effects and cancer outcomes. Joining does not change the treatment your doctor recommends.",
    ],
    sections: [
      {
        title: "The procedure being followed",
        body: "The device is passed through the urethra. Water vapor treats targeted prostate tissue without an incision through the skin. Vanquish is cleared to ablate prostate tissue. This registry is following that approach in prostate cancer care. It is not a promise of cancer control, continence, or sexual function.",
      },
      {
        title: "What participation involves",
        body: "Information comes from routine visits and questionnaires, and follow-up can continue for many years. Men who already finished an earlier Vanquish study can ask whether this registry applies to them.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT07455058",
    image: IMG("124937-prostate-cancer-2-2880w.jpg"),
    imageAlt:
      "Clinical research following Vanquish water vapor ablation for prostate cancer",
  },
  {
    name: "DIRECT-AI",
    fullName:
      "Decision Impact Study for Evaluation of Clinical Treatment with ArteraAI in Prostate Cancer",
    headline:
      "Localized Prostate Cancer Study: ArteraAI Test Registry at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If you have localized prostate cancer and have not started treatment, The Urology Place is participating in the DIRECT-AI registry.",
    paragraphs: [
      "DIRECT-AI follows men who receive the ArteraAI Prostate Test as part of usual care. The test uses the biopsy sample already taken, together with clinical information, to report on prognosis and how likely a treatment is to help. The registry does not add a biopsy, scan, or treatment. Your care stays the care you and your doctor choose.",
    ],
    sections: [
      {
        title: "What researchers are learning",
        body: "The study looks at whether the test result changes the treatment that is discussed or chosen, and how confident physicians and patients feel about that choice. Later follow-up looks at cancer outcomes, including spread of cancer and survival, at about 2 and 5 years.",
      },
      {
        title: "Who can ask about it",
        body: "Men with localized prostate cancer who have not started treatment, and whose doctor orders the ArteraAI Prostate Test, can ask the research team about joining. No extra procedure is required.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    image: IMG("cellular-microscopic-dna-2880w.jpg"),
    imageAlt:
      "Microscopic DNA image representing the DIRECT-AI precision medicine prostate cancer study",
  },
];
