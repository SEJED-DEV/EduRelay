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
 * @file     packages/db/src/server.ts
 * @summary  Server Supabase clients (SSR cookies + service role).
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Server-side Supabase clients.
 *
 * Two flavours, deliberately separate:
 *
 *   createSupabaseServerClient(cookies)
 *     Runs as the signed-in user. RLS applies. Use for every Server Component,
 *     Server Action and Route Handler that acts on behalf of a user.
 *
 *   createSupabaseAdminClient()
 *     Runs as the service role, BYPASSES RLS. Only for trusted background jobs:
 *     payment/courier webhooks, the 48h release sweep, moderation exports.
 *     Never import this from a client component and never re-export it from a
 *     module that a "use client" file can reach.
 *
 * The cookie adapter is injected rather than imported from next/headers so this
 * package stays framework-agnostic and testable.
 */

import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, getServerEnv } from "./env";

export interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export interface CookieAdapter {
  getAll(): { name: string; value: string }[];
  setAll(cookies: CookieToSet[]): void;
}

/** Request-scoped client that carries the user's session and respects RLS. */
export function createSupabaseServerClient(cookies: CookieAdapter) {
  const env = getPublicEnv();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (cookiesToSet: CookieToSet[]) => cookies.setAll(cookiesToSet),
    },
  });
}

/**
 * Privileged client for jobs that must operate across users. Server-only.
 * Never cache or share the returned instance across requests.
 */
export function createSupabaseAdminClient() {
  const env = getServerEnv();

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
