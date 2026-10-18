/**
 * Shared contact form validation + normalization (client and server).
 * Do not trust client-only checks — the API must use this module for every submission.
 *
 * Anti-abuse (honeypot, rate limit, optional reCAPTCHA v3) is enforced in app/api/contact/route.ts.
 */

import {
  APPOINTMENT_REASON_OPTIONS,
  BEST_TIME_TO_REACH_OPTIONS,
  BEST_WAY_TO_REACH_OPTIONS,
} from "@/app/lib/contact-form-defaults";

export type RawContactBody = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  appointmentReason?: unknown;
  otherAppointmentReason?: unknown;
  bestWayToReachMe?: unknown;
  bestTimeToReachMe?: unknown;
  otherBestTimeToReachMe?: unknown;
  message?: unknown;
  /** SMS consent: "yes" or "no" (lowercase). */
  smsConsent?: unknown;
  pageName?: unknown;
  sourcePath?: unknown;
  /** Submission-page query values only. Other query keys are never accepted. */
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  /**
   * Present on some page payloads for display context.
   * Intentionally not part of NormalizedContact or the CRM DTO:
   * pageName and sourcePath already identify the public page.
   */
  serviceName?: unknown;
  category?: unknown;
  /** Honeypot — must be empty; checked in the API before validation. */
  website?: unknown;
  /** reCAPTCHA v3 token when verification is enabled server-side. */
  gRecaptchaResponse?: unknown;
};

export type NormalizedContact = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  appointmentReasonFinal: string;
  bestWayToReachMe: string;
  bestTimeToReachMeFinal: string;
  message: string;
  smsConsent: "yes" | "no";
  pageName: string;
  sourcePath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

/** Max lengths — enforced on server; mirror on inputs with maxLength where applicable */
export const CONTACT_FIELD_LIMITS = {
  firstName: 50,
  lastName: 50,
  phone: 25,
  email: 100,
  otherAppointmentReason: 100,
  otherBestTimeToReachMe: 100,
  message: 1000,
  pageName: 200,
  sourcePath: 500,
  utmSource: 200,
  utmMedium: 200,
  utmCampaign: 200,
  serviceName: 200,
  category: 200,
} as const;

const NAME_MIN = 2;
/** Letters (any script), spaces, apostrophe, hyphen — no digits */
const NAME_ALLOWED = /^[\p{L}\s'\-]+$/u;
const PHONE_ALLOWED = /^[\d\s\-+().]*$/;
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function stripControlChars(s: string): string {
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFFFE\uFFFF]/g, "");
}

export function collapseWhitespace(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

function str(v: unknown): string {
  if (typeof v !== "string") return "";
  return stripControlChars(v);
}

export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Validates a person name: min length, max length, allowed characters, must include letters, not numbers-only.
 */
export function validatePersonName(
  raw: string,
  maxLen: number,
): { ok: true; value: string } | { ok: false; reason: string } {
  const collapsed = collapseWhitespace(raw);
  if (collapsed.length < NAME_MIN) {
    return { ok: false, reason: `Use at least ${NAME_MIN} letters.` };
  }
  if (collapsed.length > maxLen) {
    return { ok: false, reason: `Use at most ${maxLen} characters.` };
  }
  if (!NAME_ALLOWED.test(collapsed)) {
    return {
      ok: false,
      reason: "Use letters, spaces, apostrophes, or hyphens only.",
    };
  }
  if (!/\p{L}/u.test(collapsed)) {
    return { ok: false, reason: "Include at least one letter." };
  }
  return { ok: true, value: collapsed };
}

/**
 * US-oriented: 10–15 digits (with or without country code).
 */
export function validatePhone(raw: string): { ok: true; value: string } | { ok: false; reason: string } {
  const trimmed = str(raw).slice(0, CONTACT_FIELD_LIMITS.phone);
  if (!trimmed) {
    return { ok: false, reason: "Enter a phone number." };
  }
  if (!PHONE_ALLOWED.test(trimmed)) {
    return {
      ok: false,
      reason: "Use digits and common separators only (spaces, dashes, parentheses).",
    };
  }
  const d = digitsOnly(trimmed);
  if (d.length < 10) {
    return { ok: false, reason: "Enter at least 10 digits." };
  }
  if (d.length > 15) {
    return { ok: false, reason: "Phone number is too long." };
  }
  return { ok: true, value: trimmed };
}

export function normalizeEmail(raw: string): string {
  return collapseWhitespace(str(raw).toLowerCase());
}

/**
 * Readable public page label. A URL, path, query, or fragment is not a page name.
 */
function sanitizePublicPageName(raw: unknown): string {
  const value = collapseWhitespace(
    str(raw).slice(0, CONTACT_FIELD_LIMITS.pageName),
  );
  if (!value) return "(not provided)";
  if (
    value.includes("://") ||
    value.includes("?") ||
    value.includes("#") ||
    value.startsWith("/")
  ) {
    return "(not provided)";
  }
  return value;
}

/**
 * Pathname only. Scheme, host, query, and fragment are removed so tracking
 * parameters and secrets cannot be stored in source_path.
 * Current pages already pass a clean pathname; those values stay the same.
 */
function sanitizePublicSourcePath(raw: unknown): string {
  const collapsed = collapseWhitespace(str(raw).slice(0, 2000));
  if (!collapsed) return "(not provided)";

  let path = collapsed;

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname || "/";
    } catch {
      return "(not provided)";
    }
  } else if (/%[0-9a-fA-F]{2}/.test(path)) {
    try {
      path = decodeURIComponent(path);
    } catch {
      return "(not provided)";
    }
  }

  const delimiter = path.search(/[?#]/);
  if (delimiter !== -1) {
    path = path.slice(0, delimiter);
  }

  path = path.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "(not provided)";
  }

  return path.slice(0, CONTACT_FIELD_LIMITS.sourcePath);
}

function sanitizeUtmValue(raw: unknown, maxLen: number): string {
  if (typeof raw !== "string") return "";
  return collapseWhitespace(str(raw)).slice(0, maxLen);
}

/**
 * Reads only utm_source, utm_medium, and utm_campaign from a page query string.
 * This is the submission page, not an earlier landing page.
 */
export function readSubmissionPageUtms(search: string): {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
} {
  const params = new URLSearchParams(typeof search === "string" ? search : "");
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
  };
}

export function validateEmail(raw: string): { ok: true; value: string } | { ok: false; reason: string } {
  const e = normalizeEmail(raw).slice(0, CONTACT_FIELD_LIMITS.email);
  if (!e) {
    return { ok: false, reason: "Enter your email address." };
  }
  if (e.length > CONTACT_FIELD_LIMITS.email) {
    return { ok: false, reason: "Email is too long." };
  }
  if (!EMAIL_RE.test(e)) {
    return { ok: false, reason: "Enter a valid email address." };
  }
  return { ok: true, value: e };
}

export type ContactFieldKey =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "otherAppointmentReason"
  | "otherBestTimeToReachMe"
  | "appointmentReason"
  | "bestWayToReachMe"
  | "bestTimeToReachMe"
  | "message"
  | "smsConsent"
  | "pageName"
  | "sourcePath";

export type FieldErrorEntry = { field: ContactFieldKey; message: string };

/**
 * Full server-side validation and normalization. Use from the API route.
 */
export function validateAndNormalizeContact(
  input: RawContactBody,
):
  | { success: true; data: NormalizedContact }
  | { success: false; errors: FieldErrorEntry[] } {
  const errors: FieldErrorEntry[] = [];

  const fn = validatePersonName(str(input.firstName), CONTACT_FIELD_LIMITS.firstName);
  if (!fn.ok) errors.push({ field: "firstName", message: fn.reason });

  const ln = validatePersonName(str(input.lastName), CONTACT_FIELD_LIMITS.lastName);
  if (!ln.ok) errors.push({ field: "lastName", message: ln.reason });

  const ph = validatePhone(str(input.phone));
  if (!ph.ok) errors.push({ field: "phone", message: ph.reason });

  const em = validateEmail(str(input.email));
  if (!em.ok) errors.push({ field: "email", message: em.reason });

  const appointmentReason = collapseWhitespace(str(input.appointmentReason));
  if (!appointmentReason) {
    errors.push({ field: "appointmentReason", message: "Choose an appointment reason." });
  } else if (
    !(APPOINTMENT_REASON_OPTIONS as readonly string[]).includes(appointmentReason)
  ) {
    errors.push({ field: "appointmentReason", message: "Invalid appointment reason." });
  }

  const otherAppointmentReason = collapseWhitespace(
    str(input.otherAppointmentReason).slice(0, CONTACT_FIELD_LIMITS.otherAppointmentReason),
  );
  let appointmentReasonFinal = appointmentReason;

  if (appointmentReason === "Other") {
    if (!otherAppointmentReason) {
      errors.push({
        field: "otherAppointmentReason",
        message: "Describe your appointment reason.",
      });
    } else if (otherAppointmentReason.length < 2) {
      errors.push({
        field: "otherAppointmentReason",
        message: "Add a bit more detail (at least 2 characters).",
      });
    } else {
      appointmentReasonFinal = otherAppointmentReason;
    }
  }

  const bestWayToReachMe = collapseWhitespace(str(input.bestWayToReachMe));
  if (!bestWayToReachMe) {
    errors.push({ field: "bestWayToReachMe", message: "Choose how we should reach you." });
  } else if (
    !(BEST_WAY_TO_REACH_OPTIONS as readonly string[]).includes(bestWayToReachMe)
  ) {
    errors.push({ field: "bestWayToReachMe", message: "Invalid contact method." });
  }

  const bestTimeToReachMe = collapseWhitespace(str(input.bestTimeToReachMe));
  const otherBestTimeToReachMe = collapseWhitespace(
    str(input.otherBestTimeToReachMe).slice(0, CONTACT_FIELD_LIMITS.otherBestTimeToReachMe),
  );

  let bestTimeToReachMeFinal: string;
  if (!bestTimeToReachMe) {
    bestTimeToReachMeFinal = "(not specified)";
  } else if (!(BEST_TIME_TO_REACH_OPTIONS as readonly string[]).includes(bestTimeToReachMe)) {
    errors.push({ field: "bestTimeToReachMe", message: "Invalid time option." });
    bestTimeToReachMeFinal = "";
  } else if (bestTimeToReachMe === "Other") {
    if (!otherBestTimeToReachMe) {
      errors.push({
        field: "otherBestTimeToReachMe",
        message: "Specify when we can reach you.",
      });
      bestTimeToReachMeFinal = "";
    } else if (otherBestTimeToReachMe.length < 2) {
      errors.push({
        field: "otherBestTimeToReachMe",
        message: "Add a bit more detail (at least 2 characters).",
      });
      bestTimeToReachMeFinal = "";
    } else {
      bestTimeToReachMeFinal = otherBestTimeToReachMe;
    }
  } else {
    bestTimeToReachMeFinal = bestTimeToReachMe;
  }

  const rawMessage = str(input.message);
  if (rawMessage.length > CONTACT_FIELD_LIMITS.message) {
    errors.push({ field: "message", message: `Message must be at most ${CONTACT_FIELD_LIMITS.message} characters.` });
  }
  const message = collapseWhitespace(rawMessage.slice(0, CONTACT_FIELD_LIMITS.message));

  const smsRaw = collapseWhitespace(str(input.smsConsent)).toLowerCase();
  let smsConsent: "yes" | "no" | null = null;
  if (smsRaw === "yes" || smsRaw === "no") {
    smsConsent = smsRaw;
  } else {
    errors.push({
      field: "smsConsent",
      message: "Select Yes or No for SMS communications.",
    });
  }

  const pageName = sanitizePublicPageName(input.pageName);
  const sourcePath = sanitizePublicSourcePath(input.sourcePath);
  const utmSource = sanitizeUtmValue(
    input.utmSource,
    CONTACT_FIELD_LIMITS.utmSource,
  );
  const utmMedium = sanitizeUtmValue(
    input.utmMedium,
    CONTACT_FIELD_LIMITS.utmMedium,
  );
  const utmCampaign = sanitizeUtmValue(
    input.utmCampaign,
    CONTACT_FIELD_LIMITS.utmCampaign,
  );

  if (errors.length > 0) {
    return { success: false, errors };
  }

  if (!fn.ok || !ln.ok || !ph.ok || !em.ok) {
    return {
      success: false,
      errors: [
        { field: "firstName", message: "Please review your submission and try again." },
      ],
    };
  }

  const data: NormalizedContact = {
    firstName: fn.value,
    lastName: ln.value,
    phone: ph.value,
    email: em.value,
    appointmentReasonFinal,
    bestWayToReachMe,
    bestTimeToReachMeFinal,
    message,
    smsConsent: smsConsent as "yes" | "no",
    pageName,
    sourcePath,
    utmSource,
    utmMedium,
    utmCampaign,
  };

  return { success: true, data };
}

/** Map server field errors to client inline keys (subset). */
export type ClientValidatedField =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "otherAppointmentReason"
  | "otherBestTimeToReachMe"
  | "appointmentReason"
  | "bestWayToReachMe"
  | "bestTimeToReachMe"
  | "message"
  | "smsConsent";

const CLIENT_KEYS = new Set<string>([
  "firstName",
  "lastName",
  "phone",
  "email",
  "otherAppointmentReason",
  "otherBestTimeToReachMe",
  "appointmentReason",
  "bestWayToReachMe",
  "bestTimeToReachMe",
  "message",
  "smsConsent",
]);

/**
 * Client-side validation using the same rules (UX before submit).
 * Returns a map of field → message for inline display.
 */
export function validateContactForClient(
  input: RawContactBody,
): Partial<Record<ClientValidatedField, string>> {
  const r = validateAndNormalizeContact(input);
  if (r.success) return {};
  const out: Partial<Record<ClientValidatedField, string>> = {};
  for (const e of r.errors) {
    if (CLIENT_KEYS.has(e.field) && out[e.field as ClientValidatedField] === undefined) {
      out[e.field as ClientValidatedField] = e.message;
    }
  }
  if (Object.keys(out).length === 0 && r.errors.length > 0) {
    out.firstName = "Please check the form and try again.";
  }
  return out;
}
