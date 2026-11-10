// ==================== PART TWO: a small PlayStation-flavoured 3D engine (WebGL 1) ====================
// The 3D view is drawn at 480x270 into its own canvas, then copied onto the game canvas, where the 2D layer
// (subtitles, phone, computer...) is drawn on top. Textures are mapped with perspective correction (so walls and
// doors hold still), light is worked out per pixel, colours are dithered down to 15-bit and fog swallows the far
// end of every room. Mirrors are real reflections: the room is drawn a second time, flipped, into a texture.
const P2W = 640, P2H = 360;
const GLC = document.createElement('canvas'); GLC.width = P2W; GLC.height = P2H;
let gl = null, GP = null, MIRFB = null;
const NL = 8;   // lights per frame
const P2VS = `
attribute vec3 aP; attribute vec3 aN; attribute vec2 aU; attribute vec4 aC; attribute vec2 aBI; attribute float aBW;
uniform mat4 uVP; uniform mat4 uM; uniform float uSnap; uniform mat4 uB[15]; uniform float uSkin;
varying vec2 vU; varying vec3 vW; varying vec3 vN; varying vec4 vC; varying float vD;
void main() {
  vec4 lp = vec4(aP, 1.0); vec3 ln = aN;
  if (uSkin > 0.5) { mat4 S = uB[int(aBI.x + 0.5)] * aBW + uB[int(aBI.y + 0.5)] * (1.0 - aBW); lp = S * lp; ln = (S * vec4(aN, 0.0)).xyz; }
  vec4 wp = uM * lp; vW = wp.xyz; vN = (uM * vec4(ln, 0.0)).xyz;
  vec4 c = uVP * wp;
  if (uSnap > 0.0 && c.w > 0.05) { vec2 sn = vec2(${P2W / 2}.0, ${P2H / 2}.0) / uSnap; c.xy = floor(c.xy / c.w * sn + 0.5) / sn * c.w; }
  gl_Position = c; vU = aU; vC = aC; vD = c.w;
}`;
const P2FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uT; uniform vec3 uFog; uniform vec2 uFogR; uniform float uGlow; uniform vec3 uAmb; uniform vec3 uCam;
uniform vec3 uLP[${NL}]; uniform vec3 uLC[${NL}]; uniform float uLR[${NL}];
uniform vec4 uClip; uniform float uMir; uniform vec2 uRes; uniform float uSpec; uniform vec4 uTint;
varying vec2 vU; varying vec3 vW; varying vec3 vN; varying vec4 vC; varying float vD;
float bayer(vec2 p) { vec2 q = mod(floor(p), 4.0); float a = mod(q.x, 2.0), b = mod(q.y, 2.0), c = floor(q.x / 2.0), d = floor(q.y / 2.0);
  return (4.0 * mod(a * 2.0 + b * 3.0, 4.0) + mod(c * 2.0 + d * 3.0, 4.0)) / 16.0; }
void main() {
  if (dot(vW, uClip.xyz) < uClip.w) discard;
  vec4 t = uMir > 0.5 ? texture2D(uT, gl_FragCoord.xy / uRes) : texture2D(uT, vU);
  if (t.a < 0.5) discard;
  vec3 c;
  if (uMir > 0.5) { c = t.rgb * vec3(0.82, 0.86, 0.9) + 0.03; }
  else {
    vec3 n = normalize(vN); vec3 v = uCam - vW; if (dot(n, v) < 0.0) n = -n; vec3 vn = normalize(v);
    vec3 l = uAmb * (0.78 + 0.22 * n.y); vec3 sp = vec3(0.0);
    for (int i = 0; i < ${NL}; i++) { vec3 d = uLP[i] - vW; float dist = max(length(d), 0.001); vec3 dn = d / dist; float att = clamp(1.0 - dist / uLR[i], 0.0, 1.0); att *= att;
      float nd = max(dot(n, dn), 0.0); l += uLC[i] * att * (0.22 + 0.78 * nd);
      if (uSpec > 0.0) sp += uLC[i] * att * nd * pow(max(dot(n, normalize(dn + vn)), 0.0), 28.0); }
    vec3 lit = mix(l * vC.rgb, vC.rgb, vC.a);
    c = t.rgb * lit * uGlow + sp * uSpec;
  }
  c = mix(c, uTint.rgb, uTint.a);
  float f = clamp((vD - uFogR.x) / (uFogR.y - uFogR.x), 0.0, 1.0); c = mix(c, uFog, f);
  c = floor(c * 31.0 + bayer(gl_FragCoord.xy)) / 31.0;
  gl_FragColor = vec4(c, 1.0);
}`;
function glInit() {
  if (gl) return true;
  gl = GLC.getContext('webgl', { antialias: false, preserveDrawingBuffer: true }) || GLC.getContext('experimental-webgl');
  if (!gl) return false;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, P2VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, P2FS)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p));
  gl.useProgram(p);
  GP = { p }; for (const a of ['aP', 'aN', 'aU', 'aC', 'aBI', 'aBW']) GP[a] = gl.getAttribLocation(p, a);
  for (const u of ['uVP', 'uM', 'uAmb', 'uSnap', 'uT', 'uFog', 'uFogR', 'uGlow', 'uCam', 'uClip', 'uMir', 'uRes', 'uSpec', 'uTint', 'uSkin']) GP[u] = gl.getUniformLocation(p, u);
  GP.uLP = gl.getUniformLocation(p, 'uLP'); GP.uLC = gl.getUniformLocation(p, 'uLC'); GP.uLR = gl.getUniformLocation(p, 'uLR'); GP.uB = gl.getUniformLocation(p, 'uB');
  gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
  gl.uniform2f(GP.uRes, P2W, P2H); gl.uniform4f(GP.uClip, 0, 0, 0, -1e9); gl.uniform4f(GP.uTint, 0, 0, 0, 0); gl.uniform1f(GP.uSkin, 0);
  // the mirror's render target
  const mt = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, mt); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, P2W, P2H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  const rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, rb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, P2W, P2H);
  const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, mt, 0); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
  MIRFB = gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE ? { fb, tex: mt } : null; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return true;
}
// ---- matrices (column-major, like GL)
const M4 = {
  mul(a, b) { const o = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s } return o },
  persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2); return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]) },
  tr(x, y, z) { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]) },
  sc(x, y, z) { return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]) },
  ry(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]) },
  rx(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]) },
  rz(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) },
  chain(...ms) { return ms.reduce((a, b) => M4.mul(a, b)) },
  // a frame from three axis vectors and an origin
  basis(X, Y, Z, o) { return new Float32Array([X[0], X[1], X[2], 0, Y[0], Y[1], Y[2], 0, Z[0], Z[1], Z[2], 0, o[0], o[1], o[2], 1]) },
  // the mirror image through the plane n.p = d
  refl(n, d) { const [a, b, c] = n; return new Float32Array([1 - 2 * a * a, -2 * a * b, -2 * a * c, 0, -2 * a * b, 1 - 2 * b * b, -2 * b * c, 0, -2 * a * c, -2 * b * c, 1 - 2 * c * c, 0, 2 * d * a, 2 * d * b, 2 * d * c, 1]) },
  pt(M, p) { return [M[0] * p[0] + M[4] * p[1] + M[8] * p[2] + M[12], M[1] * p[0] + M[5] * p[1] + M[9] * p[2] + M[13], M[2] * p[0] + M[6] * p[1] + M[10] * p[2] + M[14]] },
  dir(M, p) { return [M[0] * p[0] + M[4] * p[1] + M[8] * p[2], M[1] * p[0] + M[5] * p[1] + M[9] * p[2], M[2] * p[0] + M[6] * p[1] + M[10] * p[2]] },
};
const M4ID = M4.tr(0, 0, 0);
const V3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], len: a => Math.hypot(a[0], a[1], a[2]), norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }, lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] };
// ---- textures: drawn once on little canvases (power-of-two sizes so they can repeat)
const TX = {};
function tex(name, size, draw, h) { const cv = document.createElement('canvas'); cv.width = size; cv.height = h || size; const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; draw(g, size, h || size); TX[name] = { cv, g, size, glt: null, dirty: 1 }; return TX[name] }
function texGL(name) {
  const T = TX[name] || TX.white; if (!T.glt) T.glt = gl.createTexture();
  if (T.dirty) { gl.bindTexture(gl.TEXTURE_2D, T.glt); try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, T.cv) } catch (e) { const c = document.createElement('canvas'); c.width = c.height = 8; c.getContext('2d').fillStyle = '#888'; c.getContext('2d').fillRect(0, 0, 8, 8); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c) }
    if (T.mip) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR) } else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); T.dirty = 0 }
  return T.glt;
}
// how shiny each material is
const SPEC = { nail: .55, nailtip: .4, porcelain: .55, metal: .5, chrome: .8, fridge: .35, fridgein: .2, phone: .6, phonebroken: .5, horn: .45, boot: .35, crt: .4, mirror: 0, tile: .25, counter: .25, glass: .7, felt: 0, chips: .3, hair: .12, hairb: .12, bulb: 0, lacquer: .3, dwoodl: .18, plastic: .3, sink: .5, stove: .3, faucet: .8, kettle: .6, bottle: .6 };
// noise helper for textures
function texNoise(g, s, base, amt, seed = 1, px = 1, h) { const R = rng(seed); h = h || s; g.fillStyle = base; g.fillRect(0, 0, s, h); for (let y = 0; y < h; y += px) for (let x = 0; x < s; x += px) { const v = (R() - .5) * amt; g.fillStyle = v > 0 ? 'rgba(255,255,255,' + v + ')' : 'rgba(0,0,0,' + (-v) + ')'; g.fillRect(x, y, px, px) } }
tex('white', 8, (g, s) => { g.fillStyle = '#fff'; g.fillRect(0, 0, s, s) });
// ---- meshes: geometry is collected per texture, then uploaded as one buffer per texture.
// A transform can be set (mb.with(M, fn)) so parts can be rotated and placed.
class MB {
  constructor() { this.g = {}; this.M = null }
  push(t, p, n, u, c) { if (this.M) { p = M4.pt(this.M, p); n = V3.norm(M4.dir(this.M, n)) } const a = this.g[t] || (this.g[t] = []); a.push(p[0], p[1], p[2], n[0], n[1], n[2], u[0], u[1], c[0], c[1], c[2], c[3]) }
  with(M, fn) { const o = this.M; this.M = o ? M4.mul(o, M) : M; fn(this); this.M = o; return this }
  at(x, y, z, ry, fn) { return this.with(ry ? M4.mul(M4.tr(x, y, z), M4.ry(ry)) : M4.tr(x, y, z), fn) }
  tri(t, a, b, c, ua, ub, uc, col = [1, 1, 1, 0], na, nb, nc) {
    if (!na) { const e1 = V3.sub(b, a), e2 = V3.sub(c, a); na = nb = nc = V3.norm(V3.cross(e1, e2)) }
    this.push(t, a, na, ua, col); this.push(t, b, nb, ub, col); this.push(t, c, nc, uc, col);
  }
  quad(t, a, b, c, d, uv = [[0, 0], [1, 0], [1, 1], [0, 1]], col = [1, 1, 1, 0]) {
    const n = V3.norm(V3.cross(V3.sub(b, a), V3.sub(c, a)));
    for (const i of [0, 1, 2, 0, 2, 3]) this.push(t, [a, b, c, d][i], n, uv[i], col);
  }
  // an axis-aligned box. o.us = metres per texture repeat; o.fit = stretch the texture over each face;
  // o.skip = faces to leave out ('t','b','n','s','e','w'); o.tf = {face: texture}; o.col = tint [r,g,b,emissive];
  // o.bev = bevel the top edges by this much (table tops, counters, cushions)
  box(t, x0, y0, z0, x1, y1, z1, o = {}) {
    const us = o.us || 1, col = o.col || [1, 1, 1, 0], sk = o.skip || '', fit = o.fit, tf = o.tf || {}, b = Math.min(o.bev || 0, (x1 - x0) / 2.2, (z1 - z0) / 2.2, (y1 - y0) / 2.2), yt = y1 - b;
    const F = (k, pts, uv) => { if (sk.includes(k)) return; this.quad(tf[k] || t, ...pts, fit ? [[0, 0], [1, 0], [1, 1], [0, 1]] : uv, col) };
    F('s', [[x0, yt, z1], [x1, yt, z1], [x1, y0, z1], [x0, y0, z1]], [[x0 / us, (y1 - yt) / us], [x1 / us, (y1 - yt) / us], [x1 / us, (y1 - y0) / us], [x0 / us, (y1 - y0) / us]]);
    F('n', [[x1, yt, z0], [x0, yt, z0], [x0, y0, z0], [x1, y0, z0]], [[-x1 / us, (y1 - yt) / us], [-x0 / us, (y1 - yt) / us], [-x0 / us, (y1 - y0) / us], [-x1 / us, (y1 - y0) / us]]);
    F('e', [[x1, yt, z1], [x1, yt, z0], [x1, y0, z0], [x1, y0, z1]], [[-z1 / us, (y1 - yt) / us], [-z0 / us, (y1 - yt) / us], [-z0 / us, (y1 - y0) / us], [-z1 / us, (y1 - y0) / us]]);
    F('w', [[x0, yt, z0], [x0, yt, z1], [x0, y0, z1], [x0, y0, z0]], [[z0 / us, (y1 - yt) / us], [z1 / us, (y1 - yt) / us], [z1 / us, (y1 - y0) / us], [z0 / us, (y1 - y0) / us]]);
    const a0 = x0 + b, a1 = x1 - b, c0 = z0 + b, c1 = z1 - b;
    F('t', [[a0, y1, c0], [a1, y1, c0], [a1, y1, c1], [a0, y1, c1]], [[a0 / us, c0 / us], [a1 / us, c0 / us], [a1 / us, c1 / us], [a0 / us, c1 / us]]);
    F('b', [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]], [[x0 / us, z1 / us], [x1 / us, z1 / us], [x1 / us, z0 / us], [x0 / us, z0 / us]]);
    if (b > 0 && !sk.includes('t')) { const tt = tf.t || t, U2 = (p) => [p[0] / us, p[2] / us];
      for (const q of [[[x0, yt, z1], [x1, yt, z1], [a1, y1, c1], [a0, y1, c1]], [[x1, yt, z0], [x0, yt, z0], [a0, y1, c0], [a1, y1, c0]], [[x1, yt, z1], [x1, yt, z0], [a1, y1, c0], [a1, y1, c1]], [[x0, yt, z0], [x0, yt, z1], [a0, y1, c1], [a0, y1, c0]]])
        this.quad(tt, q[0], q[1], q[2], q[3], [U2(q[0]), U2(q[1]), U2(q[2]), U2(q[3])], col) }
  }
  // a flat picture on a wall (facing +z 's', -z 'n', +x 'e', -x 'w', or up 't')
  decal(t, cx, cy, cz, w, h, face, col, uv) {
    const hw = w / 2, hh = h / 2, d = .006, C = col || [1, 1, 1, 0];
    if (face == 's') this.quad(t, [cx - hw, cy + hh, cz + d], [cx + hw, cy + hh, cz + d], [cx + hw, cy - hh, cz + d], [cx - hw, cy - hh, cz + d], uv, C);
    if (face == 'n') this.quad(t, [cx + hw, cy + hh, cz - d], [cx - hw, cy + hh, cz - d], [cx - hw, cy - hh, cz - d], [cx + hw, cy - hh, cz - d], uv, C);
    if (face == 'e') this.quad(t, [cx + d, cy + hh, cz + hw], [cx + d, cy + hh, cz - hw], [cx + d, cy - hh, cz - hw], [cx + d, cy - hh, cz + hw], uv, C);
    if (face == 'w') this.quad(t, [cx - d, cy + hh, cz - hw], [cx - d, cy + hh, cz + hw], [cx - d, cy - hh, cz + hw], [cx - d, cy - hh, cz - hw], uv, C);
    if (face == 't') this.quad(t, [cx - hw, cy + d, cz - hh], [cx + hw, cy + d, cz - hh], [cx + hw, cy + d, cz + hh], [cx - hw, cy + d, cz + hh], uv, C);
  }
  // a surface of revolution round the y axis. prof: [[radius, y], ...] from bottom to top (or top to bottom).
  // o: seg, cx, cz, sx/sz (squash into an ellipse), a0/a1 (only part of the way round; 0 = facing -z),
  // ur/vr (texture repeats), cap ('t','b' or 'tb'), yf(i, a) (move ring i up or down at angle a: uneven hems), col
  // a grid of points (rows x cols) turned into triangles. Normals are worked out from the surface itself, so
  // squashed, folded and pleated shapes shade properly. G[i][k] = {p, n (a rough outward guess), u}; o.wrap joins
  // the last column to the first; o.keep(i, k) drops a cell.
  surf(t, G, o = {}) {
    const R = G.length, K = G[0].length, col = o.col || [1, 1, 1, 0], P = (i, k) => G[clamp(i, 0, R - 1)][k].p;
    const kk = k => o.wrap ? ((k % (K - 1)) + (K - 1)) % (K - 1) : clamp(k, 0, K - 1);
    const N = G.map((row, i) => row.map((v, k) => { const tk = V3.sub(P(i, kk(k + 1)), P(i, kk(k - 1))), ti = V3.sub(P(i + 1, k), P(i - 1, k)); let n = V3.cross(tk, ti); const l = V3.len(n);
      if (l < 1e-10) return v.n; n = V3.mul(n, 1 / l); return V3.dot(n, v.n) < 0 ? V3.mul(n, -1) : n }));
    for (let i = 0; i < R - 1; i++) for (let k = 0; k < K - 1; k++) { if (o.keep && !o.keep(i, k)) continue;
      const A = G[i][k], B = G[i][k + 1], Cc = G[i + 1][k + 1], D = G[i + 1][k];
      this.tri(t, A.p, B.p, Cc.p, A.u, B.u, Cc.u, col, N[i][k], N[i][k + 1], N[i + 1][k + 1]); this.tri(t, A.p, Cc.p, D.p, A.u, Cc.u, D.u, col, N[i][k], N[i + 1][k + 1], N[i + 1][k]) }
  }
  // a surface of revolution round the y axis. prof: [[radius, y, xscale?, zscale?, zshift?], ...] from bottom to top (or top to bottom).
  // o: seg, cx, cz, sx/sz (squash into an ellipse), a0/a1 (only part of the way round; 0 = facing -z),
  // ur/vr (texture repeats), cap ('t','b' or 'tb'), yf(i, a) (move ring i up or down at angle a: uneven hems),
  // rf(i, a) (scale the radius: folds and pleats), col
  lathe(t, prof, o = {}) {
    const seg = o.seg || 16, cx = o.cx || 0, cz = o.cz || 0, sx = o.sx || 1, sz = o.sz || 1, a0 = o.a0 ?? -Math.PI, a1 = o.a1 ?? Math.PI, col = o.col || [1, 1, 1, 0], ur = o.ur || 1, vr = o.vr || 1, full = Math.abs(a1 - a0 - 2 * Math.PI) < 1e-6;
    const up = prof[prof.length - 1][1] >= prof[0][1] ? 1 : -1, n = prof.length;
    const L = [0]; for (let i = 1; i < n; i++) L.push(L[i - 1] + Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]));
    const V = (i, k) => { const a = a0 + (a1 - a0) * k / seg, s = Math.sin(a), c = Math.cos(a), r = prof[i][0] * (o.rf ? o.rf(i, a) : 1), y = prof[i][1] + (o.yf ? o.yf(i, a) : 0), X = prof[i][2] ?? sx, Z = prof[i][3] ?? sz, dz = prof[i][4] || 0;
      return { p: [cx + s * r * X, y, cz + dz - c * r * Z], n: V3.norm([s / X, 0, -c / Z]), u: [(a - a0) / (2 * Math.PI) * ur, L[i] * vr] } };
    const G = []; for (let i = 0; i < n; i++) { const row = []; for (let k = 0; k <= seg; k++) row.push(V(i, k)); G.push(row) }
    this.surf(t, G, { col, wrap: full });
    const cap = (i, ny) => { const y = prof[i][1]; for (let k = 0; k < seg; k++) { const A = G[i][k], B = G[i][k + 1], ctr = [cx, y, cz]; this.tri(o.capt || t, ctr, A.p, B.p, [.5, .5], [.5 + A.p[0] - cx, .5 + A.p[2] - cz], [.5 + B.p[0] - cx, .5 + B.p[2] - cz], col, [0, ny, 0], [0, ny, 0], [0, ny, 0]) } };
    if (o.cap && o.cap.includes('b')) cap(up > 0 ? 0 : n - 1, -1); if (o.cap && o.cap.includes('t')) cap(up > 0 ? n - 1 : 0, 1);
  }
  cyl(t, cx, y0, cz, r, h, o = {}) { this.lathe(t, [[o.r0 ?? r, y0], [o.r1 ?? r, y0 + h]], { seg: 12, cap: 'tb', ...o, cx, cz }) }
  // an ellipsoid. o.keep(theta, phi) drops faces (theta 0 = front, -z; phi 0 = top); o.morph(p, theta, phi) bends points
  sphere(t, cx, cy, cz, rx, ry, rz, o = {}) {
    const seg = o.seg || 14, rings = o.rings || 10, col = o.col || [1, 1, 1, 0], p0 = o.p0 ?? 0, p1 = o.p1 ?? Math.PI, G = [];
    for (let i = 0; i <= rings; i++) { const row = []; for (let k = 0; k <= seg; k++) { const ph = p0 + (p1 - p0) * i / rings, th = -Math.PI + 2 * Math.PI * k / seg, s = Math.sin(ph), x = s * Math.sin(th), y = Math.cos(ph), z = -s * Math.cos(th);
      let p = [cx + x * rx, cy + y * ry, cz + z * rz]; if (o.morph) p = o.morph(p, th, ph); row.push({ p, n: V3.norm([x / rx, y / ry, z / rz]), u: [k / seg * (o.ur || 1), ph / Math.PI], th, ph }) } G.push(row) }
    this.surf(t, G, { col, wrap: true, keep: o.keep ? (i, k) => o.keep((G[i][k].th + G[i + 1][k + 1].th) / 2, (G[i][k].ph + G[i + 1][k + 1].ph) / 2) : null });
  }
  // a tube along a list of points with a list of radii (horns, ropes, fingers, cables)
  tube(t, pts, rads, o = {}) {
    const seg = o.seg || 8, col = o.col || [1, 1, 1, 0], n = pts.length; let ref = o.ref || [0, 0, 1];
    const rings = []; let len = 0;
    for (let i = 0; i < n; i++) { const d = V3.norm(V3.sub(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)])); if (Math.abs(V3.dot(d, ref)) > .95) ref = Math.abs(d[0]) < .9 ? [1, 0, 0] : [0, 1, 0];
      const x = V3.norm(V3.cross(d, ref)), y = V3.cross(x, d); if (i) len += V3.len(V3.sub(pts[i], pts[i - 1])); const ring = [];
      for (let k = 0; k <= seg; k++) { const a = k / seg * Math.PI * 2, nn = V3.add(V3.mul(x, Math.cos(a)), V3.mul(y, Math.sin(a))); ring.push({ p: V3.add(pts[i], V3.mul(nn, rads[i] * (o.sy && Math.abs(Math.sin(a)) ? 1 : 1))), n: nn, u: [k / seg, len * (o.vr || 4)] }) } rings.push(ring) }
    for (let i = 0; i < n - 1; i++) for (let k = 0; k < seg; k++) { const A = rings[i][k], B = rings[i][k + 1], Cc = rings[i + 1][k + 1], D = rings[i + 1][k]; this.tri(t, A.p, B.p, Cc.p, A.u, B.u, Cc.u, col, A.n, B.n, Cc.n); this.tri(t, A.p, Cc.p, D.p, A.u, Cc.u, D.u, col, A.n, Cc.n, D.n) }
    if (o.cap) { const e = rings[n - 1], c = pts[n - 1], dn = V3.norm(V3.sub(pts[n - 1], pts[n - 2])); for (let k = 0; k < seg; k++) this.tri(t, c, e[k].p, e[k + 1].p, [.5, .5], e[k].u, e[k + 1].u, col, dn, dn, dn) }
  }
  strip(t, pts, ws, sides, o = {}) {
    const col = o.col || [1, 1, 1, 0], n = pts.length; let len = 0; const L = [], R = [], N = [];
    for (let i = 0; i < n; i++) { const sd = V3.norm(sides[i] || sides[0]), hw = ws[i] / 2; L.push(V3.sub(pts[i], V3.mul(sd, hw))); R.push(V3.add(pts[i], V3.mul(sd, hw)));
      const tg = V3.norm(V3.sub(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)])); N.push(V3.norm(V3.cross(tg, sd))) }
    let tot = 0; for (let i = 1; i < n; i++) tot += V3.len(V3.sub(pts[i], pts[i - 1])); const vr = o.vfit ? 1 / tot : (o.vr || 6);
    for (let i = 0; i < n - 1; i++) { const v0 = len * vr; len += V3.len(V3.sub(pts[i + 1], pts[i])); const v1 = len * vr, u0 = o.u0 || 0, u1 = (o.u0 || 0) + (o.uw || .25);
      this.tri(t, L[i], R[i], R[i + 1], [u0, v0], [u1, v0], [u1, v1], col, N[i], N[i], N[i + 1]); this.tri(t, L[i], R[i + 1], L[i + 1], [u0, v0], [u1, v1], [u0, v1], col, N[i], N[i + 1], N[i + 1]) }
  }
  build() {
    glInit(); const groups = [];
    for (const t in this.g) { const a = new Float32Array(this.g[t]), b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, a, gl.STATIC_DRAW); groups.push({ t, b, n: a.length / 12 }) }
    return { groups, M: M4ID, vis: true };
  }
}
let DRAWMIR = false;   // true while the mirror's reflection is being drawn (mirrors themselves are skipped)
function drawObj(o) {
  if (!o || !o.vis) return; if (o.mirror && DRAWMIR) return;
  if (o.groupsOf) { for (const s of o.groupsOf()) drawObj(s); return }
  if (o.skin) { drawSkinned(o); return }
  gl.uniformMatrix4fv(GP.uM, false, o.M || M4ID);
  if (o.tint) gl.uniform4fv(GP.uTint, o.tint);
  for (const g of o.groups) {
    gl.bindBuffer(gl.ARRAY_BUFFER, g.b); const st = 48;
    gl.enableVertexAttribArray(GP.aP); gl.vertexAttribPointer(GP.aP, 3, gl.FLOAT, false, st, 0);
    gl.enableVertexAttribArray(GP.aN); gl.vertexAttribPointer(GP.aN, 3, gl.FLOAT, false, st, 12);
    gl.enableVertexAttribArray(GP.aU); gl.vertexAttribPointer(GP.aU, 2, gl.FLOAT, false, st, 24);
    gl.enableVertexAttribArray(GP.aC); gl.vertexAttribPointer(GP.aC, 4, gl.FLOAT, false, st, 32);
    gl.activeTexture(gl.TEXTURE0);
    const mir = o.mirror && o.mirTex && g.t == o.mirror; gl.uniform1f(GP.uMir, mir ? 1 : 0);
    gl.bindTexture(gl.TEXTURE_2D, mir ? o.mirTex : texGL(g.t)); gl.uniform1i(GP.uT, 0); gl.uniform1f(GP.uSpec, SPEC[g.t] || 0);
    gl.drawArrays(gl.TRIANGLES, 0, g.n);
  }
  gl.uniform1f(GP.uMir, 0); if (o.tint) gl.uniform4f(GP.uTint, 0, 0, 0, 0);
}
// a skinned mesh (the 3D Hitori): one vertex buffer [pos3 nrm3 uv2 bone2 weight1], drawn through index lists (parts),
// each vertex moved by a blend of two of the 15 bone matrices in o.bones
function drawSkinned(o) {
  const S = o.skin; gl.uniformMatrix4fv(GP.uM, false, M4ID); gl.uniform1f(GP.uSkin, 1); gl.uniformMatrix4fv(GP.uB, false, o.bones);
  gl.bindBuffer(gl.ARRAY_BUFFER, S.vb); const st = 44;
  gl.enableVertexAttribArray(GP.aP); gl.vertexAttribPointer(GP.aP, 3, gl.FLOAT, false, st, 0);
  gl.enableVertexAttribArray(GP.aN); gl.vertexAttribPointer(GP.aN, 3, gl.FLOAT, false, st, 12);
  gl.enableVertexAttribArray(GP.aU); gl.vertexAttribPointer(GP.aU, 2, gl.FLOAT, false, st, 24);
  gl.enableVertexAttribArray(GP.aBI); gl.vertexAttribPointer(GP.aBI, 2, gl.FLOAT, false, st, 32);
  gl.enableVertexAttribArray(GP.aBW); gl.vertexAttribPointer(GP.aBW, 1, gl.FLOAT, false, st, 40);
  gl.disableVertexAttribArray(GP.aC); gl.vertexAttrib4f(GP.aC, 1, 1, 1, 0);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texGL(S.tex)); gl.uniform1i(GP.uT, 0); gl.uniform1f(GP.uSpec, S.spec || 0); gl.uniform1f(GP.uMir, 0);
  if (o.tint) gl.uniform4fv(GP.uTint, o.tint);
  for (const p of o.parts) { const ib = S.ib[p]; if (!ib) continue; const pt = S.ptex && S.ptex[p]; if (pt) gl.bindTexture(gl.TEXTURE_2D, texGL(pt)); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib.b); gl.drawElements(gl.TRIANGLES, ib.n, ib.t || gl.UNSIGNED_SHORT, 0); if (pt) gl.bindTexture(gl.TEXTURE_2D, texGL(S.tex)) }
  gl.uniform1f(GP.uSkin, 0); gl.disableVertexAttribArray(GP.aBI); gl.disableVertexAttribArray(GP.aBW); gl.enableVertexAttribArray(GP.aC);
  if (o.tint) gl.uniform4f(GP.uTint, 0, 0, 0, 0);
}
// ---- the camera and the frame
const CAM3 = { x: 0, y: 1.5, z: 0, yaw: 0, pitch: 0, fov: 1.15, roll: 0, shake: 0 };
function camV() {
  const sx = CAM3.shake ? (Math.random() - .5) * CAM3.shake * .02 : 0, sy = CAM3.shake ? (Math.random() - .5) * CAM3.shake * .02 : 0;
  return M4.chain(M4.rz(-CAM3.roll), M4.rx(-CAM3.pitch - sy), M4.ry(-CAM3.yaw - sx), M4.tr(-CAM3.x, -CAM3.y, -CAM3.z));
}
const camP = () => M4.persp(CAM3.fov, P2W / P2H, .04, 60);
function camVP() { return M4.mul(camP(), camV()) }
// the camera's own frame in the world (for things held in front of it)
function camWorld() { return M4.chain(M4.tr(CAM3.x, CAM3.y, CAM3.z), M4.ry(CAM3.yaw), M4.rx(CAM3.pitch), M4.rz(CAM3.roll)) }
const camFwd = () => [-Math.sin(CAM3.yaw) * Math.cos(CAM3.pitch), Math.sin(CAM3.pitch), -Math.cos(CAM3.yaw) * Math.cos(CAM3.pitch)];
// project a world point to UI coordinates (320x180); null if behind
function proj3(p, vm) { const VP = (vm ? LASTVPVM : LASTVP) || camVP(), x = VP[0] * p[0] + VP[4] * p[1] + VP[8] * p[2] + VP[12], y = VP[1] * p[0] + VP[5] * p[1] + VP[9] * p[2] + VP[13], w = VP[3] * p[0] + VP[7] * p[1] + VP[11] * p[2] + VP[15]; if (w < .01) return null; return [(x / w * .5 + .5) * W, (1 - (y / w * .5 + .5)) * H] }
let LASTVP = null, LASTVPVM = null;
function setLights(scn, cam) {
  const L = (scn.lights || []).filter(l => !l.off).map(l => ({ l, d: Math.hypot(l.p[0] - cam[0], l.p[1] - cam[1], l.p[2] - cam[2]) - l.r })).sort((a, b) => a.d - b.d).slice(0, NL).map(o => o.l);
  const LP = new Float32Array(NL * 3), LC = new Float32Array(NL * 3), LR = new Float32Array(NL).fill(.001);
  L.forEach((l, i) => { const fl = l.flick ? l.flick() : 1; LP.set(l.p, i * 3); LC.set(l.c.map(v => v * fl), i * 3); LR[i] = l.r });
  gl.uniform3fv(GP.uLP, LP); gl.uniform3fv(GP.uLC, LC); gl.uniform1fv(GP.uLR, LR);
}
// a scene: { objs, lights: [{p, c, r, flick}], amb, fog, fogR, glow, snap, mirrors: [{obj, p, n}], mirExtra: [objs only seen in mirrors], vm: [objs held in front of the camera] }
function render3D(scn) {
  if (!glInit()) return false;
  const f = scn.fog || [0, 0, 0];
  gl.uniform3fv(GP.uAmb, scn.amb || [.2, .2, .2]); gl.uniform1f(GP.uSnap, scn.snap ?? .5); gl.uniform3fv(GP.uFog, f); gl.uniform2fv(GP.uFogR, scn.fogR || [4, 14]); gl.uniform1f(GP.uGlow, scn.glow || 1);
  const P = camP(), V = camV(), cam = [CAM3.x, CAM3.y, CAM3.z];
  // ---- the nearest mirror you're facing gets a reflection
  for (const m of scn.mirrors || []) m.obj.mirTex = null;
  if (MIRFB && scn.mirrors) {
    let best = null, bd = 6;
    for (const m of scn.mirrors) { if (!m.obj.vis) continue; const rel = V3.sub(cam, m.p), side = V3.dot(rel, m.n), d = V3.len(rel); if (side < .05 || d > bd) continue; const fw = camFwd(); if (V3.dot(fw, V3.mul(rel, -1 / d)) < -.2 && d > 1.2) continue; best = m; bd = d }
    if (best) {
      const d0 = V3.dot(best.n, best.p), R = M4.refl(best.n, d0), rc = M4.pt(R, cam);
      gl.bindFramebuffer(gl.FRAMEBUFFER, MIRFB.fb); gl.viewport(0, 0, P2W, P2H); gl.clearColor(f[0], f[1], f[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(GP.uVP, false, M4.chain(P, V, R)); gl.uniform3fv(GP.uCam, rc); setLights(scn, rc);
      gl.uniform4f(GP.uClip, best.n[0], best.n[1], best.n[2], d0 + .004); DRAWMIR = true;
      for (const o of scn.objs) drawObj(typeof o == 'function' ? o() : o); for (const o of scn.mirExtra || []) drawObj(typeof o == 'function' ? o() : o);
      DRAWMIR = false; gl.uniform4f(GP.uClip, 0, 0, 0, -1e9); gl.bindFramebuffer(gl.FRAMEBUFFER, null); best.obj.mirTex = MIRFB.tex;
    }
  }
  // ---- the room
  gl.viewport(0, 0, P2W, P2H); gl.clearColor(f[0], f[1], f[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  LASTVP = M4.mul(P, V); gl.uniformMatrix4fv(GP.uVP, false, LASTVP); gl.uniform3fv(GP.uCam, cam); setLights(scn, cam);
  for (const o of scn.objs) drawObj(typeof o == 'function' ? o() : o);
  // ---- whatever is in your hands is drawn last, over everything, so it never sinks into a wall
  LASTVPVM = scn.vmFov ? M4.mul(M4.persp(scn.vmFov, P2W / P2H, .04, 60), V) : LASTVP;
  if (scn.vm && scn.vm.length) { gl.clear(gl.DEPTH_BUFFER_BIT); gl.uniformMatrix4fv(GP.uVP, false, LASTVPVM); for (const o of scn.vm) drawObj(typeof o == 'function' ? o() : o) }
  return true;
}
// a second pass drawn over the 2D layer: only the parts of objs that are in front of depthObjs (a thumb over a phone screen)
function renderOverlay(depthObjs, objs) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, P2W, P2H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(GP.uVP, false, LASTVPVM || LASTVP); gl.colorMask(false, false, false, false); for (const o of depthObjs) drawObj(o); gl.colorMask(true, true, true, true); for (const o of objs) drawObj(o);
}
// ---- walking around: collision against boxes, floors given by the scene, interaction by looking
const PL3 = { x: 0, y: 0, z: 0, r: .24, eye: 1.5, step: 0, bob: 0, speed: 1.55, moving: 0 };
let P2MOUSE = { dx: 0, dy: 0, x: 160, y: 90, moved: 0, click: 0, down: 0 };
const p2UIopen = () => typeof P2 != 'undefined' && (P2.ui || P2.cut);
C.addEventListener('mousemove', e => { if (typeof sc == 'undefined' || !String(sc).startsWith('p2')) return;
  const d = window.devicePixelRatio || 1;
  if (document.pointerLockElement === C) { if (p2UIopen()) { P2MOUSE.x = clamp(P2MOUSE.x + e.movementX * d / U, 0, W - 1); P2MOUSE.y = clamp(P2MOUSE.y + e.movementY * d / U, 0, H - 1); P2MOUSE.moved = 1 } else { P2MOUSE.dx += e.movementX; P2MOUSE.dy += e.movementY } }
  else { P2MOUSE.x = e.offsetX * d / U; P2MOUSE.y = e.offsetY * d / U; P2MOUSE.moved = 1 } });
C.addEventListener('mousedown', e => { if (!String(sc).startsWith('p2')) return; P2MOUSE.click = 1; P2MOUSE.down = 1; e.preventDefault();
  // only take the pointer for looking around when nothing (phone, computer, photos...) is open
  if (P2 && P2.wantLock && !P2.ui && !P2.cut && document.pointerLockElement !== C) { try { C.requestPointerLock() } catch (err) {} } });
addEventListener('mouseup', () => { P2MOUSE.down = 0 });
function p2Unlock() { P2.wantLock = false; if (document.pointerLockElement === C) try { document.exitPointerLock() } catch (e) {} }
function solidHit(x, z, y, r, sol) { for (const b of sol) { if (b.off) continue; if (y + .3 > b.y1 || y + 1.7 < b.y0) continue; if (x + r > b.x0 && x - r < b.x1 && z + r > b.z0 && z - r < b.z1) return b } return null }
function p2Walk(scn, dt, canMove = true) {
  const kf = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0), ks = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0), kt = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
  CAM3.yaw -= P2MOUSE.dx * .0026; CAM3.pitch = clamp(CAM3.pitch - P2MOUSE.dy * .0026, -1.5, 1.35); P2MOUSE.dx = P2MOUSE.dy = 0;
  if (kt) CAM3.yaw -= kt * 2.1 * dt;
  if (keys.PageUp || keys.KeyR) CAM3.pitch = Math.min(1.35, CAM3.pitch + 1.6 * dt); if (keys.PageDown || keys.KeyV) CAM3.pitch = Math.max(-1.5, CAM3.pitch - 1.6 * dt);
  let mv = 0;
  if (canMove && (kf || ks)) {
    const sp = PL3.speed * (keys.ShiftLeft || keys.ShiftRight ? 1.55 : 1) * dt, fx = -Math.sin(CAM3.yaw), fz = -Math.cos(CAM3.yaw), rx = -fz, rz = fx;
    let dx = (fx * kf + rx * ks), dz = (fz * kf + rz * ks); const l = Math.hypot(dx, dz) || 1; dx = dx / l * sp; dz = dz / l * sp;
    const sol = scn.solids || [];
    const tryMove = (nx, nz) => { const ny = scn.floorAt ? scn.floorAt(nx, nz, PL3.y) : 0; if (Math.abs(ny - PL3.y) > .45) return false; if (solidHit(nx, nz, ny, PL3.r, sol)) return false; PL3.x = nx; PL3.z = nz; PL3.y = ny; return true };
    if (!tryMove(PL3.x + dx, PL3.z + dz)) { tryMove(PL3.x + dx, PL3.z); tryMove(PL3.x, PL3.z + dz) }
    mv = 1; PL3.step += sp; if (PL3.step > .62) { PL3.step = 0; scn.onStep && scn.onStep() }
  }
  PL3.moving = mv; PL3.bob = mv ? PL3.bob + dt * 8.5 : PL3.bob * .85;
  CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.y = PL3.y + PL3.eye + Math.sin(PL3.bob) * .022 * (mv ? 1 : 0);
}
// what are you looking at? a ray from the eye against interactables (boxes), stopped by walls
function rayBox(o, d, b) { let t0 = 0, t1 = 1e9; for (let i = 0; i < 3; i++) { const inv = 1 / (d[i] || 1e-9); let a = (b[i] - o[i]) * inv, c = (b[i + 3] - o[i]) * inv; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); if (t0 > t1) return null } return t0 }
function lookAt3(scn, reach = 1.9) {
  const o = [CAM3.x, CAM3.y, CAM3.z], d = camFwd(); let best = null, bt = reach;
  for (const it of scn.inter || []) { if (it.cond && !it.cond()) continue; const t = rayBox(o, d, it.box); if (t != null && t < bt) { bt = t; best = it } }
  if (best) for (const s of scn.solids || []) { if (s.off || s.see) continue; const t = rayBox(o, d, [s.x0, s.y0, s.z0, s.x1, s.y1, s.z1]); if (t != null && t < bt - .05 && !(best.box[0] >= s.x0 - .01 && best.box[3] <= s.x1 + .01 && best.box[2] >= s.z0 - .01 && best.box[5] <= s.z1 + .01)) return null }
  return best;
}
// ---- 2D overlay text with a choice of font and an outline (subtitles)
const P2FONT2 = FONT;   // day two keeps the normal hand-written font
const CRAZY = '"Synchronicity Crazy", ' + FONT;   // the shaky font, for when it all comes apart
function ptxt(s, x, y, c = '#fff', al = 'left', sz = 8, font = FONT, ol = '#000') {
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.font = Math.round(sz * U) + 'px ' + font; X.textAlign = al; X.textBaseline = 'top';
  if (ol) { X.lineWidth = Math.max(2, U * .9); X.lineJoin = 'round'; X.strokeStyle = ol; X.strokeText(s, Math.round(x * U), Math.round(y * U)) }
  X.fillStyle = c; X.fillText(s, Math.round(x * U), Math.round(y * U)); X.restore();
}
function ptw(s, sz = 8, font = FONT) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.font = Math.round(sz * U) + 'px ' + font; const w = X.measureText(s).width / U; X.restore(); return w }
function pwrap(s, w, sz, font) { const out = []; let l = ''; for (const word of s.split(' ')) { const t = l ? l + ' ' + word : word; if (ptw(t, sz, font) > w && l) { out.push(l); l = word } else l = t } if (l) out.push(l); return out }

// ---- sound for part two: everything is synthesised, quietly
const SFX3 = {
  out(vol, pan = 0, delay = 0) { const g = AC.createGain(); g.gain.value = vol * opt.s / 10; let n = g; if (AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = clamp(pan, -1, 1); g.connect(p); p.connect(AC.destination) } else g.connect(AC.destination); return g },
  noise(dur) { const n = AC.sampleRate * dur | 0, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b },
  // a footstep: a dull thud with a little creak of the boards
  step(vol = .5, pan = 0, delay = 0, creak = 0) { if (!AC) return; const t = AC.currentTime + delay, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = SFX3.noise(.12); f.type = 'lowpass'; f.frequency.value = 260 + Math.random() * 80;
    g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); s.connect(f); f.connect(g); g.connect(SFX3.out(vol, pan)); s.start(t);
    if (creak) { const o = AC.createOscillator(), og = AC.createGain(), bf = AC.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(180 + Math.random() * 60, t); o.frequency.linearRampToValueAtTime(140 + Math.random() * 90, t + .25); bf.type = 'bandpass'; bf.frequency.value = 900; bf.Q.value = 8; og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(.25, t + .05); og.gain.linearRampToValueAtTime(0, t + .28); o.connect(bf); bf.connect(og); og.connect(SFX3.out(vol * creak, pan)); o.start(t); o.stop(t + .3) } },
  // somebody walking, somewhere: a few steps that pass from one side to the other
  walker(vol = .18) { const pan = (Math.random() - .5) * 1.8, dir = Math.random() < .5 ? -1 : 1, n = 3 + (Math.random() * 4 | 0); for (let i = 0; i < n; i++) SFX3.step(vol * (.7 + Math.random() * .4), pan + dir * i * .12, i * (.48 + Math.random() * .1), Math.random() < .3 ? .6 : 0) },
  // a whisper: breathy noise shaped into syllables, filtered like a voice, off to one side
  whisper(vol = .12, dur = 1.6, pan) { if (!AC) return; pan = pan ?? (Math.random() - .5) * 1.8; const t = AC.currentTime, s = AC.createBufferSource(), hp = AC.createBiquadFilter(), bp = AC.createBiquadFilter(), am = AC.createGain(), g = AC.createGain();
    s.buffer = SFX3.noise(dur); hp.type = 'highpass'; hp.frequency.value = 1400; bp.type = 'bandpass'; bp.Q.value = 2.5;
    let tt = t; am.gain.setValueAtTime(0, t); while (tt < t + dur - .1) { const syl = .07 + Math.random() * .13; am.gain.linearRampToValueAtTime(.5 + Math.random() * .5, tt + syl * .3); am.gain.linearRampToValueAtTime(.05, tt + syl); bp.frequency.setValueAtTime(1800 + Math.random() * 2600, tt); tt += syl + Math.random() * .05 }
    am.gain.linearRampToValueAtTime(0, t + dur); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + .2); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(hp); hp.connect(bp); bp.connect(am); am.connect(g); g.connect(SFX3.out(vol, pan)); s.start(t) },
  // a voice: syllables of a buzzy tone through vowel-like filters (the dealer is low and dead flat; phone voices are thin)
  voice(text, f0 = 120, vol = .4, flat = false, phone = false) { if (!AC) return 0; const t0 = AC.currentTime + .02, syls = Math.max(2, Math.round(text.replace(/[^a-z]/gi, '').length / 2.6)), dur = .15;
    const o = AC.createOscillator(), f1 = AC.createBiquadFilter(), f2 = AC.createBiquadFilter(), g = AC.createGain(), mix = AC.createGain(); o.type = 'sawtooth'; f1.type = f2.type = 'bandpass'; f1.Q.value = 6; f2.Q.value = 8;
    const V = [[700, 1200], [400, 2000], [300, 900], [550, 1700], [350, 2300], [600, 1000]]; let t = t0; g.gain.setValueAtTime(0, t);
    for (let i = 0; i < syls; i++) { const v = V[Math.random() * V.length | 0], d = dur * (.8 + Math.random() * .5); f1.frequency.setValueAtTime(v[0], t); f2.frequency.setValueAtTime(v[1], t); o.frequency.setValueAtTime(flat ? f0 : f0 * (.9 + Math.random() * .25), t);
      g.gain.linearRampToValueAtTime(1, t + .02); g.gain.setValueAtTime(1, t + d * .7); g.gain.linearRampToValueAtTime(.08, t + d); t += d + (Math.random() < .2 ? .12 : .01) }
    g.gain.linearRampToValueAtTime(0, t + .05); o.connect(f1); o.connect(f2); f1.connect(mix); f2.connect(mix); mix.gain.value = .5; mix.connect(g);
    let outN = g; if (phone) { const hp = AC.createBiquadFilter(), lp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500; lp.type = 'lowpass'; lp.frequency.value = 2600; g.connect(hp); hp.connect(lp); outN = lp }
    outN.connect(SFX3.out(vol)); o.start(t0); o.stop(t + .1); return t - t0 },
  ring(n = 2) { if (!AC) return; for (let i = 0; i < n; i++) for (const f of [440, 480]) { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * 3; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .02); g.gain.setValueAtTime(.12, t + 1.9); g.gain.linearRampToValueAtTime(0, t + 2); o.connect(g); g.connect(SFX3.out(.6)); o.start(t); o.stop(t + 2.05) } },
  ping() { beep(1318, .08, .6, 'sine'); setTimeout(() => beep(1760, .12, .6, 'sine'), 90) },
  click() { noiseBurst(.03, 2500, 2, .4) },
  hangup() { for (let i = 0; i < 3; i++) setTimeout(() => beep(480, .25, .5, 'sine'), i * 500) },
  crash() { noiseBurst(.5, 1800, .6, 1); noiseBurst(.3, 4200, 1, .7, .05); noiseBurst(.4, 300, .8, 1); for (let i = 0; i < 6; i++) noiseBurst(.05, 3000 + Math.random() * 3000, 4, .5, .1 + i * .06) },
  retch() { if (!AC) return; const t = AC.currentTime; for (let k = 0; k < 3; k++) { const o = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain(), tt = t + k * .55; o.type = 'sawtooth'; o.frequency.setValueAtTime(140, tt); o.frequency.linearRampToValueAtTime(90, tt + .4); f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 3; g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(.5, tt + .05); g.gain.linearRampToValueAtTime(0, tt + .42); o.connect(f); f.connect(g); g.connect(SFX3.out(.5)); o.start(tt); o.stop(tt + .45) }
    noiseBurst(.6, 700, .7, .9, 1.7); noiseBurst(.9, 300, .6, .8, 1.75) },
  door(open = true) { if (!AC) return; const t = AC.currentTime, o = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(open ? 220 : 160, t); o.frequency.linearRampToValueAtTime(open ? 150 : 240, t + .6); f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 10; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .1); g.gain.linearRampToValueAtTime(0, t + .65); o.connect(f); f.connect(g); g.connect(SFX3.out(.5)); o.start(t); o.stop(t + .7); if (!open) noiseBurst(.12, 400, .8, .6, .55) },
  locked() { noiseBurst(.06, 1200, 2, .5); noiseBurst(.06, 1000, 2, .5, .12) },
  heart(vol = .5) { beep(55, .12, vol * 2, 'sine'); setTimeout(() => beep(48, .14, vol * 2, 'sine'), 180) },
  sting() { if (!AC) return; const t = AC.currentTime; for (const f of [110, 116.5, 155]) { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.value = f; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + 2.2); o.connect(g); g.connect(SFX3.out(.6)); o.start(t); o.stop(t + 2.3) } noiseBurst(1.2, 900, .3, .6) },
};
// a quiet bed of room tone (and, later, a drone), started and stopped by the story
const AMB3 = { nodes: [], start(dark) { if (!AC) return; AMB3.stop(); const n = AC.sampleRate * 4, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < n; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3 }
    const s = AC.createBufferSource(); s.buffer = b; s.loop = true; const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 160; const g = AC.createGain(); g.gain.value = (dark ? .5 : .28) * opt.s / 10; s.connect(lp); lp.connect(g); g.connect(AC.destination); s.start(); AMB3.nodes.push(s, g);
    if (dark) { for (const f of [41, 61.5]) { const o = AC.createOscillator(), og = AC.createGain(), lfo = AC.createOscillator(), lg = AC.createGain(); o.type = 'sawtooth'; o.frequency.value = f; const lp2 = AC.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 180; og.gain.value = .05 * opt.s / 10; lfo.frequency.value = .07 + Math.random() * .05; lg.gain.value = .03 * opt.s / 10; lfo.connect(lg); lg.connect(og.gain); o.connect(lp2); lp2.connect(og); og.connect(AC.destination); o.start(); lfo.start(); AMB3.nodes.push(o, lfo, og) } } },
  stop() { for (const n of AMB3.nodes) { try { n.stop ? n.stop() : n.disconnect() } catch (e) {} try { n.disconnect() } catch (e) {} } AMB3.nodes = [] } };
