// ==================== PART TWO: the two bathrooms (built straight onto the new plan) ====================
// Downstairs: a shower room that doubles as the laundry (frosted-glass shower in the corner, vanity and mirror,
// toilet, washer and dryer, a towel ladder). Upstairs: the family bathroom (a tub with a shower curtain half drawn,
// a double vanity under a wide mirror, toilet, shelves of bottles, a linen cupboard).
// Both: white subway tile to shoulder height with a dark cap, black-and-white checked floor, the plaster above.
function bathTex() {
  if (TX.subway) return;
  tex('subway', 64, (g, s) => { g.fillStyle = '#7e7c76'; g.fillRect(0, 0, s, s);
    for (let r = 0; r < 8; r++) for (let c = -1; c < 4; c++) { const x = c * 16 + (r % 2) * 8, y = r * 8, v = 196 + ((r * 7 + c * 13 + 20) % 5) * 5;
      g.fillStyle = `rgb(${v},${v},${v - 8})`; g.fillRect(x + 1, y + 1, 14, 6); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 1, y + 1, 14, 1); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x + 1, y + 6, 14, 1) }
    texNoiseOver(g, s, .06, 501) });
  tex('checker', 64, (g, s) => { for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { g.fillStyle = (x + y) % 2 ? '#1e1d20' : '#aeaaa0'; g.fillRect(x * 32, y * 32, 32, 32) }
    g.fillStyle = 'rgba(60,56,50,.7)'; for (let i = 0; i < 2; i++) { g.fillRect(i * 32, 0, 1, s); g.fillRect(0, i * 32, s, 1) } texNoiseOver(g, s, .08, 502) });
  tex('frosted', 32, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#b8c4c8'); gr.addColorStop(1, '#94a2a8'); g.fillStyle = gr; g.fillRect(0, 0, s, s); texNoiseOver(g, s, .05, 503) });
  tex('showercurtain', 64, (g, s) => { for (let x = 0; x < s; x++) { const v = 196 + Math.sin(x / s * Math.PI * 8) * 16; g.fillStyle = `rgb(${v | 0},${v - 4 | 0},${v - 12 | 0})`; g.fillRect(x, 0, 1, s) }
    const R = rng(504); for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${70 + R() * 30 | 0},60,40,${.15 + R() * .25})`; g.beginPath(); g.arc(R() * s, s * .7 + R() * s * .3, .6 + R() * 1.6, 0, 7); g.fill() } });
  tex('towel', 32, (g, s) => { texNoise(g, s, '#5c4650', .14, 505, 1); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, 4, s, 2); g.fillRect(0, s - 6, s, 2) });
  tex('towel2', 32, (g, s) => { texNoise(g, s, '#47586a', .14, 506, 1); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, 4, s, 2); g.fillRect(0, s - 6, s, 2) });
  tex('darkglass', 16, (g, s) => { g.fillStyle = '#16191e'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(3, 3, 4, 2) });
  tex('wicker', 32, (g, s) => { g.fillStyle = '#7a6448'; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 4) for (let x = 0; x < s; x += 4) { g.fillStyle = (x + y) % 8 ? 'rgba(0,0,0,.22)' : 'rgba(255,230,180,.12)'; g.fillRect(x, y, 4, 2) } });
  Object.assign(SPEC, { subway: .35, checker: .22, frosted: .3, steel: .5, darkglass: .6 });
}
// a kitchen sink (two stainless bowls under a hole in the worktop, a gooseneck tap) and the dishes piled in it.
// Local to a counter: length along x, front at -z, worktop at .9. The counter leaves the hole (MOD.counter o.sink).
const SINKH = { hw: .4, z0: -.21, z1: .15 };
function sinkN(mb, s) {
  const { hw, z0, z1 } = SINKH, top = .9, by = .69;
  for (const [a, b] of [[s - hw + .02, s - .02], [s + .02, s + hw - .02]]) {
    // a bowl: a floor and four walls, each its own slab so the lit side faces into the bowl
    const c0 = z0 + .01, c1 = z1 - .01, t = .008; mb.box('steel', a, by - t, c0, b, by, c1); mb.box('steel', a - t, by, c0, a, top, c1); mb.box('steel', b, by, c0, b + t, top, c1); mb.box('steel', a, by, c0 - t, b, top, c0); mb.box('steel', a, by, c1, b, top, c1 + t);
    mb.cyl('dark', (a + b) / 2, by + .001, (z0 + z1) / 2, .028, .003, { seg: 10 }); mb.cyl('chrome', (a + b) / 2, by + .002, (z0 + z1) / 2, .036, .002, { seg: 10, r1: .03 }) }
  mb.box('steel', s - .02, by + .17, z0 + .01, s + .02, top, z1 - .01);   // the divider
  // the lip round the hole
  mb.box('steel', s - hw, top, z0 - .012, s + hw, top + .004, z0 + .01); mb.box('steel', s - hw, top, z1 - .01, s + hw, top + .004, z1 + .012);
  mb.box('steel', s - hw - .012, top, z0, s - hw + .02, top + .004, z1); mb.box('steel', s + hw - .02, top, z0, s + hw + .012, top + .004, z1);
  // the tap: a tall gooseneck turned over the left bowl, a lever on its side
  const tz = .225; mb.cyl('chrome', s, top, tz, .026, .03, { seg: 10 });
  mb.tube('chrome', [[s, top + .02, tz], [s, top + .26, tz], [s - .03, top + .33, tz - .05], [s - .1, top + .33, tz - .12], [s - .16, top + .26, tz - .17], [s - .175, top + .21, tz - .185]], [.015, .015, .014, .013, .012, .012], { seg: 8 });
  mb.box('chrome', s + .022, top + .07, tz - .006, s + .09, top + .082, tz + .006);
  // the dishes: a stack of plates, bowls, mugs and a pot left to soak
  const R = rng(77), bx = s + .2, bz = -.03;
  for (let i = 0; i < 6; i++) mb.with(M4.chain(M4.tr(bx + (R() - .5) * .02, by + .006 + i * .022, bz + (R() - .5) * .02), M4.rx((R() - .5) * .08), M4.rz((R() - .5) * .1)), m => m.lathe('porcelain', [[.0, 0], [.07, .002], [.11, .016], [.115, .019]], { seg: 14, cap: 'b' }));
  mb.lathe('porcelain', [[.0, by + .14], [.04, by + .14], [.07, by + .17], [.075, by + .19]], { cx: bx - .03, cz: bz + .02, seg: 14 });
  for (const [x, z, a] of [[bx + .11, bz + .1, .2], [bx - .1, bz - .1, 1.4]]) mb.with(M4.chain(M4.tr(x, by + .005, z), M4.ry(a)), m => { m.lathe('lacquer', [[.0, 0], [.038, 0], [.04, .09], [.036, .09], [.034, .01]], { seg: 12 }); m.tube('lacquer', [[.04, .07, 0], [.065, .06, 0], [.065, .03, 0], [.04, .02, 0]], [.007, .007, .007, .007], { seg: 5 }) });
  const px = s - .2; mb.lathe('steel', [[.0, by + .004], [.12, by + .004], [.125, by + .14], [.115, by + .14], [.11, by + .015]], { cx: px, cz: bz, seg: 16 });
  mb.box('darkplastic', px + .12, by + .12, bz - .015, px + .3, by + .135, bz + .015);
  mb.lathe('soil', [[.0, by + .09], [.108, by + .09]], { cx: px, cz: bz, seg: 16, col: [.55, .5, .4, 0] });   // greasy water
  // washing-up liquid and a sponge by the tap
  mb.lathe('bottle', [[.03, top], [.03, top + .16], [.012, top + .2], [.006, top + .22]], { cx: s + .5, cz: .2, seg: 8, col: [.4, .75, .45, .2] });
  mb.box('cushion', s + .42, top, .08, s + .52, top + .03, .14, { col: [.9, .85, .3, 0] });
}

function bathsN(mb, mirrorN) {
  bathTex();
  const CAP = 1.25;
  // tile on a wall: face 'n'/'s' (a wall along x at z) or 'e'/'w' (along z at x); a..b is the run; up to height h
  const tile = (face, w, a, b, y0, h = CAP, cap = true, off = .016) => {
    const t = .012, sgn = face == 's' || face == 'e' ? 1 : -1, p0 = w + sgn * off, p1 = p0 + sgn * t;
    if (face == 's' || face == 'n') { mb.box('subway', a, y0, Math.min(p0, p1), b, y0 + h, Math.max(p0, p1), { us: .6 }); if (cap) mb.box('dark', a, y0 + h, Math.min(p0, p1 + sgn * .012), b, y0 + h + .035, Math.max(p0, p1 + sgn * .012), { bev: .006 }) }
    else { mb.box('subway', Math.min(p0, p1), y0, a, Math.max(p0, p1), y0 + h, b, { us: .6 }); if (cap) mb.box('dark', Math.min(p0, p1 + sgn * .012), y0 + h, a, Math.max(p0, p1 + sgn * .012), y0 + h + .035, b, { bev: .006 }) }
  };
  const floor = (x0, z0, x1, z1, y) => mb.box('checker', x0, y, z0, x1, y + .012, z1, { skip: 'nsewb', us: .6 });   // high enough not to flicker against the boards under it
  // an undermount basin cut into a top: the top is built round the hole
  const basinTop = (t, x0, z0, x1, z1, y, hx0, hz0, hx1, hz1) => {
    for (const q of [[x0, z0, hx0, z1], [hx1, z0, x1, z1], [hx0, z0, hx1, hz0], [hx0, hz1, hx1, z1]]) mb.box(t, q[0], y, q[1], q[2], y + .04, q[3]);
    mb.box('porcelain', hx0 + .01, y - .14, hz0 + .01, hx1 - .01, y + .03, hz1 - .01, { skip: 't', tf: { b: 'porcelain' } }); mb.cyl('chrome', (hx0 + hx1) / 2, y - .139, (hz0 + hz1) / 2, .02, .002, { seg: 10 });
  };
  const tapN = (x, y, z, dir) => { mb.cyl('chrome', x, y, z, .02, .02, { seg: 8 }); mb.tube('chrome', [[x, y + .02, z], [x, y + .16, z], [x, y + .19, z + dir * .04], [x, y + .17, z + dir * .1]], [.012, .012, .011, .01], { seg: 6 }); for (const s of [-1, 1]) mb.cyl('chrome', x + s * .08, y, z, .018, .035, { seg: 8 }) };
  const towel = (t, x, y, z, ax, w, drop) => {   // a towel folded over a bar (along x or z)
    if (ax == 'x') { mb.box(t, x - w / 2, y - drop, z - .028, x + w / 2, y + .012, z - .016, { us: .3 }); mb.box(t, x - w / 2, y - drop * .8, z + .016, x + w / 2, y + .012, z + .028, { us: .3 }); mb.box(t, x - w / 2, y, z - .028, x + w / 2, y + .016, z + .028, { us: .3 }) }
    else { mb.box(t, x - .028, y - drop, z - w / 2, x - .016, y + .012, z + w / 2, { us: .3 }); mb.box(t, x + .016, y - drop * .8, z - w / 2, x + .028, y + .012, z + w / 2, { us: .3 }); mb.box(t, x - .028, y, z - w / 2, x + .028, y + .016, z + w / 2, { us: .3 }) }
  };

  // ======================================== downstairs (x 11.4-16.4, z 0-4.6; door in the west wall at z 1.31-2.41)
  { const X0 = 11.46, X1 = 16.34, Z0 = .06, Z1 = 4.54;
    floor(X0, Z0, X1, Z1, 0);
    tile('s', Z0, X0, X1, 0); tile('w', X1, Z0, Z1, 0); tile('n', Z1, X0, X1, 0); tile('e', X0, Z0, 1.22, 0); tile('e', X0, 2.5, Z1, 0);
    // the shower in the north-east corner: tiled to the ceiling inside, a tray, frosted glass on two sides
    const sx = 15.15, sz = 1.25; tile('s', Z0, sx, X1, CAP + .035, 2.25 - CAP, false, .016); tile('w', X1, Z0, sz, CAP + .035, 2.25 - CAP, false, .016);
    mb.box('porcelain', sx, 0, Z0, X1, .07, sz, { bev: .01 }); mb.box('dark', sx + .06, .07, Z0 + .06, X1 - .06, .072, sz - .06); mb.cyl('chrome', (sx + X1) / 2, .072, (Z0 + sz) / 2, .035, .003, { seg: 10 });
    mb.box('frosted', sx, .07, sz - .01, X1, 2.0, sz + .01); mb.box('frosted', sx - .01, .07, Z0, sx + .01, 2.0, sz - .45);   // the door is the gap at the front-left
    mb.box('chrome', sx, 2.0, sz - .02, X1, 2.03, sz + .02); mb.box('chrome', sx - .02, 2.0, Z0, sx + .02, 2.03, sz - .45);
    mb.box('chrome', sx - .015, .07, sz - .015, sx + .015, 2.03, sz + .015);
    mb.tube('chrome', [[X1 - .02, 1.0, .65], [X1 - .02, 2.0, .65], [X1 - .1, 2.1, .65], [X1 - .25, 2.1, .65]], [.012, .012, .012, .012], { seg: 6 }); mb.cyl('chrome', X1 - .25, 2.04, .65, .07, .04, { seg: 12, r0: .03 });
    mb.cyl('chrome', X1 - .05, 1.0, .65, .04, .03, { seg: 10 }); hs(sx, 0, Z0, X1, 2.0, sz);
    mb.box('rug2', sx - .7, .016, sz + .1, sx - .05, .024, sz + .55, { skip: 'nsewb', fit: 1, col: [.6, .7, .8, 0] });
    // the vanity: a white cabinet, a marble top with the basin cut in, a mirror and a light bar
    const vx = 13.05; mb.box('dark', vx - .5, 0, .08, vx + .5, .1, .5); mb.box('vanity', vx - .52, .1, .075, vx + .52, .82, .54, { fit: 1 });
    basinTop('marble', vx - .55, .075, vx + .55, .58, .82, vx - .22, .2, vx + .22, .46); tapN(vx, .86, .13, 1);
    hs(vx - .55, 0, .06, vx + .55, .86, .58); mirrorN('s', vx, 1.7, .075, .8, .75);
    mb.box('chrome', vx - .42, 2.12, .075, vx + .42, 2.16, .14); mb.box('lamp', vx - .38, 2.105, .1, vx + .38, 2.12, .135);
    inter('bathmirror0', [vx - .45, 1.2, 0, vx + .45, 2.1, .5], 'Mirror', () => P2S.look('mirror'));
    mb.at(14.35, 0, .37, PI, m => MOD.toilet(m)); hs(14.15, 0, .06, 14.55, .8, .75);
    mb.at(14.85, .7, .09, 0, m => { m.box('chrome', -.01, -.01, -.02, .01, .01, .0); m.tube('chrome', [[0, 0, 0], [0, 0, .06], [.12, 0, .06]], [.006, .006, .006], { seg: 4 }); m.lathe('linen', [[.05, -.06], [.05, .06]], { cx: .06, cz: .06, seg: 10, cap: 'tb', sz: 1 }) });
    // washer and dryer along the south wall, a shelf of detergent above
    for (const [x, dry] of [[14.6, 0], [15.3, 1]]) {
      mb.box('porcelain', x - .3, 0, 3.92, x + .3, .86, 4.52, { bev: .015 }); mb.box('darkplastic', x - .28, .76, 3.915, x + .28, .84, 3.93); mb.cyl('chrome', x + .18, .8, 3.915, .02, .015, { seg: 8 });
      mb.with(M4.chain(M4.tr(x, .4, 3.92), M4.rx(-HP)), m => { m.lathe('chrome', [[.19, 0], [.2, .015], [.18, .03], [.15, .03]], { seg: 20 }); m.lathe(dry ? 'porcelain' : 'darkglass', [[.15, .028], [.0, .04]], { seg: 20 }) });
      hs(x - .3, 0, 3.92, x + .3, .86, 4.52) }
    mb.box('oak', 14.2, 1.45, 4.25, 15.7, 1.48, 4.53); for (let i = 0; i < 4; i++) mb.lathe('bottle', [[.05, 1.48], [.05, 1.7], [.02, 1.74], [.02, 1.77]], { cx: 14.4 + i * .3, cz: 4.4, seg: 8, sz: .6, col: [[.3, .5, .9, .2], [.9, .9, .9, .2], [.9, .5, .2, .2], [.4, .7, .5, .2]][i] });
    mb.lathe('wicker', [[.2, 0], [.23, .5], [.24, .52]], { cx: 13.6, cz: 4.15, seg: 14, cap: 'b' }); mb.sphere('towel2', 13.6, .5, 4.15, .2, .07, .2, { seg: 10, rings: 5 }); hs(13.36, 0, 3.9, 13.84, .52, 4.4);
    // a towel ladder against the west wall, south of the door
    for (const z of [3.2, 3.75]) mb.tube('chrome', [[X0 + .05, .15, z], [X0 + .05, 1.6, z]], [.014, .014], { seg: 6 }); for (let i = 0; i < 6; i++) mb.tube('chrome', [[X0 + .05, .3 + i * .25, 3.2], [X0 + .05, .3 + i * .25, 3.75]], [.01, .01], { seg: 5 });
    towel('towel', X0 + .05, 1.3, 3.475, 'z', .5, .45); towel('towel2', X0 + .05, .8, 3.475, 'z', .5, .3);
    mb.at(13.9, 0, 2.3, 0, m => MOD.ceilingLamp(m, 2.8));
  }

  // ======================================== upstairs (x 0-5.6, z 0-5.8; door in the east wall at z 1.77-2.87)
  { const Y = 3, X0 = .06, X1 = 5.54, Z0 = .06, Z1 = 5.74;
    floor(X0, Z0, X1, Z1, Y);
    tile('s', Z0, X0, X1, Y); tile('e', X0, Z0, Z1, Y); tile('n', Z1, X0, X1, Y); tile('w', X1, Z0, 1.68, Y); tile('w', X1, 2.96, Z1, Y);
    // the tub along the north wall, tiled to the ceiling round it, the shower curtain half drawn
    mb.at(.93, Y, .46, 0, m => MOD.bathtub(m, 1.72, .76)); hs(X0, Y, Z0, 1.8, Y + .6, .86);
    tile('s', Z0, X0, 1.82, Y + CAP + .035, 2.25 - CAP, false); tile('e', X0, Z0, .86, Y + CAP + .035, 2.25 - CAP, false);
    mb.tube('chrome', [[.1, Y + 1.05, .1], [.1, Y + 1.9, .1], [.2, Y + 1.98, .1]], [.012, .012, .012], { seg: 6 }); mb.cyl('chrome', .25, Y + 1.94, .1, .06, .03, { seg: 10, r0: .025 });
    mb.tube('chrome', [[X0, Y + 2.05, .86], [1.82, Y + 2.05, .86], [1.82, Y + 2.05, Z0]], [.01, .01, .01], { seg: 6 });
    { const P = []; for (let i = 0; i <= 18; i++) P.push([.12 + i * .045, .86 + (i % 2 ? .035 : -.035)]);
      for (let i = 0; i < P.length - 1; i++) { const [a, b] = [P[i], P[i + 1]]; mb.quad('showercurtain', [a[0], Y + 2.03, a[1]], [b[0], Y + 2.03, b[1]], [b[0], Y + .5, b[1]], [a[0], Y + .5, a[1]], [[i / 18, 0], [(i + 1) / 18, 0], [(i + 1) / 18, 1], [i / 18, 1]]); if (i % 2 == 0) mb.lathe('chrome', [[.012, Y + 2.035], [.012, Y + 2.065]], { cx: a[0], cz: .86, seg: 6 }) } }
    mb.box('rug2', .45, Y + .016, .98, 1.35, Y + .024, 1.5, { skip: 'nsewb', fit: 1, col: [.85, .7, .7, 0] });
    // the double vanity under a wide mirror, a sconce at each end
    const vx = 3.25; mb.box('dark', vx - .78, Y, .08, vx + .78, Y + .1, .52); mb.box('vanity', vx - .8, Y + .1, .075, vx + .8, Y + .84, .56, { fit: 1 });
    mb.box('marble', vx - .83, Y + .84, .075, vx - .62, Y + .88, .6); mb.box('marble', vx + .62, Y + .84, .075, vx + .83, Y + .88, .6); mb.box('marble', vx - .2, Y + .84, .075, vx + .2, Y + .88, .6);
    for (const s of [-1, 1]) { const cx = vx + s * .41; basinTop('marble', cx - .21, .075, cx + .21, .6, Y + .84, cx - .19, .2, cx + .19, .46); tapN(cx, Y + .88, .13, 1) }
    hs(vx - .83, Y, .06, vx + .83, Y + .88, .6); mirrorN('s', vx, Y + 1.68, .075, 1.45, .8);
    for (const x of [vx - 1.0, vx + 1.0]) mb.at(x, Y + 1.72, .08, 0, m => { m.box('brass', -.03, -.08, -.005, .03, .08, .01); m.tube('brass', [[0, 0, .01], [0, .02, .08]], [.008, .008], { seg: 5 }); m.lathe('lamp', [[.05, .0], [.035, .16]], { cz: .1, seg: 10 }) });
    inter('mirror', [vx - .75, Y + 1.2, 0, vx + .75, Y + 2.1, .5], 'Mirror', () => P2S.look('mirror'));
    mb.box('trimw', vx - .1, Y + .88, .2, vx + .1, Y + .89, .3); mb.lathe('bottle', [[.03, Y + .89], [.03, Y + 1.02], [.012, Y + 1.06]], { cx: vx - .05, cz: .25, seg: 8, col: [.9, .6, .7, .2] }); mb.lathe('porcelain', [[.035, Y + .89], [.04, Y + .99]], { cx: vx + .06, cz: .25, seg: 10, cap: 'b' });
    // the toilet against the west wall, shelves of bottles above it
    mb.at(.37, Y, 2.7, -HP, m => MOD.toilet(m)); hs(X0, Y, 2.5, .75, Y + .8, 2.9);
    for (const yy of [1.35, 1.7]) { mb.box('oak', X0, Y + yy, 2.25, .3, Y + yy + .025, 3.15); const R2 = rng(yy * 100 | 0); for (let i = 0; i < 8; i++) mb.lathe('bottle', [[.025, 0], [.025, .1 + R2() * .06], [.01, .15 + R2() * .05]], { cx: .17, cz: 2.33 + i * .1, seg: 8, yf: () => Y + yy + .025, col: [[.3, .7, .6, .2], [.8, .4, .6, .2], [.3, .5, .9, .2], [.9, .8, .3, .2]][i % 4] }) }
    mb.at(X0 + .02, Y + .62, 3.45, 0, m => { m.box('chrome', -.01, -.01, -.02, .01, .01, .02); m.lathe('linen', [[.05, -.06], [.05, .06]], { cx: .07, cz: 0, seg: 10, cap: 'tb' }) });
    // towels on a rail on the south wall, a tall linen cupboard, a hamper, a plant
    mb.tube('chrome', [[1.0, Y + 1.2, Z1 - .06], [2.0, Y + 1.2, Z1 - .06]], [.012, .012], { seg: 6 }); for (const x of [1.0, 2.0]) mb.box('chrome', x - .01, Y + 1.19, Z1 - .07, x + .01, Y + 1.21, Z1);
    towel('towel', 1.28, Y + 1.2, Z1 - .06, 'x', .5, .5); towel('towel2', 1.75, Y + 1.2, Z1 - .06, 'x', .38, .4);
    mb.box('vanity', 3.2, Y, Z1 - .45, 4.0, Y + 2.0, Z1, { fit: 1 }); mb.box('trimw', 3.18, Y + 2.0, Z1 - .47, 4.02, Y + 2.04, Z1); hs(3.2, Y, Z1 - .45, 4.0, Y + 2.0, Z1);
    mb.lathe('wicker', [[.2, 0], [.23, .55], [.24, .57]], { cx: 4.5, cz: Z1 - .3, seg: 14, cap: 'b' }); mb.cyl('wicker', 4.5, Y + .57, Z1 - .3, .245, .03, { seg: 14 }); hs(4.26, Y, Z1 - .55, 4.74, Y + .6, Z1);
    mb.at(.4, Y, Z1 - .35, 0, m => MOD.plant(m, false)); hs(.2, Y, Z1 - .55, .6, Y + .9, Z1 - .15);
    mb.at(2.8, Y, 2.9, 0, m => MOD.ceilingLamp(m, 2.8));
  }
}
