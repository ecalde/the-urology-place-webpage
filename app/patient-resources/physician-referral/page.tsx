import { BTN_PRIMARY_LARGE } from "@/app/lib/button-styles";

export default function PhysicianReferralPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[42vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage:
            "url(/images/physician%20referral/businessman-using-a-computer-talking-on-the-mobile-phone-2880w.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Physician Referral
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
            <p className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              If you are a doctor&apos;s office and would like to refer or
              authorize a patient visit or procedure:
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <button type="button" className={BTN_PRIMARY_LARGE}>
                Form fillable online
              </button>
              <button type="button" className={BTN_PRIMARY_LARGE}>
                Print form from Web
              </button>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                NOTICE
              </h2>
              <div className="mx-auto mt-4 h-px w-20 bg-slate-300" aria-hidden />
            </div>

            <div className="mx-auto mt-10 max-w-3xl text-left text-slate-700 leading-relaxed">
              <p>
                We want to take a moment to clarify our scheduling process
                regarding referrals. While we appreciate the trust you place in
                us by obtaining a referral to our clinic, please note that
                receiving a referral does{" "}
                <span className="font-semibold text-slate-900">not</span>{" "}
                guarantee priority scheduling.
              </p>

              <p className="mt-6">
                Due to high patient volume, our appointments are allocated
                based on medical necessity and availability. We strive to
                accommodate all patients as quickly as possible, but wait times
                may vary.
              </p>

              <p className="mt-8 font-semibold text-slate-900">
                Referral Timeline:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Verification: 1-2 business days</li>
                <li>Filing: 1-3 business days</li>
                <li>Processing: Up to 5 business days</li>
              </ul>

              <p className="mt-8">
                Once your referral is processed, please call our office to
                schedule your appointment.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

