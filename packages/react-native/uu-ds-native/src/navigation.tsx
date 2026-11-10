import { createContext, useContext, useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useUuBottomEdgeReporter } from './bottom-edge';
import { UuIconButton } from './buttons';
import { UuNotificationBadge } from './badges';
import { UuIcon, type UuIconName } from './icon';
import { UuMenu } from './menu';
import { UuMenuAnchor } from './menu-base';
import { UuTooltip } from './overlay';
import { UuPressable, type UuForcedState } from './pressable';
import { useUu } from './theme';
import { gap, size } from './tokens.g';

export interface UuNavigationBarProps {
  title?: string;
  /** Thay tiêu đề bằng nội dung riêng. */
  titleNode?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  subActionIcon?: UuIconName;
  subActionLabel?: string;
  onSubAction?: () => void;
  /** Slot cho `.Mini App Control` của Zalo (không thuộc design system) — chỉ khi chạy trong Zalo. */
  miniAppControl?: ReactNode;
}

/**
 * NavigationBar (§6.5): cao 56 · padding 0/12 · gap 12 · không nền riêng. Back = IconButtonNeutral Solid Inverted 48
 * (`chevron-left`) · Sub action = IconButtonAccent Solid Inverted 48. Tiêu đề heading-base.
 */
export function UuNavigationBar({ title = 'Screen', titleNode, onBack, backLabel = 'Quay lại', subActionIcon, subActionLabel, onSubAction, miniAppControl }: UuNavigationBarProps) {
  const { colors: c, text } = useUu();
  return (
    <View accessibilityRole="header" style={{ height: size.s14, paddingHorizontal: gap.g3, flexDirection: 'row', alignItems: 'center', gap: gap.g3 }}>
      {onBack && <UuIconButton icon="chevron-left" label={backLabel} tone="neutral" type="solid" inverted onPress={onBack} />}
      <View style={{ flex: 1 }}>{titleNode ?? <Text numberOfLines={1} style={[text.headingBase, { color: c.objectPrimary }]}>{title}</Text>}</View>
      {subActionIcon && <UuIconButton icon={subActionIcon} label={subActionLabel ?? subActionIcon} tone="accent" type="solid" inverted onPress={onSubAction} />}
      {miniAppControl}
    </View>
  );
}

export type UuPaginationPosition = 'begin' | 'middle' | 'end';

/** Pagination (§6.10b): 5 gạch cao 2, gap 4; đang xem rộng 24 background-accent, còn lại 16 overlay. Chỉ ba vị trí. */
export function UuPagination({ position }: { position: UuPaginationPosition }) {
  const { colors: c, radius } = useUu();
  const active = position === 'begin' ? 0 : position === 'middle' ? 2 : 4;
  const label = position === 'begin' ? 'Đầu băng chuyền' : position === 'middle' ? 'Giữa băng chuyền' : 'Cuối băng chuyền';
  return (
    <View accessible accessibilityLabel={label} style={{ flexDirection: 'row', gap: gap.g1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: i === active ? size.s6 : size.s4, height: 2, borderRadius: radius.circle, backgroundColor: i === active ? c.backgroundAccent : c.overlay }} />
      ))}
    </View>
  );
}

export interface UuSegmentItem<T> {
  value: T;
  label?: string;
  icon?: UuIconName;
  suffix?: ReactNode;
  disabled?: boolean;
}

/**
 * SegmentedControl (§6.13): vỏ background-emphasized radius 16 padding 4 gap 2; item radius 12, tối thiểu 40.
 * Chọn = nền surface + elevation-low + chữ 700. Hover/Pressed lớp object-primary 5/10. Item hug — `fill` chỉ khi màn yêu cầu.
 */
export function UuSegmentedControl<T>({ items, value, onChange, fill = false }: { items: UuSegmentItem<T>[]; value: T; onChange: (v: T) => void; fill?: boolean }) {
  const { colors: c, text, radius, elevation } = useUu();
  return (
    <View accessibilityRole="tablist" style={{ padding: gap.g1, gap: gap.g0_5, backgroundColor: c.backgroundEmphasized, borderRadius: radius.lg, flexDirection: 'row', alignSelf: fill ? 'stretch' : 'flex-start' }}>
      {items.map((it) => {
        const selected = it.value === value;
        const fg = it.disabled ? c.objectDisabled : selected ? c.objectPrimary : c.objectSecondary;
        return (
          <View key={String(it.value)} style={[{ borderRadius: radius.base, boxShadow: selected ? elevation.low : undefined }, fill && { flex: 1 }]}>
            <UuPressable
              surface="onLight"
              overlayColor={c.objectPrimary}
              onPress={() => onChange(it.value)}
              disabled={it.disabled}
              accessibilityRole="tab"
              accessibilityLabel={it.label ?? it.icon}
              accessibilityState={{ selected }}
              style={{ borderRadius: radius.base }}
            >
              <View style={{ minWidth: size.s10, minHeight: size.s10, paddingVertical: gap.g1, paddingHorizontal: gap.g3, borderRadius: radius.base, backgroundColor: selected ? (it.disabled ? c.backgroundDisabled : c.backgroundSurface) : undefined, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: gap.g2 }}>
                {it.icon && <UuIcon name={it.icon} variant={selected ? 'fill' : 'outline'} size={24} color={fg} />}
                {it.label && <Text numberOfLines={1} style={[selected ? text.labelActive : text.label, { color: fg }]}>{it.label}</Text>}
                {it.suffix && <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>{it.suffix}</View>}
              </View>
            </UuPressable>
          </View>
        );
      })}
    </View>
  );
}

export interface UuTabProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  /** Icon 16 trước chữ (gap 8, cùng màu chữ; Active fill, còn lại outline). */
  icon?: UuIconName;
  /** Dot "có mới" sau chữ (gap 4). Trình đọc màn hình đọc thêm "có mới". */
  badge?: boolean;
  /** Ép Hover / Pressed để chụp docs. Bỏ qua ở tab Active / Disabled. */
  forced?: UuForcedState;
  /** Chia đều trong TabBar Fixed. */
  fill?: boolean;
}

/**
 * Tab (§6.20): chuyển giữa các vùng nội dung khác nhau — không để lọc danh sách. Hug, cao 48 (padding 12 + chữ 24).
 * Chữ title-base 600: thường object-secondary · Active object-interactive · Disabled object-disabled.
 * Gạch chỉ báo CỐ ĐỊNH 32 × 4 border-interactive, tâm nằm đúng mép đáy (thò xuống 2px).
 * Hover/Pressed = object-primary 5/10, radius-sm — chỉ ở tab không Active.
 */
export function UuTab({ label, active = false, disabled = false, onPress, icon, badge = false, forced, fill = false }: UuTabProps) {
  const { colors: c, sizes: z, text, radius } = useUu();
  const fg = disabled ? c.objectDisabled : active ? c.objectInteractive : c.objectSecondary;
  const semantic = badge ? `${label}, có mới` : label;
  const cell = (
    <View style={{ padding: z.tabPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {icon && <UuIcon name={icon} variant={active ? 'fill' : 'outline'} size={size.s4} color={fg} style={{ marginRight: gap.g2 }} />}
      <Text numberOfLines={1} style={[text.titleBase, { color: fg }]}>{label}</Text>
      {badge && <View style={{ marginLeft: gap.g1 }}><UuNotificationBadge /></View>}
    </View>
  );
  return (
    <View style={[{ alignItems: 'center' }, fill && { flex: 1 }]}>
      {active ? (
        // Tab đang chọn bấm lại không làm gì — không state layer.
        <View accessible accessibilityRole="tab" accessibilityLabel={semantic} accessibilityState={{ selected: true, disabled }} style={{ alignSelf: 'stretch' }}>{cell}</View>
      ) : (
        <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={onPress} disabled={disabled} forced={forced} accessibilityRole="tab" accessibilityLabel={semantic} accessibilityState={{ selected: false }} style={{ borderRadius: radius.sm, alignSelf: 'stretch' }}>
          {cell}
        </UuPressable>
      )}
      {active && <View pointerEvents="none" style={{ position: 'absolute', bottom: -size.s0_5, width: size.s8, height: size.s1, borderRadius: radius.circle, backgroundColor: c.borderInteractive }} />}
    </View>
  );
}

export interface UuTabItem<T> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: UuIconName;
  badge?: boolean;
}

/** `fixed` 2–4 tab nhãn ngắn, chia đều · `scrollable` ≥ 5 tab hoặc nhãn dài, cuộn ngang. */
export type UuTabBarLayout = 'fixed' | 'scrollable';

/**
 * TabBar (§6.20): hàng tab, gap 0, không nền, viền dưới 1px border-muted chạy suốt, gạch Active đè lên viền.
 * Scrollable: tab hug, cuộn ngang, padding trái 16, cắt mép phải; tab Active tự cuộn vào giữa tầm nhìn.
 */
export function UuTabBar<T>({ items, value, onChange, layout = 'fixed' }: { items: UuTabItem<T>[]; value: T; onChange: (v: T) => void; layout?: UuTabBarLayout }) {
  const { colors: c } = useUu();
  const fixed = layout === 'fixed';
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const frames = useRef(new Map<string, { x: number; width: number }>());
  const [viewW, setViewW] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (fixed || !viewW) return;
    const f = frames.current.get(String(value));
    if (!f) return;
    scroll.current?.scrollTo({ x: Math.max(0, gap.g4 + f.x + f.width / 2 - viewW / 2), animated: !first.current });
    first.current = false;
  }, [value, viewW, fixed]);
  const overhang = fixed ? 0 : size.s0_5;
  const tabs = items.map((it) => (
    <View key={String(it.value)} style={fixed ? { flex: 1 } : undefined} onLayout={(e) => frames.current.set(String(it.value), e.nativeEvent.layout)}>
      <UuTab label={it.label} active={it.value === value} disabled={it.disabled} icon={it.icon} badge={it.badge} onPress={() => onChange(it.value)} fill={fixed} />
    </View>
  ));
  return (
    <View accessibilityRole="tablist" onLayout={(e) => setViewW(e.nativeEvent.layout.width)}>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: overhang, height: size.spx, backgroundColor: c.borderMuted }} />
      {fixed ? (
        <View style={{ flexDirection: 'row' }}>{tabs}</View>
      ) : (
        <ScrollView ref={scroll} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: gap.g4, paddingBottom: overhang }}>
          {tabs}
        </ScrollView>
      )}
    </View>
  );
}

export interface UuBottomBarItem<T> {
  value: T;
  /** Compact thì ẩn trên màn nhưng vẫn là nhãn cho trình đọc màn hình. */
  label: string;
  /** Mục thường outline, mục đang chọn tự đổi sang fill. */
  icon: UuIconName;
  /** NotificationBadge Count neo góc icon — chỉ hiện khi mục KHÔNG được chọn. */
  badge?: string;
  badgeLabel?: string;
}

/** `base/FooterItemSpecial`: `emphasized` (mặc định) nền interactive · `subtle` nền surface (khi màn đã có nút Solid khác). */
export type UuFooterItemSpecialType = 'subtle' | 'emphasized';

export interface UuBottomBarAction {
  label: string;
  icon: UuIconName;
  onPress?: () => void;
  type?: UuFooterItemSpecialType;
}

/**
 * BottomBar (§6.22): điều hướng giữa các màn chính, dưới đáy. 2–5 mục. Vỏ pill background-surface padding 4 gap 4,
 * không viền, không bóng. Thường: vỏ fill, mục chia đều, có nhãn title-xs. `compact`: hug, mục 64 × 40, không nhãn.
 * Mục đang chọn: nền interactive-muted, icon fill + chữ object-interactive. Mục chưa có state layer (chưa chốt).
 * `action` = nút hành động rời bên phải vỏ, cách 8.
 */
export function UuBottomBar<T>({ items, value, onChange, compact = false, action }: { items: UuBottomBarItem<T>[]; value: T; onChange: (v: T) => void; compact?: boolean; action?: UuBottomBarAction }) {
  const { colors: c, text, radius } = useUu();
  if (__DEV__ && (items.length < 2 || items.length > 5)) console.warn('[UU DS] BottomBar chốt 2 đến 5 mục (§6.22).');
  if (__DEV__ && action && compact && items.length > 4) console.warn('[UU DS] Có nút hành động thì Compact tối đa 4 mục.');
  const edge = useUuBottomEdgeReporter(); // báo mép trên cho UuFeedbackHost: Toast nổi trên thanh (§6.6)
  const bar = (
    <View {...(action ? null : edge)} accessibilityRole="tablist" style={[{ padding: gap.g1, gap: gap.g1, backgroundColor: c.backgroundSurface, borderRadius: radius.circle, flexDirection: 'row' }, compact ? { alignSelf: 'flex-start' } : { flex: 1 }]}>
      {items.map((it) => {
        const active = it.value === value;
        const fg = active ? c.objectInteractive : c.objectSecondary;
        return (
          <Pressable
            key={String(it.value)}
            onPress={() => onChange(it.value)}
            accessibilityRole="tab"
            accessibilityLabel={it.badge && !active ? `${it.label}, ${it.badgeLabel ?? it.badge}` : it.label}
            accessibilityState={{ selected: active }}
            style={[{ minWidth: size.s16, minHeight: size.s10, paddingHorizontal: gap.g3, paddingVertical: gap.g1_5, borderRadius: radius.circle, backgroundColor: active ? c.backgroundInteractiveMuted : undefined, alignItems: 'center', justifyContent: 'center' }, !compact && { flex: 1 }]}
          >
            <View>
              <UuIcon name={it.icon} variant={active ? 'fill' : 'outline'} size={size.s6} color={fg} />
              {/* Badge neo góc trên phải icon: mép phải trùng mép icon, cao hơn đỉnh icon 4px. */}
              {!active && it.badge && <View style={{ position: 'absolute', right: 0, top: -gap.g1 }}><UuNotificationBadge count={it.badge} /></View>}
            </View>
            {!compact && <Text numberOfLines={1} style={[text.titleXs, { marginTop: gap.g1, color: fg }]}>{it.label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
  if (!action) return bar;
  return (
    <View {...edge} style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g2, alignSelf: compact ? 'flex-start' : 'stretch' }}>
      {bar}
      <FooterItemSpecial action={action} compact={compact} />
    </View>
  );
}

/** `base/FooterItemSpecial`: thường 64 × 64, padding 6/16, icon 24 + nhãn title-xs · compact 48 × 48, chỉ icon. */
function FooterItemSpecial({ action, compact }: { action: UuBottomBarAction; compact: boolean }) {
  const { colors: c, text, radius } = useUu();
  const emphasized = (action.type ?? 'emphasized') === 'emphasized';
  const fg = emphasized ? c.objectOnInteractive : c.objectInteractive;
  const side = compact ? size.s12 : size.s16;
  return (
    <UuPressable surface={emphasized ? 'onDark' : 'onLight'} overlayColor={fg} onPress={action.onPress} accessibilityLabel={action.label} style={{ borderRadius: radius.circle }}>
      <View style={{ minWidth: side, minHeight: side, padding: compact ? gap.g3 : undefined, paddingVertical: compact ? undefined : gap.g1_5, paddingHorizontal: compact ? undefined : gap.g4, borderRadius: radius.circle, backgroundColor: emphasized ? c.backgroundInteractive : c.backgroundSurface, alignItems: 'center', justifyContent: 'center' }}>
        <UuIcon name={action.icon} size={size.s6} color={fg} />
        {!compact && <Text numberOfLines={1} style={[text.titleXs, { marginTop: gap.g1, color: fg }]}>{action.label}</Text>}
      </View>
    </UuPressable>
  );
}

export interface UuBreadcrumbItem {
  label: string;
  /** Mục cuối luôn là trang hiện tại — onPress bị bỏ qua. */
  onPress?: () => void;
}

/**
 * Breadcrumb (§6.25): đường dẫn vị trí (desktop / web). Gap 4, ngăn "/" body object-disabled. Mục padding ngang 4,
 * radius 8, body object-secondary, là link (lớp object-primary 5/10). Mục cuối object-primary, không phải link.
 * Quá 4 mục: giữ mục đầu và 2 mục cuối, giữa là "…" mở `UuMenu` liệt kê các mục ẩn.
 */
export function UuBreadcrumb({ items }: { items: UuBreadcrumbItem[] }) {
  const { colors: c, text, radius } = useUu();
  const collapsed = items.length > 4;
  const shown: (number | null)[] = collapsed ? [0, null, items.length - 2, items.length - 1] : items.map((_, i) => i);
  return (
    <View accessibilityLabel="Breadcrumb" style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g1, alignSelf: 'flex-start' }}>
      {shown.map((i, k) => (
        <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g1 }}>
          {k > 0 && <Text importantForAccessibility="no" accessibilityElementsHidden style={[text.body, { color: c.objectDisabled }]}>/</Text>}
          {i === null ? (
            <UuBreadcrumbOverflow hidden={items.slice(1, items.length - 2)} />
          ) : i === items.length - 1 ? (
            <Text accessibilityLabel={`${items[i].label}, trang hiện tại`} numberOfLines={1} style={[text.body, { paddingHorizontal: gap.g1, color: c.objectPrimary }]}>{items[i].label}</Text>
          ) : (
            <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={items[i].onPress} accessibilityRole="link" accessibilityLabel={items[i].label} style={{ borderRadius: radius.sm }}>
              <Text numberOfLines={1} style={[text.body, { paddingHorizontal: gap.g1, color: c.objectSecondary }]}>{items[i].label}</Text>
            </UuPressable>
          )}
        </View>
      ))}
    </View>
  );
}

/** `.BreadcrumbItem` `Type=Overflow`: "…" mở `UuMenu` neo dưới, cách 4, rộng tối thiểu 240; chọn một mục gọi onPress của mục đó. */
export function UuBreadcrumbOverflow({ hidden, forced }: { hidden: UuBreadcrumbItem[]; forced?: UuForcedState }) {
  const { colors: c, text, radius } = useUu();
  const [open, setOpen] = useState(false);
  return (
    <UuMenuAnchor open={open} onClose={() => setOpen(false)} width="min" menu={<UuMenu options={hidden.map((h, i) => ({ value: i, label: h.label }))} onSelect={(i) => hidden[i].onPress?.()} />}>
      <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={() => setOpen((o) => !o)} forced={forced} accessibilityLabel="Hiện đường dẫn ẩn" accessibilityState={{ expanded: open }} style={{ borderRadius: radius.sm }}>
        <Text style={[text.body, { paddingHorizontal: gap.g1, color: c.objectSecondary }]}>…</Text>
      </UuPressable>
    </UuMenuAnchor>
  );
}

const SideNavCtx = createContext<boolean | null>(null);
const useSideNavCollapsed = () => {
  const v = useContext(SideNavCtx);
  const { layout } = useUu();
  return v ?? layout === 'collapsed';
};

/** Rộng khi thu gọn: padding 12 × 2 + mục vuông 48 + viền 1. */
export const sideNavCollapsedWidth = gap.g3 * 2 + size.s12 + size.spx;

export interface UuSideNavProps {
  /** `UuSideNavItem` và `UuSideNavSection`. Một mục active mỗi lúc. Mục cấp 2 và tiêu đề nhóm tự ẩn khi thu gọn. */
  children: ReactNode;
  /** Bỏ trống → theo `layout` của UuProvider (§4.2). */
  collapsed?: boolean;
  /** Thiết kế `Toggle`: nút thu / mở `sidebar-left` ở đầu thanh. */
  toggle?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * SideNav (§6.27): điều hướng dọc của web app / tablet. Padding 12, gap 4, rộng `sidenavWidth` (288 · Compact 240),
 * viền phải 1px border-muted, nền surface. Thu gọn: rộng 73, ẩn nhãn / chevron / tiêu đề nhóm / mục cấp 2; nhãn thành Tooltip.
 */
export function UuSideNav({ children, collapsed: prop, toggle = false, onCollapsedChange }: UuSideNavProps) {
  const { colors: c, sizes: z, layout } = useUu();
  const collapsed = prop ?? layout === 'collapsed';
  const label = collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng';
  const button = <UuIconButton icon="sidebar-left" label={label} tone="neutral" type="ghost" size="small" onPress={onCollapsedChange && (() => onCollapsedChange(!collapsed))} />;
  return (
    <SideNavCtx.Provider value={collapsed}>
      <View accessibilityLabel="Điều hướng" style={{ width: collapsed ? sideNavCollapsedWidth : z.sidenavWidth, alignSelf: 'stretch', backgroundColor: c.backgroundSurface, borderRightWidth: 1, borderRightColor: c.borderMuted }}>
        <ScrollView contentContainerStyle={{ padding: gap.g3, gap: gap.g1, alignItems: collapsed ? 'center' : 'stretch' }}>
          {toggle && <View style={{ alignSelf: collapsed ? 'center' : 'flex-end' }}>{collapsed ? <UuTooltip text={label} placement="right">{button}</UuTooltip> : button}</View>}
          {children}
        </ScrollView>
      </View>
    </SideNavCtx.Provider>
  );
}

export interface UuSideNavItemProps {
  label: string;
  /** Bắt buộc ở cấp 1. */
  icon?: UuIconName;
  level?: 1 | 2;
  active?: boolean;
  /** `chevron-down` 16 cuối mục cấp 1 có mục con, xoay 180° (120 ms) khi `expanded`. */
  chevron?: boolean;
  expanded?: boolean;
  /** NotificationBadge Count cuối mục; thu gọn thì thành Dot ở góc trên phải icon. */
  badge?: string;
  badgeLabel?: string;
  onPress?: () => void;
  forced?: UuForcedState;
}

/**
 * `.SideNavItem` (§6.27): padding ngang control-padding-x-small, gap 8, cao tối thiểu control-height-base, radius 8,
 * icon control-icon-base, nhãn body. Active: nền interactive-muted, icon fill object-interactive. Lớp object-primary 5/10.
 */
export function UuSideNavItem({ label, icon, level = 1, active = false, chevron = false, expanded, badge, badgeLabel, onPress, forced }: UuSideNavItemProps) {
  const { colors: c, sizes: z, text, radius } = useUu();
  const navCollapsed = useSideNavCollapsed();
  const rot = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(rot, { toValue: expanded ? 1 : 0, duration: 120, useNativeDriver: true }).start();
  }, [expanded, rot]);
  if (navCollapsed && level === 2) return null;
  if (__DEV__ && level === 1 && !icon) console.warn('[UU DS] Mục SideNav cấp 1 cần icon (§6.27).');
  const collapsed = navCollapsed && level === 1;
  const hasBadge = !!badge;
  const iconNode = level === 1 && icon ? <UuIcon name={icon} variant={active ? 'fill' : 'outline'} size={z.controlIconBase} color={active ? c.objectInteractive : c.objectSecondary} /> : <View style={{ width: z.controlIconBase }} />;
  const content = collapsed ? (
    <View style={{ width: size.s12, height: size.s12, alignItems: 'center', justifyContent: 'center' }}>
      <View>
        {iconNode}
        {hasBadge && <View style={{ position: 'absolute', top: 0, right: 0 }}><UuNotificationBadge /></View>}
      </View>
    </View>
  ) : (
    <View style={{ minHeight: z.controlHeightBase, paddingHorizontal: z.controlPaddingXSmall, flexDirection: 'row', alignItems: 'center', gap: gap.g2 }}>
      {iconNode}
      <Text numberOfLines={1} style={[text.body, { flex: 1, color: c.objectPrimary }]}>{label}</Text>
      {hasBadge && <UuNotificationBadge count={badge} />}
      {chevron && level === 1 && (
        <Animated.View style={{ transform: [{ rotate: rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
          <UuIcon name="chevron-down" size={size.s4} color={c.objectSecondary} />
        </Animated.View>
      )}
    </View>
  );
  const a11y = [label, hasBadge ? badgeLabel ?? badge : null].filter(Boolean).join(', ');
  const item = (
    <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={onPress} forced={forced} accessibilityRole="tab" accessibilityLabel={a11y} accessibilityState={{ selected: active, expanded: level === 1 ? expanded : undefined }} style={{ borderRadius: radius.sm }}>
      <View style={{ borderRadius: radius.sm, backgroundColor: active ? c.backgroundInteractiveMuted : undefined }}>{content}</View>
    </UuPressable>
  );
  return collapsed ? <UuTooltip text={label} placement="right">{item}</UuTooltip> : item;
}

/** `.SideNavSection` (§6.27): tiêu đề nhóm, padding 16/12/4/12, title-xs object-secondary IN HOA. Ẩn khi thu gọn. */
export function UuSideNavSection({ title }: { title: string }) {
  const { colors: c, text } = useUu();
  if (useSideNavCollapsed()) return null;
  return (
    <Text accessibilityRole="header" numberOfLines={1} style={[text.titleXs, { paddingTop: gap.g4, paddingHorizontal: gap.g3, paddingBottom: gap.g1, color: c.objectSecondary }]}>
      {title.toUpperCase()}
    </Text>
  );
}
