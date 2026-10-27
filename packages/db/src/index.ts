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
 * @file     packages/db/src/index.ts
 * @summary  Public surface of the data-access package.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Public surface of the data-access package.
 *
 * Import rules — the subpaths exist so a client bundle never pulls in
 * `server-only`:
 *   - Anywhere (client or server): types, money helpers, `isSupabaseConfigured`
 *     from `@edurelay/db/env`
 *   - Server only: `createSupabaseServerClient`, `createSupabaseAdminClient`,
 *     and everything re-exported from this module
 *   - Client components: `getSupabaseBrowserClient` from `@edurelay/db/client`
 */

export {
  type FetchListingsOptions,
  fetchPlatformStats,
  fetchPublicListings,
  listingPhotoUrl,
} from "./catalog";
export { getSupabaseBrowserClient } from "./client";
export {
  getPublicEnv,
  getServerEnv,
  isSupabaseConfigured,
  type PublicEnv,
  type ServerEnv,
} from "./env";
export {
  type CookieAdapter,
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "./server";
export type * from "./types";
