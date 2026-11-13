# Icons — the UU icon set

Icons belong to the **design system**, not to individual screens or products. Every icon in a
product built on UU DS comes from one set: **UU icon**.

| Thing | Value |
|---|---|
| Icon set | UU icon |
| Styles per name | two styles · the **public edition** (`public: true`) only holds icons components use internally + `texture` (placeholder icon) |
| Styles | `outline` · `fill` — drawn at **18×18** |
| Sizes in use | 16 · 18 · 24 (`size-4` / `size-6`); Icon button: 24 for Large/Base, 16 for Small |
| Color | **No color of its own.** SVGs use `currentColor`; color comes from the container's `object-*` token |
| Lookup | `references/uu-icon-index.json` — name → group (`category`), available styles, `public` |
| SVG (skill) | `assets/icons/<category>.json` — full set × outline/fill, bundled per group; fetch with `scripts/icon.py` |
| SVG files (UU DS repo) | `src/icons/svg/` — **public names only** |

## Rules

1. **One `Icon(name, variant, size)` component** (or a sprite). Call icons by **set name**
   (`chevron-right`, `gift`, `list-checkbox`), with an `outline` / `fill` style. Don't store icon
   files per screen, don't draw your own, don't pick single icons from another set because they "look similar". Other sets only come in via DNA, as a whole set (rule 7).
2. **Icon names carry no color or state.** `icon-chevron-down-white.svg`, `fire-active.svg`
   are signs that a COLOR is being stored as an icon. That is one icon, painted with `object-on-interactive` or
   `object-disabled` depending on where it sits.
3. **The `fill` style = on state.** Toggle button `Active=True` and the selected navigation item
   switch to the `fill` style (same name); the normal state uses `outline`.
4. **Not in the set → stop and ask**, exactly like a token missing from `tokens.css`. The set here is the set
   the product attached via DNA; if none is attached, ask the user to choose a set (rule 7), using `texture` meanwhile.
   Look names up first in `uu-icon-index.json`; similar names (`cart` vs `cart-shopping`) are not
   the same icon.
5. Illustrations, badges, multi-color stickers are **not icons** — they are assets and go the asset route.
6. **The package only ships `public: true` icons; UU DS demos may add illustration icons.** The released packages
   (web, React Native, Flutter) only contain the 22 `public: true` icons. UU DS's Storybook, Widgetbook, React Native sample app
   and website may use extra illustration icons (house, gift, bell…): that is a separate DNA icon set
   (`src/docs/demo-icons` in the repo), attached via `IconProvider` / `uuThemeData(icons:)` / `UuProvider icons`,
   never in the package. Package plus illustration set stay within 100 names (the Nucleo license's public limit).
   To add a name to the package or the illustration set → ask the DS owner first; don't add it yourself. There is no public icon
   lookup page. Other icons in the `assets/icons/` bundle are for internal use only (mockups, private artifacts,
   unpublished prototypes).
7. **The 22 public icons only make components work and fill examples; they are not a product icon set.** A product that needs icons
   attaches a set: free like Lucide, a Nucleo license, or another suitably licensed set. Register the whole set
   via DNA (spec 4.3 — web `IconProvider`, app `UuProvider icons`), and name the set in the Images and icons section of DNA.md.
   A set without a `fill` style (like Lucide) reuses the outline for the on state; components still change background / color as usual.
   A registered name overrides the default icon of the same name; unregistered names fall back to the default set. One product, one set,
   never mixing single icons of two sets on one screen. The license of a set the product attaches belongs to the product:
   using UU icons beyond the public edition (Nucleo origin, see `NOTICE.md` in the repo) requires a Nucleo license in the name of the
   organization releasing the product.

## Getting SVGs

SVGs live in per-group bundles: `assets/icons/<category>.json` =
`{"category": …, "icons": {"<name>": {"outline": "<svg…>", "fill": "<svg…>"}}}`. Grouped
because Claude Chat allows 200 files per skill. Every SVG has `viewBox="0 0 18 18"`, no `width`/`height`,
color `currentColor`. Exception: `loader-2` and `loader-2-fill` keep their fixed-color gradient as in the original.

```bash
python3 scripts/icon.py magnifier            # outline SVG
python3 scripts/icon.py magnifier fill       # fill SVG
python3 scripts/icon.py --search cart        # look up names
python3 scripts/icon.py --public             # public names
python3 scripts/icon.py --out ./icons house gift   # write <name>.svg / <name>-fill.svg
```

- **React projects using the `uu-ds` package:** call `<Icon name variant size />`; don't copy SVGs.
- **Artifact / single-file HTML (Claude Chat):** inline the SVG, wrapped in a box of the right size
  (16 · 18 · 24), and let the container's `color` decide the color:

```html
<span class="uu-icon" style="display:inline-flex;width:24px;height:24px;color:var(--object-secondary)">
  <!-- output of: python3 scripts/icon.py magnifier --><svg viewBox="0 0 18 18" width="100%" height="100%">…</svg>
</span>
```

## Adding an icon to UU icon

1. Draw on the **18 × 18 grid with margins**, at the set's stroke weight. Export two files:
   add those two SVG strings to the skill's `assets/icons/<category>.json` (keys `outline` / `fill`).
2. Normalize the SVG: `viewBox="0 0 18 18"`, **drop** `width`/`height`, every `fill`/`stroke` → `currentColor`.
   Give any `clipPath` an id unique to the icon name so two icons on one page don't collide.
3. Add a line to `uu-icon-index.json` (`category`, `outline`, `fill`; `public: true` only once approved for public release).
4. Public icons: copy the two files to the repo's `src/icons/svg/`, add a line to `src/icons/manifest.json`,
   run `npm run icons` (web) and `npm run flutter:icons` (Flutter).

Icon names: lowercase, hyphenated, describe the **shape**, not where it is used — `calendar-days`, not `date-picker-icon`.

## Box size and glyph size — read before complaining "the icon is the wrong size"

UU icon draws every icon on an **18 × 18 grid with margins**. In a 24 box the actual
glyph only fills about 60–65% of the box. Measurements on the Toast close button:

| `Icon` box | Visible `xmark` glyph | Container |
|---|---|---|
| 24 | 15.3px | Icon button Base 48 / Large 56 |
| 16 | ≈ 10px | Icon button Small 32 |

This is the drawing's intent: the box keeps the touch target and layout rhythm, the margin keeps
thin-stroke icons from crowding text. **Don't** scale paths to fill the box, **don't** swap single icons for Lucide / Phosphor / Font Awesome
because they are "also 24" — each set has its own stroke-to-box ratio (Lucide `x` is a 12 glyph with stroke 2, FA `xmark`
fills nearly the whole box), so the same 24 looks completely different. A product may attach the whole Lucide set via DNA, but
check icons next to text and buttons once: Lucide is thicker and larger than UU icon in the same box.

Three common causes of wrongly sized icons:

1. Another icon set used instead of UU icon → wrong stroke ratio. Fix: look up the exact name in `uu-icon-index.json`.
2. The SVG still has `width="18" height="18"` → the browser renders 18 even though the CSS box is 24. Fix: drop those two
   attributes, keep the `viewBox`.
3. The `viewBox` is cropped to the glyph (some "optimize" tools do this) → the glyph swells to fill the box. Fix: keep
   `viewBox="0 0 18 18"` with margins.

## Public scope

Decided by the DS owner on 2026-09-24: the set is **UU icon**; public places (repo, Storybook
deploy, released packages) contain **only** `public: true` icons. The full set lives only
in the skill. On 2026-11-09 the public set was reduced to icons components use internally
(chevron, xmark, check, circle-*, magnifier, calendar-days, clock, dots, arrow-*, sort-vertical,
sidebar-left, triangle-warning) and `texture` as the placeholder icon. The Storybook icon lookup page was removed. Don't copy `assets/icons/` into the repo or publish it anywhere as a free-to-use
icon set. Glyph origin is recorded in the repo's `src/icons/NOTICE.md`.

On 2026-11-12 the two concerns were separated: the package still ships only the 22 icons above; UU DS demos and website may use extra
illustration icons through a separate DNA set, not bundled in the package. Total public (package + illustration set) stays within 100.
