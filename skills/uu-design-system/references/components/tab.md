### 6.20 Tab (`Tab`)

An item for switching
between **different content areas**, not for filtering a list.

**Props**: `State` (VARIANT: `Default` · `Active` · `Hover` · `Pressed` · `Disabled`) · `Tab` (TEXT, label) · **`Icon`** (BOOLEAN + INSTANCE_SWAP 16 icon) · **`Badge`** (BOOLEAN). **5 variants.**

**Geometry**: auto-layout **VERTICAL**, padding **12** on all sides, gap 12, `HUG × HUG` →
height **48**, width follows the text. No shell, no background, no border, no full-width base line.

| State | Text | Indicator |
|---|---|---|
| `Default` | `title-base` 16/24 **600** · `object-secondary` | — |
| `Active` | `title-base` 16/24 600 · **`object-interactive`** | LINE **32 × 4**, `stroke-cap` ROUND, `border-interactive` |
| `Hover` / `Pressed` | `object-secondary` | — · state layer `object-primary` `opacity-5` / `opacity-10` over the whole tab cell, radius `radius-sm` |
| `Disabled` | **`object-disabled`** | — · no state layer |

The indicator is an **absolute** `LINE` (`layoutPositioning: ABSOLUTE`), constraints
`CENTER / MAX`, placed at `y = 48` with `strokeAlign: CENTER` — its center sits exactly on the bottom edge, the top
half inside, the bottom half sticking out 2px (`clipsContent: false`). Width is **fixed at 32** and does not
grow with the label: a 121-wide tab still has a 32 bar. On the web build it as
a `32 × 4` `rounded-circle` block, `position: absolute; left: 50%; bottom: -2px`.


Hover / Pressed only exist on **non-Active** tabs — pressing the selected tab again does nothing.

**`TabBar`** — a row of tabs. **Props**: `Layout` (`Fixed` · `Scrollable`). **2 variants.**

| Layout | When | Geometry |
|---|---|---|
| `Fixed` | 2–4 tabs, short labels | FILL width, `Tab`s **FILL evenly** |
| `Scrollable` | ≥ 5 tabs or long labels | `Tab` HUG, **horizontal scroll**, left padding 16 (`gap-4`), clipped at the right edge; the Active tab scrolls itself into view |

Both: HORIZONTAL · gap 0 · no background · **a full-width 1px `border-muted` bottom border**; the Active bar (4px) overlaps
the border. Web: `role="tablist"`, left/right arrows switch tabs.

**Icon and badge** (optional): the tab content is a centered HORIZONTAL row — a **16** icon before the text (gap **8**), **in the text color** per state (`object-secondary` / `object-interactive` when Active / `object-disabled`; Active uses the `fill` style, others `outline`); a `NotificationBadge` **Dot** after the text (gap **4**) signals unseen new content. Tab height stays 48. The badge is secondary information — the tab label must carry the meaning; on the web add hidden "có mới" text for screen readers.

**No `TabBar` on dark backgrounds.**

> **Text and bar share the `interactive` family.** `Active` text uses `object-interactive`, the bar uses
> `border-interactive` — both change with brand and keep the text one step darker than the bar
> (now `indigo-600` / `indigo-500`). A tab is **clickable**, so it belongs to the `interactive` family like buttons and
> links — `accent` is for content emphasis. Don't use `object-accent` for tab text: a brand whose
> `accent` differs from `interactive` would get text in one color and the bar in another.

**Don't confuse with filter `Chip` and `SegmentedControl`** — see *Content categorisation* in the decision
trees. In short: if switching to the next item **changes the card layout below**, it is a `Tab`; if the cards stay
identical and just get fewer, it is a filter `Chip`; if the same content only changes view, it is a `SegmentedControl`.
