import { NextResponse } from "next/server";
import { ingestContactToCrm } from "@/app/lib/contact-crm";
import {
  sendContactNotificationEmail,
  sendTrelloBoardEmail,
} from "@/app/lib/contact-email";
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
  sendTrelloBoardEmail?: typeof sendTrelloBoardEmail;
  sendContactNotificationEmail?: typeof sendContactNotificationEmail;
  ingestContactToCrm?: typeof ingestContactToCrm;
  checkContactRateLimit?: typeof checkContactRateLimit;
  isRecaptchaConfigured?: typeof isRecaptchaConfigured;
  verifyRecaptchaResponse?: typeof verifyRecaptchaResponse;
};

function resolveContactRouteEffects(overrides?: ContactRouteOverrides) {
  return {
    sendTrelloBoardEmail:
      overrides?.sendTrelloBoardEmail ?? sendTrelloBoardEmail,
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
 * Provider failures are logged without the Error object. Resend and Trello
 * messages can include recipients, names, or message text.
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
  event: "trello_board_email_failed" | "staff_notification_email_failed",
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

/**
 * POST /api/contact — validates the submission and creates a Trello card.
 * Google CRM ingest runs only after Trello succeeds, and only as best-effort.
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

  try {
    await effects.sendTrelloBoardEmail({ contact: normalized });
  } catch (error) {
    logContactProviderFailure("trello_board_email_failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: "The request could not be completed. Please try again later.",
      },
      { status: 502 },
    );
  }

  // Staff notification and CRM both start only after Trello has succeeded.
  // They run together so CRM latency is not added on top of the staff email.
  // A CRM failure is logged inside the CRM client and does not change this response.
  const [notificationResult] = await Promise.allSettled([
    effects.sendContactNotificationEmail({ contact: normalized }),
    effects.ingestContactToCrm(normalized),
  ]);

  if (notificationResult.status === "rejected") {
    logContactProviderFailure(
      "staff_notification_email_failed",
      notificationResult.reason,
    );
  }

  return NextResponse.json({
    ok: true,
  });
}

export async function POST(request: Request) {
  return handleContactPost(request);
}
