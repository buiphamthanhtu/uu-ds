# uu-ds — ÚÙ Design System cho web

Component React + CSS thuần, token (`tokens.css`), UU icon công khai. Tài liệu: https://uucreative.co/uu-ds/

## Cài

```bash
npm i "github:buiphamthanhtu/uu-ds#web-v1.0.0"
```

Gói là mã nguồn TypeScript, app tự build (Vite, kể cả Zalo Mini App). Khi cài, `prepare` gom SVG thành bundle icon
(`src/icons/generated/`). Vite phải để gói ngoài pre-bundle vì `Icon` dùng `import.meta.glob`:

```ts
// vite.config.ts
export default defineConfig({ optimizeDeps: { exclude: ['uu-ds'] } });
```

## Dùng

```tsx
import 'uu-ds/tokens.css';
import 'uu-ds/base.css';
import { TextButtonAccent, Icon, IconProvider } from 'uu-ds';

<TextButtonAccent prefix="texture">Thêm địa chỉ</TextButtonAccent>
```

- Brand: `<html data-theme="uu">` (mặc định Default). Density: `data-density="compact"`.
- Product DNA (spec 4.3): khai trong một khối `[data-theme="<tên>"]` — 23 token thương hiệu, bo góc, elevation,
  `--font-family-body` / `--font-family-display`, `--border-outer-width` · `--border-outer` · `--elevation-none`.
- Bộ icon riêng: `<IconProvider icons={{ paw: { outline: '<svg…>' } }}>` — tên trùng ghi đè bộ mặc định.

Token thô: `uu-ds/tokens.json`. SVG lẻ: `uu-ds/icons/svg/<tên>.svg`.
