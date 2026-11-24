# uu-ds: ÚÙ Design system for the web

React components with plain CSS, tokens (`tokens.css`) and the public UU icons. Docs: https://uucreative.co/uu-ds/

## Install

```bash
npm i "github:buiphamthanhtu/uu-ds#web-v1.0.1"
```

The package is TypeScript source; your app builds it (Vite, including Zalo Mini App). On install, `prepare` bundles the SVGs
into `src/icons/generated/`. Vite must leave the package out of pre-bundling, because `Icon` uses `import.meta.glob`:

```ts
// vite.config.ts
export default defineConfig({ optimizeDeps: { exclude: ['uu-ds'] } });
```

## Use

```tsx
import 'uu-ds/tokens.css';
import 'uu-ds/base.css';
import { TextButtonAccent, Icon, IconProvider } from 'uu-ds';

<TextButtonAccent prefix="texture">Thêm địa chỉ</TextButtonAccent>
```

- Brand: `<html data-theme="uu">` (Default if not set). Density: `data-density="compact"`.
- Product DNA (spec 4.3): declare it in one `[data-theme="<name>"]` block: the 22 brand tokens, radius, elevation,
  `--font-family-body` / `--font-family-display`, `--border-outer-width` · `--border-outer` · `--elevation-none`.
- Your product's icon set (Lucide, Nucleo…): `<IconProvider icons={{ paw: { outline: '<svg…>' } }}>`. A matching name
  overrides one of the 22 default icons. For a Lucide mapping example, see the Storybook page Icon / Hướng dẫn.

## Code checker

```bash
npx uu-ds-check src            # score 0–100 across 7 dimensions, plus every error with file:line
npx uu-ds-check src --strict   # exits with code 1 while critical errors remain (for CI)
```

The checker is deterministic: no AI calls, no network. Its source of truth is the installed `uu-ds` package. It checks
web code only (tsx/ts/jsx/js/css/html). To allow an exception, put `/* vibe-allow: <rule> — reason */` on the line above it.

Raw tokens: `uu-ds/tokens.json`. Single SVGs: `uu-ds/icons/svg/<name>.svg`.
