// Mục đã chốt nhóm phản hồi / chứa đựng: ButtonGroup Tone=Danger (§6.9) · CardSheet kéo được (§6.8) ·
// CardPushNotification desktop (§6.31) · ResultScreen / ErrorScreen (§6.19).
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child, {UuDensity density = UuDensity.touch, UuBrand brand = UuBrand.defaultBrand}) => MaterialApp(
      theme: uuThemeData(density: density, brand: brand),
      home: Scaffold(body: child),
    );

/// Khung 366 × 600 thay cho màn: sheet dồn đáy, `Full` cao bằng khung.
Widget _sheetBox(Widget sheet) => Align(
      alignment: Alignment.topLeft,
      child: SizedBox(width: 366, height: 600, child: Align(alignment: Alignment.bottomCenter, child: sheet)),
    );

void main() {
  group('ButtonGroup Tone (§6.9)', () {
    testWidgets('Danger: nút chính TextButtonDanger, nút phụ giữ TextButtonAccent Outline', (t) async {
      await t.pumpWidget(_wrap(const SizedBox(
        width: 352,
        child: UuButtonGroup(tone: UuButtonGroupTone.danger, primary: UuGroupAction('Xoá đơn'), secondary: UuGroupAction('Giữ lại')),
      )));
      expect(find.widgetWithText(UuTextButtonDanger, 'Xoá đơn'), findsOneWidget);
      final s = t.widget<UuTextButton>(find.widgetWithText(UuTextButton, 'Giữ lại'));
      expect(s.type, UuButtonType.outline);
      expect(s.tone, UuButtonTone.accent);
      // Thứ tự không đổi: ngang → phụ trái, chính phải.
      expect(t.getCenter(find.text('Giữ lại')).dx, lessThan(t.getCenter(find.text('Xoá đơn')).dx));
    });

    testWidgets('Mặc định Tone=Default: không có nút Danger', (t) async {
      await t.pumpWidget(_wrap(const SizedBox(width: 352, child: UuButtonGroup(primary: UuGroupAction('Xác nhận')))));
      expect(find.byType(UuTextButtonDanger), findsNothing);
      expect(find.widgetWithText(UuTextButton, 'Xác nhận'), findsOneWidget);
    });

    testWidgets('Danger dọc: chính trên, phụ dưới', (t) async {
      await t.pumpWidget(_wrap(const SizedBox(
        width: 352,
        child: UuButtonGroup(layout: UuButtonGroupLayout.vertical, tone: UuButtonGroupTone.danger, primary: UuGroupAction('Xoá'), secondary: UuGroupAction('Huỷ')),
      )));
      expect(t.getCenter(find.text('Xoá')).dy, lessThan(t.getCenter(find.text('Huỷ')).dy));
    });
  });

  group('CardSheet kéo được (§6.8)', () {
    testWidgets('Không Handle thì không có thanh kéo', (t) async {
      await t.pumpWidget(_wrap(_sheetBox(const UuCardSheet(header: 'Chọn tỉnh', child: Text('Nội dung')))));
      expect(find.bySemanticsLabel('Kéo để đổi cỡ'), findsNothing);
    });

    testWidgets('Handle: thanh 32 × 4, sheet chỉ cao thêm 4', (t) async {
      await t.pumpWidget(_wrap(Column(children: const [
        SizedBox(width: 366, child: UuCardSheet(key: ValueKey('a'), header: 'A', child: Text('Nội dung'))),
        SizedBox(width: 366, child: UuCardSheet(key: ValueKey('b'), header: 'B', handle: true, child: Text('Nội dung'))),
      ])));
      final a = t.getSize(find.byKey(const ValueKey('a'))).height;
      final b = t.getSize(find.byKey(const ValueKey('b'))).height;
      expect(b - a, UuSize.s1);
      final bar = find.descendant(of: find.bySemanticsLabel('Kéo để đổi cỡ'), matching: find.byType(Container)).last;
      expect(t.getSize(bar), const Size(UuSize.s8, UuSize.s1));
    });

    testWidgets('Chạm thanh: Fit → Full, Full cao bằng khung', (t) async {
      UuSheetHeight? got;
      await t.pumpWidget(_wrap(_sheetBox(UuCardSheet(
        key: const ValueKey('s'),
        header: 'Chọn tỉnh',
        handle: true,
        onHeightChanged: (h) => got = h,
        cta: const UuButtonGroup(primary: UuGroupAction('Xác nhận')),
        child: const Text('Nội dung'),
      ))));
      await t.pumpAndSettle();
      expect(t.getSize(find.byKey(const ValueKey('s'))).height, lessThan(600));
      await t.tap(find.bySemanticsLabel('Kéo để đổi cỡ'));
      await t.pumpAndSettle();
      expect(got, UuSheetHeight.full);
      expect(t.getSize(find.byKey(const ValueKey('s'))).height, 600);
      // Nhóm nút vẫn ở đáy sheet (đứng yên), Body cuộn.
      expect(find.text('Xác nhận'), findsOneWidget);
    });

    testWidgets('Fit: kéo xuống quá 1/3 → đóng (onClose)', (t) async {
      var closed = false;
      await t.pumpWidget(_wrap(_sheetBox(UuCardSheet(header: 'Chọn tỉnh', handle: true, onClose: () => closed = true, child: const SizedBox(height: 200)))));
      await t.pumpAndSettle();
      final h = t.getSize(find.byType(UuCardSheet)).height;
      await t.drag(find.bySemanticsLabel('Kéo để đổi cỡ'), Offset(0, h / 2));
      await t.pumpAndSettle();
      expect(closed, isTrue);
    });

    testWidgets('Fit: kéo xuống ít (dưới 1/3) → về Fit, không đóng', (t) async {
      var closed = false;
      UuSheetHeight? got;
      await t.pumpWidget(_wrap(_sheetBox(UuCardSheet(header: 'Chọn tỉnh', handle: true, onClose: () => closed = true, onHeightChanged: (h) => got = h, child: const SizedBox(height: 200)))));
      await t.pumpAndSettle();
      await t.drag(find.bySemanticsLabel('Kéo để đổi cỡ'), const Offset(0, 40));
      await t.pumpAndSettle();
      expect(closed, isFalse);
      expect(got, isNull);
    });

    testWidgets('Full: kéo xuống → về Fit, không đóng', (t) async {
      var closed = false;
      UuSheetHeight? got;
      await t.pumpWidget(_wrap(_sheetBox(UuCardSheet(
        header: 'Chọn tỉnh',
        handle: true,
        initialHeight: UuSheetHeight.full,
        onClose: () => closed = true,
        onHeightChanged: (h) => got = h,
        child: const SizedBox(height: 200),
      ))));
      await t.pumpAndSettle();
      await t.drag(find.bySemanticsLabel('Kéo để đổi cỡ'), const Offset(0, 500));
      await t.pumpAndSettle();
      expect(closed, isFalse);
      expect(got, UuSheetHeight.fit);
    });

    testWidgets('Fit: kéo lên quá nửa → Full', (t) async {
      UuSheetHeight? got;
      await t.pumpWidget(_wrap(_sheetBox(UuCardSheet(header: 'Chọn tỉnh', handle: true, onHeightChanged: (h) => got = h, child: const SizedBox(height: 100)))));
      await t.pumpAndSettle();
      await t.drag(find.bySemanticsLabel('Kéo để đổi cỡ'), const Offset(0, -400));
      await t.pumpAndSettle();
      expect(got, UuSheetHeight.full);
    });

    testWidgets('Ma trận Navigation × Height dựng được ở 2 density', (t) async {
      for (final d in UuDensity.values) {
        for (final back in [false, true]) {
          for (final h in UuSheetHeight.values) {
            await t.pumpWidget(_wrap(
              density: d,
              _sheetBox(UuCardSheet(header: 'Header', handle: true, height: h, onBack: back ? () {} : null, cta: const UuButtonGroup(primary: UuGroupAction('Xác nhận')), child: const SizedBox(height: 900))),
            ));
            await t.pumpAndSettle();
            expect(t.takeException(), isNull);
            expect(find.bySemanticsLabel('Quay lại'), back ? findsOneWidget : findsNothing);
            expect(find.bySemanticsLabel('Đóng'), back ? findsNothing : findsOneWidget);
          }
        }
      }
    });
  });

  group('CardPushNotification desktop (§6.31)', () {
    testWidgets('topEnd: góc trên phải cách 16, rộng 360; tự ẩn sau 5 giây', (t) async {
      t.view.physicalSize = const Size(1280, 800);
      t.view.devicePixelRatio = 1;
      addTearDown(t.view.reset);
      await t.pumpWidget(_wrap(Builder(builder: (ctx) => Center(
            child: TextButton(onPressed: () => showUuPushNotification(ctx, title: 'Đơn hàng đang được giao', content: 'Đơn #UU2048 sẽ đến trong hôm nay.', placement: UuPushPlacement.topEnd), child: const Text('Gửi')),
          ))));
      await t.tap(find.text('Gửi'));
      await t.pumpAndSettle();
      final r = t.getRect(find.byType(UuCardPushNotification));
      expect(r.width, UuSize.s90);
      expect(r.top, UuGap.g4);
      expect(1280 - r.right, UuGap.g4);
      await t.pump(const Duration(seconds: 5));
      await t.pumpAndSettle();
      expect(find.byType(UuCardPushNotification), findsNothing);
    });
  });

  group('ResultScreen / ErrorScreen (§6.19)', () {
    testWidgets('ResultScreen: nút chính trên, lối đi phụ dưới; ảnh ô vuông 128', (t) async {
      await t.pumpWidget(_wrap(const UuResultScreen(
        title: 'Thanh toán thành công',
        description: 'Biên nhận đã gửi vào email của bạn.',
        illustration: SizedBox.expand(key: ValueKey('img')),
        primary: UuGroupAction('Xem đơn hàng'),
        secondary: UuGroupAction('Về trang chủ'),
      )));
      expect(find.text('Thanh toán thành công'), findsOneWidget);
      expect(t.getCenter(find.text('Xem đơn hàng')).dy, lessThan(t.getCenter(find.text('Về trang chủ')).dy));
      expect(t.getSize(find.byKey(const ValueKey('img'))), const Size(UuSize.s32, UuSize.s32));
      expect(t.widget<UuTextButton>(find.widgetWithText(UuTextButton, 'Về trang chủ')).type, UuButtonType.outline);
    });

    testWidgets('ResultScreen không lối đi phụ: một nút', (t) async {
      await t.pumpWidget(_wrap(const UuResultScreen(title: 'Đặt phòng thành công', primary: UuGroupAction('Xem đặt phòng'))));
      expect(find.byType(UuTextButton), findsOneWidget);
    });

    testWidgets('ErrorScreen: đúng một nút thử lại, ảnh tròn 128', (t) async {
      var retried = 0;
      await t.pumpWidget(_wrap(UuErrorScreen(title: 'Hệ thống đang gián đoạn', description: 'Bạn thử lại sau ít phút.', onRetry: () => retried++)));
      expect(find.byType(UuTextButton), findsOneWidget);
      await t.tap(find.text('Thử lại'));
      expect(retried, 1);
      final circle = find.byWidgetPredicate((w) => w is Container && w.decoration is BoxDecoration && (w.decoration as BoxDecoration).shape == BoxShape.circle);
      expect(t.getSize(circle), const Size(UuSize.s32, UuSize.s32));
    });

    testWidgets('Dựng được ở 2 density × 2 brand', (t) async {
      for (final d in UuDensity.values) {
        for (final b in UuBrand.values) {
          await t.pumpWidget(_wrap(density: d, brand: b, const UuResultScreen(title: 'Xong', primary: UuGroupAction('Tiếp tục'), secondary: UuGroupAction('Về trang chủ'))));
          expect(t.takeException(), isNull);
          await t.pumpWidget(_wrap(density: d, brand: b, const UuErrorScreen(title: 'Lỗi')));
          expect(t.takeException(), isNull);
        }
      }
    });
  });
}
