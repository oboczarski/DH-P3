import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { isStatsPpgRankQualified, isStatsSeasonRankQualified } from '../DH_P2.53/scripts/datahub-stats-positional-ranks.js';

const sources = Object.fromEntries(['app', 'DataHub'].map(page => [page,
  fs.readFileSync(new URL(`../DH_P2.53/scripts/${page}.js`, import.meta.url), 'utf8')]));
function functionSource(page, name) {
  const source = sources[page], start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}

test('Rosters historical stat ranks use fixed 2025 volumes while PPG uses games alone', () => {
  const context = vm.createContext({});
  vm.runInContext(['isRostersGameLogsRankQualified', 'isRostersGameLogsPpgRankQualified', 'buildRostersHistoricalModalRanks']
    .map(name => functionSource('app', name)).join('\n'), context);
  for (const [pos, stat, minimum] of [['QB', 'pass_att', 200], ['RB', 'rush_att', 100], ['WR', 'rr', 220], ['TE', 'rr', 220]]) {
    const stats = { boundary: { pos, [stat]: minimum, games_played: 2, fpts_ppr: 100, ppg: 50 },
      below: { pos, [stat]: minimum - 1, games_played: 3, fpts_ppr: 30, ppg: 10 },
      zero: { pos, [stat]: 0, games_played: 3, fpts_ppr: 0, ppg: 0 },
      negative: { pos, [stat]: 0, games_played: 3, fpts_ppr: -3, ppg: -1 } };
    const ranks = context.buildRostersHistoricalModalRanks(stats, 18);
    assert.equal(ranks.boundary[stat], 1);
    assert.equal(ranks.below[stat], undefined);
    assert.equal(ranks.boundary.ppg, undefined);
    assert.equal(ranks.below.ppg, 1);
    assert.equal(ranks.zero.ppg, 2);
    assert.equal(ranks.negative.ppg, 3);
    assert.equal(ranks.boundary.fpts_ppr, 1);
  }
});

test('DataHub summary and Compare rank PPG by three recorded games, independently of other rank pools', () => {
  const context = vm.createContext({ isStatsPpgRankQualified,
    toComparableNumber: value => value == null ? null : Number(value),
    isDataHubComparisonLowerBetter: () => false });
  vm.runInContext(['assignDataHubComparisonRanks', 'computeDataHubComparisonSeasonRankSets']
    .map(name => functionSource('DataHub', name)).join('\n'), context);
  const players = ['QB', 'RB', 'WR', 'TE'].flatMap(pos => [
    { id: `${pos}-short`, pos, seasonStats: { games_played: 2, ppg: 50, fpts: 100, rec_yd: 100 } },
    { id: `${pos}-eligible`, pos, seasonStats: { games_played: 3, ppg: 10, fpts: 30, rec_yd: 30 } },
    { id: `${pos}-zero`, pos, seasonStats: { games_played: 3, ppg: 0, fpts: 0, rec_yd: 0 } },
    { id: `${pos}-negative`, pos, seasonStats: { games_played: 3, ppg: -1, fpts: -3, rec_yd: 0 } },
  ]);
  const qualified = new Set(players.filter(player => player.id.endsWith('-short')).map(player => player.id));
  const ranks = context.computeDataHubComparisonSeasonRankSets(players, qualified);
  context.getDataHubGameLogsQualifiedIds = () => qualified;
  vm.runInContext(functionSource('DataHub', 'buildDataHubModalRankCache'), context);
  const modal = context.buildDataHubModalRankCache(players.map(player => ({ POS: player.pos,
    __meta: { playerId: player.id, gmPlayed: player.seasonStats.games_played,
      fpts: player.seasonStats.fpts, ppg: player.seasonStats.ppg } })), '2026');
  for (const pos of ['QB', 'RB', 'WR', 'TE']) {
    assert.equal(ranks.positional[`${pos}-short`].ppg, undefined);
    assert.equal(ranks.overall[`${pos}-short`].ppg, undefined);
    assert.equal(ranks.positional[`${pos}-eligible`].ppg, 1);
    assert.equal(ranks.positional[`${pos}-eligible`].rec_yd, undefined);
    assert.equal(ranks.overall[`${pos}-eligible`].ppg, 1);
    assert.equal(ranks.positional[`${pos}-zero`].ppg, 2);
    assert.equal(ranks.positional[`${pos}-negative`].ppg, 3);
    assert.equal(ranks.positional[`${pos}-short`].fpts, 1);
    assert.equal(modal[`${pos}-eligible`].ppgPosRank, 1, 'modal metadata carries the recorded games into its rank builder');
    assert.equal(modal[`${pos}-short`].ppgPosRank, undefined);
  }
});

for (const page of ['app', 'DataHub']) {
  test(`${page}: Career rebuilds PPG ranks in every year without changing values or FPTS ranks`, () => {
    const rosters = page === 'app';
    const numberName = rosters ? 'getCareerNumber' : 'getDataHubCareerNumber';
    const assignName = rosters ? 'assignCareerPpgRanks' : 'assignDataHubCareerPpgRanks';
    const context = vm.createContext({ isStatsPpgRankQualified });
    vm.runInContext([numberName, ...(rosters ? ['isRostersGameLogsPpgRankQualified'] : []), assignName]
      .map(name => functionSource(page, name)).join('\n'), context);
    const rows = ['2020', '2025', '2026'].flatMap(SZN => ['QB', 'RB', 'WR', 'TE'].flatMap(POS => [
      { SZN, POS, SLPR_ID: `${SZN}-${POS}-short`, G: '2', FPTS: '100', PPG: '50', 'PPG RK': '1', 'PPG POS RK': `${POS}·1`, 'FPTS POS RK': `${POS}·1` },
      { SZN, POS, SLPR_ID: `${SZN}-${POS}-eligible`, G: '3', FPTS: '30', PPG: '10', 'FPTS POS RK': `${POS}·2` },
      { SZN, POS, SLPR_ID: `${SZN}-${POS}-tie`, G: '4', FPTS: '40', PPG: '10', 'FPTS POS RK': `${POS}·3` },
      { SZN, POS, SLPR_ID: `${SZN}-${POS}-negative`, G: '3', FPTS: '-3', PPG: '-1', 'FPTS POS RK': `${POS}·4` },
    ]));
    const before = structuredClone(rows);
    context[assignName](rows);
    rows.forEach((row, index) => {
      const short = row.SLPR_ID.endsWith('-short'), negative = row.SLPR_ID.endsWith('-negative');
      assert.equal(row['PPG POS RK'], short ? '-' : `${row.POS}·${negative ? 3 : 1}`);
      assert.equal(row['PPG RK'], short ? '-' : negative ? '9' : '1');
      assert.equal(row.PPG, before[index].PPG);
      assert.equal(row.FPTS, before[index].FPTS);
      assert.equal(row['FPTS POS RK'], before[index]['FPTS POS RK']);
    });
  });
}

test('other stats retain the half-season scoring exception and 2025 fixed thresholds', () => {
  const context = vm.createContext({});
  vm.runInContext(functionSource('app', 'isRostersGameLogsRankQualified'), context);
  for (const [pos, header, key, rate] of [['QB', 'paATT', 'pass_att', 15], ['RB', 'CAR', 'rush_att', 4], ['WR', 'RR', 'rr', 12], ['TE', 'RR', 'rr', 12]]) {
    for (const weeks of [1, 7, 18]) {
      const minimum = rate * weeks;
      assert.equal(isStatsSeasonRankQualified({ POS: pos, [header]: minimum }, '2026', weeks, weeks), true);
      assert.equal(isStatsSeasonRankQualified({ POS: pos, [header]: minimum - 1 }, '2026', weeks, weeks), false);
      assert.equal(context.isRostersGameLogsRankQualified({ [key]: minimum }, pos, '2026', weeks, weeks), true);
      assert.equal(context.isRostersGameLogsRankQualified({ [key]: minimum - 1 }, pos, '2026', weeks, weeks), false);
    }
    assert.equal(isStatsSeasonRankQualified({ POS: pos, G: 4, FPTS: 80 }, '2026', 7, 7), true);
    assert.equal(context.isRostersGameLogsRankQualified({ games_played: 4, fpts_ppr: 80 }, pos, '2026', 7, 7), true);
  }
});
