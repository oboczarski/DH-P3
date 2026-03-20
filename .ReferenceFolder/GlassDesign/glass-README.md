# glass-refraction — CSS-Only Reference for Implementation

This version of the README is written specifically for **CSS-only / vanilla HTML/CSS/JS usage**.

It is intended as the implementation reference for integrating the glass system into an existing app without React components.

---

## Overview

`glass-refraction` is a liquid-glass design system built around three layers:

1. **glass surface** — translucent fill + blur/saturation
2. **specular highlight** — bright reflective highlight on the glass surface
3. **chromatic / edge treatment** — subtle color separation and edge tinting

The three base tiers are:

| Class | Use case | Effect |
|---|---|---|
| `.glass` | dense shell surfaces such as navbars, footers, hero overlays | denser frosted glass, stronger depth, rim/perimeter specular highlight, chromatic edge treatment |
| `.glass-card` | cards, panels, content containers | medium-density glass, rim/perimeter specular highlight, chromatic edge treatment |
| `.glass-pill` | pills, chips, tags, inline controls | lightweight glass, smaller rim/perimeter highlight |

---

## Important implementation notes

### 1) This CSS-only setup does **not** use React components

Ignore the React component usage when implementing into a vanilla app.

The relevant parts for CSS-only usage are:
- importing or copying the CSS
- adding the glass classes in HTML
- optionally injecting the hidden SVG filter defs in HTML once
- optionally applying the SVG refraction through CSS on the glass surface layer

### 2) SVG refraction is **optional**

The base classes (`.glass`, `.glass-card`, `.glass-pill`) can still look correct **without** SVG refraction.

The SVG filter layer is an enhancement used when you want extra refractive distortion.

### 3) Do **not** apply the SVG refraction with plain `filter` on the content-bearing card/container if you want text and content to remain crisp

For UI components such as cards and panels, the safer architecture is:

- **main element** = structure, layout, content
- **`::before` glass layer** = translucent fill + `backdrop-filter`
- **content** = above the glass layer

If you apply plain `filter: url(#glass-refract)` directly to the same element that contains text/content, the element’s rendered output can be affected as a whole.

For real UI glass, the preferred pattern is to keep the refraction in the **glass surface layer**, typically with `backdrop-filter: url(#glass-refract) ...` on a dedicated pseudo-element or dedicated inner layer.

### 4) Browser caveat

Using **SVG filters inside `backdrop-filter`** is a Chromium/Chrome-oriented technique. The kube.io research explicitly calls out that this is currently Chrome-only for the full effect.

That means:
- **best visual path**: `backdrop-filter: url(#glass-refract) blur(...) saturate(...)`
- **safe fallback**: regular `backdrop-filter: blur(...) saturate(...)` without the SVG `url(...)`

---

## CSS-only usage

Import the stylesheet and use the classes directly:

```css
@import 'glass-refraction/css';
```

Or in JavaScript/TypeScript:

```js
import 'glass-refraction/css';
```

Basic HTML:

```html
<nav class="glass">Navbar</nav>
<div class="glass-card">Content card</div>
<span class="glass-pill">Badge</span>
```

---

## CSS-only SVG refraction setup

### Why this exists

The original docs expose SVG filter defs through the React `<GlassFilters />` helper.

For CSS-only apps, the equivalent is: **inject the hidden SVG defs once in your HTML** and then reference them from CSS.

### Place this once near the root of the page

```html
<svg
  class="glass-svg-defs"
  aria-hidden="true"
  width="0"
  height="0"
  style="position:absolute;width:0;height:0;overflow:hidden"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <filter id="glass-refract" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.015 0.012"
        numOctaves="2"
        seed="42"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="8"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>

    <filter id="glass-refract-strong" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.015 0.012"
        numOctaves="2"
        seed="42"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="16"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </defs>
</svg>
```

### Matching defaults

These defaults align with the original GlassFilters API shape:

| Parameter | Default |
|---|---|
| subtle scale | `8` |
| strong scale | `16` |
| baseFrequency | `0.015 0.012` |
| numOctaves | `2` |
| seed | `42` |

### Helper classes

```css
.glass-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.refracted {
  filter: url(#glass-refract);
}

.refracted-strong {
  filter: url(#glass-refract-strong);
}
```

### Important usage note

The `.refracted` / `.refracted-strong` helper classes are fine for:
- demos
- decorative graphics
- isolated visual layers

For **real glass UI panels/cards**, prefer applying the SVG refraction in the **glass layer’s `backdrop-filter` stack**, not as plain `filter` on the content container.

---

## Recommended UI architecture for real glass panels/cards

For polished UI components, use this structure:

- **main element** = layout, radius, content wrapper
- **`::before`** = glass surface layer
  - translucent background/tint
  - `backdrop-filter: url(#glass-refract) blur(...) saturate(...)`
- **`::after`** = chromatic edge treatment / color fringe / edge tinting
- **content** = above both pseudo-elements

Example shape:

```css
.glass-card {
  position: relative;
  isolation: isolate;
  border-radius: var(--gr-radius-card);
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255,255,255,0.06);
  -webkit-backdrop-filter: url(#glass-refract) blur(var(--gr-blur-card)) saturate(var(--gr-saturation-card));
  backdrop-filter: url(#glass-refract) blur(var(--gr-blur-card)) saturate(var(--gr-saturation-card));
  pointer-events: none;
  z-index: 0;
}

.glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
}

.glass-card > * {
  position: relative;
  z-index: 2;
}
```

If SVG-in-`backdrop-filter` is not supported in the target environment, drop the `url(#glass-refract)` part and keep the blur/saturate fallback.

---

## Updated specular highlight model

### Original version

The original CSS used:
- a **left-to-right shimmer sweep** on `.glass`
- a **top-line highlight** on `.glass-card`

That is not the target implementation for this version.

### Updated target version

The target specular highlight should be:

- a **rim / perimeter highlight**, not just a top line
- based on a **fixed light direction**, with a default of **`118deg`**
- implemented as a dedicated pseudo-element highlight layer
- kept separate from the chromatic edge treatment layer

### Animation guidance

- **Do not use** the obvious continuously sweeping sheen animation
- A **subtle `specular-breathe` pulse** is acceptable for the denser `.glass` tier if desired
- Cards and pills do **not** need a tacky sweeping sheen

### Why this model

The kube.io research describes the specular highlight as a **simple rim light effect** whose intensity varies relative to a fixed light direction. A fixed `118deg` default is the best CSS-only starting point.

### Recommended specular variables

```css
:root {
  --gr-specular-angle: 118deg;
  --gr-specular-opacity: 0.72;
  --gr-specular-opacity-card: 0.54;
  --gr-specular-opacity-pill: 0.46;
  --gr-specular-arc: 34deg;
  --gr-specular-soft-bloom: 0.18;
  --gr-specular-ring-width: 1px;
  --gr-specular-ring-width-card: 1px;
  --gr-specular-ring-width-pill: 1px;
  --gr-specular-duration: 5s;
}
```

### Recommended CSS pattern

Use a masked perimeter ring plus an angled conic highlight hotspot:

```css
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--gr-specular-ring-width-card);
  background:
    conic-gradient(
      from calc(var(--gr-specular-angle) - var(--gr-specular-arc)),
      transparent 0deg,
      rgba(255,255,255,0) calc(var(--gr-specular-arc) * 0.20),
      rgba(255,255,255,0.12) calc(var(--gr-specular-arc) * 0.48),
      rgba(255,255,255,0.82) calc(var(--gr-specular-arc) * 0.84),
      rgba(255,255,255,0.22) calc(var(--gr-specular-arc) * 1.10),
      rgba(255,255,255,0) calc(var(--gr-specular-arc) * 1.55),
      transparent 360deg
    );
  opacity: var(--gr-specular-opacity-card);
  pointer-events: none;
  z-index: 3;

  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
}
```

This gives a perimeter-focused highlight instead of a single top line.

---

## Tiers

### `.glass`
Use for dense shell surfaces such as navbars, toolbars, floating shells, and hero overlays.

Characteristics:
- strongest blur / saturation / depth
- may keep a subtle `specular-breathe`
- chromatic edge treatment can stay more visible here than on cards

### `.glass-card`
Use for panels, cards, modals, chart containers, drawers, and grouped content surfaces.

Characteristics:
- medium blur / saturation
- perimeter specular highlight, not top-line gloss
- should prioritize clarity and clean layering over heavy animation

### `.glass-pill`
Use for chips, tags, inline pills, and smaller controls.

Characteristics:
- lightest blur / saturation
- very restrained rim highlight
- smaller chromatic edge treatment

---

## Theming

Override CSS custom properties to theme the system:

```css
:root {
  /* Blur */
  --gr-blur: 26px;
  --gr-blur-card: 20px;
  --gr-blur-pill: 8px;

  /* Saturation */
  --gr-saturation: 1.7;
  --gr-saturation-card: 1.5;
  --gr-saturation-pill: 1.3;

  /* Radius */
  --gr-radius: 20px;
  --gr-radius-card: 16px;
  --gr-radius-pill: 9999px;

  /* Base background */
  --gr-bg-start: rgba(18, 22, 35, 0.48);
  --gr-bg-end: rgba(12, 16, 28, 0.42);

  /* Chromatic dispersion */
  --gr-chromatic-blue: rgba(0, 180, 255, 0.045);
  --gr-chromatic-violet: rgba(120, 80, 255, 0.04);
  --gr-chromatic-pink: rgba(255, 100, 200, 0.035);
  --gr-chromatic-green: rgba(100, 255, 180, 0.025);

  /* Specular highlight */
  --gr-specular-angle: 118deg;
  --gr-specular-opacity: 0.72;
  --gr-specular-opacity-card: 0.54;
  --gr-specular-opacity-pill: 0.46;
  --gr-specular-arc: 34deg;
  --gr-specular-soft-bloom: 0.18;
  --gr-specular-ring-width: 1px;
  --gr-specular-ring-width-card: 1px;
  --gr-specular-ring-width-pill: 1px;
  --gr-specular-duration: 5s;
}
```

---

## Implementation guidance for an AI coding agent

When applying this system to an existing app:

1. **Treat the glass style as a layered system**, not just a background color swap.
2. **Preserve layout and sizing.**
3. **Keep content crisp.** Avoid applying plain `filter` directly to content-bearing panels.
4. **Prefer a dedicated glass layer (`::before`)** for the backdrop/refraction stack.
5. **Keep chromatic edge treatment separate** from the specular highlight layer.
6. **Use rim/perimeter specular highlights**, not top-line gloss.
7. **Do not use the tacky continuous shimmer sweep**.
8. **Use `118deg` as the default specular angle** unless a different angle is deliberately chosen.
9. **Scope selectors carefully** when integrating into a real codebase.
10. **Fallback gracefully** when SVG-in-`backdrop-filter` support is unavailable.

---

## Summary

For CSS-only usage, the correct mental model is:

- base glass classes provide the main visual structure
- SVG refraction is optional and should be injected in HTML once
- for UI panels/cards, SVG refraction should live in the **glass surface layer** via `backdrop-filter` when possible
- specular highlight should be a **rim/perimeter highlight** with a fixed **`118deg`** default, not a top-line-only sheen
- chromatic edges remain a separate layer
