import { useId, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import './SegmentedControl.css';

export interface SegmentItem {
  value: string;
  /** Thiết kế: `↳ Name`. Bỏ trống + có icon = item icon-only (`Page name=false`). */
  label?: string;
  /** Thiết kế: `Icon` — icon 24 đứng trước chữ. */
  icon?: IconName;
  /** Tên đọc cho item **icon-only** (bắt buộc khi không có `label`) — trình đọc màn hình không đọc được icon. */
  ariaLabel?: string;
  /** Thiết kế: `Suffix` — slot 18 sau chữ (badge, số đếm). */
  suffix?: ReactNode;
  /** Thiết kế: `State=Disabled`. */
  disabled?: boolean;
  /** Ép Hover/Pressed để chụp docs. */
  state?: 'hover' | 'pressed';
}

export interface SegmentedControlProps {
  items: SegmentItem[];
  value: string;
  onChange: (value: string) => void;
  /** Chia đều bề ngang. Mặc định false — item HUG theo chữ đúng như master. */
  fill?: boolean;
  'aria-label'?: string;
  className?: string;
}

/** Thanh chọn một-trong-nhiều kiểu tab pill. Bản thiết kế: item `Active` (đang chọn) × `State` (Default/Hover/Pressed/Disabled). */
export function SegmentedControl({ items, value, onChange, fill = false, className, ...rest }: SegmentedControlProps) {
  const id = useId();
  return (
    <div role="tablist" aria-label={rest['aria-label']} className={['uu-segctl', fill && 'uu-segctl--fill', className].filter(Boolean).join(' ')}>
      {items.map((it) => {
        const selected = it.value === value;
        return (
          <button
            key={it.value} type="button" role="tab" id={`${id}-${it.value}`}
            aria-selected={selected} aria-label={it.label ? undefined : it.ariaLabel} tabIndex={selected ? 0 : -1} disabled={it.disabled} data-state={it.state}
            className={['uu-segctl__item', selected && 'uu-is-active'].filter(Boolean).join(' ')}
            onClick={() => onChange(it.value)}
            onKeyDown={(e) => {
              const i = items.findIndex((x) => x.value === value);
              if (e.key === 'ArrowRight') onChange(items[(i + 1) % items.length].value);
              if (e.key === 'ArrowLeft') onChange(items[(i - 1 + items.length) % items.length].value);
            }}
          >
            {it.icon && <Icon name={it.icon} variant={selected ? 'fill' : 'outline'} size={24} />}
            {it.label && <span>{it.label}</span>}
            {it.suffix && <span className="uu-segctl__suffix">{it.suffix}</span>}
          </button>
        );
      })}
    </div>
  );
}
