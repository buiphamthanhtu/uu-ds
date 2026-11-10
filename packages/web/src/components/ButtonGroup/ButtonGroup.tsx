import type { ReactNode } from 'react';
import { TextButtonAccent, TextButtonDanger, type ButtonState } from '../Button/TextButton';
import './ButtonGroup.css';

export interface ButtonGroupAction { label: ReactNode; onClick?: () => void; state?: ButtonState; htmlType?: 'button' | 'submit' | 'reset' }

export interface ButtonGroupProps {
  /** Thiết kế: `Layout`. Ngang: phụ TRÁI, chính PHẢI. Dọc: chính TRÊN, phụ DƯỚI. */
  layout?: 'horizontal' | 'vertical';
  /**
   * Thiết kế: `Tone`. `danger` = nhóm nút xác nhận hành động phá huỷ (xoá, huỷ đơn): nút chính đổi sang
   * TextButtonDanger Solid Large, nút phụ giữ nguyên. Thứ tự và hình học không đổi.
   */
  tone?: 'default' | 'danger';
  /** Nút chính — TextButtonAccent Solid Large (`tone="danger"`: TextButtonDanger Solid Large). */
  primary: ButtonGroupAction;
  /** Thiết kế: `Secondary button` — TextButtonAccent Outline Large. Bỏ trống để ẩn. */
  secondary?: ButtonGroupAction;
  className?: string;
}

/** Trong CSS hai nút bằng nhau chính xác (box-sizing border-box) — đừng copy con số 172/168 của bản thiết kế. */
export function ButtonGroup({ layout = 'horizontal', tone = 'default', primary, secondary, className }: ButtonGroupProps) {
  const Primary = tone === 'danger' ? TextButtonDanger : TextButtonAccent;
  const p = <Primary key="p" type="solid" size="large" state={primary.state} htmlType={primary.htmlType} onClick={primary.onClick}>{primary.label}</Primary>;
  const s = secondary && <TextButtonAccent key="s" type="outline" size="large" state={secondary.state} htmlType={secondary.htmlType} onClick={secondary.onClick}>{secondary.label}</TextButtonAccent>;
  return (
    <div className={['uu-btngroup', `uu-btngroup--${layout}`, className].filter(Boolean).join(' ')} data-tone={tone}>
      {layout === 'horizontal' ? [s, p] : [p, s]}
    </div>
  );
}
