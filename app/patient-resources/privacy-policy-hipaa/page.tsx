import { PrivacyPolicyNoticeAcknowledge } from "@/app/components/privacy-policy-notice-acknowledge";
import {
  PrivacyPolicySanityContent,
  type PrivacyPolicySanityData,
} from "@/app/components/privacy-policy-sanity-content";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_IMAGE_SECTION,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { client, privacyPolicyQuery } from "@/lib/sanity";
import { pageMetadata } from "@/app/lib/site-metadata";

const IMG_DIR = "/images/privacy policy hippa";

const HERO_BG = `url(${encodeURI(`${IMG_DIR}/Doctor-with-Patient-scaled.jpg`)})`;

export const metadata = pageMetadata({
  path: "/patient-resources/privacy-policy-hipaa",
  title: "HIPAA Privacy Policy in San Antonio",
  description:
    "Privacy Policy for The Urology Place website and services. Contact us with questions about how we handle your information.",
});

export const revalidate = 300;

export default async function PrivacyPolicyHipaaPage() {
  const policy = await client.fetch<PrivacyPolicySanityData | null>(
    privacyPolicyQuery,
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <PrivacyPolicyNoticeAcknowledge />
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: HERO_BG,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>Privacy Policy HIPAA</h1>
        </div>
      </section>

      <section
        className={`${HERO_AFTER_SLIDE_BASE} bg-gradient-to-b from-slate-50 via-white to-slate-50/90`}
      >
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          {policy ? (
            <PrivacyPolicySanityContent data={policy} />
          ) : (
            <p className="text-center text-slate-600 leading-relaxed">
              Add and publish a{" "}
              <strong className="font-semibold text-slate-800">
                Privacy Policy (HIPAA page)
              </strong>{" "}
              document in Sanity Studio to show policy content, lead image, and
              effective date on this page.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
