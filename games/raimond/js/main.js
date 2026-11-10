// ==================== MAIN LOOP ====================
function loop() {
  tick++; sU(); X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  try {
    let want = 'menu';
    if (sc == 'world') { worldUpdate(); if (sc == 'world') drawWorld(); if (shake > 0) shake--; if (S) want = trackFor() }
    else if (sc == 'battle') { battleUpdate(); if (sc == 'battle') drawBattle(); want = trackFor() }
    else if (sc == 'mini') { miniUpdate(); if (sc == 'mini') miniDraw(); want = 'scary' }
    else if (sc == 'daycard') { dayUpdate(); if (sc == 'daycard') dayDraw(); want = 'menu' }
    else if (sc == 'xmenu') { xmenuUpdateDraw(); want = trackFor() }
    else if (sc == 'pol') { polaroid(); want = trackFor() }
    else if (sc == 'shop') { shopUD(); want = trackFor() }
    else if (sc == 'slots') { slotsUpdate(); if (sc == 'slots') slotsDraw(); want = trackFor() }
    else if (typeof XSC != 'undefined' && XSC[sc]) { XSC[sc](); want = trackFor() }
    else if (sc == 'end') { endDraw(); want = 'none' }
    else if (sc == 'quit' || sc == 'quit2') { r(0, 0, W, H, '#000'); txt(sc == 'quit' ? 'Thanks for playing. You can close this tab.' : 'S Y N C H R O N I C I T Y', W / 2, 80, '#fff', 'center', 8); if (ok()) title() }
    if (sc == 'menu') { menuUpdateDraw(); want = MN && MN.over && S ? trackFor() : 'menu' }
    music(want); if (typeof drawNowPlaying == 'function') drawNowPlaying();
    sU(); if (fade > 0) { r(0, 0, W, H, 'rgba(0,0,0,' + fade + ')'); fade -= .03 }
  } catch (e) { console.error(e); if (sc == 'battle') { try { endBattle() } catch (e2) { sc = 'world'; B = null } } }   // never let a battle error freeze the game
  for (const k in hit) delete hit[k];
}
let last = 0, acc = 0;
(function f(t) { acc += Math.min(100, t - last); last = t; while (acc >= 16.67) { loop(); acc -= 16.67 } requestAnimationFrame(f) })(0);
if (document.fonts) { document.fonts.load('16px "Synchronicity Hand"'); document.fonts.ready.then(() => { for (const k in MP) delete MP[k] }) }
title();
