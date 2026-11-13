### 6.32 List row (`ListItem` · `ListGroup`)

One row shared by every list: settings pages, account / address / order lists, contacts. Switch,
Checkbox, chevron… are only **leading / trailing kinds** of the same row, not separate components.

**`ListItem` props**: `State` (VARIANT `Default` · `Hover` · `Pressed` · `Disabled`) · `Title` · `Description` (TEXT) ·
`Show description` · `Show leading` · `Show trailing` · `Divider` (BOOLEAN) · `Leading` · `Trailing` (INSTANCE_SWAP).
**4 variants.** Leading / Trailing are slots swapped to existing components, they don't multiply variants.

```
ListItem          H · gap 12 · horizontal padding list/padding-x (16 · Compact 12), vertical list/padding-y (12 · Compact 8) · FILL · min-height list/min-height (56 · Compact 40) · vertically centered
├─ Leading        optional (table below)
├─ Content        V · gap 2 · FILL
│  ├─ Title       body · object-primary · max 2 lines
│  └─ Description caption · object-secondary · optional
└─ Trailing       optional (table below)
```

| Leading | Look |
|---|---|
| `Icon` | UU icon **24**, `object-primary` |
| `IconContainer` (`.ListIconContainer`) | **40** circle with `background-accent-muted`, 24 icon `object-accent` |
| `Avatar` (`.ListAvatar`) | **40** round image (`rounded-circle`) |
| `Checkbox` · `Radio` | `Checkbox` / `Radio` (§6.3f, §6.3d) at the right density |

| Trailing | Look |
|---|---|
| `Chevron` | `chevron-right` **16**, `object-secondary` — the row opens another screen |
| `Switch` | `Switch` (§6.17) |
| `Value` (`.ListValue`) | `body` text `object-secondary`, one line — the current setting (e.g. "Tiếng Việt") |
| `Badge` | `Badge` (§6.14) or `NotificationBadge` (§6.16) |
| `Action` | `IconButtonNeutral` Ghost Small — one separate action on the row (edit, delete, call) |

**Divider**: a 1px `border-muted` line at the bottom of the row, **indented to the Content** (starting at the Title's left edge, not running
under the Leading), flush to the right edge. The last row of a group has no line.

**The whole row is clickable**: state layer `object-primary` **5 / 10** (Hover / Pressed) over the whole row, per §6.0. A row with a Leading
`Checkbox` / `Radio` or a Trailing `Switch` means **pressing the row = toggling / selecting** — in long lists use `ListItem` instead of
`CheckboxInput` / `RadioInput`. A Trailing `Action` has its own hit area (does not activate the row); the row stays clickable.
A non-clickable (display-only) row has no state layer.

**Disabled**: Title, Description, Value `object-disabled`; Leading / Trailing in their `Disabled` state; no state layer.

**`ListGroup`** — a block grouping several `ListItem`s, settings-page style:

| Part | Value |
|---|---|
| Group title | `title-xs` UPPERCASE `object-secondary` (like `.MenuSection`), horizontal padding `list/padding-x`, 8 above the block — optional |
| Block | VERTICAL · background `background-surface` · radius `radius-lg` · `overflow: hidden` (the first / last row's state layer follows the corners) |
| Rows | `ListItem` `Divider=True`, except the last row |

Accessibility: a clickable row is a button (or `checkbox` / `radio` / `switch` when pressing the row toggles / selects), name = Title
(+ Description); a Trailing `Action` is a separate labelled button. Web: the list is `ul` / `li`. Inside a `ListGroup` every row
is **always** a `listitem`; a row with only `onClick` puts a button covering the whole row **inside** the row, and the `Action` button sits next to it
(never a control nested in a control).

**There is no**: swipe-to-reveal actions, drag to reorder, expandable rows, Title beyond 2 lines.
