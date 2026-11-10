import { forwardRef, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { Icon } from '../../icons';
import { FieldLabel } from '../Field/FieldLabel';
import { Spinner } from '../Spinner';
import { TextButtonNeutral } from '../Button/TextButton';
import { IconButtonNeutral } from '../Button/IconButton';
import { Menu, MenuItem, MenuSection } from '../Menu/Menu';
import { MenuAnchor } from '../Menu/MenuAnchor';
import { MenuListRoleContext } from '../Menu/menuListRole';
import '../Field/Field.css';
import './SearchInput.css';

/** Thiết kế: `State`. `Value` (Empty/Filled) suy ra từ `value` của input. */
export type SearchInputState = 'default' | 'hover' | 'focus' | 'typing' | 'loading';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Thiết kế: `Label` (BOOLEAN) — truyền chuỗi để hiện, bỏ trống để ẩn. */
  label?: string;
  /** Bấm nút xoá `circle-xmark`. Nút chỉ hiện khi ô có chữ. */
  onClear?: () => void;
  /** Nhãn cho nút xoá (đọc màn hình). */
  clearLabel?: string;
  /** Thiết kế: `State` ép để chụp docs. Bình thường suy ra từ focus. */
  state?: SearchInputState;
  /** Thiết kế: `State=Loading` — đang tải gợi ý/kết quả: `.loading` 16 thay chỗ nút xoá, viền như Typing. Chỉ khi ô có chữ. */
  loading?: boolean;
  /** Thiết kế: `Cancel` — nút "Huỷ" (`TextButtonNeutral` Ghost Small) bên phải ô, ô co lại. Chỉ ở màn tìm kiếm riêng (mobile). */
  cancel?: boolean;
  cancelLabel?: string;
  /** Bấm Huỷ: component bỏ focus và gọi `onClear`; màn đóng panel / rời màn tìm kiếm ở đây. */
  onCancel?: () => void;
  /** Panel gợi ý / lịch sử — nhóm "Tìm gần đây" (icon `clock`): hiện khi ô rỗng và đang focus.
   * Truyền `history` hoặc `suggestions` để ô tự neo panel `Menu` dưới mình (cách 4, cùng bề rộng ô). */
  history?: string[];
  /** Bấm một hàng "Tìm gần đây". Panel đóng. */
  onHistorySelect?: (term: string) => void;
  /** Nút `xmark` cuối hàng "Tìm gần đây": xoá đúng mục đó; panel vẫn mở, focus về ô. Không có thì không hiện nút. */
  onHistoryRemove?: (term: string) => void;
  /** Nút "Xoá" của nhóm "Tìm gần đây": xoá hết lịch sử. Không có thì không hiện nút. */
  onHistoryClear?: () => void;
  /** Nhóm "Gợi ý" (icon `magnifier`, phần trùng từ khoá in 600): hiện khi đang gõ và không `loading`. */
  suggestions?: string[];
  /** Bấm một gợi ý. Panel đóng. */
  onSuggestionSelect?: (term: string) => void;
  /** Root FIXED 256 như master; mặc định FILL theo container. */
  fixedWidth?: boolean;
  className?: string;
}

/** Ô tìm kiếm (6.3g): field 48 + icon `magnifier` 24 bên trái, nút xoá `circle-xmark` 16 bên phải khi có chữ
 * (đang tải: spinner 16 thay chỗ). Tuỳ chọn nút "Huỷ". 8 variant, không có Error.
 * Panel gợi ý / lịch sử (`history`, `suggestions`) là `Menu` Panel neo dưới ô qua `MenuAnchor`. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label, onClear, clearLabel = 'Xoá từ khoá', state, loading = false, cancel = false, cancelLabel = 'Huỷ', onCancel,
    history, onHistorySelect, onHistoryRemove, onHistoryClear, suggestions, onSuggestionSelect,
    fixedWidth, className, id, disabled, placeholder = 'Tìm kiếm', onFocus, onBlur, onChange, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const filled = Boolean(rest.value);
  const isLoading = filled && !disabled && (loading || state === 'loading');
  const derived: SearchInputState = isLoading ? 'loading' : state ?? (focused ? (filled ? 'typing' : 'focus') : 'default');
  const setRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  };
  const field = (
    <div className="uu-field uu-field--search" data-state={derived} data-value={filled ? 'filled' : 'empty'} data-disabled={disabled || undefined}>
      <span className="uu-field__prefix"><Icon name="magnifier" size={24} /></span>
      <input
        ref={setRef} id={inputId} type="search" role="searchbox" className="uu-field__input" placeholder={placeholder} disabled={disabled}
        onFocus={(e) => { setFocused(true); setPanelOpen(true); onFocus?.(e); }} onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        onChange={(e) => { setPanelOpen(true); onChange?.(e); }}
        {...rest}
      />
      {isLoading && <span className="uu-field__loading"><Spinner aria-label="Đang tìm" /></span>}
      {filled && !disabled && !isLoading && (
        <button type="button" className="uu-field__clear" onClick={onClear} aria-label={clearLabel}>
          <Icon name="circle-xmark" size={16} />
        </button>
      )}
    </div>
  );
  // Panel: ô rỗng → chỉ "Tìm gần đây"; đang gõ → "Gợi ý" (chờ thì ô ở Loading, panel chưa hiện). Không có gì → không mở.
  const hasPanel = history !== undefined || suggestions !== undefined;
  const query = String(rest.value ?? '');
  const showHistory = !filled && (history?.length ?? 0) > 0;
  const showSuggest = filled && !isLoading && (suggestions?.length ?? 0) > 0;
  const backToInput = () => inputRef.current?.focus();
  // "Tìm gần đây" là danh sách nút (bấm để tìm lại, nút xoá trong hàng) → role=list; "Gợi ý" giữ listbox.
  const panel = hasPanel && (showHistory || showSuggest) ? (
    <MenuListRoleContext.Provider value={showHistory ? 'list' : 'listbox'}>
    <Menu aria-label={showHistory ? 'Tìm gần đây' : 'Gợi ý'}>
      {showHistory && (
        <>
          <MenuSection title="Tìm gần đây" action={onHistoryClear && (
            <TextButtonNeutral type="ghost" size="small" onClick={() => { onHistoryClear(); backToInput(); }}>Xoá</TextButtonNeutral>
          )} />
          {history!.map((h) => (
            <MenuItem key={h} icon="clock" onClick={() => { onHistorySelect?.(h); setPanelOpen(false); }}
              action={onHistoryRemove && (
                <IconButtonNeutral type="ghost" size="small" icon="xmark" label={`Xoá “${h}”`}
                  onClick={() => { onHistoryRemove(h); backToInput(); }} />
              )}>
              {h}
            </MenuItem>
          ))}
        </>
      )}
      {showSuggest && (
        <>
          <MenuSection title="Gợi ý" />
          {suggestions!.map((m) => (
            <MenuItem key={m} icon="magnifier" match={query} onClick={() => { onSuggestionSelect?.(m); setPanelOpen(false); }}>{m}</MenuItem>
          ))}
        </>
      )}
    </Menu>
    </MenuListRoleContext.Provider>
  ) : null;
  const anchored = hasPanel
    ? <MenuAnchor open={panelOpen && !disabled && panel !== null} onClose={() => setPanelOpen(false)} anchor={field}>{panel}</MenuAnchor>
    : field;

  return (
    <div className={['uu-fieldroot', fixedWidth && 'uu-fieldroot--search', className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      {cancel ? (
        <div className="uu-searchrow">
          {anchored}
          <TextButtonNeutral type="ghost" size="small" disabled={disabled}
            onClick={() => { inputRef.current?.blur(); setPanelOpen(false); onClear?.(); onCancel?.(); }}>{cancelLabel}</TextButtonNeutral>
        </div>
      ) : anchored}
    </div>
  );
});
