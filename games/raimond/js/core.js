// ==================== CORE: canvas, input, helpers, audio ====================
const W = 320, H = 180, VW = 640, VH = 360, T = 16;
let U = 4;
const C = document.getElementById('c'), X = C.getContext('2d');
function resize() {
  const d = window.devicePixelRatio || 1, m = Math.min(innerWidth * d / W, innerHeight * d / H);
  U = Math.max(2, 2 * Math.floor(m / 2));
  C.width = W * U; C.height = H * U;
  C.style.width = C.width / d + 'px'; C.style.height = C.height / d + 'px';
  X.imageSmoothingEnabled = false;
}
addEventListener('resize', resize); resize();
const sU = () => X.setTransform(U, 0, 0, U, 0, 0);
const sW = () => X.setTransform(U / 2, 0, 0, U / 2, 0, 0);

const ST = {
  get(k) { try { return localStorage.getItem(k) } catch (e) { return null } },
  set(k, v) {
    try { localStorage.setItem(k, v) } catch (e) {}
    try { document.cookie = k.replace(/\W/g, '_') + '=1;max-age=31536000;path=/' } catch (e) {}
  }
};
const keys = {}, hit = {};
let opt = { m: 5, s: 7 };
addEventListener('keydown', e => {
  if (!keys[e.code]) hit[e.code] = 1;
  keys[e.code] = 1;
  if (/Space|Arrow/.test(e.code)) e.preventDefault();
  if (e.code == 'KeyF') fs();
  initA();
});
addEventListener('keyup', e => keys[e.code] = 0);
const ok = () => hit.Space || hit.Enter || hit.KeyZ, up = () => hit.ArrowUp || hit.KeyW, dn = () => hit.ArrowDown || hit.KeyS,
  lf = () => hit.ArrowLeft || hit.KeyA, rt = () => hit.ArrowRight || hit.KeyD, esc = () => hit.Escape;
function fs() { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen() } catch (e) {} }

// audio (tiny synth)
let AC;
function initA() { if (!AC) try { AC = new (window.AudioContext || window.webkitAudioContext)() } catch (e) {} }
function beep(f, d = .08, v = 1, t = 'square') {
  if (!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = t; o.frequency.value = f; g.gain.value = .05 * opt.s / 10 * v;
  g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d);
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d);
}
const r = (x, y, w, h, c, G = X) => { G.fillStyle = c; const a = Math.round(x), b = Math.round(y); G.fillRect(a, b, Math.round(x + w) - a, Math.round(y + h) - b) };
function ell(cx, cy, rx, ry, c, G = X) {
  G.fillStyle = c; rx = Math.max(.5, rx); ry = Math.max(.5, ry);
  for (let j = -Math.round(ry); j <= Math.round(ry); j++) {
    const q = 1 - (j * j) / (ry * ry); if (q < 0) continue;
    const w = Math.round(rx * Math.sqrt(q)); G.fillRect(Math.round(cx) - w, Math.round(cy) + j, w * 2, 1);
  }
}
function sh(h, f) {   // lighten/darken a #rrggbb colour
  const n = parseInt(h.slice(1), 16), c = i => Math.max(0, Math.min(255, Math.round(((n >> i) & 255) * f)));
  return '#' + [16, 8, 0].map(i => c(i).toString(16).padStart(2, '0')).join('');
}
const FONT = '"Synchronicity Hand", "Comic Neue", cursive';
const CRAZYF = '"Synchronicity Crazy", ' + FONT;   // the shaky font, for the lines where Hitori is coming apart
let TXTF = null;   // when set, txt() and tw() use this font instead
function txt(s, x, y, c = '#fff', al = 'left', sz = 8) {   // UI-layer text: rendered at native resolution, never scaled
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
  X.font = Math.round(sz * U) + 'px ' + (TXTF || FONT); X.textAlign = al; X.textBaseline = 'top'; X.fillStyle = c;
  X.fillText(s, Math.round(x * U), Math.round(y * U)); X.restore();
}
const tw = (s, sz = 8) => { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.font = Math.round(sz * U) + 'px ' + (TXTF || FONT); const w = X.measureText(s).width / U; X.restore(); return w };
function wrap(s, n) { const o = []; let l = ''; for (const w of s.split(' ')) { if ((l + w).length > n) { o.push(l); l = '' } l += w + ' ' } o.push(l); return o }
const rng = s => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
const hsh = (x, y, k = 0) => ((x * 73856093 ^ y * 19349663 ^ k * 83492791) >>> 0) % 1000 / 1000;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---- music: real tracks, cross-faded; started after the first key press (browser autoplay rule)
const TRACKS = { menu: 'eternal_rest', forest: 'green_aero_neon', dark: 'eight', beach: 'inabakumori', scary: 'morbid_curiosity', inboredom: 'inboredom' };
const MUS = {}; let musCur = null;
function trackAudio(k) { if (!MUS[k]) { const a = new Audio('assets/music/' + TRACKS[k] + '.mp3'); a.loop = true; a.volume = 0; MUS[k] = a } return MUS[k] }
function music(k) { if (k === musCur) return; musCur = k }
setInterval(() => {   // fade the wanted track in and everything else out
  const vol = opt.m / 10 * .7;
  for (const k in TRACKS) {
    const a = trackAudio(k), want = k === musCur ? vol : 0;
    if (want > 0 && a.paused && AC) a.play().catch(() => {});
    a.volume = clamp(a.volume + clamp(want - a.volume, -.04, .04), 0, 1);
    if (want == 0 && a.volume < .01 && !a.paused) a.pause();
  }
}, 60);
// ---- sound effects (synthesised)
function noiseBurst(dur = .2, freq = 1800, q = 1, vol = .5, delay = 0) {
  if (!AC) return; const n = AC.sampleRate * dur | 0, buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2);
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol * opt.s / 10;
  s.connect(f); f.connect(g); g.connect(AC.destination); s.start(AC.currentTime + delay);
}
function bookOpen() { noiseBurst(.28, 900, .7, .55); noiseBurst(.14, 2600, 1.2, .35, .16); noiseBurst(.1, 400, .8, .5, .3); beep(95, .16, 1.2, 'sine') }   // cover thud + pages fanning
function pageTurn() { noiseBurst(.18, 2200, .9, .4); noiseBurst(.1, 3400, 1.2, .25, .1) }
function jumpscareSound() { noiseBurst(.7, 700, .4, 1); beep(60, .6, 3, 'sawtooth'); beep(95, .6, 3, 'square'); beep(1400, .5, 1.5, 'sawtooth') }
function heartbeat() { beep(55, .12, 2.5, 'sine'); setTimeout(() => beep(48, .14, 2, 'sine'), 170) }
