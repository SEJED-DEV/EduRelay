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
 * @file     apps/web/src/components/legal-rich-text.tsx
 * @summary  Turns e-mail addresses and URLs in legal prose into safe links.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Renders a legal-corpus string, turning e-mail addresses and URLs into links.
 *
 * The corpus is authored as plain text with interpolated addresses (see
 * `content/legal.ts`), so the linkification happens here instead of being
 * baked into every paragraph. `mailto:` and `https:` are the only schemes we
 * emit, and every link opens safely.
 */

import { Fragment } from "react";

const TOKEN = /(https?:\/\/[^\s)]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

type Segment =
  | { kind: "text"; value: string }
  | { kind: "email"; value: string }
  | { kind: "url"; value: string };

function segments(text: string): Segment[] {
  const result: Segment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      result.push({ kind: "text", value: text.slice(lastIndex, index) });
    }
    const value = match[0];
    result.push({
      kind: value.includes("@") && !value.startsWith("http") ? "email" : "url",
      value,
    });
    lastIndex = index + value.length;
  }
  if (lastIndex < text.length) {
    result.push({ kind: "text", value: text.slice(lastIndex) });
  }
  return result;
}

const LINK_CLASS =
  "text-brand underline-offset-2 transition-colors hover:text-brand-dark hover:underline";

export function LegalRichText({ text }: { text: string }) {
  let counter = 0;
  return (
    <>
      {segments(text).map((segment) => {
        const key = counter++;
        if (segment.kind === "text") {
          return <Fragment key={key}>{segment.value}</Fragment>;
        }
        if (segment.kind === "email") {
          return (
            <a key={key} href={`mailto:${segment.value}`} className={LINK_CLASS}>
              {segment.value}
            </a>
          );
        }
        return (
          <a
            key={key}
            href={segment.value}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {segment.value}
          </a>
        );
      })}
    </>
  );
}
