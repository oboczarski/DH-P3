import {
  COMPARISON_GRADIENT_PALETTES,
  formatComparisonValue,
  formatRank,
  getPlayerName,
  getPlayerPalette,
  getStatDefinition,
  getStatLabel,
  getThresholdConfig,
  isLowerBetterForPosition,
  toFiniteNumber,
} from "./comparisonStats.js";

const COMPARISON_CHART_FONT_FAMILY = '"Product Sans", "Google Sans", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export function getWeeklyPlayerPalette(player, playerIndex) {
  // DataHub Compare weekly line charts: RB keeps its first blue/mint palette
  // and uses the original second WR pink/cyan palette for its second player.
  // WR uses those palettes in the opposite order. Keep this mapping local so
  // season radars and the modal's other player colors retain their palettes.
  const position = String(player?.pos || "").toUpperCase();
  if ((position === "RB" && playerIndex === 1) || (position === "WR" && playerIndex === 0)) {
    return COMPARISON_GRADIENT_PALETTES.WR[1];
  }
  if (position === "WR" && playerIndex === 1) {
    return COMPARISON_GRADIENT_PALETTES.RB[0];
  }
  return getPlayerPalette(player, playerIndex);
}

function getWeeklyPlayerAccentColor(player, playerIndex) {
  return getWeeklyPlayerPalette(player, playerIndex).high;
}

function clamp(value, min, max) {
  if (value === null) {
    return null;
  }
  return Math.max(min, Math.min(max, value));
}

function isMobileComparisonChart() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(max-width: 540px)").matches;
}

function getWeeklyEntry(player, week) {
  return (player?.weeklySeries || []).find((item) => item.week === week) || null;
}

function getThresholdValue(config, category) {
  return toFiniteNumber(config?.[category]?.value);
}

function hexToRgba(color, alpha) {
  const hex = String(color || "").trim();
  if (!hex.startsWith("#")) {
    return `rgba(114, 239, 255, ${alpha})`;
  }
  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  const value = Number.parseInt(normalized.slice(1), 16);
  if (!Number.isFinite(value)) {
    return `rgba(114, 239, 255, ${alpha})`;
  }
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getReadableValueLabelColor(color) {
  // Weekly value labels: any position can now use deep blue/violet palettes.
  // Lift dark text on navy pills without changing line/area gradient colors.
  const hex = String(color || "").trim();
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    return color;
  }
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const perceivedBrightness = ((red * 0.2126) + (green * 0.7152) + (blue * 0.0722)) / 255;
  if (perceivedBrightness >= 0.42) {
    return color;
  }
  const lift = perceivedBrightness < 0.2 ? 0.52 : 0.42;
  const liftChannel = (channel) => Math.round(channel + ((255 - channel) * lift));
  return `rgb(${liftChannel(red)}, ${liftChannel(green)}, ${liftChannel(blue)})`;
}

function getSeriesRawValue(entry, statKey) {
  if (!entry || entry.isSkipped || entry.skipped) {
    return null;
  }
  return toFiniteNumber(entry?.stats?.[statKey]);
}

function getAxisConfig(players, statKey, thresholds) {
  const configs = players
    .map((player) => getThresholdConfig(thresholds, player.pos, statKey))
    .filter(Boolean);
  const values = [];
  configs.forEach((config) => {
    const yMin = getThresholdValue(config, "Y-MIN");
    const yMax = getThresholdValue(config, "Y-MAX");
    if (yMin !== null) values.push(yMin);
    if (yMax !== null) values.push(yMax);
  });
  players.forEach((player) => {
    (player.weeklySeries || []).forEach((entry) => {
      const value = getSeriesRawValue(entry, statKey);
      if (value !== null) {
        values.push(value);
      }
    });
  });

  if (!values.length) {
    return { min: 0, max: 1, inverse: false };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const range = Math.max(1, rawMax - rawMin);
  const padding = range * 0.08;
  const min = rawMin >= 0 ? Math.max(0, rawMin - padding) : rawMin - padding;
  const lowerBetter = players.length > 0 && players.every((player) => isLowerBetterForPosition(player.pos, statKey));
  return {
    min,
    max: rawMax + padding,
    inverse: lowerBetter,
  };
}

function gradientOffset(value, axis, inverse) {
  const numericValue = toFiniteNumber(value);
  if (numericValue === null || !Number.isFinite(axis.max - axis.min) || axis.max === axis.min) {
    return inverse ? 0 : 1;
  }
  const pct = Math.max(0, Math.min(1, (numericValue - axis.min) / (axis.max - axis.min)));
  return inverse ? pct : 1 - pct;
}

function getSamePositionPaletteIndex(players, player, playerIndex) {
  const pos = String(player?.pos || "").toUpperCase();
  if (!pos) {
    return playerIndex;
  }
  return players
    .slice(0, playerIndex)
    .filter((previous) => String(previous?.pos || "").toUpperCase() === pos)
    .length;
}

function buildThresholdGradient(player, playerIndex, statKey, thresholds, axis) {
  const palette = getWeeklyPlayerPalette(player, playerIndex);
  const config = getThresholdConfig(thresholds, player.pos, statKey);
  const fallback = getWeeklyPlayerAccentColor(player, playerIndex);
  if (!config) {
    return fallback;
  }

  const inverse = isLowerBetterForPosition(player.pos, statKey);
  const stops = [
    { value: axis.max, color: inverse ? palette.low : palette.high },
    { value: getThresholdValue(config, "HIGH"), color: palette.high },
    { value: getThresholdValue(config, "MID-HIGH"), color: palette.highMid },
    { value: getThresholdValue(config, "MID-LOW"), color: palette.lowMid },
    { value: getThresholdValue(config, "LOW"), color: palette.low },
    { value: axis.min, color: inverse ? palette.high : palette.low },
  ]
    .filter((stop) => stop.value !== null)
    .map((stop) => ({ offset: gradientOffset(stop.value, axis, inverse), color: stop.color }))
    .sort((left, right) => left.offset - right.offset);

  const deduped = [];
  stops.forEach((stop) => {
    const previous = deduped[deduped.length - 1];
    if (previous && Math.abs(previous.offset - stop.offset) < 0.01) {
      previous.color = stop.color;
      return;
    }
    deduped.push(stop);
  });

  if (deduped.length < 2) {
    return fallback;
  }

  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: deduped,
  };
}

function buildWeeklyAreaGradient(player, playerIndex, isMobile) {
  // DataHub Compare weekly areas: carry each player's existing palette into
  // a richer tint beneath the curve, then ease to fully transparent at the
  // plot floor. Relative coordinates keep the fade proportional on resize;
  // compact charts use less opacity so their dense labels remain prominent.
  const palette = getWeeklyPlayerPalette(player, playerIndex);
  const peakOpacity = isMobile ? 0.3 : 0.38;
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    global: false,
    colorStops: [
      { offset: 0, color: hexToRgba(palette.high, peakOpacity) },
      { offset: 0.34, color: hexToRgba(palette.highMid, peakOpacity * 0.58) },
      { offset: 0.66, color: hexToRgba(palette.lowMid, peakOpacity * 0.22) },
      { offset: 0.88, color: hexToRgba(palette.low, peakOpacity * 0.045) },
      { offset: 1, color: hexToRgba(palette.low, 0) },
    ],
  };
}

function getPointThresholdColor(player, playerIndex, statKey, thresholds, rawValue) {
  const value = toFiniteNumber(rawValue);
  const palette = getWeeklyPlayerPalette(player, playerIndex);
  const config = getThresholdConfig(thresholds, player.pos, statKey);
  if (value === null || !config) {
    return getWeeklyPlayerAccentColor(player, playerIndex);
  }
  const lowerBetter = isLowerBetterForPosition(player.pos, statKey);
  const high = getThresholdValue(config, "HIGH");
  const midHigh = getThresholdValue(config, "MID-HIGH");
  const midLow = getThresholdValue(config, "MID-LOW");
  const low = getThresholdValue(config, "LOW");
  if (lowerBetter) {
    if (high !== null && value <= high) return palette.high;
    if (midHigh !== null && value <= midHigh) return palette.highMid;
    if (midLow !== null && value <= midLow) return palette.lowMid;
    if (low !== null && value <= low) return palette.lowMid;
    return palette.low;
  }
  if (high !== null && value >= high) return palette.high;
  if (midHigh !== null && value >= midHigh) return palette.highMid;
  if (midLow !== null && value >= midLow) return palette.lowMid;
  if (low !== null && value >= low) return palette.lowMid;
  return palette.low;
}

function getTooltipWeek(params) {
  const entries = Array.isArray(params) ? params : [params];
  const rawWeek = entries.find((entry) => (
    entry?.axisValue !== undefined
    || entry?.axisValueLabel
    || entry?.name
    || Array.isArray(entry?.data?.value)
  ));
  const source = rawWeek?.axisValue
    ?? rawWeek?.axisValueLabel
    ?? rawWeek?.name
    ?? rawWeek?.data?.value?.[0]
    ?? "";
  const match = String(source).match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function buildWeeklyTooltip(params, statKey, players, thresholds) {
  // Weekly comparison tooltip:
  // build one row from each selected player's actual weekly record instead of
  // reading ECharts' line/logo/label helper layers, which repeated one value.
  // Let player details wrap within phone widths while keeping values aligned.
  const week = getTooltipWeek(params);
  const safePlayers = Array.isArray(players) ? players : [];
  const lines = safePlayers.map((player, playerIndex) => {
    const entry = getWeeklyEntry(player, week);
    const skipped = Boolean(entry?.isSkipped || entry?.skipped);
    const rawValue = getSeriesRawValue(entry, statKey);
    const paletteIndex = getSamePositionPaletteIndex(safePlayers, player, playerIndex);
    const pointColor = rawValue === null
      ? getWeeklyPlayerAccentColor(player, paletteIndex)
      : getPointThresholdColor(player, paletteIndex, statKey, thresholds, rawValue);
    const rankValue = entry?.ranks?.[statKey];
    const rank = rankValue
      ? ` <span style="opacity:.58">(${player.pos}·${formatRank(rankValue)})</span>`
      : "";
    const opponent = entry?.opponent
      ? ` <span style="opacity:.58">${entry.opponent}</span>`
      : "";
    const displayValue = skipped
      ? (entry?.skipLabel || entry?.skipReason || "DNP")
      : formatComparisonValue(statKey, rawValue);
    const valueColor = skipped || rawValue === null
      ? "rgba(255,214,176,.92)"
      : "rgba(245,249,255,.98)";
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px;">
        <span style="min-width:0;white-space:normal;line-height:1.4;"><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${pointColor};margin-right:6px;"></span>${getPlayerName(player)}${opponent}${rank}</span>
        <strong style="flex:0 0 auto;color:${valueColor};">${displayValue}</strong>
      </div>
    `;
  }).join("");

  return `
    <div style="width:min(340px,calc(100vw - 72px));font-size:12px;font-family:Product Sans,Google Sans,sans-serif;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(226,238,255,.58);">${week ? `Week ${week}` : "Week"}</div>
      ${lines || '<div style="margin-top:6px;color:rgba(226,238,255,.68);">No stat recorded</div>'}
    </div>
  `;
}

function buildCollisionLanes(players, statKey, weeks, axis, isMobile) {
  const lanes = new Map();
  const range = Math.max(1, axis.max - axis.min);
  const closeThreshold = range * (isMobile ? 0.07 : 0.06);
  weeks.forEach((week) => {
    const points = players
      .map((player, playerIndex) => {
        const entry = getWeeklyEntry(player, week);
        const rawValue = getSeriesRawValue(entry, statKey);
        if (rawValue === null) {
          return null;
        }
        return {
          key: `${player.id}:${week}`,
          playerIndex,
          value: clamp(rawValue, axis.min, axis.max),
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.value - left.value || left.playerIndex - right.playerIndex);
    let group = [];
    const flushGroup = () => {
      if (!group.length) return;
      const laneOrder = group.length === 1 ? [0] : [-1, 1, -2];
      group.forEach((item, index) => {
        lanes.set(item.key, laneOrder[index] ?? 0);
      });
      group = [];
    };
    points.forEach((point) => {
      const previous = group[group.length - 1];
      if (previous && Math.abs(previous.value - point.value) > closeThreshold) {
        flushGroup();
      }
      group.push(point);
    });
    flushGroup();
  });
  return lanes;
}

function getWeeklyLabelPosition(lane, playerIndex, inverse) {
  // Shared weekly plot: separate nearby players' labels above/below their
  // actual points, including inverted axes. Lines always retain real values.
  if (lane) return (inverse ? -lane : lane) < 0 ? "top" : "bottom";
  return playerIndex === 0 ? "top" : "bottom";
}

function interpolateSkippedValue(seriesPoints, skippedWeek, axis) {
  const previous = [...seriesPoints].reverse().find((point) => point.week < skippedWeek && point.rawValue !== null);
  const next = seriesPoints.find((point) => point.week > skippedWeek && point.rawValue !== null);
  if (previous && next && next.week !== previous.week) {
    const t = (skippedWeek - previous.week) / (next.week - previous.week);
    return previous.value + ((next.value - previous.value) * t);
  }
  if (previous) {
    return previous.value;
  }
  if (next) {
    return next.value;
  }
  return null;
}

function buildSkipLabelPoints({ player, statKey, weeks, axis, isMobile, logoSymbolSize, seriesPoints }) {
  const points = Array.isArray(seriesPoints) && seriesPoints.length
    ? seriesPoints
    : weeks.map((week) => {
      const entry = getWeeklyEntry(player, week);
      const rawValue = getSeriesRawValue(entry, statKey);
      return {
        week,
        rawValue,
        value: rawValue === null ? null : clamp(rawValue, axis.min, axis.max),
        skipLabel: entry?.skipLabel || entry?.skipReason || "",
        skipped: Boolean(entry?.isSkipped || entry?.skipped),
      };
    });
  return points
    .filter((point) => point.skipped && point.skipLabel)
    .map((point) => {
      const interpolated = interpolateSkippedValue(points, point.week, axis);
      if (interpolated === null) {
        return null;
      }
      return {
        name: `${getPlayerName(player)} ${point.skipLabel}`,
        value: [`wk${point.week}`, interpolated],
        skipLabel: point.skipLabel,
        isLabelOnly: true,
        itemStyle: {
          color: "rgba(150,160,176,0.01)",
          borderColor: "rgba(150,160,176,0)",
          borderWidth: 0,
        },
        label: {
          position: "top",
          distance: isMobile ? 1 : 1,
          offset: [0, 0],
          color: "#9090a0",
          backgroundColor: "rgba(17,21,31,0.92)",
          borderColor: "rgba(184,194,210,0.46)",
          // ECharts doubles this label-border value in its SVG stroke output;
          // 0.5 renders the requested 1px skipped-week pill outline.
          borderWidth: 0.5,
          borderRadius: 5,
          // Keep BYE/IR/OUT pills proportional to their one-pixel-smaller text.
          padding: isMobile ? [1, 4, 1, 4] : [2, 5, 2, 5],
          shadowColor: "rgba(0,0,0,0.42)",
          shadowBlur: 6,
          shadowOffsetY: 1,
        },
      };
    })
    .filter(Boolean);
}

function buildSkipLogoPoints({ player, statKey, weeks, axis, seriesPoints }) {
  if (!player?.teamLogoSrc) {
    return [];
  }
  const points = Array.isArray(seriesPoints) && seriesPoints.length
    ? seriesPoints
    : weeks.map((week) => {
      const entry = getWeeklyEntry(player, week);
      const rawValue = getSeriesRawValue(entry, statKey);
      return {
        week,
        rawValue,
        value: rawValue === null ? null : clamp(rawValue, axis.min, axis.max),
        skipped: Boolean(entry?.isSkipped || entry?.skipped),
        skipLabel: entry?.skipLabel || entry?.skipReason || "",
      };
    });
  return points
    .filter((point) => point.skipped && point.skipLabel)
    .map((point) => {
      const interpolated = interpolateSkippedValue(points, point.week, axis);
      return interpolated === null
        ? null
        : {
          value: [`wk${point.week}`, interpolated],
          skipLabel: point.skipLabel,
          isLabelOnly: true,
        };
    })
    .filter(Boolean);
}

export function buildWeeklyChartOption({ players, statKey, weeks, thresholds, isCompact = null }) {
  const safeWeeks = Array.isArray(weeks) && weeks.length
    ? weeks
    : Array.from({ length: 18 }, (_, index) => index + 1);
  const isMobile = typeof isCompact === "boolean" ? isCompact : isMobileComparisonChart();
  // Shared weekly chart: both selected players contribute to one value axis,
  // one week axis, and one tooltip. Keep the endpoints near the chart edges;
  // y-axis labels sit inside the plot instead of creating an empty gutter.
  const axis = getAxisConfig(players, statKey, thresholds);
  const lanes = buildCollisionLanes(players, statKey, safeWeeks, axis, isMobile);
  // Weekly comparison data-point logos:
  // keep team marks subordinate to the value/rank labels so adjacent weeks stay
  // readable with both lines on the same desktop or compact mobile plot.
  const symbolSize = isMobile ? 12 : 15;
  const labelPadding = isMobile ? [2, 3, 2, 3] : [3, 5, 3, 5];

  return {
    animationDuration: 620,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    grid: isMobile
      ? { top: 24, right: 10, bottom: 25, left: 8, containLabel: false }
      : { top: 28, right: 14, bottom: 32, left: 10, containLabel: false },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(7, 12, 24, 0.96)",
      borderColor: "rgba(142, 221, 255, 0.2)",
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: "rgba(240, 247, 255, 0.94)",
        fontFamily: COMPARISON_CHART_FONT_FAMILY,
      },
      extraCssText: "border-radius:16px;box-shadow:0 20px 48px rgba(0,0,0,.38);",
      formatter: (params) => buildWeeklyTooltip(params, statKey, players, thresholds),
    },
    legend: { show: false },
    xAxis: {
      type: "category",
      show: true,
      boundaryGap: false,
      data: safeWeeks.map((week) => `wk${week}`),
      axisLine: { show: true, lineStyle: { color: "rgba(190, 218, 255, 0.16)" } },
      axisTick: { show: false },
      axisLabel: {
        show: true,
        interval: 0,
        color: "rgba(205, 220, 245, 0.58)",
        fontFamily: COMPARISON_CHART_FONT_FAMILY,
        // Mobile week labels:
        // add the requested lowercase `wk` as a smaller rich-text prefix while
        // keeping a shallow week axis underneath the shared plot.
        fontSize: isMobile ? 7 : 11,
        margin: isMobile ? 5 : 7,
        rotate: 0,
        align: "center",
        formatter: isMobile
          ? (value) => `{weekPrefix|wk}{weekNumber|${String(value).replace(/^wk/i, "")}}`
          : undefined,
        rich: isMobile
          ? {
            weekPrefix: {
              color: "rgba(205, 220, 245, 0.52)",
              fontFamily: COMPARISON_CHART_FONT_FAMILY,
              // Mobile weekly x-axis: keep the "wk" prefix legible while preserving the compact axis height.
              fontSize: 6,
              fontWeight: 800,
              lineHeight: 8,
              // ECharts rich-text padding order is top, right, bottom, left; right controls the prefix-to-number gap.
              padding: [0, 0, 0, 0],
              verticalAlign: "bottom",
            },
            weekNumber: {
              color: "rgba(205, 220, 245, 0.62)",
              fontFamily: COMPARISON_CHART_FONT_FAMILY,
              fontSize: 7,
              fontWeight: 800,
              lineHeight: 8,
              verticalAlign: "bottom",
            },
          }
          : undefined,
      },
    },
    yAxis: {
      type: "value",
      min: axis.min,
      max: axis.max,
      inverse: axis.inverse,
      // Match tick spacing to the displayed stat precision. Integer metrics
      // such as TD/INT must not label fractional ticks as repeated 1s or 2s.
      minInterval: 10 ** -(getStatDefinition(statKey).decimals ?? 1),
      splitLine: { lineStyle: { color: "rgba(190, 218, 255, 0.1)" } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        inside: true,
        align: "left",
        showMinLabel: false,
        showMaxLabel: false,
        color: "rgba(205, 220, 245, 0.5)",
        fontFamily: COMPARISON_CHART_FONT_FAMILY,
        fontSize: isMobile ? 9 : 10,
        margin: 2,
        // Hide only the zero axis label; recorded zero values stay on the line.
        formatter: (value) => Number(value) === 0 ? "" : formatComparisonValue(statKey, value, { compact: true }),
      },
    },
    series: players.flatMap((player, index) => {
      // Weekly color selection:
      // use secondary position gradients only when this player follows another
      // selected player at the same position. Mixed-position comparisons keep
      // every position on its primary gradient.
      const paletteIndex = getSamePositionPaletteIndex(players, player, index);
      const accent = getWeeklyPlayerAccentColor(player, paletteIndex);
      const gradient = buildThresholdGradient(player, paletteIndex, statKey, thresholds, axis);
      const skipLogoSymbolSize = symbolSize;
      const dataPoints = safeWeeks.map((week) => {
        const entry = getWeeklyEntry(player, week);
        const rawValue = getSeriesRawValue(entry, statKey);
        const rank = entry?.ranks?.[statKey] || null;
        const lane = lanes.get(`${player.id}:${week}`) || 0;
        const pointColor = rawValue === null
          ? accent
          : getPointThresholdColor(player, paletteIndex, statKey, thresholds, rawValue);
        const skipped = Boolean(entry?.isSkipped || entry?.skipped);
        const labelPosition = getWeeklyLabelPosition(lane, index, axis.inverse);
        const nearPlotFloor = rawValue !== null && gradientOffset(rawValue, axis, axis.inverse) > 0.88;
        let markerOffset = lane * (isMobile ? 4 : 5);
        // Near-edge points stay put; keep offset logos inside the canvas and
        // move baseline labels above the plot floor so they cannot cover weeks.
        if (week === safeWeeks[0]) markerOffset = Math.max(-1, markerOffset);
        if (week === safeWeeks.at(-1)) markerOffset = Math.min(1, markerOffset);
        // Never move the lines to resolve collisions: equal stats must meet at
        // the same height. Only marker pixels and label positions may separate.
        return {
          week,
          value: rawValue,
          realValue: rawValue === null ? null : clamp(rawValue, axis.min, axis.max),
          rawValue,
          rank,
          pos: player.pos,
          opponent: entry?.opponent || "",
          skipped,
          skipLabel: entry?.skipLabel || entry?.skipReason || "",
          pointColor,
          symbolOffset: [markerOffset, 0],
          labelPosition: nearPlotFloor ? "top" : labelPosition,
          labelOffset: nearPlotFloor && labelPosition === "bottom" ? [0, isMobile ? -16 : -24] : [0, 0],
          label: { show: false },
        };
      });
      const skipLabelPoints = buildSkipLabelPoints({
        player,
        statKey,
        weeks: safeWeeks,
        axis,
        isMobile,
        logoSymbolSize: skipLogoSymbolSize,
        seriesPoints: dataPoints,
      });
      const skipLogoPoints = buildSkipLogoPoints({
        player,
        statKey,
        weeks: safeWeeks,
        axis,
        seriesPoints: dataPoints,
      });
      // Give skipped-week annotations the same side as this player's values
      // so a shared BYE/OUT week remains legible on the combined plot.
      skipLabelPoints.forEach((point) => {
        point.label.position = index === 0 ? "top" : "bottom";
        point.label.distance = 4;
        if (gradientOffset(point.value[1], axis, axis.inverse) > 0.88) {
          point.label.position = "top";
          point.label.offset = index === 0 ? [0, 0] : [0, isMobile ? -16 : -24];
        }
        const week = point.value[0];
        if (week === `wk${safeWeeks[0]}`) point.label.align = "left";
        if (week === `wk${safeWeeks.at(-1)}`) point.label.align = "right";
      });
      skipLogoPoints.forEach((point) => {
        const first = point.value[0] === `wk${safeWeeks[0]}`;
        const last = point.value[0] === `wk${safeWeeks.at(-1)}`;
        point.symbolOffset = [index === 0 ? (first ? -1 : -4) : (last ? 1 : 4), 0];
      });
      const playedLogoPoints = player.teamLogoSrc
        ? dataPoints
          .filter((point) => point.rawValue !== null && !point.skipped)
          .map((point) => ({
            value: [`wk${point.week}`, point.value],
            rawValue: point.rawValue,
            symbolOffset: point.symbolOffset,
          }))
        : [];
      // Shared weekly labels: use opposite sides for close values, then let
      // ECharts suppress any remaining label collisions on narrow viewports.
      const labelPoints = dataPoints
        .map((point, weekIndex) => {
          if (point.rawValue === null || point.skipped) {
            return null;
          }
          const labelTextColor = getReadableValueLabelColor(point.pointColor);
          return {
            name: `${getPlayerName(player)} wk${safeWeeks[weekIndex]} ${getStatLabel(statKey)}`,
            value: [`wk${safeWeeks[weekIndex]}`, point.value],
            rawValue: point.rawValue,
            rank: point.rank,
            pos: point.pos,
            pointColor: point.pointColor,
            labelTextColor,
            isLabelOnly: true,
            itemStyle: { color: "rgba(150,160,176,0.01)" },
            label: {
              show: true,
              position: point.labelPosition,
              // Endpoint value chips extend into the plot so near-edge data
              // points stay visible without clipping their text or adding gaps.
              align: weekIndex === 0 ? "left" : (weekIndex === safeWeeks.length - 1 ? "right" : "center"),
              distance: 4,
              offset: point.labelOffset,
              backgroundColor: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgb(39, 50, 73)" },
                  { offset: 1, color: "rgb(28, 35, 50)" },
                ],
                global: false,
              },
              borderColor: "rgba(255, 255, 255, 0.05)",
              borderWidth: 1,
              borderRadius: 6,
              padding: labelPadding,
              shadowColor: "rgba(0, 0, 0, 0.16)",
              shadowBlur: 16,
              shadowOffsetY: 8,
              fontFamily: COMPARISON_CHART_FONT_FAMILY,
              rich: {
                value: {
                  color: labelTextColor,
                  fontFamily: COMPARISON_CHART_FONT_FAMILY,
                  fontSize: isMobile ? 7 : 10,
                  fontWeight: 950,
                  textShadowColor: "rgba(0, 0, 0, 0.58)",
                  textShadowBlur: 4,
                },
                rank: {
                  color: "rgba(226,236,250,.9)",
                  fontFamily: COMPARISON_CHART_FONT_FAMILY,
                  fontSize: isMobile ? 5.5 : 8,
                  fontWeight: 850,
                  lineHeight: isMobile ? 8 : 12,
                  padding: isMobile ? [0, 0, 0, 0] : [1, 0, 0, 1],
                  verticalAlign: "middle",
                },
              },
            },
          };
        })
        .filter(Boolean);
      const lineSeries = {
        name: getPlayerName(player),
        type: "line",
        smooth: 0.42,
        connectNulls: true,
        symbol: player.teamLogoSrc ? `image://${player.teamLogoSrc}` : "circle",
        symbolSize: player.teamLogoSrc ? symbolSize : (isMobile ? 5 : 7),
        // Played-week team logos are rendered in a dedicated scatter layer
        // below so labels cannot hide team marks at the plot edges. Circle
        // fallbacks remain owned by this line.
        showSymbol: !player.teamLogoSrc,
        zlevel: 0,
        z: 6 + index,
        lineStyle: {
          // Slightly lighter strokes/glow keep crossing lines crisp; hover
          // receives the same treatment so it cannot restore the old weight.
          width: isMobile ? 2.15 : 2.5,
          color: gradient,
          opacity: 1,
          shadowColor: hexToRgba(accent, 0.65),
          shadowBlur: isMobile ? 4 : 7,
          shadowOffsetY: 2,
        },
        itemStyle: {
          color: accent,
          borderColor: "rgba(4,8,16,.96)",
          borderWidth: player.teamLogoSrc ? 4 : 2,
          opacity: 1,
        },
        areaStyle: {
          // Fill to the visible plot floor, including negative-valued stats
          // and inverted lower-is-better axes. Keeping the area on this line
          // series preserves its exact smoothing and skipped-week behavior.
          origin: axis.inverse ? "end" : "start",
          opacity: 1,
          color: buildWeeklyAreaGradient(player, paletteIndex, isMobile),
        },
        label: {
          show: false,
          color: "rgba(244,248,255,.9)",
          fontFamily: COMPARISON_CHART_FONT_FAMILY,
          fontWeight: 900,
          padding: labelPadding,
          borderRadius: 6,
          borderWidth: 1,
          formatter: (params) => {
            if (!params.data || params.data.rawValue === null || params.data.skipped) return "";
            const rank = params.data.rank ? `{rank|(${params.data.pos}·${params.data.rank})}` : "";
            return `{value|${formatComparisonValue(statKey, params.data.rawValue, { compact: true })}}${rank}`;
          },
          rich: {
            value: {
              color: "rgba(248,252,255,.96)",
              fontFamily: COMPARISON_CHART_FONT_FAMILY,
              fontSize: isMobile ? 7 : 10,
              fontWeight: 950,
            },
            rank: {
              color: "rgba(218,232,250,.76)",
              fontFamily: COMPARISON_CHART_FONT_FAMILY,
              fontSize: isMobile ? 5.5 : 8,
              fontWeight: 850,
            },
          },
        },
        emphasis: {
          focus: "none",
          lineStyle: { width: isMobile ? 2.55 : 2.9 },
          // The gradient's stops own its alpha; hover must retain that fade.
          areaStyle: { opacity: 1 },
        },
        data: dataPoints,
      };
      const series = [lineSeries];
      if (playedLogoPoints.length) {
        series.push({
          name: `${getPlayerName(player)} played week logos`,
          type: "scatter",
          coordinateSystem: "cartesian2d",
          data: playedLogoPoints,
          symbol: `image://${player.teamLogoSrc}`,
          symbolSize,
          silent: true,
          clip: false,
          zlevel: 6,
          z: 82 + index,
          itemStyle: {
            opacity: 1,
          },
          emphasis: {
            disabled: true,
          },
        });
      }
      if (skipLogoPoints.length) {
        // Skipped-week markers:
        // use the same direct image symbol path as normal data points. Avoid a
        // separate circular backing so BYE/DNP markers do not look like a
        // different point type.
        series.push({
          name: `${getPlayerName(player)} skipped week logo`,
          type: "scatter",
          coordinateSystem: "cartesian2d",
          data: skipLogoPoints,
          symbol: player.teamLogoSrc ? `image://${player.teamLogoSrc}` : "circle",
          symbolSize: player.teamLogoSrc ? skipLogoSymbolSize : Math.max(7, skipLogoSymbolSize - 8),
          silent: true,
          zlevel: 2,
          z: 28 + index,
          itemStyle: {
            color: "rgba(178,186,198,0.96)",
            borderColor: "rgba(10,14,22,0.9)",
            borderWidth: player.teamLogoSrc ? 0 : 1,
            opacity: 1,
          },
          emphasis: {
            disabled: true,
          },
        });
      }
      if (labelPoints.length) {
        // Weekly labels:
        // render chip labels as their own high-layer scatter series so labels
        // always sit above comparison lines and logo markers.
        series.push({
          name: `${getPlayerName(player)} weekly labels`,
          type: "scatter",
          coordinateSystem: "cartesian2d",
          data: labelPoints,
          symbol: "circle",
          symbolSize,
          silent: true,
          zlevel: 10,
          z: 140 + index,
          itemStyle: {
            color: "rgba(150,160,176,0.01)",
          },
          label: {
            show: true,
            color: "rgba(244,248,255,.9)",
            fontFamily: COMPARISON_CHART_FONT_FAMILY,
            fontWeight: 900,
            formatter: (params) => {
              if (!params.data || params.data.rawValue === null) return "";
              const rank = !isMobile && params.data.rank ? `{rank|(${params.data.pos}·${params.data.rank})}` : "";
              return `{value|${formatComparisonValue(statKey, params.data.rawValue, { compact: true })}}${rank}`;
            },
            rich: {
              value: {
                color: "rgba(255,255,255,.99)",
                fontFamily: COMPARISON_CHART_FONT_FAMILY,
                fontSize: isMobile ? 7 : 10,
                fontWeight: 950,
              },
              rank: {
                color: "rgba(226,236,250,.9)",
                fontFamily: COMPARISON_CHART_FONT_FAMILY,
                fontSize: isMobile ? 5.5 : 8,
                fontWeight: 850,
                lineHeight: isMobile ? 8 : 12,
                padding: isMobile ? [0, 0, 0, 0] : [1, 0, 0, 1],
                verticalAlign: "middle",
              },
            },
          },
          labelLayout: { hideOverlap: true },
          emphasis: {
            disabled: true,
          },
        });
      }
      if (skipLabelPoints.length) {
        series.push({
          name: `${getPlayerName(player)} skipped week labels`,
          type: "scatter",
          coordinateSystem: "cartesian2d",
          data: skipLabelPoints,
          symbol: "circle",
          symbolSize: skipLogoSymbolSize,
          silent: true,
          zlevel: 11,
          z: 160 + index,
          itemStyle: {
            color: "rgba(150,160,176,0.01)",
          },
          label: {
            show: true,
            formatter: (params) => params.data?.skipLabel || "",
            fontFamily: COMPARISON_CHART_FONT_FAMILY,
            fontSize: isMobile ? 7 : 8,
            fontWeight: 950,
            color: "#9090a0",
          },
          labelLayout: { hideOverlap: true },
          emphasis: {
            disabled: true,
          },
        });
      }
      return series;
    }),
  };
}
