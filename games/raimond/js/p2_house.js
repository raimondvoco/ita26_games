// ==================== PART TWO: the house ====================
// Two storeys, 12 m x 10 m. Ground floor (y 0): hall with the stairs and the front door, living room (west),
// kitchen (east), a little bathroom and a back corridor and a storage room along the north side.
// Upstairs (y 3): Hitori's room (the room from the title screen), her sister's room, a bathroom and the parents' room.
// The furniture comes from p2_models.js.
// windows and frames are several pieces: keep them together as one object when they're moved onto the new plan
(function () { for (const nm of ['mWindow', 'mFrame']) { const f = window[nm]; if (!f) continue; window[nm] = function (mb, ...a) { return mb.with(M4ID, () => f(mb, ...a)) } } })();
const POLCV = {};
// ---------------------------------------------------------------- textures
const TEXSEED = 7;
function texAll() {
  if (TX.wall) return;
  tex('wall', 64, (g, s) => { texNoise(g, s, '#6a6e78', .14, 1, 2); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(30,30,40,.06)'; g.fillRect(i * 11 + 3, 0, 3, s) } });
  tex('wallp', 64, (g, s) => { texNoise(g, s, '#7a7468', .12, 2, 2); for (let x = 0; x < s; x += 16) { g.fillStyle = 'rgba(90,70,60,.25)'; g.fillRect(x, 0, 6, s); g.fillStyle = 'rgba(255,240,220,.05)'; g.fillRect(x + 8, 0, 2, s) } });
  tex('floor', 64, (g, s) => { texNoise(g, s, '#4a3424', .16, 3, 2); for (let y = 0; y < s; y += 16) { g.fillStyle = '#26180e'; g.fillRect(0, y, s, 1); g.fillRect((y * 2.3 | 0) % s, y, 1, 16) } for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(20,10,0,.18)'; g.fillRect((i * 37) % s, (i * 13) % s, 8, 1) } });
  tex('ceil', 32, (g, s) => texNoise(g, s, '#8a8a8e', .1, 4, 2));
  tex('tile', 64, (g, s) => { g.fillStyle = '#6a6a64'; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 16) for (let x = 0; x < s; x += 16) { g.fillStyle = (x + y) % 32 ? '#c8c8bc' : '#bcbcb0'; g.fillRect(x + 1, y + 1, 15, 15); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 2, y + 2, 6, 1) } });
  tex('tilef', 64, (g, s) => { for (let y = 0; y < s; y += 16) for (let x = 0; x < s; x += 16) { g.fillStyle = (x + y) % 32 ? '#5a5a58' : '#8a8a84'; g.fillRect(x, y, 16, 16) } texNoiseOver(g, s, .08, 5) });
  tex('carpet', 64, (g, s) => { texNoise(g, s, '#3a2a30', .18, 6, 1); g.strokeStyle = '#5a3a40'; g.lineWidth = 3; g.strokeRect(6, 6, s - 12, s - 12) });
  tex('stairc', 32, (g, s) => texNoise(g, s, '#4a2a2a', .2, 7, 1));
  tex('wood', 64, (g, s) => { texNoise(g, s, '#6a4a2e', .12, 8, 1); for (let y = 0; y < s; y += 3) { g.fillStyle = 'rgba(40,24,10,' + (.1 + (y * 7 % 5) * .03) + ')'; g.fillRect(0, y, s, 1) } });
  tex('dwood', 64, (g, s) => { texNoise(g, s, '#3a2618', .12, 9, 1); for (let y = 0; y < s; y += 4) { g.fillStyle = 'rgba(10,5,0,.18)'; g.fillRect(0, y, s, 1) } });
  tex('door', 64, (g, s) => { texNoise(g, s, '#5a3e28', .1, 10, 1); g.strokeStyle = '#2a1a10'; g.lineWidth = 2; g.strokeRect(10, 6, 44, 22); g.strokeRect(10, 36, 44, 22); g.fillStyle = '#c8a860'; g.fillRect(50, 30, 6, 3) });
  tex('wardrobe', 64, (g, s) => { texNoise(g, s, '#5a3a22', .1, 11, 1); g.fillStyle = '#1a0e06'; g.fillRect(31, 0, 2, s); g.strokeStyle = '#2a1a10'; g.lineWidth = 1; g.strokeRect(4, 4, 24, 56); g.strokeRect(36, 4, 24, 56); g.fillStyle = '#9a8050'; g.fillRect(27, 30, 2, 6); g.fillRect(35, 30, 2, 6) });
  tex('blinds', 32, (g, s) => { g.fillStyle = '#121624'; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 4) { g.fillStyle = '#7a7a80'; g.fillRect(0, y, s, 3); g.fillStyle = '#5a5a60'; g.fillRect(0, y + 2, s, 1) } });
  tex('night', 64, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#0a0e1e'); gr.addColorStop(1, '#1a2238'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#05070e'; g.fillRect(0, 44, s, 20); for (const [x, w, h] of [[2, 10, 14], [16, 8, 20], [30, 14, 10], [48, 12, 16]]) g.fillRect(x, 44 - h, w, h); g.fillStyle = '#e8c070'; g.fillRect(19, 30, 2, 2); g.fillRect(52, 34, 2, 2); g.fillStyle = '#2a2a3a'; g.fillRect(0, 0, s, 2); g.fillRect(0, 31, s, 2); g.fillRect(0, 0, 2, s); g.fillRect(31, 0, 2, s); g.fillRect(62, 0, 2, s); g.fillRect(0, 62, s, 2) });
  tex('metal', 32, (g, s) => texNoise(g, s, '#8a8e94', .1, 12, 1));
  tex('fridge', 64, (g, s) => { texNoise(g, s, '#c8c8c0', .05, 13, 2); g.fillStyle = '#9a9a94'; g.fillRect(0, 22, s, 1); g.fillStyle = '#6a6a6a'; g.fillRect(52, 8, 3, 10); g.fillRect(52, 28, 3, 16);
    // a photo of a cat stuck on with a magnet, and a note under it
    g.fillStyle = '#f4f0e4'; g.fillRect(10, 28, 18, 20); g.fillStyle = '#2a2a30'; g.fillRect(12, 30, 14, 12); g.fillStyle = '#e8e0d0'; g.fillRect(15, 35, 8, 6); g.fillRect(15, 33, 2, 3); g.fillRect(21, 33, 2, 3); g.fillStyle = '#e83a3a'; g.fillRect(17, 26, 4, 3); g.fillStyle = '#fffaa0'; g.fillRect(30, 30, 14, 12); g.fillStyle = '#5a5a7a'; for (let i = 0; i < 3; i++) g.fillRect(32, 33 + i * 3, 10 - i * 2, 1) });
  tex('counter', 32, (g, s) => texNoise(g, s, '#4a4a4c', .2, 14, 1));
  tex('cabinet', 64, (g, s) => { texNoise(g, s, '#8a7a62', .08, 15, 1); g.strokeStyle = '#4a3a2a'; g.strokeRect(3, 3, 26, 58); g.strokeRect(35, 3, 26, 58); g.fillStyle = '#3a3a3a'; g.fillRect(26, 10, 2, 8); g.fillRect(37, 10, 2, 8) });
  tex('stove', 64, (g, s) => { g.fillStyle = '#1a1a1c'; g.fillRect(0, 0, s, s); for (const [x, y] of [[16, 16], [48, 16], [16, 48], [48, 48]]) { g.strokeStyle = '#4a4a4c'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 10, 0, 7); g.stroke() } });
  tex('sink', 64, (g, s) => { g.fillStyle = '#9a9ea4'; g.fillRect(0, 0, s, s); g.fillStyle = '#5a5e64'; g.fillRect(8, 8, 48, 48); g.fillStyle = '#3a3e44'; g.fillRect(30, 30, 4, 4) });
  tex('sheet', 64, (g, s) => { texNoise(g, s, '#5a5a6a', .12, 16, 2); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, i * 11 + 3, s, 2) } });
  tex('pillow', 32, (g, s) => texNoise(g, s, '#b8b4ac', .1, 17, 2));
  tex('fabric', 64, (g, s) => { texNoise(g, s, '#4a3a40', .2, 18, 1) });
  tex('beige', 32, (g, s) => texNoise(g, s, '#a8a090', .08, 19, 1));
  tex('dark', 8, (g, s) => { g.fillStyle = '#121014'; g.fillRect(0, 0, s, s) });
  tex('black', 8, (g, s) => { g.fillStyle = '#000'; g.fillRect(0, 0, s, s) });
  tex('crt', 64, (g, s) => { g.fillStyle = '#060a10'; g.fillRect(0, 0, s, s); g.fillStyle = '#1a3050'; g.fillRect(6, 6, 52, 40); g.fillStyle = '#4a7ab0'; g.fillRect(6, 40, 52, 6); for (let i = 0; i < 6; i++) { g.fillStyle = '#9ac0ff'; g.fillRect(10, 10 + i * 5, 4, 3) } g.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < s; y += 2) g.fillRect(0, y, s, 1) });
  tex('tvstatic', 64, (g, s) => texNoise(g, s, '#404040', .9, 20, 2));
  tex('poster', 64, (g, s) => { g.fillStyle = '#1a1214'; g.fillRect(0, 0, s, s); for (const [x, y] of [[18, 22], [44, 22], [30, 44]]) { g.fillStyle = '#c8b8a8'; g.beginPath(); g.ellipse(x, y, 8, 10, 0, 0, 7); g.fill(); g.fillStyle = '#000'; g.fillRect(x - 4, y - 2, 3, 3); g.fillRect(x + 1, y - 2, 3, 3); g.fillRect(x - 2, y + 4, 4, 2) } g.fillStyle = '#a01818'; g.fillRect(6, 56, 52, 4) });
  tex('painting', 64, (g, s) => { g.fillStyle = '#3a2a1a'; g.fillRect(0, 0, s, s); g.fillStyle = '#1a2440'; g.fillRect(5, 5, 54, 54); g.fillStyle = '#0a0e1a'; for (const [x, w, h] of [[8, 10, 30], [20, 8, 40], [30, 12, 24], [44, 10, 34]]) g.fillRect(x, 59 - h, w, h); g.fillStyle = '#e8c070'; for (let i = 0; i < 14; i++) g.fillRect(9 + (i * 17) % 44, 30 + (i * 11) % 24, 1, 1) });
  tex('lamp', 32, (g, s) => { g.fillStyle = '#f4e4c0'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(200,160,100,.4)'; g.fillRect(0, s - 6, s, 6) });
  tex('bulb', 8, (g, s) => { g.fillStyle = '#fff8e0'; g.fillRect(0, 0, s, s) });
  tex('pills', 32, (g, s) => { g.fillStyle = '#c87818'; g.fillRect(0, 0, s, s); g.fillStyle = '#f4f0e8'; g.fillRect(0, 0, s, 7); g.fillRect(3, 12, 26, 14); g.fillStyle = '#3a3a5a'; for (let i = 0; i < 4; i++) g.fillRect(5, 14 + i * 3, 22 - i * 4, 1) });
  tex('phone', 32, (g, s) => { g.fillStyle = '#0a0a0e'; g.fillRect(0, 0, s, s); g.fillStyle = '#1a2a40'; g.fillRect(3, 3, 26, 26) });
  tex('phonebroken', 32, (g, s) => { g.fillStyle = '#0a0a0e'; g.fillRect(0, 0, s, s); g.fillStyle = '#1a1a24'; g.fillRect(3, 3, 26, 26); g.strokeStyle = '#a8b0c0'; g.lineWidth = 1; g.beginPath(); g.moveTo(16, 12); g.lineTo(4, 4); g.moveTo(16, 12); g.lineTo(28, 8); g.moveTo(16, 12); g.lineTo(10, 28); g.moveTo(16, 12); g.lineTo(26, 26); g.stroke() });
  tex('books', 64, (g, s) => { g.fillStyle = '#1a1210'; g.fillRect(0, 0, s, s); const R = rng(21); for (let row = 0; row < 4; row++) { let x = 1; while (x < s - 4) { const w = 3 + (R() * 4 | 0); g.fillStyle = ['#6a2a2a', '#2a4a6a', '#5a5a3a', '#3a3a3a', '#7a6a4a'][R() * 5 | 0]; g.fillRect(x, row * 16 + 2 + (R() * 3 | 0), w, 14); x += w + 1 } } });
  tex('controller', 32, (g, s) => { g.fillStyle = '#c8c4bc'; g.fillRect(0, 0, s, s); g.fillStyle = '#3a3a3a'; g.fillRect(6, 12, 6, 2); g.fillRect(8, 10, 2, 6); g.fillStyle = '#c83a3a'; g.fillRect(22, 10, 3, 3); g.fillStyle = '#3a6ac8'; g.fillRect(19, 14, 3, 3) });
  tex('gamecase', 32, (g, s) => { g.fillStyle = '#1a1a1a'; g.fillRect(0, 0, s, s); g.fillStyle = '#6a2a4a'; g.fillRect(3, 3, 26, 18); g.fillStyle = '#e8e8e8'; g.fillRect(3, 24, 26, 3) });
  tex('porcelain', 32, (g, s) => texNoise(g, s, '#d8d8d4', .05, 22, 2));
  tex('mirror', 32, (g, s) => { const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, '#2a3038'); gr.addColorStop(.5, '#4a5058'); gr.addColorStop(1, '#1a1e24'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(4, 2, 2, 28); g.fillRect(8, 2, 1, 28) });
  tex('box', 32, (g, s) => { texNoise(g, s, '#8a6a42', .1, 23, 1); g.fillStyle = '#6a4a2a'; g.fillRect(0, 14, s, 3) });
  tex('boxname', 32, (g, s) => { texNoise(g, s, '#8a6a42', .1, 23, 1); g.fillStyle = '#6a4a2a'; g.fillRect(0, 14, s, 3); g.strokeStyle = '#111'; g.lineWidth = 1.5; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(5 + i, 22 + (i % 2) * 4); g.lineTo(27 - i, 24 + ((i + 1) % 2) * 3); g.stroke() } });
  tex('mattress', 32, (g, s) => { texNoise(g, s, '#a8a49a', .1, 24, 2); g.fillStyle = 'rgba(0,0,0,.15)'; for (let i = 0; i < 4; i++) g.fillRect(0, i * 8 + 4, s, 1) });
  tex('ghostwall', 64, (g, s) => { texNoise(g, s, '#6a6e78', .14, 1, 2); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(8, 10, 20, 28); g.fillRect(36, 6, 18, 22) });   // paler patches where posters used to hang
  tex('siding', 32, (g, s) => { texNoise(g, s, '#5a6068', .1, 25, 1); for (let y = 0; y < s; y += 6) { g.fillStyle = '#3a4048'; g.fillRect(0, y, s, 1) } });
  tex('roof', 32, (g, s) => { texNoise(g, s, '#2a2224', .2, 26, 1); for (let y = 0; y < s; y += 5) { g.fillStyle = '#141012'; g.fillRect(0, y, s, 1) } });
  tex('grass', 32, (g, s) => texNoise(g, s, '#1a2418', .3, 27, 1));
  tex('bark', 32, (g, s) => { texNoise(g, s, '#2a1e16', .2, 28, 1); for (let x = 0; x < s; x += 4) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, 0, 1, s) } });
  tex('leaves', 32, (g, s) => texNoise(g, s, '#0e1a12', .35, 29, 2));
  tex('litwin', 32, (g, s) => { g.fillStyle = '#c8a060'; g.fillRect(0, 0, s, s); g.fillStyle = '#5a4020'; g.fillRect(0, 15, s, 2); g.fillRect(15, 0, 2, s); g.fillStyle = 'rgba(0,0,0,.4)'; for (let y = 0; y < s; y += 3) g.fillRect(0, y, s, 1) });
  tex('felt', 64, (g, s) => { texNoise(g, s, '#1e3226', .2, 30, 1); g.strokeStyle = 'rgba(200,190,150,.18)'; g.lineWidth = 1; g.beginPath(); g.arc(32, 64, 40, 3.5, 5.9); g.stroke() });
  tex('suit', 32, (g, s) => texNoise(g, s, '#14121a', .15, 31, 1));
  tex('skin', 16, (g, s) => texNoise(g, s, '#b8a49a', .08, 32, 1));
  tex('chips', 16, (g, s) => { g.fillStyle = '#8a1a1a'; g.fillRect(0, 0, s, s); g.fillStyle = '#e8e0d0'; g.fillRect(0, 4, s, 2); g.fillRect(0, 10, s, 2) });
  tex('cardback', 32, (g, s) => { g.fillStyle = '#e8e0d0'; g.fillRect(0, 0, s, s); g.fillStyle = '#5a1018'; g.fillRect(2, 2, s - 4, s - 4); g.strokeStyle = '#a83a3a'; for (let i = -s; i < s; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + s, s); g.stroke() } });
  tex('dealerface', 32, (g, s) => drawBlurFace(g, s, 0));
  tex('eyes', 32, (g, s) => { g.clearRect(0, 0, s, s); for (const x of [8, 24]) { g.fillStyle = '#e8e4dc'; g.beginPath(); g.ellipse(x, 16, 6, 4, 0, 0, 7); g.fill(); g.fillStyle = '#7a0a0a'; g.beginPath(); g.arc(x, 16, 2.6, 0, 7); g.fill(); g.fillStyle = '#000'; g.fillRect(x - 1, 15, 2, 2) } });
  tex('shadowfig', 64, (g, s) => { g.clearRect(0, 0, s, s); g.fillStyle = '#020203'; g.beginPath(); g.ellipse(32, 10, 7, 9, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(20, 20); g.quadraticCurveTo(32, 15, 44, 20); g.lineTo(46, 64); g.lineTo(18, 64); g.closePath(); g.fill(); g.fillRect(14, 22, 5, 30); g.fillRect(45, 22, 5, 30);
    for (let i = 0; i < 40; i++) { g.clearRect(16 + Math.random() * 32, 50 + Math.random() * 14, 2, 2) } });
}
function texNoiseOver(g, s, amt, seed) { const R = rng(seed); for (let y = 0; y < s; y += 2) for (let x = 0; x < s; x += 2) { const v = (R() - .5) * amt; g.fillStyle = v > 0 ? 'rgba(255,255,255,' + v + ')' : 'rgba(0,0,0,' + (-v) + ')'; g.fillRect(x, y, 2, 2) } }
// a face hidden under big shifting mosaic blocks
function drawBlurFace(g, s, t) { g.fillStyle = '#2a2420'; g.fillRect(0, 0, s, s); const R = rng(100 + (t | 0)); const b = 6;
  for (let y = 0; y < s; y += b) for (let x = 0; x < s; x += b) { const dx = x - 16, dy = y - 14, inF = dx * dx / 120 + dy * dy / 200 < 1; let v = inF ? 150 + R() * 50 : 30 + R() * 20; if (inF && (y > 8 && y < 16) && R() < .4) v -= 70; g.fillStyle = 'rgb(' + (v | 0) + ',' + (v * .9 | 0) + ',' + (v * .85 | 0) + ')'; g.fillRect(x, y, b, b) } }

// better plaster, planks and tiles than before (the old ones were tiny and smeared across whole walls)
function texUpgrade() {
  tex('wall', 128, (g, s) => { texNoise(g, s, '#6c7079', .07, 1, 2); const R = rng(91); for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(' + (R() < .5 ? '255,255,255' : '0,0,10') + ',.025)'; g.fillRect(R() * s, R() * s, 6 + R() * 18, 3 + R() * 10) } });
  tex('wallp', 128, (g, s) => { texNoise(g, s, '#7c7468', .07, 2, 2); for (let x = 0; x < s; x += 32) { g.fillStyle = 'rgba(90,64,56,.2)'; g.fillRect(x, 0, 10, s); g.fillStyle = 'rgba(255,240,220,.06)'; g.fillRect(x + 14, 0, 3, s); for (let y = 8; y < s; y += 24) { g.fillStyle = 'rgba(120,90,70,.22)'; g.beginPath(); g.arc(x + 24, y + (x / 32 % 2) * 12, 3, 0, 7); g.fill() } } });
  tex('floor', 128, (g, s) => { texNoise(g, s, '#55392a', .08, 3, 1); const R = rng(92); for (let y = 0; y < s; y += 16) { const sh = R() * .12; g.fillStyle = 'rgba(' + (R() < .5 ? '0,0,0' : '255,220,180') + ',' + sh * .5 + ')'; g.fillRect(0, y, s, 16); g.fillStyle = '#24160c'; g.fillRect(0, y, s, 1); const j = (R() * s) | 0; g.fillRect(j, y, 1, 16); for (let k = 0; k < 5; k++) { g.fillStyle = 'rgba(30,16,6,.18)'; g.fillRect(0, y + 3 + k * 3, s, 1) } } });
  tex('tilef', 64, (g, s) => { for (let y = 0; y < s; y += 16) for (let x = 0; x < s; x += 16) { g.fillStyle = (x + y) % 32 ? '#62625e' : '#9a9a92'; g.fillRect(x, y, 16, 16); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, y, 16, 1); g.fillRect(x, y, 1, 16) } texNoiseOver(g, s, .06, 5) });
  tex('tile', 64, (g, s) => { g.fillStyle = '#8a8a84'; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 16) for (let x = 0; x < s; x += 16) { g.fillStyle = (x + y) % 32 ? '#d4d4ca' : '#c8c8bc'; g.fillRect(x + 1, y + 1, 15, 15); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 2, y + 2, 7, 1) } });
  tex('ceil', 64, (g, s) => texNoise(g, s, '#8e8e92', .05, 4, 2));
  tex('carpet', 64, (g, s) => { texNoise(g, s, '#3a2a30', .16, 6, 1) });
  tex('stairc', 64, (g, s) => { texNoise(g, s, '#5a2a2c', .14, 7, 1); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, 0, 4, s); g.fillRect(s - 4, 0, 4, s) });
  tex('door', 64, (g, s) => texNoise(g, s, '#6a4a30', .06, 10, 1));
  tex('phonescr', 32, (g, s, h) => { const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, '#16161e'); gr.addColorStop(1, '#06060a'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(4, 0); g.lineTo(14, 0); g.lineTo(2, 30); g.lineTo(0, 30); g.fill() });
  tex('phonebroken', 32, (g, s) => { g.fillStyle = '#0a0a10'; g.fillRect(0, 0, s, s); g.strokeStyle = '#a8b0c0'; g.lineWidth = 1; g.beginPath(); for (const [x, y] of [[2, 2], [30, 6], [8, 30], [28, 28], [16, 0], [0, 18]]) { g.moveTo(15, 12); g.lineTo(x, y) } g.stroke(); g.strokeStyle = 'rgba(160,170,190,.5)'; g.beginPath(); g.arc(15, 12, 5, 0, 7); g.arc(15, 12, 10, 0, 7); g.stroke() });
  for (const k of ['pol1', 'pol2', 'pol3', 'pol4']) { tex(k, 128, (g, s) => { g.scale(1, 1 / 1.2); drawPolaroid(g, s, k, true) }); const cv = document.createElement('canvas'); cv.width = 256; cv.height = 308; drawPolaroid(cv.getContext('2d'), 256, k); POLCV[k] = cv }
  tex('mirror', 16, (g, s) => { g.fillStyle = '#3a4048'; g.fillRect(0, 0, s, s) });
}

// ---------------------------------------------------------------- the house's look (after the reference screenshots, darker):
// stippled plaster walls, damask wallpaper, honey oak floors, big pale stone tiles in the hall, slate in the kitchen,
// white six-panel doors, light-wood kitchen cabinets with green marble tops, a black fridge, brown tile in the bathroom,
// floral and Persian rugs, and paintings of sunny old streets in heavy wooden frames
function texStyle() {
  const R = rng(301);
  tex('wall', 128, (g, s) => { texNoise(g, s, '#6c6458', .1, 301, 1); for (let i = 0; i < 1400; i++) { g.fillStyle = 'rgba(' + (R() < .5 ? '255,245,225' : '20,14,8') + ',' + (.05 + R() * .07) + ')'; g.fillRect(R() * s, R() * s, 1 + R() * 2, 1 + R() * 2) } });
  tex('wallp', 128, (g, s) => { g.fillStyle = '#5a4830'; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .06, 302);
    for (let y = 0; y < s; y += 16) for (let x = 0; x < s; x += 16) { const ox = (y / 16 % 2) * 8, cx = x + ox + 8, cy = y + 8;
      g.fillStyle = 'rgba(150,118,72,.45)'; for (const [dx, dy] of [[0, -5], [0, 5], [-5, 0], [5, 0]]) { g.beginPath(); g.ellipse(cx + dx, cy + dy, 1.4, 2.4, dx ? HP : 0, 0, 7); g.fill() }
      g.fillStyle = 'rgba(165,132,82,.5)'; g.beginPath(); g.arc(cx, cy, 1.6, 0, 7); g.fill() } });
  tex('floor', 128, (g, s) => { texNoise(g, s, '#6e4826', .06, 303, 1); for (let y = 0; y < s; y += 16) { g.fillStyle = 'rgba(' + (R() < .5 ? '0,0,0' : '255,210,150') + ',' + (R() * .08) + ')'; g.fillRect(0, y, s, 16); g.fillStyle = '#2e1a0c'; g.fillRect(0, y, s, 1); const j = (R() * s) | 0; g.fillRect(j, y, 1, 16); for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(50,26,8,' + (.06 + R() * .1) + ')'; g.fillRect(0, y + 2 + k * 2.3, s, 1) } } });
  tex('halltile', 128, (g, s) => { for (let y = 0; y < s; y += 64) for (let x = 0; x < s; x += 64) { g.fillStyle = ['#8a857a', '#857f74', '#8e897e', '#827c72'][(x / 64 + y / 32) % 4 | 0]; g.fillRect(x, y, 64, 64) } texNoiseOver(g, s, .07, 304); for (let i = 0; i < 18; i++) { g.strokeStyle = 'rgba(255,250,240,.06)'; g.beginPath(); g.moveTo(R() * s, R() * s); g.lineTo(R() * s, R() * s); g.stroke() } g.fillStyle = '#5a554c'; for (const p of [0, 64]) { g.fillRect(0, p, s, 2); g.fillRect(p, 0, 2, s) } });
  tex('tilef', 128, (g, s) => { for (let y = 0; y < s; y += 32) for (let x = 0; x < s; x += 32) { const v = 70 + R() * 18; g.fillStyle = 'rgb(' + (v | 0) + ',' + (v | 0) + ',' + (v * .96 | 0) + ')'; g.fillRect(x, y, 32, 32) } texNoiseOver(g, s, .12, 305); g.fillStyle = '#2e2e2c'; for (let p = 0; p < s; p += 32) { g.fillRect(0, p, s, 1); g.fillRect(p, 0, 1, s) } });
  tex('stairc', 64, (g, s) => { texNoise(g, s, '#7a4e2a', .08, 306, 1); for (let y = 0; y < s; y++) { g.fillStyle = 'rgba(40,20,6,' + (.05 + .05 * Math.sin(y * .8 + Math.sin(y * .2) * 3)) + ')'; g.fillRect(0, y, s, 1) } g.fillStyle = 'rgba(255,230,190,.12)'; g.fillRect(0, 0, s, 3) });
  tex('panel', 128, (g, s) => { texNoise(g, s, '#aaa69c', .03, 307, 1); for (const [x, y, w, h] of [[14, 8, 44, 30], [70, 8, 44, 30], [14, 46, 44, 34], [70, 46, 44, 34], [14, 88, 44, 32], [70, 88, 44, 32]]) { g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x, y, w, 2); g.fillRect(x, y, 2, h); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x, y + h - 2, w, 2); g.fillRect(x + w - 2, y, 2, h); g.fillStyle = 'rgba(0,0,0,.04)'; g.fillRect(x + 6, y + 6, w - 12, h - 12) } });
  tex('door', 128, (g, s) => { g.drawImage(TX.panel.cv, 0, 0, s, s) });
  tex('cabdoor', 64, (g, s) => { texNoise(g, s, '#a8916c', .05, 308, 1); for (let x = 0; x < s; x++) { g.fillStyle = 'rgba(90,60,30,' + (.03 + .03 * Math.sin(x * .7)) + ')'; g.fillRect(x, 0, 1, s) } g.strokeStyle = 'rgba(70,46,22,.45)'; g.lineWidth = 2; g.strokeRect(6, 6, s - 12, s - 12); g.strokeStyle = 'rgba(255,240,210,.2)'; g.lineWidth = 1; g.strokeRect(9, 9, s - 18, s - 18) });
  tex('drawer', 64, (g, s) => { texNoise(g, s, '#a28a66', .05, 309, 1); g.strokeStyle = 'rgba(70,46,22,.45)'; g.lineWidth = 2; g.strokeRect(4, 6, s - 8, s - 12) });
  tex('granite', 64, (g, s) => { texNoise(g, s, '#24503a', .12, 310, 1); for (let i = 0; i < 9; i++) { g.strokeStyle = 'rgba(160,210,180,' + (.1 + R() * .15) + ')'; g.lineWidth = .7; g.beginPath(); let x = R() * s, y = R() * s; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (R() - .5) * 20; y += (R() - .3) * 14; g.lineTo(x, y) } g.stroke() } });
  tex('fridgew', 32, (g, s) => texNoise(g, s, '#1c1c1e', .05, 311, 1));
  tex('fridge', 64, (g, s) => texNoise(g, s, '#1c1c1e', .05, 311, 1));
  tex('tile', 64, (g, s) => { for (let y = 0; y < s; y += 32) for (let x = 0; x < s; x += 32) { const v = R(); g.fillStyle = 'rgb(' + (78 + v * 22 | 0) + ',' + (50 + v * 14 | 0) + ',' + (32 + v * 8 | 0) + ')'; g.fillRect(x, y, 32, 32); g.fillStyle = 'rgba(255,220,180,.06)'; g.fillRect(x + 3, y + 3, 10, 1) } texNoiseOver(g, s, .1, 312); g.fillStyle = '#2a1a10'; for (let p = 0; p < s; p += 32) { g.fillRect(0, p, s, 1); g.fillRect(p, 0, 1, s) } });
  tex('ceil', 64, (g, s) => texNoise(g, s, '#58585a', .05, 313, 2));
  tex('marble', 64, (g, s) => { texNoise(g, s, '#c8c4bc', .05, 314, 1); for (let i = 0; i < 7; i++) { g.strokeStyle = 'rgba(90,88,84,' + (.15 + R() * .2) + ')'; g.lineWidth = .6; g.beginPath(); let x = R() * s, y = R() * s; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (R() - .5) * 18; y += (R() - .5) * 18; g.lineTo(x, y) } g.stroke() } });
  tex('vanity', 64, (g, s) => { texNoise(g, s, '#b4b2ac', .03, 315, 1); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; g.strokeRect(5, 5, 25, s - 10); g.strokeRect(34, 5, 25, s - 10); g.fillStyle = '#4a4a4a'; g.fillRect(26, 28, 2, 8); g.fillRect(36, 28, 2, 8) });
  // rugs: a beige floral one for the hall, a Persian one for the living room and the bedrooms
  tex('rugflor', 128, (g, s) => { g.fillStyle = '#7a6a52'; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .1, 316); g.strokeStyle = '#a8977a'; g.lineWidth = 3; g.strokeRect(5, 5, s - 10, s - 10);
    for (let i = 0; i < 26; i++) { const x = 12 + R() * (s - 24), y = 12 + R() * (s - 24); g.fillStyle = 'rgba(200,186,156,.55)'; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + Math.cos(k * 1.26) * 4, y + Math.sin(k * 1.26) * 4, 3, 2, k * 1.26, 0, 7); g.fill() } g.strokeStyle = 'rgba(180,160,120,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 8, y + 8, x + 14, y + 4); g.stroke() } });
  tex('rug', 128, (g, s) => { g.fillStyle = '#6a5e58'; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .14, 317); for (let r = 0; r < 4; r++) { g.strokeStyle = ['#8a7a70', '#4a3a40', '#9a8a7a', '#5a4a48'][r]; g.lineWidth = 3; g.strokeRect(4 + r * 6, 4 + r * 6, s - 8 - r * 12, s - 8 - r * 12) }
    g.fillStyle = 'rgba(70,52,58,.6)'; g.beginPath(); g.ellipse(s / 2, s / 2, 26, 18, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(170,150,130,.6)'; g.lineWidth = 2; g.beginPath(); g.ellipse(s / 2, s / 2, 18, 12, 0, 0, 7); g.stroke();
    for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(' + (R() < .5 ? '150,130,110' : '60,40,46') + ',.4)'; g.fillRect(30 + R() * (s - 60), 30 + R() * (s - 60), 2, 2) } });
  // the paintings: a sunny old street with arches and flowers, darkened with age
  tex('painting', 128, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#5a6a6a'); gr.addColorStop(.5, '#8a7050'); gr.addColorStop(1, '#4a3a28'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.fillStyle = '#9a7a5a'; g.fillRect(10, 30, 50, 80); g.fillStyle = '#b08a64'; g.fillRect(70, 20, 50, 90); for (const [x, y] of [[20, 60], [40, 60], [80, 50], [100, 50]]) { g.fillStyle = '#2a3a3a'; g.beginPath(); g.arc(x + 6, y, 6, PI, 0); g.fill(); g.fillRect(x, y, 12, 22) }
    for (let i = 0; i < 70; i++) { g.fillStyle = ['#a03040', '#c05060', '#3a6a3a', '#2a5030', '#d08070'][R() * 5 | 0]; g.beginPath(); g.arc(R() * s, 40 + R() * 80, 2 + R() * 4, 0, 7); g.fill() }
    g.fillStyle = 'rgba(30,20,10,.35)'; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .12, 318) });
  tex('trimw', 32, (g, s) => texNoise(g, s, '#a8a49c', .03, 320, 1));
  tex('ovenblack', 64, (g, s) => { g.fillStyle = '#121214'; g.fillRect(0, 0, s, s); g.fillStyle = '#1e1e22'; g.fillRect(6, 14, s - 12, s - 22); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(8, 16, 20, 2); g.fillStyle = '#c8c8c8'; g.fillRect(24, 4, 16, 4) });
  tex('stripes', 64, (g, s) => { for (let x = 0; x < s; x += 8) { g.fillStyle = ['#4e5a62', '#6e7a80', '#3a444c', '#8a9294', '#56626a'][(x / 8) % 5]; g.fillRect(x, 0, 8, s) } texNoiseOver(g, s, .08, 321) });
  tex('duvetflor', 64, (g, s) => { g.fillStyle = '#b8a8aa'; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .06, 322); for (let i = 0; i < 40; i++) { const x = R() * s, y = R() * s; g.fillStyle = ['rgba(150,60,80,.6)', 'rgba(120,70,90,.5)', 'rgba(90,110,80,.5)'][i % 3]; g.beginPath(); g.arc(x, y, 2 + R() * 2.5, 0, 7); g.fill() } });
  tex('portrait', 64, (g, s) => { const gr = g.createRadialGradient(32, 26, 4, 32, 30, 40); gr.addColorStop(0, '#5a4a32'); gr.addColorStop(1, '#1a140c'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.fillStyle = '#0c0a08'; g.beginPath(); g.ellipse(32, 16, 18, 5, 0, 0, 7); g.fill(); g.fillRect(22, 6, 20, 10); g.fillStyle = '#8a6a50'; g.beginPath(); g.ellipse(32, 26, 9, 11, 0, 0, 7); g.fill(); g.fillStyle = '#2a1e14'; g.beginPath(); g.ellipse(32, 33, 8, 7, 0, 0, PI); g.fill();
    g.fillStyle = '#0e0c0a'; g.beginPath(); g.moveTo(10, s); g.quadraticCurveTo(32, 32, 54, s); g.fill(); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, s, s) });
  tex('poster4', 64, (g, s) => { g.fillStyle = '#2a0a0e'; g.fillRect(0, 0, s, s); g.fillStyle = '#8a1a20'; g.beginPath(); g.arc(32, 26, 16, 0, 7); g.fill(); g.fillStyle = '#0a0a0a'; g.beginPath(); g.ellipse(32, 32, 7, 16, 0, 0, 7); g.fill(); g.fillRect(26, 44, 12, 14); g.fillStyle = '#d8c8a8'; for (let i = 0; i < 3; i++) g.fillRect(10, 52 + i * 3, 44 - i * 8, 1.5) });
  tex('poster5', 64, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#0a0e2a'); gr.addColorStop(.6, '#3a1a4a'); gr.addColorStop(1, '#0a0a14'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.strokeStyle = '#ff6ad0'; g.lineWidth = 1; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0, 40 + i * 4); g.lineTo(s, 40 + i * 4); g.stroke() } g.fillStyle = '#e8e0f0'; g.fillRect(14, 30, 36, 6); g.fillRect(18, 26, 26, 4); g.fillStyle = '#ffd040'; g.fillRect(8, 6, 48, 4) });
  tex('rug2', 64, (g, s) => { g.fillStyle = '#5a5452'; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .14, 319); g.strokeStyle = '#7a706a'; g.lineWidth = 2; g.strokeRect(3, 3, s - 6, s - 6); g.strokeStyle = '#3a3034'; g.strokeRect(8, 8, s - 16, s - 16) });
  // the poster in Hitori's room and the photographs: the real pictures, once they have loaded
  tex('poster2', 128, (g, s) => { g.fillStyle = '#111'; g.fillRect(0, 0, s, s) });
  photosReady(() => { const T = TX.poster2; T.g.drawImage(P2PHOTOS.poster, 0, 0, T.cv.width, T.cv.height); T.dirty = 1;
    for (const k of ['pol1', 'pol2', 'pol3']) { const t = TX[k]; if (t) { t.g.save(); t.g.setTransform(1, 0, 0, 1 / 1.2, 0, 0); drawPolaroid(t.g, t.cv.width, k, false); t.g.restore(); t.dirty = 1 } const cv = POLCV[k]; if (cv) drawPolaroid(cv.getContext('2d'), 256, k) } });
}
function photosReady(fn) { if (typeof P2PHOTOS == 'undefined') return; const all = Object.values(P2PHOTOS); let n = 0; const done = () => { if (++n == all.length) fn() }; for (const im of all) { if (im.complete && im.naturalWidth) done(); else im.addEventListener('load', done) } }
// ---------------------------------------------------------------- the polaroids (the photographs themselves)
// Drawn from the same portraits as part one, so the faces are the faces you know. One face is always lost in light.
function drawPolaroid(g, s, k, noImg) {
  g.fillStyle = '#f2eee2'; g.fillRect(0, 0, s, s * 1.2 | 0); const H2 = s * 1.2 | 0;
  const ix = s * .07, iy = s * .07, iw = s * .86, ih = s * .86; g.save(); g.beginPath(); g.rect(ix, iy, iw, ih); g.clip();
  const HAIRC = { steven: '#5b3b25', caroline: '#28232a', hitori: '#111018', uku: '#b85d2c' };
  const drawn = (who, x, y, sz) => { const hc = HAIRC[who] || '#333'; g.fillStyle = hc; g.beginPath(); g.ellipse(x, y - sz * .02, sz * .3, sz * .32, 0, 0, 7); g.fill(); if (who == 'hitori') g.fillRect(x - sz * .3, y, sz * .6, sz * .4);
    g.fillStyle = '#f0dccc'; g.beginPath(); g.ellipse(x, y + sz * .04, sz * .2, sz * .22, 0, 0, 7); g.fill(); g.fillStyle = hc; g.fillRect(x - sz * .22, y - sz * .2, sz * .44, sz * .1);
    g.fillStyle = '#1a1418'; g.fillRect(x - sz * .1, y + sz * .03, sz * .05, sz * .06); g.fillRect(x + sz * .05, y + sz * .03, sz * .05, sz * .06); g.fillStyle = '#a05050'; g.fillRect(x - sz * .03, y + sz * .15, sz * .06, sz * .02);
    if (who == 'hitori') { g.fillStyle = '#14101a'; for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(x + sx * sz * .14, y - sz * .26); g.lineTo(x + sx * sz * .2, y - sz * .45); g.lineTo(x + sx * sz * .22, y - sz * .24); g.fill() } }
    g.fillStyle = who == 'uku' ? '#3a5a3a' : who == 'caroline' ? '#c87a9a' : who == 'steven' ? '#3a4a7a' : '#1a1820'; g.beginPath(); g.ellipse(x, y + sz * .55, sz * .32, sz * .25, 0, 3.14, 6.29); g.fill() };
  const P = (who, emo, x, y, sz, flip) => { const im = PORTRAITS[who + ':' + emo] || PORTRAITS[who + ':neutral']; if (noImg || !ready(im)) return drawn(who, x, y, sz * .8); g.save(); g.translate(x, y); if (flip) g.scale(-1, 1); g.imageSmoothingEnabled = true; g.drawImage(im, -sz / 2, -sz / 2, sz, sz); g.restore() };
  const ph = typeof P2PHOTOS != 'undefined' && P2PHOTOS[k];
  if (ph && ph.complete && ph.naturalWidth) {   // the real photograph, cropped to fill the square
    const sc = Math.max(iw / ph.naturalWidth, ih / ph.naturalHeight), w = ph.naturalWidth * sc, h = ph.naturalHeight * sc; g.imageSmoothingEnabled = true;
    g.drawImage(ph, ix + (iw - w) / 2, iy + (ih - h) / 2, w, h); g.fillStyle = 'rgba(255,240,220,.06)'; g.fillRect(ix, iy, iw, ih); g.restore(); return }
  const glare = (x, y, r2) => { const gr = g.createRadialGradient(x, y, 0, x, y, r2); gr.addColorStop(0, 'rgba(255,255,250,1)'); gr.addColorStop(.55, 'rgba(255,252,240,.95)'); gr.addColorStop(1, 'rgba(255,250,235,0)'); g.fillStyle = gr; g.fillRect(x - r2, y - r2, r2 * 2, r2 * 2) };
  const girl2 = (x, y, sz) => {   // someone with long brown hair, drawn soft; her face is never visible
    g.fillStyle = '#4a3020'; g.beginPath(); g.ellipse(x, y + sz * .05, sz * .32, sz * .42, 0, 0, 7); g.fill(); g.fillStyle = '#e8d4c4'; g.beginPath(); g.ellipse(x, y, sz * .2, sz * .24, 0, 0, 7); g.fill();
    g.fillStyle = '#5a3a26'; g.beginPath(); g.ellipse(x, y - sz * .14, sz * .23, sz * .14, 0, 3.1, 6.3); g.fill(); g.fillStyle = '#c8a890'; g.beginPath(); g.moveTo(x - sz * .35, y + sz * .6); g.quadraticCurveTo(x, y + sz * .25, x + sz * .35, y + sz * .6); g.fill() };
  if (k == 'pol1') {   // the two of them on Hitori's bed, flash photo, late
    const gr = g.createLinearGradient(0, iy, 0, iy + ih); gr.addColorStop(0, '#3a3044'); gr.addColorStop(1, '#1a1420'); g.fillStyle = gr; g.fillRect(ix, iy, iw, ih);
    g.fillStyle = '#5a5470'; g.fillRect(ix, iy + ih * .72, iw, ih * .3); g.fillStyle = '#e8e0d8'; g.beginPath(); g.ellipse(ix + iw * .25, iy + ih * .78, iw * .2, ih * .06, 0, 0, 7); g.fill();
    girl2(ix + iw * .68, iy + ih * .5, iw * .5); P('hitori', 'happy', ix + iw * .33, iy + ih * .52, iw * .62);
    glare(ix + iw * .68, iy + ih * .45, iw * .26);
  } else if (k == 'pol2') {   // Mochi asleep on the keyboard
    g.fillStyle = '#2a2830'; g.fillRect(ix, iy, iw, ih); g.fillStyle = '#c8c0aa'; g.fillRect(ix, iy + ih * .6, iw, ih * .4); for (let r2 = 0; r2 < 4; r2++) for (let c = 0; c < 12; c++) { g.fillStyle = '#e0dac8'; g.fillRect(ix + 3 + c * iw / 12, iy + ih * .64 + r2 * ih * .08, iw / 12 - 3, ih * .06) }
    g.fillStyle = '#f2eee6'; g.beginPath(); g.ellipse(ix + iw * .5, iy + ih * .62, iw * .3, ih * .14, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(ix + iw * .3, iy + ih * .55, iw * .13, ih * .11, 0, 0, 7); g.fill();
    for (const dx of [-.07, .05]) { g.beginPath(); g.moveTo(ix + iw * (.3 + dx), iy + ih * .47); g.lineTo(ix + iw * (.3 + dx + .04), iy + ih * .38); g.lineTo(ix + iw * (.3 + dx + .07), iy + ih * .48); g.fill() }
    g.strokeStyle = '#5a5050'; g.lineWidth = s / 90; for (const dx of [-.05, .03]) { g.beginPath(); g.arc(ix + iw * (.3 + dx), iy + ih * .55, iw * .025, .2, 2.9); g.stroke() }
    g.fillStyle = '#e8a0a0'; g.fillRect(ix + iw * .295, iy + ih * .585, iw * .015, ih * .012); g.fillStyle = '#f2eee6'; g.beginPath(); g.ellipse(ix + iw * .78, iy + ih * .66, iw * .14, ih * .035, .4, 0, 7); g.fill();
  } else if (k == 'pol3') {   // all five of them squeezed onto the couch downstairs
    g.fillStyle = '#3a2e2a'; g.fillRect(ix, iy, iw, ih); g.fillStyle = '#5a4a52'; g.fillRect(ix, iy + ih * .62, iw, ih * .4); g.fillStyle = '#4a3c44'; g.fillRect(ix, iy + ih * .45, iw, ih * .2);
    const row = [['steven', 'happy'], ['caroline', 'happy'], ['hitori', 'neutral'], ['uku', 'happy'], [null]]; row.forEach(([w2, e], i) => { const x = ix + iw * (.1 + i * .2), y = iy + ih * (.5 + (i % 2) * .03); if (w2) P(w2, e, x, y, iw * .36, i > 2); else girl2(x, y, iw * .32) });
    glare(ix + iw * .9, iy + ih * .44, iw * .2);
  } else {   // two small girls on a beach, years ago. The right half has been torn away and taped back crooked.
    const gr = g.createLinearGradient(0, iy, 0, iy + ih); gr.addColorStop(0, '#8ab0d0'); gr.addColorStop(.5, '#c8d8e0'); gr.addColorStop(.55, '#4a7a9a'); gr.addColorStop(.7, '#e0cfa0'); gr.addColorStop(1, '#d0bc8a'); g.fillStyle = gr; g.fillRect(ix, iy, iw, ih);
    const kid = (x, y, hair, horns) => { g.fillStyle = hair; g.beginPath(); g.ellipse(x, y, iw * .07, iw * .1, 0, 0, 7); g.fill(); g.fillStyle = '#f0dccc'; g.beginPath(); g.ellipse(x, y + iw * .01, iw * .045, iw * .055, 0, 0, 7); g.fill(); g.fillStyle = hair; g.fillRect(x - iw * .05, y - iw * .06, iw * .1, iw * .035);
      g.fillStyle = horns ? '#1a1820' : '#d85a5a'; g.fillRect(x - iw * .05, y + iw * .07, iw * .1, iw * .14); g.fillStyle = '#f0dccc'; g.fillRect(x - iw * .03, y + iw * .21, iw * .02, iw * .08); g.fillRect(x + iw * .01, y + iw * .21, iw * .02, iw * .08);
      if (horns) { g.fillStyle = '#1a1820'; g.beginPath(); g.moveTo(x - iw * .045, y - iw * .07); g.lineTo(x - iw * .035, y - iw * .12); g.lineTo(x - iw * .02, y - iw * .07); g.fill(); g.beginPath(); g.moveTo(x + iw * .045, y - iw * .07); g.lineTo(x + iw * .035, y - iw * .12); g.lineTo(x + iw * .02, y - iw * .07); g.fill() } g.fillStyle = '#000'; g.fillRect(x - iw * .02, y, 2, 2); g.fillRect(x + iw * .015, y, 2, 2) };
    kid(ix + iw * .32, iy + ih * .5, '#14121a', 1); kid(ix + iw * .58, iy + ih * .48, '#5a3a26', 0); glare(ix + iw * .58, iy + ih * .5, iw * .11);
    g.restore(); g.save(); g.fillStyle = '#f2eee2'; g.beginPath(); g.moveTo(s * .5, 0); for (let y = 0; y <= H2; y += s / 24) g.lineTo(s * .5 + Math.sin(y * .7) * s * .015 + (y / H2) * s * .02, y); g.lineTo(s, H2); g.lineTo(s, 0); g.fill(); g.clip();
    g.translate(s * .52, 0); g.rotate(.02); g.drawImage(g.canvas, s * .5, 0, s * .5, H2, 0, s * .01, s * .5, H2); g.restore(); g.save();
    g.fillStyle = 'rgba(240,230,190,.55)'; g.fillRect(s * .44, s * .15, s * .14, s * .06); g.fillRect(s * .46, s * .75, s * .13, s * .06);
  }
  g.restore();
  if (k == 'pol4') { }
  // the paper: a little yellowing, a crease, a caption in pen
  g.fillStyle = 'rgba(200,170,100,.08)'; g.fillRect(0, 0, s, H2); g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1; g.strokeRect(.5, .5, s - 1, H2 - 1);
  g.fillStyle = '#2a2a5a'; g.font = 'italic ' + (s / 11 | 0) + 'px "Synchronicity Hand", cursive'; g.textBaseline = 'middle'; g.fillText({ pol1: 'us :)', pol2: 'mochi ♡', pol3: 'everyone!!', pol4: 'beach \'09' }[k], s * .1, s * 1.05);
}
// ---------------------------------------------------------------- the building
const H3 = { built: false, solids: [], inter: [], doors: [], lights: [], world: null, ext: null, extra: {}, rooms: [], mirrors: [], fridge: null, chair: null };
const FY = [0, 3], CEIL = 2.8, WT = .12;
function hs(x0, y0, z0, x1, y1, z1, o = {}) { if (LAYOUT.on && !LAYOUT.raw) [x0, y0, z0, x1, y1, z1] = LBOX([x0, y0, z0, x1, y1, z1], LAYOUT.stretch); const b = { x0: Math.min(x0, x1), y0: Math.min(y0, y1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), y1: Math.max(y0, y1), z1: Math.max(z0, z1), ...o }; H3.solids.push(b); return b }
const GAPS = [];   // door openings, for the trim round them
// where a doorway in an old wall lands in the new plan: mapped from the hall's side when the wall borders the hall
function lWallPt(ax, c, u, fl) { const y = FY[fl] + .5, pts = ax == 'x' ? [[u, c - .01], [u, c + .01]] : [[c - .01, u], [c + .01, u]];
  const rs = pts.map(p => lRoom(p[0], p[1], y)), i = rs.findIndex(r => r.id == 'hall' || r.id == 'upstairs'), k = i < 0 ? 1 : i;
  return LM(pts[k][0], pts[k][1], y, rs[k]) }
function lGap(ax, c, a, b, fl, lo, hi) { const wide = b - a > 1.2;
  if (wide) { const p = lWallPt(ax, c, a, fl), q = lWallPt(ax, c, b, fl), i = ax == 'x' ? 0 : 1; return [p[i], q[i]] }
  const m = lWallPt(ax, c, (a + b) / 2, fl)[ax == 'x' ? 0 : 1], h = DOORW / 2, cm = clamp(m, lo + h + .08, hi - h - .08); return [cm - h, cm + h] }
function wallX(mb, z, x0, x1, fl, gaps = [], t = 'wall', o = {}) {   // a wall running along x at z, with door gaps [a, b] (old plan)
  const yy = FY[fl] + .5, Z = LM((x0 + x1) / 2, z, yy)[1], X0 = LM(x0 + .01, z, yy)[0] - .01, X1 = LM(x1 - .01, z, yy)[0] + .01;
  const G = gaps.map(([a, b]) => lGap('x', z, a, b, fl, X0, X1)); lRaw(() => wallXn(mb, Z, X0, X1, fl, G, t, o)) }
function wallZ(mb, x, z0, z1, fl, gaps = [], t = 'wall', o = {}) {
  const yy = FY[fl] + .5, X = LM(x, (z0 + z1) / 2, yy)[0], Z0 = LM(x, z0 + .01, yy)[1] - .01, Z1 = LM(x, z1 - .01, yy)[1] + .01;
  const G = gaps.map(([a, b]) => lGap('z', x, a, b, fl, Z0, Z1)); lRaw(() => wallZn(mb, X, Z0, Z1, fl, G, t, o)) }
function wallXn(mb, z, x0, x1, fl, gaps = [], t = 'wall', o = {}) {
  const y0 = FY[fl], y1 = y0 + CEIL; let cur = x0; const segs = [];
  for (const [a, b] of gaps.slice().sort((p, q) => p[0] - q[0])) { if (a > cur) segs.push([cur, a, y0, y1]); segs.push([a, b, y0 + DOORH + .03, y1]); cur = b; GAPS.push({ ax: 'x', c: z, a, b, y: y0 }) }
  if (cur < x1) segs.push([cur, x1, y0, y1]);
  for (const [a, b, ya, yb] of segs) { mb.box(t, a, ya, z - WT / 2, b, yb, z + WT / 2, { us: 1.6, ...o }); if (ya - y0 < .1) { hs(a, ya, z - WT / 2, b, yb, z + WT / 2); mb.box('walnut', a, y0, z - WT / 2 - .015, b, y0 + .1, z + WT / 2 + .015, { us: 2, bev: .006 }) } }
}
function wallZn(mb, x, z0, z1, fl, gaps = [], t = 'wall', o = {}) {
  const y0 = FY[fl], y1 = y0 + CEIL; let cur = z0; const segs = [];
  for (const [a, b] of gaps.slice().sort((p, q) => p[0] - q[0])) { if (a > cur) segs.push([cur, a, y0, y1]); segs.push([a, b, y0 + DOORH + .03, y1]); cur = b; GAPS.push({ ax: 'z', c: x, a, b, y: y0 }) }
  if (cur < z1) segs.push([cur, z1, y0, y1]);
  for (const [a, b, ya, yb] of segs) { mb.box(t, x - WT / 2, ya, a, x + WT / 2, yb, b, { us: 1.6, ...o }); if (ya - y0 < .1) { hs(x - WT / 2, ya, a, x + WT / 2, yb, b); mb.box('walnut', x - WT / 2 - .015, y0, a, x + WT / 2 + .015, y0 + .1, b, { us: 2, bev: .006 }) } }
}
// trim round every door opening, on both sides of the wall
function doorTrim(mb) { lRaw(() => doorTrimN(mb)) }
function doorTrimN(mb) {
  for (const G of GAPS) { const y = G.y, h = G.b - G.a > 1.3 ? CEIL - .02 : DOORH + .03, t = .07, o = WT / 2;
    for (const s of [-1, 1]) { const f0 = G.c + s * o, f1 = G.c + s * (o + .018);
      const B = (a0, b0, a1, b1) => G.ax == 'x' ? mb.box('linen', a0, b0, Math.min(f0, f1), a1, b1, Math.max(f0, f1), { bev: .004 }) : mb.box('linen', Math.min(f0, f1), b0, a0, Math.max(f0, f1), b1, a1, { bev: .004 });
      B(G.a - t, y, G.a, y + h); B(G.b, y, G.b + t, y + h); B(G.a - t, y + h, G.b + t, y + h + t) }
    // the jamb lining inside the opening
    if (G.ax == 'x') { mb.box('linen', G.a, y, G.c - o, G.a + .015, y + h, G.c + o); mb.box('linen', G.b - .015, y, G.c - o, G.b, y + h, G.c + o); mb.box('linen', G.a, y + h - .015, G.c - o, G.b, y + h, G.c + o) }
    else { mb.box('linen', G.c - o, y, G.a, G.c + o, y + h, G.a + .015); mb.box('linen', G.c - o, y, G.b - .015, G.c + o, y + h, G.b); mb.box('linen', G.c - o, y + h - .015, G.a, G.c + o, y + h, G.b) } }
}
// furniture helpers
function prop(mb, t, x0, y0, z0, x1, y1, z1, o = {}) { mb.box(t, x0, y0, z0, x1, y1, z1, o); if (!o.ns) hs(x0, y0, z0, x1, y1, z1, { see: o.see }) }
function inter(id, box, name, on, cond) { if (LAYOUT.on && !LAYOUT.raw) box = LBOX(box); const it = { id, box, name, on, cond }; H3.inter.push(it); return it }
// a panel door: raised panels on both faces, brass knobs. Built with the hinge at the origin, the panel running along +x.
function doorMesh(mb, t = 'panel') {
  const w = DOORW, h = DOORH - .02, th = .04, kx = w / .9, ky = h / 2.08; mb.box(t, 0, 0, -th / 2, w, h, th / 2, { us: .9 });
  for (const s of [-1, 1]) { for (const [x0, y0, x1, y1] of [[.1, .15, .42, .95], [.48, .15, .8, .95], [.1, 1.08, .42, 1.95], [.48, 1.08, .8, 1.95]]) mb.box(t, x0 * kx, y0 * ky, s > 0 ? th / 2 : -th / 2 - .012, x1 * kx, y1 * ky, s > 0 ? th / 2 + .012 : -th / 2, { bev: .008, us: .9 });
    mb.with(M4.mul(M4.tr(w - .1 * kx, 1.02, s * th / 2), M4.rx(s * HP)), m => { m.cyl('brass', 0, 0, 0, .028, .008, { seg: 10 }); m.lathe('brass', [[.008, 0], [.01, .04], [.026, .05], [.026, .065], [.0, .07]], { seg: 10 }) }) }
}
function door(id, hx, hz, fl, along, swing, o = {}) {
  // the old hinge position -> the new doorway (same rule as the wall's gap), hinge at its start
  if (along == 'x') { const g = lGap('x', hz, hx, hx + .9, fl, 0, HOUSE_W); hz = LM(hx + .45, hz, FY[fl] + .5)[1]; hx = g[0] }
  else { const g = lGap('z', hx, hz, hz + .9, fl, 0, HOUSE_D); hx = LM(hx, hz + .45, FY[fl] + .5)[0]; hz = g[0] }
  return lRaw(() => doorN(id, hx, hz, fl, along, swing, o)) }
function doorN(id, hx, hz, fl, along, swing, o = {}) {
  const mb = new MB(); doorMesh(mb);
  const d = { id, hx, hz, y: FY[fl], along, swing, a: o.open || 0, to: o.open || 0, obj: null, mb, locked: o.locked || null, name: o.name || 'Door' };
  const W = DOORW, b = along == 'x' ? hs(hx, d.y, hz - .06, hx + W, d.y + DOORH, hz + .06) : hs(hx - .06, d.y, hz, hx + .06, d.y + DOORH, hz + W); d.solid = b;
  d.inter = inter('door_' + id, along == 'x' ? [hx, d.y, hz - .1, hx + W, d.y + DOORH, hz + .1] : [hx - .1, d.y, hz, hx + .1, d.y + DOORH, hz + W], d.name, () => doorUse(d), o.cond);
  H3.doors.push(d); return d;
}
function doorUse(d) {
  if (d.locked) { const m = typeof d.locked == 'function' ? d.locked() : d.locked; if (m) { if (m === 'skip') return; SFX3.locked(); if (m !== true) say3([m]); return } }
  d.to = d.to ? 0 : 1; SFX3.door(!!d.to);
}
function doorTick(dt) { for (const d of H3.doors) { d.a += clamp(d.to - d.a, -dt * 2.2, dt * 2.2); d.solid.off = d.a > .15; const base = d.along == 'x' ? 0 : -HP; d.obj.M = M4.mul(M4.tr(d.hx, d.y, d.hz), M4.ry(base + d.a * d.swing * HP)) }
  const F = H3.fridge; if (F) { F.a += clamp(F.to - F.a, -dt * 1.6, dt * 1.6); const e = F.a * F.a * (3 - 2 * F.a); F.main.M = M4.chain(F.base, M4.tr(.39, 0, -.31), M4.ry(-e * 1.75)); F.top.M = M4.chain(F.base, M4.tr(.39, 1.47, -.31), M4.ry(-e * .12)); F.light.off = F.a < .05 }
  const Ch = H3.chair; if (Ch) { Ch.obj.M = M4.mul(M4.tr(Ch.x, 3, Ch.z), M4.ry(Ch.ry)); Ch.solid.x0 = Ch.x - .24; Ch.solid.x1 = Ch.x + .24; Ch.solid.z0 = Ch.z - .24; Ch.solid.z1 = Ch.z + .24 } }
// one built object you can move
function single(fn, vis = true) { const mb = new MB(); fn(mb); const o = mb.build(); o.vis = vis; return o }

function buildHouse() {
  if (H3.built) return; texAll(); texModels(); texUpgrade(); texStyle(); H3.built = true; GAPS.length = 0;
  const mb = new MB(); LAYOUT.on = true;
  // ---- floors and ceilings (stretched onto the new plan)
  const fl = (t, x0, z0, x1, z1, y = 0) => lStretch(() => mb.box(t, x0, y - .1, z0, x1, y, z1, { skip: 'nsewb', us: t == 'floor' ? 2.2 : t == 'halltile' ? .8 : t == 'tilef' ? 1 : 1.4 }));
  fl('floor', 0, 4, 4, 10); fl('halltile', 4, 0, 8.6, 10); fl('tilef', 8.6, 3.5, 12, 10); fl('tilef', 8.6, 0, 12, 3.5); fl('floor', 0, 0, 4, 4);
  // ---- the foyer, the stairs and the gallery, built straight in the new plan (x 5.6-11.4 is the hall):
  // wide stairs (1.7 m, 15 easy steps of 20 x 44 cm) up the west wall, foot at z 12.6, top at z 6;
  // upstairs a deep landing to the north, a 2 m walkway along the east wall to Hitori's and her sister's doors,
  // a 1.8 m gallery along the south wall to her parents' room, and the foyer open up to the roof between them
  lRaw(() => {
    for (const [x0, z0, x1, z1] of [[0, 0, 5.6, 14], [11.4, 0, 16.4, 14], [5.6, 0, 11.4, 6], [9.4, 6, 11.4, 12.2], [5.6, 12.2, 11.4, 14]]) mb.box('floor', x0, 2.8, z0, x1, 3, z1, { skip: 'nsew', tf: { b: 'ceil' }, us: 2.2 });
    for (const [x0, z0, x1, z1] of [[7.4, 5.95, 9.45, 6.02], [9.38, 5.95, 9.45, 12.25], [5.6, 12.18, 9.45, 12.25]]) mb.box('trimw', x0, 2.76, z0, x1, 3.03, z1);
    mb.box('ceil', 0, 5.8, 0, HOUSE_W, 5.9, HOUSE_D, { skip: 'nsewt', us: 2 });
    const N = 15, Z0 = 12.6, RUN = .44, RISE = .2, SX0 = 5.72, SX1 = 7.38;
    for (let i = 0; i < N; i++) { const z1 = Z0 - i * RUN, z0 = z1 - RUN, y = (i + 1) * RISE; mb.box('stairc', SX0, y - RISE, z0, SX1, y, z1, { us: .8, skip: 'n' }); mb.box('walnut', SX0 - .02, y - .02, z1 - .03, SX1 + .03, y + .012, z1 + .02, { bev: .006 });
      mb.lathe('walnut', [[.022, 0], [.022, .05], [.012, .1], [.015, .45], [.01, .78], [.02, .82]], { cx: SX1 - .03, cz: z1 - RUN / 2, seg: 8, yf: () => y }) }
    mb.quad('wall', [SX1 + .02, 0, Z0], [SX1 + .02, 0, 6], [SX1 + .02, 3 - .05, 6], [SX1 + .02, 0, Z0]); mb.quad('wall', [SX1 + .02, 0, 6], [SX1 + .02, 0, Z0], [SX1 + .02, 3 - .05, 6], [SX1 + .02, 3 - .05, 6]);
    mb.box('walnut', SX1 - .06, 0, Z0 - .06, SX1 + .06, 1.05, Z0 + .06, { bev: .01 }); mb.lathe('walnut', [[.05, 1.05], [.07, 1.1], [.0, 1.16]], { cx: SX1, cz: Z0, seg: 10 });   // the newel post
    mb.tube('walnut', [[SX1 - .03, .95, Z0 + .02], [SX1 - .03, 3.9, 5.95]], [.028, .028], { seg: 6 });
    hs(SX1, 0, 6.2, SX1 + .07, 2.6, 12.45);
    // the gallery railings round the open foyer
    const bal = (x, z) => mb.lathe('walnut', [[.03, 3], [.03, 3.06], [.015, 3.1], [.018, 3.5], [.012, 3.85], [.025, 3.9]], { cx: x, cz: z, seg: 8 });
    for (let x = 7.55; x < 9.4; x += .25) bal(x, 6); for (let z = 6.15; z < 12.2; z += .25) bal(9.42, z); for (let x = 5.75; x < 9.4; x += .25) bal(x, 12.22);
    mb.box('walnut', 7.4, 3.9, 5.95, 9.47, 3.97, 6.05, { bev: .015 }); mb.box('walnut', 9.37, 3.9, 5.95, 9.47, 3.97, 12.27, { bev: .015 }); mb.box('walnut', 5.62, 3.9, 12.17, 9.47, 3.97, 12.27, { bev: .015 });
    for (const [x, z] of [[7.4, 6], [9.42, 6], [9.42, 12.22], [5.66, 12.22]]) mb.box('walnut', x - .05, 3, z - .05, x + .05, 4.02, z + .05, { bev: .01 });
    hs(7.4, 3, 5.93, 9.47, 4, 6.07); hs(9.36, 3, 5.93, 9.48, 4, 12.28); hs(5.6, 3, 12.16, 9.48, 4, 12.28);
    // a brass chandelier hanging into the foyer from the roof, and a big painting high on the wall over the stairs
    mb.cyl('darkplastic', 8.4, 4.3, 9.1, .006, 1.5, { seg: 4 }); mb.at(8.4, 0, 9.1, 0, m => { for (let i = 0; i < 6; i++) { const a = i * PI / 3; m.tube('brass', [[0, 4.3, 0], [Math.cos(a) * .32, 4.15, Math.sin(a) * .32], [Math.cos(a) * .36, 4.3, Math.sin(a) * .36]], [.008, .008, .008], { seg: 5 }); m.lathe('lamp', [[.05, 4.3], [.035, 4.42]], { cx: Math.cos(a) * .36, cz: Math.sin(a) * .36, seg: 8 }) } m.lathe('brass', [[.0, 4.12], [.06, 4.2], [.04, 4.35]], { seg: 10 }) });
    mFrame(mb, 'painting', 'e', 5.67, 4.5, 9.3, 1.8, 1.25, 'walnut');
    // under the stairs' open side: a console table with two lamps and a framed photo, a plant
    mb.at(7.62, 0, 9.0, -HP, m => { m.box('walnut', -.6, .78, -.18, .6, .82, .18, { bev: .01 }); m.box('walnut', -.57, .66, -.16, .57, .78, .16); for (const x of [-.52, .52]) for (const z of [-.12, .12]) m.lathe('walnut', [[.025, 0], [.018, .3], [.03, .5], [.02, .66]], { cx: x, cz: z, seg: 8 }) }); hs(7.42, 0, 8.4, 7.82, .85, 9.6);
    for (const z of [8.55, 9.45]) mb.at(7.62, .82, z, 0, m => MOD.tableLamp(m, .42)); mb.at(7.6, .82, 9.0, -HP, m => { m.box('walnut', -.08, 0, -.015, .08, .2, .015); m.box('pol3', -.07, .015, -.017, .07, .185, -.015, { fit: 1 }) });
    mb.at(7.7, 0, 10.4, 0, m => MOD.plant(m, false)); hs(7.5, 0, 10.2, 7.9, .9, 10.6);
  });
  // ---- furnishing the bigger rooms (new plan): a room should have something in every corner and a pool of lamplight
  lRaw(() => {
    // living room: two armchairs and a side table with a lamp, facing the TV; a tall plant; a second rug
    for (const [x, z, r] of [[2.4, 12.6, PI * .85], [2.5, 7.0, PI * .15]]) { mb.at(x, 0, z, r, m => MOD.sofa(m, .9)); hs(x - .5, 0, z - .5, x + .5, .9, z + .5) }
    mb.at(1.0, 0, 12.9, 0, m => { m.box('walnut', -.25, .55, -.25, .25, .6, .25, { bev: .01 }); for (const x of [-.2, .2]) for (const z of [-.2, .2]) m.box('walnut', x - .02, 0, z - .02, x + .02, .55, z + .02) }); mb.at(1.0, .6, 12.9, 0, m => MOD.tableLamp(m, .48)); hs(.75, 0, 12.65, 1.25, .62, 13.15);
    mb.at(5.1, 0, 13.4, 0, m => MOD.plant(m, false)); hs(4.9, 0, 13.2, 5.3, .9, 13.6);
    // the kitchen: a dining table with four chairs at the far end, under its own lamp
    mb.at(13.2, 0, 12.0, 0, m => MOD.table(m, 1.4, .9, .76, 'oak')); hs(12.5, 0, 11.55, 13.9, .78, 12.45);
    for (const [x, z, r] of [[12.85, 11.3, 0], [13.55, 11.3, 0], [12.85, 12.7, PI], [13.55, 12.7, PI]]) { mb.at(x, 0, z, r, m => MOD.chair(m)); hs(x - .2, 0, z - .2, x + .2, .5, z + .2) }
    mb.at(13.2, 0, 12.0, 0, m => MOD.ceilingLamp(m, 2.8));
    // Hitori's room: a white dresser by the door, a wooden chest of drawers with a lamp by the window wall, a beanbag
    mb.at(11.66, 3, 7.4, HP, m => { m.box('vanity', -.5, 0, -.24, .5, .9, .24, { fit: 1 }); m.box('trimw', -.52, .9, -.26, .52, .93, .26) }); hs(11.4, 3, 6.88, 11.92, 3.95, 7.92);
    mb.at(11.75, 3.93, 7.15, 0, m => { m.lathe('porcelain', [[.04, 0], [.06, .1], [.03, .2]], { seg: 10 }); m.box('gamecase', .1, 0, .1, .22, .02, .3, { fit: 1 }) });
    mb.at(16.12, 3, 7.6, -HP, m => MOD.dresser(m, 1.1, .9)); hs(15.86, 3, 7.05, 16.4, 3.92, 8.15); mb.at(16.12, 3.9, 7.95, 0, m => MOD.tableLamp(m, .42));
    mb.at(14.3, 3, 12.6, 0, m => m.sphere('cushion', 0, .25, 0, .42, .28, .42, { seg: 14, rings: 8 })); hs(13.9, 3, 12.2, 14.7, 3.5, 13.0);
    // the landing upstairs: a long bench under a painting, a plant in the corner
    mb.at(8.5, 3, .35, 0, m => { m.box('walnut', -.8, .4, -.2, .8, .46, .2, { bev: .01 }); for (const x of [-.72, .72]) m.box('walnut', x - .04, 0, -.16, x + .04, .4, .16) }); hs(7.7, 3, .1, 9.3, 3.46, .6);
    mFrame(mb, 'painting', 's', 8.5, 4.6, .07, 1.4, .9, 'walnut'); mb.at(11.0, 3, .5, 0, m => MOD.plant(m, false)); hs(10.8, 3, .3, 11.2, 3.9, .7);
  });
  // ---- walls, ground floor
  wallX(mb, 0, 0, 12, 0, [[6, 6.9]], 'wall'); wallX(mb, 10, 0, 12, 0, [[6, 6.9]], 'wall');
  wallZ(mb, 0, 0, 10, 0, [], 'wall'); wallZ(mb, 12, 0, 10, 0, [], 'wall');
  wallX(mb, 4, 0, 4, 0, [[1.5, 2.4]], 'wall');
  wallZ(mb, 4, 0, 10, 0, [[9.05, 9.95]], 'wall');
  wallZ(mb, 8.6, 0, 10, 0, [[1.2, 2.1], [4.7, 8.1]], 'wall');
  wallX(mb, 3.5, 8.6, 12, 0, [], 'wall');
  // ---- walls, upper floor
  wallX(mb, 0, 0, 12, 1, [], 'wall'); wallX(mb, 10, 0, 12, 1, [], 'wall'); wallZ(mb, 0, 0, 10, 1, [], 'wall'); wallZ(mb, 12, 0, 10, 1, [], 'wall');
  wallZ(mb, 4, 0, 10, 1, [[1.5, 2.4], [9.05, 9.95]], 'wall'); wallX(mb, 4.5, 0, 4, 1, [], 'wall');
  wallZ(mb, 8.6, 0, 10, 1, [[2, 2.9], [6, 6.9]], 'wall'); wallX(mb, 5, 8.6, 12, 1, [], 'wall');
  doorTrim(mb);
  // the outside of the house (siding), the roof, the yard and a tree: only seen at the very end
  const ext = new MB(); LAYOUT.stretch = 1;
  ext.box('siding', -.08, 0, -.08, 12.08, 5.9, 0, { us: 1.4, skip: 's' }); ext.box('siding', -.08, 0, 10, 12.08, 5.9, 10.08, { us: 1.4, skip: 'n' }); ext.box('siding', -.08, 0, 0, 0, 5.9, 10, { us: 1.4, skip: 'e' }); ext.box('siding', 12, 0, 0, 12.08, 5.9, 10, { us: 1.4, skip: 'w' });
  ext.quad('roof', [-.4, 5.9, -.4], [12.4, 5.9, -.4], [12.4, 8, 5], [-.4, 8, 5], [[0, 0], [12, 0], [12, 3], [0, 3]]); ext.quad('roof', [-.4, 8, 5], [12.4, 8, 5], [12.4, 5.9, 10.4], [-.4, 5.9, 10.4], [[0, 0], [12, 0], [12, 3], [0, 3]]);
  ext.quad('siding', [-.08, 5.9, -.4], [-.08, 8, 5], [-.08, 5.9, 10.4], [-.08, 5.9, 10.4]); ext.quad('siding', [12.08, 5.9, -.4], [12.08, 8, 5], [12.08, 5.9, 10.4], [12.08, 5.9, 10.4]);
  ext.box('grass', -30, -.12, -30, 42, -.02, 40, { skip: 'nsewb', us: 2 });
  ext.decal('litwin', 12.09, 4.5, 8.95, 1.3, 1.3, 'e', [1, 1, 1, 1]); ext.decal('night', 12.09, 4.5, 2.5, 1.2, 1.2, 'e', [.4, .4, .5, 1]); ext.decal('night', 12.09, 1.75, 6.1, .9, .7, 'e', [.4, .4, .5, 1]);
  ext.decal('door', 6.45, 1.05, 10.09, .9, 2.1, 's', [.5, .5, .5, 0]); ext.decal('night', 2, 1.6, 10.09, 1.6, 1.2, 's', [.4, .4, .5, 1]); ext.decal('night', 2, 4.5, 10.09, 1.4, 1.2, 's', [.4, .4, .5, 1]);
  ext.box('bark', 16, 0, 12, 16.5, 4, 12.5, { us: 1 }); for (const [y, r] of [[3, 2.4], [4.4, 1.9], [5.6, 1.3]]) ext.box('leaves', 16.25 - r, y, 12.25 - r, 16.25 + r, y + 1.4, 12.25 + r, { us: 1.5 });
  ext.box('dwood', 16.6, 3.2, 12.2, 17.6, 3.3, 12.3);
  LAYOUT.stretch = 0;
  const glass = new MB();   // the mirrors: their glass is a separate object so it can show a reflection
  const mirror = (face, cx, cy, cz, w, h) => { mFrame(mb, null, face, cx, cy, cz, w, h, 'walnut'); const n = { n: [0, 0, -1], s: [0, 0, 1], e: [1, 0, 0], w: [-1, 0, 0] }[face]; const m = new MB(); m.decal('mirror', cx + n[0] * .006, cy, cz + n[2] * .006, w, h, face); const o = m.build(); o.mirror = 'mirror'; H3.mirrors.push({ obj: o, p: L3P([cx + n[0] * .01, cy, cz + n[2] * .01]), n }) };
  // ================================================================ ROOMS, ground floor
  // the hall: front door, shoe rack, a coat stand, a mirror, a light switch
  mb.at(7.9, 0, 9.75, 0, m => MOD.shoeRack(m)); hs(7.45, 0, 9.58, 8.35, .45, 9.94);
  mb.at(7.95, 0, 8.55, 0, m => MOD.coatStand(m)); hs(7.8, 0, 8.4, 8.1, 1.8, 8.7);
  mirror('w', 8.54, 1.5, 3.2, .55, .85); inter('hallmirror', [8.4, 1, 2.8, 8.6, 2, 3.6], 'Mirror', () => P2S.look('hallmirror'));
  { const g = lGap('x', 10, 6, 6.9, 0, 0, HOUSE_W), g0 = lGap('x', 0, 6, 6.9, 0, 0, HOUSE_W); lRaw(() => { mb.with(M4.tr(g[0], 0, HOUSE_D), m => doorMesh(m)); mb.with(M4.tr(g0[0], 0, 0), m => doorMesh(m)); hs(g[0], 0, HOUSE_D - .1, g[1], DOORH, HOUSE_D + .06); hs(g0[0], 0, -.06, g0[1], DOORH, .1);
    inter('frontdoor', [g[0], 0, HOUSE_D - .15, g[1], DOORH, HOUSE_D + .1], 'Front door', () => P2S.look('frontdoor')); inter('backdoor', [g0[0], 0, -.1, g0[1], DOORH, .2], 'Back door', () => P2S.look('backdoor')) }) }
  mb.box('rugflor', 5.75, .003, 5.6, 7.75, .012, 8.3, { skip: 'nsewb', fit: 1 });
  // the living room: sofa, TV, coffee table, a floor lamp in the corner (out of the way of the door), a bookshelf, the window, photos
  mb.at(.56, 0, 7, -HP, m => MOD.sofa(m, 2.2)); hs(.1, 0, 5.9, 1.02, .9, 8.1);
  mb.at(1.85, 0, 7, HP, m => MOD.coffeeTable(m)); hs(1.55, 0, 6.53, 2.15, .45, 7.47); mb.at(1.85, .42, 6.85, .3, m => m.box('gamecase', -.07, 0, -.09, .07, .012, .09, { fit: 1 }));
  mb.at(3.6, 0, 7, HP, m => MOD.tv(m)); hs(3.36, 0, 6.48, 3.92, 1, 7.52); inter('tv', [3.3, .5, 6.6, 3.7, 1.2, 7.4], 'TV', () => P2S.look('tv'));
  mb.at(1.2, 0, 4.23, PI, m => MOD.bookshelf(m)); hs(.25, 0, 4.06, 2.15, 2, 4.4); inter('books', [.2, 0, 4.06, 2.2, 2, 4.5], 'Bookshelf', () => P2S.look('books'));
  mb.at(.4, 0, 9.55, 0, m => MOD.floorLamp(m)); hs(.25, 0, 9.4, .55, 1.6, 9.7);
  mb.at(3.6, 0, 4.45, 0, m => MOD.plant(m, true));
  mb.box('rug', 1.3, .003, 5.9, 3.1, .012, 8.1, { skip: 'nsewb', fit: 1 });
  mWindow(mb, 'n', 2, 1.6, 9.94, 1.6, 1.2, { curtains: 1 }); mWindow(mb, 'e', .06, 1.75, 9.0, .9, 1.0, {});
  mFrame(mb, 'painting', 'w', 3.94, 1.7, 5.1, .6, .5); mFrame(mb, 'pol3', 'w', 3.94, 1.5, 8.35, .36, .43); inter('familyphoto', [3.8, 1.2, 8.1, 4, 1.8, 8.6], 'Photo', () => P2S.look('familyphoto'));
  // storage (locked): boxes
  mb.at(.75, 0, .7, .1, m => MOD.boxes(m, 3)); mb.at(1.9, 0, .65, -.2, m => MOD.boxes(m, 4, 2)); hs(.3, 0, .3, 2.4, 1.3, 1.2);
  // the back corridor: a little table with a dead landline, coats on hooks, the back door
  mb.at(4.85, 0, .3, PI, m => MOD.table(m, .6, .35, .75, 'walnut')); hs(4.55, 0, .1, 5.15, .78, .5); mb.at(4.85, .76, .28, PI + .2, m => MOD.oldPhone(m)); inter('landline', [4.6, .7, .1, 5.1, 1, .5], 'Old phone', () => P2S.look('landline'));
  mb.box('walnut', 7.1, 1.65, .06, 8.3, 1.72, .09); for (let i = 0; i < 3; i++) mb.at(7.35 + i * .4, 0, .06, PI + (i - 1) * .1, m => m.lathe(['sofa', 'curtain', 'lacquer'][i], [[.03, 1.68], [.13, 1.55], [.15, 1.2], [.14, 1.0]], { seg: 10, sz: .5, cz: -.08 }));
  mWindow(mb, 's', 5.2, 1.6, .06, 1, 1, {});
  // the kitchen: counters and cabinets along the east wall (sink under the window), the fridge, a clock stuck at six, the table by the south wall
  mb.at(11.63, 0, 5.81, HP, m => { MOD.counter(m, 4.38, { gap: [1.2, 1.7] }); MOD.stove(m, 1.457); MOD.sink(m, -.29) }); hs(11.3, 0, 3.6, 11.94, .92, 8.02);
  mb.at(11.77, 1.5, 4.56, HP, m => MOD.upperCabinets(m, 1.88)); mb.at(11.77, 1.5, 7.35, HP, m => MOD.upperCabinets(m, 1.3));
  mWindow(mb, 'w', 11.94, 1.75, 6.1, .9, .7, {}); lStretch(() => mb.box('tile', 11.93, .92, 3.62, 11.94, 1.5, 8.0, { skip: 'e', us: 1 }));
  inter('ksink', [11.3, .8, 5.7, 12, 1.3, 6.5], 'Sink', () => P2S.look('ksink'));
  { const base = M4.mul(M4.tr(...L3P([11.58, 0, 8.75])), M4.ry(HP)); lRaw(() => { mb.with(base, m => MOD.fridgeBody(m)); mb.with(base, m => MOD.fridgeFood(m)) }); hs(11.2, 0, 8.36, 11.94, 1.9, 9.14);
    const main = lRaw(() => single(m => MOD.fridgeDoor(m, .78, 1.42))), top = lRaw(() => single(m => MOD.fridgeDoor(m, .78, .4))), light = { p: L3P([11.4, 1.2, 8.75]), c: [.7, .75, .8], r: 2.2, off: true };
    lRaw(() => mb.with(base, m => m.box('fridgew', -.39, 1.42, -.31, .39, 1.47, -.29)));   // the strip between the doors
    H3.fridge = { base, main, top, light, a: 0, to: 0 }; H3.extra.fridgeMain = main; H3.extra.fridgeTop = top;
  }
  inter('fridge', [11.05, 0, 8.3, 11.95, 1.95, 9.2], 'Fridge', () => P2S.fridge());
  // the kitchen island: light wood panels, a green marble top, three wooden stools along its west side
  mb.box('cabdoor', 9.45, 0, 4.25, 10.2, .88, 5.85, { us: 1.2 }); mb.box('granite', 9.35, .88, 4.18, 10.27, .93, 5.92, { bev: .01, us: .6 }); hs(9.35, 0, 4.18, 10.27, .93, 5.92);
  for (const z of [4.55, 5.05, 5.55]) { mb.at(9.08, 0, z, 0, m => { m.lathe('oak', [[.17, .74], [.17, .78]], { seg: 14, cap: 't' }); m.lathe('beige', [[.15, .78], [.15, .8]], { seg: 14, cap: 't' }); for (let i = 0; i < 4; i++) { const a = i * HP + .785; m.tube('oak', [[Math.cos(a) * .13, 0, Math.sin(a) * .13], [Math.cos(a) * .1, .74, Math.sin(a) * .1]], [.016, .014], { seg: 5 }) } m.lathe('oak', [[.12, .3], [.12, .32]], { seg: 14 }) }); hs(8.92, 0, z - .16, 9.24, .8, z + .16) }
  mb.at(9.8, .93, 5.3, .3, m => { m.lathe('glass', [[.03, 0], [.03, .2], [.012, .26], [.012, .3]], { seg: 8, col: [.3, .5, .3, .2] }); m.lathe('porcelain', [[.0, 0], [.09, .005], [.1, .02]], { seg: 12, cx: -.25, cz: -.4 }) });
  mb.with(M4.mul(M4.tr(10.1, 2.1, 9.94), M4.rx(-HP)), m => MOD.wallClock(m));
  mb.at(10.48, 0, 3.87, PI, m => MOD.counter(m, 1.64)); hs(9.66, 0, 3.5, 11.3, .92, 4.2); mb.at(10.48, 1.5, 3.72, PI, m => MOD.upperCabinets(m, 1.64)); mb.box('tile', 9.66, .92, 3.52, 11.3, 1.5, 3.54, { skip: 's', us: 1 });
  // the oven tower: tall cabinet with two black ovens
  mb.box('cabdoor', 9.0, 0, 3.52, 9.66, 2.25, 4.15, { us: 1 }); hs(9.0, 0, 3.5, 9.66, 2.25, 4.15);
  for (const [y0, y1] of [[.75, 1.32], [1.36, 1.93]]) { mb.box('ovenblack', 9.06, y0, 4.15, 9.6, y1, 4.17, { fit: 1 }); mb.box('chrome', 9.1, y1 - .08, 4.17, 9.56, y1 - .06, 4.19) }
  mb.decal('wallswitch', 8.53, 1.2, 4.45, .08, .12, 'w');
  // the little bathroom downstairs
  mb.at(11.4, 0, .37, PI, m => MOD.toilet(m)); hs(11.2, 0, .06, 11.6, .8, .75); mb.at(9.5, 0, .28, PI, m => MOD.pedestalSink(m)); hs(9.22, 0, .06, 9.78, .85, .5);
  mirror('s', 9.5, 1.55, .075, .5, .65); lStretch(() => mb.box('tile', 8.66, 0, .06, 11.94, 1.2, .075, { skip: 'n', us: 1 }));
  inter('bathmirror0', [9.2, 1.1, 0, 9.8, 1.9, .3], 'Mirror', () => P2S.look('mirror'));
  // ================================================================ ROOMS, upstairs
  const Y = 3;
  // HITORI'S ROOM (x 8.6-12, z 5-10): the room from the title screen
  mb.at(10.1, Y, 5.35, PI, m => MOD.wardrobe(m)); hs(9.3, Y, 5.06, 10.9, Y + 2.15, 5.68);
  // the photographs, taped to the wardrobe doors
  H3.polPos = [[10.28, Y + 1.52, -.08], [10.47, Y + 1.38, .1], [10.66, Y + 1.56, .05], [10.42, Y + 1.7, -.12]];
  ['pol1', 'pol2', 'pol3', 'pol4'].forEach((k, i) => { const [x, y, rz] = H3.polPos[i]; mb.with(M4.chain(M4.tr(x, y, 5.69), M4.rz(rz)), m => { m.box('paper', -.045, -.055, 0, .045, .055, .004, { tf: { s: k }, fit: 1 }); m.box('glassw', -.016, .045, .004, .016, .06, .006, { col: [.95, .9, .7, .1] }) }) });
  mb.decal('poster', 9.65, Y + 1.55, 5.685, .42, .55, 's');
  inter('wardrobe', [9.3, Y, 5.0, 10.9, Y + 2.15, 5.8], 'Polaroids', () => P2S.polaroids());
  // the desk against the east wall with the old computer; the chair is its own object so it can be pulled out
  mb.at(11.62, Y, 7.35, HP, m => MOD.desk(m)); hs(11.28, Y, 6.65, 11.94, Y + .76, 8.05);
  mb.at(11.68, Y + .75, 7.25, HP, m => MOD.crt(m)); mb.at(11.4, Y + .75, 7.25, HP, m => MOD.keyboard(m)); mb.at(11.42, Y + .76, 7.72, HP, m => MOD.mouse(m)); mb.box('rug2', 11.36, Y + .75, 7.6, 11.5, Y + .753, 7.85, { skip: 'nsewb' });
  mb.at(11.6, Y + .75, 6.85, 0, m => { m.box('spine', -.08, 0, -.11, .08, .03, .11, { col: [.3, .3, .5, 0] }); m.box('spine', -.07, .03, -.1, .07, .055, .1, { col: [.5, .3, .3, 0] }) });
  inter('computer', [11.2, Y + .7, 6.8, 11.95, Y + 1.25, 7.8], 'Computer', () => P2S.computer());
  H3.chair = { obj: lRaw(() => single(m => MOD.officeChair(m))), x: LM(10.95, 7.25, 3)[0], z: LM(10.95, 7.25, 3)[1], ry: -HP, solid: hs(10.7, Y, 7, 11.2, Y + .6, 7.5) }; H3.extra.chair = H3.chair.obj;
  mWindow(mb, 'w', 11.94, Y + 1.5, 8.95, 1.3, 1.3, { blinds: 1 });
  mFrame(mb, 'painting', 'w', 11.94, Y + 1.75, 6.0, .45, .55);
  // the bed along the west wall, head at the south wall; the nightstand (pills, phone) by its head
  mb.at(9.19, Y, 8.87, 0, m => MOD.bed(m, 1.05, 2.05, 'duvetflor', 'trimw')); hs(8.66, Y, 7.82, 9.72, Y + .6, 9.94);
  inter('bed', [8.66, Y, 7.82, 9.72, Y + .7, 9.94], 'Bed', () => P2S.bed());
  mb.at(9.98, Y, 9.7, 0, m => MOD.nightstand(m)); hs(9.74, Y, 9.5, 10.22, Y + .55, 9.92);
  H3.extra.pills = single(m => m.at(9.9, Y + .55, 9.66, 0, mm => MOD.pills(mm)));
  inter('pills', [9.84, Y + .5, 9.58, 9.98, Y + .7, 9.76], 'Pill bottle', () => P2S.pills());
  H3.extra.phone = lRaw(() => single(m => MOD.phone(m))); H3.extra.phone.M = M4.mul(M4.tr(...L3P([10.08, Y + .552, 9.66])), M4.ry(.3));
  inter('phone', [10.0, Y + .5, 9.55, 10.2, Y + .65, 9.78], 'Phone', () => P2S.phone(), () => !P2.f.thrown);
  H3.extra.phonebroken = lRaw(() => single(m => { m.box('darkplastic', -.036, 0, -.075, .036, .009, .075, { bev: .003, tf: { t: 'phonebroken' }, fit: 1 }); m.box('darkplastic', .05, 0, .02, .065, .004, .045); m.box('phonebroken', -.07, 0, .07, -.05, .003, .085, { fit: 1 }) }, false));
  H3.brokenAt = L3P([9.5, Y + .005, 5.85]); H3.extra.phonebroken.M = M4.tr(...H3.brokenAt);
  H3.brokenInter = inter('brokenphone', [9.35, Y, 5.7, 9.65, Y + .2, 6.0], 'Broken phone', () => P2S.look('brokenphone'), () => P2.f.thrown);
  // the little table by the window with the big lamp, the controller and some games
  mb.at(11.66, Y, 9.55, -HP, m => MOD.nightstand(m)); hs(11.45, Y, 9.3, 11.88, Y + .55, 9.8); mb.at(11.68, Y + .55, 9.62, 0, m => MOD.tableLamp(m, .48));
  mb.at(11.6, Y + .55, 9.38, .4, m => { m.box('controller', -.07, 0, -.045, .07, .025, .045, { bev: .01 }); m.box('gamecase', .09, 0, -.07, .2, .015, .07, { fit: 1 }); m.box('gamecase', .095, .015, -.065, .205, .03, .075, { fit: 1 }) });
  inter('games', [11.4, Y + .5, 9.2, 11.9, Y + .7, 9.5], 'Games', () => P2S.look('games'));
  mb.box('rug', 9.85, Y + .003, 6.3, 11.15, Y + .012, 8.4, { skip: 'nsewb', fit: 1 });
  mFrame(mb, 'poster2', 'n', 10.65, Y + 1.7, 9.94, .5, .65, 'darkplastic'); mFrame(mb, 'poster4', 'n', 9.55, Y + 1.75, 9.94, .42, .58, 'darkplastic'); mFrame(mb, 'poster5', 'n', 9.05, Y + 1.68, 9.94, .38, .52, 'darkplastic'); mFrame(mb, 'poster3', 'e', 8.66, Y + 1.75, 5.5, .4, .55, 'darkplastic');
  mb.decal('wallswitch', 8.67, Y + 1.2, 7.05, .08, .12, 'e');
  // the sister's room (x 8.6-12, z 0-5): almost empty. A mattress, boxes, pale squares where posters used to be
  lStretch(() => mb.box('ghostwall', 8.66, Y + .1, .06, 11.94, Y + 2.8, .075, { skip: 'n', us: 1.4 })); mb.box('mattress', 10.2, Y, .2, 11.8, Y + .22, 2.2, { bev: .04, us: .8 }); hs(10.2, Y, .2, 11.8, Y + .25, 2.2);
  mb.at(9.4, Y, 4.2, .2, m => MOD.boxes(m, 7, 2)); mb.at(10.1, Y, 4.3, -.1, m => { m.box('cardboard', -.3, 0, -.25, .3, .45, .25, { us: .5 }); m.box('boxname', -.25, .1, -.255, .25, .4, -.25, { fit: 1 }) }); hs(9, Y, 3.8, 10.45, Y + .9, 4.7);
  mb.at(11.68, Y, 3.8, -HP, m => { m.box('walnut', -.8, 0, -.18, .8, 1.8, .18, { skip: 'n' }); for (const y of [.4, .9, 1.4]) m.box('walnut', -.78, y, -.16, .78, y + .02, .17) }); hs(11.5, Y, 3, 11.94, Y + 1.8, 4.6);
  inter('sisbox', [9.75, Y, 3.95, 10.45, Y + .6, 4.6], 'Box', () => P2S.look('sisbox')); inter('sisroom', [10.2, Y, .2, 11.8, Y + .4, 2.2], 'Mattress', () => P2S.look('sisroom'));
  mWindow(mb, 'w', 11.94, Y + 1.5, 2.2, 1.1, 1.2, {});
  // the bathroom upstairs (x 0-4, z 0-4.5)
  mb.at(1.0, Y, .48, 0, m => MOD.bathtub(m)); hs(.15, Y, .1, 1.85, Y + .6, .85); mb.at(3.45, Y, .37, PI, m => MOD.toilet(m)); hs(3.25, Y, .06, 3.65, Y + .8, .75);
  mb.box('tile', .1, Y, .9, 1.9, Y + .6, 1.0, { us: 1 }); mb.box('tile', 1.85, Y, .06, 1.95, Y + .6, 1.0, { us: 1 }); hs(.1, Y, .85, 1.95, Y + .6, 1.0);
  lStretch(() => mb.box('tile', .06, Y, .06, 1.95, Y + 2.0, .075, { skip: 'n', us: 1 })); mb.box('tile', .06, Y, .06, .075, Y + 2.0, .98, { skip: 'w', us: 1 });
  mb.at(2.45, Y, .3, PI, m => { m.box('vanity', -.42, .08, -.24, .42, .84, .24, { skip: 's', fit: 1 }); m.box('dark', -.4, 0, -.22, .4, .08, .22); m.box('marble', -.45, .84, -.27, .45, .88, .27, { bev: .008 }); m.box('porcelain', -.2, .86, -.16, .2, .885, .14, { skip: 'nsewb' }); m.tube('chrome', [[0, .88, .2], [0, 1.02, .2], [0, 1.04, .1]], [.012, .012, .01], { seg: 6 }) }); hs(2.0, Y, .06, 2.9, Y + .88, .57);
  mirror('s', 2.45, Y + 1.6, .075, .6, .75); lStretch(() => mb.box('tilef', .06, Y, .06, 3.94, Y + .004, 4.44, { skip: 'nsewb', us: .7 })); mb.box('rug2', 2.1, Y + .005, 1.2, 3.1, Y + .012, 1.8, { skip: 'nsewb', fit: 1 });
  for (const x of [1.95, 2.95]) mb.at(x, Y + 1.7, .1, 0, m => { m.box('brass', -.03, -.06, -.03, .03, .06, .0); m.tube('brass', [[0, 0, .0], [0, .02, .08], [0, .1, .1]], [.008, .008, .008], { seg: 5 }); m.lathe('lamp', [[.06, .1], [.04, .2]], { cz: .1, seg: 10 }) });
  mb.at(.4, Y, 4.12, 0, m => MOD.plant(m, false)); hs(.2, Y, 3.92, .6, Y + .9, 4.32);
  mb.at(3.62, Y, 2.65, -HP, m => { m.lathe('porcelain', [[.12, 0], [.16, .3], [.19, .38], [.18, .42]], { seg: 16, sz: 1.4 }); m.tube('chrome', [[0, .42, -.16], [0, .5, -.14]], [.01, .008], { seg: 6 }) }); hs(3.4, Y, 2.4, 3.94, Y + .45, 2.9);
  mb.box('trimw', 2.95, Y + 1.05, .06, 3.95, Y + 2.25, .08); for (const yy of [1.2, 1.55, 1.9]) { mb.box('oak', 3.0, Y + yy, .08, 3.9, Y + yy + .025, .3); const R2b = rng(yy * 100 | 0); for (let i = 0; i < 9; i++) mb.lathe('bottle', [[.025, 0], [.025, .1 + R2b() * .06], [.01, .15 + R2b() * .05]], { cx: 3.06 + i * .095, cz: .19, seg: 8, yf: () => Y + yy + .025, col: [[.3, .7, .6, .2], [.8, .4, .6, .2], [.3, .5, .9, .2], [.9, .8, .3, .2]][i % 4] }) }
  mb.at(.45, Y, 3.0, HP, m => MOD.chair(m, 'oak', 'beige')); hs(.2, Y, 2.75, .7, Y + .5, 3.25); inter('mirror', [2.05, Y + 1.1, 0, 2.65, Y + 1.9, .3], 'Mirror', () => P2S.look('mirror'));
  // the parents' room (x 0-4, z 4.5-10): a made bed and a dresser under dust sheets
  lStretch(() => { for (const [x0, z0, x1, z1] of [[.06, 4.62, .075, 9.94], [3.925, 4.62, 3.94, 9.94], [.06, 4.62, 3.94, 4.635], [.06, 9.925, 3.94, 9.94]]) mb.box('wallp', x0, Y, z0, x1, Y + 2.8, z1, { us: 1.4 }) });
  mb.at(1.09, Y, 7.4, -HP, m => MOD.bed(m, 1.6, 2.05, 'stripes', 'trimw')); hs(.06, Y, 6.6, 2.15, Y + .6, 8.2);
  for (const z of [6.3, 8.5]) { mb.at(.3, Y, z, -HP, m => { m.box('vanity', -.24, 0, -.2, .24, .55, .2, { fit: 1 }); m.box('trimw', -.25, .55, -.21, .25, .58, .21) }); mb.at(.3, Y + .58, z, 0, m => MOD.tableLamp(m, .48)); hs(.08, Y, z - .24, .52, Y + .6, z + .24) }
  mb.at(2.6, Y, 4.92, PI, m => { m.box('vanity', -.6, 0, -.24, .6, .9, .24, { fit: 1 }); m.box('trimw', -.62, .9, -.26, .62, .93, .26); for (const x of [-.3, .3]) { m.lathe('lamp', [[.05, .93], [.04, 1.15]], { cx: x, seg: 8 }); m.lathe('lamp', [[.09, 1.15], [.06, 1.28]], { cx: x, seg: 10 }) } }); hs(1.98, Y, 4.66, 3.22, Y + .95, 5.18);
  mFrame(mb, 'portrait', 's', 2.6, Y + 1.75, 4.65, .6, .75, 'walnut');
  for (const x of [1.3, 1.8]) { mb.at(x, Y, 5.05, 0, m => MOD.chair(m, 'oak', 'beige')); mb.box('dustsheet', x - .27, Y + .05, 4.8, x + .27, Y + 1.0, 5.33, { bev: .08 }); hs(x - .25, Y, 4.82, x + .25, Y + 1, 5.3) }
  mb.at(3.6, Y, 9.55, 0, m => { m.lathe('trimw', [[.16, 0], [.12, .06], [.07, .1], [.06, .9], [.14, .96], [.14, 1.0]], { seg: 14 }); m.lathe('porcelain', [[.04, 1.0], [.09, 1.1], [.07, 1.3], [.03, 1.36]], { seg: 12 }) }); hs(3.42, Y, 9.37, 3.78, Y + 1.36, 9.73);
  inter('parents', [.2, Y, 6.6, 2.1, Y + .7, 8.2], 'Bed', () => P2S.look('parents'));
  mWindow(mb, 'e', .06, Y + 1.55, 9.1, 1.1, 1.1, { blinds: 1 }); mWindow(mb, 'n', 2, Y + 1.5, 9.94, 1.2, 1.1, { blinds: 1 });
  mFrame(mb, 'painting', 'w', 8.54, Y + 1.7, 4.4, 1.1, .8, 'walnut'); mFrame(mb, 'painting', 'w', 3.92, Y + 1.7, 7.4, 1.2, .8, 'walnut');
  mb.box('rug', 1.4, Y + .003, 5.9, 3.7, Y + .012, 9.2, { skip: 'nsewb', fit: 1 });
  // ceiling lamps
    for (const [x, z, y] of [[10.3, 6.5, 2.8], [2, 7, 2.8], [10.3, 7.5, 5.8], [6.2, 2, 2.8], [10.3, 1.8, 2.8], [2, 2.2, 5.8], [2, 7, 5.8], [10.3, 2.5, 5.8]]) mb.at(x, 0, z, 0, m => MOD.ceilingLamp(m, y));
  // ---- doors
  door('living', 4, 9.05, 0, 'z', -1, { name: 'Door' }); door('storage', 1.5, 4, 0, 'x', -1, { locked: 'It won\'t open. Something heavy is leaning on it from the other side.', name: 'Storage' });
  door('bath0', 8.6, 1.2, 0, 'z', -1, { name: 'Bathroom' }); for (const z of [4.82, 7.98]) { mb.at(8.6, 0, z, 0, m => { m.box('trimw', -.16, 0, -.16, .16, .3, .16, { bev: .01 }); m.lathe('trimw', [[.1, .3], [.09, .5], [.08, 2.0], [.11, 2.1]], { seg: 16 }); m.box('trimw', -.14, 2.1, -.14, .14, 2.8, .14) }); hs(8.44, 0, z - .16, 8.76, 2.8, z + .16) }
  lStretch(() => mb.box('trimw', 8.48, 2.1, 4.7, 8.72, 2.8, 8.1));
  door('hitori', 8.6, 6, 1, 'z', -1, { name: 'Door', locked: () => P2S.hitoriDoorLocked() }); door('sister', 8.6, 2, 1, 'z', -1, { name: 'Door', locked: () => P2S.sisterLocked() });
  door('ubath', 4, 1.5, 1, 'z', 1, { name: 'Bathroom' }); door('parents', 4, 9.05, 1, 'z', 1, { name: 'Door' });
  for (const d of H3.doors) { d.obj = d.mb.build() }
  H3.world = mb.build(); H3.ext = ext.build(); H3.ext.vis = false;
  for (const k in H3.extra) if (H3.extra[k] instanceof MB) H3.extra[k] = H3.extra[k].build();
  LAYOUT.on = false;
  H3.solids.push({ x0: -1, y0: -5, z0: -1, x1: 0, y1: 10, z1: HOUSE_D + 1 }, { x0: HOUSE_W, y0: -5, z0: -1, x1: HOUSE_W + 1, y1: 10, z1: HOUSE_D + 1 }, { x0: -1, y0: -5, z0: -1, x1: HOUSE_W + 1, y1: 10, z1: 0 }, { x0: -1, y0: -5, z0: HOUSE_D, x1: HOUSE_W + 1, y1: 10, z1: HOUSE_D + 1 });
}
// the floor under you: the stairs ramp from y 0 at z 9 to y 3 at z 4; elsewhere you're on whichever floor you were on
function houseFloor(x, z, y) {
  if (x > 5.66 && x < 7.42 && z > 6 && z < 12.75) return clamp(3 * (12.6 - z) / 6.6, 0, 3);
  return y > 1.5 ? 3 : 0;
}
// which room are you in (for whispers, scares and the story)
function roomAt(x, z, y) {
  const r = lRoomNew(clamp(x, 0, HOUSE_W), clamp(z, 0, HOUSE_D), y); if (!r) return 'hall';
  if (r.id == 'hall') return z < 5.2 ? 'corridor' : 'hall'; return r.id;
}
