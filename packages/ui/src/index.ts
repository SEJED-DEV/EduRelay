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
 * @file     packages/ui/src/index.ts
 * @summary  Public surface of the design system.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Public surface of the EduRelay design system.
 *
 * Components consume design tokens (CSS custom properties generated from
 * packages/brand/brand.config.json) and use logical spacing utilities
 * (ms/me/ps/pe) so Arabic RTL layouts mirror correctly without overrides.
 */

export { Badge, type BadgeProps, type BadgeTone } from "./components/badge";
export { BrandIcon } from "./components/brand-icon";
export { BrandLockup, Wordmark } from "./components/brand-logo";
export {
  BrandSignature,
  type BrandSignatureProps,
  type SignatureSize,
  type SignatureTone,
} from "./components/brand-signature";
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonStyleOptions,
  type ButtonVariant,
  buttonStyles,
} from "./components/button";
export { Price, type PriceProps } from "./components/price";
export { cn } from "./lib/cn";
export {
  type FormatMillimesOptions,
  formatMillimes,
  MILLIMES_PER_DINAR,
  savingsPercent,
  toDinars,
  toMillimes,
} from "./lib/money";
