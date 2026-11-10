// ==================== NPC DIALOGUE, FRIEND REQUESTS, QUEST EVENTS ====================
const once = k => { if (S.fl[k]) return false; S.fl[k] = 1; return true };
const reward = (xp, item, cash) => { S.xp += xp; if (item) giveItem(item); if (cash) addMoney(cash); beep(880, .2); checkLevel() };
function checkLevel() { while (S.xp >= S.lv * 20) { S.xp -= S.lv * 20; S.lv++; S.party.forEach(i => S.hp[i] = maxHp(i)); say('LEVEL UP! Lv' + S.lv) } }
const N = (id, lines, cb) => [lines, cb];
Object.assign(NPC_DLG, {
  mo: () => !F_('mo1') ? N('mo', ['Mayor Mo:happy|Ahoy, youngsters! Glad you could make it. Lovely day, isn\'t it?', 'Mayor Mo:neutral|My glow mushrooms have gone wandering again. Three of them, on the old stumps in the Mushroom Grove. Would you fetch them?', 'Hitori:neutral|...Sure. Why not.', 'Mayor Mo:worried|Oh, and if you pass the old well at dusk, don\'t stay too long. It hums.'], () => flag('mo1'))
    : F_('mush3') && !F_('mo_done') ? N('mo', ['Mayor Mo:happy|Three! Splendid!', 'Mayor Mo:neutral|Funny. I don\'t remember planting them. I\'ve never planted anything in my life.'], () => { flag('mo_done'); reward(20, 'locket', 20) })
    : N('mo', F_('mo_done') ? ['Mayor Mo:neutral|Dusk is when the well hums. Don\'t be late.'] : ['Mayor Mo:neutral|Three glow mushrooms, on old stumps in the Mushroom Grove. The east path from the crossroads.']),
  pip: () => !F_('mag1') ? N('pip', ['Pip:shock|My MARBLES are GONE! They were in my pocket and then... poof!', 'Pip:sad|Somebody took them. I know it.', 'Hitori:neutral|...Okay. Who would take marbles?', 'Pip:worried|Ask around? Bella sees everything from her cart!'], () => flag('mag1'))
    : F_('nest_traded') && !F_('mag_done') ? N('pip', ['Hitori:neutral|These yours?', 'Pip:happy|MY MARBLES! You found them! Where?!', 'Hitori:smug|Let\'s say I negotiated.', 'Pip:happy|You\'re the coolest. Here, take my bat. I can\'t swing it anyway.'], () => { flag('mag_done'); reward(15, 'bat', 10) })
    : N('pip', F_('mag_done') ? ['Pip:happy|You\'re the best! Wanna play?'] : ['Pip:worried|Any luck with the marbles? Maybe Bella saw something...']),
  bella: () => { const first = once('bella_gift'); if (first) bagAdd('cookie', 2);
    return F_('mag1') && !F_('mag2') ? N('bella', [...(first ? ['Baker Bella:happy|Fresh from the oven! Take these.'] : []), 'Hitori:neutral|Did you see anything unusual? A kid lost his marbles.', 'Baker Bella:neutral|A crow! Black as soot, with something shiny in its beak. It flew toward the garden, past Uku\'s house.'], () => flag('mag2'))
      : N('bella', first ? ['Baker Bella:happy|Fresh from the oven! Growing adventurers need cookies.', 'Baker Bella:laugh|Two on the house! After that, it\'s honest prices.'] : ['Baker Bella:smug|Steven has eaten six of my muffins already. Six!', 'Baker Bella:happy|Want anything? Everything\'s fresh. Ish.'], () => shop('bakery')) },
  finn: () => F_('tag1') && !F_('tag4') ? N('finn', ['Fisher Finn:neutral|That paper? Paper like that is cut from a long strip. The other half is never far away.', 'Fisher Finn:neutral|Mud comes off in clear water. My pond is the clearest there is. Then dry it by a fire.', 'Fisher Finn:neutral|And the other half? Try where people lose things. Resorts have a desk for that.'], () => flag('finn_hint'))
    : N('finn', ['Fisher Finn:sad|Haven\'t caught a thing in years. This pond only holds old boots.', 'Fisher Finn:neutral|Still. It is peaceful here. Nobody asks questions.']),
  mochi: () => N('mochi', ['Mochi:neutral|Mrrp. Time is a sunbeam.', 'Mochi:happy|Chase it, you will never catch it. Sit in it, and it is yours.', 'Mochi:smug|Also: the dark is only the day, napping.'], () => { if (once('gift_mochi')) { bagAdd('candy', 1); say('Mochi left a Candy on the floor.') } }),
  morrow: () => !F_('ml1') ? N('morrow', ['Hermit Morrow:neutral|Dark is the only teacher this wood has. Keep your light close.', 'Hermit Morrow:worried|My lamps keep going out. Three posts around the wood. Would you relight them? There is a match on the post by the marsh.'], () => flag('ml1'))
    : F_('lamps3') && !F_('ml_done') ? N('morrow', ['Hermit Morrow:happy|All three! The wood looks kinder already.', 'Hermit Morrow:neutral|Here. A lantern. It keeps the dark at arm\'s length.'], () => { flag('ml_done'); reward(25, 'lantern', 15) })
    : N('morrow', ['Hermit Morrow:neutral|Three lamp posts. Strike the match, light the wick, move on.']),
  vesper: () => N('vesper', ['Lady Vesper:sad|I wait for someone who never arrives. His name has slipped away from me.', 'Lady Vesper:worried|Does it slip from you too?', 'Hitori:neutral|...Yes.'], null),
  rattles: () => N('rattles', ['Ser Rattles:laugh|Ha! I have no guts and I\'m STILL fighting!', 'Ser Rattles:neutral|The throne awaits. Mind the shadows.']),
  lou: () => N('lou', ['Lifeguard Lou:angry|NO RUNNING by the water!!', 'Lifeguard Lou:neutral|...Okay, running\'s fine if it\'s crabs. The pier is at the east end of the beach. Don\'t look down.']),
  coco: () => !F_('cc1') ? N('coco', ['Coco:happy|Ice cream! Free for friends today!', 'Coco:sad|...Except half my cones blew away. Three of them, somewhere on the boardwalk and the beach.', 'Hitori:neutral|I\'ll look.'], () => flag('cc1'))
    : F_('cones3') && !F_('cc_done') ? N('coco', ['Coco:happy|THREE! A little squished, but perfect!', 'Coco:laugh|Take this lucky coin. I won it from a seagull.'], () => { flag('cc_done'); reward(30, 'coin', 15) })
    : N('coco', ['Coco:neutral|Three cones. Boardwalk benches, the sand, anywhere they could land.']),
  dex: () => !F_('dx1') ? N('dex', ['Dex:smug|Dude, the waves here are totally... static. Weird, right?', 'Dex:sad|Also I lost two blocks of surf wax. One by the sunbeds, one at the lifeguard chair maybe?'], () => flag('dx1'))
    : F_('wax2') && !F_('dx_done') ? N('dex', ['Dex:happy|Rad! Totally rad! Take these.', 'Dex:smug|They block out the whispering. Don\'t ask.'], () => { flag('dx_done'); reward(30, 'headphones', 15) })
    : N('dex', ['Dex:neutral|Two blocks. Sunbeds, lifeguard chair. You\'ll know them by the smell.']),
  chips: () => N('chips', ['Mr. Chips:smug|A customer! Care for a wager? Your soul is legal tender.', 'Mr. Chips:neutral|The House is on the floor below. The House does not lose.']),
  ren: () => N('ren', ['Ren:happy|Welcome! Ramen? ...Ramen. Sit anywhere.', 'Ren:neutral|Everyone who eats here says it tastes like somewhere they\'ve been.']),
  kix: () => N('kix', ['Kix:smug|You think you can beat the top score? Nobody has. It says "STV" up there.', 'Kix:neutral|...Wait. That\'s not even my name.']),
  doc: () => N('doc', ['Street Doc:neutral|Headaches? Sleep trouble? Forgetting small things?', 'Street Doc:worried|Take two of these and call me in the morning. If there is a morning.']),
  tick: () => N('tick', ['Tick:neutral|Clocks. Hundreds of clocks. Every one of them stopped at six.', 'Tick:worried|I wind them every night. They never move.']),
  wire: () => N('wire', ['Wire:neutral|You ever notice the signal drops right before something goes missing?', 'Wire:worried|The whole city flickers when the tower hums.']),
  mei: () => N('mei', ['Mei:happy|Fresh noodles! Lantern buns! Slightly cursed charms!', 'Mei:neutral|The tower in the middle? Nobody climbs it. Nobody ever comes back down.']),
  nova: () => N('nova', ['Nurse Nova:neutral|Welcome. Please keep your voice down. Some of the guests are sleeping.', 'Nurse Nova:worried|...Dinner is at six. As always.']),
  biscuit: () => N('biscuit', ['Old Biscuit:happy|Woof. Wise dog here. Sit. ...No, I mean YOU sit.', 'Old Biscuit:neutral|Rule one: nobody is ever really lost. They are only waiting for someone to come looking.', 'Old Biscuit:sad|Rule two: if the nurse says it is dinner time, eat dinner. Even in dreams.', 'Old Biscuit:blush|Rule three: belly rubs are non-negotiable.'], () => { if (once('gift_biscuit')) { S.snacks++; say('Old Biscuit left a snack. (+1)') } }),
  hoot: () => N('hoot', ['Professor Hoot:neutral|Hoo. A riddle: what has a face but never smiles?', 'Professor Hoot:smug|A clock. Or a polaroid. Or a patient chart. Take your pick.'], () => { if (once('gift_hoot')) { bagAdd('tea', 1); say('Professor Hoot dropped an Herbal Tea.') } }),
  shell: () => N('shell', ['Old Shell:neutral|Slow is not the opposite of far.', 'Old Shell:happy|The tide always returns. So do you.'], () => { if (once('gift_shell')) { bagAdd('sandwich', 1); say('Old Shell shared a Sandwich.') } }),
  uku: () => N('uku', ['Uku:neutral|...You came.'])
});
// ---- friend requests (start/finish a quest by talking to the friend)
const FQ = {
  steven: () => {
    if (S.day == 1 && !F_('sb1')) return [['Steven:sad|Ugh. I lost my water bottle somewhere in the Sprout Meadow when I stormed off. Can you grab it?', 'Hitori:neutral|...You stormed off?', 'Steven:neutral|Don\'t.'], () => flag('sb1')];
    if (S.day == 1 && F_('sb2') && !F_('sb_done')) return [['Hitori:neutral|Found your bottle.', 'Steven:happy|Oh, thank GOD. I was dying of thirst.', 'Steven:neutral|...You\'re all right, you know that?'], () => { flag('sb_done'); reward(15, 'pan', 8) }];
    if (S.day == 4 && !F_('ar1')) return [['Steven:happy|Hitori! There\'s an arcade in the Night Market. I want to beat the high score. Try all three machines for me? I\'ll sit this one out.', 'Hitori:neutral|...You want me to play for you.', 'Steven:smug|Your hands are faster.'], () => flag('ar1')];
    if (F_('ar3') && !F_('ar_done')) return [['Steven:shock|All three?! Did you see the top score?', 'Hitori:neutral|It said STV.', 'Steven:neutral|...That\'s my name. I never played this.', 'Steven:worried|Huh.'], () => { flag('ar_done'); reward(35, 'wrench', 20) }];
    return null;
  },
  caroline: () => {
    if (F_('mag3') && !F_('mag4')) return [['Hitori:neutral|The crow wants something shiny. Do you have anything?', 'Caroline:neutral|...Hm. Here. My hair clip. It\'s my favourite, so please bring it back if you can!'], () => { giveItem('clip'); flag('mag4') }];
    if (S.day == 2 && !F_('cs1')) return [['Caroline:worried|I can\'t find my sketchbook. I had it on the way into Gloomwood. Maybe near the marsh?'], () => flag('cs1')];
    if (F_('cs2') && !F_('cs_done')) return [['Caroline:happy|My sketchbook! ...Oh.', 'Caroline:worried|I drew a lot of people in here. Four of us. And one more, off to the side, with no face.', 'Caroline:neutral|I don\'t remember drawing him.'], () => { flag('cs_done'); reward(25, 'hoodie', 10) }];
    return null;
  },
  uku: () => null
};
// ---- quest events attached to objects
Object.assign(EV, {
  nest() {
    if (!F_('mag1')) return D(['|A crow sits in the tree, watching you with one black eye.']);
    if (!F_('mag3')) return D(['|There is a nest in the fork of the tree. Full of shiny things: buttons, foil, and Pip\'s marbles.', 'Hitori:neutral|...The crow won\'t hand them over for free.'], () => flag('mag3'));
    if (!F_('mag4')) return D(['|The crow stares at you. It wants something shiny in trade.']);
    if (!F_('nest_traded')) return D(['|You set Caroline\'s hair clip on a low branch. The crow hops down, inspects it, and trades it for the marbles.', 'Hitori:happy|Hehe. Pleasure doing business.'], () => { S.items = S.items.filter(i => i != 'clip'); flag('nest_traded') });
    D(['|The crow admires its new hair clip.']);
  },
  rinse() {
    if (F_('tag1') && !F_('tag2')) return D(['|You dip the paper in the pond. Brown water swirls away.', 'Hitori:neutral|The mud\'s off. The ink runs a little, but some of it is still there. It\'s too wet to read.'], () => flag('tag2'));
    D(['|The pond is perfectly still. Your reflection is a moment late to smile.']);
  },
  dry() {
    if (F_('tag2') && !F_('tag3')) return D(['|You hold the paper over the fire. The ink settles into clean, dark letters.', 'Hitori:neutral|It\'s a strip torn in half. It says "...OM 4" and nothing else. The other half must be around somewhere.'], () => flag('tag3'));
    D(['|The campfire crackles. It is warm.']);
  },
  lostfound() {
    if (F_('tag3') && !F_('tag4')) return D(['|A basket of sunglasses, one flip-flop, a paper strip with a torn edge.', 'Hitori:neutral|...It matches.', '|You press the two halves together. A name in blue ink: HITORI. And under it: ROOM 4.', 'Hitori:neutral|Huh. That\'s my handwriting. I must have signed it for something.', 'Hitori:blush|...It doesn\'t matter. I\'ll keep it.'], () => { flag('tag4'); giveItem('wristband'); giveItem('boots'); addLore('tag') });
    D(['|A lost-and-found basket. Sunglasses, a single flip-flop, a snow globe with nothing inside.']);
  },
  lamp() { /* handled by obj say/set */ }
});
