#!/usr/bin/env python3
"""Normalize the reviewed PixelLab racer frames without smoothing.

Requires Pillow. Original PNGs remain under assets/pixellab/originals.
The common crop preserves motion between frames; never crop each pose separately.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'assets' / 'pixellab'
SETS = {
    'yildiz': ((48, 48), (17, 8, 32, 44), (12, 28), (18, 30), (3, 1)),
    'r1': ((44, 44), (14, 5, 31, 39), (15, 30), (20, 32), (2, 1)),
}

def prepare(name):
    canvas_size, crop, art_size, output_size, offset = SETS[name]
    destination = ROOT / name
    destination.mkdir(exist_ok=True)
    for pose in ['stand', 'jump', 'run-0', 'run-1', 'run-2', 'run-3']:
        image = Image.open(ROOT / 'originals' / name / f'{pose}.png').convert('RGBA')
        canvas = Image.new('RGBA', canvas_size)
        canvas.paste(image, ((canvas.width - image.width) // 2, (canvas.height - image.height) // 2))
        sprite = canvas.crop(crop).resize(art_size, Image.Resampling.NEAREST)
        output = Image.new('RGBA', output_size)
        output.paste(sprite, offset)
        output.save(destination / f'{pose}.png')
    return {
        'frames': [f'{name}/run-{i}.png' for i in range(4)],
        'jump': f'{name}/jump.png',
        'stand': f'{name}/stand.png',
    }

if __name__ == '__main__':
    horse = prepare('yildiz')
    horse['blanketMask'] = [[6, 16], [6, 17], [11, 16], [11, 17]]
    manifest_path = ROOT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    manifest.setdefault('horses', {})['bay|deniz'] = horse
    manifest.setdefault('mounts', {})['r1'] = prepare('r1')
    (ROOT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print('Prepared Yildiz and r1: four run frames, jump and stand each.')
