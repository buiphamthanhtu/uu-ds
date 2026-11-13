### 6.3c Date input (`DateInput`)

Date picker field. Never assemble a Text input plus a calendar icon yourself — wherever that is done, replace it with this component.

**Props**

| Prop | Type | Values |
|---|---|---|
| `Value` | VARIANT | `Empty` · `Filled` |
| `State` | VARIANT | `Default` · `Hover` · `[No state]` (when Disabled) |
| `Error` | VARIANT | `False` · `True` |
| `Disabled` | VARIANT | `False` · `True` |

There is no text prop (`Data`) and no `Label` prop at the set level — the label is the `.label` instance
inside, sample text `Label`. No `Focus`/`Typing`: the field does not accept typing.

**Structure**: same shell as Text input (6.3) and Dropdown (6.4).

```
DateInput             VERTICAL · gap 4 · FIXED 187 × HUG (h76; 100 when Error=True)
├─ .label             shared instance · Suffix=False · Tooltips=False · FILL × h24
│  └─ "Label"         body · object-primary (Error: object-negative · Disabled: object-disabled)
├─ Field              HORIZONTAL · padding 0/12 · gap 8 · FILL × h48 · radius 16 (radius-lg)
│  ├─ Text            FILL (flex 1 0 0, min-width 1)
│  └─ Icon            24×24 (size-6) · calendar-days outline · object-secondary
└─ Error message      caption · object-negative · ONLY when Error=True
```

**Per Value × State**

| Value | State | Field text | Style | Text color | Background · border | State layer |
|---|---|---|---|---|---|---|
| Empty | Default | `Bấm để chọn` | `body` 400 | `object-secondary` | `background-surface` · `border-muted` | — |
| Empty | Hover | `Bấm để chọn` | `body` 400 | `object-secondary` | as above | `object-secondary` `opacity-5` |
| Filled | Default | `DD/MM/YYYY` | **`body` 400** | `object-primary` | as above | — |
| Filled | Hover | `DD/MM/YYYY` | `body` 400 | `object-primary` | as above | `object-secondary` `opacity-5` |
| Empty · Filled | Error | as Default | `body` 400 | as Default; **Label `object-negative`** | `background-surface` · **`border-negative`** + error line | — |
| Empty | Disabled | `Bấm để chọn` | `body` 400 | **`object-disabled`**; Label `object-disabled` | **`background-disabled`** · `border-muted` | — |
| Filled | Disabled | `DD/MM/YYYY` | `body` 400 | `object-primary`; Label `object-disabled` | **`background-disabled`** · `border-muted` | — |

The `calendar-days` 24 icon is always `object-secondary` (Disabled: `object-disabled`). It is a hint that
"this opens a calendar", not a separately pressable action — don't color it `object-interactive`, don't
wrap it in an Icon button. `calendar` is a different icon in the same library; they are not interchangeable.

**Behavior**: tapping the field opens the **operating system's date picker**; the field does not accept typing, so there is no caret
and no keyboard. That way no wrongly formatted date reaches the backend. The value is displayed
as `DD/MM/YYYY`.
