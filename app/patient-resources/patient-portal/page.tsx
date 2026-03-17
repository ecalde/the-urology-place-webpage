export default function PatientPortalPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero window: static background per PROJECT_RULES.md */}
      <section
        className="relative min-h-[42vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage:
            "url(/images/patient%20portal/photo-1516321318423-f06f85e504b3-2880w.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Patient Portal
          </h1>
        </div>
      </section>

      {/* Sliding page */}
      <section className="rounded-t-3xl border-t border-slate-200 bg-white">
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
              <div className="rounded-2xl bg-slate-50/80 p-8 ring-1 ring-slate-200">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Patient Portal:
                </h2>
                <p className="mt-4 text-slate-700 leading-relaxed">
                  If you are an existing patient, you can view your labs and
                  reports. You need to have created an account with our
                  electronic medical record, ElationEMR. The portal requires an
                  email and a mobile phone number capable of receiving text
                  messages.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <button
                  type="button"
                  className="w-full max-w-md rounded-xl bg-slate-600 px-8 py-10 text-center text-2xl font-medium tracking-tight text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Click here for Patient Portal
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

