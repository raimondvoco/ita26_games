// ==================== ECONOMY: money, the bag of consumables, shops, casino chips ====================
// Money ($) comes from battles, chests and quests. Consumables are bought at shops; gear comes from quests (and a few chests).
const CONS = {
  candy: { n: 'Candy', p: 3, heal: 15, d: 'A hard candy in crinkly paper. Heals 15 HP.' },
  cookie: { n: 'Cookie', p: 6, heal: 30, d: 'Still a little warm. Heals 30 HP.' },
  sandwich: { n: 'Sandwich', p: 12, heal: 60, d: 'Cut into triangles, the correct way. Heals 60 HP.' },
  juice: { n: 'Orange Juice', p: 14, all: 25, d: 'One carton, four straws. Heals the whole party 25 HP.' },
  bento: { n: 'Bento Box', p: 25, full: 1, d: 'Rice, egg, a tiny sausage octopus. Fully heals one friend.' },
  cocoa: { n: 'Hot Cocoa', p: 10, heal: 35, d: 'Thick and sweet, from a dented tin cup. Heals 35 HP.' },
  soda: { n: 'Fizzy Soda', p: 8, buff: 'atk', v: 4, d: 'Sugar rush! Party ATK +4 until the battle ends.' },
  tea: { n: 'Herbal Tea', p: 8, buff: 'def', v: 4, d: 'Smells like a grandmother\'s kitchen. Party DEF +4 until the battle ends.' },
  gum: { n: 'Lucky Gum', p: 7, buff: 'luck', v: 6, d: 'Chew for luck. Party LUCK +6 until the battle ends.' },
  salts: { n: 'Smelling Salts', p: 15, revive: 1, d: 'One sniff and you\'re up. Revives a fallen friend at half HP.' },
  icecream: { n: 'Ice Cream', p: 9, heal: 40, d: 'Strawberry, already melting. Heals 40 HP.' },
  bun: { n: 'Lantern Bun', p: 9, heal: 45, d: 'A steamed bun shaped like a paper lantern. Heals 45 HP.' },
  ramen: { n: 'Ramen Bowl', p: 22, full: 1, d: 'Extra egg. Fully heals one friend.' },
  bubble: { n: 'Bubble Tea', p: 18, all: 35, d: 'Taro, with far too many pearls. Heals the whole party 35 HP.' },
  energy: { n: 'Energy Drink', p: 12, buff: 'atk', v: 7, d: 'Tastes like a battery. Party ATK +7 until the battle ends.' },
  charm: { n: 'Paper Charm', p: 10, buff: 'def', v: 6, d: 'A folded charm that says "SAFE". Party DEF +6 until the battle ends.' }
};
const SHOPS = {
  stand: { nm: 'Honesty Stand', greet: 'A sign: TAKE WHAT YOU NEED. LEAVE WHAT IT COSTS.', bye: 'You leave the coins in the tin.', items: ['candy', 'cookie', 'juice', 'gum'] },
  bakery: { nm: 'Bella\'s Bakery', greet: 'Bella: Fresh from the oven!', bye: 'Bella: Come back before it\'s all gone!', items: ['cookie', 'sandwich', 'bento', 'tea'] },
  camp: { nm: 'Morrow\'s Supplies', greet: 'Morrow: Take what keeps you warm.', bye: 'Morrow: Mind the dark.', items: ['candy', 'cocoa', 'sandwich', 'tea', 'salts'] },
  icecream: { nm: 'Coco\'s Ice Cream', greet: 'Coco: One scoop or TWO?', bye: 'Coco: Eat it before it melts!', items: ['icecream', 'soda', 'juice'] },
  cafe: { nm: 'Seashell Café', greet: 'Barista: Sit anywhere. Nobody ever does.', bye: 'Barista: See you yesterday.', items: ['cookie', 'sandwich', 'juice', 'bento', 'tea'] },
  buns: { nm: 'Lantern Buns', greet: 'Bun seller: Hot buns! Shaped like lanterns, filled like lanterns!', bye: 'Bun seller: Careful, they\'re hot.', items: ['bun', 'sandwich', 'bento'] },
  noodle: { nm: 'Noodle Cart', greet: 'Cook: One bowl fixes everything. Two bowls is a cry for help.', bye: 'Cook: Slurp loudly. It\'s polite.', items: ['ramen', 'energy', 'soda'] },
  teah: { nm: 'Bubble Tea Stall', greet: 'Tea girl: Pearls are free. Joy is extra.', bye: 'Tea girl: Shake before drinking!', items: ['bubble', 'tea', 'juice'] },
  ren: { nm: 'Ren\'s Ramen', greet: 'Ren: Hungry? Of course you\'re hungry.', bye: 'Ren: Come back when it rains.', items: ['ramen', 'bun', 'bento', 'tea', 'energy'] },
  charms: { nm: 'Charm Stall', greet: 'Old woman: A charm for every fear. Almost every fear.', bye: 'Old woman: Don\'t lose it. They always lose it.', items: ['charm', 'gum', 'salts', 'energy'] }
};
const money = () => S.money || 0;
function addMoney(n, quiet) { S.money = Math.max(0, money() + n); if (n > 0 && !quiet) say('+$' + n + '  (you have $' + S.money + ')'); if (n > 0) beep(990, .06) }
function bagAdd(id, n = 1) { S.bag = S.bag || {}; S.bag[id] = (S.bag[id] || 0) + n; if (S.bag[id] <= 0) delete S.bag[id] }
const bagList = () => Object.keys(S.bag || {}).filter(k => CONS[k] && S.bag[k] > 0);
const addChips = n => { S.chips = Math.max(0, (S.chips || 0) + n); if (n > 0) say('+' + n + ' Chips (' + S.chips + ')') };
function econFix() {   // old saves: snacks -> candy, clams -> chips
  S.bag = S.bag || {}; if (S.snacks) { bagAdd('candy', S.snacks); delete S.snacks } if (S.clams) { S.chips = (S.chips || 0) + S.clams; delete S.clams } if (S.money == null) S.money = 10;
}
// using a consumable on member i (out of battle or in); returns a message
function consUse(id, i, inBattle) {
  const c = CONS[id], who = CH[i].n; let m = '';
  if (c.revive) { if (S.hp[i] > 0) return null; S.hp[i] = Math.ceil(maxHp(i) / 2); m = who + ' wakes up!' }
  else if (c.buff) { if (!inBattle) return null; B.buff[c.buff] = (B.buff[c.buff] || 0) + c.v; m = 'Everyone feels it: ' + c.buff.toUpperCase() + ' +' + c.v + '!' }
  else if (c.all) { const ps = inBattle ? B.order : S.party; ps.forEach(j => { if (S.hp[j] > 0) S.hp[j] = Math.min(maxHp(j), S.hp[j] + c.all) }); m = 'Everyone recovers ' + c.all + ' HP.' }
  else { if (S.hp[i] <= 0) return null; if (S.hp[i] >= maxHp(i)) return null; const h = c.full ? maxHp(i) : c.heal, b4 = S.hp[i]; S.hp[i] = Math.min(maxHp(i), S.hp[i] + h); m = who + ' recovers ' + (S.hp[i] - b4) + ' HP.' }
  bagAdd(id, -1); return m;
}
const consNeedsTarget = id => { const c = CONS[id]; return !(c.all || c.buff) };
const consTag = id => { const c = CONS[id]; return c.revive ? 'REVIVE' : c.buff ? c.buff.toUpperCase() + ' +' + c.v : c.all ? 'PARTY +' + c.all : c.full ? 'FULL HEAL' : 'HP +' + c.heal };
// ---- little food icons (UI units, about 14x14)
function drawCons(id, x, y, s = 1) {
  const R_ = (a, b, w, h, c) => r(Math.round(x + a * s), Math.round(y + b * s), Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)), c), E_ = (a, b, rx, ry, c) => ell(x + a * s, y + b * s, rx * s, ry * s, c);
  switch (id) {
    case 'candy': R_(1, 6, 3, 3, '#ff8ab0'); R_(11, 6, 3, 3, '#ff8ab0'); E_(7.5, 7.5, 4, 3.5, '#e84a7a'); R_(5, 6, 1, 3, '#fff'); R_(8, 5, 1, 5, '#fff'); break;
    case 'cookie': E_(7, 8, 6, 5.5, '#a8642a'); E_(7, 7.5, 5.5, 5, '#d8a050'); for (const [a, b] of [[4, 6], [8, 5], [9, 9], [5, 10]]) R_(a, b, 2, 2, '#5a3018'); break;
    case 'sandwich': for (let i = 0; i < 10; i++) R_(2 + i * .6, 3 + i, 12 - i * 1.2, 1, i < 2 ? '#e8c890' : i < 4 ? '#5ab84a' : i < 6 ? '#f0d060' : i < 8 ? '#e85a5a' : '#e8c890'); break;
    case 'juice': R_(4, 3, 8, 11, '#ff9a2a'); R_(4, 3, 8, 2, '#fff'); R_(5, 7, 6, 4, '#fff'); E_(8, 9, 2, 2, '#ff9a2a'); R_(9, 0, 1, 4, '#5ab0e8'); break;
    case 'bento': R_(1, 4, 14, 10, '#c03a3a'); R_(2, 5, 12, 8, '#1a1a1a'); R_(2, 5, 6, 8, '#f4f4f0'); E_(10, 7, 2, 2, '#ffd23c'); E_(11, 11, 2, 1.5, '#e85a5a'); R_(5, 8, 2, 2, '#2a5a2a'); break;
    case 'cocoa': R_(3, 5, 9, 9, '#c8c8d0'); R_(4, 6, 7, 2, '#6a3a20'); R_(12, 7, 2, 4, '#c8c8d0'); E_(6, 3, 1, 2, 'rgba(255,255,255,.6)'); E_(9, 2, 1, 2, 'rgba(255,255,255,.6)'); break;
    case 'soda': R_(4, 2, 7, 12, '#3a8ad8'); R_(4, 2, 7, 2, '#c8c8d0'); R_(5, 6, 5, 4, '#e84a4a'); R_(5, 7, 5, 1, '#fff'); R_(5, 4, 1, 8, 'rgba(255,255,255,.4)'); break;
    case 'tea': R_(3, 6, 9, 7, '#e8e0d0'); R_(4, 7, 7, 2, '#9ab84a'); R_(12, 8, 2, 3, '#e8e0d0'); R_(7, 2, 1, 5, '#c8b890'); R_(6, 4, 3, 2, '#f0e8c0'); break;
    case 'gum': R_(2, 5, 12, 6, '#5ae0a0'); R_(2, 5, 12, 1, '#a0ffd0'); R_(4, 7, 8, 2, '#fff'); R_(6, 7, 1, 2, '#ff5a8a'); R_(9, 7, 1, 2, '#ff5a8a'); break;
    case 'salts': R_(5, 3, 6, 2, '#6a4a2a'); R_(4, 5, 8, 9, '#a8d8e8'); R_(5, 8, 6, 5, '#f4f4f8'); R_(6, 6, 1, 6, 'rgba(255,255,255,.6)'); break;
    case 'icecream': for (let i = 0; i < 7; i++) R_(5 + i * .45, 7 + i, 6 - i * .9, 1, '#d8a050'); E_(8, 5, 4, 3.5, '#ff9ab8'); E_(7, 4, 1.5, 1, '#fff'); R_(9, 1, 2, 2, '#e83a4a'); break;
    case 'bun': E_(8, 8, 6, 5, '#f4ecd8'); E_(8, 7, 5, 4, '#fff8ec'); R_(2, 8, 12, 1, '#e85a3a'); R_(7, 3, 2, 2, '#e85a3a'); break;
    case 'ramen': E_(8, 9, 7, 4, '#c03a3a'); E_(8, 8, 6, 2.5, '#f0c880'); for (let i = 0; i < 4; i++) R_(4 + i * 2, 7, 1, 2, '#ffe8a0'); E_(10, 7, 2, 1.5, '#fff'); E_(10, 7, 1, .8, '#ffb020'); R_(11, 1, 1, 7, '#a87a3a'); R_(13, 1, 1, 7, '#a87a3a'); break;
    case 'bubble': R_(4, 4, 8, 10, '#b89ae8'); R_(4, 4, 8, 1, '#fff'); for (const [a, b] of [[5, 11], [8, 12], [10, 10], [6, 9]]) R_(a, b, 2, 2, '#2a1a3a'); R_(9, 0, 2, 5, '#ff5a8a'); break;
    case 'energy': R_(4, 2, 7, 12, '#1a1a1a'); R_(4, 2, 7, 2, '#c8c8d0'); R_(7, 5, 2, 3, '#8cff3a'); R_(6, 7, 2, 3, '#8cff3a'); R_(8, 9, 1, 2, '#8cff3a'); break;
    case 'charm': R_(4, 2, 8, 12, '#e8d8a8'); R_(4, 2, 8, 1, '#c03a3a'); R_(6, 5, 4, 1, '#c03a3a'); R_(6, 7, 4, 1, '#c03a3a'); R_(7, 9, 2, 3, '#c03a3a'); R_(7, 0, 2, 2, '#c03a3a'); break;
    default: E_(7, 7, 5, 5, '#fff');
  }
}
// ---- the shop screen
let SHP = null;
function shop(id) { const s = SHOPS[id]; if (!s) return; SHP = { id, sel: 0, msg: s.greet, t: 0, flash: 0 }; sc = 'shop'; beep(700, .06) }
function shopUD() {
  const sp = SHOPS[SHP.id], L = sp.items.concat(['_leave']), x = SHP; x.t++; if (x.flash > 0) x.flash--;
  if (up()) { x.sel = (x.sel + L.length - 1) % L.length; beep(500, .03) } if (dn()) { x.sel = (x.sel + 1) % L.length; beep(500, .03) }
  const leave = () => { SHP = null; sc = 'world'; say(sp.bye.replace(/^[^:]+: /, '')); beep(500, .05) };
  if (esc() || hit.KeyX) return leave();
  if (ok() && x.t > 6) { const id = L[x.sel]; if (id == '_leave') return leave(); const c = CONS[id];
    if (money() < c.p) { x.msg = 'Not enough money. (' + c.n + ' costs $' + c.p + ')'; beep(160, .2) } else { S.money -= c.p; bagAdd(id, 1); x.msg = 'Bought ' + c.n + '! You have ' + S.bag[id] + '.'; x.flash = 20; beep(880, .06); setTimeout(() => beep(1320, .06), 70) } }
  // draw
  sU(); drawWorld(); sU(); r(0, 0, W, H, 'rgba(4,2,12,.6)');
  r(8, 8, 304, 18, '#fff'); r(9, 9, 302, 16, '#000'); txt(sp.nm.toUpperCase(), 16, 12, '#ffd23c', 'left', 8); txt('$' + money(), 304, 12, '#8f8', 'right', 8);
  r(8, 30, 150, 120, '#fff'); r(9, 31, 148, 118, '#000');
  L.forEach((id, i) => { const y = 36 + i * 16; if (x.sel == i) r(11, y - 2, 144, 15, '#2a2a40');
    if (id == '_leave') return txt((x.sel == i ? '> ' : '  ') + 'Leave', 14, y + 1, '#fff', 'left', 7);
    const c = CONS[id], can = money() >= c.p; drawCons(id, 22, y - 2); txt(c.n, 40, y + 1, can ? '#fff' : '#777', 'left', 7); txt('$' + c.p, 152, y + 1, can ? '#ffd23c' : '#775', 'right', 7);
    if (x.sel == i) txt('>', 13, y + 1, '#ff0', 'left', 7) });
  r(162, 30, 150, 120, '#fff'); r(163, 31, 148, 118, '#0a0a12'); const cur = L[x.sel];
  if (cur != '_leave') { const c = CONS[cur]; r(170, 38, 36, 36, '#1c1c30'); drawCons(cur, 174, 42, 2); txt(c.n.toUpperCase(), 212, 40, '#ffd23c', 'left', 7); txt(consTag(cur), 212, 51, c.buff ? '#9cf' : c.revive ? '#f9c' : '#8f8', 'left', 6); txt('Have: ' + ((S.bag || {})[cur] || 0), 212, 61, '#aaa', 'left', 6);
    wrapPx(c.d, 136, 7).forEach((s, i) => txt(s, 170, 82 + i * 10, '#ddd', 'left', 7)) }
  else wrapPx('Done shopping.', 136, 7).forEach((s, i) => txt(s, 170, 40 + i * 10, '#aaa', 'left', 7));
  r(8, 154, 304, 20, '#fff'); r(9, 155, 302, 18, '#000'); txt(x.msg, 16, 159, x.flash ? '#ffe9a0' : '#ddd', 'left', 7); txt('Z BUY  X LEAVE', 304, 164, '#666', 'right', 5);
}
// ---- events that open shops, and the casino cashier
Object.assign(EV, {
  shop(e) { if (e.say && e.say.length && !S.fl['shopseen_' + e.shop]) { S.fl['shopseen_' + e.shop] = 1; return D(e.say, () => shop(e.shop)) } shop(e.shop) },
  cashier() {
    ask(['|CASHIER. "Money for chips. Chips for dreams. No refunds."', '|You have $' + money() + ' and ' + (S.chips || 0) + ' Chips.'], ['10 Chips  $5', '50 Chips  $20', '100 Chips  $35', 'Leave'], i => {
      if (i > 2) return; const [n, c] = [[10, 5], [50, 20], [100, 35]][i];
      if (money() < c) return D(['|The window stays shut. You need $' + c + '.']);
      S.money -= c; addChips(n); beep(880, .08); D(['|A little tray slides out with ' + n + ' Chips on it.']);
    });
  }
});
// ---- market stalls (world-layer drawings). Each shop has its own awning, sign and wares.
const STALLSTY = {
  stand: { rustic: 1, sign: 'HONESTY STAND', goods: ['candy', 'cookie', 'juice', 'gum'] },
  camp: { rustic: 1, dark: 1, sign: 'SUPPLIES', goods: ['cocoa', 'candy', 'salts', 'tea'] },
  buns: { a1: '#e83a4a', a2: '#ffd23c', sign: 'LANTERN BUNS', sc: '#ffd23c', goods: ['bun', 'bun', 'bun', 'bento'], steam: 1 },
  noodle: { a1: '#2a2a6a', a2: '#2ee6e6', sign: 'NOODLES', sc: '#2ee6e6', goods: ['ramen', 'ramen', 'energy', 'soda'], steam: 1, noren: 1 },
  teah: { a1: '#ff5aa8', a2: '#fff0f8', sign: 'BUBBLE TEA', sc: '#ff9ad0', goods: ['bubble', 'bubble', 'juice', 'tea'] },
  charms: { a1: '#6a2a9a', a2: '#ffd23c', sign: 'CHARMS', sc: '#c89aff', goods: ['charm', 'charm', 'gum', 'salts'], charms: 1 }
};
OBJ.stall = (x, y, e) => {
  const st = STALLSTY[e.shop] || {}, F = (a, b, w, h, c) => r(Math.round(x + a), Math.round(y + b), w, h, c), city = AREAS[S.a] && AREAS[S.a].city;
  ell(x + 3, y + 1, 26, 5, 'rgba(0,0,0,.28)');
  if (city) { const p = .07 + Math.sin(tick / 30) * .02; X.globalCompositeOperation = 'lighter'; ell(x, y - 20, 30, 24, 'rgba(255,160,90,' + p + ')'); X.globalCompositeOperation = 'source-over' }
  if (st.rustic) {   // a plank table under a little shingled roof, jars and a tin for coins
    const wd = st.dark ? '#5a3a22' : '#8a5a32', wl = st.dark ? '#7a5232' : '#b07a44', wk = st.dark ? '#2a1a0e' : '#4a2c16';
    for (const px of [-20, 17]) { F(px, -40, 3, 40, wk); F(px + 1, -40, 1, 40, wd) }
    F(-24, -46, 48, 3, wk); for (let i = 0; i < 6; i++) { F(-24 + i * 8, -50 + (i % 2), 8, 5, i % 2 ? wd : wl); F(-24 + i * 8, -46, 8, 1, wk) } F(-26, -51, 52, 2, wk);
    F(-22, -17, 44, 4, wl); F(-22, -13, 44, 1, wk); F(-21, -12, 42, 12, wd); for (let i = 0; i < 5; i++) F(-21 + i * 9, -12, 1, 12, wk); F(-21, -2, 42, 2, wk);
    (st.goods || []).forEach((id, i) => { const gx = x - 19 + i * 10, gy = y - 28; r(gx, gy + 2, 9, 9, 'rgba(200,230,255,.35)'); r(gx, gy + 1, 9, 1, '#c8c8c8'); drawCons(id, gx, gy + 2, .62) });
    F(10, -21, 7, 4, '#9aa0a8'); F(10, -21, 7, 1, '#c8ccd0'); F(12, -20, 3, 1, '#2a2a2a');   // coin tin
    F(-14, -38, 28, 10, '#2a3a2a'); F(-14, -38, 28, 1, wk); F(-14, -29, 28, 1, wk); txt((st.sign || '').split(' ')[0], x / 2, (y - 37) / 2, '#e8f0e0', 'center', 3.6);
    if (st.dark) { const f = (tick >> 3) & 1; ell(x - 17, y - 36, 4, 4, 'rgba(255,190,90,.35)'); F(-18, -38, 3, 4, f ? '#ffd27a' : '#ffb04a') }
    return;
  }
  // neon-night market stall: striped scalloped awning, wooden counter, glowing sign, wares, string lights
  const wk = '#1a1030', wd = '#5a3a2a', wl = '#7a5236';
  for (const px of [-22, 19]) { F(px, -44, 3, 44, wk); F(px + 1, -44, 1, 44, '#3a2a4a') }
  F(-21, -34, 41, 20, '#1a1438'); for (let i = 0; i < 3; i++) F(-19 + i * 13, -32, 12, 2, '#3a2a5a');   // back shelf
  if (st.charms) for (let i = 0; i < 6; i++) { const cx = -17 + i * 7, sw = Math.sin(tick / 20 + i) * 1; F(cx + sw, -32, 1, 5, '#c8b890'); F(cx - 2 + sw, -27, 5, 7, i % 2 ? '#e8d8a8' : '#ffd0e0'); F(cx - 1 + sw, -25, 3, 1, '#c03a3a') }
  if (st.noren) for (let i = 0; i < 4; i++) { F(-20 + i * 10, -36, 9, 12, i % 2 ? '#2a2a6a' : '#22225a'); F(-17 + i * 10, -32, 3, 3, '#2ee6e6') }
  F(-24, -16, 48, 4, wl); F(-24, -12, 48, 1, wk); F(-23, -11, 46, 11, wd); for (let i = 0; i < 4; i++) F(-23 + i * 12, -11, 1, 11, wk); F(-23, -2, 46, 2, wk);
  (st.goods || []).forEach((id, i) => drawCons(id, x - 21 + i * 11, y - 26, .66));
  if (st.steam) for (let i = 0; i < 3; i++) { const q = (tick / 2 + i * 13) % 26; ell(x - 14 + i * 9 + Math.sin(q / 4) * 2, y - 26 - q, 2 + q / 10, 2 + q / 10, 'rgba(255,255,255,' + (.28 * (1 - q / 26)) + ')') }
  for (let i = 0; i < 8; i++) { F(-26 + i * 6.5, -50, 7, 8, i % 2 ? st.a2 : st.a1); ell(x - 22.5 + i * 6.5, y - 42, 3.5, 2.5, i % 2 ? st.a2 : st.a1) } F(-26, -51, 52, 1, wk);
  const sw = Math.max(40, st.sign.length * 6 + 10); F(-sw / 2, -62, sw, 11, wk); F(-sw / 2 + 1, -61, sw - 2, 9, '#0b0a24'); txt(st.sign, x / 2, (y - 60) / 2, ((tick >> 4) % 9) ? st.sc : '#fff', 'center', 4.4);
  for (let i = 0; i < 6; i++) { const lx = -24 + i * 9.6, ly = -40 + Math.sin(i * 1.3) * 1.5; ell(x + lx, y + ly, 2, 2, ['#ffd23c', '#ff5a8a', '#2ee6e6'][i % 3]); ell(x + lx, y + ly, 4, 4, 'rgba(255,220,150,.12)') }
};
const stall = (shop, x, y) => obj('stall', x, y, [], { ev: 'shop', shop, solid: [-1, -1, 3, 1] });
// ---- where the shops stand (added after the areas are defined)
(function placeShops() {
  const add = (a, ...es) => AREAS[a] && AREAS[a].ents.push(...es), rm = (a, f) => { if (AREAS[a]) AREAS[a].ents = AREAS[a].ents.filter(e => !f(e)) };
  rm('w_tree', e => e.k == 'vend'); add('w_tree', stall('stand', 15, 13));
  rm('g_camp', e => e.k == 'vend'); add('g_camp', stall('camp', 28, 12));
  rm('b_boardwalk', e => e.kind == 'icecart'); add('b_boardwalk', obj('icecart', 25, 15, [], { ev: 'shop', shop: 'icecream', solid: [-1, 0, 2, 1] }));
  add('n_market', stall('buns', 8, 14), stall('noodle', 14, 14), stall('teah', 44, 23), stall('charms', 50, 23));
})();
// ---- late merges: animated objects from castle.js / interiors.js, and first-entry banter for the new rooms
Object.assign(OBJ, XOBJ);
Object.assign(AREA_TALK, {
  c_armory: ['Steven:worried|Armour. Lots of armour. All of it my size, weirdly.', 'Caroline:neutral|Don\'t touch anything. Things in here look like they bite.'],
  c_crypt: ['Uku:scared|Nope. Nope nope nope.', 'Hitori:neutral|...Stay close. It\'s just bones. Bones can\'t do anything.', 'Caroline:worried|The big one in the middle isn\'t bones.']
});
