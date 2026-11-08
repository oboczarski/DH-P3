import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { build2026TeamStats, build2026TeamRanks } from '../DH_P2.53/scripts/rosters-team-stats.js';

const read = path => fs.readFileSync(new URL(`../DH_P2.53/${path}`, import.meta.url), 'utf8');
const slice = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const profile = read('scripts/rosters-gamelogs-profile.js');
const app = read('scripts/app.js');
const context = vm.createContext({ pageType: 'rosters' });
vm.runInContext(slice(app, 'function getOpponentDefenseRank(', 'let tableCoreLoaderPromise')
  + slice(profile, 'const profileTeam =', '  function renderUpcomingMatchup('), context);
const matchup = (...args) => JSON.parse(JSON.stringify(context.upcomingProfileMatchup(...args)));
const snapshot = () => ({ latestRecordedWeek: 8,
  scheduleByTeam: { BUF: { 9: 'vs. WSH', 10: '@ JAC', 11: 'BYE', 18: '@ NYJ' } },
  defenseByTeam: { WAS: { QBRK: '32', RBRK: '1', WRRK: '20', TERK: '9' }, JAX: { QBRK: '10' } },
});

test('profile upcoming opponent uses schedule aliases, base position ranks and display-only rank reversal', () => {
  const source = snapshot(), before = JSON.stringify(source);
  for (const [pos, rank] of [['QB', 1], ['RB', 32], ['WR', 13], ['TE', 24]]) {
    assert.deepEqual(matchup(source, 'BUF', pos, 9), { week: 9, opponent: 'vs WAS', rank });
  }
  assert.deepEqual(matchup(source, 'BUF', 'QB', 10), { week: 10, opponent: '@ JAX', rank: 23 });
  assert.equal(JSON.stringify(source), before);
});

test('profile honors the upcoming NFL week, falls back to recorded cutoff, and keeps BYEs in place', () => {
  for (const week of [null, undefined, 0, 8, 19, 9.5]) {
    assert.equal(matchup(snapshot(), 'BUF', 'QB', week).week, 9);
  }
  assert.deepEqual(matchup(snapshot(), 'BUF', 'QB', 11), { week: 11, opponent: 'BYE', rank: null });
  const source = snapshot();
  source.projectionWeeks = { 10: true, 11: true, 12: true };
  assert.equal(matchup(source, 'BUF', 'QB', null).week, 9);
  source.latestRecordedWeek = 18;
  assert.deepEqual(matchup(source, 'BUF', 'QB', 18), { complete: true });
  assert.equal(matchup(null, 'BUF', 'QB', 9), null);
});

test('profile missing schedule and invalid defensive ranks stay unavailable', () => {
  assert.deepEqual(matchup(snapshot(), 'FA', 'QB', 9), { week: 9, opponent: '—', rank: null });
  for (const value of ['', null, undefined, 'NA', 0, -1, 33, 1.5]) {
    const source = snapshot();
    source.defenseByTeam.WAS.QBRK = value;
    assert.equal(matchup(source, 'BUF', 'QB', 9).rank, null);
  }
});

test('TM_STAT W-L preserves win/loss/tie records separately from numeric stat ranks', () => {
  const row = { TM: 'BUF', 'Pa%': '51%', 'Ru%': '49%', 'paYds/G': '256.1', 'ruYds/G': '148.4' };
  for (const [record, expected] of [['6-1', '6-1'], ['0-0', '0-0'], ['3 - 4 - 1', '3-4-1'], ['', null], ['NA', null], ['6', null]]) {
    const teams = build2026TeamStats([{ ...row, 'W-L': record }]);
    assert.equal(teams.BUF.record, expected);
    assert.equal(teams.BUF['paYds/G'], 256.1);
    assert.equal('record' in build2026TeamRanks(teams).BUF, false);
  }
  assert.equal('record' in build2026TeamStats([row]).BUF, false);
  assert.equal(build2026TeamStats([{ ...row, SZN: '2025', 'W-L': '6-1' }]).BUF, undefined);
});

for (const path of ['matchups/app.js', 'rosters/matchup-breakdown/modal.js']) {
  test(`${path}: Players Faced displays and sorts the compact player Site`, () => {
    const source = read(path);
    const data = { selectResults: () => [
      { week: 9, player: 'Home Player', playerTeam: 'BUF', def: 'WAS', pos: 'QB', vs: 'vs WAS', playerVenue: 'home', defenseVenue: 'away', cents: 1200, pts: 12 },
      { week: 8, player: 'Away Player', playerTeam: 'CIN', def: 'WAS', pos: 'QB', vs: '@ WAS', playerVenue: 'away', defenseVenue: 'home', cents: 1400, pts: 14 },
    ], TEAM_NAMES: { BUF: 'Buffalo Bills', CIN: 'Cincinnati Bengals' } };
    const table = vm.createContext({ Data: data, state: { pos: 'QB', team: 'WAS',
      playerSort: { key: 'vs', direction: 'asc' } }, model: {},
      esc: value => value, logo: () => '', fmt: (value, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : '—',
      weekLabel: () => 'Weeks 8–9', venueLabel: () => 'All games' });
    vm.runInContext(slice(source, '  function selectedPlayers()', '  function renderPlayers()'), table);
    const rows = table.selectedPlayers();
    assert.deepEqual(Array.from(rows, row => row.player), ['Away Player', 'Home Player']);
    const html = table.playersTable(rows);
    assert.match(html, />TM(?:<|\$)/);
    assert.match(html, />Site</);
    assert.match(html, /class="playerOpponent">\(BUF\)</);
    assert.match(html, /class="playerOpponent">\(@ WAS\)</);
    assert.equal(table.playerLocation({ playerVenue: 'home', playerTeam: null }), '—');
    assert.equal(table.playerLocation({ playerVenue: 'away', playerTeam: 'CIN', def: null }), '—');
    assert.equal(table.playerLocation({ playerVenue: 'away', playerTeam: null, def: 'BAL' }), '(@ BAL)');
    assert.equal(table.playerLocation({ playerVenue: null, playerTeam: 'BUF' }), '—');
    assert.doesNotMatch(html, />Player VS<|>Offense<|>vs WAS<|>@ WAS</);
    table.state.playerSort.direction = 'desc';
    assert.equal(table.selectedPlayers()[0].player, 'Home Player');
  });
}
