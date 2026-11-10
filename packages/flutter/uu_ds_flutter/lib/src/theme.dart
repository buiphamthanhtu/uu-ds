import 'dart:math' as math;

import 'package:flutter/foundation.dart' show listEquals;
import 'package:flutter/material.dart';
import 'tokens.g.dart';

/// Brand mode (spec 2.5): [defaultBrand] = Default (indigo / blue / slate) · [uu] = UU (cam + vàng nhận diện Ú Ù).
/// Thêm brand: thêm khoá mới dưới `semantic.color` trong tokens.json, chạy `npm run tokens:dart`, rồi thêm giá trị
/// vào enum này và vào [UuTheme.brand]. (`default` là từ khoá của Dart nên mode Default tên `defaultBrand`.)
enum UuBrand { defaultBrand, uu }

/// Density (spec §4.1). [touch] = mặc định, đúng kích thước gốc (app mobile, mini app).
/// [compact] = desktop / dashboard: control, field, chữ lùi một bậc. Độc lập với brand.
enum UuDensity { touch, compact }

/// Layout (spec §4.2): khung đang [expanded] (đầy đủ, mặc định) hay [collapsed] (thu gọn chỉ còn icon).
/// Trục của cả màn hoặc một vùng, ngang hàng brand và density. Chỉ đổi HIỂN THỊ, không đổi kích thước.
/// Ba biến vai trò: [UuTheme.showLabel] · [UuTheme.showSectionTitle] · [UuTheme.showNested].
/// Đổi cho một vùng: bọc vùng đó trong `Theme(data: t.copyWith(extensions: [uu.copyWith(layout: …)]))`.
enum UuLayout { expanded, collapsed }

/// Một icon của bộ riêng: chuỗi SVG (`currentColor`). Không có [fill] → trạng thái bật dùng [outline].
class UuIconSetEntry {
  const UuIconSetEntry({required this.outline, this.fill});
  final String outline;
  final String? fill;
}

/// Gắn UU DS vào [ThemeData] qua ThemeExtension. Lấy ra bằng `UuTheme.of(context)`.
/// Widget đọc màu ở [colors], kích thước control ở [sizes], chữ ở [text] — không dùng hằng số
/// Touch (`UuTextStyles`, số 56/48/32…) trong widget, để Compact co theo.
class UuTheme extends ThemeExtension<UuTheme> {
  const UuTheme({
    required this.brand,
    required this.colors,
    this.density = UuDensity.touch,
    this.sizes = UuSizes.touch,
    UuText text = UuText.touch,
    this.layout = UuLayout.expanded,
    this.fontFamilyBody,
    this.borderOuterWidth = 0,
    this.borderOuter,
    this.elevationNone = const [],
    this.icons = const {},
  }) : _text = text;

  factory UuTheme.brand(UuBrand brand, {UuDensity density = UuDensity.touch, UuLayout layout = UuLayout.expanded}) => UuTheme(
        brand: brand,
        layout: layout,
        colors: switch (brand) { UuBrand.defaultBrand => UuSemanticColors.defaultBrand, UuBrand.uu => UuSemanticColors.uu },
        density: density,
        sizes: switch (density) { UuDensity.touch => UuSizes.touch, UuDensity.compact => UuSizes.compact },
        text: switch (density) { UuDensity.touch => UuText.touch, UuDensity.compact => UuText.compact },
      );

  final UuBrand brand;
  final UuSemanticColors colors;
  final UuDensity density;
  final UuSizes sizes;
  final UuText _text;
  final UuLayout layout;

  /// Product DNA (spec 4.3) — `font-family-body`: họ font cho mọi style trừ display. `null` = font hệ thống.
  /// Chỉ đổi họ font; cỡ, line-height, độ đậm giữ thang. App tự khai font trong pubspec.
  final String? fontFamilyBody;

  /// DNA — `border-outer-width`: viền ngoài của control (nút, chip, checkbox, radio, switch, ô nhập) và thẻ
  /// (`UuCardSheet`, `UuCardDialog`, `UuKPICard`). Mặc định 0. Vẽ ngoài, không chiếm chỗ.
  final double borderOuterWidth;

  /// DNA — `border-outer`: màu viền ngoài. `null` = `object-primary`.
  final Color? borderOuter;

  /// DNA — `elevation-none`: bóng của control (blurRadius 0 = bóng cứng). Mặc định không có. Đi cùng viền
  /// thì `spreadRadius` = [borderOuterWidth], không thì bóng nằm trọn sau viền ngoài.
  final List<BoxShadow> elevationNone;

  /// Vòng viền ngoài của thẻ: gắn vào `BoxDecoration.boxShadow` bọc ngoài thẻ.
  List<BoxShadow> get cardShadows => [if (borderOuterWidth > 0) BoxShadow(color: borderOuter ?? colors.objectPrimary, spreadRadius: borderOuterWidth)];

  /// Bộ icon riêng của sản phẩm (spec 4.3): tên → SVG. Tên đăng ký ghi đè icon mặc định cùng tên.
  final Map<String, UuIconSetEntry> icons;

  /// Text style theo density, đã áp [fontFamilyBody].
  UuText get text => fontFamilyBody == null ? _text : _withFamily(_text, fontFamilyBody!);

  /// Vòng viền ngoài + bóng của control: gắn vào `BoxDecoration.boxShadow`. Không chiếm chỗ, không che viền trạng thái.
  /// P33 (spec 4.3): bật vòng viền ngoài thì viền trong ở trạng thái thường trong suốt. Giữ độ dày viền nên kích thước
  /// control không đổi. Chỉ gọi cho màu viền **trạng thái thường**; viền focus / Error / chọn / Disabled vẫn giữ màu.
  Color restBorder(Color c) => borderOuterWidth > 0 ? const Color(0x00000000) : c;

  /// Bọc [box] để vẽ [outerShadows] **chỉ bên ngoài** hình của hộp, như CSS `box-shadow`. Gắn thẳng
  /// `boxShadow` thì Flutter tô cả phần dưới hộp, nút nền trong suốt (Outline, Ghost) bị lấp kín màu viền.
  Decoration outerDecoration(BoxDecoration box) => outerShadows.isEmpty ? box : UuOuterDecoration(box, outerShadows);

  List<BoxShadow> get outerShadows => [
        if (borderOuterWidth > 0) BoxShadow(color: borderOuter ?? colors.objectPrimary, spreadRadius: borderOuterWidth),
        ...elevationNone,
      ];

  static UuText _withFamily(UuText t, String f) => UuText(
        headingLg: t.headingLg.copyWith(fontFamily: f),
        headingBase: t.headingBase.copyWith(fontFamily: f),
        headingSm: t.headingSm.copyWith(fontFamily: f),
        titleBase: t.titleBase.copyWith(fontFamily: f),
        titleSm: t.titleSm.copyWith(fontFamily: f),
        titleXs: t.titleXs.copyWith(fontFamily: f),
        body: t.body.copyWith(fontFamily: f),
        label: t.label.copyWith(fontFamily: f),
        caption: t.caption.copyWith(fontFamily: f),
        labelActive: t.labelActive.copyWith(fontFamily: f),
      );

  /// `layout/show-label`: nhãn đi kèm icon (`.SideNavItem`).
  bool get showLabel => layout == UuLayout.expanded;

  /// `layout/show-section-title`: tiêu đề nhóm (`.SideNavSection`, `.MenuSection`).
  bool get showSectionTitle => layout == UuLayout.expanded;

  /// `layout/show-nested`: mục cấp 2 (`.SideNavItem` `Level=2`).
  bool get showNested => layout == UuLayout.expanded;

  static const _fallback = UuTheme(brand: UuBrand.defaultBrand, colors: UuSemanticColors.defaultBrand);

  static UuTheme of(BuildContext context) => Theme.of(context).extension<UuTheme>() ?? _fallback;

  @override
  UuTheme copyWith({
    UuBrand? brand,
    UuSemanticColors? colors,
    UuDensity? density,
    UuSizes? sizes,
    UuText? text,
    UuLayout? layout,
    String? fontFamilyBody,
    double? borderOuterWidth,
    Color? borderOuter,
    List<BoxShadow>? elevationNone,
    Map<String, UuIconSetEntry>? icons,
  }) =>
      UuTheme(
        brand: brand ?? this.brand,
        colors: colors ?? this.colors,
        density: density ?? this.density,
        sizes: sizes ?? this.sizes,
        text: text ?? _text,
        layout: layout ?? this.layout,
        fontFamilyBody: fontFamilyBody ?? this.fontFamilyBody,
        borderOuterWidth: borderOuterWidth ?? this.borderOuterWidth,
        borderOuter: borderOuter ?? this.borderOuter,
        elevationNone: elevationNone ?? this.elevationNone,
        icons: icons ?? this.icons,
      );

  @override
  UuTheme lerp(ThemeExtension<UuTheme>? other, double t) {
    if (other is! UuTheme) return this;
    return t < 0.5 ? this : other; // token rời rạc — không nội suy giữa hai brand / density / layout
  }
}

/// ThemeData sẵn cho MaterialApp. Font body = font hệ thống (không đặt fontFamily).
/// Tắt ripple của Material: tương tác của UU DS là state layer, không phải splash.
///
/// Product DNA (spec 4.3): [fontFamilyBody] · [fontFamilyDisplay] (chỉ họ font), [borderOuterWidth] ·
/// [borderOuter] (viền ngoài control + thẻ, mặc định không có), [elevationNone] (bóng control), [icons] (bộ icon riêng).
/// Màu DNA: `uuThemeData(...).copyWith(extensions: [uu.copyWith(colors: …)])`.
ThemeData uuThemeData({
  UuBrand brand = UuBrand.defaultBrand,
  UuDensity density = UuDensity.touch,
  UuLayout layout = UuLayout.expanded,
  String? fontFamilyBody,
  String? fontFamilyDisplay,
  double borderOuterWidth = 0,
  Color? borderOuter,
  List<BoxShadow> elevationNone = const [],
  Map<String, UuIconSetEntry> icons = const {},
}) {
  final uu = UuTheme.brand(brand, density: density, layout: layout).copyWith(
    fontFamilyBody: fontFamilyBody,
    borderOuterWidth: borderOuterWidth,
    borderOuter: borderOuter,
    elevationNone: elevationNone,
    icons: icons,
  );
  TextStyle disp(TextStyle s) => fontFamilyDisplay == null ? s : s.copyWith(fontFamily: fontFamilyDisplay);
  final c = uu.colors;
  final tx = uu.text;
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.light(
      primary: c.objectInteractive,
      onPrimary: c.objectOnInteractive,
      surface: c.backgroundSurface,
      onSurface: c.objectPrimary,
      error: c.objectNegative,
      onError: c.objectOnNegative,
      outline: c.border,
    ),
    scaffoldBackgroundColor: c.backgroundSurface,
    splashFactory: NoSplash.splashFactory,
    highlightColor: Colors.transparent,
    hoverColor: Colors.transparent,
    textTheme: TextTheme(
      displayLarge: disp(UuTextStyles.displayLg),
      displayMedium: disp(UuTextStyles.displayBase),
      displaySmall: disp(UuTextStyles.displaySm),
      headlineLarge: tx.headingLg,
      headlineMedium: tx.headingBase,
      headlineSmall: tx.headingSm,
      titleMedium: tx.titleBase,
      titleSmall: tx.titleSm,
      bodyMedium: tx.body,
      labelLarge: tx.label,
      bodySmall: tx.caption,
    ).apply(bodyColor: c.objectPrimary, displayColor: c.objectPrimary),
    extensions: [uu],
  );
}

/// Đặt [UuLayout] cho một vùng (tương đương `data-layout="collapsed"` trên khung chứa bên web).
/// Brand và density của vùng giữ nguyên theo theme cha.
class UuLayoutScope extends StatelessWidget {
  const UuLayoutScope({super.key, required this.layout, required this.child});
  final UuLayout layout;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final uu = UuTheme.of(context).copyWith(layout: layout);
    final others = t.extensions.values.where((e) => e is! UuTheme);
    return Theme(data: t.copyWith(extensions: [...others, uu]), child: child);
  }
}


/// [BoxDecoration] kèm bóng chỉ vẽ ngoài hình hộp (CSS `box-shadow` outset). Spread nới rộng cả bán kính bo góc,
/// đúng như CSS. Dùng qua [UuTheme.outerDecoration].
class UuOuterDecoration extends Decoration {
  const UuOuterDecoration(this.box, this.shadows);
  final BoxDecoration box;
  final List<BoxShadow> shadows;

  @override
  EdgeInsetsGeometry get padding => box.padding;

  @override
  bool get isComplex => true;

  @override
  bool hitTest(Size size, Offset position, {TextDirection? textDirection}) => box.hitTest(size, position, textDirection: textDirection);

  @override
  Path getClipPath(Rect rect, TextDirection textDirection) => box.getClipPath(rect, textDirection);

  @override
  Decoration? lerpFrom(Decoration? a, double t) => a is UuOuterDecoration
      ? UuOuterDecoration(BoxDecoration.lerp(a.box, box, t)!, BoxShadow.lerpList(a.shadows, shadows, t)!)
      : a is BoxDecoration
          ? UuOuterDecoration(BoxDecoration.lerp(a, box, t)!, BoxShadow.lerpList(const [], shadows, t)!)
          : null;

  @override
  Decoration? lerpTo(Decoration? b, double t) => b is UuOuterDecoration
      ? UuOuterDecoration(BoxDecoration.lerp(box, b.box, t)!, BoxShadow.lerpList(shadows, b.shadows, t)!)
      : b is BoxDecoration
          ? UuOuterDecoration(BoxDecoration.lerp(box, b, t)!, BoxShadow.lerpList(shadows, const [], t)!)
          : null;

  @override
  bool operator ==(Object other) => other is UuOuterDecoration && other.box == box && listEquals(other.shadows, shadows);

  @override
  int get hashCode => Object.hash(box, Object.hashAll(shadows));

  /// Hình của hộp nằm trong [rect], nới thêm [spread] (bán kính bo góc nới theo).
  Path _shape(Rect rect, double spread, TextDirection td) {
    if (box.shape == BoxShape.circle) {
      return Path()..addOval(Rect.fromCircle(center: rect.center, radius: rect.shortestSide / 2 + spread));
    }
    final r = box.borderRadius?.resolve(td);
    if (r == null) return Path()..addRect(rect.inflate(spread));
    return Path()..addRRect(r.toRRect(rect).inflate(spread));
  }

  @override
  BoxPainter createBoxPainter([VoidCallback? onChanged]) => _UuOuterPainter(this, box.createBoxPainter(onChanged), onChanged);
}

class _UuOuterPainter extends BoxPainter {
  _UuOuterPainter(this.d, this.inner, super.onChanged);
  final UuOuterDecoration d;
  final BoxPainter inner;

  @override
  void paint(Canvas canvas, Offset offset, ImageConfiguration configuration) {
    final rect = offset & configuration.size!;
    final td = configuration.textDirection ?? TextDirection.ltr;
    final hole = d._shape(rect, 0, td);
    var reach = 0.0;
    for (final s in d.shadows) {
      reach = math.max(reach, s.spreadRadius + s.blurRadius * 2 + s.offset.distance);
    }
    canvas.save();
    // evenOdd thay vì Path.combine: CanvasKit trên web không khoét lỗ được bằng PathOperation.difference.
    canvas.clipPath(Path()
      ..fillType = PathFillType.evenOdd
      ..addRect(rect.inflate(reach + 1))
      ..addPath(hole, Offset.zero));
    for (final s in d.shadows) {
      canvas.drawPath(d._shape(rect.shift(s.offset), s.spreadRadius, td), s.toPaint());
    }
    canvas.restore();
    inner.paint(canvas, offset, configuration);
  }

  @override
  void dispose() {
    inner.dispose();
    super.dispose();
  }
}


/// `pageBuilder` cho route nổi của UU DS (sheet, dialog, side sheet, popover) mở bằng `showGeneralDialog`.
/// Route nằm ở navigator gốc nên không thấy theme bọc quanh nơi gọi: chép theme của [from] sang route
/// (`InheritedTheme.capture`) để density / brand / DNA đúng như màn gọi. Thêm `Material` trong suốt để chữ có
/// `DefaultTextStyle` (không có thì Flutter gạch chân vàng).
RoutePageBuilder uuRoutePage(BuildContext from, WidgetBuilder builder) {
  final themes = InheritedTheme.capture(from: from, to: Navigator.of(from, rootNavigator: true).context);
  return (_, __, ___) => themes.wrap(Material(type: MaterialType.transparency, child: Builder(builder: builder)));
}
