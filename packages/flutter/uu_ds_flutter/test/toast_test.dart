// Toast (§6.6): đáy màn, và nổi trên scrim + sheet khi bottom sheet / dialog đang mở (§6.8).
import 'dart:ui' show SemanticsAction;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _app(Widget Function(BuildContext) body) => MaterialApp(
      theme: uuThemeData(),
      home: Scaffold(body: Builder(builder: (c) => Center(child: body(c)))),
    );

void main() {
  testWidgets('Không có sheet: Toast hiện ở đáy, tự ẩn sau thời gian', (t) async {
    await t.pumpWidget(_app((c) => UuTextButton(label: 'Lưu', onPressed: () => showUuToast(c, content: 'Đã lưu'))));
    await t.tap(find.text('Lưu'));
    await t.pumpAndSettle();
    expect(find.text('Đã lưu').hitTestable(), findsOneWidget);
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
    expect(find.text('Đã lưu'), findsNothing);
  });

  testWidgets('Sheet đang mở: Toast nổi trên sheet, bấm được nút đóng, tự ẩn', (t) async {
    await t.pumpWidget(_app((c) => UuTextButton(
          label: 'Mở',
          onPressed: () => showUuBottomSheet(c, header: 'Sheet', builder: (sc) => UuTextButton(label: 'Sao chép', onPressed: () => showUuToast(sc, content: 'Đã sao chép'))),
        )));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    await t.tap(find.text('Sao chép'));
    await t.pumpAndSettle();
    expect(find.text('Đã sao chép').hitTestable(), findsOneWidget);
    // Toast nằm trên sheet: đáy Toast thấp hơn header sheet, và vẫn nhận chạm.
    expect(t.getRect(find.text('Đã sao chép')).top, greaterThan(t.getRect(find.text('Sheet')).top));
    expect(find.bySemanticsLabel('Đóng').hitTestable(), findsWidgets);
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
    expect(find.text('Đã sao chép'), findsNothing);
    expect(find.text('Sheet'), findsOneWidget, reason: 'sheet vẫn mở');
  });

  testWidgets('Sheet đang mở: Toast mới thay Toast cũ', (t) async {
    late BuildContext sheetCtx;
    await t.pumpWidget(_app((c) => UuTextButton(
          label: 'Mở',
          onPressed: () => showUuBottomSheet(c, header: 'Sheet', builder: (sc) {
            sheetCtx = sc;
            return const Text('Nội dung');
          }),
        )));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    showUuToast(sheetCtx, content: 'Toast A');
    await t.pumpAndSettle();
    showUuToast(sheetCtx, content: 'Toast B');
    await t.pumpAndSettle();
    expect(find.text('Toast A'), findsNothing);
    expect(find.text('Toast B'), findsOneWidget);
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
    expect(find.text('Toast B'), findsNothing);
  });

  testWidgets('Không có Scaffold: Toast vẫn hiện (đi đường overlay)', (t) async {
    await t.pumpWidget(MaterialApp(
      theme: uuThemeData(),
      home: Builder(builder: (c) => Center(child: UuTextButton(label: 'Lưu', onPressed: () => showUuToast(c, content: 'Đã lưu')))),
    ));
    await t.tap(find.text('Lưu'));
    await t.pumpAndSettle();
    expect(find.text('Đã lưu').hitTestable(), findsOneWidget);
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
  });

  testWidgets('Màn rộng: Toast rộng 428, căn giữa', (t) async {
    t.view.physicalSize = const Size(1400, 900);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.reset);
    await t.pumpWidget(_app((c) => UuTextButton(label: 'Lưu', onPressed: () => showUuToast(c, content: 'Đã lưu'))));
    await t.tap(find.text('Lưu'));
    await t.pumpAndSettle();
    final r = t.getRect(find.byType(UuToast));
    expect(r.width, 428);
    expect(r.center.dx, closeTo(700, 1));
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
  });

  testWidgets('Sheet nhận theme của màn gọi (density Compact đặt quanh nút, không ở MaterialApp)', (t) async {
    t.view.physicalSize = const Size(1400, 900);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.reset);
    await t.pumpWidget(MaterialApp(
      home: Scaffold(
        body: Theme(
          data: uuThemeData(density: UuDensity.compact),
          child: Builder(builder: (c) => Center(child: UuTextButton(label: 'Mở', onPressed: () => showUuBottomSheet(c, header: 'Sheet', builder: (_) => const Text('Nội dung'))))),
        ),
      ),
    ));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    final r = t.getRect(find.byType(UuCardSheet));
    expect(r.center.dy, closeTo(450, 2), reason: 'Compact: sheet giữa màn');
    expect(r.width, lessThanOrEqualTo(480));
    // Có Material trong route: chữ header không rơi về style mặc định (gạch chân vàng).
    final style = DefaultTextStyle.of(t.element(find.text('Nội dung'))).style;
    expect(style.decoration, isNot(TextDecoration.underline));
  });

  testWidgets('MaterialApp lồng trong Scaffold khác (như Widgetbook): Toast vẫn hiện', (t) async {
    await t.pumpWidget(MaterialApp(
      home: Scaffold(
        body: MaterialApp(
          theme: uuThemeData(),
          home: Builder(builder: (c) => Center(child: UuTextButton(label: 'Lưu', onPressed: () => showUuToast(c, content: 'Đã lưu')))),
        ),
      ),
    ));
    await t.tap(find.text('Lưu'));
    await t.pumpAndSettle();
    expect(find.text('Đã lưu').hitTestable(), findsOneWidget);
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
  });

  testWidgets('Semantics: Toast là live region, nút Đóng là node con riêng có tap', (t) async {
    final h = t.ensureSemantics();
    await t.pumpWidget(MaterialApp(theme: uuThemeData(), home: Scaffold(body: Center(child: UuToast(content: 'Đã lưu', onClose: () {})))));
    final node = t.getSemantics(find.byType(UuToast));
    expect(node.getSemanticsData().flagsCollection.isLiveRegion, isTrue);
    expect(node.label, 'Đã lưu', reason: 'live region phải có label để được đọc lên');
    expect(find.bySemanticsLabel('Đã lưu'), findsOneWidget, reason: 'không đọc hai lần');
    expect(node.getSemanticsData().hasAction(SemanticsAction.tap), isFalse);
    final close = t.getSemantics(find.bySemanticsLabel('Đóng'));
    expect(close, isNot(same(node)));
    expect(close.getSemanticsData().hasAction(SemanticsAction.tap), isTrue);
    h.dispose();
  });

  testWidgets('Popover neo đúng dưới nút khi app nằm trong navigator lồng (lệch trái 285 như Widgetbook)', (t) async {
    t.view.physicalSize = const Size(1200, 800);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.reset);
    await t.pumpWidget(MaterialApp(
      home: Row(children: [
        const SizedBox(width: 285),
        Expanded(
          child: MaterialApp(
            theme: uuThemeData(),
            home: Scaffold(
              body: Center(child: Builder(builder: (c) => UuTextButton(label: 'Đổi tên', onPressed: () => showUuPopover(c, title: 'Đổi tên', builder: (_) => const Text('Nội dung'))))),
            ),
          ),
        ),
      ]),
    ));
    final btn = t.getRect(find.byType(UuTextButton));
    await t.tap(find.text('Đổi tên'));
    await t.pumpAndSettle();
    final pop = t.getRect(find.byType(UuPopover));
    expect(pop.top, greaterThanOrEqualTo(btn.bottom - 1), reason: 'popover nằm dưới nút');
    expect(pop.left, closeTo(btn.left, 1), reason: 'mép trái popover thẳng mép trái nút, không lệch theo navigator lồng');
  });
}
