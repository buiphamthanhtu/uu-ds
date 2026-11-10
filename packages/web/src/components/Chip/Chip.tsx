import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { MenuAnchor } from '../Menu/MenuAnchor';
import './Chip.css';

export type ChipType = 'select' | 'dropdown' | 'input';
export type ChipState = 'default' | 'hover' | 'pressed';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> {
  children: ReactNode;
  /** Thiết kế: `Type`. `select` = chip chọn một / chọn nhiều / lọc. `dropdown` = chip bung danh sách (có chevron).
   * `input` = một giá trị đã nhập / đã áp dụng, gỡ được bằng nút `xmark` cuối chip; thân chip không bấm được. */
  type?: ChipType;
  /** Thiết kế: `Selected`. Với `dropdown` nghĩa là "đã có giá trị". Không áp dụng cho `input`. */
  selected?: boolean;
  onSelectedChange?: (next: boolean) => void;
  /** Thiết kế: `Prefix icon` — icon 16 trước chữ, cùng màu chữ. `select` đã chọn thì icon `check` thay chỗ. */
  prefixIcon?: IconName;
  /** Chỉ `type="dropdown"`: panel `Menu` đang mở. Trong lúc mở chip hiện `Selected=True` và chevron đổi `chevron-up`. */
  open?: boolean;
  /** Chỉ `type="dropdown"`: panel `Menu` `platform="panel"` — chip tự neo nó (`MenuAnchor`, rộng tối thiểu 240). */
  menu?: ReactNode;
  /** Chỉ `type="dropdown"` + `menu`: đóng panel (bấm ra ngoài, Esc, chọn xong ở `Type=Single`). */
  onClose?: () => void;
  /** Chỉ `type="input"`: bấm nút gỡ, hoặc Backspace / Delete khi nút có focus. Focus tự sang chip kế tiếp;
   * hết chip thì màn đưa focus về ô nhập. */
  onRemove?: () => void;
  /** Chỉ `type="input"`: nhãn đọc màn hình của nút gỡ. Mặc định "Gỡ {nhãn}". */
  removeLabel?: string;
  /** Ép state để chụp docs. Disabled không có state layer. `input`: áp lên nút gỡ. */
  state?: ChipState;
}

/** Nút gỡ của chip `input` kế tiếp trong cùng hàng — để focus không rơi mất khi chip bị gỡ. */
function nextRemoveTarget(from: HTMLElement): HTMLElement | null {
  let cur = from.closest('.uu-chip')?.nextElementSibling ?? null;
  while (cur) {
    const btn = cur.matches('.uu-chip[data-type="input"]') ? cur.querySelector<HTMLElement>('.uu-chip__remove:not(:disabled)') : null;
    if (btn) return btn;
    cur = cur.nextElementSibling;
  }
  return null;
}

/**
 * Chip (6.18) — nhãn bấm được, giữ trạng thái đã chọn. Cùng thang với `TextButtonNeutral` Small:
 * cao 32, padding 4/12, gap 8, radius circle, viền 2px, chữ 16/24. 20 variant (16 + 4 `Type=Input`).
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { children, type = 'select', selected = false, onSelectedChange, prefixIcon, open = false, menu, onClose, onRemove, removeLabel, state = 'default', className, disabled, onClick, ...rest },
  ref,
) {
  const dataState = state !== 'default' ? state : undefined;
  const prefix = prefixIcon && <span className="uu-chip__icon"><Icon name={prefixIcon} size={16} /></span>;

  if (type === 'input') {
    const name = removeLabel ?? `Gỡ ${typeof children === 'string' || typeof children === 'number' ? children : ''}`.trim();
    const remove = (el: HTMLElement) => {
      if (disabled) return;
      const next = nextRemoveTarget(el);
      onRemove?.();
      if (next) requestAnimationFrame(() => next.focus());
    };
    return (
      <span
        className={['uu-chip', className].filter(Boolean).join(' ')}
        data-type="input" data-state={dataState} data-disabled={disabled || undefined}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      >
        {prefix}
        <span className="uu-chip__label">{children}</span>
        <button
          ref={ref} type="button" className="uu-chip__remove" aria-label={name} disabled={disabled}
          onClick={(e) => remove(e.currentTarget)}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); remove(e.currentTarget); }
          }}
        >
          <Icon name="xmark" size={16} />
        </button>
      </span>
    );
  }

  const dropdown = type === 'dropdown';
  const expanded = dropdown && open;
  const shownSelected = selected || expanded;
  const chip = (
    <button
      ref={ref}
      type="button"
      className={['uu-chip', className].filter(Boolean).join(' ')}
      data-type={type}
      data-selected={shownSelected || undefined}
      data-state={dataState}
      disabled={disabled}
      aria-pressed={dropdown ? undefined : selected}
      aria-haspopup={dropdown ? 'listbox' : undefined}
      aria-expanded={dropdown ? expanded : undefined}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onSelectedChange?.(!selected); }}
      {...rest}
    >
      {/* Một chip chỉ có một icon đầu: Select đã chọn thì check thay chỗ icon trước chữ. */}
      {!dropdown && shownSelected ? <span className="uu-chip__check"><Icon name="check" variant="fill" size={16} /></span> : prefix}
      <span className="uu-chip__label">{children}</span>
      {dropdown && <span className="uu-chip__chevron"><Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={16} /></span>}
    </button>
  );
  if (dropdown && menu !== undefined) {
    return <MenuAnchor open={expanded && !disabled} onClose={onClose} width="min" anchor={chip}>{menu}</MenuAnchor>;
  }
  return chip;
});
