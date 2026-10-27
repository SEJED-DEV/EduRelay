/**
 * ==============================================================================
 * EduRelay — School Supplies · Passed Forward
 * Copyright (c) 2026 EduRelay. All rights reserved.
 *
 * PRIVATE REPOSITORY — CONFIDENTIAL.
 * This file is part of a private, proprietary codebase. Access is granted by
 * prior written permission from the owner only. If you are reading this without
 * that permission you must stop now and delete every copy: you may not view,
 * copy, modify, distribute or disclose this file.
 * Unauthorised access or use may give rise to civil and/or criminal liability
 * under applicable law, including Tunisian intellectual-property law (Law No.
 * 94-36) and the law on electronic exchanges (Law No. 2000-83).
 *
 * Code owned by EduRelay · Made by Sejed TRABELSSI
 *   Portfolio      https://sejed.dev
 *   Instagram      https://instagram.com/sejed.dev
 *   Discord        https://discord.gg/sejed.dev
 *   Dev Community  https://dev.to/sejed.dev
 *   Facebook       https://facebook.com/TSSEJED
 *   Mobile         +216 94 155 000
 *
 * @file     scripts/hash-release.mjs
 * @summary  SHA-256 manifest of a release, for authorship evidence.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Release hashing: proof-of-authorship evidence for a tagged build.
 *
 * Produces two files under .release/ (gitignored):
 *   <version>.manifest.sha256  — one SHA-256 per tracked file, sorted by path
 *   <version>.bundle.sha256    — the SHA-256 of the manifest itself
 *
 * Usage:
 *   pnpm release:hash            # version inferred from package.json
 *   pnpm release:hash v0.2.0     # explicit label
 *
 * Store the outputs outside the repository (owner's vault) together with the
 * signed tag archive. See docs/ownership.md.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, ".release");
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  ".release",
  ".vercel",
]);
const SKIP_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".ico", ".zip", ".pdf"]);

/** Git is the source of truth for "tracked"; fall back to a filesystem walk. */
function trackedFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" });
    return out.split("\0").filter(Boolean);
  } catch {
    const files = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
        } else if (!SKIP_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
          files.push(relative(ROOT, join(dir, entry.name)).split(sep).join("/"));
        }
      }
    };
    walk(ROOT);
    return files.sort();
  }
}

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const version = process.argv[2] ?? `v${pkg.version}`;
const files = trackedFiles();

if (files.length === 0) {
  console.error("release:hash — no tracked files found. Run `git init` first.");
  process.exit(1);
}

const lines = [];
let totalBytes = 0;

for (const rel of files) {
  const absolute = join(ROOT, rel);
  if (!existsSync(absolute)) continue;
  const stat = statSync(absolute);
  if (!stat.isFile()) continue;
  const hash = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  totalBytes += stat.size;
  lines.push(`${hash}  ${rel}`);
}

const manifest = `${lines.join("\n")}\n`;
const bundleHash = createHash("sha256").update(manifest).digest("hex");

mkdirSync(OUT_DIR, { recursive: true });
const manifestPath = join(OUT_DIR, `${version}.manifest.sha256`);
writeFileSync(manifestPath, manifest, "utf8");
writeFileSync(
  join(OUT_DIR, `${version}.bundle.sha256`),
  `${bundleHash}  ${version}.manifest.sha256\n`,
  "utf8",
);

console.log(`release:hash ${version}`);
console.log(`  files   ${lines.length}`);
console.log(`  bytes   ${totalBytes}`);
console.log(`  bundle  ${bundleHash}`);
console.log(`  written .release/${version}.manifest.sha256`);
console.log("Copy both files out of the repository before tagging. See docs/ownership.md.");
