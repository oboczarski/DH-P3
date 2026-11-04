// Scatter names retain every word after the first name, including surname
// prefixes and suffixes: Kenneth Walker III => K. Walker III.
export function formatScatterName(name = '') {
  const parts = String(name ?? '').trim().split(/\s+/);
  if (parts.length < 2) return parts[0];
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

// Home scatter: an intersecting pair gets equal, opposite vertical nudges.
// Compare original boxes once so a nudge cannot start a chain of label moves.
export function arrangeScatterLabels(boxes, plotHeight, gap = 1, maxNudge = 6) {
  const offsets = boxes.map(() => 0);
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i], b = boxes[j];
      const overlapsX = a.x < b.x + b.width && a.x + a.width > b.x;
      const overlapsY = a.y < b.y + b.height && a.y + a.height > b.y;
      if (!overlapsX || !overlapsY) continue;
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
  return boxes.map((box, index) => ({ ...box, index,
    top: Math.max(0, Math.min(plotHeight - box.height,
      box.y + Math.max(-maxNudge, Math.min(maxNudge, offsets[index]))))
  }));
}
