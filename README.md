# ÚÙ Design system: packages

Web (React), React Native / Expo and Flutter packages for **UU Design system** (UU DS). Docs, specs and Storybook: https://uucreative.co/uu-ds/
UU Design system Figma file (Figma Community): https://www.figma.com/community/file/1701990688423474087/uu-design-system

| Package | Folder | Install |
|---|---|---|
| Web (React, Zalo Mini App) | `packages/web` | `web` branch (see below) |
| React Native / Expo | `packages/react-native/uu-ds-native` | `native` branch (see below) |
| Flutter | `packages/flutter/uu_ds_flutter` | git + `path` |

This repo is synced one way from the UU DS source, so don't send changes here. `*.g.ts` and `*.g.dart` files are
generated; don't edit them by hand.

## Skill for AI

`skills/uu-design-system` is the UU DS skill (specs, tokens, public icons). It lets an AI build UI that follows the system:

```bash
npx skills add buiphamthanhtu/uu-ds --skill uu-design-system
```

Claude on the web or in the app: download https://uucreative.co/uu-ds/uu-design-system.zip, then add it under Settings → Capabilities → Skills.

## Code checker

The web package includes a deterministic checker (no AI calls). When the code is written, run it in a project that has `uu-ds` installed:

```bash
npx uu-ds-check src
```

Fix until critical = 0. Add `--strict` to make CI fail while critical errors remain. It checks web code only.

## Web

```bash
npm i "github:buiphamthanhtu/uu-ds#web-v1.0.1"   # or #web for the latest version
```

Guide: `packages/web/README.md` (Vite needs `optimizeDeps.exclude: ['uu-ds']`). The package ships `docs/` (specs, tokens,
system map) and `AGENTS.md`, so the app's AI coding agent can read them in `node_modules/uu-ds/`.

## React Native / Expo

npm can't install a subfolder from git, so each npm package sits at the root of its own branch (`web`, `native`):

```bash
npx expo install react-native-svg react-native-safe-area-context
npm i "github:buiphamthanhtu/uu-ds#native-v1.0.1"   # or #native for the latest version
```

Works with EAS Build (the package is TypeScript source, with no build step). Usage, Product DNA and custom icon sets:
`packages/react-native/uu-ds-native/README.md`. Example app: `packages/react-native/example`.

## Flutter

```yaml
dependencies:
  uu_ds_flutter:
    git:
      url: https://github.com/buiphamthanhtu/uu-ds.git
      path: packages/flutter/uu_ds_flutter
      ref: flutter-v1.0.1   # or main for the latest version
```

Guide: `packages/flutter/uu_ds_flutter/README.md`. Widgetbook: `packages/flutter/widgetbook`.

## Icons

The packages include only 22 UU icons as examples: the icons components use and `texture` (a placeholder icon). If a
product needs icons, plug in a full set: a free one such as Lucide, or a licensed Nucleo set, and register the whole set
(Product DNA, spec 4.3). Icon licenses: `NOTICE.md`.
