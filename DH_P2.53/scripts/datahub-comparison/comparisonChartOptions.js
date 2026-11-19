import {
  COMPARISON_GRADIENT_PALETTES,
  formatComparisonValue,
  getPlayerName,
  getPlayerPalette,
  getStatDefinition,
  getThresholdConfig,
  isLowerBetterForPosition,
  toFiniteNumber,
} from "./comparisonStats.js?v=DH3.81-compare";

const CHART_FONT = '"Product Sans", "Google Sans", Inter, system-ui, sans-serif';

function getWeeklyPlayerPalette(player, playerIndex) {
  // Only the weekly chart uses this WR/RB mapping. Count earlier players of the
  // same position so the first WR keeps its palette even after a different position.
  const position = String(player?.pos || "").toUpperCase();
  if ((position === "RB" && playerIndex === 1) || (position === "WR" && playerIndex === 0)) {
    return COMPARISON_GRADIENT_PALETTES.WR[1];
  }
  if (position === "WR" && playerIndex === 1) {
    return COMPARISON_GRADIENT_PALETTES.RB[0];
  }
  return getPlayerPalette(player, playerIndex);
}

export function getWeeklyPalette(players, index) {
  const player = players[index];
  const slot = players.slice(0, index).filter((other) => other.pos === player.pos).length;
  return getWeeklyPlayerPalette(player, slot);
}

export function getWeeklyPlayerAccentColor(players, index) {
  return getWeeklyPalette(players, index).high;
}

export function getWeeklyWeekEntry(player, week, statKey) {
  const entry = player?.weeklySeries?.find((item) => item.week === week);
  const skipped = Boolean(entry?.skipped || entry?.isSkipped);
  return {
    value: skipped ? null : toFiniteNumber(entry?.stats?.[statKey]),
    status: skipped ? entry.skipLabel || entry.skipReason || "DNP" : "",
    rank: toFiniteNumber(entry?.ranks?.[statKey]),
    opponent: entry?.opponent || "",
  };
}

export function getWeeklyChartLayout(width, height, weekCount) {
  // The first/last weeks sit on the plot edges. Reserve only enough room to
  // keep their symbols and ticks inside the SVG, and draw Y labels in the plot.
  const compact = width < 620;
  const side = compact ? 13 : 17;
  const span = Math.max(1, width - side * 2);
  const spacing = weekCount > 1 ? span / (weekCount - 1) : span;
  return {
    width,
    height,
    compact,
    side,
    top: compact ? 19 : 23,
    bottom: compact ? 20 : 23,
    spacing,
    tickStride: Math.max(1, Math.ceil(25 / spacing)),
    xForIndex: (index) => weekCount <= 1 ? width / 2 : side + index * spacing,
    indexAtX: (x) => weekCount <= 1 ? 0 : Math.max(0, Math.min(weekCount - 1, Math.round((x - side) / spacing))),
  };
}

function getThreshold(config, category) {
  return toFiniteNumber(config?.[category]?.value);
}

function getAxisConfig(players, rows, statKey, thresholds) {
  const values = rows.flatMap((row) => row.map((entry) => entry.value).filter(Number.isFinite));
  players.forEach((player) => {
    const config = getThresholdConfig(thresholds, player.pos, statKey);
    for (const category of ["Y-MIN", "Y-MAX"]) {
      const value = getThreshold(config, category);
      if (value !== null) values.push(value);
    }
  });
  if (!values.length) return { min: 0, max: 1, interval: 0.25, inverse: false };

  const low = Math.min(...values);
  const high = Math.max(...values);
  const precision = 10 ** -getStatDefinition(statKey).decimals;
  const span = Math.max(high - low, Math.abs(high) * 0.08, precision * 4);
  const target = Math.max(precision, span / 5);
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const interval = [1, 2, 5, 10].map((step) => step * magnitude).find((step) => step >= target);
  // Calibrated limits leave space for annotations. A flat or all-zero series
  // still has a usable scale, and signed values retain their real positions.
  const min = Math.floor((low >= 0 ? Math.max(0, low - span * 0.04) : low - span * 0.04) / interval) * interval;
  const max = Math.ceil((high + span * 0.04) / interval) * interval;
  return {
    min,
    max,
    interval,
    inverse: players.length > 0 && players.every((player) => isLowerBetterForPosition(player.pos, statKey)),
  };
}

function gradientOffset(value, axis) {
  const ratio = (value - axis.min) / (axis.max - axis.min);
  return Math.max(0, Math.min(1, axis.inverse ? ratio : 1 - ratio));
}

function buildLineGradient(palette, config, lowerBetter, axis, layout) {
  if (!config) return palette.high;
  const stops = [
    { value: axis.max, color: lowerBetter ? palette.low : palette.high },
    { value: getThreshold(config, "HIGH"), color: palette.high },
    { value: getThreshold(config, "MID-HIGH"), color: palette.highMid },
    { value: getThreshold(config, "MID-LOW"), color: palette.lowMid },
    { value: getThreshold(config, "LOW"), color: palette.low },
    { value: axis.min, color: lowerBetter ? palette.high : palette.low },
  ].filter(({ value }) => value !== null);
  // Use SVG plot coordinates for both players so a threshold has the same
  // vertical location even if one player's line covers a much smaller range.
  return {
    type: "linear",
    global: true,
    x: 0,
    x2: 0,
    y: layout.top,
    y2: layout.height - layout.bottom,
    colorStops: stops.map(({ value, color }) => ({ offset: gradientOffset(value, axis), color }))
      .sort((a, b) => a.offset - b.offset),
  };
}

function translucent(hex, opacity) {
  return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;
}

function buildAreaGradient(palette, twoPlayers) {
  // Layer the two existing fills more lightly on the shared plot so their
  // overlap stays readable, and keep the gradient fade toward the chart floor.
  const opacity = twoPlayers ? 0.16 : 0.24;
  return {
    type: "linear", x: 0, x2: 0, y: 0, y2: 1,
    colorStops: [
      { offset: 0, color: translucent(palette.high, opacity) },
      { offset: 0.38, color: translucent(palette.highMid, opacity * 0.56) },
      { offset: 0.74, color: translucent(palette.lowMid, opacity * 0.16) },
      { offset: 1, color: translucent(palette.low, 0) },
    ],
  };
}

function getPointColor(value, palette, config, lowerBetter) {
  if (!config) return palette.high;
  for (const [threshold, color] of [["HIGH", palette.high], ["MID-HIGH", palette.highMid], ["MID-LOW", palette.lowMid], ["LOW", palette.lowMid]]) {
    const limit = getThreshold(config, threshold);
    if (limit !== null && (lowerBetter ? value <= limit : value >= limit)) return color;
  }
  return palette.low;
}

function keepWeekLabel(index, length, stride) {
  return index === 0 || index === length - 1 || (index % stride === 0 && length - 1 - index >= stride);
}

export function buildWeeklyChartOption({ players, statKey, weeks, thresholds, layout }) {
  const rows = players.map((player) => weeks.map((week) => getWeeklyWeekEntry(player, week, statKey)));
  const axis = getAxisConfig(players, rows, statKey, thresholds);
  const categories = weeks.map((week) => `wk${week}`);
  return {
    animation: false,
    backgroundColor: "transparent",
    grid: {
      top: layout.top,
      bottom: layout.bottom,
      left: layout.side,
      right: layout.side,
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: categories,
      boundaryGap: weeks.length === 1,
      axisLine: { onZero: false, lineStyle: { color: "#3c486337" } },
      axisTick: { show: false },
      axisLabel: {
        interval: (index) => keepWeekLabel(index, weeks.length, layout.tickStride),
        showMinLabel: true,
        showMaxLabel: true,
        color: "#abb8d1",
        fontFamily: CHART_FONT,
        fontSize: layout.compact ? 9 : 10,
        margin: 7,
      },
    },
    yAxis: {
      type: "value",
      ...axis,
      splitLine: { lineStyle: { color: "#a0b5e321", type: "dashed" } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        inside: true,
        align: "left",
        verticalAlign: "bottom",
        showMinLabel: true,
        margin: 2,
        color: "#a8b5cd",
        backgroundColor: "#0d1522d9",
        padding: [0, 2, 1, 0],
        fontFamily: CHART_FONT,
        fontSize: layout.compact ? 9 : 10,
        formatter: (value) => formatComparisonValue(statKey, value, {
          compact: true, decimals: Number.isInteger(value) ? 0 : null,
        }),
      },
    },
    series: players.map((player, index) => {
      const row = rows[index];
      const palette = getWeeklyPalette(players, index);
      const config = getThresholdConfig(thresholds, player.pos, statKey);
      const lowerBetter = isLowerBetterForPosition(player.pos, statKey);
      return {
        id: `weekly-${player.id}`,
        name: getPlayerName(player),
        type: "line",
        smooth: 0.3,
        smoothMonotone: "x",
        connectNulls: true,
        // Hollow circle vs diamond and solid vs dash distinguish players even
        // where a pair overlaps or two threshold colors happen to look alike.
        symbol: index === 0 ? "emptyCircle" : "diamond",
        symbolSize: index === 0 ? (layout.compact ? 6 : 7) : (layout.compact ? 5 : 6),
        showSymbol: true,
        clip: false,
        silent: true,
        z: 4,
        data: row.map(({ value }) => ({
          value,
          itemStyle: { color: value === null ? palette.high : getPointColor(value, palette, config, lowerBetter) },
        })),
        lineStyle: {
          color: buildLineGradient(palette, config, lowerBetter, axis, layout),
          width: layout.compact ? 2.1 : 2.5,
          type: index === 0 ? "solid" : [6, 4],
          shadowColor: translucent(palette.high, 0.46),
          shadowBlur: layout.compact ? 4 : 6,
          shadowOffsetY: 1,
        },
        areaStyle: {
          origin: axis.inverse ? "end" : "start",
          opacity: 1,
          color: buildAreaGradient(palette, players.length > 1),
        },
        emphasis: { disabled: true },
      };
    }),
  };
}
