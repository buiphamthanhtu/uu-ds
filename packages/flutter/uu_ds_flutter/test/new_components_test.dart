// Widget mới §6.1 Danger · §6.8 CardSheet · §6.23–6.30: smoke test + density.
import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(UuDensity density, Widget child) => MaterialApp(
      theme: uuThemeData(density: density),
      home: Scaffold(body: Center(child: child)),
    );

Future<void> _pump(WidgetTester t, UuDensity d, Widget w) async {
  await t.pumpWidget(_wrap(d, w));
  await t.pumpAndSettle();
}

void main() {
  final c = UuSemanticColors.defaultBrand;

  testWidgets('TextButtonDanger: màu negative, Disabled như Accent, cao theo density', (t) async {
    expect(UuButtonStyleSpec.resolveDanger(c, UuButtonType.solid, false).background, c.backgroundNegative);
    expect(UuButtonStyleSpec.resolveDanger(c, UuButtonType.solid, false).content, c.objectOnNegative);
    expect(UuButtonStyleSpec.resolveDanger(c, UuButtonType.solid, false).surface, UuSurface.onDark);
    expect(UuButtonStyleSpec.resolveDanger(c, UuButtonType.outline, false).border, c.borderNegative);
    expect(UuButtonStyleSpec.resolveDanger(c, UuButtonType.ghost, false).content, c.objectNegative);
    expect(UuButtonStyleSpec.resolveDanger(c, UuButtonType.ghost, false).surface, UuSurface.onLight);
    final dis = UuButtonStyleSpec.resolveDanger(c, UuButtonType.solid, true);
    expect(dis.background, c.backgroundDisabled);
    expect(dis.content, c.objectDisabled);

    var tapped = 0;
    await _pump(t, UuDensity.touch, UuTextButtonDanger(label: 'Xoá tài khoản', onPressed: () => tapped++));
    expect(t.getSize(find.byType(UuTextButtonDanger)).height, 48);
    await t.tap(find.text('Xoá tài khoản'));
    expect(tapped, 1);
    await _pump(t, UuDensity.compact, const UuTextButtonDanger(label: 'Xoá', type: UuButtonType.outline, size: UuButtonSize.small));
    expect(t.getSize(find.byType(UuTextButtonDanger)).height, 24);
  });

  testWidgets('CardSheet: Close mặc định, Back loại trừ Close', (t) async {
    await _pump(t, UuDensity.touch, const SizedBox(width: 366, child: UuCardSheet(header: 'Chọn tỉnh', child: Text('Slot'))));
    expect(find.bySemanticsLabel('Đóng'), findsOneWidget);
    expect(find.bySemanticsLabel('Quay lại'), findsNothing);

    var back = 0;
    await _pump(t, UuDensity.touch, SizedBox(width: 366, child: UuCardSheet(header: 'Chọn huyện', onBack: () => back++, child: const Text('Slot'))));
    expect(find.bySemanticsLabel('Đóng'), findsNothing);
    await t.tap(find.bySemanticsLabel('Quay lại'));
    expect(back, 1);
    // Tên cũ vẫn dùng được.
    // ignore: deprecated_member_use_from_same_package
    const UuBaseSheet old = UuBaseSheet(header: 'H', child: SizedBox());
    expect(old, isA<UuCardSheet>());
  });

  testWidgets('TableCell 56 → 40 · TableHeaderCell 48 → 32', (t) async {
    await _pump(t, UuDensity.touch, const SizedBox(width: 200, child: UuTableCell(content: 'Nguyễn Văn A')));
    expect(t.getSize(find.byType(UuTableCell)).height, 56);
    await _pump(t, UuDensity.compact, const SizedBox(width: 200, child: UuTableCell(content: 'Nguyễn Văn A')));
    expect(t.getSize(find.byType(UuTableCell)).height, 40);
    await _pump(t, UuDensity.touch, const SizedBox(width: 200, child: UuTableHeaderCell(label: 'Tên', sort: UuTableSort.unsorted)));
    expect(t.getSize(find.byType(UuTableHeaderCell)).height, 48);
    await _pump(t, UuDensity.compact, const SizedBox(width: 200, child: UuTableHeaderCell(label: 'Tên', sort: UuTableSort.ascending, align: UuTableAlign.right)));
    expect(t.getSize(find.byType(UuTableHeaderCell)).height, 32);
  });

  testWidgets('Table: hàng chọn tô nền mọi ô, cột checkbox 64, hành động', (t) async {
    var more = 0;
    await _pump(
      t,
      UuDensity.compact,
      SizedBox(
        width: 800,
        child: UuTable(
          columns: const [
            UuTableColumn(width: UuTableCell.checkboxWidth),
            UuTableColumn(label: 'Khách hàng', flex: 2),
            UuTableColumn(label: 'Doanh thu', align: UuTableAlign.right, sort: UuTableSort.descending),
            UuTableColumn(label: ''),
          ],
          rows: [
            UuTableRow(selected: true, cells: [
              const UuTableCell(type: UuTableCellType.checkbox, checked: true),
              const UuTableCell(content: 'Công ty A'),
              const UuTableCell(content: '1.200.000 ₫', type: UuTableCellType.number),
              UuTableCell(type: UuTableCellType.actions, actionLabel: 'Xem', onMore: () => more++),
            ]),
            const UuTableRow(cells: [
              UuTableCell(type: UuTableCellType.checkbox, checked: false),
              UuTableCell(content: 'Công ty B'),
              UuTableCell(content: '800.000 ₫', type: UuTableCellType.number),
              UuTableCell(content: 'Ghi chú', type: UuTableCellType.secondary),
            ]),
          ],
        ),
      ),
    );
    expect(find.byType(UuTableHeaderCell), findsNWidgets(4));
    expect(t.getSize(find.byType(UuTableCell).first).width, 64);
    final selectedCell = t.widget<Container>(find.descendant(of: find.widgetWithText(UuTableCell, 'Công ty A'), matching: find.byType(Container)).first);
    expect((selectedCell.decoration! as BoxDecoration).color, c.backgroundInteractiveMuted);
    final plainCell = t.widget<Container>(find.descendant(of: find.widgetWithText(UuTableCell, 'Công ty B'), matching: find.byType(Container)).first);
    expect((plainCell.decoration! as BoxDecoration).color, isNull);
    await t.tap(find.bySemanticsLabel('Thêm hành động'));
    expect(more, 1);
  });

  testWidgets('TablePagination: lùi Disabled ở trang đầu, bấm số trang', (t) async {
    int? to;
    await _pump(t, UuDensity.compact, SizedBox(width: 700, child: UuTablePagination(page: 1, pageCount: 3, totalRows: 120, onPageChanged: (p) => to = p)));
    expect(find.text('trên 120 dòng'), findsOneWidget);
    final prev = t.widget<UuIconButton>(find.byType(UuIconButton).first);
    expect(prev.state, UuButtonState.disabled);
    expect(t.widget<UuIconButton>(find.byType(UuIconButton).last).state, UuButtonState.normal);
    await t.tap(find.text('3'));
    expect(to, 3);
  });

  testWidgets('Breadcrumb: mục cuối không bấm được', (t) async {
    var home = 0;
    await _pump(t, UuDensity.compact, UuBreadcrumb(items: [UuBreadcrumbItem('Trang chủ', onTap: () => home++), const UuBreadcrumbItem('Khách hàng')]));
    expect(find.text('/'), findsOneWidget);
    await t.tap(find.text('Trang chủ'));
    await t.tap(find.text('Khách hàng'));
    expect(home, 1);
    expect(t.widget<Text>(find.text('Khách hàng')).style!.color, c.objectPrimary);
    expect(t.widget<Text>(find.text('Trang chủ')).style!.color, c.objectSecondary);
  });

  testWidgets('KPICard: padding 16 → 12, Delta theo chiều số', (t) async {
    await _pump(t, UuDensity.touch, const UuKPICard(label: 'Doanh thu', value: '1,2 tỷ', trend: UuKpiTrend.up, delta: '+12%'));
    expect(t.widget<Text>(find.text('+12%')).style!.color, c.objectPositive);
    final pad = (t.widget<Container>(find.descendant(of: find.byType(UuKPICard), matching: find.byType(Container)).first).padding! as EdgeInsets);
    expect(pad.left, 16);
    await _pump(t, UuDensity.compact, const UuKPICard(label: 'Chi phí', value: '300 tr', trend: UuKpiTrend.down, delta: '-3%'));
    expect(t.widget<Text>(find.text('-3%')).style!.color, c.objectNegative);
    final pad2 = (t.widget<Container>(find.descendant(of: find.byType(UuKPICard), matching: find.byType(Container)).first).padding! as EdgeInsets);
    expect(pad2.left, 12);
    await _pump(t, UuDensity.touch, const UuKPICard(label: 'Đơn', value: '42'));
    expect(find.byType(UuIcon), findsNothing);
  });

  Widget nav({bool collapsed = false}) => SizedBox(
        height: 500,
        child: UuSideNav(collapsed: collapsed, children: [
          const UuSideNavSection(title: 'Quản lý'),
          UuSideNavItem(label: 'Khách hàng', icon: 'texture', active: true, chevron: true, onTap: () {}),
          UuSideNavItem(label: 'Danh sách', level: 2, onTap: () {}),
        ]),
      );

  testWidgets('SideNav 288 → 240, thu gọn 73', (t) async {
    await _pump(t, UuDensity.touch, nav());
    expect(t.getSize(find.byType(UuSideNav)).width, 288);
    expect(find.text('QUẢN LÝ'), findsOneWidget);
    expect(find.text('Danh sách'), findsOneWidget);
    await _pump(t, UuDensity.compact, nav());
    expect(t.getSize(find.byType(UuSideNav)).width, 240);
    expect(t.getSize(find.byType(UuSideNavItem).first).height, 32);
    await _pump(t, UuDensity.compact, nav(collapsed: true));
    expect(t.getSize(find.byType(UuSideNav)).width, 73);
    expect(find.text('QUẢN LÝ'), findsNothing);
    expect(find.text('Danh sách'), findsNothing);
    expect(find.text('Khách hàng'), findsNothing);
    expect(find.byType(UuTooltip), findsOneWidget);
    expect(t.getSize(find.byType(UuSideNavItem)), const Size(48, 48));
  });

  testWidgets('SideSheet 384, Standard / Modal, footer', (t) async {
    await _pump(t, UuDensity.compact, const SizedBox(height: 600, child: UuSideSheet(title: 'Chi tiết', primaryLabel: 'Lưu', secondaryLabel: 'Huỷ', children: [Text('A'), Text('B')])));
    expect(t.getSize(find.byType(UuSideSheet)).width, 384);
    expect(find.text('Lưu'), findsOneWidget);
    expect(find.text('Huỷ'), findsOneWidget);

    await t.pumpWidget(_wrap(UuDensity.compact, Builder(builder: (ctx) => UuTextButton(label: 'Mở', onPressed: () => showUuSideSheet<void>(ctx, title: 'Sửa', builder: (_) => const Text('Nội dung'))))));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    expect(find.text('Nội dung'), findsOneWidget);
    await t.tap(find.bySemanticsLabel('Đóng').last);
    await t.pumpAndSettle();
    expect(find.text('Nội dung'), findsNothing);
  });

  testWidgets('Popover 320, mở bằng bấm, đóng bằng nút đóng', (t) async {
    await _pump(t, UuDensity.compact, const UuPopover(title: 'Đổi tên', primaryLabel: 'Lưu', secondaryLabel: 'Huỷ', child: Text('Form')));
    expect(t.getSize(find.byType(UuPopover)).width, 320);

    await t.pumpWidget(_wrap(UuDensity.compact, Builder(builder: (ctx) => UuTextButton(label: 'Mở', onPressed: () => showUuPopover<void>(ctx, title: 'Đổi tên', builder: (_) => const Text('Form'))))));
    await t.tap(find.text('Mở'));
    await t.pumpAndSettle();
    expect(find.text('Form'), findsOneWidget);
    await t.tap(find.bySemanticsLabel('Đóng').last);
    await t.pumpAndSettle();
    expect(find.text('Form'), findsNothing);
  });

  testWidgets('Tooltip: hiện khi hover, ẩn khi rời', (t) async {
    await _pump(t, UuDensity.compact, const UuTooltip(text: 'Xoá hàng', child: SizedBox(width: 40, height: 40)));
    expect(find.byType(UuTooltipBubble), findsNothing);
    final g = await t.createGesture(kind: PointerDeviceKind.mouse);
    await g.addPointer(location: Offset.zero);
    addTearDown(g.removePointer);
    await g.moveTo(t.getCenter(find.byType(UuTooltip)));
    await t.pumpAndSettle();
    expect(find.byType(UuTooltipBubble), findsOneWidget);
    expect(t.getSize(find.byType(UuTooltipBubble)).width, lessThanOrEqualTo(240));
    await g.moveTo(Offset.zero);
    await t.pumpAndSettle();
    expect(find.byType(UuTooltipBubble), findsNothing);

    await _pump(t, UuDensity.compact, const UuTooltip(text: 'Ép hiện', open: true, placement: UuTooltipPlacement.right, child: SizedBox(width: 40, height: 40)));
    await t.pumpAndSettle();
    expect(find.text('Ép hiện'), findsOneWidget);
  });

  test('TablePagination: rút gọn "…" (P11)', () {
    String f(int p, int n) => uuPageItems(p, n).map((e) => e?.toString() ?? '…').join(' ');
    expect(f(3, 7), '1 2 3 4 5 6 7');
    expect(f(10, 20), '1 … 9 10 11 … 20');
    expect(f(2, 20), '1 2 3 … 20');
    expect(f(4, 20), '1 2 3 4 5 … 20');
    expect(f(20, 20), '1 … 19 20');
  });
}
