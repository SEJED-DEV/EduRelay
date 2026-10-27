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
  
  @file     docs/ip-protection.md
  @summary  IP and brand defence checklist, with what is done and what is not.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# IP and brand defence playbook

A practical checklist the owner can run without a law firm on retainer. Each
item points to the file or command that implements it.

## 1. Licence

- [x] Proprietary licence at the root — [LICENSE.md](../LICENSE.md). No rights
  granted by implication; machine-learning use prohibited explicitly.
- [x] Ownership and confidentiality notice — [NOTICE.md](../NOTICE.md).
- [x] License + visibility set in `packages/brand/brand.config.json` (`legal`),
  which feeds the file banners and the footer.

Not legal advice: a licence is only as strong as the evidence that the
unauthorised party saw it. That is what the per-file banner is for.

## 2. In-code attribution

- [x] Every text file carries a banner with the owner, the six contact channels,
  the confidentiality clause and the two Tunisian laws cited.
- [x] `pnpm headers` applies it; `pnpm headers:check` fails CI if a file is
  missing it or was edited by hand.
- [x] Strict JSON uses a top-level `"//"` key (JSON cannot hold comments), and
  only the banner value is rewritten so the file stays formatter-clean;
  `tsconfig` files use `//` comments. `.nvmrc` is skipped because nvm would
  parse the comment as a version, and `next-env.d.ts` is skipped because
  Next.js regenerates it on every dev/build.

## 3. Git history and secrets

- [x] `.gitignore` excludes `.env*`, `*.pem`, `*.key`, `*.p12`, `*.keystore`,
  local Supabase state, build output and `.release/`.
- [ ] Signed commits mandatory (`commit.gpgsign=true`, SSH or GPG key). Setup in
  [CONTRIBUTING.md](../CONTRIBUTING.md#4-commit-signing). Do this before the
  first push.
- [x] Gitleaks rules for Supabase service-role keys, Postgres URLs with a
  password, payment-gateway secrets and Tunisian RIBs —
  [`.gitleaks.toml`](../.gitleaks.toml).
- [ ] Install the pre-commit hook and turn on the CI secret scan:
  `gitleaks git --config .gitleaks.toml --redact`
- [ ] Rotate anything found in history. Rotation comes before investigation.

## 4. Evidence and timestamping

- [x] One-command release hashing — `pnpm release:hash v1.0.0` writes a SHA-256
  manifest of every tracked file plus a bundle hash.
- [ ] Push a signed tag per release (`git tag -s`), keep the archive and the two
  hash files in the owner's vault.
- [x] Brand SVGs keep their C2PA provenance metadata; they are copied verbatim,
  never optimised.
- [ ] Archive the original design sources (Figma `.fig`, raw vector paths, font
  licence PDFs) with dates.
- [ ] Register the wordmark and logo at INAPI before public launch.

## 5. Contractors

- [x] IP assignment template in
  [CONTRIBUTING.md](../CONTRIBUTING.md#5-intellectual-property-assignment-agreement),
  including a moral-rights waiver and an originality warranty.
- [ ] Sign before access is granted. No contract, no repository access.
- [ ] Log the existence of each signed agreement in
  [ownership.md](./ownership.md#7-contributor-log) — name, date, scope only.

## 6. Operational checklist

| #   | Action                                      | Command / file                     | Done           |
| --- | ------------------------------------------- | ---------------------------------- | -------------- |
| 1   | Add licence to every repo                   | `LICENSE.md`                       | yes            |
| 2   | Banners on every file, enforced in CI       | `pnpm headers:check`               | yes            |
| 3   | Secret scan on commit and in CI             | `.gitleaks.toml`                   | config ready   |
| 4   | Signed commits and tags                     | `git config commit.gpgsign true`   | todo           |
| 5   | Hash manifests per release                  | `pnpm release:hash`                | yes            |
| 6   | Store hashes + tag archives off-repo        | owner's vault                      | todo           |
| 7   | IP assignment on file for every contributor | `CONTRIBUTING.md` §5               | template ready |
| 8   | Trademark filing (INAPI)                    | —                                  | todo           |
| 9   | Domain and social handles secured           | `edurelay.tn`, `sejed.dev` handles | yes            |
| 10  | Takedown playbook rehearsed                 | `docs/ownership.md` §6             | yes            |

## 7. What is deliberately _not_ claimed

- No patent application. The product is a marketplace; the moat is execution,
  liquidity and trust, not a patentable mechanism.
- No claim over third-party names (Konnect, Paymee, First Delivery, Supabase,
  Vercel, Next.js, React, Tailwind). See NOTICE.md.
- No "open core". Nothing in this repository is open source.
