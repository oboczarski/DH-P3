import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  parseDashboardCsv, normalizeDashboardPlayer, loadDashboardPlayers,
  selectConsistencyRb, selectScatterPlayers, getScatterBounds,
  getDashboardQualifierWeeks, selectSummaryLeaders, selectPpgLeaders,
  buildPositionalDistribution, selectYardageLeaders, rankDashboardPlayers
} from '../DH_P2.53/scripts/dashboard-data.js';

const headers = 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,CSTY%,CL';
const fixture = `${headers}\r\n2026,1,"Runner, \"\"One\"\"",RB,DET,120,4,100.0%,40\r\n2026,2,Runner Two,RB,SF,200,8,100.0%,30`;

test('season CSV adapter preserves quoted names, percentages, zeroes and missing cells', () => {
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

test('home requests only the fresh local season CSV and rejects stale seasons or bad files', async () => {
  const calls = [];
  const players = await loadDashboardPlayers(async (url, options) => {
    calls.push({ url, options });
    return { ok: true, text: async () => fixture };
  });
  assert.equal(calls.length, 1);
  assert.ok(new URL(calls[0].url).pathname.endsWith('/data/NFL-2026_Stats/SeasonStats/2026_Season.csv'));
  assert.equal(new URL(calls[0].url).search, '');
  assert.doesNotMatch(String(calls[0].url), /google/);
  assert.equal(calls[0].options.cache, 'no-store');
  assert.deepEqual(players.map(player => player.id), ['2', '1']);
  for (const text of [fixture.replaceAll('2026,', '2025,'), '<html>Error</html>', headers]) {
    await assert.rejects(loadDashboardPlayers(async () => ({ ok: true, text: async () => text })));
  }
  await assert.rejects(loadDashboardPlayers(async () => ({ ok: false, status: 503 })), /503/);
  assert.throws(() => parseDashboardCsv(fixture + '\n"unfinished'), /quoted cell/);
});

test('home adapts every maintained season CSV player without losing PPR totals, games or percentage units', async () => {
  const csv = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/SeasonStats/2026_Season.csv', import.meta.url), 'utf8');
  const original = parseDashboardCsv(csv);
  const players = await loadDashboardPlayers(async () => ({ ok: true, text: async () => csv }));
  const byId = new Map(players.map(player => [player.id, player]));
  assert.equal(players.length, original.length);
  for (const row of original) {
    const player = byId.get(row.SLPR_ID);
    assert.ok(player);
    assert.equal(player.stats.fpts, Number(row.FPT_PPR));
    assert.equal(player.games, Number(row.GM_P));
    assert.equal(player.stats.ppg, Number(row.GM_P) > 0 ? Number(row.FPT_PPR) / Number(row.GM_P) : null);
    assert.equal(player.stats.csty, row['CSTY%'] === 'NA' ? null : Number(row['CSTY%'].replace('%', '')));
  }
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

test('scatter uses 40%/15 lower bounds for the live extrema and uses the tighter 102% upper bound', () => {
  assert.deepEqual(getScatterBounds([
    { stats: { csty: 42.9, ceiling: 16.8 } },
    { stats: { csty: 100, ceiling: 37.6 } }
  ]), { x: [40, 102], y: [15, 40] });
});

test('scatter rounds future extrema down/up once, preserves 102%, and handles constant data', () => {
  const players = [
    { stats: { csty: 15, ceiling: 9 } },
    { stats: { csty: 100, ceiling: 65 } }
  ];
  const bounds = getScatterBounds(players);
  assert.deepEqual(bounds, { x: [10, 102], y: [5, 70] });
  const single = getScatterBounds([players[1]]);
  assert.ok(single.x[0] < 100 && single.x[1] > 100);
  assert.deepEqual(single.y, [65, 70]);
});

const summaryPlayer = (position, id, stats = {}, games = 8) => ({
  id, position, games,
  stats: { fpts: 100, ppg: 100 / games, pass_att: 120, rush_att: 32, rr: 96,
    csty: 100, epa_db: 0.25, ts: 25, ...stats }
});

test('all four summary cards exclude unqualified higher values and inspect the full eligible pool', () => {
  const qualified = ['QB', 'RB', 'WR', 'TE'].map(pos => summaryPlayer(pos, pos));
  const unqualified = ['QB', 'RB', 'WR', 'TE'].map(pos => summaryPlayer(pos, `short-${pos}`,
    { fpts: 1000, pass_att: 0, rush_att: 0, rr: 0, epa_db: 99, ts: 99 }, 1));
  const volumeMisses = [
    summaryPlayer('QB', 'qb-below', { pass_att: 119, epa_db: 10 }),
    summaryPlayer('RB', 'rb-below', { rush_att: 31, fpts: 159 }),
    summaryPlayer('WR', 'wr-below', { rr: 95, ts: 99 }),
    summaryPlayer('TE', 'te-below', { rr: 95, fpts: 159 })
  ];
  qualified.find(p => p.position === 'WR').stats.fpts = 140;
  const leaders = selectSummaryLeaders([...unqualified, ...volumeMisses, ...qualified]);
  assert.equal(leaders.topFpts.id, 'WR');
  assert.equal(leaders.topEPAQB.id, 'QB');
  assert.equal(leaders.topCstyRB.id, 'RB');
  assert.equal(leaders.topTSWR.id, 'WR');
  const outsidePicker = summaryPlayer('QB', 'outside-top-100', { epa_db: 0.5 });
  assert.equal(selectSummaryLeaders([...Array(105).fill(qualified[0]), outsidePicker]).topEPAQB.id, 'outside-top-100');
});

test('summary cards retain DataHub half-season/20-PPG exception and its exact volume boundaries', () => {
  for (const [position, stat, minimum] of [['QB', 'pass_att', 120], ['RB', 'rush_att', 32], ['WR', 'rr', 96], ['TE', 'rr', 96]]) {
    const anchor = summaryPlayer(position, 'boundary', { [stat]: minimum });
    const below = summaryPlayer(position, 'below', { [stat]: minimum - 1, fpts: 159 });
    assert.equal(selectSummaryLeaders([below, anchor]).topFpts.id, 'boundary');
    const exception = summaryPlayer(position, 'exception', { [stat]: 0, fpts: 80 }, 4);
    assert.equal(selectSummaryLeaders([anchor, exception]).topFpts.id, 'boundary');
    assert.equal(selectSummaryLeaders([exception, { ...anchor, stats: { ...anchor.stats, fpts: 1 } }]).topFpts.id, 'exception');
    exception.stats.fpts = 79.9;
    assert.equal(selectSummaryLeaders([anchor, exception]).topFpts.id, 'boundary');
    exception.stats.fpts = 100;
    exception.games = 3;
    assert.equal(selectSummaryLeaders([exception, anchor]).topFpts.id, 'boundary');
  }
});

test('summary volume minimums derive from all DH games and advance after 14 games', () => {
  for (const [games, weeks] of [[0, 1], [1, 1], [8, 8], [13, 13], [14, 15], [17, 18]]) {
    assert.equal(getDashboardQualifierWeeks([summaryPlayer('RB', 'clock', {}, games)]), weeks);
  }
  assert.equal(getDashboardQualifierWeeks([-1, null, 18, 2.5, Infinity].map(games => summaryPlayer('QB', 'invalid', {}, games))), 1);
  const clock = summaryPlayer('TE', 'clock', { fpts: 1, rr: 0 }, 14);
  const boundary = summaryPlayer('QB', 'boundary', { pass_att: 225, fpts: 100 });
  const below = summaryPlayer('QB', 'below', { pass_att: 224, fpts: 150 });
  assert.equal(selectSummaryLeaders([clock, boundary, below]).topFpts.id, 'boundary');
});

test('expanded PPG leaderboard returns twelve and keeps the independent three-game gate', () => {
  const players = Array.from({ length: 15 }, (_, index) => ({
    ...summaryPlayer(index % 2 ? 'WR' : 'RB', String(index), { ppg: 40 - index, fpts: 200 - index, rush_att: 0, rr: 0 }),
    name: 'Player ' + index
  }));
  players.push({ ...players[0], id: 'too-early', games: 2, stats: { ...players[0].stats, ppg: 100 } });
  assert.equal(selectPpgLeaders(players).length, 12);
  assert.equal(selectPpgLeaders(players)[0].id, '0');
  assert.equal(selectPpgLeaders(players, 'WR').length, 7);
  assert.ok(selectPpgLeaders(players, 'WR').every(player => player.position === 'WR'));
  assert.equal(selectPpgLeaders([{ ...players[0], stats: { ppg: 0, fpts: 0 } }])[0].stats.ppg, 0);
  assert.equal(selectPpgLeaders([{ ...players[0], stats: { ppg: null, fpts: 0 } }]).length, 0);
});

test('Top 60 distribution uses current PPR order and each cumulative prefix conserves players', () => {
  const players = Array.from({ length: 65 }, (_, index) => ({
    ...summaryPlayer(['QB','RB','WR','TE'][index % 4], String(index), { fpts: 200 - index }),
    name: 'Player ' + String(index).padStart(2, '0')
  }));
  players.push({ ...players[0], id: 'future', games: 0, stats: { fpts: 10000 } });
  players.push({ ...players[0], id: 'missing', stats: { fpts: null } });
  const model = buildPositionalDistribution(players.reverse());
  assert.equal(model.total, 60);
  assert.deepEqual(model.counts, { QB: 15, RB: 15, WR: 15, TE: 15 });
  assert.equal(model.rows[1].player.id, '0');
  assert.equal(model.rows[60].player.id, '59');
  for (const row of model.rows) {
    assert.equal(row.QB + row.RB + row.WR + row.TE, row.rank);
    for (const position of ['QB','RB','WR','TE']) {
      assert.ok(Number.isInteger(row[position]));
      if (row.rank) assert.ok(row[position] >= model.rows[row.rank - 1][position]);
    }
  }
  const short = buildPositionalDistribution(players.filter(player => ['0','1','2'].includes(player.id)));
  assert.equal(short.total, 3);
  assert.equal(Object.values(short.counts).reduce((a, b) => a + b), 3);
});

test('Ground / Air sums recorded components, preserves zero, and excludes missing or unqualified results', () => {
  const wr = { ...summaryPlayer('WR', 'receiver', { rushing_yards: 0, receiving_yards: 1000 }), name: 'Receiver' };
  const rb = { ...summaryPlayer('RB', 'runner', { rushing_yards: 800, receiving_yards: 300 }), name: 'Runner' };
  const missing = { ...wr, id: 'missing', stats: { ...wr.stats, rushing_yards: null, receiving_yards: 2000 } };
  const unqualified = { ...rb, id: 'unqualified', games: 1, stats: { ...rb.stats, rush_att: 0, fpts: 1, rushing_yards: 10000 } };
  const qb = { ...rb, id: 'qb', position: 'QB', stats: { ...rb.stats, rushing_yards: 2000 } };
  assert.deepEqual(selectYardageLeaders([wr, missing, unqualified, rb, qb]).map(player => [player.id, player.totalYards]),
    [['runner', 1100], ['receiver', 1000]]);
  const normalized = normalizeDashboardPlayer({ ruYDS: '0', recYDS: 'NA' });
  assert.equal(normalized.stats.rushing_yards, 0);
  assert.equal(normalized.stats.receiving_yards, null);
});

test('Player Lens ranks use volume/scoring qualification, competition ties and lower TTT', () => {
  const players = [
    summaryPlayer('QB', 'a', { epa_db: .4, ppg: 15, fpts: 120, ttt: 2.8 }),
    summaryPlayer('QB', 'b', { epa_db: .4, ppg: 15, fpts: 120, ttt: 2.5 }),
    summaryPlayer('QB', 'c', { epa_db: .3, ppg: 12, fpts: 96, ttt: null }),
    summaryPlayer('QB', 'unqualified', { pass_att: 0, epa_db: 1, fpts: 80, ppg: 10 }),
    summaryPlayer('QB', 'early', { pass_att: 0, epa_db: 2, fpts: 80, ppg: 40 }, 2)
  ];
  rankDashboardPlayers(players);
  assert.deepEqual(players.map(player => player.statRanks.epa_db), [1, 1, 3, undefined, undefined]);
  assert.deepEqual(players.map(player => player.statRanks.ttt), [2, 1, undefined, undefined, undefined]);
  assert.deepEqual(players.map(player => player.ranks.ppgPosRank), [1, 1, 3, 4, null]);
  assert.equal(players[3].stats.epa_db, 1);
  assert.equal(players[3].ranks.posRank, null);
});
