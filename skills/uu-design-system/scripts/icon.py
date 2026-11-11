#!/usr/bin/env python3
"""Lấy SVG của UU icon từ bundle trong skill.

  python3 scripts/icon.py magnifier            # SVG kiểu outline
  python3 scripts/icon.py magnifier fill       # SVG kiểu fill
  python3 scripts/icon.py --search cart        # tìm tên chứa "cart"
  python3 scripts/icon.py --public             # tên được phép dùng ở chỗ công khai
  python3 scripts/icon.py --out ./icons house gift bell   # ghi <name>.svg / <name>-fill.svg ra thư mục

SVG: viewBox 0 0 18 18, không width/height, màu currentColor.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = json.load(open(os.path.join(ROOT, 'references', 'uu-icon-index.json')))['icons']
_cache = {}


def svg(name, style='outline'):
    meta = INDEX.get(name)
    if not meta:
        raise SystemExit(f'"{name}" không có trong UU icon — tên gần giống không phải cùng icon. Thử --search.')
    cat = meta['category']
    if cat not in _cache:
        _cache[cat] = json.load(open(os.path.join(ROOT, 'assets', 'icons', f'{cat}.json')))['icons']
    s = _cache[cat].get(name, {}).get(style)
    if not s:
        raise SystemExit(f'"{name}" không có kiểu {style}.')
    return s


def main(argv):
    if not argv or argv[0] in ('-h', '--help'):
        print(__doc__); return
    if argv[0] == '--search':
        q = argv[1].lower() if len(argv) > 1 else ''
        for n in sorted(INDEX):
            if q in n: print(n, INDEX[n]['category'], 'public' if INDEX[n].get('public') else '')
        return
    if argv[0] == '--public':
        print('\n'.join(sorted(n for n, v in INDEX.items() if v.get('public')))); return
    if argv[0] == '--out':
        out, names = argv[1], argv[2:]
        os.makedirs(out, exist_ok=True)
        for n in names:
            for st, suffix in (('outline', ''), ('fill', '-fill')):
                if INDEX.get(n, {}).get(st):
                    open(os.path.join(out, f'{n}{suffix}.svg'), 'w').write(svg(n, st) + '\n')
        print(f'→ {out}'); return
    print(svg(argv[0], argv[1] if len(argv) > 1 else 'outline'))


if __name__ == '__main__':
    main(sys.argv[1:])
