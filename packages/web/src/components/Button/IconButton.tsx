import { forwardRef } from 'react';
import { Icon, type IconName, type IconVariant } from '../../icons';
import { Spinner } from '../Spinner';
import { buttonClassName, buttonStateAttrs, guardLoading, type ButtonBaseProps } from './TextButton';
import './Button.css';

export interface IconButtonProps extends Omit<ButtonBaseProps, 'tone'> {
  /** Chỉ hai bộ `IconButtonAccent` / `IconButtonNeutral` — không có IconButton Danger. */
  tone?: 'accent' | 'neutral';
  /** Tên UU icon. Hộp 24 cho Large/Base, 16 cho Small — nét thật ≈ 60–65% hộp là đúng thiết kế. */
  icon: IconName;
  iconVariant?: IconVariant;
  /** Bắt buộc: nút không có chữ nên cần tên cho screen reader. */
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { tone = 'accent', type = 'solid', inverted = false, size = 'base', state = 'default', icon, iconVariant = 'outline', label, htmlType = 'button', className, onClick, ...rest },
  ref,
) {
  return (
    <button ref={ref} type={htmlType} aria-label={label} className={buttonClassName({ tone, type, inverted, size, icon: true, className })} {...buttonStateAttrs(state)} {...rest} onClick={guardLoading(state, onClick)}>
      {state === 'loading' ? <Spinner /> : <Icon name={icon} variant={iconVariant} size={size === 'small' ? 16 : 24} />}
    </button>
  );
});

export const IconButtonAccent = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'tone'>>(function IconButtonAccent(props, ref) {
  return <IconButton ref={ref} tone="accent" {...props} />;
});
export const IconButtonNeutral = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'tone'>>(function IconButtonNeutral(props, ref) {
  return <IconButton ref={ref} tone="neutral" {...props} />;
});
