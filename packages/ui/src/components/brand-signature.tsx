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
 * @file     packages/ui/src/components/brand-signature.tsx
 * @summary  Token-driven brand signature: icon, wordmark, localised tagline.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Brand signature (in-product lockup).
 *
 * Why this exists instead of always using the signed SVG lockup:
 *
 *   1. The signed artwork carries two palettes and switches on
 *      `prefers-color-scheme`. Chromium resolves that from the embedding page,
 *      Firefox from the operating system, so the same page renders the mark
 *      light-on-dark for one visitor and dark-on-light for another. The product
 *      is dark by design, so the mark must be dark by design too.
 *   2. Its tagline is baked in as English SVG text. This component takes the
 *      localised tagline from `brand.config.json`, so French and Arabic read
 *      their own line.
 *   3. Text in the DOM survives text zoom, is selectable and needs no extra
 *      request.
 *
 * The signed SVG lockup remains the source of truth for share cards, the
 * `/design` reference and direct download (see BrandLockup). The icon glyph is
 * still the signed asset: only the wordmark and tagline are set in type.
 *
 * Tones are named after the surface they belong on, not after a colour, so a
 * palette change in `brand.config.json` never leaves a stale tone name behind.
 */

import { brand } from "@edurelay/brand";
import { cn } from "../lib/cn";
import { BrandIcon } from "./brand-icon";

export type SignatureSize = "sm" | "md" | "lg" | "xl";

/** `dual` is the default two-tone mark; the rest are single-colour contexts. */
export type SignatureTone = "dual" | "brand" | "ink" | "accent" | "on-light" | "on-brand";

export interface BrandSignatureProps {
  /** Localised tagline, e.g. `brand.tagline[locale]`. Omit for the icon + name only. */
  tagline?: string;
  size?: SignatureSize;
  tone?: SignatureTone;
  /** Centre the icon above the wordmark instead of placing it beside. */
  stacked?: boolean;
  className?: string;
}

const SIZES: Record<SignatureSize, { icon: number; word: string; gap: string; tagline: string }> = {
  sm: { icon: 26, word: "text-h4", gap: "gap-2.5", tagline: "text-[0.6rem]" },
  md: { icon: 36, word: "text-h3", gap: "gap-3", tagline: "text-[0.66rem]" },
  lg: { icon: 48, word: "text-h2", gap: "gap-4", tagline: "text-micro" },
  xl: { icon: 64, word: "text-h1", gap: "gap-5", tagline: "text-small" },
};

const TONES: Record<SignatureTone, { first: string; second: string; tagline: string }> = {
  dual: { first: "text-brand", second: "text-ink", tagline: "text-muted" },
  brand: { first: "text-brand", second: "text-brand", tagline: "text-brand/70" },
  ink: { first: "text-ink", second: "text-ink", tagline: "text-muted" },
  accent: { first: "text-accent", second: "text-accent", tagline: "text-accent/80" },
  // Light plates: the dark anchor palette is the only readable option.
  "on-light": { first: "text-on-mist", second: "text-on-mist/65", tagline: "text-on-mist/55" },
  "on-brand": { first: "text-on-brand", second: "text-on-brand/70", tagline: "text-on-brand/60" },
};

export function BrandSignature({
  tagline,
  size = "md",
  tone = "dual",
  stacked = false,
  className,
}: BrandSignatureProps) {
  const scale = SIZES[size];
  const palette = TONES[tone];

  return (
    <span
      role="img"
      aria-label={tagline ? `${brand.name} — ${tagline}` : brand.name}
      className={cn(
        "inline-flex select-none",
        stacked ? "flex-col items-center text-center" : "items-center",
        scale.gap,
        className,
      )}
    >
      <BrandIcon size={scale.icon} decorative />

      <span className={cn("flex flex-col", stacked ? "items-center" : "items-start")}>
        <span
          className={cn(
            "font-display leading-none tracking-heading",
            scale.word,
            stacked ? "mt-1" : undefined,
          )}
        >
          {brand.nameParts.map((part) => (
            <span
              key={part.text}
              aria-hidden="true"
              className={cn(
                part.tone === "brand" ? palette.first : palette.second,
                part.tone === "brand" ? "font-bold" : "font-light",
              )}
            >
              {part.text}
            </span>
          ))}
        </span>

        {tagline ? (
          <span
            aria-hidden="true"
            className={cn(
              "mt-1.5 font-mono uppercase leading-snug tracking-caps",
              scale.tagline,
              palette.tagline,
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
