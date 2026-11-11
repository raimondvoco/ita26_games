// ==================== PART TWO: furniture and things, modelled ====================
// Every model is built facing -z with its feet on y = 0 around x = 0, then placed with mb.at(x, y, z, turn, fn).
// Turns: 0 faces -z (north), Math.PI faces +z (south), -Math.PI/2 faces +x (east), Math.PI/2 faces -x (west).
const PI = Math.PI, HP = Math.PI / 2;
function texModels() {
  if (TX.oak) return;
  tex('oak', 64, (g, s) => { texNoise(g, s, '#8a6440', .1, 51, 1); for (let y = 0; y < s; y++) { g.fillStyle = 'rgba(60,34,14,' + (.06 + .06 * Math.sin(y * .9 + Math.sin(y * .23) * 3)) + ')'; g.fillRect(0, y, s, 1) } for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(50,28,10,.25)'; g.beginPath(); g.ellipse(12 + i * 21, 20 + i * 13, 3, 1.4, 0, 0, 7); g.fill() } });
  tex('walnut', 64, (g, s) => { texNoise(g, s, '#4a3020', .1, 52, 1); for (let y = 0; y < s; y++) { g.fillStyle = 'rgba(20,10,4,' + (.08 + .07 * Math.sin(y * .7 + Math.sin(y * .31) * 2)) + ')'; g.fillRect(0, y, s, 1) } });
  tex('lacquer', 32, (g, s) => texNoise(g, s, '#1a1618', .06, 53, 1));
  tex('cushion', 64, (g, s) => { texNoise(g, s, '#4a4048', .14, 54, 1); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 0, s, 1); g.fillRect(0, s - 1, s, 1) });
  tex('sofa', 64, (g, s) => { texNoise(g, s, '#5a4a52', .16, 55, 1); for (let y = 0; y < s; y += 2) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(0, y, s, 1) } });
  tex('duvet', 64, (g, s) => { texNoise(g, s, '#6a6a80', .1, 56, 1); for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, i * 8, s, 3) } g.strokeStyle = 'rgba(40,40,60,.25)'; for (let x = 0; x < s; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, s); g.stroke() } });
  tex('duvet2', 64, (g, s) => { texNoise(g, s, '#c8c0b4', .08, 57, 1); for (let i = 0; i < s; i += 6) { g.fillStyle = 'rgba(120,100,80,.12)'; g.fillRect(i, 0, 1, s) } });
  tex('linen', 32, (g, s) => texNoise(g, s, '#d8d4cc', .07, 58, 1));
  tex('rug', 64, (g, s) => { texNoise(g, s, '#5a2a30', .2, 59, 1); g.strokeStyle = '#c8a070'; g.lineWidth = 2; g.strokeRect(4, 4, s - 8, s - 8); g.strokeStyle = '#2a1018'; g.strokeRect(9, 9, s - 18, s - 18); g.fillStyle = '#c8a070'; g.beginPath(); g.moveTo(32, 18); g.lineTo(46, 32); g.lineTo(32, 46); g.lineTo(18, 32); g.closePath(); g.fill(); g.fillStyle = '#3a1820'; g.beginPath(); g.moveTo(32, 24); g.lineTo(40, 32); g.lineTo(32, 40); g.lineTo(24, 32); g.closePath(); g.fill() });
  tex('rug2', 64, (g, s) => { texNoise(g, s, '#3a3a52', .22, 60, 1); for (let y = 6; y < s; y += 12) { g.fillStyle = 'rgba(200,180,220,.12)'; g.fillRect(0, y, s, 3) } });
  tex('chrome', 16, (g, s) => { const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, '#e8eaf0'); gr.addColorStop(.5, '#8a8e98'); gr.addColorStop(1, '#d0d4dc'); g.fillStyle = gr; g.fillRect(0, 0, s, s) });
  tex('plastic', 32, (g, s) => texNoise(g, s, '#c8c0aa', .05, 61, 1));
  tex('darkplastic', 32, (g, s) => texNoise(g, s, '#24242a', .06, 62, 1));
  tex('keys', 64, (g, s) => { g.fillStyle = '#b8b09c'; g.fillRect(0, 0, s, s); for (let r2 = 0; r2 < 5; r2++) for (let c = 0; c < 15; c++) { g.fillStyle = '#d8d2c0'; g.fillRect(1 + c * 4.2, 2 + r2 * 12, 3.4, 9); g.fillStyle = '#9a947e'; g.fillRect(1 + c * 4.2, 10 + r2 * 12, 3.4, 1) } g.fillStyle = '#d8d2c0'; g.fillRect(14, 50, 30, 9) });
  tex('crtscreen', 64, (g, s) => { const gr = g.createRadialGradient(32, 30, 4, 32, 32, 44); gr.addColorStop(0, '#2a4a7a'); gr.addColorStop(1, '#0a1428'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#4a8ad8'; g.fillRect(0, 54, s, 10); g.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < s; y += 2) g.fillRect(0, y, s, 1); g.fillStyle = '#e8f0ff'; g.fillRect(24, 26, 16, 2); g.fillRect(28, 22, 8, 2) });
  tex('crtoff', 32, (g, s) => { const gr = g.createRadialGradient(14, 12, 2, 16, 16, 22); gr.addColorStop(0, '#2a3034'); gr.addColorStop(1, '#0a0c0e'); g.fillStyle = gr; g.fillRect(0, 0, s, s) });
  tex('shade', 32, (g, s) => { texNoise(g, s, '#e8d8b4', .06, 63, 1); g.fillStyle = 'rgba(160,120,70,.25)'; g.fillRect(0, 0, s, 2); g.fillRect(0, s - 2, s, 2) });
  tex('glassw', 16, (g, s) => { g.fillStyle = '#f4f0e4'; g.fillRect(0, 0, s, s) });
  tex('spine', 32, (g, s) => { g.fillStyle = '#c8c0b0'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 4, s, 2); g.fillRect(0, s - 6, s, 2); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(0, 12, s, 6) });
  tex('paper', 16, (g, s) => texNoise(g, s, '#e8e4d8', .05, 64, 1));
  tex('cardboard', 64, (g, s) => { texNoise(g, s, '#9a7448', .1, 65, 1); g.fillStyle = 'rgba(200,170,120,.45)'; g.fillRect(28, 0, 8, s); g.fillStyle = 'rgba(60,40,20,.2)'; for (let i = 0; i < s; i += 3) g.fillRect(0, i, s, 1) });
  tex('granite', 64, (g, s) => { texNoise(g, s, '#3a3a3e', .3, 66, 1); const R = rng(67); for (let i = 0; i < 120; i++) { g.fillStyle = R() < .5 ? 'rgba(220,220,230,.35)' : 'rgba(0,0,0,.4)'; g.fillRect(R() * s, R() * s, 1, 1) } });
  tex('cabdoor', 64, (g, s) => { texNoise(g, s, '#d8d0c0', .05, 68, 1); g.strokeStyle = '#a89c88'; g.lineWidth = 2; g.strokeRect(6, 6, s - 12, s - 12); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.strokeRect(8.5, 8.5, s - 17, s - 17) });
  tex('drawer', 64, (g, s) => { texNoise(g, s, '#d8d0c0', .05, 69, 1, 32); g.strokeStyle = '#a89c88'; g.lineWidth = 2; g.strokeRect(4, 4, s - 8, 24) }, 32);
  tex('fridgew', 32, (g, s) => texNoise(g, s, '#e4e4e0', .03, 70, 1));
  tex('fridgein', 32, (g, s) => texNoise(g, s, '#f0f2f4', .03, 71, 1));
  tex('ovenwin', 32, (g, s) => { g.fillStyle = '#0c0c0e'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(4, 3, 3, 20); g.fillRect(9, 3, 1, 20) });
  tex('cooktop', 64, (g, s) => { g.fillStyle = '#121214'; g.fillRect(0, 0, s, s); for (const [x, y, r2] of [[17, 17, 11], [47, 17, 9], [17, 47, 9], [47, 47, 11]]) { g.strokeStyle = '#3a3a3e'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r2, 0, 7); g.stroke(); g.beginPath(); g.arc(x, y, r2 - 5, 0, 7); g.stroke() } g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(4, 2, 2, 60) });
  tex('steel', 32, (g, s) => { texNoise(g, s, '#a0a4aa', .08, 72, 1); for (let x = 0; x < s; x++) { g.fillStyle = 'rgba(255,255,255,' + (x % 3 ? 0 : .05) + ')'; g.fillRect(x, 0, 1, s) } });
  tex('glass', 16, (g, s) => { g.fillStyle = '#5a6a78'; g.fillRect(0, 0, s, s) });
  tex('leaf', 32, (g, s) => { g.clearRect(0, 0, s, s); const R = rng(73); for (let i = 0; i < 9; i++) { g.fillStyle = ['#3a4a2a', '#4a5a30', '#5a5a34', '#6a5a30'][i % 4]; g.save(); g.translate(16, 30); g.rotate(-1.2 + i * .3 + R() * .1); g.beginPath(); g.ellipse(0, -11, 3, 11, 0, 0, 7); g.fill(); g.restore() } });
  tex('soil', 16, (g, s) => texNoise(g, s, '#2a1c14', .3, 74, 1));
  tex('terracotta', 32, (g, s) => texNoise(g, s, '#9a5a3a', .1, 75, 1));
  tex('clockface', 64, (g, s) => { g.fillStyle = '#f0ece0'; g.fillRect(0, 0, s, s); g.fillStyle = '#222'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.fillRect(32 + Math.sin(a) * 26 - 1, 32 - Math.cos(a) * 26 - 1, i % 3 ? 2 : 3, i % 3 ? 2 : 3) } g.fillRect(31, 12, 2, 20); g.fillRect(31, 32, 2, 16); g.beginPath(); g.arc(32, 32, 2.5, 0, 7); g.fill() });
  tex('curtain', 32, (g, s) => { texNoise(g, s, '#4a3440', .1, 76, 1); for (let x = 0; x < s; x += 4) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, 0, 1, s); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + 2, 0, 1, s) } });
  tex('panel', 64, (g, s) => { texNoise(g, s, '#5e4230', .08, 77, 1); for (let y = 0; y < s; y += 2) { g.fillStyle = 'rgba(30,16,6,' + (.05 + .04 * Math.sin(y * .6)) + ')'; g.fillRect(0, y, s, 1) } });
  tex('brass', 16, (g, s) => { const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, '#f0d890'); gr.addColorStop(.5, '#a8803a'); gr.addColorStop(1, '#d8b868'); g.fillStyle = gr; g.fillRect(0, 0, s, s) });
  tex('label', 32, (g, s) => { g.fillStyle = '#f4f0e8'; g.fillRect(0, 0, s, s); g.fillStyle = '#3a3a5a'; for (let i = 0; i < 4; i++) g.fillRect(4, 8 + i * 4, 24 - i * 5, 2); g.fillStyle = '#c83a3a'; g.fillRect(4, 3, 10, 3) });
  tex('pillorange', 16, (g, s) => { g.fillStyle = '#d08020'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(3, 0, 2, s) });
  tex('carton', 32, (g, s) => { g.fillStyle = '#f0f0f0'; g.fillRect(0, 0, s, s); g.fillStyle = '#3a6ac8'; g.fillRect(0, 10, s, 10); g.fillStyle = '#fff'; g.fillRect(4, 13, 14, 3) });
  tex('takeout', 32, (g, s) => { g.fillStyle = '#e8e0d0'; g.fillRect(0, 0, s, s); g.fillStyle = '#c83a3a'; g.fillRect(6, 10, 20, 8) });
  tex('foodbox', 32, (g, s) => { texNoise(g, s, '#8a9a6a', .2, 78, 1) });
  tex('wallswitch', 16, (g, s) => { g.fillStyle = '#e8e4dc'; g.fillRect(0, 0, s, s); g.fillStyle = '#c8c4bc'; g.fillRect(6, 4, 4, 8) });
  tex('blanket2', 32, (g, s) => { texNoise(g, s, '#7a8a9a', .1, 79, 1); for (let x = 0; x < s; x += 8) { g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x, 0, 4, s) } });
  tex('dustsheet', 32, (g, s) => texNoise(g, s, '#b8b4a8', .12, 80, 2));
  tex('poster2', 64, (g, s) => { g.fillStyle = '#0e0e1a'; g.fillRect(0, 0, s, s); g.fillStyle = '#c84a8a'; g.beginPath(); g.arc(32, 26, 14, 0, 7); g.fill(); g.fillStyle = '#0e0e1a'; g.beginPath(); g.arc(37, 22, 12, 0, 7); g.fill(); g.fillStyle = '#e8e0f0'; g.fillRect(10, 48, 44, 3); g.fillRect(16, 54, 32, 2) });
  tex('poster3', 64, (g, s) => { g.fillStyle = '#e8e0d0'; g.fillRect(0, 0, s, s); g.fillStyle = '#1a1a1a'; for (let i = 0; i < 6; i++) g.fillRect(8, 8 + i * 8, 48 - (i % 3) * 10, 3); g.fillStyle = '#a01818'; g.fillRect(8, 54, 20, 4) });
}
// ---------------------------------------------------------------- the models
const MOD = {
  // a plain four-legged table: w (x) by d (z), h tall
  table(mb, w = 1.1, d = .75, h = .76, t = 'oak') {
    mb.box(t, -w / 2, h - .035, -d / 2, w / 2, h, d / 2, { bev: .012, us: .8 });
    mb.box(t, -w / 2 + .05, h - .12, -d / 2 + .05, w / 2 - .05, h - .035, -d / 2 + .07, { us: .8 }); mb.box(t, -w / 2 + .05, h - .12, d / 2 - .07, w / 2 - .05, h - .035, d / 2 - .05, { us: .8 });
    mb.box(t, -w / 2 + .05, h - .12, -d / 2 + .05, -w / 2 + .07, h - .035, d / 2 - .05, { us: .8 }); mb.box(t, w / 2 - .07, h - .12, -d / 2 + .05, w / 2 - .05, h - .035, d / 2 - .05, { us: .8 });
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) mb.lathe(t, [[.02, 0], [.026, h - .3], [.028, h - .035]], { cx: x * (w / 2 - .065), cz: z * (d / 2 - .065), seg: 8 });
  },
  // a dining chair (seat faces -z, back at +z)
  chair(mb, t = 'oak', cush = 'cushion') {
    mb.box(t, -.21, .42, -.2, .21, .455, .2, { bev: .01, us: .6 }); mb.box(cush, -.19, .455, -.18, .19, .48, .17, { bev: .015 });
    for (const [x, z] of [[-.18, -.17], [.18, -.17]]) mb.lathe(t, [[.016, 0], [.02, .42]], { cx: x, cz: z, seg: 8 });
    for (const x of [-.18, .18]) { mb.box(t, x - .02, 0, .15, x + .02, .95, .19, { us: .6 }) }
    mb.box(t, -.2, .78, .15, .2, .92, .185, { bev: .01, us: .6 }); for (const x of [-.09, 0, .09]) mb.box(t, x - .012, .46, .16, x + .012, .78, .18);
    mb.box(t, -.17, .12, -.15, -.15, .14, .15); mb.box(t, .15, .12, -.15, .17, .14, .15);
  },
  // an office chair on wheels, seat faces -z
  officeChair(mb) {
    for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; mb.with(M4.ry(a), m => { m.box('darkplastic', -.02, .05, -.3, .02, .085, 0); m.sphere('darkplastic', 0, .03, -.29, .028, .03, .028, { seg: 8, rings: 5 }) }) }
    mb.cyl('chrome', 0, .08, 0, .025, .32); mb.cyl('darkplastic', 0, .07, 0, .045, .1);
    mb.box('darkplastic', -.2, .4, -.21, .2, .43, .2); mb.box('sofa', -.22, .43, -.24, .22, .5, .22, { bev: .03, us: .5 });
    mb.box('darkplastic', -.03, .44, .2, .03, .62, .24); mb.box('sofa', -.21, .6, .2, .21, 1.02, .27, { bev: .03, us: .5 });
    for (const s of [-1, 1]) { mb.box('darkplastic', s * .22 - .015, .5, -.05, s * .22 + .015, .64, -.01); mb.box('darkplastic', s * .22 - .03, .64, -.16, s * .22 + .03, .67, .12, { bev: .01 }) }
  },
  sofa(mb, w = 2.2) {
    const d = .85; mb.box('sofa', -w / 2, .08, -d / 2, w / 2, .38, d / 2, { us: .6 });
    for (const x of [-w / 2 + .05, w / 2 - .05]) for (const z of [-d / 2 + .05, d / 2 - .05]) mb.cyl('walnut', x, 0, z, .025, .08);
    const n = 3, cw = (w - .4) / n; for (let i = 0; i < n; i++) { const x0 = -w / 2 + .2 + i * cw; mb.box('cushion', x0 + .01, .38, -d / 2 + .02, x0 + cw - .01, .52, d / 2 - .2, { bev: .04, us: .5 }); mb.box('cushion', x0 + .01, .38, d / 2 - .24, x0 + cw - .01, .9, d / 2 - .04, { bev: .05, us: .5 }) }
    for (const s of [-1, 1]) { mb.box('sofa', s * (w / 2 - .1) - .1, .08, -d / 2, s * (w / 2 - .1) + .1, .62, d / 2, { bev: .06, us: .5 }) }
    mb.box('sofa', -w / 2 + .1, .38, d / 2 - .06, w / 2 - .1, .82, d / 2, { us: .6 });
    mb.box('blanket2', -w / 2 + .25, .5, -d / 2 + .1, -w / 2 + .75, .56, d / 2 - .3, { bev: .02 });   // a blanket left in a heap
  },
  // a bed: head at +z, length l along z, width w
  bed(mb, w = 1.05, l = 2.05, sheet = 'duvet', frame = 'walnut') {
    mb.box(frame, -w / 2, .12, -l / 2, w / 2, .3, l / 2, { us: .8 }); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) mb.box(frame, x * w / 2 - (x > 0 ? .06 : 0), 0, z * l / 2 - (z > 0 ? .06 : 0), x * w / 2 + (x < 0 ? .06 : 0), .12, z * l / 2 + (z < 0 ? .06 : 0));
    mb.box(frame, -w / 2 - .03, 0, l / 2 - .02, w / 2 + .03, 1.0, l / 2 + .05, { bev: .02, us: .8 }); mb.box(frame, -w / 2 + .08, .45, l / 2 - .035, w / 2 - .08, .9, l / 2 - .02, { us: .8 });
    mb.box(frame, -w / 2 - .02, 0, -l / 2 - .04, w / 2 + .02, .45, -l / 2 + .01, { bev: .015, us: .8 });
    mb.box('linen', -w / 2 + .03, .3, -l / 2 + .03, w / 2 - .03, .5, l / 2 - .05, { bev: .04 });
    // the duvet hangs over the sides, turned down at the top
    mb.box(sheet, -w / 2 - .02, .32, -l / 2 + .01, w / 2 + .02, .56, l / 2 - .5, { bev: .05, us: .7 }); mb.box(sheet, -w / 2 + .02, .5, l / 2 - .62, w / 2 - .02, .585, l / 2 - .46, { bev: .03, us: .7 });
    mb.sphere('linen', -w / 4 + .02, .6, l / 2 - .26, w / 4 - .02, .07, .15, { seg: 10, rings: 6 }); mb.sphere('linen', w / 4 - .02, .6, l / 2 - .27, w / 4 - .04, .065, .14, { seg: 10, rings: 6 });
  },
  wardrobe(mb, w = 1.6, d = .58, h = 2.15) {
    mb.box('walnut', -w / 2, .08, -d / 2, w / 2, h - .06, d / 2, { us: .9 }); mb.box('walnut', -w / 2 + .03, 0, -d / 2 + .03, w / 2 - .03, .08, d / 2 - .02);
    mb.box('walnut', -w / 2 - .03, h - .06, -d / 2 - .04, w / 2 + .03, h, d / 2 + .01, { bev: .015 });
    for (const s of [-1, 1]) { const x0 = s < 0 ? -w / 2 + .03 : .006, x1 = s < 0 ? -.006 : w / 2 - .03; mb.box('panel', x0, .12, -d / 2 - .02, x1, h - .1, -d / 2, { us: .9 });
      for (const [y0, y1] of [[.2, .95], [1.05, h - .2]]) mb.box('panel', x0 + .06, y0, -d / 2 - .032, x1 - .06, y1, -d / 2 - .02, { bev: .01, us: .9 });
      mb.cyl('brass', s * .035, 1.0, -d / 2 - .04, .008, .14, { seg: 6 }) }
  },
  desk(mb, w = 1.4, d = .65, h = .75) {
    mb.box('oak', -w / 2, h - .035, -d / 2, w / 2, h, d / 2, { bev: .008, us: .8 });
    mb.box('oak', -w / 2 + .02, 0, -d / 2 + .02, -w / 2 + .05, h - .035, d / 2 - .02, { us: .8 });
    mb.box('oak', w / 2 - .42, 0, -d / 2 + .02, w / 2 - .02, h - .035, d / 2 - .02, { us: .8 });
    for (let i = 0; i < 3; i++) { const y0 = .04 + i * .23; mb.box('oak', w / 2 - .41, y0, -d / 2 + .005, w / 2 - .03, y0 + .21, -d / 2 + .02, { bev: .006, us: .8 }); mb.box('brass', w / 2 - .25, y0 + .1, -d / 2 - .005, w / 2 - .19, y0 + .115, -d / 2 + .005) }
    mb.box('oak', -w / 2 + .05, .3, d / 2 - .04, w / 2 - .42, h - .035, d / 2 - .02, { us: .8 });
  },
  // the old CRT monitor, screen facing -z, standing on the desk at y 0
  crt(mb, screenTex = 'crtscreen', mirr) {
    mb.box('plastic', -.07, 0, -.08, .07, .025, .08, { bev: .01 }); mb.box('plastic', -.04, .025, -.03, .04, .06, .05);
    mb.box('plastic', -.2, .06, -.2, .2, .42, -.12, { bev: .02 });
    const b = [[-.15, .1, .2], [.15, .1, .2], [.15, .38, .2], [-.15, .38, .2]], f = [[-.2, .06, -.12], [.2, .06, -.12], [.2, .42, -.12], [-.2, .42, -.12]];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; mb.quad('plastic', f[i], f[j], b[j], b[i]) } mb.quad('plastic', b[0], b[1], b[2], b[3]);
    mb.box('darkplastic', -.165, .1, -.205, .165, .38, -.2); mb.quad(screenTex, [-.155, .37, -.207], [.155, .37, -.207], [.155, .11, -.207], [-.155, .11, -.207], undefined, [1, 1, 1, .92]);
    mb.box('darkplastic', .12, .07, -.205, .16, .085, -.2); mb.box('chrome', .17, .072, -.206, .18, .082, -.2);
  },
  keyboard(mb) { mb.box('plastic', -.22, 0, -.075, .22, .02, .075, { bev: .006, tf: { t: 'keys' }, fit: 0, us: .44 }); mb.box('keys', -.21, .02, -.065, .21, .026, .065, { skip: 'nsewb', fit: 1 }); mb.tube('darkplastic', [[0, .01, -.075], [0, .01, -.2], [.05, .02, -.3]], [.004, .004, .004], { seg: 4 }) },
  mouse(mb) { mb.sphere('plastic', 0, 0, 0, .03, .022, .05, { seg: 10, rings: 6, p1: HP }); mb.box('darkplastic', -.001, .018, -.05, .001, .023, -.01) },
  tableLamp(mb, h = .5) {
    mb.lathe('brass', [[.08, 0], [.085, .015], [.03, .04], [.012, .06], [.01, h - .15]], { seg: 12, cap: 'b' }); mb.sphere('bulb', 0, h - .12, 0, .03, .04, .03, { seg: 8, rings: 5, col: [1, 1, 1, 1] });
    mb.lathe('shade', [[.17, h - .22], [.1, h]], { seg: 14, col: [1, 1, 1, .55] });
  },
  floorLamp(mb, h = 1.55) {
    mb.lathe('lacquer', [[.15, 0], [.15, .02], [.04, .04], [.012, .06], [.012, h - .2]], { seg: 12, cap: 'b' }); mb.sphere('bulb', 0, h - .15, 0, .035, .045, .035, { seg: 8, rings: 5, col: [1, 1, 1, 1] });
    mb.lathe('shade', [[.22, h - .3], [.14, h]], { seg: 16, col: [1, 1, 1, .5] });
  },
  bookshelf(mb, w = 1.9, h = 2, d = .32, seed = 21) {
    mb.box('walnut', -w / 2, 0, -d / 2, -w / 2 + .03, h, d / 2); mb.box('walnut', w / 2 - .03, 0, -d / 2, w / 2, h, d / 2); mb.box('walnut', -w / 2, 0, d / 2 - .01, w / 2, h, d / 2); mb.box('walnut', -w / 2 - .01, h - .03, -d / 2 - .01, w / 2 + .01, h, d / 2);
    const R = rng(seed), cols = [[.55, .2, .2], [.2, .3, .5], [.45, .45, .3], [.25, .25, .27], [.6, .5, .35], [.3, .45, .3], [.6, .58, .55]];
    for (let s = 0; s < 4; s++) { const y = .05 + s * (h - .1) / 4; mb.box('walnut', -w / 2 + .03, y - .025, -d / 2, w / 2 - .03, y, d / 2 - .01);
      let x = -w / 2 + .05; while (x < w / 2 - .1) { const bw = .025 + R() * .03, bh = .2 + R() * .14, bd = .17 + R() * .07; if (R() < .1) { x += .06; continue } const lean = R() < .07 && x > -w / 2 + .2;
        if (lean) mb.with(M4.mul(M4.tr(x, y, -d / 2 + .02 + bd / 2), M4.rz(-.25)), m => m.box('spine', 0, 0, -bd / 2, bw, bh, bd / 2, { col: [...cols[R() * 7 | 0], 0], fit: 1 }));
        else mb.box('spine', x, y, -d / 2 + .02, x + bw, y + bh, -d / 2 + .02 + bd, { col: [...cols[R() * 7 | 0], 0], fit: 1, tf: { t: 'paper', b: 'paper' } }); x += bw + .003 } }
  },
  // a fat old CRT television on a low cabinet; screen faces -z
  tv(mb, screen = 'tvstatic') {
    mb.box('walnut', -.5, .08, -.22, .5, .5, .22, { bev: .01, us: .8 }); for (const x of [-.45, .45]) mb.cyl('walnut', x, 0, 0, .03, .08); mb.box('lacquer', -.46, .14, -.225, -.01, .44, -.215); mb.box('lacquer', .01, .14, -.225, .46, .44, -.215);
    mb.box('darkplastic', -.33, .5, -.2, .33, .98, .12, { bev: .025 }); mb.box('darkplastic', -.25, .55, .12, .25, .92, .3, { bev: .03 });
    mb.box('lacquer', -.28, .56, -.205, .28, .93, -.2); mb.quad(screen, [-.26, .91, -.207], [.26, .91, -.207], [.26, .58, -.207], [-.26, .58, -.207], undefined, [1, 1, 1, .9]);
    mb.box('chrome', .22, .52, -.205, .26, .535, -.2);
  },
  coffeeTable(mb, w = .9, d = .55) { mb.box('walnut', -w / 2, .38, -d / 2, w / 2, .42, d / 2, { bev: .01, us: .7 }); mb.box('walnut', -w / 2 + .04, .1, -d / 2 + .04, w / 2 - .04, .12, d / 2 - .04, { us: .7 }); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) mb.box('walnut', x * (w / 2 - .04) - .02, 0, z * (d / 2 - .04) - .02, x * (w / 2 - .04) + .02, .38, z * (d / 2 - .04) + .02) },
  nightstand(mb) { mb.box('oak', -.24, .08, -.2, .24, .55, .2, { bev: .01, us: .6 }); mb.box('oak', -.21, .3, -.205, .21, .5, -.2, { bev: .005 }); mb.sphere('brass', 0, .4, -.215, .012, .012, .012, { seg: 6, rings: 4 }); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) mb.box('oak', x * .21 - .015, 0, z * .17 - .015, x * .21 + .015, .08, z * .17 + .015) },
  dresser(mb, w = 1.05, h = .85) { mb.box('walnut', -w / 2, .06, -.24, w / 2, h, .24, { bev: .01, us: .8 }); for (let i = 0; i < 3; i++) { const y0 = .1 + i * (h - .14) / 3; mb.box('walnut', -w / 2 + .03, y0, -.245, w / 2 - .03, y0 + (h - .14) / 3 - .02, -.24); for (const x of [-.25, .25]) mb.box('brass', x - .04, y0 + .1, -.255, x + .04, y0 + .115, -.245) } },
  // a toilet facing -z
  toilet(mb) {
    mb.lathe('porcelain', [[.12, 0], [.14, .05], [.15, .3], [.18, .4], [.18, .41]], { seg: 16, sz: 1.3, cz: -.05, cap: 'b' }); mb.lathe('porcelain', [[.18, .41], [.13, .41], [.11, .3]], { seg: 16, sz: 1.3, cz: -.05 });
    mb.lathe('porcelain', [[.185, .41], [.19, .43], [.13, .43]], { seg: 16, sz: 1.3, cz: -.05, col: [.97, .97, .97, 0] });
    mb.box('porcelain', -.2, .38, .14, .2, .78, .3, { bev: .02 }); mb.box('porcelain', -.21, .78, .13, .21, .81, .31, { bev: .01 }); mb.box('chrome', -.02, .811, .2, .02, .815, .24);
  },
  bathtub(mb, w = 1.7, d = .75) { const h = .55; mb.box('porcelain', -w / 2, 0, -d / 2, w / 2, h, d / 2, { skip: 't' }); const b = .07;
    for (const q of [[-w / 2, -d / 2, w / 2, -d / 2 + b], [-w / 2, d / 2 - b, w / 2, d / 2], [-w / 2, -d / 2, -w / 2 + b, d / 2], [w / 2 - b, -d / 2, w / 2, d / 2]]) mb.box('porcelain', q[0], h - .01, q[1], q[2], h, q[3], { skip: 'b' });
    mb.box('porcelain', -w / 2 + b, .08, -d / 2 + b, w / 2 - b, h, d / 2 - b, { skip: 't', tf: { b: 'porcelain' } }); mb.tube('chrome', [[w / 2 - .12, h, 0], [w / 2 - .12, h + .18, 0], [w / 2 - .25, h + .2, 0]], [.015, .015, .012], { seg: 6 }) },
  pedestalSink(mb) { mb.lathe('porcelain', [[.09, 0], [.07, .1], [.06, .6], [.1, .7]], { seg: 12 }); mb.box('porcelain', -.28, .7, -.22, .28, .85, .2, { bev: .03 }); mb.box('steel', -.2, .84, -.16, .2, .851, .1, { skip: 'nsewb' });
    mb.tube('chrome', [[0, .85, .14], [0, .97, .14], [0, .99, .05]], [.012, .012, .01], { seg: 6 }); for (const x of [-.12, .12]) mb.cyl('chrome', x, .85, .14, .018, .03) },
  // kitchen base cabinets with a worktop, len along x, front facing -z
  counter(mb, len, o = {}) {
    const d = .62, h = .9; mb.box('lacquer', -len / 2, 0, -d / 2 + .06, len / 2, .1, d / 2);
    mb.box('cabdoor', -len / 2, .1, -d / 2 + .02, len / 2, h - .04, d / 2, { skip: o.sink == null ? 'n' : 'nt', us: 1 });   // (no top under a sink: you'd see it through the bowls)
    const n = Math.round(len / .5), dw = len / n; for (let i = 0; i < n; i++) { const x0 = -len / 2 + i * dw; if (o.gap && x0 + dw / 2 > o.gap[0] && x0 + dw / 2 < o.gap[1]) continue;
      mb.box('cabdoor', x0 + .005, .12, -d / 2 + .005, x0 + dw - .005, h - .2, -d / 2 + .025, { fit: 1 }); mb.box('drawer', x0 + .005, h - .19, -d / 2 + .005, x0 + dw - .005, h - .05, -d / 2 + .025, { fit: 1 });
      mb.box('chrome', x0 + dw / 2 - .06, h - .125, -d / 2 - .01, x0 + dw / 2 + .06, h - .11, -d / 2 + .005); mb.box('chrome', x0 + (i % 2 ? .05 : dw - .065), .5, -d / 2 - .01, x0 + (i % 2 ? .065 : dw - .05), .7, -d / 2 + .005) }
    if (o.sink == null) mb.box('granite', -len / 2, h - .04, -d / 2 - .03, len / 2, h, d / 2, { bev: .008, us: .6 });
    else {   // the worktop built round the sink's hole
      const s = o.sink, { hw, z0, z1 } = SINKH;
      for (const q of [[-len / 2, -d / 2 - .03, s - hw, d / 2], [s + hw, -d / 2 - .03, len / 2, d / 2], [s - hw, -d / 2 - .03, s + hw, z0], [s - hw, z1, s + hw, d / 2]]) mb.box('granite', q[0], h - .04, q[1], q[2], h, q[3], { us: .6 });
      sinkN(mb, s) }
  },
  upperCabinets(mb, len) { const d = .34; mb.box('cabdoor', -len / 2, 0, -d / 2, len / 2, .72, d / 2, { skip: 'n' }); const n = Math.round(len / .5), dw = len / n;
    for (let i = 0; i < n; i++) { const x0 = -len / 2 + i * dw; mb.box('cabdoor', x0 + .005, .005, -d / 2 - .02, x0 + dw - .005, .715, -d / 2, { fit: 1 }); mb.box('chrome', x0 + (i % 2 ? .05 : dw - .065), .04, -d / 2 - .03, x0 + (i % 2 ? .065 : dw - .05), .2, -d / 2 - .02) }
    mb.box('cabdoor', -len / 2 - .02, .72, -d / 2 - .03, len / 2 + .02, .75, d / 2) },
  // built into a counter at local x: the cooktop and the oven door
  stove(mb, x) { mb.box('steel', x - .3, .1, -.315, x + .3, .86, -.29, { tf: { n: 'steel' } }); mb.decal('ovenwin', x, .42, -.316, .44, .26, 'n'); mb.box('chrome', x - .22, .6, -.34, x + .22, .62, -.32); for (let i = 0; i < 4; i++) mb.cyl('darkplastic', x - .18 + i * .12, .75, -.32, .022, .025, { seg: 8, r0: .022 });
    mb.box('cooktop', x - .3, .9, -.28, x + .3, .905, .28, { fit: 1, skip: 'nsewb' }) },
  // a fridge body (the doors are separate objects); front faces -z, hinge on the +x side
  fridgeBody(mb, w = .78, d = .72, h = 1.9) {
    const t = .04; mb.box('fridgew', -w / 2, 0, -d / 2 + .05, w / 2, h, d / 2, { skip: 'n', tf: { t: 'fridgew' } });
    const z0 = -d / 2 + .05; mb.box('fridgew', -w / 2, 0, z0, w / 2, .1, z0 + .02); mb.box('fridgew', -w / 2, h - t, z0, w / 2, h, z0 + .02); mb.box('fridgew', -w / 2, 0, z0, -w / 2 + t, h, z0 + .02); mb.box('fridgew', w / 2 - t, 0, z0, w / 2, h, z0 + .02);
    mb.box('fridgein', -w / 2 + t, .1, z0 + .02, w / 2 - t, h - t, d / 2 - t, { skip: 'n' });
    for (const y of [.55, .95, 1.4]) mb.box('glass', -w / 2 + t, y, -d / 2 + .07, w / 2 - t, y + .008, d / 2 - t, { col: [.85, .9, .95, .2] });
    mb.box('fridgew', -w / 2 + t, 1.45, -d / 2 + .06, w / 2 - t, 1.48, d / 2 - t);
    mb.box('fridgein', -w / 2 + t + .02, .12, -d / 2 + .1, w / 2 - t - .02, .4, d / 2 - .08, { bev: .02, col: [.85, .9, .9, 0] });   // the salad drawer
  },
  fridgeDoor(mb, w, h, hinge) {   // built round its hinge at x = 0; the panel runs towards -x
    mb.box('fridgew', -w, 0, -.06, 0, h, 0, { bev: .006, tf: { s: 'fridgein' } }); mb.box('chrome', -w + .03, h * .25, -.09, -w + .05, h * .75, -.06, { bev: .004 });
    mb.box('chrome', -w + .03, h * .25, -.075, -w + .05, h * .27, -.06); mb.box('chrome', -w + .03, h * .73, -.075, -w + .05, h * .75, -.06);
    if (h > 1) for (const y of [.3, .7, 1.05]) { mb.box('fridgein', -w + .05, y, .0, -.05, y + .1, .1); mb.box('glass', -w + .05, y + .1, .095, -.05, y + .14, .1, { col: [.8, .85, .9, .2] }) }
    if (h > 1) { mb.lathe('bottle', [[.03, .72], [.03, .9], [.012, .95], [.012, .98]], { cx: -w + .15, cz: .05, seg: 8, col: [.4, .7, .5, .1] }); mb.box('carton', -w + .25, .32, .01, -w + .33, .52, .09, { fit: 1 }) }
  },
  fridgeFood(mb) {   // what's left in it (local to the fridge body)
    mb.box('takeout', -.2, .56, -.1, -.02, .66, .08, { fit: 1 }); mb.box('foodbox', .04, .56, -.05, .22, .62, .12, { bev: .01 }); mb.lathe('bottle', [[.04, .96], [.04, 1.15], [.015, 1.2], [.015, 1.24]], { cx: .2, cz: .1, seg: 8, col: [.6, .3, .2, .1] });
    mb.lathe('plastic', [[.05, .96], [.05, 1.02]], { cx: -.15, cz: 0, seg: 10, cap: 't' }); mb.box('carton', -.08, .96, .05, .0, 1.16, .13, { fit: 1 });
  },
  toiletRoll(mb) { mb.lathe('linen', [[.055, 0], [.055, .1]], { seg: 10, cap: 't' }) },
  plant(mb, dead) { mb.lathe('terracotta', [[.1, 0], [.14, .26], [.155, .28], [.155, .3]], { seg: 12, cap: 'b' }); mb.box('soil', -.12, .27, -.12, .12, .275, .12, { skip: 'nsewb' });
    for (let i = 0; i < 5; i++) { const a = i * 1.26, h = .5 + (i % 2) * .2; mb.with(M4.mul(M4.tr(0, .27, 0), M4.ry(a)), m => m.quad('leaf', [-.18, h, 0], [.18, h, 0], [.18, 0, 0], [-.18, 0, 0], undefined, dead ? [.7, .6, .45, 0] : [1, 1, 1, 0])) } },
  wallClock(mb) { mb.lathe('lacquer', [[.15, 0], [.16, .02], [.16, .04], [.15, .045]], { seg: 20 }); mb.lathe('clockface', [[0, .046], [.145, .046]], { seg: 20 }) },
  coatStand(mb) { mb.lathe('walnut', [[.18, 0], [.18, .03], [.03, .06], [.022, 1.7], [.03, 1.75]], { seg: 10, cap: 'b' }); for (let i = 0; i < 4; i++) mb.with(M4.ry(i * HP), m => m.tube('walnut', [[0, 1.62, 0], [0, 1.66, -.1], [0, 1.72, -.13]], [.012, .01, .008], { seg: 5 }));
    mb.with(M4.ry(.4), m => m.lathe('sofa', [[.04, 1.6], [.13, 1.45], [.16, 1.1], [.15, 1.0]], { seg: 10, sz: .6, cz: -.08 })) },
  shoeRack(mb) { mb.box('walnut', -.45, 0, -.17, .45, .45, .17, { skip: 'n', us: .7 }); mb.box('walnut', -.43, .2, -.15, .43, .22, .15);
    for (const [x, y, c] of [[-.3, .22, 'lacquer'], [-.12, .22, 'lacquer'], [.12, .02, 'cushion'], [.3, .02, 'lacquer']]) { mb.box(c, x - .05, y, -.13, x + .05, y + .07, .14, { bev: .02 }) } },
  boxes(mb, seed, n = 3) { const R = rng(seed); let y = 0; for (let i = 0; i < n; i++) { const w = .4 + R() * .25, d = .35 + R() * .2, h = .28 + R() * .2, ox = (R() - .5) * .1; mb.box('cardboard', -w / 2 + ox, y, -d / 2, w / 2 + ox, y + h, d / 2, { us: .5 }); mb.box('paper', -w / 2 + ox + .02, y + h, -.025, w / 2 + ox - .02, y + h + .002, .025, { skip: 'nsewb' }); y += h } },
  ceilingLamp(mb, y) { mb.cyl('darkplastic', 0, y - .02, 0, .05, .02); mb.cyl('darkplastic', 0, y - .35, 0, .004, .33, { seg: 4 }); mb.lathe('glassw', [[.03, y - .35], [.14, y - .42], [.18, y - .5], [.15, y - .52], [.0, y - .53]], { seg: 14, col: [1, 1, 1, .8] }) },
  phone(mb) { mb.box('phone', -.036, 0, -.075, .036, .009, .075, { bev: .003, tf: { t: 'phonescr' }, fit: 1 }); mb.box('darkplastic', .012, .009, -.07, .026, .011, -.055) },
  pills(mb) { mb.lathe('pillorange', [[.024, 0], [.026, .005], [.026, .085], [.02, .09]], { seg: 10, cap: 'b', col: [1, 1, 1, .1] }); mb.lathe('label', [[.0265, .02], [.0265, .065]], { seg: 10, a0: -1.6, a1: 1.6 }); mb.lathe('linen', [[.028, .088], [.028, .11], [.0, .112]], { seg: 10 }) },
  oldPhone(mb) { mb.box('lacquer', -.09, 0, -.11, .09, .06, .1, { bev: .02 }); mb.lathe('linen', [[.045, .061], [.04, .062]], { seg: 10 }); mb.tube('lacquer', [[-.09, .085, 0], [-.05, .095, 0], [.05, .095, 0], [.09, .085, 0]], [.02, .016, .016, .02], { seg: 6 }) },
};
// a window let into a wall: a deep frame, a sill, glass with the night (or blinds) behind it, a cross bar, maybe curtains.
// face: the side of the wall you look at it from ('s' = you stand south of it, looking north...)
function mWindow(mb, face, cx, cy, cz, w, h, o = {}) {
  const ax = face == 'n' || face == 's' ? 'x' : 'z', s = face == 's' || face == 'e' ? 1 : -1;
  // build in a local frame: u along the wall, v up, out = towards the room
  const P = (u, v, out) => ax == 'x' ? [cx + u, cy + v, cz + s * out] : [cx + s * out, cy + v, cz + u];
  const bx = (t, u0, v0, o0, u1, v1, o1, oo) => { const a = P(u0, v0, o0), b = P(u1, v1, o1); mb.box(t, Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2]), Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2]), oo) };
  const hw = w / 2, hh = h / 2, fr = .055;
  mb.decal(o.blinds ? 'blinds' : 'night', cx, cy, cz, w, h, face, [1, 1, 1, o.blinds ? .3 : .6]);
  bx('linen', -hw - fr, -hh - fr, 0, hw + fr, -hh, .06); bx('linen', -hw - fr, hh, 0, hw + fr, hh + fr, .06); bx('linen', -hw - fr, -hh, 0, -hw, hh, .06); bx('linen', hw, -hh, 0, hw + fr, hh, .06);
  bx('linen', -.015, -hh, .008, .015, hh, .03); bx('linen', -hw, -.015, .008, hw, .015, .03);
  bx('linen', -hw - .09, -hh - fr - .035, 0, hw + .09, -hh - fr, .14, { bev: .008 });   // the sill
  if (o.curtains) for (const k of [-1, 1]) { for (let i = 0; i < 4; i++) { const u = k * (hw + .02 + i * .07); bx('curtain', u - .045, -hh - .25, .08 + (i % 2) * .03, u + .045, hh + .2, .12 + (i % 2) * .03) } bx('chrome', -hw - .35, hh + .2, .1, hw + .35, hh + .22, .12) }
  if (o.blinds) bx('linen', -hw, hh - .05, .03, hw, hh, .06);
}
// a picture in a frame on a wall
function mFrame(mb, t, face, cx, cy, cz, w, h, frame = 'lacquer') {
  const d = .02, ax = face == 'n' || face == 's' ? 'x' : 'z', s = face == 's' || face == 'e' ? 1 : -1;
  const B = (u0, v0, u1, v1) => { if (ax == 'x') mb.box(frame, cx + u0, cy + v0, cz + (s > 0 ? 0 : -d), cx + u1, cy + v1, cz + (s > 0 ? d : 0)); else mb.box(frame, cx + (s > 0 ? 0 : -d), cy + v0, cz + u0, cx + (s > 0 ? d : 0), cy + v1, cz + u1) };
  const f = .025; B(-w / 2 - f, -h / 2 - f, w / 2 + f, -h / 2); B(-w / 2 - f, h / 2, w / 2 + f, h / 2 + f); B(-w / 2 - f, -h / 2, -w / 2, h / 2); B(w / 2, -h / 2, w / 2 + f, h / 2);
  if (t) mb.decal(t, cx + (ax == 'z' ? s * .008 : 0), cy, cz + (ax == 'x' ? s * .008 : 0), w, h, face);
}
