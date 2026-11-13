### 6.4 Dropdown

**Props**: `Data` (TEXT, `"Data"`) · `Label` (BOOLEAN, `true`) · `Value` (VARIANT: `Empty` ·
`Filled`) · `State` (VARIANT: `Default` · `Hover` · `[No state]`) · `Error` · `Disabled`.
**8 variants.**

Reuses the Text input shell exactly:
- Root VERTICAL · gap 4 · FIXED 187 × HUG (h76; 100 when Error=True)
- `.label` (instance shared with Text input, `Suffix=False`)
- `Field`: h48 · radius 16 · padding 0/12 · gap 8 · `background-surface` · border 1px `border-muted`
- Icon `chevron-down` 16×16 · `object-secondary` in every state

| Value | State | Field text | Style | Text color | Background · border | State layer |
|---|---|---|---|---|---|---|
| Empty | Default | `Bấm để chọn` | `body` 400 | `object-secondary` | `background-surface` · `border-muted` | — |
| Empty | Hover | `Bấm để chọn` | `body` 400 | `object-secondary` | as above | `object-secondary` `opacity-5` (inset −1) |
| Filled | Default | `Data` value | **`label` 600** | `object-primary` | as above | — |
| Filled | Hover | `Data` | `label` 600 | `object-primary` | as above | `object-secondary` `opacity-5` |
| Empty · Filled | Error | as Default | as Default | as Default; **Label `object-negative`** | `background-surface` · **`border-negative`** + error line | — |
| Empty | Disabled | `Bấm để chọn` | `body` 400 | **`object-disabled`**; Label `object-disabled` | **`background-disabled`** · `border-muted` | — |
| Filled | Disabled | `Data` | `label` 600 | `object-primary`; Label `object-disabled` | **`background-disabled`** · `border-muted` | — |

No Focus/Typing (the field does not accept typing). The option list that opens is the **`Menu` (6.21)**.

Dropdown and `DateInput` (6.3c) are the same "picker field" pattern: empty hint `body` 400
`object-secondary`, gray right-edge icon `object-secondary`, the same Hover/Error/Disabled table.
They differ in the selected value: Dropdown emphasizes it with **`label` 600**, DateInput keeps **`body` 400**; and in the
icon (`chevron-down` 16 ↔ `calendar-days` 24). CSS recipes `.uu-field__hint` /
`.uu-field__value` / `.uu-field__icon` in `tokens.css`.
