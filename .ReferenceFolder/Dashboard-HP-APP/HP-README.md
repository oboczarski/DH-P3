# Fantasy Command (Vanilla)

A glassy, single-page Fantasy Football dashboard rebuilt in plain HTML, Custom CSS, and vanilla JavaScript + D3. No frameworks or build tooling required.

## Quick Start

```bash
# from repo root
python -m http.server 3000
# then open http://localhost:3000
```

Everything is static: sample data ships inside `HP-app.js`, charts are rendered with D3, and styles are fully defined in `HP-styles.css`.

## Files
- `HP-index.html` – page layout and D3 includes
- `HP-app.js` – data, state, rendering logic, charts, interactions
- `HP-styles.css` – complete custom styling, glassmorphism, and responsive layout

## Notes
- Player selector updates the radar and rating in real time.
- Bar chart can be filtered by position (All/WR/RB/QB/TE).
- No build step or dependencies are needed; feel free to swap the sample data with your own.
