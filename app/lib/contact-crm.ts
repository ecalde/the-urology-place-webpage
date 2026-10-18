import "server-only";

import { createHmac, randomUUID } from "node:crypto";

import type { NormalizedContact } from "@/app/lib/contact-validation";

/**
 * Server-only dual-write client for the Phase 7B Apps Script ingest contract.
 * The browser never calls this module. Trello remains the primary success path.
 */

const CRM_API_VERSION = 1;

const DEFAULT_TIMEOUT_MS = 15_000;
const MIN_TIMEOUT_MS = 1_000;
const MAX_TIMEOUT_MS = 30_000;
const MAX_RESPONSE_CHARS = 16_384;

const CONTACT_METHODS = ["Phone", "Text", "Email"] as const;

type CrmContactMethod = (typeof CONTACT_METHODS)[number];

function isCrmContactMethod(value: string): value is CrmContactMethod {
  return (CONTACT_METHODS as readonly string[]).includes(value);
}

const TIMESTAMP_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

const SUBMISSION_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LEAD_ID_RE =
  /^LEAD-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EXEC_URL_RE = /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;

const APP_CODES = new Set([
  "AUTH_FAILED",
  "INVALID_ENVELOPE",
  "TIMESTAMP_EXPIRED",
  "INVALID_PAYLOAD",
  "LOCK_TIMEOUT",
  "INGEST_FAILED",
  "PARTIAL_COMMIT",
  "IDEMPOTENCY_CONFLICT",
  "METHOD_NOT_ALLOWED",
]);

export type CrmLeadPayload = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  appointment_reason: string;
  preferred_contact_method: CrmContactMethod;
  preferred_contact_time: string;
  sms_consent: boolean;
  message: string;
  page_name: string;
  source_path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

export type CrmFailureCode =
  | "CONFIG_URL_INVALID"
  | "CONFIG_SECRET_MISSING"
  | "MAPPING_REJECTED"
  | "INVALID_ENVELOPE"
  | "TIMEOUT"
  | "NETWORK"
  | "INVALID_RESPONSE"
  | "UNRECOGNIZED_CODE"
  | "UNEXPECTED"
  | "AUTH_FAILED"
  | "TIMESTAMP_EXPIRED"
  | "INVALID_PAYLOAD"
  | "LOCK_TIMEOUT"
  | "INGEST_FAILED"
  | "PARTIAL_COMMIT"
  | "IDEMPOTENCY_CONFLICT"
  | "METHOD_NOT_ALLOWED";

export type CrmIngestResult =
  | { outcome: "skipped" }
  | {
      outcome: "success";
      submissionId: string;
      leadId: string | null;
      replayed: boolean;
    }
  | {
      outcome: "failed";
      submissionId: string;
      code: CrmFailureCode;
      leadId: string | null;
    };

export type CrmTransportResult =
  | { delivered: true; httpStatus: number; bodyText: string | null }
  | { delivered: false; code: "TIMEOUT" | "NETWORK" };

type CrmDeps = {
  fetchImpl?: typeof fetch;
  now?: () => Date;
  createSubmissionId?: () => string;
};

type CrmLogEvent = {
  submissionId: string;
  code: string;
  elapsedMs: number;
  httpStatus?: number;
  leadId?: string | null;
  timeoutFallback?: boolean;
  replayed?: boolean;
};

/**
 * Recursive canonical JSON matching Apps Script `canonicalJsonStringify_`.
 * Object keys sort lexicographically at every level. Arrays keep element order.
 */
export function canonicalJsonStringify(value: unknown): string {
  if (value === null) {
    return "null";
  }

  const valueType = typeof value;

  if (valueType === "boolean" || valueType === "number") {
    if (valueType === "number" && !Number.isFinite(value)) {
      throw new Error("INVALID_PAYLOAD");
    }
    return JSON.stringify(value);
  }

  if (valueType === "string") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (let index = 0; index < value.length; index += 1) {
      parts.push(canonicalJsonStringify(value[index]));
    }
    return `[${parts.join(",")}]`;
  }

  if (valueType === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const parts: string[] = [];
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      parts.push(
        `${JSON.stringify(key)}:${canonicalJsonStringify(record[key])}`,
      );
    }
    return `{${parts.join(",")}}`;
  }

  throw new Error("INVALID_PAYLOAD");
}

export function buildWebsiteIngestSigningString(
  version: number,
  timestamp: string,
  submissionId: string,
  payload: CrmLeadPayload,
): string {
  return `${String(version)}\n${timestamp}\n${submissionId}\n${canonicalJsonStringify(payload)}`;
}

export function hmacSha256Hex(message: string, secret: string): string {
  return createHmac("sha256", secret).update(message, "utf8").digest("hex");
}

function crmOptionalText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Explicit CRM DTO. Do not spread the contact object.
 * `smsConsent` "yes"/"no" becomes a boolean. Any other value is rejected.
 * Contact method must already be Phone, Text, or Email.
 * UTMs are copied only after validation. Missing values stay blank.
 */
export function buildCrmLeadPayload(
  contact: NormalizedContact,
): CrmLeadPayload | null {
  if (!isCrmContactMethod(contact.bestWayToReachMe)) {
    return null;
  }

  if (contact.smsConsent !== "yes" && contact.smsConsent !== "no") {
    return null;
  }

  return {
    first_name: contact.firstName,
    last_name: contact.lastName,
    phone: contact.phone,
    email: contact.email,
    appointment_reason: contact.appointmentReasonFinal,
    preferred_contact_method: contact.bestWayToReachMe,
    preferred_contact_time: contact.bestTimeToReachMeFinal,
    sms_consent: contact.smsConsent === "yes",
    message: contact.message,
    page_name: contact.pageName,
    source_path: contact.sourcePath,
    utm_source: crmOptionalText(contact.utmSource),
    utm_medium: crmOptionalText(contact.utmMedium),
    utm_campaign: crmOptionalText(contact.utmCampaign),
  };
}

function isCrmEnabled(): boolean {
  return (process.env.CRM_INGEST_ENABLED ?? "").trim() === "true";
}

function readCrmUrl(): string | null {
  const raw = (process.env.CRM_INGEST_URL ?? "").trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.hostname !== "script.google.com") return null;
  if (url.port !== "" && url.port !== "443") return null;
  if (url.search || url.hash) return null;
  if (!EXEC_URL_RE.test(url.pathname)) return null;

  return url.href;
}

function readCrmSecret(): string | null {
  const secret = (process.env.CRM_INGEST_SECRET ?? "").trim();
  if (!secret) return null;
  return secret;
}

function readCrmTimeoutMs(): { timeoutMs: number; usedFallback: boolean } {
  const raw = process.env.CRM_INGEST_TIMEOUT_MS;
  if (raw === undefined || raw.trim() === "") {
    return { timeoutMs: DEFAULT_TIMEOUT_MS, usedFallback: false };
  }

  const parsed = Number(raw.trim());
  if (!Number.isInteger(parsed) || parsed < MIN_TIMEOUT_MS || parsed > MAX_TIMEOUT_MS) {
    return { timeoutMs: DEFAULT_TIMEOUT_MS, usedFallback: true };
  }

  return { timeoutMs: parsed, usedFallback: false };
}

function httpStatusClass(status: number): string {
  if (status >= 200 && status < 300) return "2xx";
  if (status >= 300 && status < 400) return "3xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500 && status < 600) return "5xx";
  return "other";
}

function safeSubmissionId(value: string): string {
  if (SUBMISSION_ID_RE.test(value)) return value;
  return "invalid-submission-id";
}

function safeLeadId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!LEAD_ID_RE.test(value)) return null;
  return value;
}

function logCrmEvent(event: CrmLogEvent): void {
  const submissionId = safeSubmissionId(event.submissionId);
  const leadId = safeLeadId(event.leadId);
  const line: Record<string, string | number | boolean> = {
    integration: "crm",
    submission_id: submissionId,
    code: event.code,
    elapsed_ms: event.elapsedMs,
  };

  if (event.httpStatus !== undefined) {
    line.http_status_class = httpStatusClass(event.httpStatus);
  }
  if (leadId) {
    line.lead_id = leadId;
  }
  if (event.timeoutFallback) {
    line.timeout_fallback = true;
  }
  if (event.replayed === true) {
    line.replayed = true;
  }

  if (event.code === "OK") {
    console.info("[contact] crm", line);
    return;
  }

  console.error("[contact] crm", line);
}

function failed(
  submissionId: string,
  code: CrmFailureCode,
  leadId: string | null = null,
): CrmIngestResult {
  return {
    outcome: "failed",
    submissionId: safeSubmissionId(submissionId),
    code,
    leadId,
  };
}

/**
 * POST the signed envelope and follow Apps Script's 302 to read the
 * ContentService body. Node fetch converts a 302 POST into a GET on the
 * redirect hop, so the script is not executed a second time.
 * Callers must pass an already validated URL.
 */
export async function postCrmIngestRequest(
  url: string,
  body: string,
  timeoutMs: number,
  fetchImpl: typeof fetch = fetch,
): Promise<CrmTransportResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    if (text.length > MAX_RESPONSE_CHARS) {
      return { delivered: true, httpStatus: response.status, bodyText: null };
    }

    return { delivered: true, httpStatus: response.status, bodyText: text };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "AbortError" || name === "TimeoutError") {
      return { delivered: false, code: "TIMEOUT" };
    }
    return { delivered: false, code: "NETWORK" };
  } finally {
    clearTimeout(timer);
  }
}

function parseCrmApplicationResult(
  httpStatus: number,
  bodyText: string | null,
):
  | { outcome: "success"; leadId: string | null; replayed: boolean }
  | { outcome: "failed"; code: CrmFailureCode; leadId: string | null } {
  if (bodyText === null) {
    return { outcome: "failed", code: "INVALID_RESPONSE", leadId: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return { outcome: "failed", code: "INVALID_RESPONSE", leadId: null };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { outcome: "failed", code: "INVALID_RESPONSE", leadId: null };
  }

  const record = parsed as Record<string, unknown>;
  const leadId = safeLeadId(record.lead_id);
  const httpOk = httpStatus >= 200 && httpStatus < 300;
  const replayed = record.replayed === true;

  if (record.ok === true && httpOk) {
    return { outcome: "success", leadId, replayed };
  }

  if (typeof record.code === "string" && APP_CODES.has(record.code)) {
    return {
      outcome: "failed",
      code: record.code as CrmFailureCode,
      leadId,
    };
  }

  if (record.ok === false || typeof record.code === "string") {
    return { outcome: "failed", code: "UNRECOGNIZED_CODE", leadId: null };
  }

  return { outcome: "failed", code: "INVALID_RESPONSE", leadId: null };
}

/**
 * Best-effort Google CRM ingest. Never throws.
 * When CRM_INGEST_ENABLED is not exactly "true", this returns immediately
 * and does not open a network request.
 */
export async function ingestContactToCrm(
  contact: NormalizedContact,
  deps?: CrmDeps,
): Promise<CrmIngestResult> {
  if (!isCrmEnabled()) {
    return { outcome: "skipped" };
  }

  const startedAt = Date.now();
  const submissionId = safeSubmissionId(
    (deps?.createSubmissionId ?? randomUUID)(),
  );

  try {
    const url = readCrmUrl();
    if (!url) {
      logCrmEvent({
        submissionId,
        code: "CONFIG_URL_INVALID",
        elapsedMs: Date.now() - startedAt,
      });
      return failed(submissionId, "CONFIG_URL_INVALID");
    }

    const secret = readCrmSecret();
    if (!secret) {
      logCrmEvent({
        submissionId,
        code: "CONFIG_SECRET_MISSING",
        elapsedMs: Date.now() - startedAt,
      });
      return failed(submissionId, "CONFIG_SECRET_MISSING");
    }

    const timeout = readCrmTimeoutMs();
    const payload = buildCrmLeadPayload(contact);
    if (!payload) {
      logCrmEvent({
        submissionId,
        code: "MAPPING_REJECTED",
        elapsedMs: Date.now() - startedAt,
        timeoutFallback: timeout.usedFallback,
      });
      return failed(submissionId, "MAPPING_REJECTED");
    }

    const timestamp = (deps?.now ?? (() => new Date()))().toISOString();
    if (!TIMESTAMP_RE.test(timestamp)) {
      logCrmEvent({
        submissionId,
        code: "INVALID_ENVELOPE",
        elapsedMs: Date.now() - startedAt,
        timeoutFallback: timeout.usedFallback,
      });
      return failed(submissionId, "INVALID_ENVELOPE");
    }

    const signingString = buildWebsiteIngestSigningString(
      CRM_API_VERSION,
      timestamp,
      submissionId,
      payload,
    );
    const signature = hmacSha256Hex(signingString, secret);
    const envelope = {
      version: CRM_API_VERSION,
      timestamp,
      submission_id: submissionId,
      payload,
      signature,
    };

    // One POST. The Apps Script ledger makes an exact resend of this same
    // body safe. This client does not retry TIMEOUT, NETWORK, HTTP 5xx, or
    // LOCK_TIMEOUT; a manual resend can reuse this envelope while it is fresh.
    const transport = await postCrmIngestRequest(
      url,
      JSON.stringify(envelope),
      timeout.timeoutMs,
      deps?.fetchImpl,
    );

    if (!transport.delivered) {
      logCrmEvent({
        submissionId,
        code: transport.code,
        elapsedMs: Date.now() - startedAt,
        timeoutFallback: timeout.usedFallback,
      });
      return failed(submissionId, transport.code);
    }

    const application = parseCrmApplicationResult(
      transport.httpStatus,
      transport.bodyText,
    );

    if (application.outcome === "success") {
      logCrmEvent({
        submissionId,
        code: "OK",
        elapsedMs: Date.now() - startedAt,
        httpStatus: transport.httpStatus,
        leadId: application.leadId,
        timeoutFallback: timeout.usedFallback,
        replayed: application.replayed,
      });
      return {
        outcome: "success",
        submissionId,
        leadId: application.leadId,
        replayed: application.replayed,
      };
    }

    logCrmEvent({
      submissionId,
      code: application.code,
      elapsedMs: Date.now() - startedAt,
      httpStatus: transport.httpStatus,
      leadId: application.leadId,
      timeoutFallback: timeout.usedFallback,
    });
    return failed(submissionId, application.code, application.leadId);
  } catch {
    logCrmEvent({
      submissionId,
      code: "UNEXPECTED",
      elapsedMs: Date.now() - startedAt,
    });
    return failed(submissionId, "UNEXPECTED");
  }
}
