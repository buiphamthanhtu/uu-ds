// Nhóm dữ liệu: TableHeaderCell Type=Checkbox · TableCell Type=Status (§6.23) · KPICard Polarity / Interactive (§6.26).
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child, {UuDensity density = UuDensity.compact}) => MaterialApp(
      theme: uuThemeData(density: density),
      home: Scaffold(body: Center(child: SizedBox(width: 640, child: child))),
    );

/// Bảng có cột chọn hàng: ô đầu chọn / bỏ cả trang.
class _Selectable extends StatefulWidget {
  const _Selectable({required this.initial});
  final Set<int> initial;
  @override
  State<_Selectable> createState() => _SelectableState();
}

class _SelectableState extends State<_Selectable> {
  late Set<int> picked = {...widget.initial};
  static const rows = [0, 1, 2];

  @override
  Widget build(BuildContext context) => UuTable(
        columns: [
          UuTableColumn(
            type: UuTableHeaderCellType.checkbox,
            checked: UuTableHeaderCell.checkedFor(picked.length, rows.length),
            onCheckedChanged: (on) => setState(() => picked = on ? {...rows} : {}),
          ),
          const UuTableColumn(label: 'Khách hàng'),
          const UuTableColumn(label: 'Trạng thái'),
        ],
        rows: [
          for (final r in rows)
            UuTableRow(selected: picked.contains(r), cells: [
              UuTableCell(type: UuTableCellType.checkbox, content: 'Chọn đơn $r', checked: picked.contains(r),
                  onCheckedChanged: (v) => setState(() => v ? picked.add(r) : picked.remove(r))),
              UuTableCell(content: 'Khách $r'),
              const UuTableCell(type: UuTableCellType.status, content: 'Đã giao', statusTone: UuTone.success),
            ]),
        ],
      );
}

UuCheckbox _headerBox(WidgetTester t) => t.widget<UuCheckbox>(find.descendant(of: find.byType(UuTableHeaderCell), matching: find.byType(UuCheckbox)));

void main() {
  test('checkedFor: đủ → true, một phần → null (Indeterminate), không → false', () {
    expect(UuTableHeaderCell.checkedFor(3, 3), isTrue);
    expect(UuTableHeaderCell.checkedFor(1, 3), isNull);
    expect(UuTableHeaderCell.checkedFor(0, 3), isFalse);
  });

  for (final d in UuDensity.values) {
    testWidgets('Header Type=Checkbox rộng 64, cao table/header-height · ${d.name}', (t) async {
      await t.pumpWidget(_wrap(const Align(alignment: Alignment.centerLeft, child: UuTableHeaderCell(type: UuTableHeaderCellType.checkbox)), density: d));
      final size = t.getSize(find.byType(UuTableHeaderCell));
      expect(size.width, UuSize.s16);
      expect(size.height, d == UuDensity.compact ? 32 : 48);
      // Không nhãn, không icon sắp xếp.
      expect(find.byType(Text), findsNothing);
      expect(find.byType(UuIcon), findsNothing);
    });
  }

  testWidgets('Header checkbox có nhãn "Chọn tất cả hàng", không state layer riêng', (t) async {
    final h = t.ensureSemantics();
    await t.pumpWidget(_wrap(UuTableHeaderCell(type: UuTableHeaderCellType.checkbox, checked: null, onCheckedChanged: (_) {})));
    expect(find.bySemanticsLabel('Chọn tất cả hàng'), findsOneWidget);
    expect(find.descendant(of: find.byType(UuTableHeaderCell), matching: find.byType(UuPressable)), findsNothing);
    h.dispose();
  });

  testWidgets('Bấm ô đầu chọn / bỏ cả trang; Indeterminate khi chọn một phần', (t) async {
    await t.pumpWidget(_wrap(const _Selectable(initial: {1})));
    expect(_headerBox(t).checked, isNull);
    await t.tap(find.descendant(of: find.byType(UuTableHeaderCell), matching: find.byType(UuCheckbox)));
    await t.pump();
    expect(_headerBox(t).checked, isTrue);
    expect(t.widgetList<UuTableRow>(find.byType(UuTableRow)).every((r) => r.selected), isTrue);
    await t.tap(find.descendant(of: find.byType(UuTableHeaderCell), matching: find.byType(UuCheckbox)));
    await t.pump();
    expect(_headerBox(t).checked, isFalse);
    expect(t.widgetList<UuTableRow>(find.byType(UuTableRow)).any((r) => r.selected), isFalse);
    // Chọn một hàng → Indeterminate.
    await t.tap(find.byType(UuCheckbox).at(1));
    await t.pump();
    expect(_headerBox(t).checked, isNull);
  });

  testWidgets('Cột checkbox của UuTable rộng 64 ở cả tiêu đề lẫn ô', (t) async {
    await t.pumpWidget(_wrap(const _Selectable(initial: {})));
    expect(t.getSize(find.byType(UuTableHeaderCell).first).width, UuSize.s16);
    expect(t.getSize(find.byWidgetPredicate((w) => w is UuTableCell && w.type == UuTableCellType.checkbox).first).width, UuSize.s16);
  });

  testWidgets('TableCell Type=Status: StatusIndicator căn trái, chữ nằm trong indicator', (t) async {
    await t.pumpWidget(_wrap(const UuTable(columns: [UuTableColumn(label: 'Trạng thái')], rows: [
      UuTableRow(cells: [UuTableCell(type: UuTableCellType.status, content: 'Chờ xác nhận', statusTone: UuTone.warning)]),
    ])));
    final si = t.widget<UuStatusIndicator>(find.byType(UuStatusIndicator));
    expect(si.label, 'Chờ xác nhận');
    expect(si.tone, UuTone.warning);
    expect(si.filled, isFalse);
    final cellLeft = t.getTopLeft(find.byType(UuTableCell)).dx;
    final dotLeft = t.getTopLeft(find.byType(UuStatusIndicator)).dx;
    expect(dotLeft - cellLeft, 12); // padding ngang Compact
    expect(find.text('Chờ xác nhận'), findsOneWidget);
  });

  testWidgets('TableCell đủ 6 Type × 3 State dựng được', (t) async {
    await t.pumpWidget(_wrap(SingleChildScrollView(child: Column(children: [
      for (final type in UuTableCellType.values)
        for (final state in UuTableCellState.values)
          UuTableCell(type: type, state: state, content: 'Ô', actionLabel: 'Xem', onMore: () {}),
    ]))));
    expect(find.byType(UuTableCell), findsNWidgets(18));
    expect(t.takeException(), isNull);
  });

  group('KPICard Polarity', () {
    Color deltaColor(WidgetTester t) => t.widget<Text>(find.textContaining('so với')).style!.color!;
    Future<UuSemanticColors> colors(WidgetTester t) async => UuTheme.of(t.element(find.byType(UuKPICard))).colors;

    for (final (trend, polarity, positive) in [
      (UuKpiTrend.up, UuKpiPolarity.normal, true),
      (UuKpiTrend.down, UuKpiPolarity.normal, false),
      (UuKpiTrend.up, UuKpiPolarity.inverse, false),
      (UuKpiTrend.down, UuKpiPolarity.inverse, true),
    ]) {
      testWidgets('${trend.name} · ${polarity.name} → ${positive ? 'positive' : 'negative'}', (t) async {
        await t.pumpWidget(_wrap(UuKPICard(label: 'Chi phí', value: '42.500.000 ₫', trend: trend, polarity: polarity, delta: '5% so với tháng trước')));
        final c = await colors(t);
        expect(deltaColor(t), positive ? c.objectPositive : c.objectNegative);
        // Icon vẫn theo chiều số.
        final icon = t.widget<UuIcon>(find.byType(UuIcon));
        expect(icon.name, trend == UuKpiTrend.up ? 'arrow-trend-up' : 'arrow-trend-down');
      });
    }

    testWidgets('Không trend thì Polarity bị bỏ qua (không Delta)', (t) async {
      await t.pumpWidget(_wrap(const UuKPICard(label: 'Khách hàng', value: '18.420', polarity: UuKpiPolarity.inverse)));
      expect(find.byType(UuIcon), findsNothing);
    });
  });

  group('KPICard Interactive', () {
    testWidgets('Có onTap: chevron-right 16 object-secondary, cả thẻ một vùng bấm', (t) async {
      var taps = 0;
      await t.pumpWidget(_wrap(UuKPICard(label: 'Đơn hàng mới', value: '1.284', onTap: () => taps++)));
      final chevron = t.widget<UuIcon>(find.byType(UuIcon));
      expect(chevron.name, 'chevron-right');
      expect(chevron.size, UuSize.s4);
      expect(chevron.color, UuTheme.of(t.element(find.byType(UuKPICard))).colors.objectSecondary);
      expect(find.byType(UuPressable), findsOneWidget);
      await t.tap(find.text('1.284'));
      expect(taps, 1);
    });

    testWidgets('Không onTap: không chevron, không state layer', (t) async {
      await t.pumpWidget(_wrap(const UuKPICard(label: 'Đơn hàng mới', value: '1.284')));
      expect(find.byType(UuIcon), findsNothing);
      expect(find.byType(UuPressable), findsNothing);
    });

    testWidgets('Interactive không đổi kích thước thẻ', (t) async {
      await t.pumpWidget(_wrap(Column(children: [
        const UuKPICard(key: ValueKey('a'), label: 'Đơn hàng mới', value: '1.284'),
        UuKPICard(key: const ValueKey('b'), label: 'Đơn hàng mới', value: '1.284', onTap: () {}),
      ])));
      expect(t.getSize(find.byKey(const ValueKey('a'))).height, t.getSize(find.byKey(const ValueKey('b'))).height);
    });

    testWidgets('Focus bàn phím vẽ vòng 2px border-emphasized', (t) async {
      await t.pumpWidget(_wrap(UuKPICard(label: 'Đơn hàng mới', value: '1.284', onTap: () {})));
      FocusManager.instance.highlightStrategy = FocusHighlightStrategy.alwaysTraditional;
      await t.sendKeyEvent(LogicalKeyboardKey.tab);
      await t.pump();
      final c = UuTheme.of(t.element(find.byType(UuKPICard))).colors;
      final ring = find.byWidgetPredicate((w) => w is DecoratedBox && w.decoration is BoxDecoration &&
          (w.decoration as BoxDecoration).border is Border &&
          ((w.decoration as BoxDecoration).border as Border).top.color == c.borderEmphasized &&
          ((w.decoration as BoxDecoration).border as Border).top.width == 2);
      expect(ring, findsOneWidget);
      FocusManager.instance.highlightStrategy = FocusHighlightStrategy.automatic;
    });
  });
}
