### 6.3d Radio (`Radio` · `RadioInput`)

Pick one of many. The library's "selection" set has three: Toggle button, Radio, and **Checkbox (6.3f)**.

**Props**: `Checked` (False/True) · `State` (Default/Hover/Pressed/**Error**/`[No state]`) ·
`Disabled` (False/True). **10 variants**: 2 × 4 states when `Disabled=False`, plus 2 variants
`Disabled=True` using `State=[No state]` — Disabled has no hover/pressed.

**Circle**: 32×32 · `rounded-circle` — the same size as the checkbox, not the 20 of the browser's
default radio.

| Checked | State | Background | **2px** border | Content | State layer |
|---|---|---|---|---|---|
| False | Default | `background-surface` | `border` | empty | — |
| False | Hover | `background-surface` | **`border-emphasized`** | empty | `object-secondary` `opacity-5` |
| False | Pressed | `background-surface` | **`border-emphasized`** | empty | `object-primary` `opacity-10` |
| True | Default | `background-surface` (STILL white) | **`border-interactive`** | dot **20** `object-interactive` | — |
| True | Hover | `background-surface` | `border-interactive` | dot 20 `object-interactive` | `object-interactive` **`opacity-20`** |
| True | Pressed | `background-surface` | `border-interactive` | dot 20 `object-interactive` | `object-interactive` **`opacity-40`** |
| False | **Error** | `background-surface` | **`border-negative`** | empty | — |
| True | **Error** | `background-surface` | **`border-negative`** | dot 20 **`object-negative`** | — |
| False | Disabled | **`background-disabled`** | `border-muted` | empty | — |
| True | Disabled | `background-surface` | `border-muted` | dot 20 `object-disabled` | — |

`Error` is for a required radio group with nothing selected, or an invalid choice — the same role as
Checkbox `Error`. The design only draws Error × Default; hover/pressed follow the general state-layer rule
§6.0, with the fill taken from the content color (`object-negative` when selected).

Radio's state layer is an **exception** to §6.0: selected uses 20/40 even though the ring background is light; unselected hover
is `object-secondary` 5%, pressed `object-primary` 10% (empty center, no object color).

**Radio row** (`RadioInput`): circle + text block, gap 12, aligned to the **TOP EDGE**
(`items-start`) — the text block has 4 top padding so its first line lines up with the circle's center. Center
alignment would make a three-line label push the circle down to the middle of the paragraph.

**List**: rows are 8 apart, with a 1px **DASHED** line between two rows running
full width — `stroke-dasharray 6 6`, color `border-muted` (#E2E8F0). The line belongs to the
LIST, not the row — the last row has none.

> Dashed, not solid. Build it with a gradient repeating every 12px (6 painted / 6 empty), don't
> use `border: 1px dashed`: the dash rhythm of `dashed` is chosen by the browser, differs per device
> and doesn't match the design's 6/6.

The touch target is the WHOLE ROW, not just the 32 circle (same rule as the checkbox). On a delete-account
sheet, mis-tapping an option means sending wrong data to the product, so a wide target matters.
