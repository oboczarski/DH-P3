import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import Data from '../DH_P2.53/rosters/matchup-breakdown/model.js';
import { build2026MatchupData, parse2026Csv } from '../DH_P2.53/scripts/nfl-2026-matchups.js';
import { defenseMetric } from '../DH_P2.53/rosters/matchup-breakdown/rank-view.js';

const loaderPath = fileURLToPath(new URL('../DH_P2.53/scripts/rosters-2026-gamelogs.js', import.meta.url));
const source = fs.readFileSync(loaderPath, 'utf8');
const appSource = fs.readFileSync(new URL('../DH_P2.53/scripts/app.js', import.meta.url), 'utf8');

// Exercise Rosters' actual independent loader with CSV responses, including its
// normal dynamic import of the shared URL configuration. No DOM is required.
function createLoader(tables, failures = {}, boot = false) {
  const window = { state: {}, location: { href: 'https://test.local/rosters/rosters.html' }, requests: [] };
  if (boot) window.document = { body: { dataset: { page: 'rosters' } } };
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
      assert.equal(sheet, 'PROJ', 'Only the dedicated PROJ export may supply future projections');
      assert.equal(parsed.searchParams.get('gid'), '1097963859');
      return { ok: true, text: async () => tables[sheet] ?? '' };
    }
    if (filename === '2026_Season.csv') {
      assert.equal(parsed.pathname, '/data/NFL-2026_Stats/SeasonStats/2026_Season.csv');
      return { ok: true, text: async () => tables[filename] || '' };
    }
    if (filename === 'Schedule2026.csv') {
      assert.equal(parsed.pathname, '/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv');
      return { ok: true, text: async () => tables[filename] || 'TM,1,2,4,7,18\nBUF,@ HOU,vs DET,@ HOU,BYE,vs NYJ' };
    }
    assert.equal(parsed.pathname, '/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv');
    return { ok: true, text: async () => tables['2026_AllWKs.csv'] || '' };
  } });
  new vm.Script(source, { filename: loaderPath, importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER }).runInContext(context);
  return window;
}

const season = 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,paATT\n2026,4984,Josh Allen,QB,BUF,35.66,1,30';
const defense = 'TM,QBRK,RBRK,WRRK,TERK\nHOU,2,11,8,19\nDET,6,12,9,20';
const matchupRanks = defense.replace('QBRK,RBRK,WRRK,TERK', 'QBrk,RBrk,WRrk,TErk');

// Exercise the same calculated inputs as the real panel, including every
// position's recorded/future weekly tag and the upcoming profile matchup.
test('Rosters current/future ranks match the local breakdown in every position without reading Sheets', async () => {
  const positions = ['QB', 'RB', 'WR', 'TE'];
  const scheduleCsv = 'TM,1,2,4,7,18\nBUF,@ HOU,vs DET,@ HOU,BYE,vs NYJ\nHOU,vs BUF,@ DET,vs BUF,BYE,@ NYJ';
  const weekly = 'WK,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,VS\n'
    + positions.flatMap((pos, i) => [`1,${i+1},Player ${pos},${pos},BUF,5,1,@ HOU`, `1,${i+101},Other ${pos},${pos},HOU,8,1,vs BUF`]).join('\n');
  const window = createLoader({
    '2026_Season.csv': 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P\n' + positions.map((pos, i) => `2026,${i+1},Player ${pos},${pos},BUF,5,1`).join('\n'),
    '2026_AllWKs.csv': weekly, 'Schedule2026.csv': scheduleCsv,
  });
  const snapshot = await window.activateRosters2026GameLogs();
  const local = build2026MatchupData({ weeklyRows: parse2026Csv(weekly), scheduleRows: parse2026Csv(scheduleCsv) });
  const analysis = Data.matchupAnalysis(local.model, local.summary, {}, local.offenses);
  const profile = fs.readFileSync(new URL('../DH_P2.53/scripts/rosters-gamelogs-profile.js', import.meta.url), 'utf8');
  const slice = (text, from, to) => text.slice(text.indexOf(from), text.indexOf(to, text.indexOf(from)));
  const context = vm.createContext({ pageType: 'rosters' });
  vm.runInContext(slice(appSource, 'function getOpponentDefenseRank(', 'let tableCoreLoaderPromise')
    + slice(profile, 'const profileTeam =', '  function renderUpcomingMatchup('), context);
  positions.forEach((pos, i) => {
    const rank = defenseMetric(analysis.byTeam.get('HOU').metrics[pos].actual).rank;
    assert.equal(context.upcomingProfileMatchup(snapshot, 'BUF', pos, 4).rank, rank);
    for (const week of [1, 4]) assert.equal(context.getOpponentDefenseRank(snapshot.weeklyStats[week][i+1].opponent_rank), rank);
    assert.equal(snapshot.weeklyStats[1][i+1].fpt_ppr, 5);
    assert.equal(snapshot.weeklyStats[4][i+1].fpt_ppr, undefined);
    assert.equal(snapshot.weeklyStats[7][i+1].opponent_rank, undefined);
  });
  assert.equal(snapshot.defenseByTeam.HOU.QBRK, 2, 'SOS retains the calculated allowance direction');
  assert.equal(snapshot.matchupRanksByTeam.HOU.QBRK, 32, 'legacy display adapter reverses into strength rank 1');
  assert.equal(snapshot.latestRecordedWeek, 1); assert.equal(snapshot.matchupRankError, null);
  assert.ok(window.requests.every(r => !r.sheet));
});

test('invalid local matchup data leaves ranks unavailable while preserving season and weekly stats', async () => {
  const window = createLoader({ '2026_Season.csv': season,
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,VS,vsRK\n1,4984,QB,BUF,5,1,@ BAL,30',
  });
  const snapshot = await window.activateRosters2026GameLogs();
  assert.ok(snapshot.matchupRankError);
  assert.equal(snapshot.weeklyStats[1]['4984'].opponent_rank, undefined);
  assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, 5);
  assert.equal(snapshot.seasonStats['4984'].fpts_ppr, 35.66);
  assert.ok(window.requests.every(r => !r.sheet));
});

test('projection-only players use calculated ranks whether projections finish before or after the Game Logs snapshot', async () => {
  for (const late of [false, true]) {
    let release;
    const held = new Promise(resolve => { release = resolve; });
    const rows = 'SZN,SLPR_ID,POS,TM,10\n2026,99999,RB,BUF,OUT';
    const window = createLoader({ '2026_Season.csv': season, DRK: defense,
      FPFA: 'TM,QBrk,RBrk,WRrk,TErk\nHOU,4,7,1,32',
      '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P\n1,4984,QB,BUF,5,1\n1,2,RB,BUF,3,1',
      'Schedule2026.csv': 'TM,1,10,18\nBUF,@ HOU,@ HOU,vs NYJ',
      PROJ: late ? held.then(() => rows) : rows,
    });
    const projections = window.ensureRosters2026ProjectionsLoaded();
    if (!late) await projections;
    const snapshot = await window.activateRosters2026GameLogs();
    if (late) {
      assert.equal(snapshot.weeklyStats[10]['99999'], undefined);
      release();
      await projections;
    }
    const stats = snapshot.weeklyStats[10]['99999'];
    assert.equal(stats.opponent_rank, 32, 'projection-only players reuse the calculated defense strength');
    assert.equal(stats.opponent, '@ HOU');
    assert.equal(stats.proj, 'OUT');
    assert.equal(stats.fpt_ppr, undefined);
    assert.equal(stats.__hasRecordedStats, false);
    assert.equal(snapshot.latestRecordedWeek, 1);
  }
});

test('Rosters 2026 ranks split the three-game PPG pool from the reduced position-volume gates', async () => {
  const rows = [], cases = [];
  let id = 10000;
  for (const [pos, header, stat, minimum] of [['QB', 'paATT', 'pass_att', 60], ['RB', 'CAR', 'rush_att', 16],
    ['WR', 'RR', 'rr', 48], ['TE', 'RR', 'rr', 48]]) {
    const ids = {};
    for (const [label, games, volume, points] of [['boundary', 3, minimum, 30], ['below', 3, minimum - 1, 30],
      ['low', 3, 0, 0], ['short', 2, minimum * 2, 100]]) {
      ids[label] = String(id++);
      const values = { paATT: 0, CAR: 0, RR: 0, [header]: volume };
      rows.push(`2026,${ids[label]},Fixture,${pos},BUF,${points},${games},${values.paATT},${values.CAR},${values.RR}`);
    }
    cases.push({ ids, stat });
  }
  const window = createLoader({ '2026_Season.csv': 'SZN,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,paATT,CAR,RR\n' + rows.join('\n'), DRK: defense,
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP\n' + [1, 2, 3, 4].map(week => `${week},10000,QB,BUF,1,1,20`).join('\n') });
  const snapshot = await window.activateRosters2026GameLogs();
  assert.equal(snapshot.rankQualifierWeeks, 4);
  for (const { ids, stat } of cases) {
    for (const ranks of [snapshot.seasonRanks, snapshot.cardSeasonRanks]) {
      assert.equal(ranks[ids.boundary][stat], 2);
      assert.equal(ranks[ids.below][stat], undefined);
      assert.equal(ranks[ids.boundary].ppg, 1);
      assert.equal(ranks[ids.below].ppg, ranks === snapshot.seasonRanks ? 1 : 2, 'preserve each existing tie convention');
      assert.equal(ranks[ids.low].ppg, 3);
      assert.equal(ranks[ids.short].ppg, undefined, 'two-game volume/high-scoring players stay out of PPG');
    }
    assert.equal(snapshot.seasonRanks[ids.low].fpts, 4, 'modal FPTS remains unrestricted');
    assert.equal(snapshot.seasonRanks[ids.short].fpts, 1);
  }
});

test('Rosters Overview comparison retains literal DH totals, rates and age without deriving missing fields', async () => {
  const window = createLoader({
    '2026_Season.csv': season.replace('\n', ',TD(t),OPP,IMP/OPP,AGE\n') + ',0,31,0%,30.3',
    DRK: defense,
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP\n1,4984,QB,BUF,35.66,1,58',
  });
  const snapshot = await window.activateRosters2026GameLogs();
  const stats = snapshot.seasonStats['4984'];
  assert.equal(stats.td_total, 0);
  assert.equal(stats.opp, 31);
  assert.equal(stats.imp_per_opp, 0);
  assert.equal(stats.age, 30.3);
  assert.equal(stats.yds_total, undefined);
  assert.equal(snapshot.seasonRanks['4984'].age, undefined, 'identity metadata is not performance-ranked');
  assert.equal(snapshot.scheduleByTeam.BUF[7], 'BYE', 'team schedule also covers roster players absent from the season totals');
});

test('Rosters ignores retired rank feeds and embedded vsRK cells in favor of recorded scoring', async () => {
  const window = createLoader({ '2026_Season.csv': season,
    DRK: 'bad', FPFA: 'bad',
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,vsRK\n1,4984,QB,BUF,35.66,1,58,2',
  });
  const snapshot = await window.activateRosters2026GameLogs();
  assert.equal(snapshot.weeklyStats[1]['4984'].opponent_rank, 32);
  assert.equal(snapshot.weeklyStats[2]['4984'].opponent_rank, undefined, 'a defense without recorded games is unavailable');
  assert.equal(snapshot.defenseByTeam.HOU.QBRK, 1);
  assert.ok(window.requests.every(r => !r.sheet));
  assert.equal(window.getRosters2026PlayerRanks('4984').total_pts, '35.7');
});

test('Rosters preserves share values and ranks across DH/weekly CSV header renaming', async () => {
  const newHeaders = 'TDS%,YS%,ruTDS%,ruYS%,recTDS%,recYS%';
  const legacyHeaders = 'TMS,YMS,ruTMS,ruYMS,recTMS,recYMS';
  for (const headers of [newHeaders, legacyHeaders]) {
    const window = createLoader({
      '2026_Season.csv': season.replace('\n', `,${headers}\n`) + ',0.125,12.5%,25,0,1%,NA',
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
      '2026_Season.csv': season,
      DRK: defense,
      '2026_AllWKs.csv': `${header},SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n2,4984,"Allen, Josh",QB,BUF,0,0,0,OUT\n1,4984,"Allen, Josh",QB,BUF,-2,1,30,22.5`,
    });
    const snapshot = await window.ensureRosters2026GameLogsLoaded();
    assert.equal(snapshot.seasonStats['4984'].fpts_ppr, 35.66);
    assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, -2);
    assert.equal(snapshot.weeklyStats[1]['4984'].snp, 30);
    assert.equal(snapshot.weeklyStats[1]['4984'].proj, '22.5');
    assert.equal(snapshot.weeklyStats[1]['4984'].opponent_rank, 32);
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
    ['', undefined, /empty/],
    ['<html>Sign in</html>', undefined, /missing or invalid columns/],
    ['WK,SLPR_ID,POS,TM,FPT_PPR\n2026,4984,QB,BUF,99', undefined, /invalid week number/],
    ['WK,SLPR_ID,POS,TM,FPT_PPR\n0,4984,QB,BUF,99', undefined, /invalid week number/],
    ['', 404, /could not load \(404\)/],
    ['', new Error('Network unavailable'), /Network unavailable/],
  ]) {
    const window = createLoader({ '2026_Season.csv': season, DRK: defense, '2026_AllWKs.csv': csv }, { '2026_AllWKs.csv': failure });
    const snapshot = await window.activateRosters2026GameLogs();
    assert.match(snapshot.weekErrors[1], message);
    assert.equal(Object.keys(snapshot.weekErrors).length, 18);
    assert.equal(window.state.playerSeasonStats['4984'].fpts_ppr, 35.66);
    assert.equal(snapshot.weeklyStats[1]['4984'].fpt_ppr, undefined);
    assert.equal(snapshot.weeklyStats[1]['4984'].__hasRecordedStats, false);
    assert.equal(snapshot.weeklyStats[1]['4984'].opponent, '@ HOU');
    assert.equal(window.state.activeRostersGameLogsSeason, '2026');
    assert.equal(window.requests.length, 3);
  }
});

test('Rosters loads all CSV weeks in one request, retains projections and reuses its cached snapshot', async () => {
  const window = createLoader({
    '2026_Season.csv': season,
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
  assert.deepEqual(window.requests.map(({ sheet }) => sheet).filter(Boolean).sort(), []);
  assert.equal(window.requests.length, 3);
});

test('Rosters parses the shipped combined weekly file through its existing stat mappings', async () => {
  const csv = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url), 'utf8');
  const window = createLoader({ '2026_Season.csv': season, '2026_AllWKs.csv': csv,
    'Schedule2026.csv': fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv', import.meta.url), 'utf8') });
  const snapshot = await window.activateRosters2026GameLogs();
  assert.equal(snapshot.matchupRankError, null);
  const allen = snapshot.weeklyStats[4]['4984'];
  assert.equal(allen.fpt_ppr, 19.52);
  assert.equal(allen.snp, 59);
  assert.equal(allen.proj, '23.4');
  assert.equal(allen.__hasRecordedStats, true);
  // This smoke check reads the changing shipped results file. Its first WK
  // field is numeric; discover completed weeks instead of freezing Week 4.
  const sourceWeeks = [...new Set(csv.split(/\r?\n/).slice(1)
    .map(line => Number(/^"?(\d+)"?,/.exec(line)?.[1]))
    .filter(week => Number.isInteger(week) && week >= 1 && week <= 18))];
  assert.equal(snapshot.latestRecordedWeek, Math.max(...sourceWeeks));
  assert.equal(snapshot.rankQualifierWeeks, sourceWeeks.length);
  assert.equal(Object.keys(snapshot.weekErrors).length, 0);
});

test('Rosters requires the season CSV SZN year header', async () => {
  const window = createLoader({ '2026_Season.csv': season.replace('SZN,', 'WK,') });
  await assert.rejects(window.ensureRosters2026SeasonRowsLoaded(), /2026_Season.csv has missing or invalid columns/);
});

test('Rosters Career and Game Logs share one concurrent local season read without activating a season', async () => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const window = createLoader({ '2026_Season.csv': pending, DRK: defense });
  const career = window.ensureRosters2026SeasonRowsLoaded();
  const sameRows = window.ensureRosters2026SeasonRowsLoaded();
  assert.equal(window.requests.length, 1, 'Career starts only the season CSV, independent of modal feeds');
  assert.equal(window.state.activeRostersGameLogsSeason, undefined);
  release(season);
  const [rows, same] = await Promise.all([career, sameRows]);
  assert.equal(rows, same);
  assert.equal(await window.ensureRosters2026SeasonRowsLoaded(), rows);
  assert.equal(window.state.playerSeasonStats, undefined);
  const snapshot = await window.activateRosters2026GameLogs();
  assert.equal(snapshot.seasonStats['4984'].fpts_ppr, Number(rows[0].FPT_PPR));
  assert.equal(window.requests.filter(({ pathname }) => pathname.endsWith('/2026_Season.csv')).length, 1);
  assert.ok(window.requests.every(({ sheet }) => sheet !== 'DH'));
});

test('Rosters rejects invalid season files without fallback and retries the local file after a failure', async () => {
  for (const [csv, failure, message] of [
    ['', 404, /could not load \(404\)/],
    ['', new Error('Network unavailable'), /Network unavailable/],
    ['', undefined, /missing or invalid columns/],
    ['<html>Not found</html>', undefined, /missing or invalid columns/],
    [season.replace('GM_P,', 'wrong,'), undefined, /missing or invalid columns/],
    [season.replace('2026,', '2025,'), undefined, /different season/],
    [season.replace('4984,', 'no-id,'), undefined, /no valid player rows/],
  ]) {
    const tables = { '2026_Season.csv': csv };
    const failures = { '2026_Season.csv': failure };
    const window = createLoader(tables, failures);
    await assert.rejects(window.ensureRosters2026SeasonRowsLoaded(), message);
    assert.equal(window.requests.length, 1, 'A bad season file cannot fetch another source');
    assert.equal(window.requests[0].sheet, null);
    assert.equal(window.state.playerSeasonStats, undefined);
    tables['2026_Season.csv'] = season;
    delete failures['2026_Season.csv'];
    const rows = await window.ensureRosters2026SeasonRowsLoaded();
    assert.equal(rows[0].FPT_PPR, '35.66');
    assert.equal(window.requests.length, 2);
  }
});

test('Rosters reads all maintained season CSV players with existing totals, rates, missing cells and ranks', async () => {
  const csv = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/SeasonStats/2026_Season.csv', import.meta.url), 'utf8');
  const window = createLoader({ '2026_Season.csv': csv, DRK: defense });
  const rows = await window.ensureRosters2026SeasonRowsLoaded();
  const snapshot = await window.activateRosters2026GameLogs();
  assert.ok(rows.length > 0);
  assert.equal(Object.keys(snapshot.seasonStats).length, rows.length);
  for (const row of rows) {
    const stats = snapshot.seasonStats[row.SLPR_ID];
    assert.equal(stats.fpts_ppr, Number(row.FPT_PPR));
    assert.equal(stats.games_played, Number(row.GM_P));
    assert.equal(stats.ppg, Number(row.GM_P) > 0 ? Number(row.FPT_PPR) / Number(row.GM_P) : 0);
    assert.equal(stats.pos, row.POS);
    for (const [header, key] of [['paYDS', 'pass_yd'], ['CAR', 'rush_att'], ['recYDS', 'rec_yd'], ['AYA', 'adjusted_ypa'],
      ['TPRR', 'tprr'], ['EPA/DB', 'epa_per_db'], ['MTF/A', 'mtf_per_att'], ['TD(t)', 'td_total']]) {
      const expected = Number(row[header]);
      assert.equal(stats[key], Number.isFinite(expected) ? expected : undefined, `${row.SLPR_ID}: ${header}`);
    }
  }
  assert.equal(window.requests.filter(({ pathname }) => pathname.endsWith('/2026_Season.csv')).length, 1);
});

test('a failed background 2025 CSV load cannot erase active Rosters 2026 data and can retry', async () => {
  const window = createLoader({ '2026_Season.csv': season, DRK: defense });
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

test('Rosters boot reads PROJ once through Week 18 without delaying results or sharing historical state', async () => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  const window = createLoader({ '2026_Season.csv': season, DRK: defense,
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n9,4984,QB,BUF,19.52,1,59,23.4',
    // Shuffled numbered headers and conflicting inj/v cells enforce the live
    // PROJ schema while fake box scores verify the future-only merge boundary.
    PROJ: held.then(() => 'SZN,SLPR_ID,POS,TM,v10,inj10,18,10,11,12,13,14,15,16,17,FPT_PPR,SNP\n2026,4984,QB,BUF,@ NYJ,OUT,-1.5,22.0,0,BYE,21.2,OUT,0,18.2,,999,99'),
  }, {}, true);
  const first = window.ensureRosters2026ProjectionsLoaded();
  assert.equal(window.ensureRosters2026ProjectionsLoaded(), first);
  const snapshot = await window.activateRosters2026GameLogs();
  assert.equal(snapshot.weeklyStats[10]['4984'].proj, undefined, 'League snapshot must resolve while projection network is pending');
  const historical = { 10: { '4984': { proj: '2025 projection' } } };
  window.state.activeRostersGameLogsSeason = '2025';
  window.state.playerWeeklyStats = historical;
  release();
  await first;
  assert.equal(window.state.playerWeeklyStats, historical, 'Late 2026 projections cannot activate or change historical data');
  for (const [week, proj] of [[10, '22.0'], [11, '0'], [12, 'BYE'], [13, '21.2'], [14, 'OUT'], [15, '0'], [16, '18.2'], [17, ''], [18, '-1.5']]) {
    assert.equal(snapshot.weeklyStats[week]['4984'].proj, proj);
    assert.equal(snapshot.weeklyStats[week]['4984'].__hasRecordedStats, false);
  }
  assert.equal(snapshot.weeklyStats[13]['4984'].fpt_ppr, undefined);
  assert.equal(snapshot.weeklyStats[9]['4984'].proj, '23.4');
  assert.equal(snapshot.weeklyStats[9]['4984'].fpt_ppr, 19.52);
  assert.equal(snapshot.weeklyStats[10]['4984'].fpt_ppr, undefined);
  assert.equal(snapshot.weeklyStats[10]['4984'].snp, undefined);
  assert.equal(snapshot.latestRecordedWeek, 9);
  assert.equal(snapshot.rankQualifierWeeks, 1);
  await window.activateRosters2026GameLogs();
  assert.equal(window.state.currentNflWeek, 10);
  assert.equal(window.state.playerProjectionWeeks[10], true);
  assert.equal(window.state.playerProjectionWeeks[9], undefined);
  assert.deepEqual(window.requests.map(({ sheet }) => sheet).filter(Boolean), ['PROJ']);
  assert.equal(window.requests.filter(({ pathname }) => pathname.endsWith('2026_AllWKs.csv')).length, 1);
});

test('Rosters PROJ preserves statuses, skips completed weeks and isolates missing numbered columns', async () => {
  const window = createLoader({ '2026_Season.csv': season, DRK: defense,
    '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP,PROJ\n10,4984,QB,BUF,19.52,1,59,23.4',
    PROJ: 'SZN,SLPR_ID,POS,TM,10,12,18\n2026,4984,QB,BUF,999,OUT,25.0\n2026,99999,RB,BUF,999,PUP,8.5',
  });
  const result = await window.ensureRosters2026ProjectionsLoaded();
  const snapshot = await window.activateRosters2026GameLogs();
  assert.equal(snapshot.weeklyStats[10]['4984'].proj, '23.4');
  assert.equal(result.projectionRows[10], undefined);
  assert.equal(snapshot.weeklyStats[12]['4984'].proj, 'OUT');
  assert.equal(snapshot.weeklyStats[12]['99999'].proj, 'PUP');
  assert.equal(snapshot.weeklyStats[18]['99999'].proj, '8.5');
  assert.equal(snapshot.weeklyStats[12]['99999'].__hasRecordedStats, false);
  assert.equal(snapshot.seasonStats['99999'], undefined);
  assert.match(result.projectionErrors[11], /Week 11 projection column/);
  assert.equal(snapshot.weeklyStats[11]['4984'].proj, undefined);
  assert.equal(snapshot.latestRecordedWeek, 10);
  assert.equal(snapshot.seasonStats['4984'].fpts_ppr, 35.66);
});

test('Rosters contains failed or malformed PROJ exports without requesting individual WK tabs', async () => {
  for (const [csv, failure, message] of [
    ['', 400, /could not load/],
    ['SZN,SLPR_ID,POS,TM,10\n2025,4984,QB,BUF,22.0', null, /different season/],
    ['<html>Sign in</html>', null, /invalid columns/],
    ['SZN,SLPR_ID,POS,TM,10\n2026,not-a-player,QB,BUF,22.0', null, /no valid player/],
  ]) {
    const window = createLoader({
      '2026_AllWKs.csv': 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP\n9,4984,QB,BUF,19.52,1,59', PROJ: csv,
    }, { PROJ: failure });
    const result = await window.ensureRosters2026ProjectionsLoaded();
    assert.equal(Object.keys(result.projectionRows).length, 0);
    for (let week = 10; week <= 18; week++) assert.match(result.projectionErrors[week], message);
    assert.deepEqual(window.requests.map(({ sheet }) => sheet).filter(Boolean), ['PROJ']);
  }
});

test('Rosters skips PROJ if its CSV is invalid or no future projection columns remain', async () => {
  for (const csv of ['<html>Sign in</html>', 'WK,SLPR_ID,POS,TM,FPT_PPR,GM_P,SNP\n18,4984,QB,BUF,19.52,1,59']) {
    const window = createLoader({ '2026_AllWKs.csv': csv });
    const projections = await window.ensureRosters2026ProjectionsLoaded();
    assert.equal(Object.keys(projections.projectionRows).length, 0);
    assert.equal(window.requests.length, 1);
  }
});
