# ÚÙ Design system — instructions for AI coding agents

This project uses the `uu-ds` package (UU Design system). Before building UI, read in `node_modules/uu-ds/`:

1. `docs/design-system.md` — the core spec. Read sections 0–3, 5 and 6.0 before the first line of code. Only use components listed in section 5.
2. `docs/components/<name>.md` — one file per component (table in core §6). Read the file of each component you use.
3. `docs/tokens.css` — every value comes from semantic tokens (`var(--background-interactive)`). No hex, no `--color-*`.
4. `docs/icons.md` + `docs/uu-icon-index.json` — the 22 UU icons in the package only make components work; the product's icon set (Lucide, Nucleo…) is registered via `IconProvider`.
5. `docs/product-dna.md` + `docs/dna-template.md` — the product's own style (`DNA.md` at the project root, if any).
6. `docs/ontology.json` — token ↔ component ↔ mode relations. Not here = not decided → ask, don't invent.

After writing, check: `npx uu-ds-check src` (deterministic checker, no AI calls). Fix until critical = 0.

Hover / Pressed go through the built-in state layer — no background, text or font-weight change. UI copy stays Vietnamese. Full docs: https://uucreative.co/uu-ds/
