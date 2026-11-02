import { NextResponse } from "next/server";
import { ingestContactToCrm } from "@/app/lib/contact-crm";
import { sendContactNotificationEmail } from "@/app/lib/contact-email";
import {
  validateAndNormalizeContact,
  type RawContactBody,
} from "@/app/lib/contact-submission";
import {
  checkContactRateLimit,
  getClientIp,
} from "@/app/lib/contact-rate-limit";
import {
  isRecaptchaConfigured,
  verifyRecaptchaResponse,
} from "@/app/lib/contact-recaptcha";

/**
 * Test-only replacements for side effects. Next.js calls `POST`, which does
 * not pass overrides, so production keeps the real functions.
 */
type ContactRouteOverrides = {
  sendContactNotificationEmail?: typeof sendContactNotificationEmail;
  ingestContactToCrm?: typeof ingestContactToCrm;
  checkContactRateLimit?: typeof checkContactRateLimit;
  isRecaptchaConfigured?: typeof isRecaptchaConfigured;
  verifyRecaptchaResponse?: typeof verifyRecaptchaResponse;
};

function resolveContactRouteEffects(overrides?: ContactRouteOverrides) {
  return {
    sendContactNotificationEmail:
      overrides?.sendContactNotificationEmail ?? sendContactNotificationEmail,
    ingestContactToCrm: overrides?.ingestContactToCrm ?? ingestContactToCrm,
    checkContactRateLimit:
      overrides?.checkContactRateLimit ?? checkContactRateLimit,
    isRecaptchaConfigured:
      overrides?.isRecaptchaConfigured ?? isRecaptchaConfigured,
    verifyRecaptchaResponse:
      overrides?.verifyRecaptchaResponse ?? verifyRecaptchaResponse,
  };
}

/** Node runtime: CRM HMAC uses node:crypto. Default is already Node; keep it explicit. */
export const runtime = "nodejs";

/** Generic copy for clients — avoids leaking validation internals. */
const GENERIC_VALIDATION_ERROR =
  "Invalid or incomplete submission. Please check your information and try again.";

const RATE_LIMIT_MESSAGE =
  "Too many submissions from this connection. Please wait and try again later.";

const PROVIDER_ERROR_NAME_RE = /^[A-Za-z][A-Za-z0-9_]{0,31}$/;

/**
 * Provider failures are logged without the Error object. Resend messages can
 * include recipients, names, or message text.
 */
function contactProviderErrorClass(error: unknown): string {
  if (error instanceof Error && PROVIDER_ERROR_NAME_RE.test(error.name)) {
    return error.name;
  }
  return "unknown";
}

function contactProviderStatusClass(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const record = error as { status?: unknown; statusCode?: unknown };
  const status = record.statusCode ?? record.status;
  if (typeof status !== "number" || !Number.isInteger(status)) return undefined;
  if (status < 100 || status > 599) return undefined;
  return `${Math.floor(status / 100)}xx`;
}

function logContactProviderFailure(
  event: "crm_ingest_failed" | "staff_notification_email_failed",
  error: unknown,
): void {
  const line: Record<string, string> = {
    event,
    error_class: contactProviderErrorClass(error),
  };
  const statusClass = contactProviderStatusClass(error);
  if (statusClass) {
    line.http_status_class = statusClass;
  }
  console.error("[contact]", line);
}

const SUBMISSION_FAILURE_MESSAGE =
  "The request could not be completed. Please try again later.";

/**
 * POST /api/contact — validates the submission and stores it in Google CRM.
 * The visitor receives success only after CRM confirms the write.
 * Staff email is a notification and runs only after that confirmation.
 */
export async function handleContactPost(
  request: Request,
  overrides?: ContactRouteOverrides,
) {
  const effects = resolveContactRouteEffects(overrides);
  const ip = getClientIp(request);
  if (!effects.checkContactRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: RATE_LIMIT_MESSAGE },
      { status: 429 },
    );
  }

  let body: RawContactBody;
  try {
    body = (await request.json()) as RawContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const honeypot =
    typeof body.website === "string" ? body.website.trim() : "";
  if (honeypot.length > 0) {
    return NextResponse.json(
      { ok: false, error: GENERIC_VALIDATION_ERROR },
      { status: 400 },
    );
  }

  if (effects.isRecaptchaConfigured()) {
    const secret = process.env.RECAPTCHA_SECRET_KEY?.trim() ?? "";
    const token =
      typeof body.gRecaptchaResponse === "string"
        ? body.gRecaptchaResponse
        : "";
    const ok =
      secret.length > 0 &&
      (await effects.verifyRecaptchaResponse(secret, token));
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: GENERIC_VALIDATION_ERROR },
        { status: 400 },
      );
    }
  }

  const validated = validateAndNormalizeContact(body);
  if (!validated.success) {
    return NextResponse.json(
      { ok: false, error: GENERIC_VALIDATION_ERROR },
      { status: 400 },
    );
  }

  const normalized = validated.data;

  // One CRM call. The client does not retry a timeout, and this route does
  // not send the submission anywhere else. A timed-out Apps Script request
  // may still commit after the client gives up; that result is not success,
  // so the visitor is not told the lead was saved. Staff email waits until
  // the CRM client reports outcome "success" (Apps Script ok === true).
  let crmResult: Awaited<ReturnType<typeof ingestContactToCrm>>;
  try {
    crmResult = await effects.ingestContactToCrm(normalized);
  } catch (error) {
    logContactProviderFailure("crm_ingest_failed", error);
    return NextResponse.json(
      { ok: false, error: SUBMISSION_FAILURE_MESSAGE },
      { status: 502 },
    );
  }

  if (crmResult.outcome !== "success") {
    if (crmResult.outcome === "skipped") {
      console.error("[contact]", {
        event: "crm_ingest_not_confirmed",
        outcome: "skipped",
      });
    }
    return NextResponse.json(
      { ok: false, error: SUBMISSION_FAILURE_MESSAGE },
      { status: 502 },
    );
  }

  try {
    await effects.sendContactNotificationEmail({ contact: normalized });
  } catch (error) {
    logContactProviderFailure("staff_notification_email_failed", error);
  }

  return NextResponse.json({
    ok: true,
  });
}

export async function POST(request: Request) {
  return handleContactPost(request);
}
