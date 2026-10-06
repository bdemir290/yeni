#!/usr/bin/env python3
"""Merges web/i18n/work/<lang>_<n>.json into web/i18n/<lang>.json (only keys still used by the source chunks)."""
import json, glob, os, re
W = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'i18n')
src = {}
for sp in sorted(glob.glob(os.path.join(W, 'work', 'src_*.json'))):
    for it in json.load(open(sp, encoding='utf-8')): src[it['tr']] = True
KEEP = {'DÖRTNALA': 'DÖRTNALA'}   # the game's name stays the same everywhere
for lang in ('en', 'de', 'es', 'id'):
    out = {}
    for fp in sorted(glob.glob(os.path.join(W, 'work', f'{lang}_[0-9]*.json'))):
        out.update(json.load(open(fp, encoding='utf-8')))
    out = {k: v for k, v in out.items() if k in src}
    out.update({k: v for k, v in KEEP.items() if k in src})
    json.dump(dict(sorted(out.items())), open(os.path.join(W, f'{lang}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(lang, len(out), '/', len(src))
