import subprocess
import re
import urllib.request
import os
from PIL import Image
import io
import time

repo_dir = r"c:\Users\Ulises\Downloads\Puntacana_System\pagina web Punta Cana Investments\web"
dest_dir = os.path.join(repo_dir, 'public', 'images', 'services')
os.makedirs(dest_dir, exist_ok=True)

# 1. Get the file BEFORE the mass reset (commit: 8d3b3b1^1)
old_es_ts = subprocess.check_output(['git', 'show', '8d3b3b1^1:src/dictionaries/es.ts'], cwd=repo_dir).decode('utf-8')

# We are only interested in the `services` items block here.
# Let's extract pairs of (slug or title, image_url)
# Pattern matching object keys around image/img properties
# A more robust way: line by line state machine.
mappings_es = []
current_title = ""

for line in old_es_ts.split('\n'):
    title_match = re.search(r'title:\s*"([^"]+)"', line)
    if title_match:
        current_title = title_match.group(1)
    
    img_match = re.search(r'(?:image|img):\s*"(https://images\.unsplash\.com[^"]+)"', line)
    if img_match and current_title:
        mappings_es.append((current_title, img_match.group(1)))

print(f"Found {len(mappings_es)} unsplash links to recover.")

# Create valid webp filename from title
def sanitize_filename(name):
    # Remove accents
    name = name.lower()
    replacements = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', ' ' : '-'}
    for k, v in replacements.items():
        name = name.replace(k, v)
    name = re.sub(r'[^a-z0-9\-]', '', name)
    # avoid duplicates
    return name

web_paths_by_title = {}

for title, url in mappings_es:
    base_name = sanitize_filename(title)
    filename = f"{base_name}.webp"
    file_path = os.path.join(dest_dir, filename)
    web_path = f"/images/services/{filename}"
    
    web_paths_by_title[title] = web_path
    
    if not os.path.exists(file_path):
        print(f"Downloading {title}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                img_data = response.read()
                with Image.open(io.BytesIO(img_data)) as img:
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    max_width = 1200
                    if img.width > max_width:
                        ratio = max_width / float(img.width)
                        new_height = int(float(img.height) * float(ratio))
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    img.save(file_path, 'WEBP', quality=80, optimize=True)
            time.sleep(1) # avoid rate limits
        except Exception as e:
            print(f"Error downloading {url}: {e}")

# Now inject these back into BOTH es.ts and en.ts
def update_dictionary(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    new_lines = []
    
    # We will look for current title, and if the next few lines have an image, we replace it.
    current_title_for_injection = None
    es_titles_found_in_en_index = 0
    
    # To handle EN dictionary, we need to map EN titles. But how to link es_title to en_title?
    # Because the original structure is identical, we can use the order of matches. 
    # Actually, we can match against the old file to find the English titles!
    if 'en.ts' in filepath:
        old_en_ts = subprocess.check_output(['git', 'show', '8d3b3b1^1:src/dictionaries/en.ts'], cwd=repo_dir).decode('utf-8')
        mappings_en = []
        c_title_en = ""
        for line in old_en_ts.split('\n'):
            tm = re.search(r'title:\s*"([^"]+)"', line)
            if tm: c_title_en = tm.group(1)
            im = re.search(r'(?:image|img):\s*"(https://images\.unsplash\.com[^"]+)"', line)
            if im and c_title_en:
                mappings_en.append((c_title_en, im.group(1))) # English title -> URL
        
        # Build EN title to web_path by mapping URLs
        url_to_webpath = {url: web_paths_by_title[es_t] for es_t, url in mappings_es}
        target_map = {}
        for en_t, url in mappings_en:
            if url in url_to_webpath:
                target_map[en_t] = url_to_webpath[url]
    else:
        target_map = web_paths_by_title
        
    for line in lines:
        t_match = re.search(r'title:\s*"([^"]+)"', line)
        if t_match:
            current_title_for_injection = t_match.group(1)
        
        if re.search(r'(?:image|img):\s*"/images/og-home-luxury\.jpg"', line):
            if current_title_for_injection and current_title_for_injection in target_map:
                new_image_path = target_map[current_title_for_injection]
                # replace /images/og-home-luxury.jpg with new_image_path
                line = re.sub(r'/images/og-home-luxury\.jpg', new_image_path, line)
        
        new_lines.append(line)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
        
update_dictionary(os.path.join(repo_dir, "src/dictionaries/es.ts"))
update_dictionary(os.path.join(repo_dir, "src/dictionaries/en.ts"))
print("Successfully processed and saved all assets to local WebP and updated TS files.")
