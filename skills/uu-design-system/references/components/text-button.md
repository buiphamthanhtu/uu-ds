### 6.1 Text button

**Three separate sets**: `TextButtonAccent`, `TextButtonNeutral` and `TextButtonDanger` (end of section). Same structure, different color tables.

**Props**

| Prop | Type | Values |
|---|---|---|
| `Action` | TEXT | default `"Action"` |
| `Prefix` | BOOLEAN | default `false` — turns on an icon left of the text |
| `Suffix` | BOOLEAN | default `false` — turns on an icon on the right |
| `Type` | VARIANT | `Solid` · `Outline` · `Ghost`; `TextButtonNeutral` also has `Tonal` |
| `Inverted` | VARIANT | `False` · `True` — for dark backgrounds |
| `Size` | VARIANT | `Large` · `Base` · `Small` |
| `State` | VARIANT | `Default` · `Hover` · `Pressed` · `Disabled` · `Loading` |

**Layout per size**

| Size | Height | Padding (T/R/B/L) | Gap | Radius | Text style |
|---|---|---|---|---|---|
| Large | 56 | `8 / 24 / 8 / 24` | 8 | `rounded-4xl` | `label` |
| Base | 48 | `8 / 16 / 8 / 16` | 8 | `rounded-4xl` | `label` |
| Small | 32 | `4 / 12 / 4 / 12` | 8 | `rounded-4xl` | `label` |

Auto-layout: `HORIZONTAL`, `HUG × HUG`. `min-width` = `min-height` = the size's height (56 / 48 / 32), so a short-label button is never narrower than a circle.

> **The `Outline` border must not add to the height.** The border sits inside (`strokeAlign: INSIDE`),
> so an `Outline` button is exactly as tall as a `Solid` one. On the web, `border: 2px` + `box-sizing: border-box`
> **still** adds 4px when height comes from content rather than a fixed `height`:
> a `Small` button has `4 + 24 + 4 = 32`, exactly `min-height`, so the border pushes it to **36**.
> `Base` and `Large` escape because content is only 44, below the 48 / 56 `min-height` — but only by luck;
> add a line of text or change padding and it breaks.
> Draw the border with `box-shadow: inset 0 0 0 2px` — it takes no space, and the state layer
> `::after { inset: 0 }` covers the whole border area. Same approach as `Chip` (6.18),
> `Switch` (6.17) and `Checkbox` (6.3f).
Suffix icon (instance `base/suffix`): **24×24 for Large and Base, 16×16 for Small** — same scale as Icon button. Only shown when `Suffix = true`.
Prefix icon (instance `base/prefix`, Type=Icon): **same size as the suffix**, before the label, gap 8 (the size's gap). Only shown when `Prefix = true`. Can be on together with `Suffix`. Icon color follows the variant's text color. Padding **does not change** with icons.

**Colors — Accent**

| Type | Inverted | Background | Border | Text |
|---|---|---|---|---|
| Solid | False | `background-interactive` | — | `object-on-interactive` |
| Solid | True | `background-surface` | — | `object-interactive` |
| Outline | False | — | `border-interactive` 2px | `object-interactive` |
| Outline | True | — | `border-interactive-inverted` 2px | `object-interactive-inverted` |
| Ghost | False | — | — | `object-interactive` |
| Ghost | True | — | — | `object-interactive-inverted` |

**Colors — Neutral**

| Type | Inverted | Background | Border | Text |
|---|---|---|---|---|
| Solid | False | `background-inverted` | — | `object-primary-inverted` |
| Solid | True | `background-surface` | — | `object-primary` |
| Outline | False | — | `border` 2px | `object-primary` |
| Outline | True | — | `border-inverted` 2px | `object-primary-inverted` |
| Ghost | False | — | — | `object-primary` |
| Ghost | True | — | — | `object-primary-inverted` |
| Tonal | False | `background-subtle` | — | `object-primary` |

`Tonal` exists only in `TextButtonNeutral`, without `Inverted=True`: **15 variants** (`Size` × `State`). A light-fill, borderless button for repeated actions on `background-surface` cards. Don't put it on `background-subtle`: the button disappears. State layer `object-primary` 5 / 10.

**State overrides** (all sets)

| State | Change |
|---|---|
| `Default` | baseline |
| `Hover` | + state layer, hover step (6.0). Background and text **unchanged** |
| `Pressed` | + state layer, pressed step (6.0). Font-weight unchanged |
| `Disabled` | no state layer. Solid, Tonal → bg `background-disabled`; Outline → border `border-muted` (Inverted: `border-muted-inverted`); every type → text `object-disabled` |
| `Loading` | no state layer. Container unchanged; spinner `.loading` (18×18, gradient sweep) sits **before** the label, gap 8. The label **stays visible**. With `Prefix` on, the spinner **replaces** the prefix icon (never both) |

#### `TextButtonDanger`

Button for **destructive, irreversible** actions: delete account, cancel order, remove device. **45 variants**:
same `Type` × `Size` × `State` axes as `TextButtonAccent` but **only `Inverted=False`**. Geometry,
padding, density, state layer, Loading and Disabled are **identical to `TextButtonAccent`**; the only difference is that the
`interactive` color family becomes **`negative`**.

| Type | Background | 2px border | Text · icon · spinner | State layer (hover / pressed) |
|---|---|---|---|---|
| `Solid` | `background-negative` | — | `object-on-negative` | `object-on-negative` · 20 / 40 |
| `Outline` | — | `border-negative` | `object-negative` | `object-negative` · 5 / 10 |
| `Ghost` | — | — | `object-negative` | `object-negative` · 5 / 10 |
| *every Type* · Disabled | as `TextButtonAccent` Disabled (`background-disabled` / `border-muted` / `object-disabled`) | | | — |

**No `Inverted=True`** — destructive buttons always sit on light backgrounds; a dark screen needing a destructive action opens a confirmation `Dialog` (light background).

Choosing between the three sets: the screen's main action → `Accent`; secondary, neutral actions → `Neutral`; actions
that **cannot be undone** → `Danger`. Don't use `Danger` just because a button "looks dangerous" (sign out, skip)
— those can be redone, so they stay `Neutral`.

**Emphasis within a screen**: one `Solid` button (Accent or Danger) per screen. Actions repeated per row or
per card (tables, lists) are **never `Solid`** — use `Ghost` Small, `Tonal` on white cards, or group them into a "⋯" menu
(`IconButtonNeutral` Ghost Small opening a `Menu`). Destructive per-row actions live in the "⋯" menu and are confirmed with a
`Dialog` holding a `TextButtonDanger` Solid.
