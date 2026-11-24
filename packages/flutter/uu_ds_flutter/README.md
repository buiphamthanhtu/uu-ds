# uu_ds_flutter

UU Design system for Flutter. It shares one source with the web version: tokens are generated from `docs/tokens.json`, widgets follow `docs/design-system.md`, and UU icons come from `src/icons/svg`.

## Install

```yaml
dependencies:
  uu_ds_flutter:
    path: ../uu-ds/packages/flutter/uu_ds_flutter   # or git: url + path
```

```dart
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

MaterialApp(theme: uuThemeData(), home: ...);
```

## Use

```dart
final c = UuTheme.of(context).colors;                 // semantic tokens. Never use UuPrimitiveColors in a widget
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

State layer: `UuPressable(surface: onDark | onLight)` lays the content color over the widget at opacity 5/10 · 20/40. No Material ripple.

## Product DNA (spec 4.3)

```dart
MaterialApp(theme: uuThemeData(
  fontFamilyBody: 'Inter', fontFamilyDisplay: 'Baloo 2',      // font family only; declare it in the app's pubspec
  borderOuterWidth: 2, borderOuter: ink,                      // outer border on controls and cards, 0 by default
  elevationNone: [BoxShadow(color: ink, offset: Offset(2, 2), spreadRadius: 2)], // control shadow; spread = border width, or the border covers it
  icons: {'paw': UuIconSetEntry(outline: pawSvg, fill: pawFillSvg)}, // custom icon set, overrides by name
));
UuTextButton(label: 'Thêm địa chỉ', type: UuButtonType.outline, prefixIcon: 'texture', onPressed: ...);
```

The outer border and control shadow (buttons, chips, checkboxes, radios, switches, fields, OTP cells) are drawn outside and
take no space; widgets apply them through `UuTheme.of(context).outerShadows`. DNA colors: `copyWith(colors: …)` on the
extension. The Flutter version doesn't take DNA radius or elevation yet (web and React Native do).

## Regenerate tokens

From the repo root: `npm run tokens:dart` (reads `docs/tokens.json` → `lib/src/tokens.g.dart`) and `npm run flutter:icons` (copies the SVGs into `assets/icons`).

## Widgetbook

`packages/flutter/widgetbook`: run `flutter run -d chrome` to browse the widgets. The UU DS bar switches brand, density, layout and DNA.
Web version: https://uucreative.co/uu-ds/widgetbook/

## Test

`flutter test` runs on the Dart VM (Skia). Rendering differs between platforms, so also run rendering tests on the web:
`flutter test --platform chrome test/outer_border_test.dart`. For example, cutting a hole with `Path.combine` passes on Skia but breaks on the web.
