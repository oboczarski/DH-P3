import re

# Read JS and strip off the old theme system completely
with open('./DH_P2.53/scripts/DataHub.js', 'r') as f:
    js_content = f.read()

js_content = re.sub(r'// ──────────────────────────────────────────────────────────────────────────\n// DataHub Multi-Theme Switcher System.*', '', js_content, flags=re.DOTALL)

# Add it back properly
js_content += """// ──────────────────────────────────────────────────────────────────────────
// DataHub Multi-Theme Switcher System
// ──────────────────────────────────────────────────────────────────────────
(function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-switcher .theme-btn');
  if (\!themeBtns.length) return;

  const CURRENT_THEME_KEY = 'dh-datahub-theme';
  const savedTheme = localStorage.getItem(CURRENT_THEME_KEY) || 'glass';
  document.body.setAttribute('data-theme', savedTheme);
  
  function updateActiveBtn(activeTheme) {
    themeBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-theme') === activeTheme;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch);
    });
  }

  // Set initial state
  updateActiveBtn(savedTheme);

  // Click handlers
  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedTheme = e.target.getAttribute('data-theme');
      if (\!selectedTheme) return;
      
      // Execute change
      document.body.setAttribute('data-theme', selectedTheme);
      localStorage.setItem(CURRENT_THEME_KEY, selectedTheme);
      updateActiveBtn(selectedTheme);
    });
  });
})();
"""

with open('./DH_P2.53/scripts/DataHub.js', 'w') as f:
    f.write(js_content)


# Read CSS and strip the old theme system completely
with open('./DH_P2.53/styles/DataHub.css', 'r') as f:
    css_content = f.read()

css_content = re.sub(r'/\* ──────────────────────────────────────────────────────────────────────────\n   DataHub Multi-Theme UI System.*', '', css_content, flags=re.DOTALL)

# Let's craft incredible CSS for the themes.

css_content += """/* ──────────────────────────────────────────────────────────────────────────
   DataHub Multi-Theme UI System
───────────────────────────────────────────────────────────────────────────── */

/* == 1. Theme Switcher Buttons == */
.theme-switcher {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  opacity: 0;
  animation: themeFadeIn 0.8s ease 0.4s forwards;
}

@keyframes themeFadeIn { to { opacity: 1; } }

.theme-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.theme-btn::after {
  content: "";
  position: absolute;
  top: -4px; right: -4px; bottom: -4px; left: -4px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.0);
  transition: all 0.3s ease;
  transform: scale(0.8);
}

.theme-btn:hover {
  transform: scale(1.15);
  border-color: rgba(255,255,255,0.4);
}

.theme-btn.is-active {
  transform: scale(1.15);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.4);
}

.theme-btn.is-active::after {
  transform: scale(1);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Button visuals to preview the theme */
.theme-btn[data-theme="glass"] {
  background: linear-gradient(135deg, #102640, #2c5381);
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
}
.theme-btn[data-theme="velvet"] {
  background: linear-gradient(135deg, #380d21, #842646);
  box-shadow: inset 0 1px 3px rgba(255,180,210,0.3);
}
.theme-btn[data-theme="monochrome"] {
  background: #111;
  border: 1px solid #555;
  box-shadow: inset 0 0 0 1px #e5ff00;
}
.theme-btn[data-theme="cyber"] {
  background: #021a10;
  border: 1px solid #00ff88;
  box-shadow: inset 0 0 10px rgba(0,255,136,0.5);
}

@media (max-width: 869px) {
  .app-header__balance .theme-switcher { display: none; }
}


/* == 2. THEME 1: VELVET (Soft, luxurious, plum/magenta, pill shapes, glowing text) == */
[data-theme="velvet"] {
  --page-bg: #11050d;
  --panel-edge: rgba(255, 150, 180, 0.1);
  --panel-inner: rgba(255, 80, 150, 0.05);
  --panel-fill: rgba(36, 12, 26, 0.85);

  --text-primary: #fff2f6;
  --text-secondary: #de9ab4;
  --text-muted: #8a586e;

  --accent-cyan: #ff6b9e; /* repurposed variable name */
  --accent-violet: #ff9166;
}

[data-theme="velvet"] .background-orb--one {
  background: radial-gradient(circle, rgba(160, 20, 70, 0.4) 0%, transparent 65%);
  filter: blur(80px);
}
[data-theme="velvet"] .background-orb--two {
  background: radial-gradient(circle, rgba(230, 80, 40, 0.25) 0%, transparent 65%);
  filter: blur(100px);
}
[data-theme="velvet"] .background-orb--three {
  display: none;
}

[data-theme="velvet"] .glass-panel {
  border-radius: 20px; /* softer pill-like corners */
  border: 1px solid rgba(255, 120, 160, 0.15);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 2px 10px rgba(255, 180, 210, 0.05);
  /* no extra backdrop filter to save performance, just rely on solid gradient */
  background: linear-gradient(160deg, rgba(50, 15, 30, 0.9), rgba(20, 5, 10, 0.95));
}

[data-theme="velvet"] .page-title {
  background: linear-gradient(to right, #ffb3c6, #ffdfb3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 100, 150, 0.3);
}

[data-theme="velvet"] .page-tab {
  border-radius: 12px;
}
[data-theme="velvet"] .page-tab.is-active,
[data-theme="velvet"] .top-tab.is-active,
[data-theme="velvet"] .category-chip.is-active {
  color: #ffb3c6;
  background: rgba(255, 50, 120, 0.1);
  border-color: rgba(255, 80, 150, 0.25);
  box-shadow: 0 0 15px rgba(255, 50, 120, 0.1);
}

[data-theme="velvet"] .page-tab.is-active::after {
  height: 3px;
  background: linear-gradient(90deg, transparent, #ff4d8d, transparent);
  box-shadow: 0 -2px 10px rgba(255, 77, 141, 1);
  border-radius: 4px;
}


/* == 3. THEME 2: MONOCHROME (Brutalism, sharp edges, dark gray, acid yellow accents) == */
[data-theme="monochrome"] {
  --page-bg: #090909;
  --panel-edge: #2a2a2a;
  --panel-inner: transparent;
  --panel-fill: #111111;

  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #555555;

  --accent-cyan: #e5ff00; /* acid yellow */
  --accent-violet: #ffffff;
}

[data-theme="monochrome"] .background-orb {
  display: none; /* remove all soft glowing orbs */
}

[data-theme="monochrome"] .app-shell::before {
  /* High contrast mesh grid */
  content: "";
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(#151515 1px, transparent 1px), 
    linear-gradient(90deg, #151515 1px, transparent 1px);
  background-size: 32px 32px;
  background-color: #090909;
  z-index: -10;
  pointer-events: none;
}

[data-theme="monochrome"] .glass-panel {
  border-radius: 0px; /* brutally sharp */
  border: 1px solid #333;
  box-shadow: 6px 6px 0px rgba(229, 255, 0, 0.08); /* hard offset shadow */
  background: #111111;
  backdrop-filter: none;
}

[data-theme="monochrome"] .page-title {
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 900;
  font-style: italic;
}

[data-theme="monochrome"] .category-row {
  gap: 16px;
}

[data-theme="monochrome"] .page-tab,
[data-theme="monochrome"] .top-tab,
[data-theme="monochrome"] .category-chip {
  border-radius: 0px;
  border: 1px solid #222;
  transition: all 0.1s ease;
}

[data-theme="monochrome"] .page-tab.is-active,
[data-theme="monochrome"] .top-tab.is-active,
[data-theme="monochrome"] .category-chip.is-active {
  background: #e5ff00;
  color: #000;
  border-color: #e5ff00;
  font-weight: 700;
  box-shadow: 3px 3px 0px #333;
  transform: translate(-1px, -1px);
  text-shadow: none;
}

[data-theme="monochrome"] .page-tab.is-active::after,
[data-theme="monochrome"] .category-chip.is-active .category-chip__meta {
  display: none; /* Acid flat color is enough hierarchy */
}

[data-theme="monochrome"] .search-shell {
  border-radius: 0;
  border: 1px solid #444;
  background: #000;
}
[data-theme="monochrome"] .grid-shell__meta {
  border-bottom: 2px dashed #222;
}
[data-theme="monochrome"] .stats-table__head-button {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
}


/* == 4. THEME 3: CYBER (Dark matrix/hack vibe, dark teal bg, intense green/cyan glows) == */
[data-theme="cyber"] {
  --page-bg: #010806;
  --panel-edge: rgba(0, 255, 170, 0.4);
  --panel-inner: rgba(0, 200, 150, 0.1);
  --panel-fill: rgba(2, 18, 12, 0.85);

  --text-primary: #e0fff3;
  --text-secondary: #00cc88;
  --text-muted: #1c553d;

  --accent-cyan: #00ffaa;
  --accent-violet: #00ffff;
}

[data-theme="cyber"] .background-orb--one {
  background: radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 60%);
}
[data-theme="cyber"] .background-orb--two,
[data-theme="cyber"] .background-orb--three {
  display: none;
}

[data-theme="cyber"] .glass-panel {
  border-radius: 4px;
  background: rgba(3, 14, 10, 0.95);
  border: 1px solid rgba(0, 255, 170, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 170, 0.05), inset 0 0 20px rgba(0, 255, 170, 0.08);
}
[data-theme="cyber"] .glass-panel::before {
  /* matrix scanline texture over all panels */
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 170, 0.04) 3px, rgba(0, 255, 170, 0.04) 4px);
  pointer-events: none;
  z-index: -1;
}

[data-theme="cyber"] .brand-lockup__name {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
[data-theme="cyber"] .brand-lockup__accent {
  color: #00ffaa;
  text-shadow: 0 0 15px rgba(0, 255, 170, 0.8);
}

[data-theme="cyber"] .page-title {
  color: #00ffaa;
  text-shadow: 0 0 12px rgba(0, 255, 170, 0.6);
  font-family: monospace, 'Courier New';
  letter-spacing: -0.5px;
}

[data-theme="cyber"] .page-tabs {
  border-bottom: 1px solid rgba(0, 255, 170, 0.2);
}
[data-theme="cyber"] .page-tab.is-active,
[data-theme="cyber"] .top-tab.is-active,
[data-theme="cyber"] .category-chip.is-active {
  background: rgba(0, 255, 170, 0.1);
  border-color: #00ffaa;
  color: #00ffaa;
  box-shadow: 0 0 10px rgba(0, 255, 170, 0.2), inset 0 0 8px rgba(0, 255, 170, 0.2);
  border-radius: 4px;
}
[data-theme="cyber"] .page-tab.is-active::after {
  background: #00ffaa;
  box-shadow: 0 -2px 15px #00ffaa;
}

[data-theme="cyber"] .table-pane--frozen,
[data-theme="cyber"] .search-shell {
  background: rgba(0, 10, 8, 0.95);
  border-right: 1px solid rgba(0, 255, 170, 0.3);
}

[data-theme="cyber"] .stats-table__head-button {
  color: #00cc88;
}
[data-theme="cyber"] .stats-table tbody tr.is-hovered .stats-table__body-cell,
[data-theme="cyber"] .stats-table tbody tr:hover .stats-table__body-cell {
  background-color: rgba(0, 255, 170, 0.08) \!important;
}

"""

with open('./DH_P2.53/styles/DataHub.css', 'w') as f:
    f.write(css_content)
