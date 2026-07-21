#!/usr/bin/env python3
"""OG card for /btl-3. Same visual language as the site — dark ground, gold
accent, serif wordmark, mono labels. Run it from the repo root with a Pillow
that actually exists (the old generate-og-image.py assumed Windows fonts):

    python3 -m venv /tmp/ogvenv && /tmp/ogvenv/bin/pip install Pillow
    /tmp/ogvenv/bin/python scripts/generate-btl3-og.py
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = "#0E0D0C"
FG = "#FAFAF9"
GRAY = "#9C9890"
GOLD = "#C6771F"          # a hair brighter than the site --gold so it reads on black
HAIR = "#2A2724"

# macOS system faces standing in for EB Garamond / JetBrains Mono. if you run this
# somewhere else, point these at whatever serif + mono you have.
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF_I = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
MONO = "/System/Library/Fonts/Menlo.ttc"


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def spaced(s, gap=" "):
    # PIL has no letter-spacing. cheap eyebrow tracking: shove spaces between chars.
    return gap.join(list(s))


def orbital(draw, cx, cy, s=1.0, color=FG, w=2):
    rx, ry = 42 * s, 23 * s
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=color, width=w)
    rx2, ry2 = 31 * s, 42 * s
    draw.ellipse([cx - rx2, cy - ry2, cx + rx2, cy + ry2], outline=color, width=w)
    r = 6 * s
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)


def build(out="public/btl-3-og.png"):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    pad = 84

    # subtle gold wash bottom-right so the flat black isn't dead
    glow = Image.new("RGB", (W, H), BG)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W - 520, H - 360, W + 260, H + 360], fill="#1A1108")
    img = Image.blend(img, glow, 0.55)
    d = ImageDraw.Draw(img)

    # top row: mark + wordmark (left), license tag (right)
    orbital(d, pad + 20, pad + 6, s=0.62, color=FG, w=2)
    d.text((pad + 58, pad - 8), spaced("BAD THEORY LABS"), font=font(MONO, 17), fill=GRAY)
    tag = spaced("OPEN WEIGHTS · APACHE-2.0")
    d.text((W - pad, pad - 6), tag, font=font(MONO, 15), fill=GRAY, anchor="ra")

    # gold accent tick, then the wordmark
    d.rectangle([pad, 232, pad + 44, 238], fill=GOLD)
    d.text((pad - 4, 250), "BTL", font=font(SERIF, 170), fill=FG)
    btl_w = d.textlength("BTL", font=font(SERIF, 170))
    d.text((pad - 4 + btl_w, 250), "-3", font=font(SERIF, 170), fill=GOLD)

    # subtitle, two lines, italic serif
    d.text((pad, 452),
           "A 27B agentic coding & tool-use model — plus its complete",
           font=font(SERIF_I, 31), fill="#CFCBC4")
    d.text((pad, 494),
           "8.39 GB native Compact edition that runs the whole thing locally.",
           font=font(SERIF_I, 31), fill="#CFCBC4")

    # stat rail along the bottom
    d.line([pad, 566, W - pad, 566], fill=HAIR, width=1)
    stats = [("95.1%", "HumanEval"), ("88.5%", "BFCL v4 AST"), ("43 tok/s", "Compact")]
    x = pad
    for i, (v, k) in enumerate(stats):
        if i:
            d.line([x - 30, 582, x - 30, 606], fill=HAIR, width=1)
        d.text((x, 584), v, font=font(SERIF_B, 34), fill=FG)
        vw = d.textlength(v, font=font(SERIF_B, 34))
        d.text((x + vw + 12, 596), k, font=font(MONO, 15), fill=GRAY)
        x += vw + 12 + d.textlength(k, font=font(MONO, 15)) + 60

    img.save(out, "PNG")
    print("wrote", out)


if __name__ == "__main__":
    build()
