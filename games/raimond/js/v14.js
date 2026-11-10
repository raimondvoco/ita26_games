// ==================== v14: new music, Uku at home at dusk, and the battle screen rebuilt around portrait cards ====================

// ---------------------------------------------------------------- music
TRACKS.gallery = 'gallery_walk'; TRACKS.memories = 'new_memories'; TRACKS.rukia = 'rukia';
for (const id in AREAS) if (AREAS[id].pal == 'casino') AREAS[id].mus = 'gallery';
// day 1: "it's ok, we can make new memories" from the moment dusk falls; once you crawl into the hollow log, rukia's track
// takes over and keeps playing (through the dark, the camp, any fights) until you go to sleep.
const _music14 = music;
music = function (k) {
  if (S && S.day == 1 && k != 'menu' && k != 'none') { if (S.fl.rukia) k = 'rukia'; else if (S.fl.d1_ready) k = 'memories' }
  _music14(k);
};
const _enter14 = enter;
enter = function (id, from, xy) { _enter14(id, from, xy); if (S && S.day == 1 && S.a == 'w_tunnel' && S.fl.uku_gone) S.fl.rukia = 1 };

// ---------------------------------------------------------------- Uku, at home, at dusk
// When dusk falls Uku leaves the party for the well. If you go to his house before meeting him there, he is home:
// he came back for something, and he talks to you before he slips out again.
const _dusk14 = EV.dusk;
EV.dusk = function () { S.fl.uku_athome = 1; _dusk14() };
(() => {
  const A0 = AREAS.w_uhouse, h = A0.h;
  A0.ents.push(npc('uku', 12, h - 6, { if: 'uku_athome', ifnot: 'uku_gone', dir: 0 }), trig('ukuhome', 'ukuhome', 8, h - 6, 8, 3, { need: 'uku_athome' }));
  delete MP.w_uhouse;
})();
const UKU_HOME = ['Uku:shock|Oh. You came in here.', 'Uku:neutral|I had to grab something before the well. Don\'t look at the mess.', 'Caroline:happy|Uku! We thought you went on ahead!',
  'Uku:happy|I did. And then I didn\'t. I wanted to see the house one more time while it\'s still orange in here.', 'Hitori:neutral|...One more time?', 'Uku:neutral|Figure of speech.',
  'Uku:sad|Hey, Hitori. If I\'m ever not around... the spare key is under the frog by the door. Water the plants. Don\'t touch the guitar.', 'Steven:worried|Dude. That\'s a weird thing to say.',
  'Uku:happy|I\'m a weird guy. Okay. The well. Don\'t be late.'];
function ukuLeaves() { delete S.fl.uku_athome; S.got['t:ukuhome'] = 1; E = E.filter(q => !(q.k == 'npc' && q.id == 'uku')); D(['|Uku slips past you and out the door.', '|The house feels bigger without him.']) }
EV.ukuhome = () => { if (S.fl.uku_gone) return; D(UKU_HOME, ukuLeaves) };
const _ukuDlg14 = NPC_DLG.uku;
NPC_DLG.uku = e => S.a == 'w_uhouse' ? [UKU_HOME, ukuLeaves] : _ukuDlg14(e);

// ---------------------------------------------------------------- battle screen
// Four portrait cards in the corners. Each card's background is the character's emotion: a dithered gradient,
// white for neutral, yellow for happy, blue for sad, red for angry. The face is the matching portrait.
// The message box sits on top; the commands are four painted buttons at the bottom.
const CARD = { w: 66, h: 70 }, CARDXY = [[3, 3], [3, 107], [251, 3], [251, 107]];
CARDXY.forEach(([x, y], j) => { SLOTS[j][0] = x + 33; SLOTS[j][1] = y + 60 });
const EMOGRAD = { neutral: ['#ffffff', '#1c1a26', '#c8c8d4'], happy: ['#fff8c8', '#e88a10', '#ffd84a'], sad: ['#e4f0ff', '#1a3a9a', '#6aa0ff'], angry: ['#ffe0d4', '#a8101c', '#ff5a4a'] };
const EMOBG = {};
function emoBg(e) {   // a 124x92 dithered gradient (drawn at 2x, so the dither stays fine)
  if (EMOBG[e]) return EMOBG[e];
  const [c1, c2] = EMOGRAD[e] || EMOGRAD.neutral, w = 124, h = 92, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'), id = g.createImageData(w, h), hx = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), a = hx(c1), b = hx(c2);
  const BY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ex = Math.abs(x - w / 2) / (w / 2), t = Math.min(1, Math.max(0, Math.pow(y / h, 1.6) * 1.15 + Math.pow(ex, 3) * .35 - .05)), on = t * 16 > BY[y & 3][x & 3] + .5, c = on ? b : a, i = (y * w + x) * 4;
    id.data[i] = c[0]; id.data[i + 1] = c[1]; id.data[i + 2] = c[2]; id.data[i + 3] = 255;
  }
  g.putImageData(id, 0, 0); return EMOBG[e] = cv;
}
const PCUT = {};
function cutPortrait(i, e) { const k = CH[i].key + '_' + e; if (!PCUT[k]) PCUT[k] = loadImg('assets/portraits_cut/' + CH[i].key + '_' + e + '.png'); return PCUT[k] }
function heart(x, y, c) { r(x + 1, y, 2, 1, c); r(x + 4, y, 2, 1, c); r(x, y + 1, 7, 2, c); r(x + 1, y + 3, 5, 1, c); r(x + 2, y + 4, 3, 1, c); r(x + 3, y + 5, 1, 1, c); r(x + 1, y + 1, 1, 1, '#fff') }

function drawCard(i, j) {
  const [cx, cy] = CARDXY[j], left = j < 2, hp = S.hp[i], e = S.emo[i] || 'neutral', G = EMOGRAD[e] || EMOGRAD.neutral, dead = hp <= 0;
  const act = B.mode == 'menu' && B.act == i, hitT = B.hit == i && B.hitT > 0 ? B.hitT : 0, shk = hitT ? (hitT % 2 ? 3 : -3) : 0;
  const lp = B.lunge && B.lunge.i == i ? Math.sin(Math.min(1, B.lunge.t / 22) * Math.PI) : 0;
  const x = cx + shk + Math.round(lp * 26 * (left ? 1 : -1)), y = cy - (act ? 2 + Math.round(Math.sin(tick / 8)) : 0) + Math.round(lp * (j % 2 ? -10 : 10));
  const edge = act ? '#ffd23c' : '#fff';
  r(x - 1, y - 1, CARD.w + 2, CARD.h + 2, '#000'); r(x, y, CARD.w, CARD.h, edge); r(x + 1, y + 1, CARD.w - 2, CARD.h - 2, '#0c0a14');
  // name tab: name on the left, the emotion in its colour on the right
  r(x + 1, y + 1, CARD.w - 2, 11, act ? '#3a2a10' : '#000'); txt(CH[i].n.toUpperCase(), x + 4, y + 3, act ? '#ffd23c' : '#fff', 'left', 6); txt(e.toUpperCase(), x + CARD.w - 4, y + 3.5, G[2], 'right', 5);
  // portrait window
  const px = x + 2, py = y + 13, pw = CARD.w - 4, ph = 46; r(px - 1, py - 1, pw + 2, ph + 2, edge);
  X.imageSmoothingEnabled = false; X.drawImage(emoBg(e), px, py, pw, ph);
  const im = cutPortrait(i, e); X.save(); X.beginPath(); X.rect(px, py, pw, ph); X.clip();
  if (ready(im)) { const s = 50 / im.naturalWidth, bob = act ? Math.round(Math.sin(tick / 10)) : 0; X.imageSmoothingEnabled = true; X.imageSmoothingQuality = 'high'; X.drawImage(im, px + (pw - 50) / 2, py + 2 + bob, 50, im.naturalHeight * s); X.imageSmoothingEnabled = false }
  if (hitT) r(px, py, pw, ph, 'rgba(255,40,40,' + (hitT / 14 * .5).toFixed(2) + ')');
  if (dead) { r(px, py, pw, ph, 'rgba(10,8,20,.72)'); txt('DOWN', px + pw / 2, py + ph / 2 - 4, '#aaa', 'center', 7) }
  X.restore();
  // HP: a heart and a red bar with the numbers inside
  const hy = y + 61; heart(x + 3, hy + 1, dead ? '#555' : '#ff3a5a');
  r(x + 12, hy, CARD.w - 15, 8, '#000'); r(x + 13, hy + 1, CARD.w - 17, 6, '#4a0e1a'); const f = Math.round((CARD.w - 17) * clamp(hp / maxHp(i), 0, 1));
  r(x + 13, hy + 1, f, 6, dead ? '#555' : '#e8283c'); r(x + 13, hy + 1, f, 2, dead ? '#666' : '#ff7a8a'); txt(hp + '/' + maxHp(i), x + CARD.w - 5, hy + 1.5, '#fff', 'right', 5);
}

// painted command buttons
const BTN = [
  { a: '#d0124e', b: '#6a1aa8', lab: () => 'FIGHT!', deco: 'burst' },
  { a: '#4a26b0', b: '#d04ad8', lab: () => CH[B.act].skill[0].toUpperCase(), deco: 'spark' },
  { a: '#0a7a80', b: '#30d8b0', lab: () => 'ITEMS', deco: 'dots' },
  { a: '#2234c0', b: '#5a1aa8', lab: () => 'RUN...', deco: 'wave' }];
function hexMix(a, b, t) { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = p(a), Bc = p(b); return 'rgb(' + A.map((v, i) => Math.round(v + (Bc[i] - v) * t)).join(',') + ')' }
function drawButton(k, x, y, w, h, on) {
  const s = BTN[k];
  r(x - 1, y - 1, w + 2, h + 2, '#000'); r(x, y, w, h, on ? '#fff' : '#6a6a7a');
  for (let i = 0; i < w - 2; i += 2) r(x + 1 + i, y + 1, 2, h - 2, hexMix(s.a, s.b, i / (w - 2)));
  r(x + 1, y + 1, w - 2, 2, 'rgba(255,255,255,.18)'); r(x + 1, y + h - 3, w - 2, 2, 'rgba(0,0,0,.22)');
  const mx = x + w / 2, my = y + h / 2;
  if (s.deco == 'burst') { const sp = (rx, ry, c, n) => { X.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * 6.283 + (on ? tick / 60 : 0), k = i % 2 ? .55 : 1; X.lineTo(mx + Math.cos(a) * rx * k, my + Math.sin(a) * ry * k) } X.closePath(); X.fillStyle = c; X.fill() };
    sp(34, 11, on ? '#ff6a1a' : '#a8402a', 11); sp(26, 8, on ? '#ffb02a' : '#a8702a', 11) }
  if (s.deco == 'spark') for (let i = 0; i < 6; i++) { const ph = (tick / 6 + i * 7) % 20; if (ph < 10) { const sx = x + 6 + ((i * 37) % (w - 12)), sy = y + 3 + ((i * 13) % (h - 6)); r(sx, sy - 1, 1, 3, '#fff'); r(sx - 1, sy, 3, 1, '#fff') } }
  if (s.deco == 'dots') for (let i = 0; i < 8; i++) r(x + 5 + i * ((w - 10) / 7), y + h - 5 + Math.round(Math.sin(tick / 9 + i) * 1), 1, 1, 'rgba(255,255,255,.6)');
  if (s.deco == 'wave') for (const [x0, x1] of [[x + 4, mx - 20], [mx + 20, x + w - 4]]) for (let q = x0; q < x1; q++) r(q, my + Math.round(Math.sin((q + tick / 3) / 3) * 1.5), 1, 1, '#fff');
  const lab = s.lab(), sz = lab.length > 9 ? 7 : 9, ty = my - sz / 2 - .5; for (const [dx, dy] of [[-.75, 0], [.75, 0], [0, -.75], [0, .75], [.75, .75]]) txt(lab, mx + dx, ty + dy, '#1a0a20', 'center', sz); txt(lab, mx, ty, '#fff', 'center', sz);
  if (!on) r(x, y, w, h, 'rgba(8,6,20,.5)');
  else { const hx = x + 5 + Math.round(Math.sin(tick / 6) * 2), hy = my - 3;   // a little pointing glove
    r(hx, hy + 1, 5, 4, '#000'); r(hx + 5, hy + 1, 6, 2, '#000'); r(hx + 1, hy + 2, 4, 2, '#fff'); r(hx + 5, hy + 2, 5, 1, '#fff'); r(hx - 2, hy + 1, 2, 4, '#d0124e') }
}
function box(x, y, w, h) { r(x - 1, y - 1, w + 2, h + 2, '#000'); r(x, y, w, h, '#fff'); r(x + 1, y + 1, w - 2, h - 2, '#000') }

drawBattle = function () {
  const mp = areaMap(S.a); sW(); r(0, 0, VW, VH, '#000'); X.drawImage(mp.im, -CAM.x, -CAM.y); drawPropSprites(mp, CAM.x, CAM.y); X.drawImage(mp.tp, -CAM.x, -CAM.y); r(0, 0, VW, VH, 'rgba(8,6,20,.72)');
  for (let i = 0; i < 6; i++) ell(320, 190, 240 - i * 34, 130 - i * 18, 'rgba(90,40,140,.06)');
  const sx = B.shk % 2 ? 5 : 0, el = B.elunge ? Math.sin(Math.min(1, B.elunge.t / 20) * Math.PI) : 0, hurtY = B.hurt > 0 ? -4 : 0;
  if (B.hurt > 0 && B.hurt % 2) X.globalAlpha = .55; drawEnemy(B.t, 320 + sx, 330 + hurtY + el * 20, 2.5 + el * .3, true); X.globalAlpha = 1;
  sU();
  // the message box, and the enemy's plate under it
  box(74, 3, 172, 34);
  const an = CH[B.act] ? CH[B.act].n.toUpperCase() : 'HITORI', who = B.order.length > 1 ? 'What will ' + an + ' and friends do?' : 'What will ' + an + ' do?';
  const msg = B.mode == 'menu' ? who : B.mode == 'items' || B.mode == 'target' ? (B.mode == 'target' ? 'Use ' + CONS[B.use].n + ' on who?' : 'Pick something from the bag.') : B.msg;
  wrapPx(msg || '', 160, 7).slice(0, 3).forEach((s, i) => txt(s, 81, 8 + i * 9, '#fff', 'left', 7));
  r(112, 38, 96, 12, '#000'); r(112, 38, 96, 1, '#fff'); txt(EN[B.t].n.toUpperCase(), 116, 40, '#fff', 'left', 5); emoIcon(B.emo, 195, 38.5, .7);
  r(150, 42, 40, 4, '#300'); r(150, 42, 40 * clamp(B.hp / B.mh, 0, 1), 4, '#e44');
  B.order.forEach((i, j) => drawCard(i, j));
  drawFX();
  // commands
  if (B.mode == 'menu') {
    const nm = CH[B.act].n.toUpperCase(), nw = Math.ceil(tw(nm, 6)) + 10; r(74, 121, nw, 10, '#000'); r(74, 121, nw, 1, '#ffd23c'); txt(nm, 79, 122, '#ffd23c', 'left', 6);
    for (let k = 0; k < 4; k++) drawButton(k, 74 + (k >> 1) * 88, 133 + (k & 1) * 23, 84, 20, B.sel == k);
  } else if (B.mode == 'items' || B.mode == 'target') {
    const L = bagList(); box(84, 54, 152, 76); txt(B.mode == 'target' ? 'USE ' + CONS[B.use].n.toUpperCase() + ' ON:' : 'ITEMS', 90, 58, '#ffd23c', 'left', 6);
    if (B.mode == 'items') { const top = Math.max(0, B.isel - 4); L.slice(top, top + 5).forEach((id, k) => { const i = k + top, y = 69 + k * 11; if (i == B.isel) r(87, y - 1, 146, 11, '#2a2a40'); drawCons(id, 90, y - 2, .7); txt(CONS[id].n + ' x' + S.bag[id], 102, y, '#fff', 'left', 6); txt(consTag(id), 230, y, '#8f8', 'right', 5) }) }
    else B.order.forEach((i, k) => txt((B.tsel == k ? '> ' : '  ') + CH[i].n + '  ' + S.hp[i] + '/' + maxHp(i), 94, 70 + k * 11, B.tsel == k ? '#ff0' : S.hp[i] > 0 ? '#fff' : '#888', 'left', 7));
    box(74, 136, 172, 40); wrapPx(B.mode == 'items' && L[B.isel] ? CONS[L[B.isel]].d : 'Z: use   X: back', 160, 6).slice(0, 4).forEach((s, i) => txt(s, 81, 141 + i * 8, '#ddd', 'left', 6));
  }
};


// ---------------------------------------------------------------- dialogue: portraits without their painted backgrounds, sitting on black,
// and a black outline around the text box, the name tag and the portrait frame
for (const k in PORTRAITS) PORTRAITS[k] = loadImg(PORTRAITS[k].src.replace('/portraits/', '/portraits_cut/'));
const _drawDialog14 = drawDialog;
drawDialog = function () {
  if (DL && DL.q[DL.i]) { sU(); const l = DL.q[DL.i], def = LK[l.n], BX = 6, BW = 308, BH = 38, BY = H - BH - 5, ol = (x, y, w, h) => r(x - 1, y - 1, w + 2, h + 2, '#000');
    ol(BX, BY, BW, BH);
    if (def) { const PS = 42, slide = DL.sp === l.n ? (DL.slide || 0) + 1 : 1, rise = Math.min(1, slide / 8), fy = BY - PS + 1 + Math.round((1 - rise) * (PS - 2)); ol(BX + BW - PS, fy, PS, PS) }
    const tag = def ? l.n : l.n && l.n != '' ? l.n : null; if (tag) { const nw = Math.ceil(tw(tag.toUpperCase(), 8)) + 12; ol(BX, BY - 14, nw, 13) } }
  _drawDialog14();
};
