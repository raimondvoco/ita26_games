// ==================== PART TWO: the house's floor plan ====================
// The house was first laid out on a tight 12 x 10 m plan. It felt cramped in first person, so the plan is now
// 16.4 x 14 m: every room is bigger, the stairs and the gallery are wide, and doors are wider (first-person games
// build interiors larger than real life: the camera's field of view shrinks spaces, and the player needs room to turn).
//
// Rather than retyping every position, the old plan is mapped onto the new one, room by room. Inside a room, anything
// within LPIN m of a wall keeps its distance from that wall (so furniture stays against walls); the open middle of
// the room stretches. Furniture keeps its size: whole objects are moved by where their centre lands. Walls, floors and
// ceilings are stretched to fit. Story positions (cutscene cameras, where you wake, the lights...) go through LM too.
const LAYOUT = { on: false, raw: 0, stretch: 0 };
const LPIN = 1.25, DOORW = 1.1, DOORH = 2.2;
// old room rectangle [x0, z0, x1, z1] -> new one, per floor (0 = ground, 1 = upstairs)
const LROOMS = [
  { f: 0, id: 'storage', o: [0, 0, 4, 4], n: [0, 0, 5.6, 5.2] },
  { f: 0, id: 'living', o: [0, 4, 4, 10], n: [0, 5.2, 5.6, 14] },
  { f: 0, id: 'hall', o: [4, 0, 8.6, 10], n: [5.6, 0, 11.4, 14] },
  { f: 0, id: 'bath0', o: [8.6, 0, 12, 3.5], n: [11.4, 0, 16.4, 4.6] },
  { f: 0, id: 'kitchen', o: [8.6, 3.5, 12, 10], n: [11.4, 4.6, 16.4, 14] },
  { f: 1, id: 'ubath', o: [0, 0, 4, 4.5], n: [0, 0, 5.6, 5.8] },
  { f: 1, id: 'parents', o: [0, 4.5, 4, 10], n: [0, 5.8, 5.6, 14] },
  { f: 1, id: 'upstairs', o: [4, 0, 8.6, 10], n: [5.6, 0, 11.4, 14] },
  { f: 1, id: 'sister', o: [8.6, 0, 12, 5], n: [11.4, 0, 16.4, 6.4] },
  { f: 1, id: 'hitori', o: [8.6, 5, 12, 10], n: [11.4, 6.4, 16.4, 14] },
];
const HOUSE_W = 16.4, HOUSE_D = 14;
function lAxis(u, a, b, A, B) {
  if (u <= a) return A + (u - a); if (u >= b) return B + (u - b);
  const m = Math.min(LPIN, (b - a) * .35); if (u - a < m) return A + (u - a); if (b - u < m) return B - (b - u);
  return A + m + (u - a - m) * ((B - A - 2 * m) / (b - a - 2 * m));
}
function lRoom(x, z, y = 0) { const f = y > 1.5 ? 1 : 0, cx = clamp(x, 1e-6, 12 - 1e-6), cz = clamp(z, 1e-6, 10 - 1e-6);
  return LROOMS.find(r => r.f == f && cx >= r.o[0] && cx <= r.o[2] && cz >= r.o[1] && cz <= r.o[3]) || LROOMS[2] }
// old (x, z) on floor y -> new [x, z]
function LM(x, z, y = 0, room) { const r = room || lRoom(x, z, y); return [lAxis(x, r.o[0], r.o[2], r.n[0], r.n[2]), lAxis(z, r.o[1], r.o[3], r.n[1], r.n[3])] }
const L3P = p => { const q = LM(p[0], p[2], p[1]); return [q[0], p[1], q[1]] };
// a box keeps its size, moved by its centre (furniture); or stretched corner to corner (walls, floors)
function LBOX(b, stretch) {
  if (stretch) { const a = LM(b[0], b[2], b[1] + .01), c = LM(b[3], b[5], b[1] + .01); return [Math.min(a[0], c[0]), b[1], Math.min(a[1], c[1]), Math.max(a[0], c[0]), b[4], Math.max(a[1], c[1])] }
  const cx = (b[0] + b[3]) / 2, cz = (b[2] + b[5]) / 2, [X, Z] = LM(cx, cz, (b[1] + b[4]) / 2); return [b[0] + X - cx, b[1], b[2] + Z - cz, b[3] + X - cx, b[4], b[5] + Z - cz];
}
// the new room a (new) point is in
function lRoomNew(x, z, y = 0) { const f = y > 1.5 ? 1 : 0; return LROOMS.find(r => r.f == f && x >= r.n[0] && x <= r.n[2] && z >= r.n[1] && z <= r.n[3]) }

// While the house is being built (LAYOUT.on), everything an MB builds is moved onto the new plan: each top-level call
// (a box, a lathe, an at(...) block of furniture...) is one object, moved by its centre; with LAYOUT.stretch on, every
// vertex is mapped instead. LAYOUT.raw turns it off for things already built in new coordinates.
(function () {
  const post = (mb, st) => {
    let n = 0, sx = 0, sy = 0, sz = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const t in mb.g) { const a = mb.g[t]; for (let i = st[t] || 0; i < a.length; i += 12) { x0 = Math.min(x0, a[i]); x1 = Math.max(x1, a[i]); y0 = Math.min(y0, a[i + 1]); y1 = Math.max(y1, a[i + 1]); z0 = Math.min(z0, a[i + 2]); z1 = Math.max(z1, a[i + 2]); n++ } }
    if (!n) return;
    if (LAYOUT.stretch) { for (const t in mb.g) { const a = mb.g[t]; for (let i = st[t] || 0; i < a.length; i += 12) { const [X, Z] = LM(a[i], a[i + 2], a[i + 1]); a[i] = X; a[i + 2] = Z } } return }
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, [X, Z] = LM(cx, cz, (y0 + y1) / 2), dx = X - cx, dz = Z - cz;
    if (Math.abs(dx) + Math.abs(dz) < 1e-9) return;
    for (const t in mb.g) { const a = mb.g[t]; for (let i = st[t] || 0; i < a.length; i += 12) { a[i] += dx; a[i + 2] += dz } }
  };
  for (const nm of ['with', 'tri', 'quad', 'box', 'decal', 'surf', 'lathe', 'cyl', 'sphere', 'tube', 'strip']) {
    const f = MB.prototype[nm];
    MB.prototype[nm] = function (...a) {
      if (!LAYOUT.on || LAYOUT.raw || this._d) { this._d = (this._d || 0) + 1; try { return f.apply(this, a) } finally { this._d-- } }
      const st = {}; for (const t in this.g) st[t] = this.g[t].length;
      this._d = 1; let r; try { r = f.apply(this, a) } finally { this._d = 0 }
      post(this, st); return r;
    };
  }
})();
// run fn with mapping off (for things built straight in new coordinates) / with stretching on
function lRaw(fn) { LAYOUT.raw++; try { return fn() } finally { LAYOUT.raw-- } }
function lStretch(fn) { const o = LAYOUT.stretch; LAYOUT.stretch = 1; try { return fn() } finally { LAYOUT.stretch = o } }
