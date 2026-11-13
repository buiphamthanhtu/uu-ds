### 6.3b OTP Input (`OTPInput`)

Multi-digit verification code input. Wherever a hand-built code input appears, replace it with this component.

**Props**

| Prop | Type | Values |
|---|---|---|
| `Value` | VARIANT | `Empty` · `Filled` |
| `State` | VARIANT | `Default` · `Focus` · `Typing` · `[No state]` (when Disabled) |
| `Error` | VARIANT | `False` · `True` |
| `Disabled` | VARIANT | `False` · `True` |
| `Masked` | VARIANT | `False` · `True` — **hides the digits**, for PINs |

**14 variants**: `Empty/Default`, `Empty/Focus`, `Filled/Typing`,
`Filled/Default`, `Empty/Error`, `Filled/Error`, `Empty/Disabled` — each × `Masked`. There is no
`Focus/Error`, `Typing/Error` (the error only shows after the code is complete), and no `Filled/Disabled`.

**Structure**: root VERTICAL · gap 4 · **328 × 48** in the master (72 when `Error=True`), with
an `Input wrapper` HORIZONTAL · gap 8 inside, holding **6 cells**: `.base/input-default` when
`Masked=False`, `.base/input-masked` when `Masked=True`. These two cell sets are internal components,
7 variants each: `State` Empty/Hover/Focus/Filled/Disabled ×
`Error`.

**One cell**:
- The master draws a **fixed 48 × 48** (6×48 + 5×8 = 328). Code uses `flex: 1 0 0` ·
  `min-width` 36 · `max-width` 48 so on narrow phones cells shrink toward 36 instead of overflowing or scrolling
  horizontally — a code convention the design does not model.
- radius 16 (`radius-lg`) · background `background-surface` · 1px border
- text CENTERED, style `body` 16/24
- An empty cell shows a **`-`** in `object-secondary` — not a blank cell, and not
  a digit placeholder

**Cell states**

| State | Border | Content (`Masked=False`) | Content (`Masked=True`) |
|---|---|---|---|
| Not reached yet (`Empty`) | `border-muted` | `-` `object-secondary` | `-` `object-secondary` |
| Receiving input (`Focus`) | **`border-emphasized`** | `-` + **caret** `2 × 24` `object-accent` at the left edge | same |
| Filled (`Filled`) | `border-muted` | digit `object-primary` | **dot 8** `object-primary` (layer `Hidden pin`) |
| `Disabled` | `border-muted` · background **`background-disabled`** | `-` `object-disabled` | `-` `object-disabled` |
| Error | `border-negative` | keeps typed digits | keeps the dots |

The OTP caret is **2 px** wide (an earlier version said 1.5 — 1.5 belongs to Text input and TextArea,
see 6.3e). `Masked=True` only turns filled cells into dots: empty cells keep the `-`, the active
cell keeps its caret, border and background follow the same rules.

The red caret is the ONLY signal of which cell is receiving input — a border one step stronger
is indistinguishable from a normal cell at a glance. A wrong code is reported with red borders + an error line under
the cells, NOT a toast (same rule as Text input, 6.3).

**Error state of the whole group**

- **All six cells** switch to `border-negative` at once — never color a single cell. A wrong code is
  wrong as a whole; there is no way to know which digit is bad, so coloring one cell points at the wrong place.
- Cell background and text color **stay** (`background-surface` / `object-primary`). Only the frame
  signals the error; red text too would be two signals for one error.
- Typed digits **stay in the cells**. Clearing them forces retyping six digits for one mistake.
- No cell has a caret: the error only shows after all six digits are entered. Tapping a cell to edit
  brings the caret back and turns off the red borders.
- **The error line** sits inside the component's VERTICAL root, right below the `Input wrapper`, gap
  **4** (`gap-1`): style `caption` 13/20 · color `object-negative` · **centered** · full
  width. Unlike Text input — there the error line is LEFT-aligned under a single field; here the cell group is symmetric,
  so a left-aligned error line would read as belonging to cell 1.
