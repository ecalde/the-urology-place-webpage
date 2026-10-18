import type { Metadata } from "next";
import Image from "next/image";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_FIXED_BACKDROP,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";

const HERO_BG = encodeURI(
  "/images/hormone replacement therapy/64cccddd2d31503d830466f1_What is Testosterone.png",
);
const CONTENT_IMG = encodeURI(
  "/images/hormone replacement therapy/pexels-photo-3683046-2880w.jpeg",
);

const INSTRUCTIONS = [
  {
    title: "Ice it",
    body:
      "Use an ice pack on the area for 20 minutes every few hours. Always place a cloth between the ice and your skin or bandage. Continue to ice as needed for swelling.",
  },
  {
    title: "Keep it dry",
    body:
      "No tub baths, hot tubs, or swimming pools for 7 days. Showering is okay, but avoid scrubbing the site until it is fully healed.",
  },
  {
    title: "Monitor Swelling",
    body:
      "Swelling is normal and should reduce over a few days.",
  },
  {
    title: "Avoid Pressure",
    body:
      "Refrain from heavy lifting, strenuous exercise, or any activities that apply pressure to the area for at least 48 hours.",
  },
  {
    title: "Keep an eye out",
    body:
      "Keep an eye on the insertion site for any unusual symptoms like severe pain, excessive swelling, or signs of infection such as redness, warmth, or pus. Contact your healthcare provider if these occur.",
  },
  {
    title: "Symptoms and Discoloration",
    body:
      "Bruising, swelling, and redness at the insertion site can occur and may last from a few days to 2 to 3 weeks. Pinkish or bloody discoloration on the outer bandage is normal.",
  },
] as const;

export const metadata: Metadata = {
  title: "Hormone Pellet Aftercare in San Antonio",
  description:
    "Post-insertion instructions for female hormone replacement therapy pellet treatment at The Urology Place.",
};

export default function PostInsertionInstructionsPage() {
  return (
    <main className="relative isolate min-h-screen bg-white text-slate-900">
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
          <div className="absolute inset-0 bg-slate-900/35" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className={HERO_TITLE_ON_IMAGE}>Post-Insertion Instructions</h1>
            <p className={`mt-4 ${HERO_SUBTITLE_ON_IMAGE}`}>
              Female Hormone Replacement Therapy
            </p>
          </div>
        </section>

        <section className={`${HERO_AFTER_SLIDE_BASE} bg-white`}>
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:gap-10">
              <div className="lg:pr-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Hormone Replacement Therapy
                </p>
                <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-sky-700 md:text-4xl">
                  Keep your pellet therapy on track with these easy tips. Your future self will thank you.
                </h2>
                <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80">
                  <Image
                    src={CONTENT_IMG}
                    alt="Heart shape made from white tablets on a pink background"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </div>

              <div className="space-y-10">
                {INSTRUCTIONS.filter((_, index) => index % 2 === 0).map((item) => (
                  <div key={item.title}>
                    <h3 className="text-2xl font-bold tracking-tight text-sky-700">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-10">
                {INSTRUCTIONS.filter((_, index) => index % 2 === 1).map((item) => (
                  <div key={item.title}>
                    <h3 className="text-2xl font-bold tracking-tight text-sky-700">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
