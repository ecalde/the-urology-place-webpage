"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadConsentedCircumcisionGalleries } from "@/app/circumcision-photos/actions";
import { CircumcisionPhotosGallery } from "@/app/components/circumcision-photos-gallery";
import type { CircumcisionPatientGallery } from "@/app/lib/circumcision-photos";
import { BTN_PRIMARY_LARGE, BTN_SECONDARY } from "@/app/lib/button-styles";

const CONSENT_STORAGE_KEY = "tup-circumcision-photos-ack";

type GateStatus = "pending" | "gated" | "loading" | "ready" | "error";

export function CircumcisionPhotosGate() {
  const [status, setStatus] = useState<GateStatus>("pending");
  const [galleries, setGalleries] = useState<CircumcisionPatientGallery[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      let acknowledged = false;
      try {
        acknowledged = sessionStorage.getItem(CONSENT_STORAGE_KEY) === "1";
      } catch {
        acknowledged = false;
      }
      if (!acknowledged) {
        if (!cancelled) setStatus("gated");
        return;
      }
      if (!cancelled) setStatus("loading");
      try {
        const next = await loadConsentedCircumcisionGalleries();
        if (cancelled) return;
        setGalleries(next);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  async function continueToPhotos() {
    try {
      sessionStorage.setItem(CONSENT_STORAGE_KEY, "1");
    } catch {
      // Private mode can block storage; the click still reveals this visit.
    }
    setStatus("loading");
    try {
      const next = await loadConsentedCircumcisionGalleries();
      setGalleries(next);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 md:px-8 md:py-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Consent and educational use
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          These photographs show adult patients. Each patient consented to publication of their
          clinical photographs. They are provided only for medical education, to illustrate adult
          circumcision performed at The Urology Place. They are not for commercial, entertainment,
          or any other use.
        </p>
      </div>

      {status === "pending" || status === "loading" ? (
        <p className="mt-10 text-center text-slate-600" role="status">
          {status === "loading" ? "Loading clinical photographs…" : "Preparing this page…"}
        </p>
      ) : null}

      {status === "gated" ? (
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 md:px-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Graphic clinical photographs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-800">
            These photographs show adult genitalia. You must be 18 or older to view them.
            Continuing confirms that you are at least 18 and that you are viewing them for medical
            education, with the understanding that each patient consented to this use.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/men/adult-circumcision" className={BTN_SECONDARY}>
              Leave this page
            </Link>
            <button type="button" onClick={() => void continueToPhotos()} className={BTN_PRIMARY_LARGE}>
              I am 18 or older — view photos
            </button>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <p className="mt-10 text-center text-slate-700" role="alert">
          The photographs could not be loaded. Refresh the page and confirm again to try once more.
        </p>
      ) : null}

      {status === "ready" ? (
        <div className="mx-auto mt-14 max-w-screen-2xl">
          <CircumcisionPhotosGallery galleries={galleries} />
        </div>
      ) : null}
    </div>
  );
}
