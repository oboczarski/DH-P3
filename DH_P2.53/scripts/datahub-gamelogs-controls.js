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
// Only positive production/volume stats receive the baseline exception. Zero
// turnovers can be a good result; signed and rate/efficiency metrics retain
// their own ranking semantics, and default PPR FPTS never uses this exception.
const CONSISTENCY_PRODUCTION_STATS = new Set([
  "pass_yd", "pass_td", "pass_att", "pass_cmp", "pass_fd", "pass_imp", "dropbacks",
  "rush_att", "rush_yd", "rush_td", "rush_fd", "rush_yac", "rush_ybc", "mtf", "rz_att", "gl_att",
  "rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rr", "rz_tgt", "tgt_10_plus",
  "yds_total", "imp", "imp_per_g",
]);

export function buildConsistencyRankChart(series, position, statKey = "") {
  const zones = getConsistencyRankZones(position);
  const rankMax = Math.max(position === "WR" ? 60 : 48, ...series.map(({ rank }) => rank));
  const plotValue = (rank) => ((rankMax + 1 - rank) / rankMax) * 40;
  return {
    rankMode: true,
    rankZones: zones,
    rankMax,
    thresholds: { high: plotValue(zones.greenEnd + 0.5), solid: plotValue(zones.blueEnd + 0.5) },
    chartSeries: series.map((entry) => {
      // A sparse touchdown/yardage pool can rank a zero in the top 12. Keep
      // its true value/rank, but show no production at the low-zone baseline.
      const baselineProduction = CONSISTENCY_PRODUCTION_STATS.has(statKey) && entry.value <= 0;
      return { ...entry, pts: baselineProduction ? 0 : plotValue(entry.rank), originalPts: entry.value, baselineProduction };
    }),
  };
}
