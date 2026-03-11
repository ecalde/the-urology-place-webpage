export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          The Urology Place
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Modern, patient-centered urology care in San Antonio.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="/request-appointment"
            className="rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Request Appointment
          </a>
          <a
            href="/contact"
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-900 transition hover:bg-slate-50"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}