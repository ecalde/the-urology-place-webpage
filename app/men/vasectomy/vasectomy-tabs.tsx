"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useState } from "react";

type VasectomyTabId =
  | "what-is"
  | "pain-free"
  | "during"
  | "cost";

type TabConfig = {
  id: VasectomyTabId;
  label: string;
  title: string;
  body: ReactNode;
  imageSrc: string;
  imageAlt: string;
};

const IMG = (name: string) => `/images/vasectomy/${name}`;

const TABS: TabConfig[] = [
  {
    id: "what-is",
    label: "What is a Vasectomy?",
    title: "Vasectomy Procedure Explained",
    imageSrc: IMG("labs_microscope.jpg"),
    imageAlt: "Laboratory microscope",
    body: (
      <p>
        A vasectomy is a minor surgical procedure where a doctor disconnects the
        tubes (called the vas deferens) that carry a man&apos;s sperm from his
        testicles to his ejaculatory ducts. A very common procedure, nearly one
        out of every six men over the age of 35 in the U.S. has had a
        vasectomy. The good news? You will not notice any changes in your orgasm
        as a result of a vasectomy procedure. Further, your ejaculate flow rate
        and volume remains the same. Your semen just no longer contains the
        sperm cells that allow for pregnancy. Although reversals are sometimes
        possible, a vasectomy is considered a permanent contraceptive procedure
        and is one of the safest and most effective contraceptive options.
      </p>
    ),
  },
  {
    id: "pain-free",
    label: "Keeping it Pain Free",
    title: "Your Comfort is Our Priority",
    imageSrc: IMG("photo-1486049252259-45184399c5b2-1920w.jpg"),
    imageAlt: "Modern medical procedure room",
    body: (
      <>
        <p>
          We try to make our San Antonio vasectomy as painless as possible.
          Here is what we can do. Everything listed has been researched and we
          have seen less pain in our own experience.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>No scalpel</li>
          <li>Single opening</li>
          <li>No needle (available)</li>
          <li>Nitrous gas (available)</li>
          <li>Open ended vasectomy (ask)</li>
        </ul>
        <p className="mt-4">
          To begin, we numb the area with lidocaine. We have our no-needle
          technique. In this situation, we use what&apos;s called a MadaJet to
          actually spray in a local anesthetic without needles. We use a very
          tiny needle to minimize discomfort. In addition, for those wanting the
          least painful route Nitrous gas is avaliable.
        </p>
      </>
    ),
  },
  {
    id: "during",
    label: "What Happens During a Vasectomy?",
    title: "The Procedure",
    imageSrc: IMG("photo-1532153470116-e8c2088b8ac1-1920w.jpg"),
    imageAlt: "Medical reference materials",
    body: (
      <>
        <p>
          After extensive comfort measures are taken, a special instrument is
          used to make a tiny opening in your scrotum the size of this dash —.
          At The Urology Place, we specialize in performing your entire
          procedure through this single tiny opening. We then isolate your vas
          deferens. The no scalpel approach usually does not even need a stitch
          afterwards. The elasticity of the skin closes the opening naturally.
        </p>
        <p className="mt-4">
          Once we have located your first vas, we carefully cut it. We then use
          pinpoint heat cautery to seal off your vas deferens tube. Dr Kella uses
          an open ended procedure, meaning we only seal off the upper portion of
          the vas, leaving the lower half of the divided vas deferens open. Next,
          we do an &quot;interposition&quot; or put the ends of the vasa into
          separate compartments. Usually, we can locate your second vas deferens
          via the same tiny hole and repeat the procedure without any additional
          openings.
        </p>
      </>
    ),
  },
  {
    id: "cost",
    label: "How Much Does a Vasectomy Cost?",
    title: "Pricing and Insurance Information",
    imageSrc: IMG("incrediblemarketing40-1920w.jpg"),
    imageAlt: "The Urology Place reception area",
    body: (
      <>
        <p>
          Most insurance plans cover the cost of a vasectomy. They typically
          require you to have one pre-procedure office visit and then a second
          appointment on a different day for the actual procedure. If you are
          committed to a vasectomy and don&apos;t want to deal with your
          insurance rules, we have a convenient same day self pay option.
        </p>
        <p className="mt-6 font-bold text-slate-900">No Insurance?</p>
        <p className="mt-2">
          If you are paying out of pocket for your vasectomy, we can provide you
          with both the consultation and the procedure on the same day for a
          prompt-pay price of $825. Insurance otherwise covers a vasectomy but
          you usually are required to have your consultation separate from the
          procedure. There is a $75 deposit required to secure an appointment
          for the procedure. This deposit is NON-REFUNDABLE 2 business days
          before your appointment because we have dedicated our time slot to you
          and your procedure. The deposit will still apply to the overall balance
          of the service. If you refund your deposit, there is a $5 fee to cover
          credit card charges and overhead.
        </p>
      </>
    ),
  },
];

export function VasectomyTabs() {
  const [activeId, setActiveId] = useState<VasectomyTabId>("what-is");
  const active = TABS.find((t) => t.id === activeId) ?? TABS[0];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Our Approach
      </h2>
      <div
        className="mt-8 flex flex-wrap gap-1 border-b border-slate-200 pb-4"
        role="tablist"
        aria-label="Vasectomy topics"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`vasectomy-panel-${tab.id}`}
            id={`vasectomy-tab-${tab.id}`}
            onClick={() => setActiveId(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              activeId === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`vasectomy-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`vasectomy-tab-${active.id}`}
        className="mt-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {active.title}
            </h3>
            <div className="mt-4 text-slate-700 leading-relaxed">{active.body}</div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 lg:aspect-auto lg:min-h-[280px]">
            <Image
              src={active.imageSrc}
              alt={active.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
