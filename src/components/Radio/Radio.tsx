import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import '../Checkbox/Checkbox.css';
import './Radio.css';

export type RadioState = 'default' | 'hover' | 'pressed';

export interface RadioProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked: boolean;
  onChange?: () => void;
  /** Ép state để chụp docs. Disabled không có hover/pressed. */
  state?: RadioState;
  /** `State=Error` của bản thiết kế: viền `border-negative`, chấm `object-negative`. Dùng khi nhóm bắt buộc chưa chọn. */
  error?: boolean;
}

/** Vòng tròn 32 — bằng cỡ ô tick, không phải 20 như radio mặc định của trình duyệt. Chấm 20 vẽ bởi recipe `.uu-radio` trong tokens.css. */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio({ checked, onChange, state = 'default', error = false, className, onClick, ...rest }, ref) {
  return (
    <button ref={ref} type="button" role="radio" aria-checked={checked} data-state={state !== 'default' ? state : undefined}
      data-error={error || undefined} aria-invalid={error || undefined}
      className={['uu-radio', className].filter(Boolean).join(' ')}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented && !checked) onChange?.(); }} {...rest}>
      {/* chấm 20 do tokens.css vẽ bằng ::before khi aria-checked=true */}
    </button>
  );
});

export interface RadioInputProps extends RadioProps {
  children: ReactNode;
}

/** Hàng radio `RadioInput`: vòng + cụm chữ, gap 12, canh mép trên, chữ đệm trên 4. Vùng chạm cả hàng. */
export function RadioInput({ children, checked, onChange, id, disabled, className, ...rest }: RadioInputProps) {
  const autoId = useId();
  const rid = id ?? autoId;
  return (
    <div className={['uu-choicerow', className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}
      onClick={(e) => { if (disabled || (e.target as HTMLElement).closest('button')) return; if (!checked) onChange?.(); }}>
      <Radio id={rid} checked={checked} onChange={onChange} disabled={disabled} aria-labelledby={`${rid}-label`} {...rest} />
      <span id={`${rid}-label`} className="uu-choicerow__text">{children}</span>
    </div>
  );
}

export interface RadioListProps<T extends string> {
  options: { value: T; label: ReactNode; disabled?: boolean }[];
  value?: T;
  onChange: (value: T) => void;
  'aria-label'?: string;
  className?: string;
}

/** Danh sách radio: các hàng cách 8, đường kẻ nét đứt giữa hai hàng. */
export function RadioList<T extends string>({ options, value, onChange, className, ...rest }: RadioListProps<T>) {
  return (
    <div role="radiogroup" aria-label={rest['aria-label']} className={['uu-radiolist', className].filter(Boolean).join(' ')}>
      {options.map((o) => (
        <RadioInput key={o.value} checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)}>{o.label}</RadioInput>
      ))}
    </div>
  );
}
