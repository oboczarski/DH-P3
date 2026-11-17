const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Analysis = require('../DH_P2.53/scripts/leaguehub-analysis.js');

// Exercise the actual page loader against inspectable weekly responses. No
// season totals, actual results or other page's state can supply ROS values.
const source = fs.readFileSync(require.resolve('../DH_P2.53/scripts/leaguehub.js'), 'utf8');
function loaderContext() {
  const context = { Analysis, POSITION_ORDER: ['QB', 'RB', 'WR', 'TE'],
    state: { players: { q: { position: 'QB', team: 'JAC' }, w: { position: 'WR', team: 'WAS' },
      zero: { position: 'WR', team: 'LAR' }, missing: { position: 'RB', team: 'KC' } } },
    console: { warn() {} } };
  vm.createContext(context);
  for (const name of ['isProjectionBye', 'fetchAnalysisProjections']) {
    const start = source.search(new RegExp(`    (?:async )?function ${name}\\(`));
    const end = source.slice(start + 1).search(/\n    (?:async )?function /);
    assert.ok(start >= 0 && end > 0);
    vm.runInContext(source.slice(start, start + end + 1), context);
  }
  return context;
}
const league = { season: '2026', settings: {}, scoring_settings: { pass_yd: .04, pass_td: 6, pass_int: -2, rec: 1, rec_yd: .1 } };
const rosters = [{ players: ['q', 'w', 'zero', 'missing'], settings: { wins: 7, losses: 3, ties: 0 } }];
function weeklyData() {
  return { q: { pass_yd: 250, pass_td: 2, pass_int: 1, pts_ppr: 16 },
    w: { rec: 5, rec_yd: 50, pts_ppr: 10 }, zero: { pts_ppr: 0 }, missing: { adp_ppr: 200 } };
}

test('ROS loader sums only remaining weekly forecasts, applies league scoring and confirmed byes', async () => {
  const context = loaderContext(), requests = [];
  const result = await context.fetchAnalysisProjections(league, rosters, async url => {
    requests.push(url);
    if (url.endsWith('/state/nfl')) return { season: '2026', week: 10, season_type: 'regular' };
    assert.match(url, /\/projections\/nfl\/regular\/2026\/(11|12|13|14|15|16|17|18)$/);
    return weeklyData();
  }, async () => ({ JAX: { 12: 'BYE' } }));
  assert.equal(result.meta.available, true);
  assert.deepEqual(Array.from(result.meta.weeks), [11,12,13,14,15,16,17,18]);
  assert.equal(result.values.q, 140);
  assert.equal(result.values.w, 80);
  assert.equal(result.values.zero, 0);
  assert.equal(result.values.missing, null);
  assert.equal(result.weeklyValues[12].q, 0);
  assert.equal(result.weeklyValues[11].q, 20);
  assert.equal(requests.length, 9);
  assert.match(result.meta.label, /Weeks 11–18/);
  assert.equal(result.meta.missing, 1);
});

test('one failed or unpublished remaining week invalidates ROS instead of publishing partial totals', async () => {
  for (const mode of ['failed', 'unpublished']) {
    const context = loaderContext();
    const result = await context.fetchAnalysisProjections(league, rosters, async url => {
      if (url.endsWith('/state/nfl')) return { season: '2026', week: 10, season_type: 'regular' };
      if (url.endsWith('/18')) {
        if (mode === 'failed') throw new Error('Week 18 forecast unavailable.');
        return { q: { adp_ppr: 10 } };
      }
      return weeklyData();
    }, async () => ({}));
    assert.equal(result.meta.available, false);
    assert.deepEqual(Object.keys(result.values), []);
    assert.match(result.meta.label, /18/);
  }
});

test('completed seasons never load a season budget, weekly forecasts or a bye schedule', async () => {
  const context = loaderContext(), requests = [];
  const result = await context.fetchAnalysisProjections({ ...league, season: '2025' }, rosters, async url => {
    requests.push(url);
    assert.ok(url.endsWith('/state/nfl'));
    return { season: '2026', week: 10, season_type: 'regular' };
  }, async () => { throw new Error('Schedule must not load.'); });
  assert.equal(result.meta.available, false);
  assert.equal(requests.length, 1);
  assert.match(result.meta.label, /season complete/);
});

test('negative league weights preserve signed points in the weekly ROS forecast', async () => {
  const context = loaderContext();
  const result = await context.fetchAnalysisProjections({ ...league, scoring_settings: { rec: -2 } }, rosters, async url => {
    if (url.endsWith('/state/nfl')) return { season: '2026', week: 18, season_type: 'regular' };
    return weeklyData();
  }, async () => ({}));
  assert.equal(result.values.w, -10);
  assert.equal(result.values.zero, 0);
});
