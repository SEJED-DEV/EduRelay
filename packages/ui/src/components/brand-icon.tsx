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
 * @file     packages/ui/src/components/brand-icon.tsx
 * @summary  Icon-only mark — app icon, favicon, compact headers.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

import { brand } from "@edurelay/brand";
import { cn } from "../lib/cn";

export interface BrandIconProps {
  /** Rendered square size in pixels. */
  size?: number;
  className?: string;
  /**
   * Set when the icon sits next to the wordmark (decorative). Screen readers
   * then ignore it instead of announcing the name twice.
   */
  decorative?: boolean;
}

const ICON_SRC = "/brand/edu-relay-icon.svg";

/**
 * Icon-only mark — the square teal badge with two books, the relay arrow and
 * two figures.
 *
 * Use for: app icon, favicon, avatars, compact mobile headers, loading states,
 * and as the glyph inside `BrandSignature`.
 * Do NOT use for: the landing hero or the footer, where the composed signature
 * (icon + wordmark + localised tagline) belongs (see BrandSignature).
 *
 * Served from /public/brand/edu-relay-icon.svg, which is a verbatim copy of the
 * signed master asset (EduRelay_icon.svg).
 */
export function BrandIcon({ size = 32, className, decorative = false }: BrandIconProps) {
  return (
    <img
      src={ICON_SRC}
      width={size}
      height={size}
      alt={decorative ? "" : `${brand.name} icon`}
      aria-hidden={decorative || undefined}
      className={cn("inline-block shrink-0 select-none rounded-[22%]", className)}
      decoding="async"
    />
  );
}
