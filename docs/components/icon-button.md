### 6.2 Icon button

**Props**: `Type` (Solid/Outline/Ghost) · `Inverted` (False/True) · `Size` (Large/Base/Small) · `State` (Default/Hover/Pressed/Disabled/Loading). 90 variants per set.

Prop names match Text button exactly — one component API can serve both.

**Layout**

| Size | Box | Icon | Radius | Padding |
|---|---|---|---|---|
| Large | 56 × 56 | 24 | `rounded-4xl` | 0 |
| Base | 48 × 48 | 24 | `rounded-4xl` | 0 |
| Small | 32 × 32 | 16 | `rounded-4xl` | 0 |

**Colors**: identical to the matching Text button table (Accent / Neutral), except:
- **Stroke width = 2px**, `strokeAlign: INSIDE` (same as Text button).
- Icon color uses the same `object-*` token as the Text button's text color.
- Neutral `Solid / Inverted=False` uses `background-inverted`; Accent uses `background-interactive`.
- State layer exactly per 6.0.

**State layer for `Inverted=True`** (checked across all 18 combinations):

| Type | Accent | Neutral |
|---|---|---|
| `Solid` (background is `background-surface`, i.e. light) | 5 / 10 | 5 / 10 |
| `Outline` | 20 / 40 | 20 / 40 |
| `Ghost` | 20 / 40 | 20 / 40 |

All 144 hover/pressed variants of the 4 button sets were audited and match the 6.0 rule 100%. No exception needs special handling in code.
- Disabled Solid → `background-disabled`; Outline → `border-muted` / `border-muted-inverted`.

**There is no Danger `IconButton`.** Per-row delete (trash icon) lives in the "⋯" menu (`IconButtonNeutral` Ghost Small opening a `Menu`) and is confirmed with a `Dialog` holding a `TextButtonDanger` Solid (§6.1).
