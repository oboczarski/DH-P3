/* Rosters player overview only. This adapter retains the existing summary,
 * vitals, team-directory and watchlist renderers. Its SOS model uses schedule
 * weeks and positional defense ranks, never projections or player appearances. */
(() => {
  const TEAMS = Object.freeze('ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' '));
  const normalizeTeam = value => {
    const team = String(value ?? '').trim().toUpperCase().replace(/^(?:@|VS\.?)\s*/i, '');
    return ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[team] || team;
  };
  const validRank = value => {
    const rank = Number(String(value ?? '').trim());
    return Number.isInteger(rank) && rank >= 1 && rank <= 32 ? rank : null;
  };

  // Rank the average opponent positional ranks across the complete NFL pool.
  // Source DRK ranks run easiest-first, so SOS is 1 easiest / 32 toughest.
  // BYEs add no game; missing ranks invalidate a comparison instead of quietly
  // averaging a partial schedule. Repeated opponents count once per matchup.
  function calculateSos(source, teamValue, position) {
    const team = normalizeTeam(teamValue);
    const cutoff = source?.latestRecordedWeek;
    const empty = reason => ({ rank: null, games: 0, reason });
    if (!TEAMS.includes(team) || !['QB', 'RB', 'WR', 'TE'].includes(position)
      || !Number.isInteger(cutoff) || cutoff < 0 || cutoff > 18) {
      return { faced: empty('Schedule data unavailable.'), remaining: empty('Schedule data unavailable.') };
    }
    const results = {};
    for (const phase of ['faced', 'remaining']) {
      const first = phase === 'faced' ? 1 : cutoff + 1;
      const last = phase === 'faced' ? cutoff : 18;
      if (first > last) {
        results[phase] = empty(phase === 'faced' ? 'No completed schedule weeks yet.' : 'No remaining regular-season games.');
        continue;
      }
      const pool = TEAMS.map(candidate => {
        const schedule = source.scheduleByTeam?.[candidate];
        let total = 0;
        let games = 0;
        for (let week = first; week <= last; week += 1) {
          const opponent = normalizeTeam(schedule?.[week]);
          if (opponent === 'BYE') continue;
          if (!TEAMS.includes(opponent)) return null;
          const raw = source.opponentRanksByTeam
            ? source.opponentRanksByTeam[candidate]?.[position]?.[week]
            : source.defenseRanksByTeam?.[opponent]?.[`${position}RK`];
          const rank = validRank(raw);
          if (rank === null) return null;
          total += rank;
          games += 1;
        }
        return games ? { team: candidate, average: total / games, games } : null;
      });
      const current = pool.find(row => row?.team === team);
      if (pool.some(row => !row) || !current) {
        results[phase] = empty('Complete positional schedule data for all 32 teams is unavailable.');
      } else {
        // Competition ranks share exact ties; a tiny tolerance prevents floating
        // point division from splitting mathematically identical averages.
        results[phase] = { rank: 1 + pool.filter(row => row.average < current.average - 1e-9).length,
          games: current.games, average: current.average, first, last, reason: '' };
      }
    }
    return results;
  }
  window.RostersGameLogsProfileMath = Object.freeze({ calculateSos, normalizeTeam });
  if (document.body.dataset.page !== 'rosters') return;
  const modal = document.getElementById('game-logs-modal');
  const profile = modal?.querySelector('.gl-profile');
  if (!profile) return;

  const portrait = profile.querySelector('.gl-profile-headshot');
  const context = profile.querySelector('.gl-profile-context');
  const name = profile.querySelector('#modal-player-name');
  const help = profile.querySelector('#gl-profile-sos-help');
  const positionAccents = { QB: '#a9b8ff', RB: '#75e2c2', WR: '#8ecbff', TE: '#dcafff' };
  let portraitSequence = 0;
  let profileSequence = 0;
  let archivePromise;

  // Historical SOS reads the already cached local weekly CSVs, preserving each
  // row's team, position and vsRK. It never overlays the 2026 schedule/ranks.
  async function historicalSource() {
    if (!archivePromise) archivePromise = loadPlayerStatsFromCsvFiles().then(({ allWeeklyCsvs }) => {
      const source = { scheduleByTeam: {}, opponentRanksByTeam: {}, latestRecordedWeek: state.rosters2025GameLogs?.latestRecordedWeek ?? 18 };
      for (const { week, csv, hasFullStats } of allWeeklyCsvs) {
        if (!csv || !hasFullStats) continue;
        const { headers, rows } = parseCsv(csv);
        const index = Object.fromEntries(headers.map((header, i) => [header.trim(), i]));
        for (const row of rows) {
          const team = normalizeTeam(row[index.TM]);
          const opponent = normalizeTeam(row[index.VS]);
          const pos = row[index.POS]?.trim().toUpperCase();
          if (!TEAMS.includes(team) || !(TEAMS.includes(opponent) || opponent === 'BYE')) continue;
          const schedule = source.scheduleByTeam[team] ||= {};
          if (!(week in schedule)) schedule[week] = opponent;
          else if (schedule[week] !== opponent) schedule[week] = null;
          const rank = validRank(row[index.vsRK]);
          if (!rank || !['QB', 'RB', 'WR', 'TE'].includes(pos)) continue;
          const ranks = (source.opponentRanksByTeam[team] ||= {})[pos] ||= {};
          if (!(week in ranks)) ranks[week] = rank;
          else if (ranks[week] !== rank) ranks[week] = null;
        }
      }
      return source;
    }).catch(error => { archivePromise = null; throw error; });
    return archivePromise;
  }

  function closeHelp() {
    help.hidden = true;
    profile.querySelectorAll('[data-profile-sos]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }

  function renderSos(result, player, season) {
    for (const phase of ['faced', 'remaining']) {
      const metric = result?.[phase];
      const button = profile.querySelector(`[data-profile-sos="${phase}"]`);
      const label = phase === 'faced' ? 'SOS so far' : 'Remaining SOS';
      button.querySelector('[data-profile-sos-value]').textContent = metric?.rank ?? '—';
      button.dataset.available = String(Boolean(metric?.rank));
      const detail = metric?.rank
        ? `${season} ${player.team} ${player.pos}: ${label} ranks ${metric.rank} of 32 over ${metric.games} matchups (weeks ${metric.first}–${metric.last}). Teams are ranked by average opponent ${player.pos} defense rank; 1 is easiest, 32 toughest. BYEs are excluded. Ties share a rank.`
        : `${season} ${player.pos} ${label}: ${metric?.reason || 'Loading schedule data.'} 1 is easiest, 32 toughest.`;
      button.dataset.explanation = detail;
      button.title = detail;
      button.setAttribute('aria-label', detail);
    }
  }

  function fitName() {
    // Fit long surnames to the available identity column without changing the
    // profile or navigation's height; the title retains the full name as well.
    name.style.removeProperty('font-size');
    let size = parseFloat(getComputedStyle(name).fontSize);
    while ((name.scrollHeight > name.clientHeight + 1 || name.scrollWidth > name.clientWidth + 1) && size > 12) {
      size -= 0.5;
      name.style.setProperty('font-size', `${size}px`, 'important');
    }
  }

  function updateProfile(player, { loading = false } = {}) {
    const full = state.players?.[player.id] || {};
    const pos = String(player.pos || player.position || full.position || '').toUpperCase();
    const season = state.currentGameLogsSeason || '2026';
    const snapshot = season === '2026' ? state.rosters2026GameLogs : state.rosters2025GameLogs;
    const team = normalizeTeam(snapshot?.seasonStats?.[player.id]?.team || player.team || full.team || 'FA');
    const identity = { ...player, team, pos };
    const playerName = [full.first_name, full.last_name].filter(Boolean).join(' ') || player.name || player.full_name || 'Player';
    profile.style.setProperty('--profile-accent', positionAccents[pos] || '#a9b8ff');
    profile.dataset.position = pos;
    profile.dataset.loading = String(loading);
    name.textContent = playerName;
    name.title = playerName;
    profile.querySelector('.gl-profile-team-name').textContent = team;
    profile.querySelector('.gl-profile-monogram').textContent = playerName.split(/\s+/).map(part => part[0]).filter(Boolean).slice(0, 2).join('');
    // Move the original live team button and position chip, keeping their
    // listeners/data attributes and the independent team-directory behavior.
    const tags = modal.querySelector('.modal-header-left-container');
    if (tags && tags.parentElement !== context) context.prepend(tags);
    if (loading && tags) tags.remove();
    modal.querySelector('#modal-player-vitals .player-vitals')?.style.removeProperty('width');
    const watchlist = profile.querySelector('#watchlist-modal-toggle');
    const watched = isInWatchlist(String(player.id));
    watchlist.setAttribute('aria-label', watched ? 'Remove from watchlist' : 'Add to watchlist');
    watchlist.setAttribute('aria-pressed', String(watched));

    const portraitKey = `${player.id}:${full.espn_id || ''}`;
    if (portrait.dataset.player !== portraitKey) {
      portrait.dataset.player = portraitKey;
      const sequence = ++portraitSequence;
      portrait.hidden = true;
      const sleeperUrl = /^\d+$/.test(String(player.id)) ? `https://sleepercdn.com/content/nfl/players/${player.id}.jpg` : '';
      const espnUrl = /^\d+$/.test(String(full.espn_id || '')) ? `https://a.espncdn.com/i/headshots/nfl/players/full/${full.espn_id}.png` : '';
      portrait.onload = () => { if (sequence === portraitSequence) portrait.hidden = false; };
      portrait.onerror = () => {
        if (sequence !== portraitSequence) return;
        if (espnUrl && portrait.getAttribute('src') === espnUrl && sleeperUrl) portrait.src = sleeperUrl;
        else { portrait.hidden = true; portrait.removeAttribute('src'); }
      };
      if (espnUrl || sleeperUrl) portrait.src = espnUrl || sleeperUrl;
      else portrait.removeAttribute('src');
    }
    closeHelp();
    const sequence = ++profileSequence;
    renderSos(null, identity, season);
    if (!loading) {
      if (season === '2026') renderSos(calculateSos(snapshot, team, pos), identity, season);
      else void historicalSource().then(source => {
        if (sequence === profileSequence) renderSos(calculateSos(source, team, pos), identity, season);
      }).catch(() => {
        if (sequence === profileSequence) renderSos(calculateSos(null, team, pos), identity, season);
      });
    }
    requestAnimationFrame(fitName);
  }

  // Both normal roster clicks and nested Start/Sit/Team entry points run the
  // same render adapter. Keep the shared request sequence's stale-player guard.
  const originalRender = window.renderGameLogs;
  window.renderGameLogs = async function(...args) {
    await originalRender(...args);
    if (Number.isFinite(args[3]) && args[3] !== gameLogsModalRequestSeq) return;
    if (state.currentGameLogsPlayer?.id) updateProfile(state.currentGameLogsPlayer);
  };
  const originalOpen = window.handlePlayerNameClick;
  window.handlePlayerNameClick = function(player) {
    const result = originalOpen(player);
    updateProfile(player, { loading: true });
    return result;
  };

  profile.addEventListener('click', event => {
    const button = event.target.closest('[data-profile-sos]');
    if (!button) return;
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    closeHelp();
    if (!wasOpen) {
      help.textContent = button.dataset.explanation;
      help.hidden = false;
      button.setAttribute('aria-expanded', 'true');
    }
  });
  // Tap/keyboard help floats inside the header instead of adding vertical space.
  document.addEventListener('click', event => {
    if (!event.target.closest('.gl-profile-sos, .gl-profile-sos-help')) closeHelp();
  });
  // app.js stops this click from bubbling. Run after its existing button
  // handler so assistive state follows the real add/remove result immediately.
  profile.querySelector('#watchlist-modal-toggle').addEventListener('click', event => {
    const watchlist = event.currentTarget;
    const watched = watchlist.classList.contains('is-watchlisted');
    watchlist.setAttribute('aria-pressed', String(watched));
    watchlist.setAttribute('aria-label', watched ? 'Remove from watchlist' : 'Add to watchlist');
  });
  profile.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || help.hidden) return;
    event.stopPropagation();
    const active = profile.querySelector('[aria-expanded="true"]');
    closeHelp();
    active?.focus();
  });
  new ResizeObserver(fitName).observe(profile.querySelector('.gl-profile-identity'));
  document.fonts?.ready.then(fitName);
})();
