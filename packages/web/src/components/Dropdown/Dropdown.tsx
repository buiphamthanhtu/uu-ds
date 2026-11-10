import { useId, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { FieldLabel } from '../Field/FieldLabel';
import { MenuAnchor } from '../Menu/MenuAnchor';
import '../Field/Field.css';

/** Thiết kế: `State` (Default · Hover). `Value` (Empty/Filled) suy ra từ `value`. */
export type DropdownState = 'default' | 'hover';

export interface DropdownProps {
  label?: string;
  /** Giá trị đã chọn để hiển thị (prop thiết kế `Data`) — style `label` 600. */
  value?: string;
  placeholder?: string;
  /** Chạm vào ô. Danh sách bung ra là `Menu` (§6.21): truyền `menu` để ô tự neo panel, hoặc mở `platform="sheet"`. */
  onOpen?: () => void;
  /** Panel `Menu` `platform="panel"` — ô tự neo dưới mình (`MenuAnchor`): cách 4, rộng bằng ô, lật lên khi thiếu chỗ. */
  menu?: ReactNode;
  /** Panel `menu` đang mở. */
  open?: boolean;
  /** Đóng panel `menu`: chọn xong (`Type=Single`), bấm ra ngoài, Esc, Tab ra khỏi ô. */
  onClose?: () => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  state?: DropdownState;
  fixedWidth?: boolean;
  className?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  /** Tên cho screen reader khi ô không có `label` (vd. ô số dòng trong `TablePagination`). */
  'aria-label'?: string;
}

/**
 * Dropdown (6.4) — ô "chọn": gợi ý body 400 secondary · giá trị `label` 600 primary · chevron-down 16 secondary.
 * 8 variant: Value Empty/Filled × State Default/Hover × Error × Disabled.
 */
export function Dropdown({ label, value, placeholder = 'Bấm để chọn', onOpen, menu, open = false, onClose, error = false, errorMessage, disabled, state, fixedWidth, className, ...aria }: DropdownProps) {
  const id = useId();
  const filled = Boolean(value);
  const hasMenu = menu !== undefined;
  const field = (
    <button type="button" className="uu-field uu-field--select uu-reset-button" aria-labelledby={label ? `${id}-label` : undefined} aria-haspopup="listbox"
      aria-expanded={hasMenu ? open && !disabled : undefined}
      aria-invalid={error || undefined} aria-describedby={error && errorMessage ? `${id}-error` : undefined}
      onClick={onOpen} disabled={disabled} data-state={state} data-value={filled ? 'filled' : 'empty'} data-error={error || undefined} data-disabled={disabled || undefined} {...aria}>
      {filled ? <span className="uu-field__value">{value}</span> : <span className="uu-field__hint">{placeholder}</span>}
      <span className="uu-field__icon"><Icon name="chevron-down" size={16} /></span>
    </button>
  );
  return (
    <div className={['uu-fieldroot', fixedWidth && 'uu-fieldroot--fixed', className].filter(Boolean).join(' ')} data-error={error || undefined} data-disabled={disabled || undefined}>
      {label && <FieldLabel id={`${id}-label`}>{label}</FieldLabel>}
      {hasMenu
        ? <MenuAnchor open={open && !disabled} onClose={onClose} anchor={field}>{menu}</MenuAnchor>
        : field}
      {error && <div id={`${id}-error`} className="uu-fielderror" role="alert">{errorMessage}</div>}
    </div>
  );
}
