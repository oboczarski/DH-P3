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
  const profileTeam = team => {
    const key = String(team || 'FA').trim().toUpperCase();
    return ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[key] || key;
  };

  function profileContext(player) {
    const snapshot = state.currentGameLogsSeason === '2026' ? state.rosters2026GameLogs : state.rosters2025GameLogs;
    return {
      team: profileTeam(snapshot?.seasonStats?.[player?.id]?.team || player?.team || state.players?.[player?.id]?.team),
      pos: String(player?.pos || player?.position || state.players?.[player?.id]?.position || '').toUpperCase()
    };
  }

  // The current-season profile uses the upcoming NFL week, with the recorded
  // CSV cutoff + 1 as a fallback. BYEs stay on that week rather than skipping
  // to a later game. Read only schedule/DRK; projections never advance it.
  function upcomingProfileMatchup(source, team, pos, currentWeek) {
    const cutoff = source?.latestRecordedWeek;
    if (!Number.isInteger(cutoff) || cutoff < 0 || cutoff > 18) return null;
    if (cutoff === 18) return { complete: true };
    const week = Number.isInteger(currentWeek) && currentWeek > cutoff && currentWeek <= 18 ? currentWeek : cutoff + 1;
    const opponent = String(source.scheduleByTeam?.[team]?.[week] || '').trim();
    if (/^BYE$/i.test(opponent)) return { week, opponent: 'BYE', rank: null };
    const match = /^(vs\.?|@)\s*([A-Z]{2,3})$/i.exec(opponent);
    if (!match) return { week, opponent: '—', rank: null };
    const opponentTeam = profileTeam(match[2]);
    const rank = getOpponentDefenseRank(source.defenseByTeam?.[opponentTeam]?.[`${pos}RK`]);
    return { week, opponent: `${match[1] === '@' ? '@' : 'vs'} ${opponentTeam}`, rank };
  }

  function renderUpcomingMatchup(player) {
    const node = find('[data-profile-season]');
    node.removeAttribute('title');
    node.removeAttribute('aria-label');
    node.disabled = true;
    // Historical views keep their season label and never borrow a 2026 game.
    if (state.currentGameLogsSeason !== '2026') {
      node.textContent = `${state.currentGameLogsSeason} season`;
      return;
    }
    const { team, pos } = profileContext(player);
    const matchup = upcomingProfileMatchup(state.rosters2026GameLogs, team, pos, getCurrentNflWeekNumber());
    node.textContent = !matchup ? 'Upcoming matchup —' : matchup.complete ? 'Season complete' : `WK·${matchup.week} ${matchup.opponent}`;
    if (!matchup || matchup.complete || ['BYE', '—'].includes(matchup.opponent)) return;
    const rank = document.createElement('span');
    rank.className = 'gl-profile-matchup-rank';
    rank.textContent = matchup.rank == null ? '(—)' : `(${ordinalSuffix(matchup.rank)})`;
    // Match the Weekly opponent tags: 1 is strongest, 32 weakest. Only the
    // displayed rank is reversed; the source DRK and SOS directions stay intact.
    if (matchup.rank != null) rank.style.color = getOpponentRankColor(matchup.rank);
    rank.title = matchup.rank == null ? `Defense rank vs ${pos} unavailable`
      : `Defense vs ${pos}: ${matchup.rank} of 32 · 1 strongest, 32 weakest`;
    node.append(' ', rank);
    // The upcoming-game label mirrors the team label's chevron and opens the
    // Rosters-owned matchup dialog. BYEs/missing/historical labels stay inert.
    node.disabled = false;
    node.setAttribute('aria-label', `Open matchup breakdown · Week ${matchup.week} ${matchup.opponent}`);
    node.insertAdjacentHTML('beforeend', '<svg class="gl-profile-season-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>');
  }

  function renderScheduleHeading(team, pos) {
    // The SOS prefix keeps its own logo and reuses the profile's exact position
    // palette. Text nodes keep unknown/free-agent teams safe and logo-free.
    const heading = find('[data-profile-sos-position]');
    const position = document.createElement('span');
    position.className = 'gl-profile-position';
    position.dataset.pos = pos;
    position.textContent = pos;
    heading.replaceChildren();
    if (team !== 'FA' && Object.hasOwn(TEAM_COLORS, team)) {
      const image = document.createElement('img');
      image.className = 'gl-profile-schedule-logo';
      image.src = `../assets/NFL_logos_svg/${team.toLowerCase()}.svg`;
      image.alt = '';
      image.width = image.height = 16;
      heading.append(image);
    }
    heading.append(document.createTextNode(`${team} `), position, document.createTextNode(' SOS'));
  }

  async function renderTeamRecord(label, team, token) {
    const season = state.currentGameLogsSeason;
    if (season !== '2026' || team === 'FA' || !Object.hasOwn(TEAM_COLORS, team)) return;
    try {
      const { teams } = await window.ensureRosters2026TeamStatsLoaded();
      // Switching player/season or closing while TM_STAT loads must not add a
      // previous team's record to the next header. Missing records stay absent.
      if (token !== revision || season !== state.currentGameLogsSeason || !label.isConnected || modal.classList.contains('hidden')) return;
      const record = teams[team]?.record;
      label.textContent = record ? `${team} (${record})` : team;
    } catch (error) {
      console.warn('Rosters player profile team record unavailable.', error);
    }
  }

  // Rosters' portrait fills the space left of the identity/vitals rows. Lower
  // its bottom to the summary divider and add exactly that distance to its
  // height, preserving its original top; scale the width/watermark in proportion.
  // The short-landscape summary sits beside identity, so use the vitals' lower
  // edge there. Divide out the opening transform to work in local CSS pixels.
  function syncPortraitClip() {
    if (modal.classList.contains('hidden') || !portrait.offsetHeight) return;
    const panel = modal.querySelector('#gamelogs-tab-pane');
    const portraitRect = portrait.getBoundingClientRect();
    const scale = portraitRect.height / portrait.offsetHeight || 1;
    const top = (panel.getBoundingClientRect().top - portraitRect.top) / scale;
    const summary = find('#modal-summary-row').getBoundingClientRect();
    const vitals = find('#modal-player-vitals').getBoundingClientRect();
    const divider = summary.top >= portraitRect.bottom ? summary.top : vitals.bottom;
    const style = getComputedStyle(portrait);
    const baseBottom = parseFloat(style.getPropertyValue('--profile-headshot-bottom')) || 0;
    const baseHeight = portrait.offsetHeight * parseFloat(style.getPropertyValue('--profile-headshot-base-height')) / 100;
    const baseWidth = portrait.offsetWidth * parseFloat(style.getPropertyValue('--profile-headshot-base-width')) / 100;
    const drop = Math.max(0, (divider - portraitRect.bottom) / scale + baseBottom);
    const growth = baseHeight > 0 ? 1 + drop / baseHeight : 1;
    portrait.style.setProperty('--profile-art-clip-top', `${top}px`);
    portrait.style.setProperty('--profile-headshot-drop', `${drop}px`);
    portrait.style.setProperty('--profile-headshot-width-extra', `${baseWidth * (growth - 1)}px`);
    portrait.style.setProperty('--profile-headshot-scale', String(growth));
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
    renderUpcomingMatchup(player);
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

  // Rosters' completed-schedule label uses the existing SOS results cutoff.
  // Keep an unknown/empty cutoff neutral instead of showing a year or Week 0.
  function renderScheduleRange(source) {
    const cutoff = source?.latestRecordedWeek;
    find('[data-profile-sos-season]').textContent = Number.isInteger(cutoff) && cutoff >= 1 && cutoff <= 18
      ? `WK1-WK${cutoff}:` : 'WK1-WK—:';
  }

  function resetSchedule(player) {
    // Prefix SOS with the selected season's team and the player's position;
    // the async result below confirms the same context used for both ranks.
    const { team, pos } = profileContext(player);
    renderScheduleHeading(team, pos);
    renderScheduleRange(state.currentGameLogsSeason === '2026' ? state.rosters2026GameLogs : state.rosters2025GameLogs);
    find('.gl-profile-schedule').setAttribute('aria-label', `${team} ${pos} strength of schedule; ${state.currentGameLogsSeason} so far and rest of season`.trim());
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
      renderScheduleRange(source);
      let positions = source && rankCache.get(source);
      if (!positions && source) { positions = {}; rankCache.set(source, positions); }
      const ranked = positions ? (positions[pos] ||= module.rankPositionSchedules(source, pos, season === '2026' ? 'rank' : 'allowance')) : null;
      const team = module.canonicalSosTeam(source === state.rosters2026GameLogs
        ? source?.seasonStats?.[player.id]?.team || player.team
        : state.rosters2025GameLogs?.seasonStats?.[player.id]?.team || player.team);
      renderScheduleHeading(team, pos);
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
    renderUpcomingMatchup(player);
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
        void renderTeamRecord(label, profileTeam(teamButton.dataset.team), revision);
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
    if (token === revision && (!Number.isFinite(args[3]) || args[3] === gameLogsModalRequestSeq) && !modal.classList.contains('hidden')) {
      // Let Rosters' existing vitals decorator read HEIGHT/WEIGHT first so its
      // conditional colors stay intact. Short labels apply only to this header.
      find('#modal-player-vitals').querySelectorAll('.player-vitals__label').forEach(label => {
        const short = { HEIGHT: 'HT', WEIGHT: 'WT' }[label.textContent];
        if (short) { label.title = label.textContent === 'HEIGHT' ? 'Height' : 'Weight'; label.textContent = short; }
      });
      syncPortraitClip();
    }
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
