from PIL import Image, ImageEnhance
import os

img_path = r'c:\Users\Ulises\Downloads\Puntacana_System\pagina web Punta Cana Investments\web\public\images\services\ingenieria-electrica.webp'

try:
    with Image.open(img_path) as img:
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Increase brightness by 40%
        enhancer = ImageEnhance.Brightness(img)
        brightened_img = enhancer.enhance(1.4)
        
        # Save back to the same path
        brightened_img.save(img_path, 'WEBP', quality=85, optimize=True)
        print("Image brightened successfully.")
except Exception as e:
    print(f"Failed to brighten image: {e}")
