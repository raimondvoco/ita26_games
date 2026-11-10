// ==================== DIALOGUE ====================
const FRIENDS = ['Steven', 'Caroline', 'Uku'];
function D(lines, cb) {   // lines: 'Name:emotion|text' ; empty name = narration (no portrait). Lines from friends who are not with you are skipped.
  const q = lines.map(l => { const i = l.indexOf('|'), [n, e] = l.slice(0, i).split(':'); let t = l.slice(i + 1); const cz = t[0] == '~'; if (cz) t = t.slice(1); return { n, e: e || 'neutral', t, cz } })
    .filter(l => !(S && FRIENDS.includes(l.n) && !S.party.some(i => CH[i].n == l.n) && !E.some(q => q.k == 'npc' && q.id == l.n.toLowerCase())));
  if (!q.length) { cb && cb(); return }
  DL = { q, i: 0, c: 0, cb, pt: 0, age: 0 }; beep(300);
}
function dialogUpdate() {
  const l = DL.q[DL.i], c0 = DL.c | 0; DL.c += .8; DL.pt++; DL.age++;
  if ((DL.c | 0) > c0 && l.t[c0] && l.t[c0] != ' ' && (c0 & 1) && LK[l.n]) beep(260 + (l.n.length * 23) % 140, .02, .35);
  if (ok()) { if (DL.c < l.t.length) DL.c = l.t.length; else { DL.i++; DL.c = 0; beep(400, .04); if (DL.i >= DL.q.length) { const cb = DL.cb; DL = null; cb && cb() } } }
}
function wrapPx(str, maxW, sz) { const out = []; let line = ''; for (const w of str.split(' ')) { const t = line ? line + ' ' + w : w; if (tw(t, sz) > maxW && line) { out.push(line); line = w } else line = t } out.push(line); return out }
function drawDialog() {   // OMORI-style: black box with white border, fixed to the bottom; name tag left, portrait frame right
  sU(); X.globalAlpha = 1; X.imageSmoothingEnabled = false;
  const l = DL.q[DL.i], def = LK[l.n], BX = 6, BW = 308, BH = 38, BY = H - BH - 5;
  if (DL.wl !== DL.i) { DL.wl = DL.i; TXTF = l.cz ? CRAZYF : null; DL.lines = wrapPx(l.t, BW - 14, l.cz ? 8.6 : 8); TXTF = null }
  if (DL.sp !== l.n) { DL.sp = l.n; DL.slide = 0 } DL.slide = (DL.slide || 0) + 1;
  if (def) { const PS = 42, PX = BX + BW - PS, rise = Math.min(1, DL.slide / 8), fy = BY - PS + 1 + Math.round((1 - rise) * (PS - 2));
    r(PX, fy, PS, PS, '#fff'); r(PX + 1, fy + 1, PS - 2, PS - 2, '#000'); X.save(); X.beginPath(); X.rect(PX + 1, fy + 1, PS - 2, PS - 2); X.clip();
    const hop = DL.pt < 6 ? -Math.round(Math.sin(DL.pt / 6 * Math.PI) * 2) : 0; portrait(def, l.e, PX + 1, fy + 1 + hop, (PS - 2) / 56); X.restore() }
  r(BX, BY, BW, BH, '#fff'); r(BX + 1, BY + 1, BW - 2, BH - 2, '#000');
  const tag = def ? l.n : l.n && l.n != '' ? l.n : null;
  if (tag) { const nm = tag.toUpperCase(), nw = Math.ceil(tw(nm, 8)) + 12, ty = BY - 14; r(BX, ty, nw, 13, '#fff'); r(BX + 1, ty + 1, nw - 2, 11, '#000'); txt(nm, BX + 6, ty + 2, '#fff', 'left', 8) }
  let left = DL.c | 0; TXTF = l.cz ? CRAZYF : null; DL.lines.slice(0, 3).forEach((line, i) => { if (left <= 0) return; const j = l.cz ? (Math.random() - .5) * .5 : 0; txt(line.slice(0, left), BX + 7 + j, BY + 5 + i * 10.5 + j, l.cz ? '#f4e4e8' : '#fff', 'left', l.cz ? 8.6 : 8); left -= line.length + 1 }); TXTF = null;
  if (DL.c >= l.t.length && (tick >> 4) & 1) { r(BX + BW - 10, BY + BH - 8, 5, 1, '#fff'); r(BX + BW - 9, BY + BH - 7, 3, 1, '#fff'); r(BX + BW - 8, BY + BH - 6, 1, 1, '#fff') }
}
// ==================== LOCKED WAYS (the fears, and things that are not time yet) ====================
const LOCKS = {
  d1_ready: ['Caroline:happy|Not yet! Uku said dusk. Let\'s see the rest of the woods first.', 'Hitori:neutral|...Fine.'],
  uku_gone: ['|A huge hollow log, black inside. A cold wind breathes out of it.'],
  g_slept: ['Hermit Morrow:neutral|Not tonight. The woods past the camp change their shape after dark.', 'Hermit Morrow:neutral|Sleep by the fire. In the morning the paths will stay where you leave them.', 'Hitori:neutral|...Fine. First thing tomorrow.'],
  dark: ['Hitori:worried|...I can\'t go in there. It is so dark.', 'Hitori:neutral|I can\'t even see my own hands. I need to do something about that first.'],
  spider: ['|Thick webs cover the cliff path. Something skitters in them.', 'Hitori:scared|...No. I can\'t. Not past those.'],
  water: ['|The pier ends at deep, black water. A pipe mouth glints far below.', 'Hitori:scared|It looks like it goes on forever down there. I can\'t.'],
  height: ['|A ladder climbs the tower and keeps climbing, up past the clouds.', 'Hitori:scared|...I\'m not going up there. My legs won\'t do it.'],
  obs: ['Hitori:neutral|...Not yet. I haven\'t looked properly. He was here. I know he was here.'],
  d2_throne: ['Caroline:neutral|We haven\'t checked the castle yet.'], d3_pier: ['Steven:neutral|Let\'s see the rest of the resort first, okay?'], d4_house: ['Caroline:worried|Something is going on at the casino. We should check it out first.']
};
const DOORMSG = { bar: ['|"CLOSED. OPEN AT SIX."'], pharmacy: ['|The pharmacy is shut. Through the glass, rows and rows of little paper cups, each with a name on it.'], clocks: ['|Locked. Inside, every clock on every wall says six.'], surf: ['|"BACK IN 5 MINUTES." The sign is sun-bleached white.'], gifts: ['|The gift shop is closed. In the window: snow globes. Every one of them has the hollow tree inside.'] };
// ==================== OBJECTS, NPCS, FRIENDS ====================
const OBJ_FR = {   // a friend's remark the FIRST time you look at something with them around
  bench: { steven: 'Sit. Rest. The only exercise I like.', caroline: 'Ooh, a nice spot!', uku: '...good bench.' },
  clock: { steven: 'Still six o\'clock. Weird.', caroline: 'Maybe it\'s broken!', uku: 'Maybe it\'s just very patient.' },
  swing: { steven: 'I haven\'t been on one of these in years.', caroline: 'Push me! Push me!', uku: 'Careful.' },
  fountain: { steven: 'Don\'t throw anything in. People do that.', caroline: 'Make a wish!' },
  arcade: { steven: 'Oh, I could WIN this.', caroline: 'So many lights!' },
  telescope: { steven: 'Is that a star? Or a bug?', caroline: 'Let me look, let me look!' }
};
function objLines(e) {
  let lines = (e.alt && e.set && S.fl[e.set]) ? e.alt : (e.need && !S.fl[e.need] && e.nope) ? e.nope : e.say || [];
  const out = [...lines], key = 'o:' + S.a + ':' + e.at;
  if (!S.seen[key]) { S.seen[key] = 1; const fr = e.fr || OBJ_FR[e.kind] || {}; for (const i of S.party) if (i != PL) { const n = CH[i].n, v = fr[n.toLowerCase()]; if (v) { out.push(n + ':neutral|' + v); break } } }
  return out;
}
function objTalk(e) {
  if (e.ev) return EV[e.ev](e);
  const can = !(e.need && !S.fl[e.need] && !e.nope); if (!can) return;
  const first = e.set && !S.fl[e.set], lines = objLines(e); if (!lines.length) return;
  D(lines, () => { if (first && !(e.need && !S.fl[e.need])) flag(e.set); if (e.item && !S.items.includes(e.item) && first) giveItem(e.item); if (e.lore) addLore(e.lore) });
}
const NPC_DLG = {};   // id -> () => [lines, callback]
function npcTalk(e) { const f = NPC_DLG[e.id]; if (!f) return D(['|...']); const r_ = f(e); D(r_[0], r_[1]) }
function friendTalk(i) { const n = CH[i].n.toLowerCase(), fq = FQ[n] && FQ[n](); if (fq) D(fq[0], fq[1]) }
// ---- who has something for you (a notebook floats over their head)
const QMARK = {
  mo: () => !F_('mo1') || (F_('mush3') && !F_('mo_done')), pip: () => !F_('mag1') || (F_('nest_traded') && !F_('mag_done')), bella: () => F_('mag1') && !F_('mag2'),
  finn: () => F_('tag1') && !F_('tag2') && !F_('finn_hint'), morrow: () => S.day >= 2 && (!F_('ml1') || (F_('lamps3') && !F_('ml_done'))), coco: () => !F_('cc1') || (F_('cones3') && !F_('cc_done')), dex: () => !F_('dx1') || (F_('wax2') && !F_('dx_done'))
};
const hasQuest = e => e.k == 'npc' ? !!(QMARK[e.id] && QMARK[e.id]()) : e.k == 'friend' ? !!(FQ[CH[e.who].n.toLowerCase()] && FQ[CH[e.who].n.toLowerCase()]()) : false;
// ==================== QUESTS (flag-driven, several steps, across places and people) ====================
const QUESTS = [
  { id: 'magpie', nm: 'The Magpie\'s Trade', who: 'Pip', day: 1, start: 'mag1', steps: [['Ask Baker Bella (by the playground cart) if she saw who took Pip\'s marbles.', 'mag2'], ['A black bird headed for the garden. Look for a nest by Uku\'s house.', 'mag3'], ['The crow wants something shiny. Ask Caroline.', 'mag4'], ['Trade the shiny thing at the nest.', 'nest_traded'], ['Bring the marbles back to Pip.', 'mag_done']] },
  { id: 'mush', nm: 'Glow Mushrooms', who: 'Mayor Mo', day: 1, start: 'mo1', steps: [['Find 3 glow mushrooms in the Mushroom Grove. They grow on old stumps.', 'mush3'], ['Bring them to Mayor Mo.', 'mo_done']] },
  { id: 'bottle', nm: 'Steven\'s Bottle', who: 'Steven', day: 1, start: 'sb1', steps: [['Steven lost his water bottle when he sulked off in the meadow. Search the Sprout Meadow.', 'sb2'], ['Bring the bottle back to Steven.', 'sb_done']] },
  { id: 'tag', nm: 'A Scrap of Paper', who: '', day: 1, start: 'tag1', steps: [['A muddy scrap of paper from the garden. Something is printed on it.', 'tag1'], ['The mud is thick. Rinse it somewhere with clear water.', 'tag2'], ['It is soaked through. Dry it somewhere warm.', 'tag3'], ['Half the strip is missing. Someone must have kept the other half.', 'tag4']] },
  { id: 'sketch', nm: 'Caroline\'s Sketchbook', who: 'Caroline', day: 2, start: 'cs1', steps: [['Caroline dropped her sketchbook somewhere in the Gloom Marsh.', 'cs2'], ['Return the sketchbook to Caroline.', 'cs_done']] },
  { id: 'lamps', nm: 'Morrow\'s Lamps', who: 'Hermit Morrow', day: 2, start: 'ml1', steps: [['Relight the three lamp posts: Lantern Camp, Gloom Marsh, Key Ruins.', 'lamps3'], ['Tell Morrow the lamps are lit.', 'ml_done']] },
  { id: 'cones', nm: 'Cone Collector', who: 'Coco', day: 3, start: 'cc1', steps: [['Coco\'s ice cream cones blew away along the boardwalk and beach. Find 3.', 'cones3'], ['Bring them back to Coco.', 'cc_done']] },
  { id: 'wax', nm: 'Surf Wax', who: 'Dex', day: 3, start: 'dx1', steps: [['Dex left two blocks of surf wax: one by the resort pool, one on the rooftop.', 'wax2'], ['Bring the wax to Dex.', 'dx_done']] },
  { id: 'arcade', nm: 'High Score', who: 'Steven', day: 4, start: 'ar1', steps: [['Steven wants to beat the top score. Try all three lit machines in the Pixel Palace Arcade (Night Market).', 'ar3'], ['Tell Steven the machines are beaten.', 'ar_done']] }
];
function qStep(q) { for (let i = 0; i < q.steps.length; i++) if (!S.fl[q.steps[i][1]]) return i; return q.steps.length }
function questCheck() {
  if (S.fl.m1 && S.fl.m2 && S.fl.m3) S.fl.mush3 = 1; if (S.fl.l1 && S.fl.l2 && S.fl.l3) S.fl.lamps3 = 1; if (S.fl.c1 && S.fl.c2 && S.fl.c3) S.fl.cones3 = 1; if (S.fl.w1 && S.fl.w2) S.fl.wax2 = 1; if (S.fl.a1 && S.fl.a2 && S.fl.a3) S.fl.ar3 = 1;
  QUESTS.forEach(q => { if (!S.fl[q.start]) return; const st = qStep(q), prev = S.q[q.id] ?? 0; if (st != prev) { S.q[q.id] = st; if (st > prev) say(st >= q.steps.length ? 'Quest complete: ' + q.nm : 'Journal updated.') } })
}
const quest = id => QUESTS.find(q => q.id == id), qon = id => S.fl[quest(id).start] && qStep(quest(id)) < quest(id).steps.length, qs = id => qStep(quest(id));
function journalLines() {
  const L = [['TODAY', 1], [goalText(), 0], ['', 0], ['QUESTS', 1]]; let any = 0;
  QUESTS.forEach(q => { if (!S.fl[q.start]) return; any = 1; const st = qStep(q), done = st >= q.steps.length; L.push([(done ? '[x] ' : '[ ] ') + q.nm + (q.who ? '  (' + q.who + ')' : ''), 0]); if (!done) L.push(['    ' + q.steps[st][0], 2]) });
  if (!any) L.push(['People with a notebook over their head need something.', 2]); L.push(['', 0]); L.push(['NOTES', 1]); S.lore.forEach(id => L.push(['- ' + LORE[id], 0])); if (!S.lore.length) L.push(['Nothing yet.', 2]); return L;
}
const D1_AREAS = ['w_play', 'w_cross', 'w_garden', 'w_meadow', 'w_grove'];
function goalText() {
  if (!S) return '';
  const d = S.day, f = S.fl, fe = S.fear;
  if (d == 1) { if (fe.dark) return 'It\'s late. Find somewhere to rest past the tunnel.'; if (f.uku_gone) return fe.dark ? 'The wind comes from the hollow log. Go through it, together.' : 'Uku is gone. Look down the old well.'; if (f.d1_ready) return 'Dusk. Meet Uku at the old well (east, past the grove).'; return 'Look around the woods until dusk (' + Math.min(4, D1_AREAS.filter(a => S.seen[a]).length) + '/4 places).' }
  if (d == 2) return fe.spider ? 'It\'s night. Rest in the cabin on the cliff.' : f.d2_throne ? 'The webbed path east of the castle gate. Deal with it.' : 'Search Gloomwood. Morrow said: try the castle (north).';
  if (d == 3) return fe.water ? 'Through the pipe. Find somewhere to sleep in the city.' : f.d3_pier ? 'The end of the pier. The deep water. The pipe.' : 'Explore the resort and the beach. The pier is east of the beach.';
  if (d == 4) return f.d4_house ? 'The antenna tower, east of the plaza. Climb.' : 'Search the city. Everyone talks about the casino in the Neon Plaza.';
  return f.obs_seen ? 'Keep walking.' : 'Find Uku. The observatory, on the far island.';
}
// ==================== FIRST-TIME BANTER (plays once when the party first walks into a place) ====================
const AREA_TALK = {
  w_play: ['Caroline:happy|The swings! Nobody\'s on them. That means they\'re ours.', 'Steven:neutral|You\'re eighteen, Caroline.', 'Caroline:happy|And?'],
  w_cross: ['Uku:neutral|Four ways. We always end up taking all of them.', 'Steven:sad|My legs are already filing a complaint.'],
  w_garden: ['Uku:neutral|...Home sweet home.', 'Caroline:happy|Your garden looks so good, Uku!', 'Uku:blush|I don\'t really do anything. It just grows.'],
  w_meadow: ['Steven:worried|Those things in the grass. Are they looking at us?', 'Hitori:smug|Hehe. They\'re sprouts, Steven. Want me to hold your hand?', 'Steven:angry|...I hate you.'],
  w_grove: ['Caroline:happy|It glows! The whole place glows!', 'Uku:neutral|It\'s brighter at dusk. Wait and see.'],
  'w_well:1': ['|The light has gone orange. The well is humming, very low, like someone holding a note.'],
  'g_gate:1': ['Caroline:worried|It\'s so dark on this side.', 'Steven:scared|Can we go back? We can go back. We can find him tomorrow, in the daylight, like normal people.', 'Hitori:neutral|There\'s firelight up ahead. Come on.'],
  'g_camp:1': ['Hermit Morrow:neutral|Travellers. At this hour.', 'Hermit Morrow:neutral|You look like you\'ve lost something.', 'Hitori:neutral|Someone.', 'Hermit Morrow:sad|Then rest first. The dark is kinder to people who have slept. Take the tent by the woodpile.'],
  g_marsh: ['Caroline:worried|Watch your step. The water doesn\'t move at all.'],
  g_ruins: ['Steven:sad|Graves. Of course there are graves.', 'Caroline:neutral|They look old. Older than the trees.'],
  g_castle: ['Caroline:shock|A castle! A real one!', 'Steven:neutral|In the middle of a forest. Sure. Why not.'],
  c_hall: ['Steven:scared|Did that armour just breathe?', 'Hitori:smug|Hehehe. Go and ask it.'],
  'b_path:2': ['|Waves, somewhere below. The air smells like salt.', 'Steven:sad|A cabin. Please let it have beds. I am begging.'],
  b_boardwalk: ['Steven:happy|Ice cream. There is ice cream. I can see it from here.', 'Hitori:neutral|We\'re not on holiday, Steven.', 'Steven:angry|Maybe YOU aren\'t.'],
  b_plaza: ['Caroline:happy|It looks like a postcard!', 'Hitori:neutral|...It looks like a postcard of a postcard.'],
  b_shore: ['Caroline:happy|Sand! Real sand!', 'Steven:neutral|Do you ever think it\'s weird that nobody else is swimming?'],
  'b_pier:3': ['Steven:worried|This pier goes a long way out.', 'Caroline:neutral|The water is so dark under it.'],
  n_drain: ['Steven:sad|I\'m soaked. I\'m soaked and I\'m in a pipe. This is my life now.', 'Caroline:neutral|There\'s light at the end. Pink light.'],
  'n_street:3': ['Caroline:shock|Woah...', 'Steven:neutral|A whole city. Under the sea. Or above it. I can\'t tell any more.', 'Hitori:neutral|It\'s late. Look for somewhere to sleep. That capsule place.'],
  n_market: ['Caroline:happy|Lantern buns! Hitori, can we, please?', 'Hitori:neutral|...One.'],
  n_plaza: ['Steven:neutral|That\'s the casino everyone keeps talking about.', 'Caroline:worried|It looks like it\'s watching us.'],
  n_tower: ['Hitori:neutral|...Up. Everything in this city keeps pointing up.'],
  s_walk1: ['Hitori:neutral|Hello?', '|Your voice doesn\'t echo. It just stops, a little way in front of you.'],
  s_walk2: ['|This looks exactly like the last stretch of path.', 'Hitori:neutral|...It isn\'t. It only looks like it.'],
  s_walk3: ['|The music has stopped.', 'Hitori:worried|Steven? Caroline? ...I\'m sorry, okay? I\'m sorry I dragged you all this way.']
};
// ==================== DAYS ====================
function dayCard(n, sub, cb) { sc = 'daycard'; DC = { t: 0, n, sub, cb } }
let DC = null;
function dayUpdate() { DC.t++; if (DC.t == 20) beep(220, .5, 1.5, 'sine'); if (DC.t > 190 || (DC.t > 90 && ok())) { const cb = DC.cb; DC = null; sc = 'world'; cb && cb() } }
function dayDraw() { sU(); r(0, 0, W, H, '#000'); const a = clamp(DC.t / 30, 0, 1) * clamp((190 - DC.t) / 25, 0, 1); X.globalAlpha = a; txt('DAY ' + DC.n, W / 2, 70, '#fff', 'center', 22); txt(DC.sub, W / 2, 104, '#aaa', 'center', 8); X.globalAlpha = 1 }
function nextDay(wake) {   // only ever called from a bed (or the top of the ladder): the day ends where you fall asleep
  const d = S.day + 1, sub = { 2: 'Gloomwood', 3: 'Sunny Shores', 4: 'The Neon District', 5: 'Above' }[d]; S.day = d; S.party.forEach(i => S.hp[i] = maxHp(i));
  if (d == 5) S.party = [PL]; S.fade = null;
  dayCard(d, sub, () => { enter(wake[0], null, [wake[1], wake[2]]); sc = 'world'; fade = 1; const m = EV['morning' + d]; if (m) S.pendEv = m });
}
function fadeFriend(i, cb) { S.fade = S.fade || {}; S.fade[i] = 1; const iv = setInterval(() => { S.fade[i] -= .03; if (S.fade[i] <= 0) { clearInterval(iv); S.party = S.party.filter(p => p != i); delete S.fade[i]; cb && cb() } }, 33) }
// ==================== STORY EVENTS ====================
const EV = {
  intro() { D(['Caroline:happy|Good morning, Whispering Woods! Isn\'t today GORGEOUS?', 'Steven:sad|It\'s damp. There are bugs. I\'d rather be in bed.', 'Hitori:neutral|You say that every time. Then you stay until dark.', 'Uku:happy|Chill. We\'ve got all day.', 'Uku:neutral|Actually... meet me at the old well at dusk, okay? All of you. There\'s something I want to show you.', 'Steven:neutral|The WELL? Why is it always somewhere weird with you?', 'Uku:smug|You\'ll see.', 'Caroline:happy|Then let\'s look around until it gets dark! The playground, the meadow, the grove... I want to see everything.', '|(Arrows / WASD move. Z talks and looks at things. X opens your things, the journal and the map. Shift runs.)']) },
  dusk() { D(['|The light turns orange. Long shadows lie down across the path.', 'Uku:neutral|...It\'s getting late. I\'ll go on ahead to the well and get things ready.', 'Caroline:happy|Get WHAT ready?', 'Uku:smug|You\'ll see. East, past the grove. Don\'t be late.'], () => fadeFriend(3, () => say('Uku went on ahead.'))) },
  wellvanish() {
    D(['|Dusk. The old well hums softly. Uku is sitting on its edge, waiting.', 'Uku:happy|You came. All of you. Good.', 'Steven:neutral|Okay. We\'re here. What is it?', 'Uku:neutral|I don\'t know how to say it. Just... look down.', 'Hitori:worried|...There\'s nothing down there. It\'s just dark.', 'Uku:sad|Yeah. That\'s what I wanted to show you.', 'Uku:neutral|Don\'t forget me, okay?', '|The light goes out.'], () => { shake = 40; beep(70, .8, 2, 'sine'); E = E.filter(q => q.id != 'uku'); flag('uku_gone'); D(['|When it comes back, the edge of the well is empty.', 'Hitori:shock|Uku?', 'Hitori:scared|UKU!', 'Caroline:shock|Where did he GO?!', 'Steven:scared|He was right there. He was RIGHT THERE.', 'Hitori:worried|...The well. He went down the well.', 'Caroline:sad|It\'s so dark down there.', 'Hitori:neutral|...Then I\'ll go. Somebody has to.']) })
  },
  darkfear() {
    if (!F_('uku_gone')) return D(['|A dark tunnel. A little wind comes out of it.']);
    if (S.fear.dark) return D(['|The tunnel is only a tunnel now.']);
    D(['Hitori:worried|It\'s so dark.', 'Steven:scared|Hitori, you\'re shaking.', 'Hitori:neutral|...I know. Just a little light. That\'s all I need.', '|Hold your light on the watching eyes until they look away.'], () => mini('dark', () => { S.fear.dark = 1; flag('tired1'); D(['Hitori:happy|~Hah. Hahaha. They looked away!', 'Caroline:happy|You did it!', 'Steven:neutral|Great. Now it\'s pitch black AND we\'re inside a log.', 'Hitori:neutral|There\'s light on the other side. Come on. We\'ll find somewhere to stop for the night.']) }));
  },
  sleep(e) {
    const d = S.day;
    if (!F_('tired' + d)) return D([d == 1 ? 'Hitori:neutral|...It\'s not time to sleep. Not while he\'s out there.' : 'Hitori:neutral|Not yet. There\'s still too much to do today.']);
    const talk = {
      1: ['|The fire crackles. Nobody says anything for a long time.', 'Caroline:sad|He\'ll be okay. Right? Uku always turns up.', 'Steven:neutral|He probably went home the long way. He does that.', 'Hitori:neutral|...He didn\'t go home.', 'Steven:sad|Hitori. Don\'t.', 'Caroline:worried|Let\'s just sleep. Tomorrow we\'ll look everywhere. Together.', 'Hitori:neutral|...Together.'],
      2: ['Steven:sad|Can I say something without you getting mad?', 'Hitori:neutral|No promises.', 'Steven:neutral|I can\'t remember his face. Uku\'s. I try, and it\'s just... a hoodie. Orange hair. That\'s all I\'ve got.', 'Caroline:worried|Me neither. I keep drawing him and it comes out blank.', 'Hitori:angry|Then I\'ll remember for all of us.', 'Caroline:sad|...Okay. Goodnight, Hitori.'],
      3: ['Caroline:neutral|These little beds are kind of cute.', 'Steven:angry|Hitori. We\'ve been walking for three days. We don\'t even know where we\'re going.', 'Hitori:angry|We\'re going to find him.', 'Steven:angry|Then tell me one thing about him. One thing that isn\'t his hair.', 'Hitori:shock|He... he likes...', 'Hitori:sad|...Goodnight, Steven.', 'Caroline:sad|...Goodnight, everyone.']
    }[d] || [];
    const wake = { 1: ['g_camp', 11, 12], 2: ['b_cabin', 9, 7], 3: ['n_capsule', 11, 8] }[d];
    D([...talk, '|You close your eyes.'], () => nextDay(wake));
  },
  morning2() { D(['Steven:sad|My back hates me. My back hates this forest.', 'Caroline:happy|Morning, everyone! ...Hitori, did you sleep?', 'Hitori:neutral|No.', 'Hermit Morrow:neutral|If you are looking for someone, try the castle to the north. Lost things wash up there.', 'Caroline:neutral|Hey... who are we looking for again?', 'Hitori:shock|...What?', 'Caroline:happy|Kidding! Uku. Of course. Uku.', 'Hitori:neutral|...That wasn\'t funny.']) },
  morning3() { D(['|Morning light through the cabin window. Somewhere below, the sea.', 'Caroline:happy|The sea! Look at the SEA!', 'Steven:happy|There\'s a whole resort down there. With ice cream. I\'m not going to pretend I\'m not excited.', 'Hitori:neutral|...Fine. But we\'re looking for him. Not having fun.']) },
  morning4() { D(['Steven:neutral|...Hey. Sorry about last night.', 'Hitori:neutral|Whatever.', 'Caroline:worried|There\'s a casino everybody keeps talking about. If something is wrong in this city, it\'s in there.', 'Steven:neutral|Let\'s get it over with.']) },
  morning5() { D(['|You wake up on a cold island of grass, floating in the dark. The ladder ends beside you.', 'Hitori:neutral|...I fell asleep. On a ladder. Great.', 'Hitori:sad|It\'s so quiet without them.', 'Hitori:neutral|...Okay. That building, on the far island. If he\'s anywhere, he\'s there.']) },
  throne() {
    D(['Caroline:neutral|Why are we in a castle again?', 'Steven:sad|Ugh. No idea. Something about... finding someone?', 'Hitori:worried|...Someone small. Orange hair.', 'Caroline:neutral|Hm. Can\'t think of anyone like that.', '|One by one, your friends\' faces go blank. Just for a moment.', 'Hitori:scared|~...They forgot. They\'re forgetting him.', 'Hitori:angry|...Fine. FINE. The webbed path by the gate. That\'s the only way left. We\'re going.'], () => { flag('d2_throne') })
  },
  spiderfear() {
    if (!F_('d2_throne')) return D(['|Thick webs. Something skitters in them.', 'Caroline:worried|Let\'s not go that way. Not yet.']);
    if (S.fear.spider) return;
    D(['Hitori:scared|The webs. They go all the way up.', 'Steven:scared|I\'m not touching those.', 'Hitori:neutral|...Me neither. But there\'s no other way.', '|Cut the web strand by strand. Press the arrow shown for each spider as it reaches the ring.'], () => mini('spider', () => { S.fear.spider = 1; flag('tired2'); E = E.filter(e => e.kind != 'web'); D(['Hitori:neutral|...That wasn\'t so bad. They were just spiders.', 'Caroline:happy|The path is open! I can smell the sea!', 'Steven:sad|It\'s dark already. How is it dark already?', 'Hitori:neutral|There was a cabin on the old map. On the cliff. We\'ll sleep there.']) }));
  },
  pierdive() {
    if (S.day < 3) return D(['|It is far too dark to see the water.', 'Hitori:neutral|...Tomorrow.']);
    if (!F_('d3_pier')) { flag('d3_pier'); return D(['|The pier ends. Below, the water goes black. Far down, a round pipe mouth is glowing.', 'Steven:sad|Okay, no. Absolutely not.', 'Caroline:worried|Is that a tunnel? Under there?', 'Hitori:scared|...I think that\'s where he went.', 'Hitori:neutral|I\'m going to have to go down there.']) }
    if (S.fear.water) return;
    D(['Hitori:scared|It\'s so deep.', 'Hitori:neutral|Hold your breath. Go down. Grab the air. Don\'t stop.', '|Swim down: left/right to steer, collect air bubbles, avoid the jellyfish.'], () => mini('water', () => { S.fear.water = 1; flag('tired3'); D(['Hitori:happy|Hah! I can breathe!', 'Steven:shock|You went down there and came back!', 'Hitori:neutral|The pipe goes somewhere. A long way. Hold your breath, everyone.', '|Together you swim into the pipe. Pink light at the far end.'], () => go('n_drain', 'b_pier')) }));
  },
  house() { D(['|The House spins its reels. "WELCOME BACK, HITORI. THE HOUSE ALWAYS WINS."'], () => startBattle({ k: 'enemy', t: 'house', x: 0, y: 0, boss: 1 })) },
  friendsvanish() {
    D(['|The House folds in on itself like a card table.', 'Caroline:worried|Hitori... why is it so quiet?', 'Steven:scared|My hands. Look at my hands. I can see the floor through them.', 'Caroline:sad|I don\'t remember why we came here. I don\'t remember... the woods. Did we have a tree?', 'Hitori:shock|We had a tree. We had a TREE. The hollow one, by the pond, you always sat on the left and-', 'Steven:sad|Hitori. Thanks for dragging us along. Really.', 'Caroline:happy|Find him, okay? Find him and tell him we said hi.', 'Hitori:shock|Wait. Wait, no, don\'t-'],
      () => { fadeFriend(0, () => {}); fadeFriend(1, () => { flag('d4_house'); S.party = [PL]; D(['|You are alone.', 'Hitori:neutral|...Okay.', 'Hitori:neutral|...Okay. The tower. Everything here keeps pointing up.']) }) })
  },
  heightfear() {
    if (!F_('d4_house')) return D(['|A ladder climbs the tower, up past the clouds.', 'Hitori:neutral|Not yet. Not while they\'re still with me. I\'m not leaving them down here.']);
    D(['Hitori:scared|It goes up forever.', 'Hitori:neutral|...Just one rung. Then the next one.', '|Keep your balance: hold LEFT/RIGHT against the wind, climb to the top.'], () => mini('height', () => { S.fear.height = 1; D(['Hitori:happy|I did it. I\'m... I\'m actually doing it.', '|The ladder goes on and on. Somewhere near the top, you stop counting the rungs.'], () => nextDay(['s_garden', 9, 18])) }));
  },
  finale() { D(['|The observatory is empty.', '|A chair beside the great telescope. An orange hoodie, folded over the back of it.', 'Hitori:worried|Uku?', '|No answer. Only the low hum of the stars.']) },
  obshood() {
    if (F_('obs_hood')) return D(['|Uku\'s hoodie. You don\'t want to touch it again.']);
    D(['|It is Uku\'s hoodie. It is still warm.', 'Hitori:sad|...You were just here.', 'Hitori:angry|~Why do you keep LEAVING?!', '|The room swallows the sound.'], () => flag('obs_hood'));
  },
  obstele() {
    D(['|You look into the telescope. It is not pointed up at the stars. It is pointed down.', '|Far, far below: the hollow tree. A picnic blanket. Three small figures, sitting very close together.', '|There is room for one more. None of them is looking up.', 'Hitori:sad|...', 'Hitori:neutral|...Fine. I\'ll walk.'], () => { flag('obs_seen'); addLore('below') });
  },
  walk4() {
    D(['|...', '|Someone, very far away, is saying your name.', '|~"Hitori."', 'Hitori:scared|...Who\'s there?', '|~"Hitori. It\'s six o\'clock."', '|~"Everyone is waiting for you."', 'Hitori:scared|~I\'m not done. I haven\'t found him yet. I haven\'t found ANY of them-', '|The voice doesn\'t answer. The path keeps going.'], () => { shake = 20 });
  },
  theend() {
    D(['|The path ends.', '|There is nothing in front of you. There is nothing behind you.', 'Hitori:sad|...Uku?', '|Your own voice comes back to you, a moment late.', 'Hitori:neutral|~...I\'m not lost.', 'Hitori:neutral|~I know exactly where I am.'], () => { ST.set('syn_part1', 1); END = { t: 0 }; sc = 'end' });
  },
  tunnel() { EV.darkfear() }, web() { EV.spiderfear() }, pier() { EV.pierdive() }, ladder() { EV.heightfear() }
};
// ==================== THE CUT TO BLACK ====================
let END = null;
function endDraw() {
  END.t++; sU(); r(0, 0, W, H, '#000');
  if (END.t < 40 && END.t % 6 < 3) { r(0, 0, W, H, '#0a0612') }
  const a1 = clamp((END.t - 260) / 90, 0, 1), a2 = clamp((END.t - 420) / 90, 0, 1);
  if (a1 > 0) { X.globalAlpha = a1; txt('S Y N C H R O N I C I T Y', W / 2, 74, '#fff', 'center', 8); X.globalAlpha = 1 }
  if (a2 > 0) { X.globalAlpha = a2; txt('end of part one', W / 2, 92, '#777', 'center', 6); X.globalAlpha = 1 }
  if (END.t > 560 && ok()) title();
}
