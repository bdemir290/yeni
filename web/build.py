#!/usr/bin/env python3
"""Concatenate src/*.js into two single-file builds:
   dist/index.html    full HTML document (for the Xcode app bundle)
   dist/artifact.html artifact page (no html/head/body skeleton)"""
import base64, glob, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
files = sorted(glob.glob(os.path.join(ROOT, 'src', '*.js')))
asset_root = os.path.join(ROOT, 'assets', 'pixellab')
manifest_path = os.path.join(asset_root, 'manifest.json')
assets = json.load(open(manifest_path, encoding='utf-8')) if os.path.isfile(manifest_path) else {}
def embed_png(value):
    if isinstance(value, dict):
        return {k: embed_png(v) for k, v in value.items()}
    if isinstance(value, list):
        return [embed_png(v) for v in value]
    if isinstance(value, str) and value.endswith('.png'):
        path = os.path.realpath(os.path.join(asset_root, value))
        if not path.startswith(os.path.realpath(asset_root) + os.sep):
            raise ValueError('Asset path escapes asset directory')
        with open(path, 'rb') as image:
            return 'data:image/png;base64,' + base64.b64encode(image.read()).decode('ascii')
    return value
js = 'const PIXELLAB_ASSETS = ' + json.dumps(embed_png(assets), ensure_ascii=True) + ';\n'
# translations: web/i18n/<lang>.json maps the Turkish source line to the translated line
i18n = {}
i18n_dir = os.path.join(ROOT, 'i18n')
if os.path.isdir(i18n_dir):
    for fn in sorted(glob.glob(os.path.join(i18n_dir, '*.json'))):
        lang = os.path.splitext(os.path.basename(fn))[0]
        if len(lang) == 2: i18n[lang] = json.load(open(fn, encoding='utf-8'))
js += 'const I18N = ' + json.dumps(i18n, ensure_ascii=True) + ';\n'
js += "\n".join(open(f, encoding='utf-8').read() for f in files)
script = "(function(){\n'use strict';\n" + js + "\n})();"

os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
open(os.path.join(ROOT, 'dist', 'game.js'), 'w', encoding='utf-8').write(script)
# syntax check with node (skipped if node is not installed)
try:
    r = subprocess.run(['node', '--check', os.path.join(ROOT, 'dist', 'game.js')], capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr)
        sys.exit(1)
except FileNotFoundError:
    print('node bulunamadi, sozdizimi kontrolu atlandi')

CSS = """
:root{--bg:#181425;color-scheme:dark}
html,body{margin:0;padding:0;height:100%;background:var(--bg);overflow:hidden;overscroll-behavior:none;touch-action:none;
  -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
body{background:var(--bg)}
#game{position:fixed;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:none;outline:none;display:block}
#safe{position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;
  padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
""".strip()

body = '<canvas id="game" aria-label="Dörtnala oyun alanı"></canvas>\n<div id="safe"></div>\n<script>\n' + script + '\n</script>\n'

full = ('<!DOCTYPE html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
        '<meta name="theme-color" content="#181425">\n'
        '<title>Dörtnala</title>\n<style>\n' + CSS + '\n</style>\n</head>\n<body>\n' + body + '</body>\n</html>\n')
open(os.path.join(ROOT, 'dist', 'index.html'), 'w', encoding='utf-8').write(full)

art = '<title>Dörtnala</title>\n<style>\n' + CSS + '\n</style>\n' + body
open(os.path.join(ROOT, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(art)
xc = os.path.join(ROOT, '..', 'Dortnala')
if os.path.isdir(xc):
    open(os.path.join(xc, 'index.html'), 'w', encoding='utf-8').write(full)
    print('copied into Xcode target')
print('ok', len(script), 'bytes of JS')
