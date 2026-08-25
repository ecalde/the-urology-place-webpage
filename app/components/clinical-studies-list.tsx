"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ClinicalStudiesContactSection } from "@/app/components/clinical-studies-contact-section";
import {
  CLINICAL_STUDY_FILTERS,
  clinicalStudyStatusColorClass,
  matchesClinicalStudyFilter,
  type ClinicalStudy,
  type ClinicalStudyFilter,
} from "@/app/data/clinical-study-shared";
import type { ClinicalStudyEligibility } from "@/app/data/clinical-study-eligibility";

type ClinicalStudiesListProps = {
  studies: ClinicalStudy[];
  heading: string;
  description: string;
  filterAriaLabel: string;
  eligibility: ClinicalStudyEligibility;
  showContactSection?: boolean;
};

function filterCount(studies: ClinicalStudy[], filter: ClinicalStudyFilter): number {
  return studies.filter((study) => matchesClinicalStudyFilter(study, filter)).length;
}

export function ClinicalStudiesList({
  studies,
  heading,
  description,
  filterAriaLabel,
  eligibility,
  showContactSection = true,
}: ClinicalStudiesListProps) {
  const [activeFilter, setActiveFilter] = useState<ClinicalStudyFilter>("all");

  const filteredStudies = useMemo(
    () => studies.filter((study) => matchesClinicalStudyFilter(study, activeFilter)),
    [studies, activeFilter],
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100/80 p-6 shadow-sm ring-1 ring-slate-200/60 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {eligibility.title}
        </h2>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          General Eligibility
        </p>
        <ul className="mt-5 list-disc space-y-2.5 pl-5 text-base leading-relaxed text-slate-700">
          {eligibility.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Clinical Trials
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          {description}
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-5 shadow-sm ring-1 ring-slate-200/60 md:p-6">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label={filterAriaLabel}
        >
          {CLINICAL_STUDY_FILTERS.map((filter) => {
            const count = filterCount(studies, filter.id);
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {filteredStudies.map((study) => (
          <article
            key={study.name}
            className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src={study.image}
                alt={study.imageAlt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                {study.name}
              </h3>
              {study.fullName ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {study.fullName}
                </p>
              ) : null}
              <p
                className={`mt-3 text-sm font-semibold uppercase tracking-[0.14em] ${clinicalStudyStatusColorClass(study.status)}`}
              >
                Status: {study.status}
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                {study.description}
              </p>
              {study.nct ? (
                <p className="mt-6 border-t border-slate-100 pt-5">
                  <a
                    href={`https://clinicaltrials.gov/study/${study.nct}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-blue-700 underline decoration-blue-400 underline-offset-2 transition hover:text-blue-800"
                  >
                    {study.nct}
                    <span aria-hidden>↗</span>
                  </a>
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {filteredStudies.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
          No studies match this filter right now.
        </p>
      ) : null}

      {showContactSection ? <ClinicalStudiesContactSection /> : null}
    </div>
  );
}
