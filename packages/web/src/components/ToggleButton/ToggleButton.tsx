import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../../icons';
import type { ButtonSize } from '../Button/TextButton';
import '../Button/Button.css';
import './ToggleButton.css';

export type ToggleButtonState = 'default' | 'hover' | 'pressed' | 'disabled';

export interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children' | 'onToggle'> {
  /** Prop thiết kế `Active` — trạng thái BẬT (khác hẳn State=Pressed của button). */
  active: boolean;
  onToggle?: (next: boolean) => void;
  size?: ButtonSize;
  state?: ToggleButtonState;
  /** UU icon: `outline` khi tắt, tự đổi sang `fill` khi bật. */
  icon: IconName;
  /** Thiết kế: `↳ Label` — chữ khi tắt. Bỏ trống = icon-only (`Label=False`). */
  label?: string;
  /** Thiết kế: `↳ Active label` — chữ khi bật (vd. Theo dõi → Đang theo dõi). Mặc định = label. */
  activeLabel?: string;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { active, onToggle, size = 'base', state = 'default', icon, label, activeLabel, className, onClick, ...rest },
  ref,
) {
  const text = active ? (activeLabel ?? label) : label;
  const iconOnly = !label;
  if (import.meta.env?.DEV && iconOnly && !rest['aria-label']) console.warn('[UU DS] ToggleButton icon-only cần aria-label — icon không có tên đọc.');
  const cls = [
    'uu-btn', 'uu-interactive', active ? 'uu-on-dark' : 'uu-on-light',
    `uu-btn--${size}`, iconOnly && 'uu-iconbtn',
    'uu-togglebtn', active ? 'uu-togglebtn--on uu-is-active' : 'uu-togglebtn--off', /* .uu-is-active = typography mode Active */
    className,
  ].filter(Boolean).join(' ');
  return (
    <button
      ref={ref} type="button" aria-pressed={active} className={cls}
      disabled={state === 'disabled'} data-state={state !== 'default' ? state : undefined}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onToggle?.(!active); }}
      {...rest}
    >
      <Icon name={icon} variant={active ? 'fill' : 'outline'} size={size === 'small' ? 16 : 24} />
      {text && <span className="uu-btn__label">{text}</span>}
    </button>
  );
});
