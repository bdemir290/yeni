#!/usr/bin/env python3
"""Checks web/i18n/work/<lang>_<n>.json (or the merged web/i18n/<lang>.json) against the source chunks.
usage: i18n_check.py <lang> [chunk]   -> prints problems, exit 1 if any hard error"""
import json, sys, os, glob, re
W = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'i18n')
lang = sys.argv[1]; chunk = sys.argv[2] if len(sys.argv) > 2 else None
BASE = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?:;-+=/%'\"()<>#*·←→↑↓♥")
EXTRA = {'de': set('ÄÖÜ'), 'es': set('ÁÉÍÓÚÑÜ¿¡'), 'en': set(), 'id': set()}
allowed = BASE | EXTRA.get(lang, set())
srcs = sorted(glob.glob(os.path.join(W, 'work', 'src_*.json')))
if chunk: srcs = [os.path.join(W, 'work', f'src_{chunk}.json')]
hard = soft = 0
for sp in srcs:
    n = re.search(r'src_(\d+)', sp).group(1)
    items = json.load(open(sp, encoding='utf-8'))
    op = os.path.join(W, 'work', f'{lang}_{n}.json')
    if not os.path.exists(op): print('MISSING FILE', op); hard += 1; continue
    try: out = json.load(open(op, encoding='utf-8'))
    except Exception as e: print('BAD JSON', op, e); hard += 1; continue
    for it in items:
        tr = it['tr']
        if tr not in out: print(f'[{n}] MISSING', json.dumps(tr, ensure_ascii=False)); hard += 1; continue
        t = out[tr]
        if not isinstance(t, str) or not t.strip() and tr.strip(): print(f'[{n}] EMPTY', tr); hard += 1; continue
        bad = sorted(set(ch for ch in t if ch not in allowed))
        if bad: print(f'[{n}] CHARS {bad}', json.dumps(t, ensure_ascii=False)); hard += 1
        if (len(tr) - len(tr.lstrip())) != (len(t) - len(t.lstrip())) or (len(tr) - len(tr.rstrip())) != (len(t) - len(t.rstrip())):
            print(f'[{n}] SPACES', json.dumps(tr, ensure_ascii=False), '->', json.dumps(t, ensure_ascii=False)); hard += 1
        if len(tr) <= 16 and len(t) > len(tr) + 2 and len(t) > 6:
            print(f'[{n}] LONG-LABEL {len(tr)}->{len(t)}', json.dumps(tr, ensure_ascii=False), '->', json.dumps(t, ensure_ascii=False)); soft += 1
    extra = set(out) - set(i['tr'] for i in items)
    if extra: print(f'[{n}] extra keys ignored: {len(extra)}')
print(f'{lang}: hard errors {hard}, long labels {soft}')
sys.exit(1 if hard else 0)
