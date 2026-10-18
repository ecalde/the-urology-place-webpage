"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { BTN_PRIMARY, BTN_PRIMARY_LARGE, BTN_SECONDARY } from "@/app/lib/button-styles";

const CIRCUMCISION_PHOTOS_PATH = "/circumcision-photos";

export function AdultCircumcisionPhotosCta() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  function proceed() {
    close();
    router.push(CIRCUMCISION_PHOTOS_PATH);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-block ${BTN_PRIMARY_LARGE}`}
      >
        View Now
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close dialog"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-8"
          >
            <h2 id={titleId} className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">
              Before you continue
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
              The next page contains graphic clinical photographs of adult circumcisions. They are
              published with each patient&apos;s consent and are for medical education only. You must
              be 18 or older to view them.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button type="button" onClick={close} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button type="button" onClick={proceed} className={BTN_PRIMARY}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
