import { createContext, useContext, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UuIconButton, UuTextButton } from './buttons';
import { UuStatusIndicator, type UuTone } from './badges';
import { UuDropdown } from './fields';
import { UuIcon } from './icon';
import { UuPressable, useUuHover, type UuForcedState } from './pressable';
import { UuCheckbox } from './selection';
import { useUu } from './theme';
import { gap, opacity, size } from './tokens.g';

// ---------------------------------------------------------------------------
// Bảng (§6.23): TableHeaderCell · TableCell. Hàng / bảng chỉ là ghép ô, không thêm hình học.
// ---------------------------------------------------------------------------

/** `off` = cột không sắp được · `unsorted` = sắp được, chưa sắp. */
export type UuTableSort = 'off' | 'unsorted' | 'ascending' | 'descending';
/** `right` cho cột số (icon đứng trước nhãn, cả hai dồn phải). */
export type UuTableAlign = 'left' | 'right';
export type UuTableHeaderCellType = 'normal' | 'checkbox';
export type UuTableCellType = 'text' | 'number' | 'secondary' | 'actions' | 'checkbox' | 'status';
/** Chỉ để ép trạng thái khi chụp docs; trong bảng thật UuTableRow tự quyết cho cả hàng. */
export type UuTableCellState = 'normal' | 'hover' | 'selected';

/** Ô Checkbox rộng cố định 64 (size-16). */
export const tableCheckboxWidth = size.s16;

const tabular = { fontVariant: ['tabular-nums' as const] };

/** Giá trị ô "chọn tất cả" từ số hàng đã chọn trên trang: đủ → true, một phần → null, không → false. */
export const tableCheckedFor = (selected: number, total: number): boolean | null => (selected === 0 ? false : selected >= total ? true : null);

export interface UuTableHeaderCellProps {
  label?: string;
  sort?: UuTableSort;
  align?: UuTableAlign;
  onSort?: () => void;
  type?: UuTableHeaderCellType;
  /** `checkbox`: true khi mọi hàng của trang đang xem đã chọn, null khi một phần, false khi chưa. */
  checked?: boolean | null;
  onCheckedChange?: (next: boolean) => void;
}

/**
 * TableHeaderCell (§6.23): cao table-header-height (48 · Compact 32), padding ngang table-cell-padding-x, gap 4, title-sm.
 * Bấm được khi `sort != off` và có onSort. `checkbox` = ô "chọn tất cả" rộng 64, state nằm ở checkbox.
 */
export function UuTableHeaderCell({ label = '', sort = 'off', align = 'left', onSort, type = 'normal', checked = false, onCheckedChange }: UuTableHeaderCellProps) {
  const { colors: c, sizes: z, text } = useUu();
  const base = { height: z.tableHeaderHeight, paddingHorizontal: z.tableCellPaddingX, borderBottomWidth: 1, borderBottomColor: c.borderMuted, flexDirection: 'row' as const, alignItems: 'center' as const };
  if (type === 'checkbox') {
    return (
      <View style={[base, { width: tableCheckboxWidth }]}>
        <UuCheckbox checked={checked} onChange={onCheckedChange} accessibilityLabel="Chọn tất cả hàng" />
      </View>
    );
  }
  const sorted = sort === 'ascending' || sort === 'descending';
  const fg = sorted ? c.objectPrimary : c.objectSecondary;
  const icon = sort === 'unsorted' ? <UuIcon name="sort-vertical" size={size.s4} color={c.objectSecondary} /> : sort === 'ascending' ? <UuIcon name="arrow-up" size={size.s4} color={c.objectPrimary} /> : sort === 'descending' ? <UuIcon name="arrow-down" size={size.s4} color={c.objectPrimary} /> : null;
  const right = align === 'right';
  const cell = (
    <View style={[base, { gap: gap.g1, justifyContent: right ? 'flex-end' : 'flex-start' }]}>
      {right && icon}
      <Text numberOfLines={1} style={[text.titleSm, { flexShrink: 1, color: fg }]}>{label}</Text>
      {!right && icon}
    </View>
  );
  const sortValue = sort === 'ascending' ? 'tăng dần' : sort === 'descending' ? 'giảm dần' : undefined;
  if (sort === 'off' || !onSort) return <View accessible accessibilityRole="header" accessibilityLabel={label} accessibilityValue={sortValue ? { text: sortValue } : undefined}>{cell}</View>;
  return (
    <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={onSort} accessibilityLabel={sortValue ? `${label}, ${sortValue}` : label}>
      {cell}
    </UuPressable>
  );
}

/** Trạng thái của hàng truyền xuống mọi ô — hover / chọn là của CẢ HÀNG. */
const RowCtx = createContext<{ selected: boolean; hover: boolean } | null>(null);

export interface UuTableCellProps {
  content?: string;
  type?: UuTableCellType;
  state?: UuTableCellState;
  /** `actions`: nhãn nút Ghost; bỏ trống = ẩn. */
  actionLabel?: string;
  onAction?: () => void;
  /** `actions`: nút "⋯" hiện khi có onMore — mở UuMenu. */
  moreLabel?: string;
  onMore?: () => void;
  /** `checkbox`. */
  checked?: boolean | null;
  onCheckedChange?: (next: boolean) => void;
  /** `status`: tone + Container=Filled của UuStatusIndicator. */
  statusTone?: UuTone;
  statusFilled?: boolean;
}

/**
 * TableCell (§6.23): cao table-row-height (56 · Compact 40), padding ngang table-cell-padding-x, gap 8.
 * text body · secondary caption · number body căn phải tabular-nums · actions Ghost Small + "⋯" · checkbox 64 · status.
 */
export function UuTableCell({ content = '', type = 'text', state = 'normal', actionLabel, onAction, moreLabel = 'Thêm hành động', onMore, checked = false, onCheckedChange, statusTone = 'neutral', statusFilled = false }: UuTableCellProps) {
  const { colors: c, sizes: z, text } = useUu();
  const row = useContext(RowCtx);
  const selected = state === 'selected' || !!row?.selected;
  const hover = state === 'hover' || !!row?.hover;
  const body =
    type === 'secondary' ? <Text numberOfLines={1} style={[text.caption, { color: c.objectSecondary }]}>{content}</Text>
    : type === 'number' ? <Text numberOfLines={1} style={[text.body, tabular, { color: c.objectPrimary, textAlign: 'right' }]}>{content}</Text>
    : type === 'actions' ? (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g2 }}>
        {actionLabel && <UuTextButton label={actionLabel} type="ghost" size="small" onPress={onAction} />}
        {onMore && <UuIconButton icon="dots" label={moreLabel} tone="neutral" type="ghost" size="small" onPress={onMore} />}
      </View>
    )
    : type === 'checkbox' ? <UuCheckbox checked={checked} onChange={onCheckedChange} accessibilityLabel={content || 'Chọn hàng'} />
    : type === 'status' ? <UuStatusIndicator label={content} tone={statusTone} filled={statusFilled} />
    : <Text numberOfLines={1} style={[text.body, { color: c.objectPrimary }]}>{content}</Text>;
  return (
    <View style={{ height: z.tableRowHeight, width: type === 'checkbox' ? tableCheckboxWidth : undefined, paddingHorizontal: z.tableCellPaddingX, borderBottomWidth: 1, borderBottomColor: c.borderMuted, backgroundColor: selected ? c.backgroundInteractiveMuted : undefined, justifyContent: 'center', alignItems: type === 'number' ? 'flex-end' : 'flex-start' }}>
      {body}
      {/* Hover tĩnh của hàng không bấm được: object-primary 5% phủ cả ô. Hàng bấm được thì UuPressable của hàng vẽ. */}
      {hover && <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.objectPrimary, opacity: opacity.o5 }} />}
    </View>
  );
}

export interface UuTableColumn {
  label?: string;
  sort?: UuTableSort;
  align?: UuTableAlign;
  onSort?: () => void;
  /** Chia phần còn lại theo flex khi không có width. */
  flex?: number;
  width?: number;
  type?: UuTableHeaderCellType;
  checked?: boolean | null;
  onCheckedChange?: (next: boolean) => void;
}

const ColsCtx = createContext<UuTableColumn[] | null>(null);

function LayoutCells({ cells, columns }: { cells: ReactNode[]; columns: UuTableColumn[] | null }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {cells.map((cell, i) => {
        const col = columns?.[i];
        const w = col?.width ?? (col?.type === 'checkbox' ? tableCheckboxWidth : undefined);
        return (
          <View key={i} style={w !== undefined ? { width: w } : { flex: col?.flex ?? 1, minWidth: 0 }}>
            {cell}
          </View>
        );
      })}
    </View>
  );
}

/** Một hàng: các ô cùng cao xếp ngang. `selected` → mọi ô nền interactive-muted. Hover phủ cả hàng; có onPress thì thêm pressed. */
export function UuTableRow({ cells, selected = false, onPress, forced }: { cells: ReactNode[]; selected?: boolean; onPress?: () => void; forced?: UuForcedState }) {
  const { colors: c } = useUu();
  const cols = useContext(ColsCtx);
  const [hover, hoverHandlers] = useUuHover();
  const row = <LayoutCells cells={cells} columns={cols} />;
  if (onPress) {
    return (
      <RowCtx.Provider value={{ selected, hover: false }}>
        <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={onPress} forced={forced} accessibilityState={{ selected }}>
          {row}
        </UuPressable>
      </RowCtx.Provider>
    );
  }
  return (
    <RowCtx.Provider value={{ selected, hover: hover || forced === 'hover' }}>
      <Pressable accessible={false} {...hoverHandlers}>
        {row}
      </Pressable>
    </RowCtx.Provider>
  );
}

/**
 * Khung bảng (helper code — bản vẽ không có component Table): hàng tiêu đề dựng từ `columns` + các `UuTableRow`.
 * Không viền ngoài, không kẻ dọc. Bảng rộng hơn khung thì màn tự bọc ScrollView ngang.
 */
export function UuTable({ columns, children }: { columns: UuTableColumn[]; children: ReactNode }) {
  return (
    <ColsCtx.Provider value={columns}>
      <View>
        <LayoutCells
          columns={columns}
          cells={columns.map((col, i) => (
            <UuTableHeaderCell key={i} label={col.label} sort={col.sort} align={col.align} onSort={col.onSort} type={col.type} checked={col.checked} onCheckedChange={col.onCheckedChange} />
          ))}
        />
        {children}
      </View>
    </ColsCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// TablePagination (§6.24)
// ---------------------------------------------------------------------------

/**
 * Dãy ô trang (§6.24 Rút gọn): tới 7 trang hiện đủ; quá 7 giữ trang đầu, cuối, trang đang chọn ± 1. `null` = "…".
 * Khoảng trống đúng một trang thì hiện số đó. `uuPageItems(10, 20)` → `1 … 9 10 11 … 20`.
 */
export function uuPageItems(page: number, pageCount: number): (number | null)[] {
  const n = Math.max(1, pageCount);
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  const keep = [...new Set([1, n, page - 1, page, page + 1])].filter((p) => p >= 1 && p <= n).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  keep.forEach((p, i) => {
    if (i > 0) {
      const d = p - keep[i - 1];
      if (d === 2) out.push(p - 1);
      if (d > 2) out.push(null);
    }
    out.push(p);
  });
  return out;
}

export interface UuTablePaginationProps {
  /** Đánh số từ 1. */
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  /** Thiết kế `Rows per page`: cụm chọn số dòng bên trái. */
  rowsPerPage?: boolean;
  rowsPerPageValue?: string;
  /** Mở UuMenu chọn số dòng. */
  onRowsPerPageOpen?: () => void;
  totalRows?: number;
}

/** TablePagination (§6.24): trái "Hiển thị [Dropdown 88] trên N dòng", phải lùi · số trang · tiến. Lùi ở trang đầu / tiến ở trang cuối Disabled. */
export function UuTablePagination({ page, pageCount, onPageChange, rowsPerPage = true, rowsPerPageValue = '10', onRowsPerPageOpen, totalRows }: UuTablePaginationProps) {
  const { colors: c, sizes: z, text, radius } = useUu();
  const caption = [text.caption, { color: c.objectSecondary }];
  return (
    <View style={{ paddingVertical: gap.g2, flexDirection: 'row', alignItems: 'center' }}>
      {rowsPerPage && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g2 }}>
          <Text style={caption}>Hiển thị</Text>
          <View style={{ width: size.s20 + size.s2 /* 88 */ }}>
            <UuDropdown value={rowsPerPageValue} onOpen={onRowsPerPageOpen} />
          </View>
          {totalRows !== undefined && <Text style={caption}>trên {totalRows} dòng</Text>}
        </View>
      )}
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g1 }}>
        <UuIconButton icon="chevron-left" label="Trang trước" tone="neutral" type="ghost" size="small" state={page <= 1 ? 'disabled' : 'normal'} onPress={() => onPageChange(page - 1)} />
        {uuPageItems(page, pageCount).map((p, i) =>
          p === null ? (
            <View key={`e${i}`} importantForAccessibility="no-hide-descendants" style={{ minWidth: z.controlHeightSmall, minHeight: z.controlHeightSmall, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[text.body, { color: c.objectSecondary }]}>…</Text>
            </View>
          ) : (
            <UuPressable key={p} surface="onLight" overlayColor={c.objectPrimary} onPress={() => onPageChange(p)} accessibilityLabel={p === page ? `Trang ${p}, trang hiện tại` : `Trang ${p}`} accessibilityState={{ selected: p === page }} style={{ borderRadius: radius.circle }}>
              <View style={{ minWidth: z.controlHeightSmall, minHeight: z.controlHeightSmall, paddingHorizontal: z.controlPaddingXSmall, alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={[text.body, tabular, { color: p === page ? c.objectPrimary : c.objectSecondary }]}>{p}</Text>
              </View>
              {p === page && <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.circle, borderWidth: 2, borderColor: c.borderInteractive }} />}
            </UuPressable>
          ),
        )}
        <UuIconButton icon="chevron-right" label="Trang sau" tone="neutral" type="ghost" size="small" state={page >= pageCount ? 'disabled' : 'normal'} onPress={() => onPageChange(page + 1)} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// KPICard (§6.26)
// ---------------------------------------------------------------------------

/** Icon luôn theo chiều số. */
export type UuKpiTrend = 'up' | 'down';
/** `inverse` cho chỉ số mà tăng là xấu (chi phí, tỉ lệ huỷ, thời gian chờ). */
export type UuKpiPolarity = 'normal' | 'inverse';

export interface UuKPICardProps {
  label: string;
  value: string;
  /** Bỏ trống = `[No trend]`. */
  trend?: UuKpiTrend;
  delta?: string;
  polarity?: UuKpiPolarity;
  /** Thiết kế `Interactive`: cả thẻ là một nút mở trang chi tiết. Không đặt nút khác bên trong. */
  onPress?: () => void;
  forced?: UuForcedState;
}

/**
 * KPICard (§6.26): padding card-padding, gap 4, radius 16, nền surface, viền 1px border-muted.
 * Label caption secondary · Value heading-base tabular-nums · Delta icon 16 + caption.
 * Normal: Up positive · Down negative. Inverse: ngược lại, icon vẫn theo chiều số. Interactive: `chevron-right` 16 + lớp 5/10.
 */
export function UuKPICard({ label, value, trend, delta, polarity = 'normal', onPress, forced }: UuKPICardProps) {
  const { colors: c, sizes: z, text, radius, cardShadow } = useUu();
  if (__DEV__ && trend && !delta) console.warn('[UU DS] KPICard: Trend cần chữ delta.');
  const good = (trend === 'up') === (polarity === 'normal');
  const deltaColor = good ? c.objectPositive : c.objectNegative;
  const card = (
    <View style={{ padding: z.cardPadding, gap: gap.g1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.borderMuted, backgroundColor: c.backgroundSurface, boxShadow: cardShadow }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g1 }}>
        <Text style={[text.caption, { flex: onPress ? 1 : undefined, color: c.objectSecondary }]}>{label}</Text>
        {onPress && <UuIcon name="chevron-right" size={size.s4} color={c.objectSecondary} />}
      </View>
      <Text style={[text.headingBase, tabular, { color: c.objectPrimary }]}>{value}</Text>
      {trend && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g1 }}>
          <UuIcon name={trend === 'up' ? 'arrow-trend-up' : 'arrow-trend-down'} size={size.s4} color={deltaColor} accessibilityLabel={trend === 'up' ? 'Tăng' : 'Giảm'} />
          <Text style={[text.caption, tabular, { color: deltaColor }]}>{delta}</Text>
        </View>
      )}
    </View>
  );
  if (!onPress) return card;
  return (
    <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={onPress} forced={forced} accessibilityLabel={[label, value, delta].filter(Boolean).join(', ')} style={{ borderRadius: radius.lg }}>
      {card}
    </UuPressable>
  );
}
