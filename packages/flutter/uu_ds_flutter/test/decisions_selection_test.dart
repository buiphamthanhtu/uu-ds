// Đợt chốt nhóm lựa chọn: Chip Prefix icon + Type=Input (§6.18) · Menu Description, Chọn tất cả, neo panel (§6.21) ·
// SearchInput xoá từng mục lịch sử (§6.3g) · Dropdown neo panel (§6.4).
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child, {UuDensity density = UuDensity.touch}) => MaterialApp(
      theme: uuThemeData(density: density),
      home: Scaffold(body: Align(alignment: Alignment.topLeft, child: Padding(padding: const EdgeInsets.all(UuGap.g4), child: child))),
    );

Future<void> _pump(WidgetTester t, Widget w, {UuDensity density = UuDensity.touch}) async {
  await t.pumpWidget(_wrap(w, density: density));
  await t.pumpAndSettle();
}

const _areas = [
  UuMenuOption(value: 'q1', label: 'Quận 1'),
  UuMenuOption(value: 'q3', label: 'Quận 3'),
  UuMenuOption(value: 'q7', label: 'Quận 7'),
  UuMenuOption(value: 'bt', label: 'Bình Thạnh'),
  UuMenuOption(value: 'td', label: 'Thủ Đức', disabled: true),
];

void main() {
  group('Chip', () {
    testWidgets('Prefix icon đứng trước chữ; Select đã chọn thì check thay chỗ', (t) async {
      await _pump(t, const Column(children: [
        UuChip(label: 'A', prefixIcon: 'texture'),
        UuChip(label: 'B', prefixIcon: 'texture', selected: true),
      ]));
      final icons = t.widgetList<UuIcon>(find.byType(UuIcon)).map((i) => i.name).toList();
      expect(icons, ['texture', 'check']);
    });

    testWidgets('Type=Input: nút gỡ có nhãn "Gỡ {nhãn}", bấm thì gọi onRemove', (t) async {
      var removed = 0;
      await _pump(t, UuChip(label: 'Đà Lạt', type: UuChipType.input, onRemove: () => removed++));
      expect(find.bySemanticsLabel('Gỡ Đà Lạt'), findsOneWidget);
      expect(find.byType(UuPressable), findsOneWidget); // thân chip không bấm được, chỉ nút gỡ
      await t.tap(find.byType(UuPressable));
      expect(removed, 1);
      final box = t.getSize(find.byType(UuPressable));
      expect(box, const Size(UuSize.s6, UuSize.s6));
      expect(t.getSize(find.byType(UuChip)).height, UuSize.s8);
    });

    testWidgets('Type=Input: Backspace / Delete khi nút có focus thì gỡ', (t) async {
      var removed = 0;
      await _pump(t, UuChip(label: 'Đà Lạt', type: UuChipType.input, onRemove: () => removed++));
      await t.sendKeyEvent(LogicalKeyboardKey.tab);
      await t.pump();
      await t.sendKeyEvent(LogicalKeyboardKey.backspace);
      await t.pump();
      expect(removed, 1);
    });

    testWidgets('Type=Input Disabled: không gỡ được', (t) async {
      var removed = 0;
      await _pump(t, UuChip(label: 'Đà Lạt', type: UuChipType.input, disabled: true, onRemove: () => removed++));
      await t.tap(find.byType(UuPressable));
      expect(removed, 0);
    });

    testWidgets('Type=Dropdown + menu: panel neo dưới chip, rộng tối thiểu 240, chọn xong đóng', (t) async {
      String? picked;
      var open = true;
      await _pump(t, StatefulBuilder(builder: (context, set) => UuChip(
            label: 'Khoảng giá',
            type: UuChipType.dropdown,
            open: open,
            onSelectedChanged: (_) => set(() => open = !open),
            onClose: () => set(() => open = false),
            menu: UuMenu<String>(options: _areas, onSelect: (v) => picked = v),
          )));
      final chip = t.getRect(find.byType(UuChip));
      final panel = t.getRect(find.byType(UuMenuPanel));
      expect(panel.top, chip.bottom + UuGap.g1);
      expect(panel.left, chip.left);
      expect(panel.width, UuSize.s60);
      await t.tap(find.text('Quận 3'));
      await t.pumpAndSettle();
      expect(picked, 'q3');
      expect(find.byType(UuMenuPanel), findsNothing);
    });
  });

  group('Menu', () {
    testWidgets('Description: dòng caption object-secondary, tối đa 2 dòng; hàng căn trên', (t) async {
      await _pump(t, const SizedBox(width: 280, child: UuMenuItem(label: 'Giao nhanh', description: 'Nhận hàng trong 24 giờ', icon: 'texture')));
      final desc = t.widget<Text>(find.text('Nhận hàng trong 24 giờ'));
      expect(desc.maxLines, 2);
      expect(desc.overflow, TextOverflow.ellipsis);
      final ctx = t.element(find.byType(UuMenuItem));
      expect(desc.style!.color, UuTheme.of(ctx).colors.objectSecondary);
      expect(t.getTopLeft(find.byType(UuIcon)).dy, t.getTopLeft(find.text('Giao nhanh')).dy);
    });

    testWidgets('Chọn tất cả: trống → chọn hết (bỏ qua Disabled) → bỏ hết; một phần = Indeterminate', (t) async {
      var values = <String>{'q1'};
      await _pump(t, StatefulBuilder(builder: (context, set) => SizedBox(
            width: 280,
            child: UuMenu<String>(
              options: _areas,
              type: UuMenuItemType.multiple,
              selectAll: true,
              values: values,
              onValuesChanged: (v) => set(() => values = v),
            ),
          )));
      expect(find.text('Chọn tất cả'), findsOneWidget);
      expect(find.byType(UuMenuDivider), findsOneWidget);
      UuCheckbox box() => t.widget<UuCheckbox>(find.descendant(of: find.widgetWithText(UuMenuItem, 'Chọn tất cả'), matching: find.byType(UuCheckbox)));
      expect(box().checked, isNull); // Indeterminate
      await t.tap(find.text('Chọn tất cả'));
      await t.pumpAndSettle();
      expect(values, {'q1', 'q3', 'q7', 'bt'});
      expect(box().checked, isTrue);
      await t.tap(find.text('Chọn tất cả'));
      await t.pumpAndSettle();
      expect(values, isEmpty);
      expect(box().checked, isFalse);
    });

    testWidgets('Chọn tất cả khi đang tìm nhanh chỉ tác động option đang hiện', (t) async {
      var values = <String>{};
      await _pump(t, StatefulBuilder(builder: (context, set) => SizedBox(
            width: 280,
            child: UuMenu<String>(
              options: _areas,
              type: UuMenuItemType.multiple,
              selectAll: true,
              search: true,
              values: values,
              onValuesChanged: (v) => set(() => values = v),
            ),
          )));
      await t.enterText(find.byType(TextField), 'Quận');
      await t.pumpAndSettle();
      await t.tap(find.text('Chọn tất cả'));
      await t.pumpAndSettle();
      expect(values, {'q1', 'q3', 'q7'});
    });

    testWidgets('Neo panel: lật lên khi phía dưới thiếu chỗ; cao tối đa 320; bấm ra ngoài thì đóng', (t) async {
      final many = [for (var i = 0; i < 20; i++) UuMenuOption(value: '$i', label: 'Option $i')];
      var open = true;
      await t.pumpWidget(MaterialApp(
        theme: uuThemeData(),
        home: Scaffold(
          body: StatefulBuilder(builder: (context, set) => Stack(children: [
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 16,
                  child: UuDropdown(
                    label: 'Tỉnh',
                    open: open,
                    onOpen: () => set(() => open = true),
                    onClose: () => set(() => open = false),
                    menu: UuMenu<String>(options: many, onSelect: (_) {}),
                  ),
                ),
              ])),
        ),
      ));
      await t.pumpAndSettle();
      final field = t.getRect(find.byType(UuFieldShell));
      final panel = t.getRect(find.byType(UuMenuPanel));
      expect(panel.bottom, field.top - UuGap.g1);
      expect(panel.height, UuSize.s80);
      expect(panel.width, field.width);
      await t.tapAt(const Offset(2, 2));
      await t.pumpAndSettle();
      expect(open, isFalse);
      expect(find.byType(UuMenuPanel), findsNothing);
    });
  });

  group('SearchInput', () {
    testWidgets('Xoá từng mục "Tìm gần đây": panel vẫn mở, focus về ô, xoá hết thì nhóm biến mất', (t) async {
      var recent = ['Đà Lạt', 'Sa Pa'];
      String? selected;
      await _pump(t, StatefulBuilder(builder: (context, set) => SizedBox(
            width: 358,
            child: UuSearchInput(
              recent: recent,
              onSelectSuggestion: (v) => selected = v,
              onRemoveRecent: (v) => set(() => recent = [...recent]..remove(v)),
            ),
          )));
      await t.tap(find.byType(TextField));
      await t.pumpAndSettle();
      expect(find.text('TÌM GẦN ĐÂY'), findsOneWidget);
      expect(find.bySemanticsLabel('Xoá “Đà Lạt”'), findsOneWidget);
      await t.tap(find.bySemanticsLabel('Xoá “Đà Lạt”'));
      await t.pumpAndSettle();
      expect(selected, isNull); // nút không kích hoạt hàng
      expect(recent, ['Sa Pa']);
      expect(find.text('Sa Pa'), findsOneWidget); // panel vẫn mở
      final editable = t.widget<EditableText>(find.byType(EditableText));
      expect(editable.focusNode.hasFocus, isTrue);
      await t.tap(find.bySemanticsLabel('Xoá “Sa Pa”'));
      await t.pumpAndSettle();
      expect(find.text('TÌM GẦN ĐÂY'), findsNothing);
    });
  });
}
