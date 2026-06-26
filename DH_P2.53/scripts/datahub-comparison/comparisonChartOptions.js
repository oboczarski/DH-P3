import {
  formatComparisonValue,
  formatRank,
  getPlayerAccentColor,
  getPlayerName,
  getPlayerPalette,
  getRadarRankValue,
  getStatLabel,
  getThresholdConfig,
  isLowerBetterForPosition,
  toFiniteNumber,
} from "./comparisonStats.js";

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

function buildThresholdGradient(player, playerIndex, statKey, thresholds, axis) {
  const palette = getPlayerPalette(player, playerIndex);
  const config = getThresholdConfig(thresholds, player.pos, statKey);
  const fallback = getPlayerAccentColor(player, playerIndex);
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

function getPointThresholdColor(player, playerIndex, statKey, thresholds, rawValue) {
  const value = toFiniteNumber(rawValue);
  const palette = getPlayerPalette(player, playerIndex);
  const config = getThresholdConfig(thresholds, player.pos, statKey);
  if (value === null || !config) {
    return getPlayerAccentColor(player, playerIndex);
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

function buildWeeklyTooltip(params, statKey) {
  const entries = Array.isArray(params) ? params : [params];
  const weekLabel = entries[0]?.axisValueLabel || entries[0]?.name || "";
  const lines = entries
    .filter((entry) => entry?.data)
    .map((entry) => {
      if (entry.data.skipped) {
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:8px;">
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${entry.data.pointColor || entry.color};margin-right:6px;"></span>${entry.seriesName}</span>
            <strong style="color:rgba(255,214,176,.92);">${entry.data.skipLabel || "DNP"}</strong>
          </div>
        `;
      }
      if (entry.data.rawValue === null || entry.data.rawValue === undefined) {
        return "";
      }
      const rank = entry.data.rank ? ` <span style="opacity:.58">(${entry.data.pos}·${entry.data.rank})</span>` : "";
      const opponent = entry.data.opponent ? ` <span style="opacity:.58">${entry.data.opponent}</span>` : "";
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:8px;">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${entry.data.pointColor || entry.color};margin-right:6px;"></span>${entry.seriesName}${opponent}${rank}</span>
          <strong>${formatComparisonValue(statKey, entry.data.rawValue)}</strong>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  return `
    <div style="min-width:220px;font-family:Product Sans,Google Sans,sans-serif;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(226,238,255,.58);">${weekLabel}</div>
      ${lines || '<div style="margin-top:6px;color:rgba(226,238,255,.68);">No stat recorded</div>'}
    </div>
  `;
}

function buildCollisionLanes(players, statKey, weeks, axis, isMobile) {
  const lanes = new Map();
  const range = Math.max(1, axis.max - axis.min);
  const closeThreshold = range * (isMobile ? 0.045 : 0.035);
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
      const laneOrder = group.length === 1 ? [0] : [-1, 1, 0];
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

function buildSkipMarkPoints({ player, playerIndex, statKey, weeks, axis, thresholds }) {
  const accent = getPlayerAccentColor(player, playerIndex);
  const points = weeks.map((week) => {
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
      const markerColor = getPointThresholdColor(player, playerIndex, statKey, thresholds, interpolated) || accent;
      return {
        name: `${getPlayerName(player)} ${point.skipLabel}`,
        coord: [`wk${point.week}`, interpolated],
        value: point.skipLabel,
        skipLabel: point.skipLabel,
        itemStyle: {
          color: hexToRgba(markerColor, 0.18),
          borderColor: hexToRgba(markerColor, 0.42),
          borderWidth: 1,
        },
        label: {
          color: "rgba(245,250,255,.9)",
        },
      };
    })
    .filter(Boolean);
}

export function buildWeeklyChartOption({ players, statKey, weeks, thresholds, isCompact = null }) {
  const safeWeeks = Array.isArray(weeks) && weeks.length
    ? weeks
    : Array.from({ length: 18 }, (_, index) => index + 1);
  const isMobile = typeof isCompact === "boolean" ? isCompact : isMobileComparisonChart();
  const axis = getAxisConfig(players, statKey, thresholds);
  const lanes = buildCollisionLanes(players, statKey, safeWeeks, axis, isMobile);
  const symbolSize = isMobile ? 15 : 17;
  const areaOpacity = isMobile ? 0.025 : 0.035;
  const labelPadding = isMobile ? [2, 3, 2, 3] : [3, 5, 3, 5];

  return {
    animationDuration: 620,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    grid: isMobile
      ? { top: 12, right: 10, bottom: 44, left: 30, containLabel: false }
      : { top: 14, right: 22, bottom: 40, left: 48, containLabel: false },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(7, 12, 24, 0.96)",
      borderColor: "rgba(142, 221, 255, 0.2)",
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: "rgba(240, 247, 255, 0.94)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
      extraCssText: "border-radius:16px;box-shadow:0 20px 48px rgba(0,0,0,.38);",
      formatter: (params) => buildWeeklyTooltip(params, statKey),
    },
    legend: { show: false },
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: safeWeeks.map((week) => `wk${week}`),
      axisLine: { lineStyle: { color: "rgba(190, 218, 255, 0.16)" } },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        color: "rgba(205, 220, 245, 0.58)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: isMobile ? 9 : 11,
        margin: isMobile ? 12 : 10,
        rotate: isMobile ? 45 : 0,
        align: isMobile ? "right" : "center",
      },
    },
    yAxis: {
      type: "value",
      min: axis.min,
      max: axis.max,
      inverse: axis.inverse,
      splitLine: { lineStyle: { color: "rgba(190, 218, 255, 0.1)" } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(205, 220, 245, 0.5)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: isMobile ? 9 : 10,
        margin: isMobile ? 4 : 8,
        formatter: (value) => formatComparisonValue(statKey, value, { compact: true }),
      },
    },
    series: players.map((player, index) => {
      const accent = getPlayerAccentColor(player, index);
      const gradient = buildThresholdGradient(player, index, statKey, thresholds, axis);
      const skipMarkPoints = buildSkipMarkPoints({ player, playerIndex: index, statKey, weeks: safeWeeks, axis, thresholds });
      return {
        name: getPlayerName(player),
        type: "line",
        smooth: 0.42,
        connectNulls: true,
        symbol: player.teamLogoSrc ? `image://${player.teamLogoSrc}` : "circle",
        symbolSize: player.teamLogoSrc ? symbolSize : (isMobile ? 5 : 7),
        showSymbol: true,
        z: 8 + index,
        lineStyle: {
          width: isMobile ? 2.8 : 3.2,
          color: gradient,
          shadowColor: accent,
          shadowBlur: isMobile ? 7 : 11,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: accent,
          borderColor: "rgba(4,8,16,.96)",
          borderWidth: player.teamLogoSrc ? 4 : 2,
        },
        areaStyle: {
          opacity: areaOpacity,
          color: gradient,
        },
        label: {
          show: true,
          color: "rgba(244,248,255,.9)",
          fontFamily: "Product Sans, Google Sans, sans-serif",
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
              fontSize: isMobile ? 7 : 10,
              fontWeight: 950,
            },
            rank: {
              color: "rgba(218,232,250,.76)",
              fontSize: isMobile ? 5.5 : 8,
              fontWeight: 850,
            },
          },
        },
        labelLayout: { moveOverlap: "shiftY", hideOverlap: true },
        emphasis: {
          focus: "series",
          lineStyle: { width: isMobile ? 3.5 : 4.2 },
        },
        markPoint: skipMarkPoints.length
          ? {
            symbol: "roundRect",
            symbolSize: isMobile ? [34, 16] : [42, 18],
            data: skipMarkPoints,
            label: {
              show: true,
              formatter: (params) => params.data?.skipLabel || params.value || "",
              fontFamily: "Product Sans, Google Sans, sans-serif",
              fontSize: isMobile ? 8 : 9,
              fontWeight: 950,
              color: "rgba(245,250,255,.9)",
            },
            emphasis: { disabled: true },
          }
          : undefined,
        data: safeWeeks.map((week) => {
          const entry = getWeeklyEntry(player, week);
          const rawValue = getSeriesRawValue(entry, statKey);
          const rank = entry?.ranks?.[statKey] || null;
          const lane = lanes.get(`${player.id}:${week}`) || 0;
          const pointColor = rawValue === null
            ? accent
            : getPointThresholdColor(player, index, statKey, thresholds, rawValue);
          const skipped = Boolean(entry?.isSkipped || entry?.skipped);
          return {
            value: rawValue === null ? null : clamp(rawValue, axis.min, axis.max),
            rawValue,
            rank,
            pos: player.pos,
            opponent: entry?.opponent || "",
            skipped,
            skipLabel: entry?.skipLabel || entry?.skipReason || "",
            pointColor,
            symbolOffset: lane ? [lane * (isMobile ? 5 : 7), 0] : [0, 0],
            label: {
              position: "top",
              distance: isMobile ? 2 : 4,
              offset: lane ? [lane * (isMobile ? 9 : 9), -Math.abs(lane) * (isMobile ? 3 : 3)] : [0, 0],
              backgroundColor: hexToRgba(pointColor, 0.16),
              borderColor: hexToRgba(pointColor, 0.3),
            },
          };
        }),
      };
    }),
  };
}

function buildRadarTooltip(params, statKeys) {
  const statRows = statKeys.map((statKey, index) => {
    const raw = params.data?.rawValues?.[index];
    const posRank = params.data?.posRanks?.[index];
    const overallRank = params.data?.overallRanks?.[index];
    const rankText = posRank ? `${params.data.pos}·${formatRank(posRank)}` : "rank NA";
    const overallText = overallRank ? `OVR ${formatRank(overallRank)}` : "OVR NA";
    return `
      <div style="display:flex;justify-content:space-between;gap:16px;margin-top:6px;">
        <span style="opacity:.72">${getStatLabel(statKey)} <span style="opacity:.5">${rankText} · ${overallText}</span></span>
        <strong>${formatComparisonValue(statKey, raw, { compact: true })}</strong>
      </div>
    `;
  }).join("");

  return `
    <div style="min-width:260px;font-family:Product Sans,Google Sans,sans-serif;">
      <div style="font-size:12px;font-weight:900;color:rgba(245,250,255,.95);">${params.name}</div>
      ${statRows}
    </div>
  `;
}

export function buildSeasonRadarOption({ players, statKeys }) {
  const isMobile = isMobileComparisonChart();
  return {
    animationDuration: 620,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    color: players.map((player, index) => getPlayerAccentColor(player, index)),
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "rgba(7, 12, 24, 0.96)",
      borderColor: "rgba(142, 221, 255, 0.2)",
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: "rgba(240, 247, 255, 0.94)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
      extraCssText: "border-radius:16px;box-shadow:0 20px 48px rgba(0,0,0,.38);",
      formatter: (params) => buildRadarTooltip(params, statKeys),
    },
    legend: { show: false },
    radar: {
      center: ["50%", isMobile ? "55%" : "54%"],
      radius: isMobile ? "59%" : "66%",
      startAngle: 90,
      splitNumber: 4,
      axisName: {
        color: "rgba(232,242,255,.86)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: isMobile ? 9 : 11,
        fontWeight: 900,
        formatter: (name) => name,
      },
      axisLine: { lineStyle: { color: "rgba(190,218,255,.12)" } },
      splitLine: { lineStyle: { color: "rgba(190,218,255,.11)" } },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,.035)", "rgba(255,255,255,.018)"],
        },
      },
      indicator: statKeys.map((statKey) => ({
        name: getStatLabel(statKey),
        max: 100,
        min: 0,
      })),
    },
    series: [{
      type: "radar",
      symbol: "circle",
      symbolSize: isMobile ? 6 : 7,
      lineStyle: { width: isMobile ? 2.2 : 2.6 },
      areaStyle: { opacity: 0.13 },
      emphasis: { focus: "self" },
      data: players.map((player, index) => {
        const color = getPlayerAccentColor(player, index);
        return {
          name: getPlayerName(player),
          value: statKeys.map((statKey) => getRadarRankValue(player?.seasonPosRanks?.[statKey], player.pos)),
          rawValues: statKeys.map((statKey) => player?.seasonStats?.[statKey]),
          posRanks: statKeys.map((statKey) => player?.seasonPosRanks?.[statKey]),
          overallRanks: statKeys.map((statKey) => player?.seasonOverallRanks?.[statKey]),
          pos: player.pos,
          itemStyle: { color },
          lineStyle: { color },
          areaStyle: { color, opacity: 0.11 },
        };
      }),
    }],
  };
}
