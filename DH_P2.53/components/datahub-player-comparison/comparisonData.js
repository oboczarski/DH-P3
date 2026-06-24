export const MAX_SELECTED_PLAYERS = 3;
export const DEFAULT_WEEKLY_STAT = "fpts";

const POSITION_ORDER = ["QB", "RB", "WR", "TE"];
const PLAYER_COLORS = ["#70e4ff", "#a88cff", "#72f1bf"];

const WEEKLY_STAT_CANDIDATES = [
  "fpts",
  "proj",
  "snp_pct",
  "pass_att",
  "pass_cmp",
  "pass_yd",
  "pass_td",
  "pass_rtg",
  "rush_att",
  "rush_yd",
  "rush_td",
  "rec_tgt",
  "rec",
  "rec_yd",
  "rec_td",
  "rr",
  "yprr",
  "ts_per_rr",
  "yds_total",
  "fpoe",
];

const METRIC_DEFINITIONS = {
  fpts: { key: "fpts", label: "FPTS", rankKey: "fpt_ppr", decimals: 1 },
  ppg: { key: "ppg", label: "PPG", rankKey: "ppg", decimals: 1 },
  games_played: { key: "games_played", label: "G", rankKey: "games_played", decimals: 0 },
  pass_yd: { key: "pass_yd", label: "paYDS", decimals: 0 },
  pass_td: { key: "pass_td", label: "paTD", decimals: 0 },
  pass_att: { key: "pass_att", label: "paATT", decimals: 0 },
  rush_att: { key: "rush_att", label: "CAR", decimals: 0 },
  rush_yd: { key: "rush_yd", label: "ruYDS", decimals: 0 },
  rush_td: { key: "rush_td", label: "ruTD", decimals: 0 },
  rec_tgt: { key: "rec_tgt", label: "TGT", decimals: 0 },
  rec: { key: "rec", label: "REC", decimals: 0 },
  rec_yd: { key: "rec_yd", label: "recYDS", decimals: 0 },
  rec_td: { key: "rec_td", label: "recTD", decimals: 0 },
  rr: { key: "rr", label: "RR", decimals: 0 },
  yprr: { key: "yprr", label: "YPRR", decimals: 2 },
  ts_per_rr: { key: "ts_per_rr", label: "TS%", decimals: 1, suffix: "%" },
  snp_pct: { key: "snp_pct", label: "SNP%", decimals: 1, suffix: "%" },
  yds_total: { key: "yds_total", label: "YDS(t)", decimals: 0 },
  imp_per_g: { key: "imp_per_g", label: "IMP/G", decimals: 1 },
  fpoe: { key: "fpoe", label: "FPOE", decimals: 1 },
  csty_pct: { key: "csty_pct", label: "CSTY%", decimals: 1, suffix: "%" },
  ceiling: { key: "ceiling", label: "CL", decimals: 1 },
};

const SEASON_METRIC_KEYS_BY_POS = {
  QB: ["fpts", "ppg", "pass_yd", "pass_td", "pass_att", "rush_yd", "rush_td", "fpoe", "csty_pct", "ceiling"],
  RB: ["fpts", "ppg", "rush_att", "rush_yd", "rush_td", "rec_tgt", "rec", "rec_yd", "snp_pct", "fpoe"],
  WR: ["fpts", "ppg", "rec_tgt", "rec", "rec_yd", "rec_td", "rr", "yprr", "ts_per_rr", "fpoe"],
  TE: ["fpts", "ppg", "rec_tgt", "rec", "rec_yd", "rec_td", "rr", "yprr", "ts_per_rr", "fpoe"],
};

const CORE_SEASON_METRIC_KEYS = ["fpts", "ppg", "games_played", "snp_pct", "yds_total", "imp_per_g", "fpoe", "csty_pct", "ceiling"];

export function getPlayerColor(index) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "" || value === "NA" || value === "#N/A") {
    return null;
  }
  const numericValue = Number(String(value).trim().replace(/,/g, "").replace(/%$/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function getPlayerSortValue(player) {
  const fpts = toFiniteNumber(player?.fpts);
  return Number.isFinite(fpts) ? fpts : 0;
}

export function buildDefaultSelection(players) {
  const sortedPlayers = [...(players || [])]
    .filter((player) => player?.id && player?.pos)
    .sort((left, right) => getPlayerSortValue(right) - getPlayerSortValue(left));

  for (const player of sortedPlayers) {
    const samePosition = sortedPlayers.filter((entry) => entry.pos === player.pos);
    if (samePosition.length >= 2) {
      return samePosition.slice(0, 2).map((entry) => entry.id);
    }
  }

  return sortedPlayers.slice(0, 2).map((entry) => entry.id);
}

export function getSelectedPlayers(players, selectedIds) {
  const playerById = new Map((players || []).map((player) => [player.id, player]));
  return (selectedIds || []).map((id) => playerById.get(id)).filter(Boolean);
}

export function filterPlayers(players, query, selectedIds, limit = 10) {
  const normalizedQuery = normalizeText(query);
  const selectedSet = new Set(selectedIds || []);
  const maxReached = selectedSet.size >= MAX_SELECTED_PLAYERS;

  return [...(players || [])]
    .filter((player) => {
      if (!normalizedQuery) {
        return true;
      }
      return normalizeText(player.searchText || `${player.name} ${player.pos} ${player.team}`).includes(normalizedQuery);
    })
    .slice(0, limit)
    .map((player) => ({
      ...player,
      isSelected: selectedSet.has(player.id),
      isDisabled: maxReached && !selectedSet.has(player.id),
    }));
}

export function resolveStatLabel(statKey, statLabels = {}) {
  if (statKey === "fpts") {
    return "FPTS";
  }
  if (statKey === "ppg") {
    return "PPG";
  }
  const direct = statLabels[statKey];
  if (direct) {
    return direct;
  }
  const definition = METRIC_DEFINITIONS[statKey];
  return definition?.label || statKey;
}

export function getStatValue(stats, statKey) {
  if (!stats) {
    return null;
  }
  if (statKey === "fpts") {
    return firstFiniteValue(stats.fpts_override, stats.fpt_ppr, stats.fpts, stats.fpts_ppr);
  }
  if (statKey === "games_played") {
    return firstFiniteValue(stats.games_played, stats.g, stats.G);
  }
  return toFiniteNumber(stats[statKey]);
}

function firstFiniteValue(...values) {
  for (const value of values) {
    const numericValue = toFiniteNumber(value);
    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }
  return null;
}

function getAvailableWeeks(weeklyStatsByWeek) {
  return Object.keys(weeklyStatsByWeek || {})
    .map((week) => Number(week))
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
}

export function resolveWeeklyStatOptions(snapshot, selectedIds) {
  const selectedPlayers = getSelectedPlayers(snapshot?.players, selectedIds);
  const selectedPlayerIds = new Set(selectedPlayers.map((player) => player.id));
  const weeks = getAvailableWeeks(snapshot?.weeklyStatsByWeek);
  const options = WEEKLY_STAT_CANDIDATES
    .filter((statKey) => {
      if (statKey === DEFAULT_WEEKLY_STAT || !selectedPlayerIds.size) {
        return true;
      }
      return weeks.some((week) => {
        const statsForWeek = snapshot.weeklyStatsByWeek?.[week] || {};
        return [...selectedPlayerIds].some((playerId) => Number.isFinite(getStatValue(statsForWeek[playerId], statKey)));
      });
    })
    .map((statKey) => ({
      key: statKey,
      label: resolveStatLabel(statKey, snapshot?.statLabels),
    }));

  return options.length ? options : [{ key: DEFAULT_WEEKLY_STAT, label: "FPTS" }];
}

export function buildWeeklyComparisonSeries({ selectedPlayers, weeklyStatsByWeek, statKey }) {
  const weeks = getAvailableWeeks(weeklyStatsByWeek);
  return (selectedPlayers || []).map((player, index) => ({
    player,
    color: getPlayerColor(index),
    points: weeks.map((week) => {
      const stats = weeklyStatsByWeek?.[week]?.[player.id] || null;
      return {
        week,
        value: getStatValue(stats, statKey),
        opponent: stats?.opponent || "",
        injury: stats?.injury || "",
        projection: stats?.proj || "",
      };
    }),
  }));
}

function getSeasonMetricKeys(selectedPlayers) {
  const positions = [...new Set((selectedPlayers || []).map((player) => player.pos).filter(Boolean))];
  if (positions.length === 1 && SEASON_METRIC_KEYS_BY_POS[positions[0]]) {
    return SEASON_METRIC_KEYS_BY_POS[positions[0]];
  }
  return CORE_SEASON_METRIC_KEYS;
}

function getSeasonMetricDefinition(key, statLabels) {
  const definition = METRIC_DEFINITIONS[key] || { key, decimals: 1 };
  return {
    ...definition,
    label: definition.label || resolveStatLabel(key, statLabels),
  };
}

function getRankValue({ player, ranks, metric }) {
  if (metric.key === "ppg") {
    return toFiniteNumber(player?.ppgRank);
  }
  const rankKey = metric.rankKey || metric.key;
  return toFiniteNumber(ranks?.[rankKey]);
}

export function buildSeasonMetricRows({ selectedPlayers, seasonStatsByPlayerId, seasonRanksByPlayerId, statLabels }) {
  const metricKeys = getSeasonMetricKeys(selectedPlayers);
  return metricKeys.map((metricKey) => {
    const metric = getSeasonMetricDefinition(metricKey, statLabels);
    const values = (selectedPlayers || []).map((player) => {
      const stats = seasonStatsByPlayerId?.[player.id] || {};
      const ranks = seasonRanksByPlayerId?.[player.id] || {};
      const value = getStatValue(stats, metric.key);
      return {
        player,
        value,
        displayValue: formatStatValue(value, metric),
        rank: getRankValue({ player, ranks, metric }),
      };
    });

    const maxAbsValue = Math.max(
      1,
      ...values.map((entry) => Math.abs(Number.isFinite(entry.value) ? entry.value : 0)),
    );

    return {
      ...metric,
      values: values.map((entry) => ({
        ...entry,
        percent: Number.isFinite(entry.value) ? Math.max(2, (Math.abs(entry.value) / maxAbsValue) * 100) : 0,
        isNegative: Number.isFinite(entry.value) && entry.value < 0,
      })),
    };
  });
}

export function formatStatValue(value, metric = {}) {
  if (!Number.isFinite(value)) {
    return "NA";
  }
  const decimals = Number.isFinite(metric.decimals) ? metric.decimals : (Math.abs(value) >= 100 ? 0 : 1);
  const formatted = Number(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted}${metric.suffix || ""}`;
}

export function getPositionRankLabel(player) {
  if (!player?.pos || !Number.isFinite(player?.posRank)) {
    return "";
  }
  return `${player.pos}${Math.round(player.posRank)}`;
}

export function getPositionAccentRank(player) {
  if (!player?.pos) {
    return "";
  }
  const rank = Number.isFinite(player.posRank) ? Math.round(player.posRank) : "NA";
  return `${player.pos} ${rank}`;
}

export function sortPlayersByPositionThenRank(players) {
  return [...(players || [])].sort((left, right) => {
    const posDelta = POSITION_ORDER.indexOf(left.pos) - POSITION_ORDER.indexOf(right.pos);
    if (posDelta !== 0) {
      return posDelta;
    }
    return (left.posRank || 999) - (right.posRank || 999);
  });
}
