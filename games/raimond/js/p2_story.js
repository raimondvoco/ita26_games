// ==================== PART TWO: the story ====================
// Day 1: Hitori wakes in her room. Phone, food, computer, photographs, sleep.
// The dream: a faceless man deals hands of blackjack and, a little at a time, talks.
// Day 2: the house has turned against her. Then black.
// Last: her sister comes home.
const P2 = { f: {}, day: 1, t: 0, subs: [], ui: null, cut: null, wantLock: true, font: FONT, target: null, amb: { foot: 600, whisper: 900 }, fade: 0, fadeTo: 0, blink: 0, objective: '', scene: null, name: 'Hitori', sisName: '???', d2: { rooms: {}, t: 0 } };
const SISTER = 'Hikari';   // the sister's name, said out loud for the first time at the very end
const ST2 = k => ST.get('syn_p2_' + k), ST2s = (k, v) => ST.set('syn_p2_' + k, v);
// ---------------------------------------------------------------- subtitles
// lines: 'Name|text' (a person), '|text' (what you see, in grey), '~|text' (a whisper).
// A text that starts with '~' is set in the shaky font: the moments where she (or her sister) comes apart.
function say3(lines, cb, o = {}) {
  for (const l of lines) { const i = l.indexOf('|'), who = l.slice(0, i); let text = l.slice(i + 1); const crazy = text[0] == '~'; if (crazy) text = text.slice(1);
    P2.subs.push({ who, text, crazy, t: 0, dur: o.dur || Math.round(60 * clamp(1.4 + text.length * .055, 1.8, 6.5)), voice: o.voice, phone: o.phone, f0: o.f0 }) }
  if (cb) P2.subs.push({ cb });
}
function subsTick() {
  while (P2.subs.length && P2.subs[0].cb) { const c = P2.subs.shift().cb; c() }
  const s = P2.subs[0]; if (!s) return;
  if (s.t == 0 && s.voice) SFX3.voice(s.text, s.f0 || (s.voice == 'deep' ? 58 : 150), s.voice == 'deep' ? .55 : .35, s.voice == 'deep', !!s.phone);
  s.t++;
  if (s.t > s.dur || (s.t > 12 && ok() && (!P2.ui || P2.ui.k == 'phone' || P2.ui.k == 'pol' || P2.ui.k == 'bj'))) { P2.subs.shift(); while (P2.subs.length && P2.subs[0].cb) { const c = P2.subs.shift().cb; c() } }
}
const subsBusy = () => P2.subs.some(s => !s.cb);
function drawSubs() {
  const s = P2.subs[0]; if (!s || s.cb) return; const f = s.crazy ? CRAZY : P2.font, sz = s.crazy ? 8.5 : 7.5;
  let who = s.who == 'Hikari' ? P2.sisName : s.who;
  const narr = !who, wh = who == '~';
  const side = P2.ui && P2.ui.k == 'phone', bj = P2.ui && P2.ui.k == 'bj', cx = side ? 222 : 160, bw = side ? 170 : 270;
  const lines = pwrap(s.text, bw, sz, f), y0 = (side ? 100 : bj ? 128 : 168) - lines.length * 10;
  const a = Math.min(1, s.t / 6), jit = s.crazy ? () => (Math.random() - .5) * .8 : () => 0;
  X.globalAlpha = a;
  if (who && !wh) { const nm = who.toUpperCase(); ptxt(nm, cx, y0 - 10, who == 'Hitori' ? '#e8d0d8' : who == '???' ? '#c8c8c8' : '#d8e0e8', 'center', 6, P2.font) }
  lines.forEach((l, i) => ptxt(l, cx + jit(), y0 + i * 10 + jit(), narr ? '#b8b8b8' : wh ? '#8a7a80' : s.crazy ? '#f0e0e4' : '#fff', 'center', sz, f));
  X.globalAlpha = 1;
}
// ---------------------------------------------------------------- the scene being shown
function houseScene() {
  const d = P2.day, dark = d == 2, sis = d == 3;
  const L = [];
  const add = (x, y, z, c, r, flick) => { const q = x > 30 ? [x, z] : LM(x, z, y); L.push({ p: [q[0], y, q[1]], c, r: x > 30 ? r : r * 1.3, flick }) };   // positions on the old plan, moved onto the new one
  const fl = dark ? () => (Math.random() < .04 ? .2 : 1) * (.85 + Math.sin(P2.t * .13) * .15) : null;
  if (!sis) {
    const k = dark ? [.8, .24, .2] : [.85, .7, .5], kc = dark ? [.6, .2, .24] : [.75, .8, .9];
    add(10.3, 5.3, 7.5, dark ? [.5, .12, .1] : [.6, .5, .38], 6, fl); add(11.68, 3.9, 9.62, dark ? [.6, .2, .1] : [1, .78, .5], 4.5, fl); add(11.3, 4, 7.25, dark ? [.2, .3, .5] : [.3, .45, .75], 2.6);
    add(6.2, 2.3, 7, k, 7, fl); add(10.3, 2.3, 6.5, kc, 7, fl); add(2, 2.3, 7, k, 7, fl); add(6.8, 5.3, 6, k, 7, fl); add(6.2, 2.3, 2, k, 6, fl); add(10.3, 2.3, 1.8, k, 5, fl); add(2, 5.3, 2.2, k, 5, fl); add(2, 5.3, 7, k, 6, fl); add(10.3, 5.3, 2.5, k, 5, fl); add(.4, 1.4, 9.55, dark ? [.5, .15, .1] : [.8, .6, .4], 4, fl);
  } else {
    add(11.68, 3.9, 9.62, [1, .78, .5], 5); add(10.3, 4.6, 7.5, [.35, .3, .25], 4);   // only her lamp is on
    add(12.6, 2, 6.5, [.25, .3, .42], 9); add(12.6, 5, 2.5, [.25, .3, .42], 8); add(2, 2, 10.6, [.22, .27, .4], 8); add(6.5, 2.2, 10.4, [.25, .3, .42], 7); add(6.6, 5.2, 7, [.18, .2, .28], 7);
  }
  const F = H3.fridge; if (F && !F.light.off) L.push(F.light);
  const me = meObjs(P2.pose || {});
  const objs = [H3.world, ...H3.doors.map(d => d.obj), ...Object.values(H3.extra), ...H3.mirrors.map(m => m.obj), H3.ext, dark ? eyesObj : null, dark ? shadowsObj : null, sis ? hangObj : null, P2.thrown && P2.thrown.obj, ...me.body].filter(Boolean);
  if (P2.outside) { L.length = 0; add(40, 40, 40, [.5, .52, .7], 130); add(12.8, 4.5, 8.95, [1, .75, .45], 4) }
  return { objs, mirrors: P2.outside ? null : H3.mirrors, mirExtra: me.mirror, vm: [...me.vm, ...(P2.vmExtra || [])], vmFov: P2.ui && P2.ui.k == 'phone' ? VMFOV : 0, lights: L, amb: P2.outside ? [.06, .07, .1] : dark ? [.09, .045, .055] : sis ? [.11, .12, .16] : [.17, .16, .18], fog: P2.outside ? [.02, .025, .05] : dark ? [.03, 0, .01] : [0, 0, 0], fogR: P2.outside ? [12, 60] : dark ? [2.5, 11] : [4, 15], solids: H3.solids, inter: H3.inter, floorAt: houseFloor, onStep: () => SFX3.step(.25, 0, 0, houseFloor(PL3.x, PL3.z, PL3.y) % 3 > .1 ? .5 : (Math.random() < .12 ? .3 : 0)) };
}
// world point -> camera space (for hands that reach for things in the room)
function toCam(p) { const d = V3.sub(p, [CAM3.x, CAM3.y, CAM3.z]), M = camWorld(); return [d[0] * M[0] + d[1] * M[1] + d[2] * M[2], d[0] * M[4] + d[1] * M[5] + d[2] * M[6], d[0] * M[8] + d[1] * M[9] + d[2] * M[10]] }
const ease3 = q => { q = clamp(q, 0, 1); return q * q * (3 - 2 * q) };
// ---------------------------------------------------------------- starting, checkpoints
function resetHouse() {
  for (const d of H3.doors) { d.to = d.a = d.id == 'kitchen' ? 1 : 0 } H3.extra.phonebroken.vis = false; H3.extra.phone.vis = true; H3.ext.vis = false;
  H3.fridge.a = H3.fridge.to = 0; H3.chair.x = CHX; H3.chair.z = CHZ; P2.thrown = null; ME.vm = null; P2.vmExtra = null; P2.pose = null; P2.hideBody = 0; P2.seated = 0;
  H3.brokenAt = L3P([9.5, 3.005, 5.85]); H3.extra.phonebroken.M = M4.tr(...H3.brokenAt); H3.brokenInter.box = [H3.brokenAt[0] - .15, 3, H3.brokenAt[2] - .15, H3.brokenAt[0] + .15, 3.2, H3.brokenAt[2] + .15];
}
function p2Begin(stage = 'day1') {
  initA(); buildHouse(); P2.f = {}; P2.subs = []; P2.ui = null; P2.cut = null; P2.t = 0; P2.fade = 1; P2.fadeTo = 0; P2.objective = ''; P2.sisName = '???';
  resetHouse();
  S = null; MN = null; DL = null; sc = 'p2'; P2.wantLock = true; P2.stage = stage; ST2s('stage', stage); AMB3.stop();
  if (!ST2('warned')) { P2.ui = { k: 'warn', t: 0, next: () => p2Stage(stage) }; ST2s('warned', 1); return }
  p2Stage(stage);
}
function p2Stage(stage) {
  P2.stage = stage; ST2s('stage', stage); P2.ui = null; P2.cut = null; P2.subs = []; ME.vm = null; P2.vmExtra = null; P2.pose = null; P2.hideBody = 0; P2.seated = 0; P2.wantLock = true;
  if (stage == 'day1') { P2.day = 1; P2.font = FONT; P2.name = 'Hitori'; P2.scene = 'house'; AMB3.start(false); P2.amb = { foot: 1200, whisper: 1800 }; startWake() }
  if (stage == 'dealer') { P2.day = 1.5; P2.font = FONT; AMB3.stop(); startDealer() }
  if (stage == 'day2') { P2.day = 2; P2.font = FONT; P2.scene = 'house'; P2.f = { thrown: 1, vomited: 1, history: 1, polaroids: 1 }; H3.extra.phonebroken.vis = true; H3.extra.phone.vis = false; AMB3.start(true); P2.amb = { foot: 300, whisper: 260 }; P2.d2 = { rooms: {}, t: 0 }; eyesInit(); startDay2() }
  if (stage == 'sister') { P2.day = 3; P2.font = FONT; P2.scene = 'house'; P2.f = { thrown: 1 }; H3.extra.phonebroken.vis = true; H3.extra.phone.vis = false; AMB3.start(false); P2.amb = { foot: 0, whisper: 0 }; startSister() }
}
// where the desk chair and the fridge ended up on the new plan (cutscenes work relative to them)
const [CHX, CHZ] = LM(10.95, 7.25, 3), [FRX, FRZ] = LM(11.58, 8.75, 0);
// ---------------------------------------------------------------- DAY 1
function startWake() {
  [PL3.x, PL3.z] = LM(10.15, 8.85, 3); PL3.y = 3; CAM3.yaw = -Math.PI / 2; CAM3.pitch = 0; P2.blink = 1; P2.hideBody = 1;
  P2.cut = { k: 'wake', t: 0 };
  say3(['|...', 'Hitori|...Huh.', 'Hitori|How long was I asleep?', 'Hitori|It feels like... days. Weeks.', 'Hitori|I was somewhere else. There were trees. A beach. A city full of lights.', 'Hitori|...It\'s already going.', 'Hitori|Where is everyone?'], () => { P2.cut = null; P2.hideBody = 0; P2.objective = 'Where is everyone? My phone...' });
}
function wakeCut(c) {   // lying in bed looking at the ceiling, eyes opening, then sitting up and standing
  const t = ++c.t, q = clamp((t - 200) / 120, 0, 1), e = q * q * (3 - 2 * q);
  const lie = L3P([9.2, 3.72, 9.35]), stand = L3P([10.15, 4.5, 8.85]);
  CAM3.x = lie[0] + (stand[0] - lie[0]) * e; CAM3.y = lie[1] + (stand[1] - lie[1]) * e; CAM3.z = lie[2] + (stand[2] - lie[2]) * e;
  CAM3.pitch = 1.35 * (1 - e) + -.1 * e; CAM3.yaw = -Math.PI / 2 * e + .4 * (1 - e);
  P2.blink = t < 40 ? 1 : t < 70 ? 1 - (t - 40) / 30 : t < 80 ? (t - 70) / 10 : t < 95 ? 1 - (t - 80) / 15 : t < 150 ? 0 : t < 156 ? (t - 150) / 6 : t < 165 ? 1 - (t - 156) / 9 : 0;
  if (q >= 1) { PL3.x = stand[0]; PL3.z = stand[2]; PL3.y = 3 }
}
const P2S = {
  frontLocked() { return null },
  hitoriDoorLocked() { if (P2.day == 3 && !P2.f.found) { P2S.found(); return 'skip' } return null },
  sisterLocked() { return P2.day == 2 ? 'Hitori|Locked. ...It\'s never locked.' : null },
  look(id) { const L = (P2.day == 2 ? LOOK2[id] : P2.day == 3 ? LOOK3[id] : null) || LOOK1[id]; if (!L) return; say3(typeof L == 'function' ? L() : L) },
  pills() {
    if (P2.day == 3) return say3(['Hikari|Her pills.', '|The bottle is full. The seal has never been broken.', 'Hikari|...Oh, Hitori.', 'Hikari|You stopped. When I left, you just... stopped.']);
    if (P2.day == 2) return say3(['|The bottle is still full.', 'Hitori|He said I should take them.', 'Hitori|~Not with them watching me. Not with them WATCHING me.']);
    if (P2.f.pills) return say3(['|Still full.']);
    P2.f.pills = 1; say3(['|A bottle of pills on the nightstand. Her name is on the label. Take one tablet daily.', '|The seal has never been broken.', 'Hitori|...I\'m supposed to be taking these. I think.', 'Hitori|I don\'t remember the last time I did.']);
  },
  phone() {
    if (P2.f.thrown) return;
    H3.extra.phone.vis = false; P2.ui = { k: 'phone', mode: 'contacts', sel: 0, t: 0, who: 'h', lift: 0 }; p2Unlock(); SFX3.click();
    if (!P2.f.phoneSeen) { P2.f.phoneSeen = 1; say3(['Hitori|No messages. Nothing. Not one.', 'Hitori|...Why can\'t I read their names?']) }
  },
  fridge() {
    if (P2.day == 3) return fridgeOpen(['Hikari|...It\'s almost empty.', 'Hikari|What have you been eating?']);
    if (P2.day == 2) return fridgeOpen(['|Inside, everything has gone grey and soft. Something in the back is breathing.', 'Hitori|~Nope. No. Close it. CLOSE IT.']);
    if (!P2.f.thrown) return say3(['|The fridge hums. There\'s a photo of the cat stuck to the door, and a yellow note.', 'Hitori|I should find my phone first.']);
    if (P2.f.vomited) return fridgeOpen(['|Takeout boxes. Something that used to be milk.', 'Hitori|...I\'m not hungry anymore.']);
    fridgeOpen(['|Cold rice. Half a tin of something. Takeout that\'s gone hard at the edges.', 'Hitori|...That\'ll do.'], () => { P2.cut = { k: 'eat', t: 0 } }, true);
  },
  computer() {
    if (P2.day == 2) return say3(['|The screen shows your bedroom from behind. The chair in the picture is empty.', '|In the picture, the door is open. Behind you, the door is open.', 'Hitori|~...Turn it off. TURN IT OFF.']);
    if (P2.day == 3) return say3(['Hikari|Her computer\'s still on.', 'Hikari|...I can\'t look at that right now.']);
    if (!P2.f.vomited) return say3(['Hitori|...Later. I feel like I\'m going to throw up.']);
    P2.cut = { k: 'sit', t: 0 };
  },
  polaroids() {
    if (P2.day == 2) return say3(['|All the photographs have turned to face the wardrobe door.', 'Hitori|~I didn\'t do that. I didn\'t— who did that? WHO DID THAT?']);
    if (P2.day == 3) return say3(['Hikari|She kept them. All of them.', 'Hikari|...That one\'s me. She kept the one of me.']);
    P2.ui = { k: 'pol', i: 0, t: 0, seen: {}, open: 0 }; p2Unlock(); pageTurn();
  },
  bed() {
    if (P2.day == 2) return say3(['Hitori|No. If I sleep he\'ll be there. Or worse, he won\'t.']);
    if (P2.day == 3) return say3(['Hikari|...']);
    if (!P2.f.polaroids) return say3(['Hitori|I just woke up. I don\'t want to lie back down yet.']);
    P2.cut = { k: 'sleep', t: 0 }; P2.hideBody = 1;
    say3(['Hitori|...I\'m so tired.', 'Hitori|Please. Just let me sleep without dreaming.']);
  },
};
const LOOK1 = {
  hallmirror: ['Hitori|I look like shit.', 'Hitori|...When did I get so thin?'],
  tv: ['|Static. The remote is nowhere.', 'Hitori|Nothing\'s on. Nothing\'s ever on.'],
  books: ['|Picture books, school books, a dictionary with a broken spine.', '|Two names are written inside the covers. One of them has been scraped off with a key.'],
  familyphoto: ['|Five people squeezed onto the couch. You, Steven, Caroline, Uku, and—', '|The fifth face is a smear of light.', 'Hitori|...There were only ever four of us.'],
  landline: ['|The landline. No dial tone. It\'s unplugged.', 'Hitori|Mom always said we\'d need it in an emergency.'],
  backdoor: ['|The back door. It\'s stuck in its frame.', 'Hitori|...I haven\'t been outside in a long time, have I.'],
  frontdoor: ['Hitori|...No. I don\'t want to go out there.'],
  ksink: () => P2.f.vomited ? ['Hitori|...Gross. I should clean that.', 'Hitori|Later.'] : ['|Dirty dishes. A lot of them. Weeks of them.'],
  mirror: ['|Dark circles. Hair everywhere.', 'Hitori|Who even are you.'],
  brokenphone: ['|The screen is spiderwebbed. It won\'t turn on.', 'Hitori|...Good.'],
  games: ['|Her console, a controller, a little stack of games.', 'Hitori|We used to play these together. Me and...', 'Hitori|...Me and who?'],
  sisbox: ['|A cardboard box. Someone wrote a name on it in marker, then scribbled over it until the cardboard tore.'],
  sisroom: ['|A bare mattress. Pale squares on the wall where posters used to hang.', '|This room has been empty a long time.', 'Hitori|...Whose room was this?'],
  parents: ['|Mom and Dad\'s room. The bed is made. Dust sheets over the chairs.', 'Hitori|They\'re away. They\'re always away.'],
};
const LOOK2 = {
  hallmirror: ['|Your reflection moves a second after you do.', 'Hitori|~Stop it. Stop it, stop it.'],
  tv: ['|The static is whispering your name, very quietly, over and over.'],
  mirror: ['|Your reflection is a beat behind you. When you stop, it keeps going for a moment.', 'Hitori|~Fuck. Fuck, fuck, fuck.'],
  familyphoto: ['|Every face in the photo has been scratched out except yours.'],
  sisroom: ['|The mattress has a dent in it, like someone was just lying there.', 'Hitori|~Who\'s here? WHO\'S HERE?'],
  parents: ['|The dust sheets are shaped like people sitting very still.', 'Hitori|...I\'m not looking. I\'m not looking.'],
  brokenphone: ['|The broken screen lights up for a moment. 37 missed calls. Then it\'s dark again.'],
  games: ['|The controller is warm.'],
  ksink: ['|The tap is running. You didn\'t turn it on.'],
  landline: ['|The unplugged phone is ringing.', '|When you lift it, there is only breathing.'],
  backdoor: ['|Something on the other side is scratching, slowly, at the height of your face.'],
  frontdoor: ['|There\'s breathing on the other side of the door. Slow. Patient.'],
};
const LOOK3 = {
  hallmirror: ['Hikari|...I look like her.'],
  tv: ['Hikari|The TV\'s been left on. Just static.'],
  ksink: ['Hikari|Oh god, what is that smell.', 'Hikari|Hitori, are you sick?'],
  familyphoto: ['Hikari|That\'s us. All five of us.', 'Hikari|...The flash got my face. It always did.'],
  books: ['Hikari|Our old books. I scratched my name out of mine the night I left.', 'Hikari|...I was so angry.'],
  brokenphone: ['Hikari|Her phone. It\'s smashed.'],
  sisroom: ['Hikari|My room. She didn\'t touch anything.'],
  sisbox: ['Hikari|My things. I meant to come back for them.'],
  parents: ['Hikari|Still away. Of course they\'re still away.'],
  games: ['Hikari|She was still playing our games. By herself.'],
  mirror: ['Hikari|...'],
  landline: ['Hikari|Unplugged.'],
  backdoor: ['Hikari|Stuck. Like always.'],
  frontdoor: ['Hikari|I\'m not leaving. Not again.'],
};
// ---------------------------------------------------------------- the fridge: walk up, reach for the handle, pull it open
function fridgeOpen(lines, after, keepOpen) { P2.cut = { k: 'fridge', t: 0, lines, after, keepOpen, from: [CAM3.x, CAM3.y, CAM3.z, CAM3.yaw, CAM3.pitch] } }
function fridgeCut(c) {
  const t = ++c.t, F = H3.fridge, to = [FRX - 1.03, PL3.y + GIRL.eye, FRZ + .07, -HP - .15, -.32], e = ease3(t / 40);
  CAM3.x = c.from[0] + (to[0] - c.from[0]) * e; CAM3.y = c.from[1] + (to[1] - c.from[1]) * e; CAM3.z = c.from[2] + (to[2] - c.from[2]) * e;
  const dy = Math.atan2(Math.sin(to[3] - c.from[3]), Math.cos(to[3] - c.from[3])); CAM3.yaw = c.from[3] + dy * e; CAM3.pitch = c.from[4] + (to[4] - c.from[4]) * e;
  if (t == 40) { PL3.x = to[0]; PL3.z = to[2] }
  // the hand: up from the side, onto the handle, pulls with the door, lets go
  const handle = () => M4.pt(F.main.M, [-.74, 1.0, -.1]);
  const rest = [.2, -.42, -.12], grab = toCam(handle());
  if (t > 30 && t < 175) { const q = t < 70 ? ease3((t - 30) / 40) : t < 125 ? 1 : 1 - ease3((t - 125) / 50), at = V3.lerp(rest, grab, q);
    ME.vm = { R: vmArm(1, at, [.1, .95, .2], [0, 0, -1], q > .9 ? .85 : .35, [1, -.6, .5]) } } else ME.vm = null;
  if (t == 70) { F.to = 1; noiseBurst(.25, 600, .6, .5); setTimeout(() => noiseBurst(.4, 4000, .25, .25), 120) }
  if (t == 120 && c.lines) say3(c.lines, () => { c.said = 1 });
  if (c.said && t > 150) { if (!c.keepOpen) { F.to = 0; noiseBurst(.15, 500, .9, .5, .5) } ME.vm = null; P2.cut = null; if (c.after) c.after() }
}
// eating, and not keeping it down
function eatCut(c) {
  const t = ++c.t;
  if (t == 1) { P2.fadeTo = 1; say3(['|She eats standing up, straight from the containers, fast.'], null, { dur: 200 }) }
  if (t == 60) { H3.fridge.to = H3.fridge.a = 0 }
  if (t > 40 && t < 200 && t % 23 == 0) noiseBurst(.08, 500 + Math.random() * 300, 1, .25);
  if (t == 200) { P2.fadeTo = 0; [PL3.x, PL3.z] = LM(10.9, 5.6, 0); PL3.y = 0; CAM3.yaw = -Math.PI / 2; CAM3.pitch = -.1 }
  if (t > 200) { const w = Math.min(1, (t - 200) / 120); CAM3.roll = Math.sin(t / 17) * .08 * w; CAM3.pitch = -.1 + Math.sin(t / 23) * .05 * w; CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.y = 1.5 }
  if (t == 230) { say3(['Hitori|...', 'Hitori|Oh no.']); SFX3.heart(.6) }
  if (t > 230 && t < 380 && t % 40 == 0) SFX3.heart(.6);
  if (t == 380) { SFX3.retch(); CAM3.shake = 6 }
  if (t > 380 && t < 470) { CAM3.pitch += (-1.0 - CAM3.pitch) * .08; { const q2 = LM(11.0, 6.1, 0); CAM3.x += (q2[0] - CAM3.x) * .05; CAM3.z += (q2[1] - CAM3.z) * .05 } const q = ease3((t - 380) / 40); ME.vm = { L: vmArm(-1, [-.16, -.3 + q * .1, -.3], [0, .3, -1], [1, 0, 0], .2, [-1, -.5, .3]), R: vmArm(1, [.16, -.3 + q * .1, -.3], [0, .3, -1], [-1, 0, 0], .2) } }
  if (t == 470) { CAM3.shake = 0; ME.vm = null; say3(['|She makes it to the sink. Barely.', 'Hitori|...', 'Hitori|What\'s wrong with me.']) }
  if (t > 470 && t < 620) { CAM3.pitch += (-.2 - CAM3.pitch) * .03; CAM3.roll *= .97 }
  if (t == 640) { SFX3.walker(.6); SFX3.whisper(.35, 2.2, -.7) }
  if (t == 700) { CAM3.yaw = -Math.PI / 2; say3(['Hitori|...Hello?', 'Hitori|Is someone in here?', '|Nothing. The fridge hums.', 'Hitori|~I heard you. I fucking HEARD you.', 'Hitori|...', 'Hitori|Okay. Okay. Something normal. My computer.'], () => { P2.cut = null; CAM3.roll = 0; PL3.x = CAM3.x; PL3.z = CAM3.z; P2.f.vomited = 1; P2.objective = 'My computer. Something normal.'; P2.amb = { foot: 700, whisper: 900 } }) }
}
// ---------------------------------------------------------------- the computer: pull the chair out, sit down, hands on the keyboard
function sitCut(c) {
  const t = ++c.t, Ch = H3.chair;
  if (t == 1) c.from = [CAM3.x, CAM3.y, CAM3.z, CAM3.yaw, CAM3.pitch];
  const stand = [CHX - .7, 3 + GIRL.eye, CHZ + .1, -HP, -.42], seat = [CHX + .02, 3 + 1.12, CHZ, -HP, -.3];
  const L3 = (a, b, q) => { CAM3.x = a[0] + (b[0] - a[0]) * q; CAM3.y = a[1] + (b[1] - a[1]) * q; CAM3.z = a[2] + (b[2] - a[2]) * q; CAM3.yaw = a[3] + Math.atan2(Math.sin(b[3] - a[3]), Math.cos(b[3] - a[3])) * q; CAM3.pitch = a[4] + (b[4] - a[4]) * q };
  if (t <= 40) L3(c.from, stand, ease3(t / 40));
  // reach for the back of the chair and pull it towards you
  const back = () => [Ch.x - .27, 3.98, Ch.z];
  if (t > 30 && t <= 110) { const q = t < 60 ? ease3((t - 30) / 30) : t < 95 ? 1 : 1 - ease3((t - 95) / 15), at = V3.lerp([.22, -.42, -.1], toCam(back()), q); ME.vm = { R: vmArm(1, at, [.2, .3, -1], [0, -1, 0], q > .9 ? .9 : .3, [1, -.4, .5]) } }
  if (t > 60 && t <= 95) { Ch.x = CHX - .4 * ease3((t - 60) / 35); if (t == 61) noiseBurst(.6, 300, .5, .4) }
  if (t == 110) ME.vm = null;
  // sit: the camera drops into the chair while it rolls back in under you
  if (t > 110 && t <= 170) { const q = ease3((t - 110) / 60); L3(stand, seat, q); Ch.x = CHX - .4 + .4 * q; P2.pose = { sit: q > .5 ? 1 : 0, x: q > .5 ? Ch.x : undefined, z: q > .5 ? Ch.z : undefined, y: q > .5 ? 3 : undefined, yaw: -HP } }
  if (t > 140) { const kb = [CHX + .41, 3.79, CHZ - .12], ms = [CHX + .45, 3.79, CHZ + .43], q = ease3((t - 140) / 30);
    P2.pose = { sit: 1, lean: -.22 * q, x: Ch.x, z: Ch.z, y: 3, yaw: -HP, hands: { L: { at: V3.lerp([Ch.x + .2, 3.66, Ch.z - .17], kb, q), fing: [1, -.25, .05], palm: [0, -1, 0], curl: .25 }, R: { at: V3.lerp([Ch.x + .2, 3.66, Ch.z + .17], ms, q), fing: [1, -.25, 0], palm: [0, -1, 0], curl: .4 } } } }
  if (t > 178 && t <= 200) { CAM3.fov = 1.15 - ease3((t - 178) / 22) * .35 }
  if (t == 200) { P2.seated = 1; P2.ui = pcOpen(); P2.cut = null; CAM3.fov = 1.15; p2Unlock() }
}
function standCut(c) {   // closing the computer: push back, stand up
  const t = ++c.t, Ch = H3.chair, seat = [CHX + .02, 3 + 1.12, CHZ, -HP, -.3], stand = [CHX - .7, 3 + GIRL.eye, CHZ, -HP, -.05];
  const q = ease3(t / 50); CAM3.x = seat[0] + (stand[0] - seat[0]) * q; CAM3.y = seat[1] + (stand[1] - seat[1]) * q; CAM3.z = seat[2] + (stand[2] - seat[2]) * q; CAM3.yaw = -HP; CAM3.pitch = seat[4] + (stand[4] - seat[4]) * q;
  if (t < 30) { Ch.x = CHX - .3 * ease3(t / 30); P2.pose = { sit: 1, x: Ch.x, z: Ch.z, y: 3, yaw: -HP } } else P2.pose = null;
  if (t == 2) noiseBurst(.5, 300, .5, .35);
  if (t == 50) { PL3.x = stand[0]; PL3.z = stand[2]; PL3.y = 3; P2.cut = null; P2.seated = 0; P2.wantLock = true; if (c.after) c.after() }
}
function sleepCut(c) {
  const t = ++c.t;
  if (t < 140) { { const q2 = LM(9.2, 9.3, 3); CAM3.x += (q2[0] - CAM3.x) * .04; CAM3.y += (3.75 - CAM3.y) * .04; CAM3.z += (q2[1] - CAM3.z) * .04 } CAM3.pitch += (1.3 - CAM3.pitch) * .04 }
  if (t > 260) P2.blink = Math.min(1, (t - 260) / 60);
  if (t == 380) { AMB3.stop(); p2Stage('dealer') }
}
// ---------------------------------------------------------------- the phone (held in her hand; the screen is drawn onto it)
const PHONEBOOK = [{ n: 'Caroline', k: 1 }, { n: 'Mom', k: -1 }, { n: 'Steven', k: 0 }, { n: 'Uku', k: 3 }, { n: '♡', k: -2 }];
// what the friends say: they're not angry that she misses someone. They're hurt and frightened by what she did
// to them in the weeks after her sister left and she stopped taking her medication. She doesn't remember any of it.
const CALLS = {
  Caroline: [['f', '...Hitori?'], ['h', 'Caroline! Hey. I think I slept for a really long time, and—'], ['f', 'You called me eleven times on Tuesday night. Do you know that?'], ['f', 'You left me a voicemail screaming that I took her. That I was hiding her from you.'], ['h', 'Took WHO? Hiding who?'], ['f', '...You really don\'t remember.'], ['f', 'Please take your meds, Hitori. Please. I can\'t do this again. I have to go.']],
  Steven: [['f', '...'], ['h', 'Steven? Hello?'], ['f', 'Why are you calling me.'], ['h', 'Because nobody\'s here. Where is everyone?'], ['f', 'You came to my house at three in the morning. You were hitting the windows. You wouldn\'t stop.'], ['f', 'My mom almost called the police, Hitori.'], ['h', '...What? No. I wouldn\'t—'], ['f', 'Don\'t call this number again.']],
  Uku: [['f', 'Yo, who\'s— ...oh. It\'s you.'], ['h', 'Uku, what\'s going on? Why is everyone being weird?'], ['f', 'Weird. Right.'], ['f', 'You told me I was "one of them." That I was listening to you through the walls.'], ['f', 'You threw a glass at my head, man.'], ['h', 'I don\'t remember any of that, I swear—'], ['f', 'Yeah. You never do. I\'m done.']],
  Mom: [['x', 'The person you are calling is not available. Please try again later.']],
  '♡': [['x', 'The number you have dialled is no longer in service.'], ['h', '...Who is that? Why do I have a heart in my contacts?']],
};
const TEXTS = ['stop calling us', 'you said we were in the walls. you said we TOOK her', 'caroline cried for two days after what you said to her', 'nobody is whispering about you hitori', 'take your fucking meds', 'seriously, go fuck yourself', 'dont come to my house again'];
// the sister's calls, at the end: the same three, who now answer properly
const CALLS3 = {
  Steven: [['f', '...Hello?'], ['h', 'Steven. It\'s me.'], ['f', '...Hikari?', 'name'], ['f', 'Holy shit. You\'re back? Where the hell did you go?'], ['h', 'Hitori\'s... Hitori is...'], ['f', 'What? What happened?'], ['h', 'Why was she alone? Why didn\'t anyone tell me?'], ['f', 'After you left she stopped taking her pills. She stopped sleeping. She stopped... being her.'], ['f', 'She said we were whispering about her. That we were in the walls. That we\'d done something to you.'], ['f', 'She screamed at Uku. She said things to Caroline I can\'t even repeat. We tried. We fucking tried.'], ['f', '...Then we just stopped picking up.']],
  Caroline: [['f', 'Hikari? Oh my god. Hikari, where are you?', 'name'], ['h', 'Home. With her.'], ['f', 'Is she okay? Please tell me she\'s okay.'], ['h', '...'], ['f', 'No. No, no, no.'], ['f', 'She wasn\'t herself. She called me a liar, a thief, she said I\'d hidden you somewhere. I was scared of her, Hikari.'], ['f', 'We thought if we stopped answering she\'d... get help. Oh god. This is our fault.']],
  Uku: [['f', '...Yeah?'], ['h', 'Uku.'], ['f', 'Hikari. ...Shit. You\'re actually back.', 'name'], ['h', 'She\'s gone, Uku.'], ['f', '...'], ['f', 'She wasn\'t taking anything. She was hearing things. She threw a glass at me and then she cried and said she didn\'t know why.'], ['f', 'The last thing I ever said to her was to go fuck herself.'], ['f', 'I\'m sorry. I\'m so fucking sorry.']],
};
function blurName(n) {   // the name, squashed into a few blocks so it can't be read
  const a = blurName.a || (blurName.a = document.createElement('canvas')), b = blurName.b || (blurName.b = document.createElement('canvas')); a.width = 40; a.height = 8; b.width = 9; b.height = 2;
  const g = a.getContext('2d'); g.clearRect(0, 0, 40, 8); g.fillStyle = '#ddd'; g.font = 'bold 7px monospace'; g.fillText(n, 1, 7);
  const h = b.getContext('2d'); h.clearRect(0, 0, 9, 2); h.imageSmoothingEnabled = true; h.drawImage(a, 0, 0, 40, 8, 0, 0, 9, 2);
  g.clearRect(0, 0, 40, 8); g.imageSmoothingEnabled = false; g.drawImage(b, 0, 0, 9, 2, 0, 0, 40, 8); return a }
function phoneList() { return P2.day == 3 ? [{ n: 'Caroline', k: 1 }, { n: 'Steven', k: 0 }, { n: 'Uku', k: 3 }] : PHONEBOOK }
// the screen is 60 x 131 units; PH maps them onto the phone in the 3D view
const PH = { w: 60, h: 131, ok: false };
function phoneMap(cs) {
  if (!cs || cs.some(c => !c)) { PH.ok = false; return } const [a, b, , d] = cs;
  PH.o = a; PH.ax = [(b[0] - a[0]) / PH.w, (b[1] - a[1]) / PH.w]; PH.ay = [(d[0] - a[0]) / PH.h, (d[1] - a[1]) / PH.h]; PH.ok = true;
  const det = PH.ax[0] * PH.ay[1] - PH.ax[1] * PH.ay[0]; PH.inv = [PH.ay[1] / det, -PH.ay[0] / det, -PH.ax[1] / det, PH.ax[0] / det];
}
const phLocal = (x, y) => { const dx = x - PH.o[0], dy = y - PH.o[1]; return [PH.inv[0] * dx + PH.inv[1] * dy, PH.inv[2] * dx + PH.inv[3] * dy] };
function phT() { X.setTransform(U * PH.ax[0], U * PH.ax[1], U * PH.ay[0], U * PH.ay[1], U * PH.o[0], U * PH.o[1]) }
const phR = (x, y, w, h, c) => { phT(); X.fillStyle = c; X.fillRect(x, y, w, h) };
function phRR(x, y, w, h, rr, c) { phT(); X.fillStyle = c; X.beginPath(); X.roundRect ? X.roundRect(x, y, w, h, rr) : X.rect(x, y, w, h); X.fill() }
function phC(x, y, r2, c) { phT(); X.fillStyle = c; X.beginPath(); X.arc(x, y, r2, 0, 7); X.fill() }
function phTxt(s, x, y, c = '#fff', sz = 5, al = 'left', font = FONT) { phT(); X.font = sz + 'px ' + font; X.textAlign = al; X.textBaseline = 'top'; X.fillStyle = c; X.fillText(s, x, y) }
function phAvatar(x, y, r2, face) {
  phC(x, y, r2, '#24222c'); phT(); X.save(); X.beginPath(); X.arc(x, y, r2, 0, 7); X.clip();
  if (face && ready(PORTRAITS[face + ':neutral'])) { X.imageSmoothingEnabled = true; X.drawImage(PORTRAITS[face + ':neutral'], x - r2 * 1.2, y - r2 * 1.05, r2 * 2.4, r2 * 2.4) }
  else { X.fillStyle = '#0a090e'; X.beginPath(); X.ellipse(x, y - r2 * .25, r2 * .38, r2 * .42, 0, 0, 7); X.fill(); X.beginPath(); X.ellipse(x, y + r2 * .85, r2 * .75, r2 * .55, 0, 0, 7); X.fill() }
  X.restore();
}
function phoneUpdate(u) {
  u.t++; const list = phoneList(), sis = P2.day == 3;
  if (u.closing) { u.lift -= .075; if (u.lift <= 0) { P2.ui = null; H3.extra.phone.vis = true; P2.wantLock = true } P2MOUSE.click = 0; P2MOUSE.moved = 0; return }   // lowering it, then it's away
  u.lift = Math.min(1, u.lift + .06);
  const m = PH.ok ? phLocal(P2MOUSE.x, P2MOUSE.y) : [-99, -99]; u.mouse = m;
  if (u.mode == 'contacts') {
    if (up()) u.sel = (u.sel + list.length - 1) % list.length; if (dn()) u.sel = (u.sel + 1) % list.length;
    let clicked = -1; list.forEach((c, i) => { const y = 24 + i * 19; if (m[0] > 2 && m[0] < 58 && m[1] > y - 2 && m[1] < y + 17) { if (P2MOUSE.moved) u.sel = i; if (P2MOUSE.click) clicked = i } });
    if ((ok() || clicked >= 0) && !subsBusy() && u.lift >= 1) { if (clicked >= 0) u.sel = clicked; startCall(u, list[u.sel]) }
    if ((esc() || hit.KeyX || (P2MOUSE.click && m[1] > 116 && m[1] < 131 && !sis)) && !sis && !P2.f.texting && u.lift >= 1) { u.closing = 1; SFX3.click() }
  } else if (u.mode == 'call') {
    u.ct++;
    if (u.ct == 1) SFX3.ring(1);
    if (u.ct == 150) { SFX3.click(); u.connected = 1; const scr = (sis ? CALLS3 : CALLS)[u.c.n] || [];
      scr.forEach(([w, t, tag]) => { say3([(w == 'h' ? (sis ? 'Hikari' : 'Hitori') : w == 'x' ? '' : u.c.n) + '|' + t], null, { voice: w == 'f' ? 'friend' : null, phone: true, f0: u.c.n == 'Steven' ? 115 : u.c.n == 'Uku' ? 130 : 210 }); if (tag == 'name') P2.subs.push({ cb: () => { P2.sisName = SISTER } }) });
      P2.subs.push({ cb: () => { SFX3.hangup(); u.ended = u.ct } });
    }
    if (u.ended && u.ct > u.ended + 60) { u.mode = 'contacts'; u.ended = 0; u.connected = 0; (u.called = u.called || {})[u.c.n] = 1; afterCall(u) }
  } else if (u.mode == 'texts') {
    u.tt++; if (u.tt % 55 == 0 && u.shown < TEXTS.length) { u.shown++; SFX3.ping(); CAM3.shake = 1 }
    if (u.tt % 55 == 8) CAM3.shake = 0;
    if (u.shown >= TEXTS.length && !u.said) { u.said = 1; say3(['Hitori|~What... what the fuck is this?', 'Hitori|In the walls? I never— I wouldn\'t—', 'Hitori|~Took WHO? Who did I say you TOOK?!', 'Hitori|~WHAT DID I DO?!'], () => { u.mode = 'throw'; u.th = 0 }) }
  } else if (u.mode == 'throw') phoneThrow(u);
  P2MOUSE.click = 0; P2MOUSE.moved = 0;
}
function startCall(u, c) { u.mode = 'call'; u.c = c; u.ct = 0; u.connected = 0; u.ended = 0; SFX3.click() }
function afterCall(u) {
  const sis = P2.day == 3, need = ['Caroline', 'Steven', 'Uku'];
  if (need.every(n => u.called[n])) {
    if (!sis && !P2.f.texting) { P2.f.texting = 1; say3(['Hitori|...That isn\'t me. I wouldn\'t do any of that.', 'Hitori|...Would I?'], () => { u.mode = 'texts'; u.tt = 0; u.shown = 0 }) }
    if (sis && !u.done) { u.done = 1; say3(['Hikari|...She needed me.', 'Hikari|And I left her here.', 'Hikari|~I left her all alone.'], () => { P2.ui = null; P2.cut = { k: 'panout', t: 0 } }) }
  } else if (!sis && u.c.n == 'Caroline' && !u.r1) { u.r1 = 1; say3(['Hitori|...Hiding who? I don\'t understand.']) }
}
// the throw: the arm winds back and whips forward, the phone flies across the room and breaks against whatever it hits
function phoneThrow(u) {
  const t = ++u.th;
  if (t == 1) SFX3.whisper(.2, 1);
  if (t == 26) { const L = phoneVM(u.t, [.02, .1, -.2]), W = M4.mul(camWorld(), L), p = M4.pt(W, [0, 0, 0]), f = camFwd();
    P2.thrown = { p, v: [f[0] * 9, f[1] * 9 + 1.2, f[2] * 9], spin: 0, obj: { groups: H3.extra.phoneHand.groups, M: W, vis: true } }; noiseBurst(.15, 900, 1.5, .4) }
  const T = P2.thrown;
  if (T && !T.hit) { const dt = 1 / 60; for (let k = 0; k < 4; k++) { const np = V3.add(T.p, V3.mul(T.v, dt / 4)); T.v[1] -= 9.8 * dt / 4;
      const floor = houseFloor(np[0], np[2], PL3.y) + .02, wall = H3.solids.find(b => !b.off && np[0] > b.x0 && np[0] < b.x1 && np[2] > b.z0 && np[2] < b.z1 && np[1] > b.y0 && np[1] < b.y1);
      if (wall || np[1] < floor) { T.hit = 1; const back = V3.norm([T.v[0], 0, T.v[2]]); let bp = V3.sub(T.p, V3.mul(back, .12)); bp[1] = floor - .015;
        SFX3.crash(); CAM3.shake = 10; P2.flash = 8; P2.f.thrown = 1; H3.brokenAt = bp; H3.extra.phonebroken.M = M4.mul(M4.tr(...bp), M4.ry(Math.random() * 6)); H3.extra.phonebroken.vis = true;
        H3.brokenInter.box = [bp[0] - .18, bp[1] - .05, bp[2] - .18, bp[0] + .18, bp[1] + .2, bp[2] + .18]; P2.thrown = null; u.hitAt = t; break }
      T.p = np } if (T.obj) { T.spin += .5; T.obj.M = M4.chain(M4.tr(...T.p), M4.ry(T.spin), M4.rx(T.spin * .7)) } }
  if (u.hitAt && t > u.hitAt) CAM3.shake *= .9;
  if (u.hitAt && t == u.hitAt + 50) { P2.ui = null; CAM3.shake = 0; ME.vm = null; P2.wantLock = true; say3(['Hitori|...', 'Hitori|Fuck.', 'Hitori|...Fuck.', 'Hitori|I need to eat something. I can\'t think.'], () => { P2.objective = 'Eat something.' }) }
}
// hand + phone, every frame the phone is out
function phoneVMFrame(u) {
  if (u.mode == 'throw') { const t = u.th, wind = ease3(t / 18), fwd = ease3((t - 18) / 8), after = ease3((t - 26) / 20);
    let off = [.14 * wind, .09 * wind - .25 * after, .1 * wind], rot = wind * .9;
    if (t > 18) { off = V3.lerp([.14, .09, .1], [.0, .05, -.22], fwd); rot = .9 - fwd * 1.6 } if (t > 26) off = V3.add([.0, .05, -.22], [.05 * after, -.35 * after, .1 * after]);
    if (t <= 26) { const L = M4.mul(phoneVM(u.t, off), M4.rx(rot)), W = M4.mul(camWorld(), L), loc = p => M4.pt(L, p); ME.vm = { R: vmArm(1, loc([.05, -.022, .095]), M4.dir(L, [-.55, 0, -.85]), M4.dir(L, [0, 1, 0]), .72, [1, -1, .2]) }; P2.vmExtra = [posed(H3.extra.phoneHand, W)] }
    else { P2.vmExtra = null; ME.vm = after < 1 ? { R: vmArm(1, V3.add([.05, -.1, -.35], [.08 * after, -.3 * after, .15 * after]), [0, .4, -1], [-1, 0, 0], .2) } : null }
    PH.ok = false; return }
  const A = phoneAnim(u), H = phoneHeld(u.t, A.off, A); P2.vmExtra = [H.objs[0]]; ME.vm = { R: H.objs.slice(1) }; phoneMap(A.rise >= 1 && !u.closing ? H.corners : null);
}
function drawPhone(u) {
  if (!PH.ok) return; const sis = P2.day == 3, list = phoneList(), W2 = PH.w, H2 = PH.h, m = u.mouse || [-9, -9];
  X.save(); phR(0, 0, W2, H2, '#0c0c12');
  const d = new Date(); phTxt(d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'), 4, 2.5, '#bbb', 4.5); phR(W2 - 12, 3.5, 8, 3.5, '#555'); phR(W2 - 12, 3.5, sis ? 2.5 : 6, 3.5, sis ? '#c84040' : '#8a8'); phR(W2 - 4, 4.5, 1, 1.5, '#555');
  if (u.mode == 'contacts' || u.mode == 'throw') {
    phTxt('Contacts', 4, 10, '#fff', 7.5);
    list.forEach((c, i) => { const y = 24 + i * 19, on = u.sel == i, hov = m[0] > 2 && m[0] < 58 && m[1] > y - 2 && m[1] < y + 17; if (on || hov) phRR(2, y - 2, W2 - 4, 18, 3, on ? '#26262f' : '#1a1a22');
      phAvatar(10, y + 7, 6, sis && c.k >= 0 ? ['steven', 'caroline', 'hitori', 'uku'][c.k] : null);
      if (sis) phTxt(c.n, 20, y + 3.5, '#eee', 6); else { phT(); X.imageSmoothingEnabled = false; X.drawImage(blurName(c.n), 20, y + 3.5, 26, 6) }
      if (u.called && u.called[c.n]) phTxt('called', W2 - 4, y + 4.5, '#777', 4, 'right') });
    if (!sis) { phTxt('click or Z: call', W2 / 2, H2 - 22, '#666', 4.2, 'center'); const hv = m[1] > 116 && m[1] < 131; phRR(W2 / 2 - 14, H2 - 14, 28, 9, 4, hv ? '#3a3a46' : '#24242c'); phTxt('put down', W2 / 2, H2 - 12.2, '#aaa', 4.2, 'center') }
  }
  if (u.mode == 'call') {
    phAvatar(W2 / 2, 36, 15, sis && u.c.k >= 0 ? ['steven', 'caroline', 'hitori', 'uku'][u.c.k] : null);
    if (sis) phTxt(u.c.n, W2 / 2, 56, '#fff', 7.5, 'center'); else { phT(); X.imageSmoothingEnabled = false; X.drawImage(blurName(u.c.n), W2 / 2 - 20, 56, 40, 9) }
    const s = u.connected ? Math.floor((u.ct - 150) / 60) : 0;
    phTxt(u.ended ? 'Call ended' : u.connected ? '0:' + String(s).padStart(2, '0') : 'Calling' + '...'.slice(0, (u.ct >> 4) % 4), W2 / 2, 70, '#aaa', 5.5, 'center');
    for (let i = 0; i < 6; i++) { phC(14 + (i % 3) * 16, 86 + Math.floor(i / 3) * 12, 4.5, '#1e1e26') }
    phC(W2 / 2, H2 - 16, 7.5, '#c83030'); phR(W2 / 2 - 4, H2 - 17, 8, 2, '#fff');
  }
  if (u.mode == 'texts') {
    phTxt('Messages', 4, 10, '#fff', 7.5); let y = 23;
    TEXTS.slice(0, u.shown).forEach(msg => { const lines = pwrapLocal(msg, W2 - 22, 4.6); phRR(14, y, W2 - 17, 4 + lines.length * 5.5, 3, '#2c2c38'); lines.forEach((l, k) => phTxt(l, 17, y + 2 + k * 5.5, '#e8e8e8', 4.6)); phAvatar(7, y + 4, 4); y += 7 + lines.length * 5.5 });
  }
  phR(0, 0, W2, 1, 'rgba(255,255,255,.04)');
  X.restore(); sU();
}
function pwrapLocal(s, w, sz) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.font = sz + 'px ' + FONT; const out = []; let l = ''; for (const word of s.split(' ')) { const t = l ? l + ' ' + word : word; if (X.measureText(t).width > w && l) { out.push(l); l = word } else l = t } if (l) out.push(l); X.restore(); return out }
// ---------------------------------------------------------------- the polaroids, up close: Z shows you one, Z again and she talks about it
const POLS = [
  { k: 'pol1', lines: ['Hitori|That\'s me. Holding the camera out, like always.', 'Hitori|And... who is that? Next to me. Doing the peace sign.', 'Hitori|Somebody scribbled over her face. Hard. The pen went through.', 'Hitori|~Did I do that? I KNOW her. Why can\'t I—'] },
  { k: 'pol3', lines: ['Hitori|The last train home. Steven. Uku. Caroline. Me.', 'Hitori|...And one more. Laughing, with her head on my shoulder.', 'Hitori|There were only ever four of us. Weren\'t there?'] },
  { k: 'pol2', lines: ['Hitori|Mochi. Asleep on my lap again.', 'Hitori|She always picked me. I never had the heart to get up.', 'Hitori|...Where is Mochi?'] },
  { k: 'pol4', lines: ['Hitori|The beach. I was so small.', 'Hitori|Somebody tore it in half. And then somebody taped it back together.', 'Hitori|...Crooked. Like they were crying when they did it.'] },
];
function polUpdate(u) {
  u.t++; const n = POLS.length, mx = P2MOUSE.x, my = P2MOUSE.y, busy = subsBusy();
  if (!busy) {
    if (rt() || (P2MOUSE.click && mx > 236 && mx < 262 && my > 60 && my < 100)) { u.i = (u.i + 1) % n; pageTurn(); u.t = 0 }
    else if (lf() || (P2MOUSE.click && mx > 58 && mx < 84 && my > 60 && my < 100)) { u.i = (u.i + n - 1) % n; pageTurn(); u.t = 0 }
    else if ((ok() || (P2MOUSE.click && mx > 100 && mx < 220)) && u.t > 6) { u.seen[u.i] = 1; say3(POLS[u.i].lines) }
    else if (esc() || hit.KeyX || (P2MOUSE.click && my > 150)) { P2.ui = null; P2.wantLock = true; if (u.seen[0] && !P2.f.polaroids) { P2.f.polaroids = 1; say3(['Hitori|My head hurts.', 'Hitori|...I\'m so tired. I just want to sleep.'], () => { P2.objective = 'Sleep.' }) } else if (!u.seen[0]) say3(['Hitori|...']) }
  }
  P2MOUSE.click = 0;
}
function drawPol(u) {
  r(0, 0, W, H, 'rgba(0,0,0,.72)'); const p = POLS[u.i];
  if (!POLCV[p.k].real && ['hitori', 'steven', 'caroline', 'uku'].every(w => ready(PORTRAITS[w + ':neutral']))) { const g = POLCV[p.k].getContext('2d'); g.clearRect(0, 0, 256, 308); drawPolaroid(g, 256, p.k); POLCV[p.k].real = 1 }
  const cv = POLCV[p.k]; const w = 104, h = w * 1.2, x = (W - w) / 2, y = 8 + Math.sin(u.t / 40) * .8;
  X.save(); X.setTransform(U, 0, 0, U, 0, 0); X.translate(W / 2, y + h / 2); X.rotate(Math.sin(u.i * 2.3) * .035); X.fillStyle = 'rgba(0,0,0,.5)'; X.fillRect(-w / 2 + 2, -h / 2 + 3, w, h); X.imageSmoothingEnabled = true; X.drawImage(cv, -w / 2, -h / 2, w, h); X.restore();
  const busy = subsBusy(), hl = (x0) => P2MOUSE.x > x0 && P2MOUSE.x < x0 + 26 && P2MOUSE.y > 60 && P2MOUSE.y < 100;
  if (!busy) { ptxt('<', 71, 70, hl(58) ? '#fff' : '#999', 'center', 14, FONT); ptxt('>', 249, 70, hl(236) ? '#fff' : '#999', 'center', 14, FONT);
    ptxt((u.i + 1) + ' / ' + POLS.length, W / 2, 140, '#888', 'center', 6, FONT); ptxt('Z or click: ' + (u.seen[u.i] ? 'look again' : 'talk about it') + '      ← →: next      X: back', W / 2, 162, '#aaa', 'center', 6, FONT) }
}
// ---------------------------------------------------------------- DAY 2: the eyes and the shadows
const EYES = []; let eyesObj = null, shadowsObj = null, hangObj = null;
const SHADOWS = [{ x: 6.8, y: 3, z: .8 }, { x: 4.6, y: 0, z: 1.2 }, { x: 10.2, y: 0, z: 9.4 }, { x: .9, y: 0, z: 9.3 }, { x: 6.6, y: 3, z: 9.6 }, { x: 2.2, y: 3, z: 8.9 }, { x: 10.6, y: 3, z: 1.1 }, { x: 11.3, y: 3, z: 5.6 }];
function eyesInit() {
  EYES.length = 0; const R = rng(77);
  const walls = [[0, 'e', 0, 4, 10], [12, 'w', 0, 0, 10], [10, 'n', 0, 0, 12], [0, 's', 0, 4, 12], [0, 'e', 3, 0, 10], [12, 'w', 3, 0, 10], [10, 'n', 3, 0, 12], [0, 's', 3, 0, 12], [8.6, 'w', 3, 0, 10], [8.6, 'e', 3, 0, 10], [4, 'e', 0, 0, 10], [8.6, 'w', 0, 0, 10], [8.6, 'e', 0, 3.5, 10], [5, 'n', 3, 8.6, 12], [5, 's', 3, 8.6, 12]];
  for (let i = 0; i < 70; i++) { const [c, f, fy, a, b] = walls[i % walls.length], u = a + .3 + R() * (b - a - .6), y = fy + .9 + R() * 1.6, off = f == 'e' ? .07 : f == 'w' ? -.07 : f == 's' ? .07 : -.07;
    const p = L3P(f == 'e' || f == 'w' ? [c + off, y, u] : [u, y, c + off]); EYES.push({ p, f, born: i * 2.2, s: .7 + R() * .6, blink: R() * 300 | 0 }) }
  SHADOWS.forEach(s => { s.gone = 0; s.seen = 0; if (!s.mapped) { [s.x, s.z] = LM(s.x, s.z, s.y); s.mapped = 1 } });
}
function dynObj(o, mb) { if (!o) o = { groups: [], M: M4ID, vis: true }; for (const g of o.groups) gl.deleteBuffer(g.b); const b = mb.build(); o.groups = b.groups; return o }
function eyesTick() {
  if (P2.day != 2) return; const mb = new MB(), t = P2.d2.t / 60, px = CAM3.x, py = CAM3.y, pz = CAM3.z;
  for (const e of EYES) { if (t < e.born) continue; const [x, y, z] = e.p; if (Math.abs(y - py) > 2.6) continue; const d = Math.hypot(x - px, z - pz); if (d > 9) continue;
    e.blink--; if (e.blink < 0) e.blink = 200 + Math.random() * 400; const bl = e.blink < 8 ? .15 : 1, w = .5 * e.s, h = .21 * e.s * bl;
    const hw = w / 2, hh = h / 2;
    if (e.f == 'e' || e.f == 'w') { const sgn = e.f == 'e' ? 1 : -1; mb.quad('eyes', [x, y + hh, z - hw * sgn], [x, y + hh, z + hw * sgn], [x, y - hh, z + hw * sgn], [x, y - hh, z - hw * sgn], undefined, [1, 1, 1, 1]);
      const dz = clamp((pz - z) * .02, -.025, .025), dy = clamp((py - y) * .02, -.012, .012); if (bl == 1) for (const s of [-1, 1]) { const cz = z + s * w * .25 * sgn + dz, cy = y + dy; mb.quad('black', [x + sgn * .003, cy + 0.026, cz - 0.026], [x + sgn * .003, cy + 0.026, cz + 0.026], [x + sgn * .003, cy - 0.026, cz + 0.026], [x + sgn * .003, cy - 0.026, cz - 0.026]) } }
    else { const sgn = e.f == 's' ? 1 : -1; mb.quad('eyes', [x - hw * sgn, y + hh, z], [x + hw * sgn, y + hh, z], [x + hw * sgn, y - hh, z], [x - hw * sgn, y - hh, z], undefined, [1, 1, 1, 1]);
      const dx = clamp((px - x) * .02, -.025, .025), dy = clamp((py - y) * .02, -.012, .012); if (bl == 1) for (const s of [-1, 1]) { const cx = x + s * w * .25 * sgn + dx, cy = y + dy; mb.quad('black', [cx - 0.026, cy + 0.026, z + sgn * .003], [cx + 0.026, cy + 0.026, z + sgn * .003], [cx + 0.026, cy - 0.026, z + sgn * .003], [cx - 0.026, cy - 0.026, z + sgn * .003]) } } }
  // the shadows: tall black figures that stand where you're about to look, and are gone when you get close
  for (const s of SHADOWS) { if (s.gone) continue; if (Math.abs(s.y - PL3.y) > 1) continue; const d = Math.hypot(s.x - px, s.z - pz);
    if (d < 3) { s.gone = 1; SFX3.whisper(.3, 1.2); continue }
    const fw = camFwd(), dot = ((s.x - px) * fw[0] + (s.z - pz) * fw[2]) / (d || 1); if (dot > .93) { s.seen++; if (s.seen > 50) { s.gone = 1; SFX3.whisper(.25, 1); continue } }
    const ang = Math.atan2(px - s.x, pz - s.z), cx = Math.cos(ang) * .32, cz = -Math.sin(ang) * .32;
    mb.quad('shadowfig', [s.x - cx, s.y + 1.95, s.z - cz], [s.x + cx, s.y + 1.95, s.z + cz], [s.x + cx, s.y, s.z + cz], [s.x - cx, s.y, s.z - cz], undefined, [0, 0, 0, 1]) }
  eyesObj = dynObj(eyesObj, mb);
}
// the end: only a black shape, hanging from the ceiling in the middle of her room, turning slowly
const HANG = LM(10.05, 6.55, 3);   // the middle of her room
function hangInit() {
  const mb = new MB(); mb.box('black', -.34, -1.65, -.26, .34, 0, .26, { col: [0, 0, 0, 1] });   // a wide, square-cornered black block: nothing shows round its edges mb.box('black', -.012, 0, -.012, .012, .9, .012, { col: [0, 0, 0, 1] });
  hangObj = mb.build(); hangObj.vis = false;
}
// ---------------------------------------------------------------- DAY 2
function startDay2() {
  [PL3.x, PL3.z] = LM(10.15, 8.85, 3); PL3.y = 3; CAM3.yaw = -Math.PI / 2; CAM3.pitch = 0; CAM3.roll = 0; P2.blink = 1; P2.hideBody = 1; P2.cut = { k: 'wake2', t: 0 };
  say3(['|...', 'Hitori|...', 'Hitori|It\'s darker. Why is it darker?', 'Hitori|That man. The cards. Was that a dream too?', 'Hitori|He said... take my medicine. He said she\'s coming home.', 'Hitori|Then why does it feel like the whole house is staring at me?'], () => { P2.cut = null; P2.hideBody = 0; P2.objective = '' });
}
const WHISPERS = ['(...you did this...)', '(...she left because of you...)', '(...everyone knows...)', '(...look at you...)', '(...they\'re laughing at you...)', '(...you\'re alone...)', '(...hitori...)', '(...nobody is coming...)', '(...why would anyone stay...)', '(...it\'s your fault...)', '(...they took her...)', '(...they\'re in the walls...)'];
function day2Tick() {
  const d = P2.d2; d.t++;
  const rm = roomAt(PL3.x, PL3.z, PL3.y); if (!d.rooms[rm]) { d.rooms[rm] = d.t; if (Object.keys(d.rooms).length > 1) roomLine(rm) }
  if (d.t % 240 == 0) SFX3.heart(.3 + Math.min(.5, d.t / 9000));
  if (Math.random() < .004) P2.floating.push({ s: WHISPERS[Math.random() * WHISPERS.length | 0], x: 30 + Math.random() * 240, y: 20 + Math.random() * 100, t: 0 });
  if (!d.climax && !P2.cut && !subsBusy() && (Object.keys(d.rooms).length >= 6 || d.t > 60 * 210)) { d.climax = 1; P2.cut = { k: 'climax', t: 0 } }
}
function roomLine(rm) {
  const L = { kitchen: ['Hitori|~Stop looking at me.'], hall: ['Hitori|~Who keeps walking around down here?!'], living: ['Hitori|...The TV\'s on. I didn\'t turn the TV on.'], upstairs: ['Hitori|~There\'s more of them. There\'s more of them every time.'], ubath: ['Hitori|Don\'t look in the mirror. Don\'t look in the mirror.'], parents: ['Hitori|Mom? ...Dad?'], corridor: ['Hitori|It\'s so cold down here.'], bath0: ['Hitori|...I can hear breathing. That\'s me. That\'s just me.'], sister: [], storage: [], hitori: ['Hitori|~My room. My room is safe. My room is safe. My room is safe.'] }[rm];
  if (L && L.length && !subsBusy()) say3(L);
}
function climaxCut(c) {
  const t = ++c.t;
  if (t == 1) { for (const e of EYES) e.born = 0; P2.amb = { foot: 60, whisper: 40 }; SFX3.sting() }
  if (t < 260 && t % 30 == 0) SFX3.heart(1); if (t < 260 && t % 12 == 0) SFX3.whisper(.4, 1, (Math.random() - .5) * 2);
  if (t > 20 && t < 260) { const q = (t - 20) / 240; ME.vm = { L: vmArm(-1, [-.3 + q * .03, -.02 + q * .04, -.14], [.2, .95, .1], [1, 0, .2], .5, [-1, -.3, .4]), R: vmArm(1, [.3 - q * .03, -.02 + q * .04, -.14], [-.2, .95, .1], [-1, 0, .2], .5) } }   // her hands come up over her ears
  if (t == 20) say3(['Hitori|~Stop.', 'Hitori|~Stop looking at me. Stop talking about me. STOP.', 'Hitori|~STOP IT!']);
  if (t > 20 && t < 260) CAM3.shake = 2 + t / 60;
  if (t == 260) { CAM3.shake = 0; ME.vm = null; P2.amb = { foot: 0, whisper: 0 }; AMB3.stop(); P2.silent = 1; for (const e of EYES) e.born = 1e9 }
  if (t == 330) say3(['Hitori|...', 'Hitori|...It\'s quiet.', 'Hitori|I just want it to stay quiet.']);
  if (t == 700) P2.fadeTo = 1;
  if (t == 900) { P2.silent = 0; P2.ui = { k: 'card', t: 0, text: 'Some time later.', next: () => p2Stage('sister') } }
}
// ---------------------------------------------------------------- THE SISTER
function startSister() {
  hangInit(); [PL3.x, PL3.z] = LM(6.45, 9.35, 0); PL3.y = 0; CAM3.yaw = 0; CAM3.pitch = 0; CAM3.roll = 0; P2.blink = 0; P2.fade = 1; P2.fadeTo = 0; P2.name = 'Hikari';
  const hd = H3.doors.find(d => d.id == 'hitori'); hd.to = hd.a = .14; hangObj.vis = true; hangObj.M = M4.tr(HANG[0], 5.8 - .9, HANG[1]);
  for (const d of H3.doors) if (d.id != 'hitori' && d.id != 'kitchen') d.to = d.a = 0;
  H3.chair.x = CHX - .35; SFX3.door(false); setTimeout(() => SFX3.door(false), 10);
  say3(['Hikari|Hitori? I\'m home.', 'Hikari|...Hitori?', 'Hikari|Why are all the lights off?'], () => { P2.objective = 'Find Hitori.' });
}
function sisterTick() {
  const s = P2.f; if (!s.callUp && PL3.z < 12.3 && PL3.x < 7.6) { s.callUp = 1; say3(['Hikari|Hitori, it\'s me. I came back.', 'Hikari|I\'m sorry I left like that. I\'m so sorry. Please just come out.']) }
  if (!s.ajar && PL3.y > 2.5 && PL3.z > 6.8) { s.ajar = 1; say3(['Hikari|...Her door\'s open.']) }
  if (hangObj) hangObj.M = M4.mul(M4.tr(HANG[0], 4.9, HANG[1]), M4.ry(Math.sin(P2.t / 140) * .5));
}
P2S.found = function () {
  P2.f.found = 1; P2.cut = { k: 'found', t: 0, from: [CAM3.x, CAM3.z, CAM3.yaw, CAM3.pitch] }; const hd = H3.doors.find(d => d.id == 'hitori'); hd.to = 1; SFX3.door(true);
};
function foundCut(c) {   // she steps into the doorway; there it is, in the middle of the room
  const t = ++c.t, door = [8.25, 6.5], q = ease3(t / 50);
  PL3.x = c.from[0] + (door[0] - c.from[0]) * q; PL3.z = c.from[1] + (door[1] - c.from[1]) * q;
  const target = Math.atan2(-(HANG[0] - PL3.x), -(HANG[1] - PL3.z)), tp = Math.atan2(4.3 - (PL3.y + GIRL.eye), Math.hypot(HANG[0] - PL3.x, HANG[1] - PL3.z));
  if (t < 300) { CAM3.yaw = c.from[2] + Math.atan2(Math.sin(target - c.from[2]), Math.cos(target - c.from[2])) * ease3(t / 60); CAM3.pitch += (tp - CAM3.pitch) * .08 }
  if (t == 40) SFX3.sting(); if (t > 40 && t < 260 && t % 26 == 0) SFX3.heart(1);
  if (t == 70) say3(['Hikari|Hitori?', 'Hikari|...', 'Hikari|~No.', 'Hikari|~No, no, no, no, no—']);
  if (t > 300 && t < 340) CAM3.shake = 8;
  if (t == 320) SFX3.retch();
  if (t > 320 && t < 420) { CAM3.pitch += (-1.1 - CAM3.pitch) * .06; CAM3.yaw += (Math.PI * .6 - CAM3.yaw) * .02; const k = ease3((t - 320) / 30); ME.vm = { L: vmArm(-1, [-.12, -.3 + .05 * k, -.32], [0, .2, -1], [.3, -1, 0], .3), R: vmArm(1, [.12, -.3 + .05 * k, -.32], [0, .2, -1], [-.3, -1, 0], .3) } }
  if (t == 420) { CAM3.shake = 0; ME.vm = null; say3(['Hikari|...', 'Hikari|~I\'m sorry. I\'m so sorry. I\'m so sorry.', 'Hikari|...Steven. Caroline. Uku. Somebody.'], () => { P2.cut = null; P2.ui = { k: 'phone', mode: 'contacts', sel: 0, t: 0, called: {}, lift: 0 }; p2Unlock() }) }
  CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.y = PL3.y + GIRL.eye;
}
function panoutCut(c) {   // cut to the outside of her window, then pull back from the house into the night
  const t = ++c.t; if (t == 1) { AMB3.stop(); P2.objective = ''; P2.fadeTo = 1 }
  if (t == 70) { H3.ext.vis = true; P2.outside = 1; P2.hideBody = 1; P2.fadeTo = 0; c.s = 0 }
  if (t >= 70) { const q = clamp((t - 70) / 900, 0, 1), e = q * q * (3 - 2 * q);
    const A = L3P([13.6, 4.5, 8.95]), B = [34, 11, 32], TG = L3P([10.4, 4.4, 8]); CAM3.x = A[0] + (B[0] - A[0]) * e; CAM3.y = A[1] + (B[1] - A[1]) * e; CAM3.z = A[2] + (B[2] - A[2]) * e;
    CAM3.yaw = Math.atan2(-(TG[0] - CAM3.x), -(TG[2] - CAM3.z)); CAM3.pitch = Math.atan2(4.4 - CAM3.y, Math.hypot(TG[0] - CAM3.x, TG[2] - CAM3.z)); CAM3.roll = 0 }
  if (t == 900) P2.fadeTo = 1;
  if (t == 1080) { P2.ui = { k: 'end', t: 0 }; P2.outside = 0; ST2s('stage', 'day1'); ST.set('syn_part2', 1) }
}
// ---------------------------------------------------------------- full-screen cards: the content note, "some time later", the end
function cardUpdate(u) {
  u.t++;
  if (u.k == 'warn' && u.t > 60 && ok()) { const n = u.next; P2.ui = null; n() }
  if (u.k == 'card' && u.t == 260) { const n = u.next; P2.ui = null; n() }
  if (u.k == 'end' && u.t > 700 && ok()) { P2.ui = null; AMB3.stop(); p2Unlock(); title() }
}
function drawCard3(u) {
  r(0, 0, W, H, '#000'); const f = P2.font;
  if (u.k == 'warn') { const a = Math.min(1, u.t / 40); X.globalAlpha = a; ptxt('PART TWO', W / 2, 40, '#ddd', 'center', 10, FONT, null);
    pwrap('This part of the game deals with mental illness, isolation, self-harm and suicide. It contains vomiting and strong language.', 240, 7, FONT).forEach((l, i) => ptxt(l, W / 2, 70 + i * 11, '#aaa', 'center', 7, FONT, null));
    ptxt('Mouse or arrow keys: look.  W A S D: walk.  Z or click: use.  X: back.', W / 2, 128, '#777', 'center', 6, FONT, null);
    if (u.t > 60) ptxt('Z: continue', W / 2, 150, (u.t >> 4) % 2 ? '#ddd' : '#888', 'center', 7, FONT, null); X.globalAlpha = 1 }
  if (u.k == 'card') { const a = clamp(Math.min(u.t / 60, (260 - u.t) / 60), 0, 1); X.globalAlpha = a; ptxt(u.text, W / 2, 84, '#ccc', 'center', 9, f, null); X.globalAlpha = 1 }
  if (u.k == 'end') { const a1 = clamp((u.t - 120) / 90, 0, 1), a2 = clamp((u.t - 300) / 90, 0, 1), a3 = clamp((u.t - 480) / 90, 0, 1);
    X.globalAlpha = a1; ptxt('S Y N C H R O N I C I T Y', W / 2, 66, '#fff', 'center', 9, FONT, null); X.globalAlpha = a2; ptxt('the end', W / 2, 84, '#888', 'center', 7, FONT, null);
    X.globalAlpha = a3; ptxt('If you are struggling, or someone you know is, please talk to someone you trust,', W / 2, 140, '#666', 'center', 5.5, FONT, null); ptxt('or reach a crisis line near you: findahelpline.com', W / 2, 148, '#666', 'center', 5.5, FONT, null); X.globalAlpha = 1 }
}
// ---------------------------------------------------------------- the frame
P2.floating = [];
function p2AmbTick() {   // someone walking about, someone whispering: faint on day 1, everywhere on day 2
  if (P2.silent || !P2.amb) return;
  if (P2.amb.foot && --P2.amb.footT <= 0 || isNaN(P2.amb.footT)) { P2.amb.footT = P2.amb.foot * (.6 + Math.random() * .8); if (P2.amb.foot && P2.t > 300) SFX3.walker(P2.day == 2 ? .35 : .12) }
  if (P2.amb.whisper && --P2.amb.whT <= 0 || isNaN(P2.amb.whT)) { P2.amb.whT = P2.amb.whisper * (.6 + Math.random() * .8); if (P2.amb.whisper && P2.t > 400) SFX3.whisper(P2.day == 2 ? .22 : .06, 1.2 + Math.random() * 1.4) }
}
const CUTS = { wake: wakeCut, wake2: wakeCut, eat: eatCut, sleep: sleepCut, climax: climaxCut, found: foundCut, panout: panoutCut, dealer: (c) => dealerCut(c), fridge: fridgeCut, sit: sitCut, stand: standCut };
XSC.p2 = function () {
  const dt = 1 / 60; P2.t++; C.style.cursor = 'none';
  if (P2.t % 6 == 0 && TX.tvstatic) { texNoise(TX.tvstatic.g, 64, '#404040', .9, P2.t, 2); TX.tvstatic.dirty = 1 }
  const u = P2.ui, card = u && (u.k == 'warn' || u.k == 'card' || u.k == 'end');
  if (u) { if (u.k == 'phone') phoneUpdate(u); else if (u.k == 'pol') polUpdate(u); else if (u.k == 'pc') pcUpdate(u); else if (u.k == 'bj') bjUpdate(u); else cardUpdate(u) }
  else if (P2.cut) { CUTS[P2.cut.k](P2.cut); P2MOUSE.dx = P2MOUSE.dy = 0 }
  if (P2.ui && P2.ui.k == 'phone') phoneVMFrame(P2.ui); else if (!(P2.cut && (P2.cut.k == 'fridge' || P2.cut.k == 'eat' || P2.cut.k == 'sit' || P2.cut.k == 'climax' || P2.cut.k == 'found'))) { ME.vm = null; P2.vmExtra = null }
  if (P2.seated && !P2.cut) P2.pose = { sit: 1, lean: -.22, x: H3.chair.x, z: H3.chair.z, y: 3, yaw: -HP, hands: { L: { at: [CHX + .41, 3.79, CHZ - .12], fing: [1, -.25, .05], palm: [0, -1, 0], curl: .25 }, R: { at: [CHX + .45, 3.79, CHZ + .43], fing: [1, -.25, 0], palm: [0, -1, 0], curl: .4 } } };
  else if (!P2.cut) P2.pose = null;
  if (P2.scene == 'house' && !card) {
    const scn = houseScene();
    // you can always look around while someone is talking; only cut-scenes and open screens hold the camera
    if (!P2.ui && !P2.cut) { p2Walk(scn, dt, true); P2.target = subsBusy() ? null : lookAt3(scn); if (P2.target && (ok() || P2MOUSE.click)) { P2MOUSE.click = 0; const it = P2.target; it.on() } }
    else P2.target = null;
    doorTick(dt); if (P2.day == 2) { eyesTick(); if (!P2.cut) day2Tick() } if (P2.day == 3) sisterTick();
    p2AmbTick();
    render3D(scn);
  } else if (P2.scene == 'dealer' && !card) { dealerFrame(dt) }
  subsTick(); P2MOUSE.click = 0;
  // ---- 2D on top
  sU(); X.imageSmoothingEnabled = false;
  if (!card) {
    X.drawImage(GLC, 0, 0, W, H);
    for (let i = 0; i < 90; i++) { X.globalAlpha = .05 + Math.random() * .05; r(Math.random() * W | 0, Math.random() * H | 0, 1, 1, Math.random() < .5 ? '#fff' : '#000') } X.globalAlpha = 1;
    const vg = X.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 200); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, P2.day == 2 ? 'rgba(30,0,4,.85)' : 'rgba(0,0,0,.7)'); X.fillStyle = vg; X.fillRect(0, 0, W, H);
    if (P2.flash > 0) { X.globalAlpha = P2.flash / 12; r(0, 0, W, H, '#fff'); X.globalAlpha = 1; P2.flash-- }
    if (P2.blink > 0) { const h = P2.blink * H / 2; r(0, 0, W, h, '#000'); r(0, H - h, W, h, '#000') }
    if (P2.day == 2) { P2.floating = P2.floating.filter(w => ++w.t < 150); for (const w of P2.floating) { X.globalAlpha = Math.min(1, w.t / 30, (150 - w.t) / 30) * .6; ptxt(w.s, w.x, w.y, '#9a6a74', 'left', 7, CRAZY, null) } X.globalAlpha = 1 }
    if (!u && !P2.cut && P2.scene == 'house') { r(W / 2 - .5, H / 2 - .5, 1, 1, P2.target ? '#fff' : 'rgba(255,255,255,.4)'); if (P2.target && !subsBusy()) ptxt('Z  ' + P2.target.name, W / 2, H / 2 + 6, '#ddd', 'center', 6, P2.font) }
    if (P2.objective && !u && !P2.cut) ptxt(P2.objective, 8, 6, 'rgba(200,200,200,.55)', 'left', 6, P2.font, 'rgba(0,0,0,.6)');
    if (u && u.k == 'phone') { drawPhone(u); if (PH.ok && P2.vmExtra && ME.vm && ME.vm.R && !P2.noOverlay) { renderOverlay(P2.vmExtra, ME.vm.R); /* the hand, thumb and sleeve over the screen's picture */ sU(); X.imageSmoothingEnabled = false; X.drawImage(GLC, 0, 0, W, H) } } if (u && u.k == 'pol') drawPol(u); if (u && u.k == 'pc') drawPC(u); if (u && u.k == 'bj') drawBJ(u);
    if (!document.pointerLockElement && !u && !P2.cut && P2.t > 30 && P2.t % 120 < 90) ptxt('click to look around with the mouse', W / 2, 20, 'rgba(255,255,255,.35)', 'center', 5, FONT, null);
  }
  P2.fade += clamp(P2.fadeTo - P2.fade, -.02, .02); if (P2.fade > 0) { X.globalAlpha = clamp(P2.fade, 0, 1); r(0, 0, W, H, '#000'); X.globalAlpha = 1 }
  drawSubs();
  if (card) drawCard3(u);
  // the mouse pointer, whenever something on screen wants clicking
  if (u && !card && u.k != 'pc') { sU(); const mx = P2MOUSE.x, my = P2MOUSE.y; X.fillStyle = '#000'; X.beginPath(); X.moveTo(mx, my); X.lineTo(mx, my + 7); X.lineTo(mx + 2, my + 5.5); X.lineTo(mx + 3.5, my + 8.5); X.lineTo(mx + 4.5, my + 8); X.lineTo(mx + 3, my + 5); X.lineTo(mx + 5, my + 5); X.closePath(); X.fill(); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(mx + .5, my + 1.2); X.lineTo(mx + .5, my + 6); X.lineTo(mx + 2.1, my + 4.6); X.lineTo(mx + 3.6, my + 7.6); X.lineTo(mx + 3.9, my + 7.4); X.lineTo(mx + 2.5, my + 4.5); X.lineTo(mx + 4.3, my + 4.5); X.closePath(); X.fill() }
};
// part two plays its own sounds; no music unless the story asks for it
const _trackFor31 = trackFor;
trackFor = function () { if (String(sc).startsWith('p2')) return P2.mus || 'none'; return _trackFor31() };
// the part-one ending leads into part two
endDraw = function () {
  END.t++; sU(); r(0, 0, W, H, '#000');
  if (END.t < 40 && END.t % 6 < 3) r(0, 0, W, H, '#0a0612');
  const a1 = clamp((END.t - 260) / 90, 0, 1), a2 = clamp((END.t - 420) / 90, 0, 1);
  if (a1 > 0) { X.globalAlpha = a1; txt('S Y N C H R O N I C I T Y', W / 2, 74, '#fff', 'center', 8); X.globalAlpha = 1 }
  if (a2 > 0) { X.globalAlpha = a2; txt('end of part one', W / 2, 92, '#777', 'center', 6); X.globalAlpha = 1 }
  if (END.t > 560 && END.t % 60 < 40) txt('Z: wake up', W / 2, 150, '#555', 'center', 6);
  if (END.t > 560 && ok()) p2Begin('day1');
};
// saving part two happens on Hitori's computer (the Save game icon), into the same three slots as part one.
// A part-two save is { p2: stage, at }; on the load menu it reads "Hitori's house" and starts that day again.
const p2DayName = st => ({ day1: 'Day 1', dealer: 'Day 1', day2: 'Day 2', sister: 'Day 3' })[st] || 'Day 1';
function p2Save(i) { ST.set(SK(i), JSON.stringify({ p2: P2.stage == 'dealer' ? 'day1' : P2.stage || 'day1', at: Date.now() })); ST.set('syn_played', 1) }
const _title31 = title;
title = function () { C.style.cursor = ''; _title31() };   // (no PART TWO button: part two is reached by finishing part one)
