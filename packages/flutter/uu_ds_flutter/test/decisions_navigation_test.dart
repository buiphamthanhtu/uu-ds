// Quyết định nhóm điều hướng: Tab icon / badge (§6.20) · Breadcrumb rút gọn (§6.25) ·
// SideNav chevron xoay, badge, nút thu / mở (§6.27).
import 'dart:ui' show Tristate;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child, {UuDensity density = UuDensity.touch}) => MaterialApp(
      theme: uuThemeData(density: density),
      home: Scaffold(body: Align(alignment: Alignment.topLeft, child: child)),
    );

Future<void> _pump(WidgetTester t, Widget w, {UuDensity density = UuDensity.touch}) async {
  await t.pumpWidget(_wrap(w, density: density));
  await t.pumpAndSettle();
}

List<UuBreadcrumbItem> _path(int n, List<String> tapped) => [
      for (var i = 0; i < n; i++) UuBreadcrumbItem('Mục ${i + 1}', onTap: () => tapped.add('Mục ${i + 1}')),
    ];

void main() {
  group('Tab · icon và badge', () {
    testWidgets('Cao vẫn 48 khi có icon + badge', (t) async {
      await _pump(t, const UuTab(label: 'Vé', icon: 'texture', badge: true));
      expect(t.getSize(find.byType(UuTab)).height, 48);
      expect(find.byType(UuIcon), findsOneWidget);
      expect(find.byType(UuNotificationBadge), findsOneWidget);
    });

    testWidgets('Icon 16, gap 8 trước chữ; Dot gap 4 sau chữ', (t) async {
      await _pump(t, const UuTab(label: 'Vé', icon: 'texture', badge: true));
      final icon = t.getRect(find.byType(UuIcon));
      final text = t.getRect(find.text('Vé'));
      final dot = t.getRect(find.byType(UuNotificationBadge));
      expect(icon.width, 16);
      expect(text.left - icon.right, 8);
      expect(dot.left - text.right, 4);
      expect(dot.width, 8);
    });

    testWidgets('Active: icon fill, cùng màu chữ object-interactive; còn lại outline', (t) async {
      await _pump(t, const Row(mainAxisSize: MainAxisSize.min, children: [
        UuTab(label: 'Ưu đãi', icon: 'texture', active: true),
        UuTab(label: 'Vé', icon: 'texture'),
      ]));
      final icons = t.widgetList<UuIcon>(find.byType(UuIcon)).toList();
      expect(icons[0].variant, UuIconVariant.fill);
      expect(icons[1].variant, UuIconVariant.outline);
      final c = UuTheme.of(t.element(find.byType(UuTab).first)).colors;
      expect(icons[0].color, c.objectInteractive);
      expect(icons[1].color, c.objectSecondary);
    });

    testWidgets('Badge: screen reader đọc thêm "có mới"', (t) async {
      final h = t.ensureSemantics();
      await _pump(t, const UuTab(label: 'Vé', badge: true));
      expect(find.bySemanticsLabel(RegExp('Vé, có mới')), findsOneWidget);
      h.dispose();
    });

    testWidgets('TabBar truyền icon / badge cho từng tab', (t) async {
      await _pump(t, SizedBox(
        width: 390,
        child: UuTabBar<String>(
          value: 'a',
          onChanged: (_) {},
          items: const [
            UuTabItem(value: 'a', label: 'Ưu đãi', icon: 'texture'),
            UuTabItem(value: 'b', label: 'Vé', icon: 'texture', badge: true),
          ],
        ),
      ));
      expect(find.byType(UuIcon), findsNWidgets(2));
      expect(find.byType(UuNotificationBadge), findsOneWidget);
    });
  });

  group('Breadcrumb · rút gọn', () {
    testWidgets('≤ 4 mục: hiện đủ, không có "…"', (t) async {
      await _pump(t, UuBreadcrumb(items: _path(4, [])));
      expect(find.byType(UuBreadcrumbOverflow), findsNothing);
      for (var i = 1; i <= 4; i++) {
        expect(find.text('Mục $i'), findsOneWidget);
      }
    });

    testWidgets('6 mục: mục đầu / … / 2 mục cuối', (t) async {
      await _pump(t, UuBreadcrumb(items: _path(6, [])));
      expect(find.text('Mục 1'), findsOneWidget);
      expect(find.text('…'), findsOneWidget);
      expect(find.text('Mục 5'), findsOneWidget);
      expect(find.text('Mục 6'), findsOneWidget);
      for (final hidden in ['Mục 2', 'Mục 3', 'Mục 4']) {
        expect(find.text(hidden), findsNothing);
      }
    });

    testWidgets('"…" có tên "Hiện đường dẫn ẩn"', (t) async {
      final h = t.ensureSemantics();
      await _pump(t, UuBreadcrumb(items: _path(6, [])));
      expect(find.bySemanticsLabel('Hiện đường dẫn ẩn'), findsOneWidget);
      h.dispose();
    });

    testWidgets('Bấm "…" mở Menu liệt kê mục ẩn theo thứ tự, neo dưới cách 4; chọn là đi tới', (t) async {
      final tapped = <String>[];
      await _pump(t, UuBreadcrumb(items: _path(6, tapped)));
      await t.tap(find.text('…'));
      await t.pumpAndSettle();
      expect(find.byType(UuMenu<int>), findsOneWidget);
      final ys = [for (final l in ['Mục 2', 'Mục 3', 'Mục 4']) t.getRect(find.text(l)).top];
      expect(ys[0] < ys[1] && ys[1] < ys[2], isTrue);
      final menu = t.getRect(find.byType(UuMenu<int>));
      final trigger = t.getRect(find.byType(UuBreadcrumbOverflow));
      expect(menu.top - trigger.bottom, 4);
      expect(menu.left, trigger.left);
      expect(menu.width, 240);
      await t.tap(find.text('Mục 3'));
      await t.pumpAndSettle();
      expect(tapped, ['Mục 3']);
      expect(find.byType(UuMenu<int>), findsNothing);
    });

    testWidgets('Bấm ra ngoài đóng Menu', (t) async {
      await _pump(t, UuBreadcrumb(items: _path(5, [])));
      await t.tap(find.text('…'));
      await t.pumpAndSettle();
      expect(find.byType(UuMenu<int>), findsOneWidget);
      await t.tapAt(const Offset(700, 500));
      await t.pumpAndSettle();
      expect(find.byType(UuMenu<int>), findsNothing);
    });
  });

  group('SideNav', () {
    testWidgets('Chevron xoay 180° khi nhóm mở, 120 ms', (t) async {
      await _pump(t, const UuSideNav(children: [
        UuSideNavItem(label: 'Đơn hàng', icon: 'texture', chevron: true, expanded: true),
        UuSideNavItem(label: 'Báo cáo', icon: 'arrow-trend-up', chevron: true, expanded: false),
      ]));
      final rot = t.widgetList<AnimatedRotation>(find.byType(AnimatedRotation)).toList();
      expect(rot[0].turns, 0.5);
      expect(rot[1].turns, 0);
      expect(rot[0].duration, const Duration(milliseconds: 120));
    });

    testWidgets('Mục có mục con mang semantics expanded', (t) async {
      final h = t.ensureSemantics();
      await _pump(t, const UuSideNav(children: [UuSideNavItem(label: 'Đơn hàng', icon: 'texture', chevron: true, expanded: true)]));
      final node = t.getSemantics(find.byType(UuSideNavItem));
      expect(node.flagsCollection.isExpanded, Tristate.isTrue);
      h.dispose();
    });

    testWidgets('Badge Count cuối mục, trước chevron', (t) async {
      await _pump(t, const UuSideNav(children: [UuSideNavItem(label: 'Đơn hàng', icon: 'texture', chevron: true, badge: '3')]));
      final badge = t.getRect(find.byType(UuNotificationBadge));
      final chevron = t.getRect(find.byType(AnimatedRotation));
      final label = t.getRect(find.text('Đơn hàng'));
      expect(find.text('3'), findsOneWidget);
      expect(badge.left >= label.right, isTrue);
      expect(chevron.left - badge.right, 8);
    });

    testWidgets('Thu gọn: badge thành Dot ở góc trên phải icon', (t) async {
      await _pump(t, const UuSideNav(collapsed: true, children: [UuSideNavItem(label: 'Đơn hàng', icon: 'texture', badge: '3')]));
      expect(find.text('3'), findsNothing);
      final dot = t.getRect(find.byType(UuNotificationBadge));
      final icon = t.getRect(find.byType(UuIcon));
      expect(dot.width, 8);
      expect(dot.right, icon.right);
      expect(dot.top, icon.top);
    });

    testWidgets('Nút thu / mở: dồn phải khi mở rộng, đổi collapsed khi bấm', (t) async {
      bool? next;
      await _pump(t, SizedBox(
        height: 400,
        child: UuSideNav(toggle: true, collapsed: false, onCollapsedChanged: (v) => next = v, children: const [
          UuSideNavItem(label: 'Trang chủ', icon: 'texture'),
        ]),
      ));
      final btn = find.byType(UuIconButton);
      expect(t.widget<UuIconButton>(btn).icon, 'sidebar-left');
      expect(t.widget<UuIconButton>(btn).label, 'Thu gọn thanh điều hướng');
      expect(t.widget<UuIconButton>(btn).size, UuButtonSize.small);
      expect(t.widget<UuIconButton>(btn).type, UuButtonType.ghost);
      final nav = t.getRect(find.byType(UuSideNav));
      // Dồn phải: mép phải nút = mép phải thanh − viền 1 − padding 12.
      expect(t.getRect(btn).right, nav.right - 1 - 12);
      // Nằm trên mục đầu tiên.
      expect(t.getRect(btn).bottom <= t.getRect(find.byType(UuSideNavItem)).top, isTrue);
      await t.tap(btn);
      expect(next, isTrue);
    });

    testWidgets('Nút thu / mở khi thu gọn: căn giữa, nhãn "Mở rộng…", có Tooltip, semantics expanded=false', (t) async {
      final h = t.ensureSemantics();
      bool? next;
      await _pump(t, SizedBox(
        height: 400,
        child: UuSideNav(toggle: true, collapsed: true, onCollapsedChanged: (v) => next = v, children: const [
          UuSideNavItem(label: 'Trang chủ', icon: 'texture'),
        ]),
      ));
      final btn = find.byType(UuIconButton);
      expect(t.widget<UuIconButton>(btn).label, 'Mở rộng thanh điều hướng');
      expect(find.ancestor(of: btn, matching: find.byType(UuTooltip)), findsOneWidget);
      final nav = t.getRect(find.byType(UuSideNav));
      // Căn giữa phần trong (bỏ viền phải 1).
      expect(t.getCenter(btn).dx, closeTo(nav.left + (nav.width - 1) / 2, 0.01));
      final node = t.getSemantics(find.bySemanticsLabel('Mở rộng thanh điều hướng'));
      expect(node.flagsCollection.isExpanded, Tristate.isFalse);
      await t.tap(btn);
      expect(next, isFalse);
      h.dispose();
    });
  });
}
