import type { HTMLAttributes, ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { Icon } from '../../icons';
import { Checkbox, type CheckboxValue } from '../Checkbox/Checkbox';
import { StatusIndicator, type StatusTone, type StatusContainer } from '../StatusIndicator/StatusIndicator';
import { TextButtonAccent } from '../Button/TextButton';
import { IconButtonNeutral } from '../Button/IconButton';
import './Table.css';

/* ------------------------------------------------------------------ */
/* Table · TableRow — khung <table> ngữ nghĩa, KHÔNG thêm hình học.    */
/* Bản vẽ chỉ có ô (§6.23): hàng = các ô xếp ngang, bảng = các hàng.   */
/* ------------------------------------------------------------------ */

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

/** Khung `<table>` bọc các hàng. Không viền ngoài, không kẻ dọc — chỉ viền dưới của mỗi ô. */
export function Table({ className, children, ...rest }: TableProps) {
  return (
    <table className={['uu-table', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </table>
  );
}

/** Trạng thái của cả hàng. `hover` chỉ để ép trong docs — sản phẩm thật dùng :hover. */
export type TableRowState = 'default' | 'hover' | 'selected';

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * Hover / chọn là trạng thái của **cả hàng** (§6.23): mọi ô trong hàng cùng `State`.
   * `selected` → nền `background-interactive-muted` cho mọi ô; `hover` → ép state layer cho mọi ô.
   */
  state?: TableRowState;
}

/**
 * Một hàng `<tr>`. Hàng trong `<tbody>` có state layer khi rê chuột; hàng tiêu đề thì không.
 * Trạng thái chọn được đọc qua `Checkbox` của ô `type="checkbox"` — nền chỉ là tín hiệu thị giác.
 */
export function TableRow({ state = 'default', className, children, ...rest }: TableRowProps) {
  return (
    <tr
      className={['uu-tablerow', className].filter(Boolean).join(' ')}
      data-state={state !== 'default' ? state : undefined}
      {...rest}
    >
      {children}
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* TableHeaderCell — 21 variant: Sort × Align × State (Sort≠Off) + Type=Checkbox */
/* ------------------------------------------------------------------ */

/** Thiết kế: `Sort`. `off` = cột không sắp được · `unsorted` = sắp được, chưa sắp. */
export type TableSort = 'off' | 'unsorted' | 'ascending' | 'descending';
/** Thiết kế: `Align`. `right` cho cột số. */
export type TableAlign = 'left' | 'right';
/** Thiết kế: `Type`. `checkbox` = ô "chọn tất cả" đầu cột chọn hàng. */
export type TableHeaderCellType = 'default' | 'checkbox';

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Thiết kế: `Label` (TEXT). */
  children?: ReactNode;
  /** Thiết kế: `Sort`. Mặc định `off`. */
  sort?: TableSort;
  /** Thiết kế: `Align`. `right`: icon đứng trước nhãn, cả hai dồn phải. */
  align?: TableAlign;
  /** Bấm tiêu đề cột sắp được (`sort` khác `off`). Màn tự đổi `sort` rồi truyền lại. */
  onSort?: () => void;
  /** Thiết kế: `State` — chỉ cột sắp được. `hover` / `pressed` chỉ để ép trong docs; sản phẩm dùng :hover / :active. */
  state?: TableHeaderCellState;

  /** Thiết kế: `Type`. `checkbox`: ô "chọn tất cả" rộng 64 — không nhãn, không sắp xếp, không state layer riêng. Mặc định `default`. */
  type?: TableHeaderCellType;
  /**
   * `type="checkbox"` — `true` khi mọi hàng **của trang đang xem** đã chọn, `'indeterminate'` khi chọn một phần,
   * `false` khi chưa chọn hàng nào.
   */
  checked?: CheckboxValue;
  /** `type="checkbox"` — bấm ô: `true` = chọn cả trang, `false` = bỏ chọn cả trang. Indeterminate bấm thì thành `true`. */
  onCheckedChange?: (next: boolean) => void;
}

export type TableHeaderCellState = 'default' | 'hover' | 'pressed';

const SORT_ICON = { unsorted: 'sort-vertical', ascending: 'arrow-up', descending: 'arrow-down' } as const;
const ARIA_SORT = { unsorted: 'none', ascending: 'ascending', descending: 'descending' } as const;

/**
 * TableHeaderCell (§6.23) — ô tiêu đề cột. Cao `--table-header-height` (48 · Compact 32),
 * padding ngang `--table-cell-padding-x`, gap 4, viền dưới 1px `border-muted`.
 * Nhãn `title-sm` `object-secondary`; `object-primary` khi đang sắp. Icon sắp xếp 16.
 * Cột sắp được có Hover / Pressed qua state layer `object-primary` 5 / 10 phủ cả ô.
 */
export function TableHeaderCell({ children, sort = 'off', align = 'left', onSort, state = 'default', type = 'default', checked = false, onCheckedChange, className, ...rest }: TableHeaderCellProps) {
  // Type=Checkbox: ô "chọn tất cả" — state nằm ở Checkbox, ô không có state layer, không sắp xếp.
  if (type === 'checkbox') {
    return (
      <th scope="col" className={['uu-tableheadercell', 'uu-tableheadercell--checkbox', className].filter(Boolean).join(' ')} {...rest}>
        <span className="uu-tableheadercell__inner">
          <Checkbox checked={checked} onChange={onCheckedChange} aria-label="Chọn tất cả hàng" />
        </span>
      </th>
    );
  }
  const sortable = sort !== 'off';
  const interactive = sortable && Boolean(onSort);
  const icon = sortable ? <Icon name={SORT_ICON[sort]} size={16} className="uu-tableheadercell__icon" /> : null;
  // Align=Right: icon đứng TRƯỚC nhãn (cột số); Align=Left: nhãn trước, icon sau.
  const content = align === 'right' ? <>{icon}<span>{children}</span></> : <><span>{children}</span>{icon}</>;
  return (
    <th
      scope="col"
      className={['uu-tableheadercell', className].filter(Boolean).join(' ')}
      data-align={align}
      data-sort={sort}
      data-sortable={interactive || undefined}
      data-state={sortable && state !== 'default' ? state : undefined}
      aria-sort={sortable ? ARIA_SORT[sort] : undefined}
      {...rest}
    >
      {sortable && onSort ? (
        <button type="button" className="uu-tableheadercell__inner uu-tableheadercell__button uu-reset-button" onClick={onSort}>
          {content}
        </button>
      ) : (
        <span className="uu-tableheadercell__inner">{content}</span>
      )}
    </th>
  );
}

/* ------------------------------------------------------------------ */
/* TableCell — 18 variant: Type (6) × State (3)                        */
/* ------------------------------------------------------------------ */

/** Thiết kế: `Type`. */
export type TableCellType = 'text' | 'number' | 'secondary' | 'actions' | 'checkbox' | 'status';
/** Thiết kế: `State`. `hover` chỉ để ép trong docs. Thường đặt `state` trên `TableRow` cho cả hàng. */
export type TableCellState = 'default' | 'hover' | 'selected';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Thiết kế: `Type`. Mặc định `text`. */
  type?: TableCellType;
  /** Thiết kế: `Content` (TEXT) — chữ của ô `text` / `number` / `secondary`; với `status` là chữ trạng thái trong `StatusIndicator`. */
  children?: ReactNode;
  /** Thiết kế: `State`. */
  state?: TableCellState;

  /** `type="actions"` — thiết kế `TextButton` (BOOLEAN): bật `TextButtonAccent` Ghost Small. Mặc định `true`. */
  textButton?: boolean;
  /** `type="actions"` — thiết kế `IconButton` (BOOLEAN): bật nút "⋯" `IconButtonNeutral` Ghost Small. Mặc định `true`. */
  iconButton?: boolean;
  /** `type="actions"` — nhãn nút chữ (thiết kế `Action` của TextButton). Nên là hành động hay dùng nhất. */
  action?: string;
  onAction?: () => void;
  /** `type="actions"` — bấm "⋯". Màn tự mở `Menu` (§6.21) chứa các hành động còn lại. */
  onMore?: () => void;
  /** Tên đọc cho nút "⋯". */
  moreLabel?: string;

  /** `type="checkbox"` — chọn hàng. */
  checked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  /** Tên đọc cho ô chọn hàng, ví dụ "Chọn đơn DH-1024". */
  checkboxLabel?: string;

  /** `type="status"` — `Tone` của `StatusIndicator` (§6.15). Mặc định `neutral`. */
  statusTone?: StatusTone;
  /** `type="status"` — `Container` của `StatusIndicator`. Mặc định `none`. */
  statusContainer?: StatusContainer;
}

/**
 * TableCell (§6.23) — ô dữ liệu. Cao `--table-row-height` (56 · Compact 40), padding ngang
 * `--table-cell-padding-x`, gap 8, viền dưới 1px `border-muted`.
 * `Hover`: state layer `object-primary` `opacity-5` phủ cả ô · `Selected`: nền `background-interactive-muted`.
 * Hành động theo dòng không bao giờ `Solid` (§6.1 *Mức nhấn*).
 * `Status`: `StatusIndicator` căn trái — chữ trạng thái nằm trong indicator, ô không thêm chữ.
 */
export function TableCell({
  type = 'text', state = 'default', children,
  textButton = true, iconButton = true, action = 'Xem', onAction, onMore, moreLabel = 'Thêm thao tác',
  checked = false, onCheckedChange, checkboxLabel = 'Chọn hàng',
  statusTone = 'neutral', statusContainer = 'none',
  className, ...rest
}: TableCellProps) {
  let content: ReactNode = children;
  if (type === 'actions' && children === undefined) {
    content = (
      <>
        {textButton && <TextButtonAccent type="ghost" size="small" onClick={onAction}>{action}</TextButtonAccent>}
        {iconButton && <IconButtonNeutral type="ghost" size="small" icon="dots" label={moreLabel} aria-haspopup="menu" onClick={onMore} />}
      </>
    );
  }
  if (type === 'checkbox' && children === undefined) {
    content = <Checkbox checked={checked} onChange={onCheckedChange} aria-label={checkboxLabel} />;
  }
  if (type === 'status') {
    content = <StatusIndicator tone={statusTone} container={statusContainer}>{children}</StatusIndicator>;
  }
  return (
    <td
      className={['uu-tablecell', `uu-tablecell--${type}`, className].filter(Boolean).join(' ')}
      data-state={state !== 'default' ? state : undefined}
      {...rest}
    >
      <div className="uu-tablecell__inner">{content}</div>
    </td>
  );
}
