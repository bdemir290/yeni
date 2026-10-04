"""Generate the 1024x1024 pixel-art app icon (32x32 art, nearest-neighbour upscale)."""
import sys
from PIL import Image, ImageDraw

N = 32
INK = (24, 20, 37)
COAT, LIGHT, DARK = (184, 111, 80), (228, 166, 114), (115, 62, 57)
MANE = (62, 39, 49)
WHITE = (234, 212, 170)
RED, GOLD, YELLOW = (228, 59, 68), (254, 174, 52), (254, 231, 97)
SKY0, SKY1 = (38, 43, 68), (18, 78, 137)

img = Image.new('RGBA', (N, N), (0, 0, 0, 0))
px = img.load()
# --- silhouette mask ---
mask = Image.new('L', (N, N), 0)
d = ImageDraw.Draw(mask)
head = [(3, 31), (6, 16), (10, 8), (12, 6), (15, 6), (26, 17), (27, 20), (25, 23), (20, 22), (16, 22), (14, 25), (16, 31)]
d.polygon(head, fill=1)
d.polygon([(10, 7), (11, 1), (13, 6)], fill=1)          # ear
maneM = Image.new('L', (N, N), 0)
dm = ImageDraw.Draw(maneM)
dm.polygon([(0, 31), (1, 22), (3, 14), (7, 8), (10, 6), (11, 8), (7, 15), (5, 23), (4, 31)], fill=1)
dm.polygon([(11, 6), (13, 2), (14, 6)], fill=1)          # forelock

def inside(m, x, y):
    return 0 <= x < N and 0 <= y < N and m.getpixel((x, y))

# background: deep space
SPACE0, SPACE1 = (24, 20, 37), (62, 39, 49)
PURPLE, MAGENTA, SALMON = (104, 56, 108), (181, 80, 136), (246, 117, 122)
TAN, ORANGE0 = (228, 166, 114), (215, 118, 67)
CYAN, NAVY = (44, 232, 245), (38, 43, 68)
bg = Image.new('RGB', (N, N))
bp = bg.load()
for y in range(N):
    t = y / (N - 1)
    c = tuple(int(SPACE0[i] + (SPACE1[i] - SPACE0[i]) * t) for i in range(3))
    for x in range(N):
        bp[x, y] = c
# ringed planet where the sun used to be
import math
def ring(front):
    for k in range(720):
        a = k / 720 * 2 * math.pi
        s_ = math.sin(a)
        if (s_ >= 0) != front: continue
        x = round(23 + math.cos(a) * 11); y = round(9 + s_ * 2.0)
        if 0 <= x < N and 0 <= y < N: bp[x, y] = TAN
        if front and 0 <= x < N and 0 <= y + 1 < N: bp[x, y + 1] = ORANGE0
ring(False)
for y in range(N):
    for x in range(N):
        r2 = (x - 23) ** 2 + (y - 9) ** 2
        if r2 <= 42:
            c = PURPLE
            if (x - 21) ** 2 + (y - 7) ** 2 <= 14: c = MAGENTA
            if (x - 20) ** 2 + (y - 6) ** 2 <= 2: c = SALMON
            bp[x, y] = c
ring(True)
# stars
for (x, y, c) in [(3, 3, (192, 203, 220)), (7, 2, (255, 255, 255)), (29, 22, (192, 203, 220)), (30, 2, CYAN), (17, 3, (192, 203, 220)), (27, 18, (255, 255, 255)), (2, 9, MAGENTA), (31, 13, (192, 203, 220))]:
    bp[x, y] = c
# neon track at the bottom
for y in range(27, 32):
    for x in range(N):
        bp[x, y] = NAVY
for x in range(N):
    bp[x, 27] = CYAN
for x in range(0, N, 4):
    bp[x, 29] = (90, 105, 136); bp[x + 1, 29] = (90, 105, 136)

# body fill with shading
for y in range(N):
    for x in range(N):
        if inside(mask, x, y):
            c = COAT
            if x + y < 22 or (x < 9 and y > 16): c = LIGHT if (x + y) % 7 else COAT
            if y > 19 and x > 13: c = DARK if x + y > 40 else c
            px[x, y] = c + (255,)
        if inside(maneM, x, y):
            px[x, y] = (MANE if (x * 3 + y) % 5 else (115, 62, 57)) + (255,)
# blaze
for i in range(0, 13):
    x, y = 14 + i, 7 + i
    if inside(mask, x, y): px[x, y] = WHITE + (255,)
    if i > 4 and inside(mask, x - 1, y): px[x - 1, y] = WHITE + (255,)
# muzzle shade, nostril, mouth
for (x, y) in [(23, 21), (24, 21), (24, 22), (22, 22), (21, 22)]:
    if inside(mask, x, y): px[x, y] = DARK + (255,)
px[24, 19] = INK + (255,)
# eye
px[15, 11] = INK + (255,); px[16, 11] = INK + (255,); px[15, 10] = (255, 255, 255, 255)
# bridle
for (x, y) in [(13, 12), (14, 13), (15, 14), (16, 15), (17, 16), (18, 17), (19, 17), (20, 17), (21, 17), (22, 16)]:
    if inside(mask, x, y): px[x, y] = RED + (255,)
for (x, y) in [(22, 17), (22, 18), (22, 19), (21, 20), (21, 21)]:
    if inside(mask, x, y): px[x, y] = RED + (255,)
px[17, 16] = GOLD + (255,)
# outline
out = img.copy(); op = out.load()
for y in range(N):
    for x in range(N):
        if px[x, y][3] == 0:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                xx, yy = x + dx, y + dy
                if 0 <= xx < N and 0 <= yy < N and px[xx, yy][3] > 0:
                    op[x, y] = INK + (255,); break
bg.paste(out, (0, 0), out)
big = bg.resize((1024, 1024), Image.NEAREST)
big.save(sys.argv[1] if len(sys.argv) > 1 else 'AppIcon.png')
print('icon saved', big.size, big.mode)
