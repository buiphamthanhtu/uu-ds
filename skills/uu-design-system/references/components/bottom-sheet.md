### 6.8 Bottom sheet

Two components with clearly separate roles: `CardSheet` is the sheet panel itself, `Sheet` is the complete screen with scrim. (`CardSheet` replaces the old `.base/sheet` — removed from the design file.)

#### `CardSheet` — the sheet panel

**Props**

| Prop | Type | Default |
|---|---|---|
| `Header` | TEXT | `"Header"` |
| `Slot` | SLOT | empty, does not stretch its child |
| `CTA` | BOOLEAN | `true` — shows/hides the **whole** button group |
| `Navigation` | VARIANT | **`Close`** · `Back` |
| `Height` | VARIANT | **`Fit`** · `Full` — with `Navigation` gives **4 variants** |
| `Handle` | BOOLEAN | `false` — drag handle at the top |

**Back and Close are mutually exclusive.** A root sheet has a close button on the right and no back. A **child** sheet
(opened from a previous sheet — pick a province then a district, read terms then
confirm) uses `Navigation=Back`: a back button on the left **and no close button**. Never
both. Back returns to the parent sheet; to close the whole chain, go back to the root sheet and press close —
that is intentional, so the user never loses track of which level they are on.

> **Close and back buttons are mutually exclusive** — the design guarantees it with the `Navigation` variant. Code: passing
> `onBack` means `Navigation=Back` (back button on the left, no close button); not passing it means `Navigation=Close`.

The secondary button and stacking direction have **no** prop at the `CardSheet` level. Select the `Button group` instance inside to change `Secondary button` and `Layout` — those are props of the component set in 6.9.

**Structure**

```
CardSheet          VERTICAL · gap 0 · FIXED × HUG · radius 24 (rounded-2xl, all 4 corners) · background-surface · clip
├─ Header          HORIZONTAL · padding 16/16/0/16 · gap 16 · FILL × HUG · h48 · cross-axis centered
│  ├─ Back         IconButtonNeutral / Outline / Small (32) · icon chevron-left 16 · only with Navigation=Back
│  ├─ Title        "Header" · heading-base · object-primary · FILL
│  └─ Close        IconButtonNeutral / Outline / Small (32) · icon xmark 16 · object-primary · only with Navigation=Close
└─ Body            VERTICAL · padding 12/16/16/16 · gap 12 · FILL × HUG
   ├─ Slot         FILL × HUG — place for any content
   └─ Button group instance of the component set in 6.9 · Layout=Horizontal · FILL × HUG
                   visible ← CTA prop
```

The button group **uses the shared `ButtonGroup` component set** (6.9), like Dialog — not a hand-built frame. So Bottom sheet gets `Layout=Vertical` for free.

All four corners are rounded, not just the top two, because the sheet floats 12px from both edges rather than sticking to the screen edge.

**Body is a slot**: spacing between blocks inside the Slot is the content's job (e.g. the app wraps a vertical stack with gap 16);
`CardSheet` does not insert spacing between Slot children.

**Wide screens** (density `Compact`: tablet, web): the sheet shows **centered** on both axes, max width **480**, still rounded on all 4
corners, scrim as above. Need wider than 480 → switch to `Dialog` or `SideSheet`; don't stretch the sheet.

**`placement`** (`bottom` · `center`): defaults by density as above (Touch → `bottom`, Compact → `center`).
Pass it explicitly when the position should differ from density, e.g. an app keeps Touch (48 controls) but wants a centered sheet on wide screens.
Every placement has max width **480** (including `bottom` in Touch on a wide screen: the sheet sits at the bottom, centered). Web `<BottomSheet placement="center">` · Flutter `showUuBottomSheet(placement:
UuSheetPlacement.center)` · React Native `<UuBottomSheet placement="center">`.

**Keyboard** (app): a sheet with an input floats **12 above the keyboard top** (same rule as the Toast bottom edge §6.6), and the Body
scrolls if space runs out. Tapping a button in the sheet while the keyboard is open registers immediately, without spending one tap to close
the keyboard (RN `keyboardShouldPersistTaps="handled"`).

**A Toast while the sheet is open** floats **above** the scrim and the sheet, per the placement rule in §6.6.

**Draggable sheet** (`Handle=true`): a **32 × 4** handle (`size-8` × `size-1`) `rounded-circle` filled with `border`, centered at
the top of the sheet: from the top, 8 · handle 4 · 8 · Header (the Header drops its 16 top padding, so the sheet only grows by 4). Two stops:
- **`Height=Fit`** — height follows content (like a normal sheet).
- **`Height=Full`** — dragged up: the sheet reaches **12 below the top of the safe area**, still rounded on 4 corners; the Body scrolls, the Header and button group
  stay put.
Dragging down at `Fit` past 1/3 of the height → closes (like the close button); at `Full` → back to `Fit`. Released midway → snaps to the nearest stop.
Without a handle the sheet is not draggable. Web / Flutter: the handle is `role="button"` labelled "Kéo để đổi cỡ"; Enter switches stops.

When `Secondary button` is on in the instance, the two buttons split the row, each `(width − 12) / 2`.

> **In code:** use `flex: 1 1 0` on both buttons, **not** `flex: 1 1 auto`. With an `auto` basis the browser distributes leftover space on top of differing content widths, so two buttons with labels of different lengths end up a few px apart instead of exactly half.

#### `Sheet` — screen template

`390 × 844` · VERTICAL · aligned `MAX` (pushed to the bottom) · FIXED × FIXED

| Layer | Value |
|---|---|
| Scrim | `overlay` (10% black) + `overlay-blur` (16, effect style `overlay-blur`) |
| Wrapper | padding `0/12/12/12` → the sheet is inset 12px on each side **and floats 12 above the bottom** |
| Sheet | `CardSheet` instance (`Navigation=Close`), FILL |
| Bottom | `IOS Home indicator` instance (Transparent=True) |

> `Sheet` is a **screen template, not a product component** — it contains the `IOS Home indicator` from Device elements. Use it for mockups; in code rebuild the scrim + wrapper per the table above and drop the home indicator, since the OS draws it.
>
> `Sheet` exposes exactly **one** prop: `Footer` (INSTANCE_SWAP, default `IOS Home indicator /
> Theme=Default, Transparent=True`) to swap the bottom for another Device element when mocking up
> Android. `Header`, `Slot`, `CTA`, `Navigation`
> live on the `CardSheet` instance; `Secondary button` and `Layout` one level deeper, on the
> `Button group` instance. In code drop `Footer` entirely; the OS draws it.
