// Imported PixelLab art is embedded by build.py, so the iOS game stays offline.
const IMPORTED_ART = { horses: {}, mounts: {}, portraits: {}, buildings: {}, items: {}, env: {} };
async function loadPixelLabArt() {
  const decode = uri => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(offscreen(image.width, image.height, () => g.drawImage(image, 0, 0)));
    image.onerror = () => reject(new Error('PixelLab PNG could not be decoded'));
    image.src = uri;
  });
  for (const group of ['horses', 'mounts']) {
    for (const [key, entry] of Object.entries(PIXELLAB_ASSETS[group] || {})) {
      try {
        const images = await Promise.all([...entry.frames, entry.jump, entry.stand].map(decode));
        if (entry.frames.length !== 4 || images.some(i => i.width !== images[0].width || i.height !== images[0].height)) {
          throw new Error('Racer art must have four run frames and matching canvas sizes');
        }
        const set = { frames: images.slice(0, 4), jump: images[4], stand: images[5], blanketMask: entry.blanketMask || [] };
        set.white = tintSprite(set.frames[0], C.white);
        IMPORTED_ART[group][key] = set;
      } catch (error) {
        // Keep the procedural art available if an imported set cannot load.
        console.warn('PixelLab art fallback:', group, key, error.message);
      }
    }
  }
  for (const group of ['portraits', 'buildings', 'items', 'env']) {
    for (const [key, uri] of Object.entries(PIXELLAB_ASSETS[group] || {})) {
      try { IMPORTED_ART[group][key] = await decode(uri); }
      catch (error) { console.warn('PixelLab art fallback:', group, key, error.message); }
    }
  }
}
// Item art (foods, horseshoes, weapons, keepsakes, spirit emblems) has no procedural twin of the same size,
// so callers ask for it and fall back to the old icon when it is missing.
function itemArt(key) { return IMPORTED_ART.items[key] || null; }
function spiritArt(sp, size) { return itemArt('sp' + size + '_' + sp); }
// Seamless ground textures per planet (already mapped onto the game palette by the import step).
const ENV_PAT = {};
function envPattern(key) {
  if (!(key in ENV_PAT)) { const img = IMPORTED_ART.env[key]; ENV_PAT[key] = img ? g.createPattern(img, 'repeat') : null; }
  return ENV_PAT[key];
}
function applyPixelLabStaticArt() {
  for (const [group, target] of [['portraits', PORTRAIT], ['buildings', BLD]]) {
    for (const [key, image] of Object.entries(IMPORTED_ART[group])) {
      const original = target[key];
      // Only reviewed assets with the original dimensions may replace hub art.
      if (original && image.width === original.width && image.height === original.height) target[key] = image;
      else console.warn('PixelLab dimensions do not match:', group, key);
    }
  }
}
function importedHorse(coatKey, silkKey, blanket) {
  const base = IMPORTED_ART.horses[coatKey + '|' + silkKey];
  if (!base) return null;
  if (!blanket) return base;
  const recolor = image => offscreen(image.width, image.height, () => {
    g.drawImage(image, 0, 0);
    // Optional per-pixel saddle mask, authored against the normalized sprite.
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = blanket;
    for (const [x, y] of base.blanketMask) g.fillRect(x, y, 1, 1);
    g.globalCompositeOperation = 'source-over';
  });
  // Preserve existing blanket cosmetics until a matching mask is authored.
  if (!base.blanketMask.length) return null;
  return { frames: base.frames.map(recolor), jump: recolor(base.jump), stand: recolor(base.stand), white: base.white };
}
