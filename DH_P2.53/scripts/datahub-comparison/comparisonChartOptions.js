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

function getWeeklyEntry(player, week) {
  return (player?.weeklySeries || []).find((item) => item.week === week) || null;
}

function getThresholdValue(config, category) {
  return toFiniteNumber(config?.[category]?.value);
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
      const value = toFiniteNumber(entry?.stats?.[statKey]);
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
  const lowerBetter = players.length > 0 && players.every((player) => isLowerBetterForPosition(player.pos, statKey));
  return {
    min: Math.max(0, rawMin - padding),
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

  const inverse = axis.inverse;
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

function hexToRgba(color, alpha) {
  const match = String(color || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!match) {
    return `rgba(115, 239, 255, ${alpha})`;
  }
  const value = match[1];
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getPointColorForValue(player, playerIndex, statKey, thresholds, rawValue) {
  const value = toFiniteNumber(rawValue);
  const palette = getPlayerPalette(player, playerIndex);
  const config = getThresholdConfig(thresholds, player.pos, statKey);
  if (value === null || !config) {
    return getPlayerAccentColor(player, playerIndex);
  }
  const high = getThresholdValue(config, "HIGH");
  const midHigh = getThresholdValue(config, "MID-HIGH");
  const midLow = getThresholdValue(config, "MID-LOW");
  const low = getThresholdValue(config, "LOW");
  const lowerBetter = isLowerBetterForPosition(player.pos, statKey);

  if (lowerBetter) {
    if (high !== null && value <= high) return palette.high;
    if (midHigh !== null && value <= midHigh) return palette.highMid;
    if (midLow !== null && value <= midLow) return palette.lowMid;
    if (low !== null && value <= low) return palette.low;
    return palette.low;
  }

  if (high !== null && value >= high) return palette.high;
  if (midHigh !== null && value >= midHigh) return palette.highMid;
  if (midLow !== null && value >= midLow) return palette.lowMid;
  if (low !== null && value >= low) return palette.low;
  return palette.low;
}

function isCompactChartViewport() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(max-width: 719px)").matches;
}

function getWeeklyChartMetrics() {
  const mobile = isCompactChartViewport();
  return {
    mobile,
    areaOpacity: mobile ? 0.025 : 0.035,
    grid: mobile
      ? { top: 10, right: 4, bottom: 24, left: 2, containLabel: false }
      : { top: 14, right: 16, bottom: 34, left: 38, containLabel: false },
    labelFontSize: mobile ? 9 : 10,
    rankFontSize: mobile ? 7 : 8,
    lineWidth: mobile ? 2.8 : 3.25,
    logoSize: mobile ? 17 : 20,
    maskSize: mobile ? 27 : 31,
  };
}

function getWeeklyRawValue(entry, statKey) {
  if (!entry || entry.isSkipped) {
    return null;
  }
  return toFiniteNumber(entry?.stats?.[statKey]);
}

function getPlottedValue(rawValue, axis) {
  const value = toFiniteNumber(rawValue);
  return value === null ? null : clamp(value, axis.min, axis.max);
}

function getNormalizedAxisValue(value, axis) {
  const numericValue = toFiniteNumber(value);
  const span = axis.max - axis.min;
  if (numericValue === null || !Number.isFinite(span) || span === 0) {
    return null;
  }
  return Math.max(0, Math.min(1, (numericValue - axis.min) / span));
}

function getLaneOffsets(count) {
  if (count <= 1) return [0];
  if (count === 2) return [-17, 17];
  return [-28, 0, 28];
}

function buildWeeklyLaneMap(players, weeks, statKey, axis) {
  const laneMap = new Map();
  weeks.forEach((week) => {
    const items = players
      .map((player, playerIndex) => {
        const entry = getWeeklyEntry(player, week);
        const rawValue = getWeeklyRawValue(entry, statKey);
        const plottedValue = getPlottedValue(rawValue, axis);
        return {
          playerId: player.id,
          playerIndex,
          plottedValue,
          normalized: getNormalizedAxisValue(plottedValue, axis),
        };
      })
      .filter((item) => item.normalized !== null)
      .sort((left, right) => left.normalized - right.normalized);

    const groups = [];
    items.forEach((item) => {
      const lastGroup = groups[groups.length - 1];
      const previous = lastGroup?.[lastGroup.length - 1];
      if (!previous || Math.abs(item.normalized - previous.normalized) > 0.055) {
        groups.push([item]);
        return;
      }
      lastGroup.push(item);
    });

    groups.forEach((group) => {
      const offsets = getLaneOffsets(group.length);
      group
        .sort((left, right) => left.playerIndex - right.playerIndex)
        .forEach((item, index) => {
          laneMap.set(`${item.playerId}:${week}`, offsets[index] || 0);
        });
    });
  });
  return laneMap;
}

function getInterpolatedSkipValue(lineData, index) {
  const previous = [...lineData].slice(0, index).reverse().find((item) => toFiniteNumber(item?.value) !== null);
  const next = lineData.slice(index + 1).find((item) => toFiniteNumber(item?.value) !== null);
  if (previous && next && next.week !== previous.week) {
    const ratio = (lineData[index].week - previous.week) / (next.week - previous.week);
    return previous.value + ((next.value - previous.value) * ratio);
  }
  if (previous) return previous.value;
  if (next) return next.value;
  return null;
}

function buildWeeklyTooltip(params, statKey) {
  const entries = Array.isArray(params) ? params : [params];
  const weekLabel = entries[0]?.axisValueLabel || entries[0]?.name || "";
  const lines = entries
    .filter((entry) => entry?.seriesType === "line" && entry?.data && entry.data.rawValue !== null && entry.data.rawValue !== undefined)
    .map((entry) => {
      const rank = entry.data.rank ? ` <span style="opacity:.58">(${entry.data.pos}·${entry.data.rank})</span>` : "";
      const opponent = entry.data.opponent ? ` <span style="opacity:.58">${entry.data.opponent}</span>` : "";
      const color = entry.data.pointColor || entry.color || "rgba(115, 239, 255, .9)";
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:8px;">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${color};margin-right:6px;"></span>${entry.seriesName}${opponent}${rank}</span>
          <strong>${formatComparisonValue(statKey, entry.data.rawValue)}</strong>
        </div>
      `;
    })
    .join("");

  return `
    <div style="min-width:220px;font-family:Product Sans,Google Sans,sans-serif;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(226,238,255,.58);">${weekLabel}</div>
      ${lines || '<div style="margin-top:6px;color:rgba(226,238,255,.68);">No stat recorded</div>'}
    </div>
  `;
}

export function buildWeeklyChartOption({ players, statKey, weeks, thresholds }) {
  const safeWeeks = Array.isArray(weeks) && weeks.length
    ? weeks
    : Array.from({ length: 18 }, (_, index) => index + 1);
  const axis = getAxisConfig(players, statKey, thresholds);
  const metrics = getWeeklyChartMetrics();
  const weekLabels = safeWeeks.map((week) => `wk${week}`);
  const laneMap = buildWeeklyLaneMap(players, safeWeeks, statKey, axis);
  const chartBackgroundColor = "rgba(4, 9, 17, 0.98)";
  const series = [];

  players.forEach((player, index) => {
    const accent = getPlayerAccentColor(player, index);
    const gradient = buildThresholdGradient(player, index, statKey, thresholds, axis);
    const lineData = safeWeeks.map((week) => {
      const entry = getWeeklyEntry(player, week);
      const rawValue = getWeeklyRawValue(entry, statKey);
      const plottedValue = getPlottedValue(rawValue, axis);
      const pointColor = getPointColorForValue(player, index, statKey, thresholds, rawValue);
      return {
        week,
        value: plottedValue,
        rawValue,
        pointColor,
        rank: entry?.ranks?.[statKey] || null,
        pos: player.pos,
        opponent: entry?.opponent || "",
        isSkipped: Boolean(entry?.isSkipped),
        skipReason: entry?.skipReason || "",
      };
    });
    const pointData = lineData
      .filter((entry) => entry.rawValue !== null && entry.value !== null)
      .map((entry) => {
        const laneOffset = laneMap.get(`${player.id}:${entry.week}`) || 0;
        const labelText = `${formatComparisonValue(statKey, entry.rawValue, { compact: true })}${entry.rank ? `(${entry.pos}·${entry.rank})` : ""}`;
        return {
          value: [`wk${entry.week}`, entry.value],
          rawValue: entry.rawValue,
          pointColor: entry.pointColor,
          symbolOffset: [laneOffset, 0],
          label: {
            show: true,
            position: "top",
            distance: 1,
            offset: [laneOffset, -1],
            color: "rgba(248, 252, 255, 0.96)",
            backgroundColor: hexToRgba(entry.pointColor, 0.16),
            borderColor: hexToRgba(entry.pointColor, 0.28),
            borderWidth: 1,
            borderRadius: 7,
            padding: metrics.mobile ? [2, 4, 2, 4] : [2, 5, 2, 5],
            formatter: () => labelText,
            rich: {
              value: {
                fontSize: metrics.labelFontSize,
                fontWeight: 950,
                color: "rgba(248, 252, 255, 0.96)",
              },
              rank: {
                fontSize: metrics.rankFontSize,
                fontWeight: 850,
                color: "rgba(215, 229, 250, 0.76)",
              },
            },
            fontFamily: "Product Sans, Google Sans, sans-serif",
            fontSize: metrics.labelFontSize,
            fontWeight: 950,
          },
        };
      });
    const logoPointData = pointData.map((entry) => ({
      ...entry,
      label: {
        ...entry.label,
        formatter: () => {
          const rawText = formatComparisonValue(statKey, entry.rawValue, { compact: true });
          const matchingLine = lineData.find((item) => item.rawValue === entry.rawValue && `wk${item.week}` === entry.value[0]);
          const rank = matchingLine?.rank ? `(${matchingLine.pos}·${matchingLine.rank})` : "";
          return `{value|${rawText}}{rank|${rank}}`;
        },
      },
    }));
    const skipData = lineData
      .map((entry, weekIndex) => {
        if (!entry.isSkipped || !entry.skipReason) {
          return null;
        }
        const interpolatedValue = getInterpolatedSkipValue(lineData, weekIndex);
        if (interpolatedValue === null) {
          return null;
        }
        const laneOffset = laneMap.get(`${player.id}:${entry.week}`) || 0;
        return {
          value: [`wk${entry.week}`, interpolatedValue],
          symbolOffset: [laneOffset, 0],
          skipReason: entry.skipReason,
          label: {
            show: true,
            position: "top",
            distance: 2,
            offset: [laneOffset, 0],
            formatter: () => entry.skipReason,
            color: "rgba(226, 238, 255, 0.82)",
            backgroundColor: "rgba(9, 16, 30, 0.88)",
            borderColor: hexToRgba(accent, 0.28),
            borderWidth: 1,
            borderRadius: 8,
            padding: [2, 6, 2, 6],
            fontFamily: "Product Sans, Google Sans, sans-serif",
            fontSize: metrics.mobile ? 8 : 9,
            fontWeight: 900,
          },
        };
      })
      .filter(Boolean);

    series.push({
      id: `${player.id}-line`,
      name: getPlayerName(player),
      type: "line",
      smooth: 0.42,
      connectNulls: true,
      showSymbol: false,
      data: lineData,
      lineStyle: {
        width: metrics.lineWidth,
        color: gradient,
        shadowColor: accent,
        shadowBlur: metrics.mobile ? 8 : 12,
        shadowOffsetY: 3,
      },
      areaStyle: {
        opacity: metrics.areaOpacity,
        color: gradient,
      },
      emphasis: {
        focus: "series",
        lineStyle: { width: metrics.lineWidth + 0.8 },
      },
      z: 2 + index,
    });

    series.push({
      id: `${player.id}-mask`,
      name: `${getPlayerName(player)} mask`,
      type: "scatter",
      data: pointData.map((entry) => ({ value: entry.value, symbolOffset: entry.symbolOffset })),
      symbol: "circle",
      symbolSize: metrics.maskSize,
      itemStyle: {
        color: chartBackgroundColor,
        borderColor: "rgba(190, 218, 255, 0.18)",
        borderWidth: 1,
      },
      tooltip: { show: false },
      silent: true,
      z: 8 + index,
    });

    series.push({
      id: `${player.id}-logo`,
      name: getPlayerName(player),
      type: "scatter",
      data: logoPointData,
      symbol: player.teamLogoSrc ? `image://${player.teamLogoSrc}` : "circle",
      symbolSize: player.teamLogoSrc ? metrics.logoSize : Math.max(8, metrics.logoSize - 8),
      itemStyle: {
        color: accent,
        borderColor: chartBackgroundColor,
        borderWidth: 2,
      },
      labelLayout: { hideOverlap: true, moveOverlap: "shiftY" },
      emphasis: { focus: "series" },
      tooltip: { show: false },
      z: 10 + index,
    });

    if (skipData.length) {
      series.push({
        id: `${player.id}-skips`,
        name: `${getPlayerName(player)} skipped weeks`,
        type: "scatter",
        data: skipData,
        symbol: "circle",
        symbolSize: 2,
        itemStyle: { color: hexToRgba(accent, 0.32) },
        labelLayout: { hideOverlap: true },
        tooltip: { show: false },
        silent: true,
        z: 14 + index,
      });
    }
  });

  return {
    animationDuration: 620,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    grid: metrics.grid,
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
      boundaryGap: false,
      data: weekLabels,
      axisLine: { lineStyle: { color: "rgba(190, 218, 255, 0.16)" } },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        color: "rgba(205, 220, 245, 0.58)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: metrics.mobile ? 8 : 10,
        margin: metrics.mobile ? 5 : 8,
      },
    },
    yAxis: {
      type: "value",
      min: axis.min,
      max: axis.max,
      inverse: axis.inverse,
      name: "",
      splitLine: { lineStyle: { color: "rgba(190, 218, 255, 0.1)" } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        inside: metrics.mobile,
        margin: metrics.mobile ? 2 : 8,
        color: "rgba(205, 220, 245, 0.52)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: metrics.mobile ? 8 : 10,
        formatter: (value) => formatComparisonValue(statKey, value, { compact: true }),
      },
    },
    series,
  };
}

function buildRadarTooltip(params, statKeys) {
  const statRows = statKeys.map((statKey, index) => {
    const value = params.value?.[index];
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
    legend: {
      top: 4,
      left: 8,
      itemWidth: 18,
      itemHeight: 8,
      textStyle: {
        color: "rgba(224, 235, 255, 0.72)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 11,
        fontWeight: 800,
      },
    },
    radar: {
      center: ["50%", "54%"],
      radius: "66%",
      startAngle: 90,
      splitNumber: 4,
      axisName: {
        color: "rgba(232,242,255,.86)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 11,
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
      symbolSize: 7,
      lineStyle: { width: 2.6 },
      areaStyle: { opacity: 0.16 },
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
          areaStyle: { color, opacity: 0.13 },
        };
      }),
    }],
  };
}
