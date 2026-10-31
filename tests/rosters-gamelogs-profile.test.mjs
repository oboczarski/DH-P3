import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the actual header's numeric model without loading a modal or any
// external data. A full 32-team pool is required for comparable SOS rankings.
const context = vm.createContext({ window: {}, document: { body: { dataset: { page: 'test' } } } });
vm.runInContext(fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-gamelogs-profile.js', import.meta.url), 'utf8'), context);
const { calculateSos, normalizeTeam } = context.window.RostersGameLogsProfileMath;
const teams = 'ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' ');

function fixture(cutoff = 7) {
  return {
    latestRecordedWeek: cutoff,
    scheduleByTeam: Object.fromEntries(teams.map((team, i) => [team,
      Object.fromEntries(Array.from({ length: 18 }, (_, week) => [week + 1, `vs ${teams[(i + 1) % 32]}`]))])),
    defenseRanksByTeam: Object.fromEntries(teams.map((team, i) => [team, { QBRK: i + 1, RBRK: 32 - i, WRRK: i + 1, TERK: 32 - i }])),
  };
}

test('SOS compares all 32 schedules, preserves position differences and never changes source ranks', () => {
  const source = fixture();
  const before = JSON.stringify(source);
  assert.equal(calculateSos(source, 'ARI', 'QB').faced.rank, 2);
  assert.equal(calculateSos(source, 'ARI', 'RB').faced.rank, 31);
  assert.equal(calculateSos(source, 'WAS', 'QB').faced.rank, 1);
  assert.equal(calculateSos(source, 'TEN', 'TE').remaining.rank, 1);
  assert.equal(JSON.stringify(source), before);
});

test('faced and remaining split at the recorded CSV cutoff, independent of projections', () => {
  const source = fixture();
  source.scheduleByTeam.ARI[8] = '@ ARI';
  source.projectionWeeks = { 8: true, 9: true, 10: true };
  const result = calculateSos(source, 'ARI', 'QB');
  assert.equal(result.faced.games, 7);
  assert.equal(result.faced.average, 2);
  assert.equal(result.remaining.games, 11);
  assert.equal(result.remaining.average, 21 / 11);
  assert.equal(result.faced.last, 7);
  assert.equal(result.remaining.first, 8);
});

test('BYEs contribute no game or zero; repeated opponents retain matchup weighting', () => {
  const source = fixture(3);
  source.scheduleByTeam.ARI[1] = 'BYE';
  source.scheduleByTeam.ARI[2] = '@ WAS';
  source.scheduleByTeam.ARI[3] = 'vs ATL';
  const result = calculateSos(source, 'ARI', 'QB');
  assert.equal(result.faced.games, 2);
  assert.equal(result.faced.average, 17);
  assert.equal(result.remaining.games, 15);
  assert.equal(result.remaining.average, 2);
});

test('missing, status, zero, negative and invalid ranks cannot become numeric SOS', () => {
  for (const bad of ['', null, undefined, 'NA', 'BYE', 0, -1, 33, '2nd', 2.5]) {
    const source = fixture();
    source.defenseRanksByTeam.ATL.QBRK = bad;
    assert.equal(calculateSos(source, 'ARI', 'QB').faced.rank, null, String(bad));
  }
});

test('incomplete league data never yields a misleading rank from a smaller pool', () => {
  const source = fixture();
  delete source.scheduleByTeam.BUF[1];
  assert.equal(calculateSos(source, 'ARI', 'QB').faced.rank, null);
  assert.equal(calculateSos(source, 'ARI', 'QB').remaining.rank, 2);
});

test('empty preseason/completed-season windows are unavailable rather than ranked', () => {
  assert.equal(calculateSos(fixture(0), 'ARI', 'QB').faced.rank, null);
  assert.equal(calculateSos(fixture(0), 'ARI', 'QB').remaining.games, 18);
  assert.equal(calculateSos(fixture(18), 'ARI', 'QB').remaining.rank, null);
  assert.equal(calculateSos(fixture(18), 'ARI', 'QB').faced.games, 18);
  assert.equal(calculateSos(fixture(19), 'ARI', 'QB').faced.rank, null);
});

test('equal schedule averages share a competition rank', () => {
  const source = fixture();
  source.scheduleByTeam.ARI = { ...source.scheduleByTeam.ATL };
  assert.equal(calculateSos(source, 'ARI', 'QB').faced.rank, 2);
  assert.equal(calculateSos(source, 'ATL', 'QB').faced.rank, 2);
});

test('team aliases/venue prefixes normalize while unsupported teams/positions stay unavailable', () => {
  assert.equal(normalizeTeam('@ JAC'), 'JAX');
  assert.equal(normalizeTeam('vs. WSH'), 'WAS');
  assert.equal(normalizeTeam('LA'), 'LAR');
  assert.equal(calculateSos(fixture(), 'WSH', 'QB').faced.rank, 1);
  assert.equal(calculateSos(fixture(), 'FA', 'QB').faced.rank, null);
  assert.equal(calculateSos(fixture(), 'BUF', 'K').faced.rank, null);
});

test('archived positional weekly ranks stay independent of current DRK values', () => {
  const source = fixture();
  source.opponentRanksByTeam = Object.fromEntries(teams.map(team => [team, { QB: Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 1, 15])) }]));
  assert.equal(calculateSos(source, 'ARI', 'QB').faced.average, 15);
  assert.equal(calculateSos(source, 'ARI', 'QB').faced.rank, 1);
  delete source.opponentRanksByTeam.BUF.QB[8];
  assert.equal(calculateSos(source, 'ARI', 'QB').remaining.rank, null);
  assert.equal(calculateSos(source, 'ARI', 'QB').faced.rank, 1);
});
