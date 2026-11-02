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

  // Clip only Rosters' portrait artwork to the modal panel's actual top edge.
  // Account for the opening scale transform so the cutoff stays correct after
  // the animation, font loading, player changes and responsive layout changes.
  function syncPortraitClip() {
    if (modal.classList.contains('hidden') || !portrait.offsetHeight) return;
    const panel = modal.querySelector('#gamelogs-tab-pane');
    const portraitRect = portrait.getBoundingClientRect();
    const scale = portraitRect.height / portrait.offsetHeight || 1;
    const top = (panel.getBoundingClientRect().top - portraitRect.top) / scale;
    portrait.style.setProperty('--profile-art-clip-top', `${top}px`);
  }
  const portraitLayout = new ResizeObserver(syncPortraitClip);
  [modal.querySelector('#gamelogs-tab-pane'), portrait, find('.gl-profile-intro')].forEach(node => portraitLayout.observe(node));

  function showIdentity(player) {
    const full = state.players?.[player?.id] || player || {};
    const name = full.full_name || [full.first_name, full.last_name].filter(Boolean).join(' ') || player?.name || 'Player';
    const team = String(player?.team || full.team || 'FA').toUpperCase();
    const teamKey = ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[team] || team;
    const color = TEAM_COLORS[teamKey] || '#64748b';
    profile.style.setProperty('--profile-team', color);
    // Rosters header only: reuse the local SVG as a faded portrait backdrop.
    // Replace it per player so delayed image events cannot reveal an old team.
    const watermark = find('[data-profile-watermark]').cloneNode(false);
    watermark.hidden = true;
    watermark.removeAttribute('src');
    watermark.addEventListener('load', () => { if (watermark.isConnected) watermark.hidden = false; });
    watermark.addEventListener('error', () => { if (watermark.isConnected) watermark.hidden = true; });
    find('[data-profile-watermark]').replaceWith(watermark);
    if (Object.hasOwn(TEAM_COLORS, teamKey) && teamKey !== 'FA') watermark.src = `../assets/NFL_logos_svg/${teamKey.toLowerCase()}.svg`;
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
    // Keep SOS as the visible group heading; the selected year labels completed
    // games and ROS labels the remaining schedule without repeating SOS twice.
    find('[data-profile-sos-position]').textContent = 'SOS';
    find('[data-profile-sos-season]').textContent = `${state.currentGameLogsSeason}:`;
    find('.gl-profile-schedule').setAttribute('aria-label', `${pos} strength of schedule; ${state.currentGameLogsSeason} so far and rest of season`.trim());
    profile.querySelectorAll('[data-profile-sos]').forEach(node => {
      node.textContent = '—';
      node.style.removeProperty('color');
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
      const module = await (sosModule ||= import('./rosters-gamelogs-sos.js?v=DH3.54c-profile-sos-ranks').catch(error => { sosModule = null; throw error; }));
      const source = season === '2026' ? state.rosters2026GameLogs : await historicalSource(module);
      if (token !== revision || modal.classList.contains('hidden') || season !== state.currentGameLogsSeason) return;
      let positions = source && rankCache.get(source);
      if (!positions && source) { positions = {}; rankCache.set(source, positions); }
      const ranked = positions ? (positions[pos] ||= module.rankPositionSchedules(source, pos, season === '2026' ? 'rank' : 'allowance')) : null;
      const team = module.canonicalSosTeam(source === state.rosters2026GameLogs
        ? source?.seasonStats?.[player.id]?.team || player.team
        : state.rosters2025GameLogs?.seasonStats?.[player.id]?.team || player.team);
      for (const period of ['faced', 'remaining']) {
        const metric = ranked?.[period]?.[team];
        const node = find(`[data-profile-sos="${period}"]`);
        node.textContent = metric?.rank ?? '—';
        // SOS uses 1 = easiest (green) through 32 = toughest (pink). Reuse
        // app.js's explicit SOS direction and ordinal exceptions (11th–13th).
        if (metric?.rank) {
          const suffix = document.createElement('sup');
          suffix.textContent = ordinalSuffix(metric.rank).slice(String(metric.rank).length);
          node.appendChild(suffix);
          node.style.color = getOpponentRankColor(metric.rank, 'descending');
        }
        const range = period === 'faced' ? `Weeks 1–${ranked?.cutoff || 0}` : `Weeks ${(ranked?.cutoff ?? 0) + 1}–18`;
        const average = ranked?.basis === 'rank'
          ? `Average opponent defensive rank vs ${pos}: ${metric?.average?.toFixed(2)} (1 easiest, 32 toughest).`
          : `${pos} opponents allow ${metric?.average?.toFixed(2)} fantasy points per game on average.`;
        node.parentElement.title = metric?.rank
          ? `${range} · ${metric.games} games · ${average} Schedule rank ${metric.rank} of 32; 1 easiest, 32 toughest.`
          : period === 'remaining' && ranked?.cutoff === 18 ? 'Season complete — no remaining games.' : 'SOS unavailable — complete positional defense and schedule data is required.';
      }
      const range = ranked?.cutoff === 18 ? 'Season complete; no remaining games.'
        : ranked?.cutoff ? `So far: Weeks 1–${ranked.cutoff}. Remaining: Weeks ${ranked.cutoff + 1}–18.` : 'No completed weeks yet.';
      const method = season === '2026'
        ? `Defensive ranks against ${pos} are averaged across the opponents each team has faced, then ranked against the corresponding averages for all 32 NFL teams. ROS uses the same method for remaining opponents.`
        : `${pos} fantasy points allowed per game are averaged across each team's opponents, then ranked across all 32 schedules.`;
      find('[data-profile-sos-help]').textContent = `1 = easiest · 32 = toughest. ${method} ${season} = schedule so far; ROS = rest of season. ${range} BYEs are excluded; repeat opponents count once per scheduled game. The cutoff is the latest recorded results week, regardless of the player's availability; future projections do not count. Tied averages share a rank. A dash means no games or incomplete data.`;
    } catch (error) {
      if (token !== revision) return;
      find('[data-profile-sos-help]').textContent = 'SOS is unavailable right now. Reopen this player to retry. Rankings compare position-specific opponent defensive averages across all 32 schedules; 1 is easiest, 32 toughest. ROS means rest of season.';
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
      // Reuse the original team button/action and position text, but give this
      // header its own unboxed typography instead of inheriting badge styles.
      const position = tags.querySelector('.modal-pos-tag');
      if (position) position.className = 'gl-profile-position';
      // Retain the container's legacy class for app.js's player-switch cleanup;
      // the position/team children now use header-local presentation classes.
      tags.className = 'modal-header-left-container gl-profile-affiliation-content';
      affiliation.replaceChildren(tags);
      const teamButton = tags.querySelector('.modal-team-logo-chip');
      if (teamButton) {
        teamButton.className = 'gl-profile-team';
        const logo = teamButton.querySelector('img');
        if (logo) logo.className = 'gl-profile-team-logo';
        const label = document.createElement('span');
        label.className = 'gl-profile-team-name';
        label.textContent = teamButton.dataset.team || 'FA';
        teamButton.replaceChildren(...(logo ? [logo, label] : [label]));
        if (!teamButton.disabled) teamButton.insertAdjacentHTML('beforeend', '<svg class="gl-profile-team-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>');
      }
    }
    // Retain the existing vital value nodes and their conditional colors.
    // Only the outer layout changes from a capsule to inline label/value pairs.
    const vitals = find('#modal-player-vitals .player-vitals');
    if (vitals) vitals.className = 'gl-profile-vitals-list player-vitals--modal';
    find('#modal-summary-chips').querySelectorAll('.gamelogs-summary-chip').forEach((chip, index) => {
      chip.className = 'gl-profile-stat';
      chip.dataset.profileMetric = ['points', 'average', 'value'][index];
      chip.setAttribute('aria-label', ['Season fantasy points and ranks', 'Points per game and ranks', 'KeepTradeCut dynasty value and ranks'][index]);
      const heading = chip.querySelector('h4');
      const value = heading.querySelector('.chip-header-value');
      const unit = heading.querySelector('.chip-unit');
      heading.className = 'gl-profile-stat-main';
      value.className = 'gl-profile-stat-value';
      unit.className = 'gl-profile-stat-unit';
      heading.replaceChildren(unit, value);
      const ranks = chip.querySelector('.chip-values');
      ranks.className = 'gl-profile-stat-ranks';
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
    syncPortraitClip();
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
