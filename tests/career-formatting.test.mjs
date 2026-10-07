import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { isStatsSeasonRankQualified } from '../DH_P2.53/scripts/datahub-stats-positional-ranks.js';

// Run each page's shipped Career ranking/formatting code independently. The
// regressions vary season/stat pool sizes and ties that broke percentile tiers.
function harness(page) {
  const datahub = page === 'datahub';
  const prefix = datahub ? 'DATAHUB_CAREER' : 'CAREER';
  const source = fs.readFileSync(new URL(`../DH_P2.53/scripts/${datahub ? 'DataHub.js' : 'app.js'}`, import.meta.url), 'utf8');
  const declaration = name => {
    const match = source.match(new RegExp(`^const ${name} = .+;$`, 'm'));
    assert.ok(match, name);
    return match[0];
  };
  const functionSource = name => {
    const start = source.indexOf(`function ${name}(`);
    assert.ok(start >= 0, name);
    return source.slice(start, source.indexOf('\n}', start) + 2);
  };
  const names = datahub
    ? ['getDataHubCareerSectionsForPosition', 'getDataHubCareerNumber', 'getDataHubCareerStatNumber',
      'assignDataHubCareerPositionalRanks', 'getDataHubCareerFormattingTier', 'assignDataHubCareerFormatting']
    : ['getCareerSectionsForPosition', 'getCareerNumber', 'getCareerStatNumber',
      'isRostersGameLogsRankQualified', 'assignCareerPositionalRanks', 'getCareerFormattingTier', 'assignCareerFormatting'];
  const sections = datahub
    ? source.slice(source.indexOf('const DATAHUB_CAREER_WR_TE_SECTIONS ='), source.indexOf('const DATAHUB_STATS_KEY_SECTIONS ='))
    : source.slice(source.indexOf('const CAREER_STAT_SECTIONS_BY_POS ='), source.indexOf('const PLAYER_STATS_SOURCE_QUERY_PARAM ='));
  const context = vm.createContext({ isStatsSeasonRankQualified });
  vm.runInContext([
    ...['ADVANCED_STATS', 'PER_GAME_TOTALS', 'FORMATTING_RANK_CUTOFFS', 'FORMATTING_WR_RANK_CUTOFFS']
      .map(suffix => declaration(`${prefix}_${suffix}`)),
    sections, ...names.map(functionSource),
  ].join('\n'), context);
  const rank = datahub ? context.assignDataHubCareerPositionalRanks : context.assignCareerPositionalRanks;
  const format = datahub ? context.assignDataHubCareerFormatting : context.assignCareerFormatting;
  return { tier: datahub ? context.getDataHubCareerFormattingTier : context.getCareerFormattingTier,
    prepare(rows) { rank(rows); format(rows); return rows; } };
}

for (const page of ['datahub', 'rosters']) {
  test(`${page}: inclusive positional-rank boundaries match all six tiers`, () => {
    const { tier } = harness(page);
    for (const position of ['QB', 'RB', 'TE']) {
      for (const [rank, expected] of [[1, 5], [6, 5], [7, 4], [12, 4], [13, 3], [18, 3],
        [19, 2], [24, 2], [25, 1], [36, 1], [37, 0], [160, 0], [161, 0]]) {
        assert.equal(tier(rank, position), expected, `${position}${rank}`);
      }
    }
    for (const [rank, expected] of [[1, 5], [12, 5], [13, 4], [24, 4], [25, 3], [36, 3],
      [37, 2], [48, 2], [49, 1], [60, 1], [61, 0], [160, 0], [161, 0]]) {
      assert.equal(tier(rank, 'WR'), expected, `WR${rank}`);
    }
    for (const rank of [null, undefined, '', 'NA', 0, -1, 1.5, NaN, Infinity]) {
      assert.equal(tier(rank, 'QB'), null, 'unavailable ranks stay unformatted');
    }
    assert.equal(tier(1, 'K'), null);
  });

  test(`${page}: QB16 gets tier 3 across years and stats with different pool sizes`, () => {
    const api = harness(page);
    const rows = api.prepare([['2019', 20], ['2020', 65]].flatMap(([season, count]) =>
      Array.from({ length: count }, (_, i) => ({ SLPR_ID: `${season}-${i}`, SZN: season, POS: 'QB', G: '16',
        CMP: String(1000 - i), CAR: i < 20 ? String(100 - i) : 'NA',
        'FPTS POS RK': 'QB·16', FPTS: '300', PPG: '18.75' }))));
    for (const season of ['2019', '2020']) {
      const row = rows.find(row => row.SZN === season && row.SLPR_ID.endsWith('-15'));
      for (const stat of ['CMP', 'CAR']) {
        assert.equal(row.__careerPositionalRanks[stat], 16);
        assert.equal(row.__careerFormattingTiers[stat], 3);
      }
      assert.equal(row['FPTS POS RK'], 'QB·16');
      assert.equal(row.FPTS, '300');
      assert.equal(row.PPG, '18.75');
      assert.equal(row.__careerFormattingTiers.FPTS, undefined);
      assert.equal(row.__careerFormattingTiers.PPG, undefined);
    }
    const worst = rows.find(row => row.SLPR_ID === '2020-64');
    assert.equal(worst.__careerFormattingTiers.CMP, 0);
    assert.equal(worst.__careerFormattingTiers.CAR, undefined);
  });

  test(`${page}: WR and TE use different intervals despite sharing receiving sections`, () => {
    const rows = harness(page).prepare(['WR', 'TE'].flatMap(position =>
      Array.from({ length: 65 }, (_, i) => ({ SLPR_ID: `${position}-${i}`, SZN: '2020', POS: position,
        G: '16', REC: String(100 - i) }))));
    for (const [position, rank, expected] of [['WR', 16, 4], ['TE', 16, 3], ['WR', 37, 2],
      ['TE', 37, 0], ['WR', 60, 1], ['WR', 61, 0]]) {
      const row = rows.find(row => row.SLPR_ID === `${position}-${rank - 1}`);
      assert.equal(row.__careerPositionalRanks.REC, rank);
      assert.equal(row.__careerFormattingTiers.REC, expected);
    }
  });

  test(`${page}: tied zero stats use their displayed rank, without a flat-pool fallback`, () => {
    const rows = harness(page).prepare(Array.from({ length: 45 }, (_, i) => ({
      SLPR_ID: String(i), SZN: '2020', POS: 'RB', G: '16', ruTD: '0', ttlTD: '0', recTD: '0',
    })));
    for (const row of rows) {
      for (const stat of ['ruTD', 'ttlTD', 'recTD']) {
        assert.equal(row.__careerPositionalRanks[stat], 1);
        assert.equal(row.__careerFormattingTiers[stat], 5);
      }
    }
  });

  test(`${page}: interceptions use the existing lower-is-better rank once`, () => {
    const rows = harness(page).prepare(Array.from({ length: 37 }, (_, i) => ({
      SLPR_ID: String(i), SZN: '2020', POS: 'QB', G: '16', INT: String(i),
    })));
    for (const [index, expected] of [[0, 5], [5, 5], [6, 4], [15, 3], [23, 2], [35, 1], [36, 0]]) {
      assert.equal(rows[index].__careerPositionalRanks.INT, index + 1);
      assert.equal(rows[index].__careerFormattingTiers.INT, expected);
    }
  });

  test(`${page}: qualification and missing/unsupported historical stats remain unformatted`, () => {
    const rows = harness(page).prepare([
      { SLPR_ID: 'qualified', SZN: '2025', POS: 'QB', G: '17', paATT: '300', CMP: '0' },
      { SLPR_ID: 'unqualified', SZN: '2025', POS: 'QB', G: '17', paATT: '1', CMP: '500' },
      { SLPR_ID: 'no-games', SZN: '2025', POS: 'QB', G: '0', paATT: '300', CMP: '500' },
      { SLPR_ID: 'historical', SZN: '2024', POS: 'QB', G: '17', CPOE: '4', CMP: 'NA' },
    ]);
    assert.equal(rows[0].__careerPositionalRanks.CMP, 1);
    assert.equal(rows[0].__careerFormattingTiers.CMP, 5);
    assert.equal(rows[0].__careerFormattingTiers.paTD, undefined);
    for (const row of rows.slice(1)) {
      assert.deepEqual(Object.keys(row.__careerFormattingTiers), []);
    }
  });
}
