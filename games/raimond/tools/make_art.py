"""v4 art: full-res hero sheets, larger NPC sheets, enemy sprites, item sprites + portraits. Run: python3 tools/make_art.py"""
import os, math, numpy as np
from PIL import Image, ImageDraw
import make_assets as M
from make_assets import hexc, shade, outline, walk_sheet
ROOT = M.ROOT; SPR = M.SPR; POR = M.POR
ASSETS = os.path.join(ROOT, 'assets'); os.makedirs(os.path.join(ASSETS, 'enemies'), exist_ok=True); os.makedirs(os.path.join(ASSETS, 'items'), exist_ok=True)

def finish(big, W, H, colors=18, thr=120):
    """supersampled RGBA -> crisp pixel art (binary alpha + small palette)"""
    sm = big.resize((W, H), Image.BOX); a = np.array(sm); alpha = a[:, :, 3] >= thr
    q = Image.fromarray(a[:, :, :3]).quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = out.load(); qp = q.load()
    for y in range(H):
        for x in range(W):
            if alpha[y, x]: px[x, y] = qp[x, y] + (255,)
    return out

# ---------------------------------------------------------------- heroes at full resolution
def blob(path):
    """largest connected blob of frame 0, cropped, as RGBA"""
    from scipy import ndimage as ndi
    f0 = Image.open(path).convert('RGBA').crop((0, 0, 32, 40)); a = np.array(f0); mask = a[:, :, 3] > 100
    lab, n = ndi.label(mask, structure=np.ones((3, 3)))
    if n > 1: sizes = ndi.sum(mask, lab, range(1, n + 1)); mask = lab == (1 + int(np.argmax(sizes)))
    a[:, :, 3] = np.where(mask, 255, 0); ys, xs = np.where(mask); return Image.fromarray(a).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
def clean_hero_full(name, direction):
    f0 = blob(os.path.join(M.ORIG, f'{name}_{direction}.png')); target = blob(os.path.join(M.ORIG, f'{name}_left.png')).height   # everyone matches the *_left size
    if direction != 'left' and f0.height != target:
        sc = target / f0.height; f0 = f0.resize((max(8, round(f0.width * sc)), target), Image.BOX)
    arr = np.array(f0); q = Image.fromarray(arr[:, :, :3]).quantize(colors=18, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    out = Image.new('RGBA', f0.size, (0, 0, 0, 0)); px = out.load(); qp = q.load()
    for y in range(f0.height):
        for x in range(f0.width):
            if arr[y, x, 3] >= 128: px[x, y] = qp[x, y] + (255,)
    o = outline(out); full = Image.new('RGBA', (28, 34), (0, 0, 0, 0)); full.paste(o, ((28 - o.width) // 2, 34 - o.height)); return full

# ---------------------------------------------------------------- NPCs: same designs, drawn supersampled and bigger
class CvBig:
    def __init__(s, w=22, h=30, S=1.0, K=5):
        s.w, s.h, s.S, s.K, s.k = w, h, S, K, S * K
        s.big = Image.new('RGBA', (int(w * s.k), int(h * s.k)), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.big)
    def p(s, x, y, c): s.r(x, y, 1, 1, c)
    def r(s, x, y, w, h, c): s.d.rectangle([x * s.k, y * s.k, (x + w) * s.k - 1, (y + h) * s.k - 1], fill=c)
    def e(s, cx, cy, rx, ry, c, fn=None):
        if fn is None: s.d.ellipse([(cx - rx) * s.k, (cy - ry) * s.k, (cx + rx) * s.k - 1, (cy + ry) * s.k - 1], fill=c); return
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1: s.r(x, y, 1, 1, fn(x, y))
    @property
    def im(s): return finish(s.big, round(s.w * s.S), round(s.h * s.S), 20)
M.Cv = CvBig

# ---------------------------------------------------------------- enemies (96x96 painted big, derived small)
def canvas(): 
    b = Image.new('RGBA', (384, 384), (0, 0, 0, 0)); return b, ImageDraw.Draw(b)
def E(d, cx, cy, rx, ry, c): d.ellipse([(cx - rx) * 4, (cy - ry) * 4, (cx + rx) * 4, (cy + ry) * 4], fill=c)
def R(d, x, y, w, h, c): d.rectangle([x * 4, y * 4, (x + w) * 4, (y + h) * 4], fill=c)
def Pg(d, pts, c): d.polygon([(x * 4, y * 4) for x, y in pts], fill=c)
def eyes(d, y, dx=11, r=5, glint=True, col=(16, 12, 24)):
    for s_ in (-1, 1):
        E(d, 48 + s_ * dx, y, r, r * 1.3, col)
        if glint: E(d, 48 + s_ * dx - 1.5, y - 2, 1.8, 1.8, (255, 255, 255))
def enemy(kind):
    b, d = canvas(); c = hexc
    if kind == 'sprout':
        E(d, 48, 90, 22, 4, (0, 0, 0, 60)); E(d, 48, 62, 29, 27, c('#2a5a2a')); E(d, 48, 62, 27, 25, c('#7ad35a')); E(d, 56, 70, 18, 15, c('#5fb842')); E(d, 38, 50, 9, 6, c('#a8ec84'))
        eyes(d, 62); R(d, 42, 74, 12, 2, c('#2a5a2a')); R(d, 46, 18, 4, 16, c('#3a9a3a'))
        Pg(d, [(48, 22), (78, 10), (82, 26), (52, 30)], c('#5ad05a')); Pg(d, [(46, 24), (18, 14), (14, 30), (44, 32)], c('#4ac04a'))
    if kind == 'shadow':
        Pg(d, [(20, 84), (16, 50), (30, 24), (48, 16), (66, 24), (80, 50), (76, 84), (66, 76), (58, 86), (48, 76), (38, 86), (30, 76)], c('#1a1030'))
        Pg(d, [(24, 80), (22, 52), (33, 28), (48, 21), (63, 28), (74, 52), (72, 80), (64, 73), (58, 82), (48, 73), (38, 82), (32, 73)], c('#3d2d66'))
        E(d, 38, 36, 9, 7, c('#5a4a8a')); E(d, 36, 54, 9, 11, (255, 255, 255)); E(d, 60, 54, 9, 11, (255, 255, 255)); E(d, 37, 56, 3, 6, c('#a0f')); E(d, 61, 56, 3, 6, c('#a0f'))
    if kind == 'crab':
        for s_ in (-1, 1):
            for i in range(3): d.line([(48 + s_ * 20) * 4, (66 + i * 6) * 4, (48 + s_ * 34) * 4, (74 + i * 7) * 4], fill=c('#a83a28'), width=14)
        E(d, 48, 62, 31, 22, c('#8a2a1a')); E(d, 48, 61, 29, 20, c('#e0583c')); E(d, 38, 54, 12, 6, c('#f58a68'))
        for s_ in (-1, 1):
            E(d, 48 + s_ * 36, 42, 13, 13, c('#8a2a1a')); E(d, 48 + s_ * 36, 42, 11, 11, c('#e0583c')); Pg(d, [(48 + s_ * 36, 36), (48 + s_ * 52, 20), (48 + s_ * 44, 44)], c('#8a2a1a'))
            R(d, 48 + s_ * 10 - 2, 28, 4, 14, c('#a83a28')); E(d, 48 + s_ * 10, 26, 6, 6, (255, 255, 255)); E(d, 48 + s_ * 10, 27, 3, 3, (16, 12, 24))
        R(d, 40, 70, 16, 2, c('#8a2a1a'))
    if kind == 'glitch':
        for j in range(12):
            o = 6 if (j * 7) % 5 == 0 else 0; R(d, 20 + o, 14 + j * 6, 56, 6, c('#3ee0e8')); R(d, 14 + o, 14 + j * 6, 6, 6, c('#f0f')); R(d, 76 + o, 14 + j * 6, 6, 6, c('#ff0'))
        R(d, 32, 40, 10, 12, (16, 12, 24)); R(d, 54, 40, 10, 12, (16, 12, 24)); R(d, 34, 62, 28, 4, (16, 12, 24)); R(d, 34, 66, 4, 4, (16, 12, 24)); R(d, 58, 66, 4, 4, (16, 12, 24))
    if kind == 'house':
        R(d, 14, 8, 68, 80, c('#2a0a20')); R(d, 17, 11, 62, 74, c('#701850')); R(d, 24, 18, 48, 26, c('#fffff0'))
        R(d, 28, 22, 12, 18, c('#f33')); R(d, 42, 22, 12, 18, c('#3c3')); R(d, 56, 22, 12, 18, c('#fc3')); R(d, 24, 52, 48, 8, c('#ff3ca0')); R(d, 84, 20, 6, 44, c('#ffd23c')); E(d, 87, 18, 6, 6, c('#f33'))
        for i in range(6): E(d, 22 + i * 10, 74, 3, 3, c('#ffd23c'))
    if kind == 'frostling':
        E(d, 48, 90, 24, 4, (0, 0, 0, 60)); E(d, 48, 66, 29, 24, c('#4a6a8a')); E(d, 48, 66, 27, 22, c('#e8f4ff')); E(d, 58, 72, 16, 14, c('#bcd8f0')); E(d, 48, 34, 20, 18, c('#4a6a8a')); E(d, 48, 34, 18, 16, c('#f4faff'))
        E(d, 41, 32, 3, 3, (16, 12, 24)); E(d, 55, 32, 3, 3, (16, 12, 24)); Pg(d, [(46, 38), (76, 42), (46, 44)], c('#ff8a2a')); R(d, 30, 50, 36, 7, c('#d03a4a')); R(d, 56, 50, 8, 18, c('#d03a4a'))
        for i in range(3): E(d, 48, 62 + i * 8, 2, 2, (16, 12, 24))
    if kind == 'jelly':
        E(d, 48, 42, 30, 28, c('#1d6a6a')); E(d, 48, 42, 28, 26, c('#5fd8c8')); E(d, 40, 30, 12, 8, c('#b8f4ea'))
        for i in range(5): d.line([(24 + i * 12) * 4, 62 * 4, (24 + i * 12 + (6 if i % 2 else -6)) * 4, 90 * 4], fill=c('#3ab8a8'), width=16)
        eyes(d, 46, 10, 4)
    big = finish(b, 96, 96, 20); bigo = outline(big, .3)
    bigo.save(os.path.join(ASSETS, 'enemies', f'{kind}_big.png'))
    sm = finish(b, 28, 28, 14); outline(sm, .3).save(os.path.join(ASSETS, 'enemies', f'{kind}_small.png'))

# ---------------------------------------------------------------- items: black fill, white outline, own sprite (32) and portrait (96)
ITEMS = ['scrap', 'clip', 'bat', 'scissors', 'pan', 'umbrella', 'wrench', 'hoodie', 'vest', 'boots', 'headphones', 'locket', 'coin', 'watch', 'cassette', 'wristband', 'polaroid', 'lantern']
def item_ops(n):
    """returns list of (kind, args). coords 0..100. kinds: poly, ell, line(w), rrect; 'detail' ops are white strokes on top"""
    O = []; D = []
    P = lambda pts: O.append(('poly', pts)); L = lambda a, b, w: O.append(('line', (a, b, w))); El = lambda b: O.append(('ell', b)); Dl = lambda a, b, w=2: D.append(('line', (a, b, w)))
    if n == 'bat': P([(18, 84), (14, 80), (70, 22), (80, 14), (88, 22), (80, 32), (22, 88)]); L((20, 84), (30, 74), 8); Dl((30, 72), (74, 28)); Dl((26, 78), (36, 68))
    if n == 'scissors': El((14, 6, 40, 34)); El((14, 66, 40, 94)); L((36, 24), (88, 62), 5); L((36, 76), (88, 38), 5); Dl((40, 26), (84, 58)); D.append(('ellw', (22, 14, 32, 26)))
    if n == 'pan': El((12, 10, 66, 64)); L((60, 58), (92, 90), 9); D.append(('ellw', (22, 20, 56, 54))); Dl((64, 62), (88, 86))
    if n == 'umbrella': P([(10, 52), (20, 30), (36, 16), (50, 12), (64, 16), (80, 30), (90, 52), (76, 46), (64, 54), (50, 46), (36, 54), (24, 46)]); L((50, 48), (50, 88), 5); L((50, 88), (36, 92), 5); Dl((50, 14), (50, 46)); Dl((36, 18), (36, 52)); Dl((64, 18), (64, 52))
    if n == 'wrench': L((24, 80), (68, 34), 10); El((56, 8, 88, 40)); D.append(('ellw', (66, 18, 78, 30))); Dl((30, 74), (64, 40)); El((14, 70, 34, 90))
    if n == 'hoodie': P([(36, 10), (50, 20), (64, 10), (84, 26), (96, 50), (84, 58), (74, 46), (74, 92), (26, 92), (26, 46), (16, 58), (4, 50), (16, 26)]); Dl((50, 22), (50, 56)); D.append(('ellw', (38, 12, 62, 32))); Dl((36, 66), (64, 66)); Dl((36, 66), (36, 82)); Dl((64, 66), (64, 82)); Dl((42, 36), (42, 52)); Dl((58, 36), (58, 52))
    if n == 'vest': P([(30, 10), (42, 18), (58, 18), (70, 10), (86, 20), (80, 50), (78, 92), (22, 92), (20, 50), (14, 20)]); Dl((50, 20), (50, 90)); Dl((30, 56), (46, 56)); Dl((54, 56), (70, 56)); Dl((30, 70), (46, 70)); Dl((54, 70), (70, 70)); Dl((28, 24), (28, 40))
    if n == 'boots': P([(30, 10), (62, 10), (62, 56), (90, 66), (92, 88), (22, 88), (22, 62)]); Dl((34, 20), (58, 20)); Dl((34, 32), (58, 32)); Dl((34, 44), (58, 44)); Dl((24, 78), (90, 78)); Dl((60, 56), (60, 78))
    if n == 'headphones': d_ = [(18, 62), (18, 40), (28, 22), (50, 12), (72, 22), (82, 40), (82, 62)]; L(d_[0], d_[1], 9); L(d_[1], d_[2], 9); L(d_[2], d_[3], 9); L(d_[3], d_[4], 9); L(d_[4], d_[5], 9); L(d_[5], d_[6], 9); El((6, 54, 32, 90)); El((68, 54, 94, 90)); D.append(('ellw', (12, 62, 26, 82))); D.append(('ellw', (74, 62, 88, 82)))
    if n == 'locket': L((50, 4), (24, 40), 4); L((50, 4), (76, 40), 4); El((24, 36, 76, 88)); D.append(('ellw', (32, 44, 68, 80))); Pg_ = [(50, 76), (38, 62), (40, 52), (50, 54), (60, 52), (62, 62)]; D.append(('polyw', Pg_))
    if n == 'coin': El((10, 10, 90, 90)); D.append(('ellw', (20, 20, 80, 80))); D.append(('polyw', [(50, 28), (56, 44), (72, 44), (59, 54), (64, 70), (50, 60), (36, 70), (41, 54), (28, 44), (44, 44)]))
    if n == 'watch': L((38, 4), (38, 30), 18); L((62, 4), (62, 30), 18); L((38, 70), (38, 96), 18); L((62, 70), (62, 96), 18); El((16, 24, 84, 76)); D.append(('ellw', (22, 30, 78, 70))); Dl((50, 50), (50, 36), 3); Dl((50, 50), (64, 56), 3)
    if n == 'cassette': O.append(('rrect', (8, 22, 92, 80))); D.append(('rrectw', (16, 28, 84, 52))); D.append(('ellw', (22, 34, 40, 50))); D.append(('ellw', (60, 34, 78, 50))); Dl((30, 66), (70, 66)); Dl((36, 66), (32, 78)); Dl((64, 66), (68, 78))
    if n == 'wristband': O.append(('rrect', (6, 38, 94, 64))); P([(40, 60), (60, 60), (60, 90), (50, 84), (40, 90)]); Dl((14, 50), (86, 50)); D.append(('rrectw', (42, 64, 58, 80)))
    if n == 'polaroid': O.append(('rrect', (14, 10, 86, 92))); D.append(('rrectw', (22, 18, 78, 66))); Dl((24, 56), (40, 40)); Dl((40, 40), (52, 54)); Dl((52, 54), (62, 46)); Dl((62, 46), (76, 62)); Dl((30, 78), (70, 78))
    if n == 'scrap': P([(14, 12), (40, 6), (56, 14), (80, 8), (88, 30), (82, 52), (90, 74), (60, 88), (40, 82), (18, 90), (10, 62), (16, 40)]); Dl((24, 30), (70, 26)); Dl((24, 44), (74, 42)); Dl((24, 58), (60, 58)); Dl((30, 72), (54, 70))
    if n == 'clip': O.append(('rrect', (12, 36, 88, 62))); El((60, 30, 82, 52)); D.append(('ellw', (66, 36, 76, 46))); Dl((18, 49), (52, 49)); D.append(('polyw', [(71, 38), (73, 43), (78, 43), (74, 46), (76, 51), (71, 48), (66, 51), (68, 46), (64, 43), (69, 43)]))
    if n == 'lantern': O.append(('rrect', (26, 28, 74, 84))); L((36, 28), (36, 12), 4); L((64, 28), (64, 12), 4); L((36, 12), (64, 12), 4); D.append(('rrectw', (34, 38, 66, 76))); D.append(('ellw', (42, 50, 58, 68))); Dl((26, 84), (74, 84), 4)
    if n == 'luckychip': El((10, 10, 90, 90)); D.append(('ellw', (22, 22, 78, 78))); [Dl((50 + 40 * __import__('math').cos(k * .785), 50 + 40 * __import__('math').sin(k * .785)), (50 + 30 * __import__('math').cos(k * .785), 50 + 30 * __import__('math').sin(k * .785)), 3) for k in range(8)]; D.append(('polyw', [(50, 34), (60, 50), (50, 66), (40, 50)]))
    if n == 'bunny': El((26, 40, 74, 92)); El((32, 16, 68, 52)); P([(34, 22), (30, 2), (42, 4), (44, 20)]); P([(56, 20), (58, 4), (70, 2), (66, 22)]); D.append(('ellw', (40, 28, 46, 34))); D.append(('ellw', (54, 28, 60, 34))); Dl((46, 42), (54, 42)); Dl((40, 70), (60, 70))
    if n == 'ticket': O.append(('rrect', (6, 26, 94, 74))); Dl((30, 30), (30, 70)); D.append(('rrectw', (38, 34, 86, 66))); Dl((50, 42), (72, 42)); Dl((50, 50), (66, 50)); Dl((50, 58), (70, 58))
    if n == 'shaker': O.append(('rrect', (34, 30, 66, 94))); P([(34, 32), (40, 14), (60, 14), (66, 32)]); O.append(('rrect', (44, 4, 56, 16))); Dl((40, 50), (60, 50)); Dl((40, 62), (60, 62)); Dl((38, 30), (62, 30))
    if n == 'neonpipe': L((20, 86), (80, 14), 12); El((70, 6, 90, 26)); El((10, 76, 30, 96)); Dl((26, 78), (74, 22)); Dl((30, 82), (78, 26), 1)
    return O, D
def render_item(n, size, hatch=False):
    K = 8; S = size * K; sc = S / 100.0
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); O, D = item_ops(n); ow = max(2.0, size / 11) * K * .45
    def draw(d, ops, fill, grow):
        for kind, a in ops:
            if kind == 'poly': d.polygon([(x * sc, y * sc) for x, y in a], fill=fill); [d.line([(a[i][0] * sc, a[i][1] * sc), (a[(i + 1) % len(a)][0] * sc, a[(i + 1) % len(a)][1] * sc)], fill=fill, width=int(grow * 2)) for i in range(len(a))]
            if kind == 'ell': x0, y0, x1, y1 = a; d.ellipse([x0 * sc - grow, y0 * sc - grow, x1 * sc + grow, y1 * sc + grow], fill=fill)
            if kind == 'line': (x0, y0), (x1, y1), w = a; d.line([x0 * sc, y0 * sc, x1 * sc, y1 * sc], fill=fill, width=int(w * sc + grow * 2))
            if kind == 'rrect': x0, y0, x1, y1 = a; d.rounded_rectangle([x0 * sc - grow, y0 * sc - grow, x1 * sc + grow, y1 * sc + grow], radius=6 * sc, fill=fill)
    d = ImageDraw.Draw(img); draw(d, O, (255, 255, 255, 255), ow); draw(d, O, (10, 10, 10, 255), 0)
    lw = max(1, int(size / 24 * K * .5))
    for kind, a in D:
        if kind == 'line': (x0, y0), (x1, y1), w = a; d.line([x0 * sc, y0 * sc, x1 * sc, y1 * sc], fill=(255, 255, 255, 255), width=lw * w // 2 if w > 1 else lw)
        if kind == 'ellw': x0, y0, x1, y1 = a; d.ellipse([x0 * sc, y0 * sc, x1 * sc, y1 * sc], outline=(255, 255, 255, 255), width=lw)
        if kind == 'rrectw': x0, y0, x1, y1 = a; d.rounded_rectangle([x0 * sc, y0 * sc, x1 * sc, y1 * sc], radius=3 * sc, outline=(255, 255, 255, 255), width=lw)
        if kind == 'polyw': d.polygon([(x * sc, y * sc) for x, y in a], outline=(255, 255, 255, 255), width=lw)
    if hatch:   # ink hatching on the portrait version
        h = ImageDraw.Draw(img)
        for i in range(-S, S, K * 6): h.line([i, S, i + S, 0], fill=(255, 255, 255, 38), width=1)
    return img
def make_items(only=None):
    for n in (only or ITEMS):
        sp = render_item(n, 32).resize((32, 32), Image.BOX); a = np.array(sp); a[:, :, 3] = np.where(a[:, :, 3] > 110, 255, 0)
        g = (a[:, :, :3].mean(axis=2) > 128); a[:, :, :3] = np.where(g[:, :, None], 255, 12); Image.fromarray(a).save(os.path.join(ASSETS, 'items', f'{n}.png'))
        big = render_item(n, 96, True); bg = Image.new('RGBA', (96, 96), (22, 22, 24, 255)); bg.alpha_composite(big.resize((96, 96), Image.LANCZOS))
        dd = ImageDraw.Draw(bg); dd.rectangle([0, 0, 95, 95], outline=(255, 255, 255, 255), width=2); bg.convert('RGB').save(os.path.join(ASSETS, 'items', f'{n}_portrait.png'))

# ---------------------------------------------------------------- collectible sprites (16px, coloured, with outline)
def pk_canvas(): b = Image.new('RGBA', (64, 64), (0, 0, 0, 0)); return b, ImageDraw.Draw(b)
def pk_save(b, name):
    sm = outline(finish(b, 16, 16, 12, 110), .32); sm.save(os.path.join(ASSETS, 'pickups', name + '.png'))
def make_pickups():
    os.makedirs(os.path.join(ASSETS, 'pickups'), exist_ok=True); c = hexc
    def e(d, x0, y0, x1, y1, col): d.ellipse([x0 * 4, y0 * 4, x1 * 4, y1 * 4], fill=col)
    def r_(d, x0, y0, x1, y1, col): d.rectangle([x0 * 4, y0 * 4, x1 * 4, y1 * 4], fill=col)
    def poly(d, pts, col): d.polygon([(x * 4, y * 4) for x, y in pts], fill=col)
    b, d = pk_canvas(); r_(d, 7, 9, 9, 14, c('#f2ead8')); e(d, 2, 2, 14, 11, c('#2fb09a')); e(d, 3, 3, 12, 8, c('#8ff0d0')); e(d, 4, 4, 6, 6, c('#ffffff')); e(d, 9, 5, 10, 6, c('#e8fff4')); pk_save(b, 'mushroom')
    b, d = pk_canvas(); e(d, 2, 1, 8, 7, c('#b8743a')); e(d, 4, 3, 6, 5, (0, 0, 0, 0)); r_(d, 7, 3, 8, 13, c('#b8743a')); r_(d, 8, 10, 12, 11, c('#b8743a')); r_(d, 8, 12, 11, 13, c('#b8743a')); r_(d, 3, 2, 4, 3, c('#e8a460')); pk_save(b, 'key')
    b, d = pk_canvas(); poly(d, [(8, 14), (1, 8), (2, 4), (5, 2), (8, 3), (11, 2), (14, 4), (15, 8)], c('#f4b8c8')); [d.line([8 * 4, 14 * 4, x * 4, 3 * 4], fill=c('#d8809c'), width=3) for x in (3, 6, 8, 10, 13)]; e(d, 6, 11, 10, 15, c('#f8d8e0')); pk_save(b, 'shell')
    b, d = pk_canvas(); e(d, 1, 1, 15, 15, c('#2a1a4a')); e(d, 2, 2, 14, 14, c('#3ee0ff')); e(d, 4, 4, 12, 12, c('#1a1030')); poly(d, [(9, 4), (5, 9), (8, 9), (7, 13), (11, 7), (8, 7)], c('#ff3ca0')); pk_save(b, 'token')
    b, d = pk_canvas(); e(d, 2, 3, 14, 14, c('#c8924a')); e(d, 3, 4, 13, 12, c('#e8bc78')); [e(d, x, y, x + 2, y + 2, c('#5a3a1a')) for x, y in ((5, 5), (9, 6), (6, 9), (10, 10))]; pk_save(b, 'snack')
    b, d = pk_canvas(); e(d, 2, 2, 14, 14, c('#3a68c8')); e(d, 3, 3, 13, 13, c('#7ab0f4')); e(d, 4, 4, 7, 7, c('#ffffff')); e(d, 9, 9, 12, 12, c('#4a80e0')); pk_save(b, 'marble')
    b, d = pk_canvas(); poly(d, [(4, 1), (9, 1), (9, 9), (14, 11), (15, 15), (3, 15), (3, 8)], c('#7a4a2a')); r_(d, 4, 1, 9, 3, c('#5a3418')); r_(d, 3, 13, 15, 15, c('#3a2210')); pk_save(b, 'boot')
    b, d = pk_canvas(); r_(d, 6, 1, 10, 4, c('#8a5a30')); r_(d, 5, 4, 11, 5, c('#c8c8d0')); e(d, 3, 5, 13, 15, c('#e8a020')); e(d, 5, 7, 8, 10, c('#ffe08a')); pk_save(b, 'oil')
    b, d = pk_canvas(); poly(d, [(2, 3), (13, 1), (9, 14)], c('#c8ccd8')); poly(d, [(4, 4), (11, 3), (8, 11)], c('#e8ecf4')); poly(d, [(7, 6), (5, 8), (7, 10), (9, 8)], c('#d03a6a')); pk_save(b, 'shard')
    b, d = pk_canvas(); poly(d, [(3, 7), (13, 7), (8, 15)], c('#d8a050')); [d.line([x * 4, 8 * 4, 8 * 4, 14 * 4], fill=c('#a8702a'), width=2) for x in (5, 11)]; e(d, 2, 1, 14, 9, c('#ff9ac0')); e(d, 4, 2, 8, 5, c('#ffd0e0')); pk_save(b, 'cone')
    b, d = pk_canvas(); r_(d, 2, 4, 14, 13, c('#f2d860')); r_(d, 3, 5, 13, 12, c('#ffe98a')); [d.line([x * 4, 5 * 4, x * 4, 12 * 4], fill=c('#d8b030'), width=2) for x in (5, 8, 11)]; r_(d, 5, 2, 10, 4, c('#2a9ad0')); pk_save(b, 'wax')
    b, d = pk_canvas(); r_(d, 3, 1, 13, 15, c('#f4f0e0')); r_(d, 3, 1, 13, 3, c('#d0ccc0')); [r_(d, 5, y, 11, y, c('#8a8a90')) for y in (6, 8, 10)]; r_(d, 9, 12, 12, 13, c('#d03a4a')); pk_save(b, 'page')
# ---------------------------------------------------------------- shack animals (4-frame sheets for all four views) + portraits
def animal_frame(kind, f):
    b = Image.new('RGBA', (160, 120), (0, 0, 0, 0)); d = ImageDraw.Draw(b); c = hexc; W_, H_ = 160, 120; bob = (f & 1) * 2 if kind != 'owl' else 0
    def e(x0, y0, x1, y1, col): d.ellipse([x0 * 4, y0 * 4 + bob * 4, x1 * 4, y1 * 4 + bob * 4], fill=col)
    def poly(pts, col): d.polygon([(x * 4, y * 4 + bob * 4) for x, y in pts], fill=col)
    def rr(x0, y0, x1, y1, col): d.rectangle([x0 * 4, y0 * 4, x1 * 4, y1 * 4], fill=col)
    wag = [0, -3, 0, 3][f]
    if kind == 'dog':
        for x in (10, 14, 26, 30): rr(x, 21, x + 2, 27, c('#b8864a'))
        poly([(33, 14), (40, 8 + wag), (42, 10 + wag), (36, 19), (33, 19)], c('#b8864a')); e(8, 11, 36, 25, c('#d8a860')); e(10, 15, 34, 24, c('#ecc890')); e(2, 6, 17, 20, c('#d8a860')); e(0, 12, 8, 19, c('#ecc890')); e(0, 12, 3, 15, c('#222')); e(5, 9, 7, 11, c('#222')); poly([(14, 6), (21, 4), (21, 16), (15, 14)], c('#8a5a30')); rr(5, 19, 12, 20, c('#d03a3a'))
    if kind == 'cat':
        for x in (11, 15, 27, 31): rr(x, 21, x + 2, 27, c('#6a6a78'))
        poly([(33, 15), (40, 10 + wag), (43, 5 + wag), (45, 6 + wag), (43, 13), (37, 21), (33, 21)], c('#8a8a98')); e(9, 11, 35, 24, c('#9a9aa8')); [rr(14 + i * 5, 12, 15 + i * 5, 17, c('#6a6a78')) for i in range(4)]; e(3, 6, 17, 19, c('#9a9aa8')); poly([(4, 7), (5, 1), (9, 6)], c('#9a9aa8')); poly([(11, 6), (14, 1), (16, 8)], c('#9a9aa8')); e(5, 10, 8, 13, c('#f4e060')); e(11, 10, 14, 13, c('#f4e060')); e(6, 10, 7, 13, c('#111')); e(12, 10, 13, 13, c('#111')); e(8, 14, 10, 16, c('#e8a0b0'))
    if kind == 'owl':
        e(8, 6, 32, 28, c('#6a4a30')); e(11, 14, 29, 28, c('#c8a878')); poly([(8, 12), (3, 22), (10, 26)], c('#54381e')); poly([(32, 12), (37, 22), (30, 26)], c('#54381e')); poly([(10, 8), (8, 1), (15, 6)], c('#6a4a30')); poly([(30, 8), (32, 1), (25, 6)], c('#6a4a30'))
        blink = f == 2; e(10, 9, 19, 18, c('#f2ead0')); e(21, 9, 30, 18, c('#f2ead0')); (rr(11, 13, 18, 14, c('#222')), rr(22, 13, 29, 14, c('#222'))) if blink else (e(13, 11, 17, 16, c('#222')), e(23, 11, 27, 16, c('#222'))); poly([(18, 17), (22, 17), (20, 21)], c('#e8a020')); rr(14, 28, 17, 30, c('#e8a020')); rr(23, 28, 26, 30, c('#e8a020'))
    if kind == 'turtle':
        for x in (11, 15, 27, 31): rr(x, 21, x + 3, 26, c('#5a8a3a'))
        poly([(33, 14), (40, 13 + wag // 2), (40, 17), (34, 19)], c('#5a8a3a')); e(8, 3, 36, 24, c('#3a6a2a')); e(9, 4, 35, 22, c('#6a9a3a')); [e(x, y, x + 6, y + 5, c('#8ab84a')) for x, y in ((12, 7), (20, 6), (27, 8), (16, 14), (24, 14))]; e(0, 10, 11, 21, c('#5a8a3a')); e(2, 12, 4, 14, c('#111')); rr(1, 18, 5, 18, c('#2a4a1a'))
    cx = {'dog': 0, 'cat': 0, 'owl': 0, 'turtle': 0}[kind]
    return finish(b, 40, 30, 16, 110)
def animal_sheet(kind):
    fr = [outline(animal_frame(kind, f)) for f in range(4)]; w, h = fr[0].size; sh_ = Image.new('RGBA', (w * 4, h), (0, 0, 0, 0))
    for i, f in enumerate(fr): sh_.paste(f, (i * w, 0))
    return sh_
ANIMALS = {'biscuit': ('dog', '#d8a860', '#cfa770'), 'mochi': ('cat', '#9a9aa8', '#b8b0c8'), 'hoot': ('owl', '#8a5a3a', '#9ab0a0'), 'shell': ('turtle', '#6a9a3a', '#b0c898')}
def make_animals():
    for id_, (kind, col, bg) in ANIMALS.items():
        sh_ = animal_sheet(kind)
        for dname in M.DIRS:
            out = sh_ if dname in ('left', 'up') else Image.new('RGBA', sh_.size); 
            if dname in ('right', 'down'):
                w = sh_.width // 4
                for i in range(4): out.paste(sh_.crop((i * w, 0, (i + 1) * w, sh_.height)).transpose(Image.FLIP_LEFT_RIGHT), (i * w, 0))
            out.save(os.path.join(SPR, f'npc_{id_}_{dname}.png'))
        M.NPC[id_] = dict(skin=col, hair=col, style='none', top=col, trim=col, pants=col, shoe=col, acc=[kind], bg=bg)
        for emo in ('neutral', 'happy', 'sad', 'angry', 'shock', 'worried', 'blush', 'dark'): M.portrait(id_, emo).save(os.path.join(POR, f'npc_{id_}_{emo}.png'))
# ---------------------------------------------------------------- monster variants (hue-shifted so zones feel different)
def make_variants():
    import colorsys
    V = {'bloomling': ('sprout', 230, 1.0), 'wraith': ('shadow', -90, 1.1), 'hermit': ('crab', 200, 1.0), 'static': ('glitch', -80, 1.0), 'glowjelly': ('jelly', 150, 1.1)}
    for new, (base, deg, sat) in V.items():
        for sz in ('big', 'small'):
            im = Image.open(os.path.join(ASSETS, 'enemies', f'{base}_{sz}.png')).convert('RGBA'); a = np.array(im); px = a.reshape(-1, 4)
            for i in range(len(px)):
                if px[i, 3]:
                    h_, s_, v_ = colorsys.rgb_to_hsv(*(px[i, :3] / 255.0)); h_ = (h_ + deg / 360.0) % 1.0; r_, g_, b_ = colorsys.hsv_to_rgb(h_, min(1, s_ * sat), v_); px[i, :3] = (int(r_ * 255), int(g_ * 255), int(b_ * 255))
            Image.fromarray(px.reshape(a.shape)).save(os.path.join(ASSETS, 'enemies', f'{new}_{sz}.png'))
if __name__ == '__main__':
    M.LEG = 4
    for hero in ('caroline', 'hitori', 'steven', 'uku'):
        for d in M.DIRS: walk_sheet(clean_hero_full(hero, d), d).save(os.path.join(SPR, f'{hero}_{d}.png'))
    humans = list(M.NPC)
    for id_ in humans:
        for d in M.DIRS: M.npc_sheet(id_, d).save(os.path.join(SPR, f'npc_{id_}_{d}.png'))
    for k in ('sprout', 'shadow', 'crab', 'glitch', 'house', 'frostling', 'jelly'): enemy(k)
    for id_ in humans:
        for emo in ('neutral', 'happy', 'sad', 'angry', 'shock', 'worried', 'blush', 'dark'): M.portrait(id_, emo).save(os.path.join(POR, f'npc_{id_}_{emo}.png'))
    make_items(); make_pickups(); make_variants(); make_animals(); print('art done')
