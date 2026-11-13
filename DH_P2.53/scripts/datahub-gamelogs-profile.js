import { rankPositionSchedules, canonicalSosTeam } from './datahub-gamelogs-sos.js?v=DH3.65-playoff-sos';
export { historicalSosSource } from './datahub-gamelogs-sos.js?v=DH3.65-playoff-sos';

/* DataHub Game Logs upper profile only. Existing renderers remain responsible
 * for every scoring/rank value, source, and navigation/table interaction.
 * This adapter composes their header nodes and asynchronously adds local SOS. */
export function createDataHubGameLogsProfile({ modal, state, teamNames, loadTeamStats, loadNflWeek,
  getOpponentDefenseRank, getOpponentRankColor, ordinalSuffix, getInjuryDesignation = () => null }) {
  const profile = modal?.querySelector('.gl-profile');
  if (!profile) return { begin() {}, updateName() {}, compose() {}, invalidate() {} };
  const find = selector => profile.querySelector(selector);
  const portrait = find('[data-profile-portrait]');
  const headshot = find('[data-profile-headshot]');
  let revision = 0, currentNflWeek = null;
  const module = { rankPositionSchedules, canonicalSosTeam };
  const rankCache = new WeakMap();
  const profileTeam = team => {
    const key = String(team || 'FA').trim().toUpperCase();
    return ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[key] || key;
  };

  function profileContext(player) {
    const snapshot = state.seasonDataCache[state.currentModalSeason];
    return {
      team: profileTeam(snapshot?.seasonStats?.[player?.id]?.team || player?.team || state.sleeperPlayers?.[player?.id]?.team),
      pos: String(player?.pos || player?.position || state.sleeperPlayers?.[player?.id]?.position || '').toUpperCase()
    };
  }

  // The current-season profile uses the upcoming NFL week, with the recorded
  // CSV cutoff + 1 as a fallback. BYEs stay on that week rather than skipping
  // to a later game. Read only the local schedule and calculated ranks; projections never advance it.
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
    const rank = getOpponentDefenseRank((source.matchupRanksByTeam || source.defenseByTeam)?.[opponentTeam]?.[`${pos}RK`]);
    return { week, opponent: `${match[1] === '@' ? '@' : 'vs'} ${opponentTeam}`, rank };
  }

  function renderUpcomingMatchup(player) {
    const node = find('[data-profile-season]');
    node.removeAttribute('title');
    // Historical views keep their season label and never borrow a 2026 game.
    if (state.currentModalSeason !== '2026') {
      node.textContent = `${state.currentModalSeason} season`;
      return;
    }
    const { team, pos } = profileContext(player);
    const matchup = upcomingProfileMatchup(state.seasonDataCache['2026']?.profileSource, team, pos, currentNflWeek);
    node.textContent = !matchup ? 'Upcoming matchup —' : matchup.complete ? 'Season complete' : `WK·${matchup.week} ${matchup.opponent}`;
    if (!matchup || matchup.complete || ['BYE', '—'].includes(matchup.opponent)) return;
    const rank = document.createElement('span');
    rank.className = 'gl-profile-matchup-rank';
    rank.textContent = matchup.rank == null ? '(—)' : `(${ordinalSuffix(matchup.rank)})`;
    // Match the Weekly opponent tags: 1 is strongest, 32 weakest. Only the
    // displayed rank is reversed; the source allowance and SOS directions stay intact.
    if (matchup.rank != null) rank.style.color = getOpponentRankColor(matchup.rank);
    rank.title = matchup.rank == null ? `Defense rank vs ${pos} unavailable`
      : `Defense vs ${pos}: ${matchup.rank} of 32 · 1 strongest, 32 weakest`;
    node.append(' ', rank);
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
    if (team !== 'FA' && Object.hasOwn(teamNames, team)) {
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
    const season = state.currentModalSeason;
    if (season !== '2026' || team === 'FA' || !Object.hasOwn(teamNames, team)) return;
    try {
      const { teams } = await loadTeamStats();
      // Switching player/season or closing while TM_STAT loads must not add a
      // previous team's record to the next header. Missing records stay absent.
      if (token !== revision || season !== state.currentModalSeason || !label.isConnected || modal.classList.contains('hidden')) return;
      const record = teams[team]?.record;
      label.textContent = record ? `${team} (${record})` : team;
    } catch (error) {
      console.warn('DataHub player profile team record unavailable.', error);
    }
  }

  // DataHub's portrait fills the space left of the identity/vitals rows. Lower
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
    const full = state.sleeperPlayers?.[player?.id] || player || {};
    const name = player?.fullName || full.full_name || [full.first_name, full.last_name].filter(Boolean).join(' ') || player?.name || 'Player';
    const team = profileContext(player).team;
    const teamKey = ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[team] || team;
    // DataHub header only: reuse the local SVG as a faded portrait backdrop.
    // Replace it per player so delayed image events cannot reveal an old team.
    const watermark = find('[data-profile-watermark]').cloneNode(false);
    watermark.hidden = true;
    watermark.removeAttribute('src');
    watermark.addEventListener('load', () => { if (watermark.isConnected) watermark.hidden = false; });
    watermark.addEventListener('error', () => { if (watermark.isConnected) watermark.hidden = true; });
    find('[data-profile-watermark]').replaceWith(watermark);
    if (Object.hasOwn(teamNames, teamKey) && teamKey !== 'FA') watermark.src = `../assets/NFL_logos_svg/${teamKey.toLowerCase()}.svg`;
    profile.dataset.playerId = String(player?.id || '');
    renderProfileName(player, name);
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

  function renderProfileName(player, name) {
    // DataHub profile only: show the current Sleeper designation beside the
    // name. Rebuilding the heading clears stale badges when players change;
    // historical weekly injury cells and future projections are not consulted.
    const nameNode = find('#modal-player-name');
    nameNode.querySelector('.gl-profile-injury')?.remove();
    if (name !== undefined) nameNode.textContent = name;
    const injury = getInjuryDesignation(player?.id);
    if (injury) {
      const badge = document.createElement('span');
      badge.className = 'gl-profile-injury';
      badge.textContent = injury.designation;
      badge.style.color = injury.color;
      badge.setAttribute('aria-label', `Current injury designation: ${injury.designation}`);
      nameNode.append(badge);
    }
  }

  function resetSchedule(player) {
    // Prefix SOS with the selected season's team and the player's position;
    // the async result below confirms the context for all three SOS periods.
    const { team, pos } = profileContext(player);
    renderScheduleHeading(team, pos);
    find('.gl-profile-schedule').setAttribute('aria-label', `${team} ${pos} strength of schedule; ${state.currentModalSeason} year to date, rest of season, and fantasy playoffs (Weeks 15–17)`.trim());
    profile.querySelectorAll('[data-profile-sos]').forEach(node => {
      node.textContent = '—';
      node.style.removeProperty('color');
      node.parentElement.title = 'Schedule difficulty is loading.';
    });
    find('.gl-profile-sos-help').open = false;
    find('[data-profile-sos-help]').textContent = '1 = easiest · 32 = toughest. Position-specific schedule difficulty is loading. YTD = year to date; ROS = rest of season; PLAYOFF = fantasy playoffs, Weeks 15–17 only.';
  }

  async function renderSchedule(player, token) {
    const season = state.currentModalSeason;
    const pos = String(player.pos || player.position || '').toUpperCase();
    try {
      // Reuse the selected DataHub snapshot's schedule and raw defensive ranks.
      // Historical SOS was built from the same archived CSV read; no extra feed.
      const source = state.seasonDataCache[season]?.profileSource;
      if (token !== revision || modal.classList.contains('hidden') || season !== state.currentModalSeason) return;
      let positions = source && rankCache.get(source);
      if (!positions && source) { positions = {}; rankCache.set(source, positions); }
      const ranked = positions ? (positions[pos] ||= module.rankPositionSchedules(source, pos, season === '2026' ? 'rank' : 'allowance')) : null;
      const team = module.canonicalSosTeam(profileContext(player).team);
      renderScheduleHeading(team, pos);
      // PLAYOFF shares the existing rank, color, ordinal and divider styling;
      // its fixed Weeks 15–17 range is independent of the YTD/ROS cutoff.
      for (const period of ['faced', 'remaining', 'playoff']) {
        const metric = ranked?.[period]?.[team];
        const node = find(`[data-profile-sos="${period}"]`);
        node.textContent = metric?.rank ?? '—';
        // SOS uses 1 = easiest (green) through 32 = toughest (pink). Reuse
        // DataHub.js's explicit SOS direction and ordinal exceptions (11th–13th).
        if (metric?.rank) {
          const suffix = document.createElement('sup');
          suffix.textContent = ordinalSuffix(metric.rank).slice(String(metric.rank).length);
          node.appendChild(suffix);
          node.style.color = getOpponentRankColor(metric.rank, 'descending');
        }
        const range = period === 'playoff' ? 'Weeks 15–17' : period === 'faced' ? `Weeks 1–${ranked?.cutoff || 0}` : `Weeks ${(ranked?.cutoff ?? 0) + 1}–18`;
        const average = ranked?.basis === 'rank'
          ? `Average opponent defensive rank vs ${pos}: ${metric?.average?.toFixed(2)} (1 easiest, 32 toughest).`
          : `${pos} opponents allow ${metric?.average?.toFixed(2)} fantasy points per game on average.`;
        node.parentElement.title = metric?.rank
          ? `${range} · ${metric.games} games · ${average} Schedule rank ${metric.rank} of 32; 1 easiest, 32 toughest.`
          : period === 'remaining' && ranked?.cutoff === 18 ? 'Season complete — no remaining games.' : 'SOS unavailable — complete positional defense and schedule data is required.';
      }
      const range = ranked?.cutoff === 18 ? 'YTD: Weeks 1–18. Season complete; no remaining games.'
        : ranked?.cutoff ? `YTD: Weeks 1–${ranked.cutoff}. ROS: Weeks ${ranked.cutoff + 1}–18.`
          : ranked?.cutoff === 0 ? 'No completed weeks yet. ROS: Weeks 1–18.' : 'Completed-week cutoff unavailable.';
      const method = season === '2026'
        ? `Defensive ranks against ${pos} are averaged across each team's opponents in each period, then ranked against the corresponding averages for all 32 NFL teams.`
        : `${pos} fantasy points allowed per game are averaged across each team's opponents in each period, then ranked across all 32 schedules.`;
      find('[data-profile-sos-help]').textContent = `1 = easiest · 32 = toughest. ${method} YTD = year to date; ROS = rest of season; PLAYOFF = fantasy playoffs, Weeks 15–17 only. ${range} PLAYOFF always includes all three weeks, even after those games are played. BYEs are excluded; repeat opponents count once per scheduled game. The YTD/ROS cutoff is the latest recorded results week, regardless of the player's availability; future projections do not count. Tied averages share a rank. A dash means no games or incomplete data.`;
    } catch (error) {
      if (token !== revision) return;
      find('[data-profile-sos-help]').textContent = 'SOS is unavailable right now. Reopen this player to retry. Rankings compare position-specific opponent defensive averages across all 32 schedules; 1 is easiest, 32 toughest. YTD = year to date; ROS = rest of season; PLAYOFF = fantasy playoffs, Weeks 15–17 only.';
      profile.querySelectorAll('[data-profile-sos]').forEach(node => { node.parentElement.title = 'Schedule data could not load.'; });
      console.warn('DataHub player profile SOS unavailable.', error);
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
      if (position) { position.className = 'gl-profile-position'; position.dataset.pos = player.pos; }
      // Retain the container's legacy class for DataHub.js's player-switch cleanup;
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
    // Short labels apply only to this player header, after the existing vital
    // formatter has assigned values and conditional colors from HEIGHT/WEIGHT.
    find('#modal-player-vitals').querySelectorAll('.player-vitals__label').forEach(label => {
      const short = { HEIGHT: 'HT', WEIGHT: 'WT' }[label.textContent];
      if (short) { label.title = label.textContent === 'HEIGHT' ? 'Height' : 'Weight'; label.textContent = short; }
    });
    syncPortraitClip();
    void renderSchedule(player, revision);
    const token = revision, season = state.currentModalSeason;
    // Sleeper supplies only current-week metadata here. Never read live stats
    // or projections into completed Game Logs, SOS, or qualification cutoffs.
    if (season === '2026') void loadNflWeek().then(week => {
      if (token !== revision || season !== state.currentModalSeason || modal.classList.contains('hidden')) return;
      currentNflWeek = week;
      renderUpcomingMatchup(player);
      syncPortraitClip();
    });
  }

  return {
    // Invalidate pending header work on every player/season launch and close.
    begin(player) { revision++; showIdentity(player); resetSchedule(player); },
    updateName(player) { renderProfileName(player); },
    compose(player) {
      revision++;
      showIdentity(player);
      composeProfile(player);
    },
    invalidate() { revision++; }
  };
}
