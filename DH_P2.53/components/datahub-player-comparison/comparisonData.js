export const MAX_SELECTED_PLAYERS = 3;
export const DEFAULT_WEEKLY_STAT = "fpts";

const POSITION_ORDER = ["QB", "RB", "WR", "TE"];
const LOW_IS_BETTER_STATS = new Set(["ttt", "prs_pct", "pass_sack", "pass_int"]);
const RADAR_MAX_RANK_BY_POS = {
  QB: 36,
  RB: 48,
  WR: 72,
  TE: 24,
};

const STAT_FORMATS = {
  fpts: { decimals: 1 },
  fpt_ppr: { decimals: 1 },
  fpts_ppr: { decimals: 1 },
  ppg: { decimals: 1 },
  games_played: { decimals: 0 },
  pass_yd: { decimals: 0 },
  pass_td: { decimals: 0 },
  pass_att: { decimals: 0 },
  pass_cmp: { decimals: 0 },
  pass_fd: { decimals: 0 },
  pass_rtg: { decimals: 1 },
  pass_sack: { decimals: 0 },
  pass_int: { decimals: 0 },
  pass_imp: { decimals: 0 },
  pass_imp_per_att: { decimals: 1 },
  rush_att: { decimals: 0 },
  rush_yd: { decimals: 0 },
  rush_td: { decimals: 0 },
  rush_fd: { decimals: 0 },
  rec_tgt: { decimals: 0 },
  rec: { decimals: 0 },
  rec_yd: { decimals: 0 },
  rec_td: { decimals: 0 },
  rec_fd: { decimals: 0 },
  rec_yar: { decimals: 0 },
  rr: { decimals: 0 },
  yprr: { decimals: 2 },
  ypr: { decimals: 1 },
  ypc: { decimals: 2 },
  ttt: { decimals: 2 },
  prs_pct: { decimals: 1, suffix: "%" },
  cmp_pct: { decimals: 1, suffix: "%" },
  ts_per_rr: { decimals: 1, suffix: "%" },
  snp_pct: { decimals: 1, suffix: "%" },
  first_down_rec_rate: { decimals: 2 },
  yds_total: { decimals: 0 },
  imp: { decimals: 0 },
  imp_per_g: { decimals: 1 },
  opp: { decimals: 0 },
  fpoe: { decimals: 1 },
  csty_pct: { decimals: 1, suffix: "%" },
  ceiling: { decimals: 1 },
};

export const POSITION_GRADIENTS = {
  QB: {
    one: ["#FFA947", "#FF916B", "#FF666B", "#F94095"],
    two: ["#00DDFA", "#7866FF", "#D747FF", "#FF0AA5"],
  },
  RB: {
    one: ["#004CFF", "#00B3FF", "#00EDFF", "#00FFCB"],
    two: ["#BE0AFF", "#3700FF", "#00FF91", "#2EFF6D"],
  },
  WR: {
    one: ["#5300FF", "#4947FF", "#0066FF", "#0099FF"],
    two: ["#FF0AA5", "#D747FF", "#8766FF", "#00DDFA"],
  },
  TE: {
    one: ["#FF0088", "#D400FF", "#5D00FF", "#4C00FF"],
    two: ["#FF666B", "#FF94C2", "#AD3EAC", "#8838FF"],
  },
};

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

function firstFiniteValue(...values) {
  for (const value of values) {
    const numericValue = toFiniteNumber(value);
    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }
  return null;
}

export function getStatValue(stats, statKey) {
  if (!stats) {
    return null;
  }
  if (statKey === "fpts") {
    return firstFiniteValue(stats.fpts_override, stats.fpt_ppr, stats.fpts_ppr, stats.fpts);
  }
  if (statKey === "ppg") {
    const direct = toFiniteNumber(stats.ppg);
    if (Number.isFinite(direct)) return direct;
    const fpts = getStatValue(stats, "fpts");
    const gamesPlayed = firstFiniteValue(stats.games_played, stats.g, stats.G);
    return Number.isFinite(fpts) && gamesPlayed > 0 ? fpts / gamesPlayed : null;
  }
  if (statKey === "games_played") {
    return firstFiniteValue(stats.games_played, stats.g, stats.G);
  }
  if (statKey === "yds_total") {
    return (Number.isFinite(stats.pass_yd) ? stats.pass_yd : 0)
      + (Number.isFinite(stats.rush_yd) ? stats.rush_yd : 0)
      + (Number.isFinite(stats.rec_yd) ? stats.rec_yd : 0);
  }
  if (statKey === "ypc") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.rush_yd) || 0) / attempts : null;
  }
  if (statKey === "ts_per_rr") {
    const routes = Number(stats.rr) || 0;
    return routes > 0 ? ((Number(stats.rec_tgt) || 0) / routes) * 100 : null;
  }
  if (statKey === "pass_imp_per_att") {
    const attempts = Number(stats.pass_att) || 0;
    return attempts > 0 ? ((Number(stats.pass_imp) || 0) / attempts) * 100 : null;
  }
  if (statKey === "yco_per_att") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.rush_yac) || 0) / attempts : null;
  }
  if (statKey === "mtf_per_att") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.mtf) || 0) / attempts : null;
  }
  return toFiniteNumber(stats[statKey]);
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

export function filterPlayers(players, query, selectedIds, limit = 12) {
  const normalizedQuery = normalizeText(query);
  const selectedSet = new Set(selectedIds || []);
  const maxReached = selectedSet.size >= MAX_SELECTED_PLAYERS;

  return [...(players || [])]
    .filter((player) => {
      if (!normalizedQuery) return true;
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
  if (statKey === "fpts") return "FPTS";
  if (statKey === "ppg") return "PPG";
  return statLabels[statKey] || statKey;
}

export function resolveWeeklyStatOptions(snapshot, selectedIds) {
  const selectedPlayers = getSelectedPlayers(snapshot?.players, selectedIds);
  const selectedPositions = [...new Set(selectedPlayers.map((player) => player.pos).filter(Boolean))];
  const allOptions = Array.isArray(snapshot?.statOptions) ? snapshot.statOptions : [];
  const filtered = allOptions.filter((option) => {
    if (option.key === DEFAULT_WEEKLY_STAT) return true;
    if (!selectedPositions.length) return true;
    const validPositions = new Set(option.positions || []);
    return selectedPositions.every((position) => validPositions.has(position));
  });

  return filtered.length ? filtered : [{ key: DEFAULT_WEEKLY_STAT, label: "FPTS", positions: POSITION_ORDER }];
}

function hexToRgb(hex) {
  const normalized = String(hex || "").replace("#", "");
  if (normalized.length !== 6) return [255, 255, 255];
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

function mixHex(left, right, weight = 0.5) {
  const a = hexToRgb(left);
  const b = hexToRgb(right);
  return rgbToHex(a.map((value, index) => value * (1 - weight) + b[index] * weight));
}

function lightenHex(hex, amount = 0.18) {
  return mixHex(hex, "#ffffff", amount);
}

export function getPlayerPalette(player, index, selectedPlayers = []) {
  const pos = String(player?.pos || "").toUpperCase();
  const positionPalette = POSITION_GRADIENTS[pos] || POSITION_GRADIENTS.WR;
  const samePositionBefore = selectedPlayers.slice(0, index).filter((entry) => entry.pos === pos).length;
  if (samePositionBefore === 0) {
    return positionPalette.one;
  }
  if (samePositionBefore === 1) {
    return positionPalette.two;
  }
  return positionPalette.one.map((color, colorIndex) => lightenHex(mixHex(color, positionPalette.two[colorIndex], 0.5), 0.1));
}

export function getPlayerPrimaryColor(player, index, selectedPlayers = []) {
  const palette = getPlayerPalette(player, index, selectedPlayers);
  return palette[palette.length - 1] || "#70e4ff";
}

function getThreshold(snapshot, player, statKey) {
  const pos = String(player?.pos || "").toUpperCase();
  return snapshot?.thresholdsByPositionStat?.[pos]?.[statKey] || null;
}

function getAxisConfig(snapshot, selectedPlayers, statKey) {
  const thresholds = selectedPlayers.map((player) => getThreshold(snapshot, player, statKey)).filter(Boolean);
  const isLowBetter = thresholds.some((threshold) => threshold.isLowBetter);
  const finite = (value) => Number.isFinite(value);
  if (!thresholds.length) {
    return { min: 0, max: 1, inverse: false };
  }

  if (isLowBetter) {
    const bestValues = thresholds.map((threshold) => threshold.categories?.yMax).filter(finite);
    const worstValues = thresholds.map((threshold) => threshold.categories?.yMin).filter(finite);
    const min = bestValues.length ? Math.min(...bestValues) : 0;
    const max = worstValues.length ? Math.max(...worstValues) : Math.max(min + 1, 1);
    return { min, max: max === min ? min + 1 : max, inverse: true };
  }

  const minValues = thresholds.map((threshold) => threshold.categories?.yMin).filter(finite);
  const maxValues = thresholds.map((threshold) => threshold.categories?.yMax).filter(finite);
  const min = minValues.length ? Math.min(...minValues) : 0;
  const max = maxValues.length ? Math.max(...maxValues) : 1;
  return { min, max: max === min ? min + 1 : max, inverse: false };
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return null;
  return Math.max(min, Math.min(max, value));
}

function formatPointValue(value, statKey) {
  return formatStatValue(value, { key: statKey });
}

function buildVisualPieces(threshold, palette) {
  const categories = threshold?.categories || {};
  const [lowColor, lowMidColor, highMidColor, highColor] = palette;
  const pieces = [];
  if (threshold?.isLowBetter) {
    if (Number.isFinite(categories.high)) pieces.push({ lte: categories.high, color: highColor });
    if (Number.isFinite(categories.high) && Number.isFinite(categories.midHigh)) pieces.push({ gt: categories.high, lte: categories.midHigh, color: highMidColor });
    if (Number.isFinite(categories.midHigh) && Number.isFinite(categories.midLow)) pieces.push({ gt: categories.midHigh, lte: categories.midLow, color: lowMidColor });
    if (Number.isFinite(categories.midLow)) pieces.push({ gt: categories.midLow, color: lowColor });
    return pieces.length ? pieces : [{ color: highColor }];
  }

  if (Number.isFinite(categories.high)) pieces.push({ gte: categories.high, color: highColor });
  if (Number.isFinite(categories.midHigh) && Number.isFinite(categories.high)) pieces.push({ gte: categories.midHigh, lt: categories.high, color: highMidColor });
  if (Number.isFinite(categories.midLow) && Number.isFinite(categories.midHigh)) pieces.push({ gte: categories.midLow, lt: categories.midHigh, color: lowMidColor });
  if (Number.isFinite(categories.midLow)) pieces.push({ lt: categories.midLow, color: lowColor });
  return pieces.length ? pieces : [{ color: highColor }];
}

export function buildWeeklyChartData({ snapshot, selectedPlayers, statKey }) {
  const weeks = Array.isArray(snapshot?.weeks) && snapshot.weeks.length
    ? snapshot.weeks
    : Array.from({ length: 18 }, (_, index) => index + 1);
  const axis = getAxisConfig(snapshot, selectedPlayers, statKey);
  const weekLabels = weeks.map((week) => `wk${week}`);

  const series = (selectedPlayers || []).map((player, index) => {
    const palette = getPlayerPalette(player, index, selectedPlayers);
    const threshold = getThreshold(snapshot, player, statKey);
    const color = palette[palette.length - 1];
    return {
      player,
      color,
      palette,
      visualPieces: buildVisualPieces(threshold, palette),
      data: weeks.map((week) => {
        const stats = snapshot?.weeklyStatsByWeek?.[week]?.[player.id] || null;
        const realValue = getStatValue(stats, statKey);
        const rank = snapshot?.weeklyRanksByWeekStatPlayer?.[week]?.[statKey]?.[player.id] || null;
        if (!Number.isFinite(realValue)) {
          return {
            week,
            weekLabel: `wk${week}`,
            plotValue: null,
            realValue: null,
            rank,
          };
        }
        const plotValue = clamp(realValue, axis.min, axis.max);
        const rankLabel = Number.isFinite(rank) ? `${player.pos}·${Math.round(rank)}` : `${player.pos}·NA`;
        return {
          week,
          weekLabel: `wk${week}`,
          plotValue,
          realValue,
          rank,
          rankLabel,
          label: `${formatPointValue(realValue, statKey)}(${rankLabel})`,
          tooltipLabel: `${player.name} ${formatPointValue(realValue, statKey)} (${rankLabel})`,
          opponent: stats?.opponent || "",
          injury: stats?.injury || "",
          projection: stats?.proj || "",
          logoSrc: player.teamLogoSrc || stats?.teamLogoSrc || "",
          color,
        };
      }),
    };
  });

  return {
    weekLabels,
    statKey,
    statLabel: resolveStatLabel(statKey, snapshot?.statLabels),
    axis,
    series,
  };
}

export function buildWeeklySummaryCards({ snapshot, selectedPlayers, statKey }) {
  return (selectedPlayers || []).map((player, index) => {
    const stats = snapshot?.seasonStatsByPlayerId?.[player.id] || {};
    const value = getStatValue(stats, statKey);
    const overallRank = snapshot?.seasonOverallRanksByStatPlayer?.[statKey]?.[player.id] || null;
    const posRank = snapshot?.seasonPosRanksByStatPlayer?.[statKey]?.[player.id] || null;
    return {
      player,
      color: getPlayerPrimaryColor(player, index, selectedPlayers),
      statLabel: resolveStatLabel(statKey, snapshot?.statLabels),
      value,
      displayValue: formatStatValue(value, { key: statKey }),
      overallRank,
      posRank,
    };
  });
}

function rankToRadarScore(rank, position) {
  const numericRank = toFiniteNumber(rank);
  const maxRank = RADAR_MAX_RANK_BY_POS[position] || 72;
  if (!Number.isFinite(numericRank)) return 6;
  if (numericRank <= 1) return 100;
  if (numericRank >= maxRank) return 6;
  return Math.max(6, 100 - ((numericRank - 1) / Math.max(1, maxRank - 1)) * 94);
}

export function buildSeasonRadarData({ snapshot, selectedPlayers }) {
  const hasQuarterback = (selectedPlayers || []).some((player) => player.pos === "QB");
  const statKeys = hasQuarterback
    ? (snapshot?.radarStatSets?.qb || [])
    : (snapshot?.radarStatSets?.skill || []);
  const indicators = statKeys.map((statKey) => ({
    key: statKey,
    name: resolveStatLabel(statKey, snapshot?.statLabels),
    max: 100,
  }));
  const players = (selectedPlayers || []).map((player, index) => {
    const color = getPlayerPrimaryColor(player, index, selectedPlayers);
    const stats = snapshot?.seasonStatsByPlayerId?.[player.id] || {};
    const metrics = statKeys.map((statKey) => {
      const rank = snapshot?.seasonPosRanksByStatPlayer?.[statKey]?.[player.id] || null;
      const value = getStatValue(stats, statKey);
      return {
        statKey,
        label: resolveStatLabel(statKey, snapshot?.statLabels),
        value,
        displayValue: formatStatValue(value, { key: statKey }),
        rank,
        score: rankToRadarScore(rank, player.pos),
      };
    });
    return {
      player,
      color,
      metrics,
      scores: metrics.map((metric) => metric.score),
    };
  });
  return { indicators, players, statKeys };
}

export function formatStatValue(value, metric = {}) {
  if (!Number.isFinite(value)) {
    return "NA";
  }
  const format = STAT_FORMATS[metric.key] || metric;
  const decimals = Number.isFinite(format.decimals)
    ? format.decimals
    : (Math.abs(value) >= 100 ? 0 : 1);
  const formatted = Number(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted}${format.suffix || ""}`;
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
