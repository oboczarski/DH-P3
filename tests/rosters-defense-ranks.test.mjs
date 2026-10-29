import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../DH_P2.53/scripts/app.js', import.meta.url), 'utf8');
const slice = (from, to) => app.slice(app.indexOf(from), app.indexOf(to, app.indexOf(from)));
function harness(pageType = 'rosters') {
  const state = { playerWeeklyStats: {}, liveWeeklyStats: {} };
  const context = vm.createContext({ pageType, state, getCurrentNflWeekNumber: () => 8,
    ordinalSuffix: rank => `${rank}th` });
  vm.runInContext(slice('function getOpponentDefenseRank(', 'let tableCoreLoaderPromise')
    + slice('function getRankDisplayText(', '// Rosters may supply its page-local expanded Performance axes;')
    + slice('function getPlayerMatchupForWeek(', 'function getUpcomingProjectionDesignation('), context);
  return context;
}

test('Rosters DRK/CSV ranks reverse only for display, with matching color bands at every boundary', () => {
  const context = harness();
  const rawColors = ['#82d8bee0', '#73b9e7e0', '#c093ebe0', '#c456b1e0'];
  for (let raw = 1; raw <= 32; raw++) {
    context.state.playerWeeklyStats[8] = { player: { opponent: '@ HOU', opponent_rank: raw } };
    const matchup = context.getPlayerMatchupForWeek('player', 8);
    assert.equal(matchup.opponentRank, 33 - raw);
    assert.equal(matchup.opponentRankDisplay, String(33 - raw));
    assert.equal(matchup.color, rawColors[Math.floor((raw - 1) / 8)]);
    assert.equal(context.state.playerWeeklyStats[8].player.opponent_rank, raw);
    assert.equal(context.getOpponentDefenseRank(String(raw)), 33 - raw, 'numeric strings use the same display convention');
  }
});

test('Rosters missing, invalid and bye ranks stay neutral, including historical and future week snapshots', () => {
  const context = harness();
  for (const raw of [undefined, null, '', ' ', 'NA', 'N/A', 'BYE', 0, -1, 33, 1.5, '-1', '1.5', NaN, Infinity, true, false, [], [1], {}]) {
    context.state.playerWeeklyStats[8] = { player: { opponent: 'HOU', opponent_rank: raw } };
    const matchup = context.getPlayerMatchupForWeek('player');
    assert.equal(matchup.opponentRank, null, String(raw));
    assert.equal(matchup.opponentRankDisplay, 'NA');
    assert.equal(matchup.color, null);
  }
  for (const week of [1, 8, 18]) {
    context.state.playerWeeklyStats[week] = { player: { opponent: 'HOU', opponent_rank: 32 } };
    assert.equal(context.getPlayerMatchupForWeek('player', week).opponentRank, 1);
  }
  context.state.playerWeeklyStats[8].player = { opponent: 'BYE', opponent_rank: 1 };
  assert.equal(context.getPlayerMatchupForWeek('player').opponentRank, null);
  assert.equal(context.getPlayerMatchupForWeek('player').isBye, true);
  assert.equal(context.getOpponentRankColor(0), null);
  assert.equal(context.getOpponentRankColor(33), null);
  assert.equal(context.getOpponentRankColor(1, 'descending'), '#82d8bee0', 'SOS keeps its original color direction');
});

test('shared app consumers outside Rosters retain their existing rank numbers and colors', () => {
  for (const page of ['stats', 'ownership', 'analyzer', 'research']) {
    const context = harness(page);
    for (const rank of [1, 8, 9, 16, 17, 24, 25, 32]) {
      context.state.playerWeeklyStats[8] = { player: { opponent: 'HOU', opponent_rank: rank } };
      const matchup = context.getPlayerMatchupForWeek('player');
      assert.equal(matchup.opponentRank, rank);
      assert.equal(context.getOpponentDefenseRank(rank), rank);
      assert.equal(matchup.color, ['#82d8bee0', '#73b9e7e0', '#c093ebe0', '#c456b1e0'][Math.floor((rank - 1) / 8)]);
    }
  }
});
