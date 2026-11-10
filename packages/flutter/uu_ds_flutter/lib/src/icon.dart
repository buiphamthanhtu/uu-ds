import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'theme.dart';

enum UuIconVariant { outline, fill }

/// UU icon của UU DS (docs/icons.md). `name` là tên trong thư viện (`chevron-left`, `xmark`…),
/// tra ở src/icons/manifest.json. `fill` = trạng thái bật. Hộp 16 · 18 · 20 · 24 — nét thật ≈ 60–65% hộp
/// vì UU icon vẽ trên lưới 18 có lề: đúng thiết kế, đừng phóng.
/// Bộ mặc định = UU icon công khai. Bộ riêng của sản phẩm (spec 4.3): `uuThemeData(icons: {...})` —
/// tên đăng ký ghi đè icon mặc định cùng tên, tên khác vẫn lấy bộ mặc định.
/// Màu lấy từ [color], không có thì từ IconTheme rồi DefaultTextStyle (tương đương currentColor).
class UuIcon extends StatelessWidget {
  const UuIcon(this.name, {super.key, this.variant = UuIconVariant.outline, this.size = 24, this.color, this.semanticLabel});

  final String name;
  final UuIconVariant variant;
  final double size;
  final Color? color;
  /// Có nhãn thì icon mang nghĩa; không có thì là trang trí (ẩn khỏi screen reader).
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = color ?? IconTheme.of(context).color ?? DefaultTextStyle.of(context).style.color ?? const Color(0xFF000000);
    final custom = UuTheme.of(context).icons[name];
    if (custom != null) {
      return SizedBox(
        width: size,
        height: size,
        child: SvgPicture.string(
          variant == UuIconVariant.fill ? (custom.fill ?? custom.outline) : custom.outline,
          colorFilter: ColorFilter.mode(c, BlendMode.srcIn),
          semanticsLabel: semanticLabel,
          excludeFromSemantics: semanticLabel == null,
        ),
      );
    }
    final file = variant == UuIconVariant.fill ? '$name-fill' : name;
    return SizedBox(
      width: size,
      height: size,
      child: SvgPicture.asset(
        'assets/icons/$file.svg',
        package: 'uu_ds_flutter',
        colorFilter: ColorFilter.mode(c, BlendMode.srcIn),
        semanticsLabel: semanticLabel,
        excludeFromSemantics: semanticLabel == null,
        placeholderBuilder: (_) => const SizedBox.shrink(),
      ),
    );
  }
}
