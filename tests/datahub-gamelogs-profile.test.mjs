import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { buildHistoricalProfileSource, buildProfileScheduleRanks } from '../DH_P2.53/scripts/datahub-gamelogs-profile.js';

const teams = 'ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' ');
function fixture(cutoff = 7) {
  return {
    latestRecordedWeek: cutoff,
    scheduleByTeam: Object.fromEntries(teams.map((team, index) => [team, Object.fromEntries(Array.from({ length: 18 }, (_, week) => [week + 1, week === 4 ? 'BYE' : `${week % 2 ? '@' : 'vs'} ${teams[(index + 1) % 32]}`]))])),
    defenseByTeam: Object.fromEntries(teams.map((team, index) => [team, { QBRK: index + 1, RBRK: 32 - index, WRRK: index + 1, TERK: 32 - index }])),
  };
}

test('SOS compares all 32 team schedules by base position and never reverses or mutates defense ranks', () => {
  const source = fixture(), original = structuredClone(source);
  const qb = buildProfileScheduleRanks(source, 'QB');
  const rb = buildProfileScheduleRanks(source, 'RB');
  assert.deepEqual(qb.past.WAS, { rank: 1, games: 6, mean: 1 });
  assert.deepEqual(rb.past.WAS, { rank: 32, games: 6, mean: 32 });
  assert.equal(qb.remaining.WAS.rank, 1);
  assert.equal(qb.remaining.WAS.games, 11);
  assert.equal(Object.keys(qb.past).length, 32);
  assert.deepEqual(source, original);
  assert.equal(buildProfileScheduleRanks(source, 'K'), null);
});

test('repeat opponents are weighted per game, BYEs excluded, and past/future are split at recorded week', () => {
  const source = fixture(3);
  source.scheduleByTeam.ARI[1] = '@ ATL'; // rank 2
  source.scheduleByTeam.ARI[2] = 'vs ATL';
  source.scheduleByTeam.ARI[3] = '@ WAS'; // rank 32
  source.scheduleByTeam.ARI[4] = 'vs BAL';
  const model = buildProfileScheduleRanks(source, 'QB');
  assert.equal(model.past.ARI.mean, 12);
  assert.equal(model.past.ARI.games, 3);
  assert.equal(model.remaining.ARI.games, 14);
  assert.equal(model.remaining.ARI.mean, (3 + 13 * 2) / 14);
});

test('equal schedule means receive shared competition ranks and the next rank skips tied teams', () => {
  const source = fixture();
  source.defenseByTeam.ATL.QBRK = 1;
  const model = buildProfileScheduleRanks(source, 'QB');
  assert.equal(model.past.WAS.rank, 1);
  assert.equal(model.past.ARI.rank, 1);
  assert.equal(model.past.ATL.rank, 3);
});

test('missing data cannot manufacture zero difficulty or a ranking against fewer than 32 schedules', () => {
  for (const value of ['', 'NA', 0, -1, 33, null, undefined]) {
    const source = fixture(); source.defenseByTeam.ATL.QBRK = value;
    assert.deepEqual(buildProfileScheduleRanks(source, 'QB').past, {}, String(value));
    assert.equal(Object.keys(buildProfileScheduleRanks(source, 'RB').past).length, 32);
  }
  assert.equal(buildProfileScheduleRanks({ ...fixture(), latestRecordedWeek: null }, 'QB'), null);
  assert.equal(buildProfileScheduleRanks({ ...fixture(), resultsAvailable: false }, 'QB'), null);
  const source = fixture(); delete source.scheduleByTeam.ARI[2];
  assert.deepEqual(buildProfileScheduleRanks(source, 'QB').past, {});
  assert.equal(Object.keys(buildProfileScheduleRanks(source, 'QB').remaining).length, 32);
  delete source.scheduleByTeam.ARI;
  assert.equal(buildProfileScheduleRanks(source, 'QB'), null);
});

test('preseason and completed seasons have an empty period, without inventing a remaining SOS', () => {
  const before = buildProfileScheduleRanks(fixture(0), 'TE');
  assert.deepEqual(before.past, {});
  assert.equal(before.remaining.ARI.games, 17);
  const after = buildProfileScheduleRanks(fixture(18), 'WR');
  assert.deepEqual(after.remaining, {});
  assert.equal(after.past.ARI.games, 17);
});

test('historical source deduplicates player rows and normalizes aliases while ignoring FA/status opponents', () => {
  const rows = { 1: [
    { SLPR_ID: '1', TM: 'JAC', POS: 'QB', VS: '@ WSH', vsRK: '2' },
    { SLPR_ID: '2', TM: 'JAX', POS: 'QB', VS: '@ WAS', vsRK: '2' },
    { SLPR_ID: '3', TM: 'FA', POS: 'QB', VS: 'NA', vsRK: '0' },
  ], 2: [{ SLPR_ID: '1', TM: 'LA', POS: 'QB', VS: 'vs WSH', vsRK: '8' }] };
  const source = buildHistoricalProfileSource(rows, 2);
  assert.equal(source.scheduleByTeam.JAX[1], '@ WAS');
  assert.equal(source.defenseByTeam.WAS.QBRK, 8);
  assert.equal(source.playerTeams['1'], 'LAR');
  assert.equal(source.scheduleByTeam.FA, undefined);
});

test('real historical CSVs yield complete position-specific league comparisons and exclude 2026 data', () => {
  const script = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
  const functions = ['parseCsv', 'parseCsvLine'].map(name => script.match(new RegExp(`function ${name}\\([^]*?\\n}`))?.[0]).join('\n');
  const context = vm.createContext({}); vm.runInContext(functions, context);
  const weeks = Object.fromEntries(Array.from({ length: 18 }, (_, index) => [index + 1, context.parseCsv(fs.readFileSync(new URL(`../DH_P2.53/data/NFL-2025_Stats/WeeklyStats/WK${index + 1}.csv`, import.meta.url), 'utf8'))]));
  const source = buildHistoricalProfileSource(weeks, 18);
  assert.equal(Object.keys(source.scheduleByTeam).length, 32);
  for (const position of ['QB', 'RB', 'WR', 'TE']) {
    const model = buildProfileScheduleRanks(source, position);
    assert.equal(Object.keys(model.past).length, 32, position);
    assert.deepEqual(model.remaining, {});
    assert.ok(Object.values(model.past).every(entry => entry.games === 17 && entry.rank >= 1 && entry.rank <= 32));
  }
  assert.notEqual(buildProfileScheduleRanks(source, 'QB').past.BUF.rank, buildProfileScheduleRanks(source, 'WR').past.BUF.rank);
});
