import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-gamelogs-sos.js', import.meta.url), 'utf8');
const { SOS_TEAMS, rankPositionSchedules, historicalSosSource } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

function fixture(cutoff = 7) {
  return {
    latestRecordedWeek: cutoff,
    scheduleByTeam: Object.fromEntries(SOS_TEAMS.map((team, i) => [team, Object.fromEntries(Array.from({ length: 18 }, (_, w) => [w + 1, w === 6 ? 'BYE' : `@ ${SOS_TEAMS[(i + 1) % 32]}`]))])),
    defenseByTeam: Object.fromEntries(SOS_TEAMS.map((team, i) => [team, { QB: i, RB: 31 - i, WR: 10, TE: i / 2 }])),
  };
}

test('SOS compares all 32 schedules by positional allowances; QB and RB can have opposite difficulty', () => {
  const snapshot = fixture();
  const before = JSON.stringify(snapshot);
  const qb = rankPositionSchedules(snapshot, 'QB');
  const rb = rankPositionSchedules(snapshot, 'RB');
  assert.equal(qb.faced.TEN.rank, 1);
  assert.equal(qb.faced.WAS.rank, 32);
  assert.equal(rb.faced.TEN.rank, 32);
  assert.equal(rb.faced.WAS.rank, 1);
  assert.equal(qb.faced.ARI.games, 6, 'BYE excluded');
  assert.equal(qb.remaining.ARI.games, 11);
  assert.equal(JSON.stringify(snapshot), before, 'published ranks and allowances never change');
});

test('repeated opponents count per game and unequal BYE counts use averages, not totals', () => {
  const snapshot = fixture(3);
  snapshot.scheduleByTeam.ARI = { ...snapshot.scheduleByTeam.ARI, 1: '@ WAS', 2: 'vs WAS', 3: 'BYE' };
  snapshot.scheduleByTeam.ATL = { ...snapshot.scheduleByTeam.ATL, 1: '@ WAS', 2: 'vs WAS', 3: '@ ARI' };
  const ranked = rankPositionSchedules(snapshot, 'QB');
  assert.equal(ranked.faced.ARI.average, 31);
  assert.equal(ranked.faced.ATL.average, 62 / 3);
  assert.ok(ranked.faced.ARI.rank < ranked.faced.ATL.rank);
  assert.equal(rankPositionSchedules(snapshot, 'WR').faced.ARI.rank, 1, 'tied schedules share a rank');
});

test('cutoff comes from recorded CSV weeks; future projection/status fields have no effect', () => {
  const snapshot = fixture(1);
  snapshot.projectionWeeks = { 2: true, 3: true };
  snapshot.weeklyStats = { 2: { x: { proj: 'OUT', fpt_ppr: 99 } } };
  const ranked = rankPositionSchedules(snapshot, 'QB');
  assert.equal(ranked.cutoff, 1);
  assert.equal(ranked.faced.ARI.games, 1);
  assert.equal(ranked.remaining.ARI.games, 16);
  assert.equal(rankPositionSchedules(fixture(0), 'QB').faced.ARI.rank, null);
  assert.equal(rankPositionSchedules(fixture(18), 'QB').remaining.ARI.rank, null);
});

test('missing or invalid data never fabricates a /32 rank; numeric zero and negative allowances remain valid', () => {
  for (const bad of ['', null, 'NA', '-', 'OUT', '20 pts']) {
    const snapshot = fixture();
    snapshot.defenseByTeam.ATL.QB = bad;
    assert.equal(rankPositionSchedules(snapshot, 'QB').faced.ARI.rank, null);
  }
  const zero = fixture();
  zero.defenseByTeam.ATL.QB = 0;
  zero.defenseByTeam.BAL.QB = -2;
  assert.equal(rankPositionSchedules(zero, 'QB').faced.ARI.average, 0);
  assert.equal(rankPositionSchedules(zero, 'QB').faced.ATL.average, -2);
  assert.equal(rankPositionSchedules(zero, 'QB').faced.ATL.rank, 32);
  delete zero.scheduleByTeam.BUF[2];
  assert.equal(rankPositionSchedules(zero, 'QB').faced.ARI.rank, null, 'incomplete league comparison rejected');
  assert.equal(rankPositionSchedules(zero, 'K'), null);
  assert.equal(rankPositionSchedules({ ...zero, latestRecordedWeek: undefined }, 'QB'), null);
});

test('schedule and defense aliases normalize without mutating their supplied keys', () => {
  const snapshot = fixture();
  snapshot.scheduleByTeam.JAC = snapshot.scheduleByTeam.JAX;
  delete snapshot.scheduleByTeam.JAX;
  snapshot.defenseByTeam.WSH = snapshot.defenseByTeam.WAS;
  delete snapshot.defenseByTeam.WAS;
  snapshot.scheduleByTeam.TEN[1] = 'vs. WSH';
  assert.equal(rankPositionSchedules(snapshot, 'QB').faced.TEN.rank, 1);
});

test('historical positional FPA sums player points once and divides by defensive games, excluding BYEs', () => {
  const history = historicalSosSource([
    { week: 1, rows: [
      { SLPR_ID: '1', TM: 'BUF', VS: '@ HOU', POS: 'RB', FPT_PPR: '0', GM_P: '1' },
      { SLPR_ID: '2', TM: 'BUF', VS: '@ HOU', POS: 'RB', FPT_PPR: '10', GM_P: '1' },
      { SLPR_ID: '2', TM: 'BUF', VS: '@ HOU', POS: 'RB', FPT_PPR: '10', GM_P: '1' },
      { SLPR_ID: '3', TM: 'HOU', VS: 'vs BUF', POS: 'QB', FPT_PPR: '-2', GM_P: '1' },
    ] },
    { week: 2, rows: [
      { SLPR_ID: '1', TM: 'BUF', VS: 'BYE', POS: 'RB', FPT_PPR: '0' },
      { SLPR_ID: '3', TM: 'HOU', VS: 'BYE', POS: 'QB', FPT_PPR: '0' },
    ] },
  ]);
  assert.equal(history.defenseByTeam.HOU.RB, 10);
  assert.equal(history.defenseByTeam.BUF.QB, -2);
  assert.equal(history.latestRecordedWeek, 1);
});
