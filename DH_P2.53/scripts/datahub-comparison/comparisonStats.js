// DataHub comparison stat catalog:
// targets the lazy React comparison modal only. The keys match the normalized
// DataHub game-log/season stat payload so the modal can stay detached from the
// large page script after it mounts.
export const MAX_COMPARISON_PLAYERS = 3;

export const COMPARISON_PLAYER_COLORS = Object.freeze([
  "#72efff",
  "#d97dff",
  "#66fccc",
]);

export const COMPARISON_POSITION_TONES = Object.freeze({
  QB: "#ff7a8f",
  RB: "#34f0cc",
  WR: "#67a7ff",
  TE: "#bf7cff",
});

const STAT_DEFINITIONS = Object.freeze({
  fpts: Object.freeze({ key: "fpts", label: "FPTS", unit: "pts", decimals: 1 }),
  ppg: Object.freeze({ key: "ppg", label: "PPG", unit: "pts", decimals: 1 }),
  games_played: Object.freeze({ key: "games_played", label: "G", decimals: 0 }),
  snp_pct: Object.freeze({ key: "snp_pct", label: "SNP%", unit: "%", decimals: 1, percent: true }),
  yds_total: Object.freeze({ key: "yds_total", label: "YDS(t)", decimals: 0 }),
  imp: Object.freeze({ key: "imp", label: "IMP", decimals: 0 }),
  imp_per_g: Object.freeze({ key: "imp_per_g", label: "IMP/G", decimals: 1 }),
  fpoe: Object.freeze({ key: "fpoe", label: "FPOE", decimals: 1, signed: true }),
  csty_pct: Object.freeze({ key: "csty_pct", label: "CSTY%", unit: "%", decimals: 1, percent: true }),
  ceiling: Object.freeze({ key: "ceiling", label: "CL", decimals: 1 }),
  pass_att: Object.freeze({ key: "pass_att", label: "paATT", decimals: 0 }),
  pass_cmp: Object.freeze({ key: "pass_cmp", label: "CMP", decimals: 0 }),
  cmp_pct: Object.freeze({ key: "cmp_pct", label: "CMP%", unit: "%", decimals: 1, percent: true }),
  pass_yd: Object.freeze({ key: "pass_yd", label: "paYDS", decimals: 0 }),
  pass_td: Object.freeze({ key: "pass_td", label: "paTD", decimals: 0 }),
  pass_int: Object.freeze({ key: "pass_int", label: "INT", decimals: 0 }),
  pass_sack: Object.freeze({ key: "pass_sack", label: "SAC", decimals: 0 }),
  pass_rtg: Object.freeze({ key: "pass_rtg", label: "paRTG", decimals: 1 }),
  epa_per_db: Object.freeze({ key: "epa_per_db", label: "EPA/DB", decimals: 2, signed: true }),
  cpoe: Object.freeze({ key: "cpoe", label: "CPOE", unit: "%", decimals: 1, percent: true, signed: true }),
  ttt: Object.freeze({ key: "ttt", label: "TTT", unit: "s", decimals: 2 }),
  rush_att: Object.freeze({ key: "rush_att", label: "CAR", decimals: 0 }),
  rush_yd: Object.freeze({ key: "rush_yd", label: "ruYDS", decimals: 0 }),
  rush_td: Object.freeze({ key: "rush_td", label: "ruTD", decimals: 0 }),
  ypc: Object.freeze({ key: "ypc", label: "YPC", decimals: 2 }),
  rush_yac: Object.freeze({ key: "rush_yac", label: "YCO", decimals: 0 }),
  yco_per_att: Object.freeze({ key: "yco_per_att", label: "YCO/A", decimals: 2 }),
  mtf: Object.freeze({ key: "mtf", label: "MTF", decimals: 0 }),
  mtf_per_att: Object.freeze({ key: "mtf_per_att", label: "MTF/A", decimals: 2 }),
  rec_tgt: Object.freeze({ key: "rec_tgt", label: "TGT", decimals: 0 }),
  rec: Object.freeze({ key: "rec", label: "REC", decimals: 0 }),
  rec_yd: Object.freeze({ key: "rec_yd", label: "recYDS", decimals: 0 }),
  rec_td: Object.freeze({ key: "rec_td", label: "recTD", decimals: 0 }),
  rr: Object.freeze({ key: "rr", label: "RR", decimals: 0 }),
  ypr: Object.freeze({ key: "ypr", label: "YPR", decimals: 2 }),
  yprr: Object.freeze({ key: "yprr", label: "YPRR", decimals: 2 }),
  ts_per_rr: Object.freeze({ key: "ts_per_rr", label: "TS%", unit: "%", decimals: 1, percent: true }),
  first_down_rec_rate: Object.freeze({ key: "first_down_rec_rate", label: "1DRR", decimals: 3 }),
});

export const COMPARISON_STAT_DEFINITIONS = STAT_DEFINITIONS;

const WEEKLY_COMMON_STATS = Object.freeze(["fpts", "yds_total", "snp_pct", "imp", "fpoe"]);

const WEEKLY_STATS_BY_POSITION = Object.freeze({
  QB: Object.freeze([
    "fpts",
    "pass_yd",
    "pass_td",
    "pass_att",
    "pass_cmp",
    "cmp_pct",
    "pass_int",
    "pass_sack",
    "rush_yd",
    "rush_td",
    "epa_per_db",
    "cpoe",
    "ttt",
    "fpoe",
  ]),
  RB: Object.freeze([
    "fpts",
    "rush_att",
    "rush_yd",
    "rush_td",
    "ypc",
    "rush_yac",
    "yco_per_att",
    "mtf",
    "mtf_per_att",
    "rec_tgt",
    "rec",
    "rec_yd",
    "snp_pct",
    "fpoe",
  ]),
  WR: Object.freeze([
    "fpts",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "fpoe",
  ]),
  TE: Object.freeze([
    "fpts",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "fpoe",
  ]),
});

const SEASON_COMMON_STATS = Object.freeze([
  "fpts",
  "ppg",
  "games_played",
  "snp_pct",
  "yds_total",
  "imp_per_g",
  "fpoe",
  "csty_pct",
  "ceiling",
]);

const SEASON_STATS_BY_POSITION = Object.freeze({
  QB: Object.freeze([
    "fpts",
    "ppg",
    "games_played",
    "pass_yd",
    "pass_td",
    "pass_att",
    "cmp_pct",
    "pass_int",
    "pass_sack",
    "rush_yd",
    "rush_td",
    "epa_per_db",
    "cpoe",
    "fpoe",
  ]),
  RB: Object.freeze([
    "fpts",
    "ppg",
    "games_played",
    "rush_att",
    "rush_yd",
    "rush_td",
    "ypc",
    "rush_yac",
    "yco_per_att",
    "mtf",
    "mtf_per_att",
    "rec_tgt",
    "rec",
    "rec_yd",
    "snp_pct",
  ]),
  WR: Object.freeze([
    "fpts",
    "ppg",
    "games_played",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "csty_pct",
    "ceiling",
  ]),
  TE: Object.freeze([
    "fpts",
    "ppg",
    "games_played",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "csty_pct",
    "ceiling",
  ]),
});

function uniqueStatKeys(keys) {
  return Array.from(new Set(keys)).filter((key) => STAT_DEFINITIONS[key]);
}

export function getComparisonPosition(players) {
  const positions = Array.from(new Set(
    (players || [])
      .map((player) => String(player?.pos || "").trim().toUpperCase())
      .filter(Boolean),
  ));

  return positions.length === 1 ? positions[0] : "";
}

export function getWeeklyStatOptions(players) {
  const position = getComparisonPosition(players);
  const keys = position && WEEKLY_STATS_BY_POSITION[position]
    ? WEEKLY_STATS_BY_POSITION[position]
    : WEEKLY_COMMON_STATS;

  return uniqueStatKeys(keys).map((key) => STAT_DEFINITIONS[key]);
}

export function getSeasonStatKeys(players) {
  const position = getComparisonPosition(players);
  const keys = position && SEASON_STATS_BY_POSITION[position]
    ? SEASON_STATS_BY_POSITION[position]
    : SEASON_COMMON_STATS;

  return uniqueStatKeys(keys);
}

export function getStatDefinition(key) {
  return STAT_DEFINITIONS[key] || Object.freeze({ key, label: String(key || "").toUpperCase(), decimals: 1 });
}

export function getStatLabel(key) {
  return getStatDefinition(key).label;
}

export function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
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
