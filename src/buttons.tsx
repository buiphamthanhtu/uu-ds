import { useEffect, useId, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { UuIcon, type UuIconName, type UuIconVariant } from './icon';
import { UuPressable, type UuForcedState, type UuSurface } from './pressable';
import { useUu, type UuColors, type UuSizes } from './theme';
import { gap } from './tokens.g';

/** Bản thiết kế: hai bộ `TextButtonAccent` / `TextButtonNeutral` (và IconButton tương ứng). */
export type UuButtonTone = 'accent' | 'neutral';
/** `tonal` chỉ có ở tone neutral, không có `inverted` (§6.1). */
export type UuButtonType = 'solid' | 'outline' | 'ghost' | 'tonal';
export type UuButtonSize = 'large' | 'base' | 'small';
/** `hover` / `pressed` chỉ để ép trạng thái khi chụp tài liệu — sản phẩm thật dùng `normal`. */
export type UuButtonState = 'normal' | 'hover' | 'pressed' | 'disabled' | 'loading';

/** Kích thước nút theo density (§4.1): Touch 56 / 48 / 32 · Compact 40 / 32 / 24. */
export const buttonSize = (z: UuSizes, s: UuButtonSize) => {
  const k = s === 'large' ? 'Large' : s === 'base' ? 'Base' : 'Small';
  return {
    height: z[`controlHeight${k}`],
    icon: z[`controlIcon${k}`],
    padX: z[`controlPaddingX${k}`],
    padY: z[`controlPaddingY${k}`],
  };
};

export interface UuButtonStyleSpec {
  background?: string;
  border?: string;
  content: string;
  surface: UuSurface;
}

/** Bảng màu §6.1 / §6.2 và nền của state layer §6.0. */
export function resolveButtonStyle(c: UuColors, tone: UuButtonTone, type: UuButtonType, inverted: boolean, disabled: boolean): UuButtonStyleSpec {
  const accent = tone === 'accent';
  const surface: UuSurface = (type === 'solid' ? !inverted : inverted) ? 'onDark' : 'onLight';
  if (disabled) {
    return {
      background: type === 'solid' || type === 'tonal' ? c.backgroundDisabled : undefined,
      border: type === 'outline' ? (inverted ? c.borderMutedInverted : c.borderMuted) : undefined,
      content: c.objectDisabled,
      surface,
    };
  }
  switch (type) {
    case 'solid':
      if (inverted) return { background: c.backgroundSurface, content: accent ? c.objectInteractive : c.objectPrimary, surface };
      return { background: accent ? c.backgroundInteractive : c.backgroundInverted, content: accent ? c.objectOnInteractive : c.objectPrimaryInverted, surface };
    case 'outline':
      return {
        border: accent ? (inverted ? c.borderInteractiveInverted : c.borderInteractive) : inverted ? c.borderInverted : c.border,
        content: accent ? (inverted ? c.objectInteractiveInverted : c.objectInteractive) : inverted ? c.objectPrimaryInverted : c.objectPrimary,
        surface,
      };
    case 'tonal':
      if (__DEV__ && (accent || inverted)) console.warn('[UU DS] Tonal chỉ có ở Neutral, không Inverted (§6.1).');
      return { background: c.backgroundSubtle, content: c.objectPrimary, surface };
    case 'ghost':
      return {
        content: accent ? (inverted ? c.objectInteractiveInverted : c.objectInteractive) : inverted ? c.objectPrimaryInverted : c.objectPrimary,
        surface,
      };
  }
}

/** Bảng màu `TextButtonDanger` (§6.1): như Accent Inverted=False, họ negative. Disabled như Accent. */
export function resolveDangerStyle(c: UuColors, type: UuButtonType, disabled: boolean): UuButtonStyleSpec {
  if (disabled) return resolveButtonStyle(c, 'accent', type, false, true);
  if (type === 'solid') return { background: c.backgroundNegative, content: c.objectOnNegative, surface: 'onDark' };
  if (type === 'outline') return { border: c.borderNegative, content: c.objectNegative, surface: 'onLight' };
  return { content: c.objectNegative, surface: 'onLight' };
}

const forcedOf = (s: UuButtonState): UuForcedState | undefined => (s === 'hover' || s === 'pressed' ? s : undefined);

/** Viền Outline vẽ chồng lên trong (strokeAlign INSIDE): không cộng vào chiều cao, không đẩy chữ. */
const InsideBorder = ({ color, disabled }: { color?: string; disabled?: boolean }) => {
  const { radius, restBorder } = useUu();
  // P33: bật vòng viền DNA thì viền Outline ở trạng thái thường trong suốt; Disabled giữ border-muted.
  return color ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: disabled ? color : restBorder(color), borderRadius: radius.xl4 }]} /> : null;
};

export interface UuTextButtonProps {
  label: string;
  onPress?: () => void;
  tone?: UuButtonTone;
  type?: UuButtonType;
  inverted?: boolean;
  size?: UuButtonSize;
  state?: UuButtonState;
  /** Thiết kế: `Prefix` — icon bên trái chữ, cùng cỡ suffix. Loading thì spinner thay chỗ icon này. */
  prefixIcon?: UuIconName;
  /** Thiết kế: `Suffix` — icon bên phải (24 cho Large/Base, 16 cho Small). */
  suffixIcon?: UuIconName;
  accessibilityHint?: string;
  /** Giãn hết chiều ngang khung cha (FILL) — vd. nút trong `UuButtonGroup`. Mặc định hug. */
  fill?: boolean;
}

function TextButtonBody({ label, onPress, spec: s, size = 'base', state = 'normal', prefixIcon, suffixIcon, accessibilityHint, fill = false }: Omit<UuTextButtonProps, 'tone' | 'type' | 'inverted'> & { spec: UuButtonStyleSpec }) {
  const { sizes, text, radius, outerShadow } = useUu();
  const b = buttonSize(sizes, size);
  const loading = state === 'loading';
  return (
    <UuPressable
      surface={s.surface}
      overlayColor={s.content}
      onPress={onPress}
      disabled={state === 'disabled' || loading /* loading chỉ khoá chạm, KHÔNG giảm độ đục */}
      forced={forcedOf(state)}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ busy: loading || undefined }}
      style={{ alignSelf: fill ? 'stretch' : 'flex-start', borderRadius: radius.xl4, boxShadow: outerShadow }}
    >
      <View style={{ minHeight: b.height, minWidth: b.height, paddingHorizontal: b.padX, paddingVertical: b.padY, backgroundColor: s.background, borderRadius: radius.xl4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: gap.g2 }}>
        {loading ? <UuSpinner color={s.content} /> : prefixIcon && <UuIcon name={prefixIcon} size={b.icon} color={s.content} />}
        <Text numberOfLines={1} style={[text.label, { color: s.content }]}>{label}</Text>
        {suffixIcon && <UuIcon name={suffixIcon} size={b.icon} color={s.content} />}
      </View>
      <InsideBorder color={s.border} disabled={state === 'disabled'} />
    </UuPressable>
  );
}

/** TextButton (§6.1). Hug width; min-width = height nên nút chữ ngắn không hẹp hơn hình tròn. */
export function UuTextButton({ tone = 'accent', type = 'solid', inverted = false, ...p }: UuTextButtonProps) {
  const { colors } = useUu();
  return <TextButtonBody {...p} spec={resolveButtonStyle(colors, tone, type, inverted, p.state === 'disabled')} />;
}

/**
 * TextButtonDanger (§6.1): hành động phá huỷ, không hoàn tác được. Hình học, density, state layer, Loading,
 * Disabled y hệt UuTextButton Accent; chỉ đổi họ màu sang negative. Không có Inverted.
 */
export function UuTextButtonDanger({ type = 'solid', ...p }: Omit<UuTextButtonProps, 'tone' | 'inverted'>) {
  const { colors } = useUu();
  return <TextButtonBody {...p} spec={resolveDangerStyle(colors, type, p.state === 'disabled')} />;
}

export interface UuIconButtonProps {
  icon: UuIconName;
  /** Bắt buộc — nút không có chữ nên trình đọc màn hình cần tên. */
  label: string;
  onPress?: () => void;
  tone?: UuButtonTone;
  type?: UuButtonType;
  inverted?: boolean;
  size?: UuButtonSize;
  state?: UuButtonState;
  iconVariant?: UuIconVariant;
}

/** IconButton (§6.2): hộp vuông 56/48/32, icon 24/24/16, cùng bảng màu với TextButton. */
export function UuIconButton({ icon, label, onPress, tone = 'accent', type = 'solid', inverted = false, size = 'base', state = 'normal', iconVariant = 'outline' }: UuIconButtonProps) {
  const { colors, sizes, radius, outerShadow } = useUu();
  const b = buttonSize(sizes, size);
  const s = resolveButtonStyle(colors, tone, type, inverted, state === 'disabled');
  const loading = state === 'loading';
  return (
    <UuPressable
      surface={s.surface}
      overlayColor={s.content}
      onPress={onPress}
      disabled={state === 'disabled' || loading}
      forced={forcedOf(state)}
      accessibilityLabel={label}
      accessibilityState={{ busy: loading || undefined }}
      style={{ borderRadius: radius.xl4, boxShadow: outerShadow }}
    >
      <View style={{ width: b.height, height: b.height, alignItems: 'center', justifyContent: 'center', backgroundColor: s.background, borderRadius: radius.xl4 }}>
        {loading ? <UuSpinner color={s.content} /> : <UuIcon name={icon} variant={iconVariant} size={b.icon} color={s.content} />}
      </View>
      <InsideBorder color={s.border} disabled={state === 'disabled'} />
    </UuPressable>
  );
}

export interface UuToggleButtonProps {
  active: boolean;
  icon: UuIconName;
  onToggle?: (next: boolean) => void;
  /** Thiết kế `↳ Label` (khi tắt). Bỏ trống = chỉ icon. */
  label?: string;
  /** Thiết kế `↳ Active label` (khi bật). Mặc định = label. */
  activeLabel?: string;
  size?: UuButtonSize;
  disabled?: boolean;
  forced?: UuForcedState;
}

/** ToggleButton (§6.7): bật thì nền interactive, icon đổi sang fill, chữ đậm thêm một bậc. Không viền, không bóng. */
export function UuToggleButton({ active, icon, onToggle, label, activeLabel, size = 'base', disabled = false, forced }: UuToggleButtonProps) {
  const { colors: c, sizes, text, radius, outerShadow } = useUu();
  const b = buttonSize(sizes, size);
  const t = active ? activeLabel ?? label : label;
  const bg = disabled ? (active ? c.backgroundDisabled : c.backgroundSurface) : active ? c.backgroundInteractive : c.backgroundSurface;
  const fg = disabled ? c.objectDisabled : active ? c.objectOnInteractive : c.objectPrimary;
  return (
    <UuPressable
      surface={active ? 'onDark' : 'onLight'}
      overlayColor={fg}
      onPress={onToggle ? () => onToggle(!active) : undefined}
      disabled={disabled}
      forced={forced}
      accessibilityRole="togglebutton"
      accessibilityLabel={t ?? icon}
      accessibilityState={{ checked: active }}
      style={{ alignSelf: 'flex-start', borderRadius: radius.xl4, boxShadow: outerShadow }}
    >
      <View style={{ minHeight: b.height, minWidth: b.height, width: t ? undefined : b.height, paddingHorizontal: t ? b.padX : 0, paddingVertical: t ? b.padY : 0, backgroundColor: bg, borderRadius: radius.xl4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: gap.g2 }}>
        <UuIcon name={icon} variant={active ? 'fill' : 'outline'} size={b.icon} color={fg} />
        {t && <Text numberOfLines={1} style={[active ? text.labelActive : text.label, { color: fg }]}>{t}</Text>}
      </View>
    </UuPressable>
  );
}

/** `.loading` (§6.12): vòng 18 × 18 gradient, quay 360°, màu theo content của nút. */
export function UuSpinner({ color, size = 18 }: { color: string; size?: number }) {
  const spin = useRef(new Animated.Value(0)).current;
  const gid = 'uu-spin-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  useEffect(() => {
    const a = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }));
    a.start();
    return () => a.stop();
  }, [spin]);
  const r = size / 2 - 1;
  const c = size / 2;
  // Cung gần trọn vòng (0.3 → 6.0 rad), đầu nhạt → đuôi đậm.
  const p = (a: number) => `${c + r * Math.cos(a)} ${c + r * Math.sin(a)}`;
  return (
    <Animated.View accessibilityLabel="Đang xử lý" accessibilityRole="progressbar" style={{ width: size, height: size, transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gid} x1="1" y1="0.5" x2="0" y2="0.5">
            <Stop offset="0" stopColor={color} stopOpacity={0} />
            <Stop offset="1" stopColor={color} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Path d={`M ${p(0.3)} A ${r} ${r} 0 1 1 ${p(6.0)}`} stroke={`url(#${gid})`} strokeWidth={2} strokeLinecap="round" fill="none" />
      </Svg>
    </Animated.View>
  );
}
