import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

matches = re.findall(r'<button[^>]*class="[^"]*btn-split-trigger[^"]*"[^>]*>', html)
for i, m in enumerate(matches):
    print(f"Trigger {i}:")
    print(m)
    print()

# Also let's check lightbox-split-container in index.html
start = html.find('id="lightbox-split-container"')
if start != -1:
    print("Found container at", start)
    print(html[start:start+1200])

