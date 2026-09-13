/* LeagueHub analysis calculations: shared by the matrix, charts, and rank rings.
   Keep this module page-local; the Trade Archive retains its historical stats. */
(function (root) {
  'use strict';
  const POSITIONS = ['QB', 'RB', 'WR', 'TE'];

  // ROS includes the current NFL week through Week 18. Completed seasons have
  // no remaining weeks; future seasons start at Week 1. Never substitute 2025.
  function projectionWeeks(season, nfl) {
    const year = Number(season);
    const current = Number(nfl.season);
    if (!year || !current) throw new Error('NFL projection season unavailable.');
    if (year < current || (year === current && nfl.season_type === 'post')) return [];
    const start = year > current || nfl.season_type === 'pre' ? 1 : Math.max(1, Number(nfl.week) || 1);
    return Array.from({ length: Math.max(0, 19 - start) }, (_, i) => start + i);
  }

  // Derive only identities supported by the forecast, never guessed game bonuses.
  // Season forecasts omit incompletions and some position premiums even when the
  // underlying attempts, completions, receptions or touchdowns are available.
  function scoringStats(stats, position) {
    const result = { ...stats };
    const pos = String(position).toLowerCase();
    if (result.pass_inc == null && result.pass_att != null && result.pass_cmp != null) result.pass_inc = result.pass_att - result.pass_cmp;
    ['rec', 'rec_fd', 'rush_fd', 'rush_td', 'pass_td'].forEach(key => {
      if (result[`bonus_${key}_${pos}`] == null && result[key] != null) result[`bonus_${key}_${pos}`] = result[key];
    });
    return result;
  }

  // A season forecast is the baseline, not a sum of independently authored weekly
  // forecasts. Remove completed-week actual stat counts to express the remaining
  // season budget; current-week games remain included until the NFL week advances.
  function remainingProjection(stats, completedStats, position) {
    if (!stats) return null;
    const result = scoringStats(stats, position);
    const completed = completedStats.map(item => scoringStats(item || {}, position));
    Object.keys(result).forEach(key => {
      if (/^(pass_|rush_|rec(?:_|$)|fum|bonus_)/.test(key)) {
        result[key] = Math.max(0, Number(result[key]) - completed.reduce((sum, item) => sum + (Number(item[key]) || 0), 0));
      }
    });
    return result;
  }

  // Score the forecast with this league's weights; generic pts_ppr is a coverage
  // marker only and never substitutes for custom league points.
  function scoreProjection(stats, scoring, position) {
    if (!stats || typeof stats !== 'object') return null;
    const settings = Object.entries(scoring || {}).filter(([, weight]) => Number.isFinite(Number(weight)) && Number(weight) !== 0);
    if (!settings.length) return null;
    const covered = ['pts_ppr', 'pts_half_ppr', 'pts_std', ...settings.map(([key]) => key)]
      .some(key => stats[key] != null && Number.isFinite(Number(stats[key])));
    if (!covered) return null;
    const derived = scoringStats(stats, position);
    return settings.reduce((total, [key, weight]) => total + (Number(derived[key]) || 0) * Number(weight), 0);
  }

  function rank(value, population) {
    if (!Number.isFinite(value)) return null;
    // Competition ranks preserve ties (1, 1, 3), using displayed precision.
    const rounded = Math.round(value * 10);
    return 1 + population.filter(other => Number.isFinite(other) && Math.round(other * 10) > rounded).length;
  }

  function rankFill(rankValue, count) {
    return rankValue && count ? Math.max(0, Math.min(1, (count - rankValue + 1) / count)) : 0;
  }

  function sumProjections(players) {
    return players.some(player => !Number.isFinite(player.proj))
      ? null : players.reduce((sum, player) => sum + player.proj, 0);
  }

  // Power Rankings use the bench left after this metric's optimized starters.
  // Reserve positional minimums before the wildcard so one player cannot fill
  // two depth spots. Short benches contribute only the players actually owned.
  function selectDepth(bench, metric) {
    const key = metric === 'proj' ? 'proj' : 'ktc';
    const sorted = [...bench].sort((a, b) => {
      const primary = (b[key] ?? -Infinity) - (a[key] ?? -Infinity);
      return primary || (b.ktc - a.ktc) || a.name.localeCompare(b.name);
    });
    const selected = [];
    const used = new Set();
    const take = (positions, count) => sorted
      .filter(player => positions.includes(player.pos) && !used.has(player.id))
      .slice(0, count).forEach(player => { selected.push(player); used.add(player.id); });
    take(['QB'], 1);
    if (metric === 'proj') {
      take(['RB', 'WR', 'TE'], 3);
    } else {
      take(['RB', 'WR'], 3);
      take(['TE'], 1);
      take(POSITIONS, 6 - selected.length);
    }
    return selected;
  }

  // The matrix, bars, and rings share these three scores. Roster Value retains
  // all bench/pick value; Dynasty power counts only six reserves and Rounds 1–2.
  function quality(team, metric) {
    const rosterValue = metric === 'roster';
    const dynasty = metric !== 'proj';
    const lineup = team.derivedLineups[dynasty ? 'value' : 'proj'];
    const starterIds = new Set(lineup.assignments.flatMap(slot => slot.player ? [slot.player.id] : []));
    const bench = team.allPlayers.filter(player => POSITIONS.includes(player.pos) && !starterIds.has(player.id));
    const depthPlayers = rosterValue ? bench : selectDepth(bench, metric);
    const pickAssets = dynasty ? (team.ownedPicks || []).filter(pick => rosterValue || [1, 2].includes(Number(pick.round))) : [];
    const picks = pickAssets.reduce((sum, pick) => sum + pick.ktc, 0);
    const starters = dynasty ? lineup.totals.value : sumProjections(lineup.assignments.flatMap(slot => slot.player ? [slot.player] : []));
    const depth = dynasty ? depthPlayers.reduce((sum, p) => sum + p.ktc, 0) : sumProjections(depthPlayers);
    return {
      slots: lineup.assignments.map(slot => dynasty ? slot.score : (slot.player ? slot.player.proj : 0)),
      starters,
      depth,
      picks,
      overall: rosterValue ? team.totalValue : Number.isFinite(starters) && Number.isFinite(depth) ? starters + depth + picks : null,
      depthPlayers,
      pickAssets,
    };
  }

  // Refine changes only chart composition. It removes reserves/picks before
  // sorting and ranking; the matrix/rings continue to report the full score.
  function barSegments(team, metric, startersOnly = false) {
    const score = team.quality[metric];
    if (metric === 'roster') return [...POSITIONS, 'Picks'].map(key => ({
      key, value: team.overallPositional[key],
      players: team.allPlayers.filter(player => player.pos === key),
      picks: key === 'Picks' ? score.pickAssets : [],
    }));
    const lineup = team.derivedLineups[metric];
    const segments = [...new Set(lineup.assignments.map(slot => slot.type))].map(key => {
      const slots = lineup.assignments.filter(slot => slot.type === key);
      const ids = new Set(slots.flatMap(slot => slot.player ? [slot.player.id] : []));
      const players = team.allPlayers.filter(player => ids.has(player.id));
      return { key, players, value: metric === 'value' ? players.reduce((sum, p) => sum + p.ktc, 0) : sumProjections(players) };
    });
    if (!startersOnly) {
      segments.push({ key: 'Depth', value: score.depth, players: score.depthPlayers });
      if (metric === 'value') segments.push({ key: 'Picks', value: score.picks, players: [], picks: score.pickAssets });
    }
    return segments;
  }

  const api = { projectionWeeks, scoringStats, remainingProjection, scoreProjection, rank, rankFill, quality, selectDepth, barSegments, sumProjections };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LeagueHubAnalysis = api;
})(typeof window !== 'undefined' ? window : globalThis);
