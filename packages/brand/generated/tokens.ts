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
 * @file     packages/brand/generated/tokens.ts
 * @summary  Generated typed design tokens — do not edit by hand.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/* AUTO-GENERATED from packages/brand/brand.config.json. Run `pnpm theme`. */

export const brandName = "EduRelay" as const;

export const colors = {
  "brand": "#1D9E75",
  "brand-dark": "#085041",
  "brand-light": "#E1F5EE",
  "accent": "#EF9F27",
  "accent-dark": "#633806",
  "ink": "#2C2C2A",
  "muted": "#888780",
  "canvas": "#FBFAF7",
  "surface": "#FFFFFF",
  "elevated": "#F4F2EC",
  "line": "#E7E4DA",
  "on-brand": "#04241A",
  "on-accent": "#2A1804",
  "mist": "#E1F5EE",
  "on-mist": "#0A241C",
  "danger": "#DC2626",
  "on-danger": "#FFFFFF",
  "success": "#16A34A",
} as const;

export const darkColors = {
  "brand": "#43D9A6",
  "brand-dark": "#A9F2D8",
  "brand-light": "#0C2A22",
  "accent": "#F7B65C",
  "accent-dark": "#FFD9A8",
  "ink": "#EAF4EF",
  "muted": "#9AAEA5",
  "canvas": "#060D0B",
  "surface": "#0A1512",
  "elevated": "#0F1E19",
  "line": "#1D2F28",
  "on-brand": "#04231A",
  "on-accent": "#2A1804",
  "mist": "#E1F5EE",
  "on-mist": "#0A241C",
  "danger": "#FF8F8F",
  "on-danger": "#2A0A0A",
  "success": "#5FE3A1",
} as const;

/** CSS custom-property name for each palette key. */
export const cssVar = {
  "brand": "--color-brand",
  "brand-dark": "--color-brand-dark",
  "brand-light": "--color-brand-light",
  "accent": "--color-accent",
  "accent-dark": "--color-accent-dark",
  "ink": "--color-ink",
  "muted": "--color-muted",
  "canvas": "--color-canvas",
  "surface": "--color-surface",
  "elevated": "--color-elevated",
  "line": "--color-line",
  "on-brand": "--color-on-brand",
  "on-accent": "--color-on-accent",
  "mist": "--color-mist",
  "on-mist": "--color-on-mist",
  "danger": "--color-danger",
  "on-danger": "--color-on-danger",
  "success": "--color-success",
} as const;

export const fontSize = {
  "display": "clamp(2.9rem, 1.15rem + 7vw, 6.5rem)",
  "h1": "clamp(2.25rem, 1.35rem + 3.9vw, 3.75rem)",
  "h2": "clamp(1.85rem, 1.25rem + 2.4vw, 2.85rem)",
  "h3": "clamp(1.4rem, 1.15rem + 1vw, 1.9rem)",
  "h4": "clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)",
  "body": "clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)",
  "small": "0.875rem",
  "micro": "0.75rem",
} as const;

export const leading = {
  "display": "0.98",
  "heading": "1.12",
  "snug": "1.3",
  "body": "1.65",
  "loose": "1.75",
} as const;

export const tracking = {
  "display": "-0.028em",
  "heading": "-0.02em",
  "body": "0em",
  "caps": "0.14em",
} as const;

export const currency = {
  "code": "TND",
  "symbol": "DT",
  "minorUnitsPerMajor": 1000,
  "maxFractionDigits": 3,
} as const;

export const motion = {
  duration: {
    "fast": "140ms",
    "base": "220ms",
    "slow": "480ms",
    "reveal": "760ms",
  },
  ease: {
    "out": "cubic-bezier(0.22, 1, 0.36, 1)",
    "inOut": "cubic-bezier(0.65, 0, 0.35, 1)",
    "cinematic": "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export const tokens = { brandName, colors, darkColors, cssVar, fontSize, leading, tracking, currency, motion } as const;

export type ColorName = keyof typeof colors;
export type FontSizeName = keyof typeof fontSize;
export type TokenSet = typeof tokens;

/** `cssVarName('brand-dark')` -> `var(--color-brand-dark)` */
export function cssVarName(name: ColorName): string {
  return `var(${cssVar[name]})`;
}
