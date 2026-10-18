import type { Metadata } from "next";
import { CancerTreatmentDetailPage } from "@/app/components/cancer-treatment-detail-page";

const HERO_BG = encodeURI(
  "/images/radiation treatments/Medical-examination-using-modern-CT-scanner-scaled-e1601502017995-2048x1059.jpeg",
);

export const metadata: Metadata = {
  title: "Prostate Radiation Treatment in San Antonio",
  description:
    "Radiation treatment planning for prostate cancer at The Urology Place in San Antonio, including guidance on brachytherapy and rectal spacer options.",
};

export default function RadiationTreatmentsPage() {
  return (
    <CancerTreatmentDetailPage
      title="Radiation Treatments"
      subtitle="Prostate cancer treatment planning at The Urology Place"
      heroBg={HERO_BG}
      introTitle="Understanding Radiation Treatments for Prostate Cancer"
      introParagraphs={[
        "Radiation therapy is one of several treatment paths that may be considered for prostate cancer. Depending on your diagnosis, treatment goals, and overall health, it may be used as a primary treatment or as part of a broader care plan.",
        "At The Urology Place, Dr. Kella helps patients understand how radiation-based options fit alongside surgery, surveillance, focal therapy, and other prostate cancer treatments so you can make an informed decision.",
      ]}
      highlightsTitle="Topics We May Review"
      highlights={[
        "External beam radiation therapy and how treatment planning works",
        "Brachytherapy as an internal radiation option for selected patients",
        "Rectal spacer placement to help protect nearby tissue during radiation",
        "How radiation compares with other prostate cancer treatment strategies",
      ]}
      whenToAskTitle="When to Ask About Radiation Treatments"
      whenToAsk={[
        "You want to review non-surgical treatment options for prostate cancer",
        "You have been advised to meet with a radiation specialist as part of treatment planning",
        "You are comparing side effects, recovery, and long-term goals across treatment choices",
        "You would like help deciding whether radiation may fit your diagnosis and priorities",
      ]}
      hideScheduleSection
      relatedPages={[
        {
          href: "/men/prostate-cancer/radiation-treatments/brachytherapy",
          title: "Brachytherapy",
          body: "Learn more about brachytherapy as an internal radiation option that may be discussed for selected prostate cancer cases.",
          imageSrc: "/images/brachytherapy/hipxray.jpg",
          imageAlt: "Hip X-ray style image used for the brachytherapy page",
        },
        {
          href: "/men/prostate-cancer/radiation-treatments/rectal-spacer",
          title: "Rectal Spacer",
          body: "Review how a rectal spacer may be used during radiation treatment planning to help protect nearby tissue.",
          imageSrc: "/images/brachytherapy/maxresdefault.png",
          imageAlt: "Abstract medical-style image used for the rectal spacer page",
        },
      ]}
      scheduleBody="To schedule a consultation with Dr. Kella and discuss radiation treatment planning, please call"
      category="Men > Prostate Cancer"
      sourcePath="/men/prostate-cancer/radiation-treatments"
      pageName="Radiation Treatments"
      idPrefix="men-radiation-treatments"
    />
  );
}
