---
product: product name
theme: product-name
updated: YYYY-MM-DD
sources:
  - screens, Figma links or screenshots measured
---

# DNA — product name

Leave values you couldn't measure empty; UU DS uses its defaults. Add `(estimated)` after uncertain values.

## 1. Personality

- Three adjectives:
- Not:
- One sentence describing how it feels to use:

## 2. Color

This table only lists the tokens to change among the 22 brand tokens (spec 2.5).
A product with **several color modes** (spec 4.3): add one value column per mode (`Value · <mode 1>`,
`Value · <mode 2>`…) and name the default mode. The rest of the file is shared by every mode.

| Token | Value | Seen where |
|---|---|---|
| `background-interactive` | | |
| `object-on-interactive` | | |
| `object-interactive` | | |
| `border-interactive` | | |
| `background-accent` | | |
| `background-muted` | | |
| `background-subtle` | | `Tonal` button fill |
| `object-secondary` | | secondary text |
| `border-subtle` · `border-medium` | | borders of tinted blocks |

## 3. Corner radius

| Token | Value | Used for |
|---|---|---|
| `radius-sm` | | |
| `radius-base` | | |
| `radius-lg` | | inputs, cards |
| `rounded-2xl` | | sheet, dialog, `Menu` panel |
| `rounded-4xl` | | buttons, chips |

## 4. Shadow

| Token | Value | Used for |
|---|---|---|
| `elevation-low` | | |
| `elevation-medium` | | |
| `elevation-high` | | |

## 5. Borders

- Outer border of controls and cards (`border-outer-width` · `border-outer`, none by default):
- Control shadow (`elevation-none`, none by default; with a border, spread = border width):
- Blocks are usually separated by borders or by shadows:
- Border color of tinted blocks (`border-subtle`, `border-medium`):

## 6. Background and surfaces

| Variable | Value | Note |
|---|---|---|
| `--dna-page-background` | | page background color or gradient |
| `--dna-hero-background` | | opening block |
| `--dna-card-background` | | cards, if different from `background-surface` |
| `--dna-card-shadow` | | card shadow, `none` if cards are flat |
| `--dna-floating-shadow` | | floating parts: bottom bar, back button |
| `--dna-feature-background` | | featured block on the screen |

Need another `--dna-*` variable (card border, tilt…)? Add a row to the table in section 6 or 7: valid, as long as only the layout reads it.

## 7. Layout

| Variable | App | Desktop | Note |
|---|---|---|---|
| `--dna-page-margin` | | | side margins |
| `--dna-section-gap` | | | between large blocks |
| `--dna-card-gap` | | | between cards |
| `--dna-content-max` | | | max content width |
| `--dna-card-inset` | | | buttons or nested blocks from the card edge |
| `--dna-card-head-inset` | | | text block from the card edge, added to `--dna-card-inset` |
| `--dna-floating-inset` | | | floating parts from the bottom and sides |

## 8. Screen patterns

How screens are built. Name a sample screen for each row so the next person can open it and compare. A pattern seen on only one screen gets `(1 screen)`.

| Part | How it's done | Sample screen |
|---|---|---|
| Header | `NavigationBar` style, large title or not, buttons on the right | |
| Screen opening | hero block, summary, search field… | |
| List | cards or `ListItem` rows, with images or not, grouped by what | |
| Form | labels above fields, field groups, where the submit button is | |
| Primary button | end of content, pinned to the bottom, or in the header | |
| Empty, error states | `EmptySection` / `EmptyScreen`, with illustration or not | |
| Bottom navigation | `BottomBar` with how many items, shell style, what the selected item looks like | |
| Illustrations, stickers | where they go (header, empty states…), how images are chosen | |
| Text hierarchy | text styles for screen titles, block titles, secondary text | |

## 9. Type

- Large heading font (`font-family-display`):
- Other text font (`font-family-body`, system font by default — family only):
- How headings are used: large or medium, uppercase or sentence case:
- Tone of voice:

## 10. Images and icons

- Image style:
- Illustration style:
- Icon set (the package only ships 22 icons for components; a product that needs icons registers a whole set, e.g. free Lucide or paid Nucleo):
- Where `outline` vs `fill` icons are used:

## 11. Identity markers

Two to three details that make people recognize this product, with a specific image or screen.

-
-

## 12. Don't

-
-
