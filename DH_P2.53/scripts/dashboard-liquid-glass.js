(() => {
  const PAGE_ID = 'welcome';
  const ACTIVE_CLASS = 'fc-liquid-glass-active';
  const SNAPSHOT_SELECTOR = '#starfield';
  const TARGET_SELECTOR = '[data-liquid-pane="chart"]';
  const DYNAMIC_BACKDROP_SELECTORS = ['#stars', '#stars1', '#stars2', '#stars3'];

  let liquidState = null;

  function isWelcomeDashboard() {
    return document.body?.dataset?.page === PAGE_ID;
  }

  function supportsDashboardLiquidGlass() {
    if (typeof window.liquidGL !== 'function' || typeof window.html2canvas === 'undefined') {
      return false;
    }
    if (typeof window.__liquidGLNoWebGL__ === 'boolean') {
      return !window.__liquidGLNoWebGL__;
    }

    const testCanvas = document.createElement('canvas');
    const testContext =
      testCanvas.getContext('webgl2') ||
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl');

    return !!testContext;
  }

  function normalizeLensInstances(instances) {
    if (!instances) return [];
    return (Array.isArray(instances) ? instances : [instances]).filter(Boolean);
  }

  function getLiquidTargets() {
    return Array.from(document.querySelectorAll(TARGET_SELECTOR));
  }

  function buildLiquidOptions() {
    const isMobile = window.innerWidth <= 768;

    // Dashboard chart glass: tune the vendor lens toward the existing desktop
    // refraction language while keeping the chart surface crisp instead of frosted.
    return {
      allowFixedSnapshot: true,
      snapshot: SNAPSHOT_SELECTOR,
      target: TARGET_SELECTOR,
      resolution: isMobile ? 1.22 : 1.48,
      refraction: isMobile ? 0.027 : 0.022,
      bevelDepth: isMobile ? 0.145 : 0.12,
      bevelWidth: isMobile ? 0.18 : 0.155,
      frost: isMobile ? 0.45 : 0.3,
      shadow: true,
      specular: true,
      reveal: 'none',
      tilt: false,
      magnify: 1.02,
    };
  }

  function unregisterLiquidEvents() {
    if (!liquidState) return;

    window.removeEventListener('resize', liquidState.handleCaptureRefresh);
    window.removeEventListener('orientationchange', liquidState.handleCaptureRefresh);
    window.removeEventListener('pageshow', liquidState.handleCaptureRefresh);
    document.removeEventListener('visibilitychange', liquidState.handleVisibilityRefresh);

    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', liquidState.handleCaptureRefresh);
    }
  }

  function scheduleLiquidRefresh({ capture = false } = {}) {
    if (!liquidState) return;

    liquidState.capturePending = liquidState.capturePending || capture;
    if (liquidState.refreshRaf) return;

    liquidState.refreshRaf = window.requestAnimationFrame(() => {
      const shouldCapture = liquidState?.capturePending;
      if (liquidState) {
        liquidState.refreshRaf = 0;
        liquidState.capturePending = false;
      }

      if (typeof window.liquidGL.refresh === 'function') {
        window.liquidGL.refresh({ capture: shouldCapture });
      }
    });
  }

  function registerBackdropDynamics() {
    if (typeof window.liquidGL.registerDynamic !== 'function') return;

    // Dashboard chart glass: register the animated welcome star layers so the
    // shared lens texture updates against the actual moving dashboard backdrop.
    const dynamicNodes = DYNAMIC_BACKDROP_SELECTORS
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

    if (dynamicNodes.length) {
      window.liquidGL.registerDynamic(dynamicNodes);
    }
  }

  function attachLiquidEvents() {
    if (!liquidState) return;

    liquidState.handleCaptureRefresh = () => {
      scheduleLiquidRefresh({ capture: true });
    };
    liquidState.handleVisibilityRefresh = () => {
      if (!document.hidden) {
        scheduleLiquidRefresh({ capture: true });
      }
    };

    window.addEventListener('resize', liquidState.handleCaptureRefresh, { passive: true });
    window.addEventListener('orientationchange', liquidState.handleCaptureRefresh, { passive: true });
    window.addEventListener('pageshow', liquidState.handleCaptureRefresh);
    document.addEventListener('visibilitychange', liquidState.handleVisibilityRefresh);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', liquidState.handleCaptureRefresh, { passive: true });
    }
  }

  function clearActiveState() {
    document.body?.classList.remove(ACTIVE_CLASS);
  }

  function destroyDashboardLiquidGlass() {
    if (liquidState?.refreshRaf) {
      window.cancelAnimationFrame(liquidState.refreshRaf);
    }

    unregisterLiquidEvents();
    clearActiveState();

    if (typeof window.liquidGL?.destroy === 'function') {
      window.liquidGL.destroy();
    }

    liquidState = null;
  }

  function initDashboardLiquidGlass() {
    destroyDashboardLiquidGlass();

    if (!isWelcomeDashboard() || !supportsDashboardLiquidGlass()) {
      return false;
    }

    const targets = getLiquidTargets();
    if (!targets.length) {
      return false;
    }

    try {
      const lensInstances = normalizeLensInstances(window.liquidGL(buildLiquidOptions()));
      if (!lensInstances.length) {
        clearActiveState();
        return false;
      }

      liquidState = {
        capturePending: false,
        handleCaptureRefresh: null,
        handleVisibilityRefresh: null,
        instances: lensInstances,
        refreshRaf: 0,
      };

      document.body.classList.add(ACTIVE_CLASS);
      registerBackdropDynamics();
      attachLiquidEvents();
      scheduleLiquidRefresh({ capture: true });
      return true;
    } catch (error) {
      console.warn('Dashboard liquid glass failed to initialize:', error);
      destroyDashboardLiquidGlass();
      return false;
    }
  }

  window.initDashboardLiquidGlass = initDashboardLiquidGlass;
  window.refreshDashboardLiquidGlass = function refreshDashboardLiquidGlass(config = {}) {
    if (!liquidState) return;
    scheduleLiquidRefresh({ capture: !!config.capture });
  };
  window.destroyDashboardLiquidGlass = destroyDashboardLiquidGlass;
})();
