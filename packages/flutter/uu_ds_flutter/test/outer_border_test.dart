// Viền ngoài DNA (§4.3) và ButtonGroup kéo hết bề ngang (§6.9).
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

const _ink = Color(0xFF000000);

ThemeData _dna() => uuThemeData(
      borderOuterWidth: 2,
      borderOuter: _ink,
      elevationNone: const [BoxShadow(color: _ink, offset: Offset(2, 2), spreadRadius: 2)],
    );

Future<ui.Image> _shot(WidgetTester t, GlobalKey key) async {
  final boundary = key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
  return (await t.runAsync(() => boundary.toImage()))!;
}

Future<Color> _pixel(WidgetTester t, ui.Image img, int x, int y) async {
  final data = (await t.runAsync(() => img.toByteData(format: ui.ImageByteFormat.rawRgba)))!;
  final i = (y * img.width + x) * 4;
  return Color.fromARGB(data.getUint8(i + 3), data.getUint8(i), data.getUint8(i + 1), data.getUint8(i + 2));
}

void main() {
  testWidgets('DNA viền ngoài: nút Ghost không bị tô kín, vòng viền vẫn nằm ngoài', (t) async {
    final key = GlobalKey();
    await t.pumpWidget(MaterialApp(
      theme: _dna(),
      home: Scaffold(
        backgroundColor: const Color(0xFFFFFFFF),
        body: Center(
          child: RepaintBoundary(
            key: key,
            child: ColoredBox(
              color: const Color(0xFFFFFFFF),
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: UuTextButton(label: '', type: UuButtonType.ghost, onPressed: () {}),
              ),
            ),
          ),
        ),
      ),
    ));
    await t.pumpAndSettle();
    final img = await _shot(t, key);
    final center = await _pixel(t, img, img.width ~/ 2, img.height ~/ 2);
    expect(center.computeLuminance(), greaterThan(0.9), reason: 'giữa nút Ghost phải trong suốt (thấy nền trắng)');
    final ring = await _pixel(t, img, img.width ~/ 2, 7); // 1px trên mép nút
    expect(ring.computeLuminance(), lessThan(0.1), reason: 'vòng viền ngoài màu đen');
  });

  testWidgets('Không DNA: outerDecoration trả BoxDecoration nguyên bản', (t) async {
    late Decoration d;
    await t.pumpWidget(MaterialApp(
      theme: uuThemeData(),
      home: Builder(builder: (c) {
        d = UuTheme.of(c).outerDecoration(const BoxDecoration());
        return const SizedBox();
      }),
    ));
    expect(d, isA<BoxDecoration>());
  });

  testWidgets('ButtonGroup Horizontal chia đều, Vertical kéo hết bề ngang', (t) async {
    await t.pumpWidget(MaterialApp(
      theme: uuThemeData(),
      home: const Scaffold(
        body: Center(
          child: SizedBox(
            width: 358,
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              UuButtonGroup(primary: UuGroupAction('OK'), secondary: UuGroupAction('No')),
              UuButtonGroup(layout: UuButtonGroupLayout.vertical, primary: UuGroupAction('Go'), secondary: UuGroupAction('Back')),
            ]),
          ),
        ),
      ),
    ));
    await t.pumpAndSettle();
    double w(String label) => t.getSize(find.ancestor(of: find.text(label), matching: find.byType(UuPressable)).first).width;
    expect(w('No'), w('OK'));
    expect(w('No'), closeTo((358 - UuGap.g3) / 2, 0.5));
    expect(w('Go'), 358);
    expect(w('Back'), 358);
  });
}
