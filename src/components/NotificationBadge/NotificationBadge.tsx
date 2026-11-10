import type { HTMLAttributes } from 'react';
import './NotificationBadge.css';

export type NotificationContent = 'count' | 'dot';

export interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Prop thiết kế `Content`: `count` hiện số · `dot` chỉ chấm 8×8. */
  content?: NotificationContent;
  /** Số hiển thị khi `content="count"`. Truyền đúng chuỗi muốn hiện (vd. "99+"). */
  count?: number | string;
  /** Chữ cho trình đọc màn hình, ví dụ "3 thông báo mới". */
  label?: string;
}

/** NotificationBadge (§6.16): Count 16×min16 · Dot 8×8 · nền background-attention (có mới, chưa xem). Màn tự đặt vị trí neo. */
export function NotificationBadge({ content = 'count', count = 0, label, className, ...rest }: NotificationBadgeProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      className={['uu-notif', `uu-notif--${content}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {content === 'count' ? count : null}
    </span>
  );
}
