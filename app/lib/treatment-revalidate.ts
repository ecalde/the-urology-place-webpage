import { parseBody } from "next-sanity/webhook";

import {
  planTreatmentRevalidation,
  type TreatmentRevalidatePlan,
} from "@/app/lib/treatment-cache";

/** Profile required by Next.js 16.1.6. "max" is stale-while-revalidate. */
export const TREATMENT_REVALIDATE_PROFILE = "max";

/**
 * Sanity webhook filter. Leave draft and version triggers off.
 * Unpublish arrives as a delete of the published document.
 */
export const TREATMENT_WEBHOOK_FILTER =
  '_type == "treatmentPage" && !(_id in path("drafts.**"))';

/**
 * Projection the webhook must send. before() is null on create.
 * after() is null on delete and unpublish, which is how the old path is known.
 */
export const TREATMENT_WEBHOOK_PROJECTION = `{
  "_id": _id,
  "_type": _type,
  "operation": delta::operation(),
  "before": before(){
    section,
    parentPath,
    "slug": slug.current,
    previousPaths
  },
  "after": after(){
    section,
    parentPath,
    "slug": slug.current,
    previousPaths
  }
}`;

export const TREATMENT_WEBHOOK_PATH = "/api/revalidate";

type RevalidateDeps = {
  secret: string | undefined;
  revalidatePath: (path: string) => void;
  revalidateTag: (tag: string, profile: typeof TREATMENT_REVALIDATE_PROFILE) => void;
  /** Production waits. Tests pass false so they do not sleep for three seconds. */
  waitForContentLake?: boolean;
};

function json(body: { revalidated: boolean }, status = 200) {
  return Response.json(body, { status });
}

/**
 * Accept the request only when the Sanity signature matches the secret.
 * A missing secret, a missing header, and a bad signature are all rejected.
 * The document body is not logged and is not copied into the response.
 */
export async function handleTreatmentRevalidate(
  req: Request,
  deps: RevalidateDeps,
): Promise<Response> {
  const secret = deps.secret?.trim();
  if (!secret) return json({ revalidated: false }, 401);

  let parsed: { isValidSignature: boolean | null; body: unknown };
  try {
    parsed = await parseBody(
      req as Parameters<typeof parseBody>[0],
      secret,
      deps.waitForContentLake ?? true,
    );
  } catch (error) {
    console.error(
      "[treatment-revalidate] could not read the webhook body:",
      error instanceof Error ? error.message : "unknown error",
    );
    return json({ revalidated: false }, 400);
  }

  if (parsed.isValidSignature !== true) return json({ revalidated: false }, 401);

  const plan: TreatmentRevalidatePlan = planTreatmentRevalidation(parsed.body);
  if (plan.action === "ignore") return json({ revalidated: false });

  try {
    for (const path of plan.paths) deps.revalidatePath(path);
    for (const tag of plan.tags) deps.revalidateTag(tag, TREATMENT_REVALIDATE_PROFILE);
  } catch (error) {
    console.error(
      "[treatment-revalidate] failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return json({ revalidated: false }, 500);
  }

  return json({ revalidated: true });
}
