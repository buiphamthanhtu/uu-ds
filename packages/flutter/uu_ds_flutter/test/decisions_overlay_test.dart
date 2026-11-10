// Quyết định lớp nổi: §6.28 SideSheet Width · §6.29 Popover tự đặt chỗ · §6.30 Tooltip thời gian hiện / ẩn.
import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child) => MaterialApp(
      theme: uuThemeData(density: UuDensity.compact),
      home: Scaffold(body: Center(child: child)),
    );

void main() {
  testWidgets('SideSheet Width: Base 384 (size-96) · Wide 480 (size-120), cả Standard và Modal', (t) async {
    expect(UuSize.s120, 480);
    for (final type in UuSideSheetType.values) {
      await t.pumpWidget(_wrap(SizedBox(height: 600, child: UuSideSheet(title: 'Chi tiết', type: type, children: const [Text('A')]))));
      expect(t.getSize(find.byType(UuSideSheet)).width, 384);
      await t.pumpWidget(_wrap(SizedBox(
          height: 600, child: UuSideSheet(title: 'Chi tiết', type: type, width: UuSideSheetWidth.wide, children: const [Text('A')]))));
      expect(t.getSize(find.byType(UuSideSheet)).width, 480);
    }

    t.view.physicalSize = const Size(1280, 800);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.reset);
    await t.pumpWidget(_wrap(Builder(
        builder: (ctx) => UuTextButton(
            label: 'Mở',
            onPressed: () => showUuSideSheet<void>(ctx, title: 'Sửa', width: UuSideSheetWidth.wide, builder: (_) => const Text('Nội dung'))))));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    expect(t.getSize(find.byType(UuSideSheet)).width, 480);
  });

  group('Popover vị trí (uuPlacePopover)', () {
    const area = Size(800, 600);
    const child = Size(320, 200);

    test('mặc định: dưới phần tử cách 4, canh mép trái', () {
      final p = uuPlacePopover(const Rect.fromLTWH(100, 100, 80, 32), child, area);
      expect(p, const Offset(100, 136));
    });

    test('thiếu chỗ phía dưới → lật lên trên', () {
      final p = uuPlacePopover(const Rect.fromLTWH(100, 500, 80, 32), child, area);
      expect(p.dy, 500 - 4 - 200);
      expect(p.dx, 100);
    });

    test('sát mép phải → canh mép phải với phần tử', () {
      final a = const Rect.fromLTWH(680, 100, 80, 32);
      final p = uuPlacePopover(a, child, area);
      expect(p.dx + child.width, a.right);
      expect(p.dy, a.bottom + 4);
    });

    test('cả hai phía đều thiếu → chọn phía rộng hơn', () {
      final p = uuPlacePopover(const Rect.fromLTWH(100, 120, 80, 32), const Size(320, 500), area);
      expect(p.dy, 156); // phía dưới (440) rộng hơn phía trên (108)
    });
  });

  testWidgets('showUuPopover: nút sát đáy và mép phải → khung lật lên, canh phải', (t) async {
    t.view.physicalSize = const Size(800, 600);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.reset);
    await t.pumpWidget(MaterialApp(
      theme: uuThemeData(density: UuDensity.compact),
      home: Scaffold(
        body: Align(
          alignment: Alignment.bottomRight,
          child: Padding(
            padding: const EdgeInsets.all(UuGap.g4),
            child: Builder(
                builder: (ctx) => UuTextButton(
                    label: 'Mở', onPressed: () => showUuPopover<void>(ctx, title: 'Đổi tên', builder: (_) => const Text('Form')))),
          ),
        ),
      ),
    ));
    final anchor = t.getRect(find.byType(UuTextButton));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    final box = t.getRect(find.byType(UuPopover));
    expect(box.bottom, anchor.top - UuGap.g1);
    expect(box.right, anchor.right);
  });

  group('Tooltip thời gian', () {
    Future<TestGesture> mouse(WidgetTester t) async {
      final g = await t.createGesture(kind: PointerDeviceKind.mouse);
      await g.addPointer(location: Offset.zero);
      addTearDown(g.removePointer);
      return g;
    }

    Widget row() => const Row(mainAxisSize: MainAxisSize.min, children: [
          UuTooltip(key: Key('a'), text: 'Sao chép', child: SizedBox(width: 40, height: 40)),
          SizedBox(width: UuGap.g2),
          UuTooltip(key: Key('b'), text: 'Chia sẻ', child: SizedBox(width: 40, height: 40)),
        ]);

    testWidgets('hover: hiện sau 500 ms, rời chuột ẩn ngay', (t) async {
      await t.pumpWidget(_wrap(row()));
      final g = await mouse(t);
      await g.moveTo(t.getCenter(find.byKey(const Key('a'))));
      await t.pump(); // frame đầu: bắt đầu đếm
      await t.pump(const Duration(milliseconds: 450));
      expect(find.text('Sao chép'), findsNothing);
      await t.pump(const Duration(milliseconds: 60));
      expect(find.text('Sao chép'), findsOneWidget);
      await g.moveTo(Offset.zero);
      await t.pump();
      expect(find.text('Sao chép'), findsNothing); // ẩn ngay, không mờ dần
      await t.pumpAndSettle();
    });

    testWidgets('lướt qua dưới 500 ms không bật tooltip', (t) async {
      await t.pumpWidget(_wrap(row()));
      final g = await mouse(t);
      await g.moveTo(t.getCenter(find.byKey(const Key('a'))));
      await t.pump(const Duration(milliseconds: 200));
      await g.moveTo(Offset.zero);
      await t.pumpAndSettle();
      expect(find.byType(UuTooltipBubble), findsNothing);
    });

    testWidgets('warm: chuyển sang phần tử kế bên → hiện ngay; quá 300 ms thì chờ lại 500 ms', (t) async {
      await t.pumpWidget(_wrap(row()));
      final g = await mouse(t);
      await g.moveTo(t.getCenter(find.byKey(const Key('a'))));
      await t.pumpAndSettle();
      expect(find.text('Sao chép'), findsOneWidget);
      await g.moveTo(t.getCenter(find.byKey(const Key('b'))));
      await t.pump();
      expect(find.text('Sao chép'), findsNothing);
      expect(find.text('Chia sẻ'), findsOneWidget);

      await g.moveTo(Offset.zero);
      await t.pump(const Duration(milliseconds: 200));
      await g.moveTo(t.getCenter(find.byKey(const Key('a'))));
      await t.pump();
      expect(find.text('Sao chép'), findsOneWidget, reason: 'vẫn trong cửa sổ warm 300 ms');

      await g.moveTo(Offset.zero);
      await t.pumpAndSettle(); // hết warm
      await g.moveTo(t.getCenter(find.byKey(const Key('b'))));
      await t.pump();
      await t.pump(const Duration(milliseconds: 300));
      expect(find.text('Chia sẻ'), findsNothing);
      await t.pumpAndSettle();
      expect(find.text('Chia sẻ'), findsOneWidget);
      await g.moveTo(Offset.zero);
      await t.pumpAndSettle();
    });

    testWidgets('focus bàn phím: hiện ngay; Esc và mất focus ẩn ngay', (t) async {
      FocusManager.instance.highlightStrategy = FocusHighlightStrategy.alwaysTraditional;
      addTearDown(() => FocusManager.instance.highlightStrategy = FocusHighlightStrategy.automatic);
      final a = FocusNode();
      final b = FocusNode();
      addTearDown(a.dispose);
      addTearDown(b.dispose);
      await t.pumpWidget(_wrap(Row(mainAxisSize: MainAxisSize.min, children: [
        UuTooltip(text: 'Sao chép', child: Focus(focusNode: a, child: const SizedBox(width: 40, height: 40))),
        Focus(focusNode: b, child: const SizedBox(width: 40, height: 40)),
      ])));
      a.requestFocus();
      await t.pump();
      expect(find.text('Sao chép'), findsOneWidget);
      await t.sendKeyEvent(LogicalKeyboardKey.escape);
      await t.pump();
      expect(find.text('Sao chép'), findsNothing);

      b.requestFocus();
      await t.pump();
      a.requestFocus();
      await t.pump();
      expect(find.text('Sao chép'), findsOneWidget);
      b.requestFocus();
      await t.pump();
      expect(find.text('Sao chép'), findsNothing);
      await t.pumpAndSettle();
    });
  });
}
