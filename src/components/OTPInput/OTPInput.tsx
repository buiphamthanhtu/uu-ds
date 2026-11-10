import { useId, useRef, useState } from 'react';
import '../Field/Field.css';
import './OTPInput.css';

/** Thiết kế: `State`. `Value` (Empty/Filled) suy ra từ `value`. */
export type OTPState = 'default' | 'focus' | 'typing';

export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Mặc định 6 ô như master (328 = 6×48 + 5×8). */
  length?: number;
  /** Thiết kế: `Masked` — ẩn chữ số (mã PIN): ô đã điền hiện chấm 8. */
  masked?: boolean;
  /** Thiết kế: `Error` — lỗi chỉ hiện sau khi nhập đủ: cả 6 ô viền đỏ, chữ giữ nguyên, không ô nào có con trỏ. */
  error?: boolean;
  /** Dòng lỗi caption object-negative, CĂN GIỮA (khác Text input căn trái). */
  errorMessage?: string;
  disabled?: boolean;
  /** Gọi khi nhập đủ `length` chữ số. */
  onComplete?: (value: string) => void;
  /** Ép state để chụp docs. */
  state?: OTPState;
  'aria-label'?: string;
  className?: string;
}

export function OTPInput({ value, onChange, length = 6, masked = false, error = false, errorMessage, disabled, onComplete, state, className, ...rest }: OTPInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const digits = value.replace(/\D/g, '').slice(0, length);
  const isFocused = state ? state === 'focus' || state === 'typing' : focused;
  const valueState = digits.length ? 'filled' : 'empty';
  const caretIndex = Math.min(digits.length, length - 1);
  return (
    <div className={['uu-otp', className].filter(Boolean).join(' ')} data-value={valueState} data-error={error || undefined} data-disabled={disabled || undefined}>
      <div className="uu-otp__cells" onClick={() => inputRef.current?.focus()} aria-hidden="true">
        {Array.from({ length }, (_, i) => {
          const ch = digits[i];
          const showCaret = isFocused && !error && i === caretIndex && digits.length < length;
          const cls = ['uu-otp__cell', !ch && 'uu-otp__cell--empty', showCaret && 'uu-otp__cell--focus'].filter(Boolean).join(' ');
          return (
            <span key={i} className={cls}>
              {ch ? (masked ? <span className="uu-otp__dot" /> : ch) : '-'}
            </span>
          );
        })}
      </div>
      <input
        ref={inputRef} id={id} className="uu-otp__input" type={masked ? 'password' : 'text'} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*"
        maxLength={length} value={digits} disabled={disabled} aria-label={rest['aria-label'] ?? 'Mã xác thực'}
        aria-invalid={error || undefined} aria-describedby={error && errorMessage ? `${id}-error` : undefined}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={(e) => {
          const next = e.target.value.replace(/\D/g, '').slice(0, length);
          onChange(next);
          if (next.length === length) onComplete?.(next);
        }}
      />
      {error && <div id={`${id}-error`} className="uu-fielderror uu-fielderror--center" role="alert">{errorMessage}</div>}
    </div>
  );
}
