# ÚÙ Design System — gói cài đặt

Gói web (React), React Native / Expo và Flutter của **ÚÙ Design System** (UU DS). Tài liệu, spec và Storybook: https://uucreative.co/uu-ds/
File Figma (UU DLS, Figma Community): https://www.figma.com/community/file/1701990688423474087/uu-design-system

| Gói | Thư mục | Cài |
|---|---|---|
| Web (React, Zalo Mini App) | `packages/web` | nhánh `web` (xem dưới) |
| React Native / Expo | `packages/react-native/uu-ds-native` | nhánh `native` (xem dưới) |
| Flutter | `packages/flutter/uu_ds_flutter` | git + `path` |

Repo này được đồng bộ một chiều từ nguồn của UU DS — đừng gửi sửa trực tiếp vào đây. File `*.g.ts` / `*.g.dart`
là file sinh, không sửa tay.

## Web

```bash
npm i "github:buiphamthanhtu/uu-ds#web-v1.0.0"   # hoặc #web để lấy bản mới nhất
```

Hướng dẫn: `packages/web/README.md` (Vite cần `optimizeDeps.exclude: ['uu-ds']`). Gói kèm `docs/` (spec, token,
bản đồ hệ thống) và `AGENTS.md` để AI coding agent của app đọc trong `node_modules/uu-ds/`.

## React Native / Expo

npm không cài được thư mục con từ git, nên mỗi gói npm nằm ở gốc một nhánh riêng (`web`, `native`):

```bash
npx expo install react-native-svg react-native-safe-area-context
npm i "github:buiphamthanhtu/uu-ds#native-v1.0.0"   # hoặc #native để lấy bản mới nhất
```

Chạy được với EAS Build (gói là mã nguồn TypeScript, không cần build). Hướng dẫn dùng, Product DNA, bộ icon riêng:
`packages/react-native/uu-ds-native/README.md`. App mẫu: `packages/react-native/example`.

## Flutter

```yaml
dependencies:
  uu_ds_flutter:
    git:
      url: https://github.com/buiphamthanhtu/uu-ds.git
      path: packages/flutter/uu_ds_flutter
      ref: flutter-v1.0.0   # hoặc main để lấy bản mới nhất
```

Hướng dẫn: `packages/flutter/uu_ds_flutter/README.md`. Widgetbook: `packages/flutter/widgetbook`.

## Icon

Gói chỉ kèm UU icon: icon component dùng cố định và `texture` (icon giữ chỗ). Sản phẩm cần icon thì tự mua
license Nucleo hoặc dùng bộ khác, rồi đăng ký bộ của mình
(Product DNA, spec 4.3). Giấy phép icon: `NOTICE.md`.
