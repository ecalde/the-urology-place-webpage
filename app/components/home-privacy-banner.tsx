"use client";

import Link from "next/link";
import { useState } from "react";

const PRIVACY_POLICY_HREF = "/patient-resources/privacy-policy-hipaa";

export function HomePrivacyBanner() {
  const [sessionDismissed, setSessionDismissed] = useState(false);

  const handleClose = () => {
    setSessionDismissed(true);
  };

  const handlePolicyClick = () => {
    setSessionDismissed(true);
  };

  if (sessionDismissed) {
    return null;
  }

  return (
    <div
      className="home-privacy-banner-animate fixed inset-x-0 top-16 z-[38] border-b border-white/10 bg-black px-4 py-3 text-white shadow-lg md:px-6"
      role="region"
      aria-label="Privacy notice"
    >
      <div className="relative mx-auto max-w-6xl px-10 md:px-12">
        <p className="text-center text-sm leading-relaxed md:text-base">
          All information entered on this website is protected by our{" "}
          <Link
            href={PRIVACY_POLICY_HREF}
            onClick={handlePolicyClick}
            className="underline decoration-white/60 underline-offset-2 transition hover:decoration-white"
          >
            privacy policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-1"
          aria-label="Dismiss privacy notice"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
