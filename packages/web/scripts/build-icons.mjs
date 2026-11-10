// Gom src/icons/svg/*.svg thành các bundle JSON theo category để Icon component lazy-load.
// Chạy trước `storybook dev/build` (npm run icons). Output bị gitignore — src/icons/svg mới là nguồn.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const svgDir = join(root, 'src', 'icons', 'svg');
const outDir = join(root, 'src', 'icons', 'generated');
const manifest = JSON.parse(readFileSync(join(root, 'src', 'icons', 'manifest.json'), 'utf8'));

if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const files = new Set(readdirSync(svgDir));
const bundles = {};
let count = 0;
for (const [name, meta] of Object.entries(manifest.icons)) {
  const cat = meta.category || 'uncategorized';
  bundles[cat] ??= {};
  const entry = {};
  if (files.has(`${name}.svg`)) entry.outline = readFileSync(join(svgDir, `${name}.svg`), 'utf8');
  if (files.has(`${name}-fill.svg`)) entry.fill = readFileSync(join(svgDir, `${name}-fill.svg`), 'utf8');
  if (entry.outline || entry.fill) { bundles[cat][name] = entry; count++; }
}
const slim = {};
for (const [name, meta] of Object.entries(manifest.icons)) slim[name] = [meta.category, files.has(`${name}.svg`) ? 1 : 0, files.has(`${name}-fill.svg`) ? 1 : 0];
writeFileSync(join(outDir, 'index.json'), JSON.stringify(slim));
for (const [cat, icons] of Object.entries(bundles)) {
  writeFileSync(join(outDir, `${cat}.json`), JSON.stringify(icons));
}
console.log(`icons: ${count} tên → ${Object.keys(bundles).length} bundle trong src/icons/generated/`);
