import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { ContactFormTemplate } from "@/app/components/contact-form-template";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

/** Encode path for public folder (spaces, + in filenames). */
const IMG = (name: string) =>
  encodeURI(`/images/prostate biopsy/${name}`).replace(/\+/g, "%2B");

const HERO_BG = IMG("OR+PICTURE-0ab6e992-2880w.JPG");

const MARBLE_BG = {
  background:
    "linear-gradient(155deg, #ffffff 0%, #f6f6f4 38%, #ebe9e6 72%, #f3f3f1 100%)",
} as const;

export function ProstateBiopsyPageContent() {
  return (
    <div className="relative isolate min-h-screen text-slate-900 -mt-4 md:-mt-6 lg:-mt-8">
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 top-14 z-0 md:top-[4.5rem]"
        aria-hidden
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        <section className="relative flex min-h-[48vh] flex-col items-center justify-center px-6 py-20 md:min-h-[52vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              PROSTATE BIOPSY
            </h1>
            <p className="mt-5 text-base text-white/95 md:text-lg lg:text-xl">
              More precise, less invasive prostate biopsy with UroNav fusion technology at The Urology
              Place in San Antonio.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]" style={MARBLE_BG}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200 shadow-md ring-1 ring-slate-200/80">
                <Image
                  src={IMG("UroNav-Team-640w-1920w.jpg")}
                  alt="The Urology Place team with the UroNav fusion biopsy system"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  More Precise. Less Invasive Prostate Biopsy
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  With UroNav, we perform targeted fusion biopsy: MRI images are fused with live
                  ultrasound so suspicious areas can be sampled accurately. We also offer
                  transperineal biopsy—an approach that reduces infection risk compared with the
                  traditional transrectal route. Many procedures are done comfortably in our office.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[#e8edf5] py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-xl font-bold text-slate-800 md:text-2xl">
              Why should you choose The Urology Place?
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-slate-400/60" aria-hidden />
            <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
              <p className="text-sm font-bold leading-relaxed text-slate-800 md:text-[15px]">
                • We were the first to start fusion biopsy in San Antonio. We are the only practice
                performing transperineal prostate biopsy in South Texas.
              </p>
              <p className="text-sm font-bold leading-relaxed text-slate-800 md:text-[15px]">
                • We do biopsies comfortably in the office, avoiding the unnecessary increase in costs
                that come with routinely doing biopsies in the surgery center or hospital.
              </p>
              <p className="text-sm font-bold leading-relaxed text-slate-800 md:text-[15px]">
                • Mike Nevarez is a urology ultrasound technician with over 20 years of experience in
                prostate ultrasound and biopsies. He has completed thousands of prostate ultrasounds.
              </p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-white" style={MARBLE_BG}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-[#f0e8f4] p-4 shadow-md ring-1 ring-slate-200/80 md:mx-0">
                <Image
                  src={IMG("Prostate_Slice1-1920w.jpg")}
                  alt="Illustration of prostate cross-section showing systematic biopsy cores and a suspicious lesion"
                  width={800}
                  height={800}
                  className="h-full w-full object-contain"
                  sizes="(min-width: 768px) 40vw, 90vw"
                />
              </div>
              <div className="space-y-5 text-[15px] leading-relaxed text-slate-700 md:text-base">
                <p>
                  Current methods of prostate cancer screening, such as prostate-specific antigen
                  (PSA) tests and digital rectal exams (DRE), can lead to a recommendation for a
                  prostate biopsy. Urologists rely on ultrasound during the biopsy to visualize the
                  prostate—good enough for systematic biopsies. In most cases, however, ultrasound
                  cannot reliably distinguish cancer inside the prostate, so cancer can sometimes be
                  missed during systematic sampling alone.
                </p>
                <p>
                  Prostate biopsy is the gold standard for tissue diagnosis; treatment is not offered
                  without pathology showing prostate cancer. Fusion biopsy with MRI helps target
                  suspicious areas so sampling is more accurate than systematic biopsy alone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="order-2 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6 shadow-sm md:order-1">
                <h2 className="text-xl font-bold text-blue-600 md:text-2xl">Transperineal Biopsy</h2>
                <p className="mt-2 text-sm font-bold text-slate-900 md:text-base">
                  Dr. Naveen Kella discusses a NEW approach to detecting cancerous tissues
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  During the work-up of prostate cancer, a transrectal prostate biopsy poses a
                  potential risk of infection. The Urology Place has invested in new ultrasound
                  equipment and training to migrate to a transperineal approach. We are the first in
                  Texas to offer in-office transperineal biopsy of the prostate. With the
                  transperineal approach, there is a near-zero risk of serious infection.
                </p>
                <div className="mt-6 flex justify-center md:justify-start">
                  <a
                    href="https://www.youtube.com/watch?v=mid8NllepN0"
                    className={`${BTN_PRIMARY} inline-block text-center`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More Here
                  </a>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <YouTubeEmbed
                  videoId="mid8NllepN0"
                  title="Transperineal prostate biopsy with Dr. Naveen Kella at The Urology Place"
                  className="overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80" style={MARBLE_BG}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md ring-1 ring-slate-200/80">
                <Image
                  src={IMG("Current-Prior-Cores-with-3-1920w.jpg")}
                  alt="UroNav software showing current and prior biopsy cores mapped on prostate imaging"
                  fill
                  className="object-contain object-center"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                  Fusion Biopsy at The Urology Place
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  With UroNav, we perform your prostate biopsy with MRI images fused to ultrasound.
                  The software identifies lesion areas that can be targeted. We still perform the
                  procedure in the office. Advantages include:
                </p>
                <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  <li>
                    <span className="font-semibold text-slate-900">Less anxiety after a negative biopsy.</span>{" "}
                    If your biopsy is negative with UroNav-targeted sampling, we can be more confident
                    that worrisome tumor was not missed.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Fewer cores when appropriate.</span>{" "}
                    In some cases we take MRI fusion targets only—fewer biopsies for you.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">More confidence if treatment is needed.</span>{" "}
                    If you move forward with treatment, MRI and fusion data help plan surgery.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">MRI detection</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  3T MRI is a powerful imaging tool available at select locations in San Antonio. When
                  read by an experienced radiologist, prostate and lesion segmentation data can be
                  used to identify very suspicious areas. These areas receive PI-RADS scores from 1 to
                  5, where 5 is highly suspicious for aggressive prostate cancer.
                </p>
              </div>
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-md ring-1 ring-slate-200/80"
                role="img"
                aria-label="UroNav fusion biopsy software and mobile workstation"
              >
                <Image
                  src={IMG("UroNav_Screenshot_Rev02-1920w.jpg")}
                  alt=""
                  fill
                  aria-hidden
                  className="prostate-biopsy-mri-crossfade-a object-contain object-center"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
                <Image
                  src={IMG("UroNav_Cart_Rev02-1920w.png")}
                  alt=""
                  fill
                  aria-hidden
                  className="prostate-biopsy-mri-crossfade-b object-contain object-center"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80" style={MARBLE_BG}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-md ring-1 ring-slate-200/80">
                <Image
                  src={IMG("US_Only_Biopsy_Screen-1920w.jpg")}
                  alt="UroNav ultrasound-guided biopsy targeting interface"
                  fill
                  className="object-contain object-center"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Patient Comfort</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
                  We understand that a prostate biopsy can be uncomfortable. General anesthesia is
                  often more than this procedure requires. We offer medication, a numbing prostate
                  block, and optional nitrous oxide (laughing gas) to make the experience as
                  comfortable as possible—often without an IV or hospital facility fees. The Urology
                  Place has partnered with Aurora Cancer Center to offer UroNav Smart Biopsy.
                  Insurances may cover a portion; depending on coverage, we can discuss self-pay
                  options for MRI and Smart Biopsy at an affordable price point.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200/80 bg-[#e6ebf5] py-14 md:py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-lg font-bold text-[#003366] md:text-xl">
              Looking for an alternative to a prostate biopsy?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#003366] md:text-base">
              If you have a concerning PSA but would like time to consider a biopsy, we offer various
              non-invasive prostate cancer screening options.
            </p>
            <Link href="/men/prostate-cancer" className={`${BTN_PRIMARY} mt-8 inline-block`}>
              LEARN MORE
            </Link>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Prostate Biopsy"
              serviceName="Prostate Biopsy"
              category="Men > Prostate Cancer"
              sourcePath="/men/prostate-cancer/prostate-biopsy"
              idPrefix="men-prostate-biopsy"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
