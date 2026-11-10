import 'package:flutter/widgets.dart';
import 'buttons.dart';
import 'icon.dart';
import 'selection.dart';
import 'state_layer.dart';
import 'theme.dart';
import 'tokens.g.dart';

/// Loại ô chọn của [UuListItem]: [checkbox] / [radio] ở phần đầu, [switcher] ở phần đuôi. Bấm cả hàng là bật / chọn.
enum UuListSelectionType { checkbox, radio, switcher }

class UuListSelection {
  const UuListSelection.checkbox({required this.checked, this.onChanged}) : type = UuListSelectionType.checkbox;
  const UuListSelection.radio({required bool this.checked, this.onChanged}) : type = UuListSelectionType.radio;
  const UuListSelection.switcher({required bool this.checked, this.onChanged}) : type = UuListSelectionType.switcher;
  final UuListSelectionType type;
  /// `null` = Indeterminate (chỉ checkbox).
  final bool? checked;
  final ValueChanged<bool>? onChanged;
}

/// Trailing `Action`: IconButtonNeutral Ghost Small, vùng bấm riêng.
class UuListAction {
  const UuListAction({required this.icon, required this.label, required this.onPressed});
  final String icon;
  final String label;
  final VoidCallback onPressed;
}

/// ListItem (§6.32): [Leading] [Title / Description] [Trailing] [Action] · gap 12 · cao tối thiểu `list/min-height`
/// (56 · Compact 40) · padding ngang `list/padding-x` (16 · 12), dọc `list/padding-y` (12 · 8). State layer object-primary 5 / 10 phủ cả hàng.
/// [leading]: `UuIcon` 24 · [UuListIconContainer] · [UuListAvatar]. [trailing]: [UuListChevron] · [UuListValue] ·
/// `UuBadge` / `UuNotificationBadge`. [selection] checkbox / radio thay [leading], switcher thay [trailing].
class UuListItem extends StatelessWidget {
  const UuListItem({super.key, required this.title, this.description, this.leading, this.selection, this.trailing, this.action, this.onTap, this.disabled = false, this.divider = false, this.forced});
  final String title;
  final String? description;
  final Widget? leading;
  final UuListSelection? selection;
  final Widget? trailing;
  final UuListAction? action;
  /// Bấm cả hàng. Không có và không có [selection] → hàng chỉ hiển thị.
  final VoidCallback? onTap;
  final bool disabled;
  /// Vạch 1px border-muted dưới hàng, thụt theo Content. Trong [UuListGroup] tự có (trừ hàng cuối).
  final bool divider;
  final UuForcedState? forced;

  UuListItem _withDivider(bool d) => UuListItem(key: key, title: title, description: description, leading: leading, selection: selection, trailing: trailing, action: action, onTap: onTap, disabled: disabled, divider: d, forced: forced);

  void _toggle() {
    final s = selection;
    if (s == null) return onTap?.call();
    if (s.type == UuListSelectionType.radio) {
      if (s.checked != true) s.onChanged?.call(true);
      return;
    }
    s.onChanged?.call(s.checked != true);
  }

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final s = selection;
    // Ô chọn chỉ để nhìn — cả hàng nhận chạm và mang semantics (role + checked).
    Widget? control;
    if (s != null) {
      control = IgnorePointer(
        child: ExcludeSemantics(
          child: switch (s.type) {
            UuListSelectionType.checkbox => UuCheckbox(checked: s.checked, disabled: disabled),
            UuListSelectionType.radio => UuRadio(checked: s.checked == true, disabled: disabled),
            UuListSelectionType.switcher => UuSwitch(checked: s.checked == true, disabled: disabled),
          },
        ),
      );
    }
    final lead = s != null && s.type != UuListSelectionType.switcher ? control : leading;
    final tail = s?.type == UuListSelectionType.switcher ? control : trailing;
    final interactive = s != null || onTap != null;

    final content = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, maxLines: 2, overflow: TextOverflow.ellipsis, style: th.text.body.copyWith(color: disabled ? c.objectDisabled : c.objectPrimary)),
        if (description != null) ...[
          const SizedBox(height: UuGap.g0_5),
          Text(description!, style: th.text.caption.copyWith(color: disabled ? c.objectDisabled : c.objectSecondary)),
        ],
      ],
    );

    final row = ConstrainedBox(
      constraints: BoxConstraints(minHeight: z.listMinHeight),
      child: Padding(
        padding: EdgeInsets.only(left: z.listPaddingX),
        child: Row(
          children: [
            if (lead != null) ...[lead, const SizedBox(width: UuGap.g3)],
            Expanded(
              child: Container(
                constraints: BoxConstraints(minHeight: z.listMinHeight),
                padding: EdgeInsets.fromLTRB(0, z.listPaddingY, z.listPaddingX, z.listPaddingY),
                decoration: BoxDecoration(border: divider ? Border(bottom: BorderSide(color: c.borderMuted)) : null),
                child: Row(
                  children: [
                    Expanded(child: interactive ? ExcludeSemantics(child: content) : content),
                    if (tail != null) ...[const SizedBox(width: UuGap.g3), tail],
                    if (action != null) ...[
                      const SizedBox(width: UuGap.g3),
                      UuIconButton(icon: action!.icon, label: action!.label, tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small, state: disabled ? UuButtonState.disabled : UuButtonState.normal, onPressed: action!.onPressed),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
    if (!interactive) return row;
    return UuPressable(
      surface: UuSurface.onLight,
      overlayColor: c.objectPrimary,
      onTap: _toggle,
      enabled: !disabled,
      forced: forced,
      semanticLabel: description == null ? title : '$title, $description',
      semanticsRole: switch (s?.type) {
        UuListSelectionType.checkbox => UuSemanticsRole.checkbox,
        UuListSelectionType.radio => UuSemanticsRole.radio,
        UuListSelectionType.switcher => UuSemanticsRole.toggle,
        null => UuSemanticsRole.button,
      },
      selected: s?.checked,
      child: row,
    );
  }
}

/// Chevron phải 16 object-secondary — hàng mở sang màn khác.
class UuListChevron extends StatelessWidget {
  const UuListChevron({super.key});
  @override
  Widget build(BuildContext context) => UuIcon('chevron-right', size: UuSize.s4, color: UuTheme.of(context).colors.objectSecondary);
}

/// `.ListIconContainer`: ô tròn 40 nền background-accent-muted, icon 24 object-accent.
class UuListIconContainer extends StatelessWidget {
  const UuListIconContainer(this.icon, {super.key});
  final String icon;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Container(
      width: UuSize.s10, height: UuSize.s10, alignment: Alignment.center,
      decoration: BoxDecoration(color: c.backgroundAccentMuted, shape: BoxShape.circle),
      child: UuIcon(icon, size: UuSize.s6, color: c.objectAccent),
    );
  }
}

/// `.ListAvatar`: ảnh tròn 40.
class UuListAvatar extends StatelessWidget {
  const UuListAvatar(this.image, {super.key});
  final ImageProvider image;
  @override
  Widget build(BuildContext context) => ClipOval(child: Image(image: image, width: UuSize.s10, height: UuSize.s10, fit: BoxFit.cover));
}

/// `.ListValue`: giá trị đang đặt — body object-secondary, một dòng.
class UuListValue extends StatelessWidget {
  const UuListValue(this.value, {super.key});
  final String value;
  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    return Text(value, maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.body.copyWith(color: th.colors.objectSecondary));
  }
}

/// ListGroup (§6.32): tiêu đề title-xs IN HOA cách khối 8 · khối nền background-surface bo radius-lg, vạch ngăn giữa các hàng.
class UuListGroup extends StatelessWidget {
  const UuListGroup({super.key, this.title, required this.children});
  final String? title;
  final List<UuListItem> children;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (title != null) ...[
          Semantics(
            header: true,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: th.sizes.listPaddingX),
              child: Text(title!.toUpperCase(), style: th.text.titleXs.copyWith(color: c.objectSecondary)),
            ),
          ),
          const SizedBox(height: UuGap.g2),
        ],
        ClipRRect(
          borderRadius: BorderRadius.circular(UuRadius.lg),
          child: ColoredBox(
            color: c.backgroundSurface,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [for (var i = 0; i < children.length; i++) children[i]._withDivider(children[i].divider || i < children.length - 1)],
            ),
          ),
        ),
      ],
    );
  }
}
