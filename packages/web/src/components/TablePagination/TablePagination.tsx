import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { IconButtonNeutral } from '../Button/IconButton';
import { Dropdown } from '../Dropdown/Dropdown';
import './TablePagination.css';

/* ------------------------------------------------------------------ */
/* .PageItem — nội bộ, 4 variant: Default · Hover · Selected · Ellipsis */
/* ------------------------------------------------------------------ */

/** Thiết kế: `State`. `hover` chỉ để ép trong docs — sản phẩm thật dùng :hover. */
export type PageItemState = 'default' | 'hover' | 'selected' | 'ellipsis';

export interface PageItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** Thiết kế: `Page` (TEXT). */
  page: number | string;
  state?: PageItemState;
}

/**
 * `.PageItem` (§6.24, nội bộ của `TablePagination`) — ô số trang. Min `control-height-small` vuông,
 * padding ngang `control-padding-x-small`, `rounded-circle`, chữ `body` `object-secondary`.
 * `Selected`: viền 2px `border-interactive`, chữ `object-primary`, `aria-current="page"`.
 * `Ellipsis`: "…" thay cho dải trang bị rút gọn, không bấm được.
 */
export function PageItem({ page, state = 'default', className, ...rest }: PageItemProps) {
  // Ellipsis: "…" object-secondary, không bấm được, không state layer.
  if (state === 'ellipsis') return <span className={['uu-pageitem', 'uu-pageitem--ellipsis', className].filter(Boolean).join(' ')} aria-hidden="true">…</span>;
  const selected = state === 'selected';
  return (
    <button
      type="button"
      className={['uu-pageitem', 'uu-interactive', 'uu-on-light', className].filter(Boolean).join(' ')}
      aria-current={selected ? 'page' : undefined}
      data-state={state === 'hover' ? 'hover' : undefined}
      {...rest}
    >
      {page}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* TablePagination — 1 variant, BOOLEAN `Rows per page`                */
/* ------------------------------------------------------------------ */

export interface TablePaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Trang đang xem, đếm từ 1. */
  page: number;
  /** Tổng số trang. Tới 7 trang hiện đủ; quá 7 thì rút gọn bằng ô "…" (§6.24, `pageItems`). */
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Thiết kế: `Rows per page` (BOOLEAN) — hiện/ẩn cụm chọn số dòng bên trái. Mặc định `true`. */
  rowsPerPage?: boolean;
  /** Số dòng mỗi trang đang chọn, hiện trong `Dropdown`. */
  pageSize?: number;
  /** Bấm `Dropdown` số dòng. Màn tự mở `Menu` (§6.21) rồi đổi `pageSize`. */
  onPageSizeOpen?: () => void;
  /** Tổng số dòng của bảng — chữ "trên {totalRows} dòng". */
  totalRows?: number;
  /** Tên đọc của vùng phân trang. */
  'aria-label'?: string;
}

/**
 * Dãy ô trang (§6.24 *Rút gọn*): tới 7 trang hiện đủ. Quá 7: giữ trang đầu, trang cuối, trang đang chọn ± 1;
 * khoảng trống thành một `'…'`, nhưng khoảng trống đúng một trang thì hiện số đó (không "…" thay một số).
 * `pageItems(10, 20)` → `[1, '…', 9, 10, 11, '…', 20]` · `pageItems(2, 20)` → `[1, 2, 3, '…', 20]`.
 */
export function pageItems(page: number, pageCount: number): (number | '…')[] {
  const n = Math.max(1, pageCount);
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  const keep = new Set([1, n, page - 1, page, page + 1].filter((p) => p >= 1 && p <= n));
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined) {
      if (p - prev === 2) out.push(prev + 1);
      else if (p - prev > 2) out.push('…');
    }
    out.push(p);
  });
  return out;
}

/**
 * TablePagination (§6.24) — thanh dưới bảng: chọn số dòng mỗi trang và chuyển trang.
 * HORIZONTAL `space-between`, padding dọc 8, FILL. Trái: "Hiển thị" · `Dropdown` (rộng 88) · "trên N dòng".
 * Phải: gap 4 · `IconButtonNeutral` Ghost Small `chevron-left` · các `.PageItem` · `chevron-right`.
 * Nút lùi ở trang đầu / tiến ở trang cuối là Disabled. Khác `Pagination` (chỉ báo băng chuyền).
 */
export function TablePagination({
  page, pageCount, onPageChange,
  rowsPerPage = true, pageSize = 10, onPageSizeOpen, totalRows,
  className, 'aria-label': ariaLabel = 'Phân trang', ...rest
}: TablePaginationProps) {
  const pages = pageItems(page, pageCount);
  const first = page <= 1;
  const last = page >= pageCount;
  return (
    <div className={['uu-tablepagination', className].filter(Boolean).join(' ')} {...rest}>
      {rowsPerPage && (
        <div className="uu-tablepagination__size">
          <span className="uu-tablepagination__caption">Hiển thị</span>
          <Dropdown className="uu-tablepagination__dropdown" value={String(pageSize)} onOpen={onPageSizeOpen} aria-label="Số dòng mỗi trang" />
          {totalRows !== undefined && (
            <span className="uu-tablepagination__caption">trên {totalRows.toLocaleString('vi-VN')} dòng</span>
          )}
        </div>
      )}
      <nav className="uu-tablepagination__pages" aria-label={ariaLabel}>
        <IconButtonNeutral
          type="ghost" size="small" icon="chevron-left" label="Trang trước"
          state={first ? 'disabled' : 'default'} onClick={() => onPageChange(page - 1)}
        />
        {pages.map((p, i) => p === '…' ? <PageItem key={`gap-${i}`} page="…" state="ellipsis" /> : (
          <PageItem
            key={p} page={p} state={p === page ? 'selected' : 'default'}
            aria-label={`Trang ${p}`} onClick={() => onPageChange(p)}
          />
        ))}
        <IconButtonNeutral
          type="ghost" size="small" icon="chevron-right" label="Trang sau"
          state={last ? 'disabled' : 'default'} onClick={() => onPageChange(page + 1)}
        />
      </nav>
    </div>
  );
}
