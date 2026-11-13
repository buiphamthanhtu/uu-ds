### 6.7 Toggle button

A two-state on/off button. Unlike Text button it **keeps its state**, so `Active` is a prop independent of `State`.

**Props**

| Prop | Type | Values |
|---|---|---|
| `Size` | VARIANT | `Large` · `Base` · `Small` |
| `State` | VARIANT | `Default` · `Hover` · `Pressed` · `Disabled` |
| `Active` | VARIANT | `False` · `True` |
| `Label` | VARIANT | `False` (icon-only) · `True` (icon + text) |
| `↳ Label` | TEXT | Text when `Active=False`. Default `"Action"` |
| `↳ Active label` | TEXT | Text when `Active=True`. Default `"Action"` |

48 variants = 3 × 4 × 2 × 2, every combination.

The two text props are **intentional**: they let the copy change with state (e.g. `Theo dõi` → `Đang theo dõi`). In code map them to two separate props; don't share one string.

The two prop names match the values of the `Active` variant and the `Active` typography mode — all three use the same word for the same state.

**Layout**

| Size | Icon-only | With label | Padding (label) | Icon |
|---|---|---|---|---|
| Large | 56 × 56 | h56 | `8 / 24 / 8 / 24` | 24 |
| Base | 48 × 48 | h48 | `8 / 16 / 8 / 16` | 24 |
| Small | 32 × 32 | h32 | `4 / 12 / 4 / 12` | 16 |

Gap 8 · radius `rounded-circle` · **no border, no shadow** in any variant. This is intentional — the component floats over images or colored backgrounds, not white.

**Color and text**

| | `Active=False` | `Active=True` |
|---|---|---|
| Background | `background-surface` | `background-interactive` |
| Icon & text | `object-primary` | `object-on-interactive` |
| Icon variant | **`outline`** | **`fill`** |
| Text prop | `↳ Label` | `↳ Active label` |
| Font weight | `semibold` (600) | `bold` (700) — via the `Active` typography mode |

Two things easily missed when building:
- The icon **switches variant** outline ↔ fill, not just color.
- Text gets **one step bolder** when on, via the `Active` typography mode (section 3), not a weight override on each node. Because the component hugs width, the width differs by exactly 1px between the two states (115 ↔ 116 at Base). Don't hardcode width.

**State overrides**

| State | Active=False | Active=True |
|---|---|---|
| `Default` | baseline | baseline |
| `Hover` | + state layer `object-primary` `opacity-5` | + state layer `object-on-interactive` `opacity-20` |
| `Pressed` | + state layer `object-primary` `opacity-10` | + state layer `object-on-interactive` `opacity-40` |
| `Disabled` | background stays `background-surface`, text `object-disabled` | background becomes `background-disabled`, text `object-disabled` |

Matches the 6.0 rule exactly, no exceptions. `Disabled` has no state layer, and there is no `Loading` state.
