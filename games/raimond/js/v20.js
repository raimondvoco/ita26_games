// ==================== v20: people playing in the casino, the staff back room, and an old computer ====================

// ---------------------------------------------------------------- the gamblers
const GAMB = { dolly: 'Dolly', penny: 'Penny', mags: 'Mags', oz: 'Oz', tobi: 'Tobi', june: 'June', ace: 'Ace', velma: 'Velma', sid: 'Sid', bo: 'Dealer Bo', lulu: 'Dealer Lulu' };
for (const [id, n] of Object.entries(GAMB)) {
  const c = ND[id] = { n, key: 'npc_' + id }; loadSheet(c.key); LK[n] = c;
  for (const emo of ['neutral', 'happy', 'laugh', 'sad', 'angry', 'shock', 'scared', 'worried', 'blush', 'dark', 'smug']) PORTRAITS[c.key + ':' + emo] = loadImg('assets/portraits_cut/' + c.key + '_' + PFILE(emo, c.key) + '.png');
}
const GLINES = {
  dolly: ['Dolly:happy|Shh, shh. This one is warm. I can feel it.', 'Dolly:neutral|My husband played this exact machine. Then he went home. I think. I keep meaning to check.'],
  penny: ['Penny:neutral|Forty years on the night shift, and now I spend the nights here. Feels about the same.', 'Penny:angry|Don\'t stand behind me. You\'re standing in my luck.'],
  mags: ['Mags:happy|Three cherries! ...Two cherries and a bell. It still counts if you believe it.'],
  oz: ['Oz:neutral|I\'m not playing. I\'m keeping this seat warm for a friend.', 'Oz:sad|He\'s been gone a while.'],
  tobi: ['Tobi:happy|I figured out the pattern! It\'s... uh. It was here a second ago.'],
  june: ['June:neutral|Every time I win, the lights get a little brighter.', 'June:worried|...Every time I lose, I forget something small. Last week it was my middle name.'],
  ace: ['Ace:happy|Twenty-one. Again. The cards like me.', 'Ace:neutral|I\'ve never seen them deal anything higher than a six, though.'],
  sid: ['Sid:neutral|Hit me.', '|He doesn\'t look up. His cards are blank on both sides.'],
  bo: ['Dealer Bo:neutral|Place your bets. House rules: the House doesn\'t lose, and the House doesn\'t explain.'],
  velma: ['Velma:neutral|Darling, sit down or move along. You\'re making my hand nervous.'],
  lulu: ['Dealer Lulu:happy|New deck, new night! It\'s always a new night here.']
};
for (const id in GLINES) NPC_DLG[id] = () => [GLINES[id], null];
(() => {
  const C0 = AREAS.n_casino, g = (id, x, y, dir, play, o = {}) => npc(id, x, y, { dir, play, ph: (x * 37 + y * 53) % 240, ...o });
  C0.ents.push(
    g('dolly', 2, 16, 3, 'slot'), g('penny', 7, 22, 3, 'slot'), g('tobi', 7, 28, 3, 'slot'), g('june', 45, 16, 3, 'slot'), g('mags', 40, 19, 3, 'slot'), g('oz', 45, 25, 3, 'slot'),
    g('bo', 12, 17, 0, 'deal'), g('ace', 11, 20, 3, 'card', { dl: [12, 17] }), g('sid', 13, 20, 3, 'card', { dl: [12, 17] }),
    g('lulu', 30, 24, 0, 'deal'), g('velma', 29, 27, 3, 'card', { dl: [30, 24] }));
  delete MP.n_casino;
})();
// what they're doing: slot players pull, sometimes win (coins and a WIN!), sometimes sigh; card players get dealt to and push chips
const _xd20 = XDRAW;
XDRAW = function (L, cx, cy, ox, oy) {
  if (_xd20) _xd20(L, cx, cy, ox, oy);
  if (S.a != 'n_casino') return;
  const SX = v => Math.round(v - cx + ox), SY = v => Math.round(v - cy + oy);
  for (const e of E) {
    if (e.k != 'npc' || !e.play) continue;
    const T0 = tick + (e.ph || 0), x = SX(e.x), y = SY(e.y);
    if (e.play == 'slot') {
      const P = 260, t = T0 % P, cyc = Math.floor(T0 / P), win = (cyc + e.ph) % 4 == 0;
      L.push({ y: e.y + 1, f: () => {
        if (t < 10) { r(x + 7, y - 24 + (t < 5 ? t : 10 - t), 3, 3, '#f4d0b0') }   // a hand reaching for the lever
        if (t > 40 && t < 50) for (let i = 0; i < 3; i++) r(x - 6 + i * 5, y - 44 - (t - 40), 3, 3, ['#ff3333', '#ffd23c', '#3ad06a'][(i + cyc) % 3]);
        if (win && t > 50 && t < 120) { const k = t - 50; for (let i = 0; i < 6; i++) { const a = i * 1.05 + cyc, px = x + Math.cos(a) * k * .45, py = y - 40 - Math.sin(a * 1.7) * 10 - k * .5 + k * k * .006; r(px, py, 3, 3, '#ffd23c'); r(px, py, 1, 1, '#fff8c0') }
          if ((k >> 3) & 1 || k > 40) { r(x - 15, y - 76, 30, 13, '#1a0a14'); r(x - 14, y - 75, 28, 11, '#ffd23c'); txt('WIN!', x / 2, (y - 74) / 2, '#a8101c', 'center', 4.5) } }
        else if (!win && cyc % 3 == 1 && t > 60 && t < 120) { r(x - 10, y - 70, 20, 11, '#fff'); r(x - 9, y - 69, 18, 9, '#2a2030'); txt('...', x / 2, (y - 69) / 2, '#fff', 'center', 4.5) }
      } });
    } else if (e.play == 'card' && e.dl) {
      const P = 300, t = T0 % P, dx = SX(e.dl[0] * 16 + 8), dy = SY(e.dl[1] * 16 + 14) - 8;
      L.push({ y: e.y + 2, f: () => {
        if (t < 26) { const q = t / 26, px = dx + (x - dx) * q, py = dy - 6 + (y - 30 - dy + 6) * q - Math.sin(q * Math.PI) * 10; r(px - 3, py - 4, 7, 9, '#1a1018'); r(px - 2, py - 3, 5, 7, (t >> 2) & 1 ? '#f4f0e8' : '#c81830') }
        if (t > 140 && t < 170) { const q = Math.min(1, (t - 140) / 14); for (let i = 0; i < 3; i++) { r(x - 4, y - 30 - q * 8 - i * 2, 8, 2, ['#c81830', '#2a6ad8', '#f4f0e8'][i]); r(x - 4, y - 31 - q * 8 - i * 2, 8, 1, '#1a1018') } }
        if (t > 180 && t < 230 && (Math.floor(T0 / P) % 2)) { r(x - 12, y - 66, 24, 11, '#fff'); r(x - 11, y - 65, 22, 9, '#2a2030'); txt('HIT.', x / 2, (y - 65) / 2, '#fff', 'center', 4.5) }
      } });
    }
  }
};

// ---------------------------------------------------------------- the staff back room: planks, purple-hooped barrels, a glowing hole in the wall
FZ.wboard = (G, x, y) => { PF(G, x, y, 16, 16, '#b8783a'); for (let i = 0; i < 4; i++) { PF(G, x, y + i * 4 + 3, 16, 1, '#9a5e28'); PF(G, x + (((y >> 2) + i) * 7) % 16, y + i * 4, 1, 3, '#9a5e28'); PF(G, x + (((y >> 2) + i) * 11 + 5) % 16, y + i * 4 + 1, 3, 1, '#c88a48') } };
WZ.plankd = (G, x, y, h) => { PF(G, x, y, 16, h, '#7a4a2a'); for (let j = 0; j < h; j += 6) { PF(G, x, y + j, 16, 1, '#5a3218'); PF(G, x + ((j * 3) % 13), y + j + 2, 4, 1, '#8a5a34') }
  if (((x >> 4) % 4) == 0) { PF(G, x + 2, y, 6, h, '#9a6a44'); PF(G, x + 2, y, 1, h, '#b8845a'); PF(G, x + 7, y, 1, h, '#6a3e20') }
  PF(G, x, y + h - 8, 16, 8, '#5a3218'); PF(G, x, y + h - 8, 16, 1, '#8a5a34') };
Object.assign(PROPS, {
  f_barrelp: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 3); PF(G, x - 8, y - 24, 16, 24, '#2a160c'); PF(G, x - 7, y - 23, 14, 22, '#c8945a'); for (const dx of [-4, 0, 4]) PF(G, x + dx, y - 23, 1, 22, '#a8743e'); PF(G, x - 7, y - 23, 3, 22, '#d8aa70');
    for (const yy of [-21, -6]) { PF(G, x - 8, y + yy, 16, 3, '#4a2a8a'); PF(G, x - 8, y + yy, 16, 1, '#8a6ad8'); PF(G, x + 5, y + yy + 1, 2, 1, '#c8b8f4') } PF(G, x - 7, y - 25, 14, 3, '#3a2010'); PF(G, x - 6, y - 25, 12, 1, '#7a4a28') } },
  f_cooler: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 6, y - 22, 12, 22, '#1a1a24'); PF(G, x - 5, y - 21, 10, 20, '#a8b0c0'); PF(G, x - 5, y - 21, 2, 20, '#c8d0e0'); PF(G, x - 3, y - 14, 6, 3, '#3a3a48'); PF(G, x - 1, y - 12, 2, 2, '#4a8ad8');
    PE(G, x, y - 30, 6, 8, '#1a1a24'); PE(G, x, y - 30, 5, 7, '#ff9ac0'); PE(G, x - 2, y - 33, 2, 3, '#ffd0e0'); PF(G, x - 2, y - 23, 4, 2, '#5a6a8a') } },
  f_crtdesk: { w: 2, s: [0, 0, 2, 1], d(G, x, y) { SHD(G, x, y, 16, 4); PF(G, x - 15, y - 14, 30, 14, '#2a160c'); PF(G, x - 14, y - 13, 28, 4, '#a8703c'); PF(G, x - 14, y - 9, 28, 9, '#7a4a28'); PF(G, x + 4, y - 7, 8, 5, '#6a3e20'); PF(G, x + 7, y - 5, 2, 1, '#c8a040');
    PF(G, x - 11, y - 34, 20, 20, '#1a1a1a'); PF(G, x - 10, y - 33, 18, 18, '#e4dcc8'); PF(G, x - 8, y - 31, 14, 11, '#1a1a1a'); PF(G, x - 7, y - 30, 12, 9, '#3a8ae8'); PF(G, x - 7, y - 24, 12, 3, '#4ab03a'); PF(G, x - 7, y - 21, 12, 1, '#2458d0'); PF(G, x - 7, y - 21, 3, 1, '#3aa03a');
    PF(G, x - 4, y - 15, 6, 2, '#c8c0a8'); PF(G, x - 10, y - 13, 16, 2, '#d8d0b8'); PF(G, x + 10, y - 30, 4, 17, '#1a1a1a'); PF(G, x + 11, y - 29, 2, 15, '#d8d0b8'); PF(G, x + 11, y - 26, 2, 1, '#3ad06a') } },
  f_hole: { flat: 1, w: 2, d(G, x, y) { const wy = y - 16;
    G.fillStyle = '#060304'; G.beginPath(); G.moveTo(x - 16, wy); const pts = [[-16, -14], [-13, -22], [-14, -30], [-8, -34], [-5, -41], [0, -37], [4, -43], [8, -35], [13, -31], [12, -24], [16, -18], [16, 0]];
    for (const [a, b] of pts) G.lineTo(x + a, wy + b); G.closePath(); G.fill();
    for (let i = 0; i < 6; i++) PF(G, x - 14 + i * 5, wy - 4 - (i % 2) * 2, 4, 4, ['#ff8a2a', '#ffb04a', '#e85a1a'][i % 3]); PF(G, x - 15, wy - 2, 30, 2, '#ffb04a') } },
  f_glow: { flat: 1, z: -300, d(G, x, y) { for (let i = 6; i > 0; i--) PE(G, x, y - 10 + i, 10 + i * 6, 3 + i * 2.2, 'rgba(255,150,60,' + (.06 + (6 - i) * .03).toFixed(2) + ')') } }
});
OBJ.holefx = (x, y) => { const f = .5 + Math.sin(tick / 7) * .15 + Math.sin(tick / 3.1) * .05; ell(x, y - 22, 16, 10, 'rgba(255,140,40,' + (f * .35).toFixed(2) + ')');
  for (let i = 0; i < 4; i++) { const t = (tick * .35 + i * 9) % 30, bx = x - 4 + Math.sin(t / 9 + i) * 6 + (i % 2) * 6, by = y - 44 - t; if (t < 28) { const rr = 2 + (i % 2); X.strokeStyle = 'rgba(140,200,255,' + (1 - t / 30).toFixed(2) + ')'; X.lineWidth = 1; X.beginPath(); X.arc(bx, by, rr, 0, 7); X.stroke() } } };
(() => {
  const W_ = 18, H_ = 14, Gd = Array.from({ length: H_ }, () => Array(W_).fill('.'));
  const fill = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W_ && j < H_) Gd[j][i] = c };
  fill(0, 0, W_, 3, '#'); fill(0, 0, 2, H_, '#'); fill(W_ - 2, 0, 2, H_, '#'); fill(0, 12, W_, 2, '#'); fill(8, 12, 2, 2, '.');
  const R = ROOM({ id: 'n_backroom', grid: Gd.map(r => r.join('')), leg: {}, zones: [[2, 3, 14, 9, 'wboard', null], [8, 12, 2, 2, 'wboard', null]],
    feat: [...[...Array(14).keys()].map(i => p('f_wz', 2 + i, 3, { t: 'plankd', hh: 48 })), p('f_hole', 8, 3), p('f_glow', 8.5, 5),
      ...ps('f_barrelp', [[2, 3], [4, 3], [15, 5], [2, 11], [13, 11], [15, 11]]), p('f_cooler', 2, 6), p('f_crtdesk', 11, 3)],
    ents: [] });
  A('n_backroom', { ...CASINO, nm: 'Casino Abyss: Staff Only', mus: 'inboredom', w: R.w, h: R.h, feat: R.feat, exits: [ex('down', 8, 9, 'n_casino')],
    ents: [deco('holefx', 8.5, 3, null), obj('hole', 9, 4, ['|A hole in the wall, scorched around the edges. It\'s warm. Something on the other side is boiling, very slowly.', 'Hitori:neutral|...I\'m not putting my hand in there.'], { inv: 1 }),
      obj('xp', 12, 4, [], { ev: 'xp', inv: 1 }), obj('cooler', 2, 7, ['|A water cooler. The water inside is pink, and it gurgles when nobody is near it.'], { inv: 1 }),
      obj('barrel', 3, 4, ['|Barrels stamped HOUSE. Something sloshes inside. It sloshes back a second too late.'], { inv: 1 })] });
})();

// ---------------------------------------------------------------- the computer: an old desktop, nothing on it but one picture
const XPIMG = loadImg('assets/misc/img_4174.png');
let XP = null, XPBLISS = null, XPMOUSE = { x: 0, y: 0, moved: 0, click: 0 };
C.addEventListener('mousemove', e => { if (sc != 'xp') return; const d = window.devicePixelRatio || 1; XPMOUSE.x = e.offsetX * d / (U / 2); XPMOUSE.y = e.offsetY * d / (U / 2); XPMOUSE.moved = 1 });
C.addEventListener('mousedown', e => { if (sc == 'xp') { XPMOUSE.click = 1; e.preventDefault() } });
EV.xp = () => { XP = { mx: 320, my: 180, start: 0, wins: [], balloon: 1, sel: null, t: 0, off: 0, held: 0, idle: 0, ss: null, offdlg: 0 }; sc = 'xp'; beep(660, .08); beep(880, .12) };
const TB = 334, TBH = 26;          // the taskbar: y and height (the desktop is 640 x 334 above it)
const XFONT = 'Tahoma, Verdana, "DejaVu Sans", sans-serif', TFONT = '"Trebuchet MS", Tahoma, "DejaVu Sans", sans-serif';

// ---- the wallpaper: a green hill under a blue sky with soft clouds, painted once
function blissBg() {
  if (XPBLISS) return XPBLISS; const cv = document.createElement('canvas'); cv.width = 640; cv.height = TB; const g = cv.getContext('2d');
  let sd = 11; const rn = () => (sd = sd * 16807 % 2147483647) / 2147483647;
  let gr = g.createLinearGradient(0, 0, 0, 240); gr.addColorStop(0, '#0b46c4'); gr.addColorStop(.3, '#2468dc'); gr.addColorStop(.7, '#62a0ec'); gr.addColorStop(1, '#bcd8f6'); g.fillStyle = gr; g.fillRect(0, 0, 640, TB);
  // cloud banks: many soft puffs, flatter and denser near the horizon, with a wispy streak over the top
  const puff = (x, y, rx, a) => { const rg = g.createRadialGradient(x, y, 0, x, y, rx); rg.addColorStop(0, 'rgba(255,255,255,' + a + ')'); rg.addColorStop(.55, 'rgba(250,252,255,' + a * .6 + ')'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(x, y, rx, rx * .42, 0, 0, 7); g.fill() };
  for (const [cx, cy, n, s] of [[70, 50, 14, 1.2], [250, 34, 10, .9], [430, 60, 16, 1.3], [600, 40, 9, 1], [160, 125, 12, 1], [360, 140, 14, 1.1], [540, 128, 12, 1], [20, 150, 8, .9], [300, 190, 10, .9], [520, 190, 9, .8]])
    for (let i = 0; i < n; i++) puff(cx + (rn() - .5) * 110 * s, cy + (rn() - .5) * 26 * s, (10 + rn() * 26) * s, .35 + rn() * .45);
  gr = g.createLinearGradient(0, 180, 0, 245); gr.addColorStop(0, 'rgba(225,238,252,0)'); gr.addColorStop(1, 'rgba(225,238,252,.55)'); g.fillStyle = gr; g.fillRect(0, 180, 640, 70);
  // the far hill on the right, hazier
  g.beginPath(); g.moveTo(300, 260); g.bezierCurveTo(400, 226, 520, 212, 640, 218); g.lineTo(640, TB); g.lineTo(300, TB); g.closePath();
  gr = g.createLinearGradient(0, 212, 0, 270); gr.addColorStop(0, '#8fc65a'); gr.addColorStop(1, '#4e9a2a'); g.fillStyle = gr; g.fill();
  // the main hill
  const hill = new Path2D(); hill.moveTo(0, 236); hill.bezierCurveTo(90, 198, 210, 182, 300, 196); hill.bezierCurveTo(400, 210, 520, 250, 640, 262); hill.lineTo(640, TB); hill.lineTo(0, TB); hill.closePath();
  gr = g.createLinearGradient(0, 182, 0, TB); gr.addColorStop(0, '#8ed04e'); gr.addColorStop(.25, '#5cae2a'); gr.addColorStop(.6, '#3a8c18'); gr.addColorStop(1, '#246c0c'); g.fillStyle = gr; g.fill(hill);
  g.save(); g.clip(hill);
  let rg = g.createRadialGradient(170, 190, 10, 170, 190, 260); rg.addColorStop(0, 'rgba(230,255,150,.45)'); rg.addColorStop(1, 'rgba(230,255,150,0)'); g.fillStyle = rg; g.fillRect(0, 170, 640, 170);
  rg = g.createRadialGradient(560, 340, 10, 560, 340, 240); rg.addColorStop(0, 'rgba(10,50,0,.45)'); rg.addColorStop(1, 'rgba(10,50,0,0)'); g.fillStyle = rg; g.fillRect(0, 170, 640, 170);
  for (let i = 0; i < 7000; i++) { const x = rn() * 640, y = 180 + rn() * 160; g.fillStyle = rn() < .5 ? 'rgba(190,240,110,.25)' : 'rgba(20,70,5,.25)'; g.fillRect(x | 0, y | 0, 1, 1 + (rn() * 2 | 0)) }
  g.restore();
  g.strokeStyle = 'rgba(210,250,150,.5)'; g.lineWidth = 1; g.stroke(hill);
  return XPBLISS = cv;
}
// ---- drawing helpers (world layer: 640 x 360)
const xr = (x, y, w, h, c) => { X.fillStyle = c; X.fillRect(x, y, w, h) };
function xgrad(y, h, stops, x, w, horiz) { const g = horiz ? X.createLinearGradient(x, 0, x + w, 0) : X.createLinearGradient(0, y, 0, y + h); stops.forEach((c, i) => Array.isArray(c) ? g.addColorStop(c[0], c[1]) : g.addColorStop(i / (stops.length - 1), c)); return g }
function xg(x, y, w, h, stops, horiz) { X.fillStyle = xgrad(y, h, stops, x, w, horiz); X.fillRect(x, y, w, h) }
function xt(s, x, y, c = '#000', px = 9, bold = false, al = 'left', shadow = null, italic = false, font = XFONT) { X.save(); X.font = (italic ? 'italic ' : '') + (bold ? 'bold ' : '') + px + 'px ' + font; X.textAlign = al; X.textBaseline = 'top';
  if (shadow) { X.fillStyle = shadow; X.fillText(s, x + 1, y + 1) } X.fillStyle = c; X.fillText(s, x, y); X.restore() }
function xtw(s, px = 9, bold = false, font = XFONT) { X.save(); X.font = (bold ? 'bold ' : '') + px + 'px ' + font; const w = X.measureText(s).width; X.restore(); return w }
function xfit(s, w, px = 9, bold = false, font = XFONT) { if (xtw(s, px, bold, font) <= w) return s; while (s.length > 1 && xtw(s + '...', px, bold, font) > w) s = s.slice(0, -1); return s + '...' }
function xpath(x, y, w, h, rad) { X.beginPath(); if (X.roundRect) X.roundRect(x, y, w, h, rad); else X.rect(x, y, w, h) }
function xrr(x, y, w, h, rad, c) { X.fillStyle = c; xpath(x, y, w, h, rad); X.fill() }
const inR = (x, y, w, h) => XP.mx >= x && XP.mx < x + w && XP.my >= y && XP.my < y + h;
function xpIcon(k, x, y, s = 1) {   // small generic icons, drawn from shapes
  const q = (a, b, w, h, c) => xr(x + a * s, y + b * s, w * s, h * s, c), circ = (a, b, rr, c) => { X.fillStyle = c; X.beginPath(); X.arc(x + a * s, y + b * s, rr * s, 0, 7); X.fill() };
  if (k == 'globe') { circ(8, 8, 7, '#2a7ad8'); q(3, 7, 10, 2, '#9ad0ff'); q(7, 2, 2, 12, '#9ad0ff'); q(4, 4, 3, 2, '#5ad05a'); q(9, 10, 3, 2, '#5ad05a') }
  else if (k == 'mail') { q(1, 3, 14, 10, '#f4f0e0'); q(1, 3, 14, 1, '#8a8a8a'); for (let i = 0; i < 7; i++) q(1 + i, 4 + i * .6, 1, 1, '#8a8a8a'), q(14 - i, 4 + i * .6, 1, 1, '#8a8a8a') }
  else if (k == 'butterfly') { for (const [a, b, c] of [[2, 3, '#e83a2a'], [9, 3, '#2a8ad8'], [3, 9, '#3ab03a'], [9, 9, '#f0c020']]) q(a, b, 5, 5, c) }
  else if (k == 'play') { circ(8, 8, 7, '#f08a1a'); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(x + 6 * s, y + 4 * s); X.lineTo(x + 12 * s, y + 8 * s); X.lineTo(x + 6 * s, y + 12 * s); X.fill() }
  else if (k == 'film') { q(1, 3, 14, 10, '#3a3a4a'); for (let i = 0; i < 4; i++) q(2 + i * 3.5, 4, 2, 2, '#fff'), q(2 + i * 3.5, 10, 2, 2, '#fff'); q(4, 7, 8, 2, '#5aa0e8') }
  else if (k == 'tour') { circ(8, 8, 7, '#2aa0c8'); q(7, 3, 2, 8, '#fff'); q(5, 11, 6, 2, '#fff') }
  else if (k == 'move') { q(1, 2, 8, 10, '#4a8ad8'); q(7, 5, 8, 10, '#5ab05a') }
  else if (k == 'folder') { q(1, 4, 14, 10, '#e8c050'); q(1, 3, 6, 2, '#e8c050'); q(1, 6, 14, 1, '#f8e090'); q(1, 13, 14, 1, '#b8902a') }
  else if (k == 'pc') { q(1, 2, 14, 9, '#c8c8d0'); q(2, 3, 12, 7, '#3a8ae8'); q(5, 12, 6, 2, '#a8a8b0') }
  else if (k == 'panel') { q(1, 1, 14, 14, '#e8e8f0'); q(3, 4, 4, 3, '#3a8ae8'); q(9, 4, 4, 3, '#3ab03a'); q(3, 9, 4, 3, '#e8a030'); q(9, 9, 4, 3, '#c83a3a') }
  else if (k == 'printer') { q(3, 2, 10, 5, '#fff'); q(1, 6, 14, 6, '#8a8a98'); q(3, 11, 10, 4, '#fff') }
  else if (k == 'help') { circ(8, 8, 7, '#2a6ad8'); xt('?', x + 8 * s, y + 2 * s, '#fff', 11 * s, true, 'center') }
  else if (k == 'search') { X.strokeStyle = '#2a5ab0'; X.lineWidth = 2 * s; X.beginPath(); X.arc(x + 6 * s, y + 6 * s, 4 * s, 0, 7); X.stroke(); q(9, 9, 5, 2, '#5a4a3a') }
  else if (k == 'run') { q(1, 3, 14, 10, '#d8d8e0'); q(1, 3, 14, 3, '#2a5ad8'); q(3, 8, 8, 2, '#3a3a4a') }
  else if (k == 'off') { xrr(x, y, 16 * s, 16 * s, 3 * s, '#e0502a'); X.strokeStyle = '#fff'; X.lineWidth = 1.6 * s; X.beginPath(); X.arc(x + 8 * s, y + 9 * s, 4 * s, -1, 4.1); X.stroke(); q(7.3, 3, 1.4, 6, '#fff') }
  else if (k == 'logoff') { xrr(x, y, 16 * s, 16 * s, 3 * s, '#e8a020'); q(4, 4, 7, 8, '#fff'); q(9, 7, 5, 2, '#e8a020') }
  else if (k == 'flag') { for (const [a, b, c] of [[0, 0, '#f04a24'], [7, -1, '#7ac040'], [0, 7, '#2a8ae8'], [7, 6, '#ffc820']]) { X.fillStyle = c; X.beginPath(); X.moveTo(x + a * s, y + (b + 1) * s); X.quadraticCurveTo(x + (a + 3) * s, y + b * s, x + (a + 6) * s, y + (b + 1) * s); X.lineTo(x + (a + 6) * s, y + (b + 7) * s); X.quadraticCurveTo(x + (a + 3) * s, y + (b + 6) * s, x + a * s, y + (b + 7) * s); X.fill() } }
  else if (k == 'pic') { q(1, 2, 14, 12, '#fff'); q(1, 2, 14, 1, '#7a8aa0'); q(1, 13, 14, 1, '#7a8aa0'); q(1, 2, 1, 12, '#7a8aa0'); q(14, 2, 1, 12, '#7a8aa0'); q(2, 3, 12, 6, '#7ab8f0'); q(2, 9, 12, 4, '#5ab03a'); circ(11, 5, 1.5, '#ffe060') }
  else if (k == 'errsm') { circ(8, 8, 7, '#d82a1a'); X.strokeStyle = '#fff'; X.lineWidth = 2 * s; X.beginPath(); X.moveTo(x + 5 * s, y + 5 * s); X.lineTo(x + 11 * s, y + 11 * s); X.moveTo(x + 11 * s, y + 5 * s); X.lineTo(x + 5 * s, y + 11 * s); X.stroke() }
  else if (k == 'vol') { q(2, 6, 3, 4, '#fff'); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(x + 5 * s, y + 6 * s); X.lineTo(x + 9 * s, y + 3 * s); X.lineTo(x + 9 * s, y + 13 * s); X.lineTo(x + 5 * s, y + 10 * s); X.fill(); X.strokeStyle = '#fff'; X.lineWidth = 1; X.beginPath(); X.arc(x + 9 * s, y + 8 * s, 3.5 * s, -.9, .9); X.stroke() }
  else if (k == 'net') { q(1, 3, 8, 6, '#dfe8f8'); q(2, 4, 6, 4, '#3a7ae8'); q(7, 7, 8, 6, '#dfe8f8'); q(8, 8, 6, 4, '#3a7ae8') }
}
// the recycle bin: a see-through wire basket with the green arrows on it
function xpBin(x, y) {
  X.save(); X.beginPath(); X.moveTo(x + 5, y + 6); X.lineTo(x + 27, y + 6); X.lineTo(x + 24, y + 31); X.lineTo(x + 8, y + 31); X.closePath();
  X.fillStyle = xgrad(0, 0, ['rgba(220,236,250,.85)', 'rgba(150,180,210,.85)', 'rgba(220,236,250,.85)'], x + 5, 22, true); X.fill(); X.strokeStyle = '#5a7a98'; X.lineWidth = 1; X.stroke();
  X.strokeStyle = 'rgba(90,120,150,.55)'; for (let i = 1; i < 6; i++) { X.beginPath(); X.moveTo(x + 5 + i * 3.7, y + 7); X.lineTo(x + 8 + i * 2.7, y + 30); X.stroke() }
  X.fillStyle = '#e8f2fc'; X.beginPath(); X.ellipse(x + 16, y + 6, 11.5, 3, 0, 0, 7); X.fill(); X.strokeStyle = '#5a7a98'; X.stroke(); X.fillStyle = '#9ab4cc'; X.beginPath(); X.ellipse(x + 16, y + 6, 9, 1.8, 0, 0, 7); X.fill();
  X.strokeStyle = '#2a9a3a'; X.lineWidth = 2.2; for (let i = 0; i < 3; i++) { const a = i * 2.09 - .5; X.beginPath(); X.arc(x + 16, y + 19, 5, a, a + 1.5); X.stroke() }
  X.restore()
}
// ---- Luna window frames
const LUNA_TITLE = [[0, '#0058ee'], [.04, '#3593ff'], [.06, '#288eff'], [.08, '#127dff'], [.1, '#036ffc'], [.14, '#0262ee'], [.2, '#0057e5'], [.24, '#0054e3'], [.56, '#0055eb'], [.66, '#005bf5'], [.76, '#026afe'], [.86, '#0062ef'], [.92, '#0052d6'], [.94, '#0040ab'], [1, '#003092']];
function lunaBtn(x, y, kind, hov, dn) {   // 21 x 21 caption button
  const red = kind == 'close';
  xrr(x, y, 21, 21, 3, '#fff');
  X.fillStyle = red ? xgrad(y, 21, hov ? ['#f39a7c', '#e8603a', '#d6411e'] : ['#e9806a', '#e0502e', '#c43818'], x, 21) : xgrad(y, 21, hov ? ['#7cb4ff', '#3a80f0', '#2a68e0'] : ['#5f9cf7', '#2a6ef0', '#1d58d8'], x, 21);
  xpath(x + 1, y + 1, 19, 19, 3); X.fill();
  X.fillStyle = 'rgba(255,255,255,.25)'; xpath(x + 2, y + 2, 17, 7, 2); X.fill();
  X.strokeStyle = '#fff'; X.fillStyle = '#fff'; X.lineWidth = 2.2;
  if (kind == 'close') { X.beginPath(); X.moveTo(x + 6, y + 6); X.lineTo(x + 15, y + 15); X.moveTo(x + 15, y + 6); X.lineTo(x + 6, y + 15); X.stroke() }
  else if (kind == 'min') xr(x + 5, y + 13, 7, 3, '#fff');
  else if (kind == 'max') { X.lineWidth = 1; xr(x + 5, y + 5, 11, 3, '#fff'); X.strokeRect(x + 5.5, y + 5.5, 10, 10) }
  else if (kind == 'restore') { X.lineWidth = 1; xr(x + 8, y + 4, 9, 2, '#fff'); X.strokeRect(x + 8.5, y + 4.5, 8, 7); xr(x + 4, y + 9, 9, 2, '#fff'); X.fillStyle = red ? '#e0502e' : '#2a6ef0'; X.fillRect(x + 4.5, y + 11, 8, 5); X.strokeRect(x + 4.5, y + 9.5, 8, 7) }
}
// draws a window and returns where its parts are; btns: list of 'min','max','close'
function lunaWin(x, y, w, h, title, icon, btns, client = '#ece9d8') {
  X.fillStyle = 'rgba(0,0,0,.18)'; xpath(x + 3, y + 4, w, h, [8, 8, 2, 2]); X.fill();
  X.fillStyle = '#00138c'; xpath(x, y, w, h, [8, 8, 0, 0]); X.fill();
  X.fillStyle = xgrad(y + 1, 28, LUNA_TITLE, x, w); xpath(x + 1, y + 1, w - 2, 28, [7, 7, 0, 0]); X.fill();
  X.fillStyle = xgrad(0, 0, ['#0059e6', '#0a5ce8', '#0052d6'], x + 1, 4, true); X.fillRect(x + 1, y + 29, 3, h - 30); X.fillRect(x + w - 4, y + 29, 3, h - 30); X.fillRect(x + 1, y + h - 4, w - 2, 3);
  xr(x + 4, y + 29, w - 8, h - 33, client);
  if (icon) xpIcon(icon, x + 6, y + 7, 1);
  const bx0 = x + w - 5 - btns.length * 23 + 2, out = { client: [x + 4, y + 29, w - 8, h - 33], rect: [x, y, w, h], btn: {} };
  X.save(); X.beginPath(); X.rect(x, y, bx0 - x - 4, 28); X.clip(); xt(title, x + (icon ? 26 : 8), y + 8, '#fff', 12, true, 'left', '#0f1089', false, TFONT); X.restore();
  btns.forEach((k, i) => { const bx = bx0 + i * 23, by = y + 5; lunaBtn(bx, by, k, inR(bx, by, 21, 21)); out.btn[k == 'restore' ? 'max' : k] = [bx, by, 21, 21] });
  return out;
}
function xpButton(x, y, w, h, label, isDefault) {   // the beige push button
  const hov = inR(x, y, w, h);
  xrr(x, y, w, h, 3, '#003c74'); X.fillStyle = xgrad(y, h, ['#ffffff', '#f4f3ee', '#ecebe6', '#d6d0c5'], x, w); xpath(x + 1, y + 1, w - 2, h - 2, 2); X.fill();
  if (hov || isDefault) { X.strokeStyle = hov ? '#f8b330' : '#98b8ea'; X.lineWidth = 2; xpath(x + 2, y + 2, w - 4, h - 4, 2); X.stroke() }
  xt(label, x + w / 2, y + h / 2 - 5, '#000', 10, false, 'center'); return [x, y, w, h];
}
// ---- the start menu
const XPL = [
  { col: 0, ic: 'globe', a: 'Internet', b: 'Internet Explorer' }, { col: 0, ic: 'mail', a: 'E-mail', b: 'Outlook Express' }, { col: 0, sep: 1 },
  { col: 0, ic: 'butterfly', a: 'MSN Explorer' }, { col: 0, ic: 'play', a: 'Windows Media Player' }, { col: 0, ic: 'film', a: 'Windows Movie Maker' }, { col: 0, ic: 'tour', a: 'Tour Windows XP' }, { col: 0, ic: 'move', a: 'Files and Settings Transfer Wizard' },
  { col: 1, ic: 'folder', a: 'My Documents' }, { col: 1, ic: 'folder', a: 'My Recent Documents', arrow: 1 }, { col: 1, ic: 'folder', a: 'My Pictures' }, { col: 1, ic: 'folder', a: 'My Music' }, { col: 1, ic: 'pc', a: 'My Computer' }, { col: 1, sep: 1 },
  { col: 1, ic: 'panel', a: 'Control Panel' }, { col: 1, ic: 'printer', a: 'Printers and Faxes' }, { col: 1, sep: 1 }, { col: 1, ic: 'help', a: 'Help and Support' }, { col: 1, ic: 'search', a: 'Search' }, { col: 1, ic: 'run', a: 'Run...' }];
const SM = { x: 0, y: TB - 306, w: 300, h: 306 };
function smLayout() { const out = []; let y0 = SM.y + 56, y1 = SM.y + 56;
  for (const it of XPL) { if (it.col == 0) { const h = it.sep ? 7 : it.b ? 30 : 24; out.push({ ...it, x: SM.x + 3, y: y0, w: 150, h }); y0 += h } else { const h = it.sep ? 7 : 20; out.push({ ...it, x: SM.x + 155, y: y1, w: SM.w - 158, h }); y1 += h } }
  out.push({ col: 0, sep: 1, x: SM.x + 3, y: SM.y + SM.h - 66, w: 150, h: 6 }); out.push({ col: 0, a: 'All Programs', allp: 1, x: SM.x + 3, y: SM.y + SM.h - 58, w: 150, h: 24 });
  out.push({ col: 2, ic: 'logoff', a: 'Log Off', x: SM.x + 140, y: SM.y + SM.h - 27, w: 64, h: 22 }); out.push({ col: 2, ic: 'off', a: 'Turn Off Computer', off: 1, x: SM.x + 206, y: SM.y + SM.h - 27, w: 92, h: 22 }); return out }
function drawStartMenu() {
  const m = SM;
  X.fillStyle = 'rgba(0,0,0,.25)'; xpath(m.x + 3, m.y + 3, m.w, m.h, [8, 8, 0, 0]); X.fill();
  X.fillStyle = '#0a3ab8'; xpath(m.x, m.y, m.w, m.h, [8, 8, 0, 0]); X.fill();
  X.fillStyle = xgrad(m.y, 54, ['#1868e8', '#3a8cf8', '#1c64dc', '#1458d0'], m.x, m.w); xpath(m.x + 1, m.y + 1, m.w - 2, 53, [7, 7, 0, 0]); X.fill();
  X.fillStyle = 'rgba(255,255,255,.18)'; X.fillRect(m.x + 6, m.y + 2, m.w - 12, 2);
  // user picture: a little framed photo of a chess set (it's the default one nobody ever changes)
  xrr(m.x + 7, m.y + 7, 42, 42, 3, '#fff'); xrr(m.x + 8, m.y + 8, 40, 40, 2, '#c8d8f0'); xg(m.x + 10, m.y + 10, 36, 36, ['#8a6a4a', '#c8a070', '#5a3a2a']);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) xr(m.x + 10 + i * 9, m.y + 34 + j * 6, 9, 6, '#3a2414'); xr(m.x + 24, m.y + 14, 4, 18, '#1a1410'); X.fillStyle = '#1a1410'; X.beginPath(); X.arc(m.x + 26, m.y + 14, 4, 0, 7); X.fill();
  xt('Owner', m.x + 58, m.y + 19, '#fff', 15, true, 'left', '#0a246a', false, TFONT);
  xr(m.x + 2, m.y + 54, m.w - 4, 2, '#ffffff'); xg(m.x + 2, m.y + 54, m.w - 4, 2, ['rgba(255,255,255,0)', '#f0a050', 'rgba(255,255,255,0)'], true);
  xr(m.x + 3, m.y + 56, 152, m.h - 86, '#fff'); xr(m.x + 155, m.y + 56, m.w - 158, m.h - 86, '#d3e5fa'); xr(m.x + 155, m.y + 56, 1, m.h - 86, '#95bdee');
  X.fillStyle = xgrad(m.y + m.h - 30, 30, ['#4282e8', '#2a6ce0', '#1a58d0'], m.x, m.w); X.fillRect(m.x + 1, m.y + m.h - 30, m.w - 2, 30);
  for (const it of smLayout()) { if (it.sep) { xr(it.x + 6, it.y + 3, it.w - 12, 1, it.col ? '#a8c8f0' : '#dcdcdc'); continue }
    const hov = inR(it.x, it.y, it.w, it.h), c2 = it.col == 2;
    if (hov && !c2) xr(it.x, it.y, it.w, it.h, '#316ac5');
    if (it.allp) { xt('All Programs', it.x + 42, it.y + 6, hov ? '#fff' : '#000', 10, true); xrr(it.x + 118, it.y + 4, 16, 16, 3, '#3a9a3a'); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(it.x + 123, it.y + 7); X.lineTo(it.x + 130, it.y + 12); X.lineTo(it.x + 123, it.y + 17); X.fill(); continue }
    if (c2) { if (hov) xrr(it.x, it.y, it.w, it.h, 3, 'rgba(255,255,255,.18)'); xpIcon(it.ic, it.x + 3, it.y + 3, 1); xt(it.a, it.x + 22, it.y + 6, '#fff', 9, false); continue }
    const big = it.col == 0; xpIcon(it.ic, it.x + 5, it.y + (it.h - (big ? 22 : 16)) / 2, big ? 1.4 : 1);
    if (it.b) { xt(it.a, it.x + 32, it.y + 4, hov ? '#fff' : '#000', 10, true); xt(it.b, it.x + 32, it.y + 16, hov ? '#e8eef8' : '#7a7a7a', 9) }
    else xt(xfit(it.a, it.w - (big ? 36 : 34), 9, !big), it.x + (big ? 32 : 24), it.y + (big ? 8 : 5), hov ? '#fff' : big ? '#000' : '#0a246a', 9, !big);
    if (it.arrow) { X.fillStyle = hov ? '#fff' : '#0a246a'; X.beginPath(); X.moveTo(it.x + it.w - 10, it.y + 7); X.lineTo(it.x + it.w - 6, it.y + 10.5); X.lineTo(it.x + it.w - 10, it.y + 14); X.fill() } }
}
// ---- windows: an error box, or the picture viewer
const VIEWTOOLS = ['prev', 'next', '|', 'fit', 'actual', 'slide', '|', 'zin', 'zout', '|', 'rcw', 'rccw', '|', 'del', 'print', 'copy', 'edit', '|', 'help'];
const VIEWNAMES = { prev: 'Previous Image', next: 'Next Image', fit: 'Best Fit', actual: 'Actual Size', slide: 'Start Slide Show', zin: 'Zoom In', zout: 'Zoom Out', rcw: 'Rotate Clockwise', rccw: 'Rotate Counterclockwise', del: 'Delete', print: 'Print', copy: 'Copy To', edit: 'Edit', help: 'Help' };
function xpWin(w) {
  if (w.k == 'err') return { x: 190, y: 112, w: 270, h: 116 };
  if (w.max) return { x: -4, y: -4, w: 648, h: TB + 8 };
  return { x: 116, y: 6, w: 408, h: 322 };
}
function viewTool(k, x, y, hov) {
  if (hov) { xrr(x - 2, y - 2, 22, 22, 3, '#c1d2ee'); X.strokeStyle = '#316ac5'; X.lineWidth = 1; xpath(x - 1.5, y - 1.5, 21, 21, 3); X.stroke() }
  const c = (cx, cy, rr, col) => { X.fillStyle = col; X.beginPath(); X.arc(x + cx, y + cy, rr, 0, 7); X.fill() };
  X.lineWidth = 1.6;
  if (k == 'prev' || k == 'next') { c(9, 9, 8, '#2a8a3a'); c(9, 8, 6.5, '#4ac05a'); X.fillStyle = '#fff'; X.beginPath(); const d = k == 'next' ? 1 : -1; X.moveTo(x + 9 - 3 * d, y + 4); X.lineTo(x + 9 + 4 * d, y + 9); X.lineTo(x + 9 - 3 * d, y + 14); X.fill() }
  else if (k == 'fit' || k == 'actual') { xr(x + 2, y + 3, 14, 12, '#5a6a80'); xr(x + 3, y + 4, 12, 10, '#bcd8f6'); if (k == 'fit') { X.strokeStyle = '#2a4a90'; X.strokeRect(x + 5.5, y + 6.5, 7, 5) } else xt('1:1', x + 9, y + 5, '#1a2a60', 6, true, 'center') }
  else if (k == 'slide') { xr(x + 1, y + 3, 16, 11, '#5a6a80'); xr(x + 2, y + 4, 14, 9, '#3a8ae8'); xr(x + 6, y + 14, 6, 2, '#5a6a80'); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(x + 7, y + 6); X.lineTo(x + 12, y + 8.5); X.lineTo(x + 7, y + 11); X.fill() }
  else if (k == 'zin' || k == 'zout') { X.strokeStyle = '#3a5a8a'; X.lineWidth = 2; X.beginPath(); X.arc(x + 7, y + 7, 5, 0, 7); X.stroke(); c(7, 7, 4, '#dff0ff'); xr(x + 10, y + 11, 6, 3, '#6a4a2a'); xr(x + 4, y + 6, 6, 2, '#2a4a8a'); if (k == 'zin') xr(x + 6, y + 4, 2, 6, '#2a4a8a') }
  else if (k == 'rcw' || k == 'rccw') { X.strokeStyle = '#2a9a3a'; X.lineWidth = 2.5; X.beginPath(); const cw = k == 'rcw'; X.arc(x + 9, y + 10, 5.5, cw ? 3.6 : -.5, cw ? 7.4 : 2.9, !cw); X.stroke(); X.fillStyle = '#2a9a3a'; X.beginPath(); const ax = cw ? x + 13 : x + 5; X.moveTo(ax - 4, y + 3); X.lineTo(ax + 4, y + 3); X.lineTo(ax, y + 8); X.fill() }
  else if (k == 'del') { X.strokeStyle = '#d0301a'; X.lineWidth = 3; X.beginPath(); X.moveTo(x + 4, y + 4); X.lineTo(x + 14, y + 14); X.moveTo(x + 14, y + 4); X.lineTo(x + 4, y + 14); X.stroke() }
  else if (k == 'print') xpIcon('printer', x + 1, y + 1, 1);
  else if (k == 'copy') { xpIcon('folder', x + 1, y + 2, 1); X.fillStyle = '#2a8a3a'; X.beginPath(); X.moveTo(x + 9, y + 1); X.lineTo(x + 17, y + 6); X.lineTo(x + 9, y + 11); X.fill() }
  else if (k == 'edit') { X.save(); X.translate(x + 9, y + 9); X.rotate(-.8); xr(-2, -8, 4, 13, '#e8b030'); xr(-2, -8, 4, 3, '#e88aa0'); X.fillStyle = '#3a2a1a'; X.beginPath(); X.moveTo(-2, 5); X.lineTo(2, 5); X.lineTo(0, 9); X.fill(); X.restore() }
  else if (k == 'help') xpIcon('help', x + 1, y + 1, 1);
}
function drawXPWin(w) {
  const g = xpWin(w), { x, y } = g, ww = g.w, hh = g.h;
  if (w.k == 'err') {
    const L = lunaWin(x, y, ww, hh, w.name, null, ['close']); w.close = L.btn.close; w.rect = L.rect; w.mn = null; w.mx = null;
    // the round red stop sign with a white X, shaded
    let rg = X.createRadialGradient(x + 30, y + 52, 2, x + 34, y + 58, 17); rg.addColorStop(0, '#ff8a70'); rg.addColorStop(.6, '#e02a14'); rg.addColorStop(1, '#a01208'); X.fillStyle = 'rgba(0,0,0,.18)'; X.beginPath(); X.arc(x + 36, y + 60, 15, 0, 7); X.fill();
    X.fillStyle = rg; X.beginPath(); X.arc(x + 34, y + 58, 15, 0, 7); X.fill(); X.strokeStyle = '#fff'; X.lineWidth = 3.4; X.beginPath(); X.moveTo(x + 28, y + 52); X.lineTo(x + 40, y + 64); X.moveTo(x + 40, y + 52); X.lineTo(x + 28, y + 64); X.stroke();
    xt('Error 404', x + 62, y + 44, '#000', 10, true); xt(xfit('\'' + w.name + '\' could not be found.', ww - 74, 10), x + 62, y + 60, '#000', 10);
    w.ok = xpButton(x + ww / 2 - 37, y + hh - 34, 75, 23, 'OK', 1);
    return;
  }
  // Windows Picture and Fax Viewer
  const L = lunaWin(x, y, ww, hh, 'IMG_4174.jpg - Windows Picture and Fax Viewer', 'pic', ['min', w.max ? 'restore' : 'max', 'close'], '#fff');
  w.close = L.btn.close; w.mn = L.btn.min; w.mx = L.btn.max; w.rect = L.rect;
  const [cx, cy, cw, ch] = L.client, barH = 34, ax = cx + 8, ay = cy + 8, aw = cw - 16, ah = ch - barH - 14;
  // the picture, fitted, zoomed or turned
  if (ready(XPIMG)) {
    const rot = ((w.rot || 0) % 4 + 4) % 4, iw0 = XPIMG.width, ih0 = XPIMG.height, sw = rot % 2 ? ih0 : iw0, sh = rot % 2 ? iw0 : ih0;
    const fit = Math.min(aw / sw, ah / sh) * (w.zoom || 1), dw = sw * fit, dh = sh * fit;
    X.save(); X.beginPath(); X.rect(ax, ay, aw, ah); X.clip(); X.translate(ax + aw / 2, ay + ah / 2); X.rotate(rot * Math.PI / 2); X.imageSmoothingEnabled = false;
    const pw = rot % 2 ? dh : dw, ph = rot % 2 ? dw : dh; X.fillStyle = 'rgba(0,0,0,.25)'; X.fillRect(-pw / 2 + 2, -ph / 2 + 2, pw, ph); X.drawImage(XPIMG, -pw / 2, -ph / 2, pw, ph); X.restore();
  }
  // the toolbar along the bottom
  const by = cy + ch - barH; xg(cx, by, cw, barH, ['#ffffff', '#f3f3f6', '#e6e8ef']); xr(cx, by, cw, 1, '#c8ccd8');
  const n = VIEWTOOLS.length, totalW = VIEWTOOLS.reduce((s, k) => s + (k == '|' ? 7 : 21), 0); let tx = cx + (cw - totalW) / 2; w.tools = [];
  for (const k of VIEWTOOLS) { if (k == '|') { xr(tx + 3, by + 8, 1, 18, '#c0c4d0'); tx += 7; continue } const b = [tx + 1.5, by + 8, 18, 18]; viewTool(k, b[0], b[1], inR(...b)); w.tools.push({ k, b }); tx += 21 }
  const hv = w.tools.find(t => inR(...t.b)); if (hv) { const s = VIEWNAMES[hv.k], tw = xtw(s, 9) + 8, tx2 = clamp(XP.mx + 4, 0, 640 - tw), ty2 = XP.my + 20; xr(tx2, ty2, tw, 14, '#000'); xr(tx2 + 1, ty2 + 1, tw - 2, 12, '#ffffe1'); xt(s, tx2 + 4, ty2 + 2, '#000', 9) }
}
// ---- the screensaver: two shapes bouncing, leaving trails of coloured lines, on black
function ssNew() { const mk = (h) => ({ h, pts: Array.from({ length: 4 }, () => ({ x: Math.random() * 600 + 20, y: Math.random() * 320 + 20, vx: (Math.random() < .5 ? -1 : 1) * (1.4 + Math.random() * 1.8), vy: (Math.random() < .5 ? -1 : 1) * (1.2 + Math.random() * 1.6) })), trail: [] }); return { t: 0, polys: [mk(200), mk(20)] } }
function ssStep(ss) { ss.t++;
  for (const P of ss.polys) { for (const p of P.pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > 640) { p.vx *= -1; p.x = clamp(p.x, 0, 640) } if (p.y < 0 || p.y > 360) { p.vy *= -1; p.y = clamp(p.y, 0, 360) } }
    P.h = (P.h + .35) % 360; if (ss.t % 3 == 0) { P.trail.unshift(P.pts.map(p => [p.x, p.y])); if (P.trail.length > 9) P.trail.pop() } } }
function ssDraw(ss) { xr(0, 0, 640, 360, '#000'); X.lineWidth = 1.3;
  for (const P of ss.polys) P.trail.forEach((pts, i) => { X.strokeStyle = 'hsla(' + P.h + ',95%,60%,' + (1 - i / 10).toFixed(2) + ')'; X.beginPath(); pts.forEach(([a, b], j) => j ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.stroke() }) }
// ---- the "Turn off computer" box, over a desktop gone grey
function drawOffDlg() {
  const x = 170, y = 96, w = 300, h = 170; X.fillStyle = 'rgba(0,0,0,.3)'; X.fillRect(x + 4, y + 4, w, h);
  xg(x, y, w, 40, ['#002a9c', '#0b3cba', '#00288e']); xt('Turn off computer', x + 14, y + 13, '#fff', 14, false, 'left', null, false, TFONT);
  xg(x, y + 40, w, 2, ['#3a5ad0', '#ffffff', '#3a5ad0'], true);
  xg(x, y + 42, w, h - 82, ['#5b80e0', '#7a9cec', '#5b80e0'], true);
  xg(x, y + h - 40, w, 2, ['#3a5ad0', '#ffffff', '#3a5ad0'], true); xg(x, y + h - 38, w, 38, ['#00288e', '#0b3cba', '#002a9c']);
  XP.offbtns = [];
  [['stand', 'Stand By', '#f0b020', '#c08008'], ['off', 'Turn Off', '#e8542a', '#b02a10'], ['restart', 'Restart', '#46b046', '#1e7a1e']].forEach(([k, lab, c1, c2], i) => {
    const bx = x + 62 + i * 88, by = y + 74, hov = Math.hypot(XP.mx - bx, XP.my - by) < 17;
    X.fillStyle = '#fff'; X.beginPath(); X.arc(bx, by, 17, 0, 7); X.fill();
    const rg = X.createRadialGradient(bx - 5, by - 6, 2, bx, by, 16); rg.addColorStop(0, hov ? '#fff' : '#fff6d8'); rg.addColorStop(.25, c1); rg.addColorStop(1, c2); X.fillStyle = rg; X.beginPath(); X.arc(bx, by, 15.5, 0, 7); X.fill();
    X.strokeStyle = '#fff'; X.lineWidth = 2.4; X.beginPath();
    if (k == 'stand') { X.arc(bx, by, 6, 0, Math.PI * 1.5, false); X.stroke(); X.beginPath(); X.moveTo(bx, by - 6); X.lineTo(bx, by + 6); X.stroke() }
    else if (k == 'off') { X.arc(bx, by + 1, 6.5, -1.05, 4.2); X.stroke(); X.beginPath(); X.moveTo(bx, by - 9); X.lineTo(bx, by); X.stroke() }
    else { X.arc(bx, by, 6.5, -.6, 4.4); X.stroke(); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(bx + 3, by - 10); X.lineTo(bx + 9, by - 4); X.lineTo(bx + 2, by - 2); X.fill() }
    xt(lab, bx, by + 22, '#fff', 10, false, 'center'); XP.offbtns.push({ k, b: [bx - 17, by - 17, 34, 34] });
  });
  XP.offcancel = xpButton(x + w - 82, y + h - 30, 70, 22, 'Cancel');
}
function drawShutdown() {
  const a = Math.min(1, XP.off / 20); X.globalAlpha = a;
  xr(0, 0, 640, 360, '#5a7edc'); xg(0, 0, 640, 60, ['#00309c', '#0d40b8']); xg(0, 300, 640, 60, ['#0d40b8', '#00309c']);
  xg(0, 60, 640, 2, ['rgba(255,255,255,0)', '#c8d8ff', 'rgba(255,255,255,0)'], true); xg(0, 298, 640, 2, ['rgba(255,255,255,0)', '#f0a050', 'rgba(255,255,255,0)'], true);
  const rg = X.createRadialGradient(140, 90, 10, 140, 90, 300); rg.addColorStop(0, 'rgba(160,190,255,.6)'); rg.addColorStop(1, 'rgba(160,190,255,0)'); X.fillStyle = rg; X.fillRect(0, 62, 640, 236);
  if (XP.off > 20) xt(XP.restart ? 'Windows is restarting...' : 'Windows is shutting down...', 320, 170, '#fff', 16, true, 'center', '#1a3a8a', false, TFONT);
  X.globalAlpha = 1;
}
// ---- the desktop
const XPICONS = [{ id: 'img', x: 14, y: 12, label: 'IMG_4174.jpg' }, { id: 'bin', x: 590, y: TB - 60, label: 'Recycle Bin' }];
const visWins = () => XP.wins.filter(w => !w.min);
function drawTaskbar() {
  X.fillStyle = xgrad(TB, TBH, [[0, '#3168d5'], [.04, '#5a8ef0'], [.12, '#3a78ec'], [.25, '#2a64e0'], [.85, '#245edb'], [1, '#1941a5']], 0, 640); X.fillRect(0, TB, 640, TBH);
  // start
  const sh = inR(0, TB, 98, TBH) || XP.start;
  X.fillStyle = xgrad(TB, TBH, XP.start ? ['#2a7a2a', '#3a9a3a', '#2e8a2e', '#3a9a3a'] : sh ? ['#5cc85c', '#48b048', '#38a038', '#4aae4a'] : ['#4aaa4a', '#3c9e3c', '#2f8f2f', '#3a9a3a'], 0, 98); xpath(0, TB, 98, TBH, [0, 12, 12, 0]); X.fill();
  X.fillStyle = 'rgba(255,255,255,.25)'; xpath(2, TB + 1, 90, 6, [0, 8, 4, 0]); X.fill();
  X.save(); X.shadowColor = 'rgba(0,0,0,.4)'; X.shadowBlur = 2; xpIcon('flag', 10, TB + 6, 1.05); X.restore(); xt('start', 31, TB + 4, '#fff', 17, true, 'left', '#1a4a1a', true, TFONT);
  // a button for each open window
  let bx = 104; XP.tbtn = [];
  for (const w of XP.wins) { if (w.k == 'err') continue; const top = visWins().slice(-1)[0] === w, hov = inR(bx, TB + 3, 150, TBH - 5);
    X.fillStyle = top ? xgrad(TB + 3, TBH - 5, ['#1a46b0', '#1e4fc4']) : xgrad(TB + 3, TBH - 5, hov ? ['#5aa0ff', '#3a84f4'] : ['#3d8ef8', '#2a70e8', '#2464dc'], bx, 150); xpath(bx, TB + 3, 150, TBH - 5, 3); X.fill();
    X.strokeStyle = 'rgba(0,20,90,.5)'; X.lineWidth = 1; xpath(bx + .5, TB + 3.5, 149, TBH - 6, 3); X.stroke();
    xpIcon('pic', bx + 5, TB + 5, 1); xt(xfit('IMG_4174.jpg - Windows Picture and Fax Viewer', 120, 9), bx + 24, TB + 8, '#fff', 9, false); XP.tbtn.push({ w, b: [bx, TB + 3, 150, TBH - 5] }); bx += 154 }
  // the tray and its clock
  const tx = 548; X.fillStyle = xgrad(TB, TBH, ['#0c59b9', '#139ee9', '#18b9f5', '#139ee9', '#1197e4'], tx, 92); X.fillRect(tx, TB, 92, TBH); xr(tx, TB, 1, TBH, '#0a3fa8'); xr(tx + 1, TB, 1, TBH, '#62c8f8');
  xpIcon('vol', tx + 6, TB + 5, 1); xpIcon('net', tx + 24, TB + 5, 1);
  const dt = new Date(), hr = dt.getHours(), mn = String(dt.getMinutes()).padStart(2, '0');
  xt(((hr + 11) % 12 + 1) + ':' + mn + ' ' + (hr < 12 ? 'AM' : 'PM'), 634, TB + 8, '#fff', 10, false, 'right');
}
function drawXP() {
  sW(); X.imageSmoothingEnabled = true;
  if (XP.ss) { ssDraw(XP.ss); return }
  if (XP.offdlg) X.filter = 'grayscale(1) brightness(.85)';
  X.drawImage(blissBg(), 0, 0);
  for (const ic of XPICONS) { const sel = XP.sel == ic.id, x = ic.x, y = ic.y;
    if (ic.id == 'img') { X.fillStyle = 'rgba(0,0,0,.25)'; X.fillRect(x + 7, y + 3, 32, 32); xr(x + 5, y + 1, 32, 32, '#7a8aa0'); xr(x + 6, y + 2, 30, 30, '#fff'); if (ready(XPIMG)) { X.imageSmoothingEnabled = false; X.drawImage(XPIMG, 6, 10, 60, 60, x + 8, y + 4, 26, 26) } xpIcon('pic', x + 25, y + 21, .8) }
    else xpBin(x + 4, y);
    if (sel) { X.fillStyle = 'rgba(49,106,197,.45)'; X.fillRect(x + 5, y + 1, 32, 32) }
    const tw = xtw(ic.label, 9); if (sel) xr(x + 21 - tw / 2 - 2, y + 36, tw + 4, 12, '#316ac5'); xt(ic.label, x + 21, y + 37, '#fff', 9, false, 'center', sel ? null : 'rgba(0,0,0,.85)') }
  drawTaskbar();
  // the tour balloon, pointing at the tray
  if (XP.balloon && !XP.offdlg) { const bx = 330, by = TB - 74, bw = 236, bh = 58;
    X.fillStyle = '#000'; xpath(bx - 1, by - 1, bw + 2, bh + 2, 7); X.fill(); X.fillStyle = '#ffffe1'; xpath(bx, by, bw, bh, 6); X.fill();
    X.fillStyle = '#000'; X.beginPath(); X.moveTo(bx + 196, by + bh); X.lineTo(bx + 232, by + bh + 14); X.lineTo(bx + 216, by + bh); X.fill(); X.fillStyle = '#ffffe1'; X.beginPath(); X.moveTo(bx + 197, by + bh - 1); X.lineTo(bx + 229, by + bh + 11); X.lineTo(bx + 214, by + bh - 1); X.fill();
    X.fillStyle = '#2a6ad8'; X.beginPath(); X.arc(bx + 14, by + 12, 7, 0, 7); X.fill(); xt('i', bx + 14, by + 5, '#fff', 11, true, 'center', null, false, 'Georgia, serif'); xt('Take a tour of Windows XP', bx + 26, by + 6, '#000', 10, true);
    xt('To learn about the exciting new features in XP now,', bx + 10, by + 23, '#000', 7.5); xt('click here. To take the tour later, click All Programs', bx + 10, by + 33, '#000', 7.5); xt('on the Start menu, and then click Accessories.', bx + 10, by + 43, '#000', 7.5);
    const cx = bx + bw - 17, cy = by + 4, h2 = inR(cx, cy, 13, 13); xrr(cx, cy, 13, 13, 2, h2 ? '#e8c8b8' : '#ffffe1'); if (h2) { X.strokeStyle = '#a08070'; X.lineWidth = 1; X.strokeRect(cx + .5, cy + .5, 12, 12) } X.strokeStyle = '#5a5a5a'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(cx + 4, cy + 4); X.lineTo(cx + 9, cy + 9); X.moveTo(cx + 9, cy + 4); X.lineTo(cx + 4, cy + 9); X.stroke();
    XP.bclose = [cx, cy, 13, 13]; XP.bbox = [bx, by, bw, bh] }
  for (const w of visWins()) drawXPWin(w);
  if (XP.start) drawStartMenu();
  X.filter = 'none';
  if (XP.offdlg) drawOffDlg();
  if (XP.off) { drawShutdown(); return }
  // the cursor (an arrow; a pointing hand over the toolbar's buttons would be too fancy)
  const x = Math.round(XP.mx), y = Math.round(XP.my); X.fillStyle = '#000'; X.beginPath(); X.moveTo(x, y); X.lineTo(x, y + 17); X.lineTo(x + 4, y + 13); X.lineTo(x + 7, y + 19); X.lineTo(x + 10, y + 18); X.lineTo(x + 7, y + 12); X.lineTo(x + 12, y + 12); X.closePath(); X.fill();
  X.fillStyle = '#fff'; X.beginPath(); X.moveTo(x + 1, y + 2.5); X.lineTo(x + 1, y + 14.5); X.lineTo(x + 4.2, y + 11.2); X.lineTo(x + 7.4, y + 17.4); X.lineTo(x + 8.6, y + 16.9); X.lineTo(x + 5.6, y + 11); X.lineTo(x + 9.6, y + 11); X.closePath(); X.fill();
}
function xpErr(name) { XP.wins.push({ k: 'err', name }); beep(200, .18, 1, 'square'); XP.start = 0 }
function xpOpenImg() { const w = XP.wins.find(w => w.k == 'img'); if (w) { w.min = 0; XP.wins.splice(XP.wins.indexOf(w), 1); XP.wins.push(w) } else XP.wins.push({ k: 'img', t: 0, zoom: 1, rot: 0 }); XP.start = 0; XP.balloon = 0; beep(700, .06) }
function xpShut(restart) { XP.offdlg = 0; XP.off = 1; XP.restart = restart; beep(330, .3, 1, 'sine') }
function xpClick() {
  if (XP.offdlg) { for (const o of XP.offbtns || []) if (inR(...o.b)) { if (o.k == 'stand') { XP.offdlg = 0; XP.ss = ssNew(); XP.ssLock = 30 } else xpShut(o.k == 'restart'); return }
    if (XP.offcancel && inR(...XP.offcancel)) XP.offdlg = 0; return }
  const hitB = b => b && inR(...b), vis = visWins(), top = vis[vis.length - 1];
  // the start menu takes the click first when it's open
  if (XP.start) { for (const it of smLayout()) { if (it.sep || !inR(it.x, it.y, it.w, it.h)) continue;
      if (it.off) { XP.start = 0; XP.offdlg = 1; beep(440, .08); return } if (it.a == 'My Pictures') return xpOpenImg(); if (it.a == 'Log Off') { XP.start = 0; return xpErr('Log Off') } return xpErr(it.allp ? 'All Programs' : it.b || it.a) }
    if (!inR(SM.x, SM.y, SM.w, SM.h) && !inR(0, TB, 98, TBH)) { XP.start = 0; return } }
  if (top && top.k == 'err') { if (hitB(top.close) || hitB(top.ok)) { XP.wins.splice(XP.wins.indexOf(top), 1); beep(520, .05) } return }   // error boxes are modal
  if (inR(0, TB, 98, TBH)) { XP.start = !XP.start; beep(600, .04); return }
  for (const t of XP.tbtn || []) if (hitB(t.b)) { const w = t.w; if (w === top) w.min = 1; else { w.min = 0; XP.wins.splice(XP.wins.indexOf(w), 1); XP.wins.push(w) } beep(560, .03); return }
  if (top && top.rect && hitB(top.rect)) {
    if (hitB(top.close)) { XP.wins.splice(XP.wins.indexOf(top), 1); beep(520, .05); return }
    if (hitB(top.mn)) { top.min = 1; beep(560, .03); return }
    if (hitB(top.mx)) { top.max = !top.max; beep(560, .03); return }
    for (const t of top.tools || []) if (hitB(t.b)) { beep(640, .03);
      if (t.k == 'zin') top.zoom = Math.min(4, (top.zoom || 1) * 1.5); else if (t.k == 'zout') top.zoom = Math.max(.35, (top.zoom || 1) / 1.5); else if (t.k == 'fit' || t.k == 'actual') top.zoom = 1;
      else if (t.k == 'rcw') top.rot = (top.rot || 0) + 1; else if (t.k == 'rccw') top.rot = (top.rot || 0) - 1;
      else if (t.k == 'slide') { XP.ss = ssNew(); XP.ssLock = 30 } else xpErr(VIEWNAMES[t.k]); return }
    return }
  if (XP.balloon) { if (inR(...XP.bclose)) { XP.balloon = 0; return } if (inR(...XP.bbox)) { XP.balloon = 0; return xpErr('Tour Windows XP') } }
  for (const ic of XPICONS) if (inR(ic.x, ic.y, 44, 50)) { if (XP.sel == ic.id) { XP.sel = null; return ic.id == 'img' ? xpOpenImg() : xpErr('Recycle Bin') } XP.sel = ic.id; beep(500, .03); return }
  if (inR(548, TB, 92, TBH)) return;
  XP.sel = null;
}
const XP_IDLE = 60 * 20;   // about twenty seconds of nothing, then the screensaver comes on
window.xpScreensaver = () => { if (XP) { XP.ss = ssNew(); XP.ssLock = 30 } };
XSC.xp = function () {
  if (!XP) { sc = 'world'; return } XP.t++;
  const anyKey = Object.keys(hit).some(k => hit[k]) || Object.keys(keys).some(k => keys[k]);
  // the screensaver: any key or mouse movement wakes the desktop back up (and that input does nothing else)
  if (XP.ss) { ssStep(XP.ss); drawXP(); sU(); if (XP.ssLock > 0) XP.ssLock--;
    else if (anyKey || XPMOUSE.moved || XPMOUSE.click) { XP.ss = null; XP.idle = 0; XP.held = 0; for (const k in hit) hit[k] = 0; if (XPMOUSE.moved) { XP.mx = clamp(XPMOUSE.x, 0, 639); XP.my = clamp(XPMOUSE.y, 0, 359) } }
    XPMOUSE.moved = 0; XPMOUSE.click = 0; return }
  drawXP(); sU();
  if (DL) { dialogUpdate(); if (DL) drawDialog(); XPMOUSE.click = 0; XP.idle = 0; return }
  if (XP.off) { if (++XP.off > 100) { sc = 'world'; XP = null } XPMOUSE.click = 0; return }
  if (anyKey || XPMOUSE.moved || XPMOUSE.click) XP.idle = 0; else if (++XP.idle > XP_IDLE) { XP.ss = ssNew(); XP.ssLock = 0; return }
  // the picture viewer makes Hitori say something, the first time it's opened
  const top = visWins().slice(-1)[0]; if (top && top.k == 'img' && ++top.t == 40 && !XP.said) { XP.said = 1; D(['Hitori:shock|Why is this random dude in this computer?']) }
  // cursor: arrow keys (it speeds up the longer you hold) or the mouse
  const hx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0), hy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
  if (hx || hy) { XP.held++; const v = Math.min(7, 1.6 + XP.held / 7); XP.mx = clamp(XP.mx + hx * v, 0, 636); XP.my = clamp(XP.my + hy * v, 0, 356) } else XP.held = 0;
  if (XPMOUSE.moved) { XP.mx = clamp(XPMOUSE.x, 0, 639); XP.my = clamp(XPMOUSE.y, 0, 359); XPMOUSE.moved = 0 }
  if (ok() || XPMOUSE.click) xpClick(); XPMOUSE.click = 0;
  if (esc() || hit.KeyX) { const v = visWins(); if (XP.offdlg) XP.offdlg = 0; else if (XP.start) XP.start = 0; else if (v.length) XP.wins.splice(XP.wins.indexOf(v[v.length - 1]), 1); else { sc = 'world'; XP = null; return } }
  if (XP.t < 360) { sU(); const a = XP.t < 300 ? .85 : (360 - XP.t) / 70; r(W - 112, 3, 109, 11, 'rgba(0,0,0,' + (a * .6).toFixed(2) + ')'); txt('arrows/mouse: move  Z: click  X: back', W - 57, 5, 'rgba(255,255,255,' + a.toFixed(2) + ')', 'center', 5) }
};
