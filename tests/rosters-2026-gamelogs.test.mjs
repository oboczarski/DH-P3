import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const loaderPath = fileURLToPath(new URL('../DH_P2.53/scripts/rosters-2026-gamelogs.js', import.meta.url));
const source = fs.readFileSync(loaderPath, 'utf8');
const appSource = fs.readFileSync(new URL('../DH_P2.53/scripts/app.js', import.meta.url), 'utf8');

// Exercise Rosters' actual independent loader with CSV responses, including its
// normal dynamic import of the shared URL configuration. No DOM is required.
function createLoader(tables, failures = {}) {
  const window = { state: {}, location: { href: 'https://test.local/rosters/rosters.html' }, requests: [] };
  const context = vm.createContext({ window, URL, console: { warn() {} }, fetch: async (url, init) => {
    assert.equal(init.cache, 'no-store');
    const parsed = new URL(url);
    const sheet = parsed.searchParams.get('sheet');
    const filename = parsed.pathname.split('/').at(-1);
    const key = sheet || filename;
    window.requests.push({ sheet, pathname: parsed.pathname });
    if (failures[key] instanceof Error) throw failures[key];
    if (failures[key]) return { ok: false, status: failures[key] };
    if (sheet) {
      assert.ok(['DH', 'DRK'].includes(sheet), 'Weekly stats cannot request Sheets tabs');
      return { ok: true, text: async () => tables[sheet] || '' };
    }
    if (filename === 'Schedule2026.csv') {
      assert.equal(parsed.pathname, '/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv');
      return { ok: true, text: async () => 'TM,1,2,4,7,18\nBUF,@ HOU,vs DET,@ HOU,BYE,vs NYJ' };
    }
    assert.equal(parsed.pathname, '/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv');
    return { ok: true, text: async () => tables['2026_AllWKs.csv'] || '' };
  } });
  new vm.Script(source, { filename: loaderPath, importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER }).runInContext(context);
  return window;
}

const season = 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,paATT\n2026,4984,Josh Allen,QB,BUF,35.66,1,30';
const defense = 'TM,QBRK,RBRK,WRRK,TERK\nHOU,2,11,8,19\nDET,6,12,9,20';

test('Rosters preserves share values and ranks across DH/weekly CSV header renaming', async () => {
  const newHeaders = 'TDS%,YS%,ruTDS%,ruYS%,recTDS%,recYS%';
  const legacyHeaders = 'TMS,YMS,ruTMS,ruYMS,recTMS,recYMS';
  for (const headers of [newHeaders, legacyHeaders]) {
    const window = createLoader({
      DH: season.replace('\n', `,${headers}\n`) + ',0.125,12.5%,25,0,1%,NA',
      DRK: defense,
      '2026_AllWKs.csv': `WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,${headers}\n1,4984,QB,BUF,35.66,1,58,0.125,12.5%,25,0,1%,NA`,
    });
    const snapshot = await window.activateRosters2026GameLogs();
    for (const stats of [snapshot.seasonStats['4984'], snapshot.weeklyStats[1]['4984']]) {
      assert.equal(stats.tds_pct, 12.5);
      assert.equal(stats.ys_pct, 12.5);
      assert.equal(stats.rush_tms, 25);
      assert.equal(stats.rush_yms, 0);
      assert.equal(stats.rec_tms, 1);
      assert.equal(stats.rec_yms, undefined);
    }
    assert.equal(snapshot.seasonRanks['4984'].tds_pct, 1);
    assert.equal(snapshot.seasonRanks['4984'].rush_yms, 1);
    assert.equal(snapshot.seasonRanks['4984'].rec_tms, 1);
    assert.equal(snapshot.seasonRanks['4984'].rec_yms, undefined);
  }
});

test('Rosters groups WK and legacy SZN combined CSVs without changing stats or statuses', async () => {
  for (const header of ['WK', 'SZN']) {
    const window = createLoader({
      DH: season,
      DRK: defense,
      '2026_AllWKs.csv': `${header},SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n2,4984,"Allen, Josh",QB,BUF,0,0,0,OUT\n1,4984,"Allen, Josh",QB,BUF,-2,1,30,22.5`,
    });
    const snapshot = await window.ensureRosters2026GameLogsLoaded();
    assert.equal(snapshot.seasonStats['4984'].fpts_ppr, 35.66);
    assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, -2);
    assert.equal(snapshot.weeklyStats[1]['4984'].snp, 30);
    assert.equal(snapshot.weeklyStats[1]['4984'].proj, '22.5');
    assert.equal(snapshot.weeklyStats[1]['4984'].opponent_rank, 2);
    assert.equal(snapshot.weeklyStats[2]['4984'].fpt_ppr, 0);
    assert.equal(snapshot.weeklyStats[2]['4984'].snp, 0);
    assert.equal(snapshot.weeklyStats[2]['4984'].proj, 'OUT');
    assert.equal(snapshot.latestRecordedWeek, 1);
    assert.equal(snapshot.weeklyStats[3]['4984'].fpt_ppr, undefined);
    assert.equal(Object.keys(snapshot.weekErrors).length, 0);
  }
});

test('Rosters keeps season totals and blank weeks if the combined CSV fails validation or fetching', async () => {
  for (const [csv, failure, message] of [
    ['SLPR_ID,POS,TM,FPT_PPR\n4984,QB,BUF,99', undefined, /missing or invalid columns/],
    ['', undefined, /missing or invalid columns/],
    ['<html>Sign in</html>', undefined, /missing or invalid columns/],
    ['WK,SLPR_ID,POS,TM,FPT_PPR\n2026,4984,QB,BUF,99', undefined, /invalid week number/],
    ['WK,SLPR_ID,POS,TM,FPT_PPR\n0,4984,QB,BUF,99', undefined, /invalid week number/],
    ['', 404, /could not load \(404\)/],
    ['', new Error('Network unavailable'), /Network unavailable/],
  ]) {
    const window = createLoader({ DH: season, DRK: defense, '2026_AllWKs.csv': csv }, { '2026_AllWKs.csv': failure });
    const snapshot = await window.activateRosters2026GameLogs();
    assert.match(snapshot.weekErrors[1], message);
    assert.equal(Object.keys(snapshot.weekErrors).length, 18);
    assert.equal(window.state.playerSeasonStats['4984'].fpts_ppr, 35.66);
    assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, undefined);
    assert.equal(snapshot.weeklyStats[1]['4984'].__hasRecordedStats, false);
    assert.equal(snapshot.weeklyStats[1]['4984'].opponent, '@ HOU');
    assert.equal(window.state.activeRostersGameLogsSeason, '2026');
    assert.equal(window.requests.length, 4);
  }
});

test('Rosters loads all CSV weeks in one request, retains projections and reuses its cached snapshot', async () => {
  const window = createLoader({
    DH: season,
    DRK: defense,
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n4,4984,QB,BUF,19.52,1,59,23.4\n1,4984,QB,BUF,35.66,1,58,19.4\n7,4984,QB,BUF,0,0,0,IR\n18,4984,QB,BUF,0,0,0,PUP',
  });
  const [snapshot, same] = await Promise.all([window.activateRosters2026GameLogs(), window.ensureRosters2026GameLogsLoaded()]);
  assert.equal(snapshot, same);
  assert.equal(await window.ensureRosters2026GameLogsLoaded(), snapshot);
  assert.equal(Object.keys(snapshot.weekErrors).length, 0);
  assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, 35.66);
  assert.equal(snapshot.weeklyStats[4]['4984'].fpt_ppr, 19.52);
  assert.equal(snapshot.weeklyStats[4]['4984'].snp, 59);
  assert.equal(snapshot.weeklyStats[4]['4984'].proj, '23.4');
  assert.equal(snapshot.weeklyStats[7]['4984'].proj, 'IR');
  assert.equal(snapshot.weeklyStats[7]['4984'].__hasRecordedStats, false);
  assert.equal(snapshot.weeklyStats[18]['4984'].proj, 'PUP');
  assert.equal(snapshot.latestRecordedWeek, 4);
  assert.equal(snapshot.rankQualifierWeeks, 2);
  for (const week of [2, 5, 6, 8]) {
    assert.equal(snapshot.weeklyStats[week]['4984'].fpt_ppr, undefined);
    assert.equal(snapshot.weeklyStats[week]['4984'].__hasRecordedStats, false);
  }
  assert.equal(window.requests.filter(({ pathname }) => pathname.endsWith('/2026_AllWKs.csv')).length, 1);
  assert.deepEqual(window.requests.map(({ sheet }) => sheet).filter(Boolean).sort(), ['DH', 'DRK']);
  assert.equal(window.requests.length, 4);
});

test('Rosters parses the shipped combined weekly file through its existing stat mappings', async () => {
  const csv = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url), 'utf8');
  const window = createLoader({ DH: season, DRK: defense, '2026_AllWKs.csv': csv });
  const snapshot = await window.activateRosters2026GameLogs();
  const allen = snapshot.weeklyStats[4]['4984'];
  assert.equal(allen.fpt_ppr, 19.52);
  assert.equal(allen.snp, 59);
  assert.equal(allen.proj, '23.4');
  assert.equal(allen.__hasRecordedStats, true);
  assert.equal(snapshot.latestRecordedWeek, 4);
  assert.equal(snapshot.rankQualifierWeeks, 4);
  assert.equal(Object.keys(snapshot.weekErrors).length, 0);
});

test('Rosters keeps DH season totals on the SZN year header', async () => {
  const window = createLoader({ DH: season.replace('SZN,', 'WK,') });
  await assert.rejects(window.ensureRosters2026SeasonRowsLoaded(), /DH has missing or invalid columns/);
});

test('a failed background 2025 CSV load cannot erase active Rosters 2026 data and can retry', async () => {
  const window = createLoader({ DH: season, DRK: defense });
  await window.activateRosters2026GameLogs();
  const state = window.state;
  const seasonStats = state.playerSeasonStats;
  const seasonRanks = state.playerSeasonRanks;
  const weeklyStats = state.playerWeeklyStats;
  const liveStats = { 4: { '4984': { fpt_ppr: 19.52 } } };
  state.liveWeeklyStats = liveStats;
  let attempts = 0;
  const context = vm.createContext({
    state, pageType: 'rosters', playerStatsSheetsLoadPromise: null, console: { error() {} },
    shouldUsePlayerStatsGoogleSheets: () => false,
    loadPlayerStatsFromCsvFiles: async () => { attempts += 1; throw new Error('Historical CSV network failure'); },
  });
  vm.runInContext(appSource.slice(appSource.indexOf('async function fetchPlayerStatsSheets()'), appSource.indexOf('// Expose for dashboard/home reuse', appSource.indexOf('async function fetchPlayerStatsSheets()'))), context);
  await context.fetchPlayerStatsSheets();
  assert.equal(state.playerSeasonStats, seasonStats);
  assert.equal(state.playerSeasonRanks, seasonRanks);
  assert.equal(state.playerWeeklyStats, weeklyStats);
  assert.equal(state.weeklyStats, weeklyStats);
  assert.equal(state.liveWeeklyStats, liveStats);
  assert.equal(state.activeRostersGameLogsSeason, '2026');
  assert.equal(state.statsSheetsLoaded, false);
  assert.equal(context.playerStatsSheetsLoadPromise, null);
  await context.fetchPlayerStatsSheets();
  assert.equal(attempts, 2);

  // Preserve the existing error reset on other pages and historical Rosters.
  for (const [pageType, activeSeason] of [['stats', '2026'], ['rosters', '2025']]) {
    context.pageType = pageType;
    state.activeRostersGameLogsSeason = activeSeason;
    await context.fetchPlayerStatsSheets();
    assert.equal(Object.keys(state.playerSeasonStats).length, 0);
    assert.equal(Object.keys(state.playerWeeklyStats).length, 0);
  }
});
