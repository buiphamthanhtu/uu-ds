### 6.22 Bottom bar (`BottomBar` · `base/FooterItem`)

Navigation bar between the app's **main screens**, at the bottom. Each item is a peer
destination; pressing an item switches screen, it does not filter content within the screen.

**`BottomBar` props**: `Active` (VARIANT `1`–`5`, the selected item) · `Compact` (VARIANT
`False` · `True`) · `3` · `4` · `5` (BOOLEAN, turn on items 3–5). **10 variants.** Items 1 and 2 always
exist, so the bar has **2 to 5 items**.

**`base/FooterItem` props** (internal): `Active` (`False` · `True`) · `Label` (BOOLEAN) ·
`↳ Label` (TEXT) · `Badge` (BOOLEAN) · icon (INSTANCE_SWAP). **2 variants.**

**Geometry**

| Part | Value |
|---|---|
| Shell (`Wrapper`) | HORIZONTAL · padding **4** (`gap-1`) · gap **4** · radius `rounded-circle` · background `background-surface` · no border, no shadow |
| `Compact=False` | shell **FILL** width; items **FILL** evenly; item height **56** → bar height **64** |
| `Compact=True` | shell **HUG**; items **HUG** 64 × 40, **no labels** → bar height **48** (5 items = 344) |
| Item | VERTICAL · padding **6 / 12** (`gap-1-5` / `gap-3`) · gap **4** · centered · min **64 × 40** (`size-16` × `size-10`) · radius `rounded-circle` |
| Icon | **24** box (`size-6`) |
| Label | `title-xs` **11/16 600**, one line |

| Item | Background | Icon | Label |
|---|---|---|---|
| `Active=False` | — | `outline` style · `object-secondary` | `object-secondary` |
| `Active=True` | `background-interactive-muted` | **`fill`** style · `object-interactive` | `object-interactive` |

**Badge**: `NotificationBadge` `Count` (§6.16), anchored to the **icon**'s top-right corner: the badge's right edge
aligns with the icon's right edge, the badge top sits **4px** above the icon top. Only on `Active=False` items — the
selected item shows no badge.

The selected item belongs to the **`interactive`** family (clickable), like `Tab` — not `accent`.
The icon switches `outline` → `fill` when selected, per §6.11.

**Standalone action button** — `base/FooterItemSpecial`, turned on by the BOOLEAN **`Action`** on `BottomBar` (still 10 variants).
A **separate** pill, 8 to the right of the shell, for **one primary action** (Quét mã, Tạo đơn) — not a navigation
destination, no Active state.

| `base/FooterItemSpecial` | Value |
|---|---|
| Props | `Type` (`Subtle` · `Emphasized`) × `Compact` (False · True) · `Label` (TEXT) — **4 variants** |
| `Compact=False` | **64 × 64** · padding 6/16 · icon 24 + `title-xs` label |
| `Compact=True` | **48 × 48** · padding 12 · icon only |
| `Subtle` | background `background-surface` · icon + label `object-interactive` · state layer 5 / 10 |
| `Emphasized` | background **`background-interactive`** · `object-on-interactive` · state layer 20 / 40 |
| Radius | `rounded-4xl` |

With an action button, `Compact=True` allows at most **4 items** (5 items + the button exceed the 390 width). Default `Emphasized`;
`Subtle` when the screen already has another Solid button.

**Not yet**: item `Hover` / `Pressed` / `Disabled`; bar position on screen (distance from the bottom, horizontal
margins, safe area); shadow or border for the shell when the screen background is also `background-surface`; labels longer
than the item width; more than 5 items.
