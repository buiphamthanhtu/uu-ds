### 6.27 Side navigation (`SideNav` · `.SideNavItem` · `.SideNavSection`)

The vertical navigation bar of a web app / portal. The equivalent of `BottomBar` on apps.

**`SideNav` props**: `Listing` (SLOT) · `Collapsed` (`False` · `True`) — **2 variants**. Labels are also
controlled by the **`layout`** collection (§4.2): labels ← `layout/show-label`, group titles ← `layout/show-section-title`, level-2 items ← `layout/show-nested`.
**`.SideNavItem` props**: `Label` (TEXT) · `Chevron` (BOOLEAN) · `Level` (`1` · `2`) × `State`
(`Default` · `Hover` · `Active`) × `Collapsed` (`False` · `True`; only `Level=1` has `True`) — **9 variants**.
`.SideNavSection`: `Title` (TEXT), 1 variant.

| Part | Value |
|---|---|
| Bar | VERTICAL · padding **12** · gap **4** · width `sidenav/width` (288 · Compact 240) · 1px **right** border `border-muted` · background `background-surface` |
| `Collapsed=True` | width **73** · 48 square items · hides labels, chevrons and group titles · labels become a `Tooltip` (§6.30) · `Level=2` items hidden |
| Item | HORIZONTAL · horizontal padding `control/padding-x-small` · gap **8** · min-height `control/height-base` · radius `radius-sm` · icon `control/icon-base` · label `body` |
| `Level=2` | child item: no icon, replaced by a 24 indent (the icon's width) → label aligned with level-1 labels |
| `Chevron` | `chevron-down` 16 `object-secondary` at the end of a level-1 item with children · **rotates 180°** while the group is open (`transform`, 120 ms), never swapped for another icon · the item has `aria-expanded` |
| `Badge` | `NotificationBadge` **`Count`** (§6.16) at the end of the item, before the chevron · `Collapsed=True`: becomes a **`Dot`** at the icon's top-right corner |
| `State=Default` | icon `outline` `object-secondary` · label `object-primary` |
| `State=Hover` | state layer `object-primary` · `opacity-5` (pressed `opacity-10`) |
| `State=Active` | background **`background-interactive-muted`** · icon **`fill`** `object-interactive` · label `object-primary` · `aria-current="page"` |
| Group title | padding 16 / 12 / 4 / 12 · `title-xs` `object-secondary` UPPERCASE |

The selected item belongs to the `interactive` family like `BottomBar` / `Tab`. One `Active` item at a time.

**Collapse / expand button** (`SideNav` adds `Toggle` — BOOLEAN): an `IconButtonNeutral` **Ghost Small** with the **`sidebar-left`** icon at the top
of the bar, above the first item — right-aligned when expanded, centered when collapsed. Labels "Thu gọn thanh điều hướng" / "Mở rộng
thanh điều hướng", `aria-expanded`. Pressing it toggles `Collapsed` (web: `onCollapsedChange`; Flutter: `onCollapsedChanged`). The
collapse button has a `Tooltip` like collapsed items.

**No level-3 items** — beyond 2 levels, split into a separate page with `Tab` or `Breadcrumb`.

**Not yet**: an account area at the bottom of the bar.
