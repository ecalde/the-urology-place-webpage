"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "inpatient-outpatient",
    question: "Is this an inpatient or outpatient procedure?",
    answer: (
      <p>
        Following the TULSA Procedure, you are usually discharged from the hospital the same day or
        the next day, depending on Dr. Kella&apos;s assessment.
      </p>
    ),
  },
  {
    id: "duration",
    question: "How long does the procedure take?",
    answer: (
      <p>
        The procedure is performed in a single session that takes a few hours (2-4 hours). It is
        conducted under general anesthesia. After the procedure, Dr. Kella may decide to keep you in
        the hospital overnight for observation or you may go home the same day.
      </p>
    ),
  },
  {
    id: "hifu",
    question: "How does the TULSA Procedure compare to HIFU?",
    answer: (
      <p>
        The TULSA Procedure uses Directional High-Intensity Ultrasound delivered through the urethra.
        This means the energy is delivered directly through the urethra (which is being cooled
        throughout the procedure) to the edge of the prostate. The energy does not come through the
        rectum, leaving the rectum preserved. In addition, TULSA has rectal cooling throughout the
        procedure to further protect the rectum from any unintended heat. HIFU uses High-Intensity
        Focused Ultrasound. This means the energy must pass through other tissue to reach the
        intended location. The energy is directed through the rectum, meaning the rectal wall is
        exposed to direct heat.
      </p>
    ),
  },
  {
    id: "risks",
    question:
      "What are the risks, especially to sexual function? What are the chances of ED or retrograde ejaculation?",
    answer: (
      <p>
        As with many procedures, there are side effects associated with the TULSA Procedure. The most
        common side effects include pain/discomfort in the targeted area, blood in urine, urinary
        tract infection, urinary incontinence, and erectile dysfunction. Dr. Kella will review with
        you all the risks associated with the TULSA Procedure.
      </p>
    ),
  },
  {
    id: "insurance",
    question: "Will Medicare/private insurance cover the procedure costs?",
    answer: (
      <p>
        The procedure is FDA approved. The company is diligently working for an insurance code.
        This is currently a self-pay procedure. Depending on individual insurance policies, there may
        be some reimbursement for the procedure, which should be further discussed with your policy
        provider.
      </p>
    ),
  },
  {
    id: "painful",
    question: "Is the TULSA Procedure painful?",
    answer: (
      <p>
        The TULSA Procedure is done under general anesthesia to keep your body as still as possible
        within the MRI machine during the procedure. Patients have minimal discomfort, if any.
        However, this is manageable using over-the-counter pain medication.
      </p>
    ),
  },
  {
    id: "catheter",
    question: "How long will I have to wear a catheter after my procedure?",
    answer: (
      <p>
        A catheter is typically in place for up to 14 days. Dr. Kella will assess your voiding
        function to confirm the appropriate removal date.
      </p>
    ),
  },
  {
    id: "recovery",
    question: "What is the recovery time?",
    answer: (
      <p>
        As observed during the pivotal study, patients typically returned to their daily activities
        (including work) within a couple of days following the procedure, and then back to baseline
        urinary/bowel quality of life within three months.
      </p>
    ),
  },
] as const;

export function TulsaForProstateFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-stone-50/90 px-5 py-10 shadow-sm ring-1 ring-stone-200/60 md:px-10 md:py-14">
      <h2 className="text-center text-2xl font-bold italic tracking-tight text-slate-900 md:text-3xl">
        Frequently Asked Questions
      </h2>
      <ul className="mx-auto mt-10 max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <li key={item.id}>
              <div className="overflow-hidden rounded-xl bg-white/90 shadow-sm ring-1 ring-slate-200/80">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50/90 md:px-5 md:py-4"
                  aria-expanded={isOpen}
                  aria-controls={`tulsa-faq-${item.id}`}
                  id={`tulsa-faq-trigger-${item.id}`}
                >
                  <span className="text-[15px] font-normal leading-snug text-slate-900 md:text-base">
                    {item.question}
                  </span>
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm"
                    aria-hidden
                  >
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`tulsa-faq-${item.id}`}
                  role="region"
                  aria-labelledby={`tulsa-faq-trigger-${item.id}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-4 pb-4 pt-0 text-[15px] leading-relaxed text-slate-700 md:px-5 md:text-base">
                      <div className="pt-4">{item.answer}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
