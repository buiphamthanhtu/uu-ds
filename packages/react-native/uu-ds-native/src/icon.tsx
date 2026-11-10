import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { icons, type UuIconName as UuDefaultIconName } from './icons.g';
import { useUu } from './theme';

/**
 * Khai tên icon của bộ riêng cho TypeScript (module augmentation), rồi đăng ký SVG qua `<UuProvider icons>`:
 * `declare module 'uu-ds-native' { interface UuIconRegistry { 'paw': true } }`
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UuIconRegistry {}
/** UU icon trong gói + tên app khai trong `UuIconRegistry`. */
export type UuIconName = UuDefaultIconName | Extract<keyof UuIconRegistry, string>;
export type { UuDefaultIconName };
export type UuIconVariant = 'outline' | 'fill';
export type UuIconSize = 16 | 18 | 24 | 32 | 40 | 48;

export interface UuIconProps {
  name: UuIconName;
  /** `fill` = trạng thái bật (Toggle Active, tab đang chọn). */
  variant?: UuIconVariant;
  size?: UuIconSize | number;
  color: string;
  /** Có nhãn thì icon mang nghĩa; không có thì là trang trí, ẩn với trình đọc màn hình. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Icon UU (lưới 18 × 18 có lề). Hộp 24 thì nét chỉ chiếm ~60–65% — đúng thiết kế, đừng phóng path.
 * Bộ mặc định = UU icon công khai. Sản phẩm thêm icon / dùng bộ khác: `<UuProvider icons>` (spec 4.3) —
 * tên đăng ký ghi đè icon mặc định cùng tên. Tên không có ở cả hai thì TypeScript báo lỗi ngay.
 */
export function UuIcon({ name, variant = 'outline', size = 24, color, accessibilityLabel, style }: UuIconProps) {
  const custom = useUu().icons[name];
  const builtin = (icons as Record<string, { outline?: string; fill?: string } | undefined>)[name];
  const svg = custom ? custom[variant] ?? custom.outline : builtin?.[variant];
  if (!svg) {
    if (__DEV__) console.warn(`[UU DS] Icon "${name}" không có trong bộ mặc định và chưa đăng ký qua <UuProvider icons>.`);
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return (
    <View
      style={[{ width: size, height: size }, style]}
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
      accessibilityElementsHidden={!accessibilityLabel}
    >
      <SvgXml xml={svg} width={size} height={size} color={color} />
    </View>
  );
}
