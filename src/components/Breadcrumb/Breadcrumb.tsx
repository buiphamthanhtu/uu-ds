import { forwardRef, useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { Menu } from '../Menu/Menu';
import './Breadcrumb.css';

/* ------------------------------------------------------------------ */
/* .BreadcrumbItem — nội bộ, 5 variant                                  */
/* Current=False × State Default · Hover, Current=True (không Hover),   */
/* và Type=Overflow × State (BreadcrumbOverflow)                        */
/* ------------------------------------------------------------------ */

/** Thiết kế: `State`. `hover` chỉ để ép trong docs. Mục `current` không có Hover. */
export type BreadcrumbItemState = 'default' | 'hover';

export interface BreadcrumbItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Thiết kế: `Label` (TEXT). */
  children: ReactNode;
  /** Thiết kế: `Current=True` — trang hiện tại: `object-primary`, không phải link, `aria-current="page"`. */
  current?: boolean;
  state?: BreadcrumbItemState;
}

/**
 * `.BreadcrumbItem` (§6.25, nội bộ của `Breadcrumb`). Padding ngang 4 · `radius-sm` · `body` `object-secondary` · là link.
 * Hover: state layer `object-primary` `opacity-5`. `Current=True`: `object-primary`, không phải link.
 */
export function BreadcrumbItem({ children, current = false, state = 'default', className, href, ...rest }: BreadcrumbItemProps) {
  if (current) {
    return (
      <span className={['uu-breadcrumb__item', className].filter(Boolean).join(' ')} aria-current="page">
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={['uu-breadcrumb__item', 'uu-breadcrumb__link', 'uu-interactive', 'uu-on-light', className].filter(Boolean).join(' ')}
      data-state={state === 'hover' ? 'hover' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

export interface BreadcrumbOverflowProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** Thiết kế: `State`. `hover` chỉ để ép trong docs. */
  state?: BreadcrumbItemState;
  /** Menu các mục ẩn đang mở — gắn `aria-expanded`. */
  expanded?: boolean;
}

/**
 * `.BreadcrumbItem` `Type=Overflow` (§6.25, nội bộ của `Breadcrumb`): chữ "…" `body` `object-secondary`, có Hover như mục
 * thường. `aria-label="Hiện đường dẫn ẩn"`, `aria-haspopup="menu"`. Bấm mở `Menu` liệt kê các mục bị gom.
 */
export const BreadcrumbOverflow = forwardRef<HTMLButtonElement, BreadcrumbOverflowProps>(function BreadcrumbOverflow(
  { state = 'default', expanded, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref} type="button" aria-label="Hiện đường dẫn ẩn" aria-haspopup="menu" aria-expanded={expanded ?? false}
      className={['uu-breadcrumb__item', 'uu-breadcrumb__link', 'uu-breadcrumb__overflow', 'uu-interactive', 'uu-on-light', className].filter(Boolean).join(' ')}
      data-state={state === 'hover' ? 'hover' : undefined}
      {...rest}
    >
      …
    </button>
  );
});

/* ------------------------------------------------------------------ */
/* Breadcrumb — 1 variant                                               */
/* ------------------------------------------------------------------ */

export interface BreadcrumbLink {
  label: ReactNode;
  /** Đích của mục. Mục cuối là trang hiện tại nên không cần. */
  href?: string;
  /** Dùng với router phía client: chặn điều hướng mặc định rồi tự chuyển trang. */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Các mục từ gốc tới trang hiện tại. **Mục cuối luôn là trang hiện tại**. */
  items: BreadcrumbLink[];
  /** Tên đọc của vùng điều hướng. */
  'aria-label'?: string;
  /**
   * Chọn một mục trong menu "…" (đường dẫn bị rút gọn). Bỏ trống: chuyển trang tới `href` của mục.
   * Dùng router phía client thì truyền hàm này để tự chuyển trang.
   */
  onNavigate?: (item: BreadcrumbLink) => void;
}

/** Quá 4 mục thì rút gọn: giữ mục đầu và 2 mục cuối, các mục giữa gom vào một mục "…". */
const MAX_VISIBLE = 4;

/**
 * Breadcrumb (§6.25) — đường dẫn vị trí trong cây trang (desktop). HORIZONTAL · gap 4 · căn giữa dọc.
 * Ngăn cách "/" `body` `object-disabled`, `aria-hidden`. Không dùng thay `NavigationBar` trên app.
 * Quá 4 mục: `Trang chủ / … / Đơn hàng / DH-1024` — "…" mở `Menu` Panel neo dưới, cách 4, liệt kê mục ẩn theo thứ tự.
 */
export function Breadcrumb({ items, className, 'aria-label': ariaLabel = 'Đường dẫn', onNavigate, ...rest }: BreadcrumbProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const collapsed = items.length > MAX_VISIBLE;
  const hidden = collapsed ? items.slice(1, items.length - 2) : [];

  // Đóng khi bấm ra ngoài hoặc Esc (Esc trả focus về "…").
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const go = (value: string) => {
    const it = hidden[Number(value)];
    setOpen(false);
    if (!it) return;
    if (onNavigate) onNavigate(it);
    else if (it.href) window.location.assign(it.href);
  };

  const entry = (it: BreadcrumbLink, i: number) => {
    const current = i === items.length - 1;
    return (
      <li key={i} className="uu-breadcrumb__entry">
        {i > 0 && <span className="uu-breadcrumb__separator" aria-hidden="true">/</span>}
        <BreadcrumbItem current={current} href={current ? undefined : it.href} onClick={current ? undefined : it.onClick}>
          {it.label}
        </BreadcrumbItem>
      </li>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={['uu-breadcrumb', className].filter(Boolean).join(' ')} {...rest}>
      <ol className="uu-breadcrumb__list">
        {!collapsed ? items.map(entry) : (
          <>
            {entry(items[0], 0)}
            <li className="uu-breadcrumb__entry">
              <span className="uu-breadcrumb__separator" aria-hidden="true">/</span>
              <span ref={wrapRef} className="uu-breadcrumb__anchor">
                <BreadcrumbOverflow ref={triggerRef} expanded={open} aria-controls={open ? menuId : undefined} onClick={() => setOpen((o) => !o)} />
                {open && (
                  <div id={menuId} className="uu-breadcrumb__menu">
                    <Menu
                      aria-label="Đường dẫn ẩn"
                      options={hidden.map((it, k) => ({ value: String(k), label: it.label, searchText: typeof it.label === 'string' ? it.label : undefined }))}
                      onSelect={go}
                    />
                  </div>
                )}
              </span>
            </li>
            {items.slice(items.length - 2).map((it, k) => entry(it, items.length - 2 + k))}
          </>
        )}
      </ol>
    </nav>
  );
}
