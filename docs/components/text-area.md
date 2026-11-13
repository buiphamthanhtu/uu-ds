### 6.3e Multi-line input (`TextArea`)

Multi-line input. It is a **separate component** `TextArea`, 9 variants — not a form of TextInput.
Any screen still stretching a TextInput tall should switch to this component.

**Props** — as Text input, without `Prefix` and `Action`:

| Prop | Type | Values |
|---|---|---|
| `Label` | BOOLEAN | `true` |
| `Placeholder` · `Input` | TEXT | `"Placeholder"` · `"Input"` |
| `Helper` · `Helper text` | BOOLEAN · TEXT | `false` · `"Helper text"` — hint line below the label, above the frame |
| `State` | VARIANT | `Empty` · `Hover` · `Focus` · `Typing` · `Filled` |
| `Disabled` · `Error` | VARIANT | `False` · `True` |

Same shell as Text input 6.3 — `.label` + `Field`, gap 4 — only the `Field` differs.
Master size 258 × **140** (24 + 4 + 112); **164** when `Error=True`.

| | Single line (6.3) | Multi-line |
|---|---|---|
| Field | HORIZONTAL · h **48** | **VERTICAL** · h **112** (`size/size-28`) · gap 8 |
| Padding | 0/12 | **12 on all four sides** |
| Text | vertically centered | anchored to the **TOP EDGE** |
| Character counter | none | **bottom-right** corner, `(n/100)` |

- Height 112 is EXACTLY THREE lines of text: 12 + 3×24 + 12 + room for the counter. Not a number
  rounded for looks — don't lower it to 88 or raise it to 120.
- **Counter** `(0/100)`: style **`caption` 13/20** `object-secondary`, RIGHT-aligned, full
  width. Smaller than the typed text and the label — it is secondary information of the field.

- Border, background and text color per state are **identical to the Text input table** (6.3): Hover has a state layer
  `object-secondary` 5%; Focus/Typing border `border-emphasized` + caret **1.5 × 24**
  `object-accent` at the left of the first line; Error border `border-negative`, label `object-negative`, error
  line `caption` `object-negative` under the Field, gap 4. Disabled: background `background-disabled`, label
  and counter `object-disabled`; typed text keeps `object-primary`, placeholder drops to
  `object-disabled`.
