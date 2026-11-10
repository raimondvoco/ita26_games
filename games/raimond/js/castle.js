// ==================== CASTLE MORTIS ====================
// Maroon brick floors and two-tile brick walls, pink-flame braziers, hooded statues with red eyes,
// glowing red rune lines that run between orb pedestals, grand stairs, skulls, a pool of something red.
// The Hollow Knights, Squires and the Warden patrol it.
const XOBJ = {};   // extra animated object drawings, merged into OBJ once entities.js has loaded (see econ.js)
PAL.mortis = { ...PAL.castle, a: ['#33202c', '#2f1c28', '#38232f'], sp: '#24121c', wall: '#4a2836', wtop: '#1c0c16', carpet: '#3a3448', plaza: '#3a2430', pl2: '#2f1c28' };
PCOL.mortis = 'rgba(255,110,150,.55)';

// ---- floor: small maroon bricks with red petals; slate aisle (ground 11); stairs (12); raised dais (6)
function castleFloor(F, px, py, x, y, G, gnb) {
  const h = i => hsh(x, y, i);
  if (G == 12) {
    F(px, py, T, T, '#24121c'); for (let i = 0; i < 4; i++) { F(px, py + i * 4, T, 1, '#6e4656'); F(px, py + i * 4 + 1, T, 2, '#4a2c3a'); F(px, py + i * 4 + 3, T, 1, '#160a10') }
    if (!gnb(x - 1, y, 12)) { F(px, py, 3, T, '#160a10'); F(px + 3, py, 1, T, '#5a3646') } if (!gnb(x + 1, y, 12)) { F(px + 13, py, 3, T, '#160a10'); F(px + 12, py, 1, T, '#2a1620') } return;
  }
  if (G == 11) {
    F(px, py, T, T, '#18121e'); F(px + 1, py + 1, 14, 14, h(3) < .5 ? '#3a3448' : '#35304a'); F(px + 1, py + 1, 14, 1, '#4c4660'); F(px + 1, py + 1, 1, 14, '#433d56');
    if (h(4) < .35) F(px + 3 + h(5) * 8, py + 4 + h(6) * 8, 4, 1, '#2a2438'); if (h(7) < .15) F(px + 6, py + 9, 1, 3, '#2a2438'); return;
  }
  const base = G == 6 ? ['#4c2e3e', '#47293a', '#523242'] : ['#33202c', '#2f1c28', '#38232f'];
  for (let rw = 0; rw < 2; rw++) {
    const by = py + rw * 8, off = ((y * 2 + rw) & 1) ? 8 : 0, c1 = base[(hsh(x * 2, y * 2 + rw, 7) * 3) | 0], c2 = base[(hsh(x * 2 + 1, y * 2 + rw, 7) * 3) | 0];
    if (off) { F(px, by, 8, 8, c1); F(px + 8, by, 8, 8, c2) } else F(px, by, T, 8, c1);
    F(px, by, T, 1, G == 6 ? '#5e3a4c' : '#3f2834'); F(px, by + 7, T, 1, '#1a0e16'); F(px + off, by, 1, 8, '#1a0e16');
  }
  if (h(9) < .2) { const a = px + 3 + h(10) * 9, b = py + 3 + h(11) * 9; F(a, b, 2, 1, '#9a1a2c'); F(a + 1, b + 1, 1, 1, '#c8303e'); F(a + 3, b + 2, 1, 1, '#7a1424') }
  if (h(12) < .08) { F(px + 4, py + 10, 5, 1, '#1a0e16'); F(px + 8, py + 11, 3, 1, '#1a0e16') }
}
// ---- walls: two rows of brick face (with a cap ledge and a dark skirting), dark brick tops
function castleWall(g, mp, x, y, px, py) {
  const w = mp.w, h = mp.h, tv = (a, b) => a >= 0 && b >= 0 && a < w && b < h ? mp.t[b * w + a] : 3, isW = v => v == 3 || v == 5, F = (a, b, c, d, col) => { g.fillStyle = col; g.fillRect(a, b, c, d) };
  const b1 = tv(x, y + 1), b2 = tv(x, y + 2), low = !isW(b1) && y < h - 2, up = isW(b1) && !isW(b2) && y < h - 3 && b2 != 255;
  if (low || up) {
    const cols = ['#4a2836', '#42222f', '#52303e'];
    for (let i = 0; i < 4; i++) { const row = y * 4 + i, off = row & 1 ? 4 : 0; for (let bx = -off; bx < 16; bx += 8) { const x0 = Math.max(0, bx), x1 = Math.min(16, bx + 8); F(px + x0, py + i * 4, x1 - x0, 4, cols[(hsh(x * 3 + (bx >> 3), row, 13) * 3) | 0]); F(px + x0, py + i * 4, x1 - x0, 1, '#5c3846') } F(px, py + i * 4 + 3, T, 1, '#24121c'); for (let bx = off; bx < 16; bx += 8) F(px + bx, py + i * 4, 1, 4, '#24121c') }
    if (up) { F(px, py, T, 3, '#6a4050'); F(px, py, T, 1, '#83586a'); F(px, py + 3, T, 1, '#1c0c16') }
    if (low) { F(px, py + 13, T, 3, '#1c0c16'); F(px, py + 12, T, 1, '#2e1824'); if (hsh(x, y, 21) < .07) { F(px + 4, py + 4, 8, 6, '#120810'); for (let i = 0; i < 3; i++) F(px + 5 + i * 3, py + 4, 1, 6, '#3a2430') } }
    if (!isW(tv(x - 1, y))) F(px, py, 2, T, '#2a1420'); if (!isW(tv(x + 1, y))) F(px + 14, py, 2, T, '#1c0c16');
    return;
  }
  F(px, py, T, T, '#1c0c16'); for (let i = 0; i < 2; i++) { F(px, py + i * 8 + 7, T, 1, '#160810'); F(px + ((y * 2 + i) & 1 ? 8 : 0), py + i * 8, 1, 8, '#160810') }
  if (hsh(x, y, 5) < .3) F(px + 3, py + 3, 4, 1, '#26121e');
  const rim = '#4a2836'; if (!isW(tv(x - 1, y)) && tv(x - 1, y) != 255) F(px, py, 2, T, rim); if (!isW(tv(x + 1, y)) && tv(x + 1, y) != 255) F(px + 14, py, 2, T, rim); if (y > 0 && !isW(tv(x, y - 1))) F(px, py, T, 2, rim);
}

// ---- props
const CC = { o: '#120810', d: '#24141c', m: '#3a2430', l: '#54343f', hl: '#6e4656', stone: '#4a2c3a' };
Object.assign(PROPS, {
  hstatue: { s: S1, d(G, x, y) {   // hooded figure on a plinth; two red points where a face should be
    SHD(G, x + 2, y, 12, 3); PF(G, x - 11, y - 8, 22, 8, CC.o); PF(G, x - 10, y - 8, 20, 7, CC.stone); PF(G, x - 10, y - 8, 20, 1, CC.hl); PF(G, x - 10, y - 2, 20, 1, CC.d);
    for (let i = 0; i < 28; i++) { const yy = y - 9 - i, hw = Math.round(10 - i * .17); PF(G, x - hw - 1, yy, hw * 2 + 2, 1, CC.o); PF(G, x - hw, yy, hw * 2, 1, CC.m); PF(G, x - hw, yy, 3, 1, CC.l); PF(G, x + hw - 3, yy, 3, 1, CC.d); if (i % 6 == 2) PF(G, x - hw + 4, yy, 2, 1, CC.d) }
    PF(G, x - 1, y - 32, 2, 22, CC.d); PF(G, x - 6, y - 24, 12, 4, CC.l); PF(G, x - 6, y - 21, 12, 1, CC.d);
    PE(G, x, y - 40, 8, 9, CC.o); PE(G, x, y - 40, 7, 8, CC.m); PE(G, x - 2, y - 43, 3, 3, CC.l); PE(G, x, y - 38, 4.5, 5, '#070306');
    PE(G, x - 2, y - 39, 3, 2, 'rgba(255,40,50,.3)'); PE(G, x + 2, y - 39, 3, 2, 'rgba(255,40,50,.3)'); PF(G, x - 3, y - 39, 2, 1, '#ff3a3a'); PF(G, x + 1, y - 39, 2, 1, '#ff3a3a');
  } },
  orbped: { s: S1, d(G, x, y, P, s, p) {   // a stone column holding a glowing orb
    const c = (p && p.c) || '#c040e0'; SHD(G, x + 1, y, 8, 3); PF(G, x - 7, y - 5, 14, 5, CC.o); PF(G, x - 6, y - 5, 12, 4, CC.stone); PF(G, x - 6, y - 5, 12, 1, CC.hl);
    PF(G, x - 5, y - 24, 10, 19, CC.o); PF(G, x - 4, y - 24, 8, 19, CC.m); PF(G, x - 4, y - 24, 2, 19, CC.l); PF(G, x + 2, y - 24, 2, 19, CC.d); PF(G, x - 7, y - 27, 14, 4, CC.o); PF(G, x - 6, y - 27, 12, 3, CC.l);
    PE(G, x, y - 32, 9, 8, 'rgba(255,80,160,.15)'); PE(G, x, y - 32, 5, 5, CC.o); PE(G, x, y - 32, 4.2, 4.2, c); PE(G, x + 1, y - 31, 2.5, 2.5, sh(c, .7)); PF(G, x - 2, y - 35, 2, 2, '#fff');
  } },
  altar: { s: S1, d(G, x, y) {   // a sword driven into a carved block, an orb in its hilt
    SHD(G, x + 2, y, 13, 3); PF(G, x - 12, y - 12, 24, 12, CC.o); PF(G, x - 11, y - 12, 22, 11, CC.stone); PF(G, x - 11, y - 12, 22, 2, CC.hl); PF(G, x - 7, y - 8, 14, 5, CC.d); PF(G, x - 1, y - 8, 2, 5, '#c02a3a');
    PF(G, x - 2, y - 36, 4, 25, CC.o); PF(G, x - 1, y - 36, 2, 24, '#9a8a98'); PF(G, x - 8, y - 38, 16, 3, CC.o); PF(G, x - 7, y - 37, 14, 1, '#7a6a78'); PF(G, x - 2, y - 46, 4, 9, '#3a2a30');
    PE(G, x, y - 49, 7, 6, 'rgba(200,80,255,.2)'); PE(G, x, y - 49, 4, 4, CC.o); PE(G, x, y - 49, 3.2, 3.2, '#c050e8'); PF(G, x - 1, y - 51, 1, 1, '#fff');
  } },
  skulls: { flat: 1, d(G, x, y, P, s) {   // a skull and a couple of bones
    y -= 3; const b = '#cdbcc6', bd = '#8a7486'; const bone = (x0, y0, dx, dy, n) => { for (let i = 0; i < n; i++) PF(G, x0 + dx * i, y0 + dy * i, 2, 2, b); PE(G, x0 - 1, y0, 1.6, 1.6, b); PE(G, x0 + dx * n + 1, y0 + dy * n, 1.6, 1.6, b) };
    bone(x - 9, y - 1, 1, .4, 9); bone(x + 2, y + 2, 1, -.5, 7); PE(G, x - 2, y - 4, 5, 4.5, bd); PE(G, x - 2, y - 5, 5, 4, b); PF(G, x - 5, y - 1, 6, 3, b); PE(G, x - 4, y - 4, 1.4, 1.6, '#2a1620'); PE(G, x, y - 4, 1.4, 1.6, '#2a1620'); PF(G, x - 4, y + 1, 1, 1, bd); PF(G, x - 2, y + 1, 1, 1, bd);
    if (s > .5) { PE(G, x + 9, y - 1, 3, 2.6, bd); PE(G, x + 9, y - 2, 3, 2.4, b); PF(G, x + 8, y - 2, 1, 1, '#2a1620'); PF(G, x + 10, y - 2, 1, 1, '#2a1620') }
  } },
  rune: { flat: 1, d(G, x, y, P, s, p) {   // glowing red lines along the floor (pts = absolute tile coords, joined at tile centres)
    const pts = p.pts || []; for (let k = 0; k < pts.length - 1; k++) { const [ax, ay] = pts[k], [bx, by] = pts[k + 1], x0 = Math.min(ax, bx) * T + 7, y0 = Math.min(ay, by) * T + 7, ww = Math.abs(bx - ax) * T + 3, hh = Math.abs(by - ay) * T + 3;
      PF(G, x0 - 1, y0 - 1, ww + 2, hh + 2, 'rgba(120,10,30,.45)'); PF(G, x0, y0, ww, hh, '#7a0a1e'); PF(G, x0 + (ww > 3 ? 0 : 1), y0 + (hh > 3 ? 0 : 1), ww > 3 ? ww : 1, hh > 3 ? hh : 1, '#ff3a48') }
    for (const [a, b] of pts) { PF(G, a * T + 6, b * T + 6, 5, 5, '#7a0a1e'); PF(G, a * T + 7, b * T + 7, 3, 3, '#ff5a64') }
  } },
  tablet: { flat: 1, d(G, x, y, P, s) {   // a carved stone tablet set against the wall
    PF(G, x - 11, y - 30, 22, 30, CC.o); PF(G, x - 10, y - 29, 20, 28, CC.m); PF(G, x - 10, y - 29, 20, 2, CC.hl); PF(G, x - 8, y - 25, 16, 20, CC.d); PF(G, x - 7, y - 24, 14, 18, CC.m);
    if (s < .5) { PE(G, x, y - 15, 5, 6, CC.d); PE(G, x, y - 15, 3, 4, CC.m); PF(G, x - 1, y - 22, 2, 14, CC.d) } else { PF(G, x - 4, y - 22, 2, 7, CC.d); PF(G, x + 2, y - 22, 2, 7, CC.d); PE(G, x, y - 12, 5, 4, CC.d); PF(G, x - 1, y - 13, 1, 1, '#c02a3a'); PF(G, x + 1, y - 13, 1, 1, '#c02a3a') }
  } },
  sealdoor: { flat: 1, w: 3, d(G, x, y) {   // a tall sealed double door with a burning glyph
    PF(G, x - 22, y - 44, 44, 44, CC.o); PF(G, x - 20, y - 42, 40, 42, '#2a1420'); PE(G, x, y - 42, 20, 8, '#2a1420'); PF(G, x - 18, y - 38, 17, 38, '#3a1c2a'); PF(G, x + 1, y - 38, 17, 38, '#341826'); PF(G, x - 1, y - 38, 2, 38, CC.o);
    for (const d of [-1, 1]) { PF(G, x + d * 9 - 1, y - 32, 2, 16, '#ff3a48'); PF(G, x + d * 5 - 1, y - 28, 2, 10, '#c0202e'); PF(G, x + d * 13 - 1, y - 24, 2, 8, '#c0202e'); PF(G, x + d * 9 - 3, y - 34, 6, 2, '#ff3a48') }
    PE(G, x, y - 46, 6, 5, CC.o); PE(G, x, y - 46, 4, 3.5, '#ff3a48'); PE(G, x, y - 46, 2, 1.6, '#ffc0c0');
  } },
  cpil2: { s: S1, d(G, x, y) {   // maroon stone column
    SHD(G, x + 2, y, 10, 3); PF(G, x - 9, y - 7, 18, 7, CC.o); PF(G, x - 8, y - 7, 16, 6, CC.stone); PF(G, x - 8, y - 7, 16, 1, CC.hl);
    PF(G, x - 7, y - 54, 14, 47, CC.o); PF(G, x - 6, y - 54, 12, 47, CC.m); PF(G, x - 6, y - 54, 3, 47, CC.l); PF(G, x + 3, y - 54, 3, 47, CC.d); PF(G, x - 1, y - 54, 1, 47, CC.d);
    PF(G, x - 9, y - 60, 18, 7, CC.o); PF(G, x - 8, y - 59, 16, 5, CC.l); PF(G, x - 8, y - 59, 16, 1, CC.hl);
  } },
  bpool: { flat: 1, d(G, x, y, P, s, p) {   // a sunken pool of something dark red (p.w, p.h tiles from the anchor)
    const w = (p.w || 3) * T, h = (p.h || 2) * T, x0 = x - 8, y0 = y - 16; PF(G, x0, y0, w, h, CC.o); PF(G, x0 + 2, y0 + 2, w - 4, h - 4, '#6a0a1a');
    for (let j = 0; j < h - 6; j += 3) for (let i = 0; i < w - 6; i += 5) { const k = hsh(i, j, 77); if (k < .35) PF(G, x0 + 3 + i, y0 + 3 + j, 3, 1, k < .12 ? '#c0283a' : '#8a1224') }
    PF(G, x0 + 2, y0 + 2, w - 4, 2, '#3a0610');
  } },
  wrack: { w: 2, s: S2, d(G, x, y) {   // weapon rack: swords and spears
    SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 26, 30, 3, '#3a2010'); PF(G, x - 15, y - 6, 30, 3, '#3a2010'); PF(G, x - 15, y - 26, 3, 26, '#3a2010'); PF(G, x + 12, y - 26, 3, 26, '#3a2010'); PF(G, x - 15, y - 26, 30, 1, '#6a4428');
    for (let i = 0; i < 5; i++) { const sx = x - 10 + i * 5; if (i % 2) { PF(G, sx, y - 38, 2, 34, '#5a3a22'); PF(G, sx - 1, y - 42, 4, 5, '#c8d0d8') } else { PF(G, sx, y - 32, 2, 24, '#b8c0c8'); PF(G, sx - 2, y - 10, 6, 2, '#7a5a30'); PF(G, sx, y - 8, 2, 4, '#3a2010') } }
  } },
  ktable: { w: 3, s: S3, d(G, x, y) {   // long barracks table with goblets and a candle
    SHD(G, x + 2, y, 26, 4); PF(G, x - 24, y - 8, 3, 8, '#2a1408'); PF(G, x + 21, y - 8, 3, 8, '#2a1408'); PF(G, x - 25, y - 16, 50, 9, '#3a1e0e'); PF(G, x - 25, y - 16, 50, 2, '#6a3e22'); PF(G, x - 25, y - 9, 50, 2, '#2a1408');
    for (const gx of [-16, -4, 12]) { PF(G, gx + x, y - 21, 4, 4, '#b89a4a'); PF(G, gx + x + 1, y - 18, 2, 2, '#8a6a2a') } PF(G, x + 3, y - 24, 3, 8, '#e8e0d0'); PF(G, x + 3, y - 27, 3, 3, '#ffb03a');
  } },
  kbench: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 14, 3); PF(G, x - 13, y - 5, 2, 5, '#2a1408'); PF(G, x + 11, y - 5, 2, 5, '#2a1408'); PF(G, x - 14, y - 9, 28, 5, '#3a1e0e'); PF(G, x - 14, y - 9, 28, 1, '#6a3e22') } },
  karmor: { s: S1, d(G, x, y) {   // an empty suit of armour on a stand, tabard in castle red
    SHD(G, x + 1, y, 8, 3); PF(G, x - 6, y - 3, 12, 3, '#2a1408'); PF(G, x - 4, y - 14, 3, 11, '#5a5a6a'); PF(G, x + 1, y - 14, 3, 11, '#4a4a5a'); PF(G, x - 7, y - 28, 14, 15, '#7a7a8a'); PF(G, x - 7, y - 28, 3, 15, '#a8a8b8');
    PF(G, x - 4, y - 24, 8, 12, '#7a1a2e'); PF(G, x - 1, y - 24, 2, 12, '#c8a040'); PE(G, x, y - 33, 6, 6, '#6a6a7a'); PF(G, x - 4, y - 34, 8, 2, '#120810'); PF(G, x - 1, y - 40, 2, 4, '#a01a3a');
  } },
  tomb: { w: 2, s: S2, d(G, x, y, P, s) {   // a stone coffin with a carved lid
    SHD(G, x + 2, y, 16, 3); PF(G, x - 14, y - 14, 28, 14, CC.o); PF(G, x - 13, y - 14, 26, 13, CC.stone); PF(G, x - 13, y - 14, 26, 6, CC.l); PF(G, x - 13, y - 14, 26, 1, CC.hl); PF(G, x - 13, y - 8, 26, 1, CC.o);
    PF(G, x - 1, y - 13, 2, 5, CC.d); PF(G, x - 4, y - 12, 8, 1, CC.d); if (s > .5) PF(G, x + 6, y - 6, 3, 3, '#c02a3a');
  } },
  chains: { flat: 1, d(G, x, y) { for (const dx of [-5, 4]) for (let i = 0; i < 7; i++) { PF(G, x + dx, y - 40 + i * 4, 2, 3, i % 2 ? '#3a3440' : '#5a5464') } PF(G, x - 6, y - 12, 4, 3, '#3a3440'); PF(G, x + 3, y - 12, 4, 3, '#3a3440') } },
});
// ---- the brazier: a stone pedestal holding a pink, breathing flame (animated; lights the dark)
XOBJ.brazier = (x, y, e) => {
  const t = tick + (e.at ? e.at[0] * 7 : 0), f = Math.sin(t / 5) * 1.5, f2 = Math.sin(t / 3.3) * 1;
  ell(x + 2, y, 10, 3, 'rgba(0,0,0,.35)'); r(x - 8, y - 14, 16, 14, '#120810'); r(x - 7, y - 13, 14, 12, '#4a2c3a'); r(x - 7, y - 13, 14, 2, '#6e4656'); r(x - 7, y - 4, 14, 2, '#2a1620'); r(x - 3, y - 10, 6, 4, '#2a1620');
  r(x - 9, y - 18, 18, 5, '#120810'); r(x - 8, y - 17, 16, 3, '#5a3646'); r(x - 8, y - 17, 16, 1, '#7a5262');
  X.globalCompositeOperation = 'lighter'; ell(x, y - 26, 20, 17, 'rgba(255,60,130,.07)'); ell(x, y - 25, 10, 10, 'rgba(255,110,170,.12)'); X.globalCompositeOperation = 'source-over';
  ell(x, y - 20, 6.5, 3.5, '#d03070'); ell(x + f2 * .5, y - 24, 5.5, 6, '#ff5a98'); ell(x + f * .6, y - 29, 3.5, 5, '#ff86b6'); ell(x + f, y - 33, 1.6, 3, '#ffb0d0'); ell(x, y - 22, 3.2, 3.5, '#ffd0e4'); ell(x + f * .3, y - 23, 1.5, 2.2, '#fff');
  for (let i = 0; i < 3; i++) { const q = (t * .7 + i * 17) % 30; r(x + Math.sin(q * .4 + i * 2) * 4, y - 28 - q, 1, 1, 'rgba(255,170,210,' + (1 - q / 30).toFixed(2) + ')') }
};
const brazier = (x, y) => deco('brazier', x, y, [0, 0, 1, 1], { glow: 1 });

// ---- the rooms
const MORTIS = { pal: 'mortis', interior: true, floor: 'cbrick', wall: 'cbrick', dark: true, darkA: .5, mus: 'scary' };
A('c_hall', { ...MORTIS, nm: 'Castle Mortis: Great Hall', w: 40, h: 28,
  feat: [{ k: 'wall', x: 2, y: 2, w: 12, h: 6 }, { k: 'wall', x: 26, y: 2, w: 12, h: 6 }, { k: 'wall', x: 2, y: 22, w: 6, h: 4 }, { k: 'wall', x: 32, y: 22, w: 6, h: 4 },
    { k: 'ground', x: 16, y: 2, w: 8, h: 7, g: 12 }, { k: 'ground', x: 18, y: 9, w: 4, h: 19, g: 11 }, { k: 'ground', x: 14, y: 2, w: 2, h: 7, g: 6 }, { k: 'ground', x: 24, y: 2, w: 2, h: 7, g: 6 },
    p('rune', 0, 0, { pts: [[19, 15], [10, 15], [10, 12]] }), p('rune', 0, 0, { pts: [[20, 15], [29, 15], [29, 12]] }), p('rune', 0, 0, { pts: [[19, 15], [19, 10]] }),
    p('orbped', 10, 12, { c: '#c040e0' }), p('orbped', 29, 12, { c: '#e0402a' }), p('altar', 19, 16),
    p('hstatue', 4, 9), p('hstatue', 12, 9), p('hstatue', 27, 9), p('hstatue', 35, 9), p('cpil2', 15, 10), p('cpil2', 24, 10), p('cpil2', 9, 21), p('cpil2', 30, 21),
    p('tablet', 6, 7, { seed: .2 }), p('tablet', 33, 7, { seed: .8 }), p('chains', 3, 7), p('chains', 36, 7), p('karmor', 4, 18), p('karmor', 35, 18),
    p('skulls', 23, 19, { seed: .8 }), p('skulls', 5, 13, { seed: .2 }), p('skulls', 33, 24, { seed: .6 }), p('candles', 13, 24), p('candles', 26, 24), p('web', 2, 8), p('bones', 31, 17)],
  exits: [ex('down', 19, 20, 'g_castle'), ex('up', 19, 20, 'c_throne'), ex('left', 15, 16, 'c_armory'), ex('right', 15, 16, 'c_crypt')],
  ents: [brazier(14, 8), brazier(25, 8), brazier(9, 19), brazier(30, 19), brazier(16, 25), brazier(23, 25),
    npc('rattles', 8, 15), deco('shelf', 3, 11, [-1, 0, 2, 1]), obj('shelf', 3, 11, ['|Books with no titles. Every page is the same page.'], { quiet: 1 }),
    obj('altar', 19, 16, ['|A sword sunk to the hilt in a block of stone. The orb in its pommel hums when you get close.', 'Hitori:neutral|...It\'s not stuck. It just doesn\'t want to come out.'], { solid: [0, 0, 1, 1], inv: 1 }),
    obj('orb', 10, 12, ['|A purple orb on a stone column. Inside it, very small, a room with four beds.'], { inv: 1, solid: [0, 0, 1, 1] }), obj('orb', 29, 12, ['|A red orb. It is warm, like a hand that has been holding yours for a long time.'], { inv: 1, solid: [0, 0, 1, 1] }),
    obj('hstat', 12, 9, ['|A hooded statue. Under the hood, two red points of light follow you.', 'Hitori:scared|~...Don\'t look at it. If you don\'t look at it, it isn\'t looking at you.'], { inv: 1 }),
    obj('tablet', 6, 7, ['|A carved tablet: a circle with a line through it. Someone has scratched "4" next to it, over and over.'], { inv: 1 }), obj('tablet', 33, 7, ['|A tablet carved with a rabbit. Its eyes have been painted red, recently.'], { inv: 1 }),
    en('knight', 30, 18, 2, 3), chest('c:c_hall', 35, 20, { item: 'umbrella' }), obj('mirror', 34, 12, ['|A tall mirror. Your reflection arrives a moment after you do.'], { lore: 'mirror' })] });

A('c_armory', { ...MORTIS, nm: 'Castle Mortis: Barracks', w: 28, h: 18,
  feat: [{ k: 'wall', x: 2, y: 2, w: 6, h: 4 },     p('wrack', 10, 3), p('wrack', 15, 3), p('wrack', 20, 3), p('karmor', 3, 8), p('karmor', 5, 8), p('karmor', 7, 8), p('ktable', 13, 13), p('kbench', 12, 15), p('kbench', 16, 15), p('kbench', 12, 11), p('kbench', 16, 11),
    p('skulls', 22, 14, { seed: .3 }), p('tablet', 4, 5, { seed: .8 }), p('chains', 25, 3), p('bones', 4, 14), p('web', 25, 15)],
  exits: [ex('right', 8, 9, 'c_hall')],
  ents: [brazier(9, 6), brazier(24, 6), brazier(3, 15),
    obj('roster', 24, 11, ['|A roster nailed to the wall. Every knight on it has the same name, written in four different hands.', '|At the bottom, in crayon: "NO GIRLS ALOUD." Somebody has corrected the spelling in red pen.'], { solid: [0, 0, 1, 1] }),
    obj('helmet', 13, 13, ['|A helmet sits on the table like a guest. It is empty. It is still warm.'], { inv: 1 }),
    obj('wrack', 15, 3, ['|Swords, all of them wooden underneath the paint.', 'Hitori:neutral|...We made these. Steven made these. In his garage.'], { inv: 1 }),
    en('squire', 8, 13, 2, 3), chest('c:c_armory', 25, 14, { money: 24 })] });

A('c_crypt', { ...MORTIS, nm: 'Castle Mortis: Ossuary', w: 28, h: 20, darkA: .62,
  feat: [{ k: 'wall', x: 10, y: 2, w: 8, h: 5 }, { k: 'solid', x: 3, y: 13, w: 6, h: 4 }, 
    p('bpool', 3, 13, { w: 6, h: 4 }), p('sealdoor', 14, 6), p('hstatue', 8, 7), p('hstatue', 20, 7), p('tomb', 4, 5), p('tomb', 23, 5, { seed: .8 }), p('tomb', 22, 15), p('tomb', 13, 16, { seed: .8 }),
    p('skulls', 18, 11, { seed: .8 }), p('skulls', 9, 17, { seed: .3 }), p('skulls', 25, 10, { seed: .7 }), p('bones', 17, 15), p('candles', 11, 10), p('candles', 17, 9), p('chains', 3, 3), p('chains', 24, 3),
    p('rune', 0, 0, { pts: [[14, 8], [14, 12], [7, 12]] }), p('rune', 0, 0, { pts: [[14, 12], [21, 12], [21, 14]] })],
  exits: [ex('left', 9, 10, 'c_hall')],
  ents: [brazier(11, 8), brazier(17, 8), brazier(25, 17),
    obj('sealdoor', 14, 7, [], { inv: 1, ev: 'dgdoor' }),
    obj('pool', 6, 17, ['|The pool is red and perfectly still. There is no reflection in it. Not even the ceiling.'], { inv: 1 }),
    obj('tomb', 22, 15, ['|A stone coffin. The name has been chiselled off. The dates are both tomorrow.'], { inv: 1 }),
    en('warden', 14, 11, 1, 2), chest('c:c_crypt', 24, 17, { money: 35 })] });

A('c_throne', { ...MORTIS, nm: 'Castle Mortis: Throne Room', w: 32, h: 22,
  feat: [{ k: 'ground', x: 10, y: 2, w: 12, h: 5, g: 6 }, { k: 'ground', x: 13, y: 7, w: 6, h: 2, g: 12 }, { k: 'ground', x: 15, y: 9, w: 2, h: 13, g: 11 }, { k: 'wall', x: 2, y: 2, w: 5, h: 5 }, { k: 'wall', x: 25, y: 2, w: 5, h: 5 },
    p('sealdoor', 14, 2, { dx: 8 }), p('rune', 0, 0, { pts: [[15, 6], [15, 20]] }), p('rune', 0, 0, { pts: [[16, 6], [16, 20]] }), p('rune', 0, 0, { pts: [[15, 13], [8, 13], [8, 10]] }), p('rune', 0, 0, { pts: [[16, 13], [23, 13], [23, 10]] }),
    p('orbped', 8, 10, { c: '#c040e0' }), p('orbped', 23, 10, { c: '#e0402a' }), p('hstatue', 9, 7), p('hstatue', 22, 7), p('cpil2', 5, 11), p('cpil2', 26, 11), p('cpil2', 5, 17), p('cpil2', 26, 17),
    p('skulls', 11, 17, { seed: .8 }), p('skulls', 21, 15, { seed: .3 }), p('tablet', 4, 6, { seed: .2 }), p('tablet', 27, 6, { seed: .8 }), p('chains', 8, 1), p('chains', 23, 1), p('bones', 25, 19)],
  exits: [ex('down', 15, 16, 'c_hall'), ex('up', 15, 16, 'c_library')],
  ents: [brazier(12, 3), brazier(19, 3), brazier(11, 8), brazier(20, 8), brazier(3, 19), brazier(28, 19),
    obj('throne', 16, 4, ['|An empty throne. The cushion has an indent in it, as if someone sat down a moment ago.'], { solid: [-1, -2, 2, 3] }), trig('throne', 'throne', 10, 8, 12, 6, { day: 2 }),
    obj('orb', 8, 10, ['|The purple orb shows the hollow tree, in summer, from very high up.'], { inv: 1, solid: [0, 0, 1, 1] }), obj('orb', 23, 10, ['|The red orb shows a hallway with a long green floor. A door at the end is open a crack.'], { inv: 1, solid: [0, 0, 1, 1] })] });
// ---- the throne: carved from the same maroon stone as the hall, a pointed arch for a back, a red rune burning in it
XOBJ.throne = (x, y) => {
  const k = 'throne', sp = THRONE_SPR || (THRONE_SPR = propSprite({ w: 3, d(G, cx, by) {
    const c = CC, R_ = (a, b, w, h, col) => PF(G, cx + a, by + b, w, h, col);
    SHD(G, cx + 2, by, 22, 4); R_(-20, -10, 40, 10, c.o); R_(-19, -10, 38, 9, c.stone); R_(-19, -10, 38, 2, c.hl); R_(-19, -3, 38, 2, c.d);           // step
    R_(-14, -62, 28, 54, c.o); R_(-13, -61, 26, 52, c.m); R_(-13, -61, 4, 52, c.l); R_(9, -61, 4, 52, c.d);                                          // back slab
    for (let i = 0; i < 9; i++) { const w = 26 - i * 3; R_(-w / 2, -70 - i * 2, w, 2, i % 2 ? c.l : c.m) } R_(-1, -90, 2, 6, c.l); PE(G, cx, by - 91, 2, 2, '#ff3a48');   // pointed arch
    R_(-9, -54, 18, 30, c.d); PE(G, cx, by - 54, 9, 6, c.d); R_(-1, -50, 2, 22, '#ff3a48'); R_(-6, -44, 12, 2, '#ff3a48'); R_(-5, -36, 2, 6, '#c0202e'); R_(3, -36, 2, 6, '#c0202e'); PE(G, cx, by - 52, 2.5, 2.5, '#ffb0b0');
    for (const d of [-1, 1]) { R_(d * 15 - 5, -30, 10, 22, c.o); R_(d * 15 - 4, -29, 8, 20, c.stone); R_(d * 15 - 4, -29, 8, 2, c.hl); PE(G, cx + d * 15, by - 33, 5, 4, c.o); PE(G, cx + d * 15, by - 33, 4, 3, '#cdbcc6'); PF(G, cx + d * 15 - 2, by - 34, 1, 1, c.o); PF(G, cx + d * 15 + 1, by - 34, 1, 1, c.o);
      R_(d * 14 - 3, -66, 6, 6, c.o); PE(G, cx + d * 14, by - 70, 3, 5, c.l) }
    R_(-11, -22, 22, 12, c.o); R_(-10, -21, 20, 10, '#4a1a2a'); R_(-10, -21, 20, 2, '#6a2a3a'); R_(-10, -13, 20, 2, c.d);                         // cushion
  } }, 0, 0, null, 0, {})); X.drawImage(sp.c, x - 8 + sp.x, y + sp.y);
};
let THRONE_SPR = null;
