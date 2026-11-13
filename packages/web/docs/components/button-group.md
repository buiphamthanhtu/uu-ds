### 6.9 ButtonGroup

Shared component set for a primary/secondary button pair. Used by both Dialog and Bottom sheet.

**Props**: `Layout` (VARIANT: `Horizontal` · `Vertical`) × `Tone` (VARIANT: `Default` · `Danger`) · `Secondary button` (BOOLEAN, default `true`). **4 variants.**

| Layout | Structure | Order | Size |
|---|---|---|---|
| `Horizontal` | H · gap 12 · FIXED × HUG | **secondary (Outline) left, primary (Solid) right** | both `FILL` + `layoutGrow: 1` → equal split |
| `Vertical` | V · gap 12 · FIXED × HUG | **primary (Solid) on top, secondary (Outline) below** | both `FILL` horizontally |

Buttons are `Text button - Accent` size `Large` (56). `min-width` 56.

**`Tone=Danger`** — the button group of a dialog / sheet **confirming a destructive action** (delete, cancel order): the primary button becomes **`TextButtonDanger` Solid** Large; the secondary stays (`TextButtonAccent` Outline, usually "Huỷ" / "Giữ lại"). Order and geometry unchanged. Web: `<ButtonGroup tone="danger">`; Flutter: `UuButtonGroup(tone: UuButtonGroupTone.danger)`. Use it instead of arranging two buttons yourself.

Note the order flips between layouts: horizontal puts the primary on the **right**, vertical puts it on **top**. Both place the primary where the thumb reaches most easily.
