import 'dart:math' as math;
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'buttons.dart';
import 'theme.dart';
import 'tokens.g.dart';

// ---------------------------------------------------------------------------
// SideSheet (§6.28)
// ---------------------------------------------------------------------------

/// `Type` của [UuSideSheet]: `standard` nằm cạnh nội dung (viền trái, không scrim) · `modal` nổi trên scrim.
enum UuSideSheetType { standard, modal }

/// `Width` của [UuSideSheet]: `base` rộng 384 (`size-96`) · `wide` rộng 480 (`size-120`) cho form dài / nhiều cột.
enum UuSideSheetWidth { base, wide }

/// SideSheet (§6.28): tấm từ mép phải màn desktop, rộng 384 (`size-96`) hoặc 480 (`size-120`, [UuSideSheetWidth.wide]),
/// cao FILL, nền surface. 4 variant = `Type` × `Width`.
/// Header `heading-sm` + nút đóng Ghost Small · Body cuộn, gap 12 · Footer (khi có [primaryLabel])
/// TextButtonNeutral Outline Base + TextButtonAccent Solid Base dồn phải. Trên app dùng Sheet (§6.8).
class UuSideSheet extends StatelessWidget {
  const UuSideSheet({
    super.key,
    required this.title,
    required this.children,
    this.type = UuSideSheetType.standard,
    this.width = UuSideSheetWidth.base,
    this.onClose,
    this.primaryLabel,
    this.onPrimary,
    this.secondaryLabel,
    this.onSecondary,
  });

  final String title;
  final List<Widget> children;
  final UuSideSheetType type;
  /// Thiết kế: `Width`.
  final UuSideSheetWidth width;
  /// Bỏ trống → `Navigator.maybePop` (đúng cho [showUuSideSheet]).
  final VoidCallback? onClose;
  /// Thiết kế: `Footer` — có nhãn nút chính thì hiện footer.
  final String? primaryLabel;
  final VoidCallback? onPrimary;
  final String? secondaryLabel;
  final VoidCallback? onSecondary;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final p = th.sizes.cardPadding;
    final modal = type == UuSideSheetType.modal;
    final radius = modal ? const BorderRadius.horizontal(left: Radius.circular(UuRadius.lg)) : BorderRadius.zero;
    final body = <Widget>[];
    for (var i = 0; i < children.length; i++) {
      if (i > 0) body.add(const SizedBox(height: UuGap.g3));
      body.add(children[i]);
    }
    return Semantics(
      scopesRoute: modal,
      namesRoute: modal,
      explicitChildNodes: true,
      label: title,
      child: Container(
        width: width == UuSideSheetWidth.wide ? UuSize.s120 : UuSize.s96,
        decoration: BoxDecoration(
          color: c.backgroundSurface,
          borderRadius: radius,
          boxShadow: modal ? UuElevation.high : null,
          border: modal ? null : Border(left: BorderSide(color: c.borderMuted)),
        ),
        clipBehavior: modal ? Clip.antiAlias : Clip.none,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: EdgeInsets.all(p),
              child: Row(children: [
                Expanded(child: Text(title, style: th.text.headingSm.copyWith(color: c.objectPrimary))),
                const SizedBox(width: UuGap.g3),
                UuIconButton(icon: 'xmark', label: 'Đóng', tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small,
                    onPressed: onClose ?? () => Navigator.of(context).maybePop()),
              ]),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: p),
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: body),
              ),
            ),
            if (primaryLabel != null)
              Padding(
                padding: EdgeInsets.all(p),
                child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                  if (secondaryLabel != null) ...[
                    UuTextButton(label: secondaryLabel!, tone: UuButtonTone.neutral, type: UuButtonType.outline, onPressed: onSecondary),
                    const SizedBox(width: UuGap.g3),
                  ],
                  UuTextButton(label: primaryLabel!, onPressed: onPrimary),
                ]),
              ),
          ],
        ),
      ),
    );
  }
}

/// SideSheet `Modal` đầy đủ: scrim như Sheet (`overlay` + blur 16), tấm dính mép phải, trượt vào từ phải.
Future<T?> showUuSideSheet<T>(
  BuildContext context, {
  required String title,
  required WidgetBuilder builder,
  UuSideSheetWidth width = UuSideSheetWidth.base,
  String? primaryLabel,
  VoidCallback? onPrimary,
  String? secondaryLabel,
  VoidCallback? onSecondary,
}) {
  return showGeneralDialog<T>(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'Đóng',
    barrierColor: Colors.transparent,
    transitionDuration: const Duration(milliseconds: 200),
    pageBuilder: uuRoutePage(context, (ctx) => BackdropFilter(
      filter: ImageFilter.blur(sigmaX: UuEffect.overlayBlur, sigmaY: UuEffect.overlayBlur),
      child: Container(
        color: UuTheme.of(ctx).colors.overlay,
        alignment: Alignment.centerRight,
        child: UuSideSheet(
          title: title,
          type: UuSideSheetType.modal,
          width: width,
          primaryLabel: primaryLabel,
          onPrimary: onPrimary,
          secondaryLabel: secondaryLabel,
          onSecondary: onSecondary ?? () => Navigator.of(ctx).maybePop(), // Huỷ mặc định = đóng
          children: [builder(ctx)],
        ),
      ),
    )),
    transitionBuilder: (ctx, anim, _, child) => FadeTransition(
      opacity: anim,
      child: SlideTransition(position: Tween(begin: const Offset(0.1, 0), end: Offset.zero).animate(anim), child: child),
    ),
  );
}

// ---------------------------------------------------------------------------
// Popover (§6.29)
// ---------------------------------------------------------------------------

/// Popover (§6.29): khung nổi rộng 320 (`size-80`), padding `card/padding`, gap 12, radius 16, nền surface, elevation-medium.
/// Header (khi có [title]) `title-base` + nút đóng Ghost Small · Footer (khi có [primaryLabel]) TextButtonNeutral Ghost Small +
/// TextButtonAccent Solid Small dồn phải. Mở bằng bấm, đóng bằng nút đóng / Esc / bấm ra ngoài — xem [showUuPopover].
class UuPopover extends StatelessWidget {
  const UuPopover({
    super.key,
    required this.child,
    this.title,
    this.onClose,
    this.primaryLabel,
    this.onPrimary,
    this.secondaryLabel,
    this.onSecondary,
  });

  final Widget child;
  /// Thiết kế: `Header` + `Title`. null = không có header.
  final String? title;
  final VoidCallback? onClose;
  /// Thiết kế: `Footer`.
  final String? primaryLabel;
  final VoidCallback? onPrimary;
  final String? secondaryLabel;
  final VoidCallback? onSecondary;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final parts = <Widget>[
      if (title != null)
        Row(children: [
          Expanded(child: Text(title!, style: th.text.titleBase.copyWith(color: c.objectPrimary))),
          const SizedBox(width: UuGap.g3),
          UuIconButton(icon: 'xmark', label: 'Đóng', tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small,
              onPressed: onClose ?? () => Navigator.of(context).maybePop()),
        ]),
      child,
      if (primaryLabel != null)
        Row(mainAxisAlignment: MainAxisAlignment.end, children: [
          if (secondaryLabel != null) ...[
            UuTextButton(label: secondaryLabel!, tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small, onPressed: onSecondary),
            const SizedBox(width: UuGap.g2),
          ],
          UuTextButton(label: primaryLabel!, size: UuButtonSize.small, onPressed: onPrimary),
        ]),
    ];
    return Semantics(
      scopesRoute: true,
      namesRoute: title != null,
      label: title,
      explicitChildNodes: true,
      child: Container(
        width: UuSize.s80,
        padding: EdgeInsets.all(th.sizes.cardPadding),
        decoration: BoxDecoration(color: c.backgroundSurface, borderRadius: BorderRadius.circular(UuRadius.lg), boxShadow: UuElevation.medium),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (var i = 0; i < parts.length; i++) ...[if (i > 0) const SizedBox(height: UuGap.g3), parts[i]],
          ],
        ),
      ),
    );
  }
}

/// Mở [UuPopover] neo dưới phần tử của [anchorContext] (cách 4), canh mép trái; thiếu chỗ phía dưới thì lật lên trên,
/// sát mép phải thì canh mép phải với phần tử — đo theo kích thước overlay (§6.29). Đóng bằng nút đóng, Esc, hoặc
/// bấm ra ngoài (không scrim). Không có mũi tên.
Future<T?> showUuPopover<T>(
  BuildContext anchorContext, {
  required WidgetBuilder builder,
  String? title,
  String? primaryLabel,
  VoidCallback? onPrimary,
  String? secondaryLabel,
  VoidCallback? onSecondary,
}) {
  final box = anchorContext.findRenderObject()! as RenderBox;
  // Toạ độ theo overlay của navigator gốc: showGeneralDialog đẩy route lên đó.
  final overlay = Navigator.of(anchorContext, rootNavigator: true).overlay!.context.findRenderObject()! as RenderBox;
  final anchor = Rect.fromPoints(box.localToGlobal(Offset.zero, ancestor: overlay), box.localToGlobal(box.size.bottomRight(Offset.zero), ancestor: overlay));
  return showGeneralDialog<T>(
    context: anchorContext,
    barrierDismissible: true,
    barrierLabel: 'Đóng',
    barrierColor: Colors.transparent,
    transitionDuration: const Duration(milliseconds: 120),
    pageBuilder: uuRoutePage(anchorContext, (ctx) => CustomSingleChildLayout(
      delegate: _AnchoredLayout(anchor),
      child: UuPopover(
        title: title,
        primaryLabel: primaryLabel,
        onPrimary: onPrimary,
        secondaryLabel: secondaryLabel,
        onSecondary: onSecondary ?? () => Navigator.of(ctx).maybePop(), // Huỷ mặc định = đóng
        child: builder(ctx),
      ),
    )),
    transitionBuilder: (ctx, anim, _, child) => FadeTransition(opacity: anim, child: child),
  );
}

/// Tính chỗ đặt Popover trong khung [area] (kích thước overlay) theo §6.29: neo **dưới** [anchor] cách [gap], canh mép
/// trái. Phía dưới không đủ chỗ mà phía trên đủ → lật lên; cả hai đều thiếu → bên rộng hơn. Tràn mép phải → canh mép
/// phải với phần tử. [margin] là khoảng chừa với mép màn. Công khai để test.
Offset uuPlacePopover(Rect anchor, Size child, Size area, {double gap = UuGap.g1, double margin = UuGap.g2}) {
  final below = area.height - margin - anchor.bottom - gap;
  final above = anchor.top - gap - margin;
  final down = child.height <= below || (child.height > above && below >= above);
  final y = down ? anchor.bottom + gap : anchor.top - gap - child.height;
  final fitsRight = anchor.left + child.width <= area.width - margin;
  final x = fitsRight ? anchor.left : math.max(margin, anchor.right - child.width);
  return Offset(x, y);
}

class _AnchoredLayout extends SingleChildLayoutDelegate {
  _AnchoredLayout(this.anchor);
  final Rect anchor;

  @override
  BoxConstraints getConstraintsForChild(BoxConstraints constraints) => constraints.loosen();

  @override
  Offset getPositionForChild(Size size, Size child) => uuPlacePopover(anchor, child, size);

  @override
  bool shouldRelayout(_AnchoredLayout old) => old.anchor != anchor;
}

// ---------------------------------------------------------------------------
// Tooltip (§6.30)
// ---------------------------------------------------------------------------

/// `Placement` của [UuTooltip]: bong bóng nằm phía nào của phần tử; mũi tên chỉ về phần tử.
enum UuTooltipPlacement { top, bottom, left, right }

/// Bong bóng Tooltip (§6.30): padding 4/8, radius 8, nền `background-inverted`, max-width 240 (`size-60`),
/// chữ caption `object-primary-inverted`, mũi tên 8 × 4 giữa cạnh hướng về phần tử.
class UuTooltipBubble extends StatelessWidget {
  const UuTooltipBubble({super.key, required this.text, this.placement = UuTooltipPlacement.top});
  final String text;
  final UuTooltipPlacement placement;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final bubble = Container(
      constraints: const BoxConstraints(maxWidth: UuSize.s60),
      padding: const EdgeInsets.symmetric(vertical: UuGap.g1, horizontal: UuGap.g2),
      decoration: BoxDecoration(color: c.backgroundInverted, borderRadius: BorderRadius.circular(UuRadius.sm)),
      child: Text(text, style: th.text.caption.copyWith(color: c.objectPrimaryInverted)),
    );
    final vertical = placement == UuTooltipPlacement.top || placement == UuTooltipPlacement.bottom;
    final arrow = CustomPaint(
      size: vertical ? const Size(UuSize.s2, UuSize.s1) : const Size(UuSize.s1, UuSize.s2),
      painter: _ArrowPainter(c.backgroundInverted, placement),
    );
    return switch (placement) {
      UuTooltipPlacement.top => Column(mainAxisSize: MainAxisSize.min, children: [bubble, arrow]),
      UuTooltipPlacement.bottom => Column(mainAxisSize: MainAxisSize.min, children: [arrow, bubble]),
      UuTooltipPlacement.left => Row(mainAxisSize: MainAxisSize.min, children: [bubble, arrow]),
      UuTooltipPlacement.right => Row(mainAxisSize: MainAxisSize.min, children: [arrow, bubble]),
    };
  }
}

class _ArrowPainter extends CustomPainter {
  _ArrowPainter(this.color, this.placement);
  final Color color;
  final UuTooltipPlacement placement;

  @override
  void paint(Canvas canvas, Size s) {
    final path = switch (placement) {
      // mũi nhọn chỉ về phần tử (phía đối diện bong bóng)
      UuTooltipPlacement.top => Path()..moveTo(0, 0)..lineTo(s.width, 0)..lineTo(s.width / 2, s.height),
      UuTooltipPlacement.bottom => Path()..moveTo(0, s.height)..lineTo(s.width, s.height)..lineTo(s.width / 2, 0),
      UuTooltipPlacement.left => Path()..moveTo(0, 0)..lineTo(0, s.height)..lineTo(s.width, s.height / 2),
      UuTooltipPlacement.right => Path()..moveTo(s.width, 0)..lineTo(s.width, s.height)..lineTo(0, s.height / 2),
    };
    canvas.drawPath(path..close(), Paint()..color = color);
  }

  @override
  bool shouldRepaint(_ArrowPainter old) => old.color != color || old.placement != placement;
}

/// Tooltip (§6.30): hiện [UuTooltipBubble] khi hover **và** khi phần tử (hoặc con của nó) nhận focus bàn phím; ẩn khi rời / Esc.
/// Thời gian: hover hiện sau [hoverDelay] (500 ms), focus bàn phím hiện ngay; rời chuột / mất focus / Esc ẩn ngay, không
/// mờ dần. Đang có tooltip mở, hoặc vừa ẩn chưa quá [warmWindow] (300 ms), thì tooltip kế bên hiện ngay.
/// Chỉ chữ thuần — cần link hay nút thì dùng [UuPopover]. Không dùng trên màn chạm.
class UuTooltip extends StatefulWidget {
  const UuTooltip({super.key, required this.text, required this.child, this.placement = UuTooltipPlacement.top, this.open, this.isLabel = false});
  final String text;
  final Widget child;
  final UuTooltipPlacement placement;
  /// Ép hiện / ẩn (Widgetbook). null = theo hover / focus.
  final bool? open;
  /// `true` khi phần tử chỉ có icon và tooltip chính là **tên** của nó (mục SideNav thu gọn): tooltip không thêm
  /// ngữ nghĩa nữa, tên do [child] mang (`semanticLabel` = [text]) nên chỉ đọc một lần. `false` (mặc định) =
  /// mô tả thêm (`tooltip`). Spec §6.30.
  final bool isLabel;

  /// Hover giữ yên bao lâu mới hiện (§6.30: 500 ms).
  static const hoverDelay = Duration(milliseconds: 500);
  /// Cửa sổ "warm": tooltip vừa ẩn chưa quá khoảng này thì tooltip kế bên hiện ngay. Spec chỉ ghi "không chờ lại";
  /// 300 ms là số code chọn, khớp bản web.
  static const warmWindow = Duration(milliseconds: 300);

  // Dùng chung mọi UuTooltip: số tooltip đang mở, và tooltip vừa ẩn đang đếm cửa sổ warm (null = hết warm).
  static int _openCount = 0;
  static State<UuTooltip>? _cooling;
  static bool get _warm => _openCount > 0 || _cooling != null;

  @override
  State<UuTooltip> createState() => _UuTooltipState();
}

// Đếm 500 ms / 300 ms bằng AnimationController (theo frame) thay vì Timer: dừng cùng widget, và chạy đúng với
// `pumpAndSettle` trong test.
class _UuTooltipState extends State<UuTooltip> with TickerProviderStateMixin {
  final _link = LayerLink();
  final _portal = OverlayPortalController();
  bool _hover = false;
  bool _focus = false;
  bool _counted = false;
  late final _delay = AnimationController(vsync: this, duration: UuTooltip.hoverDelay)
    ..addStatusListener((st) { if (st == AnimationStatus.completed) _set(hover: true); });
  late final _cool = AnimationController(vsync: this, duration: UuTooltip.warmWindow)
    ..addStatusListener((st) { if (st == AnimationStatus.completed && UuTooltip._cooling == this) UuTooltip._cooling = null; });

  void _sync() {
    final show = widget.open ?? (_hover || _focus);
    if (show && !_portal.isShowing) {
      _portal.show();
      if (widget.open == null && !_counted) { _counted = true; UuTooltip._openCount++; }
    }
    if (!show && _portal.isShowing) {
      _portal.hide();
      _uncount(cool: true);
    }
  }

  void _uncount({required bool cool}) {
    if (!_counted) return;
    _counted = false;
    UuTooltip._openCount--;
    if (cool) {
      UuTooltip._cooling = this;
      _cool.forward(from: 0);
    }
  }

  @override
  void didUpdateWidget(UuTooltip old) {
    super.didUpdateWidget(old);
    WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _sync(); });
  }

  @override
  void initState() {
    super.initState();
    if (widget.open == true) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _sync(); });
  }

  @override
  void dispose() {
    _uncount(cool: false);
    if (UuTooltip._cooling == this) UuTooltip._cooling = null;
    _delay.dispose();
    _cool.dispose();
    super.dispose();
  }

  void _set({bool? hover, bool? focus}) {
    _hover = hover ?? _hover;
    _focus = focus ?? _focus;
    _sync();
  }

  void _enter() {
    if (UuTooltip._warm) {
      _delay.stop();
      _set(hover: true);
    } else {
      _delay.forward(from: 0);
    }
  }

  void _hideNow() {
    _delay.stop();
    _set(hover: false, focus: false);
  }

  @override
  Widget build(BuildContext context) {
    final (target, follower, offset) = switch (widget.placement) {
      UuTooltipPlacement.top => (Alignment.topCenter, Alignment.bottomCenter, const Offset(0, -UuGap.g1)),
      UuTooltipPlacement.bottom => (Alignment.bottomCenter, Alignment.topCenter, const Offset(0, UuGap.g1)),
      UuTooltipPlacement.left => (Alignment.centerLeft, Alignment.centerRight, const Offset(-UuGap.g1, 0)),
      UuTooltipPlacement.right => (Alignment.centerRight, Alignment.centerLeft, const Offset(UuGap.g1, 0)),
    };
    return CallbackShortcuts(
      bindings: {const SingleActivator(LogicalKeyboardKey.escape): _hideNow},
      child: Focus(
        canRequestFocus: false,
        skipTraversal: true,
        onFocusChange: (v) {
          if (v) {
            _set(focus: FocusManager.instance.highlightMode == FocusHighlightMode.traditional);
          } else {
            _hideNow();
          }
        },
        child: MouseRegion(
          onEnter: (_) => _enter(),
          onExit: (_) => _hideNow(),
          child: CompositedTransformTarget(
            link: _link,
            child: OverlayPortal(
              controller: _portal,
              overlayChildBuilder: (_) => Positioned(
                left: 0,
                top: 0,
                child: CompositedTransformFollower(
                  link: _link,
                  targetAnchor: target,
                  followerAnchor: follower,
                  offset: offset,
                  child: IgnorePointer(child: ExcludeSemantics(child: UuTooltipBubble(text: widget.text, placement: widget.placement))),
                ),
              ),
              child: widget.isLabel ? widget.child : Semantics(tooltip: widget.text, child: widget.child),
            ),
          ),
        ),
      ),
    );
  }
}
