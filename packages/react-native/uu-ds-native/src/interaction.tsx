import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type AccessibilityRole, type AccessibilityState, type StyleProp, type ViewStyle } from 'react-native';
import { useUuHover, type UuForcedState } from './pressable';

export interface TapState {
  pressed: boolean;
  hover: boolean;
}

export interface TapProps {
  onPress?: () => void;
  disabled?: boolean;
  forced?: UuForcedState;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  children: (s: TapState) => ReactNode;
}

/**
 * Vùng bấm trả về trạng thái pressed / hover để component tự chọn màu viền, núm, lớp phủ
 * (Checkbox, Radio, Switch, Chip có luật state layer riêng ở §6.3f, §6.3d, §6.17, §6.18).
 */
export function Tap({ onPress, disabled, forced, style, accessibilityRole, accessibilityLabel, accessibilityState, children }: TapProps) {
  const [hover, hoverHandlers] = useUuHover();
  const active = !disabled && !!onPress;
  return (
    <Pressable
      onPress={active ? onPress : undefined}
      disabled={!active}
      {...hoverHandlers}
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || undefined, ...accessibilityState }}
    >
      {({ pressed }) => {
        const p = active && (forced === 'pressed' || (!forced && pressed));
        const h = active && !p && (forced === 'hover' || (!forced && hover));
        return children({ pressed: p, hover: h });
      }}
    </Pressable>
  );
}

/** Lớp phủ state layer: màu + opacity, phủ kín khung cha (cha cần `overflow: hidden` hoặc cùng bo góc). */
export const Layer = ({ color, opacity, radius }: { color: string; opacity: number; radius?: number }) =>
  opacity > 0 ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity, borderRadius: radius }]} /> : null;
