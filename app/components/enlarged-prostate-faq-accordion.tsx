"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "comparing-options",
    question: "Is there data comparing BPH treatment options?",
    answer: (
      <p>
        BPH treatment options have become less and less invasive with clever new techniques. At The
        Urology Place, we have looked for new options with our patients with at least 3 year data
        showing durable and promising results.
      </p>
    ),
  },
  {
    id: "experience",
    question: "Does The Urology Place have experience with BPH treatments?",
    answer: (
      <p>
        We have significant experience with all the options. In fact, Dr. Kella was the first surgeon
        to perform UroLift in Texas and he was the first person to perform iTind in the Southwest.
      </p>
    ),
  },
  {
    id: "when-needed",
    question: "When is treatment needed?",
    answer: (
      <p>
        Patients&apos; quality of life suffers with repeated waking up at night, a dribbling stream,
        rushing to the bathroom to avoid an accident, or leaking after you have just urinated. Men with
        any of these symptoms can try medication. However, medication may not work, can create
        side-effects, and have to be taken for life. Treatment makes sense at this point.
      </p>
    ),
  },
] as const;

export function EnlargedProstateFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-stone-50/90 px-5 py-10 shadow-sm ring-1 ring-stone-200/60 md:px-10 md:py-14">
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Frequently Asked Questions
      </h2>
      <ul className="mx-auto mt-10 max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <li key={item.id}>
              <div className="overflow-hidden rounded-xl bg-slate-100/90 shadow-sm ring-1 ring-slate-200/80">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-200/50 md:px-5 md:py-4"
                  aria-expanded={isOpen}
                  aria-controls={`bph-hub-faq-${item.id}`}
                  id={`bph-hub-faq-trigger-${item.id}`}
                >
                  <span className="text-[15px] font-bold leading-snug text-slate-900 md:text-base">
                    {item.question}
                  </span>
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm"
                    aria-hidden
                  >
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                  id={`bph-hub-faq-${item.id}`}
                  role="region"
                  aria-labelledby={`bph-hub-faq-trigger-${item.id}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/80 bg-white/60 px-4 pb-4 pt-0 text-[15px] font-normal leading-relaxed text-slate-700 md:px-5 md:text-base">
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
