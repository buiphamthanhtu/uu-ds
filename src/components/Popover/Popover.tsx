import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { IconButtonNeutral } from '../Button/IconButton';
import { TextButtonAccent, TextButtonNeutral, type ButtonState } from '../Button/TextButton';
import './Popover.css';

export interface PopoverAction { label: ReactNode; onClick?: () => void; state?: ButtonState; htmlType?: 'button' | 'submit' | 'reset' }

export interface PopoverFooter {
  /** Nút chính — `TextButtonAccent` Solid Small. */
  primary: PopoverAction;
  /** Nút phụ — `TextButtonNeutral` Ghost Small, đứng trái nút chính. Bỏ trống để ẩn. */
  secondary?: PopoverAction;
}

export interface PopoverProps {
  /** Thiết kế: `Title` (TEXT) — `title-base`. Cũng là tên của hộp thoại cho trình đọc màn hình. */
  title: string;
  /** Thiết kế: `Header` (BOOLEAN, mặc định true) — tiêu đề + nút đóng. Tắt thì vẫn dùng `title` làm `aria-label`. */
  header?: boolean;
  /** Thiết kế: `Footer` (BOOLEAN). Truyền cặp nút để bật, `false` / bỏ trống để tắt. */
  footer?: PopoverFooter | false;
  /** Thiết kế: `Content` (SLOT). */
  children?: ReactNode;
  /** `false` thì không render. Mặc định `true` (khung đứng riêng trong docs). */
  open?: boolean;
  /** Đóng bằng nút đóng, Esc, hoặc bấm ra ngoài. */
  onClose?: () => void;
  /**
   * Phần tử neo (nút mở). Có thì Popover tự đặt chỗ: dưới phần tử, canh mép trái; thiếu chỗ phía dưới thì lật lên;
   * sát mép phải thì canh mép phải với phần tử. Bấm vào nó không tính là "bấm ra ngoài"; Esc trả focus về nó.
   * Bỏ trống: khung đứng tại chỗ (docs, hoặc màn tự đặt).
   */
  anchorRef?: RefObject<HTMLElement | null>;
  className?: string;
}

export type PopoverSide = 'bottom' | 'top';
export type PopoverAlign = 'start' | 'end';

/**
 * Tính chỗ đặt Popover trong viewport (§6.29): neo **dưới** phần tử, canh mép trái. Phía dưới không đủ chỗ mà
 * phía trên đủ → lật lên; cả hai đều thiếu → bên rộng hơn. Mép phải tràn viewport → canh mép phải với phần tử.
 * `gap` là khoảng cách khung ↔ phần tử (web: 8 = `gap-2`).
 */
export function placePopover(
  anchor: { top: number; bottom: number; left: number; right: number },
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  gap: number,
): { top: number; left: number; side: PopoverSide; align: PopoverAlign } {
  const below = viewport.height - anchor.bottom - gap;
  const above = anchor.top - gap;
  const side: PopoverSide = size.height <= below || (size.height > above && below >= above) ? 'bottom' : 'top';
  const align: PopoverAlign = anchor.left + size.width > viewport.width ? 'end' : 'start';
  return {
    top: side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - size.height,
    left: align === 'start' ? anchor.left : anchor.right - size.width,
    side,
    align,
  };
}

/** Token kích thước web là rem — đổi ra px để so với `getBoundingClientRect`. */
function toPx(v: string) {
  const n = parseFloat(v) || 0;
  return v.trim().endsWith('rem') ? n * parseFloat(getComputedStyle(document.documentElement).fontSize) : n;
}

/** Đặt khung theo phần tử neo; đo lại khi mở, khi cuộn (mọi cấp), khi đổi cỡ cửa sổ hoặc cỡ khung. */
function useAnchoredPosition(ref: RefObject<HTMLDivElement | null>, anchorRef: RefObject<HTMLElement | null> | undefined, open: boolean) {
  const [pos, setPos] = useState<{ top: number; left: number; side: PopoverSide; align: PopoverAlign } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const anchor = anchorRef?.current;
    if (!open || !el || !anchor) { setPos(null); return; }
    const gap = toPx(getComputedStyle(el).getPropertyValue('--uu-popover-gap'));
    const update = () => {
      const a = anchor.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const want = placePopover(a, b, { width: document.documentElement.clientWidth, height: window.innerHeight }, gap);
      // `position: fixed` bám viewport, trừ khi tổ tiên có `transform` — bù độ lệch đo được để luôn đúng chỗ.
      const curTop = parseFloat(el.style.top) || 0;
      const curLeft = parseFloat(el.style.left) || 0;
      setPos({ ...want, top: want.top - (b.top - curTop), left: want.left - (b.left - curLeft) });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      ro.disconnect();
    };
  }, [ref, anchorRef, open]);
  return pos;
}

/**
 * Popover (§6.29): khung nổi neo vào một phần tử, chứa nội dung tương tác được. 1 variant.
 * Rộng 320 · padding `card/padding` · gap 12 · radius `radius-lg` · `background-surface` · `elevation-medium`.
 *
 * Có `anchorRef` thì tự đo và đặt chỗ (xem `placePopover`), đo lại khi cuộn / đổi cỡ cửa sổ. Không có mũi tên.
 */
export function Popover({ title, header = true, footer, children, open = true, onClose, anchorRef, className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const anchored = !!anchorRef;
  const pos = useAnchoredPosition(ref, anchorRef, open);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
      anchorRef?.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchorRef?.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={header ? titleId : undefined}
      aria-label={header ? undefined : title}
      className={['uu-popover', anchored && 'uu-popover--anchored', className].filter(Boolean).join(' ')}
      data-side={pos?.side}
      data-align={pos?.align}
      style={anchored ? ({ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? undefined : 'hidden' } as CSSProperties) : undefined}
    >
      {header && (
        <div className="uu-popover__header">
          <h2 id={titleId} className="uu-popover__title">{title}</h2>
          <IconButtonNeutral type="ghost" size="small" icon="xmark" label="Đóng" onClick={onClose} />
        </div>
      )}
      {children !== undefined && <div className="uu-popover__content">{children}</div>}
      {footer && (
        <div className="uu-popover__footer">
          {footer.secondary && (
            <TextButtonNeutral type="ghost" size="small" state={footer.secondary.state} htmlType={footer.secondary.htmlType} onClick={footer.secondary.onClick}>
              {footer.secondary.label}
            </TextButtonNeutral>
          )}
          <TextButtonAccent type="solid" size="small" state={footer.primary.state} htmlType={footer.primary.htmlType} onClick={footer.primary.onClick}>
            {footer.primary.label}
          </TextButtonAccent>
        </div>
      )}
    </div>
  );
}
