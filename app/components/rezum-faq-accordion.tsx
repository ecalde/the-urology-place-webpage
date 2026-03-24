"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "symptoms",
    question: "What symptoms can be improved?",
    answer: (
      <p>
        Rezum water vapor therapy treats enlarged prostate with a few drops of water. Rezum can improve
        frequency, hesitant stream, urgency, straining and night time frequency.
      </p>
    ),
  },
  {
    id: "prepare",
    question: "How do I prepare for Rezum?",
    answer: (
      <div className="space-y-4">
        <p>
          You will get a prescription to take an antibiotic for a few days, starting the day before the
          procedure.
        </p>
        <p>
          You need to get off blood thinners like aspirin or coumadin one week prior. This needs to be
          discussed with the doctor.
        </p>
        <p>
          You will take a Fleets Enema at home prior to coming to the office. Fleets are available
          without prescription, over the counter at any drugstore.
        </p>
        <p>
          If prescribed by your doctor, you can take a pain or anxiety medication right before the
          procedure. Nitrous gas is very helpful as well and does not require a driver to take you home.
        </p>
      </div>
    ),
  },
  {
    id: "painless",
    question: "How can I make Rezum as painless as possible?",
    answer: (
      <div className="space-y-4">
        <p>
          The treatment is in our San Antonio office and usually quick. We offer oral medication and
          nitrous gas, in addition to a prostate block.
        </p>
        <p>Nitrous gas is available for a nominal fee.</p>
      </div>
    ),
  },
  {
    id: "erections",
    question: "Does Rezum water therapy hurt erections or urinary control?",
    answer: (
      <p>
        No. Rezum water vapor therapy has a very low chance to hurt erectile function or urinary
        control long term. There is an increase in symptoms, usually for 3 weeks or so until the
        swelling settles down from the procedure. Some patients report a decrease in their ejaculation
        volume, but it does not affect the ability to get an erection or have an orgasm.
      </p>
    ),
  },
  {
    id: "catheter",
    question: "Do I need to wear a urinary catheter after Rezum?",
    answer: (
      <p>
        We recommend a catheter for a few days after the procedure. The treatment can cause some
        swelling of the prostate. This makes the urinary tube more restricted. The catheter allows the
        bladder to remain empty. If you do not want a catheter, we could teach you how to self-catheterize
        with a super slick in and out catheter. We obviously will discuss this more in person.
      </p>
    ),
  },
  {
    id: "bleeding",
    question: "Is there bleeding after Rezum?",
    answer: (
      <p>
        There is little to no bleeding during the procedure. You may notice some blood in or around the
        catheter for a couple of days. Let us know if you experience anything of concern.
      </p>
    ),
  },
  {
    id: "research",
    question: "Can you give me more research data about Rezum?",
    answer: (
      <p>
        The water vapor therapy has 5 year data showing the treatment lasts. The Prostatic Urethral Lift
        (PUL) Study is the largest, multi-center, randomized study showing 5 year results. PUL patients
        had relief in their quality of life by nearly 50% at 1 month and this remained unchanged at 5
        years. Urine flow also was improved by over 40% even at 5 years. This represents over 140
        patients who had Rezum and 66 patients who did not.
      </p>
    ),
  },
  {
    id: "insurance",
    question: "Does insurance cover Rezum in San Antonio?",
    answer: (
      <p>
        Most insurances cover the procedure. If your insurance does not cover the procedure, your out of
        pocket cost will be around $3500. We offer quick pay discounts. This may be considerably cheaper
        than long term medications or your possible deductibles for surgery in the hospital.
      </p>
    ),
  },
  {
    id: "urinary-side-effects",
    question: "What urinary side-effects are there after the procedure?",
    answer: (
      <p>
        Rezum can make your symptoms worse for a few weeks after the procedure. Usually this improves
        within 3 weeks. The water vapor initially causes the prostate to swell. Patients usually wear a
        catheter for a few days until the swelling decreases.
      </p>
    ),
  },
] as const;

export function RezumFaqAccordion() {
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
                  aria-controls={`rezum-faq-${item.id}`}
                  id={`rezum-faq-trigger-${item.id}`}
                >
                  <span className="text-[15px] font-bold leading-snug text-slate-900 md:text-base">
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
                  id={`rezum-faq-${item.id}`}
                  role="region"
                  aria-labelledby={`rezum-faq-trigger-${item.id}`}
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
