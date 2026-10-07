import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { buildStatsPositionalRanks } from '../DH_P2.53/scripts/datahub-stats-positional-ranks.js';
import { getStatLabel } from '../DH_P2.53/scripts/datahub-comparison/comparisonStats.js';
import { DATAHUB_STAT_SECTIONS } from '../DH_P2.53/scripts/datahub-stats-help.js';

const datahub = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const rosters = fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-gamelogs.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../DH_P2.53/scripts/app.js', import.meta.url), 'utf8');
const shares = ['TDS%', 'YS%', 'ruTDS%', 'ruYS%', 'recTDS%', 'recYS%'];
const oldShares = ['TMS', 'YMS', 'ruTMS', 'ruYMS', 'recTMS', 'recYMS'];
const keys = ['tds_pct', 'ys_pct', 'rush_tms', 'rush_yms', 'rec_tms', 'rec_yms'];

// Run the real page-local parser/formatter bodies against source rows, without
// requiring a live workbook that may be midway through its header migration.
function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}

function objectSource(source, name) {
  const start = source.indexOf(`const ${name} = {`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n};', start) + 3);
}

function datahubHarness() {
  const context = vm.createContext({
    ALL_COLUMNS: ['POS', 'G', 'RR', ...shares, 'RECS%', 'TD(t)'],
    BLANK_PLACEHOLDER_COLUMNS: new Set(),
    SOURCE_ALIASES: {},
    FPTS_COLUMN: 'FPTS',
    isDataHubRookiesView: () => false,
    buildDataHubRowMeta: () => ({}),
  });
  const names = [
    'normalizeSheetHeader', 'parseDataHubStatValue', 'normalizeRow', 'sanitizeValue',
    'toComparableNumber', 'isMissingValue', 'formatDisplayValue', 'formatCellValue',
    'formatDataHubPercentage', 'parseDataHubSeasonStatsRows', 'parseDataHubWeeklyStatsRows',
    'parseDataHubSeasonRanksRows', 'getDataHubGamesPlayedValue', 'computePpgValue', 'buildDataHubStatLabels',
  ];
  vm.runInContext([
    objectSource(datahub, 'DATAHUB_PLAYER_STAT_HEADER_MAP'),
    objectSource(datahub, 'DATAHUB_WEEKLY_META_HEADER_MAP'),
    ...names.map((name) => functionSource(datahub, name)),
  ].join('\n'), context);
  return context;
}

test('DataHub accepts renamed and historical shares with stable values, ranks and labels', () => {
  const api = datahubHarness();
  for (const headers of [shares, oldShares]) {
    const row = { SLPR_ID: '1', POS: 'WR', TM: 'BUF', GM_P: '1', FPT_PPR: '10' };
    headers.forEach((header) => { row[header] = '12.5%'; });
    const season = api.parseDataHubSeasonStatsRows([row])['1'];
    const weekly = api.parseDataHubWeeklyStatsRows([row])['1'];
    const rankRow = { SLPR_ID: '1' };
    headers.forEach((header) => { rankRow[header] = '2'; });
    const ranks = api.parseDataHubSeasonRanksRows([rankRow])['1'];
    const labels = api.buildDataHubStatLabels();
    keys.forEach((key, index) => {
      assert.equal(season[key], 12.5);
      assert.equal(weekly[key], 12.5);
      assert.equal(ranks[key], 2, 'ranks must not be multiplied like percentage values');
      assert.equal(labels[key], shares[index]);
    });
  }
});

test('table shares normalize once, retain zero/missing distinctions, and rank in consistent units', () => {
  const api = datahubHarness();
  const rows = ['1%', '0.01', '12.5', '0', 'NA', undefined].map((value) =>
    api.normalizeRow({ POS: 'WR', RR: '20', G: '1', 'TDS%': value }));
  assert.deepEqual(rows.map((row) => row['TDS%']), ['1', '1', '12.5', '0', 'NA', 'NA']);
  assert.deepEqual(rows.map((row) => api.formatDisplayValue('TDS%', row['TDS%'])),
    ['1.0%', '1.0%', '12.5%', '0.0%', 'NA', 'NA']);
  const ranks = buildStatsPositionalRanks(rows, ['TDS%'], '2026', 1);
  assert.deepEqual(rows.map((row) => ranks.get(row)?.['TDS%']), [2, 2, 1, 4, undefined, undefined]);
});

test('renamed unavailable cells cannot be overwritten by a legacy share column', () => {
  const api = datahubHarness();
  const row = { SLPR_ID: '1', POS: 'WR', 'recYS%': 'NA', recYMS: '50%' };
  assert.equal(api.normalizeRow(row)['recYS%'], 'NA');
  assert.equal(api.parseDataHubSeasonStatsRows([row])['1'].rec_yms, undefined);
  assert.equal(api.parseDataHubWeeklyStatsRows([row])['1'].rec_yms, undefined);
});

test('RECS% reads its own source percentage, preserves missing values, and supports positional ranks', () => {
  const api = datahubHarness();
  const rows = ['18.8%', '0.188', '1%', '0', 'NA', undefined].map((value) =>
    api.normalizeRow({ POS: 'WR', RR: '20', G: '1', 'RECS%': value, 'TS%': '90%', REC: '50' }));
  assert.deepEqual(rows.map((row) => row['RECS%']), ['18.8', '18.8', '1', '0', 'NA', 'NA']);
  assert.deepEqual(rows.map((row) => api.formatDisplayValue('RECS%', row['RECS%'])),
    ['18.8%', '18.8%', '1.0%', '0.0%', 'NA', 'NA']);
  const ranks = buildStatsPositionalRanks(rows, ['RECS%'], '2026', 1);
  assert.deepEqual(rows.map((row) => ranks.get(row)?.['RECS%']), [1, 1, 3, 4, undefined, undefined]);
  const sourceRow = { SLPR_ID: '1', POS: 'WR', 'RECS%': '18.8%' };
  assert.equal(api.parseDataHubSeasonStatsRows([sourceRow])['1'].recs_pct, 18.8);
  assert.equal(api.parseDataHubWeeklyStatsRows([sourceRow])['1'].recs_pct, 18.8);
  assert.equal(api.parseDataHubSeasonRanksRows([{ SLPR_ID: '1', 'RECS%': '2' }])['1'].recs_pct, 2);
  assert.equal(api.buildDataHubStatLabels().recs_pct, 'RECS%');
});

test('W/T places RECS% immediately before recYS% and documents Receptions Market Share', () => {
  const start = datahub.indexOf('const STATS_RECEIVING_GROUP_COLUMNS_2026 = Object.freeze({');
  const end = datahub.indexOf('\n});', start) + 4;
  const context = vm.createContext({});
  vm.runInContext(`${datahub.slice(start, end)}\ncolumns = STATS_RECEIVING_GROUP_COLUMNS_2026["RECEIVING EFFICIENCY"];`, context);
  assert.deepEqual(Array.from(context.columns.slice(-4)), ['REC/G', 'RECS%', 'recYS%', 'recTDS%']);
  const definition = DATAHUB_STAT_SECTIONS.flatMap((section) => section.items).find((item) => item.abbr === 'RECS%');
  assert.equal(definition.name, 'Receptions Market Share');
  assert.equal(definition.note, 'Percentage of team receptions.');
  assert.ok(definition.aliases.includes('recs_pct'));
});

test('TD(t) uses the published total, retains zero and missing values, and supports positional ranks', () => {
  const api = datahubHarness();
  const rows = ['13', '0', 'NA', undefined].map((value) =>
    api.normalizeRow({ POS: 'QB', G: '1', 'TD(t)': value, tTD: '99', paTD: '6', ruTD: '7' }));
  assert.deepEqual(rows.map((row) => row['TD(t)']), ['13', '0', 'NA', 'NA']);
  assert.deepEqual(rows.map((row) => api.formatDisplayValue('TD(t)', row['TD(t)'])), ['13', '0', 'NA', 'NA']);
  const stats = api.parseDataHubSeasonStatsRows([{ SLPR_ID: '1', POS: 'QB', 'TD(t)': '13' }])['1'];
  assert.equal(stats.td_total, 13);
  const ranked = [
    { POS: 'QB', paATT: '30', 'TD(t)': '13' },
    { POS: 'QB', paATT: '30', 'TD(t)': '0' },
    { POS: 'QB', paATT: '30', 'TD(t)': 'NA' },
  ];
  const ranks = buildStatsPositionalRanks(ranked, ['TD(t)'], '2026', 1);
  assert.deepEqual(ranked.map((row) => ranks.get(row)?.['TD(t)']), [1, 2, undefined]);
  assert.equal(DATAHUB_STAT_SECTIONS.flatMap((section) => section.items).find((item) => item.abbr === 'TD(t)').name, 'Total Touchdowns');
});

test('Stats total/share placements agree with group spans in base and current-season schemas', () => {
  const start = datahub.indexOf('const BASE_COLUMN_GROUPS = Object.freeze({');
  const end = datahub.indexOf('\nfunction createRookiesDraftGroup(', start);
  const declarations = datahub.slice(start, end);
  const builderStart = datahub.indexOf('function createDataHubColumnGroup(');
  const groupBuilder = datahub.slice(builderStart, datahub.indexOf('\nconst FROZEN_GROUPS', builderStart));
  // Only presentation metadata is mocked; execute the real group builder and
  // column derivation so a missing body column or wrong span fails this check.
  const metadata = Object.fromEntries([...new Set(declarations.match(/\b[A-Z][A-Z0-9_]+\b/g))].map((name) => [name, {}]));
  const context = vm.createContext(metadata);
  vm.runInContext([
    groupBuilder,
    declarations,
    objectSource(datahub, 'STATS_COLUMN_SETS'),
    'sets = STATS_COLUMN_SETS; groups = BASE_COLUMN_GROUPS;',
    'current = { passing: STATS_PASSING_COLUMNS_2026, rushing: STATS_RUSHING_COLUMNS_2026, receiving: STATS_RECEIVING_COLUMNS_2026 };',
    'currentGroups = { passing: STATS_PASSING_COLUMN_GROUPS_2026, rushing: STATS_RUSHING_COLUMN_GROUPS_2026, receiving: STATS_RECEIVING_COLUMN_GROUPS_2026 };',
  ].join('\n'), context);
  for (const category of ['overview', 'passing', 'rushing', 'receiving']) {
    assert.deepEqual(Array.from(context.sets[category].slice(3)), Array.from(context.groups[category]).flatMap((group) => Array.from(group.columns)));
    const group = context.groups[category].find((entry) => entry.label === (category === 'overview' ? 'OVERVIEW STATS' : 'GENERAL PROD. & EFF.'));
    const columns = Array.from(group.columns);
    assert.equal(columns[columns.indexOf(category === 'overview' ? 'YPG(t)' : 'YDS(t)') + 1], 'TD(t)');
    assert.equal(columns.at(-1), 'TDS%');
    assert.equal(context.sets[category].filter((column) => column === 'TD(t)').length, 1);
    assert.equal(context.sets[category].filter((column) => column === 'TDS%').length, 1);
    if (category !== 'overview') {
      assert.deepEqual(Array.from(context.current[category].slice(3)), Array.from(context.currentGroups[category]).flatMap((entry) => Array.from(entry.columns)));
      assert.deepEqual(Array.from(context.currentGroups[category].find((entry) => entry.label === 'GENERAL PROD. & EFF.').columns), columns);
    }
  }
});

test('total touchdowns reuse ruTD geometry and every Stats category resolves the TDS% glyph', () => {
  const start = datahub.indexOf('const STATS_COLUMN_ICON_OVERRIDES = Object.freeze({');
  const iconOverrides = datahub.slice(start, datahub.indexOf('\n});', start) + 4);
  const icons = objectSource(datahub, 'COLUMN_ICONS');
  const constants = datahub.match(/^const RUTD_HEADER_ICON_MARKUP = .*;$/m)[0];
  const metadata = Object.fromEntries([...new Set(`${icons}\n${iconOverrides}`.match(/\b[A-Z][A-Z0-9_]+\b/g))].map((name) => [name, {}]));
  const context = vm.createContext({
    ...metadata,
    state: { activePageView: 'stats', activeCategory: 'overview' },
    is2026ReceivingStatsView: () => false,
    isDataHubRookiesView: () => false,
  });
  vm.runInContext(`${constants}\n${icons}\n${iconOverrides}\n${functionSource(datahub, 'getActiveColumnIconMarkup')}`, context);
  for (const category of ['overview', 'passing', 'rushing', 'receiving']) {
    context.state.activeCategory = category;
    assert.equal(context.getActiveColumnIconMarkup('TD(t)'), context.getActiveColumnIconMarkup('ruTD'));
    const glyph = context.getActiveColumnIconMarkup('TDS%');
    assert.equal(typeof glyph, 'string');
    assert.ok(glyph.startsWith('<path'));
  }
});

test('shared CSV parser and labels use the same renamed share contract', () => {
  const context = vm.createContext({ pageType: 'stats', state: {} });
  vm.runInContext([
    objectSource(app, 'PLAYER_STAT_HEADER_MAP'),
    ...['normalizeHeader', 'parseStatValue', 'buildStatLabels'].map((name) => functionSource(app, name)),
  ].join('\n'), context);
  const labels = context.buildStatLabels();
  keys.forEach((key, index) => {
    assert.equal(labels[key], shares[index]);
    assert.equal(context.normalizeHeader(oldShares[index]), shares[index]);
    assert.equal(context.parseStatValue(shares[index], '0.125'), 12.5);
    assert.equal(context.parseStatValue(shares[index], '0'), 0);
    assert.equal(context.parseStatValue(shares[index], 'NA'), null);
  });
});

test('Overview appends touchdown share before ceiling while glossary and radars use new labels', () => {
  const context = vm.createContext({});
  vm.runInContext(`${objectSource(datahub, 'STATS_COLUMN_SETS')}\ncolumns = STATS_COLUMN_SETS.overview;`, context);
  assert.deepEqual(Array.from(context.columns.slice(-5)), ['IMP/OPP', 'TDS%', 'FPOE', 'CSTY%', 'CL']);
  const glossary = DATAHUB_STAT_SECTIONS.flatMap((section) => section.items);
  shares.forEach((label) => assert.ok(glossary.some((item) => item.abbr === label)));
  assert.ok(glossary.every((item) => !oldShares.includes(item.abbr)));
  assert.equal(getStatLabel('rec_yms'), 'recYS%');
  for (const [source, name] of [[datahub, 'DATAHUB_RADAR_STATS_CONFIG'], [rosters, 'ROSTERS_RADAR_STATS_CONFIG']]) {
    vm.runInContext(`${objectSource(source, name)}\nradars = ${name};`, context);
    for (const pos of ['WR', 'TE']) {
      assert.equal(context.radars[pos].labels[context.radars[pos].stats.indexOf('rec_yms')], 'recYS%');
    }
  }
});
