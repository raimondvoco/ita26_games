"""v8: castle knight enemies (Hollow Knight, Squire, Warden). Run: python3 tools/make_knights.py"""
import os
from make_art import canvas, E, R, Pg, finish, ASSETS
from make_assets import hexc as c, outline

def plate(d, x, y, w, h, base, hi, lo):   # a shaded armour plate
    R(d, x, y, w, h, c(lo)); R(d, x + 1, y + 1, w - 2, h - 2, c(base)); R(d, x + 2, y + 2, max(1, w * .3), h - 4, c(hi))

def knight(kind):
    b, d = canvas()
    if kind == 'knight':   # empty dented armour, sword planted, two red sparks in the visor
        E(d, 48, 91, 26, 4, (0, 0, 0, 70))
        Pg(d, [(26, 44), (70, 44), (76, 88), (20, 88)], c('#3a1020')); Pg(d, [(28, 46), (68, 46), (73, 86), (23, 86)], c('#6a1a30'))   # tattered tabard
        for i in range(5): Pg(d, [(22 + i * 11, 86), (28 + i * 11, 86), (25 + i * 11, 92)], c('#6a1a30'))
        plate(d, 32, 42, 32, 26, '#8a8a9a', '#c8c8d8', '#2a2a3a'); R(d, 46, 44, 4, 22, c('#5a5a6a'))
        R(d, 36, 68, 10, 20, c('#2a2a3a')); R(d, 37, 69, 8, 18, c('#7a7a8a')); R(d, 50, 68, 10, 20, c('#2a2a3a')); R(d, 51, 69, 8, 18, c('#6a6a7a'))
        for s_ in (-1, 1): E(d, 48 + s_ * 20, 46, 9, 7, c('#2a2a3a')); E(d, 48 + s_ * 20, 45, 8, 6, c('#9a9aaa')); E(d, 48 + s_ * 18, 43, 3, 2, c('#d8d8e8'))
        E(d, 48, 28, 15, 17, c('#2a2a3a')); E(d, 48, 28, 14, 16, c('#9a9aaa')); R(d, 34, 26, 28, 18, c('#9a9aaa')); R(d, 33, 42, 30, 3, c('#2a2a3a'))
        R(d, 38, 26, 20, 5, c('#0a0408')); R(d, 47, 26, 2, 14, c('#0a0408')); E(d, 42, 28, 2, 1.5, c('#ff3a4a')); E(d, 54, 28, 2, 1.5, c('#ff3a4a'))
        E(d, 42, 18, 4, 3, c('#d8d8e8')); Pg(d, [(48, 11), (52, 2), (58, 0), (54, 8)], c('#a01a3a')); Pg(d, [(48, 12), (44, 3), (38, 2), (43, 10)], c('#c02a4a'))
        R(d, 74, 20, 4, 60, c('#2a2a3a')); R(d, 75, 20, 2, 58, c('#d8e0e8')); R(d, 68, 52, 16, 4, c('#5a3a1a')); R(d, 74, 56, 4, 8, c('#3a2010')); E(d, 76, 50, 3, 3, c('#ffd23c'))
        R(d, 62, 54, 14, 6, c('#2a2a3a')); R(d, 63, 55, 12, 4, c('#8a8a9a'))
        Pg(d, [(36, 54), (40, 50), (44, 58)], c('#2a2a3a'))   # dent
    if kind == 'squire':   # a small knight under a helmet three sizes too big, holding a spear
        E(d, 48, 91, 20, 4, (0, 0, 0, 70))
        R(d, 39, 72, 7, 16, c('#2a2a3a')); R(d, 40, 73, 5, 14, c('#6a6a7a')); R(d, 50, 72, 7, 16, c('#2a2a3a')); R(d, 51, 73, 5, 14, c('#6a6a7a'))
        plate(d, 36, 54, 24, 20, '#7a1a30', '#a02a48', '#3a0a18'); R(d, 46, 56, 4, 16, c('#ffd23c'))
        R(d, 26, 6, 4, 84, c('#3a2010')); R(d, 27, 6, 2, 84, c('#7a5232')); Pg(d, [(28, -2), (34, 10), (22, 10)], c('#d8e0e8')); Pg(d, [(28, 0), (31, 9), (28, 9)], c('#ffffff'))
        E(d, 30, 60, 5, 5, c('#2a2a3a')); E(d, 30, 60, 4, 4, c('#9a9aaa'))
        E(d, 50, 36, 22, 20, c('#2a2a3a')); E(d, 50, 36, 21, 19, c('#a8a8b8')); E(d, 44, 28, 7, 5, c('#e0e0ec')); R(d, 29, 40, 42, 14, c('#a8a8b8')); R(d, 28, 52, 44, 3, c('#2a2a3a'))
        for i in range(5): R(d, 36 + i * 6, 38, 3, 10, c('#0a0408'))
        E(d, 43, 43, 1.6, 1.6, c('#ffd8a0')); E(d, 55, 43, 1.6, 1.6, c('#ffd8a0'))
        Pg(d, [(50, 17), (66, 8), (60, 20)], c('#e83a5a'))
    if kind == 'warden':   # huge, black plate, tattered red cape, halberd; a red rune burns on the breastplate
        E(d, 48, 92, 34, 5, (0, 0, 0, 80))
        Pg(d, [(20, 30), (76, 30), (88, 92), (8, 92)], c('#2a0610')); Pg(d, [(23, 32), (73, 32), (84, 90), (12, 90)], c('#7a1022'))
        for i in range(7): Pg(d, [(10 + i * 11, 90), (17 + i * 11, 90), (13 + i * 11, 96)], c('#7a1022'))
        R(d, 32, 70, 13, 20, c('#0a0a12')); R(d, 33, 71, 11, 18, c('#3a3a4a')); R(d, 51, 70, 13, 20, c('#0a0a12')); R(d, 52, 71, 11, 18, c('#34344a'))
        plate(d, 26, 32, 44, 40, '#3a3a4a', '#6a6a7e', '#0a0a12')
        Pg(d, [(48, 40), (54, 50), (48, 62), (42, 50)], c('#ff2a3a')); Pg(d, [(48, 44), (51, 50), (48, 57), (45, 50)], c('#ffb0a0'))
        for s_ in (-1, 1): E(d, 48 + s_ * 26, 36, 13, 10, c('#0a0a12')); E(d, 48 + s_ * 26, 35, 12, 9, c('#4a4a5e')); Pg(d, [(48 + s_ * 22, 28), (48 + s_ * 34, 14), (48 + s_ * 34, 30)], c('#0a0a12'))
        E(d, 48, 20, 15, 16, c('#0a0a12')); E(d, 48, 20, 14, 15, c('#4a4a5e')); R(d, 34, 18, 28, 16, c('#4a4a5e')); R(d, 38, 18, 20, 4, c('#0a0408')); E(d, 43, 20, 2.4, 1.6, c('#ff3a4a')); E(d, 53, 20, 2.4, 1.6, c('#ff3a4a'))
        for s_ in (-1, 1): Pg(d, [(48 + s_ * 10, 8), (48 + s_ * 20, -4), (48 + s_ * 16, 12)], c('#c8c0b0'))
        R(d, 84, 4, 5, 88, c('#1a0e08')); R(d, 85, 4, 3, 88, c('#5a3a22')); Pg(d, [(86, -2), (96, 10), (96, 24), (88, 18)], c('#c8d0d8')); Pg(d, [(86, 4), (76, 8), (76, 20), (86, 16)], c('#9aa0a8')); R(d, 84, 46, 6, 4, c('#ff2a3a'))
        E(d, 80, 54, 7, 6, c('#0a0a12')); E(d, 80, 54, 6, 5, c('#4a4a5e'))
    big = finish(b, 96, 96, 22); outline(big, .3).save(os.path.join(ASSETS, 'enemies', f'{kind}_big.png'))
    sm = finish(b, 28, 28, 14); outline(sm, .3).save(os.path.join(ASSETS, 'enemies', f'{kind}_small.png'))

if __name__ == '__main__':
    for k in ('knight', 'squire', 'warden'): knight(k)
    print('ok')
