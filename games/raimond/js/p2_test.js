// Part Two playtest launcher: pick where to start. Open part_two_test.html (or add #day2 etc. to the address).
XSC.p2pick = function () {
  sU(); r(0, 0, W, H, '#050408');
  txt('PART TWO  -  PLAYTEST', W / 2, 24, '#fff', 'center', 10);
  const L = [['1', 'Day 1  -  wake up in the house', 'day1'], ['2', 'The dream  -  blackjack', 'dealer'], ['3', 'Day 2  -  the dark house', 'day2'], ['4', 'The sister  -  ending', 'sister']];
  L.forEach((l, i) => { txt(l[0] + '   ' + l[1], 60, 62 + i * 20, '#d8d0e8', 'left', 8); if (hit['Digit' + l[0]] || hit['Numpad' + l[0]]) { ST.set('syn_p2_warned', 1); p2Begin(l[2]) } });
  txt('Press 1-4.  Move: WASD   Look: mouse (click) or arrows   Use: Z / click   Back: X', W / 2, 160, '#8a8a98', 'center', 6);
};
(function () { const h = location.hash.replace('#', ''); title = function () { sc = 'p2pick' }; sc = 'p2pick'; if (['day1', 'dealer', 'day2', 'sister'].includes(h)) { addEventListener('keydown', function f() { removeEventListener('keydown', f); p2Begin(h) }) } })();
