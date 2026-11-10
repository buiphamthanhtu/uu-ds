import { useContext, useEffect, useId, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import { BottomSheet } from '../BottomSheet/BottomSheet';
import { CheckboxMark } from '../Checkbox/Checkbox';
import { SearchInput } from '../SearchInput/SearchInput';
import { TextButtonAccent, TextButtonNeutral } from '../Button/TextButton';
import { useMenuAnchor } from './MenuAnchor';
import { MenuListRoleContext } from './menuListRole';
import './Menu.css';

export * from './MenuAnchor';

export type MenuItemState = 'default' | 'hover' | 'pressed';
/** Thiết kế: `.MenuItem` `Type`. `single` = chọn một (dấu check cuối hàng) · `multiple` = chọn nhiều (Checkbox đầu hàng). */
export type MenuItemType = 'single' | 'multiple';

export interface MenuOption {
  value: string;
  /** Thiết kế: `Option` (TEXT). */
  label: ReactNode;
  /** Thiết kế: `Description` — dòng thứ hai dưới tên, `caption` `object-secondary`, tối đa 2 dòng. */
  description?: ReactNode;
  /** Thiết kế: `Prefix` — icon 24 đứng trước chữ. Chỉ `Type=Single`. Bỏ trống thì không có ô chừa. */
  icon?: IconName;
  disabled?: boolean;
  /** Ép Hover/Pressed để chụp docs. */
  state?: MenuItemState;
  /** Chữ dùng để lọc khi `search` bật và `label` không phải chuỗi. */
  searchText?: string;
}

/** Một nhóm option có tiêu đề `.MenuSection`. Giữa các nhóm tự chèn `.MenuDivider`. */
export interface MenuGroup {
  /** Thiết kế: `.MenuSection` `Title`. Bỏ trống = nhóm không tiêu đề. */
  title?: string;
  options: MenuOption[];
}

/* ------------------------------------------------------------------ .MenuItem */

export interface MenuItemProps {
  children: ReactNode;
  /** Thiết kế: `Type`. */
  type?: MenuItemType;
  /** Thiết kế: `Selected`. */
  selected?: boolean;
  /** Chỉ `type="multiple"`: ô checkbox ở `Indeterminate` — hàng "Chọn tất cả" khi mới chọn một phần. */
  indeterminate?: boolean;
  /** Thiết kế: `Description` — dòng thứ hai dưới tên: `caption` `object-secondary`, tối đa 2 dòng (cắt "…").
   * Hàng cao theo nội dung, icon / checkbox căn trên thẳng dòng tên. */
  description?: ReactNode;
  /** Thiết kế: `Disabled`. */
  disabled?: boolean;
  /** Thiết kế: `Prefix` — icon 24 trước chữ. Bỏ qua khi `type="multiple"` (đầu hàng là Checkbox). */
  icon?: IconName;
  /** Ép `State` để chụp docs. */
  state?: MenuItemState;
  /** Panel gợi ý của `SearchInput`: phần của nhãn (chuỗi) trùng từ khoá in đậm 600. */
  match?: string;
  /** Nút riêng ở cuối hàng, không kích hoạt hàng — vd. `IconButtonNeutral` Ghost Small `xmark` "Xoá “…”" của
   * hàng "Tìm gần đây" (§6.3g). Nút có state layer riêng. */
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

function highlight(label: ReactNode, match?: string): ReactNode {
  if (!match || typeof label !== 'string') return label;
  const i = label.toLocaleLowerCase('vi').indexOf(match.toLocaleLowerCase('vi'));
  if (i < 0) return label;
  return (
    <>
      {label.slice(0, i)}
      <span className="uu-menu__match">{label.slice(i, i + match.length)}</span>
      {label.slice(i + match.length)}
    </>
  );
}

/**
 * `.MenuItem` (§6.21) — hàng option. 16 variant: `Type` × `Selected` × `State` × `Disabled`.
 * `single`: nền tint khi chọn + dấu check cuối hàng. `multiple`: `Checkbox` đầu hàng, không tint, chữ `object-primary`.
 */
export function MenuItem({ children, type = 'single', selected = false, indeterminate = false, description, disabled = false, icon, state, match, action, onClick, className }: MenuItemProps) {
  const cls = ['uu-menu__item', className].filter(Boolean).join(' ');
  const dataState = state && state !== 'default' ? state : undefined;
  const hasDesc = description !== undefined && description !== null && description !== false;
  const label = hasDesc ? (
    <span className="uu-menu__text">
      <span className="uu-menu__label">{highlight(children, match)}</span>
      <span className="uu-menu__desc">{description}</span>
    </span>
  ) : <span className="uu-menu__label">{highlight(children, match)}</span>;

  if (type === 'multiple') {
    // Checkbox là <button> nên hàng không thể cũng là <button>: hàng là role=option tự bắt phím.
    const activate = () => { if (!disabled) onClick?.(); };
    return (
      <div
        role="option" aria-selected={indeterminate ? false : selected} aria-checked={indeterminate ? 'mixed' : undefined}
        aria-disabled={disabled || undefined} tabIndex={disabled ? undefined : 0}
        data-type="multiple" data-state={dataState} data-description={hasDesc || undefined} className={cls}
        onClick={activate}
        onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } }}
      >
        <CheckboxMark checked={indeterminate ? 'indeterminate' : selected} disabled={disabled} className="uu-menu__checkbox" />
        {label}
      </div>
    );
  }
  const asList = useContext(MenuListRoleContext) === 'list';
  const row = (
    <button type="button" role={asList ? undefined : 'option'} aria-selected={asList ? undefined : selected} disabled={disabled} data-type="single" data-state={dataState}
      data-description={hasDesc || undefined} data-action={action ? true : undefined} className={cls} onClick={onClick}>
      {icon && <Icon name={icon} size={24} className="uu-menu__prefix" />}
      {label}
      {selected && <Icon name="check" variant="fill" size={16} className="uu-menu__check" />}
    </button>
  );
  // Nút không lồng được trong <button> hàng: đặt cạnh, đè lên mép phải của hàng — hover nút không hover hàng.
  const full = action ? (
    <div className="uu-menu__row">
      {row}
      <span className="uu-menu__action">{action}</span>
    </div>
  ) : row;
  return asList ? <div role="listitem" className="uu-menu__li">{full}</div> : full;
}

/* --------------------------------------------------------- .MenuSection / .MenuDivider */

export interface MenuSectionProps {
  /** Thiết kế: `Title`. Hiển thị IN HOA (`title-xs`, `object-secondary`). */
  title: string;
  /** Hành động bên phải tiêu đề — vd. `TextButtonNeutral` Ghost Small "Xoá" của nhóm "Tìm gần đây" (§6.3g). */
  action?: ReactNode;
  id?: string;
  className?: string;
}

/** `.MenuSection` — tiêu đề nhóm: padding 8/8/4/8, `title-xs` `object-secondary` IN HOA. */
export function MenuSection({ title, action, id, className }: MenuSectionProps) {
  const asList = useContext(MenuListRoleContext) === 'list';
  return (
    <div role={asList ? 'listitem' : 'presentation'} className={['uu-menu__section', className].filter(Boolean).join(' ')}>
      <span id={id} className="uu-menu__section-title">{title}</span>
      {action && <span className="uu-menu__section-action">{action}</span>}
    </div>
  );
}

/** `.MenuDivider` — vạch ngăn giữa các cụm: 1px `border-muted`, margin dọc 4. */
export function MenuDivider({ className }: { className?: string }) {
  // Chỉ là nét vẽ: listbox chỉ được chứa option / group (WCAG 1.3.1), nhóm đã có role=group + tiêu đề.
  return <div aria-hidden="true" className={['uu-menu__divider', className].filter(Boolean).join(' ')} />;
}

/* ------------------------------------------------------------------ Menu */

export interface MenuProps {
  /** Danh sách option phẳng. Dùng `groups` khi cần `.MenuSection`, hoặc `children` để tự xếp hàng. */
  options?: MenuOption[];
  /** Option chia nhóm: mỗi nhóm một `.MenuSection`, giữa các nhóm một `.MenuDivider`. */
  groups?: MenuGroup[];
  /** Tự xếp `MenuItem` / `MenuSection` / `MenuDivider` (vd. panel gợi ý của `SearchInput`). Thay cho `options`/`groups`. */
  children?: ReactNode;
  /** Thiết kế: `.MenuItem` `Type`. `multiple` = chọn nhiều, **không đóng** khi chọn. */
  type?: MenuItemType;
  /** `type="single"`: giá trị đang chọn. Không có = chưa chọn gì. */
  value?: string;
  /** Gọi khi bấm một option (cả hai type). `single` + `sheet` thì đóng sheet sau đó. */
  onSelect?: (value: string) => void;
  /** `type="multiple"`: các giá trị đang chọn. */
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  /** `type="multiple"`: hàng "Chọn tất cả" ở đầu + `.MenuDivider` dưới. Dùng từ 4 option. Checkbox `Checked` khi mọi
   * option đã chọn, `Indeterminate` khi một phần. Bấm: chọn hết, hoặc bỏ hết khi đã chọn hết. Đang tìm nhanh thì
   * chỉ tác động option đang hiện; option `disabled` không bị đổi. */
  selectAll?: boolean;
  selectAllLabel?: string;
  /** Thiết kế: `Search` — ô `SearchInput` không nhãn ở đầu panel, dính trên khi cuộn, lọc option. Dùng khi > 8 option. */
  search?: boolean;
  searchPlaceholder?: string;
  /** Thiết kế: `Footer` — "Bỏ chọn" + "Áp dụng", dồn phải. Dùng với `type="multiple"`. */
  footer?: boolean;
  /** Bấm "Bỏ chọn". Mặc định xoá hết `values` qua `onValuesChange([])`. */
  onClear?: () => void;
  /** Bấm "Áp dụng". */
  onApply?: (values: string[]) => void;
  /** Nhãn nút áp dụng — màn có thể ghi "Áp dụng (n)". */
  applyLabel?: string;
  /** Thiết kế: `Platform`. `panel` = tấm nổi; `sheet` = bung từ đáy màn. */
  platform?: 'panel' | 'sheet';
  /** `platform="sheet"`: tiêu đề sheet (Bản thiết kế để `Menu`) và đóng/mở. */
  header?: string;
  open?: boolean;
  /** Đóng sheet. `type="single"` gọi sau khi chọn (cả panel). Trong `MenuAnchor` mặc định là đóng của anchor. */
  onClose?: () => void;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

function textOf(o: MenuOption) {
  return o.searchText ?? (typeof o.label === 'string' ? o.label : o.value);
}

/**
 * Menu (§6.21) — danh sách option bung ra của `Dropdown` / `Chip` Dropdown / panel gợi ý `SearchInput`.
 * Prop `platform` = Panel · Sheet; `search` và `footer` là hai phần thêm của panel.
 *
 * `panel` cao tối đa 320, cuộn trong panel (ô tìm nhanh dính trên, footer dính dưới). Neo dưới phần tử mở,
 * lật, đóng khi bấm ra ngoài / Esc: bọc trong `MenuAnchor` (Dropdown, Chip, SearchInput đã bọc sẵn qua prop `menu`).
 */
export function Menu({
  options, groups, children, type = 'single', value, onSelect, values, onValuesChange, selectAll = false, selectAllLabel = 'Chọn tất cả',
  search = false, searchPlaceholder = 'Tìm kiếm', footer = false, onClear, onApply, applyLabel = 'Áp dụng',
  platform = 'panel', header = 'Menu', open = true, onClose, className, style, ...rest
}: MenuProps) {
  const label = rest['aria-label'] ?? header; // listbox cần tên (WCAG 4.1.2): không truyền aria-label thì lấy header
  const listRole = useContext(MenuListRoleContext);
  const uid = useId();
  const [query, setQuery] = useState('');
  const multiple = type === 'multiple';
  const picked = values ?? [];
  const anchorCtx = useMenuAnchor();
  useEffect(() => { anchorCtx?.setMultiple(multiple); }, [anchorCtx, multiple]);

  const choose = (v: string) => {
    onSelect?.(v);
    if (multiple) onValuesChange?.(picked.includes(v) ? picked.filter((x) => x !== v) : [...picked, v]);
    else (onClose ?? anchorCtx?.close)?.();
  };

  const q = query.trim().toLocaleLowerCase('vi');
  const filter = (list: MenuOption[]) => (q ? list.filter((o) => textOf(o).toLocaleLowerCase('vi').includes(q)) : list);
  const allGroups: MenuGroup[] = (groups ?? (options ? [{ options }] : []))
    .map((g) => ({ ...g, options: filter(g.options) }))
    .filter((g) => g.options.length > 0);

  // Chọn tất cả: chỉ các option đang hiện (sau tìm nhanh), bỏ qua option Disabled.
  const targets = allGroups.flatMap((g) => g.options).filter((o) => !o.disabled).map((o) => o.value);
  const onCount = targets.filter((v) => picked.includes(v)).length;
  const allOn = targets.length > 0 && onCount === targets.length;
  const toggleAll = () => {
    if (allOn) onValuesChange?.(picked.filter((v) => !targets.includes(v)));
    else onValuesChange?.([...picked, ...targets.filter((v) => !picked.includes(v))]);
  };
  const showSelectAll = multiple && selectAll && children === undefined && allGroups.length > 0;

  const renderItem = (o: MenuOption) => (
    <MenuItem key={o.value} type={type} icon={o.icon} description={o.description} disabled={o.disabled} state={o.state}
      selected={multiple ? picked.includes(o.value) : o.value === value} onClick={() => choose(o.value)}>
      {o.label}
    </MenuItem>
  );

  const list = children !== undefined ? children : allGroups.map((g, gi) => {
    const titleId = g.title ? `${uid}-g${gi}` : undefined;
    return (
      <div key={gi} role="group" aria-labelledby={titleId} className="uu-menu__group">
        {gi > 0 && <MenuDivider />}
        {g.title && <MenuSection id={titleId} title={g.title} />}
        {g.options.map(renderItem)}
      </div>
    );
  });

  const empty = children === undefined && search && q && allGroups.length === 0;

  const body = (
    <>
      {search && (
        <div className="uu-menu__search">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')}
            placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
        </div>
      )}
      {empty ? (
        <p className="uu-menu__empty" role="status">Không tìm thấy “{query.trim()}”</p>
      ) : (
        <div role={listRole} aria-label={label} aria-multiselectable={(listRole === 'listbox' && multiple) || undefined} className="uu-menu__list">
          {showSelectAll && (
            <>
              <MenuItem type="multiple" selected={allOn} indeterminate={onCount > 0 && !allOn} disabled={targets.length === 0} onClick={toggleAll}>
                {selectAllLabel}
              </MenuItem>
              <MenuDivider />
            </>
          )}
          {list}
        </div>
      )}
      {footer && (
        <div className="uu-menu__footer">
          <TextButtonNeutral type="ghost" size="small" onClick={() => { if (onClear) onClear(); else onValuesChange?.([]); }}>Bỏ chọn</TextButtonNeutral>
          <TextButtonAccent type="solid" size="small" onClick={() => onApply?.(picked)}>{applyLabel}</TextButtonAccent>
        </div>
      )}
    </>
  );

  if (platform === 'sheet') {
    return (
      <BottomSheet open={open} header={header} onClose={onClose} cta={false} className={className}>
        <div className="uu-menu__sheetbody">{body}</div>
      </BottomSheet>
    );
  }
  if (!open) return null;
  return (
    <div className={['uu-menu', className].filter(Boolean).join(' ')} style={style}>
      {body}
    </div>
  );
}
