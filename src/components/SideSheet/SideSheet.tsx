import { useEffect, useId, type ReactNode } from 'react';
import { IconButtonNeutral } from '../Button/IconButton';
import { TextButtonAccent, TextButtonNeutral, type ButtonState } from '../Button/TextButton';
import '../BottomSheet/BottomSheet.css';
import './SideSheet.css';

export interface SideSheetAction { label: ReactNode; onClick?: () => void; state?: ButtonState; htmlType?: 'button' | 'submit' | 'reset' }

export interface SideSheetFooter {
  /** Nút chính — `TextButtonAccent` Solid Base. */
  primary: SideSheetAction;
  /** Nút phụ — `TextButtonNeutral` Outline Base, đứng trái nút chính. Bỏ trống để ẩn. */
  secondary?: SideSheetAction;
}

export interface SideSheetProps {
  /** Thiết kế: `Type`. `standard` nằm cạnh nội dung, viền trái, không scrim; `modal` nổi trên scrim. */
  type?: 'standard' | 'modal';
  /** Thiết kế: `Width`. `base` rộng 384 (`size-96`); `wide` rộng 480 (`size-120`) cho form dài / nhiều cột. */
  width?: 'base' | 'wide';
  /** Thiết kế: `Title` (TEXT) — `heading-sm`. */
  title: string;
  /** Thiết kế: `Footer` (BOOLEAN). Truyền cặp nút để bật, `false` / bỏ trống để tắt. */
  footer?: SideSheetFooter | false;
  /** Nội dung body — cuộn khi dài. */
  children?: ReactNode;
  /** `false` thì không render. Mặc định `true`. */
  open?: boolean;
  /** Nút đóng; với `modal` còn là Esc và bấm vào scrim. */
  onClose?: () => void;
  className?: string;
}

function Panel({ type, width = 'base', title, footer, children, onClose, className }: Omit<SideSheetProps, 'open'> & { type: 'standard' | 'modal' }) {
  const titleId = useId();
  return (
    <section
      role={type === 'modal' ? 'dialog' : 'complementary'}
      aria-modal={type === 'modal' ? true : undefined}
      aria-labelledby={titleId}
      className={['uu-sidesheet', `uu-sidesheet--${type}`, width === 'wide' && 'uu-sidesheet--wide', className].filter(Boolean).join(' ')}
    >
      <div className="uu-sidesheet__header">
        <h2 id={titleId} className="uu-sidesheet__title">{title}</h2>
        <IconButtonNeutral type="ghost" size="small" icon="xmark" label="Đóng" onClick={onClose} />
      </div>
      <div className="uu-sidesheet__body">{children}</div>
      {footer && (
        <div className="uu-sidesheet__footer">
          {footer.secondary && (
            <TextButtonNeutral type="outline" size="base" state={footer.secondary.state} htmlType={footer.secondary.htmlType} onClick={footer.secondary.onClick}>
              {footer.secondary.label}
            </TextButtonNeutral>
          )}
          <TextButtonAccent type="solid" size="base" state={footer.primary.state} htmlType={footer.primary.htmlType} onClick={footer.primary.onClick}>
            {footer.primary.label}
          </TextButtonAccent>
        </div>
      )}
    </section>
  );
}

/**
 * SideSheet (§6.28): tấm trượt từ mép phải màn desktop để xem / sửa chi tiết mà không rời trang.
 * 4 variant = `Type` (Standard · Modal) × `Width` (Base 384 · Wide 480). Cao FILL, nền `background-surface`.
 * `standard`: đặt trong layout ngang cạnh nội dung (tấm cao bằng khung chứa).
 * `modal`: `position: fixed` trên scrim `overlay` + blur 16 như `BottomSheet`; trong khung có `transform` thì bám khung đó.
 * Trên app dùng `BottomSheet`, không dùng `SideSheet`.
 */
export function SideSheet({ type = 'standard', open = true, onClose, ...panel }: SideSheetProps) {
  const modal = type === 'modal';
  useEffect(() => {
    if (!open || !modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, modal, onClose]);
  if (!open) return null;
  if (!modal) return <Panel type="standard" onClose={onClose} {...panel} />;
  return (
    <div className="uu-scrim uu-scrim--side" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <Panel type="modal" onClose={onClose} {...panel} />
    </div>
  );
}
