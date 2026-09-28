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
  // all bench/pick value; Dynasty power counts six reserves and only the user's
  // specified 2027/2028 first- and second-round picks. Mid values arrive upstream.
  function quality(team, metric) {
    const rosterValue = metric === 'roster';
    const dynasty = metric !== 'proj';
    const lineup = team.derivedLineups[dynasty ? 'value' : 'proj'];
    const starterIds = new Set(lineup.assignments.flatMap(slot => slot.player ? [slot.player.id] : []));
    const bench = team.allPlayers.filter(player => POSITIONS.includes(player.pos) && !starterIds.has(player.id));
    const depthPlayers = rosterValue ? bench : selectDepth(bench, metric);
    const pickAssets = dynasty ? (team.ownedPicks || []).filter(pick => rosterValue
      || ([2027, 2028].includes(Number(pick.season)) && [1, 2].includes(Number(pick.round)))) : [];
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

  // The starters scatter reuses each metric's optimized lineup totals. Average
  // the two league ranks, then prefer the better projection rank on equal averages.
  // Missing axes remain unranked; identical rank pairs share a competition rank.
  function starterScatterRankings(teams) {
    const values = teams.map(team => team.quality.value.starters);
    const projections = teams.map(team => team.quality.proj.starters);
    const rows = teams.map(team => {
      const value = team.quality.value.starters;
      const projection = team.quality.proj.starters;
      const valueRank = rank(value, values);
      const projectionRank = rank(projection, projections);
      return { team, value, projection, valueRank, projectionRank,
        averageRank: valueRank && projectionRank ? (valueRank + projectionRank) / 2 : null };
    });
    const available = rows.filter(row => Number.isFinite(row.averageRank))
      .sort((a, b) => a.averageRank - b.averageRank || a.projectionRank - b.projectionRank
        || a.team.username.localeCompare(b.team.username));
    available.forEach((row, index) => {
      const previous = available[index - 1];
      row.rank = previous && row.averageRank === previous.averageRank && row.projectionRank === previous.projectionRank
        ? previous.rank : index + 1;
    });
    return [...available, ...rows.filter(row => !Number.isFinite(row.averageRank)).map(row => ({ ...row, rank: null }))];
  }

  // Regular-season outlook only: positional errors apply to the actual player,
  // including FLEX/SUPER_FLEX. No random sampling or rounded intermediate values.
  const POSITION_SD = { QB: 7.51, RB: 7.51, WR: 7.81, TE: 6.90 };
  const SLOT_POSITIONS = { QB: ['QB'], RB: ['RB'], WR: ['WR'], TE: ['TE'],
    FLEX: ['RB', 'WR', 'TE'], SUPER_FLEX: POSITIONS, REC_FLEX: ['WR', 'TE'],
    WRRB_FLEX: ['WR', 'RB'], RB_WR_FLEX: ['RB', 'WR'], 'WR/RB': ['WR', 'RB'],
    'RB/WR': ['RB', 'WR'], 'WR/RB/TE': ['RB', 'WR', 'TE'], 'RB/WR/TE': ['RB', 'WR', 'TE'],
    'W/R/T': ['RB', 'WR', 'TE'], FLX: ['RB', 'WR', 'TE'], SFLX: POSITIONS,
    'QB/RB/WR/TE': POSITIONS, 'Q/W/R/T': POSITIONS };

  function normalCDF(z) {
    if (z === 0) return 0.5;
    const x = Math.abs(z);
    const t = 1 / (1 + 0.2316419 * x);
    const tail = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)
      * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return Math.max(0, Math.min(1, z > 0 ? 1 - tail : tail));
  }

  // Records are authoritative for processed results. NFL week alone cannot mark
  // an in-progress matchup final. A scored-leg marker handles unequal game counts;
  // uniform record counts also catch the rollover before that marker updates.
  function forecastWeeks(league, nfl, rosters) {
    const start = Math.max(1, Number(league.settings?.start_week) || 1);
    const gamesPerWeek = Number(league.settings?.league_average_match) ? 2 : 1;
    const games = rosters.map(roster => ['wins', 'losses', 'ties'].reduce(
      (sum, key) => sum + (Number(roster.settings?.[key]) || 0), 0));
    const uniform = games.length && games.every(count => count === games[0]);
    const recordLeg = uniform ? start - 1 + Math.floor(games[0] / gamesPerWeek) : start - 1;
    const scoredLeg = Number(league.last_scored_leg ?? league.settings?.last_scored_leg) || 0;
    // A scoring marker may advance before updated records arrive. Uniform live
    // records take precedence so the current matchup is not silently dropped.
    let completed = uniform ? recordLeg : Math.max(start - 1, scoredLeg);
    if (Number(league.season) < Number(nfl.season) || league.status === 'complete'
      || (Number(league.season) === Number(nfl.season) && nfl.season_type === 'post')) completed = 14;
    if (completed < 14 && !uniform && !scoredLeg) throw new Error('League results are updating; reload to refresh the completed-week boundary.');
    return Array.from({ length: Math.max(0, 14 - completed) }, (_, index) => completed + index + 1);
  }

  // Reuse the Analyzer's lineup assembly with a weekly selection strategy. A tiny
  // memoized position-count search handles overlapping restricted FLEX slots exactly;
  // each player is consumed once, and a new call uses that week's scores (including 0).
  function selectWeeklyStarters(players, slots) {
    const pools = POSITIONS.map(pos => players.filter(player => player.pos === pos && Number.isFinite(player.proj))
      .sort((a, b) => b.proj - a.proj || String(a.id).localeCompare(String(b.id))));
    const memo = new Map();
    function visit(index, counts) {
      if (index === slots.length) return { score: 0, filled: 0, players: [] };
      const key = `${index}:${counts.join(',')}`;
      if (memo.has(key)) return memo.get(key);
      const empty = visit(index + 1, counts);
      let best = { ...empty, players: [null, ...empty.players] };
      (slots[index].eligibility || SLOT_POSITIONS[slots[index].type] || []).forEach(pos => {
        const position = POSITIONS.indexOf(pos);
        const player = pools[position]?.[counts[position]];
        if (!player) return;
        const next = [...counts]; next[position]++;
        const rest = visit(index + 1, next);
        const candidate = { score: player.proj + rest.score, filled: rest.filled + 1, players: [player, ...rest.players] };
        if (candidate.filled > best.filled || (candidate.filled === best.filled && candidate.score > best.score)) best = candidate;
      });
      memo.set(key, best);
      return best;
    }
    return visit(0, [0, 0, 0, 0]).players;
  }

  function weeklyStrength(lineup, players) {
    const byId = new Map(players.map(player => [player.id, player]));
    const starters = lineup.assignments.flatMap(slot => slot.player ? [byId.get(slot.player.id)] : []);
    return { points: starters.reduce((sum, player) => sum + player.proj, 0),
      variance: starters.reduce((sum, player) => sum + POSITION_SD[player.pos] ** 2, 0) };
  }

  // Pair each scheduled game once; the same weekly strengths drive both its odds
  // and ROS SOS. A missing week/pair invalidates the outlook rather than shortening it.
  function seasonOutlook(teams, weeks, matchups, strengths, standingsOrder) {
    const rows = teams.map(team => {
      const settings = team.roster.settings || {};
      const wins = Number(settings.wins) || 0, losses = Number(settings.losses) || 0, ties = Number(settings.ties) || 0;
      return { team, id: String(team.roster.roster_id), wins, losses, ties,
        projectedWins: wins, projectedLosses: losses, variance: 0, games: 0, opponentTotal: 0 };
    });
    const byId = new Map(rows.map(row => [row.id, row]));
    weeks.forEach(week => {
      const entries = matchups[week];
      if (!Array.isArray(entries) || entries.length !== rows.length) throw new Error(`Week ${week} schedule is not available for every team.`);
      const groups = new Map(), seen = new Set();
      entries.forEach(entry => {
        const id = String(entry.roster_id);
        if (!byId.has(id) || seen.has(id)) throw new Error(`Week ${week} schedule is incomplete.`);
        seen.add(id);
        if (entry.matchup_id == null) return; // Explicit fantasy bye: no game to project.
        const key = String(entry.matchup_id);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(id);
      });
      if (!groups.size) throw new Error(`Week ${week} matchups have not been scheduled.`);
      groups.forEach(ids => {
        if (ids.length !== 2) throw new Error(`Week ${week} matchup is incomplete.`);
        const [a, b] = ids.map(id => byId.get(id));
        const [sa, sb] = ids.map(id => strengths[week]?.[id]);
        if (![sa, sb].every(value => value && Number.isFinite(value.points) && Number.isFinite(value.variance))) throw new Error(`Week ${week} lineup projections are unavailable.`);
        const sd = Math.sqrt(sa.variance + sb.variance);
        const p = sd ? normalCDF((sa.points - sb.points) / sd) : sa.points === sb.points ? 0.5 : Number(sa.points > sb.points);
        [[a, p, sb], [b, 1 - p, sa]].forEach(([row, probability, opponent]) => {
          row.projectedWins += probability;
          row.projectedLosses += 1 - probability;
          row.variance += probability * (1 - probability);
          row.opponentTotal += opponent.points;
          row.games++;
        });
      });
    });
    const tiebreakOrder = typeof standingsOrder === 'function' ? standingsOrder(rows) : standingsOrder;
    rows.sort((a, b) => Math.abs(b.projectedWins - a.projectedWins) > 1e-9
      ? b.projectedWins - a.projectedWins : tiebreakOrder.indexOf(a.id) - tiebreakOrder.indexOf(b.id));
    rows.forEach((row, index) => { row.seed = index + 1; row.opponentAverage = row.games ? row.opponentTotal / row.games : null; });
    const cutoff = rows[5];
    rows.forEach(row => {
      const variance = row.variance + (cutoff?.variance || 0);
      row.playoffProbability = rows.length <= 6 ? 1 : variance > 0
        ? normalCDF((row.projectedWins - cutoff.projectedWins) / Math.sqrt(variance)) : Number(row.seed <= 6);
      row.scheduleRank = row.games ? 1 + rows.filter(other => other.games && other.opponentAverage < row.opponentAverage - 1e-9).length : null;
    });
    return rows.sort((a, b) => b.playoffProbability - a.playoffProbability || a.seed - b.seed);
  }

  const api = { POSITION_SD, SLOT_POSITIONS, normalCDF, forecastWeeks, selectWeeklyStarters, weeklyStrength, seasonOutlook, projectionWeeks, scoringStats, remainingProjection, scoreProjection, rank, rankFill, quality, selectDepth, barSegments, sumProjections, starterScatterRankings };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LeagueHubAnalysis = api;
})(typeof window !== 'undefined' ? window : globalThis);
