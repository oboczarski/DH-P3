import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { build2026SourceData, has2026WeekResults, load2026SourceData } from '../DH_P2.53/scripts/datahub-2026-data.js';
import { get2026QualifierOptions } from '../DH_P2.53/scripts/datahub-stats-season.js';

const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const context = vm.createContext({ get2026QualifierOptions, VIEW_FILTER_CONFIGS: { stats: { defaultCategory: 'overview' } } });
vm.runInContext(source.slice(source.indexOf('const STATS_QUALIFIER_CONFIGS'), source.indexOf('const DATAHUB_CONTROL_TEAM_LOGO_KEY_MAP'))
  + source.slice(source.indexOf('function getStatsQualifierConfig('), source.indexOf('function createDefaultTradeEntityFilterState('))
  + source.slice(source.indexOf('function parseCsv('), source.indexOf('// ---------------------------------------------------------------------------\n// Cell styling')), context);
const parseCsv = context.parseCsv;
const player = { SZN: '2026', SLPR_ID: '4984', 'PLAYER NAME': 'Josh Allen', POS: 'QB', TM: 'BUF', FPT_PPR: '35.66', GM_P: '1' };
const schedule = [{ TM: 'BUF', 1: '@ HOU', 2: 'vs DET', 7: 'BYE', 18: 'vs NYJ' }];
const defense = [{ TM: 'HOU', QBRK: '2', RBRK: '11', WRRK: '8', TERK: '19' }, { TM: 'DET', QBRK: '6' }];

test('Overview defaults to Show All for both seasons; other categories retain their qualifiers', () => {
  for (const season of ['2025', '2026']) {
    assert.equal(context.createDefaultStatsQualifierState('overview', season).showAll, true);
    for (const category of ['passing', 'rushing', 'receiving']) assert.equal(context.createDefaultStatsQualifierState(category, season).showAll, false);
  }
});

test('qualifiers advance only for weeks with results, ignoring projected and pre-created weeks', () => {
  const weeklyRows = { 1: [{ ...player, SZN: '1' }], 2: [{ ...player, SZN: '2', FPT_PPR: '', GM_P: '', PROJ: '22.0' }], 3: [{ SLPR_ID: '4984', POS: 'QB' }] };
  const make = () => build2026SourceData({ seasonRows: [player], weeklyRows, scheduleRows: schedule, defenseRows: defense });
  assert.equal(make().weeksOfData, 1);
  weeklyRows[2][0].paATT = '12';
  assert.equal(make().weeksOfData, 2);
  assert.equal(get2026QualifierOptions('RR', make().weeksOfData).find((option) => option.isDefault).threshold, 26);
  assert.equal(has2026WeekResults({ FPT_PPR: '0', GM_P: '0', SNP: '0', PROJ: '20' }), false);
  assert.equal(has2026WeekResults({ FPT_PPR: '-2' }), true);
});

test('Schedule2026 overrides sheet opponents and DRK maps the opponent by player position', () => {
  for (const [pos, rank] of [['QB','2'], ['RB','11'], ['WR','8'], ['TE','19']]) {
    const p = { ...player, POS: pos };
    const data = build2026SourceData({ seasonRows: [p], weeklyRows: { 1: [{ ...p, SZN: '1', VS: 'wrong', vsRK: '32' }] }, scheduleRows: schedule, defenseRows: defense });
    assert.equal(data.weeklyRows[1][0].VS, '@ HOU');
    assert.equal(data.weeklyRows[1][0].vsRK, rank);
    assert.equal(data.weeklyRows[7][0].VS, 'BYE');
    assert.equal(data.weeklyRows[7][0].vsRK, '');
    assert.equal(data.weeklyRows[18][0].VS, 'vs NYJ');
    assert.equal(data.weeklyRows[18][0].FPT_PPR, undefined);
    assert.equal(data.weeklyRows[18][0].__hasRecordedStats, false);
  }
});

test('weekly team changes and alias teams resolve without using another team or inventing ranks', () => {
  const data = build2026SourceData({ seasonRows: [player], weeklyRows: { 2: [{ ...player, TM: 'WSH' }] }, scheduleRows: [{ TM: 'WAS', 2: '@ JAC' }], defenseRows: [{ TM: 'JAX', QBRK: '9' }] });
  assert.equal(data.weeklyRows[2][0].VS, '@ JAC');
  assert.equal(data.weeklyRows[2][0].vsRK, '9');
  assert.equal(data.weeklyRows[1][0].VS, '');
  assert.equal(data.weeklyRows[1][0].vsRK, '');
});

test('loader discovers newly populated WK tabs and rejects bad schemas instead of replacing live stats', async () => {
  const requests = [];
  const tables = {
    DH: 'SZN,SLPR_ID,POS,TM,FPT_PPR,GM_P\n2026,4984,QB,BUF,35.66,1',
    DRK: 'TM,QBRK,RBRK,WRRK,TERK\nHOU,2,11,8,19',
    WK1: 'SZN,SLPR_ID,POS,TM,FPT_PPR,GM_P\n1,4984,QB,BUF,35.66,1',
    WK6: 'SZN,SLPR_ID,POS,TM,FPT_PPR,GM_P\n6,4984,QB,BUF,20,1',
  };
  const fetchImpl = async (url, init) => {
    assert.equal(init.cache, 'no-store');
    const sheet = new URL(url).searchParams.get('sheet');
    requests.push(sheet);
    return { ok: true, text: async () => sheet ? (tables[sheet] || '') : 'TM,1,18\nBUF,@ HOU,vs NYJ' };
  };
  const options = { parseCsv, scheduleUrl: 'https://test.local/Schedule2026.csv', fetchImpl };
  const data = await load2026SourceData(options);
  assert.deepEqual(data.weeksWithResults, [1, 6]);
  assert.ok(requests.includes('WK18'));
  tables.DH = '<html>Sign in</html>';
  await assert.rejects(load2026SourceData(options), /DH has missing or invalid columns/);
  tables.DH = 'SZN,SLPR_ID,POS,TM,FPT_PPR\n2025,4984,QB,BUF,350';
  await assert.rejects(load2026SourceData(options), /different season/);
});
