:root {
  --surface: rgb(5, 6, 11);
  --surface-2: rgb(8, 10, 17);
  --stroke-soft: rgba(255, 255, 255, 0.08);
  --stroke-faint: rgba(255, 255, 255, 0.04);
  --text: rgba(255, 255, 255, 0.96);
  --text-2: rgba(255, 255, 255, 0.62);
  --text-3: rgba(255, 255, 255, 0.44);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  background: var(--surface);
  color: var(--text);
  font-family:
    "Product Sans",
    "Google Sans",
    sans-serif;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 14px;
  background: var(--surface);
}

.widget-card {
  width: 360px;
  max-width: 375px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
}

.widget-header {
  padding: 10px 16px 4px;
  border-bottom: 0px solid rgba(255, 255, 255, 0.08);
}

.widget-header h2 {
  margin: 0;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  word-spacing: 0.12em;
}

.widget-header p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.35;
  color: var(--text-2);
}

.widget-body {
  padding: 0px 5px 8px 7px;
}

.chart-shell {
  position: relative;
  height: 302px;
  background: var(--surface);
  border-radius: 22px;
  padding: 2px 2px 2px 7px;
}

.chart {
  width: 100%;
  height: 100%;
}

.axis-title {
  position: absolute;
  pointer-events: none;
  font-size: 14px;
  line-height: 1;
  font-weight: 300;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.84);
  user-select: none;
}

.axis-title-x {
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
}

.axis-title-y {
  left: 4px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: left center;
}

.chips-row {
  margin-top: 8px;
  padding-inline: 2px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2px;
}

.stat-chip {
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;
  padding: 8px 5px 7px 8px;
  box-shadow:
    0 14px 38px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 0 0 1px rgba(255, 255, 255, 0.02);
}

.stat-chip::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: var(--chip-line);
}

.stat-chip-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 4px;
  min-width: 0;
}

.stat-dot {
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: var(--chip-dot);
  flex: 0 0 auto;
  margin-bottom: 2px;
}

.stat-label {
  min-width: 0;
  font-size: 15px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
}

.stat-chip-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.stat-count {
  font-size: 24px;
  line-height: 0.95;
  font-weight: 300;
  color: var(--text);
}

.stat-meta {
  text-align: right;
  line-height: 1;
  flex: 0 0 auto;
}

.stat-sub {
  display: block;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
}

.stat-pct {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 999px;
}
