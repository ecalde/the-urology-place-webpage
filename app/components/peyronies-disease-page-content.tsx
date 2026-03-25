import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

function peyImg(name: string) {
  return encodeURI(`/images/peyronies disease/${name}`).replace(/\+/g, "%2B");
}

const HERO_BG = peyImg("guy-camera-photographer-2880w.jpg");
const IMG_MOUNTAINS = peyImg("Canva+-+Man+Standing+Facing+Mountains+(1)-2880w.jpg");
const IMG_CLIPBOARD = peyImg("photo-1522308300961-fdb949cac8aa-2880w.jpg");

const MARBLE_SECTION =
  "bg-gradient-to-br from-stone-100 via-white to-stone-200 bg-[length:100%_100%]";

const PEYRONIE_SIGNS = [
  "Noticeable knot or scar on the inside of the penile shaft",
  "Pronounced curve during erection",
  "Noticeably shorter penis",
  "Pain with intercourse or erection",
] as const;

function FaqBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#f2f2f2] px-6 py-10 text-center shadow-sm md:px-10">
      <h2 className="text-lg font-bold text-amber-600 md:text-xl">{title}</h2>
      <div className="mx-auto mt-3 h-px w-24 bg-amber-400/90" aria-hidden />
      <div className="mt-6 space-y-4 text-left text-base leading-relaxed text-slate-900 md:text-center">
        {children}
      </div>
    </div>
  );
}

export function PeyroniesDiseasePageContent() {
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
        <section className="relative flex min-h-[min(52vh,520px)] flex-col items-center justify-center px-6 py-20 md:min-h-[56vh] md:py-28">
          <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Peyronie&apos;s Disease
            </h1>
          </div>
        </section>

        <section className={`relative rounded-t-3xl border-t border-slate-200/80 ${MARBLE_SECTION} shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)]`}>
          <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              How do I know if I have Peyronie&apos;s Disease?
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              Peyronie&apos;s disease is the curvature of the penis that can be physically uncomfortable and
              emotionally distressing on a man, especially if shortening or &ldquo;hour glass&rdquo; deformity of
              the penis occurs.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              Falopius described the first curvature in a patient in 1561. Surgeon Peyronie himself described 5
              cases. They were treated by bathing in the waters of Barege in France in 1743 (water unavailable in
              our offices).
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
              A trip to the urologist can confirm diagnosis. Some signs and symptoms include the following:
            </p>
            <ul className="mx-auto mt-8 max-w-xl list-disc space-y-2 pl-5 text-left text-base leading-relaxed text-slate-800 marker:text-slate-900 md:text-lg">
              {PEYRONIE_SIGNS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-slate-800 md:text-lg">
              There are various causes to explain why Peyronie&apos;s may occur that include but are not limited to
              testosterone levels (even if ED is not present), genetics, and underlying conditions. There have been
              studies that show a link between Peyronie&apos;s and Dupuytren&apos;s Contracture which is a disease
              affecting the tendons in the fingers and other joints. Studies have shown that there are also a few
              inflammatory disorders that hold an influence on gene mutation for chromosome 11.
            </p>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
              <figure className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm ring-1 ring-slate-200/80">
                <div className="relative aspect-[4/3] w-full bg-slate-100 lg:aspect-[4/5]">
                  <Image
                    src={IMG_MOUNTAINS}
                    alt="Man standing on a hilltop facing mountains at sunrise"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </div>
              </figure>
              <div className="space-y-10 text-center lg:text-left">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                    What causes a bent or curved penis?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                    Some men can have a very mild curve, which is natural. If a curve worsens or is more dramatic,
                    this is possibly PD. Bent penis occurs when fibrous tissue forms a plaque underneath the skin of
                    the penis and acts as a scar, preventing the natural stretch of the penis during erection. While
                    the exact cause differs, many men report an injury to the penis that occurred during sex. A snap
                    is heard or felt, and sometimes men notice bruising on the penis. The injury heals over time, but
                    a plaque is formed.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                    Is penile injury common?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                    Penile injury is, in fact, pretty common. Although the development of plaque in the penis after
                    injury, called Peyronie&apos;s Disease, is not as common — it can affect as many as 1 out of 10
                    men. Unfortunately, this common condition is often hidden due to embarrassment. We have the
                    spectrum of treatments to fight PD.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-center lg:text-left">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                  Are there alternatives to surgery?
                </h2>
                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                  We use multiple approaches to help fix the curved penis and we try to reduce the pain associated
                  with Peyronie&apos;s.
                </p>
                <ul className="space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
                  <li>
                    <strong className="text-slate-900">Surgery</strong> is considered the gold standard.
                    Unfortunately, patients may decide against surgery because it will shorten the length of the
                    penis.
                  </li>
                  <li>
                    <strong className="text-slate-900">Xiaflex</strong> is FDA approved. It is an injection directly
                    into the scar tissue. Studies show a 30% improvement in curvature. Not all cases are candidates
                    for xiaflex. The medication can be expensive depending on insurance coverage. Side-effects may be
                    severe sometimes. Penile rupture is a possibility.
                  </li>
                  <li>
                    <strong className="text-slate-900">Verapamil injection</strong> is less effective and relatively
                    unproven compared to xiaflex.
                  </li>
                  <li>
                    <strong className="text-slate-900">Verapamil gel</strong> is also available.
                  </li>
                  <li>
                    <strong className="text-slate-900">Penile extension devices</strong> are options. We encourage
                    this treatment and have them in stock.
                  </li>
                </ul>
              </div>

              <figure className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm ring-1 ring-slate-200/80">
                <div className="relative aspect-[4/3] w-full bg-slate-100 lg:aspect-[4/5]">
                  <Image
                    src={IMG_CLIPBOARD}
                    alt="Clinical documentation: hands writing on a daily report schedule with medical supplies"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </div>
              </figure>
            </div>
          </div>
        </section>

        <section className="relative border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl space-y-10 px-6 py-14 md:space-y-12 md:py-20">
            <FaqBox title="Can I Just Take Pills for My Bent Penis?">
              <p>
                Unfortunately, many pills are not 100% reliable. However, we have seen that the combination of
                Tadalafil and Pentoxifylline has been effective for Peyronie&apos;s. A recent randomized study has
                shown a 10% improvement in plaque and reduction of pain with the use of Tadalafil. In regards to
                Pentoxifylline, a randomized and controlled trial had shown the reduction of curvature with this
                medication.
              </p>
            </FaqBox>

            <FaqBox title="Does GAINSWave Help with Peyronie's?">
              <p>
                <Link
                  href="/men/male-sexual-dysfunction/gainswave/contact-us"
                  className="font-medium text-sky-600 underline decoration-sky-600/80 underline-offset-2 hover:text-sky-700"
                >
                  GAINSWave
                </Link>{" "}
                or low intensity shockwave therapy helps stimulate the growth of small blood vessels and nerve
                tissue. The shockwaves are able to break up microplaque as well. The American Urology Association
                considers shockwaves effective for any pain with Peyronie&apos;s, which is known as the acute phase.
                The effect of soundwaves for treating the penis curve is mixed. However, a recent study had noted
                improvement when the soundwaves were directly targeting into the plaque. Luckily, the treatment does
                not have any downtime or side-effects associated.
              </p>
            </FaqBox>

            <FaqBox title="Does Testosterone Help with Peyronies?">
              <p>
                This is still a topic of discussion that is being researched. However, studies have shown that low
                testosterone levels are associated with Peyronie&apos;s disease. If you have symptoms of low T such
                as low energy or sleeplessness, we can check your levels and start a safe program to optimize your
                levels into a normal range. Read more about hormone replacement therapy{" "}
                <Link
                  href="/men/low-testosterone"
                  className="font-medium text-sky-600 underline decoration-sky-600/80 underline-offset-2 hover:text-sky-700"
                >
                  here
                </Link>
                .
              </p>
            </FaqBox>
          </div>
        </section>

        <section
          id="contact-peyronies"
          className="relative scroll-mt-28 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              title="Contact Us For Peyronie's Disease"
              serviceName="Peyronies Disease"
              category="Men > Male Sexual Dysfunction"
              sourcePath="/men/male-sexual-dysfunction/peyronies"
              idPrefix="men-peyronies-disease"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
