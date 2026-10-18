import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import process from "node:process";

let sharp;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  sharp = (await import("sharp")).default;
} catch (err) {
  console.error(
    [
      "Missing dependency: sharp",
      "",
      "Install it, then retry:",
      "  npm install --save-dev sharp",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const DEFAULT_TARGETS = [
  "public/images/medical-educational-purpose",
  "public/images/zusduri/zusduri group.png",
  "public/images/join our team/team-hands-in-middle-white-background.jpg",
];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    estimate: false,
    maxWidth: 2000,
    maxHeight: 2000,
    jpegQuality: 78,
    pngCompressionLevel: 9,
    targets: [...DEFAULT_TARGETS],
  };

  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--estimate") args.estimate = true;
    else if (a === "--max-width") args.maxWidth = Number(argv[++i]);
    else if (a === "--max-height") args.maxHeight = Number(argv[++i]);
    else if (a === "--jpeg-quality") args.jpegQuality = Number(argv[++i]);
    else if (a === "--targets") {
      // comma-separated list of paths
      const v = argv[++i];
      args.targets = v.split(",").map((s) => s.trim()).filter(Boolean);
    } else rest.push(a);
  }

  if (args.dryRun && args.estimate) {
    throw new Error("Use either --dry-run or --estimate (not both).");
  }

  if (!Number.isFinite(args.maxWidth) || args.maxWidth <= 0) {
    throw new Error("--max-width must be a positive number");
  }
  if (!Number.isFinite(args.maxHeight) || args.maxHeight <= 0) {
    throw new Error("--max-height must be a positive number");
  }
  if (!Number.isFinite(args.jpegQuality) || args.jpegQuality < 40 || args.jpegQuality > 95) {
    throw new Error("--jpeg-quality must be between 40 and 95");
  }
  if (
    !Number.isFinite(args.pngCompressionLevel) ||
    args.pngCompressionLevel < 0 ||
    args.pngCompressionLevel > 9
  ) {
    throw new Error("png compression level must be between 0 and 9");
  }

  return args;
}

function fmtBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return i === 0 ? `${n}${units[i]}` : `${n.toFixed(1)}${units[i]}`;
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function listImagesRecursively(absPath) {
  const images = [];
  async function walk(p) {
    const st = await fs.stat(p);
    if (st.isFile()) {
      const ext = path.extname(p).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) images.push(p);
      return;
    }
    const entries = await fs.readdir(p, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const child = path.join(p, e.name);
      if (e.isDirectory()) await walk(child);
      else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if ([".jpg", ".jpeg", ".png"].includes(ext)) images.push(child);
      }
    }
  }
  await walk(absPath);
  return images;
}

async function copyFileIfMissing(srcAbs, destAbs) {
  await ensureDir(path.dirname(destAbs));
  // Do not overwrite existing backups if script re-runs.
  try {
    await fs.access(destAbs);
    return;
  } catch {
    // ok
  }
  await fs.copyFile(srcAbs, destAbs);
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours(),
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function main() {
  const args = parseArgs(process.argv);

  const repoRoot = process.cwd();
  const stamp = nowStamp();
  const backupRoot = path.join(repoRoot, "backups", "image-optimization", stamp);
  const reportRoot = path.join(repoRoot, "reports", "image-optimization");
  await ensureDir(reportRoot);
  if (!args.dryRun && !args.estimate) {
    await ensureDir(backupRoot);
  }

  const absTargets = args.targets.map((t) => path.join(repoRoot, t));
  const files = [];
  for (const t of absTargets) {
    if (!fssync.existsSync(t)) {
      console.warn(`Skipping missing path: ${path.relative(repoRoot, t)}`);
      continue;
    }
    const st = await fs.stat(t);
    if (st.isFile()) files.push(t);
    else files.push(...(await listImagesRecursively(t)));
  }

  files.sort((a, b) => a.localeCompare(b));

  const report = [];
  let totalBefore = 0;
  let totalAfter = 0;

  for (const fileAbs of files) {
    const rel = path.relative(repoRoot, fileAbs);
    const before = (await fs.stat(fileAbs)).size;
    totalBefore += before;

    const img = sharp(fileAbs, { failOn: "none" }).rotate();
    const meta = await img.metadata();

    const w = meta.width ?? null;
    const h = meta.height ?? null;

    const needsResize =
      w != null &&
      h != null &&
      (w > args.maxWidth || h > args.maxHeight);

    const ext = path.extname(fileAbs).toLowerCase();

    const backupAbs = path.join(backupRoot, rel);
    if (!args.dryRun && !args.estimate) {
      await copyFileIfMissing(fileAbs, backupAbs);
    }

    if (args.dryRun) {
      report.push({
        path: rel,
        width: w,
        height: h,
        beforeBytes: before,
        afterBytes: before,
        changed: false,
        note: needsResize ? "would resize+recompress" : "would recompress",
      });
      totalAfter += before;
      continue;
    }

    let pipeline = sharp(fileAbs, { failOn: "none" }).rotate();
    if (needsResize) {
      pipeline = pipeline.resize({
        width: args.maxWidth,
        height: args.maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({
        quality: args.jpegQuality,
        mozjpeg: true,
        progressive: true,
      });
    } else if (ext === ".png") {
      pipeline = pipeline.png({
        compressionLevel: args.pngCompressionLevel,
        adaptiveFiltering: true,
        effort: 10,
      });
    } else {
      // ignored by listImagesRecursively, but keep safe.
      report.push({
        path: rel,
        width: w,
        height: h,
        beforeBytes: before,
        afterBytes: before,
        changed: false,
        note: "skipped (unsupported)",
      });
      totalAfter += before;
      continue;
    }

    if (args.estimate) {
      const out = await pipeline.toBuffer();
      const after = out.length;
      totalAfter += after;

      report.push({
        path: rel,
        width: w,
        height: h,
        beforeBytes: before,
        afterBytes: after,
        changed: after !== before || needsResize,
        note: needsResize ? "estimated resize+recompress" : "estimated recompress",
      });
      continue;
    }

    await pipeline.toFile(`${fileAbs}.tmp`);
    await fs.rename(`${fileAbs}.tmp`, fileAbs);

    const after = (await fs.stat(fileAbs)).size;
    totalAfter += after;

    report.push({
      path: rel,
      width: w,
      height: h,
      beforeBytes: before,
      afterBytes: after,
      changed: after !== before || needsResize,
      note: needsResize ? "resized+recompressed" : "recompressed",
    });
  }

  const reportPath = path.join(reportRoot, `report-${stamp}.json`);
  const savingsBytes = totalBefore - totalAfter;
  const savingsPct = totalBefore > 0 ? (savingsBytes / totalBefore) * 100 : 0;

  await fs.writeFile(
    reportPath,
    JSON.stringify(
      { args, totalBefore, totalAfter, savingsBytes, savingsPct, report },
      null,
      2,
    ),
  );

  console.log(`Images scanned: ${files.length}`);
  console.log(`Total before: ${fmtBytes(totalBefore)}`);
  console.log(
    `${args.estimate ? "Estimated total after" : "Total after"}:  ${fmtBytes(totalAfter)}`,
  );
  console.log(`Savings:      ${fmtBytes(savingsBytes)} (${savingsPct.toFixed(1)}%)`);
  console.log(`Report: ${path.relative(repoRoot, reportPath)}`);
  if (!args.dryRun && !args.estimate) {
    console.log(`Backup: ${path.relative(repoRoot, backupRoot)}`);
  }
  if (args.dryRun) {
    console.log("Dry run: no files were modified.");
  }
  if (args.estimate) {
    console.log("Estimate mode: no files were modified.");
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});

