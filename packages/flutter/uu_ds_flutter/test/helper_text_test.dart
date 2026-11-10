// Dòng gợi ý (§6.3 Helper text): dưới label, trên ô; có lỗi vẫn giữ, dòng lỗi dưới ô.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

Future<void> _pump(WidgetTester t, Widget w) async {
  await t.pumpWidget(MaterialApp(theme: uuThemeData(), home: Scaffold(body: Center(child: SizedBox(width: 300, child: w)))));
  await t.pumpAndSettle();
}

void main() {
  for (final entry in <String, Widget Function()>{
    'UuTextInput': () => const UuTextInput(label: 'Mật khẩu', helperText: 'Tối thiểu 8 ký tự', error: true, errorMessage: 'Mật khẩu quá ngắn'),
    'UuTextArea': () => const UuTextArea(label: 'Mật khẩu', helperText: 'Tối thiểu 8 ký tự', error: true, errorMessage: 'Mật khẩu quá ngắn'),
  }.entries) {
    testWidgets('${entry.key}: label → gợi ý → ô → lỗi, cách nhau 4', (t) async {
      await _pump(t, entry.value());
      final label = t.getRect(find.text('Mật khẩu'));
      final helper = t.getRect(find.text('Tối thiểu 8 ký tự'));
      final shell = t.getRect(find.byType(UuFieldShell));
      final error = t.getRect(find.text('Mật khẩu quá ngắn'));
      expect(helper.top, greaterThanOrEqualTo(label.bottom));
      expect(shell.top - helper.bottom, 4);
      expect(error.top - shell.bottom, 4);
    });
  }
}
