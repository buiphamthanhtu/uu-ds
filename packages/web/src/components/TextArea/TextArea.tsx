import { forwardRef, useId, useState, type TextareaHTMLAttributes } from 'react';
import { FieldLabel } from '../Field/FieldLabel';
import type { TextInputState } from '../TextInput/TextInput';
import '../Field/Field.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  requirement?: 'required' | 'optional';
  tooltip?: string;
  error?: boolean;
  errorMessage?: string;
  /** Thiết kế: `Helper text` — dòng gợi ý dưới label, trên ô (caption `object-secondary`). Có lỗi thì vẫn hiện; dòng lỗi nằm dưới ô. */
  helperText?: string;
  /** Bộ đếm `(n/max)` góc phải dưới, style caption. Mặc định 100 như bản thiết kế. */
  maxLength?: number;
  state?: TextInputState;
  className?: string;
}

/** Ô nhập nhiều dòng (6.3e): cùng shell với TextInput, Field VERTICAL cao 112, padding 12, có bộ đếm. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, requirement, tooltip, error = false, errorMessage, helperText, maxLength = 100, state, className, id, disabled, onFocus, onBlur, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const value = typeof rest.value === 'string' ? rest.value : '';
  const derived = state ?? (focused ? (value ? 'typing' : 'focus') : 'default');
  return (
    <div className={['uu-fieldroot', className].filter(Boolean).join(' ')} data-error={error || undefined} data-disabled={disabled || undefined}>
      {label && <FieldLabel htmlFor={inputId} requirement={requirement} tooltip={tooltip}>{label}</FieldLabel>}
      {helperText && <div id={`${inputId}-helper`} className="uu-fieldhelper">{helperText}</div>}
      <div className="uu-field uu-field--area" data-state={derived} data-value={value ? 'filled' : 'empty'} data-error={error || undefined} data-disabled={disabled || undefined}>
        <textarea
          ref={ref} id={inputId} className="uu-field__input" disabled={disabled} maxLength={maxLength}
          aria-invalid={error || undefined} aria-describedby={[helperText && `${inputId}-helper`, error && errorMessage && `${inputId}-error`].filter(Boolean).join(' ') || undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }} onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
        <span className="uu-field__counter" aria-live="polite">({value.length}/{maxLength})</span>
      </div>
      {error && <div id={`${inputId}-error`} className="uu-fielderror" role="alert">{errorMessage}</div>}
    </div>
  );
});
