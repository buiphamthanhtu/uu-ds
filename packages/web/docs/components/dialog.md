### 6.10 Dialog

Two components, the same model as Bottom sheet:

| Component | What it is |
|---|---|
| `CardDialog` | The panel only — **2 variants** `Banner=False` · `Banner=True` (replaces the old `.base/dialog`, removed) |
| `Dialog` | **Screen template** 390 × 844 — scrim + panel + home indicator |

**`CardDialog` props**

| Prop | Type | Default |
|---|---|---|
| `Banner` | VARIANT | **`False`** · `True` |
| `Slot` | SLOT | empty, does not stretch its child |
| `Close button` | BOOLEAN | `true` |
| `Button group` | BOOLEAN | `true` |

**Panel**: `384` wide standalone · radius `24` (`rounded-2xl`) on all four corners · background `background-surface` · VERTICAL · FIXED × HUG · gap 0

```
CardDialog · Banner=False   V · g0 · r24 · background-surface
├─ Header            H · p 16/16/0/16 · g16 · FILL × HUG · RIGHT-aligned
│  └─ Close          Icon button - Neutral / Outline / Small (32) · border 2px · xmark 16
└─ Body              V · p 12/16/16/16 · g12 · FILL × HUG
   ├─ Slot           FILL × HUG
   └─ Button group   instance · Layout=Horizontal · Secondary button=false
```

**`Banner=True`** — a dialog with an image (feature intro, gift, promotion). The image is **content** and needs `alt`.

```
CardDialog · Banner=True    V · g0 · r24 · background-surface · 384 × HUG
├─ Header            384 × 216 · no padding
│  ├─ Image          384 × 216 (**16:9 — the only ratio**) · FILL · the panel clips it to the 24 radius at the two top corners
│  └─ Close          ABSOLUTE · 16 from the right · 16 from the top · IconButtonNeutral / **Solid** / Small (32)
└─ Body              V · p **16** on all sides · g12
   ├─ Slot
   └─ Button group
```

The close button over the image is **Solid** (`background-inverted` fill) so it reads on any image — an outlined button would sink.
`Close button=false` only hides the button; the image stays. Any ratio other than 16:9 is off spec.

**Two differences from Bottom sheet** — don't mix them up:

| | Bottom sheet | Dialog |
|---|---|---|
| Position on screen | at the bottom | **vertically centered** |
| Title | has a `Header` prop (TEXT) in the header | **no title** — all content goes in `Slot` |
| Button group | `ButtonGroup` (6.9) | `ButtonGroup` (6.9) |

The Dialog header only holds the close button, right-aligned (`primaryAxisAlignItems: MAX`). If a title is needed, put it in `Slot`.

**Prop mapping between the two components** (different, easy to misremember):

| Function | `CardSheet` | `CardDialog` |
|---|---|---|
| Content | `Slot` | `Slot` |
| Title | `Header` (TEXT) | — |
| Show/hide button group | `CTA` | `Button group` |
| Show/hide close button | — (shown, unless `Back=true`) | `Close button` |
| Back button (child sheet) | `Back` — replaces the close button | — (Dialogs don't stack) |
| Secondary button, direction | on the `Button group` instance | on the `Button group` instance |

**Scrim layer** same as Bottom sheet: fill `overlay` (10% black, alpha inside the token) + `overlay-blur` (16), the panel is inset `gap-3` (12) on each side → 366 wide on a 390 frame. Don't multiply extra opacity onto the fill.

`Dialog` contains an `IOS Home indicator`, so it is also a screen template. In code build from `CardDialog` and make the scrim yourself.
