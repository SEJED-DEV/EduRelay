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
 * @file     packages/db/src/env.ts
 * @summary  Validated environment variables (fails fast on boot).
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Environment validation.
 *
 * Validation is LAZY on purpose: `next build` and the marketing page must work
 * before Supabase credentials exist, while any code path that actually talks to
 * the database fails immediately with an actionable message instead of sending
 * `undefined` to the network.
 *
 * Only variables prefixed NEXT_PUBLIC_ may be read in the browser. The service
 * role key must never be imported into a client component.
 */

import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a full URL, e.g. http://127.0.0.1:54321"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(20, "NEXT_PUBLIC_SUPABASE_ANON_KEY looks too short to be a real anon key"),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(20, "SUPABASE_SERVICE_ROLE_KEY is required for admin/server jobs"),
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

let cachedPublic: PublicEnv | null = null;

function readPublic() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/** True when the browser-safe Supabase pair is present. */
export function isSupabaseConfigured(): boolean {
  return publicSchema.safeParse(readPublic()).success;
}

/**
 * Validated public credentials. Throws a readable error when missing, so the
 * failure points at `.env.local` rather than at a 401 from the API.
 */
export function getPublicEnv(): PublicEnv {
  if (cachedPublic) return cachedPublic;

  const parsed = publicSchema.safeParse(readPublic());
  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(
      `Supabase is not configured.\n${issues.join("\n")}\n\nCopy .env.example to .env.local and fill in the values.`,
    );
  }

  cachedPublic = parsed.data;
  return cachedPublic;
}

/** Validated server-only environment, including the service role key. */
export function getServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse({
    ...readPublic(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(`Server environment is incomplete.\n${issues.join("\n")}`);
  }

  return parsed.data;
}
