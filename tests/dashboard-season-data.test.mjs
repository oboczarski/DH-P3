import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDashboardCsv, normalizeDashboardPlayer, loadDashboardPlayers,
  selectConsistencyRb, selectScatterPlayers, getScatterBounds
} from '../DH_P2.53/scripts/dashboard-data.js';

const headers = 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,CSTY%,CL';
const fixture = `${headers}\r\n2026,1,"Runner, \"\"One\"\"",RB,DET,120,4,100.0%,40\r\n2026,2,Runner Two,RB,SF,200,8,100.0%,30`;

test('DH CSV adapter preserves quoted names, percentages, zeroes and missing cells', () => {
  const rows = parseDashboardCsv('\uFEFF' + fixture);
  const player = normalizeDashboardPlayer(rows[0]);
  assert.equal(player.name, 'Runner, "One"');
  assert.equal(player.stats.ppg, 30);
  assert.equal(player.stats.csty, 100);
  const missing = normalizeDashboardPlayer({ ...rows[0], FPT_PPR: '', GM_P: '0', CL: 'NA', 'CSTY%': '', '1DRR': '0', 'TS%': '1%' });
  assert.equal(missing.stats.ppg, null);
  assert.equal(missing.stats.fpts, null);
  assert.equal(missing.stats.ceiling, null);
  assert.equal(missing.stats.csty, null);
  assert.equal(missing.stats.first_down_rec_rate, 0);
  assert.equal(missing.stats.ts, 1);
  assert.equal(normalizeDashboardPlayer({ ...rows[0], FPT_PPR: '-2' }).stats.ppg, -0.5);
  assert.equal(normalizeDashboardPlayer({ ...rows[0], FPT_PPR: '0' }).stats.ppg, 0);
});

test('home requests only fresh DH season data and rejects stale seasons or bad exports', async () => {
  const calls = [];
  const players = await loadDashboardPlayers(async (url, options) => {
    calls.push({ url, options });
    return { ok: true, text: async () => fixture };
  });
  assert.equal(calls.length, 1);
  assert.equal(new URL(calls[0].url).searchParams.get('sheet'), 'DH');
  assert.match(calls[0].url, /16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94/);
  assert.equal(calls[0].options.cache, 'no-store');
  assert.deepEqual(players.map(player => player.id), ['2', '1']);
  for (const text of [fixture.replaceAll('2026,', '2025,'), '<html>Error</html>', headers]) {
    await assert.rejects(loadDashboardPlayers(async () => ({ ok: true, text: async () => text })));
  }
  await assert.rejects(loadDashboardPlayers(async () => ({ ok: false, status: 503 })), /503/);
  assert.throws(() => parseDashboardCsv(fixture + '\n"unfinished'), /quoted cell/);
});

test('CSTY card picks largest FPTS among exactly 100% RBs, independently of PPG or input order', () => {
  const players = parseDashboardCsv(fixture).map(normalizeDashboardPlayer);
  players.push({ ...players[0], id: '3', position: 'WR', stats: { ...players[0].stats, fpts: 1000 } });
  players.push({ ...players[0], id: '4', stats: { ...players[0].stats, fpts: 500, csty: 99.99 } });
  assert.equal(selectConsistencyRb(players).id, '2');
  assert.equal(selectConsistencyRb(players.filter(player => player.stats.csty !== 100)), null);
});

test('scatter selects eight by PPG at every position from the complete season pool', () => {
  const players = ['QB', 'RB', 'WR', 'TE'].flatMap(position => Array.from({ length: 10 }, (_, i) => ({
    id: `${position}-${i}`, position, games: 3,
    stats: { ppg: 30 - i, fpts: 90 - i * 3, csty: 100 - i * 5, ceiling: 50 - i }
  })));
  players.unshift({ id: 'two-games', position: 'RB', games: 2, stats: { ppg: 1000, fpts: 2000, csty: 100, ceiling: 1000 } });
  const scatter = selectScatterPlayers(players.reverse());
  assert.equal(scatter.length, 32);
  for (const position of ['QB', 'RB', 'WR', 'TE']) {
    assert.deepEqual(scatter.filter(player => player.position === position).map(player => player.id),
      Array.from({ length: 8 }, (_, i) => `${position}-${i}`));
  }
  players.find(player => player.id === 'TE-0').stats.ceiling = null;
  const tightEnds = selectScatterPlayers(players).filter(player => player.position === 'TE');
  assert.equal(tightEnds.length, 7);
  assert.ok(!tightEnds.some(player => player.id === 'TE-8'));
});

test('scatter bounds contain lows/highs outside the retired fixed axes and pad constant data', () => {
  const players = [
    { stats: { csty: 15, ceiling: 9 } },
    { stats: { csty: 100, ceiling: 65 } }
  ];
  const bounds = getScatterBounds(players);
  assert.ok(bounds.x[0] < 15 && bounds.x[1] > 100);
  assert.ok(bounds.y[0] < 9 && bounds.y[1] > 65);
  const single = getScatterBounds([players[1]]);
  assert.ok(single.x[0] < 100 && single.x[1] > 100);
  assert.ok(single.y[0] < 65 && single.y[1] > 65);
});
