// Bottom sheet (§6.8): cách đáy 12 khi không có safe area; thân cuộn không cắt viền ngoài DNA (§4.3).
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Future<void> _open(WidgetTester t, ThemeData theme, {UuSheetPlacement? placement}) async {
  await t.pumpWidget(MaterialApp(
    theme: theme,
    home: Scaffold(body: Builder(builder: (c) => Center(child: UuTextButton(label: 'Mở', onPressed: () => showUuBottomSheet(c, header: 'Sheet', placement: placement, builder: (_) => const UuTextInput()))))),
  ));
  await t.tap(find.text('Mở'));
  await t.pumpAndSettle();
}

void main() {
  testWidgets('Không safe area đáy: sheet nổi cách đáy màn 12', (t) async {
    await _open(t, uuThemeData());
    final r = t.getRect(find.byType(UuCardSheet));
    expect(t.view.physicalSize.height / t.view.devicePixelRatio - r.bottom, closeTo(UuGap.g3, 0.5));
  });

  testWidgets('Có safe area đáy 34: sheet cách đáy 34 + 12, không cộng hai lần', (t) async {
    t.view.padding = const FakeViewPadding(bottom: 34 * 3);
    addTearDown(t.view.resetPadding);
    await _open(t, uuThemeData());
    final r = t.getRect(find.byType(UuCardSheet));
    expect(t.view.physicalSize.height / t.view.devicePixelRatio - r.bottom, closeTo(34 + UuGap.g3, 0.5));
  });

  testWidgets('DNA viền ngoài 2 + bóng lệch 2 spread 2: thân cuộn chừa 4, ô nhập giữ nguyên vị trí', (t) async {
    await _open(t, uuThemeData());
    final plain = t.getRect(find.byType(UuTextInput));
    Navigator.of(t.element(find.byType(UuTextInput))).pop();
    await t.pumpAndSettle();
    await _open(t, uuThemeData(borderOuterWidth: 2, elevationNone: const [BoxShadow(color: Color(0xFF000000), offset: Offset(2, 2), spreadRadius: 2)]));
    final sv = t.widget<SingleChildScrollView>(find.descendant(of: find.byType(UuCardSheet), matching: find.byType(SingleChildScrollView)));
    expect(sv.padding, const EdgeInsets.all(4));
    expect(t.getRect(find.byType(UuTextInput)).left, plain.left);
    expect(t.getRect(find.byType(UuTextInput)).width, plain.width);
  });

  testWidgets('placement thắng density: Touch + center → giữa màn, rộng tối đa 480; Compact + bottom → sát đáy', (t) async {
    t.view.physicalSize = const Size(1400, 900);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.reset);
    await _open(t, uuThemeData(), placement: UuSheetPlacement.center);
    var r = t.getRect(find.byType(UuCardSheet));
    expect(r.center.dy, closeTo(450, 2));
    expect(r.width, lessThanOrEqualTo(480));
    Navigator.of(t.element(find.byType(UuTextInput))).pop();
    await t.pumpAndSettle();
    await _open(t, uuThemeData(density: UuDensity.compact), placement: UuSheetPlacement.bottom);
    r = t.getRect(find.byType(UuCardSheet));
    expect(900 - r.bottom, closeTo(UuGap.g3, 0.5));
  });
}
