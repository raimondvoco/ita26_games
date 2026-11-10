// ==================== v12: the arcade is playable ====================
// Every cabinet in the Pixel Palace runs a real little game. Games pay out tickets; the prize counter swaps tickets for snacks.
// Steven's three lit machines (quest "High Score") are free to play and count once you beat the score on the board.
const GX = 86, GY = 26, GW = 148, GH = 112;
const kL = () => keys.ArrowLeft || keys.KeyA, kR = () => keys.ArrowRight || keys.KeyD, kU = () => keys.ArrowUp || keys.KeyW, kD = () => keys.ArrowDown || keys.KeyS;
const rnd = (a, b) => a + Math.random() * (b - a), rndi = n => (Math.random() * n) | 0;
function pmask(rows, x, y, c, sc = 1) { for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) if (rows[j][i] == '#') r(x + i * sc, y + j * sc, sc, sc, c) }
const ARROW = ['....##....', '...####...', '..######..', '.########.', '##########', '...####...', '...####...', '...####...'];
function arrowAt(dir, x, y, c, dk) {   // dir 0 left 1 down 2 up 3 right; drawn 10x10 centred
  const R_ = [];
  for (let j = 0; j < 10; j++) { let s = ''; for (let i = 0; i < 10; i++) { let u, v; if (dir == 2) { u = i; v = j } else if (dir == 1) { u = i; v = 9 - j } else if (dir == 0) { u = j; v = i } else { u = j; v = 9 - i } s += (ARROW[v - 1] && ARROW[v - 1][u] == '#') ? '#' : '.' } R_.push(s) }
  if (dk) pmask(R_, x - 4, y - 4, dk); pmask(R_, x - 5, y - 5, c) }

const GAMES = {
  // ------------------------------------------------ STAR CATCHER: move the basket, catch stars, dodge the black clouds
  star: { nm: 'STAR CATCHER', col: '#ffd23c', how: ['Left/Right: move the basket', 'Catch stars (+1) and hearts (+3)', 'Dodge the black clouds!'], tk: 1,
    init(a) { a.px = GW / 2; a.it = []; a.lives = 3; a.time = 60 * 40; a.sp = .9; a.flash = 0 },
    up(a) { if (kL()) a.px -= 2.3; if (kR()) a.px += 2.3; a.px = clamp(a.px, 10, GW - 10); a.time--; a.sp += .0007; if (a.flash) a.flash--;
      if (a.t % Math.max(12, 30 - (a.t / 100 | 0)) == 0) { const q = Math.random(); a.it.push({ x: rnd(8, GW - 8), y: -6, k: q < .16 ? 'bomb' : q < .24 ? 'heart' : 'star', v: a.sp + Math.random() * .6, w: rnd(0, 6) }) }
      for (const o of a.it) { o.y += o.v; o.x += Math.sin((a.t + o.w * 20) / 18) * .25;
        if (!o.gone && o.y > GH - 18 && o.y < GH - 6 && Math.abs(o.x - a.px) < 12) { o.gone = 1; if (o.k == 'bomb') { a.lives--; a.flash = 16; shake = 6; beep(110, .25, 1, 'sawtooth') } else { a.sc += o.k == 'heart' ? 3 : 1; beep(o.k == 'heart' ? 1320 : 990 + (a.sc % 5) * 60, .05) } } }
      a.it = a.it.filter(o => !o.gone && o.y < GH + 8); if (a.lives <= 0 || a.time <= 0) arcOver(a) },
    dr(a) { r(GX, GY, GW, GH, '#0a0a2a'); for (let i = 0; i < 4; i++) r(GX, GY + 70 + i * 10, GW, 10, ['#0e1036', '#121442', '#16184e', '#1a1c5a'][i]);
      for (let i = 0; i < 22; i++) { const tw_ = ((a.t + i * 13) >> 4) & 1; r(GX + (i * 37) % GW, GY + (i * 23) % 70, 1, 1, tw_ ? '#fff' : '#6a6aa8') }
      for (const o of a.it) { const x = GX + o.x, y = GY + o.y;
        if (o.k == 'star') { r(x - 1, y - 4, 2, 9, '#ffd23c'); r(x - 4, y - 1, 9, 2, '#ffd23c'); r(x - 2, y - 2, 5, 5, '#ffe98a'); r(x - 1, y - 1, 1, 1, '#fff') }
        else if (o.k == 'heart') { r(x - 4, y - 3, 3, 3, '#ff5a8a'); r(x + 1, y - 3, 3, 3, '#ff5a8a'); r(x - 4, y - 1, 8, 2, '#ff5a8a'); r(x - 3, y + 1, 6, 1, '#ff5a8a'); r(x - 2, y + 2, 4, 1, '#ff5a8a'); r(x - 3, y - 3, 1, 1, '#ffc8d8') }
        else { ell(x, y, 6, 4, '#1a1428'); ell(x - 3, y - 2, 3, 3, '#1a1428'); ell(x + 3, y - 2, 4, 3, '#1a1428'); r(x - 2, y - 1, 1, 1, '#ff3a3a'); r(x + 2, y - 1, 1, 1, '#ff3a3a') } }
      const bx = GX + a.px, by = GY + GH - 10; r(bx - 11, by - 6, 22, 8, '#3a2010'); r(bx - 10, by - 5, 20, 6, '#a8723c'); for (let i = 0; i < 5; i++) r(bx - 9 + i * 4, by - 5, 1, 6, '#7a4a22'); r(bx - 11, by - 7, 22, 2, '#c89a5a');
      if (a.flash & 2) r(GX, GY, GW, GH, 'rgba(255,40,40,.25)');
      for (let i = 0; i < 3; i++) r(GX + 4 + i * 7, GY + 4, 5, 4, i < a.lives ? '#ff5a8a' : '#3a2a4a'); r(GX + GW - 44, GY + 4, 40 * a.time / 2400, 3, '#2ee6e6') } },

  // ------------------------------------------------ NOODLE RUN: snake, but it is a noodle and the food is fishcake
  snake: { nm: 'NOODLE RUN', col: '#f4e0a0', how: ['Arrows: steer the noodle', 'Eat fishcakes to grow', 'Don\'t bite yourself or the bowl!'], tk: 2,
    init(a) { a.sn = [[8, 7], [7, 7], [6, 7]]; a.d = [1, 0]; a.q = []; a.step = 0; a.spd = 9; a.food = this.free(a) },
    free(a) { for (let k = 0; k < 400; k++) { const p = [rndi(18), rndi(14)]; if (!a.sn.some(s => s[0] == p[0] && s[1] == p[1])) return p } return [0, 0] },
    up(a) { const last = a.q.length ? a.q[a.q.length - 1] : a.d, tryD = d => { if (d[0] != -last[0] || d[1] != -last[1]) if (a.q.length < 3) a.q.push(d) };
      if (lf()) tryD([-1, 0]); if (rt()) tryD([1, 0]); if (up()) tryD([0, -1]); if (dn()) tryD([0, 1]);
      if (++a.step < a.spd) return; a.step = 0; if (a.q.length) a.d = a.q.shift(); const h = [a.sn[0][0] + a.d[0], a.sn[0][1] + a.d[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= 18 || h[1] >= 14 || a.sn.slice(0, -1).some(s => s[0] == h[0] && s[1] == h[1])) { beep(120, .3, 1, 'sawtooth'); shake = 6; return arcOver(a) }
      a.sn.unshift(h); if (h[0] == a.food[0] && h[1] == a.food[1]) { a.sc++; beep(880 + a.sc * 20, .05); a.spd = Math.max(4, 9 - (a.sc / 3 | 0)); a.food = this.free(a) } else a.sn.pop() },
    dr(a) { const ox = GX + 2, oy = GY; r(GX, GY, GW, GH, '#3a1a10'); for (let y = 0; y < 14; y++) for (let x = 0; x < 18; x++) r(ox + x * 8, oy + y * 8, 8, 8, (x + y) & 1 ? '#c8402a' : '#b8382a');
      r(ox - 2, oy, 2, GH, '#5a1a10'); r(ox + 144, oy, 2, GH, '#5a1a10');
      const f = a.food, fx = ox + f[0] * 8 + 4, fy = oy + f[1] * 8 + 4; ell(fx, fy, 3.5, 3.5, '#fff'); r(fx - 1, fy - 1, 2, 2, '#ff8ab0'); r(fx, fy - 2, 2, 1, '#ff8ab0');
      a.sn.forEach((s, i) => { const x = ox + s[0] * 8, y = oy + s[1] * 8; r(x, y, 8, 8, '#7a5a2a'); r(x + 1, y + 1, 6, 6, i ? '#f4e0a0' : '#ffe8b8'); if (i % 2 == 0) r(x + 2, y + 2, 4, 1, '#fff4d8');
        if (!i) { const ex = a.d[0], ey = a.d[1]; r(x + 3 + ex * 2 - (ey ? 2 : 0), y + 3 + ey * 2 - (ex ? 2 : 0), 1, 1, '#2a1a10'); r(x + 3 + ex * 2 + (ey ? 2 : 0), y + 3 + ey * 2 + (ex ? 2 : 0), 1, 1, '#2a1a10') } }) } },

  // ------------------------------------------------ WHACK-A-SPROUT
  whack: { nm: 'WHACK-A-SPROUT', col: '#5ac06a', how: ['Arrows: move the mallet  Z: bonk', 'Green +1, gold +3', 'Leave the purple ones alone!'], tk: 1,
    init(a) { a.cur = 4; a.h = Array.from({ length: 9 }, () => null); a.time = 60 * 30; a.bonk = 0 },
    up(a) { if (lf() && a.cur % 3) a.cur--; if (rt() && a.cur % 3 < 2) a.cur++; if (up() && a.cur > 2) a.cur -= 3; if (dn() && a.cur < 6) a.cur += 3; a.time--; if (a.bonk) a.bonk--;
      if (ok()) { a.bonk = 8; const m = a.h[a.cur]; if (m && !m.hit && m.t > 3 && m.t < m.life) { m.hit = 1; m.t = m.life; const v = m.k == 'gold' ? 3 : m.k == 'rot' ? -2 : 1; a.sc = Math.max(0, a.sc + v); beep(v > 0 ? 700 + v * 200 : 160, .07); if (v < 0) shake = 4 } else beep(260, .04) }
      if (a.t % Math.max(14, 34 - (a.t / 90 | 0)) == 0) { const free = a.h.map((m, i) => m ? -1 : i).filter(i => i >= 0); if (free.length) { const q = Math.random(); a.h[free[rndi(free.length)]] = { k: q < .1 ? 'gold' : q < .26 ? 'rot' : 'g', t: 0, life: Math.max(34, 70 - a.t / 40) } } }
      a.h = a.h.map(m => m && (++m.t < m.life + 8) ? m : null); if (a.time <= 0) arcOver(a) },
    dr(a) { r(GX, GY, GW, GH, '#3a7a3a'); for (let i = 0; i < 30; i++) r(GX + (i * 41) % GW, GY + (i * 29) % GH, 2, 1, '#4a8a4a');
      for (let i = 0; i < 9; i++) { const hx = GX + 30 + (i % 3) * 44, hy = GY + 30 + ((i / 3) | 0) * 32; ell(hx, hy + 4, 15, 6, '#5a3a1a'); ell(hx, hy + 3, 12, 4, '#1a0e06');
        const m = a.h[i]; if (m) { const rise = Math.min(1, m.t / 6, Math.max(0, (m.life + 8 - m.t) / 8)), up_ = Math.round(rise * 12); const c = m.k == 'gold' ? '#ffd23c' : m.k == 'rot' ? '#8a4ac8' : '#6ad86a', dk = m.k == 'gold' ? '#c8a020' : m.k == 'rot' ? '#5a2a8a' : '#3a9a3a';
          X.save(); X.beginPath(); X.rect(hx - 14, hy - 30, 28, 33); X.clip(); const by = hy + 3 - up_; r(hx - 5, by - 6, 10, 10, dk); r(hx - 4, by - 5, 8, 9, c); r(hx - 1, by - 11, 2, 5, '#3a9a3a'); ell(hx - 4, by - 11, 3, 2, '#5ac06a'); ell(hx + 4, by - 12, 3, 2, '#5ac06a');
          if (m.hit) { r(hx - 3, by - 2, 2, 1, '#1a1a1a'); r(hx + 1, by - 2, 2, 1, '#1a1a1a') } else if (m.k == 'rot') { r(hx - 3, by - 3, 1, 1, '#1a1a1a'); r(hx - 2, by - 2, 1, 1, '#1a1a1a'); r(hx + 2, by - 3, 1, 1, '#1a1a1a'); r(hx + 1, by - 2, 1, 1, '#1a1a1a') } else { r(hx - 3, by - 3, 1, 2, '#1a1a1a'); r(hx + 2, by - 3, 1, 2, '#1a1a1a'); r(hx - 1, by, 2, 1, '#c84a5a') }
          if (m.k == 'gold' && (a.t >> 2) & 1) r(hx + 5, by - 8, 1, 1, '#fff'); X.restore() }
        if (i == a.cur) { const s = a.bonk ? 4 : 0; r(hx + 6, hy - 22 + s, 3, 14, '#8a5a30'); r(hx - 2, hy - 28 + s, 18, 8, '#c84a3a'); r(hx - 2, hy - 28 + s, 18, 2, '#e86a5a'); if (a.bonk > 4) { r(hx - 12, hy - 6, 3, 1, '#fff'); r(hx + 10, hy - 6, 3, 1, '#fff') } } }
      r(GX + 4, GY + 4, (GW - 8) * a.time / 1800, 3, '#ffd23c') } },

  // ------------------------------------------------ DREAM DANCE: notes rise to the arrows at the top
  dance: { nm: 'DREAM DANCE', col: '#ff5a8a', how: ['Press the arrow as each note', 'reaches the outline at the top.', 'Perfect +2   Good +1'], tk: .6,
    init(a) { a.n = []; let t = 70, last = -1; for (let i = 0; i < 48; i++) { let l = rndi(4); if (l == last && Math.random() < .6) l = (l + 1 + rndi(3)) % 4; last = l; a.n.push({ t, l }); if (i % 8 == 7 && Math.random() < .5) a.n.push({ t, l: (l + 2) % 4 }); t += [14, 18, 22, 28][rndi(4)] } a.end = t + 40; a.combo = 0; a.best = 0; a.jd = null; a.lit = [0, 0, 0, 0] },
    up(a) { const pr = [lf(), dn(), up(), rt()]; for (let l = 0; l < 4; l++) { if (a.lit[l]) a.lit[l]--; if (!pr[l]) continue; a.lit[l] = 6; let best = null; for (const n of a.n) if (!n.j && n.l == l && Math.abs(n.t - a.t) <= 9 && (!best || Math.abs(n.t - a.t) < Math.abs(best.t - a.t))) best = n;
        if (best) { const d = Math.abs(best.t - a.t); best.j = d <= 3 ? 2 : 1; a.sc += best.j; a.combo++; a.best = Math.max(a.best, a.combo); a.jd = { s: d <= 3 ? 'PERFECT' : 'GOOD', t: 24, c: d <= 3 ? '#ffd23c' : '#2ee6e6' }; beep([523, 587, 659, 784][l] * (d <= 3 ? 2 : 1), .06, 1, 'triangle') } }
      for (const n of a.n) if (!n.j && a.t - n.t > 9) { n.j = -1; a.combo = 0; a.jd = { s: 'MISS', t: 20, c: '#ff5a5a' } }
      if (a.t % 28 == 0 && a.t < a.end - 40) beep(110, .04, .6, 'triangle'); if (a.jd && --a.jd.t <= 0) a.jd = null; if (a.t > a.end) arcOver(a) },
    dr(a) { r(GX, GY, GW, GH, '#140a2a'); for (let i = 0; i < 6; i++) r(GX, GY + i * 20 + ((a.t / 2) % 20), GW, 1, '#22144a');
      const lx = l => GX + 29 + l * 30, ty = GY + 14, cols = ['#ff5a8a', '#2ee6e6', '#5ac06a', '#ffd23c'];
      for (let l = 0; l < 4; l++) { r(lx(l) - 11, GY, 22, GH, a.lit[l] ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.03)'); arrowAt(l, lx(l), ty, a.lit[l] ? '#fff' : '#6a5a8a', '#000') }
      for (const n of a.n) { if (n.j > 0) continue; const y = ty + (n.t - a.t) * 1.6; if (y > GY + GH + 6 || y < GY - 6) continue; arrowAt(n.l, lx(n.l), y, n.j < 0 ? '#4a3a5a' : cols[n.l], '#000') }
      if (a.jd) txt(a.jd.s, GX + GW / 2, GY + 52, a.jd.c, 'center', 9); if (a.combo > 2) txt(a.combo + ' COMBO', GX + GW / 2, GY + 66, '#fff', 'center', 6) } },

  // ------------------------------------------------ CLAW DREAM
  claw: { nm: 'CLAW DREAM', col: '#c89aff', how: ['Left/Right: move the claw', 'Z: drop it', 'Three tries per play.'], tk: 0,
    init(a) { a.cx = GW / 2 + 10; a.cy = 12; a.st = 'move'; a.tries = 3; a.held = null; a.won = [];
      const K = ['bunny', 'bear', 'jelly', 'star', 'cat', 'bunny', 'bear', 'jelly', 'hitori']; a.pz = []; for (let i = 0; i < 9; i++) a.pz.push({ k: K[i], x: 34 + i * 12 + rnd(-3, 3), y: GH - 12 - (i % 2) * 6, vy: 0 }); a.pz.sort(() => Math.random() - .5) },
    up(a) { const C = a;
      if (C.st == 'move') { if (kL()) C.cx -= 1.4; if (kR()) C.cx += 1.4; C.cx = clamp(C.cx, 30, GW - 10); if (ok()) { C.st = 'down'; beep(330, .05) } }
      else if (C.st == 'down') { C.cy += 1.3; if (C.cy >= GH - 30) { C.st = 'grab'; C.gt = 0 } }
      else if (C.st == 'grab') { if (++C.gt == 14) { const p = C.pz.filter(p => !p.out).sort((u, v) => Math.abs(u.x - C.cx) - Math.abs(v.x - C.cx))[0]; if (p && Math.abs(p.x - C.cx) < 9) { C.held = p; C.slip = p.k == 'hitori' ? 20 : Math.random() < Math.abs(p.x - C.cx) / 12 + .12 ? rnd(16, 60) : -1; beep(520, .05) } } if (C.gt > 22) C.st = 'up' }
      else if (C.st == 'up') { C.cy -= 1; if (C.held) { C.held.x = C.cx; C.held.y = C.cy + 22; if (C.slip > 0 && C.cy < GH - 30 - C.slip) { C.held.vy = .5; C.held = null; beep(200, .1); if (C.slip == 20 && !a.hmsg) a.hmsg = 90 } } if (C.cy <= 12) { C.cy = 12; C.st = 'home' } }
      else if (C.st == 'home') { if (C.cx > 14) { C.cx -= 1.4; if (C.held) { C.held.x = C.cx; C.held.y = C.cy + 22 } } else { if (C.held) { C.held.out = 1; C.won.push(C.held.k); a.sc++; beep(988, .08); setTimeout(() => beep(1318, .1), 90) } C.held = null; C.tries--; C.st = C.tries > 0 ? 'back' : 'done' } }
      else if (C.st == 'back') { C.cx += 1.6; if (C.cx >= GW / 2) C.st = 'move' }
      else if (C.st == 'done') { if (++C.gt > 60) arcOver(a) }
      for (const p of C.pz) if (p.vy && p !== C.held) { p.y += p.vy; p.vy += .15; if (p.y >= GH - 12) { p.y = GH - 12; p.vy = 0 } } if (a.hmsg) a.hmsg-- },
    plush(k, x, y) { const c = { bunny: '#f4f0f4', bear: '#c8884a', jelly: '#2ee6e6', star: '#ffd23c', cat: '#3a3640', hitori: '#f4d8c0' }[k];
      if (k == 'bunny') { r(x - 3, y - 12, 2, 6, c); r(x + 1, y - 12, 2, 6, c) } if (k == 'bear' || k == 'cat') { r(x - 4, y - 8, 3, 3, c); r(x + 1, y - 8, 3, 3, c) }
      ell(x, y - 3, 5, 5, c); if (k == 'hitori') { r(x - 5, y - 9, 10, 4, '#1a1418'); r(x - 5, y - 6, 2, 6, '#1a1418'); r(x + 3, y - 6, 2, 6, '#1a1418') } if (k == 'star') { r(x - 7, y - 4, 14, 2, c); r(x - 1, y - 10, 2, 14, c) }
      r(x - 2, y - 4, 1, 1, '#1a1418'); r(x + 1, y - 4, 1, 1, '#1a1418'); if (k != 'jelly') r(x - 1, y - 2, 2, 1, '#e86a8a') },
    dr(a) { const C = a; r(GX, GY, GW, GH, '#1a1030'); r(GX + 2, GY + 2, GW - 4, GH - 4, '#2a1a4a'); for (let i = 0; i < 8; i++) r(GX + 6 + i * 18, GY + 4, 6, GH - 8, 'rgba(255,255,255,.03)');
      r(GX + 2, GY + 10, GW - 4, 2, '#8a8ab0'); ell(GX + GW / 2 + 10, GY + GH - 4, 64, 10, '#3a2a5a');
      r(GX + 4, GY + GH - 34, 22, 32, '#0b0a1a'); r(GX + 4, GY + GH - 34, 22, 2, '#c89aff'); txt('PRIZE', GX + 15, GY + GH - 30, '#c89aff', 'center', 5);
      for (const p of C.pz) if (!p.out && p !== C.held) this.plush(p.k, GX + p.x, GY + p.y);
      const x = GX + C.cx, y = GY + C.cy; r(x - 6, GY + 8, 12, 5, '#c8c8d8'); r(x - 1, GY + 12, 2, y - GY - 12, '#9a9ab8'); r(x - 5, y, 10, 4, '#c8c8d8'); const op = C.st == 'down' || (C.st == 'grab' && C.gt < 14) ? 3 : 0;
      r(x - 6 - op, y + 4, 2, 9, '#9a9ab8'); r(x + 4 + op, y + 4, 2, 9, '#9a9ab8'); r(x - 1, y + 4, 2, 10, '#9a9ab8'); r(x - 4 - op, y + 12, 2, 2, '#9a9ab8'); r(x + 2 + op, y + 12, 2, 2, '#9a9ab8');
      if (C.held) this.plush(C.held.k, GX + C.held.x, GY + C.held.y);
      for (let i = 0; i < 3; i++) r(GX + GW - 30 + i * 8, GY + 16, 6, 6, i < C.tries ? '#c89aff' : '#3a2a5a');
      if (a.hmsg) { r(GX + 14, GY + 40, GW - 28, 14, '#000'); txt('The Hitori plush slips. It never fits.', GX + GW / 2, GY + 43, '#ddd', 'center', 5) } } },

  // ------------------------------------------------ AIR HOCKEY
  hockey: { nm: 'AIR HOCKEY', col: '#2ee6e6', how: ['Arrows: move your paddle', 'First to 5 goals wins.', ''], tk: .5,
    init(a) { a.p = { x: GW / 2, y: GH - 16 }; a.c = { x: GW / 2, y: 16 }; a.ps = 0; a.cs = 0; a.opp = partyHas(0) ? 'STEVEN' : 'CPU'; this.serve(a, 1) },
    serve(a, d) { a.k = { x: GW / 2, y: GH / 2, vx: rnd(-1, 1), vy: d * 1.2 }; a.pause = 40 },
    up(a) { const P = a.p, C = a.c, K = a.k, ox = P.x, oy = P.y; if (kL()) P.x -= 2.2; if (kR()) P.x += 2.2; if (kU()) P.y -= 2.2; if (kD()) P.y += 2.2; P.x = clamp(P.x, 20, GW - 20); P.y = clamp(P.y, GH / 2 + 8, GH - 8); P.vx = P.x - ox; P.vy = P.y - oy;
      const cs = 1.15 + a.cs * .05 + a.ps * .12, tx = K.y < GH / 2 + 10 ? K.x : GW / 2, ty = K.y < GH / 2 && K.vy < .5 ? K.y - 6 : 16, cx0 = C.x, cy0 = C.y; C.x += clamp(tx - C.x, -cs, cs); C.y += clamp(ty - C.y, -cs, cs); C.y = clamp(C.y, 8, GH / 2 - 8); C.x = clamp(C.x, 20, GW - 20); C.vx = C.x - cx0; C.vy = C.y - cy0;
      if (a.pause > 0) { a.pause--; return }
      K.x += K.vx; K.y += K.vy; K.vx *= .997; K.vy *= .997; if (K.x < 18) { K.x = 18; K.vx = Math.abs(K.vx); beep(400, .02) } if (K.x > GW - 18) { K.x = GW - 18; K.vx = -Math.abs(K.vx); beep(400, .02) }
      const inGoal = Math.abs(K.x - GW / 2) < 20;
      if (K.y < 6) { if (inGoal) { a.ps++; a.sc += 10; beep(988, .1); setTimeout(() => beep(1318, .12), 100); if (a.ps >= 5) { a.sc += 30; a.won = 1; return arcOver(a) } return this.serve(a, -1) } K.y = 6; K.vy = Math.abs(K.vy) }
      if (K.y > GH - 6) { if (inGoal) { a.cs++; beep(160, .25, 1, 'sawtooth'); shake = 4; if (a.cs >= 5) return arcOver(a); return this.serve(a, 1) } K.y = GH - 6; K.vy = -Math.abs(K.vy) }
      for (const Q of [P, C]) { const dx = K.x - Q.x, dy = K.y - Q.y, d = Math.hypot(dx, dy); if (d < 11 && d > 0) { const nx = dx / d, ny = dy / d; K.x = Q.x + nx * 11; K.y = Q.y + ny * 11; const vn = K.vx * nx + K.vy * ny; if (vn < 0) { K.vx -= 2 * vn * nx; K.vy -= 2 * vn * ny } K.vx += (Q.vx || 0) * .6 + nx * .4; K.vy += (Q.vy || 0) * .6 + ny * .4; beep(620, .02) } }
      const sp = Math.hypot(K.vx, K.vy); if (sp > 4) { K.vx *= 4 / sp; K.vy *= 4 / sp } },
    dr(a) { const ox = GX, oy = GY; r(ox, oy, GW, GH, '#14306a'); r(ox + 12, oy + 2, GW - 24, GH - 4, '#e8f0ff'); r(ox + 12, oy + GH / 2, GW - 24, 1, '#ff5a8a'); X.strokeStyle = '#8ab0e8'; X.lineWidth = .5; X.beginPath(); X.arc(ox + GW / 2, oy + GH / 2, 14, 0, 6.3); X.stroke();
      r(ox + GW / 2 - 20, oy, 40, 3, '#0b0a24'); r(ox + GW / 2 - 20, oy + GH - 3, 40, 3, '#0b0a24');
      const pad = (Q, c) => { ell(ox + Q.x, oy + Q.y + 1, 7, 7, '#0b0a24'); ell(ox + Q.x, oy + Q.y, 7, 7, c); ell(ox + Q.x, oy + Q.y - 1, 3, 3, sh(c, 1.3)) }; pad(a.c, '#2ee6e6'); pad(a.p, '#ff5a8a');
      ell(ox + a.k.x, oy + a.k.y, 4, 4, '#1a1a24'); r(ox + a.k.x - 1, oy + a.k.y - 2, 2, 1, '#5a5a6a');
      txt(a.opp + ' ' + a.cs, ox + 14, oy + 6, '#2a6ab0', 'left', 6); txt('YOU ' + a.ps, ox + 14, oy + GH - 13, '#c83a6a', 'left', 6); if (a.pause > 20) txt(a.pause > 30 ? 'READY' : 'GO!', ox + GW / 2, oy + GH / 2 - 16, '#14306a', 'center', 8) } },

  // ------------------------------------------------ NIGHT DRIVE: three lanes, oncoming traffic
  racer: { nm: 'NIGHT DRIVE', col: '#ff7a3a', how: ['Left/Right: change lanes', 'Don\'t hit anything.', 'The longer you drive, the faster it gets.'], tk: 1,
    init(a) { a.ln = 1; a.x = 1; a.cars = []; a.sp = 1.7; a.dist = 0; a.crash = 0 },
    up(a) { if (a.crash) { if (++a.crash > 50) arcOver(a); return } if (lf() && a.ln > 0) { a.ln--; beep(300, .03) } if (rt() && a.ln < 2) { a.ln++; beep(300, .03) } a.x += (a.ln - a.x) * .25; a.sp = Math.min(4.2, a.sp + .0012); a.dist += a.sp; a.sc = a.dist / 40 | 0;
      if (a.t % Math.max(22, 54 - (a.t / 60 | 0)) == 0) { const l = rndi(3); if (!a.cars.some(c => c.y < 20)) a.cars.push({ l, y: -16, c: ['#2ee6e6', '#ffd23c', '#c89aff', '#5ac06a'][rndi(4)], v: rnd(.3, .9) }) }
      for (const c of a.cars) { c.y += a.sp * c.v + a.sp * .4; if (Math.abs(c.l - a.x) < .55 && Math.abs(c.y - (GH - 22)) < 17) { a.crash = 1; shake = 10; beep(90, .5, 1, 'sawtooth') } } a.cars = a.cars.filter(c => c.y < GH + 20) },
    car(x, y, c, me) { r(x - 7, y - 10, 14, 20, '#0b0a1a'); r(x - 6, y - 9, 12, 18, c); r(x - 5, y - 6, 10, 4, '#1a2a4a'); r(x - 5, y + 3, 10, 3, '#1a2a4a'); r(x - 6, y - 9, 12, 1, sh(c, 1.3));
      if (me) { r(x - 5, y - 11, 3, 2, '#fff6c8'); r(x + 2, y - 11, 3, 2, '#fff6c8') } else { r(x - 5, y + 8, 3, 2, '#ff3a3a'); r(x + 2, y + 8, 3, 2, '#ff3a3a') } },
    dr(a) { r(GX, GY, GW, GH, '#06102e'); r(GX + 18, GY, GW - 36, GH, '#1a1a2a'); r(GX + 16, GY, 2, GH, '#ff5a8a'); r(GX + GW - 18, GY, 2, GH, '#2ee6e6');
      const off = (a.dist * 1.5) % 16; for (let y = -16; y < GH; y += 16) for (const lx of [55, 92]) r(GX + lx, GY + y + off, 2, 8, '#8a8aa8');
      for (let y = -24; y < GH; y += 24) { r(GX + 4, GY + y + (a.dist % 24), 6, 10, '#0b2252'); r(GX + GW - 10, GY + y + ((a.dist + 12) % 24), 6, 10, '#2a0a3a') }
      const lx = l => GX + 37 + l * 37; for (const c of a.cars) this.car(lx(c.l), GY + c.y, c.c); this.car(lx(a.x), GY + GH - 22, '#ff5a8a', 1);
      if (a.crash) { const k = a.crash; ell(lx(a.x), GY + GH - 22, 6 + k / 3, 6 + k / 3, k & 4 ? '#ffd23c' : '#ff7a3a') } txt(a.sc + ' km', GX + GW - 22, GY + 4, '#fff', 'right', 6) } },

  // ------------------------------------------------ BRICK DREAM (in the pinball cabinets)
  brick: { nm: 'BRICK DREAM', col: '#ff8ab0', how: ['Left/Right: move the paddle', 'Z: launch the ball', 'Three balls.'], tk: .5,
    init(a) { a.px = GW / 2; a.balls = 3; a.lv = 0; this.fill(a); this.reset(a) },
    fill(a) { a.br = []; for (let j = 0; j < 5; j++) for (let i = 0; i < 8; i++) a.br.push({ x: 6 + i * 17, y: 12 + j * 8, c: ['#ff5a8a', '#ff8a3a', '#ffd23c', '#5ac06a', '#2ee6e6'][j], v: 5 - j }) },
    reset(a) { a.st = 1; a.b = { x: a.px, y: GH - 14, vx: 0, vy: 0 } },
    up(a) { if (kL()) a.px -= 2.6; if (kR()) a.px += 2.6; a.px = clamp(a.px, 14, GW - 14); const B = a.b;
      if (a.st) { B.x = a.px; B.y = GH - 14; if (ok()) { a.st = 0; B.vx = rnd(-1, 1); B.vy = -(1.8 + a.lv * .3) } return }
      B.x += B.vx; B.y += B.vy; if (B.x < 3 || B.x > GW - 3) { B.vx *= -1; B.x = clamp(B.x, 3, GW - 3) } if (B.y < 3) { B.vy = Math.abs(B.vy) }
      if (B.vy > 0 && B.y > GH - 13 && B.y < GH - 8 && Math.abs(B.x - a.px) < 14) { B.vy = -Math.abs(B.vy); B.vx = (B.x - a.px) / 6; beep(440, .02) }
      for (const q of a.br) if (!q.dead && B.x > q.x - 1 && B.x < q.x + 16 && B.y > q.y - 1 && B.y < q.y + 7) { q.dead = 1; B.vy *= -1; a.sc += q.v; beep(600 + q.v * 80, .03); break }
      if (a.br.every(q => q.dead)) { a.lv++; this.fill(a); this.reset(a) }
      if (B.y > GH + 4) { a.balls--; beep(150, .2, 1, 'sawtooth'); if (a.balls <= 0) return arcOver(a); this.reset(a) } },
    dr(a) { r(GX, GY, GW, GH, '#0e0820'); for (const q of a.br) if (!q.dead) { r(GX + q.x, GY + q.y, 16, 7, sh(q.c, .6)); r(GX + q.x, GY + q.y, 15, 6, q.c); r(GX + q.x, GY + q.y, 15, 1, sh(q.c, 1.3)) }
      r(GX + a.px - 13, GY + GH - 10, 26, 4, '#c8c8e8'); r(GX + a.px - 13, GY + GH - 10, 26, 1, '#fff'); ell(GX + a.b.x, GY + a.b.y, 2, 2, '#fff');
      for (let i = 0; i < a.balls; i++) ell(GX + 6 + i * 6, GY + GH - 3, 2, 2, '#ff8ab0') } },
};
// which game each plain cabinet runs (decided by its spot, so a cabinet always plays the same thing)
const CABGAMES = ['star', 'snake', 'whack', 'racer', 'brick', 'star', 'whack', 'snake'];
const QUESTGAME = { a1: ['star', 15], a2: ['snake', 8], a3: ['racer', 25] };

let ARC = null;
EV.arc = e => { let g = e.game, tgt = 0; const q = e.set && QUESTGAME[e.set] && S.fl.ar1;
  if (e.set && QUESTGAME[e.set]) { g = QUESTGAME[e.set][0]; tgt = QUESTGAME[e.set][1] }
  if (!g) g = CABGAMES[(e.at[0] * 3 + e.at[1] * 5) % CABGAMES.length];
  ARC = { id: g, ph: 'title', t: 0, sc: 0, e, quest: q ? e.set : null, tgt, won: 0, tick0: 0, hi: (S.hi || {})[g] || 0 }; sc = 'arc'; beep(660, .05); setTimeout(() => beep(990, .06), 70) };
function arcOver(a) { a.ph = 'over'; a.ot = 0; const G_ = GAMES[a.id]; a.tk = a.id == 'claw' ? a.sc * 12 : Math.floor(a.sc * G_.tk); S.tickets = (S.tickets || 0) + a.tk; S.hi = S.hi || {}; a.newhi = a.sc > (S.hi[a.id] || 0); if (a.newhi) S.hi[a.id] = a.sc;
  if (a.quest && a.sc >= a.tgt && !S.fl[a.quest]) { flag(a.quest); questCheck(); a.qwin = 1 } }
function arcLeave() { const a = ARC; ARC = null; sc = 'world'; if (a.qwin) D(a.e.say && a.e.say.length ? a.e.say : ['Hitori:happy|New high score.']) }
XSC.arc = function () {
  const a = ARC, G_ = GAMES[a.id]; a.t++;
  if (a.ph == 'title') { if (esc() || hit.KeyX) return arcLeave();
    if (ok()) { if (!a.quest) { if (money() < 1) { a.msg = 60; beep(160, .2) } else { S.money -= 1; a.ph = 'play'; a.t = 0; a.sc = 0; G_.init(a); beep(880, .06) } } else { a.ph = 'play'; a.t = 0; a.sc = 0; G_.init(a); beep(880, .06) } } }
  else if (a.ph == 'play') { if (esc() || hit.KeyX) { arcOver(a) } else G_.up(a) }
  else if (a.ph == 'over') { a.ot++; if (a.ot > 30 && (esc() || hit.KeyX)) return arcLeave(); if (a.ot > 30 && ok()) { a.ph = 'title'; a.t = 0 } }
  // ---- draw: the room behind, then the cabinet filling the screen
  sU(); drawWorld(); sU(); r(0, 0, W, H, 'rgba(4,2,16,.7)');
  const col = G_.col; r(64, 2, 192, 176, '#05040e'); r(66, 4, 188, 172, sh(col, .25)); r(68, 6, 184, 168, '#0b0a1a'); r(70, 6, 180, 15, col); r(70, 6, 180, 2, sh(col, 1.25)); r(70, 19, 180, 2, sh(col, .6));
  txt(G_.nm, 160, 8, '#0b0a1a', 'center', 9);
  r(GX - 4, GY - 4, GW + 8, GH + 8, '#000'); r(GX - 3, GY - 3, GW + 6, GH + 6, '#1a1a2a');
  X.save(); X.beginPath(); X.rect(GX, GY, GW, GH); X.clip();
  if (a.ph == 'title') { r(GX, GY, GW, GH, '#0a0a1e'); for (let i = 0; i < 16; i++) r(GX + (i * 47 + a.t / 3) % GW, GY + (i * 31) % GH, 1, 1, '#4a4a7a');
    txt(G_.nm, GX + GW / 2, GY + 10, col, 'center', 10); G_.how.forEach((l, i) => txt(l, GX + GW / 2, GY + 34 + i * 10, '#c8c8e8', 'center', 6));
    if (a.quest) { txt('TOP SCORE   STV   ' + a.tgt, GX + GW / 2, GY + 70, '#ffd23c', 'center', 6); txt(S.fl[a.quest] ? '(beaten!)' : 'Beat it for Steven.', GX + GW / 2, GY + 80, '#8a8ab0', 'center', 5) }
    else txt('YOUR BEST  ' + ((S.hi || {})[a.id] || 0), GX + GW / 2, GY + 72, '#8a8ab0', 'center', 6);
    if ((a.t >> 4) & 1) txt(a.quest ? 'PRESS Z  (FREE PLAY)' : 'PRESS Z  ($1)', GX + GW / 2, GY + 94, '#fff', 'center', 7);
    if (a.msg > 0) { a.msg--; r(GX + 10, GY + 50, GW - 20, 18, '#000'); txt('INSERT COIN. You\'re out of money.', GX + GW / 2, GY + 55, '#ff8a8a', 'center', 6) } }
  else { G_.dr(a); if (a.id != 'hockey' && a.id != 'racer') txt(String(a.sc), GX + GW / 2, GY + 3, '#fff', 'center', 7);
    if (a.ph == 'over') { r(GX + 14, GY + 28, GW - 28, 58, 'rgba(0,0,0,.85)'); r(GX + 14, GY + 28, GW - 28, 1, col);
      txt(a.id == 'hockey' ? (a.won ? 'YOU WIN!' : a.opp + ' WINS') : 'GAME OVER', GX + GW / 2, GY + 32, col, 'center', 9); txt('SCORE ' + a.sc + (a.newhi ? '  NEW BEST!' : ''), GX + GW / 2, GY + 46, '#fff', 'center', 6);
      txt('+' + a.tk + ' tickets', GX + GW / 2, GY + 56, '#ffd23c', 'center', 6); if (a.quest) txt(a.qwin || S.fl[a.quest] ? 'Beat STV!' : 'Need ' + a.tgt + ' to beat STV.', GX + GW / 2, GY + 66, a.qwin || S.fl[a.quest] ? '#5ac06a' : '#ff8a8a', 'center', 6);
      if (a.ot > 30) txt('Z: AGAIN   X: LEAVE', GX + GW / 2, GY + 76, '#8a8ab0', 'center', 5) } }
  X.restore();
  // control panel
  r(70, 142, 180, 30, '#14102a'); r(70, 142, 180, 1, sh(col, .6)); ell(100, 156, 7, 7, '#0b0a1a'); r(99, 146, 2, 9, '#c8c8d8'); ell(100, 146, 3, 3, '#ff5a8a');
  for (let i = 0; i < 3; i++) { ell(130 + i * 14, 157, 4, 3, '#0b0a1a'); ell(130 + i * 14, 156, 4, 3, ['#ff5a8a', '#ffd23c', '#2ee6e6'][i]) }
  txt('TICKETS ' + (S.tickets || 0), 236, 148, '#ffd23c', 'right', 6); txt('$' + money(), 236, 158, '#8f8', 'right', 6);
  txt(a.ph == 'play' ? 'X: QUIT' : '', 236, 166, '#6a6a8a', 'right', 5);
};
// ---------------------------------------------------------------- the prize counter
const TPRIZES = [['candy', 5], ['cookie', 10], ['soda', 15], ['bento', 40], ['$10', 30], ['plush', 99]];
EV.prizes = () => { const tk = S.tickets || 0, L = TPRIZES.filter(([id]) => id == '$10' || id == 'plush' ? !(id == 'plush' && S.fl.plush) : CONS[id]);
  ask(['|The prize counter. A sign: "TICKETS ONLY. NO REFUNDS. NO EXCEPTIONS."', '|You have ' + tk + ' tickets.'], L.map(([id, c]) => (id == '$10' ? '$10' : id == 'plush' ? 'Hitori plush' : CONS[id].n) + '  (' + c + ' tk)').concat(['Leave']), k => {
    if (k >= L.length) return; const [id, c] = L[k]; if (tk < c) { beep(160, .2); return D(['|Not enough tickets. (' + c + ' needed.)']) } S.tickets = tk - c; beep(988, .06); setTimeout(() => beep(1318, .08), 80);
    if (id == '$10') { S.money = money() + 10; return D(['|The counter slides a crumpled $10 bill across. It smells like popcorn.']) }
    if (id == 'plush') { S.fl.plush = 1; return D(['|The plush that looks like you. It\'s softer than it looks.', 'Hitori:blush|...I\'m keeping this.', 'Steven:happy|It has your frown! It\'s perfect.']) }
    bagAdd(id, 1); D(['|Got a ' + CONS[id].n + '! (' + (S.tickets) + ' tickets left.)']) }) };
// the bar's three cabinets play games too
(function () { const B_ = AREAS.n_bar; if (!B_) return; let i = 0; for (const e of B_.ents) if (e.kind == 'arcadecab') { e.ev = 'arc'; e.game = ['racer', 'whack', 'brick'][i++ % 3] } })();
