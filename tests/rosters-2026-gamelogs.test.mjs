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
  const window = { state: {}, location: { href: 'https://test.local/rosters/rosters.html' } };
  const context = vm.createContext({ window, URL, console: { warn() {} }, fetch: async (url) => {
    const sheet = new URL(url).searchParams.get('sheet');
    if (failures[sheet] instanceof Error) throw failures[sheet];
    if (failures[sheet]) return { ok: false, status: failures[sheet] };
    return { ok: true, text: async () => sheet ? (tables[sheet] || '') : 'TM,1,2,18\nBUF,@ HOU,vs DET,vs NYJ' };
  } });
  new vm.Script(source, { filename: loaderPath, importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER }).runInContext(context);
  return window;
}

const season = 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,paATT\n2026,4984,Josh Allen,QB,BUF,35.66,1,30';
const defense = 'TM,QBRK,RBRK,WRRK,TERK\nHOU,2,11,8,19\nDET,6,12,9,20';

test('Rosters loads mixed WK and legacy SZN weekly headers without changing stats or statuses', async () => {
  const window = createLoader({
    DH: season,
    DRK: defense,
    WK1: 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n1,4984,QB,BUF,-2,1,30,22.5',
    WK2: 'SZN,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n2,4984,QB,BUF,0,0,0,OUT',
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
});

test('Rosters isolates a weekly sheet with neither WK nor SZN while retaining DH totals', async () => {
  const window = createLoader({ DH: season, DRK: defense, WK1: 'SLPR_ID,POS,TM,FPT_PPR\n4984,QB,BUF,99' });
  const snapshot = await window.activateRosters2026GameLogs();
  assert.match(snapshot.weekErrors[1], /WK1 has missing or invalid columns/);
  assert.equal(window.state.playerSeasonStats['4984'].fpts_ppr, 35.66);
  assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, undefined);
  assert.equal(snapshot.weeklyStats[1]['4984'].__hasRecordedStats, false);
  assert.equal(snapshot.weeklyStats[1]['4984'].opponent, '@ HOU');
  assert.equal(window.state.activeRostersGameLogsSeason, '2026');
});

test('Rosters retains valid Week 4 and projections when other weekly exports fail or return wrong-week rows', async () => {
  const window = createLoader({
    DH: season,
    DRK: defense,
    WK1: 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n1,4984,QB,BUF,35.66,1,58,19.4',
    WK4: 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n4,4984,QB,BUF,19.52,1,59,23.4',
    WK6: 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n4,4984,QB,BUF,99,1,99,99',
    WK7: 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n7,4984,QB,BUF,0,0,0,IR',
  }, { WK2: new Error('Network unavailable'), WK5: 400 });
  const snapshot = await window.activateRosters2026GameLogs();
  assert.match(snapshot.weekErrors[2], /Network unavailable/);
  assert.match(snapshot.weekErrors[5], /could not load \(400\)/);
  assert.match(snapshot.weekErrors[6], /another week's rows/);
  assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, 35.66);
  assert.equal(snapshot.weeklyStats[4]['4984'].fpt_ppr, 19.52);
  assert.equal(snapshot.weeklyStats[4]['4984'].snp, 59);
  assert.equal(snapshot.weeklyStats[4]['4984'].proj, '23.4');
  assert.equal(snapshot.weeklyStats[7]['4984'].proj, 'IR');
  assert.equal(snapshot.weeklyStats[7]['4984'].__hasRecordedStats, false);
  assert.equal(snapshot.latestRecordedWeek, 4);
  assert.equal(snapshot.rankQualifierWeeks, 2);
  for (const week of [2, 5, 6, 8, 18]) {
    assert.equal(snapshot.weeklyStats[week]['4984'].fpt_ppr, undefined);
    assert.equal(snapshot.weeklyStats[week]['4984'].__hasRecordedStats, false);
  }
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
