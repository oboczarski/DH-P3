const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'DH_P2.53/styles/DataHub.css');

let cssContent = fs.readFileSync(cssPath, 'utf-8');

const newRootBlock = `:root {
  /* Default Theme: Cyber Glass */
  --font-sans: "Product Sans", "Google Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --page-bg: #050b13;
  --panel-edge: rgba(255, 255, 255, 0.16);
  --panel-inner: rgba(255, 255, 255, 0.06);
  --panel-fill: rgba(10, 18, 30, 0.5);
  --panel-fill-strong: rgba(12, 20, 34, 0.68);
  --text-primary: rgba(240, 246, 255, 0.96);
  --text-secondary: rgba(189, 206, 232, 0.72);
  --text-muted: rgba(167, 180, 205, 0.54);
  --accent-primary: #66d7ff; /* cyan */
  --accent-secondary: #ff62c3; /* magenta */
  --shadow-soft: 10px 30px 20px rgba(0, 0, 0, 0.28);
  --shadow-glass: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 8px 32px rgba(0, 0, 0, 0.4);
  --orb-opacity: 0.28;
  --glass-blur: 4px;
  
  --desktop-header-side-width: clamp(144px, 16vw, 272px);
  --table-panel-height-default: clamp(500px, 62vh, 900px);
  --table-panel-height-mobile: clamp(420px, 55vh, 700px);
  --table-panel-height-wide: clamp(620px, 72vh, 940px);
  --table-group-header-height: 36px;
  --table-group-header-height-mobile: 26px;
  
  /* Fallbacks for older references if needed */
  --accent-cyan: var(--accent-primary);
  --accent-violet: #a27fff;
  --accent-magenta: var(--accent-secondary);
  --accent-warm: #ffb066;
  --success-glow: rgba(113, 225, 199, 0.34);
}

[data-theme="obsidian"] {
  /* Theme 2: Obsidian Brutalism */
  --page-bg: #000000;
  --panel-edge: #2E2E2E;
  --panel-inner: #141414;
  --panel-fill: #0D0D0D;
  --panel-fill-strong: #1A1A1A;
  --text-primary: #FFFFFF;
  --text-secondary: #A3A3A3;
  --text-muted: #666666;
  --accent-primary: #FF4500; /* blaze orange */
  --accent-secondary: #FFFFFF;
  --accent-cyan: var(--accent-primary);
  --accent-violet: #FF5A00;
  --accent-magenta: var(--accent-secondary);
  --accent-warm: var(--accent-primary);
  --shadow-soft: none;
  --shadow-glass: inset 0 1px 0 rgba(255,255,255,0.05), 8px 8px 0px rgba(255, 69, 0, 0.15);
  --orb-opacity: 0; /* Orbs hidden */
  --glass-blur: 0px; 
}

[data-theme="velvet"] {
  /* Theme 3: Midnight Velvet (Luxury) */
  --page-bg: #14050D;
  --panel-edge: rgba(230, 168, 140, 0.25);
  --panel-inner: rgba(230, 168, 140, 0.05);
  --panel-fill: rgba(36, 12, 24, 0.7);
  --panel-fill-strong: rgba(54, 18, 36, 0.85);
  --text-primary: #FFF0F5;
  --text-secondary: #E3C5D1;
  --text-muted: #A37F91;
  --accent-primary: #E6A88C; /* rose gold */
  --accent-secondary: #FF6B9E; /* soft blush */
  --accent-cyan: var(--accent-primary);
  --accent-violet: #D48C6F;
  --accent-magenta: var(--accent-secondary);
  --accent-warm: var(--accent-primary);
  --shadow-soft: 0 20px 40px rgba(0, 0, 0, 0.5);
  --shadow-glass: inset 0 1px 1px rgba(230, 168, 140, 0.3);
  --orb-opacity: 0.15;
  --glass-blur: 8px;
}

[data-theme="tactical"] {
  /* Theme 4: Tactical Terminal */
  --page-bg: #080A08;
  --panel-edge: rgba(57, 255, 20, 0.4);
  --panel-inner: rgba(57, 255, 20, 0.05);
  --panel-fill: #0B0E0B;
  --panel-fill-strong: #101510;
  --text-primary: #D4F1D4;
  --text-secondary: #8AB88A;
  --text-muted: #4A634A;
  --accent-primary: #39FF14; /* neon green */
  --accent-secondary: #00FFFF; /* sharp cyan */
  --accent-cyan: var(--accent-primary);
  --accent-violet: #2ECC11;
  --accent-magenta: var(--accent-secondary);
  --accent-warm: var(--accent-primary);
  --shadow-soft: 0 0 15px rgba(57, 255, 20, 0.08);
  --shadow-glass: inset 0 0 8px rgba(57, 255, 20, 0.1);
  --orb-opacity: 0; /* Orbs hidden */
  --glass-blur: 0px;
}

/* Theme Switcher Island */
.theme-switcher-island {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  padding: 8px;
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 30px;
  z-index: 1000;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.theme-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  padding: 0;
  outline: none;
}
.theme-btn:hover { transform: scale(1.15); border-color: rgba(255,255,255,0.6); }
.theme-btn.is-active { border-color: #FFF; box-shadow: 0 0 8px rgba(255,255,255,0.8); transform: scale(1.1); }

/* Switcher Colors */
.theme-btn--cyber { background: linear-gradient(135deg, #66d7ff, #a27fff); }
.theme-btn--obsidian { background: #FF4500; }
.theme-btn--velvet { background: linear-gradient(135deg, #E6A88C, #FF6B9E); }
.theme-btn--tactical { background: #39FF14; }
`;

// Replace :root block
cssContent = cssContent.replace(
  /^:root\s*\{[\s\S]*?\n\}/m,
  newRootBlock
);

fs.writeFileSync(cssPath, cssContent, 'utf-8');
