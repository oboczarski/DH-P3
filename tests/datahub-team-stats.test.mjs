import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as dataHubModel from '../DH_P2.53/scripts/datahub-team-stats.js';
import * as rostersModel from '../DH_P2.53/scripts/rosters-team-stats.js';

// Exercise the production CSV parser too: TM_STAT percentages contain suffixes,
// and quoted yard totals must survive parsing without losing their thousands.
const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function parseCsv('), source.indexOf('// ---------------------------------------------------------------------------\n// Cell styling')), context);
const parseCsv = context.parseCsv;
const row = { TM: 'BUF', 'Pa%': '51.1%', 'Ru%': '48.9%', paYds: '786', ruYds: '465' };

for (const [page, { build2026TeamStats, load2026TeamStats, build2026TeamRanks }] of [['DataHub', dataHubModel], ['Rosters', rostersModel]]) {
  test(`${page}: TM_STAT maps exact source fields, team aliases, percentage units and real zeros`, () => {
    const teams = build2026TeamStats([row, { ...row, TM: 'WSH', paYds: '1,234', ruYds: '0', 'Pa%': '0%' }]);
    assert.deepEqual(teams.BUF, { 'Pa%': 51.1, 'Ru%': 48.9, paYds: 786, ruYds: 465 });
    assert.equal(teams.WAS.paYds, 1234);
    assert.equal(teams.WAS.ruYds, 0);
    assert.equal(teams.WAS['Pa%'], 0);
  });

  test(`${page}: unavailable values stay missing, and historical rows cannot become 2026 team totals`, () => {
    const teams = build2026TeamStats([
      { ...row, SZN: '2025' },
      { ...row, TM: 'LA', SZN: '2026', 'Pa%': '', 'Ru%': 'NA', paYds: '-1', ruYds: 'Infinity' },
    ]);
    assert.equal(teams.BUF, undefined);
    assert.deepEqual(teams.LAR, { 'Pa%': null, 'Ru%': null, paYds: null, ruYds: null });
  });

  test(`${page}: malformed columns and duplicate normalized teams fail instead of choosing arbitrary data`, () => {
    assert.throws(() => build2026TeamStats([]), /invalid columns/);
    assert.throws(() => build2026TeamStats([{ TM: 'BUF', paYds: 1 }]), /invalid columns/);
    assert.throws(() => build2026TeamStats([row, { ...row }]), /duplicate BUF/);
    assert.throws(() => build2026TeamStats([{ ...row, TM: 'WSH' }, { ...row, TM: 'WAS' }]), /duplicate WAS/);
  });

  test(`${page}: team summary requests TM_STAT alone, bypasses stale HTTP data, and rejects a failed feed`, async () => {
    const requests = [];
    const teams = await load2026TeamStats({ parseCsv, fetchImpl: async (url, init) => {
      assert.equal(new URL(url).searchParams.get('sheet'), 'TM_STAT');
      assert.equal(init.cache, 'no-store');
      requests.push(url);
      return { ok: true, text: async () => 'TM,Pa%,Ru%,paYds,ruYds\nBUF,51.1%,48.9%,"1,786",465' };
    } });
    assert.equal(requests.length, 1);
    assert.equal(teams.BUF.paYds, 1786);
    await assert.rejects(load2026TeamStats({ parseCsv, fetchImpl: async () => ({ ok: false, status: 503 }) }), /could not load \(503\)/);
    await assert.rejects(load2026TeamStats({ parseCsv, fetchImpl: async () => ({ ok: true, text: async () => '<html>Sign in</html>' }) }), /invalid columns/);
  });

  test(`${page}: each summary stat ranks the entire NFL pool, shares ties and excludes unavailable/non-team rows`, () => {
    const teams = build2026TeamStats([
      row,
      { TM: 'ARI', 'Pa%': '61%', 'Ru%': '39%', paYds: '652', ruYds: '279' },
      { TM: 'DAL', 'Pa%': '61%', 'Ru%': '39%', paYds: '730', ruYds: '283' },
      { TM: 'ATL', 'Pa%': '45.3%', 'Ru%': '54.7%', paYds: '544', ruYds: '519' },
      { TM: 'LAR', 'Pa%': '0%', 'Ru%': '0%', paYds: '0', ruYds: '0' },
      { TM: 'NE', 'Pa%': '', 'Ru%': '', paYds: '', ruYds: '' },
      { TM: 'AVG', 'Pa%': '99%', 'Ru%': '99%', paYds: '9999', ruYds: '9999' },
    ]);
    const ranks = build2026TeamRanks(teams);
    assert.deepEqual(ranks.BUF, { 'Pa%': 3, 'Ru%': 2, paYds: 1, ruYds: 2 });
    assert.equal(ranks.ARI['Pa%'], 1);
    assert.equal(ranks.DAL['Pa%'], 1);
    assert.equal(ranks.ATL['Pa%'], 4);
    assert.equal(ranks.ARI['Ru%'], 3);
    assert.equal(ranks.DAL['Ru%'], 3);
    assert.equal(ranks.LAR.paYds, 5);
    assert.equal(ranks.NE, undefined);
    assert.equal(ranks.AVG, undefined);
    assert.equal(teams.AVG, undefined);
  });
}
