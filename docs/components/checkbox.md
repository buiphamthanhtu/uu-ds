### 6.3f Checkbox (`Checkbox` · `CheckboxInput`)

Checkbox `Checkbox` and row `CheckboxInput` (box + text).

**Props**: `Value` (Unchecked/Checked/**Indeterminate**) · `State` (Default/Hover/Pressed/**Error**/`[No state]`) ·
`Disabled` (False/True). **15 variants**.

`CheckboxInput` also exposes its text as the `Label` property (TEXT) — override it directly
on the instance, no need to dig into a node.

**Box**: 32 × 32 · radius **12** (`radius-base`) — a rounded square, unlike Radio's circle.

| Value | State | Background | 2px border (INSIDE) | Content | State layer (radius 12) |
|---|---|---|---|---|---|
| Unchecked | Default | `background-surface` | `border-muted` | empty | — |
| Unchecked | Hover | `background-surface` | **`border-emphasized`** | empty | `object-secondary` `opacity-5`, bleeding over the border (inset −2) |
| Unchecked | Pressed | `background-surface` | **`border-emphasized`** | empty | `object-primary` `opacity-10`, inset −2 |
| Unchecked | Disabled | **`background-disabled`** | `border-muted` | empty | — |
| Checked | Default | **`background-interactive`** | — | `check` icon **fill** 20 · `object-on-interactive` | — |
| Checked | Hover | `background-interactive` | — | `check` fill 20 | `object-on-interactive` **`opacity-20`** |
| Checked | Pressed | `background-interactive` | — | `check` fill 20 | `object-on-interactive` **`opacity-40`** |
| Checked | Disabled | **`background-disabled`** | `border-muted` | `check` fill 20 · `object-disabled` | — |
| **Indeterminate** | Default | `background-interactive` | — | **16 × 2 bar**, round ends · `object-on-interactive` | — |
| Indeterminate | Hover | `background-interactive` | — | 16 × 2 bar | `object-on-interactive` `opacity-20` |
| Indeterminate | Pressed | `background-interactive` | — | 16 × 2 bar | `object-on-interactive` `opacity-40` |
| Indeterminate | Disabled | **`background-disabled`** | `border-muted` | 16 × 2 bar · `object-disabled` | — |
| Unchecked | **Error** | `background-surface` | **`border-negative`** | empty | — |
| Checked | **Error** | **`background-negative`** | — | `check` fill 20 · `object-on-negative` | — |
| Indeterminate | **Error** | **`background-negative`** | — | 16 × 2 bar · `object-on-negative` | — |

> **When to use `Error`.** When a **required** box is unchecked and the user has pressed the continue
> button — typically "Tôi đồng ý với Điều khoản". Report it right at the box with one line of `sm`
> `object-negative` text under the row; **don't** use a Toast, because Toasts dismiss themselves while a blocking error
> must stay. `Error` is on the `State` axis, so the design only has Error × Default; hover and
> pressed on an erroring box still follow the general state-layer rule in 6.0.

**Indeterminate** is for a "select all" box above a partially checked list. The content is
a **16 × 2 horizontal bar** with round ends (radius 1 = fully round at height 2), color
`object-on-interactive` — not a font minus sign, not the `minus` icon. Background and state
layer are identical to `Checked`. Pressing an Indeterminate box switches it to `Checked`.

A checked Checkbox is a **solid color block** — the language of "done", as opposed to Radio keeping a
white background. It uses `interactive`, so it changes color with the brand. The icon is
the `fill` variant of the UU icon `check` (per the "on state uses fill" rule, `icons.md`).

**Checkbox row** (`CheckboxInput`, 316 × 32): box + `Text wrapper`, gap 12, aligned to the **TOP
EDGE** (`items-start`), text wrapper 4 top padding, text `body` `object-primary` FILL — identical to
`RadioInput`. The touch target is the WHOLE ROW.
