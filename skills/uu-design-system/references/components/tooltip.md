### 6.30 Tooltip (`Tooltip`)

A short label explaining an element on hover or focus — usually a text-less `IconButton` or a
collapsed `SideNav` item. **Props**: `Text` (TEXT) · `Placement` (`Top` · `Bottom` · `Left` · `Right`). **4 variants.**

| Part | Value |
|---|---|
| Bubble | padding **4 / 8** · radius `radius-sm` · background **`background-inverted`** · max-width **240** (`size-60`) |
| Text | `caption` **`object-primary-inverted`** |
| Arrow | 8 × 4, same color as the background, centered on the side facing the element |

Plain text only, no links / buttons inside (use `Popover` for that). Shows on hover **and** keyboard
focus. Don't use on touch screens — there is no hover.

**Tooltip as description or as name** (code, not a design variant): by default a tooltip **adds a description** to an
element that already has a name → wire `aria-describedby`. When the element **is icon-only** and the tooltip is its name
(collapsed `SideNav` item, `IconButton` without `label`) → wire `aria-labelledby` so screen readers read the name exactly
once. Web: prop `relation: 'description' | 'label'`; Flutter: `UuTooltip(isLabel: true)`. An `IconButton`
that already has a `label` keeps the tooltip as `description`.

**Timing**: hover → shows after **500 ms** (a pointer passing over does not trigger it); keyboard focus → shows **immediately**. Pointer leave,
focus loss or Esc → hides **immediately**, no fade. While one tooltip is open, moving to a neighboring element → the new tooltip shows
immediately, without waiting again.

**No multi-line tooltip with a title** — for a title or several points use `Popover` (§6.29).
