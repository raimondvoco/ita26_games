let HIDEP = 0, HIDEF = 0, XDRAW = null;   // rides hide the walking sprites and draw their own riders
// ==================== STATE ====================
let sc = 'menu', S = null, E = [], MN = null, B = null, DL = null, PO = null, XM = null, MG = null, TR = null, fade = 0, tick = 0, shake = 0, msgT = 0, msgS = '', trail = [], CAM = { x: 0, y: 0 }, ZB = { t: 0, n: '' };
let played = !!ST.get('syn_played');
const SK = i => 'syn5_s' + i, HUDC = ['#9aa8c1', '#c4b8ae', '#c8789a', '#a6b9a0'];

function eqBonus(i, k) { const e = S.eq[i] || {}; let v = 0; for (const sl of ['weapon', 'gear', 'charm']) if (e[sl] && ITEMDEF[e[sl]]) v += ITEMDEF[e[sl]][k] || 0; return v }
const bf = k => (B && B.buff ? B.buff[k] || 0 : 0);
const maxHp = i => CH[i].st0.hp + (S.lv - 1) * 6 + eqBonus(i, 'hp'), atkOf = i => CH[i].st0.atk + (S.lv - 1) * 2 + eqBonus(i, 'atk') + bf('atk');
const defOf = i => CH[i].st0.def + Math.floor((S.lv - 1) * 1.2) + eqBonus(i, 'def') + bf('def'), luckOf = i => CH[i].st0.luck + eqBonus(i, 'luck') + bf('luck');
const stageIdx = () => S ? S.day - 1 : 0;   // fights and tempers scale with the day
function newS(slot) {
  S = { slot, day: 1, a: 'w_tree', x: 0, y: 0, dir: 0, xp: 0, lv: 1, hp: [0, 0, 0, 0], emo: CH.map(c => c.emo), party: [0, 1, 2, 3], money: 12, bag: { candy: 2, cookie: 1 }, chips: 0, items: [], eq: {}, fl: {}, got: {}, fear: {}, lore: [], notes: [], seen: {}, kills: {}, t: 0, battles: 0, q: {} };
  S.hp = CH.map((c, i) => maxHp(i)); return S;
}
function giveItem(id) { if (!S.items.includes(id)) { S.items.push(id); say('Got ' + ITEMDEF[id].n + '.'); questCheck() } }
function addLore(id) { if (!S.lore.includes(id)) { S.lore.push(id); say('Journal updated.') } }
const say = m => { msgS = m; msgT = 170 }, F_ = k => !!S.fl[k];
function flag(k) { if (!S.fl[k]) { S.fl[k] = 1; questCheck() } }
const cond = e => (!e.if || S.fl[e.if]) && (!e.ifnot || !S.fl[e.ifnot]) && (!e.day || S.day >= e.day) && (!e.maxday || S.day <= e.maxday);
// ==================== AREAS: entering, transitions, entities ====================
const START = { 1: ['w_tree', 22, 14], 2: ['g_camp', 22, 20], 3: ['b_plaza', 30, 24], 4: ['n_plaza', 28, 26], 5: ['s_garden', 6, 20] };
function spawnFor(mp, from) {
  const e = mp.exits.find(q => q.to == from), w = mp.w, h = mp.h;
  if (e) { const c = (e.a + e.b) / 2 * T + 8; return e.side == 'down' ? [c, (h - 5) * T + 8] : e.side == 'up' ? [c, 5 * T + 8] : e.side == 'left' ? [5 * T + 8, c] : [(w - 6) * T + 8, c] }
  const d = mp.doors.find(q => q.to == from); if (d) return [d.x * T + 8, (d.y + 2) * T + 8];
  return safeSpot(mp);
}
function safeSpot(mp, cx0, cy0) { const cx = cx0 ?? mp.w >> 1, cy = cy0 ?? mp.h >> 1; for (let r = 0; r < 24; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const x = cx + dx, y = cy + dy; if (x > 3 && y > 3 && x < mp.w - 3 && y < mp.h - 3 && !mp.t[y * mp.w + x] && !mp.t[y * mp.w + x + 1] && !mp.t[y * mp.w + x - 1] && !mp.t[(y - 1) * mp.w + x]) return [x * T + 8, y * T + 12] } return [cx * T, cy * T] }
function go(id, from, xy) { if (!TR) TR = { t: 0, id, from, xy } }
function enter(id, from, xy) {
  S.a = id; const mp = areaMap(id), A0 = AREAS[id]; let sp = xy ? [xy[0] * T + 8, xy[1] * T + 14] : spawnFor(mp, from); if (solid2(mp, sp[0], sp[1]) || !canWalk(sp[0], sp[1])) sp = safeSpot(mp, sp[0] / T | 0, sp[1] / T | 0); S.x = sp[0]; S.y = sp[1]; trail = []; S.dir = from ? (mp.exits.find(q => q.to == from) ? ({ down: 3, up: 0, left: 2, right: 1 })[mp.exits.find(q => q.to == from).side] : 0) : 0;
  S.seen[id] = 1; S.lastEnter = id; if (S.day == 1 && !S.fl.d1_ready && D1_AREAS.filter(a => S.seen[a]).length >= 4) { S.fl.d1_ready = 1; S.pendEv = EV.dusk }
  makeEnts(); ZB = { t: A0.nm ? 170 : 0, n: A0.nm }; S.goalT = 300; S.talked = S.talked || {};
  const tk = AREA_TALK[id + ':' + S.day] ? id + ':' + S.day : AREA_TALK[id] ? id : null; if (tk && !S.talked[tk]) { S.talked[tk] = 1; S.pendTalk = AREA_TALK[tk] }
}
const solid2 = (mp, px, py) => { const x = px / T | 0, y = py / T | 0; return x < 0 || y < 0 || x >= mp.w || y >= mp.h || mp.t[y * mp.w + x] != 0 };
function makeEnts() {
  const mp = areaMap(S.a), A0 = AREAS[S.a]; E = []; const rn = rng(S.a.length * 77 + S.day), T_ = T;
  for (const d of A0.ents) { if (!cond(d)) continue; const px = d.at[0] * T_ + 8, py = d.at[1] * T_ + 14;
    if (d.k == 'enemy') { if (S.day > (d.maxday || 9) ) continue; for (let i = 0; i < (d.n || 1); i++) { const a = rn() * 6.28, rr = rn() * (d.r || 4) * T_; const x = px + Math.cos(a) * rr, y = py + Math.sin(a) * rr; if (canWalk(x, y)) E.push(patrolEnemy(d, x, y, rn, 'e:' + S.a + i)) } continue }
    if (d.k == 'pick' && (S.got[d.id] || (d.need && !S.fl[d.need]))) continue; if (d.k == 'chest' && S.got[d.id]) continue;
    E.push({ ...d, x: px, y: py }) }
  for (const d of mp.doors) E.push({ k: 'door', to: d.to, label: d.label, locked: d.locked, msg: d.msg, x: d.x * T_ + 8, y: d.y * T_ + 16 });
}
function solid(px, py) { const mp = areaMap(S.a), x = px / T | 0, y = py / T | 0; return x < 0 || y < 0 || x >= mp.w || y >= mp.h || mp.t[y * mp.w + x] != 0 }
const canWalk = (x, y) => !solid(x - 5, y) && !solid(x + 5, y) && !solid(x - 5, y - 3) && !solid(x + 5, y - 3);
// characters and standing objects have a body: you bump into them instead of walking through them
function entBlock(x, y) { for (const e of E) { if (e.k == 'enemy' || e.k == 'trigger' || e.k == 'door' || e.k == 'pick') continue; if (!e.block && !(e.k == 'npc' || e.k == 'chest' || e.k == 'vend' || ((e.k == 'obj' || e.k == 'deco') && !e.inv && !e.flat && !e.solid && !e.walk))) continue; if (e.open && e.open()) continue;
  const bw = e.bw || 9, bh = e.bh || 5; if (Math.abs(x - e.x) < bw && y > e.y - bh - 3 && y < e.y + bh) return e } return null }
function canMove(nx, ny) { if (!canWalk(nx, ny)) return false; const b = entBlock(nx, ny); if (!b) return true; return entBlock(S.x, S.y) === b && Math.hypot(nx - b.x, ny - b.y) > Math.hypot(S.x - b.x, S.y - b.y) }
// ---- enemies walk one fixed line back and forth; when they see you they stop, a "!" pops up, and they come for you
function patrolEnemy(d, x, y, rn, id) {
  const horiz = rn() < .5, len = (d.r || 3) + 1, step = (sx, sy) => { let k = 0; while (k < len && canWalk(x + sx * (k + 1) * T, y + sy * (k + 1) * T)) k++; return k };
  let a, b; if (horiz) { a = [x - step(-1, 0) * T, y]; b = [x + step(1, 0) * T, y] } else { a = [x, y - step(0, -1) * T]; b = [x, y + step(0, 1) * T] }
  if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 20) { const v = horiz ? [x, y - step(0, -1) * T] : [x - step(-1, 0) * T, y], w2 = horiz ? [x, y + step(0, 1) * T] : [x + step(1, 0) * T, y]; a = v; b = w2 }
  return { k: 'enemy', t: d.t, x, y, id, path: [a, b], tgt: 1, st: 'patrol', stT: 0, face: 1 };
}
function seesYou(e, d) { if (d > 78) return false; const n = Math.ceil(d / 8); for (let i = 1; i < n; i++) { const t = i / n; if (solid(e.x + (S.x - e.x) * t, e.y - 6 + (S.y - e.y) * t)) return false } return true }
function enemyMove(e, tx, ty, sp) { const dx = tx - e.x, dy = ty - e.y, dd = Math.hypot(dx, dy); if (dd < 1) return true; const vx = dx / dd * Math.min(sp, dd), vy = dy / dd * Math.min(sp, dd); if (vx) e.face = vx < 0 ? -1 : 1;
  if (canWalk(e.x + vx, e.y)) e.x += vx; if (canWalk(e.x, e.y + vy)) e.y += vy; return Math.hypot(tx - e.x, ty - e.y) < 2 }
function enemyThink(e, d) {
  e.stT++;
  if (e.st == 'patrol') { const p = e.path[e.tgt]; if (enemyMove(e, p[0], p[1], .42)) { e.tgt ^= 1; e.st = 'wait'; e.stT = 0 } if (e.cd <= 0 && seesYou(e, d)) { e.st = 'alert'; e.stT = 0; beep(880, .08); beep(1180, .08) } }
  else if (e.st == 'wait') { if (e.stT > 40) { e.st = 'patrol'; e.stT = 0 } if (e.cd <= 0 && seesYou(e, d)) { e.st = 'alert'; e.stT = 0; beep(880, .08) } }
  else if (e.st == 'alert') { if (e.stT > 34) { e.st = 'chase'; e.stT = 0 } }
  else if (e.st == 'chase') { enemyMove(e, S.x, S.y, .95); if (d > 150 || e.stT > 480 || e.cd > 0) { e.st = 'lost'; e.stT = 0 } }
  else if (e.st == 'lost') { if (e.stT > 50) { e.st = 'return'; e.stT = 0 } }
  else if (e.st == 'return') { const p = e.path[e.tgt]; if (enemyMove(e, p[0], p[1], .55) || e.stT > 600) { e.st = 'patrol'; e.stT = 0 } if (e.cd <= 0 && e.stT > 60 && seesYou(e, d)) { e.st = 'alert'; e.stT = 0 } }
}
function enemyBubble(e, x, y) { const ch = e.st == 'alert' ? '!' : e.st == 'lost' ? '?' : null; if (!ch) return; const b = Math.min(1, e.stT / 6), by = y - 44 - (e.st == 'alert' ? Math.max(0, 6 - e.stT) : 0);
  r(x - 7, by - 10, 14, 14 * b, '#1a1018'); r(x - 6, by - 9, 12, 12 * b, '#fff'); r(x - 2, by + 3, 4, 3, '#fff'); if (b >= 1) { if (ch == '!') { r(x - 1, by - 7, 3, 6, '#e8283a'); r(x - 1, by, 3, 2, '#e8283a') } else { r(x - 2, by - 7, 5, 2, '#3a3a8a'); r(x + 2, by - 6, 2, 3, '#3a3a8a'); r(x, by - 4, 2, 2, '#3a3a8a'); r(x, by, 2, 2, '#3a3a8a') } } }
// ==================== UPDATE ====================
function trackFor() { if (!S) return 'menu'; const A0 = AREAS[S.a]; return (A0 && A0.mus) || 'forest' }
function worldUpdate() {
  if (TR) { TR.t++; if (TR.t == 16) { enter(TR.id, TR.from, TR.xy); if (TR.after) TR.after() } if (TR.t > 32) TR = null; return }
  if (DL) return dialogUpdate();
  if (CHO) return choUpdate();
  if (S.pendEv) { const f = S.pendEv; S.pendEv = null; f(); return } if (S.pendTalk) { const l = S.pendTalk; S.pendTalk = null; D(l); return }
  if (esc()) { pause(); return }
  if (hit.KeyX) { openXMenu(); return }
  S.t++;
  const dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0), dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0), mp = areaMap(S.a);
  if (dx || dy) {
    S.running = !!keys.ShiftLeft; const sp = (S.running ? 2.2 : 1.5) / Math.hypot(dx, dy), nx = S.x + dx * sp, ny = S.y + dy * sp;
    const x0 = S.x, y0 = S.y; if (canMove(nx, S.y)) S.x = nx; if (canMove(S.x, ny)) S.y = ny;
    if (S.x == x0 && S.y == y0) { S.stuckT = (S.stuckT || 0) + 1; if (S.stuckT > 50 && ![[2, 0], [-2, 0], [0, 2], [0, -2]].some(([a, b]) => canMove(S.x + a, S.y + b))) { const q = safeSpot(mp, S.x / T | 0, S.y / T | 0); S.x = q[0]; S.y = q[1]; S.stuckT = 0 } } else S.stuckT = 0;
    S.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); S.moving = true; S.wf = (S.wf || 0) + (S.running ? .22 : .13); trail.unshift([S.x, S.y, S.dir, S.wf]); if (trail.length > 90) trail.pop();
  } else { S.wf = 0; S.moving = false; S.running = false }
  // exits
  for (const e of mp.exits) if (S.x > e.x - 2 && S.x < e.x + e.w + 2 && S.y > e.y - 2 && S.y < e.y + e.h + 14) {
    const lockMsg = e.lock && !S.fear[e.lock] ? LOCKS[e.lock] : e.need && !S.fl[e.need] && !(e.need == 'g_slept' && S.day >= 2) ? LOCKS[e.needmsg || e.need] : null;
    if (lockMsg) { if (!S.lockT || tick - S.lockT > 120) { S.lockT = tick; const back = { down: [0, -22], up: [0, 22], left: [22, 0], right: [-22, 0] }[e.side]; S.x += back[0]; S.y += back[1]; D(lockMsg) } break }
    go(e.to, S.a); return;
  }
  for (const e of E) {
    if (e.k == 'enemy') {
      const d = Math.hypot(S.x - e.x, S.y - e.y); if (d > 400) continue; e.cd = (e.cd || 0) - 1;
      enemyThink(e, d);
      if (d < 14 && e.cd <= 0 && e.st != 'lost') { startBattle(e); return }
    }
    if (e.k == 'trigger' && !S.got['t:' + e.id] && (!e.need || S.fl[e.need]) && S.x > e.x - 8 && S.x < e.x + e.w * T && S.y > e.y - 14 && S.y < e.y + e.h * T) { if (e.once !== false) S.got['t:' + e.id] = 1; EV[e.ev](e); return }
  }
  if (ok()) { let best = null, bd = 99; const near = (x, y, r) => { const d = Math.hypot(S.x - x, S.y - y); return d < r ? d : 999 };
    for (const e of E) if (['npc', 'obj', 'pick', 'vend', 'chest', 'door', 'fire'].includes(e.k)) { const d = near(e.x, e.y, e.reach || (e.k == 'door' ? 30 : 26)); if (d < bd) { bd = d; best = e } }
    if (!HIDEF) S.party.filter(i => i != PL).forEach((i, j) => { const t = trail[Math.min((j + 1) * 14, trail.length - 1)]; if (t && hasQuest({ k: 'friend', who: i })) { const d = near(t[0], t[1], 24); if (d < bd) { bd = d; best = { k: 'friend', who: i } } } });
    if (best) interact(best) }
}
function interact(e) {
  if (e.k == 'vend') { beep(520, .1); PO = { t: 0 }; sc = 'pol'; return }
  if (e.k == 'chest') { S.got[e.id] = 1; E = E.filter(q => q !== e); beep(660, .15); if (e.item) { giveItem(e.item); return D(['|You opened the chest and found: ' + ITEMDEF[e.item].n + '!', '|' + ITEMDEF[e.item].d]) } const m = e.money || (e.snacks || 1) * 6 + 2; addMoney(m, 1); return D(['|You opened the chest and found $' + m + '.']) }
  if (e.k == 'pick') { S.got[e.id] = 1; E = E.filter(q => q !== e); beep(880, .1); if (e.item) giveItem(e.item); else if (!e.say) say('Picked up the ' + (PICKNAME[e.kind] || e.kind) + '.'); if (e.set) flag(e.set); questCheck(); if (e.say) D(e.say); return }
  if (e.k == 'door') { if (!e.to) return D(DOORMSG[e.msg] || ['|The door is locked. A sign says: BACK AT SIX.']); if (e.locked && !F_(e.locked)) return D(LOCKS[e.locked] || ['|It is locked.']); go(e.to, S.a); return }
  if (e.k == 'npc') return npcTalk(e);
  if (e.k == 'friend') return friendTalk(e.who);
  if (e.k == 'obj') return objTalk(e);
  if (e.k == 'fire') return EV.dry()
}
// ==================== DRAW ====================
function drawWorld() {
  const mp = areaMap(S.a), A0 = AREAS[S.a]; S.dkA = S.dkA || 0;
  let cx = clamp(S.x - VW / 2, 0, mp.w * T - VW), cy = clamp(S.y - VH / 2 - 8, 0, mp.h * T - VH);
  if (mp.w * T < VW) cx = -(VW - mp.w * T) / 2; if (mp.h * T < VH) cy = -(VH - mp.h * T) / 2;
  cx = Math.round(cx); cy = Math.round(cy); CAM.x = cx; CAM.y = cy;
  let ox = 0, oy = 0; if (shake > 0) { ox = (Math.random() * 4 - 2) | 0; oy = (Math.random() * 4 - 2) | 0 }
  sW(); r(0, 0, VW, VH, '#000'); X.drawImage(mp.im, -cx + ox, -cy + oy);
  const L = [], vis = e => e.x > cx - 80 && e.x < cx + VW + 80 && e.y > cy - 60 && e.y < cy + VH + 120, sx = e => Math.round(e.x - cx + ox), sy = e => Math.round(e.y - cy + oy);
  for (const e of E) if (vis(e) && e.k != 'trigger') L.push({ y: e.y + (e.k == 'obj' && e.flat ? -40 : 0), f: () => { drawEntity(e, sx(e), sy(e)); if (e.k == 'enemy') enemyBubble(e, sx(e), sy(e)); if (e.k == 'npc' && hasQuest(e)) noteMark(sx(e), sy(e) - 40) } });
  drawPropSprites(mp, cx, cy, ox, oy, L);
  if (XDRAW) XDRAW(L, cx, cy, ox, oy);
  if (!HIDEP) L.push({ y: S.y, f: () => drawChar(CH[PL], Math.round(S.x - cx + ox), Math.round(S.y - cy + oy), S.dir, S.moving ? 1 + Math.floor(S.wf) % 4 : 0, 1) });
  if (!HIDEF) S.party.filter(i => i != PL).forEach((i, j) => { const t = trail[Math.min((j + 1) * 14, trail.length - 1)] || [S.x - (j + 1) * 14, S.y, 0, 0]; L.push({ y: t[1] - .1, f: () => { const c = S.fade && S.fade[i] != null ? { ...CH[i], g: S.fade[i] } : CH[i], fx = Math.round(t[0] - cx + ox), fy = Math.round(t[1] - cy + oy); drawChar(c, fx, fy, t[2], S.moving ? 1 + Math.floor(t[3]) % 4 : 0, 1); if (hasQuest({ k: 'friend', who: i })) noteMark(fx, fy - 40) } }) });
  L.sort((a, b) => a.y - b.y).forEach(o => o.f());
  X.drawImage(mp.tp, -cx + ox, -cy + oy);
  for (let i = 0; i < 14; i++) { const px = (i * 97 + tick * (.2 + i % 3 * .1)) % VW, py = (i * 53 - tick * (.15 + i % 4 * .05) + VH * 8) % VH; r(px, py, 1, 1, PCOL[A0.pal] || 'rgba(255,255,255,.4)') }
  S.dkA += ((A0.dark ? 1 : 0) - S.dkA) * .08;
  if (S.dkA > .02) {
    const o = drawWorld.o || (drawWorld.o = document.createElement('canvas')); o.width = VW; o.height = VH; const g = o.getContext('2d');
    g.fillStyle = 'rgba(6,4,22,' + ((A0.darkA || .6) * S.dkA) + ')'; g.fillRect(0, 0, VW, VH); g.globalCompositeOperation = 'destination-out';
    const px = S.x - cx, py = S.y - cy - 12, rr = 160 + Math.sin(tick / 20) * 3 + (S.items.includes('lantern') ? 40 : 0), gr = g.createRadialGradient(px, py, 8, px, py, rr); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, VW, VH);
    E.filter(e => (e.k == 'fire' || e.glow) && vis(e)).forEach(e => { const q = g.createRadialGradient(e.x - cx, e.y - cy - 8, 4, e.x - cx, e.y - cy - 8, 80); q.addColorStop(0, 'rgba(0,0,0,.95)'); q.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = q; g.fillRect(0, 0, VW, VH) });
    X.drawImage(o, 0, 0);
  }
  const tn = A0.tintf ? A0.tintf() : A0.tint; if (tn) r(0, 0, VW, VH, tn);
  if (S.day == 1 && A0.pal == 'forest' && !A0.interior && !A0.tint) { if (S.fl.uku_gone) r(0, 0, VW, VH, 'rgba(30,30,110,.34)'); else if (S.fl.d1_ready) r(0, 0, VW, VH, 'rgba(255,120,60,.13)') } if (A0.pal == 'city') r(0, 0, VW, VH, 'rgba(24,0,60,.22)'); if (A0.pal == 'beach') r(0, 0, VW, VH, 'rgba(255,230,170,.05)');
  const vg = drawWorld.v || (() => { const c = document.createElement('canvas'); c.width = VW; c.height = VH; const g = c.getContext('2d'), q = g.createRadialGradient(VW / 2, VH / 2, VH * .45, VW / 2, VH / 2, VW * .62); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,.38)'); g.fillStyle = q; g.fillRect(0, 0, VW, VH); return drawWorld.v = c })();
  X.drawImage(vg, 0, 0); sU(); drawHUD(cx, cy);
  if (TR) { const a = TR.t < 16 ? TR.t / 16 : 1 - (TR.t - 16) / 16; r(0, 0, W, H, 'rgba(0,0,0,' + clamp(a, 0, 1) + ')') }
}
function noteMark(x, y) {   // a little notebook bobbing over someone who needs your help
  const b = Math.round(Math.sin(tick / 14) * 2), yy = y + b; r(x - 7, yy - 9, 14, 11, '#1a1420'); r(x - 6, yy - 8, 12, 9, '#fff'); r(x - 5, yy - 7, 10, 7, '#f4e8c0'); r(x - 1, yy - 8, 2, 9, '#c84a5a'); r(x - 4, yy - 5, 2, 1, '#8a7a5a'); r(x + 2, yy - 5, 2, 1, '#8a7a5a'); r(x - 4, yy - 3, 2, 1, '#8a7a5a'); r(x + 2, yy - 3, 2, 1, '#8a7a5a'); r(x - 1, yy + 2, 2, 2, '#1a1420')
}
function drawHUD(cx, cy) {   // stays out of the way: the goal shows when you arrive somewhere or it changes
  const g = goalText(); if (g !== S.lastGoal) { S.lastGoal = g; S.goalT = 360 }
  if (S.goalT > 0 && !DL) { S.goalT--; const a = Math.min(1, S.goalT / 40); X.globalAlpha = a; const w2 = Math.min(250, tw(g, 6) + tw('DAY 5', 6) + 22); r(W - w2 - 3, 3, w2, 13, 'rgba(0,0,0,.72)'); r(W - w2 - 3, 3, w2, 1, '#fff'); txt(g, W - 9, 5, '#fff', 'right', 6); txt('DAY ' + S.day, W - w2 + 2, 5, '#9a9ab0', 'left', 6); X.globalAlpha = 1 }
  if (ZB.t > 0) { ZB.t--; if (!DL && !TR) { const a = Math.min(1, ZB.t / 30, (170 - ZB.t) / 15); X.globalAlpha = a; r(70, H - 22, 180, 16, '#000'); r(70, H - 22, 180, 1, '#fff'); r(70, H - 7, 180, 1, '#fff'); r(70, H - 22, 1, 16, '#fff'); r(249, H - 22, 1, 16, '#fff'); txt(ZB.n.toUpperCase(), W / 2, H - 19, '#fff', 'center', 8); X.globalAlpha = 1 } }
  if (msgT > 0) { msgT--; const w2 = tw(msgS, 6) + 12; r(W / 2 - w2 / 2, 108, w2, 12, 'rgba(10,8,22,.85)'); txt(msgS, W / 2, 109, '#ff8', 'center', 6) }
  if (!DL && !TR) { let near = null, bd = 99; const chk = (x, y, lab, rr) => { const d = Math.hypot(S.x - x, S.y - y); if (d < rr && d < bd) { bd = d; near = [x, y, lab] } };
    for (const e of E) { if (e.k == 'npc') chk(e.x, e.y, ND[e.id] ? ND[e.id].n : e.id[0].toUpperCase() + e.id.slice(1), 26); else if (e.k == 'obj' && !e.quiet) chk(e.x, e.y - (e.h || 0), '', 26); else if (e.k == 'pick') chk(e.x, e.y, 'Pick up', 22); else if (e.k == 'vend') chk(e.x, e.y - 24, 'Save', 26); else if (e.k == 'chest') chk(e.x, e.y - 8, 'Open', 24); else if (e.k == 'door') chk(e.x, e.y - 20, e.label || 'Enter', 30) }
    if (near) txt('[Z]' + (near[2] ? ' ' + near[2] : ''), (near[0] - cx) / 2, (near[1] - cy) / 2 - 30, '#fff', 'center', 6) }
  if (DL) drawDialog(); if (CHO) drawChoice();
}
