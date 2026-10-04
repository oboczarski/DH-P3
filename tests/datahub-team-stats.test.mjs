import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { build2026TeamStats, load2026TeamStats } from '../DH_P2.53/scripts/datahub-team-stats.js';

// Exercise the production CSV parser too: TM_STAT percentages contain suffixes,
// and quoted yard totals must survive parsing without losing their thousands.
const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function parseCsv('), source.indexOf('// ---------------------------------------------------------------------------\n// Cell styling')), context);
const parseCsv = context.parseCsv;
const row = { TM: 'BUF', 'Pa%': '51.1%', 'Ru%': '48.9%', paYds: '786', ruYds: '465' };

test('TM_STAT maps exact source fields, team aliases, percentage units and real zeros', () => {
  const teams = build2026TeamStats([row, { ...row, TM: 'WSH', paYds: '1,234', ruYds: '0', 'Pa%': '0%' }]);
  assert.deepEqual(teams.BUF, { 'Pa%': 51.1, 'Ru%': 48.9, paYds: 786, ruYds: 465 });
  assert.equal(teams.WAS.paYds, 1234);
  assert.equal(teams.WAS.ruYds, 0);
  assert.equal(teams.WAS['Pa%'], 0);
});

test('unavailable values stay missing, and historical rows cannot become 2026 team totals', () => {
  const teams = build2026TeamStats([
    { ...row, SZN: '2025' },
    { ...row, TM: 'LA', SZN: '2026', 'Pa%': '', 'Ru%': 'NA', paYds: '-1', ruYds: 'Infinity' },
  ]);
  assert.equal(teams.BUF, undefined);
  assert.deepEqual(teams.LAR, { 'Pa%': null, 'Ru%': null, paYds: null, ruYds: null });
});

test('malformed columns and duplicate normalized teams fail instead of choosing arbitrary data', () => {
  assert.throws(() => build2026TeamStats([]), /invalid columns/);
  assert.throws(() => build2026TeamStats([{ TM: 'BUF', paYds: 1 }]), /invalid columns/);
  assert.throws(() => build2026TeamStats([row, { ...row }]), /duplicate BUF/);
  assert.throws(() => build2026TeamStats([{ ...row, TM: 'WSH' }, { ...row, TM: 'WAS' }]), /duplicate WAS/);
});

test('team summary requests TM_STAT alone, bypasses stale HTTP data, and rejects a failed feed', async () => {
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
