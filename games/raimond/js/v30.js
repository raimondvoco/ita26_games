// ==================== v30: "now playing" — a little textbox with a spinning record, bottom right, whenever the song changes ====================
// Song names and artists live here. Edit this table to correct or fill in a credit; nothing else needs to change.
const MUSIC_INFO = {
  menu:      { t: 'Eternal Rest', a: 'Release', c: '#8a7ab0' },
  forest:    { t: 'green aero', a: 'neon', c: '#6fae5a' },
  dark:      { t: 'eight', a: 'Kentendo Entertainment System', c: '#7d6aa0' },
  beach:     { t: 'アイペース (Instrumental)', a: 'inabakumori', c: '#e3bf72' },
  scary:     { t: 'Morbid Curiosity', a: 'Avith Ortega', c: '#c03040' },
  inboredom: { t: '6EQUJ5', a: 'Inboredom', c: '#3a4a8a' },
  gallery:   { t: 'gallery walk', a: 'xemnaschrist', c: '#c45aa8' },
  memories:  { t: 'its ok we can make new memories', a: 'GAKHED', c: '#f0a050' },
  rukia:     { t: 'untitled (track 1)', a: 'rukiawaa', c: '#5a3a6a' },
  rukia2:    { t: 'untitled (track 2)', a: 'rukiawaa', c: '#3a2a4a' },
  s2:        { t: 's_2', a: 'svnti', c: '#e8e8e8' },
  decay:     { t: 'oh the places... (decay)', a: 'drezzdon', c: '#4a8ad8' },
  pier:      { t: 'the sea at the old pier', a: 'field recording', c: '#5a9ad0' },
};
const NP = { k: null, t: 0, shownAt: {}, pending: null };
const NP_IN = 14, NP_STAY = 260, NP_OUT = 16;
function nowPlayingCheck() {
  const k = musCur;
  if (k !== NP.last) { NP.last = k; if (MUSIC_INFO[k]) NP.pending = k }
  // show it once sound can actually play, never for the same song twice within half a minute, and not when music is off
  if (NP.pending && AC && opt.m > 0) { const k2 = NP.pending; NP.pending = null; if (!(NP.shownAt[k2] && tick - NP.shownAt[k2] < 1800)) { NP.k = k2; NP.t = 0; NP.shownAt[k2] = tick } }
}
// a 21x21 record drawn pixel by pixel: grooves, a coloured label with a stripe, and a glint that goes round
function npDisc(cx, cy, col, ang) {
  const R = 10;
  for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
    const d = Math.hypot(x, y); if (d > R + .3) continue;
    let c;
    if (d > R - .7) c = '#000';
    else if (d < 1.2) c = '#000';
    else if (d < 4.2) { const a = Math.atan2(y, x) - ang; c = Math.cos(a) > .82 ? '#fff' : d > 3.4 ? sh(col, .7) : col }
    else { const groove = (Math.round(d) % 2) ? '#18161e' : '#242230', a = (Math.atan2(y, x) - ang * .5 + 6.283 * 4) % 3.1416; c = a > .35 && a < .75 ? '#4a4858' : groove }
    r(cx + x, cy + y, 1, 1, c);
  }
}
function drawNowPlaying() {
  if (String(sc).startsWith('p2')) { NP.k = null; NP.last = musCur; return }
  nowPlayingCheck(); if (!NP.k) return;
  const T = NP.t++, total = NP_IN + NP_STAY + NP_OUT; if (T > total) { NP.k = null; return }
  const info = MUSIC_INFO[NP.k], BW = 128, BH = 30;
  const slide = T < NP_IN ? 1 - ease(T / NP_IN) : T > NP_IN + NP_STAY ? (T - NP_IN - NP_STAY) / NP_OUT : 0;
  // bottom right, unless a dialogue box or the battle cards are in the way: then top right
  const top = !!DL || sc == 'battle' || sc == 'slots' || (sc == 'menu' && !(MN && MN.over));
  const bx = Math.round(W - BW - 6 + slide * (BW + 12)), by = top ? 6 : H - BH - 6;
  sU();
  r(bx - 1, by - 1, BW + 2, BH + 2, '#000'); r(bx, by, BW, BH, '#fff'); r(bx + 1, by + 1, BW - 2, BH - 2, '#000');
  npDisc(bx + 15, by + 15, info.c, tick / 9);
  // a tone arm resting on the record
  r(bx + 27, by + 4, 1, 1, '#9a9aa8'); for (let i = 0; i < 6; i++) r(bx + 26 - i * .6, by + 5 + i, 1, 1, '#c8c8d0'); r(bx + 22, by + 11, 2, 2, '#e8e8f0');
  // NOW PLAYING with little bouncing bars
  const tx = bx + 31; txt('NOW PLAYING', tx + 9, by + 3, '#8a8a98', 'left', 5);
  for (let i = 0; i < 3; i++) { const h = 1 + Math.round((Math.sin(tick / 5 + i * 1.7) + 1) * 1.6); r(tx + 1 + i * 2.2, by + 8 - h, 1.4, h, info.c) }
  const fit = (s, w, sz) => { if (tw(s, sz) <= w) return s; while (s.length > 1 && tw(s + '…', sz) > w) s = s.slice(0, -1); return s + '…' };
  txt(fit(info.t, BW - 36, 7), tx, by + 10, '#fff', 'left', 7);
  txt(fit(info.a, BW - 36, 6), tx, by + 20, '#b8b8c8', 'left', 6);
}
