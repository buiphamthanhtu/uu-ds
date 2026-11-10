import type { ReactNode } from 'react';
import type { IconName } from '../../icons';
import { IconButtonAccent, IconButtonNeutral } from '../Button/IconButton';
import './NavigationBar.css';

export interface NavigationBarProps {
  /** Thiết kế: `Content` slot. Chuỗi → text style heading-base; ReactNode → đặt nguyên. */
  title?: ReactNode;
  /** Thiết kế: `Back action` — có onBack thì hiện nút back (IconButtonNeutral Solid Inverted 48, chevron-left). */
  onBack?: () => void;
  /** Thiết kế: `Sub action` — IconButtonAccent Solid Inverted 48, ẩn mặc định. */
  subAction?: { icon: IconName; label: string; onClick?: () => void };
  /** Thiết kế: `Mini app` — slot cho `.Mini App Control` (UI của Zalo, KHÔNG thuộc design system). Chỉ đưa vào khi màn chạy trong Zalo. */
  miniAppControl?: ReactNode;
  className?: string;
}

export function NavigationBar({ title = 'Screen', onBack, subAction, miniAppControl, className }: NavigationBarProps) {
  return (
    <header className={['uu-navbar', className].filter(Boolean).join(' ')}>
      {onBack && <IconButtonNeutral type="solid" inverted size="base" icon="chevron-left" label="Quay lại" onClick={onBack} />}
      <div className="uu-navbar__content">{typeof title === 'string' ? <h1 className="uu-navbar__title">{title}</h1> : title}</div>
      {subAction && <IconButtonAccent type="solid" inverted size="base" icon={subAction.icon} label={subAction.label} onClick={subAction.onClick} />}
      {miniAppControl}
    </header>
  );
}
