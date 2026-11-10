// ==================== v12: Mr. House (a man in a suit with a slot machine for a head) + the washroom next to his office ====================

// ---------------------------------------------------------------- Mr. House: name, portrait, voice
EN.house.n = 'Mr. House';
LK['Mr. House'] = { n: 'Mr. House', key: 'npc_mrhouse' };
PORTRAITS['npc_mrhouse:neutral'] = loadImg('assets/portraits/npc_mrhouse_neutral.png');
const MH_W = loadImg('assets/enemies/mrhouse_world.png');

// reel symbols (7x9): '#' = ink, '@' = second colour
const MHG = {
  seven: { g: ['#######', '#######', '.....##', '....##.', '...##..', '...##..', '..##...', '..##...', '..##...'], c: '#ff3333' },
  eye: { g: ['.......', '..###..', '.#####.', '##.@.##', '##@@@##', '##.@.##', '.#####.', '..###..', '.......'], c: '#202030', c2: '#ff3333' },
  cherry: { g: ['....##.', '...#...', '..#.#..', '.#...#.', '.#...#.', '@@@.@@@', '@@@.@@@', '@@@.@@@', '.......'], c: '#2a8a3a', c2: '#d81830' },
  bar: { g: ['.......', '.......', '#######', '#@@@@@#', '#######', '#@@@@@#', '#######', '.......', '.......'], c: '#202030', c2: '#ffd23c' },
  skull: { g: ['.#####.', '#######', '#@@#@@#', '#@@#@@#', '#######', '.##@##.', '.#####.', '.#.#.#.', '.......'], c: '#e8e4f0', c2: '#202030' }
};
const MH_STRIP = ['seven', 'cherry', 'bar', 'eye', 'skull', 'cherry', 'bar'];
const MH_FACES = [['eye', 'seven', 'eye'], ['seven', 'seven', 'seven'], ['eye', 'eye', 'eye'], ['skull', 'seven', 'skull'], ['eye', 'bar', 'eye']];
function mhGlyph(k, x, y, s) { const G = MHG[k]; G.g.forEach((row, j) => { for (let i = 0; i < 7; i++) { const ch = row[i]; if (ch == '#') r(x + i * s, y + j * s, s, s, G.c); else if (ch == '@') r(x + i * s, y + j * s, s, s, G.c2 || G.c) } }) }

// battle: the reels spin, settle on a face, spin again; hits make them spin wild. The marquee bulbs chase.
const _drawEnemy = drawEnemy;
drawEnemy = function (kind, x, y, s = 1, big = false, wob = true) {
  _drawEnemy(kind, x, y, s, big, wob);
  if (kind != 'house' || !big) return;
  const im = ENIMG[EN.house.spr].big; if (!ready(im)) return;
  const b = wob ? Math.round(Math.sin(tick / 9) * 3) : 0, ox = Math.round(x - Math.round(im.naturalWidth * s) / 2), oy = Math.round(y - Math.round(im.naturalHeight * s) + b);
  const P = (px, py) => [ox + px * s, oy + py * s], hurt = typeof B != 'undefined' && B && B.hurt > 0;
  const cyc = 230, ph = tick % cyc, face = MH_FACES[((tick / cyc) | 0) % MH_FACES.length];
  for (let k = 0; k < 3; k++) {
    const [rx, ry] = P(34 + k * 10, 16), stop = 70 + k * 22, spinning = hurt || ph < stop;
    r(rx, ry, 9 * s, 13 * s, '#fffff0');
    X.save(); X.beginPath(); X.rect(rx, ry, 9 * s, 13 * s); X.clip();
    if (spinning) { const off = ((tick * (hurt ? 3.2 : 1.6) + k * 17) % (MH_STRIP.length * 11)); for (let i = -1; i < MH_STRIP.length + 1; i++) { const k_ = MH_STRIP[(i + MH_STRIP.length) % MH_STRIP.length]; mhGlyph(k_, rx + s, ry + (i * 11 - off + 2) * s, s) } r(rx, ry, 9 * s, 2 * s, 'rgba(0,0,0,.18)'); r(rx, ry + 11 * s, 9 * s, 2 * s, 'rgba(0,0,0,.18)') }
    else { const settle = Math.max(0, 3 - (ph - stop)) ; mhGlyph(face[k], rx + s, ry + (2 + settle) * s, s) }
    X.restore();
  }
  for (let i = 0; i < 6; i++) { const [bx, by] = P(36 + i * 5, 6 + (i == 0 || i == 5 ? 1 : 0)); r(bx, by, 2 * s, 2 * s, ((tick >> 3) + i) % 3 == 0 ? '#fff0a0' : '#a8781c') }
  if (ph > 70 + 2 * 22 && ph < 70 + 2 * 22 + 40 && face[0] == face[1] && face[1] == face[2]) { const [jx, jy] = P(32, 14); r(jx, jy, 34 * s, 17 * s, (tick >> 2) & 1 ? 'rgba(255,240,160,.25)' : 'rgba(255,60,160,.15)') }
};

// overworld: Mr. House waits behind his desk on day 4. His reels flick now and then. After the fight the chair is empty.
OBJ.mrhouse = (x, y) => {
  if (F_('d4_house') || !ready(MH_W)) return;
  const bob = ((tick >> 5) & 1), ox = Math.round(x - MH_W.naturalWidth / 2), oy = Math.round(y - MH_W.naturalHeight + bob);
  X.imageSmoothingEnabled = false; X.drawImage(MH_W, ox, oy);
  if ((tick % 200) < 36) for (let k = 0; k < 3; k++) { r(ox + 10 + k * 3, oy + 8, 2, 4, '#fffff0'); r(ox + 10 + k * 3, oy + 8 + ((tick + k * 2) >> 1) % 4, 2, 1, '#ff3333') }
  for (let i = 0; i < 3; i++) r(ox + 10 + i * 4, oy + 2, 1, 1, ((tick >> 3) + i) % 2 ? '#fff0a0' : '#a8781c');
  if ((tick % 200) < 36) r(ox + 23, oy + 3 + Math.min(4, (tick % 200) >> 2), 1, 1, '#ffd23c');
};

EV.house = () => D([
  '|Behind the desk, a man in a pinstripe suit straightens his tie.',
  '|Where his head should be, a slot machine flickers on. Three reels spin, and stop.',
  'Mr. House:|WELCOME BACK, HITORI.',
  'Steven:scared|Back? We\'ve never been here. Hitori, we\'ve never been here, right?',
  'Mr. House:|EVERYONE WHO COMES UP HERE THINKS THEY ARE THE FIRST. PLEASE. SIT.',
  'Caroline:worried|His face... it\'s a... it\'s a slot machine.',
  'Mr. House:|I KEEP WHAT IS BET. THAT IS ALL A HOUSE DOES.',
  'Mr. House:|AND YOU, HITORI, HAVE BEEN BETTING YOUR FRIENDS FOR DAYS.',
  'Hitori:angry|...We\'re leaving. Get out of the way.',
  'Mr. House:|THE HOUSE ALWAYS WINS.',
  '|Mr. House reaches up and pulls his own lever.'], () => startBattle({ k: 'enemy', t: 'house', x: 0, y: 0, boss: 1 }));

EV.friendsvanish = () => D(['|Mr. House\'s reels slow down. Three blank faces.', '|He folds in on himself like a card table, suit and all, and the screen goes dark.', 'Caroline:worried|Hitori... why is it so quiet?', 'Steven:scared|My hands. Look at my hands. I can see the floor through them.', 'Caroline:sad|I don\'t remember why we came here. I don\'t remember... the woods. Did we have a tree?', 'Hitori:shock|We had a tree. We had a TREE. The hollow one, by the pond, you always sat on the left and-', 'Steven:sad|Hitori. Thanks for dragging us along. Really.', 'Caroline:happy|Find him, okay? Find him and tell him we said hi.', 'Hitori:shock|Wait. Wait, no, don\'t-'],
  () => { fadeFriend(0, () => {}); fadeFriend(1, () => { flag('d4_house'); S.party = [PL]; D(['|You are alone.', 'Hitori:neutral|...Okay.', 'Hitori:neutral|...Okay. The tower. Everything here keeps pointing up.']) }) });

// ---------------------------------------------------------------- the washroom
// tiny 3x5 hand-lettered font for signs and graffiti
const TF = { U: ['1.1', '1.1', '1.1', '1.1', '111'], K: ['1.1', '1.1', '11.', '1.1', '1.1'], W: ['1...1', '1...1', '1.1.1', '1.1.1', '.1.1.'], A: ['.1.', '1.1', '111', '1.1', '1.1'], S: ['.11', '1..', '.1.', '..1', '11.'],
  H: ['1.1', '1.1', '111', '1.1', '1.1'], E: ['111', '1..', '11.', '1..', '111'], R: ['11.', '1.1', '11.', '1.1', '1.1'], C: ['.11', '1..', '1..', '1..', '.11'], ' ': ['..', '..', '..', '..', '..'] };
function tinyText(G, s, x, y, c, jit) { let cx = x; [...s].forEach((ch, n) => { const g = TF[ch]; if (!g) return; const dy = jit ? [0, 1, 0, -1, 1, 0][n % 6] : 0; g.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] == '1') PF(G, cx + i, y + j + dy, 1, 1, c) }); cx += g[0].length + 1 }) }

FZ.lilac = (G, x, y) => { PF(G, x, y, 16, 16, '#aaa2d8'); PF(G, x + 1, y + 1, 14, 14, '#b6aee2'); PF(G, x + 2, y + 2, 5, 1, '#c8c2ec'); PF(G, x, y, 16, 1, '#8a82bc'); PF(G, x, y, 1, 16, '#8a82bc') };
WZ.wc = (G, x, y, h) => { PF(G, x, y, 16, h, '#34405e'); for (let j = 2; j < h - 18; j += 5) PF(G, x + ((j * 5) % 13), y + j, 3, 1, '#3e4c6e');
  PF(G, x, y + h - 18, 16, 9, '#6a4024'); PF(G, x, y + h - 18, 16, 1, '#9a6a3a'); PF(G, x, y + h - 10, 16, 1, '#4a2a14'); for (let i = 3; i < 16; i += 8) PF(G, x + i, y + h - 16, 1, 5, '#5a3418');
  PF(G, x, y + h - 9, 16, 9, '#2a3450'); PF(G, x, y + h - 2, 16, 2, '#1e2640') };

Object.assign(PROPS, {
  // the open door into the washroom, with a brass W.C. plate
  f_wcdoor: { flat: 1, w: 2, d(G, x, y) { const wy = y - 16; PF(G, x - 13, wy - 32, 26, 32, '#2a160c'); PF(G, x - 12, wy - 31, 13, 31, '#120c1a'); PF(G, x - 12, wy - 6, 13, 6, '#8a82bc'); PF(G, x - 12, wy - 6, 13, 1, '#aaa2d8'); PF(G, x - 12, wy - 31, 13, 2, '#34405e');
    PF(G, x - 12, wy - 31, 3, 31, '#7a4a28'); PF(G, x - 10, wy - 31, 1, 31, '#a8703c');
    PF(G, x + 1, wy - 31, 11, 31, '#7a4a28'); PF(G, x + 2, wy - 29, 9, 12, '#6a3e20'); PF(G, x + 2, wy - 15, 9, 12, '#6a3e20'); PF(G, x + 2, wy - 29, 9, 1, '#a8703c'); PF(G, x + 2, wy - 17, 2, 2, '#c8a040');
    PF(G, x - 6, wy - 41, 13, 8, '#8a6a20'); PF(G, x - 5, wy - 40, 11, 6, '#e8c060'); tinyText(G, 'WC', x - 4, wy - 40, '#3a2410') } },
  // a long vanity: wall mirror, counter with a sink, drawers, soap
  f_vanity: { w: 5, s: [0, 0, 5, 1], d(G, x, y) { const wy = y - 16;
    PF(G, x - 34, wy - 44, 68, 30, '#8a92a8'); PF(G, x - 33, wy - 43, 66, 28, '#c8d0e0'); PF(G, x - 31, wy - 41, 62, 24, '#6a88b0'); PF(G, x - 31, wy - 41, 62, 10, '#7a98c0');
    for (const sx of [-24, 6]) for (let i = 0; i < 14; i++) PF(G, x + sx + i, wy - 40 + i, 2, 1, 'rgba(230,240,255,.35)');
    PF(G, x - 18, wy - 30, 8, 10, '#4a5a7a'); PF(G, x - 17, wy - 33, 6, 4, '#4a5a7a');   // a vague reflection of the room
    SHD(G, x, y, 38, 4); PF(G, x - 38, y - 22, 76, 22, '#1e1008'); PF(G, x - 37, y - 21, 74, 7, '#c89060'); PF(G, x - 37, y - 21, 74, 1, '#e8b080'); PF(G, x - 37, y - 14, 74, 13, '#7a4a28');
    for (let i = 0; i < 4; i++) { const dx = x - 34 + i * 18; PF(G, dx, y - 12, 15, 9, '#6a3e20'); PF(G, dx, y - 12, 15, 1, '#9a6a3a'); PF(G, dx + 6, y - 9, 3, 1, '#c8a040') }
    PE(G, x, y - 18, 10, 3, '#8a92a8'); PE(G, x, y - 18, 9, 2.4, '#eef2f8'); PE(G, x, y - 17.5, 6, 1.4, '#b8c4d4'); PF(G, x - 1, y - 27, 2, 7, '#c8d0e0'); PF(G, x - 1, y - 27, 5, 2, '#c8d0e0'); PF(G, x + 3, y - 26, 1, 1, '#8ad0ff');
    PF(G, x + 16, y - 27, 5, 7, '#e85a9a'); PF(G, x + 17, y - 29, 3, 2, '#f4f4f4'); PF(G, x + 18, y - 31, 1, 2, '#f4f4f4'); PF(G, x - 24, y - 23, 7, 2, '#f4ecd8'); PF(G, x - 23, y - 24, 5, 1, '#fff') } },
  // two stalls: the left one open (toilet inside), the right one shut, with shoes under the door
  f_stalls: { w: 4, s: [0, -1, 4, 2], d(G, x, y) { const L = x - 32;
    for (let k = 0; k < 2; k++) { const cx = L + 16 + k * 32;
      PF(G, cx - 7, y - 42, 14, 11, '#1a1a24'); PF(G, cx - 6, y - 41, 12, 9, '#f4f6f8'); PF(G, cx - 6, y - 41, 12, 2, '#fff'); PF(G, cx + 3, y - 39, 2, 1, '#a8b0b8');
      PE(G, cx, y - 20, 7, 6, '#1a1a24'); PE(G, cx, y - 20, 6, 5, '#f4f6f8'); PE(G, cx, y - 21, 4, 3, '#c8d8e4'); PF(G, cx - 3, y - 15, 6, 6, '#1a1a24'); PF(G, cx - 2, y - 15, 4, 5, '#e8eaec'); PF(G, cx - 3, y - 31, 6, 9, '#e8eaec'); PF(G, cx - 3, y - 31, 6, 1, '#1a1a24') }
    // closed door on the right stall (short, a gap under it)
    PF(G, L + 34, y - 40, 28, 35, '#1a2234'); PF(G, L + 35, y - 39, 26, 33, '#5a6a8e'); PF(G, L + 35, y - 39, 26, 2, '#7a8aae'); PF(G, L + 37, y - 35, 22, 1, '#4a5a7a'); PF(G, L + 37, y - 12, 22, 1, '#4a5a7a');
    PF(G, L + 36, y - 24, 3, 4, '#c8d0e0'); PF(G, L + 56, y - 26, 4, 3, '#1a1a24'); PF(G, L + 57, y - 25, 2, 1, '#ff3a3a');
    PF(G, L + 40, y - 4, 7, 3, '#0e0e16'); PF(G, L + 49, y - 4, 7, 3, '#0e0e16'); PF(G, L + 41, y - 4, 3, 1, '#5a5a70'); PF(G, L + 50, y - 4, 3, 1, '#5a5a70');
    // left stall door, swung open against the partition
    PF(G, L + 3, y - 40, 7, 35, '#1a2234'); PF(G, L + 4, y - 39, 5, 33, '#4a5a7e'); PF(G, L + 4, y - 39, 1, 33, '#6a7a9e');
    // partitions and the top rail
    for (const px of [L, L + 31, L + 61]) { PF(G, px, y - 46, 3, 46, '#1a2234'); PF(G, px + 1, y - 45, 1, 44, '#8a9ac0'); PF(G, px, y - 2, 3, 2, '#a8b0c0') }
    PF(G, L, y - 47, 64, 2, '#a8b0c0'); PF(G, L, y - 45, 64, 1, '#1a2234') } },
  // the rest of the room
  f_tbrush: { s: S1, d(G, x, y) { SHD(G, x - 3, y, 5, 2); PF(G, x - 7, y - 7, 7, 7, '#1a1a24'); PF(G, x - 6, y - 6, 5, 5, '#e8eaf0'); PF(G, x - 4, y - 16, 1, 10, '#3a7ad8'); PF(G, x - 5, y - 17, 3, 2, '#3a7ad8');
    PF(G, x + 1, y - 9, 7, 9, '#1a1a24'); PF(G, x + 2, y - 8, 5, 7, '#8a92a8'); PF(G, x + 2, y - 8, 5, 1, '#a8b0c0'); PF(G, x + 3, y - 12, 3, 3, '#f4f4f4') } },
  f_flight: { flat: 1, w: 2, d(G, x, y) { const wy = y - 16; PF(G, x - 14, wy - 46, 28, 4, '#1a2234'); PF(G, x - 13, wy - 45, 26, 2, '#e8fff8'); PE(G, x, wy - 40, 22, 6, 'rgba(200,255,240,.08)') } },
  f_dryer: { flat: 1, d(G, x, y) { const wy = y - 16; PF(G, x - 6, wy - 30, 12, 10, '#1a1a24'); PF(G, x - 5, wy - 29, 10, 8, '#c8d0e0'); PF(G, x - 5, wy - 29, 10, 2, '#e8eef6'); PF(G, x - 3, wy - 21, 6, 2, '#8a92a8'); PF(G, x + 2, wy - 27, 2, 2, '#3ad06a') } },
  f_graffiti: { flat: 1, w: 3, d(G, x, y) { const wy = y - 16;
    tinyText(G, 'UKU WAS HERE', x - 22, wy - 38, '#4ad0ff', 1); PF(G, x - 22, wy - 31, 46, 1, 'rgba(74,208,255,.6)');
    for (let i = 0; i < 4; i++) PF(G, x - 18 + i * 3, wy - 27, 1, 6, '#ff5aa8'); for (let i = 0; i < 12; i++) PF(G, x - 19 + i, wy - 25 + (i >> 2), 1, 1, '#ff5aa8');
    PF(G, x + 6, wy - 26, 2, 2, '#ff5aa8'); PF(G, x + 9, wy - 26, 2, 2, '#ff5aa8'); PF(G, x + 6, wy - 24, 5, 1, '#ff5aa8'); PF(G, x + 7, wy - 23, 3, 1, '#ff5aa8'); PF(G, x + 8, wy - 22, 1, 1, '#ff5aa8');
    tinyText(G, 'SEE U', x + 14, wy - 27, '#e8e4f0', 1) } },
  f_wcpuddle: { flat: 1, z: -300, d(G, x, y) { PE(G, x, y - 7, 9, 3, 'rgba(160,200,255,.35)'); PE(G, x - 2, y - 8, 4, 1, 'rgba(255,255,255,.4)') } }
});

(() => {
  const W_ = 16, H_ = 12, Gd = Array.from({ length: H_ }, () => Array(W_).fill('.'));
  const fill = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W_ && j < H_) Gd[j][i] = c };
  fill(0, 0, W_, 3, '#'); fill(0, 0, 2, H_, '#'); fill(W_ - 2, 0, 2, H_, '#'); fill(0, 10, W_, 2, '#'); fill(7, 10, 2, 2, '.');
  const R = ROOM({ id: 'n_wc', grid: Gd.map(r => r.join('')), leg: {}, zones: [[2, 3, 12, 7, 'lilac', null], [7, 10, 2, 2, 'lilac', null]],
    feat: [...[...Array(12).keys()].map(i => p('f_wz', 2 + i, 3, { t: 'wc', hh: 48 })),
      p('f_flight', 6, 3), p('f_flight', 11, 3), p('f_towel', 2, 3, { c: '#e8e4f0' }), p('f_dryer', 3, 3), p('f_vanity', 4, 3), p('f_graffiti', 9, 3), p('f_stalls', 10, 4),
      p('f_bin', 2, 5, { c: '#3a7ad8' }), p('f_tbrush', 2, 9), p('f_bathmat', 6, 4, { c: '#5a6a9a' }), p('f_wcpuddle', 11, 7), p('f_wcpuddle', 5, 8)],
    ents: [] });
  A('n_wc', { ...CASINO, nm: 'Casino Abyss: Washroom', mus: 'inboredom', w: R.w, h: R.h, feat: R.feat, exits: [ex('down', 7, 8, 'n_vault')],
    ents: [obj('wcmirror', 6, 4, [], { ev: 'wcmirror', inv: 1 }),
      obj('sink', 5, 4, ['|You wash your hands. The water runs warm, then cold, then it smells like the sea.'], { inv: 1 }),
      obj('graffiti', 10, 3, ['|Blue marker, pressed in hard: UKU WAS HERE. Under it, four tally marks and a heart.', 'Hitori:shock|That\'s his handwriting. That\'s how he does his K.', 'Hitori:sad|...Four days. He\'s been counting.'], { inv: 1, set: 'wc_graffiti' }),
      obj('stall1', 10, 4, ['|An empty stall. The toilet paper has been folded into a little triangle, like in a hotel.'], { inv: 1 }),
      obj('stall2', 12, 4, ['|The door is locked. The little window on the lock says OCCUPIED.', '|Under the door: two polished black shoes. They haven\'t moved since you came in.'], { inv: 1 }),
      obj('bin', 2, 5, ['|Paper towels, and a crumpled betting slip. Every box is ticked.'], { inv: 1 })] });
  EV.wcmirror = () => D(F_('d4_house') ? ['|Hitori looks into the mirror.', '|The room behind her is empty. It is supposed to be empty.', 'Hitori:sad|...Okay.']
    : ['|You look into the mirror. Hitori looks back.', '|Behind her, in the reflection, the room is empty.', '|Nobody is standing next to her.', 'Hitori:scared|...', 'Hitori:neutral|It\'s just a bad mirror. Come on.']);
})();

// ---------------------------------------------------------------- hook the washroom into The House's office, and put Mr. House behind his desk
(() => {
  const V = AREAS.n_vault; delete MP.n_vault;
  V.exits = [...V.exits.filter(e => e.to != 'n_wc'), ex('up', 4, 5, 'n_wc', { deep: 6 })];
  V.feat = V.feat.map(f => f.id == 'f_wdoor' && f.x == 4 ? p('f_wcdoor', 4, 5) : f);
  V.ents = [...V.ents.filter(e => !(e.kind == 'wdoor' && e.at[0] == 4)), deco('mrhouse', 15, 9, null, { day: 4, ifnot: 'd4_house' })];
})();
