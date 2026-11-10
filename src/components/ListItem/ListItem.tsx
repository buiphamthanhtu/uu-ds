import { createContext, useContext, useId, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { IconButtonNeutral } from '../Button/IconButton';
import { Checkbox, type CheckboxValue } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';
import { Switch } from '../Switch/Switch';
import './ListItem.css';

export type ListItemState = 'default' | 'hover' | 'pressed';

/** Bấm hàng = bật / chọn. `checkbox` / `radio` nằm ở phần đầu, `switch` ở phần đuôi. */
export type ListItemSelection =
  | { type: 'checkbox'; checked: CheckboxValue; onChange?: (next: boolean) => void }
  | { type: 'radio'; checked: boolean; onChange?: (next: boolean) => void }
  | { type: 'switch'; checked: boolean; onChange?: (next: boolean) => void };

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  /** Prop thiết kế `Title`: body object-primary, tối đa 2 dòng. */
  title: ReactNode;
  /** Prop thiết kế `Description`: caption object-secondary. */
  description?: ReactNode;
  /** Phần đầu: `<Icon name=… />` (24) · `<ListIconContainer />` · `<ListAvatar />`. Bị `selection` checkbox / radio thay chỗ. */
  leading?: ReactNode;
  /** Checkbox / Radio (đầu) hoặc Switch (đuôi); bấm cả hàng là bật / chọn. */
  selection?: ListItemSelection;
  /** Phần đuôi: `'chevron'` (mở màn khác) · `<ListValue>` · `<Badge>` / `<NotificationBadge>`. Bị `selection` switch thay chỗ. */
  trailing?: 'chevron' | ReactNode;
  /** Trailing `Action`: IconButtonNeutral Ghost Small, vùng bấm riêng. */
  action?: { icon: IconName; label: string; onClick: () => void };
  /** Bấm cả hàng. Không có và không có `selection` → hàng chỉ hiển thị, không state layer. */
  onClick?: () => void;
  disabled?: boolean;
  /** Vạch 1px `border-muted` dưới hàng, thụt theo Content. Trong `ListGroup` tự có (trừ hàng cuối). */
  divider?: boolean;
  /** Ép state để chụp docs. */
  state?: ListItemState;
}

const GroupCtx = createContext(false);

/** Hàng danh sách (§6.32): [Leading] [Title / Description] [Trailing] [Action]. */
export function ListItem({ title, description, leading, selection, trailing, action, onClick, disabled = false, divider = false, state = 'default', className, ...rest }: ListItemProps) {
  const inGroup = useContext(GroupCtx);
  const titleId = useId();
  const toggle = () => {
    if (!selection) return;
    if (selection.type === 'radio') { if (!selection.checked) selection.onChange?.(true); return; }
    selection.onChange?.(selection.checked === 'indeterminate' ? true : !selection.checked);
  };
  const interactive = !disabled && (!!selection || !!onClick);
  // Hàng có selection: nút thật là ô chọn (Tab tới đó); bấm chỗ khác của hàng cũng bật / chọn.
  // Hàng chỉ có onClick: cả hàng là một nút.
  const rowButton = !selection && !!onClick;
  const activate = () => { if (disabled) return; if (selection) toggle(); else onClick?.(); };
  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (!rowButton || disabled || e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
  };
  const control = selection && (() => {
    const common = { disabled, 'aria-labelledby': titleId, onChange: () => toggle(), tabIndex: 0 };
    if (selection.type === 'checkbox') return <Checkbox checked={selection.checked} {...common} />;
    if (selection.type === 'radio') return <Radio checked={selection.checked} {...common} />;
    return <Switch checked={selection.checked} {...common} />;
  })();
  const lead = selection && selection.type !== 'switch' ? control : leading;
  const tail = selection?.type === 'switch' ? control : trailing === 'chevron' ? <Icon name="chevron-right" size={16} className="uu-listitem__chevron" /> : trailing;
  return (
    <div
      role={inGroup ? 'listitem' : undefined}
      data-interactive={interactive || undefined}
      data-disabled={disabled || undefined}
      data-divider={divider || undefined}
      data-state={state !== 'default' ? state : undefined}
      className={['uu-listitem', className].filter(Boolean).join(' ')}
      onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; activate(); }}
      {...rest}
    >
      {/* Hàng chỉ có onClick: nút phủ cả hàng nằm TRONG hàng (không phải bản thân hàng) — hàng giữ role=listitem trong
          ListGroup và nút Action riêng không bị lồng trong nút khác (WCAG 1.3.1 · 4.1.2). */}
      {rowButton && (
        <span className="uu-listitem__hit" role="button" tabIndex={disabled ? undefined : 0} aria-disabled={disabled || undefined}
          aria-labelledby={titleId} onKeyDown={onKeyDown} />
      )}
      {lead && <span className="uu-listitem__leading">{lead}</span>}
      <span className="uu-listitem__body">
        <span className="uu-listitem__content">
          <span id={titleId} className="uu-listitem__title">{title}</span>
          {description && <span className="uu-listitem__desc">{description}</span>}
        </span>
        {tail && <span className="uu-listitem__trailing">{tail}</span>}
        {action && <IconButtonNeutral type="ghost" size="small" icon={action.icon} label={action.label} disabled={disabled} onClick={action.onClick} className="uu-listitem__action" />}
      </span>
    </div>
  );
}

/** `.ListIconContainer`: ô tròn 40 nền background-accent-muted, icon 24 object-accent. */
export function ListIconContainer({ icon }: { icon: IconName }) {
  return <span className="uu-listitem__iconbox"><Icon name={icon} size={24} /></span>;
}

/** `.ListAvatar`: ảnh tròn 40. */
export function ListAvatar({ src, alt = '' }: { src: string; alt?: string }) {
  return <img className="uu-listitem__avatar" src={src} alt={alt} />;
}

/** `.ListValue`: giá trị đang đặt — body object-secondary, một dòng. */
export function ListValue({ children }: { children: ReactNode }) {
  return <span className="uu-listitem__value">{children}</span>;
}

export interface ListGroupProps extends HTMLAttributes<HTMLElement> {
  /** Tiêu đề nhóm: title-xs IN HOA object-secondary. */
  title?: string;
  children: ReactNode;
}

/** `ListGroup` (§6.32): khối nền background-surface bo radius-lg gom nhiều `ListItem`, vạch ngăn giữa các hàng. */
export function ListGroup({ title, children, className, ...rest }: ListGroupProps) {
  const id = useId();
  return (
    <section aria-labelledby={title ? id : undefined} className={['uu-listgroup', className].filter(Boolean).join(' ')} {...rest}>
      {title && <h3 id={id} className="uu-listgroup__title">{title}</h3>}
      <div role="list" className="uu-listgroup__box"><GroupCtx.Provider value>{children}</GroupCtx.Provider></div>
    </section>
  );
}
