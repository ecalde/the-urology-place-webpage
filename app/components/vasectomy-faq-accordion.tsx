"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "prepare",
    question: "How do I prepare for a Vasectomy?",
    answer: (
      <p>
        Patients need to avoid bloodthinners up to 7 days prior to their procedure, 
        trim the hair around the area with clippers only, razors increase risk for 
        contamination and infection. Also, patients need to purchase and bring compression 
        shorts to their appointment. Please review the aftercare section ahead of time to prepare. 
      </p>
    ),
  },
  {
    id: "sexual",
    question: "How will vasectomy affect my sexual function?",
    answer: (
      <p>
        99% of your ejaculate is preserved, with only the sperm removed. 
        Your erection and orgasm should be the same. 
        You can have sex as early as one week after a vasectomy. 
        You might see some blood in the ejaculate, but this is uncommon. 
        You MUST use another form of birth control until you confirm there is no more sperm.
      </p>
    ),
  },
  {
    id: "separate-appt",
    question:
      "Do I need a separate appointment for consultation and the vasectomy?",
    answer: (
      <p>
        Most insurances require separate consultation prior to your vasectomy. 
        Self pay patients who are confident in their decision to have a vasectomy 
        can schedule the consult and procedure in the same visit. We will make every 
        effort to respect your time and get as short of a wait as possible for your consultation.
      </p>
    ),
  },
  {
    id: "drive",
    question: "Can I drive myself home after vasectomy?",
    answer: (
      <p>
        Yes. If you choose our option to have nitrous gas, you can still drive yourself home safely.
      </p>
    ),
  },
  {
    id: "freeze",
    question: "Can I freeze sperm just in case?",
    answer: (
      <p>
        This is done by cryopreservation. Fertility centers can do this for around $300 per year. 
        Please contact a fertility center if you are interested. We generally do not encourage 
        your decision for vasectomy if you want to cryopreserve.
      </p>
    ),
  },
  {
    id: "no-needle",
    question: "Is the 'no needle' 'no scalpel' operation better?",
    answer: (
      <p>
        Dr Kella has extensively researched this commonly performed procedure. 
        Studies indicate this is the least invasive and most comfortable way to perform a vasectomy. 
        Here is a comprehensive review regarding no scalpel vasectomy.
      </p>
    ),
  },
  {
    id: "unprotected",
    question: "When can I have unprotected sex after vasectomy?",
    answer: (
      <p>
        Normally, we have you wait a few months and ejaculate 25-30 times during that time period. 
        A test is done to confirm the absence of sperm.
      </p>
    ),
  },
  {
    id: "risks",
    question: "What are the risks of a vasectomy?",
    answer: (
      <p>
        1% of vasectomies can fail, without warning.
        1% complain of ongoing pain. This is known as post vasectomy pain syndrome.
        1% develop a hematoma. This can be drained surgically or will just slowly resolve on its own.
        You may see some blood in the ejaculate initially. This goes away quickly.
      </p>
    ),
  },
  {
    id: "laser",
    question: "Is there such a thing as laser vasectomy?",
    answer: (
      <p>
        No-there is no such thing as a laser vasectomy. However, The Urology Place offers a minimally 
        invasive approach with the no-scalpel technique. This modern technique provides a faster recovery 
        time compared to the traditional vasectomy procedure. 
      </p>
    ),
  },
] as const;

export function VasectomyFaqAccordion() {
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
                  aria-controls={`vasectomy-faq-${item.id}`}
                  id={`vasectomy-faq-trigger-${item.id}`}
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
                  id={`vasectomy-faq-${item.id}`}
                  role="region"
                  aria-labelledby={`vasectomy-faq-trigger-${item.id}`}
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
