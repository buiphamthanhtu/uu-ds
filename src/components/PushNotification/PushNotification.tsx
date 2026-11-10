import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import './PushNotification.css';

export interface CardPushNotificationImage {
  /** Ảnh nguồn: logo đối tác, ảnh sản phẩm. */
  src: string;
  /** Ảnh là nội dung → bắt buộc `alt`. */
  alt: string;
}

export interface CardPushNotificationProps {
  /** Thiết kế: `Title` (TEXT) — body 600, tối đa 2 dòng. */
  title: ReactNode;
  /** Thiết kế: `Content` (TEXT) — body, tối đa 2 dòng. */
  content: ReactNode;
  /** Thiết kế: `Image` (BOOLEAN) — ảnh 48 radius-sm. Bỏ trống để ẩn. */
  image?: CardPushNotificationImage;
  /** Bấm cả thẻ để mở. Có `href` thì thẻ là liên kết `<a>`, không thì là `<button>`. */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  href?: string;
  /** Gọi khi thẻ tự ẩn (hết giờ), bị vuốt lên hoặc bấm Esc. Màn gỡ thẻ khỏi cây. */
  onDismiss?: () => void;
  /** Thời gian tự ẩn (ms). Mặc định 5000 theo spec. `0` = không tự ẩn (chỉ cho docs). */
  duration?: number;
  /** Vuốt lên để đóng (mặc định true; `placement="top-end"` luôn tắt — desktop không vuốt). */
  swipeToDismiss?: boolean;
  /**
   * Vị trí thẻ (`position: fixed`). Bỏ trống = màn tự đặt.
   * `top` — template `[Screen]PushNotification` (app): cách đỉnh safe area 8, lề 12 hai bên.
   * `top-end` — desktop: góc trên phải, cách mép trên và mép phải 16, rộng 360 (`size-90`); không vuốt.
   */
  placement?: 'top' | 'top-end';
  className?: string;
}

/** Vuốt lên quá ngưỡng này (px) thì đóng. */
const SWIPE_THRESHOLD = 32;

/**
 * `CardPushNotification` (§6.31) — thẻ ở đỉnh màn báo chuyện từ bên ngoài (đơn đổi trạng thái, quà mới, tin nhắn).
 * Không có type, không có nút: bấm cả thẻ để mở · vuốt lên / Esc để đóng · tự ẩn sau 5 giây, dừng đếm khi
 * đang hover / focus / chạm, rời ra thì đếm lại từ đầu. Một thẻ mỗi lúc: thẻ mới thay thẻ cũ (đổi `key`).
 * Vị trí: `placement` (app `top` · desktop `top-end`) hoặc để màn tự đặt.
 */
export function CardPushNotification({ title, content, image, onClick, href, onDismiss, duration = 5000, swipeToDismiss: swipeProp = true, placement, className }: CardPushNotificationProps) {
  const swipeToDismiss = swipeProp && placement !== 'top-end';
  const [paused, setPaused] = useState(false);
  const [dragY, setDragY] = useState(0);
  const drag = useRef<{ y: number; id: number; moved: boolean } | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);

  const dismiss = useCallback(() => onDismiss?.(), [onDismiss]);

  // Đếm ngược `duration`; dừng khi `paused`, hết dừng thì đếm lại từ đầu (spec: "rời chuột thì đếm lại").
  useEffect(() => {
    if (!duration || paused || !onDismiss) return;
    const t = window.setTimeout(dismiss, duration);
    return () => window.clearTimeout(t);
  }, [duration, paused, dismiss, onDismiss]);

  const syncPause = () => setPaused(hovered.current || focused.current || drag.current !== null);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    drag.current = { y: e.clientY, id: e.pointerId, moved: false };
    syncPause();
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !swipeToDismiss) return;
    const dy = Math.min(0, e.clientY - d.y); // chỉ kéo lên
    if (dy < -4 && !d.moved) { d.moved = true; e.currentTarget.setPointerCapture(e.pointerId); }
    if (d.moved) setDragY(dy);
  };
  const endDrag = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.y;
    if (swipeToDismiss && d.moved && dy <= -SWIPE_THRESHOLD) dismiss();
    setDragY(0);
    // giữ `moved` tới sau click để chặn click sinh ra từ cú vuốt
    window.setTimeout(() => { drag.current = null; syncPause(); }, 0);
  };
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (drag.current?.moved) { e.preventDefault(); return; }
    onClick?.(e);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') { e.stopPropagation(); dismiss(); }
  };

  const body = (
    <>
      {image && <img className="uu-push__image" src={image.src} alt={image.alt} />}
      <span className="uu-push__text">
        <span className="uu-push__title">{title}</span>
        <span className="uu-push__content">{content}</span>
      </span>
    </>
  );
  const common = {
    className: 'uu-push__card uu-interactive uu-on-light',
    style: dragY ? { transform: `translateY(${dragY}px)` } : undefined,
    onClick: handleClick,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onMouseEnter: () => { hovered.current = true; syncPause(); },
    onMouseLeave: () => { hovered.current = false; syncPause(); },
    onFocus: () => { focused.current = true; syncPause(); },
    onBlur: () => { focused.current = false; syncPause(); },
  };

  return (
    <div role="status" aria-live="polite" className={['uu-push', placement && `uu-push--${placement}`, className].filter(Boolean).join(' ')}>
      {href ? <a href={href} {...common}>{body}</a> : <button type="button" {...common}>{body}</button>}
    </div>
  );
}
