// ==================== DAY 4: THE NEON DISTRICT (built from the recoloured tileset in assets/city) ====================
const CY = { pal: 'city', edge: 'tree', tree: 'neon', mass: 'block', base: 5, mus: 'scary', fill: 'woods', decor: .025, city: 1 };
const CASINO = { pal: 'casino', interior: true, floor: 'carpet', wall: 'curtain', base: 11, mus: 'scary', city: 1 };
// ---------------------------------------------------------------- arrival: the outfall tunnel
A('n_drain', { ...CY, nm: 'Outfall Tunnel', pal: 'cyberin', interior: true, floor: 'tile', wall: 'brick', dark: true, w: 40, h: 14, fill: null, edge: 'wall', base: 0,
  feat: [{ k: 'water', x: 2, y: 2, w: 36, h: 2 }, { k: 'ground', x: 2, y: 6, w: 36, h: 4, g: 2 }, p('pipe', 6, 4), p('pipe', 27, 4), p('bags', 13, 11), p('crates', 33, 10), p('c_sign', 19, 4, { v: '_p' }), p('steam2', 24, 11), p('c_trash', 30, 11)],
  exits: [ex('left', 6, 9, 'b_pier'), ex('right', 6, 9, 'n_street')],
  ents: [obj('trash', 28, 11, ['|A bin full of cassettes. All blank.']), en('glitch', 20, 8, 2, 3), obj('bench', 35, 6, ['Hitori:neutral|A tunnel full of neon. Somebody lived down here, once.'])] });
// ---------------------------------------------------------------- Neon Street
A('n_street', { ...CY, nm: 'Neon Street', w: 64, h: 30,
  feat: [{ k: 'open', x: 3, y: 10, w: 58, h: 11 }, { k: 'ground', x: 0, y: 13, w: 64, h: 5, g: 2 }, { k: 'open', x: 29, y: 21, w: 5, h: 9, g: 2 },
    bld(3, 2, 6, 8, 'cshop', 'n_bar', { door: 2, sign: 'BAR', v: '_p' }), bld(11, 2, 6, 8, 'cshop', 'n_ramen', { door: 2, sign: 'RAMEN' }), bld(19, 3, 8, 7, 'cstairs', null, { nodoor: 1, sign: '夢' }), bld(29, 2, 6, 8, 'cshop', 'n_capsule', { door: 2, sign: 'HOTEL', v: '_m' }),
    bld(37, 2, 6, 8, 'cshop', null, { door: 2, sign: 'PHARM', msg: 'pharmacy', closed: 1 }), bld(45, 3, 8, 7, 'cstairs', null, { nodoor: 1, v: '_m' }), bld(55, 2, 6, 8, 'cshop', null, { door: 2, sign: 'NOODLE', msg: 'bar', v: '_p', closed: 1 }),
    ...ps('c_lamp', [[9, 11], [27, 11], [44, 11], [53, 11]]), p('c_vend', 17, 10), p('c_vend', 18, 10, { v: '_p' }), p('c_atm', 35, 10), p('c_board', 28, 10), p('c_plant', 10, 10), p('c_trash', 43, 10), p('c_hydrant', 54, 10),
    ...ps('c_lamp2', [[8, 20], [24, 20], [40, 20], [51, 20]]), ...ps('c_fence', [[11, 20], [17, 20], [43, 20], [56, 20]]), ...ps('c_post', [[20, 18], [36, 18], [46, 18], [14, 18]]), p('c_hydrant', 15, 19), p('c_trash', 27, 19), p('c_plant', 35, 19),
    ...ps('manhole', [[11, 15], [37, 14], [54, 16]]), p('cone', 25, 16), p('cone', 26, 16), p('scooter', 21, 19), p('bike', 47, 19), p('ntext', 60, 19, { t: '24H', c: '#ff5a8a' }), p('c_cables', 30, 26), p('bags', 32, 27), p('c_ac', 29, 23)],
  exits: [ex('left', 13, 17, 'n_drain'), ex('right', 13, 17, 'n_plaza'), ex('down', 30, 32, 'n_market')],
  ents: [deco('steam', 23, 17, null), deco('steam', 49, 19, null), npc('wire', 12, 19), npc('doc', 48, 11), vend(41, 11), obj('fusebox', 59, 18, [], { ev: 'fuse', set: 'nf1', solid: [0, 0, 1, 1] }), obj('trash', 26, 19, ['|A bin. Inside: dozens of empty cups, all with your handwriting.'], { inv: 1 }),
    obj('bench', 33, 19, ['Hitori:neutral|The neon makes everybody\'s skin look like someone else\'s.']), en('glitch', 31, 25, 2, 2), chest('c:n_street', 60, 11, { snacks: 3 })] });
// ---------------------------------------------------------------- Vic's bar (looks like the reference bar: brick, pink counter, booths, cabinets)
A('n_bar', { nm: 'Vic\'s', pal: 'cyberin', interior: true, floor: 'checker', wall: 'brick', w: 34, h: 18, mus: 'inboredom', city: 1,
  feat: [p('bottleshelf', 4, 2), p('beersign', 21, 2), p('neonx', 28, 2), p('c_sign', 13, 2, { v: '_p' }), p('barcounter', 3, 7), ...ps('stool', [[4, 9], [6, 9], [8, 9]]), p('bot', 2, 5), ...ps('arcadecab', [[19, 6], [23, 6], [27, 6]]),
    p('booth', 19, 13), p('booth', 26, 13), p('c_plant', 31, 9), p('c_plant', 2, 15), p('c_trash', 13, 15), p('c_ac', 30, 4), p('pool', 8, 13), p('jukebox', 15, 4), p('c_vend', 31, 13, { v: '_p' }), p('rug', 23, 10)],
  exits: [ex('down', 16, 17, 'n_street')],
  ents: [npc('vic', 10, 8, { reach: 34 }), npc('fay', 24, 15), npc('rex', 14, 11), obj('arcadecab', 19, 7, ['|The cabinet plays a game about walking down a street forever. Your initials are already on the high score.'], { inv: 1 }), obj('arcadecab', 23, 7, ['|"PRESS START." You press start. It asks you to press start.'], { inv: 1 }), obj('arcadecab', 27, 7, ['|A racing game. All the cars are going home.'], { inv: 1 }),
    obj('beersign', 22, 3, ['|"DRINK JUICE." Somebody painted over the old word.'], { inv: 1, quiet: 1 }), obj('pool', 9, 14, ['|A pool table. Every ball is the eight ball.'], { inv: 1 }), obj('jukebox', 15, 5, ['|The jukebox has one song on it, listed fifty times.', 'Hitori:neutral|...It\'s a nice song, at least.'], { inv: 1 }), obj('booth', 21, 14, ['Hitori:neutral|Somebody carved four initials into the table. A fifth one is scratched out.'], { inv: 1 })] });
// ---------------------------------------------------------------- the others on the street
A('n_capsule', { ...CY, nm: 'Capsule Hotel', pal: 'cyberin', interior: true, floor: 'tile', wall: 'brick', w: 30, h: 14, fill: null, edge: 'wall', base: 0, mus: 'inboredom',
  feat: [{ k: 'ground', x: 14, y: 4, w: 2, h: 10, g: 2 }, ...ps('capsule', [[2, 4], [5, 4], [8, 4], [18, 4], [21, 4], [24, 4]]), p('c_vend', 12, 9), p('neonx', 16, 2), p('c_plant', 27, 10), p('rug', 6, 11)],
  exits: [ex('down', 14, 15, 'n_street')],
  ents: [obj('capsule', 9, 5, [], { ev: 'sleep', inv: 1 }), obj('desk', 21, 9, ['|The front desk is a screen. It says: "WELCOME BACK. YOUR USUAL ROOMS ARE READY."', 'Hitori:neutral|...Usual?'], { solid: [-1, -1, 3, 1] }), obj('capsule', 3, 5, ['|A capsule with a little reading light. The pillow has a dent in it.'], { inv: 1, quiet: 1 })] });
A('n_ramen', { ...CY, nm: 'Ren\'s Ramen', pal: 'cyberin', interior: true, floor: 'wood', wall: 'brick', w: 28, h: 14, fill: null, edge: 'wall', base: 0, feat: [{ k: 'ground', x: 13, y: 7, w: 2, h: 7, g: 2 }, p('lanterns', 13, 5), p('c_sign', 4, 2), p('c_sign', 22, 2, { v: '_p' }), p('c_plant', 2, 4), ...ps('stool', [[8, 8], [11, 8], [17, 8], [20, 8]])],
  exits: [ex('down', 13, 14, 'n_street')], ents: [npc('ren', 14, 3), deco('counter', 14, 5, [-5, -1, 11, 1]), obj('counter', 9, 5, ['|Steaming bowls. Each one is for a different person, and all of them are empty-chaired.'], { solid: [0, 0, 1, 1], fr: { steven: 'I could eat all of these.', caroline: 'It smells like home, somehow!' } }), obj('bench', 23, 10, ['Hitori:blush|I\'ve never been here. But I know what this tastes like.'], { fr: { steven: 'Okay. This is the best day we\'ve had.', caroline: 'We should come back! ...Do we always say that?' } })] });
// ---------------------------------------------------------------- the Night Market
A('n_market', { ...CY, nm: 'The Night Market', w: 64, h: 32,
  feat: [{ k: 'open', x: 3, y: 10, w: 58, h: 19 }, { k: 'path', pts: [[31, 0], [31, 31]], w: 3, g: 2 }, { k: 'path', pts: [[31, 18], [63, 18]], w: 3, g: 2 },
    bld(4, 2, 6, 8, 'cshop', 'n_arcade', { door: 2, sign: 'ARCADE', v: '_m' }), bld(12, 3, 8, 7, 'cstairs', null, { nodoor: 1, v: '' }), bld(40, 3, 8, 7, 'cstairs', null, { nodoor: 1, v: '_m' }), bld(52, 2, 6, 8, 'cshop', null, { door: 2, sign: 'CLOCKS', msg: 'clocks', v: '_p', closed: 1 }),
    // OMORI-style: stalls in two facing rows with a clear lane between, lantern strings on posts behind each row, a gate marking the way in,
    // seating tucked into the corners, lamps along the curbs; the middle of each space stays open to walk through
    p('lgate', 28, 11, { t: 'NIGHT MARKET' }), p('cart', 20, 14), ...ps('lanterns', [[5, 13], [11, 13], [17, 13]]),
    ...ps('cart', [[6, 24], [12, 24], [18, 24]]), ...ps('lanterns', [[4, 23], [10, 23], [16, 23]]),
    ...ps('cart', [[38, 23], [56, 23]]), ...ps('lanterns', [[35, 22], [41, 22], [47, 22], [53, 22]]),
    ...ps('lanterns', [[36, 12], [42, 12]]), ...ps('ftable', [[38, 14], [44, 14], [48, 14]]), ...ps('nplanter', [[35, 15], [52, 15], [59, 14]]),
    ...ps('ftable', [[6, 27], [15, 27], [20, 27]]), ...ps('crates', [[24, 12], [56, 26], [2, 26]]), ...ps('barrel', [[26, 26], [58, 13], [27, 26]]),
    ...ps('c_lamp2', [[28, 26], [35, 26]]), ...ps('c_lamp', [[33, 16], [53, 16]]), p('c_vend', 23, 10), p('c_atm2', 37, 10), p('c_plant', 59, 11), p('c_trash', 23, 27), p('c_trash', 34, 14), p('scooter', 40, 16),
    ...ps('manhole', [[31, 21], [45, 18]]), p('ntext', 60, 21, { t: 'BUNS', c: '#2ee6e6' })],
  exits: [ex('up', 30, 32, 'n_street'), ex('right', 17, 19, 'n_alley'), ex('down', 30, 32, 'n_station')],
  ents: [deco('steam', 10, 27, null), deco('steam', 47, 27, null), npc('mei', 17, 18), npc('tick', 54, 12), obj('fusebox', 58, 20, [], { ev: 'fuse', set: 'nf2', solid: [0, 0, 1, 1] }), obj('clock', 50, 11, ['|A tall clock in front of the clock shop. Six. Always six.'], { lore: 'clocks' }), en('glitch', 24, 27, 3, 3), en('static', 56, 28, 2, 2), chest('c:n_market', 60, 27, { money: 40 })] });
A('n_arcade', { ...CY, nm: 'Pixel Palace Arcade', pal: 'cyberin', interior: true, floor: 'checker', wall: 'brick', w: 36, h: 18, fill: null, edge: 'wall', base: 0, feat: [{ k: 'ground', x: 17, y: 4, w: 2, h: 14, g: 2 }, p('neonx', 4, 2), p('beersign', 10, 2), p('c_sign', 28, 2, { v: '_p' }), p('c_vend', 31, 4), p('booth', 26, 14), p('bags', 2, 15)],
  exits: [ex('down', 17, 18, 'n_market')],
  ents: [npc('kix', 18, 5), obj('arcade', 6, 7, ['|The screen flashes: you beat a level you never played.', 'Hitori:happy|Hah. Easy.'], { need: 'ar1', set: 'a1', nope: ['|A flashing machine. "INSERT COIN".'], solid: [-1, -1, 2, 1] }), obj('arcade', 10, 7, ['|Another game. Your score is already on the board.'], { need: 'ar1', set: 'a2', nope: ['|A flashing machine. "INSERT COIN".'], solid: [-1, -1, 2, 1] }), obj('arcade', 28, 9, ['|The last machine. The high score reads "STV".'], { need: 'ar1', set: 'a3', nope: ['|A flashing machine. "INSERT COIN".'], solid: [-1, -1, 2, 1] }),
    deco('arcade', 6, 12, [-1, -1, 2, 1]), deco('arcade', 10, 12, [-1, -1, 2, 1]), deco('slot', 24, 9, [-1, -1, 2, 1]), deco('arcade', 32, 9, [-1, -1, 2, 1]), obj('bench', 22, 15, ['Hitori:neutral|I know the sound of these. Why do I know the sound of these?'])] });
// ---------------------------------------------------------------- the station under the market
A('n_station', { ...CY, nm: 'Line 6 Station', w: 56, h: 26,
  feat: [{ k: 'open', x: 3, y: 9, w: 50, h: 8 }, { k: 'path', pts: [[27, 0], [27, 10]], w: 3, g: 5 }, { k: 'ground', x: 3, y: 17, w: 50, h: 4, g: 2 }, { k: 'solid', x: 0, y: 17, w: 56, h: 4 }, p('rails', 3, 18, { n: 50 }), p('rails', 3, 20, { n: 50 }), p('train', 6, 20),
    p('ptile', 3, 16, { n: 50 }), p('timetable', 9, 9), p('timetable', 40, 9), ...ps('c_lamp2', [[16, 15], [36, 15]]), p('c_atm2', 21, 9), p('c_atm', 22, 9), p('c_vend', 33, 9, { v: '_p' }), p('c_trash', 46, 10), p('c_plant', 4, 10), p('c_plant', 51, 10), p('ntext', 30, 10, { t: 'LINE 6', c: '#2ee6e6' }), p('c_board', 49, 10)],
  exits: [ex('up', 26, 28, 'n_market')],
  ents: [npc('sal', 18, 13), obj('bench', 12, 13, ['Hitori:neutral|A train that never leaves. Everybody just waits beside it, like that\'s the same thing.']), obj('bench', 42, 13, ['Hitori:sad|Woods. Shore. Home. All at six.']), obj('atm2', 21, 10, ['|A ticket machine. Every destination costs "one more day".'], { inv: 1 }), obj('train', 26, 16, ['|The train doors are open. Inside, the seats are all turned to face the windows. Nobody is sitting in them.'], { inv: 1 }), chest('c:n_station', 50, 14, { snacks: 3 })] });
// ---------------------------------------------------------------- Glitch Alley (stairs up to the rooftops)
A('n_alley', { ...CY, nm: 'Glitch Alley', w: 44, h: 32, base: 6,
  feat: [{ k: 'path', pts: [[0, 18], [12, 18], [12, 8], [30, 8], [30, 0]], w: 3, g: 6 }, { k: 'path', pts: [[12, 18], [12, 26], [36, 26], [36, 15], [22, 15]], w: 3, g: 6 }, { k: 'open', x: 20, y: 13, w: 6, h: 5, g: 6 }, { k: 'open', x: 37, y: 23, w: 5, h: 5, g: 6 },
    bld(15, 0, 8, 7, 'cstairs', 'n_roofs', { door: 7, v: '_m', sign: 'UP' }), p('c_ac', 14, 10), p('bags', 15, 11), p('bags', 27, 6), p('c_trash', 10, 20), p('crates', 34, 24), p('barrel', 39, 27), p('cone', 22, 14), p('c_vend', 25, 13), p('c_cables', 16, 27), p('scooter', 11, 23), p('c_hydrant', 26, 10), p('c_lamp', 33, 25)],
  exits: [ex('left', 17, 19, 'n_market'), ex('up', 29, 31, 'n_plaza')],
  ents: [en('glitch', 24, 26, 3, 3), en('static', 22, 15, 2, 2), obj('trash', 35, 16, ['|A bin humming faintly. Inside: a stack of tickets numbered 1 through 5. Number five is missing.']), chest('c:n_alley', 40, 25, { item: 'vest' })] });
// ---------------------------------------------------------------- the rooftops (city lights below)
A('n_roofs', { ...CY, nm: 'The Rooftops', dry: 1, w: 50, h: 28, edge: 'void', fill: 'void', mass: 'void', mus: 'inboredom', nodecor: 1, palx: { plaza: '#24124a', pl2: '#20103f', a: ['#24124a', '#24124a', '#24124a'] },
  feat: [{ k: 'open', x: 3, y: 4, w: 18, h: 20, g: 5 }, { k: 'open', x: 24, y: 8, w: 11, h: 13, g: 5 }, { k: 'open', x: 38, y: 4, w: 10, h: 21, g: 5 }, { k: 'bridge', x: 21, y: 13, w: 3, h: 2 }, { k: 'bridge', x: 35, y: 11, w: 3, h: 2 },
    p('c_mat', 6, 7), p('c_mat', 27, 11), p('c_ac', 14, 5), p('c_ac', 40, 6), p('c_units', 6, 19), p('watertank', 17, 8), p('watertank', 44, 21), p('dish', 31, 9), p('antenna', 46, 5), p('neonback', 27, 19, { t: 'DREAM' }), p('c_cables', 10, 13), p('c_vent', 15, 17), p('c_vent', 41, 17),
    p('easel', 42, 13), p('paint', 43, 14), ...ps('c_fence', [[3, 4], [9, 4], [24, 8], [38, 4], [44, 4]]), p('c_stairs', 10, 23), p('c_plant', 33, 18), p('c_trash', 4, 15)],
  exits: [ex('down', 7, 9, 'n_alley', { deep: 5 })],
  ents: [npc('hana', 44, 13), npc('dot', 30, 15), obj('bench', 26, 13, ['Hitori:neutral|From up here, all the lights look like they\'re waiting for something.']), chest('c:n_roofs', 45, 23, { snacks: 4 })] });
// ---------------------------------------------------------------- Neon Plaza with the casino
A('n_plaza', { ...CY, nm: 'Neon Plaza', w: 64, h: 38,
  feat: [{ k: 'open', x: 3, y: 13, w: 58, h: 22 }, { k: 'path', pts: [[0, 20], [63, 20]], w: 3, g: 2 }, { k: 'path', pts: [[30, 20], [30, 37]], w: 3, g: 2 }, { k: 'open', x: 15, y: 13, w: 34, h: 5, g: 6 }, bld(16, 2, 32, 11, 'casino', 'n_casino', { door: 16, sign: 'CASINO ABYSS' }),
    bld(4, 4, 8, 7, 'cstairs', null, { nodoor: 1, v: '' }), bld(53, 3, 6, 8, 'cshop', null, { door: 2, sign: 'CHIPS', msg: 'bar', v: '_p', closed: 1 }),
    ...ps('c_lamp2', [[14, 17], [50, 17], [12, 31], [50, 31]]), ...ps('gplant', [[20, 14], [44, 14]]), ...ps('c_post', [[22, 18], [26, 18], [37, 18], [41, 18]]), p('c_vend', 7, 14), p('c_vend', 8, 14, { v: '_p' }), p('c_atm', 56, 14), p('c_trash', 9, 24), p('c_plant', 55, 25),
    p('booth', 6, 27), p('bike', 6, 31), p('scooter', 56, 30), p('holo', 16, 25), p('holo', 46, 25), p('lgate', 27, 33, { t: 'BACK ALLEY' }), p('bags', 60, 33), p('cone', 24, 29), ...ps('c_fence', [[4, 34], [12, 34], [46, 34], [54, 34]])],
  exits: [ex('left', 19, 21, 'n_street'), ex('right', 19, 21, 'n_tower'), ex('down', 29, 31, 'n_alley')],
  ents: [deco('steam', 18, 30, null), deco('steam', 46, 30, null), vend(24, 14), npc('mina', 37, 16), obj('fusebox', 58, 22, [], { ev: 'fuse', set: 'nf3', solid: [0, 0, 1, 1] }), obj('statue', 40, 27, ['|A chrome statue of a child holding a ticket. The ticket number has been scratched out.'], { solid: [0, 0, 1, 1] }),
    obj('phone', 6, 28, ['|A payphone, ringing. You pick up. A calm voice: "Please take your medication. Dinner is at six."', 'Hitori:neutral|...Wrong number.'], { lore: 'phone', inv: 1 }), obj('bench', 24, 31, ['Hitori:neutral|It doesn\'t feel like a place anyone lives. It feels like a place someone describes.']), obj('bench', 38, 31, ['Hitori:sad|We\'ve walked so far today. Why does it still feel like we\'re standing still?']), en('static', 55, 33, 2, 2), chest('c:n_plaza', 60, 29, { snacks: 4 })] });
// ---------------------------------------------------------------- Casino Abyss (plum, gold and red velvet; rows of slot machines)
A('n_casino', { ...CASINO, nm: 'Casino Abyss: Lobby', w: 40, h: 22,
  feat: [{ k: 'ground', x: 18, y: 2, w: 4, h: 20, g: 2 }, ...ps('curtain', [[3, 2], [9, 2], [28, 2], [34, 2]]), p('prizeshelf', 3, 7), p('cashier', 30, 7), ...ps('gpillar', [[14, 5], [25, 5], [14, 15], [25, 15]]), ...ps('chandelier', [[9, 12], [29, 12], [19, 8]]),
    ...ps('gplant', [[2, 4], [37, 4], [2, 19], [37, 19]]), p('sofa2', 5, 17), p('sofa2', 31, 17), ...ps('vrope', [[16, 4], [22, 4]])],
  exits: [ex('down', 19, 20, 'n_plaza'), ex('up', 19, 20, 'n_floor')],
  ents: [npc('chips', 23, 10), npc('pearl', 5, 9, { reach: 30 }), npc('rex', 30, 13), obj('slotm', 10, 13, [], { ev: 'slots', solid: [0, 0, 1, 1] }), obj('slotm', 28, 15, [], { ev: 'slots', solid: [0, 0, 1, 1] }), obj('cashier', 32, 8, [], { ev: 'cashier', inv: 1 }), chest('c:n_casino', 36, 19, { snacks: 3 })] });
A('n_floor', { ...CASINO, nm: 'Casino Abyss: The Floor', w: 48, h: 26,
  feat: [{ k: 'ground', x: 22, y: 2, w: 4, h: 24, g: 2 }, ...ps('curtain', [[4, 2], [16, 2], [30, 2], [42, 2]]), p('cardtable', 22, 11), p('roulette', 23, 18), ...ps('chandelier', [[11, 12], [36, 12], [24, 8]]), ...ps('gpillar', [[19, 6], [28, 6], [19, 20], [28, 20]]), ...ps('gplant', [[2, 23], [45, 23]]), p('stage', 21, 3)],
  exits: [ex('down', 23, 24, 'n_casino'), ex('up', 23, 24, 'n_vault'), ex('left', 12, 13, 'n_lounge')],
  ents: [...[[4, 5], [6, 5], [8, 5], [10, 5], [12, 5], [35, 5], [37, 5], [39, 5], [41, 5], [43, 5], [6, 10], [8, 10], [10, 10], [12, 10], [35, 10], [37, 10], [39, 10], [41, 10], [6, 16], [8, 16], [10, 16], [12, 16], [35, 16], [37, 16], [39, 16], [41, 16]].map(([x, y]) => obj('slotm', x, y, [], { ev: 'slots', solid: [0, 0, 1, 1] })),
    npc('gus', 9, 13), npc('fay', 38, 13), en('glitch', 16, 21, 2, 2), en('static', 32, 21, 2, 2), obj('cardtable', 23, 12, ['|A card table. Five chairs, four hands dealt, one empty.'], { inv: 1 }), obj('roulette', 24, 19, ['|The wheel spins by itself. It always lands on six.'], { inv: 1 })] });
A('n_lounge', { ...CASINO, nm: 'Casino Abyss: The Lounge', w: 32, h: 18, mus: 'inboredom',
  feat: [...ps('curtain', [[3, 2], [9, 2], [20, 2], [26, 2]]), p('stage', 6, 7), p('piano', 7, 6), p('sofa2', 13, 12), p('sofa2', 21, 12), p('sofa2', 17, 15), ...ps('gplant', [[2, 4], [29, 4], [2, 15], [29, 15]]), ...ps('chandelier', [[11, 10], [22, 10]]), p('cardtable', 24, 6), p('rug', 17, 11)],
  exits: [ex('right', 8, 9, 'n_floor')],
  ents: [obj('sofa2', 14, 13, [], { ev: 'gchip', inv: 1 }), obj('piano', 8, 7, ['|You press a key. The piano plays the next three notes by itself.', 'Hitori:neutral|...Okay. I\'m not touching that again.'], { inv: 1 }), obj('cardtable', 25, 7, ['|A game of solitaire, abandoned halfway. It was going to work out.'], { inv: 1 })] });
A('n_vault', { ...CASINO, nm: 'Casino Abyss: The House', w: 30, h: 20, feat: [{ k: 'ground', x: 14, y: 2, w: 2, h: 18, g: 2 }, ...ps('curtain', [[4, 2], [10, 2], [18, 2], [24, 2]]), ...ps('gpillar', [[8, 6], [21, 6], [8, 13], [21, 13]]), p('chandelier', 15, 10)],
  exits: [ex('down', 14, 15, 'n_floor')], ents: [trig('house', 'house', 9, 7, 12, 6, { once: true, day: 4 }), obj('note', 15, 14, ['|The House is dark. A card on the floor: "OPEN TOMORROW. WE ALWAYS ARE."'], { inv: 1, quiet: 1, maxday: 3 }), deco('slot', 15, 5, [-2, -2, 5, 2])] });
// ---------------------------------------------------------------- the antenna tower
A('n_tower', { ...CY, nm: 'The Antenna Tower', w: 48, h: 32,
  feat: [{ k: 'open', x: 3, y: 10, w: 40, h: 19 }, { k: 'path', pts: [[0, 20], [24, 20], [24, 14]], w: 3, g: 2 }, { k: 'solid', x: 22, y: 8, w: 5, h: 5 }, { k: 'fence', x: 18, y: 7, w: 13, h: 9, gaps: [[23, 25, 15]] },
    p('pipe', 6, 12), p('crates', 36, 12), p('barrel', 38, 25), p('cone', 30, 20), p('cone', 32, 22), p('bags', 7, 26), p('c_ac', 40, 15), p('c_lamp2', 14, 18), p('c_lamp2', 34, 18), p('c_vend', 14, 11), p('c_cables', 9, 24), p('c_trash', 41, 24), p('c_board', 35, 11)],
  exits: [ex('left', 19, 21, 'n_plaza')],
  ents: [obj('tower', 24, 12, [], { inv: 0, quiet: 1 }), obj('ladder', 24, 13, ['|A ladder bolted to the tower. It climbs past the clouds and keeps going.'], { ev: 'ladder', solid: [0, 0, 1, 1], h: 60 }), obj('bench', 14, 24, ['Hitori:neutral|Everything hums at the same pitch up here. Like a held breath.']), en('static', 36, 26, 2, 3), obj('trash', 38, 14, ['|A bin full of tickets. All numbered 5.'])] });
