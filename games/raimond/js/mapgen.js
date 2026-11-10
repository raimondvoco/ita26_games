// ==================== AREA BUILDER + RENDERER ====================
// Every place is its own screen-sized "area" (like OMORI). AREAS (js/areas*.js) describe them; buildArea() turns a description into
// collision (t), ground (gt) and two pre-rendered layers: base (under characters) and top (canopies, roofs, tall prop tops).
//
// Collision codes (t):  0 walk  1 small tree  2 water  3 wall/building  5 door  6 fence  7 rock  8 parasol  9 bush  10 void
//                       12 foliage mass (big trees / palms / city blocks)  14 invisible solid  15 cliff face  16 cliff side
// Ground codes (gt):    0 base  1 tall grass  2 path  3 flowers  4 lawn  5 plaza  6 stone  7 boards  8 wet sand  9 dirt  10 crops
//                       11 carpet  12 stairs  13 moss
const AREAS = {}, MP = {};
const A = (id, spec) => { AREAS[id] = { id, edge: 'tree', base: 0, feat: [], exits: [], ents: [], tree: 'tree', ...spec } };
function vn(x, y, sd) {   // smooth value noise 0..1
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, sm = q => q * q * (3 - 2 * q);
  const a = hsh(xi, yi, sd), b = hsh(xi + 1, yi, sd), c = hsh(xi, yi + 1, sd), d = hsh(xi + 1, yi + 1, sd), u = a + (b - a) * sm(xf), v = c + (d - c) * sm(xf);
  return u + (v - u) * sm(yf);
}
function exitRect(A, e) {   // pixel rectangle of an exit band (just inside the border)
  const w = A.w, h = A.h;
  if (e.side == 'down') return { x: e.a * T, y: (h - 1) * T, w: (e.b - e.a + 1) * T, h: T };
  if (e.side == 'up') return { x: e.a * T, y: 0, w: (e.b - e.a + 1) * T, h: T };
  if (e.side == 'left') return { x: 0, y: e.a * T, w: T, h: (e.b - e.a + 1) * T };
  return { x: (w - 1) * T, y: e.a * T, w: T, h: (e.b - e.a + 1) * T };
}
const WALK_SOFT = [1, 12, 9, 7, 14, 10];   // things a carved path/clearing is allowed to remove
function buildArea(id) {
  const A0 = AREAS[id]; if (!A0) throw new Error('no area ' + id);
  const w = A0.w, h = A0.h, I = (x, y) => y * w + x, okc = (x, y) => x >= 0 && y >= 0 && x < w && y < h, R = rng(id.length * 977 + w * 13 + h);
  const t = new Uint8Array(w * h), gt = new Uint8Array(w * h).fill(A0.base), PAL0 = PAL[A0.pal], P = Object.assign({ to: '#1a1626', tuft2: '#000', pink: '#777', pink2: '#666', wt2: '#fff', wo: '#000' }, CLIFF[A0.pal] || CLIFF.forest, PAL0, A0.palx || {});
  const mp = { id, w, h, t, gt, A: A0, exits: [], doors: [], props: [], ledges: [], bridges: [], pal: A0.pal, P, interior: !!A0.interior, blds: [], bigtrees: [] };
  const set = (x, y, v) => { if (okc(x, y)) t[I(x, y)] = v }, setg = (x, y, v) => { if (okc(x, y)) gt[I(x, y)] = v };
  const rect = (x0, y0, ww, hh, fn) => { for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + ww; x++) if (okc(x, y)) fn(x, y) };
  const carve = (x, y, g) => { if (!okc(x, y)) return; const v = t[I(x, y)]; if (v == 0 || WALK_SOFT.includes(v)) t[I(x, y)] = 0; if (g != null && v != 2 && v != 3) gt[I(x, y)] = g };
  const bt = A0.interior ? 2 : A0.edge == 'tree' ? 3 : 1;
  // ---- border
  const edgeV = A0.interior ? 3 : A0.edge == 'tree' ? 12 : A0.edge == 'wall' ? 3 : A0.edge == 'void' ? 10 : A0.edge == 'water' ? 2 : 7;
  rect(0, 0, w, h, (x, y) => { if (x < bt || y < bt || x >= w - bt || y >= h - bt) t[I(x, y)] = edgeV });
  if (A0.fill) rect(bt, bt, w - bt * 2, h - bt * 2, (x, y) => t[I(x, y)] = A0.fill == 'void' ? 10 : A0.fill == 'wall' ? 3 : 12);
  // ---- features, in order
  for (const f of A0.feat) {
    const k = f.k;
    if (k == 'ground') rect(f.x, f.y, f.w, f.h, (x, y) => setg(x, y, f.g));
    if (k == 'gblob') rect(f.x - f.rx - 2, f.y - f.ry - 2, f.rx * 2 + 5, f.ry * 2 + 5, (x, y) => { const dx = (x - f.x) / f.rx, dy = (y - f.y) / f.ry; if (dx * dx + dy * dy + (vn(x / 1.8, y / 1.8, 11 + (f.s || 0)) - .5) * .9 < 1 && (t[I(x, y)] == 0 || f.any) && gt[I(x, y)] != 2 && gt[I(x, y)] != 7) gt[I(x, y)] = f.g });
    if (k == 'open') rect(f.x, f.y, f.w, f.h, (x, y) => carve(x, y, f.g));
    if (k == 'blob') rect(f.x - f.rx - 2, f.y - f.ry - 2, f.rx * 2 + 5, f.ry * 2 + 5, (x, y) => { const dx = (x - f.x) / f.rx, dy = (y - f.y) / f.ry; if (dx * dx + dy * dy + (vn(x / 2.2, y / 2.2, 5 + (f.s || 0)) - .5) * (f.rough ?? .7) < 1) carve(x, y, f.g) });
    if (k == 'woods') rect(f.x, f.y, f.w, f.h, (x, y) => { if (!t[I(x, y)] || f.all) t[I(x, y)] = 12 });
    if (k == 'clump') rect(f.x - f.rx - 1, f.y - f.ry - 1, f.rx * 2 + 3, f.ry * 2 + 3, (x, y) => { const dx = (x - f.x) / f.rx, dy = (y - f.y) / f.ry; if (dx * dx + dy * dy + (vn(x / 2, y / 2, 7) - .5) * .6 < 1 && !t[I(x, y)]) t[I(x, y)] = f.t || 12 });
    if (k == 'path') { const pts = f.pts, ww = f.w || 2; for (let i = 0; i < pts.length - 1; i++) { let [x, y] = pts[i]; const [bx, by] = pts[i + 1]; const step = () => { const horiz = Math.abs(bx - x) >= Math.abs(by - y); for (let j = 0; j < ww; j++) { const px = horiz ? x : x + j - (ww >> 1), py = horiz ? y + j - (ww >> 1) : y; if (okc(px, py) && t[I(px, py)] != 3 && t[I(px, py)] != 5) { if (t[I(px, py)] == 2 && !f.wet) continue; if (gt[I(px, py)] != 7 && gt[I(px, py)] != 12) gt[I(px, py)] = f.g ?? 2; if (t[I(px, py)] != 15 && t[I(px, py)] != 16) carve(px, py) } } if (horiz) x += Math.sign(bx - x); else y += Math.sign(by - y) }; while (x != bx || y != by) step(); step() } }
    if (k == 'river') { const pts = f.pts, ww = f.w || 3; for (let i = 0; i < pts.length - 1; i++) { let [x, y] = pts[i]; const [bx, by] = pts[i + 1]; while (true) { for (let a = -(ww >> 1); a < ww - (ww >> 1); a++) for (let b2 = -(ww >> 1); b2 < ww - (ww >> 1); b2++) { set(x + a, y + b2, 2); setg(x + a, y + b2, 0) } if (x == bx && y == by) break; const horiz = Math.abs(bx - x) >= Math.abs(by - y); if (horiz) x += Math.sign(bx - x); else y += Math.sign(by - y) } } }
    if (k == 'pond') rect(f.x - f.rx - 1, f.y - f.ry - 1, f.rx * 2 + 3, f.ry * 2 + 3, (x, y) => { const dx = (x - f.x) / f.rx, dy = (y - f.y) / f.ry; if (dx * dx + dy * dy + (vn(x / 2, y / 2, 9) - .5) * .5 < 1) { set(x, y, 2); setg(x, y, 0) } });
    if (k == 'water') rect(f.x, f.y, f.w, f.h, (x, y) => { set(x, y, 2); setg(x, y, 0) });
    if (k == 'bridge') { rect(f.x, f.y, f.w, f.h, (x, y) => { set(x, y, 0); setg(x, y, 7) }); mp.bridges.push(f) }
    if (k == 'ledge') {   // raised ground: plateau (x,y,w,h) with a cliff face of height fh below it and thin sides; st = stair columns (2 wide)
      const fh = f.fh ?? 2, st = f.st || []; rect(f.x, f.y, f.w, f.h, (x, y) => carve(x, y, f.g));
      rect(f.x, f.y + f.h, f.w, fh, (x, y) => { if (st.some(s => x == s || x == s + 1)) { t[I(x, y)] = 0; gt[I(x, y)] = 12 } else t[I(x, y)] = 15 });
      if (!f.noside) for (let y = f.y; y < f.y + f.h + fh; y++) { for (const x of [f.x - 1, f.x + f.w]) if (okc(x, y) && t[I(x, y)] == 0) t[I(x, y)] = 16 }
      mp.ledges.push({ ...f, fh });
    }
    if (k == 'fence') { for (let x = f.x; x < f.x + f.w; x++) for (const y of [f.y, f.y + f.h - 1]) if (!(f.gaps || []).some(g => x >= g[0] && x <= g[1] && y == (g[2] ?? y))) set(x, y, 6); for (let y = f.y; y < f.y + f.h; y++) for (const x of [f.x, f.x + f.w - 1]) if (!(f.gaps || []).some(g => y >= g[0] && y <= g[1] && x == g[3])) set(x, y, 6) }
    if (k == 'fline') { if (f.h) for (let y = f.y; y < f.y + f.h; y++) set(f.x, y, 6); else for (let x = f.x; x < f.x + f.w; x++) set(x, f.y, 6) }
    if (k == 'scatter') rect(f.x, f.y, f.w, f.h, (x, y) => { if (!t[I(x, y)] && gt[I(x, y)] != 2 && hsh(x, y, f.s || 3) < f.d) t[I(x, y)] = f.t || 1 });
    if (k == 'trees') rect(f.x, f.y, f.w, f.h, (x, y) => { const n = vn(x / 4.5, y / 4.5, 1) * .65 + vn(x / 1.8, y / 1.8, 2) * .35; if (!t[I(x, y)] && gt[I(x, y)] != 2 && n > (f.v || .5)) t[I(x, y)] = 12 });
    if (k == 'clear') rect(f.x, f.y, f.w, f.h, (x, y) => { if (t[I(x, y)] != 3 || f.all) t[I(x, y)] = 0 });
    if (k == 'prop') set(f.x, f.y, f.t);
    if (k == 'bld') { rect(f.x, f.y, f.w, f.h, (x, y) => set(x, y, 3)); if (!f.nodoor) { const dx = f.x + (f.door ?? (f.w >> 1)); set(dx, f.y + f.h - 1, 5); rect(dx - 1, f.y + f.h, 3, 2, (x, y) => { carve(x, y); if (gt[I(x, y)] == 1) setg(x, y, 0) }); mp.doors.push({ x: dx, y: f.y + f.h - 1, to: f.to, label: f.sign, locked: f.lock, msg: f.msg }) } mp.blds.push(f) }
    if (k == 'bigtree') { rect(f.x - 1, f.y - 1, 3, 3, (x, y) => set(x, y, 14)); mp.bigtrees.push(f) }
    if (k == 'wall') rect(f.x, f.y, f.w, f.h, (x, y) => set(x, y, 3));
    if (k == 'solid') rect(f.x, f.y, f.w || 1, f.h || 1, (x, y) => set(x, y, 14));
    if (k == 'p') { const d = PROPS[f.id]; if (!d) { console.warn('no prop', f.id); continue } mp.props.push(f); if (d.s && !f.ghost) { const [sx, sy, sw, sh_] = d.s; rect(f.x + sx, f.y + sy, sw, sh_, (x, y) => { if (!t[I(x, y)]) t[I(x, y)] = 14 }) } }
  }
  // ---- exits: carve a gap in the border and lay a path through it
  for (const e of A0.exits) {
    const r0 = exitRect(A0, e); mp.exits.push({ ...e, ...r0 });
    const deep = Math.max(bt + 2, e.deep || 0);
    for (let k = e.a; k <= e.b; k++) for (let d = 0; d < deep; d++) {
      const x = e.side == 'left' ? d : e.side == 'right' ? w - 1 - d : k, y = e.side == 'up' ? d : e.side == 'down' ? h - 1 - d : k;
      if (okc(x, y)) { if (t[I(x, y)] != 3 || d < bt) t[I(x, y)] = 0; if (!A0.interior && e.g !== false && gt[I(x, y)] != 7) gt[I(x, y)] = e.g ?? (A0.pathg ?? 2) }
    }
  }
  // ---- entity footprints that block movement
  for (const e of A0.ents) if (e.solid) { const [sx, sy, sw, sh_] = e.solid; rect(e.at[0] + sx, e.at[1] + sy, sw, sh_, (x, y) => { if (!t[I(x, y)]) t[I(x, y)] = 14 }) }
  renderArea(mp, R); mp.stale = !!A0.city && typeof cityReady == 'function' && !cityReady(); return MP[id] = mp;
}
const areaMap = id => MP[id] && !(MP[id].stale && cityReady()) ? MP[id] : buildArea(id);
// cliff colours per palette (face, dark strata, light edge, lip)
const CLIFF = {
  forest: { cf: '#c8a77c', cd: '#a2825c', cl: '#e2c69c', co: '#5e4630' }, hub: { cf: '#c8a77c', cd: '#a2825c', cl: '#e2c69c', co: '#5e4630' },
  dark: { cf: '#5c5078', cd: '#463c62', cl: '#7a6e9c', co: '#1e1830' }, beach: { cf: '#e0c08a', cd: '#c4a06c', cl: '#f4dcac', co: '#7a5a34' },
  city: { cf: '#2a2a42', cd: '#1c1c30', cl: '#3e3e5c', co: '#08080e' }, space: { cf: '#2a2458', cd: '#1c1840', cl: '#4a42a0', co: '#05040c' },
  castle: { cf: '#4a4468', cd: '#3a3454', cl: '#6a6490', co: '#14101e' }, casino: { cf: '#4a1636', cd: '#300a22', cl: '#701850', co: '#10040a' }
};
// ---------------------------------------------------------------- rendering
function renderArea(mp, R) {
  const { w, h, t, gt, P, A: A0 } = mp, I = (x, y) => y * w + x, okc = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const mk = () => { const c = document.createElement('canvas'); c.width = w * T; c.height = h * T; return c };
  mp.im = mk(); mp.tp = mk(); const g = mp.im.getContext('2d'), g2 = mp.tp.getContext('2d');
  const F = (x, y, ww, hh, c, G = g) => { G.fillStyle = c; G.fillRect(Math.round(x), Math.round(y), Math.round(ww), Math.round(hh)) }, tv = (x, y) => okc(x, y) ? t[I(x, y)] : 255, gnb = (x, y, v) => okc(x, y) && gt[I(x, y)] == v;
  const sprig = (x, y, c) => { F(x, y + 1, 1, 1, c); F(x + 1, y, 1, 2, c); F(x + 2, y + 1, 1, 1, c) };
  const floor = A0.floor || 'grass', pal = A0.pal, natural = !mp.interior && !['city', 'casino', 'castle'].includes(pal);
  const tallSolid = v => v == 12 || v == 3 || v == 15 || v == 16 || v == 1 || v == 10;
  // ---- 1. ground
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const px = x * T, py = y * T, G = gt[I(x, y)], v = t[I(x, y)], nz = vn(x / 6, y / 6, 3), nz2 = vn(x / 2.5, y / 2.5, 8);
    let col = natural && !A0.mottle ? P.a[0] : P.a[nz > .6 ? 2 : nz < .4 ? 1 : 0]; if (G == 1) col = P.tall; if (G == 4) col = natural && !A0.lawn ? P.a[0] : P.lawn; if (G == 5) col = (x + y) & 1 ? P.plaza : P.pl2; if (G == 2) col = P.path; if (G == 7) col = '#9a6e44'; if (G == 9 || G == 10) col = P.dirt || '#a8825a'; if (G == 6) col = P.stone || P.plaza; if (G == 8) col = P.wet || sh(P.a[0], .9); if (G == 11) col = P.carpet || '#7a1a22'; if (G == 13) col = P.moss || sh(P.a[0], .85); if (G == 3 && P.flg) col = P.flg;
    F(px, py, T, T, col);
    for (let i = 0; i < 3; i++) F(px + (hsh(x, y, i) * 15 | 0), py + (hsh(x, y, i + 7) * 15 | 0), 1, 1, G == 2 ? P.path2 : P.sp);
    if (mp.interior) {
      if (floor == 'cbrick') castleFloor(F, px, py, x, y, G, gnb);
      if (floor == 'wood') { F(px, py + 15, T, 1, 'rgba(0,0,0,.22)'); F(px + ((y % 2) * 8), py, 1, T, 'rgba(0,0,0,.18)'); F(px + 3, py + 4, 4, 1, 'rgba(255,255,255,.06)') }
      if (floor == 'marble') { F(px, py, T, T, (x + y) & 1 ? '#f0ece4' : '#e4ded2'); F(px, py + 15, T, 1, '#c8c0b0'); F(px + 15, py, 1, T, '#d4ccbc'); if (hsh(x, y, 3) < .5) { F(px + 3, py + 4 + hsh(x, y, 4) * 6, 6, 1, '#d0c8bc'); F(px + 8, py + 5 + hsh(x, y, 4) * 6, 4, 1, '#d0c8bc') } }
      if (floor == 'sand') { F(px, py, T, T, '#e8d4a4'); for (let i = 0; i < 5; i++) F(px + hsh(x, y, i) * 15, py + hsh(x, y, i + 9) * 15, 1, 1, i % 2 ? '#c8b080' : '#f8e8c0') }
      if (floor == 'arcade') { F(px, py, T, T, '#14104a'); const k = hsh(x, y, 5); if (k < .13) { const c = ['#ff5a8a', '#2ee6e6', '#ffd23c', '#8cff5a'][(k * 11 | 0) % 4]; F(px + 3 + hsh(x, y, 6) * 8, py + 3 + hsh(x, y, 7) * 8, 4, 1, c); F(px + 4 + hsh(x, y, 6) * 8, py + 4 + hsh(x, y, 7) * 8, 1, 3, c) } else if (k < .3) { F(px + 6, py + 6, 3, 3, '#1c1658') } }
      if (floor == 'tile' || floor == 'checker') { F(px, py, T, T, (x + y) & 1 ? P.plaza : P.pl2); F(px, py + 15, T, 1, 'rgba(0,0,0,.18)'); F(px + 15, py, 1, T, 'rgba(0,0,0,.1)'); F(px + 2, py + 2, 3, 1, 'rgba(255,255,255,.08)') }
      if (G == 2) { F(px, py, T, T, P.path); F(px, py + 2, T, 1, P.path2); F(px, py + 13, T, 1, P.path2); if (!gnb(x - 1, y, 2)) { F(px, py, 2, T, P.pe); F(px + 3, py, 1, T, '#e8c060') } if (!gnb(x + 1, y, 2)) { F(px + 14, py, 2, T, P.pe); F(px + 12, py, 1, T, '#e8c060') } }
      if (G == 11 && floor != 'cbrick') { F(px, py, T, T, P.carpet || '#7a1a22'); if (P.cpat) { if ((x + y) % 2 == 0) { F(px + 7, py + 3, 2, 10, '#5a0820'); F(px + 3, py + 7, 10, 2, '#5a0820'); F(px + 7, py + 7, 2, 2, P.cpat) } else { F(px + 6, py + 6, 4, 4, '#8a1838'); F(px + 7, py + 7, 2, 2, '#a8862a') } } else { if (!gnb(x - 1, y, 11)) F(px, py, 2, T, '#e8c060'); if (!gnb(x + 1, y, 11)) F(px + 14, py, 2, T, '#e8c060') } }
      if (G == 7) { for (let i = 0; i < 4; i++) F(px, py + i * 4, T, 1, '#6a4628'); F(px + 3 + (y % 2) * 6, py, 1, T, '#6a4628') }
    } else {
      if (G == 5) { F(px, py + 15, T, 1, P.pl2); F(px + 15, py, 1, T, P.pl2); F(px + 1, py + 1, 2, 1, 'rgba(255,255,255,.25)') }
      if (G == 6) { F(px, py, T, T, (x * 7 + y * 3) % 5 ? (P.stone || '#6c648a') : sh(P.stone || '#6c648a', .9)); F(px, py + 7, T, 1, 'rgba(0,0,0,.2)'); F(px + ((y & 1) ? 4 : 11), py, 1, 7, 'rgba(0,0,0,.2)'); F(px + ((y & 1) ? 11 : 4), py + 8, 1, 8, 'rgba(0,0,0,.2)'); F(px, py + 15, T, 1, 'rgba(0,0,0,.25)') }
      if (G == 7) { for (let i = 0; i < 4; i++) { F(px, py + i * 4, T, 1, '#6a4628'); F(px, py + i * 4 + 1, T, 1, 'rgba(255,255,255,.08)') } F(px + 3 + (y % 2) * 6, py, 1, T, '#6a4628'); if (hsh(x, y, 5) < .3) F(px + 7, py + 6, 1, 1, '#4a3018') }
      if (G == 9) { for (let i = 0; i < 4; i++) F(px + hsh(x, y, i + 50) * 14, py + hsh(x, y, i + 60) * 14, 2, 1, sh(P.dirt || '#a8825a', .8)) }
      if (G == 10) { F(px, py + 7, T, 2, sh(P.dirt || '#a8825a', .75)); if (x % 2 == 0) { F(px + 4, py + 2, 2, 5, '#3a8a4a'); F(px + 2, py + 3, 2, 2, '#5ab86a'); F(px + 6, py + 3, 2, 2, '#5ab86a'); F(px + 11, py + 10, 2, 4, '#3a8a4a'); F(px + 9, py + 11, 2, 2, '#5ab86a'); F(px + 13, py + 11, 2, 2, '#5ab86a') } }
      if (G == 12) { F(px, py, T, T, P.cd); for (let i = 0; i < 4; i++) { F(px, py + i * 4, T, 3, i & 1 ? P.cf : P.cl); F(px, py + i * 4 + 3, T, 1, P.co) } }
      if ((G == 0 || G == 4) && natural && pal != 'space' && pal != 'beach' && hsh(x, y, 3) < (G ? .14 : .3)) sprig(px + 2 + (hsh(x, y, 4) * 11 | 0), py + 3 + (hsh(x, y, 5) * 9 | 0), P.tuft);
      if (G == 1) for (let i = 0; i < 4; i++) { const a = px + 2 + i * 4, b = py + 3 + ((i * 5 + x) % 7); F(a, b, 1, 4, P.tuft2); F(a + 1, b + 1, 1, 3, P.tuft); F(a - 1, b + 2, 1, 2, P.tuft2) }
      if (G == 3 && hsh(x, y, 2) < .8) for (let i = 0; i < 2; i++) { const fx = px + 2 + (hsh(x, y, i + 20) * 10 | 0), fy = py + 2 + (hsh(x, y, i + 30) * 10 | 0), fc = P.fl[(hsh(x, y, i + 40) * 4) | 0] || '#fff'; F(fx + 1, fy + 3, 1, 2, P.tuft2); F(fx, fy + 1, 3, 1, fc); F(fx + 1, fy, 1, 3, fc); F(fx + 1, fy + 1, 1, 1, '#ffe27a') }
      if (G == 2) {   // dirt path with soft, slightly ragged edges
        const up = gnb(x, y - 1, 2) || gnb(x, y - 1, 12) || gnb(x, y - 1, 7), dn2 = gnb(x, y + 1, 2) || gnb(x, y + 1, 12) || gnb(x, y + 1, 7), lf2 = gnb(x - 1, y, 2) || gnb(x - 1, y, 7), rt2 = gnb(x + 1, y, 2) || gnb(x + 1, y, 7);
        if (!up) { F(px, py, T, 1, P.pe); F(px, py + 1, T, 1, P.path2); if (hsh(x, y, 70) < .5) F(px + 4, py + 1, 3, 1, P.a[0]) } if (!dn2) { F(px, py + 15, T, 1, P.pe); F(px, py + 14, T, 1, P.path2) }
        if (!lf2) { F(px, py, 1, T, P.pe); F(px + 1, py, 1, T, P.path2) } if (!rt2) { F(px + 15, py, 1, T, P.pe); F(px + 14, py, 1, T, P.path2) }
        if (hsh(x, y, 71) < .18) { F(px + 5 + hsh(x, y, 72) * 6, py + 6 + hsh(x, y, 73) * 6, 2, 1, P.pe) }
      }
    }
  }
  // ---- 1b. ragged edges where one kind of ground meets another (tall grass, dirt, moss, wet sand)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const G = gt[I(x, y)]; if (![1, 9, 13, 8].includes(G) || t[I(x, y)] == 2) continue; const px = x * T, py = y * T;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { if (!okc(x + dx, y + dy)) continue; const G2 = gt[I(x + dx, y + dy)]; if (G2 == G || G2 == 2 || G2 == 7 || G2 == 12 || G2 == 5 || G2 == 6) continue;
      const nc = P.a[0]; for (let i = 0; i < 16; i += 2) { const d = 1 + (hsh(x * 3 + i, y * 5 + dx + dy * 3, 33) * 4 | 0); if (dx == 1) F(px + 16 - d, py + i, d, 2, nc); if (dx == -1) F(px, py + i, d, 2, nc); if (dy == 1) F(px + i, py + 16 - d, 2, d, nc); if (dy == -1) F(px + i, py, 2, d, nc) } } }
  // ---- 2. water (with foam edges, ripples, lily pads by the shore)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (t[I(x, y)] != 2) continue; const px = x * T, py = y * T, isW = (a, b) => tv(a, b) == 2 || tv(a, b) == 255;
    F(px, py, T, T, P.wt);
    F(px + 2 + (y % 3) * 2, py + 5, 5, 1, P.wt2); F(px + 9, py + 11, 4, 1, P.wt2); if (hsh(x, y, 4) < .3) F(px + 4, py + 13, 3, 1, P.wt2);
    if (!isW(x, y - 1)) { F(px, py, T, 3, P.wo); F(px, py + 3, T, 2, P.wt2); F(px, py + 5, T, 1, 'rgba(255,255,255,.35)') } if (!isW(x, y + 1)) { F(px, py + 14, T, 2, 'rgba(255,255,255,.4)') }
    if (!isW(x - 1, y)) { F(px, py, 2, T, P.wo); F(px + 2, py, 1, T, 'rgba(255,255,255,.35)') } if (!isW(x + 1, y)) { F(px + 14, py, 2, T, P.wo); F(px + 13, py, 1, T, 'rgba(255,255,255,.35)') }
    const shore = !isW(x - 1, y) || !isW(x + 1, y) || !isW(x, y + 1) || !isW(x, y - 1);
    if (natural && pal != 'beach' && pal != 'space' && !A0.nolily && shore && hsh(x, y, 15) < .3) { ell(px + 8, py + 9, 4, 2.4, '#3a9a5a', g); ell(px + 7, py + 8, 3, 1.8, '#5ac07a', g); F(px + 8, py + 8, 2, 1, '#3a9a5a'); if (hsh(x, y, 16) < .3) { F(px + 6, py + 6, 2, 2, '#ffd0e0'); F(px + 7, py + 7, 1, 1, '#fff') } }
  }
  // ---- 3. ledges / cliffs (OMORI-style raised ground: grass lip, layered face, stairs)
  for (const L of mp.ledges) {
    const x0 = L.x * T, y0 = L.y * T, W_ = L.w * T, fy = (L.y + L.h) * T, FH = L.fh * T, st = L.st || [];
    if (!L.noshade) F(x0, y0, W_, L.h * T, 'rgba(255,255,255,.05)');
    for (let x = L.x; x < L.x + L.w; x++) { const isSt = st.some(s => x == s || x == s + 1), px = x * T; if (isSt || tv(x, L.y + L.h) != 15) continue;
      F(px, fy, T, FH, P.cf); for (let i = 0; i < L.fh * 3; i++) { F(px, fy + 3 + i * 5, T, 1, P.cd); if (hsh(x, i, 21) < .35) F(px + hsh(x, i, 22) * 12, fy + 4 + i * 5, 3, 2, P.cd); if (hsh(x, i, 23) < .3) F(px + hsh(x, i, 24) * 12, fy + 1 + i * 5, 2, 1, P.cl) }
      F(px, fy + FH - 2, T, 2, P.co); F(px, fy, T, 3, P.cl); F(px, fy - 1, T, 2, P.co); if (natural) { F(px, fy - 3, T, 2, sh(P.a[0], .82)); for (let i = 0; i < 4; i++) F(px + i * 4 + 1, fy + 2, 2, 2 + (hsh(x, i, 25) * 3 | 0), sh(P.a[0], .7)) }
      ell(px + 8, fy + FH + 2, 9, 2, 'rgba(0,0,0,.12)', g) }
    for (const s of st) { const px = s * T; for (let i = 0; i < L.fh * 3; i++) { F(px, fy + i * 5, T * 2, 3, P.cl); F(px, fy + i * 5 + 3, T * 2, 2, P.cd) } F(px - 1, fy, 1, FH, P.co); F(px + T * 2, fy, 1, FH, P.co) }
    if (!L.noside) for (const sx of [L.x - 1, L.x + L.w]) { const px = sx * T; for (let y = L.y; y < L.y + L.h + L.fh; y++) { if (tv(sx, y) != 16) continue; F(px + (sx < L.x ? 8 : 0), y * T, 8, T, P.cf); F(px + (sx < L.x ? 8 : 6), y * T, 2, T, P.co); for (let i = 0; i < 3; i++) F(px + (sx < L.x ? 10 : 1), y * T + i * 5 + 2, 4, 1, P.cd) } }
    for (let x = L.x; x < L.x + L.w; x++) if (tv(x, L.y - 1) == 0) { F(x * T, y0, T, 2, P.co); F(x * T, y0 + 2, T, 1, P.cl) }
  }
  // ---- 4. bridges (planks + rails)
  for (const b of mp.bridges) { const x0 = b.x * T, y0 = b.y * T, W_ = b.w * T, H_ = b.h * T, hz = b.dir != 'v';
    ell(x0 + W_ / 2, y0 + H_ + 2, W_ / 2, 3, 'rgba(0,0,0,.2)', g); F(x0, y0, W_, H_, '#9a6e44');
    if (hz) { for (let x = 0; x < W_; x += 4) { F(x0 + x, y0, 1, H_, '#5a3a22'); F(x0 + x + 1, y0, 1, H_, 'rgba(255,255,255,.1)') } F(x0, y0, W_, 2, '#5a3a22'); F(x0, y0 + H_ - 2, W_, 2, '#5a3a22'); if (!b.norail) { for (let x = 0; x <= W_; x += 16) { F(x0 + x - 1, y0 - 6, 3, 8, '#5a3a22', g2); F(x0 + x - 1, y0 + H_ - 6, 3, 8, '#5a3a22') } F(x0, y0 - 5, W_, 2, '#a8723c', g2); F(x0, y0 + H_ - 5, W_, 2, '#a8723c') } }
    else { for (let y = 0; y < H_; y += 4) { F(x0, y0 + y, W_, 1, '#5a3a22'); F(x0, y0 + y + 1, W_, 1, 'rgba(255,255,255,.1)') } F(x0, y0, 2, H_, '#5a3a22'); F(x0 + W_ - 2, y0, 2, H_, '#5a3a22'); if (!b.norail) { for (let y = 0; y <= H_; y += 16) { F(x0 - 1, y0 + y - 6, 3, 8, '#5a3a22'); F(x0 + W_ - 2, y0 + y - 6, 3, 8, '#5a3a22') } F(x0, y0, 2, H_, '#a8723c'); F(x0 + W_ - 2, y0, 2, H_, '#a8723c') } } }
  // ---- 5. small decor on open ground + soft shadows under walls/trees + undergrowth along the tree line
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { if (t[I(x, y)] != 0) continue; const px = x * T, py = y * T, G = gt[I(x, y)], hv = hsh(x, y, 90), up = tv(x, y - 1);
    if (tallSolid(up) || up == 6) { F(px, py, T, 4, 'rgba(0,0,0,.12)'); F(px, py, T, 2, 'rgba(0,0,0,.08)') } if (tallSolid(tv(x - 1, y))) F(px, py, 2, T, 'rgba(0,0,0,.07)'); if (tallSolid(tv(x + 1, y))) F(px + 14, py, 2, T, 'rgba(0,0,0,.07)');
    if (A0.nodecor || mp.interior) continue;
    const grassy = G == 0 || G == 4 || G == 1 || G == 13;
    if (natural && grassy && up == 12 && hsh(x, y, 91) < .75) decorBit(g, A0.pal == 'beach' ? 'beachgrass' : A0.pal == 'dark' ? 'thornlet' : A0.pal == 'space' ? 'starbud' : hv < .5 ? 'fern' : 'shrublet', px + 2 + hsh(x, y, 92) * 10, py + 3, P, hsh(x, y, 93));
    else if (grassy && hv < (A0.decor ?? .16)) { const kinds = DECOR[A0.pal] || DECOR.forest, k = kinds[(hsh(x, y, 94) * kinds.length) | 0]; decorBit(g, k, px + 3 + hsh(x, y, 95) * 10, py + 4 + hsh(x, y, 96) * 9, P, hsh(x, y, 97)) }
    else if (G == 2 && hv < .04 && natural) decorBit(g, 'pebbles', px + 4 + hsh(x, y, 95) * 8, py + 5 + hsh(x, y, 96) * 6, P, 0);
  }
  if (A0.pal == 'city' && !mp.interior && !A0.dry) {   // wet neon street: reflections, lane dashes
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const px = x * T, py = y * T, G = gt[I(x, y)]; if (t[I(x, y)]) continue;
      if ((G == 5 || G == 2) && hsh(x, y, 31) < .022) { const c = ['255,60,160', '60,224,255', '255,210,60'][(x * 3 + y) % 3]; ell(px + 8, py + 10, 7, 3, 'rgba(' + c + ',.26)', g); ell(px + 8, py + 10, 3, 1, 'rgba(255,255,255,.35)', g) }
      if (G == 2 && x % 3 == 0 && gnb(x, y - 1, 2) && gnb(x, y + 1, 2) && !gnb(x, y - 2, 2)) F(px + 3, py + 7, 9, 1, 'rgba(255,255,255,.22)'); if (G == 5 && (x + y) % 7 == 0) F(px, py, T, 1, 'rgba(255,255,255,.07)') }
  }
  // ---- 6. single-tile things (walls, fences, rocks, bushes ...)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const px = x * T, py = y * T, v = t[I(x, y)]; if (!v || v == 2 || v == 14 || v == 12 || v == 15 || v == 16) continue;
    if (v == 10 && A0.pal == 'city') { F(px, py, T, T, '#020426'); for (let i = 0; i < 3; i++) if (hsh(x, y, 50 + i) < .35) F(px + hsh(x, y, 60 + i) * 14, py + hsh(x, y, 70 + i) * 14, 2, 1, ['#ff5a8a', '#2ee6e6', '#ffe9a0', '#1f5f96'][(hsh(x, y, 80 + i) * 4) | 0]); if (tv(x, y - 1) == 0) { F(px, py, T, 3, '#4a1a6e'); F(px, py + 3, T, 1, '#020426') } continue }
    if (v == 10) { F(px, py, T, T, '#05040c'); if (hsh(x, y, 40) < .12) F(px + hsh(x, y, 41) * 15, py + hsh(x, y, 42) * 15, 1, 1, hsh(x, y, 43) < .5 ? '#8a86c8' : '#fff'); if (tv(x, y - 1) == 0) { F(px, py, T, 2, P.tl || '#4a3a8a'); F(px, py + 2, T, 3, 'rgba(90,70,200,.25)') } if (tv(x, y + 1) == 0) F(px, py + 14, T, 2, 'rgba(120,100,255,.35)'); if (tv(x - 1, y) == 0) F(px, py, 2, T, 'rgba(120,100,255,.35)'); if (tv(x + 1, y) == 0) F(px + 14, py, 2, T, 'rgba(120,100,255,.35)'); continue }
    if (v == 1) treeSmall(g, g2, px, py, P, A0.tree, x, y);
    if (v == 3) wallTile(g, g2, mp, x, y, px, py, P);
    if (v == 5) { F(px, py, T, T, '#2a1a10'); F(px + 2, py + 1, 12, 15, '#3a2010'); F(px + 3, py + 2, 10, 14, '#7a4a28'); F(px + 11, py + 9, 2, 2, '#ffd23c') }
    if (v == 6) { const l = tv(x - 1, y) == 6, rr = tv(x + 1, y) == 6, u = tv(x, y - 1) == 6, fc = P.fence || '#c08850', fd = sh(fc, .55);
      ell(px + 8, py + 15, 7, 2, 'rgba(0,0,0,.16)', g); F(px + 6, py + 2, 4, 13, fd); F(px + 7, py + 3, 2, 11, fc); F(px + 6, py + 1, 4, 2, sh(fc, 1.2));
      if (l || rr) { const a0 = l ? px : px + 6, ww = (l ? 8 : 2) + (rr ? 8 : 2); F(a0, py + 5, ww, 3, fd); F(a0, py + 5, ww, 1, fc); F(a0, py + 10, ww, 3, fd); F(a0, py + 10, ww, 1, fc) }
      if (u) { F(px + 6, py - 3, 4, 5, fd); F(px + 7, py - 3, 2, 5, fc) } }
    if (v == 7) { ell(px + 9, py + 14, 8, 3, 'rgba(0,0,0,.2)', g); ell(px + 8, py + 11, 8, 6, '#4a4a5c', g); ell(px + 8, py + 10, 7, 5, '#9a9aa8', g); ell(px + 6, py + 8, 3, 2, '#c8c8d6', g) }
    if (v == 8) { ell(px + 14, py + 15, 10, 3, 'rgba(0,0,0,.2)', g); F(px + 7, py - 6, 2, 22, '#d8d8e0'); const uc = NC[(x + y) % 4]; for (let i = 0; i < 6; i++) ell(px + 8, py - 8, 14 - i * 2, 7 - i, i & 1 ? '#fff' : uc, g2); F(px + 7, py - 15, 2, 3, '#ddd', g2) }
    if (v == 9) { ell(px + 10, py + 14, 8, 2.5, 'rgba(0,0,0,.16)', g); ell(px + 8, py + 10, 8, 6, P.to, g); ell(px + 8, py + 10, 7, 5, P.td, g); ell(px + 8, py + 9, 6, 4, P.tm, g); ell(px + 6, py + 7, 3, 2, P.tl, g); if (hsh(x, y, 13) < .4) { F(px + 10, py + 9, 2, 2, '#ff8fb0'); F(px + 5, py + 11, 2, 2, '#ffe9a0') } }
  }
  // ---- 7. buildings
  mp.blds.forEach(b => drawBuilding(g, g2, b, P, mp));
  // ---- 8. foliage masses + props, all sorted by their foot line so overlaps read right
  const L = []; mp.spr = [];
  const massStyle = A0.mass || (A0.tree == 'palm' ? 'palm' : A0.tree == 'neon' || A0.pal == 'city' ? 'block' : A0.tree == 'none' ? 'void' : A0.tree == 'dead' ? 'dead' : 'tree');
  if (massStyle == 'block') cityBlocks(g, g2, mp, P);
  else for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (t[I(x, y)] != 12) continue; const px = x * T, py = y * T;
    if (massStyle == 'void') { F(px, py, T, T, '#05040c'); continue }
    const inner = [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([a, b]) => { const v = tv(x + a, y + b); return v == 12 || v == 255 || v == 3 || v == 10 });
    if (inner) F(px, py, T, T, massStyle == 'palm' ? P.td : P.to);
    else if (massStyle == 'palm') { ell(px + 8, py + 8, 12, 11, P.to, g); ell(px + 7, py + 7, 10, 9, P.tm, g) }
    else { const sp = treeSprite(P, 'bush', (x * 7 + y * 3) % 7, 1.2); g.drawImage(sp.c, Math.round(px + 8 - sp.cx), Math.round(py + 9 - sp.cy)) }
    const edgeS = tv(x, y + 1) != 12 && tv(x, y + 1) != 255, edgeN = tv(x, y - 1) != 12 && tv(x, y - 1) != 255, edgeLR = tv(x - 1, y) == 0 || tv(x + 1, y) == 0 || tv(x - 2, y) == 0 || tv(x + 2, y) == 0;
    const openN = k => { for (let d = 1; d <= k; d++) { const v = tv(x, y - d); if (v != 12 && v != 255 && v != 3 && v != 10 && v != 15 && v != 16 && v != 2) return d } return 0 }, dn = openN(4);
    if (dn == 1 || dn == 2) { if (massStyle != 'palm' || dn == 1) L.push({ y: py + 14, f: () => bushMass(g, px + 8 + (hsh(x, y, 7) - .5) * 4, py + 15, P, x * 31 + y, massStyle) }); continue }
    const put = edgeS ? (x + y) % 2 == 0 || hsh(x, y, 14) < .55 : edgeLR ? (x + y) % 2 == 0 : (x % 2 == 0 && y % 2 == 0) || hsh(x, y, 14) < .12;
    if (put) { const s = dn ? .72 + hsh(x, y, 6) * .15 : edgeLR ? .85 + hsh(x, y, 6) * .2 : (edgeN && !edgeS ? .8 : 1) + hsh(x, y, 6) * (edgeS ? .45 : .6), jx = (hsh(x, y, 7) - .5) * 10, by = py + 14;
      const roof = massStyle == 'palm' && [1, 2, 3, 4].some(k => [-1, 0, 1].some(d => tv(x + d, y + k) == 3)), sparse = !edgeS && !((y % 3 == 0) && ((x + (y / 3 | 0)) % 3 == 0)), nearBld = massStyle == 'palm' && (roof || sparse);   // palms: every front-edge spot, plus a staggered third of the grove behind it; never right over a roof
      L.push({ y: by, f: () => nearBld ? bushMass(g, px + 8 + jx * .3, py + 15, P, x * 31 + y, 'palm') : massStyle == 'palm' ? giantPalm(g, g2, px + 8 + jx, by, s * .9, P, x * 31 + y) : massStyle == 'dead' && hsh(x, y, 17) < .3 ? deadTree(g, g2, px + 8 + jx, by, s, P, x * 31 + y) : giantTree(g, g2, px + 8 + jx, by, s, P, x * 31 + y) }) }
  }
  mp.bigtrees.forEach(b => L.push({ y: b.y * T + 24, f: () => giantTree(g, g2, b.x * T + 8, b.y * T + 24, b.s || 2.2, P, 7, 'oak') }));
  for (const p of mp.props) { const d = PROPS[p.id], wd = d.w || 1, cx = p.x * T + wd * 8 + (p.dx || 0), by = p.y * T + 15 + (p.dy || 0), sd = hsh(p.x, p.y, 77);
    L.push({ y: by + (d.z || 0), f: () => { if (d.raw) { d.d(g, cx, by, P, sd, p, g2); return } if (d.top) { d.d(g2, cx, by, P, sd, p); return }
      if (d.flat) { if (!OUTLINE_FLAT(p.id)) { d.d(g, cx, by, P, sd, p); return } const sp = propSprite(d, cx, by, P, sd, p); if (sp) g.drawImage(sp.c, sp.x, sp.y); return }
      const sp = propSprite(d, cx, by, P, sd, p); if (sp) { sp.sy = by + (d.sy || 0); mp.spr.push(sp) } } }) }
  L.sort((a, b) => a.y - b.y).forEach(o => o.f());
}
// ---------------------------------------------------------------- prop sprites: every standing prop is cut out into its own sprite (cropped, lit from the
// top-left, given a dark 1px outline) and depth-sorted with the characters at draw time, so nothing gets painted over your head when you stand in front of it.
const OUTLINE_FLAT = id => id.startsWith('f_') && !/^f_(fz|wz|rugp|rugs|bathmat|mat|rrug|lights)$/.test(id);
let PS_C = null;
function propSprite(d, cx, by, P, sd, p) {
  const W0 = (d.w || 1) * 16 + 128, H0 = 200, ox = Math.round(cx - W0 / 2), oy = Math.round(by - 168);
  if (!PS_C) PS_C = document.createElement('canvas'); PS_C.width = W0; PS_C.height = H0; const cg = PS_C.getContext('2d', { willReadFrequently: true }); cg.setTransform(1, 0, 0, 1, -ox, -oy); d.d(cg, cx, by, P, sd, p); cg.setTransform(1, 0, 0, 1, 0, 0);
  let id; try { id = cg.getImageData(0, 0, W0, H0) } catch (err) {   // opened from a file: drawing an image taints the canvas, so skip the outline pass for this prop
    PS_C = null; const c = document.createElement('canvas'); c.width = W0; c.height = H0; c.getContext('2d').drawImage(cg.canvas, 0, 0); return { c, x: ox, y: oy } }
  const a = id.data; let x0 = W0, y0 = H0, x1 = -1, y1 = -1;
  for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) if (a[(y * W0 + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  if (x1 < 0) return null; x0 = Math.max(0, x0 - 1); y0 = Math.max(0, y0 - 1); x1 = Math.min(W0 - 1, x1 + 1); y1 = Math.min(H0 - 1, y1 + 1);
  const w = x1 - x0 + 1, h = y1 - y0 + 1, sol = new Uint8Array(w * h), A = (x, y) => a[((y + y0) * W0 + x + x0) * 4 + 3];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) sol[y * w + x] = A(x, y) >= 200 ? 1 : 0;
  const S_ = (x, y) => x >= 0 && y >= 0 && x < w && y < h && sol[y * w + x];
  if (!d.noShade) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!sol[y * w + x]) continue; const o = ((y + y0) * W0 + x + x0) * 4;
    if (!S_(x, y - 1) || !S_(x - 1, y)) { for (let k = 0; k < 3; k++) a[o + k] = Math.min(255, a[o + k] + (255 - a[o + k]) * .16 + 6) }
    else if (!S_(x, y + 1) || !S_(x + 1, y)) { for (let k = 0; k < 3; k++) a[o + k] = a[o + k] * .78 } }
  if (!d.noOutline) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (sol[y * w + x]) continue; if (S_(x - 1, y) || S_(x + 1, y) || S_(x, y - 1) || S_(x, y + 1)) { const o = ((y + y0) * W0 + x + x0) * 4; a[o] = 26; a[o + 1] = 16; a[o + 2] = 24; a[o + 3] = 255 } }
  cg.putImageData(id, 0, 0); const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(PS_C, x0, y0, w, h, 0, 0, w, h);
  return { c, x: ox + x0, y: oy + y0 };
}
function drawPropSprites(mp, cx, cy, ox = 0, oy = 0, into) {   // into: a draw list to depth-sort with characters; without it, draws them all in order
  for (const s of mp.spr || []) { if (s.x - cx > VW || s.x + s.c.width - cx < 0 || s.y - cy > VH || s.y + s.c.height - cy < 0) continue; const f = () => X.drawImage(s.c, Math.round(s.x - cx + ox), Math.round(s.y - cy + oy)); if (into) into.push({ y: s.sy, f }); else f() }
}
// ---------------------------------------------------------------- trees
// ---------------------------------------------------------------- trees: pixel-generated sprites (lumpy leaf clusters, lit from the top-left, outlined), cached per palette
const TREECACHE = {};
const hexRGB = h => { h = h.replace('#', ''); if (h.length == 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255] };
const mixRGB = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function treeSprite(P, kind, v, s) {
  const key = [P.to, P.td, P.tm, P.tl, kind, v, Math.round(s * 8), P.fruit || '', P.glow || ''].join('|'); if (TREECACHE[key]) return TREECACHE[key];
  const R_ = rng(v * 977 + Math.round(s * 8) * 131 + kind.length * 7 + 3); R_(); R_();
  const rr = (kind == 'bush' ? 10 : 24) * s, W_ = Math.ceil(rr * (kind == 'pine' ? 1.9 : 2.8)) + 6, H_ = Math.ceil(rr * (kind == 'pine' ? 2.9 : 2.4)) + 6, cx = W_ / 2, cy = kind == 'pine' ? H_ - 4 : H_ * .55;
  const c = document.createElement('canvas'); c.width = W_; c.height = H_; const g = c.getContext('2d'), id = g.createImageData(W_, H_), d = id.data;
  const TO = hexRGB(P.to), TD = hexRGB(P.td), TM = hexRGB(P.tm), TL = hexRGB(P.tl), OL = mixRGB(TO, [0, 0, 0], .35), HI = mixRGB(TL, [255, 255, 255], .25), tones = [TO, TD, TM, TL, HI];
  const mask = new Int8Array(W_ * H_).fill(-1);   // tone index per pixel, -1 = empty
  if (kind == 'pine') {   // stacked drooping tiers, light on the left
    const tiers = 4, top = 4, bot = H_ - 4 - rr * .35, th = (bot - top) / tiers;
    for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) {
      let tone = -1;
      for (let t = 0; t < tiers; t++) { const ty0 = top + t * th * .78, ty1 = ty0 + th * 1.35, hw = rr * (.32 + t * .2); if (y < ty0 || y > ty1 + 3) continue; const k = (y - ty0) / (ty1 - ty0), half = hw * Math.pow(Math.min(1, k), .85), dx = x - cx;
        const sag = Math.abs(dx) / (hw + .01), edgeY = ty1 - (1 - sag * sag) * 3 + ((Math.floor(x / 3) + t) % 2) * 2;   // scalloped bottom edge
        if (Math.abs(dx) <= half + (hsh(x >> 1, y, v) - .5) * 2 && y <= edgeY) { const side = -dx / (hw + 1), low = (y - ty0) / (ty1 - ty0); let val = .55 + side * .35 - low * .35 + (t == 0 ? .1 : 0); tone = val > .78 ? 3 : val > .5 ? 2 : val > .25 ? 1 : 0; if (y > edgeY - 2) tone = Math.max(0, tone - 1) } }
      if (tone >= 0) mask[y * W_ + x] = tone }
  } else {   // deciduous / bush: a crown of overlapping lumps
    const L = [{ x: 0, y: 0, r: rr * .6 }], n = kind == 'bush' ? 4 + (R_() * 2 | 0) : 7 + (R_() * 4 | 0);
    for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (R_() - .5) * .6, dist = rr * (.4 + R_() * .22); L.push({ x: Math.cos(a) * dist * 1.08, y: Math.sin(a) * dist * .78 - rr * .04, r: rr * (.34 + R_() * .2) }) }
    if (kind != 'bush') { L.push({ x: (R_() - .5) * rr * .5, y: -rr * .6, r: rr * .4 }); L.push({ x: (R_() - .5) * rr * .8, y: -rr * .35, r: rr * .38 }) }
    for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) {
      const px = x - cx, py = y - cy, jag = hsh(x >> 1, y >> 1, v + 17) * .22; let front = null, fq = 0, inside = 0;
      for (const l of L) { const nx = (px - l.x) / l.r, ny = (py - l.y) / (l.r * .86), q = nx * nx + ny * ny; if (q < 1 - jag) { inside++; if (!front || l.y > front.y) { front = l; fq = q } } }
      if (!front) continue;
      const nx = (px - front.x) / front.r, ny = (py - front.y) / (front.r * .86), lit = -nx * .55 - ny * .85;
      let val = .5 + lit * .32 - fq * .18 - py / rr * .16;
      if (inside > 1 && fq > .62) val -= .32;   // dark contour where one clump sits in front of another
      if (fq < .25 && lit > .2) val += .12;
      let tone = val > .82 ? 4 : val > .62 ? 3 : val > .38 ? 2 : val > .16 ? 1 : 0;
      if ((tone == 2 || tone == 3) && hsh(x, y, v + 5) < .1) tone--;   // leaf texture
      if (tone == 2 && ((x + (y >> 1) * 3) % 6 == 0) && (y % 3 == 0)) tone = 3;
      mask[y * W_ + x] = tone }
  }
  for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) { const t = mask[y * W_ + x], o = (y * W_ + x) * 4; if (t < 0) continue;
    const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const X_ = x + a, Y_ = y + b; return X_ < 0 || Y_ < 0 || X_ >= W_ || Y_ >= H_ || mask[Y_ * W_ + X_] < 0 });
    const col = edge ? OL : tones[t]; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255 }
  g.putImageData(id, 0, 0);
  if (P.fruit && kind != 'pine' && R_() < .35) { g.fillStyle = P.fruit; for (let i = 0; i < 6; i++) { const fx = cx + (R_() - .5) * rr * 1.4, fy = cy + (R_() - .4) * rr; if (mask[(fy | 0) * W_ + (fx | 0)] >= 1) g.fillRect(fx | 0, fy | 0, 2, 2) } }
  if (P.glow && R_() < .4) { g.fillStyle = P.glow; for (let i = 0; i < 3; i++) { const fx = cx + (R_() - .5) * rr, fy = cy + (R_() - .3) * rr * .8; if (mask[(fy | 0) * W_ + (fx | 0)] >= 1) g.fillRect(fx | 0, fy | 0, 1, 1) } }
  return TREECACHE[key] = { c, cx, cy, W: W_, H: H_ };
}
function trunk(g, cx, base, s, P, seed, h0) {   // tapered trunk with root flare, bark and a fork that disappears into the leaves
  const TR = hexRGB(P.tr), dk = 'rgb(' + mixRGB(TR, [0, 0, 0], .38) + ')', lt = 'rgb(' + mixRGB(TR, [255, 255, 255], .18) + ')', ol = 'rgb(' + mixRGB(TR, [0, 0, 0], .6) + ')', th = Math.round(h0 * s), F = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))) };
  ell(cx + 6 * s, base, 16 * s, 4 * s, 'rgba(0,0,0,.22)', g);
  for (let i = 0; i < th; i++) { const k = i / th, flare = i < 4 * s ? (4 * s - i) * .9 : 0, w = 6.5 * s * (1 - k * .3) + flare, x0 = cx - w / 2, y = base - i;
    F(x0 - 1, y, w + 2, 1, ol); F(x0, y, w, 1, P.tr); F(x0 + w * .62, y, w * .38, 1, dk); F(x0, y, 1, 1, lt);
    if (hsh(seed, i, 3) < .3) F(x0 + 1 + hsh(seed, i, 4) * (w - 3), y, 1, 2, dk) }
  F(cx - 7 * s, base - 1, 3 * s, 2, P.tr); F(cx + 4 * s, base - 1, 3 * s, 2, dk);   // roots
  for (const sx of [-1, 1]) for (let i = 0; i < 7 * s; i++) F(cx + sx * (1 + i * .8) - 1, base - th - i, 2.5 * s, 1, sx < 0 ? P.tr : dk);   // fork
}
function oakTrunk(g, cx, base, s, P, seed) {   // the great hollow tree: a wide trunk with the hollow grown into it
  const TR = hexRGB(P.tr), c0 = P.tr, dk = 'rgb(' + mixRGB(TR, [0, 0, 0], .38) + ')', dk2 = 'rgb(' + mixRGB(TR, [0, 0, 0], .62) + ')', lt = 'rgb(' + mixRGB(TR, [255, 255, 255], .2) + ')', F = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))) }, th = 24 * s, hw = 9 * s;
  ell(cx + 10, base + 2, 30 * s, 6 * s, 'rgba(0,0,0,.25)', g);
  for (let i = 0; i < th; i++) { const k = i / th, flare = i < 9 * s ? Math.pow((9 * s - i) / (9 * s), 2) * 8 * s : 0, w = hw * 2 * (1 - k * .25) + flare * 2, x0 = cx - w / 2, y = base - i;
    F(x0 - 1, y, w + 2, 1, dk2); F(x0, y, w, 1, c0); F(x0 + w * .66, y, w * .34, 1, dk); F(x0 + 1, y, 2, 1, lt); for (let b = 0; b < 4; b++) if (hsh(seed + b, i >> 1, 5) < .35) F(x0 + 3 + b * (w - 6) / 4 + hsh(b, i, 6) * 3, y, 1, 2, dk) }
  for (const [rx, rl] of [[-1, 1], [1, 1], [-.5, .6], [.6, .7]]) for (let i = 0; i < 9 * s * rl; i++) F(cx + rx * (hw + i * .9) - 2, base - 1 - i * .25, 4, 2, rx < 0 ? c0 : dk);
  // the hollow: a dark arch with a thick lip of bark around it
  const hx = cx, hy = base - 3 * s, hr = 5.5 * s, hh = 9 * s;
  ell(hx, hy - hh * .55, hr + 3, hh * .62 + 3, dk2, g); F(hx - hr - 3, hy - hh * .55, (hr + 3) * 2, hh * .55 + 1, dk2);
  ell(hx, hy - hh * .55, hr + 1.5, hh * .62 + 1.5, lt, g); F(hx - hr - 1.5, hy - hh * .55, (hr + 1.5) * 2, hh * .55, lt);
  ell(hx, hy - hh * .55, hr, hh * .62, '#120a06', g); F(hx - hr, hy - hh * .55, hr * 2, hh * .55, '#120a06'); ell(hx + 1, hy - hh * .5, hr - 2, hh * .5, '#060302', g);
  F(hx - hr + 1, hy - 2, hr * 2 - 2, 2, dk); F(hx - hr - 2, hy, hr * 2 + 4, 2, dk2);
  F(hx - hr - 2, hy - hh * .9, 4, 2, '#5ab86a'); F(hx + hr - 1, hy - hh * .3, 3, 2, '#5ab86a'); F(hx - hr - 4, hy - 1, 5, 2, '#5ab86a');
}
function giantTree(g, g2, cx, base, s, P, seed, kind) {
  const pine = kind != 'oak' && P.pines && hsh(seed, 3, 9) < P.pines, k = pine ? 'pine' : 'tree', sp = treeSprite(P, k, seed % 9, s);
  if (kind == 'oak') oakTrunk(g, cx, base, s, P, seed); else trunk(g, cx, base, s, P, seed, pine ? 12 : 21);
  const top = pine ? base - 8 * s - sp.H + 6 : base - 28 * s - sp.cy;
  g2.drawImage(sp.c, Math.round(cx - sp.cx), Math.round(top));
}
function bushMass(g, cx, by, P, seed, style) {   // low dense bushes where a tree would hide the path in front of it
  if (style == 'palm') { for (let i = 0; i < 5; i++) { const a = -2.8 + i * .55; for (let k = 0; k < 10; k++) { g.fillStyle = k > 6 ? P.tl : P.tm; g.fillRect(Math.round(cx + Math.cos(a) * k), Math.round(by - 3 + Math.sin(a) * k * .9), 2, 2) } } return }
  if (style == 'dead') { for (let i = 0; i < 7; i++) { const a = -2.9 + i * .4; for (let k = 0; k < 13; k++) { g.fillStyle = k > 10 ? '#4a3c62' : '#221a34'; g.fillRect(Math.round(cx + Math.cos(a) * k), Math.round(by - 2 + Math.sin(a) * k), 2, 2) } } }
  const sp = treeSprite(P, 'bush', seed % 7, 1.05 + (seed % 3) * .1); ell(cx + 2, by - 1, sp.W / 2 - 2, 3, 'rgba(0,0,0,.18)', g); g.drawImage(sp.c, Math.round(cx - sp.cx), Math.round(by - sp.H + 3));
}
// ---------------------------------------------------------------- palms: ringed curved trunk + feathery outlined fronds with coconuts (cached sprites)
const PALMCACHE = {};
function palmSprite(P, v, s) {
  const key = [P.tm, P.tl, P.to, P.tr, v, Math.round(s * 8)].join('|'); if (PALMCACHE[key]) return PALMCACHE[key];
  const R_ = rng(v * 313 + Math.round(s * 8) * 17 + 5); R_();
  const W_ = Math.ceil(78 * s) + 8, H_ = Math.ceil(46 * s) + 8, cx = W_ / 2, cy = H_ * .42, c = document.createElement('canvas'); c.width = W_; c.height = H_; const g = c.getContext('2d');
  const TM = P.tm, TL = P.tl, TD = P.td, n = 8 + (R_() * 2 | 0);
  const fronds = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (R_() - .5) * .4; fronds.push({ a, len: (24 + R_() * 10) * s, droop: (.6 + R_() * .5) }) }
  fronds.sort((p, q) => Math.sin(p.a) - Math.sin(q.a));   // back fronds first
  for (const f of fronds) { const back = Math.sin(f.a) < -.2, steps = Math.round(f.len);
    for (let k = 0; k <= steps; k++) { const t = k / steps, ang = f.a, x = cx + Math.cos(ang) * k * 1.15, y = cy + Math.sin(ang) * k * .55 + t * t * f.len * .55 * f.droop;
      const leaf = (1 - Math.abs(t - .45) * 1.3) * 7 * s; if (k % 2 == 0 && t > .08) for (const sd of [-1, 1]) { const la = ang + sd * 1.25 + .5 * t; for (let j = 1; j < leaf; j++) { g.fillStyle = back ? TD : j > leaf * .55 ? TL : TM; g.fillRect(Math.round(x + Math.cos(la) * j * .9), Math.round(y + Math.sin(la) * j * .6 + j * .35), 1, 2) } }
      g.fillStyle = back ? TD : '#c8a84a'; g.fillRect(Math.round(x), Math.round(y), 2, 1) } }
  for (let i = 0; i < 2; i++) { ell(cx - 2 + i * 4, cy + 4, 2.2 * s, 2.2 * s, '#6a4220', g); ell(cx - 3 + i * 4, cy + 3, .9 * s, .9 * s, '#a8723c', g) }
  // dark outline around everything
  const id = g.getImageData(0, 0, W_, H_), d = id.data, a = new Uint8Array(W_ * H_); for (let i = 0; i < W_ * H_; i++) a[i] = d[i * 4 + 3] > 0 ? 1 : 0;
  const OL = hexRGB(P.to); for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) { if (a[y * W_ + x]) continue; if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([p, q]) => { const X_ = x + p, Y_ = y + q; return X_ >= 0 && Y_ >= 0 && X_ < W_ && Y_ < H_ && a[Y_ * W_ + X_] })) { const o = (y * W_ + x) * 4; d[o] = OL[0]; d[o + 1] = OL[1]; d[o + 2] = OL[2]; d[o + 3] = 255 } }
  g.putImageData(id, 0, 0); return PALMCACHE[key] = { c, cx, cy };
}
function giantPalm(g, g2, cx, base, s, P, seed) {
  const lean = (hsh(seed, 1, 2) - .5) * 16 * s, hgt = 40 * s, TR = hexRGB(P.tr), dk = 'rgb(' + mixRGB(TR, [0, 0, 0], .35) + ')', lt = 'rgb(' + mixRGB(TR, [255, 255, 255], .25) + ')', ol = 'rgb(' + mixRGB(TR, [0, 0, 0], .6) + ')';
  ell(cx + 12 * s, base, 15 * s, 3.5 * s, 'rgba(0,0,0,.18)', g);
  { const sd = P.sand || (P.a && P.a[0]) || '#e8d4a0', sk = sh(sd, .82); ell(cx, base + 1, 9 * s, 3.2 * s, sk, g); ell(cx, base, 7.5 * s, 2.4 * s, sd, g); g.fillStyle = sh(sd, 1.08); g.fillRect(Math.round(cx - 5 * s), Math.round(base - 1), Math.round(3 * s), 1);   // a little mound of sand, and roots gripping it
    g.fillStyle = 'rgb(' + mixRGB(hexRGB(P.tr), [0, 0, 0], .35) + ')'; for (const d of [-1, 1]) { g.fillRect(Math.round(cx + d * 3 * s - 1), Math.round(base - 1), Math.round(3 * s), 2); g.fillRect(Math.round(cx + d * 5 * s - 1), Math.round(base), 2, 1) } }
  for (let i = 0; i < hgt; i++) { const k = i / hgt, x = cx + lean * k * k, w = 6 * s * (1 - k * .25), G = i > 14 ? g2 : g, ring = (i % Math.max(3, Math.round(4 * s))) == 0;
    G.fillStyle = ol; G.fillRect(Math.round(x - w / 2 - 1), Math.round(base - i), Math.round(w + 2), 1); G.fillStyle = ring ? dk : P.tr; G.fillRect(Math.round(x - w / 2), Math.round(base - i), Math.round(w), 1);
    if (!ring) { G.fillStyle = lt; G.fillRect(Math.round(x - w / 2), Math.round(base - i), 1, 1); G.fillStyle = dk; G.fillRect(Math.round(x + w / 2 - 2), Math.round(base - i), 2, 1) } }
  const sp = palmSprite(P, seed % 6, s); g2.drawImage(sp.c, Math.round(cx + lean - sp.cx), Math.round(base - hgt - sp.cy));
}
function deadTree(g, g2, cx, base, s, P, seed) {
  ell(cx + 8, base, 14 * s, 3.5 * s, 'rgba(0,0,0,.25)', g); const c = sh(P.tr, 1.5), cd = P.to;
  const br = (G, x, y, a, len, wd, d) => { for (let i = 0; i < len; i++) { const px = x + Math.cos(a) * i, py = y + Math.sin(a) * i; G.fillStyle = cd; G.fillRect(Math.round(px - 1), Math.round(py), wd + 1, 2); G.fillStyle = c; G.fillRect(Math.round(px), Math.round(py), wd, 1) } if (d > 0) { const ex2 = x + Math.cos(a) * len, ey = y + Math.sin(a) * len; br(G, ex2, ey, a - .5 - hsh(seed, d, 5) * .3, len * .62, Math.max(1, wd - 1), d - 1); br(G, ex2, ey, a + .45 + hsh(seed, d, 6) * .3, len * .6, Math.max(1, wd - 1), d - 1) } };
  g.fillStyle = cd; g.fillRect(Math.round(cx - 4), Math.round(base - 26 * s), 8, Math.round(26 * s)); g.fillStyle = c; g.fillRect(Math.round(cx - 3), Math.round(base - 26 * s), 4, Math.round(26 * s));
  br(g2, cx, base - 24 * s, -1.57, 14 * s, 3, 3);
}
function treeSmall(g, g2, px, py, P, k, x, y) { if (k == 'palm') { giantPalm(g, g2, px + 8, py + 14, .7, P, x * 13 + y); return } giantTree(g, g2, px + 8, py + 14, .6, P, x * 13 + y) }
// ---------------------------------------------------------------- walls (interiors) and city blocks
function wallTile(g, g2, mp, x, y, px, py, P) {
  const A0 = mp.A, w = mp.w, h = mp.h, tv = (a, b) => a >= 0 && b >= 0 && a < w && b < h ? mp.t[b * w + a] : 3, F = (a, b, c, d, col, G = g) => { G.fillStyle = col; G.fillRect(a, b, c, d) };
  if (mp.interior && A0.wall == 'cbrick') return castleWall(g, mp, x, y, px, py);
  if (mp.interior) {
    const below = tv(x, y + 1), upper = (y < 2 || tv(x, y - 1) == 3 || tv(x, y - 1) == 5) && below == 3 && tv(x, y + 2) != 3 && tv(x, y + 2) != 5 && y + 2 < h, face = (below != 3 && below != 5 && y < h - 2) || upper, top = P.wtop || '#140c08';
    if (!face) { F(px, py, T, T, top); if (tv(x - 1, y) != 3 && tv(x - 1, y) != 5) F(px, py, 2, T, sh(P.wall || '#8a6038', .7)); if (tv(x + 1, y) != 3 && tv(x + 1, y) != 5) F(px + 14, py, 2, T, sh(P.wall || '#8a6038', .7)); if (tv(x, y - 1) != 3 && y > 0) F(px, py, T, 2, sh(P.wall || '#8a6038', .7)); return }
    const wall = P.wall || '#8a6038'; F(px, py, T, T, wall);
    if (A0.wall == 'plank') { for (let i = 0; i < 4; i++) F(px, py + i * 4, T, 1, 'rgba(0,0,0,.16)'); F(px + ((x * 5) % 13), py, 1, T, 'rgba(0,0,0,.12)') }
    if (A0.wall == 'paper') { F(px + 7, py, 2, T, 'rgba(255,255,255,.1)'); F(px, py + 4, T, 1, 'rgba(0,0,0,.06)') }
    if (A0.wall == 'stone') { F(px, py + 7, T, 1, 'rgba(0,0,0,.25)'); F(px + (y & 1 ? 4 : 11), py, 1, 7, 'rgba(0,0,0,.25)'); F(px + (y & 1 ? 11 : 4), py + 8, 1, 8, 'rgba(0,0,0,.25)') }
    const W2 = P.wall2 || sh(wall, .8);
    if (A0.wall == 'stripe') { for (let i = 0; i < 16; i += 8) F(px + i, py, 4, T, W2); if (y % 2 == 0) for (let i = 2; i < 16; i += 8) F(px + i + 4, py + 6, 1, 1, sh(wall, 1.2)) }
    if (A0.wall == 'log') { F(px, py, T, T, wall); for (let i = 0; i < 4; i++) { F(px, py + i * 4, T, 1, sh(wall, 1.25)); F(px, py + i * 4 + 3, T, 1, sh(wall, .6)); if ((x + i) % 5 == 0) F(px + 6, py + i * 4 + 1, 2, 2, sh(wall, .7)) } }
    if (A0.wall == 'bamboo') { for (let i = 0; i < 16; i += 4) { F(px + i, py, 3, T, i % 8 ? wall : W2); F(px + i, py, 1, T, sh(wall, 1.2)); F(px + i + 3, py, 1, T, sh(wall, .55)); F(px + i, py + ((x * 4 + i) % 11), 3, 1, sh(wall, .6)) } }
    if (A0.wall == 'wainscot') { if (upper) { for (let i = 0; i < 16; i += 4) if ((i + y) % 8 == 0) F(px + i + 1, py + 5, 2, 2, sh(wall, .9)); F(px + 7, py + 11, 2, 2, sh(wall, .9)) } else { F(px, py, T, 5, wall); F(px, py + 5, T, 2, sh(W2, 1.3)); F(px, py + 7, T, 9, W2); F(px + 1, py + 8, 6, 6, sh(W2, .85)); F(px + 9, py + 8, 6, 6, sh(W2, .85)); F(px + 1, py + 8, 6, 1, sh(W2, 1.15)); F(px + 9, py + 8, 6, 1, sh(W2, 1.15)) } }
    if (A0.wall == 'brick') { F(px, py, T, T, '#13235a'); for (let i = 0; i < 4; i++) { F(px, py + i * 4 + 3, T, 1, '#0b1640'); F(px + ((i + y * 4) % 2 ? 3 : 11), py + i * 4, 1, 3, '#0b1640') } if (hsh(x, y, 9) < .3) F(px + 4, py + 5, 5, 2, '#1a2e6e') }
    if (A0.wall == 'curtain') { F(px, py, T, T, '#3a0a2a'); for (let i = 0; i < 16; i += 4) { F(px + i, py, 2, T, '#7a1030'); F(px + i + 2, py, 2, T, '#a8203c') } F(px, py, T, 2, '#e8c060'); if (y == 0 || tv(x, y - 1) != 3) F(px, py + 2, T, 1, '#8a6a20') }
    if (A0.wall == 'neon') { F(px, py + 9, T, 1, NC[x % 4]); F(px, py + 11, T, 1, NC[(x + 1) % 4]) }
    if (upper) { F(px, py, T, 2, sh(wall, .5)); F(px, py + 2, T, 1, sh(wall, 1.2)); return }
    F(px, py + 12, T, 4, sh(wall, .62)); F(px, py + 12, T, 1, sh(wall, 1.2)); F(px, py + 15, T, 1, 'rgba(0,0,0,.4)');
    return;
  }
  if (A0.pal == 'city') { F(px, py, T, T, '#12122a'); F(px, py + 14, T, 2, NC[x % 4]); F(px + 2, py + 3, 3, 3, '#1c1c3c'); return }
  F(px, py, T, T, P.cf); F(px, py + 7, T, 1, P.cd); F(px + (y & 1 ? 8 : 2), py, 1, 7, P.cd); F(px + (y & 1 ? 3 : 11), py + 8, 1, 8, P.cd); if (tv(x, y + 1) == 0) F(px, py + 13, T, 3, P.co);
}
function cityBlocks(g, g2, mp, P) {   // foliage masses in the city are rooftops; faces toward the street get windows and signs
  const { w, h, t } = mp, tv = (a, b) => a >= 0 && b >= 0 && a < w && b < h ? t[b * w + a] : 12, F = (a, b, c, d, col, G = g) => { G.fillStyle = col; G.fillRect(Math.round(a), Math.round(b), c, d) };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (t[y * w + x] != 12) continue; const px = x * T, py = y * T, face = tv(x, y + 1) != 12 && tv(x, y + 1) != 3;
    if (!face) { F(px, py, T, T, (x >> 2) % 2 ? '#14142a' : '#181830'); F(px, py, T, 1, 'rgba(255,255,255,.04)'); if (hsh(x, y, 3) < .05) { F(px + 3, py + 3, 9, 7, '#2a2a40'); F(px + 4, py + 4, 7, 1, '#3a3a58') } if (hsh(x, y, 4) < .04) F(px + 6, py + 6, 4, 4, NC[(x + y) % 4]); continue }
    F(px, py, T, T, '#1c1c34'); F(px, py + 14, T, 2, '#0a0a14'); const lit = hsh(x, y, 5) > .4; F(px + 3, py + 3, 10, 7, lit ? NC[(x * 3 + y) % 4] : '#0e0e1a'); if (lit) { F(px + 3, py + 3, 10, 1, 'rgba(255,255,255,.5)'); ell(px + 8, py + 20, 9, 4, 'rgba(255,80,190,.10)', g) } F(px + 7, py + 3, 1, 7, '#1c1c34');
    if (hsh(x, y, 6) < .16) { const c = NC[(x + 2 * y) % 4]; F(px, py - 6, T, 4, '#0e0e1a', g2); F(px + 1, py - 5, 14, 2, c, g2); ell(px + 8, py - 4, 14, 6, 'rgba(255,60,160,.12)', g2) } }
}
// ---------------------------------------------------------------- small ground decor (never blocks movement)
const _D = 0, DECOR = { forest: ['flower', 'flower', 'pebbles', 'clover', 'mushroom', 'flower2', 'leaf', 'tuft', 'tuft', 'tuft'], hub: ['flower', 'flower2', 'clover'], dark: ['glowshroom', 'pebbles', 'deadgrass', 'glowshroom', 'deadgrass'], beach: ['shell', 'pebbles', 'starfish', 'shell', 'beachgrass', 'footprints'], city: ['crack', 'crack', 'puddle'], space: ['starbud', 'crystal', 'starbud', 'sparkle'], castle: ['crack'], casino: ['chip'] };
function decorBit(g, k, x, y, P, s) {
  const F = (a, b, c, d, col) => { g.fillStyle = col; g.fillRect(Math.round(a), Math.round(b), c, d) };
  if (k == 'flower') { const c = P.fl[(s * 4) | 0] || '#fff'; F(x, y + 2, 1, 3, P.tuft2); F(x - 1, y, 3, 1, c); F(x, y - 1, 1, 3, c); F(x, y, 1, 1, '#ffe27a'); F(x + 4, y + 3, 1, 2, P.tuft2); F(x + 3, y + 2, 3, 1, c); F(x + 4, y + 1, 1, 3, c) }
  if (k == 'flower2') { for (let i = 0; i < 3; i++) { const c = P.fl[(i + (s * 4 | 0)) % 4] || '#fff'; F(x + i * 3, y + 2 + (i & 1), 1, 3, P.tuft2); F(x + i * 3 - 1, y + 1 + (i & 1), 2, 2, c) } }
  if (k == 'pebbles') { F(x, y, 3, 2, '#8a8a96'); F(x, y, 2, 1, '#c8c8d0'); F(x + 4, y + 2, 2, 2, '#7a7a86'); F(x + 2, y + 4, 2, 1, '#9a9aa6') }
  if (k == 'tuft') { for (let i = 0; i < 5; i++) { const hh = 3 + (i == 2 ? 3 : i % 2 ? 1 : 2); F(x + i * 1.5, y + 6 - hh, 1, hh, i % 2 ? P.tuft2 : P.tuft) } }
  if (k == 'clover') { F(x, y, 2, 2, P.tuft2); F(x + 2, y + 1, 2, 2, P.tuft2); F(x + 1, y + 2, 2, 2, P.tuft2); F(x + 1, y + 1, 1, 1, P.tuft) }
  if (k == 'mushroom') { F(x + 1, y + 2, 1, 3, '#f4ecd8'); F(x - 1, y, 5, 2, '#d8443a'); F(x, y - 1, 3, 1, '#d8443a'); F(x, y, 1, 1, '#fff'); F(x + 2, y + 1, 1, 1, '#fff') }
  if (k == 'leaf') { F(x, y, 3, 2, '#d89a3a'); F(x + 1, y + 1, 1, 1, '#a86a2a'); F(x + 5, y + 3, 2, 2, '#c8803a') }
  if (k == 'fern') { for (let i = 0; i < 5; i++) { const hh = 5 + (i == 2 ? 3 : i % 2 ? 2 : 0); F(x + i * 2, y + 8 - hh, 1, hh, i % 2 ? P.tm : P.td); F(x + i * 2 - 1, y + 3 + (i % 2), 1, 1, P.tl) } }
  if (k == 'shrublet') { ell(x + 4, y + 6, 6, 3.5, P.to, g); ell(x + 4, y + 5, 5, 3, P.td, g); ell(x + 3, y + 4, 3, 2, P.tm, g); if (s < .4) { F(x + 5, y + 4, 1, 1, '#ff8fb0'); F(x + 1, y + 6, 1, 1, '#fff') } }
  if (k == 'thornlet') { for (let i = 0; i < 5; i++) { F(x + i * 2, y + 2 + (i % 2) * 2, 1, 6 - (i % 2) * 2, '#2a1c3a'); F(x + i * 2 - 1, y + 3 + i % 3, 1, 1, '#4a3c62') } if (s < .3) F(x + 4, y + 1, 1, 1, '#9ff') }
  if (k == 'glowshroom') { F(x + 1, y + 2, 1, 3, '#c8c0e8'); F(x - 1, y, 4, 2, '#5af0e0'); F(x, y, 1, 1, '#d8fff8'); F(x + 4, y + 3, 1, 2, '#c8c0e8'); F(x + 3, y + 2, 3, 1, '#5af0e0'); ell(x + 2, y + 1, 6, 4, 'rgba(90,240,224,.12)', g) }
  if (k == 'deadgrass') { for (let i = 0; i < 4; i++) F(x + i * 2, y + (i % 2), 1, 4 - (i % 2), '#7a6a8a') }
  if (k == 'bonesy') { F(x, y + 2, 6, 1, '#c8c0d8'); F(x - 1, y + 1, 2, 3, '#c8c0d8'); F(x + 5, y + 1, 2, 3, '#c8c0d8') }
  if (k == 'shell') { F(x, y + 1, 4, 2, '#f8e4e0'); F(x + 1, y, 2, 1, '#f8e4e0'); F(x + 1, y + 1, 1, 2, '#e0b0a8'); F(x + 3, y + 1, 1, 2, '#e0b0a8') }
  if (k == 'starfish') { F(x + 2, y, 1, 5, '#f08a5a'); F(x, y + 2, 5, 1, '#f08a5a'); F(x + 1, y + 1, 3, 3, '#f08a5a'); F(x + 2, y + 2, 1, 1, '#ffd0a0') }
  if (k == 'beachgrass') { for (let i = 0; i < 4; i++) { F(x + i * 2, y + 1 + (i % 2), 1, 5 - (i % 2), '#7ab05a'); F(x + i * 2, y + (i % 2), 1, 1, '#a8d07a') } }
  if (k == 'footprints') { for (let i = 0; i < 3; i++) { F(x + i * 4, y + (i % 2) * 3, 2, 3, 'rgba(160,120,60,.28)') } }
  if (k == 'litter') { F(x, y, 3, 2, '#d8d8e8'); F(x + 5, y + 3, 2, 2, NC[(s * 4) | 0]); F(x + 2, y + 5, 2, 1, '#8a8aa0') }
  if (k == 'crack') { F(x, y, 4, 1, 'rgba(0,0,0,.35)'); F(x + 3, y + 1, 3, 1, 'rgba(0,0,0,.35)'); F(x + 5, y + 2, 1, 2, 'rgba(0,0,0,.35)') }
  if (k == 'puddle') { ell(x + 4, y + 3, 6, 2.5, 'rgba(60,224,255,.18)', g); ell(x + 3, y + 3, 2, 1, 'rgba(255,255,255,.3)', g) }
  if (k == 'starbud') { F(x + 1, y + 2, 1, 3, '#3a3a8a'); F(x, y + 1, 3, 1, '#fff6a8'); F(x + 1, y, 1, 3, '#fff6a8'); ell(x + 1, y + 1, 5, 4, 'rgba(255,240,160,.12)', g) }
  if (k == 'crystal') { F(x + 1, y - 2, 2, 6, '#8ad8ff'); F(x + 1, y - 2, 1, 6, '#d8f4ff'); F(x + 3, y + 1, 2, 3, '#6aa8e8'); F(x - 1, y + 1, 2, 3, '#b8a8ff') }
  if (k == 'sparkle') { F(x, y + 1, 3, 1, '#c8c0ff'); F(x + 1, y, 1, 3, '#c8c0ff') }
  if (k == 'chip') { F(x, y, 3, 2, NC[(s * 4) | 0]); F(x + 1, y, 1, 2, '#fff') }
}
