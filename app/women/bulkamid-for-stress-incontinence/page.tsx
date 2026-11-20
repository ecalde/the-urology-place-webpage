import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BulkamidFaqAccordion } from "@/app/components/bulkamid-faq-accordion";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import { BTN_MAKE_APPOINTMENT_HERO } from "@/app/lib/button-styles";
import { CLINIC_PHONE, clinicPhoneTelHref } from "@/app/lib/clinic-info";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { pageMetadata } from "@/app/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/women/bulkamid-for-stress-incontinence",
  title: "Bulkamid for Stress Incontinence in San Antonio",
  description:
    "Bulkamid is a one-time, 10–15 minute in-office procedure for stress urinary incontinence — no surgery, no mesh, no incisions. Now offered at The Urology Place in San Antonio.",
});

/**
 * Placeholder until official Bulkamid photos arrive.
 * Replace this path only. Keep it a clinic-branded or neutral image —
 * not a patient, treatment, or circumcision photo, and not the share image.
 */
const HERO_BG = "/images/branding/TheUrologyPlaceBuilding.png";

/** Published About Us portraits. Remote so this page stays off the circumcision gallery. */
const TEAM_PORTRAITS = [
  {
    src: "https://cdn.sanity.io/images/5zd6me01/production/af67d6a06f9bf62e4e47107ced5a617ef6f6209a-1920x2485.jpg",
    name: "Dr. Naveen Kella",
    role: "Urologist",
  },
  {
    src: "https://cdn.sanity.io/images/5zd6me01/production/8a5e50c9287dd3badc7d03bb0119050ab59f85d7-2863x3362.jpg",
    name: "Savannah Eggers, PA",
    role: "Physician Assistant",
  },
] as const;

const EVALUATION_PHOTO = "/images/men/KellaInOffice.png";

const EMSELLA_HREF = "/women/emsella-for-incontinence";
const CONTACT_HREF = "#women-bulkamid-contact";

const BULKAMID_VIDEO_ID = "-wtESRX_sZc";

const H2 = "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl";
const PROSE = "text-base leading-relaxed text-slate-700 md:text-lg";
const LIST = `mt-6 list-disc space-y-2 pl-5 ${PROSE}`;
const TEXT_LINK =
  "font-semibold text-blue-700 underline decoration-blue-400 underline-offset-2 hover:text-blue-800";

const EVALUATION_ITEMS = [
  "A conversation about your symptoms and how they affect your daily life",
  "A physical exam",
  "A urine test to rule out infection",
  "A check of how well your bladder empties",
  "Sometimes, a bladder diary or additional bladder testing",
] as const;

const CANDIDATES = [
  "Women with stress incontinence, or mixed incontinence where stress leakage is the main problem",
  "Women who want to avoid or delay surgery, or prefer a shorter recovery",
  "Women who still have leakage after a previous incontinence surgery",
  "Women who may still want to have children in the future",
] as const;

const RISKS = [
  "Temporary discomfort or burning with urination",
  "A small amount of blood in the urine for a short time",
  "Urinary tract infection (a few percent of patients)",
  "Temporary difficulty emptying the bladder (a few percent of patients); this usually resolves quickly",
] as const;

const COMPARISON_ROWS = [
  {
    label: "Type",
    emsella: "Non-invasive muscle strengthening",
    bulkamid: "Minimally invasive injection",
  },
  {
    label: "Anesthesia",
    emsella: "None",
    bulkamid: "Local numbing",
  },
  {
    label: "Number of visits",
    emsella: "Usually 6 sessions over ~3 weeks",
    bulkamid: "Usually one procedure (some need a top-up)",
  },
  {
    label: "Downtime",
    emsella: "None",
    bulkamid: "Minimal, typically 1–2 days",
  },
  {
    label: "Best suited for",
    emsella: "Mild to moderate leakage; weak pelvic muscles",
    bulkamid:
      "Stress leakage, including after failed surgery or when avoiding surgery",
  },
] as const;

function TeamPortraits() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {TEAM_PORTRAITS.map((person) => (
        <figure key={person.name} className="min-w-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200">
            <Image
              src={person.src}
              alt={person.name}
              fill
              unoptimized
              className="object-cover object-top"
              sizes="(min-width: 1024px) 200px, 40vw"
            />
          </div>
          <figcaption className="mt-3 text-center">
            <span className="block text-sm font-semibold text-slate-900">
              {person.name}
            </span>
            <span className="mt-0.5 block text-sm text-slate-600">
              {person.role}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function Section({
  children,
  muted = false,
  wide = false,
  bordered = true,
  id,
}: {
  children: ReactNode;
  muted?: boolean;
  wide?: boolean;
  bordered?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`${bordered ? "border-t border-slate-200" : ""} ${
        muted ? "bg-slate-50/90" : "bg-white"
      }`}
    >
      <div
        className={`mx-auto px-6 py-16 md:py-20 ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function BulkamidForStressIncontinencePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>
            Bulkamid for Stress Incontinence
          </h1>
          <p className={`mx-auto mt-5 max-w-2xl ${HERO_SUBTITLE_ON_IMAGE}`}>
            A one-time, 10–15 minute in-office procedure for stress urinary
            incontinence — no surgery, no mesh, no incisions.
          </p>
          <div className="mt-8">
            <a href={CONTACT_HREF} className={BTN_MAKE_APPOINTMENT_HERO}>
              Make Appointment
            </a>
          </div>
        </div>
      </section>

      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <Section bordered={false}>
          <h2 className={H2}>
            Bulkamid: A One-Time Office Procedure for Stress Incontinence
          </h2>
          <p className={`mt-6 ${PROSE}`}>
            Leaking when you laugh, cough, sneeze, or exercise is called stress
            urinary incontinence (SUI). It happens when the muscles and tissues
            that support the bladder and urethra (the tube that carries urine
            out of the body) become weakened — commonly after pregnancy and
            childbirth, menopause, or aging. SUI affects up to one in three
            women. It is common, but it is not something you have to simply live
            with.
          </p>
          <p className={`mt-6 ${PROSE}`}>
            At The Urology Place in San Antonio, Dr. Naveen Kella now offers{" "}
            <strong className="font-semibold text-slate-900">Bulkamid</strong>,
            a quick in-office procedure that treats stress leakage directly — no
            surgery, no mesh, and no hospital stay.
          </p>
        </Section>

        <div className="border-t border-slate-200 bg-slate-50/90">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,22rem)] lg:gap-14">
            <div>
              <h2 className={H2}>Care from a Team You Can Talk To</h2>
              <p className={`mt-6 ${PROSE}`}>
                Bladder leakage is personal, and many women put off getting help
                because the conversation feels uncomfortable. We understand. Your
                care is led by{" "}
                <strong className="font-semibold text-slate-900">
                  Dr. Naveen Kella
                </strong>
                , and{" "}
                <strong className="font-semibold text-slate-900">
                  Savannah Eggers, PA
                </strong>
                , works with you through the entire process — your evaluation, your
                procedure, and your follow-up. Many of our patients tell us that
                having a female provider on the team makes it easier to talk openly
                about symptoms and goals. Our job is to listen first, then match the
                treatment to you.
              </p>
            </div>
            <TeamPortraits />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,24rem)] lg:gap-14">
            <div>
              <h2 className={H2}>Step One: A Proper Evaluation</h2>
              <p className={`mt-6 ${PROSE}`}>
                Not all bladder leakage is the same. Some people leak with activity
                (stress incontinence), some leak with a sudden strong urge to
                urinate (urge incontinence), and many have both (mixed incontinence).
                The right treatment depends on which type you have.
              </p>
              <p className={`mt-6 ${PROSE}`}>Your visit may include:</p>
              <ul className={LIST}>
                {EVALUATION_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={`mt-6 ${PROSE}`}>
                We will then review all of your options with you — from exercises
                and lifestyle changes to office procedures and surgery — so you can
                choose what fits your goals.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200">
              <Image
                src={EVALUATION_PHOTO}
                alt="Dr. Naveen Kella meeting with the care team at The Urology Place"
                fill
                className="object-cover object-[center_30%]"
                sizes="(min-width: 1024px) 384px, 100vw"
              />
            </div>
          </div>
        </div>

        <Section muted>
          <h2 className={H2}>What Is Bulkamid?</h2>
          <p className={`mt-6 ${PROSE}`}>
            Bulkamid is a soft, water-based gel (about 97.5% water) that is
            injected into the wall of the urethra. The gel adds &quot;bulk&quot;
            so the urethra can close more tightly, helping prevent leaks when
            you cough, sneeze, or exercise. Bulkamid was approved by the U.S.
            Food and Drug Administration (FDA) in 2020.{" "}
            <strong className="font-semibold text-slate-900">
              It is not a mesh
            </strong>
            , and it does not involve any incisions.
          </p>
          <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900">
            Who might it help?
          </h3>
          <ul className={LIST}>
            {CANDIDATES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section>
          <h2 className={H2}>What Is the Procedure Like?</h2>
          <ul className={LIST}>
            <li>
              It is done{" "}
              <strong className="font-semibold text-slate-900">
                in our office
              </strong>{" "}
              and usually takes about 10–15 minutes
            </li>
            <li>
              A numbing gel or local anesthetic is used to keep you comfortable
            </li>
            <li>
              A thin camera is placed into the urethra, and the gel is injected
              in a few small spots
            </li>
            <li>
              Most people go home shortly afterward and return to normal daily
              activities within a day or two
            </li>
          </ul>
          <figure className="mx-auto mt-10 max-w-3xl">
            <YouTubeEmbed
              videoId={BULKAMID_VIDEO_ID}
              title="Dr. Naveen Kella discusses Bulkamid for stress urinary incontinence"
              className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
            />
            <figcaption className="mt-3 text-center text-sm text-slate-600">
              Dr. Naveen Kella discusses Bulkamid for stress urinary
              incontinence.
            </figcaption>
          </figure>
        </Section>

        <Section muted>
          <h2 className={H2}>What Results Can I Expect?</h2>
          <p className={`mt-6 ${PROSE}`}>
            In clinical studies, about two out of three women or more reported
            being cured or improved at one year, and studies following women for
            up to 7 years have shown lasting benefit for many. Some women need a
            second injection (a &quot;top-up&quot;) to get the best result — this
            is normal, and we will discuss it with you.
          </p>
        </Section>

        <Section id="bulkamid-risks">
          <h2 className={H2}>What Are the Risks?</h2>
          <p className={`mt-6 ${PROSE}`}>
            <strong className="font-semibold text-slate-900">
              Serious complications are uncommon.
            </strong>{" "}
            Possible side effects include:
          </p>
          <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2">
            {RISKS.map((risk) => (
              <li
                key={risk}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-base leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-100"
              >
                <span
                  className="mb-3 block h-1 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                  aria-hidden
                />
                {risk}
              </li>
            ))}
          </ul>
        </Section>

        <Section muted wide>
          <h2 className={H2}>
            Bulkamid or Emsella? Comparing Your In-Office Options
          </h2>
          <div className="mt-8 max-w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm ring-1 ring-slate-200/60">
            <table className="w-full table-fixed border-collapse text-left text-sm leading-snug md:text-[15px]">
              <caption className="sr-only">
                Comparison of Emsella and Bulkamid in-office options
              </caption>
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th scope="col" className="w-[34%] px-3 py-3 font-semibold md:px-5 md:py-4">
                    <span className="sr-only">Category</span>
                  </th>
                  <th scope="col" className="w-[33%] px-3 py-3 font-semibold md:px-5 md:py-4">
                    Emsella
                  </th>
                  <th scope="col" className="w-[33%] px-3 py-3 font-semibold md:px-5 md:py-4">
                    Bulkamid
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, index) => {
                  const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";
                  return (
                    <tr key={row.label} className={rowBg}>
                      <th
                        scope="row"
                        className="px-3 py-3 align-top font-semibold text-slate-900 md:px-5 md:py-4"
                      >
                        {row.label}
                      </th>
                      <td className="px-3 py-3 align-top text-slate-700 md:px-5 md:py-4">
                        {row.emsella}
                      </td>
                      <td className="px-3 py-3 align-top text-slate-700 md:px-5 md:py-4">
                        {row.bulkamid}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={`mt-8 ${PROSE}`}>
            <strong className="font-semibold text-slate-900">
              Prefer no procedure at all?
            </strong>{" "}
            Our Emsella chair strengthens the pelvic floor while you sit fully
            clothed — no needles, nothing inserted. Many patients start there.{" "}
            <Link href={EMSELLA_HREF} className={TEXT_LINK}>
              Learn more about Emsella →
            </Link>
          </p>
        </Section>

        <Section>
          <h2 className={H2}>Other Options We Offer</h2>
          <p className={`mt-6 ${PROSE}`}>
            We believe in matching treatment to the person. Other options for
            SUI include:
          </p>
          <ul className={LIST}>
            <li>
              <strong className="font-semibold text-slate-900">
                Pelvic floor physical therapy
              </strong>{" "}
              and Kegel exercises — a proven first step
            </li>
            <li>
              <strong className="font-semibold text-slate-900">
                Lifestyle changes
              </strong>
              , such as weight loss, managing fluid and caffeine intake, and
              treating chronic cough
            </li>
            <li>
              <strong className="font-semibold text-slate-900">
                Vaginal support devices
              </strong>{" "}
              (pessaries)
            </li>
            <li>
              <strong className="font-semibold text-slate-900">
                Surgical procedures
              </strong>
              , such as a sling, for people who want the most durable fix or
              have not improved with other treatments
            </li>
          </ul>
        </Section>

        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <BulkamidFaqAccordion />
          </div>
        </div>

        <Section muted>
          <h2 className={H2}>Take the Next Step</h2>
          <p className={`mt-6 ${PROSE}`}>
            Bladder leakage is a medical condition, and effective treatments are
            available. Call The Urology Place at{" "}
            <a href={clinicPhoneTelHref()} className={TEXT_LINK}>
              {CLINIC_PHONE}
            </a>{" "}
            or{" "}
            <a href={CONTACT_HREF} className={TEXT_LINK}>
              request an appointment online
            </a>{" "}
            to schedule an evaluation and find out whether Bulkamid is right for
            you.
          </p>
          <p className="mt-8 text-sm italic leading-relaxed text-slate-600">
            This information is for general education and does not replace a
            personal medical evaluation. Individual results vary.
          </p>
        </Section>
      </section>

      <section
        id="women-bulkamid-contact"
        className="scroll-mt-28 border-t border-slate-200 bg-slate-50/50"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            pageName="Bulkamid for Stress Incontinence"
            serviceName="Bulkamid for Stress Incontinence"
            category="Women"
            sourcePath="/women/bulkamid-for-stress-incontinence"
            idPrefix="women-bulkamid"
          />
        </div>
      </section>
    </main>
  );
}
