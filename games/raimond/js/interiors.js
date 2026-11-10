// ==================== INTERIORS ====================
// Every house and shop has its own walls, floor and furniture. Wall decorations are anchored on row 2 and drawn up into
// the wall face; floor furniture draws upward from its anchor tile so the top part lands on the top layer.
const WY = y => y - 16;   // wall base for wall-mounted props anchored on row 2
const OUT = '#2a1a10';
// ---- palettes
PAL.uku = { ...PAL.house, wall: '#d8c8a4', wall2: '#8a6440', wtop: '#2a1c14', path: '#5a7a9a', path2: '#4a6a8a', pe: '#2a3a4a' };
PAL.mochi = { ...PAL.house, a: ['#b08458', '#a87c50', '#b88c60'], wall: '#f0d4bc', wall2: '#e4c0a4', wtop: '#3a2418' };
PAL.cabin = { ...PAL.house, a: ['#8a6440', '#84603c', '#906a44'], wall: '#8a5a32', wtop: '#1e140c' };
PAL.cafe = { ...PAL.hotel, plaza: '#fbf6ee', pl2: '#9adcd0', wall: '#f8dce4', wall2: '#8ad0c4', wtop: '#4a2a34' };
PAL.lobby = { ...PAL.hotel, wall: '#efe4cc', wall2: '#2a6a74', wtop: '#2a1a14', carpet: '#8a1a2a' };
PAL.hut = { ...PAL.house, wall: '#c8a860', wall2: '#a8884a', wtop: '#3a2a14' };
PAL.ramen = { ...PAL.cyberin, a: ['#6a3e26', '#643a22', '#70422a'], wall: '#4a1e14', wtop: '#120604' };
PAL.capsule = { ...PAL.cyberin, wall: '#1a2a5e', wall2: '#14204a' };
PAL.arcadein = { ...PAL.cyberin, wall: '#13235a' };

Object.assign(PROPS, {
  // ---------------- kitchens
  f_counter: { w: 3, s: S3, d(G, x, y) {   // kitchen counter with a sink and tiles behind it
    PF(G, x - 24, y - 36, 48, 16, '#e8ecf0'); for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { PF(G, x - 24 + i * 8, y - 36 + j * 8, 8, 1, '#c8d0d8'); PF(G, x - 24 + i * 8, y - 36 + j * 8, 1, 8, '#c8d0d8') }
    SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 20, 48, 20, OUT); PF(G, x - 23, y - 15, 46, 14, '#c8b898'); PF(G, x - 24, y - 21, 48, 6, '#f4f0e8'); PF(G, x - 24, y - 21, 48, 1, '#fff');
    for (let i = 0; i < 3; i++) { PF(G, x - 21 + i * 15, y - 13, 13, 11, '#d8c8a8'); PF(G, x - 16 + i * 15, y - 9, 3, 1, '#7a6a5a') }
    PF(G, x - 4, y - 20, 14, 4, '#9aa8b4'); PF(G, x - 3, y - 19, 12, 2, '#6a7884'); PF(G, x + 2, y - 27, 2, 7, '#a8b0b8'); PF(G, x + 2, y - 27, 5, 2, '#a8b0b8');
    PF(G, x - 20, y - 27, 5, 6, '#e85a3a'); PF(G, x - 13, y - 25, 6, 4, '#5ab0e8'); PF(G, x + 14, y - 26, 3, 5, '#f4f4f4'); PF(G, x + 18, y - 28, 3, 7, '#c8a040');
  } },
  f_stove: { s: S1, d(G, x, y) {
    PF(G, x - 8, y - 36, 16, 10, '#c8ccd0'); PF(G, x - 7, y - 35, 14, 2, '#e8ecf0'); SHD(G, x + 1, y, 8, 3); PF(G, x - 8, y - 22, 16, 22, OUT); PF(G, x - 7, y - 21, 14, 20, '#f0f0ec'); PF(G, x - 7, y - 21, 14, 5, '#3a3a40');
    PE(G, x - 3, y - 19, 2.5, 1.5, '#1a1a1e'); PE(G, x + 3, y - 19, 2.5, 1.5, '#1a1a1e'); PF(G, x - 5, y - 13, 10, 8, '#2a2a30'); PF(G, x - 4, y - 12, 8, 2, '#5a5a64'); PE(G, x - 3, y - 22, 4, 2, '#7a7a84'); PF(G, x - 7, y - 25, 8, 3, '#8a8a94');
  } },
  f_fridge: { s: S1, d(G, x, y, P, s, p) {
    SHD(G, x + 1, y, 9, 3); PF(G, x - 8, y - 38, 16, 38, OUT); PF(G, x - 7, y - 37, 14, 36, p.c || '#e8f0f0'); PF(G, x - 7, y - 24, 14, 1, '#9aa8a8'); PF(G, x - 7, y - 37, 2, 36, '#fff'); PF(G, x + 4, y - 33, 1, 6, '#9aa8a8'); PF(G, x + 4, y - 20, 1, 8, '#9aa8a8');
    PF(G, x - 4, y - 32, 5, 5, '#ffe27a'); PF(G, x - 2, y - 20, 4, 4, '#ff9ab0'); PF(G, x - 5, y - 15, 3, 3, '#7ad0ff');
  } },
  f_dtable: { w: 2, s: S2, d(G, x, y, P, s, p) {   // little dining table with two chairs and a cloth
    const cl = p.c || '#e8a0a8'; SHD(G, x + 2, y, 16, 3);
    for (const d of [-1, 1]) { PF(G, x + d * 15 - 3, y - 18, 6, 14, '#6a4a2a'); PF(G, x + d * 15 - 3, y - 9, 6, 3, '#8a6a44'); PF(G, x + d * 15 - 3, y - 4, 1, 4, '#4a321c'); PF(G, x + d * 15 + 2, y - 4, 1, 4, '#4a321c') }
    PF(G, x - 10, y - 6, 2, 6, '#4a321c'); PF(G, x + 8, y - 6, 2, 6, '#4a321c'); PF(G, x - 12, y - 16, 24, 10, cl); PF(G, x - 12, y - 16, 24, 2, sh(cl, 1.15)); for (let i = 0; i < 6; i++) PF(G, x - 12 + i * 4, y - 7, 2, 1, '#fff');
    PE(G, x - 4, y - 12, 3, 2, '#fff'); PE(G, x + 5, y - 13, 2, 2.5, '#f4f4f4'); PF(G, x + 4, y - 16, 2, 3, '#c83a3a');
  } },
  // ---------------- living rooms
  f_tvset: { w: 2, s: S2, d(G, x, y) {   // fat CRT on a low cabinet, a game console and tapes
    SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 12, 30, 12, OUT); PF(G, x - 14, y - 11, 28, 10, '#7a5232'); PF(G, x - 13, y - 9, 12, 7, '#5a3a22'); PF(G, x + 1, y - 9, 12, 7, '#5a3a22');
    PF(G, x - 10, y - 30, 20, 18, OUT); PF(G, x - 9, y - 29, 18, 16, '#4a4a54'); PF(G, x - 7, y - 27, 12, 11, '#1a2a30'); for (let i = 0; i < 3; i++) PF(G, x - 6, y - 25 + i * 3, 9, 1, 'rgba(160,220,230,.35)'); PF(G, x + 6, y - 26, 2, 2, '#c84a4a'); PF(G, x + 6, y - 22, 2, 1, '#888');
    PF(G, x - 4, y - 33, 1, 4, '#888'); PF(G, x + 3, y - 34, 1, 5, '#888'); PF(G, x - 12, y - 9, 8, 3, '#2a2a30'); PF(G, x + 4, y - 8, 2, 4, '#c03a3a'); PF(G, x + 7, y - 8, 2, 4, '#3a6ac8'); PF(G, x + 10, y - 8, 2, 4, '#e8c030');
  } },
  f_couch: { w: 3, s: S3, d(G, x, y, P, s, p) {   // couch seen from behind (facing the TV), a blanket thrown over it
    const c = p.c || '#5a7a9a'; SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 20, 48, 20, OUT); PF(G, x - 23, y - 19, 46, 18, c); PF(G, x - 23, y - 19, 46, 3, sh(c, 1.25)); PF(G, x - 23, y - 8, 46, 2, sh(c, .75));
    PF(G, x - 24, y - 22, 7, 22, sh(c, .8)); PF(G, x + 17, y - 22, 7, 22, sh(c, .8)); PF(G, x - 24, y - 22, 7, 2, sh(c, 1.1)); PF(G, x + 17, y - 22, 7, 2, sh(c, 1.1));
    PF(G, x - 4, y - 20, 14, 14, '#e8c060'); for (let i = 0; i < 3; i++) PF(G, x - 4, y - 18 + i * 4, 14, 1, '#c83a3a'); PF(G, x - 10, y - 24, 8, 6, '#f4ecd8');
  } },
  f_tapes: { w: 2, s: S2, d(G, x, y) {   // tall shelf of mixtapes and records
    SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 38, 28, 38, OUT); PF(G, x - 13, y - 37, 26, 36, '#7a5232');
    for (let j = 0; j < 4; j++) { PF(G, x - 12, y - 35 + j * 9, 24, 7, '#4a2c18'); for (let i = 0; i < 8; i++) if (!(j == 2 && i == 5)) PF(G, x - 11 + i * 3, y - 34 + j * 9, 2, 6, ['#e8e0d0', '#3a3a40', '#c83a3a', '#3a6ac8', '#e8c030'][(i * 3 + j * 7) % 5]) }
  } },
  f_bposter: { flat: 1, d(G, x, y, P, s, p) {   // band poster
    const wy = WY(y), c = p.c || (s < .5 ? '#c83a5a' : '#2a2a3a'); PF(G, x - 7, wy - 26, 14, 20, '#111'); PF(G, x - 6, wy - 25, 12, 18, c); PF(G, x - 4, wy - 22, 8, 1, '#fff'); PF(G, x - 4, wy - 20, 6, 1, '#fff');
    PE(G, x, wy - 13, 3, 3, s < .5 ? '#ffd23c' : '#e8e0d0'); PF(G, x - 1, wy - 27, 2, 2, '#c0c0c0'); if (p.t) PF(G, x - 5, wy - 9, 10, 1, '#fff');
  } },
  f_guitar: { s: S1, d(G, x, y) {   // electric guitar on a stand
    SHD(G, x + 1, y, 6, 2); PF(G, x - 5, y - 3, 10, 2, '#2a2a30'); PF(G, x - 1, y - 12, 2, 10, '#2a2a30');
    PF(G, x - 1, y - 38, 2, 22, '#7a5232'); PF(G, x - 2, y - 41, 4, 4, '#2a2a30'); PE(G, x, y - 13, 6, 5, OUT); PE(G, x, y - 13, 5.2, 4.2, '#c83a3a'); PE(G, x - 1, y - 18, 4, 3, OUT); PE(G, x - 1, y - 18, 3.2, 2.4, '#c83a3a'); PF(G, x - 3, y - 14, 6, 2, '#f4f4f4'); PF(G, x - 2, y - 11, 4, 1, '#2a2a30');
  } },
  f_desk2: { w: 2, s: S2, d(G, x, y) {   // writing desk: lamp, a framed photo, homework
    SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 16, 30, 16, OUT); PF(G, x - 14, y - 15, 28, 4, '#8a6a44'); PF(G, x - 14, y - 11, 6, 10, '#6a4a2a'); PF(G, x + 8, y - 11, 6, 10, '#6a4a2a'); PF(G, x - 13, y - 9, 4, 1, '#c8a040');
    PF(G, x - 10, y - 26, 2, 10, '#3a3a40'); PF(G, x - 13, y - 30, 8, 5, '#e8c030'); PE(G, x - 9, y - 22, 9, 6, 'rgba(255,230,150,.15)'); PF(G, x - 2, y - 18, 8, 3, '#f4f4f4'); PF(G, x - 1, y - 18, 6, 1, '#9ab0d0');
    PF(G, x + 7, y - 24, 7, 8, '#7a5a20'); PF(G, x + 8, y - 23, 5, 6, '#9ac8a0'); PE(G, x + 10, y - 20, 1, 1, '#f0d0b0');
  } },
  f_nstand: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 13, 12, 13, OUT); PF(G, x - 5, y - 12, 10, 11, '#8a6a44'); PF(G, x - 4, y - 8, 8, 1, '#5a3a22'); PF(G, x - 1, y - 6, 2, 1, '#e8c030'); PF(G, x - 3, y - 19, 6, 6, '#3a3a40'); PF(G, x - 2, y - 18, 4, 2, '#ff4a4a'); PF(G, x - 2, y - 15, 4, 1, '#ff4a4a') } },
  f_wclock2: { flat: 1, d(G, x, y) { const wy = WY(y); PE(G, x, wy - 18, 7, 7, OUT); PE(G, x, wy - 18, 6, 6, '#f4ecd8'); PF(G, x, wy - 23, 1, 5, '#222'); PF(G, x, wy - 18, 4, 1, '#222') } },
  f_shelfw: { flat: 1, w: 2, d(G, x, y, P, s) {   // wall shelf with jars, plants or trophies
    const wy = WY(y); PF(G, x - 14, wy - 12, 28, 3, '#6a4a2a'); PF(G, x - 14, wy - 12, 28, 1, '#8a6a44');
    for (let i = 0; i < 4; i++) { const k = (s * 10 + i * 3) % 4 | 0, cx = x - 10 + i * 7; if (k == 0) { PF(G, cx - 2, wy - 19, 5, 7, '#c8e0e8'); PF(G, cx - 2, wy - 16, 5, 4, '#e8a040') } else if (k == 1) { PF(G, cx - 2, wy - 16, 5, 4, '#a85a3a'); PE(G, cx, wy - 19, 3, 3, '#5ab86a') } else if (k == 2) { PF(G, cx - 2, wy - 20, 2, 8, '#c83a3a'); PF(G, cx, wy - 19, 2, 7, '#3a6ac8') } else { PF(G, cx - 1, wy - 18, 3, 6, '#e8c030'); PF(G, cx - 2, wy - 20, 5, 2, '#e8c030') } }
  } },
  // ---------------- Mochi's cottage
  f_armchair: { w: 2, s: S2, d(G, x, y, P, s, p) { const c = p.c || '#c86a4a'; SHD(G, x + 2, y, 14, 3); PF(G, x - 12, y - 26, 24, 26, OUT); PF(G, x - 11, y - 25, 22, 14, c); PF(G, x - 11, y - 25, 22, 2, sh(c, 1.25)); PF(G, x - 13, y - 16, 6, 15, sh(c, .8)); PF(G, x + 7, y - 16, 6, 15, sh(c, .8)); PF(G, x - 7, y - 11, 14, 8, sh(c, 1.1)); PF(G, x - 7, y - 4, 2, 4, OUT); PF(G, x + 5, y - 4, 2, 4, OUT); PF(G, x - 5, y - 21, 10, 6, '#f4ecd8') } },
  f_cattree: { s: S1, d(G, x, y) {   // carpeted scratching tower with a dangling toy
    SHD(G, x + 2, y, 9, 3); PF(G, x - 8, y - 4, 16, 4, '#9a8070'); PF(G, x - 2, y - 30, 4, 26, '#d8c0a0'); for (let i = 0; i < 7; i++) PF(G, x - 2, y - 28 + i * 4, 4, 1, '#a88868');
    PF(G, x - 9, y - 18, 12, 4, '#9a8070'); PF(G, x - 4, y - 34, 14, 5, '#9a8070'); PF(G, x - 4, y - 34, 14, 1, '#b89c8c'); PF(G, x + 7, y - 30, 1, 8, '#e8e0d0'); PE(G, x + 7, y - 21, 2, 2, '#ff5a8a');
  } },
  f_catbed: { flat: 1, d(G, x, y, P, s, p) { PE(G, x, y - 6, 10, 6, OUT); PE(G, x, y - 6, 9, 5, p.c || '#7a8ac8'); PE(G, x, y - 5, 6, 3, '#f4ecd8'); PF(G, x - 2, y - 7, 1, 1, '#c8b8a8') } },
  f_yarn: { flat: 1, d(G, x, y) { PE(G, x - 3, y - 5, 4, 4, '#e85a7a'); PF(G, x - 5, y - 6, 4, 1, '#c83a5a'); PF(G, x - 4, y - 4, 4, 1, '#c83a5a'); PE(G, x + 5, y - 4, 3, 3, '#5ab0e8'); PF(G, x + 1, y - 3, 6, 1, '#e85a7a'); PF(G, x - 8, y - 1, 7, 1, '#e85a7a') } },
  f_bookcase: { w: 2, s: S2, d(G, x, y, P, s) { SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 40, 28, 40, OUT); PF(G, x - 13, y - 39, 26, 38, '#6a4a2a'); for (let j = 0; j < 4; j++) { PF(G, x - 12, y - 37 + j * 9, 24, 7, '#3a2414'); let bx = x - 11; while (bx < x + 10) { const k = hsh(bx, j, s * 9 + 3), bw = 2 + (k * 2 | 0), bh = 5 + (k * 2 | 0); PF(G, bx, y - 30 + j * 9 - bh, bw, bh, ['#c83a3a', '#3a6ac8', '#e8c030', '#5ab86a', '#e8e0d0', '#8a4ab8'][(k * 6) | 0]); bx += bw + (k < .2 ? 2 : 0) } } } },
  f_fishbowl: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 6, y - 12, 12, 12, OUT); PF(G, x - 5, y - 11, 10, 11, '#8a6a44'); PE(G, x, y - 18, 6, 5, '#9ad8f0'); PF(G, x - 3, y - 22, 6, 1, '#c8e8f8'); PF(G, x, y - 18, 3, 2, '#ff8a2a'); PF(G, x - 1, y - 17, 1, 1, '#ff8a2a') } },
  f_rrug: { flat: 1, d(G, x, y, P, s, p) { const c = p.c || '#c86a8a'; PE(G, x, y - 8, 22, 11, sh(c, .7)); PE(G, x, y - 8, 20, 10, c); PE(G, x, y - 8, 14, 7, sh(c, 1.2)); PE(G, x, y - 8, 7, 3.5, c) } },
  f_teatable: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 9, 3); PF(G, x - 1, y - 10, 2, 10, OUT); PF(G, x - 5, y - 2, 10, 2, OUT); PE(G, x, y - 12, 9, 4, OUT); PE(G, x, y - 12, 8, 3.2, '#8a6a44'); PE(G, x - 2, y - 15, 3.5, 3, '#f4f4f4'); PF(G, x + 1, y - 16, 3, 1, '#f4f4f4'); PF(G, x + 3, y - 15, 2, 2, '#e8e0f0') } },
  // ---------------- the lookout cabin
  f_bunk: { w: 2, s: [0, -1, 2, 2], d(G, x, y, P, s, p) {   // wooden bunk bed, two quilts
    const q1 = p.c || '#3a6ac8', q2 = p.c2 || '#c83a3a'; SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 44, 3, 44, '#4a2c18'); PF(G, x + 12, y - 44, 3, 44, '#4a2c18');
    for (const [by, q] of [[0, q1], [-20, q2]]) { PF(G, x - 12, y - 14 + by, 24, 10, OUT); PF(G, x - 12, y - 14 + by, 24, 3, '#f4ecd8'); PF(G, x - 4, y - 13 + by, 16, 8, q); PF(G, x - 4, y - 13 + by, 16, 1, sh(q, 1.3)); PF(G, x - 11, y - 13 + by, 6, 4, '#ffffff'); PF(G, x - 12, y - 5 + by, 24, 2, '#6a4a2a') }
    PF(G, x + 12, y - 40, 3, 30, '#6a4a2a'); for (let i = 0; i < 5; i++) PF(G, x + 11, y - 38 + i * 6, 5, 1, '#8a6a44');
  } },
  f_map: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); PF(G, x - 13, wy - 27, 26, 20, '#5a3a22'); PF(G, x - 12, wy - 26, 24, 18, '#e8d8a8'); PE(G, x - 4, wy - 18, 6, 4, '#9ac870'); PE(G, x + 5, wy - 14, 4, 3, '#9ac870'); PF(G, x - 12, wy - 26, 24, 3, '#9ac8e0'); PF(G, x + 2, wy - 20, 1, 1, '#c83a3a'); PF(G, x + 3, wy - 21, 1, 3, '#c83a3a'); for (let i = 0; i < 5; i++) PF(G, x - 8 + i * 3, wy - 12 + (i % 2), 2, 1, '#8a4a2a') } },
  f_rod: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); for (let i = 0; i < 26; i++) PF(G, x - 13 + i, wy - 26 + i * .5, 1, 1, '#7a5232'); PE(G, x - 9, wy - 23, 3, 3, '#3a3a40'); PF(G, x + 12, wy - 13, 1, 6, '#e8e0d0'); PF(G, x + 11, wy - 7, 3, 2, '#c83a3a') } },
  f_coatrack: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 5, y - 2, 10, 2, '#4a2c18'); PF(G, x - 1, y - 38, 2, 36, '#5a3a22'); PF(G, x - 6, y - 36, 12, 2, '#5a3a22'); PF(G, x - 8, y - 34, 6, 16, '#e8c030'); PF(G, x - 8, y - 34, 6, 3, '#c8a020'); PF(G, x + 2, y - 34, 6, 12, '#3a5a8a'); PE(G, x + 3, y - 40, 5, 2, '#c83a3a') } },
  f_hlantern: { top: 1, d(G, x, y) { PF(G, x, y - 44, 1, 14, '#3a3a40'); PF(G, x - 4, y - 30, 9, 2, '#3a3a40'); PF(G, x - 3, y - 28, 7, 8, '#ffd27a'); PF(G, x - 4, y - 20, 9, 2, '#3a3a40'); PE(G, x, y - 24, 20, 14, 'rgba(255,210,130,.12)') } },
  f_potbelly: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 3); PF(G, x - 2, y - 44, 4, 22, '#2a2a30'); PE(G, x, y - 12, 8, 10, '#1a1a1e'); PE(G, x - 2, y - 14, 3, 5, '#3a3a40'); PF(G, x - 4, y - 12, 8, 5, '#e8541a'); PF(G, x - 3, y - 11, 6, 2, '#ffb03a'); PF(G, x - 6, y - 2, 3, 2, '#1a1a1e'); PF(G, x + 3, y - 2, 3, 2, '#1a1a1e'); PE(G, x, y - 10, 16, 10, 'rgba(255,150,60,.1)') } },
  f_ltable: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 15, 3); PF(G, x - 13, y - 6, 2, 6, '#3a2414'); PF(G, x + 11, y - 6, 2, 6, '#3a2414'); PF(G, x - 14, y - 15, 28, 9, '#7a5232'); PF(G, x - 14, y - 15, 28, 2, '#9a7248'); PF(G, x - 8, y - 18, 10, 5, '#3a5a3a'); PF(G, x - 8, y - 18, 10, 1, '#5a7a5a'); PF(G, x + 4, y - 21, 3, 7, '#c8e0e8'); PF(G, x + 8, y - 18, 3, 4, '#e8e0d0') } },
  // ---------------- the café
  f_cakecase: { w: 3, s: S3, d(G, x, y) {   // glass display counter full of cakes
    SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 22, 48, 22, OUT); PF(G, x - 23, y - 10, 46, 9, '#8ad0c4'); PF(G, x - 23, y - 10, 46, 1, '#aae8dc');
    PF(G, x - 23, y - 21, 46, 11, 'rgba(220,240,255,.85)'); PF(G, x - 23, y - 21, 46, 1, '#fff'); PF(G, x - 23, y - 15, 46, 1, '#c8d8e0');
    [['#f8c8d8', '#ff5a8a'], ['#6a3a20', '#f4ecd8'], ['#ffe8a0', '#e8541a'], ['#c8e8a0', '#fff'], ['#f8c8d8', '#c83a5a']].forEach(([a, b], i) => { PF(G, x - 21 + i * 9, y - 20, 7, 4, a); PF(G, x - 21 + i * 9, y - 21, 7, 1, b); PF(G, x - 19 + i * 9, y - 14, 4, 3, b) });
  } },
  f_register: { w: 2, s: S2, d(G, x, y) {   // counter with till, tip jar and a bell
    SHD(G, x + 2, y, 16, 3); PF(G, x - 16, y - 20, 32, 20, OUT); PF(G, x - 15, y - 14, 30, 13, '#8ad0c4'); PF(G, x - 16, y - 20, 32, 6, '#f8f4ec'); PF(G, x - 16, y - 20, 32, 1, '#fff'); for (let i = 0; i < 4; i++) PF(G, x - 13 + i * 8, y - 12, 1, 10, '#6ab0a4');
    PF(G, x - 12, y - 28, 12, 8, '#3a3a40'); PF(G, x - 11, y - 27, 10, 3, '#9ae8a0'); PF(G, x + 3, y - 26, 5, 6, 'rgba(220,240,255,.8)'); PF(G, x + 4, y - 23, 3, 2, '#3a9a3a'); PE(G, x + 11, y - 22, 3, 2, '#e8c030'); PF(G, x + 10, y - 25, 2, 2, '#e8c030');
  } },
  f_espresso: { w: 2, flat: 1, d(G, x, y) {   // back counter on the wall: espresso machine, cups, syrups
    const wy = WY(y); PF(G, x - 16, wy - 2, 32, 6, '#8ad0c4'); PF(G, x - 16, wy - 2, 32, 1, '#aae8dc'); PF(G, x - 14, wy - 18, 12, 16, '#c8ccd0'); PF(G, x - 14, wy - 18, 12, 2, '#e8ecf0'); PF(G, x - 12, wy - 12, 8, 3, '#2a2a30'); PF(G, x - 10, wy - 8, 3, 4, '#f4f4f4'); PE(G, x - 8, wy - 21, 2, 3, 'rgba(255,255,255,.5)');
    for (let i = 0; i < 3; i++) PF(G, x + 1 + i * 4, wy - 10, 3, 8, ['#c83a3a', '#e8c030', '#5ab86a'][i]); PF(G, x + 1, wy - 12, 13, 2, '#fff'); for (let i = 0; i < 3; i++) PF(G, x + 1 + i * 4, wy - 17, 3, 3, '#f4f4f4');
  } },
  f_menuboard: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); PF(G, x - 14, wy - 30, 28, 20, '#8a6a44'); PF(G, x - 13, wy - 29, 26, 18, '#2a3a34'); for (let i = 0; i < 4; i++) { PF(G, x - 11, wy - 26 + i * 4, 12 - (i % 2) * 3, 1, '#e8f0e0'); PF(G, x + 6, wy - 26 + i * 4, 4, 1, '#ffd23c') } PE(G, x + 9, wy - 14, 2, 1.5, '#ff9ab8') } },
  f_rtable: { w: 2, s: [0, 0, 2, 1], d(G, x, y, P, s, p) {   // round café table and two chairs
    const c = p.c || '#f8f4ec'; SHD(G, x + 2, y, 16, 3);
    for (const d of [-1, 1]) { PF(G, x + d * 13 - 3, y - 16, 6, 10, '#e8a0b0'); PF(G, x + d * 13 - 3, y - 8, 6, 2, '#c87a90'); PF(G, x + d * 13 - 3, y - 6, 1, 6, '#5a3a3a'); PF(G, x + d * 13 + 2, y - 6, 1, 6, '#5a3a3a') }
    PF(G, x - 1, y - 8, 2, 8, '#5a3a3a'); PF(G, x - 4, y - 1, 8, 1, '#5a3a3a'); PE(G, x, y - 10, 9, 4, OUT); PE(G, x, y - 11, 8, 3.2, c); PE(G, x - 3, y - 12, 2, 1.5, '#fff'); PF(G, x + 2, y - 14, 3, 3, '#f4f4f4'); PF(G, x + 3, y - 14, 1, 1, '#8a5a3a');
  } },
  f_shellwall: { flat: 1, d(G, x, y) { const wy = WY(y); PE(G, x, wy - 18, 7, 6, '#f8d8c8'); for (let i = -3; i <= 3; i++) PF(G, x + i * 2, wy - 22 + Math.abs(i), 1, 8 - Math.abs(i), '#e8a8a0'); PF(G, x - 2, wy - 13, 4, 2, '#f8d8c8'); PE(G, x + 10, wy - 10, 3, 3, '#ffb070'); PF(G, x + 10, wy - 14, 1, 8, '#ffb070'); PF(G, x + 6, wy - 10, 8, 1, '#ffb070') } },
  f_cakestand: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 1, y - 14, 2, 14, '#c8c0b8'); PE(G, x, y - 14, 7, 2, '#f4f4f4'); PF(G, x - 5, y - 20, 10, 6, '#f8c8d8'); PF(G, x - 5, y - 21, 10, 2, '#fff'); PF(G, x - 1, y - 24, 2, 3, '#c83a3a') } },
  // ---------------- the hotel lobby
  f_rdesk: { w: 5, s: [0, 0, 5, 1], d(G, x, y, P, s, p) {   // long reception desk with brass trim
    SHD(G, x + 2, y, 40, 4); PF(G, x - 40, y - 22, 80, 22, OUT); PF(G, x - 39, y - 15, 78, 14, '#2a6a74'); PF(G, x - 40, y - 22, 80, 7, '#efe8dc'); PF(G, x - 40, y - 22, 80, 1, '#fff'); PF(G, x - 40, y - 15, 80, 2, '#c8a040');
    for (let i = 0; i < 5; i++) { PF(G, x - 36 + i * 16, y - 12, 12, 9, '#245c66'); PF(G, x - 36 + i * 16, y - 12, 12, 1, '#3a8a94') }
    if (!p.lf) { PE(G, x - 20, y - 23, 3, 2, '#e8c030'); PF(G, x - 21, y - 26, 2, 2, '#e8c030'); PF(G, x + 2, y - 26, 10, 4, '#f4f4f4'); PF(G, x + 2, y - 26, 10, 1, '#c83a3a'); PF(G, x + 14, y - 30, 1, 8, '#3a3a40'); PF(G, x + 14, y - 30, 4, 1, '#3a3a40'); PE(G, x + 26, y - 27, 4, 4, '#5ab86a'); PF(G, x + 24, y - 24, 4, 3, '#a85a3a') }
    else { PF(G, x - 34, y - 32, 12, 10, '#a87a4a'); PF(G, x - 34, y - 32, 12, 2, '#c89a6a'); PF(G, x - 18, y - 28, 8, 6, '#c83a5a'); PE(G, x - 4, y - 25, 4, 3, '#f8f8f8'); PF(G, x + 6, y - 30, 4, 8, '#3a6ac8'); PF(G, x + 14, y - 27, 10, 5, '#e8c030'); PF(G, x + 28, y - 26, 6, 4, '#7ad0ff') }
  } },
  f_keyrack: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); PF(G, x - 14, wy - 28, 28, 18, '#5a3a22'); PF(G, x - 13, wy - 27, 26, 16, '#7a5232'); for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) { PF(G, x - 11 + i * 4, wy - 25 + j * 8, 1, 2, '#c8a040'); if ((i + j * 2) % 5) { PF(G, x - 12 + i * 4, wy - 23 + j * 8, 3, 3, '#e8c030'); PF(G, x - 11 + i * 4, wy - 20 + j * 8, 1, 2, '#c8a040') } } } },
  f_lfsign: { flat: 1, w: 3, d(G, x, y) { const wy = WY(y); PF(G, x - 22, wy - 26, 44, 12, '#5a3a22'); PF(G, x - 21, wy - 25, 42, 10, '#2a6a74'); PF(G, x - 21, wy - 25, 42, 1, '#c8a040'); for (let i = 0; i < 9; i++) PF(G, x - 18 + i * 4 + (i > 3 ? 4 : 0), wy - 22, 3, 4, '#e8c040') } },
  f_column: { s: S1, d(G, x, y) { SHD(G, x + 2, y, 11, 3); PF(G, x - 10, y - 7, 20, 7, '#c8c0b0'); PF(G, x - 10, y - 7, 20, 1, '#fff'); PF(G, x - 7, y - 58, 14, 51, '#f0ece4'); PF(G, x - 7, y - 58, 3, 51, '#ffffff'); PF(G, x + 3, y - 58, 4, 51, '#d8d0c4'); PF(G, x - 1, y - 58, 1, 51, '#e0d8cc'); PF(G, x - 10, y - 64, 20, 7, '#c8c0b0'); PF(G, x - 10, y - 64, 20, 2, '#e8c040') } },
  f_chand: { top: 1, d(G, x, y) { PF(G, x, y - 80, 1, 20, '#c8a040'); PF(G, x - 12, y - 60, 25, 3, '#c8a040'); for (let i = 0; i < 5; i++) { const cx = x - 12 + i * 6; PF(G, cx, y - 57, 1, 6, '#c8a040'); PF(G, cx - 1, y - 51, 3, 3, '#fff8d0'); PF(G, cx, y - 55, 1, 2, '#ffe080') } PE(G, x, y - 54, 20, 10, 'rgba(255,240,180,.14)') } },
  f_lsofa: { w: 3, s: S3, d(G, x, y, P, s, p) { const c = p.c || '#2a6a74'; SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 24, 48, 24, OUT); PF(G, x - 23, y - 23, 46, 10, c); PF(G, x - 23, y - 23, 46, 2, sh(c, 1.3)); PF(G, x - 23, y - 13, 46, 9, sh(c, 1.15)); PF(G, x - 1, y - 13, 2, 9, sh(c, .8)); PF(G, x - 24, y - 18, 6, 17, sh(c, .8)); PF(G, x + 18, y - 18, 6, 17, sh(c, .8)); PF(G, x - 22, y - 4, 2, 4, '#c8a040'); PF(G, x + 20, y - 4, 2, 4, '#c8a040'); PF(G, x - 16, y - 20, 7, 6, '#e8c060'); PF(G, x + 9, y - 20, 7, 6, '#e8c060') } },
  f_ctable: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 14, 3); PF(G, x - 12, y - 8, 24, 8, OUT); PF(G, x - 11, y - 8, 22, 4, '#efe8dc'); PF(G, x - 11, y - 4, 2, 4, '#c8a040'); PF(G, x + 9, y - 4, 2, 4, '#c8a040'); PF(G, x - 6, y - 11, 8, 3, '#3a6ac8'); PF(G, x + 4, y - 13, 3, 5, '#c8e0e8'); PE(G, x + 5, y - 14, 3, 2, '#ff9ab8') } },
  f_luggage: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 15, 3); PE(G, x - 10, y - 2, 2, 2, '#2a2a30'); PE(G, x + 10, y - 2, 2, 2, '#2a2a30'); PF(G, x - 13, y - 6, 26, 3, '#c8a040'); PF(G, x - 13, y - 40, 2, 34, '#c8a040'); PF(G, x + 11, y - 40, 2, 34, '#c8a040'); PF(G, x - 13, y - 42, 26, 3, '#c8a040'); PF(G, x - 10, y - 18, 12, 12, '#7a3a2a'); PF(G, x - 10, y - 18, 12, 2, '#9a5a4a'); PF(G, x + 2, y - 15, 8, 9, '#3a5a8a'); PF(G, x - 8, y - 28, 14, 10, '#e8c030'); PF(G, x - 8, y - 24, 14, 1, '#a88a20'); PF(G, x - 3, y - 31, 4, 3, '#5a3a22') } },
  f_elev: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); PF(G, x - 14, wy - 30, 28, 30, '#c8a040'); PF(G, x - 12, wy - 27, 24, 27, '#8a8a94'); PF(G, x - 1, wy - 27, 2, 27, '#5a5a64'); PF(G, x - 11, wy - 26, 4, 25, '#a8a8b4'); PF(G, x + 2, wy - 26, 4, 25, '#a8a8b4'); PE(G, x, wy - 33, 6, 2, '#c8a040'); PF(G, x - 2, wy - 34, 4, 2, '#ff8a3a'); PF(G, x + 15, wy - 18, 3, 6, '#3a3a40'); PF(G, x + 16, wy - 17, 1, 1, '#fff'); PF(G, x + 16, wy - 14, 1, 1, '#fff') } },
  f_bigplant: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 3); PF(G, x - 6, y - 11, 12, 11, '#c8a040'); PF(G, x - 6, y - 11, 12, 2, '#e8c860'); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .45, l = 12 + (i % 3) * 3; for (let k = 0; k < l; k++) PF(G, x + Math.cos(a) * k - 1, y - 12 + Math.sin(a) * k + (k * k) / 30, 3, 2, k > l * .6 ? '#5ab86a' : '#3a8a4a') } } },
  // ---------------- the turtle hut
  f_hammock: { w: 3, s: [0, 0, 3, 1], d(G, x, y) { for (const d of [-1, 1]) { PF(G, x + d * 22 - 2, y - 30, 4, 30, '#7a5232'); PF(G, x + d * 22 - 2, y - 30, 4, 2, '#9a7248') } SHD(G, x + 2, y, 18, 3); for (let i = -18; i <= 18; i++) { const sag = 8 - (i * i) / 45; PF(G, x + i, y - 24 + sag, 1, 6, (i >> 2) & 1 ? '#e8541a' : '#f4ecd8') } PF(G, x - 21, y - 26, 4, 1, '#c8b890'); PF(G, x + 17, y - 26, 4, 1, '#c8b890'); PF(G, x - 6, y - 22, 10, 4, '#3a9ac8') } },
  f_netw: { flat: 1, w: 3, d(G, x, y) { const wy = WY(y); for (let i = 0; i < 7; i++) { for (let k = 0; k < 22; k++) PF(G, x - 22 + i * 7 + k * .3, wy - 28 + k, 1, 1, '#c8b890'); for (let k = 0; k < 22; k++) PF(G, x - 22 + i * 7 + 6 - k * .3, wy - 28 + k, 1, 1, '#a89870') } for (const [a, b] of [[-14, -22], [2, -16], [14, -24]]) { PE(G, x + a, wy + b, 3, 3, '#e8541a'); PE(G, x + a - 1, wy + b - 1, 1, 1, '#fff') } PE(G, x + 8, wy - 9, 4, 3, '#ffb070') } },
  f_shelfshell: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 32, 3, 32, '#7a5232'); PF(G, x + 11, y - 32, 3, 32, '#7a5232'); for (let j = 0; j < 3; j++) { PF(G, x - 14, y - 22 + j * 10, 28, 2, '#9a7248'); for (let i = 0; i < 4; i++) { const k = (i + j * 2) % 4, cx = x - 9 + i * 6, cy = y - 25 + j * 10; if (k == 0) PE(G, cx, cy, 3, 2.5, '#f8d8c8'); else if (k == 1) PF(G, cx - 2, cy - 1, 5, 4, '#9ad8f0'); else if (k == 2) PE(G, cx, cy, 2.5, 3, '#ffb070'); else PF(G, cx - 1, cy - 2, 3, 5, '#e8e0d0') } } } },
  f_mat: { flat: 1, w: 3, d(G, x, y) { PF(G, x - 22, y - 22, 44, 22, '#a8884a'); for (let j = 0; j < 22; j += 3) for (let i = 0; i < 44; i += 6) PF(G, x - 22 + i + (j % 6 ? 3 : 0), y - 22 + j, 3, 2, '#c8a860'); PF(G, x - 22, y - 22, 44, 1, '#8a6a3a'); PF(G, x - 22, y - 1, 44, 1, '#8a6a3a') } },
  f_lowtable: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 14, 3); PF(G, x - 12, y - 9, 24, 9, '#5a3a22'); PF(G, x - 12, y - 9, 24, 3, '#9a7248'); PE(G, x - 4, y - 12, 4, 4, '#7a5232'); PE(G, x - 4, y - 13, 2, 1.5, '#e8e0d0'); PF(G, x + 3, y - 14, 3, 5, '#c8e0e8'); PF(G, x + 7, y - 12, 4, 3, '#ffb070') } },
  f_drift: { flat: 1, d(G, x, y) { PF(G, x - 10, y - 5, 20, 3, '#c8b8a0'); PF(G, x - 10, y - 5, 20, 1, '#e8dcc8'); PF(G, x + 4, y - 8, 2, 4, '#c8b8a0'); PE(G, x - 6, y - 9, 3, 3, '#ff8a5a') } },
  // ---------------- capsule hotel
  f_locker: { s: S1, d(G, x, y, P, s) { SHD(G, x + 1, y, 8, 3); PF(G, x - 8, y - 36, 16, 36, '#0b1640'); PF(G, x - 7, y - 35, 14, 34, '#2a4a8a'); PF(G, x - 7, y - 18, 14, 1, '#0b1640'); for (const j of [0, 17]) { for (let i = 0; i < 3; i++) PF(G, x - 5, y - 33 + j + i * 2, 6, 1, '#1a3070'); PF(G, x + 3, y - 28 + j, 2, 3, '#c8c8d0'); PF(G, x - 5, y - 26 + j, 3, 2, NC[((s * 7 + j) % 4) | 0]) } } },
  f_kiosk: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 18, 28, 18, '#0b1640'); PF(G, x - 13, y - 17, 26, 16, '#1a3070'); PF(G, x - 13, y - 17, 26, 2, '#2ee6e6'); PF(G, x - 6, y - 34, 12, 16, '#0b1640'); PF(G, x - 5, y - 33, 10, 12, '#14306a'); PF(G, x - 4, y - 31, 8, 1, '#2ee6e6'); PF(G, x - 4, y - 28, 5, 1, '#ff5a8a'); PF(G, x - 4, y - 25, 7, 1, '#2ee6e6'); PF(G, x + 8, y - 22, 4, 4, '#ff5a8a') } },
  f_shoes: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 14, 2); PF(G, x - 13, y - 16, 26, 16, '#0b1640'); for (let j = 0; j < 3; j++) { PF(G, x - 12, y - 15 + j * 5, 24, 4, '#1a3070'); for (let i = 0; i < 4; i++) if ((i + j) % 3) PF(G, x - 11 + i * 6, y - 13 + j * 5, 5, 2, ['#e8e0d0', '#ff5a8a', '#2ee6e6', '#3a3a40'][(i + j) % 4]) } } },
  // ---------------- ramen shop
  f_rcounter: { w: 9, s: [0, 0, 9, 1], d(G, x, y) {   // long wooden ramen bar with bowls, chopstick cups, sauces
    SHD(G, x + 2, y, 72, 4); PF(G, x - 72, y - 20, 144, 20, '#120604'); PF(G, x - 71, y - 14, 142, 13, '#7a3a20'); for (let i = 0; i < 18; i++) PF(G, x - 70 + i * 8, y - 14, 1, 13, '#5a2a14'); PF(G, x - 72, y - 21, 144, 7, '#c88a50'); PF(G, x - 72, y - 21, 144, 1, '#e8b070');
    for (let i = 0; i < 6; i++) { const bx = x - 60 + i * 24; PE(G, bx, y - 19, 5, 2.5, '#f4f4f4'); PE(G, bx, y - 19, 4, 1.6, '#e8b060'); PF(G, bx + 6, y - 24, 1, 6, '#c8a060'); PF(G, bx + 8, y - 24, 1, 6, '#c8a060') }
    for (let i = 0; i < 3; i++) { PF(G, x - 70 + i * 66, y - 26, 4, 6, '#3a1a10'); PF(G, x - 66 + i * 66, y - 25, 3, 5, '#c83a2a') }
  } },
  f_pots: { w: 3, s: S3, d(G, x, y) {   // kitchen range: big stock pots, ladles, steam
    PF(G, x - 24, y - 38, 48, 14, '#3a2a24'); for (let i = 0; i < 6; i++) PF(G, x - 24 + i * 8, y - 38, 1, 14, '#2a1a14'); SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 20, 48, 20, '#120604'); PF(G, x - 23, y - 19, 46, 18, '#8a8a94'); PF(G, x - 23, y - 19, 46, 3, '#b8b8c4');
    for (let i = 0; i < 3; i++) { const px = x - 15 + i * 15; PF(G, px - 6, y - 30, 12, 11, '#5a5a64'); PF(G, px - 6, y - 30, 12, 2, '#9a9aa4'); PE(G, px, y - 30, 5, 1.5, i == 1 ? '#e8b060' : '#d8c8a0'); PE(G, px - 2, y - 36, 2, 3, 'rgba(255,255,255,.35)'); PE(G, px + 2, y - 40, 2.5, 3, 'rgba(255,255,255,.22)') }
    PF(G, x + 18, y - 34, 1, 14, '#c8c8d0'); PE(G, x + 18, y - 20, 2, 1.5, '#c8c8d0');
  } },
  f_noren: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); PF(G, x - 14, wy - 30, 28, 30, '#120604'); PF(G, x - 15, wy - 31, 30, 2, '#5a3a22'); for (let i = 0; i < 4; i++) { PF(G, x - 14 + i * 7, wy - 29, 6, 16, '#2a2a6a'); PF(G, x - 14 + i * 7, wy - 29, 6, 1, '#3a3a8a') } PE(G, x, wy - 22, 4, 4, '#f4f4f4'); PF(G, x - 1, wy - 24, 2, 4, '#2a2a6a') } },
  f_menutags: { flat: 1, w: 3, d(G, x, y) { const wy = WY(y); PF(G, x - 24, wy - 30, 48, 2, '#2a1a10'); for (let i = 0; i < 7; i++) { PF(G, x - 22 + i * 7, wy - 28, 5, 16, i % 3 ? '#e8d8b0' : '#c83a2a'); for (let k = 0; k < 4; k++) PF(G, x - 21 + i * 7, wy - 26 + k * 3, 3, 1, i % 3 ? '#3a2a1a' : '#fff') } } },
  f_lowstool: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 1, y - 9, 2, 9, '#3a3a40'); PF(G, x - 4, y - 1, 8, 1, '#3a3a40'); PE(G, x, y - 10, 5, 2.5, '#120604'); PE(G, x, y - 11, 4.4, 2, '#c83a2a') } },
  // ---------------- arcade
  f_claw: { w: 2, s: S2, d(G, x, y) {   // claw machine full of plush
    SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 46, 28, 46, '#0b0a24'); PF(G, x - 13, y - 45, 26, 6, '#ff5a8a'); PF(G, x - 12, y - 39, 24, 22, 'rgba(160,220,255,.35)'); PF(G, x - 13, y - 17, 26, 16, '#e83a7a'); PF(G, x - 13, y - 17, 26, 2, '#ff8ab0');
    for (let i = 0; i < 6; i++) { const px = x - 10 + (i % 3) * 7, py = y - 22 - ((i >> 1) & 1) * 4; PE(G, px, py, 3, 3, ['#ffd23c', '#7ad0ff', '#fff', '#8cff5a', '#ff9ab8', '#c89aff'][i]) } PF(G, x, y - 39, 1, 8, '#c8c8d0'); PF(G, x - 2, y - 31, 5, 2, '#c8c8d0');
    PE(G, x + 6, y - 11, 2.5, 2.5, '#ffd23c'); PF(G, x - 8, y - 12, 2, 4, '#2a2a30'); PE(G, x - 7, y - 13, 2, 2, '#ff3a3a'); PF(G, x - 4, y - 7, 8, 4, '#0b0a24');
  } },
  f_dance: { w: 3, s: [0, -1, 3, 2], d(G, x, y) {   // dance machine: screen tower and an arrow pad
    PF(G, x - 18, y - 22, 36, 22, '#0b0a24'); for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { const on = (i + j) % 2 == 0; PF(G, x - 16 + i * 11, y - 20 + j * 10, 10, 9, on ? '#ff5a8a' : '#3a2a6a'); PF(G, x - 12 + i * 11, y - 17 + j * 10, 2, 3, '#fff') }
    PF(G, x - 12, y - 58, 24, 36, '#0b0a24'); PF(G, x - 10, y - 54, 20, 14, '#1a1a4a'); PF(G, x - 8, y - 50, 3, 3, '#2ee6e6'); PF(G, x - 1, y - 47, 3, 3, '#ff5a8a'); PF(G, x + 5, y - 52, 3, 3, '#ffd23c'); PF(G, x - 12, y - 60, 24, 3, '#2ee6e6');
  } },
  f_hockey: { w: 3, s: S3, d(G, x, y) { SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 18, 48, 18, '#0b0a24'); PF(G, x - 22, y - 16, 44, 10, '#e8f0ff'); PF(G, x - 1, y - 16, 2, 10, '#ff5a8a'); PE(G, x, y - 11, 4, 3, 'rgba(255,90,138,.5)'); PE(G, x - 14, y - 11, 3, 2.5, '#2ee6e6'); PE(G, x + 13, y - 12, 3, 2.5, '#ffd23c'); PE(G, x + 5, y - 11, 1.6, 1.4, '#222'); PF(G, x - 22, y - 6, 44, 5, '#3a2a6a') } },
  f_change: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 3); PF(G, x - 8, y - 34, 16, 34, '#0b0a24'); PF(G, x - 7, y - 33, 14, 32, '#3a3a5a'); PF(G, x - 5, y - 30, 10, 6, '#ffd23c'); PF(G, x - 4, y - 29, 8, 1, '#0b0a24'); PF(G, x - 3, y - 20, 6, 2, '#0b0a24'); PF(G, x - 4, y - 10, 8, 5, '#1a1a2a'); PF(G, x - 7, y - 33, 14, 1, '#2ee6e6') } },
  f_neontube: { flat: 1, w: 3, d(G, x, y, P, s) { const wy = WY(y), c = s < .5 ? '#ff5a8a' : '#2ee6e6'; PE(G, x, wy - 20, 26, 10, 'rgba(255,90,170,.08)'); for (let i = 0; i < 40; i++) PF(G, x - 20 + i, wy - 20 + Math.round(Math.sin(i / 4) * 4), 2, 2, c); PF(G, x - 22, wy - 22, 2, 6, c); PF(G, x + 20, wy - 22, 2, 6, c) } }
});
const iob = (kind, x, y, lines, o = {}) => obj(kind, x, y, lines, { inv: 1, ...o });

// ==================== the rooms ====================
// ---- Uku's house: kitchen top-left, living room bottom-left, Uku's bedroom behind the partition on the right
A('w_uhouse', { nm: 'Uku\'s House', pal: 'uku', interior: true, floor: 'wood', wall: 'wainscot', w: 24, h: 16, mus: 'forest',
  feat: [{ k: 'wall', x: 14, y: 2, w: 1, h: 6 }, { k: 'wall', x: 14, y: 11, w: 1, h: 3 },
    p('f_counter', 2, 2), p('f_stove', 5, 2), p('f_fridge', 6, 2), p('f_shelfw', 8, 2, { seed: .1 }), p('f_dtable', 4, 5, { c: '#e8a0a8' }), p('window', 11, 2), p('f_wclock2', 13, 2),
    p('f_tvset', 3, 8), p('rug', 3, 11, { seed: .8 }), p('f_couch', 3, 13, { c: '#5a7a9a' }), p('f_tapes', 8, 9), p('flamp', 12, 9), p('pot', 2, 9), p('picture', 10, 2, { faces: 4 }), p('boxes', 12, 13),
    p('cbed', 19, 4, { c: '#2a2a3a' }), p('f_nstand', 21, 3), p('f_bposter', 16, 2, { seed: .2, t: 1 }), p('f_bposter', 18, 2, { seed: .8 }), p('window', 20, 2, { curtain: '#3a68c8' }), p('f_guitar', 15, 4),
    p('f_desk2', 16, 9), p('dresser', 21, 9), p('books', 18, 12), p('f_rrug', 18, 8, { c: '#3a4a6a' }), p('pot', 21, 13)],
  exits: [ex('down', 11, 12, 'w_garden')],
  ents: [iob('desk', 17, 9, ['|A photo in a frame: friends on a couch. There is an empty space at one end, as if someone were meant to stand there.', 'Hitori:neutral|...Who is missing from this picture?'], { quiet: 1, lore: 'photo' }),
    iob('fridge', 6, 2, ['|A sticky note on the fridge: "Back by dusk. Don\'t wait up. -U"', 'Hitori:neutral|He always writes the same note.'], { set: 'uku_note' }),
    iob('shelf', 8, 9, ['|Rows of mix tapes, labelled in tiny handwriting. One slot is empty.'], { quiet: 1 }), iob('cbedi', 19, 4, ['|The bed is made. There is a dent in the pillow, but it is cold.'], { quiet: 1 }),
    iob('drawers', 21, 9, ['|A drawer full of identical white bands, rolled up neatly.', 'Hitori:neutral|...Why does he have so many of these?'], { lore: 'bands' }),
    iob('guitar', 15, 4, ['|Uku\'s guitar. A string is missing. He said he\'d replace it "after the summer."', 'Hitori:sad|...It\'s still summer.'], { quiet: 1 }),
    iob('tv', 3, 8, ['|The TV shows static. Under the static, very faintly, a game paused on the second player\'s turn.'], { quiet: 1 }),
    iob('stove', 5, 2, ['|A pot of soup, gone cold. Four bowls set out beside it.'], { quiet: 1 }), iob('table', 4, 5, ['|The table is set for two. Somebody ate. Somebody didn\'t.'], { quiet: 1 })] });

// ---- Mochi's cottage: a cat's house. Fireplace, armchairs, cat tree, cat bed, yarn, a fishbowl Mochi pretends not to watch
A('w_cottage', { nm: 'Mochi\'s Cottage', pal: 'mochi', interior: true, floor: 'wood', wall: 'stripe', w: 18, h: 13, mus: 'forest',
  feat: [p('fireplace', 8, 2), p('f_bookcase', 2, 2, { seed: .4 }), p('window', 5, 2, { curtain: '#e8a0a8' }), p('window', 13, 2, { curtain: '#e8c060' }), p('f_shelfw', 11, 2, { seed: .7 }),
    p('f_armchair', 5, 5, { c: '#c86a4a' }), p('f_catbed', 11, 5, { c: '#7a8ac8' }), p('f_rrug', 9, 8, { c: '#c86a8a' }), p('f_cattree', 14, 4), p('f_yarn', 6, 8), p('f_fishbowl', 2, 8), p('f_teatable', 13, 8), p('f_armchair', 14, 10, { c: '#6a8a5a' }), p('pot', 2, 10), p('books', 4, 10), p('f_wclock2', 15, 2)],
  exits: [ex('down', 8, 9, 'w_meadow')],
  ents: [npc('mochi', 9, 6), iob('fishbowl', 2, 8, ['|A goldfish in a bowl. Mochi has never once looked at it. Mochi is always almost looking at it.'], { quiet: 1 }),
    iob('cattree', 14, 4, ['|A scratching tower, shredded to ribbons at exactly the height of a cat standing on its toes.'], { quiet: 1 }), iob('fireplace', 8, 2, ['|The fire is warm. It has been burning for a long time without any wood.'], { quiet: 1 })] });

// ---- the lookout cabin: log walls, bunks, a stove, sea charts, a lantern hanging from the beam
A('b_cabin', { nm: 'Lookout Cabin', pal: 'cabin', interior: true, floor: 'wood', wall: 'log', w: 18, h: 12, mus: 'beach',
  feat: [p('f_bunk', 2, 4, { c: '#3a6ac8', c2: '#c83a3a' }), p('f_bunk', 14, 4, { c: '#5ab86a', c2: '#e8c030' }), p('window', 5, 2, { night: 1 }), p('window', 12, 2, { night: 1, curtain: '#3a68c8' }), p('f_map', 8, 2), p('f_rod', 10, 2),
    p('f_potbelly', 6, 3), p('f_ltable', 8, 6), p('f_hlantern', 9, 5), p('f_coatrack', 11, 3), p('crate', 15, 8), p('barrel', 2, 8), p('rug', 8, 9, { seed: .2 })],
  exits: [ex('down', 8, 9, 'b_path')],
  ents: [iob('bunk', 3, 4, [], { ev: 'sleep' }), iob('table', 8, 6, ['|A logbook on the table. Every entry says the same thing: "Clear skies. Calm sea. Nobody came."'], { quiet: 1 }),
    iob('map', 8, 2, ['|A sea chart. Someone has drawn a little island where there isn\'t one, and written "US" on it.'], { quiet: 1 }), iob('rod', 10, 2, ['|A fishing rod. The line is tied in a bow, like a present.'], { quiet: 1 })] });

// ---- Seashell Café: pastel walls, mint and white tiles, cake case, espresso, round tables, shells
A('b_cafe', { nm: 'Seashell Café', pal: 'cafe', interior: true, floor: 'checker', wall: 'wainscot', w: 26, h: 15, mus: 'beach',
  feat: [p('f_espresso', 11, 2), p('f_menuboard', 14, 2), p('f_shelfw', 8, 2, { seed: .1 }), p('f_cakecase', 9, 4), p('f_register', 12, 4), p('f_cakestand', 15, 4), p('window', 4, 2, { curtain: '#ff9ab8' }), p('window', 20, 2, { curtain: '#8ad0c4' }),
    p('f_shellwall', 2, 2), p('f_shellwall', 23, 2), p('f_shellwall', 17, 2), p('f_rtable', 3, 8), p('f_rtable', 7, 11), p('f_rtable', 17, 8, { c: '#fff0f4' }), p('f_rtable', 20, 11), p('f_bigplant', 2, 12), p('f_bigplant', 23, 5), p('f_rrug', 13, 10, { c: '#ff9ab8' })],
  exits: [ex('down', 12, 13, 'b_boardwalk')],
  ents: [iob('register', 13, 4, [], { ev: 'shop', shop: 'cafe', say: ['|A bell on the counter. You ring it. A voice from the back:', '|"Sit anywhere. Nobody ever does. What can I get you?"'] }),
    iob('cakes', 10, 4, ['|Cakes in the glass case. Every one has a slice missing.'], { quiet: 1 }), iob('menuboard', 14, 2, ['|The chalkboard menu. At the very bottom, smaller: "Today\'s special: one dinner."'], { quiet: 1 }),
    iob('table', 3, 8, ['|Two cups of tea, still steaming. Nobody is sitting here.'], { quiet: 1 })] });

// ---- Grand Resort lobby: marble, columns, chandeliers, reception, lost & found, sofas, luggage, elevator
A('b_hotel', { nm: 'Grand Resort: Lobby', pal: 'lobby', interior: true, floor: 'marble', wall: 'wainscot', w: 40, h: 22, mus: 'beach',
  feat: [{ k: 'ground', x: 18, y: 2, w: 4, h: 20, g: 11 }, p('f_rdesk', 7, 6), p('f_keyrack', 9, 2), p('f_rdesk', 26, 6, { lf: 1 }), p('f_lfsign', 29, 2),
    ...ps('f_column', [[16, 5], [23, 5], [16, 13], [23, 13]]), p('f_chand', 11, 12), p('f_chand', 28, 12), ...ps('window', [[4, 2], [14, 2], [25, 2]]), p('f_wclock2', 20, 2),
    p('f_lsofa', 4, 15, { c: '#2a6a74' }), p('f_ctable', 5, 17), p('f_lsofa', 31, 15, { c: '#8a1a2a' }), p('f_ctable', 32, 17), p('f_luggage', 35, 10), p('f_elev', 35, 2), p('f_bigplant', 2, 4), p('f_bigplant', 37, 4), p('f_bigplant', 2, 19), p('f_bigplant', 13, 19), p('picture', 12, 2), p('picture', 33, 2)],
  exits: [ex('down', 19, 20, 'b_plaza'), ex('up', 19, 20, 'b_roof')],
  ents: [iob('counter', 9, 6, ['|The front desk. A bell, a pen, and a guest book. The last entry is today\'s date, signed with an X.']), obj('counter', 28, 6, [], { ev: 'lostfound', inv: 1 }),
    iob('sofa', 5, 15, ['Hitori:neutral|It\'s the softest couch I\'ve ever sat on. I could sleep for a week.']), obj('clock', 15, 10, ['|The lobby clock says 6:00. Same as everywhere.'], { lore: 'clocks' }),
    obj('mirror', 37, 9, ['|A long mirror by the elevator. In it, the lobby is slightly emptier than in real life.'], { lore: 'mirror' }), iob('elevator', 35, 3, ['|The elevator buttons go 1, 2, 3, 4, and then, much further down, 6.'], { quiet: 1 }),
    iob('luggage', 35, 10, ['|A luggage cart. Four bags, four name tags. The tags are blank.'], { quiet: 1 }), chest('c:b_hotel', 36, 19, { money: 30 })] });

// ---- the Turtle Hut: bamboo walls, sand floor, a hammock, nets and shells everywhere
A('b_hut', { nm: 'Turtle Hut', pal: 'hut', interior: true, floor: 'sand', wall: 'bamboo', w: 18, h: 12, mus: 'beach',
  feat: [p('f_hammock', 2, 4), p('f_netw', 9, 2), p('window', 5, 2, { curtain: '#e8541a' }), p('f_shelfshell', 13, 3), p('f_mat', 8, 8), p('f_lowtable', 13, 7), p('shellpile', 14, 9), p('f_drift', 3, 9), p('f_hlantern', 9, 4), p('pot', 2, 9), p('f_shellwall', 15, 2)],
  exits: [ex('down', 8, 9, 'b_shore')],
  ents: [npc('shell', 9, 5), iob('hammock', 3, 4, ['|A hammock, still swaying. Nobody is in it. Shell says it is "for later."'], { quiet: 1 }), iob('shelf', 13, 3, ['|Shells, sorted by size. One empty spot, labelled in crayon: "the one you\'ll bring."'], { quiet: 1 })] });

// ---- capsule hotel: capsules, lockers, a kiosk, shoe racks
A('n_capsule', { ...CY, nm: 'Capsule Hotel', pal: 'capsule', interior: true, floor: 'tile', wall: 'stripe', w: 30, h: 14, fill: null, edge: 'wall', base: 0, mus: 'inboredom',
  feat: [...ps('capsule', [[2, 4], [5, 4], [8, 4], [18, 4], [21, 4], [24, 4]]), ...ps('f_locker', [[11, 2], [12, 2], [16, 2], [17, 2]]), p('f_shoes', 2, 10), p('f_kiosk', 20, 9), p('c_vend', 12, 9), p('neonx', 14, 2), p('c_plant', 27, 10), p('rug', 6, 11), p('f_neontube', 25, 2, { seed: .8 })],
  exits: [ex('down', 14, 15, 'n_street')],
  ents: [iob('capsule', 9, 5, [], { ev: 'sleep' }), iob('desk', 21, 9, ['|The front desk is a screen. It says: "WELCOME BACK. YOUR USUAL ROOMS ARE READY."', 'Hitori:neutral|...Usual?']), iob('capsule', 3, 5, ['|A capsule with a little reading light. The pillow has a dent in it.'], { quiet: 1 }),
    iob('locker', 12, 2, ['|Locker 4 is open. Inside: a white hospital band, folded in half.'], { quiet: 1 })] });

// ---- Ren's Ramen: long wooden bar, the kitchen behind it, noren to the back, red stools, menu tags
A('n_ramen', { ...CY, nm: 'Ren\'s Ramen', pal: 'ramen', interior: true, floor: 'wood', wall: 'plank', w: 28, h: 14, fill: null, edge: 'wall', base: 0,
  feat: [p('f_pots', 8, 2), p('f_pots', 13, 2), p('f_noren', 18, 2), p('f_menutags', 3, 2), p('f_menutags', 22, 2), p('f_rcounter', 6, 5), p('f_hlantern', 8, 8), p('f_hlantern', 18, 8),
    ...ps('f_lowstool', [[7, 7], [9, 7], [11, 7], [13, 7], [15, 7], [17, 7]]), p('f_lowtable', 3, 10), p('f_lowtable', 21, 10), p('c_plant', 2, 6), p('c_plant', 25, 6), p('c_sign', 24, 11, { v: '_p' })],
  exits: [ex('down', 13, 14, 'n_street')],
  ents: [npc('ren', 12, 3), obj('counter', 9, 5, ['|Steaming bowls. Each one is for a different person, and all of them are empty-chaired.'], { inv: 1, fr: { steven: 'I could eat all of these.', caroline: 'It smells like home, somehow!' } }),
    iob('bell', 16, 5, [], { ev: 'shop', shop: 'ren', say: ['|A little brass bell on the bar. Ren looks up from the pots.', 'Ren:happy|Hungry? Of course you\'re hungry.'] }),
    obj('bench', 22, 10, ['Hitori:blush|I\'ve never been here. But I know what this tastes like.'], { inv: 1, fr: { steven: 'Okay. This is the best day we\'ve had.', caroline: 'We should come back! ...Do we always say that?' } })] });

// ---- Pixel Palace Arcade: neon carpet, cabinet rows, claw machine, dance machine, air hockey, a change machine
A('n_arcade', { ...CY, nm: 'Pixel Palace Arcade', pal: 'arcadein', interior: true, floor: 'arcade', wall: 'brick', w: 36, h: 18, fill: null, edge: 'wall', base: 0,
  feat: [p('neonx', 4, 2), p('f_neontube', 14, 2), p('c_sign', 28, 2, { v: '_p' }), p('f_change', 2, 4), p('f_claw', 13, 4), p('f_dance', 21, 4), p('f_hockey', 13, 12), p('c_vend', 31, 4), p('booth', 26, 14), p('bags', 2, 15)],
  exits: [ex('down', 17, 18, 'n_market')],
  ents: [npc('kix', 18, 7), obj('arcade', 6, 7, ['|The screen flashes: you beat a level you never played.', 'Hitori:happy|Hah. Easy.'], { need: 'ar1', set: 'a1', nope: ['|A flashing machine. "INSERT COIN".'], solid: [-1, -1, 2, 1] }), obj('arcade', 10, 7, ['|Another game. Your score is already on the board.'], { need: 'ar1', set: 'a2', nope: ['|A flashing machine. "INSERT COIN".'], solid: [-1, -1, 2, 1] }), obj('arcade', 28, 9, ['|The last machine. The high score reads "STV".'], { need: 'ar1', set: 'a3', nope: ['|A flashing machine. "INSERT COIN".'], solid: [-1, -1, 2, 1] }),
    deco('arcade', 6, 12, [-1, -1, 2, 1]), deco('arcade', 10, 12, [-1, -1, 2, 1]), deco('slot', 31, 12, [-1, -1, 2, 1]), deco('arcade', 32, 9, [-1, -1, 2, 1]), obj('bench', 24, 15, ['Hitori:neutral|I know the sound of these. Why do I know the sound of these?']),
    iob('claw', 14, 4, ['|A claw machine. Right at the front, a little plush that looks like Hitori. It never quite fits through the chute.'], { quiet: 1 }), iob('dance', 22, 4, ['|The dance machine is playing a song by itself. The arrows are perfect. Nobody is on the pad.'], { quiet: 1 })] });
