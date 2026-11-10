import { useEffect, useRef, useState, useSyncExternalStore, type ComponentRef, type ReactNode } from 'react';
import { useUuBottomEdge, useUuKeyboardEdge, useUuKeyboardTop } from './bottom-edge';
import { AccessibilityInfo, Animated, Easing, Image, Modal, PanResponder, Platform, Pressable, ScrollView, Text, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useUuReduceMotion } from './badges';
import { UuPortalLayer } from './portal';
import { useSafeAreaInsetsOptional } from './safe-area';
import { UuIconButton, UuTextButton, UuTextButtonDanger, type UuButtonState } from './buttons';
import { UuNavigationBar } from './navigation';
import { UuPressable } from './pressable';
import { useUu } from './theme';
import { gap, size } from './tokens.g';

// ---------------------------------------------------------------------------
// Toast (§6.6)
// ---------------------------------------------------------------------------

export type UuToastType = 'neutral' | 'negative' | 'positive' | 'warning';

export interface UuToastProps {
  content: string;
  type?: UuToastType;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

/** Toast (§6.6): cao tối thiểu 64 · padding 8/16 · gap 12 · radius 12 · elevation-medium. Warning (nền sáng) → nút Inverted=False. */
export function UuToast({ content, type = 'neutral', actionLabel, onAction, onClose }: UuToastProps) {
  const { colors: c, text, radius, elevation } = useUu();
  const [bg, fg] =
    type === 'negative' ? [c.backgroundNegative, c.objectOnNegative]
    : type === 'positive' ? [c.backgroundPositive, c.objectOnPositive]
    : type === 'warning' ? [c.backgroundWarning, c.objectOnWarning]
    : [c.backgroundInverted, c.objectPrimaryInverted];
  const inverted = type !== 'warning';
  const urgent = type === 'negative';
  // Trình đọc màn hình (§6.6): Negative báo ngay, cắt ngang câu đang đọc; ba loại kia đợi đọc xong.
  // Android đọc qua accessibilityLiveRegion; iOS không có live region nên phải gọi announce.
  useEffect(() => {
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibilityWithOptions(content, { queue: !urgent });
  }, [content, urgent]);
  return (
    <View accessibilityLiveRegion={urgent ? 'assertive' : 'polite'} accessibilityRole={urgent ? 'alert' : undefined} style={{ minHeight: size.s16, paddingVertical: gap.g2, paddingHorizontal: gap.g4, gap: gap.g3, borderRadius: radius.base, backgroundColor: bg, boxShadow: elevation.medium, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[text.body, { flex: 1, color: fg }]}>{content}</Text>
      {actionLabel && <UuTextButton label={actionLabel} tone="neutral" type="solid" inverted={inverted} onPress={onAction} />}
      {onClose && <UuIconButton icon="xmark" label="Đóng" tone="neutral" type="ghost" inverted={inverted} onPress={onClose} />}
    </View>
  );
}

// Kho nhỏ cho Toast / Push hiện bằng hàm: UuFeedbackHost (đặt một lần ở gốc app) đọc kho và vẽ.
type ToastReq = UuToastProps & { id: number; duration: number };
type PushReq = UuCardPushNotificationProps & { id: number; duration: number; placement: UuPushPlacement };
let state: { toast: ToastReq | null; push: PushReq | null } = { toast: null, push: null };
let seq = 0;
const subs = new Set<() => void>();
const set = (s: Partial<typeof state>) => {
  state = { ...state, ...s };
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

/** Hiện Toast ở đáy màn, trên BottomBar / bàn phím nếu có (cần `<UuFeedbackHost />` ở gốc app). Toast mới thay toast cũ. Trả về hàm đóng. */
export function showUuToast(opts: Omit<UuToastProps, 'onClose'> & { duration?: number }) {
  const id = ++seq;
  set({ toast: { duration: 4000, ...opts, id } });
  return () => state.toast?.id === id && set({ toast: null });
}

/** `top` = app (cách đỉnh safe area 8, lề 12) · `topEnd` = desktop (góc trên phải cách mép 16, rộng 360, không vuốt). */
export type UuPushPlacement = 'top' | 'topEnd';

/**
 * `[Screen]PushNotification` (§6.31): thẻ trượt xuống từ đỉnh, tự ẩn sau 5 giây (dừng đếm khi đang chạm / hover),
 * vuốt lên để đóng, bấm thẻ gọi onPress rồi đóng. Một thẻ mỗi lúc. Cần `<UuFeedbackHost />`. Trả về hàm đóng.
 */
export function showUuPushNotification(opts: UuCardPushNotificationProps & { duration?: number; placement?: UuPushPlacement }) {
  const id = ++seq;
  set({ push: { duration: 5000, placement: 'top', ...opts, id } });
  return () => state.push?.id === id && set({ push: null });
}

// Sheet / dialog mở trong Modal che lớp gốc → Toast phải vẽ trong Modal trên cùng (§6.8). Ngăn xếp các lớp Modal đang mở.
let layers: number[] = [];
let layerSeq = 0;
const layerSubs = new Set<() => void>();
const setLayers = (next: number[]) => {
  layers = next;
  layerSubs.forEach((f) => f());
};
const subscribeLayers = (f: () => void) => {
  layerSubs.add(f);
  return () => layerSubs.delete(f);
};

/**
 * Lớp nổi ở gốc app: Toast và Push của `showUuToast` / `showUuPushNotification`, và lớp portal cho panel gợi ý của
 * SearchInput. Đặt MỘT lần, trong UuProvider, làm con cuối của view phủ toàn màn.
 */
export function UuFeedbackHost() {
  return <FeedbackLayer modal={false} />;
}

function FeedbackLayer({ modal }: { modal: boolean }) {
  const s = useSyncExternalStore(subscribe, () => state);
  const stack = useSyncExternalStore(subscribeLayers, () => layers);
  const id = useRef(0);
  if (modal && !id.current) id.current = ++layerSeq;
  useEffect(() => {
    if (!modal) return;
    setLayers([...layers, id.current]);
    return () => setLayers(layers.filter((x) => x !== id.current));
  }, [modal]);
  // Chỉ lớp trên cùng vẽ Toast / Push: lớp gốc khi không có Modal nào, không thì Modal mở sau cùng.
  const active = modal ? stack[stack.length - 1] === id.current : stack.length === 0;
  const insets = useSafeAreaInsetsOptional();
  // Toast cách 12 so với mép cao nhất: đáy safe area · mép trên BottomBar · mép trên bàn phím (§6.6).
  // Trong Modal, BottomBar phía sau bị scrim che → chỉ tính bàn phím.
  useUuKeyboardEdge();
  const barEdge = useUuBottomEdge();
  const kbTop = useUuKeyboardTop();
  const edge = modal ? kbTop : barEdge;
  const hostRef = useRef<ComponentRef<typeof View>>(null);
  const [hostBottom, setHostBottom] = useState<number | null>(null);
  const measureHost = () => hostRef.current?.measureInWindow((_x, y, _w, h) => setHostBottom(y + h));
  const toastBottom = Math.max(insets.bottom, edge !== null && hostBottom !== null ? hostBottom - edge : 0) + gap.g3;
  return (
    <View ref={hostRef} onLayout={measureHost} pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {!modal && <UuPortalLayer />}
      {active && s.toast && (
        <TimedSlide key={s.toast.id} from="bottom" duration={s.toast.duration} onGone={() => set({ toast: null })} style={{ position: 'absolute', left: gap.g3, right: gap.g3, bottom: toastBottom }}>
          {(dismiss) => <UuToast {...s.toast!} onAction={() => { s.toast!.onAction?.(); dismiss(); }} onClose={dismiss} />}
        </TimedSlide>
      )}
      {active && s.push && (
        <TimedSlide
          key={s.push.id}
          from="top"
          swipe={s.push.placement === 'top'}
          duration={s.push.duration}
          onGone={() => set({ push: null })}
          style={s.push.placement === 'topEnd' ? { position: 'absolute', top: gap.g4, right: gap.g4, width: size.s90 } : { position: 'absolute', top: insets.top + gap.g2, left: gap.g3, right: gap.g3 }}
        >
          {(dismiss) => <UuCardPushNotification {...s.push!} onPress={() => { s.push!.onPress?.(); dismiss(); }} />}
        </TimedSlide>
      )}
    </View>
  );
}

/** Trượt vào, tự ẩn sau `duration`, dừng đếm khi đang chạm / hover; `swipe` = vuốt lên để đóng. */
function TimedSlide({ children, from, duration, onGone, style, swipe = false }: { children: (dismiss: () => void) => ReactNode; from: 'top' | 'bottom'; duration: number; onGone: () => void; style: object; swipe?: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closing = useRef(false);
  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;
    clearTimeout(timer.current);
    Animated.timing(anim, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(onGone);
  };
  const restart = () => {
    clearTimeout(timer.current);
    if (!closing.current) timer.current = setTimeout(dismiss, duration);
  };
  const pause = () => clearTimeout(timer.current);
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    restart();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => swipe && Math.abs(g.dy) > 8,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -gap.g4 || g.vy < -0.2) dismiss();
        else restart();
      },
      onPanResponderTerminate: () => restart(),
    }),
  ).current;
  const shift = anim.interpolate({ inputRange: [0, 1], outputRange: [from === 'top' ? -160 : 160, 0] });
  return (
    <Animated.View
      {...pan.panHandlers}
      onTouchStart={pause}
      onTouchEnd={restart}
      onPointerEnter={pause}
      onPointerLeave={restart}
      style={[style, { opacity: anim, transform: [{ translateY: shift }] }]}
    >
      {children(dismiss)}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// ButtonGroup (§6.9)
// ---------------------------------------------------------------------------

export type UuButtonGroupLayout = 'horizontal' | 'vertical';
/** `danger` = nhóm xác nhận hành động phá huỷ: nút chính đổi sang TextButtonDanger Solid Large. */
export type UuButtonGroupTone = 'normal' | 'danger';

export interface UuGroupAction {
  label: string;
  onPress?: () => void;
  state?: UuButtonState;
}

/** Button group (§6.9): ngang → phụ trái, chính phải · dọc → chính trên, phụ dưới. Cả hai chia đều, gap 12. */
export function UuButtonGroup({ primary, secondary, layout = 'horizontal', tone = 'normal' }: { primary: UuGroupAction; secondary?: UuGroupAction; layout?: UuButtonGroupLayout; tone?: UuButtonGroupTone }) {
  const P = tone === 'danger' ? UuTextButtonDanger : UuTextButton;
  const p = <P label={primary.label} size="large" state={primary.state} onPress={primary.onPress} fill />;
  const s = secondary && <UuTextButton label={secondary.label} type="outline" size="large" state={secondary.state} onPress={secondary.onPress} fill />;
  const cell = (n: ReactNode) => <View style={layout === 'horizontal' ? { flex: 1 } : undefined}>{n}</View>;
  return (
    <View style={{ flexDirection: layout === 'horizontal' ? 'row' : 'column', gap: gap.g3 }}>
      {layout === 'horizontal' ? <>{s && cell(s)}{cell(p)}</> : <>{cell(p)}{s && cell(s)}</>}
    </View>
  );
}

// ---------------------------------------------------------------------------
// CardSheet (§6.8) · CardDialog (§6.10)
// ---------------------------------------------------------------------------

/** `fit` cao theo nội dung · `full` cao tới cách đỉnh safe area 12 (Body cuộn). */
export type UuSheetHeight = 'fit' | 'full';

export interface UuCardSheetProps {
  header: string;
  children: ReactNode;
  /** `Navigation=Close`. Sheet kéo được cũng gọi khi bị kéo đóng. Bỏ qua khi có onBack. */
  onClose?: () => void;
  /** Có giá trị = `Navigation=Back`: nút quay lại bên trái, KHÔNG có nút đóng. */
  onBack?: () => void;
  /** Thiết kế `CTA`. */
  cta?: ReactNode;
  /** Thiết kế `Handle`: thanh kéo 32 × 4 ở đỉnh. Không có thì sheet không kéo được. */
  handle?: boolean;
  /** Điều khiển nấc từ ngoài; bỏ trống thì sheet tự giữ nấc (bắt đầu ở initialHeight). */
  height?: UuSheetHeight;
  initialHeight?: UuSheetHeight;
  onHeightChange?: (h: UuSheetHeight) => void;
  /** Chiều cao nấc `full` (UuBottomSheet tự truyền). */
  maxHeight?: number;
}

/**
 * CardSheet (§6.8): tấm sheet radius 24 cả 4 góc, header (heading-base + điều hướng), body (slot + Button group).
 * Kéo được (`handle`): kéo xuống ở `fit` quá 1/3 chiều cao → đóng; ở `full` → về `fit`; thả giữa chừng về nấc gần nhất.
 * Chạm thanh kéo để đổi nấc.
 */
export function UuCardSheet({ header, children, onClose, onBack, cta, handle = false, height, initialHeight = 'fit', onHeightChange, maxHeight }: UuCardSheetProps) {
  const { colors: c, text, radius, cardShadow } = useUu();
  const [own, setOwn] = useState<UuSheetHeight>(initialHeight);
  const current: UuSheetHeight = handle ? height ?? own : 'fit';
  const full = current === 'full' && maxHeight !== undefined;
  const [fitH, setFitH] = useState(0);
  const drag = useRef(new Animated.Value(0)).current;
  const live = useRef({ h0: 0, cur: current, fitH: 0 });
  live.current.cur = current;
  live.current.fitH = fitH;
  const change = (next: UuSheetHeight) => {
    if (next === live.current.cur) return;
    if (height === undefined) setOwn(next);
    onHeightChange?.(next);
  };
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => drag.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        const { cur, fitH: f } = live.current;
        Animated.timing(drag, { toValue: 0, duration: 160, useNativeDriver: false }).start();
        if (Math.abs(g.dy) < 4) return change(cur === 'fit' ? 'full' : 'fit'); // chạm = đổi nấc
        if (g.dy > 0) {
          if (cur === 'fit' && g.dy > f / 3) onClose?.();
          else change('fit');
        } else if (cur === 'fit') change('full');
      },
    }),
  ).current;
  const back = !!onBack;
  // Kéo lên ở fit: chiều cao lớn dần (tới full); kéo xuống: tịnh tiến xuống.
  const translateY = drag.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolateLeft: 'clamp' });
  return (
    <Animated.View accessibilityViewIsModal accessibilityLabel={header} onLayout={(e) => current === 'fit' && setFitH(e.nativeEvent.layout.height)} style={{ width: '100%', maxWidth: size.s120, borderRadius: radius.xl2, overflow: 'hidden', backgroundColor: c.backgroundSurface, boxShadow: cardShadow, height: full ? maxHeight : undefined, maxHeight, transform: [{ translateY }] }}>
      {handle && (
        <View {...pan.panHandlers} accessible accessibilityRole="button" accessibilityLabel="Kéo để đổi cỡ" accessibilityState={{ expanded: current === 'full' }} onAccessibilityTap={() => change(current === 'fit' ? 'full' : 'fit')} style={{ paddingVertical: gap.g2, alignItems: 'center' }}>
          <View style={{ width: size.s8, height: size.s1, borderRadius: radius.circle, backgroundColor: c.border }} />
        </View>
      )}
      <View style={{ paddingTop: handle ? 0 : gap.g4, paddingHorizontal: gap.g4, flexDirection: 'row', alignItems: 'center', gap: gap.g4 }}>
        {back && <UuIconButton icon="chevron-left" label="Quay lại" tone="neutral" type="outline" size="small" onPress={onBack} />}
        <Text accessibilityRole="header" style={[text.headingBase, { flex: 1, color: c.objectPrimary }]}>{header}</Text>
        {!back && <UuIconButton icon="xmark" label="Đóng" tone="neutral" type="outline" size="small" onPress={onClose} />}
      </View>
      <View style={{ paddingTop: gap.g3, paddingHorizontal: gap.g4, paddingBottom: gap.g4, gap: gap.g3, flexShrink: 1, flexGrow: full ? 1 : 0 }}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: full ? 1 : 0, flexShrink: 1 }}>{children}</ScrollView>
        {cta}
      </View>
    </Animated.View>
  );
}

/**
 * Scrim chung: `overlay` (đen 10%). Blur 16 của spec cần `expo-blur` — app tự bọc nếu có.
 * Scrim mờ dần vào / ra; panel bottom sheet trượt từ đáy, dialog mờ dần. Giảm chuyển động → chỉ mờ, không trượt.
 */
function Scrim({ visible, onClose, bottom, children }: { visible: boolean; onClose?: () => void; bottom: boolean; children: ReactNode }) {
  const { colors: c } = useUu();
  const insets = useSafeAreaInsetsOptional();
  const { height } = useWindowDimensions();
  // Bàn phím mở: khối nổi cách đỉnh bàn phím 12 (§6.8).
  const kbTop = useUuKeyboardTop();
  const kbPad = kbTop !== null ? Math.max(0, height - kbTop) + gap.g3 : 0;
  const reduce = useUuReduceMotion();
  const anim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  useEffect(() => {
    if (visible) setMounted(true);
    Animated.timing(anim, { toValue: visible ? 1 : 0, duration: 220, easing: visible ? Easing.out(Easing.quad) : Easing.in(Easing.quad), useNativeDriver: true }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, anim]);
  const shift = anim.interpolate({ inputRange: [0, 1], outputRange: [bottom && !reduce ? height : 0, 0] });
  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.overlay, opacity: anim }}>
        <Pressable accessible={false} onPress={onClose} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View
        pointerEvents="box-none"
        style={{
          flex: 1, justifyContent: bottom ? 'flex-end' : 'center', alignItems: 'center', paddingHorizontal: gap.g3, paddingTop: bottom || kbPad ? insets.top + gap.g3 : 0, paddingBottom: Math.max(bottom ? insets.bottom : 0, kbPad),
          opacity: bottom && !reduce ? 1 : anim, transform: [{ translateY: shift }],
        }}
      >
        {children}
      </Animated.View>
      <FeedbackLayer modal />
    </Modal>
  );
}

/** Bottom sheet đầy đủ: scrim + lề 12 mỗi bên, sheet sát đáy. Nấc `full` cao tới cách đỉnh safe area 12. */
export function UuBottomSheet({ visible, ...sheet }: UuCardSheetProps & { visible: boolean }) {
  const { density } = useUu();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsetsOptional();
  const kbTop = useUuKeyboardTop();
  const bottomPad = kbTop !== null ? Math.max(insets.bottom, height - kbTop + gap.g3) : insets.bottom;
  // Màn rộng (density Compact): sheet giữa màn, rộng tối đa 480, mờ dần như dialog (§6.8).
  const wide = density === 'compact';
  return (
    <Scrim visible={visible} onClose={sheet.onBack ?? sheet.onClose} bottom={!wide}>
      <UuCardSheet {...sheet} maxHeight={height - insets.top - gap.g3 - bottomPad - (wide ? gap.g3 : 0)} />
    </Scrim>
  );
}

export interface UuCardDialogProps {
  children: ReactNode;
  closeButton?: boolean;
  onClose?: () => void;
  buttonGroup?: ReactNode;
  /** 384 khi đứng riêng; trong UuDialog để trống (rộng = khung − 24). */
  width?: number;
  /** Thiết kế `Banner=True`: ảnh luôn cắt về 16:9. */
  banner?: ImageSourcePropType;
  /** alt của ảnh banner — bắt buộc khi có banner. */
  bannerLabel?: string;
}

/**
 * CardDialog (§6.10): radius 24, nền surface, KHÔNG tiêu đề — nội dung vào slot.
 * Không banner: nút đóng Outline Small căn phải, p 16/16/0/16; body p 12/16/16/16.
 * Banner: ảnh 16:9 sát mép, nút đóng Solid Small đè lên ảnh (16, 16); body p 16.
 */
export function UuCardDialog({ children, closeButton = true, onClose, buttonGroup, width, banner, bannerLabel }: UuCardDialogProps) {
  const { colors: c, radius, cardShadow } = useUu();
  if (__DEV__ && banner && !bannerLabel) console.warn('[UU DS] Ảnh banner là nội dung — cần bannerLabel (alt).');
  return (
    <View accessibilityViewIsModal style={{ width: width ?? '100%', borderRadius: radius.xl2, overflow: 'hidden', backgroundColor: c.backgroundSurface, boxShadow: cardShadow }}>
      {banner ? (
        <View style={{ aspectRatio: 16 / 9 }}>
          <Image source={banner} accessibilityLabel={bannerLabel} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          {closeButton && (
            // Solid để đọc được trên mọi ảnh — nút viền sẽ chìm.
            <View style={{ position: 'absolute', top: gap.g4, right: gap.g4 }}>
              <UuIconButton icon="xmark" label="Đóng" tone="neutral" type="solid" size="small" onPress={onClose} />
            </View>
          )}
        </View>
      ) : closeButton ? (
        <View style={{ paddingTop: gap.g4, paddingHorizontal: gap.g4, alignItems: 'flex-end' }}>
          <UuIconButton icon="xmark" label="Đóng" tone="neutral" type="outline" size="small" onPress={onClose} />
        </View>
      ) : null}
      <View style={{ padding: gap.g4, paddingTop: banner ? gap.g4 : gap.g3, gap: gap.g3 }}>
        {children}
        {buttonGroup}
      </View>
    </View>
  );
}

/** Dialog đầy đủ: cùng scrim với bottom sheet, panel căn giữa. */
export function UuDialog({ visible, ...dialog }: UuCardDialogProps & { visible: boolean }) {
  return (
    <Scrim visible={visible} onClose={dialog.onClose} bottom={false}>
      <UuCardDialog {...dialog} />
    </Scrim>
  );
}

// ---------------------------------------------------------------------------
// EmptyScreen · EmptySection · ErrorSection · ResultScreen · ErrorScreen (§6.19)
// ---------------------------------------------------------------------------

interface StateProps {
  title: string;
  description?: string;
  /** Ảnh minh hoạ (tự mang accessibilityLabel). Empty / Error: trong ô tròn 128 nền accent-muted, bị cắt tròn. */
  illustration?: ReactNode;
}

function StateContent({ title, description, illustration, heading, square = false }: StateProps & { heading: 'headingSm' | 'headingBase'; square?: boolean }) {
  const { colors: c, text, radius } = useUu();
  return (
    <View style={{ alignItems: 'center', gap: gap.g3 }}>
      {square ? (
        illustration && <View style={{ width: size.s32, height: size.s32 }}>{illustration}</View>
      ) : (
        <View style={{ width: size.s32, height: size.s32, borderRadius: radius.circle, overflow: 'hidden', backgroundColor: c.backgroundAccentMuted }}>{illustration}</View>
      )}
      <Text accessibilityRole="header" style={[text[heading], { textAlign: 'center', color: c.objectPrimary }]}>{title}</Text>
      {description && <Text style={[text.body, { textAlign: 'center', color: c.objectPrimary }]}>{description}</Text>}
    </View>
  );
}

function StateSection({ actionLabel, onAction, ...p }: StateProps & { actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={{ padding: gap.g3, gap: gap.g3, alignItems: 'center', alignSelf: 'stretch' }}>
      <StateContent {...p} heading="headingSm" />
      {/* Nút hug, căn giữa như nội dung (nút tự đặt alignSelf flex-start nên bọc một lớp). */}
      {actionLabel && <View style={{ alignSelf: 'center' }}><UuTextButton label={actionLabel} size="large" onPress={onAction} /></View>}
    </View>
  );
}

/** EmptySection (§6.19): một khối chưa có dữ liệu (không phải cả màn). Bỏ trống actionLabel = `Action=false`. */
export const UuEmptySection = (p: StateProps & { actionLabel?: string; onAction?: () => void }) => <StateSection {...p} />;

/** ErrorSection (§6.19): lỗi chỉ ở một khối, luôn có MỘT nút thử lại. Lỗi cả màn → UuErrorScreen. */
export const UuErrorSection = ({ retryLabel = 'Thử lại', onRetry, ...p }: StateProps & { retryLabel?: string; onRetry?: () => void }) => <StateSection {...p} actionLabel={retryLabel} onAction={onRetry} />;

function ScreenBody({ content, footer }: { content: ReactNode; footer: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: gap.g4 }}>{content}</ScrollView>
      {footer && <View style={{ padding: gap.g4 }}>{footer}</View>}
    </View>
  );
}

/**
 * EmptyScreen (§6.19): cả màn chưa có dữ liệu. NavigationBar có nút back · Body căn giữa, padding ngang 16 ·
 * Footer padding 16 với MỘT nút hành động (bỏ trống actionLabel = ẩn). Tiêu đề heading-base.
 */
export function UuEmptyScreen({ screenTitle = '', onBack, actionLabel, onAction, ...p }: StateProps & { screenTitle?: string; onBack?: () => void; actionLabel?: string; onAction?: () => void }) {
  const { colors: c } = useUu();
  const insets = useSafeAreaInsetsOptional();
  return (
    <View style={{ flex: 1, backgroundColor: c.backgroundSurface, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <UuNavigationBar title={screenTitle} onBack={onBack} />
      <ScreenBody content={<StateContent {...p} heading="headingBase" />} footer={actionLabel ? <UuButtonGroup primary={{ label: actionLabel, onPress: onAction }} /> : null} />
    </View>
  );
}

/** ResultScreen (§6.19): việc đã xong. Ảnh vuông 128 không nền · ButtonGroup dọc. NavigationBar và safe area do màn đặt. */
export function UuResultScreen({ primary, secondary, ...p }: StateProps & { primary: UuGroupAction; secondary?: UuGroupAction }) {
  return <ScreenBody content={<StateContent {...p} heading="headingBase" square />} footer={<UuButtonGroup layout="vertical" primary={primary} secondary={secondary} />} />;
}

/** ErrorScreen (§6.19): lỗi chặn chức năng cốt lõi. Ảnh tròn 128 · ĐÚNG một nút thử lại. Lỗi một khối → UuErrorSection. */
export function UuErrorScreen({ retryLabel = 'Thử lại', onRetry, ...p }: StateProps & { retryLabel?: string; onRetry?: () => void }) {
  return <ScreenBody content={<View accessibilityLiveRegion="polite"><StateContent {...p} heading="headingBase" /></View>} footer={<UuButtonGroup layout="vertical" primary={{ label: retryLabel, onPress: onRetry }} />} />;
}

// ---------------------------------------------------------------------------
// CardPushNotification (§6.31)
// ---------------------------------------------------------------------------

export interface UuCardPushNotificationProps {
  title: string;
  content: string;
  /** Thiết kế `Image`: logo đối tác, ảnh sản phẩm. Bỏ trống = ẩn. */
  image?: ImageSourcePropType;
  /** alt của ảnh — bắt buộc khi có image. */
  imageLabel?: string;
  onPress?: () => void;
}

/**
 * CardPushNotification (§6.31): thẻ báo chuyện từ bên ngoài, trượt xuống từ đỉnh. Gap 8 · padding 8/16/8/8 · radius-lg ·
 * nền surface · elevation-medium · căn trên. Ảnh 48 radius-sm · Title body 600 tối đa 2 dòng · Content body tối đa 2 dòng.
 * Không type, không nút: bấm cả thẻ để mở. Hiện bằng `showUuPushNotification`.
 */
export function UuCardPushNotification({ title, content, image, imageLabel, onPress }: UuCardPushNotificationProps) {
  const { colors: c, text, radius, elevation } = useUu();
  if (__DEV__ && image && !imageLabel) console.warn('[UU DS] Ảnh là nội dung — cần imageLabel (alt).');
  return (
    <View accessibilityLiveRegion="polite" style={{ borderRadius: radius.lg, boxShadow: elevation.medium }}>
      <UuPressable surface="onLight" overlayColor={c.objectPrimary} onPress={onPress} accessibilityLabel={onPress ? title : undefined} style={{ borderRadius: radius.lg }}>
        <View style={{ paddingVertical: gap.g2, paddingLeft: gap.g2, paddingRight: gap.g4, gap: gap.g2, borderRadius: radius.lg, backgroundColor: c.backgroundSurface, flexDirection: 'row', alignItems: 'flex-start' }}>
          {image && <Image source={image} accessibilityLabel={imageLabel} resizeMode="cover" style={{ width: size.s12, height: size.s12, borderRadius: radius.sm }} />}
          <View style={{ flex: 1, gap: gap.g0_5 }}>
            <Text numberOfLines={2} style={[text.body, { fontWeight: '600', color: c.objectPrimary }]}>{title}</Text>
            <Text numberOfLines={2} style={[text.body, { color: c.objectPrimary }]}>{content}</Text>
          </View>
        </View>
      </UuPressable>
    </View>
  );
}
