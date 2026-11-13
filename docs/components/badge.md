### 6.14 Badge (`Badge`)

Pill-shaped status label, not clickable. The only prop is **`Tone`** = `Neutral` · `Success` · `Warning` · `Error` (4 variants).

- HORIZONTAL · height **24** (`size-6`) · left padding **4** (`gap-1`), right **8** (`gap-2`) · gap **4** (`gap-1`) · HUG to the text · radius `rounded-circle`.
- **Icon** before the text, **always shown**: size **16** (`size-4`), `fill` style, same color as the text. The icon follows the tone and cannot be changed: Neutral `circle-info` · Success `circle-check` · Warning `circle-warning` · Error `triangle-warning`.
- Text **`title-sm`** (13/20, 600), one line, no wrapping. No other sizes.

| Tone | Background | Text |
|---|---|---|
| Neutral | `background-inverted` | `object-primary-inverted` |
| Success | `background-positive` | `object-on-positive` |
| Warning | `background-warning` | `object-on-warning` |
| Error | `background-negative` | `object-on-negative` |

Same rule as Toast: `background-{status}` only pairs with `object-on-{status}`. No states (no hover/pressed/disabled) — this is not a control. The icon is only a secondary signal; the text must carry the meaning on its own; on the web the icon is `aria-hidden`. Not yet: sizes other than 24, turning the icon off, a brand (interactive) tone.
