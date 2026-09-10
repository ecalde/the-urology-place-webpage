"use client";

import Link from "next/link";
import { useState } from "react";

const PRIVACY_POLICY_HREF = "/patient-resources/privacy-policy-hipaa";
const CONTACT_EMAIL = "messages@theupi.com";

export function HomePrivacyBanner() {
  const [privacyDismissed, setPrivacyDismissed] = useState(false);
  const [phoneDismissed, setPhoneDismissed] = useState(false);

  if (privacyDismissed && phoneDismissed) {
    return null;
  }

  return (
    <div
      className="home-privacy-banner-animate fixed inset-x-0 top-16 z-[38] flex flex-col shadow-lg"
      role="region"
      aria-label="Site notices"
    >
      {!privacyDismissed ? (
        <div
          className="border-b border-white/10 bg-black px-4 py-3 text-white md:px-6"
          role="region"
          aria-label="Privacy notice"
        >
          <div className="relative mx-auto max-w-6xl px-10 md:px-12">
            <p className="text-center text-sm leading-relaxed md:text-base">
              All information entered on this website is protected by our{" "}
              <Link
                href={PRIVACY_POLICY_HREF}
                onClick={() => setPrivacyDismissed(true)}
                className="underline decoration-white/60 underline-offset-2 transition hover:decoration-white"
              >
                privacy policy
              </Link>
              .
            </p>
            <button
              type="button"
              onClick={() => setPrivacyDismissed(true)}
              className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-1"
              aria-label="Dismiss privacy notice"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {!phoneDismissed ? (
        <div
          className="border-b border-amber-900/20 bg-amber-50 px-4 py-3 text-amber-950 md:px-6"
          role="alert"
          aria-label="Phone service notice"
        >
          <div className="relative mx-auto max-w-6xl px-10 md:px-12">
            <p className="text-center text-sm leading-relaxed md:text-base">
              Our phone lines are temporarily unavailable. Please email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold underline decoration-amber-800/50 underline-offset-2 transition hover:decoration-amber-950"
              >
                {CONTACT_EMAIL}
              </a>
              . We apologize for the inconvenience and appreciate your
              patience.
            </p>
            <button
              type="button"
              onClick={() => setPhoneDismissed(true)}
              className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-amber-950 transition hover:bg-amber-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 md:right-1"
              aria-label="Dismiss phone service notice"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
