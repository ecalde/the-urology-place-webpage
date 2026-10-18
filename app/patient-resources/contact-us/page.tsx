import type { Metadata } from "next";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import {
  CLINIC_BUSINESS_HOURS_ROWS,
  CLINIC_PHONE,
  clinicPhoneTelHref,
} from "@/app/lib/clinic-info";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_IMAGE_SECTION,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
const EMAIL = "messages@theupi.com";
const RESEARCH_EMAIL = "research@theupi.com";
const BILLING_EMAIL = "billing@theupi.com";
const NEW_PATIENT_REFERRAL_FAX = "(210) 761-8851";

const DEPARTMENT_EMAIL_CONTACTS = [
  {
    department: "Clinical Research",
    email: RESEARCH_EMAIL,
    description: "Clinical trials, study eligibility, and research-related questions.",
  },
  {
    department: "Patient Messages",
    email: EMAIL,
    description: "Scheduling, general inquiries, and other non-urgent messages.",
  },
  {
    department: "Billing",
    email: BILLING_EMAIL,
    description: "Itemized statements, account balances, and insurance or billing questions.",
  },
] as const;
const ADDRESS_LINES = [
  "9618 Huebner Road, Suite 120",
  "San Antonio, TX 78240",
] as const;

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=9618+Huebner+Road+Suite+120+San+Antonio+TX+78240&t=&z=15&ie=UTF8&iwloc=&output=embed";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=9618+Huebner+Road+Suite+120+San+Antonio+TX+78240";

export const metadata: Metadata = {
  title: "Contact Our San Antonio Urologist",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceBuilding.png)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>
            Contact Us
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className={`${HERO_AFTER_SLIDE_BASE} bg-white`}>
        {/* Contact form */}
        <section className="bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Patient Resources"
              headingOverride="Contact Us"
              serviceName="General Inquiry"
              category="Patient Resources"
              sourcePath="/patient-resources/contact-us"
              idPrefix="contact-us"
            />
          </div>
        </section>

        {/* How to reach us — centered */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center md:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How to reach us
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-700 leading-relaxed">
              Call for scheduling and the quickest answers to most questions. For
              email, choose a department address below—please include your name,
              phone number, and a callback time.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={clinicPhoneTelHref()}
                className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Call {CLINIC_PHONE}
              </a>
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-600 leading-relaxed">
              If you are experiencing a medical emergency, call 911. For urgent
              issues that are not an emergency, call the number above rather than
              email.
            </p>
          </div>
        </section>

        {/* Email by Department — centered */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Email by Department
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 leading-relaxed">
              Using the right address helps us route your message to the correct
              team.
            </p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {DEPARTMENT_EMAIL_CONTACTS.map((row) => (
                <li
                  key={row.email}
                  className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 text-center shadow-sm md:p-7"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {row.department}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                    {row.description}
                  </p>
                  <a
                    href={`mailto:${row.email}`}
                    className="mt-6 inline-flex rounded-full border-2 border-blue-600 bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {row.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Clinic Information — centered */}
        <section className="border-t border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Clinic Information
            </h2>
            <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 md:p-8">
              <div className="text-slate-700">
                <p className="text-sm font-semibold text-slate-900">Address</p>
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-800"
                >
                  {ADDRESS_LINES[0]}
                  <br />
                  {ADDRESS_LINES[1]}
                </a>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:text-center">
                <div className="rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-900">Phone</p>
                  <a
                    href={clinicPhoneTelHref()}
                    className="mt-1 inline-block text-sm text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-800"
                  >
                    {CLINIC_PHONE}
                  </a>
                </div>
                <div className="rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-900">
                    New Patient Referral Fax
                  </p>
                  <a
                    href="tel:2107618851"
                    className="mt-1 inline-block text-sm text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-800"
                  >
                    {NEW_PATIENT_REFERRAL_FAX}
                  </a>
                </div>
                <div className="rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-200 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Office Fax
                  </p>
                  <p className="mt-1 text-sm text-slate-700">(888) 316-9464</p>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Business Hours
                </p>
                <div className="mx-auto mt-3 w-fit text-left text-sm text-slate-700">
                  <dl className="space-y-1">
                    {CLINIC_BUSINESS_HOURS_ROWS.map((row) => (
                      <div
                        key={row.days}
                        className="grid grid-cols-[10rem_1fr] gap-x-6"
                      >
                        <dt className="font-medium text-slate-900">
                          {row.days}
                        </dt>
                        <dd>{row.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directions: larger map + video (adds value beyond footer) */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Directions to The Urology Place
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <iframe
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="340"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Urology Place location"
                  className="block"
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {ADDRESS_LINES[0]}
                  </p>
                  <p className="text-sm text-slate-600">{ADDRESS_LINES[1]}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <YouTubeEmbed
                  videoId="H6AOCeoJnNU"
                  title="Directions to The Urology Place"
                  className="rounded-none"
                />
              </div>
            </div>
          </div>
        </section>

      </section>
    </main>
  );
}

