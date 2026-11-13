### 6.3 Text input

**Props**

| Prop | Type | Default |
|---|---|---|
| `Label` | BOOLEAN | `true` |
| `Placeholder` | TEXT | `"Placeholder"` |
| `Input` | TEXT | `"Input"` |
| `Prefix` | BOOLEAN | `false` |
| `Action` | BOOLEAN | `false` |
| `Helper` | BOOLEAN | `false` — turns on a hint line below the label, above the field (every variant) |
| `Helper text` | TEXT | `"Helper text"` |
| `Value` | VARIANT | `Empty` · `Filled` — **separate from State** |
| `State` | VARIANT | `Default` · `Hover` · `Focus` · `Typing` · `[No state]` (when Disabled) |
| `Disabled` | VARIANT | `False` · `True` |
| `Error` | VARIANT | `False` · `True` |

9 variants: `Empty/Default`, `Empty/Hover`, `Empty/Focus`, `Filled/Typing`, `Filled/Default`,
`Empty/Error`, `Filled/Error` (height 100 instead of 76), `Empty/Disabled`, `Filled/Disabled`.

**Structure**

```
Text input            VERTICAL · gap 4 · FIXED × HUG
├─ .label             HORIZONTAL · gap 8 · FILL × HUG · h24
│  ├─ Text wrapper    HORIZONTAL · gap 4
│  │  ├─ "Label"      style body · object-primary
│  │  └─ .suffix      Required | Optional  (caption · object-secondary)
│  └─ Icon (tooltip)  16×16 · hidden by default
├─ Helper text        style caption · object-secondary · FILL × HUG · hidden by default · in every variant
├─ Field              HORIZONTAL · padding 0/12 · gap 8 · FILL × FIXED · h48 · radius 16
│  ├─ base/prefix     Icon 24 | Label · hidden by default
│  ├─ Text            style body
│  └─ suffix          padding-left 8 · **1px left divider `border-muted`** · holds a `TextButtonNeutral` Ghost Small (h32) · hidden by default
└─ Error message      style caption · object-negative · FILL × h20 · ONLY when Error=True
```

**Hint line** (`Helper text`, code `helperText`): sits **below the label, above the field** — 4 from the label, 4 from the Field (root gap),
style `caption`, color `object-secondary`, full width, wraps when long. With `Label` off, the hint sits right above the field. On error the
**hint stays** and the error line shows below the field as usual: a user who typed it wrong can still re-read the rule. Disabled → hint
`object-disabled`. Applies to `TextInput` and `TextArea` (`TextArea`'s word counter stays inside the frame). The input points at
the hint line, and on error at both, hint first (web `aria-describedby`, apps read the hint as a hint). The hint says **what to
enter** ("Tối thiểu 8 ký tự"), never repeats the label, one or two short lines since it pushes the field down.

Why above the field: format hints must be read **before typing**; the area below the field is often covered by the keyboard and autofill suggestions; and
the hint is never replaced by the error line exactly when it is needed most.

Root height: 76 when `Error=False` (24 + 4 + 48), **100** when `Error=True` (+ 4 + 20). With the hint on, add 4 + the hint height (20 per caption line). The error line takes real space, it is not an overlay — the layout around the field must make room for it; don't put the field flush against another block and let the error line overlap it.

`.suffix` variant `Required` renders `∙ Bắt buộc`; variant `Optional` is its counterpart. The content is Vietnamese — this system is written for VN products.

**Field per Value × State**

| Value | State | Background | Border 1px | Text | State layer |
|---|---|---|---|---|---|
| Empty | Default | `background-surface` | `border-muted` | `object-secondary` (placeholder) | — |
| Empty | Hover | `background-surface` | `border-muted` | `object-secondary` | + `object-secondary` `opacity-5`, bleeding over the border (inset −1) |
| Empty | Focus | `background-surface` | **`border-emphasized`** | `object-secondary` + caret 1.5×24 `object-accent` | — |
| Filled | Typing | `background-surface` | **`border-emphasized`** | `object-primary` + caret | — |
| Filled | Default | `background-surface` | `border-muted` | `object-primary` | — |
| Empty | Disabled | **`background-disabled`** | `border-muted` | `object-disabled`; **Label also `object-disabled`** | — |
| Filled | Disabled | **`background-disabled`** | `border-muted` | `object-primary`; Label `object-disabled` | — |
| Empty | Error | `background-surface` | **`border-negative`** | `object-secondary` (placeholder) | — |
| Filled | Error | `background-surface` | **`border-negative`** | `object-primary` | — |

The `Action` button in the suffix is a `TextButtonNeutral` **Ghost** Small (no fill, `object-primary`
600 text), behind a 1px vertical `border-muted` divider and padding-left 8.

> `Error=True` changes THREE things: the Field border becomes `border-negative` (1px, still radius 16), the **Label** text becomes `object-negative`, and the **Error message line appears** below the Field (gap 4, style `caption`, color `object-negative`, full width). Input text, background and placeholder stay. Error never combines with Disabled.
>
> The error line is **text, with NO icon**. Reason: red border + red label + red text are already three signals for the same thing; an icon would be a fourth signal adding no information. Applies to every field with `Error`: Text input, TextArea, OTPInput, DateInput, Dropdown.

> `Filled + Disabled` keeping `object-primary` text is **intentional**: the content is filled in and the user still needs to read it, so contrast must stay. Only the placeholder (`Empty + Disabled`) drops to `object-disabled`.
