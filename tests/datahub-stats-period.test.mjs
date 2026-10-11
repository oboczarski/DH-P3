import test from 'node:test';
import assert from 'node:assert/strict';
import { getDataHubStatsPeriodOptions, getDataHubWeeklyTableSourceRows } from '../DH_P2.53/scripts/datahub-stats-period.js';
import { buildStatsPositionalRanks } from '../DH_P2.53/scripts/datahub-stats-positional-ranks.js';

const player = (values = {}) => ({ SLPR_ID: '100', POS: 'WR', 'PLAYER NAME': 'Weekly Player', GM_P: '1', ...values });

test('period choices sort completed weeks, exclude projection-only weeks, and separate 2025', () => {
  const options = getDataHubStatsPeriodOptions({
    4: [player({ FPT_PPR: '0', RR: '20' })], 1: [player()], 3: [player({ FPT_PPR: '-2' })],
    5: [player({ GM_P: '0', PROJ: '20', FPT_PPR: '0' })], 18: [player()],
    19: [player()], 2: [{ SLPR_ID: 'invalid', POS: 'WR', GM_P: '1' }],
  });
  assert.deepEqual(options.map(({ label }) => label), ['2026 Season', '2026 WK·1', '2026 WK·3', '2026 WK·4', '2026 WK·18', '2025 Season']);
  assert.equal(options[0].value, '2026');
  assert.equal(options.at(-1).divider, true);
  assert.ok(options.every(({ season, week }) => season === '2026' || week === null));
  assert.deepEqual(getDataHubStatsPeriodOptions().map(({ label }) => label), ['2026 Season', '2025 Season']);
});

test('weekly rows retain only that week, identity, zero and unavailable cells without mutating CSV', () => {
  const first = player({ FPT_PPR: '0', recAY: '42', TDS: '-', RR: '15', SZN: '1' });
  const second = player({ FPT_PPR: '30', recAY: '88', SZN: '2' });
  const weekly = { 1: [first], 2: [second] };
  const rows = getDataHubWeeklyTableSourceRows(weekly, 1);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].FPT_PPR, '0');
  assert.equal(rows[0].G, '1');
  assert.equal(rows[0].NM, 'Weekly Player');
  assert.equal(rows[0].AY, '42');
  assert.equal(rows[0].TDS, '-');
  assert.equal(first.AY, undefined);
  assert.equal(first.G, undefined);
  assert.deepEqual(getDataHubWeeklyTableSourceRows(weekly, 3), []);
});

test('weekly ranks use one-week qualification and never inherit a different week or season pool', () => {
  const ordinary = { POS: 'WR', RR: '13', recYDS: '70', G: '1', FPTS: '12' };
  const scorer = { POS: 'WR', RR: '10', recYDS: '80', G: '1', FPTS: '20' };
  const lowVolume = { POS: 'WR', RR: '12', recYDS: '90', G: '1', FPTS: '19' };
  const ranks = buildStatsPositionalRanks([ordinary, scorer, lowVolume], ['recYDS'], '2026', 1, 1);
  assert.equal(ranks.get(scorer).recYDS, 1);
  assert.equal(ranks.get(ordinary).recYDS, 2);
  assert.equal(ranks.get(lowVolume), undefined);
  const seasonRanks = buildStatsPositionalRanks([ordinary, scorer, lowVolume], ['recYDS'], '2026', 4, 4);
  assert.equal(seasonRanks.get(ordinary), undefined);
  assert.equal(seasonRanks.get(scorer), undefined);
});
