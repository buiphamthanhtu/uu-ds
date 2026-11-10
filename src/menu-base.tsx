import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, Text, View, useWindowDimensions, type LayoutRectangle } from 'react-native';
import { UuIcon, type UuIconName } from './icon';
import { UuPressable, type UuForcedState } from './pressable';
import { UuCheckbox } from './selection';
import { hasPortalHost, portalOrigin, UuPortal } from './portal';
import { useUu, UuThemeScope } from './theme';
import { gap, size } from './tokens.g';

/** `Type` của `.MenuItem` (§6.21): single chọn một (tint + check 16) · multiple chọn nhiều (Checkbox đầu hàng, menu không đóng). */
export type UuMenuItemType = 'single' | 'multiple';

export interface UuMenuOption<T> {
  value: T;
  label: string;
  /** Thiết kế `Description` — dòng thứ hai, caption object-secondary, tối đa 2 dòng. */
  description?: string;
  /** Thiết kế `Prefix` — icon 24 trước chữ, chỉ Single. Không có thì không chừa ô trống. */
  icon?: UuIconName;
  disabled?: boolean;
}

/**
 * Vỏ `Menu` `Platform=Panel` (§6.21): gap 4 · padding 12 · radius 24 · nền surface · elevation-low.
 * `header` (ô tìm nhanh) dính trên, `footer` dính dưới, chỉ phần giữa cuộn khi bị giới hạn chiều cao.
 * `flat`: không bo, không bóng (danh sách phủ dưới ô tìm kiếm ở màn tìm kiếm toàn màn).
 */
export function UuMenuPanel({ children, header, footer, flat = false, maxHeight }: { children: ReactNode; header?: ReactNode; footer?: ReactNode; flat?: boolean; maxHeight?: number }) {
  const { colors: c, radius, elevation } = useUu();
  const anchor = useContext(AnchorCtx);
  const mh = maxHeight ?? anchor?.maxHeight;
  return (
    <View style={{ padding: gap.g3, gap: gap.g1, backgroundColor: c.backgroundSurface, borderRadius: flat ? 0 : radius.xl2, boxShadow: flat ? undefined : elevation.low, maxHeight: mh }}>
      {header}
      <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} contentContainerStyle={{ gap: gap.g1 }} keyboardShouldPersistTaps="handled" scrollEnabled={mh !== undefined}>
        {children}
      </ScrollView>
      {footer}
    </View>
  );
}

export interface UuMenuItemProps {
  label: string;
  type?: UuMenuItemType;
  selected?: boolean;
  /** Chỉ Multiple: checkbox Indeterminate (hàng "Chọn tất cả" khi mới chọn một phần). */
  indeterminate?: boolean;
  disabled?: boolean;
  description?: string;
  /** Chỉ Single: icon 24 trước chữ. */
  icon?: UuIconName;
  /** Phần trùng từ khoá in 600 (panel gợi ý của SearchInput). */
  highlight?: string;
  /** Nút riêng cuối hàng, không kích hoạt hàng (nút `xmark` xoá một mục "Tìm gần đây"). */
  trailing?: ReactNode;
  onPress?: () => void;
  forced?: UuForcedState;
}

/**
 * `.MenuItem` (§6.21): gap 12 · padding 8 · radius 12 · cao tối thiểu 40 · chữ body.
 * Single đã chọn: nền accent-subtle (tint nhạt) nên lớp phủ vẫn 5/10 nhưng màu background-interactive;
 * chữ + check 16 object-interactive, icon object-accent. Multiple: Checkbox đầu hàng, không tint.
 */
export function UuMenuItem({ label, type = 'single', selected = false, indeterminate = false, disabled = false, description, icon, highlight, trailing, onPress, forced }: UuMenuItemProps) {
  const { colors: c, sizes: z, text, radius } = useUu();
  const multiple = type === 'multiple';
  if (__DEV__ && icon && multiple) console.warn('[UU DS] Prefix chỉ có ở Type=Single (§6.21).');
  const tinted = !multiple && selected && !disabled;
  const fg = disabled ? c.objectDisabled : tinted ? c.objectInteractive : c.objectPrimary;
  const iconFg = disabled ? c.objectDisabled : tinted ? c.objectAccent : c.objectSecondary;
  const hasDesc = !!description;
  const h = highlight?.trim() ?? '';
  const at = h ? label.toLowerCase().indexOf(h.toLowerCase()) : -1;
  const name =
    at < 0 ? (
      <Text style={[text.body, { color: fg }]}>{label}</Text>
    ) : (
      <Text style={[text.body, { color: fg }]}>
        {label.slice(0, at)}
        <Text style={{ fontWeight: '600' }}>{label.slice(at, at + h.length)}</Text>
        {label.slice(at + h.length)}
      </Text>
    );
  const row = (
    <UuPressable
      surface="onLight"
      overlayColor={tinted ? c.backgroundInteractive : c.objectPrimary}
      onPress={onPress}
      disabled={disabled}
      forced={forced}
      accessibilityRole={multiple ? 'checkbox' : 'menuitem'}
      accessibilityLabel={label}
      accessibilityState={multiple ? { checked: indeterminate ? 'mixed' : selected } : { selected }}
      style={{ borderRadius: radius.base }}
    >
      <View style={{ minHeight: size.s10, padding: gap.g2, paddingRight: trailing ? gap.g1 + z.controlHeightSmall + gap.g3 : gap.g2, backgroundColor: tinted ? c.backgroundAccentSubtle : undefined, borderRadius: radius.base, flexDirection: 'row', alignItems: hasDesc ? 'flex-start' : 'center', gap: gap.g3 }}>
        {multiple ? <UuCheckbox checked={indeterminate ? null : selected} disabled={disabled} /> : icon ? <UuIcon name={icon} size={size.s6} color={iconFg} /> : null}
        <View style={{ flex: 1, paddingTop: hasDesc && multiple ? z.selectionLabelOffset : 0 }}>
          {name}
          {hasDesc && <Text numberOfLines={2} style={[text.caption, { color: disabled ? c.objectDisabled : c.objectSecondary }]}>{description}</Text>}
        </View>
        {!multiple && selected && (
          <View style={{ paddingTop: hasDesc ? gap.g1 : 0 }}>
            <UuIcon name="check" variant="fill" size={size.s4} color={fg} />
          </View>
        )}
      </View>
    </UuPressable>
  );
  if (!trailing) return row;
  return (
    <View>
      {row}
      <View style={{ position: 'absolute', top: 0, bottom: 0, right: gap.g1, justifyContent: 'center' }}>{trailing}</View>
    </View>
  );
}

/** `.MenuSection` (§6.21): tiêu đề nhóm, padding 8/8/4/8, title-xs object-secondary IN HOA. Ẩn khi layout collapsed. */
export function UuMenuSection({ title, trailing }: { title: string; trailing?: ReactNode }) {
  const { colors: c, text, showSectionTitle } = useUu();
  if (!showSectionTitle) return null;
  return (
    <View accessibilityRole="header" style={{ paddingTop: gap.g2, paddingHorizontal: gap.g2, paddingBottom: gap.g1, flexDirection: 'row', alignItems: 'center', gap: gap.g2 }}>
      <Text numberOfLines={1} style={[text.titleXs, { flex: 1, color: c.objectSecondary }]}>{title.toUpperCase()}</Text>
      {trailing}
    </View>
  );
}

/** `.MenuDivider` (§6.21): vạch 1px border-muted, margin dọc 4. */
export function UuMenuDivider() {
  const { colors: c } = useUu();
  return <View style={{ marginVertical: gap.g1, height: size.spx, backgroundColor: c.borderMuted }} />;
}

/** Rộng panel: `anchor` = bằng phần tử mở (Dropdown, SearchInput) · `min` = tối thiểu 240 (mở từ chip hay nút). */
export type UuMenuAnchorWidth = 'anchor' | 'min';

const AnchorCtx = createContext<{ close: () => void; maxHeight?: number } | null>(null);

/** Đóng panel của UuMenuAnchor gần nhất (Single gọi sau khi chọn). */
export const useUuMenuAnchor = () => useContext(AnchorCtx);

export interface UuMenuAnchorProps {
  open: boolean;
  /** Phần tử mở panel. */
  children: ReactNode;
  /** Panel: UuMenu / UuMenuPanel. */
  menu: ReactNode;
  onClose?: () => void;
  width?: UuMenuAnchorWidth;
  /**
   * Vẽ panel ngay trong cây (absolute, zIndex) thay vì `Modal`. Dùng cho ô đang gõ (SearchInput) —
   * Modal sẽ lấy focus và cụp bàn phím. Ở chế độ này màn tự đóng khi ô mất focus.
   */
  inline?: boolean;
}

/** Mép trên bàn phím ảo theo toạ độ cửa sổ, `null` khi bàn phím đóng. */
function useKeyboardTop() {
  const [top, setTop] = useState<number | null>(null);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setTop(e.endCoordinates.screenY));
    const hide = Keyboard.addListener('keyboardDidHide', () => setTop(null));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return top;
}

/**
 * Neo panel `Menu` `Platform=Panel` (§6.21) dưới phần tử mở nó:
 * cách 4 · rộng bằng phần tử hoặc tối thiểu 240, canh trái · thiếu chỗ dưới mà trên đủ → lật lên ·
 * sát mép phải → canh mép phải · cao tối đa 320 · bàn phím đang mở thì mép trên bàn phím là đáy · đóng khi bấm ra ngoài, nút Back (Android), chọn xong ở Single.
 * Dựng bằng `Modal` trong suốt + `measureInWindow`, không cần thư viện portal.
 */
export function UuMenuAnchor({ open, children, menu, onClose, width = 'anchor', inline = false }: UuMenuAnchorProps) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const win = useWindowDimensions();
  const [a, setA] = useState<LayoutRectangle | null>(null);
  const [panelH, setPanelH] = useState(0);
  const close = useCallback(() => onClose?.(), [onClose]);
  const theme = useUu();
  const kbTop = useKeyboardTop();
  const bottom = kbTop === null ? win.height : Math.min(win.height, kbTop);
  useEffect(() => {
    if (!open) return;
    // Đo lại khi bàn phím bật / tắt: màn có KeyboardAvoidingView sẽ đẩy phần tử neo đi chỗ khác.
    const measure = () => ref.current?.measureInWindow((x, y, w, h) => setA({ x, y, width: w, height: h }));
    measure();
    const t = setTimeout(measure, 120);
    return () => clearTimeout(t);
  }, [open, win.width, win.height, kbTop]);

  let pos: { left: number; top: number; width: number; maxHeight: number } | null = null;
  if (a) {
    const below = bottom - (a.y + a.height) - gap.g1;
    const above = a.y - gap.g1;
    const maxHeight = Math.max(0, Math.min(size.s80, Math.max(below, above)));
    const w = Math.min(width === 'anchor' ? a.width : Math.max(a.width, size.s60), win.width);
    const flip = panelH > below && above >= panelH;
    const top = flip ? a.y - gap.g1 - panelH : a.y + a.height + gap.g1;
    const endAligned = a.x + w > win.width && a.x + a.width - w >= 0;
    pos = { left: endAligned ? a.x + a.width - w : a.x, top, width: w, maxHeight };
  }

  if (inline) {
    const show = open && !!a && !!pos;
    const portal = hasPortalHost();
    // Toạ độ cửa sổ → toạ độ lớp portal, hoặc toạ độ trong chính phần tử neo khi vẽ tại chỗ.
    const o = portal ? portalOrigin() : a ?? { x: 0, y: 0 };
    const panel = show && pos && (
      <View onLayout={(e) => setPanelH(e.nativeEvent.layout.height)} style={{ position: 'absolute', zIndex: 1000, left: pos.left - o.x, top: pos.top - o.y, width: pos.width, opacity: panelH ? 1 : 0 }}>
        <UuThemeScope value={theme}>
          <AnchorCtx.Provider value={{ close, maxHeight: pos.maxHeight }}>{menu}</AnchorCtx.Provider>
        </UuThemeScope>
      </View>
    );
    return (
      <View ref={ref} collapsable={false}>
        {children}
        {/* Có UuFeedbackHost → vẽ lên lớp portal ở gốc app, không bị khối phía sau đè. Không có → vẽ tại chỗ. */}
        {panel && (portal ? <UuPortal>{panel}</UuPortal> : panel)}
      </View>
    );
  }

  return (
    <View ref={ref} collapsable={false}>
      {children}
      <Modal visible={open && !!pos} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
        <Pressable accessible={false} style={{ flex: 1 }} onPress={close}>
          {pos && (
            <View
              onLayout={(e) => setPanelH(e.nativeEvent.layout.height)}
              onStartShouldSetResponder={() => true}
              style={{ position: 'absolute', left: pos.left, top: pos.top, width: pos.width, opacity: panelH ? 1 : 0 }}
            >
              <AnchorCtx.Provider value={{ close, maxHeight: pos.maxHeight }}>{menu}</AnchorCtx.Provider>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
