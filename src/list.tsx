import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { UuIconButton } from './buttons';
import { UuIcon, type UuIconName } from './icon';
import { UuPressable, type UuForcedState } from './pressable';
import { UuCheckbox, UuRadio, UuSwitch } from './selection';
import { useUu } from './theme';
import { gap, size } from './tokens.g';

/** Bấm hàng = bật / chọn. `checkbox` / `radio` ở phần đầu, `switch` ở phần đuôi. `checkbox` nhận `null` = Indeterminate. */
export type UuListItemSelection =
  | { type: 'checkbox'; checked: boolean | null; onChange?: (next: boolean) => void }
  | { type: 'radio'; checked: boolean; onChange?: (next: boolean) => void }
  | { type: 'switch'; checked: boolean; onChange?: (next: boolean) => void };

export interface UuListItemProps {
  /** Thiết kế `Title`: body object-primary, tối đa 2 dòng. */
  title: string;
  /** Thiết kế `Description`: caption object-secondary. */
  description?: string;
  /** Phần đầu: `<UuIcon size={24} />` · `<UuListIconContainer />` · `<UuListAvatar />`. `selection` checkbox / radio thay chỗ. */
  leading?: ReactNode;
  /** Checkbox / Radio (đầu) hoặc Switch (đuôi); bấm cả hàng là bật / chọn. */
  selection?: UuListItemSelection;
  /** Phần đuôi: `'chevron'` · `<UuListValue>` · `<UuBadge>` / `<UuNotificationBadge>`. `selection` switch thay chỗ. */
  trailing?: 'chevron' | ReactNode;
  /** Trailing `Action`: IconButtonNeutral Ghost Small, vùng bấm riêng. */
  action?: { icon: UuIconName; label: string; onPress: () => void };
  /** Bấm cả hàng. Không có và không có `selection` → hàng chỉ hiển thị. */
  onPress?: () => void;
  disabled?: boolean;
  /** Vạch 1px border-muted dưới hàng, thụt theo Content. Trong `UuListGroup` tự có (trừ hàng cuối). */
  divider?: boolean;
  forced?: UuForcedState;
}

/**
 * ListItem (§6.32): [Leading] [Title / Description] [Trailing] [Action] · gap 12 · cao tối thiểu list/min-height (56 · 40)
 * · padding ngang list/padding-x (16 · 12), dọc list/padding-y (12 · 8). State layer object-primary 5 / 10 phủ cả hàng.
 */
export function UuListItem({ title, description, leading, selection, trailing, action, onPress, disabled = false, divider = false, forced }: UuListItemProps) {
  const { colors: c, sizes: z, text } = useUu();
  const toggle = () => {
    if (!selection) return onPress?.();
    if (selection.type === 'radio') return selection.checked ? undefined : selection.onChange?.(true);
    selection.onChange?.(selection.checked !== true);
  };
  const interactive = !!selection || !!onPress;
  // Ô chọn chỉ để nhìn — cả hàng nhận chạm và là phần tử trợ năng (role + checked) duy nhất.
  const control = selection && (
    <View pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {selection.type === 'checkbox' ? <UuCheckbox checked={selection.checked} disabled={disabled} />
        : selection.type === 'radio' ? <UuRadio checked={selection.checked} disabled={disabled} />
        : <UuSwitch checked={selection.checked} disabled={disabled} />}
    </View>
  );
  const lead = selection && selection.type !== 'switch' ? control : leading;
  const tail = selection?.type === 'switch' ? control
    : trailing === 'chevron' ? <UuIcon name="chevron-right" size={size.s4} color={disabled ? c.objectDisabled : c.objectSecondary} />
    : trailing;
  const role = selection?.type ?? 'button';
  return (
    <View style={{ minHeight: z.listMinHeight, flexDirection: 'row', alignItems: 'center', gap: gap.g3, paddingLeft: z.listPaddingX }}>
      {interactive && (
        <UuPressable
          surface="onLight" overlayColor={c.objectPrimary} onPress={toggle} disabled={disabled} forced={forced}
          style={StyleSheet.absoluteFill}
          accessibilityRole={role === 'checkbox' || role === 'radio' || role === 'switch' ? role : 'button'}
          accessibilityLabel={description ? `${title}, ${description}` : title}
          accessibilityState={selection ? { checked: selection.checked === null ? 'mixed' : selection.checked } : undefined}
        >
          <View />
        </UuPressable>
      )}
      {lead && <View pointerEvents="none" importantForAccessibility={interactive ? 'no-hide-descendants' : 'auto'}>{lead}</View>}
      <View
        pointerEvents="box-none"
        style={{ flex: 1, alignSelf: 'stretch', minHeight: z.listMinHeight, flexDirection: 'row', alignItems: 'center', gap: gap.g3, paddingVertical: z.listPaddingY, paddingRight: z.listPaddingX, borderBottomWidth: divider ? 1 : 0, borderBottomColor: c.borderMuted }}
      >
        <View pointerEvents="none" importantForAccessibility={interactive ? 'no-hide-descendants' : 'auto'} accessibilityElementsHidden={interactive} style={{ flex: 1, gap: gap.g0_5 }}>
          <Text numberOfLines={2} style={[text.body, { color: disabled ? c.objectDisabled : c.objectPrimary }]}>{title}</Text>
          {description && <Text style={[text.caption, { color: disabled ? c.objectDisabled : c.objectSecondary }]}>{description}</Text>}
        </View>
        {tail && <View pointerEvents="none" importantForAccessibility={interactive ? 'no-hide-descendants' : 'auto'} accessibilityElementsHidden={interactive}>{tail}</View>}
        {action && <UuIconButton icon={action.icon} label={action.label} tone="neutral" type="ghost" size="small" state={disabled ? 'disabled' : 'normal'} onPress={action.onPress} />}
      </View>
    </View>
  );
}

/** `.ListIconContainer`: ô tròn 40 nền background-accent-muted, icon 24 object-accent. */
export function UuListIconContainer({ icon }: { icon: UuIconName }) {
  const { colors: c, radius } = useUu();
  return (
    <View style={{ width: size.s10, height: size.s10, borderRadius: radius.circle, backgroundColor: c.backgroundAccentMuted, alignItems: 'center', justifyContent: 'center' }}>
      <UuIcon name={icon} size={size.s6} color={c.objectAccent} />
    </View>
  );
}

/** `.ListAvatar`: ảnh tròn 40. */
export function UuListAvatar({ source }: { source: ImageSourcePropType }) {
  const { radius } = useUu();
  return <Image source={source} style={{ width: size.s10, height: size.s10, borderRadius: radius.circle }} />;
}

/** `.ListValue`: giá trị đang đặt — body object-secondary, một dòng. */
export function UuListValue({ children }: { children: string }) {
  const { colors: c, text } = useUu();
  return <Text numberOfLines={1} style={[text.body, { color: c.objectSecondary }]}>{children}</Text>;
}

/** ListGroup (§6.32): tiêu đề title-xs IN HOA cách khối 8 · khối nền background-surface bo radius-lg, vạch ngăn giữa các hàng. */
export function UuListGroup({ title, children }: { title?: string; children: ReactNode }) {
  const { colors: c, text, radius, sizes: z } = useUu();
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<UuListItemProps>[];
  return (
    <View style={{ gap: gap.g2 }}>
      {title && <Text accessibilityRole="header" style={[text.titleXs, { paddingHorizontal: z.listPaddingX, color: c.objectSecondary, textTransform: 'uppercase' }]}>{title}</Text>}
      <View style={{ backgroundColor: c.backgroundSurface, borderRadius: radius.lg, overflow: 'hidden' }}>
        {rows.map((r, i) => (r.type === UuListItem && r.props.divider === undefined ? cloneElement(r, { divider: i < rows.length - 1 }) : r))}
      </View>
    </View>
  );
}
