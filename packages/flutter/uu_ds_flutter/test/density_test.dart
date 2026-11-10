// Density (spec §4.1): Touch giữ đúng kích thước gốc, Compact co theo bảng.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(UuDensity density, Widget child) => MaterialApp(
      theme: uuThemeData(density: density),
      home: Scaffold(body: Center(child: child)),
    );

Future<Size> _size(WidgetTester t, UuDensity d, Widget w, Finder f) async {
  await t.pumpWidget(_wrap(d, w));
  await t.pumpAndSettle(); // đổi theme có animation (AnimatedTheme) — chờ xong mới đo
  return t.getSize(f);
}

void main() {
  testWidgets('TextButton Base: 48 → 32, chữ 16/600 → 13/500', (t) async {
    final f = find.byType(UuTextButton);
    final touch = await _size(t, UuDensity.touch, const UuTextButton(label: 'Tiếp tục'), f);
    final txTouch = t.widget<Text>(find.text('Tiếp tục'));
    expect(touch.height, 48);
    final compact = await _size(t, UuDensity.compact, const UuTextButton(label: 'Tiếp tục'), f);
    expect(compact.height, 32);
    final style = DefaultTextStyle.of(t.element(find.text('Tiếp tục'))).style;
    expect(style.fontSize, 13);
    expect(style.fontWeight, FontWeight.w500);
    expect(txTouch.data, 'Tiếp tục');
  });

  testWidgets('IconButton Large / Small: 56 → 40, 32 → 24', (t) async {
    final f = find.byType(UuIconButton);
    expect((await _size(t, UuDensity.touch, const UuIconButton(icon: 'xmark', label: 'Đóng', size: UuButtonSize.large), f)).height, 56);
    expect((await _size(t, UuDensity.compact, const UuIconButton(icon: 'xmark', label: 'Đóng', size: UuButtonSize.large), f)).height, 40);
    expect((await _size(t, UuDensity.touch, const UuIconButton(icon: 'xmark', label: 'Đóng', size: UuButtonSize.small), f)).height, 32);
    expect((await _size(t, UuDensity.compact, const UuIconButton(icon: 'xmark', label: 'Đóng', size: UuButtonSize.small), f)).height, 24);
  });

  testWidgets('Checkbox 32 → 24 · Switch 56×32 → 40×24', (t) async {
    expect(await _size(t, UuDensity.touch, const UuCheckbox(checked: false), find.byType(UuCheckbox)), const Size(32, 32));
    expect(await _size(t, UuDensity.compact, const UuCheckbox(checked: false), find.byType(UuCheckbox)), const Size(24, 24));
    expect(await _size(t, UuDensity.touch, const UuSwitch(checked: true), find.byType(UuSwitch)), const Size(56, 32));
    expect(await _size(t, UuDensity.compact, const UuSwitch(checked: true), find.byType(UuSwitch)), const Size(40, 24));
  });

  testWidgets('Field 48 → 32', (t) async {
    final f = find.byType(UuFieldShell);
    expect((await _size(t, UuDensity.touch, const SizedBox(width: 300, child: UuTextInput()), f)).height, 48);
    expect((await _size(t, UuDensity.compact, const SizedBox(width: 300, child: UuTextInput()), f)).height, 32);
  });
}
