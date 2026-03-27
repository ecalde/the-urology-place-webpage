import { ContactFormTemplate } from "@/app/components/contact-form-template";

export default function AdultCircumcisionPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Adult Circumcision
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Placeholder content describing adult circumcision services, procedure
          details, and recovery information.
        </p>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <ContactFormTemplate
            variant="embedded"
            pageName="Adult Circumcision"
            serviceName="Adult Circumcision"
            category="Men"
            sourcePath="/men/adult-circumcision"
            idPrefix="men-adult-circumcision"
          />
        </div>
      </section>
    </main>
  );
}

