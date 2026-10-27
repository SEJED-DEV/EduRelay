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
 * @file     packages/ui/src/components/price.tsx
 * @summary  Price display with struck-through original and savings badge.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

import { cn } from "../lib/cn";
import { formatMillimes, savingsPercent } from "../lib/money";

export interface PriceProps {
  /** Current price in integer millimes. */
  millimes: number;
  /** Optional retail/original price in millimes, shown struck through. */
  originalMillimes?: number;
  locale?: string;
  size?: "sm" | "md" | "lg";
  /** Show the "−45%" savings pill when a discount exists. */
  showSavings?: boolean;
  className?: string;
}

const SIZES = {
  sm: "text-h4",
  md: "text-h3",
  lg: "text-h2",
};

/**
 * Price display.
 *
 * Money always arrives as integer millimes and is formatted for the active
 * locale (see lib/money.ts). Prices are the one place the amber accent is
 * allowed to appear next to teal, because price is the primary decision signal
 * in a marketplace — the savings pill uses `accent`, the amount itself stays
 * ink for legibility.
 */
export function Price({
  millimes,
  originalMillimes,
  locale = "fr-TN",
  size = "md",
  showSavings = true,
  className,
}: PriceProps) {
  const discount = originalMillimes ? savingsPercent(originalMillimes, millimes) : null;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-display font-semibold tracking-heading text-ink tabular-nums",
          SIZES[size],
        )}
      >
        {formatMillimes(millimes, { locale })}
      </span>

      {originalMillimes ? (
        <span className="text-small text-muted line-through tabular-nums">
          {formatMillimes(originalMillimes, { locale })}
        </span>
      ) : null}

      {showSavings && discount !== null ? (
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-micro font-semibold text-accent-dark tabular-nums">
          −{discount}%
        </span>
      ) : null}
    </div>
  );
}
