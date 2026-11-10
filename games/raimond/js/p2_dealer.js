// ==================== PART TWO: the dream. A table, one lamp, a man with no face, and blackjack ====================
// Every hand you finish (win, lose or tie, it makes no difference) he tells you a little more. Seven hands, then you wake.
const DLR = { built: false, world: null, dealer: null, head: null, lamp: null, cards: null, swing: 0, hands: 0, info: 0, stats: { w: 0, l: 0, p: 0 } };
function cardTex(rank, suit) {
  const k = 'card_' + rank + suit; if (TX[k]) return k;
  tex(k, 64, (g, s) => { g.clearRect(0, 0, s, s); g.fillStyle = '#ece6d8'; g.fillRect(11, 0, 42, 64); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(11, 62, 42, 2);
    const red = suit == '♥' || suit == '♦'; g.fillStyle = red ? '#9a1a1a' : '#14141a'; g.font = 'bold 11px monospace'; g.textBaseline = 'top'; g.fillText(rank, 14, 2); g.font = '10px monospace'; g.fillText(suit, 14, 12);
    g.font = 'bold 22px serif'; g.textAlign = 'center'; g.fillText(suit, 32, 22); g.save(); g.translate(50, 61); g.rotate(Math.PI); g.font = 'bold 11px monospace'; g.textAlign = 'left'; g.fillText(rank, 0, 0); g.restore() });
  return k;
}
function buildDealer() {
  if (DLR.built) return; texAll(); texModels(); texBody(); DLR.built = true;
  tex('cardbk', 64, (g, s) => { g.clearRect(0, 0, s, s); g.fillStyle = '#ece6d8'; g.fillRect(11, 0, 42, 64); g.fillStyle = '#4a0e14'; g.fillRect(13, 2, 38, 60); g.strokeStyle = '#8a2a2a'; for (let i = -64; i < 64; i += 5) { g.beginPath(); g.moveTo(13 + i, 2); g.lineTo(13 + i + 60, 62); g.stroke() } g.clearRect(0, 0, 11, 64); g.clearRect(53, 0, 11, 64) });
  tex('concrete', 64, (g, s) => { texNoise(g, s, '#2a2826', .2, 41, 2); for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect((i * 23) % s, 0, 2, s) } for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(40,30,20,.25)'; g.fillRect((i * 17) % s, 20 + i * 5, 6, 30) } });
  tex('leather', 32, (g, s) => texNoise(g, s, '#2a1a14', .14, 42, 1));
  tex('suitb', 64, (g, s) => { texNoise(g, s, '#16141c', .1, 43, 1); for (let x = 0; x < s; x += 6) { g.fillStyle = 'rgba(90,90,110,.12)'; g.fillRect(x, 0, 1, s) } });
  tex('shirt', 16, (g, s) => texNoise(g, s, '#d8d4cc', .05, 44, 1)); tex('tie', 16, (g, s) => texNoise(g, s, '#5a0e14', .1, 45, 1)); tex('skind', 16, (g, s) => texNoise(g, s, '#b8a49a', .06, 46, 1));
  const mb = new MB();
  mb.box('concrete', -4, -.1, -4, 4, 0, 4, { skip: 'nsewb', us: 1.5 }); mb.box('concrete', -4, 0, -3.2, 4, 4, -3, { us: 1.5 }); mb.box('concrete', -3.2, 0, -4, -3, 4, 4, { us: 1.5 }); mb.box('concrete', 3, 0, -4, 3.2, 4, 4, { us: 1.5 }); mb.box('concrete', -4, 4, -4, 4, 4.1, 4, { us: 1.5 });
  mb.box('metal', -3, 3.5, -3, 3, 3.56, -2.9); mb.tube('metal', [[-3, 3.2, -2.95], [3, 3.2, -2.95]], [.04, .04], { seg: 8 }); mb.box('lacquer', 1.6, 0, -2.99, 2.5, 2.1, -2.95);   // a pipe, a dark door
  // the table: worn green felt, a padded leather rail, a heavy wooden base on thick legs
  mb.box('felt', -1.05, .76, -1.0, 1.05, .8, .6, { us: .9 }); for (const [x0, z0, x1, z1] of [[-1.15, -1.1, 1.15, -.98], [-1.15, .58, 1.15, .7], [-1.15, -1.1, -1.03, .7], [1.03, -1.1, 1.15, .7]]) mb.box('leather', x0, .74, z0, x1, .86, z1, { bev: .04 });
  mb.box('walnut', -1.1, .6, -1.05, 1.1, .76, .65, { us: 1 }); for (const [x, z] of [[-.95, -.9], [.95, -.9], [-.95, .5], [.95, .5]]) mb.lathe('walnut', [[.07, 0], [.05, .1], [.045, .5], [.06, .6]], { cx: x, cz: z, seg: 10 });
  mb.decal('felt', 0, .801, -.2, 1.4, .02, 't', [.9, .85, .6, .3]);   // a faded line in the felt
  // a card shoe, chips, a pill bottle that shouldn't be here, an ashtray
  mb.at(.7, .8, -.45, -.3, m => { m.box('lacquer', -.09, 0, -.14, .09, .1, .14, { bev: .015 }); m.box('cardbk', -.07, .1, -.1, .07, .101, .1, { skip: 'nsewb', fit: 1 }) });
  for (const [x, z, n, c] of [[-.8, -.15, 6, [.6, .1, .1]], [-.7, -.06, 4, [.1, .2, .5]], [-.85, -.02, 3, [.8, .8, .75]], [.62, .2, 5, [.6, .1, .1]]]) for (let i = 0; i < n; i++) mb.lathe('chips', [[.035, .8 + i * .012], [.035, .811 + i * .012]], { cx: x + Math.sin(i * 1.7) * .003, cz: z, seg: 12, cap: 't', col: [...c, 0] });
  mb.at(-.5, .8, .32, .4, m => MOD.pills(m)); mb.lathe('glass', [[.06, .8], [.07, .82], [.05, .825]], { cx: .82, cz: -.85, seg: 12, cap: 'b' });
  // his chair, behind him; your chair, under you
  mb.at(0, 0, -1.55, PI, m => MOD.chair(m, 'walnut', 'leather')); mb.at(0, 0, 1.1, 0, m => MOD.chair(m, 'walnut', 'leather'));
  DLR.world = mb.build();
  // the dealer: a dark suit, a white shirt and a dark red tie, white cuffs, pale hands flat on the felt
  const d = new MB();
  d.lathe('suitb', [[.17, .62], [.18, .75], [.19, .95], [.21, 1.2], [.2, 1.32], [.13, 1.38], [.06, 1.42]], { cz: -1.42, seg: 16, sz: .62, ur: 2 });
  d.lathe('shirt', [[.055, 1.32], [.055, 1.43]], { cz: -1.42, seg: 10, sz: .9 }); d.box('shirt', -.05, 1.15, -1.556, .05, 1.38, -1.53); d.box('tie', -.022, 1.0, -1.562, .022, 1.37, -1.552); d.box('tie', -.03, 1.33, -1.563, .03, 1.38, -1.553);
  for (const s of [-1, 1]) { d.box('suitb', s * .02, 1.0, -1.555, s * .1, 1.33, -1.54) }
  for (const s of [-1, 1]) { const S = [s * .22, 1.3, -1.42], E = [s * .27, .98, -1.18], Wr = [s * .22, .85, -.9];
    d.sphere('suitb', S[0], S[1], S[2], .075, .075, .075, { seg: 10, rings: 6 }); d.tube('suitb', [S, E], [.065, .058], { seg: 10 }); d.tube('suitb', [E, Wr], [.058, .055], { seg: 10 }); d.tube('shirt', [V3.lerp(E, Wr, .92), V3.lerp(E, Wr, 1.04)], [.045, .045], { seg: 10 }) }
  DLR.dealer = d.build();
  const hd = new MB(); hd.lathe('skind', [[.045, -.02], [.042, .08]], { seg: 10 });
  hd.sphere('dealerface', 0, .16, 0, .09, .115, .1, { seg: 18, rings: 12, morph: (p) => { const k = (.16 - p[1]) / .115; if (k > 0) { p[0] *= 1 - .3 * k * k } return p } });
  hd.sphere('lacquer', 0, .175, .008, .095, .11, .102, { seg: 18, rings: 10, keep: (th, ph) => ph < 1.1 || (Math.abs(th) > 1.4 && ph < 1.9) });
  DLR.head = hd.build();
  DLR.handL = handObj(-1, .15, 'skind'); DLR.handR = handObj(1, .15, 'skind');
  // the lamp: a cable from the dark, a conical metal shade, a bare bulb
  const l = new MB(); l.tube('black', [[0, 0, 0], [0, 1.4, 0]], [.006, .006], { seg: 4 }); l.lathe('metal', [[.03, .02], [.05, -.03], [.3, -.2], [.31, -.22]], { seg: 18 }); l.sphere('bulb', 0, -.14, 0, .045, .055, .045, { seg: 10, rings: 6, col: [1, 1, 1, 1] });
  DLR.lamp = l.build();
}
// ---- blackjack
const BJV = r => r == 'A' ? 11 : 'JQK'.includes(r) ? 10 : +r;
const handVal = h => { let v = 0, a = 0; for (const c of h) { v += BJV(c.r); if (c.r == 'A') a++ } while (v > 21 && a) { v -= 10; a-- } return v };
const DEALER_INFO = [
  ['???|You\'ve been asleep for a long time, Hitori.', '???|Weeks. You don\'t remember them. That\'s alright. Your body does.', '???|It forgot how to eat. How to sleep. How to be awake.'],
  ['???|There\'s a bottle on your nightstand. It\'s full.', '???|A full bottle is a promise somebody didn\'t keep.', 'Hitori|...I forgot. That\'s all. I just forgot.', '???|For six weeks.'],
  ['???|The phone calls. You don\'t remember making them.', '???|Three in the morning. Eleven times. You told them what you heard in the walls.', 'Hitori|~I DID hear them. I did.', '???|You heard something.'],
  ['???|They don\'t hate you. Not the way you think they do.', '???|They\'re tired. And they\'re frightened. Of you, a little.', '???|That isn\'t the same as hate. It only sounds the same on the phone.'],
  ['???|Someone in those photographs has been gone a long while.', '???|That\'s where it started. Somebody left first.', 'Hitori|Who? Who left? Tell me who!', '???|You know who. You keep her by your bed.'],
  ['???|She didn\'t leave because of you.', '???|She left because she was young and angry and didn\'t know how to stay.', '???|She\'s been trying to find her way back ever since.'],
  ['???|She\'s coming home, Hitori. Soon.', '???|Take your medicine. Eat something. Open the curtains.', '???|And wait for her. Whatever the house tells you. Wait.', 'Hitori|...And if I can\'t?', '???|...', '???|Wake up, Hitori.'],
];
function newDeck() { const deck = []; for (const s of '♠♥♦♣') for (const r of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) deck.push({ r, s }); for (let i = deck.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[deck[i], deck[j]] = [deck[j], deck[i]] } return deck }
function bjInit() {
  const u = { k: 'bj', deck: newDeck(), ph: [], dh: [], phase: 'deal', sel: 0, t: 0, queue: [] };
  bjDeal(u, 'p'); bjDeal(u, 'd'); bjDeal(u, 'p'); bjDeal(u, 'd', true); return u;
}
function bjDeal(u, who, hidden) { const c = { ...u.deck.pop(), t: -u.queue.filter(q => q.t < 22).length * 22, hidden, who }; const h = who == 'p' ? u.ph : u.dh; c.i = h.length; h.push(c); u.queue.push(c) }
function bjUpdate(u) {
  u.t++; for (const c of [...u.ph, ...u.dh]) { c.t++; if (c.t == 1) noiseBurst(.08, 2400, 1.5, .4) } for (const c of u.dh) if (c.flip != null) c.flip++;
  const settled = [...u.ph, ...u.dh].every(c => c.t > 22) && u.dh.every(c => c.flip == null || c.flip > 20), mx = P2MOUSE.x, my = P2MOUSE.y;
  if (u.phase == 'deal' && settled) u.phase = handVal(u.ph) == 21 ? 'reveal' : 'player';
  if (u.phase == 'player' && settled && !subsBusy()) {
    if (lf() || rt() || hit.KeyA || hit.KeyD) { u.sel = 1 - u.sel; beep(500, .03, .5) }
    let pick = -1; for (let i = 0; i < 2; i++) { const x = 116 + i * 48; if (mx > x && mx < x + 40 && my > 152 && my < 167) { if (P2MOUSE.moved) u.sel = i; if (P2MOUSE.click) pick = i } }
    if (ok() || pick >= 0) { if (pick >= 0) u.sel = pick; u.tap = 12;
      if (u.sel == 0) { bjDeal(u, 'p'); if (handVal(u.ph) > 21) u.phase = 'bust'; else if (handVal(u.ph) == 21) u.phase = 'reveal' }
      else u.phase = 'reveal' }
  }
  if (u.tap) u.tap--;
  if (u.phase == 'bust' && settled) { u.phase = 'reveal'; u.bust = 1 }
  if (u.phase == 'reveal' && settled) { const hc = u.dh.find(c => c.hidden); if (hc && hc.flip == null) { hc.flip = 0; noiseBurst(.06, 2000, 2, .4) } else if (!hc || hc.flip > 20) u.phase = 'dealer' }
  if (u.phase == 'dealer' && settled) { if (!u.bust && handVal(u.dh) < 17) bjDeal(u, 'd'); else { u.phase = 'result'; u.rt = 0 } }
  if (u.phase == 'result' && ++u.rt == 30) {
    const p = handVal(u.ph), d = handVal(u.dh), win = !u.bust && (d > 21 || p > d), push = !u.bust && p == d && d <= 21;
    DLR.hands++; DLR.stats[win ? 'w' : push ? 'p' : 'l']++; u.res = u.bust ? 'BUST' : win ? 'YOU WIN' : push ? 'PUSH' : 'HOUSE WINS';
    const res = u.bust ? ['???|Over. Too much, too fast.'] : win ? (p == 21 && u.ph.length == 2 ? ['???|Twenty-one. Lucky.'] : ['???|You won.']) : push ? ['???|A tie. Nobody wins.'] : ['???|The house wins. It usually does.'];
    say3(res, null, { voice: 'deep' }); const info = DEALER_INFO[DLR.info++] || [];
    for (const l of info) say3([l], null, l.startsWith('???') ? { voice: 'deep' } : {});
    u.phase = 'talk';
    P2.subs.push({ cb: () => { if (DLR.info >= DEALER_INFO.length) { P2.ui = null; P2.cut = { k: 'dealer', t: 0, end: 1 } } else { u.phase = 'next'; u.nt = 0 } } });
  }
  if (u.phase == 'next' && ++u.nt > 10 && (ok() || P2MOUSE.click)) { P2.ui = bjInit(); say3(['???|Again.'], null, { voice: 'deep' }) }
  P2MOUSE.click = 0; P2MOUSE.moved = 0;
}
function startDealer() {
  buildDealer(); P2.scene = 'dealer'; CAM3.x = 0; CAM3.y = 1.16; CAM3.z = 1.0; CAM3.yaw = 0; CAM3.pitch = -.2; CAM3.roll = 0; P2.blink = 1; P2.fade = 0; P2.fadeTo = 0; DLR.swing = 0; DLR.dark = 0; DLR.hands = 0; DLR.info = 0; DLR.stats = { w: 0, l: 0, p: 0 };
  P2.cut = { k: 'dealer', t: 0 };
  say3(['|...', 'Hitori|...Where am I?', '|A table. One lamp. A man sitting across from her, very still.', '|His face won\'t hold still. It slides around, like something seen through rain.']);
  say3(['???|Sit down, Hitori.'], null, { voice: 'deep' }); say3(['Hitori|...How do you know my name?']); say3(['???|Blackjack. You know how to play.'], null, { voice: 'deep' });
  say3(['Hitori|And if I don\'t want to?']); say3(['???|Then we sit here. For as long as it takes.', '???|Every hand you finish, I\'ll tell you something. Win or lose. It makes no difference.'], null, { voice: 'deep' });
  P2.subs.push({ cb: () => { P2.cut = null; P2.ui = bjInit() } });
}
function dealerCut(c) {
  const t = ++c.t;
  if (!c.end) { P2.blink = t < 60 ? 1 - t / 60 : 0; return }
  if (t == 1) SFX3.sting(); DLR.swing = Math.min(1, t / 60) * Math.sin(t / 14) * .5;
  if (t > 60) DLR.dark = (t % 9 < 4 || t > 120) ? 1 : 0;
  if (t > 120) P2.fadeTo = 1;
  if (t == 220) { P2.fade = 1; p2Stage('day2'); P2.fade = 1; P2.fadeTo = 0 }
}
function dealerFrame(dt) {
  if (!P2.cut || !P2.cut.end) { CAM3.yaw = clamp(CAM3.yaw - P2MOUSE.dx * .0022, -.7, .7); CAM3.pitch = clamp(CAM3.pitch - P2MOUSE.dy * .0022, -1.1, .35); P2MOUSE.dx = P2MOUSE.dy = 0 }
  if (P2.t % 8 == 0) { drawBlurFace(TX.dealerface.g, 32, P2.t / 8); TX.dealerface.dirty = 1 }
  const talking = P2.subs[0] && P2.subs[0].who == '???', u = P2.ui && P2.ui.k == 'bj' ? P2.ui : null;
  DLR.dealer.M = M4.tr(0, Math.sin(P2.t / 50) * .006, 0);
  const headM = M4.chain(M4.tr(0, 1.42 + Math.sin(P2.t / 50) * .006, -1.42), M4.rz(Math.sin(P2.t / 170) * .12 + (talking ? Math.sin(P2.t / 6) * .015 : 0)), M4.rx(-.12)); DLR.head.M = headM;
  DLR.lamp.M = M4.chain(M4.tr(0, 3.3, -.25), M4.rz(DLR.swing), M4.tr(0, -1.25, 0));
  // his hands: resting, or reaching out to deal the card that's flying
  const flying = u && [...u.ph, ...u.dh].find(c => c.t >= 0 && c.t < 22), reach = flying ? Math.sin(clamp(flying.t / 22, 0, 1) * Math.PI) : 0;
  const hR = V3.lerp([.24, .82, -.82], [.55, .84, -.5], reach), hL = [-.24, .82, -.84];
  const hands = [{ groups: DLR.handR.groups, M: handM(1, hR, [0, -.2, 1], [0, -1, 0]), vis: true }, { groups: DLR.handL.groups, M: handM(-1, hL, [0, -.2, 1], [0, -1, 0]), vis: true }];
  // the cards on the table
  const mb = new MB();
  if (u) for (const c of [...u.ph, ...u.dh]) { if (c.t < 0) continue; const q = clamp(c.t / 22, 0, 1), e = q * q * (3 - 2 * q), tx = -.3 + c.i * .17 + (c.who == 'd' ? .02 : 0), tz = c.who == 'p' ? .28 : -.55, sx = .7, sz = -.45;
    const x = sx + (tx - sx) * e, z = sz + (tz - sz) * e, y = .805 + Math.sin(q * Math.PI) * .12 + c.i * .001; let face = c.hidden ? 'cardbk' : cardTex(c.r, c.s), w = .12;
    if (c.flip != null) { const f = clamp(c.flip / 20, 0, 1); w = .12 * Math.abs(Math.cos(f * Math.PI)); if (f > .5) face = cardTex(c.r, c.s), c.hidden = c.flip > 19 ? false : c.hidden }
    const h = .12, rot = (1 - e) * 1.2 + (c.who == 'd' ? Math.PI : 0), cs = Math.cos(rot), sn = Math.sin(rot), P = (a, b) => [x + a * cs - b * sn, y, z + a * sn + b * cs];
    mb.quad(face, P(-w, -h), P(w, -h), P(w, h), P(-w, h)) }
  DLR.cards = dynObj(DLR.cards, mb);
  // you, sitting at the table, hands on the felt (the right one taps for another card)
  const tap = u && u.tap ? Math.sin(u.tap / 12 * Math.PI) * .05 : 0;
  const me = poseMe({ x: 0, y: 0, z: 1.06, yaw: 0, sit: 1, t: P2.t, hands: { L: { at: [-.2, .83, .58], fing: [0, -.25, -1], palm: [0, -1, 0], curl: .35 }, R: { at: [.2, .83 + tap, .56], fing: [0, -.25, -1], palm: [0, -1, 0], curl: .45 } } });
  const lamp = [Math.sin(-DLR.swing) * 1.25, 1.92, -.25], on = !DLR.dark;
  render3D({ objs: [DLR.world, DLR.dealer, DLR.head, DLR.lamp, DLR.cards, ...hands, ...me], lights: on ? [{ p: lamp, c: [1.3, 1.05, .75], r: 3.9 }, { p: [0, .3, -1.2], c: [.05, .02, .02], r: 2 }, { p: [0, 1.75, -.85], c: [.22, .18, .14], r: 1.3 }] : [], amb: on ? [.025, .02, .02] : [0, 0, 0], fog: [0, 0, 0], fogR: [2.6, 5.8], glow: on ? 1 : .2 });
}
// ---- the cards, the totals and the tally, in the corners
function card2D(c, x, y, s = 1, hidden) {
  const w = 15 * s, h = 21 * s; r(x - .5, y - .5, w + 1, h + 1, '#000'); X.fillStyle = hidden ? '#4a0e14' : '#efe9dc'; X.beginPath(); X.roundRect ? X.roundRect(x, y, w, h, 1.5 * s) : X.rect(x, y, w, h); X.fill();
  if (hidden) { X.save(); X.beginPath(); X.rect(x + 1, y + 1, w - 2, h - 2); X.clip(); X.strokeStyle = '#8a2a2a'; X.lineWidth = .5; for (let i = -h; i < w; i += 3) { X.beginPath(); X.moveTo(x + i, y); X.lineTo(x + i + h, y + h); X.stroke() } X.restore(); return }
  const red = c.s == '♥' || c.s == '♦', col = red ? '#a01a1a' : '#16161c'; ptxt(c.r, x + 1.5 * s, y + .5 * s, col, 'left', 5.5 * s, 'Georgia, serif', null); ptxt(c.s, x + w / 2, y + h / 2 - 4 * s, col, 'center', 8 * s, 'Georgia, serif', null);
}
function drawBJ(u) {
  const vis = h => h.filter(c => c.t > 22), pv = handVal(vis(u.ph)), dvv = vis(u.dh), dv = handVal(dvv.filter(c => !c.hidden));
  // the tally, top right
  const tx = 228, ty = 6; X.globalAlpha = .82; r(tx, ty, 86, 44, '#0b0a0d'); X.globalAlpha = 1; r(tx, ty, 86, 1, '#5a4a3a'); r(tx, ty + 43, 86, 1, '#5a4a3a');
  ptxt('HANDS  ' + DLR.hands, tx + 6, ty + 4, '#d8d0c0', 'left', 6, FONT, null); ptxt('W ' + DLR.stats.w + '   L ' + DLR.stats.l + '   T ' + DLR.stats.p, tx + 6, ty + 13, '#9a9088', 'left', 5.5, FONT, null);
  ptxt('HE HAS TOLD YOU', tx + 6, ty + 23, '#b0a090', 'left', 5, FONT, null); for (let i = 0; i < DEALER_INFO.length; i++) r(tx + 6 + i * 11, ty + 33, 9, 5, i < DLR.info ? '#c8a050' : '#2a2620');
  // the dealer's cards (top left) and yours (bottom left)
  X.globalAlpha = .82; r(6, 6, 104, 34, '#0b0a0d'); r(6, 140, 104, 34, '#0b0a0d'); X.globalAlpha = 1;
  ptxt('DEALER', 10, 8, '#9a9088', 'left', 5, FONT, null); ptxt(dvv.some(c => c.hidden) ? dv + ' + ?' : String(dv), 106, 8, '#d8d0c0', 'right', 6, FONT, null); dvv.forEach((c, i) => card2D(c, 10 + i * 13, 17, .95, c.hidden));
  ptxt('YOU', 10, 142, '#9a9088', 'left', 5, FONT, null); ptxt(String(pv), 106, 142, pv > 21 ? '#e05050' : pv == 21 ? '#e8c860' : '#f0e8d8', 'right', 6, FONT, null); vis(u.ph).forEach((c, i) => card2D(c, 10 + i * 13, 151, .95));
  // what to do
  if (u.phase == 'player' && !subsBusy()) { ['HIT', 'STAND'].forEach((s, i) => { const x = 116 + i * 48, on = u.sel == i; r(x, 152, 40, 15, on ? '#d8d0c0' : '#2a2620'); r(x + 1, 153, 38, 13, on ? '#14110e' : '#0b0a0d'); ptxt(s, x + 20, 155, on ? '#fff' : '#8a8078', 'center', 7, FONT, null) }); ptxt('click, or A/D then Z', 160, 170, '#5a5450', 'center', 5, FONT, null) }
  if (u.res && u.phase != 'player') ptxt(u.res, 160, 156, u.res == 'YOU WIN' ? '#e8c860' : u.res == 'PUSH' ? '#c0c0c0' : '#d05050', 'center', 9, FONT);
  if (u.phase == 'next') ptxt('Z or click: next hand', 160, 168, (P2.t >> 4) % 2 ? '#d8d0c0' : '#8a8078', 'center', 6, FONT, null);
}
