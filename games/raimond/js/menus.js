// ==================== MENUS ====================
const spr = (c, x, y, d = 0, f = 0, s = 1) => { sW(); drawChar(c, x * 2, y * 2, d, f, s); sU() };   // draw a character at UI coordinates
function menu(o) { MN = Object.assign({ sel: 0 }, o); sc = 'menu' }
function summ(i) { try { const d = JSON.parse(ST.get(SK(i))); return `Slot ${i + 1}: ${(AREAS[d.a] ? AREAS[d.a].nm : '?').slice(0, 14)}  Lv${d.lv}  ${Math.floor(d.t / 3600)}m` } catch (e) { return `Slot ${i + 1}: - empty -` } }
const hasSave = () => [0, 1, 2].some(i => ST.get(SK(i)));
function title() { S = null; menu({ t: 'title', items: [{ x: 'NEW GAME', f: () => slots('new') }, { x: 'CONTINUE', d: !hasSave(), f: () => slots('load') }, { x: 'OPTIONS', f: () => options(title) }, { x: 'QUIT', f: () => { sc = 'quit' } }] }) }
function options(back) { menu({ title: 'Options', items: [{ x: () => 'Music  < ' + opt.m + ' >', l: () => opt.m = Math.max(0, opt.m - 1), r: () => opt.m = Math.min(10, opt.m + 1) }, { x: () => 'Sound  < ' + opt.s + ' >', l: () => opt.s = Math.max(0, opt.s - 1), r: () => opt.s = Math.min(10, opt.s + 1) }, { x: 'Fullscreen (F)', f: fs }, { x: 'Back', f: back }], back }) }
function slots(mode) {
  const back = mode == 'save' ? () => { sc = 'world' } : title;
  menu({ title: mode == 'new' ? 'Choose a save file' : mode == 'save' ? 'Save - pick a slot' : 'Load game', back, items: [0, 1, 2].map(i => ({ x: summ(i), d: mode == 'load' && !ST.get(SK(i)), f: () => {
    if (mode == 'new') { newS(i); ST.set('syn_played', 1); played = true; enter('w_tree', null, [23, 15]); dayCard(1, 'Whispering Woods', () => { sc = 'world'; fade = 1 }) }
    if (mode == 'load') { const d = JSON.parse(ST.get(SK(i))); S = Object.assign(newS(i), d); econFix(); S.slot = i; const sx = S.sx, sy = S.sy, a = S.a; enter(a, null); if (sx) { S.x = sx; S.y = sy } sc = 'world'; fade = 1 }
    if (mode == 'save') { S.slot = i; S.sx = S.x; S.sy = S.y; const c = S.backup; ST.set(SK(i), JSON.stringify(S)); ST.set('syn_played', 1); sc = 'world'; say('Game saved to slot ' + (i + 1) + '.'); beep(660, .2) }
  } })).concat([{ x: 'Back', f: back }]) });
}
function pause() { menu({ title: 'Paused', over: 1, items: [{ x: 'Resume', f: () => sc = 'world' }, { x: 'Items / Gear (X)', f: () => openXMenu(0) }, { x: 'Journal', f: () => openXMenu(2) }, { x: 'Guide', f: () => openXMenu(3) }, { x: 'Options', f: () => options(pause) }, { x: 'Title', f: title }], back: () => sc = 'world' }) }
// ---- title screen: the supplied animation (title + buttons removed so the engine can shake the title and move the finger)
const BG = Array.from({ length: 12 }, (_, i) => loadImg('assets/menu/bg' + String(i).padStart(2, '0') + '.jpg')), TITLE = loadImg('assets/menu/title.png'), HAND = loadImg('assets/menu/hand.png');
let handRed = null, handX = 40;
function makeHandRed() { if (handRed || !ready(HAND)) return; handRed = document.createElement('canvas'); handRed.width = HAND.naturalWidth; handRed.height = HAND.naturalHeight; const g = handRed.getContext('2d'); g.drawImage(HAND, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#e02030'; g.fillRect(0, 0, handRed.width, handRed.height) }
function drawTitle(m) {
  const f = BG[(tick / 7 | 0) % 12]; X.imageSmoothingEnabled = true; if (ready(f)) { X.drawImage(f, 0, 0, W, H); X.globalCompositeOperation = 'lighter'; X.globalAlpha = .2; X.drawImage(f, 0, 0, W, H); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over' } else r(0, 0, W, H, '#0a0a10'); X.imageSmoothingEnabled = false;   // second additive pass = a brighter room
  const j = tick % 4 == 0, spike = tick % 150 < 3, gx = (Math.random() - .5) * (spike ? 1.6 : .38), gy = (Math.random() - .5) * (spike ? 1 : .26);   // the title trembles, just barely
  if (ready(TITLE)) { if (!drawTitle.o || j) drawTitle.o = [gx, gy]; X.drawImage(TITLE, 7.5 + drawTitle.o[0], 3.7 + drawTitle.o[1], 145, 47.5); if (spike) { X.globalAlpha = .35; X.drawImage(TITLE, 7.5 - drawTitle.o[0] * 2, 3.7, 145, 47.5); X.globalAlpha = 1 } }
  if (played) txt('BACK AGAIN?', 80, 46, '#c8c0c8', 'center', 7);
  const n = m.items.length, bw = n > 4 ? 54 : 58, gap = n > 4 ? 6 : 8, x0 = Math.round((W - (n * bw + (n - 1) * gap)) / 2), by = 150; makeHandRed();
  m.items.forEach((o, i) => { const bx = x0 + i * (bw + gap); r(bx - 1, by - 1, bw + 2, 20, '#000'); r(bx, by, bw, 18, o.d ? '#666' : '#fff'); r(bx + 1, by + 1, bw - 2, 16, '#000'); txt(o.x, bx + bw / 2, by + 5, o.d ? '#666' : m.sel == i ? '#fff' : '#cfcfcf', 'center', 8) });
  const tx = x0 + m.sel * (bw + gap) - 18; handX += (tx - handX) * .25; const hy = by + 3 + Math.round(Math.sin(tick / 8) * 1), hw = 14.5, hh = 11;
  if (handRed) for (const [ox, oy] of [[-.6, 0], [.6, 0], [0, -.6], [0, .6], [-.5, -.5], [.5, .5], [-.5, .5], [.5, -.5]]) X.drawImage(handRed, handX + ox, hy + oy, hw, hh);   // red outline
  if (ready(HAND)) X.drawImage(HAND, handX, hy, hw, hh);
}
function menuUpdateDraw() {
  const m = MN; sU(); if (m.over && S) drawWorld(); else if (m.t == 'title') drawTitle(m); else r(0, 0, W, H, '#0c0a18'); sU(); if (m.over) r(0, 0, W, H, 'rgba(0,0,0,.6)');
  const it = m.items, c = it[m.sel];
  if (m.t == 'title') { const nx = (lf() ? -1 : 0) + (rt() ? 1 : 0); if (nx) { m.sel = (m.sel + nx + it.length) % it.length; if (it[m.sel].d) m.sel = (m.sel + nx + it.length) % it.length; beep(400, .04) } }
  else { if (up()) { m.sel = (m.sel + it.length - 1) % it.length; beep(400, .04) } if (dn()) { m.sel = (m.sel + 1) % it.length; beep(400, .04) } if (lf() && c.l) c.l(); if (rt() && c.r) c.r() }
  if (ok() && c.f && !c.d) { beep(600, .06); c.f() } if (esc() && m.back) m.back();
  if (sc == 'menu' && m.t != 'title') { const bw = 200, bx = (W - bw) / 2; r(bx - 8, 14, bw + 16, 26 + it.length * 12 + 6, '#fff'); r(bx - 7, 15, bw + 14, 24 + it.length * 12 + 4, '#000'); if (m.title) txt(m.title.toUpperCase(), W / 2, 19, '#fff', 'center', 9); it.forEach((o, i) => txt((m.sel == i ? '> ' : '  ') + (typeof o.x == 'function' ? o.x() : o.x), W / 2, 36 + i * 12, o.d ? '#666' : m.sel == i ? '#ff0' : '#fff', 'center', 8)) }
}
// ==================== X MENU: items, gear, journal, guide, map ====================
const TABS = ['ITEMS', 'GEAR', 'JOURNAL', 'GUIDE', 'MAP'], SLOTN = ['weapon', 'gear', 'charm'];
function openXMenu(tab = 0) { XM = { tab, sel: 0, row: 0, slot: 0, pick: null, page: 0, ps: 0 }; sc = 'xmenu'; if (tab >= 2) bookOpen(); else pageTurn() }
function equip(i, slot, id) {
  for (const k in S.eq) for (const s of SLOTN) if (S.eq[k][s] == id && id) S.eq[k][s] = null;
  S.eq[i] = S.eq[i] || {}; S.eq[i][slot] = id || null; S.hp[i] = Math.min(S.hp[i], maxHp(i)); beep(520, .08);
}
const ownedFor = slot => S.items.filter(id => ITEMDEF[id].t == slot);
const itemStats = id => ['atk', 'def', 'hp', 'luck'].filter(k => ITEMDEF[id][k]).map(k => k.toUpperCase() + ' +' + ITEMDEF[id][k]).join('  ');
function xmenuUpdateDraw() {
  const x = XM; sU(); drawWorld(); sU(); r(0, 0, W, H, 'rgba(0,0,0,.72)');
  if (hit.KeyQ || hit.PageUp) { x.tab = (x.tab + 4) % 5; x.sel = x.row = x.slot = x.ps = 0; x.pick = null; x.tab >= 2 ? bookOpen() : pageTurn() } if (hit.KeyE || hit.PageDown || hit.Tab) { x.tab = (x.tab + 1) % 5; x.sel = x.row = x.slot = x.ps = 0; x.pick = null; x.tab >= 2 ? bookOpen() : pageTurn() }
  if ((hit.KeyX || esc()) && !x.pick) { sc = 'world'; return } if ((hit.KeyX || esc()) && x.pick) x.pick = null;
  r(6, 6, 308, 168, '#fff'); r(7, 7, 306, 166, '#000');
  TABS.forEach((t, i) => { const tx = 12 + i * 60; r(tx, 10, 56, 13, i == x.tab ? '#fff' : '#555'); r(tx + 1, 11, 54, 11, i == x.tab ? '#000' : '#111'); txt(t, tx + 28, 12, i == x.tab ? '#fff' : '#888', 'center', 7) });
  txt('Q/E TAB   Z SELECT   X CLOSE', W / 2, 163, '#888', 'center', 6);
  const tab = TABS[x.tab], party = S.party.length ? S.party : [PL];
  if (tab == 'ITEMS') {
    const list = [...bagList().map(c => ({ c })), ...S.items.map(id => ({ id }))]; txt('$' + money(), 304, 13, '#8f8', 'right', 7);
    if (!list.length) { txt('Nothing yet.', 20, 30, '#888', 'left', 7); return }
    if (!x.pick) { if (up()) x.sel = (x.sel + list.length - 1) % list.length; if (dn()) x.sel = (x.sel + 1) % list.length } x.sel = Math.min(x.sel, list.length - 1);
    list.forEach((o, i) => { const y = 28 + i * 14 - Math.max(0, x.sel - 8) * 14; if (y < 26 || y > 148) return; if (x.sel == i) r(10, y - 1, 136, 14, '#2a2a40');
      if (o.c) { drawCons(o.c, 15, y - 1, .85); txt((x.sel == i ? '>' : ' ') + CONS[o.c].n, 28, y + 1, '#fff', 'left', 7); txt('x' + S.bag[o.c], 143, y + 1, '#aaa', 'right', 6) } else { drawItem(o.id, 14, y - 1, .4); txt((x.sel == i ? '> ' : '  ') + ITEMDEF[o.id].n, 30, y + 1, '#fff', 'left', 7) } });
    const cur = list[x.sel]; r(152, 28, 156, 130, '#0a0a0e'); r(152, 28, 156, 1, '#fff'); r(152, 157, 156, 1, '#fff');
    if (cur.c) { const c = CONS[cur.c]; r(158, 30, 50, 50, '#fff'); r(159, 31, 48, 48, '#14141e'); drawCons(cur.c, 169, 41, 2); txt(c.n.toUpperCase(), 212, 32, '#ffd23c', 'left', 7); txt('FOOD & DRINK', 212, 42, '#888', 'left', 6); txt(consTag(cur.c), 212, 51, c.buff ? '#9cf' : '#8f8', 'left', 6); wrapPx(c.d, 146, 7).forEach((s, i) => txt(s, 158, 86 + i * 9, '#ddd', 'left', 7));
      txt(c.buff ? 'Use it in battle.' : '[Z] USE', 158, 146, '#fff', 'left', 6); if (!c.buff && ok() && !x.pick) x.pick = { use: cur.c, who: 0 } }
    else { const d = ITEMDEF[cur.id]; r(158, 30, 50, 50, '#fff'); r(159, 31, 48, 48, '#000'); drawItem(cur.id, 159, 31, .5, true); txt(d.n.toUpperCase(), 212, 32, '#ffd23c', 'left', 7); txt(d.t.toUpperCase(), 212, 42, '#888', 'left', 6); txt(itemStats(cur.id), 212, 51, '#8f8', 'left', 6); wrapPx(d.d, 146, 7).forEach((s, i) => txt(s, 158, 86 + i * 9, '#ddd', 'left', 7));
      if (['weapon', 'gear', 'charm'].includes(d.t)) { const eqBy = party.find(i => (S.eq[i] || {})[d.t] == cur.id); txt(eqBy != null ? 'Equipped: ' + CH[eqBy].n : '[Z] EQUIP', 158, 146, '#fff', 'left', 6);
        if (ok() && !x.pick) x.pick = { who: 0, id: cur.id } } }
    if (x.pick) { const P = x.pick, use = !!P.use; r(70, 60, 180, 14 + party.length * 12, '#fff'); r(71, 61, 178, 12 + party.length * 12, '#000'); txt((use ? 'USE ' + CONS[P.use].n : 'EQUIP ' + ITEMDEF[P.id].n).toUpperCase() + ' ON:', 76, 64, '#ffd23c', 'left', 6);
      party.forEach((i, j) => txt((P.who == j ? '> ' : '  ') + CH[i].n + (use ? '   ' + S.hp[i] + '/' + maxHp(i) : ''), 80, 76 + j * 12, P.who == j ? '#ff0' : '#fff', 'left', 7)); if (up()) P.who = (P.who + party.length - 1) % party.length; if (dn()) P.who = (P.who + 1) % party.length;
      if (ok() && P.t0) { if (use) { const m = consUse(P.use, party[P.who], false); if (m) { say(m); beep(700, .12) } else beep(160, .2); x.pick = null } else { equip(party[P.who], ITEMDEF[P.id].t, P.id); x.pick = null } } x.pick && (x.pick.t0 = 1) }
  }
  if (tab == 'GEAR') {
    if (!x.pick) { if (up()) x.row = (x.row + party.length - 1) % party.length; if (dn()) x.row = (x.row + 1) % party.length; if (lf()) x.slot = (x.slot + 2) % 3; if (rt()) x.slot = (x.slot + 1) % 3 }
    party.forEach((i, j) => { const y = 27 + j * 33; r(10, y, 300, 31, x.row == j ? '#1c1c34' : '#0c0c14'); spr(CH[i], 28, y + 29, 0, 0, 1); txt(CH[i].n.toUpperCase(), 48, y + 2, '#fff', 'left', 8); txt('HP ' + S.hp[i] + '/' + maxHp(i), 48, y + 12, '#9f9', 'left', 6); txt('ATK ' + atkOf(i) + '  DEF ' + defOf(i) + '  LUCK ' + luckOf(i), 48, y + 20, '#ddd', 'left', 6);
      SLOTN.forEach((s, k) => { const sx = 170 + k * 46, id = (S.eq[i] || {})[s], sel = x.row == j && x.slot == k; r(sx, y + 3, 40, 26, sel ? '#ffd23c' : '#555'); r(sx + 1, y + 4, 38, 24, '#000'); txt(s.toUpperCase(), sx + 20, y + 4, '#777', 'center', 5); if (id) drawItem(id, sx + 12, y + 11, .5) }) });
    if (ok() && !x.pick) x.pick = { gear: 1, list: ['(none)', ...ownedFor(SLOTN[x.slot])], sel: 0, t0: 0 };
    if (x.pick && x.pick.gear) { const p = x.pick; r(60, 40, 200, 20 + Math.min(p.list.length, 7) * 12, '#fff'); r(61, 41, 198, 18 + Math.min(p.list.length, 7) * 12, '#000'); txt(SLOTN[x.slot].toUpperCase() + ' - ' + CH[party[x.row]].n.toUpperCase(), 66, 44, '#ffd23c', 'left', 6);
      p.list.slice(0, 7).forEach((id, k) => txt((p.sel == k ? '> ' : '  ') + (id == '(none)' ? id : ITEMDEF[id].n + '   ' + itemStats(id)), 66, 56 + k * 12, p.sel == k ? '#ff0' : '#fff', 'left', 6)); if (up()) p.sel = (p.sel + p.list.length - 1) % p.list.length; if (dn()) p.sel = (p.sel + 1) % p.list.length; if (ok() && p.t0) { equip(party[x.row], SLOTN[x.slot], p.list[p.sel] == '(none)' ? null : p.list[p.sel]); x.pick = null } p.t0 = 1 }
  }
  if (tab == 'JOURNAL') {
    r(10, 26, 300, 134, '#d8c9a4'); r(159, 26, 2, 134, '#8a7448'); r(10, 26, 300, 2, '#b8a47c'); const L = journalLines(), per = 11, pages = Math.ceil(L.length / (per * 2)) || 1; x.ps = clamp(x.ps, 0, pages - 1); if (rt() && x.ps < pages - 1) { x.ps++; pageTurn() } if (lf() && x.ps > 0) { x.ps--; pageTurn() }
    for (let c = 0; c < 2; c++) { let y = 32; L.slice((x.ps * 2 + c) * per, (x.ps * 2 + c + 1) * per).forEach(([t, k]) => { wrapPx(t, 136, 6).forEach(s => { txt(s, 16 + c * 152, y, k == 1 ? '#5a2a1a' : k == 2 ? '#6a5a44' : '#2a1c14', 'left', 6); y += 9 }) }) } txt('< ' + (x.ps + 1) + '/' + pages + ' >', W / 2, 150, '#5a4a30', 'center', 6);
  }
  if (tab == 'GUIDE') drawGuide(x);
  if (tab == 'MAP') drawMapTab();
}
function chibi(i, e, cx, fy) {   // a character drawn in an emotion, OMORI-chart style (fy = feet line, UI units)
  const sx = e == 'angry' ? ((tick >> 1) % 2 ? .7 : -.7) : 0, bob = e == 'happy' ? -Math.abs(Math.sin(tick / 7)) * 3.5 : e == 'sad' ? 1.2 : 0;
  spr(CH[i], cx + sx, fy + bob, 0, 0, 1.1);
  if (e == 'happy') for (let k = 0; k < 3; k++) { const ph = (tick / 3 + k * 9) % 28; if (ph < 14) { const a = Math.round(ph / 14 * 2) + 1, ox = [-13, 14, 11][k], oy = [-14, -10, -25][k] + bob; r(cx + ox - a, fy + oy, a * 2 + 1, 1, '#f2b830'); r(cx + ox, fy + oy - a, 1, a * 2 + 1, '#f2b830') } }
  if (e == 'sad') { ell(cx, fy - 25, 10, 3, '#7a8498'); ell(cx - 4, fy - 26, 5, 2, '#98a2b8'); for (let k = 0; k < 4; k++) { const ph = (tick * .8 + k * 7) % 16; r(cx - 7 + k * 5, fy - 22 + ph, 1, 2, '#4a70c8') } r(cx - 4, fy - 12 + ((tick >> 3) % 4), 1, 2, '#6a98e8') }
  if (e == 'angry') { r(cx + 8, fy - 22, 5, 1, '#d02020'); r(cx + 10, fy - 24, 1, 5, '#d02020'); const a = (tick >> 2) % 6; ell(cx - 9, fy - 25 - a * .4, 2, 2, 'rgba(255,255,255,.9)'); ell(cx + 12, fy - 27 - (5 - a) * .4, 2, 2, 'rgba(255,255,255,.9)') }
}
function emoFrame(px, py, who, e, label) {   // framed portrait of one character in one emotion
  r(px, py, 40, 40, '#fff'); r(px + 1, py + 1, 38, 38, '#000'); X.save(); X.beginPath(); X.rect(px + 1, py + 1, 38, 38); X.clip(); portrait(CH[who], e, px + 1, py + 1, 38 / 56); X.restore();
  emoIcon(e, px + 2, py + 42, .8); txt(label, px + 14, py + 43, '#5a2a1a', 'left', 6);
}
function arrow(x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy); for (let i = 0; i < d - 3; i += 3) r(x1 + dx * i / d, y1 + dy * i / d, 2, 2, '#8a2a1a'); const ux = dx / d, uy = dy / d; r(x2 - ux * 2 - 2, y2 - uy * 2 - 2, 5, 5, '#a02020'); r(x2 - ux * 5 - 1, y2 - uy * 5 - 1, 3, 3, '#a02020') }
function drawGuide(x) {
  r(10, 26, 300, 134, '#d8c9a4'); r(159, 26, 2, 134, '#8a7448'); r(10, 26, 300, 2, '#b8a47c'); const pages = 4; if (rt() && x.ps < pages - 1) { x.ps++; pageTurn() } if (lf() && x.ps > 0) { x.ps--; pageTurn() }
  const ink = '#2a1c14', hd = '#5a2a1a', txtw = (str, xx, yy, w2, lh = 8) => wrapPx(str, w2, 6).forEach((l, k) => txt(l, xx, yy + k * lh, ink, 'left', 6));
  if (x.ps == 0) {
    txt('HOW EMOTIONS WORK', 16, 32, hd, 'left', 7); txtw('In battle everyone has an emotion. It changes their stats and how hard they hit. The enemy has one too: look for the little face beside its name.', 16, 43, 136);
    [['happy', 'HAPPY', 'More luck: crits, dodges and follow-ups.'], ['sad', 'SAD', 'Tougher, but weaker attacks.'], ['angry', 'ANGRY', 'Hits hard, but takes more damage.']].forEach(([e, n, d], k) => { const y = 82 + k * 24; emoIcon(e, 16, y, 1.1); txt(n, 32, y + 1, hd, 'left', 7); txtw(d, 32, y + 10, 120) });
    emoFrame(196, 32, PL, 'happy', 'HAPPY'); emoFrame(250, 88, PL, 'sad', 'SAD'); emoFrame(166 + 0, 88, PL, 'angry', 'ANGRY');
    arrow(240, 56, 262, 88); arrow(248, 108, 210, 108); arrow(186, 86, 194, 70); txt('ARROW = BEATS', 232, 138, hd, 'center', 6);
  }
  if (x.ps == 1) {
    txt('THE CHIBI CHART', 16, 32, hd, 'left', 7); [['happy', 118], ['sad', 190], ['angry', 262]].forEach(([e, cx]) => { emoIcon(e, cx - 22, 31, .8); txt(e.toUpperCase(), cx - 12, 33, hd, 'left', 6) });
    [0, 1, PL, 3].forEach((i, k) => { const fy = 68 + k * 29; if (k) for (let q = 0; q < 280; q += 4) if (q < 140 || q > 148) r(16 + q, fy - 27, 2, 1, '#b8a47c'); txt(CH[i].n.toUpperCase(), 16, fy - 12, hd, 'left', 6); [['happy', 118], ['sad', 190], ['angry', 262]].forEach(([e, cx]) => chibi(i, e, cx, fy)) });
  }
  if (x.ps == 2) {
    txt('THE STRENGTH WHEEL', 16, 32, hd, 'left', 7); const cx = 84, cy = 96, pts = { happy: [cx, cy - 38], sad: [cx + 38, cy + 24], angry: [cx - 38, cy + 24] };
    for (const [a, b] of [['happy', 'sad'], ['sad', 'angry'], ['angry', 'happy']]) { const p0 = pts[a], q = pts[b], dx = q[0] - p0[0], dy = q[1] - p0[1], d = Math.hypot(dx, dy); arrow(p0[0] + dx / d * 12, p0[1] + dy / d * 12, q[0] - dx / d * 14, q[1] - dy / d * 14) }
    for (const e in pts) { emoIcon(e, pts[e][0] - 8, pts[e][1] - 8, 1.1); txt(e.toUpperCase(), pts[e][0], pts[e][1] + 10, hd, 'center', 6) }
    txt('FOLLOW-UPS', 170, 32, hd, 'left', 7); txtw('When someone ATTACKS, their friends may jump in with a follow-up hit for 60% damage. HAPPY friends join in more, SAD friends less.', 170, 43, 134);
    txt('MIND THE ARROWS', 170, 86, hd, 'left', 7); txtw('Hit an enemy with the emotion you beat: +30%. Meet one that beats you: -25%. Skills change your emotion. Getting hurt can turn a friend SAD, and when someone falls the others turn ANGRY.', 170, 97, 134);
  }
  if (x.ps == 3) {
    txt('SKILLS', 16, 32, hd, 'left', 7); CH.forEach((c, i) => { const y = 42 + i * 28; spr(c, 28, y + 22, 0, 0, .9); txt(c.skill[0].toUpperCase(), 44, y + 1, hd, 'left', 7); txtw(c.skill[1], 44, y + 11, 108, 7) });
    txt('GOOD TO KNOW', 170, 32, hd, 'left', 7); txtw('Enemies get stronger as the story moves on and with every fight you win. Chests and side quests give gear: open the X menu to equip it.', 170, 43, 134);
    txtw('Rest on benches to recover a little. Save at vending machines. Little shacks hide small, wise things.', 170, 100, 134);
  }
  txt('< ' + (x.ps + 1) + '/' + pages + ' >', W / 2, 150, '#5a4a30', 'center', 6);
}
function autoMap() {   // BFS over exits; each step moves one cell in the direction of the exit
  const pos = { w_tree: [0, 0] }, q = ['w_tree'], D4 = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }, used = new Set(['0,0']);
  while (q.length) { const id = q.shift(), A0 = AREAS[id]; if (!A0) continue; for (const e of A0.exits) if (AREAS[e.to] && !pos[e.to] && !AREAS[e.to].interior && !A0.interior) { let [x, y] = pos[id], d = D4[e.side]; x += d[0]; y += d[1]; while (used.has(x + ',' + y)) { x += d[0]; y += d[1] } pos[e.to] = [x, y]; used.add(x + ',' + y); q.push(e.to) } }
  return pos;
}
function drawMapTab() {
  const pos = autoMap(), ids = Object.keys(pos).filter(id => S.seen[id] || Object.keys(S.seen).some(s => AREAS[s] && AREAS[s].exits.some(e => e.to == id))); if (!ids.length) return;
  let x0 = 99, x1 = -99, y0 = 99, y1 = -99; ids.forEach(id => { x0 = Math.min(x0, pos[id][0]); x1 = Math.max(x1, pos[id][0]); y0 = Math.min(y0, pos[id][1]); y1 = Math.max(y1, pos[id][1]) });
  const cw = Math.min(40, 280 / (x1 - x0 + 1)), ch = Math.min(22, 120 / (y1 - y0 + 1)), ox = (W - (x1 - x0 + 1) * cw) / 2, oy = 28 + (124 - (y1 - y0 + 1) * ch) / 2, P = id => [ox + (pos[id][0] - x0) * cw + cw / 2, oy + (pos[id][1] - y0) * ch + ch / 2];
  ids.forEach(id => AREAS[id].exits.forEach(e => { if (pos[e.to] && ids.includes(e.to)) { const a = P(id), b = P(e.to); drawLine(a[0], a[1], b[0], b[1], 1, '#555') } }));
  ids.forEach(id => { const [px, py] = P(id), seen = S.seen[id], cur = S.a == id; r(px - cw / 2 + 2, py - ch / 2 + 2, cw - 4, ch - 4, cur ? '#ffd23c' : '#fff'); r(px - cw / 2 + 3, py - ch / 2 + 3, cw - 6, ch - 6, seen ? '#10101c' : '#2a2a3a'); if (seen) txt(AREAS[id].nm.replace(/^The /, '').slice(0, Math.floor(cw / 3.4)), px, py - 3, cur ? '#ffd23c' : '#ddd', 'center', 4); else txt('?', px, py - 3, '#888', 'center', 6) });
  txt('YELLOW = YOU ARE HERE', W / 2, 154, '#aaa', 'center', 6);
}
// ==================== POLAROID (vending machine photo + save) ====================
function polaroid() {
  PO.t++; sU(); r(0, 0, W, H, '#0b0916'); const gr = X.createRadialGradient(160, 84, 10, 160, 84, 170); gr.addColorStop(0, 'rgba(110,100,190,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = gr; X.fillRect(0, 0, W, H);
  for (let i = 0; i < 30; i++) r((i * 47 + PO.t * .15 * (1 + i % 3)) % W, (i * 31 + PO.t * .08) % H, 1, 1, 'rgba(255,255,255,.35)');
  const sky = { forest: ['#bfe8ff', '#6cc060'], dark: ['#2a2244', '#1e1830'], beach: ['#9fd8ff', '#f0d890'], city: ['#1a1038', '#26263c'], house: ['#caa070', '#8a6038'], hotel: ['#9fd8ff', '#e8e0d0'], space: ['#0a0a28', '#1a1640'], cyberin: ['#1a1038', '#26263c'] }[AREAS[S.a].pal] || ['#bfe8ff', '#6cc060'];
  r(48, 6, 224, 164, 'rgba(0,0,0,.5)'); r(44, 4, 224, 164, '#f6f1e2'); r(44, 4, 224, 1, '#fff'); r(52, 12, 208, 126, sky[0]); r(52, 96, 208, 42, sky[1]);
  sW(); for (let i = 0; i < 9; i++) ell(120 + i * 40, 190, 26, 18, sh(sky[1], .8 + (i % 3) * .1));
  if (AREAS[S.a].pal == 'city') for (let i = 0; i < 7; i++) { r(110 + i * 32, 150 - (i * 17 % 40), 22, 90, '#14142a'); r(114 + i * 32, 158 - (i * 17 % 40), 4, 4, NC[i % 4]); r(122 + i * 32, 166 - (i * 17 % 40), 4, 4, NC[(i + 1) % 4]) }
  if (AREAS[S.a].pal == 'forest' || AREAS[S.a].pal == 'dark') for (let i = 0; i < 6; i++) { ell(130 + i * 70, 146, 18, 24, AREAS[S.a].pal == 'dark' ? '#3a2d5a' : '#2f7d37'); r(126 + i * 70, 162, 8, 22, '#4a3320') }
  [0, 1, 2, 3].forEach((i, j) => { const here = S.party.includes(i) && S.hp[i] > 0 || (S.party.includes(i)), c = here ? CH[i] : { ...CH[i], g: .16 }; drawChar(c, 140 + j * 70, 262 - (j % 2) * 6, 0, 0, 1.7) }); sU();
  txt(AREAS[S.a].nm + '  -  Day ' + S.day, 160, 141, '#4a3f5a', 'center', 6); txt('the four of us', 160, 151, '#8a7f9a', 'center', 5);
  r(120, 0, 30, 9, 'rgba(255,230,150,.75)'); r(190, 0, 30, 9, 'rgba(255,230,150,.75)'); const dev = Math.max(0, 1 - PO.t / 100); if (dev > 0) r(52, 12, 208, 126, 'rgba(235,232,225,' + dev + ')'); if (PO.t < 14) r(0, 0, W, H, 'rgba(255,255,255,' + (1 - PO.t / 14) + ')');
  if (PO.t > 40 && (tick >> 5) & 1) txt('[Z] Save', W / 2, 168, '#fff', 'center', 7); if (PO.t > 24 && ok()) slots('save'); if (esc()) sc = 'world';
}
