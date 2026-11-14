import subprocess

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Hide intro immediately via inline style
h = h.replace('id="intro-screen"', 'id="intro-screen" style="display: none !important;"')

test_cases = [
    ('dog_chow', 0),
    ('refugio', 1),
    ('anime', 2),
    ('morello', 3)
]

for name, idx in test_cases:
    test_js = f'''
    <script>
      window.addEventListener('DOMContentLoaded', () => {{
        const btns = document.querySelectorAll('.btn-split-trigger');
        if (btns.length > {idx}) {{
          btns[{idx}].click();
        }}
      }});
    </script>
    '''
    h_test = h.replace('</body>', test_js + '</body>')
    with open(f'test_view_{name}.html', 'w', encoding='utf-8') as f:
        f.write(h_test)

    cmd = [
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--user-data-dir=C:/Users/maria/Desktop/Portfolio/temp_chrome_profile',
        f'--screenshot=C:/Users/maria/Desktop/Portfolio/shot_{name}.png',
        '--window-size=1440,950',
        '--virtual-time-budget=2000',
        f'file:///C:/Users/maria/Desktop/Portfolio/test_view_{name}.html'
    ]
    subprocess.run(cmd, capture_output=True)
    print(f"Captured {name} split view")

