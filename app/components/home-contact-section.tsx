import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";

const APPOINTMENT_REASONS = [
  "General Urology",
  "Prostate Cancer",
  "Erectile Dysfunction Treatment",
  "Peyronie's Disease",
  "GAINSWave",
  "CaverStem",
  "Enlarged Prostate",
  "Circumcision",
  "Vasectomy",
  "Urinary Incontinence",
  "Hormone Replacement Therapy",
  "Kidney Stone",
  "Ultrafemme",
  "Vaginal Mesh Removal",
  "Weight Loss",
] as const;

const REACH_OPTIONS = ["Phone", "Email", "Text"] as const;

const PHONE = "210-617-3670";

export function HomeContactSection() {
  return (
    <section
      className="border-t border-slate-200 bg-slate-50/50"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2
          id="contact-heading"
          className="sr-only"
        >
          Request an appointment and contact information
        </h2>

        {/* Request An Appointment — full width card */}
        <div className="mb-16 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <h3 className="text-2xl font-bold tracking-tight text-blue-700 md:text-3xl">
            Request An Appointment
          </h3>
          <form
            className="mt-6 grid gap-6 sm:grid-cols-2"
            action="#"
            method="post"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appt-first-name"
                  className="block text-sm font-medium text-slate-700"
                >
                  First Name
                </label>
                <input
                  id="appt-first-name"
                  name="firstName"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="appt-last-name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Last Name
                </label>
                <input
                  id="appt-last-name"
                  name="lastName"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appt-phone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>
                <input
                  id="appt-phone"
                  name="phone"
                  type="tel"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="appt-email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="appt-email"
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appt-reason"
                  className="block text-sm font-medium text-slate-700"
                >
                  Appointment Reason
                </label>
                <select
                  id="appt-reason"
                  name="appointmentReason"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {APPOINTMENT_REASONS.map((reason) => (
                    <option
                      key={reason}
                      value={reason}
                    >
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="appt-reach"
                  className="block text-sm font-medium text-slate-700"
                >
                  Best Way to Reach Me
                </label>
                <select
                  id="appt-reach"
                  name="bestWayToReach"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {REACH_OPTIONS.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="appt-best-time"
                className="block text-sm font-medium text-slate-700"
              >
                Best Time to Contact
              </label>
              <textarea
                id="appt-best-time"
                name="bestTimeToContact"
                rows={4}
                className="mt-1 block w-full resize-y min-h-[100px] rounded-lg border border-slate-300 bg-slate-50/80 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-describedby="resize-hint"
              />
              <p
                id="resize-hint"
                className="sr-only"
              >
                You can drag the bottom-right corner to resize this field.
              </p>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className={BTN_PRIMARY_LARGE}
              >
                SUBMIT
              </button>
              <p className="mt-4 text-sm text-slate-600">
                Please do not use this form for EMERGENCIES. If your inquiry is
                urgent please call us{" "}
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
      </div>
    </section>
  );
}
