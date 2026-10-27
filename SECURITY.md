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
  
  @file     SECURITY.md
  @summary  How to report a vulnerability, and the handling commitments.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Security Policy

EduRelay handles money and personal data (identity, phone, address). A
vulnerability here is never "just a bug".

## Supported versions

Only the current production deployment of `edurelay.tn` is supported. This
repository is private; there are no public releases to patch.

## How to report a vulnerability

Please report privately and give us a reasonable window to fix it before any
public disclosure.

| Channel   | Detail                                                        |
| --------- | ------------------------------------------------------------- |
| Email     | security@edurelay.tn                                          |
| Phone     | +216 94 155 000                                               |
| Subject   | `[SECURITY] <short description>`                              |
| Encrypted | Ask for our PGP key in a first email without technical detail |

Include, as far as you can:

1. the affected URL, endpoint or file;
2. the impact you believe it has (data read, money moved, account taken over);
3. reproduction steps, with test accounts you created yourself;
4. any proof-of-concept, logs or screenshots;
5. whether you plan to publish, and when.

## Our commitments

- Acknowledgement within **72 hours** (business days in Tunisia).
- A triage decision and severity within **7 days**.
- A fix plan with an estimated date for anything rated high or critical.
- Credit in the release notes if you want it.
- We will not pursue legal action against a researcher who acts in good faith,
  stays within the scope below, and reports privately first.

## Scope

In scope:

- `https://edurelay.tn` and its subdomains;
- authentication, session and role handling (buyer / seller / admin);
- payment, refund, payout and escrow-window logic;
- Row Level Security policies and RPCs in `supabase/migrations/`;
- storage buckets and signed-URL handling;
- permission to act on another user's listing, order or address.

Out of scope:

- denial of service, volumetric or load testing;
- social engineering of staff or users;
- physical attacks, or attacks on a courier's own systems;
- vulnerabilities in third-party providers (report them upstream, but tell us);
- automated scanner output with no demonstrated impact;
- missing security headers with no exploit path (tell us anyway, lower priority).

## Rules of engagement

- Create your own accounts and listings. Never touch another person's data.
- Never move real money, never place a real order, never publish a listing that
  is not yours.
- Do not exfiltrate data beyond the minimum needed to prove the issue. If you
  reach production data, stop and report.
- Do not run destructive tests (deleting rows, changing prices, approving
  payouts).
- No public disclosure before a fix ships, or before 90 days have passed,
  whichever comes first, unless we agree otherwise in writing.

## What we do after a report

1. Reproduce and rate severity (CVSS 3.1 plus a money/data impact judgement).
2. Contain: revoke keys, rotate secrets, disable the affected flow if needed.
3. Fix and add a regression test where the stack allows it.
4. Notify affected users if personal data or money was exposed, as required by
   applicable Tunisian law.
5. Publish a short post-mortem internally, and publicly when the report was
   external.

## Secrets

Secrets live in environment variables only. If you find a key, token or password
committed to this repository, treat it as compromised and report it immediately;
we rotate first and investigate second.

## Contact for non-security issues

hello@edurelay.tn — or see [NOTICE.md](./NOTICE.md) for ownership questions.
