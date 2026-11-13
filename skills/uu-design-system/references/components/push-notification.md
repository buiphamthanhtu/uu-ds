### 6.31 In-app push notification (`CardPushNotification`)

A card sliding down from the top of the screen, reporting **something from outside** (order status changed, new gift, message). It mimics
the OS push style but is drawn by the **app** — real iOS/Android pushes are drawn by the OS and are not part of the DS.
**Props**: `Title` · `Content` (TEXT) · `Image` (BOOLEAN). 1 variant.

```
CardPushNotification   H · g8 · p 8/16/8/8 · radius-lg · background-surface · elevation-medium · TOP-aligned
├─ Image               48 (size-12) · radius-sm · source image (partner logo, product photo) — hideable
└─ Text                V · g2 (gap-0-5) · FILL
   ├─ Title            body · 600 · object-primary · max 2 lines
   └─ Content          body · object-primary · max 2 lines
```

No type, no buttons: **tap the whole card** to open; **swipe up** to dismiss; auto-hides after **5 seconds** (the countdown pauses while
touched / hovered). One card at a time — a new card replaces the old one. Template `[Screen]PushNotification`: the card sits 8 below the top of the safe area,
12 margin on both sides. Web: `role="status"`, `aria-live="polite"`.

**Unlike `Toast` (§6.6)**: a Toast reports **the result of what the user just did**, at the bottom, with a `Type`. A push reports something from
outside, at the top, with no type.

**Desktop**: the card is in the **top-right corner**, **16** (`gap-4`) from the top and right edges, width **360** (`size-90`). Auto-hides after 5 seconds,
the countdown pauses on hover; no swipe — the countdown restarts when the pointer leaves.

**There is no** close button (swipe up to dismiss), received time, or stacking of several cards (one card at a time, a new card replaces the old one).
