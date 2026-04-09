from PIL import Image
import os

source_path = r'C:\Users\Ulises\.gemini\antigravity\brain\479d0193-696e-4ef7-a39f-1640c14a60ae\media__1775711820657.jpg'
dest_dir = r'c:\Users\Ulises\Downloads\Puntacana_System\pagina web Punta Cana Investments\web\public\images\investments'
dest_path = os.path.join(dest_dir, 'rent-pool-condo-hotel.webp')

os.makedirs(dest_dir, exist_ok=True)

with Image.open(source_path) as img:
    if img.mode != 'RGB':
        img = img.convert('RGB')
    max_width = 1200
    if img.width > max_width:
        ratio = max_width / float(img.width)
        new_height = int(float(img.height) * float(ratio))
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
    
    img.save(dest_path, 'WEBP', quality=80, optimize=True)

print(f"Image optimized and saved to: {dest_path}")
