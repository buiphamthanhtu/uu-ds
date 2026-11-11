#!/usr/bin/env node
// Bộ chấm tất định cho code dùng UU DS (web: tsx/ts/jsx/js/css/html).
// Học từ internal/vibe-tests/src/universal-eval.ts của facebook/astryx (MIT), thu hẹp về sáu ràng buộc của UU DS.
//
//   node scripts/vibe-eval.mjs <thư mục hoặc file> [--json out.json] [--md out.md] [--pkg <gốc package uu-ds>] [--allow-px 18,187]
//   Miễn trừ: `/* vibe-allow: <rule> — vì sao */` gần dòng vi phạm, hoặc `vibe-allow-file:` cho cả file.
//   npm run vibe:self   → chấm chính src/components + src/styles (phải 0 lỗi critical)
//   App đã cài gói uu-ds: `npx uu-ds-check src` (nguồn sự thật = gói đã cài); `--strict` → thoát mã 1 khi có critical (dùng cho CI).
//
// Không gọi AI, không cần mạng. Chấm cùng một luật cho mọi đầu vào; điểm 0–100 theo từng chiều và tổng.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');

// ---------- tham số ----------
const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(name);
  return i === -1 ? def : argv[i + 1];
};
const VALUED = ['--json', '--md', '--pkg', '--allow-px'];
const target = argv.find((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]));
if (!target) {
  console.error('Cần đường dẫn: npx uu-ds-check <dir|file> [--strict] [--json f] [--md f] [--allow-px a,b]');
  process.exit(2);
}
const pkgRoot = path.resolve(opt('--pkg', REPO));
const allowPx = new Set((opt('--allow-px', '') || '').split(',').filter(Boolean).map(Number));
const selfMode = argv.includes('--self');
const strict = selfMode || argv.includes('--strict');

// ---------- nguồn sự thật: tokens.css, exports, icon index ----------
const tokensCss = fs.readFileSync(path.join(pkgRoot, 'src/tokens/tokens.css'), 'utf8');
const cssVars = new Set([...tokensCss.matchAll(/--([A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));
const pxAllowed = new Set([...tokensCss.matchAll(/:\s*(-?[0-9.]+)px/g)].map((m) => Number(m[1])));
// Token kích thước web xuất rem (spec §4) — số px tương đương vẫn thuộc thang.
for (const m of tokensCss.matchAll(/--[\w-]+:\s*(-?[0-9.]+)rem/g)) pxAllowed.add(Number(m[1]) * 16);
[0, 1, 1.5, 2, 3, 18].forEach((v) => pxAllowed.add(v)); // 18 = hộp icon .loading theo spec
allowPx.forEach((v) => pxAllowed.add(v));
const dlsClasses = new Set([...tokensCss.matchAll(/\.(uu-[A-Za-z0-9_-]+)/g)].map((m) => m[1]));
try {
  const base = fs.readFileSync(path.join(pkgRoot, 'src/styles/base.css'), 'utf8');
  [...base.matchAll(/\.(uu-[A-Za-z0-9_-]+)/g)].forEach((m) => dlsClasses.add(m[1]));
} catch {}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'build', '.git', 'storybook-static', 'generated', 'svg'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const exportedNames = new Set();
const valueExports = new Set();
for (const f of walk(path.join(pkgRoot, 'src/components')).concat(walk(path.join(pkgRoot, 'src/icons')))) {
  if (!/\.(tsx?|jsx?)$/.test(f) || /\.stories\./.test(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/^export\s+(function|const|class|type|interface)\s+([A-Za-z0-9_]+)/gm)) {
    exportedNames.add(m[2]);
    if (!/type|interface/.test(m[1])) valueExports.add(m[2]);
  }
  for (const m of src.matchAll(/^export\s+\{([^}]+)\}/gm))
    m[1].split(',').forEach((s) => {
      const n = s.trim().split(/\s+as\s+/).pop();
      if (n) exportedNames.add(n);
    });
}
// Tên component UU DS (PascalCase) để phát hiện tag bịa kiểu <TextButtonPrimary>
const componentNames = new Set([...valueExports].filter((n) => /^[A-Z]/.test(n)));

let iconNames = new Set();
for (const cand of ['src/icons/generated/index.json', 'src/icons/manifest.json']) {
  const p = path.join(pkgRoot, cand);
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    iconNames = new Set(Array.isArray(j) ? j.map((x) => x.name ?? x) : Object.keys(j.icons ?? j));
    if (iconNames.size) break;
  }
}
if (!iconNames.size) {
  const d = path.join(pkgRoot, 'src/icons/svg');
  if (fs.existsSync(d)) iconNames = new Set(fs.readdirSync(d).map((f) => f.replace(/(-fill)?\.svg$/, '')));
}

// ---------- luật ----------
// severity: critical 15 · moderate 5 · minor 2 (trừ vào chiều tương ứng, chiều tối thiểu 0)
const DIMENSIONS = ['mau', 'brand', 'tuong-tac', 'thang', 'pham-vi', 'icon', 'noi-dung'];
const PENALTY = { critical: 15, moderate: 5, minor: 2 };
const findings = [];
const add = (file, line, dim, rule, severity, detail, example) =>
  findings.push({ file: path.relative(process.cwd(), file), line, dimension: dim, rule, severity, detail, example: (example || '').replace(/\s+/g, ' ').trim().slice(0, 160) });

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/^\s*\/\/.*$/gm, '');
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;

const OTHER_UI = /^(antd|@ant-design\/[a-z-]+|@mui\/[a-z-]+|@chakra-ui\/[a-z-]+|react-bootstrap|bootstrap|@radix-ui\/[a-z-]+|@headlessui\/[a-z-]+|@mantine\/[a-z-]+|@nextui-org\/[a-z-]+|@heroui\/[a-z-]+|primereact|element-plus|vant|@shadcn\/[a-z-]+|daisyui)$/;
const OTHER_ICONS = /^(lucide-react|react-icons(\/.*)?|@fortawesome\/[a-z-]+|@tabler\/icons-react|@phosphor-icons\/[a-z-]+|phosphor-react|@heroicons\/[a-z-]+|@mui\/icons-material|@ant-design\/icons|@iconify\/[a-z-]+|feather-icons|react-feather|iconsax-react)$/;
const OTHER_STYLE = /^(tailwindcss|styled-components|@emotion\/[a-z-]+|@stitches\/[a-z-]+|@vanilla-extract\/[a-z-]+)$/;

function checkColors(file, src, isCss) {
  const s = stripComments(src);
  // hex (bỏ qua chuỗi data:, id kiểu #root trong querySelector, và ký hiệu #1 trong chữ)
  for (const m of s.matchAll(/(?<![\w&])#([0-9A-Fa-f]{3,8})\b/g)) {
    const before = s.slice(Math.max(0, m.index - 24), m.index);
    if (/data:image|querySelector|getElementById|href=|url\(|from\s*\(|^\s*import/.test(before)) continue;
    if (!isCss && !/(color|background|border|fill|stroke|shadow|outline|['"`:])\s*[:=]?\s*['"`]?$/i.test(before) && !/['"`]$/.test(before)) continue;
    add(file, lineOf(s, m.index), 'mau', 'hex', 'critical', 'Màu hex viết thẳng — phải dùng token semantic (var(--background-*), var(--object-*), var(--border-*)).', s.slice(Math.max(m.index - 30, s.lastIndexOf('\n', m.index) + 1), m.index + 12));
  }
  for (const m of s.matchAll(/\b(rgba?|hsla?|oklch|lab)\(\s*[0-9.]/g))
    add(file, lineOf(s, m.index), 'mau', 'color-literal', 'critical', `Màu ${m[1]}() viết thẳng — cần token semantic; màu mờ compose bằng color-mix từ token.`, s.slice(m.index, m.index + 40));
  for (const m of s.matchAll(/var\(--color-([A-Za-z0-9-]+)\)/g))
    add(file, lineOf(s, m.index), 'mau', 'primitive-in-component', 'critical', `Dùng primitive --color-${m[1]} trong component — chỉ token semantic; thiếu vai thì thêm token vào UU DS.`, m[0]);
  for (const m of s.matchAll(/var\(--([A-Za-z0-9-]+)/g)) {
    const v = m[1];
    if (v.startsWith('color-') || cssVars.has(v)) continue;
    // biến cục bộ do file tự khai báo thì được
    if (new RegExp(`--${v}\\s*:`).test(s)) continue;
    add(file, lineOf(s, m.index), 'mau', 'unknown-var', 'critical', `Biến --${v} không có trong tokens.css (bịa tên token).`, m[0]);
  }
  if (!isCss) {
    for (const m of s.matchAll(/\b(color|backgroundColor|borderColor|fill|stroke)\s*:\s*['"](white|black|red|blue|green|gray|grey|orange|yellow|transparent)['"]/g))
      if (m[2] !== 'transparent') add(file, lineOf(s, m.index), 'mau', 'named-color', 'critical', `Màu tên "${m[2]}" viết thẳng — cần token semantic.`, m[0]);
  } else {
    for (const m of s.matchAll(/:\s*(white|black|red|blue|green|gray|grey|orange|yellow)\s*(;|!)/g))
      add(file, lineOf(s, m.index), 'mau', 'named-color', 'critical', `Màu tên "${m[1]}" viết thẳng — cần token semantic.`, m[0]);
  }
}

function checkBrand(file, src) {
  const s = stripComments(src);
  for (const m of s.matchAll(/\b(brand|theme)\s*[!=]==?\s*['"][\w-]+['"]/gi))
    add(file, lineOf(s, m.index), 'brand', 'brand-branch', 'critical', 'Component rẽ nhánh theo brand — brand chỉ đổi bằng data-theme trên <html>, component không được biết mình ở brand nào.', m[0]);
  for (const m of s.matchAll(/\[data-theme(?:=['"]?[\w-]+['"]?)?\]\s*[.#\w[][^{]*\{/g))
    add(file, lineOf(s, m.index), 'brand', 'theme-selector', 'moderate', 'CSS chọn theo [data-theme] trong component — hãy dùng token semantic đổi theo brand thay vì rule riêng.', m[0]);
}

function checkStateLayer(file, src) {
  if (!/\.css$/.test(file)) {
    const s = stripComments(src);
    for (const m of s.matchAll(/onMouse(Enter|Over|Down)\s*=\s*\{[^}]*(setBackground|setColor|background|color)\s*[:(]/g))
      add(file, lineOf(s, m.index), 'tuong-tac', 'js-hover-color', 'critical', 'Đổi màu bằng JS khi hover/pressed — hover/pressed phải là state layer ::after currentColor, không đổi nền/chữ.', m[0]);
    return;
  }
  const s = stripComments(src);
  // tách từng rule
  for (const m of s.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    const body = m[2];
    const isState = /:hover|:active|\[data-state=['"]?(hover|pressed)/.test(sel);
    if (!isState) continue;
    if (/::after|::before/.test(sel)) {
      // lớp phủ: chỉ nên đổi opacity
      if (/\b(background|background-color)\s*:\s*(?!currentColor)/.test(body) && !/currentColor|var\(--object-/.test(body))
        add(file, lineOf(s, m.index), 'tuong-tac', 'state-layer-fill', 'moderate', 'Lớp phủ hover/pressed không dùng currentColor (hoặc object-* theo spec).', body);
      continue;
    }
    for (const prop of ['background', 'background-color', 'color', 'font-weight']) {
      const re = new RegExp(`(^|[;\\s])${prop}\\s*:`);
      if (re.test(body))
        add(file, lineOf(s, m.index), 'tuong-tac', 'hover-changes-' + prop, 'critical', `Rule hover/pressed đổi ${prop} — phải đi qua state layer ::after (opacity 5/10 nền sáng, 20/40 nền tối), không đổi nền/chữ/weight.`, `${sel} { ${body.trim().slice(0, 80)} }`);
    }
    if (/\bopacity\s*:/.test(body) && !/::after|::before/.test(sel))
      add(file, lineOf(s, m.index), 'tuong-tac', 'hover-opacity-on-element', 'moderate', 'Giảm opacity cả phần tử khi hover/pressed — state layer là lớp ::after, phần tử giữ nguyên.', sel);
  }
}

function checkScale(file, src) {
  const s = stripComments(src);
  const isCss = /\.css$/.test(file);
  const re = isCss ? /:\s*([^;{}]*?)(;|\})/g : /(?:style|sx)\s*=\s*\{\{([^}]*)\}\}/g;
  for (const m of s.matchAll(re)) {
    const chunk = m[1];
    for (const px of chunk.matchAll(/(-?[0-9]*\.?[0-9]+)px/g)) {
      const v = Math.abs(Number(px[1]));
      if (pxAllowed.has(v)) continue;
      add(file, lineOf(s, m.index), 'thang', 'px-off-scale', 'minor', `${v}px không thuộc thang UU DS (gap-* bước 4, radius-*, size-*). Nếu là kích thước component hug thì bỏ width.`, chunk.trim().slice(0, 80));
    }
  }
  // Density (spec §4.1): kích thước control gõ cứng thì không co ở Compact.
  if (isCss) for (const m of s.matchAll(/(?<![\w-])((?:min-|max-)?(?:height|width))\s*:\s*(24|32|40|48|56)px/g))
    add(file, lineOf(s, m.index), 'thang', 'density-hardcode', 'moderate', `${m[1]}: ${m[2]}px gõ cứng — dùng biến density (--control-height-*, --field-height, --selection-size…) để Compact co theo.`, m[0]);
  // Chữ trong component đọc --text-<style>-* (đổi theo density), không đọc thẳng thang font. display-* không có density.
  for (const m of s.matchAll(/var\(--font-(size|height)-(?!4xl|5xl)[\w-]+\)/g))
    add(file, lineOf(s, m.index), 'thang', 'text-primitive', 'moderate', `${m[0]} trong component — dùng var(--text-<style>-font-size / -line-height) để chữ đổi theo density.`, m[0]);
  for (const m of s.matchAll(/font-?[Ff]amily\s*:\s*['"]?([^;}"',]+)/g)) {
    const v = m[1];
    if (/var\(--font-family-/.test(v)) continue;
    if (/SF Pro|Inter|Roboto|Helvetica|Arial|Segoe|Be Vietnam|Nunito|Montserrat/i.test(v))
      add(file, lineOf(s, m.index), 'thang', 'font-embedded', 'moderate', 'Font body là font hệ thống (var(--font-family-body)); không nhúng SF Pro/Inter/Roboto…', m[0]);
  }
  for (const m of s.matchAll(/@font-face|fonts\.googleapis\.com\/css[^"')]*family=(?!Bungee)/g))
    add(file, lineOf(s, m.index), 'thang', 'font-embedded', 'moderate', 'Nhúng font ngoài — chỉ Bungee cho display-*, body dùng font hệ thống.', m[0]);
  for (const m of s.matchAll(/blur\(\s*\d+(?:\.\d+)?px\s*\)/g))
    add(file, lineOf(s, m.index), 'thang', 'blur-hardcode', 'moderate', 'Blur gõ tay — dùng token vai trò var(--overlay-blur) / var(--surface-blur-*) (spec 2.4).', m[0]);
  for (const m of s.matchAll(/!important/g))
    add(file, lineOf(s, m.index), 'thang', 'important', 'minor', '!important — dấu hiệu đang ghi đè style của component thay vì dùng prop/token.', m[0]);
  if (!isCss) {
    for (const m of s.matchAll(/font-?[Ww]eight\s*:\s*['"]?(bold|[5-9]00)/g))
      add(file, lineOf(s, m.index), 'thang', 'font-weight-adhoc', 'minor', 'Weight đặt tay — dùng class .text-* (label 600, title 700) hoặc mode Active của component.', m[0]);
  }
}

function checkScope(file, src, localDefs) {
  if (/\.css$/.test(file)) return;
  const s = stripComments(src);
  for (const m of s.matchAll(/import\s+(?:type\s+)?(?:\{([^}]*)\}|\*\s+as\s+\w+|(\w+))?\s*(?:,\s*\{([^}]*)\})?\s*from\s*['"]([^'"]+)['"]/g)) {
    const mod = m[4];
    const named = [m[1], m[3]].filter(Boolean).join(',').split(',').map((x) => x.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0]).filter(Boolean);
    if (OTHER_UI.test(mod)) add(file, lineOf(s, m.index), 'pham-vi', 'other-ui-lib', 'critical', `Import thư viện UI khác (${mod}) — chỉ component UU DS ở mục 5 của spec.`, m[0]);
    else if (OTHER_ICONS.test(mod)) add(file, lineOf(s, m.index), 'icon', 'other-icon-lib', 'critical', `Import bộ icon khác (${mod}) — icon chỉ từ UU icon qua <Icon name>.`, m[0]);
    else if (OTHER_STYLE.test(mod)) add(file, lineOf(s, m.index), 'pham-vi', 'other-style-lib', 'moderate', `Dùng ${mod} — UU DS là CSS thuần trên tokens.css; Tailwind chỉ khi project đã dùng, qua tailwind.js.`, m[0]);
    if (mod === 'uu-ds' || /(^|\/)components(\/index)?$|\/components\/[A-Za-z]+\/[A-Za-z]+$|\/icons(\/Icon)?$/.test(mod) && !mod.startsWith('.')) {
      for (const n of named)
        if (!exportedNames.has(n)) add(file, lineOf(s, m.index), 'pham-vi', 'hallucinated-export', 'critical', `"${n}" không có trong export của uu-ds — component/hàm bịa.`, m[0]);
    } else if (mod.startsWith('.') && /components|icons/.test(mod)) {
      for (const n of named)
        if (!exportedNames.has(n) && !localDefs.has(n)) add(file, lineOf(s, m.index), 'pham-vi', 'hallucinated-export', 'critical', `"${n}" không có trong export của uu-ds.`, m[0]);
    }
  }
  // Tag PascalCase có tiền tố giống UU DS nhưng không tồn tại
  for (const m of s.matchAll(/<((?:TextButton|IconButton|Toggle|Segment|Text(?:Input|Area)|OTP|Date|Dropdown|Checkbox|Radio|Navigation|Pagination|Toast|ButtonGroup|Bottom|Sheet|Dialog|Spinner|Icon|Field|Table|KPI|Breadcrumb|SideNav|SideSheet|Popover|Tooltip|CardSheet|Uu|Dls)[A-Za-z0-9]*)\b(?=[\s>/])/g)) {
    const n = m[1];
    if (componentNames.has(n) || localDefs.has(n)) continue;
    if (/(Props|State|Type|Ref|Handle|Element|Options|Config|Item)$/.test(n)) continue; // vị trí generic TS, không phải JSX
    if (/[\w,:(<]\s*$/.test(s.slice(Math.max(0, m.index - 12), m.index)) && !/(return|\?|=>|\(|\{)\s*$/.test(s.slice(Math.max(0, m.index - 12), m.index))) continue;
    add(file, lineOf(s, m.index), 'pham-vi', 'hallucinated-component', 'critical', `<${n}> không tồn tại trong UU DS (gần giống tên thật không phải là tên thật).`, m[0]);
  }
  // Prop bịa trên component thật (kiểm vài prop hay bị bịa)
  for (const m of s.matchAll(/<(TextButton(?:Accent|Neutral|Danger)?|IconButton(?:Accent|Neutral)?)\b([^>]*)>/g)) {
    const props = m[2];
    for (const bad of props.matchAll(/\b(variant|color|primary|secondary|outlined|loading|isLoading|fullWidth|block|rounded)\s*=/g))
      add(file, lineOf(s, m.index), 'pham-vi', 'hallucinated-prop', 'critical', `Prop "${bad[1]}" không có trên ${m[1]} — prop thật: tone (accent|neutral|danger), type (solid|outline|ghost|inverted), size (large|base|small), state (default|loading|disabled).`, m[0].slice(0, 100));
  }
}

function checkIcons(file, src, localDefs) {
  if (/\.css$/.test(file)) return;
  const s = stripComments(src);
  for (const m of s.matchAll(/<Icon\b([^>]*)>/g)) {
    const props = m[1];
    const name = props.match(/\bname\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*['"]([^'"]+)['"]\s*\})/);
    if (name) {
      const n = name[1] ?? name[2] ?? name[3];
      if (iconNames.size && !iconNames.has(n)) add(file, lineOf(s, m.index), 'icon', 'unknown-icon', 'critical', `Icon "${n}" không có trong bộ UU icon (uu-icon-index) — tên gần giống không phải cùng icon.`, m[0]);
    }
    const variant = props.match(/\bvariant\s*=\s*(?:"([^"]+)"|'([^']+)')/);
    if (variant && !['outline', 'fill'].includes(variant[1] ?? variant[2])) add(file, lineOf(s, m.index), 'icon', 'bad-variant', 'critical', 'variant chỉ có outline | fill.', m[0]);
    const size = props.match(/\bsize\s*=\s*\{?\s*(\d+)/);
    if (size && !['16', '18', '20', '24'].includes(size[1])) add(file, lineOf(s, m.index), 'icon', 'bad-size', 'moderate', 'Hộp icon chỉ 16 · 18 · 20 · 24.', m[0]);
  }
  // Prefix/suffix icon theo tên chuỗi trên nút, field
  for (const m of s.matchAll(/\b(prefix|suffix|icon|leadingIcon|trailingIcon)\s*=\s*(?:"([a-z0-9-]+)"|'([a-z0-9-]+)')/g)) {
    const n = m[2] ?? m[3];
    if (iconNames.size && /-|^[a-z]+$/.test(n) && !iconNames.has(n) && n.length > 2)
      add(file, lineOf(s, m.index), 'icon', 'unknown-icon', 'critical', `Icon "${n}" không có trong bộ UU icon (uu-icon-index).`, m[0]);
  }
  // Tự vẽ icon
  for (const m of s.matchAll(/<svg\b[^>]*>[\s\S]{0,600}?<(path|polyline|polygon|circle|line)\b/g)) {
    const before = s.slice(Math.max(0, m.index - 200), m.index);
    if (/uu-spinner|aria-hidden.*decor/.test(before)) continue;
    add(file, lineOf(s, m.index), 'icon', 'inline-svg', 'critical', 'Tự vẽ SVG trong JSX — icon phải lấy từ UU icon qua <Icon name>.', m[0].slice(0, 80));
  }
  for (const m of s.matchAll(/[\w-]+-(white|black|red|blue|active|disabled|hover)\.svg/g))
    add(file, lineOf(s, m.index), 'icon', 'icon-name-carries-state', 'moderate', 'Tên file icon mang màu/trạng thái — một icon, tô bằng token object-* của chỗ đặt.', m[0]);
}

function checkContent(file, src) {
  if (/\.css$/.test(file)) return;
  const s = stripComments(src);
  // chỉ xét chuỗi có chữ tiếng Việt hoặc chữ hiển thị trong JSX/text props
  const texts = [];
  for (const m of s.matchAll(/>([^<>{}]{3,})</g)) texts.push([m.index, m[1]]);
  for (const m of s.matchAll(/(?:label|title|placeholder|hint|message|description|children|text|helperText|errorMessage)\s*=\s*(?:"([^"]{3,})"|'([^']{3,})'|\{\s*['"`]([^'"`]{3,})['"`]\s*\})/g)) texts.push([m.index, m[1] ?? m[2] ?? m[3]]);
  for (const [idx, t] of texts) {
    const line = lineOf(s, idx);
    if (/!\s*$/.test(t.trim()) || /!\s/.test(t)) add(file, line, 'noi-dung', 'exclamation', 'minor', 'Không dùng dấu chấm than trong UI (style guide nội dung).', t);
    if (/\b\d{1,3}(,\d{3})+\b/.test(t)) add(file, line, 'noi-dung', 'thousands-comma', 'minor', 'Phân cách nghìn bằng dấu chấm: 150.000, không phải 150,000.', t);
    if (/\b(VND|VNĐ|vnd)\b|\d\s*đ\b/.test(t)) add(file, line, 'noi-dung', 'currency', 'minor', 'Tiền viết "150.000 ₫" (ký hiệu ₫, cách một khoảng), không VND/đ.', t);
    if (/\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/\d{2}\b(?!\d)/.test(t)) add(file, line, 'noi-dung', 'date-format', 'minor', 'Ngày hiển thị DD/MM/YYYY.', t);
    if (/\b\d{1,2}\s?(AM|PM|am|pm)\b/.test(t)) add(file, line, 'noi-dung', 'time-format', 'minor', 'Giờ 24h dạng 14:30, không AM/PM.', t);
    if (/\b(Bạn|bạn)\b.*\b(Anh|anh|Chị|chị|Quý khách|quý khách|Mình|mình|Tôi|tôi)\b/.test(t) || /\b(Quý khách|quý khách)\b/.test(t)) add(file, line, 'noi-dung', 'address-form', 'minor', 'Gọi người dùng là "bạn", app không xưng; không "quý khách".', t);
    if (/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){2,}$/.test(t.trim())) add(file, line, 'noi-dung', 'title-case', 'minor', 'Sentence case: chỉ viết hoa chữ đầu (trừ tên riêng).', t);
  }
}

// ---------- chạy ----------
const stat = fs.statSync(target);
const files = (stat.isDirectory() ? walk(target) : [target]).filter((f) => /\.(tsx?|jsx?|css|html|vue|svelte)$/.test(f) && !/\.d\.ts$/.test(f) && !/\.stories\./.test(f));
if (!files.length) {
  console.error('Không có file web nào để chấm ở', target);
  process.exit(2);
}
const localDefs = new Set();
const sources = new Map();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  sources.set(f, src);
  for (const m of src.matchAll(/^(?:export\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/gm)) localDefs.add(m[1]);
}
for (const [f, src] of sources) {
  const isCss = /\.css$/.test(f);
  checkColors(f, src, isCss);
  checkBrand(f, src);
  checkStateLayer(f, src);
  checkScale(f, src);
  checkScope(f, src, localDefs);
  checkIcons(f, src, localDefs);
  checkContent(f, src);
}

// Miễn trừ có lý do: `/* vibe-allow: <rule> — vì sao */` đặt NGAY TRÊN (hoặc cùng) dòng vi phạm.
// Chỉ dùng khi bản vẽ bản thiết kế vẽ đúng như vậy; ghi rõ node để người sau tra được.
{
  const lines = new Map();
  for (const [f, src] of sources) lines.set(path.relative(process.cwd(), f), src.split('\n'));
  for (let i = findings.length - 1; i >= 0; i--) {
    const fd = findings[i];
    const ls = lines.get(fd.file);
    if (!ls) continue;
    const near = ls.slice(Math.max(0, fd.line - 5), fd.line + 3).join('\n');
    const re = new RegExp(`vibe-allow(-file)?:\\s*${fd.rule}\\b`);
    if (re.test(near) || new RegExp(`vibe-allow-file:\\s*${fd.rule}\\b`).test(ls.join('\n'))) findings.splice(i, 1);
  }
}

// component UU DS đã dùng (cho expectedComponents)
const used = new Set();
for (const src of sources.values()) for (const n of componentNames) if (new RegExp(`<${n}\\b`).test(src)) used.add(n);

const scores = {};
for (const d of DIMENSIONS) {
  let pen = 0;
  for (const f of findings) if (f.dimension === d) pen += PENALTY[f.severity];
  scores[d] = Math.max(0, 100 - pen);
}
const counts = { critical: 0, moderate: 0, minor: 0 };
findings.forEach((f) => counts[f.severity]++);
const overall = Math.round(DIMENSIONS.reduce((a, d) => a + scores[d], 0) / DIMENSIONS.length);
const result = { target: path.relative(process.cwd(), target) || '.', files: files.length, overall, scores, counts, componentsUsed: [...used].sort(), findings };

if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(result, null, 2));
const md = [
  `# uu-ds-check — ${result.target}`,
  '',
  `Tổng: **${overall}/100** · critical ${counts.critical} · moderate ${counts.moderate} · minor ${counts.minor} · ${files.length} file`,
  '',
  '| Chiều | Điểm |', '|---|---|',
  ...DIMENSIONS.map((d) => `| ${d} | ${scores[d]} |`),
  '',
  `Component UU DS đã dùng: ${[...used].sort().join(', ') || '(không)'}`,
  '',
  ...(findings.length ? ['| Mức | Luật | File:dòng | Chi tiết | Ví dụ |', '|---|---|---|---|---|', ...findings.sort((a, b) => PENALTY[b.severity] - PENALTY[a.severity]).map((f) => `| ${f.severity} | ${f.rule} | ${f.file}:${f.line} | ${f.detail} | \`${f.example.replace(/\|/g, '\\|').replace(/`/g, "'")}\` |`)] : ['Không có lỗi.']),
].join('\n');
if (opt('--md')) fs.writeFileSync(opt('--md'), md);
console.log(md);
if (strict && counts.critical > 0) process.exit(1);
