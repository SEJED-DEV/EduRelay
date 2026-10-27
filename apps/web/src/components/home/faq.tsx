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
 * @file     apps/web/src/components/home/faq.tsx
 * @summary  Home FAQ: accessible details list plus matching FAQPage schema.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * FAQ, visible and machine-readable.
 *
 * The same five pairs feed the `<details>` list and the `FAQPage` JSON-LD, so the
 * structured data can never describe a question the page does not show. Every
 * answer restates a claim already published on this page (48-hour hold, tracked
 * delivery, free until sold, donations) — nothing is added for the sake of a
 * richer snippet.
 *
 * `<details>` is the whole interaction: keyboard accessible, no JavaScript, and
 * it keeps working when the client bundle fails.
 */

import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, type Question } from "@/lib/structured-data";

const QUESTIONS = [1, 2, 3, 4, 5] as const;

export async function Faq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Faq" });

  const questions: Question[] = QUESTIONS.map((index) => ({
    question: t(`q${index}`),
    answer: t(`a${index}`),
  }));

  return (
    <section id="faq" className="relative border-y border-line/60 bg-surface/25">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p aria-hidden="true" className="font-mono text-micro tracking-caps text-brand/70">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-serif text-h1 leading-heading tracking-heading text-ink">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-[40ch] text-body leading-body text-muted">{t("subtitle")}</p>
          </div>

          <div className="border-t border-line/70">
            {questions.map((item, order) => (
              <details
                key={item.question}
                className="group animate-fade-up stagger-item border-b border-line/70"
                style={{ "--stagger": order + 2 } as CSSProperties}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif text-h3 leading-snug tracking-heading text-ink transition-colors duration-200 group-hover:text-brand">
                    {item.question}
                  </h3>

                  <span
                    aria-hidden="true"
                    className="relative mt-2 grid size-5 shrink-0 place-items-center rounded-full border border-line/80 text-brand transition-colors duration-200 group-hover:border-brand/50"
                  >
                    <span className="absolute h-px w-2.5 bg-current" />
                    <span className="absolute h-2.5 w-px bg-current transition-transform duration-300 group-open:rotate-90" />
                  </span>
                </summary>

                <p className="max-w-[62ch] pb-6 text-body leading-body text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <JsonLd data={{ "@context": "https://schema.org", ...faqSchema(questions) }} />
    </section>
  );
}
