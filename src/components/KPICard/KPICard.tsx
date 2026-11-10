import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { Icon } from '../../icons';
import './KPICard.css';

/** Thiết kế: `Trend` — `Up` · `Down` · `[No trend]` (`none`). Icon luôn theo **chiều số**. */
export type KPICardTrend = 'up' | 'down' | 'none';
/** Thiết kế: `Polarity`. `inverse` cho chỉ số mà **tăng là xấu** (chi phí, tỉ lệ huỷ, thời gian chờ). */
export type KPICardPolarity = 'normal' | 'inverse';

export interface KPICardProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Thiết kế: `Label` (TEXT) — tên chỉ số. */
  label: ReactNode;
  /** Thiết kế: `Value` (TEXT) — con số chính, đã định dạng sẵn (ví dụ "1.250.000 ₫"). */
  value: ReactNode;
  /** Thiết kế: `Trend`. Mặc định `none` — không có `Delta`. */
  trend?: KPICardTrend;
  /** Chữ của `Delta`, ví dụ "12% so với tháng trước". Chỉ hiện khi `trend` khác `none`. */
  delta?: ReactNode;
  /**
   * Thiết kế: `Polarity`. `normal`: `Up` xanh, `Down` đỏ · `inverse`: `Up` `object-negative`, `Down` `object-positive`.
   * Chọn theo **ý nghĩa của chỉ số**, không theo con số đang hiện. Bỏ qua khi `trend="none"`. Mặc định `normal`.
   */
  polarity?: KPICardPolarity;
  /**
   * Thiết kế: `Interactive` (BOOLEAN) — bật khi có `href` hoặc `onClick`: cả thẻ là **một** link (`<a>`) hoặc nút
   * (`<button>`), có `chevron-right` cuối hàng Label và state layer phủ cả thẻ. Không đặt nút khác bên trong.
   */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

const TREND = {
  up: { icon: 'arrow-trend-up', sr: 'Tăng' },
  down: { icon: 'arrow-trend-down', sr: 'Giảm' },
} as const;

/**
 * KPICard (§6.26) — thẻ một con số chính trên dashboard. 5 variant: `Trend` × `Polarity` (bỏ qua khi `[No trend]`) · `Interactive`.
 * VERTICAL · padding `--card-padding` (16 · Compact 12) · gap 4 · `radius-lg` · nền `background-surface`
 * · viền 1px `border-muted` · FILL. Label `caption` secondary · Value `heading-base` primary tabular-nums.
 * Delta: icon 16 + `caption` — `Normal`: `Up` positive / `Down` negative · `Inverse`: đảo màu, icon giữ chiều số.
 * Interactive: `chevron-right` 16 `object-secondary` · state layer `object-primary` 5 / 10 phủ cả thẻ.
 */
export function KPICard({ label, value, trend = 'none', delta, polarity = 'normal', href, onClick, className, ...rest }: KPICardProps) {
  const t = trend !== 'none' ? TREND[trend] : null;
  const interactive = href !== undefined || onClick !== undefined;
  const body = (
    <>
      <span className="uu-kpicard__head">
        <span className="uu-kpicard__label">{label}</span>
        {interactive && <Icon name="chevron-right" size={16} className="uu-kpicard__chevron" />}
      </span>
      <span className="uu-kpicard__value">{value}</span>
      {t && (
        <span className="uu-kpicard__delta">
          <Icon name={t.icon} size={16} />
          <span className="uu-visually-hidden">{t.sr} </span>
          <span>{delta}</span>
        </span>
      )}
    </>
  );
  const props = {
    className: ['uu-kpicard', interactive && 'uu-kpicard--interactive uu-interactive uu-on-light', className].filter(Boolean).join(' '),
    'data-trend': trend,
    'data-polarity': t ? polarity : undefined,
    ...rest,
  };
  if (href !== undefined) return <a href={href} onClick={onClick} {...props}>{body}</a>;
  if (onClick) return <button type="button" onClick={onClick} {...props}>{body}</button>;
  return <div {...props}>{body}</div>;
}
