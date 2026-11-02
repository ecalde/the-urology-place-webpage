import type { ClinicalStudy } from "@/app/data/clinical-study-shared";

const IMG = (filename: string) =>
  encodeURI(`/images/kidney stones/${filename}`);

export const HYPERTENSION_STUDIES: ClinicalStudy[] = [
  {
    name: "Verve",
    headline:
      "High Blood Pressure Clinical Study: Controlling Hypertension at The Urology Place",
    status: "Active and Enrolling",
    description:
      "If your high blood pressure stays high even though you take blood pressure medication, The Urology Place is participating in a clinical research study for uncontrolled hypertension.",
    paragraphs: [
      "The Verve study is evaluating an investigational procedure for adults whose hypertension is not controlled on medication. Researchers want to learn whether it can help control high blood pressure when it is used together with blood pressure medicine. Medication is not stopped for the study. The procedure is still under study and is not a proven way to lower blood pressure.",
    ],
    sections: [
      {
        title: "Renal pelvic denervation",
        body: "A physician reaches the renal pelvis, the collecting space inside each kidney, through the urinary tract. No skin incision is used to place the device. The Verve system delivers radiofrequency energy to nerves in the wall of the renal pelvis. Those nerves help regulate blood pressure.",
      },
      {
        title: "How the study is designed",
        body: "People who qualify continue a prescribed blood pressure medication plan and are assigned by chance. One group receives renal pelvic denervation. The other group receives a comparison procedure that follows the same steps without delivering energy. The study measures office blood pressure and 24-hour blood pressure to see whether high blood pressure is better controlled.",
      },
    ],
    closing:
      "Contact our research team to learn more about study qualification and available enrollment.",
    nct: "NCT07005050",
    image: IMG("photo-1512615199361-5c7a110a8d11-2880w.jpg"),
    imageAlt:
      "Clinical research for adults whose high blood pressure stays high on medication",
  },
];
