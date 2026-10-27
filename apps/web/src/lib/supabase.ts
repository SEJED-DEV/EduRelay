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
 * @file     apps/web/src/lib/supabase.ts
 * @summary  Server-only Supabase client that degrades to null when unconfigured.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Server-side Supabase access for read-only pages.
 *
 * Returns null instead of throwing when credentials are absent, so the marketing
 * site still renders on a fresh clone (with honest empty states) before anyone
 * runs `supabase start`. Every caller must handle null.
 *
 * Cookie writes are intentionally a no-op here: Server Components may not mutate
 * cookies. Session refresh belongs in middleware, and public catalogue reads do
 * not need a session.
 */

import "server-only";

import { createSupabaseServerClient, isSupabaseConfigured } from "@edurelay/db";
import { cookies } from "next/headers";

let warned = false;

export async function getServerSupabase() {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production" && !warned) {
      warned = true;
      console.warn(
        "[edurelay] Supabase is not configured. Public pages render empty states. " +
          "Copy .env.example to .env.local and run `supabase start` (see supabase/README.md).",
      );
    }
    return null;
  }

  const store = await cookies();

  return createSupabaseServerClient({
    getAll: () => store.getAll().map(({ name, value }) => ({ name, value })),
    setAll: () => {
      // Server Components cannot write cookies. Middleware owns session refresh.
    },
  });
}
