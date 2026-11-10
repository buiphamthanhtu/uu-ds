import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import './Checkbox.css';

export type CheckboxState = 'default' | 'hover' | 'pressed';
/** `Value` của bản thiết kế: Unchecked · Checked · Indeterminate. */
export type CheckboxValue = boolean | 'indeterminate';

export interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked: CheckboxValue;
  /** Bấm vào ô Indeterminate thì chuyển sang Checked. */
  onChange?: (next: boolean) => void;
  /** Ép state để chụp docs. Disabled không có hover/pressed. */
  state?: CheckboxState;
  /** `State=Error` của bản thiết kế: viền / nền đổi sang đỏ. Dùng khi ô bắt buộc chưa tick. */
  error?: boolean;
}

/** Ô tick 32×32 radius 12. Checked = mảng màu đặc `background-interactive` + icon `check` fill 20; Indeterminate = vạch 16×2. 15 variant. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox({ checked, onChange, state = 'default', error = false, className, onClick, ...rest }, ref) {
  const mixed = checked === 'indeterminate';
  return (
    <button ref={ref} type="button" role="checkbox" aria-checked={mixed ? 'mixed' : checked} data-state={state !== 'default' ? state : undefined} data-error={error || undefined} aria-invalid={error || undefined} className={['uu-checkbox', className].filter(Boolean).join(' ')}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onChange?.(mixed ? true : !checked); }} {...rest}>
      {mixed ? <span className="uu-checkbox__bar" /> : checked && <Icon name="check" variant="fill" size={20} />}
    </button>
  );
});

/**
 * Hình ô tick **không bấm được** (span, ẩn khỏi trình đọc màn hình) cho hàng tự là control — vd. option chọn nhiều của
 * `Menu`: hàng đã mang role + trạng thái, lồng một `<button role=checkbox>` vào là control lồng control (WCAG 4.1.2).
 */
export function CheckboxMark({ checked, disabled = false, className }: { checked: CheckboxValue; disabled?: boolean; className?: string }) {
  const mixed = checked === 'indeterminate';
  return (
    <span aria-hidden="true" aria-checked={mixed ? 'mixed' : checked} data-disabled={disabled || undefined} className={['uu-checkbox', className].filter(Boolean).join(' ')}>
      {mixed ? <span className="uu-checkbox__bar" /> : checked && <Icon name="check" variant="fill" size={20} />}
    </span>
  );
}

export interface CheckboxInputProps extends CheckboxProps {
  /** Nhãn hàng — chữ body object-primary, FILL. */
  children: ReactNode;
}

/** Hàng checkbox `CheckboxInput` (316×32 trong master): ô tick + chữ, vùng chạm cả hàng. */
export function CheckboxInput({ children, checked, onChange, id, disabled, error, className, ...rest }: CheckboxInputProps) {
  const autoId = useId();
  const boxId = id ?? autoId;
  return (
    <div className={['uu-choicerow', className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}
      onClick={(e) => { if (disabled || (e.target as HTMLElement).closest('button')) return; onChange?.(checked === 'indeterminate' ? true : !checked); }}>
      <Checkbox id={boxId} checked={checked} onChange={onChange} disabled={disabled} error={error} aria-labelledby={`${boxId}-label`} {...rest} />
      <span id={`${boxId}-label`} className="uu-choicerow__text">{children}</span>
    </div>
  );
}
