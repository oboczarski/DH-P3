import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { SOS_TEAMS, rankPositionSchedules, historicalSosSource } from '../DH_P2.53/scripts/datahub-gamelogs-sos.js';
import { build2026SourceData } from '../DH_P2.53/scripts/datahub-2026-data.js';
import { build2026TeamStats, build2026TeamRanks } from '../DH_P2.53/scripts/datahub-team-stats.js';

const read = file => fs.readFileSync(new URL(`../DH_P2.53/scripts/${file}`, import.meta.url), 'utf8');
const profile = read('datahub-gamelogs-profile.js');
const source = read('DataHub.js');
const slice = (text, start, end) => text.slice(text.indexOf(start), text.indexOf(end, text.indexOf(start)));
const context = vm.createContext({ getOpponentDefenseRank: value => {
  const rank = Number(value);
  return Number.isInteger(rank) && rank >= 1 && rank <= 32 ? 33 - rank : null;
} });
vm.runInContext(slice(profile, 'const profileTeam =', '  function renderUpcomingMatchup('), context);
const upcoming = (...args) => JSON.parse(JSON.stringify(context.upcomingProfileMatchup(...args)));

function fixture() {
  const data = build2026SourceData({ seasonRows: [],
    scheduleRows: SOS_TEAMS.map((TM, i) => ({ TM, ...Object.fromEntries(Array.from({ length: 18 }, (_, w) => [w + 1, w === 6 ? 'BYE' : `@ ${SOS_TEAMS[(i + 1) % 32]}`])) })),
    defenseRows: SOS_TEAMS.map((TM, i) => ({ TM, QBRK: String(i + 1), RBRK: String(32 - i), WRRK: '10', TERK: String(i + 1) })),
  });
  return { ...data, latestRecordedWeek: 8 };
}

test('DataHub profile reuses complete raw DRK/schedule maps and ranks SOS by base position without mutating them', () => {
  const data = fixture(), before = JSON.stringify(data);
  assert.equal(rankPositionSchedules(data, 'QB').faced.WAS.rank, 1);
  assert.equal(rankPositionSchedules(data, 'RB').faced.WAS.rank, 32);
  assert.equal(rankPositionSchedules(data, 'QB').faced.WAS.games, 7);
  assert.equal(rankPositionSchedules(data, 'WR').remaining.WAS.rank, 1);
  assert.equal(upcoming(data, 'WAS', 'QB', 9).rank, 32, 'upcoming defense rank reverses raw DRK independently of SOS');
  assert.equal(JSON.stringify(data), before);
  data.defenseByTeam.ATL.QBRK = '';
  assert.equal(rankPositionSchedules(data, 'QB').faced.WAS.rank, null, 'incomplete league data stays unavailable');
});

test('DataHub upcoming header honors current week, CSV cutoff, BYEs, aliases, invalid ranks and completed seasons', () => {
  const data = fixture();
  data.scheduleByTeam.BUF = { 9: 'vs. WSH', 10: '@ JAC', 11: 'BYE' };
  data.defenseByTeam.WAS.QBRK = '32';
  for (const week of [null, undefined, 0, 8, 9.5, 19]) assert.equal(upcoming(data, 'BUF', 'QB', week).week, 9);
  assert.deepEqual(upcoming(data, 'BUF', 'QB', 9), { week: 9, opponent: 'vs WAS', rank: 1 });
  assert.equal(upcoming(data, 'BUF', 'QB', 10).opponent, '@ JAX');
  assert.deepEqual(upcoming(data, 'BUF', 'QB', 11), { week: 11, opponent: 'BYE', rank: null });
  assert.equal(upcoming(data, 'FA', 'QB', 9).opponent, '—');
  for (const value of ['', null, undefined, 'NA', 0, -1, 33, 1.5]) {
    data.defenseByTeam.WAS.QBRK = value;
    assert.equal(upcoming(data, 'BUF', 'QB', 9).rank, null);
  }
  data.latestRecordedWeek = 18;
  assert.deepEqual(upcoming(data, 'BUF', 'QB', 18), { complete: true });
});

test('DataHub historical SOS preserves played zero/negative points and excludes BYE/projection placeholders', () => {
  const data = historicalSosSource([{ week: 1, rows: [
    { SLPR_ID: '1', TM: 'BUF', VS: '@ HOU', POS: 'RB', FPT_PPR: '0', GM_P: '1' },
    { SLPR_ID: '2', TM: 'HOU', VS: 'vs BUF', POS: 'QB', FPT_PPR: '-2', GM_P: '1' },
  ] }, { week: 2, rows: [
    { SLPR_ID: '1', TM: 'BUF', VS: 'BYE', POS: 'RB', FPT_PPR: '0', PROJ: '20' },
  ] }]);
  assert.equal(data.defenseByTeam.HOU.RB, 0);
  assert.equal(data.defenseByTeam.BUF.QB, -2);
  assert.equal(data.latestRecordedWeek, 1);
});

test('DataHub team records retain zero records and ties separately from numeric ranks', () => {
  const row = { TM: 'BUF', 'Pa%': '51%', 'Ru%': '49%', 'paYds/G': '256.1', 'ruYds/G': '148.4' };
  for (const [record, expected] of [['6-1', '6-1'], ['0-0', '0-0'], ['3 - 4 - 1', '3-4-1'], ['', null], ['NA', null]]) {
    const teams = build2026TeamStats([{ ...row, 'W-L': record }]);
    assert.equal(teams.BUF.record, expected);
    assert.equal('record' in build2026TeamRanks(teams).BUF, false);
  }
});

function node() {
  const classes = new Set();
  return { parentElement: null, attributes: {},
    classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name),
      toggle(name, force = !classes.has(name)) { force ? classes.add(name) : classes.delete(name); } },
    setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; },
    appendChild(child) { child.parentElement = this; }, insertBefore(child) { this.appendChild(child); }, querySelector() { return null; }
  };
}

test('DataHub Ownership changes only lower content for veterans and restores the standalone rookie flow', () => {
  const modal = node(), playerPane = node(), ownershipPane = node();
  const state = { currentGameLogsPlayer: { id: '1' }, currentGameLogsView: 'gl' };
  let rookie = false;
  const ctx = vm.createContext({ state, gameLogsModal: modal, gameLogsModalTabs: [],
    document: { querySelector: selector => selector === '#gamelogs-tab-pane' ? playerPane : ownershipPane },
    isDataHubOwnershipOnlyModal: () => rookie, renderDataHubOwnershipPane() {}, closeDataHubConsistencyStatMenu() {},
    syncDataHubGameLogsNavigation() {}, renderDataHubConsistencyChart() {}, syncDataHubCareerRowHeights() {},
  });
  vm.runInContext(slice(source, 'function switchDataHubModalTab(', 'async function openDataHubRookieOwnership('), ctx);
  ctx.switchDataHubModalTab('ownership');
  assert.equal(ownershipPane.parentElement, playerPane);
  assert.equal(playerPane.classList.contains('hidden'), false);
  assert.equal(ownershipPane.classList.contains('hidden'), false);
  assert.equal(modal.classList.contains('is-ownership-view'), true);
  assert.equal(ownershipPane.attributes.role, 'region');
  ctx.switchDataHubModalTab('gamelogs');
  assert.equal(ownershipPane.classList.contains('hidden'), true);
  assert.equal(state.currentGameLogsView, 'gl');
  rookie = true;
  ctx.switchDataHubModalTab('gamelogs');
  assert.equal(ownershipPane.parentElement, modal);
  assert.equal(playerPane.classList.contains('hidden'), true);
  assert.equal(ownershipPane.attributes.role, 'dialog');
  assert.equal(ownershipPane.attributes['aria-modal'], 'true');
  rookie = false;
  ctx.switchDataHubModalTab('gamelogs');
  assert.equal(ownershipPane.parentElement, playerPane);
  assert.equal(playerPane.classList.contains('hidden'), false);
  assert.equal(ownershipPane.attributes['aria-modal'], undefined);
});
