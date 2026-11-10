import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions, type LayoutRectangle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { UuIconButton, UuTextButton } from './buttons';
import { useUu } from './theme';
import { gap, size } from './tokens.g';

// ---------------------------------------------------------------------------
// SideSheet (§6.28)
// ---------------------------------------------------------------------------

/** `standard` nằm cạnh nội dung (viền trái, không scrim) · `modal` nổi trên scrim. */
export type UuSideSheetType = 'standard' | 'modal';
/** `base` 384 (size-96) · `wide` 480 (size-120) cho form dài / nhiều cột. */
export type UuSideSheetWidth = 'base' | 'wide';

export interface UuSideSheetProps {
  title: string;
  children: ReactNode;
  type?: UuSideSheetType;
  width?: UuSideSheetWidth;
  onClose?: () => void;
  /** Thiết kế `Footer`: có nhãn nút chính thì hiện footer. */
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/**
 * SideSheet (§6.28): tấm từ mép phải màn rộng (tablet / web), cao fill, nền surface. Header heading-sm + nút đóng Ghost Small ·
 * Body cuộn, gap 12 · Footer Neutral Outline Base + Accent Solid Base dồn phải. Trên điện thoại dùng UuBottomSheet.
 */
export function UuSideSheet({ title, children, type = 'standard', width = 'base', onClose, primaryLabel, onPrimary, secondaryLabel, onSecondary }: UuSideSheetProps) {
  const { colors: c, sizes: z, text, radius, elevation } = useUu();
  const modal = type === 'modal';
  const p = z.cardPadding;
  return (
    <View
      accessibilityViewIsModal={modal}
      accessibilityLabel={title}
      style={{ width: width === 'wide' ? size.s120 : size.s96, maxWidth: '100%', alignSelf: 'stretch', backgroundColor: c.backgroundSurface, borderTopLeftRadius: modal ? radius.lg : 0, borderBottomLeftRadius: modal ? radius.lg : 0, boxShadow: modal ? elevation.high : undefined, borderLeftWidth: modal ? 0 : 1, borderLeftColor: c.borderMuted, overflow: modal ? 'hidden' : 'visible' }}
    >
      <View style={{ padding: p, flexDirection: 'row', alignItems: 'center', gap: gap.g3 }}>
        <Text accessibilityRole="header" style={[text.headingSm, { flex: 1, color: c.objectPrimary }]}>{title}</Text>
        <UuIconButton icon="xmark" label="Đóng" tone="neutral" type="ghost" size="small" onPress={onClose} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: p, gap: gap.g3 }}>{children}</ScrollView>
      {primaryLabel && (
        <View style={{ padding: p, flexDirection: 'row', justifyContent: 'flex-end', gap: gap.g3 }}>
          {secondaryLabel && <UuTextButton label={secondaryLabel} tone="neutral" type="outline" onPress={onSecondary} />}
          <UuTextButton label={primaryLabel} onPress={onPrimary} />
        </View>
      )}
    </View>
  );
}

/** SideSheet `modal` đầy đủ: scrim `overlay`, tấm dính mép phải. Bấm scrim / nút Back đóng. */
export function UuSideSheetModal({ visible, ...p }: Omit<UuSideSheetProps, 'type'> & { visible: boolean }) {
  const { colors: c } = useUu();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={p.onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: c.overlay, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable accessible={false} onPress={p.onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <UuSideSheet {...p} type="modal" />
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Popover (§6.29)
// ---------------------------------------------------------------------------

export interface UuPopoverProps {
  children: ReactNode;
  /** Thiết kế `Header` + `Title`. Bỏ trống = không header. */
  title?: string;
  onClose?: () => void;
  /** Thiết kế `Footer`. */
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/**
 * Popover (§6.29): khung nổi rộng 320, padding card-padding, gap 12, radius 16, nền surface, elevation-medium.
 * Header title-base + nút đóng Ghost Small · Footer Neutral Ghost Small + Accent Solid Small dồn phải. Không mũi tên.
 */
export function UuPopover({ children, title, onClose, primaryLabel, onPrimary, secondaryLabel, onSecondary }: UuPopoverProps) {
  const { colors: c, sizes: z, text, radius, elevation } = useUu();
  return (
    <View accessibilityViewIsModal accessibilityLabel={title} style={{ width: size.s80, maxWidth: '100%', padding: z.cardPadding, gap: gap.g3, borderRadius: radius.lg, backgroundColor: c.backgroundSurface, boxShadow: elevation.medium }}>
      {title && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g3 }}>
          <Text accessibilityRole="header" style={[text.titleBase, { flex: 1, color: c.objectPrimary }]}>{title}</Text>
          <UuIconButton icon="xmark" label="Đóng" tone="neutral" type="ghost" size="small" onPress={onClose} />
        </View>
      )}
      {children}
      {primaryLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: gap.g2 }}>
          {secondaryLabel && <UuTextButton label={secondaryLabel} tone="neutral" type="ghost" size="small" onPress={onSecondary} />}
          <UuTextButton label={primaryLabel} size="small" onPress={onPrimary} />
        </View>
      )}
    </View>
  );
}

/**
 * Chỗ đặt Popover (§6.29): neo DƯỚI phần tử cách 4, canh mép trái. Dưới không đủ mà trên đủ → lật lên; cả hai thiếu →
 * bên rộng hơn. Tràn mép phải → canh mép phải với phần tử. `margin` = khoảng chừa với mép màn.
 */
export function uuPlacePopover(anchor: LayoutRectangle, child: { width: number; height: number }, area: { width: number; height: number }, g = gap.g1, margin = gap.g2) {
  const bottom = anchor.y + anchor.height;
  const below = area.height - margin - bottom - g;
  const above = anchor.y - g - margin;
  const down = child.height <= below || (child.height > above && below >= above);
  const y = down ? bottom + g : anchor.y - g - child.height;
  const fitsRight = anchor.x + child.width <= area.width - margin;
  const x = fitsRight ? anchor.x : Math.max(margin, anchor.x + anchor.width - child.width);
  return { x, y };
}

/** Neo UuPopover vào phần tử con. Đóng bằng nút đóng, nút Back, bấm ra ngoài (không scrim). */
export function UuPopoverAnchor({ open, onClose, popover, children }: { open: boolean; onClose?: () => void; popover: ReactNode; children: ReactNode }) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const win = useWindowDimensions();
  const [a, setA] = useState<LayoutRectangle | null>(null);
  const [sz, setSz] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    if (open) ref.current?.measureInWindow((x, y, width, height) => setA({ x, y, width, height }));
  }, [open, win.width, win.height]);
  const pos = a && sz ? uuPlacePopover(a, sz, win) : null;
  return (
    <View ref={ref} collapsable={false} style={{ alignSelf: 'flex-start' }}>
      {children}
      <Modal visible={open && !!a} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
        <Pressable accessible={false} style={{ flex: 1 }} onPress={onClose}>
          <View onStartShouldSetResponder={() => true} onLayout={(e) => setSz(e.nativeEvent.layout)} style={{ position: 'absolute', left: pos?.x ?? 0, top: pos?.y ?? 0, opacity: pos ? 1 : 0 }}>
            {popover}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tooltip (§6.30)
// ---------------------------------------------------------------------------

/** Bong bóng nằm phía nào của phần tử; mũi tên chỉ về phần tử. */
export type UuTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Bong bóng Tooltip (§6.30): padding 4/8, radius 8, nền background-inverted, rộng tối đa 240, caption, mũi tên 8 × 4. */
export function UuTooltipBubble({ text: label, placement = 'top' }: { text: string; placement?: UuTooltipPlacement }) {
  const { colors: c, text, radius } = useUu();
  const vertical = placement === 'top' || placement === 'bottom';
  const w = vertical ? size.s2 : size.s1;
  const h = vertical ? size.s1 : size.s2;
  const d =
    placement === 'top' ? `M0 0 L${w} 0 L${w / 2} ${h} Z`
    : placement === 'bottom' ? `M0 ${h} L${w} ${h} L${w / 2} 0 Z`
    : placement === 'left' ? `M0 0 L0 ${h} L${w} ${h / 2} Z`
    : `M${w} 0 L${w} ${h} L0 ${h / 2} Z`;
  const arrow = (
    <Svg width={w} height={h}>
      <Path d={d} fill={c.backgroundInverted} />
    </Svg>
  );
  const bubble = (
    <View style={{ maxWidth: size.s60, paddingVertical: gap.g1, paddingHorizontal: gap.g2, borderRadius: radius.sm, backgroundColor: c.backgroundInverted }}>
      <Text style={[text.caption, { color: c.objectPrimaryInverted }]}>{label}</Text>
    </View>
  );
  const first = placement === 'top' || placement === 'left';
  return (
    <View pointerEvents="none" style={{ flexDirection: vertical ? 'column' : 'row', alignItems: 'center' }}>
      {first ? <>{bubble}{arrow}</> : <>{arrow}{bubble}</>}
    </View>
  );
}

let openCount = 0;
let coolUntil = 0;

/**
 * Tooltip (§6.30): hiện bong bóng khi HOVER (chuột / bút trên web, iPad, desktop), sau 500 ms; rời thì ẩn ngay.
 * Có tooltip đang mở hoặc vừa ẩn chưa quá 300 ms thì tooltip kế bên hiện ngay. Chỉ chữ thuần — cần nút thì dùng Popover.
 * Không có trên màn chạm: nhãn của phần tử phải tự đủ nghĩa (`text` được gắn vào accessibilityHint của vùng bọc).
 */
export function UuTooltip({ text: label, placement = 'top', open, children }: { text: string; placement?: UuTooltipPlacement; open?: boolean; children: ReactNode }) {
  const [hover, setHover] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const counted = useRef(false);
  const show = open ?? hover;
  useEffect(() => {
    if (open !== undefined) return;
    if (show && !counted.current) {
      counted.current = true;
      openCount++;
    }
    if (!show && counted.current) {
      counted.current = false;
      openCount--;
      coolUntil = Date.now() + 300;
    }
  }, [show, open]);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (counted.current) openCount--;
    },
    [],
  );
  const enter = () => {
    if (openCount > 0 || Date.now() < coolUntil) setHover(true);
    else timer.current = setTimeout(() => setHover(true), 500);
  };
  const leave = () => {
    clearTimeout(timer.current);
    setHover(false);
  };
  const pos =
    // Khung rộng 240 (= max-width bong bóng) để chữ không bị ép theo bề rộng phần tử; bong bóng hug bên trong.
    placement === 'top' ? { bottom: '100%' as const, marginBottom: gap.g1, alignItems: 'center' as const }
    : placement === 'bottom' ? { top: '100%' as const, marginTop: gap.g1, alignItems: 'center' as const }
    : placement === 'left' ? { right: '100%' as const, marginRight: gap.g1, top: 0, bottom: 0, alignItems: 'flex-end' as const, justifyContent: 'center' as const }
    : { left: '100%' as const, marginLeft: gap.g1, top: 0, bottom: 0, alignItems: 'flex-start' as const, justifyContent: 'center' as const };
  return (
    <View onPointerEnter={enter} onPointerLeave={leave} style={{ alignSelf: 'flex-start', alignItems: 'center', zIndex: show ? 1000 : undefined }}>
      {children}
      {show && (
        <View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={[{ position: 'absolute', width: size.s60 }, pos]}>
          <UuTooltipBubble text={label} placement={placement} />
        </View>
      )}
    </View>
  );
}
