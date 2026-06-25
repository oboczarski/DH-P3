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

function buildWeeklyTooltip(params, statKey) {
  const entries = Array.isArray(params) ? params : [params];
  const weekLabel = entries[0]?.axisValueLabel || entries[0]?.name || "";
  const lines = entries
    .filter((entry) => entry?.data && entry.data.rawValue !== null && entry.data.rawValue !== undefined)
    .map((entry) => {
      const rank = entry.data.rank ? ` <span style="opacity:.58">(${entry.data.pos}·${entry.data.rank})</span>` : "";
      const opponent = entry.data.opponent ? ` <span style="opacity:.58">${entry.data.opponent}</span>` : "";
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:8px;">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${entry.color};margin-right:6px;"></span>${entry.seriesName}${opponent}${rank}</span>
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

  return {
    animationDuration: 620,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    grid: { top: 42, right: 24, bottom: 42, left: 54, containLabel: false },
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
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: safeWeeks.map((week) => `wk${week}`),
      axisLine: { lineStyle: { color: "rgba(190, 218, 255, 0.16)" } },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        color: "rgba(205, 220, 245, 0.58)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      min: axis.min,
      max: axis.max,
      inverse: axis.inverse,
      name: getStatLabel(statKey),
      nameTextStyle: {
        color: "rgba(205, 220, 245, 0.62)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 10,
        fontWeight: 900,
        padding: [0, 0, 6, 0],
      },
      splitLine: { lineStyle: { color: "rgba(190, 218, 255, 0.1)" } },
      axisLabel: {
        color: "rgba(205, 220, 245, 0.52)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        formatter: (value) => formatComparisonValue(statKey, value, { compact: true }),
      },
    },
    series: players.map((player, index) => {
      const accent = getPlayerAccentColor(player, index);
      const gradient = buildThresholdGradient(player, index, statKey, thresholds, axis);
      return {
        name: getPlayerName(player),
        type: "line",
        smooth: 0.42,
        connectNulls: false,
        symbol: player.teamLogoSrc ? `image://${player.teamLogoSrc}` : "circle",
        symbolSize: player.teamLogoSrc ? 22 : 8,
        showSymbol: true,
        lineStyle: {
          width: 3.5,
          color: gradient,
          shadowColor: accent,
          shadowBlur: 12,
          shadowOffsetY: 4,
        },
        itemStyle: {
          color: accent,
          borderColor: "rgba(4,8,16,.94)",
          borderWidth: 2,
        },
        areaStyle: {
          opacity: 0.08,
          color: gradient,
        },
        label: {
          show: true,
          color: "rgba(244,248,255,.88)",
          fontFamily: "Product Sans, Google Sans, sans-serif",
          fontSize: 10,
          fontWeight: 900,
          textBorderColor: "rgba(4,8,16,.88)",
          textBorderWidth: 3,
          formatter: (params) => {
            if (!params.data || params.data.rawValue === null) return "";
            const rank = params.data.rank ? `(${params.data.pos}·${params.data.rank})` : "";
            return `${formatComparisonValue(statKey, params.data.rawValue, { compact: true })}${rank}`;
          },
        },
        labelLayout: { hideOverlap: true },
        emphasis: {
          focus: "series",
          lineStyle: { width: 4.5 },
        },
        data: safeWeeks.map((week, weekIndex) => {
          const entry = getWeeklyEntry(player, week);
          const rawValue = toFiniteNumber(entry?.stats?.[statKey]);
          const rank = entry?.ranks?.[statKey] || null;
          return {
            value: rawValue === null ? null : clamp(rawValue, axis.min, axis.max),
            rawValue,
            rank,
            pos: player.pos,
            opponent: entry?.opponent || "",
            label: {
              position: ((weekIndex + index) % 2 === 0) ? "top" : "bottom",
              distance: 8 + (index * 3),
            },
          };
        }),
      };
    }),
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
