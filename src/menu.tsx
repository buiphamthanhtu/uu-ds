import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { UuTextButton } from './buttons';
import { UuSearchInput } from './fields';
import { UuMenuDivider, UuMenuItem, UuMenuPanel, UuMenuSection, useUuMenuAnchor, type UuMenuItemType, type UuMenuOption } from './menu-base';
import { useUu } from './theme';
import { gap } from './tokens.g';

/** Một nhóm option: `.MenuSection` (tiêu đề, có thể bỏ) + các option; giữa hai nhóm một `.MenuDivider`. */
export interface UuMenuGroup<T> {
  title?: string;
  options: UuMenuOption<T>[];
}

export interface UuMenuProps<T> {
  /** Danh sách phẳng. Cần tiêu đề nhóm thì dùng `groups`. */
  options?: UuMenuOption<T>[];
  /** Option chia nhóm (thay cho `options`): mỗi nhóm một `.MenuSection`, giữa các nhóm một `.MenuDivider`. */
  groups?: UuMenuGroup<T>[];
  type?: UuMenuItemType;
  /** Single: option đang chọn / vừa chọn. */
  value?: T;
  onSelect?: (v: T) => void;
  /** Multiple: các option đang tick. */
  values?: T[];
  onValuesChange?: (v: T[]) => void;
  /** Thiết kế `Search` (khi > 8 option): ô tìm nhanh dính trên, lọc theo từ khoá. */
  search?: boolean;
  searchPlaceholder?: string;
  /** Thiết kế `Footer` — dùng với Multiple: "Bỏ chọn" / "Áp dụng". */
  footer?: boolean;
  clearLabel?: string;
  applyLabel?: string;
  onClear?: () => void;
  onApply?: () => void;
  /** Multiple, từ 4 option: hàng "Chọn tất cả" + vạch ngăn ở đầu. */
  selectAll?: boolean;
  selectAllLabel?: string;
}

/**
 * Menu (§6.21) — danh sách option của `UuDropdown` và `UuChip` `dropdown`. Single chọn xong thì
 * `UuMenuAnchor` bao ngoài tự đóng; Multiple chỉ đóng bằng "Áp dụng", bấm ra ngoài, Back.
 * "Chọn tất cả" chỉ tác động option đang hiện (sau tìm nhanh), bỏ qua option Disabled.
 */
const toGroups = <T,>(options?: UuMenuOption<T>[], groups?: UuMenuGroup<T>[]): UuMenuGroup<T>[] => groups ?? (options ? [{ options }] : []);

/** Vẽ các nhóm: vạch ngăn trước nhóm thứ 2 trở đi, tiêu đề nếu có. */
function Groups<T>({ groups, item }: { groups: UuMenuGroup<T>[]; item: (o: UuMenuOption<T>) => ReactNode }) {
  return (
    <>
      {groups.map((g, gi) => (
        <View key={gi} style={{ gap: gap.g1 }}>
          {gi > 0 && <UuMenuDivider />}
          {g.title ? <UuMenuSection title={g.title} /> : null}
          {g.options.map(item)}
        </View>
      ))}
    </>
  );
}

export function UuMenu<T>({
  options, groups, type = 'single', value, onSelect, values = [], onValuesChange, search = false, searchPlaceholder = 'Tìm kiếm',
  footer = false, clearLabel = 'Bỏ chọn', applyLabel = 'Áp dụng', onClear, onApply, selectAll = false, selectAllLabel = 'Chọn tất cả',
}: UuMenuProps<T>) {
  const { colors: c, text } = useUu();
  const anchor = useUuMenuAnchor();
  const [query, setQuery] = useState('');
  const q = query.trim();
  const shownGroups = toGroups(options, groups)
    .map((g) => ({ ...g, options: q ? g.options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : g.options }))
    .filter((g) => g.options.length > 0);
  const shown = shownGroups.flatMap((g) => g.options);
  const multiple = type === 'multiple';
  const targets = shown.filter((o) => !o.disabled).map((o) => o.value);
  const onCount = targets.filter((v) => values.includes(v)).length;
  const allOn = targets.length > 0 && onCount === targets.length;
  const toggle = (v: T) => onValuesChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  return (
    <UuMenuPanel
      header={search ? <UuSearchInput value={query} onChangeText={setQuery} placeholder={searchPlaceholder} /> : undefined}
      footer={
        footer ? (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: gap.g2 }}>
            <UuTextButton label={clearLabel} tone="neutral" type="ghost" size="small" onPress={onClear ?? (() => onValuesChange?.([]))} />
            <UuTextButton label={applyLabel} size="small" onPress={onApply} />
          </View>
        ) : undefined
      }
    >
      {shown.length === 0 && q ? (
        <Text style={[text.body, { padding: gap.g2, color: c.objectSecondary }]}>Không tìm thấy “{q}”</Text>
      ) : (
        <>
          {multiple && selectAll && shown.length > 0 && (
            <>
              <UuMenuItem
                label={selectAllLabel}
                type="multiple"
                selected={allOn}
                indeterminate={onCount > 0 && !allOn}
                disabled={targets.length === 0}
                onPress={() => onValuesChange?.(allOn ? values.filter((v) => !targets.includes(v)) : [...values, ...targets.filter((v) => !values.includes(v))])}
              />
              <UuMenuDivider />
            </>
          )}
          <Groups groups={shownGroups} item={(o) =>
            multiple ? (
              <UuMenuItem key={String(o.value)} label={o.label} description={o.description} type="multiple" selected={values.includes(o.value)} disabled={o.disabled} onPress={() => toggle(o.value)} />
            ) : (
              <UuMenuItem
                key={String(o.value)}
                label={o.label}
                description={o.description}
                icon={o.icon}
                selected={o.value === value}
                disabled={o.disabled}
                onPress={() => {
                  onSelect?.(o.value);
                  anchor?.close();
                }}
              />
            )} />
        </>
      )}
    </UuMenuPanel>
  );
}

/** Danh sách option trần — đặt trong `UuCardSheet` (`Platform=Sheet`). Cùng luật với UuMenu. */
export function UuMenuList<T>({ options, groups, type = 'single', value, onSelect, values = [], onValuesChange }: Pick<UuMenuProps<T>, 'options' | 'groups' | 'type' | 'value' | 'onSelect' | 'values' | 'onValuesChange'>) {
  return (
    <View style={{ gap: gap.g1 }}>
      <Groups groups={toGroups(options, groups)} item={(o) =>
        type === 'multiple' ? (
          <UuMenuItem key={String(o.value)} label={o.label} description={o.description} type="multiple" selected={values.includes(o.value)} disabled={o.disabled}
            onPress={() => onValuesChange?.(values.includes(o.value) ? values.filter((x) => x !== o.value) : [...values, o.value])} />
        ) : (
          <UuMenuItem key={String(o.value)} label={o.label} description={o.description} icon={o.icon} selected={o.value === value} disabled={o.disabled} onPress={() => onSelect?.(o.value)} />
        )} />
    </View>
  );
}

