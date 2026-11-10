// ==================== BATTLE (OMORI-style: corners, emotions, follow-ups, scaling, attack animations) ====================
const ADV = { happy: 'sad', sad: 'angry', angry: 'happy' };   // each emotion beats the one it points at (see the Guide)
const emoMult = (a, d) => ADV[a] == d ? 1.3 : ADV[d] == a ? .75 : 1;
const EMOC = { happy: '#ffd84a', sad: '#6aa0ff', angry: '#ff5a4a', neutral: '#cfcfd8' };
const SLOTS = [[30, 74], [30, 140], [290, 74], [290, 140]];   // feet positions of the four corners
// Enemy strength is fixed by the biome you meet it in (it never grows with how many fights you've won):
//   Woods: fair up to about Lv 8 · Gloomwood & Castle: Lv 8-12 · Beach: Lv 12-16 · Neon City: Lv 16-20 · Above: Lv 20-24
// (v28: tougher. A hit early on does about 10-20 and a woods monster has about 100 HP, so a fight takes a couple of rounds.)
const TIER = [null, { hp: 100, atk: 8, xp: 30, lv: '1-8' }, { hp: 310, atk: 20, xp: 70, lv: '8-12' }, { hp: 420, atk: 31, xp: 120, lv: '12-16' }, { hp: 520, atk: 42, xp: 190, lv: '16-20' }, { hp: 620, atk: 53, xp: 260, lv: '20-24' }];
const EF = { sprout: [1, 1], bloomling: [1.3, 1.25], shadow: [1, 1], wraith: [1.25, 1.15], squire: [.85, .95], knight: [1.35, 1.25], warden: [2.4, 1.45], crab: [1, 1], hermit: [1.3, 1.15], jelly: [1.1, 1.05], glowjelly: [1.2, 1.1], glitch: [1, 1], static: [1.2, 1.15], frostling: [1, 1], house: [1.7, 1.2] };
const tierOf = a => ({ w: 1, g: 2, c: 2, b: 3, n: 4, s: 5 })[(a || 'w')[0]] || 1;
const partyHpF = () => { const n = S.party.length; return n >= 4 ? 1.15 : n == 3 ? 1 : n == 2 ? .8 : .62 };   // fewer friends, smaller monsters
function scaleEnemy(t) { const T0 = TIER[tierOf(S.a)], f = EF[t] || [1, 1]; return { hp: Math.round(T0.hp * f[0] * partyHpF()), atk: Math.round(T0.atk * f[1] * (S.party.length == 1 ? .8 : 1)), xp: Math.round(T0.xp * f[0]) } }
function startBattle(e) {
  const sc2 = scaleEnemy(e.t), alone = !!e.alone;
  if (alone) { S.backup = S.party.slice(); S.party = [PL] }
  B = { e, t: e.t, hp: sc2.hp, mh: sc2.hp, atk: sc2.atk, xp: sc2.xp, emo: ['happy', 'sad', 'angry'][Math.random() * 3 | 0], order: S.party.filter(i => S.hp[i] > 0), i: -1, sel: 0, mode: 'msg', msg: EN[e.t].n + ' appears!', cb: adv, g: 0, ch: 0, shk: 0, steps: [], alone, hurt: 0, act: -1, fx: [], nums: [], lunge: null, elunge: null, buff: {} };
  if (!B.order.length) { B.order = [PL]; S.hp[PL] = 1 }
  shake = 10; beep(200, .2); sc = 'battle'; B.tm = 50;
  B.scared = {}; const sc_ = B.order.filter(i => FEARS[i] && FEARS[i].t.includes(e.t)); sc_.forEach(i => B.scared[i] = 3);
  if (sc_.length) { const first = B.cb; B.cb = () => steps(sc_.map(i => [CH[i].n + ' is scared of ' + FEARS[i].why + '! (ATK down)', null]), first || adv) }
}
function steps(list, done) { B.steps = list; B.done = done; showNext() }
function showNext() { if (!B.steps.length) { const d = B.done; B.done = null; return d && d() } const [text, fn] = B.steps.shift(); fn && fn(); B.mode = 'msg'; B.msg = text; B.tm = 52; B.cb = showNext }
function adv() { if (B.hp <= 0) return win(); B.i++; if (B.i >= B.order.length) return enemyTurn(); const m = B.order[B.i]; if (S.hp[m] <= 0) return adv(); B.act = m;
  if (B.scared && B.scared[m] > 0 && --B.scared[m] == 0) { B.i--; B.scared[m] = -1; return steps([[CH[m].n + ' takes a deep breath. Not scared anymore!', null]], adv) }
  B.mode = 'menu'; B.sel = 0 }
// some friends are afraid of certain things: they hit for less until they calm down (3 turns)
const FEARS = { 0: { t: ['shadow', 'wraith'], why: 'ghosts' }, 1: { t: ['crab', 'hermit', 'jelly', 'glowjelly'], why: 'things that pinch and squish' }, 3: { t: ['glitch', 'static'], why: 'loud broken machines' } };
const FEARLINE = { 0: 'Steven:scared|N-nope. Ghosts are not real. That is not a real ghost.', 1: 'Caroline:scared|Eek! It\'s all pinchy and wet!', 3: 'Uku:scared|Turn it off, turn it OFF!' };
const slotOf = i => Math.max(0, B.order.indexOf(i));
const dmgOf = (m, mult = 1) => { const crit = S.emo[m] == 'happy' && Math.random() < .15 + luckOf(m) * .02, d = Math.max(1, Math.round((atkOf(m) + (Math.random() * 5 | 0)) * 1.6 * emoMult(S.emo[m], B.emo) * (S.emo[m] == 'angry' ? 1.35 : S.emo[m] == 'sad' ? .85 : 1) * mult * (B.scared && B.scared[m] > 0 ? .6 : 1) * (crit ? 1.8 : 1))); return { d, crit } };
// ---- animation helpers
function fx(k, o = {}) { B.fx.push({ k, t: 0, ...o }) }
function num(txt, x, y, c = '#fff') { B.nums.push({ txt, x, y, t: 0, c }) }
function hitEnemy(d, who, kind = 'slash', crit = false) { B.hp -= d; B.shk = 8; B.hurt = 10; beep(crit ? 220 : 300, .1); if (who != null) B.lunge = { i: who, t: 0 }; fx(kind, { x: 160 + (Math.random() * 30 - 15), y: 84 + (Math.random() * 24 - 12) }); num((crit ? '!' : '') + d, 150 + Math.random() * 20, 70, crit ? '#ffd84a' : '#fff') }
function followUps(m) {   // OMORI-style follow-up: allies jump in after an attack
  const out = [];
  for (const j of B.order) if (j != m && S.hp[j] > 0) {
    const ch = .42 + (S.emo[j] == 'happy' ? .2 : S.emo[j] == 'sad' ? -.2 : S.emo[j] == 'angry' ? .1 : 0) + luckOf(j) * .02;
    if (Math.random() < ch) { const r2 = dmgOf(j, .6); out.push([CH[j].n + ' follows up!' + (r2.crit ? ' CRIT!' : '') + ' ' + r2.d + ' damage.', () => { hitEnemy(r2.d, j, 'slash', r2.crit); B.act = j }]) }
  }
  return out;
}
function setEmo(m, e) { if (S.emo[m] != e) { S.emo[m] = e; return [CH[m].n + ' feels ' + e.toUpperCase() + '.', null] } }
function act(k) {
  const m = B.order[B.i], c = CH[m].n;
  if (k == 0) { const r2 = dmgOf(m); steps([[c + ' attacks!' + (r2.crit ? ' CRIT!' : '') + ' ' + r2.d + ' damage.', () => hitEnemy(r2.d, m, r2.crit ? 'big' : 'slash', r2.crit)], ...followUps(m)], adv) }
  if (k == 1) {
    if (m == 0) steps([['Steven sulks... "This won\'t end well." Team damage halved.', () => { B.g = 1; B.order.forEach(i => fx('shield', { slot: slotOf(i) })) }], setEmo(0, 'sad')].filter(Boolean), adv);
    if (m == 1) { const h = 12 + S.lv * 3; steps([['Caroline\'s sunshine heals everyone ' + h + '!', () => { S.party.forEach(i => { S.hp[i] = Math.min(maxHp(i), S.hp[i] + h); if (B.order.includes(i)) { fx('heal', { slot: slotOf(i) }); num('+' + h, SLOTS[slotOf(i)][0], SLOTS[slotOf(i)][1] - 40, '#8f8') } }); beep(700, .2) }], setEmo(1, 'happy')].filter(Boolean), adv) }
    if (m == PL) { const a = dmgOf(m, .7), b2 = dmgOf(m, .7); steps([['Hitori cackles: "HYSTERIA!" ' + a.d + ' + ' + b2.d + ' damage!', () => { hitEnemy(a.d, m, 'big'); setTimeout(() => B && hitEnemy(b2.d, m, 'big'), 220); S.hp[m] = Math.max(1, S.hp[m] - 4) }], setEmo(m, 'angry')].filter(Boolean), adv) }
    if (m == 3) steps([['Uku: "chill." The enemy calms down.', () => { B.ch = 3; S.hp[3] = Math.min(maxHp(3), S.hp[3] + 10); fx('wave', {}); fx('heal', { slot: slotOf(3) }) }], setEmo(3, 'neutral')].filter(Boolean), adv);
  }
  if (k == 2) { if (!bagList().length) return steps([['The bag is empty! Shops sell food and drinks.', null]], () => { B.mode = 'menu' }); B.mode = 'items'; B.isel = 0 }
  if (k == 3) { if (B.e.boss) return steps([['You can\'t run from this one!', null]], () => { B.mode = 'menu' }); if (Math.random() < .7) steps([['Got away!', null]], () => { B.e.cd = 90; endBattle() }); else steps([['Couldn\'t escape!', null]], adv) }
}
function useBattleItem(id, t) {
  const c = CONS[id], m = B.act, msg = consUse(id, t, true);
  if (!msg) { B.mode = 'items'; beep(160, .2); return }
  steps([[CH[m].n + ' uses ' + c.n + '! ' + msg, () => { beep(700, .15); const ts = c.all ? B.order.filter(j => S.hp[j] > 0) : c.buff ? B.order : [t]; ts.forEach(j => { fx(c.buff ? 'shield' : 'heal', { slot: slotOf(j) }); if (!c.buff) num(c.revive ? 'UP!' : '+', SLOTS[slotOf(j)][0], SLOTS[slotOf(j)][1] - 40, '#8f8') }) }]], adv);
}
function enemyTurn() {
  const al = B.order.filter(i => S.hp[i] > 0); if (!al.length) return lose();
  const t = al[Math.random() * al.length | 0], dodge = S.emo[t] == 'happy' && Math.random() < .1 + luckOf(t) * .02;
  B.i = -1; const g = B.g, ch = B.ch; B.g = 0; B.ch = Math.max(0, B.ch - 1);
  if (dodge) return steps([[EN[B.t].n + ' attacks ' + CH[t].n + '... but they dodge!', () => { B.elunge = { t: 0 }; num('MISS', SLOTS[slotOf(t)][0], SLOTS[slotOf(t)][1] - 40, '#9ff') }]], () => { if (!B.order.some(i => S.hp[i] > 0)) lose(); else adv() });
  let d = (B.atk + (Math.random() * 4 | 0)) * (g ? .5 : 1) * (ch ? .65 : 1) * emoMult(B.emo, S.emo[t]); d = Math.max(1, Math.round(d * (S.emo[t] == 'sad' ? .7 : S.emo[t] == 'angry' ? 1.25 : 1) - defOf(t) * .5));
  const lst = [[EN[B.t].n + ' hits ' + CH[t].n + ' for ' + d + '.', () => { S.hp[t] = Math.max(0, S.hp[t] - d); shake = 8; beep(120, .15, 1, 'sawtooth'); B.hit = t; B.hitT = 14; B.elunge = { t: 0 }; fx('claw', { slot: slotOf(t) }); num('-' + d, SLOTS[slotOf(t)][0], SLOTS[slotOf(t)][1] - 40, '#ff8a7a') }]];
  if (S.hp[t] - d <= 0) { lst.push([CH[t].n + ' is down!', null]); B.order.forEach(j => { if (j != t && S.hp[j] > 0 && S.emo[j] != 'angry') S.emo[j] = 'angry' }) }
  else if (Math.random() < .3 && S.emo[t] != 'sad') lst.push([CH[t].n + ' feels SAD.', () => S.emo[t] = 'sad']);
  steps(lst, () => { if (!B.order.some(i => S.hp[i] > 0)) lose(); else adv() });
}
function endBattle() { if (S.backup) { S.party = S.backup; S.backup = null } sc = 'world'; B = null }
function win() {
  const t = B.t, x = B.xp; S.xp += x; S.battles++; let m = 'Victory! +' + x + ' XP.';
  while (S.xp >= S.lv * 20) { S.xp -= S.lv * 20; S.lv++; S.party.forEach(i => S.hp[i] = maxHp(i)); m += ' LEVEL UP! Lv' + S.lv }
  const base = EN[t].base || t; S.kills[base] = (S.kills[base] || 0) + 1;
  S.party.forEach(i => S.hp[i] = Math.max(S.hp[i], 8)); const cash = 2 + stageIdx() * 2 + (Math.random() * 4 | 0); S.money = (S.money || 0) + cash; m += ' +$' + cash + '.';
  const e = B.e, boss = e.boss;
  E = E.filter(q => q !== e);
  steps([[m, null]], () => { endBattle(); if (boss) EV.friendsvanish(); else say(m) });
}
function lose() { steps([['Everyone collapsed... You wake up, patched up.', null]], () => { S.party.forEach(i => S.hp[i] = maxHp(i)); if (S.backup) { S.party = S.backup; S.backup = null } sc = 'world'; B = null; enter(S.a, null) }) }
function battleUpdate() {
  if (B.shk > 0) B.shk--; if (B.hurt > 0) B.hurt--; if (B.hitT > 0) B.hitT--;
  B.fx.forEach(f => f.t++); B.fx = B.fx.filter(f => f.t < 36); B.nums.forEach(n => { n.t++; n.y -= .45 }); B.nums = B.nums.filter(n => n.t < 52);
  if (B.lunge && ++B.lunge.t > 22) B.lunge = null; if (B.elunge && ++B.elunge.t > 22) B.elunge = null;
  if (B.mode == 'items') { const L = bagList(); if (!L.length) { B.mode = 'menu'; return } B.isel = Math.min(B.isel, L.length - 1);
    if (up()) B.isel = (B.isel + L.length - 1) % L.length; if (dn()) B.isel = (B.isel + 1) % L.length; if (esc() || hit.KeyX) { B.mode = 'menu'; return }
    if (ok()) { const id = L[B.isel]; beep(500, .05); if (consNeedsTarget(id)) { B.mode = 'target'; B.use = id; B.tsel = Math.max(0, B.order.indexOf(B.act)) } else useBattleItem(id, B.act) } return }
  if (B.mode == 'target') { const n = B.order.length; if (up() || lf()) B.tsel = (B.tsel + n - 1) % n; if (dn() || rt()) B.tsel = (B.tsel + 1) % n; if (esc() || hit.KeyX) { B.mode = 'items'; return } if (ok()) useBattleItem(B.use, B.order[B.tsel]); return }
  if (B.mode == 'menu') { if (up()) B.sel = (B.sel + 3) % 4; if (dn()) B.sel = (B.sel + 1) % 4; if (lf() || rt()) B.sel = (B.sel + 2) % 4; if (ok()) { beep(500, .05); act(B.sel) } }
  else { B.tm--; if (ok() || B.tm <= 0) { const c = B.cb; B.cb = null; c && c() } }
}
// ---- emotion icons: little animated chibi faces (drawn at 2x resolution so they stay detailed)
function emoIcon(e, x, y, s = 1) {
  sW(); const X0 = x * 2, Y0 = y * 2 + Math.round(Math.sin(tick / 12 + x) * 1), c = EMOC[e] || '#ccc', k = s, ink = '#14101c', R = (a, b, w, h, col) => r(X0 + a * k, Y0 + b * k, w * k, h * k, col);
  ell(X0 + 8 * k, Y0 + 8 * k, 10 * k, 10 * k, e == 'happy' ? 'rgba(255,216,74,.22)' : e == 'sad' ? 'rgba(106,160,255,.22)' : e == 'angry' ? 'rgba(255,90,74,.26)' : 'rgba(200,200,220,.12)');
  ell(X0 + 8 * k, Y0 + 8 * k, 8 * k, 8 * k, ink); ell(X0 + 8 * k, Y0 + 8 * k, 7 * k, 7 * k, c); ell(X0 + 5.5 * k, Y0 + 4.5 * k, 3 * k, 2 * k, sh(c, 1.3)); ell(X0 + 10.5 * k, Y0 + 11.5 * k, 4 * k, 2.5 * k, sh(c, .85));
  if (e == 'happy') { R(4, 7, 1, 1, ink); R(5, 6, 2, 1, ink); R(7, 7, 1, 1, ink); R(9, 7, 1, 1, ink); R(10, 6, 2, 1, ink); R(12, 7, 1, 1, ink); R(5, 10, 6, 1, ink); R(6, 11, 4, 1, '#8a2a3a'); R(3, 9, 2, 1, '#ff9ab0'); R(12, 9, 2, 1, '#ff9ab0'); const a = (tick >> 3) & 1; R(13, 0 + a, 1, 3, '#fff'); R(12, 1 + a, 3, 1, '#fff') }
  else if (e == 'sad') { R(4, 7, 2, 3, ink); R(10, 7, 2, 3, ink); R(4, 6, 1, 1, '#fff'); R(10, 6, 1, 1, '#fff'); R(3, 5, 3, 1, ink); R(10, 4, 3, 1, ink); R(6, 12, 4, 1, ink); R(5, 13, 1, 1, ink); R(10, 13, 1, 1, ink); const a = (tick >> 3) % 4; R(4, 10 + a, 1, 2, '#d8ecff'); R(4, 12 + a, 1, 1, '#fff') }
  else if (e == 'angry') { R(3, 4, 2, 1, ink); R(5, 5, 2, 1, ink); R(7, 6, 1, 1, ink); R(12, 4, 2, 1, ink); R(10, 5, 2, 1, ink); R(8, 6, 1, 1, ink); R(5, 7, 2, 2, ink); R(10, 7, 2, 2, ink); R(5, 11, 6, 2, ink); R(6, 11, 1, 1, '#fff'); R(8, 11, 1, 1, '#fff'); R(10, 11, 1, 1, '#fff'); const a = (tick >> 2) % 6; ell(X0 + 3 * k, Y0 - 1 * k - a * .4, 2 * k, 2 * k, 'rgba(255,255,255,.55)'); ell(X0 + 13 * k, Y0 - 1 * k - (5 - a) * .4, 2 * k, 2 * k, 'rgba(255,255,255,.55)') }
  else { R(5, 7, 2, 2, ink); R(10, 7, 2, 2, ink); R(5, 7, 1, 1, '#fff'); R(10, 7, 1, 1, '#fff'); R(6, 11, 5, 1, '#55555f') }
  sU();
}
function drawLine(x1, y1, x2, y2, w, col) { const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) | 0; for (let i = 0; i <= n; i++) r(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, w, w, col) }
function drawFX() {
  for (const f of B.fx) {
    if (f.t < 0) continue; const p = f.t / 14, t = f.t;
    if (f.k == 'slash' && t < 16) { for (let i = 0; i < 3; i++) { const q = Math.min(1, Math.max(0, p * 1.5 - i * .12)); drawLine(f.x - 22 + i * 9, f.y - 26, f.x - 22 + i * 9 + 40 * q, f.y - 26 + 52 * q, 2, t < 8 ? '#fff' : '#ffd84a') } }
    if (f.k == 'big' && t < 20) { const q = Math.min(1, p * 1.6); drawLine(f.x - 32, f.y - 32, f.x - 32 + 64 * q, f.y - 32 + 64 * q, 3, '#fff'); drawLine(f.x + 32, f.y - 32, f.x + 32 - 64 * q, f.y - 32 + 64 * q, 3, '#ff7a4a'); if (t < 10) { ell(f.x, f.y, 14 - t, 14 - t, 'rgba(255,255,255,.35)') } }
    if (f.k == 'claw' && t < 18) { const [px, py] = SLOTS[f.slot || 0]; for (let i = 0; i < 3; i++) { const q = Math.min(1, p * 1.5 - i * .1); drawLine(px - 10 + i * 6, py - 40, px - 10 + i * 6 + 14 * q, py - 40 + 30 * q, 2, t < 9 ? '#ff4a3a' : '#ffb0a0') } }
    if (f.k == 'heal') { const [px, py] = SLOTS[f.slot || 0]; for (let i = 0; i < 7; i++) { const a = (t * 2 + i * 13) % 36, ox = Math.sin(i * 2.1) * 16, oy = -a * .9; if (a < 30) { r(px + ox - 1, py - 14 + oy, 3, 1, '#8f8'); r(px + ox, py - 15 + oy, 1, 3, '#8f8') } } }
    if (f.k == 'shield') { const [px, py] = SLOTS[f.slot || 0], q = Math.sin(Math.min(1, t / 30) * Math.PI); ell(px, py - 22, 18, 24, 'rgba(110,170,255,' + .35 * q + ')'); ell(px, py - 22, 15, 21, 'rgba(110,170,255,' + .15 * q + ')') }
    if (f.k == 'wave') { for (let i = 0; i < 3; i++) { const q = t - i * 6; if (q > 0 && q < 24) ell(160, 84, 20 + q * 3.2, 16 + q * 2.5, 'rgba(180,200,230,' + (.25 * (1 - q / 24)) + ')') } }
  }
  B.nums.forEach(n => { const a = n.t > 36 ? 1 - (n.t - 36) / 16 : 1; X.globalAlpha = Math.max(0, a); txt(n.txt, n.x, n.y, n.c, 'center', 9); X.globalAlpha = 1 });
}
function drawBattle() {
  const mp = areaMap(S.a); sW(); r(0, 0, VW, VH, '#000'); X.drawImage(mp.im, -CAM.x, -CAM.y); drawPropSprites(mp, CAM.x, CAM.y); X.drawImage(mp.tp, -CAM.x, -CAM.y); r(0, 0, VW, VH, 'rgba(8,6,20,.66)');
  const sx = B.shk % 2 ? 5 : 0, el = B.elunge ? Math.sin(Math.min(1, B.elunge.t / 20) * Math.PI) : 0, hurtY = B.hurt > 0 ? -4 : 0;   // the enemy lunges at the party when it attacks
  if (B.hurt > 0 && B.hurt % 2) X.globalAlpha = .55; drawEnemy(B.t, 320 + sx, 300 + hurtY + el * 34, 2.6 + el * .35, true); X.globalAlpha = 1;
  sU();
  const fy = 3;
  r(104, fy, 112, 22, 'rgba(10,8,22,.85)'); r(104, fy, 112, 1, '#fff'); txt(EN[B.t].n.toUpperCase(), 108, fy + 2, '#fff', 'left', 7); emoIcon(B.emo, 200, fy + 1); r(108, fy + 13, 88, 5, '#000'); r(109, fy + 14, 86 * clamp(B.hp / B.mh, 0, 1), 3, '#e44');
  B.order.forEach((i, j) => {   // party in the four corners
    const [px, py] = SLOTS[j], left = j < 2, hp = S.hp[i], act = B.mode == 'menu' && B.act == i, bounce = act ? Math.round(Math.sin(tick / 6) * 2) : 0, hit = B.hit == i && B.hitT > 0 ? (B.hitT % 2 ? 3 : -3) : 0;
    const lp = B.lunge && B.lunge.i == i ? Math.sin(Math.min(1, B.lunge.t / 22) * Math.PI) : 0, lx = lp * 72 * (left ? 1 : -1), ly = lp * (96 - py) * .5;   // attackers rush the enemy
    sW(); X.globalAlpha = hp <= 0 ? .35 : 1; drawChar(CH[i], (px + hit + lx) * 2, (py + bounce + ly) * 2, left ? 2 : 1, lp > .05 ? 1 + (tick >> 2) % 4 : act ? 1 + (tick >> 3) % 4 : 0, 1.6); X.globalAlpha = 1; sU();
    const bx = left ? px + 16 : px - 74, by = py - 34; r(bx, by, 58, 24, act ? 'rgba(70,50,120,.95)' : 'rgba(10,8,22,.9)'); r(bx, by, 58, 1, act ? '#ffd23c' : '#fff');
    txt(CH[i].n.toUpperCase(), bx + 3, by + 2, '#fff', 'left', 6); emoIcon(S.emo[i], bx + 47, by + 1, .95); r(bx + 3, by + 12, 52, 4, '#411'); r(bx + 3, by + 12, 52 * clamp(hp / maxHp(i), 0, 1), 4, hp ? '#6e6' : '#555'); txt(hp + '/' + maxHp(i), bx + 3, by + 16, '#ddd', 'left', 5);
  });
  drawFX();
  r(98, 138, 124, 40, '#fff'); r(99, 139, 122, 38, '#000');
  if (B.mode == 'menu') { txt(CH[B.act].n.toUpperCase(), 103, 140, '#ffd23c', 'left', 6); ['Attack', CH[B.act].skill[0], 'Items', 'Run'].forEach((s, i) => txt((B.sel == i ? '> ' : '  ') + s, 103 + (i % 2) * 58, 150 + (i >> 1) * 11, B.sel == i ? '#ff0' : '#fff', 'left', 7)) }
  else if (B.mode == 'items' || B.mode == 'target') { const L = bagList(); r(90, 62, 140, 76, '#fff'); r(91, 63, 138, 74, '#000'); txt(B.mode == 'target' ? 'USE ' + CONS[B.use].n.toUpperCase() + ' ON:' : 'ITEMS', 96, 65, '#ffd23c', 'left', 6);
    if (B.mode == 'items') { const top = Math.max(0, B.isel - 4); L.slice(top, top + 5).forEach((id, k) => { const i = k + top, y = 75 + k * 11; if (i == B.isel) r(93, y - 1, 134, 11, '#2a2a40'); drawCons(id, 96, y - 2, .7); txt(CONS[id].n + ' x' + S.bag[id], 108, y, '#fff', 'left', 6); txt(consTag(id), 225, y, '#8f8', 'right', 5) }) }
    else B.order.forEach((i, k) => txt((B.tsel == k ? '> ' : '  ') + CH[i].n + '  ' + S.hp[i] + '/' + maxHp(i), 100, 76 + k * 11, B.tsel == k ? '#ff0' : S.hp[i] > 0 ? '#fff' : '#888', 'left', 7));
    txt(CH[B.act].n.toUpperCase(), 103, 140, '#ffd23c', 'left', 6); wrapPx(B.mode == 'items' && L[B.isel] ? CONS[L[B.isel]].d : 'Z: use   X: back', 114, 6).slice(0, 3).forEach((s, i) => txt(s, 104, 150 + i * 8, '#ddd', 'left', 6)) }
  else wrapPx(B.msg, 114, 7).slice(0, 4).forEach((s, i) => txt(s, 104, 142 + i * 9, '#fff', 'left', 7));
}
