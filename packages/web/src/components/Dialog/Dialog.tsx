import { useEffect, type ReactNode } from 'react';
import { IconButtonNeutral } from '../Button/IconButton';
import { ButtonGroup, type ButtonGroupProps } from '../ButtonGroup/ButtonGroup';
import '../BottomSheet/BottomSheet.css';
import './Dialog.css';

export interface CardDialogBanner {
  /** Ảnh 16:9 — tỉ lệ duy nhất (384 × 216 ở bề rộng 384). */
  src: string;
  /** Ảnh là nội dung → bắt buộc `alt`. */
  alt: string;
}

export interface CardDialogProps {
  /** Thiết kế: `Slot` — toàn bộ nội dung, kể cả tiêu đề nếu cần. */
  children?: ReactNode;
  /** Thiết kế: `Banner=True` — header là ảnh 16:9, nút đóng đè lên ảnh (Solid). Bỏ trống = `Banner=False`. */
  banner?: CardDialogBanner;
  /** Thiết kế: `Close button` (mặc định true). Với banner: chỉ ẩn nút, ảnh vẫn còn. */
  closeButton?: boolean;
  onClose?: () => void;
  /** Thiết kế: `Button group` (mặc định true, Secondary button=false). `false` để ẩn. */
  buttonGroup?: ButtonGroupProps | false;
  /** Rộng 384 cố định như master (khi không nằm trong overlay). */
  standalone?: boolean;
  'aria-label'?: string;
  className?: string;
}

/** `CardDialog` (§6.10) — chỉ tấm panel. 2 variant: `Banner=False` · `Banner=True`. */
export function CardDialog({ children, banner, closeButton = true, onClose, buttonGroup, standalone, className, ...rest }: CardDialogProps) {
  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label={rest['aria-label']}
      data-banner={banner ? 'true' : undefined}
      className={['uu-dialog', standalone && 'uu-dialog--standalone', className].filter(Boolean).join(' ')}
    >
      {banner ? (
        <div className="uu-dialog__banner">
          <img className="uu-dialog__image" src={banner.src} alt={banner.alt} />
          {closeButton && (
            <IconButtonNeutral className="uu-dialog__banner-close" type="solid" size="small" icon="xmark" label="Đóng" onClick={onClose} />
          )}
        </div>
      ) : (
        closeButton && (
          <div className="uu-dialog__header">
            <IconButtonNeutral type="outline" size="small" icon="xmark" label="Đóng" onClick={onClose} />
          </div>
        )
      )}
      <div className="uu-dialog__body">
        <div className="uu-dialog__slot">{children}</div>
        {buttonGroup && <ButtonGroup layout="horizontal" {...buttonGroup} />}
      </div>
    </section>
  );
}

/** @deprecated Tên cũ (`.base/dialog`, đã gỡ) — dùng `CardDialog`. */
export const BaseDialog = CardDialog;
/** @deprecated dùng `CardDialogProps`. */
export type BaseDialogProps = CardDialogProps;

export interface DialogProps extends Omit<CardDialogProps, 'standalone'> {
  open: boolean;
}

/** Dialog đầy đủ (template `Dialog`): cùng scrim với Bottom sheet nhưng `CardDialog` CĂN GIỮA theo chiều dọc. */
export function Dialog({ open, onClose, ...panel }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="uu-scrim uu-scrim--center" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="uu-scrim__wrapper">
        <CardDialog onClose={onClose} {...panel} />
      </div>
    </div>
  );
}
