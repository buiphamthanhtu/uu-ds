### 6.10b Pagination

A row of **bars** showing the position in a carousel. Not round dots.

**Props**

| Prop | Type | Values |
|---|---|---|
| `Position` | VARIANT | `Begin` · `Middle` · `End` |

**Structure**

```
Pagination        HORIZONTAL · gap 4 · items center · 104 × 2
└─ 🔒Base/Slick × 5   h2 · radius circle
```

| Slick | Width | Background |
|---|---|---|
| Current (`Active=True`) | `size-6` (24) | `background-accent` |
| Others (`Active=False`) | `size-4` (16) | `overlay` |

Total 104 = 24 + 4×16 + 4 gaps×4. `🔒Base/Slick` is locked — don't use it on its own.

**Only THREE positions, not five.** `Position` puts the long bar on slick 1 (`Begin`), 3 (`Middle`) or 5 (`End`). The component does NOT model "page 2 of 5" — it says *at the start, middle or end*. Carousels with more than 5 pages still use exactly these five bars.

WIDTH is the main signal, color only secondary: viewed at an angle or by color-blind users, the position still reads.

> Inactive bars use `overlay` (10% black), not a brand background color: the bars sit under colorful banners; 10% black holds on both light and dark images, while a light tint would sink into the banner's own colors.
