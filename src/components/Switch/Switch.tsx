import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon } from '../../icons';
import './Switch.css';

export type SwitchState = 'default' | 'hover' | 'focus' | 'pressed';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked: boolean;
  onChange?: (next: boolean) => void;
  /** Ép state để chụp docs. Disabled không có state layer. */
  state?: SwitchState;
}

/**
 * Switch (6.17) — công tắc bật/tắt CÓ HIỆU LỰC NGAY, khác Checkbox (chọn rồi mới bấm xác nhận).
 * Rãnh 56×32 radius 16. Núm nở từ 16 (tắt) lên 28 + icon `check` (bật). 10 variant.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ checked, onChange, state = 'default', className, onClick, ...rest }, ref) {
  return (
    <button ref={ref} type="button" role="switch" aria-checked={checked} data-state={state !== 'default' ? state : undefined}
      className={['uu-switch', className].filter(Boolean).join(' ')}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onChange?.(!checked); }} {...rest}>
      <span className="uu-switch__handle">{checked && <Icon name="check" variant="fill" size={16} />}</span>
    </button>
  );
});
