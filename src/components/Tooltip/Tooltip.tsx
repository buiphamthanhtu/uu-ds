import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from 'react';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TriggerProps = { 'aria-describedby'?: string; 'aria-labelledby'?: string };

export interface TooltipProps {
  /** Thiết kế: `Text` (TEXT). Chỉ chữ thuần — cần link hay nút thì dùng `Popover`. */
  text: string;
  /** Thiết kế: `Placement`. Bong bóng nằm phía nào của phần tử; mũi tên chỉ về phần tử. */
  placement?: TooltipPlacement;
  /** Phần tử được giải thích (một phần tử duy nhất, nhận được focus). Tooltip gắn `aria-describedby` vào nó. */
  children: ReactElement<TriggerProps>;
  /**
   * Ép hiện / ẩn để chụp docs. Bỏ trống: hover hiện sau 500 ms, focus bàn phím hiện ngay; rời ra, mất focus
   * hoặc bấm Esc thì ẩn ngay.
   */
  open?: boolean;
  /**
   * `description` (mặc định): chữ tooltip là mô tả thêm (`aria-describedby`).
   * `label`: chữ tooltip là tên duy nhất của phần tử (`aria-labelledby`) — vd. mục `SideNav` thu gọn
   * không có nhãn trên màn. Dùng khi phần tử chưa có tên nào khác, tránh đọc trùng.
   */
  relation?: 'description' | 'label';
  className?: string;
}

/** Hover giữ yên 500 ms mới hiện — lướt chuột qua không bật tooltip (§6.30). */
export const TOOLTIP_HOVER_DELAY = 500;
/**
 * Cửa sổ "warm": một tooltip vừa ẩn chưa quá 300 ms (hoặc đang mở) thì tooltip kế bên hiện ngay, không chờ lại
 * 500 ms. Spec chỉ ghi "hiện ngay, không chờ lại"; 300 ms là số code chọn — đủ để rê sang nút bên cạnh.
 */
export const TOOLTIP_WARM_WINDOW = 300;

// Dùng chung mọi Tooltip trên trang: có bao nhiêu cái đang mở, cái gần nhất ẩn lúc nào.
let openCount = 0;
let lastHiddenAt = -Infinity;
const isWarm = () => openCount > 0 || performance.now() - lastHiddenAt < TOOLTIP_WARM_WINDOW;

/**
 * Tooltip (§6.30): nhãn ngắn hiện khi hover **và** focus bàn phím. 4 variant = `Placement`.
 * Bong bóng `background-inverted`, chữ `caption` `object-primary-inverted`, padding 4/8, radius `radius-sm`,
 * max-width 240, mũi tên 8 × 4 giữa cạnh hướng về phần tử. Không dùng trên màn chạm.
 * Thời gian: hover hiện sau 500 ms, focus bàn phím hiện ngay, ẩn ngay không mờ dần; đang warm thì hiện ngay.
 */
export function Tooltip({ text, placement = 'top', children, open, relation = 'description', className }: TooltipProps) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const visible = open ?? shown;

  // Đếm tooltip đang mở và ghi lúc ẩn — để tooltip kế bên biết đang "warm".
  useEffect(() => {
    if (!shown) return;
    openCount += 1;
    return () => { openCount -= 1; lastHiddenAt = performance.now(); };
  }, [shown]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => { clearTimeout(timer.current); setShown(true); };
  const hide = () => { clearTimeout(timer.current); setShown(false); };
  const hoverIn = () => {
    if (shown) return;
    if (isWarm()) show();
    else { clearTimeout(timer.current); timer.current = setTimeout(show, TOOLTIP_HOVER_DELAY); }
  };

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shown]);

  const attr = relation === 'label' ? 'aria-labelledby' : 'aria-describedby';
  const prev = children.props[attr];
  const trigger = cloneElement(children, { [attr]: prev ? `${prev} ${id}` : id });

  return (
    <span
      className={['uu-tooltip-anchor', className].filter(Boolean).join(' ')}
      onMouseEnter={hoverIn}
      onMouseLeave={hide}
      onFocus={(e) => { if ((e.target as HTMLElement).matches(':focus-visible')) show(); }}
      onBlur={hide}
    >
      {trigger}
      <span id={id} role="tooltip" className={`uu-tooltip uu-tooltip--${placement}`} data-open={visible || undefined}>
        {text}
      </span>
    </span>
  );
}
