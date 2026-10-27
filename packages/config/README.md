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
  
  @file     packages/config/README.md
  @summary  What the shared tsconfig presets contain and when to change them.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# @edurelay/config

Shared TypeScript presets. No code, no dependencies — just the compiler options
every package would otherwise copy.

| File                          | Used by                      |
| ----------------------------- | ---------------------------- |
| `tsconfig.nextjs.json`        | `apps/web`                   |
| `tsconfig.react-library.json` | `packages/ui`, `packages/db` |

The root `tsconfig.base.json` holds what is common to every package: strict mode,
`bundler` resolution, `ES2022`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`.

## Use

```json
{
  "extends": "@edurelay/config/tsconfig.nextjs.json",
  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }
}
```

Workspace packages extend by relative path
(`"extends": "../config/tsconfig.react-library.json"`) so `tsc` works before
`pnpm install` has linked the package. Apps use the package name because they
always install first.

## Changing a preset

A change here rebuilds every package's typecheck. Run `pnpm typecheck` at the
root, not per package, and expect a wave of new errors if you tighten a flag —
that is the point.
