### 6.23 Table (`TableHeaderCell` · `TableCell`)

Data table for **desktop / dashboard** screens (density `Compact`). The design only has **cells**; rows and tables are
cell compositions: a row = same-height cells laid out horizontally, a table = a header row + data rows. There is no
separate `Table` component in the design — in code `Table` / `TableRow` are only a semantic `<table>` frame
around the cells, adding no geometry.

**`TableHeaderCell` props**: `Label` (TEXT) · `Sort` (`Off` · `Unsorted` · `Ascending` · `Descending`) ×
`Align` (`Left` · `Right`) × `State` (`Default` · `Hover` · `Pressed` — sortable columns only, `Sort≠Off`) + **`Type=Checkbox`** (1). **21 variants.**

| Part | Value |
|---|---|
| Cell | HORIZONTAL · height `table/header-height` (48 · Compact 32) · horizontal padding `table/cell-padding-x` (16 · 12) · gap **4** · 1px **bottom** border `border-muted` |
| Label | `title-sm` · `object-secondary`; **`object-primary`** when `Ascending` / `Descending` |
| Sort icon | 16 · `Ascending` `arrow-up` · `Descending` `arrow-down` (`object-primary`) · `Unsorted` `sort-vertical` `object-secondary` (sortable, not sorted) · `Off` no icon (not sortable) |
| `Align=Right` | icon **before** the label, both right-aligned — for **number** columns |
| `Hover` / `Pressed` | state layer `object-primary` · `opacity-5` / `opacity-10` over the whole cell — a sortable column is clickable (§6.0). `Sort=Off` has no states |
| `Type=Checkbox` | "select all" cell of the row-selection column · width **64** like the `TableCell` `Checkbox` cell · `Checkbox` (§6.3f) `Checked` when every row **on the current page** is selected, **`Indeterminate`** when some are · no label, no sorting, no state layer of its own (the state lives in the checkbox) · `aria-label="Chọn tất cả hàng"` |

**`TableCell` props**: `Content` (TEXT) · `TextButton` · `IconButton` (BOOLEAN, `Actions` cell) · `Type`
(`Text` · `Number` · `Secondary` · `Actions` · `Checkbox` · **`Status`**) × `State` (`Default` · `Hover` · `Selected`). **18 variants.**

| Part | Value |
|---|---|
| Cell | HORIZONTAL · height `table/row-height` (56 · Compact 40) · horizontal padding `table/cell-padding-x` · gap **8** · 1px bottom border `border-muted` |
| `Text` | `Content` `body` `object-primary` |
| `Secondary` | `caption` `object-secondary` — secondary columns (code, created date, note) |
| `Number` | `body` **right**-aligned, `font-variant-numeric: tabular-nums` |
| `Actions` | `TextButtonAccent` **Ghost Small** (`Action`, toggled by `TextButton`) + `IconButtonNeutral` **Ghost Small** (`More`, opens a `Menu`; toggled by `IconButton`) |
| `Checkbox` | `Checkbox` (§6.3f) — row selection · cell width 64 |
| `Status` | `StatusIndicator` (§6.15) left-aligned — status column (order, ticket, account); the status text lives in the indicator, the cell adds no text |
| `Hover` | state layer `object-primary` · `opacity-5` over the whole cell |
| `Selected` | background **`background-interactive-muted`** |

**Rules**
- Row hover / selection is a state of the **whole row**: every cell in the row has the same `State`.
- Number columns are right-aligned in both header and cells (`Align=Right` + `Type=Number`).
- Per-row actions are **never `Solid`** (§6.1 *Emphasis*). Two or more actions → keep one
  `Ghost` Small for the most used action, the rest go into the "⋯" menu.
- The table has **no** outer border and no vertical lines; only horizontal lines (each cell's bottom border).

**Not yet**: sticky columns on horizontal scroll, expandable rows, inline cell editing, drag-to-reorder columns,
empty / loading rows, a third density. Sticky columns, expandable rows, inline editing and column dragging are **deferred** — only when an admin screen needs them.
