import 'package:flutter/material.dart';
import 'icon.dart';
import 'state_layer.dart';
import 'theme.dart';
import 'tokens.g.dart';

/// Bản thiết kế: hai bộ `TextButtonAccent` / `TextButtonNeutral` (và Icon button tương ứng).
enum UuButtonTone { accent, neutral }
/// `tonal` chỉ có ở tone neutral, không có `inverted` (§6.1).
enum UuButtonType { solid, outline, ghost, tonal }
enum UuButtonSize { large, base, small }
/// `hover` / `pressed` chỉ để ép trạng thái trong Widgetbook — sản phẩm thật dùng default.
enum UuButtonState { normal, hover, pressed, disabled, loading }

/// Kích thước nút theo density (§4.1): Touch 56 / 48 / 32 · Compact 40 / 32 / 24. Đọc từ UuTheme.of(context).sizes.
extension UuButtonSizeSpec on UuButtonSize {
  double heightIn(UuSizes z) => switch (this) { UuButtonSize.large => z.controlHeightLarge, UuButtonSize.base => z.controlHeightBase, UuButtonSize.small => z.controlHeightSmall };
  double iconIn(UuSizes z) => switch (this) { UuButtonSize.large => z.controlIconLarge, UuButtonSize.base => z.controlIconBase, UuButtonSize.small => z.controlIconSmall };
  EdgeInsets paddingIn(UuSizes z) => switch (this) {
        UuButtonSize.large => EdgeInsets.symmetric(vertical: z.controlPaddingYLarge, horizontal: z.controlPaddingXLarge),
        UuButtonSize.base => EdgeInsets.symmetric(vertical: z.controlPaddingYBase, horizontal: z.controlPaddingXBase),
        UuButtonSize.small => EdgeInsets.symmetric(vertical: z.controlPaddingYSmall, horizontal: z.controlPaddingXSmall),
      };
}

/// Bảng màu §6.1 / §6.2 và nền của state layer §6.0.
class UuButtonStyleSpec {
  const UuButtonStyleSpec({required this.background, required this.border, required this.content, required this.surface});
  final Color? background;
  final Color? border;
  final Color content;
  final UuSurface surface;

  static UuButtonStyleSpec resolve(UuSemanticColors c, UuButtonTone tone, UuButtonType type, bool inverted, bool disabled) {
    final accent = tone == UuButtonTone.accent;
    final surface = (type == UuButtonType.solid ? !inverted : inverted) ? UuSurface.onDark : UuSurface.onLight;
    if (disabled) {
      return UuButtonStyleSpec(
        background: type == UuButtonType.solid || type == UuButtonType.tonal ? c.backgroundDisabled : null,
        border: type == UuButtonType.outline ? (inverted ? c.borderMutedInverted : c.borderMuted) : null,
        content: c.objectDisabled,
        surface: surface,
      );
    }
    switch (type) {
      case UuButtonType.solid:
        if (inverted) return UuButtonStyleSpec(background: c.backgroundSurface, border: null, content: accent ? c.objectInteractive : c.objectPrimary, surface: surface);
        return UuButtonStyleSpec(
          background: accent ? c.backgroundInteractive : c.backgroundInverted, border: null,
          content: accent ? c.objectOnInteractive : c.objectPrimaryInverted, surface: surface);
      case UuButtonType.outline:
        return UuButtonStyleSpec(
          background: null,
          border: accent ? (inverted ? c.borderInteractiveInverted : c.borderInteractive) : (inverted ? c.borderInverted : c.border),
          content: accent ? (inverted ? c.objectInteractiveInverted : c.objectInteractive) : (inverted ? c.objectPrimaryInverted : c.objectPrimary),
          surface: surface);
      case UuButtonType.tonal:
        assert(tone == UuButtonTone.neutral && !inverted, 'Tonal chỉ có ở Neutral, không Inverted (§6.1).');
        return UuButtonStyleSpec(background: c.backgroundSubtle, border: null, content: c.objectPrimary, surface: surface);
      case UuButtonType.ghost:
        return UuButtonStyleSpec(
          background: null, border: null,
          content: accent ? (inverted ? c.objectInteractiveInverted : c.objectInteractive) : (inverted ? c.objectPrimaryInverted : c.objectPrimary),
          surface: surface);
    }
  }

  /// Bảng màu `TextButtonDanger` (§6.1): như Accent Inverted=False, họ negative. Disabled như Accent.
  static UuButtonStyleSpec resolveDanger(UuSemanticColors c, UuButtonType type, bool disabled) {
    if (disabled) return resolve(c, UuButtonTone.accent, type, false, true);
    return switch (type) {
      UuButtonType.solid => UuButtonStyleSpec(background: c.backgroundNegative, border: null, content: c.objectOnNegative, surface: UuSurface.onDark),
      UuButtonType.outline => UuButtonStyleSpec(background: null, border: c.borderNegative, content: c.objectNegative, surface: UuSurface.onLight),
      UuButtonType.ghost || UuButtonType.tonal => UuButtonStyleSpec(background: null, border: null, content: c.objectNegative, surface: UuSurface.onLight),
    };
  }
}

/// TextButton (§6.1). Hug width — min-width = height nên nút chữ ngắn không hẹp hơn hình tròn.
class UuTextButton extends StatelessWidget {
  const UuTextButton({
    super.key,
    required this.label,
    this.onPressed,
    this.tone = UuButtonTone.accent,
    this.type = UuButtonType.solid,
    this.inverted = false,
    this.size = UuButtonSize.base,
    this.state = UuButtonState.normal,
    this.prefixIcon,
    this.suffixIcon,
  });

  final String label;
  final VoidCallback? onPressed;
  final UuButtonTone tone;
  final UuButtonType type;
  final bool inverted;
  final UuButtonSize size;
  final UuButtonState state;
  /// Thiết kế: `Prefix` — icon bên trái chữ, cùng cỡ suffix. Loading thì spinner thay chỗ icon này.
  final String? prefixIcon;
  /// Thiết kế: `Suffix` — UU icon bên phải (24 cho Large/Base, 16 cho Small).
  final String? suffixIcon;

  @override
  Widget build(BuildContext context) {
    final s = UuButtonStyleSpec.resolve(UuTheme.of(context).colors, tone, type, inverted, state == UuButtonState.disabled);
    return _UuTextButtonBody(label: label, onPressed: onPressed, spec: s, size: size, state: state, prefixIcon: prefixIcon, suffixIcon: suffixIcon);
  }
}

/// TextButtonDanger (§6.1): hành động phá huỷ, không hoàn tác được. Hình học, density, state layer,
/// Loading, Disabled y hệt [UuTextButton] Accent; chỉ đổi họ màu interactive → negative.
/// Không có Inverted (chưa chốt nút phá huỷ trên nền tối).
class UuTextButtonDanger extends StatelessWidget {
  const UuTextButtonDanger({
    super.key,
    required this.label,
    this.onPressed,
    this.type = UuButtonType.solid,
    this.size = UuButtonSize.base,
    this.state = UuButtonState.normal,
    this.prefixIcon,
    this.suffixIcon,
  });

  final String label;
  final VoidCallback? onPressed;
  final UuButtonType type;
  final UuButtonSize size;
  final UuButtonState state;
  final String? prefixIcon;
  final String? suffixIcon;

  @override
  Widget build(BuildContext context) {
    final s = UuButtonStyleSpec.resolveDanger(UuTheme.of(context).colors, type, state == UuButtonState.disabled);
    return _UuTextButtonBody(label: label, onPressed: onPressed, spec: s, size: size, state: state, prefixIcon: prefixIcon, suffixIcon: suffixIcon);
  }
}

class _UuTextButtonBody extends StatelessWidget {
  const _UuTextButtonBody({required this.label, required this.onPressed, required this.spec, required this.size, required this.state, required this.prefixIcon, required this.suffixIcon});
  final String label;
  final VoidCallback? onPressed;
  final UuButtonStyleSpec spec;
  final UuButtonSize size;
  final UuButtonState state;
  final String? prefixIcon;
  final String? suffixIcon;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final z = th.sizes;
    final s = spec;
    final disabled = state == UuButtonState.disabled;
    final loading = state == UuButtonState.loading;
    final radius = BorderRadius.circular(UuRadius.xl4);
    return UuPressable(
      surface: s.surface,
      overlayColor: s.content,
      borderRadius: radius,
      enabled: !disabled && !loading, // loading chỉ khoá chạm, KHÔNG giảm độ đục
      onTap: onPressed,
      forced: switch (state) { UuButtonState.hover => UuForcedState.hover, UuButtonState.pressed => UuForcedState.pressed, _ => null },
      semanticLabel: label,
      child: Container(
        constraints: BoxConstraints(minHeight: size.heightIn(z), minWidth: size.heightIn(z)),
        padding: size.paddingIn(z),
        decoration: th.outerDecoration(BoxDecoration(color: s.background, borderRadius: radius)),
        // Viền Outline vẽ bằng foregroundDecoration: Bản thiết kế strokeAlign=INSIDE nên viền KHÔNG
        // được cộng vào chiều cao. Border trong `decoration` thì Container cộng 2px mỗi bên,
        // nút Small cao 36 thay vì 32 (§6.1).
        foregroundDecoration: s.border == null ? null : BoxDecoration(borderRadius: radius, border: Border.all(color: disabled ? s.border! : th.restBorder(s.border!), width: 2)),
        child: DefaultTextStyle(
          style: th.text.label.copyWith(color: s.content),
          child: IconTheme(
            data: IconThemeData(color: s.content, size: size.iconIn(z)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (loading)
                  ...[UuSpinner(color: s.content), const SizedBox(width: UuGap.g2)]
                else if (prefixIcon != null)
                  ...[UuIcon(prefixIcon!, size: size.iconIn(z), color: s.content), const SizedBox(width: UuGap.g2)],
                Text(label, maxLines: 1, softWrap: false),
                if (suffixIcon != null) ...[const SizedBox(width: UuGap.g2), UuIcon(suffixIcon!, size: size.iconIn(z), color: s.content)],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// IconButton (§6.2): hộp vuông 56/48/32, icon 24/24/16, cùng bảng màu với TextButton.
class UuIconButton extends StatelessWidget {
  const UuIconButton({
    super.key,
    required this.icon,
    required this.label,
    this.onPressed,
    this.tone = UuButtonTone.accent,
    this.type = UuButtonType.solid,
    this.inverted = false,
    this.size = UuButtonSize.base,
    this.state = UuButtonState.normal,
    this.iconVariant = UuIconVariant.outline,
  });

  final String icon;
  /// Bắt buộc — nút không có chữ nên screen reader cần tên.
  final String label;
  final VoidCallback? onPressed;
  final UuButtonTone tone;
  final UuButtonType type;
  final bool inverted;
  final UuButtonSize size;
  final UuButtonState state;
  final UuIconVariant iconVariant;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final disabled = state == UuButtonState.disabled;
    final loading = state == UuButtonState.loading;
    final s = UuButtonStyleSpec.resolve(c, tone, type, inverted, disabled);
    final radius = BorderRadius.circular(UuRadius.xl4);
    return UuPressable(
      surface: s.surface,
      overlayColor: s.content,
      borderRadius: radius,
      enabled: !disabled && !loading,
      onTap: onPressed,
      forced: switch (state) { UuButtonState.hover => UuForcedState.hover, UuButtonState.pressed => UuForcedState.pressed, _ => null },
      semanticLabel: label,
      child: Container(
        width: size.heightIn(z),
        height: size.heightIn(z),
        alignment: Alignment.center,
        decoration: UuTheme.of(context).outerDecoration(BoxDecoration(color: s.background, borderRadius: radius)),
        // Viền Outline vẽ bằng foregroundDecoration: Bản thiết kế strokeAlign=INSIDE nên viền KHÔNG
        // được cộng vào chiều cao. Border trong `decoration` thì Container cộng 2px mỗi bên,
        // nút Small cao 36 thay vì 32 (§6.1).
        foregroundDecoration: s.border == null ? null : BoxDecoration(borderRadius: radius, border: Border.all(color: disabled ? s.border! : th.restBorder(s.border!), width: 2)),
        child: loading ? UuSpinner(color: s.content) : UuIcon(icon, variant: iconVariant, size: size.iconIn(z), color: s.content),
      ),
    );
  }
}

/// ToggleButton (§6.7): nút giữ trạng thái bật/tắt. Không border, không shadow.
/// Bật: nền interactive, chữ on-interactive, icon đổi sang fill, chữ đậm thêm một bậc (mode Active).
class UuToggleButton extends StatelessWidget {
  const UuToggleButton({
    super.key,
    required this.active,
    required this.icon,
    this.onToggle,
    this.label,
    this.activeLabel,
    this.size = UuButtonSize.base,
    this.disabled = false,
    this.forced,
  });

  final bool active;
  final String icon;
  final ValueChanged<bool>? onToggle;
  /// Thiết kế: `↳ Label` (khi tắt). Bỏ trống = icon-only.
  final String? label;
  /// Thiết kế: `↳ Active label` (khi bật). Mặc định = label.
  final String? activeLabel;
  final UuButtonSize size;
  final bool disabled;
  final UuForcedState? forced;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final text = active ? (activeLabel ?? label) : label;
    final bg = disabled ? (active ? c.backgroundDisabled : c.backgroundSurface) : (active ? c.backgroundInteractive : c.backgroundSurface);
    final fg = disabled ? c.objectDisabled : (active ? c.objectOnInteractive : c.objectPrimary);
    final radius = BorderRadius.circular(UuRadius.xl4);
    final iconOnly = text == null;
    return UuPressable(
      surface: active ? UuSurface.onDark : UuSurface.onLight,
      overlayColor: fg,
      borderRadius: radius,
      enabled: !disabled,
      onTap: onToggle == null ? null : () => onToggle!(!active),
      forced: forced,
      semanticsRole: UuSemanticsRole.checkbox,
      selected: active,
      semanticLabel: text ?? icon,
      child: Container(
        width: iconOnly ? size.heightIn(z) : null,
        constraints: BoxConstraints(minHeight: size.heightIn(z), minWidth: size.heightIn(z)),
        padding: iconOnly ? EdgeInsets.zero : size.paddingIn(z),
        alignment: Alignment.center,
        decoration: UuTheme.of(context).outerDecoration(BoxDecoration(color: bg, borderRadius: radius)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            UuIcon(icon, variant: active ? UuIconVariant.fill : UuIconVariant.outline, size: size.iconIn(z), color: fg),
            if (text != null) ...[
              const SizedBox(width: UuGap.g2),
              Text(text, maxLines: 1, softWrap: false,
                  style: (active ? th.text.labelActive : th.text.label).copyWith(color: fg)),
            ],
          ],
        ),
      ),
    );
  }
}

/// `.loading` (§6.12): vòng 18×18 gradient quét, quay 360°, màu kế thừa từ text color.
class UuSpinner extends StatefulWidget {
  const UuSpinner({super.key, this.color, this.size = 18});
  final Color? color;
  final double size;

  @override
  State<UuSpinner> createState() => _UuSpinnerState();
}

class _UuSpinnerState extends State<UuSpinner> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..repeat();

  @override
  void dispose() { _c.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? DefaultTextStyle.of(context).style.color ?? const Color(0xFF000000);
    return Semantics(
      label: 'Đang xử lý',
      child: RotationTransition(
        turns: _c,
        child: CustomPaint(size: Size.square(widget.size), painter: _SpinnerPainter(color)),
      ),
    );
  }
}

class _SpinnerPainter extends CustomPainter {
  _SpinnerPainter(this.color);
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round
      ..shader = SweepGradient(colors: [color.withValues(alpha: 0), color], stops: const [0.15, 1]).createShader(rect);
    canvas.drawArc(rect.deflate(1), 0.3, 5.7, false, paint);
  }
  @override
  bool shouldRepaint(_SpinnerPainter old) => old.color != color;
}
