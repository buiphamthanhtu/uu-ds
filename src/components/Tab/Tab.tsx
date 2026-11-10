import { useEffect, useId, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { NotificationBadge } from '../NotificationBadge/NotificationBadge';
import './Tab.css';

/** Ép state để chụp docs. Sản phẩm thật dùng :hover / :active. */
export type TabState = 'default' | 'hover' | 'pressed';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Thiết kế: `Tab` (TEXT). Một dòng, không xuống dòng. */
  children: ReactNode;
  /** Thiết kế: `State=Active` — chữ `object-interactive` + gạch 32 × 4 dưới đáy. */
  active?: boolean;
  /** Thiết kế: `State=Hover` / `Pressed` ép để chụp docs. Chỉ có ở tab không Active. */
  state?: TabState;
  /** Thiết kế: `Icon` (BOOLEAN + INSTANCE_SWAP) — tên UU icon 16 trước chữ, cùng màu chữ. Active tự đổi sang `fill`. */
  icon?: IconName;
  /** Thiết kế: `Badge` (BOOLEAN) — `NotificationBadge` Dot sau chữ: mục có nội dung mới chưa xem. Kèm chữ ẩn "có mới". */
  badge?: boolean;
}

/**
 * Một mục tab (§6.20). 5 variant: `State` = Default · Active · Hover · Pressed · Disabled. Hug width, cao 48.
 * Hover/Pressed: state layer `object-primary` 5 / 10, radius `radius-sm`, chỉ tab không Active. Disabled: `object-disabled`.
 * `icon` / `badge` tuỳ chọn: nội dung thành hàng ngang căn giữa — icon 16 (gap 8) · chữ · Dot (gap 4). Cao vẫn 48.
 */
export function Tab({ children, active = false, state = 'default', icon, badge = false, className, disabled, ...rest }: TabProps) {
  return (
    <button
      type="button" role="tab" aria-selected={active} tabIndex={active ? 0 : -1} disabled={disabled}
      data-state={state !== 'default' && !active && !disabled ? state : undefined}
      className={['uu-tab', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className="uu-tab__content">
        {icon && <Icon name={icon} variant={active ? 'fill' : 'outline'} size={16} className="uu-tab__icon" />}
        <span className="uu-tab__label">{children}</span>
        {badge && (
          <>
            <NotificationBadge content="dot" aria-hidden="true" className="uu-tab__badge" />
            <span className="uu-tab__sr"> có mới</span>
          </>
        )}
      </span>
      {active && <span className="uu-tab__indicator" aria-hidden="true" />}
    </button>
  );
}

export interface TabBarItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Icon 16 trước chữ — xem `Tab` `icon`. */
  icon?: IconName;
  /** Dot "có mới" sau chữ — xem `Tab` `badge`. */
  badge?: boolean;
}

/** Thiết kế: `TabBar` `Layout`. `fixed` = 2–4 tab nhãn ngắn, chia đều · `scrollable` = ≥ 5 tab hoặc nhãn dài, cuộn ngang. */
export type TabBarLayout = 'fixed' | 'scrollable';

export interface TabBarProps {
  items: TabBarItem[];
  value: string;
  onChange: (value: string) => void;
  /** Thiết kế: `Layout`. Mặc định `fixed`. */
  layout?: TabBarLayout;
  'aria-label'?: string;
  className?: string;
}

/**
 * `TabBar` (§6.20) — hàng tab. HORIZONTAL · gap 0 · không nền · viền dưới 1px `border-muted` chạy suốt,
 * gạch Active đè lên viền. `fixed`: tab FILL chia đều. `scrollable`: tab HUG, cuộn ngang, padding trái 16,
 * tab Active tự cuộn vào tầm nhìn. `role="tablist"`, mũi tên trái/phải (và Home/End) chuyển tab.
 */
export function TabBar({ items, value, onChange, layout = 'fixed', className, ...rest }: TabBarProps) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);

  // Scrollable: kéo tab Active vào tầm nhìn khi đổi tab (chỉ cuộn ngang trong hàng, không cuộn trang).
  useEffect(() => {
    if (layout !== 'scrollable') return;
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!list || !el) return;
    const left = el.offsetLeft;
    const right = left + el.offsetWidth;
    const padStart = parseFloat(getComputedStyle(list).paddingLeft) || 0;
    if (left - padStart < list.scrollLeft) list.scrollTo({ left: Math.max(0, left - padStart), behavior: 'smooth' });
    else if (right > list.scrollLeft + list.clientWidth) list.scrollTo({ left: right - list.clientWidth, behavior: 'smooth' });
  }, [value, layout]);

  const move = (e: KeyboardEvent) => {
    const enabled = items.filter((x) => !x.disabled);
    if (!enabled.length) return;
    const i = enabled.findIndex((x) => x.value === value);
    let next: TabBarItem | undefined;
    if (e.key === 'ArrowRight') next = enabled[(i + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(i - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    onChange(next.value);
    listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };

  return (
    <div
      ref={listRef} role="tablist" aria-label={rest['aria-label']} aria-orientation="horizontal"
      data-layout={layout} className={['uu-tabbar', className].filter(Boolean).join(' ')}
    >
      {items.map((it) => (
        <Tab
          key={it.value} id={`${id}-${it.value}`} data-value={it.value} active={it.value === value} disabled={it.disabled}
          icon={it.icon} badge={it.badge}
          onClick={() => { if (it.value !== value) onChange(it.value); }}
          onKeyDown={move}
        >
          {it.label}
        </Tab>
      ))}
    </div>
  );
}
