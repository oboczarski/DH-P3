/* Rosters' Start/Sit presentation. Data arrives as immutable snapshots from
 * app.js; this file owns only the new preview, comparison and chart lifecycle.
 * The roster cards, Game Logs, DataHub and Matchups keep their own renderers. */
(() => {
  'use strict';
  if (document.body.dataset.page !== 'rosters') return;

  // Start/Sit's SVG progress rings and canvas scoring charts use explicit
  // colors. Keep player two aligned with the blue .ss-side-1 CSS theme,
  // including a desaturated blue for its faded unplayed-week designations.
  const PALETTES = [
    { main: '#76e8ef', light: '#d0fcff', mid: '#389ed7', deep: '#235777', muted: '#a2b7bb', rgb: '102,224,239' },
    { main: '#9bc5ff', light: '#dfe3ff', mid: '#5493fa', deep: '#517fb2', muted: '#a5b1c1', rgb: '84,147,250' },
  ];
  // Comparison themes own their player colors; the selection tray keeps its
  // existing palette. Remember the selected theme only for this page session.
  const THEMES = {
    v2: [
      { main: '#45ebce', light: '#a2fbe6', mid: '#18a9d9', deep: '#155e91', muted: '#789f9b', rgb: '69,235,206' },
      { main: '#d9a0ff', light: '#ffc0e6', mid: '#9970fa', deep: '#54348e', muted: '#a18caa', rgb: '210,144,255' },
    ],
    dm: [
      // The supplied stat-graphic reference owns DM's player spectra: A uses
      // turquoise/blue; B uses gold/coral/pink/magenta. Game Logs HUD dials
      // retain their separate progress-based tones, as originally requested.
      { main: '#18ebdc', light: '#b7fff5', mid: '#00c6ef', deep: '#1264ff', muted: '#779ea8', rgb: '24,235,220',
        stops: ['#1264FF', '#118FFF', '#00C6EF', '#19EDDD'] },
      { main: '#ffbd55', light: '#ffe5b5', mid: '#f43eae', deep: '#cd28f4', muted: '#a59180', rgb: '255,189,85',
        stops: ['#FFBF47', '#FF866C', '#F43EAE', '#CD28F4'] },
    ],
  };
  let comparisonTheme = 'v2';
  // Match the current Game Logs Performance axes and positional rank ceilings.
  // These are data definitions only; Start/Sit draws its own SVG presentation.
  const RADAR_CONFIG = {
    QB: { stats: ['fpts', 'ppg', 'cmp_pct', 'pass_rtg', 'imp', 'epa_per_db', 'cpoe', 'ttt', 'pass_yd', 'rush_yd', 'team_pass_pct', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'CMP%', 'paRTG', 'IMP', 'EPA/DB', 'CPOE', 'TTT', 'paYDS', 'ruYDS', 'TmPa%', 'CSTY%', 'CL'], maxRank: 36 },
    RB: { stats: ['fpts', 'ppg', 'snp_pct', 'ypc', 'imp', 'expl_ru_pct', 'mtf_per_att', 'yco_per_att', 'ts_per_rr', 'yprr', 'yds_total', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'SNP%', 'YPC', 'IMP', 'EXPLSV%', 'MTF/A', 'YCO/A', 'TS%', 'YPRR', 'YDS(t)', 'CSTY%', 'CL'], maxRank: 48 },
    WR: { stats: ['fpts', 'ppg', 'yds_total', 'imp', 'rec_tgt', 'ts_per_rr', 'rec', 'yprr', 'rec_yar', 'rec_yms', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'YDS(t)', 'IMP', 'TGT', 'TS%', 'REC', 'YPRR', 'YAC', 'recYS%', 'CSTY%', 'CL'], maxRank: 72 },
    TE: { stats: ['fpts', 'ppg', 'yds_total', 'imp', 'rec_tgt', 'ts_per_rr', 'rec', 'yprr', 'rec_yar', 'rec_yms', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'YDS(t)', 'IMP', 'TGT', 'TS%', 'REC', 'YPRR', 'YAC', 'recYS%', 'CSTY%', 'CL'], maxRank: 24 },
  };
  const radarStatsForPosition = position => RADAR_CONFIG[position]?.stats || [];
  const TIMELINE_GUTTERS = { left: 30, right: 18 };
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
  // Start/Sit's panel headings and legends retain the surname with its suffix;
  // the final word alone would turn Brian Robinson Jr. into just "Jr.".
  const shortName = player => {
    const parts = (player.name || player.label || '').trim().split(/\s+/);
    return parts.slice(/^(?:jr\.?|sr\.?|ii|iii|iv|v)$/i.test(parts.at(-1)) ? -2 : -1).join(' ');
  };
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
  function sparkline(weekly, uid, side = 0, width = 180) {
    const data = weekly.filter(item => number(item.points) !== null).slice(-5);
    const values = data.map(item => number(item.points));
    if (!values.length) return '<div class="ss-spark-empty">No recorded games</div>';
    const min = Math.min(0, ...values), max = Math.max(1, ...values), span = max - min || 1;
    // Draw in the preview's measured CSS pixels at the existing 48px height.
    // Widening the plot moves its points rather than stretching text/circles.
    const x = index => data.length === 1 ? width / 2 : 13 + index * (width - 26) / (data.length - 1);
    const y = value => 34 - (value - min) / span * 20;
    const baseline = y(0);
    const points = data.map((item, index) => [x(index), y(item.points)]);
    const id = `ss-spark-${uid}`;
    const palette = PALETTES[side % 2];
    const areas = `<path d="M${points[0][0]},${baseline} ${points.map(point => `L${point}`).join(' ')} L${points.at(-1)[0]},${baseline}Z" fill="url(#${id})"/><path d="M${points.map(point => point.join(',')).join(' L')}" fill="none" stroke="${palette.main}" stroke-width="1.25" stroke-linejoin="round"/>`;
    const dots = points.map((point, index) => `<circle cx="${point[0]}" cy="${point[1]}" r="1.6" fill="${palette.light}" stroke="${palette.mid}" stroke-width=".95"/><text class="ss-spark-value" x="${point[0]}" y="${point[1] - 4.5}" text-anchor="middle" fill="${palette.light}">${fmt(data[index].points)}</text><text class="ss-spark-week" x="${point[0]}" y="44" text-anchor="middle">W${data[index].week}</text>`).join('');
    const description = data.map(item => `Week ${item.week}: ${fmt(item.points)} points`).join('; ');
    return `<svg class="ss-spark" viewBox="0 0 ${width} 48" role="img" aria-label="Last ${data.length} games this season: ${escape(description)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0.15" y2="1"><stop stop-color="${palette.main}" stop-opacity=".32"/><stop offset=".5" stop-color="${palette.mid}" stop-opacity=".16"/><stop offset="1" stop-color="${palette.deep}" stop-opacity="0"/></linearGradient></defs><path d="M0 ${baseline}H${width}" stroke="#ffffff14" stroke-dasharray="2 4"/>${areas}${dots}</svg>`;
  }

  // The schedule owns venue text. Both preview rank locations use the same
  // Calculated positional defense-strength rank/color from the prepared display
  // snapshot (1 = best defense), shared with the Game Logs matchup ranks.
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
        <div class="ss-preview-matchup">${previewMatchup(player)}</div>
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
    const resizePreview = () => {
      mount.querySelectorAll('.ss-mini-timeline').forEach((timeline, index) => {
        const svg = timeline.querySelector('.ss-spark');
        const width = svg?.getBoundingClientRect().width;
        if (width && svg.viewBox.baseVal.width !== width) {
          svg.outerHTML = sparkline(players[index].weekly, `preview-${players[index].id}`, index, width);
        }
      });
      model.onResize?.(mount.offsetHeight);
    };
    resizePreview();
    previewObserver = new ResizeObserver(resizePreview);
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
  // Only DM's consistency percentage uses the Game Logs HUD dial. Ceiling
  // keeps the same plain label/value/PPR row in both comparison themes.
  function hudDial(player) {
    const value = number(player.metrics.csty_pct?.value);
    const progress = value === null ? null : Math.max(0, Math.min(1, value / 100));
    const tones = ['pink', 'magenta', 'violet', 'blue', 'cyan', 'teal', 'green'];
    const tone = progress === null ? 'neutral' : tones[Math.min(6, Math.floor(progress * 7))];
    const display = value === null ? '—' : `${fmt(value, Number.isInteger(value) ? 0 : 1)}%`;
    return `<div class="ss-hud-dial" data-dial-tone="${tone}" data-has-progress="${progress !== null && progress > 0}" style="--progress:${progress || 0}" role="img" aria-label="${escape(player.name)} consistency: ${display}" title="Arc = consistency percentage"><i class="ss-dial-glow"></i><i class="ss-dial-arc"></i><i class="ss-dial-echo"></i><i class="ss-dial-origin"></i><i class="ss-dial-cap"></i><div class="ss-dial-core"><b>${escape(display)}</b><span>CONSISTENCY</span></div></div>`;
  }
  function ring(player, side) {
    const value = number(player.metrics.csty_pct?.value);
    const id = `ss-ring-${player.id}-${side}`;
    const p = THEMES.v2[side];
    return `<div class="ss-consistency-player ss-side-${side}"><strong><i></i>${escape(shortName(player))}</strong><div class="ss-dm-gauges">${hudDial(player)}</div><div class="ss-v2-gauges"><svg class="ss-consistency-ring" viewBox="0 0 120 106" role="img" aria-label="${escape(player.name)} consistency ${value === null ? 'unavailable' : `${fmt(value)} percent`}"><defs><linearGradient id="${id}" x1="0" x2="1" y1="1" y2="0"><stop stop-color="${p.deep}"/><stop offset=".35" stop-color="${p.mid}"/><stop offset=".72" stop-color="${p.main}"/><stop offset="1" stop-color="${p.light}"/></linearGradient></defs><path d="M20 85a48 48 0 1 1 80 0" fill="none" stroke="#ffffff0c" stroke-width="6" stroke-linecap="round"/><path d="M20 85a48 48 0 1 1 80 0" fill="none" stroke="url(#${id})" stroke-width="6" stroke-linecap="round" pathLength="100" stroke-dasharray="${value === null ? 0 : Math.min(100, Math.max(0, value))} 100"/><path d="M30 80a36 36 0 1 1 60 0" fill="none" stroke="${p.main}33" stroke-width="1" stroke-dasharray="1 6"/><text x="60" y="58" text-anchor="middle" class="ss-ring-value">${value === null ? '—' : fmt(value, Number.isInteger(value) ? 0 : 1)}<tspan class="ss-ring-unit">${value === null ? '' : '%'}</tspan></text><text x="60" y="73" text-anchor="middle" class="ss-ring-label">CONSISTENCY</text></svg></div><div class="ss-ceiling"><span>CEILING</span><b>${escape(player.metrics.ceiling?.display || '—')}</b><small>PPR pts</small></div></div>`;
  }
  function getSections(players) {
    return players[0].pos === players[1].pos && players[0].sections.length ? players[0].sections : OVERVIEW;
  }
  function metricRow(key, players) {
    const metrics = players.map(player => player.metrics[key] || { display: '—', value: null, rank: null });
    const values = metrics.map(metric => number(metric.value));
    const label = players[0].labels[key] || LABELS[key] || key;
    const description = DESCRIPTIONS[key] || label;
    // Identity cells remain text. A numerical stat with two missing source
    // values still owns two empty rails, so unavailable never resembles zero.
    const isNumeric = !['player_name', 'position', 'team'].includes(key);
    const max = Math.max(...values.filter(value => value !== null).map(Math.abs), .00001);
    const comparable = values.every(value => value !== null) && !CONTEXT.has(key);
    const equal = comparable && Math.abs(values[0] - values[1]) < 1e-8;
    const winner = comparable && !equal ? (LOWER.has(key) ? values[0] < values[1] : values[0] > values[1]) ? 0 : 1 : null;
    // Values and bars share the same better/worse state, including metrics
    // where lower wins. Equal, unavailable and contextual stats stay neutral.
    const sideState = side => winner === null ? '' : winner === side ? ' ss-leading' : ' ss-trailing';
    const precision = Math.min(3, Math.max(...metrics.map(metric => (String(metric.display).match(/\.(\d+)/)?.[1] || '').length)));
    const diff = comparable && !equal ? `${fmt(Math.abs(values[0] - values[1]), precision)}${String(metrics[0].display).includes('%') ? ' pp' : ''}` : equal ? 'EVEN' : '';
    const valueMarkup = side => {
      const rank = number(metrics[side].rank);
      const hasRank = values[side] !== null && rank !== null && rank > 0;
      const rankText = hasRank ? `Rk ${rank}` : 'Rk —';
      // Contextual rates keep supplied positional ranks even though they do
      // not select a better/worse winner. Identity metadata never invents one.
      const showRank = isNumeric && key !== 'overall_rank' && (hasRank || !CONTEXT.has(key));
      return `<div class="ss-metric-value ss-side-${side}${sideState(side)}"><b>${escape(metrics[side].display)}</b>${showRank ? `<small title="${escape(players[side].pos)} season positional rank${hasRank ? '' : ' unavailable / unqualified'}">${rankText}</small>` : ''}</div>`;
    };
    // Reference-style butterfly bars extend out from the central stat pill.
    // Each value/rank stack follows its fill's outer end. Both sides reserve
    // the SAME measured text clearance to keep their magnitude scale honest.
    const plotMarkup = side => {
      const value = values[side], ratio = value === null ? 0 : Math.abs(value) / max;
      return `<div class="ss-stat-plot ss-side-${side}${sideState(side)}" style="--ss-bar-ratio:${ratio}" data-ss-available="${value !== null}">${isNumeric ? `<div class="ss-stat-rail" aria-hidden="true">${value !== null && value !== 0 ? `<i class="ss-stat-fill${value < 0 ? ' ss-negative' : ''}"></i>` : value === 0 ? '<i class="ss-stat-zero"></i>' : ''}</div>` : ''}${valueMarkup(side)}</div>`;
    };
    return `<div class="ss-metric-row${!isNumeric ? ' ss-text-row' : ''}" data-ss-stat="${key}">${plotMarkup(0)}<div class="ss-metric-label"><button class="ss-metric-help" type="button" data-ss-help="${key}" aria-expanded="false" aria-controls="ss-help-${key}" aria-label="Explain ${escape(label)}" title="${escape(description)}"><span>${escape(label)}</span>${diff ? `<small class="${winner === null ? '' : `ss-side-${winner}`}">${winner === null ? diff : `${winner === 0 ? '←' : '→'} ${diff}`}</small>` : ''}</button></div>${plotMarkup(1)}<p class="ss-metric-explanation" id="ss-help-${key}" hidden>${escape(description)}</p></div>`;
  }
  function measureStatPlots(mount) {
    // Text uses real responsive font metrics, including percentages, large
    // totals and negative signs. A shared row reserve prevents either label
    // from colliding with an edge or shortening only one player's bar scale.
    const measurements = [...mount.querySelectorAll('.ss-metric-row:not(.ss-text-row)')].map(row => {
      const widths = [...row.querySelectorAll('.ss-metric-value')].map(node => node.getBoundingClientRect().width);
      const clearance = `${Math.ceil(Math.max(0, ...widths)) + 8}px`;
      return { row, clearance };
    });
    // Read every label before updating CSS, avoiding repeated synchronous
    // layouts across a long stat list when a phone rotates or fonts finish.
    measurements.forEach(({ row, clearance }) => {
      if (row.style.getPropertyValue('--ss-value-space') !== clearance) row.style.setProperty('--ss-value-space', clearance);
    });
  }
  function statSections(players) {
    return getSections(players).map((section, index) => `<section class="ss-stat-section ss-panel" id="ss-section-${section.id}" aria-label="${escape(section.label)}"><header class="ss-section-heading"><span class="ss-section-icon">${icon(section.id.includes('efficiency') ? 'spark' : section.id.includes('production') ? 'chart' : section.id === 'info' ? 'target' : 'layers')}</span><div><span class="ss-eyebrow">${String(index + 1).padStart(2, '0')} / SEASON DETAIL</span><h3>${escape(section.label.toLowerCase())}</h3></div><span class="ss-stat-count">${section.stats.length}<small>STATS</small></span></header><div class="ss-section-players"><span class="ss-side-0"><small>A</small>${escape(shortName(players[0]))}</span><i aria-hidden="true">STAT</i><span class="ss-side-1"><small>B</small>${escape(shortName(players[1]))}</span></div><div class="ss-metrics">${section.stats.map(key => metricRow(key, players)).join('')}</div></section>`).join('');
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
  // Preserve the Game Logs rank-to-radius mapping, including its tighter top
  // seven band. Missing ranks are gaps, never zero scores or last-place ranks.
  function radarRadius(rank, maximum) {
    const value = number(rank);
    if (value === null || value < 1) return null;
    if (value <= 1) return 85;
    if (value >= maximum) return 10;
    return value <= 7 ? 85 - (value - 1) * 2 : 73 - (value - 7) / (maximum - 7) * 63;
  }
  // Four-stop DM spectra are shared by its scoring and radar renderers; V2
  // retains its existing three-stop lines and its original translucent areas.
  function comparisonGradientStops(palette, theme) {
    return theme === 'dm' ? palette.stops.map((color, index) => ({ offset: index / 3, color }))
      : [{ offset: 0, color: palette.mid }, { offset: .45, color: palette.main }, { offset: 1, color: palette.light }];
  }
  function gradientRgba(color, opacity) {
    const value = Number.parseInt(color.slice(1), 16);
    return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
  }
  function radarGraphic(players, sides, config, theme, uid) {
    const center = 180, radius = 125, count = config.stats.length;
    const at = (index, distance) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      return [center + Math.cos(angle) * distance, 168 + Math.sin(angle) * distance];
    };
    const pointString = points => points.map(point => point.map(value => value.toFixed(2)).join(',')).join(' ');
    const grid = [20, 40, 60, 80, 100].map((level, index) => `<polygon points="${pointString(config.stats.map((_, i) => at(i, radius * level / 100)))}" class="ss-radar-grid-ring"${index === 4 ? ' data-outer="true"' : ''}/>`).join('');
    const axes = config.stats.map((key, index) => {
      const edge = at(index, radius), label = at(index, radius + 23);
      // The label's anchor follows the spoke, leaving useful room for long
      // abbreviations at either edge without shrinking the whole mobile plot.
      const cosine = Math.cos(-Math.PI / 2 + index * Math.PI * 2 / count);
      return `<line x1="180" y1="168" x2="${edge[0]}" y2="${edge[1]}" class="ss-radar-spoke"/><text x="${label[0]}" y="${label[1]}" text-anchor="${cosine > .3 ? 'start' : cosine < -.3 ? 'end' : 'middle'}" dominant-baseline="middle" class="ss-radar-axis">${escape(config.labels[index])}</text>`;
    }).join('');
    let definitions = '';
    const datasets = players.map((player, playerIndex) => {
      const side = sides[playerIndex], palette = THEMES[theme][side];
      const id = `ss-radar-${uid}-${side}`;
      const lineStops = theme === 'dm' ? comparisonGradientStops(palette, theme).map(stop => `<stop offset="${stop.offset}" stop-color="${stop.color}"/>`).join('')
        : `<stop stop-color="${palette.mid}"/><stop offset=".48" stop-color="${palette.main}"/><stop offset="1" stop-color="${palette.light}"/>`;
      const areaStops = theme === 'dm' ? palette.stops.map((color, index) => `<stop offset="${index / 3}" stop-color="${color}" stop-opacity="${[.02, .08, .16, .3][index]}"/>`).join('')
        : `<stop stop-color="${palette.deep}" stop-opacity=".02"/><stop offset=".5" stop-color="${palette.mid}" stop-opacity=".15"/><stop offset="1" stop-color="${palette.main}" stop-opacity=".32"/>`;
      definitions += `<linearGradient id="${id}-line" x1="0" y1="1" x2="1" y2="0">${lineStops}</linearGradient><linearGradient id="${id}-area" x1="0" y1="1" x2=".8" y2="0">${areaStops}</linearGradient>`;
      const points = config.stats.map((key, index) => {
        const metric = player.metrics[key], distance = radarRadius(metric?.rank, config.maxRank);
        return number(metric?.value) === null || distance === null ? null : at(index, radius * distance / 100);
      });
      const complete = points.every(Boolean);
      const area = complete ? `<polygon class="ss-radar-area" points="${pointString(points)}" fill="url(#${id}-area)"/>` : '';
      // A partial radar draws only adjacent ranked axes; its value ledger still
      // exposes available source numbers and explains unqualified/missing ranks.
      const line = complete ? `<polygon points="${pointString(points)}" fill="none" stroke="url(#${id}-line)"/>`
        : points.map((point, index) => point && points[(index + 1) % count] ? `<path d="M${point}L${points[(index + 1) % count]}" fill="none" stroke="url(#${id}-line)"/>` : '').join('');
      const markers = points.map((point, index) => {
        if (!point) return '';
        const rank = number(player.metrics[config.stats[index]].rank);
        const radial = radarRadius(rank, config.maxRank) / 100 * radius;
        const label = at(index, Math.max(7, radial + (side === 0 ? 11 : -11)));
        const value = player.metrics[config.stats[index]].display;
        return `<g><title>${escape(player.name)} · ${escape(config.labels[index])}: ${escape(value)} · ${escape(player.pos)} rank ${rank}</title>${side === 0 ? `<circle cx="${point[0]}" cy="${point[1]}" r="2.8"/>` : `<path d="M${point[0]},${point[1] - 3.5}l3.5 3.5-3.5 3.5-3.5-3.5Z"/>`}<text x="${label[0]}" y="${label[1]}" class="ss-radar-rank" text-anchor="middle" dominant-baseline="middle">${rank}</text></g>`;
      }).join('');
      return `<g class="ss-radar-dataset ss-side-${side}"><g class="ss-radar-shape">${area}${line}</g><g class="ss-radar-markers">${markers}</g></g>`;
    }).join('');
    const hasRanks = players.some(player => config.stats.some(key => number(player.metrics[key]?.value) !== null && radarRadius(player.metrics[key]?.rank, config.maxRank) !== null));
    const summary = `${players.map(player => player.name).join(' and ')} ${players[0].pos} performance radar. Better positional ranks extend farther from the center. Exact values and ranks follow in the table.`;
    return `<svg class="ss-radar-svg" viewBox="0 0 360 336" role="img" aria-label="${escape(summary)}"><defs>${definitions}</defs><g>${grid}${axes}</g><circle cx="180" cy="168" r="3" class="ss-radar-center"/>${datasets}${hasRanks ? '' : '<text x="180" y="166" text-anchor="middle" class="ss-radar-no-ranks">No qualified ranks</text>'}</svg>`;
  }
  function radarCard(players, sides, config, theme, uid) {
    return `<article class="ss-radar-card"><div class="ss-radar-card-heading"><span>${escape(players[0].pos)} <small>POSITIONAL PROFILE</small></span><b>01 <i>BEST RANK</i></b></div><div class="ss-radar-card-content"><div class="ss-radar-plot">${radarGraphic(players, sides, config, theme, uid)}</div><div class="ss-radar-ledger"><table><caption>Season values & positional ranks</caption><thead><tr><th scope="col">METRIC</th>${players.map((player, index) => `<th scope="col" class="ss-side-${sides[index]}"><span>${sides[index] === 0 ? '●' : '◆'}</span> ${escape(shortName(player))}</th>`).join('')}</tr></thead><tbody>${config.stats.map((key, index) => `<tr><th scope="row" title="${escape(DESCRIPTIONS[key] || config.labels[index])}">${escape(config.labels[index])}</th>${players.map((player, i) => {
      const metric = player.metrics[key] || {}, rank = number(metric.rank);
      return `<td class="ss-side-${sides[i]}"><b>${escape(metric.display || '—')}</b><small title="${rank === null ? 'No qualified positional rank' : 'Season positional rank'}">${escape(player.pos)}·${rank ?? '—'}</small></td>`;
    }).join('')}</tr>`).join('')}</tbody></table></div></div></article>`;
  }
  function performanceRadar(players, theme = 'v2') {
    const same = players[0].pos === players[1].pos;
    const groups = same ? [players] : players.map(player => [player]);
    const cards = groups.map((group, index) => {
      const config = RADAR_CONFIG[group[0].pos];
      return config ? radarCard(group, same ? [0, 1] : [index], config, theme, index) : '<p class="ss-panel-note">Performance radar unavailable for this position.</p>';
    }).join('');
    return `<div class="ss-radar-grid${same ? '' : ' ss-radar-mixed'}">${cards}</div>`;
  }
  function comparisonMarkup(model, pair, chartMode) {
    const sections = getSections(pair);
    const same = pair[0].pos === pair[1].pos;
    const metricCount = sections.reduce((sum, section) => sum + section.stats.length, 0);
    const selectedOptions = side => model.players.map(player => `<option value="${escape(player.id)}"${player.id === pair[side].id ? ' selected' : ''}>${escape(player.name)} · ${escape(player.pos)}</option>`).join('');
    return `<div class="ss-dashboard" data-ss-theme="${comparisonTheme}"><header class="ss-dashboard-header"><div class="ss-title-lockup"><span class="ss-app-mark">${icon('layers')}</span><div><span class="ss-eyebrow">START / SIT · COMPARISON</span><h1>Head to head<span class="ss-season-pill">${escape(model.season)}</span></h1></div></div><div class="ss-dashboard-actions"><div class="ss-theme-toggle" role="group" aria-label="Comparison theme"><button type="button" data-ss-theme-button="v2" aria-label="V2 theme" aria-pressed="${comparisonTheme === 'v2'}" title="V2 · aqua and orchid gradients">${icon('spark')}<span>V2</span></button><button type="button" data-ss-theme-button="dm" aria-label="DM theme" aria-pressed="${comparisonTheme === 'dm'}" title="DM · DataHub Game Logs inspired">${icon('layers')}<span>DM</span></button></div><button class="ss-dashboard-close ss-icon-button" type="button" data-ss-close aria-label="Close player comparison">${icon('close')}</button></div></header>
      <div class="ss-dashboard-scroll"><div class="ss-comparison-pickers"><label class="ss-side-0"><span>A</span><select aria-label="First comparison player" data-ss-pick="0">${selectedOptions(0)}</select>${icon('down')}</label><button class="ss-swap ss-icon-button" type="button" data-ss-swap aria-label="Swap compared players">${icon('swap')}</button><label class="ss-side-1"><span>B</span><select aria-label="Second comparison player" data-ss-pick="1">${selectedOptions(1)}</select>${icon('down')}</label></div>
      <div class="ss-hero"><div class="ss-hero-orbit" aria-hidden="true"></div>${pair.map((player, side) => playerHero(player, side, model.week)).join('')}<span class="ss-hero-vs" aria-hidden="true">VS</span></div>
      <div class="ss-projection-insight">${icon('pulse')}<span>${number(pair[0].projection) !== null && number(pair[1].projection) !== null ? Math.abs(pair[0].projection - pair[1].projection) < .05 ? 'Level projections for this week' : `<b class="ss-side-${pair[0].projection > pair[1].projection ? 0 : 1}">${escape(shortName(pair[pair[0].projection > pair[1].projection ? 0 : 1]))}</b> projects <strong>${fmt(Math.abs(pair[0].projection - pair[1].projection))}</strong> points higher` : 'Compare season production while projections are unavailable'}</span><span class="ss-micro-label">WK ${model.week || '—'} OUTLOOK</span></div>
      <div class="ss-analytics-grid"><section class="ss-panel ss-timeline"><header class="ss-panel-header"><div>${icon('chart')}<h3>Scoring Comparison</h3></div><div class="ss-chart-toggle" role="group" aria-label="Scoring chart view"><button type="button" data-ss-chart="weekly" aria-pressed="${chartMode === 'weekly'}">Weekly</button><button type="button" data-ss-chart="cumulative" aria-pressed="${chartMode === 'cumulative'}">Cumulative</button></div></header><div class="ss-chart-legend">${pair.map((player, side) => `<span class="ss-side-${side}"><i></i>${escape(shortName(player))}</span>`).join('')}<span>LEAGUE PTS</span></div><div class="ss-timeline-viewport" tabindex="0" role="region" aria-label="Scoring Comparison; scroll horizontally for more weeks"><div class="ss-timeline-chart" role="img" aria-label="${chartMode === 'weekly' ? 'Weekly' : 'Cumulative'} fantasy points for ${escape(pair.map(player => player.name).join(' and '))}"></div></div><div class="ss-chart-caption"><span>Recorded games only</span><span>Unplayed weeks show status</span></div>${weeklyTable(pair)}</section>
      <section class="ss-panel ss-reliability"><header class="ss-panel-header"><div>${icon('shield')}<h3>Consistency & ceiling</h3></div><span class="ss-micro-label">PPR BASELINE</span></header><div class="ss-consistency-rings">${pair.map(ring).join('')}</div><p class="ss-panel-note">CSTY% and CL · published season values</p></section>${production(pair)}</div>
      <div class="ss-detail-heading"><div><span class="ss-eyebrow">THE COMPLETE PICTURE</span><h2>Every stat. Both players.</h2></div><span class="ss-detail-badge">${metricCount}<small>METRICS</small></span></div><div class="ss-stat-contract"><span>${same ? `${escape(pair[0].pos)} · Game Logs season stats` : 'Mixed positions · Data Hub Overview'}</span><span>Bar length = magnitude · scale per metric</span></div>
      <nav class="ss-chapters" aria-label="Stat sections">${sections.map(section => `<button type="button" data-ss-section="${section.id}">${escape(section.label.toLowerCase())}</button>`).join('')}<button type="button" data-ss-section="radar">${icon('target')} Radar</button></nav><div class="ss-stat-grid">${statSections(pair)}</div>
      <section class="ss-panel ss-performance" id="ss-section-radar" aria-label="Performance radar"><header class="ss-panel-header"><div>${icon('target')}<h3>Performance radar</h3></div><span class="ss-micro-label">${same ? `${escape(pair[0].pos)} · HEAD TO HEAD` : 'POSITION PROFILES'}</span></header><div class="ss-radar-legend">${pair.map((player, side) => `<span class="ss-side-${side}"><i>${side === 0 ? '●' : '◆'}</i>${escape(shortName(player))}</span>`).join('')}<small>OUTWARD = STRONGER RANK</small></div><div class="ss-radar-region">${performanceRadar(pair, comparisonTheme)}</div><p class="ss-radar-note">${same ? 'Shared axes · ' : 'Each position uses its own metrics and rank scale · '}Top 7 ranks retain the Game Logs scale. Missing ranks leave gaps; the table keeps available values.</p></section>
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

  // Scoring comparison only: bridge missed weeks like the Consistency chart,
  // interpolating between recorded games and extending the nearest endpoint.
  // These are drawing coordinates only: totals, tooltips and the weekly table
  // continue to use seriesFor's nulls, and missed weeks never get scoring dots.
  function trajectoryPlot(players, mode) {
    const data = seriesFor(players, mode);
    const recorded = data.series.flat().filter(value => value !== null);
    const center = (Math.min(0, ...recorded) + Math.max(0, ...recorded)) / 2;
    const labels = players.map((player, side) => data.weeks.map((week, index) => {
      if (data.series[side][index] !== null) return fmt(data.series[side][index]);
      return String(player.weekly.find(row => row.week === week)?.status || '—').trim().toUpperCase();
    }));
    const plotted = data.series.map(values => values.map((value, index) => {
      if (value !== null) return value;
      let before = index - 1, after = index + 1;
      while (before >= 0 && values[before] === null) before -= 1;
      while (after < values.length && values[after] === null) after += 1;
      if (before >= 0 && after < values.length) {
        const fraction = (data.weeks[index] - data.weeks[before]) / (data.weeks[after] - data.weeks[before]);
        return values[before] + (values[after] - values[before]) * fraction;
      }
      return values[before] ?? values[after] ?? center;
    }));
    return { ...data, labels, plotted, hasScores: recorded.length > 0 };
  }

  // Reserve one readable label slot per week. Long seasons can scroll within
  // this comparison card instead of suppressing values or shrinking the text.
  function sizeTrajectory(chartNode, players, mode) {
    const data = trajectoryPlot(players, mode);
    const labelWidth = Math.max(34, ...data.labels.flat().map(label => label.length * 5 + 14));
    // Match the actual chart gutters so shorter histories fit on mobile while
    // full seasons still reserve readable slots and scroll within the card.
    chartNode.style.minWidth = `${Math.max(0, data.weeks.length - 1) * labelWidth + TIMELINE_GUTTERS.left + TIMELINE_GUTTERS.right}px`;
  }
  function timelineOption(players, mode, echarts, narrow, theme = 'v2') {
    const data = trajectoryPlot(players, mode);
    const palettes = THEMES[theme];
    return {
      animation: false, backgroundColor: 'transparent', textStyle: { fontFamily: 'Google Sans, Arial, sans-serif' },
      // Use the comparison card's width, keeping a smaller gutter for axis and
      // endpoint labels. A single week stays centered rather than edge-aligned.
      grid: { top: 24, ...TIMELINE_GUTTERS, bottom: 33 },
      tooltip: { trigger: 'axis', confine: true, transitionDuration: 0, backgroundColor: '#171f32f5', borderColor: '#8db9df55', padding: [10, 12], textStyle: { color: '#ebf4ff', fontSize: 11 }, axisPointer: { type: 'line', lineStyle: { color: '#d2e5ff66', type: 'dashed' } },
        formatter: items => {
          const index = items[0]?.dataIndex;
          if (index == null) return '';
          const week = data.weeks[index];
          return `<div style="color:#9aaec7;font-size:10px;letter-spacing:1px;margin-bottom:7px">WEEK ${week} · ${mode === 'cumulative' ? 'CUMULATIVE' : 'FANTASY POINTS'}</div>${players.map((player, side) => {
            const item = player.weekly.find(row => row.week === week);
            return `<div style="display:flex;gap:20px;justify-content:space-between;margin:5px 0"><span style="color:${palettes[side].main}">${escape(player.name)}</span><b>${data.series[side][index] === null ? escape(item?.status || '—') : fmt(data.series[side][index])}</b></div>`;
          }).join('')}`;
        } },
      xAxis: { type: 'category', data: data.weeks.map(week => `W${week}`), boundaryGap: data.weeks.length < 2, axisTick: { show: false }, axisLine: { lineStyle: { color: '#ffffff13' } }, axisLabel: { color: '#8a9db7', fontSize: 10, interval: 0, margin: 16 }, splitLine: { show: true, lineStyle: { color: '#b5d3ff09', type: 'dotted' } } },
      yAxis: { type: 'value', scale: false, ...(!data.hasScores ? { min: -1, max: 1 } : {}), splitNumber: 4, axisLabel: { color: '#8a9db7', fontSize: 10 }, splitLine: { lineStyle: { color: '#b5d3ff10', type: 'dashed' } } },
      series: players.map((player, side) => {
        const p = palettes[side];
        const hasGames = data.series[side].some(value => value !== null);
        const points = data.plotted[side].map((value, index) => {
          const missed = data.series[side][index] === null;
          const other = data.plotted[1 - side][index];
          // A zero-sized symbol retains its label in ECharts; symbol: 'none'
          // would suppress the status text along with the scoring marker.
          return { value, ...(missed ? { symbolSize: 0 } : {}),
            // Put the higher value above and the lower below, including ties.
            // Both series keep every label, even when their paths cross.
            // Unplayed-week designations use desaturated player hues at reduced
            // opacity so their plain text is quieter than recorded score labels.
            label: { position: value > other || (value === other && side === 0) ? 'top' : 'bottom',
              ...(missed ? { color: p.muted, opacity: 0.65, backgroundColor: 'transparent', borderWidth: 0 } : {}) } };
        });
        // Monotone smoothing rounds the joins while keeping week order intact.
        // DM borrows the Consistency chart's vertical chromatic treatment; V2
        // uses a lateral gradient. Both keep distinct hues and marker shapes.
        return { name: player.name, type: 'line', data: points, connectNulls: true, smooth: .38, smoothMonotone: 'x', showSymbol: true, showAllSymbol: true, symbol: side === 0 ? 'circle' : 'diamond', symbolSize: 5.5, clip: true,
          lineStyle: { width: theme === 'dm' ? 2 : 2.5, cap: 'round', join: 'round', opacity: hasGames ? 1 : 0, color: new echarts.graphic.LinearGradient(0, theme === 'dm' ? 1 : 0, theme === 'dm' ? 0 : 1, 0, comparisonGradientStops(p, theme)), shadowColor: `rgba(${p.rgb},0.28)`, shadowBlur: theme === 'dm' ? 8 : 5 },
          itemStyle: { color: p.main, borderColor: '#101626', borderWidth: 1.4 },
          // Values and literal BYE/injury labels remain visible without hover.
          // Move collisions vertically; never let ECharts hide either player.
          label: { show: true, position: side === 0 ? 'top' : 'bottom', distance: 3,
            color: side === 0 ? p.main : p.light, fontSize: narrow ? 9 : 10, fontWeight: 600,
            backgroundColor: side === 0 ? '#102b2be6' : '#2a1839e6', borderColor: `rgba(${p.rgb},.25)`, borderWidth: .5, borderRadius: 3, padding: [2, 3],
            formatter: item => data.labels[side][item.dataIndex] },
          labelLayout: { hideOverlap: false, moveOverlap: 'shiftY' },
          areaStyle: { origin: 'auto', opacity: hasGames ? 1 : 0, color: new echarts.graphic.LinearGradient(0, 0, .2, 1, theme === 'dm'
            ? [...p.stops].reverse().map((color, index) => ({ offset: index / 3, color: gradientRgba(color, [.26, .15, .055, 0][index]) }))
            : [{ offset: 0, color: `rgba(${p.rgb},.26)` }, { offset: .28, color: `rgba(${p.rgb},.15)` }, { offset: .63, color: `rgba(${p.rgb},.055)` }, { offset: 1, color: `rgba(${p.rgb},0)` }]) },
          emphasis: { disabled: true }, animation: false, z: 3 - side };
      }),
    };
  }

  // Each redraw disposes the old ECharts instance and observer. A token prevents
  // a delayed library load from mounting into a closed or superseded modal.
  function disposeComparison() {
    sequence += 1;
    if (mounted) {
      mounted.observer?.disconnect(); mounted.statsObserver?.disconnect(); mounted.chart?.dispose();
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
      // Change materials and chart colors in place: selected players, scroll,
      // expanded definitions and weekly/cumulative mode all survive the toggle.
      model.mount.querySelectorAll('[data-ss-theme-button]').forEach(button => button.addEventListener('click', () => {
        comparisonTheme = button.dataset.ssThemeButton;
        model.mount.querySelector('.ss-dashboard').dataset.ssTheme = comparisonTheme;
        model.mount.querySelectorAll('[data-ss-theme-button]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        model.mount.querySelector('.ss-radar-region').innerHTML = performanceRadar(pair, comparisonTheme);
        const chartNode = model.mount.querySelector('.ss-timeline-chart');
        mounted?.chart?.setOption(timelineOption(pair, chartMode, window.echarts, chartNode.parentElement.clientWidth < 500, comparisonTheme), true);
      }));
      model.mount.querySelectorAll('[data-ss-pick]').forEach(select => select.addEventListener('change', () => {
        const side = Number(select.dataset.ssPick), previous = ids[side];
        ids[side] = select.value;
        if (ids[1 - side] === ids[side]) ids[1 - side] = previous;
        paint(`[data-ss-pick="${side}"]`);
      }));
      model.mount.querySelectorAll('[data-ss-chart]').forEach(button => button.addEventListener('click', () => {
        chartMode = button.dataset.ssChart;
        model.mount.querySelectorAll('[data-ss-chart]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        const chartNode = model.mount.querySelector('.ss-timeline-chart');
        sizeTrajectory(chartNode, pair, chartMode);
        if (mounted?.chart) {
          mounted.chart.resize();
          mounted.chart.setOption(timelineOption(pair, chartMode, window.echarts, chartNode.parentElement.clientWidth < 500, comparisonTheme), true);
        }
        chartNode.setAttribute('aria-label', `${chartMode} fantasy points for ${pair.map(player => player.name).join(' and ')}`);
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
      const statsObserver = new ResizeObserver(() => { if (sequence === token) measureStatPlots(model.mount); });
      mounted = { chart: null, observer: null, statsObserver, keyHandler, mount: model.mount };
      statsObserver.observe(model.mount.querySelector('.ss-stat-grid'));
      measureStatPlots(model.mount);
      document.fonts?.ready.then(() => { if (sequence === token) measureStatPlots(model.mount); });
      const chartNode = model.mount.querySelector('.ss-timeline-chart');
      if (!pair.some(player => player.weekly.length)) {
        chartNode.innerHTML = `<div class="ss-chart-empty">${icon('chart')}<b>No recorded scoring yet</b><span>Season stats remain available below.</span></div>`;
        return;
      }
      loadCharts().then(echarts => {
        if (sequence !== token || !chartNode.isConnected) return;
        sizeTrajectory(chartNode, pair, chartMode);
        const chart = echarts.init(chartNode, null, { renderer: 'canvas', devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2) });
        mounted.chart = chart;
        chart.setOption(timelineOption(pair, chartMode, echarts, chartNode.parentElement.clientWidth < 500, comparisonTheme));
        mounted.observer = new ResizeObserver(() => { if (!chart.isDisposed()) { chart.resize(); chart.setOption(timelineOption(pair, chartMode, echarts, chartNode.parentElement.clientWidth < 500, comparisonTheme), true); } });
        mounted.observer.observe(chartNode.parentElement);
      }).catch(() => {
        if (sequence !== token || !chartNode.isConnected) return;
        chartNode.innerHTML = '<div class="ss-chart-empty"><b>Chart unavailable</b><span>Explore the recorded weekly values below.</span></div>';
        model.mount.querySelector('.ss-weekly-table').open = true;
      });
    };
    paint();
  }
  window.RostersStartSit = Object.freeze({ renderPreview, renderLoading, renderComparison, disposeComparison, disposePreview, seriesFor, radarStatsForPosition, overviewSections: OVERVIEW });
})();
