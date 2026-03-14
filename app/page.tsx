import Image from "next/image";
import Link from "next/link";
import { PatientReviewCarousel } from "./components/patient-review-carousel";
import { HomeContactSection } from "./components/home-contact-section";
import { BTN_PRIMARY, BTN_PRIMARY_LARGE } from "./lib/button-styles";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: fixed building background + grey overlay; smaller vertical window */}
      <section
        className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-24"
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
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Experience Matters
          </h1>
          <p className="mt-4 text-lg text-white/95 md:text-xl">
            Get the care you need from providers who are experts in their fields.
          </p>
          <div className="mt-8">
            <Link
              href="/patient-resources/contact-us"
              className={`inline-block ${BTN_PRIMARY_LARGE}`}
            >
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
          San Antonio expects the best urology doctors to excel in training and experience. Dr. Naveen Kella offers the most experienced combined care in Texas for prostate cancer with robotic surgery and TULSA PRO. Our doctors have completed fellowships with subspecialty training and are leading experts in urological medicine. We are a small practice, which means we provide every patient the attention they deserve.
        </p>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Board-certified urologist Dr. Kella works alongside his team. Over the years, they have expanded their skills into advanced prostate care, sexual health, weight loss programs and more.
        </p>
        <p className="mt-8 text-lg font-semibold text-slate-900">
          Our mission is to provide a warm and welcoming environment for experienced care. We thank you for trusting us with your urological and overall health.
        </p>
      </section>

      {/* What&apos;s New: speaker image + text centered next to each other */}
      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:items-center md:gap-12 md:py-20">
          {/* Speaker image - vertically centered with text block */}
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-l-xl bg-white md:h-80 md:w-[380px] md:max-w-[45%]">
            <Image
              src="/images/branding/speaker.jpeg"
              alt=""
              fill
              className="object-contain object-center p-4"
              sizes="(min-width: 768px) 380px, 100vw"
            />
          </div>

          {/* What's New content */}
          <div className="flex flex-1 flex-col justify-center md:max-w-[55%]">
            <h2 className="text-2xl font-bold tracking-tight text-blue-700 md:text-3xl">
              What&apos;s New at The Urology Place?
            </h2>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Dr. Naveen Kella has enhanced the way we perform procedures in our clinic. Through a partnership with a Certified Registered Nurse Anesthetist (CRNA), we are now able to offer safe, convenient in-office anesthesia for select procedures, including vasectomies and circumcisions and many others.
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              This allows our patients to receive high-quality care in a comfortable office setting, without the need for a hospital or surgery center visit. Our goal is to provide a seamless, efficient experience while maintaining the highest standards of safety and patient care.
            </p>
            <p className="mt-4 text-sm italic text-slate-600">
              Please note: Coverage for in-office anesthesia varies by insurance plan. Our team will verify your benefits prior to your procedure; however, depending on your specific plan, anesthesia services may be considered an out-of-pocket expense.
            </p>
            <div className="mt-6">
              <Link
                href="/in-office-anesthesia"
                className={`inline-block ${BTN_PRIMARY}`}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Patient reviews: fixed Building2 background + white overlay; cards scroll with page */}
      <section
        className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-24"
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

      {/* Request appointment + contact, map, newsletter, hours */}
      <HomeContactSection />
    </main>
  );
}
