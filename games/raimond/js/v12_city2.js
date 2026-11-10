// ==================== v12: neon-district ramen kiosks, more street life, and The House as a captain's office ====================

// ---------------------------------------------------------------- the kiosk: a little ramen shack with a neon-trimmed roof
// wooden counter covered in stickers, stools out front, a cook at the stove inside, a hip roof edged with glowing tubes,
// an AC unit on top, the shop's name in neon letters on the roof and a tall vertical sign down one side
function techKiosk(G, x, y, o) {
  const neon = o.n || '#5affe0', side = o.sn || '#ff8a5a', wood = '#a8683a', woodD = '#6a3e20', ink = '#140c10', steel = '#3a3a46';
  SHD(G, x + 2, y, 34, 5);
  // back of the shack: tiled wall, a hanging screen, a shelf of bottles, the stove with pots
  PF(G, x - 29, y - 62, 58, 32, ink); PF(G, x - 28, y - 61, 56, 31, '#3a2a24');
  for (let j = 0; j < 6; j++) for (let i = 0; i < 7; i++) PF(G, x - 6 + i * 4, y - 58 + j * 4, 3, 3, (i + j) % 3 ? '#d8ccb0' : '#c8bc9c');
  PF(G, x - 25, y - 58, 13, 9, ink); PF(G, x - 24, y - 57, 11, 7, '#2a6a8a'); PF(G, x - 23, y - 56, 4, 2, '#8ae8ff'); PF(G, x - 19, y - 61, 1, 3, steel);
  PF(G, x + 21, y - 50, 6, 1, woodD); for (let i = 0; i < 3; i++) { PF(G, x + 21 + i * 2, y - 55, 1, 5, ['#3a8a4a', '#8a4a1a', '#3a8a4a'][i]); PF(G, x + 21 + i * 2, y - 56, 1, 1, '#c8c8c8') }
  PF(G, x + 4, y - 38, 16, 6, '#b8b8c4'); PF(G, x + 4, y - 38, 16, 1, '#e8e8f0'); PF(G, x + 6, y - 45, 7, 7, '#9a9aa8'); PF(G, x + 6, y - 45, 7, 1, '#d8d8e0'); PF(G, x + 14, y - 43, 5, 5, '#8a8a98');
  // the cook
  PF(G, x - 10, y - 53, 8, 4, '#f4f4f4'); PF(G, x - 9, y - 55, 6, 2, '#f4f4f4'); PF(G, x - 9, y - 49, 6, 5, '#e8b890'); PF(G, x - 8, y - 47, 1, 1, ink); PF(G, x - 5, y - 47, 1, 1, ink); PF(G, x - 12, y - 44, 10, 12, '#5a6a7a'); PF(G, x - 12, y - 44, 10, 1, '#7a8a9a'); PF(G, x - 3, y - 40, 5, 2, '#5a6a7a');
  // posts and the strip lights under the roof
  for (const px of [-29, 27]) { PF(G, x + px, y - 62, 3, 32, woodD); PF(G, x + px, y - 62, 1, 32, wood) } PF(G, x - 26, y - 61, 52, 1, '#f0ffff');
  // the counter: steel top, wood front with brackets, stickers and a vent, metal feet, a cable trailing off
  PF(G, x - 33, y - 32, 66, 5, ink); PF(G, x - 32, y - 32, 64, 3, '#2a2a34'); PF(G, x - 32, y - 32, 64, 1, '#9a9aaa');
  PF(G, x - 31, y - 27, 62, 22, ink); PF(G, x - 30, y - 26, 60, 20, wood); for (let i = 0; i < 6; i++) PF(G, x - 30, y - 26 + i * 4, 60, 1, sh(wood, .9));
  for (let i = 0; i < 6; i++) { PF(G, x - 28 + i * 11, y - 26, 2, 20, steel); PF(G, x - 28 + i * 11, y - 26, 1, 20, '#5a5a6a') }
  for (const [a, b, w, h, c] of [[-24, -20, 5, 3, '#ff5a8a'], [-17, -14, 4, 4, '#ffd23c'], [-13, -22, 6, 3, '#f4f4f4'], [-5, -12, 5, 3, '#2ee6e6'], [2, -21, 4, 5, '#ff8a3a'], [-21, -11, 3, 2, '#8ae85a'], [7, -15, 3, 3, '#c89aff'], [22, -19, 4, 4, '#f4f4f4']]) { PF(G, x + a, y + b, w, h, c); PF(G, x + a, y + b, w, 1, sh(c, 1.2)) }
  PF(G, x + 12, y - 20, 10, 9, ink); for (let i = 0; i < 4; i++) PF(G, x + 13, y - 19 + i * 2, 8, 1, '#6a6a7a');
  PF(G, x - 31, y - 6, 62, 2, ink); for (const fx of [-27, -4, 20]) PF(G, x + fx, y - 4, 3, 4, steel); PF(G, x + 31, y - 2, 9, 1, '#1a1a22'); PF(G, x + 39, y - 4, 3, 3, '#3a3a46');
  // stools
  for (const sx of [-20, -4, 12]) { PF(G, x + sx - 4, y - 9, 1, 9, '#2a2a30'); PF(G, x + sx + 3, y - 9, 1, 9, '#2a2a30'); PF(G, x + sx - 4, y - 4, 8, 1, '#3a3a40'); PE(G, x + sx, y - 10, 5, 2, ink); PE(G, x + sx, y - 11, 4.4, 1.6, '#6a4a2a') }
  // roof: a front slab edged with tube lights, a sloping hip roof, the AC unit
  PF(G, x - 35, y - 68, 70, 7, ink); PF(G, x - 34, y - 67, 68, 5, '#5a4a40'); for (let i = 0; i < 5; i++) { PF(G, x - 32 + i * 13.4, y - 66, 11, 2, '#e8ffff'); PF(G, x - 32 + i * 13.4, y - 67, 11, 1, 'rgba(160,255,255,.6)') }
  for (let k = 0; k < 14; k++) PF(G, x - 30 + k * .9, y - 69 - k, 60 - k * 1.8, 1, k == 13 ? '#4a3a30' : k % 5 == 0 ? '#6a5242' : '#8a6a52');
  PF(G, x - 6, y - 78, 12, 4, '#5a4a40'); for (let i = 0; i < 3; i++) PF(G, x - 5, y - 77 + i, 10, 1, i % 2 ? '#3a2e26' : '#6a5a4a');
  PF(G, x + 12, y - 92, 16, 13, ink); PF(G, x + 13, y - 91, 14, 11, '#c8c4b8'); PE(G, x + 20, y - 86, 4, 4, '#5a5a5a'); PE(G, x + 20, y - 86, 1.5, 1.5, '#9a9a9a'); PF(G, x + 27, y - 88, 6, 3, '#4a4a50'); PF(G, x + 31, y - 88, 2, 12, '#4a4a50');
  // the round pink logo on the roof's left corner and the frame of the tall side sign
  PE(G, x - 26, y - 82, 7, 8, ink); PE(G, x - 26, y - 82, 6, 7, '#ff8ad0'); PE(G, x - 26, y - 82, 4, 5, '#2a0a1a'); for (let i = 0; i < 3; i++) PF(G, x - 28 + i * 2, y - 86, 1, 8, '#ffc8e8');
  PF(G, x + 34, y - 66, 8, 44, ink); PF(G, x + 35, y - 65, 6, 42, '#1a0e14'); PF(G, x + 33, y - 60, 2, 2, steel); PF(G, x + 33, y - 30, 2, 2, steel);
  if (o.text) { G.save(); G.font = 'bold 7px monospace'; G.textAlign = 'center'; G.fillStyle = ink; G.fillText(o.text, x - 1, y - 72); G.fillStyle = neon; G.fillText(o.text, x - 2, y - 73);
    G.font = 'bold 5px monospace'; G.fillStyle = side; [...(o.side || 'NOODLES')].slice(0, 7).forEach((c, i) => G.fillText(c, x + 38, y - 59 + i * 6)); G.restore() }
}
// decorative kiosks (props) for the market rows, the plaza and the station
PROPS.kiosk = { w: 4, s: [0, 0, 4, 1], d(G, x, y, P, s, p) { techKiosk(G, x, y, { text: p.t || 'RAMEN', side: p.side || 'NOODLES', n: p.n, sn: p.sn }) } };
// the shops you can buy from (the market's four stalls) become kiosks too: their names glow and flicker live
const _stallV12 = OBJ.stall;
OBJ.stall = (x, y, e) => { const st = STALLSTY[e.shop] || {}; if (st.rustic) return _stallV12(x, y, e);
  X.globalCompositeOperation = 'lighter'; ell(x, y - 64, 40, 10, 'rgba(120,255,240,' + (.07 + Math.sin(tick / 25) * .02).toFixed(3) + ')'); ell(x, y - 30, 30, 18, 'rgba(255,190,120,.06)'); X.globalCompositeOperation = 'source-over';
  drawC('kiosk_' + e.shop, 5, (G, cx, by) => techKiosk(G, cx, by, { n: st.sc }), x, y);
  const fl = ((tick >> 3) % 37) ? 1 : 0; txt(st.sign, (x - 2) / 2, (y - 80) / 2, fl ? st.sc : '#fff', 'center', 4.4);
  [...(st.side || st.sign.split(' ').pop())].slice(0, 7).forEach((c, i) => txt(c, (x + 38) / 2, (y - 64 + i * 6) / 2, ((tick >> 4) + i) % 11 ? '#ff8a5a' : '#ffe0c8', 'center', 3));
  if (st.steam) for (let i = 0; i < 3; i++) { const q = (tick / 2 + i * 13) % 26; ell(x + 8 + i * 4 + Math.sin(q / 4) * 2, y - 46 - q, 2 + q / 10, 2 + q / 10, 'rgba(255,255,255,' + (.26 * (1 - q / 26)).toFixed(2) + ')') }
  (st.goods || []).forEach((id, i) => drawCons(id, x - 24 + i * 9, y - 36, .5)) };
Object.assign(STALLSTY.buns, { side: 'BUNS' }); Object.assign(STALLSTY.noodle, { side: 'NOODLES' }); Object.assign(STALLSTY.teah, { side: 'BOBA' }); Object.assign(STALLSTY.charms, { side: 'LUCK' });
(function () { for (const id in AREAS) if (id.startsWith('n_')) for (const e of AREAS[id].ents) if (e.kind == 'stall' && !(STALLSTY[e.shop] || {}).rustic) e.solid = [-2, -1, 5, 1] })();

// ---------------------------------------------------------------- more street furniture
Object.assign(PROPS, {
  // a dumpster with a half-open lid and bags piled beside it
  dumpster: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 17, 4); PF(G, x - 15, y - 20, 30, 20, '#0e1a14'); PF(G, x - 14, y - 19, 28, 18, '#2a5a3a'); for (let i = 0; i < 4; i++) PF(G, x - 12 + i * 7, y - 17, 1, 15, '#1e4a2c'); PF(G, x - 16, y - 23, 32, 4, '#1a3a26'); PF(G, x - 16, y - 23, 32, 1, '#3a7a4a');
    PF(G, x - 14, y - 27, 14, 4, '#1a3a26'); PF(G, x - 6, y - 8, 10, 3, '#f4f4f4'); PF(G, x - 5, y - 7, 8, 1, '#2a5a3a'); PE(G, x + 18, y - 5, 6, 5, '#1a1a22'); PE(G, x + 17, y - 6, 4, 3, '#2a2a34'); PF(G, x + 16, y - 11, 2, 2, '#1a1a22') } },
  // a lit phone box
  phonebox: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 9, 3); PF(G, x - 8, y - 40, 16, 40, '#140c18'); PF(G, x - 7, y - 39, 14, 38, '#2a6a8a'); PF(G, x - 6, y - 35, 12, 28, 'rgba(160,230,255,.55)'); PF(G, x - 6, y - 35, 2, 28, 'rgba(255,255,255,.4)');
    PF(G, x - 7, y - 39, 14, 4, '#1a3a5a'); PF(G, x - 5, y - 38, 10, 2, '#ffd23c'); PF(G, x - 2, y - 26, 4, 6, '#1a1a22'); PF(G, x - 1, y - 30, 2, 3, '#1a1a22'); PF(G, x - 7, y - 6, 14, 5, '#1a3a5a') } },
  // a newspaper box
  newsbox: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 18, 12, 18, '#140c18'); PF(G, x - 5, y - 17, 10, 16, '#c83a3a'); PF(G, x - 4, y - 15, 8, 6, '#f4f0e0'); PF(G, x - 3, y - 14, 6, 1, '#3a3a3a'); PF(G, x - 3, y - 12, 4, 1, '#8a8a8a'); PF(G, x - 2, y - 7, 4, 1, '#f4f4f4'); PF(G, x - 5, y - 2, 2, 2, '#1a1a22'); PF(G, x + 3, y - 2, 2, 2, '#1a1a22') } },
  // a puddle reflecting the signs
  puddle: { flat: 1, d(G, x, y, P, s) { PE(G, x, y - 6, 10 + s * 6, 3 + s * 2, 'rgba(10,20,50,.55)'); PE(G, x - 2, y - 7, 6 + s * 3, 1.5, 'rgba(255,90,170,.35)'); PE(G, x + 4, y - 5, 4, 1, 'rgba(90,240,255,.35)') } },
  // a paper poster pasted on a wall face (anchor the tile under the wall)
  wposter: { flat: 1, d(G, x, y, P, s) { const wy = y - 16, c = ['#ff5a8a', '#2ee6e6', '#ffd23c', '#c89aff'][(s * 4) | 0]; PF(G, x - 6, wy - 26, 12, 16, '#f4ecd8'); PF(G, x - 5, wy - 25, 10, 7, c); PF(G, x - 4, wy - 16, 8, 1, '#3a3a3a'); PF(G, x - 4, wy - 14, 6, 1, '#8a8a8a'); PF(G, x + 4, wy - 12, 2, 2, '#c8bca8') } },
  // a ring of benches around a little neon fountain
  nfountain: { w: 3, s: [0, -1, 3, 2], d(G, x, y) { SHD(G, x, y, 26, 5); PE(G, x, y - 8, 24, 9, '#140c18'); PE(G, x, y - 9, 23, 8, '#3a3a5a'); PE(G, x, y - 10, 20, 6, '#1a4a7a'); PE(G, x, y - 10, 15, 4, '#2a6aa8'); for (let i = 0; i < 6; i++) PF(G, x - 14 + i * 6, y - 11 + (i % 2), 3, 1, 'rgba(200,250,255,.6)');
    PF(G, x - 3, y - 26, 6, 16, '#3a3a5a'); PF(G, x - 2, y - 26, 2, 16, '#6a6a8a'); PE(G, x, y - 27, 7, 3, '#3a3a5a'); PE(G, x, y - 28, 6, 2, '#2ee6e6'); for (const dx of [-5, 0, 5]) PF(G, x + dx, y - 36 + Math.abs(dx) / 2, 1, 8, 'rgba(160,240,255,.7)'); PE(G, x, y - 10, 26, 10, 'rgba(46,230,230,.06)') } },
});
(function () {
  const add = (a, ...f) => AREAS[a] && AREAS[a].feat.push(...f), drop = (a, fn) => { if (AREAS[a]) AREAS[a].feat = AREAS[a].feat.filter(f => !fn(f)) };
  // ---- the market: the food carts become a row of kiosks
  drop('n_market', f => f.id == 'cart');
  add('n_market', p('kiosk', 19, 14, { t: 'TAKOYAKI', side: 'OCTO' }), p('kiosk', 6, 24, { t: 'GYOZA', side: 'GYOZA', n: '#ffd23c' }), p('kiosk', 12, 24, { t: 'YAKITORI', side: 'GRILL', n: '#ff8ad0' }), p('kiosk', 18, 24, { t: 'DANGO', side: 'SWEETS', n: '#c89aff' }),
    p('kiosk', 37, 23, { t: 'ODEN', side: 'HOT', n: '#ff8a5a' }), p('kiosk', 55, 23, { t: 'SODA', side: 'COLD', n: '#2ee6e6' }), ...ps('puddle', [[27, 20], [41, 19], [9, 19], [50, 27]]), ...ps('newsbox', [[29, 15], [34, 21]]), p('dumpster', 3, 20), p('phonebox', 60, 12));
  // ---- the street: a takoyaki kiosk and a phone box on the south pavement, news boxes and puddles everywhere
  drop('n_street', f => f.id == 'c_fence' && f.x >= 43);
  add('n_street', p('kiosk', 43, 20, { t: 'TAKOYAKI', side: 'OCTO', n: '#ffd23c' }), p('phonebox', 57, 19), ...ps('newsbox', [[25, 10], [41, 10], [12, 19]]), ...ps('nplanter', [[16, 11], [36, 11], [52, 11], [33, 19]]),
    ...ps('puddle', [[6, 16], [19, 14], [31, 17], [46, 15], [59, 14], [22, 19]]), ...ps('wposter', [[14, 10], [33, 10], [50, 10], [60, 10]]));
  if (AREAS.n_street) for (const f of AREAS.n_street.feat) if (f.id == 'bike' && f.x == 47) { f.x = 49; f.y = 19 }
  // ---- the plaza: a small food court under the lamps on the left, a neon fountain and an oden kiosk on the right
  add('n_plaza', p('kiosk', 19, 23, { t: 'GYOZA', side: 'GYOZA', n: '#ffd23c' }), ...ps('ftable', [[14, 28], [19, 28], [23, 26]]), p('nfountain', 51, 26), p('kiosk', 40, 22, { t: 'ODEN', side: 'HOT', n: '#ff8a5a' }),
    ...ps('ftable', [[44, 28], [57, 25]]), ...ps('nplanter', [[3, 23], [60, 23], [28, 23], [34, 23]]), ...ps('puddle', [[10, 22], [36, 29], [54, 31], [20, 32], [45, 21]]), ...ps('newsbox', [[18, 18], [45, 18]]), p('phonebox', 3, 27), p('dumpster', 58, 28));
  // ---- the alley: dumpsters, puddles, posters
  add('n_alley', p('dumpster', 20, 13), ...ps('puddle', [[16, 26], [28, 26], [20, 8], [13, 14], [24, 16], [36, 20]]), ...ps('wposter', [[20, 25], [26, 25], [33, 14]]), p('bags', 22, 17));
  // ---- the station: a soda kiosk, a phone box, puddles
  add('n_station', p('kiosk', 45, 12, { t: 'SODA', side: 'COLD', n: '#2ee6e6' }), p('phonebox', 6, 10), ...ps('puddle', [[14, 15], [32, 14], [25, 12]]), ...ps('newsbox', [[19, 10], [37, 10]]), ...ps('nplanter', [[11, 10], [13, 10]]));
  // a few of the kiosks have a sign hung on the counter
  const kioskLook = (a, x, y, l) => AREAS[a] && AREAS[a].ents.push(obj('kiosk', x, y, l, { inv: 1 }));
  kioskLook('n_market', 21, 15, ['|TAKOYAKI. A hand-written card on the counter: "BACK IN 5 MIN."', 'Hitori:neutral|The card\'s gone yellow. Five minutes was a long time ago.']);
  kioskLook('n_market', 8, 25, ['|The cook keeps folding gyoza. The tray never fills up and never empties.']);
  kioskLook('n_plaza', 21, 24, ['|"GYOZA - 6 FOR 6". Every price on the menu is six.']);
  kioskLook('n_street', 42, 20, ['|The takoyaki kiosk is closed, but the grill is still warm.']);
})();

// ---------------------------------------------------------------- THE HOUSE: a captain's office (wood panels, portholes, the city behind glass)
Object.assign(PROPS, {
  // a big window onto the night skyline, set into the back wall (no painting above it)
  f_skyline: { flat: 1, w: 8, d(G, x, y) { const wy = y - 16, x0 = x - 62, w = 124, y0 = wy - 50, h = 40;
    PF(G, x0 - 3, y0 - 3, w + 6, h + 7, '#2a160c'); PF(G, x0 - 2, y0 - 2, w + 4, 1, '#8a5a30'); for (let j = 0; j < h; j++) PF(G, x0, y0 + j, w, 1, j < 12 ? '#120a2e' : j < 24 ? '#1a1048' : '#24145a');
    for (let i = 0; i < 26; i++) PF(G, x0 + (i * 37) % w, y0 + (i * 11) % 14, 1, 1, i % 3 ? '#8a8ac8' : '#fff');
    let bx = 0; const hs = [14, 22, 10, 28, 16, 33, 12, 20, 26, 9, 18, 30, 14, 24, 11, 19]; for (let i = 0; bx < w; i++) { const bw = 6 + (i * 5) % 6, bh = hs[i % hs.length]; PF(G, x0 + bx, y0 + h - 6 - bh, bw, bh, i % 2 ? '#0a0820' : '#120e30');
      for (let k = 0; k < bh - 3; k += 3) for (let q = 1; q < bw - 1; q += 2) if (((i * 7 + k * 3 + q) % 5) < 2) PF(G, x0 + bx + q, y0 + h - 6 - bh + 2 + k, 1, 1, ((i + k) % 3) ? '#ffd88a' : '#8ae8ff');
      if (bh > 26) { PF(G, x0 + bx + (bw >> 1), y0 + h - 10 - bh, 1, 4, '#c8c8d8'); PF(G, x0 + bx + (bw >> 1), y0 + h - 11 - bh, 1, 1, '#ff3a3a') } bx += bw + 1 }
    PF(G, x0, y0 + h - 6, w, 6, '#0e0a3a'); for (let i = 0; i < w; i += 5) PF(G, x0 + i, y0 + h - 5 + (i % 3), 3, 1, i % 2 ? '#ffd88a' : '#5a4aa8');
    for (const mx of [41, 82]) PF(G, x0 + mx, y0, 2, h, '#2a160c'); PF(G, x0 - 3, y0 + h, w + 6, 4, '#4a2a16'); PF(G, x0 - 3, y0 + h, w + 6, 1, '#a8703c') } },
  // a ship's wheel hung on the wall
  f_shipwheel: { flat: 1, d(G, x, y) { const cy = y - 16 - 22; for (let i = 0; i < 8; i++) { const a = i * .785; PF(G, x + Math.cos(a) * 9 - .5, cy + Math.sin(a) * 9 - .5, 2, 2, '#6a3e1a') } PE(G, x, cy, 7, 7, '#6a3e1a'); PE(G, x, cy, 5.5, 5.5, '#c8883a'); PE(G, x, cy, 4, 4, '#2a160c'); PE(G, x, cy, 2, 2, '#c8a040');
    for (let i = 0; i < 4; i++) { const a = i * .785; PF(G, x + Math.cos(a) * 3, cy + Math.sin(a) * 3, 1, 1, '#c8883a'); PF(G, x - Math.cos(a) * 3, cy - Math.sin(a) * 3, 1, 1, '#c8883a') } } },
  // a gold pilaster running up the wall face
  f_wpillar: { flat: 1, d(G, x, y, P, s, p) { const wy = y - 16, hh = p.hh || 64; PF(G, x - 4, wy - hh, 8, hh, '#8a6a20'); PF(G, x - 3, wy - hh, 6, hh, '#c8a040'); PF(G, x - 2, wy - hh, 1, hh, '#ffe08a'); PF(G, x - 5, wy - hh, 10, 3, '#8a6a20'); PF(G, x - 5, wy - 4, 10, 4, '#8a6a20'); PF(G, x - 3, wy - 3, 6, 1, '#ffe08a') } },
  // a closed double door set into the wall
  f_wdoor: { flat: 1, w: 2, d(G, x, y) { const wy = y - 16; PF(G, x - 13, wy - 32, 26, 32, '#2a160c'); for (const dx of [-12, 1]) { PF(G, x + dx, wy - 31, 11, 31, '#7a4a28'); PF(G, x + dx + 1, wy - 29, 9, 12, '#6a3e20'); PF(G, x + dx + 1, wy - 15, 9, 12, '#6a3e20'); PF(G, x + dx + 1, wy - 29, 9, 1, '#a8703c') } PF(G, x - 3, wy - 17, 2, 2, '#c8a040'); PF(G, x + 1, wy - 17, 2, 2, '#c8a040') } },
  // a wall-hung brass lamp (the round hanging bulbs in the reference, but fixed to the planks)
  f_wlampb: { flat: 1, d(G, x, y, P, s, p) { const cy = y - 16 - (p.h || 40); PF(G, x, cy - 6, 1, 6, '#3a2a1a'); PE(G, x + .5, cy + 2, 4, 4, '#2a160c'); PE(G, x + .5, cy + 2, 3, 3, '#ff8a9a'); PF(G, x - 2, cy + 1, 5, 1, '#fff0f0'); PE(G, x, cy + 2, 8, 8, 'rgba(255,170,190,.12)') } },
  // the House's desk: heavy carved wood with brass trim, papers and a lamp
  f_bigdesk: { w: 5, s: [0, -1, 5, 2], d(G, x, y) { SHD(G, x + 2, y, 42, 6); PF(G, x - 40, y - 30, 80, 30, '#1e0e06'); PF(G, x - 39, y - 29, 78, 9, '#a8703c'); PF(G, x - 39, y - 29, 78, 2, '#d0965a'); PF(G, x - 39, y - 20, 78, 18, '#7a4a28');
    for (const dx of [-36, 18]) { PF(G, x + dx, y - 18, 18, 14, '#6a3e20'); PF(G, x + dx + 1, y - 17, 16, 1, '#a8703c'); for (let k = 0; k < 2; k++) { PF(G, x + dx + 2, y - 15 + k * 6, 14, 5, '#7a4a28'); PF(G, x + dx + 8, y - 13 + k * 6, 2, 1, '#c8a040') } }
    PF(G, x - 16, y - 18, 32, 10, '#5a3418'); PF(G, x - 6, y - 14, 12, 2, '#c8a040'); PF(G, x - 39, y - 3, 78, 3, '#3a1e0c'); for (const fx of [-38, 34]) PF(G, x + fx, y - 3, 4, 3, '#c8a040');
    PF(G, x - 28, y - 33, 14, 5, '#f4ecd8'); PF(G, x - 26, y - 34, 12, 4, '#fff8e8'); PF(G, x - 24, y - 33, 6, 1, '#8a8a8a'); PF(G, x - 4, y - 31, 10, 2, '#2a1a10'); PF(G, x + 18, y - 40, 2, 9, '#c8a040'); PF(G, x + 14, y - 44, 10, 5, '#1a6a4a'); PF(G, x + 14, y - 40, 10, 1, '#c8a040');
    PE(G, x + 30, y - 32, 3, 2, '#c8a040'); PF(G, x + 6, y - 32, 2, 2, '#c81830'); PF(G, x + 9, y - 32, 2, 2, '#f4f4f4') } },
  // a brass bar cart with bottles
  f_barcart: { w: 3, s: [0, 0, 3, 1], d(G, x, y) { SHD(G, x, y, 22, 4); PF(G, x - 20, y - 18, 40, 3, '#3a1e0c'); PF(G, x - 20, y - 18, 40, 1, '#c8a040'); PF(G, x - 20, y - 7, 40, 3, '#3a1e0c'); for (const fx of [-20, 18]) PF(G, x + fx, y - 18, 2, 18, '#c8a040');
    for (let i = 0; i < 7; i++) { const c = ['#3a8a4a', '#8a4a1a', '#c8c8e8', '#6a1a2a', '#3a8a4a', '#d8a83a', '#2a6a8a'][i]; PF(G, x - 17 + i * 5, y - 27 + (i % 2) * 2, 3, 9 - (i % 2) * 2, c); PF(G, x - 16 + i * 5, y - 29 + (i % 2) * 2, 1, 2, c) } PE(G, x - 10, y - 5, 2, 2, '#1a1a1a'); PE(G, x + 10, y - 5, 2, 2, '#1a1a1a') } },
  // a coat stand
  f_coatrack: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 5, y - 2, 10, 2, '#3a1e0c'); PF(G, x - 1, y - 38, 2, 36, '#5a3418'); for (const s_ of [-1, 1]) { PF(G, x + s_ * 2 - (s_ < 0 ? 2 : 0), y - 36, 3, 1, '#c8a040'); PF(G, x + s_ * 5 - 1, y - 2, 2, 2, '#3a1e0c') } PF(G, x + 1, y - 35, 5, 12, '#5a5a6a'); PF(G, x + 2, y - 36, 3, 2, '#f4f4f4') } },
  // round table with a bottle
  f_rtable: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 9, 3); PF(G, x - 1, y - 12, 2, 12, '#5a3418'); PF(G, x - 4, y - 2, 8, 2, '#3a1e0c'); PE(G, x, y - 13, 10, 4, '#3a1e0c'); PE(G, x, y - 14, 9, 3, '#a8703c'); PF(G, x + 2, y - 21, 2, 6, '#3a8a4a'); PF(G, x - 4, y - 17, 3, 3, 'rgba(220,240,255,.8)') } },
  // warm light falling from the window across the floor
  f_shaft: { flat: 1, z: -300, d(G, x, y, P, s, p) { const h = (p.h || 6) * 16; for (let j = 0; j < h; j++) PF(G, x - 30 + j * .08, y - 16 + j, 60, 1, 'rgba(255,214,160,' + (.10 * (1 - j / h)).toFixed(3) + ')') } },
});
(() => {
  const W_ = 32, H_ = 26, Gd = Array.from({ length: H_ }, () => Array(W_).fill('.'));
  const fill = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W_ && j < H_) Gd[j][i] = c };
  fill(0, 0, W_, 5, '#'); fill(0, 0, 2, H_, '#'); fill(W_ - 2, 0, 2, H_, '#'); fill(0, 21, W_, 5, '#'); fill(14, 21, 4, 3, '.'); fill(4, 2, 2, 3, '.');   // shell + the way in
  fill(2, 13, 2, 3, '#'); fill(28, 13, 2, 3, '#');                                                                          // the room narrows at the waist, like a ship's cabin
  const R = ROOM({ id: 'n_vault', grid: Gd.map(r => r.join('')), leg: {},
    zones: [[2, 5, 28, 19, 'board', null]],
    feat: [
      ...[...Array(28).keys()].map(i => p('f_wz', 2 + i, 5, { t: 'wood', hh: 64 })), ...[2, 3, 28, 29].map(x => p('f_wz', x, 16, { t: 'wood', hh: 48 })),
      ...ps('f_wpillar', [[2, 5], [10, 5], [21, 5], [29, 5]]), p('f_skyline', 12, 5), ...ps('f_porthole', [[6, 5], [25, 5]]), ...ps('f_shipwheel', [[8, 5], [23, 5]]),
      p('f_wdoor', 4, 5), p('f_wdoor', 26, 5), ...ps('f_wlampb', [[3, 5, { h: 52 }], [8, 5, { h: 56 }], [23, 5, { h: 56 }], [28, 5, { h: 52 }]]),
      ...bigRug(4, 6, 4, 4, '#9a1834'), ...bigRug(24, 6, 4, 4, '#9a1834'), ...bigRug(9, 8, 14, 6, '#6a2a8a'), ...bigRug(14, 18, 4, 6, '#6a2a8a'),
      p('f_shaft', 16, 6, { h: 8 }), p('f_barcart', 19, 6), ...ps('flamp', [[9, 6], [22, 6]]), ...ps('f_bookcase', [[2, 6], [28, 6]]),
      p('f_bigdesk', 13, 10), p('f_coatrack', 21, 9),
      p('f_rtable', 5, 18), ...ps('f_stool', [[5, 17], [3, 18], [7, 18], [5, 19]]), p('f_pool', 24, 18), ...ps('f_stool', [[22, 20], [28, 20], [29, 17]]),
      ...ps('gplant', [[13, 20], [18, 20]]), ...ps('flamp', [[4, 12], [27, 12]]), p('f_bstack', 2, 20)],
    ents: [] });
  const V = AREAS.n_vault, keep = V.ents.filter(e => e.k == 'trigger' || e.kind == 'note');
  A('n_vault', { ...CASINO, nm: 'Casino Abyss: The House', w: R.w, h: R.h, feat: R.feat, exits: [ex('down', 15, 16, 'n_casino')],
    ents: [...keep, obj('desk', 15, 11, ['|The House\'s desk. Every drawer is locked. On top: a single betting slip, filled out in your handwriting.', 'Hitori:shock|...I never bet on anything.'], { inv: 1 }),
      obj('window', 15, 6, ['|The whole city, from up here. Every window is lit. Not one of them has anybody in it.'], { inv: 1 }),
      obj('cart', 19, 7, ['|Bottles with no labels. They all smell like the beach at night.'], { inv: 1 }), obj('pool', 25, 19, ['|Every ball is already in a pocket except the eight.'], { inv: 1 }),
      obj('wdoor', 4, 6, ['|Locked. A brass plate: "CREW ONLY".'], { inv: 1 }), obj('wdoor', 26, 6, ['|Locked. Someone on the other side is breathing very slowly.'], { inv: 1 })] });
})();
