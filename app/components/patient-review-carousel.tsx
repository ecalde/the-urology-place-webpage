"use client";

import { useEffect, useState } from "react";
import { PATIENT_REVIEWS } from "@/app/data/patient-reviews";
import { BTN_ICON_PRIMARY } from "@/app/lib/button-styles";

const ROTATION_INTERVAL_MS = 8000;
const FADE_DURATION_MS = 450;

export function PatientReviewCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setVisible(false);
      timeoutId = setTimeout(() => {
        setIndex((i) => (i + 1) % PATIENT_REVIEWS.length);
        setVisible(true);
      }, FADE_DURATION_MS);
    }, ROTATION_INTERVAL_MS);
    return () => {
      clearInterval(id);
      clearTimeout(timeoutId);
    };
  }, []);

  const review = PATIENT_REVIEWS[index];
  const goPrev = () => {
    setVisible(false);
    setTimeout(() => {
      setIndex((i) => (i - 1 + PATIENT_REVIEWS.length) % PATIENT_REVIEWS.length);
      setVisible(true);
    }, FADE_DURATION_MS);
  };
  const goNext = () => {
    setVisible(false);
    setTimeout(() => {
      setIndex((i) => (i + 1) % PATIENT_REVIEWS.length);
      setVisible(true);
    }, FADE_DURATION_MS);
  };

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <button
        type="button"
        onClick={goPrev}
        className={BTN_ICON_PRIMARY}
        aria-label="Previous review"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div
        className={`min-h-[120px] flex-1 transition-opacity duration-300 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
      >
        <blockquote className="text-center">
          <p className="mx-auto max-w-3xl text-lg text-white md:text-xl">
            &ldquo;{review.quote}&rdquo;
          </p>
          <footer className="mt-6 font-semibold text-black">
            — {review.name}
          </footer>
        </blockquote>
      </div>
      <button
        type="button"
        onClick={goNext}
        className={BTN_ICON_PRIMARY}
        aria-label="Next review"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
