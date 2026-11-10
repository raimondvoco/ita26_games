// ==================== v23: the fears become places. Hitori walks into each one alone, before she can beat it. ====================
// Each fear is a short black-and-white area with its own music. You walk through it while it gets worse, the
// old fear minigame is the moment you push back, and then the place changes and lets you out.
TRACKS.rukia2 = 'rukia2'; TRACKS.s2 = 's_2'; TRACKS.decay = 'decay';
let FS = null;   // the fear scene in progress
const _music23 = music; music = function (k) { if (FS && FS.mus && (sc == 'fear' || sc == 'mini')) return _music14(FS.mus); _music23(k) };   // a fear's own song wins over the day-1 dusk music
const fcv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
let fsd = 1; const frn = () => (fsd = fsd * 16807 % 2147483647) / 2147483647;
function segD(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1); return Math.hypot(px - ax - dx * t, py - ay - dy * t) }
function wobLine(g, pts, w, c) { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke() }
// a little B&W spider (used on the ground, on Hitori, and over the screen)
const SPIMG = loadImg('assets/fear/spider.png');
// pixel spiders (after the reference sprite): big = 13px with two walking frames, mini = 9px that twitch. rot: quarter turns (0 = facing down)
function bwSpider(x, y, s, t, a = 1, rot = 0) { if (!ready(SPIMG)) return; const big = s >= 1, fr = ((t / (big ? 7 : 4)) | 0) & 1, sx = big ? fr * 15 : 30 + fr * 11, w = big ? 15 : 11, k = big ? Math.max(1, Math.round(s)) : 1;
  X.globalAlpha = a; X.imageSmoothingEnabled = false; X.save(); X.translate(Math.round(x), Math.round(y)); X.rotate(rot * Math.PI / 2); X.drawImage(SPIMG, sx, 0, w, w, -((w * k) >> 1), -((w * k) >> 1), w * k, w * k); X.restore(); X.globalAlpha = 1 }
const _dsm23 = typeof drawSpiderMG == 'function' ? drawSpiderMG : null;
drawSpiderMG = function (x, y, s) { sW(); bwSpider(x * 2, y * 2, 2, tick); sU() };

// ---------------------------------------------------------------- the engine
function startFear(id) {
  const D0 = FEARDEF[id]; fsd = 7;
  FS = { id, D: D0, x: D0.start[0], y: D0.start[1], dir: D0.dir ?? 3, wf: 0, moving: 0, t: 0, cam: { x: 0, y: 0 }, fade: 1, white: 0, lock: 0, fired: {}, mus: D0.mus, st: {} };
  D0.init(FS); sc = 'fear'; beep(90, .5, 1, 'sine');
}
function fearAfter(n, f) { (FS.timers = FS.timers || []).push({ t: n, f }) }
function endFear(cb) { const F = FS; F.ending = 1; fearAfter(1, () => { FS = null; sc = 'world'; fade = 1; cb && cb() }) }
XSC.fear = function () {
  const F = FS; if (!F) { sc = 'world'; return } F.t++;
  if (F.timers) { for (const tm of F.timers) if (--tm.t == 0) tm.f(); F.timers = F.timers.filter(tm => tm.t > 0) }
  if (!FS) return;
  const D0 = F.D, busy = !!DL || F.lock || F.fade > .6;
  // move
  F.moving = 0;
  if (!busy) { const hx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0), hy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
    if (hx || hy) { const v = (D0.speed ? D0.speed(F) : 1.3) / (hx && hy ? 1.41 : 1), nx = F.x + hx * v, ny = F.y + hy * v;
      if (D0.walk(F, nx, F.y)) F.x = nx; if (D0.walk(F, F.x, ny)) F.y = ny; F.dir = hx > 0 ? 2 : hx < 0 ? 1 : hy > 0 ? 0 : 3; F.moving = 1; F.wf += .14 * v } }
  D0.update(F);
  if (!FS) return;
  // camera
  const vw = 640, vh = 360; F.cam.x = clamp(F.x - vw / 2, 0, Math.max(0, D0.W - vw)); F.cam.y = clamp(F.y - (D0.camOff || vh / 2 + 10), 0, Math.max(0, D0.H - vh));
  sW(); X.fillStyle = '#000'; X.fillRect(0, 0, 640, 360); X.save(); X.translate(-Math.round(F.cam.x) + (shake > 0 ? (Math.random() * 4 - 2) | 0 : 0), -Math.round(F.cam.y)); if (shake > 0) shake--;
  D0.draw(F);
  X.restore();
  if (D0.overlay) D0.overlay(F);
  sW(); if (F.white > 0) { X.fillStyle = 'rgba(255,255,255,' + Math.min(1, F.white) + ')'; X.fillRect(0, 0, 640, 360) }
  if (F.fade > 0) { X.fillStyle = 'rgba(0,0,0,' + Math.min(1, F.fade) + ')'; X.fillRect(0, 0, 640, 360); if (!F.holdFade) F.fade = Math.max(0, F.fade - .02) }
  sU(); if (DL) { dialogUpdate(); if (DL) drawDialog() }
};
function drawHitori(F, x, y, dir, fr, gray = true) {   // a white outline so she stands out against the black, like the player in the reference
  x = Math.round(x); y = Math.round(y);
  if (gray) { X.filter = 'brightness(0) invert(1)'; for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) drawChar(CH[PL], x + dx, y + dy, dir, fr, 1); X.filter = 'grayscale(1) brightness(1.5) contrast(1.1)' }
  drawChar(CH[PL], x, y, dir, fr, 1); X.filter = 'none' }
const hFrame = F => F.moving ? 1 + Math.floor(F.wf) % 4 : 0;
function vignette(F, r0, r1, a, col = '0,0,0') { const sx = F.x - F.cam.x, sy = F.y - 14 - F.cam.y, g = X.createRadialGradient(sx, sy, r0, sx, sy, r1); g.addColorStop(0, 'rgba(' + col + ',0)'); g.addColorStop(1, 'rgba(' + col + ',' + a + ')'); X.fillStyle = g; X.fillRect(0, 0, 640, 360) }
function trigOnce(F, key, cond, f) { if (!F.fired[key] && cond && !DL && !F.ending) { F.fired[key] = 1; f() } }

// ================================================================ 1. THE DARK: down the well
const DK = { W: 800, H: 1000, path: [[400, 940], [372, 860], [312, 790], [322, 700], [420, 630], [468, 550], [432, 470], [402, 390], [400, 320]], hw: 34, cl: [400, 238, 250, 104] };
function dkWalk(F, x, y) {
  if (x < 20 || x > DK.W - 20 || y < 20 || y > DK.H - 20) return false;
  if (x > 380 && x < 418 && y > 190 && y < 224) return false;   // the trunk
  if (F.st.bright && x > 372 && x < 428 && y > 40 && y < 240) return true;   // the way up, once it's light
  const [cx, cy, rx, ry] = DK.cl; if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1) return true;
  for (let i = 1; i < DK.path.length; i++) if (segD(x, y, ...DK.path[i - 1], ...DK.path[i]) < DK.hw) return true; return false;
}
function dkRender(bright) {
  const c = fcv(DK.W, DK.H), g = c.getContext('2d'), F0 = { st: { bright } }; fsd = 3;
  const P = bright ? { bg: '#efe9dc', leaf: '#2a2a2a', leaf2: '#6a6a6a', trunk: '#d8d0c0', tl: '#5a5a5a', grass: '#8a9a7a', canopy: '#8ab878', canopy2: '#5a8a4a' } : { bg: '#000', leaf: '#e8e8e8', leaf2: '#8a8a8a', trunk: '#101010', tl: '#bdbdbd', grass: '#3a3a3a', canopy: '#a8a8a8', canopy2: '#6a6a6a' };
  g.fillStyle = P.bg; g.fillRect(0, 0, DK.W, DK.H);
  const cs = 4, gw = DK.W / cs, gh = DK.H / cs, M = new Uint8Array(gw * gh); for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) M[j * gw + i] = dkWalk(F0, i * cs + 2, j * cs + 2) ? 1 : 0;
  const m = (i, j) => i >= 0 && j >= 0 && i < gw && j < gh && M[j * gw + i];
  // tree trunks behind every edge that faces down onto the floor (the back walls of the clearing and the path)
  for (let i = 0; i < gw; i += 4 + (frn() * 3 | 0)) for (let j = 1; j < gh; j++) if (m(i, j) && !m(i, j - 1)) {
    const x = i * cs, y = j * cs, tw = 14 + frn() * 10, th = 90 + frn() * 70; g.fillStyle = P.trunk; g.fillRect(x - tw / 2, y - th, tw, th + 2);
    for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? P.tl : P.leaf2; const lx = x - tw / 2 + 2 + k * (tw - 4) / 3; g.fillRect(lx, y - th + frn() * 20, 1.5, th - frn() * 30) }
    for (let k = 0; k < 10; k++) { const a = frn() * 6.28, rr = 4 + frn() * 10; leaf(g, x + Math.cos(a) * rr * 1.4, y - th + Math.sin(a) * rr * .6, P) }
    break }
  // white leaves all along the edge of the dark
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) if (!m(i, j) && (m(i + 1, j) || m(i - 1, j) || m(i, j + 1) || m(i, j - 1) || m(i + 2, j) || m(i - 2, j)) && frn() < .55) leaf(g, i * cs + frn() * 4, j * cs + frn() * 4, P);
  // scattered bushes out in the dark
  for (let k = 0; k < 60; k++) { const x = frn() * DK.W, y = frn() * DK.H; if (dkWalk(F0, x, y)) continue; for (let q = 0; q < 6; q++) leaf(g, x + (frn() - .5) * 18, y + (frn() - .5) * 10, P, .7) }
  // grass tufts on the floor
  for (let k = 0; k < 140; k++) { const x = frn() * DK.W, y = frn() * DK.H; if (!dkWalk(F0, x, y)) continue; g.strokeStyle = P.grass; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 3, y - 3); g.lineTo(x - 1, y); g.lineTo(x + 1, y - 4); g.moveTo(x + 2, y - 2); g.lineTo(x + 3, y); g.lineTo(x + 5, y - 3); g.stroke() }
  // the photographs you landed on
  for (let k = 0; k < 26; k++) { const x = 400 + (frn() - .5) * 70, y = 920 + (frn() - .5) * 34, a = (frn() - .5) * 1.6; g.save(); g.translate(x, y); g.rotate(a);
    g.fillStyle = bright ? '#fff' : '#d8d8d8'; g.fillRect(-9, -11, 18, 22); g.fillStyle = bright ? '#9aa0a8' : '#3a3a3a'; g.fillRect(-7, -9, 14, 14);
    g.strokeStyle = '#000'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-6, -2); for (let q = 0; q < 6; q++) g.lineTo(-6 + frn() * 12, -8 + frn() * 12); g.stroke(); g.restore() }
  // the hollow tree (cut from the reference picture: the noose is part of it; the bright one has none)
  const TI = bright ? FTREE_B : FTREE_N; if (ready(TI)) { g.imageSmoothingEnabled = false; g.drawImage(TI, 400 - 50 * 1.3, 222 - TI.naturalHeight * 1.3, TI.naturalWidth * 1.3, TI.naturalHeight * 1.3) }
  if (bright) { for (let k = 0; k < 5; k++) { const x = 340 + k * 30; const gr = g.createLinearGradient(0, 0, 0, 260); gr.addColorStop(0, 'rgba(255,250,220,.55)'); gr.addColorStop(1, 'rgba(255,250,220,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 14, 0); g.lineTo(x + 40, 260); g.lineTo(x + 10, 260); g.fill() } }
  return c;
}
function leaf(g, x, y, P, s = 1) { const c = frn() < .7 ? P.leaf : P.leaf2; g.strokeStyle = c; g.lineWidth = 1.1; g.beginPath(); g.moveTo(x - 3 * s, y + 2 * s); g.lineTo(x, y - 3 * s); g.lineTo(x + 3 * s, y + 2 * s); g.moveTo(x, y - 3 * s); g.lineTo(x, y + 3 * s); g.stroke() }
const FTREE_N = loadImg('assets/fear/tree_noose.png'), FTREE_B = loadImg('assets/fear/tree_bright.png'), FSHORE = loadImg('assets/fear/shore.png');
function dkNoose(F) { return; const sw = Math.sin(F.t / 40) * 3, x = 446, y = 152; X.strokeStyle = '#cfcfcf'; X.lineWidth = 2; X.beginPath(); X.moveTo(x, y); X.quadraticCurveTo(x + sw * .5, y + 26, x + sw, y + 44); X.stroke(); X.beginPath(); X.ellipse(x + sw, y + 52, 6, 8, sw * .03, 0, 7); X.stroke(); X.fillStyle = '#cfcfcf'; X.fillRect(x + sw - 3, y + 40, 6, 5) }
// a pixel-art eye, 7x4: dark-red rim, red iris, a pupil that follows you, one highlight pixel. shut: 0 open, 1 half, 2 closed
function pixEye(x, y, shut, px, py) { const P = (a, b, w, h, c) => { X.fillStyle = c; X.fillRect(x + a, y + b, w, h) };   // 7x5
  if (shut == 2) { P(1, 2, 5, 1, '#5a0008'); P(2, 2, 3, 1, '#a0101a'); return }
  if (shut == 1) { P(1, 1, 5, 1, '#5a0008'); P(0, 2, 1, 2, '#5a0008'); P(6, 2, 1, 2, '#5a0008'); P(1, 2, 5, 2, '#ff2a2a'); P(1, 4, 5, 1, '#5a0008'); P(3 + px, 2, 1, 2, '#2a0004'); return }
  P(2, 0, 3, 1, '#5a0008'); P(1, 1, 1, 1, '#5a0008'); P(5, 1, 1, 1, '#5a0008'); P(0, 2, 1, 1, '#5a0008'); P(6, 2, 1, 1, '#5a0008'); P(1, 3, 1, 1, '#5a0008'); P(5, 3, 1, 1, '#5a0008'); P(2, 4, 3, 1, '#5a0008');
  P(2, 1, 3, 1, '#ff3a3a'); P(1, 2, 5, 1, '#ff2a2a'); P(2, 3, 3, 1, '#c8101a');
  P(3 + px, 1 + py, 1, 2, '#1a0002'); P(2, 1, 1, 1, '#ffc8c8') }
function dkEyes(F) {
  const prog = clamp((940 - F.y) / 640, 0, 1), n = Math.floor(8 + prog * 34);
  F.st.eyes.forEach((e, i) => { if (i >= n || F.st.bright) return; const d = Math.hypot(e.x - F.x, e.y - F.y); if (d > 300) return;
    const a = clamp((300 - d) / 80, 0, 1) * (F.st.eyesOut ? Math.max(0, 1 - F.st.eyesOut / 40) : 1), bl = ((F.t + e.ph) % e.p) < 7 || F.st.allBlink && (F.t % 90) < 6;
    const lx = clamp((F.x - e.x) / 60, -1.6, 1.6), ly = clamp((F.y - 16 - e.y) / 60, -1, 1); X.globalAlpha = a;
    const glow = X.createRadialGradient(e.x, e.y, 1, e.x, e.y, 22 * e.s); glow.addColorStop(0, 'rgba(255,0,0,.18)'); glow.addColorStop(1, 'rgba(255,0,0,0)'); X.fillStyle = glow; X.fillRect(e.x - 24 * e.s, e.y - 24 * e.s, 48 * e.s, 48 * e.s);
    const half = ((F.t + e.ph) % e.p) >= 7 && ((F.t + e.ph) % e.p) < 10; const k2 = e.s > 1.05 ? 2 : 1; X.save(); X.translate(Math.round(e.x), Math.round(e.y)); X.scale(k2, k2); for (const dx of [-1, 1]) pixEye(dx * 5 - 3, -3, bl ? 2 : half ? 1 : 0, Math.round(lx * .7), ly > .4 ? 1 : 0); X.restore();
    X.globalAlpha = 1 });
}
const FEARDEF = {};
// a pixel ripple ring on the black water: lit on the far side, shadowed on the near side, dimmer as it spreads
function pixRing(cx, cy, rx, ry, a = 1) { cx = Math.round(cx); cy = Math.round(cy); rx = Math.round(rx); ry = Math.max(1, Math.round(ry)); const seen = {};
  const L = Math.round(40 + 86 * a), D_ = Math.round(18 + 30 * a); if (a <= .05) return;
  for (let i = 0; i < 72; i++) { const t = i / 72 * 6.283, x = cx + Math.round(Math.cos(t) * rx), y = cy + Math.round(Math.sin(t) * ry), k = x + ',' + y; if (seen[k]) continue; seen[k] = 1;
    const g = y < cy ? L : y == cy ? Math.round((L + D_) / 2) : D_; X.fillStyle = 'rgb(' + g + ',' + g + ',' + (g + 6) + ')'; X.fillRect(x, y, 1, 1) } }
function pixBub(x, y, age) { x = Math.round(x); y = Math.round(y); const g = Math.round(110 - age * 70); X.fillStyle = 'rgb(' + (g >> 1) + ',' + (g >> 1) + ',' + ((g >> 1) + 6) + ')'; X.fillRect(x - 1, y, 3, 1); X.fillRect(x, y - 1, 1, 3); X.fillStyle = 'rgb(' + g + ',' + g + ',' + (g + 8) + ')'; X.fillRect(x - 1, y - 1, 1, 1) }
FEARDEF.dark = { W: DK.W, H: DK.H, start: [400, 930], dir: 3, mus: 'rukia2', camOff: 270,
  init(F) {
    F.st.bg = dkRender(false); F.st.eyes = []; fsd = 21;
    for (let k = 0; k < 120 && F.st.eyes.length < 44; k++) { const i = 1 + (frn() * (DK.path.length - 1) | 0), [ax, ay] = DK.path[i - 1], [bx, by] = DK.path[i], q = frn(), side = frn() < .5 ? -1 : 1, off = 50 + frn() * 70;
      const x = ax + (bx - ax) * q + side * off, y = ay + (by - ay) * q - frn() * 20; if (!dkWalk(F, x, y)) F.st.eyes.push({ x, y, ph: frn() * 300 | 0, p: 160 + (frn() * 200 | 0), s: .8 + frn() * .5 }) }
    for (let k = 0; k < 14; k++) { const a = Math.PI + frn() * Math.PI, x = 400 + Math.cos(a) * (270 + frn() * 40), y = 238 + Math.sin(a) * (120 + frn() * 30); F.st.eyes.push({ x, y, ph: frn() * 300 | 0, p: 140 + (frn() * 160 | 0), s: 1 + frn() * .4 }) }
    F.st.eyes.sort((a, b) => b.y - a.y);
    F.st.fall = 1; F.lock = 1; F.fade = 0; F.holdFade = 1;
  },
  speed: F => F.st.bright ? 1.5 : 1.15,
  walk: (F, x, y) => dkWalk(F, x, y),
  update(F) {
    if (!F.st.treeOk && ready(FTREE_N) && ready(FTREE_B)) { F.st.treeOk = 1; F.st.bg = dkRender(!!F.st.bright) }
    if (F.st.fall) { if (++F.st.fall > 300) { F.st.fall = 0; F.st.lying = 90; shake = 16; beep(60, .4, 1, 'sine'); F.fade = 1; F.holdFade = 0 } return }
    if (F.st.lying) { if (--F.st.lying == 0) D(['|You land on something soft. Paper. Hundreds and hundreds of photographs.', 'Hitori:scared|...Polaroids.', '|In every one of them, somebody has scribbled over the faces. Hard enough to tear the paper.', 'Hitori:worried|It\'s so dark down here.', 'Hitori:neutral|...Uku? Are you down here?'], () => { F.lock = 0 }); return }
    trigOnce(F, 'watch', F.y < 760, () => D(['Hitori:scared|~...Something\'s watching me.']));
    trigOnce(F, 'many', F.y < 560, () => { F.st.allBlink = 1; D(['|Eyes. In every tree. They blink all at once, like they practised.', 'Hitori:scared|Don\'t look at them. Don\'t look. Keep walking.']) });
    trigOnce(F, 'tree', F.y < 334 && !F.st.bright, () => { F.lock = 1; F.dir = 3;
      D(['|The hollow tree. Our tree. The one by the pond, where we always sat.', '|Something hangs from the lowest branch. It sways, though there is no wind.', 'Hitori:shock|...', 'Hitori:scared|No. No no no. That wasn\'t there. That was never there.', 'Hitori:scared|(I can\'t breathe. They\'re all looking at me. All of them.)', 'Hitori:neutral|...Just a little light. That\'s all I need.', '|Hold your light on the watching eyes until they look away.'],
        () => mini('dark', () => { sc = 'fear'; F.white = 1.4; F.st.bright = 1; F.st.bg = dkRender(true); F.st.eyesOut = 1; beep(880, .4, 1, 'sine'); fearAfter(70, () => D(['|The forest goes bright. All at once, like somebody opened a curtain.', 'Hitori:shock|...', 'Hitori:happy|It\'s just the tree. It\'s just our tree.', '|There\'s nothing on the branch. There never was.', 'Hitori:neutral|...There\'s light coming from up there. I can climb out.'], () => { F.lock = 0 })) })) });
    if (F.st.eyesOut) F.st.eyesOut++;
    if (F.white > 0) F.white -= .02;
    trigOnce(F, 'out', F.st.bright && F.y < 70, () => { F.lock = 1; F.white = .01; const up = () => { F.white += .03; if (F.white < 1.2) fearAfter(1, up); else endFear(() => darkDone()) }; up() });
  },
  draw(F) {
    if (F.st.fall) return;
    X.drawImage(F.st.bg, 0, 0); dkNoose(F); dkEyes(F);
    if (F.st.lying) { X.save(); X.translate(F.x, F.y - 4); X.rotate(Math.PI / 2); X.filter = 'grayscale(1) brightness(1.12)'; drawChar(CH[PL], 0, 10, 0, 0, 1); X.filter = 'none'; X.restore() }
    else drawHitori(F, F.x, F.y, F.dir, hFrame(F), !F.st.bright);
  },
  overlay(F) {
    sW();
    if (F.st.fall) {   // falling: upside down, photographs flying up past her
      const t = F.st.fall; X.fillStyle = '#000'; X.fillRect(0, 0, 640, 360);
      for (let i = 0; i < 40; i++) { const x = (i * 97) % 640, y = (360 - ((t * (6 + i % 5) + i * 53) % 420)) + 30; X.fillStyle = 'rgba(255,255,255,' + (.15 + (i % 3) * .1) + ')'; X.fillRect(x, y, 1, 18 + (i % 4) * 8) }
      for (let i = 0; i < 9; i++) { const x = 60 + (i * 71) % 520, y = 400 - ((t * 3.4 + i * 90) % 480); X.save(); X.translate(x, y); X.rotate(t / 20 + i); X.fillStyle = '#ddd'; X.fillRect(-9, -11, 18, 22); X.fillStyle = '#333'; X.fillRect(-7, -9, 14, 14); X.restore() }
      X.save(); X.translate(320 + Math.sin(t / 25) * 10, 170); X.rotate(Math.PI + Math.sin(t / 30) * .15); X.filter = 'grayscale(1) brightness(1.15)'; drawChar(CH[PL], 0, 16, 0, 0, 1.4); X.filter = 'none'; X.restore();
      if (t > 60 && t < 260) txt(t < 140 ? '...' : t < 220 ? 'Down.' : 'Down.  Down.', W / 2, 150, '#888', 'center', 7);
      return }
    if (!F.st.bright) vignette(F, 60, 230, .92); else vignette(F, 160, 380, .25, '255,250,230');
  }
};
function darkDone() {
  S.fear.dark = 1; flag('tired1'); flag('dark_done');
  enter('w_well', null, [20, 17]); S.dir = 0;
  D(['Steven:scared|HITORI! You were down there for ages!', 'Caroline:worried|We heard you yelling. We were about to climb in after you.', 'Hitori:neutral|...I\'m okay. It was dark. Really dark.', 'Hitori:neutral|He isn\'t down there. But I could feel the wind, coming from the log. That\'s where he went.', 'Caroline:happy|Then we all go. Together this time.', 'Steven:sad|...Can we at least hold hands.']);
}
// the well is the way down now; the log waits until you've been
EV.welljump = () => {
  if (!F_('uku_gone')) return D(['|The old well. It is humming faintly.', 'Hitori:neutral|It always hums at dusk.']);
  if (S.fear.dark) return D(['|The well hums. There\'s nothing down there now. Just photographs.']);
  D(['|The well is black all the way down. Far below, something rustles like paper.', 'Hitori:neutral|...I\'m going down.', 'Steven:shock|WHAT? Hitori, no!', 'Caroline:worried|We\'ll come with you!', 'Hitori:neutral|No. Somebody has to stay up here. If I\'m not back... don\'t come in after me.', 'Hitori:scared|...Okay. Okay. One, two...'],
    () => startFear('dark'));
};
const _darkfear23 = EV.darkfear;
EV.darkfear = () => { if (F_('uku_gone') && !S.fear.dark) return D(['|The log is pitch black inside. A cold wind breathes out of it.', 'Hitori:neutral|...Not yet. The well first.']); _darkfear23() };
(() => {
  const Wl = AREAS.w_well; Wl.ents = Wl.ents.map(e => e.kind == 'well' ? { ...e, say: [], ev: 'welljump' } : e); delete MP.w_well;
  // the well, not the log, is where he went
  const _enter = enter; enter = function (id, from, xy) { const r_ = _enter(id, from, xy); if (S && S.day == 1 && S.a == 'w_tunnel' && S.fl.uku_gone) S.fl.rukia = 1; return r_ };
})();

// ================================================================ 2. SPIDERS: a white-on-black path that crawls
const SP = { W: 1700, H: 360, y0: 168, y1: 252 };
function spRender() {
  const c = fcv(SP.W, SP.H), g = c.getContext('2d'); fsd = 9; g.fillStyle = '#000'; g.fillRect(0, 0, SP.W, SP.H);
  // jagged white branches hanging in the dark, each ending in a drip
  for (let k = 0; k < 34; k++) {
    const x = 60 + k * 48 + frn() * 30, top = frn() < .5, y = top ? 10 + frn() * 110 : 270 + frn() * 70, pts = [[x, y]], n = 2 + (frn() * 2 | 0); let px = x, py = y;
    for (let i = 0; i < n; i++) { px += (frn() - .5) * 40; py += (top ? 1 : -1) * (14 + frn() * 22) * (i % 2 ? 1 : .6); pts.push([px, py]) }
    wobLine(g, pts, 5, '#3a3a3a'); wobLine(g, pts, 2.4, '#e4e4e4'); const [ex, ey] = pts[pts.length - 1]; g.fillStyle = '#2a2a2a'; g.beginPath(); g.ellipse(ex, ey + (top ? 6 : -6), 3, 7, 0, 0, 7); g.fill(); g.fillStyle = '#9a9a9a'; g.fillRect(ex - 1, ey + (top ? 1 : -9), 2, 6) }
  for (let k = 0; k < 6; k++) { const x = 200 + k * 260 + frn() * 80, y = 30 + frn() * 60; g.fillStyle = '#5a5a5a'; g.fillRect(x, y, 70, 8); g.fillStyle = '#b8b8b8'; g.fillRect(x + 2, y + 1, 66, 4) }
  // webs strung across the void
  g.strokeStyle = 'rgba(220,220,220,.18)'; g.lineWidth = 1; for (let k = 0; k < 40; k++) { const x = frn() * SP.W, y = frn() * SP.H; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (frn() - .5) * 200, y + (frn() - .5) * 120); g.stroke() }
  for (let k = 0; k < 7; k++) { const cx = 150 + k * 230, cy = frn() < .5 ? 60 : 300; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 44, cy + Math.sin(a) * 34); g.stroke() } for (let r_ = 10; r_ < 44; r_ += 9) { g.beginPath(); g.ellipse(cx, cy, r_, r_ * .77, 0, 0, 7); g.stroke() } }
  // the path: faint grey speckle
  for (let k = 0; k < 500; k++) { g.fillStyle = 'rgba(160,160,160,' + (.08 + frn() * .1) + ')'; g.fillRect(frn() * SP.W, SP.y0 + frn() * (SP.y1 - SP.y0), 2, 1) }
  // the way out at the far end
  const gr = g.createLinearGradient(SP.W - 80, 0, SP.W, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.9)'); g.fillStyle = gr; g.fillRect(SP.W - 80, SP.y0 - 30, 80, SP.y1 - SP.y0 + 60);
  return c;
}
const FRIB = loadImg('assets/fear/ribcage.png');
function bigSpider(F) {   // the ribcage that waits at the end of the path (from the reference picture); it breathes, slowly
  if (!ready(FRIB)) return; const st = F.st, up = st.calm ? Math.min(1, st.calm / 160) : 0, a = 1 - up; if (a <= 0) return;
  const w = FRIB.naturalWidth, h = FRIB.naturalHeight, br = ((F.t / 50) | 0) % 2, x = 1420 - (w >> 1), y = SP.y0 + 34 - h - br - Math.round(up * 40);
  X.globalAlpha = a; X.imageSmoothingEnabled = false; X.drawImage(FRIB, x, y, w, h + br); X.globalAlpha = 1 }
FEARDEF.spider = { W: SP.W, H: SP.H, start: [80, 214], dir: 2, mus: 's2',
  init(F) { F.st.bg = spRender(); F.st.crawl = []; fsd = 5; for (let k = 0; k < 90; k++) F.st.crawl.push({ x: frn() * SP.W, y: 20 + frn() * 320, a: frn() * 6.28, v: .3 + frn() * .6 }); F.st.on = 0; F.st.cover = [];
    D(['|The web gives way. You fall through, into a dark that is all lines and no floor.', 'Hitori:scared|...Where am I?', 'Hitori:neutral|There\'s a path. A white one. I just have to follow it.']) },
  speed: F => Math.max(.45, 1.3 - F.st.on * .022),
  walk: (F, x, y) => y > SP.y0 && y < SP.y1 && x > 30 && x < SP.W - 10,
  update(F) {
    const st = F.st;
    if (!st.calm) st.on = Math.max(st.on, Math.floor(clamp((F.x - 160) / 1080, 0, 1) * 40));
    else st.on = Math.max(0, st.on - .12);
    st.crawl.forEach(s => { const near = !st.calm && Math.abs(s.x - F.x) < 160 && F.x > 300, tx = near ? F.x : s.x + Math.cos(s.a) * 10, ty = near ? F.y - 10 : s.y + Math.sin(s.a) * 10; s.a += (Math.random() - .5) * .3;
      const d = Math.hypot(tx - s.x, ty - s.y) || 1, v = st.calm ? 2.4 : s.v; if (st.calm) { s.x += (s.x - F.x) / (Math.abs(s.x - F.x) + 1) * v; s.y += (s.y - F.y) / (Math.abs(s.y - F.y) + 1) * v } else { s.x += (tx - s.x) / d * v; s.y += (ty - s.y) / d * v } });
    trigOnce(F, 's1', st.on >= 5, () => D(['Hitori:worried|Something\'s on my sleeve.', 'Hitori:worried|...It\'s fine. It\'s just one.']));
    trigOnce(F, 's2', st.on >= 16, () => D(['Hitori:scared|They\'re on me. They\'re ON me.', 'Hitori:scared|Keep walking. Keep walking keep walking keep walking—']));
    trigOnce(F, 's3', st.on >= 30, () => D(['Hitori:scared|I can\'t— I can\'t see— they\'re in my hair—']));
    trigOnce(F, 'over', F.x > 1250 && !st.calm, () => { F.lock = 1; st.overT = 1 });
    if (st.overT && !st.calm) { st.overT++; if (st.overT % 2 == 0 && st.cover.length < 220) st.cover.push({ x: Math.random() * 640, y: Math.random() * 360, a: Math.random() * 6 });
      if (st.overT == 130) D(['Hitori:scared|GET OFF. GET OFF GET OFF GET OFF—', '|There are too many. You can\'t move your arms.', 'Hitori:neutral|(...Breathe. Breathe. One at a time. They\'re smaller than me.)', '|Knock them off one at a time: press each spider\'s arrow as it reaches the ring.'],
        () => mini('spider', () => { sc = 'fear'; st.calm = 1; st.cover = []; F.white = .5; fearAfter(150, () => D(['|The spiders let go. One by one, they climb down and scuttle back into the dark.', 'Hitori:neutral|...Breathe in. Breathe out.', 'Hitori:neutral|They\'re just spiders. They were always just spiders.', '|The big one is gone. The path goes on, toward a white light.'], () => { F.lock = 0 })) })) }
    if (st.calm) st.calm++;
    if (F.white > 0) F.white -= .02;
    trigOnce(F, 'exit', F.x > SP.W - 40, () => { F.lock = 1; const up = () => { F.white += .03; if (F.white < 1.2) fearAfter(1, up); else endFear(spiderDone) }; up() });
  },
  draw(F) {
    const st = F.st; X.drawImage(st.bg, 0, 0); bigSpider(F);
    st.crawl.forEach(s => { const vx = s.x - (s.px ?? s.x), vy = s.y - (s.py ?? s.y); if (Math.abs(vx) + Math.abs(vy) > .05) s.rot = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 3 : 1) : (vy > 0 ? 0 : 2); s.px = s.x; s.py = s.y; bwSpider(s.x, s.y, 1, F.t + s.x * 3, 1, s.rot || 0) });
    drawHitori(F, F.x, F.y, F.dir, hFrame(F));
    const n = Math.min(26, Math.floor(st.on)); for (let i = 0; i < n; i++) {   // they cling round her outline first, then fill in
      const ring = i < 14, ang = i * 2.39996 + F.t * .004 * (i % 2 ? 1 : -1), rx = ring ? 9 : 4, ry = ring ? 13 : 7, ox = Math.round(Math.cos(ang) * rx + Math.sin(F.t / (9 + i % 4) + i) * 1.2), oy = Math.round(-15 + Math.sin(ang) * ry);
      bwSpider(F.x + ox, F.y + oy, .7, F.t + i * 5) }
  },
  overlay(F) {
    const st = F.st, n = st.on; sW();
    if (n > 10) { X.strokeStyle = 'rgba(0,0,0,.9)'; for (let i = 0; i < Math.min(30, n); i++) { const side = i % 4, k = (i * 53) % 360, rr = (n - 10) * 2.2 + Math.sin(F.t / 8 + i) * 6; X.lineWidth = 5; X.beginPath();
      if (side == 0) { X.moveTo(0, k); X.lineTo(rr, k + 12); X.lineTo(rr + 14, k + 30) } else if (side == 1) { X.moveTo(640, k); X.lineTo(640 - rr, k - 10); X.lineTo(640 - rr - 14, k + 14) } else if (side == 2) { X.moveTo(k * 1.7, 0); X.lineTo(k * 1.7 + 10, rr); X.lineTo(k * 1.7 + 24, rr + 12) } else { X.moveTo(k * 1.7, 360); X.lineTo(k * 1.7 - 10, 360 - rr); X.lineTo(k * 1.7 + 6, 360 - rr - 14) } X.stroke() } }
    vignette(F, 80 - Math.min(40, n), 300 - n * 3, .85);
    st.cover.forEach(c => bwSpider(c.x + Math.round(Math.sin(F.t / 6 + c.a) * 2), c.y + Math.round(Math.cos(F.t / 7 + c.a) * 2), 2, F.t + c.a * 10, 1, (c.a * 4 | 0) % 4));
  }
};
function spiderDone() {
  S.fear.spider = 1; flag('tired2'); E = E.filter(e => e.kind != 'web');
  D(['Hitori:neutral|...That wasn\'t so bad. They were just spiders.', 'Steven:shock|Hitori! You went through the web and just... disappeared!', 'Caroline:happy|The path is open! I can smell the sea!', 'Steven:sad|It\'s dark already. How is it dark already?', 'Hitori:neutral|There was a cabin on the old map. On the cliff. We\'ll sleep there.']);
}
EV.spiderfear = () => {
  if (!F_('d2_throne')) return D(['|Thick webs. Something skitters in them.', 'Caroline:worried|Let\'s not go that way. Not yet.']);
  if (S.fear.spider) return;
  D(['Hitori:scared|The webs. They go all the way up.', 'Steven:scared|I\'m not touching those.', 'Hitori:neutral|...Me neither. But there\'s no other way.', '|Hitori reaches into the web. It pulls.'], () => startFear('spider'));
};

// ================================================================ 3. WATER: the pencil shore from the reference picture, where the black water rises
FEARDEF.water = { W: 1000, H: 730, start: [178, 505], dir: 2, mus: 'decay',
  init(F) { F.st.uku = 1; F.st.bub = []; F.st.rip = [];
    D(['|You let go of the pier.', '|...You land in black water, only ankle-deep. A forest, drawn in pencil. A stone hut. A bench.', 'Hitori:worried|...This isn\'t the sea. Where am I?']) },
  depth: F => clamp((F.x - 230) / 640, 0, 1),
  speed: F => 1.25 - FEARDEF.water.depth(F) * .8,
  walk: (F, x, y) => y > 452 && y < 566 && x > 140 && x < 975 && !(x > 402 && x < 504 && y > 470 && y < 518),
  update(F) {
    const st = F.st, d = this.depth(F);
    if (st.uku && F.x > 372) { st.uku = 0; st.ukuFade = 40; D(['Hitori:shock|Uku?!', '|The bench is empty. The wood is soaking wet, as if somebody just climbed up out of the water.']) }
    if (st.ukuFade) st.ukuFade--;
    trigOnce(F, 'w1', d > .22, () => D(['Hitori:worried|...It\'s getting deeper.', '|The black water is at your knees. It\'s warm, like bathwater left too long.']));
    trigOnce(F, 'w2', d > .5, () => D(['Hitori:scared|It\'s up to my waist. It keeps coming.', 'Hitori:scared|Keep going. There has to be an end. There has to be.']));
    trigOnce(F, 'w3', d > .8, () => D(['Hitori:scared|It\'s at my chin— I can\'t— I have to keep—']));
    if (F.moving && d > .03 && F.t % 18 == 0) st.rip.push({ x: Math.round(F.x), y: Math.round(F.y), t: 0 }); st.rip.forEach(r_ => r_.t++); st.rip = st.rip.filter(r_ => r_.t < 48);
    if (d > .72 && F.t % 9 == 0) st.bub.push({ x: F.x + (Math.random() - .5) * 6, y: F.y - 2, t: 0 }); st.bub.forEach(b => { b.t++; b.y -= .5; b.x += Math.sin(b.t / 5) * .3 }); st.bub = st.bub.filter(b => b.t < 40);
    trigOnce(F, 'drown', d >= 1, () => { F.lock = 1; st.drown = 1 });
    if (st.drown && !st.up) { st.drown++; if (st.drown == 140) D(['Hitori:scared|(It\'s in my mouth. I can\'t— I can\'t breathe—)', '|The water closes over your head. Everything goes quiet.', 'Hitori:neutral|(...Focus. Don\'t panic. Which way is up?)', '|Swim UP: steer with LEFT / RIGHT, grab the air, dodge the jellyfish.'],
      () => mini('waterup', () => { sc = 'fear'; st.up = 1; F.white = 1.4; fearAfter(60, () => D(['|You break the surface. Air. Real air, cold and loud.', 'Hitori:happy|Hah— hah! I can breathe!'], () => endFear(waterDone))) })) }
    if (F.white > 0) F.white -= .02;
  },
  draw(F) {
    const st = F.st, d = this.depth(F); if (ready(FSHORE)) { X.imageSmoothingEnabled = false; X.drawImage(FSHORE, 0, 0) }
    if (st.uku || st.ukuFade) { X.globalAlpha = st.uku ? 1 : st.ukuFade / 40; drawChar(CH[3], 455, 497, 0, 0, 1); X.globalAlpha = 1 }
    if (st.up) return;
    // she sinks into the picture's own black water: everything below the waterline is hidden
    const sink = Math.round(d * 17 + (st.drown ? Math.min(22, st.drown / 6) : 0)), wl = Math.round(F.y) - 1;
    X.save(); X.beginPath(); X.rect(F.x - 40, wl - 80, 80, 80); X.clip(); drawHitori(F, F.x, F.y + sink, F.dir, hFrame(F)); X.restore();
    if (d > .03 && sink < 38) { const w = 9 + (((F.t >> 4) & 1)), ph = F.moving ? (F.t >> 2) & 1 : 0; pixRing(F.x, wl + 1, w + ph, 2, 1) }
    st.rip.forEach(r_ => pixRing(r_.x, r_.y, 6 + r_.t / 4, 1.5 + r_.t / 14, 1 - r_.t / 48));
    st.bub.forEach(b => pixBub(b.x, b.y, b.t / 40));
  },
  overlay(F) {
    const st = F.st, d = this.depth(F); sW(); vignette(F, 140 - d * 60, 380 - d * 160, .35 + d * .45);
    if (st.drown) { const a = Math.min(1, st.drown / 120); X.fillStyle = 'rgba(0,0,0,' + (a * .92) + ')'; X.fillRect(0, 0, 640, 360); for (let i = 0; i < 20; i++) { X.strokeStyle = 'rgba(230,230,230,' + (.3 * a) + ')'; X.beginPath(); X.arc((i * 89) % 640, 360 - ((st.drown * 2 + i * 41) % 400), 2 + i % 3, 0, 7); X.stroke() } }
  }
};
function waterDone() { S.fear.water = 1; flag('tired3'); D(['Steven:shock|You went down there and came back!', 'Hitori:neutral|The pipe goes somewhere. A long way. Hold your breath, everyone.', '|Together you swim into the pipe. Pink light at the far end.'], () => go('n_drain', 'b_pier')) }
EV.pierdive = () => {
  if (S.day < 3) return D(['|It is far too dark to see the water.', 'Hitori:neutral|...Tomorrow.']);
  if (!F_('d3_pier')) { flag('d3_pier'); return D(['|The pier ends. Below, the water goes black. Far down, a round pipe mouth is glowing.', 'Steven:sad|Okay, no. Absolutely not.', 'Caroline:worried|Is that a tunnel? Under there?', 'Hitori:scared|...I think that\'s where he went.', 'Hitori:neutral|I\'m going to have to go down there.']) }
  if (S.fear.water) return;
  D(['Hitori:scared|It\'s so deep.', 'Hitori:neutral|...Hold your breath. Go down. Don\'t stop.', '|Hitori climbs over the edge of the pier and lets go.'], () => startFear('water'));
};

// ---------------------------------------------------------------- the swim, upward this time (for the water fear)
const _miniUpd23 = miniUpdate, _miniDraw23 = miniDraw;
miniUpdate = function () {
  const m = MG; if (!m || m.k != 'waterup') return _miniUpd23();
  m.t++; if (m.done) { if (m.t > 70) { const cb = m.cb; MG = null; sc = 'world'; cb() } return }
  m.x = clamp(m.x + ((keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0)) * 2.2, 20, W - 20); m.depth += .0014; m.air -= .0013;
  if (m.t % 26 == 0) m.ob.push({ x: 20 + Math.random() * 280, y: -10, k: Math.random() < .42 ? 'air' : 'jelly' }); m.ob.forEach(o => { o.y += 1.3 + (o.k == 'jelly' ? .3 : 0); o.x += Math.sin(m.t / 20 + o.y / 20) * .4 });
  for (const o of m.ob) if (Math.abs(o.x - m.x) < 11 && Math.abs(o.y - 104) < 12) { if (o.k == 'air') { m.air = Math.min(1, m.air + .22); beep(900, .06) } else { m.air -= .18; shake = 6; beep(120, .2, 1, 'sawtooth'); m.depth = Math.max(0, m.depth - .03) } o.y = 999 }
  m.ob = m.ob.filter(o => o.y < H + 20); if (m.air <= 0) { m.air = .5; m.depth = Math.max(0, m.depth - .12); m.worry = 60 } if (m.worry) m.worry--; m.p = m.depth; if (m.depth >= 1) miniWin();
};
miniDraw = function () {
  const m = MG; if (!m || m.k != 'waterup') return _miniDraw23();
  sU(); const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(' + (60 + m.depth * 120) + ',' + (80 + m.depth * 120) + ',' + (110 + m.depth * 110) + ',1)'); g.addColorStop(1, '#02060e'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  for (let i = 0; i < 18; i++) r((i * 47 + m.t * .3) % W, (i * 31 + m.t * .6) % H, 1, 2, 'rgba(255,255,255,.2)');
  for (let i = 0; i < 5; i++) r(40 + i * 60 + Math.sin(m.t / 30 + i) * 8, 0, 14, 60 + m.depth * 60, 'rgba(255,255,255,' + (.03 + m.depth * .05) + ')');
  txt('Swim UP: LEFT / RIGHT. Grab air, dodge jellyfish', W / 2, 4, '#e8eef8', 'center', 6);
  m.ob.forEach(o => { if (o.k == 'air') { ell(o.x, o.y, 5, 5, 'rgba(200,240,255,.35)'); ell(o.x, o.y, 4, 4, 'rgba(160,220,255,.55)'); r(o.x - 2, o.y - 3, 2, 1, '#fff') } else { ell(o.x, o.y - 3, 7, 6, '#b8b8c8'); ell(o.x, o.y - 5, 5, 3, '#e8e8f0'); for (let i = 0; i < 4; i++) r(o.x - 5 + i * 3, o.y - 12 - Math.sin(m.t / 6 + i) * 2, 1, 8, '#8a8a9a') } });
  sW(); X.filter = 'grayscale(1) brightness(1.15)'; X.save(); X.translate(m.x * 2, 104 * 2); drawChar(CH[PL], 0, 16, 3, (m.t >> 3) % 4 + 1, 1); X.restore(); X.filter = 'none'; sU();
  r(8, 20, 6, 120, '#000'); r(9, 21 + 118 * (1 - clamp(m.air, 0, 1)), 4, 118 * clamp(m.air, 0, 1), m.air < .3 ? '#f55' : '#cfe8ff'); txt('AIR', 11, 142, '#e8eef8', 'center', 5);
  r(W - 14, 20, 6, 120, '#000'); r(W - 13, 21 + 118 * (1 - m.depth), 4, 118 * m.depth, '#fff'); txt('UP', W - 11, 142, '#e8eef8', 'center', 5);
  if (m.worry) txt('Focus...', W / 2, 60, '#fff', 'center', 7);
  if (m.done) { r(0, 0, W, H, 'rgba(255,255,255,' + Math.max(0, .5 - m.t / 70) + ')'); txt('...!', W / 2, 80, '#fff', 'center', 14) }
};
// for tests: finish a fear scene straight away
window.fearFinish = id => { const F = FS; FS = null; sc = 'world'; MG = null; DL = null; ({ dark: darkDone, spider: spiderDone, water: waterDone })[id || (F && F.id)]() };
