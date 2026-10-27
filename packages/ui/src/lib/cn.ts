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
 * @file     packages/ui/src/lib/cn.ts
 * @summary  Tiny class-name joiner used by every component.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Joins conditional class names.
 *
 * Deliberately dependency-free: the design system only needs to drop falsy
 * values and join the rest, so pulling in clsx/tailwind-merge is unnecessary
 * weight. Last-wins conflict resolution is handled by predictable token usage
 * (variant maps), not by runtime merging.
 */
export type ClassValue = string | number | null | undefined | false;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
