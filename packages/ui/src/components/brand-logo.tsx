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
 * @file     packages/ui/src/components/brand-logo.tsx
 * @summary  Full lockup (icon + wordmark + tagline) for hero/footer/OG use.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

import { brand } from "@edurelay/brand";
import type { CSSProperties } from "react";
import { cn } from "../lib/cn";

const LOCKUP_SRC = "/brand/edu-relay-logo.svg";
const LOCKUP_RATIO = 340 / 680; // viewBox is 0 0 680 340

export interface BrandLockupProps {
  /** Rendered width in pixels; height follows the 2:1 viewBox ratio. */
  width?: number;
  className?: string;
  /** Include the tagline in the accessible name. The artwork always shows it. */
  tagline?: boolean;
  /** Override the embedded SVG's `prefers-color-scheme` resolution. */
  style?: CSSProperties;
}

/**
 * Full lockup — icon + "EduRelay" wordmark (+ optional tagline).
 *
 * Use for: share cards, the `/design` reference, print, pitch decks and any
 * square-ish or decorative placement where the name must read as one image.
 * Never stretch it, never place it inside a square container, and keep at least
 * 24px of clear space on every side.
 *
 * For in-product surfaces (hero, footer, navigation) use `BrandSignature`
 * instead: the signed artwork carries its own `prefers-color-scheme` palettes
 * and an English tagline, neither of which can follow the dark UI or the
 * visitor's language.
 *
 * Served from /public/brand/edu-relay-logo.svg (verbatim copy of
 * EduRelay_logo.svg, C2PA metadata intact).
 */
export function BrandLockup({ width = 320, className, tagline = true, style }: BrandLockupProps) {
  return (
    <img
      src={LOCKUP_SRC}
      width={width}
      height={Math.round(width * LOCKUP_RATIO)}
      alt={`${brand.name} — ${tagline ? brand.tagline.en : ""}`.trim()}
      className={cn("block select-none", className)}
      decoding="async"
      style={style}
    />
  );
}

export interface WordmarkProps {
  className?: string;
  /** Type scale step; the trailing word stays lighter, as in the SVG. */
  size?: "sm" | "md" | "lg";
}

const WORDMARK_SIZES = {
  sm: "text-h4",
  md: "text-h3",
  lg: "text-h2",
};

/**
 * HTML wordmark — the two-tone "Edu" (brand) + "Relay" (ink) treatment built
 * from `brand.nameParts`.
 *
 * Prefer this over the SVG lockup inside navigation bars: it inherits the
 * interface font, survives text zoom, is selectable, and renames itself when
 * `packages/brand/brand.config.json` changes.
 */
export function Wordmark({ className, size = "md" }: WordmarkProps) {
  return (
    <span
      role="img"
      aria-label={brand.name}
      className={cn("font-display leading-none tracking-heading", WORDMARK_SIZES[size], className)}
    >
      {brand.nameParts.map((part) => (
        <span
          key={part.text}
          aria-hidden="true"
          className={cn(
            part.tone === "brand" ? "text-brand" : "text-ink",
            part.tone === "brand" ? "font-bold" : "font-light",
          )}
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}
