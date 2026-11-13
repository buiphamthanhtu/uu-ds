### 6.26 KPI card (`KPICard`)

A card with one main number on a dashboard. **Props**: `Label` · `Value` (TEXT) · `Trend` (`Up` · `Down` · `[No trend]`) × **`Polarity`** (`Normal` · `Inverse`; ignored with `[No trend]`) · **`Interactive`** (BOOLEAN). **5 variants.**

| Part | Value |
|---|---|
| Card | VERTICAL · padding `card/padding` (16 · Compact 12) · gap **4** · radius `radius-lg` · background `background-surface` · 1px border `border-muted` · FILL |
| `Label` | `caption` `object-secondary` |
| `Value` | `heading-base` `object-primary` · `tabular-nums` |
| `Delta` | HORIZONTAL gap **4** · 16 icon + `caption` |
| `Trend=Up` | `arrow-trend-up` + **`object-positive`** text |
| `Trend=Down` | `arrow-trend-down` + **`object-negative`** text |
| `Trend=[No trend]` | no `Delta` |

By default (`Polarity=Normal`) the `Delta` color follows **the direction of the number**: up green, down red. For metrics where **up is bad** (cost,
cancellation rate, waiting time) use **`Polarity=Inverse`**: `Up` is **`object-negative`**, `Down` is **`object-positive`**;
the icon still follows the number's direction (`arrow-trend-up` / `arrow-trend-down`). Choose `Polarity` by **what the metric means**, not by
the number currently shown.

**Clickable card** (`Interactive=true`, opens a detail page): a 16 `chevron-right` `object-secondary` at the end of the `Label` row; state
layer `object-primary` · `opacity-5` / `opacity-10` over the whole card (§6.0), radius following the card. The whole card is **one** link / button —
don't put other buttons inside. Focus: a 2px `border-emphasized` ring around the card.

**Not yet**: a small chart (sparkline) in the card — deferred.
