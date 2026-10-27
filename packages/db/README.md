<!--
  ==============================================================================
  EduRelay — School Supplies · Passed Forward
  Copyright (c) 2026 EduRelay. All rights reserved.
  
  PRIVATE REPOSITORY — CONFIDENTIAL.
  This file is part of a private, proprietary codebase. Access is granted by
  prior written permission from the owner only. If you are reading this without
  that permission you must stop now and delete every copy: you may not view,
  copy, modify, distribute or disclose this file.
  Unauthorised access or use may give rise to civil and/or criminal liability
  under applicable law, including Tunisian intellectual-property law (Law No.
  94-36) and the law on electronic exchanges (Law No. 2000-83).
  
  Code owned by EduRelay · Made by Sejed TRABELSSI
    Portfolio      https://sejed.dev
    Instagram      https://instagram.com/sejed.dev
    Discord        https://discord.gg/sejed.dev
    Dev Community  https://dev.to/sejed.dev
    Facebook       https://facebook.com/TSSEJED
    Mobile         +216 94 155 000
  
  @file     packages/db/README.md
  @summary  How the database package is organised and generated.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# @edurelay/db

Supabase access for EduRelay: clients, validated environment, domain types.

```
src/env.ts      lazy validation (build works without credentials)
src/client.ts   browser client (anon key, RLS applies)
src/server.ts   server clients (SSR cookies, service role)
src/types.ts    domain unions — must match the Postgres enums
src/index.ts    public surface
```

## Clients

| Function                              | Runs on | Key            | RLS |
| ------------------------------------- | ------- | -------------- | --- |
| `createSupabaseBrowserClient()`       | browser | anon           | yes |
| `createSupabaseServerClient(cookies)` | server  | anon + cookies | yes |
| `createSupabaseAdminClient()`         | server  | service role   | no  |

`src/server.ts` imports `server-only`, so a client component that tries to use it
fails at build time instead of shipping a service-role key to the browser.

## Environment

Validation is lazy on purpose. `next build` and the marketing site must work
before Supabase exists; the first call that actually needs credentials throws a
readable error pointing at `.env.local`.

```ts
import { isSupabaseConfigured, getPublicEnv, getServerEnv } from "@edurelay/db";

if (isSupabaseConfigured()) {
  // render the live surface
}
```

## Types

`src/types.ts` is hand-maintained until `supabase gen types` is wired into CI.
Every union there **must** match an enum in
`supabase/migrations/20261026120000_init.sql`. When you add a value:

1. add it to the Postgres enum in a new migration (`alter type ... add value`);
2. add it to the union in `types.ts`;
3. handle the new case in every exhaustive `switch` (TypeScript will tell you).

Money is `bigint`/`number` **millimes**, never a float. Use
`@edurelay/ui`'s `formatMillimes` for display.

## Server actions

Server actions live in `apps/web`, not here: this package stays free of Next.js
specifics so it can also run in scripts and tests. The rule is the same in both
places — a server action validates input with `zod`, then calls Supabase, then
revalidates the affected path.
