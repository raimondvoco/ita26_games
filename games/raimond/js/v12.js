// ==================== v12: playground rides, cats, neon city + casino set dressing ====================
// CATPX (pixel maps for the cats) lives in v12_catpx.js.

// ---------------------------------------------------------------- CATS: walk cycle in four directions, a round loaf when sitting
const CATCOAT = {
  black: { o: '#140c14', b: '#3a3640', d: '#26222c', l: '#4a4652', n: '#e88aa0', e: '#7ae860', ec: '#141014' },
  orange: { o: '#3a1a08', b: '#f0962a', d: '#c8701a', l: '#ffe0b8', n: '#ff9ab0', e: '#3a1a08' },
  calico: { o: '#2a1a14', b: '#f4ead8', d: '#d8c8b0', l: '#ffffff', n: '#ff9ab0', e: '#2a1a14', p1: '#e8902a', p2: '#3a3036' },
  cream: { o: '#4a2a14', b: '#f6c88e', d: '#dca46a', l: '#fff0dc', n: '#ff9ab0', e: '#4a2a14' },
  grey: { o: '#1a1a2a', b: '#7a7a98', d: '#5a5a78', l: '#f0f0f8', n: '#ff9ab0', e: '#1a1a2a' },
  pink: { o: '#5a3040', b: '#fbe4ea', d: '#f0bccb', l: '#ffffff', n: '#ff7a9a', e: '#5a3040' },
  brown: { o: '#1e0e08', b: '#7a3e22', d: '#5a2a14', l: '#9a5a36', n: '#d87a8a', e: '#1e0e08' },
  siamese: { o: '#2a160c', b: '#f4e2c8', d: '#d8c0a0', l: '#fff6e8', n: '#ff9ab0', e: '#2a160c', pt: '#5a3420' },
};
// where the points / patches sit on each sprite (unflipped coordinates)
const CATREG = {
  sit: { face: (x, y) => y >= 5 && y <= 7 && x >= 3 && x <= 9, tail: (x, y) => x >= 13, legs: (x, y) => y >= 12, p1: (x, y) => x <= 5 && y <= 6, p2: (x, y) => x >= 8 && x <= 12 && y >= 8 },
  side: { face: (x, y) => x >= 12 && y >= 2 && y <= 5, tail: (x, y) => x <= 4 && y <= 5, legs: (x, y) => y >= 10, p1: (x, y) => x >= 11 && y <= 3, p2: (x, y) => x >= 6 && x <= 10 && y >= 5 && y <= 8 },
  front: { face: (x, y) => y >= 5 && y <= 8 && x >= 3 && x <= 8, tail: (x, y) => y <= 3 && x >= 5 && x <= 7, legs: (x, y) => y >= 13, p1: (x, y) => x <= 5 && y >= 3 && y <= 7, p2: (x, y) => x >= 6 && y >= 9 },
  back: { face: () => false, tail: (x, y) => y <= 3 && x >= 5 && x <= 7, legs: (x, y) => y >= 13, p1: (x, y) => x <= 5 && y >= 3 && y <= 9, p2: (x, y) => x >= 6 && y >= 8 },
};
const CATC = {};
function catCanvas(coat, kind, f, flip) {
  const key = coat + kind + f + (flip ? 'f' : ''); if (CATC[key]) return CATC[key];
  const C = CATCOAT[coat] || CATCOAT.orange, Rg = CATREG[kind], P = CATPX;
  const rows = kind == 'sit' ? (f ? P.SIT2 : P.SIT) : kind == 'side' ? P.SIDE.concat(P.LEGS[f]) : (kind == 'front' ? P.FRONT : P.BACK).concat(P.FLEGS[f]);
  const w = rows[0].length, h = rows.length, c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const ch = rows[y][x]; if (ch == '.' || !ch) continue;
    let col = ch == 'e' ? (kind == 'sit' ? (C.ec || C.o) : C.e) : C[ch] || C.b;
    if (C.p1 && (ch == 'b' || ch == 'd')) { if (Rg.p1(x, y)) col = ch == 'd' ? sh(C.p1, .82) : C.p1; else if (Rg.p2(x, y)) col = ch == 'd' ? sh(C.p2, .82) : C.p2 }
    if (C.pt && (ch == 'b' || ch == 'd' || ch == 'l') && (Rg.face(x, y) || Rg.tail(x, y) || Rg.legs(x, y))) col = ch == 'd' ? sh(C.pt, .8) : C.pt;
    if (C.pt && ch == 'n' && y < 4) col = C.pt;
    g.fillStyle = col; g.fillRect(flip ? w - 1 - x : x, y, 1, 1) }
  return CATC[key] = c;
}
OBJ.cat = (x, y, e) => { const coat = CATCOAT[e.fur] ? e.fur : 'orange'; let kind = 'sit', f = 0, flip = false;
  if (e.mv) { f = [0, 1, 2, 1][(tick >> 3) & 3]; kind = e.dir4 || 'side'; flip = kind == 'side' && e.face < 0 }
  else f = ((tick + ((e.x * 7) | 0)) % 220) < 26 ? 1 : 0;   // a lazy tail flick now and then
  const c = catCanvas(coat, kind, f, flip); ell(x + 1, y, kind == 'side' ? 8 : 7, 2, 'rgba(0,0,0,.25)'); X.drawImage(c, Math.round(x - c.width / 2), Math.round(y - c.height + 1));
  if (e.heart > 0) { e.heart--; const hy = y - 22 - (40 - e.heart) * .3; r(x - 3, hy, 2, 2, '#ff5a8a'); r(x + 1, hy, 2, 2, '#ff5a8a'); r(x - 3, hy + 2, 6, 2, '#ff5a8a'); r(x - 2, hy + 4, 4, 1, '#ff5a8a'); r(x - 1, hy + 5, 2, 1, '#ff5a8a') } };
catThink = function (e) { e.ct = (e.ct || 0) - 1; e.hx = e.hx ?? e.x; e.hy = e.hy ?? e.y;
  if (e.heart > 0) { e.vx = e.vy = 0; e.mv = false; return }
  if (e.ct <= 0) { e.ct = 70 + Math.random() * 170; const q = Math.random(); e.vx = e.vy = 0;
    if (q < .4) { } else if (q < .75) { e.vx = Math.random() < .5 ? -.32 : .32; e.dir4 = 'side'; e.face = Math.sign(e.vx) } else { e.vy = Math.random() < .5 ? -.26 : .26; e.dir4 = e.vy > 0 ? 'front' : 'back' } }
  e.mv = !!(e.vx || e.vy); if (!e.mv) return; const nx = e.x + e.vx, ny = e.y + e.vy;
  if (canWalk(nx, ny) && Math.hypot(nx - e.hx, ny - e.hy) < 56) { e.x = nx; e.y = ny } else e.ct = 0 };
Object.assign(CAT_IN, { w_cross: 'orange', w_play: 'black', g_camp: 'grey', b_plaza: 'pink', b_boardwalk: 'calico', n_street: 'siamese', n_alley: 'brown', n_market: 'cream' });

// ---------------------------------------------------------------- PLAYGROUND: rebuilt equipment
const PGC = { red: '#d8443a', redD: '#982a24', redL: '#f47a68', blue: '#3a78d0', blueD: '#244c86', blueL: '#6aa0ec', yel: '#f2c232', yelD: '#b8861a', yelL: '#ffe486', st: '#9a9aac', stD: '#62627a', stL: '#d0d0e0', wd: '#a8723c', wdD: '#6a4422', wdL: '#cc9658', ink: '#1a1018' };
const line1 = (G, x0, y0, x1, y1, w, c) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; for (let i = 0; i <= n; i++) PF(G, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, w, w, c) };
const lineX = (x0, y0, x1, y1, c, w = 1) => { const n = Math.max(1, Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0); for (let i = 0; i <= n; i++) r(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, w, w, c) };
// swing set: red A-frames, a blue top bar, two rubber seats on chains
function swingFrame(G, x, y) { SHD(G, x, y, 30, 4);
  for (const s of [-1, 1]) { const tx = x + s * 26; line1(G, tx, y - 44, tx + s * 4, y - 8, 2, PGC.redD); PF(G, tx + s * 4 - 1, y - 9, 4, 2, PGC.ink);   // back leg, darker
    line1(G, tx, y - 44, tx + s * 5, y, 3, PGC.red); line1(G, tx + 1, y - 43, tx + s * 5 + 1, y - 1, 1, PGC.redL); PF(G, tx + s * 5 - 2, y - 1, 6, 2, PGC.ink);   // front leg with a highlight, foot
    PF(G, tx + s * 1 - 1, y - 24, s * 4 + 3, 2, PGC.redD) }
  PF(G, x - 30, y - 47, 60, 4, PGC.blue); PF(G, x - 30, y - 47, 60, 1, PGC.blueL); PF(G, x - 30, y - 44, 60, 1, PGC.blueD); for (const s of [-1, 1]) { PF(G, x + s * 27 - 2, y - 48, 5, 6, PGC.redD); PF(G, x + s * 27 - 1, y - 47, 3, 4, PGC.red) }
  for (const sx of [-15, -5, 5, 15]) PF(G, x + sx - 1, y - 44, 2, 2, PGC.st) }
// one seat at angle th (radians, + = towards the camera); the seat pivots under the top bar
function swingSeat(x, y, th, who) { const py = y - 43, Lc = 29, sy = py + Lc * Math.cos(th) + Lc * Math.sin(th) * .34, k = 1 + Math.sin(th) * .08;
  if (who != null) drawChar(CH[who], x, Math.round(sy + 9), 0, 0, 1);
  for (const dx of [-5, 5]) { const bx = x + dx * k; for (let i = 0; i <= 14; i++) { const cy_ = py + (sy - py) * i / 14; r(x + dx + (bx - x - dx) * i / 14, cy_, 1, 2, i & 1 ? '#5a5a6a' : '#a8a8b8') } }
  r(x - 7 * k, sy - 1, 14 * k, 4, PGC.ink); r(x - 6 * k, sy - 1, 12 * k, 2, '#3a3a48'); r(x - 6 * k, sy + 1, 12 * k, 1, '#26262e') }
// slide: steel ladder, a little railed platform, a long yellow chute with side walls
const SLIDEY = i => i < 28 ? i * 1.04 : 29 + (i - 28) * .15;
function slideBody(G, x, y) { SHD(G, x, y, 28, 4); SHD(G, x + 18, y, 9, 3);
  for (const lx of [-23, -14]) { PF(G, x + lx, y - 40, 2, 40, PGC.st); PF(G, x + lx, y - 40, 1, 40, PGC.stL) } for (let k = 4; k < 38; k += 6) PF(G, x - 22, y - k, 8, 2, PGC.stD);
  PF(G, x - 25, y - 42, 17, 5, PGC.red); PF(G, x - 25, y - 42, 17, 1, PGC.redL); PF(G, x - 25, y - 38, 17, 1, PGC.redD);
  for (const lx of [-25, -9]) PF(G, x + lx, y - 52, 2, 11, PGC.blue); PF(G, x - 25, y - 53, 18, 2, PGC.blue); PF(G, x - 25, y - 53, 18, 1, PGC.blueL);
  PF(G, x + 16, y - 10, 2, 10, PGC.st); PF(G, x + 16, y - 10, 1, 10, PGC.stL);
  for (let i = 0; i <= 36; i++) { const px = x - 8 + i, py = y - 40 + SLIDEY(i); PF(G, px, py - 2, 1, 2, PGC.yelD); PF(G, px, py, 1, 7, PGC.yel); PF(G, px, py + 1, 1, 1, PGC.yelL); if (i % 5 == 0) PF(G, px, py + 3, 1, 1, PGC.yelL); PF(G, px, py + 7, 1, 3, PGC.yelD) } }
// seesaw: a blue stand and a wooden plank whose tilt changes; red handle bars at both ends
function seesawStand(G, x, y) { SHD(G, x, y, 28, 4); PF(G, x - 7, y - 4, 14, 4, PGC.blueD); for (let k = 0; k < 9; k++) PF(G, x - 6 + k * .5, y - 12 + k, 12 - k, 1, k < 2 ? PGC.blueL : PGC.blue); PF(G, x - 2, y - 14, 4, 4, PGC.st); PF(G, x - 1, y - 13, 1, 1, PGC.stL) }
function seesawPlank(x, y, tilt, handles = true) { const Y = k => y - 13 - k * tilt * .55;
  for (let k = -27; k <= 27; k++) { const py = Y(k); r(x + k, py - 1, 1, 1, PGC.ink); r(x + k, py, 1, 3, k % 9 == 0 ? PGC.wdD : PGC.wd); r(x + k, py, 1, 1, PGC.wdL); r(x + k, py + 3, 1, 1, PGC.ink) }
  for (const k of [-27, 27]) { r(x + k - (k < 0 ? 1 : 0), Y(k) - 1, 1, 5, PGC.ink) }
  if (handles) for (const k of [-17, 17]) { const py = Y(k); r(x + k - 1, py - 9, 3, 9, PGC.ink); r(x + k, py - 8, 1, 8, PGC.red); r(x + k - 3, py - 10, 7, 3, PGC.ink); r(x + k - 2, py - 9, 5, 1, PGC.redL) } }
// merry-go-round: a turning disc of coloured wedges, a centre post and four handle bars
function mgrDisc(x, y, phi) { const rx = 22, ry = 9, cy_ = y - 4; ell(x + 1, y, 24, 6, 'rgba(0,0,0,.22)'); ell(x, cy_ + 3, rx + 1, ry + 1, PGC.ink); ell(x, cy_ + 2, rx, ry, '#7a2a24');
  const cols = [PGC.red, PGC.yel, PGC.blue, PGC.red, PGC.yel, PGC.blue];
  for (let j = -ry; j <= ry; j++) { const q = 1 - j * j / (ry * ry); if (q < 0) continue; const w = Math.round(rx * Math.sqrt(q)); for (let i = -w; i < w; i++) { let a = Math.atan2(j / ry, i / rx) + phi; a = ((a % 6.2832) + 6.2832) % 6.2832; const sg = (a / 1.0472) | 0, edge = (a % 1.0472) < .09;
      r(x + i, cy_ + j, 1, 1, edge ? '#f4f0e8' : (Math.abs(j) == ry || Math.abs(i) >= w - 1 ? PGC.ink : (j < -ry / 2 ? sh(cols[sg], 1.12) : cols[sg]))) } }
  ell(x, cy_, 5, 2, PGC.stD); ell(x, cy_ - 1, 4, 1.5, PGC.st) }
function mgrTop(x, y, phi) { const cy_ = y - 4; r(x - 2, y - 28, 4, 24, PGC.ink); r(x - 1, y - 28, 2, 24, PGC.st); r(x - 1, y - 28, 1, 24, PGC.stL); ell(x, y - 29, 4, 2, PGC.ink); ell(x, y - 30, 3, 1.5, PGC.yel);
  for (let k = 0; k < 4; k++) { const a = phi + k * 1.5708 + .785, ex = x + Math.cos(a) * 17, ey = cy_ + Math.sin(a) * 7; lineX(ex, ey, ex, ey - 12, PGC.ink, 2); lineX(ex, ey - 12, x + Math.cos(a) * 3, y - 24 + Math.sin(a), PGC.ink, 2); r(ex, ey - 11, 1, 11, PGC.yel); lineX(ex, ey - 12, x + Math.cos(a) * 3, y - 24 + Math.sin(a), PGC.yel) } }
// hopscotch: chalk squares 1..8 and a "home" arc, in three chalk colours, with little numbers
const DIG = { 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'], 3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'], 6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'] };
const HOPC = [[-30, -13, 1], [-21, -13, 2], [-12, -17, 3], [-12, -8, 4], [-3, -13, 5], [6, -17, 6], [6, -8, 7], [15, -13, 8]];
PROPS.hopscotch = { w: 2, flat: 1, d(G, x, y) { const cc = ['rgba(255,240,250,.75)', 'rgba(255,214,120,.75)', 'rgba(150,230,255,.75)'];
  for (const [dx, dy, n] of HOPC) { const c = cc[n % 3], bx = x + dx, by = y + dy; PF(G, bx, by, 9, 1, c); PF(G, bx, by + 8, 9, 1, c); PF(G, bx, by, 1, 9, c); PF(G, bx + 8, by, 1, 9, c); const D_ = DIG[n]; for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (D_[j][i] == '#') PF(G, bx + 3 + i, by + 2 + j, 1, 1, c) }
  for (let a = -1.5; a <= 1.5; a += .1) PF(G, x + 24 + Math.cos(a) * 7, y - 9 + Math.sin(a) * 6, 1, 1, cc[1]); PF(G, x - 40, y - 2, 3, 2, 'rgba(255,240,250,.6)'); PF(G, x - 36, y - 1, 2, 1, 'rgba(255,214,120,.6)') } };
// sandbox: plank frame with corner caps, smooth sand, a bucket and spade left in the corner
function sandBox(G, x, y) { const x0 = x - 38, x1 = x + 22, y0 = y - 26; SHD(G, x - 8, y + 1, 32, 3);
  PF(G, x0, y0, x1 - x0, y - y0, PGC.wdD); PF(G, x0 + 4, y0 + 4, x1 - x0 - 8, y - y0 - 8, '#e8d08a'); PF(G, x0 + 4, y0 + 4, x1 - x0 - 8, 2, '#c8aa60');
  for (let i = 0; i < 40; i++) PF(G, x0 + 6 + (i * 37) % (x1 - x0 - 12), y0 + 7 + (i * 13) % (y - y0 - 12), 1, 1, i % 3 ? '#d8bc70' : '#f4e2a8');
  for (const [a, b, w, h] of [[x0, y0, x1 - x0, 4], [x0, y - 4, x1 - x0, 4]]) { PF(G, a, b, w, h, PGC.wd); PF(G, a, b, w, 1, PGC.wdL); for (let i = 6; i < w; i += 13) PF(G, a + i, b + 1, 4, 1, PGC.wdD) }
  for (const a of [x0, x1 - 4]) { PF(G, a, y0, 4, y - y0, PGC.wd); PF(G, a, y0, 1, y - y0, PGC.wdL) }
  for (const [a, b] of [[x0, y0], [x1 - 5, y0], [x0, y - 5], [x1 - 5, y - 5]]) { PF(G, a, b, 5, 5, PGC.wdD); PF(G, a + 1, b + 1, 3, 3, PGC.wdL) }
  PF(G, x + 6, y - 15, 7, 7, '#a02a24'); PF(G, x + 6, y - 15, 7, 2, '#e8504a'); PF(G, x + 7, y - 13, 5, 4, PGC.red); line1(G, x + 6, y - 16, x + 9, y - 19, 1, '#3a3a48'); line1(G, x + 9, y - 19, x + 12, y - 16, 1, '#3a3a48');
  PF(G, x + 16, y - 20, 1, 9, PGC.wdD); PF(G, x + 14, y - 12, 5, 4, PGC.blue); PF(G, x + 14, y - 12, 5, 1, PGC.blueL) }

Object.assign(OBJ, {
  swing: (x, y, e) => { drawC('pg_swing', 4, swingFrame, x, y); const R = RIDE && RIDE.e === e ? RIDE : null; if (!R) for (const s of [-1, 1]) swingSeat(x + s * 10, y, Math.sin(tick / 47 + s) * .05, null) },
  slide: (x, y) => drawC('pg_slide', 4, slideBody, x, y),
  seesaw: (x, y, e) => { drawC('pg_seesaw', 3, seesawStand, x, y); seesawPlank(x, y, e.tilt ?? .32) },
  sandbox: (x, y) => drawC('pg_sand', 4, sandBox, x, y),
  mgr: (x, y, e) => mgrDisc(x, y, e.phi || 0),
});
PROPS.mgr = { ...PROPS.mgr, flat: 1, d() {} };   // the roundabout is a live object now (it turns); the prop only keeps its footprint
(function () { const P_ = AREAS.w_play; if (!P_) return; for (const e of P_.ents) if (e.kind == 'mgr') { e.inv = 0; e.flat = 1 } })();

// ---------------------------------------------------------------- RIDES: smooth, eased, depth-sorted riders (the real player sprite is hidden)
const _endRide = endRide; endRide = function (atEnd) { HIDEP = HIDEF = 0; const R = RIDE; if (R && R.k == 'seesaw') R.e.tilt = .32; _endRide(atEnd); S.moving = false };
const _enter12 = enter; enter = function (...a) { HIDEP = HIDEF = 0; return _enter12(...a) };
function ride2(k, e, len, withFriend) { const fr = withFriend ? friendOpts()[0] : undefined; RIDE = { k, e, t: 0, len, x0: S.x, y0: S.y, ex: e.x, ey: e.y, fr }; HIDEP = 1; HIDEF = fr != null ? 1 : 0; S.moving = false;
  if (k == 'mgr') RIDE.a0 = Math.atan2((S.y - e.y) / 6, (S.x - e.x) / 14) - (e.phi || 0) }
Object.assign(EV, {
  swing(e) { const go_ = () => { ride2('swing', e, 720, true); const f = RIDE.fr; if (f != null) say(CH[f].n + (f == 0 ? ' takes the other swing.' : ' grabs the other swing!')) };
    if (!F_('sw1')) { S.fl.sw1 = 1; D(['|The swing creaks softly in no wind.', 'Hitori:neutral|...Just once.'], go_) } else go_() },
  slide(e) { ride2('slide', e, 112) },
  seesaw(e) { const fr = friendOpts(); if (!fr.length) return D(['|The seesaw is stuck halfway. There is no one on the other end.']); D([CH[fr[0]].n + ':happy|' + (fr[0] == 0 ? 'Fine. But I\'m heavier, so you\'re going to fly.' : 'Ooh, me! I call the other end!')], () => ride2('seesaw', e, 520, true)) },
  mgr(e) { ride2('mgr', e, 300); say('Round and round...') },
  hop(e) { ride2('hop', e, 0) },
});
rideUpdate = function () { const R = RIDE, e = R.e; R.t++; const t = R.t;
  const stopper = (maxAmp, rampT, fade) => { if (R.stop == null && ((t > 60 && ok()) || t > R.len)) { R.stop = t; R.a0 = R.amp } R.amp = R.stop == null ? Math.min(maxAmp, .08 + t / rampT) : R.a0 * Math.max(0, 1 - (t - R.stop) / fade); return R.stop != null && t - R.stop > fade };
  if (R.k == 'swing') { const done = stopper(.85, 150, 70), w = t * 6.2832 / 88; R.th = R.amp * Math.sin(w); R.th2 = R.amp * .92 * Math.sin(w + .8);
    if (Math.abs(Math.cos(w)) < .05 && R.amp > .35 && !R.ck) { R.ck = 1; beep(150 + R.amp * 40, .05, .35, 'triangle') } if (Math.abs(Math.cos(w)) > .3) R.ck = 0;
    if (t == 260 && R.fr != null) say(CH[R.fr].n + ': ' + ['Higher! Go higher!', 'Race you to the sky!', 'This is nice.', 'Don\'t jump off. I mean it.'][R.fr]); if (done) endRide() }
  else if (R.k == 'slide') { const ex = e.x, ey = e.y;
    if (t <= 44) { const u = t / 44; R.px = ex - 18; R.py = ey - 2 - u * 38; R.dir = 3; R.fr = 1 + ((t >> 3) & 3); if (t % 11 == 0) beep(300 + t * 4, .02, .4) }
    else if (t <= 58) { const u = (t - 44) / 14; R.px = ex - 18 + u * 10; R.py = ey - 40 + u * 6; R.dir = 0; R.fr = 0 }
    else if (t <= 82) { const u = ((t - 58) / 24) ** 1.8, i = u * 36; R.px = ex - 8 + i; R.py = ey - 40 + SLIDEY(i) + 6; R.dir = 2; R.fr = 0; if (t == 60) say('Wheee!') }
    else if (t <= 100) { const u = (t - 82) / 18; R.px = ex + 28 + u * 8; R.py = ey - 4 + u * 12 - Math.sin(u * Math.PI) * 8; R.dir = 0; R.fr = 0; if (t == 100) { beep(200, .05); R.dust = 12 } }
    else { S.x = ex + 36; S.y = ey + 8; S.dir = 0; endRide(true) } }
  else if (R.k == 'seesaw') { const done = stopper(.42, 120, 50); e.tilt = .32 * (1 - Math.min(1, t / 40)) + R.amp * Math.sin(t / 22 + 1.2); if (Math.abs(e.tilt) > .38 && !R.ck) { R.ck = 1; beep(110, .06, .7, 'triangle'); shake = 2 } if (Math.abs(e.tilt) < .2) R.ck = 0; if (done) endRide() }
  else if (R.k == 'mgr') { const L_ = R.len; R.w = t < L_ - 80 ? Math.min(.085, t / 900) : Math.max(0, .085 * (L_ - t) / 80); e.phi = (e.phi || 0) + R.w; if (t > L_) { endRide(); DIZZY = 200; say('So... dizzy...') } }
  else if (R.k == 'hop') { const cx_ = e.x + 8, by = e.y - 15, P = [[-40, -9]].concat([[-26, -9], [-17, -9], [-8, -9], [1, -9], [10, -9], [19, -9], [28, -9]]), path = P.concat(P.slice(0, -1).reverse()), n = (t / 18) | 0, k = (t % 18) / 18;
    if (n >= path.length - 1) return endRide(); const a = path[n], b = path[n + 1]; R.hx = cx_ + a[0] + (b[0] - a[0]) * k; R.hy = by + a[1] + 8; R.hz = Math.sin(k * Math.PI) * 8; R.dir = n < P.length - 1 ? 2 : 1;
    if (t % 18 == 0 && n > 0) { if (n < P.length) say(['1!', '2!', '3, 4!', '5!', '6, 7!', '8!', 'Home!'][n - 1]); beep(500 + (n % 8) * 70, .05) } }
};
// depth-sorted riders, the roundabout's centre post, and friends waiting their turn
XDRAW = function (L, cx, cy, ox, oy) { const SX = v => Math.round(v - cx + ox), SY = v => Math.round(v - cy + oy);
  for (const e of E) if (e.kind == 'mgr' && !e.inv) L.push({ y: e.y, f: () => mgrTop(SX(e.x), SY(e.y), e.phi || 0) });
  const R = RIDE;
  if (HIDEF && R) { let k = 0; S.party.filter(i => i != PL && i !== R.fr).forEach(i => { const wx = R.x0 + 22 + 16 * k++, wy = R.y0 + 6; L.push({ y: wy, f: () => drawChar(CH[i], SX(wx), SY(wy), 1, 0, 1) }) }) }   // friends waiting their turn stand beside you, watching
  if (!R) return; const e = R.e, x = SX(e.x), y = SY(e.y);
  if (R.k == 'swing') { L.push({ y: e.y + 2, f: () => { swingSeat(x - 10, y, R.th || 0, PL); swingSeat(x + 10, y, R.fr != null ? R.th2 || 0 : Math.sin(tick / 47) * .05, R.fr != null ? R.fr : null) } }) }
  else if (R.k == 'slide' && R.px != null) L.push({ y: e.y + 3, f: () => { drawChar(CH[PL], SX(R.px), SY(R.py), R.dir, R.fr, 1); if (R.dust > 0) { R.dust--; for (const s of [-1, 1]) r(SX(R.px) + s * (14 - R.dust), SY(R.py) - 1, 2, 2, 'rgba(230,220,200,.7)') } } });
  else if (R.k == 'seesaw') { const Y = k => y - 13 - k * (e.tilt || 0) * .55; L.push({ y: e.y + 1, f: () => { drawChar(CH[PL], x - 21, Math.round(Y(-21) + 8), 2, 0, 1); if (R.fr != null) drawChar(CH[R.fr], x + 21, Math.round(Y(21) + 8), 1, 0, 1); seesawPlank(x, y, e.tilt || 0, true) } }) }
  else if (R.k == 'mgr') { const a = (e.phi || 0) + (R.a0 || 0), px = e.x + Math.cos(a) * 14, py = e.y - 3 + Math.sin(a) * 6; L.push({ y: e.y + Math.sin(a) * 6, f: () => drawChar(CH[PL], SX(px), SY(py), Math.sin(a) > 0 ? 1 : 2, 0, 1) }) }
  else if (R.k == 'hop' && R.hx != null) L.push({ y: R.hy, f: () => { ell(SX(R.hx), SY(R.hy), 6, 2, 'rgba(0,0,0,.25)'); drawChar(CH[PL], SX(R.hx), SY(R.hy - R.hz), R.dir, R.hz > 2 ? 2 : 0, 1) } });
};

// ---------------------------------------------------------------- NEON CITY: grounded lamps, light pools, lanterns on real posts, a market gate
// the old double lamp sprite was cut from a sheet with bits of other tiles in it; build it from the clean single lamp, mirrored
PROPS.c_lamp2 = { s: S1, d(G, x, y) { const im = CIMG.lamp; if (!im || !im.naturalWidth) return; SHD(G, x + 1, y, 8, 2); CI(G, 'lamp', x - 6, y - im.height + 1); G.save(); G.translate(x, 0); G.scale(-1, 1); G.drawImage(im, -6, y - im.height + 1); G.restore(); PF(G, x - 4, y - 2, 8, 2, CP.ink); PF(G, x - 3, y - 3, 6, 1, CP.vio) } };
PROPS.lglow = { flat: 1, d(G, x, y, P, s, p) { for (const dx of p.two ? [-17, 17] : [16]) { PE(G, x + dx, y - 3, 20, 8, 'rgba(46,230,230,.06)'); PE(G, x + dx, y - 3, 14, 6, 'rgba(46,230,230,.07)'); PE(G, x + dx, y - 3, 7, 3, 'rgba(170,255,255,.08)') } } };
// a string of paper lanterns hung between two wooden posts set in stone footings (posts at tile x and x+n)
PROPS.lanterns = { w: 6, d(G, x, y, P, s, p) { const n = p.n || 6, a = x - 46, b = a + n * 16, top = y - 50, L_ = b - a, sag = Math.min(9, L_ / 11), Y = i => top + 3 + Math.sin(i / L_ * Math.PI) * sag;
  for (const q of [a, b]) { SHD(G, q + 2, y, 6, 2); PF(G, q - 2, y - 5, 8, 5, '#26263a'); PF(G, q - 2, y - 5, 8, 1, '#4a4a64'); PF(G, q, top, 4, y - 5 - top, '#5a3820'); PF(G, q, top, 1, y - 5 - top, '#8a5a34'); PF(G, q + 3, top, 1, y - 5 - top, '#3a2414'); PF(G, q - 1, top - 2, 6, 3, '#3a2414'); PF(G, q + 1, top - 5, 2, 3, '#3a2414'); PF(G, q + 4, top + 2, 2, 1, '#8a8aa0') }
  for (let i = 0; i <= L_; i++) PF(G, a + 2 + i, Y(i), 1, 1, '#1a1018');
  for (let i = 9; i < L_ - 5; i += 12) { const lx = a + 2 + i, ly = Y(i) + 1; PF(G, lx, ly, 1, 2, '#1a1018'); PF(G, lx - 3, ly + 2, 7, 2, '#2a0a0a'); PF(G, lx - 4, ly + 4, 9, 7, '#d8301a'); PF(G, lx - 3, ly + 4, 7, 7, '#ff5a2a'); PF(G, lx - 1, ly + 5, 2, 5, '#ffb07a'); PF(G, lx - 4, ly + 6, 9, 1, '#a82010'); PF(G, lx - 4, ly + 9, 9, 1, '#a82010'); PF(G, lx - 3, ly + 11, 7, 1, '#2a0a0a'); PF(G, lx, ly + 12, 1, 3, '#ffd23c'); PE(G, lx, ly + 7, 9, 8, 'rgba(255,110,60,.10)') } } };
// a lacquered gate over a road, with a name board and lanterns under the cross beam (posts at tile x and x+6)
PROPS.lgate = { w: 7, d(G, x, y, P, s, p) { const a = x - 52, b = x + 52;
  for (const q of [a, b]) { SHD(G, q + 2, y, 8, 3); PF(G, q - 4, y - 6, 11, 6, '#26263a'); PF(G, q - 4, y - 6, 11, 1, '#4a4a64'); PF(G, q - 2, y - 66, 7, 60, '#a01c22'); PF(G, q - 1, y - 66, 2, 60, '#d8343a'); PF(G, q + 4, y - 66, 1, 60, '#5a0a10'); PF(G, q - 2, y - 14, 7, 2, '#1a1018') }
  PF(G, a - 10, y - 74, b - a + 20, 5, '#1a1018'); PF(G, a - 10, y - 74, b - a + 20, 1, '#3a2a3a'); PF(G, a - 13, y - 77, 5, 4, '#1a1018'); PF(G, b + 8, y - 77, 5, 4, '#1a1018'); PF(G, a - 8, y - 69, b - a + 16, 4, '#a01c22'); PF(G, a - 8, y - 69, b - a + 16, 1, '#d8343a');
  PF(G, a - 4, y - 58, b - a + 8, 4, '#a01c22'); PF(G, a - 4, y - 58, b - a + 8, 1, '#d8343a'); PF(G, a - 4, y - 55, b - a + 8, 1, '#5a0a10');
  PF(G, x - 22, y - 66, 44, 9, '#1a1018'); PF(G, x - 21, y - 65, 42, 7, '#2a1420'); G.save(); G.font = 'bold 6px monospace'; G.textAlign = 'center'; G.fillStyle = '#ffd23c'; G.fillText(p.t || 'NIGHT MARKET', x, y - 59); G.restore();
  for (let i = 0; i < 6; i++) { const lx = a + 14 + i * 16, ly = y - 54; PF(G, lx, ly, 1, 3, '#1a1018'); PF(G, lx - 4, ly + 3, 9, 8, '#d8301a'); PF(G, lx - 3, ly + 3, 7, 8, '#ff5a2a'); PF(G, lx - 1, ly + 4, 2, 6, '#ffb07a'); PF(G, lx - 3, ly + 2, 7, 1, '#2a0a0a'); PF(G, lx - 3, ly + 11, 7, 1, '#2a0a0a'); PF(G, lx, ly + 12, 1, 3, '#ffd23c') } } };
// lanterns pinned to an interior wall (ramen shop)
PROPS.wlant = { w: 1, flat: 1, d(G, x, y) { const a = x - 44, b = x + 44, L_ = b - a, Y = i => y - 30 + Math.sin(i / L_ * Math.PI) * 6; for (const q of [a, b]) { PF(G, q - 1, y - 32, 3, 3, '#3a2414') } for (let i = 0; i <= L_; i++) PF(G, a + i, Y(i), 1, 1, '#1a1018');
  for (let i = 8; i < L_ - 4; i += 12) { const lx = a + i, ly = Y(i) + 1; PF(G, lx - 3, ly + 1, 7, 1, '#2a0a0a'); PF(G, lx - 4, ly + 2, 9, 7, '#d8301a'); PF(G, lx - 3, ly + 2, 7, 7, '#ff5a2a'); PF(G, lx - 1, ly + 3, 2, 5, '#ffb07a'); PF(G, lx - 3, ly + 9, 7, 1, '#2a0a0a'); PE(G, lx, ly + 5, 9, 8, 'rgba(255,110,60,.10)') } } };
// a little food-court table with two stools and bowls of something steaming
PROPS.ftable = { s: S1, d(G, x, y, P, s) { SHD(G, x + 1, y, 15, 3); for (const sx of [-11, 11]) { PF(G, x + sx - 1, y - 6, 2, 6, '#1a1a2a'); PE(G, x + sx, y - 7, 4, 2, '#2a2a3c'); PE(G, x + sx, y - 8, 4, 1.5, s < .5 ? CP.pink2 : '#3a7ad0') }
  PF(G, x - 1, y - 11, 3, 11, '#1a1a2a'); PF(G, x - 4, y - 2, 9, 2, '#1a1a2a'); PE(G, x, y - 12, 10, 4, '#3a2414'); PE(G, x, y - 13, 9, 3, '#8a5a34'); PF(G, x - 8, y - 14, 16, 1, '#a8723c');
  PE(G, x - 3, y - 15, 3, 1.5, '#f4f0e8'); PE(G, x - 3, y - 15, 2, 1, '#e8a03a'); PE(G, x + 4, y - 14, 3, 1.5, '#e8402a'); PF(G, x + 4, y - 20, 1, 4, 'rgba(255,255,255,.35)'); PF(G, x - 3, y - 21, 1, 4, 'rgba(255,255,255,.3)') } };

// ---------------------------------------------------------------- CASINO: nothing floats; gold inlays on the carpet, standing lamps, brass rope posts
PROPS.chandelier = { w: 3, flat: 1, d(G, x, y) { const cy_ = y - 8; PE(G, x, cy_, 30, 12, 'rgba(255,214,140,.07)'); PE(G, x, cy_, 25, 10, '#5a0820'); PE(G, x, cy_, 24, 9, '#c8a040'); PE(G, x, cy_, 22, 8, '#7a0a2a'); PE(G, x, cy_, 17, 6, '#8a1030');
  for (let i = 0; i < 16; i++) { const a = i * .3927, k = i & 1 ? 14 : 20; PF(G, x + Math.cos(a) * k * .5, cy_ + Math.sin(a) * k * .2, 1, 1, '#c8a040'); PF(G, x + Math.cos(a) * k, cy_ + Math.sin(a) * k * .4, 1, 1, '#e8c060') }
  PE(G, x, cy_, 6, 2.5, '#c8a040'); PE(G, x, cy_, 4, 1.5, '#fff0b0') } };
PROPS.flamp = { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PE(G, x, y - 2, 5, 2, '#8a6a20'); PE(G, x, y - 3, 4, 1.5, CP.gold); PF(G, x - 1, y - 34, 2, 31, '#c8a040'); PF(G, x - 1, y - 34, 1, 31, '#fff0b0'); PE(G, x, y - 20, 2, 1, '#8a6a20');
  for (let k = 0; k < 12; k++) PF(G, x - 4 - k * .4, y - 47 + k, 8 + k * .8, 1, k < 2 ? '#fff6d8' : k > 9 ? '#e8b060' : '#ffe0a0'); PF(G, x - 9, y - 36, 18, 1, '#a8862a'); PE(G, x, y - 40, 18, 13, 'rgba(255,220,140,.10)') } };
PROPS.cocktail = { s: S1, d(G, x, y) { SHD(G, x + 1, y, 14, 3); for (const sx of [-10, 10]) { PF(G, x + sx - 1, y - 7, 2, 7, '#c8a040'); PE(G, x + sx, y - 8, 4, 2, '#5a0820'); PE(G, x + sx, y - 9, 4, 1.5, '#a8203c') }
  PF(G, x - 1, y - 12, 2, 12, '#c8a040'); PE(G, x, y - 1, 4, 1.5, '#8a6a20'); PE(G, x, y - 13, 8, 3, '#3a0a1a'); PE(G, x, y - 14, 7, 2.5, '#1a0a10'); PF(G, x - 4, y - 18, 2, 4, 'rgba(200,240,255,.7)'); PF(G, x + 2, y - 17, 2, 3, 'rgba(255,200,120,.8)'); PF(G, x - 1, y - 15, 2, 1, '#e8c060') } };
PROPS.vpost = { s: S1, d(G, x, y, P, s, p) { SHD(G, x + 1, y, 4, 2); PE(G, x, y - 1, 4, 1.5, '#8a6a20'); PF(G, x - 1, y - 14, 3, 13, '#c8a040'); PF(G, x - 1, y - 14, 1, 13, '#fff0b0'); PE(G, x, y - 15, 2.5, 2, CP.gold);
  if (p.up) { const L_ = p.up * 16; for (let i = 2; i < L_ - 1; i++) PF(G, x + Math.sin(i / L_ * Math.PI) * 3, y - 13 - i, 2, 1, i % 4 ? '#a01838' : '#c82848') } } };

// ---------------------------------------------------------------- layout touches (applied before any of these maps are first built)
(function () {
  const add = (a, ...f) => AREAS[a] && AREAS[a].feat.push(...f), sol = (x, y, w = 1, h = 1) => ({ k: 'solid', x, y, w, h });
  // casino lobby: rope lines along the red carpet (gap in the middle to cross), lamps by the sofas
  add('n_casino', ...ps('flamp', [[4, 17], [8, 17], [30, 17], [34, 17], [12, 4], [27, 4]]), ...[17, 22].flatMap(x => [p('vpost', x, 6), p('vpost', x, 9, { up: 3 }), p('vpost', x, 14), p('vpost', x, 17, { up: 3 }), sol(x, 7, 1, 2), sol(x, 15, 1, 2)]));
  add('n_floor', ...ps('flamp', [[2, 8], [2, 18], [45, 8], [45, 18], [17, 3], [30, 3]]), ...ps('cocktail', [[15, 13], [32, 13]]));
  add('n_lounge', ...ps('flamp', [[12, 12], [24, 12], [16, 15], [20, 15], [5, 10]]));
  add('n_vault', ...ps('flamp', [[4, 16], [25, 16]]));
  // the ramen shop's lanterns hang on its wall now
  if (AREAS.n_ramen) AREAS.n_ramen.feat = AREAS.n_ramen.feat.filter(f => f.id != 'lanterns').concat([p('wlant', 13, 2)]);
  // every lamp gets a pool of light; every lantern post and gate post is solid
  for (const id in AREAS) { const A_ = AREAS[id]; if (!A_.feat || !id.startsWith('n_')) continue; const extra = [];
    for (const f of A_.feat) { if (f.k != 'p') continue;
      if (f.id == 'c_lamp' || f.id == 'c_lamp2') extra.push(p('lglow', f.x, f.y, { two: f.id == 'c_lamp2' }));
      if (f.id == 'lanterns') extra.push(sol(f.x, f.y), sol(f.x + (f.n || 6), f.y));
      if (f.id == 'lgate') extra.push(sol(f.x, f.y), sol(f.x + 6, f.y)) }
    A_.feat.unshift(...extra.filter(q => q.id == 'lglow')); A_.feat.push(...extra.filter(q => q.k == 'solid')) }
})();
