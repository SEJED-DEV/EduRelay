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
  
  @file     docs/adr/0001-payments-and-escrow.md
  @summary  ADR: how buyer protection works without true escrow.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# ADR 0001 — Buyer protection without claiming to be an escrow

- **Status:** accepted, with one open dependency
- **Date:** 2026-10-26
- **Deciders:** owner (product + engineering)
- **Open dependency:** provider capability and legal classification, both to be
  confirmed in writing before the phase 3 gate

## Context

The original plan said "escrow via Konnect". Two things are true at once:

1. Buyers will not send money to a stranger for a second-hand book, so some form
   of buyer protection is mandatory.
2. "Escrow" is a regulated activity in most jurisdictions. A payment provider
   that lets a platform _hold_ funds is not necessarily an escrow agent, and the
   platform may need a licence, a segregated account, or a partner that is
   authorised to do it.

We have not verified (as of this date) that Konnect or Paymee offers a legal
split-payment/held-funds product for Tunisian marketplaces, nor what KYC applies
to the platform or to individual sellers. Writing code that assumes the answer is
"yes" would be the expensive mistake.

## Decision

Build the **product behaviour** of buyer protection now, and keep the **money
movement** behind an adapter whose contract can change without touching the
domain model.

Concretely:

1. An order has a `paid_held` state. Money is considered received but not owed.
2. Delivery starts a **48-hour** confirmation window
   (`orders.confirm_deadline_at`), set by the courier's delivered event.
3. The buyer can confirm early. Otherwise a pg_cron sweep moves
   `delivered → released`.
4. A dispute freezes release; only an admin resolves it.
5. `payouts` is an explicit, auditable request/approve/pay cycle. Seller balances
   are **derived** (`seller_balance()`), never stored as a mutable number.
6. Refunds are rows, not edits: `refunds` with their own status machine.
7. COD is a first-class method: `deliveries.cod_amount_millimes` plus
   `cod_remitted_at` make courier cash reconcilable per order.

The platform therefore behaves like an escrow to the user, while the legal
question — who actually holds the money — stays a configuration choice:

- **Provider-held funds** (preferred if legally available): the PSP holds and
  releases on our instruction.
- **Platform-account funds** (fallback): money lands in the company account, we
  pay out on a schedule, and the terms say so plainly instead of implying
  protection we cannot legally provide.
- **Manual payout ledger** (always): even with a provider API, the payout cycle is
  reconciled by a human until volume justifies automation.

## Consequences

**Good**

- The domain model does not change if the provider answer is "no".
- The buyer sees a concrete promise (48 h after delivery) rather than a vague
  "secure payment".
- Every money movement leaves a row: payment, refund, payout, COD remittance.
- COD works from day one, which matters more than card payments for this market.

**Bad / accepted**

- Until the provider question is answered, the terms must not use the word
  "escrow". The UI says "paiement retenu 48 h" / "الدفع محتجز 48 ساعة".
- A platform-account model creates a reconciliation burden and a float risk: money
  sits in the company account while sellers are owed. This must be tracked daily.
- 48 hours is a product promise, not a legal guarantee. If the courier lies about
  delivery, we eat the loss and chase the courier.
- Refund execution may be manual at first, which means an SLA that depends on a
  human.

## Alternatives considered

| Alternative                             | Why rejected                                                 |
| --------------------------------------- | ------------------------------------------------------------ |
| True escrow via a licensed provider     | May not exist for this market at our size; blocks launch     |
| Stripe Connect                          | Not generally available to Tunisian entities                 |
| No protection, cash only                | Kills online demand and makes disputes unwinnable            |
| Hold funds in a segregated account      | Requires legal structure and banking agreement before launch |
| Release on shipment instead of delivery | Protects nobody; the classic marketplace failure             |

## Verification checklist (must close before phase 3)

- [ ] Written confirmation from the provider on held/split funds and their legal
  classification.
- [ ] KYC requirements for the platform and for sellers.
- [ ] Refund fees and who pays them.
- [ ] Whether interest on held funds creates a regulatory issue.
- [ ] Accountant's view on revenue recognition (commission at release, not at
  payment).
- [ ] Terms of service reviewed by Tunisian counsel; the word "escrow" either
  justified or removed everywhere.

If the answer is "provider cannot hold funds", the decision stands — only the
adapter and the terms change.
