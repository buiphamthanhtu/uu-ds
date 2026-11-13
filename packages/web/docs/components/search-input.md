### 6.3g Search input (`SearchInput`)

Search field. Shares its frame
with Text input (6.3): root VERTICAL gap 4, optional `.label`, Field height **48** radius **16**
(`radius-lg`), 1px border, horizontal padding 12 (`gap-3`), gap 8 (`gap-2`), text `body` 400.

**Props**: `Value` (Empty/Filled) · `State` (Default/Hover/Focus/Typing/**Loading**/`[No state]`) · `Disabled`
(False/True) · `Label` · **`Cancel`** (BOOLEAN) · `Placeholder` · `Input`. **8 variants**. **No `Error`** —
a search field reports no format errors; no results is the results screen's business, not the field's.

Two things set it apart from Text input:
- A fixed **`magnifier` 24** icon in `object-secondary` on the left; cannot be turned off.
- A **`circle-xmark` 16 clear button** in `object-secondary` on the right, only when `Value=Filled`.

| Value | State | Border | Background | State layer | Right side |
|---|---|---|---|---|---|
| Empty | Default | `border-muted` | `background-surface` | — | — |
| Empty | Hover | `border-muted` | `background-surface` | `object-secondary` `opacity-5` | — |
| Empty | Focus | **`border-emphasized`** | `background-surface` | — | — |
| Filled | Default | `border-muted` | `background-surface` | — | `circle-xmark` 16 |
| Filled | Typing | **`border-emphasized`** | `background-surface` | — | `circle-xmark` 16 |
| Empty | Disabled | `border-muted` | **`background-disabled`** | — | — |
| Filled | Disabled | `border-muted` | **`background-disabled`** | — | — |

Text: placeholder `object-secondary`, value `object-primary`. A Disabled field **with text keeps
`object-primary`** — same rule as Text input, so users can still read what they entered; only the
placeholder drops to `object-disabled`.

> **Two places where the code is the standard.** (1) The clear button's touch target is **32 × 32**, while the icon is still drawn at 16 —
> 16px is below the minimum touch target on phones. (2) The `magnifier` icon when `Disabled`
> drops to **`object-disabled`**, same rule as DateInput's `calendar-days`.

**Loading** (`Value=Filled`, `State=Loading`): a **16** `.loading` replaces the clear button; border as Typing.

**Cancel button** (`Cancel=true`, mobile): the Field sits in a HORIZONTAL row gap 8, with a `TextButtonNeutral` **Ghost Small**
"Huỷ" on the right; the Field shrinks. Pressing Cancel: clears the text, removes focus, closes the panel. Only on a dedicated search screen.

**Suggestion / history panel** is a **`Menu` `Platform=Panel`** (§6.21) anchored under the field, gap 4, same width as the field:
- **Recent searches** group: `.MenuSection` "Tìm gần đây" + `TextButtonNeutral` Ghost Small "Xoá" on the right; rows
  `.MenuItem` `Prefix=true` with the **`clock`** icon.
- **Suggestions** group: `.MenuSection` "Gợi ý"; rows with the **`magnifier`** icon; the part matching the query is set in **600**.
- Empty field + focus → history only; typing → suggestions (and `State=Loading` while waiting). Nothing to show → don't open the panel.
- Full-screen mobile: the panel becomes a list covering the area under the field (no radius, no shadow), not a `Sheet`.

**Removing one history item**: a *Recent searches* row gets an `IconButtonNeutral` **Ghost Small** with the **`xmark`** icon at its end (label "Xoá “{từ khoá}”"). Pressing it removes that item only, the panel stays open, focus returns to the field; when everything is removed the *Recent searches* group disappears. The button has its own state layer and does not activate the row.

**Accessibility roles (web)**: the *Recent searches* panel is `role="list"`, each row a `listitem` containing the select button and the remove button (a listbox may not contain nested buttons). The *Suggestions* panel keeps `role="listbox"` with `option`s. Mobile uses native button semantics, unchanged.

**No small size** — density `Compact` already shrinks the field (`field-height` 32).
