#!/usr/bin/env python3
"""Pixel width of translations vs Turkish, using the game's own glyph widths.
usage: i18n_width.py <lang> [--write]  -> lists lines that grew too much; --write saves work/<lang>_tighten.json"""
import re, json, os, sys
D = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(D, '..')
font = open(os.path.join(W, 'src', '01_font.js'), encoding='utf-8').read()
WID = {}
for m in re.finditer(r"^\s*(?:'(.)'|\"(.)\"): \[('([^']*)')", font, re.M): WID[m.group(1) or m.group(2)] = len(m.group(4))
for m in re.finditer(r"add\('(.)', '(.)'", font): WID[m.group(1)] = WID.get(m.group(2), 4)
for m in re.finditer(r"GLYPHS\['(.)'\] = \['([^']*)'", font): WID[m.group(1)] = len(m.group(2))
def up(s, lang): return s.upper() if lang != 'tr' else s.replace('i', 'İ').upper()
def width(s): return max(0, sum(WID.get(ch, WID.get('?', 3)) + 1 for ch in s) - 1)
lang = sys.argv[1]
tr2 = json.load(open(os.path.join(W, 'i18n', f'{lang}.json'), encoding='utf-8'))
rows = []
for tr, t in tr2.items():
    a, b = width(tr), width(t)
    short = len(tr.strip()) <= 30
    if (short and b > a * 1.12 and b - a > 6) or (not short and b > a * 1.35):
        rows.append({'tr': tr, 'now': t, 'tr_px': a, 'now_px': b, 'target_px': int(a * (1.08 if short else 1.25))})
rows.sort(key=lambda r: -r['now_px'] / max(1, r['tr_px']))
print(lang, 'lines', len(tr2), 'too wide', len(rows), '(short', sum(1 for r in rows if len(r['tr'].strip()) <= 30), ')')
for r in rows[:12]: print(f"  {r['tr_px']:4}->{r['now_px']:4}px  {r['tr']!r} -> {r['now']!r}")
if '--write' in sys.argv: json.dump(rows, open(os.path.join(W, 'i18n', 'work', f'{lang}_tighten.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
