"use server";

import { loadCircumcisionPatientGalleries } from "@/app/lib/circumcision-photos";

/** Loads gallery URLs only after the visitor passes the content warning. */
export async function loadConsentedCircumcisionGalleries() {
  return loadCircumcisionPatientGalleries();
}
