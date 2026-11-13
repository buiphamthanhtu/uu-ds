# Product DNA

UU DS is the skeleton: components, structure, interaction, accessibility. **DNA** is a product's flesh: color, corner radius, shadow, background, margins, layout rhythm.

| Mode | When | Result |
|---|---|---|
| **With DNA** | A DNA file is found | UI follows UU DS and carries the product's own character |
| **Basic** | No DNA file | UI follows UU DS, with the Default brand and system defaults |

## Finding the file

In order:

1. The path the user gives.
2. `DNA.md` at the project root.
3. `docs/DNA.md`.

Not found → ask once per session, before the first screen: is there a DNA or sample screens? Sample screens are something to anchor the style on: a Figma link or the product's code / prototype (real measurements), a website, screenshots.

- The user gives sample screens: extract them into `DNA.md` per *Extracting DNA*, apply it, then build per *Build from sample screens*.
- The user says there are none, or you run unattended and can't ask: build Basic and mention it in one line at handoff.

Don't invent a character of your own.

## Priority

**UU DS locked parts → DNA → UU DS defaults.** DNA only replaces defaults, never locked parts. When they clash, keep the locked part and tell the user.

| Locked, DNA cannot change | DNA may change |
|---|---|
| Component list, names, props, structure | The 22 brand tokens |
| State layer | `radius-sm` · `radius-base` · `radius-lg` · `radius-xl` |
| Control heights, density | `rounded-2xl` · `rounded-3xl` · `rounded-4xl` (buttons, chips) |
| Radio, Switch, dots, `BottomBar` shell (`rounded-circle`) | `elevation-low` · `elevation-medium` · `elevation-high` · `elevation-none` (control shadow, none by default) |
| Status tokens, `object-primary`, gray scale | `font-family-display` · `font-family-body` (family only) |
| Text-style font size, line-height, font-weight | `border-outer-width` · `border-outer` (outer border of controls and cards, none by default) |
| Button order in `ButtonGroup` | `--dna-*` variables for background and layout |
| Icon boxes 24 / 16 / 18, the on = `fill` rule | Icon set (the package only ships component icons; the product registers its own set, spec 4.3) |
| | Image style, illustration, tone of voice |
| Token roles: `interactive` for clickable things, `accent` for emphasis | Margins, spacing between blocks, content width |
| Contrast per spec 2.3 | |

## Applying on the web

Change values in one theme block, placed on `<html>`. No component line changes.

```css
[data-theme="product-name"] {
  /* 22 brand tokens */
  --background-interactive: var(--color-…);

  /* Shape */
  --radius-lg: 0.5rem;
  --rounded-4xl: var(--radius-sm); /* buttons and chips */
  --elevation-medium: 0 12px 32px rgba(0, 0, 0, 0.08);

  /* Type and controls */
  --font-family-body: "Inter", system-ui, sans-serif;  /* the app loads the font */
  --border-outer-width: 2px;                               /* outer border of controls + cards, default 0 */
  --elevation-none: 2px 2px 0 2px var(--object-primary);   /* hard control shadow; spread = border width, otherwise the border hides it.
                                                             Only for components whose outer border is drawn as a shadow. Self-built layout blocks with a real CSS border use spread 0. */

  /* Background and layout */
  --dna-page-background: linear-gradient(180deg, var(--background-muted), var(--background-surface));
  --dna-page-margin: var(--gap-8);
  --dna-section-gap: var(--gap-12);
}
```

**Multiple color modes** (spec 4.3): the shared part is declared once; each mode only re-declares the brand tokens.

```css
[data-theme^="product-name-"] {          /* shared: font, outer border, radius, --dna-* */
  --font-family-body: "Inter", system-ui, sans-serif;
  --border-outer-width: 2px;
}
[data-theme="product-name-green"] { --background-interactive: var(--color-…); --object-on-interactive: var(--color-…); }
[data-theme="product-name-red"]   { --background-interactive: var(--color-…); --object-on-interactive: var(--color-…); }
```

```tsx
// React Native: keep the shared part, only swap colors per mode
const dna = useMemo(() => ({ ...shared, colors: modes[mode] }), [mode]);
<UuProvider dna={dna}>…</UuProvider>
```

Screen layout reads `--dna-*` with a fallback. That way the same code runs in both modes:

```css
.page {
  background: var(--dna-page-background, var(--background-muted));
  padding-inline: var(--dna-page-margin, var(--gap-4));
}
```

- **Off-scale values** may only be declared in this theme block. Components and screens still read `var(--token)`, never loose numbers.
- **`--dna-*` is only for screen layout**, never inside components. Off-scale identity markers (tilted cards,
  tape, the shadow of a self-built card…) are also declared as `--dna-*` in the theme block and read by the layout, e.g.
  `--dna-card-tilt: -1deg`. Never type the value straight into the layout.
- **Sub-regions:** changing color only needs `data-theme` on the container. Changing radius also needs `data-density` on the same container, because `--field-radius` is computed where `data-density` is declared.
- **React Native:** `<UuProvider dna={{ colors, radius, elevation, fontFamily, borderOuter }} icons={…}>`; the control shadow is `elevation.none`.
- **Flutter:** colors via `UuTheme.copyWith(colors: …)`; font, outer border (`borderOuterWidth` · `borderOuter`), control shadow (`elevationNone`), icon set via `uuThemeData(...)`. Radius, elevation and `--dna-*` have no override path yet, so tell the user instead of editing widgets.

## Turning on the outer border in Figma

Components in Figma are **not pre-bound** to the outer border: the Effects panel stays clean and designers see no odd layers. The file only has the variables
`border-outer` (collection `color`), `border-outer-width` (collection `effect`) and the effect style `elevation-none`.
A product whose DNA has an outer border (e.g. ink border + hard shadow) turns it on in one of two ways.

### By hand

1. Open the **Local variables** panel and set `border-outer-width` to the width you need (e.g. 2). For another color, point
   `border-outer` at a different color variable.
2. Open the effect style `elevation-none` (right panel, **Effect styles**) and make it a hard shadow: X 2, Y 2, Blur 0,
   **Spread = border width**, color as the border.
3. For **each component set** that needs the border (list in spec 4.3: buttons, chips, checkbox, radio, switch, input frames, OTP cells,
   and the cards `CardSheet` · `CardDialog` · `KPICard`), select all variants in the set:
   - Inputs: select the inner `Field` layer, not the whole component. OTP: select the child cells `.base/input-*`.
   - Press **+** under **Effect**, choose **Drop shadow**: X 0, Y 0, Blur 0. Click the Spread field → **Apply variable** →
     `border-outer-width`. Click the color → **Libraries/Variables** tab → `border-outer`.
   - Controls (not cards): also add the `elevation-none` style under Effect and drag it **below** the border shadow.
   - Turn on **Clip content** on the frame that got the shadow. Figma only draws the spread when the frame clips content.
   - **Ghost** buttons have no fill, so Figma draws no shadow: on those variants use a **Stroke** instead of the border shadow,
     Position **Outside**, width bound to `border-outer-width`, color bound to `border-outer`.
4. Turn off the inner border in the resting state (variables can't do this): unselected `Chip`, unchecked `Checkbox`, unselected `Radio`,
   off `Switch`, `Outline` button, input frames, OTP cells. Keep the border for focus, Error, selected, Disabled.
5. Any parent frame with Clip content sitting flush against a control (e.g. the `Row` layer of `SearchInput`) must be turned off, or the border gets cut.

### With AI

Paste this to an AI with Figma MCP (plus the Figma file link):

> Turn on the UU DS outer border for this file: {width}px border in {color token}, hard shadow offset {x},{y}. Follow the section
> "Turning on the outer border in Figma" in the UU DS skill's `product-dna.md`.

The AI follows these steps (one page per call, screenshot-checking each set):

1. Set `border-outer-width` (collection `effect`) and, if needed, change `border-outer` (collection `color`, every mode).
   Make the effect style `elevation-none` a hard shadow with `spread` = border width.
2. For each variant of the component sets listed in spec 4.3 (the `Field` layer for inputs, the child cells for OTP): add a
   `DROP_SHADOW` with offset 0, blur 0, `showShadowBehindNode: false`, `spread` bound to `border-outer-width`, `color` bound to
   `border-outer` (`figma.variables.setBoundVariableForEffect`). Controls get the `elevation-none` shadow **before** the border
   shadow in the `effects` array (so it sits below). Turn on `clipsContent`.
3. Variants with no visible fill and no stroke (Ghost buttons at rest): replace the border shadow with an `OUTSIDE` stroke,
   `strokeWeight` bound to `border-outer-width`, color bound to `border-outer`.
4. Turn off the inner border at rest as in step 4 above. Turn off `clipsContent` on parent frames flush against controls.
5. Screenshot each set to check: border on all four sides, not clipped, state borders (focus, Error) still visible.
6. To remove: delete the shadows and strokes bound to `border-outer*`, set `border-outer-width` back to 0, `elevation-none` back to a transparent shadow.

## Three file tiers in Figma

UU DS is where the framework lives, Snowflake is where freedom lives. A product uses three files:

| File | Holds | Inherits |
|---|---|---|
| **UU DS** (root file) | Tokens, foundation components. The product's DNA is **a mode of the product** in the variable collections (`color`, `effect`…), next to `Default` | — |
| **`[Snowflake] <Product name>`** | The product's own components: cards, sections, advanced blocks, identity blocks (summary cards, tape cards…) | UU DS components + tokens |
| **UI file** | The product's screens | UU DS + Snowflake |

- **DNA goes into the product's mode in UU DS**: colors (section 2 of `DNA.md`) in the `color` collection; radius, shadow, outer border,
  font in whichever collection holds that variable. Don't create a separate collection, don't type values onto layers. The UI file picks the product's
  mode on the screen frame. Values that aren't variables (effect styles, text styles) can't follow modes: tell the user.
- **The `UU` mode is only an example.** A product may reuse it: rename it to the product name and replace the values, instead of
  adding a new mode. Each product still needs its own mode.
- **Mode name = theme name in code.** The `cam-nang-no` mode in Figma maps to the `[data-theme="cam-nang-no"]` block in code
  (web), with the same values from `DNA.md`. Code doesn't read Figma: `DNA.md` is the bridge; change a value and you change both the mode and
  `DNA.md`. The package's `uu` theme stays as an example; products don't use it.
- **Repeated blocks of the sample screens** (section 8 of `DNA.md`) are components in Snowflake, built from UU DS instances and tokens.
  A block not yet in Snowflake that appears on two screens: propose adding it to Snowflake; don't copy frames between screens.
- **Never edit UU DS components** to get the product's character. If something must differ, make a new component in Snowflake.
- Before building: ask for the UU DS file link (does it already have the product's mode?), the Snowflake file and the UI file. The UI file must enable both
  libraries. No mode or no Snowflake yet → tell the user; don't create them in the root file yourself.
- Code follows the same three tiers: the `uu-ds` package · the product's own components (reading tokens, like Snowflake) · screens.

## Extracting DNA from a product

When the user asks you to create a DNA from Figma, a website or screenshots:

1. Take 2–3 different screens. One screen isn't enough to know what is a pattern. States of the same screen (empty, filled,
   error) count as **one** screen.
   Measurement sources, best first: the Figma file (read via Figma MCP, taking numbers and bound variables) or the product's code / prototype
   (read the CSS) → website → screenshots. Record the source of every value.
   Mark `(estimated)` when a value is measured from a screenshot or website, or when there is only one screen. Numbers read from Figma don't need it.
   Keep the markers in English (`(estimated)`, `(1 screen)`) so readers in any language understand them.
   Older files with `(đoán)`, `(1 màn)` mean the same.
2. Copy `dna-template.md` to `DNA.md`. Save it at the project root; if the user only works in Figma and has no project, ask where to save it, default to the working folder, and report the path.
3. Measure what repeats: background colors, gradients, shadows, borders, radius, side margins, spacing between blocks.
4. Only record values that appear at least twice. A value that appears once is an exception, not DNA.
5. Snap to the UU DS scale when within 2px, e.g. 15px becomes `radius-lg`.
6. Record the source. Screenshots only allow estimates, so add `(estimated)`.
7. Find 2–3 identity markers. This is what makes the product different; don't skip it.
8. Record the **screen patterns** (section 8 of the template): how screens are built. Unlike step 4, a pattern seen on only one screen is still recorded, tagged
   `(1 screen)`; the "at least twice" rule only applies to measurements (sections 2–7). Without this section, new screens get the right colors and
   radius but a layout completely unlike the sample screens.

Only extract from products the user owns or is allowed to use. To learn another product's style, take the layout rhythm, not the logo or identity.

## Build from sample screens

When the user already has sample screens (usually screens in a Figma file) and asks for a new one, the new screen must look like the same
product. Applies everywhere you build: Figma, a design canvas, code. An example `DNA.md` with a full Screen patterns section: Cẩm Nang Nô
(`examples/dna-cam-nang-no/DNA.md` in the UU DS repo).

1. **Read before building.** Open `DNA.md` and the 2–3 sample screens closest to the one you need (same kind: list, form, detail…).
   No `DNA.md` yet → extract one first per *Extracting DNA*.
2. **Take the frame from the sample screens.** A new screen of the same kind keeps the header, margins, spacing rhythm, card or list style, and primary button
   position of the sample (section 8 of `DNA.md`). Only change what differs in content. Frame source order: the product's sample screens →
   `recipes.md` → self-built.
3. **Build with UU DS, never by hand.**
   - **Layout blocks of the sample screens** (summary cards, hero blocks… frames / divs bound to tokens, not components) may be copied.
     Only stop and ask when you need an **interactive control** UU DS doesn't have; never draw a look-alike control.
   - **Figma:** follow *Three file tiers in Figma*. The fastest and closest way is to duplicate a sample screen of the same kind and
     replace the content. Use instances from UU DS and the product's Snowflake; blocks already in Snowflake come in as
     instances, not copied frames. Colors, radius and spacing bind to variables, never typed onto layers. Don't detach
     instances. Instances placed in a screen frame get `FILL` width.
   - **Design canvas, HTML:** load `tokens.css`, declare the DNA in a `[data-theme="<name>"]` block. Only buttons, fields, checkbox,
     radio, toggle and segmented have ready-made classes; the rest (`ListItem`, `Badge`, `NavigationBar`…) is built per the structure and
     measurements in the component's file (spec §6.x) with tokens, and marked as self-built at handoff. If the canvas runs React, use the `uu-ds`
     package components instead of building by hand.
   - **Code:** with the `uu-ds` package installed, use its components (`ListItem`, `ListGroup`…), don't rewrite them in
     HTML + tokens. Then run `npx uu-ds-check src` (web) until critical = 0. Without the package the checker can't run:
     install it (`npm i "github:buiphamthanhtu/uu-ds#web"`) or say at handoff that it wasn't checked.
4. **Compare before handing off.** Screenshot the new screen and put it next to a sample screen of the same kind. List the differences in order: layout, text hierarchy,
   spacing, color and shadow, detail. Fix, then compare again. Intentional differences (the new screen needs to differ) get a reason at handoff.
5. **A sample screen that breaks a locked part** (e.g. hover changing the background, hardcoded hex, text weight unlike the text style): keep UU DS's
   locked part, don't copy it to the new screen. At handoff, list every place where the new screen differs from the sample because of that, with two options for
   the user: accept the difference, or propose that UU DS open an extra DNA override path (don't open it yourself).

## Check before handing off

- Re-measure contrast for every changed pair: text 4.5 and up, interactive borders 3 and up.
- `object-secondary` must reach 4.5 on both `background-surface` and `background-muted`.
- Text on `background-interactive` is always `object-on-interactive`. If the button fill is light, this token must be dark.
- Switch back to Basic by removing `data-theme`. The screen must still work.
- Cover the logo with your hand: is the product still recognizable? If not, the DNA isn't fully applied.
- List the places where locked parts blocked the DNA.
