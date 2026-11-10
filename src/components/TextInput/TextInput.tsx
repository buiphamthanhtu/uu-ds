import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { FieldLabel } from '../Field/FieldLabel';
import { TextButtonNeutral } from '../Button/TextButton';
import '../Field/Field.css';

/** Thiết kế: `State`. `Value` (Empty/Filled) suy ra từ `value` của input. */
export type TextInputState = 'default' | 'hover' | 'focus' | 'typing';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  /** Thiết kế: `Label` (BOOLEAN) — truyền chuỗi để hiện, bỏ trống để ẩn. */
  label?: string;
  requirement?: 'required' | 'optional';
  tooltip?: string;
  /** Thiết kế: `Prefix`: `base/prefix` Type=Icon (24) hoặc Type=Label. */
  prefix?: { icon: IconName } | { label: string };
  /** Thiết kế: `Action`: `TextButtonNeutral` Ghost Small trong suffix, sau vạch ngăn 1px `border-muted`. */
  action?: { label: ReactNode; onClick?: () => void };
  /** Thiết kế: `Error` — bật viền đỏ, label đỏ và dòng lỗi (chiếm chỗ thật, root cao 100 thay vì 76). */
  error?: boolean;
  errorMessage?: string;
  /** Thiết kế: `Helper text` — dòng gợi ý dưới label, trên ô (caption `object-secondary`). Có lỗi thì vẫn hiện; dòng lỗi nằm dưới ô. */
  helperText?: string;
  /** Thiết kế: `State` ép để chụp docs. Bình thường suy ra từ focus (Focus khi rỗng, Typing khi có chữ). */
  state?: TextInputState;
  /** Root FIXED 187 như master; mặc định FILL theo container. */
  fixedWidth?: boolean;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, requirement, tooltip, prefix, action, error = false, errorMessage, helperText, state, fixedWidth, className, id, disabled, onFocus, onBlur, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const derived: TextInputState = state ?? (focused ? (rest.value ? 'typing' : 'focus') : 'default');
  const valueState = rest.value ? 'filled' : 'empty';
  return (
    <div className={['uu-fieldroot', fixedWidth && 'uu-fieldroot--fixed', className].filter(Boolean).join(' ')} data-error={error || undefined} data-disabled={disabled || undefined}>
      {label && <FieldLabel htmlFor={inputId} requirement={requirement} tooltip={tooltip}>{label}</FieldLabel>}
      {helperText && <div id={`${inputId}-helper`} className="uu-fieldhelper">{helperText}</div>}
      <div className="uu-field" data-state={derived} data-value={valueState} data-error={error || undefined} data-disabled={disabled || undefined}>
        {prefix && ('icon' in prefix
          ? <span className="uu-field__prefix"><Icon name={prefix.icon} size={24} /></span>
          : <span className="uu-field__prefix uu-field__prefix--label">{prefix.label}</span>)}
        <input
          ref={ref} id={inputId} className="uu-field__input" disabled={disabled}
          aria-invalid={error || undefined} aria-describedby={[helperText && `${inputId}-helper`, error && errorMessage && `${inputId}-error`].filter(Boolean).join(' ') || undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }} onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
        {action && (
          <span className="uu-field__suffix">
            <TextButtonNeutral type="ghost" size="small" onClick={action.onClick} tabIndex={-1}>{action.label}</TextButtonNeutral>
          </span>
        )}
      </div>
      {error && <div id={`${inputId}-error`} className="uu-fielderror" role="alert">{errorMessage}</div>}
    </div>
  );
});
