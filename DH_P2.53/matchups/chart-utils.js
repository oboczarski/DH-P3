/* Scatter geometry, independent of the page and scoring calculations. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FPACharts = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // FPA vs Expected now plots per-game averages. Use an adaptive points scale
  // (down to tenths) so narrow positional ranges do not collapse into ten-point ticks.
  function pointBounds(values) {
    const finite = values.filter(Number.isFinite);
    if (!finite.length) return { low: 0, high: 1, step: .2, ticks: [0, .2, .4, .6, .8, 1] };
    let low = Math.min(...finite), high = Math.max(...finite);
    if (low === high) { const padding = Math.max(1, Math.abs(low) * .1); low -= padding; high += padding; }
    const rough = (high - low) / 5, magnitude = 10 ** Math.floor(Math.log10(rough));
    const step = Math.max(.1, ([1, 2, 5, 10].find(n => n * magnitude >= rough) || 10) * magnitude);
    const clean = n => Math.round(n * 1e9) / 1e9 || 0;
    low = clean(Math.floor(low / step) * step); high = clean(Math.ceil(high / step) * step);
    const ticks = Array.from({ length: Math.round((high - low) / step) + 1 }, (_, index) => clean(low + index * step));
    return { low, high, step, ticks };
  }

  // Clip the two comparison regions to y=x in data coordinates. Different axis
  // ranges move the equality line away from the plot's corner-to-corner diagonal.
  function comparisonGeometry(xBounds, yBounds) {
    const rectangle = [[xBounds.low, yBounds.low], [xBounds.high, yBounds.low],
      [xBounds.high, yBounds.high], [xBounds.low, yBounds.high]];
    const clip = sign => {
      const polygon = [];
      rectangle.forEach((current, index) => {
        const previous = rectangle[(index + rectangle.length - 1) % rectangle.length];
        const a = sign * (previous[1] - previous[0]), b = sign * (current[1] - current[0]);
        if ((a >= 0) !== (b >= 0)) {
          const fraction = a / (a - b);
          polygon.push(previous.map((value, i) => value + fraction * (current[i] - value)));
        }
        if (b >= 0) polygon.push(current);
      });
      return polygon;
    };
    const low = Math.max(xBounds.low, yBounds.low), high = Math.min(xBounds.high, yBounds.high);
    return { above: clip(1), below: clip(-1), equality: low < high ? [[low, low], [high, high]] : [] };
  }

  // FPA vs Expected separates crowded logos in SVG pixels only. Keep the exact
  // x/y anchors for connectors/tooltips and cap every nudge so clusters cannot
  // drift away from their values. Fixed pair order also keeps redraws stable.
  function spreadScatterPoints(points, bounds, { radius = 8.5, gap = 1.5, maxOffset = 14 } = {}) {
    const placed = points.map(point => ({ ...point, displayX: point.x, displayY: point.y }));
    const spacing = radius * 2 + gap;
    const constrain = point => {
      const dx = point.displayX - point.x, dy = point.displayY - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance > maxOffset) {
        point.displayX = point.x + dx / distance * maxOffset;
        point.displayY = point.y + dy / distance * maxOffset;
      }
      point.displayX = Math.max(bounds.left, Math.min(bounds.right, point.displayX));
      point.displayY = Math.max(bounds.top, Math.min(bounds.bottom, point.displayY));
    };
    for (let pass = 0; pass < 60; pass++) {
      let overlap = 0;
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          const a = placed[i], b = placed[j];
          const dx = b.displayX - a.displayX, dy = b.displayY - a.displayY;
          const distance = Math.hypot(dx, dy);
          if (distance >= spacing) continue;
          // Identical values need a deterministic direction instead of dividing
          // by zero or adding random jitter that changes whenever a team is picked.
          const angle = (i * 137.508 + j * 67.5) * Math.PI / 180;
          const ux = distance > .001 ? dx / distance : Math.cos(angle);
          const uy = distance > .001 ? dy / distance : Math.sin(angle);
          const push = (spacing - distance) / 2;
          a.displayX -= ux * push; a.displayY -= uy * push;
          b.displayX += ux * push; b.displayY += uy * push;
          constrain(a); constrain(b);
          overlap = Math.max(overlap, spacing - distance);
        }
      }
      if (overlap < .1) break;
    }
    return placed;
  }

  return Object.freeze({ pointBounds, comparisonGeometry, spreadScatterPoints });
});
