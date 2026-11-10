import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'buttons.dart';
import 'icon.dart';
import 'selection.dart';
import 'theme.dart';
import 'tokens.g.dart';

enum UuRequirement { required, optional }

/// `.label` dùng chung cho mọi field: h24, body object-primary, suffix caption, icon tooltip 16.
class UuFieldLabel extends StatelessWidget {
  const UuFieldLabel(this.text, {super.key, this.requirement, this.tooltip, this.error = false, this.disabled = false});
  final String text;
  final UuRequirement? requirement;
  /// Icon `circle-info` 16 là giả định — bản thiết kế chỉ ghi "Icon 16".
  final String? tooltip;
  final bool error;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final color = error ? c.objectNegative : disabled ? c.objectDisabled : c.objectPrimary;
    return SizedBox(
      height: UuTheme.of(context).text.body.fontSize! * UuTheme.of(context).text.body.height!, // = line-height body theo density
      child: Row(
        children: [
          Text(text, style: UuTheme.of(context).text.body.copyWith(color: color)),
          if (requirement != null) ...[
            const SizedBox(width: UuGap.g1),
            Text('∙ ${requirement == UuRequirement.required ? 'Bắt buộc' : 'Không bắt buộc'}', style: UuTheme.of(context).text.caption.copyWith(color: c.objectSecondary)),
          ],
          if (tooltip != null) ...[
            const SizedBox(width: UuGap.g2),
            Tooltip(message: tooltip!, child: UuIcon('circle-info', size: 16, color: c.objectSecondary, semanticLabel: tooltip)),
          ],
        ],
      ),
    );
  }
}

/// Vỏ Field (h48 · radius 16 · border 1px · padding 0/12 · gap 8) với viền theo state và lớp hover object-secondary 5%.
class UuFieldShell extends StatefulWidget {
  const UuFieldShell({super.key, required this.child, this.focused = false, this.error = false, this.disabled = false, this.height, this.padding, this.onTap});
  final Widget child;
  final bool focused;
  final bool error;
  final bool disabled;
  /// null = `field/height` theo density (Touch 48 · Compact 32).
  final double? height;
  /// null = padding ngang `field/padding-x` theo density (Touch 12 · Compact 8).
  final EdgeInsets? padding;
  final VoidCallback? onTap;

  @override
  State<UuFieldShell> createState() => _UuFieldShellState();
}

class _UuFieldShellState extends State<UuFieldShell> {
  bool _hover = false;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final border = widget.error ? c.borderNegative : widget.focused ? c.borderEmphasized : widget.disabled ? c.borderMuted : UuTheme.of(context).restBorder(c.borderMuted);
    final z = UuTheme.of(context).sizes;
    final radius = BorderRadius.circular(z.fieldRadius);
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: GestureDetector(
        onTap: widget.disabled ? null : widget.onTap,
        child: Stack(
          children: [
            Container(
              height: widget.height ?? z.fieldHeight,
              padding: widget.padding ?? EdgeInsets.symmetric(horizontal: z.fieldPaddingX),
              decoration: UuTheme.of(context).outerDecoration(BoxDecoration(
                color: widget.disabled ? c.backgroundDisabled : c.backgroundSurface,
                borderRadius: radius,
                border: Border.all(color: border, width: 1),
              )),
              child: widget.child,
            ),
            Positioned.fill(
              child: IgnorePointer(
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 120),
                  opacity: _hover && !widget.focused && !widget.disabled ? UuOpacity.o5 : 0,
                  child: DecoratedBox(decoration: BoxDecoration(color: c.objectSecondary, borderRadius: radius)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Dòng lỗi caption object-negative (h20). Chiếm chỗ thật, không đè.
class UuFieldError extends StatelessWidget {
  const UuFieldError(this.message, {super.key, this.center = false});
  final String message;
  final bool center;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Semantics(liveRegion: true, child: Text(message, textAlign: center ? TextAlign.center : TextAlign.start, style: UuTheme.of(context).text.caption.copyWith(color: c.objectNegative)));
  }
}

/// Dòng gợi ý (§6.3 `Helper text`): dưới label, trên ô, caption `object-secondary`; Disabled → `object-disabled`. Có lỗi vẫn giữ.
class UuFieldHelper extends StatelessWidget {
  const UuFieldHelper(this.text, {super.key, this.disabled = false});
  final String text;
  final bool disabled;
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Text(text, style: UuTheme.of(context).text.caption.copyWith(color: disabled ? c.objectDisabled : c.objectSecondary));
  }
}

/// TextInput (§6.3). State suy ra từ focus + value. Error đổi ba thứ: viền, nhãn, dòng lỗi.
class UuTextInput extends StatefulWidget {
  const UuTextInput({
    super.key,
    this.controller,
    this.focusNode,
    this.label,
    this.requirement,
    this.tooltip,
    this.placeholder,
    this.prefixIcon,
    this.prefixLabel,
    this.actionLabel,
    this.onAction,
    this.error = false,
    this.errorMessage,
    this.helperText,
    this.disabled = false,
    this.keyboardType,
    this.inputFormatters,
    this.onChanged,
    this.obscureText = false,
  });

  final TextEditingController? controller;
  final FocusNode? focusNode;
  final String? label;
  final UuRequirement? requirement;
  final String? tooltip;
  final String? placeholder;
  /// Thiết kế: `Prefix`: Type=Icon (24) hoặc Type=Label.
  final String? prefixIcon;
  final String? prefixLabel;
  /// Thiết kế: `Action`: TextButtonNeutral Ghost Small trong suffix (Ghost là giả định).
  final String? actionLabel;
  final VoidCallback? onAction;
  final bool error;
  final String? errorMessage;
  /// Thiết kế: `Helper text` — dòng gợi ý dưới label, trên ô. Có lỗi vẫn hiện; dòng lỗi nằm dưới ô.
  final String? helperText;
  final bool disabled;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final ValueChanged<String>? onChanged;
  final bool obscureText;

  @override
  State<UuTextInput> createState() => _UuTextInputState();
}

class _UuTextInputState extends State<UuTextInput> {
  late final FocusNode _focus = widget.focusNode ?? FocusNode();
  @override
  void initState() { super.initState(); _focus.addListener(_rebuild); }
  void _rebuild() => setState(() {});
  @override
  void dispose() { _focus.removeListener(_rebuild); if (widget.focusNode == null) _focus.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          UuFieldLabel(widget.label!, requirement: widget.requirement, tooltip: widget.tooltip, error: widget.error, disabled: widget.disabled),
          const SizedBox(height: UuGap.g1),
        ],
        if (widget.helperText != null) ...[UuFieldHelper(widget.helperText!, disabled: widget.disabled), const SizedBox(height: UuGap.g1)],
        UuFieldShell(
          focused: _focus.hasFocus,
          error: widget.error,
          disabled: widget.disabled,
          onTap: () => _focus.requestFocus(),
          child: Row(
            children: [
              if (widget.prefixIcon != null) ...[UuIcon(widget.prefixIcon!, size: UuTheme.of(context).sizes.fieldIcon, color: c.objectSecondary), const SizedBox(width: UuGap.g2)],
              if (widget.prefixLabel != null) ...[Text(widget.prefixLabel!, style: UuTheme.of(context).text.body.copyWith(color: c.objectPrimary)), const SizedBox(width: UuGap.g2)],
              Expanded(
                child: TextField(
                  controller: widget.controller,
                  focusNode: _focus,
                  enabled: !widget.disabled,
                  keyboardType: widget.keyboardType,
                  inputFormatters: widget.inputFormatters,
                  onChanged: widget.onChanged,
                  obscureText: widget.obscureText,
                  cursorColor: c.objectAccent,
                  cursorWidth: 1.5,
                  cursorHeight: 24,
                  style: UuTheme.of(context).text.body.copyWith(color: c.objectPrimary), // Filled+Disabled giữ object-primary — cố ý
                  decoration: InputDecoration.collapsed(
                    hintText: widget.placeholder,
                    hintStyle: UuTheme.of(context).text.body.copyWith(color: widget.disabled ? c.objectDisabled : c.objectSecondary),
                  ),
                ),
              ),
              if (widget.actionLabel != null) ...[
                const SizedBox(width: UuGap.g2),
                // suffix: vạch ngăn trái 1px border-muted + padding-left 8 + TextButtonNeutral Ghost Small
                Container(
                  padding: const EdgeInsets.only(left: UuGap.g2),
                  decoration: BoxDecoration(border: Border(left: BorderSide(color: c.borderMuted))),
                  child: UuTextButton(label: widget.actionLabel!, tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small, onPressed: widget.onAction),
                ),
              ],
            ],
          ),
        ),
        if (widget.error && widget.errorMessage != null) ...[const SizedBox(height: UuGap.g1), UuFieldError(widget.errorMessage!)],
      ],
    );
  }
}

/// SearchInput (§6.3g): dùng chung khung Field, icon `magnifier` 24 cố định bên trái,
/// nút xoá `circle-xmark` 16 bên phải khi ô có chữ. 8 variant, không có Error.
/// [loading] (`State=Loading`, khi ô có chữ): `.loading` 16 thay chỗ nút xoá, viền như Typing.
/// [cancel] (mobile, chỉ ở màn tìm kiếm riêng): Field co lại trong hàng gap 8, `TextButtonNeutral` Ghost Small "Huỷ"
/// bên phải — bấm thì xoá chữ, bỏ focus, gọi [onCancel] (màn đóng panel gợi ý).
/// Panel gợi ý / lịch sử: truyền [recent] hoặc [suggestions], ô tự neo [UuSearchSuggestions] dưới mình qua
/// [UuMenuAnchor] (cách 4, cùng bề rộng): mở khi focus / gõ, đóng khi chọn một hàng, bấm ra ngoài, Esc, Huỷ.
class UuSearchInput extends StatefulWidget {
  const UuSearchInput({
    super.key,
    this.controller,
    this.focusNode,
    this.label,
    this.placeholder = 'Tìm kiếm',
    this.disabled = false,
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.clearLabel = 'Xoá từ khoá',
    this.loading = false,
    this.cancel = false,
    this.cancelLabel = 'Huỷ',
    this.onCancel,
    this.recent,
    this.suggestions,
    this.onSelectSuggestion,
    this.onRemoveRecent,
    this.onClearRecent,
  });

  final TextEditingController? controller;
  final FocusNode? focusNode;
  final String? label;
  final String placeholder;
  final bool disabled;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onClear;
  final String clearLabel;
  /// `State=Loading`: đang chờ gợi ý. Chỉ hiện khi ô có chữ.
  final bool loading;
  /// Thiết kế: BOOLEAN `Cancel`.
  final bool cancel;
  final String cancelLabel;
  final VoidCallback? onCancel;
  /// Nhóm "Tìm gần đây" — hiện khi ô rỗng và đang focus.
  final List<String>? recent;
  /// Nhóm "Gợi ý" — hiện khi đang gõ và không [loading].
  final List<String>? suggestions;
  /// Bấm một hàng (lịch sử hoặc gợi ý). Panel đóng.
  final ValueChanged<String>? onSelectSuggestion;
  /// Nút `xmark` cuối hàng "Tìm gần đây": xoá đúng mục đó, panel vẫn mở, focus về ô.
  final ValueChanged<String>? onRemoveRecent;
  /// Nút "Xoá" của nhóm "Tìm gần đây".
  final VoidCallback? onClearRecent;

  @override
  State<UuSearchInput> createState() => _UuSearchInputState();
}

class _UuSearchInputState extends State<UuSearchInput> {
  late final FocusNode _focus = widget.focusNode ?? FocusNode();
  late final TextEditingController _ctrl = widget.controller ?? TextEditingController();
  bool _panelOpen = false;
  bool _hadFocus = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(_rebuild);
    _ctrl.addListener(_rebuild);
  }

  void _rebuild() => setState(() {
        // Panel mở lại khi ô vừa nhận focus.
        if (_focus.hasFocus && !_hadFocus) _panelOpen = true;
        _hadFocus = _focus.hasFocus;
      });

  @override
  void dispose() {
    _focus.removeListener(_rebuild);
    _ctrl.removeListener(_rebuild);
    if (widget.focusNode == null) _focus.dispose();
    if (widget.controller == null) _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final filled = _ctrl.text.isNotEmpty;
    final loading = widget.loading && filled && !widget.disabled;
    final field = UuFieldShell(
      focused: _focus.hasFocus || loading,
      disabled: widget.disabled,
      onTap: () => _focus.requestFocus(),
      child: Row(
        children: [
          // Disabled xuống object-disabled — cùng luật với calendar-days của DateInput.
          UuIcon('magnifier', size: UuTheme.of(context).sizes.fieldIcon, color: widget.disabled ? c.objectDisabled : c.objectSecondary),
          const SizedBox(width: UuGap.g2),
          Expanded(
            child: TextField(
              controller: _ctrl,
              focusNode: _focus,
              enabled: !widget.disabled,
              textInputAction: TextInputAction.search,
              onChanged: (v) {
                setState(() => _panelOpen = true);
                widget.onChanged?.call(v);
              },
              onSubmitted: widget.onSubmitted,
              cursorColor: c.objectAccent,
              cursorWidth: 1.5,
              cursorHeight: 24,
              style: UuTheme.of(context).text.body.copyWith(color: c.objectPrimary),
              decoration: InputDecoration.collapsed(
                hintText: widget.placeholder,
                hintStyle: UuTheme.of(context).text.body.copyWith(color: widget.disabled ? c.objectDisabled : c.objectSecondary),
              ),
            ),
          ),
          if (loading) ...[
            const SizedBox(width: UuGap.g2),
            // Cùng ô 32 với nút xoá để chữ không nhảy khi đổi qua lại.
            SizedBox(width: UuSize.s8, height: UuSize.s8, child: Center(child: UuSpinner(size: UuSize.s4, color: c.objectSecondary))),
          ] else if (filled && !widget.disabled) ...[
            const SizedBox(width: UuGap.g2),
            // Icon vẽ 16 như bản vẽ, vùng chạm 32 cho đủ ngưỡng chạm.
            Semantics(
              button: true,
              label: widget.clearLabel,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: _clear,
                child: SizedBox(
                  width: UuSize.s8,
                  height: UuSize.s8,
                  child: Center(child: UuIcon('circle-xmark', size: 16, color: c.objectSecondary)),
                ),
              ),
            ),
          ],
        ],
      ),
    );
    final hasPanel = widget.recent != null || widget.suggestions != null;
    final hasContent = !loading &&
        UuSearchSuggestions.hasContent(query: _ctrl.text, recent: widget.recent ?? const [], suggestions: widget.suggestions ?? const []);
    final anchored = hasPanel
        ? UuMenuAnchor(
            open: _panelOpen && hasContent && !widget.disabled,
            onClose: () => setState(() => _panelOpen = false),
            menu: UuSearchSuggestions(
              query: _ctrl.text,
              recent: widget.recent ?? const [],
              suggestions: widget.suggestions ?? const [],
              inputFocusNode: _focus,
              onSelect: (v) {
                setState(() => _panelOpen = false);
                widget.onSelectSuggestion?.call(v);
              },
              onRemoveRecent: widget.onRemoveRecent,
              onClearRecent: widget.onClearRecent,
            ),
            child: field,
          )
        : field;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          UuFieldLabel(widget.label!, disabled: widget.disabled),
          const SizedBox(height: UuGap.g1),
        ],
        if (widget.cancel)
          Row(children: [
            Expanded(child: anchored),
            const SizedBox(width: UuGap.g2),
            UuTextButton(
              label: widget.cancelLabel,
              tone: UuButtonTone.neutral,
              type: UuButtonType.ghost,
              size: UuButtonSize.small,
              onPressed: widget.disabled ? null : _cancel,
            ),
          ])
        else
          anchored,
      ],
    );
  }

  void _clear() {
    _ctrl.clear();
    widget.onChanged?.call('');
    widget.onClear?.call();
  }

  void _cancel() {
    _panelOpen = false;
    if (_ctrl.text.isNotEmpty) _clear();
    _focus.unfocus();
    widget.onCancel?.call();
  }
}

/// Panel gợi ý / lịch sử của [UuSearchInput] (§6.3g) — là `Menu` `Platform=Panel` (§6.21). Màn đặt ngay dưới ô,
/// cách 4, cùng bề rộng. Nội dung theo từ khoá [query]:
/// - rỗng → chỉ nhóm "Tìm gần đây" ([recent], icon `clock`, nút "Xoá" Ghost Small gọi [onClearRecent]; mỗi hàng có
///   `IconButtonNeutral` Ghost Small `xmark` "Xoá “{từ khoá}”" gọi [onRemoveRecent] — panel vẫn mở, focus về
///   [inputFocusNode]; xoá hết thì nhóm biến mất; nút không kích hoạt hàng);
/// - đang gõ → nhóm "Gợi ý" ([suggestions], icon `magnifier`, phần trùng từ khoá in 600). Đang chờ gợi ý thì
///   bật `loading` ở ô, không phải ở panel.
/// Không có gì để hiện → widget rỗng (không mở panel). [flat]: màn tìm kiếm toàn màn trên mobile — danh sách
/// phủ dưới ô, không bo, không bóng (không phải Sheet).
class UuSearchSuggestions extends StatelessWidget {
  const UuSearchSuggestions({
    super.key,
    required this.query,
    this.recent = const [],
    this.suggestions = const [],
    this.onSelect,
    this.onClearRecent,
    this.onRemoveRecent,
    this.inputFocusNode,
    this.flat = false,
    this.recentTitle = 'Tìm gần đây',
    this.suggestionsTitle = 'Gợi ý',
    this.clearRecentLabel = 'Xoá',
  });

  final String query;
  final List<String> recent;
  final List<String> suggestions;
  final ValueChanged<String>? onSelect;
  final VoidCallback? onClearRecent;
  /// Xoá một mục "Tìm gần đây". Không có thì không hiện nút `xmark`.
  final ValueChanged<String>? onRemoveRecent;
  /// Focus của ô tìm kiếm — xoá xong một mục / xoá hết thì focus về đây.
  final FocusNode? inputFocusNode;
  final bool flat;
  final String recentTitle;
  final String suggestionsTitle;
  final String clearRecentLabel;

  /// Panel có mở không — màn dùng để quyết định có dựng overlay hay không.
  static bool hasContent({required String query, List<String> recent = const [], List<String> suggestions = const []}) =>
      query.trim().isEmpty ? recent.isNotEmpty : suggestions.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    if (!hasContent(query: query, recent: recent, suggestions: suggestions)) return const SizedBox.shrink();
    final typing = query.trim().isNotEmpty;
    final items = typing ? suggestions : recent;
    return UuMenuPanel(
      flat: flat,
      children: [
        UuMenuSection(
          title: typing ? suggestionsTitle : recentTitle,
          trailing: !typing && onClearRecent != null
              ? UuTextButton(label: clearRecentLabel, tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small, onPressed: () {
                  onClearRecent!();
                  inputFocusNode?.requestFocus();
                })
              : null,
        ),
        for (final it in items)
          UuMenuItem(
            label: it,
            icon: typing ? 'magnifier' : 'clock',
            highlight: typing ? query : null,
            trailing: !typing && onRemoveRecent != null
                ? UuIconButton(
                    icon: 'xmark',
                    label: 'Xoá “$it”',
                    tone: UuButtonTone.neutral,
                    type: UuButtonType.ghost,
                    size: UuButtonSize.small,
                    onPressed: () {
                      onRemoveRecent!(it);
                      inputFocusNode?.requestFocus();
                    },
                  )
                : null,
            onTap: () => onSelect?.call(it),
          ),
      ],
    );
  }
}

/// TextArea (§6.3e): Field VERTICAL cao 112, padding 12, chữ bám mép trên, bộ đếm (n/max) caption góc phải dưới.
class UuTextArea extends StatefulWidget {
  const UuTextArea({super.key, this.controller, this.focusNode, this.label, this.requirement, this.tooltip, this.placeholder, this.maxLength = 100, this.error = false, this.errorMessage, this.helperText, this.disabled = false, this.onChanged});
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final String? label;
  final UuRequirement? requirement;
  final String? tooltip;
  final String? placeholder;
  final int maxLength;
  final bool error;
  final String? errorMessage;
  /// Thiết kế: `Helper text` — dòng gợi ý dưới label, trên ô. Có lỗi vẫn hiện; dòng lỗi nằm dưới ô.
  final String? helperText;
  final bool disabled;
  final ValueChanged<String>? onChanged;

  @override
  State<UuTextArea> createState() => _UuTextAreaState();
}

class _UuTextAreaState extends State<UuTextArea> {
  late final FocusNode _focus = widget.focusNode ?? FocusNode();
  late final TextEditingController _ctrl = widget.controller ?? TextEditingController();
  @override
  void initState() { super.initState(); _focus.addListener(_rebuild); _ctrl.addListener(_rebuild); }
  void _rebuild() => setState(() {});
  @override
  void dispose() { _focus.removeListener(_rebuild); _ctrl.removeListener(_rebuild); if (widget.focusNode == null) _focus.dispose(); if (widget.controller == null) _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          UuFieldLabel(widget.label!, requirement: widget.requirement, tooltip: widget.tooltip, error: widget.error, disabled: widget.disabled),
          const SizedBox(height: UuGap.g1),
        ],
        if (widget.helperText != null) ...[UuFieldHelper(widget.helperText!, disabled: widget.disabled), const SizedBox(height: UuGap.g1)],
        UuFieldShell(
          focused: _focus.hasFocus,
          error: widget.error,
          disabled: widget.disabled,
          height: UuSize.s28,
          padding: EdgeInsets.symmetric(vertical: UuGap.g3, horizontal: UuTheme.of(context).sizes.fieldPaddingX),
          onTap: () => _focus.requestFocus(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: TextField(
                  controller: _ctrl,
                  focusNode: _focus,
                  enabled: !widget.disabled,
                  maxLines: null,
                  expands: true,
                  maxLength: widget.maxLength,
                  onChanged: widget.onChanged,
                  cursorColor: c.objectAccent,
                  cursorWidth: 1.5,
                  cursorHeight: 24,
                  textAlignVertical: TextAlignVertical.top,
                  style: UuTheme.of(context).text.body.copyWith(color: c.objectPrimary),
                  decoration: InputDecoration.collapsed(
                    hintText: widget.placeholder,
                    hintStyle: UuTheme.of(context).text.body.copyWith(color: widget.disabled ? c.objectDisabled : c.objectSecondary),
                  ).copyWith(counterText: ''),
                ),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: Text('(${_ctrl.text.characters.length}/${widget.maxLength})', style: UuTheme.of(context).text.caption.copyWith(color: widget.disabled ? c.objectDisabled : c.objectSecondary)),
              ),
            ],
          ),
        ),
        if (widget.error && widget.errorMessage != null) ...[const SizedBox(height: UuGap.g1), UuFieldError(widget.errorMessage!)],
      ],
    );
  }
}

/// OTPInput (§6.3b): 6 ô 48 gap 8, ô rỗng "-", con trỏ 2×24 object-accent, Masked → chấm 8,
/// Error → cả 6 ô viền đỏ, chữ ở lại, dòng lỗi căn giữa.
class UuOTPInput extends StatefulWidget {
  const UuOTPInput({super.key, required this.value, required this.onChanged, this.length = 6, this.masked = false, this.error = false, this.errorMessage, this.disabled = false, this.onCompleted, this.autofocus = false});
  final String value;
  final ValueChanged<String> onChanged;
  final int length;
  final bool masked;
  final bool error;
  final String? errorMessage;
  final bool disabled;
  final ValueChanged<String>? onCompleted;
  final bool autofocus;

  @override
  State<UuOTPInput> createState() => _UuOTPInputState();
}

class _UuOTPInputState extends State<UuOTPInput> with SingleTickerProviderStateMixin {
  final _focus = FocusNode();
  late final _ctrl = TextEditingController(text: widget.value);
  late final _blink = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat();

  @override
  void initState() { super.initState(); _focus.addListener(() => setState(() {})); }
  @override
  void didUpdateWidget(UuOTPInput old) {
    super.didUpdateWidget(old);
    if (widget.value != _ctrl.text) _ctrl.value = TextEditingValue(text: widget.value, selection: TextSelection.collapsed(offset: widget.value.length));
  }
  @override
  void dispose() { _focus.dispose(); _ctrl.dispose(); _blink.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final digits = widget.value.replaceAll(RegExp(r'\D'), '');
    final caretIndex = digits.length.clamp(0, widget.length - 1);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Stack(
          children: [
            Row(
              children: [
                for (var i = 0; i < widget.length; i++) ...[
                  if (i > 0) const SizedBox(width: UuGap.g2),
                  Flexible(
                    child: _Cell(
                      ch: i < digits.length ? digits[i] : null,
                      masked: widget.masked,
                      focused: _focus.hasFocus && !widget.error && i == caretIndex && digits.length < widget.length,
                      error: widget.error,
                      disabled: widget.disabled,
                      blink: _blink,
                      colors: c,
                    ),
                  ),
                ],
              ],
            ),
            // TextField thật, trong suốt, phủ lên cụm ô để nhận bàn phím số
            Positioned.fill(
              child: Opacity(
                opacity: 0,
                child: TextField(
                  controller: _ctrl,
                  focusNode: _focus,
                  autofocus: widget.autofocus,
                  enabled: !widget.disabled,
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(widget.length)],
                  autofillHints: const [AutofillHints.oneTimeCode],
                  showCursor: false,
                  onChanged: (v) { widget.onChanged(v); if (v.length == widget.length) widget.onCompleted?.call(v); },
                ),
              ),
            ),
          ],
        ),
        if (widget.error && widget.errorMessage != null) ...[const SizedBox(height: UuGap.g1), UuFieldError(widget.errorMessage!, center: true)],
      ],
    );
  }
}

class _Cell extends StatelessWidget {
  const _Cell({required this.ch, required this.masked, required this.focused, required this.error, required this.disabled, required this.blink, required this.colors});
  final String? ch;
  final bool masked, focused, error, disabled;
  final Animation<double> blink;
  final UuSemanticColors colors;
  @override
  Widget build(BuildContext context) {
    final c = colors;
    final border = error ? c.borderNegative : focused ? c.borderEmphasized : disabled ? c.borderMuted : UuTheme.of(context).restBorder(c.borderMuted);
    return Container(
      constraints: BoxConstraints(minWidth: UuTheme.of(context).sizes.fieldOtpMinWidth, maxWidth: UuTheme.of(context).sizes.fieldHeight),
      height: UuTheme.of(context).sizes.fieldHeight,
      decoration: UuTheme.of(context).outerDecoration(BoxDecoration(color: disabled ? c.backgroundDisabled : c.backgroundSurface, borderRadius: BorderRadius.circular(UuTheme.of(context).sizes.fieldRadius), border: Border.all(color: border))),
      child: Stack(
        alignment: Alignment.center,
        children: [
          if (ch == null)
            Text('-', style: UuTheme.of(context).text.body.copyWith(color: disabled ? c.objectDisabled : c.objectSecondary))
          else if (masked)
            Container(width: UuSize.s2, height: UuSize.s2, decoration: BoxDecoration(color: c.objectPrimary, shape: BoxShape.circle))
          else
            Text(ch!, style: UuTheme.of(context).text.body.copyWith(color: c.objectPrimary)),
          if (focused)
            Positioned(
              left: UuGap.g3,
              child: FadeTransition(
                opacity: blink.drive(TweenSequence([TweenSequenceItem(tween: ConstantTween(1.0), weight: 1), TweenSequenceItem(tween: ConstantTween(0.0), weight: 1)])),
                child: Container(width: 2, height: UuSize.s6, color: c.objectAccent),
              ),
            ),
        ],
      ),
    );
  }
}

/// DateInput (§6.3c): ô "chọn" ngày — chạm mở date picker của nền tảng, không gõ tay.
/// 8 variant: Value Empty/Filled × State Default/Hover × Error × Disabled. Giá trị hiển thị `DD/MM/YYYY`, style body 400.
class UuDateInput extends StatelessWidget {
  const UuDateInput({super.key, this.label, this.value, this.placeholder = 'Bấm để chọn', this.onChanged, this.firstDate, this.lastDate, this.error = false, this.errorMessage, this.disabled = false});
  final String? label;
  final DateTime? value;
  final String placeholder;
  final ValueChanged<DateTime>? onChanged;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final bool error;
  final String? errorMessage;
  final bool disabled;

  static String formatVN(DateTime d) => '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final filled = value != null;
    return _SelectField(
      label: label,
      disabled: disabled,
      error: error,
      errorMessage: errorMessage,
      text: filled ? formatVN(value!) : placeholder,
      filled: filled,
      filledStyle: UuTheme.of(context).text.body, // DateInput giữ body 400, khác Dropdown
      icon: UuIcon('calendar-days', size: UuTheme.of(context).sizes.fieldIcon),
      onTap: () async {
        final picked = await showDatePicker(context: context, initialDate: value ?? DateTime.now(), firstDate: firstDate ?? DateTime(1900), lastDate: lastDate ?? DateTime(2100));
        if (picked != null) onChanged?.call(picked);
      },
      colors: c,
    );
  }
}

/// Dropdown (§6.4): ô "chọn" với chevron-down 16. 8 variant: Value × State Default/Hover × Error × Disabled.
/// Danh sách option bung ra là `UuMenu` (§6.21): truyền [menu] + [open] để ô tự neo panel dưới mình
/// ([UuMenuAnchor] — cách 4, rộng bằng ô, lật lên khi thiếu chỗ), hoặc mở sheet rồi trả value.
class UuDropdown extends StatelessWidget {
  const UuDropdown({super.key, this.label, this.value, this.placeholder = 'Bấm để chọn', this.onOpen, this.menu, this.open = false, this.onClose, this.error = false, this.errorMessage, this.disabled = false});
  final String? label;
  final String? value;
  final String placeholder;
  final VoidCallback? onOpen;
  /// Panel `UuMenu` neo dưới ô khi [open].
  final Widget? menu;
  final bool open;
  /// Đóng panel: chọn xong (`Type=Single`), bấm ra ngoài, Esc.
  final VoidCallback? onClose;
  final bool error;
  final String? errorMessage;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final filled = value != null && value!.isNotEmpty;
    return _SelectField(label: label, disabled: disabled, error: error, errorMessage: errorMessage, text: filled ? value! : placeholder, filled: filled, filledStyle: UuTheme.of(context).text.label, icon: const UuIcon('chevron-down', size: 16), onTap: onOpen, colors: c,
        wrapField: menu == null ? null : (field) => UuMenuAnchor(open: open && !disabled, onClose: onClose, menu: menu!, child: field));
  }
}

class _SelectField extends StatelessWidget {
  const _SelectField({required this.label, required this.disabled, required this.error, required this.errorMessage, required this.text, required this.filled, required this.filledStyle, required this.icon, required this.onTap, required this.colors, this.wrapField});
  final String? label;
  final bool disabled, error, filled;
  final String? errorMessage;
  final String text;
  final TextStyle filledStyle;
  final Widget icon;
  final VoidCallback? onTap;
  final UuSemanticColors colors;
  /// Bọc riêng phần Field (không gồm nhãn, dòng lỗi) — để neo panel `Menu` ngay dưới ô.
  final Widget Function(Widget field)? wrapField;
  @override
  Widget build(BuildContext context) {
    final c = colors;
    final textColor = filled ? c.objectPrimary : disabled ? c.objectDisabled : c.objectSecondary;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[UuFieldLabel(label!, error: error, disabled: disabled), const SizedBox(height: UuGap.g1)],
        (wrapField ?? (Widget f) => f)(Semantics(
          button: true,
          label: label,
          value: text,
          enabled: !disabled,
          child: UuFieldShell(
            disabled: disabled,
            error: error,
            onTap: onTap,
            child: Row(
              children: [
                Expanded(
                  child: Text(text, maxLines: 1, overflow: TextOverflow.ellipsis,
                      // gợi ý rỗng: body 400 secondary · giá trị: filledStyle (Dropdown label 600 · DateInput body 400)
                      style: (filled ? filledStyle : UuTheme.of(context).text.body).copyWith(color: textColor)),
                ),
                const SizedBox(width: UuGap.g2),
                IconTheme(data: IconThemeData(color: disabled ? c.objectDisabled : c.objectSecondary), child: icon),
              ],
            ),
          ),
        )),
        if (error && errorMessage != null) ...[const SizedBox(height: UuGap.g1), UuFieldError(errorMessage!)],
      ],
    );
  }
}
