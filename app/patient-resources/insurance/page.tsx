import { HERO_IMAGE_SECTION, HERO_TITLE_ON_IMAGE } from "@/app/lib/hero";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/patient-resources/insurance",
  title: "Urology Insurance in San Antonio",
  description:
    "Insurance plans accepted at The Urology Place in San Antonio, including major PPO, HMO, Medicare, and Tricare options.",
});

type InNetworkItem = {
  label: string;
  boldNotes?: readonly string[];
};

const IN_NETWORK_ITEMS: readonly InNetworkItem[] = [
  { label: "AETNA PPO" },
  { label: "AETNA HMO (REFERRAL NEEDED)" },
  { label: "ALLSAVERS" },
  { label: "APWU" },
  { label: "AARP SUPPLEMENT(S)" },
  { label: "BCBS PPO" },
  {
    label: "BAYLOR SCOTT",
    boldNotes: ["PPO AND HMO ONLY", "NO MEDICARE ADVANTAGE PLANS"],
  },
  { label: "CIGNA PPO" },
  { label: "CIGNA HMO (REFERRAL NEEDED)" },
  { label: "CURATIVE" },
  { label: "COMMUNITY CARE (VA- REFERRAL NEEDED)" },
  { label: "GEHA" },
  { label: "HUMANA PPO" },
  {
    label: "HUMANA HMO (REFERRAL NEEDED)",
    boldNotes: ["ONLY GOLD +"],
  },
  { label: "UNIVERSITY OF INCARNATE WORLD" },
  { label: "MEDICARE PART B" },
  { label: "MEDISHARE" },
  { label: "MULTIPLAN" },
  { label: "MUTUAL OF OMAHA SUPPLEMENT(S)" },
  { label: "OSCAR PPO" },
  { label: "OSCAR HMO (REFERRAL NEEDED)" },
  { label: "PROSPECT MEDICAL MEMBERS" },
  { label: "SCAN" },
  { label: "TRICARE PRIME (REFERRAL NEEDED)" },
  { label: "TRICARE SELECT" },
  { label: "TRICARE FOR LIFE" },
  { label: "PHCS" },
  { label: "UMR" },
  { label: "UHC PPO" },
  {
    label: "UHC HMO (REFERRAL NEEDED)",
    boldNotes: ["NO MARKET PLACE PLANS"],
  },
  { label: "WEBTPA" },
  { label: "WELLPOINT" },
  { label: "90 DEGREE" },
];

const OUT_OF_NETWORK_ITEMS = [
  "AETNA BETTER HEALTH",
  "AMBETTER",
  "AETNA WHOLE HEALTH",
  "AETNA CVS EXCHANGE PLANS",
  "AMERIGROUP",
  "BCBS HMO/ HME/ HNP/ TRS",
  "BCBS BLUE HEALTH",
  "COMMUNITY FIRST HEALTH PLANS",
  "CHRISTUS HEALTH PLAN",
  "HUMANA GOLD",
  "MEDICAID",
  "MOLINA",
  "SUPERIOR HEALTH",
  "UHC TEXAS EXCHANGE",
  "UHC DUAL COMPLETE",
  "UHC MARKETPLACE PLANS",
  "WELLCARE",
] as const;

export default function InsurancePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className={HERO_IMAGE_SECTION}
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
          <h1 className={HERO_TITLE_ON_IMAGE}>
            Insurance
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="mx-auto grid max-w-7xl items-start justify-center gap-8 lg:grid-cols-2">
              <section className="w-full rounded-2xl bg-slate-50/70 p-6 ring-1 ring-slate-200 md:p-8">
                <h3 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  INSURANCE WE ACCEPT
                </h3>
                <p className="mt-3 text-center text-sm font-medium tracking-wide text-slate-600">
                  IN NETWORK
                </p>
                <ul className="mt-8 space-y-1.5 text-slate-700">
                  {IN_NETWORK_ITEMS.map((item) => (
                    <li key={item.label}>
                      -{item.label}
                      {item.boldNotes?.map((note) => (
                        <span key={note} className="ml-1 font-bold italic text-slate-900">
                          {note}
                        </span>
                      )) ?? null}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="w-full rounded-2xl bg-slate-50/70 p-6 ring-1 ring-slate-200 md:p-8">
                <h3 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  INSURANCE WE DON&apos;T ACCEPT
                </h3>
                <p className="mt-3 text-center text-sm font-medium tracking-wide text-slate-600">
                  OUT OF NETWORK
                </p>
                <ul className="mt-8 space-y-1.5 text-slate-700">
                  {OUT_OF_NETWORK_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
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

