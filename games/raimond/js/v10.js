// ==================== v10 ====================
// Save journals · the castle library and the dungeon (teamwork puzzles) · playground rides · fishing · stray cats ·
// a nicer shop screen and stall sprites · friends calling out their fears · more detailed furniture.
const XSC = {};   // extra full-screen modes, run by main.js
const SPR_ = {};
const cspr = (key, w, fn) => SPR_[key] || (SPR_[key] = propSprite({ w, d: fn }, 0, 0, null, 0, {}));
function drawC(key, w, fn, x, y) { const s = cspr(key, w, fn); if (s) X.drawImage(s.c, Math.round(x + s.x), Math.round(y + s.y)) }
const partyHas = i => S.party.includes(i);

// ---------------------------------------------------------------- more detailed furniture (replacing the blobby ones)
Object.assign(PROPS, {
  f_plant2: { s: S1, d(G, x, y, P, s, p) {   // a leafy house plant: terracotta pot with a rim, long pointed leaves with a midrib
    const pot = p.pot || '#c86a3a'; SHD(G, x + 1, y, 8, 2); PF(G, x - 5, y - 10, 10, 10, sh(pot, .75)); PF(G, x - 4, y - 10, 8, 9, pot); PF(G, x - 4, y - 10, 2, 9, sh(pot, 1.2)); PF(G, x - 6, y - 12, 12, 3, sh(pot, 1.1)); PF(G, x - 6, y - 12, 12, 1, sh(pot, 1.35)); PF(G, x - 4, y - 10, 8, 1, '#3a2414');
    const leaf = (ang, len, c1, c2) => { for (let k = 0; k < len; k++) { const t = k / len, wv = Math.sin(t * Math.PI) * 2.6, lx = x + Math.cos(ang) * k, ly = y - 12 + Math.sin(ang) * k + t * t * 4; PF(G, lx - wv * .5, ly - wv * .5, Math.max(1, wv), Math.max(1, wv), c1); if (k > 1 && k < len - 2) PF(G, lx, ly, 1, 1, c2) } };
    [[-2.5, 13], [-2.0, 17], [-1.57, 19], [-1.15, 17], [-.6, 13], [-2.8, 10], [-.35, 10]].forEach(([a, l], i) => leaf(a + (s - .5) * .2, l, i % 2 ? '#2e8a44' : '#3aa052', '#1e5a2e'));
  } },
  f_beanbag: { s: S1, d(G, x, y, P, s, p) { const c = p.c || '#e85a7a'; SHD(G, x + 1, y, 9, 2); PF(G, x - 8, y - 9, 16, 9, sh(c, .7)); PF(G, x - 7, y - 12, 14, 11, c); PF(G, x - 6, y - 14, 12, 4, c); PF(G, x - 6, y - 14, 12, 2, sh(c, 1.3)); PF(G, x - 7, y - 8, 14, 1, sh(c, .8)); PF(G, x - 2, y - 11, 4, 3, sh(c, .82)); PF(G, x - 5, y - 13, 2, 2, sh(c, 1.45)) } },
  f_cushion: { flat: 1, d(G, x, y, P, s, p) { const c = p.c || '#e8c060'; PF(G, x - 7, y - 11, 14, 9, sh(c, .7)); PF(G, x - 6, y - 11, 12, 8, c); PF(G, x - 6, y - 11, 12, 2, sh(c, 1.25)); PF(G, x - 1, y - 8, 2, 2, sh(c, .7)); for (const [a, b] of [[-7, -12], [6, -12], [-7, -4], [6, -4]]) PF(G, x + a, y + b, 1, 1, sh(c, .6)) } },
  f_yarn: { flat: 1, d(G, x, y) { const ball = (cx, cy, c) => { PF(G, cx - 3, cy - 4, 6, 7, sh(c, .7)); PF(G, cx - 4, cy - 3, 8, 5, sh(c, .7)); PF(G, cx - 3, cy - 3, 6, 5, c); PF(G, cx - 2, cy - 4, 4, 1, c); for (let i = 0; i < 3; i++) PF(G, cx - 3 + i * 2, cy - 3 + i, 3, 1, sh(c, 1.3)) }; ball(x - 3, y - 4, '#e85a7a'); ball(x + 5, y - 3, '#5ab0e8'); PF(G, x + 1, y - 2, 5, 1, '#e85a7a'); PF(G, x - 9, y - 1, 6, 1, '#e85a7a') } },
  f_catbed: { flat: 1, d(G, x, y, P, s, p) { const c = p.c || '#7a8ac8'; PF(G, x - 10, y - 10, 20, 9, sh(c, .65)); PF(G, x - 9, y - 11, 18, 9, c); PF(G, x - 9, y - 11, 18, 2, sh(c, 1.3)); PF(G, x - 6, y - 8, 12, 5, '#f4ecd8'); PF(G, x - 6, y - 8, 12, 1, '#d8ccb8'); PF(G, x - 2, y - 7, 1, 1, '#a89888') } },
  f_bowls: { flat: 1, d(G, x, y) { for (const [cx, c, f] of [[-4, '#c83a3a', '#f4f4f4'], [5, '#3a6ac8', '#c8a060']]) { PF(G, x + cx - 4, y - 6, 8, 4, sh(c, .7)); PF(G, x + cx - 3, y - 7, 6, 4, c); PF(G, x + cx - 3, y - 7, 6, 1, f); PF(G, x + cx - 2, y - 8, 4, 1, f) } PF(G, x + 9, y - 10, 5, 2, '#ff8a2a'); PF(G, x + 13, y - 11, 2, 4, '#ff8a2a') } },
  cshelf: { w: 2, s: S2, d(G, x, y, P, s) {   // castle bookcase: black oak, carved top, crumbling old books, a candle
    SHD(G, x + 2, y, 15, 3); PF(G, x - 15, y - 46, 30, 46, '#120810'); PF(G, x - 14, y - 45, 28, 44, '#3a1e1a'); PF(G, x - 14, y - 45, 28, 2, '#5a3226'); PF(G, x - 15, y - 50, 30, 6, '#2a1210'); PF(G, x - 5, y - 54, 10, 5, '#2a1210');
    for (let j = 0; j < 4; j++) { PF(G, x - 12, y - 42 + j * 10, 24, 8, '#160a0a'); let bx = x - 11; while (bx < x + 10) { const k = hsh(bx, j, s * 13 + 1), bw = 2 + (k * 3 | 0), bh = 5 + (k * 3 | 0); if (k > .12) { const c = ['#5a1a22', '#2a3a5a', '#4a3a1a', '#3a1a3a', '#6a5a3a', '#1a3a2a'][(k * 6) | 0]; PF(G, bx, y - 34 + j * 10 - bh, bw, bh, c); PF(G, bx, y - 34 + j * 10 - bh, 1, bh, sh(c, 1.4)); if (bw > 2) PF(G, bx, y - 32 + j * 10 - bh, bw, 1, '#c8a040') } else { PF(G, bx, y - 36 + j * 10, bw + 2, 2, '#4a2a1a') } bx += bw + (k < .2 ? 2 : 0) } PF(G, x - 14, y - 34 + j * 10, 28, 2, '#5a3226') }
    if (s > .5) { PF(G, x + 7, y - 52, 3, 5, '#e8e0d0'); PF(G, x + 8, y - 55, 1, 3, '#ffb03a') }
  } },
  ctable: { w: 2, s: S2, d(G, x, y, P, s) {   // heavy reading table: an open book, a candle, ink, a skull paperweight
    SHD(G, x + 2, y, 16, 3); PF(G, x - 13, y - 8, 3, 8, '#120810'); PF(G, x + 10, y - 8, 3, 8, '#120810'); PF(G, x - 15, y - 16, 30, 9, '#120810'); PF(G, x - 14, y - 16, 28, 7, '#4a2a22'); PF(G, x - 14, y - 16, 28, 2, '#6a3e2e');
    PF(G, x - 9, y - 21, 12, 6, '#e8dcc0'); PF(G, x - 3, y - 21, 1, 6, '#a89870'); for (let i = 0; i < 3; i++) { PF(G, x - 8, y - 20 + i * 2, 4, 1, '#8a7a5a'); PF(G, x - 2, y - 20 + i * 2, 4, 1, '#8a7a5a') } PF(G, x + 6, y - 24, 3, 8, '#e8e0d0'); PF(G, x + 7, y - 27, 1, 3, '#ffb03a');
    if (s > .5) { PF(G, x + 10, y - 19, 4, 3, '#cdbcc6'); PF(G, x + 10, y - 18, 1, 1, '#2a1620'); PF(G, x + 12, y - 18, 1, 1, '#2a1620') } else { PF(G, x + 10, y - 19, 3, 3, '#1a1a2a'); PF(G, x + 12, y - 23, 1, 5, '#e8e0d0') }
  } },
  candelabra: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 5, y - 3, 10, 3, '#3a2a1a'); PF(G, x - 1, y - 30, 2, 28, '#8a6a2a'); PF(G, x - 8, y - 30, 16, 2, '#8a6a2a'); for (const d of [-7, 0, 6]) { PF(G, x + d, y - 36, 2, 6, '#e8e0d0'); PF(G, x + d, y - 39, 2, 3, '#ffb03a'); PF(G, x + d, y - 38, 1, 1, '#fff2b0') } } },
  globe: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 5, y - 3, 10, 3, '#3a2010'); PF(G, x - 1, y - 12, 2, 10, '#5a3a22'); PE(G, x, y - 20, 8, 8, '#8a6a2a'); PE(G, x, y - 20, 7, 7, '#3a6a9a'); PE(G, x - 2, y - 22, 3, 2, '#7a9a4a'); PE(G, x + 3, y - 18, 2, 3, '#7a9a4a'); PF(G, x - 3, y - 25, 2, 1, '#9ac0e8') } },
  lectern: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 6, y - 3, 12, 3, '#2a1210'); PF(G, x - 2, y - 18, 4, 15, '#3a1e1a'); PF(G, x - 8, y - 24, 16, 6, '#3a1e1a'); PF(G, x - 7, y - 26, 14, 4, '#e8dcc0'); PF(G, x, y - 26, 1, 4, '#a89870'); PF(G, x - 1, y - 22, 2, 6, '#8a1a2a') } },
  bookpile: { flat: 1, d(G, x, y, P, s) { ['#5a1a22', '#2a3a5a', '#6a5a3a', '#3a1a3a', '#4a3a1a'].slice(0, 3 + (s * 3 | 0)).forEach((c, k) => { PF(G, x - 6 + (k % 2) * 2, y - 4 - k * 3, 11 - (k % 2), 3, c); PF(G, x - 6 + (k % 2) * 2, y - 2 - k * 3, 11 - (k % 2), 1, '#e8dcc0') }) } },
  cell: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); for (let i = 0; i < 6; i++) PF(G, x - 14 + i * 5, wy - 30, 2, 30, '#3a3440'); PF(G, x - 15, wy - 31, 30, 3, '#2a2430'); PF(G, x - 15, wy - 16, 30, 2, '#2a2430') } },
  straw: { flat: 1, d(G, x, y, P, s) { for (let i = 0; i < 18; i++) { const a = hsh(i, s * 9, 3) * 18 - 9, b = hsh(i, s * 7, 4) * 8; PF(G, x + a, y - 4 - b, 4, 1, i % 3 ? '#c8a860' : '#a8884a') } } },
  bucket: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 5, 2); PF(G, x - 5, y - 10, 10, 10, '#3a2a1a'); PF(G, x - 4, y - 9, 8, 8, '#6a4a2a'); PF(G, x - 4, y - 7, 8, 1, '#3a2a1a'); PF(G, x - 4, y - 3, 8, 1, '#3a2a1a'); PF(G, x - 5, y - 15, 1, 5, '#8a8a94'); PF(G, x + 4, y - 15, 1, 5, '#8a8a94'); PF(G, x - 5, y - 16, 10, 1, '#8a8a94') } },
  rubble: { flat: 1, d(G, x, y, P, s) { for (let i = 0; i < 6; i++) { const a = hsh(i, s * 9, 5) * 16 - 8, b = hsh(i, s * 9, 6) * 6, w = 2 + (hsh(i, s, 7) * 4 | 0); PF(G, x + a, y - 4 - b, w, w - 1, '#4a3a44'); PF(G, x + a, y - 4 - b, w, 1, '#6a5a64') } } },
  plaque: { flat: 1, d(G, x, y) { const wy = WY(y); PF(G, x - 12, wy - 26, 24, 18, '#120810'); PF(G, x - 11, wy - 25, 22, 16, '#5a3646'); for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) if (hsh(i, k, 9) < .7) PF(G, x - 9 + k * 4, wy - 23 + i * 4, 3, 2, '#2a1620') } },
});
CC.stone = CC.stone || '#4a2c3a';
// lanterns and lamps stand on the floor now (nothing hangs in mid-air)
PROPS.f_hlantern = { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 5, y - 3, 10, 3, '#2a2a30'); PF(G, x - 1, y - 24, 2, 21, '#3a3a40'); PF(G, x - 5, y - 26, 10, 2, '#3a3a40'); PF(G, x - 4, y - 34, 8, 8, '#2a2a30'); PF(G, x - 3, y - 33, 6, 6, '#ffd27a'); PF(G, x - 2, y - 32, 2, 4, '#fff2c0'); PF(G, x - 5, y - 36, 10, 2, '#3a3a40'); PF(G, x - 1, y - 38, 2, 2, '#3a3a40') } };
PROPS.f_hanglamp = { flat: 1, d() {} };
PROPS.f_chand = { flat: 1, d() {} };

// ---------------------------------------------------------------- save journals: an open sketchbook on a stump, glowing softly. Interact to save.
const savept = (x, y) => ({ k: 'vend', at: [x, y], style: 'journal' });
function drawJournal(x, y) {
  X.globalCompositeOperation = 'lighter'; ell(x, y - 16, 16, 11, 'rgba(255,220,140,' + (.07 + .04 * Math.sin(tick / 18)).toFixed(3) + ')'); X.globalCompositeOperation = 'source-over';
  drawC('journal', 1, (G, cx, by) => {
    SHD(G, cx + 1, by, 10, 3); PF(G, cx - 8, by - 12, 16, 12, '#4a2c18'); PF(G, cx - 7, by - 12, 14, 11, '#7a5232'); PF(G, cx - 7, by - 12, 3, 11, '#9a7248'); for (let i = 0; i < 3; i++) PF(G, cx - 4 + i * 4, by - 10, 1, 9, '#5a3a22');
    PF(G, cx - 9, by - 15, 18, 4, '#9a7248'); PF(G, cx - 8, by - 15, 16, 1, '#c89a68'); PE(G, cx, by - 13, 5, 1.5, '#7a5232');
    PF(G, cx - 9, by - 22, 9, 7, '#f4ecd8'); PF(G, cx, by - 22, 9, 7, '#ece2cc'); PF(G, cx - 1, by - 22, 1, 7, '#a89870'); for (let i = 0; i < 3; i++) { PF(G, cx - 8, by - 20 + i * 2, 6, 1, '#9aa0c8'); PF(G, cx + 1, by - 20 + i * 2, 5, 1, '#9aa0c8') }
    PF(G, cx + 4, by - 21, 3, 3, '#e85a7a'); PF(G, cx - 1, by - 16, 2, 4, '#c83a3a');
  }, x, y);
  for (let i = 0; i < 3; i++) { const a = tick / 40 + i * 2.1, sx = x + Math.cos(a) * 10, sy = y - 26 + Math.sin(a * 1.3) * 4; r(sx, sy, 1, 1, '#fff6c0'); if ((tick >> 4) % 3 == i) { r(sx - 1, sy, 3, 1, '#fff6c0'); r(sx, sy - 1, 1, 3, '#fff6c0') } }
}
const SAVE_AT = { w_tree: [18, 18], w_cross: [27, 14], w_garden: null, w_meadow: null, g_camp: [24, 14], g_ruins: null, c_hall: [22, 22], b_plaza: null, b_boardwalk: null, b_pier: null, n_street: null, n_plaza: null, n_market: [30, 18], s_garden: null, s_walk2: null };

// ---------------------------------------------------------------- automatic placements (save journals, fishing spots, cats) on first entry to an area
function freeAt(mp, x, y, wide) { if (x < 3 || y < 3 || x >= mp.w - 3 || y >= mp.h - 3) return false; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { if (!wide && a && b) continue; if (mp.t[(y + b) * mp.w + x + a]) return false } return !mp.exits.some(e => Math.abs((e.x + e.w / 2) / T - x) < 4 && Math.abs((e.y + e.h / 2) / T - y) < 4) }
function nearFree(mp, x0, y0, wide = true) { for (let r = 0; r < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) != r) continue; const x = x0 + dx, y = y0 + dy; if (freeAt(mp, x, y, wide)) return [x, y] } return null }
const FISH_IN = { w_cross: 1, w_garden: 1, g_marsh: 2, b_shore: 3, b_pier: 3, n_drain: 4 };
const CAT_IN = { w_cross: '#e8a050', w_play: '#3a3a40', g_camp: '#c8c0b8', b_plaza: '#f4f0e8', b_boardwalk: '#e8a050', n_street: '#5a5a64', n_alley: '#3a3a40', n_market: '#f4f0e8' };
function autoEnts(id) {
  const A0 = AREAS[id]; if (!A0 || A0._auto) return; A0._auto = 1; const mp = areaMap(id);
  if (id in SAVE_AT && !A0.ents.some(e => e.style == 'journal')) { const pr = SAVE_AT[id] || [mp.w >> 1, mp.h >> 1], q = nearFree(mp, pr[0], pr[1]) || nearFree(mp, pr[0], pr[1], false); if (q) A0.ents.push(savept(q[0], q[1])) }
  if (FISH_IN[id]) { let best = null, bd = 1e9; for (let y = 3; y < mp.h - 3; y++) for (let x = 3; x < mp.w - 3; x++) { if (mp.t[y * mp.w + x] || mp.t[(y - 1) * mp.w + x] != 2 || mp.t[y * mp.w + x - 1] || mp.t[y * mp.w + x + 1]) continue; const d = Math.hypot(x - mp.w / 2, y - mp.h / 2); if (d < bd) { bd = d; best = [x, y] } } if (best) A0.ents.push(obj('fishspot', best[0], best[1], [], { ev: 'fish', walk: 1, tier: FISH_IN[id] })) }
  if (CAT_IN[id]) { const q = nearFree(mp, (mp.w * .3) | 0, (mp.h * .6) | 0); if (q) A0.ents.push(obj('cat', q[0], q[1], [], { ev: 'petcat', walk: 1, fur: CAT_IN[id], cid: id })) }
}
const _enter = enter; enter = function (id, from, xy) { autoEnts(id); CHO = null; RIDE = null; _enter(id, from, xy);
  if (id == 'c_dungeon' && !S.fl.dg_in) { S.fl.dg_in = 1; shake = 22; beep(70, .5, 1, 'sawtooth') } };
const SPAWNAT = { 'c_crypt<c_dungeon': [14, 8] };
const _spawnFor = spawnFor; spawnFor = function (mp, from) { const k = S.a + '<' + from; if (SPAWNAT[k]) return [SPAWNAT[k][0] * T + 8, SPAWNAT[k][1] * T + 12]; return _spawnFor(mp, from) };

// ---------------------------------------------------------------- the castle library (behind the throne) and the dungeon (behind the Ossuary's sealed door)
const MORT = { pal: 'mortis', interior: true, floor: 'cbrick', wall: 'cbrick', dark: true, darkA: .45, mus: 'scary' };
(() => {
  const R = ROOM({ id: 'c_library', grid: [
    WALLS(26), WALLS(26),
    '##' + 'H.H.H..c....c...H.H...' + '##',
    '##' + DOTS(22) + '##',
    '##' + '..T......G......T.....' + '##',
    '##' + DOTS(22) + '##',
    '##' + 'H.H' + DOTS(15) + 'H.H.' + '##',
    '##' + DOTS(22) + '##',
    '##' + '....R' + DOTS(17) + '##',
    '##' + '..s................s..' + '##',
    '##' + DOTS(22) + '##',
    '##' + '..T.......l......T....' + '##',
    '##' + DOTS(22) + '##',
    '##' + 'b..........J........b.' + '##',
    '##' + DOTS(22) + '##',
    '##' + 'c....................c' + '##',
    WALLS(26), WALLS(26)],
    leg: { H: [['cshelf', { seed: .3 }], (x, y) => obj('cshelf', x, y, ['|Old books with blank spines. One is warm, like someone was just holding it.'], { inv: 1, quiet: 1 })], c: ['candelabra'], T: [['ctable', { seed: .7 }]], G: ['globe', (x, y) => obj('globe', x, y, ['|A globe of a world that is mostly forest. Someone has circled a tree with red ink.'], { inv: 1, quiet: 1 })],
      R: [['f_rugp', { w: 14, h: 4, c: '#4a1a2a', c2: '#c8a040' }]], s: ['candelabra'], l: ['lectern', (x, y) => obj('lectern', x, y, ['|A huge book lies open on the lectern: "THE BOOK OF FOUR".', '|"Four went into the woods. Four came out. But the one who came out last was not the one who went in first."', 'Hitori:neutral|...That doesn\'t make sense.'], { inv: 1, lore: 'bookfour' })],
      b: ['bookpile'], J: [(x, y) => savept(x, y)] },
    ents: [obj('secretshelf', 22, 2, [], { ev: 'redbook', block: 1, bw: 15, bh: 8, open: () => S.fl.lib_open }), obj('ctable', 4, 4, ['|Notes in four different handwritings, all arguing about the same rule: "Nobody gets left behind."'], { inv: 1, quiet: 1 })] });
  A('c_library', { ...MORT, nm: 'Castle Mortis: Library', w: R.w, h: R.h, feat: R.feat, exits: [ex('down', 12, 13, 'c_throne')], ents: R.ents });
})();
(() => {
  // three cells joined by doorways: [plates] | gate | [the heavy block] | doorway | [levers and an inscription]
  const R = ROOM({ id: 'c_dungeon', grid: [
    WALLS(32), WALLS(32),
    '##' + 'kc...w.k' + '##' + 'k...c...k' + '##' + '.L.M.N.' + '##',
    '##' + DOTS(8) + '##' + DOTS(9) + '##' + DOTS(7) + '##',
    '##' + 's.....B.' + '##' + 'r......b.' + '##' + DOTS(7) + '##',
    '##' + DOTS(8) + '##' + DOTS(9) + '##' + DOTS(7) + '##',
    '##' + 'u.......' + '##' + '...q.....' + '##' + DOTS(7) + '##',
    '##' + DOTS(8) + '..' + DOTS(9) + '##' + DOTS(7) + '##',
    '##' + DOTS(8) + '..' + DOTS(9) + '..' + DOTS(7) + '##',
    '##' + '.J......' + '##' + 'r......u.' + '##' + '.....s.' + '##',
    '##' + DOTS(8) + '##' + DOTS(9) + '##' + DOTS(7) + '##',
    '##' + '.A......' + '##' + '..x....r.' + '##' + '.r...X.' + '##',
    '##' + '......s.' + '##' + DOTS(9) + '##' + DOTS(7) + '##',
    '##' + 'r.....r.' + '##' + 'r.......s' + '##' + 'r.....r' + '##',
    WALLS(32), WALLS(32)],
    leg: { k: ['chains'], c: ['cell'], w: ['plaque'], s: [['skulls', { seed: .6 }]], B: [(x, y) => obj('plate', x, y, [], { ev: 'plateB', flat: 1, walk: 1, quiet: 0 })], A: [(x, y) => obj('plate', x, y, [], { flat: 1, walk: 1, quiet: 1, plateA: 1 })],
      u: ['bucket'], r: [['rubble', { seed: .4 }]], b: [['bones']], q: [['straw', { seed: .5 }]], x: [['straw', { seed: .9 }]], J: [(x, y) => savept(x, y)],
      L: [(x, y) => obj('lever', x, y, [], { ev: 'lever', sym: 'hand', walk: 0 })], M: [(x, y) => obj('lever', x, y, [], { ev: 'lever', sym: 'moon' })], N: [(x, y) => obj('lever', x, y, [], { ev: 'lever', sym: 'eye' })],
X: [(x, y) => chest('c:c_dungeon', x, y, { money: 60 })] },
    feat: [p('cell', 13, 2), p('candles', 4, 13), p('candles', 26, 13)],
    ents: [obj('runestone', 26, 7, [], { ev: 'plaque' }), obj('scrawl', 15, 13, ['|Scratched into the wall, low down, in a child\'s hand: "IF YOU ARE READING THIS WE GOT OUT. YOU CAN TOO."'], { inv: 1, quiet: 1 })] });
  A('c_dungeon', { ...MORT, nm: 'Castle Mortis: The Cells', darkA: .55, w: R.w, h: R.h, feat: R.feat, exits: [ex('up', 5, 6, 'c_crypt', { need: 'dg_done', needmsg: 'dg_locked' })], ents: R.ents });
})();
LOCKS.dg_locked = ['|The door is shut tight. There is no handle on this side.', 'Hitori:neutral|...There has to be another way out.'];
Object.assign(AREA_TALK, {
  c_dungeon: ['|BOOM. The door slams shut behind you. The glyph on it flares, then goes dark.', 'Steven:scared|Nope. Nope. Doors don\'t do that.', 'Caroline:worried|It won\'t open from this side...', 'Hitori:neutral|Then we find another way. Together.', 'Caroline:neutral|Look, there are plates on the floor. And a gate.'],
  c_library: ['Caroline:happy|A library! Oh, I could live in here.', 'Steven:neutral|You say that about every room with a chair in it.']
});
// dungeon pieces that change with the puzzle flags are made fresh every time the room is set up
const _makeEnts = makeEnts; makeEnts = function () { _makeEnts();
  if (S.a == 'c_dungeon') {
    E.push({ k: 'obj', kind: 'gate', x: 10 * T + 16, y: 7 * T + 14, say: ['|An iron gate. No lock, no handle. Chains run from it into the floor.'], block: 1, bw: 16, bh: 26, open: () => S.fl.dg_g1, quiet: 1 });
    const by = S.fl.dg_blk ? 11 : 8; E.push({ k: 'obj', kind: 'boulder', x: 20 * T + 8, y: by * T + 14, ev: 'boulder', block: 1, bw: 11, bh: 9 });
    if (S.fl.dg_wait != null) E.push({ k: 'obj', kind: 'buddy', who: S.fl.dg_wait, x: 8 * T + 8, y: 4 * T + 14, ev: 'buddy', block: 1, quiet: 1 });
  }
  if (S.a == 'c_library' && S.fl.lib_open && !S.got['c:c_library']) E.push({ k: 'chest', id: 'c:c_library', money: 45, x: 22 * T + 16, y: 2 * T + 14 });
};
Object.assign(XOBJ, {
  plate: (x, y, e) => { const down = e.plateA ? Math.hypot(S.x - e.x, S.y - e.y) < 11 || S.fl.dg_g1 : S.fl.dg_wait != null || S.fl.dg_g1; r(x - 9, y - 12, 18, 12, '#120810'); r(x - 8, y - 11, 16, 10, down ? '#3a2430' : '#6a4a58'); r(x - 8, y - 11, 16, 2, down ? '#2a1620' : '#8a6a78'); r(x - 4, y - 8, 8, 4, down ? '#7a1a2a' : '#c03a48') },
  gate: (x, y, e) => { const o = S.fl.dg_g1 ? 26 : 0; for (let i = 0; i < 6; i++) r(x - 14 + i * 5, y - 36 - o, 2, 36 - Math.min(30, o), '#4a4458'); r(x - 16, y - 38 - o, 32, 3, '#2a2430'); r(x - 16, y - 20 - o, 32, 2, '#2a2430'); if (!o) for (let i = 0; i < 6; i++) r(x - 14 + i * 5, y - 2, 2, 3, '#4a4458') },
  boulder: (x, y, e) => { const dy = BLK ? Math.min(48, BLK.t * 1.5) : 0; drawC('boulder', 1, (G, cx, by) => { SHD(G, cx + 1, by, 10, 3); PF(G, cx - 9, by - 18, 18, 18, '#2a2430'); PF(G, cx - 8, by - 17, 16, 16, '#5a5468'); PF(G, cx - 8, by - 17, 16, 3, '#7a7488'); PF(G, cx - 5, by - 11, 6, 1, '#3a3448'); PF(G, cx + 2, by - 7, 4, 1, '#3a3448'); PF(G, cx - 8, by - 4, 16, 3, '#3a3448') }, x, y + dy) },
  buddy: (x, y, e) => { drawChar(CH[e.who], x, y, 0, 0, 1) },
  lever: (x, y, e) => { const on = (S.fl.dg_seq || '').split(',').includes(e.sym) || S.fl.dg_done; r(x - 6, y - 6, 12, 6, '#120810'); r(x - 5, y - 5, 10, 4, '#5a3646'); const a = on ? 1 : -1; for (let i = 0; i < 12; i++) r(x + a * i * .5 - 1, y - 6 - i, 2, 1, '#8a8a94'); r(x + a * 6 - 3, y - 21, 6, 4, '#c03a48');
    const sym = { moon: () => { ell(x, y - 30, 4, 4, '#ffe9a0'); ell(x + 2, y - 31, 3, 3, '#2a1620') }, eye: () => { ell(x, y - 30, 5, 2.5, '#ffe9a0'); ell(x, y - 30, 1.5, 1.5, '#2a1620') }, hand: () => { r(x - 3, y - 32, 6, 5, '#ffe9a0'); for (let i = 0; i < 4; i++) r(x - 3 + i * 1.6, y - 35, 1, 3, '#ffe9a0') } }; r(x - 7, y - 37, 14, 13, '#120810'); sym[e.sym]() },
  runestone: (x, y) => drawC('runestone', 1, (G, cx, by) => { SHD(G, cx + 1, by, 10, 3); PF(G, cx - 9, by - 30, 18, 30, '#120810'); PF(G, cx - 8, by - 29, 16, 28, '#5a4a5a'); PF(G, cx - 8, by - 29, 16, 3, '#7a6a7a'); PE(G, cx, by - 30, 8, 3, '#5a4a5a'); for (let i = 0; i < 5; i++) for (let k = 0; k < 3; k++) if (hsh(i, k, 4) < .75) PF(G, cx - 6 + k * 5, by - 25 + i * 5, 3, 2, '#c8303e') }, x, y),
  secretshelf: (x, y, e) => { const dx = S.fl.lib_open ? 30 : (SHELF ? Math.min(30, SHELF.t) : 0); drawC('cshelf_s', 2, (G, cx, by) => PROPS.cshelf.d(G, cx, by, null, .9), x + 8 + dx, y); if (!S.fl.lib_open && !dx) { r(x + 2, y - 30, 2, 6, '#e8283a'); r(x + 2, y - 30, 1, 6, '#ff8a8a') } },
  fishspot: (x, y) => { const t = tick / 20; for (let i = 0; i < 2; i++) { const k = (t + i * .5) % 1; X.strokeStyle = 'rgba(255,255,255,' + (.6 * (1 - k)).toFixed(2) + ')'; X.lineWidth = 1; X.beginPath(); X.ellipse(x, y - 18, 3 + k * 8, 1.5 + k * 3, 0, 0, 6.3); X.stroke() } r(x - 1, y - 20 + Math.sin(tick / 9), 2, 2, '#ff5a5a');
    drawC('fishsign', 1, (G, cx, by) => { PF(G, cx + 8, by - 18, 2, 18, '#5a3a22'); PF(G, cx + 3, by - 22, 12, 8, '#8a6a44'); PF(G, cx + 3, by - 22, 12, 1, '#b08a5a'); PF(G, cx + 5, by - 19, 6, 2, '#3a9ac8'); PF(G, cx + 11, by - 20, 2, 4, '#3a9ac8') }, x, y) },
  cat: (x, y, e) => { const c = e.fur || '#e8a050', dk = sh(c, .7), m = e.mv && (tick >> 3) & 1, f = e.face || 1;
    X.save(); X.translate(x, 0); X.scale(f, 1); const R_ = (a, b, w, h, col) => r(a, y + b, w, h, col);
    ell(1, y, 8, 2, 'rgba(0,0,0,.25)'); R_(-7, -9, 12, 6, '#1a1018'); R_(-6, -8, 10, 5, c); R_(-6, -8, 10, 1, sh(c, 1.2)); R_(-6, -3, 2, 3 - m, dk); R_(2, -3, 2, 2 + m, dk);
    R_(3, -14, 7, 7, '#1a1018'); R_(4, -13, 5, 5, c); R_(4, -15, 2, 2, c); R_(7, -15, 2, 2, c); R_(5, -11, 1, 1, '#1a1018'); R_(7, -11, 1, 1, '#1a1018'); R_(6, -10, 1, 1, '#ff9ab8');
    const tw = Math.sin(tick / 12) * 2; R_(-9, -11 + tw * .3, 3, 2, c); R_(-11, -14 + tw, 2, 4, c); X.restore();
    if (e.heart > 0) { e.heart--; const hy = y - 24 - (40 - e.heart) * .3; r(x - 3, hy, 2, 2, '#ff5a8a'); r(x + 1, hy, 2, 2, '#ff5a8a'); r(x - 3, hy + 2, 6, 2, '#ff5a8a'); r(x - 2, hy + 4, 4, 1, '#ff5a8a'); r(x - 1, hy + 5, 2, 1, '#ff5a8a') } }
});
let BLK = null, SHELF = null;

// ---- puzzle events
function friendOpts() { return S.party.filter(i => i != PL && S.hp[i] > 0) }
function rejoin() { const w = S.fl.dg_wait; if (w == null) return; delete S.fl.dg_wait; if (!S.party.includes(w)) S.party.push(w); E = E.filter(e => e.kind != 'buddy') }
Object.assign(EV, {
  dgdoor() {
    if (S.fl.dg_done) return D(['|The sealed door stands open. Cold air breathes up from the cells.'], () => go('c_dungeon', 'c_crypt'));
    if (partyHas(0) && partyHas(1)) return D(['|A sealed door. The glyph on it burns without heat.', '|When Hitori touches it, the glyph goes out. The door swings inward on its own.', 'Steven:scared|Doors don\'t do that. Doors are not supposed to do that.', 'Caroline:worried|Let\'s just peek. Quickly.'], () => go('c_dungeon', 'c_crypt'));
    D(['|A sealed door. Scratched into the stone underneath, at a child\'s height: "DONT LET IT OUT".', 'Hitori:neutral|...Not alone. Not this one.']);
  },
  plateB() {
    if (S.fl.dg_g1) return D(['|The plate is jammed down for good now.']);
    if (S.fl.dg_wait != null) return D([CH[S.fl.dg_wait].n + ':neutral|I\'m not moving. Go find the other one.']);
    const fr = friendOpts(); if (!fr.length) return D(['|A stone plate. It clicks down when you step on it, and back up when you step off.', 'Hitori:neutral|...I can\'t be in two places at once.']);
    ask(['|A stone plate. It clicks down when you step on it, and back up when you step off.', '|There is another plate on the far side of the cell.', 'Hitori:neutral|...We need to be in two places at once.'], fr.map(i => 'Ask ' + CH[i].n + ' to stand here').concat(['Never mind']), k => {
      if (k >= fr.length) return; const w = fr[k]; S.fl.dg_wait = w; S.party = S.party.filter(i => i != w); beep(300, .1);
      E.push({ k: 'obj', kind: 'buddy', who: w, x: 8 * T + 8, y: 4 * T + 14, ev: 'buddy', block: 1, quiet: 1 });
      D([w == 0 ? 'Steven:neutral|Fine. But if a ghost comes out of a wall, I\'m screaming.' : 'Caroline:happy|Leave it to me! I\'m very good at standing still.', '|CLICK. The plate sinks under them.']);
    });
  },
  buddy(e) { D([CH[e.who].n + ':neutral|' + (e.who == 0 ? 'Still standing. Still not happy about it.' : 'Still here! Go, go!')]) },
  boulder() {
    if (S.fl.dg_blk) return;
    if (!S.fl.dg_g1) return D(['|A huge stone block.']);
    if (!partyHas(0)) return D(['|A huge stone block, blocking the doorway. Hitori pushes. It doesn\'t notice.', 'Hitori:neutral|...Steven could move this.']);
    D(['|A huge stone block, blocking the doorway.', 'Steven:angry|Okay. Okay. On three. One... two...', 'Hitori:angry|THREE.'], () => { BLK = { t: 0 }; shake = 30; beep(60, .6, 1, 'sawtooth') });
  },
  lever(e) {
    if (S.fl.dg_done) return D(['|The lever won\'t move anymore.']);
    const seq = (S.fl.dg_seq ? S.fl.dg_seq.split(',') : []); if (seq.includes(e.sym)) return D(['|This lever is already pulled down.']);
    seq.push(e.sym); beep(400, .08); const want = ['moon', 'eye', 'hand'];
    if (seq.some((v, i) => v != want[i])) { S.fl.dg_seq = ''; S.fl.dg_fails = (S.fl.dg_fails || 0) + 1; shake = 10; beep(90, .3, 1, 'sawtooth');
      return D(['|You pull it down. CLANK. All three levers snap back up.'].concat(S.fl.dg_read ? [] : ['Hitori:neutral|...There\'s writing on the wall over there. Maybe it says how.'])) }
    S.fl.dg_seq = seq.join(',');
    if (seq.length == 3) { S.fl.dg_done = 1; shake = 26; beep(120, .5, 1, 'sawtooth');
      return D(['|A deep rumble shakes dust from the ceiling. Far behind you, the door you came through grinds open.', 'Caroline:happy|We did it! Teamwork!', 'Steven:neutral|I did most of the pushing.', 'Caroline:neutral|I did all of the reading.', 'Hitori:happy|...Thanks. Both of you.']) }
    D(['|You pull it down. Something deep in the wall goes click.']);
  },
  plaque() {
    if (!partyHas(1)) return D(['|Old letters scratched deep into the stone. You can\'t read them.']);
    S.fl.dg_read = 1; D(['|Old letters scratched deep into the stone. Hitori can\'t make them out.', 'Caroline:neutral|Oh! I know these. They\'re the letters from the map in my sketchbook.', 'Caroline:happy|"First the moon that watches. Then the eye that weeps. Last, the hand that lets go."', 'Steven:neutral|...Cheerful.']);
  },
  redbook() {
    if (S.fl.lib_open) return;
    ask(['|One book on this shelf is bright red. It sticks out just a little, as if it wants to be pulled.'], ['Pull the red book', 'Leave it'], k => { if (k) return; SHELF = { t: 0 }; beep(80, .5, 1, 'sawtooth'); shake = 14;
      D(['|The whole bookcase groans and slides sideways!', 'Caroline:happy|A secret shelf! I KNEW it.'], () => { S.fl.lib_open = 1; SHELF = null; makeEnts() }) });
  }
});

// ---------------------------------------------------------------- playground: swing, slide, seesaw, roundabout, hopscotch, sandbox
let RIDE = null, DIZZY = 0;
function ride(k, e, len) { RIDE = { k, e, t: 0, len, x0: S.x, y0: S.y, ex: e.x, ey: e.y } }
Object.assign(EV, {
  swing(e) { if (!F_('sw1')) { S.fl.sw1 = 1; D(['|The swing creaks softly in no wind.', 'Hitori:neutral|...Just once.'], () => ride('swing', e, 520)) } else ride('swing', e, 520) },
  slide(e) { ride('slide', e, 70); say('Wheee!') },
  seesaw(e) { const fr = friendOpts(); if (!fr.length) return D(['|The seesaw is stuck halfway. There is no one on the other end.']); D([CH[fr[0]].n + ':happy|' + (fr[0] == 0 ? 'Fine. But I\'m heavier, so you\'re going to fly.' : 'Ooh, me! I call the other end!')], () => ride('seesaw', e, 300)) },
  mgr(e) { ride('mgr', e, 240); say('Round and round...') },
  hop(e) { ride('hop', e, 150) },
  sandbox() { if (!F_('sand1')) { S.fl.sand1 = 1; S.money = money() + 8; beep(880, .08); return D(['|You dig with your hands. Something hard... a little tin box!', '|Inside: $8 and a plastic shovel with "UKU" written on it in marker.', 'Hitori:sad|...He buried this. When we were small.']) }
    const L = ['|You dig a hole. You fill it in. Very satisfying.', '|You build a sandcastle with four towers. The fifth one keeps falling over.', '|The sand is warm, like someone was just sitting here.']; S.fl.sandN = ((S.fl.sandN || 0) + 1) % L.length; D([L[S.fl.sandN]]) }
});
function rideUpdate() {
  const R = RIDE; R.t++; const e = R;
  if (R.k == 'swing') { S.x = R.ex; S.y = R.ey - 2 + Math.sin(R.t / 13) * Math.min(12, 3 + R.t / 30); S.dir = 0; if (R.t == 200 && friendOpts().length) say(CH[friendOpts()[0]].n + ': Higher! Go higher!'); if ((R.t > 40 && ok()) || R.t > R.len) endRide() }
  else if (R.k == 'slide') { const k = Math.min(1, (R.t / R.len) ** 1.6); S.x = R.ex - 14 + k * 30; S.y = R.ey - 30 + k * 40; S.dir = 0; if (R.t >= R.len) endRide(true) }
  else if (R.k == 'seesaw') { S.x = R.ex - 18; S.y = R.ey - 2 + Math.sin(R.t / 16) * 7; S.dir = 2; if ((R.t > 40 && ok()) || R.t > R.len) endRide() }
  else if (R.k == 'mgr') { const a = R.t * (.04 + R.t / 3000); S.x = R.ex + Math.cos(a) * 15; S.y = R.ey - 4 + Math.sin(a) * 8; S.dir = [0, 2, 3, 1][((a / 1.57) | 0) % 4]; if (R.t > R.len) { endRide(); DIZZY = 200; say('So... dizzy...') } }
  else if (R.k == 'hop') { const n = (R.t / 25) | 0, k = (R.t % 25) / 25; S.x = R.x0; S.y = R.y0 - Math.sin(k * Math.PI) * 10; S.dir = 3; if (R.t % 25 == 0 && n > 0 && n <= 6) { say(n + '!'); beep(500 + n * 80, .05) } if (R.t > R.len) endRide() }
}
function endRide(atEnd) { const R = RIDE; RIDE = null; let q = atEnd ? [S.x, S.y] : [R.x0, R.y0]; if (!canWalk(q[0], q[1])) { const mp = areaMap(S.a), s = nearFree(mp, q[0] / T | 0, q[1] / T | 0, false); q = s ? [s[0] * T + 8, s[1] * T + 12] : [R.x0, R.y0] } S.x = q[0]; S.y = q[1]; trail = [] }
(function () { const P_ = AREAS.w_play; if (!P_) return; for (const e of P_.ents) { if (e.kind == 'swing') e.ev = 'swing'; if (e.kind == 'slide') e.ev = 'slide'; if (e.kind == 'seesaw') e.ev = 'seesaw'; if (e.kind == 'sandbox') e.ev = 'sandbox' }
  P_.ents.push(obj('mgr', 15, 12, [], { ev: 'mgr', inv: 1 }), obj('hopscotch', 22, 9, [], { ev: 'hop', inv: 1 })) })();

// ---------------------------------------------------------------- fishing: wait for the bite, then stop the needle in the green three times
const FISHT = { 1: [['Minnow', 3, .4], ['Creek Trout', 7, .35], ['Rusty Can', 0, .15], ['Golden Carp', 22, .1]], 2: [['Gloomfish', 9, .4], ['Lantern Eel', 15, .3], ['Old Boot', 0, .2], ['Ghost Koi', 36, .1]],
  3: [['Sardine', 11, .4], ['Pufferfish', 19, .3], ['Message in a Bottle', 5, .2], ['Pearl Snapper', 50, .1]], 4: [['Neon Tetra', 15, .4], ['Circuit Catfish', 25, .3], ['Lost Earbud', 0, .2], ['Chrome Koi', 70, .1]] };
const FISHJOKE = { 'Rusty Can': 'It\'s a can. It still has one bean in it.', 'Old Boot': 'Just one boot. Size: small. Laces: tied in a double knot.', 'Lost Earbud': 'It\'s still playing a song. Very quietly.', 'Message in a Bottle': 'The note inside says: "WE\'RE STILL HERE." In your handwriting.' };
let FG = null;
EV.fish = e => { FG = { ph: 'wait', t: 0, wait: 70 + Math.random() * 160, tier: e.tier || 1, hits: 0, miss: 0, nx: 0, nd: 1, sp: 1.6, zx: 30 + Math.random() * 60, zw: 26 }; sc = 'fish'; beep(600, .05) };
XSC.fish = function () {
  const f = FG; f.t++;
  if (esc() || hit.KeyX) { FG = null; sc = 'world'; return }
  if (f.ph == 'wait') { if (ok()) { f.ph = 'miss'; f.t = 0; f.why = 'Too early! The fish swam off.' } else if (f.t > f.wait) { f.ph = 'bite'; f.t = 0; beep(1200, .06); beep(900, .06) } }
  else if (f.ph == 'bite') { if (ok()) { f.ph = 'reel'; f.t = 0; const tb = FISHT[f.tier]; let r_ = Math.random(); f.fish = tb.find(q => (r_ -= q[2]) < 0) || tb[0]; f.sp = 1.4 + tb.indexOf(f.fish) * .45 } else if (f.t > 36) { f.ph = 'miss'; f.t = 0; f.why = 'Too slow. Something nibbled the bait clean off.' } }
  else if (f.ph == 'reel') { f.nx += f.nd * f.sp; if (f.nx < 0 || f.nx > 120) { f.nd *= -1; f.nx = clamp(f.nx, 0, 120) }
    if (ok()) { if (f.nx >= f.zx && f.nx <= f.zx + f.zw) { f.hits++; beep(700 + f.hits * 150, .07); f.zx = 6 + Math.random() * (114 - f.zw); f.zw = Math.max(14, f.zw - 4); if (f.hits >= 3) { f.ph = 'got'; f.t = 0; S.money = money() + f.fish[1]; S.fishN = (S.fishN || 0) + 1; beep(1320, .1) } } else { f.miss++; beep(150, .15); shake = 4; if (f.miss >= 2) { f.ph = 'miss'; f.t = 0; f.why = 'The line snaps! It got away.' } } } }
  else if ((f.ph == 'got' || f.ph == 'miss') && f.t > 20 && ok()) { FG = null; sc = 'world'; return }
  // draw
  sU(); drawWorld(); sU(); r(0, 0, W, H, 'rgba(4,2,16,.5)');
  const px = 70, py = 30; r(px - 2, py - 2, 184, 124, '#fff'); r(px, py, 180, 120, '#0e1a2e');
  for (let i = 0; i < 6; i++) r(px, py + 50 + i * 12, 180, 6, i % 2 ? '#14304a' : '#122a42'); r(px, py, 180, 50, '#1a2a48'); for (let i = 0; i < 12; i++) r(px + ((i * 37 + tick * .2) % 176), py + 52 + (i * 13) % 60, 6, 1, 'rgba(160,220,255,.25)');
  const bx = px + 120, by = py + 58 + (f.ph == 'bite' ? 4 + Math.sin(f.t) * 2 : Math.sin(tick / 15) * 1.5); X.strokeStyle = '#e8e0d0'; X.lineWidth = .5; X.beginPath(); X.moveTo(px + 30, py + 8); X.quadraticCurveTo(px + 90, py + 20, bx, by); X.stroke();
  r(px + 10, py + 6, 22, 2, '#8a6a44'); r(bx - 2, by - 3, 4, 3, '#e8283a'); r(bx - 2, by, 4, 2, '#fff');
  if (f.ph == 'bite') { r(bx - 4, by - 18, 8, 10, '#fff'); r(bx - 1, by - 16, 2, 5, '#e8283a'); r(bx - 1, by - 10, 2, 1, '#e8283a') }
  txt(f.ph == 'wait' ? 'Wait for a bite...' : f.ph == 'bite' ? 'NOW! Press Z!' : f.ph == 'reel' ? 'Reel it in! Stop the needle in the green (' + f.hits + '/3)' : '', 160, py + 24, '#ffe9a0', 'center', 7);
  if (f.ph == 'reel') { const rx = px + 30; r(rx - 1, py + 96, 122, 10, '#fff'); r(rx, py + 97, 120, 8, '#2a1a2a'); r(rx + f.zx, py + 97, f.zw, 8, '#3ac85a'); r(rx + f.nx - 1, py + 93, 2, 16, '#ffd23c'); for (let i = 0; i < 2; i++) r(rx + 124 + i * 6, py + 98, 4, 6, i < f.miss ? '#e8283a' : '#3a3a4a') }
  if (f.ph == 'got') { r(px + 20, py + 70, 140, 40, '#000'); txt('Caught: ' + f.fish[0] + '!', 160, py + 74, '#ffe9a0', 'center', 8); txt(FISHJOKE[f.fish[0]] || ('Sold to a passing cat for $' + f.fish[1] + '.'), 160, py + 88, '#ddd', 'center', 6); if (f.fish[1]) txt('+$' + f.fish[1], 160, py + 99, '#8f8', 'center', 7) }
  if (f.ph == 'miss') { r(px + 20, py + 74, 140, 28, '#000'); txt(f.why, 160, py + 84, '#f99', 'center', 7) }
  txt('Z: REEL   X: STOP FISHING', 160, py + 110, '#8a9ab8', 'center', 5);
};

// ---------------------------------------------------------------- stray cats: they wander; pet all of them for a reward
EV.petcat = e => { e.heart = 40; beep(900, .05); setTimeout(() => beep(700, .08), 90); const k = 'cat_' + e.cid; if (!S.fl[k]) { S.fl[k] = 1; S.fl.cats = (S.fl.cats || 0) + 1 }
  const n = S.fl.cats, L = ['|The cat leans into your hand and purrs like a little engine.', '|Mrrp.'];
  if (n >= 5 && !S.fl.catprize) { S.fl.catprize = 1; S.money = money() + 25; L.push('|...It drops something at your feet. A coin purse with $25 in it. The cats have been saving up.') } else if (n > 1) L.push('|(Cats petted: ' + n + ' of ' + Object.keys(CAT_IN).length + ')'); D(L) };
function catThink(e) { e.ct = (e.ct || 0) - 1; if (e.ct <= 0) { e.ct = 60 + Math.random() * 160; const a = Math.random() * 6.28; e.vx = Math.random() < .4 ? 0 : Math.cos(a) * .3; e.vy = e.vx ? Math.sin(a) * .2 : 0; e.hx = e.hx ?? e.x; e.hy = e.hy ?? e.y }
  e.mv = !!e.vx; if (e.vx) e.face = e.vx < 0 ? -1 : 1; const nx = e.x + (e.vx || 0), ny = e.y + (e.vy || 0); if (canWalk(nx, ny) && Math.hypot(nx - e.hx, ny - e.hy) < 50) { e.x = nx; e.y = ny } else e.ct = 0 }

// ---------------------------------------------------------------- piano and the wishing well
const TUNE = [[523, 220], [587, 220], [659, 220], [523, 220], [659, 330], [587, 220], [523, 440], [392, 440]];
EV.piano = () => { TUNE.forEach(([f, d], i) => setTimeout(() => beep(f, d / 1000 * .8, .6, 'triangle'), TUNE.slice(0, i).reduce((s, q) => s + q[1], 0))); D(['|You play the only song you know. You don\'t remember learning it.', 'Hitori:neutral|...Uku used to hum this.']) };
const WISH = ['"You will find what you\'re looking for. You won\'t like where it is."', '"Someone is thinking of you right now. They can\'t remember why."', '"Turn around."', '"Four is a lucky number. Five is not a number."', '"Your friend is closer than you think. Much closer."', '"Keep walking."'];
EV.wish = () => ask(['|The old well hums. A sign: WISHES $1.'], ['Toss a coin ($1)', 'Leave'], k => { if (k) return; if (money() < 1) return D(['|You don\'t have a coin.']); S.money -= 1; beep(1400, .05); setTimeout(() => beep(300, .2), 500); const i = (S.fl.wishN = ((S.fl.wishN ?? -1) + 1) % WISH.length); D(['|Plink. A long time later, from very far down, a voice:', '|' + WISH[i]]) });
(function () { for (const a of ['b_cafe', 'b_hotel']) for (const e of (AREAS[a] || {}).ents || []) if (e.kind == 'piano') e.ev = 'piano';
  const w = AREAS.w_well && AREAS.w_well.ents.find(e => e.kind == 'well'); if (w) w.ev = 'wish';
  const h = AREAS.b_hotel; if (h && !h.ents.some(e => e.kind == 'piano')) h.ents.push(obj('piano', 26, 11, [], { ev: 'piano', inv: 1 })) })();

// ---------------------------------------------------------------- world update/draw hooks: rides, dizziness, cats, dungeon logic, fear call-outs
const _wu = worldUpdate; worldUpdate = function () {
  if (RIDE && !DL && !CHO && !TR) { rideUpdate(); return }
  const sx = S.x; _wu();
  if (DIZZY > 0 && sc == 'world') { DIZZY--; const w = Math.sin(tick / 6) * .7; if (canMove(S.x + w, S.y)) S.x += w }
  if (sc != 'world') return;
  for (const e of E) if (e.kind == 'cat') catThink(e);
  for (const e of E) if (e.k == 'enemy' && e.st == 'alert' && e.stT == 1 && !S.fl['fsay_' + S.a + S.day]) { const i = S.party.find(j => FEARS[j] && FEARS[j].t.includes(e.t)); if (i != null) { S.fl['fsay_' + S.a + S.day] = 1; say(FEARLINE[i].replace(/^(\w+):\w+\|/, '$1: ')) } }
  if (S.a == 'c_dungeon') {
    const pa = E.find(e => e.plateA); if (pa && S.fl.dg_wait != null && !S.fl.dg_g1 && Math.hypot(S.x - pa.x, S.y - pa.y) < 11 && !DL) { S.fl.dg_g1 = 1; shake = 24; beep(80, .5, 1, 'sawtooth'); const w = S.fl.dg_wait;
      D(['|CLICK... CLUNK. Somewhere inside the walls, chains pull tight.', '|The iron gate rises!', CH[w].n + ':happy|' + (w == 0 ? 'Did it work? It worked! I\'m coming!' : 'Yay! Wait for me!')], rejoin) }
    if (BLK) { BLK.t++; if (BLK.t > 32) { BLK = null; S.fl.dg_blk = 1; makeEnts(); D(['|The block grinds aside. The doorway is clear.', 'Steven:happy|...I\'m going to feel that tomorrow.']) } }
  }
  if (SHELF) SHELF.t++;
};
const _dw = drawWorld; drawWorld = function () { _dw();
  // (v12 draws the riders itself, depth-sorted: see XDRAW in v12.js)
};

// ---------------------------------------------------------------- save journals and the new stalls: entity drawing
const _de = drawEntity; drawEntity = function (e, x, y) { if (e.k == 'vend' && e.style == 'journal') return drawJournal(x, y); return _de(e, x, y) };
Object.assign(OBJ, XOBJ);

// stalls, redrawn with proper wood, cloth, baskets and outlines (the static part is cached; flames/steam/lights animate on top)
OBJ.stall = (x, y, e) => {
  const st = STALLSTY[e.shop] || {}, city = AREAS[S.a] && AREAS[S.a].city;
  if (city) { X.globalCompositeOperation = 'lighter'; ell(x, y - 22, 34, 26, 'rgba(255,150,90,' + (.06 + Math.sin(tick / 30) * .02).toFixed(3) + ')'); X.globalCompositeOperation = 'source-over' }
  drawC('stall_' + e.shop, 4, (G, cx, by) => (st.rustic ? rusticStall : marketStall)(G, cx, by, st), x, y);
  if (st.rustic) { txt((st.sign || '').split(' ')[0], x / 2, (y - 44) / 2, '#f4ecd8', 'center', 3.4); if (st.dark) { const f = (tick >> 3) & 1; X.globalCompositeOperation = 'lighter'; ell(x - 21, y - 34, 8, 8, 'rgba(255,190,90,.25)'); X.globalCompositeOperation = 'source-over'; r(x - 22, y - 36, 3, 4, f ? '#ffd27a' : '#ffb04a') } return }
  const sw = Math.max(40, st.sign.length * 6 + 10); txt(st.sign, x / 2, (y - 74) / 2, ((tick >> 4) % 9) ? st.sc : '#fff', 'center', 4.4);
  if (st.steam) for (let i = 0; i < 3; i++) { const q = (tick / 2 + i * 13) % 26; ell(x - 14 + i * 9 + Math.sin(q / 4) * 2, y - 28 - q, 2 + q / 10, 2 + q / 10, 'rgba(255,255,255,' + (.28 * (1 - q / 26)).toFixed(2) + ')') }
  for (let i = 0; i < 6; i++) { const lx = x - 24 + i * 9.6, ly = y - 42 + Math.sin(i * 1.3) * 1.5, on = (tick >> 5) + i & 3; r(lx - 1, ly - 1, 3, 3, on ? ['#ffd23c', '#ff5a8a', '#2ee6e6'][i % 3] : '#5a4a3a') }
};
function rusticStall(G, x, y, st) {
  const dark = st.dark, wd = dark ? '#5a3a22' : '#8a5a32', wl = dark ? '#7a5232' : '#b07a44', wk = dark ? '#2a1a0e' : '#4a2c16', cloth = dark ? '#3a5a4a' : '#c83a3a';
  SHD(G, x + 3, y, 30, 5);
  for (const px of [-24, 21]) { PF(G, px + x, y - 48, 4, 48, wk); PF(G, px + x + 1, y - 48, 2, 48, wd); PF(G, px + x + 1, y - 40, 1, 6, wl) }
  for (let i = 0; i < 7; i++) { const sx = x - 30 + i * 9; PF(G, sx, y - 60 + (i % 2), 10, 9, i % 2 ? wd : wl); PF(G, sx, y - 60 + (i % 2), 10, 1, sh(wl, 1.2)); PF(G, sx + 9, y - 60, 1, 9, wk) }
  for (let i = 0; i < 7; i++) { const sx = x - 30 + i * 9; PF(G, sx + 2, y - 52, 9, 4, i % 2 ? wl : wd); PF(G, sx + 2, y - 49, 9, 1, wk) } PF(G, x - 32, y - 62, 64, 3, wk); PF(G, x - 31, y - 48, 62, 2, wk);
  PF(G, x - 18, y - 46, 36, 11, wk); PF(G, x - 17, y - 45, 34, 9, '#2a3a2a'); PF(G, x - 17, y - 45, 34, 1, '#3a4a3a');
  PF(G, x - 28, y - 20, 56, 5, wl); PF(G, x - 28, y - 20, 56, 1, sh(wl, 1.25)); PF(G, x - 28, y - 15, 56, 1, wk);
  PF(G, x - 27, y - 14, 54, 14, wd); for (let i = 0; i < 6; i++) PF(G, x - 27 + i * 9, y - 14, 1, 14, wk); PF(G, x - 27, y - 2, 54, 2, wk);
  for (let i = 0; i < 6; i++) { PF(G, x - 27 + i * 9, y - 15, 9, 5, i % 2 ? cloth : '#f4ecd8'); PF(G, x - 27 + i * 9 + 3, y - 10, 3, 2, i % 2 ? cloth : '#f4ecd8') }
  // wares: a basket of fruit, jars, a cookie tray, juice bottles, the coin tin
  PF(G, x - 25, y - 26, 12, 6, '#8a6a3a'); for (let i = 0; i < 3; i++) PF(G, x - 25, y - 25 + i * 2, 12, 1, '#a8884a'); for (const [a, c] of [[-23, '#e85a3a'], [-19, '#ffb03a'], [-16, '#e85a3a'], [-21, '#8ac83a']]) PF(G, x + a, y - 29 + (a == -21 ? -2 : 0), 3, 3, c);
  for (let i = 0; i < 3; i++) { PF(G, x - 10 + i * 5, y - 28, 4, 8, 'rgba(210,235,250,.95)'); PF(G, x - 10 + i * 5, y - 25, 4, 5, ['#ff5a8a', '#ffd23c', '#5ab0e8'][i]); PF(G, x - 10 + i * 5, y - 29, 4, 1, '#8a6a44') }
  PF(G, x + 6, y - 22, 12, 2, '#c8c0b8'); for (let i = 0; i < 3; i++) PE(G, x + 8 + i * 4, y - 23, 1.6, 1.2, '#b07a3a'); PF(G, x + 20, y - 29, 3, 9, '#f4a83a'); PF(G, x + 20, y - 31, 3, 2, '#fff'); PF(G, x + 24, y - 27, 3, 7, '#f4a83a');
  if (dark) { PF(G, x - 23, y - 40, 1, 6, '#3a3a40') }
  // a crate beside it
  PF(G, x + 28, y - 12, 12, 12, wk); PF(G, x + 29, y - 11, 10, 10, wl); PF(G, x + 29, y - 7, 10, 1, wk); PF(G, x + 31, y - 15, 3, 3, '#e85a3a'); PF(G, x + 35, y - 15, 3, 3, '#e85a3a');
}
function marketStall(G, x, y, st) {
  const wk = '#120a1e', wd = '#5a3a2a', wl = '#7a5236';
  SHD(G, x + 3, y, 30, 5);
  for (const px of [-26, 22]) { PF(G, x + px, y - 52, 4, 52, wk); PF(G, x + px + 1, y - 52, 2, 52, '#3a2a4a') }
  PF(G, x - 24, y - 40, 48, 22, '#1a1438'); for (let i = 0; i < 2; i++) { PF(G, x - 23, y - 38 + i * 10, 46, 2, '#4a3a6a'); for (let k = 0; k < 7; k++) PF(G, x - 21 + k * 6.5, y - 36 + i * 10, 4, 6, NC[(k + i) % 4]) }
  if (st.charms) for (let i = 0; i < 7; i++) { const cx = x - 20 + i * 6.5; PF(G, cx, y - 46, 1, 5, '#c8b890'); PF(G, cx - 2, y - 41, 5, 7, i % 2 ? '#e8d8a8' : '#ffd0e0'); PF(G, cx - 1, y - 39, 3, 1, '#c03a3a') }
  if (st.noren) for (let i = 0; i < 4; i++) { PF(G, x - 23 + i * 12, y - 44, 11, 14, i % 2 ? '#2a2a6a' : '#22225a'); PF(G, x - 19 + i * 12, y - 39, 3, 3, '#2ee6e6') }
  PF(G, x - 28, y - 18, 56, 5, wl); PF(G, x - 28, y - 18, 56, 1, sh(wl, 1.3)); PF(G, x - 27, y - 13, 54, 13, wd); for (let i = 0; i < 5; i++) PF(G, x - 27 + i * 11, y - 13, 1, 13, '#3a2418'); PF(G, x - 27, y - 2, 54, 2, '#3a2418');
  PF(G, x - 27, y - 13, 54, 4, st.a1); for (let i = 0; i < 9; i++) PF(G, x - 27 + i * 6, y - 9, 3, 2, st.a1);
  (st.goods || []).forEach((id, i) => { const gx = x - 22 + i * 12; PF(G, gx - 1, y - 21, 11, 3, '#c8c0b8'); });
  for (let i = 0; i < 9; i++) { const ax = x - 30 + i * 6.7; PF(G, ax, y - 62, 7, 10, i % 2 ? st.a2 : st.a1); PF(G, ax, y - 62, 7, 2, sh(i % 2 ? st.a2 : st.a1, 1.2)); PF(G, ax + 1, y - 52, 5, 2, i % 2 ? st.a2 : st.a1); PF(G, ax + 2, y - 50, 3, 1, i % 2 ? st.a2 : st.a1); PF(G, ax + 6, y - 62, 1, 10, sh(i % 2 ? st.a2 : st.a1, .75)) }
  PF(G, x - 31, y - 63, 62, 2, wk); const sw = Math.max(40, st.sign.length * 6 + 10); PF(G, x - sw / 2, y - 76, sw, 12, wk); PF(G, x - sw / 2 + 1, y - 75, sw - 2, 10, '#0b0a24'); PF(G, x - 1, y - 64, 2, 2, wk);
}
// goods on the stall counters (drawn live so the icons stay crisp)
const _stall = OBJ.stall; OBJ.stall = (x, y, e) => { _stall(x, y, e); const st = STALLSTY[e.shop] || {}; if (!st.rustic) (st.goods || []).forEach((id, i) => drawCons(id, x - 22 + i * 12, y - 30, .66)) };

// ice-cream cart: striped umbrella, wheels, tubs of ice cream, a stack of cones
OBJ.icecart = (x, y) => drawC('icecart', 3, (G, cx, by) => {
  SHD(G, cx + 2, by, 22, 4); PF(G, cx - 1, by - 56, 2, 36, '#8a8a94');
  for (let i = 0; i < 8; i++) { const a = -28 + i * 7; PF(G, cx + a, by - 60 + Math.abs(i - 3.5) * 1.2, 7, 6, i % 2 ? '#f4f4f4' : '#ff7aa8'); PF(G, cx + a, by - 54 + Math.abs(i - 3.5) * .6, 7, 2, i % 2 ? '#d8d8d8' : '#d85a88') } PF(G, cx - 2, by - 63, 4, 3, '#ff7aa8');
  PF(G, cx - 20, by - 22, 40, 16, '#1a1018'); PF(G, cx - 19, by - 21, 38, 14, '#9ae0f0'); PF(G, cx - 19, by - 21, 38, 3, '#c8f4ff'); PF(G, cx - 19, by - 12, 38, 2, '#ff7aa8'); PF(G, cx - 6, by - 17, 12, 4, '#fff'); PF(G, cx - 4, by - 16, 8, 2, '#ff7aa8');
  for (const [a, c] of [[-16, '#ffb0c8'], [-8, '#fff4c0'], [1, '#c89a6a'], [9, '#b8f0b0']]) { PF(G, cx + a, by - 25, 7, 4, '#c8c8d0'); PE(G, cx + a + 3.5, by - 26, 3.5, 2.5, c) }
  PF(G, cx + 15, by - 33, 4, 10, '#d8a860'); for (let i = 0; i < 4; i++) PF(G, cx + 15, by - 33 + i * 2.5, 4, 1, '#a87a3a');
  for (const d of [-13, 13]) { PE(G, cx + d, by - 4, 5, 5, '#1a1018'); PE(G, cx + d, by - 4, 3.6, 3.6, '#5a5a64'); PE(G, cx + d, by - 4, 1.4, 1.4, '#c8c8d0') }
  PF(G, cx + 20, by - 18, 8, 2, '#8a8a94');
}, x, y);

// ---------------------------------------------------------------- the shop screen: an awning, a shelf of wares with price tags, an item card, the shopkeeper's line
shopUD = function () {
  const sp = SHOPS[SHP.id], items = sp.items, x = SHP, n = items.length, cols = 3; x.t++; if (x.flash > 0) x.flash--;
  const mv = (d) => { x.sel = clamp(x.sel + d, 0, n - 1); beep(520, .03) };
  if (lf()) mv(-1); if (rt()) mv(1); if (up() && x.sel >= cols) mv(-cols); if (dn() && x.sel + cols < n) mv(cols);
  const leave = () => { SHP = null; sc = 'world'; say(sp.bye.replace(/^[^:]+: /, '')); beep(500, .05) };
  if (esc() || hit.KeyX) return leave();
  if (ok() && x.t > 6) { const id = items[x.sel], c = CONS[id];
    if (money() < c.p) { x.msg = 'Not enough money. That one\'s $' + c.p + '.'; x.mt = 0; beep(160, .2); x.shake = 8 } else { S.money -= c.p; bagAdd(id, 1); x.msg = 'Thank you! (' + c.n + ' x' + S.bag[id] + ')'; x.mt = 0; x.flash = 20; x.pop = { i: x.sel, t: 18 }; beep(880, .06); setTimeout(() => beep(1320, .06), 70) } }
  const st = STALLSTY[x.id] || {}, a1 = st.a1 || ({ bakery: '#e8a0b0', stand: '#c83a3a', camp: '#3a5a4a', icecream: '#ff7aa8', cafe: '#8ad0c4', ren: '#c83a2a' })[x.id] || '#c83a3a', a2 = st.a2 || '#f8f0e0';
  sU(); drawWorld(); sU(); r(0, 0, W, H, 'rgba(4,2,12,.72)');
  for (let i = 0; i < 21; i++) { const c = i % 2 ? a2 : a1; r(i * 16 - 8, 0, 16, 14, c); r(i * 16 - 8, 0, 16, 2, sh(c, 1.15)); r(i * 16 - 8 + 15, 0, 1, 14, sh(c, .8)); ell(i * 16, 14, 8, 4, c); ell(i * 16, 13, 8, 3, sh(c, 1.08)) } r(0, 0, W, 1, '#1a1018');
  r(92, 4, 136, 22, '#1a1018'); r(93, 5, 134, 20, '#6a4428'); r(94, 6, 132, 18, '#8a5a34'); r(94, 6, 132, 2, '#a8784a'); for (const k of [97, 220]) { r(k, 9, 3, 3, '#3a2414'); r(k, 9, 1, 1, '#c8a060') } txt(sp.nm.toUpperCase(), 160, 11, '#fff2c8', 'center', 8);
  r(246, 28, 66, 15, '#1a1018'); r(247, 29, 64, 13, '#2a2418'); ell(256, 35, 4, 4, '#ffd23c'); ell(256, 35, 2.5, 2.5, '#e8a020'); txt('$' + money(), 306, 32, '#ffe08a', 'right', 7);
  // shelf
  r(8, 30, 186, 106, '#1a1018'); r(9, 31, 184, 104, '#4a2c1a'); for (let i = 0; i < 8; i++) r(9, 38 + i * 13, 184, 1, '#3e2414'); r(9, 31, 184, 2, '#6a4428');
  const rows = Math.ceil(n / cols);
  items.forEach((id, i) => { const c = CONS[id], col = i % cols, row = i / cols | 0, sx = 14 + col * 60, sy = 36 + row * (rows > 2 ? 32 : 48), can = money() >= c.p, sel = x.sel == i, bob = sel ? Math.round(Math.sin(x.t / 8) * 1.5) : 0, pop = x.pop && x.pop.i == i && x.pop.t > 0 ? -x.pop.t / 3 : 0;
    r(sx - 2, sy + 30, 56, 4, '#1a1018'); r(sx - 1, sy + 30, 54, 3, '#8a5a34'); r(sx - 1, sy + 30, 54, 1, '#b07a44');
    if (sel) { r(sx + 4, sy - 2, 44, 34, 'rgba(255,240,180,.12)') }
    drawCons(id, sx + 10, sy + bob + pop, 2); if (!can) r(sx + 8, sy - 1, 36, 32, 'rgba(10,6,16,.55)');
    const have = (S.bag || {})[id]; if (have) { r(sx + 40, sy - 1, 11, 9, '#1a1018'); r(sx + 41, sy, 9, 7, '#3a9ac8'); txt('' + have, sx + 45.5, sy + 1, '#fff', 'center', 5) }
    r(sx + 26, sy + 31, 1, 4, '#c8b890'); r(sx + 14, sy + 35, 26, 10, '#1a1018'); r(sx + 15, sy + 36, 24, 8, can ? '#f4ecd8' : '#8a8478'); r(sx + 15, sy + 36, 24, 1, '#fff'); txt('$' + c.p, sx + 27, sy + 37, can ? '#5a2a1a' : '#4a4038', 'center', 6);
    if (sel) { const k = (x.t >> 3) & 1; for (const [a, b, w, h] of [[sx + 2 - k, sy - 4 - k, 8, 2], [sx + 2 - k, sy - 4 - k, 2, 8], [sx + 42 + k, sy - 4 - k, 8, 2], [sx + 48 + k, sy - 4 - k, 2, 8], [sx + 2 - k, sy + 26 + k, 8, 2], [sx + 2 - k, sy + 20 + k, 2, 8], [sx + 42 + k, sy + 26 + k, 8, 2], [sx + 48 + k, sy + 20 + k, 2, 8]]) r(a, b, w, h, '#fff') } });
  if (x.pop && x.pop.t > 0) x.pop.t--;
  // item card
  const cur = items[x.sel], c = CONS[cur], kx = 198 + (x.shake > 0 ? (x.shake-- & 1 ? 2 : -2) : 0);
  r(kx, 46, 114, 90, '#1a1018'); r(kx + 1, 47, 112, 88, '#f4ecd8'); r(kx + 1, 47, 112, 14, a1); r(kx + 1, 47, 112, 1, sh(a1, 1.2)); txt(c.n.toUpperCase(), kx + 57, 50, '#fff', 'center', 7);
  const tag = consTag(cur); r(kx + 6, 65, tag.length * 4 + 8, 10, c.buff ? '#3a6ac8' : c.revive ? '#c83a8a' : '#3a9a4a'); txt(tag, kx + 10, 67, '#fff', 'left', 6);
  wrapPx(c.d, 100, 6).slice(0, 5).forEach((s, i) => txt(s, kx + 7, 80 + i * 9, '#3a2a1a', 'left', 6));
  txt('OWNED  ' + ((S.bag || {})[cur] || 0), kx + 7, 126, '#7a6a5a', 'left', 6); txt('$' + c.p, kx + 107, 125, money() >= c.p ? '#3a8a3a' : '#c83a3a', 'right', 8);
  // the shopkeeper's line, typed out
  x.mt = (x.mt || 0) + 1; const msg = x.msg || '', shown = msg.slice(0, x.mt * 1.5 | 0), who = /^([^:]{1,18}): /.exec(msg);
  r(8, 140, 304, 34, '#fff'); r(9, 141, 302, 32, '#000'); if (who) { r(14, 136, who[1].length * 5 + 10, 10, '#000'); r(14, 136, who[1].length * 5 + 10, 1, '#fff'); txt(who[1], 19, 137, a1 == '#3a5a4a' ? '#9fd8b8' : sh(a1, 1.3), 'left', 6) }
  wrapPx(who ? shown.slice(who[0].length) : shown, 290, 7).slice(0, 2).forEach((s, i) => txt(s, 16, 149 + i * 11, x.flash ? '#ffe9a0' : '#fff', 'left', 7));
  txt('ARROWS choose   Z buy   X leave', 306, 166, '#666', 'right', 5);
};
