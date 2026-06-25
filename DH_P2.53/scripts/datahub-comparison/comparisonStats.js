// DataHub comparison stat contract:
// this module is loaded only with the lazy React comparison island. It keeps
// stat labels, threshold semantics, player colors, and radar bundles out of
// the main DataHub page startup path.
export const MAX_COMPARISON_PLAYERS = 3;

export const COMPARISON_POSITION_TONES = Object.freeze({
  QB: "#ff7a8f",
  RB: "#34f0cc",
  WR: "#67a7ff",
  TE: "#bf7cff",
});

export const COMPARISON_GRADIENT_PALETTES = Object.freeze({
  QB: Object.freeze([
    Object.freeze({ low: "#FFA947", lowMid: "#FF916B", highMid: "#FF666B", high: "#F94095" }),
    Object.freeze({ low: "#00DDFA", lowMid: "#7866FF", highMid: "#D747FF", high: "#FF0AA5" }),
  ]),
  RB: Object.freeze([
    Object.freeze({ low: "#004CFF", lowMid: "#00B3FF", highMid: "#00EDFF", high: "#00FFCB" }),
    Object.freeze({ low: "#BE0AFF", lowMid: "#3700FF", highMid: "#00FF91", high: "#2EFF6D" }),
  ]),
  WR: Object.freeze([
    Object.freeze({ low: "#5300FF", lowMid: "#4947FF", highMid: "#0066FF", high: "#0099FF" }),
    Object.freeze({ low: "#FF0AA5", lowMid: "#D747FF", highMid: "#8766FF", high: "#00DDFA" }),
  ]),
  TE: Object.freeze([
    Object.freeze({ low: "#FF0088", lowMid: "#D400FF", highMid: "#5D00FF", high: "#4C00FF" }),
    Object.freeze({ low: "#FF666B", lowMid: "#FF94C2", highMid: "#AD3EAC", high: "#8838FF" }),
  ]),
});

export const COMPARISON_PLAYER_FALLBACK_COLORS = Object.freeze([
  "#72efff",
  "#d97dff",
  "#66fccc",
]);

export const COMPARISON_LOWER_IS_BETTER = Object.freeze({
  QB: Object.freeze(["ttt", "prs_pct", "pass_sack", "pass_int"]),
});

export const COMPARISON_RADAR_MAX_RANK_BY_POS = Object.freeze({
  QB: 36,
  RB: 48,
  WR: 72,
  TE: 24,
});

export const COMPARISON_RADAR_BUNDLES = Object.freeze({
  qb: Object.freeze([
    "fpts",
    "ppg",
    "yds_total",
    "imp",
    "csty_pct",
    "ceiling",
    "rush_att",
    "rush_yd",
    "rush_td",
    "ypc",
    "snp_pct",
    "imp_per_g",
  ]),
  skill: Object.freeze([
    "fpts",
    "ppg",
    "yds_total",
    "imp",
    "opp",
    "ts_per_rr",
    "rec",
    "yprr",
    "rec_yar",
    "snp_pct",
    "csty_pct",
    "ceiling",
  ]),
});

const STAT_DEFINITIONS = Object.freeze({
  fpts: Object.freeze({ key: "fpts", label: "FPTS", unit: "pts", decimals: 1 }),
  ppg: Object.freeze({ key: "ppg", label: "PPG", unit: "pts", decimals: 1 }),
  games_played: Object.freeze({ key: "games_played", label: "G", decimals: 0 }),
  snp_pct: Object.freeze({ key: "snp_pct", label: "SNP%", unit: "%", decimals: 1, percent: true }),
  yds_total: Object.freeze({ key: "yds_total", label: "YDS(t)", decimals: 0 }),
  imp: Object.freeze({ key: "imp", label: "IMP", decimals: 0 }),
  opp: Object.freeze({ key: "opp", label: "OPP", decimals: 0 }),
  imp_per_g: Object.freeze({ key: "imp_per_g", label: "IMP/G", decimals: 1 }),
  fpoe: Object.freeze({ key: "fpoe", label: "FPOE", decimals: 1, signed: true }),
  csty_pct: Object.freeze({ key: "csty_pct", label: "CSTY%", unit: "%", decimals: 1, percent: true }),
  ceiling: Object.freeze({ key: "ceiling", label: "CL", decimals: 1 }),
  pass_att: Object.freeze({ key: "pass_att", label: "paATT", decimals: 0 }),
  pass_cmp: Object.freeze({ key: "pass_cmp", label: "CMP", decimals: 0 }),
  cmp_pct: Object.freeze({ key: "cmp_pct", label: "CMP%", unit: "%", decimals: 1, percent: true }),
  pass_yd: Object.freeze({ key: "pass_yd", label: "paYDS", decimals: 0 }),
  pass_td: Object.freeze({ key: "pass_td", label: "paTD", decimals: 0 }),
  pass_fd: Object.freeze({ key: "pass_fd", label: "pa1D", decimals: 0 }),
  pass_int: Object.freeze({ key: "pass_int", label: "INT", decimals: 0 }),
  pass_sack: Object.freeze({ key: "pass_sack", label: "SAC", decimals: 0 }),
  pass_rtg: Object.freeze({ key: "pass_rtg", label: "paRTG", decimals: 1 }),
  epa_per_db: Object.freeze({ key: "epa_per_db", label: "EPA/DB", decimals: 2, signed: true }),
  cpoe: Object.freeze({ key: "cpoe", label: "CPOE", unit: "%", decimals: 1, percent: true, signed: true }),
  ttt: Object.freeze({ key: "ttt", label: "TTT", unit: "s", decimals: 2 }),
  prs_pct: Object.freeze({ key: "prs_pct", label: "PRS%", unit: "%", decimals: 1, percent: true }),
  rush_att: Object.freeze({ key: "rush_att", label: "CAR", decimals: 0 }),
  rush_yd: Object.freeze({ key: "rush_yd", label: "ruYDS", decimals: 0 }),
  rush_td: Object.freeze({ key: "rush_td", label: "ruTD", decimals: 0 }),
  rush_fd: Object.freeze({ key: "rush_fd", label: "ru1D", decimals: 0 }),
  ypc: Object.freeze({ key: "ypc", label: "YPC", decimals: 2 }),
  rush_yac: Object.freeze({ key: "rush_yac", label: "YCO", decimals: 0 }),
  yco_per_att: Object.freeze({ key: "yco_per_att", label: "YCO/A", decimals: 2 }),
  mtf: Object.freeze({ key: "mtf", label: "MTF", decimals: 0 }),
  mtf_per_att: Object.freeze({ key: "mtf_per_att", label: "MTF/A", decimals: 2 }),
  rec_tgt: Object.freeze({ key: "rec_tgt", label: "TGT", decimals: 0 }),
  rec: Object.freeze({ key: "rec", label: "REC", decimals: 0 }),
  rec_yd: Object.freeze({ key: "rec_yd", label: "recYDS", decimals: 0 }),
  rec_td: Object.freeze({ key: "rec_td", label: "recTD", decimals: 0 }),
  rec_fd: Object.freeze({ key: "rec_fd", label: "rec1D", decimals: 0 }),
  rec_yar: Object.freeze({ key: "rec_yar", label: "YAC", decimals: 0 }),
  rr: Object.freeze({ key: "rr", label: "RR", decimals: 0 }),
  ypr: Object.freeze({ key: "ypr", label: "YPR", decimals: 2 }),
  yprr: Object.freeze({ key: "yprr", label: "YPRR", decimals: 2 }),
  ts_per_rr: Object.freeze({ key: "ts_per_rr", label: "TS%", unit: "%", decimals: 1, percent: true }),
  first_down_rec_rate: Object.freeze({ key: "first_down_rec_rate", label: "1DRR", decimals: 3 }),
});

export const COMPARISON_STAT_DEFINITIONS = STAT_DEFINITIONS;

function uniqueStatKeys(keys) {
  return Array.from(new Set(keys)).filter((key) => STAT_DEFINITIONS[key]);
}

export function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export function getStatDefinition(key) {
  return STAT_DEFINITIONS[key] || Object.freeze({ key, label: String(key || "").toUpperCase(), decimals: 1 });
}

export function getStatLabel(key) {
  return getStatDefinition(key).label;
}

export function getPlayerName(player) {
  return player?.name || player?.fullName || "Player";
}

export function getComparisonPositions(players) {
  return Array.from(new Set(
    (players || [])
      .map((player) => String(player?.pos || "").trim().toUpperCase())
      .filter(Boolean),
  ));
}

export function getComparisonPosition(players) {
  const positions = getComparisonPositions(players);
  return positions.length === 1 ? positions[0] : "";
}

export function isLowerBetterForPosition(pos, statKey) {
  const keys = COMPARISON_LOWER_IS_BETTER[String(pos || "").toUpperCase()] || [];
  return keys.includes(statKey);
}

export function getThresholdConfig(thresholds, pos, statKey) {
  return thresholds?.[String(pos || "").toUpperCase()]?.[statKey] || null;
}

export function getWeeklyStatOptions(players, thresholds) {
  const positions = getComparisonPositions(players);
  const sourcePositions = positions.length ? positions : ["QB", "RB", "WR", "TE"];
  const statSets = sourcePositions
    .map((pos) => Object.keys(thresholds?.[pos] || {}))
    .filter((keys) => keys.length);

  if (!statSets.length) {
    return [STAT_DEFINITIONS.fpts];
  }

  const sharedKeys = statSets.length === 1
    ? statSets[0]
    : statSets.reduce((shared, keys) => shared.filter((key) => keys.includes(key)));
  const ordered = ["fpts", ...sharedKeys.filter((key) => key !== "fpts")];
  return uniqueStatKeys(ordered).map((key) => STAT_DEFINITIONS[key]);
}

export function getSeasonStatKeys(players) {
  const positions = getComparisonPositions(players);
  const hasQuarterback = positions.includes("QB");
  return uniqueStatKeys(hasQuarterback ? COMPARISON_RADAR_BUNDLES.qb : COMPARISON_RADAR_BUNDLES.skill);
}

export function getPlayerPalette(player, playerIndex) {
  const pos = String(player?.pos || "").toUpperCase();
  const palettes = COMPARISON_GRADIENT_PALETTES[pos] || null;
  if (!palettes) {
    const fallback = COMPARISON_PLAYER_FALLBACK_COLORS[playerIndex % COMPARISON_PLAYER_FALLBACK_COLORS.length];
    return { low: fallback, lowMid: fallback, highMid: fallback, high: fallback };
  }
  if (playerIndex < 2) {
    return palettes[playerIndex];
  }
  const base = palettes[playerIndex % 2];
  return {
    low: base.lowMid,
    lowMid: base.highMid,
    highMid: base.high,
    high: COMPARISON_PLAYER_FALLBACK_COLORS[playerIndex % COMPARISON_PLAYER_FALLBACK_COLORS.length],
  };
}

export function getPlayerAccentColor(player, playerIndex) {
  return getPlayerPalette(player, playerIndex).high || COMPARISON_PLAYER_FALLBACK_COLORS[playerIndex % COMPARISON_PLAYER_FALLBACK_COLORS.length];
}

export function getRadarRankValue(rank, pos) {
  const numericRank = toFiniteNumber(rank);
  const maxRank = COMPARISON_RADAR_MAX_RANK_BY_POS[String(pos || "").toUpperCase()] || 72;
  if (numericRank === null || numericRank <= 0) {
    return 6;
  }
  if (numericRank <= 1) {
    return 100;
  }
  if (numericRank >= maxRank) {
    return 12;
  }
  return Math.max(12, Math.round((100 - ((numericRank - 1) / Math.max(1, maxRank - 1)) * 88) * 10) / 10);
}

export function normalizePlayerSearchText(player) {
  return [
    player?.name,
    player?.fullName,
    player?.pos,
    player?.team,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function formatRank(rank, prefix = "") {
  const numericRank = toFiniteNumber(rank);
  if (numericRank === null || numericRank <= 0) {
    return "NA";
  }
  return `${prefix}${Math.round(numericRank)}`;
}

export function formatComparisonValue(key, value, options = {}) {
  const { compact = false } = options;
  const definition = getStatDefinition(key);
  const numberValue = toFiniteNumber(value);
  if (numberValue === null) {
    return "NA";
  }

  const decimals = Number.isFinite(definition.decimals) ? definition.decimals : 1;
  let text;
  if (compact && Math.abs(numberValue) >= 1000) {
    text = `${(numberValue / 1000).toFixed(Math.abs(numberValue) >= 10000 ? 0 : 1)}k`;
  } else if (decimals === 0) {
    text = `${Math.round(numberValue)}`;
  } else {
    text = numberValue.toFixed(decimals).replace(/\.0+$/, "");
  }

  if (definition.signed && numberValue > 0) {
    text = `+${text}`;
  }
  if (definition.unit === "%" && !text.endsWith("%")) {
    text = `${text}%`;
  } else if (definition.unit && definition.unit !== "%" && !compact) {
    text = `${text} ${definition.unit}`;
  }
  return text;
}
