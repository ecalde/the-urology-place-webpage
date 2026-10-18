import type { Metadata } from "next";
import Image from "next/image";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/lib/button-styles";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_IMAGE_SECTION,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

const PATIENT_PORTAL_HREF = "https://app.elationpassport.com/passport/login/";
const FAQ_HREF =
  "https://help.elationhealth.com/articles/Patient-Passport-Frequently-Asked-Questions-for-Patients";
const SUPPORT_HREF = "https://app.elationemr.com/support/";
const TROUBLESHOOTING_HREF =
  "https://help.elationhealth.com/articles/User-Accounts-Guide-Troubleshooting-account-login-issues";

export const metadata: Metadata = {
  title: "Patient Portal in San Antonio",
};

export default function PatientPortalPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage:
            "url(/images/patient%20portal/photo-1516321318423-f06f85e504b3-2880w.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>
            Patient Portal
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className={HERO_AFTER_SLIDE_BASE}>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
              <div className="rounded-2xl bg-slate-50/80 p-8 ring-1 ring-slate-200">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Patient Portal:
                </h2>
                <p className="mt-4 text-slate-700 leading-relaxed">
                  If you are an existing patient, you can view your labs and
                  reports. You need to have created an account with our
                  electronic medical record, ElationEMR. The portal requires an
                  email and a mobile phone number capable of receiving text
                  messages.
                </p>
                <p className="mt-4 text-slate-700 leading-relaxed">
                  Patient Passport is invitation-based and gives you secure
                  access to visit summaries, lab results, messages, medications,
                  and other important health information between visits.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/70 to-blue-50 p-8 shadow-sm ring-1 ring-slate-200/70">
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                    <Image
                      src="/images/patient portal/elationbutton.png"
                      alt="Elation logo"
                      width={408}
                      height={131}
                      className="h-auto w-full max-w-[240px] object-contain mix-blend-multiply"
                    />
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-sky-700">
                      Secure Patient Passport Access
                    </p>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 md:text-[15px]">
                      Sign in to review messages, lab results, visit summaries,
                      and other health information in your portal account.
                    </p>
                    <a
                      href={PATIENT_PORTAL_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 inline-flex ${BTN_PRIMARY}`}
                    >
                      Open Patient Portal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Need Help Accessing the Patient Portal?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-700">
                If you have questions about logging in, viewing your records, or
                using the portal, these Elation resources can help. They cover
                common questions, portal access, password resets, and where to
                go if you still need support.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Patient Portal FAQ
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                  Learn how Patient Passport works, what you can view in the
                  portal, how invitations work, how to reset your password, and
                  how to update your login information.
                </p>
                <a
                  href={FAQ_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex ${BTN_SECONDARY}`}
                >
                  Read FAQs
                </a>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Elation Support
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                  If you are unable to access your account and need additional
                  help, use Elation&apos;s support resources for portal-related
                  assistance.
                </p>
                <a
                  href={SUPPORT_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex ${BTN_SECONDARY}`}
                >
                  Contact Support
                </a>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Troubleshooting Login Issues
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                  Review step-by-step guidance for login trouble, including
                  password reset help, account access issues, and who to contact
                  when you cannot get back in.
                </p>
                <a
                  href={TROUBLESHOOTING_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex ${BTN_SECONDARY}`}
                >
                  Troubleshoot Login
                </a>
              </article>
            </div>

            <div className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
              <p className="text-sm leading-relaxed text-slate-700 md:text-[15px]">
                Tip: if you never received your portal invitation, are unsure
                which email is attached to your account, or need your account
                information updated, contacting our office is often the fastest
                next step.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

