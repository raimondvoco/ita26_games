// ==================== v21: the Old Pier, rebuilt from the dock tileset, with the sound of the sea ====================
TRACKS.pier = 'pier_waves';
const PIERIMG = loadImg('assets/beach/pier_layer.png');   // built by tools/pier_build.py from the dock tileset, at half size, recoloured to the beach's blues
PIERIMG.addEventListener('load', () => { delete MP.b_pier });
PROPS.pierart = { flat: 1, z: -2000, d(G) { if (ready(PIERIMG)) { G.imageSmoothingEnabled = false; G.drawImage(PIERIMG, 0, 0) } } };
(() => {
  const P0 = AREAS.b_pier;
  A('b_pier', { ...P0, mus: 'pier',
    feat: [{ k: 'water', x: 0, y: 0, w: 56, h: 22 }, { k: 'bridge', x: 0, y: 9, w: 54, h: 4, norail: 1 }, { k: 'bridge', x: 34, y: 13, w: 4, h: 3, dir: 'v', norail: 1 },
      p('pierart', 0, 0), ...ps('lamppost', [[8, 9], [26, 9], [44, 9]]), p('lifering', 52, 9),
      { k: 'solid', x: 15, y: 9, w: 2, h: 1 }, { k: 'solid', x: 30, y: 9, w: 2, h: 1 }, { k: 'solid', x: 40, y: 12, w: 3, h: 1 }],
    ents: P0.ents.map(e => e.kind == 'boat' ? { ...e, at: [36, 17], reach: 40 } : e) });
  delete MP.b_pier;
})();
