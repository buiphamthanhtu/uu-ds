### 6.16 Notification badge (`NotificationBadge`)

Dot/count signalling something new, placed on the corner of an icon or tab. Prop **`Content`** = `Count` · `Dot` (2 variants).

| Content | Size | Background | Text |
|---|---|---|---|
| `Count` | height **16** (`size-4`) · min-width 16 · horizontal padding 4 (`gap-1`) · radius `rounded-circle` · HUG to the number | `background-attention` | `object-on-attention`, **11px** (`font-size-xs`) / 16 (`font-height-xs`) / 600, centered |
| `Dot` | **8×8** (`size-2`) circle | `background-attention` | — |

Uses the **`attention`** family (2.2): the badge signals **new, not seen yet** — not `negative` (error), not `warning` (risk), not `accent`. A status family, does not change with brand. Not yet: a `99+` threshold, anchoring offset on icons, other color variants — the screen positions it; don't invent extra variants.
