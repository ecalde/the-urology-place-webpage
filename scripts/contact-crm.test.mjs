/**
 * Safe Phase 7C/7D checks for the website CRM client.
 * Fake data only. Does not call Trello, Resend, or Google.
 */
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { createServer } from "node:http";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_PATH = path.join(ROOT, "app/lib/contact-crm.ts");
const VALIDATION_PATH = path.join(ROOT, "app/lib/contact-validation.ts");
const DEFAULTS_PATH = path.join(ROOT, "app/lib/contact-form-defaults.ts");
const FORM_PATH = path.join(ROOT, "app/components/contact-form-fields.tsx");
const ROUTE_PATH = path.join(ROOT, "app/api/contact/route.ts");

const DEV_URL =
  "https://script.google.com/macros/s/TESTDEPLOYMENTID/exec";
const SECRET = "test-secret";
const SUBMISSION_ID = "00000000-0000-4000-8000-000000000000";
const LEAD_ID = "LEAD-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z");

const EXPECTED_CANONICAL =
  '{"appointment_reason":"General Urology","email":"fake@example.com","first_name":"Ada","last_name":"Lovelace","message":"","page_name":"Home","phone":"555-010-0000","preferred_contact_method":"Phone","preferred_contact_time":"Morning","sms_consent":false,"source_path":"/","utm_campaign":"","utm_medium":"","utm_source":""}';

const EXPECTED_SIGNING = [
  "1",
  "2026-01-01T00:00:00.000Z",
  SUBMISSION_ID,
  EXPECTED_CANONICAL,
].join("\n");

const EXPECTED_HMAC =
  "c4e5218a9ce5325190e307b957b9bcf7a90debe6fdda1f5f39431793cd298a8b";

const ENV_KEYS = [
  "CRM_INGEST_ENABLED",
  "CRM_INGEST_URL",
  "CRM_INGEST_SECRET",
  "CRM_INGEST_TIMEOUT_MS",
];

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}

function loadCrmModule() {
  const source = readFileSync(SOURCE_PATH, "utf8");
  assert.match(source, /import "server-only";/);
  const dir = mkdtempSync(path.join(tmpdir(), "contact-crm-test-"));
  const outfile = path.join(dir, "contact-crm.mjs");
  writeFileSync(outfile, transpile(source.replace('import "server-only";\n', "")));
  return import(pathToFileURL(outfile).href).finally(() => {
    rmSync(dir, { recursive: true, force: true });
  });
}

function loadValidationModule() {
  const defaultsSource = readFileSync(DEFAULTS_PATH, "utf8");
  const validationSource = readFileSync(VALIDATION_PATH, "utf8").replace(
    'from "@/app/lib/contact-form-defaults"',
    'from "./contact-form-defaults.mjs"',
  );
  const dir = mkdtempSync(path.join(tmpdir(), "contact-validation-test-"));
  writeFileSync(
    path.join(dir, "contact-form-defaults.mjs"),
    transpile(defaultsSource),
  );
  writeFileSync(
    path.join(dir, "contact-validation.mjs"),
    transpile(validationSource),
  );
  return import(
    pathToFileURL(path.join(dir, "contact-validation.mjs")).href
  ).finally(() => {
    rmSync(dir, { recursive: true, force: true });
  });
}

const crm = await loadCrmModule();
const validation = await loadValidationModule();

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
];

function fakeContact(overrides = {}) {
  return {
    firstName: "Ada",
    lastName: "Lovelace",
    phone: "555-010-0000",
    email: "fake@example.com",
    appointmentReasonFinal: "General Urology",
    bestWayToReachMe: "Phone",
    bestTimeToReachMeFinal: "Morning",
    message: "",
    smsConsent: "no",
    pageName: "Home",
    sourcePath: "/",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    ...overrides,
  };
}

function validRaw(overrides = {}) {
  return {
    firstName: "Ada",
    lastName: "Lovelace",
    phone: "555-010-0000",
    email: "fake@example.com",
    appointmentReason: "General Urology",
    bestWayToReachMe: "Phone",
    bestTimeToReachMe: "Morning",
    message: "",
    smsConsent: "no",
    pageName: "Home",
    sourcePath: "/",
    ...overrides,
  };
}

function normalizedFrom(overrides = {}) {
  const result = validation.validateAndNormalizeContact(validRaw(overrides));
  assert.equal(result.success, true);
  return result.data;
}

function enabledEnv(overrides = {}) {
  return {
    CRM_INGEST_ENABLED: "true",
    CRM_INGEST_URL: DEV_URL,
    CRM_INGEST_SECRET: SECRET,
    CRM_INGEST_TIMEOUT_MS: "15000",
    ...overrides,
  };
}

async function withEnv(values, fn) {
  const saved = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try {
    return await fn();
  } finally {
    for (const [key, value] of saved) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function capture(fn) {
  const lines = [];
  const originalError = console.error;
  const originalInfo = console.info;
  console.error = (...args) => {
    lines.push(args);
  };
  console.info = (...args) => {
    lines.push(args);
  };
  try {
    const result = await fn();
    return { result, text: JSON.stringify(lines) };
  } finally {
    console.error = originalError;
    console.info = originalInfo;
  }
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("canonical JSON sorts keys and preserves array order", () => {
  assert.equal(
    crm.canonicalJsonStringify({
      b: 1,
      a: { d: true, c: null },
      arr: [2, { z: 1, y: 2 }],
    }),
    '{"a":{"c":null,"d":true},"arr":[2,{"y":2,"z":1}],"b":1}',
  );
  assert.equal(
    crm.canonicalJsonStringify({ message: 'say "hi"' }),
    '{"message":"say \\"hi\\""}',
  );
});

test("HMAC matches the Phase 7B signing string", () => {
  const payload = crm.buildCrmLeadPayload(fakeContact());
  assert.equal(crm.canonicalJsonStringify(payload), EXPECTED_CANONICAL);
  const signing = crm.buildWebsiteIngestSigningString(
    1,
    "2026-01-01T00:00:00.000Z",
    SUBMISSION_ID,
    payload,
  );
  assert.equal(signing, EXPECTED_SIGNING);
  assert.equal(
    createHmac("sha256", SECRET).update(EXPECTED_SIGNING, "utf8").digest("hex"),
    EXPECTED_HMAC,
  );
  assert.equal(crm.hmacSha256Hex(signing, SECRET), EXPECTED_HMAC);
});

test("DTO maps validated website fields and leaves UTMs blank", () => {
  const payload = crm.buildCrmLeadPayload(fakeContact());
  assert.deepEqual(Object.keys(payload).sort(), CRM_DTO_KEYS);
  assert.equal(payload.sms_consent, false);
  assert.equal(payload.utm_source, "");
  assert.equal(payload.utm_medium, "");
  assert.equal(payload.utm_campaign, "");
  assert.equal("intake_source" in payload, false);

  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ smsConsent: "yes" })).sms_consent,
    true,
  );
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ bestWayToReachMe: "Text" }))
      .preferred_contact_method,
    "Text",
  );
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ bestWayToReachMe: "Email" }))
      .preferred_contact_method,
    "Email",
  );
  assert.equal(
    crm.buildCrmLeadPayload(
      fakeContact({ bestTimeToReachMeFinal: "(not specified)" }),
    ).preferred_contact_time,
    "(not specified)",
  );
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ bestWayToReachMe: "Fax" })),
    null,
  );
});

test("phase 7D field mapping uses fake data only", () => {
  const standardReason = normalizedFrom({
    appointmentReason: "Kidney Stones",
  });
  assert.equal(standardReason.appointmentReasonFinal, "Kidney Stones");
  assert.equal(
    crm.buildCrmLeadPayload(standardReason).appointment_reason,
    "Kidney Stones",
  );

  const otherReason = normalizedFrom({
    appointmentReason: "Other",
    otherAppointmentReason: "Second opinion",
  });
  assert.equal(otherReason.appointmentReasonFinal, "Second opinion");
  assert.notEqual(otherReason.appointmentReasonFinal, "Other");
  assert.equal(
    crm.buildCrmLeadPayload(otherReason).appointment_reason,
    "Second opinion",
  );

  const missingOtherReason = validation.validateAndNormalizeContact(
    validRaw({
      appointmentReason: "Other",
      otherAppointmentReason: " ",
    }),
  );
  assert.equal(missingOtherReason.success, false);

  const standardTime = normalizedFrom({ bestTimeToReachMe: "Afternoon" });
  assert.equal(standardTime.bestTimeToReachMeFinal, "Afternoon");
  assert.equal(
    crm.buildCrmLeadPayload(standardTime).preferred_contact_time,
    "Afternoon",
  );

  const otherTime = normalizedFrom({
    bestTimeToReachMe: "Other",
    otherBestTimeToReachMe: "After 6pm",
  });
  assert.equal(otherTime.bestTimeToReachMeFinal, "After 6pm");
  assert.notEqual(otherTime.bestTimeToReachMeFinal, "Other");
  assert.equal(
    crm.buildCrmLeadPayload(otherTime).preferred_contact_time,
    "After 6pm",
  );

  const missingOtherTime = validation.validateAndNormalizeContact(
    validRaw({
      bestTimeToReachMe: "Other",
      otherBestTimeToReachMe: "",
    }),
  );
  assert.equal(missingOtherTime.success, false);

  const unspecifiedTime = normalizedFrom({ bestTimeToReachMe: "" });
  assert.equal(unspecifiedTime.bestTimeToReachMeFinal, "(not specified)");

  for (const method of ["Phone", "Text", "Email"]) {
    const contact = normalizedFrom({ bestWayToReachMe: method });
    const payload = crm.buildCrmLeadPayload(contact);
    assert.equal(payload.preferred_contact_method, method);
  }

  const lowerMethod = validation.validateAndNormalizeContact(
    validRaw({ bestWayToReachMe: "phone" }),
  );
  assert.equal(lowerMethod.success, false);
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ bestWayToReachMe: "phone" })),
    null,
  );
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ bestWayToReachMe: "Fax" })),
    null,
  );

  const smsYes = normalizedFrom({ smsConsent: " YES " });
  assert.equal(smsYes.smsConsent, "yes");
  assert.equal(crm.buildCrmLeadPayload(smsYes).sms_consent, true);

  const smsNo = normalizedFrom({ smsConsent: "no" });
  assert.equal(smsNo.smsConsent, "no");
  assert.equal(crm.buildCrmLeadPayload(smsNo).sms_consent, false);

  const badSms = validation.validateAndNormalizeContact(
    validRaw({ smsConsent: "maybe" }),
  );
  assert.equal(badSms.success, false);
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ smsConsent: "maybe" })),
    null,
  );
  assert.equal(
    crm.buildCrmLeadPayload(fakeContact({ smsConsent: "true" })),
    null,
  );

  const attributed = normalizedFrom({
    pageName: "Kidney Stones",
    sourcePath: "/men/kidney-stones",
    message: "Please ignore https://evil.example/secret?token=1",
    serviceName: "Kidney Stones",
    category: "Men",
  });
  assert.equal(attributed.pageName, "Kidney Stones");
  assert.equal(attributed.sourcePath, "/men/kidney-stones");
  assert.equal(attributed.serviceName, undefined);
  assert.equal(attributed.category, undefined);
  assert.equal(attributed.message.includes("https://evil.example"), true);

  const dirtyPath = normalizedFrom({
    pageName: "https://evil.example/phish?token=1",
    sourcePath:
      "https://user:pass@example.com/men/vasectomy?utm_source=google&secret=1#form",
  });
  assert.equal(dirtyPath.pageName, "(not provided)");
  assert.equal(dirtyPath.sourcePath, "/men/vasectomy");

  const queryPath = normalizedFrom({
    sourcePath: "/men/hematuria?utm_source=newsletter#contact",
  });
  assert.equal(queryPath.sourcePath, "/men/hematuria");

  const encodedQuery = normalizedFrom({
    sourcePath: "/patient-resources/contact-us%3Ftoken%3Dsecret",
  });
  assert.equal(encodedQuery.sourcePath, "/patient-resources/contact-us");

  const slashLabel = normalizedFrom({
    pageName: "PSA / Transperineal Prostate Biopsy",
    sourcePath: "/men/prostate-cancer/psa-transperineal-prostate-biopsy",
  });
  assert.equal(slashLabel.pageName, "PSA / Transperineal Prostate Biopsy");
  assert.equal(
    slashLabel.sourcePath,
    "/men/prostate-cancer/psa-transperineal-prostate-biopsy",
  );

  const homePath = normalizedFrom({ sourcePath: "/" });
  assert.equal(homePath.sourcePath, "/");

  const blankAttribution = normalizedFrom({
    pageName: "   ",
    sourcePath: "",
  });
  assert.equal(blankAttribution.pageName, "(not provided)");
  assert.equal(blankAttribution.sourcePath, "(not provided)");

  const noUtm = normalizedFrom();
  assert.equal(noUtm.utmSource, "");
  assert.equal(noUtm.utmMedium, "");
  assert.equal(noUtm.utmCampaign, "");
  const blankUtmPayload = crm.buildCrmLeadPayload(noUtm);
  assert.equal(blankUtmPayload.utm_source, "");
  assert.equal(blankUtmPayload.utm_medium, "");
  assert.equal(blankUtmPayload.utm_campaign, "");

  const withUtm = normalizedFrom({
    utmSource: "  google  ",
    utmMedium: "cpc",
    utmCampaign: `spring-${"x".repeat(300)}`,
  });
  assert.equal(withUtm.utmSource, "google");
  assert.equal(withUtm.utmMedium, "cpc");
  assert.equal(withUtm.utmCampaign.length, 200);
  const utmPayload = crm.buildCrmLeadPayload({
    ...withUtm,
    serviceName: "Do not copy",
    category: "Do not copy",
    intake_source: "Website",
    lead_id: "LEAD-should-not-copy",
  });
  assert.deepEqual(Object.keys(utmPayload).sort(), CRM_DTO_KEYS);
  assert.equal(utmPayload.utm_source, "google");
  assert.equal(utmPayload.utm_medium, "cpc");
  assert.equal(utmPayload.utm_campaign, withUtm.utmCampaign);
  assert.equal(Object.hasOwn(utmPayload, "serviceName"), false);
  assert.equal(Object.hasOwn(utmPayload, "category"), false);
  assert.equal(Object.hasOwn(utmPayload, "intake_source"), false);
  assert.equal(Object.hasOwn(utmPayload, "lead_id"), false);

  const picked = validation.readSubmissionPageUtms(
    "?utm_source=newsletter&utm_medium=email&utm_campaign=spring&gclid=secret&email=fake@example.com",
  );
  assert.deepEqual(picked, {
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "spring",
  });
  assert.equal(Object.hasOwn(picked, "gclid"), false);
  assert.equal(Object.hasOwn(picked, "email"), false);
  assert.deepEqual(validation.readSubmissionPageUtms(""), {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
  });

  const form = readFileSync(FORM_PATH, "utf8");
  assert.equal(
    form.includes("readSubmissionPageUtms(window.location.search)"),
    true,
  );
  assert.equal(form.includes("utmSource: submissionUtms.utmSource"), true);
  assert.equal(form.includes("...normalizedContact"), false);
  assert.equal(form.includes("...searchParams"), false);
});

test("CRM disabled does not call the network", async () => {
  let calls = 0;
  const { result, text } = await capture(() =>
    withEnv(enabledEnv({ CRM_INGEST_ENABLED: "false" }), () =>
      crm.ingestContactToCrm(fakeContact(), {
        fetchImpl() {
          calls += 1;
          throw new Error("should not be called");
        },
      }),
    ),
  );
  assert.equal(result.outcome, "skipped");
  assert.equal(calls, 0);
  assert.equal(text.includes("[contact] crm"), false);
});

test("non-true flag values skip CRM", async () => {
  const { result } = await capture(() =>
    withEnv(enabledEnv({ CRM_INGEST_ENABLED: "True" }), () =>
      crm.ingestContactToCrm(fakeContact(), {
        fetchImpl() {
          throw new Error("should not be called");
        },
      }),
    ),
  );
  assert.equal(result.outcome, "skipped");
});

test("enabled with a valid mock returns ok only when the JSON says so", async () => {
  const requests = [];
  const { result, text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        now: () => FIXED_NOW,
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl(url, init) {
          requests.push({ url, init });
          return jsonResponse(200, {
            ok: true,
            version: 1,
            lead_id: LEAD_ID,
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, DEV_URL);
  assert.equal(requests[0].init.method, "POST");
  assert.equal(requests[0].init.redirect, "follow");
  assert.equal(requests[0].init.cache, "no-store");
  assert.equal(requests[0].init.headers["Content-Type"], "application/json");

  const envelope = JSON.parse(requests[0].init.body);
  assert.equal(envelope.version, 1);
  assert.equal(envelope.submission_id, SUBMISSION_ID);
  assert.equal(envelope.signature, EXPECTED_HMAC);
  assert.equal(envelope.payload.intake_source, undefined);
  assert.equal(result.outcome, "success");
  assert.equal(result.leadId, LEAD_ID);
  assert.equal(text.includes(SECRET), false);
  assert.equal(text.includes(EXPECTED_HMAC), false);
  assert.equal(text.includes("Ada"), false);
  assert.equal(text.includes("fake@example.com"), false);
  assert.equal(text.includes("555-010-0000"), false);
  assert.equal(text.includes("script.google.com"), false);
  assert.equal(text.includes(LEAD_ID), true);
  assert.equal(text.includes(SUBMISSION_ID), true);
});

test("HTTP 200 with ok false is a CRM failure", async () => {
  const { result } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        now: () => FIXED_NOW,
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          return jsonResponse(200, {
            ok: false,
            version: 1,
            code: "INGEST_FAILED",
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(result.outcome, "failed");
  assert.equal(result.code, "INGEST_FAILED");
});

test("AUTH_FAILED stays a secondary failure and is not retried", async () => {
  let calls = 0;
  const { result, text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return jsonResponse(200, {
            ok: false,
            version: 1,
            code: "AUTH_FAILED",
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(result.outcome, "failed");
  assert.equal(result.code, "AUTH_FAILED");
  assert.equal(text.includes(SECRET), false);
  assert.equal(text.includes("AUTH_FAILED"), true);
});

test("IDEMPOTENCY_CONFLICT is recognized and is not retried", async () => {
  let calls = 0;
  const { result, text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return jsonResponse(200, {
            ok: false,
            version: 1,
            code: "IDEMPOTENCY_CONFLICT",
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(result.outcome, "failed");
  assert.equal(result.code, "IDEMPOTENCY_CONFLICT");
  assert.equal(result.leadId, null);
  assert.equal(text.includes("IDEMPOTENCY_CONFLICT"), true);
  assert.equal(text.includes("sha256:"), false);
  assert.equal(text.includes(EXPECTED_CANONICAL), false);
});

test("a replayed success stays one success response", async () => {
  let calls = 0;
  const { result, text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return jsonResponse(200, {
            ok: true,
            version: 1,
            lead_id: LEAD_ID,
            submission_id: SUBMISSION_ID,
            replayed: true,
          });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(result.outcome, "success");
  assert.equal(result.leadId, LEAD_ID);
  assert.equal(result.replayed, true);
  assert.equal(text.includes('"replayed":true'), true);
  assert.equal(text.includes(EXPECTED_CANONICAL), false);
});

test("LOCK_TIMEOUT and HTTP 503 are not retried", async () => {
  let calls = 0;
  const locked = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return jsonResponse(200, {
            ok: false,
            version: 1,
            code: "LOCK_TIMEOUT",
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(locked.result.code, "LOCK_TIMEOUT");

  calls = 0;
  const unavailable = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return new Response("", { status: 503 });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(unavailable.result.outcome, "failed");
  assert.equal(unavailable.result.code, "INVALID_RESPONSE");
});

test("payload fingerprint spec is sha256 of submission id and canonical payload", () => {
  const material = `${SUBMISSION_ID}\n${EXPECTED_CANONICAL}`;
  assert.equal(
    createHash("sha256").update(material, "utf8").digest("hex"),
    "8d0260e63256f4d533fe150db059cacedcbd9f36838292536614369c92e366bf",
  );

  const gs = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
  assert.equal(gs.includes("function setupWebsiteIngestLedger()"), true);
  assert.equal(gs.includes('WEBSITE_INGEST_FINGERPRINT_PREFIX_'), true);
  assert.equal(gs.includes('"sha256:"'), true);
  assert.equal(gs.includes("String(submissionId) +"), true);
  assert.equal(gs.includes("IDEMPOTENCY_CONFLICT"), true);
  assert.equal(gs.includes("CRM_INGEST_DEV_FAIL_POINT"), true);
  assert.equal(gs.includes("before_initialize"), true);
  assert.equal(gs.includes("after_lead_id"), true);
  assert.equal(gs.includes("WebsiteIngestLedger"), true);
  assert.equal(gs.includes("options.leadId"), true);
  assert.equal(gs.includes("postCrmIngestRequest"), false);
  const client = readFileSync(path.join(ROOT, "app/lib/contact-crm.ts"), "utf8");
  assert.equal((client.match(/await postCrmIngestRequest\(/g) || []).length, 1);
});

test("PARTIAL_COMMIT is not retried", async () => {
  let calls = 0;
  const { result, text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return jsonResponse(200, {
            ok: false,
            version: 1,
            code: "PARTIAL_COMMIT",
            lead_id: LEAD_ID,
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(result.outcome, "failed");
  assert.equal(result.code, "PARTIAL_COMMIT");
  assert.equal(result.leadId, LEAD_ID);
  assert.equal(text.includes("Ada"), false);
});

test("invalid URL or missing secret does not call Google", async () => {
  let calls = 0;
  const fetchImpl = () => {
    calls += 1;
    throw new Error("should not be called");
  };

  const invalidUrl = await capture(() =>
    withEnv(
      enabledEnv({ CRM_INGEST_URL: "https://evil.example/exec" }),
      () =>
        crm.ingestContactToCrm(fakeContact(), {
          createSubmissionId: () => SUBMISSION_ID,
          fetchImpl,
        }),
    ),
  );
  assert.equal(invalidUrl.result.code, "CONFIG_URL_INVALID");
  assert.equal(invalidUrl.text.includes("evil.example"), false);

  const missingSecret = await capture(() =>
    withEnv(enabledEnv({ CRM_INGEST_SECRET: "   " }), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl,
      }),
    ),
  );
  assert.equal(missingSecret.result.code, "CONFIG_SECRET_MISSING");
  assert.equal(calls, 0);
});

test("network errors stay contained", async () => {
  const { result, text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          throw new Error("connect ECONNREFUSED 203.0.113.10");
        },
      }),
    ),
  );
  assert.equal(result.outcome, "failed");
  assert.equal(result.code, "NETWORK");
  assert.equal(text.includes("ECONNREFUSED"), false);
  assert.equal(text.includes("203.0.113.10"), false);
  assert.equal(text.includes(DEV_URL), false);
});

test("timeout aborts without throwing", async () => {
  const { result, text } = await capture(() =>
    withEnv(enabledEnv({ CRM_INGEST_TIMEOUT_MS: "1000" }), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl(_url, init) {
          return new Promise((_resolve, reject) => {
            const abort = () => {
              const error = new Error("The operation was aborted");
              error.name = "AbortError";
              reject(error);
            };
            if (init.signal.aborted) {
              abort();
              return;
            }
            init.signal.addEventListener("abort", abort, { once: true });
          });
        },
      }),
    ),
  );
  assert.equal(result.outcome, "failed");
  assert.equal(result.code, "TIMEOUT");
  assert.equal(text.includes("aborted"), false);
  assert.equal(text.includes(DEV_URL), false);
});

test("invalid timeout falls back and still sends once", async () => {
  let calls = 0;
  const { result, text } = await capture(() =>
    withEnv(enabledEnv({ CRM_INGEST_TIMEOUT_MS: "50" }), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          calls += 1;
          return jsonResponse(200, {
            ok: true,
            version: 1,
            lead_id: LEAD_ID,
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(calls, 1);
  assert.equal(result.outcome, "success");
  assert.equal(text.includes("timeout_fallback"), true);
});

test("non-JSON and unknown codes do not leak the body", async () => {
  const html = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          return new Response("<html>Ada fake@example.com</html>", {
            status: 200,
          });
        },
      }),
    ),
  );
  assert.equal(html.result.code, "INVALID_RESPONSE");
  assert.equal(html.text.includes("Ada"), false);
  assert.equal(html.text.includes("fake@example.com"), false);

  const unknown = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          return jsonResponse(200, { ok: false, code: "PATIENT_SECRET_CODE" });
        },
      }),
    ),
  );
  assert.equal(unknown.result.code, "UNRECOGNIZED_CODE");
  assert.equal(unknown.text.includes("PATIENT_SECRET_CODE"), false);
});

test("unsafe lead ids are not logged", async () => {
  const { text } = await capture(() =>
    withEnv(enabledEnv(), () =>
      crm.ingestContactToCrm(fakeContact(), {
        createSubmissionId: () => SUBMISSION_ID,
        fetchImpl() {
          return jsonResponse(200, {
            ok: true,
            version: 1,
            lead_id: "LEAD-Ada Lovelace",
            submission_id: SUBMISSION_ID,
          });
        },
      }),
    ),
  );
  assert.equal(text.includes("Ada"), false);
  assert.equal(text.includes("lead_id"), false);
});

test("302 from Apps Script is followed with GET, not a second POST", async () => {
  const hits = [];
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    hits.push({ method: req.method, url: req.url, bodyLength: body.length });
    const port = server.address().port;
    if (req.url === "/exec" && req.method === "POST") {
      res.writeHead(302, {
        Location: `http://127.0.0.1:${port}/done`,
      });
      res.end();
      return;
    }
    if (req.url === "/done" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          version: 1,
          lead_id: LEAD_ID,
          submission_id: SUBMISSION_ID,
        }),
      );
      return;
    }
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("unexpected");
  });

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  try {
    const port = server.address().port;
    const result = await crm.postCrmIngestRequest(
      `http://127.0.0.1:${port}/exec`,
      JSON.stringify({ version: 1 }),
      5000,
    );
    assert.equal(result.delivered, true);
    assert.equal(result.httpStatus, 200);
    assert.equal(JSON.parse(result.bodyText).ok, true);
    assert.deepEqual(
      hits.map((hit) => hit.method),
      ["POST", "GET"],
    );
    assert.equal(hits[0].url, "/exec");
    assert.ok(hits[0].bodyLength > 0);
    assert.equal(hits[1].url, "/done");
    assert.equal(hits[1].bodyLength, 0);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("route calls CRM only after the Trello failure return", () => {
  const route = readFileSync(ROUTE_PATH, "utf8");
  const trello = route.indexOf("await effects.sendTrelloBoardEmail");
  const failure = route.indexOf("status: 502");
  const crmCall = route.indexOf("effects.ingestContactToCrm(normalized)");
  assert.ok(trello !== -1 && failure !== -1 && crmCall !== -1);
  assert.ok(trello < failure && failure < crmCall);
  assert.match(
    route,
    /export async function POST\(request: Request\) \{\s*return handleContactPost\(request\);\s*\}/,
  );
  assert.equal(route.includes("AUTH_FAILED"), false);
  assert.equal(route.includes("PARTIAL_COMMIT"), false);
  assert.equal(route.includes("NEXT_PUBLIC_CRM"), false);
  assert.equal(route.includes('runtime = "nodejs"'), true);
});

test("CRM secrets are not exposed as public env names", () => {
  const files = [
    path.join(ROOT, "app/lib/contact-crm.ts"),
    path.join(ROOT, "app/api/contact/route.ts"),
    path.join(ROOT, ".env.example"),
    path.join(ROOT, "package.json"),
  ];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(text.includes("NEXT_PUBLIC_CRM"), false, file);
  }

  const example = readFileSync(path.join(ROOT, ".env.example"), "utf8");
  assert.match(example, /^CRM_INGEST_ENABLED=false$/m);
  assert.match(
    example,
    /^CRM_INGEST_SECRET=replace-with-apps-script-dev-secret$/m,
  );
  assert.match(example, /^CRM_INGEST_TIMEOUT_MS=15000$/m);
  assert.equal(example.includes("YOUR_DEV_DEPLOYMENT_ID"), true);
});

function extractGsFunction(source, name) {
  const signature = `function ${name}(`;
  const start = source.indexOf(signature);
  assert.notEqual(start, -1, name);
  let cursor = start + signature.length;
  let parens = 1;
  while (cursor < source.length && parens > 0) {
    const char = source[cursor];
    if (char === "(") parens += 1;
    else if (char === ")") parens -= 1;
    cursor += 1;
  }
  const open = source.indexOf("{", cursor);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`unbalanced ${name}`);
}

test("supplied leadId fails closed and the concurrency wrapper takes no arguments", () => {
  const gs = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
  const patternStart = gs.indexOf("const WEBSITE_INGEST_LEAD_ID_PATTERN_ =");
  const patternEnd = gs.indexOf(";", patternStart);
  const pattern = new Function(
    `${gs.slice(patternStart, patternEnd + 1)}\nreturn WEBSITE_INGEST_LEAD_ID_PATTERN_;`,
  )();
  const generated = [];
  const resolve = new Function(
    "generateSystemId_",
    "WEBSITE_INGEST_LEAD_ID_PATTERN_",
    `${extractGsFunction(gs, "resolveInitializeLeadId_")}\nreturn resolveInitializeLeadId_;`,
  )((prefix) => {
    const id = `${prefix}-generated-${generated.length}`;
    generated.push(prefix);
    return id;
  }, pattern);

  assert.equal(resolve(undefined), "LEAD-generated-0");
  assert.equal(resolve({}), "LEAD-generated-1");
  assert.equal(resolve({ source: "Employee" }), "LEAD-generated-2");
  assert.deepEqual(generated, ["LEAD", "LEAD", "LEAD"]);

  const supplied = "LEAD-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  assert.equal(pattern.test(supplied), true);
  assert.equal(resolve({ leadId: `  ${supplied}  ` }), supplied);
  assert.equal(generated.length, 3);

  for (const bad of ["", "   ", "LEAD-not-a-uuid", null]) {
    assert.throws(
      () => resolve({ leadId: bad }),
      /options\.leadId is not a valid system lead id\./,
    );
  }
  assert.equal(generated.length, 3);

  const init = extractGsFunction(gs, "initializeLeadRow_");
  const resolveAt = init.indexOf("resolveInitializeLeadId_(options)");
  const writeAt = init.indexOf(
    'setCellByHeader_(sheet, row, headerMap, "lead_id", leadId)',
  );
  assert.ok(resolveAt !== -1 && writeAt > resolveAt);
  assert.equal(init.includes("generateSystemId_"), false);

  const wrapper = extractGsFunction(
    gs,
    "devRunWebsiteIngestHttpConcurrencyTestFromProperty",
  );
  assert.match(
    wrapper,
    /function devRunWebsiteIngestHttpConcurrencyTestFromProperty\(\)/,
  );
  assert.match(wrapper, /requireWebsiteIngestDev_\(/);
  assert.match(
    wrapper,
    /getProperty\(\s*WEBSITE_INGEST_DEV_WEB_APP_URL_PROPERTY_/,
  );
  assert.match(
    wrapper,
    /devRunWebsiteIngestHttpConcurrencyTest\(\s*url\s*\)/,
  );
  assert.equal(wrapper.includes("postData"), false);
  assert.equal(wrapper.includes("console."), false);
  assert.equal(wrapper.includes("CRM_INGEST_HMAC_SECRET"), false);
  assert.equal(gs.includes('"CRM_INGEST_DEV_WEB_APP_URL"'), true);
  assert.match(
    extractGsFunction(gs, "devRunWebsiteIngestHttpConcurrencyTest"),
    /function devRunWebsiteIngestHttpConcurrencyTest\(\s*webAppUrl\s*\)/,
  );
});

test("ingest env label fails closed and dev fail points stay off outside dev", () => {
  const gs = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
  assert.equal(gs.includes("const WEBSITE_INGEST_ENV_LABEL_ ="), false);
  assert.equal(gs.includes('"CRM_INGEST_ENV_LABEL"'), true);

  const loaded = new Function(
    `${gs.slice(gs.indexOf("const WEBSITE_INGEST_ENV_LABEL_PROPERTY_"), gs.indexOf(";", gs.indexOf("const WEBSITE_INGEST_ENV_LABEL_PROPERTY_")) + 1)}
${gs.slice(gs.indexOf("const WEBSITE_INGEST_DEV_FAIL_PROPERTY_"), gs.indexOf(";", gs.indexOf("const WEBSITE_INGEST_DEV_FAIL_PROPERTY_")) + 1)}
${extractGsFunction(gs, "websiteIngestEnvLabel_")}
${extractGsFunction(gs, "maybeWebsiteIngestDevFail_")}
return { websiteIngestEnvLabel_, maybeWebsiteIngestDevFail_ };`,
  )();

  function withProps(map, fn) {
    const previous = globalThis.PropertiesService;
    globalThis.PropertiesService = {
      getScriptProperties() {
        return {
          getProperty(key) {
            if (map && Object.prototype.hasOwnProperty.call(map, key)) {
              return map[key];
            }
            return null;
          },
        };
      },
    };
    try {
      return fn();
    } finally {
      if (previous === undefined) delete globalThis.PropertiesService;
      else globalThis.PropertiesService = previous;
    }
  }

  assert.equal(
    withProps({ CRM_INGEST_ENV_LABEL: "dev" }, () => loaded.websiteIngestEnvLabel_()),
    "dev",
  );
  assert.equal(
    withProps({ CRM_INGEST_ENV_LABEL: " prod " }, () => loaded.websiteIngestEnvLabel_()),
    "prod",
  );
  assert.equal(
    withProps({ CRM_INGEST_ENV_LABEL: "DEV" }, () => loaded.websiteIngestEnvLabel_()),
    "dev",
  );
  for (const value of [undefined, "", "development", "production", "prod\nextra"]) {
    const map = value === undefined ? {} : { CRM_INGEST_ENV_LABEL: value };
    assert.equal(withProps(map, () => loaded.websiteIngestEnvLabel_()), "", String(value));
  }
  assert.equal(
    withProps(null, () => {
      globalThis.PropertiesService = {
        getScriptProperties() {
          throw new Error("properties unavailable");
        },
      };
      return loaded.websiteIngestEnvLabel_();
    }),
    "",
  );

  function expectNoFail(map, point) {
    assert.doesNotThrow(() =>
      withProps(map, () => loaded.maybeWebsiteIngestDevFail_(point)),
    );
  }

  expectNoFail(
    { CRM_INGEST_ENV_LABEL: "prod", CRM_INGEST_DEV_FAIL_POINT: "before_initialize" },
    "before_initialize",
  );
  expectNoFail(
    { CRM_INGEST_ENV_LABEL: "prod", CRM_INGEST_DEV_FAIL_POINT: "after_lead_id" },
    "after_lead_id",
  );
  expectNoFail(
    { CRM_INGEST_DEV_FAIL_POINT: "before_initialize" },
    "before_initialize",
  );
  expectNoFail(
    { CRM_INGEST_ENV_LABEL: "development", CRM_INGEST_DEV_FAIL_POINT: "before_initialize" },
    "before_initialize",
  );
  expectNoFail({ CRM_INGEST_ENV_LABEL: "dev" }, "before_initialize");
  expectNoFail(
    { CRM_INGEST_ENV_LABEL: "dev", CRM_INGEST_DEV_FAIL_POINT: "after_lead_id" },
    "before_initialize",
  );

  const thrown = withProps(
    { CRM_INGEST_ENV_LABEL: "dev", CRM_INGEST_DEV_FAIL_POINT: "before_initialize" },
    () => {
      try {
        loaded.maybeWebsiteIngestDevFail_("before_initialize");
        return null;
      } catch (error) {
        return error;
      }
    },
  );
  assert.ok(thrown);
  assert.equal(thrown.message, "DEV_FAIL");
  assert.equal(thrown.websiteIngestDevFail, "before_initialize");

  const doPost = extractGsFunction(gs, "doPost");
  const doGet = extractGsFunction(gs, "doGet");
  assert.equal(doPost.includes("e.parameter"), false);
  assert.equal(doPost.includes("CRM_INGEST_DEV_FAIL"), false);
  assert.equal(doPost.includes("websiteIngestEnvLabel_"), true);
  assert.equal(doGet.includes("devRun"), false);
  assert.equal(doGet.includes("devAssert"), false);
  assert.equal(doGet.includes("devCleanup"), false);
  assert.equal(doGet.includes("devInspect"), false);
  assert.equal(doPost.includes("devRun"), false);

  for (const name of [
    "devRunWebsiteIngestSelfTest",
    "devAssertInitializeLeadIdFailClosed",
    "devRunWebsiteIngestIdempotencyTests",
    "devRunWebsiteIngestHttpConcurrencyTest",
    "devRunWebsiteIngestHttpConcurrencyTestFromProperty",
    "devWithFailPoint_",
    "devCleanupWebsiteIngestSubmission_",
  ]) {
    assert.match(extractGsFunction(gs, name), /requireWebsiteIngestDev_\(/, name);
  }
  assert.match(
    extractGsFunction(gs, "devInspectWebsiteIngestSubmission"),
    /DEV_ONLY/,
  );
  const failHook = extractGsFunction(gs, "maybeWebsiteIngestDevFail_");
  assert.equal(failHook.includes("e.parameter"), false);
  assert.equal(failHook.includes("postData"), false);
  assert.match(failHook, /getScriptProperties\(\)/);
});
