import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { Spinner } from '../Spinner';
import './Button.css';

export type ButtonTone = 'accent' | 'neutral' | 'danger';
export type ButtonType = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'large' | 'base' | 'small';
/** `hover` / `pressed` chỉ để ép trạng thái trong docs & test — sản phẩm thật dùng :hover / :active. */
export type ButtonState = 'default' | 'hover' | 'pressed' | 'disabled' | 'loading';

export interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** bản thiết kế: `TextButtonAccent` / `TextButtonNeutral` / `TextButtonDanger` (`IconButtonAccent` / `IconButtonNeutral`). `danger` chỉ có ở TextButton, không Inverted. */
  tone?: ButtonTone;
  /** Prop thiết kế `Type`. */
  type?: ButtonType;
  /** Prop thiết kế `Inverted` — dùng trên nền tối. Solid+Inverted có nền `background-surface`. */
  inverted?: boolean;
  /** Prop thiết kế `Size`: Large 56 · Base 48 · Small 32. */
  size?: ButtonSize;
  /** Prop thiết kế `State`. */
  state?: ButtonState;
  /** Thuộc tính `type` của thẻ `<button>` (submit/reset). */
  htmlType?: 'button' | 'submit' | 'reset';
}

export interface TextButtonProps extends Omit<ButtonBaseProps, 'type'> {
  /** Prop thiết kế `Type`. `tonal` chỉ có ở `TextButtonNeutral`, không có `Inverted`. */
  type?: ButtonType | 'tonal';
  /** Prop thiết kế `Action` — nhãn nút. */
  children: ReactNode;
  /** Prop thiết kế `Prefix` — icon bên trái chữ, cùng cỡ suffix. Loading thì spinner thay chỗ icon này. */
  prefix?: IconName;
  /** Prop thiết kế `Suffix` — icon bên phải (24 cho Large/Base, 16 cho Small). */
  suffix?: IconName;
}

/** Nền đặc/tối → 20/40; nền sáng/trong suốt → 5/10 (mục 6.0). Đúng cho cả 144 variant, không ngoại lệ. */
export function stateLayerClass(type: ButtonType | 'tonal', inverted: boolean): 'uu-on-dark' | 'uu-on-light' {
  const onDark = type === 'solid' ? !inverted : inverted;
  return onDark ? 'uu-on-dark' : 'uu-on-light';
}

export function buttonClassName(opts: { tone: ButtonTone; type: ButtonType | 'tonal'; inverted: boolean; size: ButtonSize; icon?: boolean; className?: string }) {
  return [
    'uu-btn', 'uu-interactive', stateLayerClass(opts.type, opts.inverted),
    `uu-btn--${opts.tone}`, `uu-btn--${opts.type}`, `uu-btn--${opts.size}`,
    opts.inverted && 'uu-btn--inverted',
    opts.icon && 'uu-iconbtn',
    opts.className,
  ].filter(Boolean).join(' ');
}

/** Loading khoá bấm như bản app (chuột đã bị `pointer-events: none` chặn; đây chặn cả Enter / Space). Không dùng `disabled` để giữ nguyên màu container. */
export function guardLoading(state: ButtonState, onClick?: MouseEventHandler<HTMLButtonElement>): MouseEventHandler<HTMLButtonElement> | undefined {
  if (state !== 'loading') return onClick;
  return (e) => e.preventDefault();
}

export function buttonStateAttrs(state: ButtonState) {
  return {
    disabled: state === 'disabled',
    'aria-disabled': state === 'loading' ? true : undefined,
    'aria-busy': state === 'loading' ? true : undefined,
    'data-state': state !== 'default' ? state : undefined,
  } as const;
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(function TextButton(
  { tone = 'accent', type = 'solid', inverted = false, size = 'base', state = 'default', prefix, suffix, htmlType = 'button', className, children, onClick, ...rest },
  ref,
) {
  return (
    <button ref={ref} type={htmlType} className={buttonClassName({ tone, type, inverted, size, className })} {...buttonStateAttrs(state)} {...rest} onClick={guardLoading(state, onClick)}>
      {state === 'loading' ? <Spinner /> : prefix && <Icon name={prefix} size={size === 'small' ? 16 : 24} />}
      <span className="uu-btn__label">{children}</span>
      {suffix && <Icon name={suffix} size={size === 'small' ? 16 : 24} />}
    </button>
  );
});

/** Tên khớp bản thiết kế. Cùng API với TextButton, chỉ cố định `tone`. */
type NoTonal<P> = Omit<P, 'type'> & { type?: ButtonType };
export const TextButtonAccent = forwardRef<HTMLButtonElement, NoTonal<Omit<TextButtonProps, 'tone'>>>(function TextButtonAccent(props, ref) {
  return <TextButton ref={ref} tone="accent" {...props} />;
});
export const TextButtonNeutral = forwardRef<HTMLButtonElement, Omit<TextButtonProps, 'tone'>>(function TextButtonNeutral(props, ref) {
  return <TextButton ref={ref} tone="neutral" {...props} />;
});
/** `TextButtonDanger` — hành động phá huỷ, không hoàn tác được (6.1). Không có `inverted`. */
export const TextButtonDanger = forwardRef<HTMLButtonElement, NoTonal<Omit<TextButtonProps, 'tone' | 'inverted'>>>(function TextButtonDanger(props, ref) {
  return <TextButton ref={ref} tone="danger" {...props} />;
});
