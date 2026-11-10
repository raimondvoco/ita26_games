// ==================== DATA ====================
const PL = 2;   // the player character is Hitori (index into CH)
const CH = [   // the four friends. skills: [name, description]. base stats: hp atk def luck
  { n: 'Steven', sk: '#f0c8a0', hr: '#5b3b25', st: 'messy', top: '#e8e2d8', bt: '#282832', shoe: '#e2ded5', a: ['hood'], emo: 'sad', st0: { hp: 46, atk: 6, def: 4, luck: 2 }, skill: ['Sulk', 'Guard the team and sink into SAD.'] },
  { n: 'Caroline', sk: '#f0cbb4', hr: '#28232a', st: 'long', top: '#77777a', bt: '#28262a', shoe: '#c9c3bb', a: ['hood'], emo: 'happy', st0: { hp: 40, atk: 5, def: 3, luck: 4 }, skill: ['Sunshine', 'Heal everyone and turn HAPPY.'] },
  { n: 'Hitori', sk: '#e7d2ce', hr: '#17151c', st: 'long', top: '#211923', tr: '#692b3c', bt: '#1c1720', shoe: '#19151c', a: ['horns', 'cloak'], emo: 'angry', st0: { hp: 44, atk: 8, def: 2, luck: 3 }, skill: ['Hysteria', 'A cackling double-strike. Turns ANGRY.'] },
  { n: 'Uku', sk: '#efc6a5', hr: '#b85d2c', st: 'messy', top: '#202a42', bt: '#292832', shoe: '#d0c9bd', a: ['hood'], emo: 'neutral', st0: { hp: 42, atk: 6, def: 3, luck: 5 }, skill: ['Chill', 'Calm the enemy and heal a little.'] }];
const ND = {   // every NPC has its own unique look
  mo: { n: 'Mayor Mo', sk: '#e8c09a', hr: '#c8c8d0', st: 'bald', top: '#7a4a2a', tr: '#ffd23c', bt: '#3a2a1a', a: ['tophat', 'mustache', 'gold'] },
  bella: { n: 'Baker Bella', sk: '#f2c4a0', hr: '#a8442a', st: 'bun', top: '#c8a0e0', bt: '#6a5a8a', a: ['apron'], mo: 'smile' },
  pip: { n: 'Pip', sk: '#e6b88e', hr: '#3a2a1a', st: 'none', top: '#4a8ad8', bt: '#6a4a2a', a: ['cap', 'pack'] },
  finn: { n: 'Fisher Finn', sk: '#d8a880', hr: '#9a9a9a', st: 'none', top: '#3a6a5a', bt: '#5a4a3a', a: ['strawhat', 'beard'], shoe: '#4a3a2a' },
  morrow: { n: 'Hermit Morrow', sk: '#9a8aa8', hr: '#222', st: 'none', top: '#4a5068', bt: '#2a2a3a', a: ['cloak'] },
  vesper: { n: 'Lady Vesper', sk: '#e6e0f0', hr: '#c8b8f0', st: 'long', top: '#d8d0f4', bt: '#d8d0f4', a: ['dress'], g: .72 },
  rattles: { n: 'Ser Rattles', sk: '#ece8d4', hr: '#222', st: 'none', top: '#7a8098', bt: '#5a6078', a: ['helm', 'skull'], shoe: '#4a5068' },
  lou: { n: 'Lifeguard Lou', sk: '#c8946a', hr: '#2a1a12', st: 'spiky', top: '#e8443a', bt: '#e8443a', a: ['visor', 'whistle'], shoe: '#f2f2f2' },
  coco: { n: 'Coco', sk: '#f4d0b0', hr: '#ff8fb8', st: 'bun', top: '#8ad8ff', tr: '#ffffff', bt: '#ffffff', a: ['apron'], mo: 'smile' },
  dex: { n: 'Dex', sk: '#e0a878', hr: '#f4d86a', st: 'messy', top: '#2ab8a8', bt: '#f08a3a', a: ['shades'], shoe: '#e8d8a8' },
  chips: { n: 'Mr. Chips', sk: '#e8c8a8', hr: '#111111', st: 'slick', top: '#1a1a22', tr: '#ff3ca0', bt: '#111111', a: ['bowtie', 'shades', 'gold'] },
  nova: { n: 'Nurse Nova', sk: '#f2d2b6', hr: '#34466a', st: 'bun', top: '#f4f6fa', tr: '#d03a4a', bt: '#c8d0e0', a: ['nursecap', 'mask', 'apron'] },
  ren: { n: 'Ren' }, kix: { n: 'Kix' }, doc: { n: 'Street Doc' }, tick: { n: 'Tick' }, wire: { n: 'Wire' }, mei: { n: 'Mei' },
  biscuit: { n: 'Old Biscuit', animal: 1 }, mochi: { n: 'Mochi', animal: 1 }, hoot: { n: 'Professor Hoot', animal: 1 }, shell: { n: 'Old Shell', animal: 1 }   // shack animals (sprites + portraits made by tools/make_art.py)
};
const LK = {}; [...CH, ...Object.values(ND)].forEach(c => LK[c.n] = c);
// enemies: spr = file in assets/enemies. Stats are scaled up by progress and battles won (see scaleEnemy)
const EN = {
  sprout: { n: 'Sprout', hp: 22, atk: 4, xp: 7, spr: 'sprout' }, shadow: { n: 'Shadow', hp: 38, atk: 7, xp: 13, spr: 'shadow' }, crab: { n: 'Crab', hp: 52, atk: 9, xp: 17, spr: 'crab' },
  glitch: { n: 'Glitch', hp: 70, atk: 12, xp: 22, spr: 'glitch' }, frostling: { n: 'Frostling', hp: 34, atk: 6, xp: 11, spr: 'frostling' }, jelly: { n: 'Moon Jelly', hp: 44, atk: 8, xp: 14, spr: 'jelly' },
  house: { n: 'The House', hp: 190, atk: 15, xp: 0, spr: 'house' }
};
const LET = { F: 'forest', D: 'dark', B: 'beach', C: 'city', S: 'snow', L: 'lake', H: 'hub' };
const STAGE = { forest: 0, dark: 1, beach: 2, city: 3 };   // story progress; also drives how angry everyone gets
const BI = {
  forest: { nm: 'Whispering Woods', en: 'sprout', item: 'Glow Mushroom', mus: 'forest', q: [['kill', 3, 'Squash Sprouts'], ['item', 3, 'Glow Mushrooms']] },
  dark: { nm: 'Gloomwood', en: 'shadow', item: 'Rusty Key', mus: 'dark', dk: 1, q: [['kill', 4, 'Dispel Shadows'], ['item', 3, 'Rusty Keys']] },
  beach: { nm: 'Sunny Shores', en: 'crab', item: 'Seashell', mus: 'beach', q: [['kill', 4, 'Shoo Crabs'], ['item', 3, 'Seashells']] },
  city: { nm: 'Neon District', en: 'glitch', item: 'Neon Token', mus: 'scary', q: [['kill', 4, 'Reboot Glitches'], ['item', 3, 'Neon Tokens']] },
  snow: { nm: 'Frostbite Peaks', en: 'frostling', mus: 'inboredom' },
  lake: { nm: 'Moonlit Lake', en: 'jelly', mus: 'inboredom' },
  hub: { nm: 'The Crossroads', en: null, mus: 'forest' },
  castle: { nm: 'Castle Mortis', en: 'shadow', dk: 1, fixed: 1, w: 30, h: 20, mus: 'scary', z: [{ n: 'Great Hall', k: 'safe', x: 2, y: 2, w: 26, h: 16 }] },
  shack: { nm: 'Little Shack', fixed: 1, w: 12, h: 9, mus: 'forest', z: [{ n: 'Shack', k: 'safe', x: 2, y: 2, w: 8, h: 5 }] },
  casino: { nm: 'Casino Abyss', en: 'glitch', fixed: 1, w: 30, h: 18, mus: 'scary', z: [{ n: 'Casino Floor', k: 'safe', x: 2, y: 2, w: 26, h: 14 }] }
};
const ZNAME = { safe: ['Hangout', 'A safe place. Save at the vending machine.'], mob: ['Wilds', 'Monsters roam here.'], item: ['Gathering Spot', 'Useful things lie around.'], story: ['Landmark', 'Something important is here.'] };
const ZN = { F: ['Hangout Clearing', 'Sprout Meadow', 'Bramble Patch', 'Mushroom Grove', 'Old Well'], D: ['Lantern Camp', 'Hollow Woods', 'Gloom Marsh', 'Key Ruins', 'Castle Gate'], B: ['Resort Plaza', 'Crab Flats', 'Shell Cove', 'Lighthouse Point'], C: ['Neon Plaza', 'Glitch Alley', 'Arcade Row', 'Casino Steps'], S: ['Snowed-In Camp', 'Frozen Drifts', 'Icicle Cave', 'Static Hollow'], L: ['Lakeside Dock', 'Reed Marsh', 'Clinic Island', 'Nurse Station'], H: ['The Crossroads'] };
// ---- items: all drawn black with a white outline. type: weapon / gear / charm / key
const ITEMDEF = {
  bat: { n: 'Wooden Bat', t: 'weapon', atk: 3, d: 'Splintered at the grip. Someone carved a tiny star into it.' },
  scissors: { n: 'Rusty Scissors', t: 'weapon', atk: 5, d: 'Too sharp for craft class. Hitori giggles when she holds them.' },
  pan: { n: 'Frying Pan', t: 'weapon', atk: 4, def: 1, d: 'Still smells like breakfast. Surprisingly hard to dodge.' },
  umbrella: { n: 'Umbrella Blade', t: 'weapon', atk: 7, d: 'A rainy-day classic. The tip is far too sharp.' },
  wrench: { n: 'Pipe Wrench', t: 'weapon', atk: 6, d: 'Heavy. It hums faintly, like the walls are listening.' },
  hoodie: { n: 'Thick Hoodie', t: 'gear', def: 3, hp: 5, d: 'Oversized and warm. Smells like someone you used to know.' },
  vest: { n: 'Padded Vest', t: 'gear', def: 5, d: 'Foam and stitched canvas. The tag says "SUPERVISED USE ONLY".' },
  boots: { n: 'Combat Boots', t: 'gear', def: 2, luck: 1, hp: 8, d: 'Stomp loudly so the dark knows you are coming.' },
  headphones: { n: 'Noise Cancelers', t: 'charm', luck: 2, d: 'Plays nothing. Somehow it still blocks out the whispering.' },
  locket: { n: 'Cracked Locket', t: 'charm', hp: 10, d: 'Inside: a photo with a face scratched out.' },
  coin: { n: 'Lucky Coin', t: 'charm', luck: 4, d: 'Heads, you win. Tails, you also win. There is no tails.' },
  watch: { n: 'Stopped Watch', t: 'charm', def: 2, luck: 1, d: 'It stopped at 6:00 PM. Dinner time. Medication time.' },
  cassette: { n: 'Labeled Cassette', t: 'key', d: 'Handwritten: "PLAY ME. DO NOT TELL THE NURSES." Needs a TV.' },
  wristband: { n: 'Paper Strip', t: 'key', d: 'Two torn halves, pressed together. A name in blue ink and a number.' },
  scrap: { n: 'Muddy Scrap', t: 'key', d: 'Half a strip of paper. Only "...OM 4" is legible.' },
  clip: { n: 'Hair Clip', t: 'key', d: 'Caroline\'s favourite. Shiny enough to bribe a crow.' },
  polaroid: { n: 'Blurred Polaroid', t: 'key', d: 'Five people on a couch. One of them has been scribbled over.' },
  lantern: { n: 'Dim Lantern', t: 'key', d: 'Gives off more shadow than light. Morrow wants it back.' }
};
// ---- side quests. kind: fetch (collect things) / kill (any enemy of the giver\'s region)
const SQ = [
  { id: 'marbles', giver: 'pip', r: 'F', name: 'Pip\'s Marbles', desc: 'Find 3 glass marbles in the Sprout Meadow.', kind: 'fetch', n: 3, what: 'Marble', zone: 'F.mob1', reward: { item: 'bat', xp: 12 }, done: 'You got them ALL?! You\'re cooler than the mayor!', lore: 'Pip says the meadow was bigger yesterday.' },
  { id: 'muffins', giver: 'bella', r: 'F', name: 'Muffin Menace', desc: 'Squash 4 Sprouts that stole the muffins.', kind: 'kill', n: 4, enemy: 'sprout', reward: { item: 'hoodie', xp: 15 }, done: 'Crumbs everywhere, but justice is served.' },
  { id: 'boots', giver: 'finn', r: 'F', name: 'Fishing for Boots', desc: 'Find 2 old boots near the Mushroom Grove.', kind: 'fetch', n: 2, what: 'Old Boot', zone: 'F.item', reward: { item: 'boots', xp: 12 }, done: 'Finally, a catch. Take the good pair.' },
  { id: 'oil', giver: 'morrow', r: 'D', name: 'Lamp Oil', desc: 'Collect 3 vials of lamp oil in the Hollow Woods.', kind: 'fetch', n: 3, what: 'Lamp Oil', zone: 'D.mob1', reward: { item: 'lantern', xp: 25 }, done: 'The dark thins when you carry it.', lore: 'Morrow says the dark is only loud if you are.' },
  { id: 'vesper', giver: 'vesper', r: 'D', name: 'A Name on the Tip', desc: 'Find 2 locket shards in the Gloom Marsh.', kind: 'fetch', n: 2, what: 'Locket Shard', zone: 'D.mob2', reward: { item: 'locket', xp: 25 }, done: 'His name was... no. It slipped again. Thank you.', lore: 'Lady Vesper keeps forgetting who she is waiting for.' },
  { id: 'knight', giver: 'rattles', r: 'D', name: 'Knight\'s Duty', desc: 'Defeat 5 Shadows.', kind: 'kill', n: 5, enemy: 'shadow', reward: { item: 'umbrella', xp: 30 }, done: 'You fight like a king with no crown. Take this.' },
  { id: 'crabs', giver: 'lou', r: 'B', name: 'Crab Patrol', desc: 'Shoo 5 Crabs off the beach.', kind: 'kill', n: 5, enemy: 'crab', reward: { item: 'vest', xp: 30 }, done: 'Beach secured! Go wild. Not too wild.' },
  { id: 'cones', giver: 'coco', r: 'B', name: 'Cone Collector', desc: 'Find 3 lost cones in Shell Cove.', kind: 'fetch', n: 3, what: 'Ice Cream Cone', zone: 'B.item', reward: { item: 'coin', xp: 30 }, done: 'Melted, but I love you anyway.' },
  { id: 'wax', giver: 'dex', r: 'B', name: 'Surf Wax', desc: 'Find 2 blocks of surf wax in Crab Flats.', kind: 'fetch', n: 2, what: 'Surf Wax', zone: 'B.mob1', reward: { item: 'headphones', xp: 30 }, done: 'Rad. Now the static sounds like waves.', lore: 'Dex swears the ocean repeats every 90 seconds.' },
  { id: 'charts', giver: 'nova', r: 'L', name: 'Lost Charts', desc: 'Find 3 clipboard pages around Clinic Island.', kind: 'fetch', n: 3, what: 'Chart Page', zone: 'L.item', reward: { item: 'wrench', xp: 35 }, done: 'Thank you. Please do not read them. ...You already did.', lore: 'The clinic charts list five patients and only four beds.' }
];
// ---- lore notes (found with easter eggs); shown in the journal
const LORE = {   // deliberately small and strange: nothing here ever explains itself
  clocks: 'Every clock in these woods says six o\'clock.', photo: 'A photograph with an empty space left at one end.', bands: 'A drawer of identical white bands, rolled up and waiting.', sand: 'Smooth sand. Nobody has been here, and somebody just left.',
  tag: 'A paper strip, two halves. A name in your own handwriting, and a room number.', phone: 'A payphone rang. The voice only said: "Dinner is at six."', mirror: 'Your reflection arrived a moment late.', chart: 'Five names on a list. Four beds.', door: 'A door with no handle on the inside.', below: 'The telescope in the observatory pointed down, at a place where three people were sitting very close together.'
};
const PAL = {   // soft OMORI-like palettes: flat mint ground, teal trees with dark outlines, pale pink dirt
  forest: { a: ['#a8dcb0', '#9fd4a8', '#b2e2b8'], sp: '#86c294', tall: '#7cbf8e', tuft: '#e4f6e4', tuft2: '#6aa77c', path: '#ecdcb8', path2: '#d8c49a', pe: '#a88e64', lawn: '#bce8c0', plaza: '#dad4c6', pl2: '#c0b9a8', fl: ['#ffffff', '#bcd8ff', '#ffc8dc', '#ffe9a0'], pink: '#f4dcee', pink2: '#e2c0d8', tm: '#3fb79c', tl: '#92e6c8', td: '#2a8c7a', to: '#1c5c58', tr: '#7a5240', wt: '#80cae8', wt2: '#b0e4f6', wo: '#3e8aa8' },
  dark: { a: ['#4a4468', '#454060', '#504a6e'], sp: '#38324f', tall: '#3c3658', tuft: '#7a72a4', tuft2: '#2c2744', path: '#6c648a', path2: '#58507a', pe: '#2a2440', lawn: '#554e74', plaza: '#6c648a', pl2: '#58507a', fl: ['#88ffff', '#c890ff', '#88ffaa', '#ffa0cc'], pink: '#5a4a70', pink2: '#4a3c60', tm: '#6a5aa4', tl: '#a090d8', td: '#463a7a', to: '#221a3a', tr: '#2a1c3a', wt: '#3a5a98', wt2: '#6a8ac8', wo: '#1e2e5a' },
  beach: { a: ['#f4e2ac', '#ecdca2', '#f8eaba'], sp: '#d8c488', tall: '#e2ce92', tuft: '#a8d080', tuft2: '#c2ae72', path: '#e8ca98', path2: '#d6b67e', pe: '#b09462', lawn: '#f8eec6', plaza: '#f2ede2', pl2: '#dad2be', fl: ['#ffb0c8', '#ffffff', '#ffe08a', '#9fd4ff'], pink: '#f6d8c4', pink2: '#e8c2aa', tm: '#3ab472', tl: '#92e2a4', td: '#28865a', to: '#185840', tr: '#9a7444', wt: '#5ab6e2', wt2: '#9ad8f4', wo: '#2a78a8' },
  city: { a: ['#22223a', '#1e1e34', '#262640'], sp: '#14142a', tall: '#1d1d2e', tuft: '#34344e', path: '#34344e', path2: '#2a2a44', pe: '#15151f', lawn: '#2c2c46', plaza: '#2a2a46', pl2: '#262642', fl: ['#ff3ca0', '#3ee0ff', '#ffd23c', '#8cff5a'], pink: '#2e2e48', pink2: '#222238', tm: '#444458', tl: '#666680', td: '#2a2a3a', to: '#0e0e18', tr: '#333344', wt: '#1a2a4a', wt2: '#3a4a7a', wo: '#0a1020' },
  castle: { a: ['#3a3450', '#363049', '#3e3856'], sp: '#2a2440', tall: '#3a3450', tuft: '#4a4468', path: '#7a2630', path2: '#5a1c26', pe: '#3a0f16', lawn: '#3a3450', plaza: '#47405a', pl2: '#383248', fl: [], pink: '#3a3450', pink2: '#2a2440', tm: '#5a5470', tl: '#8a84a0', td: '#3a3450', to: '#1a1626', tr: '#2a1c3a', wt: '#243a66', wt2: '#4a5a96', wo: '#101830' },
  casino: { a: ['#431230', '#3c102b', '#4a1636'], sp: '#2c0a20', tall: '#431230', tuft: '#5a1a40', path: '#8a1a4a', path2: '#a82a60', pe: '#4a0a24', lawn: '#431230', plaza: '#47405a', pl2: '#383248', fl: [], pink: '#431230', pink2: '#2c0a20', tm: '#701850', tl: '#ff3ca0', td: '#3c102b', to: '#1a0a1a', tr: '#2a1c3a', wt: '#243a66', wt2: '#4a5a96', wo: '#101830' }
};
const NC = ['#ff3ca0', '#3ee0ff', '#ffd23c', '#8cff5a'], KJ = ['夢', '光', '賭', '電', '運', '酒'];

// extra regions
PAL.snow = { a: ['#e4eefa', '#dce8f6', '#ecf3fc'], sp: '#c4d4ea', tall: '#d0def0', tuft: '#ffffff', tuft2: '#aebfd8', path: '#cdb9a0', path2: '#b9a488', pe: '#8a7660', lawn: '#f2f7ff', plaza: '#dfe6f0', pl2: '#c8d2e0', fl: ['#ffffff', '#bcd8ff', '#d8c8ff', '#ffffff'], pink: '#cfe0f4', pink2: '#b4c8e4', tm: '#5a8aaa', tl: '#a8d0e6', td: '#3a6a8a', to: '#1e3c58', tr: '#6a5a4c', wt: '#a8d4ee', wt2: '#e4f4ff', wo: '#5a8aaa' };
PAL.lake = { a: ['#8fd0c8', '#86c8c0', '#98d8d0'], sp: '#6cb0a8', tall: '#62a8a0', tuft: '#d4f4ee', tuft2: '#4e8e88', path: '#dccaa0', path2: '#c6b488', pe: '#98845a', lawn: '#a6e0d8', plaza: '#cfd6d4', pl2: '#b4bcba', fl: ['#ffffff', '#c8e8ff', '#ffc8e0', '#fff0a8'], pink: '#c8e0d8', pink2: '#a8c8c0', tm: '#3a9a9a', tl: '#8adcd0', td: '#26767a', to: '#164a50', tr: '#6a5444', wt: '#4a9ad0', wt2: '#8ac8ee', wo: '#1e5a8a' };
PAL.hub = { a: ['#e8b8d8', '#e0b0d0', '#f0c4e0'], sp: '#c898b8', tall: '#d4a4c4', tuft: '#fff0f8', tuft2: '#b88ca8', path: '#f2e4cc', path2: '#dccaaa', pe: '#a88c70', lawn: '#f4cce6', plaza: '#e6d8e4', pl2: '#ccbcc8', fl: ['#ffffff', '#ffd0e8', '#fff0a8', '#d8c0ff'], pink: '#f8d8ec', pink2: '#e0b4d0', tm: '#e07aa8', tl: '#ffb8d4', td: '#b8507e', to: '#6e2a4a', tr: '#7a5446', wt: '#8ec4ee', wt2: '#c4e4fa', wo: '#4a7ab0' };
const PCOL = { forest: 'rgba(255,255,170,.7)', dark: 'rgba(150,200,255,.6)', beach: 'rgba(255,255,255,.35)', city: 'rgba(120,230,255,.5)', snow: 'rgba(255,255,255,.8)', lake: 'rgba(200,255,255,.5)', hub: 'rgba(255,200,230,.7)' };   // drifting ambient particles per region

// ---- monster variants (hue-shifted art) so zones feel different; they count for the same quests as their base
Object.assign(EN, {
  bloomling: { n: 'Bloomling', hp: 30, atk: 6, xp: 10, spr: 'bloomling', base: 'sprout' }, wraith: { n: 'Wraith', hp: 50, atk: 9, xp: 17, spr: 'wraith', base: 'shadow' }, hermit: { n: 'Hermit', hp: 66, atk: 11, xp: 22, spr: 'hermit', base: 'crab' },
  static: { n: 'Static', hp: 88, atk: 15, xp: 28, spr: 'static', base: 'glitch' }, glowjelly: { n: 'Glow Jelly', hp: 56, atk: 10, xp: 18, spr: 'glowjelly', base: 'jelly' } });
const VARIANT = { sprout: 'bloomling', shadow: 'wraith', crab: 'hermit', glitch: 'static', jelly: 'glowjelly' };
const SQKIND = { marbles: 'marble', boots: 'boot', oil: 'oil', vesper: 'shard', cones: 'cone', wax: 'wax', charts: 'page' }, QKIND = { forest: 'mushroom', dark: 'key', beach: 'shell', city: 'token' };
PAL.shack = { a: ['#9a7448', '#926c42', '#a07c50'], sp: '#7a5834', tall: '#9a7448', tuft: '#b08a5c', tuft2: '#7a5834', path: '#b8505a', path2: '#9a3c46', pe: '#6a2a32', lawn: '#9a7448', plaza: '#9a7448', pl2: '#8a6640', fl: [], pink: '#9a7448', pink2: '#7a5834', tm: '#6a4a2e', tl: '#8a6a44', td: '#4a321c', to: '#2a1a0e', tr: '#4a321c', wt: '#243a66', wt2: '#4a5a96', wo: '#101830' };
Object.assign(EN, { knight: { n: 'Hollow Knight', hp: 48, atk: 9, xp: 17, spr: 'knight' }, squire: { n: 'Squire', hp: 30, atk: 6, xp: 11, spr: 'squire' }, warden: { n: 'The Warden', hp: 120, atk: 12, xp: 45, spr: 'warden' } });
