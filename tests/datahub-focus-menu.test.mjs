import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { getDataHubWeeklyColumns, getDataHubWeeklyColumnGroups } from '../DH_P2.53/scripts/datahub-stats-period.js';

const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
function functionSource(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}
function harness() {
  // Use the real category/season schemas and visibility functions. No data
  // feeds or DOM are needed to verify protected groups and schema restoration.
  const state = { activePageView: 'stats', activeCategory: 'overview', statsSeason: '2026',
    focusHiddenGroupsByView: new Map(), tradeMarketColumnFilters: { ktc: true, adp: true },
    sort: { column: 'FPTS', direction: 'desc' } };
  const context = vm.createContext({ state, getDataHubWeeklyColumns, getDataHubWeeklyColumnGroups });
  const config = source.slice(source.indexOf('const PAGE_TITLES'), source.indexOf('const DATAHUB_HERO_CHART_CONFIGS'))
    + source.slice(source.indexOf('const ONE_QB_MARKET_DATA_COLUMNS'), source.indexOf('const state = {'));
  const names = ['is2026PassingStatsView', 'is2026RushingStatsView', 'is2026ReceivingStatsView',
    'isDataHubWeeklyStatsView',
    'getActiveColumnSet', 'getActiveColumnGroups', 'getFocusColumnGroups', 'getFocusViewKey',
    'getFocusHiddenGroups', 'getFocusedColumnSet', 'getFocusedColumnGroups',
    'shouldFilterTradeMarketColumns', 'isTradeMarketColumnVisible', 'getVisibleTradeMarketColumns',
    'getVisibleTradeMarketColumnGroups', 'getDefaultCategory', 'getViewFilterConfig', 'getActiveFrozenColumnGroups',
    'isSortableColumn', 'isDataHubRookiesView', 'isDataHubRookiesCareerView', 'getActiveSortableColumns'];
  vm.runInContext(config + '\n' + names.map(functionSource).join('\n'), context);
  return context;
}
const asArray = (value) => Array.from(value);

test('every active schema exposes its statistical groups and protects General/Info', () => {
  const api = harness();
  for (const [view, categories] of [['stats',['overview','passing','rushing','receiving']],
    ['adp-values',['all','qb','rb','wr','te','flx']],
    ['rookies-career',['overview','passing','rushing','receiving']],
    ['rookies-trade',['all','qb','rb','wr','te','flx']]]) {
    for (const category of categories) for (const season of ['2025','2026']) {
      Object.assign(api.state, {activePageView:view, activeCategory:category, statsSeason:season});
      const full = asArray(api.getActiveColumnSet());
      const groups = api.getFocusColumnGroups();
      assert.ok(groups.length, `${view}/${category} has toggleable groups`);
      assert.ok(groups.every(group => group.label !== 'GENERAL' && group.label !== 'INFO'));
      groups.forEach(group => api.getFocusHiddenGroups().add(group.label));
      const expected = [...api.getActiveFrozenColumnGroups(), ...api.getActiveColumnGroups().filter(group => group.label === 'INFO')]
        .flatMap(group => asArray(group.columns));
      assert.deepEqual(asArray(api.getFocusedColumnSet()), full.filter(column => expected.includes(column)));
      assert.ok(api.getFocusedColumnGroups().every(group => group.label === 'INFO'));
      api.getFocusHiddenGroups().clear();
      assert.deepEqual(asArray(api.getFocusedColumnSet()), full, 'all columns restore in source order');
    }
  }
});

test('weekly schemas retain the 2026 group order, remove only requested stats, and restore season columns', () => {
  const api = harness();
  for (const category of ['overview', 'passing', 'rushing', 'receiving']) {
    Object.assign(api.state, { activeCategory: category, statsWeek: null });
    const columns = asArray(api.getActiveColumnSet());
    const groups = api.getActiveColumnGroups();
    api.state.statsWeek = 4;
    assert.deepEqual(asArray(api.getActiveColumnSet()), getDataHubWeeklyColumns(columns));
    const weeklyGroups = api.getActiveColumnGroups();
    assert.deepEqual(asArray(weeklyGroups).map(group => group.label), asArray(groups).map(group => group.label));
    assert.deepEqual(asArray(weeklyGroups).flatMap(group => asArray(group.columns)), asArray(groups).flatMap(group => getDataHubWeeklyColumns(asArray(group.columns))));
    api.state.statsWeek = null;
    assert.deepEqual(asArray(api.getActiveColumnSet()), columns);
    api.state.activePageView = 'rookies-career';
    const rookieColumns = asArray(api.getActiveColumnSet());
    api.state.statsWeek = 4;
    assert.deepEqual(asArray(api.getActiveColumnSet()), rookieColumns, 'weekly exclusions stay inside Stats');
    api.state.activePageView = 'stats';
  }
});

test('hiding one group leaves other groups, full sorting options and source columns intact', () => {
  const api = harness();
  api.state.activeCategory = 'passing';
  const full = asArray(api.getActiveColumnSet());
  const sorts = asArray(api.getActiveSortableColumns());
  const group = api.getFocusColumnGroups().find(group => group.label === 'GENERAL PROD. & EFF.');
  assert.ok(group, 'statistical General Production group remains toggleable');
  api.getFocusHiddenGroups().add(group.label);
  assert.deepEqual(asArray(api.getFocusedColumnSet()), full.filter(column => !group.columns.includes(column)));
  assert.deepEqual(asArray(api.getActiveSortableColumns()), sorts);
  assert.deepEqual(asArray(api.getActiveColumnSet()), full);
  assert.deepEqual(api.state.sort, {column:'FPTS',direction:'desc'});
});

test('focus state belongs to the current view, category and Stats season', () => {
  const api = harness();
  api.getFocusHiddenGroups().add('FANTASY');
  api.state.activeCategory = 'passing';
  assert.equal(api.getFocusHiddenGroups().size, 0);
  api.state.activeCategory = 'overview';
  api.state.statsSeason = '2025';
  assert.equal(api.getFocusHiddenGroups().size, 0);
  api.state.activePageView = 'adp-values';
  api.state.activeCategory = 'all';
  assert.equal(api.getFocusHiddenGroups().size, 0);
  Object.assign(api.state, {activePageView:'stats',activeCategory:'overview',statsSeason:'2026'});
  assert.ok(api.getFocusHiddenGroups().has('FANTASY'));
});

test('Focus composes with existing Trade Values market filters', () => {
  const api = harness();
  Object.assign(api.state, {activePageView:'adp-values',activeCategory:'all'});
  api.getFocusHiddenGroups().add('1QB');
  api.state.tradeMarketColumnFilters.adp = false;
  assert.ok(!api.getFocusedColumnSet().some(column => /ADP|DIFF|1QB/.test(column)));
  assert.ok(api.getFocusedColumnSet().includes('KTC SFLX'));
  api.state.tradeMarketColumnFilters.adp = true;
  assert.ok(api.getFocusedColumnSet().includes('SFLX ADP'));
  assert.ok(!api.getFocusedColumnSet().includes('1QB ADP'));
  api.getFocusHiddenGroups().clear();
  assert.ok(api.getFocusedColumnSet().includes('1QB ADP'));
});
