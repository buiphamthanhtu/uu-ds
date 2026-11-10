/// <reference types="vite/client" />
import { createContext, useContext, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import slim from './generated/index.json'; // sinh bởi scripts/build-icons.mjs: name → [category, outline, fill]

/**
 * Icon — wrapper duy nhất để dùng UU icon trong UU DS (docs/icons.md).
 *
 * - `name`: tên trong thư viện (`chevron-left`, `xmark`, `calendar-days`…). Tra ở src/icons/manifest.json.
 * - `variant`: `outline` (mặc định) · `fill` = trạng thái bật (Toggle button Active, tab đang chọn).
 * - `size`: hộp 16 · 18 · 24. Màu lấy từ `color` của phần tử chứa (SVG dùng currentColor).
 *
 * SVG được lazy-load theo category (src/icons/generated/*.json, sinh bởi scripts/build-icons.mjs).
 * Cần import đồng bộ thì dùng thẳng: `import xmark from '@/icons/svg/xmark.svg?raw'`.
 */
export type IconName = string;
export type IconVariant = 'outline' | 'fill';
export type IconSize = 16 | 18 | 20 | 24; // 20 chỉ cho icon `check` fill trong Checkbox (6.3f)

type Bundle = Record<string, { outline?: string; fill?: string }>;
type ManifestEntry = { category: string; outline: boolean; fill: boolean };

export const iconManifest: Record<string, ManifestEntry> = Object.fromEntries(
  Object.entries(slim as unknown as Record<string, [string, number, number]>).map(([n, [category, o, f]]) => [n, { category, outline: !!o, fill: !!f }]),
);
/** Bản đầy đủ (tags, node bản thiết kế) chỉ cần cho gallery — tải lười. */
export const loadFullManifest = () => import('./manifest.json').then((m) => m.default.icons as Record<string, ManifestEntry & { tags?: string; figma?: Record<string, string | null> }>);
export const iconNames: string[] = Object.keys(iconManifest);
export const iconCategories: string[] = Array.from(new Set(iconNames.map((n) => iconManifest[n].category))).sort();

const loaders = import.meta.glob<Bundle>('./generated/*.json', { import: 'default' });
const cache = new Map<string, Bundle>();
const pending = new Map<string, Promise<Bundle>>();

export function loadIconCategory(category: string): Promise<Bundle> {
  const hit = cache.get(category);
  if (hit) return Promise.resolve(hit);
  const inflight = pending.get(category);
  if (inflight) return inflight;
  const loader = loaders[`./generated/${category}.json`];
  const p = loader
    ? loader().then((b) => { cache.set(category, b); pending.delete(category); return b; })
    : Promise.resolve({} as Bundle);
  pending.set(category, p);
  return p;
}

export function getIconSvgSync(name: string, variant: IconVariant): string | undefined {
  const meta = iconManifest[name];
  if (!meta) return undefined;
  return cache.get(meta.category)?.[name]?.[variant];
}

export function useIconSvg(name: string, variant: IconVariant = 'outline'): string | undefined {
  const [svg, setSvg] = useState<string | undefined>(() => getIconSvgSync(name, variant));
  useEffect(() => {
    const meta = iconManifest[name];
    if (!meta) return;
    let alive = true;
    const cached = getIconSvgSync(name, variant);
    if (cached) { setSvg(cached); return; }
    loadIconCategory(meta.category).then((b) => { if (alive) setSvg(b[name]?.[variant]); });
    return () => { alive = false; };
  }, [name, variant]);
  return svg;
}

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: IconName;
  variant?: IconVariant;
  size?: IconSize;
  /** Có `title` thì icon mang nghĩa (role=img); không có thì là trang trí (aria-hidden). */
  title?: string;
}

const warned = new Set<string>();

/** Một icon của bộ riêng: SVG đủ thẻ `<svg>`, nét / nền tô bằng `currentColor`. Không có `fill` → trạng thái bật dùng lại outline. */
export type IconSetEntry = { outline: string; fill?: string };
export type IconSet = Record<string, IconSetEntry>;
const IconSetCtx = createContext<IconSet>({});

/**
 * Bộ icon riêng của sản phẩm (spec 4.3, Product DNA). Tên đăng ký ghi đè icon mặc định cùng tên; tên không đăng ký
 * vẫn lấy từ UU icon trong gói, nên icon nội bộ của component vẫn chạy. Lồng nhau thì gộp, lớp trong thắng.
 */
export function IconProvider({ icons, children }: { icons: IconSet; children: ReactNode }) {
  const parent = useContext(IconSetCtx);
  return <IconSetCtx.Provider value={{ ...parent, ...icons }}>{children}</IconSetCtx.Provider>;
}

export function Icon({ name, variant = 'outline', size = 24, title, className, ...rest }: IconProps) {
  const custom = useContext(IconSetCtx)[name];
  const builtin = useIconSvg(custom ? '' : name, variant);
  const svg = custom ? (custom[variant] ?? custom.outline) : builtin;
  const cls = ['uu-icon', `uu-icon--${size}`, className].filter(Boolean).join(' ');
  if (!custom && !iconManifest[name]) {
    if (import.meta.env.DEV && !warned.has(name)) {
      warned.add(name);
      console.warn(`[UU DS] Icon "${name}" không có trong bộ mặc định và chưa đăng ký qua <IconProvider>. Tra src/icons/manifest.json; tên gần giống không phải cùng icon.`);
    }
    return <span className={`${cls} uu-icon--missing`} title={`Icon "${name}" không có trong thư viện`} aria-hidden="true" data-icon={name} {...rest} />;
  }
  return (
    <span
      className={cls}
      data-icon={name}
      data-variant={variant}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg ?? '' }}
      {...rest}
    />
  );
}
