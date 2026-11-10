// ==================== v28: battle animations between moves, plus cat, sand and slot-lever sounds ====================
// Every move in a fight now plays out before its damage lands: the attacker winds up and rushes in, a streak flies
// to the enemy, the hit freezes for a beat with a flash and sparks, and the HP bar drains. Each skill has its own
// little scene. The enemy winds up and lunges before it hits, drops in when the fight starts, and crumbles when it loses.

// ---- sounds
function sWhoosh(f = 900, d = .18, v = .35, delay = 0) { noiseBurst(d, f, .9, v, delay) }
function sImpact(big) { noiseBurst(big ? .24 : .14, 380, .8, big ? .95 : .6); beep(big ? 68 : 95, big ? .26 : .14, 1.3, 'sine') }
function sChime(fs, gap = .07, type = 'triangle') { fs.forEach((f, i) => setTimeout(() => beep(f, .16, .9, type), i * gap * 1000)) }
const ACOL = { 0: '#a8c8ff', 1: '#ffe27a', 2: '#ff4a6a', 3: '#ffb070' };   // each friend's streak colour

// ---- where things are on the battle screen (UI layer, 320 x 180)
function eC() { const sp = B && EN[B.t] && ENIMG[EN[B.t].spr], im = sp && sp.big, h = im && im.naturalHeight ? im.naturalHeight * 1.25 : 50; return [160, 165 - h / 2] }
function cardC(i) { const j = slotOf(i), c = CARDXY[j] || CARDXY[0]; return [c[0] + 33, c[1] + 35] }
const ease = q => q < 0 ? 0 : q > 1 ? 1 : 1 - (1 - q) * (1 - q);

// ---- the step runner: a step can carry an animation; its effect (damage, healing) lands on the animation's hit frame
showNext = function () {
  if (!B.steps.length) { const d = B.done; B.done = null; return d && d() }
  const [text, fn, an] = B.steps.shift(); B.mode = 'msg'; B.msg = text; B.cb = showNext; B.tm = 52;
  if (an) { B.an = { ...an, t: 0, fn, fired: 0, stop: 0 }; if (an.lunge != null) B.lunge = { i: an.lunge, t: -Math.max(0, (an.hit || 11) - 11) }; an.start && an.start(B.an) }
  else fn && fn();
};
function animTick() {
  if (B.shk > 0) B.shk--; if (B.hurt > 0) B.hurt--; if (B.hitT > 0) B.hitT--; if (B.flash > 0) B.flash--;
  B.fx.forEach(f => f.t++); B.fx = B.fx.filter(f => f.t < 36); B.nums.forEach(n => { n.t++; n.y -= .45 }); B.nums = B.nums.filter(n => n.t < 52);
  if (B.lunge && ++B.lunge.t > 22) B.lunge = null; if (B.elunge && ++B.elunge.t > 22) B.elunge = null;
  if (B.hpLag == null) B.hpLag = B.hp; if (B.hpLag > B.hp) B.hpLag = Math.max(B.hp, B.hpLag - Math.max(.6, (B.hpLag - B.hp) * .07)); else B.hpLag = B.hp;
}
const _bu28 = battleUpdate;
battleUpdate = function () {
  const a = B.an;
  if (!a) { _bu28(); if (B && B.hpLag != null && B.hpLag > B.hp) B.hpLag = Math.max(B.hp, B.hpLag - Math.max(.6, (B.hpLag - B.hp) * .07)); else if (B) B.hpLag = B.hp; if (B) { B.flash = Math.max(0, (B.flash || 0) - 1); B.ptk = (B.ptk || 0) + 1; tickParts() } return }
  animTick(); tickParts(); ok();   // input waits until the move has played out
  if (a.stop > 0) { a.stop--; return }   // hit-stop: everything holds still for a beat on impact
  a.t++; a.on && a.on(a.t, a);
  if (!a.fired && a.t >= a.hit) { a.fired = 1; a.fn && a.fn(); a.stop = a.hs ?? 3; a.onHit && a.onHit(a) }
  if (a.hit2 && !a.f2 && a.t >= a.hit2) { a.f2 = 1; a.fn2 && a.fn2(); a.stop = 3; a.onHit2 && a.onHit2(a) }
  if (a.t >= a.dur) { if (!a.fired) { a.fired = 1; a.fn && a.fn() } B.an = null; B.tm = 46 }
};

// ---- particles that outlive their animation (sparks, crumbs)
function part(x, y, vx, vy, c, life = 24, g = .05, sz = 2) { (B.parts = B.parts || []).push({ x, y, vx, vy, c, t: 0, life, g, sz }) }
function tickParts() { if (!B.parts) return; for (const p of B.parts) { p.t++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .97 } B.parts = B.parts.filter(p => p.t < p.life) }
function drawParts() { if (!B.parts) return; for (const p of B.parts) { X.globalAlpha = Math.max(0, 1 - p.t / p.life); r(Math.round(p.x), Math.round(p.y), p.sz, p.sz, p.c) } X.globalAlpha = 1 }
function burst(x, y, n, cols, sp = 2.2, life = 22, g = .04) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = sp * (.4 + Math.random() * .8); part(x, y, Math.cos(a) * v, Math.sin(a) * v - .6, cols[i % cols.length], life + (Math.random() * 8 | 0), g, Math.random() < .3 ? 3 : 2) } }
function impact(big, col) { const [ex, ey] = eC(); B.flash = big ? 7 : 4; B.flashC = big ? '255,255,255' : '255,250,235'; shake = big ? 9 : 5; sImpact(big); burst(ex, ey, big ? 26 : 14, ['#fff', col, '#ffd84a'], big ? 3 : 2.2); fx('ring', { x: ex, y: ey, c: col, big }) }

// ---- drawing each animation
function star(x, y, s, c) { r(x - s, y, s * 2 + 1, 1, c); r(x, y - s, 1, s * 2 + 1, c); if (s > 1) { r(x - 1, y - 1, 3, 3, c) } }
function streak(x0, y0, x1, y1, q, col, w = 3) {   // a comet from (x0,y0) to (x1,y1), head at progress q
  for (let k = 0; k < 8; k++) { const qq = q - k * .05; if (qq < 0 || qq > 1) continue; const x = x0 + (x1 - x0) * qq, y = y0 + (y1 - y0) * qq - Math.sin(qq * Math.PI) * 10, s = Math.max(1, w - k * .35);
    X.globalAlpha = 1 - k / 8; r(Math.round(x - s / 2), Math.round(y - s / 2), Math.ceil(s), Math.ceil(s), k < 2 ? '#fff' : col) } X.globalAlpha = 1 }
function drawRing(f) { const t = f.t, R = (f.big ? 7 : 5) + t * (f.big ? 3.2 : 2.4), a = Math.max(0, 1 - t / 12); if (a <= 0) return; X.globalAlpha = a; X.strokeStyle = t < 4 ? '#fff' : f.c; X.lineWidth = f.big ? 3 : 2; X.beginPath(); X.ellipse(f.x, f.y, R, R * .75, 0, 0, 7); X.stroke(); X.globalAlpha = 1 }
const ANIM = {
  appear(a) { },   // handled where the enemy is drawn
  atk(a) {
    const [cx, cy] = cardC(a.who), [ex, ey] = eC(), col = ACOL[a.who] || '#fff', t = a.t;
    if (t < 7) { for (let i = 0; i < 4; i++) { const ang = i * 1.57 + t * .3, d = 14 - t; star(Math.round(cx + Math.cos(ang) * d), Math.round(cy + Math.sin(ang) * d * .7), 1, col) } }   // wind-up glints
    if (t >= 4 && t <= a.hit) streak(cx, cy, ex, ey, (t - 4) / (a.hit - 4), col, a.crit ? 4 : 3);
    if (a.fired && a.t - a.hit < 10) { const q = (a.t - a.hit) / 10; for (let i = 0; i < 3; i++) { const o = (i - 1) * 7, L = 26 * (1 - q * .3); X.globalAlpha = 1 - q; drawLine(ex - L / 2 + o, ey - L / 2, ex + L / 2 + o, ey + L / 2, a.crit ? 3 : 2, i == 1 ? '#fff' : col); X.globalAlpha = 1 } }
    if (a.crit && a.fired) { const q = Math.min(1, (a.t - a.hit) / 6), sz = Math.round(6 + q * 5); txt('CRITICAL!', ex, ey - 34 - q * 4, '#ffd84a', 'center', sz); }
  },
  follow(a) {
    const [cx, cy] = cardC(a.who), [ex, ey] = eC(), col = ACOL[a.who] || '#fff', t = a.t;
    if (t < 5) txt('!', cx, cy - 44 - t, '#ffd84a', 'center', 9);
    if (t >= 3 && t <= a.hit) { const q = (t - 3) / (a.hit - 3), x = cx + (ex - cx) * q, y = cy + (ey - cy) * q - Math.sin(q * Math.PI) * 34; star(Math.round(x), Math.round(y), 3, '#fff'); star(Math.round(x), Math.round(y), 1, col);
      for (let k = 1; k < 5; k++) { const qq = Math.max(0, q - k * .06), xx = cx + (ex - cx) * qq, yy = cy + (ey - cy) * qq - Math.sin(qq * Math.PI) * 34; X.globalAlpha = .6 - k * .12; r(Math.round(xx), Math.round(yy), 2, 2, col) } X.globalAlpha = 1 }
  },
  sulk(a) {   // a little rain cloud gathers over Steven, then bubbles of guard pop up around everyone
    const [cx, cy] = cardC(0), t = a.t, grow = ease(t / 14), top = cy - 18;
    X.globalAlpha = t > a.dur - 8 ? (a.dur - t) / 8 : 1;
    for (const [dx, dy, rr] of [[-10, 2, 7], [0, -2, 9], [11, 2, 7], [-4, 4, 6], [6, 4, 6]]) ell(cx + dx, top + dy, rr * grow + 1, rr * .7 * grow + 1, '#5a6478');
    for (const [dx, dy, rr] of [[-8, 0, 5], [2, -3, 6], [10, 1, 4]]) ell(cx + dx, top + dy - 1, rr * grow, rr * .6 * grow, '#7a849a');
    if (t > 8) for (let i = 0; i < 9; i++) { const y = top + 6 + ((t * 3 + i * 11) % 30); r(cx - 14 + (i * 7) % 28, y, 1, 3, '#8ab4ff') }
    X.globalAlpha = 1;
    if (a.fired) { const q = (a.t - a.hit) / (a.dur - a.hit); B.order.forEach(i => { const [px, py] = cardC(i); for (let k = 0; k < 5; k++) { const ang = k * 1.26 + q * 3, R = 36 + q * 4; X.globalAlpha = 1 - q; ell(px + Math.cos(ang) * 30, py + Math.sin(ang) * R * .9, 3, 3, 'rgba(140,190,255,.9)'); X.globalAlpha = 1 } }) }
  },
  sun(a) {   // a sun rises out of Caroline's card, spins its rays, then sprinkles light onto the party
    const [cx, cy] = cardC(1), t = a.t, q = ease(t / 20), sx = cx + (160 - cx) * q, sy = cy + (70 - cy) * q, R = 6 + q * 6;
    X.globalAlpha = t > a.dur - 10 ? (a.dur - t) / 10 : 1;
    for (let i = 0; i < 10; i++) { const ang = i * .628 + t * .06, L = R + 5 + (i % 2) * 3 + Math.sin(t / 4 + i) * 1.5; drawLine(sx + Math.cos(ang) * (R + 2), sy + Math.sin(ang) * (R + 2), sx + Math.cos(ang) * L, sy + Math.sin(ang) * L, 1, '#ffe27a') }
    ell(sx, sy, R + 2, R + 2, 'rgba(255,226,122,.35)'); ell(sx, sy, R, R, '#ffd84a'); ell(sx - 2, sy - 2, R * .5, R * .5, '#fff6c8');
    X.globalAlpha = 1;
    if (t > a.hit - 8) B.order.forEach(i => { const [px, py] = cardC(i), qq = Math.min(1, (t - a.hit + 8) / 12); for (let k = 0; k < 4; k++) { const kq = Math.max(0, qq - k * .08), x = sx + (px - sx) * kq + Math.sin(k + t / 3) * 3, y = sy + (py - sy) * kq; if (kq < 1) star(Math.round(x), Math.round(y), 1, k ? '#ffe27a' : '#fff') } });
  },
  hyst(a) {   // the screen goes red, HA HA HA, then two big slashes
    const [cx, cy] = cardC(PL), [ex, ey] = eC(), t = a.t, pulse = (Math.sin(t / 3) + 1) / 2;
    X.globalAlpha = Math.min(.32, t / 30) * (.6 + pulse * .4) * (t > a.dur - 10 ? (a.dur - t) / 10 : 1); r(0, 0, 320, 180, '#a0102a'); X.globalAlpha = 1;
    for (let k = 0; k < 6; k++) { const ang = k * 1.05 + t * .05, R = 160 + Math.sin(t / 5 + k) * 10; X.globalAlpha = .18; drawLine(160 + Math.cos(ang) * R, 90 + Math.sin(ang) * R * .6, 160 + Math.cos(ang) * (R - 60), 90 + Math.sin(ang) * (R - 60) * .6, 2, '#ff2a4a'); X.globalAlpha = 1 }
    [[2, -20, -36], [8, 18, -42], [14, -6, -50]].forEach(([s, dx, dy], i) => { const q = t - s; if (q >= 0 && q < 26) { X.globalAlpha = Math.min(1, (26 - q) / 8); const j = q < 3 ? 2 : 0; txt('HA', cx + dx + (q % 2 ? j : -j), cy + dy - q * .6, i % 2 ? '#ff7a8a' : '#fff', 'center', 8 + (q < 4 ? 3 - q : 0)); X.globalAlpha = 1 } });
    const slash = (h, dir) => { const q = (t - h) / 8; if (q < 0 || q > 1.6) return; const L = 70, p = Math.min(1, q), ax = ex - dir * L / 2, ay = ey - L / 2; X.globalAlpha = q > 1 ? 1 - (q - 1) / .6 : 1;
      drawLine(ax, ay, ax + dir * L * p, ay + L * p, 4, '#fff'); drawLine(ax + dir * 2, ay, ax + dir * 2 + dir * L * p, ay + L * p, 2, '#ff2a4a'); X.globalAlpha = 1 };
    slash(a.hit - 3, 1); slash(a.hit2 - 3, -1);
  },
  chill(a) {   // slow rings roll out of Uku's card toward the enemy; once they arrive, snow and z's settle on it
    const [cx, cy] = cardC(3), [ex, ey] = eC(), t = a.t;
    for (let k = 0; k < 4; k++) { const q = (t - k * 5) / 18; if (q < 0 || q > 1) continue; const x = cx + (ex - cx) * q, y = cy + (ey - cy) * q, R = 6 + q * 20; X.globalAlpha = (1 - q) * .9; X.strokeStyle = '#9ad8ff'; X.lineWidth = 1.5; X.beginPath(); X.ellipse(x, y, R, R * .7, 0, 0, 7); X.stroke(); X.globalAlpha = 1 }
    for (let i = 0; i < 3; i++) { const q = (t + i * 9) % 30; txt('~', cx - 8 + i * 8, cy - 40 - q * .8, 'rgba(180,230,255,' + (1 - q / 30).toFixed(2) + ')', 'center', 8) }
    if (a.fired) { const q = a.t - a.hit; for (let i = 0; i < 10; i++) { const x = ex - 30 + (i * 13) % 60 + Math.sin(q / 6 + i) * 3, y = ey - 40 + ((q * .8 + i * 9) % 70); star(Math.round(x), Math.round(y), i % 3 ? 1 : 2, i % 2 ? '#dff4ff' : '#9ad8ff') }
      for (let i = 0; i < 3; i++) { const qq = (q + i * 8) % 24; X.globalAlpha = 1 - qq / 24; txt('z', ex + 18 + qq * .6 + i * 4, ey - 26 - qq, '#cfe8ff', 'center', 6 + i); X.globalAlpha = 1 } }
  },
  item(a) {   // the item floats up out of the user's card and bursts into sparkles over whoever it's for
    const [cx, cy] = cardC(a.who), t = a.t, q = ease(t / a.hit), y = cy - 20 - q * 26, s = .9 + Math.sin(t / 3) * .05;
    if (!a.fired) { ell(cx, y + 6, 10, 10, 'rgba(255,255,255,.18)'); drawCons(a.id, cx - 8 * s, y - 8 * s, s) }
    else { const qq = (a.t - a.hit) / (a.dur - a.hit); (a.tgts || [a.who]).forEach(i => { const [px, py] = cardC(i); for (let k = 0; k < 6; k++) { const ang = k * 1.05 + qq * 4; star(Math.round(px + Math.cos(ang) * (8 + qq * 18)), Math.round(py - 10 + Math.sin(ang) * (8 + qq * 14) - qq * 10), 1, k % 2 ? '#8f8' : '#fff') } }) }
  },
  enemy(a) {   // wind-up: the enemy shudders and a red glint warns who's next; then it lunges and claws the card
    const [ex, ey] = eC(), [tx, ty] = cardC(a.tgt), t = a.t;
    if (t < 14) { const R = 30 - t * 1.4; X.globalAlpha = .5 + (t % 4 < 2 ? .4 : 0); X.strokeStyle = '#ff3a3a'; X.lineWidth = 1; X.beginPath(); X.ellipse(ex, ey, R, R * .8, 0, 0, 7); X.stroke();
      star(tx, ty - 44, t % 4 < 2 ? 2 : 1, '#ff5a4a'); X.globalAlpha = 1 }
    if (t >= 14 && t <= a.hit) streak(ex, ey, tx, ty, (t - 14) / (a.hit - 14), '#ff5a4a', 4);
    if (a.fired && a.t - a.hit < 14) { const q = (a.t - a.hit) / 14; X.globalAlpha = (1 - q) * .55; r(0, 0, 320, 180, '#5a0010'); X.globalAlpha = 1;
      for (let i = 0; i < 3; i++) { X.globalAlpha = 1 - q; drawLine(tx - 16 + i * 9, ty - 26, tx - 4 + i * 9, ty + 14, 3, i == 1 ? '#fff' : '#ff4a3a'); X.globalAlpha = 1 } }
  },
  dodge(a) {
    const [ex, ey] = eC(), [tx, ty] = cardC(a.tgt), t = a.t;
    if (t >= 10 && t <= a.hit) streak(ex, ey, tx, ty, (t - 10) / (a.hit - 10), '#ff5a4a', 3);
    if (a.fired) { const q = (a.t - a.hit) / (a.dur - a.hit); for (let k = 0; k < 4; k++) { X.globalAlpha = (1 - q) * .5; r(tx - 30 - k * 6 - q * 10, ty - 30 + k * 12, 18 + k * 3, 1, '#9ff') } X.globalAlpha = 1 }
  },
  win(a) { },   // the enemy crumbling is drawn where the enemy is drawn; its bits are particles
  run(a) { const t = a.t; for (let k = 0; k < 14; k++) { const y = 20 + (k * 37) % 150, L = 20 + (k * 13) % 30, x = ((k * 71) + t * 14) % 380 - 40; X.globalAlpha = .5; r(x, y, L, 1, '#fff'); X.globalAlpha = 1 }
    B.order.forEach(i => { const [px, py] = cardC(i); for (let k = 0; k < 3; k++) { const q = (t + k * 5) % 15; X.globalAlpha = 1 - q / 15; ell(px + (px < 160 ? -1 : 1) * (30 + q * 2), py + 30 - q, 3 + q * .4, 2 + q * .3, '#d8d0c0'); X.globalAlpha = 1 } }) },
};
const _fxDraw28 = drawFX;
drawFX = function () { for (const f of B.fx) if (f.k == 'ring') drawRing(f); _fxDraw28() };

// ---- the enemy: drops in, winds up, turns icy when chilled, crumbles when beaten
const _de28 = drawEnemy;
drawEnemy = function (kind, x, y, s = 1, big = false, wob = true) {
  if (!(sc == 'battle' && B && big && kind == B.t)) return _de28(kind, x, y, s, big, wob);
  const a = B.an; let al = 1, dx = 0, dy = 0, filt = null;
  if (a && a.k == 'appear') { const q = ease(a.t / a.dur); dy = -(1 - q) * 160; al = Math.min(1, a.t / 8); if (a.t > a.dur - 6) filt = 'brightness(' + (1 + (a.dur - a.t) * .2) + ')' }
  if (a && a.k == 'enemy' && a.t < 14) { dx = a.t % 2 ? 3 : -3; if (a.t % 4 < 2) filt = 'brightness(1.9) saturate(.3)' }
  if (a && a.k == 'chill' && a.fired) filt = 'hue-rotate(150deg) saturate(.7) brightness(1.15)';
  if (a && a.k == 'win') { const q = a.t / a.dur; al = 1 - q; dy = q * 10; filt = 'brightness(' + (1 + q * 2) + ') saturate(' + (1 - q) + ')'; if (a.t % 2 == 0 && a.t < a.dur - 6) { const [ex, ey] = eC(); for (let i = 0; i < 4; i++) part(ex - 26 + Math.random() * 52, ey - 24 + Math.random() * 48 + q * 20, (Math.random() - .5) * .8, -.6 - Math.random() * 1.4, ['#fff', '#c8b8e8', '#8a7ab0', '#3a2a5a'][i], 34, -.01, 2) } }
  if (B.gone && !(a && a.k == 'win')) return;
  X.save(); X.globalAlpha *= al; if (filt) X.filter = filt; _de28(kind, x + dx, y + dy, s, big, wob); X.restore();
};

// ---- drawn over the battle screen
const preOf = a => a.pre || null;
const _db28 = drawBattle;
drawBattle = function () {
  const a = B.an, m0 = B.msg; if (a && !a.fired && B.mode == 'msg' && preOf(a)) B.msg = preOf(a);
  _db28(); B.msg = m0;
  sU();
  if (B.hpLag != null && B.hpLag > B.hp && B.mh) { const x0 = 150 + 40 * clamp(B.hp / B.mh, 0, 1), w = 40 * clamp((B.hpLag - B.hp) / B.mh, 0, 1); r(x0, 42, w, 4, '#fff') }   // the HP bar drains behind the hit
  drawParts();
  if (a && ANIM[a.k]) ANIM[a.k](a);
  if (B.flash > 0) { X.globalAlpha = B.flash / 14; r(0, 0, 320, 180, 'rgb(' + (B.flashC || '255,255,255') + ')'); X.globalAlpha = 1 }
};

// ---- the moves, with their animations attached
const _start28 = startBattle;
startBattle = function (e) { _start28(e); B.hpLag = B.hp; B.parts = []; B.an = { k: 'appear', t: 0, dur: 26, hit: 999, fired: 1, stop: 0, on: t => { if (t == 1) sWhoosh(500, .3, .4); if (t == 22) { sImpact(false); shake = 6; const [ex] = eC(); burst(ex, 160, 12, ['#d8d0c0', '#a8a090'], 1.6, 20, .08) } } } };
followUps = function (m) {
  const out = [];
  for (const j of B.order) if (j != m && S.hp[j] > 0) {
    const ch = .42 + (S.emo[j] == 'happy' ? .2 : S.emo[j] == 'sad' ? -.2 : S.emo[j] == 'angry' ? .1 : 0) + luckOf(j) * .02;
    if (Math.random() < ch) { const r2 = dmgOf(j, .6); out.push([CH[j].n + ' follows up!' + (r2.crit ? ' CRIT!' : '') + ' ' + r2.d + ' damage.', () => { B.act = j; hitEnemy(r2.d, null, 'slash', r2.crit) },
      { k: 'follow', who: j, lunge: j, dur: 26, hit: 15, pre: CH[j].n + ' follows up!', on: t => { if (t == 3) { beep(880, .05, .6); sWhoosh(1500, .16, .25) } }, onHit: () => impact(r2.crit, ACOL[j]) }]) }
  }
  return out;
};
const _act28 = act;
act = function (k) {
  const m = B.order[B.i], c = CH[m].n;
  if (k == 0) { const r2 = dmgOf(m);
    return steps([[c + ' attacks!' + (r2.crit ? ' CRIT!' : '') + ' ' + r2.d + ' damage.', () => hitEnemy(r2.d, null, r2.crit ? 'big' : 'slash', r2.crit),
      { k: 'atk', who: m, lunge: m, crit: r2.crit, dur: r2.crit ? 40 : 32, hit: 13, hs: r2.crit ? 6 : 3, pre: c + ' attacks!', on: t => { if (t == 1) beep(r2.crit ? 520 : 420, .05, .6); if (t == 5) sWhoosh(1100, .2, .35) }, onHit: () => impact(r2.crit, ACOL[m]) }], ...followUps(m)], adv) }
  if (k == 1) {
    if (m == 0) return steps([['Steven sulks... "This won\'t end well." Team damage halved.', () => { B.g = 1; B.order.forEach(i => fx('shield', { slot: slotOf(i) })) },
      { k: 'sulk', dur: 46, hit: 24, hs: 0, on: t => { if (t == 1) beep(260, .3, .8, 'triangle'); if (t == 10) beep(196, .4, .8, 'triangle'); if (t > 8 && t % 4 == 0 && t < 24) noiseBurst(.04, 3000, 2, .12) }, onHit: () => sChime([392, 523, 659], .06, 'sine') }], setEmo(0, 'sad')].filter(Boolean), adv);
    if (m == 1) { const h = 12 + S.lv * 3;
      return steps([['Caroline\'s sunshine heals everyone ' + h + '!', () => { S.party.forEach(i => { S.hp[i] = Math.min(maxHp(i), S.hp[i] + h); if (B.order.includes(i)) { fx('heal', { slot: slotOf(i) }); num('+' + h, SLOTS[slotOf(i)][0], SLOTS[slotOf(i)][1] - 40, '#8f8') } }); beep(700, .2) },
        { k: 'sun', dur: 50, hit: 26, hs: 0, on: t => { if (t == 1) sChime([523, 659, 784, 1046], .09) }, onHit: () => { sChime([1046, 1318, 1568], .05, 'sine'); B.flash = 5; B.flashC = '255,240,190' } }], setEmo(1, 'happy')].filter(Boolean), adv) }
    if (m == PL) { const a = dmgOf(m, .7), b2 = dmgOf(m, .7);
      return steps([['Hitori cackles: "HYSTERIA!" ' + a.d + ' + ' + b2.d + ' damage!', () => { hitEnemy(a.d, null, 'big'); S.hp[m] = Math.max(1, S.hp[m] - 4) },
        { k: 'hyst', who: m, dur: 54, hit: 22, hit2: 34, fn2: () => hitEnemy(b2.d, null, 'big'), pre: 'Hitori cackles: "HYSTERIA!"',
          on: t => { if (t == 2 || t == 8 || t == 14) { beep(620 + t * 12, .07, .7, 'sawtooth'); beep(310 + t * 6, .09, .5, 'square') } if (t == 9) B.lunge = { i: m, t: 0 }; if (t == 23) B.lunge = { i: m, t: 0 }; if (t == 19 || t == 31) sWhoosh(1600, .16, .4) },
          onHit: () => { impact(true, '#ff2a4a'); B.flashC = '255,60,80' }, onHit2: () => { impact(true, '#ff2a4a'); B.flashC = '255,60,80' } }], setEmo(m, 'angry')].filter(Boolean), adv) }
    if (m == 3) return steps([['Uku: "chill." The enemy calms down.', () => { B.ch = 3; S.hp[3] = Math.min(maxHp(3), S.hp[3] + 10); fx('heal', { slot: slotOf(3) }) },
      { k: 'chill', dur: 48, hit: 22, hs: 0, on: t => { if (t == 1) beep(440, .4, .6, 'sine'); if (t == 8) beep(370, .4, .6, 'sine'); if (t == 15) beep(330, .5, .6, 'sine') }, onHit: () => sChime([988, 1318], .1, 'sine') }], setEmo(3, 'neutral')].filter(Boolean), adv);
  }
  if (k == 3 && !B.e.boss) {
    if (Math.random() < .7) return steps([['Got away!', null, { k: 'run', dur: 30, hit: 30, on: t => { if (t % 4 == 1) noiseBurst(.05, 900, 1, .25) } }]], () => { B.e.cd = 90; endBattle() });
    return steps([['Couldn\'t escape!', null, { k: 'run', dur: 16, hit: 16, on: t => { if (t == 12) { sImpact(false); shake = 4 } } }]], adv);
  }
  return _act28(k);
};
useBattleItem = function (id, t) {
  const c = CONS[id], m = B.act, msg = consUse(id, t, true);
  if (!msg) { B.mode = 'items'; beep(160, .2); return }
  const ts = c.all ? B.order.filter(j => S.hp[j] > 0) : c.buff ? B.order : [t];
  steps([[CH[m].n + ' uses ' + c.n + '! ' + msg, () => { beep(700, .15); ts.forEach(j => { fx(c.buff ? 'shield' : 'heal', { slot: slotOf(j) }); if (!c.buff) num(c.revive ? 'UP!' : '+', SLOTS[slotOf(j)][0], SLOTS[slotOf(j)][1] - 40, '#8f8') }) },
    { k: 'item', who: m, id, tgts: ts, dur: 32, hit: 16, hs: 0, pre: CH[m].n + ' uses ' + c.n + '!', on: t2 => { if (t2 == 1) beep(520, .06, .6); if (t2 == 8) beep(660, .06, .6) }, onHit: () => sChime([784, 988, 1175], .05, 'sine') }]], adv);
};
enemyTurn = function () {
  const al = B.order.filter(i => S.hp[i] > 0); if (!al.length) return lose();
  const t = al[Math.random() * al.length | 0], dodge = S.emo[t] == 'happy' && Math.random() < .1 + luckOf(t) * .02, nm = EN[B.t].n;
  B.i = -1; const g = B.g, ch = B.ch; B.g = 0; B.ch = Math.max(0, B.ch - 1);
  const growl = t2 => { if (t2 == 1) beep(90, .3, 1.2, 'sawtooth'); if (t2 == 6) beep(70, .25, 1, 'sawtooth') };
  if (dodge) return steps([[nm + ' attacks ' + CH[t].n + '... but they dodge!', () => num('MISS', SLOTS[slotOf(t)][0], SLOTS[slotOf(t)][1] - 40, '#9ff'),
    { k: 'dodge', tgt: t, dur: 30, hit: 18, hs: 0, pre: nm + ' attacks ' + CH[t].n + '...', on: t2 => { growl(t2); if (t2 == 8) B.elunge = { t: 0 }; if (t2 == 16) sWhoosh(2200, .14, .3) } }]], () => { if (!B.order.some(i => S.hp[i] > 0)) lose(); else adv() });
  let d = (B.atk + (Math.random() * 4 | 0)) * (g ? .5 : 1) * (ch ? .65 : 1) * emoMult(B.emo, S.emo[t]); d = Math.max(1, Math.round(d * (S.emo[t] == 'sad' ? .7 : S.emo[t] == 'angry' ? 1.25 : 1) - defOf(t) * .5));
  const lst = [[nm + ' hits ' + CH[t].n + ' for ' + d + '.', () => { S.hp[t] = Math.max(0, S.hp[t] - d); shake = 8; beep(120, .15, 1, 'sawtooth'); B.hit = t; B.hitT = 14; fx('claw', { slot: slotOf(t) }); num('-' + d, SLOTS[slotOf(t)][0], SLOTS[slotOf(t)][1] - 40, '#ff8a7a') },
    { k: 'enemy', tgt: t, dur: 36, hit: 22, hs: 4, pre: nm + ' attacks ' + CH[t].n + '!', on: t2 => { growl(t2); if (t2 == 12) B.elunge = { t: 0 }; if (t2 == 14) sWhoosh(700, .2, .4) }, onHit: () => { sImpact(false); const [tx, ty] = cardC(t); burst(tx, ty - 6, 12, ['#ff5a4a', '#fff', '#a0102a'], 2) } }]];
  if (S.hp[t] - d <= 0) { lst.push([CH[t].n + ' is down!', null]); B.order.forEach(j => { if (j != t && S.hp[j] > 0 && S.emo[j] != 'angry') S.emo[j] = 'angry' }) }
  else if (Math.random() < .3 && S.emo[t] != 'sad') lst.push([CH[t].n + ' feels SAD.', () => S.emo[t] = 'sad']);
  steps(lst, () => { if (!B.order.some(i => S.hp[i] > 0)) lose(); else adv() });
};
const _win28 = win;
win = function () {
  if (B.gone) return _win28();
  steps([[EN[B.t].n + ' crumbles away!', () => { B.gone = 1 }, { k: 'win', dur: 40, hit: 40, hs: 0, on: t => { if (t % 6 == 1) beep(900 - t * 15, .08, .5, 'triangle'); if (t == 1) noiseBurst(.6, 1200, .5, .3) } }]], _win28);
};

// ---------------------------------------------------------------- a stray cat: a meow, then a long purr
function catMeow(delay = 0, p = 1) {
  if (!AC) return; const t0 = AC.currentTime + delay, o = AC.createOscillator(), lfo = AC.createOscillator(), lg = AC.createGain(), g = AC.createGain(), f1 = AC.createBiquadFilter(), f2 = AC.createBiquadFilter(), out = AC.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(470 * p, t0); o.frequency.linearRampToValueAtTime(720 * p, t0 + .12); o.frequency.linearRampToValueAtTime(800 * p, t0 + .3); o.frequency.linearRampToValueAtTime(520 * p, t0 + .62);
  lfo.frequency.value = 7; lg.gain.value = 10; lfo.connect(lg); lg.connect(o.frequency);
  f1.type = 'bandpass'; f1.Q.value = 5; f1.frequency.setValueAtTime(700, t0); f1.frequency.linearRampToValueAtTime(1500, t0 + .2); f1.frequency.linearRampToValueAtTime(900, t0 + .62);   // "mi-aaa-ow"
  f2.type = 'bandpass'; f2.Q.value = 7; f2.frequency.setValueAtTime(2600, t0); f2.frequency.linearRampToValueAtTime(2200, t0 + .62);
  const v = .55 * opt.s / 10; g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .05); g.gain.setValueAtTime(v, t0 + .4); g.gain.exponentialRampToValueAtTime(.0001, t0 + .66);
  o.connect(g); g.connect(f1); g.connect(f2); f1.connect(out); f2.connect(out); out.gain.value = .9; out.connect(AC.destination);
  o.start(t0); lfo.start(t0); o.stop(t0 + .7); lfo.stop(t0 + .7);
}
function catPurr(delay = 0, dur = 2.2) {
  if (!AC) return; const sr = AC.sampleRate, n = sr * dur | 0, buf = AC.createBuffer(1, n, sr), d = buf.getChannelData(0); let lp = 0;
  for (let i = 0; i < n; i++) { const t = i / sr, breath = Math.sin(t * Math.PI / .9), inh = breath > 0 ? 1 : .7, ph = (t * (breath > 0 ? 26 : 22)) % 1, pulse = Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 4);
    lp += ((Math.random() * 2 - 1) - lp) * .12; d[i] = lp * pulse * inh * (.6 + .4 * Math.abs(breath)) * Math.min(1, t * 5, (dur - t) * 2.5) * 4 }
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = buf; f.type = 'lowpass'; f.frequency.value = 380; f.Q.value = 1.5; g.gain.value = 1.1 * opt.s / 10;
  s.connect(f); f.connect(g); g.connect(AC.destination); s.start(AC.currentTime + delay);
}
const _pet28 = EV.petcat;
EV.petcat = e => { const p = .9 + Math.random() * .25; catMeow(0, p); catPurr(.55, 2.4); _pet28(e) };

// ---------------------------------------------------------------- sand underfoot on the beach
const SANDY = { b_shore: [0, 8], b_boardwalk: [0, 8], b_plaza: [0, 8], b_hut: null };
function sandStep() { const f = 1100 + Math.random() * 700; noiseBurst(.09, f, .7, .32); noiseBurst(.05, 3400 + Math.random() * 800, 1.2, .12, .015); noiseBurst(.06, 500, .8, .18, .01) }
let _sandF = -1;
const _xd28 = XDRAW;
XDRAW = function (L, cx, cy, ox, oy) {
  if (_xd28) _xd28(L, cx, cy, ox, oy);
  if (sc != 'world' || !S || !S.moving || !(S.a in SANDY) || HIDEP) { _sandF = -1; return }
  const f = Math.floor(S.wf) % 4, mp = MP[S.a]; if (f == _sandF) return; _sandF = f; if (f != 1 && f != 3) return;
  const ok_ = SANDY[S.a]; if (ok_ && mp) { const tx = S.x / 16 | 0, ty = (S.y - 2) / 16 | 0, g = mp.gt[ty * mp.w + tx]; if (!ok_.includes(g)) return }
  sandStep();
};

// ---------------------------------------------------------------- the slot machine: a real lever on the side, and its clunk
function leverPull() {
  for (let i = 0; i < 7; i++) noiseBurst(.022, 2400 + i * 140, 3, .32, i * .032);   // the ratchet as it goes down
  noiseBurst(.18, 280, .7, .9, .25); setTimeout(() => beep(78, .22, 1.4, 'sine'), 250);   // ka-CHUNK at the bottom
  noiseBurst(.07, 1700, 2, .3, .42);   // the spring snapping it back up
  for (let i = 0; i < 4; i++) setTimeout(() => beep(180 + i * 60, .06, .5, 'triangle'), 480 + i * 45);   // the reels catching
}
const _su28 = slotsUpdate;
slotsUpdate = function () { const was = SL && SL.state; _su28(); if (SL && was == 'idle' && SL.state == 'spin') { SL.lever = 1; leverPull() } if (SL && SL.lever) SL.lever++ };
const _sd28 = slotsDraw;
slotsDraw = function () {
  _sd28(); if (!SL) return; sU();
  const t = SL.lever || 0, p = t ? (t < 10 ? t / 10 : t < 14 ? 1 : Math.max(0, 1 - (t - 14) / 10)) : 0; if (t > 24) SL.lever = 0;
  const bx = 309, by = 92, ky = Math.round(54 + p * 64);
  r(bx - 1, by - 1, 11, 22, '#000'); r(bx, by, 9, 20, '#c89a2a'); r(bx, by, 9, 2, '#f4d070'); r(bx + 2, by + 6, 5, 8, '#5a3a0a');   // the hub on the cabinet
  const sy = Math.min(ky, by + 10), sh_ = Math.abs(by + 10 - ky);
  r(bx + 3, sy, 3, sh_ + 1, '#000'); r(bx + 4, sy, 1, sh_ + 1, '#d8d8e0');   // the chrome stick
  ell(bx + 4.5, ky, 5, 5, '#000'); ell(bx + 4.5, ky, 4, 4, '#e0283c'); ell(bx + 3.5, ky - 1.5, 1.5, 1.5, '#ff9aa8');   // the red ball
};
