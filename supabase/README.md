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
  
  @file     supabase/README.md
  @summary  Local database workflow: start, migrate, seed, generate types.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Database workflow

The schema is migration-first. Nothing is created by hand in the dashboard:
what is not in `supabase/migrations/` does not exist in production.

## Layout

```
supabase/
├─ config.toml        local stack: ports, auth, storage, seeding
├─ seed.sql           reference data (wilayas, categories, grades, couriers, transitions)
└─ migrations/
   ├─ 20261026120000_init.sql           enums, tables, indexes, state machine, triggers
   ├─ 20261026120100_rls.sql            RLS policies, guards, confirm/dispute RPCs
   └─ 20261026120200_views_storage.sql  read models, buckets, cron jobs
```

## Daily commands

```bash
supabase start                 # boot the stack (Docker required)
supabase db reset              # re-apply every migration + seed.sql
supabase migration new <name>  # new timestamped file
supabase db diff -f <name>     # capture dashboard experiments as a migration
supabase stop                  # stop, keep volumes
supabase stop --no-backup      # stop, drop local data
```

Then copy the local URL and anon key from `supabase status` into
`apps/web/.env.local` (see `.env.example`).

## Rules that are not negotiable

1. **Money is integer millimes.** `bigint`, never `numeric`/`float`. 1 TND = 1000
   millimes. The UI formats; the database never rounds.
2. **The order state machine is data.** `order_status_transitions` plus
   `app.fn_orders_guard()` reject illegal moves for every writer, including the
   service role.
3. **Order amounts are immutable after payment.** Corrections are `refunds`
   rows, not edits.
4. **Every exposed table has RLS.** `payments`, `payment_events`,
   `delivery_events`, `refunds` and `admin_actions` have RLS on with _no_ client
   policy: service role only.
5. **No client writes to `orders`.** Status changes go through RPCs
   (`confirm_order`, `open_dispute`) or webhooks using the service role.
6. **Search is generated.** `search_text` (pg_trgm) and `search_tsv` come from
   `app.fn_search_normalize`, which folds French accents and Arabic alef/taa
   variants. One function, no drift.
7. **Idempotency is a constraint.** `payment_events (provider, provider_event_id)`
   and `delivery_events (delivery_id, provider_event_id)` make webhook replays
   harmless.

## Enum changes

`packages/db/src/types.ts` and the Postgres enums must move together:

```sql
alter type public.order_status add value if not exists 'partially_refunded';
```

`alter type ... add value` cannot run inside a transaction block in older
Postgres; put it in its own migration file.

## Generating types

```bash
supabase gen types typescript --local > packages/db/src/database.types.ts
```

`packages/db/src/types.ts` keeps the hand-written domain unions (enums and
narrowed row shapes). Regenerate `database.types.ts` after every migration and
commit it with the migration.

## Testing RLS

RLS is the security boundary, so it gets tested like one. For each policy, test
the negative case: user A must not read or update user B's row, anon must not
read a draft listing, and a seller must not move an order to `released`.

```sql
-- as a logged-in user, in psql:
set local role authenticated;
set local request.jwt.claims = '{"sub":"<user-uuid>","role":"authenticated"}';
select * from public.orders;            -- must only return own orders
```

Store repeatable checks in `supabase/tests/` and run them with `pgTAP` or a
scripted psql session before a release.

## Backups and PITR

The free tier does not include point-in-time recovery. Before launch, either
enable PITR on the paid tier or run a nightly `pg_dump` to object storage and
verify a restore monthly. A backup you have never restored is a rumour.

## Demo data

`seed.sql` contains a demo listing block guarded by:

```sql
current_setting('edurelay.seed_demo', true) = 'on'
```

That setting is never present in production, so demo rows cannot leak there. To
seed locally, append `alter database postgres set edurelay.seed_demo = 'on';`
after `supabase start`, then `supabase db reset`.
