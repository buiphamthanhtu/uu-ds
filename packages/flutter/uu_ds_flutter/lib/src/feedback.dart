import 'dart:async' show Timer;
import 'dart:math' as math;
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show KeyDownEvent, LogicalKeyboardKey;
import 'buttons.dart';
import 'icon.dart';
import 'navigation.dart';
import 'state_layer.dart';
import 'theme.dart';
import 'tokens.g.dart';

enum UuToastType { neutral, negative, positive, warning }

/// Toast (§6.6): h64 · padding 8/16 · gap 12 · radius 12 · elevation-medium.
/// Độ sáng của nền quyết định cả ba phần tử: Warning (nền sáng) → nút Inverted=False.
class UuToast extends StatelessWidget {
  const UuToast({super.key, required this.content, this.type = UuToastType.neutral, this.actionLabel, this.onAction, this.onClose});
  final String content;
  final UuToastType type;
  final String? actionLabel;
  final VoidCallback? onAction;
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final (bg, fg) = switch (type) {
      UuToastType.neutral => (c.backgroundInverted, c.objectPrimaryInverted),
      UuToastType.negative => (c.backgroundNegative, c.objectOnNegative),
      UuToastType.positive => (c.backgroundPositive, c.objectOnPositive),
      UuToastType.warning => (c.backgroundWarning, c.objectOnWarning),
    };
    final inverted = type != UuToastType.warning;
    // container: Toast là một node riêng (live region); nút hành động / đóng là node con, không gộp vào.
    return Semantics(
      container: true,
      explicitChildNodes: true,
      liveRegion: true,
      // Live region cần label của chính nó để trình đọc màn hình thông báo; chữ bên dưới bỏ khỏi cây để không đọc hai lần.
      label: content,
      child: Container(
        constraints: const BoxConstraints(minHeight: UuSize.s16),
        padding: const EdgeInsets.symmetric(vertical: UuGap.g2, horizontal: UuGap.g4),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(UuRadius.base), boxShadow: UuElevation.medium),
        child: Row(
          children: [
            Expanded(child: ExcludeSemantics(child: Text(content, style: UuTheme.of(context).text.body.copyWith(color: fg)))),
            if (actionLabel != null) ...[const SizedBox(width: UuGap.g3), UuTextButton(label: actionLabel!, tone: UuButtonTone.neutral, type: UuButtonType.solid, inverted: inverted, onPressed: onAction)],
            if (onClose != null) ...[const SizedBox(width: UuGap.g3), UuIconButton(icon: 'xmark', label: 'Đóng', tone: UuButtonTone.neutral, type: UuButtonType.ghost, inverted: inverted, onPressed: onClose)],
          ],
        ),
      ),
    );
  }
}

/// Hiện Toast ở đáy màn (§6.6): lề 12, đáy cách 12 so với mép cao nhất — đáy safe area, mép trên [UuBottomBar],
/// mép trên bàn phím. Đặt [UuBottomBar] ở `Scaffold.bottomNavigationBar` thì Toast tự đứng trên thanh và trên bàn phím;
/// đừng đặt thanh trong `Stack` của body.
/// **Sheet / dialog đang mở** (§6.8): Toast nổi trên scrim và sheet — vẽ ở overlay gốc thay vì ScaffoldMessenger
/// (SnackBar của Scaffold nằm dưới route của sheet nên bị che). Một Toast mỗi lúc: Toast mới thay Toast cũ.
void showUuToast(BuildContext context, {required String content, UuToastType type = UuToastType.neutral, String? actionLabel, VoidCallback? onAction, Duration duration = const Duration(seconds: 4)}) {
  final route = ModalRoute.of(context);
  final overModal = route is PopupRoute || (route != null && !route.isCurrent);
  // SnackBar chỉ vẽ được khi có Scaffold đăng ký với đúng ScaffoldMessenger này. Không có Scaffold, hoặc Scaffold
  // thuộc messenger khác (MaterialApp / ScaffoldMessenger lồng nhau) thì đi đường overlay.
  final scaffold = Scaffold.maybeOf(context);
  final messenger = ScaffoldMessenger.maybeOf(context);
  final snackOk = scaffold != null && messenger != null && identical(ScaffoldMessenger.maybeOf(scaffold.context), messenger);
  if (overModal || !snackOk) {
    _showUuToastOverlay(context, content: content, type: type, actionLabel: actionLabel, onAction: onAction, duration: duration);
    return;
  }
  final m = ScaffoldMessenger.of(context);
  _uuToastCurrent?.call();
  m.showSnackBar(SnackBar(
    backgroundColor: Colors.transparent, elevation: 0, behavior: SnackBarBehavior.floating, duration: duration,
    padding: EdgeInsets.zero, margin: _toastMargin(MediaQuery.sizeOf(context).width),
    content: UuToast(content: content, type: type, actionLabel: actionLabel, onAction: () { onAction?.call(); m.hideCurrentSnackBar(); }, onClose: m.hideCurrentSnackBar),
  ));
}

/// Toast rộng 428 (§6.6), màn hẹp hơn thì kéo ngang, lề 12 hai bên; màn rộng thì căn giữa.
const double _toastWidth = 428;
EdgeInsets _toastMargin(double screen) {
  final side = math.max(UuGap.g3, (screen - _toastWidth) / 2);
  return EdgeInsets.fromLTRB(side, UuGap.g3, side, UuGap.g3);
}

/// Hàm đóng Toast overlay đang hiện (nếu có).
VoidCallback? _uuToastCurrent;

void _showUuToastOverlay(BuildContext context, {required String content, required UuToastType type, String? actionLabel, VoidCallback? onAction, required Duration duration}) {
  final overlay = Overlay.of(context, rootOverlay: true);
  ScaffoldMessenger.maybeOf(context)?.hideCurrentSnackBar();
  _uuToastCurrent?.call();
  final hostKey = GlobalKey<_UuToastHostState>();
  late final OverlayEntry entry;
  var removed = false;
  void remove() {
    if (removed) return;
    removed = true;
    entry.remove();
  }

  void close() {
    final host = hostKey.currentState;
    if (host != null) {
      host.dismiss();
    } else {
      remove();
    }
  }

  entry = OverlayEntry(
    builder: (_) => _UuToastHost(
      key: hostKey,
      duration: duration,
      onGone: () {
        remove();
        if (identical(_uuToastCurrent, close)) _uuToastCurrent = null;
      },
      builder: (dismiss) => UuToast(
        content: content,
        type: type,
        actionLabel: actionLabel,
        onAction: () {
          onAction?.call();
          dismiss();
        },
        onClose: dismiss,
      ),
    ),
  );
  _uuToastCurrent = close;
  overlay.insert(entry);
}

class _UuToastHost extends StatefulWidget {
  const _UuToastHost({super.key, required this.duration, required this.onGone, required this.builder});
  final Duration duration;
  final VoidCallback onGone;
  final Widget Function(VoidCallback dismiss) builder;
  @override
  State<_UuToastHost> createState() => _UuToastHostState();
}

class _UuToastHostState extends State<_UuToastHost> with SingleTickerProviderStateMixin {
  late final AnimationController _anim = AnimationController(vsync: this, duration: const Duration(milliseconds: 200))..forward();
  Timer? _timer;
  bool _closing = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer(widget.duration, dismiss);
  }

  void dismiss() {
    if (_closing) return;
    _closing = true;
    _timer?.cancel();
    if (!mounted) {
      widget.onGone();
      return;
    }
    _anim.reverse().whenComplete(widget.onGone);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    // Sheet đang mở che BottomBar, nên mép cao nhất chỉ còn đáy safe area hoặc mép trên bàn phím.
    final bottom = math.max(mq.viewPadding.bottom, mq.viewInsets.bottom) + UuGap.g3;
    final curve = CurvedAnimation(parent: _anim, curve: Curves.easeOut);
    final side = _toastMargin(mq.size.width).left;
    return Positioned(
      left: side,
      right: side,
      bottom: bottom,
      child: FadeTransition(
        opacity: curve,
        child: SlideTransition(
          position: Tween(begin: const Offset(0, 0.3), end: Offset.zero).animate(curve),
          child: Material(type: MaterialType.transparency, child: widget.builder(dismiss)),
        ),
      ),
    );
  }
}

enum UuButtonGroupLayout { horizontal, vertical }

/// `Tone` của [UuButtonGroup]: [normal] = Default · [danger] = nhóm nút xác nhận hành động phá huỷ (xoá, huỷ đơn).
enum UuButtonGroupTone { normal, danger }

class UuGroupAction {
  const UuGroupAction(this.label, {this.onPressed, this.state = UuButtonState.normal});
  final String label;
  final VoidCallback? onPressed;
  final UuButtonState state;
}

/// Button group (§6.9): ngang → phụ trái, chính phải · dọc → chính trên, phụ dưới. Cả hai chia đều.
/// [tone] = [UuButtonGroupTone.danger]: nút chính đổi sang TextButtonDanger Solid Large, nút phụ giữ nguyên;
/// thứ tự và hình học không đổi.
class UuButtonGroup extends StatelessWidget {
  const UuButtonGroup({super.key, required this.primary, this.secondary, this.layout = UuButtonGroupLayout.horizontal, this.tone = UuButtonGroupTone.normal});
  final UuGroupAction primary;
  final UuGroupAction? secondary;
  final UuButtonGroupLayout layout;
  /// Thiết kế: `Tone` (Default · Danger).
  final UuButtonGroupTone tone;

  @override
  Widget build(BuildContext context) {
    final Widget p = tone == UuButtonGroupTone.danger
        ? UuTextButtonDanger(label: primary.label, size: UuButtonSize.large, state: primary.state, onPressed: primary.onPressed)
        : UuTextButton(label: primary.label, size: UuButtonSize.large, state: primary.state, onPressed: primary.onPressed);
    final s = secondary == null ? null : UuTextButton(label: secondary!.label, type: UuButtonType.outline, size: UuButtonSize.large, state: secondary!.state, onPressed: secondary!.onPressed);
    if (layout == UuButtonGroupLayout.horizontal) {
      return Row(children: [if (s != null) ...[Expanded(child: s), const SizedBox(width: UuGap.g3)], Expanded(child: p)]);
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [p, if (s != null) ...[const SizedBox(height: UuGap.g3), s]]);
  }
}

/// `Height` của [UuCardSheet]: [fit] cao theo nội dung · [full] cao tới cách đỉnh safe area 12 (Body cuộn).
enum UuSheetHeight { fit, full }

/// CardSheet (§6.8): tấm sheet radius 24 (cả 4 góc), header (tiêu đề + điều hướng), body (slot + Button group).
/// `Navigation` = Close (mặc định: nút đóng Outline Small bên phải) · Back (truyền [onBack]: nút quay lại
/// bên trái, KHÔNG có nút đóng). Hai nút loại trừ nhau — sheet con về sheet cha, muốn đóng thì về sheet gốc.
///
/// Sheet kéo được ([handle] = true): thanh 32 × 4 `rounded-circle` nền `border`, từ đỉnh 8 · thanh 4 · 8 · Header
/// (Header bỏ padding trên 16). Hai nấc [UuSheetHeight]: `fit` / `full` (cao bằng ràng buộc cha — trong
/// [showUuBottomSheet] là tới cách đỉnh safe area 12; Body cuộn, Header và nhóm nút đứng yên).
/// Kéo xuống ở `fit` quá 1/3 chiều cao → đóng (như nút đóng); ở `full` → về `fit`; thả giữa chừng về nấc gần nhất.
/// Thanh là nút "Kéo để đổi cỡ": chạm hoặc Enter để đổi nấc.
class UuCardSheet extends StatefulWidget {
  const UuCardSheet({
    super.key,
    required this.header,
    required this.child,
    this.onClose,
    this.onBack,
    this.cta,
    this.handle = false,
    this.height,
    this.initialHeight = UuSheetHeight.fit,
    this.onHeightChanged,
  });
  final String header;
  final Widget child;
  /// `Navigation=Close`. Bỏ trống → `Navigator.maybePop`. Bỏ qua khi có [onBack]. Sheet kéo được cũng gọi khi bị kéo đóng.
  final VoidCallback? onClose;
  /// Có giá trị = `Navigation=Back`.
  final VoidCallback? onBack;
  /// Thiết kế: `CTA` — hiện/ẩn toàn bộ nhóm nút.
  final UuButtonGroup? cta;
  /// Thiết kế: `Handle` — thanh kéo ở đỉnh. Không có thì sheet không kéo được.
  final bool handle;
  /// Thiết kế: `Height`. Có giá trị = điều khiển từ ngoài; null thì sheet tự giữ nấc (bắt đầu ở [initialHeight]).
  final UuSheetHeight? height;
  final UuSheetHeight initialHeight;
  /// Gọi khi người dùng kéo / chạm thanh kéo đổi nấc.
  final ValueChanged<UuSheetHeight>? onHeightChanged;

  @override
  State<UuCardSheet> createState() => _UuCardSheetState();
}

class _UuCardSheetState extends State<UuCardSheet> {
  late UuSheetHeight _own = widget.initialHeight;
  final _key = GlobalKey();
  double? _fitHeight; // đo khi đang ở nấc fit
  // Đang kéo: chiều cao gốc, nấc fit / full, quãng kéo; _liveH / _liveY là hình đang hiện.
  double _h0 = 0, _fitH = 0, _fullH = 0, _dy = 0;
  double? _liveH;
  double _liveY = 0;

  UuSheetHeight get _current => widget.handle ? (widget.height ?? _own) : UuSheetHeight.fit;

  void _change(UuSheetHeight next) {
    if (next == _current) return;
    if (widget.height == null) setState(() => _own = next);
    widget.onHeightChanged?.call(next);
  }

  void _toggle() => _change(_current == UuSheetHeight.fit ? UuSheetHeight.full : UuSheetHeight.fit);

  void _close() => widget.onClose != null ? widget.onClose!() : Navigator.of(context).maybePop();

  double get _size => (_key.currentContext?.findRenderObject() as RenderBox?)?.size.height ?? 0;

  void _start(double maxHeight) {
    _h0 = _size;
    _fullH = maxHeight.isFinite ? maxHeight : _h0;
    _fitH = math.min(_fullH, _current == UuSheetHeight.fit ? _h0 : (_fitHeight ?? _fullH / 2));
    _dy = 0;
  }

  void _update(double delta) {
    _dy += delta;
    final h = _h0 - _dy;
    setState(() {
      if (h >= _fitH) {
        _liveH = math.min(h, _fullH);
        _liveY = 0;
      } else {
        _liveH = _fitH;
        _liveY = _fitH - h;
      }
    });
  }

  void _end() {
    final h = _h0 - _dy;
    setState(() {
      _liveH = null;
      _liveY = 0;
    });
    if (h < _fitH) {
      if (_current == UuSheetHeight.fit && _fitH - h > _fitH / 3) {
        _close();
      } else {
        _change(UuSheetHeight.fit);
      }
      return;
    }
    _change((h - _fitH).abs() <= (h - _fullH).abs() ? UuSheetHeight.fit : UuSheetHeight.full);
  }

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final back = widget.onBack != null;
    return LayoutBuilder(builder: (context, cons) {
      final dragging = _liveH != null;
      final full = _current == UuSheetHeight.full && cons.maxHeight.isFinite;
      final bounded = dragging || full || cons.maxHeight.isFinite;
      if (_current == UuSheetHeight.fit && !dragging) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted && _current == UuSheetHeight.fit && _liveH == null) _fitHeight = _size;
        });
      }
      final slot = SingleChildScrollView(child: widget.child);
      final body = Padding(
        padding: const EdgeInsets.fromLTRB(UuGap.g4, UuGap.g3, UuGap.g4, UuGap.g4),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [
          if (!bounded) widget.child else if (dragging || full) Expanded(child: slot) else Flexible(child: slot),
          if (widget.cta != null) ...[const SizedBox(height: UuGap.g3), widget.cta!],
        ]),
      );
      Widget sheet = Container(
        key: _key,
        color: c.backgroundSurface,
        height: _liveH ?? (full ? cons.maxHeight : null),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (widget.handle) _UuSheetHandle(
              expanded: _current == UuSheetHeight.full,
              onToggle: _toggle,
              onDragStart: () => _start(cons.maxHeight),
              onDragUpdate: _update,
              onDragEnd: _end,
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(UuGap.g4, widget.handle ? 0 : UuGap.g4, UuGap.g4, 0),
              child: Row(children: [
                if (back) ...[
                  UuIconButton(icon: 'chevron-left', label: 'Quay lại', tone: UuButtonTone.neutral, type: UuButtonType.outline, size: UuButtonSize.small, onPressed: widget.onBack),
                  const SizedBox(width: UuGap.g4),
                ],
                Expanded(child: Text(widget.header, style: UuTheme.of(context).text.headingBase.copyWith(color: c.objectPrimary))),
                if (!back) ...[
                  const SizedBox(width: UuGap.g4),
                  UuIconButton(icon: 'xmark', label: 'Đóng', tone: UuButtonTone.neutral, type: UuButtonType.outline, size: UuButtonSize.small, onPressed: _close),
                ],
              ]),
            ),
            if (bounded) Flexible(fit: dragging || full ? FlexFit.tight : FlexFit.loose, child: body) else body,
          ],
        ),
      );
      sheet = ClipRRect(borderRadius: BorderRadius.circular(UuRadius.xl2), child: sheet);
      // Viền thẻ theo DNA (spec 4.3): vẽ ngoài ClipRRect để không bị cắt. Màn rộng (Compact): tối đa 480 (§6.8).
      sheet = DecoratedBox(decoration: BoxDecoration(borderRadius: BorderRadius.circular(UuRadius.xl2), boxShadow: UuTheme.of(context).cardShadows), child: sheet);
      sheet = ConstrainedBox(constraints: const BoxConstraints(maxWidth: UuSize.s120), child: sheet);
      if (_liveY != 0) sheet = Transform.translate(offset: Offset(0, _liveY), child: sheet);
      return Semantics(scopesRoute: true, namesRoute: true, explicitChildNodes: true, label: widget.header, child: sheet);
    });
  }
}

/// Thanh kéo của [UuCardSheet]: dải cao 20 (8 · thanh 4 · 8) ngang sheet làm vùng chạm; thanh 32 × 4 nền `border`.
class _UuSheetHandle extends StatelessWidget {
  const _UuSheetHandle({required this.expanded, required this.onToggle, required this.onDragStart, required this.onDragUpdate, required this.onDragEnd});
  final bool expanded;
  final VoidCallback onToggle;
  final VoidCallback onDragStart;
  final ValueChanged<double> onDragUpdate;
  final VoidCallback onDragEnd;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      expanded: expanded,
      label: 'Kéo để đổi cỡ',
      onTap: onToggle,
      excludeSemantics: true,
      child: Focus(
        onKeyEvent: (_, e) {
          if (e is KeyDownEvent && (e.logicalKey == LogicalKeyboardKey.enter || e.logicalKey == LogicalKeyboardKey.space)) {
            onToggle();
            return KeyEventResult.handled;
          }
          return KeyEventResult.ignored;
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onToggle,
          onVerticalDragStart: (_) => onDragStart(),
          onVerticalDragUpdate: (d) => onDragUpdate(d.delta.dy),
          onVerticalDragEnd: (_) => onDragEnd(),
          onVerticalDragCancel: onDragEnd,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: UuGap.g2),
            child: Center(
              child: Container(
                width: UuSize.s8,
                height: UuSize.s1,
                decoration: BoxDecoration(color: UuTheme.of(context).colors.border, borderRadius: BorderRadius.circular(UuRadius.circle)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Tên cũ của [UuCardSheet] (`.base/sheet`).
@Deprecated('Dùng UuCardSheet (§6.8).')
typedef UuBaseSheet = UuCardSheet;

/// Scrim chung cho Sheet/Dialog: `overlay` (đen 10%, alpha trong token) + blur 16.
Widget _scrim(BuildContext context, Widget child, {required bool bottom}) {
  final c = UuTheme.of(context).colors;
  // Bàn phím mở: khối nổi cách đỉnh bàn phím 12 (§6.8).
  final kb = MediaQuery.viewInsetsOf(context).bottom;
  final pad = MediaQuery.paddingOf(context);
  final bottomPad = kb > 0 ? kb + UuGap.g3 : (bottom ? pad.bottom : 0.0);
  return BackdropFilter(
    filter: ImageFilter.blur(sigmaX: UuEffect.overlayBlur, sigmaY: UuEffect.overlayBlur),
    child: Container(
      color: c.overlay,
      alignment: bottom ? Alignment.bottomCenter : Alignment.center,
      // Sheet: chừa đỉnh safe area + 12 → nấc `Height=Full` cao tới đó.
      padding: EdgeInsets.fromLTRB(UuGap.g3, bottom || kb > 0 ? pad.top + UuGap.g3 : 0, UuGap.g3, bottomPad),
      child: child,
    ),
  );
}

/// Bottom sheet đầy đủ: scrim + wrapper thụt 12 mỗi bên, sheet sát đáy (OS tự vẽ home indicator).
/// [handle] = sheet kéo được, bắt đầu ở [initialHeight]; nấc `full` cao tới cách đỉnh safe area 12.
Future<T?> showUuBottomSheet<T>(BuildContext context, {required String header, required WidgetBuilder builder, UuButtonGroup? cta, VoidCallback? onBack, bool handle = false, UuSheetHeight initialHeight = UuSheetHeight.fit}) {
  return showGeneralDialog<T>(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'Đóng',
    barrierColor: Colors.transparent,
    transitionDuration: const Duration(milliseconds: 200),
    // Màn rộng (density Compact): sheet giữa màn, rộng tối đa 480 (§6.8). Bàn phím mở thì bỏ SafeArea đáy (đã cách bàn phím 12).
    pageBuilder: uuRoutePage(context, (ctx) => _scrim(
        ctx,
        SafeArea(top: false, bottom: MediaQuery.viewInsetsOf(ctx).bottom == 0, child: UuCardSheet(header: header, cta: cta, onBack: onBack, handle: handle, initialHeight: initialHeight, child: builder(ctx))),
        bottom: UuTheme.of(ctx).density != UuDensity.compact)),
    transitionBuilder: (ctx, anim, _, child) => FadeTransition(opacity: anim, child: SlideTransition(position: Tween(begin: const Offset(0, 0.1), end: Offset.zero).animate(anim), child: child)),
  );
}

/// CardDialog (§6.10): tấm dialog radius 24 cả bốn góc, nền surface, KHÔNG có tiêu đề — nội dung vào slot.
/// 2 variant theo [banner]:
/// - `Banner=False`: header chỉ có nút đóng (IconButtonNeutral Outline Small) căn phải, p 16/16/0/16; body p 12/16/16/16.
/// - `Banner=True`: header là ảnh **16:9** (tỉ lệ duy nhất) sát mép, panel cắt theo bo 24 ở hai góc trên;
///   nút đóng IconButtonNeutral **Solid** Small đè lên ảnh, cách phải 16, cách trên 16; body p 16 bốn phía.
/// Ảnh là nội dung → [bannerLabel] (alt) bắt buộc khi có [banner]. [closeButton] = false chỉ ẩn nút, ảnh vẫn còn.
class UuCardDialog extends StatelessWidget {
  const UuCardDialog({super.key, required this.child, this.closeButton = true, this.onClose, this.buttonGroup, this.width, this.banner, this.bannerLabel})
      : assert(banner == null || bannerLabel != null, 'Ảnh banner là nội dung — cần bannerLabel (alt)');
  final Widget child;
  final bool closeButton;
  final VoidCallback? onClose;
  final UuButtonGroup? buttonGroup;
  /// 384 khi đứng riêng; trong overlay để null (rộng = khung − 24).
  final double? width;
  /// Thiết kế: `Banner=True`. Ảnh luôn được cắt về 16:9 (`BoxFit.cover`).
  final ImageProvider? banner;
  /// `alt` của ảnh banner.
  final String? bannerLabel;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    void close() => (onClose ?? () => Navigator.of(context).maybePop())();
    final hasBanner = banner != null;
    final Widget? header = hasBanner
        ? AspectRatio(
            aspectRatio: 16 / 9,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image(image: banner!, fit: BoxFit.cover, semanticLabel: bannerLabel),
                if (closeButton)
                  Positioned(
                    top: UuGap.g4,
                    right: UuGap.g4,
                    // Solid (nền background-inverted) để đọc được trên mọi ảnh — nút viền sẽ chìm.
                    child: UuIconButton(icon: 'xmark', label: 'Đóng', tone: UuButtonTone.neutral, type: UuButtonType.solid, size: UuButtonSize.small, onPressed: close),
                  ),
              ],
            ),
          )
        : closeButton
            ? Padding(
                padding: const EdgeInsets.fromLTRB(UuGap.g4, UuGap.g4, UuGap.g4, 0),
                child: Align(alignment: Alignment.centerRight, child: UuIconButton(icon: 'xmark', label: 'Đóng', tone: UuButtonTone.neutral, type: UuButtonType.outline, size: UuButtonSize.small, onPressed: close)),
              )
            : null;
    return Semantics(
      scopesRoute: true,
      explicitChildNodes: true,
      child: DecoratedBox(
        // Viền thẻ theo DNA (spec 4.3): vẽ ngoài ClipRRect để không bị cắt.
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(UuRadius.xl2), boxShadow: UuTheme.of(context).cardShadows),
        child: ClipRRect(
        borderRadius: BorderRadius.circular(UuRadius.xl2),
        child: Container(
          width: width,
          color: c.backgroundSurface,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (header != null) header,
              Padding(
                padding: hasBanner ? const EdgeInsets.all(UuGap.g4) : const EdgeInsets.fromLTRB(UuGap.g4, UuGap.g3, UuGap.g4, UuGap.g4),
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [child, if (buttonGroup != null) ...[const SizedBox(height: UuGap.g3), buttonGroup!]]),
              ),
            ],
          ),
        ),
      ),
      ),
    );
  }
}

/// Tên cũ của [UuCardDialog] (`.base/dialog`, đã gỡ khỏi bản thiết kế).
@Deprecated('Dùng UuCardDialog (§6.10).')
typedef UuBaseDialog = UuCardDialog;

/// Dialog đầy đủ: cùng scrim với Bottom sheet nhưng panel căn giữa theo chiều dọc.
Future<T?> showUuDialog<T>(BuildContext context, {required WidgetBuilder builder, bool closeButton = true, UuButtonGroup? buttonGroup, ImageProvider? banner, String? bannerLabel}) {
  return showGeneralDialog<T>(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'Đóng',
    barrierColor: Colors.transparent,
    transitionDuration: const Duration(milliseconds: 200),
    pageBuilder: uuRoutePage(context, (ctx) => _scrim(ctx, UuCardDialog(closeButton: closeButton, buttonGroup: buttonGroup, banner: banner, bannerLabel: bannerLabel, child: builder(ctx)), bottom: false)),
    transitionBuilder: (ctx, anim, _, child) => FadeTransition(opacity: anim, child: child),
  );
}

// ---------------------------------------------------------------------------
// Badge · StatusIndicator · NotificationBadge (§6.14–6.16)
// ---------------------------------------------------------------------------

/// Tone của [UuBadge] và [UuStatusIndicator]. [highlight] (họ `accent`, "mục này đáng chú ý": Mới, Nổi bật,
/// Đề xuất) CHỈ có ở StatusIndicator — Badge không có Highlight. Đừng dùng highlight để báo lỗi (`error`)
/// hay "có mới chưa xem" (`UuNotificationBadge`).
enum UuTone { neutral, success, warning, error, highlight }

/// Badge (§6.14): viên thuốc cao 24, padding 4/8, icon 16 fill luôn hiện theo tone + chữ title-sm 600, không state. 4 tone (không Highlight).
class UuBadge extends StatelessWidget {
  const UuBadge({super.key, required this.label, this.tone = UuTone.neutral}) : assert(tone != UuTone.highlight, 'Badge không có tone Highlight (§6.14)');
  final String label;
  final UuTone tone;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final (bg, fg) = switch (tone) {
      UuTone.neutral || UuTone.highlight => (c.backgroundInverted, c.objectPrimaryInverted),
      UuTone.success => (c.backgroundPositive, c.objectOnPositive),
      UuTone.warning => (c.backgroundWarning, c.objectOnWarning),
      UuTone.error => (c.backgroundNegative, c.objectOnNegative),
    };
    final icon = switch (tone) {
      UuTone.neutral || UuTone.highlight => 'circle-info',
      UuTone.success => 'circle-check',
      UuTone.warning => 'circle-warning',
      UuTone.error => 'triangle-warning',
    };
    return Container(
      height: UuSize.s6,
      padding: const EdgeInsets.only(left: UuGap.g1, right: UuGap.g2),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(UuRadius.circle)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        UuIcon(icon, variant: UuIconVariant.fill, size: 16, color: fg),
        const SizedBox(width: UuGap.g1),
        Text(label, maxLines: 1, softWrap: false, style: UuTheme.of(context).text.titleSm.copyWith(color: fg)),
      ]),
    );
  }
}

/// Chấm nhấp nháy của StatusIndicator (§6.15): opacity 1 → 0.3 → 1, chu kỳ 1.6s; đứng yên khi hệ thống tắt animation.
class _UuBlinkDot extends StatefulWidget {
  const _UuBlinkDot({required this.color});
  final Color color;
  @override
  State<_UuBlinkDot> createState() => _UuBlinkDotState();
}

class _UuBlinkDotState extends State<_UuBlinkDot> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
  late final Animation<double> _o = Tween(begin: 1.0, end: 0.3).animate(CurvedAnimation(parent: _c, curve: Curves.easeInOut));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.maybeDisableAnimationsOf(context) ?? false) {
      _c..stop()..value = 0;
    } else if (!_c.isAnimating) {
      _c.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
        opacity: _o,
        child: Container(width: UuSize.s2, height: UuSize.s2, decoration: BoxDecoration(color: widget.color, shape: BoxShape.circle)),
      );
}

/// StatusIndicator (§6.15): chấm 8 nhấp nháy + chữ title-sm, gap 6. `filled` = viên thuốc nền status (cao 24, padding 2/8).
/// 10 variant = 5 tone × Container None/Filled. `highlight` dùng họ `accent` nên đổi theo brand.
class UuStatusIndicator extends StatelessWidget {
  const UuStatusIndicator({super.key, required this.label, this.tone = UuTone.neutral, this.filled = false});
  final String label;
  final UuTone tone;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final Color? bg;
    final Color dot;
    final Color fg;
    if (filled) {
      (bg, dot) = switch (tone) {
        UuTone.neutral => (c.backgroundInverted, c.objectOnDark),
        UuTone.success => (c.backgroundPositive, c.objectOnPositive),
        UuTone.warning => (c.backgroundWarning, c.objectOnWarning),
        UuTone.error => (c.backgroundNegative, c.objectOnNegative),
        UuTone.highlight => (c.backgroundAccent, c.objectOnAccent),
      };
      fg = dot;
    } else {
      bg = null;
      dot = switch (tone) {
        UuTone.neutral => c.objectSecondary,
        UuTone.success => c.objectPositive,
        UuTone.warning => c.objectWarning,
        UuTone.error => c.objectNegative,
        UuTone.highlight => c.objectAccent,
      };
      fg = c.objectPrimary;
    }
    return Container(
      height: filled ? UuSize.s6 : UuSize.s5,
      padding: filled ? const EdgeInsets.symmetric(vertical: UuGap.g0_5, horizontal: UuGap.g2) : EdgeInsets.zero,
      decoration: filled ? BoxDecoration(color: bg, borderRadius: BorderRadius.circular(UuRadius.circle)) : null,
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        _UuBlinkDot(color: dot),
        const SizedBox(width: UuGap.g1_5),
        Text(label, maxLines: 1, softWrap: false, style: UuTheme.of(context).text.titleSm.copyWith(color: fg)),
      ]),
    );
  }
}

/// NotificationBadge (§6.16): `count` = cao 16, min-width 16, padding ngang 4, chữ 11/16 600 · `count == null` = chấm 8×8.
/// Nền `background-attention` — họ "có mới, chưa xem", không phải error/warning. Màn tự đặt vị trí neo; chưa chốt ngưỡng 99+.
class UuNotificationBadge extends StatelessWidget {
  const UuNotificationBadge({super.key, this.count, this.semanticLabel});
  /// Chuỗi hiện trong badge; null = biến thể Dot.
  final String? count;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final child = count == null
        ? Container(width: UuSize.s2, height: UuSize.s2, decoration: BoxDecoration(color: c.backgroundAttention, shape: BoxShape.circle))
        : Container(
            height: UuSize.s4,
            constraints: const BoxConstraints(minWidth: UuSize.s4),
            padding: const EdgeInsets.symmetric(horizontal: UuGap.g1),
            alignment: Alignment.center,
            decoration: BoxDecoration(color: c.backgroundAttention, borderRadius: BorderRadius.circular(UuRadius.circle)),
            child: Text(count!, maxLines: 1, softWrap: false, textAlign: TextAlign.center, style: UuTheme.of(context).text.titleXs.copyWith(color: c.objectOnAttention)),
          );
    return semanticLabel == null ? child : Semantics(label: semanticLabel, liveRegion: true, child: child);
  }
}

// ---------------------------------------------------------------------------
// EmptyScreen · EmptySection · ErrorSection (§6.19)
// ---------------------------------------------------------------------------

/// Ô minh hoạ chung của mọi màn / khối rỗng và lỗi: tròn 128, nền `background-accent-muted`.
/// Ảnh là nội dung — widget truyền vào tự mang `semanticLabel` (alt).
class _UuStateIllustration extends StatelessWidget {
  const _UuStateIllustration(this.child);
  final Widget? child;
  @override
  Widget build(BuildContext context) => Container(
        width: UuSize.s32,
        height: UuSize.s32,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(color: UuTheme.of(context).colors.backgroundAccentMuted, shape: BoxShape.circle),
        child: child,
      );
}

/// Content wrapper: V · gap 12 · căn giữa — ảnh, tiêu đề, mô tả.
class _UuStateContent extends StatelessWidget {
  const _UuStateContent({required this.title, required this.description, required this.illustration, required this.titleStyle, this.square = false});
  final String title;
  final String? description;
  final Widget? illustration;
  final TextStyle titleStyle;
  /// ResultScreen: ô vuông 128 KHÔNG nền, không cắt tròn — ảnh do màn quyết.
  final bool square;
  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        if (!square) _UuStateIllustration(illustration) else if (illustration != null) SizedBox(width: UuSize.s32, height: UuSize.s32, child: illustration),
        if (!square || illustration != null) const SizedBox(height: UuGap.g3),
        Semantics(header: true, child: Text(title, textAlign: TextAlign.center, style: titleStyle.copyWith(color: c.objectPrimary))),
        if (description != null) ...[
          const SizedBox(height: UuGap.g3),
          Text(description!, textAlign: TextAlign.center, style: th.text.body.copyWith(color: c.objectPrimary)),
        ],
      ],
    );
  }
}

/// Khối nhúng chung của EmptySection / ErrorSection: V · p 12 · gap 12 · căn giữa · FILL × HUG; nút HUG.
class _UuStateSection extends StatelessWidget {
  const _UuStateSection({required this.title, this.description, this.illustration, this.actionLabel, this.onAction});
  final String title;
  final String? description;
  final Widget? illustration;
  final String? actionLabel;
  final VoidCallback? onAction;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.all(UuGap.g3),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _UuStateContent(title: title, description: description, illustration: illustration, titleStyle: UuTheme.of(context).text.headingSm),
            if (actionLabel != null) ...[
              const SizedBox(height: UuGap.g3),
              UuTextButton(label: actionLabel!, size: UuButtonSize.large, onPressed: onAction),
            ],
          ],
        ),
      );
}

/// EmptySection (§6.19): một khối trong màn chưa có dữ liệu (danh sách rỗng, bảng rỗng) — không phải cả màn.
/// Ảnh tròn 128 nền `background-accent-muted` · tiêu đề `heading-sm` · mô tả `body`, căn giữa ·
/// một nút HUG, ẩn được: bỏ trống [actionLabel] = `Action=false`.
class UuEmptySection extends StatelessWidget {
  const UuEmptySection({super.key, required this.title, this.description, this.illustration, this.actionLabel, this.onAction});
  final String title;
  final String? description;
  /// Ảnh minh hoạ trong ô tròn 128 (bị cắt tròn). Cần `semanticLabel`.
  final Widget? illustration;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) =>
      _UuStateSection(title: title, description: description, illustration: illustration, actionLabel: actionLabel, onAction: onAction);
}

/// ErrorSection (§6.19): lỗi chỉ ở một khối, phần còn lại của màn vẫn dùng được. Cùng hình học với
/// [UuEmptySection], luôn có **một** nút thử lại. Lỗi cả màn → `ErrorScreen`; lỗi sửa được ngay → Dialog / Toast.
class UuErrorSection extends StatelessWidget {
  const UuErrorSection({super.key, required this.title, this.description, this.illustration, this.retryLabel = 'Thử lại', this.onRetry});
  final String title;
  final String? description;
  final Widget? illustration;
  final String retryLabel;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) =>
      _UuStateSection(title: title, description: description, illustration: illustration, actionLabel: retryLabel, onAction: onRetry);
}

/// EmptyScreen (§6.19): template màn khi **cả màn** chưa có dữ liệu. `NavigationBar` có nút back (màn rỗng vẫn là
/// màn bình thường) · Body FILL căn giữa hai chiều, padding ngang 16 · Footer HUG padding 16 với **một** nút hành động
/// (tạo mới, khám phá), ẩn được: bỏ trống [actionLabel] = `Action=false`. Home indicator do hệ điều hành vẽ.
/// Cỡ tiêu đề của màn là `heading-base` (khối nhúng dùng `heading-sm`, nhỏ hơn màn).
class UuEmptyScreen extends StatelessWidget {
  const UuEmptyScreen({
    super.key,
    required this.title,
    this.description,
    this.illustration,
    this.screenTitle = '',
    this.onBack,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String? description;
  final Widget? illustration;
  /// Tiêu đề trên `NavigationBar`.
  final String screenTitle;
  /// Bỏ trống → `Navigator.maybePop`.
  final VoidCallback? onBack;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    return ColoredBox(
      color: th.colors.backgroundSurface,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            UuNavigationBar(title: screenTitle, onBack: onBack ?? () => Navigator.of(context).maybePop()),
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: UuGap.g4),
                  child: _UuStateContent(title: title, description: description, illustration: illustration, titleStyle: th.text.headingBase),
                ),
              ),
            ),
            if (actionLabel != null)
              Padding(
                padding: const EdgeInsets.all(UuGap.g4),
                child: UuButtonGroup(primary: UuGroupAction(actionLabel!, onPressed: onAction)),
              ),
          ],
        ),
      ),
    );
  }
}

/// Body + Footer chung của [UuResultScreen] · [UuErrorScreen]: Body FILL căn giữa hai chiều (padding ngang 16) ·
/// Footer HUG padding 16. Cần chiều cao có giới hạn (đặt dưới `UuNavigationBar` trong `Expanded` / `Scaffold.body`).
class _UuScreenBody extends StatelessWidget {
  const _UuScreenBody({required this.content, required this.footer});
  final Widget content;
  final Widget footer;
  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Center(
              child: SingleChildScrollView(padding: const EdgeInsets.symmetric(horizontal: UuGap.g4), child: content),
            ),
          ),
          Padding(padding: const EdgeInsets.all(UuGap.g4), child: footer),
        ],
      );
}

/// ResultScreen (§6.19): việc đã xong, người dùng phải sang chỗ khác (đặt phòng xong, thanh toán xong).
/// Chỉ dựng Body + Footer: ảnh ô vuông 128 **không nền** (do màn truyền, cần `semanticLabel`) · tiêu đề `heading-base` ·
/// mô tả `body` · [UuButtonGroup] dọc — nút chính trên, lối đi phụ dưới (tuỳ chọn).
/// `UuNavigationBar` (`Back action=false`) và safe area do màn đặt.
class UuResultScreen extends StatelessWidget {
  const UuResultScreen({super.key, required this.title, this.description, this.illustration, required this.primary, this.secondary});
  final String title;
  final String? description;
  /// Ảnh kết quả trong ô vuông 128, không nền. Cần `semanticLabel` (alt).
  final Widget? illustration;
  /// Nút chính (trên).
  final UuGroupAction primary;
  /// Lối đi phụ (dưới, Outline). null = ẩn.
  final UuGroupAction? secondary;

  @override
  Widget build(BuildContext context) => _UuScreenBody(
        content: _UuStateContent(title: title, description: description, illustration: illustration, titleStyle: UuTheme.of(context).text.headingBase, square: true),
        footer: UuButtonGroup(layout: UuButtonGroupLayout.vertical, primary: primary, secondary: secondary),
      );
}

/// ErrorScreen (§6.19): lỗi chặn cả chức năng cốt lõi, không tự khắc phục được. Chỉ dựng Body + Footer:
/// ảnh tròn 128 nền `background-accent-muted` · tiêu đề `heading-base` · mô tả `body` · **đúng một** nút thử lại.
/// `UuNavigationBar` (`Back action=false`) và safe area do màn đặt. Lỗi một khối → [UuErrorSection].
class UuErrorScreen extends StatelessWidget {
  const UuErrorScreen({super.key, required this.title, this.description, this.illustration, this.retryLabel = 'Thử lại', this.onRetry});
  final String title;
  final String? description;
  /// Ảnh minh hoạ trong ô tròn 128 (bị cắt tròn). Cần `semanticLabel`.
  final Widget? illustration;
  final String retryLabel;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => _UuScreenBody(
        content: Semantics(
          liveRegion: true,
          child: _UuStateContent(title: title, description: description, illustration: illustration, titleStyle: UuTheme.of(context).text.headingBase),
        ),
        footer: UuButtonGroup(layout: UuButtonGroupLayout.vertical, primary: UuGroupAction(retryLabel, onPressed: onRetry)),
      );
}

// ---------------------------------------------------------------------------
// CardPushNotification (§6.31)
// ---------------------------------------------------------------------------

/// CardPushNotification (§6.31): thẻ báo **chuyện từ bên ngoài** (đơn đổi trạng thái, quà mới, tin nhắn), trượt
/// xuống từ đỉnh màn. Do app vẽ — push thật của iOS/Android không thuộc DS. Khác Toast: Toast báo kết quả việc
/// người dùng vừa làm, ở đáy, có `Type`.
/// H · gap 8 · padding 8/16/8/8 · `radius-lg` · nền surface · `elevation-medium` · căn TRÊN.
/// Ảnh 48 `radius-sm` (ẩn được) · Title `body` 600 tối đa 2 dòng · Content `body` tối đa 2 dòng, cách 2.
/// Không type, không nút: bấm cả thẻ để mở. Hiện bằng [showUuPushNotification].
class UuCardPushNotification extends StatelessWidget {
  const UuCardPushNotification({super.key, required this.title, required this.content, this.image, this.imageLabel, this.onTap})
      : assert(image == null || imageLabel != null, 'Ảnh là nội dung — cần imageLabel (alt)');
  final String title;
  final String content;
  /// Thiết kế: BOOLEAN `Image` — logo đối tác, ảnh sản phẩm. null = ẩn.
  final ImageProvider? image;
  final String? imageLabel;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final radius = BorderRadius.circular(UuRadius.lg);
    final card = Container(
      padding: const EdgeInsets.fromLTRB(UuGap.g2, UuGap.g2, UuGap.g4, UuGap.g2),
      decoration: BoxDecoration(color: c.backgroundSurface, borderRadius: radius, boxShadow: UuElevation.medium),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (image != null) ...[
            ClipRRect(
              borderRadius: BorderRadius.circular(UuRadius.sm),
              child: Image(image: image!, width: UuSize.s12, height: UuSize.s12, fit: BoxFit.cover, semanticLabel: imageLabel),
            ),
            const SizedBox(width: UuGap.g2),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(title, maxLines: 2, overflow: TextOverflow.ellipsis, style: th.text.body.copyWith(color: c.objectPrimary, fontWeight: UuFontWeight.semibold)),
                const SizedBox(height: UuGap.g0_5),
                Text(content, maxLines: 2, overflow: TextOverflow.ellipsis, style: th.text.body.copyWith(color: c.objectPrimary)),
              ],
            ),
          ),
        ],
      ),
    );
    return Semantics(
      container: true,
      liveRegion: true,
      child: UuPressable(
        surface: UuSurface.onLight,
        overlayColor: c.objectPrimary,
        borderRadius: radius,
        onTap: onTap,
        semanticLabel: onTap == null ? null : title,
        child: card,
      ),
    );
  }
}

class _UuPushSlot {
  _UuPushSlot(this.entry);
  final OverlayEntry entry;
  bool removed = false;
  void remove() {
    if (removed) return;
    removed = true;
    entry.remove();
  }
}

_UuPushSlot? _uuPushCurrent;

/// Vị trí thẻ của [showUuPushNotification]: [top] = app (template `[Screen]PushNotification`) ·
/// [topEnd] = desktop (góc trên phải, cách mép trên và phải 16, rộng 360 `size-90`, không vuốt).
enum UuPushPlacement { top, topEnd }

/// Template `[Screen]PushNotification` (§6.31): thẻ cách đỉnh safe area 8, lề 12 hai bên, trượt xuống từ đỉnh.
/// Tự ẩn sau [duration] (mặc định 5 giây), dừng đếm khi đang chạm / hover · vuốt lên để đóng · bấm thẻ gọi [onTap]
/// rồi đóng. **Một thẻ mỗi lúc** — gọi lần nữa thì thẻ mới thay thẻ cũ. Trả về hàm đóng thẻ.
/// Desktop: [placement] = [UuPushPlacement.topEnd] — góc trên phải cách mép 16, rộng 360; dừng đếm khi hover,
/// rời chuột thì đếm lại; không vuốt.
VoidCallback showUuPushNotification(
  BuildContext context, {
  required String title,
  required String content,
  ImageProvider? image,
  String? imageLabel,
  VoidCallback? onTap,
  Duration duration = const Duration(seconds: 5),
  UuPushPlacement placement = UuPushPlacement.top,
}) {
  final overlay = Overlay.of(context, rootOverlay: true);
  _uuPushCurrent?.remove();
  late final _UuPushSlot slot;
  final hostKey = GlobalKey<_UuPushHostState>();
  slot = _UuPushSlot(OverlayEntry(
    builder: (_) => _UuPushHost(
      key: hostKey,
      duration: duration,
      placement: placement,
      onGone: () {
        slot.remove();
        if (identical(_uuPushCurrent, slot)) _uuPushCurrent = null;
      },
      builder: (dismiss) => UuCardPushNotification(
        title: title,
        content: content,
        image: image,
        imageLabel: imageLabel,
        onTap: () {
          onTap?.call();
          dismiss();
        },
      ),
    ),
  ));
  _uuPushCurrent = slot;
  overlay.insert(slot.entry);
  return () {
    final host = hostKey.currentState;
    if (host != null) {
      host.dismiss();
    } else {
      slot.remove();
    }
  };
}

class _UuPushHost extends StatefulWidget {
  const _UuPushHost({super.key, required this.duration, required this.onGone, required this.builder, this.placement = UuPushPlacement.top});
  final Duration duration;
  final UuPushPlacement placement;
  final VoidCallback onGone;
  final Widget Function(VoidCallback dismiss) builder;
  @override
  State<_UuPushHost> createState() => _UuPushHostState();
}

class _UuPushHostState extends State<_UuPushHost> with SingleTickerProviderStateMixin {
  late final AnimationController _anim = AnimationController(vsync: this, duration: const Duration(milliseconds: 220))..forward();
  Timer? _timer;
  bool _hover = false, _touch = false, _closing = false;
  double _drag = 0;

  @override
  void initState() {
    super.initState();
    _restart();
  }

  void _restart() {
    _timer?.cancel();
    if (_hover || _touch || _closing) return;
    _timer = Timer(widget.duration, dismiss);
  }

  void dismiss() {
    if (_closing) return;
    _closing = true;
    _timer?.cancel();
    if (!mounted) {
      widget.onGone();
      return;
    }
    _anim.reverse().whenComplete(widget.onGone);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final desktop = widget.placement == UuPushPlacement.topEnd;
    final card = Material(type: MaterialType.transparency, child: widget.builder(dismiss));
    return Positioned(
      top: desktop ? UuGap.g4 : MediaQuery.paddingOf(context).top + UuGap.g2,
      left: desktop ? null : UuGap.g3,
      right: desktop ? UuGap.g4 : UuGap.g3,
      width: desktop ? UuSize.s90 : null,
      child: SlideTransition(
        position: Tween(begin: const Offset(0, -1.5), end: Offset.zero).animate(CurvedAnimation(parent: _anim, curve: Curves.easeOut)),
        child: MouseRegion(
          onEnter: (_) { _hover = true; _timer?.cancel(); },
          onExit: (_) { _hover = false; _restart(); },
          child: Listener(
            onPointerDown: (_) { _touch = true; _timer?.cancel(); },
            onPointerUp: (_) { _touch = false; _restart(); },
            onPointerCancel: (_) { _touch = false; _restart(); },
            child: desktop
                ? card
                : GestureDetector(
                    onVerticalDragStart: (_) => _drag = 0,
                    onVerticalDragUpdate: (d) => _drag += d.delta.dy,
                    onVerticalDragEnd: (d) {
                      if (_drag < -UuGap.g4 || (d.primaryVelocity ?? 0) < -200) dismiss();
                    },
                    child: card,
                  ),
          ),
        ),
      ),
    );
  }
}
