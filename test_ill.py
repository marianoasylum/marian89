import subprocess

js = """
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('intro-screen').style.display = 'none';
  const btns = document.querySelectorAll('.btn-split-trigger');
  // btns[2] is Illustrator 1
  if (btns.length > 2) btns[2].click();
});
"""

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

h_test = h.replace('</body>', f'<script>{js}</script></body>')
with open('test_split_ill.html', 'w', encoding='utf-8') as f:
    f.write(h_test)

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=C:/Users/maria/Desktop/Portfolio/temp_chrome_profile',
    '--screenshot=C:/Users/maria/Desktop/Portfolio/shot_split_ill.png',
    '--window-size=1440,950',
    '--virtual-time-budget=2000',
    'file:///C:/Users/maria/Desktop/Portfolio/test_split_ill.html'
]
subprocess.run(cmd, capture_output=True)
print("Illustrator split modal screenshot captured!")

