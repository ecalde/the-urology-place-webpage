import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

const PHONE = "210-617-3670";
const EMAIL = "messages@theupi.com";
const BILLING_EMAIL = "billing@theupi.com";
const ADDRESS_LINES = [
  "9618 Huebner Road, Suite 120",
  "San Antonio, TX 78240",
] as const;

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=9618+Huebner+Road+Suite+120+San+Antonio+TX+78240&t=&z=15&ie=UTF8&iwloc=&output=embed";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[42vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceBuilding.png)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Quick actions + clinic info (clean, non-repetitive) */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  The fastest way to reach us
                </h2>
                <p className="mt-4 max-w-2xl text-slate-700 leading-relaxed">
                  For scheduling and most questions, calling is the quickest.
                  For non-urgent messages, email works great—include your name,
                  date of birth, and the best time to reach you.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`tel:${PHONE.replace(/-/g, "")}`}
                    className="rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Call {PHONE}
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="rounded-full border-2 border-blue-600 bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Email {EMAIL}
                  </a>
                </div>

                <p className="mt-6 text-sm text-slate-600">
                  If you are experiencing a medical emergency, call 911.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">
                    Clinic information
                  </h3>
                  <div className="mt-4 space-y-4 text-slate-700">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Address
                      </p>
                      <p className="mt-1 text-sm">
                        {ADDRESS_LINES[0]}
                        <br />
                        {ADDRESS_LINES[1]}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200">
                        <p className="text-sm font-semibold text-slate-900">
                          New Patient Referral Fax
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          (210) 761-8851
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200">
                        <p className="text-sm font-semibold text-slate-900">
                          Office Fax
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          (888) 316-9464
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      For billing questions, use the billing contact below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Billing question callout */}
        <section className="border-t border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 md:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Billing question?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Call our office at (210) 617-3670. For itemized statements or
                questions about balances, please send an email to:{" "}
                <a
                  href={`mailto:${BILLING_EMAIL}`}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Billing@theupi.com
                </a>
                .
              </p>
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

        {/* Contact form */}
        <section className="border-t border-slate-200 bg-slate-50/50">
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
      </section>
    </main>
  );
}

