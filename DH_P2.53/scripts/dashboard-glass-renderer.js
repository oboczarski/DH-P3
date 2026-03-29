/* ─────────────────────────────────────────────────────────────────────────────
   Dashboard Glass Renderer — WebGL glass-effect overlay for chart panels.

   Renders transparent glass effects (edge bevel, specular highlights, caustic
   shimmer) over the three dashboard chart panels.  The CSS panel backgrounds
   are fully transparent when this renderer is active, so the real CSS starfield
   shows through the glass interior.  The WebGL canvas sits between the starfield
   (z-index 0-4) and the dashboard content (z-index 10), painting only inside
   the SDF-defined panel regions.

   Key design decisions:
     • Transparent overlay approach — the real CSS starfield is the backdrop,
       NOT a shader reconstruction.  The sampleBackdrop() helper exists for
       potential future refraction use but is NOT called from main() because
       its approximation produces visible mismatches (wrong glow colors, extra
       dot grid) that make panels look opaque with "weird design" instead of
       transparent glass.
     • SDF-based edge detection (udRoundBox / edgeFactor) identifies the bevel
       zone at panel borders for a visible glass-rim highlight.
     • Two orbiting specular light orbs drift across each panel surface.
     • Noise-driven caustic shimmer adds micro-sparkle detail.
     • Panel alpha ramps from ~0.03 (interior) to ~0.35 (edges) so the real
       starfield is visible through the glass center while borders read as glass.

   Public API:
     window.initDashboardGlassRenderer()
     window.destroyDashboardGlassRenderer()
   ───────────────────────────────────────────────────────────────────────────── */
(() => {
  // ── Configuration ──────────────────────────────────────────────────────────
  const ACTIVE_CLASS = 'fc-dashboard-glass-renderer-active';
  const STATIC_CLASS = 'fc-dashboard-glass-renderer-static';
  const CANVAS_ID = 'fc-dashboard-glass-renderer';
  const PANEL_SELECTORS = ['.fc-radar-panel', '.fc-bar-panel', '.fc-scatter-panel'];
  const STAR_LAYER_CONFIGS = [
    { id: 'stars', duration: 250, size: 1, intensity: 1.18 },
    { id: 'stars1', duration: 75, size: 1, intensity: 1.06 },
    { id: 'stars2', duration: 300, size: 2, intensity: 1.08 },
    { id: 'stars3', duration: 350, size: 3, intensity: 1.12 }
  ];
  const STAR_FIELD_TILE_PX = 2000;
  const NOISE_TEXTURE_SIZE = 256;
  const MAX_RENDER_DPR = 1.5;
  const MAX_STAR_TEXTURE_SIZE = 1024;
  const PANEL_COUNT = 3;

  // liquidGL-style refraction parameters — tunable:
  //   refraction : base offset across entire pane (0–1, subtle values best)
  //   bevelDepth : extra offset at edges for a pronounced glass-rim bevel
  //   bevelWidth : how deep the bevel zone extends from the SDF edge (0–1, fraction of shortest side)
  //   specular   : animated light-orb highlights that drift across the pane
  // Tuned for dark starfield background where contrast is low — stronger than
  // liquidGL defaults so the lens distortion is actually visible.
  // liquidGL "Alien" preset: refraction 0.073, bevelDepth 0.2, bevelWidth 0.156
  const REFRACTION = 0.02;
  const BEVEL_DEPTH = 0.14;
  const BEVEL_WIDTH = 0.17;
  const SPECULAR_ENABLED = true;

  let activeRenderer = null;

  // ── Box-shadow parsing utilities (for star texture extraction from DOM) ────

  function splitShadowList(shadowValue) {
    if (!shadowValue || shadowValue === 'none') return [];
    return shadowValue.split(/,(?![^(]*\))/).map((item) => item.trim()).filter(Boolean);
  }

  function parseShadowEntry(entry) {
    if (!entry || entry === 'none') return null;
    const normalized = entry.replace(/\binset\b/g, '').trim();
    const match = normalized.match(/^(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+[\d.]+px)?(?:\s+[\d.]+px)?\s+(.+)$/i);
    if (!match) return null;
    return {
      x: Number.parseFloat(match[1]),
      y: Number.parseFloat(match[2]),
      color: match[3].trim()
    };
  }

  function parseBoxShadowPoints(element, pseudo = null) {
    if (!(element instanceof Element)) return [];
    const computed = window.getComputedStyle(element, pseudo);
    return splitShadowList(computed.boxShadow).map(parseShadowEntry).filter(Boolean);
  }

  // ── WebGL compile/link helpers ─────────────────────────────────────────────

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }
    const info = gl.getShaderInfoLog(shader) || 'Unknown shader compile failure';
    gl.deleteShader(shader);
    throw new Error(info);
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    }
    const info = gl.getProgramInfoLog(program) || 'Unknown program link failure';
    gl.deleteProgram(program);
    throw new Error(info);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // ── DashboardGlassRenderer ─────────────────────────────────────────────────

  class DashboardGlassRenderer {
    constructor() {
      this.canvas = null;
      this.gl = null;
      this.program = null;
      this.vertexBuffer = null;
      this.textureResources = [];
      this.uniforms = null;
      this.attributeLocation = -1;
      this.panelElements = [];
      this.panelRects = new Float32Array(PANEL_COUNT * 4);
      this.panelRadii = new Float32Array(PANEL_COUNT);
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this.cssWidth = 0;
      this.cssHeight = 0;
      this.renderDpr = 1;
      this.rafId = 0;
      this.timeOrigin = 0;
      this.layoutDirty = true;
      this.destroyed = false;
      this.zoomSuspended = false;
      this.boundMarkLayoutDirty = () => {
        this.layoutDirty = true;
      };
      this.boundHandleVisibilityChange = () => {
        if (document.hidden) {
          this.stop();
          return;
        }
        this.layoutDirty = true;
        this.start();
      };
      this.boundHandleZoomMutation = () => {
        this.syncZoomState();
      };
      this.resizeObserver = null;
      this.zoomObserver = null;
      this.visualViewport = null;
    }

    // ── Lifecycle ────────────────────────────────────────────────────────────

    init() {
      if (!this.isEligible()) {
        this.setBodyMode({ active: false, staticMode: false });
        return false;
      }

      this.panelElements = PANEL_SELECTORS.map((selector) => document.querySelector(selector));
      if (this.panelElements.some((panel) => !(panel instanceof HTMLElement))) {
        this.setBodyMode({ active: false, staticMode: false });
        return false;
      }

      this.createCanvas();
      if (!this.initGl()) {
        this.failToStaticMode();
        return false;
      }

      try {
        this.buildPipeline();
      } catch (error) {
        console.warn('Dashboard glass renderer failed to initialize:', error);
        this.failToStaticMode();
        return false;
      }

      this.installObservers();
      this.syncCanvasMetrics();
      this.syncPanelMetrics();
      this.syncZoomState();
      if (!this.zoomSuspended) {
        this.setBodyMode({ active: true, staticMode: false });
      }
      this.start();
      return true;
    }

    // Eligible on any viewport when we're on the welcome/dashboard page.
    // No mobile-only gate — WebGL refraction runs everywhere for consistent quality.
    isEligible() {
      return document.body?.dataset?.page === 'welcome';
    }

    createCanvas() {
      const existing = document.getElementById(CANVAS_ID);
      if (existing instanceof HTMLCanvasElement) {
        existing.remove();
      }

      // Welcome dashboard chart glass: the fixed canvas sits above the starfield
      // background layers and below the dashboard content so only the three chart
      // panels receive the WebGL refraction treatment.
      const canvas = document.createElement('canvas');
      canvas.id = CANVAS_ID;
      canvas.setAttribute('aria-hidden', 'true');
      this.canvas = canvas;

      const insertionTarget = document.getElementById('noise-overlay') || document.getElementById('starfield');
      if (insertionTarget?.parentNode) {
        insertionTarget.insertAdjacentElement('afterend', canvas);
      } else {
        document.body.prepend(canvas);
      }
    }

    initGl() {
      if (!(this.canvas instanceof HTMLCanvasElement)) return false;
      const gl = this.canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance'
      });
      if (!gl) return false;
      this.gl = gl;
      return true;
    }

    // ── GPU Pipeline ─────────────────────────────────────────────────────────

    buildPipeline() {
      const gl = this.gl;
      if (!gl) throw new Error('WebGL context not available');

      // ─ Vertex shader: fullscreen quad → UV mapping ─
      const vertexSource = `
        attribute vec2 aPosition;
        varying vec2 vUv;

        void main() {
          vUv = (aPosition * 0.5) + 0.5;
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `;

      // ─ Fragment shader: liquidGL-style refraction over reconstructed backdrop ─
      //
      // Pipeline per pixel:
      //   1. Per-panel loop: SDF hit-test, compute local panelUv (0–1 within panel)
      //   2. edgeFactor: SDF-based bevel zone detection (ported from liquidGL)
      //   3. Radial refraction offset: normalize(p) * (edge*refraction + edge^10*bevelDepth) * centreBlend
      //   4. 5-tap cross filter: sharp sampling with sub-pixel anti-aliasing
      //   5. Subtle caustic shimmer from noise texture (secondary detail)
      //   6. Specular highlights: two orbiting light orbs (ported from liquidGL)
      //   7. Final: alpha-masked output
      const fragmentSource = `
        precision highp float;

        varying vec2 vUv;

        uniform vec2 uResolution;
        uniform float uDevicePixelRatio;
        uniform float uTime;
        uniform vec4 uPanels[${PANEL_COUNT}];
        uniform float uRadii[${PANEL_COUNT}];
        uniform sampler2D uStars0;
        uniform sampler2D uStars1;
        uniform sampler2D uStars2;
        uniform sampler2D uStars3;
        uniform sampler2D uNoise;

        // liquidGL-style refraction uniforms
        uniform float uRefraction;
        uniform float uBevelDepth;
        uniform float uBevelWidth;
        uniform bool uSpecular;

        const float STAR_TILE = 2000.0;

        // ── SDF: unsigned distance to rounded rectangle (liquidGL udRoundBox) ──
        float udRoundBox(vec2 p, vec2 b, float r) {
          return length(max(abs(p) - b + r, 0.0)) - r;
        }

        // ── Bevel edge factor (ported from liquidGL edgeFactor) ──
        // Returns 0.0 at the deep interior, 1.0 at the SDF edge.
        // The bevel zone width is uBevelWidth × min(panelWidth, panelHeight).
        float edgeFactor(vec2 localUv, vec2 panelSizePx, float radiusPx) {
          vec2 pPx = (localUv - 0.5) * panelSizePx;
          vec2 bPx = 0.5 * panelSizePx;
          float d = -udRoundBox(pPx, bPx, radiusPx);
          float bevelPx = uBevelWidth * min(panelSizePx.x, panelSizePx.y);
          return 1.0 - smoothstep(0.0, bevelPx, d);
        }

        // ── Background reconstruction (unchanged from previous version) ──

        float ellipseGlow(vec2 uv, vec2 center, vec2 radiiPx, vec2 resolutionPx) {
          vec2 safeRadii = max(radiiPx / resolutionPx, vec2(0.0001));
          vec2 delta = (uv - center) / safeRadii;
          return max(0.0, 1.0 - dot(delta, delta));
        }

        vec3 mixLinearGradient(float y) {
          vec3 c0 = vec3(0.095, 0.135, 0.205);
          vec3 c1 = vec3(0.035, 0.086, 0.145);
          vec3 c2 = vec3(0.027, 0.067, 0.106);
          vec3 c3 = vec3(0.019, 0.047, 0.078);

          if (y < 0.36) {
            return mix(c0, c1, clamp(y / 0.36, 0.0, 1.0));
          }
          if (y < 0.68) {
            return mix(c1, c2, clamp((y - 0.36) / 0.32, 0.0, 1.0));
          }
          return mix(c2, c3, clamp((y - 0.68) / 0.32, 0.0, 1.0));
        }

        vec3 sampleStars(sampler2D sampler, vec2 cssFragCoord, float offset, float intensity) {
          vec2 uv = vec2(
            fract(cssFragCoord.x / STAR_TILE),
            fract((cssFragCoord.y / STAR_TILE) + offset)
          );
          return texture2D(sampler, uv).rgb * intensity;
        }

        // Reconstruct the full starfield backdrop at an arbitrary CSS-pixel coordinate.
        // Matches the actual CSS background: multi-stop gradient, 7 glow orbs, dot grid,
        // 4 star layers each scrolling at a unique rate.
        vec3 sampleBackdrop(vec2 cssFragCoord, vec2 cssResolution) {
          vec2 uv = cssFragCoord / max(cssResolution, vec2(1.0));
          vec3 color = mixLinearGradient(uv.y);

          // Seven colored glow orbs spread across the viewport
          color += vec3(0.352, 0.627, 1.0) * 0.10 * pow(ellipseGlow(uv, vec2(0.12, 0.08), vec2(600.0, 560.0), cssResolution), 1.2);
          color += vec3(0.274, 0.745, 1.0) * 0.12 * pow(ellipseGlow(uv, vec2(0.88, 0.10), vec2(980.0, 680.0), cssResolution), 1.25);
          color += vec3(0.980, 0.235, 0.149) * 0.07 * pow(ellipseGlow(uv, vec2(0.99, 0.52), vec2(800.0, 320.0), cssResolution), 1.5);
          color += vec3(0.667, 0.000, 1.000) * 0.12 * pow(ellipseGlow(uv, vec2(0.96, 0.28), vec2(900.0, 620.0), cssResolution), 1.2);
          color += vec3(1.000, 0.078, 0.549) * 0.09 * pow(ellipseGlow(uv, vec2(0.92, 0.80), vec2(1160.0, 1140.0), cssResolution), 1.25);
          color += vec3(0.352, 0.000, 0.980) * 0.10 * pow(ellipseGlow(uv, vec2(0.25, 0.52), vec2(980.0, 800.0), cssResolution), 1.25);
          color += vec3(0.000, 0.863, 0.863) * 0.05 * pow(ellipseGlow(uv, vec2(0.01, 0.88), vec2(980.0, 800.0), cssResolution), 1.35);

          // Dot grid with core glow + halo
          vec2 cell = vec2(83.0);
          vec2 gridOffset = vec2(cell.x * 0.16, cell.y * 0.10);
          vec2 point = mod(cssFragCoord - gridOffset + (cell * 0.5), cell) - (cell * 0.5);
          float pointDistance = length(point);
          float dotCore = smoothstep(1.8, 0.0, pointDistance);
          float dotHalo = smoothstep(14.0, 3.0, pointDistance) * 0.22;
          color += vec3(0.686, 0.353, 1.0) * dotCore * 0.055;
          color += vec3(1.0) * dotHalo * 0.02;

          // Four star layers, each scrolling vertically at a different rate
          color += sampleStars(uStars0, cssFragCoord, uTime / 250.0, 1.10);
          color += sampleStars(uStars1, cssFragCoord, uTime / 75.0, 0.98);
          color += sampleStars(uStars2, cssFragCoord, uTime / 300.0, 1.02);
          color += sampleStars(uStars3, cssFragCoord, uTime / 350.0, 1.08);

          return clamp(color, 0.0, 1.0);
        }

        // ────────────────────────────────────────────────────────────────────
        // Glass overlay approach: the panels are CSS-transparent (background:
        // transparent), so the REAL CSS starfield shows through at z-index 0-4.
        // This canvas (z-index 5) renders ONLY glass effects — edge bevel,
        // specular highlights, caustic shimmer — at LOW ALPHA so the real
        // starfield is visible through the glass interior.
        //
        // Why not full-opacity backdrop reconstruction?  sampleBackdrop() is an
        // approximation (7 orbs vs CSS's 4, wrong colors/positions, adds a dot
        // grid CSS doesn't have).  Rendering it at alpha=1 completely hides the
        // real starfield and makes the panels look like "some weird design."
        // ────────────────────────────────────────────────────────────────────
        void main() {
          vec2 cssResolution = uResolution / max(uDevicePixelRatio, 1.0);
          vec2 cssFragCoord = gl_FragCoord.xy / max(uDevicePixelRatio, 1.0);

          // Y-axis flip: WebGL gl_FragCoord is bottom-up, DOM rects are top-down.
          cssFragCoord.y = cssResolution.y - cssFragCoord.y;

          // ── Step 1: Per-panel SDF hit-test ──
          float panelMask = 0.0;
          vec4 panelRect = vec4(0.0);
          float panelRadius = 0.0;
          vec2 panelUv = vec2(0.0);

          for (int index = 0; index < ${PANEL_COUNT}; index++) {
            vec4 rect = uPanels[index];
            if (rect.z <= 0.0 || rect.w <= 0.0) continue;
            float radius = min(uRadii[index], min(rect.z, rect.w) * 0.5);
            vec2 center = rect.xy + (rect.zw * 0.5);
            vec2 pt = cssFragCoord - center;
            float distanceToEdge = udRoundBox(pt, rect.zw * 0.5, radius);
            float a = smoothstep(1.5, -1.5, distanceToEdge);
            if (a > panelMask) {
              panelMask = a;
              panelRect = rect;
              panelRadius = radius;
              panelUv = clamp((cssFragCoord - rect.xy) / max(rect.zw, vec2(1.0)), 0.0, 1.0);
            }
          }

          if (panelMask <= 0.001) discard;

          // ── Step 2: Bevel edge detection ──
          // 0.0 = deep interior, 1.0 = SDF edge.
          float edge = edgeFactor(panelUv, panelRect.zw, panelRadius);
          float edgePow = pow(edge, 1.4);  // sharpen falloff for crisp rim

          // ── Step 3: Glass edge highlight (the primary visual cue for "glass") ──
          // A bright blue-white rim at the panel border.  This is the strongest
          // glass indicator on a dark background — it reads as a glass bevel.
          vec3 edgeColor = vec3(0.45, 0.55, 0.80);
          float edgeBrightness = edgePow * 0.30;

          // Thin bright inner-edge accent for extra crispness at the very border
          float innerRim = smoothstep(0.85, 1.0, edge) * 0.20;

          // ── Step 4: Specular highlights ──
          // Two time-animated light orbs orbit the panel, simulating reflections
          // on the glass surface.  Each produces a soft radial glow.
          float spec = 0.0;
          if (uSpecular) {
            vec2 lp1 = vec2(sin(uTime * 0.2), cos(uTime * 0.3)) * 0.55 + 0.5;
            vec2 lp2 = vec2(sin(uTime * -0.4 + 1.5), cos(uTime * 0.25 - 0.5)) * 0.55 + 0.5;
            spec += smoothstep(0.38, 0.0, distance(panelUv, lp1)) * 0.20;
            spec += smoothstep(0.45, 0.0, distance(panelUv, lp2)) * 0.16;
          }

          // ── Step 5: Caustic shimmer ──
          // Noise-driven micro-sparkle that animates subtly over time.
          float causticNoise = texture2D(uNoise, fract((panelUv * vec2(5.7, 4.9)) + vec2(uTime * 0.021, uTime * 0.018))).b;
          float caustic = pow(max(0.0, causticNoise - 0.55) * 2.2, 2.5);

          // ── Step 6: Compose glass color ──
          // Start with cool blue-white glass tint, push toward pure white for
          // specular highlights and toward the edge accent at borders.
          vec3 glassBase = vec3(0.40, 0.48, 0.72);             // neutral glass
          vec3 color = glassBase;
          color = mix(color, edgeColor, edgePow * 0.5);        // edge tint
          color = mix(color, vec3(1.0), spec * 0.65);           // specular → white
          color += vec3(0.03, 0.04, 0.06) * caustic;            // caustic tint

          // ── Step 7: Compose glass alpha ──
          // Interior: very low alpha (≈ 0.03) → real starfield shows through
          // Edges: moderate alpha (up to ~0.35) → visible glass bevel/rim
          // Specular: boosts alpha where highlights are bright
          // Caustic: adds sparkle points at very low alpha
          float alphaInterior = 0.03;
          float alphaEdge     = edgeBrightness + innerRim;
          float alphaSpec     = spec * 0.55;
          float alphaCaustic  = caustic * 0.08;
          float totalAlpha    = panelMask * clamp(
            alphaInterior + alphaEdge + alphaSpec + alphaCaustic,
            0.0, 0.60
          );

          gl_FragColor = vec4(color, totalAlpha);
        }
      `;

      this.program = createProgram(gl, vertexSource, fragmentSource);
      this.attributeLocation = gl.getAttribLocation(this.program, 'aPosition');

      // Gather all uniform locations (original + new liquidGL-style uniforms)
      this.uniforms = {
        resolution: gl.getUniformLocation(this.program, 'uResolution'),
        devicePixelRatio: gl.getUniformLocation(this.program, 'uDevicePixelRatio'),
        time: gl.getUniformLocation(this.program, 'uTime'),
        panels: gl.getUniformLocation(this.program, 'uPanels[0]'),
        radii: gl.getUniformLocation(this.program, 'uRadii[0]'),
        stars0: gl.getUniformLocation(this.program, 'uStars0'),
        stars1: gl.getUniformLocation(this.program, 'uStars1'),
        stars2: gl.getUniformLocation(this.program, 'uStars2'),
        stars3: gl.getUniformLocation(this.program, 'uStars3'),
        noise: gl.getUniformLocation(this.program, 'uNoise'),
        // liquidGL-style refraction parameters
        refraction: gl.getUniformLocation(this.program, 'uRefraction'),
        bevelDepth: gl.getUniformLocation(this.program, 'uBevelDepth'),
        bevelWidth: gl.getUniformLocation(this.program, 'uBevelWidth'),
        specular: gl.getUniformLocation(this.program, 'uSpecular')
      };

      // Fullscreen quad (two triangles covering clip space)
      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1
        ]),
        gl.STATIC_DRAW
      );

      // Build star textures from DOM box-shadow data + noise texture
      this.textureResources = STAR_LAYER_CONFIGS.map((config, index) => {
        return this.createTexture(this.buildStarTexture(config, index), index);
      });
      this.textureResources.push(this.createTexture(this.buildNoiseTexture(), STAR_LAYER_CONFIGS.length));

      // Bind texture unit assignments (constant for the lifetime of the program)
      gl.useProgram(this.program);
      gl.uniform1i(this.uniforms.stars0, 0);
      gl.uniform1i(this.uniforms.stars1, 1);
      gl.uniform1i(this.uniforms.stars2, 2);
      gl.uniform1i(this.uniforms.stars3, 3);
      gl.uniform1i(this.uniforms.noise, 4);

      // Set static refraction parameters (could be made dynamic later)
      gl.uniform1f(this.uniforms.refraction, REFRACTION);
      gl.uniform1f(this.uniforms.bevelDepth, BEVEL_DEPTH);
      gl.uniform1f(this.uniforms.bevelWidth, BEVEL_WIDTH);
      gl.uniform1i(this.uniforms.specular, SPECULAR_ENABLED ? 1 : 0);
    }

    // ── Star texture: extract box-shadow positions from hidden DOM elements ──
    buildStarTexture(config, layerIndex) {
      const sourceElement = document.getElementById(config.id);
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = MAX_STAR_TEXTURE_SIZE;
      textureCanvas.height = MAX_STAR_TEXTURE_SIZE;
      const context = textureCanvas.getContext('2d', { alpha: true });
      if (!context) {
        return textureCanvas;
      }

      const scale = MAX_STAR_TEXTURE_SIZE / STAR_FIELD_TILE_PX;
      const basePoints = parseBoxShadowPoints(sourceElement);
      const afterPoints = parseBoxShadowPoints(sourceElement, '::after');
      const allPoints = basePoints.concat(afterPoints);
      context.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
      context.globalCompositeOperation = 'lighter';

      for (const point of allPoints) {
        const x = ((point.x % STAR_FIELD_TILE_PX) + STAR_FIELD_TILE_PX) % STAR_FIELD_TILE_PX;
        const y = ((point.y % STAR_FIELD_TILE_PX) + STAR_FIELD_TILE_PX) % STAR_FIELD_TILE_PX;
        const drawX = x * scale;
        const drawY = y * scale;
        const radius = Math.max(0.9, config.size * scale * 1.2);
        const glowRadius = layerIndex < 2 ? radius * 2.1 : radius * 2.6;

        context.save();
        context.fillStyle = point.color;
        context.shadowColor = point.color;
        context.shadowBlur = glowRadius;
        context.globalAlpha = config.intensity;
        context.beginPath();
        context.arc(drawX, drawY, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      return textureCanvas;
    }

    // ── Noise texture: procedural multi-channel noise for caustic shimmer ──
    buildNoiseTexture() {
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = NOISE_TEXTURE_SIZE;
      noiseCanvas.height = NOISE_TEXTURE_SIZE;
      const context = noiseCanvas.getContext('2d', { alpha: false });
      if (!context) {
        return noiseCanvas;
      }

      const imageData = context.createImageData(NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE);
      const data = imageData.data;

      // Pack a multi-channel noise field for caustic shimmer detail.
      // Three frequency bands of sine waves + random grain per channel.
      for (let y = 0; y < NOISE_TEXTURE_SIZE; y += 1) {
        for (let x = 0; x < NOISE_TEXTURE_SIZE; x += 1) {
          const index = (y * NOISE_TEXTURE_SIZE + x) * 4;
          const nx = x / NOISE_TEXTURE_SIZE;
          const ny = y / NOISE_TEXTURE_SIZE;
          const waveA = Math.sin((nx * 15.7) + (ny * 9.9));
          const waveB = Math.cos((nx * 24.3) - (ny * 13.7));
          const waveC = Math.sin((nx * 37.1) + (ny * 29.4));
          const grain = Math.random() * 2 - 1;
          const red = clamp(((waveA * 0.45) + (waveB * 0.35) + (grain * 0.2)) * 0.5 + 0.5, 0, 1);
          const green = clamp(((waveB * 0.4) + (waveC * 0.4) + (grain * 0.2)) * 0.5 + 0.5, 0, 1);
          const blue = clamp(((waveA * 0.3) + (waveC * 0.5) + (grain * 0.2)) * 0.5 + 0.5, 0, 1);
          data[index] = Math.round(red * 255);
          data[index + 1] = Math.round(green * 255);
          data[index + 2] = Math.round(blue * 255);
          data[index + 3] = 255;
        }
      }

      context.putImageData(imageData, 0, 0);
      return noiseCanvas;
    }

    createTexture(sourceCanvas, textureUnit) {
      const gl = this.gl;
      if (!gl) throw new Error('WebGL context not available');
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
      return texture;
    }

    // ── Observers: scroll, resize, orientation, visibility, zoom ─────────────

    installObservers() {
      window.addEventListener('scroll', this.boundMarkLayoutDirty, { passive: true });
      window.addEventListener('resize', this.boundMarkLayoutDirty, { passive: true });
      window.addEventListener('orientationchange', this.boundMarkLayoutDirty, { passive: true });
      document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);

      this.visualViewport = window.visualViewport || null;
      if (this.visualViewport && typeof this.visualViewport.addEventListener === 'function') {
        this.visualViewport.addEventListener('resize', this.boundMarkLayoutDirty, { passive: true });
        this.visualViewport.addEventListener('scroll', this.boundMarkLayoutDirty, { passive: true });
      }

      // Watch for panel size changes (chart rendering, responsive reflow)
      this.resizeObserver = new ResizeObserver(() => {
        this.layoutDirty = true;
      });
      this.panelElements.forEach((panel) => {
        if (panel instanceof HTMLElement) {
          this.resizeObserver?.observe(panel);
        }
      });

      // Watch for zoom class on <html> (accessibility zoom detection)
      this.zoomObserver = new MutationObserver(this.boundHandleZoomMutation);
      this.zoomObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // ── Layout sync ──────────────────────────────────────────────────────────

    syncCanvasMetrics() {
      if (!(this.canvas instanceof HTMLCanvasElement)) return;
      const rect = this.canvas.getBoundingClientRect();
      const cssWidth = Math.max(1, Math.round(rect.width || window.innerWidth || 1));
      const cssHeight = Math.max(1, Math.round(rect.height || window.innerHeight || 1));
      const renderDpr = clamp(window.devicePixelRatio || 1, 1, MAX_RENDER_DPR);
      const canvasWidth = Math.max(1, Math.round(cssWidth * renderDpr));
      const canvasHeight = Math.max(1, Math.round(cssHeight * renderDpr));

      if (
        canvasWidth !== this.canvasWidth ||
        canvasHeight !== this.canvasHeight ||
        cssWidth !== this.cssWidth ||
        cssHeight !== this.cssHeight
      ) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cssWidth = cssWidth;
        this.cssHeight = cssHeight;
        this.renderDpr = renderDpr;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.layoutDirty = true;
      }
    }

    // Sync panel bounding rects (canvas-relative CSS pixels) into Float32Arrays
    // that are uploaded to the shader each frame as uPanels[] and uRadii[].
    syncPanelMetrics() {
      if (!(this.canvas instanceof HTMLCanvasElement)) return;
      this.syncCanvasMetrics();
      const canvasRect = this.canvas.getBoundingClientRect();

      for (let index = 0; index < PANEL_COUNT; index += 1) {
        const panel = this.panelElements[index];
        if (!(panel instanceof HTMLElement)) {
          this.panelRects.set([0, 0, 0, 0], index * 4);
          this.panelRadii[index] = 0;
          continue;
        }

        const rect = panel.getBoundingClientRect();
        const width = Math.max(0, rect.width);
        const height = Math.max(0, rect.height);
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;

        this.panelRects[index * 4] = x;
        this.panelRects[index * 4 + 1] = y;
        this.panelRects[index * 4 + 2] = width;
        this.panelRects[index * 4 + 3] = height;
        this.panelRadii[index] = Number.parseFloat(window.getComputedStyle(panel).borderTopLeftRadius) || 0;
      }

      this.layoutDirty = false;
    }

    // ── Zoom suspension: hide WebGL canvas when user zooms (accessibility) ──
    syncZoomState() {
      const zoomed = document.documentElement.classList.contains('user-zoomed');
      this.zoomSuspended = zoomed;
      if (!(this.canvas instanceof HTMLCanvasElement)) return;

      if (zoomed) {
        this.stop();
        this.canvas.style.opacity = '0';
        this.canvas.style.visibility = 'hidden';
        this.setBodyMode({ active: false, staticMode: true });
        return;
      }

      this.canvas.style.visibility = 'visible';
      this.canvas.style.opacity = '';
      this.layoutDirty = true;
      this.setBodyMode({ active: true, staticMode: false });
      this.start();
    }

    // Toggle body classes that CSS uses to disable backdrop-filter and adjust
    // chart panel backgrounds when the WebGL renderer is active or failed.
    setBodyMode({ active, staticMode }) {
      if (!document.body || document.body.dataset.page !== 'welcome') return;
      document.body.classList.toggle(ACTIVE_CLASS, Boolean(active));
      document.body.classList.toggle(STATIC_CLASS, Boolean(staticMode));
    }

    // ── Animation loop ───────────────────────────────────────────────────────

    start() {
      if (this.rafId || this.destroyed || this.zoomSuspended) return;
      if (!this.timeOrigin) {
        this.timeOrigin = performance.now();
      }
      const step = (timestamp) => {
        if (this.destroyed) return;
        this.rafId = window.requestAnimationFrame(step);
        if (document.hidden || this.zoomSuspended) return;
        if (!this.isEligible()) {
          this.destroy();
          return;
        }
        // Always sync panel metrics every frame instead of gating on layoutDirty.
        // getBoundingClientRect for 3 panels is negligible cost, and this ensures
        // the glass rectangles track perfectly with scroll without any frame lag.
        this.syncPanelMetrics();
        this.render((timestamp - this.timeOrigin) / 1000);
      };
      this.rafId = window.requestAnimationFrame(step);
    }

    stop() {
      if (this.rafId) {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
    }

    render(timeSeconds) {
      const gl = this.gl;
      if (!gl || !this.program) return;

      gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.enableVertexAttribArray(this.attributeLocation);
      gl.vertexAttribPointer(this.attributeLocation, 2, gl.FLOAT, false, 0, 0);

      // Per-frame dynamic uniforms
      gl.uniform2f(this.uniforms.resolution, this.canvasWidth, this.canvasHeight);
      gl.uniform1f(this.uniforms.devicePixelRatio, this.renderDpr);
      gl.uniform1f(this.uniforms.time, timeSeconds);
      gl.uniform4fv(this.uniforms.panels, this.panelRects);
      gl.uniform1fv(this.uniforms.radii, this.panelRadii);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ── Fallback & cleanup ───────────────────────────────────────────────────

    failToStaticMode() {
      this.setBodyMode({ active: false, staticMode: true });
      this.destroy(true);
    }

    destroy(keepStaticMode = false) {
      if (this.destroyed) return;
      this.destroyed = true;
      this.stop();

      window.removeEventListener('scroll', this.boundMarkLayoutDirty);
      window.removeEventListener('resize', this.boundMarkLayoutDirty);
      window.removeEventListener('orientationchange', this.boundMarkLayoutDirty);
      document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);

      if (this.visualViewport && typeof this.visualViewport.removeEventListener === 'function') {
        this.visualViewport.removeEventListener('resize', this.boundMarkLayoutDirty);
        this.visualViewport.removeEventListener('scroll', this.boundMarkLayoutDirty);
      }
      this.resizeObserver?.disconnect();
      this.zoomObserver?.disconnect();

      const gl = this.gl;
      if (gl) {
        if (this.vertexBuffer) gl.deleteBuffer(this.vertexBuffer);
        this.textureResources.forEach((texture) => {
          gl.deleteTexture(texture);
        });
        if (this.program) gl.deleteProgram(this.program);
      }

      if (this.canvas?.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }

      if (!keepStaticMode) {
        this.setBodyMode({ active: false, staticMode: false });
      }

      this.canvas = null;
      this.gl = null;
      this.program = null;
      this.vertexBuffer = null;
      this.textureResources = [];
      if (activeRenderer === this) {
        activeRenderer = null;
      }
    }
  }

  // ── Public API (unchanged — called from dashboard.js) ──────────────────────

  window.initDashboardGlassRenderer = function initDashboardGlassRenderer() {
    if (activeRenderer) {
      activeRenderer.destroy();
      activeRenderer = null;
    }

    const renderer = new DashboardGlassRenderer();
    if (!renderer.init()) {
      return;
    }
    activeRenderer = renderer;
  };

  window.destroyDashboardGlassRenderer = function destroyDashboardGlassRenderer() {
    if (!activeRenderer) return;
    activeRenderer.destroy();
    activeRenderer = null;
  };
})();
