import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add go-back buttons
replacements = [
    (r'(<section id="page-gift" class="page hidden scrollable">)', r'\1\n        <button class="go-back-btn" id="back-from-gift">&larr; Back</button>'),
    (r'(<section id="page-gallery" class="page hidden scrollable">)', r'\1\n        <button class="go-back-btn" id="back-from-gallery">&larr; Back</button>'),
    (r'(<section id="page-letter" class="page hidden scrollable">)', r'\1\n        <button class="go-back-btn" id="back-from-letter">&larr; Back</button>'),
    (r'(<section id="page-reasons" class="page hidden">)', r'\1\n        <button class="go-back-btn" id="back-from-reasons">&larr; Back</button>'),
    (r'(<section id="page-music" class="page hidden">)', r'\1\n        <button class="go-back-btn" id="back-from-music">&larr; Back</button>'),
    (r'(<section id="page-heart" class="page hidden">)', r'\1\n        <button class="go-back-btn" id="back-from-heart">&larr; Back</button>')
]

for old, new in replacements:
    html = re.sub(old, new, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

back_logic = """
// --- Go Back Logic ---
document.getElementById('back-from-gift').addEventListener('click', () => { transitionToPage(pages.gift, pages.landing); });
document.getElementById('back-from-gallery').addEventListener('click', () => { transitionToPage(pages.gallery, pages.gift); });
document.getElementById('back-from-letter').addEventListener('click', () => { transitionToPage(pages.letter, pages.gallery, initGalleryAnimations); });
document.getElementById('back-from-reasons').addEventListener('click', () => { transitionToPage(pages.reasons, pages.letter); });
document.getElementById('back-from-music').addEventListener('click', () => { transitionToPage(pages.music, pages.reasons); });
document.getElementById('back-from-heart').addEventListener('click', () => { transitionToPage(pages.heart, pages.music); });
"""
js += "\n" + back_logic

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 3. Update styles.css
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

back_css = """
.go-back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.6);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: var(--clr-text);
    font-family: var(--font-body);
    font-size: 0.9rem;
    cursor: pointer;
    backdrop-filter: blur(5px);
    transition: all 0.3s;
    z-index: 50;
}
.go-back-btn:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
}
"""
css += "\n" + back_css

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated HTML, JS, and CSS for back buttons.")
