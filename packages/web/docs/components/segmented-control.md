### 6.13 Segmented control (`SegmentedControl` · `.Segment item`)

Component `SegmentedControl` (HUG × HUG) and internal item `.Segment item`. A one-of-many pill-tab
selector, unlike Toggle button (independent on/off) and Radio (choice in a form).

**Shell** (`SegmentedControl`): HORIZONTAL · padding **4** on all sides · gap **2** · radius **16**
(`radius-lg`) · background **`background-emphasized`** (the brand's neutral background, see 2.5). No props at the shell level; the number of items = the number of `.Segment item` instances
inside, the master has 3.

**Item** (`.Segment item`): HORIZONTAL · `min 40 × 40` · padding **4/12** · gap 8 · HUG · radius 12.

| Prop | Type | Default |
|---|---|---|
| `Active` | VARIANT | `False` · `True` — **currently selected** |
| `State` | VARIANT | `Default` · `Hover` · `Pressed` · `Disabled` |
| `↳ Name` | TEXT | `"Page"` |
| `Page name` | BOOLEAN | `true` — hide the text for an icon-only item (code: an icon-only item **must** have an accessible name — web `ariaLabel`) |
| `Icon` · `↳ Icon` | BOOLEAN · INSTANCE_SWAP | `false` — 24 icon before the text |
| `Suffix` · `↳ Slot` | BOOLEAN · INSTANCE_SWAP | `false` — 18 slot after the text (badge, count) |

| Active | State | Background | Shadow | Text (`label` 16/24) | State layer (radius 12) |
|---|---|---|---|---|---|
| False | Default | transparent | — | `object-secondary` · 600 | — |
| False | Hover | transparent | — | `object-secondary` · 600 | `object-primary` `opacity-5` |
| False | Pressed | transparent | — | `object-secondary` · 600 | `object-primary` `opacity-10` |
| False | Disabled | transparent | — | `object-disabled` · 600 | — |
| True | Default | **`background-surface`** | **`elevation-low`** | `object-primary` · **700** (`Active` mode) | — |
| True | Hover | `background-surface` | `elevation-low` | `object-primary` · 700 | `object-primary` `opacity-5` |
| True | Pressed | `background-surface` | `elevation-low` | `object-primary` · 700 | `object-primary` `opacity-10` |
| True | Disabled | **`background-disabled`** | `elevation-low` | `object-disabled` · 700 | — |

Three easy mistakes:

- **Text gets bolder through the `Active` mode**, not a weight override — the `Active=True` variant
  sets `explicitVariableModes typography=Active` at the item level, the same mechanism as Toggle button
  (3, 6.7). In CSS put `.uu-is-active` on the selected item.
- The item state layer uses an **`object-primary`** fill for both `Active` values, steps 5/10
  (light background) — not the item's object color as on buttons, because item text is usually `object-secondary`.
- Shell 48 = 40 + 4×2, items HUG so the bar shrinks to its text; don't split the width evenly unless the screen
  requires it, and don't hardcode 204.
