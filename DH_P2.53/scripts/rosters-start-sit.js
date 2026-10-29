/* Rosters' Start/Sit presentation. Data arrives as immutable snapshots from
 * app.js; this file owns only the new preview, comparison and chart lifecycle.
 * The roster cards, Game Logs, DataHub and Matchups keep their own renderers. */
(() => {
  'use strict';
  if (document.body.dataset.page !== 'rosters') return;

  const PALETTES = [
    { main: '#76e8ef', light: '#d0fcff', mid: '#389ed7', deep: '#235777', rgb: '102,224,239' },
    { main: '#be9bff', light: '#f0dfff', mid: '#8c66e0', deep: '#513888', rgb: '184,147,250' },
  ];
  const OVERVIEW = [
    { id: 'info', label: 'PLAYER INFO', stats: ['overall_rank', 'player_name', 'position', 'team', 'age'] },
    { id: 'fantasy', label: 'FANTASY', stats: ['fpts', 'ppg'] },
    { id: 'overview', label: 'OVERVIEW STATS', stats: ['games_played', 'snp_pct', 'yds_total', 'ypg', 'td_total', 'opp', 'imp', 'imp_per_opp', 'tds_pct'] },
    { id: 'ceiling', label: 'CEILING & CONSISTENCY', stats: ['fpoe', 'csty_pct', 'ceiling'] },
  ];
  const LABELS = { overall_rank: 'RK', player_name: 'PLAYER', position: 'POS', team: 'TM', age: 'AGE', games_played: 'G',
    ypg: 'YPG(t)', td_total: 'TD(t)', opp: 'OPP', imp: 'IMP', imp_per_opp: 'IMP/OPP', tds_pct: 'TDS%', csty_pct: 'CSTY%', ceiling: 'CL' };
  const DESCRIPTIONS = {
    fpts: 'Fantasy points in your league scoring format', ppg: 'Fantasy points per game in your league scoring format',
    fpoe: 'Fantasy points over expected', overall_rank: 'Overall fantasy points rank in your league',
    games_played: 'Games played', snp_pct: 'Offensive snap share', yds_total: 'Total yards', ypg: 'Total yards per game',
    td_total: 'Total touchdowns', opp: 'Opportunities: pass attempts, carries and targets', imp: 'Impact plays: first downs and touchdowns',
    imp_per_opp: 'Share of opportunities resulting in a first down or touchdown', tds_pct: 'Share of team touchdowns',
    csty_pct: 'Published PPR consistency rate', ceiling: 'Published ceiling: average of the top three PPR games',
    pass_att: 'Pass attempts', pass_cmp: 'Completions', pass_yd: 'Passing yards', pass_td: 'Passing touchdowns',
    pass_fd: 'Passing first downs', epa: 'Expected points added', pass_imp: 'Passing first downs and touchdowns',
    pass_sack: 'Sacks taken · lower is better', pass_int: 'Interceptions · lower is better', dropbacks: 'Dropbacks',
    epa_per_db: 'Expected points added per dropback', cpoe: 'Completion percentage over expected', pass_rtg: 'Passer rating',
    cmp_pct: 'Completion percentage', pass_imp_per_att: 'Share of pass attempts resulting in a first down or touchdown',
    ttt: 'Time to throw · contextual metric', prs_pct: 'Pressure rate · contextual metric', blitz_pct: 'Blitz rate · contextual metric',
    dp_pct: 'Deep pass rate · contextual metric', pa_ypg: 'Passing yards per game', team_pass_pct: 'Team pass rate · contextual metric',
    rush_att: 'Carries', rush_yd: 'Rushing yards', rush_td: 'Rushing touchdowns', rush_fd: 'Rushing first downs',
    rush_yac: 'Rushing yards after contact', rush_ybc: 'Rushing yards before contact', mtf: 'Missed tackles forced',
    rz_att: 'Red zone carries', gl_att: 'Goal line carries', ypc: 'Yards per carry', elu: 'Elusiveness rating',
    mtf_per_att: 'Missed tackles forced per carry', yco_per_att: 'Yards after contact per carry', ybc_per_att: 'Yards before contact per carry',
    expl_ru_pct: 'Share of carries gaining at least ten yards', ryoe: 'Rushing yards over expected', ryoe_per_att: 'Rushing yards over expected per carry',
    ru_ypg: 'Rushing yards per game', car_per_g: 'Carries per game', rec_tgt: 'Targets', rec: 'Receptions', rec_yd: 'Receiving yards',
    rec_td: 'Receiving touchdowns', rec_fd: 'Receiving first downs', rec_yar: 'Yards after catch', rr: 'Routes run', rz_tgt: 'Red zone targets',
    tgt_10_plus: 'Games with at least ten targets', ts_per_rr: 'Target share', yprr: 'Receiving yards per route run',
    tprr: 'Targets per route run', tgt_per_g: 'Targets per game', rec_yacr: 'Yards after catch per reception',
    first_down_rec_rate: 'Receiving first downs per route run', rec_ypg: 'Receiving yards per game', rec_per_g: 'Receptions per game',
    ay_pct: 'Air yards share', ay_per_tgt: 'Air yards per target', rec_yms: 'Share of team receiving yards', rec_tms: 'Share of team receiving touchdowns',
    ypr: 'Yards per reception', fum: 'Fumbles lost · lower is better', imp_per_g: 'Impact plays per game',
  };
  const LOWER = new Set(['pass_int', 'pass_sack', 'fum', 'overall_rank']);
  const CONTEXT = new Set(['ttt', 'prs_pct', 'blitz_pct', 'dp_pct', 'team_pass_pct', 'age', 'games_played', 'position', 'player_name', 'team']);
  let chartPromise;
  let previewObserver = null;
  let mounted = null;
  let sequence = 0;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const number = value => value == null || String(value).trim() === '' ? null : Number.isFinite(Number(value)) ? Number(value) : null;
  const fmt = (value, digits = 1) => number(value) === null ? '—' : Number(value).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const sign = (value, digits = 1) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${fmt(Math.abs(value), digits)}`;
  const shortName = player => (player.name || player.label || '').split(' ').filter(Boolean).slice(-1).join(' ');
  const icon = (name, extra = '') => {
    const paths = {
      chart: '<path d="M3 17 8 11l4 3 8-10M15 4h5v5"/><path d="M3 3v18h18"/>',
      layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
      spark: '<path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z"/>',
      close: '<path d="m6 6 12 12M6 18 18 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
      arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', swap: '<path d="M4 7h16l-4-4M20 17H4l4 4"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      plus: '<path d="M12 5v14M5 12h14"/>', clear: '<path d="m3 14 10-10a2 2 0 0 1 3 0l4 4a2 2 0 0 1 0 3L10 21H6l-3-3a3 3 0 0 1 0-4Z"/><path d="m9 8 8 8M10 21h11"/>',
      pulse: '<path d="M2 12h5l3-8 4 16 3-8h5"/>', shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    };
    return `<svg class="ss-icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.chart}</svg>`;
  };
  function logo(team, className = '') {
    const normalized = ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[team] || team;
    if (!/^(ARI|ATL|BAL|BUF|CAR|CHI|CIN|CLE|DAL|DEN|DET|GB|HOU|IND|JAX|KC|LAC|LAR|LV|MIA|MIN|NE|NO|NYG|NYJ|PHI|PIT|SEA|SF|TB|TEN|WAS)$/.test(normalized)) return '';
    return `<img class="ss-logo ${className}" src="../assets/NFL_logos_svg/${normalized.toLowerCase()}.svg" width="32" height="32" alt="${className === 'ss-hero-watermark' ? '' : escape(normalized)}"${className === 'ss-hero-watermark' ? ' aria-hidden="true"' : ''} decoding="async">`;
  }

  // Preview history is the last five played games this season, rather than
  // calendar weeks. BYE/DNP/missing results are skipped; zero/negative games
  // remain real appearances, with point labels and their original week numbers.
  function sparkline(weekly, uid, side = 0) {
    const data = weekly.filter(item => number(item.points) !== null).slice(-5);
    const values = data.map(item => number(item.points));
    if (!values.length) return '<div class="ss-spark-empty">No recorded games</div>';
    const min = Math.min(0, ...values), max = Math.max(1, ...values), span = max - min || 1;
    const x = index => data.length === 1 ? 90 : 18 + index * 144 / (data.length - 1);
    const y = value => 46 - (value - min) / span * 27;
    const baseline = y(0);
    const points = data.map((item, index) => [x(index), y(item.points)]);
    const id = `ss-spark-${uid}`;
    const palette = PALETTES[side % 2];
    const areas = `<path d="M${points[0][0]},${baseline} ${points.map(point => `L${point}`).join(' ')} L${points.at(-1)[0]},${baseline}Z" fill="url(#${id})"/><path d="M${points.map(point => point.join(',')).join(' L')}" fill="none" stroke="${palette.main}" stroke-width="1.7" stroke-linejoin="round"/>`;
    const dots = points.map((point, index) => `<circle cx="${point[0]}" cy="${point[1]}" r="2.2" fill="${palette.light}" stroke="${palette.mid}" stroke-width="1.3"/><text class="ss-spark-value" x="${point[0]}" y="${point[1] - 6}" text-anchor="middle" fill="${palette.light}">${fmt(data[index].points)}</text><text class="ss-spark-week" x="${point[0]}" y="61" text-anchor="middle">W${data[index].week}</text>`).join('');
    const description = data.map(item => `Week ${item.week}: ${fmt(item.points)} points`).join('; ');
    return `<svg class="ss-spark" viewBox="0 0 180 66" preserveAspectRatio="none" role="img" aria-label="Last ${data.length} games this season: ${escape(description)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0.15" y2="1"><stop stop-color="${palette.main}" stop-opacity=".32"/><stop offset=".5" stop-color="${palette.mid}" stop-opacity=".16"/><stop offset="1" stop-color="${palette.deep}" stop-opacity="0"/></linearGradient></defs><path d="M0 ${baseline}H180" stroke="#ffffff14" stroke-dasharray="2 4"/>${areas}${dots}</svg>`;
  }

  // The schedule owns venue text. Both preview rank locations use the same
  // FPFA positional defense-strength rank/color from the prepared display
  // snapshot (1 = best defense). DRK remains the Game Logs rank source only.
  function projectionMatchup(player) {
    const opponent = String(player.matchup?.opponent || player.matchupMetric?.team || '').trim();
    if (player.matchup?.isBye || opponent.toUpperCase() === 'BYE') return '<small class="ss-projection-matchup">BYE</small>';
    const team = opponent.replace(/^(?:vs\.?|@)\s*/i, '').toUpperCase();
    const venue = /^@/.test(opponent) ? '@ ' : /^vs\.?/i.test(opponent) ? 'vs. ' : '';
    const rank = number(player.matchupMetric?.actualRank);
    return `<small class="ss-projection-matchup"${rank !== null ? ` style="color:${escape(player.matchupColor || '#91a2bc')}"` : ''}>${escape(team ? `${venue}${team}` : '—')}${rank !== null ? ` (${rank})` : ''}</small>`;
  }

  // Compare available numeric projections only. Ties, status text and missing
  // values stay neutral; with extra selections only the highest/lowest differ.
  function projectionState(player, players) {
    const value = number(player.projection);
    const values = players.map(entry => number(entry.projection)).filter(entry => entry !== null);
    if (value === null || values.length < 2 || Math.max(...values) === Math.min(...values)) return '';
    return value === Math.max(...values) ? ' ss-leading' : value === Math.min(...values) ? ' ss-trailing' : '';
  }

  // Native buttons keep both heading/name areas keyboard-accessible while the
  // app integration owns Game Logs data, modal stacking and source restoration.
  function playerNameButton(player) {
    return `<button type="button" class="ss-player-name-button" data-ss-gamelogs="${escape(player.id)}" aria-label="Open Game Logs for ${escape(player.name)}">${escape(player.name)}</button>`;
  }
  function bindPlayerNames(mount, players, onGameLogs) {
    mount.querySelectorAll('[data-ss-gamelogs]').forEach(button => button.addEventListener('click', () => {
      const player = players.find(entry => String(entry.id) === button.dataset.ssGamelogs);
      if (player) onGameLogs?.(player, button);
    }));
  }

  function previewMatchup(player, compact = false) {
    const metric = player.matchupMetric;
    const opponent = metric?.team || player.matchup?.opponent || '—';
    const team = String(opponent).trim().replace(/^(?:vs\.?|@)\s*/i, '').toUpperCase();
    const noGame = player.matchup?.isBye || team === 'BYE';
    const unavailable = noGame ? 'Bye week' : player.matchupLoading ? 'Loading matchup data' : 'Matchup data unavailable';
    const rank = metric?.actualRank;
    const color = player.matchupColor || '#aab6cb';
    return `<div class="ss-opponent"><span>${logo(team)}<b>${escape(opponent)}</b><span class="ss-opponent-pos">vs. ${escape(player.pos)}</span></span><span class="ss-rank-pill" style="--ss-rank:${color}" title="Positional defense rank · 1 = best defense / fewest fantasy points allowed">${rank ? `#${rank}<small> / 32</small>` : noGame ? 'BYE' : '—'}</span></div>
      ${compact ? '' : `<div class="ss-defense-grid" aria-label="Opponent defense metrics"><div><span>FPA/G</span><b style="color:${escape(player.actualColor || '#c3cedf')}">${fmt(metric?.actual?.avg)}</b></div><div><span>Expected/G</span><b style="color:${escape(player.sosColor || '#c3cedf')}">${fmt(metric?.expectedAvg)}</b></div><div><span>SOS Rk.</span><b style="color:${escape(player.sosColor || '#c3cedf')}">${metric?.sosRank ?? '—'}<small>${metric?.sosRank ? '/32' : ''}</small></b></div></div>
      <div class="ss-defense-footer"><span title="Actual fantasy points allowed minus expected points, per game">vs Expected <b>${number(metric?.deltaPerGame) === null ? '—' : sign(metric.deltaPerGame, 2)}</b></span><button type="button" data-start-sit-matchup-id="${escape(player.id)}" aria-label="Matchup Breakdown for ${escape(player.name)}"${player.canBreakdown ? '' : ` disabled title="${unavailable}"`}>Matchup Breakdown ${icon('arrow')}</button></div>`}`;
  }

  function renderPreview(model) {
    const { mount, players, week, collapsed, onClear, onClose, onCollapse, onRemove } = model;
    mount.classList.add('ss-preview-mount');
    mount.classList.toggle('collapsed', collapsed);
    const cards = Array.from({ length: Math.max(2, players.length) }, (_, index) => {
      const player = players[index];
      if (!player) return `<div class="ss-preview-empty" aria-label="Player ${index + 1} selection"><div class="ss-orbit">${icon('plus')}</div><strong>Choose player ${index + 1}</strong><span>Tap a card from your roster</span><div class="ss-empty-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;
      const seasonRank = number(player.metrics.fpts?.rank);
      const seasonPosition = `${player.pos}·${seasonRank ?? '—'}`;
      return `<article class="ss-preview-player ss-side-${index % 2}" aria-label="${escape(player.name)} preview">
        <div class="ss-preview-player-top"><span class="ss-player-index">0${index + 1} <i></i><b title="Season fantasy points rank and total · league scoring">${escape(seasonPosition)} <span>(${escape(player.metrics.fpts?.display || '—')})</span></b></span><button class="ss-remove" type="button" data-ss-remove="${escape(player.id)}" aria-label="Remove ${escape(player.name)}">${icon('close')}</button></div>
        <div class="ss-preview-identity"><h4>${playerNameButton(player)}</h4>${logo(player.team)}</div>
        <div class="ss-preview-numbers"><div class="ss-preview-projection${projectionState(player, players)}"><span>WEEK ${week || '—'} PROJ</span><strong>${escape(player.projectionDisplay || '—')}</strong>${projectionMatchup(player)}</div><div><span>SEASON PPG</span><b>${escape(player.metrics.ppg?.display || '—')}</b><small>${escape(player.pos)} · ${player.metrics.ppg?.rank ?? '—'}</small></div></div>
        <div class="ss-mini-timeline"><span>Last 5 Games</span>${sparkline(player.weekly, `preview-${player.id}`, index)}</div>
        ${previewMatchup(player)}
      </article>`;
    }).join('');
    mount.innerHTML = `<section class="ss-preview ss-frame" aria-label="Start/Sit preview"><header class="ss-preview-header"><div class="ss-title-lockup"><span class="ss-app-mark">${icon('layers')}</span><div><span class="ss-eyebrow">LINEUP WORKSPACE</span><h3>Start<span>/</span>Sit <span class="ss-season-pill">WK ${week || '—'}</span></h3></div></div><div class="ss-preview-tools"><button type="button" data-ss-clear aria-label="Clear selections" title="Clear selections"${players.length ? '' : ' disabled'}>${icon('clear')}</button><button type="button" data-ss-collapse aria-label="Collapse Start/Sit preview" title="Collapse preview">${icon('down')}</button><button type="button" data-ss-close aria-label="Exit Start/Sit" title="Exit Start/Sit">${icon('close')}</button></div></header>
      <div class="ss-preview-scroll"><div class="ss-preview-intro"><span>${players.length ? 'Your options, in focus.' : 'Make room for a better decision.'}</span><span class="ss-selection-count">${String(players.length).padStart(2, '0')}<small>/ 06</small></span></div><div class="ss-preview-grid">${cards}</div></div>
      <footer class="ss-preview-footer"><span>${players.length < 2 ? 'Select two players to explore' : 'Scoring. Usage. Matchup.'}<small>FPA · Fantasy Points Allowed</small></span><button id="comparePlayersButton" class="ss-primary${players.length >= 2 ? ' enabled' : ''}" type="button"${players.length < 2 ? ' disabled' : ''}>Compare${icon('arrow')}</button></footer></section>
      <button class="ss-reopen ss-frame" type="button" data-ss-reopen>${icon('layers')}<span>Start / Sit</span><span class="ss-season-pill">WK ${week || '—'}</span><b>${players.length} selected</b>${icon('plus')}</button>`;
    mount.querySelector('[data-ss-clear]')?.addEventListener('click', onClear);
    mount.querySelector('[data-ss-close]')?.addEventListener('click', onClose);
    mount.querySelector('[data-ss-collapse]')?.addEventListener('click', () => onCollapse(true));
    mount.querySelector('[data-ss-reopen]')?.addEventListener('click', () => onCollapse(false));
    mount.querySelectorAll('[data-ss-remove]').forEach(button => button.addEventListener('click', () => onRemove(button.dataset.ssRemove)));
    bindPlayerNames(mount, players, model.onGameLogs);
    // Responsive tray height can change after font loading, rotation or a new
    // selection. Reserve its measured height so the last roster remains tappable.
    previewObserver?.disconnect();
    previewObserver = new ResizeObserver(() => model.onResize?.(mount.offsetHeight));
    previewObserver.observe(mount);
  }
  function disposePreview() { previewObserver?.disconnect(); previewObserver = null; }

  // Comparison loading retains the dashboard's frame, real player identities
  // and an immediate exit. Skeleton bars are decorative, never invented stats
  // or a fabricated completion percentage; the surface stays motionless.
  function renderLoading(model) {
    disposeComparison();
    const { mount, players, season, onClose } = model;
    const pair = players.slice(0, 2);
    mount.setAttribute('aria-busy', 'true');
    mount.innerHTML = `<div class="ss-dashboard ss-loading-dashboard"><header class="ss-dashboard-header"><div class="ss-title-lockup"><span class="ss-app-mark">${icon('layers')}</span><div><span class="ss-eyebrow">START / SIT · PLAYER INTELLIGENCE</span><h1>Head to head<span class="ss-season-pill">${escape(season)}</span></h1></div></div><button class="ss-dashboard-close ss-icon-button" type="button" data-ss-loading-close aria-label="Back to players" title="Back to players">${icon('close')}</button></header>
      <div class="ss-dashboard-scroll ss-loading-stage"><div class="ss-loading-orbit" aria-hidden="true">${icon('layers')}</div><div class="ss-loading-copy" role="status" aria-live="polite"><span class="ss-eyebrow">YOUR COMPARISON IS TAKING SHAPE</span><h2>Bringing both players into focus.</h2><p>Preparing season stats, scoring history and matchup context.</p></div>
      <div class="ss-loading-pair">${pair.map((player, side) => `<article class="ss-loading-player ss-side-${side}">${logo(player.team)}<span>${escape(player.pos || player.basePos)}</span><strong>${escape(player.name || player.label)}</strong><div class="ss-loading-lines" aria-hidden="true"><i></i><i></i></div></article>`).join('')}<span class="ss-loading-versus" aria-hidden="true">VS</span></div>
      <div class="ss-loading-sections" aria-hidden="true">${[['chart', 'Scoring history'], ['layers', 'Season production'], ['shield', 'Matchup context']].map(([symbol, label]) => `<div>${icon(symbol)}<span>${label}</span><i></i></div>`).join('')}</div><span class="ss-loading-footnote">League scoring · ${escape(season)} season</span></div></div>`;
    const close = mount.querySelector('[data-ss-loading-close]');
    close.addEventListener('click', onClose);
    const keyHandler = event => { if (event.key === 'Tab') { event.preventDefault(); close.focus(); } };
    mount.addEventListener('keydown', keyHandler);
    mounted = { mount, keyHandler };
  }

  // ECharts is an existing, pinned, locally bundled dependency. It is requested
  // only for a comparison, and a load failure preserves the accessible table.
  function loadCharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    if (!chartPromise) chartPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('./vendor/echarts-6.0.0.min.js', document.currentScript?.src || new URL('../scripts/rosters-start-sit.js', window.location.href)).href;
      script.onload = () => window.echarts ? resolve(window.echarts) : reject(new Error('Charts unavailable'));
      script.onerror = () => { script.remove(); reject(new Error('Charts unavailable')); };
      document.head.appendChild(script);
    }).catch(error => { chartPromise = null; throw error; });
    return chartPromise;
  }
  function ring(player, side) {
    const value = number(player.metrics.csty_pct?.value);
    const id = `ss-ring-${player.id}-${side}`;
    const p = PALETTES[side];
    return `<div class="ss-consistency-player ss-side-${side}"><svg class="ss-consistency-ring" viewBox="0 0 120 106" role="img" aria-label="${escape(player.name)} consistency ${value === null ? 'unavailable' : `${fmt(value)} percent`}"><defs><linearGradient id="${id}" x1="0" x2="1" y1="1" y2="0"><stop stop-color="${p.deep}"/><stop offset=".35" stop-color="${p.mid}"/><stop offset=".72" stop-color="${p.main}"/><stop offset="1" stop-color="${p.light}"/></linearGradient></defs><path d="M20 85a48 48 0 1 1 80 0" fill="none" stroke="#ffffff0b" stroke-width="7" stroke-linecap="round"/><path d="M20 85a48 48 0 1 1 80 0" fill="none" stroke="url(#${id})" stroke-width="7" stroke-linecap="round" pathLength="100" stroke-dasharray="${value === null ? 0 : Math.min(100, Math.max(0, value))} 100"/><path d="M30 80a36 36 0 1 1 60 0" fill="none" stroke="${p.main}22" stroke-width="1" stroke-dasharray="1 7"/><text x="60" y="58" text-anchor="middle" class="ss-ring-value">${value === null ? '—' : fmt(value, Number.isInteger(value) ? 0 : 1)}<tspan class="ss-ring-unit">${value === null ? '' : '%'}</tspan></text><text x="60" y="74" text-anchor="middle" class="ss-ring-label">CONSISTENCY</text></svg><strong>${escape(shortName(player))}</strong><div class="ss-ceiling"><span>CEILING</span><b>${escape(player.metrics.ceiling?.display || '—')}</b><small>PPR pts</small></div></div>`;
  }
  function getSections(players) {
    return players[0].pos === players[1].pos && players[0].sections.length ? players[0].sections : OVERVIEW;
  }
  function metricRow(key, players) {
    const metrics = players.map(player => player.metrics[key] || { display: '—', value: null, rank: null });
    const values = metrics.map(metric => number(metric.value));
    const label = players[0].labels[key] || LABELS[key] || key;
    const description = DESCRIPTIONS[key] || label;
    const isNumeric = values.some(value => value !== null);
    const max = Math.max(...values.filter(value => value !== null).map(Math.abs), .00001);
    const comparable = values.every(value => value !== null) && !CONTEXT.has(key);
    const equal = comparable && Math.abs(values[0] - values[1]) < 1e-8;
    const winner = comparable && !equal ? (LOWER.has(key) ? values[0] < values[1] : values[0] > values[1]) ? 0 : 1 : null;
    // Values and bars share the same better/worse state, including metrics
    // where lower wins. Equal, unavailable and contextual stats stay neutral.
    const sideState = side => winner === null ? '' : winner === side ? ' ss-leading' : ' ss-trailing';
    const precision = Math.min(3, Math.max(...metrics.map(metric => (String(metric.display).match(/\.(\d+)/)?.[1] || '').length)));
    const diff = comparable && !equal ? `${fmt(Math.abs(values[0] - values[1]), precision)}${String(metrics[0].display).includes('%') ? ' pp' : ''}` : equal ? 'EVEN' : '';
    const valueMarkup = side => `<div class="ss-metric-value ss-side-${side}${sideState(side)}"><b>${escape(metrics[side].display)}</b>${metrics[side].rank ? `<small title="Season positional rank">${escape(players[side].pos)}·${escape(metrics[side].rank)}</small>` : ''}</div>`;
    return `<div class="ss-metric-row${!isNumeric ? ' ss-text-row' : ''}" data-ss-stat="${key}">${valueMarkup(0)}<div class="ss-metric-label"><button class="ss-metric-help" type="button" data-ss-help="${key}" aria-expanded="false" aria-controls="ss-help-${key}" aria-label="Explain ${escape(label)}" title="${escape(description)}">${escape(label)}</button><small class="${winner === null ? '' : `ss-side-${winner}`}">${winner === null ? diff : `${winner === 0 ? '←' : '→'} ${diff}`}</small></div>${valueMarkup(1)}${isNumeric ? `<div class="ss-paired-track" aria-hidden="true">${values.map((value, side) => `<div class="ss-track ss-side-${side}${sideState(side)}"><i class="${value < 0 ? 'ss-negative' : ''}" style="width:${value === null ? 0 : Math.abs(value) / max * 100}%"></i>${value === 0 ? '<em></em>' : ''}</div>`).join('')}<span></span></div>` : ''}<p class="ss-metric-explanation" id="ss-help-${key}" hidden>${escape(description)}</p></div>`;
  }
  function statSections(players) {
    return getSections(players).map((section, index) => `<section class="ss-stat-section ss-panel" id="ss-section-${section.id}" aria-label="${escape(section.label)}"><header class="ss-section-heading"><span class="ss-section-icon">${icon(section.id.includes('efficiency') ? 'spark' : section.id.includes('production') ? 'chart' : section.id === 'info' ? 'target' : 'layers')}</span><div><span class="ss-eyebrow">${String(index + 1).padStart(2, '0')} / SEASON DETAIL</span><h3>${escape(section.label.toLowerCase())}</h3></div><span class="ss-stat-count">${section.stats.length}<small>STATS</small></span></header><div class="ss-section-players"><span>${escape(shortName(players[0]))}</span><span>${escape(shortName(players[1]))}</span></div><div class="ss-metrics">${section.stats.map(key => metricRow(key, players)).join('')}</div></section>`).join('');
  }
  function production(players) {
    const phases = [['pass_yd', 'Passing', '#9eb8f9'], ['rush_yd', 'Rushing', '#75d9c9'], ['rec_yd', 'Receiving', '#b99ae9']];
    const available = phases.filter(([key]) => players.some(player => number(player.metrics[key]?.value) !== null));
    const max = Math.max(1, ...players.map(player => available.reduce((sum, [key]) => sum + Math.max(0, number(player.metrics[key]?.value) || 0), 0)));
    return `<section class="ss-panel ss-production"><header class="ss-panel-header"><div>${icon('layers')}<h3>Yards by phase</h3></div><span class="ss-micro-label">SEASON TOTALS</span></header><div class="ss-production-content">${players.map((player, side) => `<div class="ss-production-player ss-side-${side}"><div><b>${escape(shortName(player))}</b><span>${available.length ? available.map(([key]) => fmt(player.metrics[key]?.value, 0)).join(' / ') : '—'}</span></div><div class="ss-production-track">${available.map(([key, label, color]) => `<i style="width:${Math.max(0, number(player.metrics[key]?.value) || 0) / max * 100}%;--phase:${color}" title="${label}: ${fmt(player.metrics[key]?.value, 0)} yards"></i>`).join('')}</div></div>`).join('')}<div class="ss-production-legend">${available.map(([, label, color]) => `<span><i style="background:${color}"></i>${label}</span>`).join('')}</div><p>Shared scale · ${available.length ? 'Passing / Rushing / Receiving'.split(' / ').filter(label => available.some(([, phase]) => phase === label)).join(' / ') : 'No source totals'}</p></div></section>`;
  }
  function playerHero(player, side, week) {
    const proj = number(player.projection);
    const ppg = number(player.metrics.ppg?.value);
    const difference = proj !== null && ppg !== null ? proj - ppg : null;
    const noProjection = player.matchup?.isBye ? 'Bye week · no game' : proj === null && player.projectionDisplay !== '—' ? 'Weekly status' : 'Projection unavailable';
    return `<article class="ss-hero-player ss-side-${side}">${logo(player.team, 'ss-hero-watermark')}<div class="ss-hero-player-id"><span class="ss-side-marker">${side === 0 ? 'A' : 'B'}</span><span class="ss-pos-pill">${escape(player.pos)}</span><span>${escape(player.team)}</span>${logo(player.team)}</div><h2>${playerNameButton(player)}</h2><div class="ss-hero-score"><span class="ss-eyebrow">WEEK ${week || '—'} PROJECTION</span><div><strong>${escape(player.projectionDisplay || '—')}</strong>${proj === null ? '' : '<small>PTS</small>'}</div><span class="ss-vs-average">${difference === null ? noProjection : `${sign(difference)} vs season PPG`}</span></div><div class="ss-hero-baseline"><div><span>SEASON PPG</span><b>${escape(player.metrics.ppg?.display || '—')}</b></div><div><span>FPTS</span><b>${escape(player.metrics.fpts?.display || '—')}</b></div><div><span>GAMES</span><b>${escape(player.metrics.games_played?.display || '—')}</b></div></div>${previewMatchup(player, true)}</article>`;
  }
  function weeklyTable(players) {
    const weeks = [...new Set(players.flatMap(player => player.weekly.map(item => item.week)))].sort((a, b) => a - b);
    return `<details class="ss-weekly-table"><summary>Explore weekly values ${icon('down')}</summary><div><table><caption>Recorded weekly fantasy points · league scoring</caption><thead><tr><th scope="col">Week</th>${players.map(player => `<th scope="col">${escape(player.name)}</th>`).join('')}</tr></thead><tbody>${weeks.map(week => `<tr><th scope="row">${week}</th>${players.map(player => { const item = player.weekly.find(row => row.week === week); return `<td>${item?.points != null ? fmt(item.points) : escape(item?.status || '—')}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  }
  function comparisonMarkup(model, pair, chartMode) {
    const sections = getSections(pair);
    const same = pair[0].pos === pair[1].pos;
    const metricCount = sections.reduce((sum, section) => sum + section.stats.length, 0);
    const selectedOptions = side => model.players.map(player => `<option value="${escape(player.id)}"${player.id === pair[side].id ? ' selected' : ''}>${escape(player.name)} · ${escape(player.pos)}</option>`).join('');
    return `<div class="ss-dashboard"><header class="ss-dashboard-header"><div class="ss-title-lockup"><span class="ss-app-mark">${icon('layers')}</span><div><span class="ss-eyebrow">START / SIT · PLAYER INTELLIGENCE</span><h1>Head to head<span class="ss-season-pill">${escape(model.season)}</span></h1></div></div><button class="ss-dashboard-close ss-icon-button" type="button" data-ss-close aria-label="Close player comparison">${icon('close')}</button></header>
      <div class="ss-dashboard-scroll"><div class="ss-comparison-pickers"><label class="ss-side-0"><span>A</span><select aria-label="First comparison player" data-ss-pick="0">${selectedOptions(0)}</select>${icon('down')}</label><button class="ss-swap ss-icon-button" type="button" data-ss-swap aria-label="Swap compared players">${icon('swap')}</button><label class="ss-side-1"><span>B</span><select aria-label="Second comparison player" data-ss-pick="1">${selectedOptions(1)}</select>${icon('down')}</label></div>
      <div class="ss-hero"><div class="ss-hero-orbit" aria-hidden="true"></div>${pair.map((player, side) => playerHero(player, side, model.week)).join('')}<span class="ss-hero-vs" aria-hidden="true">VS</span></div>
      <div class="ss-projection-insight">${icon('pulse')}<span>${number(pair[0].projection) !== null && number(pair[1].projection) !== null ? Math.abs(pair[0].projection - pair[1].projection) < .05 ? 'Level projections for this week' : `<b class="ss-side-${pair[0].projection > pair[1].projection ? 0 : 1}">${escape(shortName(pair[pair[0].projection > pair[1].projection ? 0 : 1]))}</b> projects <strong>${fmt(Math.abs(pair[0].projection - pair[1].projection))}</strong> points higher` : 'Compare season production while projections are unavailable'}</span><span class="ss-micro-label">WK ${model.week || '—'} OUTLOOK</span></div>
      <div class="ss-analytics-grid"><section class="ss-panel ss-timeline"><header class="ss-panel-header"><div>${icon('chart')}<h3>Scoring trajectory</h3></div><div class="ss-chart-toggle" role="group" aria-label="Scoring chart view"><button type="button" data-ss-chart="weekly" aria-pressed="${chartMode === 'weekly'}">Weekly</button><button type="button" data-ss-chart="cumulative" aria-pressed="${chartMode === 'cumulative'}">Cumulative</button></div></header><div class="ss-chart-legend">${pair.map((player, side) => `<span class="ss-side-${side}"><i></i>${escape(shortName(player))}</span>`).join('')}<span>LEAGUE PTS</span></div><div class="ss-timeline-chart" role="img" aria-label="${chartMode === 'weekly' ? 'Weekly' : 'Cumulative'} fantasy points for ${escape(pair.map(player => player.name).join(' and '))}"></div><div class="ss-chart-caption"><span>Recorded games only</span><span>BYE / DNP = gap</span></div>${weeklyTable(pair)}</section>
      <section class="ss-panel ss-reliability"><header class="ss-panel-header"><div>${icon('shield')}<h3>Consistency & ceiling</h3></div><span class="ss-micro-label">PPR BASELINE</span></header><div class="ss-consistency-rings">${pair.map(ring).join('')}</div><p class="ss-panel-note">CSTY% and CL · published season values</p></section>${production(pair)}</div>
      <div class="ss-detail-heading"><div><span class="ss-eyebrow">THE COMPLETE PICTURE</span><h2>Every stat. Both players.</h2></div><span class="ss-detail-badge">${metricCount}<small>METRICS</small></span></div><div class="ss-stat-contract"><span>${same ? `${escape(pair[0].pos)} · Game Logs season stats` : 'Mixed positions · Data Hub Overview'}</span><span>Bar length = magnitude · scale per metric</span></div>
      <nav class="ss-chapters" aria-label="Stat sections">${sections.map(section => `<button type="button" data-ss-section="${section.id}">${escape(section.label.toLowerCase())}</button>`).join('')}</nav><div class="ss-stat-grid">${statSections(pair)}</div>
      <footer class="ss-data-note">${icon('target')}<p>FPTS & PPG follow your league scoring. Other season metrics, ceiling and consistency follow the published stats. Positional ranks retain Game Logs qualification. <span>— Unavailable &nbsp; · &nbsp; 0 Recorded zero &nbsp; · &nbsp; Striped bar Negative value</span></p></footer></div></div>`;
  }

  function seriesFor(players, mode) {
    const weeks = [...new Set(players.flatMap(player => player.weekly.map(item => item.week)))].sort((a, b) => a - b);
    return { weeks, series: players.map(player => {
      let total = 0;
      return weeks.map(week => {
        const item = player.weekly.find(row => row.week === week);
        if (number(item?.points) === null) return null;
        total += item.points;
        return mode === 'cumulative' ? total : item.points;
      });
    }) };
  }
  function timelineOption(players, mode, echarts, narrow) {
    const data = seriesFor(players, mode);
    return {
      animation: false, backgroundColor: 'transparent', textStyle: { fontFamily: 'Google Sans, Arial, sans-serif' },
      grid: { top: 26, left: 39, right: 22, bottom: 34 },
      tooltip: { trigger: 'axis', confine: true, transitionDuration: 0, backgroundColor: '#171f32f5', borderColor: '#8db9df55', padding: [10, 12], textStyle: { color: '#ebf4ff', fontSize: 11 }, axisPointer: { type: 'line', lineStyle: { color: '#d2e5ff66', type: 'dashed' } },
        formatter: items => {
          const index = items[0]?.dataIndex;
          if (index == null) return '';
          const week = data.weeks[index];
          return `<div style="color:#9aaec7;font-size:10px;letter-spacing:1px;margin-bottom:7px">WEEK ${week} · ${mode === 'cumulative' ? 'CUMULATIVE' : 'FANTASY POINTS'}</div>${players.map((player, side) => {
            const item = player.weekly.find(row => row.week === week);
            return `<div style="display:flex;gap:20px;justify-content:space-between;margin:5px 0"><span style="color:${PALETTES[side].main}">${escape(player.name)}</span><b>${data.series[side][index] === null ? escape(item?.status || '—') : fmt(data.series[side][index])}</b></div>`;
          }).join('')}`;
        } },
      xAxis: { type: 'category', data: data.weeks.map(week => `W${week}`), boundaryGap: data.weeks.length === 1, axisTick: { show: false }, axisLine: { lineStyle: { color: '#ffffff13' } }, axisLabel: { color: '#8a9db7', fontSize: 10, interval: narrow && data.weeks.length > 10 ? 1 : 0, margin: 12 }, splitLine: { show: true, lineStyle: { color: '#b5d3ff06', type: 'dotted' } } },
      yAxis: { type: 'value', scale: false, splitNumber: 4, axisLabel: { color: '#8a9db7', fontSize: 10 }, splitLine: { lineStyle: { color: '#b5d3ff10', type: 'dashed' } } },
      series: players.map((player, side) => {
        const p = PALETTES[side];
        return { name: player.name, type: 'line', data: data.series[side], connectNulls: false, smooth: false, showSymbol: true, symbol: side === 0 ? 'circle' : 'diamond', symbolSize: 6, clip: true,
          lineStyle: { width: 2.5, color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: p.mid }, { offset: .4, color: p.main }, { offset: .72, color: p.light }, { offset: 1, color: p.main }]), shadowColor: `rgba(${p.rgb},0.3)`, shadowBlur: 7 },
          itemStyle: { color: '#151d2c', borderColor: p.light, borderWidth: 1.6 },
          // Small labels follow the active weekly/cumulative values. Separate
          // sides and overlap hiding keep dense seasons readable on phones.
          label: { show: true, position: side === 0 ? 'top' : 'bottom', distance: 7,
            color: p.light, fontSize: narrow ? 8 : 9, textBorderColor: '#192334', textBorderWidth: 3,
            formatter: item => number(item.value) === null ? '' : fmt(item.value) },
          labelLayout: { hideOverlap: true },
          areaStyle: { origin: 'auto', opacity: 1, color: new echarts.graphic.LinearGradient(0, 0, .2, 1, [{ offset: 0, color: `rgba(${p.rgb},.26)` }, { offset: .28, color: `rgba(${p.rgb},.15)` }, { offset: .63, color: `rgba(${p.rgb},.055)` }, { offset: 1, color: `rgba(${p.rgb},0)` }]) },
          emphasis: { disabled: true }, animation: false, z: 3 - side };
      }),
    };
  }

  // Each redraw disposes the old ECharts instance and observer. A token prevents
  // a delayed library load from mounting into a closed or superseded modal.
  function disposeComparison() {
    sequence += 1;
    if (mounted) {
      mounted.observer?.disconnect(); mounted.chart?.dispose();
      mounted.mount.removeAttribute('aria-busy');
      if (mounted.keyHandler) mounted.mount.removeEventListener('keydown', mounted.keyHandler);
      mounted = null;
    }
  }
  function renderComparison(model) {
    disposeComparison();
    let ids = model.players.slice(0, 2).map(player => player.id);
    let chartMode = 'weekly';
    const paint = (restoreFocus = null) => {
      disposeComparison();
      const token = sequence;
      const pair = ids.map(id => model.players.find(player => player.id === id));
      if (pair.some(player => !player)) return;
      model.mount.innerHTML = comparisonMarkup(model, pair, chartMode);
      bindPlayerNames(model.mount, pair, model.onGameLogs);
      model.mount.querySelector('[data-ss-close]').addEventListener('click', model.onClose);
      model.mount.querySelector('[data-ss-swap]').addEventListener('click', () => { ids.reverse(); paint('[data-ss-swap]'); });
      model.mount.querySelectorAll('[data-ss-pick]').forEach(select => select.addEventListener('change', () => {
        const side = Number(select.dataset.ssPick), previous = ids[side];
        ids[side] = select.value;
        if (ids[1 - side] === ids[side]) ids[1 - side] = previous;
        paint(`[data-ss-pick="${side}"]`);
      }));
      model.mount.querySelectorAll('[data-ss-chart]').forEach(button => button.addEventListener('click', () => {
        chartMode = button.dataset.ssChart;
        model.mount.querySelectorAll('[data-ss-chart]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        if (mounted?.chart) mounted.chart.setOption(timelineOption(pair, chartMode, window.echarts, model.mount.querySelector('.ss-timeline-chart').clientWidth < 500), true);
        model.mount.querySelector('.ss-timeline-chart').setAttribute('aria-label', `${chartMode} fantasy points for ${pair.map(player => player.name).join(' and ')}`);
      }));
      model.mount.querySelectorAll('[data-ss-section]').forEach(button => button.addEventListener('click', () => {
        model.mount.querySelector(`#ss-section-${button.dataset.ssSection}`)?.scrollIntoView({ behavior: 'instant', block: 'start' });
        model.mount.querySelectorAll('[data-ss-section]').forEach(other => other.classList.toggle('is-active', other === button));
      }));
      // Metric definitions open inline on touch/keyboard, keeping abbreviated
      // labels understandable without depending on desktop hover tooltips.
      model.mount.querySelectorAll('[data-ss-help]').forEach(button => button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        model.mount.querySelector(`#ss-help-${button.dataset.ssHelp}`).hidden = !open;
      }));
      if (restoreFocus) model.mount.querySelector(restoreFocus)?.focus({ preventScroll: true });
      // Keep keyboard focus inside the dialog while preserving native select
      // and details behavior. Escape is handled by Rosters' existing listener.
      const keyHandler = event => {
        if (event.key !== 'Tab') return;
        const controls = [...model.mount.querySelectorAll('button:not(:disabled),select,summary,[tabindex="0"]')].filter(node => node.offsetParent !== null);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      };
      model.mount.addEventListener('keydown', keyHandler);
      mounted = { chart: null, observer: null, keyHandler, mount: model.mount };
      const chartNode = model.mount.querySelector('.ss-timeline-chart');
      if (!pair.some(player => player.weekly.some(item => number(item.points) !== null))) {
        chartNode.innerHTML = `<div class="ss-chart-empty">${icon('chart')}<b>No recorded scoring yet</b><span>Season stats remain available below.</span></div>`;
        return;
      }
      loadCharts().then(echarts => {
        if (sequence !== token || !chartNode.isConnected) return;
        const chart = echarts.init(chartNode, null, { renderer: 'canvas', devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2) });
        mounted.chart = chart;
        chart.setOption(timelineOption(pair, chartMode, echarts, chartNode.clientWidth < 500));
        mounted.observer = new ResizeObserver(() => { if (!chart.isDisposed()) { chart.resize(); chart.setOption(timelineOption(pair, chartMode, echarts, chartNode.clientWidth < 500), true); } });
        mounted.observer.observe(chartNode);
      }).catch(() => {
        if (sequence !== token || !chartNode.isConnected) return;
        chartNode.innerHTML = '<div class="ss-chart-empty"><b>Chart unavailable</b><span>Explore the recorded weekly values below.</span></div>';
        model.mount.querySelector('.ss-weekly-table').open = true;
      });
    };
    paint();
  }
  window.RostersStartSit = Object.freeze({ renderPreview, renderLoading, renderComparison, disposeComparison, disposePreview, seriesFor, overviewSections: OVERVIEW });
})();
