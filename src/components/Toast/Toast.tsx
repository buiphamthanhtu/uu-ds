import type { ReactNode } from 'react';
import { TextButtonNeutral } from '../Button/TextButton';
import { IconButtonNeutral } from '../Button/IconButton';
import './Toast.css';

export type ToastType = 'neutral' | 'negative' | 'positive' | 'warning';

export interface ToastProps {
  type?: ToastType;
  /** Thiết kế: `Content` — chữ style body (400), không phải label. */
  children: ReactNode;
  /** Thiết kế: `Action` — nút TextButtonNeutral Solid Base. Bỏ trống để ẩn. */
  action?: { label: ReactNode; onClick?: () => void };
  /** Nút đóng IconButtonNeutral Ghost Base, glyph xmark hiện ~15px trong hộp 24 — đúng thiết kế. */
  onClose?: () => void;
  className?: string;
}

/** Nền tối (Neutral/Negative/Positive) → nút Inverted=True; nền sáng (Warning) → Inverted=False. Không ngoại lệ. */
export function Toast({ type = 'neutral', children, action, onClose, className }: ToastProps) {
  const inverted = type !== 'warning';
  return (
    <div role={type === 'negative' ? 'alert' : 'status'} className={['uu-toast', `uu-toast--${type}`, className].filter(Boolean).join(' ')}>
      <div className="uu-toast__content">{children}</div>
      {action && <TextButtonNeutral type="solid" inverted={inverted} size="base" onClick={action.onClick}>{action.label}</TextButtonNeutral>}
      {onClose && <IconButtonNeutral type="ghost" inverted={inverted} size="base" icon="xmark" label="Đóng" onClick={onClose} />}
    </div>
  );
}
