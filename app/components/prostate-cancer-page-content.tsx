import Image from "next/image";
import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { FeaturedSanAntonioMedicineArticle } from "@/app/components/featured-san-antonio-medicine-article";
import { BTN_MAKE_APPOINTMENT_HERO } from "@/app/lib/button-styles";
import { MoreInformationCardGrid } from "@/app/components/more-information-card-grid";
import { PROSTATE_CANCER_MORE_INFORMATION_ITEMS } from "@/app/data/prostate-cancer-more-information-items";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_FIXED_BACKDROP,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

const HERO_BG = encodeURI("/images/prostate cancer/OR+PICTURE-2880w.JPG").replace(/\+/g, "%2B");
const KELLA_WITH_PATIENT = encodeURI(
  "/images/prostate cancer/kella+with+patient+jpg-1920w.jpg",
).replace(/\+/g, "%2B");

const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";

const SUBHEAD_LINK =
  "font-semibold text-sky-600 underline decoration-sky-600/40 underline-offset-2 transition hover:text-sky-700 hover:decoration-sky-700";

export function ProstateCancerPageContent() {
  return (
    <div className="relative isolate min-h-screen text-slate-900">
      <div
        className={HERO_FIXED_BACKDROP}
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        <section className={HERO_IMAGE_SECTION}>
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className={HERO_TITLE_ON_IMAGE}>
              <span className="block">Prostate Cancer Treatment</span>
              <span className={`mt-2 block ${HERO_SUBTITLE_ON_IMAGE}`}>
                at The Urology Place
              </span>
            </h1>
            <div className="mt-8">
              <a href="#men-prostate-cancer-contact" className={BTN_MAKE_APPOINTMENT_HERO}>
                Make Appointment
              </a>
            </div>
          </div>
        </section>

        <section className={`${HERO_AFTER_SLIDE_BASE} bg-slate-100`}>
          <div className="mx-auto max-w-4xl px-6 py-14 text-center md:py-20">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl lg:text-3xl">
              The Urology Place specializes in the treatment of prostate cancer
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              If you have been diagnosed with prostate cancer, you may have heard about robotic prostate 
              surgery, or a robotic prostatectomy. Many patients initially feel overwhelmed with a prostate 
              cancer diagnosis. We are happy to see patients for a second opinion. 
              At The Urology Place we work with our patients to help them make informed, appropriate decisions 
              for their particular case. After treating thousands of prostate cancer patients, we have become 
              known for our prostate cancer outcomes.{" "}
              <Link href="/men/prostate-cancer/robotic-prostatectomy" className={SUBHEAD_LINK}>
                Dr. Naveen Kella performs 100% of the robotic prostatectomies for The Urology Place.
              </Link>{" "}
              Dr. Kella and his expert surgical team have been working together for over 10 years, 
              making them one of the most specialized teams in the nation for prostate cancer removal. 
              We employ specialized procedures to avoid heat from cautery and minimize tension on the prostate, 
              which are two key factors in recovery.
            </p>
          </div>
        </section>

        <section className={`relative border-t border-slate-200/80 ${MARBLE_SECTION}`}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Options for Prostate Cancer Treatment
            </h2>
            <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-6 lg:gap-8">
              <div className="relative aspect-[3/4] w-[60%] max-w-[260px] shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-md ring-1 ring-slate-200/80 md:aspect-[4/5] md:w-[240px] lg:w-[260px]">
                <Image
                  src={KELLA_WITH_PATIENT}
                  alt="Dr. Kella with a patient in a clinical setting"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 260px, 60vw"
                />
              </div>
              <div className="w-full max-w-md space-y-10 text-center">
                <div>
                  <h3 className="text-lg font-bold text-sky-600 underline decoration-sky-600/50 underline-offset-4 md:text-xl">
                    Surgery
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-800 md:text-[17px]">
                    Surgery aims to cure prostate cancer. Dr. Kella is a renowned expert in robotic
                    surgery for prostate cancer. Most surgeons choose robotics over open surgery for
                    its advantages—but experience remains the driving factor in a positive outcome.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-sky-600 underline decoration-sky-600/50 underline-offset-4 md:text-xl">
                    Radiation
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-800 md:text-[17px]">
                    IMRT is the standard for radiation therapy. Dr. Kella can share his perspective on
                    different forms of radiation therapy. He has also treated patients after radiation
                    has failed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Active Surveillance
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              Some prostate cancers grow slowly, and a patient is more likely to die of other causes
              before the cancer becomes severe. In those situations, patients may choose to watch the
              disease carefully. Patients with small amounts of cancer or a low Gleason score may be
              candidates for active surveillance. Patients with many medical problems or who are
              elderly may prefer a &ldquo;watch and wait&rdquo; approach because of the potential
              complications of more aggressive treatment.
            </p>

            <h2 className="mt-14 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Second Opinions for Prostate Cancer Diagnosis
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              Decisions about prostate cancer treatment can be difficult. Physicians sometimes use
              genetic testing and other tools to decide how best to move forward. Seeking a second
              opinion is advisable in all cases, and especially when the best path is unclear after
              talking with your urologist.{" "}
              <span className="font-medium text-slate-900">Dr. Kella</span> at The Urology Place in
              San Antonio, Texas is often sought for an expert second opinion because of his depth of
              knowledge and experience.
            </p>
          </div>
        </section>

        <FeaturedSanAntonioMedicineArticle />

        <MoreInformationCardGrid
          className="border-t border-slate-200"
          items={PROSTATE_CANCER_MORE_INFORMATION_ITEMS.filter(
            (item) => item.label !== "PSA, MRI and Gleason Score",
          )}
        />

        <section
          id="men-prostate-cancer-contact"
          className="relative scroll-mt-28 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Prostate Cancer"
              serviceName="Prostate Cancer"
              category="Men"
              sourcePath="/men/prostate-cancer"
              idPrefix="men-prostate-cancer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
