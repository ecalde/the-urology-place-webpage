/**
 * Phase 7F route contracts for POST /api/contact.
 * Fake data only. Does not call Trello, Resend, Google, or Apps Script.
 */
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEV_URL = "https://script.google.com/macros/s/TESTDEPLOYMENTID/exec";
const GENERIC_VALIDATION_ERROR =
  "Invalid or incomplete submission. Please check your information and try again.";
const RATE_LIMIT_MESSAGE =
  "Too many submissions from this connection. Please wait and try again later.";
const TRELLO_FAILURE_MESSAGE =
  "The request could not be completed. Please try again later.";

const CRM_DTO_KEYS = [
  "appointment_reason",
  "email",
  "first_name",
  "last_name",
  "message",
  "page_name",
  "phone",
  "preferred_contact_method",
  "preferred_contact_time",
  "sms_consent",
  "source_path",
  "utm_campaign",
  "utm_medium",
  "utm_source",
].sort();

const NORMALIZED_KEYS = [
  "appointmentReasonFinal",
  "bestTimeToReachMeFinal",
  "bestWayToReachMe",
  "email",
  "firstName",
  "lastName",
  "message",
  "pageName",
  "phone",
  "smsConsent",
  "sourcePath",
  "utmCampaign",
  "utmMedium",
  "utmSource",
].sort();

const ENV_KEYS = [
  "CRM_INGEST_ENABLED",
  "CRM_INGEST_URL",
  "CRM_INGEST_SECRET",
  "CRM_INGEST_TIMEOUT_MS",
  "RESEND_API_KEY",
  "CONTACT_NOTIFICATION_FROM",
  "CONTACT_NOTIFICATION_TO",
  "TRELLO_BOARD_EMAIL",
  "RECAPTCHA_SECRET_KEY",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
  "RECAPTCHA_SCORE_THRESHOLD",
];

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}

function readSource(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

function loadRouteModules() {
  const dir = mkdtempSync(path.join(tmpdir(), "contact-route-test-"));
  const files = {
    "next-server-shim.mjs": `
      export class NextResponse extends Response {
        static json(data, init) {
          return Response.json(data, init);
        }
      }
    `,
    "contact-email-stub.mjs": `
      export async function sendContactNotificationEmail() {
        throw new Error("contact-email stub invoked");
      }
      export async function sendTrelloBoardEmail() {
        throw new Error("contact-email stub invoked");
      }
    `,
    "contact-form-defaults.mjs": transpile(
      readSource("app/lib/contact-form-defaults.ts"),
    ),
    "contact-recaptcha-constants.mjs": transpile(
      readSource("app/lib/contact-recaptcha-constants.ts"),
    ),
    "contact-rate-limit.mjs": transpile(
      readSource("app/lib/contact-rate-limit.ts"),
    ),
    "contact-validation.mjs": transpile(
      readSource("app/lib/contact-validation.ts").replaceAll(
        'from "@/app/lib/contact-form-defaults"',
        'from "./contact-form-defaults.mjs"',
      ),
    ),
    "contact-submission.mjs": transpile(
      readSource("app/lib/contact-submission.ts").replaceAll(
        'from "@/app/lib/contact-validation"',
        'from "./contact-validation.mjs"',
      ),
    ),
    "contact-recaptcha.mjs": transpile(
      readSource("app/lib/contact-recaptcha.ts").replaceAll(
        'from "@/app/lib/contact-recaptcha-constants"',
        'from "./contact-recaptcha-constants.mjs"',
      ),
    ),
    "contact-crm.mjs": transpile(
      readSource("app/lib/contact-crm.ts").replace('import "server-only";\n', ""),
    ),
    "route.mjs": transpile(readSource("app/api/contact/route.ts"))
      .replaceAll('from "next/server"', 'from "./next-server-shim.mjs"')
      .replaceAll(
        'from "@/app/lib/contact-crm"',
        'from "./contact-crm.mjs"',
      )
      .replaceAll(
        'from "@/app/lib/contact-email"',
        'from "./contact-email-stub.mjs"',
      )
      .replaceAll(
        'from "@/app/lib/contact-submission"',
        'from "./contact-submission.mjs"',
      )
      .replaceAll(
        'from "@/app/lib/contact-rate-limit"',
        'from "./contact-rate-limit.mjs"',
      )
      .replaceAll(
        'from "@/app/lib/contact-recaptcha"',
        'from "./contact-recaptcha.mjs"',
      ),
  };

  for (const [name, contents] of Object.entries(files)) {
    writeFileSync(path.join(dir, name), contents);
  }

  const load = (name) => import(pathToFileURL(path.join(dir, name)).href);
  return Promise.all([
    load("route.mjs"),
    load("contact-crm.mjs"),
    load("contact-rate-limit.mjs"),
  ]).then(([route, crm, rateLimit]) => {
    rmSync(dir, { recursive: true, force: true });
    return { route, crm, rateLimit };
  });
}

const { route, crm, rateLimit } = await loadRouteModules();

const SUCCESS_CRM = {
  outcome: "success",
  submissionId: "00000000-0000-4000-8000-000000000001",
  leadId: "LEAD-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  replayed: false,
};

function manualPayload(overrides = {}) {
  return {
    firstName: "DEVTEST",
    lastName: "PATIENT",
    phone: "210-555-0100",
    email: "devtest.patient@example.com",
    appointmentReason: "General Urology",
    bestWayToReachMe: "Email",
    bestTimeToReachMe: "Afternoon",
    message:
      "DEV TEST ONLY — Phase 7F integration validation. Do not contact.",
    smsConsent: "no",
    pageName: "Patient Resources",
    sourcePath: "/patient-resources/contact-us",
    utmSource: "phase7f",
    utmMedium: "dev_test",
    utmCampaign: "crm_validation",
    serviceName: "General Inquiry",
    category: "Patient Resources",
    website: "",
    utmTerm: "must-not-reach-crm",
    utmContent: "must-not-reach-crm",
    gclid: "must-not-reach-crm",
    ...overrides,
  };
}

function contactRequest(body, ip) {
  const headers = { "content-type": "application/json" };
  if (ip) headers["x-forwarded-for"] = ip;
  return new Request("http://127.0.0.1/api/contact", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function harness(hooks = {}) {
  const calls = { trello: 0, notify: 0, crm: 0 };
  const crmArgs = [];
  let trelloFinished = false;
  const overrides = {
    checkContactRateLimit() {
      if (hooks.rateLimit) return hooks.rateLimit();
      return true;
    },
    async sendTrelloBoardEmail() {
      calls.trello += 1;
      if (hooks.trello) await hooks.trello();
      trelloFinished = true;
    },
    async sendContactNotificationEmail() {
      if (!trelloFinished) {
        throw new Error("staff notification started before Trello finished");
      }
      calls.notify += 1;
      if (hooks.notify) await hooks.notify();
    },
    async ingestContactToCrm(contact, ...rest) {
      if (!trelloFinished) {
        throw new Error("CRM started before Trello finished");
      }
      calls.crm += 1;
      crmArgs.push({ contact, extraArgs: rest.length });
      if (hooks.realCrm) return hooks.realCrm(contact);
      if (hooks.crm) return hooks.crm(contact);
      return SUCCESS_CRM;
    },
  };
  return { calls, crmArgs, overrides };
}

async function post(handle, body, ip) {
  const response = await route.handleContactPost(
    contactRequest(body, ip),
    handle.overrides,
  );
  return {
    status: response.status,
    json: await response.json(),
    calls: handle.calls,
    crmArgs: handle.crmArgs,
  };
}

async function silence(fn) {
  const logs = [];
  const original = console.error;
  console.error = (...args) => {
    logs.push(
      args.map((arg) => (arg instanceof Error ? `Error:${arg.message}` : arg)),
    );
  };
  try {
    const result = await fn();
    return { result, logs };
  } finally {
    console.error = original;
  }
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(label)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function assertDto(contact, expected) {
  const dto = crm.buildCrmLeadPayload(contact);
  assert.ok(dto);
  assert.deepEqual(Object.keys(dto).sort(), CRM_DTO_KEYS);
  assert.deepEqual(dto, expected);
  assert.deepEqual(Object.keys(contact).sort(), NORMALIZED_KEYS);
  const serialized = JSON.stringify(contact);
  for (const forbidden of [
    "serviceName",
    "category",
    "website",
    "gRecaptchaResponse",
    "utmTerm",
    "utmContent",
    "gclid",
    "must-not-reach-crm",
    "General Inquiry",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
  assert.equal(JSON.stringify(dto).includes("must-not-reach-crm"), false);
}

let savedEnv;

beforeEach(() => {
  savedEnv = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) delete process.env[key];
});

afterEach(() => {
  for (const [key, value] of savedEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("POST /api/contact contracts", { concurrency: false }, () => {
  test("happy path runs Trello, then overlaps staff email and CRM", async () => {
    let started = 0;
    let release = () => {};
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    function arrived() {
      started += 1;
      if (started === 2) release();
      return gate;
    }

    const handle = harness({
      notify: () => arrived(),
      crm: () => arrived().then(() => SUCCESS_CRM),
    });

    try {
      const { result, logs } = await silence(() =>
        withTimeout(
          post(handle, manualPayload()),
          1000,
          "staff email and CRM did not overlap after Trello",
        ),
      );
      assert.equal(started, 2);
      assert.equal(result.status, 200);
      assert.deepEqual(result.json, { ok: true });
      assert.equal(handle.calls.trello, 1);
      assert.equal(handle.calls.notify, 1);
      assert.equal(handle.calls.crm, 1);
      assert.equal(handle.crmArgs[0].extraArgs, 0);
      assert.equal(logs.length, 0);
    } finally {
      release();
    }
  });

  test("Trello failure returns 502 and does not call CRM or staff email", async () => {
    const handle = harness({
      trello: async () => {
        throw new Error("trello unavailable");
      },
    });
    const { result, logs } = await silence(() => post(handle, manualPayload()));
    assert.equal(result.status, 502);
    assert.deepEqual(result.json, {
      ok: false,
      error: TRELLO_FAILURE_MESSAGE,
    });
    assert.equal(handle.calls.trello, 1);
    assert.equal(handle.calls.notify, 0);
    assert.equal(handle.calls.crm, 0);
    assert.equal(logs.length, 1);
    assert.equal(logs[0][0], "[contact]");
    assert.equal(logs[0][1].event, "trello_board_email_failed");
    assert.equal(logs[0][1].error_class, "Error");
    assert.equal(JSON.stringify(logs).includes("trello unavailable"), false);
    assert.equal(JSON.stringify(logs).includes("DEVTEST"), false);
    assert.equal(
      JSON.stringify(logs).includes("devtest.patient@example.com"),
      false,
    );
  });

  test("CRM AUTH_FAILED still returns the Trello success response", async () => {
    const handle = harness({
      crm: async () => ({
        outcome: "failed",
        submissionId: "00000000-0000-4000-8000-000000000002",
        code: "AUTH_FAILED",
        leadId: null,
      }),
    });
    const { result, logs } = await silence(() => post(handle, manualPayload()));
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { ok: true });
    assert.equal(handle.calls.trello, 1);
    assert.equal(handle.calls.notify, 1);
    assert.equal(handle.calls.crm, 1);
    assert.equal(logs.length, 0);
  });

  test("CRM NETWORK failure still returns the Trello success response", async () => {
    const handle = harness({
      crm: async () => ({
        outcome: "failed",
        submissionId: "00000000-0000-4000-8000-000000000003",
        code: "NETWORK",
        leadId: null,
      }),
    });
    const result = await post(handle, manualPayload());
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { ok: true });
    assert.equal(handle.calls.trello, 1);
    assert.equal(handle.calls.crm, 1);
    assert.equal(handle.calls.notify, 1);
  });

  test("CRM timeout is contained and the route does not retry it", async () => {
    const handle = harness({
      crm: async () => ({
        outcome: "failed",
        submissionId: "00000000-0000-4000-8000-000000000004",
        code: "TIMEOUT",
        leadId: null,
      }),
    });
    const started = Date.now();
    const result = await post(handle, manualPayload());
    assert.ok(Date.now() - started < 1000);
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { ok: true });
    assert.equal(handle.calls.trello, 1);
    assert.equal(handle.calls.crm, 1);
    assert.equal(handle.calls.notify, 1);
  });

  test("staff email failure stays best-effort while CRM still runs", async () => {
    const handle = harness({
      notify: async () => {
        throw new Error("resend unavailable");
      },
      crm: async () => SUCCESS_CRM,
    });
    const { result, logs } = await silence(() => post(handle, manualPayload()));
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { ok: true });
    assert.equal(handle.calls.trello, 1);
    assert.equal(handle.calls.notify, 1);
    assert.equal(handle.calls.crm, 1);
    assert.equal(logs.length, 1);
    assert.equal(logs[0][0], "[contact]");
    assert.equal(logs[0][1].event, "staff_notification_email_failed");
    assert.equal(logs[0][1].error_class, "Error");
    assert.equal(JSON.stringify(logs).includes("resend unavailable"), false);
    assert.equal(JSON.stringify(logs).includes("DEVTEST"), false);
  });

  test("CRM stays disabled unless CRM_INGEST_ENABLED is exactly true", async () => {
    process.env.CRM_INGEST_URL = DEV_URL;
    process.env.CRM_INGEST_SECRET = "test-secret";
    const originalFetch = globalThis.fetch;
    let fetches = 0;
    globalThis.fetch = async () => {
      fetches += 1;
      throw new Error("CRM network should not be called");
    };

    try {
      for (const value of [undefined, "", "false", "FALSE", "1", "yes"]) {
        if (value === undefined) delete process.env.CRM_INGEST_ENABLED;
        else process.env.CRM_INGEST_ENABLED = value;
        const seen = [];
        const handle = harness({
          realCrm: async (contact) => {
            const result = await crm.ingestContactToCrm(contact);
            seen.push(result);
            return result;
          },
        });
        const response = await post(handle, manualPayload());
        assert.equal(response.status, 200, String(value));
        assert.deepEqual(response.json, { ok: true });
        assert.equal(handle.calls.trello, 1, String(value));
        assert.equal(handle.calls.notify, 1, String(value));
        assert.equal(handle.calls.crm, 1, String(value));
        assert.equal(seen[0].outcome, "skipped", String(value));
      }
      assert.equal(fetches, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("POST itself does not reach CRM when the Trello send throws", async () => {
    process.env.CRM_INGEST_ENABLED = "true";
    process.env.CRM_INGEST_URL = DEV_URL;
    process.env.CRM_INGEST_SECRET = "test-secret";
    const originalFetch = globalThis.fetch;
    let fetches = 0;
    globalThis.fetch = async () => {
      fetches += 1;
      throw new Error("CRM network should not be called");
    };
    try {
      const { result, logs } = await silence(async () => {
        const response = await route.POST(contactRequest(manualPayload()));
        return { status: response.status, json: await response.json() };
      });
      assert.equal(result.status, 502);
      assert.deepEqual(result.json, {
        ok: false,
        error: TRELLO_FAILURE_MESSAGE,
      });
      assert.equal(fetches, 0);
      assert.equal(logs[0][0], "[contact]");
      assert.equal(logs[0][1].event, "trello_board_email_failed");
      assert.equal(JSON.stringify(logs).includes("DEVTEST"), false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("manual Phase 7F payload maps to the CRM DTO", async () => {
    const handle = harness();
    const result = await post(handle, manualPayload());
    assert.equal(result.status, 200);
    assertDto(handle.crmArgs[0].contact, {
      first_name: "DEVTEST",
      last_name: "PATIENT",
      phone: "210-555-0100",
      email: "devtest.patient@example.com",
      appointment_reason: "General Urology",
      preferred_contact_method: "Email",
      preferred_contact_time: "Afternoon",
      sms_consent: false,
      message:
        "DEV TEST ONLY — Phase 7F integration validation. Do not contact.",
      page_name: "Patient Resources",
      source_path: "/patient-resources/contact-us",
      utm_source: "phase7f",
      utm_medium: "dev_test",
      utm_campaign: "crm_validation",
    });
  });

  test("Other reason, Other time, and sms yes map through the route", async () => {
    const handle = harness();
    const result = await post(
      handle,
      manualPayload({
        appointmentReason: "Other",
        otherAppointmentReason: "Night clinic question",
        bestTimeToReachMe: "Other",
        otherBestTimeToReachMe: "After six",
        smsConsent: "yes",
        pageName: "https://evil.example/admin?token=1",
        sourcePath:
          "https://evil.example/patient-resources/contact-us?secret=1&utm_source=phase7f#fragment",
      }),
    );
    assert.equal(result.status, 200);
    const dto = crm.buildCrmLeadPayload(handle.crmArgs[0].contact);
    assert.equal(dto.appointment_reason, "Night clinic question");
    assert.equal(dto.preferred_contact_time, "After six");
    assert.equal(dto.sms_consent, true);
    assert.equal(dto.page_name, "(not provided)");
    assert.equal(dto.source_path, "/patient-resources/contact-us");
    assert.equal(dto.utm_source, "phase7f");
    assert.equal(dto.utm_medium, "dev_test");
    assert.equal(dto.utm_campaign, "crm_validation");
    assert.deepEqual(Object.keys(dto).sort(), CRM_DTO_KEYS);
  });

  test("source_path drops a query string and keeps the pathname", async () => {
    const handle = harness();
    await post(
      handle,
      manualPayload({
        sourcePath:
          "/patient-resources/contact-us?utm_source=phase7f&utm_medium=dev_test&utm_campaign=crm_validation",
      }),
    );
    const dto = crm.buildCrmLeadPayload(handle.crmArgs[0].contact);
    assert.equal(dto.source_path, "/patient-resources/contact-us");
    assert.equal(dto.utm_source, "phase7f");
  });

  test("two independent submissions both reach CRM", async () => {
    const handle = harness();
    const first = await post(handle, manualPayload());
    const second = await post(
      handle,
      manualPayload({ message: "Second independent DEVTEST submission." }),
    );
    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.equal(handle.calls.trello, 2);
    assert.equal(handle.calls.crm, 2);
    assert.equal(handle.crmArgs[0].extraArgs, 0);
    assert.equal(handle.crmArgs[1].extraArgs, 0);
    assert.notEqual(
      handle.crmArgs[0].contact.message,
      handle.crmArgs[1].contact.message,
    );
  });

  test("honeypot rejects before Trello and CRM", async () => {
    const handle = harness();
    const result = await post(
      handle,
      manualPayload({ website: "https://spam.example" }),
    );
    assert.equal(result.status, 400);
    assert.deepEqual(result.json, {
      ok: false,
      error: GENERIC_VALIDATION_ERROR,
    });
    assert.equal(handle.calls.trello, 0);
    assert.equal(handle.calls.notify, 0);
    assert.equal(handle.calls.crm, 0);
  });

  test("invalid contact data does not call Trello or CRM", async () => {
    const handle = harness();
    const result = await post(handle, manualPayload({ firstName: "A" }));
    assert.equal(result.status, 400);
    assert.deepEqual(result.json, {
      ok: false,
      error: GENERIC_VALIDATION_ERROR,
    });
    assert.equal(handle.calls.trello, 0);
    assert.equal(handle.calls.crm, 0);
  });

  test("invalid JSON does not call Trello or CRM", async () => {
    const handle = harness();
    const result = await post(handle, "{");
    assert.equal(result.status, 400);
    assert.deepEqual(result.json, { ok: false, error: "Invalid JSON body" });
    assert.equal(handle.calls.trello, 0);
    assert.equal(handle.calls.crm, 0);
  });

  test("rate limit denies the request before Trello and CRM", async () => {
    const handle = harness({
      rateLimit: () => false,
    });
    const result = await post(handle, manualPayload());
    assert.equal(result.status, 429);
    assert.deepEqual(result.json, { ok: false, error: RATE_LIMIT_MESSAGE });
    assert.equal(handle.calls.trello, 0);
    assert.equal(handle.calls.notify, 0);
    assert.equal(handle.calls.crm, 0);
  });

  test("in-memory rate limit still allows 10 and blocks the 11th", () => {
    const ip = `203.0.113.${process.pid % 200}`;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      assert.equal(rateLimit.checkContactRateLimit(ip), true);
    }
    assert.equal(rateLimit.checkContactRateLimit(ip), false);
  });

  test("absent reCAPTCHA keys allow a local submission without verification", async () => {
    const handle = harness();
    handle.overrides.verifyRecaptchaResponse = async () => {
      throw new Error("verification should not run");
    };
    const result = await post(handle, manualPayload());
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { ok: true });
    assert.equal(handle.calls.trello, 1);
    assert.equal(handle.calls.crm, 1);
  });

  test("configured reCAPTCHA rejects an empty token before Trello", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "test-site";
    const originalFetch = globalThis.fetch;
    let fetches = 0;
    globalThis.fetch = async () => {
      fetches += 1;
      throw new Error("reCAPTCHA network should not be called for an empty token");
    };
    try {
      const handle = harness();
      const result = await post(handle, manualPayload());
      assert.equal(result.status, 400);
      assert.deepEqual(result.json, {
        ok: false,
        error: GENERIC_VALIDATION_ERROR,
      });
      assert.equal(handle.calls.trello, 0);
      assert.equal(handle.calls.crm, 0);
      assert.equal(fetches, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("failed reCAPTCHA verification does not call Trello or CRM", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "test-site";
    let verifyCalls = 0;
    const handle = harness();
    handle.overrides.verifyRecaptchaResponse = async () => {
      verifyCalls += 1;
      return false;
    };
    const result = await post(
      handle,
      manualPayload({ gRecaptchaResponse: "fake-token" }),
    );
    assert.equal(verifyCalls, 1);
    assert.equal(result.status, 400);
    assert.deepEqual(result.json, {
      ok: false,
      error: GENERIC_VALIDATION_ERROR,
    });
    assert.equal(handle.calls.trello, 0);
    assert.equal(handle.calls.crm, 0);
  });

  test("route source does not pass provider errors to console.error", () => {
    const source = readSource("app/api/contact/route.ts");
    assert.equal(
      source.includes('console.error("[contact] Trello board email failed", error)'),
      false,
    );
    assert.equal(
      source.includes(
        'console.error("[contact] Resend email failed", notificationResult.reason)',
      ),
      false,
    );
    assert.equal(source.includes("logContactProviderFailure("), true);
    assert.match(source, /from "@\/app\/lib\/contact-email"/);
    assert.match(source, /from "@\/app\/lib\/contact-crm"/);
    assert.equal(source.includes("NEXT_PUBLIC_CRM"), false);
  });

  test("raw provider errors are not passed to console.error", async () => {
    const sentinels = [
      "ZZPHI-NAME",
      "555-010-7777",
      "zzphi-patient@example.com",
      "ZZPHI-REASON",
      "ZZPHI-MESSAGE-BODY",
      "zzphi-board@example.com",
      "zzphi-staff@example.com",
      "re_zzphi_key",
      "zzphi-crm-secret",
      "zzphi-recaptcha-token",
      "zzphi-provider-response-body",
    ];
    const detail = sentinels.join(" ");

    function leakedError(statusCode) {
      const error = new Error(detail);
      error.statusCode = statusCode;
      error.body = "zzphi-provider-response-body";
      error.response = { text: detail };
      error.to = "zzphi-staff@example.com";
      error.apiKey = "re_zzphi_key";
      return error;
    }

    function containsSentinel(value) {
      if (typeof value === "string") {
        return sentinels.some((sentinel) => value.includes(sentinel));
      }
      if (value instanceof Error) return true;
      if (!value || typeof value !== "object") return false;
      return Object.values(value).some((item) => containsSentinel(item));
    }

    const logs = [];
    const original = console.error;
    console.error = (...args) => {
      logs.push(args);
    };

    try {
      const trello = harness({
        trello: async () => {
          throw leakedError(502);
        },
      });
      const trelloResult = await post(trello, manualPayload());
      assert.equal(trelloResult.status, 502);
      assert.deepEqual(trelloResult.json, {
        ok: false,
        error: TRELLO_FAILURE_MESSAGE,
      });
      assert.equal(trello.calls.notify, 0);
      assert.equal(trello.calls.crm, 0);

      const staff = harness({
        notify: async () => {
          throw leakedError(422);
        },
      });
      const staffResult = await post(staff, manualPayload());
      assert.equal(staffResult.status, 200);
      assert.deepEqual(staffResult.json, { ok: true });
      assert.equal(staff.calls.crm, 1);
    } finally {
      console.error = original;
    }

    assert.equal(logs.length, 2);
    assert.deepEqual(logs[0][1], {
      event: "trello_board_email_failed",
      error_class: "Error",
      http_status_class: "5xx",
    });
    assert.deepEqual(logs[1][1], {
      event: "staff_notification_email_failed",
      error_class: "Error",
      http_status_class: "4xx",
    });
    for (const entry of logs) {
      assert.equal(entry.length, 2);
      for (const arg of entry) {
        assert.equal(containsSentinel(arg), false);
      }
    }
  });
});
