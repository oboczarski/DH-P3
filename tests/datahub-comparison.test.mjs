import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWeeklyChartOption, getWeeklyPlayerPalette } from '../DH_P2.53/scripts/datahub-comparison/comparisonChartOptions.js';
import { COMPARISON_GRADIENT_PALETTES, getPlayerPalette } from '../DH_P2.53/scripts/datahub-comparison/comparisonStats.js';

// Exercise the shared chart's public options with close values and missing
// weeks: label separation must never alter a player's actual plotted results.
const weeks = [1, 2, 3, 4, 5];
const player = (id, pos, values) => ({
  id, pos, name: `Player ${id}`, teamLogoSrc: `/logos/${id}.svg`,
  weeklySeries: values.map((value, index) => ({
    week: index + 1, stats: { fpts: value, ttt: value },
    ranks: { fpts: index + 1, ttt: index + 1 }, opponent: 'ATL',
  })),
});
const thresholds = Object.fromEntries(['QB', 'RB', 'WR', 'TE'].map(pos => [pos, {
  fpts: Object.fromEntries([['LOW', 5], ['MID-LOW', 10], ['MID-HIGH', 20], ['HIGH', 30]].map(([key, value]) => [key, { value }])),
}]));
const options = (players, extra = {}) => buildWeeklyChartOption({ players, statKey: 'fpts', weeks, thresholds, ...extra });
const lines = option => option.series.filter(series => series.type === 'line');
const labels = option => option.series.filter(series => series.name.endsWith(' weekly labels'));

for (const isCompact of [true, false]) {
  test(`shared ${isCompact ? 'mobile' : 'desktop'} chart retains exact close/tied values on one scale`, () => {
    const players = [player('A', 'RB', [15, 10, 0, -2, 40]), player('B', 'RB', [15, 10.1, 0, -2, 45])];
    const option = options(players, { isCompact });
    assert.equal(lines(option).length, 2);
    assert.ok(!Array.isArray(option.xAxis) && !Array.isArray(option.yAxis));
    assert.deepEqual(option.xAxis.data, weeks.map(week => `wk${week}`));
    assert.ok(option.yAxis.min < -2 && option.yAxis.max > 45);
    lines(option).forEach((series, index) => {
      assert.deepEqual(series.data.map(point => point.value), players[index].weeklySeries.map(entry => entry.stats.fpts));
      assert.deepEqual(series.data.map(point => point.rawValue), series.data.map(point => point.value));
      assert.ok(series.lineStyle.width < (isCompact ? 2.55 : 2.95));
      assert.ok(series.lineStyle.shadowBlur < (isCompact ? 7 : 11));
      assert.ok(series.emphasis.lineStyle.width < (isCompact ? 3.2 : 3.8));
    });
    assert.deepEqual(labels(option).map(series => series.data[0].label.position), ['top', 'bottom']);
    assert.notDeepEqual(lines(option)[0].data[0].symbolOffset, lines(option)[1].data[0].symbolOffset);
    option.series.filter(series => series.name.endsWith(' played week logos')).forEach((series, index) => {
      assert.deepEqual(series.data.map(point => point.value[1]), lines(option)[index].data.map(point => point.value));
    });
  });
}

test('zero and negative results stay distinct from skipped, blank, and missing weeks', () => {
  const a = player('A', 'WR', [0, -1, 100, '', null]);
  a.weeklySeries[2] = { ...a.weeklySeries[2], isSkipped: true, skipLabel: 'BYE' };
  const b = player('B', 'WR', [0, -1, 12]);
  const option = options([a, b]);
  assert.deepEqual(lines(option)[0].data.map(point => point.value), [0, -1, null, null, null]);
  assert.deepEqual(lines(option)[1].data.map(point => point.value), [0, -1, 12, null, null]);
  assert.deepEqual(labels(option)[0].data.map(point => point.rawValue), [0, -1]);
  const skip = option.series.find(series => series.name === 'Player A skipped week labels');
  assert.equal(skip.data[0].skipLabel, 'BYE');
  assert.equal(skip.data[0].value[0], 'wk3');
  assert.ok(!lines(option)[0].data.some(point => point.value === 100));
});

test('inverted lower-is-better axes separate labels without changing values or direction', () => {
  const players = [player('A', 'QB', [2, 3, 4]), player('B', 'QB', [2, 3.01, 5])];
  const option = options(players, { statKey: 'ttt' });
  assert.equal(option.yAxis.inverse, true);
  assert.deepEqual(lines(option).map(series => series.data[0].value), [2, 2]);
  assert.deepEqual(labels(option).map(series => series.data[0].label.position), ['bottom', 'top']);
  assert.deepEqual(lines(option).map(series => series.areaStyle.origin), ['end', 'end']);
});

test('shared chart retains the approved WR/RB palettes without changing season palettes', () => {
  const expected = {
    QB: COMPARISON_GRADIENT_PALETTES.QB,
    TE: COMPARISON_GRADIENT_PALETTES.TE,
    RB: [COMPARISON_GRADIENT_PALETTES.RB[0], COMPARISON_GRADIENT_PALETTES.WR[1]],
    WR: [COMPARISON_GRADIENT_PALETTES.WR[1], COMPARISON_GRADIENT_PALETTES.RB[0]],
  };
  for (const pos of ['QB', 'RB', 'WR', 'TE']) {
    const players = [player('A', pos, [1, 10, 25, 35]), player('B', pos, [2, 15, 30, 40])];
    const option = options(players);
    lines(option).forEach((series, index) => {
      assert.deepEqual(getWeeklyPlayerPalette(players[index], index), expected[pos][index]);
      assert.deepEqual(new Set(series.lineStyle.color.colorStops.map(stop => stop.color)), new Set(Object.values(expected[pos][index])));
      assert.equal(series.areaStyle.color.colorStops.at(-1).color.endsWith(', 0)'), true);
      assert.deepEqual(getPlayerPalette(players[index], index), COMPARISON_GRADIENT_PALETTES[pos][index]);
    });
  }
});

test('mixed-position and single-player charts use each position\'s first weekly palette', () => {
  for (const positions of [['RB', 'WR'], ['WR', 'RB'], ['QB', 'TE'], ['RB'], ['WR']]) {
    const players = positions.map((pos, index) => player(String(index), pos, [15, 20]));
    const option = options(players, { thresholds: {} });
    assert.deepEqual(lines(option).map(series => series.lineStyle.color), players.map(p => getWeeklyPlayerPalette(p, 0).high));
    assert.deepEqual(lines(option).map(series => series.data[0].value), positions.map(() => 15));
  }
});

test('one week tooltip contains exactly one original result per player, including skipped weeks', () => {
  const players = [player('A', 'WR', [0, 10]), player('B', 'WR', [-1, null])];
  players[1].weeklySeries[1] = { ...players[1].weeklySeries[1], skipped: true, skipLabel: 'OUT' };
  const option = options(players);
  const tooltip = option.tooltip.formatter([
    { axisValue: 'wk1', seriesName: 'Player A' },
    { axisValue: 'wk1', seriesName: 'Player A weekly labels' },
    { axisValue: 'wk1', seriesName: 'Player B' },
  ]);
  assert.equal(tooltip.match(/Player A/g).length, 1);
  assert.equal(tooltip.match(/Player B/g).length, 1);
  assert.match(tooltip, />0\.0 pts<\/strong>/);
  assert.match(tooltip, />-1\.0 pts<\/strong>/);
  assert.match(option.tooltip.formatter([{ axisValue: 'wk2' }]), />OUT<\/strong>/);
});
