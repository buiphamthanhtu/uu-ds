import { useState, type ReactNode } from 'react';
import { Platform, Pressable, View, StyleSheet, type AccessibilityRole, type AccessibilityState, type StyleProp, type ViewStyle } from 'react-native';
import { opacity } from './tokens.g';

/**
 * Nền bên dưới state layer quyết định bậc opacity (spec §6.0):
 * content sáng trên nền tối (`onDark`) → 20 / 40 · content tối trên nền sáng (`onLight`) → 5 / 10.
 */
export type UuSurface = 'onDark' | 'onLight';

/** Trạng thái ép để chụp tài liệu / đối chiếu thiết kế. Sản phẩm thật để trống. */
export type UuForcedState = 'hover' | 'pressed';

/**
 * Hover chỉ có với con trỏ (web, iPad có chuột). Trên iOS mới, chạm cũng phát `hoverIn` mà không có `hoverOut`
 * nên lớp hover bị kẹt sau khi bấm: bỏ qua hover từ ngón tay, và trên app xoá hover khi nhả tay.
 */
export function useUuHover() {
  const [hover, setHover] = useState(false);
  const handlers = {
    onHoverIn: (e?: { nativeEvent?: object }) => {
      if ((e?.nativeEvent as { pointerType?: string } | undefined)?.pointerType === 'touch') return;
      setHover(true);
    },
    onHoverOut: () => setHover(false),
    onPressOut: Platform.OS === 'web' ? undefined : () => setHover(false),
  };
  return [hover, handlers] as const;
}

export const stateOpacity = (surface: UuSurface, s: 'hover' | 'pressed') =>
  surface === 'onDark' ? (s === 'hover' ? opacity.o20 : opacity.o40) : s === 'hover' ? opacity.o5 : opacity.o10;

export interface UuPressableProps {
  children: ReactNode;
  surface: UuSurface;
  /** Màu lớp phủ = màu object của variant (chữ / icon). */
  overlayColor: string;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  forced?: UuForcedState;
  style?: StyleProp<ViewStyle>;
  /** Bo của lớp phủ, mặc định theo `style.borderRadius` nhờ `overflow: hidden`. */
  borderRadius?: number;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  testID?: string;
}

/**
 * Vùng bấm của UU DS: phủ một lớp màu object của variant với opacity theo `surface` khi hover (web, chuột) / pressed.
 * KHÔNG đổi nền, chữ, font-weight. Disabled và loading không có lớp phủ. Không dùng ripple Android.
 */
export function UuPressable({
  children, surface, overlayColor, onPress, onLongPress, disabled, forced, style, borderRadius,
  accessibilityRole = 'button', accessibilityLabel, accessibilityHint, accessibilityState, testID,
}: UuPressableProps) {
  const [hover, hoverHandlers] = useUuHover();
  const active = !disabled && (!!onPress || !!onLongPress);
  return (
    <Pressable
      testID={testID}
      onPress={active ? onPress : undefined}
      onLongPress={active ? onLongPress : undefined}
      {...hoverHandlers}
      disabled={!active}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || undefined, ...accessibilityState }}
      style={[{ overflow: 'hidden' }, style]}
    >
      {({ pressed }) => {
        const p = active && (forced === 'pressed' || (!forced && pressed));
        const h = active && !p && (forced === 'hover' || (!forced && hover));
        const o = p ? stateOpacity(surface, 'pressed') : h ? stateOpacity(surface, 'hover') : 0;
        return (
          <>
            {children}
            {o > 0 && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor, opacity: o, borderRadius }]} />}
          </>
        );
      }}
    </Pressable>
  );
}
