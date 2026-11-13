import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createMatchupStore, resolveMatchupSelection } from '../DH_P2.53/rosters/matchup-breakdown/data.js';
import Data from '../DH_P2.53/rosters/matchup-breakdown/model.js';
import { defenseMetric, rankColor, ordinalRank } from '../DH_P2.53/rosters/matchup-breakdown/rank-view.js';
import { positions, schedule, weekly, fixtureFetch, response } from './fixtures/matchup-csv.mjs';
const sourceData = createRequire(import.meta.url)('../DH_P2.53/matchups/data-model.js');
const sourceView = createRequire(import.meta.url)('../DH_P2.53/matchups/chart-lab-model.js');
const fetchFixture = fixtureFetch();

test('Start/Sit prepares two local files once for concurrent consumers and all venue panels', async () => {
  const calls = []; let release;
  const gate = new Promise(resolve => { release = resolve; });
  const store = createMatchupStore({ fetchImpl: async (url, options) => {
    calls.push(String(url)); await gate; return fetchFixture(url, options);
  } });
  const first = store.prepare();
  assert.equal(store.prepare(), first);
  assert.equal(store.status, 'loading');
  assert.equal(calls.length, 2);
  assert.ok(calls.every(url => !url.includes('google.com')));
  release(); await first; await store.prepare();
  assert.equal(store.status, 'ready');
  assert.equal(calls.length, 2);
  for (const venue of ['all', 'home', 'away']) {
    const { model, summary, offenses } = store.snapshot;
    assert.deepEqual(store.analysis(venue), sourceData.matchupAnalysis(model, summary, { venue }, offenses));
    for (const pos of positions) for (const hideZero of [true, false]) {
      const scope = { team: 'BAL', pos, venue, minPoints: hideZero ? 1 : null };
      assert.deepEqual(Data.selectResults(model, scope), sourceData.selectResults(model, scope));
    }
  }
});

test('preview, filtered panels, player scores and SOS use one precise recorded snapshot', async () => {
  const store = createMatchupStore({ fetchImpl: fixtureFetch() }); await store.prepare();
  const preview = store.preview({ basePos: 'QB', pos: 'SUPER_FLEX', matchup: { opponent: 'vs BAL' } });
  assert.equal(preview.actual.total, 25);
  assert.equal(preview.actual.avg, 12.5);
  assert.equal(preview.actualRank, 1);
  assert.equal(preview.expectedAvg, 12.5);
  assert.equal(preview.deltaPerGame, 0);
  assert.equal(preview.sosRank, 1);
  for (const pos of positions) for (const venue of ['all', 'home', 'away']) {
    assert.equal(store.analysis(venue).byTeam.get('BAL').metrics[pos].sosRank,
      store.snapshot.summary.byTeam.get('BAL').metrics[pos].expectedRank);
  }
  assert.equal(store.snapshot.model.audit.zeroResults, 2);
  assert.equal(store.snapshot.model.audit.negativeResults, 1);
  assert.equal(store.snapshot.model.results[1].stats.CAR, 5);
  assert.equal(store.snapshot.model.results[1].stats.RECYDS, -2);
});

test('failed, empty or malformed local inputs publish no partial panel and can retry', async () => {
  for (const failure of ['network', 'empty', 'schema']) {
    let broken = true;
    const store = createMatchupStore({ fetchImpl: async (url, options) => {
      if (broken && String(url).endsWith('2026_AllWKs.csv')) return failure === 'network'
        ? response('', 503) : response(failure === 'empty' ? '' : 'bad');
      return fetchFixture(url, options);
    } });
    await assert.rejects(store.prepare());
    assert.equal(store.status, 'error'); assert.equal(store.snapshot, null);
    assert.equal(store.analysis(), null);
    assert.equal(store.preview({ pos: 'QB', matchup: { opponent: 'BAL' } }), null);
    broken = false; await store.prepare(); assert.equal(store.status, 'ready');
  }
});

test('a new page recalculates updated CSV scores, averages, ranks and player box scores', async () => {
  const previous = createMatchupStore({ fetchImpl: fixtureFetch() }); await previous.prepare();
  const next = createMatchupStore({ fetchImpl: fixtureFetch(weekly.replace('ARI,10.25,', 'ARI,20.25,')) }); await next.prepare();
  assert.equal(previous.analysis().byTeam.get('BAL').metrics.QB.actual.total, 25);
  assert.equal(next.analysis().byTeam.get('BAL').metrics.QB.actual.total, 35);
  assert.equal(next.snapshot.offenses.byTeam.get('ARI').metrics.QB.avg, 17.5);
  assert.equal(next.snapshot.model.results[0].pts, 20.25);
  assert.equal(next.snapshot.model.results[0].stats.PAYDS, 234);
});

test('Rosters defense display matches Matchups for every rank, position and venue without mutating analysis', async () => {
  for (const rankOrder of ['ascending', 'descending']) for (let rank = 1; rank <= 32; rank++) {
    const stat = Object.freeze({ total: 50, avg: 0, games: 2, rank, pool: 32, rankOrder });
    const display = defenseMetric(stat);
    assert.deepEqual(display, sourceView.defenseMetric(stat));
    assert.equal(rankColor(display), sourceView.rankColor(display));
    assert.equal(rankColor(display), rankColor(stat), 'same defense retains its difficulty color');
    assert.equal(stat.rank, rank);
  }
  const store = createMatchupStore({ fetchImpl: fetchFixture });
  await store.prepare();
  for (const venue of ['all', 'home', 'away']) for (const pos of positions) {
    const metric = store.analysis(venue).byTeam.get('BAL').metrics[pos];
    const before = structuredClone(metric);
    const display = defenseMetric(metric.actual);
    assert.deepEqual(display, sourceView.defenseMetric(metric.actual));
    if (venue !== 'all') assert.equal(display.rank, metric.actual.rank, 'venue ranks are already best-defense-first');
    assert.deepEqual(metric, before, 'source stats, ties, expected ranks and SOS stay intact');
  }
  for (const rank of [null, undefined, '', 'NA', 0, -1, 33, 2.5, NaN, Infinity]) {
    assert.equal(defenseMetric({ rank, pool: 32, rankOrder: 'descending' }).rank, null);
  }
  assert.equal(defenseMetric({ rank: 1, pool: 0, rankOrder: 'descending' }).rank, null);
  assert.equal(defenseMetric({ rank: 1, pool: 2, rankOrder: 'ascending' }).rank, 1, 'sparse venue pools are not reversed');
  assert.equal(rankColor({ rank: 1, pool: 32, rankOrder: 'ascending' }), '#ffb2d8');
  assert.equal(rankColor({ rank: 32, pool: 32, rankOrder: 'ascending' }), '#75e0b7');
  assert.equal(rankColor({ rank: null, pool: 0 }), '#7b81a5');
  for (const [rank, text] of [[1, '1st'], [2, '2nd'], [3, '3rd'], [11, '11th'], [12, '12th'], [13, '13th'], [21, '21st'], [22, '22nd'], [23, '23rd'], [32, '32nd'], [null, '—']]) {
    assert.equal(ordinalRank(rank), text);
  }
});

test('opponent resolution preserves base positions and rejects byes or missing defenses', () => {
  assert.deepEqual(resolveMatchupSelection({ basePos: 'RB', pos: 'FLEX', matchup: { opponent: '@ JAC' } }), { team: 'JAX', pos: 'RB' });
  assert.deepEqual(resolveMatchupSelection({ pos: 'WR', matchup: { opponent: 'WAS' } }), { team: 'WAS', pos: 'WR' });
  for (const opponent of ['BYE', 'NA', 'N/A', '', 'UNK']) {
    assert.equal(resolveMatchupSelection({ pos: 'QB', matchup: { opponent } }), null);
  }
  assert.equal(resolveMatchupSelection({ pos: 'QB', matchup: { opponent: 'BAL', isBye: true } }), null);
});
