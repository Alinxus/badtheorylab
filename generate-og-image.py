#!/usr/bin/env python3
"""Generate OG image based on BTL logo design."""

from PIL import Image, ImageDraw, ImageFont
import math

# OG Image standard size for social media
WIDTH = 1200
HEIGHT = 630

# Colors from the logo
DARK_BG = "#0E0D0C"
LIGHT_BG = "#FAFAF9"
ACCENT_DARK = "#0E0D0C"
ACCENT_LIGHT = "#FAFAF9"
ACCENT_GRAY = "#9C9890"

def draw_orbital_mark(draw, center_x, center_y, scale=1.0, color=ACCENT_LIGHT, width=2):
    """Draw the orbital mark (two ellipses and circles)."""
    rx = 80 * scale
    ry = 44 * scale
    
    # First ellipse
    draw.ellipse(
        [center_x - rx, center_y - ry, center_x + rx, center_y + ry],
        outline=color,
        width=width
    )
    
    # Rotated ellipse (approximate 65 degree rotation by drawing another ellipse)
    # For simplicity, draw a second ellipse at a slight offset
    rx2 = 60 * scale
    ry2 = 80 * scale
    draw.ellipse(
        [center_x - rx2, center_y - ry2, center_x + rx2, center_y + ry2],
        outline=color,
        width=width
    )
    
    # Center circle
    r = 12 * scale
    draw.ellipse(
        [center_x - r, center_y - r, center_x + r, center_y + r],
        fill=color
    )
    
    # Outer circle
    r2 = 8 * scale
    x_outer = center_x + rx - 20
    draw.ellipse(
        [x_outer - r2, center_y - r2, x_outer + r2, center_y + r2],
        fill=color
    )

def generate_og_image(output_path="public/og-image.png"):
    """Generate OG image with BTL branding."""
    # Create image with dark background
    img = Image.new("RGB", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(img)
    
    # Draw orbital mark on the left side
    mark_x = 150
    mark_y = HEIGHT // 2
    draw_orbital_mark(draw, mark_x, mark_y, scale=1.5, color=ACCENT_LIGHT, width=3)
    
    # Add text
    try:
        # Try to use a nice serif font for "Bad Theory"
        title_font = ImageFont.truetype("C:\\Windows\\Fonts\\georgia.ttf", 120)
        subtitle_font = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 48)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Title
    title = "Bad Theory"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = WIDTH // 2 - title_width // 2 + 100
    title_y = HEIGHT // 2 - 80
    draw.text((title_x, title_y), title, fill=ACCENT_LIGHT, font=title_font)
    
    # Subtitle
    subtitle = "Labs"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = WIDTH // 2 - subtitle_width // 2 + 100
    subtitle_y = HEIGHT // 2 + 60
    draw.text((subtitle_x, subtitle_y), subtitle, fill=ACCENT_GRAY, font=subtitle_font)
    
    # Save the image
    img.save(output_path, "PNG", quality=95)
    print(f"✓ OG image generated: {output_path}")

if __name__ == "__main__":
    generate_og_image()
