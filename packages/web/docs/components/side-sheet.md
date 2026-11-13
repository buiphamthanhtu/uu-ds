### 6.28 Side sheet (`SideSheet`)

A panel sliding in from the right edge of a desktop screen to view / edit details without leaving the page. **Props**: `Type`
(`Standard` · `Modal`) × **`Width`** (`Base` · `Wide`) · `Title` (TEXT) · `Footer` (BOOLEAN). **4 variants.**

| Part | Value |
|---|---|
| Panel | VERTICAL · width **384** (`size-96`) — `Width=Wide` **480** (`size-120`) for long / multi-column forms · height FILL screen · background `background-surface` |
| `Standard` | 1px **left** border `border-muted` · sits next to the content, no scrim |
| `Modal` | `elevation-high` · radius `radius-lg` on the **two left corners** · scrim like `Sheet` |
| Header | padding `card/padding` · `Title` `heading-sm` + `IconButtonNeutral` Ghost Small `xmark` |
| Body | horizontal padding `card/padding` · gap **12** · scrolls when long |
| Footer | padding `card/padding` · gap **12** (`gap-3`, like `ButtonGroup`) · `TextButtonNeutral` **Outline Base** + `TextButtonAccent` **Solid Base**, right-aligned |

On apps use `Sheet` (§6.8), not `SideSheet`.

**There is no** left side sheet and no drag-to-resize — the panel always comes from the right edge, 384 or 480 wide.
