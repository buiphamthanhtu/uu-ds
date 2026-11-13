### 6.18 Chip (`Chip`)

A clickable label that **keeps its selected
state** — unlike a button (press and done) and unlike a Segment item (lives in a shared shell).

**Geometry copies `TextButtonNeutral` Small exactly**, no numbers of its own: height **32**, padding **4/12**
(`gap-1`/`gap-3`), gap **8** (`gap-2`), radius `rounded-4xl`, **2px** border, text `body` 16/24,
`min-width` = `min-height` = 32 (`size-8`). Text uses the **`label`** text style (16/24, 600 · Compact 500) like buttons.

**Props**: `Type` (Select/Dropdown/**Input**) · `Selected` (False/True — Select/Dropdown only) · `State` (Default/Hover/Pressed/Disabled)
· `Label` (TEXT) · **`Prefix icon`** (BOOLEAN + INSTANCE_SWAP 16 icon). **20 variants** (16 + 4 `Type=Input`).

| Selected | State | Background | 2px border | Text | State layer |
|---|---|---|---|---|---|
| False | Default · Hover · Pressed | — | `border` | `object-primary` | `object-primary` `opacity-5` / `opacity-10` |
| True | Default · Hover · Pressed | **`background-interactive-muted`** | **`border-interactive`** | **`object-interactive`** | **`object-interactive`** `opacity-5` / `opacity-10` |
| False | Disabled | — | `border-muted` | `object-disabled` | — |
| True | Disabled | **`background-disabled`** | `border-muted` | `object-disabled` | — |

A selected chip uses `interactive`, so it changes with brand. Disabled follows the button rule: an unselected
chip drops its background (like `Outline` Disabled), a selected chip keeps it (like `Solid` Disabled).

**Selected `Type=Select`** adds a **`check` 16 `fill`** icon **before** the text, in the text color
(`object-interactive`; Disabled `object-disabled`) — in a multi-select chip row you see at once which items are on, not
relying on color alone (§2.3).

> **Selected text is `object-interactive`** (per the UU DLS Figma file, decided 2026-10-19). Contrast on
> `background-interactive-muted`: Default **5.62**, UU **4.88** — both pass 4.5. A new brand must re-measure
> this pair (§2.3). **Don't** use `background-emphasized` as the selected chip background: it is `slate-200`, identical to
> `background-disabled` — a selected chip would look disabled.

**`Type=Dropdown`** adds a 16 `chevron-down` at the end, **in the text color** (`object-primary` unselected,
`object-interactive` selected, `object-disabled` disabled); no `check` icon; it shows the selected value, and pressing it
opens the list.

**The panel that opens** is a **`Menu`** (§6.21): mobile `Platform=Sheet`, desktop `Platform=Panel` anchored 4 below the chip,
minimum width 240. While open: the chip is `Selected=True` and the chevron becomes **`chevron-up`**.
- Filter by **one** value → `.MenuItem` `Type=Single`; closes as soon as one is picked; the chip label becomes the picked value.
- Filter by **many** → `Type=Multiple` + footer "Bỏ chọn" / "Áp dụng"; chip label "{Name} · n" (e.g. "Khu vực · 2").
- Nothing selected: the label is the filter name, chip `Selected=False`.

**Prefix icon** (`Prefix icon`, every `Type`): a **16** icon before the text, gap 8, **in the text color** (`object-primary` / `object-interactive` when selected / `object-disabled`). Selected `Type=Select`: the `check` icon **replaces** the prefix icon — a chip has only one leading icon.

**`Type=Input`** — a chip standing for **one entered or applied value** (keyword, recipient, active filter) that can be removed:
- Colors as `Selected=False` (no selected state); right padding **4** instead of 12.
- The chip ends with a remove button: **`xmark` 16** in the text color, inside a **24** circle (`size-6`); state layer `object-primary` 5 / 10 **covers only that circle**. The chip body is not clickable.
- Pressing `xmark` (or Backspace / Delete when the button has focus) → removes the chip, focus moves to the next chip (or back to the input when none are left).
- `Disabled`: text and icon `object-disabled`, border `border-muted`, cannot be removed.
- Web: `<Chip type="input" onRemove={…}>`; the remove button has `aria-label="Gỡ {label}"`. Flutter: `UuChip(type: UuChipType.input, onRemove: …)`.

**No size other than 32** — density `Compact` uses 24.
