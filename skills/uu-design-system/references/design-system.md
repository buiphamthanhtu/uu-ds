# UU DS — Design System Specification (core)

> Core spec of **UU Design system** (UU DS). Every value below matches `tokens.css` / `tokens.json` in the same folder.
> Default unit: **px**. Base rem = 16px.
> This file holds the rules every screen needs (tokens, scales, component inventory, state layer).
> The spec of each component (§6.1–6.32) lives in its own file under `components/` — see the table in §6.

---

## 0. How to use this file

**If you are an AI asked to build a prototype:** read sections 1–3 in full before writing the first line of code. Mandatory rules:

1. **Never hardcode hex colors.** Always use semantic tokens (`background-interactive`, `object-primary`…). Semantic token → primitive token → hex. A hardcoded hex is a spec violation.
2. **Brand mode**: brand colors live in one token group (see 2.5). A component **must not** know which brand it is in — switching brand means switching one CSS/theme layer, never editing a component.
3. **Hover/Pressed go through the state layer** — no change of background, text color or font-weight. See 6.0 — this is the central mechanism of the system; get it wrong and every interaction is wrong.
4. **Only build what is listed in section 5.** This spec only contains what has been decided. Anything not here is not decided — ask, don't guess.
5. **Before building a component, read its file** in `components/` (table in §6). This core file does not contain per-component sizes, variants or states.

Files next to this one in `references/`:
- `components/*.md` — one file per component (§6.1–6.32)
- `tokens.css` — CSS custom properties, with the state-layer and component recipes
- `tokens.json` — every token, machine-readable (DTCG-style), for generating other platforms
- `tailwind.js` — only if the project runs Tailwind
- `icons.md` + `uu-icon-index.json` — the **UU icon** set

UI copy in examples (button labels, messages) is Vietnamese on purpose: it is the language of products built on UU DS. Keep it Vietnamese unless the product says otherwise.

---

## 1. Token architecture

The system has **2 tiers**:

```
core                    → primitive: rem, size, color ramp (79), opacity
  ├─ color (57 tokens)  → semantic, per brand mode
  ├─ typography         → font size/weight/family/line-height, 2 modes: Default | Active
  ├─ gap                → spacing
  └─ radius             → corner radius
```

Semantic naming: `{role}-{variant}`
- `background-*` → fill of frames/shapes
- `object-*` → color of content (text, icon, vector)
- `border-*` → stroke color
- Suffix `-muted` = lighter, `-emphasized` = stronger, `-inverted` = used on dark backgrounds, `-on-X` = content sitting on background X

Each token has a clear scope — background, text, border, gap, radius. Don't paint text with a background token or the other way round.

---

## 2. Color

> **Brand colors** (decided per the UU DLS Figma file): `interactive` → **indigo** ramp,
> `accent` → **blue** ramp, neutral backgrounds and borders → **slate** ramp. Brand tokens are bold
> in table 2.2 and listed in full in 2.5. To change brand colors, change only this group in
> `tokens.css` / `tokens.json` and re-measure contrast in 2.3. No component changes.

### 2.1 Primitive ramps (`core/color/*`)

Each ramp has 11 steps: `50 100 200 300 400 500 600 700 800 900 950`. Ramp and step names follow Tailwind v4 (`--color-slate-50`); hex values are Tailwind v3.4.

| Ramp | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| neutral | `#FAFAFA` | `#F5F5F5` | `#E5E5E5` | `#D4D4D4` | `#A3A3A3` | `#737373` | `#525252` | `#404040` | `#262626` | `#171717` | `#0A0A0A` |
| slate | `#F8FAFC` | `#F1F5F9` | `#E2E8F0` | `#CBD5E1` | `#94A3B8` | `#64748B` | `#475569` | `#334155` | `#1E293B` | `#0F172A` | `#020617` |
| red | `#FEF2F2` | `#FEE2E2` | `#FECACA` | `#FCA5A5` | `#F87171` | `#EF4444` | `#DC2626` | `#B91C1C` | `#991B1B` | `#7F1D1D` | `#450A0A` |
| orange | `#FFF7ED` | `#FFEDD5` | `#FED7AA` | `#FDBA74` | `#FB923C` | `#F97316` | `#EA580C` | `#C2410C` | `#9A3412` | `#7C2D12` | `#431407` |
| amber | `#FFFBEB` | `#FEF3C7` | `#FDE68A` | `#FCD34D` | `#FBBF24` | `#F59E0B` | `#D97706` | `#B45309` | `#92400E` | `#78350F` | `#451A03` |
| yellow | `#FEFCE8` | `#FEF9C3` | `#FEF08A` | `#FDE047` | `#FACC15` | `#EAB308` | `#CA8A04` | `#A16207` | `#854D0E` | `#713F12` | `#422006` |
| lime | `#F7FEE7` | `#ECFCCB` | `#D9F99D` | `#BEF264` | `#A3E635` | `#84CC16` | `#65A30D` | `#4D7C0F` | `#3F6212` | `#365314` | `#1A2E05` |
| green | `#F0FDF4` | `#DCFCE7` | `#BBF7D0` | `#86EFAC` | `#4ADE80` | `#22C55E` | `#16A34A` | `#15803D` | `#166534` | `#14532D` | `#052E16` |
| emerald | `#ECFDF5` | `#D1FAE5` | `#A7F3D0` | `#6EE7B7` | `#34D399` | `#10B981` | `#059669` | `#047857` | `#065F46` | `#064E3B` | `#022C22` |
| teal | `#F0FDFA` | `#CCFBF1` | `#99F6E4` | `#5EEAD4` | `#2DD4BF` | `#14B8A6` | `#0D9488` | `#0F766E` | `#115E59` | `#134E4A` | `#042F2E` |
| cyan | `#ECFEFF` | `#CFFAFE` | `#A5F3FC` | `#67E8F9` | `#22D3EE` | `#06B6D4` | `#0891B2` | `#0E7490` | `#155E75` | `#164E63` | `#083344` |
| sky | `#F0F9FF` | `#E0F2FE` | `#BAE6FD` | `#7DD3FC` | `#38BDF8` | `#0EA5E9` | `#0284C7` | `#0369A1` | `#075985` | `#0C4A6E` | `#082F49` |
| blue | `#EFF6FF` | `#DBEAFE` | `#BFDBFE` | `#93C5FD` | `#60A5FA` | `#3B82F6` | `#2563EB` | `#1D4ED8` | `#1E40AF` | `#1E3A8A` | `#172554` |
| indigo | `#EEF2FF` | `#E0E7FF` | `#C7D2FE` | `#A5B4FC` | `#818CF8` | `#6366F1` | `#4F46E5` | `#4338CA` | `#3730A3` | `#312E81` | `#1E1B4B` |
| violet | `#F5F3FF` | `#EDE9FE` | `#DDD6FE` | `#C4B5FD` | `#A78BFA` | `#8B5CF6` | `#7C3AED` | `#6D28D9` | `#5B21B6` | `#4C1D95` | `#2E1065` |
| purple | `#FAF5FF` | `#F3E8FF` | `#E9D5FF` | `#D8B4FE` | `#C084FC` | `#A855F7` | `#9333EA` | `#7E22CE` | `#6B21A8` | `#581C87` | `#3B0764` |
| fuchsia | `#FDF4FF` | `#FAE8FF` | `#F5D0FE` | `#F0ABFC` | `#E879F9` | `#D946EF` | `#C026D3` | `#A21CAF` | `#86198F` | `#701A75` | `#4A044E` |
| pink | `#FDF2F8` | `#FCE7F3` | `#FBCFE8` | `#F9A8D4` | `#F472B6` | `#EC4899` | `#DB2777` | `#BE185D` | `#9D174D` | `#831843` | `#500724` |
| rose | `#FFF1F2` | `#FFE4E6` | `#FECDD3` | `#FDA4AF` | `#FB7185` | `#F43F5E` | `#E11D48` | `#BE123C` | `#9F1239` | `#881337` | `#4C0519` |

**Primitives outside the ramps:**

| Token | Hex |
|---|---|
| `color/black` | `#000000` |
| `color/white` | `#FFFFFF` |

19 ramps, the same set as the `core` collection of the UU DLS Figma file. 211 color primitives in total. **No primitive carries alpha** — transparency is set at the semantic tier, see 2.4.

If a new brand color does not land exactly on a ramp step, add **one** dedicated primitive (e.g. `color/uu-60`) and point the brand tokens at it — never point a semantic token straight at a hex.

### 2.2 Semantic tokens (collection `color`)

57 tokens (22 `background-*` · 22 `object-*` · **11** `border-*` · 2 `overlay*`). **Bold** = brand token, changes with the brand (see 2.5).

**Background**

| Token | Value |
|---|---|
| `background-surface` | white |
| `background-muted` | slate-50 |
| `background-subtle` | slate-100 |
| `background-emphasized` | slate-200 |
| `background-inverted` | black |
| `background-disabled` | slate-200 |
| `background-interactive` | **indigo-600** |
| `background-interactive-muted` | **indigo-50** |
| `background-accent` | **blue-600** |
| `background-accent-muted` | **blue-50** |
| `background-accent-subtle` | **blue-100** |
| `background-accent-medium` | **blue-200** |
| `background-accent-emphasized` | **blue-400** |
| `background-positive` | green-700 |
| `background-positive-muted` | green-100 |
| `background-negative` | red-600 |
| `background-negative-muted` | red-100 |
| `background-attention` | **rose-600** |
| `background-attention-muted` | **rose-100** |
| `background-warning` | yellow-300 |
| `background-warning-muted` | yellow-100 |
| `background-transparent` | see 2.4 |

**Object (text / icon / vector)**

| Token | Value |
|---|---|
| `object-primary` | black |
| `object-primary-inverted` | white |
| `object-secondary` | **slate-600** |
| `object-disabled` | slate-400 |
| `object-on-light` | black |
| `object-on-dark` | white |
| `object-interactive` | **indigo-600** |
| `object-interactive-muted` | **indigo-500** |
| `object-interactive-inverted` | **indigo-300** |
| `object-on-interactive` | white |
| `object-accent` | **blue-600** |
| `object-accent-muted` | **blue-300** |
| `object-accent-inverted` | **blue-300** |
| `object-on-accent` | white |
| `object-positive` | green-700 |
| `object-on-positive` | white |
| `object-negative` | red-600 |
| `object-on-negative` | white |
| `object-attention` | **rose-600** |
| `object-on-attention` | white |
| `object-warning` | yellow-500 |
| `object-on-warning` | black |

**Border & overlay**

| Token | Value |
|---|---|
| `border` | slate-300 |
| `border-muted` | slate-200 |
| `border-emphasized` | slate-500 |
| `border-subtle` | **blue-200** |
| `border-medium` | **blue-300** |
| `border-inverted` | slate-600 |
| `border-muted-inverted` | slate-700 |
| `border-interactive` | **indigo-500** |
| `border-interactive-inverted` | **indigo-700** |
| `border-highlight` | white |
| `border-negative` | red-600 |
| `overlay` | see 2.4 |
| `overlay-strong` | see 2.4 |

The `border-*` family has **two parallel scales** — don't mix them:

- **Gray scale** — `border-muted` (slate-200) → `border` (slate-300) → `border-emphasized` (slate-500). **Does not change with brand.** This is the default border of every control: inputs, checkbox, radio, switch, segmented control. `border-emphasized` is the stronger border on hover/focus, not a decorative step.
- **Brand scale** — `border-subtle` (blue-200) → `border-medium` (blue-300). **Changes with brand**, paired with the `background-muted`/`-subtle`/`-emphasized` backgrounds. For borders and dividers of tinted blocks, never for controls.

`subtle` / `medium` reuse step names already in the system (`background-accent-subtle`, `background-accent-medium`): within each family, `-muted` / `-subtle` / `-medium` / `-emphasized` are **steps relative to that family**, not absolute ramp steps.

Contrast (boundary threshold 3:1): `border-subtle` 1.42 on white; `border-medium` 1.80. Same class as `border-muted` (1.23) and `border` (1.48) — i.e. **decorative lines**, never the only boundary that defines a control. On `background-subtle`, `border-subtle` drops to 1.30 — for a readable line inside a tinted block use `border-medium` (1.65).

`border-interactive` (indigo-500) is the border of what is selected or focused, so it must pass the 3:1 boundary threshold: **4.47** on white · **3.99** on `background-interactive-muted` — pass. (The former indigo-300 step was only 1.99 on white — fail.) `object-interactive-muted` uses the same indigo-500: 4.47 on white — passes 3:1 for icons and large text, **below 4.5** for body text.

`border-highlight` is a highlight white border, only readable on dark or saturated status backgrounds. Measured against the 3:1 component-boundary threshold: on `background-inverted` 21.00 · `background-interactive` 6.29 · `background-negative` 4.83 · `background-positive` 5.02 — all pass. **Never use it on `background-surface` (1.00) or `background-warning` (1.32).**

**Pairing status tokens**

Each status family has two separate roles — don't cross-pair:

| Want | Use | Example |
|---|---|---|
| Status text / icon on a normal light background | `object-{status}` | warning text on `background-surface` |
| Text / icon sitting **on** a status background | `object-on-{status}` | text inside a Toast |
| Solid background | `background-{status}` | Toast |
| Light background | `background-{status}-muted` | banner, chip |

`object-negative` 4.83 and `object-positive` 5.02 pass AA for text on light backgrounds. `object-warning` is `yellow-500` (**1.92** on white — fails AA for text). So `object-warning` is only for **a dot / icon next to `object-primary` text** (StatusIndicator Container=None); standalone warning text on a light background has no token yet — ask.

> Never put `object-warning` on `background-warning` (only 3.93). On a yellow background use `object-on-warning` (black, 15.93). General rule: `background-{status}` only pairs with `object-on-{status}`.

**The `attention` family — "new, not yet seen"**

`attention` signals **something new the user has not seen yet**: unread count, a "new" dot, a "Mới" label.
It is **not** about risk or errors:

| Family | Meaning | Example |
|---|---|---|
| `attention` | new, not seen yet — fine to ignore | "3" badge on the bell, dot on a tab, "Mới" label |
| `warning` | risky, be careful before acting | about to expire, low balance, irreversible action |
| `negative` | broken or wrong, must fix | invalid input, send failed |

`attention` (**rose-600**, a pinkish red) and `negative` (red-600) are two roles with **different hues** so they don't blend: don't use
`negative` for a "new" badge, don't use `attention` for an error message.

**Four status families**: `positive` · `negative` · `warning` · `attention` — **do not change with brand**
(2.5). The token names are broad (`positive` / `negative`) so they cover more than just
"success / error". The **variant** names in Figma stay `Tone=Success` / `Tone=Error` (Badge,
StatusIndicator) and code props keep the variant names (`tone="success"` / `tone="error"`,
`error` on fields) — variants are the designer's language, tokens are the color system's language. Don't rename
variants or props to match token names.

### 2.3 Contrast — measured

The pairs below are measured against WCAG 2.x. Thresholds: **4.5** for body text, **3.0** for large text (≥24px regular or ≥18.66px bold) and for interactive component boundaries.

| Pair | Ratio |
|---|---|
| `object-primary` on `background-surface` | 21.00 |
| `object-interactive` on `background-surface` | 6.29 |
| white text on `background-interactive` (Solid button) | 6.29 |
| `object-interactive` on `background-interactive-muted` | 5.62 |
| `object-interactive` on `background-accent-subtle` | 5.15 |
| `object-accent` (blue-600) on `background-surface` · white text on `background-accent` | 5.17 |
| `border-interactive` (indigo-500) on `background-surface` · on `background-interactive-muted` | 4.47 · 3.99 (3:1 threshold) |
| `object-secondary` (slate-600) on `background-surface` · `background-muted` · `background-subtle` · `background-emphasized` · `background-accent-subtle` | 7.58 · 7.24 · 6.92 · 6.15 · 6.21 |
| `object-negative` on light backgrounds | 4.83 |
| white text on `background-attention` (badge count) · `object-attention` on light backgrounds | 4.70 · 4.70 |
| `object-positive` on light backgrounds | 5.02 |
| `object-warning` (`yellow-500`) on light backgrounds | **1.92** — fail, only as a dot/icon next to text |
| Toast: Neutral 21.00 · Negative 4.83 · Positive 5.02 · Warning 15.93 | all 4 pass |

The first seven rows depend on brand colors — the numbers above are the **Default** brand. Brand **UU** (2.5), measured:

| Pair (UU brand) | Ratio |
|---|---|
| `object-interactive` (orange-700) on `background-surface` · **black** text on `background-interactive` (orange-500) | 5.18 · 7.49 |
| white `Switch` thumb on `background-interactive` (orange-500) | **2.80** — below 3:1 for graphics; the thumb still carries an `object-interactive` check mark, so the on state does not rely on color alone |
| `object-interactive` on `background-interactive-muted` (orange-50) · on `background-accent-subtle` (amber-100) | 4.88 · 4.65 |
| `object-accent` (amber-700) on `background-surface` · white text on `background-accent` | 5.02 · 5.02 |
| `border-interactive` (orange-600) on `background-surface` · on `background-interactive-muted` | 3.56 · 3.35 (3:1 threshold) |
| `object-secondary` (neutral-600) on `background-surface` · `background-muted` · `background-subtle` · `background-emphasized` · `background-accent-subtle` | 7.81 · 7.49 · 7.17 · 6.20 · 7.02 |
| `object-interactive-inverted` (orange-400) on `background-inverted` | 9.28 |

**When changing a brand's colors, re-measure the brand-dependent rows** before deciding: if the new color drops below 4.5 against white, `Ghost`/`Outline` button text and `Solid` button text fall below the body-text standard. Don't "fix" it with borders or shadows — pick a darker ramp step, or raise button text to the large-text threshold (≥18.66px, weight 700), which is a type-scale change that needs its own decision.

`attention` is **rose-600** (changed from red-500 on 2026-11-09, P35): white text passes **4.70**, so the 11px count in `NotificationBadge` `Count` passes AA. Not red-600 because that is the `negative` color; rose keeps white text and separates the hue from errors.

`object-secondary` is step **600** (Default slate-600 · UU neutral-600; changed from 500 on 2026-11-09, P35): secondary text is ≥ 5.3 on every light background components use (`muted` · `subtle` · `emphasized` · `accent-muted` · `accent-subtle` · `accent-medium`), so secondary text on those backgrounds needs no workaround.

Never let color be the **only signal** where it matters — add text or an icon so color-blind users still understand.

### 2.4 Tokens with alpha · blur

Three tokens do not point straight at a primitive; they **add alpha at the semantic tier** (color alias + alpha percentage).

| Token | Definition | Result |
|---|---|---|
| `overlay` | `color/black` @ `opacity-10` | `rgba(0, 0, 0, 0.10)` |
| `overlay-strong` | `color/black` @ `opacity-45` | `rgba(0, 0, 0, 0.45)` |
| `background-transparent` | `color/white` @ `opacity-0` | fully transparent |

**Which one.** `overlay` SEPARATES LAYERS — a dialog or bottom sheet floats over the screen and
the screen stays readable; it always comes with a background blur, the blur is what pushes the background back,
the 10% black only dims it slightly. `overlay-strong` DARKENS a media layer — camera
feed, image, video — so what sits on it is readable; use it alone, no blur, because
blurring the camera leaves the user nothing to aim at.
Don't use `overlay` for the second case: 10% is too light and the viewfinder sinks into the scene.

The alpha part is bound to an `opacity/*` token, not a literal number, so these tokens are fully token-driven.

In CSS map them with `color-mix`, keeping the derivation:

```css
--overlay: color-mix(in srgb, var(--color-black) 10%, transparent);
--overlay-strong: color-mix(in srgb, var(--color-black) 45%, transparent);
--background-transparent: color-mix(in srgb, var(--color-white) 0%, transparent);
```

Consequences for code: **don't create color primitives with built-in alpha**, and **don't multiply extra opacity onto the fill** — the alpha is already in the token. Need a translucent color? Compose a solid primitive plus an `opacity/*` step. In `tokens.json` these tokens carry an extra `$alpha` field.

#### Blur (background blur)

Two tiers, like color: a **primitive scale** (Figma `core/blur/*`) → **role tokens** (Figma collection `effect`,
1 mode, does not change with brand / density). Unit is **px** on both web and app — blur does not scale with font size.
Components **only read role tokens**, never `--blur-*` directly, never a literal `blur(16px)`.

| Primitive | `blur-0` | `blur-sm` | `blur-base` | `blur-lg` |
|---|---|---|---|---|
| Value | 0 | 4 | 8 | **16** — highest step the design uses |

| Role token | Points to | Used for |
|---|---|---|
| `overlay-blur` | `blur-lg` (16) | **uniform** blur behind a bottom sheet / dialog / Modal side sheet — always paired with the `overlay` color |
| `surface-blur-start` | `blur-0` | frosted bar, **progressive** blur: edge on the content side |
| `surface-blur-end` | `blur-lg` (16) | frosted bar, progressive blur: edge at the screen edge |

A **frosted bar** (header or bottom bar that blurs content scrolling under it) is a per-product choice, **not** a
property of `NavigationBar` / `BottomBar` — components never turn it on themselves. Both directions share one token pair:
a header is strongest at the **top edge** and fades to 0 at the bottom; a bottom bar is the reverse. Figma: effect styles
`surface-blur/top` · `surface-blur/bottom` (*Progressive* background blur); web: classes `.uu-surface-blur--top` ·
`.uu-surface-blur--bottom` in `tokens.css`; Flutter: `UuEffect.surfaceBlurStart/End`. Behind a floating panel:
effect style `overlay-blur` (already on the `Sheet` and `Dialog` templates), web `backdrop-filter: blur(var(--overlay-blur))`.

Need a stronger blur than 16 → add a step to the scale (e.g. `blur-xl`), never change existing steps; need a new role →
add a token to `effect`, named by role.

### 2.5 Brand mode

UU DS has **two** brand modes. Each brand is one block that overrides **exactly the brand token group** below; components
don't know which brand they are in.

| Brand mode | Turned on by | `interactive` | `accent` | Neutral background / border | For |
|---|---|---|---|---|---|
| **Default** | default (`:root`) | indigo | blue | slate | products on UU DS without their own identity |
| **UU** | `<html data-theme="uu">` | **orange** — button fill orange-500 + **black** text; text / links orange-700; border orange-600 | **amber** (yellow) | neutral (warm, no blue tint) | products and sites carrying the Ú Ù identity |

The UU brand follows the Ú Ù identity (orange + yellow of the logo, uucreative.co). The original logo orange is only 3.28 on
white, so it is **never** used for text: `object-interactive` text / links are orange-700 (5.18), interactive borders orange-600 (3.56, passes 3:1).
The button fill `background-interactive` is **orange-500** (decided by the DS owner 2026-10-18) — white text on it is only 2.80, so in the UU brand
`object-on-interactive` is **black** (7.49). That is why `object-on-interactive` is in the brand group;
the deep yellow amber-400 is only a background (`background-accent-emphasized`, black text 12.58); yellow text uses amber-700.

Switch brand for **one region**: put `data-theme` on the region's container — `data-theme="uu"` or `data-theme="default"` (the Default block is also declared as `[data-theme="default"]` so a child region can go back to Default while the page is UU).

Figma: collection `color`, modes `Default` · `UU`. tokens.json: `semantic.color.default` · `semantic.color.uu`.
Flutter: `UuBrand.defaultBrand` · `UuBrand.uu` (`default` is a Dart keyword).

Brand token group — 22 tokens:

```
background-muted / -subtle / -emphasized     neutral page backgrounds (now: slate-50 / 100 / 200)
background-interactive / -interactive-muted
background-accent / -muted / -subtle / -medium / -emphasized
object-interactive / -muted / -inverted
object-on-interactive                         text / icon on interactive fill (Default white · UU black)
object-accent / -muted / -inverted
border-interactive / -interactive-inverted
border-subtle / border-medium
object-secondary                              secondary text (Default slate · UU neutral)
```

Every other token — status (`positive` / `negative` / `warning` / `attention`), the gray scale, `object-primary`, overlay — **does not change with brand**.

`accent` (blue) and `interactive` (indigo) are **two different roles**, currently also different colors: `interactive` is for what is **clickable** (buttons, links, focused fields, tabs, selected items), `accent` is for **content emphasis** (text caret, highlight labels). Don't use an `accent` token on something clickable because the color looks right, or the other way round.

Adding a brand:

```css
[data-theme="brand-name"] {
  --background-interactive: var(--color-…);
  /* …override only the brand token group above */
}
```

In `tokens.json` add a key next to `semantic.color.default` / `semantic.color.uu`, then run `npm run tokens:dart` so Flutter gets a new `UuBrand` value.

---

## 3. Typography

**Font families**

| Token | Actual value | Used for |
|---|---|---|
| `font-family-body` | **the device's system font** (a product DNA can change the family, 4.3) | All functional UI |
| `font-family-display` | `Bungee` | `display-*` styles only |

> **`font-family-body` is the device's system font, not a UU DS font.**
> The design file needs a real font name to render, so it usually says `SF Pro` — the iOS system font. In real life the app uses the device's own system font: SF Pro on iOS, Roboto or the vendor's own font on Android (Samsung, Xiaomi, Oppo all replace it, and users can change it too).
>
> **Don't embed, self-host or download SF Pro.** Besides not existing on Android, Apple's system fonts are licensed only within the Apple ecosystem.

In CSS the token keeps the name `--font-family-body`; only the value is a system stack:

```css
--font-family-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                    "Noto Sans", system-ui, sans-serif;
```

This is the common hybrid model: system font for every functional element (buttons, inputs, labels), brand font only for the display role. UU DS draws that exact line — `display-*` are the only four styles using `font-family-display`.

> **Bungee has only one weight (Regular).** The `display-*` text styles carry weight `bold`, but the font has no Bold cut, so the design shows Regular. On the web set `font-synthesis: none` on `display-*` so the browser does **not** fake bold — text renders exactly like the design. Load the font from Google Fonts (`family=Bungee`); don't self-host a modified copy.

**Three consequences when building**

1. **Don't hardcode widths.** Text width differs between iOS, Roboto and OEM fonts. Every hug-width component (button, toggle, chip) must size itself.
2. **Line-height is an absolute value, not a multiplier.** Apps (Flutter) use logical px, web uses rem (see *Units per platform* in §4). That is why line height does not change when the font swaps and layouts don't shift. Don't switch to a multiplier (`1.5`). On the web, line-height must use the **same unit** as font-size (rem) — in px, when the user enlarges browser text the glyphs grow but lines don't, and lines overlap.
3. **Watch weight steps.** Some Android OEM fonts lack all 4 weights; the browser fakes the missing ones (faux bold), which looks bad. This directly affects the `Active` mode (600 → 700). If it happens, fall back to 2 weights (regular/bold) instead of 4.

**Font size** (`font size/font-size-*`)

| Token | px | rem |
|---|---|---|
| `3xs` | 8 | 0.5 |
| `2xs` | 9 | 0.5625 |
| `xs` | 11 | 0.6875 |
| `sm` | 13 | 0.8125 |
| `base` | 16 | 1 |
| `lg` | 19 | 1.1875 |
| `xl` | 23 | 1.4375 |
| `2xl` | 28 | 1.75 |
| `3xl` | 33 | 2.0625 |
| `4xl` | 40 | 2.5 |
| `5xl` | 48 | 3 |

**Line height** (`line height/font-height-*`): `2xs` 8 · `xs` 16 · `sm` 20 · `base` 24 · `lg` 28 · `xl` 32 · `2xl` 36 · `3xl` 40 · `4xl` 52 · `5xl` 60

**Font weight — 2 modes**

| Token | Default | Active |
|---|---|---|
| `font-weight-normal` | 400 | 500 |
| `font-weight-medium` | 500 | 600 |
| `font-weight-semibold` | 600 | 700 |
| `font-weight-bold` | 700 | 800 |

`Active` mode makes text exactly 1 step bolder — no color change, no size change.

> **Read this carefully:** `Active` mode is only for the **selected state** of two
> components: Toggle button `Active=True` (6.7) and Segment item `Pressed=True` of the
> Segmented control (6.13). Nowhere else. It has **nothing** to do with CSS `:hover` or
> `:active`, nor with a button's `State=Pressed`. A Text button in
> `State=Pressed` keeps weight 600.
>
> Apply this mode to the element that is switched on, not to the element being pressed.

### 3.1 Text styles

| Style | Family | Size | Line height | Weight | Letter spacing |
|---|---|---|---|---|---|
| `display-lg` | Bungee | 48 | 60 | bold | 0 |
| `display-base` | Bungee | 40 | 52 | bold | 0 |
| `display-sm` | Bungee | 33 | 40 | bold | 0 |
| `display-xs` | Bungee | 28 | 36 | bold | 0 |
| `heading-lg` | system | 28 | 36 | semibold | 0 |
| `heading-base` | system | 23 | 32 | semibold | 0 |
| `heading-sm` | system | 19 | 28 | semibold | 0 |
| `title-base` | system | 16 | 24 | semibold | 0 |
| `title-sm` | system | 13 | 20 | semibold | 0 |
| `title-xs` | system | 11 | 16 | semibold | 0 |
| `body` | system | 16 | 24 | normal | 0 |
| `label` | system | 16 | 24 | semibold | 0 |
| `caption` | system | 13 | 20 | normal | 0 |

`body` and `label` have `paragraph-spacing` = 16, `caption` = 8. All other styles = 0.

> `label` and `title-base` have identical values. The difference is **semantic**: `label` is used inside controls (button, input value), `title-base` for content headings.

---

## 4. Spacing, size, shape, elevation

**Units per platform.** Source values are in px (tables below, and `tokens.json`). Each platform
outputs its own unit, same value:

| Platform | `size-*` · `gap-*` · `radius-*` · `font-size-*` · `font-height-*` | Stays px |
|---|---|---|
| App (Flutter) | logical px, exactly the table numbers | — |
| Web (`tokens.css`) | **rem** = px ÷ 16 (`gap-4` = `1rem`, `font-size-lg` = `1.1875rem`) | `size-px`, `rounded-circle`, border widths, shadows |

The web uses rem so the UI scales with the user's browser font size; at the default 16
every measurement equals px. Apps don't need it: Flutter scales text with the system text size. Web code uses
`var(--token)` so there is no manual conversion; never write loose rem or px numbers in a component.

**Gap** (`gap-*`) — 4px steps:

| Token | px | | Token | px |
|---|---|---|---|---|
| `gap-0` | 0 | | `gap-4` | 16 |
| `gap-0-5` | 2 | | `gap-5` | 20 |
| `gap-1` | 4 | | `gap-6` | 24 |
| `gap-1-5` | 6 | | `gap-7` | 28 |
| `gap-2` | 8 | | `gap-8` | 32 |
| `gap-2-5` | 10 | | `gap-9` | 36 |
| `gap-3` | 12 | | `gap-10` | 40 |
| `gap-3-5` | 14 | | `gap-11` | 44 |
| | | | `gap-12` | 48 |
| | | | `gap-14` | 56 |
| | | | `gap-16` | 64 |

**Size** (`size-N` = N × 4px): `0, px(1), 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96` → up to 384px.

**Radius**

| Token | px |
|---|---|
| `radius-none` | 0 |
| `radius-sm` | 8 |
| `radius-base` | 12 |
| `radius-lg` | 16 |
| `radius-xl` | 20 |
| `rounded-2xl` | 24 |
| `rounded-3xl` | 28 |
| `rounded-4xl` | 32 |
| `rounded-circle` | 9999 (pill / full circle) |

**Opacity** (`opacity-N`, value = N%): 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95.

The four steps `5 / 10 / 20 / 40` are the ones **actually used** by the state layer (6.0). `0` and `10` supply alpha to two color tokens in 2.4. The rest is a reserve scale.

**Elevation (effect styles)**

| Style | Shadow |
|---|---|
| `elevation-low` | `0 2px 8px rgba(0,0,0,0.10)` |
| `elevation-medium` | `0 4px 12px rgba(0,0,0,0.10)` |
| `elevation-high` | `0 8px 24px rgba(0,0,0,0.10)` |

**Paint styles**: `card-surface` (gradient), `↳` (solid `#D9D9D9`), `placeholder` (image) — 3 loose styles, outside the token system. `placeholder` is a stand-in image for mockups, not a product color.


### 4.1 Density — `Touch` · `Compact`

Variable collection **`density`**, 2 modes: **`Touch`** (default, original sizes — mobile app,
mini app) and **`Compact`** (desktop, dashboard, portal). Density is an axis **independent** of brand:
every brand can use both.

**It only changes sizes and the weight of `label` text.** Color, state layer, gaps between blocks, icons (except size),
pairing rules — unchanged. No new primitives: every value aliases an existing scale
(`size-*`, `gap-*`, `radius-*`, `font-size-*`, `font-height-*`, `font-weight-*`), except
`chip/border-width` (2 · 1), written as a literal because there is no border-width scale yet.

**Compact rules**
- Text: every text style **steps down exactly one** step on the 11-step scale (body/label 16 → 13, caption 13 → 11,
  heading 28/23/19 → 23/19/16). `11` is the floor — `title-xs` stays 11/16. `display-*` unchanged.
- Controls (TextButton, IconButton, ToggleButton): Large / Base / Small **56 / 48 / 32 → 40 / 32 / 24**;
  horizontal padding 24 / 16 / 12 → 16 / 12 / 8; icon 24 → 16. Chip uses the Small set.
- Fields (TextInput, SearchInput, DateInput, Dropdown, OTP cells): height **48 → 32**, radius 16 → 8,
  horizontal padding 12 → 8, icon 24 → 16. TextArea only changes radius and horizontal padding, keeps height 112.
- `label` text (TextButton, ToggleButton, Segment, Dropdown value) **600 → 500**. The **Active** text mode
  (Toggle on, selected Segment) is still one step bolder: Touch 700 · Compact **600**.
  Chip border **2 → 1**; TextButton Outline keeps a 2 border.
- Checkbox / Radio **32 → 24**; Switch **56×32 → 40×24**; Tab padding 12 → 8.
- Small 24 still meets WCAG 2.5.8 (minimum 24×24 target). **Don't use Compact on touch screens.**

**How to use**
- Figma: select the screen frame → *Layer* panel → mode `density = Compact`. Every instance and text style
  inside shrinks (text styles bind `fontSize` / `lineHeight` to `text/*`; Button, Field, Checkbox, Radio,
  Switch, Chip, Tab bind sizes to density variables). In `Touch` no variant changes size.
- Web: `data-density="compact"` on the container (`<html>` or a region). Components and `.text-*`
  classes read density variables; components **never** read `--font-size-*` / `--font-height-*` directly
  or hardcode 24/32/40/48/56px (the checker reports `text-primitive` and `density-hardcode`).
- Flutter: `uuThemeData(density: UuDensity.compact)`; widgets read `UuTheme.of(context).sizes` and
  `.text`. `UuTextStyles` stays as Touch constants — don't use it in widgets.

| Figma variable (`density/…`) | CSS | Touch | Compact |
|---|---|---|---|
| `text/heading-lg/font-size` | `--text-heading-lg-font-size` | 28 (`font-size-2xl`) | **23** (`font-size-xl`) |
| `text/heading-lg/line-height` | `--text-heading-lg-line-height` | 36 (`font-height-2xl`) | **32** (`font-height-xl`) |
| `text/heading-base/font-size` | `--text-heading-base-font-size` | 23 (`font-size-xl`) | **19** (`font-size-lg`) |
| `text/heading-base/line-height` | `--text-heading-base-line-height` | 32 (`font-height-xl`) | **28** (`font-height-lg`) |
| `text/heading-sm/font-size` | `--text-heading-sm-font-size` | 19 (`font-size-lg`) | **16** (`font-size-base`) |
| `text/heading-sm/line-height` | `--text-heading-sm-line-height` | 28 (`font-height-lg`) | **24** (`font-height-base`) |
| `text/title-base/font-size` | `--text-title-base-font-size` | 16 (`font-size-base`) | **13** (`font-size-sm`) |
| `text/title-base/line-height` | `--text-title-base-line-height` | 24 (`font-height-base`) | **20** (`font-height-sm`) |
| `text/title-sm/font-size` | `--text-title-sm-font-size` | 13 (`font-size-sm`) | **11** (`font-size-xs`) |
| `text/title-sm/line-height` | `--text-title-sm-line-height` | 20 (`font-height-sm`) | **16** (`font-height-xs`) |
| `text/title-xs/font-size` | `--text-title-xs-font-size` | 11 (`font-size-xs`) | 11 (`font-size-xs`) |
| `text/title-xs/line-height` | `--text-title-xs-line-height` | 16 (`font-height-xs`) | 16 (`font-height-xs`) |
| `text/body/font-size` | `--text-body-font-size` | 16 (`font-size-base`) | **13** (`font-size-sm`) |
| `text/body/line-height` | `--text-body-line-height` | 24 (`font-height-base`) | **20** (`font-height-sm`) |
| `text/label/font-size` | `--text-label-font-size` | 16 (`font-size-base`) | **13** (`font-size-sm`) |
| `text/label/line-height` | `--text-label-line-height` | 24 (`font-height-base`) | **20** (`font-height-sm`) |
| `text/label/font-weight` | `--text-label-font-weight` | 600 (`font-weight-semibold`) | **500** (`font-weight-medium`) |
| `text/caption/font-size` | `--text-caption-font-size` | 13 (`font-size-sm`) | **11** (`font-size-xs`) |
| `text/caption/line-height` | `--text-caption-line-height` | 20 (`font-height-sm`) | **16** (`font-height-xs`) |
| `control/height-large` | `--control-height-large` | 56 (`size-14`) | **40** (`size-10`) |
| `control/padding-x-large` | `--control-padding-x-large` | 24 (`gap-6`) | **16** (`gap-4`) |
| `control/padding-y-large` | `--control-padding-y-large` | 8 (`gap-2`) | **4** (`gap-1`) |
| `control/icon-large` | `--control-icon-large` | 24 (`size-6`) | **16** (`size-4`) |
| `control/height-base` | `--control-height-base` | 48 (`size-12`) | **32** (`size-8`) |
| `control/padding-x-base` | `--control-padding-x-base` | 16 (`gap-4`) | **12** (`gap-3`) |
| `control/padding-y-base` | `--control-padding-y-base` | 8 (`gap-2`) | **4** (`gap-1`) |
| `control/icon-base` | `--control-icon-base` | 24 (`size-6`) | **16** (`size-4`) |
| `control/height-small` | `--control-height-small` | 32 (`size-8`) | **24** (`size-6`) |
| `control/padding-x-small` | `--control-padding-x-small` | 12 (`gap-3`) | **8** (`gap-2`) |
| `control/padding-y-small` | `--control-padding-y-small` | 4 (`gap-1`) | **2** (`gap-0-5`) |
| `control/icon-small` | `--control-icon-small` | 16 (`size-4`) | 16 (`size-4`) |
| `field/height` | `--field-height` | 48 (`size-12`) | **32** (`size-8`) |
| `field/padding-x` | `--field-padding-x` | 12 (`gap-3`) | **8** (`gap-2`) |
| `field/radius` | `--field-radius` | 16 (`radius-lg`) | **8** (`radius-sm`) |
| `field/icon` | `--field-icon` | 24 (`size-6`) | **16** (`size-4`) |
| `field/otp-min-width` | `--field-otp-min-width` | 36 (`size-9`) | **28** (`size-7`) |
| `selection/size` | `--selection-size` | 32 (`size-8`) | **24** (`size-6`) |
| `selection/radius` | `--selection-radius` | 12 (`radius-base`) | **8** (`radius-sm`) |
| `selection/check` | `--selection-check` | 20 (`size-5`) | **16** (`size-4`) |
| `selection/radio-dot` | `--selection-radio-dot` | 20 (`size-5`) | **12** (`size-3`) |
| `selection/label-offset` | `--selection-label-offset` | 4 (`gap-1`) | **2** (`gap-0-5`) |
| `switch/width` | `--switch-width` | 56 (`size-14`) | **40** (`size-10`) |
| `switch/height` | `--switch-height` | 32 (`size-8`) | **24** (`size-6`) |
| `switch/padding` | `--switch-padding` | 8 (`gap-2`) | **6** (`gap-1-5`) |
| `switch/handle-off` | `--switch-handle-off` | 16 (`size-4`) | **12** (`size-3`) |
| `switch/handle-on` | `--switch-handle-on` | 28 (`size-7`) | **20** (`size-5`) |
| `switch/handle-icon` | `--switch-handle-icon` | 16 (`size-4`) | **12** (`size-3`) |
| `tab/padding` | `--tab-padding` | 12 (`gap-3`) | **8** (`gap-2`) |
| `chip/border-width` | `--chip-border-width` | 2 (`2px`) | **1** (`1px`) |
| `table/row-height` | `--table-row-height` | 56 (`size-14`) | **40** (`size-10`) |
| `table/header-height` | `--table-header-height` | 48 (`size-12`) | **32** (`size-8`) |
| `table/cell-padding-x` | `--table-cell-padding-x` | 16 (`gap-4`) | **12** (`gap-3`) |
| `card/padding` | `--card-padding` | 16 (`gap-4`) | **12** (`gap-3`) |
| `list/min-height` | `--list-min-height` | 56 (`size-14`) | **40** (`size-10`) |
| `list/padding-x` | `--list-padding-x` | 16 (`gap-4`) | **12** (`gap-3`) |
| `list/padding-y` | `--list-padding-y` | 12 (`gap-3`) | **8** (`gap-2`) |
| `sidenav/width` | `--sidenav-width` | 288 (`size-72`) | **240** (`size-60`) |

### 4.2 Layout — `Expanded` · `Collapsed`

Variable collection **`layout`**, 2 modes: **`Expanded`** (default) and **`Collapsed`** — whether the frame is in full form
or **collapsed to icons only**. It is an axis of **a whole screen or a region**, alongside `color` and `density`,
not owned by any component. It only changes **visibility**, never size (width stays in `density`,
e.g. `sidenav/width`).

| Variable (BOOLEAN) | Expanded | Collapsed | Bound to |
|---|---|---|---|
| `layout/show-label` | true | false | label next to an icon: `.SideNavItem`; later `FooterItem`, `FooterItemSpecial` |
| `layout/show-section-title` | true | false | group titles: `.SideNavSection`, `.MenuSection` |
| `layout/show-nested` | true | false | level-2 items: `.SideNavItem` `Level=2` |

Names follow the **role**, not the component — a new component that hides its label when collapsed binds to the
existing variable; don't create a new collection. Web: `data-layout="collapsed"` on the container (like `data-density`);
the `collapsed` prop of `SideNav` is a shorthand for the sidebar region. Flutter:
`UuTheme(layout: UuLayout.collapsed)` / `collapsed` prop. `BottomBar` keeps its `Compact` variant because the geometry changes
(height 64 → 48).

### 4.3 Product DNA

UU DS owns structure and behavior. A product's own style is declared in a `DNA.md` file and applied with one
`[data-theme="<name>"]` block on `<html>`. No DNA → use the Default brand.

This block may change: the 22 brand tokens (2.5), `radius-sm` → `radius-xl`, `rounded-2xl` → `rounded-4xl`,
`elevation-*` (including `elevation-none`, the control shadow), `font-family-display`, `font-family-body`, the outer border
(`border-outer-width` · `border-outer`), the icon set, and `--dna-*` variables for screen backgrounds and layout.
It may not change: `rounded-circle`, the state layer, control heights, density, text-style font size / line-height / font-weight,
status tokens, `object-primary`, the gray scale. Re-measure contrast per 2.3.

Off-scale values are declared only inside this block. Components and screens read `var(--token)`; `--dna-*` is only for screen layout
and always has a fallback: `var(--dna-page-margin, var(--gap-4))`.

**Changing corner radius** follows the scale; there are no per-component tokens:

| Token | Read by | Moves together when DNA changes it |
|---|---|---|
| `rounded-4xl` | `TextButton*`, `IconButton*`, `ToggleButton`, `Chip` | buttons and chips change together |
| `radius-lg` | `KPICard`, `Popover`, `CardPushNotification`, `SideSheet` | inputs, `SegmentedControl` shell |
| `rounded-2xl` | `CardSheet`, `CardDialog` | `Menu` panel |

`rounded-4xl` is 32, more than half the tallest button (56), so by default buttons are fully round at every size. Don't use `rounded-4xl` for cards or screen blocks. Radio, Switch, dots, badges, in-field clear buttons and the `BottomBar` shell keep reading `rounded-circle`.

**Changing fonts.** `font-family-display` drives the 4 `display-*` styles; `font-family-body` drives every other style (heading, title,
body, label, caption). Only the family changes: size, line-height, font-weight and letter-spacing stay on the scale (3.1 + density).
Without a DNA, body stays the system font. The product loads its own font (web `@font-face`, app `expo-font` /
`pubspec`); on Android, fonts loaded per weight need the family declared per weight (400 · 500 · 600 · 700 · 800).

**Control outer border and shadow.** **Off** by default (`border-outer-width` 0, `elevation-none` no shadow); a DNA turns them on
when the product needs its own look, e.g. ink border + hard shadow.

| Token | Default | Meaning |
|---|---|---|
| `border-outer-width` | `0` | outer border width, shared by controls and cards |
| `border-outer` | `object-primary` | outer border color (named like `border`, `border-emphasized`); may point at any `border-*` / `object-*` |
| `elevation-none` | no shadow | flush shadow level of controls, same syntax as `elevation-*`; blur 0 = hard shadow |

**Outer border is not the inner border (`border`).** The inner border sits inside the control edge and changes color with state (focus, Error,
selected, Disabled). The outer border wraps **outside** the edge, **takes no space** (web `box-shadow` spread, app shadow /
`boxShadow` spread), is one color, and does not change with state: height, padding and touch target stay the same; the inner state border
is still visible.

**A shadow paired with an outer border needs spread = border width.** The outer border grows on all four sides; a shadow without spread
offset by the same amount hides entirely behind the border. 2px border + 2px hard offset shadow → `2px 2px 0 2px`
(x · y · blur · **spread**). No border → spread 0.

- **Controls** take outer border + `elevation-none`: `TextButton*`, `IconButton*`, `ToggleButton`, `Chip`, `Checkbox`,
  `Radio`, `Switch`, input frames (`TextInput`, `TextArea`, `SearchInput`, `DateInput`, `Dropdown`, `OTPInput` cells).
  The shadow is drawn under the outer border.
- **Cards** take the outer border: `CardSheet`, `CardDialog`, `KPICard`. A card's shadow stays its own `elevation-*`, spread =
  `border-outer-width`. Not applied to `SideSheet`, navigation bars, `Toast`, `Popover`, `Tooltip`.
- **With the outer border on, drop the inner border in the resting state**: when `border-outer-width` > 0, controls that normally have an inner border
  (unselected `Chip`, unchecked `Checkbox`, unselected `Radio`, off `Switch`, `Outline` button, input frames, `OTPInput` cells)
  don't draw the inner border at rest; the outer border takes its place. **State** borders stay: focus / typing
  (`border-emphasized`), Hover / Pressed of controls that change border on interaction (`border-emphasized`), Error (`border-negative`), selected / checked (`border-interactive`),
  Disabled (`border-muted`). An `Outline` button then tells tones apart only by text color. Dropping the inner border does not change control
  size.
- Disabled still has the outer border and shadow; the state layer never covers the outer border.
- Controls placed side by side need a minimum gap larger than border + shadow offset. A parent frame that clips overflow (`overflow: hidden`)
  cuts off the outer border and shadow — leave padding or remove clipping on that frame.

**In Figma** only the variables exist; components are **not pre-bound** so the Effects panel stays clean: `border-outer` in the `color` collection
(alias `object-primary`, both brands), `border-outer-width` in the `effect` collection (0); `elevation-none` is an empty shadow.
A product that needs the outer border turns it on following `product-dna.md`, section *Turning on the outer border in Figma* (by hand
or with AI).

**Multiple color modes.** A product may have several color modes (by role, by occasion, by user taste…).
Each mode is a brand mode of the product: it re-declares only the **22 brand tokens** (2.5). Everything else in the DNA — fonts,
radius, elevation, outer border, icon set, `--dna-*` — is declared **once** and shared by every mode.

- Not changed by mode: state layer, status tokens, `object-primary`, gray scale (as in every DNA).
- Contrast (2.3) is re-measured **per mode**. If a mode fails, fix that mode's colors, don't relax the rules.
- Switching mode only changes color: no layout change, no component change, no screen reload.
- Product-specific decorative colors outside the 22 tokens (e.g. tape, illustrations) are declared as `--dna-*`; whether they stay fixed or
  follow the mode is the product's call.
- Dark mode does **not** go this way: UU DS has not decided dark mode.

| Platform | Shared part | Per mode | Switching mode |
|---|---|---|---|
| Web | block `[data-theme^="<prod>-"]` | block `[data-theme="<prod>-<mode>"]` | change `data-theme` on `<html>` |
| React Native | `dna` of `UuProvider` | `dna.colors` | replace `dna.colors` (keep the rest) |
| Flutter | `uuThemeData(...)` parameters | `UuSemanticColors` | `copyWith(colors: …)` on `UuTheme` |

**Own icon set.** The package only ships the public UU icons: icons components use internally and `texture` (placeholder icon). A product that needs icons
buys a Nucleo license or uses another set, then registers its set with the app (web `IconProvider`, app `UuProvider icons` / `UuIcons`): name → outline SVG
(+ fill if any). A registered name overrides the default icon of the same name; unregistered names fall back to the default set, so components' internal
icons (`chevron-down`, `xmark`, `check`, `magnifier`…) keep working. A product uses **one** set: don't mix two sets
on the same screen. Icon boxes (24 / 16 / 18), color via `object-*` tokens and the "on = `fill`" rule stay the same for every set; a set
without `fill` reuses the outline for the on state.

---

## 5. Component inventory

This is the **complete** list of decided components. Nothing exists outside it. Component names are CamelCase with no spaces — code uses exactly these names.

| Component | Variants | Spec |
|---|---|---|
| `TextButtonAccent` | 90 | 6.1 |
| `TextButtonNeutral` | 105 | 6.1 |
| `TextButtonDanger` | 45 | 6.1 |
| `IconButtonAccent` | 90 | 6.2 |
| `IconButtonNeutral` | 90 | 6.2 |
| `ToggleButton` | 48 | 6.7 |
| `ButtonGroup` | 4 | 6.9 |
| `TextInput` | 9 | 6.3 |
| `TextArea` | 9 | 6.3e |
| `OTPInput` | 14 | 6.3b |
| `SearchInput` | 8 | 6.3g |
| `DateInput` | 8 | 6.3c |
| `Dropdown` | 8 | 6.4 |
| `Menu` | 2 (+ `.MenuItem` 16 · `.MenuSection` · `.MenuDivider`) | 6.21 |
| `Checkbox` | 15 | 6.3f |
| `CheckboxInput` | 1 | 6.3f |
| `Radio` | 10 | 6.3d |
| `RadioInput` | 1 | 6.3d |
| `Switch` | 10 | 6.17 |
| `Chip` | 20 | 6.18 |
| `SegmentedControl` | 1 (+ `.Segment item` 8) | 6.13 |
| `NavigationBar` | 1 | 6.5 |
| `BottomBar` | 10 (+ `base/FooterItem` 2 · `base/FooterItemSpecial` 4) | 6.22 |
| `TablePagination` | 1 (+ `.PageItem` 4) | 6.24 |
| `Breadcrumb` | 1 (+ `.BreadcrumbItem` 5) | 6.25 |
| `SideNav` | 2 (+ `.SideNavItem` 9 · `.SideNavSection` 1) | 6.27 |
| `Tab` | 5 | 6.20 |
| `TabBar` | 2 | 6.20 |
| `Pagination` | 3 | 6.10b |
| `Toast` | 4 | 6.6 |
| `Badge` | 4 | 6.14 |
| `StatusIndicator` | 10 | 6.15 |
| `CardPushNotification` | 1 | 6.31 |
| `[Screen]PushNotification` (screen template) | 1 | 6.31 |
| `NotificationBadge` | 2 | 6.16 |
| `Tooltip` | 4 | 6.30 |
| `TableHeaderCell` | 21 | 6.23 |
| `TableCell` | 18 | 6.23 |
| `KPICard` | 5 | 6.26 |
| `CardSheet` (bottom sheet panel) | 4 | 6.8 |
| Bottom sheet (`Sheet` — screen template) | 1 | 6.8 |
| `CardDialog` (dialog panel) | 2 | 6.10 |
| Dialog (`Dialog` — screen template) | 1 | 6.10 |
| `SideSheet` | 4 | 6.28 |
| `Popover` | 1 | 6.29 |
| `ResultScreen` (screen template, has code component) | 1 | 6.19 |
| `ErrorScreen` (screen template, has code component) | 1 | 6.19 |
| `EmptyScreen` (screen template, has code component) | 1 | 6.19 |
| `EmptySection` (embedded block) | 1 | 6.19 |
| `ErrorSection` (embedded block) | 1 | 6.19 |
| `ListItem` | 4 | 6.32 |
| `ListGroup` | 1 | 6.32 |

Not yet: what is still undecided for a component is listed at the end of its file in `components/`.

Text strings on components are **properties**, not nodes to select and edit: `Error message` (TextInput · TextArea · OTPInput · DateInput · Dropdown), `Word counter` (TextArea), `Input value` (OTP cell), `Text` (DateInput · Dropdown), `Label` (CheckboxInput · RadioInput · `base/prefix` · Chip), `Count` (NotificationBadge), `Helper text` (TextInput · TextArea), `Content` (Toast, TableCell), `Label` / `Value` (KPICard), `Title` (SideSheet, Popover, `.MenuSection`, `EmptyScreen` / `EmptySection` / `ErrorSection` / `ErrorScreen`), `Description` (empty and error screens / blocks), `Title` · `Content` (`CardPushNotification`), `Text` (Tooltip). In code they are props (`errorMessage`, `label`…).

Internal components, never used directly — they only appear inside the components above: `.label`, `.suffix`, `base/prefix` (Type Icon/Label), `base/suffix` (18×18, Type=Icon), `.Segment item`, `.MenuItem`, `.MenuSection`, `.MenuDivider`, `base/FooterItem` (item of `BottomBar`, 2 variants), `base/FooterItemSpecial` (standalone action button of `BottomBar`, 4 variants), `.PageItem` (page number cell of `TablePagination`), `.BreadcrumbItem`, `.SideNavItem`, `.SideNavSection`, `.base/input-default` and `.base/input-masked` (OTP cells, 7 variants each), `.ListIconContainer` · `.ListAvatar` · `.ListValue` (leading / trailing parts of `ListItem`), `.Mini App Control`, `.loading`, `Icon`, `🔒Base/Slick`.

`Sheet` (6.8) and `Dialog` (6.10) are screen templates, not product components — they embed a Device element.

**Not part of the design system**, only for context mockups: all `Device elements` (status bar, iOS/Android keyboard, home indicator, browser chrome, Face ID / Touch ID alerts) and `.Mini App Control` (the mini-app platform's UI, e.g. Zalo). Don't tokenize them, don't treat them as product components.

## 6. Component specs

§6.0 (state layer) and §6.12 (`.loading`) apply to every component and stay in this file. Every other section is its own file in `components/` — **read the file of each component you use** before building it.

| § | File | Components |
|---|---|---|
| 6.1 | `components/text-button.md` | `TextButtonAccent` · `TextButtonNeutral` · `TextButtonDanger` |
| 6.2 | `components/icon-button.md` | `IconButtonAccent` · `IconButtonNeutral` |
| 6.3 | `components/text-input.md` | `TextInput` |
| 6.3b | `components/otp-input.md` | `OTPInput` |
| 6.3c | `components/date-input.md` | `DateInput` |
| 6.3d | `components/radio.md` | `Radio` · `RadioInput` |
| 6.3e | `components/text-area.md` | `TextArea` |
| 6.3f | `components/checkbox.md` | `Checkbox` · `CheckboxInput` |
| 6.3g | `components/search-input.md` | `SearchInput` |
| 6.4 | `components/dropdown.md` | `Dropdown` |
| 6.5 | `components/navigation-bar.md` | `NavigationBar` |
| 6.6 | `components/toast.md` | `Toast` |
| 6.7 | `components/toggle-button.md` | `ToggleButton` |
| 6.8 | `components/bottom-sheet.md` | `CardSheet` · `Sheet` |
| 6.9 | `components/button-group.md` | `ButtonGroup` |
| 6.10 | `components/dialog.md` | `CardDialog` · `Dialog` |
| 6.10b | `components/pagination.md` | `Pagination` |
| 6.11 | `components/icon.md` | `Icon` |
| 6.13 | `components/segmented-control.md` | `SegmentedControl` |
| 6.14 | `components/badge.md` | `Badge` |
| 6.15 | `components/status-indicator.md` | `StatusIndicator` |
| 6.16 | `components/notification-badge.md` | `NotificationBadge` |
| 6.17 | `components/switch.md` | `Switch` |
| 6.18 | `components/chip.md` | `Chip` |
| 6.19 | `components/screen-templates.md` | `ResultScreen` · `ErrorScreen` · `EmptyScreen` · `EmptySection` · `ErrorSection` |
| 6.20 | `components/tab.md` | `Tab` · `TabBar` |
| 6.21 | `components/menu.md` | `Menu` |
| 6.22 | `components/bottom-bar.md` | `BottomBar` |
| 6.23 | `components/table.md` | `TableHeaderCell` · `TableCell` |
| 6.24 | `components/table-pagination.md` | `TablePagination` |
| 6.25 | `components/breadcrumb.md` | `Breadcrumb` |
| 6.26 | `components/kpi-card.md` | `KPICard` |
| 6.27 | `components/side-nav.md` | `SideNav` |
| 6.28 | `components/side-sheet.md` | `SideSheet` |
| 6.29 | `components/popover.md` | `Popover` |
| 6.30 | `components/tooltip.md` | `Tooltip` |
| 6.31 | `components/push-notification.md` | `CardPushNotification` |
| 6.32 | `components/list-item.md` | `ListItem` · `ListGroup` |

### 6.0 State layer — interaction model

Hover and Pressed **do not change the background or text color**. The system adds a `state layer` on top:

- `RECTANGLE`, absolute-positioned, full-bleed at the exact size of the container, corner radius follows the container
- Sits **on top** of the z-stack, and is **locked** in the design file (on purpose, so designers don't drag it by mistake)
- `fill` = **the object color of that variant** — the `object-*` token the variant uses for its text / icon (CSS: `currentColor`), not a fixed color
- `opacity` is bound to the `opacity/opacity-*` token

Pick the opacity step by the contrast of the background:

| Context | State layer fill | Hover | Pressed |
|---|---|---|---|
| Solid, dark/saturated background — `Solid` Accent, `Solid` Neutral | on-content color (`object-on-interactive`, `object-primary-inverted`) | `opacity-20` | `opacity-40` |
| Light / transparent background — `Outline`, `Ghost` (Inverted=False), and **every `Solid / Inverted=True`** (background is `background-surface`) | object color (`object-interactive`, `object-primary`) | `opacity-5` | `opacity-10` |
| On dark background — `Outline`/`Ghost` + `Inverted=True` | inverted object color (`object-interactive-inverted`, `object-primary-inverted`) | `opacity-20` | `opacity-40` |
| Text input `Hover` | `object-secondary` | `opacity-5` | — |

Short rule: **the overlay is painted with the object color sitting on that background (`currentColor`); the strength depends on the background type** —
solid colored background (`Solid` Accent / Neutral) → 20/40; light or transparent background (`Outline`, `Ghost`, `Solid` `Inverted`) → 5/10;
`Outline` / `Ghost` `Inverted` on a dark background → 20/40. Do not choose by text color: in the UU brand, `Solid` with black text on orange
is still 20/40.

**Exception — `Radio`** (§6.3d), kept as designed:

1. Selected: the ring background is `background-surface` (light) but the overlay is **20/40** `object-interactive` — the overlay is only the 32 ring,
   a 5% overlay is barely visible.
2. Unselected: the center is empty so there is no object color — hover paints `object-secondary` 5%, pressed `object-primary` 10%.

`Disabled` and `Loading` have **no** state layer.

**Implementation in code:**

```css
.uu-interactive { position: relative; isolation: isolate; }
.uu-interactive::after {
  content: ""; position: absolute; inset: 0;
  border-radius: inherit; pointer-events: none;
  background: currentColor;      /* = the variant's object color (object-* token of text / icon) */
  opacity: 0; transition: opacity 120ms ease;
}
/* solid/dark background */
.uu-on-dark:hover::after  { opacity: var(--opacity-20); }
.uu-on-dark:active::after { opacity: var(--opacity-40); }
/* light/transparent background */
.uu-on-light:hover::after  { opacity: var(--opacity-5); }
.uu-on-light:active::after { opacity: var(--opacity-10); }
```

**The variant's object color** — in CSS write `background: currentColor` (a standard CSS keyword: takes the element's exact `color` value). The state layer fill always matches the object color, so this is the most accurate mapping: for `Solid` it is `object-on-interactive`, for `Ghost` it is `object-interactive`. Don't create a token like `object-color` for this — each variant yields a different color, not a fixed value. One rule works for all 12 combinations.

The state layer is the **entire** hover and pressed effect. No background change, no text color change, no font-weight change.

### 6.12 `.loading`

Spinner `18 × 18`, built from 2 linear-gradient vectors + one 2×2 dot. Used in a button's `State = Loading`. Prototype: a round spinner rotating 360°, size 18, color inherited from the button's text color.

## 7. Device elements — not part of the design system

Page `DeviceElements`. Only for context mockups; don't tokenize them, don't put them
in the component library.

| Component | Size | Variants |
|---|---|---|
| `Status bar` | 402 × 62 | 16 — `OS` (iOS dynamic island / iOS notch / iOS / Android) × `Theme` (Default/Reverse) × `Transparent` |
| `iOS keyboard` | 402 × 318 | 8 — `Type` (Letters/Numbers) × `Version` (iOS 18 / iOS 26) × `Theme` (Light/Dark) × `Home indicator` |
| `Android keyboard` | 412 × 338 | 2 — Letters / Numbers |
| `IOS Home indicator` | 390 × 34 | 4 — `Theme` × `Transparent` |
| `Browser` | 1440 × 80 | 2 — Desktop / Mobile |
| `iOS Face ID` | 375 × 812 | 2 — Authenticating / Success |
| `.iOS Alert 15` | 402 × 300 | 4 — `Buttons`: 1 / 2 stacked / 2 side-by-side / 3 stacked |
| `.Face ID Alert 26` | 300 × 267 | 3 |
| `.Touch ID Alert 26` | 300 × 252 | 3 |
| `iOS Touch ID 26/15`, `iOS Face ID permission 26/15` | 390 × 844 | full-screen |

**Standard frame widths**: `390` (iPhone 14/15), `402` (iPhone 16), `412` (Android), `430` (iPhone Pro Max), `1440` (desktop).

---

*UU Design system — spec. This file only contains what has been decided.*
