import { useId, useRef } from 'react';
import { Icon } from '../../icons';
import { FieldLabel } from '../Field/FieldLabel';
import '../Field/Field.css';

/** Thiết kế: `State` (Default · Hover). `Value` (Empty/Filled) suy ra từ `value`. */
export type DateInputState = 'default' | 'hover';

export interface DateInputProps {
  label?: string;
  /** Giá trị ISO `YYYY-MM-DD` cho <input type="date"> ẩn bên dưới. */
  value?: string;
  onChange?: (isoDate: string) => void;
  /** Gợi ý khi trống. Bản thiết kế: `Bấm để chọn`. */
  placeholder?: string;
  min?: string;
  max?: string;
  /** Thiết kế: `Error` — viền `border-negative`, nhãn `object-negative`, dòng lỗi. */
  error?: boolean;
  errorMessage?: string;
  /** Thiết kế: `Disabled` — nền `background-disabled`, nhãn và gợi ý `object-disabled`. */
  disabled?: boolean;
  /** Ép state để chụp docs. */
  state?: DateInputState;
  fixedWidth?: boolean;
  className?: string;
}

/** Hiển thị theo `DD/MM/YYYY`. */
export function formatDateVN(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/**
 * DateInput (6.3c) — ô "chọn" ngày: chạm mở lịch của hệ điều hành, không nhận gõ tay.
 * 8 variant: Value Empty/Filled × State Default/Hover × Error × Disabled. Giá trị đã chọn dùng `body` 400.
 */
export function DateInput({ label, value = '', onChange, placeholder = 'Bấm để chọn', min, max, error = false, errorMessage, disabled, state, fixedWidth, className }: DateInputProps) {
  const id = useId();
  const nativeRef = useRef<HTMLInputElement>(null);
  const filled = Boolean(value);
  const open = () => {
    const el = nativeRef.current;
    if (!el || disabled) return;
    if (typeof el.showPicker === 'function') { try { el.showPicker(); return; } catch { /* fallthrough */ } }
    el.focus(); el.click();
  };
  return (
    <div className={['uu-fieldroot', fixedWidth && 'uu-fieldroot--fixed', className].filter(Boolean).join(' ')} data-error={error || undefined} data-disabled={disabled || undefined}>
      {label && <FieldLabel id={`${id}-label`}>{label}</FieldLabel>}
      <button type="button" className="uu-field uu-field--select uu-reset-button" aria-labelledby={label ? `${id}-label` : undefined} aria-haspopup="dialog"
        aria-invalid={error || undefined} aria-describedby={error && errorMessage ? `${id}-error` : undefined}
        onClick={open} disabled={disabled} data-state={state} data-value={filled ? 'filled' : 'empty'} data-error={error || undefined} data-disabled={disabled || undefined}>
        {filled ? <span className="uu-field__value uu-field__value--body">{formatDateVN(value)}</span> : <span className="uu-field__hint">{placeholder}</span>}
        <span className="uu-field__icon"><Icon name="calendar-days" size={24} /></span>
      </button>
      {error && <div id={`${id}-error`} className="uu-fielderror" role="alert">{errorMessage}</div>}
      <input ref={nativeRef} className="uu-visually-hidden" type="date" tabIndex={-1} aria-hidden="true" value={value} min={min} max={max} disabled={disabled} onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
}
