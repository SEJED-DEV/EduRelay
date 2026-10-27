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
 * @file     packages/brand/generated/brand.ts
 * @summary  Generated public brand config — do not edit by hand.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/* AUTO-GENERATED from packages/brand/brand.config.json. Run `pnpm theme`. */

/* Public identity only. Ownership and personal contact details stay in the
   source config so they can never be serialised into a client bundle. */
export const brandConfig = {
  "name": "EduRelay",
  "nameParts": [
    {
      "text": "Edu",
      "tone": "brand"
    },
    {
      "text": "Relay",
      "tone": "ink"
    }
  ],
  "tagline": {
    "fr": "Fournitures scolaires · Transmises",
    "ar": "مستلزمات مدرسية · تنتقل من يد إلى يد",
    "en": "School Supplies · Passed Forward"
  },
  "description": {
    "fr": "La place de marché tunisienne des fournitures scolaires d'occasion. Achetez, vendez et donnez, en toute confiance.",
    "ar": "سوق تونسي للمستلزمات المدرسية المستعملة. اشترِ، بِع، وتبرّع بثقة.",
    "en": "Tunisia's marketplace for second-hand school supplies. Buy, sell and donate with confidence."
  },
  "domain": "edurelay.tn",
  "siteUrl": "https://edurelay.tn",
  "contacts": {
    "supportEmail": "hello@edurelay.tn",
    "securityEmail": "security@edurelay.tn"
  },
  "colors": {
    "brand": "#1D9E75",
    "brand-dark": "#085041",
    "brand-light": "#E1F5EE",
    "accent": "#EF9F27",
    "accent-dark": "#633806",
    "ink": "#2C2C2A",
    "muted": "#888780",
    "canvas": "#FBFAF7",
    "surface": "#FFFFFF",
    "elevated": "#F4F2EC",
    "line": "#E7E4DA",
    "on-brand": "#04241A",
    "on-accent": "#2A1804",
    "mist": "#E1F5EE",
    "on-mist": "#0A241C",
    "danger": "#DC2626",
    "on-danger": "#FFFFFF",
    "success": "#16A34A"
  },
  "darkColors": {
    "brand": "#43D9A6",
    "brand-dark": "#A9F2D8",
    "brand-light": "#0C2A22",
    "accent": "#F7B65C",
    "accent-dark": "#FFD9A8",
    "ink": "#EAF4EF",
    "muted": "#9AAEA5",
    "canvas": "#060D0B",
    "surface": "#0A1512",
    "elevated": "#0F1E19",
    "line": "#1D2F28",
    "on-brand": "#04231A",
    "on-accent": "#2A1804",
    "mist": "#E1F5EE",
    "on-mist": "#0A241C",
    "danger": "#FF8F8F",
    "on-danger": "#2A0A0A",
    "success": "#5FE3A1"
  },
  "typography": {
    "$comment": "Pairing: Fraunces (variable, high-contrast editorial serif) for display; Manrope (geometric, warm, modern) for UI and body Latin; Tajawal for Arabic; Geist Mono for eyebrow labels, indices and numerals. Fallbacks are explicit so a missing webfont degrades to the closest system face instead of jumping metrics.",
    "fonts": {
      "latin": {
        "family": "Manrope",
        "variable": "--font-latin-loaded",
        "fallback": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
      },
      "serif": {
        "family": "Fraunces",
        "variable": "--font-serif-loaded",
        "fallback": "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, 'Times New Roman', serif"
      },
      "arabic": {
        "family": "Tajawal",
        "variable": "--font-arabic-loaded",
        "fallback": "'Noto Kufi Arabic', 'Segoe UI', Tahoma, 'Geeza Pro', 'Arabic Typesetting', sans-serif"
      },
      "mono": {
        "family": "Geist Mono",
        "variable": "--font-mono-loaded",
        "fallback": "ui-monospace, SFMono-Regular, 'Cascadia Mono', Consolas, 'Liberation Mono', monospace"
      }
    },
    "scale": {
      "$comment": "Fluid modular scale (perfect fourth at the top, minor third for UI). Each value is a clamp() so type never jumps between breakpoints. The display step is deliberately oversized: the hero is the one place the product raises its voice.",
      "display": "clamp(2.9rem, 1.15rem + 7vw, 6.5rem)",
      "h1": "clamp(2.25rem, 1.35rem + 3.9vw, 3.75rem)",
      "h2": "clamp(1.85rem, 1.25rem + 2.4vw, 2.85rem)",
      "h3": "clamp(1.4rem, 1.15rem + 1vw, 1.9rem)",
      "h4": "clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)",
      "body": "clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)",
      "small": "0.875rem",
      "micro": "0.75rem"
    },
    "leading": {
      "display": "0.98",
      "heading": "1.12",
      "snug": "1.3",
      "body": "1.65",
      "loose": "1.75"
    },
    "tracking": {
      "display": "-0.028em",
      "heading": "-0.02em",
      "body": "0em",
      "caps": "0.14em"
    },
    "measure": {
      "body": "68ch",
      "tight": "46ch"
    }
  },
  "motion": {
    "$comment": "Motion tokens. Durations stay short enough to feel responsive, easing is a decelerating curve so content arrives rather than slides. `reveal` is reserved for the large editorial entrances; `cinematic` is a longer, slower deceleration for ambient drift. Every animation is disabled by the global prefers-reduced-motion reset.",
    "duration": {
      "fast": "140ms",
      "base": "220ms",
      "slow": "480ms",
      "reveal": "760ms"
    },
    "ease": {
      "out": "cubic-bezier(0.22, 1, 0.36, 1)",
      "inOut": "cubic-bezier(0.65, 0, 0.35, 1)",
      "cinematic": "cubic-bezier(0.16, 1, 0.3, 1)"
    }
  },
  "locale": {
    "default": "fr",
    "locales": [
      "fr",
      "ar"
    ],
    "labels": {
      "fr": "Français",
      "ar": "العربية"
    },
    "dir": {
      "fr": "ltr",
      "ar": "rtl"
    }
  },
  "currency": {
    "code": "TND",
    "symbol": "DT",
    "minorUnitsPerMajor": 1000,
    "maxFractionDigits": 3
  },
  "legal": {
    "entityName": "EduRelay",
    "jurisdiction": "Tunisia",
    "license": "Proprietary — all rights reserved",
    "repoVisibility": "private",
    "notice": "Private and confidential. Access is granted by prior written permission only. Unauthorised access, copying, modification, distribution or disclosure is prohibited and may give rise to civil and/or criminal liability under applicable law, including Tunisian intellectual-property law (Law No. 94-36) and the law on electronic exchanges (Law No. 2000-83)."
  }
} as const;

export type BrandConfig = typeof brandConfig;
