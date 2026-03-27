import Image from "next/image";
import { ContactFormTemplate } from "@/app/components/contact-form-template";

const MARBLE_BG =
  "radial-gradient(1200px 600px at 10% 20%, rgba(15,23,42,0.06), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(15,23,42,0.05), transparent 55%), linear-gradient(#ffffff, #ffffff)";

export default function CounselingAndInjectionsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[42vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage:
            "url('/images/weight%20loss/Untitled+design+(4)-2880w.png')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/45" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Counseling and Injections
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        {/* Our Approach (no hover; clean cards) */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              It All Starts With a Healthy Lifestyle
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Our Approach
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative h-40 w-full">
                  <Image
                    src="/images/weight loss/Untitled+design+(7)-1600h.png"
                    alt="Person measuring their waist as part of medically supervised weight loss"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1 p-6">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Medically Supervised Prescriptions
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  Our providers are educated in the vast array of appetite
                  suppressants. Based on your medical history and your
                  preferences we will prescribe you the appropriate medication
                  to assist you in your weight loss journey.
                </p>
                </div>
              </article>

              <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative h-40 w-full">
                  <Image
                    src="/images/weight loss/Untitled+design+(8)-1600h.png"
                    alt="Healthy meal with eggs and avocado for nutritional counseling"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Nutritional Counseling
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  Our providers believe a healthy lifestyle is the first step
                  in improving your overall well-being. We provide patients
                  with customizable nutrition plans designed with ease of
                  adherence and flexibility in mind.
                </p>
                </div>
              </article>

              <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative h-40 w-full">
                  <Image
                    src="/images/weight loss/Untitled+design+-289-29-1600h.png"
                    alt="Prescription bottle and supplements for vitamin and lipotropic injections"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Vitamin and Lipotropic fat burning Injections
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  We offer pharmaceutical grade injections that help suppress
                  appetite, improve mood, increase metabolic rate, help the
                  liver flush fat more effectively, boost energy, convert
                  carbohydrates more efficiently and decrease water weight.
                </p>
                </div>
              </article>

              <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative h-40 w-full">
                  <Image
                    src="/images/join our team/Canva+-+Work+Desk+of+a+Doctor-2880w.jpg"
                    alt="Doctor at work desk reviewing monthly progress"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Monthly follow ups
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  Every month we will check on your progress and continuously
                  customize your treatment plan.
                </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Pricing / customized plans */}
        <section className="border-b border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Customized Treatment Plans
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-slate-700 leading-relaxed">
              Here at The Urology Place, we offer customizable treatment plans
              as we understand weight is not a uniform health concern and every
              individual has a distinct goal in mind. We strive to create a
              flexible plan that is manageable so you can see the results you
              desire at your own pace.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <article className="rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  Weight Loss Consultation
                </h3>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  Discuss your weight loss options with our providers. Create
                  your own personalized plan and prescription to ensure you are
                  given all the tools to get the results you desire.
                </p>
                <p className="mt-6 text-3xl font-semibold text-blue-700">
                  $150.00
                </p>
              </article>

              <article className="rounded-2xl bg-blue-600 p-8 text-left text-white shadow-sm">
                <h3 className="text-lg font-bold tracking-tight">
                  Weight Loss Follow-up Appointment
                </h3>
                <p className="mt-3 text-sm text-white/90 leading-relaxed">
                  Perfect for individuals looking to optimize their weight loss
                  journey and maintain results.
                </p>
                <p className="mt-6 text-3xl font-semibold">$75</p>
                <p className="text-sm text-white/90">Per month</p>
              </article>

              <article className="rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  Vitamin Injections and Lipotropic Injections
                </h3>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  Suppress appetite, improve mood, increase metabolic rate, help
                  the liver flush fat more effectively, boost energy, convert
                  carbohydrates more efficiently and decrease water weight.
                </p>
                <p className="mt-6 text-3xl font-semibold text-blue-700">
                  $25.00
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Ask us about our package deals!
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Why choose (marble split) */}
        <section style={{ backgroundImage: MARBLE_BG }}>
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.45fr)_1fr] lg:gap-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Why Choose
                <br />
                The Urology
                <br />
                Place?
              </h2>
              <div className="border-l-2 border-slate-300 pl-8 text-slate-700 leading-relaxed">
                <p>
                  We provide a wide range of wellness services to meet your
                  needs. We work with you to achieve your goals, and give you
                  the tools to maintain your success.
                </p>
                <p className="mt-4">
                  We offer a wide range of medical treatments to meet every
                  type of need.
                </p>
                <p className="mt-4">
                  Whether you need to be seen for sexual health, aesthetic
                  procedures or our weight loss programs, we save you valuable
                  time by offering all of those services in our two convenient
                  locations in San Antonio or Austin!
                </p>
                <p className="mt-6">
                  Check out our{" "}
                  <span className="font-semibold text-blue-600">
                    Sister Clinic
                  </span>{" "}
                  in Austin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section className="border-t border-slate-200 bg-slate-50/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <ContactFormTemplate
              variant="embedded"
              pageName="Weight Loss"
              serviceName="Weight Loss"
              category="Weight Loss"
              sourcePath="/weight-loss/counseling-and-injections"
              idPrefix="weight-loss"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

