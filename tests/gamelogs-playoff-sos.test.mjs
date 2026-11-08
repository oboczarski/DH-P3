import test from 'node:test';
import assert from 'node:assert/strict';
import * as rosters from '../DH_P2.53/scripts/rosters-gamelogs-sos.js';
import * as datahub from '../DH_P2.53/scripts/datahub-gamelogs-sos.js';

// Exercise both independently owned helpers against schedules whose YTD/ROS
// difficulty differs from the fixed fantasy-playoff window.
for (const [page, { SOS_TEAMS, rankPositionSchedules }] of Object.entries({ rosters, datahub })) {
  const fixture = (latestRecordedWeek = 8) => ({
    latestRecordedWeek,
    scheduleByTeam: Object.fromEntries(SOS_TEAMS.map(team => [team,
      Object.fromEntries(Array.from({ length: 18 }, (_, index) => [index + 1, '@ ATL']))
    ])),
    defenseByTeam: Object.fromEntries(SOS_TEAMS.map((team, index) => [team, {
      QBRK: index + 1, RBRK: 32 - index, WRRK: 10, TERK: index + 1,
      QB: index, RB: 31 - index, WR: 10, TE: index / 2,
    }])),
  });

  test(`${page}: PLAYOFF compares only Weeks 15–17 across all 32 teams by position`, () => {
    const source = fixture();
    // All other teams face ATL. ARI's playoff opponents are WAS, ARI, WAS;
    // its Weeks 14/18 opponents must not enter the three-game average.
    Object.assign(source.scheduleByTeam.ARI, { 14: '@ ARI', 15: '@ WAS', 16: 'vs ARI', 17: 'vs WAS', 18: '@ ARI' });
    const before = structuredClone(source);
    const qb = rankPositionSchedules(source, 'QB');
    assert.equal(qb.playoff.ARI.average, 65 / 3);
    assert.equal(qb.playoff.ARI.games, 3);
    assert.equal(qb.playoff.ARI.rank, 32);
    assert.equal(qb.faced.ARI.rank, 1, 'YTD still uses completed weeks only');
    assert.equal(rankPositionSchedules(source, 'RB').playoff.ARI.rank, 1, 'uses the player position');
    assert.equal(rankPositionSchedules(source, 'WR').playoff.ARI.rank, 1, 'tied averages share a rank');
    assert.equal(rankPositionSchedules(source, 'TE').playoff.ARI.rank, 32);
    assert.deepEqual(source, before, 'source ranks and schedule remain unchanged');
    source.scheduleByTeam.ARI[14] = '@ WAS';
    source.scheduleByTeam.ARI[18] = '@ WAS';
    assert.deepEqual(rankPositionSchedules(source, 'QB').playoff, qb.playoff);
  });

  test(`${page}: PLAYOFF keeps its full window before, during and after the playoffs`, () => {
    const source = fixture();
    Object.assign(source.scheduleByTeam.ARI, { 15: '@ WAS', 16: '@ ARI', 17: '@ WAS' });
    const expected = rankPositionSchedules(source, 'QB').playoff;
    for (const cutoff of [0, 8, 14, 15, 16, 17, 18]) {
      source.latestRecordedWeek = cutoff;
      source.projectionWeeks = { 15: true, 16: true, 17: true };
      assert.deepEqual(rankPositionSchedules(source, 'QB').playoff, expected);
    }
    assert.equal(rankPositionSchedules(source, 'QB').remaining.ARI.rank, null, 'season complete leaves ROS empty');
  });

  test(`${page}: PLAYOFF excludes BYEs, counts repeat games and preserves historical zero/negative allowances`, () => {
    const source = fixture();
    Object.assign(source.scheduleByTeam.ARI, { 15: '@ WAS', 16: 'BYE', 17: 'vs WAS' });
    const playoff = rankPositionSchedules(source, 'QB').playoff;
    assert.equal(playoff.ARI.games, 2);
    assert.equal(playoff.ARI.average, 32);
    assert.equal(playoff.ARI.rank, 32);
    source.defenseByTeam.WAS.QB = -2;
    source.defenseByTeam.ATL.QB = 0;
    const historical = rankPositionSchedules(source, 'QB', 'allowance').playoff;
    assert.equal(historical.ARI.average, -2);
    assert.equal(historical.ARI.rank, 32);
    assert.equal(historical.ATL.average, 0);
    assert.equal(historical.ATL.rank, 1);
  });

  test(`${page}: missing data invalidates only the affected SOS periods`, () => {
    const source = fixture();
    delete source.scheduleByTeam.BUF[1];
    delete source.scheduleByTeam.BUF[18];
    let ranked = rankPositionSchedules(source, 'QB');
    assert.equal(ranked.faced.ARI.rank, null);
    assert.equal(ranked.remaining.ARI.rank, null);
    assert.equal(ranked.playoff.ARI.rank, 1, 'missing games outside Weeks 15–17 do not block PLAYOFF');
    for (const missing of ['', 'OUT', undefined]) {
      source.scheduleByTeam.BUF[16] = missing;
      ranked = rankPositionSchedules(source, 'QB');
      assert.ok(Object.values(ranked.playoff).every(metric => metric.rank === null), 'incomplete playoff schedules never shrink the /32 pool');
    }
    source.scheduleByTeam.BUF[16] = '@ WAS';
    source.defenseByTeam.WAS.QBRK = 0;
    assert.equal(rankPositionSchedules(source, 'QB').playoff.ARI.rank, null, 'invalid positional rank never becomes zero or an allowance fallback');
  });
}
