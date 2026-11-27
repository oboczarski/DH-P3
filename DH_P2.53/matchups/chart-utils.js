/* Shared Matchups scatter presentation, independent of scoring calculations. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FPACharts = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // FPA vs Expected fits each axis to its own unrounded per-game values, with
  // padding for marker radii at both ends. Bounds use finer increments than the
  // readable grid ticks, avoiding whole extra tick intervals of empty space.
  function pointBounds(values) {
    const finite = values.filter(Number.isFinite);
    if (!finite.length) return { low: 0, high: 1, step: .2, ticks: [0, .2, .4, .6, .8, 1] };
    let low = Math.min(...finite), high = Math.max(...finite);
    const span = high - low;
    const padding = span > 0 ? Math.max(.1, span * .08) : Math.max(.5, Math.abs(low) * .05);
    low -= padding; high += padding;
    const rough = (high - low) / 5, magnitude = 10 ** Math.floor(Math.log10(rough));
    const candidates = [1, 2, 5, 10].map(n => Math.max(.1, n * magnitude));
    const step = candidates.reduce((best, candidate) => Math.abs(Math.log(candidate / rough)) < Math.abs(Math.log(best / rough)) ? candidate : best);
    const clean = n => Math.round(n * 1e9) / 1e9 || 0;
    const boundStep = step / 5;
    low = clean(Math.floor(low / boundStep) * boundStep); high = clean(Math.ceil(high / boundStep) * boundStep);
    const first = Math.ceil((low - step * 1e-9) / step), last = Math.floor((high + step * 1e-9) / step);
    const ticks = Array.from({ length: last - first + 1 }, (_, index) => clean((first + index) * step));
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

  function plotWidth(clientWidth, style) {
    return Math.max(260, Math.round((clientWidth || 500) - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0)));
  }

  // FPA vs Expected and Matchup Trends use the same plot area, scale rules
  // and SVG presentation. Points fit each axis independently, so clip the
  // equality line and its shaded regions in data coordinates.
  function scatterPlot(points, { width, mobile, ranked, pool, tick, xTitle, yTitle, aboveLabel, belowLabel }) {
    const height = mobile ? 320 : 330, left = 43, right = width - 16, top = 18, bottom = height - 34;
    const rankBounds = { low: 0, high: Math.max(2, pool + 1),
      ticks: [...new Set([1, Math.ceil(pool / 4), Math.ceil(pool / 2), Math.ceil(pool * 3 / 4), pool])] };
    const xBounds = ranked ? rankBounds : pointBounds(points.map(point => point.x));
    const yBounds = ranked ? rankBounds : pointBounds(points.map(point => point.y));
    const x = value => left + (value - xBounds.low) / (xBounds.high - xBounds.low) * (right - left);
    const y = value => bottom - (value - yBounds.low) / (yBounds.high - yBounds.low) * (bottom - top);
    const geometry = comparisonGeometry(xBounds, yBounds);
    const polygon = (vertices, color) => vertices.length < 3 ? "" : `<polygon points="${vertices.map(([a, b]) => `${x(a)},${y(b)}`).join(" ")}" fill="${color}" fill-opacity=".025"/>`;
    let content = polygon(geometry.above, "#75e0b7") + polygon(geometry.below, "#ffb2d8");
    content += yBounds.ticks.map(n => `<line class="gridLine" x1="${left}" x2="${right}" y1="${y(n)}" y2="${y(n)}"/><text x="${left - 2}" y="${y(n) + 3}" text-anchor="end">${tick(n, yBounds)}</text>`).join("");
    content += xBounds.ticks.map(n => `<line class="gridLine" x1="${x(n)}" x2="${x(n)}" y1="${top}" y2="${bottom}"/><text x="${x(n)}" y="${bottom + 9}" text-anchor="middle">${tick(n, xBounds)}</text>`).join("");
    if (geometry.equality.length) {
      const [a, b] = geometry.equality;
      content += `<line x1="${x(a[0])}" y1="${y(a[1])}" x2="${x(b[0])}" y2="${y(b[1])}" stroke="#9eb0d9" stroke-opacity=".6" stroke-dasharray="4 4"/>`;
    }
    if (yBounds.high - 9 / (bottom - top) * (yBounds.high - yBounds.low) > xBounds.low + 5 / (right - left) * (xBounds.high - xBounds.low)) content += `<text class="zoneLabel" x="${left + 5}" y="${top + 9}">${aboveLabel}</text>`;
    if (yBounds.low + 6 / (bottom - top) * (yBounds.high - yBounds.low) < xBounds.high - 5 / (right - left) * (xBounds.high - xBounds.low)) content += `<text class="zoneLabel" x="${right - 5}" y="${bottom - 6}" text-anchor="end">${belowLabel}</text>`;
    content += `<text class="axisTitle" x="${(left + right) / 2}" y="${height - 10}" text-anchor="middle">${xTitle}</text><text class="axisTitle" transform="translate(23 ${(top + bottom) / 2}) rotate(-90)" text-anchor="middle">${yTitle}</text>`;
    return { height, left, right, top, bottom, x, y, content };
  }

  function scatterLeaders(markers) {
    const moved = markers.filter(marker => Math.hypot(marker.displayX - marker.x, marker.displayY - marker.y) > 1);
    if (!moved.length) return "";
    return `<g class="scatterLeaders" aria-hidden="true" pointer-events="none" stroke="#9eb0d9" stroke-width=".8" stroke-opacity=".45">${moved.map(marker => `<line x1="${marker.x}" y1="${marker.y}" x2="${marker.displayX}" y2="${marker.displayY}"/><circle cx="${marker.x}" cy="${marker.y}" r="1.4" fill="#9eb0d9" fill-opacity=".55" stroke="none"/>`).join("")}</g>`;
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

  return Object.freeze({ pointBounds, comparisonGeometry, spreadScatterPoints, plotWidth, scatterPlot, scatterLeaders });
});
