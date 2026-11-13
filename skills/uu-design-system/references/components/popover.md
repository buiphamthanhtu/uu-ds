### 6.29 Popover (`Popover`)

A floating frame anchored to an element, holding interactive content (short form, small confirmation). **Props**:
`Content` (SLOT) · `Title` (TEXT) · `Header` · `Footer` (BOOLEAN). 1 variant.

| Part | Value |
|---|---|
| Frame | VERTICAL · width **320** (`size-80`) · padding `card/padding` · gap **12** · radius `radius-lg` · background `background-surface` · `elevation-medium` |
| Header | `Title` `title-base` + `IconButtonNeutral` Ghost Small `xmark` |
| Footer | right-aligned · gap **8** (`gap-2`, Small buttons) · `TextButtonNeutral` **Ghost Small** + `TextButtonAccent` **Solid Small** |

Unlike `Tooltip`: a Popover opens on **click**, has buttons, and closes via the close button / Esc / click outside; a Tooltip
opens on hover / focus and has text only. Unlike `Menu`: a Menu is a list of choices.

**Position**: anchored **below** the element, left-aligned. Not enough room below → **flip upward**; near the right edge → align to the element's
right edge. Code measures and flips; the design only draws the default pose.

**No arrow** pointing at the anchor — a Popover separates itself with `elevation-medium`, unlike `Tooltip` (which has an arrow).
