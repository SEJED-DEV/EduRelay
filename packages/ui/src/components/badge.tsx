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
 * @file     packages/ui/src/components/badge.tsx
 * @summary  Status, condition and category pills.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type BadgeTone = "brand" | "accent" | "neutral" | "success" | "danger";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  /** Uppercase micro-label treatment, used for condition and status. */
  caps?: boolean;
}

/**
 * Small pill for listing condition, order status and category labels.
 *
 * Tones are semantic, never decorative: `accent` is only for money-adjacent
 * highlights (savings, featured), `neutral` for metadata, `success` for a
 * confirmed order, `danger` for a dispute or a blocked listing.
 */
const TONES: Record<BadgeTone, string> = {
  brand: "border border-brand/25 bg-brand/15 text-brand-dark",
  accent: "border border-accent/30 bg-accent/15 text-accent-dark",
  neutral: "border border-ink/10 bg-ink/[0.06] text-muted",
  success: "border border-success/30 bg-success/15 text-success",
  danger: "border border-danger/30 bg-danger/15 text-danger",
};

export function Badge({ children, tone = "neutral", caps = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-micro font-medium leading-none backdrop-blur-md",
        caps && "uppercase tracking-caps",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
