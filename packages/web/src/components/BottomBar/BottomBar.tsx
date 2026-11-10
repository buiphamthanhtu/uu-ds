import type { HTMLAttributes } from 'react';
import { Icon, type IconName } from '../../icons';
import { NotificationBadge } from '../NotificationBadge/NotificationBadge';
import './BottomBar.css';

export interface BottomBarItem {
  value: string;
  /** Thiết kế: `↳ Label`. `compact` thì ẩn trên màn nhưng vẫn là tên đọc cho trình đọc màn hình. */
  label: string;
  /** Tên UU icon. Mục thường dùng kiểu `outline`, mục đang chọn tự đổi sang `fill`. */
  icon: IconName;
  /** Thiết kế: `Badge` — `NotificationBadge` Count neo góc icon. Chỉ hiện khi mục KHÔNG được chọn. */
  badge?: number | string;
  /** Chữ đọc cho badge, ví dụ "3 thông báo mới". */
  badgeLabel?: string;
}

export interface BottomBarAction {
  /** Tên UU icon, hộp 24. */
  icon: IconName;
  /** Thiết kế: `Label` (TEXT) — `title-xs`. `compact` thì ẩn trên màn nhưng vẫn là tên nút cho trình đọc màn hình. */
  label: string;
  onClick?: () => void;
  /** Thiết kế: `Type`. Mặc định `emphasized`; `subtle` khi màn đã có một nút Solid khác. */
  type?: 'subtle' | 'emphasized';
}

export interface BottomBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 2 đến 5 mục (thiết kế: mục 1–2 luôn có, `3` · `4` · `5` bật thêm). */
  items: BottomBarItem[];
  /** Thiết kế: `Active` — `value` của mục đang chọn. */
  value: string;
  onChange: (value: string) => void;
  /** Thiết kế: `Compact=True` — hug, không nhãn, cao 48. Mặc định: FILL bề ngang, có nhãn, cao 64. */
  compact?: boolean;
  /**
   * Thiết kế: `Action` — nút hành động riêng `base/FooterItemSpecial`: viên thuốc RỜI bên phải vỏ, cách 8.
   * Cho **một hành động chính** (Quét mã, Tạo đơn), không phải đích điều hướng, không có trạng thái Active.
   */
  action?: BottomBarAction;
}

/**
 * BottomBar (§6.22): thanh điều hướng giữa các màn chính, dưới đáy. 10 variant = `Active` 1–5 × `Compact`.
 * Mục đang chọn: nền `background-interactive-muted`, icon `fill` + chữ `object-interactive`.
 * Nút hành động riêng (`action`) có state layer theo §6.0. Màn đặt vị trí thanh.
 */
export function BottomBar({ items, value, onChange, compact = false, action, className, ...rest }: BottomBarProps) {
  if (import.meta.env.DEV && (items.length < 2 || items.length > 5)) {
    console.warn(`[UU DS] BottomBar có ${items.length} mục — bản thiết kế chốt 2 đến 5 mục.`);
  }
  if (import.meta.env.DEV && action && compact && items.length > 4) {
    console.warn(`[UU DS] BottomBar compact có nút hành động thì tối đa 4 mục (đang có ${items.length}) — 5 mục + nút vượt khổ 390.`);
  }
  const bar = (
    <nav
      className={['uu-bottombar', compact && 'uu-bottombar--compact', !action && className].filter(Boolean).join(' ')}
      {...rest}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            className="uu-bottombar__item"
            aria-current={active ? 'page' : undefined}
            aria-label={compact ? it.label : undefined}
            onClick={() => onChange(it.value)}
          >
            <span className="uu-bottombar__icon">
              <Icon name={it.icon} variant={active ? 'fill' : 'outline'} size={24} />
              {!active && it.badge !== undefined && (
                <NotificationBadge className="uu-bottombar__badge" count={it.badge} label={it.badgeLabel} />
              )}
            </span>
            {!compact && <span className="uu-bottombar__label">{it.label}</span>}
          </button>
        );
      })}
    </nav>
  );
  if (!action) return bar;
  const type = action.type ?? 'emphasized';
  return (
    <div className={['uu-bottombar-row', compact && 'uu-bottombar-row--compact', className].filter(Boolean).join(' ')}>
      {bar}
      <button
        type="button"
        className={['uu-bottombar__action', `uu-bottombar__action--${type}`, 'uu-interactive', type === 'emphasized' ? 'uu-on-dark' : 'uu-on-light'].join(' ')}
        aria-label={compact ? action.label : undefined}
        onClick={action.onClick}
      >
        <Icon name={action.icon} size={24} />
        {!compact && <span className="uu-bottombar__label">{action.label}</span>}
      </button>
    </div>
  );
}
