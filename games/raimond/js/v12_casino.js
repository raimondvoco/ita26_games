// ==================== v12: Casino Abyss rebuilt as one grand hall ====================
// Laid out like a classic RPG casino: a palm-lined red carpet leads in from the plaza to the cashier & prize counter
// (with wood-panelled sofa alcoves either side and corner lounges); above it a purple gaming floor with two red
// card rooms (four blackjack tables each, round a wall niche with a chandelier), a roulette wheel in the middle,
// and long slot aisles down both sides. Stairs climb the back wall to a wooden walkway, and more stairs lead up to the
// top tier: two lounges and an aquarium between the doors to the Lounge and to The House.
const bigRug = (x, y, w, h, c) => { const out = []; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out.push(p('crug', x + i, y + j, { e: (j == 0 ? 1 : 0) | (i == w - 1 ? 2 : 0) | (j == h - 1 ? 4 : 0) | (i == 0 ? 8 : 0), c, i, j, big: w > 2 && h > 2 })); return out };
const CAS = { gold: '#c8a040', goldL: '#ffe08a', goldD: '#8a6a20', red: '#9a1834', redD: '#6a0a22', redL: '#b82848', wood: '#7a4a28', woodD: '#4a2a16', woodL: '#a8703c', ink: '#140810', felt: '#1a6a4a', feltL: '#2a8a5a' };
Object.assign(PROPS, {
  // a big red carpet with a gold double border (anchored at its top-left tile)
  // one tile of a big red carpet with a gold double border; bigRug() lays a whole carpet out of these (edges: 1 top 2 right 4 bottom 8 left)
  crug: { flat: 1, z: -500, d(G, x, y, P, s, p) { const x0 = x - 8, y0 = y - 16, e = p.e || 0, c = p.c || CAS.red, big = p.big;
    PF(G, x0, y0, 16, 16, c); if ((p.i + p.j) % 2 == 0) { PF(G, x0 + 7, y0 + 7, 2, 1, sh(c, 1.18)); PF(G, x0 + 8, y0 + 8, 1, 1, sh(c, .82)) }
    const L_ = (o, col) => { if (e & 1) PF(G, x0 + (e & 8 ? o : 0), y0 + o, 16 - (e & 8 ? o : 0) - (e & 2 ? o : 0), 1, col); if (e & 4) PF(G, x0 + (e & 8 ? o : 0), y0 + 15 - o, 16 - (e & 8 ? o : 0) - (e & 2 ? o : 0), 1, col);
      if (e & 8) PF(G, x0 + o, y0 + (e & 1 ? o : 0), 1, 16 - (e & 1 ? o : 0) - (e & 4 ? o : 0), col); if (e & 2) PF(G, x0 + 15 - o, y0 + (e & 1 ? o : 0), 1, 16 - (e & 1 ? o : 0) - (e & 4 ? o : 0), col) };
    L_(0, CAS.redD); L_(1, CAS.redD); L_(3, CAS.gold); if (big) L_(6, CAS.goldD) } },
  // a turned-wood balustrade section (solid) between the top tier and the walkway
  f_rail: { s: S1, d(G, x, y) { PF(G, x - 8, y - 15, 16, 3, CAS.woodD); PF(G, x - 8, y - 15, 16, 1, CAS.woodL); PF(G, x - 8, y - 2, 16, 2, CAS.woodD); for (const bx of [-6, -1, 4]) { PF(G, x + bx, y - 12, 3, 10, CAS.wood); PF(G, x + bx, y - 12, 1, 10, CAS.woodL); PF(G, x + bx - 1, y - 8, 5, 2, CAS.woodD) } } },
  // the same balustrade, painted along the top of a wall (no collision of its own: the wall already blocks)
  f_railf: { flat: 1, d(G, x, y) { const t = y - 15; PF(G, x - 8, t, 16, 3, CAS.woodD); PF(G, x - 8, t, 16, 1, CAS.woodL); for (const bx of [-6, -1, 4]) { PF(G, x + bx, t + 3, 3, 9, CAS.wood); PF(G, x + bx, t + 3, 1, 9, CAS.woodL) } PF(G, x - 8, t + 12, 16, 2, CAS.woodD) } },
  // a flight of wooden stairs (w x h tiles from the anchor's top-left), with banisters
  f_stairs: { flat: 1, z: -400, d(G, x, y, P, s, p) { const w = (p.w || 2) * 16, h = (p.h || 3) * 16, x0 = x - 8, y0 = y - 16;
    for (let j = 0; j < h; j += 5) { PF(G, x0 + 2, y0 + j, w - 4, 5, CAS.wood); PF(G, x0 + 2, y0 + j, w - 4, 1, CAS.woodL); PF(G, x0 + 2, y0 + j + 4, w - 4, 1, CAS.woodD) }
    for (const bx of [x0, x0 + w - 3]) { PF(G, bx, y0 - 4, 3, h + 4, CAS.woodD); PF(G, bx, y0 - 4, 1, h + 4, CAS.woodL); PF(G, bx - 1, y0 - 6, 5, 3, CAS.gold) } PF(G, x0 + 4, y0 + h / 2 - 2, w - 8, 4, CAS.red) } },
  // a chandelier fixed to a wall face (the niches in the card rooms, the alcoves by the cashier)
  f_wchand: { flat: 1, w: 2, d(G, x, y, P, s, p) { const wy = WY(y), hh = p.hh || 16; PF(G, x - 11, wy - hh, 22, hh, '#0a0408'); PE(G, x, wy - hh + 3, 16, 9, 'rgba(255,214,140,.12)');
    PF(G, x - 1, wy - hh, 2, 4, CAS.gold); PF(G, x - 7, wy - hh + 4, 14, 2, CAS.gold); PF(G, x - 4, wy - hh + 6, 8, 2, CAS.goldD); for (const cx of [-7, -2, 3, 7]) { PF(G, cx + x - 1, wy - hh + 1, 2, 3, '#fff6d0'); PF(G, cx + x - 1, wy - hh + 4, 2, 1, CAS.goldD) }
    for (let i = 0; i < 4; i++) PF(G, x - 5 + i * 3, wy - hh + 8, 1, 2, '#e8f6ff') } },
  // a round porthole looking into deep water
  f_porthole: { flat: 1, d(G, x, y) { const wy = WY(y), cy = wy - 18; PE(G, x, cy, 9, 9, CAS.goldD); PE(G, x, cy, 8, 8, CAS.gold); PE(G, x, cy, 6, 6, '#0a2a5a'); PE(G, x - 1, cy - 1, 5, 5, '#14407a'); PF(G, x - 3, cy - 4, 2, 2, '#8ad0ff'); PF(G, x + 2, cy + 1, 1, 1, '#c8f0ff'); PF(G, x - 1, cy + 3, 1, 1, '#c8f0ff');
    for (const a of [0, 1.57, 3.14, 4.71]) PF(G, x + Math.cos(a) * 8 - .5, cy + Math.sin(a) * 8 - .5, 1, 1, CAS.goldL) } },
  // a doorway set into the back wall, with a brass name plate
  f_doorway: { flat: 1, w: 2, d(G, x, y, P, s, p) { const wy = WY(y); PF(G, x - 16, wy - 34, 32, 34, CAS.woodD); PF(G, x - 14, wy - 31, 28, 31, '#0a0408'); PF(G, x - 16, wy - 36, 32, 4, CAS.gold); PF(G, x - 16, wy - 36, 32, 1, CAS.goldL);
    PF(G, x - 13, wy - 30, 26, 2, '#1a0a12'); PF(G, x - 13, wy - 4, 26, 4, CAS.redD); PF(G, x - 12, wy - 48, 24, 9, CAS.ink); PF(G, x - 11, wy - 47, 22, 7, '#2a1420'); G.save(); G.font = 'bold 5px monospace'; G.textAlign = 'center'; G.fillStyle = CAS.goldL; G.fillText(p.t || '', x, wy - 42); G.restore() } },
  // the big aquarium between the two doors upstairs
  f_aquarium: { w: 4, s: [0, 0, 4, 1], d(G, x, y) { SHD(G, x, y, 32, 4); PF(G, x - 32, y - 46, 64, 46, CAS.ink); PF(G, x - 31, y - 12, 62, 12, CAS.wood); PF(G, x - 31, y - 12, 62, 1, CAS.woodL); PF(G, x - 30, y - 44, 60, 31, '#0e4a6a');
    PF(G, x - 30, y - 44, 60, 4, '#1a6a8a'); PF(G, x - 30, y - 17, 60, 4, '#c8b07a'); for (let i = 0; i < 9; i++) PF(G, x - 27 + i * 7, y - 18 - (i % 3) * 2, 2, 3 + (i % 3) * 2, i % 2 ? '#3a9a5a' : '#2a7a4a');
    for (const [fx, fy, c] of [[-16, -32, '#ff8a3a'], [6, -36, '#ffd23c'], [16, -26, '#ff5a8a'], [-6, -24, '#5ae8ff']]) { PF(G, x + fx, y + fy, 5, 3, c); PF(G, x + fx - 2, y + fy + 1, 2, 1, c); PF(G, x + fx + 3, y + fy, 1, 1, CAS.ink) }
    for (const [bx, by] of [[-22, -38], [-21, -30], [12, -40], [24, -34]]) PF(G, x + bx, y + by, 1, 1, '#c8f0ff'); PF(G, x - 30, y - 44, 2, 31, 'rgba(255,255,255,.18)'); PF(G, x - 33, y - 48, 66, 3, CAS.gold) } },
  // a half-moon blackjack table with three stools on the players' side
  f_bjtable: { w: 3, s: [0, -1, 3, 2], d(G, x, y) { SHD(G, x, y, 24, 5); PF(G, x - 21, y - 24, 42, 4, CAS.woodD); PE(G, x, y - 20, 22, 11, CAS.woodD); PE(G, x, y - 21, 20, 9, CAS.felt); PF(G, x - 21, y - 30, 42, 9, CAS.woodD); PF(G, x - 20, y - 29, 40, 8, CAS.felt);
    PF(G, x - 20, y - 29, 40, 1, CAS.feltL); PE(G, x, y - 21, 14, 5, 'rgba(255,255,255,.08)'); for (let i = 0; i < 4; i++) { PF(G, x - 12 + i * 7, y - 26, 4, 5, '#f4f0f4'); PF(G, x - 11 + i * 7, y - 24, 2, 1, i % 2 ? '#c81830' : CAS.ink) }
    PF(G, x - 3, y - 18, 6, 2, CAS.gold); for (const sx of [-14, 0, 14]) { PF(G, x + sx - 1, y - 6, 2, 6, CAS.woodD); PE(G, x + sx, y - 6, 4, 2, CAS.redD); PE(G, x + sx, y - 7, 4, 1.5, CAS.redL) } } },
  // a pool table in the upstairs lounge
  f_pool: { w: 3, s: [0, -1, 3, 2], d(G, x, y) { SHD(G, x, y, 24, 5); PF(G, x - 22, y - 26, 44, 22, CAS.woodD); PF(G, x - 20, y - 24, 40, 18, CAS.felt); PF(G, x - 20, y - 24, 40, 1, CAS.feltL); for (const [a, b] of [[-20, -24], [18, -24], [-20, -8], [18, -8], [-1, -24], [-1, -8]]) PF(G, x + a, y + b, 2, 2, CAS.ink);
    for (const [a, b, c] of [[-8, -16, '#f4f0f4'], [6, -18, '#c81830'], [8, -15, '#ffd23c'], [10, -18, '#3a6ad0'], [9, -13, CAS.ink]]) PF(G, x + a, y + b, 2, 2, c); PF(G, x - 18, y - 4, 2, 4, CAS.woodD); PF(G, x + 16, y - 4, 2, 4, CAS.woodD); for (let i = 0; i < 18; i++) PF(G, x - 16 + i, y - 12 - i * .3, 1, 1, '#d8b080') } },
});

(() => {
  const W_ = 48, H_ = 48, Gd = Array.from({ length: H_ }, () => Array(W_).fill('.'));
  const fill = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W_ && j < H_) Gd[j][i] = c };
  fill(0, 0, W_, 4, '#'); fill(20, 2, 2, 2, '.'); fill(24, 2, 2, 2, '.'); fill(27, 2, 2, 2, '.'); fill(0, 0, 2, H_, '#'); fill(W_ - 2, 0, 2, H_, '#'); fill(0, 40, W_, 8, '#'); fill(21, 40, 6, 6, '.');   // shell + the entrance corridor
  for (let x = 2; x < 46; x++) if (!(x >= 20 && x <= 21) && !(x >= 27 && x <= 28)) Gd[9][x] = 'r';                         // balustrade, gaps for the stairs
  fill(8, 12, 32, 3, '#'); fill(10, 12, 2, 3, '.'); fill(36, 12, 2, 3, '.');                                             // the gaming floor's back wall, stairs through it
  for (const [x, y] of [[14, 17], [14, 23], [32, 17], [32, 23]]) fill(x, y, 2, 2, '#');                                  // chandelier niches in the card rooms
  fill(12, 30, 24, 3, '#'); fill(18, 33, 1, 2, '#'); fill(29, 33, 1, 2, '#');                                            // cashier block and its alcove dividers
  const R = ROOM({ id: 'n_casino', grid: Gd.map(r => r.join('')), leg: { r: ['f_rail'] },
    zones: [[12, 33, 24, 3, 'board', 'wood'], [2, 4, 44, 8, 'board', 'wood'], [21, 40, 6, 6, 'carpet', null, '#3e2058'], [2, 12, 44, 28, 'carpet', 'wood', '#3e2058']],
    feat: [
      // ---- top tier: doors with the aquarium between them, two lounges
      p('f_doorway', 20, 4, { t: 'LOUNGE' }), p('f_doorway', 24, 4, { t: 'STAFF' }), p('f_doorway', 27, 4, { t: 'THE HOUSE' }), p('f_painting', 22, 4, { c: '#4a1a3a' }), ...bigRug(24, 4, 2, 2), ...ps('f_sconce', [[19, 4], [29, 4]]),
      ...bigRug(20, 4, 2, 4), ...bigRug(27, 4, 2, 4), p('f_stairs', 20, 8, { w: 2, h: 2 }), p('f_stairs', 27, 8, { w: 2, h: 2 }),
      ...bigRug(3, 5, 14, 4), ...ps('f_porthole', [[5, 4], [14, 4]]), p('f_aquarium', 8, 4), p('f_pool', 8, 7), p('sofa2', 3, 7), ...ps('cocktail', [[14, 7]]), ...ps('gplant', [[2, 4], [17, 4]]), p('flamp', 12, 5),
      ...bigRug(31, 5, 14, 4), ...ps('f_porthole', [[33, 4], [42, 4]]), p('f_painting', 37, 4, { c: '#6a2a6a' }), p('cardtable', 36, 7), p('sofa2', 42, 7), ...ps('cocktail', [[32, 7]]), ...ps('gplant', [[30, 4], [45, 4]]), p('flamp', 40, 5),
      // ---- the walkway and the back wall of the gaming floor
      ...[...Array(32).keys()].map(i => 8 + i).filter(x => !(x >= 10 && x <= 11) && !(x >= 36 && x <= 37)).map(x => p('f_railf', x, 12)),
      p('f_stairs', 10, 12, { w: 2, h: 3 }), p('f_stairs', 36, 12, { w: 2, h: 3 }), ...ps('f_painting', [[15, 15], [21, 15], [26, 15], [31, 15]]), ...ps('f_sconce', [[13, 15], [19, 15], [24, 15], [29, 15], [34, 15]]),
      // ---- gaming floor: slot aisles, two card rooms, roulette in the middle
      ...bigRug(4, 13, 2, 17), ...bigRug(42, 13, 2, 17),
      ...bigRug(10, 16, 10, 13), ...bigRug(28, 16, 10, 13), ...ps('f_bjtable', [[11, 19], [16, 19], [11, 26], [16, 26], [29, 19], [34, 19], [29, 26], [34, 26]]),
      ...[[14, 19], [14, 25], [32, 19], [32, 25]].map(([x, y]) => p('f_wchand', x, y)),
      ...bigRug(22, 18, 4, 5), p('roulette', 23, 21), ...ps('flamp', [[8, 15], [39, 15], [2, 30], [45, 30], [10, 31], [37, 31]]),
      // ---- cashier & prize counter between two sofa alcoves
      p('prizeshelf', 19, 33), p('cashier', 24, 34), p('vrope', 19, 36), p('vrope', 27, 36), p('f_wchand', 14, 33, { hh: 32 }), p('f_wchand', 32, 33, { hh: 32 }),
      p('sofa2', 13, 35), p('sofa2', 31, 35), ...ps('flamp', [[12, 34], [17, 34], [30, 34], [35, 34]]),
      // ---- corner lounges and the palm-lined entrance
      ...bigRug(2, 35, 9, 5), ...bigRug(37, 35, 9, 5), ...ps('cocktail', [[4, 37], [8, 37], [39, 37], [43, 37]]), ...ps('gplant', [[2, 39], [10, 39], [37, 39], [45, 39]]),
      ...bigRug(22, 40, 4, 6), ...ps('gplant', [[21, 41], [26, 41], [21, 44], [26, 44]])] });
  const slots = [];
  for (const x of [2, 7, 40, 45]) for (const y of [15, 18, 21, 24, 27]) slots.push(obj('slotm', x, y, [], { ev: 'slots', solid: [0, 0, 1, 1] }));
  A('n_casino', { ...CASINO, nm: 'Casino Abyss', w: R.w, h: R.h, feat: R.feat,
    exits: [ex('down', 23, 24, 'n_plaza'), ex('up', 20, 21, 'n_lounge', { deep: 4 }), ex('up', 27, 28, 'n_vault', { deep: 4 }), ex('up', 24, 25, 'n_backroom', { deep: 4 })],
    ents: [...slots, ...R.ents, npc('chips', 25, 24), npc('pearl', 21, 35, { reach: 30 }), npc('rex', 41, 38), npc('gus', 13, 22), npc('fay', 34, 22),
      obj('cashier', 25, 35, [], { ev: 'cashier', inv: 1 }), obj('cardtable', 17, 27, ['|A card table. Five chairs, four hands dealt, one empty.'], { inv: 1 }), obj('roulette', 23, 22, ['|The wheel spins by itself. It always lands on six.'], { inv: 1 }),
      obj('pool', 9, 8, ['|Someone left a game half-finished. The eight ball is already sunk.', 'Hitori:neutral|...So somebody lost before they started.'], { inv: 1 }),
      obj('fish', 10, 5, ['|Four fish circle the tank. They never come close to each other, and they never leave each other either.'], { inv: 1 }),
      en('glitch', 20, 28, 2, 2), en('static', 27, 29, 2, 2), chest('c:n_casino', 44, 38, { snacks: 3 })] });
  // the side rooms now open off the top tier
  AREAS.n_lounge.exits = [ex('right', 8, 9, 'n_casino')]; AREAS.n_vault.exits = [ex('down', 14, 15, 'n_casino')];
  delete AREAS.n_floor;
  const _en = enter; enter = function (id, from, xy) { if (id == 'n_floor') { id = 'n_casino'; xy = xy || [24, 24] } if (from == 'n_floor') from = 'n_casino'; return _en(id, from, xy) };
  if (typeof QUESTS != 'undefined') for (const q of QUESTS) for (const s of q.steps || []) if (typeof s[0] == 'string') s[0] = s[0].replace('(Casino Abyss: the floor upstairs)', '(Casino Abyss: the slot aisles)');
})();
