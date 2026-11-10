// ==================== PART TWO: Hitori (and, at the end, her sister) as a 3D model ====================
// Built to match the reference drawing, as a slim girl: long straight black hair (hair cards: strands with real gaps
// and tips, over a solid layer) with grey streaks, a blunt fringe and long front locks; black horns that taper to a
// point and curve back, ridged; red bows with ribbon tails; a rolled turtleneck; a fitted, oversized-sleeved coat
// with a placket and clasps, folds and a maroon lining; a wrapped maroon sash with a knot and tails, a belt and ring;
// a pleated skirt with a pointed hem over a scalloped maroon layer; knee socks; laced platform boots.
// Smooth shapes are lofted from cross-sections (narrow waist, soft bust, small sloping shoulders) and shaded from
// the surface itself. Posed with a small skeleton (two-bone IK). In first person you see your body and your hands.
function texBody() {
  if (TX.haircard) return;
  tex('skin2', 32, (g, s) => texNoise(g, s, '#e9cdb4', .025, 120, 1));
  tex('skin3', 32, (g, s) => texNoise(g, s, '#efdcd6', .02, 121, 1));   // the model's hands: pale, matched to its face
  tex('skinH', 32, (g, s) => texNoise(g, s, '#e2dcdc', .02, 133, 1)); tex('skinK', 32, (g, s) => texNoise(g, s, '#e8dcd8', .02, 134, 1)); tex('hitsleeve', 32, (g, s) => texNoise(g, s, '#1c1a1e', .06, 135, 1)); tex('hitsleeve2', 32, (g, s) => texNoise(g, s, '#3a1820', .06, 136, 1));
  tex('hksleeve', 32, (g, s) => texNoise(g, s, '#362e32', .05, 131, 1)); tex('hksleeve2', 32, (g, s) => texNoise(g, s, '#2c2529', .05, 132, 1));
  tex('nail', 8, (g, s) => { g.fillStyle = '#efc4c4'; g.fillRect(0, 0, s, s) }); tex('nailtip', 8, (g, s) => { g.fillStyle = '#f8f0ec'; g.fillRect(0, 0, s, s) });
  // solid hair (under the cards, and the scalp)
  const hairTex = (k, base, light, dark) => tex(k, 64, (g, s) => { g.fillStyle = base; g.fillRect(0, 0, s, s); const R = rng(k.length * 17);
    for (let i = 0; i < 160; i++) { g.fillStyle = R() < .5 ? light : dark; g.fillRect(R() * s, 0, 1, s) }
    const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.45, 'rgba(200,200,230,.08)'); gr.addColorStop(.6, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s) });
  hairTex('hair', '#141118', 'rgba(70,64,84,.4)', 'rgba(0,0,0,.5)'); hairTex('hairs', '#55535e', 'rgba(170,168,180,.4)', 'rgba(30,28,34,.4)'); hairTex('hairh', '#4a3022', 'rgba(150,110,80,.35)', 'rgba(20,10,4,.35)');
  // hair cards: many separate strands, each tapering to its own tip, a sheen across them, gaps between
  const card = (k, cols, hi, jag, seed) => tex(k, 64, (g, s, h) => { g.clearRect(0, 0, s, h); const R = rng(seed);
    for (let x = 0; x < s; ) { const w = 2 + (R() * 3 | 0), len = h * (jag ? (.78 + R() * .22) : (.9 + R() * .1)), c = cols[R() * cols.length | 0];
      if (R() < .12) { x += 1; continue }
      g.fillStyle = c; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + w, 0); g.lineTo(x + w, len - 10); g.lineTo(x + w / 2, len); g.lineTo(x, len - 10); g.closePath(); g.fill();
      g.fillStyle = hi; g.fillRect(x, h * .28 + R() * 6, w * .6, 10 + R() * 8); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + w - 1, 0, 1, len - 10); x += w }
  }, 128);
  card('haircard', ['#16121a', '#1d1822', '#121016', '#241e2a'], 'rgba(120,112,140,.45)', 1, 140); card('haircardg', ['#5a5862', '#6a6872', '#4a4852'], 'rgba(210,208,220,.5)', 1, 141);
  card('hairbang', ['#16121a', '#1d1822', '#121016', '#241e2a'], 'rgba(120,112,140,.45)', 1, 142); card('haircardh', ['#4a3022', '#5a3a28', '#3a2418'], 'rgba(200,150,110,.45)', 1, 143);
  // the coat: very dark grey, a faint woven diamond pattern, darker seams
  tex('coat', 64, (g, s) => { texNoise(g, s, '#28252d', .05, 123, 1); g.strokeStyle = 'rgba(120,110,130,.13)'; g.lineWidth = 1; for (let y = 0; y < s; y += 8) for (let x = 0; x < s; x += 8) { g.beginPath(); g.moveTo(x + 4, y + 1); g.lineTo(x + 7, y + 4); g.lineTo(x + 4, y + 7); g.lineTo(x + 1, y + 4); g.closePath(); g.stroke() } g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(31, 0, 1, s) });
  tex('coatedge', 16, (g, s) => { g.fillStyle = '#121016'; g.fillRect(0, 0, s, s); g.fillStyle = '#3a363e'; g.fillRect(0, 0, s, 1) });
  tex('trim', 16, (g, s) => { g.fillStyle = '#18151b'; g.fillRect(0, 0, s, s); g.fillStyle = '#4a2830'; g.fillRect(0, 3, s, 1); g.fillRect(0, s - 4, s, 1) });
  tex('lining', 32, (g, s) => texNoise(g, s, '#5e1b28', .07, 124, 1));
  tex('skirt', 32, (g, s) => { texNoise(g, s, '#1b191f', .06, 132, 1); for (let x = 0; x < s; x += 4) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x, 0, 1, s); g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(x + 2, 0, 1, s) } });
  tex('lace', 32, (g, s, h) => { g.clearRect(0, 0, s, h); g.fillStyle = '#5e1b28'; g.fillRect(0, 0, s, h * .6); for (let x = 0; x < s; x += 8) { g.beginPath(); g.arc(x + 4, h * .6, 4, 0, Math.PI); g.fill() } g.fillStyle = 'rgba(0,0,0,0)'; }, 16);
  tex('sash', 32, (g, s) => { texNoise(g, s, '#5a1a27', .07, 125, 1); for (let y = 2; y < s; y += 5) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, y, s, 1); g.fillStyle = 'rgba(255,150,160,.07)'; g.fillRect(0, y + 2, s, 1) } });
  tex('belt', 16, (g, s) => { g.fillStyle = '#1a1416'; g.fillRect(0, 0, s, s); g.fillStyle = '#3a2c30'; g.fillRect(0, 1, s, 1); g.fillRect(0, s - 2, s, 1); g.fillStyle = '#5a5a60'; g.fillRect(6, 7, 2, 2) });
  tex('sock', 32, (g, s) => { g.fillStyle = '#18161c'; g.fillRect(0, 0, s, s); for (let x = 0; x < s; x += 2) { g.fillStyle = 'rgba(255,255,255,.045)'; g.fillRect(x, 0, 1, s) } });
  tex('boot', 64, (g, s) => { texNoise(g, s, '#161419', .04, 126, 1); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(0, 5, s, 2); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(26, 0, 12, s) });
  tex('sole', 16, (g, s) => { g.fillStyle = '#0d0c0f'; g.fillRect(0, 0, s, s); g.fillStyle = '#28252c'; for (let y = 1; y < s; y += 3) g.fillRect(0, y, s, 1) });
  tex('horn', 32, (g, s) => { const gr = g.createLinearGradient(0, 0, s, 0); gr.addColorStop(0, '#0e0b10'); gr.addColorStop(.5, '#241a22'); gr.addColorStop(1, '#0e0b10'); g.fillStyle = gr; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 4) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, y, s, 1); g.fillStyle = 'rgba(255,230,240,.07)'; g.fillRect(0, y + 1, s, 1) } });
  tex('ribbon', 16, (g, s) => { texNoise(g, s, '#a81e30', .07, 127, 1); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, 0, s, 1) });
  tex('jeans', 32, (g, s) => { texNoise(g, s, '#2c3a56', .14, 128, 1); for (let x = 0; x < s; x += 3) { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(x, 0, 1, s) } });
  tex('coath', 64, (g, s) => { texNoise(g, s, '#8a6a4c', .06, 129, 1); for (let y = 0; y < s; y += 2) { g.fillStyle = 'rgba(0,0,0,.04)'; g.fillRect(0, y, s, 1) } g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(31, 0, 1, s) });
  tex('sneaker', 32, (g, s) => { texNoise(g, s, '#d8d4cc', .05, 130, 1); g.fillStyle = '#5a5a6a'; g.fillRect(12, 0, 8, s) });
  tex('sweater', 32, (g, s) => { texNoise(g, s, '#c8bca8', .08, 131, 1); for (let x = 0; x < s; x += 4) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x, 0, 2, s) } });
  // the face, wrapped round the front of the head: big tired eyes with heavy upper lashes, a small nose and mouth
  for (const [k, iris] of [['face', '#8c3a2a'], ['faceh', '#6a4a30']]) tex(k, 512, (g, s, h) => {
    g.fillStyle = '#e9cdb4'; g.fillRect(0, 0, s, h);
    for (const sx of [-1, 1]) { const ex = 256 + sx * 29, ey = 136;
      g.fillStyle = '#fbf6f2'; g.beginPath(); g.ellipse(ex, ey, 13, 11, 0, 0, 7); g.fill();
      const gr = g.createLinearGradient(0, ey - 12, 0, ey + 12); gr.addColorStop(0, '#1a0806'); gr.addColorStop(.55, iris); gr.addColorStop(1, '#d88a66'); g.fillStyle = gr; g.beginPath(); g.ellipse(ex + sx, ey + 1, 9, 11.5, 0, 0, 7); g.fill();
      g.fillStyle = '#100404'; g.beginPath(); g.ellipse(ex + sx, ey + 1, 4, 6, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex - 3, ey - 4, 2.6, 2, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(ex + 3, ey + 5, 2, 2);
      g.fillStyle = '#120a0e'; g.beginPath(); g.moveTo(ex - sx * 14, ey - 7); g.quadraticCurveTo(ex - sx * 2, ey - 15, ex + sx * 15, ey - 4); g.lineTo(ex + sx * 19, ey); g.lineTo(ex + sx * 14, ey + 1); g.quadraticCurveTo(ex - sx * 2, ey - 9, ex - sx * 13, ey - 3); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(110,60,60,.4)'; g.lineWidth = 1; g.beginPath(); g.moveTo(ex - sx * 12, ey - 17); g.quadraticCurveTo(ex, ey - 21, ex + sx * 13, ey - 13); g.stroke();
      g.strokeStyle = 'rgba(90,50,40,.55)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(ex, ey + 2, 12, 10, 0, .4, 2.7); g.stroke();
      g.fillStyle = 'rgba(220,120,120,.2)'; g.beginPath(); g.ellipse(ex + sx * 6, ey + 24, 12, 5, 0, 0, 7); g.fill() }
    g.fillStyle = 'rgba(170,110,90,.45)'; g.fillRect(255, 161, 2, 3);
    g.strokeStyle = '#a05a5a'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(250, 178); g.quadraticCurveTo(256, 180, 262, 178); g.stroke();
  }, 256);
}
// ---------------------------------------------------------------- building the parts
const CHARS = {};
// heights: hips .86, waist .95, neck 1.335, eyes ~1.49, crown ~1.6
const GIRL = { hips: .86, waist: .09, neck: .39, sh: [.122, .33], hip: .078, ua: .25, fa: .225, th: .4, sn: .39, eye: 1.49 };
const boxy = (c, r, k = .65) => (p) => { const n = [(p[0] - c[0]) / r[0], (p[1] - c[1]) / r[1], (p[2] - c[2]) / r[2]].map(v => Math.sign(v) * Math.pow(Math.abs(v), k)); return [c[0] + n[0] * r[0], c[1] + n[1] * r[1], c[2] + n[2] * r[2]] };
// a smooth body shape lofted from cross-sections: rows = [{y, w (half width), d (half depth), b (bust), dz, e (squareness)}]
function loft(m, t, rows, o = {}) {
  const seg = o.seg || 24, a0 = o.a0 ?? -PI, a1 = o.a1 ?? PI, full = Math.abs(a1 - a0 - 2 * PI) < 1e-6, ur = o.ur || 2, vr = o.vr || 3, sc = o.scale || 1;
  const gb = x => Math.exp(-(x / .4) * (x / .4)), G = rows.map((R, i) => { const row = []; for (let k = 0; k <= seg; k++) { const a = a0 + (a1 - a0) * k / seg, s = Math.sin(a), c = Math.cos(a), e = R.e || 1, ss = Math.sign(s) * Math.pow(Math.abs(s), e), cc = Math.sign(c) * Math.pow(Math.abs(c), e);
      const r = (o.rf ? o.rf(i, a) : 1) * sc, bust = R.b ? R.b * (gb(a - .55) + gb(a + .55)) : 0, y = R.y + (o.yf ? o.yf(i, a) : 0);
      row.push({ p: [ss * R.w * r, y, (R.dz || 0) - cc * R.d * r - bust], n: V3.norm([s / R.w, 0, -c / R.d]), u: [(a - a0) / (2 * PI) * ur, R.y * vr] }) } return row });
  m.surf(t, G, { wrap: full });
  return G;
}
function buildChar(key, o) {
  if (CHARS[key]) return CHARS[key]; texBody();
  const P = {}, mk = fn => { const mb = new MB(); fn(mb); return mb.build() }, coat = o.coat;
  const TORSO = [{ y: -.09, w: .118, d: .09 }, { y: -.03, w: .104, d: .08 }, { y: .02, w: .097, d: .075 }, { y: .08, w: .101, d: .078 }, { y: .14, w: .112, d: .083, b: .011 }, { y: .19, w: .118, d: .085, b: .019 }, { y: .235, w: .119, d: .083, b: .015 },
    { y: .275, w: .118, d: .076, b: .005 }, { y: .305, w: .122, d: .068 }, { y: .328, w: .121, d: .06, e: .85 }, { y: .348, w: .1, d: .056 }, { y: .365, w: .068, d: .05 }, { y: .378, w: .042, d: .04 }];
  // ---- torso (pivot: the waist, 0.95 m up)
  P.torso = mk(m => {
    loft(m, coat, TORSO, { seg: 28, ur: 3, vr: 3 });
    // the placket where the coat closes, slightly raised, and four small clasps
    const front = TORSO.slice(1, 11).map(R => [0, R.y, -R.d - (R.b || 0) * 2 * Math.exp(-Math.pow(.55 / .4, 2)) - .003]);
    m.strip(coat, front, front.map(() => .024), front.map(() => [1, 0, 0]), { u0: .1, uw: .2 }); m.strip('coatedge', front.map(p => [.012, p[1], p[2] - .001]), front.map(() => .003), front.map(() => [1, 0, 0]));
    for (const i of [2, 4, 6, 8]) { const p = front[i]; m.sphere('chrome', .006, p[1], p[2] - .003, .005, .006, .003, { seg: 8, rings: 5 }) }
    // the rolled turtleneck
    m.lathe(coat, [[.046, .36], [.044, .39], [.042, .42], [.05, .43], [.052, .445], [.046, .452]], { seg: 20, sz: .95, ur: 2, rf: (i, a) => 1 + (i > 2 ? .04 * Math.sin(a * 6) : 0) });
    if (o.sash) {
      // the sash, wrapped (soft folds), the belt over it with a ring, and the knot with its two tails
      loft(m, 'sash', [{ y: -.07, w: .113, d: .087 }, { y: -.03, w: .109, d: .084 }, { y: .02, w: .103, d: .08 }, { y: .065, w: .106, d: .082 }], { seg: 28, rf: (i, a) => 1.035 + .012 * Math.sin(a * 11 + i), ur: 2, vr: 6 });
      loft(m, 'belt', [{ y: -.022, w: .113, d: .087 }, { y: -.002, w: .111, d: .086 }], { seg: 28, scale: 1.06 });
      m.tube('chrome', Array.from({ length: 15 }, (_, i) => [-.088 + Math.cos(i / 14 * 6.283) * .017, -.03 + Math.sin(i / 14 * 6.283) * .017, -.072]), Array(15).fill(.0035), { seg: 6 });
      m.strip('belt', [[-.084, -.05, -.076], [-.083, -.11, -.079], [-.08, -.16, -.08]], [.014, .014, .012], [[1, 0, .4], [1, 0, .4], [1, 0, .4]]);
      m.sphere('sash', .042, .004, -.092, .028, .026, .016, { seg: 12, rings: 8 }); m.sphere('sash', .064, -.002, -.086, .02, .02, .012, { seg: 10, rings: 6 }); m.sphere('sash', .022, .0, -.092, .018, .02, .012, { seg: 10, rings: 6 });
      m.strip('sash', [[.04, -.02, -.1], [.046, -.1, -.112], [.054, -.2, -.12], [.06, -.29, -.122]], [.036, .04, .038, .034], [[1, 0, .15], [1, 0, .25], [.95, 0, .3], [1, 0, .2]], { u0: 0, uw: 1 });
      m.strip('sash', [[.062, -.02, -.094], [.08, -.09, -.1], [.092, -.17, -.104]], [.03, .032, .028], [[1, 0, .5], [1, 0, .55], [1, 0, .5]], { u0: 0, uw: 1 });
    }
  });
  // ---- hair that hangs from the head but belongs to the body (so it doesn't swing through it), the front locks, the collar bow
  P.hair = mk(m => {
    const HY = .39 + .118, H = o.hair, C = o.long ? 'haircard' : 'haircardh';
    // one lock of long hair round the back and sides: solid inside, a card of strands over it
    const lock = (th, len, w, layer, t) => { const pts = [], st = (ph, r) => [Math.sin(ph) * Math.sin(th) * r, HY + Math.cos(ph) * r * 1.06, -Math.sin(ph) * Math.cos(th) * r];
      for (const ph of [.45, .8, 1.15, 1.5]) pts.push(st(ph, .098 + layer * .006));
      const back = Math.cos(th) < -.5, sa = Math.abs(Math.sin(th)), rr = y => .1 + layer * .007 + clamp((HY - .03 - y) / .12, 0, 1) * (back ? .045 : .07 * sa + .02);
      for (const y of [HY - .07, HY - .15, HY - .24, HY - .34, HY - .46, HY - len]) { const r = rr(y); pts.push([Math.sin(th) * r, y, -Math.cos(th) * r * (back ? 1.08 : .95)]) }
      m.strip(t, pts, pts.map((p, i) => w * (i > pts.length - 3 ? .9 : 1)), pts.map(() => [Math.cos(th), 0, Math.sin(th)]), t.startsWith('hair') && t.includes('card') ? { u0: 0, uw: 1, vfit: 1 } : { u0: (th * 3) % 1, uw: .35 }) };
    const L = o.long ? .6 : .22;
    for (let i = 0; i <= 18; i++) lock(1.25 + (2 * PI - 2.5) * i / 18, L - .02, .07, 0, H);
    for (let i = 0; i <= 30; i++) { const th = 1.15 + (2 * PI - 2.3) * i / 30; lock(th, L + Math.sin(i * 2.7) * .02, .055, 1, o.long && (i == 7 || i == 8 || i == 22) ? 'haircardg' : C) }
    for (let i = 0; i <= 24; i++) { const th = 1.2 + (2 * PI - 2.4) * (i + .5) / 25; lock(th, L - .03 + Math.sin(i * 1.9) * .02, .05, 2, C) }
    // the long front locks (hime cut), down over the chest: a solid core with strands over it
    for (const s of [-1, 1]) for (const [dx, dz, len, w, t] of [[0, 0, o.long ? .42 : .18, .03, H], [0, -.003, o.long ? .44 : .2, .04, C], [.01, .006, o.long ? .38 : .16, .036, o.long && s > 0 ? 'haircardg' : C]]) {
      const pts = [[s * (.078 + dx), HY + .03, -.03 + dz], [s * (.085 + dx), HY - .06, -.052 + dz], [s * (.088 + dx), HY - .16, -.086 + dz], [s * (.089 + dx), HY - .26, -.112 + dz], [s * (.09 + dx), HY - len, -.118 + dz]];
      m.strip(t, pts, pts.map((p, i) => w * (i == 4 ? .8 : 1)), pts.map(() => [1, 0, -s * .45]), t.includes('card') ? { u0: 0, uw: 1, vfit: 1 } : { uw: .3 }) }
    if (o.bow) { m.sphere('ribbon', -.016, .412, -.05, .014, .01, .006, { seg: 8, rings: 5 }); m.sphere('ribbon', .016, .412, -.05, .014, .01, .006, { seg: 8, rings: 5 }); m.sphere('ribbon', 0, .412, -.053, .006, .006, .006, { seg: 6, rings: 4 }) }
  });
  // ---- hips: the coat's long open skirt over a pleated black skirt with a pointed hem, over a scalloped maroon layer
  P.hips = mk(m => {
    if (o.skirt) {
      const pts = (i, a) => i == 3 ? -Math.pow(Math.abs(Math.sin(a * 4 + .3)), 6) * .07 + .015 : 0;
      loft(m, 'lining', [{ y: .06, w: .112, d: .086 }, { y: -.1, w: .15, d: .12 }, { y: -.24, w: .2, d: .155 }, { y: -.37, w: .235, d: .18 }], { seg: 40, rf: (i, a) => 1 + .02 * Math.sin(a * 20) * (i / 3) });
      loft(m, 'lace', [{ y: -.35, w: .238, d: .183 }, { y: -.39, w: .24, d: .185 }], { seg: 40, ur: 8, vr: 25 });
      loft(m, 'skirt', [{ y: .08, w: .116, d: .088 }, { y: -.06, w: .145, d: .115 }, { y: -.2, w: .19, d: .15 }, { y: -.33, w: .225, d: .172 }], { seg: 48, rf: (i, a) => 1 + .045 * Math.sin(a * 16) * (i / 3), yf: pts, ur: 4 });
      loft(m, coat, [{ y: .12, w: .122, d: .093 }, { y: 0, w: .14, d: .108 }, { y: -.18, w: .19, d: .145 }, { y: -.4, w: .24, d: .18 }], { seg: 30, a0: .5, a1: 2 * PI - .5, ur: 3, rf: (i, a) => 1 + .035 * Math.sin(a * 9) * (i / 3) });
      loft(m, 'lining', [{ y: .12, w: .12, d: .091 }, { y: 0, w: .138, d: .106 }, { y: -.18, w: .187, d: .143 }, { y: -.4, w: .237, d: .178 }], { seg: 30, a0: .5, a1: 2 * PI - .5, rf: (i, a) => 1 + .035 * Math.sin(a * 9) * (i / 3) });
      for (const s of [-1, 1]) { const a = s * .5, ed = [[.122, .12], [.14, 0], [.19, -.18], [.24, -.4]].map(([w, y], i) => { const r = 1 + .035 * Math.sin(a * 9) * (i / 3); return [Math.sin(a) * w * r, y, -Math.cos(a) * [.093, .108, .145, .18][i] * r] }); m.strip('trim', ed, ed.map(() => .012), ed.map(() => [Math.cos(a), 0, Math.sin(a)]), { uw: 1 }) }
    } else { loft(m, coat, [{ y: .1, w: .12, d: .09 }, { y: -.05, w: .14, d: .1 }, { y: -.4, w: .18, d: .14 }, { y: -.52, w: .2, d: .15 }], { seg: 24, a0: .8, a1: 2 * PI - .8 }); m.lathe(o.legs, [[.115, .1], [.12, -.06]], { seg: 16, sz: .75 }) }
  });
  // ---- the head (pivot: the base of the neck): face, scalp, fringe, the hair over the ears, horns, bows
  P.head = mk(m => {
    m.lathe('skin2', [[.029, -.02], [.028, .06], [.03, .075]], { seg: 12, sz: .95 });
    const cy = .118, R = [.08, .098, .088];
    m.sphere(o.face, 0, cy, -.004, R[0], R[1], R[2], { seg: 28, rings: 22, morph: (p) => { const d = (cy - p[1]) / R[1]; if (d > 0) { const k = 1 - .46 * Math.pow(d, 1.4); p[0] *= k; p[2] = -.004 + (p[2] + .004) * (p[2] < 0 ? 1 - .1 * d : 1 - .38 * d) } return p } });
    const H = o.hair, Cb = o.long ? 'hairbang' : 'haircardh';
    m.sphere(H, 0, cy + .006, .002, .09, .108, .098, { seg: 28, rings: 18, ur: 4, keep: (th, ph) => !(Math.abs(th) < 1.15 && ph > .72) && ph < 2.05 });
    // the fringe: a solid layer and cards of strands over it, cut blunt just above the eyes
    for (let L = 0; L < 2; L++) for (let i = 0; i < (L ? 11 : 8); i++) { const n = L ? 10 : 7, th = -1.08 + 2.16 * i / n + (L ? .04 : 0), pts = [];
      for (const [ph, r] of [[.3, .099], [.7, .103], [1.08, .105], [1.4, .103]]) pts.push([Math.sin(ph) * Math.sin(th) * (r + L * .003), cy + .006 + Math.cos(ph) * r * 1.07, -.004 - Math.sin(ph) * Math.cos(th) * (r + L * .003) * 1.03]);
      if (!L) pts[3] = V3.lerp(pts[2], pts[3], .85);
      m.strip(L ? Cb : H, pts, pts.map(() => L ? .05 : .045), pts.map(() => [Math.cos(th), 0, Math.sin(th)]), L ? { u0: 0, uw: 1, vfit: 1 } : { u0: i * .07, uw: .3 }) }
    // hair over the ears
    for (const s of [-1, 1]) for (let j = 0; j < 4; j++) { const th = s * (1.2 + j * .2), pts = [[Math.sin(th) * .1, cy + .06, -Math.cos(th) * .097], [Math.sin(th) * .105, cy - .02, -Math.cos(th) * .099], [Math.sin(th) * .107, cy - .1, -Math.cos(th) * .1]]; m.strip(j % 2 ? Cb : H, pts, [.045, .05, .05], pts.map(() => [Math.cos(th), 0, Math.sin(th)]), j % 2 ? { u0: 0, uw: 1, vfit: 1 } : {}) }
    if (o.horns) for (const s of [-1, 1]) {
      // the horns: thick at the root, a smooth taper to a sharp point, rising and curving back, ridged
      const N = 14, hp = [], hr = []; for (let i = 0; i <= N; i++) { const q = i / N, a = q * 1.55; hp.push([s * (.044 + .05 * Math.pow(q, 1.4)), cy + .078 + Math.sin(a) * .135, -.008 + (1 - Math.cos(a)) * .085]); hr.push(.026 * Math.pow(1 - q, .85) + .0012) }
      m.tube('horn', hp, hr, { seg: 14, cap: 1, vr: 22 });
      m.lathe('horn', [[.03, -.004], [.027, .012], [.0, .014]], { cx: s * .044, cz: -.01, seg: 14, sz: .9 }); // where it meets the head
      // a red bow at the side of the head: two loops, a knot, two ribbon tails with tassels
      const bx = s * .094, by = cy + .07, bz = .02;
      for (const dy of [1, -1]) { const loop = Array.from({ length: 11 }, (_, i) => { const a = i / 10 * 6.283; return [bx + s * (.006 + Math.sin(a) * .004), by + dy * (.013 + Math.cos(a) * .011), bz + Math.sin(a) * .02] }); m.tube('ribbon', loop, loop.map(() => .005), { seg: 6 }) }
      m.sphere('ribbon', bx + s * .006, by, bz, .008, .009, .009, { seg: 8, rings: 5 });
      for (const [dz, len] of [[-.006, .2], [.008, .25]]) { const tp = [[bx + s * .008, by - .006, bz + dz], [bx + s * .014, by - .08, bz + dz - .006], [bx + s * .016, by - len, bz + dz - .012]]; m.strip('ribbon', tp, [.009, .008, .007], tp.map(() => [0, 0, 1]), { uw: 1 }); m.lathe('ribbon', [[.0015, -.032], [.008, -.014], [.0045, 0]], { cx: tp[2][0], cz: tp[2][2] + 0, seg: 8, rf: (i, a) => 1 + .15 * Math.sin(a * 8) }) }
    }
  });
  // ---- arms: a slim sleeve, then a wide bell sleeve with soft folds, a trim band and the maroon lining inside
  P.ua = mk(m => { m.lathe(coat, [[.0, .055], [.03, .05], [.047, .03], [.052, -.02], [.05, -.13], [.047, -.25]], { seg: 18, ur: 2, rf: (i, a) => 1 + (i > 2 ? .03 * Math.sin(a * 5 + i) : 0) }) });
  P.fa = mk(m => { if (o.bell) { const fold = (i, a) => 1 + .07 * Math.sin(a * 7) * (i / 5); m.lathe(coat, [[.047, .02], [.052, -.06], [.064, -.12], [.078, -.17], [.083, -.195], [.082, -.2]], { seg: 28, ur: 2, rf: fold });
      m.lathe('trim', [[.0825, -.185], [.0835, -.2]], { seg: 28, rf: (i, a) => fold(5, a) * 1.01 }); m.lathe('lining', [[.08, -.199], [.06, -.15], [.045, -.09]], { seg: 28, rf: (i, a) => fold(5 - i, a) * .98 }) }
    else { m.lathe(coat, [[.048, .02], [.044, -.19], [.043, -.21]], { seg: 14 }); m.lathe('sweater', [[.04, -.2], [.035, -.23]], { seg: 12 }) } });
  // ---- legs: a slim thigh, a knee, a calf; knee socks with a band; laced platform boots
  P.th = mk(m => m.lathe(o.legs, [[.062, .04], [.064, -.04], [.057, -.17], [.046, -.31], [.039, -.38], [.037, -.4]], { seg: 16, sz: .95 }));
  P.sn = mk(m => { m.lathe(o.socks, [[.038, .02], [.04, -.03], [.043, -.1], [.042, -.16], [.035, -.26], [.027, -.35], [.027, -.39]], { seg: 16, sz: .95 }); if (o.skirt) m.lathe('sock', [[.042, -.005], [.044, -.03], [.042, -.034]], { seg: 16 }) });
  P.ft = mk(m => {
    if (o.shoes == 'boot') {
      m.lathe('boot', [[.044, .18], [.047, .17], [.043, .1], [.043, .05], [.048, .0], [.054, -.025]], { seg: 18, rf: (i, a) => 1 + (i < 2 ? .04 * Math.sin(a * 5) : 0) });
      m.sphere('boot', 0, -.014, -.058, .052, .047, .108, { seg: 18, rings: 12, keep: (th, ph) => ph < 1.62, morph: p => { if (p[2] < -.1) p[1] -= (p[2] + .1) * .15; return p } });
      m.box('sole', -.062, -.08, -.175, .062, -.028, .07, { bev: .022 }); m.box('sole', -.058, -.085, -.02, .058, -.028, .074, { bev: .012 });
      // laces: crossing up the front, with a bow at the top
      for (let i = 0; i < 6; i++) { const y = .0 + i * .028, z = -.044 - (i < 1 ? .012 : 0); m.tube('ribbon', [[-.016, y, z], [.016, y + .02, z]], [.0028, .0028], { seg: 4 }); m.tube('ribbon', [[.016, y, z], [-.016, y + .02, z]], [.0028, .0028], { seg: 4 }); m.sphere('chrome', -.018, y, z + .002, .003, .003, .003, { seg: 4, rings: 3 }); m.sphere('chrome', .018, y, z + .002, .003, .003, .003, { seg: 4, rings: 3 }) }
      m.sphere('ribbon', -.01, .172, -.048, .009, .006, .004, { seg: 6, rings: 4 }); m.sphere('ribbon', .01, .172, -.048, .009, .006, .004, { seg: 6, rings: 4 });
      for (let i = 0; i < 4; i++) { const z = -.07 - i * .025; m.tube('ribbon', [[-.022, -.004 + i * .006 - (z < -.1 ? .012 : 0), z], [.022, .0 + i * .006 - (z < -.1 ? .012 : 0), z - .012]], [.0026, .0026], { seg: 4 }) }
    } else { m.sphere(o.shoes, 0, -.02, -.05, .05, .04, .1, { seg: 12, rings: 8, keep: (th, ph) => ph < 1.75 }); m.lathe(o.shoes, [[.046, .05], [.048, -.02]], { seg: 12 }); m.box('linen', -.054, -.07, -.155, .054, -.035, .07, { bev: .01 }) } });
  P.o = o;
  return CHARS[key] = P;
}
// ---------------------------------------------------------------- hands
// a hand. side 1 = right (thumb towards -z, palm towards -x), -1 = left. curl 0 = open, 1 = a loose fist.
// A small slender hand: a softly squared palm that narrows to the wrist, short tapering jointed fingers with nails.
const HANDS = {};
// a finger as one smooth tube: the joints are a Catmull-Rom curve through the knuckles, the radius eases from
// joint to joint, and the tip is a rounded dome (no flat caps, no lumps where pieces meet)
function smoothFinger(m, sk, pts, rads, o = {}) {
  const sub = o.sub || 4, P = [], R = [], n = pts.length, at = i => pts[clamp(i, 0, n - 1)];
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < sub; j++) { const t = j / sub, p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2), t2 = t * t, t3 = t2 * t;
    P.push([0, 1, 2].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    const u = t * t * (3 - 2 * t); R.push(rads[i] * (1 - u) + rads[i + 1] * u) }
  const end = pts[n - 1], d = V3.norm(V3.sub(end, P[P.length - 1])), re = rads[n - 1];
  for (let j = 0; j <= 5; j++) { const a = j / 5 * Math.PI / 2; P.push(V3.add(end, V3.mul(d, Math.sin(a) * re * .9))); R.push(Math.max(re * Math.cos(a), re * .06)) }
  m.tube(sk, P, R, { seg: o.seg || 12 });
  return { end, d };
}
// a fingernail: a thin rounded shell on the back of the last joint, a pale pink with a whiter free edge
function nailOn(m, tip, d, back, r, lenK = 1.25) {
  const c = V3.add(V3.sub(tip, V3.mul(d, r * .6)), V3.mul(back, r * .93));
  m.with(M4.basis(V3.cross(d, back), d, back, c), mm => { mm.sphere('nail', 0, 0, 0, r * .8, r * lenK * .7, r * .24, { seg: 12, rings: 6 }); mm.sphere('nailtip', 0, r * lenK * .6, -r * .03, r * .7, r * .22, r * .2, { seg: 10, rings: 4 }) });
}
function fingerChain(m, base, dir, pn, segs, curl, skin, nailDir) {
  let d = V3.norm(dir), p = base; const pts = [p], rads = [segs[0][1] * 1.06];
  segs.forEach(([len, r, bend]) => { d = V3.norm(V3.add(V3.mul(d, Math.cos(bend * curl)), V3.mul(pn, Math.sin(bend * curl)))); p = V3.add(p, V3.mul(d, len)); pts.push(p); rads.push(r * .95) });
  const e = smoothFinger(m, skin, pts, rads), back = V3.norm(V3.sub(nailDir, V3.mul(e.d, V3.dot(nailDir, e.d))));
  nailOn(m, e.end, e.d, back, segs[segs.length - 1][1]);
}
function handObj(side, curl, skin = 'skin2') {
  const k = side + ':' + curl.toFixed(1) + skin; if (HANDS[k]) return HANDS[k]; texBody();
  const m = new MB(), pn = [-side, 0, 0], bk = [side, 0, 0];
  m.lathe(skin, [[.018, .03], [.0195, .005], [.021, -.014]], { seg: 16, sx: .62 });
  // the palm: a flat, softly squared slab (a lathe with a rounded-rectangle section), wrist to knuckles
  const sq = (i, a) => Math.pow(Math.pow(Math.abs(Math.cos(a)), 3) + Math.pow(Math.abs(Math.sin(a)), 3), -1 / 3);
  m.lathe(skin, [[1, .004, .0085, .0165], [1, -.012, .0088, .0192], [1, -.03, .0094, .0245], [1, -.05, .0095, .0285], [1, -.064, .009, .0298], [1, -.0705, .0074, .027], [1, -.0745, .0048, .0205], [1, -.0768, .0018, .0095]], { seg: 24, rf: sq });
  m.sphere(skin, -side * .0055, -.038, -.017, .0098, .021, .0105, { seg: 14, rings: 10 });
  const F = [[-.022, -.06, [[.02, .0074, .55], [.013, .0068, .8], [.011, .0061, .55]]], [-.0075, -.018, [[.022, .0077, .55], [.0145, .007, .8], [.012, .0063, .55]]], [.0075, .022, [[.0205, .0074, .55], [.0135, .0068, .8], [.011, .006, .55]]], [.021, .07, [[.016, .0066, .55], [.011, .006, .8], [.0095, .0054, .55]]]];
  F.forEach(([z, spread, segs]) => { fingerChain(m, [0, -.066, z], [0, -1, spread * .7], pn, segs.map(([l, r, b], j) => [l * (j ? 1.12 : 1.25), r * .86, b]), curl * 1.2, skin, bk) });
  fingerChain(m, [-side * .007, -.044, -.024], [-side * .25, -.78, -.58], V3.norm([-side * .6, -.2, .5]), [[.019, .0086, .3], [.016, .0079, .5], [.013, .007, .5]], .4 + curl * .6, skin, V3.norm([side * .3, 0, -.6]));
  return HANDS[k] = m.build();
}
// the right hand wrapped round the phone, built in the phone's own space: palm behind it, short fingers curling round
// the left edge so their tips rest on the frame, the thumb along the right edge. Nothing passes through the phone.
const GRIPS = {};
function phoneGrip(sk = 'skin3', sleeve = false) {
  const gk = sk + ':' + (sleeve || ''); if (GRIPS[gk]) return GRIPS[gk]; texBody(); const m = new MB();
  const wrist = [.05, -.028, .092], kn = [.006, -.016, .02], d = V3.norm(V3.sub(kn, wrist)), wdir = V3.norm([.12, 0, .99]);
  const pc = V3.lerp(wrist, kn, .5); m.with(M4.basis(wdir, V3.mul(d, -1), V3.cross(wdir, V3.mul(d, -1)), pc), mm => mm.sphere(sk, 0, 0, 0, .031, .041, .013, { seg: 20, rings: 14, morph: boxy([0, 0, 0], [.031, .041, .013], .7) }));
  m.with(M4.basis(wdir, V3.mul(d, -1), V3.cross(wdir, V3.mul(d, -1)), wrist), mm => mm.lathe(sk, [[.018, .02], [.021, -.01]], { seg: 12, sz: .62 }));
  // the index finger lies along the back (it steadies the phone and never shows); middle, ring and little finger curl
  // round the left edge, tips on the frame. That's how most people hold a phone in one hand: the fingers make a shelf
  // on the far side and the thumb is left free to move over the screen.
  { const r = .0074, z0 = kn[2] - .024; smoothFinger(m, sk, [[kn[0], -.0145, z0], [-.004, -.0168, z0 - .016], [-.011, -.0172, z0 - .03], [-.014, -.0172, z0 - .04]], [r * 1.1, r, r * .94, r * .86]) }
  [1, 2, 3].forEach(i => { const z0 = kn[2] - .024 + i * .016 + .004, sh = i == 3 ? .86 : 1, r = [.0072, .0075, .0071, .0063][i];
    const pts = [[kn[0] + (i == 3 ? .004 : 0), -.0145, z0], [-.016 * sh, -.0115, z0 - .004], [-.0405, -.0065, z0 - .007], [-.0442, .003, z0 - .007], [-.0418, .0122, z0 - .006], [-.0352 + (1 - sh) * .003, .0142, z0 - .005]];
    const rr = [r * 1.1, r, r * .96, r * .92, r * .88, r * .8], cut = sleeve == 'long' ? 3 : 0;   // in a long sleeve only the last joint shows
    const e = smoothFinger(m, sk, pts.slice(cut), rr.slice(cut));
    nailOn(m, e.end, e.d, V3.norm([0, 1, 0]), r * .82, 1.1) });
  // the thumb's root: the soft pad at its base and its first bone up to the knuckle. The two joints after it are
  // separate pieces (thumbParts), posed every frame so the thumb can move over the screen.
  const lg = sleeve == 'long'; if (!lg) { m.sphere(sk, .042, -.008, .057, .013, .011, .017, { seg: 14, rings: 10 }); smoothFinger(m, sk, [[.043, -.01, .06], THUMB.B], [.0096, .0094]) }
  if (sleeve == 'short') {   // Hitori's coat sleeve: a wide dark cuff over the wrist, ending at the base of the hand
    const cf = [[.13, -.055, .22], [.095, -.045, .16], [.07, -.038, .12], [.055, -.033, .098]];
    m.tube('hitsleeve', cf, [.052, .05, .046, .042], { seg: 16, sy: .62 }); m.tube('hitsleeve2', [V3.add(cf[3], [.004, .001, .006]), V3.add(cf[3], [-.002, 0, -.003])], [.0435, .0425], { seg: 16, sy: .62 });
  }
  if (sleeve == 'long') {   // Hikari's oversized jumper sleeve: a soft, wide cuff over the palm and most of the fingers, only the tips out
    const cuff = [[.115, -.05, .2], [.075, -.04, .13], [.045, -.034, .075], [.018, -.03, .036], [-.012, -.024, .02], [-.034, -.016, .016], [-.047, -.01, .016]];
    m.tube('hksleeve', cuff, [.05, .047, .043, .04, .034, .028, .024], { seg: 16, sy: .62 });
    // the sleeve end bunches round the edge of the phone over the fingers' lower joints: only the tips peek out on the front
    m.sphere('hksleeve', -.03, -.017, .016, .026, .02, .036, { seg: 16, rings: 10 });
    m.sphere('hksleeve', -.04, -.005, .016, .0115, .0115, .034, { seg: 16, rings: 10 });
    m.sphere('hksleeve', .041, -.012, .062, .014, .013, .022, { seg: 14, rings: 8 });   // the cuff over the thumb's base
    // the cuff's rim, rolled a little, and a fold or two
    const e = cuff[cuff.length - 1], d = V3.norm(V3.sub(e, cuff[cuff.length - 2]));
    m.tube('hksleeve2', [V3.sub(e, V3.mul(d, .006)), V3.add(e, V3.mul(d, .002))], [.0305, .0295], { seg: 16, sy: .62 });
    for (const t of [.35, .62]) { const p = V3.lerp(cuff[1], cuff[3], t); m.tube('hksleeve2', [V3.sub(p, V3.mul(d, .003)), V3.add(p, V3.mul(d, .003))], [.043 - t * .006, .043 - t * .006], { seg: 16, sy: .62 }) }
  }
  const GRIP = GRIPS[gk] = m.build(); GRIP.wrist = wrist; return GRIP;
}

// ---------------------------------------------------------------- posing
function ik2(S, T, a, b, pole) {
  const d = V3.sub(T, S), L = clamp(V3.len(d), Math.abs(a - b) + .001, a + b - .0005), dn = V3.norm(d), ca = (a * a + L * L - b * b) / (2 * a * L), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
  let pp = V3.sub(pole, V3.mul(dn, V3.dot(pole, dn))); if (V3.len(pp) < 1e-4) pp = Math.abs(dn[1]) < .9 ? [0, 1, 0] : [1, 0, 0]; pp = V3.norm(pp);
  return [V3.add(S, V3.add(V3.mul(dn, a * ca), V3.mul(pp, a * sa))), V3.add(S, V3.mul(dn, L))];
}
// a frame whose -y runs from A to B, with -z turned towards fwd
function segM(A, B, fwd) { const Y = V3.norm(V3.sub(A, B)); let Z = V3.sub(fwd, V3.mul(Y, V3.dot(fwd, Y))); if (V3.len(Z) < 1e-4) Z = Math.abs(Y[1]) < .9 ? [0, 1, 0] : [0, 0, -1]; Z = V3.mul(V3.norm(Z), -1); const X = V3.cross(Y, Z); return M4.basis(X, Y, Z, A) }
// a hand frame from where the fingers point and which way the palm faces
function handM(side, W, fing, palm) { const Y = V3.mul(V3.norm(fing), -1); let X = V3.mul(palm, -side); X = V3.norm(V3.sub(X, V3.mul(Y, V3.dot(X, Y)))); const Z = V3.cross(X, Y); return M4.basis(X, Y, Z, W) }
const posed = (o, M) => ({ groups: o.groups, M, vis: true });
// pose: { x, y, z, yaw, sit (0..1), lean, look: [yaw, pitch] for the head,
//         hands: { R: {at, fing, palm, curl, pole}, L: ... } world-space targets (optional), feet: {R: at, L: at} (optional), walk: phase, walkAmt }
function poseChar(P, ps, opt = {}) {
  const G = GIRL, out = [], o = P.o, skin = 'skin2';
  const root = M4.mul(M4.tr(ps.x, ps.y, ps.z), M4.ry(ps.yaw)), fwd = M4.dir(root, [0, 0, -1]), up = [0, 1, 0], right = M4.dir(root, [1, 0, 0]);
  const sit = ps.sit || 0, wk = ps.walkAmt || 0, ph = ps.walk || 0, br = Math.sin((ps.t || 0) / 45) * .012;
  const hipsY = G.hips - sit * .36 + wk * Math.abs(Math.cos(ph)) * .012, hipsZ = sit * .06;
  const hips = M4.chain(root, M4.tr(0, hipsY, hipsZ), M4.rx(-sit * .04), M4.ry(Math.sin(ph) * .06 * wk));
  const torso = M4.chain(hips, M4.tr(0, G.waist, 0), M4.rx((ps.lean || 0) + br), M4.ry(-Math.sin(ph) * .1 * wk));
  const head = M4.chain(torso, M4.tr(0, G.neck, 0), M4.ry(ps.look ? ps.look[0] : 0), M4.rx(ps.look ? ps.look[1] * .7 : 0));
  if (!opt.noBody) { out.push(posed(P.torso, torso), posed(P.hips, hips)) }
  if (opt.head) out.push(posed(P.head, head), posed(P.hair, torso));
  // legs
  for (const s of [-1, 1]) { const k = s > 0 ? 'R' : 'L'; const H0 = M4.pt(hips, [s * G.hip, 0, 0]);
    let A = ps.feet && ps.feet[k];
    if (!A) { if (sit > .5) A = M4.pt(root, [s * .11, .05, -.42 - hipsZ]); else { const sw = Math.sin(ph + (s > 0 ? 0 : PI)) * wk, lift = Math.max(0, Math.cos(ph + (s > 0 ? 0 : PI))) * .07 * wk; A = M4.pt(root, [s * .095, .05 + lift, -sw * .2]) } }
    const pole = V3.add(fwd, V3.mul(up, .1)), [K, A2] = ik2(H0, A, G.th, G.sn, pole);
    out.push(posed(P.th, segM(H0, K, fwd)), posed(P.sn, segM(K, A2, fwd)));
    const toe = sit > .5 ? fwd : V3.norm(V3.add(fwd, V3.mul(right, s * .08))); out.push(posed(P.ft, M4.basis(V3.cross(up, V3.mul(toe, -1)), up, V3.mul(toe, -1), A2))) }
  // arms
  for (const s of [-1, 1]) { const k = s > 0 ? 'R' : 'L'; if (opt.skipArm && opt.skipArm[k]) continue; const S = M4.pt(torso, [s * G.sh[0], G.sh[1], 0]);
    let h = ps.hands && ps.hands[k];
    if (!h) { const sw = -Math.sin(ph + (s > 0 ? 0 : PI)) * wk * .16; h = sit > .5 ? { at: M4.pt(root, [s * .13, .55, -.22]), fing: V3.add(fwd, [0, -.4, 0]), palm: [0, -1, 0], curl: .35 } : { at: M4.pt(torso, [s * .2, -.23 + br * 2, -.02 - sw]), fing: V3.add([0, -1, 0], V3.mul(fwd, .1 - sw * .3)), palm: V3.mul(right, -s), curl: .3 } }
    const pole = h.pole || V3.norm(V3.add(V3.mul(fwd, -.6), V3.add(V3.mul(right, s * .5), [0, -.4, 0]))), W = V3.sub(h.at, V3.mul(V3.norm(h.fing), .0));
    const [E, W2] = ik2(S, W, G.ua, G.fa, pole);
    out.push(posed(P.ua, segM(S, E, fwd)), posed(P.fa, segM(E, W2, fwd)), posed(handObj(s, h.curl ?? .3, skin), handM(s, W2, h.fing, h.palm))) }
  return out;
}
// ---------------------------------------------------------------- the player's own body
const ME = { hist: [], t: 0, yaw: 0, held: null };
function meChar() { return P2.day == 3 ? buildChar('hikari', { coat: 'coath', legs: 'jeans', socks: 'jeans', shoes: 'sneaker', hair: 'hairh', face: 'faceh', long: false, horns: false, skirt: false, sash: false, bell: false, bow: false })
  : buildChar('hitori', { coat: 'coat', legs: 'skin2', socks: 'sock', shoes: 'boot', hair: 'hair', face: 'face', long: true, horns: true, skirt: true, sash: true, bell: true, bow: true }) }
// where the body is: under the camera, a little behind it (so looking down shows your front, not the inside of your coat)
function mePose(extra = {}) {
  ME.t++; ME.yaw += Math.atan2(Math.sin(CAM3.yaw - ME.yaw), Math.cos(CAM3.yaw - ME.yaw)) * .25;
  const own = (meModel() || {}).own, sit = extra.sit || 0, back = own ? (sit ? .05 : .05 + .04 * clamp(-CAM3.pitch - .3, 0, 1)) : sit ? .12 : .13 + .12 * clamp(-CAM3.pitch - .3, 0, 1), eye = sit ? 1.14 : GIRL.eye;
  // seated, the chair gives the spot; the model's puffy collar would sit round the camera, so it moves back a little too
  const by = extra.yaw ?? ME.yaw, sb = sit ? back : 0;
  const x = extra.x != null ? extra.x + Math.sin(by) * sb : (CAM3.x + Math.sin(ME.yaw) * back), z = extra.z != null ? extra.z + Math.cos(by) * sb : (CAM3.z + Math.cos(ME.yaw) * back), y = extra.y ?? (CAM3.y - eye);
  const ps = { x, y, z, yaw: extra.yaw ?? ME.yaw, sit, walk: PL3.bob, walkAmt: PL3.moving ? 1 : 0, t: ME.t, look: [clamp(CAM3.yaw - ME.yaw, -.35, .35), clamp(CAM3.pitch, -.4, .3)], hands: extra.hands, feet: extra.feet, lean: extra.lean };
  ME.hist.push({ ...ps }); if (ME.hist.length > 80) ME.hist.shift();
  return ps;
}
// the objects to draw this frame: your body (no head) in the world, all of you in mirrors, your hands up close
function meObjs(extra = {}) {
  if (P2.hideBody) return { body: [], mirror: [], vm: [] };
  const ps = mePose(extra), skipArm = {};
  const vm = []; if (ME.vm) for (const k in ME.vm) { skipArm[k] = 1; vm.push(...ME.vm[k]) }
  const body = poseMe(ps, { skipArm });
  const mp = ps;   // the reflection always matches you
  const mirror = poseMe(mp, { head: true });
  return { body, mirror, vm };
}
// ---------------------------------------------------------------- hands held in front of the camera
// positions in camera space (x right, y up, -z ahead) turned into the world, so the room's lights fall on them
const camPt = (p) => M4.pt(camWorld(), p), camDir = (d) => M4.dir(camWorld(), d);
function vmArm(side, at, fing, palm, curl, pole) {   // all in camera space
  const H = meModel(); if (H) return vmArmModel(H, side, at, fing, palm, curl, pole);
  const P = meChar(), S = camPt(at[2] < -.3 ? [side * .2, -.42, .02] : [side * .19, -.3, .1]), W = camPt(at), [E, W2] = ik2(S, W, GIRL.ua, GIRL.fa, camDir(pole || [side, -.8, .4]));
  const f = camDir([0, 0, -1]);
  return [posed(P.ua, segM(S, E, f)), posed(P.fa, segM(E, W2, f)), posed(handObj(side, curl, 'skin3'), handM(side, W2, camDir(fing), camDir(palm)))];
}
// ---------------------------------------------------------------- the phone in your hand
// How first-person games do this, and what's done here:
//  - a viewmodel: the hand and phone are drawn in their own pass with a narrower field of view, so they never sink
//    into walls and don't stretch at the edges of the screen
//  - one held pose, authored for the camera: a relaxed one-handed grip, the phone a little low and right of centre,
//    screen tipped towards the eyes; the fingers make a shelf on the far edge and the thumb is left free
//  - procedural layers on top of that pose, the way games add life to a static hold: raise/lower with a small
//    overshoot, breathing, inertia (the phone lags when the view turns, then springs back), a figure-8 bob when walking,
//    a jolt when something arrives, and hands that start to shake when things go wrong
//  - the thumb is IK'd (two bones solved to reach a point): its tip follows where you point on the screen, presses
//    down when you choose something, and the hand slides up the phone to reach the top rows, like a real regrip
const PHONE_VM = { c: [-.03, -.012, -.34], tilt: .1, w: [.018, -.028, .1], f: [-.62, 0, -.78], curl: .85 }, VMFOV = .62;
// the thumb's knuckle in the phone's space (x across, y out of the screen, z down its length), its two bones, radii
const THUMB = { B: [.0425, .002, .046], a: .03, b: .026, r: [.0084, .0077, .0067] };
const PSCR = { w: .064, h: .14, y: .0095 };   // the screen: 60 x 131 UI units over .064 x .14 m, and its surface
const phScr = (ux, uy, h = 0) => [-PSCR.w / 2 + ux / 60 * PSCR.w, PSCR.y + h, -PSCR.h / 2 + uy / 131 * PSCR.h];
function phoneVM(t = 0, off = [0, 0, 0], rot) {
  const c = V3.add(PHONE_VM.c, off);
  if (rot) return M4.chain(M4.tr(c[0], c[1], c[2]), M4.ry(rot[1]), M4.rz(rot[2]), M4.rx(HP - PHONE_VM.tilt + rot[0]));
  const sw = Math.sin(t / 50) * .002;
  return M4.chain(M4.tr(c[0] + sw, c[1] + Math.sin(t / 37) * .0015, c[2]), M4.rx(HP - PHONE_VM.tilt), M4.rz(0));
}
// the thumb's two moving bones as separate pieces (each built along -y from its joint, nail towards -z)
const THUMBS = {};
function thumbParts(sk) {
  if (THUMBS[sk]) return THUMBS[sk]; texBody(); const T = THUMB;
  const p = new MB(); p.sphere(sk, 0, 0, 0, T.r[0], T.r[0], T.r[0], { seg: 12, rings: 8 }); smoothFinger(p, sk, [[0, 0, 0], [0, -T.a * .5, 0], [0, -T.a, 0]], [T.r[0], T.r[0] * .95, T.r[1]]);
  const d = new MB(); d.sphere(sk, 0, 0, 0, T.r[1], T.r[1], T.r[1], { seg: 12, rings: 8 });
  const e = smoothFinger(d, sk, [[0, 0, 0], [0, -T.b * .5, 0], [0, -T.b, 0]], [T.r[1], T.r[1] * .98, T.r[2]]); nailOn(d, e.end, e.d, [0, 0, -1], T.r[2], 1.15);
  return THUMBS[sk] = [p.build(), d.build()];
}
// ---- the motion layers, worked out once a frame from the phone's UI state
const PHA = { u: null };
function phoneAnim(u) {
  if (PHA.u !== u) Object.assign(PHA, { u, sx: 0, sy: 0, vx: 0, vy: 0, fw: camFwd(), walk: 0, tip: null, tv: [0, 0, 0], slide: 0, tap: 0, tapAt: null, kick: 0, call: 0, mode: u.mode, ended: 0, closing: 0, shown: 0, mouse: [P2MOUSE.x, P2MOUSE.y], mt: 999, shake: 0 });
  const t = u.t, r = clamp(u.lift, 0, 1);
  // raise (eased out with a little overshoot, so it settles into the hand) and lower (eased in, no overshoot)
  const x1 = r - 1, e = u.closing ? r * r * (3 - 2 * r) : 1 + 2.1 * x1 * x1 * x1 + 1.1 * x1 * x1, q = 1 - e;
  const off = [.07 * q, -.2 * q, .05 * q], rot = [-.75 * q, .25 * q, -.45 * q];
  // breathing: a slow rise and fall, a slower drift
  const br = Math.sin(t / 68); off[0] += Math.sin(t / 111) * .0012; off[1] += br * .0016; rot[0] += br * .008; rot[2] += Math.sin(t / 93) * .006;
  // inertia: how far the view turned this frame, across and up; the phone is pushed the other way and springs back
  const f = camFwd(), d = V3.sub(f, PHA.fw); PHA.fw = f;
  const tx = clamp(-V3.dot(d, camDir([1, 0, 0])) * 2, -.08, .08), ty = clamp(-V3.dot(d, camDir([0, 1, 0])) * 2, -.08, .08);
  PHA.vx = (PHA.vx + (tx - PHA.sx) * .16) * .72; PHA.sx += PHA.vx; PHA.vy = (PHA.vy + (ty - PHA.sy) * .16) * .72; PHA.sy += PHA.vy;
  off[0] += PHA.sx * .16; off[1] += PHA.sy * .16; rot[1] += PHA.sx * .5; rot[2] -= PHA.sx * .6; rot[0] -= PHA.sy * .4;
  // walking: the hand swings in a small figure-8 in step with the feet
  PHA.walk += ((PL3.moving ? 1 : 0) - PHA.walk) * .1; const ph = PL3.bob || 0;
  off[0] += Math.sin(ph) * .006 * PHA.walk; off[1] += Math.sin(ph * 2) * .0035 * PHA.walk; rot[2] += Math.sin(ph) * .02 * PHA.walk;
  // a jolt when a message lands; on the phone, she brings it in a little closer and tips it towards her
  if (u.mode == 'texts' && u.shown > PHA.shown) { PHA.kick = 1; PHA.shown = u.shown } PHA.kick *= .86;
  off[1] += PHA.kick * .012; off[2] += PHA.kick * .015; rot[0] += PHA.kick * .09;
  PHA.call += ((u.mode == 'call' && u.connected && !u.ended ? 1 : 0) - PHA.call) * .05;
  off[0] += PHA.call * .012; off[1] += PHA.call * .01; off[2] += PHA.call * .03; rot[1] -= PHA.call * .12; rot[2] -= PHA.call * .05;
  // shaking hands: worse with every message she reads; Hikari's never quite stop
  const sh = u.mode == 'texts' ? .4 + .6 * u.shown / Math.max(1, (typeof TEXTS != 'undefined' ? TEXTS.length : 6)) : P2.day == 3 ? .25 : 0;
  PHA.shake += (sh - PHA.shake) * .03; const tr = PHA.shake * (Math.sin(t * 1.9) * .6 + Math.sin(t * 3.7 + 1) * .4);
  off[0] += tr * .0016; off[1] += Math.sin(t * 2.3 + 2) * PHA.shake * .0012; rot[2] += tr * .012;
  // ---- the thumb
  const T = thumbTarget(u, t), tip = PHA.tip || (PHA.tip = T.slice());
  for (let k = 0; k < 3; k++) { PHA.tv[k] = (PHA.tv[k] + (T[k] - tip[k]) * .24) * .58; tip[k] += PHA.tv[k] }
  const pr = PHA.tap > 0 ? Math.sin(Math.PI * (14 - PHA.tap) / 14) : 0; off[1] -= pr * .003; rot[0] += pr * .025;   // the phone gives a little under the press
  // the hand slides up the phone when the thumb needs to reach the top of the screen, and back down after
  const want = clamp(THUMB.B[2] - tip[2] - .048, 0, .026); PHA.slide += (want - PHA.slide) * .1;
  return { off, rot, tip, slide: PHA.slide, rise: r };
}
// where the thumb's tip should be: over what you're pointing at, pressing when you pick it, resting on the edge otherwise
function thumbTarget(u, t) {
  // the thumb only follows the pointer while you're actually moving it (the phone sways under a still pointer)
  const M = u.mouse, inScr = M && M[0] > 1 && M[0] < 59 && M[1] > 14 && M[1] < 130, pm = [P2MOUSE.x, P2MOUSE.y];
  if (PHA.mouse && Math.abs(pm[0] - PHA.mouse[0]) + Math.abs(pm[1] - PHA.mouse[1]) > .5) PHA.mt = 0; else PHA.mt++; PHA.mouse = pm;
  const hover = .012, rest = [.031, PSCR.y + .0085 + Math.sin(t / 47) * .001, .022 + Math.sin(t / 61) * .002];
  let aim = null;
  if (u.mode == 'contacts') aim = inScr && PHA.mt < 120 ? [M[0], M[1]] : [44, 31 + (u.sel || 0) * 19];
  // taps: picking a contact, hanging up, putting the phone down
  const tapOn = (p) => { PHA.tap = 14; PHA.tapAt = p };
  if (u.mode != PHA.mode) { if (u.mode == 'call' && PHA.mode == 'contacts') tapOn(PHA.lastAim || [44, 31 + (u.sel || 0) * 19]); PHA.mode = u.mode }
  if (u.ended && !PHA.ended) tapOn([30, 115]); PHA.ended = u.ended;
  if (u.closing && !PHA.closing) tapOn(inScr ? [M[0], M[1]] : [30, 122]); PHA.closing = u.closing;
  if (aim) PHA.lastAim = aim;
  if (PHA.tap > 0) { PHA.tap--; const pr = Math.sin(Math.PI * (14 - PHA.tap) / 14); return phScr(PHA.tapAt[0], PHA.tapAt[1], THUMB.r[2] + .001 + hover * (1 - pr)) }
  if (aim) return phScr(aim[0], aim[1] + 3, THUMB.r[2] + .001 + hover + Math.sin(t / 29) * .0015);
  return rest;
}
function phoneHeld(t, off, A) {   // returns { objs, corners (UI coords) }
  const L = phoneVM(t, off, A && A.rot), W = M4.mul(camWorld(), L), ph = H3.extra.phoneHand || (H3.extra.phoneHand = single(m => MOD.phone(m)));
  const sl = A ? A.slide : 0, LG = M4.mul(L, M4.tr(0, 0, -sl)), WG = M4.mul(W, M4.tr(0, 0, -sl)), loc = p => M4.pt(LG, p);   // the hand, slid along the phone
  const H = meModel(), own = H && H.own, hk = own ? H.key == 'hikari' : P2.day == 3;
  const sk = own ? (hk ? 'skinK' : 'skinH') : 'skin3', gr = phoneGrip(sk, own ? (hk ? 'long' : 'short') : (hk ? 'long' : false));
  const wr = loc(hk ? V3.add(gr.wrist, [.03, -.012, .07]) : gr.wrist), fing = M4.dir(L, PHONE_VM.f), palm = M4.dir(L, [0, 1, 0]);
  const arm = vmArm(1, wr, fing, palm, PHONE_VM.curl, [1, -1.2, .3]); if (own) arm[0].parts = []; arm[2] = posed(gr, WG);
  // the thumb: two bones from its knuckle to the tip, the knuckle bending up and out (never down into the screen)
  const B = V3.add(THUMB.B, [0, 0, -sl]), tip = (A && A.tip) || [.031, .018, .022], tp = thumbParts(sk);
  const [K, T2] = ik2(B, tip, THUMB.a, THUMB.b, [.5, 1, .25]), up = [.25, 1, 0];
  const th = [posed(tp[0], M4.mul(W, segM(B, K, up))), posed(tp[1], M4.mul(W, segM(K, T2, up)))];
  const cs = [[-.032, .0095, -.07], [.032, .0095, -.07], [.032, .0095, .07], [-.032, .0095, .07]].map(p => proj3(M4.pt(W, p), true));
  return { objs: [posed(ph, W), ...arm, ...th], corners: cs };
}

// ================================================================ the 3D Hitori model
// The supplied model (one mesh, ~80k triangles) with a cleaned and repainted texture, skinned to 15 bones so the same
// IK as before can pose it: hips, torso, head, upper arm / forearm / hand on each side, thigh / shin / foot on each side.
// Its mitten hands are left out; the jointed hands above are put on its wrists instead (they hold the phone properly).
const HB = { hips: 0, torso: 1, head: 2, uaL: 3, faL: 4, handL: 5, uaR: 6, faR: 7, handR: 8, thL: 9, snL: 10, ftL: 11, thR: 12, snR: 13, ftR: 14 };
const HMODS = {};
function hitoriModel() { return charModel('hitori', typeof HITORI_DATA == 'undefined' ? null : HITORI_DATA) }
function hikariModel() { return charModel('hikari', typeof HIKARI_DATA == 'undefined' ? null : HIKARI_DATA) }
// the model of whoever you are today: Hitori, or Hikari on day three
function meModel() { return P2.day == 3 ? hikariModel() : hitoriModel() }
function charModel(key, D) {
  if (HMODS[key]) return HMODS[key]; if (!D || !glInit()) return null;
  const b64 = s => { const t = atob(s), u = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) u[i] = t.charCodeAt(i); return u.buffer };
  const raw = new DataView(b64(D.v)), n = D.nv, f = new Float32Array(n * 11);
  for (let i = 0; i < n; i++) { const o = i * 18, k = i * 11;
    f[k] = raw.getInt16(o, true) / 1e4; f[k + 1] = raw.getInt16(o + 2, true) / 1e4; f[k + 2] = raw.getInt16(o + 4, true) / 1e4;
    f[k + 3] = raw.getInt8(o + 6) / 127; f[k + 4] = raw.getInt8(o + 7) / 127; f[k + 5] = raw.getInt8(o + 8) / 127;
    f[k + 6] = raw.getUint16(o + 10, true) / 65535; f[k + 7] = raw.getUint16(o + 12, true) / 65535;
    f[k + 8] = raw.getUint8(o + 14); f[k + 9] = raw.getUint8(o + 15); f[k + 10] = raw.getUint8(o + 16) / 255 }
  const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, f, gl.STATIC_DRAW);
  const u32 = D.u32 && gl.getExtension('OES_element_index_uint'), ib = {}, ia = {}; for (const p in D.i) { const a = u32 ? new Uint32Array(b64(D.i[p])) : new Uint16Array(b64(D.i[p])), b = gl.createBuffer(); ia[p] = a; gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, a, gl.STATIC_DRAW); ib[p] = { b, n: a.length, t: u32 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT } }
  // the texture: drawn onto a canvas once the picture has loaded (a data URL, so it never taints the canvas)
  const tk = 'model_' + key, T = tex(tk, 2048, (g, s) => { g.fillStyle = '#2b2629'; g.fillRect(0, 0, s, s) }); T.mip = 1;
  const im = new Image(); im.onload = () => { T.g.drawImage(im, 0, 0, 2048, 2048); T.dirty = 1 }; im.src = D.tex;
  // the face has its own small painted texture (eyes, nose, mouth), mapped flat from the front
  const ptex = {}; if (D.ftex) { const FT = tex(tk + '_face', 512, (g, s) => { g.fillStyle = '#e8e0dc'; g.fillRect(0, 0, s, s) }); FT.mip = 1; const fi = new Image(); fi.onload = () => { FT.g.drawImage(fi, 0, 0, 512, 512); FT.dirty = 1 }; fi.src = D.ftex; ptex.face = tk + '_face' }
  // the bind pose: each bone's frame, built the same way the posed frames are
  const J = D.J, fw = [0, 0, -1], inv = M => { const o = new Float32Array(16); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) o[i * 4 + j] = M[j * 4 + i]; for (let i = 0; i < 3; i++) o[12 + i] = -(o[i] * M[12] + o[4 + i] * M[13] + o[8 + i] * M[14]); o[15] = 1; return o };
  const bind = []; bind[HB.hips] = M4.tr(...J.pelvis); bind[HB.torso] = M4.tr(...J.waist); bind[HB.head] = M4.tr(...J.neck);
  for (const s of ['L', 'R']) { bind[HB['ua' + s]] = segM(J['sh' + s], J['el' + s], fw); bind[HB['fa' + s]] = segM(J['el' + s], J['wr' + s], fw); bind[HB['hand' + s]] = D.modelHands ? handM(s == 'R' ? 1 : -1, J['wr' + s], V3.sub(J['tip' + s], J['wr' + s]), [s == 'R' ? -1 : 1, 0, 0]) : bind[HB['fa' + s]];
    bind[HB['th' + s]] = segM(J['hip' + s], J['knee' + s], fw); bind[HB['sn' + s]] = segM(J['knee' + s], J['ank' + s], fw); bind[HB['ft' + s]] = M4.tr(...J['ank' + s]) }
  const len = (a, b) => V3.len(V3.sub(J[a], J[b]));
  return HMODS[key] = { key, raw: { f, ia }, own: !!D.modelHands, bind, cuff: D.modelHands ? 0 : key == 'hikari' ? .085 : 0, tuck: D.modelHands ? 0 : key == 'hikari' ? .1 : 0, skin: { vb, ib, tex: tk, ptex, spec: .08 }, J, inv: bind.map(inv), ua: (len('shL', 'elL') + len('shR', 'elR')) / 2, fa: (len('elL', 'wrL') + len('elR', 'wrR')) / 2, th: (len('hipL', 'kneeL') + len('hipR', 'kneeR')) / 2, sn: (len('kneeL', 'ankL') + len('kneeR', 'ankR')) / 2 };
}
// one posed copy of the model: bones[i] = posed frame * inverse(bind frame)
function hmObj(H, mats, parts) { const b = new Float32Array(15 * 16); for (let i = 0; i < 15; i++) b.set(M4.mul(mats[i], H.inv[i]), i * 16); return { skin: H.skin, bones: b, parts, vis: true, groups: [] } }
// the same pose description as poseChar (see above)
function poseModel(H, ps, opt = {}) {
  const J = H.J, out = [], mats = [], sub = V3.sub;
  const root = M4.mul(M4.tr(ps.x, ps.y, ps.z), M4.ry(ps.yaw)), fwd = M4.dir(root, [0, 0, -1]), up = [0, 1, 0], right = M4.dir(root, [1, 0, 0]);
  const sit = ps.sit || 0, wk = ps.walkAmt || 0, ph = ps.walk || 0, br = Math.sin((ps.t || 0) / 45) * .01;
  const hipsY = J.pelvis[1] - sit * .36 + wk * Math.abs(Math.cos(ph)) * .012, hipsZ = sit * .06;
  const hips = M4.chain(root, M4.tr(J.pelvis[0], hipsY, J.pelvis[2] + hipsZ), M4.rx(-sit * .04), M4.ry(Math.sin(ph) * .06 * wk));
  const torso = M4.chain(hips, M4.tr(...sub(J.waist, J.pelvis)), M4.rx((ps.lean || 0) + br), M4.ry(-Math.sin(ph) * .1 * wk));
  const head = M4.chain(torso, M4.tr(...sub(J.neck, J.waist)), M4.ry(ps.look ? ps.look[0] : 0), M4.rx(ps.look ? ps.look[1] * .7 : 0));
  mats[HB.hips] = hips; mats[HB.torso] = torso; mats[HB.head] = head;
  for (const s of [-1, 1]) { const k = s > 0 ? 'R' : 'L', H0 = M4.pt(hips, sub(J['hip' + k], J.pelvis)), ank = J['ank' + k];
    let A = ps.feet && ps.feet[k];
    if (!A) { if (sit > .5) A = M4.pt(root, [ank[0] * 1.6, ank[1], -.42 - hipsZ]); else { const sw = Math.sin(ph + (s > 0 ? 0 : PI)) * wk, lift = Math.max(0, Math.cos(ph + (s > 0 ? 0 : PI))) * .07 * wk; A = M4.pt(root, [ank[0], ank[1] + lift, ank[2] - sw * .2]) } }
    const [K, A2] = ik2(H0, A, H.th, H.sn, V3.add(fwd, V3.mul(up, .1)));
    mats[HB['th' + k]] = segM(H0, K, fwd); mats[HB['sn' + k]] = segM(K, A2, fwd);
    const toe = sit > .5 ? fwd : V3.norm(V3.add(fwd, V3.mul(right, s * .04))); mats[HB['ft' + k]] = M4.basis(V3.cross(up, V3.mul(toe, -1)), up, V3.mul(toe, -1), A2) }
  const parts = ['body']; if (opt.head) parts.push('head', 'hair', 'face');   // in first person the head and the hair round it are left out (the camera is in there)
  for (const s of [-1, 1]) { const k = s > 0 ? 'R' : 'L', S = M4.pt(torso, sub(J['sh' + k], J.waist));
    let h = ps.hands && ps.hands[k];
    if (!h) { const sw = -Math.sin(ph + (s > 0 ? 0 : PI)) * wk * .14, w = sub(J['wr' + k], J.waist);
      h = sit > .5 ? { at: M4.pt(root, [s * .15, .58, -.24]), fing: V3.add(fwd, [0, -.4, 0]), palm: [0, -1, 0], curl: .35 } : { at: M4.pt(torso, [w[0], w[1] + br * 2, w[2] - sw]), fing: V3.add([0, -1, 0], V3.mul(fwd, .08 - sw * .3)), palm: V3.mul(right, -s), curl: .3 } }
    // a model with long sleeves (Hikari): the hand sits tucked up inside the sleeve, only the fingers showing
    const fd = V3.norm(h.fing), sat = h.at;
    const pole = h.pole || V3.norm(V3.add(V3.mul(fwd, -.6), V3.add(V3.mul(right, s * .5), [0, -.4, 0]))), [E, W2] = ik2(S, sat, H.ua, H.fa, pole);
    mats[HB['ua' + k]] = segM(S, E, fwd); mats[HB['fa' + k]] = segM(E, W2, fwd); mats[HB['hand' + k]] = H.own ? handM(s, W2, h.fing, h.palm) : mats[HB['fa' + k]];
    if (!(opt.skipArm && opt.skipArm[k])) { parts.push('arm' + k); if (H.own) parts.push('fa' + k, 'hand' + k); else out.push(posed(handObj(s, h.curl ?? .3, 'skin3'), handM(s, V3.sub(W2, V3.mul(fd, H.tuck)), h.fing, h.palm))) } }
  out.unshift(hmObj(H, mats, parts));
  return out;
}
// Hitori is the model; Hikari (day three) is still the built character
function poseMe(ps, opt) { const H = meModel(); return H ? poseModel(H, ps, opt) : poseChar(meChar(), ps, opt) }
// an arm of the model held up in front of the camera: only that sleeve is drawn, every other bone follows the upper arm
function vmArmModel(H, side, at, fing, palm, curl, pole) {
  const k = side > 0 ? 'R' : 'L', fd = V3.norm(camDir(fing)), W0 = camPt(at);
  let S = camPt(at[2] < -.3 ? [side * .2, -.42, .02] : [side * .19, -.3, .1]);
  // a long sleeve (Hikari): its cuff is pushed on past the wrist, along the back of the hand, so it covers most of the fingers
  const W = V3.add(W0, V3.mul(V3.norm(V3.add(V3.norm(V3.sub(W0, S)), V3.mul(fd, 1.2))), H.cuff));
  // the shoulder (never seen) comes in close enough that the arm really reaches that far, instead of stopping short
  const reach = (H.ua + H.fa) * .9, sw = V3.sub(S, W); if (V3.len(sw) > reach) S = V3.add(W, V3.mul(V3.norm(sw), reach));
  const [E, W2] = ik2(S, W, H.ua, H.fa, camDir(pole || [side, -.8, .4]));
  const f = camDir([0, 0, -1]), ua = segM(S, E, f), fa = segM(E, W2, f), mats = [];
  // the shoulder's torso-weighted edge: put the torso where it would sit for this shoulder
  const tor = M4.chain(M4.tr(...S), M4.ry(CAM3.yaw), M4.tr(...V3.mul(V3.sub(H.J['sh' + k], H.J.waist), -1)));
  for (let i = 0; i < 15; i++) mats[i] = tor; mats[HB['ua' + k]] = ua; mats[HB['fa' + k]] = fa; mats[HB['hand' + k]] = H.own ? handM(side, W2, camDir(fing), camDir(palm)) : fa;
  if (H.own) return [hmObj(H, mats, ['fa' + k, 'hand' + k]), { vis: false }, { vis: false }];   // the model's own hand
  return [hmObj(H, mats, ['arm' + k]), { vis: false }, posed(handObj(side, curl, 'skin3'), handM(side, V3.sub(W2, V3.sub(W, W0)), camDir(fing), camDir(palm)))];
}
