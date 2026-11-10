import type { HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import './Badge.css';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'error';

/** Icon đi theo tone (§6.14), không đổi được. */
const TONE_ICON: Record<BadgeTone, IconName> = {
  neutral: 'circle-info',
  success: 'circle-check',
  warning: 'circle-warning',
  error: 'triangle-warning',
};

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Prop thiết kế `Tone`. */
  tone?: BadgeTone;
  /** Chữ một dòng, style title-sm 600. */
  children: ReactNode;
}

/** Badge (§6.14): viên thuốc cao 24, icon 16 fill luôn hiện trước chữ, padding 4/8, không state — không phải control. */
export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span className={['uu-badge', `uu-badge--${tone}`, className].filter(Boolean).join(' ')} {...rest}>
      <Icon name={TONE_ICON[tone]} variant="fill" size={16} className="uu-badge__icon" />
      {children}
    </span>
  );
}
