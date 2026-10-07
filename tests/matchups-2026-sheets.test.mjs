import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load2026MatchupSources } from '../DH_P2.53/matchups/data/2026-sheets.js';
import { get2026SheetCsvUrl } from '../DH_P2.53/scripts/nfl-2026-sheets.js';

const require = createRequire(import.meta.url);
const Data = require('../DH_P2.53/matchups/data-model.js');
const Lab = require('../DH_P2.53/matchups/chart-lab-model.js');
const positions = ['QB', 'RB', 'WR', 'TE', 'ALL'];
const workbook = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
const weekly = 'WK,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,VS\r\n' + [
  '1,1,"Quarter, One",QB,ARI,10.25,vs BAL',
  '1,2,Runner,RB,ARI,0,vs BAL',
  '1,3,Receiver,WR,ARI,-2,vs BAL',
  '1,4,Tight End,TE,ARI,3.5,vs BAL',
  '1,5,Other Quarter,QB,BAL,20.5,@ ARI',
  '1,6,Other Runner,RB,BAL,8,@ ARI',
  '1,7,Other Receiver,WR,BAL,9,@ ARI',
  '1,8,Other Tight End,TE,BAL,1,@ ARI',
].join('\r\n');
const summary = [
  ['TM', 'w1', ...positions.flatMap(pos => [pos, `${pos}x`, `${pos}rk`, `${pos}vs`, `${pos}vX`, `${pos}vRK`])].join(','),
  ['BAL', 'ARI', ...positions.flatMap(() => ['90.1', '30', '7', '80.2', '26.7', '9'])].join(','),
  ['ARI', 'BAL', ...positions.flatMap(() => ['70', '23.3', '13', '75', '25', '12'])].join(','),
].join('\n');
const offense = [
  ['TM', ...positions.flatMap(pos => [pos, `${pos}RK`, `${pos}x`])].join(','),
  ['ARI', ...positions.flatMap(() => ['33.3', '11', '11.1'])].join(','),
  ['BAL', ...positions.flatMap(() => ['66.6', '3', '22.2'])].join(','),
].join('\n');
const csvBySheet = { FPA: weekly, FPFA: summary, FPF: offense };
const response = (text, status = 200) => ({ ok: status === 200, status, text: async () => text });

test('Matchups maps the three live tabs to native CSV exports in DH\'s workbook', () => {
  for (const [sheet, gid] of [['FPF', '2006116709'], ['FPFA', '1845231826'], ['FPA', '1398845421']]) {
    const url = new URL(get2026SheetCsvUrl(sheet));
    assert.equal(url.pathname, `/spreadsheets/d/${workbook}/export`);
    assert.equal(url.searchParams.get('format'), 'csv');
    assert.equal(url.searchParams.get('gid'), gid);
    assert.equal(url.searchParams.get('sheet'), sheet);
  }
  // Weekly stats moved to the local CSV; remaining workbook feeds stay live.
  assert.throws(() => get2026SheetCsvUrl('WK1'), /2026_AllWKs\.csv/);
  assert.ok(get2026SheetCsvUrl('DH').includes('/gviz/tq?'));
  assert.ok(get2026SheetCsvUrl('TM_STAT').includes('/gviz/tq?'));
});

test('the live source boundary preserves parser headers, scores and each view\'s ownership', async () => {
  const calls = [];
  const sources = await load2026MatchupSources({ fetchImpl: async (url, options) => {
    const sheet = new URL(url).searchParams.get('sheet');
    calls.push({ sheet, options });
    return response(csvBySheet[sheet]);
  } });
  assert.equal(sources.season, 2026);
  assert.deepEqual(calls.map(call => call.sheet).sort(), ['FPA', 'FPF', 'FPFA']);
  assert.ok(calls.every(call => call.options.cache === 'no-store'));
  assert.equal(sources.weekly.csv, weekly);
  const model = Data.readSource(sources.weekly.csv, { name: sources.weekly.name });
  const published = Data.readFPFA(sources.summary.csv, { name: sources.summary.name });
  const offenses = Data.readOffenses(sources.offense.csv, { name: sources.offense.name });
  assert.equal(model.results[0].player, 'Quarter, One');
  assert.equal(model.audit.zeroResults, 1);
  assert.equal(model.audit.negativeResults, 1);
  const season = Data.matchupAnalysis(model, published, {}, offenses);
  const qb = season.byTeam.get('BAL').metrics.QB;
  assert.equal(qb.actual.total, 90.1);
  assert.equal(qb.actual.avg, 30);
  assert.equal(qb.actualRank, 7);
  assert.equal(qb.expectedTotal, 80.2);
  assert.equal(qb.expectedRank, 9);
  assert.equal(qb.entries[0].actual, 10.25);
  assert.equal(qb.entries[0].expected, 11.1);
  assert.equal(qb.entries[0].offenseRank, 11);
  const away = Data.matchupAnalysis(model, published, { venue: 'away' }, offenses);
  assert.equal(away.byTeam.get('BAL').metrics.QB.actual.total, 10.25);
  assert.equal(away.byTeam.get('BAL').metrics.QB.expectedTotal, 11.1);
  assert.ok(Data.summaryDifferences(model, published).length > 0);
  const charts = Lab.build(season, 'QB');
  assert.equal(charts.dumbbell.find(row => row.team === 'BAL').actualTotal, 90.1);
  assert.equal(charts.polar.find(row => row.team === 'BAL').actual, 10.25);
});

test('each load reads updated sheets rather than retaining an earlier snapshot', async () => {
  let revision = 'first', requests = 0;
  const fetchImpl = async () => { requests++; return response(revision); };
  assert.equal((await load2026MatchupSources({ fetchImpl })).weekly.csv, 'first');
  revision = 'updated';
  assert.equal((await load2026MatchupSources({ fetchImpl })).weekly.csv, 'updated');
  assert.equal(requests, 6);
});

test('SOS preserves each published ascending positional vRK across venue and week filters', () => {
  const ranks = [1, 8, 13, 21, 32];
  const positionalSummary = [
    summary.split('\n')[0],
    ['BAL', 'ARI', ...positions.flatMap((pos, i) => ['90.1', '30', '7', '80.2', '26.7', ranks[i]])].join(','),
    // A tied WR rank and a missing TE rank must stay as published, not be filled/re-ranked.
    ['ARI', 'BAL', ...positions.flatMap((pos, i) => ['70', '23.3', '13', '75', '25', [32, 21, 13, '', 1][i]])].join(','),
  ].join('\n');
  const model = Data.readSource(weekly), published = Data.readFPFA(positionalSummary), offenses = Data.readOffenses(offense);
  for (const scope of [{}, { venue: 'home' }, { venue: 'away' }, { from: 2, to: 2 }]) {
    const analysis = Data.matchupAnalysis(model, published, scope, offenses);
    positions.forEach((pos, i) => assert.equal(analysis.byTeam.get('BAL').metrics[pos].sosRank, ranks[i]));
    assert.equal(analysis.byTeam.get('ARI').metrics.WR.sosRank, 13);
    assert.equal(analysis.byTeam.get('ARI').metrics.TE.sosRank, null);
  }
  const all = Data.matchupAnalysis(model, published, {}, offenses).byTeam.get('BAL').metrics.QB;
  assert.equal(all.actualRank, 7);
  assert.equal(all.expectedTotal, 80.2);
  assert.equal(all.delta, 9.9);
  const away = Data.matchupAnalysis(model, published, { venue: 'away' }, offenses).byTeam.get('BAL').metrics.QB;
  assert.equal(away.sosRank, 1);
  assert.equal(away.expectedRank, 1); // Only BAL has an eligible away game in this fixture.
  const awayTE = Data.matchupAnalysis(model, published, { venue: 'away' }, offenses).byTeam.get('BAL').metrics.TE;
  assert.equal(awayTE.sosRank, 21);
  assert.equal(awayTE.expectedRank, 1); // Venue ranks do not replace the published SOS.
});

test('a failed, empty or inaccessible sheet rejects the set without a bundled fallback', async () => {
  for (const broken of [response('', 503), response('  '), new Error('Network unavailable')]) {
    await assert.rejects(load2026MatchupSources({ fetchImpl: async url => {
      const sheet = new URL(url).searchParams.get('sheet');
      if (sheet !== 'FPFA') return response(csvBySheet[sheet]);
      if (broken instanceof Error) throw broken;
      return broken;
    } }), /2026 FPFA could not load/);
  }
});

test('existing schema checks reject drift rather than relabeling or deriving another source', () => {
  assert.throws(() => Data.readSource(weekly.replace('WK,', 'SZN,')), /WEEK or WK/);
  assert.throws(() => Data.readOffenses(offense.replace('QBx', 'QBaverage')), /Missing required columns: QBX/);
  assert.throws(() => Data.readFPFA(summary.replace('QBvRK', 'QBexpectedRank')), /Missing required columns: QBVRK/);
});
