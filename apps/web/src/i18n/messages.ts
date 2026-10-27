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
 * @file     apps/web/src/i18n/messages.ts
 * @summary  Part of the EduRelay platform.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Why this exists.
 *
 * `messages/fr.json` and `messages/ar.json` start with the confidential
 * repository banner under the `"//"` key, as required for every tracked file.
 * `NextIntlClientProvider` serialises whatever it receives into the RSC payload
 * inside the HTML, so passing the bundle through as-is would publish the owner's
 * name and personal links on every page. The banner stays in the source file and
 * is removed from the payload here, once, at the boundary.
 */
export function toClientMessages<T extends object>(messages: T): T {
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(messages)) {
    if (key.startsWith("//")) continue;

    clean[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? toClientMessages(value as Record<string, unknown>)
        : value;
  }

  return clean as T;
}
