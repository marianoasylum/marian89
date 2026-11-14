import subprocess

js = """
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('intro-screen').style.display = 'none';
  const btn = document.querySelector('.btn-split-trigger');
  if (btn) btn.click();
  
  setTimeout(() => {
    const modal = document.getElementById('lightbox-modal');
    const split = document.getElementById('lightbox-split-container');
    const div = document.createElement('div');
    div.id = 'debug-modal';
    div.innerText = 'modal active: ' + modal.classList.contains('active') + ' | split display: ' + window.getComputedStyle(split).display;
    document.body.appendChild(div);
  }, 300);
});
"""

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Fix extra closing div first
h = h.replace('      </div>\n    </div>\n  </div>\n\n  <!-- Scripts -->', '      </div>\n  </div>\n\n  <!-- Scripts -->')

h_test = h.replace('</body>', f'<script>{js}</script></body>')
with open('test_split_check.html', 'w', encoding='utf-8') as f:
    f.write(h_test)

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=C:/Users/maria/Desktop/Portfolio/temp_chrome_profile',
    '--dump-dom',
    '--virtual-time-budget=2000',
    'file:///C:/Users/maria/Desktop/Portfolio/test_split_check.html'
]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
import re
m = re.search(r'<div id="debug-modal">(.*?)</div>', res.stdout)
if m:
    print("STATUS:", m.group(1))
else:
    print("debug-modal not found in DOM")

