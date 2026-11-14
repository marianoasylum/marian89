import subprocess, os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Hide intro and other sections, show only photoshop section
content = content.replace('id="intro-screen"', 'id="intro-screen" style="display:none!important"')
# Hide hero section
content = content.replace('id="hero"', 'id="hero" style="display:none!important"')

with open('test_featured.html', 'w', encoding='utf-8') as f:
    f.write(content)

url = 'file:///C:/Users/maria/Desktop/Portfolio/test_featured.html'
out = os.path.abspath('shot_featured.png')
profile = os.path.abspath('temp_chrome_profile2')

if os.path.exists(out):
    os.remove(out)

result = subprocess.run([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1400,1100',
    '--screenshot=' + out,
    '--user-data-dir=' + profile,
    '--virtual-time-budget=5000',
    '--run-all-compositor-stages-before-draw',
    url
], capture_output=True, text=True, timeout=20)

print('exists:', os.path.exists(out))
if os.path.exists(out):
    print('size:', os.path.getsize(out))
