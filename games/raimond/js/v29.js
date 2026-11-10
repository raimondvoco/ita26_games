// ==================== v29: a hand-drawn world map that fills in as you explore, and a hand-drawn emotions guide ====================
// Both live on sketchbook paper: wobbly ink lines that "boil" a little, crayon hatching for colour, hand-lettered labels.

// ---------------------------------------------------------------- sketch kit (UI layer, 320 x 180 units)
let SKS = 1;
const srnd = () => (SKS = SKS * 16807 % 2147483647) / 2147483647;
const skSeed = (n, boil = true) => { SKS = (Math.abs(n * 7919 + (boil ? ((tick / 14) | 0) % 3 * 104729 : 0)) % 2147483646) + 1; for (let i = 0; i < 3; i++) srnd() };
const INK = '#2a1c14', PENCIL = '#6a6058';
function skLine(x1, y1, x2, y2, c = INK, w = .55, j = .7) {
  X.strokeStyle = c; X.lineCap = 'round'; X.lineJoin = 'round';
  for (let pass = 0; pass < 2; pass++) {
    const ox = (srnd() - .5) * j, oy = (srnd() - .5) * j, mx = (x1 + x2) / 2 + (srnd() - .5) * j * 2, my = (y1 + y2) / 2 + (srnd() - .5) * j * 2, k = .03 + srnd() * .05;
    X.lineWidth = pass ? w * .55 : w; X.beginPath(); X.moveTo(x1 + ox - (x2 - x1) * k, y1 + oy - (y2 - y1) * k); X.quadraticCurveTo(mx, my, x2 + ox + (x2 - x1) * k * .6, y2 + oy + (y2 - y1) * k * .6); X.stroke();
  }
}
function skPath(pts, closed) {   // a smooth wobbly path through points
  const p = pts.map(([x, y]) => [x + (srnd() - .5) * .8, y + (srnd() - .5) * .8]), P = new Path2D(), n = p.length;
  if (closed) { const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let s = m(p[n - 1], p[0]); P.moveTo(s[0], s[1]); for (let i = 0; i < n; i++) { const e = m(p[i], p[(i + 1) % n]); P.quadraticCurveTo(p[i][0], p[i][1], e[0], e[1]) } P.closePath() }
  else { P.moveTo(p[0][0], p[0][1]); for (let i = 1; i < n - 1; i++) { const e = [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2]; P.quadraticCurveTo(p[i][0], p[i][1], e[0], e[1]) } P.lineTo(p[n - 1][0], p[n - 1][1]) }
  return P;
}
function skStroke(P, c = INK, w = .55) { X.strokeStyle = c; X.lineWidth = w; X.lineCap = 'round'; X.lineJoin = 'round'; X.stroke(P) }
function skCircle(cx, cy, rx, ry = rx, c = INK, w = .55, turns = 1.12) {
  const a0 = srnd() * 6.28, n = 18, P = new Path2D();
  for (let i = 0; i <= n * turns; i++) { const a = a0 + i / n * 6.283, rr = 1 + (srnd() - .5) * .12; const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr; i ? P.lineTo(x, y) : P.moveTo(x, y) }
  skStroke(P, c, w); return P;
}
function circlePath(cx, cy, rx, ry = rx) { const P = new Path2D(); P.ellipse(cx, cy, rx, ry, 0, 0, 6.283); return P }
function hatch(P, col, gap = 1.3, ang = -.7, alpha = .55, base = .22) {   // crayon fill: a light wash, then scribbled diagonal strokes
  X.save(); X.clip(P); if (base) { X.globalAlpha = base; X.fillStyle = col; X.fill(P) }
  X.globalAlpha = alpha; X.strokeStyle = col; X.lineWidth = gap * .55; X.lineCap = 'round'; const ca = Math.cos(ang), sa = Math.sin(ang);
  X.beginPath(); for (let d = -360; d < 360; d += gap) { const j = (srnd() - .5) * gap * .6, x0 = 160 + ca * -400 - sa * (d + j), y0 = 90 + sa * -400 + ca * (d + j); X.moveTo(x0, y0); X.lineTo(x0 + ca * 800, y0 + sa * 800) } X.stroke();
  X.restore();
}
function scribble(P, col = PENCIL, alpha = .5) {   // dense pencil scribble: for places you haven't found yet
  X.save(); X.clip(P); X.globalAlpha = .55; X.fillStyle = '#d8d0c0'; X.fill(P); X.globalAlpha = alpha; X.strokeStyle = col; X.lineWidth = .35;
  for (let pass = 0; pass < 2; pass++) { const ang = pass ? .5 : -.9, ca = Math.cos(ang), sa = Math.sin(ang); X.beginPath(); for (let d = -360; d < 360; d += 1.6) { const x0 = 160 - ca * 400 - sa * d, y0 = 90 - sa * 400 + ca * d; X.moveTo(x0, y0); X.lineTo(x0 + ca * 800, y0 + sa * 800) } X.stroke() }
  X.restore();
}
function skArrow(x1, y1, x2, y2, bend = 10, c = '#a02020', w = .7) {   // a curved hand-drawn arrow
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, cx = mx + nx * bend, cy = my + ny * bend;
  const P = new Path2D(); P.moveTo(x1, y1); P.quadraticCurveTo(cx + (srnd() - .5), cy + (srnd() - .5), x2, y2); skStroke(P, c, w);
  const ax = x2 - cx, ay = y2 - cy, ad = Math.hypot(ax, ay) || 1, ux = ax / ad, uy = ay / ad;
  for (const s of [-1, 1]) skLine(x2, y2, x2 - ux * 5 + -uy * 3 * s, y2 - uy * 5 + ux * 3 * s, c, w, .3);
}
function star4(x, y, s, c, w = .5) { skLine(x - s, y, x + s, y, c, w, .2); skLine(x, y - s, x, y + s, c, w, .2) }
function tape(x, y, w, h, rot) { X.save(); X.translate(x, y); X.rotate(rot); X.globalAlpha = .55; X.fillStyle = '#e8dcb0'; X.fillRect(-w / 2, -h / 2, w, h); X.globalAlpha = .35; X.fillStyle = '#fff'; X.fillRect(-w / 2, -h / 2, w, 1); X.restore() }
function paper(x, y, w, h, spine) {   // sketchbook paper: cream, ruled in faint blue, a red margin, spiral holes down the middle
  r(x, y, w, h, '#f3ead5');
  skSeed(11, false); for (let i = 0; i < 140; i++) { X.globalAlpha = .08 + srnd() * .08; r(x + srnd() * w, y + srnd() * h, .6, .6, '#8a7a5a') } X.globalAlpha = 1;
  for (let ly = y + 12; ly < y + h - 2; ly += 9) r(x + 2, ly, w - 4, .35, 'rgba(120,150,200,.35)');
  r(x + 9, y + 1, .4, h - 2, 'rgba(210,90,90,.45)');
  if (spine) for (let sy = y + 6; sy < y + h - 4; sy += 7) { ell(spine, sy, 1.6, 1.6, '#c8bca0'); X.strokeStyle = '#5a5048'; X.lineWidth = .5; X.beginPath(); X.ellipse(spine, sy - .5, 2.4, 1.6, 0, 3.4, 6.1); X.stroke() }
  X.fillStyle = 'rgba(80,60,30,.12)'; X.fillRect(x, y + h - 1.5, w, 1.5);
}
// hand-drawn emotion faces (kept for reference; the guide uses the game's own emotion icons)
const EMOCRAY = { happy: '#f2b830', sad: '#5a8ae0', angry: '#e04a3a', neutral: '#a8a8b0' };
function handFace(e, cx, cy, R, seed = 1) {
  skSeed(seed); const col = EMOCRAY[e] || '#aaa', P = circlePath(cx, cy, R, R * .95);
  hatch(P, col, 1.1, -.8, .7, .35); skCircle(cx, cy, R, R * .95, INK, .6);
  const ex = R * .38, ey = cy - R * .12, w = .55;
  if (e == 'happy') { for (const s of [-1, 1]) { const P2 = new Path2D(); P2.moveTo(cx + s * ex - R * .17, ey + R * .05); P2.quadraticCurveTo(cx + s * ex, ey - R * .22, cx + s * ex + R * .17, ey + R * .05); skStroke(P2, INK, w) }
    const M = new Path2D(); M.moveTo(cx - R * .45, cy + R * .2); M.quadraticCurveTo(cx, cy + R * .78, cx + R * .45, cy + R * .2); M.closePath(); X.fillStyle = '#6a1a24'; X.fill(M); skStroke(M, INK, w);
    for (const s of [-1, 1]) { X.globalAlpha = .5; ell(cx + s * R * .62, cy + R * .2, R * .16, R * .09, '#ff7a90'); X.globalAlpha = 1 } }
  else if (e == 'sad') { for (const s of [-1, 1]) { skLine(cx + s * ex - R * .18, ey - R * .3 - s * R * .08 * -1, cx + s * ex + R * .18, ey - R * .3 + s * R * .08 * -1, INK, w * .8, .2); ell(cx + s * ex, ey + R * .05, R * .1, R * .14, INK) }
    const M = new Path2D(); M.moveTo(cx - R * .32, cy + R * .48); M.quadraticCurveTo(cx, cy + R * .2, cx + R * .32, cy + R * .48); skStroke(M, INK, w);
    const t = (tick / 4) % 10; ell(cx - ex, ey + R * .3 + t * R * .04, R * .07, R * .12, '#cfe4ff'); skCircle(cx - ex, ey + R * .3 + t * R * .04, R * .08, R * .13, '#3a6ab0', .3, 1) }
  else if (e == 'angry') { for (const s of [-1, 1]) { skLine(cx + s * ex - R * .2 * s, ey - R * .32, cx + s * ex + R * .14 * s, ey - R * .14, INK, w, .2); ell(cx + s * ex, ey + R * .05, R * .1, R * .1, INK) }
    const M = new Path2D(); M.rect(cx - R * .35, cy + R * .3, R * .7, R * .22); X.fillStyle = '#fff'; X.fill(M); skStroke(M, INK, w * .8); skLine(cx - R * .35, cy + R * .41, cx + R * .35, cy + R * .41, INK, .3, .1);
    for (let i = -1; i <= 1; i++) skLine(cx + i * R * .17, cy + R * .3, cx + i * R * .17, cy + R * .52, INK, .25, .1);
    const vx = cx + R * .75, vy = cy - R * .75; for (const [a, b] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const P2 = new Path2D(); P2.moveTo(vx + a * R * .08 + b * R * .2, vy + b * R * .08 + a * R * .2); P2.quadraticCurveTo(vx + a * R * .25, vy + b * R * .25, vx + a * R * .08 - b * R * .2, vy + b * R * .08 - a * R * .2); skStroke(P2, '#c01818', .5) } }
  else { for (const s of [-1, 1]) ell(cx + s * ex, ey + R * .05, R * .09, R * .09, INK); skLine(cx - R * .28, cy + R * .38, cx + R * .28, cy + R * .38, INK, w, .3) }
}

// ---------------------------------------------------------------- THE MAP
const BIOMES = {
  w: { nm: 'THE WOODS', col: '#6fae5a', pts: [[16, 96], [40, 88], [72, 90], [104, 90], [124, 98], [124, 118], [118, 140], [100, 154], [70, 157], [38, 155], [16, 146], [12, 120]], lab: [16, 150] },
  g: { nm: 'GLOOMWOOD', col: '#7d6aa0', pts: [[14, 30], [52, 27], [96, 28], [122, 34], [124, 60], [120, 84], [96, 88], [60, 87], [28, 86], [12, 62]], lab: [16, 33] },
  b: { nm: 'THE BEACH', col: '#e3bf72', pts: [[126, 40], [152, 37], [178, 46], [198, 62], [208, 88], [212, 114], [208, 140], [190, 155], [160, 157], [138, 150], [128, 120], [125, 78]], lab: [130, 29] },
  n: { nm: 'NEON CITY', col: '#c45aa8', pts: [[216, 72], [250, 67], [290, 70], [308, 80], [308, 130], [305, 156], [262, 157], [220, 157], [212, 122]], lab: [220, 76] },
  s: { nm: 'ABOVE', col: '#3a4a8a', pts: [[188, 28], [250, 26], [306, 28], [308, 56], [282, 64], [232, 62], [198, 58], [186, 44]], lab: [190, 31] } };
BIOMES.c = BIOMES.g;
const MAPXY = {
  w_tree: [62, 98], w_play: [62, 111], w_cross: [62, 125], w_garden: [62, 141], w_meadow: [34, 125], w_grove: [88, 125], w_well: [108, 118], w_tunnel: [112, 101],
  g_gate: [100, 80], g_camp: [78, 66], g_marsh: [44, 66], g_ruins: [106, 56], g_castle: [76, 43],
  b_path: [136, 50], b_boardwalk: [158, 66], b_plaza: [178, 86], b_shore: [168, 112], b_pier: [190, 130],
  n_drain: [215, 133], n_street: [236, 117], n_market: [236, 137], n_station: [234, 151], n_alley: [262, 137], n_roofs: [284, 146], n_plaza: [262, 100], n_tower: [292, 88],
  s_garden: [212, 42], s_walk1: [234, 46], s_walk2: [254, 42], s_walk3: [274, 46], s_walk4: [292, 42], s_end: [302, 50] };
// rooms you go inside belong to the place outside them
const MAPIN = { w_uhouse: 'w_garden', w_cottage: 'w_meadow', b_cabin: 'b_path', b_cafe: 'b_boardwalk', b_hotel: 'b_plaza', b_roof: 'b_plaza', b_hut: 'b_shore', n_bar: 'n_street', n_capsule: 'n_street', n_ramen: 'n_street', n_arcade: 'n_market', s_obs: 's_garden',
  n_casino: 'n_plaza', n_lounge: 'n_plaza', n_vault: 'n_plaza', n_wc: 'n_plaza', n_backroom: 'n_plaza', c_hall: 'g_castle', c_throne: 'g_castle', c_armory: 'g_castle', c_crypt: 'g_castle', c_library: 'g_castle', c_dungeon: 'g_castle' };
const MAPEXTRA = [['n_tower', 's_garden']];   // the climb up
const MAPORDER = Object.keys(MAPXY);
const mapNode = id => MAPXY[id] ? id : MAPIN[id] || null;
const bioOf = id => BIOMES[id[0]] ? id[0] == 'c' ? 'g' : id[0] : 'w';
const seenAny = ids => ids.some(id => S.seen[id]);
function mapSeen(id) { return !!S.seen[id] || Object.keys(MAPIN).some(k => MAPIN[k] == id && S.seen[k]) }
function mapEdges() {
  const E2 = new Set(), out = [];
  const add = (a, b) => { a = mapNode(a); b = mapNode(b); if (!a || !b || a == b) return; const k = [a, b].sort().join('|'); if (!E2.has(k)) { E2.add(k); out.push([a, b]) } };
  for (const id in AREAS) for (const e of AREAS[id].exits || []) add(id, e.to);
  MAPEXTRA.forEach(([a, b]) => add(a, b)); return out;
}
let _mapE = null;
// little doodles for each biome
function doodleTree(x, y, s, c) { skLine(x, y, x, y - 4 * s, '#5a3a20', .5); const P = skCircle(x, y - 6 * s, 3 * s, 3.2 * s, INK, .4); hatch(circlePath(x, y - 6 * s, 3 * s, 3.2 * s), c, 1, -.8, .7, .3) }
function doodlePine(x, y, s, c) { const P = new Path2D(); P.moveTo(x, y - 9 * s); P.lineTo(x + 3.5 * s, y - 1 * s); P.lineTo(x - 3.5 * s, y - 1 * s); P.closePath(); hatch(P, c, 1, -.8, .7, .3); skStroke(P, INK, .4); skLine(x, y - 1 * s, x, y + 1 * s, '#5a3a20', .5) }
function doodleDead(x, y, s) { skLine(x, y, x, y - 8 * s, INK, .5); skLine(x, y - 5 * s, x - 3 * s, y - 8 * s, INK, .4); skLine(x, y - 6 * s, x + 3 * s, y - 9 * s, INK, .4) }
function doodlePalm(x, y, s) { const P = new Path2D(); P.moveTo(x, y); P.quadraticCurveTo(x + 2 * s, y - 5 * s, x + 1 * s, y - 9 * s); skStroke(P, '#7a5a30', .6); for (const a of [-2.6, -2, -1.2, -.5]) { const Q = new Path2D(); Q.moveTo(x + s, y - 9 * s); Q.quadraticCurveTo(x + s + Math.cos(a) * 3 * s, y - 9 * s + Math.sin(a) * 3 * s - 1, x + s + Math.cos(a) * 5 * s, y - 9 * s + Math.sin(a) * 5 * s + 2 * s); skStroke(Q, '#3a8a40', .55) } }
function doodleWave(x, y, w, c = '#3a6ab0') { const P = new Path2D(); P.moveTo(x, y); for (let i = 0; i < w; i += 4) P.quadraticCurveTo(x + i + 1, y - 1.5, x + i + 2, y), P.quadraticCurveTo(x + i + 3, y + 1.5, x + i + 4, y); skStroke(P, c, .4) }
function doodleBld(x, y, w, h, c) { const P = new Path2D(); P.rect(x, y - h, w, h); hatch(P, c, 1.1, -.8, .6, .25); skStroke(P, INK, .45); for (let i = 0; i < 3; i++) r(x + 1.5 + (i % 2) * (w - 4), y - h + 2 + i * 3, 1.2, 1.2, '#ffe27a') }
function doodleCastle(x, y, s) { const P = new Path2D(); P.moveTo(x - 7 * s, y); P.lineTo(x - 7 * s, y - 7 * s); for (let i = 0; i < 4; i++) { const bx = x - 7 * s + i * 3.5 * s; P.lineTo(bx, y - 9 * s); P.lineTo(bx + 1.75 * s, y - 9 * s); P.lineTo(bx + 1.75 * s, y - 7 * s); P.lineTo(bx + 3.5 * s, y - 7 * s) } P.lineTo(x + 7 * s, y); P.closePath(); hatch(P, '#8a8098', 1, -.8, .6, .3); skStroke(P, INK, .5); const D = new Path2D(); D.moveTo(x - 1.5 * s, y); D.lineTo(x - 1.5 * s, y - 3 * s); D.quadraticCurveTo(x, y - 4.5 * s, x + 1.5 * s, y - 3 * s); D.lineTo(x + 1.5 * s, y); skStroke(D, INK, .4) }
function doodleHouse(x, y, c = '#c8a070') { const P = new Path2D(); P.moveTo(x - 2.5, y); P.lineTo(x - 2.5, y - 3); P.lineTo(x, y - 5.2); P.lineTo(x + 2.5, y - 3); P.lineTo(x + 2.5, y); P.closePath(); X.fillStyle = c; X.fill(P); skStroke(P, INK, .35) }
function doodleStar(x, y, s) { const P = new Path2D(); for (let i = 0; i < 10; i++) { const a = -1.571 + i * .628, rr = i % 2 ? s * .45 : s; i ? P.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : P.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) } P.closePath(); X.fillStyle = '#ffe27a'; X.fill(P); skStroke(P, INK, .3) }
const DOODLE = {
  w(on) { [[22, 104], [30, 140], [46, 100], [80, 150], [96, 98], [118, 132], [20, 128], [100, 146]].forEach(([x, y], i) => i % 2 ? doodleTree(x, y, .9, '#5aa04a') : doodlePine(x, y, .9, '#3a8a4a')) },
  g(on) { [[22, 48], [30, 76], [56, 40], [112, 42], [116, 74], [24, 62], [92, 48]].forEach(([x, y]) => doodleDead(x, y, .9)); doodleCastle(MAPXY.g_castle[0], MAPXY.g_castle[1] - 2, .85); hatch(circlePath(44, 67, 10, 4), '#4a6a5a', 1, -.2, .6, .3); skCircle(44, 67, 10, 4, INK, .35) },
  b(on) { [[134, 64], [144, 100], [150, 140], [196, 94], [186, 64]].forEach(([x, y]) => doodlePalm(x, y, .8)); const sea = skPath([[182, 118], [212, 112], [214, 140], [204, 156], [176, 157], [172, 140]], true); hatch(sea, '#4a8ad8', 1.2, -.3, .55, .3); for (let i = 0; i < 4; i++) doodleWave(178 + (i % 2) * 8, 124 + i * 8, 22);
    skLine(184, 128, 200, 132, '#7a5a30', .9, .2) },
  n(on) { [[222, 156, 6, 16], [244, 156, 8, 22], [272, 156, 7, 18], [296, 156, 7, 26], [282, 120, 6, 14], [298, 118, 6, 20]].forEach(([x, y, w, h], i) => doodleBld(x, y, w, h, i % 2 ? '#7a4ab0' : '#c45aa8'));
    const T = MAPXY.n_tower; skLine(T[0], T[1] - 2, T[0], T[1] - 16, INK, .5); skLine(T[0] - 3, T[1] - 2, T[0], T[1] - 16, INK, .4); skLine(T[0] + 3, T[1] - 2, T[0], T[1] - 16, INK, .4); if ((tick >> 4) & 1) ell(T[0], T[1] - 17, 1.2, 1.2, '#ff3a3a') },
  s(on) { [[196, 36, 2], [222, 32, 1.6], [246, 54, 1.8], [268, 32, 2.2], [300, 36, 1.6], [286, 56, 1.4], [208, 54, 1.4]].forEach(([x, y, s]) => doodleStar(x, y, s)); const M = new Path2D(); M.arc(300, 34, 4, .6, 5.7); M.arc(298, 33, 3.2, 5.4, .9, true); X.fillStyle = '#fff3c0'; X.fill(M); skStroke(M, INK, .35) } };
function drawMapTab() {
  const x = XM; if (x.mbuild !== S.a) { x.mbuild = S.a; x.msel = null }
  paper(10, 26, 300, 134, 0);
  const here = mapNode(S.a) || 'w_tree';
  const known = MAPORDER.filter(mapSeen);
  if (x.msel == null) x.msel = Math.max(0, known.indexOf(here));
  if (known.length) { if (rt()) { x.msel = (x.msel + 1) % known.length; pageTurn() } if (lf()) { x.msel = (x.msel + known.length - 1) % known.length; pageTurn() } }
  const selId = known[x.msel] || here;
  // the five biomes: found ones are coloured in and labelled, the rest are a pencil scribble with a question mark
  ['s', 'n', 'b', 'g', 'w'].forEach((k, bi) => {
    const Bm = BIOMES[k], ids = MAPORDER.filter(id => bioOf(id) == k), found = ids.some(mapSeen); skSeed(40 + bi);
    const P = skPath(Bm.pts, true);
    if (found) { hatch(P, Bm.col, 1.4, -.7 + bi * .25, .38, .18); skStroke(P, INK, .6); DOODLE[k](true) }
    else { scribble(P); skStroke(P, PENCIL, .45); const cx = Bm.pts.reduce((s, p) => s + p[0], 0) / Bm.pts.length, cy = Bm.pts.reduce((s, p) => s + p[1], 0) / Bm.pts.length; txt('?', cx, cy - 6, '#5a5048', 'center', 12) }
  });
  // paths between places
  _mapE = _mapE || mapEdges();
  _mapE.forEach(([a, b], i) => { const sa = mapSeen(a), sb = mapSeen(b); if (!sa && !sb) return; skSeed(200 + i); const A2 = MAPXY[a], B2 = MAPXY[b];
    if (sa && sb) { X.setLineDash([1.6, 1.2]); skLine(A2[0], A2[1], B2[0], B2[1], '#5a3a20', .55, .5); X.setLineDash([]) }
    else { X.setLineDash([.6, 1.6]); skLine(A2[0], A2[1], B2[0], B2[1], PENCIL, .4, .5); X.setLineDash([]) } });
  // biome names on the found ones
  ['w', 'g', 'b', 'n', 's'].forEach(k => { const Bm = BIOMES[k]; if (MAPORDER.some(id => bioOf(id) == k && mapSeen(id))) txt(Bm.nm, Bm.lab[0], Bm.lab[1], INK, 'left', 6) });
  // places: a crayon dot for each one you've been to, a question mark where a path leads somewhere new
  MAPORDER.forEach((id, i) => { const [px, py] = MAPXY[id], seen = mapSeen(id); skSeed(300 + i);
    if (seen) { const P = circlePath(px, py, 2.6); hatch(P, BIOMES[bioOf(id)].col, .8, -.8, .9, .6); skCircle(px, py, 2.6, 2.6, INK, .45);
      const kids = Object.keys(MAPIN).filter(k => MAPIN[k] == id && S.seen[k] && k[0] != 'c'); kids.slice(0, 3).forEach((k, j) => doodleHouse(px + 5 + j * 5.5, py + 2, ['#c8a070', '#e89aa8', '#9ab8d8'][j])) }
    else if (_mapE.some(([a, b]) => (a == id && mapSeen(b)) || (b == id && mapSeen(a)))) { skCircle(px, py, 2.6, 2.6, PENCIL, .35); txt('?', px, py - 3, PENCIL, 'center', 5) } });
  // the one you're looking at
  if (selId && selId != here && MAPXY[selId]) { const [sx, sy] = MAPXY[selId]; skSeed(7); skCircle(sx, sy, 5.5, 5, '#2a6ab0', .55, 1.3) }
  // you are here: a red X, ringed, with a little pin bobbing over it
  { const [hx, hy] = MAPXY[here]; skSeed(9); skLine(hx - 3, hy - 3, hx + 3, hy + 3, '#c01818', .9, .3); skLine(hx + 3, hy - 3, hx - 3, hy + 3, '#c01818', .9, .3); skCircle(hx, hy, 6, 5.5, '#c01818', .5, 1.25);
    const by = hy - 13 + Math.sin(tick / 9) * 1.5; ell(hx, by, 3, 3, '#e83a3a'); skCircle(hx, by, 3, 3, INK, .4); skLine(hx, by + 3, hx, hy - 6, INK, .5, .2); ell(hx - 1, by - 1, .9, .9, '#fff') }
  // caption: the place you're looking at
  const nm = id => (AREAS[id] && AREAS[id].nm) || '???', cap = nm(selId) || '...';
  r(98, 150, 124, 9, 'rgba(243,234,213,.92)'); txt('<  ' + cap + (selId == here ? '  (you are here)' : '') + '  >', 160, 151, INK, 'center', 6);
  txt(known.length + ' / ' + MAPORDER.length + ' places', 304, 29, '#7a6a50', 'right', 5);
}

// ---------------------------------------------------------------- THE GUIDE: emotions, hand-drawn
function photoCard(cx, cy, who, e, label, rot, seed) {
  X.save(); X.translate(cx, cy); X.rotate(rot);
  X.fillStyle = 'rgba(60,40,20,.18)'; X.fillRect(-19, -19, 40, 46); X.fillStyle = '#fbf8f0'; X.fillRect(-20, -20, 40, 46);
  X.fillStyle = '#1a1420'; X.fillRect(-17, -17, 34, 34); X.save(); X.beginPath(); X.rect(-17, -17, 34, 34); X.clip(); portrait(CH[who], e, -17, -17, 34 / 56); X.restore();
  skSeed(seed); const P = new Path2D(); P.rect(-20, -20, 40, 46); skStroke(P, INK, .4);
  X.restore(); txt(label, cx - Math.sin(rot) * 18, cy + 18, EMOCRAY[e] == '#f2b830' ? '#b07a10' : EMOCRAY[e], 'center', 6); tape(cx + Math.sin(rot) * 20, cy - 21, 16, 5, rot + .05);
}
function chibiSketch(i, e, cx, fy, seed) {   // the character sprite with sketched feelings around them
  const sx = e == 'angry' ? ((tick >> 1) % 2 ? .6 : -.6) : 0, bob = e == 'happy' ? -Math.abs(Math.sin(tick / 7)) * 3 : e == 'sad' ? 1 : 0;
  spr(CH[i], cx + sx, fy + bob, 0, 0, 1.05); skSeed(seed);
  if (e == 'happy') for (let k = 0; k < 3; k++) { const ph = (tick / 3 + k * 9) % 28; if (ph < 16) star4(cx + [-11, 11, 8][k], fy + [-11, -6, -19][k] + bob, .8 + ph / 9, '#d89810', .5) }
  if (e == 'sad') { const P = skPath([[cx - 7, fy - 20], [cx - 5, fy - 24], [cx, fy - 25], [cx + 5, fy - 24], [cx + 7, fy - 20]], true); hatch(P, '#8a96b0', 1, -.8, .7, .4); skStroke(P, INK, .4);
    for (let k = 0; k < 3; k++) { const ph = (tick * .5 + k * 5) % 8; X.globalAlpha = 1 - ph / 9; skLine(cx - 5 + k * 5, fy - 19 + ph, cx - 5.5 + k * 5, fy - 17 + ph, '#3a6ab0', .45, .15); X.globalAlpha = 1 } }
  if (e == 'angry') { const vx = cx + 9, vy = fy - 17; for (const [a, b] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const P = new Path2D(); P.moveTo(vx + a * .7 + b * 1.8, vy + b * .7 + a * 1.8); P.quadraticCurveTo(vx + a * 2.2, vy + b * 2.2, vx + a * .7 - b * 1.8, vy + b * .7 - a * 1.8); skStroke(P, '#c01818', .5) }
    const a = (tick >> 2) % 6; const S2 = new Path2D(); S2.moveTo(cx - 9, fy - 12 - a * .5); S2.quadraticCurveTo(cx - 11, fy - 14.5 - a * .5, cx - 9, fy - 17 - a * .5); S2.quadraticCurveTo(cx - 7, fy - 19.5 - a * .5, cx - 9, fy - 22 - a * .5); skStroke(S2, PENCIL, .4) }
}
function underline(x, y, w, c = '#c45a3a') { skLine(x, y, x + w, y + (srnd() - .5), c, .6, .4) }
drawGuide = function (x) {
  paper(10, 26, 300, 134, 160);
  const pages = 4; if (rt() && x.ps < pages - 1) { x.ps++; pageTurn() } if (lf() && x.ps > 0) { x.ps--; pageTurn() }
  const hd = '#5a2a1a', txtw = (str, xx, yy, w2, lh = 8) => wrapPx(str, w2, 6).forEach((l, k) => txt(l, xx, yy + k * lh, INK, 'left', 6));
  const head = (s, xx, yy, seed) => { txt(s, xx, yy, hd, 'left', 8); skSeed(seed); underline(xx, yy + 9.5, tw(s, 8) + 2) };
  if (x.ps == 0) {
    head('HOW EMOTIONS WORK', 22, 30, 1); txtw('In battle everyone has an emotion. It changes their stats and how hard they hit. The enemy has one too: look for the little face beside its name.', 22, 44, 128);
    [['happy', 'HAPPY', 'More luck: crits, dodges and follow-ups.'], ['sad', 'SAD', 'Tougher, but weaker attacks.'], ['angry', 'ANGRY', 'Hits hard, but takes more damage.']].forEach(([e, n, d], k) => { const y = 84 + k * 23; emoIcon(e, 21, y - 2, 1.1); txt(n, 40, y, hd, 'left', 7); txtw(d, 40, y + 9, 112) });
    photoCard(234, 52, PL, 'happy', 'HAPPY', -.06, 21); photoCard(276, 112, PL, 'sad', 'SAD', .07, 22); photoCard(192, 112, PL, 'angry', 'ANGRY', -.04, 23);
    skSeed(30); skArrow(256, 56, 276, 84, -8); skArrow(254, 124, 214, 124, 8); skArrow(186, 86, 210, 58, -8);
    txt('arrow = beats', 234, 140, '#a02020', 'center', 6);
  }
  if (x.ps == 1) {
    head('THE CHIBI CHART', 22, 30, 2);
    const cols = [['happy', 112], ['sad', 196], ['angry', 270]];
    cols.forEach(([e, cx], k) => { emoIcon(e, cx - 23, 30, .8); txt(e.toUpperCase(), cx - 9, 32, hd, 'left', 6) });
    [0, 1, PL, 3].forEach((i, k) => { const fy = 66 + k * 24; skSeed(60 + k); if (k) skLine(20, fy - 22, 150, fy - 22 + (srnd() - .5), '#b8a47c', .4, .5), skLine(170, fy - 22, 302, fy - 22 + (srnd() - .5), '#b8a47c', .4, .5);
      txt(CH[i].n.toUpperCase(), 22, fy - 12, hd, 'left', 6); cols.forEach(([e, cx], j) => chibiSketch(i, e, cx, fy, 70 + k * 3 + j)) });
  }
  if (x.ps == 2) {
    head('THE STRENGTH WHEEL', 22, 30, 3);
    const cx = 86, cy = 98, pts = { happy: [cx, cy - 36], sad: [cx + 38, cy + 26], angry: [cx - 38, cy + 26] };
    skSeed(80); skCircle(cx, cy + 4, 46, 40, 'rgba(120,100,70,.35)', .4, 1.05);
    for (const [a, b] of [['happy', 'sad'], ['sad', 'angry'], ['angry', 'happy']]) { const p0 = pts[a], q = pts[b], dx = q[0] - p0[0], dy = q[1] - p0[1], d = Math.hypot(dx, dy); skArrow(p0[0] + dx / d * 13, p0[1] + dy / d * 13, q[0] - dx / d * 14, q[1] - dy / d * 14, 9) }
    let k = 0; for (const e in pts) { emoIcon(e, pts[e][0] - 8, pts[e][1] - 9, 2); k++; txt(e.toUpperCase(), pts[e][0], pts[e][1] + 11, hd, 'center', 6) }
    txt('+30%', cx + 30, cy - 18, '#a02020', 'left', 6); txt('beats', cx - 7, cy + 32, '#a02020', 'left', 5);
    head('FOLLOW-UPS', 172, 30, 4); txtw('When someone ATTACKS, their friends may jump in with a follow-up hit for 60% damage. HAPPY friends join in more, SAD friends less.', 172, 44, 130);
    head('MIND THE ARROWS', 172, 84, 5); txtw('Hit an enemy with the emotion you beat: +30%. Meet one that beats you: -25%. Skills change your emotion. Getting hurt can turn a friend SAD, and when someone falls the others turn ANGRY.', 172, 98, 130);
  }
  if (x.ps == 3) {
    head('SKILLS', 22, 30, 6); CH.forEach((c, i) => { const y = 44 + i * 27; skSeed(110 + i); skCircle(32, y + 10, 9, 10, '#b8a47c', .4); spr(c, 32, y + 20, 0, 0, .9); txt(c.skill[0].toUpperCase(), 46, y + 1, hd, 'left', 7); txtw(c.skill[1], 46, y + 10, 106, 7) });
    head('GOOD TO KNOW', 172, 30, 7); txtw('Enemies get stronger as the story moves on. Chests and side quests give gear: open the X menu to equip it.', 172, 44, 130);
    txtw('Rest on benches to recover a little. Save at vending machines. Little shacks hide small, wise things.', 172, 86, 130);
    skSeed(120); doodleStar(286, 128, 5); doodleStar(270, 140, 3); star4(298, 142, 2, '#d89810');
  }
  txt('< ' + (x.ps + 1) + '/' + pages + ' >', W / 2, 151, '#7a6a50', 'center', 6);
};
