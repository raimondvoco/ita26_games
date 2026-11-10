// ==================== SLOTS (Casino Abyss) ====================
// 5 reels x 3 rows, three straight paylines. A line pays when 3+ of the same symbol run from the LEFT reel.
// Controls: left/right pick BET / SPIN / EXIT, Z to press. While the reels spin, Z stops the next reel.
const SYM = ['tears', 'jelly', 'blanket', 'toast', 'melon', 'chip'];
const PAY = { tears: [0, 0, 0, 2, 4, 8], jelly: [0, 0, 0, 3, 6, 12], blanket: [0, 0, 0, 4, 8, 18], toast: [0, 0, 0, 5, 12, 25], melon: [0, 0, 0, 8, 18, 40], chip: [0, 0, 0, 20, 60, 150] };
const WEIGHT = { tears: 6, jelly: 6, blanket: 5, toast: 4, melon: 3, chip: 1 };
let SL = null;
function makeStrip(seed) { const st = []; for (const s of SYM) for (let i = 0; i < WEIGHT[s]; i++) st.push(s); const R_ = rng(seed); for (let i = st.length - 1; i > 0; i--) { const j = R_() * (i + 1) | 0;[st[i], st[j]] = [st[j], st[i]] } return st }
function slotMachine(machine) { const sd = (machine && machine.at ? machine.at[0] * 31 + machine.at[1] : 7); SL = { strips: [0, 1, 2, 3, 4].map(i => makeStrip(sd * 13 + i * 101)), pos: [0, 1, 2, 3, 4].map(i => (sd * (i + 3)) % 25), spin: [0, 0, 0, 0, 0], stopAt: [], sel: 1, bet: 1, msg: 'Press SPIN!', win: [], t: 0, state: 'idle', flash: 0 }; sc = 'slots'; beep(880, .05) }
function slotsUpdate() {
  const L = SL; L.t++; if (L.flash > 0) L.flash--;
  if (L.state == 'idle') {
    if (lf()) { L.sel = (L.sel + 2) % 3; beep(500, .03) } if (rt()) { L.sel = (L.sel + 1) % 3; beep(500, .03) }
    if (esc()) return slotsExit();
    if (ok() && L.t > 8) {
      if (L.sel == 0) { L.bet = L.bet % 5 + 1; if (L.bet > Math.max(1, S.chips || 0)) L.bet = 1; beep(620, .04) }
      else if (L.sel == 2) return slotsExit();
      else { if ((S.chips || 0) < L.bet) { L.msg = 'Not enough Chips.'; beep(160, .2); return } S.chips -= L.bet; L.state = 'spin'; L.win = []; L.msg = ''; L.spin = [1, 1, 1, 1, 1]; L.stopAt = [0, 1, 2, 3, 4].map(i => L.t + 40 + i * 14 + (Math.random() * 10 | 0)); L.next = 0; beep(400, .1) }
    }
  } else if (L.state == 'spin') {
    for (let i = 0; i < 5; i++) if (L.spin[i]) { L.pos[i] = (L.pos[i] + .45) % L.strips[i].length; if ((tick & 3) == 0) beep(300 + i * 40, .015, .2) }
    if (ok() && L.next < 5 && L.t > L.stopAt[0] - 30) L.stopAt[L.next] = L.t;
    for (let i = 0; i < 5; i++) if (L.spin[i] && L.t >= L.stopAt[i] && (i == 0 || !L.spin[i - 1])) { L.spin[i] = 0; L.pos[i] = Math.round(L.pos[i]) % L.strips[i].length; L.next = i + 1; beep(220, .06) }
    if (L.spin.every(s => !s)) slotsPay();
  }
}
const slotAt = (L, i, row) => L.strips[i][(Math.floor(L.pos[i]) + row) % L.strips[i].length];
function slotsPay() {
  const L = SL; L.state = 'idle'; let total = 0;
  for (let row = 0; row < 3; row++) { const s0 = slotAt(L, 0, row); let n = 1; while (n < 5 && slotAt(L, n, row) == s0) n++; if (n >= 3) { const v = PAY[s0][n] * L.bet; total += v; L.win.push({ row, n, v }) } }
  if (total) { addChips(total); L.msg = 'WIN! +' + total + ' Chips'; L.flash = 60; S.fl.sl_win || flag('sl_win'); S.slotWins = (S.slotWins || 0) + 1; [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .08), i * 90)); if (L.win.some(w => slotAt(L, 0, w.row) == 'chip' && w.n == 5)) flag('jackpot') }
  else { L.msg = ['So close.', 'Again?', 'The House thanks you.', 'Nothing.', 'Hm.'][(L.t >> 3) % 5]; beep(180, .12) }
}
function slotsExit() { SL = null; sc = 'world'; beep(500, .05) }
// ---- drawing: a purple cabinet, white reel cells with crayon-style symbols, paylines, CHIPS / BET, three black buttons
function drawSym(k, cx, cy, s = 1) {
  const R_ = (x, y, w, h, c) => r(Math.round(cx + x * s), Math.round(cy + y * s), Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)), c), E_ = (x, y, rx, ry, c) => ell(cx + x * s, cy + y * s, rx * s, ry * s, c);
  if (k == 'melon') { E_(0, 2, 12, 9, '#2a7a3a'); E_(0, 1, 11, 8, '#7ad07a'); E_(0, 0, 10, 7, '#e8505a'); R_(-12, -8, 24, 8, '#f4f0f4'); for (const [x, y] of [[-5, 2], [0, 4], [5, 2], [-2, -1], [3, -1]]) R_(x, y, 1.5, 2, '#2a1a1a'); R_(-11, -1, 22, 1, '#ff7a80') }
  if (k == 'toast') { R_(-9, -8, 18, 16, '#a8642a'); E_(-5, -8, 5, 4, '#a8642a'); E_(5, -8, 5, 4, '#a8642a'); R_(-7, -6, 14, 12, '#f0c070'); E_(-4, -7, 4, 3, '#f0c070'); E_(4, -7, 4, 3, '#f0c070'); R_(-4, -2, 3, 1, '#d8a050') }
  if (k == 'blanket') { for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) R_(-11 + i * 5.5, -7 + j * 5, 5.5, 5, (i + j) & 1 ? '#f4f0f4' : '#d8303a'); R_(-11, 8, 22, 1, '#a8202a') }
  if (k == 'jelly') { E_(0, 2, 12, 9, '#1a4a9a'); E_(0, 1, 11, 8, '#5ab0e8'); R_(-11, 1, 22, 8, '#5ab0e8'); for (let i = -10; i < 10; i += 5) E_(i + 2, 9, 3, 2, '#5ab0e8'); E_(-4, -2, 2, 2.5, '#1a2a4a'); E_(4, -2, 2, 2.5, '#1a2a4a'); R_(-2, 3, 4, 1, '#1a2a4a'); E_(-6, -4, 2, 1.5, '#c8ecff') }
  if (k == 'tears') { for (const sx of [-6, 6]) { for (let d = 0; d < 6; d++) { R_(sx - 5 + d, -5 + d, 2, 2, '#2a4a9a'); R_(sx + 4 - d, -5 + d, 2, 2, '#2a4a9a') } } E_(-6, 6, 2, 3, '#5ab0e8'); E_(-6, 5, 1, 1, '#c8ecff'); E_(7, 9, 1.5, 2, '#5ab0e8') }
  if (k == 'chip') { E_(0, 3, 13, 12, '#7a1a3a'); E_(0, 1, 13, 12, '#e8306a'); for (let a = 0; a < 8; a++) { const t = a * Math.PI / 4; E_(Math.cos(t) * 10.5, 1 + Math.sin(t) * 9.5, 2.4, 2, '#f6f2f6') } E_(0, 1, 8, 7, '#f6f2f6'); E_(0, 1, 6.5, 5.5, '#ffb0c8'); R_(-3, -1, 6, 1, '#a8204a'); R_(-1, -3, 2, 6, '#a8204a'); E_(-5, -5, 2, 1.2, 'rgba(255,255,255,.7)') }
}
function slotsDraw() {
  const L = SL; sU(); r(0, 0, W, H, '#2a1460');
  for (let i = 0; i < 40; i++) r((i * 37 + L.t) % W, (i * 53) % H, 1, 1, 'rgba(255,255,255,.08)');
  // paytable
  const pays = [['chip', 'melon'], ['toast', 'blanket'], ['jelly', 'tears']];
  pays.forEach((pr, k) => { const x0 = 8 + k * 104; r(x0, 4, 98, 32, '#3a1c8a'); r(x0 + 1, 5, 96, 30, '#1a0a4a'); pr.forEach((s, j) => { const yy = 12 + j * 15; for (let n = 0; n < 3; n++) drawSym(s, x0 + 10 + n * 13, yy + 1, .42); txt('x' + PAY[s][5] + ' / x' + PAY[s][3], x0 + 92, yy - 4, '#f4f0f4', 'right', 6) }) });
  r(0, 39, W, 3, '#e8a0c8'); r(0, 142, W, 3, '#e8a0c8');
  // reels
  const CW_ = 54, GAP = 6, X0 = 13, Y0 = 46, RH = 31;
  for (let i = 0; i < 5; i++) { const x0 = X0 + i * (CW_ + GAP); r(x0 - 2, Y0 - 2, CW_ + 4, RH * 3 + 4, '#8a5ab8'); r(x0, Y0, CW_, RH * 3, '#f6f2f6');
    for (let k = 0; k < 9; k++) r(x0 + (k * 13 + i * 7) % CW_, Y0 + (k * 29) % (RH * 3), 1, 6, 'rgba(120,90,160,.10)');
    X.save(); X.beginPath(); X.rect(x0, Y0, CW_, RH * 3); X.clip(); const st = L.strips[i], fl = L.pos[i] - Math.floor(L.pos[i]);
    for (let row = -1; row < 4; row++) { const s = st[(Math.floor(L.pos[i]) + row + st.length) % st.length], cy = Y0 + RH / 2 + (row - fl) * RH; drawSym(s, x0 + CW_ / 2, cy, L.spin[i] ? .95 : 1) }
    if (L.spin[i]) { r(x0, Y0, CW_, RH * 3, 'rgba(255,255,255,.18)'); for (let k = 0; k < 6; k++) r(x0, Y0 + ((k * 17 + L.t * 9) % (RH * 3)), CW_, 1, 'rgba(120,90,160,.25)') }
    X.restore() }
  for (let row = 0; row < 3; row++) { const y = Y0 + RH / 2 + row * RH, w0 = L.win.find(w => w.row == row), c = w0 && (L.flash >> 3) % 2 ? '#ff5a8a' : 'rgba(40,20,60,.7)'; r(X0 - 4, y, 5 * (CW_ + GAP) + 2, w0 ? 2 : 1, c) }
  // chips / bet
  txt('CHIPS ' + (S.chips || 0), 20, 147, '#f4f0f4', 'left', 8); txt('BET ' + L.bet, W - 20, 147, '#f4f0f4', 'right', 8);
  if (L.msg) txt(L.msg, W / 2, 147, L.flash ? '#ffe9a0' : '#c8b8e8', 'center', 8);
  // buttons
  ['BET', 'SPIN', 'EXIT'].forEach((b, i) => { const bx = 26 + i * 96, by = 160, bw = 80; r(bx, by, bw, 18, '#fff'); r(bx + 1, by + 1, bw - 2, 16, L.sel == i && L.state == 'idle' ? '#2a2a40' : '#000'); txt(b, bx + bw / 2, by + 4, '#fff', 'center', 8); if (L.sel == i && L.state == 'idle') r(bx + 6, by + 7, 4, 4, '#fff') });
  if (L.state == 'spin') txt('Z: stop', W / 2, 165, '#c8b8e8', 'center', 6);
}
