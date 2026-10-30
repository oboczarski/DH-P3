/* DataHub-only player profile; independently owned from Rosters and Matchups. */
// This page owns its Game Logs profile model and renderer. Defense ranks remain
// untouched: DRK/CSV rank 1 allows the most points (easiest positional opponent).
const profilePositions = new Set(['QB', 'RB', 'WR', 'TE']);
const profileTeams = new Set('ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' '));
const profileTeam = value => {
  const team = String(value || '').trim().toUpperCase().replace(/^(?:@|VS\.?)\s*/i, '');
  return ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[team] || team;
};
const profileRank = value => {
  const rank = typeof value === 'string' && !value.trim() ? NaN : Number(value);
  return Number.isInteger(rank) && rank >= 1 && rank <= 32 ? rank : null;
};

// Historical profiles use only their own year's shipped CSV rows. A schedule
// game is deduplicated by team/week; the latest available positional defense
// rank is used consistently across the whole league, including traded players.
function buildHistoricalProfileSource(weeks, latestRecordedWeek) {
  const scheduleByTeam = {}, defenseByTeam = {}, playerTeams = {};
  Object.entries(weeks).sort(([a], [b]) => Number(a) - Number(b)).forEach(([week, rows]) => {
    rows.forEach(row => {
      const team = profileTeam(row.TM), opponent = profileTeam(row.VS);
      const position = String(row.POS || '').trim().toUpperCase();
      if (!profileTeams.has(team) || (!profileTeams.has(opponent) && opponent !== 'BYE') || !profilePositions.has(position)) return;
      (scheduleByTeam[team] ||= {})[week] = row.VS;
      if (row.SLPR_ID) playerTeams[String(row.SLPR_ID)] = team;
      const rank = profileRank(row.vsRK);
      if (opponent !== 'BYE' && rank !== null) (defenseByTeam[opponent] ||= {})[`${position}RK`] = rank;
    });
  });
  return { scheduleByTeam, defenseByTeam, playerTeams, latestRecordedWeek };
}

// Rank all 32 schedules separately by position and period. Opponent-rank means
// are game-weighted (repeat opponents count twice; BYEs never count). Competition
// ties share a rank. Any incomplete league comparison is unavailable, rather
// than silently assigning a misleading rank from a smaller comparison pool.
function buildProfileScheduleRanks(source, position) {
  const cutoff = source?.latestRecordedWeek;
  const teams = Object.keys(source?.scheduleByTeam || {}).filter(team => profileTeams.has(team));
  if (source?.resultsAvailable === false || !profilePositions.has(position) || !Number.isInteger(cutoff) || cutoff < 0 || cutoff > 18 || teams.length !== 32) return null;
  const result = { cutoff, past: {}, remaining: {} };
  for (const period of ['past', 'remaining']) {
    const entries = teams.map(team => {
      let sum = 0, games = 0, complete = true;
      for (let week = period === 'past' ? 1 : cutoff + 1; week <= (period === 'past' ? cutoff : 18); week++) {
        const opponent = profileTeam(source.scheduleByTeam[team][week]);
        if (opponent === 'BYE') continue;
        const rank = profileRank(source.defenseByTeam?.[opponent]?.[`${position}RK`]);
        if (!opponent || !teams.includes(opponent) || rank === null) { complete = false; continue; }
        sum += rank; games++;
      }
      return { team, games, mean: complete && games ? sum / games : null, complete };
    });
    const available = entries.every(entry => entry.complete && (entry.games > 0 || (period === 'past' ? cutoff === 0 : cutoff === 18)));
    const ranked = available ? entries.filter(entry => entry.mean !== null).sort((a, b) => a.mean - b.mean || a.team.localeCompare(b.team)) : [];
    let previous = null, rank = 0;
    ranked.forEach((entry, index) => {
      if (previous === null || Math.abs(entry.mean - previous) > 1e-10) rank = index + 1;
      result[period][entry.team] = { rank, games: entry.games, mean: entry.mean };
      previous = entry.mean;
    });
  }
  return result;
}

// Refresh only the new profile above the navigation. Existing summary markup,
// rank colors, team-directory button and vitals are kept intact in their mounts.
// No asynchronous work runs here, so an old image or season cannot overwrite a
// newer player after a modal close, season switch or nested Team return.
function renderGameLogsProfile(root, player, source, season, { loading = false } = {}) {
  const profile = root?.querySelector('.gamelogs-profile');
  if (!profile) return;
  const name = player.fullName || player.name || `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Player';
  const position = String(player.pos || player.position || '').toUpperCase();
  const team = profileTeam(source?.seasonStats?.[player.id]?.team || source?.playerTeams?.[player.id] || player.team);
  profile.dataset.position = position;
  profile.querySelector('.gamelogs-profile__season').textContent = `${season} SEASON`;
  const portrait = profile.querySelector('.gamelogs-profile__portrait');
  const initials = name.split(/\s+/).map(part => part[0]).filter(Boolean).slice(0, 2).join('');
  portrait.replaceChildren();
  const fallback = document.createElement('span');
  fallback.className = 'gamelogs-profile__initials';
  fallback.textContent = initials;
  fallback.setAttribute('aria-hidden', 'true');
  portrait.appendChild(fallback);
  if (/^\d+$/.test(String(player.id))) {
    const image = document.createElement('img');
    image.alt = `${name} headshot`;
    image.width = 160; image.height = 160; image.decoding = 'async';
    image.addEventListener('load', () => { if (image.isConnected) fallback.hidden = true; }, { once: true });
    image.addEventListener('error', () => image.remove(), { once: true });
    image.src = `https://sleepercdn.com/content/nfl/players/${encodeURIComponent(player.id)}.jpg`;
    portrait.appendChild(image);
  }
  const model = loading ? null : buildProfileScheduleRanks(source, position);
  const cutoff = model?.cutoff;
  const context = profile.querySelector('.gamelogs-profile__schedule-context');
  context.textContent = `${season} · ${team || 'FA'} · ${position || '—'}${Number.isInteger(cutoff) ? ` · through W${cutoff}` : ''}`;
  for (const period of ['past', 'remaining']) {
    const card = profile.querySelector(`[data-profile-sos="${period}"]`);
    const metric = model?.[period]?.[team];
    const emptyPeriod = period === 'past' ? cutoff === 0 : cutoff === 18;
    const reason = loading ? 'Loading schedule' : emptyPeriod ? (period === 'past' ? 'Season not started' : 'Season complete') : 'Data unavailable';
    card.dataset.tone = metric ? (metric.rank <= 8 ? 'easy' : metric.rank <= 16 ? 'favorable' : metric.rank <= 24 ? 'difficult' : 'tough') : 'unavailable';
    card.querySelector('.gamelogs-profile__sos-rank').innerHTML = metric ? `${metric.rank}<span>/32</span>` : '—';
    card.querySelector('.gamelogs-profile__sos-detail').textContent = metric ? `${metric.games} games · ${metric.rank <= 8 ? 'Easy' : metric.rank <= 16 ? 'Favorable' : metric.rank <= 24 ? 'Difficult' : 'Tough'}` : reason;
    const marker = card.querySelector('.gamelogs-profile__sos-marker');
    marker.hidden = !metric;
    marker.style.left = metric ? `${(metric.rank - 1) / 31 * 100}%` : '0%';
    card.setAttribute('aria-label', `${period === 'past' ? 'SOS So Far' : 'Remaining SOS'}: ${metric ? `${metric.rank} of 32, ${metric.games} games. 1 is easiest, 32 toughest.` : reason}`);
  }
  const explanation = profile.querySelector('.gamelogs-profile__method p');
  explanation.textContent = `Schedules are ranked separately for ${position || 'each position'} across all 32 teams. 1 = easiest; 32 = toughest. Each opponent’s current ${season} positional fantasy-points-allowed rank is averaged across the team’s games, then those averages are ranked. Repeat opponents count for each game; BYEs are excluded; ties share a rank. The latest recorded CSV week separates past and remaining games. This is the team’s schedule, including games the player missed, through Week 18. Missing schedule or rank data shows —.`;
  if (loading) profile.querySelector('.gamelogs-profile__method').open = false;
  profile.querySelectorAll('#modal-summary-chips .gamelogs-summary-chip').forEach((chip, index) => {
    chip.setAttribute('aria-label', ['Fantasy points, position rank and overall rank', 'Points per game, position rank and overall rank', 'KTC value, position rank and overall rank'][index]);
  });
}

export { buildHistoricalProfileSource, buildProfileScheduleRanks, renderGameLogsProfile };
