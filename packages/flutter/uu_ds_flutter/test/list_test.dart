import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Widget _wrap(Widget child, {UuDensity density = UuDensity.touch}) => MaterialApp(
      theme: uuThemeData(density: density),
      home: Scaffold(body: Center(child: SizedBox(width: 390, child: child))),
    );

void main() {
  testWidgets('ListItem §6.32: cao tối thiểu 56 (Touch) / 40 (Compact)', (t) async {
    await t.pumpWidget(_wrap(const UuListItem(title: 'Ngôn ngữ')));
    expect(t.getSize(find.byType(UuListItem)).height, 56);
    await t.pumpWidget(_wrap(const UuListItem(title: 'Ngôn ngữ'), density: UuDensity.compact));
    await t.pumpAndSettle(); // MaterialApp chuyển theme có hoạt ảnh
    expect(t.getSize(find.byType(UuListItem)).height, 40);
  });

  testWidgets('ListItem: bấm chữ trên hàng bật Switch; nút Action không kích hoạt hàng', (t) async {
    var on = false;
    var rowTaps = 0;
    var actionTaps = 0;
    await t.pumpWidget(_wrap(StatefulBuilder(
      builder: (context, set) => Column(children: [
        UuListItem(title: 'Thông báo đẩy', selection: UuListSelection.switcher(checked: on, onChanged: (v) => set(() => on = v))),
        UuListItem(title: 'Nhà riêng', onTap: () => rowTaps++, action: UuListAction(icon: 'texture', label: 'Sửa', onPressed: () => actionTaps++)),
      ]),
    )));
    await t.tap(find.text('Thông báo đẩy'));
    await t.pumpAndSettle();
    expect(on, isTrue);
    await t.tap(find.bySemanticsLabel('Sửa'));
    await t.pump();
    expect((actionTaps, rowTaps), (1, 0));
    await t.tap(find.text('Nhà riêng'));
    await t.pump();
    expect(rowTaps, 1);
  });

  testWidgets('ListGroup: vạch ngăn mọi hàng trừ hàng cuối', (t) async {
    await t.pumpWidget(_wrap(const UuListGroup(title: 'Cài đặt', children: [
      UuListItem(title: 'A'),
      UuListItem(title: 'B'),
      UuListItem(title: 'C'),
    ])));
    final items = t.widgetList<UuListItem>(find.byType(UuListItem)).toList();
    expect(items.map((e) => e.divider), [true, true, false]);
    expect(find.text('CÀI ĐẶT'), findsOneWidget);
  });
}
