from PIL import Image
from collections import Counter
import os, sys
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'beach') + '/'   # usage: python3 tools/pier_build.py <dock tileset .gif or .png>
src = Image.open(sys.argv[1]).convert('RGBA')   # first frame of the gif
px = src.load(); W, H = src.size
for x in range(W):
    for y in range(H):
        if px[x, y][:3] in ((97, 102, 111), (84, 86, 96)): px[x, y] = (0, 0, 0, 0)
# 1. half size: each 2x2 block becomes its most common colour, so the palette and outlines survive
def half(im):
    w, h = im.size; out = Image.new('RGBA', (w // 2, h // 2)); p = im.load(); o = out.load()
    for x in range(w // 2):
        for y in range(h // 2):
            cs = [p[2 * x, 2 * y], p[2 * x + 1, 2 * y], p[2 * x, 2 * y + 1], p[2 * x + 1, 2 * y + 1]]
            # keep dark outline pixels when they're there (they're what holds the shapes together)
            dark = [c for c in cs if c[3] and sum(c[:3]) < 230]
            o[x, y] = dark[0] if len(dark) >= 2 else Counter(cs).most_common(1)[0][0]
    return out
sm = half(src)
# 2. the tileset's teal sea -> the game's beach blues (the open water itself becomes transparent: the map's own sea shows through)
SEA = (90, 182, 226)
TEAL = [((60, 163, 178), None), ((63, 171, 183), None), ((58, 160, 178), None), ((58, 157, 177), None), ((54, 154, 176), (82, 172, 220)),
        ((54, 144, 174), (74, 160, 212)), ((41, 135, 166), (64, 148, 202)), ((42, 112, 155), (54, 126, 186)), ((34, 100, 141), (46, 110, 170)), ((33, 92, 129), (40, 98, 156))]
p = sm.load()
for x in range(sm.size[0]):
    for y in range(sm.size[1]):
        c = p[x, y]
        if not c[3]: continue
        r, g, b = c[:3]
        if b > r + 40 and g > r + 25:
            best = min(TEAL, key=lambda t: sum((t[0][i] - c[i]) ** 2 for i in range(3)))
            p[x, y] = (0, 0, 0, 0) if best[1] is None else best[1] + (255,)
sm.save(D + 'pier_tiles_small.png')
def crop(x, y, w, h): return sm.crop((x // 2, y // 2, x // 2 + w // 2, y // 2 + h // 2))
deck = crop(340, 136, 32, 80); deckL = crop(308, 128, 32, 88); deckR = crop(468, 128, 32, 88)
branch = crop(116, 30, 64, 98); postT = crop(412, 128, 18, 58); postS = crop(378, 136, 18, 50)
crates = crop(186, 156, 30, 36); crateL = crop(214, 160, 32, 32); crateO = crop(246, 160, 28, 32); crateS = crop(258, 228, 26, 26)
wreck = crop(116, 150, 68, 72); deep = crop(33, 130, 64, 128)
# 3. compose the pier at game scale: 56 x 22 tiles
L = Image.new('RGBA', (56 * 16, 22 * 16), (0, 0, 0, 0))
def put(im, x, y, flip=False):
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    L.alpha_composite(im, (int(x), int(y)))
def tall(piece, top):   # stretch a deck column to 64px of boards by repeating its middle, keep its top and bottom edge
    w = piece.size[0]; deckH = 32 + top
    head = piece.crop((0, 0, w, top + 16)); mid = piece.crop((0, top + 4, w, top + 20)); tail = piece.crop((0, top + 16, w, piece.size[1]))
    out = Image.new('RGBA', (w, top + 64 + piece.size[1] - deckH), (0, 0, 0, 0))
    out.alpha_composite(head, (0, 0)); out.alpha_composite(mid, (0, top + 16)); out.alpha_composite(mid, (0, top + 32)); out.alpha_composite(tail, (0, top + 48))
    return out
dA = tall(deck, 0)
def capped(piece):   # a plain stretch of boards with just the mooring post's head poking up at the top edge
    out = Image.new('RGBA', (dA.size[0], dA.size[1] + 4), (0, 0, 0, 0)); out.alpha_composite(dA, (0, 4)); head = piece.crop((0, 0, piece.size[0], 9))
    m = head.copy(); hp = m.load()
    for x in range(m.size[0]):
        for y in range(m.size[1]):
            if y >= 4 and x > 9: hp[x, y] = (0, 0, 0, 0)   # drop the rope; keep the round post top
    out.alpha_composite(m, (0, 0)); return out
dL, dR = capped(deckL), capped(deckR.transpose(Image.FLIP_LEFT_RIGHT)).transpose(Image.FLIP_LEFT_RIGHT)
put(deep, 49 * 16 + 4, 13 * 16 + 14); put(deep, 50 * 16 + 4, 15 * 16 + 4, True)
put(wreck, 5 * 16, 16 * 16); put(wreck, 42 * 16, 2 * 16)
for tx, k in [(3, postT), (9, postS), (14, postT), (21, postS), (27, postT), (33, postS), (39, postT), (46, postS), (51, postT)]: put(k, tx * 16 + 3, 144 - k.size[1] + 8)
for tx, k in [(6, postS), (18, postT), (25, postS), (31, postT), (44, postS)]: put(k, tx * 16 + 3, 208 + 26 - k.size[1] + 8)
for i in range(54):
    x = i * 16
    if i == 53: put(dR, x, 140)
    elif i % 7 == 0: put(dL, x, 140)
    else: put(dA, x, 144, i % 2 == 1)
b2 = branch.crop((0, 0, 32, 49)); put(b2, 34 * 16, 206); put(b2, 36 * 16, 206, True)
# crates on the boards
put(crates, 15 * 16, 160 - crates.size[1] + 2); put(crateS, 16 * 16 + 2, 160 - crateS.size[1] + 2)
put(crateL, 30 * 16, 160 - crateL.size[1] + 2); put(crateL, 31 * 16, 160 - crateL.size[1] + 2, True); put(crateS, 30 * 16 + 4, 160 - crateL.size[1] - crateS.size[1] + 6)
put(crateO, 40 * 16 + 1, 208 - crateO.size[1]); put(crateS, 41 * 16 + 1, 208 - crateS.size[1]); put(crateO, 42 * 16 + 1, 208 - crateO.size[1], True)
L.save(D + 'pier_layer.png')
print(dA.size, dL.size, branch.size)
