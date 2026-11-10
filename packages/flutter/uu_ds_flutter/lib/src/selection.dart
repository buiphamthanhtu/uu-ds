import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'buttons.dart';
import 'fields.dart';
import 'icon.dart';
import 'state_layer.dart';
import 'theme.dart';
import 'tokens.g.dart';

/// Checkbox (§6.3f): ô tick 32×32 radius 12. 12 variant: Value (Unchecked/Checked/Indeterminate)
/// × State Default/Hover/Pressed × Disabled. Checked = nền interactive + icon `check` fill 20;
/// Indeterminate = vạch 16×2 bo tròn. Ô trống đi lớp 5/10, ô đã chọn đi lớp 20/40 (object-on-interactive).
class UuCheckbox extends StatefulWidget {
  const UuCheckbox({super.key, required this.checked, this.onChanged, this.disabled = false, this.error = false, this.forced, this.semanticLabel});
  /// `null` = Indeterminate (ô "chọn tất cả" khi danh sách mới tick một phần).
  final bool? checked;
  final ValueChanged<bool>? onChanged;
  final bool disabled;
  /// `State=Error`: ô bắt buộc chưa tick. Viền / nền đổi sang đỏ.
  final bool error;
  final UuForcedState? forced;
  final String? semanticLabel;

  @override
  State<UuCheckbox> createState() => _UuCheckboxState();
}

class _UuCheckboxState extends State<UuCheckbox> {
  bool _hover = false, _pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final active = !widget.disabled && widget.onChanged != null;
    final pressed = active && (widget.forced == UuForcedState.pressed || (widget.forced == null && _pressed));
    final hover = active && !pressed && (widget.forced == UuForcedState.hover || (widget.forced == null && _hover));
    final checked = widget.checked;
    final filled = checked != false; // Checked hoặc Indeterminate: nền đặc
    final err = widget.error && !widget.disabled;
    final bg = widget.disabled ? c.backgroundDisabled : filled ? (err ? c.backgroundNegative : c.backgroundInteractive) : c.backgroundSurface;
    final showBorder = widget.disabled || !filled;
    final borderColor = widget.disabled ? c.borderMuted : err ? c.borderNegative : (hover || pressed) ? c.borderEmphasized : UuTheme.of(context).restBorder(c.borderMuted);
    final content = widget.disabled ? c.objectDisabled : err && filled ? c.objectOnNegative : c.objectOnInteractive;
    // Ô trống → bậc nền sáng 5/10; ô đã chọn → bậc nền đặc 20/40, fill là màu content.
    final Color? layer = filled
        ? (pressed ? content.withValues(alpha: UuOpacity.o40) : hover ? content.withValues(alpha: UuOpacity.o20) : null)
        : (pressed ? c.objectPrimary.withValues(alpha: UuOpacity.o10) : hover ? c.objectSecondary.withValues(alpha: UuOpacity.o5) : null);
    return Semantics(
      checked: checked ?? false,
      mixed: checked == null,
      enabled: active,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        enabled: active,
        mouseCursor: active ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (v) => setState(() => _hover = v),
        actions: {ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) { widget.onChanged?.call(checked != true); return null; })},
        child: GestureDetector(
          onTapDown: active ? (_) => setState(() => _pressed = true) : null,
          onTapUp: active ? (_) => setState(() => _pressed = false) : null,
          onTapCancel: active ? () => setState(() => _pressed = false) : null,
          onTap: active ? () => widget.onChanged!(checked != true) : null,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: UuTheme.of(context).sizes.selectionSize, height: UuTheme.of(context).sizes.selectionSize, alignment: Alignment.center,
                decoration: UuTheme.of(context).outerDecoration(BoxDecoration(color: bg, borderRadius: BorderRadius.circular(UuTheme.of(context).sizes.selectionRadius), border: showBorder ? Border.all(color: borderColor, width: 2) : null)),
                child: checked == null
                    ? Container(width: UuSize.s4, height: UuSize.s0_5, decoration: BoxDecoration(color: content, borderRadius: BorderRadius.circular(UuSize.s0_5 / 2)))
                    : checked
                        ? UuIcon('check', variant: UuIconVariant.fill, size: UuTheme.of(context).sizes.selectionCheck, color: content)
                        : null,
              ),
              if (layer != null)
                Positioned.fill(child: IgnorePointer(child: DecoratedBox(decoration: BoxDecoration(color: layer, borderRadius: BorderRadius.circular(UuTheme.of(context).sizes.selectionRadius))))),
            ],
          ),
        ),
      ),
    );
  }
}

/// Radio (§6.3d): vòng 32 viền 2px, chọn = viền border-interactive + chấm 20 object-interactive, nền vẫn trắng. 8 variant.
class UuRadio extends StatefulWidget {
  const UuRadio({super.key, required this.checked, this.onSelected, this.disabled = false, this.error = false, this.forced, this.semanticLabel});
  final bool checked;
  final VoidCallback? onSelected;
  final bool disabled;
  /// `State=Error`: nhóm bắt buộc chưa chọn. Viền `border-negative`, chấm `object-negative`.
  final bool error;
  final UuForcedState? forced;
  final String? semanticLabel;

  @override
  State<UuRadio> createState() => _UuRadioState();
}

class _UuRadioState extends State<UuRadio> {
  bool _hover = false, _pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final active = !widget.disabled && widget.onSelected != null;
    final pressed = active && (widget.forced == UuForcedState.pressed || (widget.forced == null && _pressed));
    final hover = active && !pressed && (widget.forced == UuForcedState.hover || (widget.forced == null && _hover));
    final checked = widget.checked;
    final bg = widget.disabled && !checked ? c.backgroundDisabled : c.backgroundSurface;
    final error = widget.error && !widget.disabled;
    final border = widget.disabled ? c.borderMuted : error ? c.borderNegative : checked ? c.borderInteractive : (hover || pressed) ? c.borderEmphasized : UuTheme.of(context).restBorder(c.border);
    final dot = widget.disabled ? c.objectDisabled : error ? c.objectNegative : c.objectInteractive;
    Color? layer;
    if (checked) {
      // Vòng đã chọn có chấm đặc ở giữa → bậc 20/40, 5% cùng màu gần như không thấy.
      layer = pressed ? dot.withValues(alpha: UuOpacity.o40) : hover ? dot.withValues(alpha: UuOpacity.o20) : null;
    } else {
      layer = pressed ? c.objectPrimary.withValues(alpha: UuOpacity.o10) : hover ? c.objectSecondary.withValues(alpha: UuOpacity.o5) : null;
    }
    return Semantics(
      inMutuallyExclusiveGroup: true,
      checked: checked,
      enabled: active,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        enabled: active,
        mouseCursor: active ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (v) => setState(() => _hover = v),
        actions: {ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) { if (!checked) widget.onSelected?.call(); return null; })},
        child: GestureDetector(
          onTapDown: active ? (_) => setState(() => _pressed = true) : null,
          onTapUp: active ? (_) => setState(() => _pressed = false) : null,
          onTapCancel: active ? () => setState(() => _pressed = false) : null,
          onTap: active && !checked ? widget.onSelected : null,
          child: Container(
            width: UuTheme.of(context).sizes.selectionSize, height: UuTheme.of(context).sizes.selectionSize, alignment: Alignment.center,
            decoration: UuTheme.of(context).outerDecoration(BoxDecoration(color: layer == null ? bg : Color.alphaBlend(layer, bg), shape: BoxShape.circle, border: Border.all(color: border, width: 2))),
            child: checked ? Container(width: UuTheme.of(context).sizes.selectionRadioDot, height: UuTheme.of(context).sizes.selectionRadioDot, decoration: BoxDecoration(color: dot, shape: BoxShape.circle)) : null,
          ),
        ),
      ),
    );
  }
}

/// Switch (§6.17): công tắc bật/tắt CÓ HIỆU LỰC NGAY — khác Checkbox (chọn rồi mới bấm xác nhận).
/// Rãnh 56×32 radius 16 viền 2px. Núm nở từ 16 (tắt, mép trái 8) lên 28 (bật, mép phải 2) kèm
/// icon `check` 16. 10 variant: Selected × State Default/Hover/Focus/Pressed × Disabled.
class UuSwitch extends StatefulWidget {
  const UuSwitch({super.key, required this.checked, this.onChanged, this.disabled = false, this.forced, this.semanticLabel});
  final bool checked;
  final ValueChanged<bool>? onChanged;
  final bool disabled;
  final UuForcedState? forced;
  final String? semanticLabel;

  @override
  State<UuSwitch> createState() => _UuSwitchState();
}

class _UuSwitchState extends State<UuSwitch> {
  bool _hover = false, _pressed = false, _focus = false;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final active = !widget.disabled && widget.onChanged != null;
    final pressed = active && (widget.forced == UuForcedState.pressed || (widget.forced == null && _pressed));
    final focus = active && !pressed && (widget.forced == UuForcedState.focus || (widget.forced == null && _focus && !_hover));
    final hover = active && !pressed && !focus && (widget.forced == UuForcedState.hover || (widget.forced == null && _hover));
    final on = widget.checked;

    final track = widget.disabled ? c.backgroundDisabled : on ? c.backgroundInteractive : c.backgroundSurface;
    final borderColor = widget.disabled ? c.borderMuted : (hover || focus || pressed) ? c.borderEmphasized : UuTheme.of(context).restBorder(c.border);
    // Núm tắt: object-secondary, riêng Pressed đậm thêm một bậc sang object-primary (đúng bản vẽ).
    final knob = widget.disabled
        ? (on ? c.backgroundSurface : c.objectDisabled)
        : on ? c.backgroundSurface : pressed ? c.objectPrimary : c.objectSecondary;
    // Nửa tắt là nền sáng (5/10), nửa bật là nền đặc (20/40); fill là màu content của variant.
    final layerColor = on ? c.backgroundSurface : pressed ? c.objectPrimary : c.objectSecondary;
    final double? alpha = pressed || focus
        ? (on ? UuOpacity.o40 : UuOpacity.o10)
        : hover
            ? (on ? UuOpacity.o20 : UuOpacity.o5)
            : null;

    return Semantics(
      toggled: on,
      enabled: active,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        enabled: active,
        mouseCursor: active ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (v) => setState(() => _hover = v),
        onShowFocusHighlight: (v) => setState(() => _focus = v),
        actions: {ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) { widget.onChanged?.call(!on); return null; })},
        child: GestureDetector(
          onTapDown: active ? (_) => setState(() => _pressed = true) : null,
          onTapUp: active ? (_) => setState(() => _pressed = false) : null,
          onTapCancel: active ? () => setState(() => _pressed = false) : null,
          onTap: active ? () => widget.onChanged!(!on) : null,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            curve: Curves.easeOut,
            width: UuTheme.of(context).sizes.switchWidth, height: UuTheme.of(context).sizes.switchHeight,
            decoration: UuTheme.of(context).outerDecoration(BoxDecoration(
              color: alpha == null ? track : Color.alphaBlend(layerColor.withValues(alpha: alpha), track),
              borderRadius: BorderRadius.circular(UuRadius.circle),
              border: on ? null : Border.all(color: borderColor, width: 2),
            )),
            child: Stack(
              children: [
                AnimatedPositioned(
                  duration: const Duration(milliseconds: 160),
                  curve: Curves.easeOut,
                  top: on ? (UuTheme.of(context).sizes.switchHeight - UuTheme.of(context).sizes.switchHandleOn) / 2 : UuTheme.of(context).sizes.switchPadding,
                  left: on ? UuTheme.of(context).sizes.switchWidth - (UuTheme.of(context).sizes.switchHeight - UuTheme.of(context).sizes.switchHandleOn) / 2 - UuTheme.of(context).sizes.switchHandleOn : UuTheme.of(context).sizes.switchPadding,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 160),
                    curve: Curves.easeOut,
                    width: on ? UuTheme.of(context).sizes.switchHandleOn : UuTheme.of(context).sizes.switchHandleOff,
                    height: on ? UuTheme.of(context).sizes.switchHandleOn : UuTheme.of(context).sizes.switchHandleOff,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(color: knob, shape: BoxShape.circle),
                    child: on
                        ? UuIcon('check', variant: UuIconVariant.fill, size: UuTheme.of(context).sizes.switchHandleIcon, color: widget.disabled ? c.objectDisabled : c.objectInteractive)
                        : null,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Chip (§6.18): nhãn bấm được, giữ trạng thái đã chọn. Cùng thang với TextButton Small —
/// cao 32, padding 4/12, gap 8, radius circle, viền 2px, chữ 16/24. 20 variant (16 + 4 `Type=Input`).
/// `Type=Dropdown` + [open]: panel đang bung (panel là `UuMenu`, §6.21 — mobile `Platform=Sheet`, desktop
/// `Platform=Panel` neo dưới chip cách 4, rộng tối thiểu 240: truyền [menu] để chip tự neo qua [UuMenuAnchor]).
/// Trong lúc mở chip ở `Selected=True` và chevron đổi `chevron-up`. Nhãn: chưa chọn = tên bộ lọc · lọc một = giá trị ·
/// lọc nhiều = "{Tên} · n".
/// [prefixIcon] (`Prefix icon`, mọi Type): icon 16 trước chữ, cùng màu chữ; `Type=Select` đã chọn thì `check` thay chỗ.
/// `Type=Input` ([UuChipType.input]): một giá trị đã nhập / đã áp dụng — màu như chưa chọn, padding phải 4, nút gỡ
/// `xmark` 16 trong ô tròn 24 cuối chip (state layer object-primary 5/10 chỉ phủ ô tròn), thân chip không bấm được.
/// Bấm nút gỡ hoặc Backspace / Delete khi nút có focus → focus sang phần tử kế tiếp (chip sau, hết chip thì ô nhập) rồi
/// gọi [onRemove]. Disabled không gỡ được.
enum UuChipType { select, dropdown, input }

class UuChip extends StatefulWidget {
  const UuChip({
    super.key,
    required this.label,
    this.type = UuChipType.select,
    this.selected = false,
    this.onSelectedChanged,
    this.disabled = false,
    this.open = false,
    this.prefixIcon,
    this.menu,
    this.onClose,
    this.onRemove,
    this.removeLabel,
    this.forced,
  });

  final String label;
  final UuChipType type;
  /// Thiết kế: `Selected` — chỉ Select / Dropdown.
  final bool selected;
  /// Chỉ với [UuChipType.dropdown]: panel `UuMenu` đang mở.
  final bool open;
  final ValueChanged<bool>? onSelectedChanged;
  final bool disabled;
  /// Thiết kế: `Prefix icon` — tên UU icon, vẽ 16.
  final String? prefixIcon;
  /// Chỉ [UuChipType.dropdown]: panel `UuMenu` — chip tự neo dưới mình (rộng tối thiểu 240) khi [open].
  final Widget? menu;
  /// Đóng panel [menu]: bấm ra ngoài, Esc, chọn xong ở `Type=Single`.
  final VoidCallback? onClose;
  /// Chỉ [UuChipType.input]: gỡ chip.
  final VoidCallback? onRemove;
  /// Nhãn đọc màn hình của nút gỡ. Mặc định "Gỡ {label}".
  final String? removeLabel;
  /// Ép state để chụp docs. `Type=Input`: áp lên nút gỡ.
  final UuForcedState? forced;

  @override
  State<UuChip> createState() => _UuChipState();
}

class _UuChipState extends State<UuChip> {
  bool _hover = false, _pressed = false;

  @override
  Widget build(BuildContext context) {
    if (widget.type == UuChipType.input) return _input(context);
    final c = UuTheme.of(context).colors;
    final sizes = UuTheme.of(context).sizes;
    final active = !widget.disabled && widget.onSelectedChanged != null;
    final pressed = active && (widget.forced == UuForcedState.pressed || (widget.forced == null && _pressed));
    final hover = active && !pressed && (widget.forced == UuForcedState.hover || (widget.forced == null && _hover));

    final open = widget.open && widget.type == UuChipType.dropdown && !widget.disabled;
    final on = widget.selected || open;
    // Disabled theo luật button: chip chưa chọn bỏ nền (như Outline), chip đã chọn giữ nền (như Solid).
    final bg = widget.disabled
        ? (on ? c.backgroundDisabled : null)
        : on ? c.backgroundInteractiveMuted : null;
    final border = widget.disabled ? c.borderMuted : on ? c.borderInteractive : UuTheme.of(context).restBorder(c.border);
    // §6.18: đã chọn → chữ, icon, lớp phủ object-interactive (Default 5.62 · UU 4.88 trên interactive-muted).
    final fg = widget.disabled ? c.objectDisabled : on ? c.objectInteractive : c.objectPrimary;
    final layer = pressed
        ? fg.withValues(alpha: UuOpacity.o10)
        : hover
            ? fg.withValues(alpha: UuOpacity.o5)
            : null;
    final base = bg ?? c.backgroundSurface;
    // Một chip chỉ có một icon đầu: Select đã chọn thì check thay chỗ icon trước chữ.
    final String? lead = widget.type == UuChipType.select && on ? 'check' : widget.prefixIcon;

    final chip = Semantics(
      button: true,
      selected: on,
      expanded: widget.type == UuChipType.dropdown ? open : null,
      enabled: active,
      label: widget.label,
      child: FocusableActionDetector(
        enabled: active,
        mouseCursor: active ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (v) => setState(() => _hover = v),
        actions: {ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) { widget.onSelectedChanged?.call(!widget.selected); return null; })},
        child: GestureDetector(
          onTapDown: active ? (_) => setState(() => _pressed = true) : null,
          onTapUp: active ? (_) => setState(() => _pressed = false) : null,
          onTapCancel: active ? () => setState(() => _pressed = false) : null,
          onTap: active ? () => widget.onSelectedChanged!(!widget.selected) : null,
          child: Container(
            constraints: BoxConstraints(minWidth: sizes.controlHeightSmall, minHeight: sizes.controlHeightSmall),
            padding: EdgeInsets.symmetric(vertical: sizes.controlPaddingYSmall, horizontal: sizes.controlPaddingXSmall),
            decoration: UuTheme.of(context).outerDecoration(BoxDecoration(
              color: layer == null ? bg : Color.alphaBlend(layer, base),
              borderRadius: BorderRadius.circular(UuRadius.xl4),
            )),
            // Viền vẽ đè, không cộng vào chiều cao — cùng lý do với nút Outline (§6.1).
            foregroundDecoration: BoxDecoration(borderRadius: BorderRadius.circular(UuRadius.xl4), border: Border.all(color: border, width: sizes.chipBorderWidth)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (lead != null) ...[
                  UuIcon(lead, variant: lead == 'check' ? UuIconVariant.fill : UuIconVariant.outline, size: 16, color: fg),
                  const SizedBox(width: UuGap.g2),
                ],
                Text(widget.label, style: UuTheme.of(context).text.label.copyWith(color: fg)),
                if (widget.type == UuChipType.dropdown) ...[
                  const SizedBox(width: UuGap.g2),
                  UuIcon(open ? 'chevron-up' : 'chevron-down', size: 16, color: fg),
                ],
              ],
            ),
          ),
        ),
      ),
    );
    if (widget.type == UuChipType.dropdown && widget.menu != null) {
      return UuMenuAnchor(open: open, onClose: widget.onClose, width: UuMenuAnchorWidth.min, menu: widget.menu!, child: chip);
    }
    return chip;
  }

  /// `Type=Input`: màu như `Selected=False`, padding phải 4, nút gỡ cuối chip.
  Widget _input(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final sizes = UuTheme.of(context).sizes;
    final disabled = widget.disabled;
    final fg = disabled ? c.objectDisabled : c.objectPrimary;
    final border = disabled ? c.borderMuted : UuTheme.of(context).restBorder(c.border);
    // Ô tròn 24 (`size-6`); Compact (chip 24) co theo chiều cao chip trừ padding dọc.
    final box = (sizes.controlHeightSmall - 2 * sizes.controlPaddingYSmall).clamp(0.0, UuSize.s6);
    void remove() {
      if (disabled || widget.onRemove == null) return;
      FocusScope.of(context).nextFocus();
      widget.onRemove!();
    }

    return Container(
      constraints: BoxConstraints(minWidth: sizes.controlHeightSmall, minHeight: sizes.controlHeightSmall),
      padding: EdgeInsets.fromLTRB(sizes.controlPaddingXSmall, sizes.controlPaddingYSmall, UuGap.g1, sizes.controlPaddingYSmall),
      decoration: UuTheme.of(context).outerDecoration(BoxDecoration(borderRadius: BorderRadius.circular(UuRadius.xl4))),
      foregroundDecoration: BoxDecoration(borderRadius: BorderRadius.circular(UuRadius.xl4), border: Border.all(color: border, width: sizes.chipBorderWidth)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.prefixIcon != null) ...[
            UuIcon(widget.prefixIcon!, size: 16, color: fg),
            const SizedBox(width: UuGap.g2),
          ],
          Text(widget.label, style: UuTheme.of(context).text.label.copyWith(color: fg)),
          const SizedBox(width: UuGap.g2),
          Focus(
            canRequestFocus: false,
            skipTraversal: true,
            onKeyEvent: (node, e) {
              if (e is KeyDownEvent && (e.logicalKey == LogicalKeyboardKey.backspace || e.logicalKey == LogicalKeyboardKey.delete)) {
                remove();
                return KeyEventResult.handled;
              }
              return KeyEventResult.ignored;
            },
            child: UuPressable(
              surface: UuSurface.onLight,
              enabled: !disabled,
              overlayColor: fg,
              borderRadius: BorderRadius.circular(UuRadius.circle),
              forced: widget.forced == UuForcedState.focus ? null : widget.forced,
              semanticLabel: widget.removeLabel ?? 'Gỡ ${widget.label}',
              onTap: disabled || widget.onRemove == null ? null : remove,
              child: SizedBox(width: box, height: box, child: Center(child: UuIcon('xmark', size: 16, color: fg))),
            ),
          ),
        ],
      ),
    );
  }
}

/// Hàng ô + chữ (CheckboxInput / RadioInput): gap 12, canh mép trên, chữ đệm trên 4, vùng chạm cả hàng.
class UuChoiceRow extends StatelessWidget {
  const UuChoiceRow({super.key, required this.control, required this.label, this.onTap, this.disabled = false});
  final Widget control;
  final String label;
  final VoidCallback? onTap;
  final bool disabled;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: disabled ? null : onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          control,
          const SizedBox(width: UuGap.g3),
          Expanded(child: Padding(padding: EdgeInsets.only(top: UuTheme.of(context).sizes.selectionLabelOffset), child: Text(label, style: UuTheme.of(context).text.body.copyWith(color: disabled ? c.objectDisabled : c.objectPrimary)))),
        ],
      ),
    );
  }
}

class UuCheckboxInput extends StatelessWidget {
  const UuCheckboxInput({super.key, required this.checked, required this.label, this.onChanged, this.disabled = false, this.error = false});
  /// `null` = Indeterminate.
  final bool? checked;
  final String label;
  final ValueChanged<bool>? onChanged;
  final bool disabled;
  /// `State=Error` — xem `UuCheckbox.error`.
  final bool error;
  @override
  Widget build(BuildContext context) => UuChoiceRow(
        control: UuCheckbox(checked: checked, onChanged: onChanged, disabled: disabled, error: error, semanticLabel: label),
        label: label, disabled: disabled, onTap: () => onChanged?.call(checked != true));
}

class UuRadioInput extends StatelessWidget {
  const UuRadioInput({super.key, required this.checked, required this.label, this.onSelected, this.disabled = false, this.error = false});
  final bool checked;
  final String label;
  final VoidCallback? onSelected;
  final bool disabled;
  final bool error;
  @override
  Widget build(BuildContext context) => UuChoiceRow(
        control: UuRadio(checked: checked, onSelected: onSelected, disabled: disabled, error: error, semanticLabel: label),
        label: label, disabled: disabled, onTap: checked ? null : onSelected);
}

/// Danh sách radio: hàng cách 8, giữa hai hàng một đường nét đứt 6/6 border-muted (của danh sách, hàng cuối không kẻ).
class UuRadioList<T> extends StatelessWidget {
  const UuRadioList({super.key, required this.options, required this.value, required this.onChanged});
  final List<UuRadioOption<T>> options;
  final T? value;
  final ValueChanged<T> onChanged;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < options.length; i++) ...[
          if (i > 0) ...[
            const SizedBox(height: UuGap.g2),
            CustomPaint(size: const Size(double.infinity, 1), painter: _DashPainter(c.borderMuted)),
            const SizedBox(height: UuGap.g2),
          ],
          UuRadioInput(checked: options[i].value == value, label: options[i].label, disabled: options[i].disabled, onSelected: () => onChanged(options[i].value)),
        ],
      ],
    );
  }
}

class UuRadioOption<T> {
  const UuRadioOption(this.value, this.label, {this.disabled = false});
  final T value;
  final String label;
  final bool disabled;
}

class _DashPainter extends CustomPainter {
  _DashPainter(this.color);
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = color..strokeWidth = 1;
    for (double x = 0; x < size.width; x += 12) {
      canvas.drawLine(Offset(x, 0.5), Offset((x + 6).clamp(0, size.width), 0.5), p);
    }
  }
  @override
  bool shouldRepaint(_DashPainter old) => old.color != color;
}

/// `Type` của `.MenuItem` (§6.21): [single] chọn một (hàng chọn tint `background-accent-subtle` + check 16) ·
/// [multiple] chọn nhiều (Checkbox ở đầu hàng, không tint, menu KHÔNG đóng khi chọn).
enum UuMenuItemType { single, multiple }

/// Một option trong [UuMenu] (§6.21).
class UuMenuOption<T> {
  const UuMenuOption({required this.value, required this.label, this.description, this.icon, this.disabled = false});
  final T value;
  final String label;

  /// Thiết kế: `Description` — dòng thứ hai dưới tên, `caption` `object-secondary`, tối đa 2 dòng.
  final String? description;

  /// Thiết kế: `Prefix` — icon 24 đứng trước chữ, chỉ `Type=Single`. Không có thì KHÔNG chừa ô trống.
  final String? icon;
  final bool disabled;
}

/// Vỏ `Menu` `Platform=Panel` (§6.21): V · gap 4 · padding 12 · radius 24 · nền surface · `elevation-low`.
/// [children] là [UuMenuItem] / [UuMenuSection] / [UuMenuDivider]. [header] (ô tìm nhanh) dính trên, [footer]
/// dính dưới — khi màn giới hạn chiều cao panel, chỉ phần giữa cuộn. [flat] = không bo, không bóng
/// (danh sách phủ dưới ô tìm kiếm ở màn tìm kiếm toàn màn trên mobile).
/// Neo dưới phần tử mở, lật, cao tối đa 320, đóng khi bấm ra ngoài / Esc: bọc trong [UuMenuAnchor].
class UuMenuPanel extends StatelessWidget {
  const UuMenuPanel({super.key, required this.children, this.header, this.footer, this.flat = false});
  final List<Widget> children;
  final Widget? header;
  final Widget? footer;
  final bool flat;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final list = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (var i = 0; i < children.length; i++) ...[
          if (i > 0) const SizedBox(height: UuGap.g1),
          children[i],
        ],
      ],
    );
    return Container(
      padding: const EdgeInsets.all(UuGap.g3),
      decoration: BoxDecoration(
        color: c.backgroundSurface,
        borderRadius: flat ? null : BorderRadius.circular(UuRadius.xl2),
        boxShadow: flat ? null : UuElevation.low,
      ),
      child: LayoutBuilder(
        builder: (context, box) => Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (header != null) ...[header!, const SizedBox(height: UuGap.g1)],
            if (box.hasBoundedHeight) Flexible(child: SingleChildScrollView(child: list)) else list,
            if (footer != null) ...[const SizedBox(height: UuGap.g1), footer!],
          ],
        ),
      ),
    );
  }
}

/// Menu (§6.21) — danh sách option bung ra của `UuDropdown` và `UuChip` `Type=Dropdown`.
/// Đây là `Platform=Panel` ([UuMenuPanel]). `Platform=Sheet` thì bọc [UuMenuList] trong `UuCardSheet` (§6.8)
/// (`showUuBottomSheet(header: 'Menu', …)`, không CTA).
/// - [type] single: chọn xong gọi [onSelect] — màn đóng panel ngay.
/// - [type] multiple: [values] + [onValuesChanged], menu không đóng; bật [footer] "Bỏ chọn" / "Áp dụng".
/// - [search] (`Search=true`, dùng khi > 8 option): `UuSearchInput` không nhãn dính trên, lọc option theo từ khoá;
///   không còn option nào → "Không tìm thấy “{từ khoá}”".
/// - [selectAll] (`Type=Multiple`, từ 4 option): hàng "Chọn tất cả" + `.MenuDivider` ở đầu. Checkbox Checked khi chọn
///   hết, Indeterminate khi một phần; bấm → chọn hết, hoặc bỏ hết khi đã chọn hết. Chỉ tác động option đang hiện
///   (sau tìm nhanh), bỏ qua option Disabled.
/// Trong [UuMenuAnchor]: `Type=Single` chọn xong thì panel tự đóng.
/// Một nhóm option của [UuMenu] / [UuMenuList]: `.MenuSection` ([title], bỏ trống thì không có tiêu đề) + option.
/// Giữa hai nhóm một `.MenuDivider`.
class UuMenuGroup<T> {
  const UuMenuGroup({this.title, required this.options});
  final String? title;
  final List<UuMenuOption<T>> options;
}

List<UuMenuGroup<T>> _menuGroups<T>(List<UuMenuOption<T>> options, List<UuMenuGroup<T>>? groups) =>
    groups ?? (options.isEmpty ? <UuMenuGroup<T>>[] : [UuMenuGroup<T>(options: options)]);

/// Trải các nhóm ra hàng: vạch ngăn trước nhóm thứ 2 trở đi, tiêu đề nếu có, rồi option (cách nhau [spacing]).
List<Widget> _menuGroupRows<T>(List<UuMenuGroup<T>> groups, Widget Function(UuMenuOption<T>) item, {double spacing = 0}) => [
      for (var gi = 0; gi < groups.length; gi++) ...[
        if (gi > 0) const UuMenuDivider(),
        if (groups[gi].title != null) UuMenuSection(title: groups[gi].title!),
        for (var i = 0; i < groups[gi].options.length; i++) ...[
          if (i > 0 && spacing > 0) SizedBox(height: spacing),
          item(groups[gi].options[i]),
        ],
      ],
    ];

class UuMenu<T> extends StatefulWidget {
  const UuMenu({
    super.key,
    this.options = const [],
    this.groups,
    this.onSelect,
    this.value,
    this.type = UuMenuItemType.single,
    this.values,
    this.onValuesChanged,
    this.search = false,
    this.searchPlaceholder = 'Tìm kiếm',
    this.footer = false,
    this.clearLabel = 'Bỏ chọn',
    this.applyLabel = 'Áp dụng',
    this.onClear,
    this.onApply,
    this.selectAll = false,
    this.selectAllLabel = 'Chọn tất cả',
  });

  /// Danh sách phẳng. Cần tiêu đề nhóm thì dùng [groups].
  final List<UuMenuOption<T>> options;
  /// Option chia nhóm (thay cho [options]): mỗi nhóm một `.MenuSection`, giữa các nhóm một `.MenuDivider`.
  final List<UuMenuGroup<T>>? groups;
  /// `Type=Single`: option vừa chọn.
  final ValueChanged<T>? onSelect;
  final T? value;
  final UuMenuItemType type;
  /// `Type=Multiple`: các option đang tick.
  final Set<T>? values;
  final ValueChanged<Set<T>>? onValuesChanged;
  /// Thiết kế: BOOLEAN `Search`.
  final bool search;
  final String searchPlaceholder;
  /// Thiết kế: BOOLEAN `Footer` — dùng với `Type=Multiple`.
  final bool footer;
  final String clearLabel;
  /// Màn có thể ghi "Áp dụng (n)".
  final String applyLabel;
  /// Bỏ trống → `onValuesChanged({})`.
  final VoidCallback? onClear;
  final VoidCallback? onApply;
  /// Hàng "Chọn tất cả" — chỉ `Type=Multiple`.
  final bool selectAll;
  final String selectAllLabel;

  @override
  State<UuMenu<T>> createState() => _UuMenuState<T>();
}

class _UuMenuState<T> extends State<UuMenu<T>> {
  final _query = TextEditingController();

  @override
  void dispose() {
    _query.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final q = _query.text.trim();
    final shownGroups = [
      for (final g in _menuGroups(widget.options, widget.groups))
        UuMenuGroup<T>(title: g.title, options: q.isEmpty ? g.options : g.options.where((o) => o.label.toLowerCase().contains(q.toLowerCase())).toList()),
    ].where((g) => g.options.isNotEmpty).toList();
    final shown = [for (final g in shownGroups) ...g.options];
    final multiple = widget.type == UuMenuItemType.multiple;
    UuMenuAnchor.markMultiple(context, multiple);
    // Chọn tất cả: chỉ option đang hiện, bỏ qua option Disabled.
    final values = widget.values ?? <T>{};
    final targets = [for (final o in shown) if (!o.disabled) o.value];
    final onCount = targets.where(values.contains).length;
    final allOn = targets.isNotEmpty && onCount == targets.length;
    return UuMenuPanel(
      header: widget.search
          ? UuSearchInput(controller: _query, placeholder: widget.searchPlaceholder, onChanged: (_) => setState(() {}))
          : null,
      footer: widget.footer
          ? Row(mainAxisAlignment: MainAxisAlignment.end, children: [
              UuTextButton(
                label: widget.clearLabel,
                tone: UuButtonTone.neutral,
                type: UuButtonType.ghost,
                size: UuButtonSize.small,
                onPressed: widget.onClear ?? () => widget.onValuesChanged?.call(<T>{}),
              ),
              const SizedBox(width: UuGap.g2),
              UuTextButton(label: widget.applyLabel, size: UuButtonSize.small, onPressed: widget.onApply),
            ])
          : null,
      children: shown.isEmpty && q.isNotEmpty
          ? [
              Padding(
                padding: const EdgeInsets.all(UuGap.g2),
                child: Text('Không tìm thấy “$q”', style: th.text.body.copyWith(color: th.colors.objectSecondary)),
              ),
            ]
          : [
              if (multiple && widget.selectAll && shown.isNotEmpty) ...[
                UuMenuItem(
                  label: widget.selectAllLabel,
                  type: UuMenuItemType.multiple,
                  selected: allOn,
                  indeterminate: onCount > 0 && !allOn,
                  disabled: targets.isEmpty,
                  onTap: () => widget.onValuesChanged?.call(allOn ? ({...values}..removeAll(targets)) : {...values, ...targets}),
                ),
                const UuMenuDivider(),
              ],
              ..._menuGroupRows<T>(shownGroups, (o) => _option(o, multiple)),
            ],
    );
  }

  Widget _option(UuMenuOption<T> o, bool multiple) {
    final values = widget.values ?? <T>{};
    if (multiple) {
      final on = values.contains(o.value);
      return UuMenuItem(
        label: o.label,
        description: o.description,
        type: UuMenuItemType.multiple,
        selected: on,
        disabled: o.disabled,
        onTap: () => widget.onValuesChanged?.call(on ? ({...values}..remove(o.value)) : {...values, o.value}),
      );
    }
    return UuMenuItem(
      label: o.label,
      description: o.description,
      icon: o.icon,
      selected: o.value == widget.value,
      disabled: o.disabled,
      onTap: () {
        widget.onSelect?.call(o.value);
        UuMenuAnchor.closeOf(context);
      },
    );
  }
}

/// Danh sách option trần — dùng trong `UuCardSheet` (`Platform=Sheet`). Cùng luật với [UuMenu].
class UuMenuList<T> extends StatelessWidget {
  const UuMenuList({super.key, this.options = const [], this.groups, this.onSelect, this.value, this.type = UuMenuItemType.single, this.values, this.onValuesChanged});
  final List<UuMenuOption<T>> options;
  /// Option chia nhóm, như [UuMenu.groups].
  final List<UuMenuGroup<T>>? groups;
  final T? value;
  final ValueChanged<T>? onSelect;
  final UuMenuItemType type;
  final Set<T>? values;
  final ValueChanged<Set<T>>? onValuesChanged;

  @override
  Widget build(BuildContext context) {
    final vs = values ?? <T>{};
    final multiple = type == UuMenuItemType.multiple;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: _menuGroupRows<T>(
        _menuGroups(options, groups),
        spacing: UuGap.g1,
        (o) => multiple
            ? UuMenuItem(
                label: o.label,
                description: o.description,
                type: UuMenuItemType.multiple,
                selected: vs.contains(o.value),
                disabled: o.disabled,
                onTap: () => onValuesChanged?.call(vs.contains(o.value) ? ({...vs}..remove(o.value)) : {...vs, o.value}),
              )
            : UuMenuItem(
                label: o.label,
                description: o.description,
                icon: o.icon,
                selected: o.value == value,
                disabled: o.disabled,
                onTap: () => onSelect?.call(o.value),
              ),
      ),
    );
  }
}

/// `.MenuItem` (§6.21): H gap 12 · padding 8 · radius 12 · cao 40 · chữ `body`. 16 variant.
/// `Type=Single`: hàng đã chọn nền `background-accent-subtle` (tint nhạt, KHÔNG đặc) nên state layer vẫn đi bậc
/// nền sáng 5 / 10, chỉ đổi fill sang `background-interactive` cho cùng họ màu; chữ + check 16 `object-interactive`,
/// icon `Prefix` `object-accent`. Đã chọn + Disabled bỏ tint, mọi thứ `object-disabled`.
/// `Type=Multiple`: [UuCheckbox] ở đầu thay icon (Checked theo [selected], Disabled theo hàng), không tint,
/// chữ `object-primary`, state layer `object-primary` 5 / 10 phủ cả hàng; cao 48 Touch · 40 Compact.
/// [highlight]: phần trùng từ khoá in 600 (panel gợi ý của SearchInput).
/// [description] (`Description`, mọi Type): dòng thứ hai `caption` `object-secondary` (Disabled `object-disabled`;
/// Single đã chọn vẫn `object-secondary`), tối đa 2 dòng "…"; hàng cao theo nội dung, icon / checkbox căn trên.
/// [trailing]: nút riêng cuối hàng, không kích hoạt hàng (nút `xmark` xoá một mục "Tìm gần đây", §6.3g).
class UuMenuItem extends StatelessWidget {
  const UuMenuItem({
    super.key,
    required this.label,
    this.type = UuMenuItemType.single,
    this.selected = false,
    this.indeterminate = false,
    this.disabled = false,
    this.description,
    this.icon,
    this.highlight,
    this.trailing,
    this.onTap,
    this.forced,
  }) : assert(icon == null || type == UuMenuItemType.single, 'Prefix chỉ có ở Type=Single');

  final String label;
  final UuMenuItemType type;
  final bool selected;
  /// Chỉ `Type=Multiple`: checkbox Indeterminate — hàng "Chọn tất cả" khi mới chọn một phần.
  final bool indeterminate;
  final bool disabled;
  /// Thiết kế: `Description`.
  final String? description;
  /// Nút riêng ở cuối hàng (có state layer riêng).
  final Widget? trailing;
  /// Thiết kế: `Prefix` — icon 24 trước chữ, chỉ `Type=Single`.
  final String? icon;
  final String? highlight;
  final VoidCallback? onTap;
  final UuForcedState? forced;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final multiple = type == UuMenuItemType.multiple;
    final tinted = !multiple && selected && !disabled;
    final fg = disabled ? c.objectDisabled : tinted ? c.objectInteractive : c.objectPrimary;
    final iconFg = disabled ? c.objectDisabled : tinted ? c.objectAccent : c.objectSecondary;
    final radius = BorderRadius.circular(UuRadius.base);
    final style = th.text.body.copyWith(color: fg);
    final hasDesc = description != null && description!.isNotEmpty;
    final top = hasDesc ? CrossAxisAlignment.start : CrossAxisAlignment.center;
    Widget text = _label(style);
    if (hasDesc) {
      text = Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
        text,
        Text(description!, maxLines: 2, overflow: TextOverflow.ellipsis,
            style: th.text.caption.copyWith(color: disabled ? c.objectDisabled : c.objectSecondary)),
      ]);
      // Multiple: chữ đệm trên như CheckboxInput để tên thẳng giữa ô checkbox.
      if (multiple) text = Padding(padding: EdgeInsets.only(top: th.sizes.selectionLabelOffset), child: text);
    }
    final row = Semantics(
      selected: multiple ? null : selected,
      child: UuPressable(
        enabled: !disabled,
        surface: UuSurface.onLight,
        overlayColor: tinted ? c.backgroundInteractive : c.objectPrimary,
        borderRadius: radius,
        onTap: disabled ? null : onTap,
        forced: forced == UuForcedState.focus ? null : forced,
        semanticsRole: multiple ? UuSemanticsRole.checkbox : UuSemanticsRole.button,
        selected: multiple ? selected : null,
        semanticLabel: label,
        child: ExcludeSemantics(
          child: Container(
            constraints: const BoxConstraints(minHeight: UuSize.s10),
            decoration: BoxDecoration(color: tinted ? c.backgroundAccentSubtle : null, borderRadius: radius),
            padding: trailing == null ? const EdgeInsets.all(UuGap.g2) : EdgeInsets.fromLTRB(UuGap.g2, UuGap.g2, UuGap.g1 + th.sizes.controlHeightSmall + UuGap.g3, UuGap.g2),
            child: Row(
              crossAxisAlignment: top,
              children: [
                if (multiple) ...[
                  UuCheckbox(checked: indeterminate ? null : selected, disabled: disabled),
                  const SizedBox(width: UuGap.g3),
                ] else if (icon != null) ...[
                  UuIcon(icon!, size: UuSize.s6, color: iconFg),
                  const SizedBox(width: UuGap.g3),
                ],
                Expanded(child: text),
                if (!multiple && selected) ...[
                  const SizedBox(width: UuGap.g3),
                  Padding(
                    padding: EdgeInsets.only(top: hasDesc ? UuGap.g1 : 0), // check 16 giữa dòng tên 24
                    child: UuIcon('check', variant: UuIconVariant.fill, size: UuSize.s4, color: fg),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
    if (trailing == null) return row;
    // Nút đè lên mép phải hàng, nằm ngoài vùng bấm của hàng — bấm nút không kích hoạt hàng.
    return Stack(children: [
      row,
      Positioned(top: 0, bottom: 0, right: UuGap.g1, child: Center(child: trailing!)),
    ]);
  }

  Widget _label(TextStyle style) {
    final h = highlight?.trim() ?? '';
    final at = h.isEmpty ? -1 : label.toLowerCase().indexOf(h.toLowerCase());
    if (at < 0) return Text(label, style: style);
    return Text.rich(TextSpan(style: style, children: [
      TextSpan(text: label.substring(0, at)),
      TextSpan(text: label.substring(at, at + h.length), style: const TextStyle(fontWeight: UuFontWeight.semibold)),
      TextSpan(text: label.substring(at + h.length)),
    ]));
  }
}

/// `.MenuSection` (§6.21): tiêu đề nhóm — padding 8/8/4/8, `title-xs` `object-secondary` IN HOA.
/// [trailing]: nút đi kèm bên phải (vd. `TextButtonNeutral` Ghost Small "Xoá" của nhóm "Tìm gần đây").
/// Ẩn khi `layout` = collapsed (`layout/show-section-title`, §4.2).
class UuMenuSection extends StatelessWidget {
  const UuMenuSection({super.key, required this.title, this.trailing});
  final String title;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    if (!th.showSectionTitle) return const SizedBox.shrink();
    final text = Text(title.toUpperCase(), maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.titleXs.copyWith(color: th.colors.objectSecondary));
    return Semantics(
      header: true,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(UuGap.g2, UuGap.g2, UuGap.g2, UuGap.g1),
        child: trailing == null ? text : Row(children: [Expanded(child: text), const SizedBox(width: UuGap.g2), trailing!]),
      ),
    );
  }
}

/// `.MenuDivider` (§6.21): vạch ngăn giữa cụm — 1px `border-muted`, margin dọc 4. Nhóm đầu không cần vạch phía trên.
class UuMenuDivider extends StatelessWidget {
  const UuMenuDivider({super.key});
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: UuGap.g1),
        child: Container(height: UuSize.spx, color: UuTheme.of(context).colors.borderMuted),
      );
}

/// Rộng panel trong [UuMenuAnchor]: [anchor] = bằng phần tử mở (ô `UuDropdown`, `UuSearchInput`) ·
/// [min] = tối thiểu 240 (`size-60`), mở từ chip hay nút.
enum UuMenuAnchorWidth { anchor, min }

/// Neo panel `Menu` `Platform=Panel` (§6.21) dưới phần tử mở nó ([child]):
/// - cách 4 (`gap-1`); rộng bằng phần tử hoặc tối thiểu 240, canh mép trái;
/// - dưới không đủ chỗ mà trên đủ → lật lên trên; sát mép phải → canh mép phải với phần tử;
/// - cao tối đa 320 (`size-80`): [UuMenuPanel] cuộn phần giữa, ô tìm nhanh dính trên, footer dính dưới;
/// - đóng ([onClose]) khi bấm ra ngoài, Esc, chọn xong ở [UuMenu] `Type=Single`.
///   `Type=Multiple` chỉ đóng bằng "Áp dụng", bấm ra ngoài hoặc Esc.
class UuMenuAnchor extends StatefulWidget {
  const UuMenuAnchor({super.key, required this.open, required this.child, required this.menu, this.onClose, this.width = UuMenuAnchorWidth.anchor});

  final bool open;
  /// Phần tử mở panel.
  final Widget child;
  /// Panel: `UuMenu` / `UuMenuPanel`.
  final Widget menu;
  final VoidCallback? onClose;
  final UuMenuAnchorWidth width;

  /// Đóng panel của [UuMenuAnchor] gần nhất (không có thì bỏ qua). [UuMenu] `Type=Single` gọi sau khi chọn.
  static void closeOf(BuildContext context) => context.getInheritedWidgetOfExactType<_UuMenuAnchorScope>()?.close();

  /// [UuMenu] báo kiểu của mình — để biết có phải menu chọn nhiều không.
  static void markMultiple(BuildContext context, bool multiple) => context.getInheritedWidgetOfExactType<_UuMenuAnchorScope>()?.multiple.value = multiple;

  @override
  State<UuMenuAnchor> createState() => _UuMenuAnchorState();
}

class _UuMenuAnchorScope extends InheritedWidget {
  const _UuMenuAnchorScope({required this.close, required this.multiple, required super.child});
  final VoidCallback close;
  final ValueNotifier<bool> multiple;
  @override
  bool updateShouldNotify(_UuMenuAnchorScope old) => false;
}

class _UuMenuAnchorState extends State<UuMenuAnchor> {
  final _portal = OverlayPortalController();
  final _group = Object();
  final _multiple = ValueNotifier<bool>(false);

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(UuMenuAnchor old) {
    super.didUpdateWidget(old);
    if (old.open != widget.open) _sync();
  }

  @override
  void dispose() {
    _multiple.dispose();
    super.dispose();
  }

  // show()/hide() không gọi được trong lúc build → đồng bộ sau frame.
  void _sync() => WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        if (widget.open && !_portal.isShowing) _portal.show();
        if (!widget.open && _portal.isShowing) _portal.hide();
      });

  void _close() => widget.onClose?.call();

  @override
  Widget build(BuildContext context) {
    return _UuMenuAnchorScope(
      close: _close,
      multiple: _multiple,
      child: CallbackShortcuts(
        bindings: {const SingleActivator(LogicalKeyboardKey.escape): _close},
        child: OverlayPortal(
          controller: _portal,
          overlayChildBuilder: (overlayContext) {
            final box = context.findRenderObject() as RenderBox?;
            if (box == null || !box.hasSize) return const SizedBox.shrink();
            final overlayBox = Overlay.of(context).context.findRenderObject() as RenderBox?;
            final origin = box.localToGlobal(Offset.zero, ancestor: overlayBox);
            return Positioned.fill(
              child: CustomSingleChildLayout(
                delegate: _UuMenuAnchorLayout(anchor: origin & box.size, width: widget.width),
                child: _UuMenuAnchorScope(
                  close: _close,
                  multiple: _multiple,
                  child: CallbackShortcuts(
                    bindings: {const SingleActivator(LogicalKeyboardKey.escape): _close},
                    child: TapRegion(groupId: _group, child: widget.menu),
                  ),
                ),
              ),
            );
          },
          child: TapRegion(
            groupId: _group,
            onTapOutside: widget.open ? (_) => _close() : null,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}

class _UuMenuAnchorLayout extends SingleChildLayoutDelegate {
  _UuMenuAnchorLayout({required this.anchor, required this.width});
  final Rect anchor;
  final UuMenuAnchorWidth width;

  double get _w => width == UuMenuAnchorWidth.anchor ? anchor.width : (anchor.width > UuSize.s60 ? anchor.width : UuSize.s60);

  @override
  BoxConstraints getConstraintsForChild(BoxConstraints constraints) {
    final below = constraints.maxHeight - anchor.bottom - UuGap.g1;
    final above = anchor.top - UuGap.g1;
    final room = below > above ? below : above;
    final maxH = room < UuSize.s80 ? (room < 0 ? 0.0 : room) : UuSize.s80;
    final w = _w > constraints.maxWidth ? constraints.maxWidth : _w;
    return BoxConstraints(minWidth: w, maxWidth: w, maxHeight: maxH);
  }

  @override
  Offset getPositionForChild(Size size, Size child) {
    final below = size.height - anchor.bottom - UuGap.g1;
    final above = anchor.top - UuGap.g1;
    final flip = child.height > below && above >= child.height;
    final y = flip ? anchor.top - UuGap.g1 - child.height : anchor.bottom + UuGap.g1;
    final endAligned = anchor.left + child.width > size.width && anchor.right - child.width >= 0;
    final x = endAligned ? anchor.right - child.width : anchor.left;
    return Offset(x, y);
  }

  @override
  bool shouldRelayout(_UuMenuAnchorLayout old) => old.anchor != anchor || old.width != width;
}
