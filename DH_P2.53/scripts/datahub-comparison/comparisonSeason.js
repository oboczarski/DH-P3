import { getPlayerName, getStatLabel, isLowerBetterForPosition, toFiniteNumber } from "./comparisonStats.js";

// Compare's season visualizations read the existing page-owned season snapshot.
// No weekly sums, projections, extra feeds, or invented ranks replace a value.
export const SEASON_PLAYER_TONES = Object.freeze([
  Object.freeze({ start: "#ffd08a", mid: "#ff9a68", end: "#ed667b" }),
  Object.freeze({ start: "#d6c4ff", mid: "#a293ed", end: "#748bdb" }),
]);

// Exact Game Logs consistency-dial palettes and seven equal progress bands.
// A recorded zero belongs to pink; unavailable data retains a neutral dial.
const DIAL_PALETTES = [
  ["pink", "#ff0aa5", "#ff82d7", "#ff0aa5", "#bc3dff"],
  ["magenta", "#d747ff", "#ef83ff", "#d747ff", "#986cff"],
  ["violet", "#8b6cff", "#d09bff", "#8b6cff", "#5f79ff"],
  ["blue", "#4d79ff", "#a68dff", "#6870ff", "#16a9ff"],
  ["cyan", "#00a9ff", "#69a9ff", "#009fff", "#00d7f2"],
  ["teal", "#00dcca", "#50e8ff", "#00dcca", "#27ef9f"],
  ["green", "#55e58f", "#8fffc0", "#55e58f", "#00d9b0"],
];

export function getConsistencyDial(value) {
  const rate = toFiniteNumber(value);
  const progress = rate === null ? 0 : Math.max(0, Math.min(100, rate)) / 100;
  const [tone, accent, start, mid, end] = rate === null
    ? ["neutral", "#91a0ba", "#cbd5e1", "#a8b3cb", "#8291ac"]
    : DIAL_PALETTES[Math.min(6, Math.floor(progress * 7))];
  return { rate, progress, tone, accent, start, mid, end, hasProgress: rate !== null && progress > 0 };
}

export function getSeasonPlayerLabel(player) {
  if (!player) return "Player 2";
  const parts = getPlayerName(player).trim().split(/\s+/);
  return parts.length < 2 ? parts[0] : `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

const METRIC_BUNDLES = {
  QB: {
    production: ["fpts", "ppg", "pass_yd", "pass_td", "pass_att", "rush_yd"],
    efficiency: ["epa_per_db", "cmp_pct", "pass_rtg", "cpoe", "ttt", "prs_pct"],
  },
  RB: {
    production: ["fpts", "ppg", "rush_yd", "rush_att", "rec_yd", "rec", "rush_td", "imp"],
    efficiency: ["ypc", "yco_per_att", "mtf_per_att", "yprr", "ts_per_rr", "snp_pct"],
  },
  RECEIVING: {
    production: ["fpts", "ppg", "rec_yd", "rec_tgt", "rec", "rec_td", "rec_yar", "imp"],
    efficiency: ["yprr", "ypr", "ts_per_rr", "rec_yms", "first_down_rec_rate", "snp_pct"],
  },
  SKILL: {
    production: ["fpts", "ppg", "yds_total", "rec_yd", "rec", "rec_td", "imp", "games_played"],
    efficiency: ["yprr", "ypr", "ts_per_rr", "imp_per_g", "snp_pct", "csty_pct"],
  },
  MIXED: {
    production: ["fpts", "ppg", "yds_total", "imp", "games_played", "ceiling"],
    efficiency: ["ppg", "imp_per_g", "snp_pct", "csty_pct", "ceiling"],
  },
};

export function getSeasonComparisonFamily(players) {
  const positions = new Set(players.map(player => String(player.pos).toUpperCase()));
  if (positions.size === 1 && positions.has("QB")) return "QB";
  if (positions.size === 1 && positions.has("RB")) return "RB";
  if ([...positions].every(pos => pos === "WR" || pos === "TE")) return "RECEIVING";
  return positions.has("QB") ? "MIXED" : "SKILL";
}

export function buildSeasonMetricRows(players, mode = "production") {
  const family = getSeasonComparisonFamily(players);
  return METRIC_BUNDLES[family][mode === "efficiency" ? "efficiency" : "production"].map(key => {
    const values = [0, 1].map(index => toFiniteNumber(players[index]?.seasonStats?.[key]));
    const available = values.filter(value => value !== null);
    const min = Math.min(0, ...available);
    const max = Math.max(0, ...available);
    const range = max - min || 1;
    const lowerBetter = players.length > 0 && players.every(player => isLowerBetterForPosition(player.pos, key));
    const difference = values.every(value => value !== null) ? values[0] - values[1] : null;
    const winner = difference === null || Math.abs(difference) < 1e-10
      ? null : ((lowerBetter ? difference < 0 : difference > 0) ? 0 : 1);
    return { key, label: getStatLabel(key), values, lowerBetter, winner, difference,
      positions: values.map(value => value === null ? null : 12 + ((value - min) / range) * 276),
      zero: 12 + ((0 - min) / range) * 276,
    };
  });
}

const MIX_COMPONENTS = {
  yards: [["pass_yd", "Passing"], ["rush_yd", "Rushing"], ["rec_yd", "Receiving"]],
  touchdowns: [["pass_td", "Passing"], ["rush_td", "Rushing"], ["rec_td", "Receiving"]],
};

export function buildSeasonProductionMix(players, mode = "yards") {
  const components = MIX_COMPONENTS[mode === "touchdowns" ? "touchdowns" : "yards"]
    .filter((_, index) => index !== 0 || players.some(player => player.pos === "QB"));
  const rows = players.map(player => {
    const parts = components.map(([key, label]) => ({ key, label, value: toFiniteNumber(player.seasonStats?.[key]) }));
    const available = parts.filter(part => part.value !== null);
    const positiveTotal = available.reduce((sum, part) => sum + Math.max(0, part.value), 0);
    const total = available.length ? available.reduce((sum, part) => sum + part.value, 0) : null;
    return { player, parts, positiveTotal, total, complete: available.length === parts.length,
      hasNegative: available.some(part => part.value < 0) };
  });
  return { components, rows, max: Math.max(1, ...rows.map(row => row.positiveTotal)) };
}

export function buildSeasonScatter(players) {
  const family = getSeasonComparisonFamily(players);
  const axes = family === "QB" ? ["pass_att", "epa_per_db", "Pass attempts", "EPA / dropback"]
    : family === "RB" ? ["rush_att", "ypc", "Carries", "Yards / carry"]
    : family === "RECEIVING" ? ["rr", "yprr", "Routes run", "Yards / route"]
    : family === "SKILL" ? ["rec_tgt", "yprr", "Targets", "Yards / route"]
    : ["games_played", "ppg", "Games played", "Points / game"];
  const [xKey, yKey, xLabel, yLabel] = axes;
  const points = players.map((player, index) => ({ player, index,
    x: toFiniteNumber(player.seasonStats?.[xKey]), y: toFiniteNumber(player.seasonStats?.[yKey]) }));
  const visible = points.filter(point => point.x !== null && point.y !== null);
  const xMin = Math.min(0, ...visible.map(point => point.x));
  const xMax = Math.max(1, ...visible.map(point => point.x));
  const yMin = Math.min(0, ...visible.map(point => point.y));
  const yMax = Math.max(0, ...visible.map(point => point.y));
  return { points, visible, xKey, yKey, xLabel, yLabel,
    xMin, xMax: xMax + (xMax - xMin) * 0.18,
    yMin: yMin < 0 ? yMin - (yMax - yMin) * 0.15 : 0,
    yMax: yMax + (yMax - yMin || 1) * 0.22,
  };
}
