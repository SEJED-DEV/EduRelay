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
 * @file     scripts/header.mjs
 * @summary  Builds the ownership banner from the brand config.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Shared ownership-header renderer.
 *
 * Every source file in this repository carries the same confidential banner.
 * The banner text lives here (not copy-pasted into files) and pulls the company
 * name, phone number and social handles from `packages/brand/brand.config.json`,
 * so renaming the company or changing a link updates every file at once.
 *
 * Used by:
 *   - scripts/add-headers.mjs        (applies banners across the repo)
 *   - packages/brand/scripts/generate.mjs (banners on generated token files)
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Parsed brand config — the single source of identity for the banner. */
export const brand = JSON.parse(
  readFileSync(resolve(HERE, "../packages/brand/brand.config.json"), "utf8"),
);

/** Unique marker used to detect and replace an existing banner. */
export const MARKER = "EDURELAY-HEADER";

const RULE = "=".repeat(78);

/** Lines of the banner body, without any comment syntax. */
function bodyLines(file, summary) {
  const { name, tagline, owner, contacts, legal } = brand;
  const year = new Date().getFullYear();

  return [
    RULE,
    `${name} — ${tagline.en}`,
    `Copyright (c) ${year} ${legal.entityName}. All rights reserved.`,
    "",
    "PRIVATE REPOSITORY — CONFIDENTIAL.",
    "This file is part of a private, proprietary codebase. Access is granted by",
    "prior written permission from the owner only. If you are reading this without",
    "that permission you must stop now and delete every copy: you may not view,",
    "copy, modify, distribute or disclose this file.",
    "Unauthorised access or use may give rise to civil and/or criminal liability",
    "under applicable law, including Tunisian intellectual-property law (Law No.",
    "94-36) and the law on electronic exchanges (Law No. 2000-83).",
    "",
    `Code owned by ${legal.entityName} · Made by ${owner.name}`,
    `  Portfolio      ${owner.portfolio}`,
    `  Instagram      ${owner.instagram}`,
    `  Discord        ${owner.discord}`,
    `  Dev Community  ${owner.devCommunity}`,
    `  Facebook       ${owner.facebook}`,
    `  Mobile         ${contacts.phone}`,
    "",
    `@file     ${file}`,
    `@summary  ${summary}`,
    `@marker   ${MARKER}`,
    RULE,
  ];
}

/** One-line banner for strict JSON files (JSON has no comment syntax). */
export function jsonBanner() {
  const { name, owner, contacts, legal } = brand;
  return [
    "PRIVATE & CONFIDENTIAL",
    `Code owned by ${name}, made by ${owner.name}.`,
    `Portfolio ${owner.portfolio} | Instagram ${owner.instagram} | Discord ${owner.discord}`,
    `Dev Community ${owner.devCommunity} | Facebook ${owner.facebook} | Mobile ${contacts.phone}`,
    `${legal.notice} See NOTICE.md`,
  ].join(" ");
}

/**
 * Render a full banner.
 *
 * @param {object}  options
 * @param {string}  options.file     Repo-relative POSIX path, shown in @file.
 * @param {string}  options.summary  One-line description of the file.
 * @param {"block"|"html"|"hash"|"slash"} options.style Comment syntax to use.
 */
export function renderHeader({ file, summary, style }) {
  const lines = bodyLines(file, summary);

  switch (style) {
    case "html":
      return `<!--\n${lines.map((line) => `  ${line}`).join("\n")}\n-->\n\n`;
    case "hash":
      return `${lines.map((line) => (line ? `# ${line}` : "#")).join("\n")}\n\n`;
    case "slash":
      return `${lines.map((line) => (line ? `// ${line}` : "//")).join("\n")}\n\n`;
    default:
      return `/**\n${lines.map((line) => (line ? ` * ${line}` : " *")).join("\n")}\n */\n\n`;
  }
}

const STRIP_PATTERNS = {
  block: /^\/\*\*\n \* ={20,}\n[\s\S]*?\n \* ={20,}\n \*\/\n*/,
  html: /^<!--\n {2}={20,}\n[\s\S]*?\n {2}={20,}\n-->\n*/,
  hash: /^# ={20,}\n(?:#.*\n|\n)*?# ={20,}\n*/,
  slash: /^\/\/ ={20,}\n(?:\/\/.*\n|\n)*?\/\/ ={20,}\n*/,
};

/** Remove an existing banner (idempotent re-application). */
export function stripHeader(text, style) {
  const pattern = STRIP_PATTERNS[style];
  if (!pattern) return text;
  return text.replace(pattern, "");
}

/** Strip a UTF-8 BOM and a leading shebang before inserting a banner. */
export function splitPrologue(text) {
  let prologue = "";
  let rest = text;
  if (rest.charCodeAt(0) === 0xfeff) {
    prologue = "\ufeff";
    rest = rest.slice(1);
  }
  if (rest.startsWith("#!")) {
    const newline = rest.indexOf("\n");
    prologue += rest.slice(0, newline + 1);
    rest = rest.slice(newline + 1);
  }
  return { prologue, rest };
}
