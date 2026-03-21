# Specular Highlight Tuning Reference

All declarations live in `DH_P2.53/styles/dashboard.css`.  
The specular system uses a diagonal `linear-gradient(158deg)` masked to a thin perimeter ring via `content-box XOR`. Each tier produces **two non-connecting arcs** — top-left and bottom-right — with a dark gap between them.

---

## Custom Properties (Global Config)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 57 | `--fc-gr-specular-ring-width: 1px` | Dense tier line thickness | ↑ thicker rim ↓ thinner hairline |
| 58 | `--fc-gr-specular-ring-width-card: 1px` | Card + chart panel line thickness | ↑ thicker rim ↓ thinner hairline |
| 59 | `--fc-gr-specular-ring-width-pill: 0.75px` | Pill/button line thickness | ↑ thicker rim ↓ thinner hairline |
| 62 | `--fc-gr-specular-duration: 5s` | Dense breathe animation cycle length | ↑ slower pulse ↓ faster pulse |

---

## Breathe Animation (Dense Tier Only)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 180 | `0%,100% { opacity: 0.78 }` | Dense arc minimum brightness | ↑ less visible pulse ↓ stronger fade effect |
| 181 | `50% { opacity: 1 }` | Dense arc peak brightness | ↑ brighter peak (max 1) ↓ dimmer peak |

---

## Tier 2 — Glass Card `.fc-glass::before`
**Applies to:** Summary cards, chart panels (desktop)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 258 | `158deg` | All card arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 259 | `0.0) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 260 | `0.55) 4%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 261 | `0.65) 12%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 262 | `0.55) 20%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 263 | `0) 28%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 264 | `0) 72%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 265 | `0.55) 80%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 266 | `0.65) 88%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 267 | `0.55) 96%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 268 | `0.0) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Stop % cheat sheet (card):**  
Top-left arc = 4%→28% (24% span). Dark gap = 28%→72% (44%). Bottom-right arc = 72%→96% (24% span).

---

## Mobile Chart Panel Override `@media (max-width: 819px)`
**Applies to:** Radar, Bar, Scatter panels on mobile only

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 338 | `158deg` | Mobile chart arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 339 | `0.0) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 340 | `0.5) 3%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 341 | `0.6) 7%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 342 | `0.5) 12%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 343 | `0) 17%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 344 | `0) 83%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 345 | `0.5) 88%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 346 | `0.6) 93%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 347 | `0.5) 97%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 348 | `0.0) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Stop % cheat sheet (mobile charts):**  
Top-left arc = 3%→17% (14% span). Dark gap = 17%→83% (66%). Bottom-right arc = 83%→97% (14% span).

---

## Tier 1 — Dense Glass `.fc-glass--dense::before`
**Applies to:** Welcome branding panel (header)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 392 | `158deg` | Dense arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 393 | `0.0) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 394 | `0.6) 3%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 395 | `0.75) 10%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 396 | `0.6) 18%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 397 | `0) 26%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 398 | `0) 74%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 399 | `0.6) 82%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 400 | `0.75) 90%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 401 | `0.6) 97%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 402 | `0.0) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Stop % cheat sheet (dense):**  
Top-left arc = 3%→26% (23% span). Dark gap = 26%→74% (48%). Bottom-right arc = 74%→97% (23% span).

---

## Tier 3 — Glass Pill `.fc-glass--pill::before`
**Applies to:** Badges, filter buttons, select trigger, scatter legend items

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 503 | `158deg` | Pill arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 504 | `0.0) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 505 | `0.45) 5%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 506 | `0.55) 13%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 507 | `0.45) 21%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 508 | `0) 30%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 509 | `0) 70%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 510 | `0.45) 79%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 511 | `0.55) 87%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 512 | `0.45) 95%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 513 | `0.0) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Stop % cheat sheet (pill):**  
Top-left arc = 5%→30% (25% span). Dark gap = 30%→70% (40%). Bottom-right arc = 70%→95% (25% span).

---

## Quick Recipes

**Make arcs shorter (less perimeter coverage):**  
Decrease the arc-end stop (e.g. 28→20) AND increase the opposite arc-start stop (e.g. 72→80). Both arcs shrink, gap widens.

**Make arcs brighter without changing length:**  
Increase only the alpha values (the `0.55`/`0.65` numbers) at each stop.

**Disconnect arcs more (bigger dark gap):**  
Move arc-end stops closer to 0% and arc-start stops closer to 100%. Example: 28%→20% and 72%→80%.

**Shift light source direction:**  
Change `158deg`. Lower = more corner-diagonal. Higher = more vertical.
