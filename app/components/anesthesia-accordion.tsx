"use client";

import { useState } from "react";

const items = [
  {
    id: "safety",
    title: "Safety & Monitoring",
    content: (
      <>
        <p className="mb-4">
          Anesthesia is administered by a Certified Registered Nurse Anesthetist (CRNA), a highly trained anesthesia professional who works closely with Dr. Kella to ensure your comfort and safety.
        </p>
        <p>
          During your procedure, you will be continuously monitored, including heart rate, blood pressure, and oxygen levels. Our clinic is equipped with appropriate emergency medications and equipment, and we follow strict safety protocols before, during, and after your procedure to provide a safe and controlled environment.
        </p>
      </>
    ),
  },
  {
    id: "candidate",
    title: "Who Is a Good Candidate?",
    content: (
      <p>
        Dr. Kella will determine your candidacy for this resource based on your medical profile.
      </p>
    ),
  },
  {
    id: "type",
    title: "What Type of Anesthesia?",
    content: (
      <>
        <p className="mb-4">
          For eligible patients, we offer intravenous (IV) sedation using propofol. Propofol is a commonly used anesthetic medication that allows patients to sleep comfortably during their procedure. It works quickly, provides a smooth level of sedation, and typically allows for a faster recovery with minimal grogginess afterward.
        </p>
        <p>
          Sedation is administered and carefully monitored by a Certified Registered Nurse Anesthetist (CRNA) to ensure your comfort and safety throughout the procedure.
        </p>
      </>
    ),
  },
  {
    id: "recovery",
    title: "Recovery Expectations",
    content: (
      <>
        <p className="mb-4">
          Following your procedure, you will be monitored in our office until you are fully awake and medically stable. Because IV sedation is used, you will need a responsible adult to drive you home.
        </p>
        <p className="mb-4">
          Most patients experience a smooth recovery with minimal grogginess. Mild soreness or discomfort at the procedure site is expected and will be discussed prior to discharge, along with detailed post-procedure care instructions.
        </p>
        <p>
          Our team will review specific activity restrictions and follow-up plans to ensure proper healing.
        </p>
      </>
    ),
  },
  {
    id: "why-office",
    title: "Why In-Office vs Hospital?",
    content: (
      <>
        <p className="mb-4">
          Having your procedure performed in our office allows for a more convenient, comfortable, and personalized experience. Patients benefit from a familiar setting, streamlined scheduling, and reduced wait times compared to a hospital environment.
        </p>
        <p>
          In-office procedures are often more cost-effective than hospital-based care while still maintaining strict safety standards and professional anesthesia monitoring. Our goal is to provide high-quality surgical care with the added comfort and efficiency of an outpatient setting.
        </p>
      </>
    ),
  },
] as const;

export function AnesthesiaAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-slate-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-slate-50/80"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-trigger-${item.id}`}
            >
              <span className="font-semibold text-slate-900">{item.title}</span>
              <span
                className="relative flex h-6 w-6 shrink-0 items-center justify-center text-red-600"
                aria-hidden
              >
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span
                  className="absolute h-4 w-0.5 rounded-full bg-current transition-all duration-300 ease-out"
                  style={{
                    transform: isOpen ? "rotate(90deg) scale(0)" : "rotate(90deg) scale(1)",
                    opacity: isOpen ? 0 : 1,
                  }}
                />
              </span>
            </button>
            <div
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-4 pr-8 text-slate-700 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
