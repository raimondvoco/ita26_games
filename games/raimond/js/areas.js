// ==================== AREAS: helpers + extra palettes + DAY 1 (Whispering Woods) ====================
const npc = (id, x, y, o = {}) => ({ k: 'npc', id, at: [x, y], ...o });
const obj = (kind, x, y, say, o = {}) => ({ k: 'obj', kind, at: [x, y], say, ...o });
const pick = (kind, id, x, y, o = {}) => ({ k: 'pick', kind, id, at: [x, y], ...o });
const en = (t, x, y, n = 3, r = 5, o = {}) => ({ k: 'enemy', t, at: [x, y], n, r, ...o });
const chest = (id, x, y, o = {}) => ({ k: 'chest', id, at: [x, y], ...o });
const vend = (x, y) => ({ k: 'vend', at: [x, y] });
const trig = (id, ev, x, y, w, h, o = {}) => ({ k: 'trigger', id, ev, at: [x, y], w, h, ...o });
const deco = (kind, x, y, solid, o = {}) => ({ k: 'deco', kind, at: [x, y], solid, ...o });
const ex = (side, a, b, to, o = {}) => ({ side, a, b, to, ...o });
const bld = (x, y, w, h, style, to, o = {}) => ({ k: 'bld', x, y, w, h, style, to, ...o });
const p = (id, x, y, o = {}) => ({ k: 'p', id, x, y, ...o });
const ps = (id, list) => list.map(([x, y, o]) => p(id, x, y, o));   // many of the same prop
const T0 = (s) => ['|' + s];   // narration helper
PAL.house = { a: ['#9a7448', '#926c42', '#a07c50'], sp: '#7a5834', tall: '#9a7448', tuft: '#b08a5c', tuft2: '#7a5834', path: '#a8505a', path2: '#8a3c46', pe: '#5a2a32', lawn: '#9a7448', plaza: '#b89868', pl2: '#a88858', fl: [], pink: '#9a7448', pink2: '#7a5834', tm: '#6a4a2e', tl: '#8a6a44', td: '#4a321c', to: '#2a1a0e', tr: '#4a321c', wt: '#243a66', wt2: '#4a5a96', wo: '#101830', wall: '#c89a68', wtop: '#2a1a0e' };
PAL.hotel = { ...PAL.house, a: ['#e8e0d0', '#e2dac8', '#eee6d6'], plaza: '#f4f0e6', pl2: '#dcd4c4', path: '#3a9ac8', path2: '#2a7aa8', pe: '#1a5a88', wall: '#e8dcc4', wtop: '#3a2a20' };
PAL.cyberin = { ...PAL.house, a: ['#22223a', '#1e1e34', '#26263e'], plaza: '#2c2c48', pl2: '#242440', path: '#5a1a4a', path2: '#7a2a6a', pe: '#2a0a2a', wall: '#1c1c34', sp: '#14142a', wtop: '#08080e' };
PAL.space = { a: ['#0c0a22', '#0a081c', '#100e2a'], sp: '#1a1640', tall: '#0c0a22', tuft: '#3a3a8a', tuft2: '#1a1640', path: '#4a3a8a', path2: '#3a2a7a', pe: '#1a1040', lawn: '#14123a', plaza: '#2a2658', pl2: '#201c48', fl: ['#fff', '#8ff', '#f8c', '#ff8'], pink: '#14123a', pink2: '#0c0a22', tm: '#4a3a8a', tl: '#8a7ad0', td: '#2a2058', to: '#0c0820', tr: '#2a1a40', wt: '#1a1a5a', wt2: '#3a3a9a', wo: '#0a0a30', wall: '#2a2458', wtop: '#05040c' };
PAL.forest.fruit = '#ff8fb0'; PAL.forest.pines = .22; PAL.dark.pines = .25; PAL.forest.stone = '#cfc6b4'; PAL.beach.stone = '#e8dcc4'; PAL.dark.stone = '#5e5680'; PAL.dark.glow = '#9ff'; PAL.forest.dirt = '#b89070';
PROPS.roots = { flat: 1, d(G, x, y) { for (let i = 0; i < 4; i++) for (let k = 0; k < 14; k++) PF(G, x - 10 + i * 6 + Math.sin(k / 2 + i) * 2, y - 14 + k, 2, 1, '#2a1a0e') } };
// ---------------------------------------------------------------- 1. The Great Hollow Tree (the hangout, where the game starts)
A('w_tree', { nm: 'The Great Hollow Tree', pal: 'forest', w: 44, h: 32, mus: 'forest', fill: 'woods',
  feat: [{ k: 'blob', x: 22, y: 14, rx: 14, ry: 8, g: 4 }, { k: 'blob', x: 10, y: 21, rx: 6, ry: 5, g: 4, s: 2 }, { k: 'blob', x: 33, y: 22, rx: 5, ry: 3, s: 3 }, { k: 'pond', x: 8, y: 22, rx: 3, ry: 2 },
    { k: 'path', pts: [[22, 16], [22, 31]], w: 3 }, { k: 'path', pts: [[21, 19], [13, 19], [13, 22]], w: 2 }, { k: 'bridge', x: 10, y: 22, w: 3, h: 1, norail: 1 },
    { k: 'path', pts: [[35, 12], [39, 12], [39, 7]], w: 2, g: 0 }, { k: 'blob', x: 39, y: 6, rx: 2, ry: 2, rough: .2 },
    { k: 'gblob', x: 15, y: 9, rx: 3, ry: 2, g: 3 }, { k: 'gblob', x: 30, y: 18, rx: 3, ry: 2, g: 3 }, { k: 'gblob', x: 33, y: 22, rx: 4, ry: 2, g: 1 }, { k: 'gblob', x: 13, y: 15, rx: 3, ry: 2, g: 1, s: 2 }, { k: 'bigtree', x: 22, y: 8, s: 2.7 },
    p('picnic', 26, 13), p('stump', 25, 11), p('stump', 30, 14), p('log', 14, 12), p('shrooms', 18, 9), p('flowers', 33, 10), p('flowers', 12, 16), p('shrub', 9, 13), p('shrub', 35, 13), p('rock', 33, 18), p('reeds', 5, 20), p('reeds', 11, 24), p('fern', 31, 7), p('fern', 12, 10),
    p('tree', 9, 9, { sc: 1 }), p('tree', 36, 16, { sc: 1 }), p('kite', 30, 6), p('stones', 22, 24), p('leaves', 17, 20), p('shrooms', 38, 5), p('rock', 41, 7), p('gnome', 15, 9)],
  exits: [ex('down', 21, 23, 'w_play')],
  ents: [trig('intro', 'intro', 17, 11, 12, 6), npc('mo', 30, 18), obj('hollow', 22, 10, ['|The hollow of the great tree. There is room inside for four people, if they sit very close.', 'Hitori:neutral|We used to fit. All of us.'], { quiet: 0 }),
    obj('bench', 16, 17, ['Hitori:neutral|The bench by the pond. I think I fell asleep here once. Or maybe I just remember falling asleep.']), obj('clock', 34, 11, ['|A small clock is nailed to a post. It says 6:00.', 'Hitori:neutral|Six o\'clock. Fine. That sounds about right.']),
    obj('mailbox', 19, 13, ['|An empty mailbox. The little flag is up, though.']), obj('sign', 28, 16, ['|A hand-painted sign: "THE HANGOUT. MEMBERS ONLY."', '|Below it, four names. The paint on the fourth one is newer than the others.'], { solid: [0, 0, 1, 1] }),
    vend(26, 18), chest('c:w_tree', 39, 6, { snacks: 2 }), obj('picnic', 27, 13, ['|The picnic blanket. Four cups. One of them still has juice in it.'], { quiet: 1 , inv: 1 })] });
// ---------------------------------------------------------------- 2. Playground
A('w_play', { nm: 'The Playground', pal: 'forest', w: 48, h: 30, mus: 'forest', fill: 'woods',
  feat: [{ k: 'blob', x: 24, y: 14, rx: 18, ry: 9, g: 4 }, { k: 'blob', x: 39, y: 22, rx: 5, ry: 4, s: 4 }, { k: 'path', pts: [[24, 0], [24, 29]], w: 3 }, { k: 'path', pts: [[24, 20], [36, 20], [39, 22]], w: 2 },
    { k: 'fence', x: 7, y: 6, w: 16, h: 13, gaps: [[10, 13, null, 22]] }, { k: 'gblob', x: 31, y: 6, rx: 4, ry: 1, g: 3 }, { k: 'gblob', x: 9, y: 21, rx: 4, ry: 2, g: 3 }, { k: 'gblob', x: 38, y: 16, rx: 3, ry: 2, g: 1 }, { k: 'gblob', x: 15, y: 12, rx: 3, ry: 2, g: 3, s: 3 },
    p('hopscotch', 22, 8), p('chalk', 23, 24), p('toys', 14, 15), p('mgr', 15, 12), p('tree', 9, 17, { sc: .8 }), p('flowers', 37, 13), p('shrub', 38, 18), p('stump', 31, 5), p('lamppost', 21, 4), p('lamppost', 27, 22), p('ptable', 33, 15), p('ptable', 29, 9), p('bunting', 33, 11), p('balloon', 40, 6), p('shrub', 6, 21), p('shrub', 42, 12), p('flowers', 36, 6), p('flowers', 14, 21),
    p('stump', 44, 20), p('rock', 41, 24), p('log', 36, 24), p('tree', 41, 9, { sc: 1 }), p('fern', 9, 22), p('leaves', 30, 19), p('sunflower', 8, 4), p('sunflower', 11, 4)],
  exits: [ex('up', 23, 25, 'w_tree'), ex('down', 23, 25, 'w_cross')],
  ents: [npc('pip', 28, 13), npc('bella', 34, 10), deco('stand', 34, 8, [-1, -1, 3, 2]),
    obj('swing', 11, 9, ['|The swing creaks softly in no wind.', 'Hitori:neutral|Somebody was just on it.'], { solid: [-1, -1, 3, 1] }), obj('slide', 18, 9, ['|A tall yellow slide. The ladder is warm from the sun.'], { solid: [-1, -1, 3, 1] }), obj('seesaw', 18, 15, ['|The seesaw is stuck halfway. There is no one on the other end.', 'Hitori:neutral|...Hm.'], { solid: [-1, 0, 3, 1] }),
    obj('sandbox', 11, 15, ['|The sand is perfectly smooth. Not even a footprint.', 'Hitori:neutral|Strange. Kids were here a second ago.'], { solid: [-2, -1, 4, 2] }), obj('bench', 16, 21, ['Hitori:neutral|People talk about this place like they remember it. I don\'t. I just know where the swings are.']), obj('bench', 30, 21, ['Hitori:sad|I wonder who comes here when nobody is around.']),
    obj('chalk', 24, 24, ['|Chalk drawings on the path: four stick figures holding hands.', '|A fifth one stands a little way off. Somebody started to rub it out.'], { quiet: 1 , inv: 1 }), chest('c:w_play', 40, 22, { snacks: 1 })] });
// ---------------------------------------------------------------- 3. Crossroads
A('w_cross', { nm: 'The Crossroads', pal: 'forest', w: 50, h: 32, mus: 'forest', fill: 'woods',
  feat: [{ k: 'blob', x: 25, y: 16, rx: 11, ry: 7, g: 4 }, { k: 'path', pts: [[25, 0], [25, 31]], w: 3 }, { k: 'path', pts: [[0, 16], [49, 16]], w: 3 }, { k: 'open', x: 21, y: 13, w: 9, h: 7, g: 6 },
    { k: 'blob', x: 9, y: 10, rx: 5, ry: 4, s: 7 }, { k: 'river', pts: [[11, 2], [11, 9], [13, 13], [13, 22], [11, 26], [11, 29]], w: 3 }, { k: 'bridge', x: 10, y: 15, w: 6, h: 3 },
    { k: 'ledge', x: 34, y: 4, w: 11, h: 5, st: [38] }, { k: 'path', pts: [[39, 11], [39, 15]], w: 2 }, { k: 'path', pts: [[8, 15], [8, 12]], w: 2 }, { k: 'blob', x: 39, y: 22, rx: 6, ry: 4, s: 3 }, { k: 'gblob', x: 38, y: 22, rx: 4, ry: 2, g: 3 }, { k: 'gblob', x: 18, y: 22, rx: 3, ry: 2, g: 1 }, { k: 'gblob', x: 33, y: 10, rx: 3, ry: 2, g: 1 },
    p('lamppost', 21, 12), p('lamppost', 29, 12), p('lamppost', 21, 20), p('lamppost', 29, 20), p('flowers', 18, 11), p('flowers', 32, 21), p('shrub', 17, 19), p('shrub', 33, 12), p('stump', 36, 22), p('rock', 42, 24), p('reeds', 9, 21), p('reeds', 14, 8),
    p('tree', 39, 6, { sc: 1 }), p('stones', 30, 25), p('log', 6, 11), p('shrooms', 8, 8), p('fern', 31, 9), p('leaves', 19, 24)],
  exits: [ex('up', 24, 26, 'w_play'), ex('down', 24, 26, 'w_garden'), ex('left', 15, 17, 'w_meadow'), ex('right', 15, 17, 'w_grove')],
  ents: [obj('arrows', 25, 15, ['|A signpost with four arrows.', '|North: PLAYGROUND.  South: GARDEN.  West: MEADOW.  East: THE GROVE.'], { solid: [0, 0, 1, 1] }), obj('clock', 30, 18, ['|Another clock. It also says 6:00.', 'Hitori:neutral|...Everyone in this place has the same watch.'], { lore: 'clocks' }),
    obj('bench', 22, 19, ['Hitori:neutral|Every path starts and ends here. That used to feel comforting.']), obj('bench', 41, 7, ['Hitori:blush|You can see the whole crossroads from up here. Nobody ever looks up.']), obj('notice', 33, 15, ['|A notice board. "LOST: one water bottle. LOST: marbles (blue + red). FOUND: nothing."', '|Someone has pinned a drawing of the hollow tree. There are five dots under it, crossed out to four.'], { solid: [0, 0, 1, 1] }),
    chest('c:w_cross', 43, 6, { snacks: 2 }), obj('stones', 8, 10, ['|Skipping stones, piled up by the water. Somebody was keeping count.'], { quiet: 1 , inv: 1 })] });
// ---------------------------------------------------------------- 4. Garden + Uku's house
A('w_garden', { nm: 'The Overgrown Garden', pal: 'forest', w: 48, h: 32, mus: 'forest', fill: 'woods',
  feat: [{ k: 'blob', x: 24, y: 15, rx: 20, ry: 11, g: 4, rough: .5 }, { k: 'path', pts: [[23, 0], [23, 13], [13, 13], [13, 12]], w: 3 }, { k: 'path', pts: [[23, 13], [29, 13]], w: 2 },
    bld(7, 4, 12, 7, 'cottage', 'w_uhouse', { door: 6, roof: '#3a5a9a' }), { k: 'fence', x: 28, y: 7, w: 15, h: 16, gaps: [[12, 14, null, 28]] }, { k: 'ground', x: 30, y: 9, w: 5, h: 5, g: 10 }, { k: 'ground', x: 36, y: 9, w: 5, h: 5, g: 10 }, { k: 'ground', x: 30, y: 16, w: 5, h: 5, g: 10 }, { k: 'ground', x: 36, y: 17, w: 5, h: 4, g: 9 },
    { k: 'gblob', x: 9, y: 20, rx: 4, ry: 2, g: 3 }, { k: 'gblob', x: 22, y: 22, rx: 3, ry: 2, g: 1 }, { k: 'blob', x: 11, y: 24, rx: 5, ry: 3, s: 5 },
    p('clothesline', 8, 15), p('woodpile', 19, 8), p('birdbath', 17, 19), p('gnome', 6, 13), p('barrow', 26, 18), p('sunflower', 27, 8), p('sunflower', 27, 10), p('sunflower', 27, 20), p('shrub', 4, 20), p('shrub', 43, 25), p('flowers', 20, 22), p('flowers', 15, 25), p('hay', 41, 24),
    p('tree', 44, 9, { sc: 1 }), p('stump', 9, 25), p('rock', 21, 25), p('fern', 4, 9), p('leaves', 35, 24), p('crowpost', 35, 15)],
  exits: [ex('up', 22, 24, 'w_cross')],
  ents: [obj('scarecrow', 33, 14, ['|A scarecrow in a blue shirt. It has been dressed in someone\'s old clothes.', 'Hitori:neutral|...That\'s Uku\'s shirt. He said he lost it.'], { solid: [0, 0, 1, 1] }), obj('flowerbed', 15, 15, ['|Flowers of every colour. Somebody weeds this daily.']),
    pick('page', 'scrap', 32, 21, { set: 'tag1', item: 'scrap', say: ['|A muddy scrap of paper is stuck in the soil between the rows.', '|You can only read one part: "...OM 4".', 'Hitori:neutral|Huh. Somebody lost this.'] }),
    obj('nest', 7, 22, [], { ev: 'nest', solid: [0, 0, 1, 1] }), obj('bench', 21, 16, ['Hitori:neutral|A bench facing the house. Somebody liked watching the door.']), obj('mailbox', 15, 12, ['|Uku\'s mailbox. A letter inside, addressed to him in his own handwriting.', 'Hitori:neutral|...I\'m not opening his mail.']),
    obj('crops', 32, 11, ['|Rows of little sprouts. Every one of them exactly the same height.'], { quiet: 1 }), chest('c:w_garden', 10, 25, { snacks: 2 })] });
// ---------------------------------------------------------------- 5. Uku's house
A('w_uhouse', { nm: 'Uku\'s House', pal: 'house', interior: true, floor: 'wood', wall: 'plank', w: 24, h: 16, mus: 'forest',
  feat: [{ k: 'ground', x: 10, y: 7, w: 4, h: 7, g: 2 }, p('rug', 16, 10), p('window', 6, 2), p('window', 17, 2, { curtain: '#3a68c8' }), p('picture', 12, 2, { faces: 3 }), p('wclock', 21, 2), p('pot', 2, 3), p('pot', 21, 13), p('books', 8, 13), p('boxes', 3, 13), p('flamp', 20, 4), p('cbed', 3, 6)],
  exits: [ex('down', 11, 12, 'w_garden')],
  ents: [deco('desk', 9, 4, [-1, -1, 3, 1]), deco('shelf', 14, 3, [-1, 0, 2, 1]), deco('sofa', 17, 9, [-2, -1, 4, 2]), deco('tv', 17, 5, [-1, -1, 2, 1]), deco('fridge', 2, 10, [0, -1, 1, 1]), deco('table', 6, 9, [-1, -1, 3, 1]), deco('drawers', 21, 7, [-1, -1, 2, 1]),
    obj('desk', 9, 4, ['|A photo in a frame: friends on a couch. There is an empty space at one end, as if someone were meant to stand there.', 'Hitori:neutral|...Who is missing from this picture?'], { quiet: 1, lore: 'photo' }), obj('fridge', 2, 10, ['|A sticky note on the fridge: "Back by dusk. Don\'t wait up. -U"', 'Hitori:neutral|He always writes the same note.'], { set: 'uku_note' }),
    obj('shelf', 14, 3, ['|Rows of mix tapes, labelled in tiny handwriting. One slot is empty.'], { quiet: 1 }), obj('cbedi', 4, 6, ['|The bed is made. There is a dent in the pillow, but it is cold.'], { quiet: 1 }), obj('drawers', 21, 7, ['|A drawer full of identical white bands, rolled up neatly.', 'Hitori:neutral|...Why does he have so many of these?'], { lore: 'bands' }),
    obj('tv', 17, 5, ['|The TV is on with the sound off. A weather map, and the forecast for every day is the same little sun.'], { quiet: 1 })] });
// ---------------------------------------------------------------- 6. Sprout Meadow
A('w_meadow', { nm: 'Sprout Meadow', pal: 'forest', w: 52, h: 34, mus: 'forest', fill: 'woods',
  feat: [{ k: 'blob', x: 24, y: 19, rx: 20, ry: 11, g: 1, rough: .5 }, { k: 'ledge', x: 30, y: 4, w: 15, h: 6, st: [36] }, bld(33, 3, 8, 5, 'hut', 'w_cottage', { door: 4, roof: '#c8724a' }), { k: 'path', pts: [[51, 17], [37, 17], [37, 12]], w: 2 },
    { k: 'gblob', x: 13, y: 23, rx: 6, ry: 4, g: 3 }, { k: 'gblob', x: 27, y: 14, rx: 5, ry: 3, g: 0, s: 2 }, { k: 'gblob', x: 37, y: 7, rx: 6, ry: 2, g: 0, s: 3 }, { k: 'gblob', x: 34, y: 26, rx: 4, ry: 2, g: 3, s: 4 }, { k: 'clump', x: 19, y: 20, rx: 2, ry: 1 }, { k: 'clump', x: 35, y: 21, rx: 2, ry: 2 }, { k: 'blob', x: 10, y: 9, rx: 4, ry: 3, s: 6 }, { k: 'pond', x: 10, y: 9, rx: 2, ry: 1 },
    p('hay', 21, 12), p('hay', 24, 11), p('hay', 15, 15), p('stump', 28, 26), p('rock', 18, 27), p('boulder', 6, 16), p('shrub', 30, 20), p('shrub', 13, 13), p('flowers', 40, 8), p('flowers', 32, 9), p('sunflower', 43, 6), p('woodpile', 31, 5),
    p('scarecrow2', 27, 19), p('fencebit', 9, 18), p('fencebit', 17, 28), p('tree', 9, 27, { sc: 1 }), p('fern', 44, 14), p('leaves', 34, 24), p('reeds', 13, 10), p('stones', 46, 18), p('barrow', 42, 9)],
  exits: [ex('right', 16, 18, 'w_cross')],
  ents: [en('sprout', 14, 22, 5, 6), en('bloomling', 30, 25, 3, 5), en('sprout', 22, 17, 2, 4), pick('oil', 'bottle', 41, 22, { need: 'sb1', set: 'sb2', on: 'stump', say: ['|A water bottle, tucked behind a mossy stump. "STEVEN" is written on the cap in marker.'] }),
    obj('rock2', 18, 26, ['|A smooth round stone, perfectly warm.', 'Hitori:neutral|I pick up stones like this all the time. I just never know where they came from.'], { quiet: 1 }), obj('bench', 39, 14, ['Hitori:neutral|Everything here smells like green.']), obj('sign', 35, 13, ['|"MOCHI\'S. Knock. Then wait. Then knock again."'], { solid: [0, 0, 1, 1] }), chest('c:w_meadow', 8, 9, { item: 'scissors' })] });
A('w_cottage', { nm: 'Mochi\'s Cottage', pal: 'house', interior: true, floor: 'wood', wall: 'plank', w: 18, h: 13, mus: 'forest', feat: [{ k: 'ground', x: 8, y: 6, w: 2, h: 5, g: 2 }, p('rug', 9, 7), p('window', 4, 2), p('window', 14, 2, { curtain: '#e8c060' }), p('pot', 2, 3), p('books', 13, 10), p('fireplace', 8, 2)],
  exits: [ex('down', 8, 9, 'w_meadow')], ents: [npc('mochi', 9, 5), deco('bed', 3, 6, [-1, -1, 3, 2]), deco('table', 14, 7, [-1, -1, 3, 1]), deco('shelf', 15, 3, [-1, 0, 2, 1])] });
// ---------------------------------------------------------------- 7. Mushroom Grove
A('w_grove', { nm: 'Mushroom Grove', pal: 'forest', w: 52, h: 32, mus: 'forest', fill: 'woods', palx: { a: ['#9ad4b0', '#92cca8', '#a4dcb8'] },
  feat: [{ k: 'blob', x: 26, y: 17, rx: 19, ry: 9, g: 4, rough: .6 }, { k: 'path', pts: [[0, 16], [51, 16]], w: 3 }, { k: 'pond', x: 26, y: 22, rx: 7, ry: 3 }, { k: 'bridge', x: 23, y: 19, w: 2, h: 3, dir: 'v', norail: 1 },
    { k: 'ledge', x: 8, y: 4, w: 12, h: 5, st: [12] }, { k: 'blob', x: 41, y: 8, rx: 4, ry: 3, s: 9 }, { k: 'path', pts: [[41, 15], [41, 10]], w: 2, g: 0 },
    { k: 'gblob', x: 20, y: 11, rx: 4, ry: 2, g: 1 }, { k: 'gblob', x: 36, y: 22, rx: 4, ry: 2, g: 13 }, { k: 'clump', x: 26, y: 10, rx: 2, ry: 1 }, p('bigshroom', 12, 12), p('bigshroom', 34, 12), p('bigshroom', 22, 12), p('bigshroom', 31, 9), p('bigshroom', 9, 22), p('shrooms', 25, 13), p('shrooms', 36, 11), p('stump', 37, 9), p('bigshroom', 19, 24), p('bigshroom', 44, 20), p('shrooms', 15, 6), p('shrooms', 9, 5), p('shrooms', 18, 6), p('shrooms', 30, 13), p('shrooms', 7, 20), p('shrooms', 39, 24), p('log', 38, 18), p('stump', 9, 18), p('rock', 47, 12), p('reeds', 32, 23), p('reeds', 19, 21),
    p('fern', 28, 11), p('fern', 6, 13), p('tree', 47, 22, { sc: 1 }), p('stones', 15, 18), p('leaves', 44, 9)],
  exits: [ex('left', 15, 17, 'w_cross'), ex('right', 15, 17, 'w_well', { need: 'd1_ready', needmsg: 'd1_ready' })],
  ents: [npc('finn', 23, 18), obj('rock2', 30, 19, [], { ev: 'rinse', solid: [0, 0, 1, 1] }), pick('mushroom', 'm1', 9, 18, { need: 'mo1', set: 'm1', on: 'stump' }), pick('mushroom', 'm2', 41, 8, { need: 'mo1', set: 'm2', on: 'stump' }), pick('mushroom', 'm3', 15, 7, { need: 'mo1', set: 'm3', on: 'stump' }),
    en('sprout', 38, 21, 3, 4), en('bloomling', 14, 21, 2, 3), obj('bench', 29, 14, ['Hitori:neutral|Mushrooms that glow. A pond that doesn\'t ripple. Everything here is so... careful.']), obj('ring', 13, 6, ['|A perfect ring of mushrooms. You step inside it.', '|Nothing happens. You feel a little silly.', 'Hitori:blush|...Don\'t tell anyone.'], { quiet: 1 }), chest('c:w_grove', 44, 7, { money: 18 })] });
// ---------------------------------------------------------------- 8. The Old Well (always a little like dusk)
A('w_well', { nm: 'The Old Well', pal: 'forest', tint: 'rgba(255,120,60,.14)', w: 40, h: 28, mus: 'forest', fill: 'woods',
  feat: [{ k: 'blob', x: 20, y: 15, rx: 12, ry: 7, g: 4 }, { k: 'path', pts: [[0, 15], [12, 15]], w: 2 }, { k: 'open', x: 18, y: 3, w: 5, h: 7, g: 13 }, { k: 'ledge', x: 10, y: 6, w: 7, h: 3, noside: 1 }, { k: 'ledge', x: 24, y: 6, w: 7, h: 3, noside: 1 },
    { k: 'ground', x: 17, y: 12, w: 7, h: 6, g: 6 },
    ...ps('stones', [[15, 12], [25, 12], [15, 17], [25, 17]]), p('candles', 26, 15), p('shrub', 30, 17), p('shrub', 11, 12), { k: 'gblob', x: 13, y: 16, rx: 3, ry: 2, g: 1 }, { k: 'gblob', x: 27, y: 19, rx: 3, ry: 1, g: 1 }, p('lamppost', 16, 11, { off: 1 }), p('lamppost', 24, 11, { off: 1 }), p('deadtree', 31, 13, { sc: 1 }), p('deadtree', 9, 17, { sc: .9 }), p('stump', 12, 19), p('rock', 28, 20), p('leaves', 22, 21), p('shrooms', 13, 7), p('crowpost', 29, 9), p('fern', 11, 14)],
  exits: [ex('left', 14, 16, 'w_grove'), ex('up', 19, 21, 'w_tunnel', { need: 'uku_gone', needmsg: 'uku_gone' })],
  ents: [obj('well', 20, 14, ['|The old well. It is humming faintly.', 'Hitori:neutral|It always hums at dusk.'], { solid: [-1, -1, 3, 2] }), trig('wellvanish', 'wellvanish', 13, 10, 15, 9, { need: 'd1_ready' }), npc('uku', 21, 13, { if: 'd1_ready', ifnot: 'uku_gone', dir: 0 }), obj('bench', 15, 20, ['Hitori:sad|He said to meet at the well. He always picks the strange places.']),
    obj('biglog', 20, 5, ['|A huge hollow log lies across the path, black inside.'], { quiet: 1 })] });
// ---------------------------------------------------------------- 9. Hollow Log Tunnel (the darkness)
A('w_tunnel', { nm: 'Hollow Log Tunnel', pal: 'dark', interior: true, floor: 'wood', wall: 'plank', dark: true, w: 36, h: 14, mus: 'scary', palx: { wall: '#4a3020', wtop: '#120a06' },
  feat: [{ k: 'ground', x: 3, y: 5, w: 30, h: 6, g: 7 }, p('shrooms', 6, 6), p('shrooms', 28, 9), p('web', 31, 3), p('roots', 12, 3), p('roots', 24, 3), p('stones', 20, 10)],
  exits: [ex('down', 16, 18, 'w_well'), ex('up', 16, 18, 'g_gate', { lock: 'dark' })],
  ents: [obj('hole', 17, 6, [], { ev: 'tunnel', glow: 0 })] });
