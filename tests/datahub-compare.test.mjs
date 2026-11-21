import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { getConsistencyDialTone } from "../DH_P2.53/scripts/datahub-gamelogs-controls.js";
import { buildWeeklyChartOption, getWeeklyChartLayout, getWeeklyWeekEntry } from "../DH_P2.53/scripts/datahub-comparison/comparisonChartOptions.js";
import { buildScoringProfile, buildScoringSpread, buildSeasonMetricRows, getSeasonPalettes } from "../DH_P2.53/scripts/datahub-comparison/comparisonSeasonPanel.js";

const dataHubSource = readFileSync(new URL("../DH_P2.53/scripts/DataHub.js", import.meta.url), "utf8");

test("Compare keeps Week 1 when the current season passes nine games and stops before future placeholders", () => {
  const payload = dataHubSource.match(/function buildDataHubComparisonPayload\(\) \{[^]*?\n\}/)[0];
  const state = {
    statsSeason: "2026",
    comparisonData: { weeklyRows: [
      { week: 18, stats: { __hasRecordedStats: false, proj: 24 } },
      { week: 11, stats: { __hasRecordedStats: true } },
      { week: 1, stats: { __hasRecordedStats: true } },
    ] },
  };
  const context = vm.createContext({
    state,
    DATAHUB_MAX_WEEKS: 18,
    buildDataHubComparisonPlayers: () => [],
    getDataHubGameLogsQualifiedIds: () => new Set(),
    computeDataHubComparisonSeasonRankSets: () => ({ overall: {}, positional: {} }),
  });
  vm.runInContext(payload, context);
  const weeks = () => Array.from(context.buildDataHubComparisonPayload().weeks);
  assert.deepEqual(weeks(), Array.from({ length: 11 }, (_, i) => i + 1));
  state.comparisonData.weeklyRows = [{ week: 12, stats: { __hasRecordedStats: false, proj: 24 } }];
  assert.deepEqual(weeks(), []);
  state.statsSeason = "2025";
  assert.deepEqual(weeks(), Array.from({ length: 18 }, (_, i) => i + 1));
});

test("the season payload ranks the count-derived impact rate for qualified players", () => {
  const context = vm.createContext({
    state: { comparisonData: { seasonStats: { rb: { imp_per_opp: 0.25 } } } },
    toComparableNumber: (value) => value == null || value === "" ? null : Number(value),
    isDataHubComparisonLowerBetter: () => false,
    DATAHUB_COMPARISON_SEASON_VALUE_KEYS: ["opp", "imp"],
  });
  const functions = ["setDataHubComparisonStat", "setDataHubComparisonRatio",
    "getDataHubComparisonRowAlias", "buildDataHubComparisonSeasonStats",
    "assignDataHubComparisonRanks", "computeDataHubComparisonSeasonRankSets"];
  vm.runInContext(functions.map((name) => dataHubSource.match(new RegExp(`function ${name}\\([^]*?\\n\\}`))[0]).join("\n"), context);
  const players = [
    ["rb", "RB", "200", "50"], ["qb", "QB", "400", "80"],
    ["other", "RB", "4", "4"], ["zero", "RB", "0", "0"],
  ].map(([id, pos, OPP, IMP]) => ({ id, pos, seasonStats: context.buildDataHubComparisonSeasonStats(id, { OPP, IMP }) }));
  const { positional } = context.computeDataHubComparisonSeasonRankSets(players, new Set(["rb", "qb"]));
  const ranked = players.slice(0, 2).map((player) => ({ ...player, seasonPosRanks: positional[player.id] }));
  const row = buildSeasonMetricRows(ranked, "efficiency").find(({ key }) => key === "imp_per_opp");
  assert.deepEqual(row.values, [25, 20]);
  assert.deepEqual(row.ranks, [1, 1]);
  assert.equal(row.trailing, null);
  assert.equal(positional.other, undefined);
  assert.equal(players[3].seasonStats.imp_per_opp, undefined);
});

test("the shared plot preserves tied, negative, zero and missing values with both endpoints and both line styles", () => {
  const week = (week, fpts, extra = {}) => ({ week, stats: { fpts }, ...extra });
  const players = [
    { id: "a", pos: "WR", weeklySeries: [week(1, 0), week(2, -2), week(3, null, { skipped: true, skipLabel: "BYE" })] },
    { id: "b", pos: "WR", weeklySeries: [week(1, 0), week(2, 4), week(3, 8)] },
  ];
  for (const width of [292, 1120]) {
    const weeks = Array.from({ length: 18 }, (_, i) => i + 1);
    const layout = getWeeklyChartLayout(width, 180, weeks.length);
    const option = buildWeeklyChartOption({ players, statKey: "fpts", weeks, thresholds: {}, layout });
    const [a, b] = option.series.filter(({ type }) => type === "line");
    assert.deepEqual(a.data.slice(0, 4).map(({ value }) => value), [0, -2, null, null]);
    assert.deepEqual(b.data.slice(0, 4).map(({ value }) => value), [0, 4, 8, null]);
    assert.notEqual(a.lineStyle.type, b.lineStyle.type);
    assert.notEqual(a.symbol, b.symbol);
    assert.equal(getWeeklyWeekEntry(players[0], 3, "fpts").status, "BYE");
    assert.equal(option.xAxis.boundaryGap, false);
    assert.equal(option.yAxis.axisLabel.inside, true);
    assert.equal(option.xAxis.axisLabel.interval(0), true);
    assert.equal(option.xAxis.axisLabel.interval(17), true);
    assert.ok(layout.xForIndex(0) <= 17);
    assert.ok(Math.abs(width - layout.xForIndex(17)) <= 17.01);
    assert.equal(layout.indexAtX(layout.xForIndex(17)), 17);
  }
});

test("Compare's consistency meters share all seven Game Logs bands and distinguish zero from unavailable", () => {
  const midpoints = Array.from({ length: 7 }, (_, index) => (index + 0.5) / 7);
  assert.deepEqual(midpoints.map(getConsistencyDialTone), ["pink", "magenta", "violet", "blue", "cyan", "teal", "green"]);
  assert.equal(getConsistencyDialTone(0), "pink");
  assert.equal(getConsistencyDialTone(1), "green");
  assert.equal(getConsistencyDialTone(null), "neutral");
});

test("season bars compare qualified positional ranks and preserve tie, missing and zero values", () => {
  const a = {
    pos: "QB",
    seasonStats: { pass_yd: 300, pass_td: 0, ttt: 2.3, epa_per_db: -0.4, ppg: -2, ceiling: 12, imp_per_opp: 30 },
    seasonPosRanks: { pass_yd: 4, pass_td: 31, ttt: 2, ppg: 16 },
    seasonMatchupRanks: { ppg: null },
  };
  const b = {
    pos: "QB",
    seasonStats: { pass_yd: 300, pass_td: null, ttt: 2.6, epa_per_db: 0.4, ppg: 2 },
    seasonPosRanks: { pass_yd: 4, pass_td: 12, ttt: 26, epa_per_db: 8 },
    seasonMatchupRanks: { ppg: 21 },
  };
  const production = buildSeasonMetricRows([a, b], "production");
  const yards = production.find(({ key }) => key === "pass_yd");
  assert.equal(yards.label, "paYDS");
  assert.deepEqual(yards.ranks, [4, 4]);
  assert.equal(yards.barFractions[0], yards.barFractions[1]);
  assert.equal(yards.trailing, null);
  const touchdowns = production.find(({ key }) => key === "pass_td");
  assert.deepEqual(touchdowns.values, [0, null]);
  assert.deepEqual(touchdowns.ranks, [31, null]);
  assert.ok(touchdowns.barFractions[0] > 0);
  assert.equal(touchdowns.barFractions[1], null);
  assert.equal(touchdowns.trailing, null);

  const efficiency = buildSeasonMetricRows([a, b], "efficiency");
  assert.deepEqual(efficiency.find(({ key }) => key === "ppg").ranks, [null, 21]);
  const time = efficiency.find(({ key }) => key === "ttt");
  assert.equal(time.trailing, 1);
  assert.ok(time.barFractions[0] > time.barFractions[1]);
  const epa = efficiency.find(({ key }) => key === "epa_per_db");
  assert.equal(epa.label, "EPA/DB");
  assert.deepEqual(epa.values, [-0.4, 0.4]);
  assert.deepEqual(epa.ranks, [null, 8]);
  assert.equal(epa.trailing, null);

  const wr = { pos: "WR", seasonStats: { imp_per_opp: 75, rec_yd: 30 }, seasonPosRanks: { imp_per_opp: 80 } };
  const mixed = buildSeasonMetricRows([{ ...a, seasonPosRanks: { imp_per_opp: 1 } }, wr], "efficiency");
  const impact = mixed.find(({ key }) => key === "imp_per_opp");
  assert.deepEqual(impact.values, [30, 75]);
  assert.deepEqual(impact.barFractions, [1, 1 / 80]);
  assert.equal(impact.trailing, 1);
  assert.equal(mixed.some(({ key }) => key === "ttt"), false);
});

test("scoring gauges share a signed points scale and distinguish zero from missing", () => {
  const plot = buildScoringProfile([
    { seasonStats: { ppg: -2, ceiling: 12 } },
    { seasonStats: { ppg: 0 } },
  ]);
  assert.equal(plot.rows[1].ppg, 0);
  assert.equal(plot.rows[1].ceiling, null);
  assert.ok(plot.fraction(-2) < plot.fraction(0));
  assert.ok(plot.fraction(0) < plot.fraction(12));
  assert.ok(plot.ticks[0] < 0);
});

test("the scoring distribution includes the ceiling and keeps an evenly spaced axis with at least five ticks", () => {
  const game = (week, fpts, flags = {}) => ({ week, stats: { fpts }, played: true, ...flags });
  const players = [
    { seasonStats: { ceiling: 23.5 }, weeklySeries: [game(1, -2), game(2, 0), game(3, 0), game(4, 18), game(5, 30, { isSkipped: true }), game(6, 15, { played: false }), game(7, 100)] },
    { weeklySeries: [game(1, null)] },
  ];
  const spread = buildScoringSpread(players, [1, 2, 3, 4, 5, 6]);
  const [a, b] = spread.rows;
  assert.deepEqual(a.games.map(({ score }) => score), [-2, 0, 0, 18]);
  assert.deepEqual([a.low, a.median, a.high], [-0.5, 0, 4.5]);
  assert.equal(b.median, null);
  assert.ok(spread.fraction(-2) < spread.fraction(0));
  assert.equal(a.ceiling, 23.5);
  assert.equal(b.ceiling, null);
  assert.ok(spread.fraction(a.ceiling) > spread.fraction(18) && spread.fraction(a.ceiling) <= 1);

  const narrow = buildScoringSpread([{ seasonStats: { ceiling: 1.5 }, weeklySeries: [game(1, 0)] }], [1]);
  assert.ok(narrow.ticks.length >= 5);
  const step = narrow.ticks[1] - narrow.ticks[0];
  assert.ok(narrow.ticks.every((tick, index) => index === 0 || tick - narrow.ticks[index - 1] === step));
  assert.equal(narrow.fraction(narrow.ticks[0]), 0);
  assert.equal(narrow.fraction(narrow.ticks.at(-1)), 1);
});

test("season previews keep the exact weekly position assignment and both Start/Sit spectra", () => {
  const pair = [{ pos: "WR" }, { pos: "WR" }];
  const [first, second] = getSeasonPalettes(pair, "weekly");
  assert.deepEqual(first.colors, ["#FF0AA5", "#D747FF", "#8766FF", "#00DDFA"]);
  assert.deepEqual(second.colors, ["#004CFF", "#00B3FF", "#00EDFF", "#00FFCB"]);
  assert.deepEqual(getSeasonPalettes([{ pos: "RB" }, pair[0]], "weekly"), [second, first]);
  const [startSitA, startSitB] = getSeasonPalettes(pair, "start-sit");
  assert.deepEqual(startSitA.colors, ["#1264FF", "#118FFF", "#00C6EF", "#19EDDD"]);
  assert.deepEqual(startSitB.offsets, [0, 0.52, 1]);
  assert.notDeepEqual(getSeasonPalettes(pair, "default"), [first, second]);
});
