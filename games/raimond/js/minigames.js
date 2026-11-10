// ==================== FEAR MINIGAMES (one per day) ====================
function mini(k, cb) {
  MG = { k, cb, t: 0, p: 0, x: W / 2, y: H / 2, miss: 0, eyes: [], sp: [], ob: [], air: 1, depth: 0, bal: .5, v: 0, out: 0, done: 0, worry: 0 };
  if (k == 'dark') for (let i = 0; i < 6; i++) MG.eyes.push({ x: 40 + Math.random() * 240, y: 30 + Math.random() * 110, c: 0, a: Math.random() * 6 });
  if (k == 'water') MG.x = W / 2; sc = 'mini'; music('scary');
}
function miniWin() { if (MG.done) return; MG.done = 1; beep(880, .3); setTimeout(() => beep(1100, .3), 160); MG.t = 0 }
function miniUpdate() {
  const m = MG; m.t++;
  if (m.done) { if (m.t > 70) { const cb = m.cb; MG = null; sc = 'world'; cb() } return }
  if (m.k == 'dark') {
    const s = 1.8; m.x = clamp(m.x + ((keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0)) * s, 0, W); m.y = clamp(m.y + ((keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0)) * s, 20, H - 20);
    m.eyes.forEach(e => { e.x += Math.sin(m.t / 50 + e.a) * .25; e.y += Math.cos(m.t / 60 + e.a) * .15; if (Math.hypot(m.x - e.x, m.y - e.y) < 30) e.c += 1; else e.c = Math.max(0, e.c - .4) });
    m.eyes = m.eyes.filter(e => e.c < 80 || (beep(500, .1), false)); m.p = 1 - m.eyes.length / 6; if (!m.eyes.length) miniWin();
  }
  if (m.k == 'spider') {
    if (m.t % 44 == 0 && m.p + m.sp.length < 10 + m.miss) m.sp.push({ s: Math.random() * 4 | 0, d: 140 });
    m.sp.forEach(q => q.d -= .85 + m.p * .03); const kk = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], al = ['KeyW', 'KeyD', 'KeyS', 'KeyA'];
    for (let i = 0; i < 4; i++) if (hit[kk[i]] || hit[al[i]]) { const q = m.sp.filter(z => z.s == i && z.d < 48).sort((a, b) => a.d - b.d)[0]; if (q) { m.sp.splice(m.sp.indexOf(q), 1); m.p++; beep(700, .08); m.flash = 8 } else { m.flash = -6 } }
    if (m.sp.some(q => q.d < 8)) { m.sp = m.sp.filter(q => q.d >= 8); m.miss++; shake = 10; beep(100, .3, 1, 'sawtooth') } if (m.flash) m.flash += m.flash > 0 ? -1 : 1; if (m.p >= 10) miniWin();
  }
  if (m.k == 'water') {
    m.x = clamp(m.x + ((keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0)) * 2.2, 20, W - 20); m.depth += .0014; m.air -= .0013;
    if (m.t % 26 == 0) m.ob.push({ x: 20 + Math.random() * 280, y: H + 10, k: Math.random() < .42 ? 'air' : 'jelly' }); m.ob.forEach(o => { o.y -= 1.3 + (o.k == 'jelly' ? .3 : 0); o.x += Math.sin(m.t / 20 + o.y / 20) * .4 });
    for (const o of m.ob) if (Math.abs(o.x - m.x) < 11 && Math.abs(o.y - 70) < 12) { if (o.k == 'air') { m.air = Math.min(1, m.air + .22); beep(900, .06) } else { m.air -= .18; shake = 6; beep(120, .2, 1, 'sawtooth'); m.depth = Math.max(0, m.depth - .03) } o.y = -99 }
    m.ob = m.ob.filter(o => o.y > -20); if (m.air <= 0) { m.air = .5; m.depth = Math.max(0, m.depth - .12); m.worry = 60 } if (m.worry) m.worry--; m.p = m.depth; if (m.depth >= 1) miniWin();
  }
  if (m.k == 'height') {
    m.v += (Math.random() - .5) * .0016 + Math.sin(m.t / 70) * .0003; m.bal += m.v + ((keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0)) * .0065; m.v *= .98; m.bal = clamp(m.bal, 0, 1);
    if (Math.abs(m.bal - .5) < .2) { m.p += .0016; m.out = 0 } else { m.out++; m.p = Math.max(0, m.p - .0008); if (m.out > 50) { m.p = Math.max(0, m.p - .12); m.out = 0; m.bal = .5; m.v = 0; shake = 10 } } if (m.p >= 1) miniWin();
  }
}
function drawSpiderMG(x, y, s) { r(x - 3 * s, y - 3 * s, 6 * s, 5 * s, '#2a2024'); r(x - 2 * s, y - 2 * s, 4 * s, 3 * s, '#4a3a40'); for (let i = 0; i < 4; i++) { r(x - 8 * s, y - 4 * s + i * 2 * s, 5 * s, s, '#3a2c32'); r(x + 3 * s, y - 4 * s + i * 2 * s, 5 * s, s, '#3a2c32') } r(x - s, y - s, s, s, '#f33'); r(x + s, y - s, s, s, '#f33') }
function miniDraw() {
  const m = MG; sU(); const bar = (v, col) => { r(60, 170, 200, 5, '#000'); r(61, 171, 198 * clamp(v, 0, 1), 3, col) };
  if (m.k == 'dark') {
    r(0, 0, W, H, '#030308'); for (let i = 0; i < 9; i++) r(0, 12 + i * 2, W, 1, 'rgba(60,50,80,.12)'); r(0, 0, W, 18, '#08060c'); r(0, H - 18, W, 18, '#08060c');
    txt('Hold your light on the watching eyes', W / 2, 4, '#9a9ab0', 'center', 6);
    m.eyes.forEach(e => { const lit = Math.hypot(m.x - e.x, m.y - e.y) < 30; r(e.x - 6, e.y - 2, 4, 3, lit ? '#f55' : '#622'); r(e.x + 3, e.y - 2, 4, 3, lit ? '#f55' : '#622'); if (e.c) r(e.x - 8, e.y + 6, 16 * e.c / 80, 2, '#ffe27a') });
    const gr = X.createRadialGradient(m.x, m.y, 2, m.x, m.y, 36); gr.addColorStop(0, 'rgba(255,240,150,.8)'); gr.addColorStop(1, 'rgba(255,240,150,0)'); X.fillStyle = gr; X.fillRect(0, 0, W, H); spr(CH[PL], m.x, m.y + 8, 0, 0, 1); bar(m.p, '#ffe27a');
  }
  if (m.k == 'spider') {
    r(0, 0, W, H, '#0c0a0e'); txt('Slash each spider as it reaches the ring: press its arrow  ' + m.p + '/10', W / 2, 4, '#9a9ab0', 'center', 6);
    const cx = W / 2, cy = H / 2 + 4; for (let i = 0; i < 12; i++) { const a = i * .5236, len = 78 - Math.min(m.p, 10) * 3; for (let k = 8; k < len; k += 2) r(cx + Math.cos(a) * k * 1.3, cy + Math.sin(a) * k * .9, 1, 1, 'rgba(230,230,245,.5)') }
    for (let k = 14; k < 74; k += 14) for (let i = 0; i < 40; i++) { const a = i * .157; r(cx + Math.cos(a) * k * 1.3, cy + Math.sin(a) * k * .9, 1, 1, 'rgba(230,230,245,.3)') }
    X.strokeStyle = (m.flash || 0) > 0 ? '#fff' : '#744'; X.lineWidth = .6; X.beginPath(); X.ellipse(cx, cy, 52, 38, 0, 0, 6.28); X.stroke(); spr(CH[PL], cx, cy + 10, 0, 0, 1);
    m.sp.forEach(q => { const a = [[0, -1], [1, 0], [0, 1], [-1, 0]][q.s], x = cx + a[0] * (q.d + 8) * 1.3, y = cy + a[1] * (q.d + 8) * .9; drawSpiderMG(x, y, 1.2); if (q.d < 48) { r(x - 10, y - 12, 20, 1, '#ff8'); txt(['^', '>', 'v', '<'][q.s], x, y - 22, '#ff8', 'center', 7) } }); bar(m.p / 10, '#e8e8f4');
  }
  if (m.k == 'water') {
    const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a6a9a'); g.addColorStop(1, '#04182e'); X.fillStyle = g; X.fillRect(0, 0, W, H); for (let i = 0; i < 18; i++) r((i * 47 + m.t * .3) % W, (i * 31 - m.t * .6 + 4000) % H, 1, 2, 'rgba(255,255,255,.2)');
    txt('Swim down: LEFT / RIGHT. Grab air, dodge jellyfish', W / 2, 4, '#cfe8ff', 'center', 6);
    m.ob.forEach(o => { if (o.k == 'air') { ell(o.x, o.y, 5, 5, 'rgba(200,240,255,.35)'); ell(o.x, o.y, 4, 4, 'rgba(160,220,255,.55)'); r(o.x - 2, o.y - 3, 2, 1, '#fff') } else { ell(o.x, o.y - 3, 7, 6, '#e87ab8'); ell(o.x, o.y - 5, 5, 3, '#ffb0d8'); for (let i = 0; i < 4; i++) r(o.x - 5 + i * 3, o.y, 1, 6 + Math.sin(m.t / 6 + i) * 2, '#c8508a') } });
    spr(CH[PL], m.x, 78, 0, (m.t >> 3) % 4 + 1, 1); r(8, 20, 6, 120, '#000'); r(9, 21 + 118 * (1 - clamp(m.air, 0, 1)), 4, 118 * clamp(m.air, 0, 1), m.air < .3 ? '#f55' : '#9fe8ff'); txt('AIR', 11, 142, '#cfe8ff', 'center', 5);
    r(W - 14, 20, 6, 120, '#000'); r(W - 13, 21 + 118 * (1 - m.depth), 4, 118 * m.depth, '#f0e070'); if (m.depth > .8) { r(W / 2 - 18, H - 14 + (1 - m.depth) * 50, 36, 10, '#3a3a50'); r(W / 2 - 14, H - 12 + (1 - m.depth) * 50, 28, 6, '#ffd23c') }
    if (m.worry) txt('Breathe...', W / 2, 40, '#fff', 'center', 7);
  }
  if (m.k == 'height') {
    const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0c0c30'); g.addColorStop(1, '#5a7ac8'); X.fillStyle = g; X.fillRect(0, 0, W, H); for (let i = 0; i < 40; i++) r((i * 37) % W, (i * 23 + m.t * (.2 + (i % 3) * .1)) % H, 1, 1, 'rgba(255,255,255,.6)'); for (let i = 0; i < 4; i++) ell((i * 90 + m.t * .4) % (W + 60) - 30, 150 - i * 14, 30, 7, 'rgba(255,255,255,.25)');
    txt('Hold LEFT / RIGHT against the wind. Keep the marker in the green', W / 2, 4, '#e0e8ff', 'center', 6);
    const lx = W / 2, top = 18; r(lx - 14, top, 2, H - 30, '#9a9aa8'); r(lx + 12, top, 2, H - 30, '#9a9aa8'); for (let i = 0; i < 18; i++) r(lx - 14, top + ((i * 10 + m.p * 120) % (H - 36)), 28, 2, '#c8c8d6');
    const sway = (m.bal - .5) * 40; spr(CH[PL], lx + sway, 124, 3, (m.t >> 4) % 2 ? 1 : 3, 1.1); r(40, 160, 240, 6, '#000'); r(W / 2 - 48, 160, 96, 6, '#2a6a3a'); r(40 + 240 * m.bal - 2, 158, 4, 10, '#fff'); bar(m.p, '#9fe8ff');
  }
  if (m.done) { r(0, 0, W, H, 'rgba(255,255,255,' + Math.max(0, .5 - m.t / 70) + ')'); txt('...!', W / 2, 80, '#fff', 'center', 14) }
}
