# Specular Highlight Tuning Reference

All declarations live in `DH_P2.53/styles/dashboard.css`.  
The specular system uses a diagonal `linear-gradient(158deg)` masked to a thin perimeter ring via `content-box XOR`. Each tier produces **two non-connecting arcs** — top-left and bottom-right — with a dark gap between them.

**Architecture note:** Summary cards and chart panels have **fully independent** glass surfaces (background, blur, shadow, specular ring width, gradient stops). Editing one does NOT affect the other.

---

## Custom Properties (Global Config)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 60 | `--fc-gr-specular-ring-width: 0.75px` | Dense tier line thickness | ↑ thicker rim ↓ thinner hairline |
| 61 | `--fc-gr-specular-ring-width-card: 1px` | Summary card line thickness | ↑ thicker rim ↓ thinner hairline |
| 62 | `--fc-gr-specular-ring-width-chart: 0.75px` | Chart panel line thickness | ↑ thicker rim ↓ thinner hairline |
| 63 | `--fc-gr-specular-ring-width-pill: 0.75px` | Pill/button line thickness | ↑ thicker rim ↓ thinner hairline |
| 66 | `--fc-gr-specular-duration: 5s` | Dense breathe animation cycle length | ↑ slower pulse ↓ faster pulse |

---

## Breathe Animation (Dense Tier Only)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 183 | `0%,100% { opacity: 0.78 }` | Dense arc minimum brightness | ↑ less visible pulse ↓ stronger fade effect |
| 184 | `50% { opacity: 1 }` | Dense arc peak brightness | ↑ brighter peak (max 1) ↓ dimmer peak |

---

## Tier 2a — Summary Card `.fc-glass::before`
**Applies to:** Summary cards only (`.fc-summary-card`)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 266 | `158deg` | Summary card arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 267 | `0.01) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 268 | `0.15) 4%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 269 | `0.25) 12%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 270 | `0.15) 24%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 271 | `0.01) 28%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 272 | `0.01) 72%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 273 | `0.15) 80%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 274 | `0.25) 88%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 275 | `0.15) 96%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 276 | `0.01) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Ring width:** `--fc-gr-specular-ring-width-card` (line 61, default 1px)  
**Stop % cheat sheet (summary cards):**  
Top-left arc = 4%→28% (24% span). Dark gap = 28%→72% (44%). Bottom-right arc = 72%→96% (24% span).

---

## Tier 2b — Chart Panel Desktop `.fc-chart-panel.fc-glass::before`
**Applies to:** Radar, Bar, Scatter panels (desktop only — mobile override below)

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 345 | `158deg` | Chart panel arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 346 | `0.01) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 347 | `0.15) 4%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 348 | `0.25) 12%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 349 | `0.15) 24%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 350 | `0.01) 28%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 351 | `0.01) 72%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 352 | `0.15) 80%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 353 | `0.25) 88%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 354 | `0.15) 96%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 355 | `0.01) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Ring width:** `--fc-gr-specular-ring-width-chart` (line 62, default 0.75px)  
**Stop % cheat sheet (chart desktop):**  
Top-left arc = 4%→28% (24% span). Dark gap = 28%→72% (44%). Bottom-right arc = 72%→96% (24% span).

---

## Tier 2b — Chart Panel Mobile `@media (max-width: 819px)`
**Applies to:** Radar, Bar, Scatter panels on mobile only

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 379 | `158deg` | Mobile chart arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 380 | `0.01) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 381 | `0.15) 3%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 382 | `0.25) 7%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 383 | `0.15) 12%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 384 | `0.01) 17%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 385 | `0.01) 83%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 386 | `0.15) 88%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 387 | `0.25) 93%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 388 | `0.15) 97%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 389 | `0.01) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Ring width:** Inherits `--fc-gr-specular-ring-width-chart` from desktop rule  
**Stop % cheat sheet (mobile charts):**  
Top-left arc = 3%→17% (14% span). Dark gap = 17%→83% (66%). Bottom-right arc = 83%→97% (14% span).

---

## Tier 1 — Dense Glass `.fc-glass--dense::before`
**Applies to:** Welcome branding panel, app header

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 438 | `158deg` | Dense arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 439 | `0.0) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 440 | `0.6) 3%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 441 | `0.75) 10%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 442 | `0.6) 18%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 443 | `0) 26%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 444 | `0) 74%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 445 | `0.6) 82%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 446 | `0.75) 90%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 447 | `0.6) 97%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 448 | `0.0) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Ring width:** `--fc-gr-specular-ring-width` (line 60, default 0.75px)  
**Stop % cheat sheet (dense):**  
Top-left arc = 3%→26% (23% span). Dark gap = 26%→74% (48%). Bottom-right arc = 74%→97% (23% span).

---

## Tier 3 — Glass Pill `.fc-glass--pill::before`
**Applies to:** Badges, filter buttons, select trigger, scatter legend items

| Line | Declaration | What It Does | Editing |
|------|-------------|--------------|---------|
| 542 | `158deg` | Pill arcs diagonal angle | ↑ toward top/bottom ↓ toward corners |
| 543 | `0.0) 0%` | Top-left arc fade-in start | Fixed at 0% — don't change |
| 544 | `0.45) 5%` | Top-left arc initial brightness | ↑ brighter entry ↓ softer entry |
| 545 | `0.55) 13%` | Top-left arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 546 | `0.45) 21%` | Top-left arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 547 | `0) 30%` | Top-left arc end (→ dark gap starts) | ↑ longer arc ↓ shorter arc |
| 548 | `0) 70%` | Bottom-right arc start (dark gap ends ←) | ↑ shorter arc ↓ longer arc |
| 549 | `0.45) 79%` | Bottom-right arc initial brightness | ↑ brighter entry ↓ softer entry |
| 550 | `0.55) 87%` | Bottom-right arc peak brightness | ↑ brighter peak ↓ dimmer peak |
| 551 | `0.45) 95%` | Bottom-right arc fade-out brightness | ↑ brighter exit ↓ softer exit |
| 552 | `0.0) 100%` | Bottom-right arc end | Fixed at 100% — don't change |

**Ring width:** `--fc-gr-specular-ring-width-pill` (line 63, default 0.75px)  
**Stop % cheat sheet (pill):**  
Top-left arc = 5%→30% (25% span). Dark gap = 30%→70% (40%). Bottom-right arc = 70%→95% (25% span).

---

## Quick Recipes

**Make arcs shorter (less perimeter coverage):**  
Decrease the arc-end stop (e.g. 28→20) AND increase the opposite arc-start stop (e.g. 72→80). Both arcs shrink, gap widens.

**Make arcs brighter without changing length:**  
Increase only the alpha values (the `0.15`/`0.25` numbers) at each stop.

**Disconnect arcs more (bigger dark gap):**  
Move arc-end stops closer to 0% and arc-start stops closer to 100%. Example: 28%→20% and 72%→80%.

**Shift light source direction:**  
Change `158deg`. Lower = more corner-diagonal. Higher = more vertical.
