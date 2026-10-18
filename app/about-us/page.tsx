import type { Metadata } from "next";
import { YouTubeEmbed } from "@/app/components/youtube-embed";
import {
  AboutUsTeamFromSanity,
  type TeamMember,
} from "@/app/components/about-us-team";
import {
  HERO_AFTER_SLIDE_BASE,
  HERO_EYEBROW_ON_IMAGE,
  HERO_IMAGE_SECTION,
  HERO_SUBTITLE_ON_IMAGE,
  HERO_TITLE_ON_IMAGE,
} from "@/app/lib/hero";
import { client, teamMembersQuery } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "About Our Urologists in San Antonio",
};

/** Refresh team content periodically without a full redeploy. */
export const revalidate = 300;

export default async function AboutUsPage() {
  const teamMembers = await client.fetch<TeamMember[]>(teamMembersQuery);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section
        className={HERO_IMAGE_SECTION}
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceLobby.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/45 to-slate-900/65"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className={HERO_EYEBROW_ON_IMAGE}>The Urology Place</p>
          <h1 className={`mt-3 ${HERO_TITLE_ON_IMAGE}`}>About Us</h1>
          <p className={`mt-4 max-w-2xl mx-auto ${HERO_SUBTITLE_ON_IMAGE}`}>
            Experienced urology care with a team dedicated to your outcomes.
          </p>
        </div>
      </section>

      <section
        className={`${HERO_AFTER_SLIDE_BASE} relative z-10 rounded-t-3xl bg-white shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.1)]`}
      >
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            Who we are
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Care built on experience
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
            aria-hidden
          />
          <p className="mt-8 text-lg leading-relaxed text-slate-600 md:text-xl">
            With more than 20 years of experience in the field, we know urology
            and are relentless in our pursuit of new technologies and techniques
            that provide our patients with the best possible outcomes. Whether a
            patient has prostate cancer, desires a vasectomy, has a sexual health
            concern, or needs a second opinion, we can help.
          </p>
        </div>
      </section>

      <AboutUsTeamFromSanity
        members={teamMembers}
        afterAllMembers={
          <section className="border-t border-slate-200/80 bg-slate-50/80 py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100">
                <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:gap-10 md:p-10">
                  <div className="w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 shadow-md ring-1 ring-slate-200/80 md:max-w-md">
                    <YouTubeEmbed
                      videoId="H0iedrP-aLI"
                      title="Dr. Kella making a half court shot at a Dallas Mavericks game"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-center md:text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                      In the community
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                      Dr. Kella making a half court shot at a Dallas Mavericks
                      game!
                    </h2>
                    <div
                      className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 md:mx-0"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      />
    </main>
  );
}
