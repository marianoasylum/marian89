import subprocess

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = h.replace('id="intro-screen"', 'id="intro-screen" style="display: none !important;"')

test_js = '''
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Find the first btn-split-trigger and click it
      const btn = document.querySelector('.btn-split-trigger');
      if (btn) {
        console.log("Found button, clicking:", btn);
        btn.click();
      } else {
        console.log("Button not found!");
      }
    }, 600);
  });
</script>
'''

h_test = h.replace('</body>', test_js + '</body>')
with open('test_split_render.html', 'w', encoding='utf-8') as f:
    f.write(h_test)

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=C:/Users/maria/Desktop/Portfolio/temp_chrome_profile',
    '--screenshot=C:/Users/maria/Desktop/Portfolio/shot_split_modal.png',
    '--window-size=1440,900',
    '--virtual-time-budget=3000',
    'file:///C:/Users/maria/Desktop/Portfolio/test_split_render.html'
]
subprocess.run(cmd, capture_output=True)
print("Captured!")
