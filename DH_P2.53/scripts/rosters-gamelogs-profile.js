/* Rosters Game Logs upper profile only. Existing renderers remain responsible
 * for every scoring/rank value, source, and navigation/table interaction.
 * This adapter composes their header nodes and asynchronously adds local SOS. */
(() => {
  if (document.body.dataset.page !== 'rosters') return;
  const modal = document.getElementById('game-logs-modal');
  const profile = modal?.querySelector('.gl-profile');
  if (!profile) return;
  const find = selector => profile.querySelector(selector);
  const portrait = find('[data-profile-portrait]');
  const headshot = find('[data-profile-headshot]');
  let sosModule = null, revision = 0, historicalPending = null;
  const rankCache = new WeakMap();

  // In short windows the profile scrolls independently. Keep those gestures
  // out of the modal's existing Season-table scroll forwarding; native wheel,
  // touch and keyboard scrolling inside the profile remain available.
  for (const type of ['wheel', 'touchstart', 'touchmove', 'touchend', 'touchcancel']) {
    profile.addEventListener(type, event => {
      if (profile.scrollHeight > profile.clientHeight + 1) event.stopPropagation();
    }, { passive: true });
  }

  function showIdentity(player) {
    const full = state.players?.[player?.id] || player || {};
    const name = full.full_name || [full.first_name, full.last_name].filter(Boolean).join(' ') || player?.name || 'Player';
    const team = String(player?.team || full.team || 'FA').toUpperCase();
    const teamKey = ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[team] || team;
    const color = TEAM_COLORS[teamKey] || '#64748b';
    profile.style.setProperty('--profile-team', color);
    profile.dataset.playerId = String(player?.id || '');
    find('#modal-player-name').textContent = name;
    find('[data-profile-season]').textContent = `${state.currentGameLogsSeason} season`;
    find('[data-profile-monogram]').textContent = name.split(/\s+/).filter(Boolean).map(word => word[0]).slice(0, 2).join('');
    // Replace the image element per player so a late load/error from an old
    // portrait cannot reveal or hide the next player's headshot. Initials stay
    // visible for missing IDs, blocked hosts, and unavailable portraits.
    const image = headshot.cloneNode(false);
    image.hidden = true;
    image.alt = `${name} headshot`;
    image.removeAttribute('src');
    image.addEventListener('load', () => { if (image.isConnected) { image.hidden = false; portrait.classList.add('has-headshot'); } });
    image.addEventListener('error', () => { if (image.isConnected) { image.hidden = true; portrait.classList.remove('has-headshot'); } });
    portrait.classList.remove('has-headshot');
    find('[data-profile-headshot]').replaceWith(image);
    if (/^\d+$/.test(String(player?.id))) image.src = `https://sleepercdn.com/content/nfl/players/${encodeURIComponent(player.id)}.jpg`;
  }

  function resetSchedule(player) {
    const pos = player?.pos || player?.position || state.players?.[player?.id]?.position || '';
    find('[data-profile-sos-position]').textContent = `${pos} SOS`.trim();
    profile.querySelectorAll('[data-profile-sos]').forEach(node => {
      node.textContent = '—';
      node.parentElement.removeAttribute('data-difficulty');
      node.parentElement.title = 'Schedule difficulty is loading.';
    });
    find('.gl-profile-sos-help').open = false;
    find('[data-profile-sos-help]').textContent = '1 = easiest · 32 = toughest. Position-specific schedule difficulty is loading.';
  }

  async function historicalSource(module) {
    if (!historicalPending) historicalPending = Promise.all(Array.from({ length: 18 }, async (_, index) => {
      const week = index + 1;
      // fetchTextWithCache reuses the archive read by app.js. There are no
      // weekly Sheets, matchup feeds, or current-season overlays in this path.
      const csv = await fetchTextWithCache(buildAppStaticUrl(`${PLAYER_STATS_CSV_PATHS.weeksDir}/WK${week}.csv`));
      const { headers, rows } = parseCsv(csv);
      return { week, rows: rows.map(values => Object.fromEntries(headers.map((header, i) => [header, values[i]]))) };
    })).then(weeks => module.historicalSosSource(weeks)).catch(error => { historicalPending = null; throw error; });
    return historicalPending;
  }

  async function renderSchedule(player, token) {
    const season = state.currentGameLogsSeason;
    const pos = String(player.pos || player.position || '').toUpperCase();
    try {
      // Load this small local helper only when a profile needs it; failures
      // stay within schedule context rather than affecting modal readiness.
      const module = await (sosModule ||= import('./rosters-gamelogs-sos.js?v=DH3.54-player-profile').catch(error => { sosModule = null; throw error; }));
      const source = season === '2026' ? state.rosters2026GameLogs : await historicalSource(module);
      if (token !== revision || modal.classList.contains('hidden') || season !== state.currentGameLogsSeason) return;
      let positions = source && rankCache.get(source);
      if (!positions && source) { positions = {}; rankCache.set(source, positions); }
      const ranked = positions ? (positions[pos] ||= module.rankPositionSchedules(source, pos)) : null;
      const team = module.canonicalSosTeam(source === state.rosters2026GameLogs
        ? source?.seasonStats?.[player.id]?.team || player.team
        : state.rosters2025GameLogs?.seasonStats?.[player.id]?.team || player.team);
      find('[data-profile-sos-position]').textContent = `${pos} SOS`;
      for (const period of ['faced', 'remaining']) {
        const metric = ranked?.[period]?.[team];
        const node = find(`[data-profile-sos="${period}"]`);
        node.textContent = metric?.rank ?? '—';
        if (metric?.rank) node.parentElement.dataset.difficulty = metric.rank <= 10 ? 'easy' : metric.rank >= 23 ? 'tough' : 'neutral';
        const range = period === 'faced' ? `Weeks 1–${ranked?.cutoff || 0}` : `Weeks ${(ranked?.cutoff ?? 0) + 1}–18`;
        node.parentElement.title = metric?.rank
          ? `${range} · ${metric.games} games · ${pos} opponents allow ${metric.average.toFixed(2)} fantasy points per game on average. Rank ${metric.rank} of 32; 1 easiest, 32 toughest.`
          : period === 'remaining' && ranked?.cutoff === 18 ? 'Season complete — no remaining games.' : 'SOS unavailable — complete positional defense and schedule data is required.';
      }
      const range = ranked?.cutoff === 18 ? 'Season complete; no remaining games.'
        : ranked?.cutoff ? `So far: Weeks 1–${ranked.cutoff}. Remaining: Weeks ${ranked.cutoff + 1}–18.` : 'No completed weeks yet.';
      find('[data-profile-sos-help]').textContent = `1 = easiest · 32 = toughest. ${pos} fantasy points allowed per game are averaged across each team's opponents, then ranked across all 32 schedules. ${range} BYEs are excluded; repeat opponents count once per scheduled game. Uses ${season === '2026' ? 'season-to-date positional defensive performance and the latest recorded results' : 'the selected season’s recorded results'}. A dash means no games or incomplete data.`;
    } catch (error) {
      if (token !== revision) return;
      find('[data-profile-sos-help]').textContent = 'SOS is unavailable right now. Reopen this player to retry. Rankings compare positional opponent fantasy points allowed per game across all 32 schedules; 1 is easiest, 32 toughest.';
      profile.querySelectorAll('[data-profile-sos]').forEach(node => { node.parentElement.title = 'Schedule data could not load.'; });
      console.warn('Rosters player profile SOS unavailable.', error);
    }
  }

  function composeProfile(player) {
    find('[data-profile-season]').textContent = `${state.currentGameLogsSeason} season`;
    resetSchedule(player);
    const affiliation = find('[data-profile-affiliation]');
    const tags = modal.querySelector('#modal-header .modal-header-left-container');
    if (tags) {
      // Keep the original position and team button nodes, including the team
      // directory action. Their ownership-pane counterparts are never moved.
      affiliation.replaceChildren(tags);
      const teamButton = tags.querySelector('.modal-team-logo-chip');
      if (teamButton && !teamButton.querySelector('.gl-profile-team-name')) {
        const label = document.createElement('span');
        label.className = 'gl-profile-team-name';
        label.textContent = teamButton.dataset.team || 'FA';
        teamButton.appendChild(label);
        if (!teamButton.disabled) teamButton.insertAdjacentHTML('beforeend', '<svg class="gl-profile-team-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>');
      }
    }
    find('#modal-summary-chips').querySelectorAll('.gamelogs-summary-chip').forEach((chip, index) => {
      chip.dataset.profileMetric = ['points', 'average', 'value'][index];
      chip.setAttribute('aria-label', ['Season fantasy points and ranks', 'Points per game and ranks', 'KeepTradeCut dynasty value and ranks'][index]);
      const caption = document.createElement('span');
      caption.className = 'gl-profile-metric-caption';
      caption.textContent = ['Season production', 'Per game', 'Dynasty value'][index];
      chip.prepend(caption);
      const ranks = chip.querySelector('.chip-values');
      const overall = ranks?.lastElementChild;
      if (overall) {
        const label = document.createElement('span');
        label.className = 'gl-profile-rank-label';
        label.textContent = 'OVR ';
        overall.prepend(label);
      }
    });
    const watchlist = find('#watchlist-modal-toggle');
    const onList = watchlist?.classList.contains('is-watchlisted');
    watchlist?.setAttribute('aria-pressed', String(Boolean(onList)));
    watchlist?.setAttribute('aria-label', onList ? 'Remove from watchlist' : 'Add to watchlist');
    void renderSchedule(player, revision);
  }

  const originalClick = window.handlePlayerNameClick;
  window.handlePlayerNameClick = function(player, ...args) {
    revision++;
    showIdentity(player);
    resetSchedule(player);
    return originalClick(player, ...args);
  };
  const originalRender = window.renderGameLogs;
  window.renderGameLogs = async function(...args) {
    const token = revision;
    // The existing renderer builds its header synchronously before awaiting
    // Career data. Compose those nodes immediately so a slow table fetch never
    // leaves the position/team chips floating outside the profile surface.
    const pending = originalRender(...args);
    const player = state.currentGameLogsPlayer;
    const fresh = token === revision && (!Number.isFinite(args[3]) || args[3] === gameLogsModalRequestSeq);
    if (fresh && player && !modal.classList.contains('hidden')) {
      if (profile.dataset.playerId !== String(player.id)) showIdentity(player);
      composeProfile(player);
    }
    await pending;
  };
  // Watchlist's existing handler owns persistence and its icon. Observe only
  // that button's state so accessible naming also follows add/remove clicks.
  const watchlist = find('#watchlist-modal-toggle');
  new MutationObserver(() => {
    const active = watchlist.classList.contains('is-watchlisted');
    watchlist.setAttribute('aria-pressed', String(active));
    watchlist.setAttribute('aria-label', active ? 'Remove from watchlist' : 'Add to watchlist');
  }).observe(watchlist, { attributes: true, attributeFilter: ['class'] });
})();
