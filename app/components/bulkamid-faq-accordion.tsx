"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "insurance",
    question: "Does insurance cover Bulkamid?",
    answer:
      "Bulkamid is commonly covered by insurance when medically appropriate. Our staff can review your coverage and costs with you before treatment.",
  },
  {
    id: "pain",
    question: "Does the procedure hurt?",
    answer:
      "A numbing gel or local anesthetic is used, and most patients find the 10–15 minute procedure very tolerable.",
  },
  {
    id: "combine",
    question: "Can I combine treatments?",
    answer:
      "Yes. Some patients use pelvic floor therapy or Emsella along with Bulkamid. We can help you build a plan.",
  },
  {
    id: "later-surgery",
    question: "Will I be able to have surgery later if needed?",
    answer: "Yes. Bulkamid does not prevent you from having surgery later.",
  },
] as const;

export function BulkamidFaqAccordion() {
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
                  aria-controls={`bulkamid-faq-${item.id}`}
                  id={`bulkamid-faq-trigger-${item.id}`}
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
                  id={`bulkamid-faq-${item.id}`}
                  role="region"
                  aria-labelledby={`bulkamid-faq-trigger-${item.id}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-4 pb-4 pt-0 text-[15px] leading-relaxed text-slate-700 md:px-5 md:text-base">
                      <p className="pt-4">{item.answer}</p>
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
