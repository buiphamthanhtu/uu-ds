### 6.6 Toast

**Props**: `Type` (`Neutral` · `Negative` · `Positive` · `Warning`) · `Content` (TEXT) · `Action` (BOOLEAN, default `true`)

**Layout**: `428 × 64` · HORIZONTAL · padding `8/16` · gap `12` · FIXED × HUG · radius `12` (`radius-base`) · shadow `0 4px 12px rgba(0,0,0,0.10)` = `elevation-medium`

```
[ Content — FILL ] [ Text button Neutral Solid Inverted=True ] [ Icon button Neutral Ghost 48 (xmark) ]
```

**Per type**

| Type | Background | Content | Action button | Close button |
|---|---|---|---|---|
| `Neutral` | `background-inverted` | `object-primary-inverted` | `Inverted=True` | `Inverted=True` |
| `Negative` | `background-negative` | **`object-on-negative`** | `Inverted=True` | `Inverted=True` |
| `Positive` | `background-positive` | **`object-on-positive`** | `Inverted=True` | `Inverted=True` |
| `Warning` | `background-warning` | **`object-on-warning`** | `Inverted=False` | `Inverted=False` |

Rule: **the background's lightness decides all three elements at once.** `background-warning` (`yellow-300`) is light, so content, Action button and close button all flip to dark. The other three types are dark, so all three elements are light. No exceptions — a new type follows the same rule.

The Action button is `TextButtonNeutral / Solid / Base` (48, `background-surface` fill when `Inverted=True`); the close button is `IconButtonNeutral / Ghost / Base` — box **48 × 48**, `Icon` **24 × 24**, the `xmark` glyph shows at **15.3px** in the middle (see 6.11). If the X looks almost as large as the 24 box, or only ~11px, a different icon set is in use or the SVG is cropped / has a leftover `width="18"`. Content text uses style `body` (400), not `label`.

**Position on screen**: the Toast floats at the bottom, left / right margin **12** (`gap-3`). The Toast's bottom sits **12** above the highest of three edges:

| Screen has | Toast sits 12 above |
|---|---|
| Nothing at the bottom | bottom of the safe area |
| `BottomBar` (§6.22) | the bar's **top edge**, never over the nav items |
| Open keyboard | the keyboard's **top edge** |

`BottomBar` reports its position to the Toast layer itself; the app does not pass heights by hand. An app with its own bottom bar (not `BottomBar`) attaches that reporting mechanism to the bar's view: React Native `const edge = useUuBottomEdgeReporter()` then `<View ref={edge.ref} onLayout={edge.onLayout}>`. `CardPushNotification` (§6.31) is at the top and does not follow this rule.

**Measured contrast** (WCAG AA, 4.5 threshold for body text): Neutral 21.00 · Negative 4.83 · Positive 5.02 · Warning 15.93. All four types pass.


**Screen readers**: a Toast is announced when it appears, without focus. Urgency per `Type`:

| Type | Level | Web | React Native | Flutter |
|---|---|---|---|---|
| `Negative` | announce now, interrupting the current sentence | `role="alert"` | `accessibilityRole="alert"` · live region `assertive` · iOS announce not queued | live region |
| `Neutral` · `Positive` · `Warning` | wait for the current sentence to finish | `role="status"` | live region `polite` · iOS announce queued (`queue`) | live region |

iOS has no live regions, so the React Native version calls `AccessibilityInfo.announceForAccessibilityWithOptions` each time a Toast appears.
Flutter uses the `SnackBar` live region on both platforms; Flutter cannot yet set urgency on apps (web only), so all four
types are announced the same way. Not tested on real devices with VoiceOver / TalkBack yet.
