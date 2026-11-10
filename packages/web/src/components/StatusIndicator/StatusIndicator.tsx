import type { HTMLAttributes, ReactNode } from 'react';
import './StatusIndicator.css';

/** `highlight` không phải status mà là "mục này đáng chú ý" (Mới, Nổi bật, Đề xuất) — họ `accent`, đổi theo brand. */
export type StatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'highlight';
export type StatusContainer = 'none' | 'filled';

export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Prop thiết kế `Tone`. */
  tone?: StatusTone;
  /** Prop thiết kế `Container`: `none` = chấm + chữ trên nền thường · `filled` = viên thuốc nền status. */
  container?: StatusContainer;
  /** Chữ trạng thái, style title-sm 600. */
  children: ReactNode;
}

/** StatusIndicator (§6.15): chấm 8 + chữ, gap 6. Không state — không phải control. */
export function StatusIndicator({ tone = 'neutral', container = 'none', className, children, ...rest }: StatusIndicatorProps) {
  return (
    <span className={['uu-status', `uu-status--${tone}`, `uu-status--${container}`, className].filter(Boolean).join(' ')} {...rest}>
      <span className="uu-status__dot" aria-hidden="true" />
      <span className="uu-status__label">{children}</span>
    </span>
  );
}
