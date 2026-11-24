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
    + slice('function getOpponentDefenseRank(', 'let tableCoreLoaderPromise')
    + slice('function buildRostersDecisionPlayer(input) {', 'async function openRostersDecisionComparison(')
    // Test the actual private renderers without expanding the production API.
    + presentation.replace('overviewSections: OVERVIEW', 'overviewSections: OVERVIEW, startSitStatGroups, metricRow, statSections, measureStatPlots, sparkline, shortName, projectionMatchup, projectionState, timelineOption, sizeTrajectory, playerHero, radarRadius, performanceRadar, hudDial, ring, radarValue, comparisonName, comparisonMarkup, scoringLabelsFor, scoringLabelMarkup, directedDifference'), context);
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

test('Start/Sit starts at positional production, keeps Fantasy above the switcher and renders one selected group', () => {
  const expectedLabels = {
    QB: ['Pass Production', 'Pass Efficiency', 'Rush Production', 'Rush Efficiency', 'General'],
    RB: ['Rush Production', 'Rush Efficiency', 'Rec Production', 'Rec Efficiency', 'General'],
    WR: ['Rec Production', 'Rec Efficiency', 'General Prod.', 'General Eff.'],
    TE: ['Rec Production', 'Rec Efficiency', 'General Prod.', 'General Eff.'],
  };
  const sprite = fs.readFileSync(new URL('../DH_P2.53/assets/icons/rosters-start-sit-stats.svg', import.meta.url), 'utf8');
  const checkIcons = markup => {
    const icons = [...markup.matchAll(/rosters-start-sit-stats\.svg#([^"]+)/g)].map(([, id]) => id);
    assert.ok(icons.length);
    for (const id of icons) assert.ok(sprite.includes(`id="${id}"`), `Missing SVG symbol ${id}`);
    assert.equal(icons.filter(id => id.startsWith('column-')).length, [...markup.matchAll(/data-ss-stat="/g)].length);
  };
  for (const season of ['2026', '2025']) {
    const context = harness(season);
    const { comparisonMarkup, startSitStatGroups } = context.window.RostersStartSit;
    for (const [pos, labels] of Object.entries(expectedLabels)) {
      const players = ['one', 'two'].map(id => context.buildRostersDecisionPlayer({ id, pos, name: `Player ${id}` }));
      const model = { players, season, week: 10, isStartSit: true };
      const groups = startSitStatGroups(players);
      assert.deepEqual(Array.from(groups, group => group.label), labels);
      assert.equal(groups[0].id, { QB: 'passing-production', RB: 'rushing-production', WR: 'receiving-production', TE: 'receiving-production' }[pos]);
      const ids = markup => [...markup.matchAll(/id="ss-section-([^"]+)"/g)].map(([, id]) => id);
      const initial = comparisonMarkup(model, players, 'weekly', groups);
      assert.deepEqual(ids(initial), ['fantasy', groups[0].id, 'radar']);
      for (const group of groups) {
        const markup = comparisonMarkup(model, players, 'weekly', groups, group);
        assert.ok(markup.indexOf('id="ss-section-fantasy"') < markup.indexOf('id="ss-positional-heading"'));
        assert.match(markup, /id="ss-positional-heading">Positional stats<\/h3>\s*<nav class="ss-stat-switcher" aria-labelledby="ss-positional-heading"/);
        assert.doesNotMatch(markup, /Bar length = positional rank|scroll horizontally for more weeks/);
        assert.match(markup, new RegExp(`id="ss-stat-tab-${group.id}"[^>]+aria-pressed="true"`));
        assert.equal((markup.match(/aria-pressed="true" aria-controls="ss-active-stat-panels"/g) || []).length, 1);
        const selectedIds = group.id === 'general' ? ['general-production', 'general-efficiency'] : [group.id];
        assert.deepEqual(ids(markup), ['fantasy', ...selectedIds, 'radar']);
        checkIcons(markup);
      }
    }
    const players = ['QB', 'WR'].map(pos => context.buildRostersDecisionPlayer({ id: pos, pos, name: `Player ${pos}` }));
    const groups = startSitStatGroups(players);
    assert.equal(groups.length, 0);
    const mixed = comparisonMarkup({ players, season, isStartSit: true }, players, 'weekly', groups);
    assert.doesNotMatch(mixed, /ss-stat-switcher|ss-positional-heading/);
    assert.deepEqual([...mixed.matchAll(/id="ss-section-([^"]+)"/g)].map(([, id]) => id), ['info', 'fantasy', 'overview', 'ceiling', 'radar']);
    checkIcons(mixed);
    const regular = comparisonMarkup({ players, season }, players, 'weekly');
    assert.match(regular, /class="ss-chapters"/);
    assert.match(regular, /Bar length = positional rank/);
    assert.match(regular, /scroll horizontally for more weeks/);
    assert.doesNotMatch(regular, /ss-stat-switcher|rosters-start-sit-stats\.svg/);
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
  assert.equal(context.buildRosterAvailabilityBadge(player, null, false), '', 'explicit opt-out omits BYE');
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
    weekly: [], matchup: { opponent: '@ HOU', opponentRank: 30 },
    matchupMetric: { team: 'HOU', actualRank: 7 }, matchupColor: '#82d8bee0' };
}

test('preview shows season positional FPTS rank/total and schedule matchup directly below projection', () => {
  const first = previewPlayer('one');
  const second = { ...previewPlayer('two', 12.5), matchup: { opponent: 'vs. NYJ', opponentRank: 3 },
    matchupMetric: { team: 'NYJ', actualRank: 21 } };
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

test('comparison headings retain surnames with suffixes and ordinary last names', () => {
  const { shortName } = harness().window.RostersStartSit;
  for (const [name, expected] of [['Brian Robinson Jr.', 'Robinson Jr.'], ['Michael Pittman Jr', 'Pittman Jr'],
    ['Marvin Harrison Jr.', 'Harrison Jr.'], ['Kenneth Walker III', 'Walker III'], ['John Metchie II', 'Metchie II'],
    ['Chris Olave', 'Olave'], ['Amon-Ra St. Brown', 'Brown'], ['  Brian   Robinson Jr.  ', 'Robinson Jr.'], ['', '']]) {
    assert.equal(shortName({ name }), expected);
    assert.equal(shortName({ label: name }), expected);
  }
});

test('comparison bar emphasis follows positional ranks regardless of raw stat magnitude or direction', () => {
  const { metricRow } = harness().window.RostersStartSit;
  const players = [{ pos: 'QB', labels: {}, metrics: {} }, { pos: 'QB', labels: {}, metrics: {} }];
  const row = (key, a, b, ranks = [5, 21]) => {
    players[0].metrics[key] = { value: a, display: a === null ? '—' : String(a), rank: ranks[0] };
    players[1].metrics[key] = { value: b, display: b === null ? '—' : String(b), rank: ranks[1] };
    return metricRow(key, players);
  };
  for (const [key, a, b] of [['fpts', 110, 90], ['fpts', -2, 0], ['pass_int', 1, 4], ['ttt', 2, 3], ['fpts', 10, 10]]) {
    const markup = row(key, a, b);
    assert.match(markup, /ss-metric-value ss-side-0 ss-leading/);
    assert.match(markup, /ss-stat-plot ss-side-1 ss-trailing/);
    assert.match(markup, /ss-metric-rank" title="QB season positional rank">QB·5<\/b><small class="ss-metric-stat">/);
    assert.match(markup, /QB season positional rank">QB·21<\/b>/);
  }
  for (const markup of [row('fpts', 10, 10, [5, 5]), row('fpts', 10, null), row('fpts', 10, 20, [null, 4])]) {
    assert.doesNotMatch(markup, /ss-leading|ss-trailing/);
  }
});

test('both preview matchup ranks use FPFA, including matching missing/loading states', () => {
  const player = previewPlayer('rank-parity');
  const markup = renderPreview([player]);
  assert.match(markup, /ss-projection-matchup[^>]*>@ HOU \(7\)<\/small>/);
  assert.match(markup, /ss-rank-pill[^>]*>#7<small>/);
  assert.doesNotMatch(markup, /HOU \(30\)/);
  assert.match(markup, /ss-projection-matchup" style="color:#82d8bee0"/);
  assert.match(markup, /Positional defense rank · 1 = best defense \/ fewest fantasy points allowed/);
  player.matchupMetric = null;
  const unavailable = renderPreview([player]);
  assert.match(unavailable, /ss-projection-matchup">@ HOU<\/small>/);
  assert.match(unavailable, /ss-rank-pill[^>]*>—<\/span>/);
  assert.doesNotMatch(unavailable, /\(30\)/, 'Game Logs DRK is never substituted during matchup loading/failure');
});

test('Start/Sit passes the converted FPFA rank to preview and comparison while retaining SOS colors', () => {
  const context = harness();
  context.rostersMatchups = { status: 'ready', canOpen: () => true,
    preview: () => ({ team: 'HOU', actualRank: 1, actual: { rank: 1, avg: 10 }, sosRank: 1, expectedAvg: 20 }) };
  const player = context.buildRostersDecisionPlayer({ id: 'one', pos: 'RB' });
  assert.equal(player.matchupMetric.actualRank, 1);
  assert.equal(player.matchupColor, '#c456b1e0', 'best defense is tough');
  assert.equal(player.actualColor, '#c456b1e0');
  assert.equal(player.sosColor, '#82d8bee0', 'SOS 1 remains the easiest schedule');
  assert.match(context.window.RostersStartSit.projectionMatchup({ ...player, matchup: { opponent: '@ HOU' } }), /HOU \(1\)/);
  assert.match(context.window.RostersStartSit.playerHero(player, 0, 5), /ss-rank-pill[^>]*>#1<small>/);
});

test('preview and comparison names are native Game Logs buttons and preview activation forwards the player', () => {
  const context = harness();
  context.ResizeObserver = class { observe() {} disconnect() {} };
  const player = previewPlayer('one');
  let clicked, handler;
  const button = { dataset: { ssGamelogs: 'one' }, addEventListener: (event, callback) => { handler = callback; } };
  const mount = { classList: { add() {}, toggle() {} }, querySelector: () => null,
    querySelectorAll: selector => selector === '[data-ss-gamelogs]' ? [button] : [] };
  context.window.RostersStartSit.renderPreview({ mount, players: [player], week: 7, onGameLogs: (...args) => { clicked = args; } });
  assert.match(mount.innerHTML, /<h4><button type="button" class="ss-player-name-button" data-ss-gamelogs="one"/);
  assert.match(mount.innerHTML, /aria-label="Open Game Logs for Player one"/);
  handler();
  assert.equal(clicked[0], player);
  assert.equal(clicked[1], button);
  assert.match(context.window.RostersStartSit.playerHero(player, 0, 7), /<h2><button type="button" class="ss-player-name-button" data-ss-gamelogs="one"/);
});

test('trajectory and HTML labels preserve gaps, zero, negatives and every player status in both views', () => {
  const { timelineOption, scoringLabelsFor } = harness().window.RostersStartSit;
  const echarts = { graphic: { LinearGradient: class {} } };
  const players = [{ name: 'First', weekly: [{ week: 1, points: 0 }, { week: 2, points: -2 }, { week: 3, points: null, status: 'BYE' }, { week: 4, points: 8 }] },
    { name: 'Second', weekly: [{ week: 1, points: 4 }, { week: 2, points: 4 }, { week: 3, points: null, status: 'IR' }, { week: 4, points: null, status: 'OUT' }] }];
  for (const mode of ['weekly', 'cumulative']) {
    const option = timelineOption(players, mode, echarts), labels = scoringLabelsFor(players, mode);
    const label = (side, index) => labels.find(item => item.side === side && item.index === index);
    assert.ok(option.series.every(series => !series.label.show && series.showAllSymbol && series.connectNulls));
    assert.ok(option.series.every(series => series.data.every(point => Number.isFinite(point.value))));
    assert.equal(labels.length, 8, 'HTML overlay must retain every label for both players');
    assert.equal(label(0, 0).text, '0.0');
    assert.equal(label(0, 1).text, '-2.0');
    assert.equal(label(0, 2).text, 'BYE');
    assert.equal(label(0, 2).status, true);
    assert.equal(option.series[0].data[2].symbolSize, 0);
    assert.equal(option.series[0].data[2].value, mode === 'weekly' ? 3 : 2);
    assert.equal(label(0, 3).text, mode === 'weekly' ? '8.0' : '6.0');
    assert.equal(label(1, 2).text, 'IR');
    assert.equal(label(1, 3).text, 'OUT');
    assert.notEqual(label(0, 0).above, label(1, 0).above);
    assert.notEqual(label(0, 3).above, label(1, 3).above);
    const tooltip = option.tooltip.formatter([{ dataIndex: 2 }]);
    assert.match(tooltip, />BYE<\/b>/);
    assert.match(tooltip, />IR<\/b>/);
    assert.deepEqual(Array.from(players[0].weekly, row => row.points), [0, -2, null, 8]);
  }
});

test('trajectory and DOM label statuses extend across injuries without inventing games', () => {
  const { timelineOption, scoringLabelsFor } = harness().window.RostersStartSit;
  const echarts = { graphic: { LinearGradient: class {} } };
  const players = [{ name: 'First', weekly: [{ week: 1, points: null, status: 'PUP' }, { week: 2, points: 10 }, { week: 3, points: null, status: 'DNR' }] },
    { name: 'Second', weekly: [{ week: 1, points: null, status: 'IR' }, { week: 2, points: null, status: 'OUT' }, { week: 3, points: null, status: 'reserve' }] }];
  for (const mode of ['weekly', 'cumulative']) {
    const option = timelineOption(players, mode, echarts), labels = scoringLabelsFor(players, mode);
    assert.deepEqual(Array.from(option.series[0].data, point => point.value), [10, 10, 10]);
    assert.deepEqual(Array.from(labels.filter(item => item.side === 0), item => item.text), ['PUP', '10.0', 'DNR']);
    assert.equal(option.series[1].lineStyle.opacity, 0);
    assert.equal(option.series[1].areaStyle.opacity, 0);
    assert.ok(option.series[1].data.every(point => point.symbolSize === 0));
    assert.equal(labels.at(-1).text, 'RESERVE');
  }
  players[0].weekly[1] = { week: 2, points: null, status: 'DNP' };
  const statusOnly = timelineOption(players, 'weekly', echarts);
  assert.equal(statusOnly.yAxis.min, -1);
  assert.equal(statusOnly.yAxis.max, 1);
  assert.ok(statusOnly.series.every(series => series.lineStyle.opacity === 0));
  assert.equal(scoringLabelsFor(players, 'weekly')[1].text, 'DNP');
});

test('full-season trajectory reserves readable slots and every HTML score label', () => {
  const { sizeTrajectory, timelineOption, scoringLabelsFor } = harness().window.RostersStartSit;
  const players = ['First', 'Second'].map(name => ({ name, weekly: Array.from({ length: 18 }, (_, index) => ({ week: index + 1, points: 30 })) }));
  const node = { style: {} }, echarts = { graphic: { LinearGradient: class {} } };
  for (const mode of ['weekly', 'cumulative']) {
    sizeTrajectory(node, players, mode);
    const option = timelineOption(players, mode, echarts), labels = scoringLabelsFor(players, mode);
    assert.ok((Number.parseInt(node.style.minWidth) - option.grid.left - option.grid.right) / 17 >= 34);
    assert.equal(option.xAxis.axisLabel.interval, 0);
    assert.equal(labels.length, 36);
    assert.equal(labels[17].text, mode === 'weekly' ? '30.0' : '540.0');
    assert.equal(labels[17].above, true);
    assert.equal(labels[35].above, false);
  }
});

test('Start/Sit fits the complete sequence of recorded weeks and uses compact lowercase axis labels', () => {
  const { timelineOption, scoringLabelsFor } = harness().window.RostersStartSit;
  const echarts = { graphic: { LinearGradient: class {} } };
  for (const length of [11, 13, 18]) {
    const players = ['First', 'Second'].map(name => ({ name,
      weekly: Array.from({ length }, (_, index) => ({ week: index + 1, points: 30 })),
    }));
    const option = timelineOption(players, 'cumulative', echarts, 290);
    assert.deepEqual(Array.from(option.xAxis.data), Array.from({ length }, (_, index) => `w${index + 1}`));
    assert.equal(option.xAxis.axisLabel.fontSize, length === 18 ? 8 : 10);
    assert.equal(option.xAxis.axisLabel.margin, 12);
    assert.equal(option.grid.left, 26);
    assert.equal(option.series[0].data.at(-1).value, length * 30);
    assert.equal(scoringLabelsFor(players, 'cumulative').length, length * 2);
    if (length === 18) {
      const compact = option.xAxis.axisLabel.interval;
      assert.equal(compact(0), true);
      assert.equal(compact(17), true);
      assert.equal(compact(16), false);
      assert.equal(timelineOption(players, 'cumulative', echarts, 360).xAxis.axisLabel.interval, 0);
    } else {
      assert.equal(option.xAxis.axisLabel.interval, 0);
    }
  }
});

test('comparison loading shows real player identities, announces its state, and disposes its keyboard trap', () => {
  const { renderLoading, disposeComparison } = harness().window.RostersStartSit;
  const attributes = {}, listeners = {};
  let closed = false, focused = false;
  const button = { addEventListener: (event, handler) => { listeners[event] = handler; }, focus: () => { focused = true; } };
  const mount = { setAttribute: (key, value) => { attributes[key] = value; }, removeAttribute: key => { delete attributes[key]; },
    querySelector: () => button, addEventListener: (event, handler) => { listeners[event] = handler; },
    removeEventListener: event => { delete listeners[event]; } };
  renderLoading({ mount, players: [previewPlayer('one'), previewPlayer('two')], season: '2026', onClose: () => { closed = true; } });
  assert.equal(attributes['aria-busy'], 'true');
  assert.match(mount.innerHTML, /ss-loading-dashboard/);
  assert.match(mount.innerHTML, /role="status" aria-live="polite"/);
  assert.match(mount.innerHTML, />Player one<\/strong>/);
  assert.match(mount.innerHTML, />Player two<\/strong>/);
  listeners.keydown({ key: 'Tab', preventDefault() {} });
  assert.ok(focused);
  listeners.click();
  assert.ok(closed);
  disposeComparison();
  assert.equal(attributes['aria-busy'], undefined);
  assert.equal(listeners.keydown, undefined);
});

test('closing nested Game Logs restores source references only for its original league and closed context', () => {
  const state = { currentLeagueId: 'fixture', currentGameLogsSeason: '2025', playerWeeklyStats: { historical: true } };
  const context = vm.createContext({ state, rostersDecisionGameLogsContext: null });
  vm.runInContext(slice('function restoreRostersDecisionGameLogsSources(', 'function restoreRostersDecisionGameLogs()'), context);
  const original = { currentGameLogsSeason: '2026', playerWeeklyStats: { original: true }, currentNflWeek: 7 };
  const navigation = { leagueId: 'fixture', sources: original, closed: false };
  context.restoreRostersDecisionGameLogsSources(navigation);
  assert.equal(state.currentGameLogsSeason, '2025');
  navigation.closed = true;
  context.restoreRostersDecisionGameLogsSources(navigation);
  assert.equal(state.currentGameLogsSeason, '2026');
  assert.equal(state.playerWeeklyStats, original.playerWeeklyStats);
  assert.equal(state.currentNflWeek, 7);
  state.currentLeagueId = 'new-league'; state.currentGameLogsSeason = '2025';
  context.restoreRostersDecisionGameLogsSources(navigation);
  assert.equal(state.currentGameLogsSeason, '2025', 'late loads cannot reset a different league');
});

test('Start/Sit radar axes match the actual Game Logs Performance configuration for every position', () => {
  const { radarStatsForPosition } = harness().window.RostersStartSit;
  const logs = fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-gamelogs.js', import.meta.url), 'utf8');
  const config = vm.runInNewContext(`(${logs.match(/const ROSTERS_RADAR_STATS_CONFIG = (\{[\s\S]*?\n\});/)[1]})`);
  for (const pos of ['QB', 'RB', 'WR', 'TE']) {
    assert.deepEqual(Array.from(radarStatsForPosition(pos)), Array.from(config[pos].stats));
    const context = harness();
    const player = context.buildRostersDecisionPlayer({ id: 'one', pos, name: 'Fixture' });
    for (const key of config[pos].stats) assert.ok(key in player.metrics, `${pos}: missing radar metric ${key}`);
  }
  assert.equal(radarStatsForPosition('K').length, 0);
});

test('radar-only season metrics preserve literal source percentages, zero and unavailable data', () => {
  const context = harness();
  context.state.playerSeasonStats.one = { team_pass_pct: 0, rec_yms: 32.1, cpoe: -2.4 };
  const qb = context.buildRostersDecisionPlayer({ id: 'one', pos: 'QB' });
  assert.equal(qb.metrics.team_pass_pct.value, 0);
  assert.equal(qb.metrics.team_pass_pct.display, '0.0%');
  assert.equal(qb.metrics.cpoe.value, -2.4);
  assert.equal(qb.metrics.cmp_pct.value, null);
  const receiver = context.buildRostersDecisionPlayer({ id: 'one', pos: 'WR' });
  assert.equal(receiver.metrics.rec_yms.value, 32.1);
  assert.equal(receiver.metrics.rec_yms.display, '32.1%');
  delete context.state.playerSeasonStats.one.rec_yms;
  assert.equal(context.buildRostersDecisionPlayer({ id: 'one', pos: 'WR' }).metrics.rec_yms.display, '—');
});

test('Start/Sit radar reaches the outer ring and keeps the compact top-seven scale', () => {
  const { radarRadius } = harness().window.RostersStartSit;
  for (const maximum of [36, 48, 72, 24]) {
    assert.equal(radarRadius(1, maximum), 85);
    assert.equal(radarRadius(7, maximum), 73);
    assert.equal(radarRadius(maximum, maximum), 10);
    assert.equal(radarRadius(maximum + 20, maximum), 10);
    assert.ok(radarRadius(8, maximum) < 73);
    assert.equal(radarRadius(1, maximum, 100), 100);
    assert.equal(radarRadius(2, maximum, 100), 98);
    assert.equal(radarRadius(7, maximum, 100), 88);
    assert.equal(radarRadius(maximum, maximum, 100), 10);
    for (const value of [null, undefined, '', 'NA', 0, -1]) assert.equal(radarRadius(value, maximum, 100), null);
  }
});

test('radar overlays both players with stacked values, smaller ordinal ranks and actual shared metrics', () => {
  const { radarStatsForPosition, performanceRadar } = harness().window.RostersStartSit;
  const player = (pos, id) => ({ name: `Player ${id}`, id, pos, metrics: Object.fromEntries(radarStatsForPosition(pos).map(key => [key, { value: 0, display: '0.0', rank: 5 }])) });
  const rb = player('RB', 'first'), second = player('RB', 'second'), qb = player('QB', 'quarterback');
  const same = performanceRadar([rb, second]);
  assert.equal((same.match(/class="ss-radar-svg"/g) || []).length, 1);
  assert.equal((same.match(/class="ss-radar-area"/g) || []).length, 2);
  assert.equal((same.match(/class="ss-radar-axis-value ss-side-/g) || []).length, 26);
  assert.equal((same.match(/class="ss-radar-rank ss-side-/g) || []).length, 26);
  assert.match(same, /Player first · FPTS: 0.0 · RB rank 5/);
  assert.match(same, /5<tspan class="ss-radar-rank-suffix" dy="-2.5">th<\/tspan>/);
  const startSit = performanceRadar([rb, second], true);
  assert.match(startSit, /dominant-baseline="alphabetic"><title>[^<]+<\/title>5<tspan class="ss-radar-rank-suffix">th<\/tspan>/);
  assert.doesNotMatch(startSit, /ss-radar-rank-suffix" dy=/);
  assert.match(startSit, /viewBox="0 5 360 350"/);
  assert.equal((startSit.match(/class="ss-radar-axis-value ss-side-/g) || []).length, 22);
  assert.doesNotMatch(startSit, /CSTY%|\bCL\b/);
  assert.doesNotMatch(same, /NaN|undefined|ss-trailing/);
  const mixed = performanceRadar([rb, qb]);
  assert.equal((mixed.match(/class="ss-radar-svg"/g) || []).length, 1);
  assert.match(mixed, /Shared metrics; each player retains their positional ranks/);
  assert.match(mixed, /data-ss-radar-stat="csty_pct"/);
  assert.doesNotMatch(mixed, /EPA\/DB|EXPLSV%/, 'mixed positions must never pair unrelated axes');
  const mixedStartSit = performanceRadar([rb, qb], true);
  assert.match(mixedStartSit, /data-ss-radar-stat="imp"/);
  assert.doesNotMatch(mixedStartSit, /CSTY%|\bCL\b/);
  rb.metrics.fpts.rank = 1;
  const firstRank = performanceRadar([rb, second], true);
  assert.match(firstRank, /<polygon points="180\.00,66\.00[^"]+" class="ss-radar-grid-ring" data-outer="true"/);
  assert.match(firstRank, /RB rank 1<\/title><circle cx="180" cy="66"/);
  assert.notEqual(same.match(/id="ss-radar-0-line"[^]*?<\/linearGradient>/)[0], same.match(/id="ss-radar-1-line"[^]*?<\/linearGradient>/)[0]);
  second.metrics.ypc.rank = null;
  const partial = performanceRadar([rb, second]);
  assert.equal((partial.match(/class="ss-radar-area"/g) || []).length, 1, 'unranked axes must not invent a closed filled profile');
  assert.match(partial, /No qualified positional rank/);
  assert.match(partial, />—<\/small>/);
  second.metrics.fpts = { value: 2, rank: 9 };
  const dimmed = performanceRadar([rb, second]);
  assert.match(dimmed, /ss-radar-rank ss-side-1 ss-trailing/);
  assert.match(dimmed, /ss-radar-axis-value ss-side-0 ss-trailing/);
});

test('DM consistency HUD preserves recorded zero, unavailable values and all seven Game Logs progress bands', () => {
  const { hudDial } = harness().window.RostersStartSit;
  const player = { name: 'Fixture', pos: 'RB', metrics: { csty_pct: { value: 0 }, ceiling: { value: 28, display: '28.0', rank: null } } };
  assert.match(hudDial(player), /data-dial-tone="pink" data-has-progress="false"/);
  assert.match(hudDial(player), /<div class="progress-value">0%<\/div>/);
  player.metrics.csty_pct.value = null;
  assert.match(hudDial(player), /data-dial-tone="neutral"/);
  assert.match(hudDial(player), /<div class="progress-value">—<\/div>/);
  for (const [value, tone] of [[0, 'pink'], [15, 'magenta'], [30, 'violet'], [50, 'blue'], [60, 'cyan'], [75, 'teal'], [100, 'green']]) {
    player.metrics.csty_pct.value = value;
    assert.match(hudDial(player), new RegExp(`data-dial-tone="${tone}"`));
  }
});

test('DM retains one consistency dial and a separate plain ceiling row', () => {
  const { ring } = harness().window.RostersStartSit;
  const player = { ...previewPlayer('ceiling'), metrics: { csty_pct: { value: 50 }, ceiling: { value: 28, display: '28.0', rank: 1 } } };
  const markup = ring(player, 0);
  assert.equal((markup.match(/class="progress-circle ss-hud-dial"/g) || []).length, 1);
  assert.match(markup, /<div class="progress-value">50%<\/div>\s*<div class="progress-label">Consistency<br \/>Rate<\/div>/);
  assert.equal((markup.match(/class="ss-ceiling"/g) || []).length, 1);
  assert.match(markup, /<div class="ss-ceiling"><span>CEILING<\/span><b>28.0<\/b><small>PPR pts<\/small>/);
  assert.doesNotMatch(markup, /ss-v2-gauges|ss-consistency-ring/);
  assert.doesNotMatch(markup, /CEILING · PPR|Arc = positional ceiling rank|ceiling: 28.0/);
  player.metrics.ceiling = { value: 0, display: '0.0', rank: null };
  assert.match(ring(player, 0), /<span>CEILING<\/span><b>0.0<\/b>/);
  player.metrics.ceiling = { value: null, display: '—', rank: null };
  assert.match(ring(player, 0), /<span>CEILING<\/span><b>—<\/b>/);
});

test('DM carries the edited cyan/blue/violet player B spectrum into scoring and radar', () => {
  const { timelineOption, performanceRadar, radarStatsForPosition } = harness().window.RostersStartSit;
  const echarts = { graphic: { LinearGradient: class { constructor(...args) { this.args = args; } } } };
  const players = [0, 1].map(side => ({ id: String(side), name: `Player ${side}`, pos: 'TE',
    metrics: Object.fromEntries(radarStatsForPosition('TE').map(key => [key, { value: 10, display: '10', rank: side + 1 }])),
    weekly: [{ week: 1, points: 10 }, { week: 2, points: 30 }] }));
  const option = timelineOption(players, 'weekly', echarts);
  const radar = performanceRadar(players);
  const referenceSpectra = [['#1264FF', '#118FFF', '#00C6EF', '#19EDDD'], ['rgba(115,244,255,.72)', 'rgba(91,127,255,.72)', 'rgba(219,109,255,.82)']];
  for (const [side, expected] of referenceSpectra.entries()) {
    assert.deepEqual(Array.from(option.series[side].lineStyle.color.args[4], stop => stop.color), expected);
    const area = option.series[side].areaStyle.color.args[4];
    assert.equal(area.length, expected.length);
    if (side === 1) assert.deepEqual(Array.from(option.series[side].lineStyle.color.args[4], stop => stop.offset), [0, .52, 1]);
    expected.forEach(color => assert.ok(radar.includes(`stop-color="${color}"`), `Missing radar stop ${color}`));

  }
});

test('DM rounds scoring lines while HTML labels retain player identity and literal statuses', () => {
  const { timelineOption, scoringLabelsFor, scoringLabelMarkup } = harness().window.RostersStartSit;
  const echarts = { graphic: { LinearGradient: class {} } };
  const players = [{ name: 'First', weekly: [{ week: 1, points: -2 }, { week: 2, points: null, status: '<out>' }] },
    { name: 'Second', weekly: [{ week: 1, points: 4 }, { week: 2, points: 0 }] }];
  const option = timelineOption(players, 'weekly', echarts), markup = scoringLabelMarkup(scoringLabelsFor(players, 'weekly'));
  assert.ok(option.series.every(series => series.smooth > 0 && series.smoothMonotone === 'x' && !series.label.show));
  assert.notEqual(option.series[0].symbol, option.series[1].symbol);
  assert.match(markup, /ss-score-label ss-side-0/);
  assert.match(markup, /ss-score-label ss-side-1/);
  assert.match(markup, /is-status/);
  assert.match(markup, /&lt;OUT&gt;/);
  assert.doesNotMatch(markup, /<OUT>/);
});

test('rank-sized bars keep units independent, display zero/negative source values and leave unqualified stats empty', () => {
  const { metricRow } = harness().window.RostersStartSit;
  const players = [{ pos: 'QB', labels: { fpts: 'FPTS' }, metrics: { fpts: { value: -12, display: '-12.0', rank: 8 } } },
    { pos: 'QB', labels: {}, metrics: { fpts: { value: 24, display: '24.0', rank: 3 } } }];
  const ratios = markup => [...markup.matchAll(/--ss-bar-ratio:([0-9.]+)/g)].map(match => Number(match[1]));
  let markup = metricRow('fpts', players), lengths = ratios(markup);
  assert.ok(lengths[0] < lengths[1]);
  assert.match(markup, /ss-metric-stat">-12.0<\/small>/);
  players[0].metrics.fpts.value = 9999;
  assert.deepEqual(ratios(metricRow('fpts', players)), lengths, 'raw magnitude cannot change rank bar length');
  players[0].metrics.fpts = { value: 0, display: '0.0', rank: 1 };
  players[1].metrics.fpts = { value: 12, display: '12.0', rank: null };
  markup = metricRow('fpts', players);
  assert.equal(ratios(markup)[0], 1);
  assert.equal(ratios(markup)[1], 0);
  assert.equal((markup.match(/class="ss-stat-fill"/g) || []).length, 1);
  assert.match(markup, />QB·1<\/b><small class="ss-metric-stat">0.0<\/small>/);
  assert.match(markup, />QB·—<\/b><small class="ss-metric-stat">12.0<\/small>/);
  players[0].metrics.fpts = { value: null, display: '—', rank: null };
  markup = metricRow('fpts', players);
  assert.doesNotMatch(markup, /ss-stat-fill|ss-leading|ss-trailing/);
  players.forEach((player, side) => player.metrics.fpts = { value: 1, display: '1', rank: 80 + side });
  lengths = ratios(metricRow('fpts', players));
  assert.ok(lengths[0] > lengths[1] && lengths[1] > 0, 'valid ranks outside the reference range remain ordered');
});

test('each stat row reserves the same endpoint-label clearance for both players and updates after font changes', () => {
  const { measureStatPlots } = harness().window.RostersStartSit;
  let widths = [28.2, 46.5], writes = 0, clearance = '';
  const row = { querySelectorAll: () => widths.map(width => ({ getBoundingClientRect: () => ({ width }) })),
    style: { getPropertyValue: () => clearance, setProperty: (key, value) => { assert.equal(key, '--ss-value-space'); clearance = value; writes++; } } };
  const mount = { querySelectorAll: () => [row] };
  measureStatPlots(mount);
  assert.equal(clearance, '55px');
  measureStatPlots(mount);
  assert.equal(writes, 1, 'same measurements must not keep triggering ResizeObserver writes');
  widths = [38.1, 31.5];
  measureStatPlots(mount);
  assert.equal(clearance, '47px');
});

test('contextual stat bars use supplied positional ranks without inventing raw-value comparisons', () => {
  const { metricRow } = harness().window.RostersStartSit;
  const players = [{ pos: 'QB', labels: { ttt: 'TTT' }, metrics: { ttt: { value: 2.4, display: '2.40', rank: 5 } } },
    { pos: 'QB', labels: {}, metrics: { ttt: { value: 2.9, display: '2.90', rank: 21 } } }];
  const markup = metricRow('ttt', players);
  assert.match(markup, />QB·5<\/b>/);
  assert.match(markup, />QB·21<\/b>/);
  assert.match(markup, /ss-stat-plot ss-side-1 ss-trailing/);
  assert.doesNotMatch(markup, /←|→/);
});


test('comparison has only DM and no theme controls or alternate palette paths', () => {
  const context = harness(), { comparisonMarkup, timelineOption } = context.window.RostersStartSit;
  const players = ['one','two'].map(id => context.buildRostersDecisionPlayer({ id, pos:'RB', name:`Player ${id}` }));
  const markup = comparisonMarkup({players,season:'2026',week:10},players,'weekly');
  assert.match(markup, /data-ss-theme="dm"/);
  assert.doesNotMatch(markup, /data-ss-theme-button|ss-theme-toggle/);
  assert.doesNotMatch(presentation, /toggleComparisonTheme|comparisonTheme|THEMES/);
  const echarts = { graphic: { LinearGradient: class {} } };
  const option = timelineOption(players, 'weekly', echarts);
  assert.equal(option.series[0].itemStyle.color, '#18ebdc');
  assert.equal(option.series[1].itemStyle.color, '#b69aff');
});

test('radar axis values match actual Game Logs precision for every positional metric', () => {
  const { radarValue, radarStatsForPosition } = harness().window.RostersStartSit;
  const logs = fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-gamelogs.js', import.meta.url), 'utf8');
  const format = vm.runInNewContext(logs.slice(logs.indexOf('function formatRostersRadarStatValue('), logs.indexOf('const rostersPlayerRadarLabelPlugin')) + ';formatRostersRadarStatValue');
  const stats = new Set(['QB', 'RB', 'WR', 'TE'].flatMap(pos => Array.from(radarStatsForPosition(pos))));
  for (const key of stats) {
    for (const value of [0, 1.23456, -2.3456, 1087]) assert.equal(radarValue(key, value), format(key, value), `${key}: ${value}`);
    for (const value of [null, undefined, '', 'N/A']) assert.equal(radarValue(key, value), '—');
  }
});


test('comparison names add first initials and retain compound surnames and suffixes', () => {
  const { comparisonName } = harness().window.RostersStartSit;
  for (const [name, expected] of [['Jahmyr Gibbs','J. Gibbs'],['Bijan Robinson','B. Robinson'],
    ['Brian Robinson Jr.','B. Robinson Jr.'],['Kenneth Walker III','K. Walker III'],
    ['Amon-Ra St. Brown','A. St. Brown'],["De'Von Achane",'D. Achane'],['','']]) {
    assert.equal(comparisonName({name}), expected);
  }
});

// Difference chips describe the advantage in stat units, while the bars and
// section tally continue to compare published positional ranks independently.
test('stat difference chips show signed raw advantages and use % for percentage gaps', () => {
  const { metricRow } = harness().window.RostersStartSit;
  const players = [{ pos: 'QB', labels: {}, metrics: {} }, { pos: 'QB', labels: {}, metrics: {} }];
  const row = (key, a, b, displayA = String(a), displayB = String(b)) => {
    players[0].metrics[key] = { value: a, display: displayA, rank: 2 };
    players[1].metrics[key] = { value: b, display: displayB, rank: 8 };
    return metricRow(key, players);
  };
  assert.match(row('fpts', 10, 15), /ss-difference ss-side-1[^>]*><span class="ss-delta-amount">\+5<\/span><span class="ss-delta-arrow"[^>]*>→/, 'point toward the higher stat even when the other positional rank is better');
  assert.match(row('fpts', -2, -5), /ss-difference ss-side-0[^>]*><span class="ss-delta-arrow"[^>]*>←<\/span><span class="ss-delta-amount">\+3/);
  assert.match(row('pass_int', 4, 1), /ss-difference ss-side-1[^>]*><span class="ss-delta-amount">-3<\/span><span class="ss-delta-arrow"[^>]*>→/);
  const percent = row('cmp_pct', 70.5, 65.2, '70.5%', '65.2%');
  assert.match(percent, /ss-delta-amount">\+5.3%<\/span>/);
  assert.doesNotMatch(percent, / pp/);
  assert.match(row('fpts', 0, 0), />EVEN<\/span>/);
  assert.doesNotMatch(row('fpts', 1, null, '1', '—'), /←|→/);
});

test('section header removes side letters and reports the net qualified rank-win lead', () => {
  const { statSections } = harness().window.RostersStartSit;
  const section = { id: 'fixture', label: 'SECTION', stats: ['a','b','c','d','e','f','g','tie','unqualified','missing'] };
  const players = [0, 1].map(side => ({ name: side === 0 ? 'First Alpha' : 'Second Beta', pos: 'RB', sections: [section], labels: {}, metrics: {} }));
  section.stats.forEach((key, index) => players.forEach((player, side) => {
    player.metrics[key] = { value: 10, display: '10', rank: index < 5 ? side + 1 : index < 7 ? 2 - side : 3 };
  }));
  players[0].metrics.unqualified.rank = null;
  players[0].metrics.missing.value = null;
  let markup = statSections(players);
  assert.match(markup, /<span class="ss-side-0">F. Alpha<\/span>/);
  assert.match(markup, /<span class="ss-side-1">S. Beta<\/span>/);
  assert.doesNotMatch(markup, /<small>[AB]<\/small>/);
  assert.match(markup, /F. Alpha leads by 3 ranked stats \(5 to 2\)/);
  assert.match(markup, /ss-section-margin ss-side-0[^>]*><span class="ss-delta-arrow"[^>]*>←<\/span><span class="ss-delta-amount">\+3/);
  markup = statSections([...players].reverse());
  assert.match(markup, /ss-section-margin ss-side-1[^>]*><span class="ss-delta-amount">\+3<\/span><span class="ss-delta-arrow"[^>]*>→/);
  players.forEach(player => section.stats.forEach(key => player.metrics[key].rank = 3));
  assert.match(statSections(players), /ss-section-margin[^>]*><span class="ss-delta-amount">EVEN<\/span>/);
  players.forEach(player => section.stats.forEach(key => player.metrics[key].rank = null));
  assert.match(statSections(players), /No comparable positional ranks[^>]*><span class="ss-delta-amount">—<\/span>/);
});
