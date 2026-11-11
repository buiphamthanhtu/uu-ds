# uu-ds — ÚÙ Design system cho web

Component React + CSS thuần, token (`tokens.css`), UU icon công khai. Tài liệu: https://uucreative.co/uu-ds/

## Cài

```bash
npm i "github:buiphamthanhtu/uu-ds#web-v1.1.0"
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

## Chấm code

```bash
npx uu-ds-check src            # báo cáo điểm 0–100 theo 7 chiều và từng lỗi kèm file:dòng
npx uu-ds-check src --strict   # thoát mã 1 khi còn lỗi critical (dùng cho CI)
```

Bộ chấm tất định, không gọi AI, không cần mạng; nguồn sự thật là gói `uu-ds` đã cài. Chỉ chấm code web
(tsx/ts/jsx/js/css/html). Miễn trừ có lý do: `/* vibe-allow: <luật> — vì sao */` ngay trên dòng vi phạm.

Token thô: `uu-ds/tokens.json`. SVG lẻ: `uu-ds/icons/svg/<tên>.svg`.
