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
 * @file     packages/brand/scripts/generate.mjs
 * @summary  Generates Tailwind tokens from the brand config.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Design-token generator.
 *
 * Reads `packages/brand/brand.config.json` (the single source of truth for
 * colours, identity, typography and currency) and writes:
 *
 *   packages/brand/generated/tokens.css — Tailwind v4 @theme + CSS variables
 *   packages/brand/generated/tokens.ts  — typed colour/font tokens for TS
 *
 * Run with `pnpm theme`. CI verifies the generated files are committed and in
 * sync, so a palette change can never drift from the CSS.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { brand, renderHeader } from "../../../scripts/header.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../generated");

const kebab = (value) => value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
const entries = (object) => Object.entries(object ?? {});

function declarations(source, prefix, { quote = false } = {}) {
  return entries(source)
    .filter(([key]) => !key.startsWith("$"))
    .map(([key, value]) => {
      const rendered = quote ? JSON.stringify(value) : value;
      return `  --${prefix}${kebab(key)}: ${rendered};`;
    });
}

function buildCss() {
  const { colors, darkColors, typography, motion } = brand;
  const { fonts, scale, leading, tracking, measure } = typography;
  const serif = fonts.serif ?? fonts.latin;

  const fontStacks = [
    `  --font-sans: var(${fonts.latin.variable}), ${fonts.latin.fallback};`,
    `  --font-serif: var(${serif.variable}), ${serif.fallback};`,
    `  --font-display: var(${fonts.latin.variable}), ${fonts.latin.fallback};`,
    `  --font-arabic: var(${fonts.arabic.variable}), ${fonts.arabic.fallback};`,
    `  --font-mono: var(${fonts.mono.variable}), ${fonts.mono.fallback};`,
  ];

  return [
    renderHeader({
      file: "packages/brand/generated/tokens.css",
      summary: "Generated design tokens (Tailwind @theme) — do not edit by hand.",
      style: "block",
    }).trimEnd(),
    "",
    "/* AUTO-GENERATED from packages/brand/brand.config.json. Run `pnpm theme`. */",
    "",
    "/* Tailwind v4 theme. Each key becomes a utility:",
    "   --color-*  -> bg-brand, text-accent-dark, border-line",
    "   --font-*   -> font-sans, font-serif, font-display, font-arabic",
    "   --text-*   -> text-display, text-h1 ... (fluid clamp sizes)",
    "   --leading-* / --tracking-* -> leading-heading, tracking-display",
    "   --ease-*   -> ease-out, ease-in-out, ease-cinematic",
    "",
    "   THEME: dark is the product, not a preference. The shipped palette is",
    "   emitted here as the default, so no OS media query can flip the site.",
    "   The anchor (light) palette is opt-in with [data-theme='light'] below,",
    "   for print, e-mail templates and the design reference page. */",
    "@theme {",
    ...declarations(darkColors, "color-"),
    ...fontStacks,
    ...declarations(scale, "text-"),
    ...declarations(leading, "leading-"),
    ...declarations(tracking, "tracking-"),
    ...declarations(motion.ease, "ease-"),
    "}",
    "",
    "/* Dark is the default surface. `color-scheme` keeps native controls, form",
    "   fields and scrollbars in the same key as the page. */",
    ":root {",
    "  color-scheme: dark;",
    ...entries(darkColors).map(([key, hex]) => `  --${key}: ${hex};`),
    `  --text-main: ${darkColors.ink};`,
    `  --text-sub: ${darkColors.muted};`,
    `  --measure-body: ${measure.body};`,
    `  --measure-tight: ${measure.tight};`,
    ...entries(motion.duration).map(([key, value]) => `  --duration-${kebab(key)}: ${value};`),
    "}",
    "",
    "/* Anchor palette opt-in. Same variable names, so every utility and every",
    "   inline style adapts without a second class set. Used by print styles,",
    "   e-mail templates and the /design reference. */",
    "[data-theme='light'] {",
    "  color-scheme: light;",
    ...entries(colors).map(([key, hex]) => `  --color-${kebab(key)}: ${hex};`),
    ...entries(colors).map(([key, hex]) => `  --${key}: ${hex};`),
    `  --text-main: ${colors.ink};`,
    `  --text-sub: ${colors.muted};`,
    "}",
    "",
  ].join("\n");
}

function buildTs() {
  const { colors, darkColors, currency, name, typography, motion } = brand;
  const object = (source, indent = "  ") =>
    entries(source)
      .filter(([key]) => !key.startsWith("$"))
      .map(([key, value]) => `${indent}${JSON.stringify(key)}: ${JSON.stringify(value)},`)
      .join("\n");

  return [
    renderHeader({
      file: "packages/brand/generated/tokens.ts",
      summary: "Generated typed design tokens — do not edit by hand.",
      style: "block",
    }).trimEnd(),
    "",
    "/* AUTO-GENERATED from packages/brand/brand.config.json. Run `pnpm theme`. */",
    "",
    `export const brandName = ${JSON.stringify(name)} as const;`,
    "",
    "export const colors = {",
    object(colors),
    "} as const;",
    "",
    "export const darkColors = {",
    object(darkColors),
    "} as const;",
    "",
    "/** CSS custom-property name for each palette key. */",
    "export const cssVar = {",
    entries(colors)
      .map(([key]) => `  ${JSON.stringify(key)}: ${JSON.stringify(`--color-${kebab(key)}`)},`)
      .join("\n"),
    "} as const;",
    "",
    "export const fontSize = {",
    object(typography.scale),
    "} as const;",
    "",
    "export const leading = {",
    object(typography.leading),
    "} as const;",
    "",
    "export const tracking = {",
    object(typography.tracking),
    "} as const;",
    "",
    "export const currency = {",
    object(currency),
    "} as const;",
    "",
    "export const motion = {",
    `  duration: {`,
    object(motion.duration, "    "),
    `  },`,
    `  ease: {`,
    object(motion.ease, "    "),
    `  },`,
    "} as const;",
    "",
    "export const tokens = { brandName, colors, darkColors, cssVar, fontSize, leading, tracking, currency, motion } as const;",
    "",
    "export type ColorName = keyof typeof colors;",
    "export type FontSizeName = keyof typeof fontSize;",
    "export type TokenSet = typeof tokens;",
    "",
    "/** `cssVarName('brand-dark')` -> `var(--color-brand-dark)` */",
    "export function cssVarName(name: ColorName): string {",
    // biome-ignore lint/suspicious/noTemplateCurlyInString: emitted as a template literal in the generated file
    "  return `var(${cssVar[name]})`;",
    "}",
    "",
  ].join("\n");
}

/**
 * The runtime subset of the brand config.
 *
 * `brand.config.json` also carries the ownership block and the founder's
 * personal contact details, because the header generator reads them from there.
 * Anything imported through `@edurelay/brand` can end up in a client bundle, so
 * the generated module ships public identity only: no owner, no personal phone,
 * no WhatsApp number, no banner metadata.
 */
function publicBrand() {
  const copy = JSON.parse(JSON.stringify(brand));

  delete copy.owner;

  for (const key of Object.keys(copy)) {
    if (key.startsWith("//") || key.startsWith("$")) delete copy[key];
  }

  delete copy.contacts?.phone;
  delete copy.contacts?.whatsapp;

  return copy;
}

function buildBrand() {
  return [
    renderHeader({
      file: "packages/brand/generated/brand.ts",
      summary: "Generated public brand config — do not edit by hand.",
      style: "block",
    }).trimEnd(),
    "",
    "/* AUTO-GENERATED from packages/brand/brand.config.json. Run `pnpm theme`. */",
    "",
    "/* Public identity only. Ownership and personal contact details stay in the",
    "   source config so they can never be serialised into a client bundle. */",
    `export const brandConfig = ${JSON.stringify(publicBrand(), null, 2)} as const;`,
    "",
    "export type BrandConfig = typeof brandConfig;",
    "",
  ].join("\n");
}

const css = buildCss();
const ts = buildTs();
const brandTs = buildBrand();

mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, "tokens.css"), css, "utf8");
writeFileSync(resolve(OUT, "tokens.ts"), ts, "utf8");
writeFileSync(resolve(OUT, "brand.ts"), brandTs, "utf8");

const { scale } = brand.typography;
console.log(
  `theme: ${entries(brand.colors).length} colours, ${entries(scale).length} type sizes, ` +
    `${entries(brand.typography.fonts).length} font stacks -> packages/brand/generated/`,
);
