import Image from "next/image";
import { YouTubeEmbed } from "@/app/components/youtube-embed";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: fixed lobby background; content scrolls on top; smaller vertical window */}
      <section
        className="relative min-h-[38vh] flex flex-col items-center justify-center px-6 py-16"
        style={{
          backgroundImage: "url(/images/branding/TheUrologyPlaceLobby.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            About Us
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-12">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Who We Are
          </h2>
          <p className="mt-6 text-left text-slate-700 leading-relaxed">
            We love what we do and it shows. With more than 20 years of experience in the field, we know urology and are relentless in our pursuit of new technologies and techniques that provide our patients with the best possible outcomes. Whether a patient has prostate cancer, desires a vasectomy, has a sexual health concern, or needs a second opinion, we can help. There&apos;s no challenge too big or too small, and we dedicate ourselves to every patient we see, and every procedure we take on.
          </p>
        </div>
      </section>

      {/* Naveen Kella, MD */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex shrink-0 flex-col gap-6 lg:w-[480px]">
              <div className="relative h-[28rem] w-full overflow-hidden rounded-xl bg-slate-100 md:h-[32rem]">
                <Image
                  src="/images/branding/NaveenKella.jpg"
                  alt="Naveen Kella, MD"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority
                />
              </div>
              {/* Awards under image */}
              <div className="flex flex-wrap justify-center gap-6">
                <div className="relative h-28 w-28 shrink-0 md:h-32 md:w-32">
                  <Image
                    src="/images/branding/2019Award.png"
                    alt="2019 Award - Best Urologists San Antonio - Three Best Rated Top 3 Choices"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="relative h-28 w-28 shrink-0 md:h-32 md:w-32">
                  <Image
                    src="/images/branding/2020Award.png"
                    alt="2020 Award - Best Urologists San Antonio - Three Best Rated Top 3 Choices"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="relative h-28 w-28 shrink-0 md:h-32 md:w-32">
                  <Image
                    src="/images/branding/2026Award.png"
                    alt="2026 Award - Best Urologists San Antonio - Three Best Rated Top 3 Choices"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Naveen Kella, MD
              </h2>
              <p className="mt-1 text-slate-600 font-bold">
                Founder of The Urology Place
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Dr. Kella is an Adjunct Assistant Professor for the UT Health Science Center San Antonio. As well as one of the most experienced Robotic Surgeons in the country.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Dr. Naveen Kella is board certified in urology, with a fellowship in Urologic Oncology and robotic surgery. He is known for his experience in treating prostate cancer and has performed over 2,500 robotic prostate cancer surgeries. Literature notes the best surgeons usually have a superior experience. Dr. Kella is the most experienced robotic prostate surgeon in San Antonio and South Texas. In fact, he is one of the most experienced in the nation. Dr. Kella is also an Adjunct Assistant Professor for the UT Health Science Center.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                What values and characteristics do top urologists possess? &ldquo;Experience, education and a great team are key,&rdquo; states Kella. When asked about his success, Dr. Kella gives much credit to his clinic and surgical teams. He has performed nearly all of his robotic prostatectomy cases in the same hospital with the same team. Thus, the team has amassed collective excellence as a single performing unit that is unmatched by nearly anyone in the nation.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                In his spare time, Dr. Kella spends time with his family and enjoys sports and Crossfit.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                One of his most memorable experiences is in the video link below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video: Dr. Kella half court shot */}
      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="w-full max-w-md shrink-0 overflow-hidden rounded-xl bg-slate-200">
              <YouTubeEmbed
                videoId="H0iedrP-aLI"
                title="Dr. Kella making a half court shot at a Dallas Mavericks game"
                className="rounded-xl"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Dr. Kella making a half court shot at a Dallas Mavericks game!
              </h2>
              <div className="mt-3 h-1 w-16 rounded bg-blue-600" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Christopher Garcia, FNP */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="relative h-80 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-96 lg:w-[380px]">
              <Image
                src="/images/branding/Christopher.png"
                alt="Christopher Garcia, FNP"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 380px, 100vw"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Christopher Garcia, FNP
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Chris Garcia has been a Registered Nurse for over 15 years and a Certified Family Nurse Practitioner for over 4 years. He completed his Bachelors of Science in Nursing degree from Our Lady of the Lake University in San Antonio, TX. His initial training was at the San Antonio Methodist Hospital in a Cardiac Unit. Chris successfully completed his Master of Science of Nursing degree from Walden University where he worked intensively in Family Practice, Urgent care and Endocrinology. Chris has worked closely with Dr. Kella and helps run the Men&apos;s Wellness program and the Smart Fusion Biopsy program.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                He enjoys running and spending quality family time with his wife and two sons. They try to travel to new destinations and exploring new cultures. They have a goal of visiting as many countries and continents as possible and only have Antarctica left to explore. He looks forward to meeting you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-center text-3xl font-bold uppercase tracking-tight text-slate-900 md:text-4xl">
            Our Team
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-xl bg-slate-200 md:h-96 md:w-96">
                <Image
                  src="/images/branding/George.PNG"
                  alt="George"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 768px) 384px, 320px"
                />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">George</p>
              <p className="text-slate-600">Medical Assistant</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-xl bg-slate-200 md:h-96 md:w-96">
                <Image
                  src="/images/branding/Mike.jpg"
                  alt="Mike"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 768px) 384px, 320px"
                />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">Mike</p>
              <p className="text-slate-600">Radiology Technician</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-xl bg-slate-200 md:h-96 md:w-96">
                <Image
                  src="/images/branding/Victoria.jpg"
                  alt="Victoria"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 768px) 384px, 320px"
                />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">Victoria</p>
              <p className="text-slate-600">Clinical Research Coordinator</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-xl bg-slate-200 md:h-96 md:w-96">
                <Image
                  src="/images/branding/Patsy.jpg"
                  alt="Patsy"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 768px) 384px, 320px"
                />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">Patsy</p>
              <p className="text-slate-600">Office Manager</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
