### 6.5 Navigation bar

**Props**

| Prop | Type | Default |
|---|---|---|
| `Content` | SLOT | free slot, does not stretch its child |
| `Back action` | BOOLEAN | `true` |
| `Sub action` | BOOLEAN | `false` |
| `Mini app` | BOOLEAN | `true` — shows/hides `.Mini App Control` |

**Layout**: `430 × 56` · HORIZONTAL · padding `0/12` · gap `12` · FIXED × FIXED · **no background of its own** (transparent, sits on the screen background)

```
[ IconButtonNeutral Solid Inverted=True 48 (chevron-left) ] [ Content slot — FILL ] [ IconButtonAccent Solid Inverted=True 48 ] [ .Mini App Control ]
```

- Back: `IconButtonNeutral` / `Solid` / `Inverted=True` / Base (48) — i.e. `background-surface` fill, `chevron-left` icon `object-primary`
- Content slot: by default holds the text `"Screen"` in style `heading-base`
- Sub action: `IconButtonAccent` / `Solid` / `Inverted=True` / Base (48), hidden by default
- `.Mini App Control`: shown by default; turn it off with the `Mini app` prop when the screen does not run inside Zalo

**`.Mini App Control`** — the mini-app control pill (WeChat/Zalo mini program style):
- `83 × 34` · padding `4/8` · gap `8` · radius `9999` · white background · 1px black border
- Structure: `Icon L (24) | Divider 1×18 | Icon R (24)`
- Variants: `Power` (Off/On) × `Single` (Off/On) × `White` (Off/On) = 6
