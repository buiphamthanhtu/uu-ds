### 6.17 Switch (`Switch`)

Toggles a setting on/off, **takes effect immediately** — unlike Checkbox (select, then press a confirm
button).

**Props**: `Selected` (False/True) · `State` (Default/Hover/**Focus**/Pressed/`[No state]`) ·
`Disabled` (False/True). **10 variants** = 2 × 4 states when `Disabled=False`, plus 2 variants
`Disabled=True` using `State=[No state]`.

**Track**: 56 × 32 (`size-14` × `size-8`) · radius **16** (`radius-lg`).
**Thumb**: when OFF it is a **16** circle 8 from the left edge (`gap-2`); when ON it grows into a
**28** circle (`size-7`) with `background-surface` 2 from the right edge (`gap-0-5`), containing a
fill `check` icon **16** in `object-interactive`. The thumb changes both position and size — that is the main
motion, don't just slide a same-size thumb.

| Selected | State | Track | 2px border | Thumb | State layer |
|---|---|---|---|---|---|
| False | Default | `background-surface` | `border` | circle 16 `object-secondary` | — |
| False | Hover | `background-surface` | **`border-emphasized`** | circle 16 `object-secondary` | `object-secondary` `opacity-5` |
| False | Focus | `background-surface` | `border-emphasized` | circle 16 `object-secondary` | `object-secondary` `opacity-10` |
| False | Pressed | `background-surface` | `border-emphasized` | circle 16 **`object-primary`** | `object-primary` `opacity-10` |
| False | Disabled | **`background-disabled`** | `border-muted` | circle 16 `object-disabled` | — |
| True | Default | **`background-interactive`** | — | circle 28 `background-surface` + `check` 16 `object-interactive` | — |
| True | Hover | `background-interactive` | — | circle 28 | `background-surface` `opacity-20` |
| True | Focus | `background-interactive` | — | circle 28 | `background-surface` `opacity-40` |
| True | Pressed | `background-interactive` | — | circle 28 | `background-surface` `opacity-40` |
| True | Disabled | **`background-disabled`** | — | circle 28 `background-surface` + `check` 16 `object-disabled` | — |

Read the table using rule 6.0: the OFF half is a light background so 5/10, the ON half is a solid background so 20/40 — the fill
is always the variant's object color, so building it with `currentColor` (CSS) works for both halves. Only
`Pressed` when OFF changes the thumb from `object-secondary` to `object-primary` (one step darker);
this is the only exception to "the state layer is the entire effect" in this component, and the design file
draws it that way.

`Switch` **ON uses `interactive`** so it changes color with the brand.

**No** separate small size (density `Compact` already shrinks it) and **no** On/Off text in the track (text in the track is hard to read).

A switch with a label is a row: use `ListItem` with a Trailing `Switch` (§6.32), don't build the row yourself.
