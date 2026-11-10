import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Text, View } from 'react-native';
import { UuIcon, type UuIconName } from './icon';
import { useUu } from './theme';
import { gap, size } from './tokens.g';

// ---------------------------------------------------------------------------
// Badge · StatusIndicator · NotificationBadge (§6.14–6.16)
// ---------------------------------------------------------------------------

/** `highlight` (họ accent: Mới, Nổi bật, Đề xuất) CHỈ có ở StatusIndicator. */
export type UuTone = 'neutral' | 'success' | 'warning' | 'error' | 'highlight';

const TONE_ICON: Record<Exclude<UuTone, 'highlight'>, UuIconName> = {
  neutral: 'circle-info',
  success: 'circle-check',
  warning: 'circle-warning',
  error: 'triangle-warning',
};

/** Badge (§6.14): viên thuốc cao 24, padding 4/8, gap 4, icon 16 fill LUÔN hiện theo tone + chữ title-sm 600. Không state. 4 tone. */
export function UuBadge({ label, tone = 'neutral' }: { label: string; tone?: Exclude<UuTone, 'highlight'> }) {
  const { colors: c, text, radius } = useUu();
  if (__DEV__ && (tone as UuTone) === 'highlight') console.warn('[UU DS] Badge không có tone Highlight (§6.14).');
  const [bg, fg] =
    tone === 'success' ? [c.backgroundPositive, c.objectOnPositive]
    : tone === 'warning' ? [c.backgroundWarning, c.objectOnWarning]
    : tone === 'error' ? [c.backgroundNegative, c.objectOnNegative]
    : [c.backgroundInverted, c.objectPrimaryInverted];
  return (
    <View style={{ height: size.s6, paddingLeft: gap.g1, paddingRight: gap.g2, gap: gap.g1, borderRadius: radius.circle, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
      <UuIcon name={TONE_ICON[tone] ?? 'circle-info'} variant="fill" size={16} color={fg} />
      <Text numberOfLines={1} style={[text.titleSm, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Theo dõi "Giảm chuyển động" của hệ điều hành. */
/** `true` khi máy bật "Giảm chuyển động" — tắt nhấp nháy, trượt; chỉ giữ mờ dần. */
export function useUuReduceMotion() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => live && setOn(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setOn);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return on;
}

/** Chấm 8 nhấp nháy của StatusIndicator (§6.15): opacity 1 → 0.3 → 1, chu kỳ 1.6 s; đứng yên khi bật giảm chuyển động. */
function BlinkDot({ color }: { color: string }) {
  const o = useRef(new Animated.Value(1)).current;
  const still = useUuReduceMotion();
  useEffect(() => {
    if (still) {
      o.setValue(1);
      return;
    }
    const step = (v: number) => Animated.timing(o, { toValue: v, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
    const a = Animated.loop(Animated.sequence([step(0.3), step(1)]));
    a.start();
    return () => a.stop();
  }, [still, o]);
  return <Animated.View style={{ width: size.s2, height: size.s2, borderRadius: size.s2 / 2, backgroundColor: color, opacity: o }} />;
}

/** StatusIndicator (§6.15): chấm 8 nhấp nháy + chữ title-sm, gap 6. `filled` = viên thuốc nền status (cao 24, padding 2/8). */
export function UuStatusIndicator({ label, tone = 'neutral', filled = false }: { label: string; tone?: UuTone; filled?: boolean }) {
  const { colors: c, text, radius } = useUu();
  let bg: string | undefined;
  let dot: string;
  let fg: string;
  if (filled) {
    [bg, dot] =
      tone === 'success' ? [c.backgroundPositive, c.objectOnPositive]
      : tone === 'warning' ? [c.backgroundWarning, c.objectOnWarning]
      : tone === 'error' ? [c.backgroundNegative, c.objectOnNegative]
      : tone === 'highlight' ? [c.backgroundAccent, c.objectOnAccent]
      : [c.backgroundInverted, c.objectOnDark];
    fg = dot;
  } else {
    dot = tone === 'success' ? c.objectPositive : tone === 'warning' ? c.objectWarning : tone === 'error' ? c.objectNegative : tone === 'highlight' ? c.objectAccent : c.objectSecondary;
    fg = c.objectPrimary;
  }
  return (
    <View style={{ height: filled ? size.s6 : size.s5, paddingVertical: filled ? gap.g0_5 : 0, paddingHorizontal: filled ? gap.g2 : 0, gap: gap.g1_5, borderRadius: radius.circle, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
      <BlinkDot color={dot} />
      <Text numberOfLines={1} style={[text.titleSm, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** NotificationBadge (§6.16): `count` = cao 16, tối thiểu 16, padding ngang 4, chữ title-xs · bỏ trống = chấm 8. Nền background-attention. */
export function UuNotificationBadge({ count, accessibilityLabel }: { count?: string; accessibilityLabel?: string }) {
  const { colors: c, text, radius } = useUu();
  const a11y = accessibilityLabel ? { accessible: true, accessibilityLabel, accessibilityLiveRegion: 'polite' as const } : { importantForAccessibility: 'no-hide-descendants' as const };
  if (count === undefined) return <View {...a11y} style={{ width: size.s2, height: size.s2, borderRadius: size.s2 / 2, backgroundColor: c.backgroundAttention }} />;
  return (
    <View {...a11y} style={{ height: size.s4, minWidth: size.s4, paddingHorizontal: gap.g1, borderRadius: radius.circle, backgroundColor: c.backgroundAttention, alignItems: 'center', justifyContent: 'center' }}>
      <Text numberOfLines={1} style={[text.titleXs, { color: c.objectOnAttention, textAlign: 'center' }]}>{count}</Text>
    </View>
  );
}

