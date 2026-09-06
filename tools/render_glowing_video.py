import math
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops, ImageEnhance

W, H = 1280, 720
FPS = 24
DUR = 14.0
NF = int(DUR * FPS)

FONT_FILE = r"C:\Users\jagan\AppData\Local\Temp\opencode\OrbitronG800.ttf"
OUT_DIR = r"C:\Users\jagan\AppData\Local\Temp\opencode\frames"
os.makedirs(OUT_DIR, exist_ok=True)

CYAN = (0, 240, 255)
BLUE = (0, 150, 255)
DEEP = (40, 90, 200)
WHITE = (235, 246, 255)
VIOLET = (150, 120, 255)

rng = random.Random(1337)


def font(sz):
    return ImageFont.truetype(FONT_FILE, sz)


def add_glow(base, draw_fn, color, scale=4, blur=3, strength=1.0):
    src = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(src))
    small = src.resize((max(1, W // scale), max(1, H // scale)), Image.BILINEAR)
    small = small.filter(ImageFilter.GaussianBlur(blur))
    big = small.resize((W, H), Image.BILINEAR)
    chan = big.split()[3].point(lambda v: int(v * strength))
    r_, g_, b_ = color
    rm = chan.point(lambda v: min(255, int(v * r_ // 255)))
    gm = chan.point(lambda v: min(255, int(v * g_ // 255)))
    bm = chan.point(lambda v: min(255, int(v * b_ // 255)))
    tint = Image.merge("RGB", (rm, gm, bm))
    return ImageChops.add(base, tint)


def smooth(p):
    p = max(0.0, min(1.0, p))
    return p * p * (3 - 2 * p)


def letter_layout(text, sz, gap):
    ft = font(sz)
    widths = [ft.getlength(c) for c in text]
    total = sum(widths) + gap * (len(text) - 1)
    x0 = (W - total) / 2.0
    cx = []
    x = x0
    for w in widths:
        cx.append(x + w / 2.0)
        x += w + gap
    return cx, ft


TITLE = "ZENOFEST"
BADGE = "2K26"
TAGLINE = "<CODE THE NEXT ERA/>"
TECHTAG = "NATIONAL LEVEL PROJECT EXPO"

t_cx, t_font = letter_layout(TITLE, 158, 14)
b_cx, b_font = letter_layout(BADGE, 64, 22)
tag_cx, tag_font = letter_layout(TAGLINE, 46, 10)
tech_cx, tech_font = letter_layout(TECHTAG, 26, 16)

TITLE_Y = 352
BADGE_Y = 500
TAGLINE_Y = 560
TECHTAG_Y = 168

title_ignite_start = 0.9
title_ignite_gap = 0.42
title_ignite_dur = 0.5

O_IDX = TITLE.index("O")
O_CTR = (t_cx[O_IDX], TITLE_Y)

PARTICLES = []
for _ in range(150):
    a = rng.random() * math.tau
    rr = math.sqrt(rng.random()) * 1400 * 0.62
    PARTICLES.append({
        "x": W / 2 + math.cos(a) * rr,
        "y": H / 2 + math.sin(a) * rr * 0.62,
        "vx": (rng.random() - 0.5) * 12,
        "vy": (rng.random() - 0.5) * 12,
        "s": rng.random() * 1.5 + 0.5,
        "ph": rng.random() * math.tau,
        "c": rng.choice([CYAN, BLUE, WHITE, VIOLET]),
    })

ARCS = []


def make_arcs(sx, sy, tx, ty, disp):
    def subdiv(p1, p2, d, out):
        if d < 5:
            out.append(p2)
            return
        mx = (p1[0] + p2[0]) / 2 + (rng.random() - 0.5) * d
        my = (p1[1] + p2[1]) / 2 + (rng.random() - 0.5) * d
        subdiv(p1, (mx, my), d / 2, out)
        subdiv((mx, my), p2, d / 2, out)

    pts = [(sx, sy)]
    subdiv((sx, sy), (tx, ty), disp, pts)
    return pts


def draw_grid(base, t):
    p = smooth(min(1.0, t / 1.4))
    if p <= 0.01:
        return base
    d = ImageDraw.Draw(base)
    a = int(13 * p)
    for x in range(0, W + 1, 46):
        d.line([(x, 0), (x, H)], fill=(0, 240, 255, a), width=1)
    for y in range(0, H + 1, 46):
        d.line([(0, y), (W, y)], fill=(0, 240, 255, a), width=1)
    return base


def draw_particles(base, t):
    d = ImageDraw.Draw(base)
    cxo, cyo = W / 2, H / 2
    burst = t > 11.0
    burst_p = smooth(min(1.0, (t - 11.0) / 0.7)) if burst else 0.0
    attract = 0.55 * (1.0 - burst_p) if not burst else 0.0
    for pt in PARTICLES:
        pt["ph"] += 0.06
        gl = math.sin(pt["ph"]) * 0.5 + 0.6
        if burst:
            dx = pt["x"] - cxo
            dy = pt["y"] - cyo
            dl = math.hypot(dx, dy) + 1e-6
            pt["vx"] += dx / dl * 60 * burst_p + (rng.random() - 0.5) * 40
            pt["vy"] += dy / dl * 60 * burst_p + (rng.random() - 0.5) * 40
        else:
            pt["vx"] += (cxo - pt["x"]) * attract * 0.0009 * 0.2
            pt["vy"] += (cyo - pt["y"]) * attract * 0.0009 * 0.2
        pt["vx"] *= 0.985
        pt["vy"] *= 0.985
        if not burst:
            ang = t * 0.4
            pt["vx"] += math.cos(ang + pt["ph"] * 0.5) * 1.2
            pt["vy"] += math.sin(ang + pt["ph"] * 0.5) * 0.8
        pt["x"] += pt["vx"] * 0.05
        pt["y"] += pt["vy"] * 0.05
        r = pt["s"] * gl
        px = int(pt["x"] % W)
        py = int(pt["y"] % H)
        c = pt["c"]
        d.ellipse([px - r, py - r, px + r, py + r], fill=(c[0], c[1], c[2], 255))
    for i in range(len(PARTICLES)):
        a = PARTICLES[i]
        for j in range(i + 1, len(PARTICLES)):
            b = PARTICLES[j]
            dx = a["x"] - b["x"]
            dy = a["y"] - b["y"]
            dd = dx * dx + dy * dy
            if dd < 130 * 130:
                op = (1 - math.sqrt(dd) / 130) * 0.22
                d.line([(a["x"], a["y"]), (b["x"], b["y"])],
                       fill=(0, 200, 255, int(255 * op)), width=1)
    return base


def draw_title(base, t):
    f = t_font
    for i, ch in enumerate(TITLE):
        cx = t_cx[i]
        cy = TITLE_Y + math.sin(t * 1.3 + i) * 3
        t0 = title_ignite_start + i * title_ignite_gap
        if t < t0:
            continue
        p = smooth(min(1.0, (t - t0) / title_ignite_dur))
        if p <= 0.01:
            continue
        flash = (1 - p) * 1.6
        col = (
            int(WHITE[0] + (CYAN[0] - WHITE[0]) * p),
            int(WHITE[1] + (CYAN[1] - WHITE[1]) * p),
            int(WHITE[2] + (CYAN[2] - WHITE[2]) * p),
        )
        flicker = 0.85 + 0.15 * math.sin(t * 31 + i * 7)
        if rng.random() < 0.02:
            flicker = 0.3
        base = add_glow(
            base,
            lambda d, ch=ch, cx=cx, cy=cy: (d.text((cx, cy + 2), ch, font=f, anchor="mm", fill=(255, 255, 255)),
                                            d.text((cx, cy), ch, font=f, anchor="mm", fill=(255, 255, 255))),
            col, scale=4, blur=4, strength=min(4.2, (1.5 + flash) * flicker),
        )
    # sharp cores
    d = ImageDraw.Draw(base)
    for i, ch in enumerate(TITLE):
        cx = t_cx[i]
        cy = TITLE_Y + math.sin(t * 1.3 + i) * 3
        t0 = title_ignite_start + i * title_ignite_gap
        p = smooth(min(1.0, (t - t0) / title_ignite_dur))
        if t < t0 or p <= 0.01:
            continue
        flicker = 0.9 + 0.1 * math.sin(t * 31 + i * 7)
        if rng.random() < 0.015:
            flicker = 0.35
        core_col = (
            int(205 * flicker + 35),
            int(240 * flicker + 10),
            int(255 * flicker),
        )
        d.text((cx, cy), ch, font=f, anchor="mm", fill=core_col)
    return base


def draw_o_core(base, t):
    cx, cy = O_CTR
    if t < 2.0:
        base = add_glow(
            base,
            lambda d: d.ellipse([cx - 90, cy - 90, cx + 90, cy + 90], fill=(128, 128, 128)),
            CYAN, scale=6, blur=6, strength=max(0.3, (t - 1.0) * 1.4),
        )
        return base
    pulse = math.sin(t * 3.2) * 0.5 + 0.5
    for k, rad in enumerate([34, 52, 74]):
        rr = rad + math.sin(t * 3.2 + k * 1.7) * 5
        a = max(0.05, 0.5 - k * 0.14)
        base = add_glow(
            base,
            lambda d, rr=rr: d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
                                       outline=(255, 255, 255), width=2),
            CYAN, scale=5, blur=3, strength=(0.6 + pulse * 0.8) * a * 1.6,
        )
    d = ImageDraw.Draw(base)
    r0 = 3 + pulse * 2.5
    d.ellipse([cx - r0, cy - r0, cx + r0, cy + r0], fill=(255, 255, 255))
    return base


def draw_badge(base, t):
    appear = 5.4
    if t < appear:
        return base
    p = smooth(min(1.0, (t - appear) / 0.6))
    if p <= 0.01:
        return base
    xc = sum(b_cx) / len(b_cx)
    glow_scale = 2.0 * p
    base = add_glow(
        base,
        lambda d: d.text((xc, BADGE_Y + 2), BADGE, font=b_font, anchor="mm", fill=(255, 255, 255)),
        CYAN, scale=4, blur=4, strength=glow_scale,
    )
    d = ImageDraw.Draw(base)
    for i, ch in enumerate(BADGE):
        d.text((b_cx[i], BADGE_Y), ch, font=b_font, anchor="mm",
               fill=(int(235 * p * 0.9), int(255 * p), int(255 * p)))
    # side lines extend outward
    spread = smooth(min(1.0, (t - appear - 0.25) / 0.7))
    y = BADGE_Y
    left_end = b_cx[0] - b_font.getlength(BADGE[0]) / 2
    right_start = b_cx[-1] + b_font.getlength(BADGE[-1]) / 2
    lx = W / 2 - 520 + (left_end - (W / 2 - 520)) * spread
    rx = W / 2 + 520 + (right_start - (W / 2 + 520)) * spread
    d.line([(lx, y), (left_end, y)], fill=(0, 230, 255, 255), width=2)
    d.line([(right_start, y), (rx, y)], fill=(0, 230, 255, 255), width=2)
    return base


def draw_tagline(base, t):
    appear = 6.7
    if t < appear:
        return base
    k = int((t - appear) * 9)
    k = min(k, len(TAGLINE))
    if k == 0:
        return base
    # all chars drawn up to k, at fixed centers; bracket chars in cyan
    glow_parts = []
    for i in range(len(TAGLINE)):
        if i < k:
            col = CYAN if TAGLINE[i] in "<>/" else WHITE
            glow_parts.append((i, col))
    if not glow_parts:
        return base
    base = add_glow(
        base,
        lambda d: [d.text((tag_cx[i], TAGLINE_Y), TAGLINE[i], font=tag_font, anchor="mm", fill=(255, 255, 255))
                   for i, _ in glow_parts],
        CYAN, scale=4, blur=3, strength=1.0,
    )
    d = ImageDraw.Draw(base)
    for i, col in glow_parts:
        d.text((tag_cx[i], TAGLINE_Y), TAGLINE[i], font=tag_font, anchor="mm", fill=col)
    return base


def draw_tech_tag(base, t):
    appear = 9.0
    if t < appear:
        return base
    p = smooth(min(1.0, (t - appear) / 0.8))
    if p <= 0.01:
        return base
    xc = sum(tech_cx) / len(tech_cx)
    base = add_glow(
        base,
        lambda d: d.text((xc, TECHTAG_Y), TECHTAG, font=tech_font, anchor="mm", fill=(255, 255, 255)),
        BLUE, scale=4, blur=3, strength=0.9 * p,
    )
    d = ImageDraw.Draw(base)
    col = (int(120 + 100 * p), int(220 + 30 * p), 255)
    for cx in tech_cx:
        d.text((cx, TECHTAG_Y), TECHTAG[tech_cx.index(cx)], font=tech_font, anchor="mm", fill=col)
    y = TECHTAG_Y + 26
    x1 = W / 2 - 340
    x2 = W / 2 + 340
    d.line([(x1, y), (x1 + (x2 - x1) * p, y)], fill=(0, 200, 255, 255), width=1)
    return base


def draw_arcs(base, t):
    active = 4.6 <= t < 10.0 or t >= 11.0 and t < 13.5
    if active and rng.random() < 0.5:
        target = rng.choice([i for i in range(8) if i != O_IDX])
        pts = make_arcs(*O_CTR, t_cx[target], TITLE_Y, 26)
        ARCS.append({"pts": pts, "life": 1, "max": 7 + rng.randint(0, 8),
                     "white": rng.random() < 0.4})
    for a in ARCS[:]:
        alp = 1 - a["life"] / a["max"]
        if alp <= 0:
            ARCS.remove(a)
            continue
        if len(a["pts"]) > 1:
            base = add_glow(
                base,
                lambda d, a=a: d.line(a["pts"], fill=(255, 255, 255), width=4),
                CYAN, scale=4, blur=2, strength=alp * 2.4,
            )
            d = ImageDraw.Draw(base)
            cc = (255, 255, 255) if a["white"] else (210, 246, 255)
            d.line(a["pts"], fill=cc, width=1)
        a["life"] += 1
    return base


def draw_backplate(base, t):
    # soft aura behind title once fully lit; only late phase for richness
    if t < 7.0:
        return base
    cx = sum(t_cx) / len(t_cx)
    rw = (t_cx[-1] - t_cx[0]) / 2 + 130
    rh = 210
    base = add_glow(
        base,
        lambda d: d.ellipse([cx - rw, TITLE_Y - rh, cx + rw, TITLE_Y + rh], fill=(90, 90, 90)),
        DEEP, scale=8, blur=7, strength=0.26,
    )
    return base


def draw_shockwave(base, t):
    if t < 11.0 or t > 13.4:
        return base
    p = (t - 11.0) / 2.4
    r0 = 70 + p * 1180
    alp = (1 - p) ** 1.3
    if p < 0.04:
        return base
    base = add_glow(
        base,
        lambda d: d.ellipse([O_CTR[0] - r0, O_CTR[1] - r0 * 0.62, O_CTR[0] + r0, O_CTR[1] + r0 * 0.62],
                            outline=(255, 255, 255), width=3),
        CYAN, scale=5, blur=3, strength=alp * 1.8,
    )
    return base


def grade(base, t):
    g = 1.22 if t > 0.3 else 1.05
    g = 1.28 if t >= 10.5 else g
    return base.point(lambda x: int(255 * (x / 255.0) ** g))


def draw_fade(base, t):
    f = 1.0
    if t > 13.2:
        f = max(0.0, 1.0 - (t - 13.2) / 0.8)
    if f < 1.0:
        base = ImageEnhance.Brightness(base).enhance(f)
    return base


def main():
    for n in range(NF):
        t = n / FPS
        base = Image.new("RGB", (W, H), (0, 0, 0))
        base = draw_grid(base, t)
        base = draw_particles(base, t)
        base = draw_backplate(base, t)
        base = draw_title(base, t)
        base = draw_o_core(base, t)
        base = draw_badge(base, t)
        base = draw_tech_tag(base, t)
        base = draw_arcs(base, t)
        base = draw_shockwave(base, t)
        base = grade(base, t)
        base = draw_fade(base, t)
        base.save(os.path.join(OUT_DIR, f"f{n:04d}.png"))
        if n % 40 == 0:
            print(f"frame {n}/{NF}", flush=True)
    print("DONE")


if __name__ == "__main__":
    main()