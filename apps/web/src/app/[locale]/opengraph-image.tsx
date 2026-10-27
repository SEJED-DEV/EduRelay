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
 * @file     apps/web/src/app/[locale]/opengraph-image.tsx
 * @summary  Open Graph share card rendered as PNG at build time.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Open Graph card.
 *
 * Rendered on the server with `next/og` at build time, so every share gets a
 * real PNG (1200×630) instead of an SVG that most social platforms refuse.
 *
 * The card speaks the brand's English tagline on purpose: the signed lockup does
 * the same, Arabic shaping is not reliable in the OG renderer, and a
 * half-connected Arabic line would look broken. The page itself stays fully
 * localised; only the share image is language-neutral.
 */

import { brand } from "@edurelay/brand";
import { ImageResponse } from "next/og";

export const alt = `${brand.name} — ${brand.tagline.en}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { darkColors } = brand;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "76px",
        backgroundColor: darkColors.canvas,
        backgroundImage: `radial-gradient(900px 620px at 8% -12%, ${darkColors.brand}33, transparent 68%), radial-gradient(760px 520px at 104% 112%, ${darkColors.accent}22, transparent 70%)`,
        color: darkColors.ink,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: darkColors.brand,
          }}
        />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: darkColors.brand,
          }}
        >
          Tunisie · TND
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: -5,
            lineHeight: 1,
          }}
        >
          <span style={{ color: darkColors.brand }}>Edu</span>
          <span style={{ color: darkColors.ink }}>Relay</span>
        </div>

        <div
          style={{
            marginTop: 28,
            maxWidth: 840,
            fontSize: 36,
            lineHeight: 1.35,
            color: darkColors.muted,
          }}
        >
          {brand.tagline.en}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${darkColors.line}`,
          paddingTop: 26,
          fontSize: 24,
          color: darkColors.muted,
        }}
      >
        <span>{brand.domain}</span>
        <span>{brand.contacts.supportEmail}</span>
      </div>
    </div>,
    { ...size },
  );
}
