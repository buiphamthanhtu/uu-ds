# uu_ds_widgetbook

Widgetbook của `uu_ds_flutter`: xem widget Flutter thật của UU DS, chỉnh thuộc tính bằng knob. Storybook chỉ hiển thị bản React,
nên dev Flutter xem widget ở đây.

Bản trên web: https://uucreative.co/uu-ds/widgetbook/ (đi cùng `npm run deploy:site`).

## Chạy

```bash
cd packages/flutter/widgetbook
flutter pub get
flutter run -d chrome        # hoặc -d macos, hoặc một simulator
```

## Build web

```bash
flutter build web --release --base-href /widgetbook/
```

Kết quả nằm trong `build/web/`. Đổi `--base-href` theo đường dẫn sẽ đặt bản build trên site. `npm run deploy:site` tự build với
`--base-href /uu-ds/widgetbook/` và đặt cạnh Storybook; `SKIP_WIDGETBOOK=1` để bỏ qua bước này.

## Thanh addon

- **UU DS**: chọn riêng từng trục.
  - `brand`: Default hoặc UU.
  - `density`: touch hoặc compact.
  - `layout`: expanded hoặc collapsed.
  - `dna`: DNA mẫu. "Viền ngoài + bóng cứng" bật `borderOuterWidth: 2` và `elevationNone`, để xem viền ngoài (spec 4.3) trên control và thẻ.
- **Viewport**: khung iPhone hoặc Android.

## Thêm use case

Mỗi component trong bảng Web ↔ Flutter (trang Phát triển / Flutter) là một `WidgetbookComponent` trong `lib/main.dart`, đặt trong
nhóm chức năng giống sidebar Storybook. Mỗi component có use case `Playground` với knob theo thuộc tính trong spec, và một use case
ma trận hoặc state khi component có nhiều variant. Icon minh hoạ dùng `texture`.
