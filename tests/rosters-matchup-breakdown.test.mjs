import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createMatchupStore, resolveMatchupSelection } from '../DH_P2.53/rosters/matchup-breakdown/data.js';
import Data from '../DH_P2.53/rosters/matchup-breakdown/model.js';

// The source model is used only as a test oracle. Rosters runtime files never
// import it; a divergent summary/weekly fixture catches source-ownership drift.
const sourceData = createRequire(import.meta.url)('../DH_P2.53/matchups/data-model.js');
const positions = ['QB', 'RB', 'WR', 'TE', 'ALL'];
const weekly = 'WK,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,VS\n' + [
  '1,1,"Quarter, One",QB,ARI,10.25,vs BAL',
  '1,2,Runner,RB,ARI,0,vs BAL',
  '1,3,Receiver,WR,ARI,-2,vs BAL',
  '1,4,Tight End,TE,ARI,3.5,vs BAL',
  '1,5,Other Quarter,QB,BAL,20.5,@ ARI',
  '1,6,Other Runner,RB,BAL,8,@ ARI',
  '1,7,Other Receiver,WR,BAL,9,@ ARI',
  '1,8,Other Tight End,TE,BAL,1,@ ARI',
  '2,1,"Quarter, One",QB,ARI,14.75,@ BAL',
  '2,5,Other Quarter,QB,BAL,22.5,vs ARI',
].join('\n');
const summary = [
  ['TM', 'w1', 'w2', ...positions.flatMap(pos => [pos, `${pos}x`, `${pos}rk`, `${pos}vs`, `${pos}vX`, `${pos}vRK`])].join(','),
  ['BAL', 'ARI', 'ARI', ...positions.flatMap(() => ['90.1', '45', '7', '80.2', '40.1', '9'])].join(','),
  ['ARI', 'BAL', 'BAL', ...positions.flatMap(() => ['70', '35', '13', '75', '37.5', '12'])].join(','),
].join('\n');
const offense = [
  ['TM', ...positions.flatMap(pos => [pos, `${pos}RK`, `${pos}x`])].join(','),
  ['ARI', ...positions.flatMap(() => ['33.3', '11', '11.1'])].join(','),
  ['BAL', ...positions.flatMap(() => ['66.6', '3', '22.2'])].join(','),
].join('\n');
const bySheet = { FPA: weekly, FPFA: summary, FPF: offense };
const response = text => ({ ok: true, text: async () => text });
const fetchFixture = async url => response(bySheet[new URL(url).searchParams.get('sheet')]);

test('Start/Sit preparation starts all live reads immediately and reuses one in-flight set', async () => {
  const calls = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const store = createMatchupStore({ fetchImpl: async (url, options) => {
    calls.push({ url, options });
    await gate;
    return fetchFixture(url);
  } });
  const first = store.prepare();
  const concurrent = store.prepare();
  assert.equal(first, concurrent);
  assert.equal(store.status, 'loading');
  assert.equal(calls.length, 3);
  for (const { url, options } of calls) {
    const parsed = new URL(url);
    assert.equal(parsed.pathname, '/spreadsheets/d/16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94/export');
    assert.equal(parsed.searchParams.get('format'), 'csv');
    assert.equal(options.cache, 'no-store');
  }
  release();
  await first;
  assert.equal(store.status, 'ready');
  await store.prepare();
  assert.equal(calls.length, 3);
  assert.ok(['all', 'home', 'away'].every(venue => store.analysis(venue)));
});

test('the independently owned model matches every source metric, venue and player filter', async () => {
  const store = createMatchupStore({ fetchImpl: fetchFixture });
  await store.prepare();
  const original = {
    model: sourceData.readSource(weekly, { name: '2026-Wkly / FPA' }),
    summary: sourceData.readFPFA(summary, { name: '2026-Wkly / FPFA' }),
    offenses: sourceData.readOffenses(offense, { name: '2026-Wkly / FPF' }),
  };
  for (const venue of ['all', 'home', 'away']) {
    assert.deepEqual(store.analysis(venue), sourceData.matchupAnalysis(original.model, original.summary, { venue }, original.offenses));
    for (const pos of positions) for (const hideZero of [true, false]) {
      const scope = { team: 'BAL', pos, venue, hideZero, minPoints: hideZero ? 1 : null };
      assert.deepEqual(Data.selectResults(store.snapshot.model, scope), sourceData.selectResults(original.model, scope));
    }
  }
  assert.equal(store.snapshot.model.audit.zeroResults, 1);
  assert.equal(store.snapshot.model.audit.negativeResults, 1);
});

test('preview percent/rank match the panel and average delta uses unrounded totals', async () => {
  const store = createMatchupStore({ fetchImpl: fetchFixture });
  await store.prepare();
  const metric = store.preview({ basePos: 'QB', pos: 'SUPER_FLEX', matchup: { opponent: 'vs BAL' } });
  assert.equal(metric.actualRank, 7);
  assert.equal(metric.actual.total, 90.1);
  assert.equal(metric.expectedTotal, 80.2);
  assert.equal(metric.delta, 9.9);
  assert.equal(metric.deltaPerGame, 4.95);
  assert.equal(metric.deltaPct, store.analysis().byTeam.get('BAL').metrics.QB.deltaPct);
  assert.notEqual(metric.deltaPerGame, metric.actual.avg - metric.expectedAvg);
  const below = store.preview({ pos: 'WR', matchup: { opponent: '@ ARI' } });
  assert.equal(below.deltaPerGame, -2.5);
  assert.ok(below.deltaPct < 0);
});

test('opponent resolution preserves base positions and rejects byes or missing defenses', () => {
  assert.deepEqual(resolveMatchupSelection({ basePos: 'RB', pos: 'FLEX', matchup: { opponent: '@ JAC' } }), { team: 'JAX', pos: 'RB' });
  assert.deepEqual(resolveMatchupSelection({ pos: 'WR', matchup: { opponent: 'WAS' } }), { team: 'WAS', pos: 'WR' });
  for (const opponent of ['BYE', 'NA', 'N/A', '', 'UNK']) {
    assert.equal(resolveMatchupSelection({ pos: 'QB', matchup: { opponent } }), null);
  }
  assert.equal(resolveMatchupSelection({ pos: 'QB', matchup: { opponent: 'BAL', isBye: true } }), null);
});

test('failed or drifted sources publish no partial data and can be retried', async () => {
  for (const failure of ['network', 'empty', 'schema']) {
    let broken = true;
    const store = createMatchupStore({ fetchImpl: async url => {
      const sheet = new URL(url).searchParams.get('sheet');
      if (broken && sheet === 'FPFA') {
        if (failure === 'network') return { ok: false, status: 503 };
        return response(failure === 'empty' ? '  ' : summary.replace('QBvRK', 'QBOtherRank'));
      }
      return fetchFixture(url);
    } });
    await assert.rejects(store.prepare());
    assert.equal(store.status, 'error');
    assert.equal(store.snapshot, null);
    assert.equal(store.analysis(), null);
    assert.equal(store.preview({ pos: 'QB', matchup: { opponent: 'BAL' } }), null);
    broken = false;
    await store.prepare();
    assert.equal(store.status, 'ready');
  }
});

test('a new document store loads updated Sheets instead of an earlier snapshot', async () => {
  let updated = false, requests = 0;
  const fetchImpl = async url => {
    requests++;
    const sheet = new URL(url).searchParams.get('sheet');
    return response(sheet === 'FPFA' && updated ? summary.replaceAll('90.1', '100.1') : bySheet[sheet]);
  };
  const first = createMatchupStore({ fetchImpl });
  await first.prepare();
  updated = true;
  const next = createMatchupStore({ fetchImpl });
  await next.prepare();
  assert.equal(first.analysis().byTeam.get('BAL').metrics.QB.actual.total, 90.1);
  assert.equal(next.analysis().byTeam.get('BAL').metrics.QB.actual.total, 100.1);
  assert.equal(requests, 6);
});
