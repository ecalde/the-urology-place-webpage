import type { ClinicalStudy } from "@/app/data/clinical-study-shared";

const IMG = (filename: string) =>
  encodeURI(`/images/overactive bladder studies/${filename}`);

export const URINARY_INCONTINENCE_STUDIES: ClinicalStudy[] = [
  {
    name: "Restore",
    headline:
      "Urge Incontinence Study: Revi Ankle Implant at The Urology Place",
    status: "Active, Not Enrolling",
    description:
      "If you leak urine because of a sudden urge, The Urology Place participated in the RESTORE study of the Revi System.",
    paragraphs: [
      "Revi is an implant placed near the ankle. A wearable unit turns it on so it can stimulate a nerve that helps control the bladder. The system is indicated for urgency incontinence, alone or with urinary urgency. This study compared turning the therapy on about a month after the implant with waiting about four months to turn it on. Researchers used a three-day bathroom diary to see whether active therapy reduced leaking more than the waiting period. The study is not enrolling new participants, and it does not promise that leaking will stop.",
    ],
    sections: [
      {
        title: "Who it was for",
        body: "Adults who have had urge leakage for at least six months, with several leaking episodes written down across a three-day diary. People could stay on a stable bladder medication.",
      },
      {
        title: "What participation involved",
        body: "Everyone in the study received the implant. Some had the therapy turned on after healing. Others waited longer before it was turned on. Follow-up included diaries and clinic visits to adjust the settings.",
      },
    ],
    closing:
      "This study is not taking new participants right now. Contact our research team to ask whether another bladder-control study may be a fit.",
    nct: "NCT06217328",
    image: IMG("revi-device-800h.png"),
    imageAlt: "Revi implant device used in the Restore urinary incontinence study",
  },
];
