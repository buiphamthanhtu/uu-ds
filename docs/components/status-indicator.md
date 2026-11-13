### 6.15 Status indicator (`StatusIndicator`)

Colored dot + status text. Two props: **`Tone`** = `Neutral` · `Success` · `Warning` · `Error` · **`Highlight`**; **`Container`** = `None` · `Filled` (**10 variants**).

Structure: HORIZONTAL · gap **6** (`gap-1-5`) · `Dot` (ellipse **8×8**, `size-2`) · text **`title-sm`** 600.

**The dot pulses** in all 10 variants: opacity `1 → 0.3 → 1`, period **1.6s** `ease-in-out`, looping forever. Only the dot pulses; text and background stay still. When the user turns on reduced motion (`prefers-reduced-motion: reduce` on the web, *Reduce Motion* / *Remove animations* on apps) the dot stays at opacity 1. Figma draws the dot at opacity 1.

| Container | Size | Background | Dot | Text |
|---|---|---|---|---|
| `None` | height 20, no padding, no radius | — | `object-{tone}` (Neutral: `object-secondary`) | `object-primary` |
| `Filled` | height 24 · padding 2/8 (`gap-0-5`/`gap-2`) · radius `rounded-circle` | Neutral `background-inverted`, others `background-{tone}` | `object-on-{tone}` (Neutral: `object-on-dark`) | `object-on-{tone}` (Neutral: `object-on-dark`) |

**`Highlight`** is not a status but **"this item deserves attention"** (Mới, Nổi bật, Đề xuất) — it uses the **`accent`** family,
so it changes with brand: `Container=None` dot `object-accent` + text `object-primary`; `Filled` background `background-accent`,
dot + text `object-on-accent`. Don't use `Highlight` for errors (that is `Error`) or "new, not seen yet" (that is
`NotificationBadge`, the `attention` family). `Badge` has **no** Highlight.

Note `object-warning` is `yellow-500` (1.92 on white): with `Container=None` it is only the dot, the text stays `object-primary` — following "one signal per state" with text alongside. No states; not a control.
