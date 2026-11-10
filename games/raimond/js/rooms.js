// ==================== DENSE MULTI-ROOM INTERIORS (v9) ====================
// Each interior is drawn as a character grid: '#' = wall (inner walls make separate rooms), '.' = floor,
// any other character places the furniture / objects listed in that room's legend at that cell.
// zones: [x, y, w, h, floor, wallpaper] give each room its own floor and paint the wall faces above it.
const FZ = {   // floor patches (one tile each)
  btile: (G, x, y) => { PF(G, x, y, 16, 16, '#e8ecf0'); PF(G, x, y, 16, 1, '#b8c4cc'); PF(G, x, y + 8, 16, 1, '#c8d0d8'); PF(G, x, y, 1, 16, '#b8c4cc'); PF(G, x + 8, y, 1, 16, '#c8d0d8') },
  gtile: (G, x, y) => { PF(G, x, y, 16, 16, '#5a6470'); PF(G, x + 1, y + 1, 7, 7, '#6a7480'); PF(G, x + 9, y + 9, 7, 7, '#6a7480'); PF(G, x + 9, y + 1, 7, 7, '#626c78'); PF(G, x + 1, y + 9, 7, 7, '#626c78') },
  check: (G, x, y) => { for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) PF(G, x + i * 8, y + j * 8, 8, 8, (i + j + (x >> 4) + (y >> 4)) & 1 ? '#3a3a48' : '#ece6da') },
  board: (G, x, y) => { PF(G, x, y, 16, 16, '#c89a68'); for (let i = 0; i < 4; i++) { PF(G, x, y + i * 4 + 3, 16, 1, '#a07448'); PF(G, x + (((y >> 2) + i) * 5) % 16, y + i * 4, 1, 3, '#a07448') } },
  dboard: (G, x, y) => { PF(G, x, y, 16, 16, '#5a3e2a'); for (let i = 0; i < 4; i++) { PF(G, x, y + i * 4 + 3, 16, 1, '#3e2a1c'); PF(G, x + (((y >> 2) + i) * 7) % 16, y + i * 4, 1, 3, '#3e2a1c'); PF(G, x + 3, y + i * 4, 4, 1, '#6a4a34') } },
  carpet: (G, x, y, c) => { PF(G, x, y, 16, 16, c); if ((x + y) % 32 == 0) PF(G, x + 7, y + 7, 2, 2, sh(c, 1.2)); PF(G, x + 3, y + 11, 1, 1, sh(c, .85)); PF(G, x + 12, y + 4, 1, 1, sh(c, .85)) },
  mint: (G, x, y) => { PF(G, x, y, 16, 16, ((x + y) >> 4) & 1 ? '#9adcd0' : '#fbf6ee'); PF(G, x, y + 15, 16, 1, 'rgba(0,0,0,.06)') },
  stone: (G, x, y) => { PF(G, x, y, 16, 16, '#7a7a84'); PF(G, x, y + 7, 16, 1, '#5a5a64'); PF(G, x + ((y >> 4) & 1 ? 4 : 11), y, 1, 7, '#5a5a64'); PF(G, x + ((y >> 4) & 1 ? 11 : 4), y + 8, 1, 8, '#5a5a64') }
};
const WZ = {   // wallpaper painted over the wall face above a room
  tile: (G, x, y, h) => { PF(G, x, y, 16, h, '#eef2f4'); for (let j = 0; j < h; j += 6) PF(G, x, y + j, 16, 1, '#c8d4dc'); PF(G, x + 7, y, 1, h, '#c8d4dc'); PF(G, x, y + h - 2, 16, 2, '#9aa8b4') },
  green: (G, x, y, h) => { PF(G, x, y, 16, h, '#a8d8b0'); for (let j = 3; j < h; j += 7) PF(G, x + 4 + (j % 2) * 6, y + j, 2, 2, '#88b890'); PF(G, x, y + h - 4, 16, 4, '#6a4a30'); PF(G, x, y + h - 4, 16, 1, '#8a6a44') },
  blue: (G, x, y, h) => { PF(G, x, y, 16, h, '#9ab4d8'); PF(G, x + 3, y, 2, h, '#8aa4c8'); PF(G, x + 11, y, 2, h, '#8aa4c8'); PF(G, x, y + h - 3, 16, 3, '#5a6a8a') },
  purple: (G, x, y, h) => { PF(G, x, y, 16, h, '#3a2a5a'); PF(G, x + ((x * 7) % 13), y + 4, 1, 1, '#ffd23c'); PF(G, x + ((x * 3) % 11) + 2, y + h - 10, 1, 1, '#c8a8ff'); PF(G, x, y + h - 3, 16, 3, '#24183a') },
  cream: (G, x, y, h) => { PF(G, x, y, 16, h, '#efe2c4'); PF(G, x, y + h - 6, 16, 6, '#b08458'); PF(G, x, y + h - 6, 16, 1, '#c89a68') },
  pink: (G, x, y, h) => { PF(G, x, y, 16, h, '#f8dce4'); for (let i = 0; i < 16; i += 8) PF(G, x + i, y, 4, h, '#f2ccd8'); PF(G, x, y + h - 6, 16, 6, '#8ad0c4'); PF(G, x, y + h - 6, 16, 1, '#aae8dc') },
  peach: (G, x, y, h) => { PF(G, x, y, 16, h, '#f4d6bc'); for (let i = 2; i < 16; i += 8) PF(G, x + i, y, 3, h, '#ecc8a8'); PF(G, x, y + h - 4, 16, 4, '#9a6a44') },
  wood: (G, x, y, h) => { PF(G, x, y, 16, h, '#7a5232'); for (let i = 0; i < 16; i += 4) PF(G, x + i, y, 1, h, '#5a3a22'); PF(G, x, y + 2, 16, 1, '#9a7248') },
  teal: (G, x, y, h) => { PF(G, x, y, 16, h, '#2a6a74'); PF(G, x + 2, y + 3, 12, h - 8, '#245c66'); PF(G, x, y + h - 3, 16, 3, '#c8a040') },
  navy: (G, x, y, h) => { PF(G, x, y, 16, h, '#1a2a5e'); PF(G, x, y + 4, 16, 1, '#2ee6e6'); PF(G, x, y + h - 3, 16, 3, '#0b1640') },
  red: (G, x, y, h) => { PF(G, x, y, 16, h, '#6a2418'); for (let i = 0; i < 16; i += 8) PF(G, x + i + 2, y + 3, 4, h - 8, '#7a2e20'); PF(G, x, y + h - 3, 16, 3, '#3a120a') }
};
Object.assign(PROPS, {
  f_fz: { flat: 1, z: -9999, d(G, x, y, P, s, p) { const f = FZ[p.t]; if (f) f(G, x - 8, y - 16, p.c) } },
  f_wz: { flat: 1, z: -9998, d(G, x, y, P, s, p) { const f = WZ[p.t], h = p.hh || 32; if (f) f(G, x - 8, y - 16 - h, h) } },
  // ---- rugs (flat, w x h tiles from the anchor's top-left)
  f_rugp: { flat: 1, z: -500, d(G, x, y, P, s, p) { const w = (p.w || 4) * 16, h = (p.h || 2) * 16, x0 = x - 8, y0 = y - 16, c = p.c || '#2a6a6a', c2 = p.c2 || '#e8e0d0';
    PF(G, x0 + 1, y0 + 1, w - 2, h - 2, sh(c, .6)); PF(G, x0 + 3, y0 + 3, w - 6, h - 6, c); PF(G, x0 + 6, y0 + 6, w - 12, h - 12, sh(c, .85)); PF(G, x0 + 6, y0 + 6, w - 12, 1, c2); PF(G, x0 + 6, y0 + h - 7, w - 12, 1, c2); PF(G, x0 + 6, y0 + 6, 1, h - 12, c2); PF(G, x0 + w - 7, y0 + 6, 1, h - 12, c2);
    const cx = x0 + w / 2, cy = y0 + h / 2; PE(G, cx, cy, 6, 4, c2); PE(G, cx, cy, 4, 2.5, sh(c, .85)); PF(G, cx - 1, cy - 1, 2, 2, c2); for (const d of [-1, 1]) { PF(G, cx + d * (w / 2 - 14) - 1, cy - 6, 2, 12, c2); PF(G, cx + d * (w / 2 - 14) - 3, cy - 3, 6, 1, c2); PF(G, cx + d * (w / 2 - 14) - 3, cy + 2, 6, 1, c2) }
    for (let i = 0; i < w; i += 3) { PF(G, x0 + i, y0, 1, 1, c2); PF(G, x0 + i, y0 + h - 1, 1, 1, c2) } } },
  f_rugs: { flat: 1, z: -500, d(G, x, y, P, s, p) { const w = (p.w || 4) * 16, h = (p.h || 2) * 16, x0 = x - 8, y0 = y - 16, cs = p.cs || ['#e8c060', '#6a8a3a', '#f4ecd8']; PF(G, x0 + 2, y0 + 2, w - 4, h - 4, cs[0]); for (let j = 4; j < h - 4; j += 4) PF(G, x0 + 2, y0 + j, w - 4, 2, cs[(j >> 2) % cs.length]); for (let i = 0; i < w - 4; i += 3) { PF(G, x0 + 2 + i, y0, 1, 2, '#f4ecd8'); PF(G, x0 + 2 + i, y0 + h - 2, 1, 2, '#f4ecd8') } } },
  // ---- bathroom
  f_tub: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 20, 30, 20, OUT); PF(G, x - 14, y - 19, 28, 18, '#f4f6f8'); PF(G, x - 12, y - 17, 24, 8, '#9ad0e8'); PF(G, x - 12, y - 17, 24, 2, '#c8ecf8'); PF(G, x - 10, y - 25, 2, 8, '#a8b0b8'); PF(G, x - 10, y - 25, 5, 2, '#a8b0b8'); PE(G, x + 6, y - 13, 3, 2, '#fff'); PE(G, x + 9, y - 14, 2, 1.5, '#fff'); PF(G, x - 14, y - 6, 28, 2, '#d8dce0') } },
  f_toilet: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 26, 12, 9, OUT); PF(G, x - 5, y - 25, 10, 7, '#f4f6f8'); PF(G, x - 5, y - 25, 10, 2, '#fff'); PE(G, x, y - 10, 6, 6, OUT); PE(G, x, y - 10, 5, 5, '#f4f6f8'); PE(G, x, y - 11, 3, 3, '#c8d8e0'); PF(G, x - 3, y - 4, 6, 4, '#e8eaec') } },
  f_sinkm: { s: S1, d(G, x, y) { const wy = WY(y); PF(G, x - 6, wy - 26, 12, 14, '#a8b0b8'); PF(G, x - 5, wy - 25, 10, 12, '#c8e4f0'); PF(G, x - 4, wy - 24, 3, 10, '#e8f6fc'); SHD(G, x + 1, y, 6, 2); PF(G, x - 2, y - 10, 4, 10, '#e8eaec'); PE(G, x, y - 13, 7, 4, OUT); PE(G, x, y - 13, 6, 3.2, '#f4f6f8'); PE(G, x, y - 13, 3.5, 1.5, '#c8d8e0'); PF(G, x - 1, y - 19, 2, 4, '#a8b0b8'); PF(G, x + 4, y - 17, 2, 3, '#ff9ab8') } },
  f_towel: { flat: 1, d(G, x, y, P, s, p) { const wy = WY(y), c = p.c || '#3a9ac8'; PF(G, x - 7, wy - 22, 14, 2, '#a8b0b8'); PF(G, x - 6, wy - 20, 12, 14, c); PF(G, x - 6, wy - 9, 12, 2, sh(c, 1.3)); PF(G, x - 6, wy - 20, 2, 14, sh(c, .8)) } },
  f_bathmat: { flat: 1, z: -400, d(G, x, y, P, s, p) { const c = p.c || '#8ad0c4'; PF(G, x - 10, y - 13, 20, 10, sh(c, .8)); PF(G, x - 9, y - 12, 18, 8, c); for (let i = 0; i < 18; i += 3) PF(G, x - 9 + i, y - 3, 1, 2, c) } },
  f_basket: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 6, y - 12, 12, 12, '#8a6a3a'); for (let i = 0; i < 4; i++) PF(G, x - 6, y - 11 + i * 3, 12, 1, '#a8884a'); PF(G, x - 5, y - 15, 5, 4, '#e85a5a'); PF(G, x, y - 16, 5, 5, '#5a8ae8'); PF(G, x - 2, y - 14, 3, 2, '#f4f4f4') } },
  f_bin: { s: S1, d(G, x, y, P, s, p) { SHD(G, x + 1, y, 5, 2); PF(G, x - 4, y - 11, 8, 11, OUT); PF(G, x - 3, y - 10, 6, 9, p.c || '#8a9aa8'); PF(G, x - 4, y - 12, 8, 2, sh(p.c || '#8a9aa8', 1.2)); PF(G, x - 2, y - 14, 3, 2, '#f4ecd8') } },
  // ---- bedroom
  f_bed2: { w: 2, s: [0, -1, 2, 2], d(G, x, y, P, s, p) { const c = p.c || '#2a8a8a'; SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 38, 30, 38, OUT); PF(G, x - 15, y - 42, 30, 8, '#6a4a2a'); PF(G, x - 15, y - 42, 30, 2, '#8a6a44'); PF(G, x - 13, y - 33, 26, 31, '#f4ecd8'); PF(G, x - 12, y - 32, 11, 6, '#fff'); PF(G, x + 1, y - 32, 11, 6, '#fff'); PF(G, x - 13, y - 24, 26, 22, c); PF(G, x - 13, y - 24, 26, 3, sh(c, 1.3)); for (let i = 0; i < 3; i++) PF(G, x - 13, y - 18 + i * 6, 26, 1, sh(c, .85)); PF(G, x - 15, y - 3, 30, 3, '#6a4a2a') } },
  f_wardrobe: { w: 2, s: S2, d(G, x, y, P, s, p) { const c = p.c || '#8a6a44'; SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 44, 30, 44, OUT); PF(G, x - 14, y - 43, 28, 42, c); PF(G, x - 1, y - 40, 2, 37, sh(c, .7)); PF(G, x - 13, y - 40, 11, 37, sh(c, 1.1)); PF(G, x + 2, y - 40, 11, 37, sh(c, 1.1)); PF(G, x - 4, y - 24, 2, 4, '#e8c030'); PF(G, x + 2, y - 24, 2, 4, '#e8c030'); PF(G, x - 15, y - 46, 30, 3, sh(c, .8)); PF(G, x - 10, y - 50, 10, 4, '#c83a3a'); PF(G, x + 2, y - 49, 8, 3, '#e8e0d0') } },
  f_lamp: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 12, 12, 12, OUT); PF(G, x - 5, y - 11, 10, 10, '#8a6a44'); PF(G, x - 1, y - 20, 2, 8, '#c8a040'); PF(G, x - 5, y - 26, 10, 6, '#f4e0b0'); PF(G, x - 5, y - 20, 10, 1, '#c8a870'); PE(G, x, y - 18, 12, 9, 'rgba(255,220,150,.12)') } },
  f_records: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 7, y - 12, 14, 12, '#a8884a'); PF(G, x - 7, y - 12, 14, 1, '#c8a860'); for (let i = 0; i < 5; i++) PF(G, x - 6 + i * 3, y - 18 + (i % 2), 2, 7, ['#c83a3a', '#2a2a30', '#e8c030', '#3a6ac8', '#e8e0d0'][i]) } },
  f_slip: { flat: 1, d(G, x, y) { PE(G, x - 3, y - 6, 2.5, 4, '#ff9ab8'); PE(G, x + 3, y - 5, 2.5, 4, '#ff9ab8'); PE(G, x - 3, y - 8, 1.5, 1.5, '#fff'); PE(G, x + 3, y - 7, 1.5, 1.5, '#fff') } },
  f_laundry: { flat: 1, d(G, x, y) { PE(G, x, y - 6, 8, 4, '#5a8ae8'); PE(G, x - 3, y - 8, 5, 3, '#f4f4f4'); PF(G, x + 1, y - 10, 6, 3, '#e85a5a'); PF(G, x - 7, y - 4, 4, 2, '#2a2a30') } },
  f_ochair: { s: S1, d(G, x, y, P, s, p) { const c = p.c || '#3a3a48'; SHD(G, x + 1, y, 6, 2); PF(G, x - 1, y - 7, 2, 6, '#2a2a30'); PF(G, x - 5, y - 2, 10, 2, '#2a2a30'); PF(G, x - 6, y - 11, 12, 4, c); PF(G, x - 6, y - 22, 12, 11, sh(c, .85)); PF(G, x - 5, y - 21, 10, 2, sh(c, 1.2)) } },
  // ---- music room
  f_amp: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 2); PF(G, x - 8, y - 22, 16, 22, '#1a1a1e'); PF(G, x - 7, y - 21, 14, 4, '#c8a060'); PF(G, x - 7, y - 16, 14, 14, '#3a3a40'); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) PF(G, x - 6 + i * 3.5, y - 15 + j * 3.5, 2, 2, '#2a2a30'); PF(G, x - 5, y - 20, 1, 1, '#fff'); PF(G, x - 2, y - 20, 1, 1, '#fff'); PF(G, x + 1, y - 20, 1, 1, '#fff') } },
  f_drums: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16, 3); PE(G, x, y - 8, 9, 7, OUT); PE(G, x, y - 8, 8, 6, '#c83a3a'); PE(G, x, y - 8, 5, 4, '#f4ecd8'); for (const [a, b, r_] of [[-11, -16, 5], [10, -16, 5], [-4, -22, 4], [5, -22, 4]]) { PE(G, x + a, y + b + 2, r_ + 1, r_ * .6 + 3, OUT); PE(G, x + a, y + b + 2, r_, r_ * .6 + 2, '#c83a3a'); PE(G, x + a, y + b, r_, r_ * .5, '#e8e0d0') } PF(G, x - 15, y - 30, 1, 22, '#a8a8b0'); PE(G, x - 15, y - 30, 6, 1.5, '#e8c030'); PF(G, x + 14, y - 28, 1, 20, '#a8a8b0'); PE(G, x + 14, y - 28, 5, 1.5, '#e8c030') } },
  f_keys: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 15, 2); PF(G, x - 12, y - 10, 2, 10, '#2a2a30'); PF(G, x + 10, y - 10, 2, 10, '#2a2a30'); PF(G, x - 14, y - 16, 28, 7, '#1a1a1e'); PF(G, x - 13, y - 13, 26, 3, '#f4f4f4'); for (let i = 0; i < 9; i++) PF(G, x - 12 + i * 3, y - 13, 1, 2, '#1a1a1e'); PF(G, x - 12, y - 16, 6, 2, '#c83a3a'); PF(G, x + 6, y - 15, 2, 1, '#3aff9a') } },
  f_beanbag: { s: S1, d(G, x, y, P, s, p) { const c = p.c || '#e85a7a'; SHD(G, x + 1, y, 8, 2); PE(G, x, y - 7, 8, 7, OUT); PE(G, x, y - 7, 7, 6, c); PE(G, x - 2, y - 9, 3, 2, sh(c, 1.3)); PF(G, x - 3, y - 5, 6, 1, sh(c, .8)) } },
  f_mic: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 5, 2); PF(G, x - 4, y - 2, 8, 2, '#2a2a30'); PF(G, x, y - 30, 1, 28, '#a8a8b0'); PE(G, x + 1, y - 32, 2.5, 3, '#2a2a30'); PE(G, x + 1, y - 33, 1, 1, '#888') } },
  f_lights: { top: 1, d(G, x, y, P, s, p) { const n = (p.n || 8) * 16; for (let i = 0; i < n; i += 2) { const yy = y - 44 + Math.round(Math.sin(i / n * Math.PI * 3) * 4); PF(G, x - 8 + i, yy, 2, 1, '#3a3a30'); if (i % 10 == 0) { PF(G, x - 8 + i, yy + 1, 2, 3, ['#ffd23c', '#ff5a8a', '#5ae8ff', '#8cff5a'][(i / 10) % 4]); PE(G, x - 7 + i, yy + 3, 3, 3, 'rgba(255,230,150,.18)') } } } },
  f_vinylw: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); for (let i = 0; i < 3; i++) { PE(G, x - 10 + i * 10, wy - 18 + (i % 2) * 4, 5, 5, '#1a1a1e'); PE(G, x - 10 + i * 10, wy - 18 + (i % 2) * 4, 1.6, 1.6, ['#c83a3a', '#e8c030', '#3a6ac8'][i]) } } },
  f_window2: { flat: 1, w: 2, d(G, x, y, P, s, p) { const wy = WY(y), c = p.curtain || '#c83a5a'; PF(G, x - 13, wy - 28, 26, 22, '#4a2c18'); PF(G, x - 12, wy - 27, 24, 20, p.night ? '#1a2048' : '#9ac8f0'); PF(G, x - 12, wy - 27, 24, 5, p.night ? '#2a3068' : '#c8e4fa'); PF(G, x - 1, wy - 27, 2, 20, '#4a2c18'); PF(G, x - 12, wy - 18, 24, 1, '#4a2c18'); PF(G, x - 15, wy - 30, 30, 2, '#5a3a22'); PF(G, x - 16, wy - 29, 6, 22, c); PF(G, x + 10, wy - 29, 6, 22, c); PF(G, x - 16, wy - 29, 2, 22, sh(c, 1.2)); PF(G, x - 14, wy - 6, 28, 2, '#6a4a2a'); PE(G, x + 6, wy - 9, 3, 2, '#5ab86a') } },
  f_painting: { flat: 1, w: 2, d(G, x, y, P, s, p) { const wy = WY(y); PF(G, x - 12, wy - 28, 24, 18, '#a87a2a'); PF(G, x - 11, wy - 27, 22, 16, p.c || '#e8d8b8'); PE(G, x - 3, wy - 19, 6, 4, '#c85a3a'); PE(G, x + 5, wy - 21, 4, 3, '#8a3a2a'); PF(G, x - 10, wy - 16, 20, 4, '#9ab870'); PE(G, x + 7, wy - 24, 2, 2, '#ffd23c') } },
  f_pinboard: { flat: 1, d(G, x, y) { const wy = WY(y); PF(G, x - 8, wy - 26, 16, 16, '#8a5a32'); PF(G, x - 7, wy - 25, 14, 14, '#c89a68'); PF(G, x - 6, wy - 24, 5, 6, '#f4f4f4'); PF(G, x, wy - 22, 6, 5, '#ffe27a'); PF(G, x - 5, wy - 16, 6, 4, '#9ad8f0'); PF(G, x - 4, wy - 24, 1, 1, '#c83a3a'); PF(G, x + 2, wy - 22, 1, 1, '#3a6ac8') } },
  f_sconce: { flat: 1, d(G, x, y) { const wy = WY(y); PF(G, x - 2, wy - 18, 4, 6, '#c8a040'); PF(G, x - 3, wy - 23, 6, 5, '#fff0c0'); PE(G, x, wy - 20, 10, 8, 'rgba(255,230,160,.15)') } },
  f_mirrorw: { flat: 1, d(G, x, y) { const wy = WY(y); PF(G, x - 7, wy - 30, 14, 26, '#c8a040'); PF(G, x - 6, wy - 29, 12, 24, '#b8d8e8'); PF(G, x - 5, wy - 28, 3, 20, '#e8f6fc') } },
  f_plant2: { s: S1, d(G, x, y, P, s, p) { SHD(G, x + 1, y, 7, 2); PF(G, x - 5, y - 9, 10, 9, p.pot || '#c86a3a'); PF(G, x - 5, y - 9, 10, 2, sh(p.pot || '#c86a3a', 1.2)); for (const [a, b, r_] of [[-4, -16, 5], [4, -17, 5], [0, -23, 5], [-5, -24, 3.5], [5, -25, 3.5]]) { PE(G, x + a, y + b, r_ + 1, r_, '#1e5a2e'); PE(G, x + a, y + b - 1, r_, r_ - 1, '#3a9a4a'); PE(G, x + a - 1, y + b - 2, r_ * .4, r_ * .3, '#6ad07a') } } },
  f_boxes2: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 2); PF(G, x - 8, y - 12, 16, 12, '#8a6a3a'); PF(G, x - 8, y - 12, 16, 2, '#b08a54'); PF(G, x - 1, y - 12, 2, 12, '#c8b088'); PF(G, x - 6, y - 22, 12, 10, '#9a7a48'); PF(G, x - 6, y - 22, 12, 2, '#c09a64'); PF(G, x - 1, y - 22, 2, 10, '#d8c098'); PF(G, x + 2, y - 18, 3, 2, '#2a2a30') } },
  f_bstack: { flat: 1, d(G, x, y) { ['#c83a3a', '#3a6ac8', '#e8c030', '#5ab86a'].forEach((c, k) => { PF(G, x - 6 + (k % 2), y - 4 - k * 3, 11 - k, 3, c); PF(G, x - 6 + (k % 2), y - 2 - k * 3, 11 - k, 1, '#f4ecd8') }) } },
  f_cushion: { flat: 1, d(G, x, y, P, s, p) { const c = p.c || '#e8c060'; PE(G, x, y - 6, 7, 5, OUT); PE(G, x, y - 6, 6, 4, c); PF(G, x - 1, y - 7, 2, 2, sh(c, .8)) } },
  f_pcdesk: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 16, 30, 16, OUT); PF(G, x - 14, y - 15, 28, 4, '#4a4a54'); PF(G, x - 14, y - 11, 5, 10, '#3a3a44'); PF(G, x + 9, y - 11, 5, 10, '#3a3a44'); PF(G, x - 8, y - 32, 16, 13, '#1a1a1e'); PF(G, x - 7, y - 31, 14, 10, '#3a6ac8'); PF(G, x - 5, y - 29, 6, 1, '#9ae8ff'); PF(G, x - 5, y - 27, 9, 1, '#9ae8ff'); PF(G, x - 1, y - 19, 2, 3, '#1a1a1e'); PF(G, x - 8, y - 17, 12, 2, '#2a2a30'); PF(G, x + 7, y - 18, 3, 3, '#c83a3a'); PF(G, x + 10, y - 26, 4, 10, '#2a2a30'); PF(G, x + 11, y - 22, 2, 1, '#3aff9a') } },
  f_shelflow: { w: 2, s: S2, d(G, x, y, P, s) { SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 22, 28, 22, OUT); PF(G, x - 13, y - 21, 26, 20, '#8a6a44'); for (let j = 0; j < 2; j++) { PF(G, x - 12, y - 19 + j * 9, 24, 7, '#4a2c18'); for (let i = 0; i < 7; i++) PF(G, x - 11 + i * 3.3, y - 18 + j * 9, 2, 6, ['#c83a3a', '#3a6ac8', '#e8c030', '#5ab86a', '#e8e0d0'][(i + j * 3 + (s * 9 | 0)) % 5]) } PE(G, x + 7, y - 25, 3, 3, '#5ab86a'); PF(G, x + 5, y - 23, 4, 2, '#a85a3a'); PF(G, x - 10, y - 26, 6, 4, '#e8e0d0') } },
  f_stool: { s: S1, d(G, x, y, P, s, p) { SHD(G, x + 1, y, 5, 2); PF(G, x - 4, y - 10, 1, 10, '#5a3a22'); PF(G, x + 3, y - 10, 1, 10, '#5a3a22'); PF(G, x - 3, y - 5, 6, 1, '#5a3a22'); PE(G, x, y - 11, 5, 2.5, OUT); PE(G, x, y - 12, 4.4, 2, p.c || '#8a6a44') } },
  // ---- kitchen pieces: one counter tile, with optional upper cabinets on the wall above
  f_ctr: { s: S1, d(G, x, y, P, s, p) {
    const top = p.top || '#f4f0e8', body = p.body || '#c8b898'; if (p.up) { const wy = WY(y); PF(G, x - 8, wy - 30, 16, 14, '#2a1a10'); PF(G, x - 7, wy - 29, 14, 12, body); PF(G, x - 1, wy - 29, 1, 12, sh(body, .75)); PF(G, x - 4, wy - 22, 1, 2, '#7a6a5a'); PF(G, x + 2, wy - 22, 1, 2, '#7a6a5a') }
    SHD(G, x + 1, y, 8, 2); PF(G, x - 8, y - 20, 16, 20, OUT); PF(G, x - 7, y - 15, 14, 14, body); PF(G, x - 8, y - 21, 16, 6, top); PF(G, x - 8, y - 21, 16, 1, '#fff'); PF(G, x - 6, y - 13, 12, 11, sh(body, 1.08)); PF(G, x - 1, y - 9, 3, 1, '#7a6a5a');
    const v = p.v; if (v == 'micro') { PF(G, x - 7, y - 30, 14, 10, '#3a3a40'); PF(G, x - 6, y - 29, 8, 7, '#1a2a30'); PF(G, x + 3, y - 28, 2, 2, '#3aff9a') } if (v == 'jars') { PF(G, x - 6, y - 27, 4, 7, '#c8e0e8'); PF(G, x - 6, y - 24, 4, 4, '#e8a040'); PF(G, x - 1, y - 26, 4, 6, '#c8e0e8'); PF(G, x - 1, y - 23, 4, 3, '#a85a3a'); PF(G, x + 4, y - 28, 3, 8, '#c83a3a') }
    if (v == 'toaster') { PF(G, x - 5, y - 27, 10, 7, '#c8ccd0'); PF(G, x - 3, y - 28, 2, 2, '#c89a50'); PF(G, x + 1, y - 28, 2, 2, '#c89a50') } if (v == 'sink') { PF(G, x - 6, y - 21, 12, 4, '#9aa8b4'); PF(G, x - 1, y - 27, 2, 6, '#a8b0b8'); PF(G, x - 1, y - 27, 4, 2, '#a8b0b8') }
    if (v == 'fruit') { PE(G, x, y - 22, 6, 2.5, '#8a6a44'); PE(G, x - 3, y - 24, 2.5, 2.5, '#e85a3a'); PE(G, x + 2, y - 25, 2.5, 2.5, '#ffb03a'); PE(G, x, y - 26, 2, 2, '#8ac83a') } if (v == 'cups') { for (let i = 0; i < 3; i++) { PF(G, x - 6 + i * 4, y - 25, 3, 4, '#f4f4f4'); PF(G, x - 6 + i * 4, y - 25, 3, 1, '#8a5a3a') } }
    if (v == 'tips') { PF(G, x - 3, y - 27, 6, 7, 'rgba(220,240,255,.85)'); PF(G, x - 2, y - 24, 4, 3, '#3a9a3a') } if (v == 'bell') { PE(G, x, y - 22, 4, 1.5, '#a8803a'); PE(G, x, y - 24, 3, 3, '#e8c030'); PF(G, x - 1, y - 28, 2, 2, '#e8c030') }
  } },
  f_oven: { s: S1, d(G, x, y) { PROPS.f_stove.d(G, x, y); PF(G, x - 5, y - 13, 10, 8, '#e8541a'); PF(G, x - 4, y - 12, 8, 2, '#ffb03a') } },
  f_sacks: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 2); for (const [a, b] of [[-4, 0], [4, 0], [0, -8]]) { PE(G, x + a, y - 7 + b, 6, 7, '#5a4a30'); PE(G, x + a, y - 7 + b, 5, 6, '#e8d8b0'); PF(G, x + a - 2, y - 8 + b, 4, 2, '#a8884a') } } },
  // ---- café
  f_sqtable: { w: 2, s: S2, d(G, x, y, P, s, p) { const cl = p.c || '#f8f4ec'; SHD(G, x + 2, y, 16, 3); for (const d of [-1, 1]) { PF(G, x + d * 14 - 3, y - 18, 6, 12, p.ch || '#e8a0b0'); PF(G, x + d * 14 - 3, y - 8, 6, 2, sh(p.ch || '#e8a0b0', .8)); PF(G, x + d * 14 - 3, y - 6, 1, 6, '#5a3a3a'); PF(G, x + d * 14 + 2, y - 6, 1, 6, '#5a3a3a') } PF(G, x - 8, y - 6, 1, 6, '#5a3a3a'); PF(G, x + 7, y - 6, 1, 6, '#5a3a3a'); PF(G, x - 9, y - 15, 18, 9, OUT); PF(G, x - 8, y - 15, 16, 8, cl); PF(G, x - 8, y - 15, 16, 1, '#fff'); PF(G, x - 2, y - 19, 3, 5, 'rgba(200,230,255,.8)'); PE(G, x - 1, y - 21, 2.5, 2, p.fl || '#ff5a8a'); PF(G, x + 3, y - 14, 3, 3, '#f4f4f4') } },
  f_hanglamp: { top: 1, d(G, x, y, P, s, p) { PF(G, x, y - 70, 1, 30, '#3a3a40'); PE(G, x, y - 38, 6, 4, p.c || '#e8a0b0'); PF(G, x - 6, y - 38, 12, 2, sh(p.c || '#e8a0b0', .8)); PE(G, x, y - 34, 2, 1.5, '#fff8d0'); PE(G, x, y - 30, 14, 9, 'rgba(255,240,180,.12)') } },
  f_easel: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 4, 2, 4, '#5a3a22'); PF(G, x + 4, y - 4, 2, 4, '#5a3a22'); PF(G, x - 7, y - 24, 14, 20, '#5a3a22'); PF(G, x - 6, y - 23, 12, 18, '#2a3a34'); PF(G, x - 4, y - 20, 8, 1, '#ff9ab8'); PF(G, x - 4, y - 16, 6, 1, '#e8f0e0'); PF(G, x - 4, y - 12, 7, 1, '#e8f0e0'); PE(G, x + 2, y - 8, 2, 1.5, '#ffd23c') } },
  f_piano: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 32, 30, 32, '#120a08'); PF(G, x - 14, y - 31, 28, 14, '#2a1a14'); PF(G, x - 14, y - 17, 28, 4, '#f4f4f4'); for (let i = 0; i < 9; i++) PF(G, x - 13 + i * 3, y - 17, 1, 2, '#120a08'); PF(G, x - 14, y - 13, 28, 12, '#2a1a14'); PF(G, x - 4, y - 28, 8, 6, '#f4ecd8'); PF(G, x - 12, y - 31, 4, 1, '#c8a040'); PF(G, x - 12, y - 4, 2, 4, '#c8a040'); PF(G, x + 10, y - 4, 2, 4, '#c8a040') } },
  f_shelfmugs: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); for (let j = 0; j < 2; j++) { PF(G, x - 14, wy - 12 - j * 11, 28, 2, '#8a6a44'); for (let i = 0; i < 5; i++) { PF(G, x - 12 + i * 5, wy - 18 - j * 11, 4, 5, ['#f4f4f4', '#ff9ab8', '#8ad0c4', '#ffe27a', '#f4f4f4'][(i + j) % 5]); PF(G, x - 8 + i * 5, wy - 17 - j * 11, 1, 2, '#c8c8c8') } } } },
  f_newsrack: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 22, 12, 22, '#5a3a22'); for (let i = 0; i < 3; i++) { PF(G, x - 5, y - 20 + i * 7, 10, 5, ['#f4f4f4', '#e8e0d0', '#ffe8a0'][i]); PF(G, x - 4, y - 19 + i * 7, 6, 1, '#3a3a40') } } },
  // ---- hotel
  f_gshelf: { w: 2, s: S2, d(G, x, y, P, s) { SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 40, 28, 40, OUT); PF(G, x - 13, y - 39, 26, 38, '#efe8dc'); for (let j = 0; j < 4; j++) { PF(G, x - 13, y - 30 + j * 9, 26, 2, '#c8a040'); for (let i = 0; i < 4; i++) { const k = (i + j * 3 + (s * 7 | 0)) % 5, cx = x - 9 + i * 6, cy = y - 33 + j * 9; if (k == 0) PE(G, cx, cy, 2.5, 3, '#9ad8f0'); else if (k == 1) PF(G, cx - 2, cy - 2, 4, 5, '#ff9ab8'); else if (k == 2) { PE(G, cx, cy, 2.5, 2.5, '#f8d8c8') } else if (k == 3) PF(G, cx - 2, cy - 3, 4, 6, '#3a9ac8'); else PE(G, cx, cy + 1, 2.5, 2, '#ffd23c') } } } },
  f_gtable: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 14, 28, 14, OUT); PF(G, x - 13, y - 13, 26, 4, '#efe8dc'); PF(G, x - 13, y - 9, 26, 8, '#2a6a74'); for (let i = 0; i < 5; i++) PF(G, x - 12 + i * 5, y - 17, 4, 4, ['#f8d8c8', '#9ad8f0', '#ffd23c', '#ff9ab8', '#e8e0d0'][i]); PF(G, x - 4, y - 22, 8, 6, '#3a9ac8'); PE(G, x, y - 19, 2, 2, '#fff') } },
  f_barcounter: { w: 3, s: S3, d(G, x, y) { SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 20, 48, 20, '#120a08'); PF(G, x - 23, y - 14, 46, 13, '#5a2a1a'); for (let i = 0; i < 6; i++) PF(G, x - 21 + i * 8, y - 12, 6, 9, '#6a3422'); PF(G, x - 24, y - 21, 48, 6, '#2a1a14'); PF(G, x - 24, y - 21, 48, 1, '#c8a040'); for (let i = 0; i < 3; i++) { PF(G, x - 16 + i * 14, y - 27, 3, 6, 'rgba(220,240,255,.8)'); PF(G, x - 16 + i * 14, y - 24, 3, 3, ['#ff9a3a', '#c83a5a', '#e8c030'][i]) } } },
  f_bottles: { flat: 1, w: 2, d(G, x, y) { const wy = WY(y); PF(G, x - 14, wy - 30, 28, 26, '#3a2014'); for (let j = 0; j < 3; j++) { PF(G, x - 14, wy - 12 - j * 8, 28, 2, '#c8a040'); for (let i = 0; i < 6; i++) { const c = ['#3a8a4a', '#8a2a1a', '#c8a040', '#2a4a8a', '#e8e0d0', '#6a2a6a'][(i + j * 2) % 6]; PF(G, x - 12 + i * 4.5, wy - 18 - j * 8, 3, 6, c); PF(G, x - 11 + i * 4.5, wy - 20 - j * 8, 1, 2, c) } } } },
  f_brochure: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 26, 12, 26, '#c8a040'); PF(G, x - 5, y - 25, 10, 24, '#efe8dc'); for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) PF(G, x - 4 + i * 5, y - 23 + j * 7, 4, 5, ['#3a9ac8', '#ff9ab8', '#ffd23c', '#5ab86a', '#e85a3a', '#9ad8f0'][i + j * 2]) } },
  // ---- capsule hotel
  f_capwall: { w: 2, s: [0, -1, 2, 2], d(G, x, y, P, s) { SHD(G, x + 2, y, 16, 3); PF(G, x - 16, y - 46, 32, 46, '#0b1640'); for (let j = 0; j < 2; j++) { const yy = y - 44 + j * 22; PF(G, x - 15, yy, 30, 20, '#1a2a5e'); PF(G, x - 13, yy + 3, 26, 14, '#0a0c1e'); PF(G, x - 11, yy + 5, 22, 10, j ? '#3a3a5a' : '#2a2a48'); PF(G, x - 11, yy + 11, 22, 4, '#e8e8f4'); PF(G, x - 15, yy, 30, 1, NC[((s * 7 + j) % 4) | 0]); PF(G, x + 9, yy + 6, 2, 2, '#3aff9a'); PF(G, x - 14, yy + 3, 1, 14, '#2ee6e6') } PF(G, x + 14, y - 44, 2, 44, '#c8c8d0'); for (let i = 0; i < 6; i++) PF(G, x + 13, y - 40 + i * 7, 4, 1, '#c8c8d0') } },
  f_sinkrow: { w: 2, s: S2, d(G, x, y) { const wy = WY(y); PF(G, x - 15, wy - 26, 30, 14, '#a8b0b8'); PF(G, x - 14, wy - 25, 13, 12, '#c8e4f0'); PF(G, x + 1, wy - 25, 13, 12, '#c8e4f0'); PF(G, x - 13, wy - 24, 3, 10, '#e8f6fc'); SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 14, 30, 14, '#2a2a30'); PF(G, x - 15, y - 16, 30, 4, '#e8eaec'); PE(G, x - 7, y - 15, 4, 1.5, '#9aa8b4'); PE(G, x + 7, y - 15, 4, 1.5, '#9aa8b4'); PF(G, x - 8, y - 20, 2, 4, '#a8b0b8'); PF(G, x + 6, y - 20, 2, 4, '#a8b0b8') } },
  f_bench2: { w: 2, s: S2, d(G, x, y, P, s, p) { const c = p.c || '#8a6a44'; SHD(G, x + 2, y, 15, 3); PF(G, x - 14, y - 5, 2, 5, '#2a2a30'); PF(G, x + 12, y - 5, 2, 5, '#2a2a30'); PF(G, x - 15, y - 10, 30, 5, OUT); PF(G, x - 14, y - 10, 28, 4, c); PF(G, x - 14, y - 10, 28, 1, sh(c, 1.3)) } },
  // ---- cabin / hut
  f_radio: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 7, 2); PF(G, x - 7, y - 14, 14, 14, '#5a3a22'); PF(G, x - 6, y - 13, 12, 12, '#7a5232'); PF(G, x - 6, y - 22, 12, 8, '#3a3a30'); PF(G, x - 5, y - 21, 6, 4, '#c8a060'); PE(G, x + 3, y - 18, 2, 2, '#e8e0d0'); PF(G, x + 4, y - 30, 1, 8, '#a8a8b0') } },
  f_lifering: { flat: 1, d(G, x, y) { const wy = WY(y); PE(G, x, wy - 17, 8, 8, '#f4f4f4'); for (let a = 0; a < 4; a++) { const t = a * Math.PI / 2 + .4; PE(G, x + Math.cos(t) * 6, wy - 17 + Math.sin(t) * 6, 2.5, 2.5, '#e83a3a') } PE(G, x, wy - 17, 4, 4, '#7a5232') } },
  f_rope: { flat: 1, d(G, x, y) { PE(G, x, y - 6, 8, 5, '#a88858'); PE(G, x, y - 6, 6, 3.6, '#c8a878'); PE(G, x, y - 6, 4, 2.4, '#a88858'); PE(G, x, y - 6, 2, 1.2, '#7a6038') } },
  f_surf: { s: S1, d(G, x, y, P, s, p) { const c = p.c || '#3a9ac8'; SHD(G, x + 1, y, 5, 2); PE(G, x, y - 22, 5, 21, OUT); PE(G, x, y - 22, 4, 20, c); PF(G, x - 1, y - 40, 2, 36, '#fff'); PF(G, x - 3, y - 14, 6, 2, '#ffd23c') } },
  f_boots: { flat: 1, d(G, x, y) { PF(G, x - 7, y - 10, 5, 8, '#3a5a2a'); PF(G, x - 8, y - 4, 7, 3, '#3a5a2a'); PF(G, x + 2, y - 10, 5, 8, '#3a5a2a'); PF(G, x + 1, y - 4, 7, 3, '#3a5a2a'); PF(G, x - 7, y - 10, 5, 1, '#5a7a4a'); PF(G, x + 2, y - 10, 5, 1, '#5a7a4a') } },
  f_star: { flat: 1, d(G, x, y, P, s) { const c = s < .5 ? '#ff8a5a' : '#ffb070'; for (let a = 0; a < 5; a++) { const t = -Math.PI / 2 + a * Math.PI * 2 / 5; for (let k = 0; k < 5; k++) PF(G, x + Math.cos(t) * k - 1, y - 7 + Math.sin(t) * k - 1, 2, 2, c) } } },
  f_crate2: { s: S1, d(G, x, y, P, s, p) { SHD(G, x + 1, y, 8, 2); PF(G, x - 8, y - 14, 16, 14, '#5a3a22'); PF(G, x - 7, y - 13, 14, 12, '#9a7248'); PF(G, x - 7, y - 13, 14, 2, '#b08a5a'); PF(G, x - 7, y - 8, 14, 1, '#5a3a22'); if (p.v) { PE(G, x - 3, y - 15, 3, 2.5, p.v); PE(G, x + 2, y - 16, 3, 2.5, p.v) } } },
  // ---- ramen
  f_maneki: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 10, 12, 10, '#5a2a14'); PE(G, x, y - 16, 5, 6, '#f4f4f4'); PE(G, x, y - 23, 4.5, 4, '#f4f4f4'); PF(G, x - 4, y - 28, 2, 3, '#f4f4f4'); PF(G, x + 2, y - 28, 2, 3, '#f4f4f4'); PF(G, x + 4, y - 26, 2, 6, '#f4f4f4'); PF(G, x - 2, y - 24, 1, 1, '#1a1a1e'); PF(G, x + 1, y - 24, 1, 1, '#1a1a1e'); PF(G, x - 3, y - 19, 6, 2, '#c83a3a'); PE(G, x, y - 15, 2, 2, '#e8c030') } },
  f_cushtbl: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16, 3); for (const d of [-1, 1]) { PE(G, x + d * 13, y - 5, 5, 3.5, '#120604'); PE(G, x + d * 13, y - 6, 4.4, 3, '#c83a2a') } PF(G, x - 9, y - 9, 18, 9, '#120604'); PF(G, x - 8, y - 12, 16, 6, '#7a3a20'); PF(G, x - 8, y - 12, 16, 1, '#a85a30'); PE(G, x - 3, y - 13, 3, 1.5, '#f4f4f4'); PE(G, x - 3, y - 13, 2, 1, '#e8b060'); PF(G, x + 2, y - 15, 1, 5, '#c8a060'); PF(G, x + 4, y - 15, 1, 5, '#c8a060') } },
  f_umbstand: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 5, 2); PF(G, x - 4, y - 12, 8, 12, '#3a3a40'); PF(G, x - 3, y - 24, 1, 14, '#c83a3a'); PF(G, x + 1, y - 22, 1, 12, '#3a6ac8'); PE(G, x - 3, y - 25, 2, 1.5, '#c83a3a'); PE(G, x + 1, y - 23, 2, 1.5, '#3a6ac8') } },
  // ---- arcade
  f_cab: { s: S1, d(G, x, y, P, s, p) { const c = p.c || NC[((x * 3 + y) >> 4) % 4]; SHD(G, x + 1, y, 8, 3); PF(G, x - 8, y - 34, 16, 34, '#0b0a24'); PF(G, x - 7, y - 33, 14, 5, c); PF(G, x - 6, y - 27, 12, 10, '#14104a'); PF(G, x - 5, y - 26, 4, 2, c); PF(G, x, y - 22, 4, 3, '#ffd23c'); PF(G, x - 7, y - 16, 14, 4, '#2a2a4a'); PE(G, x - 3, y - 15, 1.5, 1.5, '#ff3a3a'); PF(G, x + 1, y - 15, 2, 1, '#2ee6e6'); PF(G, x - 7, y - 11, 14, 10, sh(c, .5)); PF(G, x - 2, y - 8, 4, 2, '#ffd23c') } },
  f_racer: { w: 2, s: S2, d(G, x, y) { SHD(G, x + 2, y, 16, 3); PF(G, x - 15, y - 36, 30, 22, '#0b0a24'); PF(G, x - 13, y - 34, 26, 14, '#1a3070'); PF(G, x - 11, y - 28, 22, 2, '#8a8aa8'); PF(G, x - 2, y - 32, 4, 4, '#ff5a8a'); PF(G, x - 15, y - 14, 30, 14, '#2a2a4a'); PE(G, x, y - 16, 6, 3, '#1a1a1e'); PE(G, x, y - 16, 4, 2, '#3a3a40'); PF(G, x - 12, y - 10, 8, 10, '#e83a3a'); PF(G, x + 4, y - 10, 8, 10, '#e83a3a'); PF(G, x - 15, y - 37, 30, 2, '#2ee6e6') } },
  f_prizes: { w: 3, s: S3, d(G, x, y) { const wy = WY(y); for (let j = 0; j < 2; j++) { PF(G, x - 24, wy - 14 - j * 12, 48, 2, '#c8a040'); for (let i = 0; i < 8; i++) PE(G, x - 20 + i * 6, wy - 18 - j * 12, 2.5, 3, ['#ffd23c', '#7ad0ff', '#fff', '#8cff5a', '#ff9ab8', '#c89aff', '#e85a3a', '#f4f4f4'][(i + j * 3) % 8]) } SHD(G, x + 2, y, 24, 3); PF(G, x - 24, y - 20, 48, 20, '#0b0a24'); PF(G, x - 23, y - 19, 46, 9, 'rgba(160,220,255,.4)'); for (let i = 0; i < 7; i++) PE(G, x - 19 + i * 6.5, y - 14, 2, 2, ['#ff5a8a', '#ffd23c', '#2ee6e6', '#8cff5a', '#fff', '#c89aff', '#ff9a3a'][i]); PF(G, x - 23, y - 10, 46, 9, '#e83a7a'); PF(G, x - 24, y - 21, 48, 2, '#2ee6e6') } },
  f_ticket: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 6, 2); PF(G, x - 6, y - 30, 12, 30, '#0b0a24'); PF(G, x - 5, y - 29, 10, 28, '#ffd23c'); PF(G, x - 4, y - 26, 8, 6, '#1a1a4a'); PF(G, x - 3, y - 25, 4, 1, '#ff5a8a'); PF(G, x - 2, y - 14, 4, 6, '#ff5a8a'); PF(G, x - 1, y - 8, 2, 4, '#fff') } },
  f_pinball: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 8, 3); PF(G, x - 8, y - 36, 16, 12, '#0b0a24'); PF(G, x - 7, y - 35, 14, 10, '#c89aff'); PF(G, x - 4, y - 33, 8, 2, '#fff'); PF(G, x - 8, y - 24, 16, 18, '#0b0a24'); PF(G, x - 7, y - 23, 14, 16, '#2a1a5a'); PE(G, x - 3, y - 18, 2, 2, '#ff5a8a'); PE(G, x + 3, y - 15, 2, 2, '#2ee6e6'); PF(G, x - 7, y - 8, 2, 8, '#2a2a30'); PF(G, x + 5, y - 8, 2, 8, '#2a2a30') } },
  f_gumball: { s: S1, d(G, x, y) { SHD(G, x + 1, y, 5, 2); PF(G, x - 1, y - 12, 2, 12, '#c83a3a'); PF(G, x - 4, y - 2, 8, 2, '#c83a3a'); PF(G, x - 4, y - 16, 8, 5, '#c83a3a'); PE(G, x, y - 22, 6, 6, 'rgba(220,240,255,.8)'); for (let i = 0; i < 6; i++) PE(G, x - 3 + (i % 3) * 3, y - 23 + (i >> 1 & 1) * 3, 1.3, 1.3, NC[i % 4]) } }
});

// ---- the grid builder
function ROOM(o) {
  const g = o.grid, h = g.length, w = g[0].length, feat = [], ents = [];
  g.forEach((row, y) => { if (row.length != w) throw new Error('ROOM ' + o.id + ' row ' + y + ' has ' + row.length + ' (want ' + w + ')') });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = g[y][x]; if (c == '#') { if (x >= 2 && y >= 2 && x < w - 2 && y < h - 2) feat.push({ k: 'wall', x, y, w: 1, h: 1 }); continue } if (c == '.') continue;
    const L = o.leg[c]; if (!L) throw new Error('ROOM ' + o.id + ': no legend for ' + c);
    for (const it of L) { if (typeof it == 'function') ents.push(it(x, y)); else if (typeof it == 'string') feat.push(p(it, x, y)); else feat.push(p(it[0], x, y, { ...(it[1] || {}) })) } }
  const isW = (x, y) => y < 0 || x < 0 || x >= w || g[y][x] == '#';
  for (const [zx, zy, zw, zh, fl, wp, fc] of o.zones || []) for (let y = zy; y < zy + zh; y++) for (let x = zx; x < zx + zw; x++) { if (isW(x, y)) continue;
    if (fl) feat.unshift(p('f_fz', x, y, { t: fl, c: fc }));
    if (wp && isW(x, y - 1)) { let n = 0; while (y - 1 - n >= 0 && isW(x, y - 1 - n)) n++; feat.unshift(p('f_wz', x, y, { t: wp, hh: (n >= 3 || y - n <= 0) ? 32 : 16 })) } }
  return { w, h, feat: feat.concat(o.feat || []), ents: ents.concat(o.ents || []) };
}
const I_ = (kind, lines, o = {}) => (x, y) => obj(kind, x, y, lines, { inv: 1, ...o });   // invisible look-at object on a legend cell

// ==================== Uku's house: band room up top, bathroom + bedroom off the hall, living room + kitchen downstairs ====================
(() => {
  const R = ROOM({ id: 'w_uhouse', grid: [
    '##########################',
    '##########################',
    '#####pW.v.PA.D..m7L.p#####',
    '#####.S...............####'.slice(0, 21) + '#####',
    '#####b..R..........b.#####'.slice(0, 21) + '#####',
    '#####r..............r#####',
    '#####K............o..#####',
    '#####x.c.........t..x#####',
    '###########..#############',
    '###########..#############',
    '###########..#############',
    '##T.MO.N.##..##w.gP..n7p##',
    '##.a.....##..##...zB..d.##',
    '##u..............q..k....##'.slice(0, 24) + '##',
    '##e.............y........##'.slice(0, 24) + '##',
    '##......p##..##H..r.x.op##',
    '###########..#############',
    '###########..#############',
    '###########..#############',
    '##h.F.QC.p...ZX..V213W.p##',
    '##l....5..............e##'.slice(0, 23) + '.##',
    '##...............i......##'.slice(0, 24) + '##',
    '##rGI...........s6..E...##'.slice(0, 24) + '##',
    '##..............s4......##',
    '##l....................x##',
    '##.U...o...............p##',
    '##p....................t##',
    '##x...c................p##',
    '##########################',
    '##########################'],
    leg: { p: ['f_plant2'], W: [['f_window2', { curtain: '#3a68c8' }]], v: ['f_vinylw'], P: [['f_bposter', { seed: .2, t: 1 }]], '7': [['f_bposter', { seed: .8 }]], A: ['f_amp'], D: ['f_drums'], m: ['f_mic'], L: [['f_shelfw', { seed: .3 }]],
      S: [['f_lights', { n: 14 }]], b: [['f_beanbag', { c: '#e85a7a' }]], R: [['f_rugp', { w: 6, h: 3, c: '#3a2a6a', c2: '#c8a8ff' }]], r: ['f_records'], K: ['f_keys'], o: ['flamp'], x: ['f_boxes2'], t: ['f_bstack'], c: [['f_cushion', { c: '#5ae8ff' }]],
      T: ['f_tub', I_('tub', ['|The bath is full. The water is still warm. There are four rubber ducks in a row on the edge.'], { quiet: 1 })], M: [['f_towel', { c: '#e85a5a' }]], O: ['f_toilet'], N: ['f_sinkm', I_('mirror', ['|Four toothbrushes in a cup. One of them is dry.'], { quiet: 1 })], a: ['f_bathmat'], u: ['f_basket'], e: ['f_bin'],
      w: [['f_wardrobe', { c: '#5a7a9a' }]], g: ['f_guitar', I_('guitar', ['|Uku\'s guitar. A string is missing. He said he\'d replace it "after the summer."', 'Hitori:sad|...It\'s still summer.'], { quiet: 1 })],
      B: [['f_bed2', { c: '#2a8a8a' }], I_('cbedi', ['|The bed is made. There is a dent in the pillow, but it is cold.'], { quiet: 1 })], n: ['f_nstand'], d: ['dresser', I_('drawers', ['|A drawer full of identical white bands, rolled up neatly.', 'Hitori:neutral|...Why does he have so many of these?'], { lore: 'bands' })],
      q: [['f_rrug', { c: '#3a4a6a' }]], k: ['f_desk2', I_('desk', ['|A photo in a frame: friends on a couch. There is an empty space at one end, as if someone were meant to stand there.', 'Hitori:neutral|...Who is missing from this picture?'], { quiet: 1, lore: 'photo' })], z: ['f_slip'], y: ['f_laundry'], '5': ['f_ochair'],
      H: ['f_tapes', I_('shelf', ['|Rows of mix tapes, labelled in tiny handwriting. One slot is empty.'], { quiet: 1 })],
      h: [['f_bookcase', { seed: .4 }]], F: ['f_painting'], Q: ['f_pinboard'], C: ['f_pcdesk', I_('pc', ['|A computer. The screensaver is a photo of the hollow tree, slowly zooming in, forever.'], { quiet: 1 })], l: ['f_lamp'],
      Z: ['f_fridge', I_('fridge', ['|A sticky note on the fridge: "Back by dusk. Don\'t wait up. -U"', 'Hitori:neutral|He always writes the same note.'], { set: 'uku_note' })], X: ['f_counter'], V: ['f_stove', I_('stove', ['|A pot of soup, gone cold. Four bowls set out beside it.'], { quiet: 1 })],
      '2': [['f_ctr', { v: 'micro', up: 1 }]], '1': [['f_ctr', { up: 1 }]], '3': [['f_ctr', { v: 'jars', up: 1 }]], i: [['f_ctr', { v: 'fruit' }]], '6': [['f_ctr', { v: 'sink' }]], '4': [['f_ctr', { v: 'toaster' }]], s: ['f_stool'],
      E: [['f_dtable', { c: '#e8a0a8' }], I_('table', ['|The table is set for two. Somebody ate. Somebody didn\'t.'], { quiet: 1 })], G: [['f_rugs', { w: 5, h: 3 }]], I: ['f_tvset', I_('tv', ['|The TV shows static. Under the static, very faintly, a game paused on the second player\'s turn.'], { quiet: 1 })], U: [['f_couch', { c: '#5a7a9a' }]] },
    zones: [[2, 11, 7, 5, 'btile', 'tile'], [13, 19, 11, 9, 'check', 'cream'], [2, 19, 10, 9, null, 'green'], [15, 11, 9, 5, 'carpet', 'blue', '#4a6a8a'], [5, 2, 16, 6, 'dboard', 'purple'], [11, 8, 2, 11, null, 'cream']] });
  A('w_uhouse', { nm: 'Uku\'s House', pal: 'uku', interior: true, floor: 'wood', wall: 'wainscot', w: R.w, h: R.h, mus: 'forest', feat: R.feat, exits: [ex('down', 11, 12, 'w_garden')], ents: R.ents });
})();

PROPS.f_bowls = { flat: 1, d(G, x, y) { PE(G, x - 4, y - 5, 4, 2.5, '#c83a3a'); PE(G, x - 4, y - 6, 3, 1.5, '#f4f4f4'); PE(G, x + 4, y - 5, 4, 2.5, '#3a6ac8'); PE(G, x + 4, y - 6, 3, 1.5, '#c8a060'); PF(G, x + 7, y - 9, 4, 2, '#ff8a2a') } };
const DOTS = n => '.'.repeat(n), WALLS = n => '#'.repeat(n);

// ==================== Mochi's cottage: sitting room by the fire, a kitchenette, and Mochi's little bedroom ====================
(() => {
  const R = ROOM({ id: 'w_cottage', grid: [
    WALLS(20), WALLS(20),
    '##' + 'h.W.F..L.Qp' + '#' + '1V3Z' + '##',
    '##' + '..A...A....' + '#' + '....' + '##',
    '##' + '.T..c.....o' + '#' + '..e.' + '##',
    '##' + '..R.....e.p' + '.' + 'b...' + '##',
    '##' + 'f.......y..' + '.' + '....' + '##',
    '##' + DOTS(11) + '#' + '...x' + '##',
    '##' + 'H.........k' + WALLS(5) + '##',
    '##' + 'u....x.....' + WALLS(5) + '##',
    '##' + '..E......p.' + WALLS(5) + '##',
    '##' + DOTS(11) + '.' + 'd..n' + '##',
    '##' + 'p..........' + '.' + '.B..' + '##',
    '##' + '.k........p' + '#' + '...p' + '##',
    WALLS(20), WALLS(20)],
    leg: { h: [['f_bookcase', { seed: .4 }]], W: [['f_window2', { curtain: '#e8a0a8' }]], F: ['fireplace', I_('fireplace', ['|The fire is warm. It has been burning for a long time without any wood.'], { quiet: 1 })], L: [['f_shelfw', { seed: .7 }]], Q: ['f_wclock2'], p: ['f_plant2'],
      '1': [['f_ctr', { up: 1, body: '#e8c8a8' }]], V: ['f_stove'], '3': [['f_ctr', { v: 'jars', up: 1, body: '#e8c8a8' }]], Z: [['f_fridge', { c: '#f4e0e8' }]], A: [['f_armchair', { c: '#c86a4a' }]],
      T: ['f_cattree', I_('cattree', ['|A scratching tower, shredded to ribbons at exactly the height of a cat standing on its toes.'], { quiet: 1 })], c: [['f_catbed', { c: '#7a8ac8' }]], o: ['flamp'], e: ['f_teatable'], R: [['f_rugp', { w: 5, h: 3, c: '#a84a6a', c2: '#f8d8e0' }]],
      b: ['f_bowls'], f: ['f_fishbowl', I_('fishbowl', ['|A goldfish in a bowl. Mochi has never once looked at it. Mochi is always almost looking at it.'], { quiet: 1 })], y: ['f_yarn'], x: ['f_sacks'], H: [['f_bookcase', { seed: .9 }]], k: [['f_cushion', { c: '#c8a8ff' }]], u: ['f_basket'],
      E: [['f_dtable', { c: '#a8d0a0' }]], d: ['dresser'], n: ['f_lamp'], B: [['f_bed2', { c: '#9a8ac8' }], I_('bed', ['|A tiny quilt on a big bed. It is covered in grey fur in the exact shape of a cat.'], { quiet: 1 })] },
    zones: [[2, 2, 11, 12, null, 'peach'], [14, 2, 4, 6, 'check', 'tile'], [14, 11, 4, 3, 'carpet', 'blue', '#7a6a9a']],
    ents: [npc('mochi', 7, 7)] });
  A('w_cottage', { nm: 'Mochi\'s Cottage', pal: 'mochi', interior: true, floor: 'wood', wall: 'stripe', w: R.w, h: R.h, mus: 'forest', feat: R.feat, exits: [ex('down', 9, 10, 'w_meadow')], ents: R.ents });
})();

// ==================== the lookout cabin: bunks, stove, radio, charts and a storeroom of rope and crates ====================
(() => {
  const R = ROOM({ id: 'b_cabin', grid: [
    WALLS(18), WALLS(18),
    '##' + '..W.M.R.i.' + '#' + 'qxc' + '##',
    '##' + 'Y...V..C..' + '#' + '...' + '##',
    '##' + DOTS(10) + '#' + 'x..' + '##',
    '##' + 'D..T......' + '.' + '...' + '##',
    '##' + '....h.....' + '.' + 'c..' + '##',
    '##' + 'Y.........' + '#' + '...' + '##',
    '##' + '.....G....' + '#' + '..x' + '##',
    '##' + 'k.........' + '#' + 'c..' + '##',
    '##' + 'q.......po' + '#' + 'x.q' + '##',
    WALLS(18), WALLS(18)],
    leg: { W: [['f_window2', { night: 1, curtain: '#3a68c8' }]], M: ['f_map', I_('map', ['|A sea chart. Someone has drawn a little island where there isn\'t one, and written "US" on it.'], { quiet: 1 })], R: ['f_rod', I_('rod', ['|A fishing rod. The line is tied in a bow, like a present.'], { quiet: 1 })], i: ['f_lifering'],
      q: ['barrel'], x: ['f_crate2'], c: ['f_rope'], Y: [['f_bunk', { c: '#3a6ac8', c2: '#c83a3a' }], I_('bunk', [], { ev: 'sleep' })], V: ['f_potbelly'], C: ['f_coatrack'], D: ['f_radio', I_('radio', ['|The radio hisses. Between the hiss, a voice reads a list of names. It stops just before yours.'], { quiet: 1 })],
      T: ['f_ltable', I_('table', ['|A logbook on the table. Every entry says the same thing: "Clear skies. Calm sea. Nobody came."'], { quiet: 1 })], h: ['f_hlantern'], G: [['f_rugs', { w: 4, h: 2, cs: ['#a83a3a', '#e8c060', '#3a5a8a'] }]], k: ['f_boxes2'], p: ['f_plant2'], o: ['f_boots'] },
    zones: [[13, 2, 3, 9, 'dboard', 'wood']], feat: [p('f_stool', 4, 6), p('f_stool', 9, 6), p('f_bstack', 10, 9), p('f_laundry', 4, 9), p('f_bin', 11, 4)] });
  A('b_cabin', { nm: 'Lookout Cabin', pal: 'cabin', interior: true, floor: 'wood', wall: 'log', w: R.w, h: R.h, mus: 'beach', feat: R.feat, exits: [ex('down', 8, 9, 'b_path')], ents: R.ents });
})();

// ==================== Seashell Café: counter and cakes, tables everywhere, a kitchen in the back ====================
(() => {
  const R = ROOM({ id: 'b_cafe', grid: [
    WALLS(24), WALLS(24),
    '##' + 'p.E.J.M.31W.qp' + '#' + 'ZO61k' + '##',
    '##' + DOTS(14) + '#' + DOTS(5) + '##',
    '##' + DOTS(14) + '.' + DOTS(5) + '##',
    '##' + '..K..G.444....' + '#' + '..e..' + '##',
    '##' + '...........z..' + '#' + 'u...x' + '##',
    '##' + 'T...T...T...p.' + WALLS(6) + '##',
    '##' + '.h...h...h....' + WALLS(6) + '##',
    '##' + '..S...S...S...' + '.T..T.' + '##',
    '##' + 'p.............' + '.h..h.' + '##',
    '##' + 'T...T...T.....' + DOTS(6) + '##',
    '##' + DOTS(14) + 'S...S.' + '##',
    '##' + 'p....N.....Y.p' + 'p....p' + '##',
    WALLS(24), WALLS(24)],
    leg: { p: ['f_plant2'], E: ['f_espresso'], J: ['f_shelfmugs'], M: ['f_menuboard', I_('menuboard', ['|The chalkboard menu. At the very bottom, smaller: "Today\'s special: one dinner."'], { quiet: 1 })], '3': [['f_ctr', { v: 'cups', up: 1, body: '#8ad0c4' }]], '1': [['f_ctr', { up: 1, body: '#8ad0c4' }]],
      W: [['f_window2', { curtain: '#ff9ab8' }]], q: ['f_cakestand'], Z: ['f_fridge'], O: ['f_oven'], '6': [['f_ctr', { v: 'sink' }]], k: ['f_sacks'], K: ['f_cakecase', I_('cakes', ['|Cakes in the glass case. Every one has a slice missing.'], { quiet: 1 })],
      G: ['f_register', I_('register', [], { ev: 'shop', shop: 'cafe', say: ['|A bell on the counter. You ring it. A voice from the back:', '|"Sit anywhere. Nobody ever does. What can I get you?"'] })], '4': [['f_ctr', { v: 'cups', body: '#8ad0c4' }]], e: ['f_bin'], z: ['f_easel'], u: [['f_crate2', { v: '#ffb03a' }]], x: ['f_bin'],
      T: ['f_rtable'], h: [['f_hanglamp', { c: '#8ad0c4' }]], S: [['f_sqtable', { c: '#fff0f4', ch: '#8ad0c4', fl: '#ffd23c' }]], N: ['f_newsrack'], Y: ['f_piano', I_('piano', ['|A piano. Someone left the lid open on a song with four hands.'], { quiet: 1 })] },
    zones: [[2, 2, 14, 12, null, 'pink'], [16, 9, 6, 5, null, 'pink'], [17, 2, 5, 5, 'btile', 'tile']],
    ents: [obj('table', 3, 7, ['|Two cups of tea, still steaming. Nobody is sitting here.'], { inv: 1, quiet: 1 })] });
  A('b_cafe', { nm: 'Seashell Café', pal: 'cafe', interior: true, floor: 'checker', wall: 'wainscot', w: R.w, h: R.h, mus: 'beach', feat: R.feat, exits: [ex('down', 11, 12, 'b_boardwalk')], ents: R.ents });
})();

// ==================== Grand Resort lobby: gift shop, reception, lounge bar, and the big lobby below ====================
(() => {
  const R = ROOM({ id: 'b_hotel', grid: [
    WALLS(32), WALLS(32),
    '##' + 'G.G.G.p' + '#' + 'pK.Y....F.L.p' + '#' + 'w.w..p' + '##',
    '##' + DOTS(7) + '#' + DOTS(13) + '#' + DOTS(6) + '##',
    '##' + '..T....' + '#' + 'D.......E....' + '#' + 'C.....' + '##',
    '##' + '...u...' + '#' + DOTS(13) + '#' + 's.s.s.' + '##',
    '##' + 'k.....p' + '#' + 'b...........b' + '#' + 'o...o.' + '##',
    '##' + '###.###' + '#' + DOTS(13) + '#' + '##.###' + '##',
    '##' + '###.###' + '#' + '.O........O..' + '#' + '##.###' + '##',
    '##' + '###.###' + '#' + DOTS(13) + '#' + '##.###' + '##',
    '##' + 'pF..W..q' + DOTS(12) + 'F..W..mp' + '##',
    '##' + '......h' + DOTS(14) + 'h.N....' + '##',
    '##' + '.U' + DOTS(16) + 'U' + DOTS(9) + '##',
    '##' + '..c' + DOTS(16) + 'c' + DOTS(8) + '##',
    '##' + 'p' + DOTS(24) + 'L..' + '##',
    '##' + '.V' + DOTS(16) + 'V' + DOTS(9) + '##',
    '##' + '......p' + DOTS(14) + 'p......' + '##',
    '##' + 'p' + DOTS(24) + 'X.p' + '##',
    WALLS(32), WALLS(32)],
    leg: { W: [['f_window2', { curtain: '#2a6a74' }]], G: ['f_gshelf', I_('gifts', ['|Snow globes, keychains, postcards. Every postcard says "WISH YOU WERE HERE" and nothing else.'], { quiet: 1 })], p: [['f_bigplant']], K: ['f_keyrack'], Y: ['f_elev', I_('elevator', ['|The elevator buttons go 1, 2, 3, 4, and then, much further down, 6.'], { quiet: 1 })], F: ['f_painting'], L: ['f_luggage', I_('luggage', ['|A luggage cart. Four bags, four name tags. The tags are blank.'], { quiet: 1 })],
      w: ['f_bottles'], T: ['f_gtable'], D: ['f_rdesk', I_('counter', ['|The front desk. A bell, a pen, and a guest book. The last entry is today\'s date, signed with an X.'])], E: [['f_rdesk', { lf: 1 }], (x, y) => obj('counter', x + 2, y, [], { ev: 'lostfound', inv: 1 })],
      C: ['f_barcounter', I_('bar', ['|The lounge bar. Four glasses of something orange, untouched, ice long melted.'], { quiet: 1 })], u: ['f_brochure'], s: ['f_stool'], k: ['f_bin'], b: ['f_brochure'], o: [['f_rtable', { c: '#efe8dc' }]], O: ['f_column'],
      q: ['f_wclock2', (x, y) => obj('clock', x, y, ['|The lobby clock says 6:00. Same as everywhere.'], { lore: 'clocks', inv: 1 })], m: ['f_mirrorw', (x, y) => obj('mirror', x, y, ['|A long mirror. In it, the lobby is slightly emptier than in real life.'], { lore: 'mirror', inv: 1 })],
      h: ['f_chand'], N: ['f_piano'], U: [['f_lsofa', { c: '#2a6a74' }], I_('sofa', ['Hitori:neutral|It\'s the softest couch I\'ve ever sat on. I could sleep for a week.'])], c: ['f_ctable'], V: [['f_couch', { c: '#8a1a2a' }]], X: [(x, y) => chest('c:b_hotel', x, y, { money: 30 })] },
    zones: [[2, 2, 7, 5, 'carpet', 'teal', '#3a6aa8'], [24, 2, 6, 5, 'dboard', 'wood'], [10, 2, 13, 8, null, 'cream'], [2, 10, 28, 8, null, 'cream']],
    feat: [{ k: 'ground', x: 15, y: 2, w: 2, h: 18, g: 11 }, p('f_rugp', 2, 11, { w: 6, h: 6, c: '#2a6a74', c2: '#e8c040' }), p('f_rugp', 19, 11, { w: 6, h: 6, c: '#7a1a2a', c2: '#e8c040' }), p('f_bench2', 10, 17), p('f_bench2', 19, 17), p('f_brochure', 13, 12), p('f_bigplant', 13, 14), p('f_bigplant', 18, 14)] });
  A('b_hotel', { nm: 'Grand Resort: Lobby', pal: 'lobby', interior: true, floor: 'marble', wall: 'wainscot', w: R.w, h: R.h, mus: 'beach', feat: R.feat, exits: [ex('down', 15, 16, 'b_plaza'), ex('up', 15, 16, 'b_roof')], ents: R.ents });
})();

// ==================== the Turtle Hut ====================
(() => {
  const R = ROOM({ id: 'b_hut', grid: [
    WALLS(18), WALLS(18),
    '##' + '...W.N..i.S..p' + '##',
    '##' + 'H.........K...' + '##',
    '##' + '........l....u' + '##',
    '##' + 'c..........t..' + '##',
    '##' + '.....M........' + '##',
    '##' + 'b.............' + '##',
    '##' + 'd...........s.' + '##',
    '##' + 'o.............' + '##',
    '##' + 'x..o.......o.p' + '##',
    WALLS(18), WALLS(18)],
    leg: { W: [['f_window2', { curtain: '#e8541a' }]], N: ['f_netw'], i: ['f_lifering'], S: ['f_shellwall'], p: ['f_plant2'], H: ['f_hammock', I_('hammock', ['|A hammock, still swaying. Nobody is in it. Shell says it is "for later."'], { quiet: 1 })],
      K: ['f_shelfshell', I_('shelf', ['|Shells, sorted by size. One empty spot, labelled in crayon: "the one you\'ll bring."'], { quiet: 1 })], l: ['f_hlantern'], u: [['f_surf', { c: '#ff8a5a' }]], c: ['f_rope'], t: ['f_lowtable'], M: [['f_rugs', { w: 4, h: 2, cs: ['#c8a860', '#a8884a', '#e8d8a0'] }]],
      b: ['f_basket'], d: ['f_drift'], s: ['shellpile'], o: ['f_star'], x: [['f_crate2', { v: '#8ac83a' }]] },
    feat: [p('f_cushion', 6, 7, { c: '#3a9ac8' }), p('f_cushion', 12, 7, { c: '#e8541a' }), p('f_boxes2', 15, 7), p('f_bstack', 11, 9), p('f_bowls', 6, 9)],
    ents: [npc('shell', 9, 5)] });
  A('b_hut', { nm: 'Turtle Hut', pal: 'hut', interior: true, floor: 'sand', wall: 'bamboo', w: R.w, h: R.h, mus: 'beach', feat: R.feat, exits: [ex('down', 8, 9, 'b_shore')], ents: R.ents });
})();

// ==================== capsule hotel: capsule walls, lockers, kiosk, a washroom ====================
(() => {
  const R = ROOM({ id: 'n_capsule', grid: [
    WALLS(28), WALLS(28),
    '##' + DOTS(9) + 'KKKK' + 'N' + '.' + DOTS(8) + 'p' + '##',
    '##' + 'C.C.C.C.' + DOTS(7) + 'C.C.C.C.' + '.' + '##',
    '##' + DOTS(10) + 'B' + DOTS(13) + '##',
    '##' + DOTS(17) + WALLS(7) + '##',
    '##' + 'S.....V....D.....' + WALLS(7) + '##',
    '##' + DOTS(17) + WALLS(7) + '##',
    '##' + 'p' + DOTS(16) + '#' + 'W.W.u.' + '##',
    '##' + '...R' + DOTS(13) + '.' + DOTS(6) + '##',
    '##' + DOTS(17) + '.' + 'e.....' + '##',
    '##' + 'x.......p' + DOTS(8) + '#' + 'b....p' + '##',
    WALLS(28), WALLS(28)],
    leg: { K: ['f_locker'], N: ['neonx'], p: ['c_plant'], C: ['f_capwall', I_('capsule', [], { ev: 'sleep' })], B: [['f_bench2', { c: '#2a4a8a' }]], S: ['f_shoes'], V: ['c_vend'], D: ['f_kiosk', I_('desk', ['|The front desk is a screen. It says: "WELCOME BACK. YOUR USUAL ROOMS ARE READY."', 'Hitori:neutral|...Usual?'])],
      W: ['f_sinkrow'], u: [['f_towel', { c: '#ff5a8a' }]], R: [['f_rugp', { w: 4, h: 2, c: '#14306a', c2: '#2ee6e6' }]], e: ['f_bin'], b: ['f_basket'], x: ['f_boxes2'] },
    zones: [[2, 2, 17, 10, null, 'navy'], [20, 8, 6, 4, 'btile', 'tile']],
    ents: [obj('locker', 12, 2, ['|Locker 4 is open. Inside: a white hospital band, folded in half.'], { inv: 1, quiet: 1 })] });
  A('n_capsule', { ...CY, nm: 'Capsule Hotel', pal: 'capsule', interior: true, floor: 'tile', wall: 'stripe', w: R.w, h: R.h, fill: null, edge: 'wall', base: 0, mus: 'inboredom', feat: R.feat, exits: [ex('down', 13, 14, 'n_street')], ents: R.ents });
})();

// ==================== Ren's Ramen: kitchen and bar up front, a storeroom, low tables with cushions ====================
(() => {
  const R = ROOM({ id: 'n_ramen', grid: [
    WALLS(26), WALLS(26),
    '##' + 'S.P..P..FM..12..' + '#' + 'kxx.q' + '##',
    '##' + DOTS(16) + '.' + DOTS(5) + '##',
    '##' + DOTS(16) + '#' + 'x...p' + '##',
    '##' + '.R........9.....' + '#' + 'q...x' + '##',
    '##' + '..s.s.s.s.s.....' + WALLS(6) + '##',
    '##' + DOTS(16) + WALLS(6) + '##',
    '##' + 'T...T.......m....T..up' + '##',
    '##' + '......h.........h.....' + '##',
    '##' + 'T...T........T...T....' + '##',
    '##' + 'p....................p' + '##',
    WALLS(26), WALLS(26)],
    leg: { S: ['f_bottles'], P: ['f_pots'], F: ['f_fridge'], M: ['f_menutags'], '1': [['f_ctr', { up: 1, body: '#7a3a20', top: '#c88a50' }]], '2': [['f_ctr', { v: 'micro', up: 1, body: '#7a3a20', top: '#c88a50' }]], k: ['f_sacks'], x: ['f_crate2'], q: ['barrel'], p: ['c_plant'],
      R: ['f_rcounter', (x, y) => obj('counter', x + 3, y, ['|Steaming bowls. Each one is for a different person, and all of them are empty-chaired.'], { inv: 1, fr: { steven: 'I could eat all of these.', caroline: 'It smells like home, somehow!' } })],
      '9': [['f_ctr', { v: 'bell', body: '#7a3a20', top: '#c88a50' }], I_('bell', [], { ev: 'shop', shop: 'ren', say: ['|A little brass bell on the bar. Ren looks up from the pots.', 'Ren:happy|Hungry? Of course you\'re hungry.'] })],
      s: ['f_lowstool'], T: ['f_cushtbl'], m: ['f_maneki'], u: ['f_umbstand'], h: [['f_hanglamp', { c: '#e83a2a' }]] },
    zones: [[2, 2, 16, 3, 'gtile', 'tile'], [19, 2, 5, 4, 'dboard', 'wood'], [2, 8, 22, 4, null, 'red']],
    ents: [npc('ren', 12, 3), obj('bench', 22, 10, ['Hitori:blush|I\'ve never been here. But I know what this tastes like.'], { inv: 1, fr: { steven: 'Okay. This is the best day we\'ve had.', caroline: 'We should come back! ...Do we always say that?' } })] });
  A('n_ramen', { ...CY, nm: 'Ren\'s Ramen', pal: 'ramen', interior: true, floor: 'wood', wall: 'plank', w: R.w, h: R.h, fill: null, edge: 'wall', base: 0, feat: R.feat, exits: [ex('down', 12, 13, 'n_street')], ents: R.ents });
})();

// ==================== Pixel Palace Arcade: rows of cabinets, claw machines, racers, prize counter ====================
(() => {
  const nope = ['|A flashing machine. "INSERT COIN".'];
  const R = ROOM({ id: 'n_arcade', grid: [
    WALLS(32), WALLS(32),
    '##' + 'c.AAAA.n...W.W.......S.S.S.v' + '##',
    '##' + DOTS(15) + 'D' + DOTS(12) + '##',
    '##' + DOTS(22) + 'P...t.' + '##',
    '##' + DOTS(28) + '##',
    '##' + DOTS(28) + '##',
    '##' + '..AA7A..A8AA..........R..R..' + '##',
    '##' + DOTS(28) + '##',
    '##' + '..AAAA..AAAA.H............9.' + '##',
    '##' + DOTS(28) + '##',
    '##' + '..AAAA............AAAA......' + '##',
    '##' + '..g.....................B...' + '##',
    '##' + '......b...qq................' + '##',
    '##' + DOTS(28) + '##',
    '##' + 'x.e......................p..' + '##',
    WALLS(32), WALLS(32)],
    leg: { c: ['f_change'], A: ['f_cab', I_('arcade', [], { ev: 'arc', quiet: 1 })], n: ['f_neontube'], W: ['f_claw', I_('claw', [], { ev: 'arc', game: 'claw', quiet: 1 })], S: [['f_shelfw', { seed: .9 }]], v: ['c_vend'],
      D: ['f_dance', I_('dance', [], { ev: 'arc', game: 'dance', quiet: 1 })], P: ['f_prizes', I_('prizes', [], { ev: 'prizes', quiet: 1 })], t: ['f_ticket'],
      '7': [['f_cab', { c: '#ff5a8a' }], (x, y) => obj('arcade', x, y, ['|The screen flashes: NEW HIGH SCORE. The old one blinks out.', 'Hitori:happy|Hah. Take that, STV.'], { ev: 'arc', set: 'a1', inv: 1 })],
      '8': [['f_cab', { c: '#2ee6e6' }], (x, y) => obj('arcade', x, y, ['|Your name goes up on the board. Right above STV.'], { ev: 'arc', set: 'a2', inv: 1 })],
      '9': [['f_cab', { c: '#ffd23c' }], (x, y) => obj('arcade', x, y, ['|The last machine. The high score used to read "STV". Now it reads yours.', 'Hitori:neutral|...Why does that feel like I took something from him?'], { ev: 'arc', set: 'a3', inv: 1 })],
      R: ['f_racer', I_('racer', [], { ev: 'arc', game: 'racer', quiet: 1 })], H: ['f_hockey', I_('hockey', [], { ev: 'arc', game: 'hockey', quiet: 1 })], g: ['f_gumball'], B: ['booth'], b: [['f_bench2', { c: '#3a2a6a' }], (x, y) => obj('bench', x, y, ['Hitori:neutral|I know the sound of these. Why do I know the sound of these?'], { inv: 1 })], q: ['f_pinball', I_('pinball', [], { ev: 'arc', game: 'brick', quiet: 1 })], x: ['bags'], e: ['f_bin'], p: ['c_plant'] },
    ents: [npc('kix', 18, 6)] });
  A('n_arcade', { ...CY, nm: 'Pixel Palace Arcade', pal: 'arcadein', interior: true, floor: 'arcade', wall: 'brick', w: R.w, h: R.h, fill: null, edge: 'wall', base: 0, feat: R.feat, exits: [ex('down', 15, 16, 'n_market')], ents: R.ents });
})();
