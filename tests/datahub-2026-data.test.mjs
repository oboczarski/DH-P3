import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { build2026SourceData, has2026WeekResults, get2026WeeksOfData, load2026SourceData, load2026WeeklySourceData, load2026WeeklyCsvData, load2026ProjectionSourceData } from '../DH_P2.53/scripts/datahub-2026-data.js';
import { get2026QualifierOptions } from '../DH_P2.53/scripts/datahub-stats-season.js';
import { get2026SheetCsvUrl, get2026ProjectionWeeks, get2026ProjectionCsvUrl } from '../DH_P2.53/scripts/nfl-2026-sheets.js';

const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const context = vm.createContext({ get2026QualifierOptions, VIEW_FILTER_CONFIGS: { stats: { defaultCategory: 'overview' } } });
vm.runInContext(source.slice(source.indexOf('const STATS_QUALIFIER_CONFIGS'), source.indexOf('const DATAHUB_CONTROL_TEAM_LOGO_KEY_MAP'))
  + source.slice(source.indexOf('function getStatsQualifierConfig('), source.indexOf('function createDefaultTradeEntityFilterState('))
  + source.slice(source.indexOf('function parseCsv('), source.indexOf('// ---------------------------------------------------------------------------\n// Cell styling')), context);
const parseCsv = context.parseCsv;
const player = { SZN: '2026', SLPR_ID: '4984', 'PLAYER NAME': 'Josh Allen', POS: 'QB', TM: 'BUF', FPT_PPR: '35.66', GM_P: '1' };
const schedule = [{ TM: 'BUF', 1: '@ HOU', 2: 'vs DET', 7: 'BYE', 18: 'vs NYJ' }];
const defense = [{ TM: 'HOU', QBRK: '2', RBRK: '11', WRRK: '8', TERK: '19' }, { TM: 'DET', QBRK: '6' }];

// Exercise the actual lazy loader and distinguish the local sources from Sheets.
function weeklyFixture(csv, failure) {
  const requests = [];
  return { requests, options: { seasonRows: [player], parseCsv, fetchImpl: async (url, init) => {
    assert.equal(init.cache, 'no-store');
    const parsed = new URL(url);
    const sheet = parsed.searchParams.get('sheet');
    const filename = parsed.pathname.split('/').at(-1);
    requests.push({ sheet, pathname: parsed.pathname });
    if (sheet === 'DRK') return { ok: true, text: async () => 'TM,QBRK,RBRK,WRRK,TERK\nHOU,2,11,8,19\nDET,6,12,9,20' };
    if (filename === 'Schedule2026.csv') return { ok: true, text: async () => 'TM,1,2,4,7,18\nBUF,@ HOU,vs DET,@ HOU,BYE,vs NYJ' };
    assert.equal(filename, '2026_AllWKs.csv', 'Only the combined local file may supply weekly stats');
    if (failure instanceof Error) throw failure;
    if (failure) return { ok: false, status: failure };
    return { ok: true, text: async () => csv };
  } } };
}

test('retired 2026 weekly tabs cannot generate a Google Sheets request', () => {
  for (const week of [1, 4, 7, 18]) assert.throws(() => get2026SheetCsvUrl(`WK${week}`), /2026_AllWKs\.csv/);
});

test('DataHub groups unsorted combined CSV rows with one weekly fetch and no weekly Sheets calls', async () => {
  const fixture = weeklyFixture('WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n4,4984,QB,BUF,19.52,1,59,23.4\n1,4984,QB,BUF,35.66,1,58,19.4\n7,4984,QB,BUF,0,0,0,IR');
  const data = await load2026WeeklySourceData(fixture.options);
  assert.deepEqual(data.weeksWithResults, [1, 4]);
  assert.equal(data.weeklyRows[4][0].FPT_PPR, '19.52');
  assert.equal(data.weeklyRows[4][0].PROJ, '23.4');
  assert.equal(data.weeklyRows[4][0].vsRK, '2');
  assert.equal(data.weeklyRows[7][0].PROJ, 'IR');
  assert.equal(data.weeklyRows[7][0].__hasRecordedStats, false);
  assert.deepEqual(data.weekErrors, {});
  assert.equal(data.weeklyRows[5][0].FPT_PPR, undefined);
  assert.equal(data.weeklyRows[18][0].FPT_PPR, undefined);
  assert.equal(data.weeklyRows[18][0].VS, 'vs NYJ');
  assert.equal(fixture.requests.length, 3);
  assert.deepEqual(fixture.requests.map(({ sheet }) => sheet).filter(Boolean), ['DRK']);
  assert.equal(fixture.requests.filter(({ pathname }) => pathname.endsWith('/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv')).length, 1);
  assert.ok(fixture.requests.some(({ pathname }) => pathname.endsWith('/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv')));
});

test('Overview defaults to Show All for both seasons; other categories retain their qualifiers', () => {
  for (const season of ['2025', '2026']) {
    assert.equal(context.createDefaultStatsQualifierState('overview', season).showAll, true);
    for (const category of ['passing', 'rushing', 'receiving']) assert.equal(context.createDefaultStatsQualifierState(category, season).showAll, false);
  }
});

test('qualifiers follow DH games played independently of weekly results or placeholders', () => {
  const weeklyRows = { 1: [{ ...player, SZN: '1' }], 2: [{ ...player, SZN: '2', FPT_PPR: '', GM_P: '', PROJ: '22.0' }] };
  const seasonRows = [{ ...player, GM_P: '2' }];
  const make = () => build2026SourceData({ seasonRows, weeklyRows, scheduleRows: schedule, defenseRows: defense });
  assert.equal(make().weeksOfData, 2);
  weeklyRows[2][0].paATT = '12';
  assert.equal(make().weeksOfData, 2);
  assert.equal(get2026QualifierOptions('RR', make().weeksOfData).find((option) => option.isDefault).threshold, 26);
  seasonRows[0].GM_P = '3';
  assert.equal(make().weeksOfData, 3);
  assert.equal(has2026WeekResults({ FPT_PPR: '0', GM_P: '0', SNP: '0', PROJ: '20' }), false);
  assert.equal(has2026WeekResults({ FPT_PPR: '-2' }), true);
});

test('DH maximum games applies the confirmed late-season adjustment and ignores invalid values', () => {
  for (const [games, weeks] of [[0,1], [1,1], [2,2], [13,13], [14,15], [15,16], [16,17], [17,18]]) {
    assert.equal(get2026WeeksOfData([{ ...player, GM_P: String(games) }, { ...player, GM_P: '0' }]), weeks);
  }
  assert.equal(get2026WeeksOfData([]), 1);
  assert.equal(get2026WeeksOfData(['', 'NA', '-1', 'Infinity', '1.5', '99'].map((GM_P) => ({ ...player, GM_P }))), 1);
  assert.equal(get2026WeeksOfData([{ ...player, GM_P: '2' }, { GM_P: '17' }]), 2);
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

test('main season loader requests DH only, even when every modal source would fail', async () => {
  const requests = [];
  let dh = 'SZN,SLPR_ID,POS,TM,FPT_PPR,GM_P\n2026,4984,QB,BUF,35.66,2';
  const fetchImpl = async (url, init) => {
    assert.equal(init.cache, 'no-store');
    const sheet = new URL(url).searchParams.get('sheet');
    requests.push(sheet);
    if (sheet !== 'DH') throw new Error('Modal source unavailable');
    return { ok: true, text: async () => dh };
  };
  const options = { parseCsv, fetchImpl };
  const data = await load2026SourceData(options);
  assert.deepEqual(requests, ['DH']);
  assert.equal(data.rawRows[0].G, '2');
  assert.equal(data.rawRows[0].FPT_PPR, '35.66');
  assert.equal(data.weeksOfData, 2);
  assert.deepEqual(data.weeklyRows, {});
  dh = '<html>Sign in</html>';
  await assert.rejects(load2026SourceData(options), /DH has missing or invalid columns/);
  dh = 'SZN,SLPR_ID,POS,TM,FPT_PPR,GM_P\n2025,4984,QB,BUF,350,17';
  await assert.rejects(load2026SourceData(options), /different season/);
});

test('failed or malformed combined CSV keeps totals and schedule, with no Sheets fallback', async () => {
  for (const [csv, failure, message] of [
    ['', 404, /could not load \(404\)/],
    ['', new Error('Network unavailable'), /Network unavailable/],
    ['<html>Sign in</html>', undefined, /missing or invalid columns/],
    ['SLPR_ID,POS,TM,FPT_PPR\n4984,QB,BUF,99', undefined, /missing or invalid columns/],
    ['', undefined, /missing or invalid columns/],
    ['WK,SLPR_ID,POS,TM,FPT_PPR\n2026,4984,QB,BUF,99', undefined, /invalid week number/],
    ['WK,SLPR_ID,POS,TM,FPT_PPR\n1.5,4984,QB,BUF,99', undefined, /invalid week number/],
  ]) {
    const fixture = weeklyFixture(csv, failure);
    const data = await load2026WeeklySourceData(fixture.options);
    assert.equal(data.rawRows[0].FPT_PPR, '35.66');
    assert.deepEqual(data.weeksWithResults, []);
    assert.equal(Object.keys(data.weekErrors).length, 18);
    assert.match(data.weekErrors[1], message);
    assert.equal(data.weeklyRows[1][0].VS, '@ HOU');
    assert.equal(data.weeklyRows[1][0].FPT_PPR, undefined);
    assert.equal(data.weeklyRows[1][0].__hasRecordedStats, false);
    assert.equal(fixture.requests.length, 3);
  }
});

test('combined CSV WK and legacy SZN aliases preserve stats, zeroes and literal statuses', async () => {
  for (const header of ['WK', 'SZN']) {
    const fixture = weeklyFixture(`${header},SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,SNP,PROJ,recYS%\n1,4984,"Allen, Josh",QB,BUF,-2,1,30,22.5,0\n2,4984,"Allen, Josh",QB,BUF,0,0,0,OUT,NA`);
    const data = await load2026WeeklySourceData(fixture.options);
    assert.deepEqual(data.weeksWithResults, [1]);
    assert.deepEqual(data.weekErrors, {});
    assert.equal(data.rawRows[0].SZN, '2026');
    assert.equal(data.weeklyRows[1][0].SZN, '1');
    assert.equal(data.weeklyRows[1][0]['PLAYER NAME'], 'Allen, Josh');
    assert.equal(data.weeklyRows[1][0].FPT_PPR, '-2');
    assert.equal(data.weeklyRows[1][0]['recYS%'], '0');
    assert.equal(data.weeklyRows[2][0].SZN, '2');
    assert.equal(data.weeklyRows[2][0].FPT_PPR, '0');
    assert.equal(data.weeklyRows[2][0].SNP, '0');
    assert.equal(data.weeklyRows[2][0].PROJ, 'OUT');
    assert.equal(data.weeklyRows[2][0]['recYS%'], 'NA');
    assert.equal(data.weeklyRows[3][0].FPT_PPR, undefined);
  }
});


test('the shipped combined CSV preserves all original column values through DataHub grouping', async () => {
  const csv = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url), 'utf8');
  const fixture = weeklyFixture(csv);
  const data = await load2026WeeklySourceData(fixture.options);
  const rows = parseCsv(csv);
  assert.ok(rows.length > 0);
  for (const original of rows) {
    const loaded = data.weeklyRows[Number(original.WK)].find(row => row.SLPR_ID === original.SLPR_ID);
    assert.ok(loaded, `Missing ${original.SLPR_ID} in Week ${original.WK}`);
    for (const [key, value] of Object.entries(original)) {
      // Opponent context intentionally remains schedule/DRK-backed.
      if (!['VS', 'vsRK'].includes(key)) assert.equal(loaded[key], value, `${key} changed for ${original.SLPR_ID} in Week ${original.WK}`);
    }
  }
  assert.equal(data.weeklyRows[4].find(row => row.SLPR_ID === '4984').FPT_PPR, '19.52');
  assert.ok(data.weeksWithResults.includes(4));
  assert.deepEqual(data.weekErrors, {});
});

test('projection URL configuration selects only published weeks after the CSV cutoff', () => {
  assert.deepEqual(get2026ProjectionWeeks(4), [5, 6, 7]);
  assert.deepEqual(get2026ProjectionWeeks(6), [7]);
  assert.deepEqual(get2026ProjectionWeeks(18), []);
  assert.throws(() => get2026ProjectionWeeks(NaN), /cutoff/);
  const url = new URL(get2026ProjectionCsvUrl(5));
  assert.equal(url.pathname.split('/').at(-1), 'export');
  assert.equal(url.searchParams.get('gid'), '749604963');
  assert.equal(url.searchParams.get('sheet'), 'WK5');
});

test('DataHub future projections preserve zero/status text without importing sheet results or rereading CSV', async () => {
  const fixture = weeklyFixture('WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n4,4984,QB,BUF,19.52,1,59,23.4');
  const weeklySource = await load2026WeeklyCsvData(fixture.options);
  const requests = [];
  const projectionSource = await load2026ProjectionSourceData({ weeklySource, parseCsv, fetchImpl: async (url) => {
    const week = Number(new URL(url).searchParams.get('sheet').slice(2));
    requests.push(week);
    const value = { 5: '0', 6: 'OUT', 7: 'BYE' }[week];
    return { ok: true, text: async () => `WK,SLPR_ID,PLAYER NAME,POS,TM,PROJ,FPT_PPR,GM_P,SNP\n${week},4984,Josh Allen,QB,BUF,${value},999,1,90` };
  } });
  assert.deepEqual(requests.sort(), [5, 6, 7]);
  const data = await load2026WeeklySourceData({ ...fixture.options, weeklySource, projectionSource });
  assert.equal(fixture.requests.filter(({ pathname }) => pathname.endsWith('2026_AllWKs.csv')).length, 1);
  assert.equal(data.weeklyRows[4][0].PROJ, '23.4');
  assert.equal(data.weeklyRows[4][0].FPT_PPR, '19.52');
  for (const [week, value] of [[5, '0'], [6, 'OUT'], [7, 'BYE']]) {
    assert.equal(data.weeklyRows[week][0].PROJ, value);
    assert.equal(data.weeklyRows[week][0].FPT_PPR, undefined);
    assert.equal(data.weeklyRows[week][0].SNP, undefined);
    assert.equal(data.weeklyRows[week][0].__hasRecordedStats, false);
  }
  assert.deepEqual(data.weeksWithResults, [4]);
  assert.equal(data.weeksOfData, 1);
  assert.equal(data.rawRows[0].FPT_PPR, '35.66');
});

test('DataHub isolates failed or mislabeled future tabs and skips Sheets when CSV cutoff is unavailable', async () => {
  const weeklySource = { weeklyRows: {}, latestRecordedWeek: 4, weekErrors: {} };
  for (const [csv, status, message] of [
    ['', 400, /could not load/],
    ['WK,SLPR_ID,POS,TM,PROJ\n6,4984,QB,BUF,22.0', 200, /another week/],
    ['<html>Sign in</html>', 200, /invalid columns/],
  ]) {
    const result = await load2026ProjectionSourceData({ weeklySource, parseCsv, fetchImpl: async (url) => {
      const week = Number(new URL(url).searchParams.get('sheet').slice(2));
      return week === 5 ? { ok: status === 200, status, text: async () => csv }
        : { ok: true, text: async () => `SZN,SLPR_ID,POS,TM,PROJ\n${week},4984,QB,BUF,IR` };
    } });
    assert.match(result.projectionErrors[5], message);
    assert.equal(result.projectionRows[6][0].PROJ, 'IR');
    assert.equal(result.projectionRows[7][0].PROJ, 'IR');
  }
  const skipped = await load2026ProjectionSourceData({ weeklySource: { ...weeklySource, weekErrors: { 1: 'CSV unavailable' } }, parseCsv,
    fetchImpl: () => { assert.fail('A missing cutoff cannot request completed weeks'); } });
  assert.deepEqual(skipped.projectionRows, {});
});

test('DataHub background preparation is single-flight and cannot block initial Stats readiness', async () => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  let csvCalls = 0;
  let projectionCalls = 0;
  let hidden = false;
  const ctx = vm.createContext({
    parseCsv, state: { statsSeason: '2026' }, console: { warn() {}, error() {} },
    load2026WeeklyCsvData: async () => { csvCalls++; return { weeklyRows: {}, weekErrors: {}, latestRecordedWeek: 4 }; },
    load2026ProjectionSourceData: async () => { projectionCalls++; await held; return { projectionRows: {}, projectionErrors: {} }; },
    fetchCsvText: async () => '', applyCsvText() {}, ensureDataHub2026Data: async () => ({}),
    rebuildDataHubWeeklyStatsRows() {}, syncUiState() {}, refreshGrid() {},
    hideOverlay() { hidden = true; }, ensureDataHubSupplementalData: async () => {}, rebuildDataHubRows() {}, ensureDataHubRookieData: async () => {},
  });
  vm.runInContext('let dataHub2026ProjectionPreparationPromise = null;'
    + source.slice(source.indexOf('function prepareDataHub2026Projections()'), source.indexOf('function getDataHubStatsRowsForSeason('))
    + source.slice(source.indexOf('async function loadInitialData()'), source.indexOf('// Keep this request shared by the table')), ctx);
  const pending = ctx.prepareDataHub2026Projections();
  assert.equal(ctx.prepareDataHub2026Projections(), pending);
  await ctx.loadInitialData();
  assert.equal(hidden, true, 'Stats must become ready while projection response is still pending');
  release();
  await pending;
  assert.equal(csvCalls, 1);
  assert.equal(projectionCalls, 1);
});
