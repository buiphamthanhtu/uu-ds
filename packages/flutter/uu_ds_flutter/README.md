# uu_ds_flutter

ÚÙ Design System cho Flutter. Cùng nguồn với bản web: token sinh từ `docs/tokens.json`, widget theo `docs/design-system.md`, icon UU icon từ `src/icons/svg`.

## Cài

```yaml
dependencies:
  uu_ds_flutter:
    path: ../uu-ds/packages/flutter/uu_ds_flutter   # hoặc git: url + path
```

```dart
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

MaterialApp(theme: uuThemeData(), home: ...);
```

## Dùng

```dart
final c = UuTheme.of(context).colors;                 // token semantic — KHÔNG dùng UuPrimitiveColors trong widget
UuTextButton(label: 'Tiếp tục', size: UuButtonSize.large, suffixIcon: 'chevron-right', onPressed: ...);
UuTextInput(label: 'Số điện thoại', requirement: UuRequirement.required, prefixLabel: '+84');
UuIcon('texture', variant: UuIconVariant.fill, size: 24);
showUuBottomSheet(context, header: 'Xoá tài khoản', builder: (_) => ..., cta: UuButtonGroup(primary: UuGroupAction('Xoá', onPressed: ...)));
```

| Web (React) | Flutter |
|---|---|
| `TextButtonAccent` / `TextButtonNeutral` | `UuTextButton(tone: accent \| neutral)` |
| `IconButtonAccent` / `IconButtonNeutral` | `UuIconButton` |
| `ToggleButton` · `SegmentedControl` | `UuToggleButton` · `UuSegmentedControl` |
| `TextInput` · `TextArea` · `OTPInput` | `UuTextInput` · `UuTextArea` · `UuOTPInput` |
| `DateInput` · `Dropdown` | `UuDateInput` · `UuDropdown` |
| `Checkbox` · `CheckboxInput` · `Radio` · `RadioInput` · `RadioList` | `UuCheckbox` · `UuCheckboxInput` · `UuRadio` · `UuRadioInput` · `UuRadioList` |
| `ListItem` · `ListGroup` | `UuListItem` (`UuListSelection.checkbox` / `.radio` / `.switcher`, `UuListChevron`, `UuListValue`, `UuListIconContainer`, `UuListAction`) · `UuListGroup` |
| `NavigationBar` · `BottomBar` · `Pagination` | `UuNavigationBar` · `UuBottomBar` · `UuPagination` |
| `Toast` · `ButtonGroup` | `UuToast` / `showUuToast` · `UuButtonGroup` |
| `BaseSheet` / `BottomSheet` · `BaseDialog` / `Dialog` | `UuBaseSheet` / `showUuBottomSheet` · `UuBaseDialog` / `showUuDialog` |
| `Spinner` · `Icon` | `UuSpinner` · `UuIcon` |

State layer: `UuPressable(surface: onDark | onLight)` — lớp phủ màu content opacity 5/10 · 20/40. Không ripple Material.

## Product DNA (spec 4.3)

```dart
MaterialApp(theme: uuThemeData(
  fontFamilyBody: 'Inter', fontFamilyDisplay: 'Baloo 2',      // chỉ họ font — khai trong pubspec của app
  borderOuterWidth: 2, borderOuter: ink,                      // viền ngoài control + thẻ, mặc định 0
  elevationNone: [BoxShadow(color: ink, offset: Offset(2, 2), spreadRadius: 2)], // bóng control; spread = độ dày viền, không thì bị viền che
  icons: {'paw': UuIconSetEntry(outline: pawSvg, fill: pawFillSvg)}, // bộ icon riêng, ghi đè theo tên
));
UuTextButton(label: 'Thêm địa chỉ', type: UuButtonType.outline, prefixIcon: 'texture', onPressed: ...);
```

Viền ngoài + bóng control (nút, chip, checkbox, radio, switch, ô nhập, ô OTP) vẽ bên ngoài, không chiếm chỗ; widget gắn
qua `UuTheme.of(context).outerShadows`. Màu DNA: `copyWith(colors: …)` trên extension. Bản Flutter chưa nhận DNA
bo góc và elevation (bản web và React Native đã có).

## Sinh lại token

Từ gốc repo: `npm run tokens:dart` (đọc `docs/tokens.json` → `lib/src/tokens.g.dart`) và `npm run flutter:icons` (copy SVG vào `assets/icons`).

## Widgetbook

`packages/flutter/widgetbook`: chạy `flutter run -d chrome` để duyệt widget, thanh UU DS đổi brand, density, layout, DNA.
Bản web: https://uucreative.co/uu-ds/widgetbook/

## Test

`flutter test` chạy trên máy ảo Dart (Skia). Phần vẽ khác nhau giữa các nền tảng, nên chạy thêm bản web cho các test vẽ:
`flutter test --platform chrome test/outer_border_test.dart`. Ví dụ: cắt lỗ bằng `Path.combine` qua được trên Skia nhưng hỏng trên web.
