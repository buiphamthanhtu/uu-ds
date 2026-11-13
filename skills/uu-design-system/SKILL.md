---
name: uu-design-system
description: Build UI with UU Design system (UU DS). Use when the user asks to build, prototype, mock up, or code a screen, page, component, or flow with UU DS, or mentions "UU DS", "ÚÙ Design system", "UU Design system", "UU Design System", "UU icon", or asks whether something matches UU DS. Supplies the exact tokens, state-layer interaction model, and component specs, and prevents inventing components that do not exist. Only for products built on UU DS; projects with their own design system should use that system instead.
---

# UU DS — build UI to spec

**UU Design system** (UU DS). This skill holds the full spec and ready-to-use tokens.

## Start here

1. Read `references/design-system.md` — the **core** spec (tokens, scales, density, DNA, component inventory, state layer). Read sections 0–6.0 in full before writing the first line of code.
2. For **each component you use**, read its file in `references/components/` (table in core §6, e.g. `components/switch.md`). The core does not contain per-component sizes, variants or states. Don't read files for components you don't use.
3. Import `references/tokens.css` into the project. Every value comes from there.
4. If the project uses Tailwind, merge `references/tailwind.js`. Otherwise skip it.
5. `references/tokens.json` is only needed to generate tokens for another platform (iOS, Android, Style Dictionary).
6. Need icons → read `references/icons.md`: the **UU icon** set; look up names in `references/uu-icon-index.json`; get SVGs with `python3 scripts/icon.py <name> [fill]` (bundles `assets/icons/<category>.json`). The 22 public icons (`public: true`: icons components use internally + `texture`) only make components work and fill examples; they are not a product icon set. A product that needs icons attaches **one set** via DNA (spec 4.3): free like Lucide, or a Nucleo license. Never draw icons, never pick single icons from another set. Illustration icons in examples use `texture`.
7. Need to know what a component **connects to** — which tokens, which components it is built from, what it is confused with, when to choose it — read the system map (ontology): `references/ontology.md` (summary) or query `references/ontology.json` (`nodes` + `edges`). Not in the ontology = not decided → ask.
8. Building a whole screen or flow, take the frame in this order: the product's sample screens (section 8 of `DNA.md`, see *Build from sample screens*) → the closest frame in `references/recipes.md` → pick components yourself via the ontology and say the frame is self-built. Copy the frame first, then replace the content.

UI copy (labels, messages) is Vietnamese: products on UU DS are Vietnamese.

## UU DS and the product's DNA

UU DS is the skeleton. Each product's own style lives in a **DNA** file, not in components.

Find `DNA.md` before building: the path the user gives, then the project root, then `docs/DNA.md`. Not found → ask once before the first screen: is there a DNA or sample screens (Figma link, code / prototype, screenshots or a website)?

- **DNA exists:** read `references/product-dna.md` and apply the file. DNA replaces defaults, never the locked parts.
- **Sample screens exist:** extract them into `DNA.md` per *Extracting DNA*, then apply. New screens follow *Build from sample screens* (Figma, canvas or code alike).
- **Neither, or you can't ask:** build Basic with the Default brand; don't invent style. Mention it in one line at handoff.
- **The user asks you to extract a DNA:** follow *Extracting DNA* in `references/product-dna.md`, using the `assets/dna-template.md` template.

## Six constraints you must not break

**1. Never hardcode colors.** Always semantic tokens: `var(--background-interactive)`, `var(--object-primary)`. No hex, no `#4F46E5`. Semantic tokens point to primitives; only primitives are hex. Hardcoding = off spec.

No primitive carries alpha. Need a translucent color → compose from a solid primitive — `color-mix(in srgb, var(--color-black) 10%, transparent)` — exactly as `overlay` and `background-transparent` do. Don't add primitives like `black-10`.

**Use the right TIER, not just the right color.** `var(--color-red-400)` and
`var(--background-accent-emphasized)` both give `#F87171`, so they look identical
and every "no hex" check passes. But a primitive is a **step on a color scale**,
a semantic token is a **role**. Writing a primitive into a component cuts the link between the two
tiers: brand modes stop following, and a dev spec that emits `--color-red-400`
leaves the builder looking up a role the design system doesn't have.

Rule: `--color-*` may only appear in **semantic token definitions**, never in
components. Where a color is needed and no semantic token has the right role,
**add the token to UU DS first** — don't reach down to the primitive tier for speed.

**2. Brand mode.** UU DS has **two** brand modes: **Default** (`:root` — interactive indigo, accent blue, slate neutrals) and **UU** (`data-theme="uu"` — button fill orange-500 with **black** text, text/links orange-700, amber accent, neutral grays; the Ú Ù identity). Brand colors live in 22 tokens (spec 2.5); text on buttons is always `object-on-interactive`, never a literal white. Adding a brand = one `[data-theme="<name>"]` block overriding exactly that group. A component **must not** know its brand — if you are writing `if (brand === …)` you are doing it wrong.

Careful: `accent` (Default: blue · UU: amber) and `interactive` (Default: indigo · UU: orange) are **two different roles** — `interactive` for clickable things (buttons, links, focused fields, tabs, selected items), `accent` for content emphasis (text caret). Don't use an `accent` token on something clickable because the color looks right, or vice versa. Status families: `positive` · `negative` · `warning` · `attention` (don't change with brand); Figma variant names stay `Success`/`Error` and code props follow the variants. `object-warning` is `yellow-500` (1.92 on white) — only for dots/icons next to text.

**3. Hover and Pressed go through the state layer, never a color change.** This is the central mechanism. A full-bleed `::after` painted with **the variant's object color** (`background: currentColor`), `border-radius: inherit`, changing `opacity`:

- Strength follows the **background type**, not the text color: solid colored background (`Solid` Accent / Neutral) → hover `--opacity-20`, pressed `--opacity-40`
- Light / transparent background (`Outline`, `Ghost`, `Solid` `Inverted`) → hover `--opacity-5`, pressed `--opacity-10`
- `Outline` / `Ghost` `Inverted` on dark backgrounds → 20/40
- `Radio` exception (§6.0, §6.3d): selected 20/40 although the ring background is light; unselected hover `object-secondary` 5%, pressed `object-primary` 10%
- `Disabled` and `Loading` have no state layer
- The state layer is the **entire** effect. No background, text color or font-weight change

The fill is **the variant's object color** (the `object-*` token of its text / icon) — in CSS `currentColor`, the standard keyword for the element's `color`; exact because the state layer fill always equals the object color. One rule covers all 144 variants — audited. Classes `.uu-interactive`, `.uu-on-dark`, `.uu-on-light` are in `tokens.css`.

Don't confuse it with the `Active` typography mode: that mode makes text one step bolder and is **only** for the selected state of two components — Toggle button `Active=True` and Segment item `Active=True` — unrelated to button hover or pressed.

The body font is the system font, so text width differs between iOS and Android font sets. Never hardcode widths of hug-width components. Line-height is absolute, not a multiplier: apps use logical px, the web uses **rem** like every size token (spec §4 *Units per platform*). Web: never write loose px or rem in a component — always `var(--token)`.

Borders have **two scales**: the gray scale (`border-muted` / `border` / `border-emphasized`) doesn't change with brand and is for controls; the brand scale (Default `border-subtle` = blue-200, `border-medium` = blue-300; UU = amber-200 / 300) changes with brand and is for tinted blocks. Never border an input with the brand scale.

**4. Only existing scales.** Spacing from `gap-*` (4px steps). Radius from `radius-*`. Font sizes from the 11 defined steps. No new values, no odd numbers. **Density** (spec §4.1): `Touch` default (apps) · `Compact` desktop — web `data-density="compact"`, Flutter `uuThemeData(density: UuDensity.compact)`, React Native `<UuProvider density="compact">`. Components read density variables (`--control-height-*`, `--field-height`, `--selection-size`, `--text-<style>-font-size`…), never hardcode 24/32/40/48/56px, never read `--font-size-*` directly. Don't use Compact on touch screens. The only exception to the scales: values declared in a DNA theme block; components and screens still read them through `var(--token)`.

**5. Only build components listed in spec section 5.** CamelCase names: `TextButtonAccent` / `TextButtonNeutral` / `TextButtonDanger` (destructive), `IconButtonAccent` / `IconButtonNeutral`, `ToggleButton`, `SegmentedControl`, `TextInput`, `TextArea`, `SearchInput`, `OTPInput` (with `Masked`), `DateInput`, `Dropdown`, `Checkbox` + `CheckboxInput`, `Radio` + `RadioInput`, `Switch`, `Chip`, `NavigationBar`, `BottomBar`, `Pagination`, `Tab` + `TabBar`, `Menu`, `Toast`, `Badge`, `StatusIndicator`, `NotificationBadge`, `CardPushNotification`, `ListItem` + `ListGroup`, `ButtonGroup`, Bottom sheet (`CardSheet` + template `Sheet`), Dialog (`CardDialog` + template `Dialog`), screen templates `ResultScreen` · `ErrorScreen` · `EmptyScreen` and blocks `EmptySection` · `ErrorSection`; desktop/dashboard: `TableHeaderCell` · `TableCell`, `TablePagination`, `KPICard`, `Breadcrumb`, `SideNav`, `SideSheet`, `Popover`, `Tooltip`. Anything else is not decided.

**6. Icons through one component, from one set** (`references/icons.md`): `Icon(name, variant, size)`, SVG `currentColor`, color from the container's `object-*` token. The 22 public UU icons only make components work and fill examples. A product that needs icons attaches one set via DNA (free like Lucide, or a Nucleo license), registered with `IconProvider` / `UuProvider icons` (spec 4.3), the whole set, never mixing single icons of two sets on one screen. The DNA declares no set and you need icons beyond the 22 → ask the user which set; meanwhile use `texture`. Icon names carry no color or state (`-white`, `-active` are wrong); the on state uses the `fill` variant (a set without fill reuses the outline).

## Before handing off

Look at the result like the pickiest designer: the one who screenshots exactly one wrong spot and sends it back asking "what is this?". If you can picture that screenshot, that is the next fix. Fix the biggest thing first: layout, then hierarchy, then interaction, then detail.

Recurring mistakes, check each line:

- **Props or variants that don't exist.** `ButtonGroup` only has `Tone=Default` · `Danger`, no `Accent`. Figma ignores wrong values silently, and drops the other props in the same call. Look up exact names in the component's file.
- **Default text left over.** "Action", "Content", "Header", "Data" on screen means not done.
- **Empty slots.** `CardDialog` and `CardSheet` without content are not done.
- **Two `Solid` buttons on one screen.** One primary, the rest lighter (§6.1).
- **Two buttons arranged by hand.** Button pairs use `ButtonGroup` (§6.9).
- **Long labels cut off in a horizontal `ButtonGroup`.** Switch to `Layout=Vertical`.
- **`Danger` for something undoable.** Sign out is `Neutral` (§6.1).
- **Input errors in a `Toast`.** The error sits under the field that caused it, because Toasts dismiss themselves while the error remains (§6.3f).
- **A button saying "OK", an error saying "Không hợp lệ".** Buttons say what will happen. Errors say how to fix it.
- **Back and Close both on a sheet.** They are mutually exclusive (§6.8).
- **`accent` on something clickable.** Clickable things use `interactive` (constraint 2).
- **Hover changing the background.** Effects only go through the state layer (constraint 3).
- **`--color-*` in a component.** Right color, wrong tier (constraint 1).
- **Hardcoded 32, 48, 56.** Components read density variables (constraint 4, §4.1).
- **DNA inside a component.** Product style goes in the theme block; no `if (brand)`, no editing component CSS.
- **Icons scaled to fill the box.** The real glyph is only about 60–65% of the box (§6.11).

Web code, project with the `uu-ds` package installed: run `npx uu-ds-check src` and fix until critical = 0. The checker catches what a machine can (hex, `--color-*`, invented tokens, hover color changes, off-scale px, invented components/icons); the other lines you still check by eye.

If you can't verify a line yourself, say so at handoff.

## Quick reference

| Thing | Value |
|---|---|
| Button height | Large 56 · Base 48 · Small 32 — radius `rounded-4xl`, fully round at every size by default; a DNA may change this token |
| Toggle button | same sizes as button; `Active=True` swaps the icon to `fill` and text to bold 700; no border, no shadow |
| Icon button | 56/48/32 square; icon 24 (L, Base) and 16 (Small); outline stroke 2px |
| Field (input, dropdown, date) | height 48 · radius 16 · border 1px · horizontal padding 12 · gap 8 |
| Picker fields (Dropdown, DateInput) | empty hint `body` 400 `object-secondary` · selected value: Dropdown **`label` 600**, DateInput **`body` 400** · right icon `object-secondary` · full Hover/Error/Disabled |
| DateInput · Dropdown | `Value` Empty/Filled × `State` Default/Hover × Error × Disabled (8 variants each) · placeholder `Bấm để chọn` · DateInput shows `DD/MM/YYYY` · icon `calendar-days` 24 / `chevron-down` 16 |
| SearchInput | Text input frame (48 · radius 16 · 1px border) · fixed `magnifier` 24 `object-secondary` on the left · `circle-xmark` 16 clear button on the right when filled · **no Error** · 8 variants |
| TextArea | VERTICAL Field height 112 · padding 12 · counter `(n/100)` style `caption` bottom-right · states as Text input |
| OTPInput | 6 cells of 48 · gap 8 · empty cell `-` · caret 2×24 `object-accent` · `Masked=True` turns digits into 8 dots · error reddens all 6 cells + centered error line · Disabled background `background-disabled` (14 variants) |
| Radio | 32 circle · **2px** border · selected: white background, `border-interactive` border, 20 dot `object-interactive` · state layer 5/10 unselected, **20/40** selected (exception §6.0) · **Error**: `border-negative` border, `object-negative` dot · 10 variants |
| Checkbox | 32 square radius 12 · Default 2px `border-muted` · Checked `background-interactive` + `check` fill 20 · **Indeterminate** = 16×2 round bar `object-on-interactive` · **Error** = `border-negative` border / `background-negative` fill · **15 variants**: empty box Hover border `border-emphasized` + 5% layer / Pressed 10%; checked box layer `object-on-interactive` **20 / 40**; Disabled `background-disabled` |
| Chip | height 32 · padding 4/12 · gap 8 · radius `rounded-4xl` · 2px border · text `label` 16/24 (same as TextButton Small) · unselected: `border` border, `object-primary` text · selected: `background-interactive-muted`, `border-interactive`, text + icon **`object-interactive`**, `Type=Select` adds a 16 fill `check` before the text · `Type=Dropdown` adds a 16 chevron · `Type=Input` removable · 20 variants |
| Switch | track 56×32 radius 16 border 2px · off thumb **16** circle 8 from the left `object-secondary` · on thumb **28** white circle + `check` 16 `object-interactive`, 2 from the right · on track `background-interactive` · state layer 5/10 off, 20/40 on · 10 variants (with `Focus`) |
| SegmentedControl | shell `background-emphasized` radius 16 padding 4 gap 2 · item (`Active` × `State`, 8 variants): selected = white background radius 12 `elevation-low` text 700 (`Active` mode), normal = `object-secondary` 600; hover/pressed layer `object-primary` 5/10; disabled `object-disabled`, selected item `background-disabled` |
| Tab | hug × **48** · padding 12 on all sides · text `title-base` 600 · Default `object-secondary`, Active `object-interactive` + a **32 × 4** `border-interactive` bar (same `interactive` family, both change with brand) centered on the bottom edge (FIXED width, doesn't grow with the label) · 5 variants · `TabBar` Fixed / Scrollable |
| BottomBar | pill shell `background-surface` padding 4 gap 4 · item min 64×40 padding 6/12 gap 4 · `Compact=False` shell FILL, items FILL, label `title-xs` 11/16 600, height 64 · `Compact=True` hug, no labels, height 48 · selected: `background-interactive-muted`, `fill` icon + `object-interactive` text; normal: `outline` icon + `object-secondary` text · 2–5 items · `NotificationBadge` anchored to the icon corner, unselected items only · 10 variants |
| Table | `TableHeaderCell` height `table/header-height` 48 · `title-sm`, bottom border `border-muted` · `TableCell` height `table/row-height` 56 · horizontal padding `table/cell-padding-x` 16 · Selected `background-interactive-muted` · per-row actions `Ghost` Small, never `Solid` |
| SideNav | width `sidenav/width` 288 · items height `control/height-base`, radius 8, Active `background-interactive-muted` · `layout` collection Expanded/Collapsed (73, labels hidden) |
| Tooltip · Popover · SideSheet | Tooltip `background-inverted`, caption `object-primary-inverted`, max 240 · Popover 320, `card/padding`, `elevation-medium` · SideSheet 384, Standard (left border) / Modal (`elevation-high`) |
| Menu | Panel: V gap 4 · padding 12 · radius 24 · `elevation-low` · `background-surface`. Sheet: reuses `Sheet`. Option row height **40** · padding 8 · gap 12 · radius 12 · `body` text; selected = `background-accent-subtle` + `object-interactive` text + 16 check |
| Toast | height 64 · radius 12 · `elevation-medium` |
| Badge | pill height 24 · padding 4 left / 8 right · 16 `fill` icon always before the text (Neutral `circle-info`, Success `circle-check`, Warning `circle-warning`, Error `triangle-warning`), gap 4 · text `title-sm` 600 · 4 tones: Neutral `background-inverted`, Success/Warning/Error `background-{status}` + `object-on-{status}` · no states |
| StatusIndicator | pulsing 8 dot (opacity 1 → 0.3, 1.6s, still under reduced motion) + `title-sm` text, gap 6 · `Container=None` (height 20, dot `object-{tone}`, text `object-primary`) or `Filled` (height 24, padding 2/8, pill `background-{tone}`, dot and text `object-on-{tone}`) · Neutral uses `object-secondary` / `background-inverted` + `object-on-dark` |
| NotificationBadge | `Count`: height 16, min-width 16, horizontal padding 4, text 11/16 600 `object-on-attention` on `background-attention` · `Dot`: 8×8 · status family `attention` = "new, not seen yet" (not `negative`/`warning`), no 99+ threshold yet |
| Bottom sheet | at the bottom · has a title · radius 24 on all 4 corners, inset 12px each side · scrim `overlay` + blur 16 · a **child** sheet turns on `Back`: back button on the left **replaces** close, never both |
| Dialog | vertically centered · **no title**, content goes in the Slot · same radius and scrim as Bottom sheet |
| ButtonGroup | horizontal: secondary left, primary right · vertical: primary top, secondary bottom · both `flex: 1` split evenly |
| Icon | **box** 24 (Icon button L/Base, suffix, DateInput) or 16 (Small, Dropdown chevron); 18 only for `.loading`. UU icons are drawn on an 18 grid with margins, so **the glyph ≈ 60–65% of the box** (`xmark` 15px in a 24 box) — by design; don't scale to "fit the box", don't swap in Lucide/FA. See `references/icons.md` |
| Body font | **the device's system font** — the design says `SF Pro` only to render; never embed it. A product DNA may change the family (`font-family-body`, spec 4.3); sizes and weights stay on the scale |
| Display font | Bungee (Regular only, `font-synthesis: none`), **only** for the 4 `display-*` styles |
| Frame width | 390 · 402 · 412 · 430 (mobile) · 1440 (desktop) |

## When something isn't in the spec

The spec only contains what is **decided**. If you need a component, state or token that isn't there — **stop and ask**; don't guess and keep building. Frequently asked and not available yet: account area at the bottom of `SideNav` · `BottomBar`: item Hover/Pressed, bar position, shell on white backgrounds, long labels · Table: empty / loading rows; sticky columns, expandable rows, inline editing (deferred) · pagination without a known total · sparkline in `KPICard`.

Already available, don't ask again: Text input `Error`, `TextArea`, `Checkbox` with all 15 variants (including `Indeterminate` and `Error`), `Switch` with all 10 variants, `Menu` (the `Dropdown` option panel), `SegmentedControl` items with Hover/Pressed/Disabled, OTP `Masked` and `Disabled`, `DateInput` and `Dropdown` with Hover/Error/Disabled, DateInput showing `DD/MM/YYYY`, Toast with 4 types, `Badge` / `StatusIndicator` / `NotificationBadge`, `BottomBar` (2–5 items, with badges), **destructive button `TextButtonDanger`**, bottom sheet with a back button (`CardSheet` `Navigation=Back`), **tables** (`TableHeaderCell` sorting + Hover/Pressed, `TableCell` row selection and per-row actions), `TablePagination` with "…" truncation, `KPICard`, `Breadcrumb`, `SideNav` (2 levels, collapsible), `SideSheet`, `Popover`, `Tooltip`, density `Compact` for desktop, **multi-select Menu** (`.MenuItem` `Type=Multiple` + Apply footer), quick search, group titles and dividers in `Menu`, `SearchInput` suggestion / history panel + loading state + Cancel button, the panel opened by `Chip` `Type=Dropdown`, `Tab` with Hover/Pressed/Disabled and the **`TabBar`** row (Fixed / Scrollable), **`CardDialog`** (with a 16:9 banner image), `EmptyScreen` / `EmptySection` / `ErrorSection`, **`CardPushNotification`**, `StatusIndicator` `Highlight`, the `BottomBar` standalone action button (`FooterItemSpecial`), brand mode **UU**, the `layout` axis Expanded/Collapsed, `Menu` options with a two-line description + "Chọn tất cả" row + anchoring / flipping / max height 320, tabs with icon / badge, `Chip` prefix icon + `Type=Input` (removable), `ButtonGroup` `Tone=Danger`, removing single `SearchInput` history items, `TableHeaderCell` `Type=Checkbox`, `TableCell` `Type=Status`, `Breadcrumb` "…" truncation, `KPICard` `Polarity` + clickable card, `SideNav` rotating chevron / badge / collapse button, `SideSheet` `Width=Wide` 480, self-flipping `Popover`, `Tooltip` 500 ms delay, desktop `CardPushNotification`, draggable `CardSheet` (`Handle`, `Height=Fit/Full`), `ResultScreen` / `ErrorScreen` code components, `TextButton` left icon (`Prefix`), DNA changing `font-family-body` + outer border + control shadow (`border-outer-width` · `border-outer`, `elevation-none`) + own icon set, **list rows `ListItem` + `ListGroup`** (§6.32; a switch + label row is a `ListItem` with Trailing `Switch`), Toast floating above `BottomBar` / keyboard, `Helper text` hint line (below the label, above the field) of `TextInput` / `TextArea`, centered bottom sheet in density `Compact` (max width 480) + keyboard avoidance, card outer border (`border-outer-*`), dropping the inner border at rest when the outer border is on.

Decided **not to do** — answer that it is not supported, don't ask again: `TextButtonDanger` on dark backgrounds, a Danger `IconButton`, separate small sizes of `SearchInput` / `Switch` / `Chip` (use density `Compact`), On/Off text in `Switch`, a page-number input, an icon before the first `Breadcrumb` item, level-3 `SideNav`, `TabBar` on dark backgrounds, close button / time / stacking for push, tooltips with a title (use `Popover`), a `Popover` arrow, a left / resizable `SideSheet`.

If the user says "just do something for now", do it, but state clearly which parts are invented so they know what to review.

## Not part of the design system

`Device elements` (status bar, iOS/Android keyboard, home indicator, browser chrome, Face ID/Touch ID alerts) and `.Mini App Control` are only chrome for context mockups. `.Mini App Control` is the mini-app platform's UI (e.g. Zalo). Don't tokenize them, don't treat them as product components, don't put them in the component library.
