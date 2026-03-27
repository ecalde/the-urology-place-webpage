"use client";

import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";
import {
  APPOINTMENT_REASON_OPTIONS,
  BEST_TIME_TO_REACH_OPTIONS,
  BEST_WAY_TO_REACH_OPTIONS,
  type AppointmentReasonOption,
} from "@/app/lib/contact-form-defaults";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

const PHONE = "210-617-3670";

export type ContactFormFieldsProps = {
  idPrefix?: string;
  defaultAppointmentReason: AppointmentReasonOption;
  serviceName: string;
  category: string;
  sourcePath: string;
};

export function ContactFormFields({
  idPrefix,
  defaultAppointmentReason,
  serviceName,
  category,
  sourcePath,
}: ContactFormFieldsProps) {
  const id = (suffix: string) => (idPrefix ? `${idPrefix}-${suffix}` : suffix);

  const [appointmentReason, setAppointmentReason] = useState<string>(
    defaultAppointmentReason,
  );
  const [bestTimeToReach, setBestTimeToReach] = useState<string>(
    BEST_TIME_TO_REACH_OPTIONS[0],
  );
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const reasonIsOther = appointmentReason === "Other";
  const timeIsOther = bestTimeToReach === "Other";

  useEffect(() => {
    setAppointmentReason(defaultAppointmentReason);
  }, [defaultAppointmentReason]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
      <form className="grid gap-6 sm:grid-cols-2" action="#" method="post">
        <input type="hidden" name="serviceName" value={serviceName} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="sourcePath" value={sourcePath} />
        <input
          type="hidden"
          name="g-recaptcha-response"
          value={captchaToken ?? ""}
        />

        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={id("contact-first-name")}
              className="block text-sm font-medium text-slate-700"
            >
              First Name
            </label>
            <input
              id={id("contact-first-name")}
              name="firstName"
              type="text"
              autoComplete="given-name"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor={id("contact-last-name")}
              className="block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>
            <input
              id={id("contact-last-name")}
              name="lastName"
              type="text"
              autoComplete="family-name"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={id("contact-phone")}
            className="block text-sm font-medium text-slate-700"
          >
            Phone Number
          </label>
          <input
            id={id("contact-phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor={id("contact-email")}
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id={id("contact-email")}
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={id("contact-appointment-reason")}
            className="block text-sm font-medium text-slate-700"
          >
            Appointment Reason
          </label>
          <select
            id={id("contact-appointment-reason")}
            name="appointmentReason"
            className={inputClass}
            value={appointmentReason}
            onChange={(e) => setAppointmentReason(e.target.value)}
          >
            {APPOINTMENT_REASON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {reasonIsOther ? (
          <div className="sm:col-span-2">
            <label
              htmlFor={id("contact-other-appointment-reason")}
              className="block text-sm font-medium text-slate-700"
            >
              Other Appointment Reason
            </label>
            <input
              id={id("contact-other-appointment-reason")}
              name="otherAppointmentReason"
              type="text"
              className={inputClass}
            />
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label
            htmlFor={id("contact-reach")}
            className="block text-sm font-medium text-slate-700"
          >
            Best Way to Reach Me
          </label>
          <select
            id={id("contact-reach")}
            name="bestWayToReach"
            className={inputClass}
            defaultValue={BEST_WAY_TO_REACH_OPTIONS[0]}
          >
            {BEST_WAY_TO_REACH_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={id("contact-best-time")}
            className="block text-sm font-medium text-slate-700"
          >
            Best Time to Reach Me
          </label>
          <select
            id={id("contact-best-time")}
            name="bestTimeToReachMe"
            className={inputClass}
            value={bestTimeToReach}
            onChange={(e) => setBestTimeToReach(e.target.value)}
          >
            {BEST_TIME_TO_REACH_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {timeIsOther ? (
          <div className="sm:col-span-2">
            <label
              htmlFor={id("contact-other-best-time")}
              className="block text-sm font-medium text-slate-700"
            >
              Other Best Time to Reach Me
            </label>
            <input
              id={id("contact-other-best-time")}
              name="otherBestTimeToReachMe"
              type="text"
              className={inputClass}
            />
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label
            htmlFor={id("contact-message")}
            className="block text-sm font-medium text-slate-700"
          >
            Message
          </label>
          <textarea
            id={id("contact-message")}
            name="message"
            rows={6}
            className={`${inputClass} resize-y min-h-[140px]`}
          />
        </div>

        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-slate-700">Verification</p>
          {recaptchaSiteKey ? (
            <div className="mt-2">
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>
          ) : (
            <div
              className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-center"
              role="status"
              aria-label="CAPTCHA not configured"
            >
              <p className="text-sm text-slate-600">
                Add{" "}
                <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
                  NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                </code>{" "}
                to enable Google reCAPTCHA on this form.
              </p>
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <button type="submit" className={BTN_PRIMARY_LARGE}>
            SUBMIT
          </button>
          <p className="mt-3 text-sm text-slate-600">
            This form is for non-emergency questions only. If you are
            experiencing a medical emergency, call 911. For urgent matters, you
            can also reach us at{" "}
            <a
              href={`tel:${PHONE.replace(/-/g, "")}`}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              {PHONE}
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
