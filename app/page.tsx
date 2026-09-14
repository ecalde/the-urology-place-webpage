import Image from "next/image";
import Link from "next/link";
import {
  HomeWhatsNewSlider,
  type HomeAnnouncementCard,
} from "./components/home-whats-new-slider";
import { HomePrivacyBanner } from "./components/home-privacy-banner";
import { PatientReviewCarousel } from "./components/patient-review-carousel";
import { HomeContactSection } from "./components/home-contact-section";
import { FeaturedSanAntonioMedicineArticle } from "./components/featured-san-antonio-medicine-article";
import { BTN_MAKE_APPOINTMENT_HERO, BTN_PRIMARY } from "./lib/button-styles";
import {
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "./lib/hero";
import { client, homeAnnouncementsQuery, urlFor } from "@/lib/sanity";

/** ISR: refetch Sanity-driven home content on production ~every60s (no webhook). Blog routes stay dynamic via searchParams / [slug]. */
export const revalidate = 60;

type RawHomeAnnouncement = {
  _id: string;
  title: string | null;
  body: string | null;
  image: Parameters<typeof urlFor>[0] | null;
  linkUrl: string | null;
  linkLabel: string | null;
};

/** `urlFor` throws if the image has no `asset` (e.g. alt set but file not uploaded). */
function sanityImageHasAsset(
  image: Parameters<typeof urlFor>[0] | null | undefined,
): image is Parameters<typeof urlFor>[0] {
  if (image == null || typeof image !== "object") return false;
  const asset = (image as { asset?: unknown }).asset;
  if (asset == null || typeof asset !== "object") return false;
  const ref = (asset as { _ref?: unknown })._ref;
  return typeof ref === "string" && ref.length > 0;
}

function toHomeAnnouncementCard(
  row: RawHomeAnnouncement,
): HomeAnnouncementCard | null {
  if (
    !row.title?.trim() ||
    !row.body?.trim() ||
    !row.linkUrl?.trim() ||
    !sanityImageHasAsset(row.image)
  ) {
    return null;
  }
  const imageUrl = urlFor(row.image).width(1200).height(750).url();
  const altField =
    typeof row.image === "object" &&
    row.image !== null &&
    "alt" in row.image &&
    typeof (row.image as { alt?: unknown }).alt === "string"
      ? (row.image as { alt: string }).alt.trim()
      : "";
  return {
    _id: row._id,
    title: row.title.trim(),
    body: row.body.trim(),
    imageUrl,
    imageAlt: altField || row.title.trim(),
    linkUrl: row.linkUrl.trim(),
    linkLabel: row.linkLabel?.trim() || "Learn more",
  };
}

export default async function HomePage() {
  const rawAnnouncements = await client.fetch<RawHomeAnnouncement[]>(
    homeAnnouncementsQuery,
  );
  const whatsNewCards = rawAnnouncements
    .map(toHomeAnnouncementCard)
    .filter((c): c is HomeAnnouncementCard => c !== null);
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HomePrivacyBanner />
      {/* Hero: fixed building background + grey overlay; smaller vertical window */}
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceBuilding.png)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Grey opacity overlay */}
        <div
          className="absolute inset-0 bg-slate-900/50"
          aria-hidden
        />

        {/* Scrolling content (not part of background) */}
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className={HERO_TITLE_ON_IMAGE}>
            Experience Matters
          </h1>
          <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
            Get the care you need from providers who are experts in their fields.
          </p>
          <div className="mt-8">
            <Link href="/patient-resources/contact-us" className={BTN_MAKE_APPOINTMENT_HERO}>
              Make Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome to The Urology Place */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Welcome to The Urology Place
        </h2>
        <p className="mt-6 text-slate-700 leading-relaxed">
          San Antonio expects the best urology doctors to excel in training and experience. Dr. Naveen Kella offers the most experienced combined care in Texas for prostate cancer with robotic surgery, TULSA PRO, and Vanquish VAPOR. Our doctors have completed fellowships with subspecialty training and are leading experts in urological medicine. We are a small practice, which means we provide every patient the attention they deserve.
        </p>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Board-certified urologist Dr. Kella works alongside his team. Over the years, they have expanded their skills into advanced prostate care, sexual health, and more.
        </p>
        <p className="mt-8 text-lg font-semibold text-slate-900">
          Our mission is to provide a warm and welcoming environment for experienced care. We thank you for trusting us with your urological and overall health.
        </p>
      </section>

      <FeaturedSanAntonioMedicineArticle />

      {/* What&apos;s New — Sanity-driven card slider */}
      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-blue-700 md:text-3xl">
            What&apos;s New at The Urology Place?
          </h2>
          <div className="mt-10 md:mt-12">
            <HomeWhatsNewSlider cards={whatsNewCards} />
          </div>
        </div>
      </section>

      {/* Patient reviews: fixed Building2 background + white overlay; cards scroll with page */}
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceBuilding2.png)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* White opacity overlay */}
        <div
          className="absolute inset-0 bg-white/70"
          aria-hidden
        />

        {/* Scrolling content: three review cards */}
        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {/* Card 1 - Amanda C. */}
          <article className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src="/images/branding/woman-smiling-portrait-outside-1920w.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
            <p className="mt-4 text-left text-slate-800">
              The Urology Place is superb! I trust that he is giving me the same service he would his own loved one. He saved me from an unnecessary, expensive surgery.
            </p>
            <p className="mt-4 text-center font-semibold text-slate-900">
              Amanda C.
            </p>
          </article>

          {/* Card 2 - Emil C. Willmann DDS */}
          <article className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src="/images/branding/bike-fix-man-944beee9-1920w.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
            <p className="mt-4 text-left text-slate-800">
              Dr. Kella was recommended to me by a friend who checked him out through a relative up at Mayo. The comments were excellent so my friend chose Dr. Kella and sailed through the robotic prostatectomy operation and recovery. In less than 6 weeks he was back doing his bike races! So, I followed suit and had similar success minus I have had the lowest possible PSA scores for our facility.
            </p>
            <p className="mt-4 text-left text-sm font-medium text-slate-700">
              — Emil C. Willmann DDS
            </p>
          </article>

          {/* Card 3 - Nadia V. */}
          <article className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src="/images/branding/woman-with-hat-snow-1920w.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
            <p className="mt-4 text-left text-slate-800">
              I&apos;m so glad I met the Urology Place. I suffered from urinary incontinence and my biggest fear was needing surgery but they recommended their Emsella chair for treatments. The treatments were quick, painless, and I didn&apos;t even need to remove my clothes! I can sneeze, laugh and cough without fear now! Totally worth it!
            </p>
            <p className="mt-4 text-center font-semibold text-slate-900">
              Nadia V.
            </p>
          </article>
        </div>
      </section>

      {/* Rotating patient reviews + Leave a review buttons */}
      <section className="border-t border-slate-200 py-16 md:py-20" style={{ backgroundColor: "#849dc5" }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="min-h-[200px] md:min-h-[240px]">
            <PatientReviewCarousel />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.google.com/search?q=the+urology+place&oq=the+urolog&aqs=chrome.0.69i59l2j0j69i60l3.1593j0j7&sourceid=chrome&ie=UTF-8"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${BTN_PRIMARY}`}
            >
              Leave a review on Google
            </a>
            <a
              href="https://www.facebook.com/UrologyPlace/reviews?ref=page_internal"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${BTN_PRIMARY}`}
            >
              Leave a review on Facebook
            </a>
            <a
              href="https://www.yelp.com/biz/the-urology-place-san-antonio"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${BTN_PRIMARY}`}
            >
              Leave a review on Yelp
            </a>
          </div>
        </div>
      </section>

      {/* Request appointment + contact */}
      <HomeContactSection />
    </main>
  );
}
