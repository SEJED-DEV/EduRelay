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
 * @file     apps/web/src/components/listing-cover.tsx
 * @summary  Token-drawn placeholder covers for photo-less listings.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Decorative listing cover.
 *
 * Real listings render photos from Supabase Storage. Until the browse surface
 * is wired to data, the marketing page uses this abstract "shelf" motif built
 * from the brand palette: three book spines in deep teal, teal and amber. It is
 * pure CSS, so it costs nothing and never 404s.
 */

import { cn } from "@edurelay/ui";

interface CoverProps {
  /** 0–2 shifts the spine heights so repeated cards don't look cloned. */
  variant?: 0 | 1 | 2;
  className?: string;
}

const SPINES = [
  { id: "tall-dark", height: "58%", tone: "bg-brand-dark", width: "w-7" },
  { id: "brand", height: "78%", tone: "bg-brand", width: "w-9" },
  { id: "amber", height: "44%", tone: "bg-accent", width: "w-6" },
  { id: "soft-brand", height: "66%", tone: "bg-brand/70", width: "w-8" },
];

export function ListingCover({ variant = 0, className }: CoverProps) {
  const spines = [...SPINES.slice(variant), ...SPINES.slice(0, variant)];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex h-full w-full items-end justify-center overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-brand-light via-surface to-canvas",
        className,
      )}
    >
      {/* Shelf line */}
      <div className="absolute inset-x-6 bottom-[22%] h-px bg-line" />

      <div className="absolute inset-x-8 bottom-[22%] flex items-end justify-center gap-1.5">
        {spines.map((spine) => (
          <div
            key={spine.id}
            className={cn(
              "relative rounded-t-[3px] rounded-b-sm ring-1 ring-ink/15 ring-inset",
              spine.tone,
              spine.width,
            )}
            style={{ height: `calc(${spine.height} * 0.62)` }}
          >
            <span className="absolute inset-x-1 top-2 h-px bg-canvas/30" />
            <span className="absolute inset-x-1 top-4 h-px bg-canvas/20" />
          </div>
        ))}
      </div>

      {/* Soft glow */}
      <div className="absolute -top-10 end-0 size-28 rounded-full bg-brand/20 blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-canvas/40 to-transparent" />
    </div>
  );
}
