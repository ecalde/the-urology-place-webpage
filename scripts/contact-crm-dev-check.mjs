/**
 * One fake CRM ingest against the URL in the local environment.
 * Does not call /api/contact, Resend, or Trello.
 *
 * Prints only outcome, code, submission id, and lead id.
 * Does not print the secret, URL, payload, or signature.
 */
import { createRequire } from "node:module";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CRM_KEYS = [
  "CRM_INGEST_ENABLED",
  "CRM_INGEST_URL",
  "CRM_INGEST_SECRET",
  "CRM_INGEST_TIMEOUT_MS",
];

function loadLocalCrmEnv() {
  const alreadySet = new Set(
    CRM_KEYS.filter((key) => process.env[key] !== undefined),
  );
  const fromFiles = new Map();

  for (const name of [".env", ".env.local"]) {
    const file = path.join(ROOT, name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!CRM_KEYS.includes(key)) continue;
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      fromFiles.set(key, value);
    }
  }

  for (const key of CRM_KEYS) {
    if (alreadySet.has(key)) continue;
    if (fromFiles.has(key)) process.env[key] = fromFiles.get(key);
  }
}

function loadCrmModule() {
  const source = readFileSync(
    path.join(ROOT, "app/lib/contact-crm.ts"),
    "utf8",
  ).replace('import "server-only";\n', "");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const dir = mkdtempSync(path.join(tmpdir(), "contact-crm-dev-"));
  const outfile = path.join(dir, "contact-crm.mjs");
  writeFileSync(outfile, transpiled);
  return import(pathToFileURL(outfile).href).finally(() => {
    rmSync(dir, { recursive: true, force: true });
  });
}

const FAKE_CONTACT = {
  firstName: "Fake",
  lastName: "Devcheck",
  phone: "555-010-0199",
  email: "fake-crm-devcheck@example.com",
  appointmentReasonFinal: "General Urology",
  bestWayToReachMe: "Email",
  bestTimeToReachMeFinal: "Morning",
  message: "Phase 7C DEV connectivity check. Not a patient.",
  smsConsent: "no",
  pageName: "DEV check",
  sourcePath: "/dev-crm-check",
};

if (!process.argv.includes("--confirm")) {
  console.log(
    JSON.stringify({
      outcome: "skipped",
      code: "CONFIRMATION_REQUIRED",
      submission_id: null,
      lead_id: null,
    }),
  );
  console.error(
    "No CRM request was sent. Re-run with --confirm to post one fake lead to the configured DEV Apps Script URL. This command does not email Trello.",
  );
  process.exit(0);
}

loadLocalCrmEnv();

const crm = await loadCrmModule();

try {
  const result = await crm.ingestContactToCrm(FAKE_CONTACT);
  const safe = {
    outcome: result.outcome,
    code: result.code ?? null,
    submission_id: result.submissionId ?? null,
    lead_id: result.leadId ?? null,
  };
  console.log(JSON.stringify(safe));
  process.exit(result.outcome === "failed" ? 1 : 0);
} catch {
  console.error(
    JSON.stringify({
      outcome: "failed",
      code: "UNEXPECTED",
      submission_id: null,
      lead_id: null,
    }),
  );
  process.exit(1);
}
