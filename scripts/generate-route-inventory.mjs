import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * Generates a read-only route inventory for the Sanity Studio "Pages" pane.
 *
 * The manifest is derived entirely from the App Router (`app/**\/page.tsx`) and
 * the redirects declared in `next.config.ts`. It powers a Studio-only inventory
 * view and does NOT create any Sanity documents or add any Sanity fetches to
 * public pages.
 *
 * Usage:
 *   node scripts/generate-route-inventory.mjs           # write the manifest
 *   node scripts/generate-route-inventory.mjs --check   # fail if stale
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(REPO_ROOT, "app");
const OUTPUT_FILE = path.join(REPO_ROOT, "studio", "routeInventory.generated.ts");
const NEXT_CONFIG = path.join(REPO_ROOT, "next.config.ts");
const EXTERNAL_LINKS = path.join(REPO_ROOT, "app", "lib", "external-links.ts");

/** Routes that already read from Sanity, and what portion is editable today. */
const SANITY_STATUS = {
  "/": { status: "partial", note: "\"What's New\" announcement slider is Sanity-driven; the rest is hardcoded." },
  "/about-us": { status: "partial", note: "Team sections are Sanity-driven; intro/community content is hardcoded." },
  "/patient-resources/privacy-policy-hipaa": {
    status: "partial",
    note: "Policy body is Sanity-driven; page shell and hero are hardcoded.",
  },
  "/patient-resources/blog": { status: "managed", note: "Post listing is fully Sanity-driven." },
  "/patient-resources/blog/[slug]": {
    status: "managed",
    note: "Article, metadata, author, related posts and CTA are Sanity-driven.",
  },
  "/men/[...slug]": {
    status: "managed",
    note: "Published Men treatment pages. Hardcoded Men pages stay on their own files.",
  },
  "/women/[...slug]": {
    status: "managed",
    note: "Published Women treatment pages. Hardcoded Women pages stay on their own files.",
  },
};

/** Ordered display groups. Anything unmatched falls into "Other". */
const GROUP_ORDER = ["Home", "Men", "Women", "Clinical Research", "Patient Resources", "Other"];

const GROUP_BY_SEGMENT = {
  men: "Men",
  women: "Women",
  "clinical-research": "Clinical Research",
  "patient-resources": "Patient Resources",
};

/** Segment-level replacements so humanized titles read correctly. */
const ACRONYMS = {
  hipaa: "HIPAA",
  psa: "PSA",
  bph: "BPH",
  bcg: "BCG",
  hrt: "HRT",
  faq: "FAQ",
  tulsa: "TULSA",
  itind: "iTind",
  pae: "PAE",
};

async function walkPageFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkPageFiles(full)));
    } else if (entry.isFile() && entry.name === "page.tsx") {
      out.push(full);
    }
  }
  return out;
}

/** Convert a folder segment into a human-friendly title fragment. */
function humanizeSegment(segment) {
  return segment
    .split("-")
    .map((word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toRoutePath(sourceFile) {
  const rel = path.relative(APP_DIR, sourceFile).split(path.sep);
  rel.pop(); // drop "page.tsx"
  // Drop route groups like "(marketing)" which do not affect the URL.
  const segments = rel.filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")));
  return segments.length === 0 ? "/" : "/" + segments.join("/");
}

function deriveTitle(routePath) {
  if (routePath === "/") return "Home";
  const segments = routePath.split("/").filter(Boolean);
  const last = segments[segments.length - 1];

  if (last.startsWith("[")) {
    const section = segments[0];
    if ((section === "men" || section === "women") && last.includes("slug")) {
      return "Treatment page (dynamic)";
    }
    return "Blog Post (dynamic)";
  }

  if (last === "contact-us" && segments.length >= 2) {
    const parent = segments[segments.length - 2];
    return `${humanizeSegment(parent)} — Contact Us`;
  }

  return humanizeSegment(last);
}

function deriveGroup(routePath) {
  if (routePath === "/") return "Home";
  const first = routePath.split("/").filter(Boolean)[0];
  return GROUP_BY_SEGMENT[first] ?? "Other";
}

function deriveKind(routePath) {
  return routePath.includes("[") ? "dynamic" : "static";
}

async function readKnownConstants() {
  const map = {};
  try {
    const text = await fs.readFile(EXTERNAL_LINKS, "utf8");
    const re = /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      map[m[1]] = m[2];
    }
  } catch {
    // external-links is optional; ignore if missing.
  }
  return map;
}

async function parseRedirects(constants) {
  let text;
  try {
    text = await fs.readFile(NEXT_CONFIG, "utf8");
  } catch {
    return [];
  }

  const redirects = [];
  const re =
    /source:\s*"([^"]+)"[\s\S]*?destination:\s*(?:"([^"]+)"|([A-Za-z0-9_]+))[\s\S]*?permanent:\s*(true|false)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const source = m[1];
    const literalDest = m[2];
    const identDest = m[3];
    let destination;
    if (literalDest !== undefined) {
      destination = literalDest;
    } else if (identDest !== undefined) {
      destination = constants[identDest] ?? `(${identDest})`;
    } else {
      destination = "";
    }
    redirects.push({ source, destination, permanent: m[4] === "true" });
  }
  redirects.sort((a, b) => a.source.localeCompare(b.source));
  return redirects;
}

function serialize(routes, redirects) {
  const header = `// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
//
// Regenerate with:  npm run routes:generate
// Verify freshness: npm run routes:check
//
// Source of truth: app/**/page.tsx and next.config.ts redirects.
// This manifest powers the read-only "Pages" inventory in Sanity Studio.
// It creates no Sanity documents and adds no Sanity fetches to public pages.

export type SanityStatus = "hardcoded" | "partial" | "managed";
export type RouteKind = "static" | "dynamic";

export interface RouteInventoryEntry {
  /** URL path as served by Next.js (e.g. "/men/vasectomy"). */
  path: string;
  /** Human-friendly label shown in Studio. */
  title: string;
  /** Display group (Home, Men, Women, ...). */
  group: string;
  /** Whether the route is static or contains a dynamic segment. */
  kind: RouteKind;
  /** Source file, relative to the repo root. */
  sourceFile: string;
  /** How much of the page is editable in Sanity today. */
  sanityStatus: SanityStatus;
  /** Optional detail about the current Sanity integration. */
  sanityNote?: string;
}

export interface RedirectEntry {
  source: string;
  destination: string;
  permanent: boolean;
}

/** Ordered list of display groups. */
export const routeGroups: string[] = ${JSON.stringify(GROUP_ORDER, null, 2)};

/** Every public route template, excluding /studio. */
export const routeInventory: RouteInventoryEntry[] = ${JSON.stringify(routes, null, 2)};

/** Redirects declared in next.config.ts. */
export const redirects: RedirectEntry[] = ${JSON.stringify(redirects, null, 2)};
`;
  return header;
}

async function build() {
  const constants = await readKnownConstants();
  const files = await walkPageFiles(APP_DIR);

  const routes = files
    .map((file) => {
      const routePath = toRoutePath(file);
      return { routePath, file };
    })
    .filter(({ routePath }) => routePath !== "/studio" && !routePath.startsWith("/studio/"))
    .map(({ routePath, file }) => {
      const sanity = SANITY_STATUS[routePath];
      const entry = {
        path: routePath,
        title: deriveTitle(routePath),
        group: deriveGroup(routePath),
        kind: deriveKind(routePath),
        sourceFile: path.relative(REPO_ROOT, file).split(path.sep).join("/"),
        sanityStatus: sanity ? sanity.status : "hardcoded",
      };
      if (sanity?.note) entry.sanityNote = sanity.note;
      return entry;
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  const redirects = await parseRedirects(constants);
  return serialize(routes, redirects);
}

async function main() {
  const check = process.argv.includes("--check");
  const next = await build();

  if (check) {
    let current = null;
    try {
      current = await fs.readFile(OUTPUT_FILE, "utf8");
    } catch {
      current = null;
    }
    if (current !== next) {
      console.error(
        [
          "Route inventory is stale.",
          "",
          "The generated Studio Pages manifest does not match app/**/page.tsx",
          "and/or next.config.ts. Regenerate and commit it:",
          "",
          "  npm run routes:generate",
          "",
        ].join("\n"),
      );
      process.exit(1);
    }
    console.log("Route inventory is up to date.");
    return;
  }

  await fs.writeFile(OUTPUT_FILE, next, "utf8");
  const count = (next.match(/"path":/g) || []).length;
  console.log(`Wrote ${path.relative(REPO_ROOT, OUTPUT_FILE)} (${count} routes).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
