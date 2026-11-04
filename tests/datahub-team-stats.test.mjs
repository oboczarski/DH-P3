import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as dataHubModel from '../DH_P2.53/scripts/datahub-team-stats.js';
import * as rostersModel from '../DH_P2.53/scripts/rosters-team-stats.js';

// Exercise the production CSV parser too: TM_STAT percentages contain suffixes,
// and quoted yardage values must survive parsing without losing their precision.
const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function parseCsv('), source.indexOf('// ---------------------------------------------------------------------------\n// Cell styling')), context);
const parseCsv = context.parseCsv;
const row = { TM: 'BUF', 'Pa%': '51.1%', 'Ru%': '48.9%', 'paYds/G': '256.1', 'ruYds/G': '148.4' };

for (const [page, { build2026TeamStats, load2026TeamStats, build2026TeamRanks, get2026TeamStatColor }] of [['DataHub', dataHubModel], ['Rosters', rostersModel]]) {
  test(`${page}: team summary colors match every requested rank-band boundary`, () => {
    for (const [keys, colors] of [
      [['Pa%', 'Ru%'], ['#b178ff', '#78d3ff', '#78baff', '#e678ff']],
      [['paYds/G', 'ruYds/G'], ['#79ffd6eb', '#5aa7ff', '#957CFF', '#FF6FE1']],
    ]) {
      for (const key of keys) {
        for (const [band, ranks] of [[0, [1, 8]], [1, [9, 16]], [2, [17, 24]], [3, [25, 32]]]) {
          for (const rank of ranks) assert.equal(get2026TeamStatColor(key, rank), colors[band]);
        }
        for (const rank of [null, undefined, NaN, 0, -1, 33, 8.5]) assert.equal(get2026TeamStatColor(key, rank), '');
      }
    }
    assert.equal(get2026TeamStatColor('unknown', 1), '');
  });

  test(`${page}: TM_STAT maps exact source fields, team aliases, percentage units and real zeros`, () => {
    const teams = build2026TeamStats([row, { ...row, TM: 'WSH', 'paYds/G': '1,234.5', 'ruYds/G': '0', 'Pa%': '0%' }]);
    assert.deepEqual(teams.BUF, { 'Pa%': 51.1, 'Ru%': 48.9, 'paYds/G': 256.1, 'ruYds/G': 148.4 });
    assert.equal(teams.WAS['paYds/G'], 1234.5);
    assert.equal(teams.WAS['ruYds/G'], 0);
    assert.equal(teams.WAS['Pa%'], 0);
  });

  test(`${page}: unavailable values stay missing, and historical rows cannot become 2026 team metrics`, () => {
    const teams = build2026TeamStats([
      { ...row, SZN: '2025' },
      { ...row, TM: 'LA', SZN: '2026', 'Pa%': '', 'Ru%': 'NA', 'paYds/G': '-1', 'ruYds/G': 'Infinity' },
    ]);
    assert.equal(teams.BUF, undefined);
    assert.deepEqual(teams.LAR, { 'Pa%': null, 'Ru%': null, 'paYds/G': null, 'ruYds/G': null });
  });

  test(`${page}: malformed columns and duplicate normalized teams fail instead of choosing arbitrary data`, () => {
    assert.throws(() => build2026TeamStats([]), /invalid columns/);
    assert.throws(() => build2026TeamStats([{ TM: 'BUF', paYds: 1 }]), /invalid columns/);
    assert.throws(() => build2026TeamStats([{ TM: 'BUF', 'Pa%': '51%', 'Ru%': '49%', paYds: 1786, ruYds: 1039 }]), /invalid columns/);
    assert.throws(() => build2026TeamStats([row, { ...row }]), /duplicate BUF/);
    assert.throws(() => build2026TeamStats([{ ...row, TM: 'WSH' }, { ...row, TM: 'WAS' }]), /duplicate WAS/);
  });

  test(`${page}: team summary requests TM_STAT alone, bypasses stale HTTP data, and rejects a failed feed`, async () => {
    const requests = [];
    const teams = await load2026TeamStats({ parseCsv, fetchImpl: async (url, init) => {
      assert.equal(new URL(url).searchParams.get('sheet'), 'TM_STAT');
      assert.equal(init.cache, 'no-store');
      requests.push(url);
      return { ok: true, text: async () => 'TM,Pa%,Ru%,paYds,ruYds,paYds/G,ruYds/G\nBUF,51.1%,48.9%,"1,793","1,039",256.1,148.4' };
    } });
    assert.equal(requests.length, 1);
    assert.equal(teams.BUF['paYds/G'], 256.1);
    assert.equal(teams.BUF['ruYds/G'], 148.4);
    assert.equal('paYds' in teams.BUF, false);
    assert.equal('ruYds' in teams.BUF, false);
    await assert.rejects(load2026TeamStats({ parseCsv, fetchImpl: async () => ({ ok: false, status: 503 }) }), /could not load \(503\)/);
    await assert.rejects(load2026TeamStats({ parseCsv, fetchImpl: async () => ({ ok: true, text: async () => '<html>Sign in</html>' }) }), /invalid columns/);
  });

  test(`${page}: each summary stat ranks the entire NFL pool, shares ties and excludes unavailable/non-team rows`, () => {
    const teams = build2026TeamStats([
      row,
      { TM: 'ARI', 'Pa%': '61%', 'Ru%': '39%', 'paYds/G': '239.3', 'ruYds/G': '109.3' },
      { TM: 'DAL', 'Pa%': '61%', 'Ru%': '39%', 'paYds/G': '260.2', 'ruYds/G': '110.5' },
      { TM: 'ATL', 'Pa%': '45.3%', 'Ru%': '54.7%', 'paYds/G': '200.5', 'ruYds/G': '152.7' },
      { TM: 'LAR', 'Pa%': '0%', 'Ru%': '0%', 'paYds/G': '0', 'ruYds/G': '0' },
      { TM: 'NE', 'Pa%': '', 'Ru%': '', 'paYds/G': '', 'ruYds/G': '' },
      { TM: 'AVG', 'Pa%': '99%', 'Ru%': '99%', 'paYds/G': '9999', 'ruYds/G': '9999' },
    ]);
    const ranks = build2026TeamRanks(teams);
    assert.deepEqual(ranks.BUF, { 'Pa%': 3, 'Ru%': 2, 'paYds/G': 2, 'ruYds/G': 2 });
    assert.equal(ranks.ARI['Pa%'], 1);
    assert.equal(ranks.DAL['Pa%'], 1);
    assert.equal(ranks.ATL['Pa%'], 4);
    assert.equal(ranks.ARI['Ru%'], 3);
    assert.equal(ranks.DAL['Ru%'], 3);
    assert.equal(ranks.LAR['paYds/G'], 5);
    assert.equal(ranks.NE, undefined);
    assert.equal(ranks.AVG, undefined);
    assert.equal(teams.AVG, undefined);
  });

  test(`${page}: yardage ranks use per-game decimals when total yards disagree and only exact ties share a rank`, () => {
    const teams = build2026TeamStats([
      { ...row, paYds: '1793', ruYds: '1039' },
      { ...row, TM: 'ARI', paYds: '1914', ruYds: '1200', 'paYds/G': '239.3', 'ruYds/G': '109.3' },
      { ...row, TM: 'DAL', paYds: '1500', ruYds: '900', 'paYds/G': '256.2', 'ruYds/G': '148.5' },
      { ...row, TM: 'BAL', paYds: '2049', ruYds: '1187' },
      { ...row, TM: 'NE', paYds: '9999', ruYds: '9999', 'paYds/G': '', 'ruYds/G': 'NA' },
      { ...row, TM: 'LAR', 'paYds/G': '0', 'ruYds/G': '0' },
    ]);
    const ranks = build2026TeamRanks(teams);
    for (const key of ['paYds/G', 'ruYds/G']) {
      assert.equal(ranks.DAL[key], 1);
      assert.equal(ranks.BUF[key], 2);
      assert.equal(ranks.BAL[key], 2);
      assert.equal(ranks.ARI[key], 4);
      assert.equal(ranks.LAR[key], 5);
      assert.equal(ranks.NE[key], undefined);
    }
  });
}
