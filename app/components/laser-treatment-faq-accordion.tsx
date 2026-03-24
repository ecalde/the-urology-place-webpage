"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "right-for-me",
    question: "Is laser treatment right for me?",
    answer: (
      <p>
        Laser treatment for BPH works to vaporize prostate cells rapidly and accurately. The surgeon
        directs laser energy, which causes cells to heat and vaporize. The treatment is known as
        Greenlight as well as Thulium laser. The laser is an alternative to transurethral resection of
        the prostate (TURP). Laser therapy gives patients quick symptom relief and minimal short-term
        side effects.
      </p>
    ),
  },
  {
    id: "thulium-vs-greenlight",
    question: "Is the Thulium or Greenlight laser better for enlarged prostate?",
    answer: (
      <p>
        Dr. Kella has used both systems. Both lasers are high powered and can eliminate prostate tissue
        quickly. Thulium has the advantage of being a contact laser. As a result, the laser beams cannot
        travel and damage other areas. As a result, Thulium laser can be performed without wearing
        goggles. This means the surgeon can see comfortably. Side-effect profiles are very similar.
      </p>
    ),
  },
  {
    id: "benefits",
    question: "What are the benefits of laser treatment?",
    answer: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Minimal bleeding</li>
        <li>Discharge on the same day</li>
        <li>Patients may wear a catheter for a day or two</li>
        <li>Resume activities in 3–4 days with caution</li>
        <li>Resume sexual activity and vigorous activity in 4–6 weeks</li>
        <li>Laser therapy is contact only and no erectile dysfunction has been associated with the laser</li>
        <li>Long-term success in helping urine flow</li>
      </ul>
    ),
  },
  {
    id: "thulium-safe",
    question: "Is the Thulium laser safe?",
    answer: (
      <div className="space-y-4">
        <p>
          Laser therapy with Thulium is safe and simple. The laser will coagulate blood vessels, so there
          is usually minimal bleeding.
        </p>
        <p>
          Patients can still have post-operative complications, which the doctor can discuss. However,
          these are less with laser than with TURP.
        </p>
      </div>
    ),
  },
  {
    id: "pvp-vs-turp",
    question: "Laser PVP vs. TURP",
    answer: (
      <p>
        Results indicate similar long-term outcomes. Transurethral resection of the prostate (TURP) is
        considered safe and effective. However, laser offers even quicker recovery time with fewer side
        effects. Patients will go home sooner after laser compared to TURP or even bipolar TURP.
        Ultimately, your doctor&apos;s experience will help guide you to the best choice for BPH.
      </p>
    ),
  },
  {
    id: "pvp-vs-pae",
    question: "Laser PVP vs. Prostate Artery Embolization",
    answer: (
      <p>
        Dr. Kella works with radiologists who offer prostate artery embolization (PAE). Dr. Kella and
        the radiologists believe PAE is an effective treatment for very large prostates. With PAE, the
        procedure is done similar to a coronary artery stenting procedure. An opening in your leg artery
        allows a catheter to be guided to your prostate arteries. The radiologist then sends tiny coils
        via the catheter, which cut off blood supply to the prostate. There are some risks involved, and
        not all patients respond. However, Dr. Kella thinks large prostates get a good response with
        PAE.
      </p>
    ),
  },
  {
    id: "sex-after",
    question: "Sex after Laser Prostate Surgery",
    answer: (
      <p>
        Erections should not be affected by laser therapy. The doctor will clear you to have sex a few 
        weeks after the procedure. If you have sex too early after laser surgery, your prostate may begin 
        to bleed. Patients may notice retrograde ejaculation with orgasm. However orgasm intensity after 
        laser surgery should remain the same.
      </p>
    ),
  },
] as const;

export function LaserTreatmentFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="space-y-3">
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
                aria-controls={`laser-faq-${item.id}`}
                id={`laser-faq-trigger-${item.id}`}
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
                id={`laser-faq-${item.id}`}
                role="region"
                aria-labelledby={`laser-faq-trigger-${item.id}`}
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
  );
}
