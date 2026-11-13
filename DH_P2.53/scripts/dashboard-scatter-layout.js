// Scatter names retain every word after the first name, including surname
// prefixes and suffixes: Kenneth Walker III => K. Walker III.
export function formatScatterName(name = '') {
  const parts = String(name ?? '').trim().split(/\s+/);
  if (parts.length < 2) return parts[0];
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

// Home scatter: start with small, opposite nudges for intersecting pairs, then
// check their final positions against every neighbor before accepting a move.
export function arrangeScatterLabels(boxes, plotHeight, gap = 1, maxNudge = 6) {
  const offsets = boxes.map(() => 0);
  const touched = new Set();
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i], b = boxes[j];
      const overlapsX = a.x < b.x + b.width && a.x + a.width > b.x;
      const overlapsY = a.y < b.y + b.height && a.y + a.height > b.y;
      if (!overlapsX || !overlapsY) continue;
      touched.add(i);
      touched.add(j);
      const aAbove = a.y + a.height / 2 <= b.y + b.height / 2;
      const upper = aAbove ? a : b, lower = aAbove ? b : a;
      const overlap = upper.y + upper.height + gap - lower.y;
      const nudge = Math.max(0, Math.min(overlap / 2, maxNudge,
        upper.y, plotHeight - lower.y - lower.height));
      offsets[i] += aAbove ? -nudge : nudge;
      offsets[j] += aAbove ? nudge : -nudge;
    }
  }

  // Limit the total movement too: a crowded cluster stays close to its points
  // even when a name intersects several neighbors. Isolated names stay put.
  const layout = boxes.map((box, index) => ({ ...box, index,
    top: Math.max(0, Math.min(plotHeight - box.height,
      box.y + Math.max(-maxNudge, Math.min(maxNudge, offsets[index]))))
  }));

  const overlapArea = (i, top, j, otherTop, x = layout[i].x, otherX = layout[j].x) => {
    const a = boxes[i], b = boxes[j];
    const width = Math.min(x + a.width, otherX + b.width) - Math.max(x, otherX);
    const height = Math.min(top + a.height, otherTop + b.height) - Math.max(top, otherTop);
    return width > 0 && height > 0.01 ? width * height : 0;
  };
  const originalArea = boxes.map((box, i) => boxes.map((other, j) => overlapArea(i, box.y, j, other.y, box.x, other.x)));
  const initialArea = layout.map((label, i) => layout.map((other, j) => overlapArea(i, label.top, j, other.top)));
  const regressedLabels = () => {
    const affected = new Set();
    layout.forEach((label, i) => {
      for (let j = i + 1; j < layout.length; j += 1) {
        if (overlapArea(i, label.top, j, layout[j].top) > originalArea[i][j] + 0.05) {
          if (touched.has(i)) affected.add(i);
          if (touched.has(j)) affected.add(j);
        }
      }
    });
    return [...affected].sort((a, b) => boxes[a].width - boxes[b].width || a - b);
  };
  const score = (i, top, x = layout[i].x) => {
    let fresh = 0, area = 0, worsened = 0;
    layout.forEach((other, j) => {
      if (i === j) return;
      const overlap = overlapArea(i, top, j, other.top, x);
      if (overlap > originalArea[i][j] + 0.05) fresh += 1;
      area += overlap;
      worsened += Math.max(0, overlap - initialArea[i][j]);
    });
    return { fresh, worsened, area, flipped: x !== boxes[i].x, movement: Math.abs(top - boxes[i].y) };
  };
  const improves = (a, b) => a.fresh !== b.fresh ? a.fresh < b.fresh
    : Math.abs(a.worsened - b.worsened) > 0.01 ? a.worsened < b.worsened
    : Math.abs(a.area - b.area) > 0.01 ? a.area < b.area
    : a.flipped !== b.flipped ? !a.flipped : a.movement < b.movement - 0.01;

  // Repair only labels whose nudges created or worsened a collision. Consider their
  // original position and nearby free edges, favoring the smallest safe shift.
  // Previously clear, untouched names act as obstacles and never get relocated.
  for (let pass = 0; pass < 4; pass += 1) {
    const affected = regressedLabels();
    if (!affected.length) break;
    let changed = false;
    affected.forEach(i => {
      // A neighbor may already have freed this name's slot earlier in the pass.
      // Keep an already-good placement instead of optimizing unrelated labels.
      if (!regressedLabels().includes(i)) return;
      const box = boxes[i];
      const min = Math.max(0, box.y - maxNudge);
      const max = Math.min(plotHeight - box.height, box.y + maxNudge);
      // If the vertical slot is blocked on both sides, the renderer can offer
      // the other side of the same point. The text anchor never leaves the dot.
      const sides = [box.x, box.alternateX].filter(Number.isFinite);
      let bestTop = layout[i].top, bestX = layout[i].x, best = score(i, bestTop);
      sides.forEach(x => {
        const candidates = [box.y, layout[i].top, min, max];
        layout.forEach((other, j) => {
          if (i !== j && x < other.x + other.width && x + box.width > other.x) {
            candidates.push(other.top - box.height - gap, other.top + other.height + gap,
              other.top - box.height, other.top + other.height);
          }
        });
        candidates.forEach(candidate => {
          const top = Math.max(min, Math.min(max, candidate));
          const trial = score(i, top, x);
          if (improves(trial, best)) { best = trial; bestTop = top; bestX = x; }
        });
      });
      if (Math.abs(bestTop - layout[i].top) > 0.01 || bestX !== layout[i].x) {
        layout[i].top = bestTop; layout[i].x = bestX; changed = true;
      }
    });
    if (!changed) break;
  }

  // If a dense cluster has no safe small adjustment, restore the implicated
  // names rather than keeping an introduced overlap or increasing the nudge cap.
  for (let pass = 0; pass < boxes.length; pass += 1) {
    const affected = regressedLabels();
    if (!affected.length) break;
    affected.forEach(i => { layout[i].top = boxes[i].y; layout[i].x = boxes[i].x; });
  }
  return layout;
}

// Home scatter's complete label set can contain new three-player clusters as
// the season CSV changes. Start with the original small-nudge placement, then
// repair remaining intersections locally. Flips remain attached to the same
// marker; vertical movement is capped and the renderer adds short leaders.
export function settleScatterLabels(boxes, plotHeight, plotWidth, mobile = false) {
  const layout = arrangeScatterLabels(boxes, plotHeight, 1, mobile ? 4 : 6);
  const maxShift = mobile ? 16 : 12;
  const area = (a, b) => {
    const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const height = Math.min(a.top + a.height + 1, b.top + b.height + 1) - Math.max(a.top, b.top);
    return width > .5 && height > .5 ? width * height : 0;
  };
  const score = (index, x, top) => {
    const candidate = { ...layout[index], x, top };
    let count = 0, overlap = 0;
    layout.forEach((other, j) => {
      if (j === index) return;
      const intersection = area(candidate, other);
      if (intersection) { count += 1; overlap += intersection; }
    });
    return { count, overlap, distance: Math.abs(top - boxes[index].y) + (x === boxes[index].x ? 0 : 3) };
  };
  const better = (a, b) => a.count !== b.count ? a.count < b.count
    : Math.abs(a.overlap - b.overlap) > .1 ? a.overlap < b.overlap
    : a.distance < b.distance - .1;
  for (let pass = 0; pass < 6; pass += 1) {
    let changed = false;
    layout.forEach((label, index) => {
      if (!score(index, label.x, label.top).count) return;
      const box = boxes[index];
      const lower = Math.max(0, box.y - maxShift);
      const upper = Math.min(plotHeight - box.height, box.y + maxShift);
      const candidates = [box.y, label.top, lower, upper];
      for (let delta = 2; delta <= maxShift; delta += 2) candidates.push(box.y - delta, box.y + delta);
      layout.forEach((other, j) => {
        if (j !== index) candidates.push(other.top - box.height - 1, other.top + other.height + 1);
      });
      let bestX = label.x, bestTop = label.top, best = score(index, bestX, bestTop);
      [box.x, box.alternateX].filter(Number.isFinite).forEach(x => {
        if (x < 0 || x + box.width > plotWidth) return;
        candidates.forEach(value => {
          const top = Math.max(lower, Math.min(upper, value));
          const trial = score(index, x, top);
          if (better(trial, best)) { best = trial; bestX = x; bestTop = top; }
        });
      });
      if (Math.abs(label.top - bestTop) > .1 || label.x !== bestX) {
        label.top = bestTop; label.x = bestX; changed = true;
      }
    });
    if (!changed) break;
  }
  return layout;
}
