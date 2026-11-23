import { revalidatePath, revalidateTag } from "next/cache";

import { handleTreatmentRevalidate } from "@/app/lib/treatment-revalidate";

/**
 * Sanity webhook for published treatment pages.
 * POST https://theurologyplace.com/api/revalidate
 *
 * The shared secret is SANITY_REVALIDATE_SECRET. Sanity signs the raw body in
 * the sanity-webhook-signature header. This route does not read a secret from
 * the query string, and it does not log the document.
 *
 * Filter and projection live in TREATMENT_WEBHOOK_FILTER and
 * TREATMENT_WEBHOOK_PROJECTION. Trigger on create, update, and delete.
 * Leave draft and version events off. Unpublish is the delete trigger.
 */
export async function POST(req: Request) {
  return handleTreatmentRevalidate(req, {
    secret: process.env.SANITY_REVALIDATE_SECRET,
    revalidatePath,
    revalidateTag,
  });
}
