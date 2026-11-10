import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'buttons.dart';
import 'feedback.dart';
import 'icon.dart';
import 'overlay.dart';
import 'selection.dart';
import 'state_layer.dart';
import 'theme.dart';
import 'tokens.g.dart';

/// NavigationBar (§6.5): cao 56 · padding 0/12 · gap 12 · không có nền riêng.
/// Back = IconButtonNeutral Solid Inverted 48 (chevron-left) · Sub action = IconButtonAccent Solid Inverted 48.
/// [miniAppControl] là slot cho `.Mini App Control` của Zalo (không thuộc design system) — chỉ khi chạy trong Zalo.
class UuNavigationBar extends StatelessWidget implements PreferredSizeWidget {
  const UuNavigationBar({super.key, this.title = 'Screen', this.titleWidget, this.onBack, this.subActionIcon, this.subActionLabel, this.onSubAction, this.miniAppControl});
  final String title;
  final Widget? titleWidget;
  final VoidCallback? onBack;
  final String? subActionIcon;
  final String? subActionLabel;
  final VoidCallback? onSubAction;
  final Widget? miniAppControl;

  @override
  Size get preferredSize => const Size.fromHeight(UuSize.s14);

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return SizedBox(
      height: UuSize.s14,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: UuGap.g3),
        child: Row(
          children: [
            if (onBack != null) ...[
              UuIconButton(icon: 'chevron-left', label: 'Quay lại', tone: UuButtonTone.neutral, type: UuButtonType.solid, inverted: true, onPressed: onBack),
              const SizedBox(width: UuGap.g3),
            ],
            Expanded(child: titleWidget ?? Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: UuTheme.of(context).text.headingBase.copyWith(color: c.objectPrimary))),
            if (subActionIcon != null) ...[
              const SizedBox(width: UuGap.g3),
              UuIconButton(icon: subActionIcon!, label: subActionLabel ?? subActionIcon!, tone: UuButtonTone.accent, type: UuButtonType.solid, inverted: true, onPressed: onSubAction),
            ],
            if (miniAppControl != null) ...[const SizedBox(width: UuGap.g3), miniAppControl!],
          ],
        ),
      ),
    );
  }
}

enum UuPaginationPosition { begin, middle, end }

/// Pagination (§6.10b): 5 gạch h2 gap 4; đang xem rộng 24 background-accent, còn lại 16 overlay. Chỉ ba vị trí.
class UuPagination extends StatelessWidget {
  const UuPagination({super.key, required this.position});
  final UuPaginationPosition position;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final active = switch (position) { UuPaginationPosition.begin => 0, UuPaginationPosition.middle => 2, UuPaginationPosition.end => 4 };
    return Semantics(
      label: switch (position) { UuPaginationPosition.begin => 'Đầu băng chuyền', UuPaginationPosition.middle => 'Giữa băng chuyền', UuPaginationPosition.end => 'Cuối băng chuyền' },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < 5; i++) ...[
            if (i > 0) const SizedBox(width: UuGap.g1),
            Container(width: i == active ? UuSize.s6 : UuSize.s4, height: 2, decoration: BoxDecoration(color: i == active ? c.backgroundAccent : c.overlay, borderRadius: BorderRadius.circular(UuRadius.circle))),
          ],
        ],
      ),
    );
  }
}

class UuSegmentItem<T> {
  const UuSegmentItem({required this.value, this.label, this.icon, this.suffix, this.disabled = false});
  final T value;
  final String? label;
  final String? icon;
  final Widget? suffix;
  final bool disabled;
}

/// SegmentedControl (§6.13): vỏ background-emphasized radius 16 padding 4 gap 2; item radius 12,
/// `Active` × `State` (Default/Hover/Pressed/Disabled): chọn = nền surface + elevation-low + chữ 700; hover/pressed lớp object-primary 5/10.
/// Item HUG — [fill] chỉ khi màn yêu cầu.
class UuSegmentedControl<T> extends StatelessWidget {
  const UuSegmentedControl({super.key, required this.items, required this.value, required this.onChanged, this.fill = false});
  final List<UuSegmentItem<T>> items;
  final T value;
  final ValueChanged<T> onChanged;
  final bool fill;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Container(
      padding: const EdgeInsets.all(UuGap.g1),
      decoration: BoxDecoration(color: c.backgroundEmphasized, borderRadius: BorderRadius.circular(UuRadius.lg)),
      child: Row(
        mainAxisSize: fill ? MainAxisSize.max : MainAxisSize.min,
        children: [
          for (var i = 0; i < items.length; i++) ...[
            if (i > 0) const SizedBox(width: UuGap.g0_5),
            if (fill) Expanded(child: _segment(context, c, items[i])) else _segment(context, c, items[i]),
          ],
        ],
      ),
    );
  }

  Widget _segment(BuildContext context, UuSemanticColors c, UuSegmentItem<T> it) {
    final selected = it.value == value;
    final fg = it.disabled ? c.objectDisabled : selected ? c.objectPrimary : c.objectSecondary;
    return UuPressable(
      surface: UuSurface.onLight,
      overlayColor: c.objectPrimary, // fill object-primary ở cả hai giá trị Active, bậc 5/10
      borderRadius: BorderRadius.circular(UuRadius.base),
      enabled: !it.disabled,
      semanticsRole: UuSemanticsRole.tab,
      selected: selected,
      semanticLabel: it.label ?? it.icon,
      onTap: () => onChanged(it.value),
      child: Container(
        constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
        padding: const EdgeInsets.symmetric(vertical: UuGap.g1, horizontal: UuGap.g3),
        decoration: BoxDecoration(
          color: selected ? (it.disabled ? c.backgroundDisabled : c.backgroundSurface) : Colors.transparent,
          borderRadius: BorderRadius.circular(UuRadius.base),
          boxShadow: selected ? UuElevation.low : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (it.icon != null) ...[UuIcon(it.icon!, variant: selected ? UuIconVariant.fill : UuIconVariant.outline, size: 24, color: fg), if (it.label != null) const SizedBox(width: UuGap.g2)],
            if (it.label != null) Text(it.label!, style: (selected ? UuTheme.of(context).text.labelActive : UuTheme.of(context).text.label).copyWith(color: fg)),
            if (it.suffix != null) ...[const SizedBox(width: UuGap.g2), SizedBox(width: 18, height: 18, child: Center(child: it.suffix))],
          ],
        ),
      ),
    );
  }
}

/// Tab (§6.20): mục chuyển giữa các **vùng nội dung khác nhau** — không phải để lọc một danh sách.
/// 5 variant: `State` = Default · Active · Hover · Pressed · Disabled. Hug width, cao 48 (padding 12 + chữ 24).
/// Chữ `title-base` 600: Default / Hover / Pressed `object-secondary` · Active `object-interactive` · Disabled `object-disabled`.
/// Gạch chỉ báo rộng **CỐ ĐỊNH 32** × 4 `border-interactive`, không giãn theo nhãn; tâm nằm đúng mép đáy nên thò xuống 2px.
/// Hover / Pressed = state layer `object-primary` 5 / 10 phủ cả ô, radius `radius-sm` — chỉ ở tab KHÔNG Active.
/// Disabled không có state layer.
/// [icon] / [badge] tuỳ chọn: nội dung thành hàng ngang căn giữa — icon 16 trước chữ (gap 8, cùng màu chữ,
/// Active `fill` còn lại `outline`) · `NotificationBadge` Dot sau chữ (gap 4). Cao tab vẫn 48.
class UuTab extends StatelessWidget {
  const UuTab({super.key, required this.label, this.active = false, this.disabled = false, this.onTap, this.forced, this.icon, this.badge = false});
  final String label;
  final bool active;
  final bool disabled;
  final VoidCallback? onTap;
  /// Thiết kế: `Icon` (BOOLEAN + INSTANCE_SWAP) — tên UU icon 16 trước chữ.
  final String? icon;
  /// Thiết kế: `Badge` (BOOLEAN) — Dot "có mới" sau chữ. Screen reader đọc thêm "có mới".
  final bool badge;
  /// Ép Hover / Pressed để chụp Widgetbook. Bỏ qua ở tab Active / Disabled.
  final UuForcedState? forced;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final fg = disabled ? c.objectDisabled : active ? c.objectInteractive : c.objectSecondary;
    // Center(heightFactor: 1): HUG khi hàng tab không giới hạn bề ngang, FILL + căn giữa khi nằm trong Expanded.
    final cell = Center(
      heightFactor: 1,
      child: Padding(
        padding: EdgeInsets.all(th.sizes.tabPadding),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              UuIcon(icon!, variant: active ? UuIconVariant.fill : UuIconVariant.outline, size: UuSize.s4, color: fg),
              const SizedBox(width: UuGap.g2),
            ],
            Text(label, maxLines: 1, softWrap: false, style: th.text.titleBase.copyWith(color: fg)),
            if (badge) ...[const SizedBox(width: UuGap.g1), const UuNotificationBadge()],
          ],
        ),
      ),
    );
    final semantic = badge ? '$label, có mới' : label;
    final Widget body = active
        // Tab đang chọn bấm lại không làm gì — không state layer, nhưng vẫn là tab bật được.
        ? Semantics(selected: true, enabled: !disabled, label: semantic, excludeSemantics: true, child: cell)
        : UuPressable(
            surface: UuSurface.onLight,
            overlayColor: c.objectPrimary,
            borderRadius: BorderRadius.circular(UuRadius.sm),
            enabled: !disabled,
            onTap: onTap,
            forced: forced == UuForcedState.focus ? null : forced,
            semanticsRole: UuSemanticsRole.tab,
            selected: false,
            semanticLabel: semantic,
            child: ExcludeSemantics(child: cell),
          );
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.bottomCenter,
      children: [
        body,
        if (active)
          Positioned(
            bottom: -UuSize.s0_5,
            child: IgnorePointer(
              child: Container(
                width: UuSize.s8,
                height: UuSize.s1,
                decoration: BoxDecoration(color: c.borderInteractive, borderRadius: BorderRadius.circular(UuRadius.circle)),
              ),
            ),
          ),
      ],
    );
  }
}

/// Một mục của [UuTabBar].
class UuTabItem<T> {
  const UuTabItem({required this.value, required this.label, this.disabled = false, this.icon, this.badge = false});
  final T value;
  final String label;
  final bool disabled;
  /// Icon 16 trước chữ — xem [UuTab.icon].
  final String? icon;
  /// Dot "có mới" sau chữ — xem [UuTab.badge].
  final bool badge;
}

/// `Layout` của [UuTabBar]: [fixed] 2–4 tab nhãn ngắn, chia đều · [scrollable] ≥ 5 tab hoặc nhãn dài, cuộn ngang.
enum UuTabBarLayout { fixed, scrollable }

/// TabBar (§6.20): hàng tab. HORIZONTAL · gap 0 · không nền · viền dưới 1px `border-muted` chạy suốt,
/// gạch Active (4px) đè lên viền.
/// [UuTabBarLayout.fixed]: FILL bề ngang, các tab FILL chia đều.
/// [UuTabBarLayout.scrollable]: tab HUG, cuộn ngang, padding trái 16, cắt mép phải; tab Active tự cuộn vào tầm nhìn.
/// Bản Scrollable chừa thêm 2px dưới đáy cho nửa dưới gạch Active (vùng cuộn cắt nội dung tràn).
class UuTabBar<T> extends StatefulWidget {
  const UuTabBar({super.key, required this.items, required this.value, required this.onChanged, this.layout = UuTabBarLayout.fixed});
  final List<UuTabItem<T>> items;
  final T value;
  final ValueChanged<T> onChanged;
  final UuTabBarLayout layout;

  @override
  State<UuTabBar<T>> createState() => _UuTabBarState<T>();
}

class _UuTabBarState<T> extends State<UuTabBar<T>> {
  final _activeKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    _revealActive(animate: false);
  }

  @override
  void didUpdateWidget(UuTabBar<T> old) {
    super.didUpdateWidget(old);
    if (old.value != widget.value) _revealActive(animate: true);
  }

  void _revealActive({required bool animate}) {
    if (widget.layout != UuTabBarLayout.scrollable) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final ctx = _activeKey.currentContext;
      if (ctx == null || !mounted) return;
      Scrollable.ensureVisible(ctx, alignment: 0.5, duration: animate ? const Duration(milliseconds: 200) : Duration.zero, curve: Curves.easeOut);
    });
  }

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final fixed = widget.layout == UuTabBarLayout.fixed;
    Widget tab(UuTabItem<T> it) {
      final active = it.value == widget.value;
      return UuTab(
        key: active ? _activeKey : null,
        label: it.label,
        active: active,
        disabled: it.disabled,
        icon: it.icon,
        badge: it.badge,
        onTap: () => widget.onChanged(it.value),
      );
    }

    final overhang = fixed ? 0.0 : UuSize.s0_5;
    final row = Row(
      mainAxisSize: fixed ? MainAxisSize.max : MainAxisSize.min,
      children: [for (final it in widget.items) fixed ? Expanded(child: tab(it)) : tab(it)],
    );
    return Semantics(
      container: true,
      explicitChildNodes: true,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(left: 0, right: 0, bottom: overhang, child: Container(height: UuSize.spx, color: c.borderMuted)),
          if (fixed)
            row
          else
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.only(left: UuGap.g4, bottom: overhang),
              child: row,
            ),
        ],
      ),
    );
  }
}

/// Một mục của [UuBottomBar].
class UuBottomBarItem<T> {
  const UuBottomBarItem({required this.value, required this.label, required this.icon, this.badge, this.badgeLabel});
  final T value;
  /// `compact` thì ẩn trên màn nhưng vẫn là nhãn cho trình đọc màn hình.
  final String label;
  /// Tên UU icon. Mục thường dùng `outline`, mục đang chọn tự đổi sang `fill`.
  final String icon;
  /// `NotificationBadge` Count neo góc icon — chỉ hiện khi mục KHÔNG được chọn.
  final String? badge;
  final String? badgeLabel;
}

/// BottomBar (§6.22): thanh điều hướng giữa các màn chính, dưới đáy. 10 variant = `Active` 1–5 × `Compact`.
/// Vỏ pill `background-surface` padding 4 gap 4, không viền, không bóng. 2–5 mục.
/// `compact=false`: vỏ FILL, mục chia đều, có nhãn `title-xs`, cao 64. `compact=true`: hug, mục 64 × 40, không nhãn, cao 48.
/// Mục đang chọn: nền `background-interactive-muted`, icon `fill` + chữ `object-interactive`.
/// Hover/Pressed của mục chưa chốt nên mục chưa có state layer. [action] = `base/FooterItemSpecial` (nút hành động rời).
/// Đặt ở `Scaffold.bottomNavigationBar` (bọc padding + SafeArea) để Toast của [showUuToast] nổi trên thanh (§6.6).
class UuBottomBar<T> extends StatelessWidget {
  const UuBottomBar({super.key, required this.items, required this.value, required this.onChanged, this.compact = false, this.action})
      : assert(items.length >= 2 && items.length <= 5, 'BottomBar chốt 2 đến 5 mục'),
        assert(action == null || !compact || items.length <= 4, 'Có nút hành động thì Compact tối đa 4 mục');
  final List<UuBottomBarItem<T>> items;
  final T value;
  final ValueChanged<T> onChanged;
  final bool compact;
  /// Thiết kế: BOOLEAN `Action` — một viên thuốc rời bên phải vỏ, cách 8, cho MỘT hành động chính
  /// (Quét mã, Tạo đơn). Không phải đích điều hướng, không có trạng thái Active.
  final UuBottomBarAction? action;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    Widget item(UuBottomBarItem<T> it) {
      final active = it.value == value;
      final fg = active ? c.objectInteractive : c.objectSecondary;
      final cell = Semantics(
        button: true,
        selected: active,
        label: it.label,
        excludeSemantics: true,
        child: GestureDetector(
          onTap: () => onChanged(it.value),
          behavior: HitTestBehavior.opaque,
          child: Container(
            constraints: const BoxConstraints(minWidth: UuSize.s16, minHeight: UuSize.s10),
            padding: const EdgeInsets.symmetric(horizontal: UuGap.g3, vertical: UuGap.g1_5),
            decoration: BoxDecoration(
              color: active ? c.backgroundInteractiveMuted : null,
              borderRadius: BorderRadius.circular(UuRadius.circle),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    UuIcon(it.icon, variant: active ? UuIconVariant.fill : UuIconVariant.outline, size: UuSize.s6, color: fg),
                    // Badge neo góc trên phải icon: mép phải trùng mép icon, cao hơn đỉnh icon 4px.
                    if (!active && it.badge != null)
                      Positioned(right: 0, top: -UuGap.g1, child: UuNotificationBadge(count: it.badge, semanticLabel: it.badgeLabel)),
                  ],
                ),
                if (!compact) ...[
                  const SizedBox(height: UuGap.g1),
                  Text(it.label, maxLines: 1, softWrap: false, style: UuTheme.of(context).text.titleXs.copyWith(color: fg)),
                ],
              ],
            ),
          ),
        ),
      );
      return compact ? cell : Expanded(child: cell);
    }

    final row = <Widget>[];
    for (var i = 0; i < items.length; i++) {
      if (i > 0) row.add(const SizedBox(width: UuGap.g1));
      row.add(item(items[i]));
    }
    final bar = Container(
      padding: const EdgeInsets.all(UuGap.g1),
      decoration: BoxDecoration(color: c.backgroundSurface, borderRadius: BorderRadius.circular(UuRadius.circle)),
      child: Row(mainAxisSize: compact ? MainAxisSize.min : MainAxisSize.max, children: row),
    );
    if (action == null) return bar;
    return Row(
      mainAxisSize: compact ? MainAxisSize.min : MainAxisSize.max,
      children: [
        if (compact) bar else Expanded(child: bar),
        const SizedBox(width: UuGap.g2),
        _UuFooterItemSpecial(action: action!, compact: compact),
      ],
    );
  }
}

/// `Type` của `base/FooterItemSpecial`: [emphasized] (mặc định) nền `background-interactive` ·
/// [subtle] nền `background-surface` — dùng khi màn đã có một nút Solid khác.
enum UuFooterItemSpecialType { subtle, emphasized }

/// Nút hành động riêng của [UuBottomBar] (`base/FooterItemSpecial`, §6.22).
class UuBottomBarAction {
  const UuBottomBarAction({required this.label, required this.icon, this.onPressed, this.type = UuFooterItemSpecialType.emphasized});
  /// `Compact=true` ẩn nhãn trên màn nhưng vẫn là tên cho trình đọc màn hình.
  final String label;
  final String icon;
  final VoidCallback? onPressed;
  final UuFooterItemSpecialType type;
}

/// `base/FooterItemSpecial`: `Compact=False` 64 × 64 · padding 6/16 · icon 24 + nhãn `title-xs`;
/// `Compact=True` 48 × 48 · padding 12 · chỉ icon. Radius circle.
/// Subtle: nền surface, `object-interactive`, state layer 5 / 10 · Emphasized: nền interactive, `object-on-interactive`, 20 / 40.
class _UuFooterItemSpecial extends StatelessWidget {
  const _UuFooterItemSpecial({required this.action, required this.compact});
  final UuBottomBarAction action;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final emphasized = action.type == UuFooterItemSpecialType.emphasized;
    final bg = emphasized ? c.backgroundInteractive : c.backgroundSurface;
    final fg = emphasized ? c.objectOnInteractive : c.objectInteractive;
    final radius = BorderRadius.circular(UuRadius.circle);
    final side = compact ? UuSize.s12 : UuSize.s16;
    return UuPressable(
      surface: emphasized ? UuSurface.onDark : UuSurface.onLight,
      overlayColor: fg,
      borderRadius: radius,
      onTap: action.onPressed,
      semanticLabel: action.label,
      child: Container(
        constraints: BoxConstraints(minWidth: side, minHeight: side),
        padding: compact ? const EdgeInsets.all(UuGap.g3) : const EdgeInsets.symmetric(vertical: UuGap.g1_5, horizontal: UuGap.g4),
        decoration: BoxDecoration(color: bg, borderRadius: radius),
        child: ExcludeSemantics(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              UuIcon(action.icon, size: UuSize.s6, color: fg),
              if (!compact) ...[
                const SizedBox(height: UuGap.g1),
                Text(action.label, maxLines: 1, softWrap: false, style: th.text.titleXs.copyWith(color: fg)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Breadcrumb (§6.25)
// ---------------------------------------------------------------------------

/// Một mục của [UuBreadcrumb]. Mục cuối luôn là trang hiện tại ([onTap] bị bỏ qua).
class UuBreadcrumbItem {
  const UuBreadcrumbItem(this.label, {this.onTap});
  final String label;
  final VoidCallback? onTap;
}

/// Breadcrumb (§6.25): đường dẫn vị trí trong cây trang (desktop). Gap 4, ngăn cách "/" body `object-disabled`.
/// Mục: padding ngang 4, radius 8, body `object-secondary`, là link (hover = state layer object-primary 5).
/// Mục cuối `Current=True`: `object-primary`, không phải link. Không dùng thay NavigationBar trên app.
/// **Quá 4 mục** thì rút gọn: giữ mục đầu và 2 mục cuối, giữa là một mục `Type=Overflow` "…" — bấm mở `UuMenu`
/// (`Platform=Panel`) neo dưới, cách 4, liệt kê các mục ẩn theo thứ tự; chọn một mục gọi `onTap` của mục đó.
class UuBreadcrumb extends StatelessWidget {
  const UuBreadcrumb({super.key, required this.items}) : assert(items.length > 0);
  final List<UuBreadcrumbItem> items;

  /// Số mục tối đa hiện đủ; hơn thì rút gọn.
  static const maxVisible = 4;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final collapsed = items.length > maxVisible;
    // (chỉ số mục, null = mục "…")
    final shown = <int?>[if (collapsed) ...[0, null, items.length - 2, items.length - 1] else for (var i = 0; i < items.length; i++) i];
    final children = <Widget>[];
    for (var k = 0; k < shown.length; k++) {
      if (k > 0) {
        children
          ..add(const SizedBox(width: UuGap.g1))
          ..add(ExcludeSemantics(child: Text('/', style: th.text.body.copyWith(color: c.objectDisabled))))
          ..add(const SizedBox(width: UuGap.g1));
      }
      final i = shown[k];
      if (i == null) {
        children.add(UuBreadcrumbOverflow(hidden: items.sublist(1, items.length - 2)));
        continue;
      }
      final it = items[i];
      final current = i == items.length - 1;
      final label = Padding(
        padding: const EdgeInsets.symmetric(horizontal: UuGap.g1),
        child: Text(it.label, maxLines: 1, softWrap: false, style: th.text.body.copyWith(color: current ? c.objectPrimary : c.objectSecondary)),
      );
      children.add(current
          ? Semantics(label: '${it.label}, trang hiện tại', excludeSemantics: true, child: label)
          : Semantics(
              link: true,
              child: UuPressable(
                surface: UuSurface.onLight,
                overlayColor: c.objectPrimary,
                borderRadius: BorderRadius.circular(UuRadius.sm),
                onTap: it.onTap,
                semanticsRole: UuSemanticsRole.button,
                semanticLabel: it.label,
                child: label,
              ),
            ));
    }
    return Semantics(
      container: true,
      label: 'Breadcrumb',
      child: Row(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: children),
    );
  }
}

/// `.BreadcrumbItem` `Type=Overflow` (§6.25): chữ "…" body `object-secondary`, Hover như mục thường, tên đọc
/// "Hiện đường dẫn ẩn". Bấm mở `UuMenu` `Platform=Panel` neo dưới, cách 4, canh mép trái, rộng tối thiểu 240;
/// đóng khi chọn, bấm ra ngoài hoặc Esc. Dùng trong [UuBreadcrumb]; [forced] chỉ để ép Hover khi chụp Widgetbook.
class UuBreadcrumbOverflow extends StatefulWidget {
  const UuBreadcrumbOverflow({super.key, required this.hidden, this.forced});
  /// Các mục bị gom, theo thứ tự trong đường dẫn.
  final List<UuBreadcrumbItem> hidden;
  final UuForcedState? forced;

  @override
  State<UuBreadcrumbOverflow> createState() => _UuBreadcrumbOverflowState();
}

class _UuBreadcrumbOverflowState extends State<UuBreadcrumbOverflow> {
  final _link = LayerLink();
  final _portal = OverlayPortalController();
  final _tapGroup = Object();

  void _toggle() => setState(() => _portal.isShowing ? _portal.hide() : _portal.show());
  void _close() { if (_portal.isShowing) setState(_portal.hide); }

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final trigger = Semantics(
      expanded: _portal.isShowing,
      child: UuPressable(
        surface: UuSurface.onLight,
        overlayColor: c.objectPrimary,
        borderRadius: BorderRadius.circular(UuRadius.sm),
        onTap: _toggle,
        forced: widget.forced,
        semanticLabel: 'Hiện đường dẫn ẩn',
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: UuGap.g1),
          child: ExcludeSemantics(child: Text('…', style: th.text.body.copyWith(color: c.objectSecondary))),
        ),
      ),
    );
    return CallbackShortcuts(
      bindings: {const SingleActivator(LogicalKeyboardKey.escape): _close},
      child: TapRegion(
        groupId: _tapGroup,
        onTapOutside: (_) => _close(),
        child: CompositedTransformTarget(
          link: _link,
          child: OverlayPortal(
            controller: _portal,
            overlayChildBuilder: (_) => Positioned(
              left: 0,
              top: 0,
              child: CompositedTransformFollower(
                link: _link,
                targetAnchor: Alignment.bottomLeft,
                followerAnchor: Alignment.topLeft,
                offset: const Offset(0, UuGap.g1),
                child: TapRegion(
                  groupId: _tapGroup,
                  // Rộng 240 (mức tối thiểu của panel mở từ nút), cao tối đa 320 — dài hơn thì cuộn trong panel.
                  child: ConstrainedBox(
                    constraints: const BoxConstraints.tightFor(width: UuSize.s60).copyWith(maxHeight: UuSize.s80),
                    child: UuMenu<int>(
                      options: [for (var i = 0; i < widget.hidden.length; i++) UuMenuOption(value: i, label: widget.hidden[i].label)],
                      onSelect: (i) {
                        _close();
                        widget.hidden[i].onTap?.call();
                      },
                    ),
                  ),
                ),
              ),
            ),
            child: trigger,
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// SideNav (§6.27)
// ---------------------------------------------------------------------------

class _UuSideNavScope extends InheritedWidget {
  const _UuSideNavScope({required this.collapsed, required super.child});
  final bool collapsed;
  /// Ngoài [UuSideNav] (hiếm) thì theo `layout` của theme.
  static bool collapsedOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_UuSideNavScope>()?.collapsed ?? (UuTheme.of(context).layout == UuLayout.collapsed);
  @override
  bool updateShouldNotify(_UuSideNavScope old) => old.collapsed != collapsed;
}

/// SideNav (§6.27): thanh điều hướng dọc của web app / portal (tương đương BottomBar trên app).
/// Padding 12, gap 4, rộng `sidenav/width` (288 · Compact 240), viền phải 1px `border-muted`, nền surface.
/// [collapsed]: rộng 73 (12 + mục 48 + 12 + viền 1), ẩn nhãn / chevron / tiêu đề nhóm / mục cấp 2; nhãn thành Tooltip.
/// Bỏ trống [collapsed] → theo trục `layout` của theme (§4.2): `UuLayout.collapsed` = thu gọn. Truyền giá trị thì prop thắng.
/// [children] = `Listing`: [UuSideNavItem] và [UuSideNavSection]. Một mục `active` mỗi lúc.
/// [toggle] = nút thu / mở `IconButtonNeutral` Ghost Small `sidebar-left` ở đầu thanh, trên mục đầu tiên — dồn phải khi
/// mở rộng, căn giữa (kèm Tooltip) khi thu gọn. Bấm gọi [onCollapsedChanged]; màn truyền lại [collapsed].
class UuSideNav extends StatelessWidget {
  const UuSideNav({super.key, required this.children, this.collapsed, this.toggle = false, this.onCollapsedChanged});
  final List<Widget> children;
  final bool? collapsed;
  /// Thiết kế: `Toggle` (BOOLEAN).
  final bool toggle;
  /// Bấm nút thu / mở: nhận giá trị `collapsed` mới.
  final ValueChanged<bool>? onCollapsedChanged;

  /// Rộng khi thu gọn: padding 12 × 2 + mục vuông 48 + viền 1.
  static const collapsedWidth = UuGap.g3 * 2 + UuSize.s12 + UuSize.spx;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final collapsed = this.collapsed ?? th.layout == UuLayout.collapsed;
    final list = <Widget>[];
    if (toggle) {
      final label = collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng';
      Widget button = Semantics(
        expanded: !collapsed,
        child: UuIconButton(
          icon: 'sidebar-left',
          label: label,
          tone: UuButtonTone.neutral,
          type: UuButtonType.ghost,
          size: UuButtonSize.small,
          onPressed: onCollapsedChanged == null ? null : () => onCollapsedChanged!(!collapsed),
        ),
      );
      if (collapsed) button = UuTooltip(text: label, placement: UuTooltipPlacement.right, child: button);
      list.add(Align(alignment: collapsed ? Alignment.center : Alignment.centerRight, child: button));
    }
    for (final w in children) {
      if (collapsed && (w is UuSideNavSection || (w is UuSideNavItem && w.level == 2))) continue;
      if (list.isNotEmpty) list.add(const SizedBox(height: UuGap.g1));
      list.add(w);
    }
    return _UuSideNavScope(
      collapsed: collapsed,
      child: Semantics(
        container: true,
        explicitChildNodes: true,
        label: 'Điều hướng',
        child: Container(
          width: collapsed ? collapsedWidth : th.sizes.sidenavWidth,
          decoration: BoxDecoration(color: c.backgroundSurface, border: Border(right: BorderSide(color: c.borderMuted))),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(UuGap.g3),
            child: Column(crossAxisAlignment: collapsed ? CrossAxisAlignment.center : CrossAxisAlignment.stretch, children: list),
          ),
        ),
      ),
    );
  }
}

/// `.SideNavItem` (§6.27): padding ngang `control/padding-x-small`, gap 8, min-height `control/height-base`, radius 8,
/// icon `control/icon-base`, nhãn body. Default: icon outline secondary · Active: nền `background-interactive-muted`,
/// icon fill `object-interactive`. Hover/Pressed = state layer object-primary 5 / 10.
/// [level] 2 = mục con: không icon, thụt bằng icon. [chevron] = `chevron-down` 16 cuối mục cấp 1 có mục con,
/// xoay 180° (120 ms) khi [expanded]. [badge] = `NotificationBadge` Count cuối mục, trước chevron; thu gọn thì
/// thành Dot ở góc trên phải icon.
class UuSideNavItem extends StatelessWidget {
  const UuSideNavItem({super.key, required this.label, this.icon, this.level = 1, this.active = false, this.chevron = false, this.expanded, this.badge, this.badgeLabel, this.onTap, this.forced})
      : assert(level == 1 || level == 2),
        assert(level == 2 || icon != null, 'Mục cấp 1 cần icon');
  final String label;
  final String? icon;
  final int level;
  final bool active;
  final bool chevron;
  /// Mục cấp 1 có mục con: nhóm đang mở (semantics `expanded`, chevron xoay 180°). Màn tự hiện / ẩn mục cấp 2.
  final bool? expanded;
  /// Thiết kế: `Badge` — chuỗi hiện trong badge Count (vd. "3", "99+").
  final String? badge;
  /// Chữ cho screen reader của badge, vd. "3 đơn mới".
  final String? badgeLabel;
  final VoidCallback? onTap;
  final UuForcedState? forced;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final collapsed = _UuSideNavScope.collapsedOf(context) && level == 1;
    final hasBadge = badge != null && badge!.isNotEmpty;
    final radius = BorderRadius.circular(UuRadius.sm);
    final iconW = level == 1
        ? UuIcon(icon!, variant: active ? UuIconVariant.fill : UuIconVariant.outline, size: z.controlIconBase,
            color: active ? c.objectInteractive : c.objectSecondary)
        : SizedBox(width: z.controlIconBase);
    final content = collapsed
        ? Container(
            width: UuSize.s12,
            height: UuSize.s12,
            alignment: Alignment.center,
            child: hasBadge
                // Thu gọn: badge thành Dot ở góc trên phải icon.
                ? Stack(clipBehavior: Clip.none, children: [iconW, Positioned(top: 0, right: 0, child: UuNotificationBadge(semanticLabel: badgeLabel))])
                : iconW,
          )
        : Container(
            constraints: BoxConstraints(minHeight: z.controlHeightBase),
            padding: EdgeInsets.symmetric(horizontal: z.controlPaddingXSmall),
            child: Row(children: [
              iconW,
              const SizedBox(width: UuGap.g2),
              Expanded(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.body.copyWith(color: c.objectPrimary))),
              if (hasBadge) ...[const SizedBox(width: UuGap.g2), UuNotificationBadge(count: badge, semanticLabel: badgeLabel)],
              if (chevron && level == 1) ...[
                const SizedBox(width: UuGap.g2),
                // Nhóm mở → xoay 180° trong 120 ms, không đổi sang icon khác.
                AnimatedRotation(
                  turns: expanded == true ? 0.5 : 0,
                  duration: const Duration(milliseconds: 120),
                  child: UuIcon('chevron-down', size: UuSize.s4, color: c.objectSecondary),
                ),
              ],
            ]),
          );
    Widget item = UuPressable(
      surface: UuSurface.onLight,
      overlayColor: c.objectPrimary,
      borderRadius: radius,
      onTap: onTap,
      forced: forced,
      semanticsRole: UuSemanticsRole.tab,
      selected: active,
      semanticLabel: label,
      child: DecoratedBox(decoration: BoxDecoration(color: active ? c.backgroundInteractiveMuted : null, borderRadius: radius), child: content),
    );
    if (level == 1 && expanded != null) item = Semantics(expanded: expanded, child: item);
    if (collapsed) item = UuTooltip(text: label, placement: UuTooltipPlacement.right, isLabel: true, child: item);
    return item;
  }
}

/// `.SideNavSection` (§6.27): tiêu đề nhóm, padding 16/12/4/12, `title-xs` `object-secondary` IN HOA. Ẩn khi thu gọn.
class UuSideNavSection extends StatelessWidget {
  const UuSideNavSection({super.key, required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    if (_UuSideNavScope.collapsedOf(context)) return const SizedBox.shrink();
    final th = UuTheme.of(context);
    return Semantics(
      header: true,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(UuGap.g3, UuGap.g4, UuGap.g3, UuGap.g1),
        child: Text(title.toUpperCase(), maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.titleXs.copyWith(color: th.colors.objectSecondary)),
      ),
    );
  }
}
