// Scatter names retain every word after the first name, including surname
// prefixes and suffixes: Kenneth Walker III => K. Walker III.
export function formatScatterName(name = '') {
  const parts = String(name ?? '').trim().split(/\s+/);
  if (parts.length < 2) return parts[0];
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

// Home scatter labels move vertically only. Measured SVG text boxes determine
// which names share horizontal space; point coordinates and stat values stay fixed.
export function arrangeScatterLabels(boxes, plotHeight, gap = 2) {
  const overlapsX = (a, b) => a.x < b.x + b.width + gap && a.x + a.width + gap > b.x;
  const ordered = boxes.map((box, index) => ({ ...box, index,
    top: Math.max(0, Math.min(box.y, plotHeight - box.height))
  })).sort((a, b) => a.y - b.y || a.index - b.index);

  // Pack overlapping names in their original top-to-bottom order, then work
  // upward from the lower edge so a dense cluster cannot spill below the plot.
  ordered.forEach((label, index) => {
    for (let previous = 0; previous < index; previous += 1) {
      const above = ordered[previous];
      if (overlapsX(label, above)) label.top = Math.max(label.top, above.top + above.height + gap);
    }
  });
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    const label = ordered[index];
    label.top = Math.min(label.top, plotHeight - label.height);
    for (let next = index + 1; next < ordered.length; next += 1) {
      const below = ordered[next];
      if (overlapsX(label, below)) label.top = Math.min(label.top, below.top - label.height - gap);
    }
  }

  // Return positions in source order, keeping isolated names at their natural
  // location and allowing the renderer to connect only displaced labels.
  return ordered.sort((a, b) => a.index - b.index).map(label => ({ ...label, top: Math.max(0, label.top) }));
}
