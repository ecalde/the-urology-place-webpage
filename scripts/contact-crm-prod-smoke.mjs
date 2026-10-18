/**
 * Fake production CRM smoke test.
 * Posts one signed lead directly to an Apps Script /exec URL.
 * Does not call /api/contact, Trello, or staff email.
 * Does not load .env files into the process environment.
 * Refuses to run unless --confirm-production is present.
 * Refuses if the URL or secret matches a local DEV env file.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const CONFIRM_FLAG = "--confirm-production";
const SELF_TEST_FLAG = "--self-test";
const EXEC_URL_RE = /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
const LEAD_ID_RE =
  /^LEAD-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUBMISSION_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_CODE_RE = /^[A-Z0-9_]{1,40}$/;

const FAKE_CONTACT = {
  firstName: "Fake",
  lastName: "ProdSmoke",
  phone: "555-010-0198",
  email: "fake-crm-prodstest@example.com",
  appointmentReasonFinal: "General Urology",
  bestWayToReachMe: "Email",
  bestTimeToReachMeFinal: "Morning",
  message: "Phase 7G production smoke test. Not a patient.",
  smsConsent: "no",
  pageName: "PROD smoke",
  sourcePath: "/prod-crm-smoke",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
};

function isExecUrl(raw) {
  if (!raw) return false;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  if (url.hostname !== "script.google.com") return false;
  if (url.port !== "" && url.port !== "443") return false;
  if (url.search || url.hash) return false;
  return EXEC_URL_RE.test(url.pathname);
}

function timeoutMs(raw) {
  if (raw === undefined || String(raw).trim() === "") return 15000;
  const parsed = Number(String(raw).trim());
  if (!Number.isInteger(parsed) || parsed < 1000 || parsed > 30000) {
    return 15000;
  }
  return parsed;
}

function readDevMarkers() {
  const urls = [];
  const secrets = [];
  for (const name of [".env", ".env.local"]) {
    const file = path.join(ROOT, name);
    if (!existsSync(file)) continue;
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      return { ok: false, urls, secrets };
    }
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key === "CRM_INGEST_URL" && value) urls.push(value);
      if (key === "CRM_INGEST_SECRET" && value) secrets.push(value);
    }
  }
  return { ok: true, urls, secrets };
}

function classifyInvocation({ confirm, env, markers }) {
  if (!confirm) {
    return { action: "skip", code: "CONFIRMATION_REQUIRED", exitCode: 0 };
  }
  const url = String(env.CRM_INGEST_URL ?? "").trim();
  const secret = String(env.CRM_INGEST_SECRET ?? "").trim();
  if (!isExecUrl(url)) {
    return { action: "skip", code: "CONFIG_URL_INVALID", exitCode: 1 };
  }
  if (!secret) {
    return { action: "skip", code: "CONFIG_SECRET_MISSING", exitCode: 1 };
  }
  if (!markers.ok) {
    return { action: "skip", code: "DEV_MARKER_UNREADABLE", exitCode: 1 };
  }
  if (markers.urls.includes(url)) {
    return { action: "skip", code: "DEV_URL_REFUSED", exitCode: 1 };
  }
  if (markers.secrets.includes(secret)) {
    return { action: "skip", code: "DEV_SECRET_REFUSED", exitCode: 1 };
  }
  return { action: "send", url, secret };
}

function emptyResult(code) {
  return {
    outcome: code === "CONFIRMATION_REQUIRED" ? "skipped" : "failed",
    code,
    submission_id: null,
    lead_id: null,
    environment: null,
    state: null,
    replayed: false,
  };
}

function safeParsedResult(parsed, fallbackSubmissionId) {
  const environment =
    parsed && (parsed.environment === "dev" || parsed.environment === "prod")
      ? parsed.environment
      : null;
  const state = parsed && parsed.state === "SUCCESS" ? "SUCCESS" : null;
  const leadId =
    parsed && typeof parsed.lead_id === "string" && LEAD_ID_RE.test(parsed.lead_id)
      ? parsed.lead_id
      : null;
  const submissionFromBody =
    parsed &&
    typeof parsed.submission_id === "string" &&
    SUBMISSION_ID_RE.test(parsed.submission_id)
      ? parsed.submission_id
      : null;
  const submissionId = submissionFromBody
    ? submissionFromBody
    : SUBMISSION_ID_RE.test(fallbackSubmissionId)
      ? fallbackSubmissionId
      : null;
  const replayed = parsed?.replayed === true;
  const ok = parsed?.ok === true;
  let code = "INVALID_RESPONSE";
  if (ok) code = "OK";
  else if (parsed && typeof parsed.code === "string" && SAFE_CODE_RE.test(parsed.code)) {
    code = parsed.code;
  }

  let outcome = ok ? "success" : "failed";
  if (ok && environment !== "prod") {
    outcome = "failed";
    code = "ENVIRONMENT_NOT_PROD";
  } else if (ok && state !== "SUCCESS") {
    outcome = "failed";
    code = "STATE_NOT_SUCCESS";
  } else if (ok && !leadId) {
    outcome = "failed";
    code = "LEAD_ID_MISSING";
  } else if (ok && replayed) {
    outcome = "failed";
    code = "UNEXPECTED_REPLAY";
  }

  return {
    outcome,
    code,
    submission_id: submissionId,
    lead_id: leadId,
    environment,
    state,
    replayed,
  };
}

function loadCrmModule() {
  const source = readFileSync(path.join(ROOT, "app/lib/contact-crm.ts"), "utf8").replace(
    'import "server-only";\n',
    "",
  );
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const dir = mkdtempSync(path.join(tmpdir(), "contact-crm-prod-smoke-"));
  const outfile = path.join(dir, "contact-crm.mjs");
  writeFileSync(outfile, transpiled);
  return import(pathToFileURL(outfile).href).finally(() => {
    rmSync(dir, { recursive: true, force: true });
  });
}

function printResult(result) {
  console.log(JSON.stringify(result));
}

function cleanChildEnv() {
  return {
    PATH: process.env.PATH ?? "",
    HOME: process.env.HOME ?? "",
    TMPDIR: process.env.TMPDIR ?? "",
    LANG: process.env.LANG ?? "",
  };
}

function assertSelfTest() {
  const source = readFileSync(SCRIPT_PATH, "utf8");
  const urls = source.match(/\/macros\/s\/[A-Za-z0-9_-]+\/exec/g) || [];
  const allowed = new Set([
    "/macros/s/DEVDEPLOYMENTID/exec",
    "/macros/s/PRODDEPLOYMENTID/exec",
  ]);
  for (const match of urls) {
    if (!allowed.has(match)) {
      throw new Error("production smoke script contains an unexpected Web App URL");
    }
  }

  const blocked = classifyInvocation({
    confirm: true,
    env: {
      CRM_INGEST_URL: "https://script.google.com/macros/s/DEVDEPLOYMENTID/exec",
      CRM_INGEST_SECRET: "prod-looking-secret",
    },
    markers: {
      ok: true,
      urls: ["https://script.google.com/macros/s/DEVDEPLOYMENTID/exec"],
      secrets: [],
    },
  });
  if (blocked.action !== "skip" || blocked.code !== "DEV_URL_REFUSED") {
    throw new Error("DEV URL was not refused");
  }

  const secretBlocked = classifyInvocation({
    confirm: true,
    env: {
      CRM_INGEST_URL: "https://script.google.com/macros/s/PRODDEPLOYMENTID/exec",
      CRM_INGEST_SECRET: "same-as-dev",
    },
    markers: {
      ok: true,
      urls: [],
      secrets: ["same-as-dev"],
    },
  });
  if (secretBlocked.action !== "skip" || secretBlocked.code !== "DEV_SECRET_REFUSED") {
    throw new Error("DEV secret was not refused");
  }

  const unconfirmed = classifyInvocation({
    confirm: false,
    env: {
      CRM_INGEST_URL: "https://script.google.com/macros/s/PRODDEPLOYMENTID/exec",
      CRM_INGEST_SECRET: "not-dev",
    },
    markers: { ok: true, urls: [], secrets: [] },
  });
  if (unconfirmed.code !== "CONFIRMATION_REQUIRED" || unconfirmed.action !== "skip") {
    throw new Error("missing confirmation was not refused");
  }

  const child = spawnSync(process.execPath, [SCRIPT_PATH], {
    env: cleanChildEnv(),
    encoding: "utf8",
  });
  if (child.status !== 0) {
    throw new Error("unconfirmed smoke command did not exit 0");
  }
  const unconfirmedBody = JSON.parse(child.stdout);
  if (unconfirmedBody.code !== "CONFIRMATION_REQUIRED") {
    throw new Error("unconfirmed smoke command did not refuse");
  }
  if (String(child.stdout).includes("fake-crm-prodstest@example.com")) {
    throw new Error("unconfirmed command printed the fake payload");
  }

  const missing = spawnSync(process.execPath, [SCRIPT_PATH, CONFIRM_FLAG], {
    env: cleanChildEnv(),
    encoding: "utf8",
  });
  if (missing.status === 0) {
    throw new Error("confirmed command without a URL exited 0");
  }
  const missingBody = JSON.parse(missing.stdout);
  if (missingBody.code !== "CONFIG_URL_INVALID") {
    throw new Error("confirmed command without a URL did not fail closed");
  }
  if (String(missing.stdout).includes("script.google.com")) {
    throw new Error("config failure printed a URL");
  }
}

async function sendSmoke(url, secret) {
  const crm = await loadCrmModule();
  const payload = crm.buildCrmLeadPayload(FAKE_CONTACT);
  if (!payload) {
    printResult(emptyResult("MAPPING_REJECTED"));
    return 1;
  }
  const submissionId = randomUUID();
  const timestamp = new Date().toISOString();
  const signing = crm.buildWebsiteIngestSigningString(
    1,
    timestamp,
    submissionId,
    payload,
  );
  const signature = crm.hmacSha256Hex(signing, secret);
  const body = JSON.stringify({
    version: 1,
    timestamp,
    submission_id: submissionId,
    payload,
    signature,
  });
  const transport = await crm.postCrmIngestRequest(
    url,
    body,
    timeoutMs(process.env.CRM_INGEST_TIMEOUT_MS),
  );
  if (!transport.delivered) {
    printResult({
      ...emptyResult(transport.code),
      submission_id: submissionId,
    });
    return 1;
  }
  let parsed = null;
  try {
    parsed = JSON.parse(transport.bodyText || "");
  } catch {
    parsed = null;
  }
  const result = safeParsedResult(parsed, submissionId);
  printResult(result);
  if (result.code === "ENVIRONMENT_NOT_PROD") {
    console.error(
      "The endpoint identified itself as something other than prod. If a lead_id was printed, clear only that fake row on the spreadsheet that accepted it. Do not enable the website CRM flag.",
    );
  } else if (result.outcome === "success") {
    console.error(
      "One fake lead was created. On that spreadsheet only, clear the content of the Leads row for the printed lead_id, ActivityLog rows with that lead_id, and the WebsiteIngestLedger row for the printed submission_id. Do not delete the rows and do not clear any other record. Then refresh Board and Dashboard.",
    );
  }
  return result.outcome === "success" ? 0 : 1;
}

async function main() {
  const confirm = process.argv.includes(CONFIRM_FLAG);
  if (!confirm) {
    printResult(emptyResult("CONFIRMATION_REQUIRED"));
    console.error(
      "No CRM request was sent. Re-run with --confirm-production only when CRM_INGEST_URL and CRM_INGEST_SECRET in this process are the clinic production values. This command does not read .env files into the environment, and it does not call /api/contact, Trello, or staff email.",
    );
    return 0;
  }

  const decision = classifyInvocation({
    confirm: true,
    env: process.env,
    markers: readDevMarkers(),
  });
  if (decision.action !== "send") {
    printResult(emptyResult(decision.code));
    console.error(
      "No CRM request was sent. Production smoke requires --confirm-production, a clinic /exec URL, and a production secret that are not the local DEV values.",
    );
    return decision.exitCode;
  }

  return sendSmoke(decision.url, decision.secret);
}

if (process.argv.includes(SELF_TEST_FLAG)) {
  try {
    assertSelfTest();
    console.log(
      JSON.stringify({
        outcome: "passed",
        code: "SELF_TEST",
        submission_id: null,
        lead_id: null,
        environment: null,
        state: null,
        replayed: false,
      }),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : "self-test failed");
    console.error(
      JSON.stringify({
        outcome: "failed",
        code: "SELF_TEST_FAILED",
        submission_id: null,
        lead_id: null,
        environment: null,
        state: null,
        replayed: false,
      }),
    );
    process.exit(1);
  }
} else {
  process.exit(await main());
}
