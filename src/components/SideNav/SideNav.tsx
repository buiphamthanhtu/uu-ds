import { createContext, useContext, useId, type AnchorHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { Tooltip } from '../Tooltip/Tooltip';
import { IconButtonNeutral } from '../Button/IconButton';
import { NotificationBadge } from '../NotificationBadge/NotificationBadge';
import './SideNav.css';

const CollapsedContext = createContext(false);

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  /** Thiết kế: `Collapsed` — rộng 73, mục vuông 48, ẩn nhãn / chevron / tiêu đề nhóm / mục cấp 2; nhãn thành `Tooltip`. */
  collapsed?: boolean;
  /** Thiết kế: `Listing` (SLOT) — các `SideNavSection` / `SideNavItem`. */
  children: ReactNode;
  /** Tên vùng điều hướng, vd. "Điều hướng chính". */
  'aria-label': string;
  /**
   * Thiết kế: `Toggle` (BOOLEAN) — nút thu / mở `IconButtonNeutral` Ghost Small `sidebar-left` ở đầu thanh, trên mục đầu tiên:
   * dồn phải khi mở rộng, căn giữa khi thu gọn. Bấm gọi `onCollapsedChange`.
   */
  toggle?: boolean;
  /** Bấm nút thu / mở: nhận giá trị `collapsed` mới. Thanh không tự giữ trạng thái — màn truyền lại `collapsed`. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * SideNav (§6.27): thanh điều hướng dọc của web app / portal — tương đương `BottomBar` trên app.
 * 2 variant = `Collapsed` False · True. Rộng `sidenav/width` (288 · Compact 240), viền phải 1px `border-muted`.
 * Thanh không tự giữ mục đang chọn: màn truyền `active` cho đúng một `SideNavItem`.
 */
export function SideNav({ collapsed = false, toggle = false, onCollapsedChange, children, className, ...rest }: SideNavProps) {
  const toggleLabel = collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng';
  const toggleButton = (
    <IconButtonNeutral
      type="ghost" size="small" icon="sidebar-left" label={toggleLabel} aria-expanded={!collapsed}
      onClick={() => onCollapsedChange?.(!collapsed)}
    />
  );
  return (
    <nav
      className={['uu-sidenav', className].filter(Boolean).join(' ')}
      data-collapsed={collapsed || undefined}
      {...rest}
    >
      {toggle && (
        <div className="uu-sidenav__toggle">
          {collapsed ? <Tooltip text={toggleLabel} placement="right">{toggleButton}</Tooltip> : toggleButton}
        </div>
      )}
      <CollapsedContext.Provider value={collapsed}>{children}</CollapsedContext.Provider>
    </nav>
  );
}

export interface SideNavSectionProps {
  /** Thiết kế: `Title` (TEXT) — `title-xs` IN HOA `object-secondary`. Ẩn khi thanh thu gọn. */
  title?: string;
  children: ReactNode;
  className?: string;
}

/** `.SideNavSection` — nhóm mục có tiêu đề. 1 variant. */
export function SideNavSection({ title, children, className }: SideNavSectionProps) {
  const collapsed = useContext(CollapsedContext);
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={title && !collapsed ? id : undefined}
      aria-label={title && collapsed ? title : undefined}
      className={['uu-sidenav__section', className].filter(Boolean).join(' ')}
    >
      {title && !collapsed && <div id={id} className="uu-sidenav__section-title">{title}</div>}
      {children}
    </div>
  );
}

/** `hover` / `pressed` chỉ để ép trạng thái trong docs — sản phẩm thật dùng :hover / :active. */
export type SideNavItemState = 'default' | 'hover' | 'pressed';

export interface SideNavItemProps extends Omit<AnchorHTMLAttributes<HTMLElement>, 'onClick'> {
  /** Thiết kế: `Label` (TEXT) — `body`. Khi thanh thu gọn: ẩn trên màn, hiện bằng `Tooltip` bên phải. */
  label: string;
  /** Tên UU icon. Chỉ mục `Level=1`. Thường dùng `outline`; mục đang chọn tự đổi sang `fill`. */
  icon?: IconName;
  /** Thiết kế: `Level`. `2` = mục con: không icon, thụt bằng bề ngang icon để nhãn thẳng hàng nhãn cấp 1. Ẩn khi thu gọn. */
  level?: 1 | 2;
  /** Thiết kế: `Chevron` — `chevron-down` 16 cuối mục cấp 1 có mục con. Xoay 180° khi `expanded`. */
  chevron?: boolean;
  /** Mục cấp 1 có mục con: `true` / `false` gắn `aria-expanded`, chevron xoay 180° khi mở. Màn tự hiện / ẩn mục cấp 2. */
  expanded?: boolean;
  /**
   * Thiết kế: `Badge` — `NotificationBadge` `Count` cuối mục, trước chevron. Thanh thu gọn: thành `Dot` ở góc trên phải icon.
   * Truyền đúng chuỗi muốn hiện (vd. "99+").
   */
  badge?: number | string;
  /** Chữ cho trình đọc màn hình của badge, vd. "3 đơn mới". */
  badgeLabel?: string;
  /** Thiết kế: `State=Active` — mục đang chọn, mang `aria-current="page"`. Một mục mỗi lúc. */
  active?: boolean;
  /** Thiết kế: `State=Hover` — ép state layer để chụp docs. */
  state?: SideNavItemState;
  /** Có `href` thì là liên kết `<a>`, không có thì là `<button>`. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

/** `.SideNavItem` — 9 variant = `Level` × `State` (Default · Hover · Active) × `Collapsed` (chỉ `Level=1`). */
export function SideNavItem({ label, icon, level = 1, chevron = false, expanded, badge, badgeLabel, active = false, state = 'default', href, onClick, className, ...rest }: SideNavItemProps) {
  const collapsed = useContext(CollapsedContext);
  if (collapsed && level === 2) return null;

  const cls = ['uu-sidenav__item', 'uu-interactive', 'uu-on-light', level === 2 && 'uu-sidenav__item--level-2', className].filter(Boolean).join(' ');
  const common = {
    className: cls,
    'aria-current': active ? ('page' as const) : undefined,
    'aria-expanded': level === 1 ? expanded : undefined,
    'data-state': state !== 'default' ? state : undefined,
    onClick,
  };
  const hasBadge = badge !== undefined && badge !== '';
  const iconEl = level === 1 && icon && <Icon name={icon} variant={active ? 'fill' : 'outline'} size={24} className="uu-sidenav__icon" />;
  const content = (
    <>
      {iconEl && (hasBadge
        // Thu gọn: Dot neo góc trên phải icon. Mở rộng: badge Count nằm cuối mục (bên dưới).
        ? <span className="uu-sidenav__icon-wrap">{iconEl}{collapsed && <NotificationBadge content="dot" label={badgeLabel} className="uu-sidenav__dot" />}</span>
        : iconEl)}
      {level === 2 && <span className="uu-sidenav__indent" aria-hidden="true" />}
      {!collapsed && <span className="uu-sidenav__label">{label}</span>}
      {!collapsed && hasBadge && <NotificationBadge content="count" count={badge} label={badgeLabel} className="uu-sidenav__badge" />}
      {!collapsed && chevron && level === 1 && <Icon name="chevron-down" size={16} className="uu-sidenav__chevron" />}
    </>
  );
  const el = href
    ? <a href={href} {...common} {...rest}>{content}</a>
    : <button type="button" {...common} {...(rest as HTMLAttributes<HTMLButtonElement>)}>{content}</button>;

  if (!collapsed) return el;
  return <Tooltip text={label} placement="right" relation="label">{el}</Tooltip>;
}
