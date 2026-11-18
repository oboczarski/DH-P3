import test from 'node:test';
import assert from 'node:assert/strict';
import { getConsistencyDial, buildSeasonMetricRows, buildSeasonProductionMix, buildSeasonScatter } from '../DH_P2.53/scripts/datahub-comparison/comparisonSeason.js';

const player = (id, pos, seasonStats) => ({ id, name: `Player ${id}`, pos, seasonStats });

test('consistency dials retain Game Logs seven rate bands, including real zero and unavailable data', () => {
  for (const [rate, expected] of [[0, 'pink'], [14, 'pink'], [15, 'magenta'], [29, 'violet'], [43, 'blue'], [58, 'cyan'], [72, 'teal'], [86, 'green'], [100, 'green']]) {
    assert.equal(getConsistencyDial(rate).tone, expected, String(rate));
  }
  assert.equal(getConsistencyDial(100).progress, 1);
  assert.equal(getConsistencyDial(100).end, '#00d9b0');
  assert.equal(getConsistencyDial(0).rate, 0);
  assert.equal(getConsistencyDial(0).hasProgress, false);
  assert.equal(getConsistencyDial(null).rate, null);
  assert.equal(getConsistencyDial('').tone, 'neutral');
  assert.equal(getConsistencyDial(200).progress, 1);
});

test('season comparisons use the season snapshot, preserving negative, missing, tied and zero results', () => {
  const a = player('A', 'QB', { fpts: 0, ppg: -1, pass_yd: 200 });
  const b = player('B', 'QB', { fpts: 0, ppg: -2 });
  a.weeklySeries = [{ stats: { fpts: 9000, ppg: 9000 } }];
  const rows = buildSeasonMetricRows([a, b]);
  assert.deepEqual(rows.find(row => row.key === 'fpts').values, [0, 0]);
  assert.equal(rows.find(row => row.key === 'fpts').winner, null);
  assert.deepEqual(rows.find(row => row.key === 'ppg').values, [-1, -2]);
  assert.equal(rows.find(row => row.key === 'ppg').winner, 0);
  assert.deepEqual(rows.find(row => row.key === 'pass_yd').values, [200, null]);
  assert.equal(rows.find(row => row.key === 'pass_yd').winner, null);
  assert.deepEqual(rows.find(row => row.key === 'pass_td').values, [null, null]);
  rows.forEach(row => row.positions.filter(value => value !== null).forEach(value => assert.ok(value >= 12 && value <= 288)));
});

test('Production/Efficiency selects appropriate position metrics and honors lower-is-better fields', () => {
  const qb = [player('A', 'QB', { ttt: 2.5, prs_pct: 20, epa_per_db: -.1 }), player('B', 'QB', { ttt: 3, prs_pct: 15, epa_per_db: -.2 })];
  const rows = buildSeasonMetricRows(qb, 'efficiency');
  assert.equal(rows.find(row => row.key === 'ttt').winner, 0);
  assert.equal(rows.find(row => row.key === 'prs_pct').winner, 1);
  assert.equal(rows.find(row => row.key === 'epa_per_db').winner, 0);
  assert.ok(!rows.some(row => row.key === 'pass_yd'));
  for (const positions of [['RB', 'RB'], ['WR', 'WR'], ['TE', 'TE'], ['WR', 'TE'], ['RB', 'WR'], ['QB', 'RB']]) {
    const players = positions.map((pos, i) => player(i, pos, {}));
    assert.ok(buildSeasonMetricRows(players).length >= 6);
    assert.ok(buildSeasonMetricRows(players, 'efficiency').length >= 5);
    if (!positions.includes('QB')) assert.ok(buildSeasonMetricRows(players, 'efficiency').some(row => row.key === 'yprr'));
  }
});

test('production mix keeps source components, net losses and partial values separate', () => {
  const players = [player('A', 'RB', { rush_yd: 100, rec_yd: 50, rush_td: 0, rec_td: 0 }), player('B', 'RB', { rush_yd: -2 })];
  const yards = buildSeasonProductionMix(players);
  assert.deepEqual(yards.components.map(([key]) => key), ['rush_yd', 'rec_yd']);
  assert.equal(yards.rows[0].total, 150);
  assert.equal(yards.rows[0].complete, true);
  assert.equal(yards.rows[1].total, -2);
  assert.equal(yards.rows[1].complete, false);
  assert.equal(yards.rows[1].hasNegative, true);
  assert.equal(yards.rows[1].positiveTotal, 0);
  assert.equal(yards.rows[1].parts[1].value, null);
  const touchdowns = buildSeasonProductionMix(players, 'touchdowns');
  assert.equal(touchdowns.rows[0].total, 0);
  assert.equal(touchdowns.rows[1].total, null);
  assert.equal(buildSeasonProductionMix([player('Q', 'QB', { pass_yd: 200, rush_yd: 10, rec_yd: 0 })]).rows[0].total, 210);
});

test('volume/efficiency plots select meaningful same- and mixed-position axes and preserve signed values', () => {
  for (const [positions, expected] of [
    [['QB', 'QB'], ['pass_att', 'epa_per_db']], [['RB', 'RB'], ['rush_att', 'ypc']],
    [['WR', 'TE'], ['rr', 'yprr']], [['RB', 'WR'], ['rec_tgt', 'yprr']],
    [['QB', 'RB'], ['games_played', 'ppg']],
  ]) {
    const players = positions.map((pos, i) => player(i, pos, { [expected[0]]: i === 0 ? 0 : 5, [expected[1]]: i === 0 ? -1 : 2 }));
    const model = buildSeasonScatter(players);
    assert.deepEqual([model.xKey, model.yKey], expected);
    assert.equal(model.visible.length, 2);
    assert.equal(model.visible[0].x, 0);
    assert.equal(model.visible[0].y, -1);
    assert.ok(model.yMin < -1 && model.yMax > 2);
    assert.ok(model.xMax > 5);
  }
  const incomplete = buildSeasonScatter([player('A', 'RB', { rush_att: 0 }), player('B', 'RB', { rush_att: 0, ypc: 0 })]);
  assert.equal(incomplete.visible.length, 1);
  assert.equal(incomplete.points[0].y, null);
  assert.equal(incomplete.visible[0].y, 0);
});
