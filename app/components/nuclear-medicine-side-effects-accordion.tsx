"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "common-side-effects",
    question: "What are the common side effects of Pluvicto?",
    answer: (
      <p>
        Patients often report fatigue, nausea, and loss of appetite. These effects can vary in
        intensity and duration.
      </p>
    ),
  },
  {
    id: "serious-side-effects",
    question: "Are there serious side effects to watch for?",
    answer: (
      <p>
        Yes, some patients may experience more severe reactions such as allergic reactions or
        significant changes in blood counts. It&apos;s crucial to report any unusual symptoms to your
        doctor immediately.
      </p>
    ),
  },
  {
    id: "managing-side-effects",
    question: "How can side effects be managed?",
    answer: (
      <p>
        Managing side effects often involves supportive care, such as hydration and dietary
        adjustments. Your healthcare team can provide personalized strategies to help alleviate
        discomfort.
      </p>
    ),
  },
  {
    id: "contact-doctor",
    question: "When should I contact my doctor?",
    answer: (
      <p>
        If you experience severe side effects or any new symptoms that concern you, reach out to your
        healthcare provider right away for guidance.
      </p>
    ),
  },
  {
    id: "side-effects-over-time",
    question: "Can side effects change over time?",
    answer: (
      <p>
        Yes, side effects can evolve as treatment progresses. Regular check-ins with your healthcare
        provider can help manage these changes effectively.
      </p>
    ),
  },
] as const;

export function NuclearMedicineSideEffectsAccordion() {
  const [openId, setOpenId] = useState<string | null>("common-side-effects");

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-stone-50/90 px-5 py-10 shadow-sm ring-1 ring-stone-200/60 md:px-10 md:py-14">
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Understanding Pluvicto Side Effects
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-relaxed text-slate-700 md:text-base">
        Pluvicto is a targeted therapy for advanced prostate cancer. Knowing what to expect and how
        to monitor side effects helps you stay comfortable and safe throughout treatment.
      </p>
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
                  aria-controls={`nm-pluvicto-faq-${item.id}`}
                  id={`nm-pluvicto-faq-trigger-${item.id}`}
                >
                  <span className="text-[15px] font-semibold leading-snug text-slate-900 md:text-base">
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
                  id={`nm-pluvicto-faq-${item.id}`}
                  role="region"
                  aria-labelledby={`nm-pluvicto-faq-trigger-${item.id}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-4 pb-4 pt-0 text-[15px] leading-relaxed text-slate-700 md:px-5 md:text-base">
                      <div className="pt-4 font-normal">{item.answer}</div>
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
