import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../DH_P2.53/scripts/app.js', import.meta.url), 'utf8');
const presentation = fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-start-sit.js', import.meta.url), 'utf8');
const hub = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const slice = (from, to) => app.slice(app.indexOf(from), app.indexOf(to, app.indexOf(from)));

// Exercise the actual Game Logs schema/formatter and new source adapter. These
// inputs intentionally cover negative/zero results, DNPs and future PROJ rows.
function harness(season = '2026') {
  const state = { currentGameLogsSeason: season, currentLeagueId: 'fixture', leagues: [{ league_id: 'fixture', scoring_settings: { rec: 1, rush_yd: .1 } }],
    players: { one: { position: 'RB' } }, playerSeasonStats: {}, playerWeeklyStats: {}, playerProjectionWeeks: {}, leagueMatchupStats: {},
    rosters2026GameLogs: { latestRecordedWeek: 4 }, rosters2025GameLogs: { latestRecordedWeek: 4 } };
  const context = vm.createContext({ state, pageType: 'rosters', window: {}, document: { body: { dataset: { page: 'rosters' } } },
    rostersMatchups: null, rostersMatchupsLoadFailed: false,
    getRostersGameLogsPlayerRanks: () => ({ total_pts: '12.0', ppg: '6.0', overallRank: 15 }),
    getSeasonRankValue: () => null, getCurrentNflWeekNumber: () => 5,
    getPlayerProjectionForWeek: () => ({ value: 0, display: '0.0' }),
    getPlayerMatchupForWeek: () => ({ opponent: 'BYE', isBye: true }),
    calculateFantasyPoints: line => (line.rec || 0) + (line.rush_yd || 0) * .1,
    formatPercentage: (value, decimals = 1) => `${Number(value).toFixed(decimals)}%`,
    formatSignedEpaValue: value => Number(value).toFixed(2),
  });
  vm.runInContext(slice('const PLAYER_STAT_HEADER_MAP = {', 'const SEASON_META_HEADERS = {')
    + slice('const SZN_STAT_SECTIONS_BY_POS = {', 'function computeSznProgressPercent(')
    + slice('function getGameLogsSeasonDisplayValue({', '// Rosters Game Logs Season headers own')
    + slice('function buildRostersDecisionPlayer(input) {', 'async function openRostersDecisionComparison(')
    // Test the actual private renderers without expanding the production API.
    + presentation.replace('overviewSections: OVERVIEW', 'overviewSections: OVERVIEW, metricRow, sparkline, projectionMatchup, projectionState'), context);
  return context;
}

test('current and historical same-position comparison includes the exact Game Logs Season sections', () => {
  for (const year of ['2026', '2025']) {
    const context = harness(year);
    for (const pos of ['QB', 'RB', 'WR', 'TE']) {
      const result = context.buildRostersDecisionPlayer({ id: 'one', pos, name: 'Fixture' });
      const expected = context.getSznSectionsForPosition(pos).map(section => ({ ...section,
        stats: section.stats.filter(key => context.buildStatLabels()[key]) }));
      assert.equal(JSON.stringify(result.sections), JSON.stringify(expected));
      for (const key of expected.flatMap(section => section.stats)) assert.ok(key in result.metrics, `${year} ${pos} ${key}`);
    }
  }
});

test('mixed-position schema is the full DataHub Overview in its displayed order', () => {
  const context = harness();
  const sections = context.window.RostersStartSit.overviewSections;
  const keys = Array.from(sections.flatMap(section => section.stats));
  const mapping = { overall_rank: 'RK', player_name: 'PLAYER', position: 'POS', team: 'TM', age: 'AGE', fpts: 'FPTS', ppg: 'PPG',
    games_played: 'G', snp_pct: 'SNP%', yds_total: 'YDS(t)', ypg: 'YPG(t)', td_total: 'TD(t)', opp: 'OPP', imp: 'IMP',
    imp_per_opp: 'IMP/OPP', tds_pct: 'TDS%', fpoe: 'FPOE', csty_pct: 'CSTY%', ceiling: 'CL' };
  const overview = vm.runInNewContext(`(${hub.match(/const STATS_COLUMN_SETS = (\{[\s\S]*?\n\});/)[1]})`).overview;
  assert.deepEqual(keys.map(key => mapping[key]), Array.from(overview));
  const player = context.buildRostersDecisionPlayer({ id: 'one', pos: 'QB' });
  keys.forEach(key => assert.ok(key in player.metrics, key));
});

test('recorded zero and negative scores survive while BYE, zero snaps, future results and overlays do not', () => {
  const context = harness();
  context.state.playerWeeklyStats = {
    1: { one: { snp: 10, __hasRecordedStats: true, rec: 0, opponent: 'BUF' } },
    2: { one: { snp: 20, __hasRecordedStats: true, rec: 1, opponent: 'NE' } },
    3: { one: { snp: 0, __hasRecordedStats: true, rec: 0, proj: 'OUT', opponent: 'NYJ' } },
    4: { one: { __hasRecordedStats: false, opponent: 'BYE' } },
    5: { one: { __hasRecordedStats: false, proj: '18.0', rec: 99 } },
  };
  context.state.leagueMatchupStats = { 2: { one: -2 }, 3: { one: 0 }, 5: { one: 99 } };
  context.state.liveWeeklyStats = { 1: { one: { fpts: 999, rec: 999 } } };
  context.state.playerProjectionWeeks[5] = true;
  const player = context.buildRostersDecisionPlayer({ id: 'one', pos: 'RB' });
  assert.deepEqual(Array.from(player.weekly, row => row.points), [0, -2, null, null]);
  assert.deepEqual(Array.from(player.weekly, row => row.status), ['—', '—', 'OUT', 'BYE']);
  assert.equal(player.projection, 0);
  assert.equal(player.projectionDisplay, '0.0');
});

test('Overview fields preserve literal source zeros, rates and missing values without invented totals', () => {
  const context = harness();
  context.state.playerSeasonStats.one = { pos: 'RB', td_total: 0, opp: 10, imp: 3, imp_per_opp: 30, games_played: 2,
    snp_pct: 0, tds_pct: 0, rush_att: 20, rush_td: 8, rec_td: 9 };
  const player = context.buildRostersDecisionPlayer({ id: 'one', pos: 'RB' });
  assert.equal(player.metrics.td_total.value, 0);
  assert.equal(player.metrics.td_total.display, '0');
  assert.equal(player.metrics.imp_per_opp.display, '30.0%');
  assert.equal(player.metrics.snp_pct.display, '0.0%');
  assert.equal(player.metrics.yds_total.value, null);
  assert.equal(player.metrics.yds_total.display, '—');
  delete context.state.playerSeasonStats.one.td_total;
  assert.equal(context.buildRostersDecisionPlayer({ id: 'one', pos: 'RB' }).metrics.td_total.display, '—');
});

test('weekly/cumulative chart series align calendar weeks and preserve gaps, zero and negative totals', () => {
  const { seriesFor } = harness().window.RostersStartSit;
  const players = [{ weekly: [{ week: 1, points: 0 }, { week: 2, points: -2 }, { week: 3, points: null }, { week: 4, points: 8 }] },
    { weekly: [{ week: 1, points: 4 }, { week: 3, points: 3 }, { week: 4, points: null }] }];
  assert.deepEqual(JSON.parse(JSON.stringify(seriesFor(players, 'cumulative'))), { weeks: [1, 2, 3, 4], series: [[0, -2, null, 6], [4, null, 7, null]] });
  assert.deepEqual(JSON.parse(JSON.stringify(seriesFor(players, 'weekly'))).series, [[0, -2, null, 8], [4, null, 3, null]]);
});

test('comparison bars retain the same percentage units as the Game Logs display', () => {
  const context = harness();
  context.state.playerSeasonStats.one = { expl_ru_pct: .125, dp_pct: .25 };
  const rb = context.buildRostersDecisionPlayer({ id: 'one', pos: 'RB' });
  assert.equal(rb.metrics.expl_ru_pct.display, '12.5%');
  assert.equal(rb.metrics.expl_ru_pct.value, 12.5);
  const qb = context.buildRostersDecisionPlayer({ id: 'one', pos: 'QB' });
  assert.equal(qb.metrics.dp_pct.display, '25.0%');
  assert.equal(qb.metrics.dp_pct.value, 25);
});

// Availability belongs to regular roster cards, including players with no
// season row. Full injury names still select the original badge colors.
function availabilityHarness() {
  const state = { currentNflWeek: 7, currentLeagueId: 'fixture', currentGameLogsSeason: '2026',
    leagues: [{ league_id: 'fixture', season: '2026' }], players: {},
    rosters2026GameLogs: { scheduleByTeam: { BUF: { 7: 'BYE', 8: 'vs BAL' }, JAX: { 7: 'BYE' } } } };
  const context = vm.createContext({ state, getCurrentNflWeekNumber: () => state.currentNflWeek,
    getPlayerMatchupForWeek: () => null, escapeHtml: value => String(value) });
  vm.runInContext(slice('const INJURY_DESIGNATION_COLORS = {', 'function parseInjuryDesignation(')
    + slice('function buildRosterAvailabilityBadge(', 'function createPlayerRow('), context);
  return context;
}

test('default roster badges show BYE plus an abbreviated injury in its original color', () => {
  const context = availabilityHarness();
  const player = { id: 'no-season-row', team: 'BUF' };
  for (const [designation, shortened, color] of [['IR', 'IR', '#d93d76'], ['OUT', 'O', '#D47DC6'],
    ['PUP', 'P', '#D47DC6'], ['Q', 'Q', '#fd9a3dff'], ['D', 'D', '#e780c3ff'],
    ['SUS', 'S', '#d93d76'], ['DNP', 'D', 'rgba(255, 174, 227, 0.47)']]) {
    const markup = context.buildRosterAvailabilityBadge(player, { designation }, true);
    assert.ok(markup.includes('>BYE</span><span class="roster-availability-separator"> | </span>'));
    assert.ok(markup.includes(`style="color:${color};">${shortened}</span>`));
    assert.ok(markup.includes(`Injury designation: ${designation}`), 'accessible injury name stays complete');
  }
  assert.match(context.buildRosterAvailabilityBadge(player, null, true), />BYE<\/span>/);
  assert.doesNotMatch(context.buildRosterAvailabilityBadge(player, null, true), / \| /);
  assert.match(context.buildRosterAvailabilityBadge({ ...player, team: 'JAC' }, null, true), />BYE<\/span>/);
  assert.equal(context.buildRosterAvailabilityBadge(player, { designation: 'NA' }, false), '');
  assert.equal(context.buildRosterAvailabilityBadge(player, null, false), '', 'other card modes do not add BYE');
  assert.match(context.buildRosterAvailabilityBadge(player, { designation: 'OUT' }, false), />OUT<\/span>/);
  context.state.currentNflWeek = 8;
  assert.doesNotMatch(context.buildRosterAvailabilityBadge(player, { designation: 'OUT' }, true), />BYE<\/span>/);
  assert.match(context.buildRosterAvailabilityBadge(player, { designation: 'OUT' }, true), />OUT<\/span>/);
});

function renderPreview(players) {
  const context = harness();
  context.ResizeObserver = class { observe() {} disconnect() {} };
  const mount = { classList: { add() {}, toggle() {} }, querySelector: () => null, querySelectorAll: () => [] };
  context.window.RostersStartSit.renderPreview({ mount, players, week: 7 });
  return mount.innerHTML;
}

function previewPlayer(id, projection = 18.5) {
  return { id, name: `Player ${id}`, pos: 'RB', team: 'BUF', projection,
    projectionDisplay: projection === null ? 'OUT' : projection.toFixed(1),
    metrics: { fpts: { value: 110.2, display: '110.2', rank: 24 }, ppg: { display: '18.4', rank: 12 } },
    weekly: [], matchup: { opponent: '@ HOU', opponentRank: 7 } };
}

test('preview shows season positional FPTS rank/total and schedule matchup directly below projection', () => {
  const first = previewPlayer('one');
  const second = { ...previewPlayer('two', 12.5), matchup: { opponent: 'vs. NYJ', opponentRank: 21 } };
  const markup = renderPreview([first, second]);
  assert.match(markup, /RB·24 <span>\(110\.2\)<\/span>/);
  assert.match(markup, /<strong>18\.5<\/strong><small class="ss-projection-matchup"[^>]*>@ HOU \(7\)<\/small>/);
  assert.match(markup, />vs\. NYJ \(21\)<\/small>/);
  assert.match(markup, /ss-preview-projection ss-leading/);
  assert.match(markup, /ss-preview-projection ss-trailing/);
  assert.equal((markup.match(/>Last 5 Games<\/span>/g) || []).length, 2);
  assert.match(markup, />Matchup Breakdown /);
});

test('projection comparison preserves numeric zero and leaves ties/status/missing data neutral', () => {
  const { projectionState, projectionMatchup } = harness().window.RostersStartSit;
  const zero = previewPlayer('zero', 0), high = previewPlayer('high', 8), missing = previewPlayer('missing', null);
  assert.equal(projectionState(zero, [zero, high]), ' ss-trailing');
  assert.equal(projectionState(high, [zero, high]), ' ss-leading');
  assert.equal(projectionState(zero, [zero, zero]), '');
  assert.equal(projectionState(missing, [high, missing]), '');
  assert.equal(projectionState(high, [high, missing]), '');
  assert.equal(projectionMatchup({ matchup: { opponent: 'BYE', isBye: true } }), '<small class="ss-projection-matchup">BYE</small>');
  assert.match(projectionMatchup({ matchup: { opponent: 'HOU' } }), />HOU<\/small>/, 'unknown venue is not invented');
});

test('preview sparkline labels the last five games, skipping gaps while keeping zero and negative scores', () => {
  const { sparkline } = harness().window.RostersStartSit;
  const weekly = [12, 11, null, 0, null, -2, 18, null, 9, 6].map((points, index) => ({ week: index + 1, points }));
  const markup = sparkline(weekly, 'fixture');
  assert.equal((markup.match(/class="ss-spark-value"/g) || []).length, 5);
  assert.match(markup, /Week 4: 0\.0 points; Week 6: -2\.0 points; Week 7: 18\.0 points; Week 9: 9\.0 points; Week 10: 6\.0 points/);
  assert.doesNotMatch(markup, /Week 1:/);
  assert.equal((sparkline(weekly.slice(0, 3), 'short').match(/class="ss-spark-value"/g) || []).length, 2);
  assert.match(sparkline([{ week: 1, points: 0 }], 'zero'), />0\.0<\/text>/);
  assert.match(sparkline([{ week: 1, points: null }], 'empty'), /No recorded games/);
});

test('comparison values and bars agree on better/worse for higher/lower stats and stay neutral for ties/gaps/context', () => {
  const { metricRow } = harness().window.RostersStartSit;
  const players = [{ pos: 'QB', labels: {}, metrics: {} }, { pos: 'QB', labels: {}, metrics: {} }];
  const row = (key, a, b) => {
    players[0].metrics[key] = { value: a, display: a === null ? '—' : String(a), rank: 5 };
    players[1].metrics[key] = { value: b, display: b === null ? '—' : String(b), rank: 21 };
    return metricRow(key, players);
  };
  for (const [key, a, b, winner] of [['fpts', 110, 90, 0], ['fpts', -2, 0, 1], ['pass_int', 1, 4, 0],
    ['pass_sack', 4, 1, 1], ['fum', 0, 1, 0], ['overall_rank', 21, 5, 1]]) {
    const markup = row(key, a, b);
    assert.match(markup, new RegExp(`ss-metric-value ss-side-${winner} ss-leading`));
    assert.match(markup, new RegExp(`ss-track ss-side-${1 - winner} ss-trailing`));
    assert.match(markup, new RegExp(`ss-metric-value ss-side-${1 - winner} ss-trailing`));
    assert.match(markup, /QB·5<\/small>/);
    assert.match(markup, /QB·21<\/small>/);
    assert.doesNotMatch(markup, /QB #/);
  }
  for (const markup of [row('fpts', 10, 10), row('fpts', 10, null), row('ttt', 2, 3)]) {
    assert.doesNotMatch(markup, /ss-leading|ss-trailing/);
  }
});
