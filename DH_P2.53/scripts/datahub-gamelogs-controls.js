// DataHub Game Logs only: one content state drives both navigation surfaces.
// Season Stats and the radar share Performance; Career retains its table mode.
export function resolveGameLogsNavigation(view) {
  const content = ["gl", "szn", "career", "performance", "consistency", "key"].includes(view) ? view : "gl";
  const performance = content === "performance" || content === "szn";
  return {
    content,
    topView: performance ? "szn" : content === "career" ? "career" : "gl",
    navView: performance ? "performance" : content === "consistency" ? "consistency" : content === "key" ? "key" : "gl",
    performanceAction: performance ? (content === "szn" ? "performance" : "szn") : null,
  };
}

// Non-FPTS charts rank recorded games within the player's own position/week.
// Missing values are excluded, real zero/negative values participate, and ties
// use competition ranks (1, 1, 3). Never mutate the authoritative weekly rows.
export function rankWeeklyMetricValues(entries, lowerBetter = false) {
  const sorted = entries.filter(({ value }) => Number.isFinite(value))
    .slice().sort((a, b) => lowerBetter ? a.value - b.value : b.value - a.value);
  const ranks = new Map();
  let previous = null;
  let rank = 0;
  sorted.forEach(({ playerId, value }, index) => {
    if (value !== previous) rank = index + 1;
    ranks.set(playerId, rank);
    previous = value;
  });
  return ranks;
}

export function getConsistencyRankZones(position) {
  const blueEnd = position === "WR" ? 30 : 24;
  return { greenEnd: 12, blueEnd, purpleStart: blueEnd + 1 };
}

// Reuse the existing SVG's 0–40 drawing space for an inverted positional-rank
// axis. Raw metric values remain separate from plot coordinates and labels.
export function buildConsistencyRankChart(series, position) {
  const zones = getConsistencyRankZones(position);
  const rankMax = Math.max(position === "WR" ? 60 : 48, ...series.map(({ rank }) => rank));
  const plotValue = (rank) => ((rankMax + 1 - rank) / rankMax) * 40;
  return {
    rankMode: true,
    rankZones: zones,
    rankMax,
    thresholds: { high: plotValue(zones.greenEnd + 0.5), solid: plotValue(zones.blueEnd + 0.5) },
    chartSeries: series.map((entry) => ({ ...entry, pts: plotValue(entry.rank), originalPts: entry.value })),
  };
}
