import {
  COMPARISON_PLAYER_COLORS,
  formatComparisonValue,
  getStatDefinition,
  getStatLabel,
  toFiniteNumber,
} from "./comparisonStats.js";

function getPlayerColor(index) {
  return COMPARISON_PLAYER_COLORS[index % COMPARISON_PLAYER_COLORS.length];
}

function getPlayerLabel(player) {
  return player?.name || player?.fullName || "Player";
}

function getWeeklyStatValue(player, week, statKey) {
  const entry = (player?.weeklySeries || []).find((item) => item.week === week);
  return {
    value: toFiniteNumber(entry?.stats?.[statKey]),
    opponent: entry?.opponent || "",
  };
}

function buildWeeklyTooltip(params, statKey) {
  const entries = Array.isArray(params) ? params : [params];
  const weekLabel = entries[0]?.axisValueLabel || entries[0]?.name || "";
  const lines = entries
    .filter((entry) => entry?.data && entry.data.value !== null && entry.data.value !== undefined)
    .map((entry) => {
      const rawValue = entry.data.rawValue;
      const opponent = entry.data.opponent ? ` <span style="opacity:.62">vs ${entry.data.opponent}</span>` : "";
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:6px;">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${entry.color};margin-right:6px;"></span>${entry.seriesName}${opponent}</span>
          <strong>${formatComparisonValue(statKey, rawValue)}</strong>
        </div>
      `;
    })
    .join("");

  return `
    <div style="min-width:190px;font-family:Product Sans,Google Sans,sans-serif;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(226,238,255,.58);">${weekLabel}</div>
      ${lines || '<div style="margin-top:6px;color:rgba(226,238,255,.68);">No stat recorded</div>'}
    </div>
  `;
}

export function buildWeeklyChartOption({ players, statKey, weeks }) {
  const safeWeeks = Array.isArray(weeks) && weeks.length
    ? weeks
    : Array.from({ length: 18 }, (_, index) => index + 1);
  const definition = getStatDefinition(statKey);

  return {
    animationDuration: 520,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    color: players.map((_, index) => getPlayerColor(index)),
    grid: { top: 28, right: 20, bottom: 42, left: 46, containLabel: false },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(7, 12, 24, 0.96)",
      borderColor: "rgba(142, 221, 255, 0.18)",
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
      top: 0,
      left: 0,
      itemWidth: 16,
      itemHeight: 7,
      textStyle: {
        color: "rgba(224, 235, 255, 0.72)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 11,
        fontWeight: 700,
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: safeWeeks.map((week) => `WK${week}`),
      axisLine: { lineStyle: { color: "rgba(190, 218, 255, 0.16)" } },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(205, 220, 245, 0.52)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      name: definition.label,
      nameTextStyle: {
        color: "rgba(205, 220, 245, 0.58)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        padding: [0, 0, 6, 0],
      },
      splitLine: { lineStyle: { color: "rgba(190, 218, 255, 0.08)" } },
      axisLabel: {
        color: "rgba(205, 220, 245, 0.5)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        formatter: (value) => formatComparisonValue(statKey, value, { compact: true }),
      },
    },
    series: players.map((player, index) => ({
      name: getPlayerLabel(player),
      type: "line",
      smooth: true,
      connectNulls: false,
      symbol: "circle",
      symbolSize: 7,
      showSymbol: true,
      lineStyle: {
        width: 3,
        color: getPlayerColor(index),
        shadowColor: getPlayerColor(index),
        shadowBlur: 10,
        shadowOffsetY: 4,
      },
      itemStyle: {
        color: getPlayerColor(index),
        borderColor: "rgba(4,8,16,.92)",
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.08,
        color: getPlayerColor(index),
      },
      emphasis: {
        focus: "series",
        lineStyle: { width: 4 },
      },
      data: safeWeeks.map((week) => {
        const stat = getWeeklyStatValue(player, week, statKey);
        return {
          value: stat.value,
          rawValue: stat.value,
          opponent: stat.opponent,
        };
      }),
    })),
  };
}

function getSeasonRawValue(player, statKey) {
  return toFiniteNumber(player?.seasonStats?.[statKey]);
}

function getNormalizedSeasonValue(players, statKey, player) {
  const values = players
    .map((entry) => getSeasonRawValue(entry, statKey))
    .filter((value) => value !== null);
  if (!values.length) {
    return 0;
  }
  const maxValue = Math.max(...values.map((value) => Math.abs(value)));
  if (!maxValue) {
    return 0;
  }
  const rawValue = getSeasonRawValue(player, statKey);
  return rawValue === null ? 0 : Math.round((Math.abs(rawValue) / maxValue) * 1000) / 10;
}

function buildSeasonTooltip(params, statKeys) {
  const entries = Array.isArray(params) ? params : [params];
  const statIndex = entries[0]?.dataIndex ?? 0;
  const statKey = statKeys[statIndex];
  const statLabel = getStatLabel(statKey);
  const lines = entries
    .filter((entry) => entry?.data)
    .map((entry) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:6px;">
        <span><span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:${entry.color};margin-right:6px;"></span>${entry.seriesName}</span>
        <strong>${formatComparisonValue(statKey, entry.data.rawValue)}</strong>
      </div>
    `)
    .join("");

  return `
    <div style="min-width:190px;font-family:Product Sans,Google Sans,sans-serif;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(226,238,255,.58);">${statLabel}</div>
      ${lines || '<div style="margin-top:6px;color:rgba(226,238,255,.68);">No season value</div>'}
    </div>
  `;
}

export function buildSeasonChartOption({ players, statKeys }) {
  const labels = statKeys.map(getStatLabel);

  return {
    animationDuration: 520,
    animationEasing: "cubicOut",
    backgroundColor: "transparent",
    color: players.map((_, index) => getPlayerColor(index)),
    grid: { top: 28, right: 54, bottom: 18, left: 74, containLabel: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      confine: true,
      backgroundColor: "rgba(7, 12, 24, 0.96)",
      borderColor: "rgba(142, 221, 255, 0.18)",
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: "rgba(240, 247, 255, 0.94)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
      extraCssText: "border-radius:16px;box-shadow:0 20px 48px rgba(0,0,0,.38);",
      formatter: (params) => buildSeasonTooltip(params, statKeys),
    },
    legend: {
      top: 0,
      left: 0,
      itemWidth: 16,
      itemHeight: 7,
      textStyle: {
        color: "rgba(224, 235, 255, 0.72)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 11,
        fontWeight: 700,
      },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 100,
      show: false,
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(224, 235, 255, 0.7)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontSize: 11,
        fontWeight: 700,
      },
    },
    series: players.map((player, index) => ({
      name: getPlayerLabel(player),
      type: "bar",
      barWidth: 9,
      barGap: "22%",
      itemStyle: {
        color: getPlayerColor(index),
        borderRadius: [999, 999, 999, 999],
        shadowColor: getPlayerColor(index),
        shadowBlur: 10,
        shadowOffsetY: 2,
      },
      label: {
        show: true,
        position: "right",
        color: "rgba(230, 240, 255, 0.76)",
        fontSize: 10,
        fontFamily: "Product Sans, Google Sans, sans-serif",
        formatter: (params) => formatComparisonValue(statKeys[params.dataIndex], params.data.rawValue, { compact: true }),
      },
      emphasis: { focus: "series" },
      data: statKeys.map((statKey) => ({
        value: getNormalizedSeasonValue(players, statKey, player),
        rawValue: getSeasonRawValue(player, statKey),
      })),
    })),
  };
}
