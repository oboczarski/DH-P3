import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../DH_P2.53/scripts/app.js', import.meta.url), 'utf8');
const slice = (from, to) => app.slice(app.indexOf(from), app.indexOf(to, app.indexOf(from)));

// Run the actual scoring/rank pipeline and card renderer. Cached card ranks
// deliberately disagree with the modal pool to catch accidental PPR fallbacks.
function harness() {
  const state = {
    players: { one: { position: 'RB' }, zero: { position: 'RB' }, negative: { position: 'RB' }, unqualified: { position: 'RB' } },
    leagues: [{ league_id: 'ppr', scoring_settings: { rec: 1 } }, { league_id: 'standard', scoring_settings: { rec: 0 } }],
    currentLeagueId: 'ppr', currentGameLogsSeason: '2026', currentRosterView: 'positional',
    isStartSitMode: false, isCompareMode: false, startSitSelections: [], tradeBlock: {},
    playerSeasonStats: {
      one: { games_played: 3, rush_att: 15 }, zero: { games_played: 3, rush_att: 15 },
      negative: { games_played: 3, rush_att: 15 }, unqualified: { games_played: 1, rush_att: 1 },
    },
    rosters2026GameLogs: { latestRecordedWeek: 3, rankQualifierWeeks: 3 },
    weeklyStats: { 1: { one: { rec: 2, snp: 30 } }, 2: { one: { rec: 2, snp: 30 } }, 3: { one: { rec: 2, snp: 30 } } },
    matchupDataLoaded: true, leagueMatchupStats: {
      1: { one: 20, zero: 0, negative: -3, unqualified: 10 },
      2: { one: -2, zero: 0, negative: 0 }, 3: { one: 0, zero: 0, negative: 0 },
    },
  };
  const context = vm.createContext({ state, pageType: 'rosters', window: {},
    document: { createElement: () => ({ dataset: {}, classList: { add() {} }, querySelector: () => null }) },
    calculateFantasyPoints: (stats, settings) => (stats.rec || 0) * (settings.rec || 0),
    getCombinedWeeklyStats: () => state.weeklyStats,
    getRosterCardRanks: () => ({ posRank: 99, ppg: '999.9', ppgPosRank: 99 }),
    getPosRankColor: () => '#fff', getSleeperInjuryDesignation: () => null,
    getUpcomingProjectionDesignation: () => null, buildRosterAvailabilityBadge: () => '',
  });
  vm.runInContext(slice('function getDefaultPlayerRanks()', 'function getStatsPagePlayerRanks(')
    + slice('function isRostersGameLogsRankQualified(', 'function computeSeasonRankings(')
    + slice('function getConditionalColorByRank(', 'function getSznStatRankColor(')
    + slice('function createPlayerRow(', 'function createPickRow('), context);
  return context;
}

function card(context, id = 'one', pos = 'RB') {
  return context.createPlayerRow({ id, pos, name: 'Fixture Player', team: 'FA',
    _cachedRanks: { posRank: 99, ppg: '999.9', ppgPosRank: 99 }, adp: 123.4 }, 'Fixture').innerHTML;
}

function expectPpg(markup, display, color) {
  assert.match(markup, new RegExp(`PPG:<span class="value player-ppg" style="color: ${color}">${display.replace('.', '\\.')}<\\/span>`));
  assert.doesNotMatch(markup, /ADP:|player-adp|999\.9/);
}

test('all card modes share Game Logs league PPG and its qualified rank color, including zero/negative games', () => {
  const context = harness();
  for (const [view, preview, startSit] of [
    ['positional', false, false], ['depth', false, false], ['condensed', false, false],
    ['positional', true, false], ['condensed', true, false], ['positional', false, true],
  ]) {
    Object.assign(context.state, { currentRosterView: view, isCompareMode: preview, isStartSitMode: startSit });
    expectPpg(card(context), '6.0', '#51CBA5');
    assert.equal(context.getRostersGameLogsPlayerRanks('one').ppg, '6.0');
    assert.equal(context.calculatePlayerStatsAndRanks('one').ppg, '18.0', 'legacy positive-only game count must not leak into PPG');
    expectPpg(card(context, 'zero'), '0.0', '#51CBA5');
    expectPpg(card(context, 'negative'), '-1.0', '#51CBA5');
    expectPpg(card(context, 'unqualified'), '10.0', 'inherit');
  }
});

test('switching leagues recalculates PPG from the selected league, including unrostered CSV scoring', () => {
  const context = harness();
  context.state.matchupDataLoaded = false;
  expectPpg(card(context), '2.0', '#51CBA5');
  context.state.currentLeagueId = 'standard';
  expectPpg(card(context), '0.0', '#51CBA5');
  assert.equal(context.state.calculatedRankCache.leagueId, 'standard');
  context.state.leagues[1].scoring_settings.rec = 0.5;
  expectPpg(card(context), '1.0', '#51CBA5');
});

test('card colors use the Game Logs WR thresholds and leave unqualified values neutral', () => {
  const context = harness();
  for (const [position, rank, expected] of [
    ['WR', 12, '#51CBA5'], ['WR', 13, '#34aabf'], ['WR', 25, '#4798fc'],
    ['RB', 8, '#51CBA5'], ['RB', 9, '#34aabf'], ['TE', 33, '#FF6FE1'], ['QB', 61, '#767693'],
  ]) {
    // Inject only the cached modal result; exercise the production card renderer
    // and color helper rather than the separate workbook/card rank pool.
    context.calculatePlayerStatsAndRanks('one');
    context.state.calculatedRankCache.modalPlayers.one = { ppg: '12.3', ppgPosRank: rank };
    expectPpg(card(context, 'one', position), '12.3', expected);
  }
});

test('2026 league selection prepares current-league scores after activation and before cards render', async () => {
  const calls = [];
  const context = harness();
  context.state.leagues[0] = { league_id: 'ppr', season: '2026', previous_league_id: 'old-league', roster_positions: ['QB'] };
  Object.assign(context, {
    leagueSelect: { value: 'ppr' }, rosterView: { classList: { add() {}, remove() {} } }, rosterGrid: {},
    API_BASE: 'https://fixture.local', console,
    hideLegend() {}, rememberViewedRostersLeague() {}, handleClearCompare() {}, setLoading() {},
    fetchWithCache: async () => [], hydrateDraftOrderBySeason: async () => {}, fetchPreviousSeasonData: async () => null,
    processRosterData: () => [], updateCompareButtonState() {},
    setGameLogsSelectedSeason: season => { context.state.currentGameLogsSeason = season; calls.push(`season:${season}`); },
    ensureSleeperLiveStats: async () => { calls.push('nfl-week'); context.state.currentNflWeek = 7; },
    fetchLeagueMatchupData: async (id, week) => { calls.push(`scores:${id}:${week}`); context.state.matchupDataLoaded = true; },
    renderAllTeamData: () => { assert.equal(context.state.matchupDataLoaded, true); calls.push('render'); },
  });
  context.window.activateRosters2026GameLogs = async () => {
    calls.push('activate'); context.state.matchupDataLoaded = false;
  };
  context.state.currentGameLogsSeason = '2025';
  vm.runInContext(slice('async function handleLeagueSelect()', '// --- Compare & Trade Logic ---'), context);
  await context.handleLeagueSelect();
  assert.deepEqual(calls, ['season:2026', 'activate', 'nfl-week', 'scores:ppr:7', 'render']);
});
