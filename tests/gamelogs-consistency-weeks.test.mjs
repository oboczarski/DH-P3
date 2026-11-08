import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const implementations = [
  ['Rosters', 'rosters-gamelogs-consistency.js', 'getRostersConsistencyAxisWeeks', 'currentGameLogsSeason'],
  ['Rosters shared-app fallback', 'app.js', 'getConsistencyAxisWeeks', 'currentGameLogsSeason'],
  ['DataHub', 'DataHub.js', 'getDataHubConsistencyAxisWeeks', 'currentModalSeason'],
];
const fullSeason = Array.from({ length: 18 }, (_, index) => index + 1);

// Exercise each page's actual week selector with archived rows and the current
// season's schedule/projection placeholders, without network or DOM fixtures.
function createSelector(filename, functionName, seasonKey) {
  const source = fs.readFileSync(new URL(`../DH_P2.53/scripts/${filename}`, import.meta.url), 'utf8');
  const context = vm.createContext({ state: {}, pageType: 'rosters' });
  vm.runInContext(source.match(new RegExp(`function ${functionName}\\([^]*?\\n}`))[0], context);
  return (season, weeklyStats) => {
    context.state[seasonKey] = season;
    context.state.playerWeeklyStats = weeklyStats;
    return Array.from(context[functionName]());
  };
}

const archivedWeeks = Object.fromEntries([...fullSeason].reverse().map((week) => [week, {
  player: { fpt_ppr: week === 18 ? 0 : week, opponent: week === 7 ? 'BYE' : 'BUF' },
}]));
function currentWeeks(latestRecordedWeek) {
  return Object.fromEntries(fullSeason.map((week) => [week, {
    player: {
      fpt_ppr: week <= latestRecordedWeek ? 0 : undefined,
      proj: week > latestRecordedWeek ? (week % 2 ? 15 : 'OUT') : undefined,
      __hasRecordedStats: week <= latestRecordedWeek,
    },
  }]));
}

for (const [label, filename, functionName, seasonKey] of implementations) {
  test(`${label}: archived 2025 consistency includes Weeks 1–18`, () => {
    const select = createSelector(filename, functionName, seasonKey);
    assert.deepEqual(select('2025', archivedWeeks), fullSeason);
  });

  test(`${label}: season switches restore the full archive and preserve the 2026 window`, () => {
    const select = createSelector(filename, functionName, seasonKey);
    assert.deepEqual(select('2026', currentWeeks(9)), fullSeason.slice(0, 9));
    assert.deepEqual(select('2025', archivedWeeks), fullSeason);
    assert.deepEqual(select('2026', currentWeeks(12)), [4, 5, 6, 7, 8, 9, 10, 11, 12]);
    assert.deepEqual(select('2025', archivedWeeks), fullSeason);
  });

  test(`${label}: 2026 keeps recorded zero games and excludes future projection/status rows`, () => {
    const select = createSelector(filename, functionName, seasonKey);
    assert.deepEqual(select('2026', currentWeeks(3)), [1, 2, 3]);
    assert.deepEqual(select('2026', currentWeeks(0)), []);
    assert.deepEqual(select('2026', {}), []);
    assert.deepEqual(select('2025', {}), []);
  });
}
