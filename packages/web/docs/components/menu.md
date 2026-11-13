### 6.21 Menu (`Menu` · `.MenuItem`)

Page `Menu` under `❖ SELECTION`, set `Menu`, and section `base` holding the
internal component `.MenuItem`. This is **the option panel that opens from
`Dropdown`** (6.4), previously recorded as "not yet, the screen builds its own".

**`Menu` props**: `Platform` (VARIANT: `Panel` · `Sheet`). **2 variants.**

| Platform | Geometry |
|---|---|
| `Panel` | V · gap **4** · padding **12** · `FIXED × HUG` · radius **24** (`rounded-2xl`) · background `background-surface` · **`elevation-low`** |
| `Sheet` | reuses the `Sheet` template (6.8) as is: `CardSheet` `Header="Menu"`, `CTA=false`, `Navigation=Close`, scrim `overlay` + `overlay-blur` |

**`Menu` props** (more): `Search` (BOOLEAN — a label-less `SearchInput` at the top of the panel) · `Footer` (BOOLEAN — "Bỏ chọn" +
"Áp dụng", used with `Type=Multiple`).

**`.MenuItem` props**: `Type` (`Single` · `Multiple`) · `Selected` (False/True) · `State` (Default/Hover/Pressed/`[No state]`) ·
`Disabled` (False/True) · `Prefix` (BOOLEAN — 24 icon before the text, `Single` only) · `Option` (TEXT). **16 variants.**

**Option row**: HORIZONTAL · gap **12** · padding **8** · radius **12** · `FILL × HUG` → height
**40**. Text style `body` 16/24.

| Selected | Row background | Text | Leading icon 24 | Check 16 | State layer |
|---|---|---|---|---|---|
| False · Default | — | `object-primary` | `object-secondary` | — | — |
| False · Hover | — | `object-primary` | `object-secondary` | — | `object-primary` `opacity-5` |
| False · Pressed | — | `object-primary` | `object-secondary` | — | `object-primary` `opacity-10` |
| False · Disabled | — | `object-disabled` | `object-disabled` | — | — |
| **True** · Default | **`background-accent-subtle`** | **`object-interactive`** | **`object-accent`** | `object-interactive` | — |
| True · Hover | `background-accent-subtle` | `object-interactive` | `object-accent` | `object-interactive` | **`background-interactive`** `opacity-5` |
| True · Pressed | `background-accent-subtle` | `object-interactive` | `object-accent` | `object-interactive` | `background-interactive` `opacity-10` |
| True · Disabled | — (tint dropped) | `object-disabled` | `object-disabled` | `object-disabled` | — (layer hidden) |

A selected row's background is a **light tint**, not a solid color, so the state layer still uses the light-background steps
**5 / 10** — only the fill changes to `background-interactive` to match the row's color family. Per 6.0.

**Panel anchoring** (`Platform=Panel`):
- Anchored **below** the element that opens it (`Dropdown` field, `SearchInput`, chip, "⋯" button), gap **4** (`gap-1`). Same width as the field
  (`Dropdown`, `SearchInput`); opened from a chip or button → minimum width **240** (`size-60`), aligned to the element's left edge.
- Not enough room below but enough above → **flip upward**, same 4 gap. Near the right edge → align to the element's right edge.
- Max height **320** (`size-80`); longer → **scroll inside the panel** — the quick search sticks to the top, the footer to the bottom.
- Closes on: a pick (`Type=Single`), click outside, Esc, or the opening element losing focus via Tab. `Type=Multiple`
  only closes via "Áp dụng", click outside or Esc (click outside / Esc does **not** apply a pending selection).
The 214 width in the master is only a sample size.

The table above is **`Type=Single`**. **`Type=Multiple`** (multi-select):

| | Value |
|---|---|
| Row start | **`Checkbox`** (§6.3f) instead of the `Prefix` icon; `Checked` follows `Selected`, `Disabled` follows the row |
| Selected background | **no** tint — the state lives in the checkbox |
| Text | `object-primary` (Disabled: `object-disabled`) |
| State layer | `object-primary` 5 / 10 over the whole row |
| Height | 48 in Touch (checkbox 32 + padding 8) · 40 in Compact |

A `Multiple` menu **does not close** on selection; turn on `Footer`: `TextButtonNeutral` Ghost Small "Bỏ chọn" + `TextButtonAccent`
Solid Small "Áp dụng" (the screen may write "Áp dụng (n)"), right-aligned, gap 8.

**Quick search** (`Search=true`): a label-less `SearchInput` at the top of the panel, **sticky at the top** when scrolling; filters options by
keyword. No option left → one `body` `object-secondary` line "Không tìm thấy “{từ khoá}”". Use when there are > 8 options.

**`.MenuSection`** — group title: padding 8/8/4/8, `title-xs` `object-secondary` UPPERCASE, prop `Title`.
**`.MenuDivider`** — divider between groups: 1px `border-muted`, vertical margin 4. The first group needs no divider above. The divider is only a drawn line (web
`aria-hidden`, no `role=separator`): the option list only contains options and groups. The checkbox in a `Type=Multiple` row is also only
graphics (the row is already an option with a selected state), not a second control nested in the row.

**Two-line description** (`.MenuItem` adds `Description` — TEXT + BOOLEAN, every `Type`): a second line under the option name,
style `caption` **`object-secondary`** (Disabled: `object-disabled`; selected in `Type=Single` stays `object-secondary`).
The row becomes `HUG` (height follows content), the icon / checkbox **aligns to the top** with the name line. Description max 2 lines, truncated with "…".

**Select all** (`Type=Multiple`, from 4 options): the first row is a `.MenuItem` `Type=Multiple` labelled "Chọn tất cả", directly followed by a
`.MenuDivider`. The row's checkbox: `Checked` when every option is selected, **`Indeterminate`** when some are, empty when none
are. Pressing while empty or partial → select all; while all selected → deselect all. While filtering with quick search it only affects
**the visible options**. `Disabled` options are not changed.
