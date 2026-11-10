import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { UuIcon, type UuIconName } from './icon';
import { Layer, Tap } from './interaction';
import { UuPressable, type UuForcedState } from './pressable';
import { useUu } from './theme';
import { gap, opacity, size } from './tokens.g';

type Base = { disabled?: boolean; forced?: UuForcedState; accessibilityLabel?: string };

/**
 * Checkbox (§6.3f): ô tick 32×32 radius 12 (Compact 24 / 8). `checked`: true · false · `null` = Indeterminate.
 * Checked = nền interactive + `check` fill 20; Indeterminate = vạch 16×2. Ô trống đi lớp 5/10, ô đã chọn 20/40.
 * `error` (`State=Error`): ô bắt buộc chưa tick — viền / nền đỏ.
 */
export function UuCheckbox({ checked, onChange, error = false, disabled = false, forced, accessibilityLabel }: Base & { checked: boolean | null; onChange?: (next: boolean) => void; error?: boolean }) {
  const { colors: c, sizes: z, outerShadow, restBorder } = useUu();
  const filled = checked !== false;
  const err = error && !disabled;
  const bg = disabled ? c.backgroundDisabled : filled ? (err ? c.backgroundNegative : c.backgroundInteractive) : c.backgroundSurface;
  const content = disabled ? c.objectDisabled : err && filled ? c.objectOnNegative : c.objectOnInteractive;
  return (
    <Tap
      onPress={onChange ? () => onChange(checked !== true) : undefined}
      disabled={disabled}
      forced={forced}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: checked === null ? 'mixed' : checked }}
    >
      {({ pressed, hover }) => {
        const border = disabled ? c.borderMuted : err ? c.borderNegative : hover || pressed ? c.borderEmphasized : restBorder(c.borderMuted);
        const layer = filled
          ? { color: content, o: pressed ? opacity.o40 : hover ? opacity.o20 : 0 }
          : { color: pressed ? c.objectPrimary : c.objectSecondary, o: pressed ? opacity.o10 : hover ? opacity.o5 : 0 };
        return (
          <View style={{ width: z.selectionSize, height: z.selectionSize, borderRadius: z.selectionRadius, backgroundColor: bg, borderWidth: disabled || !filled ? 2 : 0, borderColor: border, alignItems: 'center', justifyContent: 'center', boxShadow: outerShadow }}>
            {checked === null ? (
              <View style={{ width: size.s4, height: size.s0_5, borderRadius: size.s0_5 / 2, backgroundColor: content }} />
            ) : checked ? (
              <UuIcon name="check" variant="fill" size={z.selectionCheck} color={content} />
            ) : null}
            <Layer color={layer.color} opacity={layer.o} radius={z.selectionRadius} />
          </View>
        );
      }}
    </Tap>
  );
}

/** Radio (§6.3d): vòng 32 viền 2px; chọn = viền border-interactive + chấm 20 object-interactive, nền vẫn trắng. */
export function UuRadio({ checked, onSelect, error = false, disabled = false, forced, accessibilityLabel }: Base & { checked: boolean; onSelect?: () => void; error?: boolean }) {
  const { colors: c, sizes: z, radius, outerShadow, restBorder } = useUu();
  const err = error && !disabled;
  const bg = disabled && !checked ? c.backgroundDisabled : c.backgroundSurface;
  const dot = disabled ? c.objectDisabled : err ? c.objectNegative : c.objectInteractive;
  return (
    <Tap
      onPress={onSelect && !checked ? onSelect : undefined}
      disabled={disabled}
      forced={forced}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
    >
      {({ pressed, hover }) => {
        const border = disabled ? c.borderMuted : err ? c.borderNegative : checked ? c.borderInteractive : hover || pressed ? c.borderEmphasized : restBorder(c.border);
        // Vòng đã chọn có chấm đặc → bậc 20/40; vòng trống → 5/10.
        const layer = checked
          ? { color: dot, o: pressed ? opacity.o40 : hover ? opacity.o20 : 0 }
          : { color: pressed ? c.objectPrimary : c.objectSecondary, o: pressed ? opacity.o10 : hover ? opacity.o5 : 0 };
        return (
          <View style={{ width: z.selectionSize, height: z.selectionSize, borderRadius: radius.circle, backgroundColor: bg, borderWidth: 2, borderColor: border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: outerShadow }}>
            <Layer color={layer.color} opacity={layer.o} />
            {checked && <View style={{ width: z.selectionRadioDot, height: z.selectionRadioDot, borderRadius: radius.circle, backgroundColor: dot }} />}
          </View>
        );
      }}
    </Tap>
  );
}

/**
 * Switch (§6.17): bật/tắt CÓ HIỆU LỰC NGAY (khác Checkbox). Rãnh 56×32 viền 2px khi tắt.
 * Núm nở từ 16 (tắt, mép trái 8) lên 28 (bật, mép phải 2) kèm `check` 16. Chuyển 160 ms ease-out.
 */
export function UuSwitch({ checked: on, onChange, disabled = false, forced, accessibilityLabel }: Base & { checked: boolean; onChange?: (next: boolean) => void }) {
  const { colors: c, sizes: z, radius, outerShadow, restBorder } = useUu();
  const t = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: on ? 1 : 0, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [on, t]);
  const track = disabled ? c.backgroundDisabled : on ? c.backgroundInteractive : c.backgroundSurface;
  const inset = (z.switchHeight - z.switchHandleOn) / 2;
  const knobSize = t.interpolate({ inputRange: [0, 1], outputRange: [z.switchHandleOff, z.switchHandleOn] });
  const left = t.interpolate({ inputRange: [0, 1], outputRange: [z.switchPadding, z.switchWidth - inset - z.switchHandleOn] });
  const top = t.interpolate({ inputRange: [0, 1], outputRange: [z.switchPadding, inset] });
  return (
    <Tap onPress={onChange ? () => onChange(!on) : undefined} disabled={disabled} forced={forced} accessibilityRole="switch" accessibilityLabel={accessibilityLabel} accessibilityState={{ checked: on }}>
      {({ pressed, hover }) => {
        const border = disabled ? c.borderMuted : hover || pressed ? c.borderEmphasized : restBorder(c.border);
        // Núm tắt object-secondary, Pressed đậm sang object-primary (đúng bản vẽ).
        const knob = disabled ? (on ? c.backgroundSurface : c.objectDisabled) : on ? c.backgroundSurface : pressed ? c.objectPrimary : c.objectSecondary;
        const layerColor = on ? c.backgroundSurface : pressed ? c.objectPrimary : c.objectSecondary;
        const o = pressed ? (on ? opacity.o40 : opacity.o10) : hover ? (on ? opacity.o20 : opacity.o5) : 0;
        return (
          <View style={{ width: z.switchWidth, height: z.switchHeight, borderRadius: radius.circle, backgroundColor: track, overflow: 'hidden', boxShadow: outerShadow }}>
            <Layer color={layerColor} opacity={o} />
            {!on && <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.circle, borderWidth: 2, borderColor: border }} />}
            <Animated.View style={{ position: 'absolute', left, top, width: knobSize, height: knobSize, borderRadius: radius.circle, backgroundColor: knob, alignItems: 'center', justifyContent: 'center' }}>
              {on && <UuIcon name="check" variant="fill" size={z.switchHandleIcon} color={disabled ? c.objectDisabled : c.objectInteractive} />}
            </Animated.View>
          </View>
        );
      }}
    </Tap>
  );
}

export type UuChipType = 'select' | 'dropdown' | 'input';

export interface UuChipProps {
  label: string;
  type?: UuChipType;
  /** Thiết kế `Selected` — chỉ Select / Dropdown. */
  selected?: boolean;
  onSelectedChange?: (next: boolean) => void;
  /** Chỉ `dropdown`: panel đang bung → chip ở Selected và chevron đổi `chevron-up`. Neo panel bằng `UuMenuAnchor width="min"`. */
  open?: boolean;
  disabled?: boolean;
  /** Thiết kế `Prefix icon` — icon 16 trước chữ. Select đã chọn thì `check` thay chỗ. */
  prefixIcon?: UuIconName;
  /** Chỉ `input`: gỡ chip. */
  onRemove?: () => void;
  /** Nhãn đọc màn hình của nút gỡ. Mặc định "Gỡ {label}". */
  removeLabel?: string;
  /** Ép state để chụp docs. `input`: áp lên nút gỡ. */
  forced?: UuForcedState;
}

/**
 * Chip (§6.18): cùng thang TextButton Small — cao 32, padding 4/12, gap 8, radius circle, viền 2px vẽ đè.
 * Đã chọn: nền interactive-muted, viền border-interactive, chữ + icon + lớp phủ object-interactive.
 * `input`: một giá trị đã áp dụng — màu như chưa chọn, padding phải 4, nút gỡ `xmark` 16 trong ô tròn 24.
 */
export function UuChip({ label, type = 'select', selected = false, onSelectedChange, open = false, disabled = false, prefixIcon, onRemove, removeLabel, forced }: UuChipProps) {
  const { colors: c, sizes: z, text, radius, outerShadow, restBorder } = useUu();
  if (type === 'input') {
    const fg = disabled ? c.objectDisabled : c.objectPrimary;
    const box = Math.min(Math.max(z.controlHeightSmall - 2 * z.controlPaddingYSmall, 0), size.s6);
    return (
      <View style={{ alignSelf: 'flex-start', minWidth: z.controlHeightSmall, minHeight: z.controlHeightSmall, paddingLeft: z.controlPaddingXSmall, paddingRight: gap.g1, paddingVertical: z.controlPaddingYSmall, borderRadius: radius.xl4, flexDirection: 'row', alignItems: 'center', gap: gap.g2, boxShadow: outerShadow }}>
        {/* Viền vẽ đè, không cộng vào chiều cao (như nút Outline). */}
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.xl4, borderWidth: z.chipBorderWidth, borderColor: disabled ? c.borderMuted : restBorder(c.border) }} />
        {prefixIcon && <UuIcon name={prefixIcon} size={16} color={fg} />}
        <Text numberOfLines={1} style={[text.label, { color: fg }]}>{label}</Text>
        <UuPressable surface="onLight" overlayColor={fg} disabled={disabled} onPress={onRemove} forced={forced} accessibilityLabel={removeLabel ?? `Gỡ ${label}`} style={{ borderRadius: radius.circle }}>
          <View style={{ width: box, height: box, alignItems: 'center', justifyContent: 'center' }}>
            <UuIcon name="xmark" size={16} color={fg} />
          </View>
        </UuPressable>
      </View>
    );
  }
  const isOpen = open && type === 'dropdown' && !disabled;
  const on = selected || isOpen;
  // Disabled theo luật button: chưa chọn bỏ nền (như Outline), đã chọn giữ nền (như Solid).
  const bg = disabled ? (on ? c.backgroundDisabled : undefined) : on ? c.backgroundInteractiveMuted : undefined;
  const border = disabled ? c.borderMuted : on ? c.borderInteractive : restBorder(c.border);
  const fg = disabled ? c.objectDisabled : on ? c.objectInteractive : c.objectPrimary;
  const lead: UuIconName | undefined = type === 'select' && on ? 'check' : prefixIcon;
  return (
    <UuPressable
      surface="onLight"
      overlayColor={fg}
      onPress={onSelectedChange ? () => onSelectedChange(!selected) : undefined}
      disabled={disabled}
      forced={forced}
      accessibilityLabel={label}
      accessibilityState={{ selected: on, expanded: type === 'dropdown' ? isOpen : undefined }}
      style={{ alignSelf: 'flex-start', borderRadius: radius.xl4, boxShadow: outerShadow }}
    >
      <View style={{ minWidth: z.controlHeightSmall, minHeight: z.controlHeightSmall, paddingHorizontal: z.controlPaddingXSmall, paddingVertical: z.controlPaddingYSmall, backgroundColor: bg, borderRadius: radius.xl4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: gap.g2 }}>
        {lead && <UuIcon name={lead} variant={lead === 'check' ? 'fill' : 'outline'} size={16} color={fg} />}
        <Text numberOfLines={1} style={[text.label, { color: fg }]}>{label}</Text>
        {type === 'dropdown' && <UuIcon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={fg} />}
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.xl4, borderWidth: z.chipBorderWidth, borderColor: border }} />
    </UuPressable>
  );
}

/** Hàng ô + chữ (CheckboxInput / RadioInput): gap 12, canh mép trên, chữ đệm trên 4, chạm cả hàng. */
export function UuChoiceRow({ control, label, onPress, disabled = false }: { control: ReactNode; label: string; onPress?: () => void; disabled?: boolean }) {
  const { colors: c, sizes: z, text } = useUu();
  return (
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} accessible={false} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: gap.g3 }}>
      {control}
      <Text style={[text.body, { flex: 1, paddingTop: z.selectionLabelOffset, color: disabled ? c.objectDisabled : c.objectPrimary }]}>{label}</Text>
    </Pressable>
  );
}

export function UuCheckboxInput({ checked, label, onChange, disabled, error }: { checked: boolean | null; label: string; onChange?: (next: boolean) => void; disabled?: boolean; error?: boolean }) {
  return <UuChoiceRow control={<UuCheckbox checked={checked} onChange={onChange} disabled={disabled} error={error} accessibilityLabel={label} />} label={label} disabled={disabled} onPress={() => onChange?.(checked !== true)} />;
}

export function UuRadioInput({ checked, label, onSelect, disabled, error }: { checked: boolean; label: string; onSelect?: () => void; disabled?: boolean; error?: boolean }) {
  return <UuChoiceRow control={<UuRadio checked={checked} onSelect={onSelect} disabled={disabled} error={error} accessibilityLabel={label} />} label={label} disabled={disabled} onPress={checked ? undefined : onSelect} />;
}

export interface UuRadioOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

/** Nét đứt 6/6, 1px. */
export function UuDashLine({ color }: { color: string }) {
  return (
    <View style={{ height: 1, overflow: 'hidden' }}>
      <Svg width="100%" height={1}>
        <Line x1={0} y1={0.5} x2="100%" y2={0.5} stroke={color} strokeWidth={1} strokeDasharray="6 6" />
      </Svg>
    </View>
  );
}

/** Danh sách radio: hàng cách 8, giữa hai hàng một đường nét đứt 6/6 border-muted (hàng cuối không kẻ). */
export function UuRadioList<T>({ options, value, onChange }: { options: UuRadioOption<T>[]; value?: T; onChange: (v: T) => void }) {
  const { colors: c } = useUu();
  return (
    <View accessibilityRole="radiogroup" style={{ gap: gap.g2 }}>
      {options.map((o, i) => (
        <View key={String(o.value)} style={{ gap: gap.g2 }}>
          {i > 0 && <UuDashLine color={c.borderMuted} />}
          <UuRadioInput checked={o.value === value} label={o.label} disabled={o.disabled} onSelect={() => onChange(o.value)} />
        </View>
      ))}
    </View>
  );
}
