export default function InsurancePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[42vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage:
            "url(/images/insurance/photo-1521540124319-66c09f0d5999-2880w.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Insurance
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              INSURANCE WE ACCEPT
            </h2>
            <p className="mt-6 text-center text-slate-700">
              The Urology Place accepts most insurance plans (non HMO)
            </p>

            <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-slate-50/70 p-6 ring-1 ring-slate-200 md:p-8">
              <ul className="grid grid-cols-1 gap-x-10 gap-y-2 text-slate-700 sm:grid-cols-2">
                <li>Aetna</li>
                <li>Blue Cross Blue Shield (no HMO)</li>
                <li>Champ VA</li>
                <li>Cigna (includes Healthspring &amp; Bravo)</li>
                <li>Health Texas</li>
                <li>Humana (except for Humana Gold)</li>
                <li>Health Payors Organization</li>
                <li>HealthSmart Preferred Care</li>
                <li>Independent Medical Systems</li>
                <li>Medicare</li>
                <li>Medicare (Railroad)</li>
                <li>Multiplan &amp; Private Healthcare Systems (PHCS)</li>
                <li>Oscar Insurance Health Plan</li>
                <li>PHCS Savility PPO</li>
                <li>Three Rivers Provider Network</li>
                <li>Tricare</li>
                <li>
                  United Healthcare (includes AARP Medicare, Care Improvement
                  Plus, &amp; UMR)
                </li>
                <li>USA Managed Care Organization</li>
                <li>WellMed</li>
                <li>Multiplan</li>
              </ul>
            </div>

            <div className="mx-auto mt-12 max-w-4xl text-slate-700 leading-relaxed">
              <p>
                Please call us if you have any questions about coverage for a
                specific health plan or a particular procedure. Many times, our
                staff can assist you in determining coverage and ensuring we
                acquire all required pre-authorizations for your appointments.
                Please also notify us if you would like for us to request
                coverage of your insurance. Occasionally, new plans come on the
                market that we are not aware of. If for any reason we cannot
                see you for covered services under your health plan, we can
                offer new patient appointments for $250 and follow up visits at
                a discounted price. We do NOT accept checks. We take cash,
                debit cards and credit cards.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

