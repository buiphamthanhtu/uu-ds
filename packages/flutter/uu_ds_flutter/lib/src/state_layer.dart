import 'package:flutter/material.dart';
import 'tokens.g.dart';

/// Nền bên dưới state layer quyết định bậc opacity (docs/design-system.md §6.0):
/// content sáng trên nền tối → 20/40 · content tối trên nền sáng → 5/10.
enum UuSurface { onDark, onLight }

extension UuSurfaceOpacity on UuSurface {
  double get hover => this == UuSurface.onDark ? UuOpacity.o20 : UuOpacity.o5;
  double get pressed => this == UuSurface.onDark ? UuOpacity.o40 : UuOpacity.o10;
}

/// Trạng thái ép để chụp Widgetbook/đối chiếu bản thiết kế. Sản phẩm thật để null.
/// `focus` chỉ dùng cho Switch (§6.17) — component duy nhất có variant Focus trong bản thiết kế.
enum UuForcedState { hover, focus, pressed }

/// Vùng bấm của UU DS: phủ một lớp [overlayColor] (mặc định = màu content) với opacity theo
/// [surface] khi hover / pressed. KHÔNG đổi nền, chữ, hay font-weight. Disabled và loading không có lớp.
class UuPressable extends StatefulWidget {
  const UuPressable({
    super.key,
    required this.child,
    required this.surface,
    this.onTap,
    this.enabled = true,
    this.overlayColor,
    this.borderRadius,
    this.forced,
    this.semanticLabel,
    this.semanticsRole = UuSemanticsRole.button,
    this.selected,
  });

  final Widget child;
  final UuSurface surface;
  final VoidCallback? onTap;
  final bool enabled;
  /// Màu lớp phủ. Bỏ trống → lấy màu chữ hiện tại (currentColor).
  final Color? overlayColor;
  final BorderRadius? borderRadius;
  final UuForcedState? forced;
  final String? semanticLabel;
  final UuSemanticsRole semanticsRole;
  final bool? selected;

  @override
  State<UuPressable> createState() => _UuPressableState();
}

/// Vai trò semantics của vùng bấm.
/// [toggle] = công tắc (Switch): đọc là bật / tắt.
enum UuSemanticsRole { button, checkbox, radio, tab, toggle }

class _UuPressableState extends State<UuPressable> {
  bool _hover = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final active = widget.enabled && widget.onTap != null;
    final color = widget.overlayColor ?? DefaultTextStyle.of(context).style.color ?? IconTheme.of(context).color ?? const Color(0xFF000000);
    final forced = widget.forced;
    final showPressed = active && (forced == UuForcedState.pressed || (forced == null && _pressed));
    final showHover = active && (forced == UuForcedState.hover || (forced == null && _hover && !_pressed));
    final opacity = showPressed ? widget.surface.pressed : showHover ? widget.surface.hover : 0.0;

    // passthrough: con nhận đúng ràng buộc của cha. Mặc định (loose) làm nút trong Expanded / Column stretch
    // co theo chữ thay vì kéo hết bề ngang (§6.9 ButtonGroup).
    Widget body = Stack(
      fit: StackFit.passthrough,
      children: [
        widget.child,
        Positioned.fill(
          child: IgnorePointer(
            child: AnimatedOpacity(
              duration: const Duration(milliseconds: 120),
              opacity: opacity,
              child: DecoratedBox(
                decoration: BoxDecoration(color: color, borderRadius: widget.borderRadius),
              ),
            ),
          ),
        ),
      ],
    );

    body = Semantics(
      button: widget.semanticsRole == UuSemanticsRole.button,
      checked: widget.semanticsRole == UuSemanticsRole.checkbox || widget.semanticsRole == UuSemanticsRole.radio ? widget.selected : null,
      selected: widget.semanticsRole == UuSemanticsRole.tab ? widget.selected : null,
      toggled: widget.semanticsRole == UuSemanticsRole.toggle ? widget.selected : null,
      enabled: active,
      label: widget.semanticLabel,
      child: body,
    );

    return FocusableActionDetector(
      enabled: active,
      mouseCursor: active ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onShowHoverHighlight: (v) => setState(() => _hover = v),
      actions: {ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) { widget.onTap?.call(); return null; })},
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: active ? (_) => setState(() => _pressed = true) : null,
        onTapUp: active ? (_) => setState(() => _pressed = false) : null,
        onTapCancel: active ? () => setState(() => _pressed = false) : null,
        onTap: active ? widget.onTap : null,
        child: body,
      ),
    );
  }
}
