import os
from PIL import Image

output_dir = r"e:\Grass Station Dispensary"
input_dir = r"C:\Users\aj\.gemini\antigravity\brain\d50492d7-5b27-4db0-94a0-562b7237f3dd"
click_dir = os.path.join(input_dir, ".system_generated", "click_feedback")

def crop_center(in_path, out_path, crop_box):
    if not os.path.exists(in_path): 
        print(f"Missing: {in_path}")
        return
    img = Image.open(in_path).convert("RGB")
    c = img.crop(crop_box)
    c.save(out_path)
    print(f"Saved {out_path}")

# Image 1: The Facebook Cover Photo -> Hero
cover_path = os.path.join(input_dir, "facebook_main_page_1776451130110.png")
# Crop just the top portion to minimize profile pic overlap, or just embrace it
crop_center(cover_path, os.path.join(output_dir, "hero_v2.png"), (350, 60, 1570, 420))

# Image 2: Store Interior (Customer standing inside) -> About Section
interior_path = os.path.join(click_dir, "click_feedback_1776451402673.png")
crop_center(interior_path, os.path.join(output_dir, "store_interior.png"), (450, 60, 1470, 825))

print("Done cropping images.")
