import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  colors as brandColors, elevation as baseElevation, fontFamily as baseFontFamily, radius as baseRadius,
  sizes as densitySizes, text as densityText,
  type UuBrand, type UuColors, type UuSizes, type UuText, type UuTextStyle,
} from './tokens.g';

export type { UuBrand, UuColors, UuSizes, UuText, UuTextStyle };

/** Density (spec §4.1). `touch` = mặc định (app). `compact` = desktop / dashboard: control, field, chữ lùi một bậc. */
export type UuDensity = 'touch' | 'compact';

/** Layout (spec §4.2): `collapsed` chỉ đổi hiển thị (ẩn nhãn, tiêu đề nhóm, mục cấp 2), không đổi kích thước. */
export type UuLayout = 'expanded' | 'collapsed';

export type UuRadius = { [K in keyof typeof baseRadius]: number };
export type UuElevation = { [K in keyof typeof baseElevation]: string };
export type UuFontWeight = UuTextStyle['fontWeight'];
/** Họ font body: một tên, hoặc map theo độ đậm khi font nạp riêng từng weight. */
export type UuBodyFont = string | Partial<Record<UuFontWeight, string>>;

/** Một icon của bộ riêng: chuỗi SVG đủ thẻ `<svg>`, tô bằng `currentColor`. Không có `fill` → trạng thái bật dùng outline. */
export type UuIconSetEntry = { outline: string; fill?: string };
export type UuIconSet = Record<string, UuIconSetEntry>;

/**
 * Product DNA (spec 4.3) — phần sản phẩm được đổi. Phần khoá (state layer, chiều cao control, density,
 * cỡ chữ / line-height / font-weight, `rounded-circle`, token status) không có ở đây.
 */
export interface UuDna {
  /** 22 token thương hiệu (spec 2.5), ghi đè lên brand. */
  colors?: Partial<UuColors>;
  /** `radius-sm` → `radius-xl` (`sm` · `base` · `lg` · `xl`), `rounded-2xl` → `rounded-4xl` (`xl2` · `xl3` · `xl4` — nút, chip). */
  radius?: Partial<Omit<UuRadius, 'none' | 'circle'>>;
  /** `elevation-*`, cú pháp CSS box-shadow (`'2px 2px 0px 0px #111'` — blur 0 = bóng cứng).
   *  `none` là bóng của control (spec 4.3 `elevation-none`), mặc định không có; đi cùng `borderOuter` thì spread = độ dày viền (`'2px 2px 0px 2px #111'`). */
  elevation?: Partial<UuElevation>;
  /**
   * Họ font. `display` cho 4 style display; `body` cho mọi style còn lại. Chỉ đổi họ font — cỡ, line-height, độ đậm giữ thang.
   * Font nạp riêng từng độ đậm (`expo-font`, Android) thì truyền map theo weight: `{ '400': 'Inter_400Regular', '600': 'Inter_600SemiBold' }`.
   */
  fontFamily?: { display?: string; body?: UuBodyFont };
  /** Viền ngoài (spec 4.3 `border-outer-width` · `border-outer`) của control (nút, chip, checkbox, radio, switch, ô nhập) và thẻ
   *  (`CardSheet`, `CardDialog`, `KPICard`). Mặc định không có (width 0). Vẽ ngoài, không chiếm chỗ; `color` mặc định `objectPrimary`. */
  borderOuter?: { width?: number; color?: string };
}

export interface UuTheme {
  brand: UuBrand;
  density: UuDensity;
  layout: UuLayout;
  /** Token semantic theo brand (+ DNA). Component CHỈ đọc màu ở đây. */
  colors: UuColors;
  /** Kích thước control theo density. Không gõ cứng 56/48/32. */
  sizes: UuSizes;
  /** Text style theo density, đã áp font body của DNA. */
  text: UuText;
  /** Bo góc (+ DNA). */
  radius: UuRadius;
  /** Elevation (+ DNA). */
  elevation: UuElevation;
  /** Họ font display (+ DNA). Body đã nằm sẵn trong `text`. */
  fontDisplay: string;
  /** `boxShadow` của control: vòng viền ngoài + bóng theo DNA; `undefined` khi không có. */
  outerShadow: string | undefined;
  /** P33 (spec 4.3): màu viền **trạng thái thường** — bật vòng viền ngoài thì trong suốt (giữ độ dày, kích thước không đổi).
   *  Viền focus / Error / chọn / Disabled không đi qua hàm này. */
  restBorder: (color: string) => string;
  /** `boxShadow` vòng viền ngoài của thẻ theo DNA; `undefined` khi không có. */
  cardShadow: string | undefined;
  /** Bộ icon riêng đã đăng ký (ghi đè bộ mặc định theo tên). */
  icons: UuIconSet;
  showLabel: boolean;
  showSectionTitle: boolean;
  showNested: boolean;
  /** DNA đang áp — vùng con kế thừa. */
  dna: UuDna | undefined;
}

function bodyFamily(body: UuBodyFont | undefined, weight: UuFontWeight): string | undefined {
  if (!body) return baseFontFamily.body;
  if (typeof body === 'string') return body;
  return body[weight] ?? body['400'] ?? baseFontFamily.body;
}

function withBodyFont(text: UuText, body: UuBodyFont | undefined): UuText {
  if (!body) return text;
  return Object.fromEntries(Object.entries(text).map(([k, s]) => [k, { ...s, fontFamily: bodyFamily(body, s.fontWeight) }])) as UuText;
}

const make = (brand: UuBrand, density: UuDensity, layout: UuLayout, dna: UuDna | undefined, icons: UuIconSet): UuTheme => {
  const radius: UuRadius = { ...baseRadius, ...dna?.radius, none: baseRadius.none, circle: baseRadius.circle };
  const sz = densitySizes[density];
  // Ô nhập / ô chọn đọc thang radius: Touch field = radius-lg, selection = radius-base; Compact cả hai = radius-sm.
  const sizes: UuSizes = dna?.radius
    ? { ...sz, fieldRadius: density === 'touch' ? radius.lg : radius.sm, selectionRadius: density === 'touch' ? radius.base : radius.sm }
    : sz;
  const ow = dna?.borderOuter?.width ?? 0;
  const ring = ow > 0 ? `0px 0px 0px ${ow}px ${dna?.borderOuter?.color ?? brandColors[brand].objectPrimary}` : undefined;
  const outerShadow = [ring, dna?.elevation?.none].filter(Boolean).join(', ') || undefined;
  return {
    brand,
    density,
    layout,
    colors: dna?.colors ? { ...brandColors[brand], ...dna.colors } : brandColors[brand],
    sizes,
    text: withBodyFont(densityText[density], dna?.fontFamily?.body),
    radius,
    elevation: { ...baseElevation, ...dna?.elevation },
    fontDisplay: dna?.fontFamily?.display ?? baseFontFamily.display,
    outerShadow,
    restBorder: (color: string) => (ow > 0 ? 'transparent' : color),
    cardShadow: ring,
    icons,
    showLabel: layout === 'expanded',
    showSectionTitle: layout === 'expanded',
    showNested: layout === 'expanded',
    dna,
  };
};

const NO_ICONS: UuIconSet = {};
const Ctx = createContext<UuTheme>(make('default', 'touch', 'expanded', undefined, NO_ICONS));

export interface UuProviderProps {
  brand?: UuBrand;
  density?: UuDensity;
  layout?: UuLayout;
  /** Product DNA từ `DNA.md` của sản phẩm (spec 4.3). Không truyền thì kế thừa vùng cha. */
  dna?: UuDna;
  /**
   * Bộ icon riêng của sản phẩm (spec 4.3): tên → SVG. Tên đăng ký ghi đè icon mặc định cùng tên; tên khác vẫn lấy
   * UU icon trong gói. Gộp với bộ của vùng cha, lớp trong thắng. Khai tên cho TypeScript qua `UuIconRegistry`.
   */
  icons?: UuIconSet;
  children: ReactNode;
}

/**
 * Bọc ngoài app (hoặc một vùng). Vùng con không truyền prop nào thì kế thừa vùng cha,
 * nên đổi layout một vùng chỉ cần `<UuProvider layout="collapsed">`.
 */
export function UuProvider({ brand, density, layout, dna, icons, children }: UuProviderProps) {
  const parent = useContext(Ctx);
  const value = useMemo(
    () => make(
      brand ?? parent.brand, density ?? parent.density, layout ?? parent.layout, dna ?? parent.dna,
      icons ? { ...parent.icons, ...icons } : parent.icons,
    ),
    [brand, density, layout, dna, icons, parent],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Lấy theme hiện tại: `const { colors, sizes, text, radius } = useUu();` */
export const useUu = () => useContext(Ctx);

/** Đặt lại đúng theme đã có (vd. nội dung vẽ qua portal ở gốc app vẫn giữ brand / density của chỗ mở). */
export const UuThemeScope = ({ value, children }: { value: UuTheme; children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
