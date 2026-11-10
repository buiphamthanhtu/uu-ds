import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { IconButtonNeutral } from '../Button/IconButton';
import { ButtonGroup, type ButtonGroupProps } from '../ButtonGroup/ButtonGroup';
import './BottomSheet.css';

export type CardSheetHeight = 'fit' | 'full';

export interface CardSheetProps {
  /** Thiết kế: `Header` (TEXT). */
  header: string;
  /** Thiết kế: `Navigation=Close` — nút đóng bên phải. Sheet kéo được cũng gọi hàm này khi bị kéo xuống quá 1/3 ở `Fit`. */
  onClose?: () => void;
  /** Thiết kế: `Navigation=Back` — truyền `onBack` thì có nút quay lại bên trái và **không có nút đóng**. */
  onBack?: () => void;
  /** Thiết kế: `Slot`. */
  children?: ReactNode;
  /** Thiết kế: `CTA` — hiện/ẩn TOÀN BỘ nhóm nút. Nút phụ, hướng xếp và `tone` là prop của Button group. */
  cta?: ButtonGroupProps | false;
  /** Thiết kế: `Handle` — thanh kéo 32 × 4 ở đỉnh. Không có thanh kéo thì sheet không kéo được. */
  handle?: boolean;
  /**
   * Thiết kế: `Height`. `fit` cao theo nội dung · `full` cao tới cách đỉnh khung chứa 12 (BottomSheet: đỉnh safe area),
   * Body cuộn, Header và nhóm nút đứng yên. Truyền vào = điều khiển từ ngoài; bỏ trống thì sheet tự giữ nấc.
   */
  height?: CardSheetHeight;
  /** Nấc ban đầu khi không điều khiển `height`. */
  defaultHeight?: CardSheetHeight;
  /** Gọi khi người dùng kéo / bấm thanh kéo đổi nấc. */
  onHeightChange?: (height: CardSheetHeight) => void;
  className?: string;
}

/** Ngưỡng (px) để phân biệt kéo với bấm trên thanh kéo. */
const DRAG_SLOP = 4;

/**
 * `CardSheet` — chỉ tấm sheet: (thanh kéo) · header (Back hoặc Close, Outline Small 32) · body (slot + Button group).
 * Kéo thanh: ở `Fit` kéo xuống quá 1/3 chiều cao → `onClose`; kéo lên → `Full`. Ở `Full` kéo xuống → về `Fit`.
 * Thả giữa chừng về nấc gần nhất. Bấm / Enter trên thanh đổi nấc.
 */
export function CardSheet({ header, onClose, onBack, children, cta, handle = false, height, defaultHeight = 'fit', onHeightChange, className }: CardSheetProps) {
  const [own, setOwn] = useState<CardSheetHeight>(defaultHeight);
  const current = handle ? (height ?? own) : 'fit';
  const sheet = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; y: number; h0: number; fitH: number; fullH: number; moved: boolean } | null>(null);
  const [live, setLive] = useState<{ height?: number; y?: number } | null>(null);

  const change = (next: CardSheetHeight) => {
    if (next === current) return;
    if (height === undefined) setOwn(next);
    onHeightChange?.(next);
  };

  /** Chiều cao nấc `Fit` = cao hiện tại − phần Slot đang hiện + toàn bộ nội dung Slot. Nấc `Full` = khung chứa. */
  const measure = () => {
    const el = sheet.current!;
    const s = slot.current!;
    const parent = el.parentElement!;
    const cs = getComputedStyle(parent);
    const fullH = parent.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const fitH = Math.min(fullH, el.offsetHeight - s.clientHeight + s.scrollHeight);
    return { h0: el.offsetHeight, fitH, fullH };
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { id: e.pointerId, y: e.clientY, moved: false, ...measure() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dy) < DRAG_SLOP) return;
    d.moved = true;
    const h = d.h0 - dy; // chiều cao "ảo" theo ngón tay
    setLive(h >= d.fitH ? { height: Math.min(h, d.fullH) } : { height: d.fitH, y: d.fitH - h });
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setLive(null);
    if (!d.moved) { change(current === 'fit' ? 'full' : 'fit'); return; } // bấm = đổi nấc
    const h = d.h0 - (e.clientY - d.y);
    if (h < d.fitH) {
      // Fit: kéo xuống quá 1/3 → đóng. Full: kéo xuống dưới Fit → về Fit (không đóng).
      if (current === 'fit' && d.fitH - h > d.fitH / 3) onClose?.();
      else change('fit');
      return;
    }
    change(Math.abs(h - d.fitH) <= Math.abs(h - d.fullH) ? 'fit' : 'full');
  };
  const onPointerCancel = () => { drag.current = null; setLive(null); };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); change(current === 'fit' ? 'full' : 'fit'); }
  };

  return (
    <section
      ref={sheet}
      className={['uu-sheet', className].filter(Boolean).join(' ')}
      role="dialog" aria-modal="true" aria-label={header}
      data-navigation={onBack ? 'back' : 'close'}
      data-height={current}
      data-handle={handle || undefined}
      data-dragging={live ? true : undefined}
      style={live ? { height: live.height, transform: live.y ? `translateY(${live.y}px)` : undefined } : undefined}
    >
      {handle && (
        <div
          className="uu-sheet__handle"
          role="button" tabIndex={0} aria-label="Kéo để đổi cỡ" aria-expanded={current === 'full'}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}
          onKeyDown={onKeyDown}
        >
          <span className="uu-sheet__handle-bar" />
        </div>
      )}
      <div className="uu-sheet__header">
        {onBack && <IconButtonNeutral type="outline" size="small" icon="chevron-left" label="Quay lại" onClick={onBack} />}
        <h2 className="uu-sheet__title">{header}</h2>
        {!onBack && <IconButtonNeutral type="outline" size="small" icon="xmark" label="Đóng" onClick={onClose} />}
      </div>
      <div className="uu-sheet__body">
        {/* Slot cuộn được (Full / nội dung dài) phải vào được bằng bàn phím để cuộn bằng phím mũi tên (WCAG 2.1.1). */}
        <div className="uu-sheet__slot" ref={slot} tabIndex={0}>{children}</div>
        {cta && <ButtonGroup layout="horizontal" {...cta} />}
      </div>
    </section>
  );
}

/** @deprecated Tên cũ (`.base/sheet`) — dùng `CardSheet`. */
export const BaseSheet = CardSheet;
/** @deprecated dùng `CardSheetProps`. */
export type BaseSheetProps = CardSheetProps;

export interface BottomSheetProps extends CardSheetProps {
  open: boolean;
}

/**
 * Sheet đầy đủ (template `Sheet`): scrim `overlay` + blur 16, wrapper padding 0/12/12/12 (nổi cách đáy 12), `CardSheet` dồn xuống đáy.
 * `Height=Full`: sheet cao tới cách đỉnh safe area 12.
 * Esc và bấm ra ngoài gọi `onClose` — kể cả khi tấm đang ở `Navigation=Back`.
 * `position: fixed` — đặt trong khung có `transform` (vd. frame điện thoại trong Storybook) thì bám khung đó.
 */
export function BottomSheet({ open, onClose, ...sheet }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="uu-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="uu-scrim__wrapper uu-scrim__wrapper--sheet" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
        <CardSheet onClose={onClose} {...sheet} />
      </div>
    </div>
  );
}
