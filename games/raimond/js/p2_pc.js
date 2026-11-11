// ==================== PART TWO: Hitori's computer (Windows 11) ====================
// Drawn into its own 640x360 canvas and blown up with hard pixels, so it looks like an old low-resolution screen.
// Lock screen, sign-in with a username and a password (the hint points at the cat on the fridge), the desktop,
// the Start menu, and apps you can open: Edge with YouTube, File Explorer, Notepad, Photos, Settings, a working
// Calculator, Paint you can draw in, Clock, Calendar, Outlook, the Store, Word, Excel, PowerPoint, Media Player, Xbox.
// Most of them can't do much without the internet. The real mouse moves the pointer.
const PCF = '"Segoe UI Variable Text", "Segoe UI", "Noto Sans", "DejaVu Sans", Arial, sans-serif';
const PC_USER = 'hitori', PC_PASS = ['mochi0311', 'mochi03.11', 'mochi311'];
const PCC = document.createElement('canvas'); PCC.width = 640; PCC.height = 360; const G = PCC.getContext('2d');
function pcOpen() { return { k: 'pc', scr: 'lock', user: '', pass: '', focus: null, err: 0, t: 0, wins: [], start: 0, all: 0, power: 0, mx: 320, my: 200, said: {}, z: 0, sq: '', fade: 0 } }
// ---- typing
addEventListener('keydown', e => {
  if (sc != 'p2' || !P2.ui || P2.ui.k != 'pc') return; const u = P2.ui, f = u.focus; if (!f) return;
  const tgt = typeof f == 'string' ? [u, f] : [f.o, f.k];
  if (e.key.length == 1 && !e.ctrlKey && !e.metaKey) { tgt[0][tgt[1]] = (tgt[0][tgt[1]] + e.key).slice(0, 60); e.preventDefault(); beep(900, .01, .2) }
  else if (e.key == 'Backspace') { tgt[0][tgt[1]] = tgt[0][tgt[1]].slice(0, -1); e.preventDefault() }
  else if (e.key == 'Tab' && u.scr == 'login') { u.focus = f == 'user' ? 'pass' : 'user'; e.preventDefault() }
  else if (e.key == 'Enter') { if (u.scr == 'login') pcSignIn(u); else if (f.enter) f.enter(); e.preventDefault() }
});
// ---- drawing helpers (on the computer's own canvas)
const R2 = (x, y, w, h, c) => { G.fillStyle = c; G.fillRect(x, y, w, h) };
function RR(x, y, w, h, r, c, stroke) { G.beginPath(); G.roundRect ? G.roundRect(x, y, w, h, r) : G.rect(x, y, w, h); if (c) { G.fillStyle = c; G.fill() } if (stroke) { G.strokeStyle = stroke; G.lineWidth = 1; G.stroke() } }
function T2(s, x, y, c = '#fff', px = 9, wt = 400, al = 'left') { G.font = wt + ' ' + px + 'px ' + PCF; G.textAlign = al; G.textBaseline = 'top'; G.fillStyle = c; G.fillText(s, x, y) }
function TW2(s, px = 9, wt = 400) { G.font = wt + ' ' + px + 'px ' + PCF; return G.measureText(s).width }
function fit2(s, w, px, wt) { if (TW2(s, px, wt) <= w) return s; while (s.length > 1 && TW2(s + '…', px, wt) > w) s = s.slice(0, -1); return s + '…' }
function L2(x1, y1, x2, y2, c, w = 1) { G.strokeStyle = c; G.lineWidth = w; G.beginPath(); G.moveTo(x1, y1); G.lineTo(x2, y2); G.stroke() }
function C2(x, y, r, c) { G.fillStyle = c; G.beginPath(); G.arc(x, y, r, 0, 7); G.fill() }
const IN = (u, x, y, w, h) => u.mx >= x && u.mx < x + w && u.my >= y && u.my < y + h;
// the Bloom wallpaper: a soft blue flower of folded light
let WALL11 = null;
function wall11() { if (WALL11) return WALL11; const c = document.createElement('canvas'); c.width = 640; c.height = 360; const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, '#0a1a3a'); bg.addColorStop(1, '#030a1c'); g.fillStyle = bg; g.fillRect(0, 0, 640, 360);
  g.save(); g.translate(330, 205); for (let i = 0; i < 9; i++) { g.save(); g.rotate(-1.35 + i * .32); const gr = g.createLinearGradient(0, 0, 0, -170); gr.addColorStop(0, 'rgba(20,90,220,.0)'); gr.addColorStop(.35, 'rgba(40,120,255,.55)'); gr.addColorStop(1, 'rgba(150,210,255,.85)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-55, -50, -45, -150, 0, -175); g.bezierCurveTo(45, -150, 55, -50, 0, 0); g.fill(); g.restore() }
  const core = g.createRadialGradient(0, -20, 5, 0, -20, 120); core.addColorStop(0, 'rgba(200,230,255,.35)'); core.addColorStop(1, 'rgba(0,40,120,0)'); g.fillStyle = core; g.fillRect(-200, -200, 400, 400); g.restore();
  return WALL11 = c }
// ---- icons (Windows 11 style, about 16 px)
function ico(k, x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  const sq = (a, b, w, h, c, r = 1.5) => RR(a, b, w, h, r, c);
  switch (k) {
    case 'win': sq(1, 1, 6.5, 6.5, '#0f6cbd', .6); sq(8.5, 1, 6.5, 6.5, '#2a8ae0', .6); sq(1, 8.5, 6.5, 6.5, '#2a8ae0', .6); sq(8.5, 8.5, 6.5, 6.5, '#4cc2ff', .6); break;
    case 'search': G.strokeStyle = '#ddd'; G.lineWidth = 1.6; G.beginPath(); G.arc(7, 7, 4.2, 0, 7); G.stroke(); L2(10, 10, 14, 14, '#ddd', 1.8); break;
    case 'taskview': sq(1, 3, 9, 8, '#bbb', 1); sq(6, 5, 9, 8, '#e8e8e8', 1); break;
    case 'explorer': sq(1, 3, 14, 11, '#f0b429', 1.5); sq(1, 2, 6, 3, '#e3a21a', 1); sq(1, 6, 14, 3, '#2a7ad8', 0); break;
    case 'edge': { const gr = G.createLinearGradient(2, 2, 14, 14); gr.addColorStop(0, '#36c46a'); gr.addColorStop(.5, '#1a9ad8'); gr.addColorStop(1, '#0b55b5'); C2(8, 8, 7, '#0b55b5'); G.fillStyle = gr; G.beginPath(); G.arc(8, 8, 7, 3.4, 6.2); G.lineTo(10, 9); G.arc(8, 9.5, 2.4, 0, 3.2, true); G.fill(); C2(9, 10, 2.6, '#0a2050'); break }
    case 'store': sq(2, 5, 12, 10, '#1a1a1a', 1.5); G.strokeStyle = '#ddd'; G.lineWidth = 1.2; G.beginPath(); G.arc(8, 5, 3, 3.14, 6.28); G.stroke(); sq(4.5, 7, 3, 3, '#f25022', 0); sq(8.5, 7, 3, 3, '#7fba00', 0); sq(4.5, 11, 3, 3, '#00a4ef', 0); sq(8.5, 11, 3, 3, '#ffb900', 0); break;
    case 'settings': { G.fillStyle = '#9aa0a8'; for (let i = 0; i < 8; i++) { G.save(); G.translate(8, 8); G.rotate(i * .785); G.fillRect(-1.6, -7.5, 3.2, 3); G.restore() } C2(8, 8, 5.2, '#9aa0a8'); C2(8, 8, 2.4, '#3a3a3a'); break }
    case 'mail': sq(1, 3, 14, 10, '#0f6cbd', 1.5); G.strokeStyle = '#fff'; G.lineWidth = 1.2; G.beginPath(); G.moveTo(2, 4); G.lineTo(8, 9); G.lineTo(14, 4); G.stroke(); break;
    case 'calendar': sq(1, 2, 14, 13, '#e8e8e8', 1.5); sq(1, 2, 14, 4, '#0f6cbd', 1.5); for (let i = 0; i < 6; i++) R2(3 + (i % 3) * 4, 8 + Math.floor(i / 3) * 3, 2, 2, '#666'); break;
    case 'calc': sq(2, 1, 12, 14, '#3a3a3a', 1.5); sq(3.5, 2.5, 9, 3.5, '#9ad0ff', .5); for (let i = 0; i < 6; i++) R2(4 + (i % 3) * 3, 8 + Math.floor(i / 3) * 3, 2, 2, i == 5 ? '#4cc2ff' : '#ccc'); break;
    case 'notepad': sq(2, 1, 12, 14, '#e8f0fa', 1.5); sq(2, 1, 12, 3, '#4c9ae8', 1.5); for (let i = 0; i < 3; i++) R2(4, 6.5 + i * 2.6, 8 - i, 1, '#4a6a9a'); break;
    case 'photos': sq(1, 2, 14, 12, '#e8eef8', 2); { const gr = G.createLinearGradient(0, 3, 0, 13); gr.addColorStop(0, '#4cc2ff'); gr.addColorStop(1, '#0f6cbd'); G.fillStyle = gr; G.beginPath(); G.moveTo(2, 13); G.lineTo(7, 7); G.lineTo(10, 10); G.lineTo(12, 8.5); G.lineTo(14, 13); G.fill() } C2(11, 5.5, 1.6, '#ffb900'); break;
    case 'paint': { C2(8, 8, 7, '#f4e8d0'); for (const [a, c] of [[0, '#e84a4a'], [1.2, '#ffb900'], [2.4, '#36c46a'], [3.6, '#0f6cbd'], [4.8, '#8a4ad8']]) C2(8 + Math.cos(a) * 4, 8 + Math.sin(a) * 4, 1.6, c); break }
    case 'clock': C2(8, 8, 7, '#e8e8e8'); C2(8, 8, 6, '#1f1f1f'); L2(8, 8, 8, 4, '#4cc2ff', 1.4); L2(8, 8, 11, 9, '#fff', 1.2); break;
    case 'word': sq(4, 1, 11, 14, '#c8dcf4', 1.5); sq(1, 4, 9, 8, '#185abd', 1); T2('W', 5.5, 4.6, '#fff', 7, 700, 'center'); break;
    case 'excel': sq(4, 1, 11, 14, '#c8f0d8', 1.5); sq(1, 4, 9, 8, '#107c41', 1); T2('X', 5.5, 4.6, '#fff', 7, 700, 'center'); break;
    case 'ppt': sq(4, 1, 11, 14, '#f8d8c8', 1.5); sq(1, 4, 9, 8, '#c43e1c', 1); T2('P', 5.5, 4.6, '#fff', 7, 700, 'center'); break;
    case 'media': { const gr = G.createLinearGradient(0, 0, 16, 16); gr.addColorStop(0, '#ff8a3a'); gr.addColorStop(1, '#e83a6a'); sq(1, 1, 14, 14, gr, 3); G.fillStyle = '#fff'; G.beginPath(); G.moveTo(6, 4.5); G.lineTo(12, 8); G.lineTo(6, 11.5); G.fill(); break }
    case 'xbox': C2(8, 8, 7, '#107c10'); G.strokeStyle = '#fff'; G.lineWidth = 1.6; G.beginPath(); G.moveTo(4.5, 4.5); G.lineTo(11.5, 11.5); G.moveTo(11.5, 4.5); G.lineTo(4.5, 11.5); G.stroke(); break;
    case 'terminal': sq(1, 2, 14, 12, '#1e1e1e', 2); T2('>_', 3, 5, '#ccc', 6.5, 700); break;
    case 'snip': sq(1, 1, 14, 14, '#e83a6a', 3); G.strokeStyle = '#fff'; G.lineWidth = 1.3; G.strokeRect(4, 4, 8, 8); break;
    case 'pc': sq(1, 2, 14, 9, '#4cc2ff', 1.5); sq(2, 3, 12, 7, '#0f6cbd', 1); sq(5, 12, 6, 2, '#999', .5); break;
    case 'bin': sq(3, 4, 10, 11, 'rgba(200,220,240,.75)', 1.5); sq(2, 2, 12, 2, '#d8e4f0', .5); for (let i = 0; i < 3; i++) R2(5 + i * 2.5, 6, 1, 7, 'rgba(80,100,130,.5)'); break;
    case 'save': sq(1, 1, 14, 14, '#2a5aa8', 1.5); sq(4, 1, 8, 5, '#d8dce4', .5); R2(9, 2, 2, 3, '#2a5aa8'); sq(3, 8.5, 10, 6, '#f4f4f4', .8); for (let i = 0; i < 2; i++) R2(5, 10.5 + i * 2, 6, .8, '#99a'); break;
    case 'txt': sq(3, 1, 10, 14, '#f4f4f4', 1); for (let i = 0; i < 4; i++) R2(5, 4 + i * 2.6, 6, 1, '#888'); break;
    case 'jpg': sq(3, 1, 10, 14, '#f4f4f4', 1); sq(4, 5, 8, 6, '#4cc2ff', .5); R2(4, 9, 8, 2, '#36a46a'); break;
    case 'audio': sq(3, 1, 10, 14, '#f4f4f4', 1); G.fillStyle = '#e8753a'; G.beginPath(); G.moveTo(6, 5); G.lineTo(10, 7.5); G.lineTo(6, 10); G.fill(); break;
    case 'pdf': sq(3, 1, 10, 14, '#f4f4f4', 1); sq(3, 9, 10, 4, '#d83a3a', 0); T2('PDF', 8, 9.3, '#fff', 3.5, 700, 'center'); break;
    case 'folder': sq(1, 3, 14, 11, '#f0b429', 1.5); sq(1, 2, 6, 3, '#e3a21a', 1); break;
    case 'wifi': G.strokeStyle = '#eee'; G.lineWidth = 1.2; for (let i = 1; i <= 3; i++) { G.beginPath(); G.arc(8, 13, i * 3, 3.93, 5.5); G.stroke() } C2(8, 12.5, 1, '#eee'); break;
    case 'nowifi': G.strokeStyle = '#888'; G.lineWidth = 1.2; for (let i = 1; i <= 3; i++) { G.beginPath(); G.arc(8, 13, i * 3, 3.93, 5.5); G.stroke() } L2(11, 8, 15, 12, '#eee', 1.2); L2(15, 8, 11, 12, '#eee', 1.2); break;
    case 'vol': G.fillStyle = '#eee'; G.beginPath(); G.moveTo(3, 6); G.lineTo(6, 6); G.lineTo(9, 3); G.lineTo(9, 13); G.lineTo(6, 10); G.lineTo(3, 10); G.fill(); G.strokeStyle = '#eee'; G.lineWidth = 1; G.beginPath(); G.arc(9, 8, 3, -.9, .9); G.stroke(); break;
    case 'bat': G.strokeStyle = '#eee'; G.lineWidth = 1; G.strokeRect(2.5, 5.5, 10, 6); R2(13, 7, 1.5, 3, '#eee'); R2(4, 7, 3, 3, '#e8a03a'); break;
    case 'bell': G.strokeStyle = '#eee'; G.lineWidth = 1.2; G.beginPath(); G.moveTo(4, 11); G.quadraticCurveTo(4, 3, 8, 3); G.quadraticCurveTo(12, 3, 12, 11); G.closePath(); G.stroke(); C2(8, 12.5, 1.2, '#eee'); break;
    case 'power': G.strokeStyle = '#ddd'; G.lineWidth = 1.4; G.beginPath(); G.arc(8, 8.5, 5, -1.0, 4.15); G.stroke(); L2(8, 2.5, 8, 8, '#ddd', 1.4); break;
    case 'user': C2(8, 8, 7.5, '#5a5a6a'); C2(8, 6, 2.8, '#c8c8d0'); G.fillStyle = '#c8c8d0'; G.beginPath(); G.ellipse(8, 13, 5, 3.4, 0, 3.14, 6.28); G.fill(); break;
    case 'yt': RR(0, 3, 16, 11, 3.2, '#ff0033'); G.fillStyle = '#fff'; G.beginPath(); G.moveTo(6.3, 5.8); G.lineTo(11, 8.5); G.lineTo(6.3, 11.2); G.fill(); break;
  }
  G.restore();
}
// ---- the apps
const APPS = {
  edge: { n: 'Microsoft Edge', i: 'edge', w: 560, h: 300 }, explorer: { n: 'File Explorer', i: 'explorer', w: 440, h: 250 }, notepad: { n: 'Notepad', i: 'notepad', w: 330, h: 220 }, photos: { n: 'Photos', i: 'photos', w: 330, h: 270 },
  settings: { n: 'Settings', i: 'settings', w: 470, h: 280 }, calc: { n: 'Calculator', i: 'calc', w: 180, h: 260 }, paint: { n: 'Paint', i: 'paint', w: 420, h: 270 }, clock: { n: 'Clock', i: 'clock', w: 360, h: 230 },
  calendar: { n: 'Calendar', i: 'calendar', w: 380, h: 260 }, mail: { n: 'Outlook', i: 'mail', w: 420, h: 250 }, store: { n: 'Microsoft Store', i: 'store', w: 420, h: 250 }, word: { n: 'Word', i: 'word', w: 360, h: 220 },
  excel: { n: 'Excel', i: 'excel', w: 360, h: 220 }, ppt: { n: 'PowerPoint', i: 'ppt', w: 360, h: 220 }, media: { n: 'Media Player', i: 'media', w: 400, h: 240 }, xbox: { n: 'Xbox', i: 'xbox', w: 400, h: 240 },
  terminal: { n: 'Terminal', i: 'terminal', w: 380, h: 200 }, savegame: { n: 'Save game', i: 'save', w: 280, h: 180 }, snip: { n: 'Snipping Tool', i: 'snip', w: 300, h: 120 },
};
const PINNED11 = ['edge', 'word', 'excel', 'ppt', 'mail', 'calendar', 'store', 'photos', 'settings', 'calc', 'clock', 'notepad', 'paint', 'explorer', 'media', 'xbox', 'snip', 'terminal'];
const HISTORY = ['my sister left without saying goodbye', 'how to find someone who doesnt want to be found', 'number says no longer in service what does that mean', 'is it my fault she left', 'how long can you sleep without waking up', 'hearing footsteps when nobody else is home', 'what happens if you stop taking your meds', 'why do my friends whisper about me', 'how to say sorry to someone who wont pick up'];
const VIDS = [['rain on a window at night (10 hours, no ads)', 'quiet rooms', '2.1M views', '3 years ago', '10:00:00'], ['what it feels like to wake up after a very long sleep', 'thinkpiece', '381K views', '1 year ago', '14:22'], ['footsteps recorded in my empty house [NOT CLICKBAIT]', 'real paranormal', '1.4M views', '8 months ago', '8:47'],
  ['lofi for when everyone has left', 'lofi rooms', '9.8M views', '2 years ago', '3:01:11'], ['sisters reunited after 3 years (emotional)', 'family moments', '612K views', '5 months ago', '11:03'], ['how to tell if you are dreaming', 'brain stuff', '77K views', '4 years ago', '6:40']];
// real thumbnails: put them in assets/yt/ as 1.jpg ... 6.jpg (one per video above, in order). They're shown low-res.
// Any that are missing fall back to the drawn ones below.
const YT_THUMBS = VIDS.map((v, i) => { const im = new Image(), o = { im, ok: false, lo: null }; im.onload = () => { o.ok = true; const c = document.createElement('canvas'); c.width = 48; c.height = 27; const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.drawImage(im, 0, 0, 48, 27); o.lo = c }; im.src = 'assets/yt/' + (i + 1) + '.jpg'; return o });
function thumb(i, x, y, w, h, t) {
  G.save(); G.beginPath(); G.roundRect ? G.roundRect(x, y, w, h, 4) : G.rect(x, y, w, h); G.clip(); R2(x, y, w, h, ['#1a2a3a', '#2a2030', '#101010', '#3a2a40', '#3a3020', '#202838'][i]);
  const yt = YT_THUMBS[i]; if (yt && yt.lo) { const sm = G.imageSmoothingEnabled; G.imageSmoothingEnabled = false; G.drawImage(yt.lo, x, y, w, h); G.imageSmoothingEnabled = sm;
    RR(x + w - 30, y + h - 12, 27, 9, 2, 'rgba(0,0,0,.8)'); T2(VIDS[i][4], x + w - 16.5, y + h - 11, '#fff', 6.5, 600, 'center'); G.restore(); return }
  if (i == 0) { for (let k = 0; k < 22; k++) R2(x + (k * 37 + t * .5) % w, y + ((k * 23 + t) % h), 1, 4, 'rgba(160,190,220,.55)'); R2(x + w * .1, y + h * .1, w * .8, 2, '#0a1018'); R2(x + w * .5, y + h * .1, 2, h * .8, '#0a1018') }
  if (i == 1) { R2(x + w * .2, y + h * .58, w * .6, h * .18, '#5a4a5a'); C2(x + w * .38, y + h * .5, h * .1, '#d8c0b4'); R2(x + w * .3, y + h * .52, w * .45, h * .1, '#8a7a9a') }
  if (i == 2) { R2(x + w * .42, y + h * .15, w * .18, h * .75, '#1a1a1a'); R2(x + w * .44, y + h * .18, w * .14, h * .7, '#060606'); for (let k = 0; k < 4; k++) RR(x + w * (.2 + k * .17), y + h * .82, 6, 3, 1, '#555'); T2('!!', x + w - 6, y + 4, '#ff3a3a', 13, 800, 'right') }
  if (i == 3) { const gr = G.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, '#5a3a7a'); gr.addColorStop(1, '#c87aa8'); G.fillStyle = gr; G.fillRect(x, y, w, h); R2(x + w * .2, y + h * .5, w * .3, h * .3, '#2a1a3a'); C2(x + w * .7, y + h * .3, h * .12, '#ffe0a0') }
  if (i == 4) { R2(x + w * .28, y + h * .3, w * .18, h * .7, '#2a1e1a'); R2(x + w * .52, y + h * .3, w * .18, h * .7, '#111018'); C2(x + w * .37, y + h * .32, h * .11, '#e0ccc4'); C2(x + w * .61, y + h * .34, h * .11, '#e0ccc4'); }
  if (i == 5) { G.strokeStyle = '#8a8af8'; G.lineWidth = 2; for (let k = 1; k < 4; k++) { G.beginPath(); G.arc(x + w / 2, y + h / 2, h * .1 * k, 0, 7); G.stroke() } }
  RR(x + w - 30, y + h - 12, 27, 9, 2, 'rgba(0,0,0,.8)'); T2(VIDS[i][4], x + w - 16.5, y + h - 11, '#fff', 6.5, 600, 'center'); G.restore();
}
function pcSignIn(u) {
  if (u.user.trim().toLowerCase() == PC_USER && PC_PASS.includes(u.pass.trim().toLowerCase())) { u.scr = 'welcome'; u.wt = 0; u.focus = null; beep(660, .08); beep(880, .1) }
  else { u.err++; u.pass = ''; beep(200, .2, 1, 'square'); if (u.err == 1) say3(['Hitori|...Shit. What was it again?']); if (u.err == 2) say3(['Hitori|Something with Mochi. Mochi and... a date?']) }
}
function openApp(u, a, o = {}) {
  u.start = 0; u.power = 0; const A = APPS[a]; if (!A) return;
  let w = !o.multi && u.wins.find(w => w.app == a); if (w) { w.min = 0; u.wins.splice(u.wins.indexOf(w), 1); u.wins.push(w); Object.assign(w, o); return w }
  const n = u.wins.length; w = { app: a, x: Math.round((640 - A.w) / 2 + (n % 5) * 14 - 28), y: Math.round(Math.max(6, (334 - A.h) / 2 + (n % 5) * 10 - 20)), w: A.w, h: A.h, min: 0, max: 0, st: {}, ...o };
  u.wins.push(w); beep(520, .03, .3);
  if (a == 'edge' && !w.page) { w.page = 'yt'; w.ytp = 'home'; w.search = ''; w.addr = '' }
  if (a == 'notepad' && !u.said.notes) { u.said.notes = 1; say3(['Hitori|"Call her back." Three times.', 'Hitori|...Call WHO back?']) }
  if (a == 'calendar' && !u.said.cal) { u.said.cal = 1; say3(['Hitori|"She left." In my handwriting.', 'Hitori|...I don\'t remember writing that.']) }
  if (a == 'clock' && !u.said.clock) { u.said.clock = 1; say3(['Hitori|"Take meds." Turned off. Every single day.']) }
  return w;
}
function openFile(u, f) {
  if (f == 'notes.txt') return openApp(u, 'notepad'); if (f == 'us.jpg') return openApp(u, 'photos'); if (f == 'bus_ticket.pdf') return openApp(u, 'edge', { page: 'pdf' });
  if (f == 'voicemail.m4a') { const w = openApp(u, 'media'); w.st.err = 1; if (!u.said.vm) { u.said.vm = 1; say3(['Hitori|A voicemail. From that number with the heart.', 'Hitori|...It won\'t play. Of course it won\'t play.']) } return w }
}
function pcClose(u) { SFX3.click(); P2.ui = null;
  P2.cut = { k: 'stand', t: 0, after: () => { if (P2.f.history && !P2.f.afterPC) { P2.f.afterPC = 1; say3(['Hitori|...', 'Hitori|Why does my chest hurt.', 'Hitori|The photos on the wardrobe. There\'s something about them.'], () => { P2.objective = 'The photos on the wardrobe.' }) } } } }
// ---------------------------------------------------------------- input
function pcUpdate(u) {
  u.t++; u.fade = Math.min(1, u.fade + .05);
  if (P2MOUSE.moved) { u.mx = clamp(P2MOUSE.x * 2, 0, 639); u.my = clamp(P2MOUSE.y * 2, 0, 359); P2MOUSE.moved = 0 }
  const hx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0), hy = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
  if ((hx || hy) && !u.focus) { u.held = (u.held || 0) + 1; const v = Math.min(8, 2 + u.held / 6); u.mx = clamp(u.mx + hx * v, 0, 639); u.my = clamp(u.my + hy * v, 0, 359); P2MOUSE.x = u.mx / 2; P2MOUSE.y = u.my / 2 } else u.held = 0;
  const click = P2MOUSE.click || (!u.focus && (hit.KeyZ || hit.Enter || hit.Space)), down = P2MOUSE.down || keys.KeyZ; P2MOUSE.click = 0;
  // dragging windows, drawing in Paint
  if (u.drag) { if (down) { const w = u.drag.w; w.x = clamp(u.mx - u.drag.dx, -w.w + 60, 600); w.y = clamp(u.my - u.drag.dy, 0, 320) } else u.drag = null }
  const top = u.wins.filter(w => !w.min).slice(-1)[0];
  if (top && top.app == 'paint' && down && top.st.cv) { const [cx, cy] = [u.mx - top.cx, u.my - top.cy]; if (cx >= 0 && cy >= 0 && cx < top.cw && cy < top.ch) { const g = top.st.cv.getContext('2d'); g.strokeStyle = top.st.col || '#111'; g.lineWidth = top.st.sz || 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(top.st.lx ?? cx, top.st.ly ?? cy); g.lineTo(cx, cy); g.stroke(); top.st.lx = cx; top.st.ly = cy } } else if (top && top.st) { top.st.lx = top.st.ly = null }
  if (hit.Escape || (!u.focus && hit.KeyX)) { if (u.power) u.power = 0; else if (u.start) u.start = 0; else if (top) u.wins.splice(u.wins.indexOf(top), 1); else return pcClose(u) }
  if (u.scr == 'welcome') { if (++u.wt > 100) u.scr = 'desk'; return }
  if (!click) return;
  if (u.scr == 'lock') { u.scr = 'login'; u.focus = 'user'; beep(500, .03); return }
  if (u.scr == 'login') { if (IN(u, 230, 206, 180, 20)) u.focus = 'user'; else if (IN(u, 230, 232, 158, 20)) u.focus = 'pass'; else if (IN(u, 388, 232, 22, 20)) pcSignIn(u); return }
  // ---- the desktop
  for (const b of u.btns || []) if (IN(u, ...b.r)) { b.f(); return }
  u.focus = null; u.sel = null;
}
// ---------------------------------------------------------------- drawing
function drawPC(u) {
  u.btns = []; const B = (r, f) => u.btns.unshift({ r, f });   // later buttons sit on top, so they're checked first
  G.setTransform(1, 0, 0, 1, 0, 0); G.imageSmoothingEnabled = true;
  if (u.scr != 'desk') drawLock(u); else drawDesk(u, B);
  // the pointer (Windows arrow)
  const x = Math.round(u.mx), y = Math.round(u.my); G.fillStyle = '#fff'; G.strokeStyle = '#000'; G.lineWidth = 1; G.beginPath(); G.moveTo(x, y); G.lineTo(x, y + 13); G.lineTo(x + 3.2, y + 10); G.lineTo(x + 5.6, y + 15); G.lineTo(x + 7.6, y + 14); G.lineTo(x + 5.3, y + 9.3); G.lineTo(x + 9.4, y + 9.3); G.closePath(); G.fill(); G.stroke();
  // onto the game canvas, with hard pixels and a little CRT on top
  sU(); X.save(); X.imageSmoothingEnabled = false; X.globalAlpha = u.fade; X.drawImage(PCC, 0, 0, W, H); X.globalAlpha = .07 * u.fade; for (let yy = 0; yy < H; yy += 1) r(0, yy + .5, W, .25, '#000'); X.globalAlpha = 1;
  const vg = X.createRadialGradient(W / 2, H / 2, 110, W / 2, H / 2, 210); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,' + .5 * u.fade + ')'); X.fillStyle = vg; X.fillRect(0, 0, W, H); X.restore();
}
function drawLock(u) {
  G.drawImage(wall11(), 0, 0); const d = new Date();
  if (u.scr == 'lock') { R2(0, 0, 640, 360, 'rgba(0,0,0,.15)'); T2(d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'), 320, 46, '#fff', 64, 600, 'center'); T2(d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), 320, 118, '#f0f0f0', 14, 500, 'center');
    ico('nowifi', 576, 334, 1); ico('bat', 600, 334, 1); if ((u.t >> 5) % 2) T2('Click anywhere to sign in', 320, 300, 'rgba(255,255,255,.7)', 9, 400, 'center'); return }
  R2(0, 0, 640, 360, 'rgba(8,12,30,.62)');
  C2(320, 132, 40, '#cfd3da'); C2(320, 118, 15, '#8a8f98'); G.fillStyle = '#8a8f98'; G.beginPath(); G.save(); G.beginPath(); G.arc(320, 132, 40, 0, 7); G.clip(); G.beginPath(); G.ellipse(320, 168, 30, 22, 0, 0, 7); G.fill(); G.restore();
  if (u.scr == 'welcome') { T2('Welcome', 320, 184, '#fff', 18, 600, 'center'); for (let i = 0; i < 5; i++) { const a = u.wt / 9 - i * .45; C2(320 + Math.cos(a) * 9, 226 + Math.sin(a) * 9, 1.6, '#fff') } return }
  T2('Other user', 320, 180, '#fff', 15, 600, 'center');
  const fld = (y, w, k, ph, hide) => { RR(230, y, w, 20, 3, u.focus == k ? '#fff' : 'rgba(255,255,255,.82)'); R2(232, y + 18.5, w - 4, 1.5, u.focus == k ? '#0f6cbd' : '#777'); const v = hide ? '●'.repeat(u[k].length) : u[k]; T2(v || ph, 237, y + 5, v ? '#111' : '#666', hide && v ? 7 : 10); if (u.focus == k && (u.t >> 4) % 2) R2(237 + TW2(v, hide ? 7 : 10) + 1, y + 4, 1, 12, '#111') };
  fld(206, 180, 'user', 'User name'); fld(232, 158, 'pass', 'Password', 1); RR(388, 232, 22, 20, 3, IN(u, 388, 232, 22, 20) ? '#2a8ae0' : '#0f6cbd'); L2(394, 242, 404, 242, '#fff', 1.5); L2(400, 237, 404, 242, '#fff', 1.5); L2(400, 247, 404, 242, '#fff', 1.5);
  if (u.err) T2('The user name or password is incorrect. Try again.', 320, 260, '#ffb8b8', 9.5, 400, 'center');
  if (u.err >= 1) T2('Password hint: who sleeps on my keyboard + the day she came home (ddmm)', 320, 276, '#d0d8ff', 9, 400, 'center');
  T2('Sign-in options', 320, 294, '#cfe0ff', 9, 400, 'center');
  ico('user', 14, 326, 1.1); T2('Other user', 36, 330, '#fff', 9, 600); RR(8, 322, 90, 26, 4, null, 'rgba(255,255,255,.25)');
  ico('nowifi', 566, 334, 1); ico('power', 610, 333, 1); T2('Click a box to type. Enter signs in. Esc leaves.', 320, 344, 'rgba(255,255,255,.4)', 8, 400, 'center');
}
function drawDesk(u, B) {
  G.drawImage(wall11(), 0, 0);
  // desktop icons (double-click, or click twice)
  [['This PC', 'pc', () => openApp(u, 'explorer', { dir: 'This PC' })], ['Recycle Bin', 'bin', () => openApp(u, 'explorer', { dir: 'Recycle Bin' })], ['Microsoft Edge', 'edge', () => openApp(u, 'edge')], ['Save game', 'save', () => openApp(u, 'savegame')], ['notes.txt', 'txt', () => openFile(u, 'notes.txt')], ['us.jpg', 'jpg', () => openFile(u, 'us.jpg')]].forEach(([n, ic, f], i) => {
    const x = 6, y = 6 + i * 50, hv = IN(u, x, y, 54, 46); if (u.sel == n || hv) RR(x, y, 54, 46, 3, u.sel == n ? 'rgba(120,170,255,.35)' : 'rgba(255,255,255,.12)'); ico(ic, x + 13, y + 3, 1.8); T2(fit2(n, 52, 8), x + 27, y + 33, '#fff', 8, 400, 'center');
    B([x, y, 54, 46], () => { if (u.sel == n && u.t - (u.selT || 0) < 40) { u.sel = null; f() } else { u.sel = n; u.selT = u.t } }) });
  // windows, back to front
  for (const w of u.wins) if (!w.min) drawWin(u, w, B);
  // the taskbar
  R2(0, 334, 640, 26, 'rgba(28,28,32,.94)'); R2(0, 334, 640, 1, 'rgba(255,255,255,.08)');
  const tb = [['start', 'win'], ['search', 'search'], ['taskview', 'taskview'], ['explorer', 'explorer'], ['edge', 'edge'], ['store', 'store']];
  for (const w of u.wins) if (!tb.some(t => t[0] == w.app)) tb.push([w.app, APPS[w.app].i]);
  const tx0 = 320 - tb.length * 13 - (40 - 13);
  let x = tx0;
  tb.forEach(([a, ic]) => { const ww = a == 'search' ? 70 : 24, on = u.wins.some(w => w.app == a), hv = IN(u, x, 336, ww, 22), act = (a == 'start' && u.start) || (on && u.wins.filter(w => !w.min).slice(-1)[0]?.app == a);
    if (a == 'search') { RR(x, 338, ww, 18, 9, hv ? '#3a3a40' : '#2c2c32'); ico('search', x + 5, 340, .85); T2('Search', x + 22, 341, '#aaa', 8.5) }
    else { if (hv || act) RR(x, 336, ww, 22, 4, act ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.07)'); ico(ic, x + 4, 339, 1); if (on) RR(x + (act ? 7 : 10), 355, act ? 10 : 4, 2, 1, act ? '#4cc2ff' : '#999') }
    B([x, 336, ww, 22], () => { if (a == 'start') { u.start = !u.start; u.all = 0; u.power = 0; u.sq = ''; return } if (a == 'search') { u.start = 1; u.all = 0; u.sq = ''; u.focus = { o: u, k: 'sq' }; return } if (a == 'taskview') return;
      const w = u.wins.find(w => w.app == a); if (w && !w.min && u.wins[u.wins.length - 1] == w) { w.min = 1; return } openApp(u, a) });
    x += ww + 2 });
  const d = new Date(); T2(d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'), 606, 337, '#fff', 8, 400, 'right'); T2(d.toLocaleDateString('en-GB'), 606, 347, '#ddd', 7.5, 400, 'right');
  ico('nowifi', 532, 339, .9); ico('vol', 548, 339, .9); ico('bat', 564, 339, .9); T2('^', 516, 340, '#ccc', 9); ico('bell', 614, 339, .9); C2(626, 340, 2.5, '#4cc2ff');
  if (u.start) drawStart(u, B);
  if (u.histT && u.t - u.histT == 140 && !P2.f.history) { P2.f.history = 1; say3(['Hitori|...I didn\'t search any of this.', 'Hitori|Did I?', 'Hitori|"My sister." I don\'t have a sister.', 'Hitori|...Do I?']) }
}
function drawStart(u, B) {
  const x = 160, y = 46, w = 320, h = 282; B([0, 0, 640, 334], () => { u.start = 0 }); B([x, y, w, h], () => { u.power = 0 });
  G.save(); G.shadowColor = 'rgba(0,0,0,.6)'; G.shadowBlur = 20; RR(x, y, w, h, 8, 'rgba(36,36,42,.97)'); G.restore(); RR(x, y, w, h, 8, null, 'rgba(255,255,255,.1)');
  RR(x + 16, y + 12, w - 32, 18, 9, '#1c1c22', '#4a4a52'); ico('search', x + 22, y + 13, .8); T2(u.sq || 'Search for apps, settings, and documents', x + 38, y + 16, u.sq ? '#fff' : '#999', 8.5); if (u.focus && u.focus.k == 'sq' && (u.t >> 4) % 2) R2(x + 38 + TW2(u.sq, 8.5) + 1, y + 15, 1, 11, '#fff');
  B([x + 16, y + 12, w - 32, 18], () => { u.focus = { o: u, k: 'sq' } });
  const apps = Object.keys(APPS), q = u.sq.trim().toLowerCase();
  if (q) { T2('Best match', x + 20, y + 40, '#fff', 9, 600); const hits = apps.filter(a => APPS[a].n.toLowerCase().includes(q)).slice(0, 7);
    if (!hits.length) T2('No results for "' + u.sq + '"', x + 20, y + 60, '#aaa', 9);
    hits.forEach((a, i) => { const by = y + 56 + i * 24, hv = IN(u, x + 14, by, w - 28, 22); if (hv || i == 0) RR(x + 14, by, w - 28, 22, 4, 'rgba(255,255,255,' + (hv ? .1 : .05) + ')'); ico(APPS[a].i, x + 20, by + 3, 1); T2(APPS[a].n, x + 42, by + 6, '#eee', 9); B([x + 14, by, w - 28, 22], () => openApp(u, a)) });
  } else if (u.all) { T2('All apps', x + 20, y + 40, '#fff', 9.5, 600); RR(x + w - 64, y + 38, 46, 15, 3, IN(u, x + w - 64, y + 38, 46, 15) ? '#4a4a52' : '#38383e'); T2('‹ Back', x + w - 41, y + 41, '#ddd', 8, 400, 'center'); B([x + w - 64, y + 38, 46, 15], () => { u.all = 0 });
    apps.slice().sort((a, b) => APPS[a].n.localeCompare(APPS[b].n)).forEach((a, i) => { const col = i % 2, row = i >> 1, bx = x + 16 + col * 146, by = y + 60 + row * 20, hv = IN(u, bx, by, 142, 18); if (hv) RR(bx, by, 142, 18, 3, 'rgba(255,255,255,.08)'); ico(APPS[a].i, bx + 3, by + 1, 1); T2(APPS[a].n, bx + 24, by + 4, '#ddd', 8.5); B([bx, by, 142, 18], () => openApp(u, a)) });
  } else {
    T2('Pinned', x + 22, y + 40, '#fff', 9.5, 600); RR(x + w - 70, y + 38, 52, 15, 3, IN(u, x + w - 70, y + 38, 52, 15) ? '#4a4a52' : '#38383e'); T2('All apps ›', x + w - 44, y + 41, '#ddd', 8, 400, 'center'); B([x + w - 70, y + 38, 52, 15], () => { u.all = 1 });
    PINNED11.forEach((a, i) => { const bx = x + 16 + (i % 6) * 48, by = y + 58 + Math.floor(i / 6) * 46, hv = IN(u, bx, by, 46, 44); if (hv) RR(bx, by, 46, 44, 4, 'rgba(255,255,255,.08)'); ico(APPS[a].i, bx + 13, by + 5, 1.25); T2(fit2(APPS[a].n.replace('Microsoft ', ''), 44, 7.5), bx + 23, by + 30, '#ddd', 7.5, 400, 'center'); B([bx, by, 46, 44], () => openApp(u, a)) });
    T2('Recommended', x + 22, y + 200, '#fff', 9.5, 600);
    [['notes.txt', 'txt', '3 weeks ago'], ['us.jpg', 'jpg', '2 years ago'], ['voicemail.m4a', 'audio', '5 weeks ago'], ['bus_ticket.pdf', 'pdf', '6 weeks ago']].forEach(([n, ic, when], i) => { const bx = x + 16 + (i % 2) * 146, by = y + 214 + Math.floor(i / 2) * 22, hv = IN(u, bx, by, 142, 20); if (hv) RR(bx, by, 142, 20, 3, 'rgba(255,255,255,.08)'); ico(ic, bx + 3, by + 2, 1); T2(n, bx + 24, by + 2, '#ddd', 8); T2(when, bx + 24, by + 11, '#888', 7); B([bx, by, 142, 20], () => openFile(u, n)) });
  }
  R2(x, y + h - 30, w, 1, 'rgba(255,255,255,.08)'); RR(x, y + h - 29, w, 29, [0, 0, 8, 8], 'rgba(28,28,34,.97)'); ico('user', x + 18, y + h - 22, 1); T2('hitori', x + 40, y + h - 19, '#ddd', 9);
  const px = x + w - 34, py = y + h - 25; if (IN(u, px, py, 22, 20) || u.power) RR(px, py, 22, 20, 4, 'rgba(255,255,255,.1)'); ico('power', px + 3, py + 2, 1); B([px, py, 22, 20], () => { u.power = !u.power });
  if (u.power) { const mx = px - 70, my = py - 70; RR(mx, my, 90, 66, 6, '#2c2c32', '#4a4a52'); ['Sleep', 'Shut down', 'Restart'].forEach((n, i) => { const by = my + 4 + i * 20, hv = IN(u, mx + 4, by, 82, 18); if (hv) RR(mx + 4, by, 82, 18, 3, 'rgba(255,255,255,.08)'); T2(n, mx + 14, by + 4, '#eee', 9); B([mx + 4, by, 82, 18], () => pcClose(u)) }) }
}
function drawWin(u, w, B) {
  const A = APPS[w.app]; if (w.max) { w.x = 0; w.y = 0; w.w = 640; w.h = 334 }
  const { x, y } = w, ww = w.w, hh = w.h, top = u.wins.filter(v => !v.min).slice(-1)[0] == w;
  B([x, y, ww, hh], () => { u.wins.splice(u.wins.indexOf(w), 1); u.wins.push(w); u.focus = null });
  G.save(); G.shadowColor = 'rgba(0,0,0,.55)'; G.shadowBlur = top ? 22 : 10; RR(x, y, ww, hh, w.max ? 0 : 7, '#202024'); G.restore(); RR(x, y, ww, hh, w.max ? 0 : 7, null, top ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.07)');
  // the title bar
  const th = 22; if (w.app != 'edge') { ico(A.i, x + 8, y + 3, 1); T2(w.title || A.n, x + 30, y + 6, top ? '#eee' : '#999', 8.5) }
  B([x, y, ww - 96, th], () => { u.wins.splice(u.wins.indexOf(w), 1); u.wins.push(w); if (!w.max) u.drag = { w, dx: u.mx - w.x, dy: u.my - w.y } });
  const bx = x + ww - 96; [['min', '#ddd'], ['max', '#ddd'], ['close', '#ddd']].forEach(([k], i) => { const r = [bx + i * 32, y, 32, th], hv = IN(u, ...r); if (hv) RR(...r, k == 'close' ? (w.max ? 0 : [0, 7, 0, 0]) : 0, k == 'close' ? '#c42b1c' : 'rgba(255,255,255,.1)');
    const cx = bx + i * 32 + 16, cy = y + 11; if (k == 'min') L2(cx - 4.5, cy, cx + 4.5, cy, '#ddd'); if (k == 'max') { G.strokeStyle = '#ddd'; G.lineWidth = 1; G.strokeRect(cx - 4, cy - 4, 8, 8) } if (k == 'close') { L2(cx - 4, cy - 4, cx + 4, cy + 4, '#ddd'); L2(cx + 4, cy - 4, cx - 4, cy + 4, '#ddd') }
    B(r, () => { if (k == 'min') w.min = 1; if (k == 'max') { if (w.max) { w.max = 0; Object.assign(w, w.prev) } else { w.prev = { x: w.x, y: w.y, w: w.w, h: w.h }; w.max = 1 } } if (k == 'close') u.wins.splice(u.wins.indexOf(w), 1) }) });
  if (w.app == 'edge') edgeTabs(u, w, x, y, B);
  // the content
  const cx = x + 1, cy = y + th, cw = ww - 2, ch = hh - th - 1; w.cx = cx; w.cy = cy; w.cw = cw; w.ch = ch;
  G.save(); G.beginPath(); G.rect(cx, cy, cw, ch); G.clip(); (APPDRAW[w.app] || APPDRAW.generic)(u, w, cx, cy, cw, ch, B); G.restore();
}
// a page that says the app needs the internet
function offline(u, w, x, y, ww, hh, B, title, sub) { R2(x, y, ww, hh, '#1c1c20'); ico('nowifi', x + ww / 2 - 16, y + hh / 2 - 50, 2); T2(title, x + ww / 2, y + hh / 2 - 12, '#fff', 12, 600, 'center'); T2(sub, x + ww / 2, y + hh / 2 + 6, '#aaa', 8.5, 400, 'center');
  const r = [x + ww / 2 - 34, y + hh / 2 + 24, 68, 18]; RR(...r, 4, IN(u, ...r) ? '#2a8ae0' : '#0f6cbd'); T2('Try again', x + ww / 2, y + hh / 2 + 28, '#fff', 8.5, 600, 'center'); B(r, () => { w.st.retry = u.t; beep(300, .1) }); if (w.st.retry && u.t - w.st.retry < 60) T2('Still no connection.', x + ww / 2, y + hh / 2 + 48, '#ffb8b8', 8, 400, 'center') }
const NOTES = ['things to remember:', '', '- eat something', '- take meds (!!)', '- call her back', '- call her back', '- CALL HER BACK', '', 'she said she needed space. ok. i can give her space.', 'i can wait.', '', 'they keep whispering when i call. i can hear them', 'whispering. caroline says they arent. caroline lies'];
const APPDRAW = {
  // saving part two: the computer is where you save, into the same three slots as part one (they read "Hitori's house").
  // It keeps the day you're on; loading one starts that day again.
  savegame(u, w, x, y, ww, hh, B) { const st = w.st;
    R2(x, y, ww, hh, '#202024'); ico('save', x + 12, y + 10, 1.4); T2('Save game', x + 40, y + 10, '#fff', 11, 600); T2('Part Two  ·  ' + p2DayName(P2.stage) + '  ·  pick a slot', x + 40, y + 25, '#aaa', 8);
    if (st.done > 0) st.done--;
    [0, 1, 2].forEach(i => { const by = y + 44 + i * 26, hv = IN(u, x + 12, by, ww - 24, 22), on = st.done > 0 && st.slot == i;
      RR(x + 12, by, ww - 24, 22, 4, on ? '#2a7ad8' : hv ? '#3a3a42' : '#2c2c32', '#45454d'); T2(summ(i), x + 20, by + 6, '#eee', 8.5); if (on) T2('Saved', x + ww - 20, by + 6, '#fff', 8.5, 600, 'right');
      B([x + 12, by, ww - 24, 22], () => { p2Save(i); st.done = 90; st.slot = i; beep(660, .05); beep(880, .08) }) });
    T2('Load it from Continue on the title screen. It starts this day again.', x + 12, y + hh - 16, '#888', 7.5) },
  generic(u, w, x, y, ww, hh, B) { offline(u, w, x, y, ww, hh, B, 'Can\'t connect', 'Check your internet connection and try again.') },
  notepad(u, w, x, y, ww, hh) { R2(x, y, ww, hh, '#1f1f1f'); R2(x, y, ww, 16, '#2a2a2e'); ['File', 'Edit', 'View'].forEach((n, i) => T2(n, x + 8 + i * 30, y + 3, '#ddd', 8.5)); RR(x + 6, y + 17, 90, 15, [4, 4, 0, 0], '#2c2c30'); T2('notes.txt', x + 14, y + 20, '#ddd', 8);
    R2(x, y + 32, ww, hh - 46, '#272727'); NOTES.forEach((l, i) => T2(l, x + 8, y + 37 + i * 11, i >= 11 ? '#e8c8c8' : '#e8e8e8', 8.5, 400)); R2(x, y + hh - 14, ww, 14, '#2a2a2e'); T2('Ln 13, Col 49   |   100%   |   UTF-8', x + 8, y + hh - 11, '#999', 7.5) },
  photos(u, w, x, y, ww, hh) { R2(x, y, ww, hh, '#141418'); T2('us.jpg', x + 10, y + 5, '#ddd', 8.5); const cv = POLCV.pol1; if (cv) { const s = Math.min(ww - 30, (hh - 50) / 1.2); G.imageSmoothingEnabled = true; G.drawImage(cv, 0, 0, 256, 256, x + (ww - s) / 2, y + 22, s, s) } T2('2 years ago  ·  1 of 1', x + ww / 2, y + hh - 16, '#888', 8, 400, 'center') },
  explorer(u, w, x, y, ww, hh, B) {
    const dir = w.dir || 'Home', FILES = { Home: [['Desktop', 'folder'], ['Documents', 'folder'], ['Downloads', 'folder'], ['Pictures', 'folder'], ['Music', 'folder'], ['Videos', 'folder']], Desktop: [['notes.txt', 'txt'], ['us.jpg', 'jpg']], Documents: [['notes.txt', 'txt'], ['school', 'folder']], Downloads: [['bus_ticket.pdf', 'pdf'], ['voicemail.m4a', 'audio']], Pictures: [['us.jpg', 'jpg'], ['Screenshots', 'folder']], Music: [], Videos: [], school: [], Screenshots: [], 'Recycle Bin': [['call_her.txt', 'txt']], 'This PC': [['Local Disk (C:)', 'pc']] };
    R2(x, y, ww, hh, '#1c1c20'); R2(x, y, ww, 22, '#202024'); ['New', 'Cut', 'Copy', 'Paste', 'Sort', 'View'].forEach((n, i) => T2(n, x + 10 + i * 34, y + 6, '#bbb', 8));
    RR(x + 6, y + 24, ww - 12, 16, 4, '#2a2a30'); T2('›  ' + (dir == 'Home' ? 'Home' : 'hitori  ›  ' + dir), x + 14, y + 27, '#ddd', 8);
    R2(x, y + 44, 104, hh - 44, '#1a1a1e'); ['Home', 'Desktop', 'Downloads', 'Documents', 'Pictures', 'Music', 'Videos', 'This PC', 'Recycle Bin'].forEach((n, i) => { const by = y + 48 + i * 17, on = n == dir, hv = IN(u, x + 4, by, 96, 15); if (on || hv) RR(x + 4, by, 96, 15, 3, on ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.05)'); if (on) R2(x + 4, by + 4, 2, 7, '#4cc2ff'); ico(n == 'This PC' ? 'pc' : n == 'Recycle Bin' ? 'bin' : 'folder', x + 10, by, .8); T2(n, x + 26, by + 3, '#ddd', 8); B([x + 4, by, 96, 15], () => { w.dir = n }) });
    const list = FILES[dir] || []; if (!list.length) T2('This folder is empty.', x + 104 + (ww - 104) / 2, y + 90, '#999', 9, 400, 'center');
    list.forEach(([n, ic], i) => { const bx = x + 114 + (i % 5) * 64, by = y + 50 + Math.floor(i / 5) * 62, hv = IN(u, bx, by, 60, 58); if (hv) RR(bx, by, 60, 58, 4, 'rgba(255,255,255,.07)'); ico(ic, bx + 14, by + 4, 2); T2(fit2(n, 58, 7.5), bx + 30, by + 40, '#ddd', 7.5, 400, 'center');
      B([bx, by, 60, 58], () => { if (ic == 'folder') { w.dir = n; return } if (n == 'call_her.txt') { w.st.bin = u.t; if (!u.said.bin) { u.said.bin = 1; say3(['|A deleted note. One line, typed over and over until the file ends: "i\'m sorry i\'m sorry i\'m sorry"', 'Hitori|...Sorry for what?']) } return } if (n.includes('Disk')) return; openFile(u, n) }) });
    if (dir == 'This PC') { R2(x + 114, y + 116, 200, 6, '#3a3a40'); R2(x + 114, y + 116, 168, 6, '#4cc2ff'); T2('31.2 GB free of 237 GB', x + 114, y + 125, '#aaa', 8) }
    R2(x, y + hh - 14, ww, 14, '#202024'); T2(list.length + ' items', x + 8, y + hh - 11, '#999', 7.5) },
  settings(u, w, x, y, ww, hh, B) {
    const pg = w.st.pg || 'System'; R2(x, y, ww, hh, '#202024'); ico('user', x + 12, y + 8, 1.6); T2('hitori', x + 42, y + 10, '#fff', 9, 600); T2('Local account', x + 42, y + 21, '#aaa', 7.5);
    RR(x + 10, y + 36, 120, 15, 7, '#2c2c32'); T2('Find a setting', x + 18, y + 39, '#888', 8);
    ['System', 'Bluetooth & devices', 'Network & internet', 'Personalization', 'Apps', 'Accounts', 'Time & language', 'Gaming', 'Accessibility', 'Privacy & security', 'Windows Update'].forEach((n, i) => { const by = y + 56 + i * 18, on = n == pg, hv = IN(u, x + 8, by, 126, 16); if (on || hv) RR(x + 8, by, 126, 16, 4, on ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.05)'); if (on) R2(x + 8, by + 4, 2, 8, '#4cc2ff'); T2(n, x + 18, by + 4, '#ddd', 8); B([x + 8, by, 126, 16], () => { w.st.pg = n }) });
    const px = x + 146, pw = ww - 156; T2(pg, px, y + 10, '#fff', 15, 600);
    const rows = { System: [['Display', 'Monitors, brightness, night light'], ['Sound', 'Volume levels, output, input'], ['Notifications', 'Alerts from apps and system'], ['Focus', 'Reduce distractions'], ['Power & battery', 'Sleep, battery usage']], 'Network & internet': [['Wi-Fi', 'Not connected'], ['Ethernet', 'Network cable unplugged'], ['Airplane mode', 'Off']], Accounts: [['Your info', 'hitori · Local account'], ['Family', 'Manage your family group'], ['Other users', 'No other users on this device']], 'Windows Update': [['Updates are paused', 'Resume updates to stay up to date'], ['Last checked', '7 weeks ago']], 'Time & language': [['Date & time', new Date().toLocaleString('en-GB')], ['Language & region', 'English (United Kingdom)']], Personalization: [['Background', 'Picture'], ['Colors', 'Dark'], ['Lock screen', 'Picture']] }[pg] || [['Nothing here can change right now', 'Connect to the internet to see more settings']];
    rows.forEach(([a, b], i) => { const by = y + 36 + i * 32; RR(px, by, pw, 28, 4, '#2a2a30'); T2(a, px + 10, by + 5, '#eee', 9); T2(b, px + 10, by + 16, pg == 'Network & internet' && i < 2 ? '#ffb0b0' : '#999', 7.5); T2('›', px + pw - 12, by + 9, '#888', 10) }) },
  calc(u, w, x, y, ww, hh, B) {
    const S = w.st; S.v = S.v ?? '0'; R2(x, y, ww, hh, '#202024'); T2('Standard', x + 10, y + 4, '#fff', 10, 600); T2(S.expr || '', x + ww - 10, y + 22, '#999', 8, 400, 'right'); T2(fit2(S.v, ww - 16, 22, 600), x + ww - 10, y + 32, '#fff', 22, 600, 'right');
    const keys2 = ['%', 'CE', 'C', '⌫', '1/x', 'x²', '√', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', '.', '='], bw = (ww - 12) / 4, bh = (hh - 64) / 6;
    keys2.forEach((k, i) => { const bx = x + 4 + (i % 4) * (bw + 1), by = y + 62 + Math.floor(i / 4) * (bh + 1), r = [bx, by, bw, bh], hv = IN(u, ...r), num = /[0-9.]/.test(k); RR(...r, 3, k == '=' ? (hv ? '#3aa0f0' : '#4cc2ff') : num ? (hv ? '#3c3c42' : '#34343a') : (hv ? '#34343a' : '#2c2c32')); T2(k, bx + bw / 2, by + bh / 2 - 5, k == '=' ? '#000' : '#fff', 10, num ? 600 : 400, 'center'); B(r, () => calcKey(S, k)) }) },
  paint(u, w, x, y, ww, hh, B) {
    const S = w.st; R2(x, y, ww, hh, '#2a2a30'); R2(x, y, ww, 26, '#26262c'); const cols = ['#111', '#fff', '#e84a4a', '#ffb900', '#36c46a', '#0f6cbd', '#8a4ad8', '#7a4a2a'];
    cols.forEach((c, i) => { const r = [x + 8 + i * 15, y + 6, 13, 13]; RR(...r, 2, c, S.col == c || (!S.col && i == 0) ? '#4cc2ff' : '#555'); B(r, () => { S.col = c }) }); [2, 4, 8].forEach((sz, i) => { const r = [x + 140 + i * 18, y + 6, 15, 13]; RR(...r, 2, (S.sz || 2) == sz ? '#3a3a44' : '#2c2c32'); C2(r[0] + 7.5, r[1] + 6.5, sz / 2 + .5, '#ddd'); B(r, () => { S.sz = sz }) });
    const r = [x + 206, y + 6, 40, 13]; RR(...r, 2, IN(u, ...r) ? '#3a3a44' : '#2c2c32'); T2('Clear', r[0] + 20, y + 8, '#ddd', 8, 400, 'center'); B(r, () => { S.cv.getContext('2d').fillStyle = '#fff'; S.cv.getContext('2d').fillRect(0, 0, S.cv.width, S.cv.height) });
    // Save: hands the drawing to onPaintSave (below), then shows a little "Saved" note for a moment
    const rs = [x + 252, y + 6, 40, 13]; RR(...rs, 2, IN(u, ...rs) ? '#2a8ae0' : '#0f6cbd'); T2('Save', rs[0] + 20, y + 8, '#fff', 8, 600, 'center');
    B(rs, () => { const pw2 = Math.min(S.cv.width, Math.round(ww - 16)), ph2 = Math.min(S.cv.height, Math.round(hh - 46)), out = document.createElement('canvas'); out.width = pw2; out.height = ph2; out.getContext('2d').drawImage(S.cv, 0, 0);
      S.saves = (S.saves || 0) + 1; S.savedT = 90; beep(660, .04); try { onPaintSave({ canvas: out, dataURL: out.toDataURL('image/png'), n: S.saves, day: P2.day, ui: u }) } catch (e) { console.error(e) } });
    if (S.savedT > 0) { S.savedT--; RR(x + ww - 74, y + 6, 66, 13, 2, '#1e3a24'); T2('Saved  (' + S.saves + ')', x + ww - 41, y + 8, '#9fe0a8', 7.5, 400, 'center') }
    const px = x + 8, py = y + 32, pw = ww - 16, ph = hh - 46; if (!S.cv) { S.cv = document.createElement('canvas'); S.cv.width = 600; S.cv.height = 320; const g = S.cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 600, 320) }
    G.drawImage(S.cv, 0, 0, pw, ph, px, py, pw, ph); w.cx = px; w.cy = py; w.cw = pw; w.ch = ph; B([px, py, pw, ph], () => { }); T2(pw + ' × ' + ph + 'px', x + 8, y + hh - 12, '#999', 7.5) },
  clock(u, w, x, y, ww, hh, B) { R2(x, y, ww, hh, '#202024'); ['Focus sessions', 'Timer', 'Alarm', 'Stopwatch', 'World clock'].forEach((n, i) => { const on = i == 2; if (on) RR(x + 6, y + 8 + i * 18, 82, 16, 4, 'rgba(255,255,255,.09)'); T2(n, x + 14, y + 12 + i * 18, '#ddd', 8) });
    [['09:00', 'take meds', 'Every day', false], ['21:00', 'take meds (night)', 'Every day', false], ['07:30', 'school', 'Weekdays', false]].forEach(([t, n, d2, on], i) => { const bx = x + 100, by = y + 10 + i * 58; RR(bx, by, ww - 110, 52, 6, '#2a2a30'); T2(t, bx + 10, by + 6, on ? '#fff' : '#777', 20, 600); T2(n, bx + 10, by + 32, on ? '#ddd' : '#777', 8.5); T2(d2, bx + 10, by + 42, '#666', 7.5); RR(bx + ww - 150, by + 8, 26, 13, 7, null, '#888'); C2(bx + ww - 143, by + 14.5, 4, '#999') }) },
  calendar(u, w, x, y, ww, hh) {
    R2(x, y, ww, hh, '#202024'); const d = new Date(), m = d.getMonth(), yr = d.getFullYear(); T2(d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), x + 10, y + 6, '#fff', 12, 600);
    const first = (new Date(yr, m, 1).getDay() + 6) % 7, days = new Date(yr, m + 1, 0).getDate(), cw = (ww - 20) / 7, chh = (hh - 50) / 6;
    ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].forEach((n, i) => T2(n, x + 10 + i * cw + 4, y + 26, '#999', 7.5)); const left = Math.max(1, d.getDate() - 37 + 30);
    for (let i = 0; i < days; i++) { const c = (first + i) % 7, rr = Math.floor((first + i) / 7), bx = x + 10 + c * cw, by = y + 38 + rr * chh; R2(bx, by, cw - 1, chh - 1, '#26262c'); T2(String(i + 1), bx + 3, by + 2, i + 1 == d.getDate() ? '#4cc2ff' : '#ccc', 7.5, i + 1 == d.getDate() ? 700 : 400);
      if (i + 1 == ((d.getDate() + 3) % days) + 1 && false) { } if (i + 1 == Math.max(1, d.getDate() - 20)) { RR(bx + 2, by + 12, cw - 5, 9, 2, '#8a2a3a'); T2('she left', bx + 4, by + 13, '#fff', 6.5) } } },
  mail(u, w, x, y, ww, hh, B) { R2(x, y, ww, hh, '#1c1c20'); R2(x, y, ww, 20, '#0f6cbd'); T2('Outlook', x + 10, y + 5, '#fff', 9, 600); R2(x, y + 20, ww, 18, '#5a2020'); T2('(!)  We couldn\'t sync your account. You\'re offline.', x + 10, y + 24, '#ffd0d0', 8);
    R2(x, y + 38, 100, hh - 38, '#18181c'); ['Inbox', 'Drafts', 'Sent Items', 'Deleted Items'].forEach((n, i) => T2(n + (i == 1 ? '   1' : ''), x + 10, y + 46 + i * 16, i == 0 ? '#fff' : '#bbb', 8.5)); T2('Drafts', x + 110, y + 44, '#fff', 10, 600);
    RR(x + 108, y + 60, ww - 116, 40, 3, '#26262c'); T2('To: (no recipient)', x + 116, y + 64, '#aaa', 7.5); T2('Subject: please come home', x + 116, y + 75, '#eee', 8.5, 600); T2('i dont know where you are. i dont know who to send this to. please', x + 116, y + 87, '#999', 7.5) },
  store(u, w, x, y, ww, hh, B) { offline(u, w, x, y, ww, hh, B, 'You\'ll need the internet for this.', 'It doesn\'t look like you\'re connected. Code: 0x800704CF') },
  word(u, w, x, y, ww, hh, B) { offline(u, w, x, y, ww, hh, B, 'Sign in to activate Microsoft 365', 'We can\'t reach our servers right now.') },
  excel(u, w, x, y, ww, hh, B) { APPDRAW.word(u, w, x, y, ww, hh, B) }, ppt(u, w, x, y, ww, hh, B) { APPDRAW.word(u, w, x, y, ww, hh, B) },
  xbox(u, w, x, y, ww, hh, B) { offline(u, w, x, y, ww, hh, B, 'Can\'t connect to Xbox', 'Your friends list will be here when you\'re back online.') },
  terminal(u, w, x, y, ww, hh) { R2(x, y, ww, hh, '#0c0c0c'); ['Windows PowerShell', '', 'PS C:\\Users\\hitori> ping 8.8.8.8', 'Pinging 8.8.8.8 with 32 bytes of data:', 'General failure.', 'General failure.', 'General failure.', '', 'PS C:\\Users\\hitori> _'].forEach((l, i) => T2(l, x + 8, y + 6 + i * 11, '#ccc', 8.5)) },
  snip(u, w, x, y, ww, hh) { R2(x, y, ww, hh, '#202024'); T2('+ New', x + 14, y + 14, '#fff', 9, 600); T2('Press Windows logo key + Shift + S to start a snip.', x + 14, y + 40, '#aaa', 8) },
  media(u, w, x, y, ww, hh) { R2(x, y, ww, hh, '#1c1c20'); R2(x, y, 96, hh, '#18181c'); ['Home', 'Music library', 'Video library', 'Play queue', 'Playlists'].forEach((n, i) => T2(n, x + 10, y + 12 + i * 18, '#ccc', 8.5));
    if (w.st.err) { T2('voicemail.m4a', x + 110, y + 14, '#fff', 11, 600); RR(x + 110, y + 40, ww - 120, 40, 4, '#3a2020'); T2('Can\'t play', x + 120, y + 46, '#ffd0d0', 9, 600); T2('This file is corrupted or can\'t be played. 0xc00d36c4', x + 120, y + 60, '#d0a0a0', 7.5) }
    else { T2('Music library', x + 110, y + 14, '#fff', 11, 600); T2('Nothing here yet.', x + 110, y + 40, '#999', 8.5) }
    R2(x, y + hh - 26, ww, 26, '#26262c'); C2(x + ww / 2, y + hh - 13, 8, '#3a3a40'); G.fillStyle = '#fff'; G.beginPath(); G.moveTo(x + ww / 2 - 2.5, y + hh - 17); G.lineTo(x + ww / 2 + 3.5, y + hh - 13); G.lineTo(x + ww / 2 - 2.5, y + hh - 9); G.fill() },
  edge(u, w, x, y, ww, hh, B) { drawEdge(u, w, x, y, ww, hh, B) },
};
function calcKey(S, k) { beep(700, .01, .2);
  const num = () => parseFloat(S.v) || 0, fmt = v => { if (!isFinite(v)) return 'Cannot divide by zero'; const s = String(+v.toPrecision(12)); return s.length > 14 ? v.toExponential(6) : s };
  if (/[0-9]/.test(k)) { S.v = S.fresh || S.v == '0' || S.v.startsWith('Cannot') ? k : S.v + k; S.fresh = 0; return }
  if (k == '.') { if (S.fresh) { S.v = '0.'; S.fresh = 0 } else if (!S.v.includes('.')) S.v += '.'; return }
  if (k == 'C') { S.v = '0'; S.acc = null; S.op = null; S.expr = ''; return } if (k == 'CE') { S.v = '0'; return } if (k == '⌫') { S.v = S.v.length > 1 ? S.v.slice(0, -1) : '0'; return }
  if (k == '±') { S.v = fmt(-num()); return } if (k == '%') { S.v = fmt(num() / 100); return } if (k == '1/x') { S.v = fmt(1 / num()); S.fresh = 1; return } if (k == 'x²') { S.v = fmt(num() * num()); S.fresh = 1; return } if (k == '√') { S.v = fmt(Math.sqrt(num())); S.fresh = 1; return }
  const doOp = () => { const a = S.acc, b = num(); if (S.op == null) return b; return S.op == '+' ? a + b : S.op == '−' ? a - b : S.op == '×' ? a * b : a / b };
  if ('+−×÷'.includes(k)) { if (!S.fresh || S.op == null) S.acc = doOp(); S.op = k; S.expr = fmt(S.acc) + ' ' + k; S.v = fmt(S.acc); S.fresh = 1; return }
  if (k == '=') { if (S.op == null) return; const b = num(), r = doOp(); S.expr = fmt(S.acc) + ' ' + S.op + ' ' + fmt(b) + ' ='; S.v = fmt(r); S.acc = null; S.op = null; S.fresh = 1 }
}
// ---------------------------------------------------------------- Edge, and YouTube in it
function edgeTabs(u, w, x, y, B) {
  const yt = w.page == 'yt';
  // the tab strip sits in the title bar area (Edge draws its own)
  const ty = y; RR(x + 6, ty + 3, 150, 19, [6, 6, 0, 0], '#2c2c32'); if (yt) ico('yt', x + 12, ty + 6, .8); else ico('edge', x + 12, ty + 6, .8); T2(fit2(yt ? (w.ytp == 'watch' ? VIDS[w.vid][0] : 'YouTube') : w.page == 'pdf' ? 'bus_ticket.pdf' : w.page == 'cant' ? 'Hmm… can\'t reach this page' : 'New tab', 116, 8), x + 30, ty + 8, '#ddd', 8); T2('✕', x + 146, ty + 8, '#999', 7, 400, 'center');
  T2('+', x + 168, ty + 5, '#bbb', 12); B([x + 160, ty + 3, 18, 18], () => { w.page = 'newtab'; w.addr = ''; u.focus = { o: w, k: 'addr', enter: () => edgeGo(u, w) } });
}
function drawEdge(u, w, x, y, ww, hh, B) {
  // the toolbar: back, forward, refresh, the address bar
  R2(x, y, ww, 24, '#2c2c32'); T2('←', x + 14, y + 5, '#ddd', 11, 400, 'center'); T2('→', x + 34, y + 5, '#666', 11, 400, 'center'); T2('↻', x + 54, y + 5, '#ddd', 11, 400, 'center');
  B([x + 6, y + 2, 18, 20], () => { if (w.page != 'yt') { w.page = 'yt'; return } if (w.ytp != 'home') w.ytp = 'home' });
  const url = w.page == 'yt' ? 'https://www.youtube.com' + (w.ytp == 'watch' ? '/watch?v=' + ['r4in8xQ', 'w4k3Up1', 'st3p5zz', 'l0f1L3f', 's1st3rz', 'dr34mzz'][w.vid] : w.ytp == 'results' ? '/results?search_query=' + encodeURIComponent(w.q || '').replace(/%20/g, '+') : '') : w.page == 'pdf' ? 'file:///C:/Users/hitori/Downloads/bus_ticket.pdf' : w.page == 'cant' ? w.addr : '';
  const ab = [x + 66, y + 3, ww - 110, 18]; RR(...ab, 9, '#1e1e24'); if (url.startsWith('https')) { G.strokeStyle = '#aaa'; G.lineWidth = 1; G.strokeRect(x + 75, y + 10, 5, 4); G.beginPath(); G.arc(x + 77.5, y + 10, 2, 3.14, 6.28); G.stroke() }
  const fa = u.focus && u.focus.o == w && u.focus.k == 'addr'; T2(fa ? w.addr : url || 'Search or enter web address', x + 86, y + 7, fa || url ? '#ddd' : '#888', 8.5); if (fa && (u.t >> 4) % 2) R2(x + 86 + TW2(w.addr, 8.5) + 1, y + 6, 1, 11, '#ddd');
  B(ab, () => { w.addr = ''; u.focus = { o: w, k: 'addr', enter: () => edgeGo(u, w) } });
  T2('☆', x + ww - 38, y + 6, '#ccc', 10, 400, 'center'); T2('···', x + ww - 16, y + 4, '#ccc', 11, 400, 'center');
  const px = x, py = y + 24, pw = ww, ph = hh - 24;
  if (w.page == 'newtab') { R2(px, py, pw, ph, '#1a1a1e'); RR(px + pw / 2 - 140, py + 60, 280, 24, 12, '#2c2c32'); ico('search', px + pw / 2 - 130, py + 64, .9); T2('Search the web', px + pw / 2 - 112, py + 67, '#999', 9); B([px + pw / 2 - 140, py + 60, 280, 24], () => { w.addr = ''; u.focus = { o: w, k: 'addr', enter: () => edgeGo(u, w) } });
    [['YouTube', 'yt'], ['Outlook', 'mail'], ['Store', 'store']].forEach(([n, ic], i) => { const bx = px + pw / 2 - 90 + i * 64, by = py + 110; RR(bx, by, 52, 52, 6, IN(u, bx, by, 52, 52) ? '#34343a' : '#2a2a30'); ico(ic, bx + 18, by + 10, 1); T2(n, bx + 26, by + 34, '#ccc', 7.5, 400, 'center'); B([bx, by, 52, 52], () => { if (ic == 'yt') { w.page = 'yt'; w.ytp = 'home' } else { w.page = 'cant'; w.addr = n.toLowerCase() + '.com' } }) }); return }
  if (w.page == 'cant') { R2(px, py, pw, ph, '#1a1a1e'); T2('Hmm… can\'t reach this page', px + 40, py + 50, '#fff', 15, 600); T2('Check if there is a typo in ' + w.addr + '.', px + 40, py + 76, '#ccc', 9); T2('If spelling is correct, try running Windows Network Diagnostics.', px + 40, py + 90, '#ccc', 9); T2('DNS_PROBE_FINISHED_NO_INTERNET', px + 40, py + 112, '#888', 8); return }
  if (w.page == 'pdf') { R2(px, py, pw, ph, '#3a3a40'); R2(px + pw / 2 - 90, py + 10, 180, ph - 10, '#fff'); T2('COACH TICKET — SINGLE', px + pw / 2, py + 22, '#111', 10, 700, 'center'); ['Passenger: H. (1 adult)', 'From: Home, Stop 4', 'To: (one way)', 'Departs: 06:00', 'Return: —', '', 'Booked from this computer, 6 weeks ago.'].forEach((l, i) => T2(l, px + pw / 2 - 80, py + 44 + i * 13, '#333', 8.5));
    if (!u.said.pdf) { u.said.pdf = 1; say3(['Hitori|A one-way ticket. I didn\'t buy this.', 'Hitori|..."H." That\'s me. Isn\'t it?']) } return }
  drawYT(u, w, px, py, pw, ph, B);
}
function edgeGo(u, w) { const a = w.addr.trim().toLowerCase(); u.focus = null; if (!a) return; if (a.includes('youtube') || a.includes('yt')) { w.page = 'yt'; w.ytp = 'home' } else { w.page = 'cant'; w.addr = a } }
function drawYT(u, w, x, y, ww, hh, B) {
  R2(x, y, ww, hh, '#0f0f0f');
  // header: menu, logo, search, mic, create, bell, avatar
  for (let i = 0; i < 3; i++) R2(x + 10, y + 8 + i * 4, 12, 1.5, '#fff'); ico('yt', x + 30, y + 3, 1); T2('YouTube', x + 49, y + 6, '#fff', 11, 700); T2('EE', x + 99, y + 4, '#aaa', 5.5);
  const sb = [x + ww / 2 - 120, y + 4, 210, 18], sf = u.focus && u.focus.o == w && u.focus.k == 'search';
  RR(...sb, 9, '#121212', sf ? '#1c62b9' : '#303030'); RR(sb[0] + 210, y + 4, 34, 18, [0, 9, 9, 0], '#222', '#303030'); ico('search', sb[0] + 219, y + 5, .8); C2(sb[0] + 262, y + 13, 9, '#222'); R2(sb[0] + 260, y + 8, 4, 7, '#fff'); R2(sb[0] + 258, y + 15, 8, 1, '#fff');
  T2(w.search || 'Search', sb[0] + 10, y + 8, w.search ? '#fff' : '#888', 8.5); if (sf && (u.t >> 4) % 2) R2(sb[0] + 10 + TW2(w.search, 8.5) + 1, y + 7, 1, 11, '#fff');
  B(sb, () => { u.focus = { o: w, k: 'search', enter: () => ytSearch(u, w) }; w.drop = 1; if (!P2.f.history && !u.histT) u.histT = u.t });
  B([sb[0] + 210, y + 4, 34, 18], () => ytSearch(u, w));
  T2('+', x + ww - 58, y + 3, '#fff', 13); ico('bell', x + ww - 42, y + 5, .9); RR(x + ww - 34, y + 3, 9, 7, 3, '#cc0000'); T2('9+', x + ww - 29.5, y + 3.5, '#fff', 5.5, 700, 'center'); C2(x + ww - 14, y + 13, 7, '#7a4a6a'); T2('h', x + ww - 14, y + 8, '#fff', 8, 600, 'center');
  // sidebar
  const sbw = 80; [['Home', w.ytp == 'home'], ['Shorts'], ['Subscriptions'], null, ['You  ›'], ['History'], ['Playlists'], ['Watch later'], ['Liked videos'], null, ['Subscriptions'], ['quiet rooms'], ['lofi rooms']].forEach((it, i) => { const by = y + 30 + i * 15; if (!it) { R2(x + 8, by + 6, sbw - 14, 1, '#272727'); return } if (it[1]) RR(x + 6, by - 1, sbw - 10, 14, 5, '#272727'); T2(it[0], x + 14, by + 2, '#f1f1f1', 7.5, it[1] ? 600 : 400); if (i == 0) B([x + 6, by - 1, sbw - 10, 14], () => { w.ytp = 'home' }) });
  const cx = x + sbw + 6, cw = ww - sbw - 12; w.drop = w.drop && sf;
  if (w.ytp == 'home' || w.ytp == 'results') {
    if (w.ytp == 'home') { let chx = cx; ['All', 'Music', 'Mixes', 'Lo-fi', 'Live', 'Ambient', 'Podcasts', 'Recently uploaded', 'New to you'].forEach((n, i) => { const tw = TW2(n, 7.5, 600) + 14; if (chx + tw > cx + cw) return; RR(chx, y + 28, tw, 14, 5, i == 0 ? '#f1f1f1' : '#272727'); T2(n, chx + 7, y + 31, i == 0 ? '#0f0f0f' : '#f1f1f1', 7.5, 600); chx += tw + 5 }) }
    else { T2('Showing results for ' + (w.q || ''), cx, y + 30, '#aaa', 8); T2('Did you mean: ', cx, y + 42, '#aaa', 8); T2('where did she go', cx + 56, y + 42, '#3ea6ff', 8, 600); B([cx + 56, y + 40, 70, 12], () => { w.search = 'where did she go'; ytSearch(u, w) }) }
    const order = w.ytp == 'home' ? [0, 1, 2, 3, 4, 5] : [4, 1, 2], cols = 3, tw2 = (cw - 2 * 8) / 3, th2 = tw2 * .56;
    order.forEach((k, i) => { const c = i % cols, rr = Math.floor(i / cols), bx = cx + c * (tw2 + 8), by = y + 52 + rr * (th2 + 44); thumb(k, bx, by, tw2, th2, u.t); C2(bx + 8, by + th2 + 12, 7, ['#3a6a8a', '#8a6a4a', '#5a2a2a', '#6a4a8a', '#8a5a3a', '#3a5a8a'][k]);
      G.save(); G.beginPath(); G.rect(bx + 18, by + th2 + 2, tw2 - 18, 40); G.clip(); const words = VIDS[k][0].split(' '); let l1 = '', l2 = ''; for (const wd of words) { if (!l2 && TW2(l1 + ' ' + wd, 8, 600) < tw2 - 22) l1 = (l1 + ' ' + wd).trim(); else l2 = (l2 + ' ' + wd).trim() }
      T2(l1, bx + 19, by + th2 + 4, '#f1f1f1', 8, 600); T2(fit2(l2, tw2 - 22, 8, 600), bx + 19, by + th2 + 14, '#f1f1f1', 8, 600); T2(VIDS[k][1], bx + 19, by + th2 + 25, '#aaa', 7); T2(VIDS[k][2] + ' • ' + VIDS[k][3], bx + 19, by + th2 + 33, '#aaa', 7); G.restore();
      B([bx, by, tw2, th2 + 40], () => { w.ytp = 'watch'; w.vid = k; w.vt = 0; if (k == 4 && !u.said.v4) { u.said.v4 = 1; say3(['Hitori|...', 'Hitori|Why does that make me want to cry.']) } }) });
  }
  if (w.ytp == 'watch') {
    const k = w.vid, pw = Math.min(cw - 130, 330), ph = pw * .5625, px = cx, py = y + 28; w.vt = (w.vt || 0) + 1; R2(px, py, pw, ph, '#000');
    if (w.vt < 110) thumb(k, px, py, pw, ph, u.t); else { for (let i = 0; i < 700; i++) { const g = Math.random() * 255 | 0; R2(px + Math.random() * pw, py + Math.random() * ph, 2, 2, 'rgb(' + g + ',' + g + ',' + g + ')') } R2(px, py + ph / 2 - 16, pw, 32, 'rgba(0,0,0,.85)'); T2('Video unavailable', px + pw / 2, py + ph / 2 - 11, '#fff', 10, 600, 'center'); T2('This video has been removed by the uploader', px + pw / 2, py + ph / 2 + 2, '#aaa', 8, 400, 'center') }
    R2(px, py + ph - 3, pw, 2, 'rgba(255,255,255,.25)'); R2(px, py + ph - 3, pw * Math.min(1, w.vt / 110) * .2, 2, '#ff0033'); C2(px + pw * Math.min(1, w.vt / 110) * .2, py + ph - 2, 3, '#ff0033');
    G.fillStyle = '#fff'; G.beginPath(); G.moveTo(px + 8, py + ph - 14); G.lineTo(px + 15, py + ph - 10); G.lineTo(px + 8, py + ph - 6); G.fill(); T2('0:' + String(Math.min(59, w.vt >> 4)).padStart(2, '0') + ' / ' + VIDS[k][4], px + 36, py + ph - 14, '#fff', 7.5);
    T2(fit2(VIDS[k][0], pw, 10.5, 700), px, py + ph + 6, '#f1f1f1', 10.5, 700); C2(px + 8, py + ph + 30, 8, '#5a4a6a'); T2(VIDS[k][1], px + 20, py + ph + 24, '#f1f1f1', 8.5, 600); T2('48.2K subscribers', px + 20, py + ph + 34, '#aaa', 7);
    RR(px + 96, py + ph + 24, 48, 16, 8, '#f1f1f1'); T2('Subscribe', px + 120, py + ph + 28, '#0f0f0f', 7.5, 700, 'center'); RR(px + pw - 116, py + ph + 24, 60, 16, 8, '#272727'); T2('▲ 12K  |  ▼', px + pw - 86, py + ph + 28, '#f1f1f1', 7, 600, 'center'); RR(px + pw - 52, py + ph + 24, 52, 16, 8, '#272727'); T2('↗ Share', px + pw - 26, py + ph + 28, '#f1f1f1', 7, 600, 'center');
    RR(px, py + ph + 46, pw, 26, 6, '#272727'); T2(VIDS[k][2] + '  ' + VIDS[k][3], px + 8, py + ph + 50, '#f1f1f1', 7.5, 600); T2('Comments are turned off.', px + 8, py + ph + 61, '#aaa', 7.5);
    VIDS.map((v, i) => i).filter(i => i != k).slice(0, 5).forEach((i, n) => { const bx = px + pw + 10, by = py + n * 44, tw = 70; thumb(i, bx, by, tw, 39, u.t); G.save(); G.beginPath(); G.rect(bx + tw + 4, by, cw - pw - tw - 16, 40); G.clip(); T2(VIDS[i][0], bx + tw + 4, by + 1, '#f1f1f1', 7.5, 600); T2(VIDS[i][1], bx + tw + 4, by + 12, '#aaa', 7); T2(VIDS[i][2], bx + tw + 4, by + 21, '#aaa', 7); G.restore(); B([bx, by, cw - pw - 12, 40], () => { w.vid = i; w.vt = 0 }) });
  }
  // the search history under the box
  if (w.drop) { const dx = sb[0], dy = sb[1] + 20, n = HISTORY.length; G.save(); G.shadowColor = 'rgba(0,0,0,.6)'; G.shadowBlur = 12; RR(dx, dy, 244, 8 + n * 17, 8, '#222'); G.restore();
    HISTORY.forEach((h, i) => { const by = dy + 4 + i * 17, hv = IN(u, dx, by, 244, 17); if (hv) R2(dx + 1, by, 242, 17, '#383838'); G.strokeStyle = '#aaa'; G.lineWidth = 1; G.beginPath(); G.arc(dx + 13, by + 8.5, 4, 0, 7); G.moveTo(dx + 13, by + 8.5); G.lineTo(dx + 13, by + 6); G.moveTo(dx + 13, by + 8.5); G.lineTo(dx + 15, by + 9.5); G.stroke();
      T2(fit2(h, 190, 8, 600), dx + 24, by + 4, '#d0b8ff', 8, 600); T2('Remove', dx + 236, by + 4, '#3ea6ff', 7, 400, 'right'); B([dx, by, 200, 17], () => { w.search = h; ytSearch(u, w) }); B([dx + 200, by, 44, 17], () => { beep(250, .1); T2('', 0, 0) }) }) }
}
function ytSearch(u, w) { if (!w.search.trim()) return; w.ytp = 'results'; w.q = w.search; w.drop = 0; u.focus = null; beep(700, .04) }

// ================================================================ Paint: saving a drawing
// Called whenever the player clicks Save in Paint. d = { canvas, dataURL (PNG), n (how many times saved), day, ui }.
// Left empty on purpose: put what saving a picture should do here.
function onPaintSave(d) {
  P2.lastDrawing = d.dataURL;   // kept so other code can use the last picture saved
}
