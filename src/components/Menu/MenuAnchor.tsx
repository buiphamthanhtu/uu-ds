import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** Rộng panel. `anchor` = bằng phần tử mở (ô `Dropdown`, `SearchInput`) · `min` = tối thiểu 240 (`size-60`), mở từ chip hay nút. */
export type MenuAnchorWidth = 'anchor' | 'min';

interface MenuAnchorContextValue {
  /** Đóng panel — `Menu` `type="single"` gọi sau khi chọn. */
  close: () => void;
  /** `Menu` báo kiểu của mình: `multiple` thì không đóng khi Tab ra ngoài (§6.21). */
  setMultiple: (multiple: boolean) => void;
}

const MenuAnchorContext = createContext<MenuAnchorContextValue | null>(null);

/** Dùng trong `Menu`: có giá trị khi menu nằm trong `MenuAnchor`. */
export function useMenuAnchor() {
  return useContext(MenuAnchorContext);
}

export interface MenuAnchorProps {
  /** Panel đang mở. */
  open: boolean;
  /** Gọi khi cần đóng: chọn xong (`Menu` `type="single"`), bấm ra ngoài, Esc, Tab ra khỏi phần tử mở. */
  onClose?: () => void;
  /** Phần tử mở panel — ô `Dropdown`, `SearchInput`, chip, nút "⋯". */
  anchor: ReactNode;
  /** Panel: một `Menu` `platform="panel"`. */
  children: ReactNode;
  /** Mặc định `anchor`. */
  width?: MenuAnchorWidth;
  className?: string;
  style?: CSSProperties;
}

/**
 * Neo panel `Menu` `Platform=Panel` (§6.21) dưới phần tử mở nó:
 * - cách 4 (`gap-1`); rộng bằng phần tử (`width="anchor"`) hoặc tối thiểu 240 (`width="min"`), canh mép trái;
 * - dưới không đủ chỗ mà trên đủ → lật lên trên; sát mép phải → canh mép phải;
 * - panel cao tối đa 320 (`size-80`, đặt ở `.uu-menu`), cuộn trong panel;
 * - đóng khi bấm ra ngoài, Esc (focus về phần tử mở), Tab ra khỏi cụm — trừ menu `type="multiple"`,
 *   chỉ đóng bằng "Áp dụng", bấm ra ngoài hoặc Esc. Menu `type="single"` tự đóng khi chọn xong.
 */
export function MenuAnchor({ open, onClose, anchor, children, width = 'anchor', className, style }: MenuAnchorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const multipleRef = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [align, setAlign] = useState<'start' | 'end'>('start');

  const close = useCallback(() => closeRef.current?.(), []);
  const setMultiple = useCallback((m: boolean) => { multipleRef.current = m; }, []);

  // Lật / canh phải theo chỗ trống của khung nhìn. Đo kích thước tự nhiên của panel, không phụ thuộc vị trí hiện tại.
  const place = useCallback(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    const r = root.getBoundingClientRect();
    const cs = getComputedStyle(panel);
    const gap = parseFloat(cs.marginTop) || parseFloat(cs.marginBottom) || 0;
    const h = panel.offsetHeight + gap;
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    setPlacement(below < h && above >= h ? 'top' : 'bottom');
    const vw = document.documentElement.clientWidth;
    setAlign(r.left + panel.offsetWidth > vw && r.right - panel.offsetWidth >= 0 ? 'end' : 'start');
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, close]);

  const focusAnchor = () => {
    const el = rootRef.current?.querySelector<HTMLElement>('.uu-menu-anchor__anchor input, .uu-menu-anchor__anchor button:not(:disabled)');
    el?.focus();
  };

  return (
    <MenuAnchorContext.Provider value={{ close, setMultiple }}>
      <div
        ref={rootRef}
        className={['uu-menu-anchor', className].filter(Boolean).join(' ')}
        data-width={width}
        style={style}
        onKeyDown={(e) => {
          if (open && e.key === 'Escape') { e.stopPropagation(); close(); focusAnchor(); }
        }}
        onBlur={(e) => {
          // Tab ra khỏi cụm (focus sang phần tử khác trên trang). Bấm chuột ra ngoài đã có pointerdown lo.
          const next = e.relatedTarget as Node | null;
          if (open && next && !e.currentTarget.contains(next) && !multipleRef.current) close();
        }}
      >
        <div className="uu-menu-anchor__anchor">{anchor}</div>
        {open && (
          <div ref={panelRef} className="uu-menu-anchor__panel" data-placement={placement} data-align={align}>
            {children}
          </div>
        )}
      </div>
    </MenuAnchorContext.Provider>
  );
}
