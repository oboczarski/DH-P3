import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(`../DH_P2.53/${path}`, import.meta.url), 'utf8');
const app = read('scripts/app.js');
const presentation = read('scripts/rosters-gamelogs.js');
const extract = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

function harness(state, currentWeek = 9) {
  const context = vm.createContext({ state, getCurrentNflWeekNumber: () => currentWeek,
    rostersTeamPositions: ['QB', 'RB', 'WR', 'TE'],
    rostersTeamNames: { BAL: 'Baltimore', ARI: 'Arizona', NYJ: 'New York Jets', JAX: 'Jacksonville', WAS: 'Washington' },
    rostersTeamKey: value => ({ JAC: 'JAX', WSH: 'WAS' })[value] || value,
  });
  vm.runInContext(extract(app, 'function getRostersPlayerMatchupWeeks(', 'function getRostersMatchupController(')
    + extract(presentation, '  function defaultMatchupSelection(', '  const openDefaultMatchup'), context);
  return context;
}

test('matchup weeks preserve the selected season, weekly opponents, BYEs and missing schedule entries', () => {
  const state = { currentGameLogsSeason: '2026', players: { p: { team: 'BUF' } },
    rosters2026GameLogs: { seasonStats: { p: { team: 'WSH' } },
      weeklyStats: { 1: { p: { opponent: '@ JAC', proj: 0 } }, 2: { p: { opponent: 'BYE', proj: 'OUT' } } },
      scheduleByTeam: { WAS: { 1: 'vs BAL', 3: '@ ARI', 9: 'vs NYJ' } } },
    rosters2025GameLogs: { weeklyStats: { 1: { p: { opponent: 'vs BAL' } } } },
  };
  const original = structuredClone(state), api = harness(state);
  const weeks = api.getRostersPlayerMatchupWeeks({ id: 'p', season: '2026' });
  assert.equal(weeks.length, 18);
  assert.deepEqual(Array.from(weeks.slice(0, 4), entry => entry.matchup.opponent), ['@ JAC', 'BYE', '@ ARI', '']);
  assert.equal(api.getRostersPlayerMatchupWeeks({ id: 'p', season: '2025' })[0].matchup.opponent, 'vs BAL');
  assert.equal(api.getRostersPlayerMatchupWeeks({ id: 'p', season: '2025' })[8].matchup.opponent, '');
  assert.deepEqual(state, original, 'menu reads never modify statistics, projection zeros or status cells');
});

test('Start/Sit week choices follow its league after historical Game Logs were closed', () => {
  const state = { currentGameLogsSeason: '2025', currentLeagueId: 'current',
    leagues: [{ league_id: 'current', season: '2026' }],
    rosters2026GameLogs: { weeklyStats: { 9: { p: { opponent: 'vs NYJ' } } } },
    rosters2025GameLogs: { weeklyStats: { 9: { p: { opponent: '@ BAL' } } } },
  };
  const api = harness(state);
  assert.equal(api.getRostersPlayerMatchupWeeks({ id: 'p' })[8].matchup.opponent, 'vs NYJ');
  assert.equal(api.getRostersPlayerMatchupWeeks({ id: 'p', season: '2025' })[8].matchup.opponent, '@ BAL');
  assert.equal(state.currentGameLogsSeason, '2025', 'week choices do not switch Game Logs season');
});

test('header and dock select the upcoming game using the same recorded-week fallback, skipping unavailable games', () => {
  const state = { currentGameLogsSeason: '2026', currentGameLogsPlayer: { id: 'p', name: 'Player', position: 'QB', team: 'BUF' },
    rosters2026GameLogs: { latestRecordedWeek: 8, scheduleByTeam: { BUF: { 8: 'vs BAL', 9: '@ ARI', 10: 'BYE', 11: 'vs NYJ' } } },
  };
  for (const currentWeek of [0, 7, 9]) {
    const selection = harness(state, currentWeek).defaultMatchupSelection();
    assert.equal(selection.week, 9);
    assert.equal(selection.matchup.opponent, '@ ARI');
    assert.equal(selection.basePos, 'QB');
  }
  assert.equal(harness(state, 10).defaultMatchupSelection().week, 11);
  assert.equal(harness(state, 18).defaultMatchupSelection().week, 11);
  state.rosters2026GameLogs.scheduleByTeam.BUF = { 9: 'BYE', 10: 'NA' };
  assert.equal(harness(state).defaultMatchupSelection(), null);
});

test('Players Faced follows the selected defense and position in the requested order', () => {
  const source = read('rosters/matchup-breakdown/modal.js');
  const nodes = new Map();
  const context = vm.createContext({ model: {}, state: { pos: 'QB', team: 'NYJ', query: '', hideZero: true },
    $: id => { if (!nodes.has(id)) nodes.set(id, {}); return nodes.get(id); },
    selectedPlayers: () => [], playersTable: () => '', fmt: value => value.toFixed(1),
    Data: { TEAM_NAMES: { NYJ: 'New York Jets', ARI: 'Arizona Cardinals' } },
    LABELS: { QB: 'quarterbacks', TE: 'tight ends' }, venueLabel: () => 'All games',
  });
  vm.runInContext(extract(source, '  function renderPlayers()', '  function choose('), context);
  context.renderPlayers();
  assert.equal(nodes.get('playerScope').textContent, 'QB · vs NYJ');
  context.state.pos = 'TE'; context.state.team = 'ARI';
  context.renderPlayers();
  assert.equal(nodes.get('playerScope').textContent, 'TE · vs ARI');
});
