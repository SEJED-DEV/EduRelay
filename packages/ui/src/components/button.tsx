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
 * @file     packages/ui/src/components/button.tsx
 * @summary  Primary/secondary/ghost/danger button with RTL-safe spacing.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label; the gap flips automatically in RTL. */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Action button.
 *
 * Colour rules (from docs/brand.md):
 *   primary   — the only colour for "do the thing" actions (brand.DEFAULT)
 *   accent    — reserved for marketplace highlights (prices, boosts), not
 *               generic navigation, so amber never competes with teal
 *   secondary — outlined, on surface, for the alternative choice in a pair
 *   ghost     — tertiary actions in dense UI (tables, cards)
 *   danger    — irreversible actions only
 *
 * Spacing uses logical CSS (padding + gap + flex order), so Arabic RTL mirrors
 * without a single override.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-on-brand shadow-[0_14px_34px_-18px_var(--color-brand)] hover:brightness-110 active:brightness-105",
  secondary:
    "border border-line/90 bg-surface/55 text-ink backdrop-blur-md hover:border-brand/55 hover:bg-surface/80 hover:text-ink",
  ghost: "text-brand-dark hover:bg-brand/10 hover:text-brand-dark",
  accent:
    "bg-accent text-on-accent shadow-[0_14px_34px_-18px_var(--color-accent)] hover:brightness-105 active:brightness-95",
  danger: "bg-danger text-on-danger hover:brightness-105 active:brightness-95",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-full px-4 text-small",
  md: "h-11 gap-2 rounded-full px-5 text-body",
  lg: "h-[3.35rem] gap-2.5 rounded-full px-8 text-h4",
};

const BASE =
  "inline-flex items-center justify-center font-medium leading-none whitespace-nowrap " +
  "transition-[background-color,border-color,color,filter,transform,box-shadow] duration-200 ease-out " +
  "active:translate-y-px " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand " +
  "disabled:pointer-events-none disabled:opacity-50";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Button classes without the element.
 *
 * Needed because a primary action is sometimes a link (navigation) rather than
 * a <button>. Rendering `<Link className={buttonStyles(...)}>` keeps the markup
 * valid — a <button> nested inside an <a> is not.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className);
}

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonStyles({ variant, size, fullWidth, className })} {...rest}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
