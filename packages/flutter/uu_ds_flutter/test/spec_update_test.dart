// Đợt cập nhật spec: Menu (§6.21) · SearchInput (§6.3g) · Chip mở (§6.18) · Tab/TabBar (§6.20) ·
// StatusIndicator Highlight (§6.15) · CardDialog (§6.10) · Empty/Error (§6.19) · Push (§6.31) ·
// BottomBar action (§6.22) · trục layout (§4.2).
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child, {UuDensity density = UuDensity.touch, UuBrand brand = UuBrand.defaultBrand, UuLayout layout = UuLayout.expanded}) => MaterialApp(
      theme: uuThemeData(density: density, brand: brand, layout: layout),
      home: Scaffold(body: Center(child: child)),
    );

Future<void> _pump(WidgetTester t, Widget w, {UuDensity density = UuDensity.touch, UuBrand brand = UuBrand.defaultBrand, UuLayout layout = UuLayout.expanded}) async {
  await t.pumpWidget(_wrap(w, density: density, brand: brand, layout: layout));
  await t.pumpAndSettle();
}

// PNG 1×1 trong suốt — ảnh banner / push trong test.
final _png = MemoryImage(Uint8List.fromList(const [
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
  0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
]));

const _opts = [
  UuMenuOption(value: 'hn', label: 'Hà Nội'),
  UuMenuOption(value: 'hcm', label: 'TP. Hồ Chí Minh'),
  UuMenuOption(value: 'dn', label: 'Đà Nẵng', disabled: true),
];

void main() {
  // Smoke: mọi widget mới dựng được ở cả 2 density × 2 brand, không lỗi layout.
  for (final d in UuDensity.values) {
    for (final b in UuBrand.values) {
      testWidgets('Smoke ${d.name} · ${b.name}', (t) async {
        // Spinner quay mãi → pump có hạn thay cho pumpAndSettle.
        await t.pumpWidget(_wrap(
          density: d,
          brand: b,
          SingleChildScrollView(
            child: SizedBox(
              width: 420,
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                UuMenu<String>(options: _opts, value: 'hn', onSelect: (_) {}, search: true),
                UuMenu<String>(options: _opts, type: UuMenuItemType.multiple, values: const {'hn'}, onValuesChanged: (_) {}, footer: true),
                const UuMenuPanel(children: [UuMenuSection(title: 'Nhóm'), UuMenuItem(label: 'A', icon: 'clock'), UuMenuDivider(), UuMenuItem(label: 'B', selected: true)]),
                UuSearchInput(controller: TextEditingController(text: 'abc'), loading: true, cancel: true),
                const UuSearchSuggestions(query: 'ha', suggestions: ['Hà Nội', 'Hạ Long']),
                const UuChip(label: 'Khu vực', type: UuChipType.dropdown, open: true),
                UuTabBar<int>(items: const [UuTabItem(value: 0, label: 'Một'), UuTabItem(value: 1, label: 'Hai'), UuTabItem(value: 2, label: 'Ba', disabled: true)], value: 0, onChanged: (_) {}),
                UuTabBar<int>(layout: UuTabBarLayout.scrollable, items: [for (var i = 0; i < 8; i++) UuTabItem(value: i, label: 'Tab số $i')], value: 6, onChanged: (_) {}),
                const UuStatusIndicator(label: 'Mới', tone: UuTone.highlight, filled: true),
                UuCardDialog(width: 384, banner: _png, bannerLabel: 'Quà tặng', buttonGroup: const UuButtonGroup(primary: UuGroupAction('Đã hiểu')), child: const Text('Quà mới')),
                const UuEmptySection(title: 'Chưa có đơn', description: 'Đơn sẽ hiện ở đây', actionLabel: 'Tạo đơn'),
                const UuErrorSection(title: 'Không tải được', description: 'Thử lại sau ít phút'),
                const UuCardPushNotification(title: 'Đơn đã giao', content: 'Đơn #123 đã đến nơi'),
                UuBottomBar<int>(value: 0, onChanged: (_) {}, action: const UuBottomBarAction(label: 'Quét mã', icon: 'texture'), items: const [
                  UuBottomBarItem(value: 0, label: 'Trang chủ', icon: 'texture'),
                  UuBottomBarItem(value: 1, label: 'Ưu đãi', icon: 'texture'),
                ]),
              ]),
            ),
          ),
        ));
        await t.pump(const Duration(milliseconds: 300));
        expect(t.takeException(), isNull);
      });
    }
  }

  testWidgets('MenuItem Single: tint + check khi chọn; Multiple: checkbox, không tint, cao 48 → 40', (t) async {
    final c = UuSemanticColors.defaultBrand;
    await _pump(t, const SizedBox(width: 300, child: UuMenuItem(label: 'A', selected: true)));
    final box = t.widget<Container>(find.descendant(of: find.byType(UuMenuItem), matching: find.byType(Container)).first);
    expect((box.decoration as BoxDecoration).color, c.backgroundAccentSubtle);
    expect(find.byType(UuCheckbox), findsNothing);

    await _pump(t, const SizedBox(width: 300, child: UuMenuItem(label: 'A', type: UuMenuItemType.multiple, selected: true)));
    final box2 = t.widget<Container>(find.descendant(of: find.byType(UuMenuItem), matching: find.byType(Container)).first);
    expect((box2.decoration as BoxDecoration).color, isNull);
    expect(t.widget<UuCheckbox>(find.byType(UuCheckbox)).checked, true);
    expect(t.getSize(find.byType(UuMenuItem)).height, 48);
    await _pump(t, density: UuDensity.compact, const SizedBox(width: 300, child: UuMenuItem(label: 'A', type: UuMenuItemType.multiple)));
    expect(t.getSize(find.byType(UuMenuItem)).height, 40);
  });

  testWidgets('Menu Multiple: tick không đóng, Bỏ chọn xoá hết, Áp dụng gọi callback', (t) async {
    Set<String> v = {'hn'};
    var applied = 0;
    await t.pumpWidget(_wrap(StatefulBuilder(
      builder: (ctx, set) => SizedBox(
        width: 320,
        child: UuMenu<String>(options: _opts, type: UuMenuItemType.multiple, values: v, onValuesChanged: (x) => set(() => v = x), footer: true, onApply: () => applied++),
      ),
    )));
    await t.tap(find.text('TP. Hồ Chí Minh'));
    await t.pump();
    expect(v, {'hn', 'hcm'});
    await t.tap(find.text('Đà Nẵng')); // disabled
    await t.pump();
    expect(v, {'hn', 'hcm'});
    await t.tap(find.text('Áp dụng'));
    expect(applied, 1);
    await t.tap(find.text('Bỏ chọn'));
    await t.pump();
    expect(v, isEmpty);
  });

  testWidgets('Menu search: lọc theo từ khoá, không còn option → Không tìm thấy', (t) async {
    String? picked;
    await _pump(t, SizedBox(width: 320, child: UuMenu<String>(options: _opts, search: true, onSelect: (x) => picked = x)));
    expect(find.byType(UuSearchInput), findsOneWidget);
    expect(find.byType(UuFieldLabel), findsNothing); // không nhãn
    await t.enterText(find.byType(TextField), 'hà');
    await t.pump();
    expect(find.text('Hà Nội'), findsOneWidget);
    expect(find.text('TP. Hồ Chí Minh'), findsNothing);
    await t.tap(find.text('Hà Nội'));
    expect(picked, 'hn');
    await t.enterText(find.byType(TextField), 'xyz');
    await t.pump();
    expect(find.text('Không tìm thấy “xyz”'), findsOneWidget);
  });

  testWidgets('MenuSection ẩn khi layout collapsed', (t) async {
    await _pump(t, const UuMenuSection(title: 'Gần đây'));
    expect(find.text('GẦN ĐÂY'), findsOneWidget);
    await _pump(t, layout: UuLayout.collapsed, const UuMenuSection(title: 'Gần đây'));
    expect(find.text('GẦN ĐÂY'), findsNothing);
  });

  testWidgets('SearchInput: loading thay nút xoá, Huỷ xoá chữ + bỏ focus', (t) async {
    final ctrl = TextEditingController(text: 'khách sạn');
    await t.pumpWidget(_wrap(SizedBox(width: 358, child: UuSearchInput(controller: ctrl, loading: true))));
    await t.pump();
    expect(find.byType(UuSpinner), findsOneWidget);
    expect(find.bySemanticsLabel('Xoá từ khoá'), findsNothing);

    var cancelled = 0;
    await _pump(t, SizedBox(width: 358, child: UuSearchInput(controller: ctrl, cancel: true, onCancel: () => cancelled++)));
    expect(find.bySemanticsLabel('Xoá từ khoá'), findsOneWidget);
    expect(find.byType(UuSpinner), findsNothing);
    await t.tap(find.byType(TextField));
    await t.pump();
    await t.tap(find.text('Huỷ'));
    await t.pump();
    expect(ctrl.text, isEmpty);
    expect(cancelled, 1);
    expect(FocusManager.instance.primaryFocus?.context?.widget is EditableText, isFalse);
  });

  testWidgets('SearchSuggestions: rỗng → lịch sử (clock), gõ → gợi ý (magnifier, 600), không có gì → không mở', (t) async {
    var cleared = 0;
    await _pump(t, SizedBox(width: 358, child: UuSearchSuggestions(query: '', recent: const ['Đà Lạt'], suggestions: const ['Hà Nội'], onClearRecent: () => cleared++)));
    expect(find.text('TÌM GẦN ĐÂY'), findsOneWidget);
    expect(t.widget<UuMenuItem>(find.byType(UuMenuItem)).icon, 'clock');
    await t.tap(find.text('Xoá'));
    expect(cleared, 1);

    await _pump(t, const SizedBox(width: 358, child: UuSearchSuggestions(query: 'hà', suggestions: ['Hà Nội'])));
    expect(find.text('GỢI Ý'), findsOneWidget);
    final item = t.widget<UuMenuItem>(find.byType(UuMenuItem));
    expect(item.icon, 'magnifier');
    expect(item.highlight, 'hà');

    await _pump(t, const SizedBox(width: 358, child: UuSearchSuggestions(query: '')));
    expect(find.byType(UuMenuPanel), findsNothing);
  });

  testWidgets('Chip Dropdown open: chevron-up + nền đã chọn', (t) async {
    final c = UuSemanticColors.defaultBrand;
    await _pump(t, const UuChip(label: 'Khu vực', type: UuChipType.dropdown, open: true));
    expect(find.byWidgetPredicate((w) => w is UuIcon && w.name == 'chevron-up'), findsOneWidget);
    final box = t.widget<Container>(find.descendant(of: find.byType(UuChip), matching: find.byType(Container)).first);
    expect((box.decoration as BoxDecoration).color, c.backgroundInteractiveMuted);
    await _pump(t, const UuChip(label: 'Khu vực', type: UuChipType.dropdown));
    expect(find.byWidgetPredicate((w) => w is UuIcon && w.name == 'chevron-down'), findsOneWidget);
  });

  testWidgets('Tab: Disabled object-disabled, không bấm được; Active bấm lại không làm gì', (t) async {
    final c = UuSemanticColors.defaultBrand;
    var taps = 0;
    await _pump(t, UuTab(label: 'Khoá', disabled: true, onTap: () => taps++));
    expect(t.widget<Text>(find.text('Khoá')).style!.color, c.objectDisabled);
    await t.tap(find.text('Khoá'));
    expect(taps, 0);
    await _pump(t, UuTab(label: 'Đang xem', active: true, onTap: () => taps++));
    await t.tap(find.text('Đang xem'));
    expect(taps, 0);
    await _pump(t, UuTab(label: 'Khác', onTap: () => taps++));
    await t.tap(find.text('Khác'));
    expect(taps, 1);
    expect(t.getSize(find.byType(UuTab)).height, 48);
    await _pump(t, density: UuDensity.compact, UuTab(label: 'Khác', onTap: () {}));
    expect(t.getSize(find.byType(UuTab)).height, 36); // padding 8 + chữ 20
  });

  testWidgets('Tab Hover / Pressed: state layer object-primary 5 / 10, chỉ ở tab không Active', (t) async {
    double layer() => t.widget<AnimatedOpacity>(find.descendant(of: find.byType(UuTab), matching: find.byType(AnimatedOpacity))).opacity;
    await _pump(t, UuTab(label: 'Khác', forced: UuForcedState.hover, onTap: () {}));
    expect(layer(), UuOpacity.o5);
    await _pump(t, UuTab(label: 'Khác', forced: UuForcedState.pressed, onTap: () {}));
    expect(layer(), UuOpacity.o10);
    await _pump(t, UuTab(label: 'Khác', forced: UuForcedState.pressed, disabled: true, onTap: () {}));
    expect(layer(), 0);
    await _pump(t, UuTab(label: 'Đang xem', active: true, forced: UuForcedState.hover, onTap: () {}));
    expect(find.descendant(of: find.byType(UuTab), matching: find.byType(AnimatedOpacity)), findsNothing);
  });

  testWidgets('TabBar Fixed chia đều + viền dưới; Scrollable cuộn được, bấm đổi tab', (t) async {
    final items = [for (var i = 0; i < 3; i++) UuTabItem(value: i, label: 'T$i')];
    await _pump(t, SizedBox(width: 360, child: UuTabBar<int>(items: items, value: 0, onChanged: (_) {})));
    final w = [for (var i = 0; i < 3; i++) t.getSize(find.byType(UuTab).at(i)).width];
    expect(w, everyElement(120));
    expect(find.byWidgetPredicate((x) => x is Container && x.color == UuSemanticColors.defaultBrand.borderMuted), findsOneWidget);

    var v = 0;
    await t.pumpWidget(_wrap(StatefulBuilder(builder: (ctx, set) => SizedBox(
          width: 300,
          child: UuTabBar<int>(layout: UuTabBarLayout.scrollable, items: [for (var i = 0; i < 10; i++) UuTabItem(value: i, label: 'Mục $i')], value: v, onChanged: (x) => set(() => v = x)),
        ))));
    await t.pumpAndSettle();
    expect(find.byType(SingleChildScrollView), findsOneWidget);
    await t.tap(find.text('Mục 1'));
    await t.pumpAndSettle();
    expect(v, 1);
  });

  testWidgets('StatusIndicator Highlight: họ accent, đổi theo brand', (t) async {
    // Chấm nhấp nháy lặp mãi (§6.15) → pumpAndSettle không bao giờ dừng; pump có hạn.
    Future<void> pumpBlink(Widget w, UuBrand b) async {
      await t.pumpWidget(_wrap(w, brand: b));
      await t.pump(const Duration(milliseconds: 100));
    }
    for (final b in UuBrand.values) {
      final c = UuTheme.brand(b).colors;
      await pumpBlink(const UuStatusIndicator(label: 'Mới', tone: UuTone.highlight, filled: true), b);
      final pill = t.widget<Container>(find.descendant(of: find.byType(UuStatusIndicator), matching: find.byType(Container)).first);
      expect((pill.decoration as BoxDecoration).color, c.backgroundAccent);
      expect(t.widget<Text>(find.text('Mới')).style!.color, c.objectOnAccent);
      await pumpBlink(const UuStatusIndicator(label: 'Mới', tone: UuTone.highlight), b);
      final dot = t.widget<Container>(find.descendant(of: find.byType(UuStatusIndicator), matching: find.byType(Container)).last);
      expect((dot.decoration as BoxDecoration).color, c.objectAccent);
      expect(t.widget<Text>(find.text('Mới')).style!.color, c.objectPrimary);
    }
  });

  testWidgets('StatusIndicator: chấm nhấp nháy 1 → 0.3 → 1 chu kỳ 1.6s; giảm chuyển động thì đứng yên ở 1', (t) async {
    double opacity() => t.widget<FadeTransition>(find.descendant(of: find.byType(UuStatusIndicator), matching: find.byType(FadeTransition))).opacity.value;
    await t.pumpWidget(_wrap(const UuStatusIndicator(label: 'Mới', tone: UuTone.highlight)));
    expect(opacity(), closeTo(1, 0.001));
    await t.pump(const Duration(milliseconds: 800));
    expect(opacity(), closeTo(0.3, 0.001));
    await t.pump(const Duration(milliseconds: 800));
    expect(opacity(), closeTo(1, 0.001));

    await t.pumpWidget(MediaQuery(
      data: const MediaQueryData(disableAnimations: true),
      child: _wrap(const UuStatusIndicator(label: 'Mới', tone: UuTone.highlight)),
    ));
    await t.pumpAndSettle();
    expect(opacity(), 1);
  });

  testWidgets('CardDialog: banner 16:9 + nút đóng Solid đè; tên cũ vẫn dùng được', (t) async {
    var closed = 0;
    await _pump(t, UuCardDialog(width: 384, banner: _png, bannerLabel: 'Quà', onClose: () => closed++, child: const Text('Nội dung')));
    expect(t.getSize(find.byType(AspectRatio)), const Size(384, 216));
    final btn = t.widget<UuIconButton>(find.byType(UuIconButton));
    expect(btn.type, UuButtonType.solid);
    expect(btn.size, UuButtonSize.small);
    expect(t.getTopRight(find.byType(UuIconButton)), t.getTopRight(find.byType(AspectRatio)) + const Offset(-16, 16));
    await t.tap(find.byType(UuIconButton));
    expect(closed, 1);

    await _pump(t, const UuCardDialog(width: 384, child: Text('Nội dung')));
    expect(t.widget<UuIconButton>(find.byType(UuIconButton)).type, UuButtonType.outline);
    // ignore: deprecated_member_use_from_same_package
    const UuBaseDialog old = UuBaseDialog(child: SizedBox());
    expect(old, isA<UuCardDialog>());
  });

  testWidgets('EmptySection / ErrorSection: ảnh tròn 128 accent-muted, heading-sm, một nút', (t) async {
    var retry = 0;
    await _pump(t, SizedBox(width: 390, child: UuErrorSection(title: 'Không tải được', onRetry: () => retry++)));
    final img = find.byWidgetPredicate((w) => w is Container && w.decoration is BoxDecoration && (w.decoration as BoxDecoration).shape == BoxShape.circle);
    expect(t.getSize(img), const Size(128, 128));
    expect((t.widget<Container>(img).decoration as BoxDecoration).color, UuSemanticColors.defaultBrand.backgroundAccentMuted);
    await t.tap(find.text('Thử lại'));
    expect(retry, 1);
    await _pump(t, const SizedBox(width: 390, child: UuEmptySection(title: 'Chưa có đơn')));
    expect(find.byType(UuTextButton), findsNothing); // Action=false
    expect(t.widget<Text>(find.text('Chưa có đơn')).style!.fontSize, UuText.touch.headingSm.fontSize);
  });

  testWidgets('EmptyScreen: có nút back, một nút hành động', (t) async {
    var back = 0, act = 0;
    await t.pumpWidget(MaterialApp(theme: uuThemeData(), home: UuEmptyScreen(screenTitle: 'Đơn hàng', title: 'Chưa có đơn', onBack: () => back++, actionLabel: 'Khám phá', onAction: () => act++)));
    await t.pumpAndSettle();
    await t.tap(find.bySemanticsLabel('Quay lại'));
    await t.tap(find.text('Khám phá'));
    expect((back, act), (1, 1));
  });

  testWidgets('Push: trượt từ đỉnh, tự ẩn 5 giây, thẻ mới thay thẻ cũ, bấm thẻ mở rồi đóng', (t) async {
    var opened = 0;
    await t.pumpWidget(MaterialApp(theme: uuThemeData(), home: Scaffold(body: Center(child: Builder(builder: (ctx) => TextButton(
          onPressed: () => showUuPushNotification(ctx, title: 'Đơn đã giao', content: 'Đơn #1', onTap: () => opened++),
          child: const Text('Mở'),
        ))))));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    expect(find.byType(UuCardPushNotification), findsOneWidget);
    expect(t.getTopLeft(find.byType(UuCardPushNotification)).dx, 12);
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    expect(find.byType(UuCardPushNotification), findsOneWidget); // một thẻ mỗi lúc
    await t.pump(const Duration(seconds: 5));
    await t.pumpAndSettle();
    expect(find.byType(UuCardPushNotification), findsNothing);

    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    await t.tap(find.text('Đơn đã giao'));
    await t.pumpAndSettle();
    expect(opened, 1);
    expect(find.byType(UuCardPushNotification), findsNothing);
  });

  testWidgets('BottomBar action: Emphasized 64 / Compact 48, cách vỏ 8', (t) async {
    var pressed = 0;
    Widget bar(bool compact, UuFooterItemSpecialType type) => SizedBox(
          width: 390,
          child: Align(
            alignment: Alignment.centerLeft,
            child: UuBottomBar<int>(
              value: 0,
              compact: compact,
              onChanged: (_) {},
              action: UuBottomBarAction(label: 'Quét mã', icon: 'texture', type: type, onPressed: () => pressed++),
              items: const [UuBottomBarItem(value: 0, label: 'Trang chủ', icon: 'texture'), UuBottomBarItem(value: 1, label: 'Ưu đãi', icon: 'texture')],
            ),
          ),
        );
    final c = UuSemanticColors.defaultBrand;
    await _pump(t, bar(false, UuFooterItemSpecialType.emphasized));
    final special = find.bySemanticsLabel('Quét mã');
    expect(t.getSize(special).height, 64);
    expect(t.getSize(special).width, greaterThanOrEqualTo(64));
    // cách vỏ 8
    final shell = find.byWidgetPredicate((w) => w is Container && w.decoration is BoxDecoration && (w.decoration as BoxDecoration).color == c.backgroundSurface && w.padding == const EdgeInsets.all(UuGap.g1));
    expect(t.getTopLeft(special).dx - t.getTopRight(shell).dx, 8);
    expect(find.text('Quét mã'), findsOneWidget);
    expect(find.byWidgetPredicate((w) => w is Container && w.decoration is BoxDecoration && (w.decoration as BoxDecoration).color == c.backgroundInteractive), findsOneWidget);
    await t.tap(special);
    expect(pressed, 1);
    await _pump(t, bar(true, UuFooterItemSpecialType.subtle));
    expect(t.getSize(find.bySemanticsLabel('Quét mã')), const Size(48, 48));
    expect(find.text('Quét mã'), findsNothing);
  });

  testWidgets('Layout: theme collapsed → SideNav thu gọn; prop vẫn thắng', (t) async {
    expect(uuThemeData().extension<UuTheme>()!.layout, UuLayout.expanded);
    expect(UuTheme.brand(UuBrand.uu).copyWith(layout: UuLayout.collapsed).layout, UuLayout.collapsed);
    final nav = SizedBox(height: 400, child: UuSideNav(children: [UuSideNavItem(label: 'Trang chủ', icon: 'texture', onTap: () {})]));
    await _pump(t, layout: UuLayout.collapsed, nav);
    expect(t.getSize(find.byType(UuSideNav)).width, UuSideNav.collapsedWidth);
    await _pump(t, layout: UuLayout.collapsed, SizedBox(height: 400, child: UuSideNav(collapsed: false, children: [UuSideNavItem(label: 'Trang chủ', icon: 'texture', onTap: () {})])));
    expect(t.getSize(find.byType(UuSideNav)).width, 288);
    await _pump(t, SizedBox(height: 400, child: UuLayoutScope(layout: UuLayout.collapsed, child: UuSideNav(children: [UuSideNavItem(label: 'Trang chủ', icon: 'texture', onTap: () {})]))));
    expect(t.getSize(find.byType(UuSideNav)).width, UuSideNav.collapsedWidth);
  });
}
