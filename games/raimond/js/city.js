// ==================== THE NEON DISTRICT: recoloured tileset art, city rooftops/walls, props, casino, choices, quests ====================
// Art in assets/city/*.png was cut from the reference tilesets and recoloured to the bar palette (navy / blue / magenta / pink / cyan).
// Each sprite exists in three colourways: name.png (cyan accents), name_p.png (pink accents), name_m.png (magenta walls + pink).
const CNAMES = ['shop', 'bldstairs', 'vend', 'lamp', 'board', 'stairs', 'mat', 'signbowl', 'window', 'vent', 'pipe', 'fence', 'lamp2', 'atm', 'atm2', 'smallwin', 'ac', 'roofside', 'hydrant', 'plant', 'bottle', 'trash', 'post', 'cables', 'ground', 'sign1', 'sign2', 'sign3', 'pole', 'barv', 'barh', 'stairs2', 'counter', 'sofas'];
const CIMG = {}; CNAMES.forEach(n => ['', '_p', '_m'].forEach(v => CIMG[n + v] = loadImg('assets/city/' + n + v + '.png')));
const cityReady = () => Object.values(CIMG).every(i => i.complete && i.naturalWidth > 0);
function CI(G, n, x, y) { const im = CIMG[n]; if (im && im.complete && im.naturalWidth) G.drawImage(im, Math.round(x), Math.round(y)) }
const CP = { ink: '#020426', navy: '#06123a', deep: '#0b2252', blue: '#0d3a72', blue2: '#1f5f96', roof: '#24124a', roof2: '#1a0a38', vio: '#4a1a6e', mag: '#7a1070', mag2: '#4a045c', pink: '#ff5a8a', pink2: '#e85a78', cyan: '#2ee6e6', gold: '#e8c060' };
Object.assign(PAL.city, { a: ['#0b2252', '#0b2252', '#0b2252'], sp: '#14306a', plaza: '#0f3266', pl2: '#0c2a5a', path: '#07123a', path2: '#0b1a4a', pe: CP.ink, lawn: '#0b2252', stone: '#132a62', tall: '#0b2252', crate: '#3a1a5a', barrel: '#24124a', tr: CP.roof, to: CP.ink, td: CP.roof, tm: CP.vio, tl: '#6a2a8a', wt: '#06204a', wt2: CP.blue2, wo: CP.ink, cf: CP.blue, cd: '#082a5a', cl: CP.blue2, co: CP.ink });
PAL.cyberin = { ...PAL.cyberin, a: ['#14306a', '#14306a', '#14306a'], plaza: '#1a3a78', pl2: '#14306a', sp: '#1f4488', path: CP.mag2, path2: CP.mag, pe: CP.ink, wall: '#13235a', wtop: CP.ink };
PAL.casino = { ...PAL.house, a: ['#6a0a28', '#6a0a28', '#6a0a28'], sp: '#7a1030', plaza: '#5a0a24', pl2: '#4a0820', path: '#8a1030', path2: '#a8203c', pe: CP.gold, carpet: '#7a0a2a', cpat: CP.gold, wall: '#3a0a2a', wtop: '#120208', crate: '#5a1a3a', barrel: '#4a1030' };
// ---------------------------------------------------------------- rebuilt cityscape: rooftops + two-storey wall faces made from the tileset
cityBlocks = function (g, g2, mp, P) {
  const { w, h, t } = mp, M = (a, b) => a < 0 || b < 0 || a >= w || b >= h || t[b * w + a] == 12, S_ = (a, b) => a < 0 || b < 0 || a >= w || b >= h || [12, 3, 5].includes(t[b * w + a]);
  const F = (x, y, ww, hh, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(ww), Math.round(hh)) };
  const seg = x => Math.floor((x + 2) / 7), CW = x => ['', '', '_m', '', '_m', ''][(seg(x) * 5 + (mp.id.length)) % 6], WALL = { '': [CP.blue, CP.blue2, '#082a5a'], '_m': ['#3a0f5a', '#6a2a8a', '#2a0a44'] };
  const face = []; // [x, y, row(1 = upper, 0 = lower)]
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!M(x, y)) continue; const px = x * T, py = y * T, lo = !S_(x, y + 1), hi = !lo && M(x, y + 1) && !S_(x, y + 2) && y + 2 < h, v = CW(x), [wc, wl, wd] = WALL[v];
    if (lo || hi) { F(px, py, T, T, wc); face.push([x, y, hi ? 1 : 0, v]);
      if (hi) { F(px, py, T, 3, CP.ink); for (let i = 0; i < 16; i += 2) F(px + i, py + 3, 2, 1 + (hsh(x * 16 + i, y, 3) * 5 | 0), wl); if (hsh(x, y, 4) < .5) F(px + 3 + hsh(x, y, 5) * 9, py + 9, 2, 3, wl) }
      else { F(px, py, T, 2, wl); F(px, py + 2, T, 1, CP.ink); F(px, py + 12, T, 3, wd); F(px, py + 15, T, 1, CP.ink); for (let i = 0; i < 16; i += 4) if (hsh(x * 4 + i, y, 6) < .4) F(px + i, py + 3, 2, 2 + (hsh(x, i, 7) * 3 | 0), wl) }
      if (seg(x) != seg(x - 1)) { F(px, py, 1, T, CP.ink); F(px + 1, py, 1, T, wl) }
      continue }
    F(px, py, T, T, CP.roof); for (let i = 1; i < 16; i += 3) F(px + i, py, 1, T, CP.roof2);
    if (seg(x) != seg(x - 1)) { F(px, py, 2, T, CP.ink); F(px + 2, py, 1, T, CP.vio) }
    if (M(x, y + 1) && (!S_(x, y + 2) || !M(x, y + 2))) { F(px, py + 11, T, 5, CP.vio); F(px, py + 11, T, 1, '#6a2a8a'); F(px, py + 15, T, 1, CP.ink) }   // roof rim above the wall
    if (!S_(x, y - 1)) { F(px, py, T, 2, CP.vio); F(px, py + 2, T, 1, CP.ink) }   // back edge of a roof seen from a street above
  }
  // decorate the wall faces: windows, signs, AC units, pipes
  let skip = -1;
  face.filter(f => f[2] == 1).sort((a, b) => a[1] - b[1] || a[0] - b[0]).forEach(([x, y, , v]) => {
    if (x <= skip && y == face.lastY) return; face.lastY = y; const px = x * T, py = y * T, r_ = hsh(x, y, 61), ok3 = [1, 2].every(k => face.some(f => f[0] == x + k && f[1] == y));
    if (!ok3) return; const pv = v == '_m' ? '_m' : '';
    if (r_ < .3) { CI(g, 'window' + pv, px - 1, py + 3); skip = x + 2 } else if (r_ < .42) { CI(g, 'smallwin' + pv, px, py + 6); skip = x + 2 }
    else if (r_ < .5) { CI(g, 'ac' + pv, px - 4, py - 2); skip = x + 2 } else if (r_ < .58 && [3].every(k => face.some(f => f[0] == x + k && f[1] == y))) { CI(g, 'signbowl' + (v == '_m' ? '_m' : '_p'), px - 2, py + 4); ell(px + 18, py + 30, 20, 6, 'rgba(255,90,138,.14)', g); skip = x + 3 }
    else if (r_ < .64) { CI(g, 'pipe' + pv, px + 2, py - 4); skip = x + 1 } else if (r_ < .7) { CI(g, ['sign1', 'sign2', 'sign3'][(x + y) % 3] + pv, px + 1, py + 8); skip = x + 1 }
  });
  // rooftop clutter: vents, cables, panels
  for (let y = 1; y < h - 3; y++) for (let x = 1; x < w - 4; x++) { if (!M(x, y)) continue; const allRoof = (a, b, ww, hh) => { for (let j = b; j < b + hh; j++) for (let i = a; i < a + ww; i++) if (!M(i, j) || !S_(i, j + 1) || !S_(i, j + 2)) return false; return true };
    const r_ = hsh(x, y, 62); if (x % 9 == 2 && y % 7 == 2 && allRoof(x, y, 4, 3) && r_ < .7) CI(g, 'mat', x * T + 4, y * T + 4); else if (r_ < .03 && allRoof(x, y, 2, 2)) CI(g, 'vent', x * T + 2, y * T + 3); else if (r_ < .05 && allRoof(x, y, 3, 2)) CI(g, 'cables', x * T, y * T + 4); else if (r_ < .06 && allRoof(x, y, 2, 2)) CI(g, 'ac', x * T, y * T) }
};
// ---------------------------------------------------------------- building fronts made from the tileset
const _drawBuilding = drawBuilding;
const CSTYLE = {
  cshop(g, g2, b) {   // the shop from the tileset; b.v picks a colourway, b.sign is written onto its sign panel
    const x0 = b.x * T, y0 = b.y * T, W_ = b.w * T, H_ = b.h * T, v = b.v || '', ix = x0 + Math.round((W_ - 98) / 2), iy = y0 + H_ - 120;
    g.fillStyle = CP.roof; g.fillRect(x0, y0, W_, H_); for (let i = 1; i < W_; i += 3) { g.fillStyle = CP.roof2; g.fillRect(x0 + i, y0, 1, H_ - 112) }
    ell(x0 + W_ / 2 + 4, y0 + H_, W_ / 2 + 6, 5, 'rgba(0,0,0,.35)', g); CI(g, 'shop' + v, ix, iy);
    if (b.sign) { const sx = ix + 52, sy = iy + 67, c = v == '_p' || v == '_m' ? CP.pink : CP.cyan; g.fillStyle = CP.ink; g.fillRect(sx + 1, sy + 1, 30, 10); g.font = 'bold 7px sans-serif'; g.textAlign = 'center'; g.shadowColor = c; g.shadowBlur = 6; g.fillStyle = c; g.fillText(b.sign, sx + 16, sy + 9); g.shadowBlur = 0; g.textAlign = 'left'; ell(sx + 16, sy + 30, 24, 8, v == '_p' || v == '_m' ? 'rgba(255,90,138,.16)' : 'rgba(46,230,230,.14)', g) }
    if (b.closed) { g.fillStyle = 'rgba(2,4,38,.55)'; g.fillRect(ix + 20, iy + 96, 38, 22) }
  },
  cstairs(g, g2, b) {   // the two-storey block with an outside staircase; its door sits at the foot of the stairs
    const x0 = b.x * T, y0 = b.y * T, W_ = b.w * T, H_ = b.h * T, v = b.v || '', ix = x0 + W_ - 126, iy = y0 + H_ - 113;
    g.fillStyle = CP.roof; g.fillRect(x0, y0, W_, H_); ell(x0 + W_ / 2, y0 + H_, W_ / 2 + 6, 5, 'rgba(0,0,0,.35)', g); CI(g, 'bldstairs' + v, ix, iy);
    if (b.sign) { g.font = 'bold 9px sans-serif'; g.shadowColor = CP.pink; g.shadowBlur = 8; g.fillStyle = CP.pink; g.fillText(b.sign, ix + 12, iy + 76); g.shadowBlur = 0 }
    CI(g, 'smallwin' + (v || ''), ix + 20, iy + 54); CI(g, 'smallwin' + (v || ''), ix + 46, iy + 54);
  },
  casino(g, g2, b) {   // OMORI-ish casino front: dark plum walls, gold trim, bulb marquee, red curtains, a red carpet out the door
    const x0 = b.x * T, y0 = b.y * T, W_ = b.w * T, H_ = b.h * T, F = (x, y, ww, hh, c, G = g) => { G.fillStyle = c; G.fillRect(Math.round(x), Math.round(y), Math.round(ww), Math.round(hh)) }, dx = x0 + (b.door ?? (b.w >> 1)) * T;
    ell(x0 + W_ / 2, y0 + H_, W_ / 2 + 10, 7, 'rgba(0,0,0,.4)', g); F(x0, y0 + 10, W_, H_ - 10, '#2a0a3a');
    for (let r_ = 0; r_ < (H_ - 10) / 8; r_++) for (let c = 0; c < W_ / 16 + 1; c++) F(x0 + c * 16 + (r_ % 2) * 8, y0 + 10 + r_ * 8, 15, 7, (r_ + c) % 4 ? '#34104a' : '#2e0c42');
    F(x0, y0 + 10, W_, 4, CP.gold); F(x0, y0 + 14, W_, 2, '#8a6a20'); F(x0, y0 + H_ - 6, W_, 6, '#1a0620'); F(x0, y0 + 64, W_, 3, CP.gold);
    for (let k = 0; k < W_; k += 12) { F(x0 + k + 2, y0 + 4, 8, 7, '#2a0a3a', g2); F(x0 + k + 2, y0 + 4, 8, 2, CP.gold, g2) }
    // arched windows with red curtains
    for (let wx = x0 + 14; wx < x0 + W_ - 20; wx += 44) { if (Math.abs(wx + 9 - dx - 8) < 60) continue; F(wx - 2, y0 + 22, 22, 36, CP.gold); F(wx, y0 + 24, 18, 32, '#ffd890'); ell(wx + 9, y0 + 25, 9, 6, '#ffd890', g); F(wx, y0 + 24, 6, 32, '#a8203c'); F(wx + 12, y0 + 24, 6, 32, '#a8203c'); F(wx + 2, y0 + 24, 1, 32, '#7a1030'); F(wx + 15, y0 + 24, 1, 32, '#7a1030'); F(wx - 3, y0 + 56, 24, 3, CP.gold); F(wx, y0 + 70, 18, 22, '#1a0620'); F(wx + 2, y0 + 72, 14, 18, '#ffb0c8'); F(wx + 8, y0 + 72, 2, 18, '#1a0620') }
    // marquee
    const mw = Math.min(W_ - 40, 230), mx = x0 + (W_ - mw) / 2, my = y0 + 20; F(mx - 4, my - 4, mw + 8, 40, CP.gold); F(mx, my, mw, 32, '#8a1030'); F(mx + 3, my + 3, mw - 6, 26, '#5a0820');
    for (let k = 0; k < mw + 8; k += 6) { F(mx - 4 + k, my - 4, 2, 2, (k / 6) % 2 ? '#fff6c8' : '#ffb040'); F(mx - 4 + k, my + 34, 2, 2, (k / 6) % 2 ? '#ffb040' : '#fff6c8') }
    g.font = 'bold 15px serif'; g.textAlign = 'center'; g.shadowColor = '#ffb040'; g.shadowBlur = 10; g.fillStyle = '#ffe9a0'; g.fillText(b.sign || 'CASINO', mx + mw / 2, my + 22); g.shadowBlur = 0; g.textAlign = 'left';
    for (const [sx, sym] of [[mx - 26, 0], [mx + mw + 10, 1]]) { F(sx, my + 4, 16, 22, '#1a0620'); g.fillStyle = sym ? CP.cyan : CP.pink; g.font = 'bold 14px serif'; g.fillText(sym ? '♠' : '♥', sx + 2, my + 20) }
    // entrance: gold columns, striped awning, double doors
    F(dx - 26, y0 + H_ - 46, 68, 46, '#1a0620'); for (const cx of [dx - 26, dx + 34]) { F(cx, y0 + H_ - 52, 8, 52, CP.gold); F(cx + 2, y0 + H_ - 52, 2, 52, '#fff0b0'); F(cx - 2, y0 + H_ - 54, 12, 4, '#8a6a20') }
    for (let i = 0; i < 9; i++) { F(dx - 30 + i * 8, y0 + H_ - 60, 8, 10, i & 1 ? '#fff0e0' : '#a8203c', g2); ell(dx - 26 + i * 8, y0 + H_ - 50, 4, 2, i & 1 ? '#fff0e0' : '#a8203c', g2) }
    F(dx - 8, y0 + H_ - 34, 32, 34, '#3a0814'); F(dx - 6, y0 + H_ - 32, 13, 32, '#7a1030'); F(dx + 9, y0 + H_ - 32, 13, 32, '#7a1030'); F(dx + 5, y0 + H_ - 18, 2, 3, CP.gold); F(dx + 9, y0 + H_ - 18, 2, 3, CP.gold);
    for (let k = 0; k < 3; k++) { F(dx - 8, y0 + H_ + k * 16, 32, 16, '#a8203c'); F(dx - 8, y0 + H_ + k * 16, 2, 16, CP.gold); F(dx + 22, y0 + H_ + k * 16, 2, 16, CP.gold) }
  }
};
drawBuilding = function (g, g2, b, P, mp) { if (CSTYLE[b.style]) return CSTYLE[b.style](g, g2, b, P, mp); return _drawBuilding(g, g2, b, P, mp) };
// ---------------------------------------------------------------- props: tileset sprites (feet at the bottom of the sprite, ax = foot x inside the sprite)
const IP = (name, ax, o = {}) => ({ s: S1, ...o, d(G, x, y, P, s, p) { const im = CIMG[name + (p.v || '')]; if (!im || !im.naturalWidth) return; if (!o.flat && !o.noshadow) SHD(G, x + 2, y, Math.min(14, im.width / 2)); CI(G, name + (p.v || ''), x - ax, y - im.height + 1 + (o.oy || 0)) } });
Object.assign(PROPS, {
  c_vend: IP('vend', 10), c_lamp: IP('lamp', 6), c_lamp2: IP('lamp2', 23), c_board: IP('board', 5), c_atm: IP('atm', 8), c_atm2: IP('atm2', 8), c_hydrant: IP('hydrant', 6), c_plant: IP('plant', 7),
  c_trash: IP('trash', 5), c_post: IP('post', 4), c_ac: IP('ac', 14, { w: 2, s: S2 }), c_fence: IP('fence', 19, { w: 2, s: S2 }), c_bottle: IP('bottle', 3, { flat: 1 }), c_cables: IP('cables', 22, { w: 3, flat: 1 }),
  c_vent: IP('vent', 5, { flat: 1 }), c_mat: IP('mat', 28, { w: 4, flat: 1, oy: -2 }), c_stairs: IP('stairs', 30, { w: 4, s: [0, -1, 4, 2] }), c_roofside: IP('roofside', 38, { w: 5, s: [0, -1, 5, 2] }), c_units: IP('sofas', 34, { w: 4, s: [0, -1, 4, 2] }),
  c_counter: IP('counter', 19, { w: 2, s: [0, -1, 2, 2] }), c_window: IP('window', 9, { flat: 1, oy: -8 }), c_sign: IP('signbowl', 20, { w: 3, flat: 1, oy: -12 }), c_pole: IP('pole', 2), c_ground: IP('ground', 28, { w: 4, flat: 1 }),
  // neon text sign on a little stand (p.t = text, p.c = colour)
  ntext: { s: S1, d(G, x, y, P, s, p) { const c = p.c || (s < .5 ? CP.pink : CP.cyan), wd = Math.max(22, (p.t || '').length * 6 + 8); SHD(G, x + 2, y, 6); PF(G, x - 1, y - 14, 3, 14, CP.ink); PF(G, x - wd / 2 - 1, y - 30, wd + 2, 17, CP.ink); PF(G, x - wd / 2, y - 29, wd, 15, '#0b1640'); G.save(); G.font = 'bold 8px sans-serif'; G.textAlign = 'center'; G.shadowColor = c; G.shadowBlur = 6; G.fillStyle = c; G.fillText(p.t || '', x, y - 18); G.restore(); PE(G, x, y - 22, wd / 2 + 8, 12, c == CP.pink ? 'rgba(255,90,138,.12)' : 'rgba(46,230,230,.12)') } },
  rails: { w: 1, flat: 1, d(G, x, y, P, s, p) { const n = p.n || 20, x0 = x - 8; PF(G, x0, y - 13, n * 16, 12, '#06102e'); for (let i = 0; i < n * 16; i += 6) PF(G, x0 + i, y - 13, 3, 12, '#3a2a40'); PF(G, x0, y - 11, n * 16, 2, '#8a9ab8'); PF(G, x0, y - 5, n * 16, 2, '#8a9ab8') } },
  train: { w: 1, raw: 1, s: [0, -2, 18, 3], d(g, x, y, P, s, p, g2) { const x0 = x - 8, L = 18 * 16, top = y - 44; const F = (a, b, c, d, col, G = g) => { G.fillStyle = col; G.fillRect(Math.round(a), Math.round(b), c, d) }; ell(x0 + L / 2, y + 2, L / 2, 5, 'rgba(0,0,0,.35)', g);
    for (const G of [g]) { F(x0, top, L, 44, CP.blue, G); F(x0, top, L, 4, CP.blue2, G); F(x0, top + 30, L, 3, CP.pink, G); F(x0, top + 40, L, 4, CP.ink, G); for (let i = 8; i < L - 20; i += 26) { F(x0 + i, top + 8, 18, 16, CP.ink, G); F(x0 + i + 1, top + 9, 16, 14, hsh(i, 1, 2) < .6 ? '#9ae8ff' : '#14306a', G); F(x0 + i + 1, top + 9, 16, 2, '#fff', G) } for (let i = 60; i < L; i += 96) { F(x0 + i, top + 6, 20, 34, '#082a5a', G); F(x0 + i + 9, top + 6, 2, 34, CP.ink, G) } F(x0 + L - 12, top + 6, 10, 24, '#9ae8ff', G) }
    F(x0, top - 4, L, 4, CP.ink, g2); F(x0 + 4, top - 3, L - 8, 2, CP.vio, g2) } },
  ptile: { flat: 1, w: 1, d(G, x, y, P, s, p) { const n = p.n || 10; for (let i = 0; i < n * 16; i += 4) PF(G, x - 8 + i, y - 4, 2, 3, '#ffd23c') } },
  timetable: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 14); PF(G, x - 14, y - 6, 3, 6, CP.ink); PF(G, x + 11, y - 6, 3, 6, CP.ink); PF(G, x - 16, y - 34, 32, 28, CP.ink); PF(G, x - 15, y - 33, 30, 26, '#0b1640'); G.save(); G.font = 'bold 5px monospace'; G.fillStyle = CP.cyan; ['WOODS 06:00', 'SHORE 06:00', 'HOME  06:00', 'HOME  06:00'].forEach((l, i) => G.fillText(l, x - 13, y - 26 + i * 6)); G.restore() } },
  watertank: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16); for (const dx of [-12, 10]) PF(G, x + dx, y - 10, 2, 10, CP.ink); PF(G, x - 14, y - 34, 28, 26, '#082a5a'); PF(G, x - 13, y - 33, 26, 24, CP.blue); for (let i = 0; i < 24; i += 6) PF(G, x - 13, y - 31 + i, 26, 1, '#082a5a'); PE(G, x, y - 34, 14, 4, CP.blue2); PF(G, x - 3, y - 40, 6, 5, CP.ink) } },
  dish: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7); PF(G, x - 1, y - 14, 2, 14, CP.ink); PE(G, x + 2, y - 22, 9, 8, '#c8d0e8'); PE(G, x + 3, y - 22, 6, 6, '#8a9ab8'); PF(G, x + 2, y - 23, 7, 1, CP.ink); PF(G, x + 9, y - 25, 2, 2, CP.pink) } },
  antenna: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 5); PF(G, x - 1, y - 60, 2, 60, CP.ink); for (let i = 0; i < 4; i++) PF(G, x - 6 + i, y - 50 + i * 10, 12 - i * 2, 1, CP.ink); PF(G, x - 2, y - 63, 4, 4, '#ff3a3a'); PE(G, x, y - 61, 8, 6, 'rgba(255,60,60,.25)') } },
  neonback: { w: 4, s: [0, 0, 4, 1], d(G, x, y, P, s, p) { SHD(G, x + 2, y, 30); for (let i = -28; i <= 28; i += 14) PF(G, x + i, y - 34, 2, 34, '#3a3a5a'); PF(G, x - 30, y - 20, 60, 2, '#3a3a5a'); PF(G, x - 30, y - 34, 60, 2, '#3a3a5a'); G.save(); G.font = 'bold 14px sans-serif'; G.textAlign = 'center'; G.fillStyle = '#3a0a2a'; G.scale(-1, 1); G.fillText(p.t || 'DREAM', -x, y - 38); G.restore() } },
  easel: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7); PF(G, x - 6, y - 26, 2, 26, '#8a5a34'); PF(G, x + 5, y - 26, 2, 26, '#8a5a34'); PF(G, x - 9, y - 30, 18, 16, '#f4f0f4'); PF(G, x - 7, y - 28, 6, 5, CP.pink); PF(G, x - 1, y - 24, 7, 6, CP.cyan); PF(G, x - 6, y - 20, 10, 2, CP.mag) } },
  paint: { flat: 1, d(G, x, y) { PF(G, x - 6, y - 4, 4, 3, CP.pink); PF(G, x, y - 3, 4, 3, CP.cyan); PF(G, x - 2, y - 7, 3, 2, '#ffd23c') } },
  // ---- the bar (third reference picture): brick walls, pink counter, stools, booths, arcade cabinets, neon
  barcounter: { w: 6, s: [0, -1, 6, 2], d(G, x, y) { const x0 = x - 48; SHD(G, x, y, 50, 5); PF(G, x0, y - 24, 96, 24, CP.mag2); PF(G, x0, y - 24, 96, 2, '#2a0236'); for (let i = 4; i < 96; i += 22) PF(G, x0 + i, y - 18, 1, 16, '#2a0236'); PF(G, x0 - 2, y - 34, 100, 11, CP.pink2); PF(G, x0 - 2, y - 34, 100, 2, '#ff8aa0'); for (let i = 0; i < 9; i++) PF(G, x0 + i * 11, y - 31 + (i % 3), 6, 2, '#b8304a'); PF(G, x0 + 70, y - 33, 10, 5, CP.mag2); PF(G, x0 + 10, y - 42, 8, 10, CP.ink); PE(G, x0 + 14, y - 38, 3, 4, CP.cyan) } },
  stool: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 5); PF(G, x - 4, y - 2, 8, 2, CP.ink); PF(G, x - 1, y - 12, 2, 10, '#14306a'); PE(G, x, y - 13, 6, 3, '#2a0236'); PE(G, x, y - 14, 5, 2, CP.mag) } },
  bottleshelf: { w: 4, flat: 1, d(G, x, y) { const x0 = x - 32; y -= 8; PF(G, x0, y - 30, 64, 30, '#2a0236'); for (let r = 0; r < 2; r++) { PF(G, x0, y - 30 + r * 15 + 13, 64, 2, CP.mag); for (let i = 0; i < 9; i++) { const bx = x0 + 3 + i * 7, bh = 7 + (i * 3 + r) % 4; PF(G, bx, y - 17 + r * 15 - bh, 4, bh, [CP.pink2, '#b8304a', CP.cyan, '#ff8aa0'][(i + r) % 4]); PF(G, bx + 1, y - 17 + r * 15 - bh - 2, 2, 2, CP.ink) } } } },
  arcadecab: { w: 2, s: [0, -1, 2, 2], d(G, x, y, P, s) { SHD(G, x + 2, y, 14); PF(G, x - 13, y - 40, 26, 40, CP.ink); PF(G, x - 12, y - 39, 24, 38, '#0b1640'); PF(G, x - 10, y - 36, 20, 13, CP.cyan); for (let i = 0; i < 4; i++) PF(G, x - 8 + (i * 5) % 16, y - 33 + i * 3, 6 - i, 1, '#0b6a8a'); PF(G, x - 10, y - 20, 20, 4, '#14306a'); PE(G, x - 4, y - 18, 2, 1.5, CP.pink); PE(G, x + 4, y - 18, 2, 1.5, CP.cyan); PF(G, x - 12, y - 40, 24, 3, CP.vio); PE(G, x, y + 2, 7, 3, CP.mag) } },
  booth: { w: 4, s: [0, -1, 4, 2], d(G, x, y) { SHD(G, x, y, 30, 5); for (const dx of [-28, 18]) { PF(G, x + dx, y - 30, 10, 30, CP.mag2); PF(G, x + dx + 1, y - 29, 8, 28, CP.mag); for (let i = 0; i < 4; i++) PF(G, x + dx + 2, y - 26 + i * 7, 6, 1, '#b8304a') } PE(G, x, y - 12, 13, 8, CP.ink); PE(G, x, y - 14, 12, 7, CP.mag); for (let i = 0; i < 4; i++) PF(G, x - 8 + i * 5, y - 16, 2, 2, CP.pink); PF(G, x - 1, y - 8, 2, 8, CP.ink); PF(G, x - 5, y - 22, 3, 6, CP.cyan); PF(G, x + 3, y - 21, 3, 5, CP.pink2) } },
  neonx: { flat: 1, d(G, x, y) { y -= 8; for (let i = 0; i < 14; i++) { PF(G, x - 7 + i, y - 30 + i, 2, 2, CP.cyan); PF(G, x + 6 - i, y - 30 + i, 2, 2, CP.pink) } PE(G, x, y - 23, 14, 12, 'rgba(255,90,138,.12)') } },
  beersign: { w: 4, flat: 1, d(G, x, y) { y -= 4; PF(G, x - 30, y - 30, 60, 26, '#0b1640'); G.save(); G.font = 'bold 10px monospace'; G.textAlign = 'center'; G.shadowBlur = 6; G.shadowColor = CP.cyan; G.fillStyle = CP.cyan; G.fillText('DRINK', x, y - 20); G.shadowColor = CP.pink; G.fillStyle = CP.pink; G.fillText('JUICE', x, y - 9); G.restore() } },
  bot: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6); PF(G, x - 5, y - 14, 10, 14, '#14306a'); PF(G, x - 7, y - 26, 14, 12, '#0b1640'); PF(G, x - 3, y - 23, 6, 6, CP.cyan); PF(G, x - 1, y - 32, 2, 6, CP.cyan); PF(G, x - 9, y - 18, 3, 8, '#14306a'); PF(G, x + 6, y - 18, 3, 8, '#14306a') } },
  // ---- casino (OMORI-ish: plum + gold + red velvet)
  chandelier: { top: 1, w: 3, d(G, x, y) { const cy = y - 60; PF(G, x - 1, cy - 30, 2, 30, CP.gold); PE(G, x, cy + 2, 24, 7, '#8a6a20'); PE(G, x, cy, 22, 6, CP.gold); for (let i = -2; i <= 2; i++) { PF(G, x + i * 9 - 1, cy - 8, 2, 8, '#fff6c8'); PE(G, x + i * 9, cy - 9, 2, 3, '#ffd890'); PF(G, x + i * 9, cy + 6, 1, 6, '#e8e0f0') } PE(G, x, cy, 40, 18, 'rgba(255,220,140,.12)') } },
  gpillar: { s: S1, d(G, x, y) { SHD(G, x + 2, y, 9); PF(G, x - 8, y - 6, 16, 6, '#8a6a20'); PF(G, x - 6, y - 54, 12, 48, CP.gold); PF(G, x - 4, y - 54, 2, 48, '#fff0b0'); PF(G, x + 3, y - 54, 2, 48, '#a8862a'); PF(G, x - 8, y - 58, 16, 5, '#8a6a20') } },
  curtain: { flat: 1, w: 2, d(G, x, y) { y -= 4; PF(G, x - 16, y - 34, 32, 4, CP.gold); for (let i = 0; i < 8; i++) PF(G, x - 16 + i * 4, y - 30, 4, 28 - (i == 0 || i == 7 ? 0 : 0), i % 2 ? '#a8203c' : '#7a1030'); PF(G, x - 16, y - 8, 32, 2, '#5a0820'); PE(G, x - 12, y - 16, 3, 2, CP.gold); PE(G, x + 12, y - 16, 3, 2, CP.gold) } },
  prizeshelf: { w: 4, s: [0, -1, 4, 2], d(G, x, y) { SHD(G, x, y, 32, 5); PF(G, x - 32, y - 40, 64, 40, '#5a1a2a'); PF(G, x - 31, y - 39, 62, 38, '#7a2a3a'); for (let r = 0; r < 3; r++) PF(G, x - 31, y - 28 + r * 12, 62, 2, CP.gold); const toys = [['#f4f0f4', 'bunny'], [CP.cyan, 'jelly'], ['#ffd23c', 'star'], [CP.pink, 'heart'], ['#8ad8ff', 'fish']]; for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) { const [c, k] = toys[(i + r * 2) % 5], tx = x - 26 + i * 12, ty = y - 32 + r * 12; PE(G, tx, ty, 4, 4, c); if (k == 'bunny') { PF(G, tx - 3, ty - 8, 2, 5, c); PF(G, tx + 1, ty - 8, 2, 5, c) } PF(G, tx - 2, ty - 1, 1, 1, CP.ink); PF(G, tx + 1, ty - 1, 1, 1, CP.ink) } PF(G, x - 34, y - 6, 68, 6, '#3a0a1a'); PF(G, x - 34, y - 6, 68, 1, CP.gold) } },
  cashier: { w: 4, s: [0, -1, 4, 2], d(G, x, y) { SHD(G, x, y, 32, 5); PF(G, x - 32, y - 36, 64, 36, '#3a0a1a'); PF(G, x - 32, y - 36, 64, 3, CP.gold); PF(G, x - 26, y - 30, 52, 16, '#ffe0b0'); for (let i = 0; i < 52; i += 5) PF(G, x - 26 + i, y - 30, 1, 16, '#8a6a20'); PF(G, x - 32, y - 12, 64, 3, CP.gold); G.save(); G.font = 'bold 6px serif'; G.textAlign = 'center'; G.fillStyle = CP.gold; G.fillText('CASHIER', x, y - 3); G.restore() } },
  cardtable: { w: 3, s: [0, -1, 3, 2], d(G, x, y) { SHD(G, x, y, 24, 5); PF(G, x - 22, y - 22, 44, 18, '#5a2a10'); PF(G, x - 20, y - 22, 40, 14, '#1a6a3a'); PF(G, x - 20, y - 22, 40, 1, '#3a9a5a'); for (let i = 0; i < 5; i++) { PF(G, x - 16 + i * 7, y - 18, 5, 7, '#f4f0f4'); PF(G, x - 15 + i * 7, y - 16, 2, 2, i % 2 ? '#c81830' : CP.ink) } PF(G, x - 18, y - 6, 3, 6, '#3a1a08'); PF(G, x + 15, y - 6, 3, 6, '#3a1a08') } },
  piano: { w: 3, s: [0, -1, 3, 2], d(G, x, y) { SHD(G, x, y, 26, 5); PF(G, x - 22, y - 30, 44, 26, '#120810'); PF(G, x - 22, y - 30, 44, 2, '#3a2a3a'); PF(G, x - 20, y - 14, 40, 5, '#f4f0f4'); for (let i = 0; i < 40; i += 3) PF(G, x - 20 + i, y - 14, 1, 5, '#2a2a2a'); for (let i = 1; i < 40; i += 6) PF(G, x - 20 + i, y - 14, 2, 3, '#120810'); PF(G, x - 18, y - 4, 2, 4, '#120810'); PF(G, x + 16, y - 4, 2, 4, '#120810'); PF(G, x - 6, y - 26, 12, 8, '#f4f0e0') } },
  gplant: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7); PF(G, x - 5, y - 9, 10, 9, CP.gold); PF(G, x - 6, y - 10, 12, 2, '#fff0b0'); for (let i = 0; i < 6; i++) { const a = -2.6 + i * .45; for (let k = 0; k < 11; k++) PF(G, x + Math.cos(a) * k, y - 12 + Math.sin(a) * k * 1.2, 2, 2, k > 7 ? '#5ac06a' : '#2a7a3a') } } },
  sofa2: { w: 3, s: [0, -1, 3, 2], d(G, x, y) { SHD(G, x, y, 24, 5); PF(G, x - 22, y - 22, 44, 12, '#5a0820'); PF(G, x - 22, y - 12, 44, 10, '#8a1030'); PF(G, x - 24, y - 18, 5, 16, '#7a1030'); PF(G, x + 19, y - 18, 5, 16, '#7a1030'); for (let i = -16; i < 18; i += 8) PE(G, x + i, y - 17, 1, 1, CP.gold) } },
  pool: { w: 4, s: [0, -1, 4, 2], d(G, x, y) { SHD(G, x, y, 32, 5); PF(G, x - 30, y - 26, 60, 24, '#3a1408'); PF(G, x - 27, y - 23, 54, 18, '#0b6a5a'); PF(G, x - 27, y - 23, 54, 1, '#1a8a7a'); for (const [a, b] of [[-27, -23], [26, -23], [-27, -6], [26, -6], [-1, -23], [-1, -6]]) PF(G, x + a, y + b, 2, 2, CP.ink); [[-14, -16, CP.pink], [-10, -13, CP.cyan], [6, -15, '#ffe9a0'], [14, -11, '#111'], [-4, -10, CP.pink2]].forEach(([a, b, c]) => PE(G, x + a, y + b, 2, 2, c)); PF(G, x - 28, y - 4, 4, 4, '#2a0a04'); PF(G, x + 24, y - 4, 4, 4, '#2a0a04') } },
  jukebox: { s: S1, d(G, x, y) { SHD(G, x + 2, y, 9); PF(G, x - 9, y - 30, 18, 30, CP.mag2); PE(G, x, y - 30, 9, 7, CP.mag2); PE(G, x, y - 30, 7, 5, CP.pink); PF(G, x - 7, y - 26, 14, 10, '#0b1640'); for (let i = 0; i < 4; i++) PF(G, x - 6, y - 25 + i * 2.5, 12, 1, CP.cyan); PF(G, x - 7, y - 13, 14, 2, CP.pink); PF(G, x - 5, y - 9, 10, 6, '#2a0236') } },
  stage: { w: 6, flat: 1, d(G, x, y) { PF(G, x - 48, y - 30, 96, 30, '#3a0a1a'); PF(G, x - 48, y - 30, 96, 2, CP.gold); PF(G, x - 48, y - 4, 96, 4, '#1a0208'); for (let i = 0; i < 96; i += 8) PF(G, x - 48 + i, y - 2, 4, 2, CP.gold) } },
});
// the shopfront "Ramen-style" signs on interiors' walls
PROPS.npillar = { s: S1, d(G, x, y, P, s) { SHD(G, x + 2, y, 8); const c = s < .5 ? CP.pink : CP.cyan; PF(G, x - 6, y - 40, 12, 40, '#0b1640'); PF(G, x - 5, y - 40, 2, 40, c); PF(G, x + 3, y - 40, 2, 40, c); PF(G, x - 7, y - 42, 14, 3, CP.vio); PE(G, x, y - 20, 14, 22, 'rgba(255,90,138,.08)') } };
PROPS.vrope = { s: S1, d(G, x, y) { PF(G, x - 2, y - 14, 4, 14, '#c8a040'); PE(G, x, y - 15, 3, 2, CP.gold); for (let i = 0; i < 14; i++) PF(G, x + 2 + i, y - 12 + Math.sin(i / 14 * 3.14) * 3, 1, 2, '#a01838') } };
PROPS.roulette = { w: 2, s: [0, -1, 2, 2], d(G, x, y) { SHD(G, x + 2, y, 18, 5); PE(G, x, y - 10, 18, 10, '#3a1408'); PE(G, x, y - 11, 16, 9, '#1a6a3a'); PE(G, x - 5, y - 12, 6, 4, '#2a1a10'); PE(G, x - 5, y - 13, 5, 3, '#c8a040'); for (let i = 0; i < 8; i++) { const a = i * .785; PF(G, x - 5 + Math.cos(a) * 4, y - 13 + Math.sin(a) * 2, 1, 1, i & 1 ? '#e8402a' : '#111') } for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) PF(G, x + 2 + j * 3, y - 15 + i * 3, 2, 2, (i + j) & 1 ? '#e8402a' : '#111') } };
PROPS.steam2 = { flat: 1, d(G, x, y) { PF(G, x - 6, y - 4, 12, 4, '#14306a'); PF(G, x - 4, y - 6, 8, 2, '#1f5f96') } };
// ---------------------------------------------------------------- interactive casino objects (drawn every frame so their lights blink)
Object.assign(OBJ, {
  slotm: (x, y, e) => { const b = (tick >> 4) & 1; ell(x + 2, y + 1, 12, 3, 'rgba(0,0,0,.35)'); r(x - 11, y - 38, 22, 38, '#3a0a3a'); r(x - 10, y - 37, 20, 36, '#6a1a6a'); r(x - 11, y - 42, 22, 6, CP.gold); for (let i = 0; i < 5; i++) r(x - 9 + i * 4, y - 41, 2, 2, (i + b) % 2 ? '#fff6c8' : '#ff5a8a');
    r(x - 8, y - 33, 16, 11, '#f4f0f4'); const sy = [['#e85a5a', '#3a9a3a'], ['#d8a060', '#a86a2a'], ['#5ab8e8', '#2a68a8']]; for (let i = 0; i < 3; i++) { r(x - 7 + i * 5, y - 30, 4, 5, sy[(i + (e.at[0] % 3)) % 3][0]); r(x - 7 + i * 5, y - 26, 4, 1, sy[(i + (e.at[0] % 3)) % 3][1]) } r(x - 9, y - 20, 18, 3, '#2a0a2a'); r(x - 6, y - 16, 12, 2, CP.gold); r(x + 11, y - 30, 2, 12, '#c8c8d0'); ell(x + 12, y - 31, 3, 3, '#e8402a'); r(x - 8, y - 9, 16, 6, '#4a0a3a') },
  fusebox: (x, y) => { const fixed = false; r(x - 6, y - 22, 12, 16, '#14306a'); r(x - 5, y - 21, 10, 14, '#0b1640'); r(x - 3, y - 18, 6, 2, (tick >> 3) & 1 ? CP.pink : '#3a0a2a'); r(x - 3, y - 14, 6, 2, CP.cyan); r(x - 1, y - 6, 2, 6, CP.ink) },
  prize: (x, y) => { r(x - 4, y - 6, 8, 6, CP.gold) },
});
// ---------------------------------------------------------------- choices (a small list that appears over the dialogue box)
let CHO = null;
function choose(opts, cb) { CHO = { opts, i: 0, cb, t: 0 } }
function choUpdate() { CHO.t++; if (up()) { CHO.i = (CHO.i + CHO.opts.length - 1) % CHO.opts.length; beep(500, .03) } if (dn()) { CHO.i = (CHO.i + 1) % CHO.opts.length; beep(500, .03) } if (CHO.t > 6 && ok()) { const c = CHO; CHO = null; beep(700, .05); c.cb(c.i) } else if (esc()) { const c = CHO; CHO = null; c.cb(c.opts.length - 1) } }
function drawChoice() { if (CHO.q) { DL = { q: [CHO.q], i: 0, c: 999, pt: 99, age: 99, slide: 99, sp: CHO.q.n }; drawDialog(); DL = null } sU(); const w2 = Math.max(...CHO.opts.map(o => tw(o, 8))) + 26, h2 = CHO.opts.length * 12 + 8, x0 = W - w2 - 8, y0 = H - h2 - 50; r(x0, y0, w2, h2, '#fff'); r(x0 + 1, y0 + 1, w2 - 2, h2 - 2, '#000'); CHO.opts.forEach((o, i) => { if (i == CHO.i) { r(x0 + 6, y0 + 7 + i * 12, 4, 4, '#fff') } txt(o, x0 + 14, y0 + 4 + i * 12, i == CHO.i ? '#fff' : '#9a9ab0', 'left', 8) }) }
function ask(lines, opts, cb) { D(lines, () => { choose(opts, cb); const l = lines[lines.length - 1], i = l.indexOf('|'), [n, e] = l.slice(0, i).split(':'); CHO.q = { n, e: e || 'neutral', t: l.slice(i + 1) } }) }
// ---------------------------------------------------------------- items + lore for the city
Object.assign(ITEMDEF, {
  luckychip: { n: 'Lucky Chip', t: 'charm', luck: 3, d: 'A gold casino chip. On the back, someone scratched: "FOR THE NEXT ONE."' },
  bunny: { n: 'Stuffed Bunny', t: 'key', d: 'A prize from the casino counter. One ear is sewn on with blue thread.' },
  ticket: { n: 'Ticket No. 5', t: 'key', d: 'A paper ticket, very old. "No. 5 - PLEASE WAIT TO BE CALLED."' },
  shaker: { n: 'Cocktail Shaker', t: 'weapon', atk: 6, luck: 1, d: 'Vic\'s spare. Rattles like a maraca when you swing it.' },
  neonpipe: { n: 'Neon Tube', t: 'weapon', atk: 8, d: 'A hollow pink tube that still glows. Hana says it is "basically a sword."' }
});
['luckychip', 'bunny', 'ticket', 'shaker', 'neonpipe'].forEach(k => { ITIMG[k] = { spr: loadImg('assets/items/' + k + '.png'), por: loadImg('assets/items/' + k + '_portrait.png') } });
Object.assign(LORE, { ticket: 'Mina gave me ticket number five. She said everyone gets called eventually.', station: 'The trains at the station all leave at six. None of them has ever left.' });
Object.assign(ND, { gus: { n: 'Lucky Gus' }, pearl: { n: 'Pearl' }, mina: { n: 'Mina' }, vic: { n: 'Vic' }, hana: { n: 'Hana' }, sal: { n: 'Sal' }, dot: { n: 'Dot' }, rex: { n: 'Rex' }, fay: { n: 'Fay' } });
const EMOS = ['neutral', 'happy', 'laugh', 'sad', 'angry', 'shock', 'scared', 'worried', 'blush', 'dark', 'smug'];
['gus', 'pearl', 'mina', 'vic', 'hana', 'sal', 'dot', 'rex', 'fay'].forEach(id => { const c = ND[id]; c.key = 'npc_' + id; loadSheet(c.key); LK[c.n] = c; for (const emo of EMOS) PORTRAITS[c.key + ':' + emo] = loadImg('assets/portraits/' + c.key + '_' + PFILE(emo, c.key) + '.png') });
// ---------------------------------------------------------------- quests in the city and the casino
QUESTS.push(
  { id: 'luck', nm: 'Beginner\'s Luck', who: 'Mr. Chips', day: 4, start: 'luck1', steps: [['Win a line on any slot machine. (Casino Abyss: the floor upstairs)', 'sl_win'], ['Show Mr. Chips your winnings.', 'luck_done']] },
  { id: 'gus', nm: 'The Lucky Chip', who: 'Lucky Gus', day: 4, start: 'gus1', steps: [['Gus lost his lucky chip in the Casino Lounge (left of the slot floor). Look under the furniture.', 'gchip'], ['Give the chip back to Gus.', 'gus_done']] },
  { id: 'mina', nm: 'A Prize for Mina', who: 'Mina', day: 4, start: 'mina1', steps: [['Mina wants the stuffed bunny from Pearl\'s prize counter (Casino Lobby). It costs 100 Chips.', 'bunny'], ['Give the bunny to Mina, outside the casino.', 'mina_done']] },
  { id: 'lastcall', nm: 'Last Call', who: 'Vic', day: 4, start: 'vic1', steps: [['Tell Vic\'s three regulars it is last call: one plays at the arcade, one waits at the station, one sits on the rooftops.', 'reg3'], ['Go back to Vic\'s bar on Neon Street.', 'vic_done']] },
  { id: 'neon', nm: 'Neon Repair', who: 'Hana', day: 4, start: 'hana1', steps: [['Three neon signs are flickering: on Neon Street, in the Night Market and on the Plaza. Reset their fuse boxes.', 'neon3'], ['Tell Hana on the rooftops.', 'neon_done']] }
);
const _questCheck = questCheck;
questCheck = function () { if (S.fl.rg1 && S.fl.rg2 && S.fl.rg3) S.fl.reg3 = 1; if (S.fl.nf1 && S.fl.nf2 && S.fl.nf3) S.fl.neon3 = 1; if (S.items.includes('bunny')) S.fl.bunny = 1; _questCheck() };
Object.assign(QMARK, {
  chips: () => !F_('luck1') || (F_('sl_win') && !F_('luck_done')), gus: () => !F_('gus1') || (F_('gchip') && !F_('gus_done')), mina: () => !F_('mina1') || (S.items.includes('bunny') && !F_('mina_done')),
  vic: () => !F_('vic1') || (F_('reg3') && !F_('vic_done')), hana: () => !F_('hana1') || (F_('neon3') && !F_('neon_done')),
  kix: () => F_('vic1') && !F_('rg1'), sal: () => F_('vic1') && !F_('rg2'), dot: () => F_('vic1') && !F_('rg3')
});
Object.assign(NPC_DLG, {
  chips: () => !F_('luck1') ? N('chips', ['Mr. Chips:smug|A new face! Welcome to Casino Abyss, where the lights never go out and neither do you.', 'Mr. Chips:neutral|We play for Chips here. Here are twenty-five. The first ones are always free.', 'Mr. Chips:smug|Win a single line upstairs on the slots and I\'ll give you something lucky.'], () => { flag('luck1'); addChips(25) })
    : F_('sl_win') && !F_('luck_done') ? N('chips', ['Mr. Chips:happy|A winner! I could tell from the way you walked in.', 'Mr. Chips:neutral|Take this chip. Hold on to it. Someone always needs it more than you do.'], () => { flag('luck_done'); giveItem('luckychip') })
    : N('chips', [F_('d4_house') ? 'Mr. Chips:sad|...The House has gone quiet. I didn\'t know it could do that.' : 'Mr. Chips:neutral|The House lives at the very top. The House does not lose. Nobody has ever asked what it wins.', 'Mr. Chips:smug|Run out of Chips? The cashier window by the stairs swaps money for Chips. Very fair rates. Very.']),
  pearl: () => N('pearl', ['Pearl:happy|Prize counter! Everything here is real, probably.'], () => prizeCounter()),
  gus: () => !F_('gus1') ? N('gus', ['Lucky Gus:sad|My chip. My LUCKY chip. I had it in the lounge and now it\'s gone.', 'Lucky Gus:worried|Without it I can\'t win. Without it I can\'t even lose properly.', 'Lucky Gus:neutral|The lounge is through the left door on the slot floor. Please. I\'ll make it worth your while.'], () => flag('gus1'))
    : F_('gchip') && !F_('gus_done') ? N('gus', ['Lucky Gus:shock|You FOUND it! Under the sofa? Of course it was under the sofa.', 'Lucky Gus:happy|Here, forty Chips. Don\'t spend them all on the same machine. Spend them on different machines.'], () => { flag('gus_done'); addChips(40) })
    : N('gus', ['Lucky Gus:happy|Machine nine is hot tonight. Machine nine is always hot. There is no machine nine.']),
  mina: () => !F_('mina1') ? N('mina', ['Mina:sad|...They won\'t let me in. I\'m too small.', 'Mina:sad|There\'s a bunny on the prize shelf. A white one. I\'ve wanted it forever.', 'Mina:neutral|...Could you win it for me? Pearl gives it out for a hundred Chips.'], () => flag('mina1'))
    : S.items.includes('bunny') && !F_('mina_done') ? N('mina', ['Mina:shock|...The bunny!', 'Mina:happy|Thank you thank you thank you.', 'Mina:neutral|Here. I\'ve been holding this for ages. I think it\'s yours.', '|She gives you a paper ticket. It says No. 5. And a little wristwatch, stopped at six.'], () => { flag('mina_done'); S.items = S.items.filter(i => i != 'bunny'); giveItem('ticket'); giveItem('watch'); addLore('ticket') })
    : F_('mina_done') ? N('mina', ['Mina:happy|Bunny says hi.', 'Mina:neutral|They call the numbers in order, you know. You\'re after four.']) : N('mina', ['Mina:sad|A hundred Chips is a lot. Pearl\'s counter is inside, on the left.']),
  vic: () => !F_('vic1') ? N('vic', ['Vic:neutral|Evening. Juice? Juice. Everything here is juice. Don\'t tell anyone.', 'Vic:sad|My three regulars didn\'t show tonight. Kix, Sal and Dot. Never happened before.', 'Vic:neutral|Kix will be at the arcade. Sal waits at the station. Dot sits up on the rooftops, behind this street.', 'Vic:neutral|Tell them it\'s last call. They\'ll come.'], () => flag('vic1'))
    : F_('reg3') && !F_('vic_done') ? N('vic', ['Vic:happy|They\'re all coming. Good. Good.', 'Vic:neutral|Here. My spare shaker, and something for the slots. Last call is my favourite call.'], () => { flag('vic_done'); giveItem('shaker'); addChips(30) })
    : N('vic', ['Vic:neutral|Last call is at six. It\'s always nearly six.']),
  hana: () => !F_('hana1') ? N('hana', ['Hana:neutral|Oh. Hi. You\'re standing in my light.', 'Hana:worried|I\'m painting the signs from up here, but three of them keep flickering and I can\'t get the colour right.', 'Hana:neutral|Their fuse boxes are down on Neon Street, in the Night Market and on the Plaza. Just flip them. Please.'], () => flag('hana1'))
    : F_('neon3') && !F_('neon_done') ? N('hana', ['Hana:happy|They\'re steady! Look at that pink. That\'s the right pink.', 'Hana:neutral|Take this tube. It fell off a sign. It\'s basically a sword.'], () => { flag('neon_done'); giveItem('neonpipe') })
    : N('hana', ['Hana:neutral|From up here the whole city looks like it\'s painted on glass.', 'Hana:sad|Sometimes I think if I tap it, it\'ll ring.']),
  sal: () => F_('vic1') && !F_('rg2') ? N('sal', ['Sal:neutral|Last call? ...Already?', 'Sal:sad|I was waiting for the six o\'clock train. It\'s been six o\'clock for a while. Tell Vic I\'m on my way.'], () => flag('rg2')) : N('sal', ['Sal:neutral|Every train here leaves at six. None of them has left yet.', 'Sal:sad|I\'m not in a hurry. Nobody is.'], () => addLore('station')),
  dot: () => F_('vic1') && !F_('rg3') ? N('dot', ['Dot:neutral|...Vic sent you? Huh. It\'s last call already.', 'Dot:smug|Fine. I\'ll climb down. Slowly.'], () => flag('rg3')) : N('dot', ['Dot:neutral|You can see the tower from here. Its light blinks once a minute. I count them.', 'Dot:sad|I\'ve never got past six.']),
  rex: () => N('rex', ['Rex:smug|I\'m up nine hundred Chips. Or down. I stopped checking which.']),
  fay: () => N('fay', ['Fay:neutral|I come here every night. Every night is tonight.', 'Fay:happy|The juice is very good.'])
});
const _kix = NPC_DLG.kix; NPC_DLG.kix = e => F_('vic1') && !F_('rg1') ? N('kix', ['Kix:shock|Last call?! Is Vic okay?', 'Kix:neutral|Tell him I\'ll be there after this round. This round never ends, but still.'], () => flag('rg1')) : _kix(e);
const PRIZES = [['Lucky Gum x3', 20, () => bagAdd('gum', 3)], ['Bubble Tea x2', 35, () => bagAdd('bubble', 2)], ['Smelling Salts x2', 45, () => bagAdd('salts', 2)], ['Stuffed Bunny', 100, () => giveItem('bunny')]];
function prizeCounter() {
  const opts = PRIZES.map(([n, c]) => n + '  ' + c + ' Chips').concat(['Never mind']);
  ask(['Pearl:neutral|You have ' + (S.chips || 0) + ' Chips. What would you like?'], opts, i => { if (i >= PRIZES.length) return D(['Pearl:happy|Come back when you\'re luckier!']); const [n, c, give] = PRIZES[i];
    if ((n == 'Stuffed Bunny' && (S.items.includes('bunny') || F_('mina_done'))) || (n == 'Noise Cancelers' && S.items.includes('headphones'))) return D(['Pearl:neutral|You already have one of those. One per customer, per forever.']);
    if ((S.chips || 0) < c) return D(['Pearl:sad|Oh, you need ' + c + ' Chips for that. The slots upstairs are very generous. Sometimes.']);
    S.chips -= c; give(); D(['Pearl:happy|Here you go! ' + n + '! Enjoy it forever, or at least until six.']) });
}
// ---- events for city objects
Object.assign(EV, {
  slots(e) { if (S.day < 3) return; if ((S.chips || 0) <= 0 && !F_('luck1')) return D(['|The machine wants Chips. Mr. Chips, in the lobby, hands them out.']); slotMachine(e) },
  fuse(e) { const k = e.set; if (F_(k)) return D(['|The fuse box hums. The sign above it glows a steady colour.']); if (!F_('hana1')) return D(['|A fuse box. One of the switches is flipped down. The sign above it stutters.']); D(['|You flip the switch back up. Somewhere above, a sign stops stuttering.'], () => flag(k)) },
  gchip() { if (F_('gchip')) return D(['|Just dust under here now.']); if (!F_('gus1')) return D(['|Something gold is wedged under the sofa cushions.', 'Hitori:neutral|...Not mine.']); D(['|Under the sofa, wedged between cushions: a gold chip with a clover on it.', 'Hitori:smug|Hehe. Lucky.'], () => flag('gchip')) },
  stairsup() { go('n_roofs', S.a) }
});
