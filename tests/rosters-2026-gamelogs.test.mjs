import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const loaderPath = fileURLToPath(new URL('../DH_P2.53/scripts/rosters-2026-gamelogs.js', import.meta.url));
const source = fs.readFileSync(loaderPath, 'utf8');

// Exercise Rosters' actual independent loader with CSV responses, including its
// normal dynamic import of the shared URL configuration. No DOM is required.
function createLoader(tables) {
  const window = { state: {}, location: { href: 'https://test.local/rosters/rosters.html' } };
  const context = vm.createContext({ window, URL, fetch: async (url) => {
    const sheet = new URL(url).searchParams.get('sheet');
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

test('Rosters still rejects a weekly sheet with neither WK nor SZN', async () => {
  const window = createLoader({ DH: season, DRK: defense, WK1: 'SLPR_ID,POS,TM,FPT_PPR\n4984,QB,BUF,99' });
  await assert.rejects(window.ensureRosters2026GameLogsLoaded(), /WK1 has missing or invalid columns/);
});

test('Rosters keeps DH season totals on the SZN year header', async () => {
  const window = createLoader({ DH: season.replace('SZN,', 'WK,') });
  await assert.rejects(window.ensureRosters2026SeasonRowsLoaded(), /DH has missing or invalid columns/);
});
