## ••• Radar Chart Styling Overview ••• ##

## Rank-to-Radius Scaling (polygon size)
- **Line(s):** 2297–2314
- **Name:** `getPlayerRadarData` radial mapping
- **What it is:** Translates rank values to normalized radii before plotting.
- **What it’s styling:** How far each data point sits from the center, shaping the polygon.
- **Details:** Ranks are mapped into a 10–85 radius band (rank 1 ⇒ 85, maxRank ⇒ 10; ranks 1–7 compressed into 73–85) so strong ranks hug the perimeter while weak/unknown ranks stay near the center.

## Responsive Layout Padding & Label Offset
- **Line(s):** 2661–2669
- **Name:** `radarLayoutPadding`, `radarLabelOffset`
- **What it is:** Responsive spacing configuration.
- **What it’s styling:** Chart insets and label distance on mobile vs. desktop.
- **Details:** Uses a 640px media query to shrink padding (top 30/bottom 38/left-right 45) and reduce label offset to 14px on mobile (18px desktop), controlling whitespace around the plot and its labels.

## Dataset Fill and Stroke
- **Line(s):** 2676–2693
- **Name:** Dataset definition (`datasets[0]`)
- **What it is:** Base visual styling for the plotted radar shape.
- **What it’s styling:** Polygon fill, outline, order.
- **Details:** Filled polygon with fallback `rgba(83, 0, 255, 0.33)`, border `#6700ff` at 2px, draw order 2, and `fill: true` so the interior is colored.

## Point Styling
- **Line(s):** 2687–2691
- **Name:** Dataset point properties
- **What it is:** Visual treatment of vertices.
- **What it’s styling:** Point color, border, size.
- **Details:** Points use `#6300ff` fill with dark border `#0D0E1B` and radius 4.5, giving visible nodes that match the outline hue while contrasting the panel background.

## Line Curvature
- **Line(s):** 2702–2704
- **Name:** `elements.line.tension`
- **What it is:** Global line smoothing setting.
- **What it’s styling:** Polygon edge curvature.
- **Details:** Tension `0.40` rounds the radar edges for a softer, less angular shape.

## Interaction and Legend Suppression
- **Line(s):** 2695–2699, 2720–2722
- **Name:** `events`, `legend`, `tooltip`
- **What it is:** Interaction/overlay settings.
- **What it’s styling:** Hover/legend UI visibility.
- **Details:** `events: []` disables pointer interactions; `legend.display = false` and `tooltip.enabled = false` remove legends and hover tooltips, keeping the chart clean.

## Scale Limits and Default Grid Removal
- **Line(s):** 2705–2717
- **Name:** `scales.r`
- **What it is:** Radial scale configuration.
- **What it’s styling:** Axis range and built-in grid/angle lines.
- **Details:** Sets max to 100 with zero baseline; hides grid, angle lines, ticks, and point labels to eliminate Chart.js defaults so only custom layers show.

## Background Band Options
- **Line(s):** 2722–2729
- **Name:** `plugins.playerRadarBackground.levels`
- **What it is:** Config for custom background bands.
- **What it’s styling:** Concentric polygon fills and strokes behind the data.
- **Details:** Five ratios (0.95→0.18) each with semi-transparent fills (`#2c334f62`…`#31385565`) and subtle strokes (`#525a77**`), lineWidth 1, defining the layered backdrop tones.

## Background Band Drawing
- **Line(s):** 2321–2355
- **Name:** `playerRadarBackgroundPlugin`
- **What it is:** Chart.js plugin rendering the band polygons.
- **What it’s styling:** Actual shapes, fills, strokes of the background rings.
- **Details:** In `beforeDraw`, calculates radius per level ratio, traces closed polygons around the center, applies each level’s fill/stroke/lineWidth to paint the layered grid substitute.

## Rank Labels at Data Points
- **Line(s):** 2358–2438
- **Name:** `playerRadarLabelPlugin`
- **What it is:** Plugin for rank numbers near vertices.
- **What it’s styling:** Rank text font, color, offset, ordinal suffix size.
- **Details:** Uses `Product Sans` text, centers baseline, offsets labels per point (special tweaks for top/left positions), colors via `getConditionalColorByRank`, draws ordinal suffix at 70% size with small right offset, and falls back to NA with same color logic.

## Axis Labels and Value Badges
- **Line(s):** 2441–2515
- **Name:** `playerRadarAxisLabelsPlugin`
- **What it is:** Plugin drawing outer stat labels and values.
- **What it’s styling:** Label/value fonts, alignment, spacing, color, bullet separators.
- **Details:** Sets label fonts (12px desktop / 11px mobile) and value fonts (10px / 9px), positions labels using `labelOffset`, aligns text by angle, draws values below as `• value •`, and colors values with rank-based hues while labels stay `#EAEBF0`.

## Post-Render Fill Gradient
- **Line(s):** 2749–2764
- **Name:** Radial gradient update
- **What it is:** Gradient fill applied after scale is available.
- **What it’s styling:** Dataset interior shading.
- **Details:** Builds a radial gradient from center outward (stops at 0, 0.4, 0.78, 1 with increasing purple/blue opacity up to `rgba(34,0,255,0.91)`) and assigns it to the dataset background, then updates without animation.

## Gradient Canvas Context Access
- **Line(s):** 2750–2755
- **Name:** Scale-derived gradient sizing
- **What it is:** Uses scale center/radius to size the gradient.
- **What it’s styling:** Placement of gradient relative to chart center.
- **Details:** Reads `scale.xCenter`, `scale.yCenter`, and `scale.drawingArea` to ensure the gradient origin and radius perfectly match the plotted area.

## Plugin Registration Order
- **Line(s):** 2746–2747
- **Name:** `plugins` array
- **What it is:** Activation of custom renderers.
- **What it’s styling:** Ensures background, rank labels, and axis labels appear.
- **Details:** Registers `playerRadarBackgroundPlugin`, `playerRadarLabelPlugin`, and `playerRadarAxisLabelsPlugin` so their drawing hooks run each render cycle.

## Rank-Based Color Palette Utility
- **Line(s):** 5862–5885
- **Name:** `getConditionalColorByRank`
- **What it is:** Helper that maps ranks to colors (position-aware).
- **What it’s styling:** Text color for ranks/values used by radar plugins.
- **Details:** Returns tiered teal→magenta ramps (different thresholds for WR vs others); used by label and value plugins to tint text according to rank quality.

## Value Formatting for Axis Values
- **Line(s):** 5619–5669
- **Name:** `formatRadarStatValue`
- **What it is:** Formatting rules for displayed stat values.
- **What it’s styling:** Numeric text presentation on the chart.
- **Details:** Applies decimal precision and percent suffixes per stat type (e.g., CMP%/SNP% to 1 decimal with %, 1DRR to 2 decimals, FPTS/PPG to 1 decimal), affecting how tidy and readable the value text appears on the radar.
