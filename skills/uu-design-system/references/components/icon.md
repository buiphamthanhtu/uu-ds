### 6.11 Icon

The `Icon` component is an **INSTANCE_SWAP wrapper**; it draws nothing itself. It points at an external icon library (more than 180 component sets listed in `preferredValues`). Icon names follow the Font Awesome convention: `chevron-left`, `chevron-down`, `xmark`.

**Icon boxes used in the system**: `24` (Icon button Large/Base, Text button L/Base suffix, DateInput, Segment item prefix) · `16` (Icon button Small, Small suffix, Dropdown chevron, `.label` tooltip) · `18` only for `.loading` and the Segment item `.suffix` slot. Color always comes from an `object-*` token.

**The glyph is smaller than the box.** UU icons are drawn on an 18 grid with margins, so the actual glyph fills about **60–65% of the box**: `xmark` in a 24 box is only **15.3px** wide, about 10px in a 16 box. This was measured on the Toast close button. It is **a feature, not a bug**: the 24 box keeps the touch target and layout rhythm, the margin keeps thin-stroke icons from crowding text.

> **Without a DNA declaring an icon set, use UU icons only.** Don't swap in Lucide, Phosphor or Font Awesome even "keeping the name and
> size": each set has its own stroke-to-box ratio. Want another set → the product registers the whole set via DNA (4.3), never mixing single icons. Lucide `x` in a 24 box draws a 12px glyph with stroke 2,
> Font Awesome `xmark` fills nearly the whole box — the same "24" but nothing like UU icon's 15px.
> Changing icon set changes the stroke-to-box ratio; there is no way to "keep the exact size".

Getting the right SVG: `download_assets` the node in `uu-icon-index.json` (viewBox `0 0 18 18`, keep
the margin, drop `width`/`height`), or use the file `get_design_context` exports for the screen
being built — that file is already viewBox `0 0 24 24` **with margin**, so it fits a 24 box. Don't crop
the viewBox to the glyph, and don't leave a `width="18"` in the `<svg>` (the icon would render at 18 instead of 24).
