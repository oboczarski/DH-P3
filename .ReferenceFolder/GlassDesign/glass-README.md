# glass-refraction — CSS-Only Implementation Reference (Project-Adapted)

This document is the **implementation reference** for using the glass system in a **vanilla HTML/CSS/JS app**.

It is **not** a verbatim restatement of the upstream README.
It is the corrected guide the coding agent should follow for this project.

---

## 1) Scope of this document

Use this document as the source of truth for:
- CSS-only usage
- SVG refraction setup in plain HTML/CSS
- glass layer architecture for panels/cards/containers
- the **correct specular-highlight target** for this project

Do **not** use React patterns from the upstream package for this project.

---

## 2) Base concept

The glass system is made of separate visual layers:

1. **Glass surface layer**
   - translucent fill
   - blur / saturation

2. **Specular highlight layer**
   - reflective highlight on the glass perimeter
   - separate from the chromatic edge layer

3. **Chromatic / edge treatment layer**
   - subtle edge tinting / color separation
   - separate from specular highlight

4. **Content layer**
   - text, icons, charts, controls
   - must remain crisp and readable

This separation is important.

---

## 3) CSS-only usage

Import the stylesheet and use the classes directly:

```css
@import 'glass-refraction/css';
```

Or in JavaScript:

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

## 4) Tier intent

| Class | Intended use | Visual density |
|---|---|---|
| `.glass` | heavy shell surfaces: navs, headers, bars, hero overlays, major shells | strongest |
| `.glass-card` | panels, cards, chart containers, modals, drawers, grouped surfaces | medium |
| `.glass-pill` | pills, chips, tags, inline controls | lightest |

---

## 5) SVG refraction in CSS-only apps

### 5.1 Why this is needed

The upstream docs show SVG filter defs through the React `<GlassFilters />` helper.

In a CSS-only app, the equivalent is:
- place the hidden SVG `<defs>` in the HTML once
- reference the filter IDs from CSS

### 5.2 Important implementation rule

For **real UI cards/panels**, do **not** treat SVG refraction as a generic `filter` on the content-bearing container.

If plain `filter: url(#glass-refract)` is applied directly to the card itself, the card’s rendered output can be affected as a whole.

For UI glass, the preferred pattern is:
- keep the **content layer separate**
- apply the refraction as part of the **glass surface layer**, typically through `backdrop-filter` on a dedicated pseudo-element or dedicated inner FX layer

### 5.3 Browser caveat

The kube research explicitly notes that using **SVG filters inside `backdrop-filter`** is currently a Chromium/Chrome-oriented technique.

So the practical implementation model is:
- **best path**: `backdrop-filter: url(#glass-refract) blur(...) saturate(...)`
- **fallback**: `backdrop-filter: blur(...) saturate(...)` without the SVG `url(...)`

### 5.4 Place this once in the HTML

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

### 5.5 Matching defaults

| Parameter | Default |
|---|---|
| subtle scale | `8` |
| strong scale | `16` |
| baseFrequency | `0.015 0.012` |
| numOctaves | `2` |
| seed | `42` |

### 5.6 Helper classes

These helper classes are acceptable for:
- experiments
- demos
- isolated decorative layers

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

### 5.7 Important warning about those helper classes

The `.refracted` / `.refracted-strong` helpers are **not** the preferred production pattern for real content panels.

For panels/cards/containers, prefer this architecture instead:

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

If SVG-in-`backdrop-filter` is unavailable in the target environment, remove the `url(#glass-refract)` and keep the blur/saturate fallback.

---

## 6) Correct specular-highlight target for this project

This section is the most important correction.

### 6.1 What the project does **not** want

Do **not** implement the specular highlight as:
- an obvious continuous sheen sweeping left-to-right
- a single top-edge line
- a one-sided hotspot around the border
- a single conic-gradient hotspot that only lights one quadrant

Those approaches do **not** match the target look.

### 6.2 What the project **does** want

The target specular highlight is:
- **not a full evenly-lit border**
- **not a top-only line**
- **not a one-angle hotspot**

It should be built as **two long asymmetric border arcs** clipped to the perimeter ring:

1. **Top arc**
   - spans most of the top border
   - starts a bit in from the left side
   - fades out before the far right corner
   - visually biased a little left

2. **Bottom arc**
   - spans most of the bottom border
   - starts later / more to the right than the top arc
   - fades out before the far left corner
   - visually biased a little right

3. **Side borders**
   - should remain mostly dark / low-emphasis

4. **Corners**
   - should only pick up the specular where the top/bottom arcs naturally roll into the rounded corners

This is the visual target the agent should follow.

### 6.3 Relationship to the kube article

The kube article describes the specular highlight conceptually as a simple rim-light effect influenced by surface normal and light direction.

For this project, that article is **inspiration**, not the literal final geometry.

The actual target for this implementation is the **dual asymmetric top/bottom arc look** described above, because that matches the chosen visual reference more accurately than a generic angle-driven perimeter hotspot.

### 6.4 Animation guidance

- Do **not** use the obvious tacky sweeping sheen animation.
- A subtle `specular-breathe` pulse is acceptable on the heavy `.glass` tier **only if desired**.
- Cards and pills should generally remain static unless there is a deliberate reason to animate them.

### 6.5 Correct implementation pattern

The specular highlight should live on its own dedicated pseudo-element layer and be clipped to a thin border ring.

The preferred construction is:
- masked perimeter ring
- two independent horizontal arc gradients
  - one aligned to the top half
  - one aligned to the bottom half
- each arc should have soft fades at both ends
- top and bottom arc offsets should **not** be identical

### 6.6 Correct mental model

Think of it as:
- **two opposing reflective edge sweeps**
- not a full-ring glow
- not a single directional hotspot

### 6.7 Recommended CSS pattern

```css
.glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--gr-specular-ring-width-card, 1px);
  pointer-events: none;
  z-index: 3;
  opacity: var(--gr-specular-opacity-card, 0.58);

  background:
    /* Top arc — slightly left-biased */
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 6%,
      rgba(255,255,255,0.18) 12%,
      rgba(255,255,255,0.92) 24%,
      rgba(255,255,255,0.95) 68%,
      rgba(255,255,255,0.20) 82%,
      transparent 92%,
      transparent 100%
    ) top / 100% 50% no-repeat,

    /* Bottom arc — slightly right-biased */
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 10%,
      rgba(255,255,255,0.14) 22%,
      rgba(255,255,255,0.82) 38%,
      rgba(255,255,255,0.92) 78%,
      rgba(255,255,255,0.18) 90%,
      transparent 97%,
      transparent 100%
    ) bottom / 100% 50% no-repeat;

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

### 6.8 Why this pattern is correct

This pattern gives:
- highlight across most of the top
- highlight across most of the bottom
- different offsets on top and bottom
- minimal side emphasis
- natural pickup in rounded corners
- no isolated right-side hotspot
- no top-only line
- no tacky sweeping sheen

### 6.9 Do not use `118deg` as the main construction method for this version

A fixed angle like `118deg` is acceptable as inspiration or future tuning logic, but it is **not** the main construction method for this project’s target look.

For this project, the specular should be documented and implemented as **dual asymmetric top/bottom arcs**, because that is the actual desired geometry.

---

## 7) Theming variables

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

  /* Specular ring */
  --gr-specular-opacity: 0.78;
  --gr-specular-opacity-card: 0.58;
  --gr-specular-opacity-pill: 0.48;
  --gr-specular-ring-width: 1px;
  --gr-specular-ring-width-card: 1px;
  --gr-specular-ring-width-pill: 1px;

  /* Optional subtle pulse for the heavy .glass tier only */
  --gr-specular-duration: 5s;
}
```

---

## 8) Guidance for the coding agent

When applying this system to an existing app:

1. Treat the glass design as a **layered system**, not a simple background swap.
2. Preserve layout, sizing, and functionality.
3. Keep content crisp.
4. Use a dedicated **glass FX layer** for backdrop blur / saturation / optional SVG refraction.
5. Keep the **specular layer separate** from the chromatic edge layer.
6. Implement specular as **dual asymmetric top/bottom border arcs**.
7. Do **not** implement specular as a single top line.
8. Do **not** implement specular as a one-sided conic hotspot.
9. Do **not** use the obvious sweeping sheen animation.
10. Use page- or component-scoped selectors when integrating into a real codebase.
11. Prefer a graceful fallback when SVG-in-`backdrop-filter` is unsupported.

---

## 9) Summary

For this project, the correct implementation model is:

- CSS-only / vanilla app
- hidden SVG defs injected once in HTML
- optional SVG refraction used through the **glass surface layer** when possible
- content kept separate and crisp
- specular highlight implemented as **two asymmetric perimeter arcs**
  - top mostly lit, offset a bit left
  - bottom mostly lit, offset a bit right
- no tacky sweep
- no top-only line
- no one-sided hotspot
