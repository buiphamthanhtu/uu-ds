### 6.24 Table pagination (`TablePagination` · `.PageItem`)

The bar under a table: choose rows per page and change page. Unlike `Pagination` (§6.10b, the carousel bar indicator
on apps) — `TablePagination` has **clickable page numbers**.

**`.PageItem` props** (internal): `Page` (TEXT) · `State` (`Default` · `Hover` · `Selected` · `Ellipsis`). **4 variants.**
**`TablePagination`**: `Rows per page` (BOOLEAN — shows/hides the rows-per-page group on the left). 1 variant.

| Part | Value |
|---|---|
| Bar | HORIZONTAL · `space-between` · vertical padding **8** · FILL |
| Left | `caption` `object-secondary` "Hiển thị" · `Dropdown` (width 88) · `caption` "trên 120 dòng" |
| Right | gap **4** · `IconButtonNeutral` Ghost Small `chevron-left` · the `.PageItem`s · `IconButtonNeutral` Ghost Small `chevron-right` |
| `.PageItem` | min `control/height-small` square · horizontal padding `control/padding-x-small` · radius `rounded-circle` · `body` |
| `Default` | text `object-secondary` |
| `Hover` | state layer `object-primary` · `opacity-5` (pressed `opacity-10`, like `IconButtonNeutral` Ghost) |
| `Selected` | **2px `border-interactive`** border · text `object-primary` · `aria-current="page"` |
| `Ellipsis` | "…" `object-secondary` · not clickable, no state layer · `aria-hidden` |

Previous on the first page / next on the last page are **Disabled**.

**Truncation**: up to **7 pages** shows all. More than 7: always keep the first page, the last page, and the current page ± 1; each
gap between them becomes **one** `Ellipsis` cell. A gap of exactly **one** page shows that page number instead of "…"
("…" never replaces exactly one number). E.g. 20 pages, at 10: `1 … 9 10 11 … 20`; at 2:
`1 2 3 … 20`.

**No page-number input** — "…" truncation is enough.

**Not yet**: pagination without a known total row count.
