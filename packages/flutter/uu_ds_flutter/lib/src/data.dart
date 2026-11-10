import 'package:flutter/material.dart';
import 'buttons.dart';
import 'feedback.dart';
import 'fields.dart';
import 'icon.dart';
import 'selection.dart';
import 'state_layer.dart';
import 'theme.dart';
import 'tokens.g.dart';

// ---------------------------------------------------------------------------
// Bảng (§6.23): TableHeaderCell · TableCell. Hàng / bảng chỉ là ghép ô, không thêm hình học.
// ---------------------------------------------------------------------------

/// `Sort` của [UuTableHeaderCell]: `off` = cột không sắp được · `unsorted` = sắp được, chưa sắp.
enum UuTableSort { off, unsorted, ascending, descending }

/// `Align` của [UuTableHeaderCell]. `right` cho cột số (icon đứng trước nhãn, cả hai dồn phải).
enum UuTableAlign { left, right }

/// `Type` của [UuTableHeaderCell]. `checkbox` = ô "chọn tất cả" đầu cột chọn hàng.
enum UuTableHeaderCellType { normal, checkbox }

/// `Type` của [UuTableCell].
enum UuTableCellType { text, number, secondary, actions, checkbox, status }

/// `State` của [UuTableCell]. Chỉ để ép trạng thái (Widgetbook); trong bảng thật [UuTableRow] tự quyết cho cả hàng.
enum UuTableCellState { normal, hover, selected }

const _tabular = [FontFeature.tabularFigures()];

/// Viền dưới 1px `border-muted` — bảng chỉ kẻ ngang, không viền ngoài, không kẻ dọc.
BoxDecoration _cellDecoration(UuSemanticColors c, {Color? background}) =>
    BoxDecoration(color: background, border: Border(bottom: BorderSide(color: c.borderMuted)));

/// TableHeaderCell (§6.23): cao `table/header-height` (48 · Compact 32), padding ngang `table/cell-padding-x`,
/// gap 4, nhãn `title-sm`. Bấm được khi `sort != off` và có [onSort]. 21 variant.
/// `type: checkbox` — ô "chọn tất cả" rộng 64: không nhãn, không sắp xếp, không state layer riêng (state nằm ở checkbox).
class UuTableHeaderCell extends StatelessWidget {
  const UuTableHeaderCell({
    super.key,
    this.label = '',
    this.sort = UuTableSort.off,
    this.align = UuTableAlign.left,
    this.onSort,
    this.type = UuTableHeaderCellType.normal,
    this.checked = false,
    this.onCheckedChanged,
  });
  final String label;
  final UuTableSort sort;
  final UuTableAlign align;
  final VoidCallback? onSort;
  /// Thiết kế: `Type`.
  final UuTableHeaderCellType type;
  /// `checkbox`: `true` khi mọi hàng **của trang đang xem** đã chọn, `null` (Indeterminate) khi một phần, `false` khi chưa chọn.
  final bool? checked;
  /// `checkbox`: `true` = chọn cả trang, `false` = bỏ cả trang. Indeterminate bấm thì thành `true`.
  final ValueChanged<bool>? onCheckedChanged;

  /// Giá trị ô "chọn tất cả" từ số hàng đã chọn trên trang: đủ → `true`, một phần → `null`, không → `false`.
  static bool? checkedFor(int selected, int total) => selected == 0 ? false : selected >= total ? true : null;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    if (type == UuTableHeaderCellType.checkbox) {
      return Container(
        height: z.tableHeaderHeight,
        width: UuTableCell.checkboxWidth,
        padding: EdgeInsets.symmetric(horizontal: z.tableCellPaddingX),
        alignment: Alignment.centerLeft,
        decoration: _cellDecoration(c),
        child: UuCheckbox(checked: checked, onChanged: onCheckedChanged, semanticLabel: 'Chọn tất cả hàng'),
      );
    }
    final sorted = sort == UuTableSort.ascending || sort == UuTableSort.descending;
    final fg = sorted ? c.objectPrimary : c.objectSecondary;
    final icon = switch (sort) {
      UuTableSort.off => null,
      UuTableSort.unsorted => UuIcon('sort-vertical', size: UuSize.s4, color: c.objectSecondary),
      UuTableSort.ascending => UuIcon('arrow-up', size: UuSize.s4, color: c.objectPrimary),
      UuTableSort.descending => UuIcon('arrow-down', size: UuSize.s4, color: c.objectPrimary),
    };
    final text = Flexible(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.titleSm.copyWith(color: fg)));
    final right = align == UuTableAlign.right;
    final cell = Container(
      height: z.tableHeaderHeight,
      padding: EdgeInsets.symmetric(horizontal: z.tableCellPaddingX),
      decoration: _cellDecoration(c),
      child: Row(
        mainAxisAlignment: right ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (right && icon != null) ...[icon, const SizedBox(width: UuGap.g1)],
          text,
          if (!right && icon != null) ...[const SizedBox(width: UuGap.g1), icon],
        ],
      ),
    );
    final sortValue = switch (sort) { UuTableSort.ascending => 'tăng dần', UuTableSort.descending => 'giảm dần', _ => null };
    if (sort == UuTableSort.off || onSort == null) {
      return Semantics(header: true, label: label, value: sortValue, excludeSemantics: true, child: cell);
    }
    return Semantics(
      header: true,
      value: sortValue,
      child: UuPressable(surface: UuSurface.onLight, overlayColor: c.objectPrimary, onTap: onSort, semanticLabel: label, child: cell),
    );
  }
}

/// Trạng thái của hàng truyền xuống mọi ô — hover / chọn là trạng thái của **cả hàng**.
class _UuTableRowScope extends InheritedWidget {
  const _UuTableRowScope({required this.selected, required this.hover, required super.child});
  final bool selected;
  final bool hover;
  static _UuTableRowScope? maybeOf(BuildContext context) => context.dependOnInheritedWidgetOfExactType<_UuTableRowScope>();
  @override
  bool updateShouldNotify(_UuTableRowScope old) => old.selected != selected || old.hover != hover;
}

/// TableCell (§6.23): cao `table/row-height` (56 · Compact 40), padding ngang `table/cell-padding-x`, gap 8.
/// `text` body · `secondary` caption · `number` body căn phải tabular-nums ·
/// `actions` TextButtonAccent Ghost Small + IconButtonNeutral Ghost Small "⋯" · `checkbox` ô chọn hàng rộng 64 ·
/// `status` StatusIndicator căn trái ([content] là chữ trạng thái, ô không thêm chữ). 18 variant.
class UuTableCell extends StatelessWidget {
  const UuTableCell({
    super.key,
    this.content = '',
    this.type = UuTableCellType.text,
    this.state = UuTableCellState.normal,
    this.actionLabel,
    this.onAction,
    this.moreLabel = 'Thêm hành động',
    this.onMore,
    this.checked = false,
    this.onCheckedChanged,
    this.statusTone = UuTone.neutral,
    this.statusFilled = false,
  });

  final String content;
  final UuTableCellType type;
  final UuTableCellState state;
  /// `Actions`: nhãn nút Ghost (prop `TextButton`); null = ẩn nút.
  final String? actionLabel;
  final VoidCallback? onAction;
  /// `Actions`: nút "⋯" (prop `IconButton`) hiện khi có [onMore] — mở `UuMenu`.
  final String moreLabel;
  final VoidCallback? onMore;
  /// `Checkbox`.
  final bool? checked;
  final ValueChanged<bool>? onCheckedChanged;
  /// `Status`: `Tone` của [UuStatusIndicator].
  final UuTone statusTone;
  /// `Status`: `Container=Filled`.
  final bool statusFilled;

  /// Ô `Checkbox` rộng cố định 64 (`size-16`).
  static const checkboxWidth = UuSize.s16;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final row = _UuTableRowScope.maybeOf(context);
    final selected = state == UuTableCellState.selected || (row?.selected ?? false);
    final hover = state == UuTableCellState.hover || (row?.hover ?? false);

    final Widget body = switch (type) {
      UuTableCellType.text => Text(content, maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.body.copyWith(color: c.objectPrimary)),
      UuTableCellType.secondary => Text(content, maxLines: 1, overflow: TextOverflow.ellipsis, style: th.text.caption.copyWith(color: c.objectSecondary)),
      UuTableCellType.number => Text(content, maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.right,
          style: th.text.body.copyWith(color: c.objectPrimary, fontFeatures: _tabular)),
      UuTableCellType.actions => Row(mainAxisSize: MainAxisSize.min, children: [
          if (actionLabel != null) UuTextButton(label: actionLabel!, type: UuButtonType.ghost, size: UuButtonSize.small, onPressed: onAction),
          if (actionLabel != null && onMore != null) const SizedBox(width: UuGap.g2),
          if (onMore != null) UuIconButton(icon: 'dots', label: moreLabel, tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small, onPressed: onMore),
        ]),
      UuTableCellType.checkbox => UuCheckbox(checked: checked, onChanged: onCheckedChanged, semanticLabel: content.isEmpty ? 'Chọn hàng' : content),
      UuTableCellType.status => UuStatusIndicator(label: content, tone: statusTone, filled: statusFilled),
    };

    Widget cell = Container(
      height: z.tableRowHeight,
      width: type == UuTableCellType.checkbox ? checkboxWidth : null,
      padding: EdgeInsets.symmetric(horizontal: z.tableCellPaddingX),
      alignment: type == UuTableCellType.number ? Alignment.centerRight : Alignment.centerLeft,
      decoration: _cellDecoration(c, background: selected ? c.backgroundInteractiveMuted : null),
      child: body,
    );
    // Hover tĩnh của ô / hàng không bấm được: state layer object-primary · opacity-5 phủ cả ô.
    // Hàng có onTap thì UuPressable của [UuTableRow] vẽ lớp này (kèm pressed) — ô không vẽ thêm.
    if (hover) {
      cell = Stack(children: [
        cell,
        Positioned.fill(child: IgnorePointer(child: ColoredBox(color: c.objectPrimary.withValues(alpha: UuSurface.onLight.hover)))),
      ]);
    }
    return cell;
  }
}

/// Cột của [UuTable]: tiêu đề + cách chia bề rộng. [width] cố định (vd. cột checkbox = [UuTableCell.checkboxWidth]),
/// không có thì chia phần còn lại theo [flex].
/// Cột chọn hàng: `type: UuTableHeaderCellType.checkbox` + [checked] / [onCheckedChanged] (ô "chọn tất cả"), rộng 64.
class UuTableColumn {
  const UuTableColumn({
    this.label = '',
    this.sort = UuTableSort.off,
    this.align = UuTableAlign.left,
    this.onSort,
    this.flex = 1,
    this.width,
    this.type = UuTableHeaderCellType.normal,
    this.checked = false,
    this.onCheckedChanged,
  });
  final String label;
  final UuTableSort sort;
  final UuTableAlign align;
  final VoidCallback? onSort;
  final int flex;
  final double? width;
  final UuTableHeaderCellType type;
  final bool? checked;
  final ValueChanged<bool>? onCheckedChanged;

  double? get _width => width ?? (type == UuTableHeaderCellType.checkbox ? UuTableCell.checkboxWidth : null);
}

class _UuTableColumns extends InheritedWidget {
  const _UuTableColumns({required this.columns, required super.child});
  final List<UuTableColumn> columns;
  static List<UuTableColumn>? maybeOf(BuildContext context) => context.dependOnInheritedWidgetOfExactType<_UuTableColumns>()?.columns;
  @override
  bool updateShouldNotify(_UuTableColumns old) => old.columns != columns;
}

Widget _layoutCells(List<Widget> cells, List<UuTableColumn>? columns) => Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < cells.length; i++)
          () {
            final col = columns != null && i < columns.length ? columns[i] : null;
            final cell = cells[i];
            if (col?._width != null) return SizedBox(width: col!._width, child: cell);
            if (col == null && cell is UuTableCell && cell.type == UuTableCellType.checkbox) return cell;
            if (col == null && cell is UuTableHeaderCell && cell.type == UuTableHeaderCellType.checkbox) return cell;
            return Expanded(flex: col?.flex ?? 1, child: cell);
          }(),
      ],
    );

/// Một hàng dữ liệu: các ô cùng chiều cao xếp ngang. [selected] → mọi ô nền `background-interactive-muted`.
/// Hover phủ cả hàng; có [onTap] thì thêm pressed (state layer object-primary 5 / 10).
class UuTableRow extends StatefulWidget {
  const UuTableRow({super.key, required this.cells, this.selected = false, this.onTap, this.forced});
  final List<Widget> cells;
  final bool selected;
  final VoidCallback? onTap;
  /// Ép hover cả hàng (Widgetbook).
  final UuForcedState? forced;

  @override
  State<UuTableRow> createState() => _UuTableRowState();
}

class _UuTableRowState extends State<UuTableRow> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    final row = _layoutCells(widget.cells, _UuTableColumns.maybeOf(context));
    if (widget.onTap != null) {
      return _UuTableRowScope(
        selected: widget.selected,
        hover: false,
        child: UuPressable(surface: UuSurface.onLight, overlayColor: c.objectPrimary, onTap: widget.onTap, forced: widget.forced, selected: widget.selected, child: row),
      );
    }
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: _UuTableRowScope(selected: widget.selected, hover: _hover || widget.forced == UuForcedState.hover, child: row),
    );
  }
}

/// Khung bảng (helper code, bản vẽ không có component `Table`): hàng tiêu đề dựng từ [columns] + [rows].
/// Không thêm hình học — không viền ngoài, không kẻ dọc. Bảng rộng hơn khung thì màn tự bọc cuộn ngang.
class UuTable extends StatelessWidget {
  const UuTable({super.key, required this.columns, required this.rows});
  final List<UuTableColumn> columns;
  final List<UuTableRow> rows;

  @override
  Widget build(BuildContext context) => _UuTableColumns(
        columns: columns,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _layoutCells([
              for (final col in columns)
                UuTableHeaderCell(label: col.label, sort: col.sort, align: col.align, onSort: col.onSort, type: col.type, checked: col.checked, onCheckedChanged: col.onCheckedChanged),
            ], columns),
            ...rows,
          ],
        ),
      );
}

// ---------------------------------------------------------------------------
// TablePagination (§6.24)
// ---------------------------------------------------------------------------

/// TablePagination (§6.24): thanh dưới bảng — trái "Hiển thị [Dropdown 88] trên N dòng", phải lùi · số trang · tiến.
/// Trang đánh số từ 1. Lùi ở trang đầu / tiến ở trang cuối là Disabled. Quá 7 trang thì rút gọn "…" ([uuPageItems]).
class UuTablePagination extends StatelessWidget {
  const UuTablePagination({
    super.key,
    required this.page,
    required this.pageCount,
    required this.onPageChanged,
    this.rowsPerPage = true,
    this.rowsPerPageValue = '10',
    this.onRowsPerPageOpen,
    this.totalRows,
  }) : assert(pageCount >= 1 && page >= 1 && page <= pageCount);

  final int page;
  final int pageCount;
  final ValueChanged<int> onPageChanged;
  /// Thiết kế: `Rows per page` — hiện/ẩn cụm chọn số dòng bên trái.
  final bool rowsPerPage;
  final String rowsPerPageValue;
  /// Mở `UuMenu` chọn số dòng.
  final VoidCallback? onRowsPerPageOpen;
  final int? totalRows;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final caption = th.text.caption.copyWith(color: c.objectSecondary);
    final left = Row(mainAxisSize: MainAxisSize.min, children: [
      Text('Hiển thị', style: caption),
      const SizedBox(width: UuGap.g2),
      SizedBox(width: UuSize.s20 + UuSize.s2, child: UuDropdown(value: rowsPerPageValue, onOpen: onRowsPerPageOpen)), // 88
      if (totalRows != null) ...[const SizedBox(width: UuGap.g2), Text('trên $totalRows dòng', style: caption)],
    ]);
    final right = Row(mainAxisSize: MainAxisSize.min, children: [
      UuIconButton(icon: 'chevron-left', label: 'Trang trước', tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small,
          state: page <= 1 ? UuButtonState.disabled : UuButtonState.normal, onPressed: () => onPageChanged(page - 1)),
      for (final p in uuPageItems(page, pageCount)) ...[
        const SizedBox(width: UuGap.g1),
        p == null ? const _UuPageEllipsis() : _UuPageItem(page: p, selected: p == page, onTap: () => onPageChanged(p)),
      ],
      const SizedBox(width: UuGap.g1),
      UuIconButton(icon: 'chevron-right', label: 'Trang sau', tone: UuButtonTone.neutral, type: UuButtonType.ghost, size: UuButtonSize.small,
          state: page >= pageCount ? UuButtonState.disabled : UuButtonState.normal, onPressed: () => onPageChanged(page + 1)),
    ]);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: UuGap.g2),
      child: Row(children: [if (rowsPerPage) left, const Spacer(), right]),
    );
  }
}

/// `.PageItem` (§6.24, nội bộ): min `control/height-small` vuông, padding ngang `control/padding-x-small`, radius circle, body.
/// Selected = viền 2px `border-interactive` (vẽ trong, không cộng vào kích thước) + chữ object-primary.
/// Dãy ô trang (§6.24 *Rút gọn*): tới 7 trang hiện đủ; quá 7 giữ trang đầu, cuối, trang đang chọn ± 1.
/// `null` = một ô "…". Khoảng trống đúng một trang thì hiện số đó. `uuPageItems(10, 20)` → `1 … 9 10 11 … 20`.
List<int?> uuPageItems(int page, int pageCount) {
  final n = pageCount < 1 ? 1 : pageCount;
  if (n <= 7) return [for (var i = 1; i <= n; i++) i];
  final keep = <int>{1, n, page - 1, page, page + 1}.where((p) => p >= 1 && p <= n).toList()..sort();
  final out = <int?>[];
  for (var i = 0; i < keep.length; i++) {
    if (i > 0) {
      final gap = keep[i] - keep[i - 1];
      if (gap == 2) out.add(keep[i - 1] + 1);
      if (gap > 2) out.add(null);
    }
    out.add(keep[i]);
  }
  return out;
}

/// `.PageItem` `State=Ellipsis`: "…" `object-secondary`, không bấm, không state layer.
class _UuPageEllipsis extends StatelessWidget {
  const _UuPageEllipsis();

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final z = th.sizes;
    return ExcludeSemantics(
      child: Container(
        constraints: BoxConstraints(minWidth: z.controlHeightSmall, minHeight: z.controlHeightSmall),
        alignment: Alignment.center,
        child: Text('…', style: th.text.body.copyWith(color: th.colors.objectSecondary)),
      ),
    );
  }
}

class _UuPageItem extends StatelessWidget {
  const _UuPageItem({required this.page, required this.selected, required this.onTap});
  final int page;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final radius = BorderRadius.circular(UuRadius.circle);
    return UuPressable(
      surface: UuSurface.onLight,
      overlayColor: c.objectPrimary,
      borderRadius: radius,
      onTap: onTap,
      selected: selected,
      semanticLabel: selected ? 'Trang $page, trang hiện tại' : 'Trang $page',
      child: Container(
        constraints: BoxConstraints(minWidth: z.controlHeightSmall, minHeight: z.controlHeightSmall),
        padding: EdgeInsets.symmetric(horizontal: z.controlPaddingXSmall),
        alignment: Alignment.center,
        foregroundDecoration: selected ? BoxDecoration(borderRadius: radius, border: Border.all(color: c.borderInteractive, width: 2)) : null,
        child: Text('$page', maxLines: 1, softWrap: false,
            style: th.text.body.copyWith(color: selected ? c.objectPrimary : c.objectSecondary, fontFeatures: _tabular)),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// KPICard (§6.26)
// ---------------------------------------------------------------------------

/// `Trend` của [UuKPICard]. Icon luôn theo **chiều số**.
enum UuKpiTrend { up, down }

/// `Polarity` của [UuKPICard]. `inverse` cho chỉ số mà **tăng là xấu** (chi phí, tỉ lệ huỷ, thời gian chờ).
enum UuKpiPolarity { normal, inverse }

/// KPICard (§6.26): padding `card/padding` (16 · Compact 12), gap 4, radius 16, nền surface, viền 1px `border-muted`.
/// Label caption secondary · Value heading-base tabular-nums · Delta icon 16 + caption.
/// `Polarity=Normal`: Up positive · Down negative. `Inverse`: Up negative · Down positive, icon vẫn theo chiều số.
/// `Interactive` (có [onTap]): `chevron-right` 16 cuối hàng Label, state layer object-primary 5 / 10 phủ cả thẻ,
/// focus bàn phím vẽ vòng 2px `border-emphasized`. FILL: đặt trong Expanded / cột stretch.
class UuKPICard extends StatefulWidget {
  const UuKPICard({super.key, required this.label, required this.value, this.trend, this.delta, this.polarity = UuKpiPolarity.normal, this.onTap, this.forced})
      : assert(trend == null || delta != null, 'Trend cần chữ delta');
  final String label;
  final String value;
  /// null = `[No trend]` (không có Delta).
  final UuKpiTrend? trend;
  final String? delta;
  /// Thiết kế: `Polarity`. Chọn theo ý nghĩa chỉ số, không theo con số đang hiện. Bỏ qua khi [trend] null.
  final UuKpiPolarity polarity;
  /// Thiết kế: `Interactive` — có [onTap] thì cả thẻ là một nút mở trang chi tiết. Không đặt nút khác bên trong.
  final VoidCallback? onTap;
  /// Ép hover / pressed (Widgetbook).
  final UuForcedState? forced;

  @override
  State<UuKPICard> createState() => _UuKPICardState();
}

class _UuKPICardState extends State<UuKPICard> {
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final th = UuTheme.of(context);
    final c = th.colors;
    final z = th.sizes;
    final trend = widget.trend;
    final good = (trend == UuKpiTrend.up) == (widget.polarity == UuKpiPolarity.normal);
    final deltaColor = good ? c.objectPositive : c.objectNegative;
    final interactive = widget.onTap != null;
    final radius = BorderRadius.circular(UuRadius.lg);
    final labelText = Text(widget.label, style: th.text.caption.copyWith(color: c.objectSecondary));
    Widget card = Container(
      padding: EdgeInsets.all(z.cardPadding),
      decoration: BoxDecoration(color: c.backgroundSurface, borderRadius: radius, border: Border.all(color: c.borderMuted), boxShadow: th.cardShadows),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (interactive)
            Row(children: [
              Expanded(child: labelText),
              const SizedBox(width: UuGap.g1),
              UuIcon('chevron-right', size: UuSize.s4, color: c.objectSecondary),
            ])
          else
            labelText,
          const SizedBox(height: UuGap.g1),
          Text(widget.value, style: th.text.headingBase.copyWith(color: c.objectPrimary, fontFeatures: _tabular)),
          if (trend != null) ...[
            const SizedBox(height: UuGap.g1),
            Row(mainAxisSize: MainAxisSize.min, children: [
              UuIcon(trend == UuKpiTrend.up ? 'arrow-trend-up' : 'arrow-trend-down', size: UuSize.s4, color: deltaColor,
                  semanticLabel: trend == UuKpiTrend.up ? 'Tăng' : 'Giảm'),
              const SizedBox(width: UuGap.g1),
              Text(widget.delta!, style: th.text.caption.copyWith(color: deltaColor, fontFeatures: _tabular)),
            ]),
          ],
        ],
      ),
    );
    if (!interactive) return card;
    card = UuPressable(
      surface: UuSurface.onLight,
      overlayColor: c.objectPrimary,
      borderRadius: radius,
      onTap: widget.onTap,
      forced: widget.forced,
      child: card,
    );
    // Focus bàn phím: vòng 2px border-emphasized quanh thẻ, cách viền 2.
    final ring = _focused && FocusManager.instance.highlightMode == FocusHighlightMode.traditional;
    return Focus(
      canRequestFocus: false,
      skipTraversal: true,
      onFocusChange: (v) => setState(() => _focused = v),
      child: Stack(clipBehavior: Clip.none, children: [
        card,
        // Vòng vẽ ngoài thẻ (không đổi kích thước thẻ): nét 2 cách viền 2 → lệch ra 4.
        if (ring)
          Positioned(
            left: -UuGap.g1, top: -UuGap.g1, right: -UuGap.g1, bottom: -UuGap.g1,
            child: IgnorePointer(
              child: DecoratedBox(decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(UuRadius.lg + UuGap.g1),
                border: Border.all(color: c.borderEmphasized, width: 2),
              )),
            ),
          ),
      ]),
    );
  }
}
