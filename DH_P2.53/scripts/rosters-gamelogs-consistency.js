/* Rosters-only Consistency controller. CSV/snapshot ownership remains in
 * app.js and rosters-2026-gamelogs.js; this file owns selection, HUD and SVG.
 * It includes the complete modal refinements without loading DataHub assets. */
(() => {
if (document.body.dataset.page !== 'rosters') return;
const gameLogsModal = document.getElementById('game-logs-modal');
const gameLogsStatMenu = gameLogsModal.querySelector('[data-gamelogs-stat-menu]');
const gameLogsStatToggle = gameLogsModal.querySelector('[data-gamelogs-stat-toggle]');
const gameLogsStatDropdown = gameLogsModal.querySelector('[data-gamelogs-stat-dropdown]');
const ROSTERS_STAT_LABELS = buildStatLabels();
const ROSTERS_CONSISTENCY_RANK_MAX = { QB: 36, RB: 48, WR: 72, TE: 24 };
const { rankWeeklyMetricValues, buildConsistencyRankChart, getConsistencyRankPlotValue,
  summarizeConsistencyGames, isConsistencyProductionStat, getConsistencyAverageLabelCenter } = window.RostersGameLogsControls;
let rostersCurveSvg = null;
state.currentConsistencyStat = 'fpts';
const ROSTERS_CONSISTENCY_THRESHOLD_MAP = {
  QB: { solid: 16, high: 22 },
  RB: { solid: 12, high: 18 },
  WR: { solid: 12, high: 18 },
  TE: { solid: 11, high: 17 },
  DEFAULT: { solid: 14, high: 20 },
  FLEX: { solid: 14, high: 20 },
};
const ROSTERS_MAX_CONSISTENCY_POINTS = 40;

// Consistency Chart Line Color
const ROSTERS_CONSISTENCY_BUCKET_STYLES = {
  high: { color: "#00ffc1" },
  solid: { color: "#00c5ff" },
  low: { color: "#c26cfc" },
};
const ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS = {
  high: "#5dfdca",
  solid: "#47befd",
  low: "#d3a5ff",
};
const ROSTERS_SVG_NS = "http://www.w3.org/2000/svg";
const ROSTERS_CONSISTENCY_LINE_FILTER_ID = "rosters-consistency-line-glow";
const ROSTERS_CONSISTENCY_AREA_FILTER_ID = "rosters-consistency-area-glow";
const ROSTERS_CONSISTENCY_AREA_GRADIENT_ID = "rosters-consistency-area-gradient";
const ROSTERS_CONSISTENCY_GRADIENT_COLORS = {
  low: "#c26cfc10",
  solid: "#005cff10",
  high: "#00ffc110",
};
// Give the first/last point chips and matching axis labels a few extra pixels.
const ROSTERS_CONSISTENCY_EDGE_PADDING_PCT = 3.8;
const ROSTERS_CONSISTENCY_VERTICAL_PADDING_PCT = 8;

const QB_2025 = [
        'fpts',
        'proj',
        'pass_rtg',
        'pass_yd',
        'pass_td',
        'cmp_pct',
        'yds_total',
        'rush_yd',
        'rush_td',
        'pass_att',
        'pass_cmp',
        'pass_fd',
        'imp_per_g',
        'pass_imp',
        'pass_imp_per_att',
        'rush_att',
        'ypc',
        'ttt',
        'prs_pct',
        'pass_sack',
        'pass_int',
        'fum',
        'fpoe'
    ];
const QB_2026 = [
        'fpts', 'proj', 'pass_rtg', 'pass_yd', 'pass_td', 'yds_total',
        'rush_yd', 'rush_td', 'cmp_pct', 'pass_att', 'pass_cmp', 'cpoe',
        'rush_att', 'ypc', 'epa', 'epa_per_db', 'pass_imp_per_att',
        'pass_fd', 'ttt', 'prs_pct', 'blitz_pct', 'pass_sack', 'pass_int',
        'dropbacks', 'team_pass_pct', 'fpoe'
    ];
const RB_2025 = [
        'fpts',
        'proj',
        'snp_pct',
        'rush_att',
        'rush_yd',
        'ypc',
        'rush_td',
        'rec',
        'rec_yd',
        'rec_tgt',
        // Show TS% for RBs as well (right after targets).
        'ts_per_rr',
        'yds_total',
        'elu',
        'mtf_per_att',
        'yco_per_att',
        'mtf',
        'rush_yac',
        'rush_fd',
        'rec_td',
        'rec_fd',
        'rec_yar',
        'imp_per_g',
        'fum',
        'fpoe'
    ];
const RB_2026 = [
        'fpts', 'proj', 'snp_pct', 'rush_att', 'rush_yd', 'ypc', 'rush_td',
        'rec_tgt', 'rec', 'ts_per_rr', 'rec_yd', 'rec_td', 'yds_total',
        'elu', 'mtf_per_att', 'yco_per_att', 'mtf', 'rush_yac',
        'expl_ru_pct', 'ryoe', 'ryoe_per_att', 'rz_att', 'gl_att', 'rush_fd',
        'rr', 'yprr', 'tprr', 'ypr', 'rec_fd', 'rec_yar', 'rec_yacr', 'imp_per_g', 'fum', 'fpoe'
    ];
const WT_2025 = [
        'fpts',
        'proj',
        'snp_pct',
        'rec_tgt',
        'rec',
        'ts_per_rr',
        'rec_yd',
        'rec_td',
        'yprr',
        'rec_fd',
        'first_down_rec_rate',
        'rec_yar',
        'ypr',
        'imp_per_g',
        'rr',
        'fpoe',
        'yds_total',
        'rush_att',
        'rush_yd',
        'rush_td',
        'ypc',
        'fum'
    ];
const WT_2026 = [
        'fpts', 'proj', 'snp_pct', 'rec_tgt', 'rec', 'ts_per_rr', 'rec_yd', 'rec_td',
        'yprr', 'tprr', 'rec_fd', 'first_down_rec_rate', 'rec_yar', 'rec_yacr', 'ypr',
        // Receiving market shares remain in Season/Stats, not weekly Game Logs.
        'imp_per_g', 'rz_tgt', 'tgt_10_plus', 'ay_pct', 'rr',
        'fpoe', 'yds_total', 'rush_att', 'rush_yd', 'rush_td', 'ypc', 'fum'
    ];
function getRostersLogOrderForPosition(position, season = state.currentGameLogsSeason) {
  const year = season === '2026' ? '2026' : '2025';
  return ({ QB_2025, QB_2026, RB_2025, RB_2026, WT_2025, WT_2026 })[`${position === 'QB' ? 'QB' : position === 'RB' ? 'RB' : 'WT'}_${year}`];
}
function getRostersCombinedWeeklyStats() { return state.playerWeeklyStats; }
function getRostersGameLogsQualifiedIds() {
  const elapsed = getRostersGameLogsElapsedWeeks();
  const snapshot = state.currentGameLogsSeason === '2026' ? state.rosters2026GameLogs : state.rosters2025GameLogs;
  return new Set(Object.entries(state.playerSeasonStats || {}).filter(([, stats]) => isRostersGameLogsRankQualified(
    stats, stats.pos, state.currentGameLogsSeason, elapsed, snapshot?.rankQualifierWeeks || elapsed)).map(([id]) => id));
}
function getRostersOrdinalSuffix(rank) { return ordinalSuffix(rank).replace(/^\d+/, ''); }
function getRostersGameLogStatValue(statKey, stats, is2026RbLog = false, is2026WtLog = false) {
  if (!stats || stats.__hasRecordedStats === false) return null;
  if (NO_FALLBACK_KEYS.has(statKey) || (is2026RbLog && ["ryoe", "rr", "ypr"].includes(statKey))
    || (is2026WtLog && ["rr", "rz_tgt", "ay_pct"].includes(statKey))) {
    // Source-backed weekly cells keep missing values blank; RB 2026 also
    // reads RYOE, RR, and YPR from WK directly. W/T counts and air-yard share
    // also remain unavailable when their WK cells have no recorded value.
    return Number.isFinite(stats[statKey]) ? stats[statKey] : null;
  }
  if (statKey === "fpts") {
    if (Number.isFinite(stats.fpts_override)) return stats.fpts_override;
    if (Number.isFinite(stats.fpt_ppr)) return stats.fpt_ppr;
    return Number.isFinite(stats.fpts) ? stats.fpts : null;
  }
  if (statKey === "yds_total") {
    const totalYards = (Number.isFinite(stats.pass_yd) ? stats.pass_yd : 0)
      + (Number.isFinite(stats.rush_yd) ? stats.rush_yd : 0)
      + (Number.isFinite(stats.rec_yd) ? stats.rec_yd : 0);
    return totalYards > 0 ? totalYards : (Number.isFinite(stats.yds_total) ? stats.yds_total : 0);
  }
  if (statKey === "ypc") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.rush_yd) || 0) / attempts : 0;
  }
  if (statKey === "yco_per_att") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.rush_yac) || 0) / attempts : 0;
  }
  if (statKey === "mtf_per_att") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.mtf) || 0) / attempts : 0;
  }
  if (statKey === "pass_imp_per_att") {
    // Rosters 2026 QB Game Logs: prefer the weekly CSV's pIMP/A value.
    // Historical 2025 keeps its existing calculated display behavior.
    if (state.currentGameLogsSeason === "2026" && Number.isFinite(stats.pass_imp_per_att)) {
      return stats.pass_imp_per_att;
    }
    const attempts = Number(stats.pass_att) || 0;
    return attempts > 0 ? ((Number(stats.pass_imp) || 0) / attempts) * 100 : 0;
  }
  if (statKey === "ts_per_rr") {
    const routes = Number(stats.rr) || 0;
    return routes > 0 ? ((Number(stats.rec_tgt) || 0) / routes) * 100 : 0;
  }
  if (statKey === "yprr") {
    const routes = Number(stats.rr) || 0;
    return routes > 0 ? (Number(stats.rec_yd) || 0) / routes : 0;
  }
  if (statKey === "ypr") {
    const receptions = Number(stats.rec) || 0;
    return receptions > 0 ? (Number(stats.rec_yd) || 0) / receptions : 0;
  }
  if (statKey === "first_down_rec_rate") {
    const receptions = Number(stats.rec) || 0;
    return receptions > 0 ? (Number(stats.rec_fd) || 0) / receptions : 0;
  }
  if (statKey === "imp_per_g") {
    if (Number.isFinite(stats.imp_per_g)) return stats.imp_per_g;
    if (Number.isFinite(stats.imp)) return stats.imp;
    return 0;
  }
  if (statKey === "cmp_pct") {
    const attempts = Number(stats.pass_att) || 0;
    return attempts > 0 ? ((Number(stats.pass_cmp) || 0) / attempts) * 100 : 0;
  }
  if (["prs_pct", "snp_pct", "ttt"].includes(statKey)) {
    return Number.isFinite(stats[statKey]) ? stats[statKey] : 0;
  }
  return Number.isFinite(stats[statKey]) ? stats[statKey] : 0;
}

function formatRostersGameLogCellValue(statKey, value, is2026QbLog = false, is2026RbLog = false, is2026WtLog = false) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return statKey === "fpts" ? "-" : "N/A";
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return statKey === "fpts" ? "-" : "N/A";
  }
  // Weekly Game Logs: exact count/impact stats use whole numbers; CPOE is
  // percentage points with one decimal and a plus sign only for positive values.
  if (["rz_att", "gl_att", "rush_ybc", "imp_per_g"].includes(statKey)) return numericValue.toFixed(0);
  if (statKey === "cpoe") {
    const formatted = `${numericValue.toFixed(1)}%`;
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  if (is2026QbLog && (statKey === "epa" || statKey === "epa_per_db")) {
    // Rosters 2026 QB weekly Game Logs: sign nonzero EPA values like the
    // season summary while keeping zero unsigned.
    return formatSignedEpaValue(numericValue);
  }
  if (is2026RbLog && statKey === "expl_ru_pct") {
    // WK EXPLSV% may be stored as a fraction or percentage points.
    const normalized = Math.abs(numericValue) <= 1.5 ? numericValue * 100 : numericValue;
    return `${normalized.toFixed(1)}%`;
  }
  // Rosters 2026 RB weekly per-game columns match the Season view's tenths.
  if (is2026RbLog && /(?:\/G|YPG)$/.test(ROSTERS_STAT_LABELS[statKey])) return numericValue.toFixed(1);
  if (is2026RbLog && statKey === "ryoe_per_att") return numericValue.toFixed(2);
  // Preserve DH/WK receiving rate precision; TPRR is a ratio, not a percentage.
  if ((is2026RbLog || is2026WtLog) && statKey === "tprr") return numericValue.toFixed(3);
  if ((is2026RbLog || is2026WtLog) && statKey === "rec_yacr") return numericValue.toFixed(1);
  // Current W/T shares retain percentage units and route rates retain DH/WK
  // thousandths; count fields render whole numbers, including real zeroes.
  if (is2026WtLog && ["ay_pct", "rec_yms", "rec_tms"].includes(statKey)) return formatPercentage(numericValue);
  if (is2026WtLog && statKey === "first_down_rec_rate") return numericValue.toFixed(3);
  if (is2026WtLog && ["rz_tgt", "tgt_10_plus", "rr"].includes(statKey)) return numericValue.toFixed(0);
  if (statKey === "yco_per_att") return numericValue.toFixed(2);
  if (["mtf_per_att", "ypc", "ttt", "ypr", "yprr", "first_down_rec_rate"].includes(statKey)) {
    return numericValue.toFixed(2);
  }
  if (["pass_imp_per_att", "prs_pct", "snp_pct", "ts_per_rr", "cmp_pct", "blitz_pct", "team_pass_pct"].includes(statKey)) {
    return `${numericValue.toFixed(1)}%`;
  }
  if (["pass_rtg", "fpts"].includes(statKey)) {
    return numericValue.toFixed(1);
  }
  return Number.isInteger(numericValue) ? String(numericValue) : numericValue.toFixed(2);
}

function getRostersGameLogProjectionDisplay(stats, week = null) {
  const projection = String(stats?.proj ?? "").trim();
  if (state.currentGameLogsSeason === "2026" && Number.isFinite(week)
      && week > (state.rosters2026GameLogs?.latestRecordedWeek || 0)) return projection;
  const is2026 = state.currentGameLogsSeason === "2026";
  const zeroSnaps = is2026 ? stats?.snp === 0 : Number(stats?.snp_pct) === 0;
  return zeroSnaps && !parseInjuryDesignation(projection) ? (is2026 ? "OUT" : "DNP") : projection;
}

function prepareRostersConsistencyPanel(player) {
  state.currentConsistencyData = buildRostersConsistencyPanelData(player);
  renderRostersConsistencyStatOptions(player);
}

function getRostersConsistencyStatOptions(player = state.currentGameLogsPlayer) {
  return getRostersLogOrderForPosition(player?.pos, state.currentGameLogsSeason)
    .filter((key) => key !== "proj" && ROSTERS_STAT_LABELS[key]);
}

function renderRostersConsistencyStatOptions(player) {
  if (!gameLogsStatMenu) return;
  const options = getRostersConsistencyStatOptions(player);
  if (!options.includes(state.currentConsistencyStat)) state.currentConsistencyStat = "fpts";
  gameLogsStatMenu.replaceChildren(...options.map((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gamelogs-stat-option";
    button.dataset.consistencyStat = key;
    button.setAttribute("role", "option");
    button.textContent = key === "fpts" ? "PPR FPTS" : ROSTERS_STAT_LABELS[key];
    return button;
  }));
  syncRostersConsistencyStatControl();
}

function syncRostersConsistencyStatControl() {
  const key = state.currentConsistencyStat;
  const label = gameLogsStatDropdown?.querySelector("[data-gamelogs-stat-value]");
  const mode = gameLogsStatDropdown?.querySelector("[data-gamelogs-stat-mode]");
  if (label) label.textContent = key === "fpts" ? "PPR FPTS" : ROSTERS_STAT_LABELS[key];
  if (mode) mode.textContent = key === "fpts" ? "Weekly scoring" : `${state.currentGameLogsPlayer?.pos || "Position"} weekly ranks`;
  gameLogsStatMenu?.querySelectorAll("[data-consistency-stat]").forEach((option) => {
    const selected = option.dataset.consistencyStat === key;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-selected", String(selected));
    option.tabIndex = selected ? 0 : -1;
  });
}

function closeRostersConsistencyStatMenu({ restoreFocus = false } = {}) {
  gameLogsStatMenu?.classList.add("hidden");
  gameLogsStatToggle?.setAttribute("aria-expanded", "false");
  if (restoreFocus) gameLogsStatToggle?.focus({ preventScroll: true });
}

function openRostersConsistencyStatMenu(edge) {
  if (!gameLogsStatMenu || state.currentGameLogsView !== "consistency") return;
  closeGameLogsSeasonMenu();
  gameLogsStatMenu.classList.remove("hidden");
  gameLogsStatToggle?.setAttribute("aria-expanded", "true");
  const options = [...gameLogsStatMenu.querySelectorAll("[data-consistency-stat]")];
  const option = edge === "first" ? options[0] : edge === "last" ? options.at(-1)
    : options.find((entry) => entry.getAttribute("aria-selected") === "true");
  option?.focus({ preventScroll: true });
  option?.scrollIntoView({ block: "nearest" });
}

function attachRostersConsistencyStatListeners() {
  // The Rosters stat picker is a keyboard-operable listbox anchored above its
  // trigger. Escape restores focus; Tab and outside clicks dismiss it without
  // changing the selected statistic or closing the Player Game Log dialog.
  gameLogsStatToggle?.addEventListener("click", () => {
    if (gameLogsStatToggle.getAttribute("aria-expanded") === "true") closeRostersConsistencyStatMenu();
    else openRostersConsistencyStatMenu();
  });
  gameLogsStatToggle?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    openRostersConsistencyStatMenu(event.key === "End" || event.key === "ArrowUp" ? "last" : "first");
  });
  gameLogsStatMenu?.addEventListener("click", (event) => {
    const key = event.target.closest("[data-consistency-stat]")?.dataset.consistencyStat;
    if (!getRostersConsistencyStatOptions().includes(key)) return;
    state.currentConsistencyStat = key;
    syncRostersConsistencyStatControl();
    closeRostersConsistencyStatMenu({ restoreFocus: true });
    renderRostersConsistencyChart();
  });
  gameLogsStatMenu?.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      closeRostersConsistencyStatMenu({ restoreFocus: true });
      return;
    }
    const options = [...gameLogsStatMenu.querySelectorAll("[data-consistency-stat]")];
    const index = options.indexOf(document.activeElement);
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % options.length;
    else if (event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    options[next]?.focus();
  });
}

function getRostersConsistencyStatValue(key, stats, position) {
  // Reuse Weekly's accessors/precision, but never let their display fallbacks
  // manufacture a zero for an unavailable metric in a new ranked chart.
  if (!stats || stats.__hasRecordedStats === false) return null;
  const is2026 = state.currentGameLogsSeason === "2026";
  const read = () => getRostersGameLogStatValue(key, stats, is2026 && position === "RB", is2026 && ["WR", "TE"].includes(position));
  if (key === "fpts") return read();
  if (key === "yds_total") {
    const parts = [stats.pass_yd, stats.rush_yd, stats.rec_yd].filter(Number.isFinite);
    return parts.length ? parts.reduce((sum, value) => sum + value, 0) : Number.isFinite(stats.yds_total) ? stats.yds_total : null;
  }
  if (Number.isFinite(stats[key])) return read();
  if (NO_FALLBACK_KEYS.has(key) || (is2026 && position === "RB" && ["ryoe", "rr", "ypr"].includes(key))
    || (is2026 && ["WR", "TE"].includes(position) && ["rr", "rz_tgt", "ay_pct"].includes(key))) return null;
  const dependencies = {
    ypc: ["rush_att", "rush_yd"], yco_per_att: ["rush_att", "rush_yac"], mtf_per_att: ["rush_att", "mtf"],
    pass_imp_per_att: ["pass_att", "pass_imp"], ts_per_rr: ["rr", "rec_tgt"], yprr: ["rr", "rec_yd"],
    ypr: ["rec", "rec_yd"], first_down_rec_rate: ["rec", "rec_fd"], cmp_pct: ["pass_att", "pass_cmp"], imp_per_g: ["imp"],
  }[key];
  return dependencies?.every((dependency) => Number.isFinite(stats[dependency])) ? read() : null;
}

function buildRostersConsistencyMetricData(base, key) {
  // Rosters Consistency: build every same-position player's season from actual
  // played games. Weekly ranks drive the zones; season summaries drive the HUD
  // and its positional ranks. Filters and future projection rows do not enter.
  if (!base) return null;
  const weeklyStats = getRostersCombinedWeeklyStats();
  const position = base.position;
  const lowerBetter = ["ttt", "prs_pct", "pass_sack", "pass_int", "fum", "dp_pct"].includes(key);
  const playerSeries = new Map();
  const playedCounts = new Map();
  const skippedLabels = {};
  const visibleWeeks = new Set(base.axisWeeks);
  const lastRecordedWeek = base.axisWeeks.at(-1);
  Object.keys(weeklyStats || {}).map(Number).filter((week) => Number.isFinite(week) && week <= lastRecordedWeek)
    .sort((a, b) => a - b).forEach((week) => {
      const rows = weeklyStats[week] || {};
      const entries = [];
      Object.entries(rows).forEach(([playerId, stats]) => {
        const pos = String(stats.pos || state.playerSeasonStats?.[playerId]?.pos || state.players?.[playerId]?.position || "").trim().toUpperCase();
        if (pos !== position) return;
        // Weekly's SNP-aware status also excludes archived zero-snap DNP rows
        // from per-game denominators, while played zero/negative games remain.
        const projection = getRostersGameLogProjectionDisplay(stats);
        const bye = String(stats.opponent || "").trim().toUpperCase() === "BYE";
        if (bye || shouldSkipRostersConsistencyWeek(stats, projection)) {
          if (playerId === base.playerId) skippedLabels[week] = bye ? "BYE" : formatRostersProjReason(projection);
          return;
        }
        // Missed-game rows often have no recorded statistics. Preserve their
        // chart designation before rejecting them from the played-game math.
        if (stats.__hasRecordedStats === false) return;
        playedCounts.set(playerId, (playedCounts.get(playerId) || 0) + 1);
        const value = getRostersConsistencyStatValue(key, stats, position);
        if (Number.isFinite(value)) entries.push({ playerId, value, opponent: stats.opponent || "" });
        else if (playerId === base.playerId) skippedLabels[week] = "—";
      });
      const ranks = rankWeeklyMetricValues(entries, lowerBetter);
      entries.forEach(({ playerId, value, opponent }) => {
        if (!playerSeries.has(playerId)) playerSeries.set(playerId, []);
        playerSeries.get(playerId).push({ week, value, rank: ranks.get(playerId), opponent });
      });
    });
  const chartFor = (series) => key === "fpts"
    ? { rankMode: false, thresholds: getRostersConsistencyThresholds(position), chartSeries: series.map((entry) => ({ ...entry, pts: clampRostersConsistencyPoints(entry.value), originalPts: entry.value })) }
    : buildConsistencyRankChart(series, position, key);
  const summaries = new Map([...playedCounts].map(([playerId, gamesPlayed]) => {
    const chart = chartFor(playerSeries.get(playerId) || []);
    return [playerId, summarizeConsistencyGames(chart.chartSeries, chart.thresholds, gamesPlayed, lowerBetter)];
  }));
  // Retain Rosters' season-volume eligibility for the HUD's season ranks.
  // The average reference still locates every player's average on the weekly
  // chart's complete positional scale, including unqualified players.
  const qualifiedIds = getRostersGameLogsQualifiedIds(state.currentGameLogsSeason);
  const rankSummary = (field, ascending = false, qualifiedOnly = true) => rankWeeklyMetricValues([...summaries]
    .filter(([playerId]) => !qualifiedOnly || qualifiedIds.has(playerId))
    .map(([playerId, summary]) => ({ playerId, value: summary[field] })), ascending).get(base.playerId);
  const chart = chartFor(playerSeries.get(base.playerId) || []);
  const summary = summaries.get(base.playerId) || summarizeConsistencyGames([], chart.thresholds, 0, lowerBetter);
  // Default AVG is the player's PPG. Ranked charts locate the actual per-game
  // average at its same-position season rank, rather than averaging rank numbers.
  const seasonPpg = Number(state.currentGameLogsPlayerRanks?.ppg ?? state.playerSeasonStats?.[base.playerId]?.ppg);
  const averageValue = key === "fpts" && summary.gamesPlayed > 0 && Number.isFinite(seasonPpg) ? seasonPpg : summary.averageValue;
  const averageRank = rankSummary("averageValue", lowerBetter, false);
  return {
    ...base, ...chart, ...summary,
    statKey: key,
    series: chart.chartSeries,
    chartSeries: chart.chartSeries.filter(({ week }) => visibleWeeks.has(week)),
    weeksChartedLabel: pluralizeRostersWeeks(chart.chartSeries.filter(({ week }) => visibleWeeks.has(week)).length),
    skippedLabels,
    consistencyRank: rankSummary("consistencyPct"),
    ceilingRank: rankSummary("ceilingValue", lowerBetter),
    averageValue,
    averageRank,
    averagePlotValue: key === "fpts" ? clampRostersConsistencyPoints(averageValue) : getConsistencyRankPlotValue(averageValue, averageRank, chart.rankMax, key),
  };
}

function getRostersConsistencyAxisWeeks() {
  const weeks = Object.keys(state.playerWeeklyStats || {})
    .map(Number)
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  // The 2026 feed contains future schedule placeholders. End the nine-week
  // chart at the last week with recorded results instead of at Week 18.
  const recordedWeeks = state.currentGameLogsSeason === "2026"
    ? weeks.filter((week) => Object.values(state.playerWeeklyStats?.[week] || {}).some((stats) => stats.__hasRecordedStats))
    : weeks;
  const latestWeek = recordedWeeks[recordedWeeks.length - 1];
  return weeks.filter((week) => week <= latestWeek).slice(-9);
}

function clampRostersConsistencyPoints(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(ROSTERS_MAX_CONSISTENCY_POINTS, value));
}

function pluralizeRostersWeeks(count) {
  if (!count) return "No weeks charted";
  return count === 1 ? "1 week charted" : `${count} weeks charted`;
}

function buildRostersConsistencyPanelData(player) {
  if (!player?.id) return null;
  const axisWeeks = getRostersConsistencyAxisWeeks();
  if (!axisWeeks.length) return null;
  const position = String(player.pos || state.players?.[player.id]?.position || "FLEX").trim().toUpperCase();
  // The base owns only player/axis context. The selected metric supplies both
  // chart and HUD values, avoiding a stale FPTS snapshot after stat switches.
  return {
    playerId: player.id,
    position,
    axisWeeks,
    weekRangeLabel: axisWeeks[0] === axisWeeks.at(-1) ? `Week ${axisWeeks[0]}` : `Weeks ${axisWeeks[0]}–${axisWeeks.at(-1)}`,
    ceilingRankMax: ROSTERS_CONSISTENCY_RANK_MAX[position] || 32,
  };
}

function shouldSkipRostersConsistencyWeek(statsForWeek, projectionDisplay = statsForWeek?.proj) {
  if (!statsForWeek) {
    return false;
  }
  const rawFantasyPoints = statsForWeek.fpts_override ?? statsForWeek.fpt_ppr ?? statsForWeek.fpts;
  const numericFantasyPoints = Number(rawFantasyPoints);
  if (Number.isFinite(numericFantasyPoints) && numericFantasyPoints > 0.5) {
    return false;
  }
  // Consistency passes its SNP-aware display; Compare retains its own rules.
  const rawProj = projectionDisplay;
  if (rawProj === undefined || rawProj === null) {
    return false;
  }
  if (typeof rawProj === "number" && Number.isFinite(rawProj)) {
    return false;
  }
  const trimmedProj = String(rawProj).trim();
  if (!trimmedProj) {
    return false;
  }
  const numericProjection = Number(trimmedProj);
  if (Number.isFinite(numericProjection)) {
    return false;
  }
  // Preserve every literal missed-game designation, including DNP/DNR and
  // unfamiliar status text, rather than limiting the chart to an allowlist.
  return true;
}

function formatRostersProjReason(rawProj) {
  if (rawProj === undefined || rawProj === null) {
    return "";
  }
  const text = String(rawProj).trim();
  return text ? text.toUpperCase() : "";
}

function formatRostersHudPercentage(value, decimals = 1) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  return `${Number(value).toFixed(decimals)}%`;
}

function formatRostersConsistencyMetricAverage(data, value) {
  if (!Number.isFinite(value)) return "N/A";
  if (!data?.rankMode) return value.toFixed(1);
  // Rosters Consistency production summaries cap decimals below; other stats
  // retain Season/Weekly totals' units and precision. Format the calculated
  // average directly without reading season totals or recalculating it here.
  const key = data.statKey;
  // Production totals become fractional after averaging: cap their display at
  // one decimal, preserving integers/zero without unnecessary trailing .0.
  if (isConsistencyProductionStat(key)) {
    const formatted = String(Number(value.toFixed(1)));
    return key === "epa" && value > 0 ? `+${formatted}` : formatted;
  }
  const formatted = getGameLogsSeasonDisplayValue({
    key,
    seasonTotals: { [key]: value },
    aggregatedTotals: {},
    snapPctValues: [],
    statValueCounts: {},
    gameLogsWithData: [],
    player: { pos: data.position },
    playerRanks: {},
  });
  // Season/Weekly totals apply this final RB per-game precision after their
  // shared formatter. Mirror that display-only adjustment for HUD averages.
  if (state.currentGameLogsSeason === "2026" && data.position === "RB" && key !== "imp_per_g"
    && /(?:\/G|YPG)$/.test(ROSTERS_STAT_LABELS[key])) return value.toFixed(1);
  return formatted;
}

function renderRostersConsistencyAverage(pointsLayer, data) {
  if (!Number.isFinite(data.averageValue) || !Number.isFinite(data.averagePlotValue)) return;
  // The reference lives inside the same plot layer, so resizing and the padded
  // scoring/rank scale keep the dotted line aligned with the weekly points.
  const average = document.createElement("div");
  average.className = "weekly-average";
  average.style.top = `${yFromRostersConsistencyPoints(data.averagePlotValue)}%`;
  const label = document.createElement("span");
  label.className = "weekly-average__label";
  label.textContent = `AVG: ${formatRostersConsistencyMetricAverage(data, data.averageValue)}`;
  average.title = data.rankMode ? `Per-game average · ${data.position}${data.averageRank} among positional averages` : "Season points per game";
  average.appendChild(label);
  pointsLayer.appendChild(average);
  // Keep the horizontal anchor stable and center the label directly on the
  // dotted line. Move only the label to the nearest clear row above/below if
  // it would cover a weekly point, its chip, or a missed-game designation.
  const plot = pointsLayer.getBoundingClientRect();
  const bounds = label.getBoundingClientRect();
  const reference = average.getBoundingClientRect();
  const lineY = reference.top + reference.height / 2;
  const obstacles = [...pointsLayer.querySelectorAll(".weekly-point, .weekly-point-label, .weekly-skip-label")]
    .map((node) => node.getBoundingClientRect());
  const centerY = getConsistencyAverageLabelCenter(lineY, bounds, plot, obstacles);
  // Absolute child coordinates start inside the line's one-pixel border.
  label.style.top = `${centerY - reference.top - average.clientTop}px`;
  average.dataset.labelPlacement = Math.abs(centerY - lineY) < 1 ? "on-line" : centerY < lineY ? "above" : "below";
}

function getRostersRankAccentColor(rank) {
  if (!Number.isFinite(rank)) return "#f8faff";
  if (rank <= 12) return "#7cf5ff";
  if (rank <= 24) return "#56c4ff";
  return "#d3a5ff";
}

function applyRostersRankStyling({ rank, metricValueEl, metricSubEl, circleValueEl }) {
  const color = getRostersRankAccentColor(rank);
  if (metricValueEl) metricValueEl.style.color = color;
  if (circleValueEl) circleValueEl.style.color = color;
  if (metricSubEl) {
    const valueNode = metricSubEl.querySelector(".metric-sub-value");
    if (valueNode) {
      valueNode.textContent = Number.isFinite(rank) ? `${rank}` : "NA";
      valueNode.style.color = color;
    }
  }
}

function updateRostersConsistencyHud(data) {
  if (!consistencyContainer) {
    return;
  }
  consistencyContainer.querySelector("[data-week-range]")?.replaceChildren(document.createTextNode(data?.weekRangeLabel || "Weeks —"));
  consistencyContainer.querySelector("[data-weeks-charted]")?.replaceChildren(document.createTextNode(data?.weeksChartedLabel || "No weeks charted"));
  const consistencyRankEl = consistencyContainer.querySelector("[data-consistency-rank]");
  if (consistencyRankEl) {
    consistencyRankEl.textContent = Number.isFinite(data?.consistencyRank) ? `#${data.consistencyRank}` : "NA";
  }
  const ceilingValueEl = consistencyContainer.querySelector("[data-ceiling-value]");
  if (ceilingValueEl) {
    ceilingValueEl.textContent = formatRostersConsistencyMetricAverage(data, data?.ceilingValue);
  }
  const consistencyCircleValue = consistencyContainer.querySelector("[data-consistency-circle-value]");
  if (consistencyCircleValue) {
    consistencyCircleValue.textContent = formatRostersHudPercentage(data?.consistencyPct);
  }
  const ceilingCircleValue = consistencyContainer.querySelector("[data-ceiling-circle-rank]");
  if (ceilingCircleValue) {
    ceilingCircleValue.innerHTML = Number.isFinite(data?.ceilingRank)
      ? `${Math.round(data.ceilingRank)}<span class="ceiling-rank-suffix">${getRostersOrdinalSuffix(Math.round(data.ceilingRank))}</span>`
      : "NA";
  }
  const consistencyCaptionEl = consistencyContainer.querySelector("[data-consistency-circle-caption]");
  if (consistencyCaptionEl) consistencyCaptionEl.textContent = "CSTY RATE";
  const ceilingCaptionEl = consistencyContainer.querySelector("[data-ceiling-circle-caption]");
  if (ceilingCaptionEl) ceilingCaptionEl.textContent = "CL POS RANK";
  const consistencyRing = consistencyContainer.querySelector(".progress-circle--consistency .progress-ring-fill");
  const ceilingRing = consistencyContainer.querySelector(".progress-circle--ceiling .progress-ring-fill--ceiling");
  applyRostersRankStyling({
    rank: data?.consistencyRank,
    metricValueEl: consistencyRankEl,
    metricSubEl: null,
    circleValueEl: consistencyCircleValue,
  });
  if (consistencyRing) {
    consistencyRing.setAttribute("stroke", getRostersRankAccentColor(data?.consistencyRank));
  }
  applyRostersRankStyling({
    rank: data?.ceilingRank,
    metricValueEl: ceilingValueEl,
    metricSubEl: null,
    circleValueEl: ceilingCircleValue,
  });
  if (ceilingRing) {
    ceilingRing.setAttribute("stroke", getRostersRankAccentColor(data?.ceilingRank));
  }
  const cstyCountEl = consistencyContainer.querySelector("[data-insight-cstycount]");
  if (cstyCountEl) {
    const made = Number.isFinite(data?.solidHighCount) ? data.solidHighCount : null;
    const total = Number.isFinite(data?.totalWeeks) ? data.totalWeeks : null;
    if (made !== null && total !== null && total > 0) {
      const color = getRostersRankAccentColor(data?.consistencyRank);
      cstyCountEl.innerHTML = `<span class="csty-made" style="color:${color}">${made}</span><span class="hud-insight-suffix">/${total}</span>`;
    } else {
      cstyCountEl.textContent = "—";
    }
  }
  const bigGameEl = consistencyContainer.querySelector("[data-insight-best]");
  if (bigGameEl) {
    const highCount = Number.isFinite(data?.highWeekCount) ? data.highWeekCount : null;
    const gamesPlayed = Number.isFinite(data?.gamesPlayed)
      ? data.gamesPlayed
      : (Number.isFinite(data?.totalWeeks) ? data.totalWeeks : null);
    if (highCount !== null && gamesPlayed !== null && gamesPlayed > 0) {
      const percentage = (highCount / gamesPlayed) * 100;
      const color = percentage > 40
        ? ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS.high
        : (percentage < 23 ? ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS.low : ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS.solid);
      bigGameEl.style.color = "";
      bigGameEl.innerHTML = `<span style="color:${color}">${percentage.toFixed(1)}</span><span class="hud-insight-suffix">%</span>`;
    } else {
      bigGameEl.textContent = "—";
      bigGameEl.style.color = "";
    }
  }
  const lastFiveEl = consistencyContainer.querySelector("[data-insight-last5]");
  if (lastFiveEl) {
    if (Number.isFinite(data?.lastFiveAvg)) {
      const bucket = getRostersConsistencyBucket(data.rankMode ? data.lastFivePlotValue : data.lastFiveAvg, data.thresholds || getRostersConsistencyThresholds(data?.position));
      const color = bucket?.name === "high"
        ? ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS.high
        : (bucket?.name === "solid" ? ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS.solid : ROSTERS_CONSISTENCY_HUD_CONDITIONAL_COLORS.low);
      lastFiveEl.style.color = "";
      lastFiveEl.innerHTML = `<span style="color:${color}">${formatRostersConsistencyMetricAverage(data, data.lastFiveAvg)}</span><span class="hud-insight-suffix"> ${data.rankMode ? ROSTERS_STAT_LABELS[data.statKey] : "fpts"}</span>`;
    } else {
      lastFiveEl.textContent = "—";
      lastFiveEl.style.color = "";
    }
  }
}

function showRostersConsistencyEmptyState(chartBox, message) {
  if (!chartBox) {
    return;
  }
  let emptyEl = chartBox.querySelector(".consistency-empty-state");
  if (!emptyEl) {
    emptyEl = document.createElement("div");
    emptyEl.className = "consistency-empty-state";
    chartBox.appendChild(emptyEl);
  }
  emptyEl.textContent = message;
  emptyEl.classList.remove("hidden");
}

function hideRostersConsistencyEmptyState(chartBox) {
  const emptyEl = chartBox?.querySelector(".consistency-empty-state");
  if (emptyEl) {
    emptyEl.classList.add("hidden");
  }
}

function renderRostersConsistencyChart() {
  // The HUD, average reference and plot now share one selected-metric snapshot.
  const data = buildRostersConsistencyMetricData(state.currentConsistencyData, state.currentConsistencyStat);
  const chartBox = document.querySelector("#weekly-chart-box");
  const pointsLayer = document.querySelector("#weekly-chart-points");
  const xAxisEl = document.querySelector("#weekly-chart-x-axis");
  if (!chartBox || !pointsLayer || !xAxisEl) {
    return;
  }
  updateRostersConsistencyHud(data);
  pointsLayer.dataset.rankMode = String(Boolean(data?.rankMode));
  if (data?.rankMode) {
    pointsLayer.style.setProperty("--rank-high-edge", `${yFromRostersConsistencyPoints(data.thresholds.high)}%`);
    pointsLayer.style.setProperty("--rank-solid-edge", `${yFromRostersConsistencyPoints(data.thresholds.solid)}%`);
  }
  chartBox.setAttribute("role", "img");
  const description = data?.rankMode
    ? `${ROSTERS_STAT_LABELS[data.statKey]} weekly ${data.position} positional ranks. Green 1–12; blue 13–${data.rankZones.blueEnd}; purple ${data.rankZones.purpleStart}+. Point labels show statistic values.`
    : "Weekly PPR fantasy points with position-specific scoring zones.";
  chartBox.setAttribute("aria-label", description + (Number.isFinite(data?.averageValue)
    ? ` Average per played game: ${formatRostersConsistencyMetricAverage(data, data.averageValue)}.` : ""));
  requestAnimationFrame(() => {
    if (state.currentGameLogsView !== "consistency" || gameLogsModal?.classList.contains("hidden")
      || gameLogsModal?.classList.contains("is-team-view") || document.querySelector("#gamelogs-tab-pane")?.classList.contains("hidden")) return;
    if (!data) {
      renderRostersConsistencyXAxis({ axisWeeks: getRostersConsistencyAxisWeeks() });
      renderRostersConsistencyZoneSummary(null);
      pointsLayer.querySelectorAll(".weekly-point, .weekly-skip-label, .weekly-average").forEach((node) => node.remove());
      if (rostersCurveSvg) {
        rostersCurveSvg.remove();
        rostersCurveSvg = null;
      }
      showRostersConsistencyEmptyState(chartBox, "Consistency data unavailable.");
      hydrateRostersConsistencyProgressCircles(data);
      return;
    }
    renderRostersConsistencyXAxis(data);
    renderRostersConsistencyZoneSummary(data);
    renderRostersConsistencyPoints(data);
    hydrateRostersConsistencyProgressCircles(data);
    const hasVisibleStatus = data.axisWeeks.some((week) => data.skippedLabels?.[week]);
    if (!data.chartSeries.length && !hasVisibleStatus) {
      showRostersConsistencyEmptyState(chartBox, data.rankMode ? `No ${ROSTERS_STAT_LABELS[data.statKey]} recorded for these weeks.` : "No fantasy points recorded yet.");
    } else {
      hideRostersConsistencyEmptyState(chartBox);
    }
  });
}

function getRostersConsistencyThresholds(position) {
  return ROSTERS_CONSISTENCY_THRESHOLD_MAP[String(position || "").trim().toUpperCase()]
    || ROSTERS_CONSISTENCY_THRESHOLD_MAP.DEFAULT;
}

function renderRostersConsistencyZoneSummary(data) {
  const container = document.querySelector("#weekly-zone-summary");
  if (!container) {
    return;
  }
  const lowEl = container.querySelector("[data-zone-low]");
  const solidEl = container.querySelector("[data-zone-solid]");
  const highEl = container.querySelector("[data-zone-high]");
  const lowThresholdEl = container.querySelector("[data-threshold-low]");
  const solidThresholdEl = container.querySelector("[data-threshold-solid]");
  const highThresholdEl = container.querySelector("[data-threshold-high]");
  const resetCounts = () => {
    if (lowEl) lowEl.textContent = "0";
    if (solidEl) solidEl.textContent = "0";
    if (highEl) highEl.textContent = "0";
  };
  const resetThresholds = () => {
    if (lowThresholdEl) lowThresholdEl.textContent = "";
    if (solidThresholdEl) solidThresholdEl.textContent = "";
    if (highThresholdEl) highThresholdEl.textContent = "";
  };
  if (!data || (!data.series?.length && !data.rankMode)) {
    resetCounts();
    resetThresholds();
    return;
  }
  const thresholds = data.thresholds || getRostersConsistencyThresholds(data.position);
  const solidRounded = Math.round(thresholds.solid);
  const highRounded = Math.round(thresholds.high);
  if (lowThresholdEl) lowThresholdEl.textContent = data.rankMode ? `(${data.rankZones.purpleStart}+):` : `(<${solidRounded}):`;
  if (solidThresholdEl) solidThresholdEl.textContent = data.rankMode ? `(13–${data.rankZones.blueEnd}):` : `(${solidRounded}-${highRounded}):`;
  if (highThresholdEl) highThresholdEl.textContent = data.rankMode ? "(1–12):" : `(≥${highRounded}):`;
  let low = 0;
  let solid = 0;
  let high = 0;
  (data.chartSeries || data.series).forEach((entry) => {
    const points = entry?.pts;
    if (!Number.isFinite(points)) {
      return;
    }
    if (points >= thresholds.high) {
      high += 1;
    } else if (points >= thresholds.solid) {
      solid += 1;
    } else {
      low += 1;
    }
  });
  if (lowEl) lowEl.textContent = String(low);
  if (solidEl) solidEl.textContent = String(solid);
  if (highEl) highEl.textContent = String(high);
}

function renderRostersConsistencyXAxis(data) {
  const xAxisEl = document.querySelector("#weekly-chart-x-axis");
  if (!xAxisEl) {
    return;
  }
  xAxisEl.innerHTML = "";
  // Match the shared Rosters/Stats modal axis contract so mobile styling can
  // target the separate week prefix and number spans exactly the same way.
  const isMobile = typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(max-width: 540px)").matches;
  const weeks = data?.axisWeeks?.length ? data.axisWeeks : getRostersConsistencyAxisWeeks();
  const playedWeeks = new Set(Array.isArray(data?.chartSeries) ? data.chartSeries.map((entry) => entry.week) : []);
  const totalSlots = weeks.length || 1;
  const spanSlots = Math.max(1, totalSlots - 1);
  const edgePaddingPct = getRostersEdgePaddingPct(totalSlots);
  if (edgePaddingPct > 0) {
    xAxisEl.dataset.padding = edgePaddingPct;
  } else {
    delete xAxisEl.dataset.padding;
  }
  weeks.forEach((week, slotIndex) => {
    const pctX = totalSlots === 1
      ? 50
      : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const label = document.createElement("span");
    if (isMobile) {
      const prefix = document.createElement("span");
      prefix.className = "axis-week-prefix";
      prefix.textContent = "wk";
      const number = document.createElement("span");
      number.className = "axis-week-number";
      number.textContent = `${week}`;
      label.append(prefix, number);
    } else {
      label.textContent = `WK${week}`;
    }
    if (playedWeeks.size && !playedWeeks.has(week)) {
      label.classList.add("axis-week-missed");
    }
    label.style.left = `${pctX}%`;
    xAxisEl.appendChild(label);
  });
}

function ensureRostersCurveInfrastructure(pointsLayer) {
  if (!rostersCurveSvg) {
    rostersCurveSvg = document.createElementNS(ROSTERS_SVG_NS, "svg");
    rostersCurveSvg.setAttribute("class", "weekly-curve-layer");
    rostersCurveSvg.style.position = "absolute";
    rostersCurveSvg.style.inset = "0";
    rostersCurveSvg.style.pointerEvents = "none";
  }
  if (!pointsLayer.contains(rostersCurveSvg)) {
    pointsLayer.prepend(rostersCurveSvg);
  }
  let defs = rostersCurveSvg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(ROSTERS_SVG_NS, "defs");
    rostersCurveSvg.appendChild(defs);
  }
  let areaPath = rostersCurveSvg.querySelector(".weekly-area-path");
  if (!areaPath) {
    areaPath = document.createElementNS(ROSTERS_SVG_NS, "path");
    areaPath.setAttribute("class", "weekly-area-path");
    rostersCurveSvg.appendChild(areaPath);
  }
  let lineGroup = rostersCurveSvg.querySelector(".weekly-line-group");
  if (!lineGroup) {
    lineGroup = document.createElementNS(ROSTERS_SVG_NS, "g");
    lineGroup.setAttribute("class", "weekly-line-group");
    rostersCurveSvg.appendChild(lineGroup);
  }
  if (areaPath.nextSibling !== lineGroup) {
    rostersCurveSvg.insertBefore(areaPath, lineGroup);
  }
  return { svg: rostersCurveSvg, defs, areaPath, lineGroup };
}

function clampRostersGradientOffset(value) {
  return Math.min(1, Math.max(0, value));
}

function updateRostersConsistencyAreaGradient(defs, height, thresholds) {
  let gradient = defs.querySelector(`#${ROSTERS_CONSISTENCY_AREA_GRADIENT_ID}`);
  if (!gradient) {
    gradient = document.createElementNS(ROSTERS_SVG_NS, "linearGradient");
    gradient.id = ROSTERS_CONSISTENCY_AREA_GRADIENT_ID;
    defs.appendChild(gradient);
  }
  gradient.setAttribute("gradientUnits", "userSpaceOnUse");
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", `${height}`);
  gradient.setAttribute("x2", "0");
  gradient.setAttribute("y2", "0");
  const solidOffset = clampRostersGradientOffset((thresholds?.solid || 0) / ROSTERS_MAX_CONSISTENCY_POINTS);
  const highOffset = clampRostersGradientOffset((thresholds?.high || 0) / ROSTERS_MAX_CONSISTENCY_POINTS);
  const stops = [
    { offset: 0, color: ROSTERS_CONSISTENCY_GRADIENT_COLORS.low },
    { offset: solidOffset, color: ROSTERS_CONSISTENCY_GRADIENT_COLORS.solid },
    { offset: highOffset, color: ROSTERS_CONSISTENCY_GRADIENT_COLORS.high },
    { offset: 1, color: ROSTERS_CONSISTENCY_GRADIENT_COLORS.high },
  ];
  while (gradient.firstChild) {
    gradient.removeChild(gradient.firstChild);
  }
  stops.forEach((stopDef) => {
    const stop = document.createElementNS(ROSTERS_SVG_NS, "stop");
    stop.setAttribute("offset", clampRostersGradientOffset(stopDef.offset).toFixed(3));
    stop.setAttribute("stop-color", stopDef.color);
    gradient.appendChild(stop);
  });
}

function ensureRostersConsistencyLineFilter(defs) {
  let filter = defs.querySelector(`#${ROSTERS_CONSISTENCY_LINE_FILTER_ID}`);
  if (filter) {
    return;
  }
  filter = document.createElementNS(ROSTERS_SVG_NS, "filter");
  filter.id = ROSTERS_CONSISTENCY_LINE_FILTER_ID;
  // Rosters Consistency: equal adjacent ranks produce a horizontal path with
  // a zero-height bounding box. Use the SVG viewport for the glow region so
  // those valid flat connections remain visible instead of being filtered out.
  filter.setAttribute("filterUnits", "userSpaceOnUse");
  filter.setAttribute("x", "-10%");
  filter.setAttribute("y", "-10%");
  filter.setAttribute("width", "120%");
  filter.setAttribute("height", "120%");
  const shadow = document.createElementNS(ROSTERS_SVG_NS, "feDropShadow");
  shadow.setAttribute("dx", "0");
  shadow.setAttribute("dy", "1");
  shadow.setAttribute("stdDeviation", "0.5");
  shadow.setAttribute("flood-color", "#d2e6fa");
  shadow.setAttribute("flood-opacity", "0.06");
  filter.appendChild(shadow);
  defs.appendChild(filter);
}

function ensureRostersConsistencyAreaFilter(defs) {
  let filter = defs.querySelector(`#${ROSTERS_CONSISTENCY_AREA_FILTER_ID}`);
  if (filter) {
    return;
  }
  filter = document.createElementNS(ROSTERS_SVG_NS, "filter");
  filter.id = ROSTERS_CONSISTENCY_AREA_FILTER_ID;
  filter.setAttribute("x", "-40%");
  filter.setAttribute("y", "-60%");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "240%");
  const shadow = document.createElementNS(ROSTERS_SVG_NS, "feDropShadow");
  shadow.setAttribute("dx", "0");
  shadow.setAttribute("dy", "10");
  shadow.setAttribute("stdDeviation", "30");
  shadow.setAttribute("flood-color", "#38bdf8");
  shadow.setAttribute("flood-opacity", "0.22");
  filter.appendChild(shadow);
  defs.appendChild(filter);
}

function getRostersSegmentThresholds(thresholds) {
  if (!thresholds) {
    return [];
  }
  return Array.from(new Set([thresholds.solid, thresholds.high].filter(Number.isFinite))).sort((left, right) => left - right);
}

function createRostersCubicSegment(p0, p1, value0, value1) {
  const deltaX = (p1.x - p0.x) * 0.35;
  return {
    p0,
    c1: { x: p0.x + deltaX, y: p0.y },
    c2: { x: p1.x - deltaX, y: p1.y },
    p1,
    v0: value0,
    v1: value1,
  };
}

function lerpRostersPoint(left, right, t) {
  return {
    x: left.x + ((right.x - left.x) * t),
    y: left.y + ((right.y - left.y) * t),
  };
}

function splitRostersCubicSegment(segment, t) {
  const { p0, c1, c2, p1, v0, v1 } = segment;
  const p01 = lerpRostersPoint(p0, c1, t);
  const p12 = lerpRostersPoint(c1, c2, t);
  const p23 = lerpRostersPoint(c2, p1, t);
  const p012 = lerpRostersPoint(p01, p12, t);
  const p123 = lerpRostersPoint(p12, p23, t);
  const p0123 = lerpRostersPoint(p012, p123, t);
  const splitValue = v0 + ((v1 - v0) * t);
  return [
    {
      p0,
      c1: p01,
      c2: p012,
      p1: p0123,
      v0,
      v1: splitValue,
    },
    {
      p0: p0123,
      c1: p123,
      c2: p23,
      p1,
      v0: splitValue,
      v1,
    },
  ];
}

function splitRostersSegmentByThresholds(segment, thresholds) {
  if (!thresholds.length) {
    return [segment];
  }
  const delta = segment.v1 - segment.v0;
  if (delta === 0) {
    return [segment];
  }
  const breakpoints = thresholds
    .map((threshold) => {
      const minValue = Math.min(segment.v0, segment.v1);
      const maxValue = Math.max(segment.v0, segment.v1);
      if (threshold <= minValue || threshold >= maxValue) {
        return null;
      }
      const t = (threshold - segment.v0) / delta;
      return t > 0 && t < 1 ? t : null;
    })
    .filter((value) => value !== null)
    .sort((left, right) => left - right);
  if (!breakpoints.length) {
    return [segment];
  }
  const segments = [];
  let remaining = segment;
  let previousT = 0;
  breakpoints.forEach((originalT) => {
    const adjustedT = (originalT - previousT) / (1 - previousT);
    const [leftSegment, rightSegment] = splitRostersCubicSegment(remaining, adjustedT);
    segments.push(leftSegment);
    remaining = rightSegment;
    previousT = originalT;
  });
  segments.push(remaining);
  return segments;
}

function rostersCubicSegmentToPath(segment) {
  const { p0, c1, c2, p1 } = segment;
  return `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`;
}

function buildRostersCurvePath(points) {
  if (points.length < 2) {
    return "";
  }
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const deltaX = (end.x - start.x) * 0.35;
    path += ` C ${start.x + deltaX} ${start.y}, ${end.x - deltaX} ${end.y}, ${end.x} ${end.y}`;
  }
  return path;
}

function buildRostersAreaPath(points, height) {
  if (points.length < 2) {
    return "";
  }
  const curvePath = buildRostersCurvePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${curvePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;
}

function extendRostersCurvePoints(points) {
  if (!points?.length) {
    return [];
  }
  if (points.length === 1) {
    return [
      { ...points[0], x: 0 },
      { ...points[0], x: 100 },
    ];
  }
  return [
    { ...points[0], x: 0 },
    ...points,
    { ...points[points.length - 1], x: 100 },
  ];
}

function drawRostersSegmentedCurve(pointsLayer, relativePoints, data) {
  if (!pointsLayer || relativePoints.length < 2) {
    if (rostersCurveSvg) {
      const areaPath = rostersCurveSvg.querySelector(".weekly-area-path");
      if (areaPath) {
        areaPath.setAttribute("d", "");
      }
      const lineGroup = rostersCurveSvg.querySelector(".weekly-line-group");
      if (lineGroup) {
        lineGroup.innerHTML = "";
      }
    }
    return;
  }
  const bounds = pointsLayer.getBoundingClientRect();
  const width = bounds.width || pointsLayer.clientWidth || pointsLayer.offsetWidth;
  const height = bounds.height || pointsLayer.clientHeight || pointsLayer.offsetHeight;
  if (!width || !height) {
    return;
  }
  const absolutePoints = relativePoints.map((point) => ({
    x: (point.x / 100) * width,
    y: (point.y / 100) * height,
    value: point.value,
  }));
  const { svg, defs, areaPath, lineGroup } = ensureRostersCurveInfrastructure(pointsLayer);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  updateRostersConsistencyAreaGradient(defs, height, data.thresholds);
  ensureRostersConsistencyLineFilter(defs);
  ensureRostersConsistencyAreaFilter(defs);
  areaPath.setAttribute("d", buildRostersAreaPath(absolutePoints, height));
  areaPath.setAttribute("fill", `url(#${ROSTERS_CONSISTENCY_AREA_GRADIENT_ID})`);
  areaPath.setAttribute("fill-opacity", "0.92");
  areaPath.setAttribute("filter", `url(#${ROSTERS_CONSISTENCY_AREA_FILTER_ID})`);
  lineGroup.innerHTML = "";
  const thresholdValues = getRostersSegmentThresholds(data.thresholds);
  for (let index = 0; index < absolutePoints.length - 1; index += 1) {
    const baseSegment = createRostersCubicSegment(
      absolutePoints[index],
      absolutePoints[index + 1],
      absolutePoints[index].value,
      absolutePoints[index + 1].value,
    );

    // Consistency Chart Line Stroke Width 
    
    const splitSegments = splitRostersSegmentByThresholds(baseSegment, thresholdValues);
    splitSegments.forEach((segment) => {
      const path = document.createElementNS(ROSTERS_SVG_NS, "path");
      path.setAttribute("d", rostersCubicSegmentToPath(segment));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", getRostersConsistencyBucket((segment.v0 + segment.v1) / 2, data.thresholds).color);
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("filter", `url(#${ROSTERS_CONSISTENCY_LINE_FILTER_ID})`);
      lineGroup.appendChild(path);
    });
  }
}

function getRostersEdgePaddingPct(slotCount) {
  if (slotCount <= 1) return 0;
  // A small pixel minimum keeps the longer fractional stat chips inside even
  // a 320px phone. Axis and plot read this same width to retain aligned weeks.
  const width = document.querySelector("#weekly-chart-points")?.clientWidth;
  return Math.max(ROSTERS_CONSISTENCY_EDGE_PADDING_PCT, width > 0 ? (16 / width) * 100 : 0);
}

function yFromRostersConsistencyPoints(points) {
  const clamped = Math.max(0, Math.min(points, ROSTERS_MAX_CONSISTENCY_POINTS));
  const rawPct = (1 - (clamped / ROSTERS_MAX_CONSISTENCY_POINTS)) * 100;
  const paddedRange = 100 - (ROSTERS_CONSISTENCY_VERTICAL_PADDING_PCT * 2);
  return ROSTERS_CONSISTENCY_VERTICAL_PADDING_PCT + ((rawPct / 100) * paddedRange);
}

function renderRostersConsistencyPoints(data) {
  const pointsLayer = document.querySelector("#weekly-chart-points");
  if (!pointsLayer) {
    return;
  }
  pointsLayer.querySelectorAll(".weekly-point, .weekly-skip-label, .weekly-average").forEach((node) => node.remove());
  if (rostersCurveSvg) {
    rostersCurveSvg.remove();
    rostersCurveSvg = null;
  }
  const chartSeries = data.chartSeries || data.series;
  const axisWeeks = data.axisWeeks.length ? data.axisWeeks : chartSeries.map((entry) => entry.week);
  const totalSlots = axisWeeks.length || chartSeries.length || 1;
  // Render status-only charts too; an injured player may have no scored games.
  const spanSlots = Math.max(1, totalSlots - 1);
  const edgePaddingPct = getRostersEdgePaddingPct(totalSlots);
  const curvePoints = [];
  chartSeries.forEach((entry) => {
    const slotIndex = Math.max(0, axisWeeks.indexOf(entry.week));
    const pctX = totalSlots === 1
      ? 50
      : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const pctY = yFromRostersConsistencyPoints(entry.pts);
    curvePoints.push({ x: pctX, y: pctY, value: entry.pts });
    const bucket = getRostersConsistencyBucket(entry.pts, data.thresholds);
    const pointEl = document.createElement("div");
    pointEl.className = "weekly-point";
    pointEl.dataset.zone = bucket.name;
    pointEl.style.setProperty("--point-color", bucket.color);
    pointEl.style.left = `${pctX}%`;
    pointEl.style.top = `${pctY}%`;
    const rawValue = Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts;
    const position = data.position;
    const formattedValue = data.rankMode
      ? formatRostersGameLogCellValue(data.statKey, rawValue, state.currentGameLogsSeason === "2026" && position === "QB", state.currentGameLogsSeason === "2026" && position === "RB", state.currentGameLogsSeason === "2026" && ["WR", "TE"].includes(position))
      : rawValue.toFixed(1);
    pointEl.title = `WK${entry.week}: ${formattedValue}${data.rankMode ? ` ${ROSTERS_STAT_LABELS[data.statKey]} · ${position}${entry.rank}` : " PPR FPTS"}${entry.opponent ? ` vs ${entry.opponent}` : ""}`;
    if (entry.baselineProduction) pointEl.title += " · No positive production; plotted at the baseline";
    const label = document.createElement("div");
    label.className = `weekly-point-label weekly-point-label--${bucket.name}`;
    // Non-default metric chips show only the value and positional rank; their
    // week is already identified on the x axis. Preserve the default FPTS chip.
    if (!data.rankMode) {
      const suffix = document.createElement("span");
      suffix.className = "weekly-point-label__suffix";
      suffix.textContent = `wk${entry.week}`;
      label.appendChild(suffix);
    }
    const valueSpan = document.createElement("span");
    valueSpan.className = "weekly-point-label__value";
    const valueNumber = document.createElement("span");
    valueNumber.style.color = bucket.color;
    valueNumber.textContent = formattedValue;
    valueSpan.appendChild(valueNumber);
    if (!data.rankMode && Number.isFinite(rawValue) && rawValue > ROSTERS_MAX_CONSISTENCY_POINTS) {
      label.classList.add("weekly-point-label--capped");
    }
    label.appendChild(valueSpan);
    if (data.rankMode) {
      const rankLabel = document.createElement("span");
      rankLabel.className = "weekly-point-label__suffix weekly-point-label__rank";
      // Match the default week caption, with a slightly smaller uppercase
      // position prefix so WR/RB/QB/TE do not visually outweigh its rank.
      const positionLabel = document.createElement("span");
      positionLabel.className = "weekly-point-label__position";
      positionLabel.textContent = position;
      rankLabel.append(positionLabel, document.createTextNode(String(entry.rank)));
      label.appendChild(rankLabel);
    }
    pointEl.appendChild(label);
    pointsLayer.appendChild(pointEl);
  });
  const skipped = data.skippedLabels || {};
  const playedWeekSet = new Set(chartSeries.map((entry) => entry.week));
  axisWeeks.forEach((week, slotIndex) => {
    if (!skipped[week] || playedWeekSet.has(week)) {
      return;
    }
    const pctX = totalSlots === 1
      ? 50
      : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const previous = [...chartSeries].reverse().find((entry) => entry.week < week);
    const next = chartSeries.find((entry) => entry.week > week);
    let interpolatedPoints = null;
    if (previous && next && next.week !== previous.week) {
      const t = (week - previous.week) / (next.week - previous.week);
      interpolatedPoints = previous.pts + ((next.pts - previous.pts) * t);
    } else if (previous) {
      interpolatedPoints = previous.pts;
    } else if (next) {
      interpolatedPoints = next.pts;
    }
    const marker = document.createElement("div");
    marker.className = "weekly-skip-label";
    marker.textContent = skipped[week];
    marker.title = `WK${week}: ${skipped[week]}`;
    marker.style.left = `${pctX}%`;
    // With no neighboring game, center the status without inventing a score.
    marker.style.top = Number.isFinite(interpolatedPoints) ? `${yFromRostersConsistencyPoints(interpolatedPoints)}%` : "50%";
    pointsLayer.appendChild(marker);
  });
  if (curvePoints.length) drawRostersSegmentedCurve(pointsLayer, extendRostersCurvePoints(curvePoints), data);
  renderRostersConsistencyAverage(pointsLayer, data);
}

function hydrateRostersConsistencyProgressCircles(data) {
  const consistencyCircle = document.querySelector(".progress-circle--consistency .progress-ring-fill");
  const pctValue = data && Number.isFinite(data.consistencyPct)
    ? Math.max(0, Math.min(100, data.consistencyPct)) / 100
    : 0;
  if (consistencyCircle) {
    consistencyCircle.style.setProperty("--progress", pctValue.toFixed(3));
  }
  const ceilingCircle = document.querySelector(".progress-circle--ceiling .progress-ring-fill--ceiling");
  if (ceilingCircle) {
    const rankMax = Math.max(2, data?.ceilingRankMax || 24);
    const rank = Number.isFinite(data?.ceilingRank) ? data.ceilingRank : rankMax;
    const normalized = Math.max(0, Math.min(1, (rankMax - rank) / (rankMax - 1)));
    ceilingCircle.style.setProperty("--progress", normalized.toFixed(3));
  }
}

// Rosters HUD, chips and curve segments share the selected metric's zones.
// Rank charts pass rank-space thresholds; FPTS retains scoring thresholds.
function getRostersConsistencyBucket(points, thresholds) {
  if (!Number.isFinite(points)) return { ...ROSTERS_CONSISTENCY_BUCKET_STYLES.low, name: "low" };
  if (points >= thresholds.high) return { ...ROSTERS_CONSISTENCY_BUCKET_STYLES.high, name: "high" };
  if (points >= thresholds.solid) return { ...ROSTERS_CONSISTENCY_BUCKET_STYLES.solid, name: "solid" };
  return { ...ROSTERS_CONSISTENCY_BUCKET_STYLES.low, name: "low" };
}

// Install only the Rosters hooks; the shared app's other pages keep their
// existing charts, footer behavior and event flow.
window.prepareConsistencyPanel = prepareRostersConsistencyPanel;
window.renderConsistencyChart = renderRostersConsistencyChart;
window.RostersGameLogsConsistency = Object.freeze({
  closeMenu: closeRostersConsistencyStatMenu,
  syncControl: syncRostersConsistencyStatControl,
  availableStats: getRostersConsistencyStatOptions,
  dispose() {
    closeRostersConsistencyStatMenu();
    rostersCurveSvg?.remove();
    rostersCurveSvg = null;
    state.currentConsistencyData = null;
  },
});
attachRostersConsistencyStatListeners();
document.addEventListener('click', event => {
  if (!gameLogsStatDropdown?.contains(event.target)) closeRostersConsistencyStatMenu();
});
// Menu Escape is consumed before app.js closes the enclosing player dialog.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !gameLogsStatMenu.classList.contains('hidden')) {
    event.preventDefault(); event.stopImmediatePropagation();
    closeRostersConsistencyStatMenu({ restoreFocus: true });
  }
}, true);
window.addEventListener('resize', () => {
  if (state.currentGameLogsView === 'consistency' && !gameLogsModal.classList.contains('hidden')) renderRostersConsistencyChart();
});
})();
