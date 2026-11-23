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
  // DM is the sole comparison presentation. The selection preview keeps its
  // independent palette; comparison charts share these existing DM spectra.
  const COMPARISON_PALETTES = [
    { main: '#18ebdc', light: '#b7fff5', mid: '#00c6ef', deep: '#1264ff', muted: '#779ea8', rgb: '24,235,220',
      stops: ['#1264FF', '#118FFF', '#00C6EF', '#19EDDD'] },
    { main: '#b69aff', light: '#e6c4ff', mid: '#5b7fff', deep: '#db6dff', muted: '#9d99bb', rgb: '182,154,255',
      stops: ['rgba(115,244,255,.72)', 'rgba(91,127,255,.72)', 'rgba(219,109,255,.82)'], offsets: [0, .52, 1] },
  ];
  // Match the current Game Logs Performance axes and positional rank ceilings.
  // These are data definitions only; Start/Sit draws its own SVG presentation.
  const RADAR_CONFIG = {
    QB: { stats: ['fpts', 'ppg', 'cmp_pct', 'pass_rtg', 'imp', 'epa_per_db', 'cpoe', 'ttt', 'pass_yd', 'rush_yd', 'team_pass_pct', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'CMP%', 'paRTG', 'IMP(TD+1D)', 'EPA/DB', 'CPOE', 'TTT', 'paYDS', 'ruYDS', 'TmPa%', 'CSTY%', 'CL'], maxRank: 36 },
    RB: { stats: ['fpts', 'ppg', 'snp_pct', 'ypc', 'imp', 'expl_ru_pct', 'mtf_per_att', 'yco_per_att', 'ts_per_rr', 'yprr', 'yds_total', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'SNP%', 'YPC', 'IMP(TD+1D)', 'EXPLSV%', 'MTF/A', 'YCO/A', 'TS%', 'YPRR', 'YDS(t)', 'CSTY%', 'CL'], maxRank: 48 },
    WR: { stats: ['fpts', 'ppg', 'yds_total', 'imp', 'rec_tgt', 'ts_per_rr', 'rec', 'yprr', 'rec_yar', 'rec_yms', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'YDS(t)', 'IMP(TD+1D)', 'TGT', 'TS%', 'REC', 'YPRR', 'YAC', 'recYS%', 'CSTY%', 'CL'], maxRank: 72 },
    TE: { stats: ['fpts', 'ppg', 'yds_total', 'imp', 'rec_tgt', 'ts_per_rr', 'rec', 'yprr', 'rec_yar', 'rec_yms', 'csty_pct', 'ceiling'],
      labels: ['FPTS', 'PPG', 'YDS(t)', 'IMP(TD+1D)', 'TGT', 'TS%', 'REC', 'YPRR', 'YAC', 'recYS%', 'CSTY%', 'CL'], maxRank: 24 },
  };
  const radarStatsForPosition = position => RADAR_CONFIG[position]?.stats || [];
  const TIMELINE_GUTTERS = { left: 30, right: 18 };
  const START_SIT_TIMELINE_INSETS = { left: 26, right: 18, bottom: 30 };
  const START_SIT_WEEK_LABEL_MARGIN = 12;
  const OVERVIEW = [
    { id: 'info', label: 'PLAYER INFO', stats: ['overall_rank', 'player_name', 'position', 'team', 'age'] },
    { id: 'fantasy', label: 'FANTASY', stats: ['fpts', 'ppg'] },
    { id: 'overview', label: 'OVERVIEW STATS', stats: ['games_played', 'snp_pct', 'yds_total', 'ypg', 'td_total', 'opp', 'imp', 'imp_per_opp', 'tds_pct'] },
    { id: 'ceiling', label: 'CEILING & CONSISTENCY', stats: ['fpoe', 'csty_pct', 'ceiling'] },
  ];
  // The Start/Sit switcher follows the existing Season group order. WR and TE
  // share receiving groups; QB and RB put both General panels under one button.
  const STAT_GROUP_LABELS = {
    'passing-production': 'Pass Production', 'passing-efficiency': 'Pass Efficiency',
    'rushing-production': 'Rush Production', 'rushing-efficiency': 'Rush Efficiency',
    'receiving-production': 'Rec Production', 'receiving-efficiency': 'Rec Efficiency',
    'general-production': 'General Prod.', 'general-efficiency': 'General Eff.',
  };
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
  // Comparison-only names add the first initial while retaining suffixes
  // and compound surnames (for example A. St. Brown and B. Robinson Jr.).
  const comparisonName = player => {
    const parts = (player.name || player.label || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return parts.join(' ');
    const surname = shortName(player), start = parts.length - surname.split(/\s+/).length;
    const compound = start > 1 && /^(?:st\.?|van|von|de|del|la)$/i.test(parts[start - 1]);
    return `${parts[0][0].toUpperCase()}. ${compound ? parts.slice(start - 1).join(' ') : surname}`;
  };
  // Shared difference markup places the arrow on the player's own side of
  // the amount. Its separate span lets CSS style only the arrow glyph.
  function directedDifference(amount, side) {
    const value = `<span class="ss-delta-amount">${escape(amount)}</span>`;
    if (side === null) return value;
    const arrow = `<span class="ss-delta-arrow" aria-hidden="true">${side === 0 ? '←' : '→'}</span>`;
    return side === 0 ? `${arrow}${value}` : `${value}${arrow}`;
  }
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
    mount.innerHTML = `<div class="ss-dashboard ss-loading-dashboard" data-ss-theme="dm"><header class="ss-dashboard-header"><div class="ss-title-lockup"><span class="ss-app-mark">${icon('layers')}</span><div><span class="ss-eyebrow">START / SIT · PLAYER INTELLIGENCE</span><h1>Head to head<span class="ss-season-pill">${escape(season)}</span></h1></div></div><button class="ss-dashboard-close ss-icon-button" type="button" data-ss-loading-close aria-label="Back to players" title="Back to players">${icon('close')}</button></header>
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
  // The comparison consistency percentage uses the Game Logs HUD dial.
  // Ceiling retains its separate plain label/value/PPR row.
  function hudDial(player) {
    const value = number(player.metrics.csty_pct?.value);
    const progress = value === null ? null : Math.max(0, Math.min(1, value / 100));
    const tones = ['pink', 'magenta', 'violet', 'blue', 'cyan', 'teal', 'green'];
    const tone = progress === null ? 'neutral' : tones[Math.min(6, Math.floor(progress * 7))];
    const display = value === null ? '—' : `${fmt(value, Number.isInteger(value) ? 0 : 1)}%`;
    return `<div class="ss-hud-dial" data-dial-tone="${tone}" data-has-progress="${progress !== null && progress > 0}" style="--progress:${progress || 0}" role="img" aria-label="${escape(player.name)} consistency: ${display}" title="Arc = consistency percentage"><i class="ss-dial-glow"></i><i class="ss-dial-arc"></i><i class="ss-dial-echo"></i><i class="ss-dial-origin"></i><i class="ss-dial-cap"></i><div class="ss-dial-core"><b>${escape(display)}</b><span>CONSISTENCY</span></div></div>`;
  }
  function ring(player, side) {
    return `<div class="ss-consistency-player ss-side-${side}"><strong><i></i>${escape(comparisonName(player))}</strong><div class="ss-dm-gauges">${hudDial(player)}</div><div class="ss-ceiling"><span>CEILING</span><b>${escape(player.metrics.ceiling?.display || '—')}</b><small>PPR pts</small></div></div>`;
  }
  function getSections(players) {
    return players[0].pos === players[1].pos && players[0].sections.length ? players[0].sections : OVERVIEW;
  }
  function startSitStatGroups(players) {
    const position = players[0].pos;
    if (position !== players[1].pos) return [];
    const combineGeneral = position === 'QB' || position === 'RB';
    const sections = players[0].sections.filter(({ id }) => STAT_GROUP_LABELS[id]);
    const groups = sections.filter(({ id }) => !combineGeneral || !id.startsWith('general-'))
      .map(section => ({ id: section.id, label: STAT_GROUP_LABELS[section.id], sections: [section] }));
    const general = sections.filter(({ id }) => id.startsWith('general-'));
    if (combineGeneral && general.length) groups.push({ id: 'general', label: 'General', sections: general });
    return groups;
  }

  // The Stats table artwork lives in a same-origin sprite keyed by the roster
  // snapshot's stat IDs. Use DataHub's combined General glyph for both panels.
  function statIcon(type, key) {
    const id = type === 'group' && key.startsWith('general-') ? 'general' : key;
    return `<svg class="ss-stat-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="../assets/icons/rosters-start-sit-stats.svg#${type}-${escape(id)}" width="24" height="24"/></svg>`;
  }
  // Start/Sit compares published positional ranks directly: a smaller number
  // wins, even for lower-is-better or contextual stats. A source value is still
  // required, so missing/unqualified stats never acquire a fabricated rank.
  function qualifiedRank(metric) {
    const rank = number(metric?.rank);
    return number(metric?.value) !== null && rank !== null && rank >= 1 ? rank : null;
  }
  function rankWinner(metrics) {
    const ranks = metrics.map(qualifiedRank);
    return ranks.some(rank => rank === null) || ranks[0] === ranks[1] ? null : ranks[0] < ranks[1] ? 0 : 1;
  }
  function valueWinner(key, metrics) {
    const values = metrics.map(metric => number(metric?.value));
    if (values.some(value => value === null)) return null;
    if (CONTEXT.has(key)) return rankWinner(metrics);
    return Math.abs(values[0] - values[1]) < 1e-8 ? null : (LOWER.has(key) ? values[0] < values[1] : values[0] > values[1]) ? 0 : 1;
  }
  const comparisonState = (winner, side) => winner === null ? '' : winner === side ? ' ss-leading' : ' ss-trailing';
  function metricRow(key, players, useTableIcons = false) {
    const metrics = players.map(player => player.metrics[key] || { display: '—', value: null, rank: null });
    const values = metrics.map(metric => number(metric.value));
    const ranks = metrics.map(qualifiedRank);
    const label = players[0].labels[key] || LABELS[key] || key;
    const description = DESCRIPTIONS[key] || label;
    const isNumeric = !['player_name', 'position', 'team'].includes(key);
    const winner = rankWinner(metrics);
    // Both halves share a rank scale. Use the positional reference range and
    // extend it for valid lower ranks; changing raw units cannot resize a bar.
    // Rank 1 fills its half; progressively worse ranks shorten continuously.
    const rankScale = Math.max(1, ...players.map(player => RADAR_CONFIG[player.pos]?.maxRank || 72), ...ranks.filter(rank => rank !== null));
    const comparable = values.every(value => value !== null) && !CONTEXT.has(key);
    const equal = comparable && Math.abs(values[0] - values[1]) < 1e-8;
    const precision = Math.min(3, Math.max(...metrics.map(metric => (String(metric.display).match(/\.(\d+)/)?.[1] || '').length)));
    // Difference chips describe raw stat advantages, independently of the
    // rank-based bar emphasis. A lower-is-better advantage is a reduction;
    // percentage gaps keep the requested % suffix without relative scaling.
    const differenceWinner = comparable && !equal ? valueWinner(key, metrics) : null;
    const diff = comparable && !equal ? `${LOWER.has(key) ? '-' : '+'}${fmt(Math.abs(values[0] - values[1]), precision)}${metrics.some(metric => String(metric.display).includes('%')) ? '%' : ''}` : equal ? 'EVEN' : '';
    const valueMarkup = side => {
      const rank = ranks[side], showRank = isNumeric && key !== 'overall_rank' && (rank !== null || !CONTEXT.has(key));
      // Comparison bars keep the positional rank player-colored on the larger
      // top line, with the neutral stat value centered on the smaller line.
      // Prefix each rank with its own position, including unavailable ranks.
      return `<div class="ss-metric-value ss-side-${side}${comparisonState(winner, side)}">${showRank ? `<b class="ss-metric-rank" title="${escape(players[side].pos)} season positional rank${rank === null ? ' unavailable / unqualified' : ''}">${escape(players[side].pos)}·${rank ?? '—'}</b><small class="ss-metric-stat">${escape(metrics[side].display)}</small>` : `<b>${escape(metrics[side].display)}</b>`}</div>`;
    };
    const plotMarkup = side => {
      const rank = ranks[side], ratio = rank === null ? 0 : (rankScale - rank + 1) / rankScale;
      // The bars encode rank rather than signed stat magnitude. Recorded zero
      // and negative values remain literal labels; unranked values have no fill.
      return `<div class="ss-stat-plot ss-side-${side}${comparisonState(winner, side)}" style="--ss-bar-ratio:${ratio}" data-ss-available="${values[side] !== null}" data-ss-ranked="${rank !== null}" data-ss-rank="${rank ?? ''}">${isNumeric ? `<div class="ss-stat-rail" aria-hidden="true">${rank === null ? '' : '<i class="ss-stat-fill"></i>'}</div>` : ''}${valueMarkup(side)}</div>`;
    };
    const labelMarkup = useTableIcons ? `<span class="ss-metric-caption">${statIcon('column', key)}<span>${escape(label)}</span></span>` : `<span>${escape(label)}</span>`;
    return `<div class="ss-metric-row${!isNumeric ? ' ss-text-row' : ''}" data-ss-stat="${key}">${plotMarkup(0)}<div class="ss-metric-label"><button class="ss-metric-help" type="button" data-ss-help="${key}" aria-expanded="false" aria-controls="ss-help-${key}" aria-label="Explain ${escape(label)}" title="${escape(description)}">${labelMarkup}${diff ? `<small class="ss-difference${differenceWinner === null ? '' : ` ss-side-${differenceWinner}`}">${directedDifference(diff, differenceWinner)}</small>` : ''}</button></div>${plotMarkup(1)}<p class="ss-metric-explanation" id="ss-help-${key}" hidden>${escape(description)}</p></div>`;
  }
  function measureStatPlots(mount) {
    // Text uses real responsive font metrics, including percentages, large
    // totals and negative signs. A shared row reserve prevents either label
    // from colliding with an edge or shortening only one player's rank scale.
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
  // Each section counts only head-to-head qualified positional rank wins.
  // Missing ranks never award a win; tied ranks contribute no lead. Keep the
  // compact margin below STAT, colored toward the side with more stat wins.
  function sectionRankMargin(section, players) {
    const wins = [0, 0];
    let comparable = 0;
    section.stats.forEach(key => {
      const metrics = players.map(player => player.metrics[key]);
      if (metrics.some(metric => qualifiedRank(metric) === null)) return;
      comparable += 1;
      const winner = rankWinner(metrics);
      if (winner !== null) wins[winner] += 1;
    });
    const margin = wins[0] - wins[1], winner = margin === 0 ? null : margin > 0 ? 0 : 1;
    const label = directedDifference(winner === null ? comparable ? 'EVEN' : '—' : `+${Math.abs(margin)}`, winner);
    const description = !comparable ? 'No comparable positional ranks' : winner === null
      ? `Ranked stat wins tied: ${wins[0]} to ${wins[1]}`
      : `${comparisonName(players[winner])} leads by ${Math.abs(margin)} ranked stat${Math.abs(margin) === 1 ? '' : 's'} (${wins[winner]} to ${wins[1 - winner]})`;
    return `<div class="ss-section-stat"><i>STAT</i><small class="ss-section-margin${winner === null ? '' : ` ss-side-${winner}`}" aria-label="${escape(description)}" title="${escape(description)}">${label}</small></div>`;
  }
  function statSections(players, sections = getSections(players), useTableIcons = false) {
    return sections.map((section, index) => {
      const label = STAT_GROUP_LABELS[section.id];
      const heading = useTableIcons && label && !section.id.startsWith('general-') ? label : section.label.toLowerCase();
      const sectionIcon = useTableIcons ? statIcon('group', section.id)
        : icon(section.id.includes('efficiency') ? 'spark' : section.id.includes('production') ? 'chart' : section.id === 'info' ? 'target' : 'layers');
      return `<section class="ss-stat-section ss-panel" id="ss-section-${section.id}" data-ss-stat-group="${section.id}" aria-label="${escape(useTableIcons ? heading : section.label)}"><header class="ss-section-heading"><span class="ss-section-icon">${sectionIcon}</span><div>${useTableIcons ? '' : `<span class="ss-eyebrow">${String(index + 1).padStart(2, '0')} / SEASON DETAIL</span>`}<h3>${escape(heading)}</h3></div>${useTableIcons ? '' : `<span class="ss-stat-count">${section.stats.length}<small>STATS</small></span>`}</header><div class="ss-section-players"><span class="ss-side-0">${escape(comparisonName(players[0]))}</span>${sectionRankMargin(section, players)}<span class="ss-side-1">${escape(comparisonName(players[1]))}</span></div><div class="ss-metrics">${section.stats.map(key => metricRow(key, players, useTableIcons)).join('')}</div></section>`;
    }).join('');
  }

  function renderStartSitStats(players, sections, groups, activeGroup) {
    if (!activeGroup) return `<div class="ss-start-sit-stats ss-stat-grid">${statSections(players, sections, true)}</div>`;
    const fantasy = sections.filter(({ id }) => id === 'fantasy');
    const buttons = groups.map(({ id, label }) => {
      const [name, detail] = label.split(' ');
      return `<button type="button" id="ss-stat-tab-${id}" data-ss-stat-tab="${id}" aria-pressed="${id === activeGroup.id}" aria-controls="ss-active-stat-panels">${statIcon('group', id)}<span class="ss-stat-tab-caption">${name}${detail ? ` <span>${detail}</span>` : ''}</span></button>`;
    }).join('');
    // The labeled positional section starts after Fantasy. Its switcher only
    // replaces the panels below it, keeping the surrounding cards mounted.
    return `<div class="ss-start-sit-stats ss-start-sit-stats--switchable">
      ${statSections(players, fantasy, true)}
      <div class="ss-positional-stats">
        <h3 class="ss-positional-heading" id="ss-positional-heading">Positional stats</h3>
        <nav class="ss-stat-switcher" aria-labelledby="ss-positional-heading" data-group-count="${groups.length}">${buttons}</nav>
        <div class="ss-active-stat-panels" id="ss-active-stat-panels" role="region" aria-labelledby="ss-stat-tab-${activeGroup.id}">${statSections(players, activeGroup.sections, true)}</div>
      </div>
    </div>`;
  }
  function production(players) {
    const phases = [['pass_yd', 'Passing', '#9eb8f9'], ['rush_yd', 'Rushing', '#75d9c9'], ['rec_yd', 'Receiving', '#b99ae9']];
    const available = phases.filter(([key]) => players.some(player => number(player.metrics[key]?.value) !== null));
    const max = Math.max(1, ...players.map(player => available.reduce((sum, [key]) => sum + Math.max(0, number(player.metrics[key]?.value) || 0), 0)));
    return `<section class="ss-panel ss-production"><header class="ss-panel-header"><div>${icon('layers')}<h3>Yards by phase</h3></div><span class="ss-micro-label">SEASON TOTALS</span></header><div class="ss-production-content">${players.map((player, side) => `<div class="ss-production-player ss-side-${side}"><div><b>${escape(comparisonName(player))}</b><span>${available.length ? available.map(([key]) => fmt(player.metrics[key]?.value, 0)).join(' / ') : '—'}</span></div><div class="ss-production-track">${available.map(([key, label, color]) => `<i style="width:${Math.max(0, number(player.metrics[key]?.value) || 0) / max * 100}%;--phase:${color}" title="${label}: ${fmt(player.metrics[key]?.value, 0)} yards"></i>`).join('')}</div></div>`).join('')}<div class="ss-production-legend">${available.map(([, label, color]) => `<span><i style="background:${color}"></i>${label}</span>`).join('')}</div><p>Shared scale · ${available.length ? 'Passing / Rushing / Receiving'.split(' / ').filter(label => available.some(([, phase]) => phase === label)).join(' / ') : 'No source totals'}</p></div></section>`;
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
  // Start/Sit maps rank 1 to the outside ring and keeps the tighter top-seven
  // band and minimum radius. Missing ranks still leave gaps in the trace.
  function radarRadius(rank, maximum, bestRadius = 85) {
    const value = number(rank);
    if (value === null || value < 1) return null;
    if (value >= maximum) return 10;
    const seventhRadius = bestRadius - 12;
    return value <= 7 ? bestRadius - (value - 1) * 2
      : seventhRadius - (value - 7) / (maximum - 7) * (seventhRadius - 10);
  }
  // DM preserves each edited spectrum's stop positions and alpha, including
  // player B's three-stop 52% midpoint. The same colors feed line and area.
  function comparisonGradientStops(palette) {
    return palette.stops.map((color, index) => ({ offset: palette.offsets?.[index] ?? index / (palette.stops.length - 1), color }));
  }
  function gradientRgba(color, opacity) {
    const rgba = color.match(/^rgba?\(([^)]+)\)/i)?.[1].split(',').map(Number);
    if (rgba) return `rgba(${rgba.slice(0, 3).join(',')},${opacity * (rgba[3] ?? 1)})`;
    const value = Number.parseInt(color.slice(1), 16);
    return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
  }
  // Match Game Logs' Performance value precision without changing the season
  // snapshot or the league-scored FPTS/PPG values supplied by app.js.
  function radarValue(key, value) {
    const n = number(value);
    if (n === null) return '—';
    if (['cmp_pct', 'snp_pct', 'ts_per_rr', 'csty_pct', 'rec_yms', 'team_pass_pct'].includes(key)) return `${n.toFixed(1)}%`;
    if (key === 'expl_ru_pct') return `${n.toFixed(2)}%`;
    if (key === 'cpoe') return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
    if (key === 'epa_per_db') return `${n > 0 ? '+' : ''}${n.toFixed(2)}`;
    if (['fpts', 'ppg', 'pass_rtg', 'ceiling'].includes(key)) return n.toFixed(1);
    if (['rec', 'rec_tgt', 'yds_total', 'imp', 'pass_yd', 'rush_yd', 'rec_yar'].includes(key)) return String(Math.round(n));
    return n.toFixed(2);
  }
  function rankSuffix(rank) {
    const n = Math.round(rank), last = n % 100;
    return last >= 11 && last <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
  }
  // Both players share the Game Logs axes common to their positions. Start/Sit
  // displays consistency and ceiling together in its separate progress card.
  function radarConfigFor(players, isStartSit) {
    const configs = players.map(player => RADAR_CONFIG[player.pos]);
    if (configs.some(config => !config)) return null;
    const stats = configs[0].stats.filter(key => configs[1].stats.includes(key)
      && (!isStartSit || (key !== 'csty_pct' && key !== 'ceiling')));
    return { stats, labels: stats.map(key => configs[0].labels[configs[0].stats.indexOf(key)]) };
  }
  function radarGraphic(players, config, isStartSit) {
    const cx = 180, cy = 176, radius = 110, count = config.stats.length;
    const bestRadius = isStartSit ? 100 : 85;
    const at = (index, distance) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      return [cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance];
    };
    const pointString = points => points.map(point => point.map(value => value.toFixed(2)).join(',')).join(' ');
    const palettes = COMPARISON_PALETTES;
    const definitions = palettes.map((palette, side) => {
      const stops = comparisonGradientStops(palette);
      return `<linearGradient id="ss-radar-${side}-line" x1="0" y1="1" x2="1" y2="0">${stops.map(stop => `<stop offset="${stop.offset}" stop-color="${stop.color}"/>`).join('')}</linearGradient><linearGradient id="ss-radar-${side}-area" x1="0" y1="1" x2=".85" y2="0">${stops.map(stop => `<stop offset="${stop.offset}" stop-color="${stop.color}" stop-opacity="${.04 + stop.offset * .2}"/>`).join('')}</linearGradient>`;
    }).join('');
    const grid = [20, 40, 60, 80, 100].map((level, index) => `<polygon points="${pointString(config.stats.map((_, i) => at(i, radius * level / 100)))}" class="ss-radar-grid-ring"${index === 4 ? ' data-outer="true"' : ''}/>`).join('');
    const axes = config.stats.map((key, index) => {
      const edge = at(index, radius), label = at(index, radius + 31);
      const name = key === 'imp' ? 'IMP<tspan class="ss-radar-axis-note">(TD+1D)</tspan>' : escape(config.labels[index]);
      const metrics = players.map(player => player.metrics[key]);
      const worseValue = valueWinner(key, metrics);
      // Keep both values centered beneath their shared stat label: A first,
      // B directly below. Compact 12/13-unit baseline gaps bring the values
      // closer to the stat and each other, retaining their size and hue.
      const values = players.map((player, side) => `<text x="${label[0]}" y="${label[1] + 7 + side * 13}" text-anchor="middle" class="ss-radar-axis-value ss-side-${side}${comparisonState(worseValue, side)}"><title>${escape(player.name)} · ${escape(config.labels[index])}</title>${escape(radarValue(key, metrics[side]?.value))}</text>`).join('');
      return `<line x1="${cx}" y1="${cy}" x2="${edge[0]}" y2="${edge[1]}" class="ss-radar-spoke"/><g class="ss-radar-axis-group" data-ss-radar-stat="${key}"><title>${escape(DESCRIPTIONS[key] || config.labels[index])}</title><text x="${label[0]}" y="${label[1] - 5}" text-anchor="middle" class="ss-radar-axis">${name}</text>${values}</g>`;
    }).join('');
    const datasets = players.map((player, side) => {
      const maximum = RADAR_CONFIG[player.pos].maxRank;
      const points = config.stats.map((key, index) => {
        const distance = radarRadius(qualifiedRank(player.metrics[key]), maximum, bestRadius);
        return distance === null ? null : at(index, radius * distance / 100);
      });
      const complete = points.every(Boolean);
      const area = complete ? `<polygon class="ss-radar-area" points="${pointString(points)}" fill="url(#ss-radar-${side}-area)"/>` : '';
      const line = complete ? `<polygon points="${pointString(points)}" fill="none" stroke="url(#ss-radar-${side}-line)"/>`
        : points.map((point, index) => point && points[(index + 1) % count] ? `<path d="M${point}L${points[(index + 1) % count]}" fill="none" stroke="url(#ss-radar-${side}-line)"/>` : '').join('');
      const markers = points.map((point, index) => !point ? '' : `<g><title>${escape(player.name)} · ${escape(config.labels[index])}: ${escape(radarValue(config.stats[index], player.metrics[config.stats[index]]?.value))} · ${escape(player.pos)} rank ${qualifiedRank(player.metrics[config.stats[index]])}</title>${side === 0 ? `<circle cx="${point[0]}" cy="${point[1]}" r="2.6"/>` : `<path d="M${point[0]},${point[1] - 3.4}l3.4 3.4-3.4 3.4-3.4-3.4Z"/>`}</g>`).join('');
      return { markup: `<g class="ss-radar-dataset ss-side-${side}"><g class="ss-radar-shape">${area}${line}</g><g class="ss-radar-markers">${markers}</g></g>`, points };
    });
    // Reserve the three-line axis groups before placing point labels. Dense
    // low-rank profiles can crowd the center: search nearby
    // radial/tangent slots, retaining every label and its player identity.
    const reserved = config.stats.map((key, index) => {
      const label = at(index, radius + 31);
      const width = Math.max(key === 'imp' ? 52 : config.labels[index].length * 6,
        ...players.map(player => radarValue(key, player.metrics[key]?.value).length * 5.5)) + 4;
      return { x: label[0] - width / 2, y: label[1] - 18, width, height: 45 };
    });
    const labels = config.stats.flatMap((key, index) => {
      const metrics = players.map(player => player.metrics[key]), winner = rankWinner(metrics);
      return players.map((player, side) => {
        const rank = qualifiedRank(metrics[side]);
        if (rank === null) return null;
        const distance = radius * radarRadius(rank, RADAR_CONFIG[player.pos].maxRank, bestRadius) / 100;
        return { key, index, side, rank, winner, distance, point: datasets[side].points[index] };
      }).filter(Boolean);
    });
    // Stronger outer points get first choice; later labels move just enough to
    // clear prior labels. A conservative text box includes ordinal suffixes.
    const occupied = [...reserved];
    const intersects = (a, b) => a.x < b.x + b.width + 2 && a.x + a.width + 2 > b.x
      && a.y < b.y + b.height + 2 && a.y + a.height + 2 > b.y;
    labels.sort((a, b) => b.distance - a.distance || a.index - b.index || a.side - b.side).forEach(item => {
      const angle = -Math.PI / 2 + item.index * Math.PI * 2 / count;
      const width = String(item.rank).length * 5 + 8, height = 13.5;
      const candidates = [];
      for (const radialShift of [0, 9, -9, 18, -18, 27, -27, 36, -36, 45, -45, 54, -54, 63, -63, 72, -72, 81, -81, 90, -90]) {
        const distance = Math.max(23, Math.min(104, item.distance + 9 + radialShift));
        for (const tangent of [0, -8, 8, -16, 16, -24, 24, -32, 32]) {
          const point = at(item.index, distance);
          const xy = [point[0] - Math.sin(angle) * tangent, point[1] + Math.cos(angle) * tangent];
          const box = { x: xy[0] - width / 2, y: xy[1] - height / 2, width, height };
          candidates.push({ xy, box, cost: Math.hypot(xy[0] - item.point[0], xy[1] - item.point[1]) });
        }
      }
      candidates.sort((a, b) => a.cost - b.cost);
      const placement = candidates.find(candidate => !occupied.some(box => intersects(candidate.box, box))) || candidates.at(-1);
      item.xy = placement.xy;
      occupied.push(placement.box);
    });
    const rankLeaders = labels.map(item => Math.hypot(item.xy[0] - item.point[0], item.xy[1] - item.point[1]) < 17 ? ''
      : `<line x1="${item.point[0]}" y1="${item.point[1]}" x2="${item.xy[0]}" y2="${item.xy[1]}" class="ss-radar-rank-leader ss-side-${item.side}${comparisonState(item.winner, item.side)}"/>`).join('');
    // Start/Sit ordinals share an alphabetic baseline. Shift the whole label
    // down slightly so its numerals stay centered in the existing placement.
    const rankBaseline = isStartSit ? 'alphabetic' : 'middle';
    const rankOffset = isStartSit ? 2 : 0;
    const suffixOffset = isStartSit ? '' : ' dy="-2.5"';
    const rankLabels = labels.map(item => `<text x="${item.xy[0]}" y="${item.xy[1] + rankOffset}" data-ss-radar-rank="${item.key}" class="ss-radar-rank ss-side-${item.side}${comparisonState(item.winner, item.side)}" text-anchor="middle" dominant-baseline="${rankBaseline}"><title>${escape(players[item.side].name)} · ${escape(config.labels[item.index])} · ${escape(players[item.side].pos)} rank ${item.rank}</title>${item.rank}<tspan class="ss-radar-rank-suffix"${suffixOffset}>${rankSuffix(item.rank)}</tspan></text>`).join('');
    // Trim only the vertical SVG gutter, keeping the axes and labels at the
    // same scale and providing the same clearance to the sides of the card.
    const viewBox = isStartSit ? '0 5 360 350' : '0 0 360 360';
    return `<svg class="ss-radar-svg" viewBox="${viewBox}" role="img" aria-label="${escape(players.map(player => player.name).join(' and '))} performance radar. Each stat shows player A's value above player B's; colored positional ranks label the plotted points."><defs>${definitions}</defs><g>${grid}${axes}</g><circle cx="${cx}" cy="${cy}" r="2" class="ss-radar-center"/>${datasets.map(item => item.markup).join('')}<g class="ss-radar-ranks">${rankLeaders}${rankLabels}</g></svg>`;
  }
  function performanceRadar(players, isStartSit = false) {
    const config = radarConfigFor(players, isStartSit);
    if (!config) return '<p class="ss-panel-note">Performance radar unavailable for this position.</p>';
    return `<div class="ss-radar-shared"><div class="ss-radar-card-content"><div class="ss-radar-plot">${radarGraphic(players, config, isStartSit)}</div><details class="ss-radar-ledger"><summary>All values & positional ranks ${icon('down')}</summary><table><caption>Season performance · ${players[0].pos === players[1].pos ? escape(players[0].pos) : 'Shared metrics; each player retains their positional ranks'}</caption><thead><tr><th scope="col">METRIC</th>${players.map((player, side) => `<th scope="col" class="ss-side-${side}">${escape(comparisonName(player))}</th>`).join('')}</tr></thead><tbody>${config.stats.map((key, index) => {
      const metrics = players.map(player => player.metrics[key]), winner = rankWinner(metrics), bestValue = valueWinner(key, metrics);
      return `<tr><th scope="row">${escape(config.labels[index])}</th>${players.map((player, side) => {
        const rank = qualifiedRank(metrics[side]);
        return `<td class="ss-side-${side}"><b class="${comparisonState(bestValue, side).trim()}">${escape(radarValue(key, metrics[side]?.value))}</b><small class="${comparisonState(winner, side).trim()}" title="${rank === null ? 'No qualified positional rank' : `${escape(player.pos)} positional rank`}">${rank === null ? '—' : `${rank}${rankSuffix(rank)}`}</small></td>`;
      }).join('')}</tr>`;
    }).join('')}</tbody></table></details></div></div>`;
  }
  function comparisonMarkup(model, pair, chartMode, groups = [], activeGroup = groups[0]) {
    const sections = getSections(pair);
    const same = pair[0].pos === pair[1].pos;
    const metricCount = sections.reduce((sum, section) => sum + section.stats.length, 0);
    const detailHeading = model.isStartSit ? '<div class="ss-detail-heading"><h2>Season stats</h2></div>'
      : `<div class="ss-detail-heading"><div><span class="ss-eyebrow">THE COMPLETE PICTURE</span><h2>Every stat. Both players.</h2></div><span class="ss-detail-badge">${metricCount}<small>METRICS</small></span></div>`;
    const detailPanels = model.isStartSit ? renderStartSitStats(pair, sections, groups, activeGroup)
      : `<nav class="ss-chapters" aria-label="Stat sections">${sections.map(section => `<button type="button" data-ss-section="${section.id}">${escape(section.label.toLowerCase())}</button>`).join('')}<button type="button" data-ss-section="radar">${icon('target')} Radar</button></nav><div class="ss-stat-grid">${statSections(pair, sections)}</div>`;
    const selectedOptions = side => model.players.map(player => `<option value="${escape(player.id)}"${player.id === pair[side].id ? ' selected' : ''}>${escape(player.name)} · ${escape(player.pos)}</option>`).join('');
    const scoringViewport = model.isStartSit ? '' : ' tabindex="0" role="region" aria-label="Scoring Comparison; scroll horizontally for more weeks"';
    const rankGuide = model.isStartSit ? '' : '<span>Bar length = positional rank · longer is stronger</span>';
    return `<div class="ss-dashboard" data-ss-theme="dm"${model.isStartSit ? ' data-ss-start-sit' : ''}><header class="ss-dashboard-header"><div class="ss-title-lockup"><span class="ss-app-mark">${icon('layers')}</span><div><span class="ss-eyebrow">START / SIT · COMPARISON</span><h1>Head to head<span class="ss-season-pill">${escape(model.season)}</span></h1></div></div><div class="ss-dashboard-actions"><button class="ss-dashboard-close ss-icon-button" type="button" data-ss-close aria-label="Close player comparison">${icon('close')}</button></div></header>
      <div class="ss-dashboard-scroll"><div class="ss-comparison-pickers"><label class="ss-side-0"><span>A</span><select aria-label="First comparison player" data-ss-pick="0">${selectedOptions(0)}</select>${icon('down')}</label><button class="ss-swap ss-icon-button" type="button" data-ss-swap aria-label="Swap compared players">${icon('swap')}</button><label class="ss-side-1"><span>B</span><select aria-label="Second comparison player" data-ss-pick="1">${selectedOptions(1)}</select>${icon('down')}</label></div>
      <div class="ss-hero"><div class="ss-hero-orbit" aria-hidden="true"></div>${pair.map((player, side) => playerHero(player, side, model.week)).join('')}<span class="ss-hero-vs" aria-hidden="true">VS</span></div>
      <div class="ss-projection-insight">${icon('pulse')}<span>${number(pair[0].projection) !== null && number(pair[1].projection) !== null ? Math.abs(pair[0].projection - pair[1].projection) < .05 ? 'Level projections for this week' : `<b class="ss-side-${pair[0].projection > pair[1].projection ? 0 : 1}">${escape(comparisonName(pair[pair[0].projection > pair[1].projection ? 0 : 1]))}</b> projects <strong>${fmt(Math.abs(pair[0].projection - pair[1].projection))}</strong> points higher` : 'Compare season production while projections are unavailable'}</span><span class="ss-micro-label">WK ${model.week || '—'} OUTLOOK</span></div>
      <div class="ss-analytics-grid"><section class="ss-panel ss-timeline"><header class="ss-panel-header"><div>${icon('chart')}<h3>Scoring Comparison</h3></div><div class="ss-chart-toggle" role="group" aria-label="Scoring chart view"><button type="button" data-ss-chart="weekly" aria-pressed="${chartMode === 'weekly'}">Weekly</button><button type="button" data-ss-chart="cumulative" aria-pressed="${chartMode === 'cumulative'}">Cumulative</button></div></header><div class="ss-chart-legend">${pair.map((player, side) => `<span class="ss-side-${side}"><i></i>${escape(comparisonName(player))}</span>`).join('')}<span>LEAGUE PTS</span></div><div class="ss-timeline-viewport"${scoringViewport}><div class="ss-timeline-chart" role="img" aria-label="${chartMode === 'weekly' ? 'Weekly' : 'Cumulative'} fantasy points for ${escape(pair.map(player => player.name).join(' and '))}"></div></div><div class="ss-chart-caption"><span>Recorded games only</span><span>Unplayed weeks show status</span></div>${weeklyTable(pair)}</section>
      <section class="ss-panel ss-reliability"><header class="ss-panel-header"><div>${icon('shield')}<h3>Consistency & ceiling</h3></div><span class="ss-micro-label">PPR BASELINE</span></header><div class="ss-consistency-rings">${pair.map((player, side) => ring(player, side)).join('')}</div><p class="ss-panel-note">CSTY% and CL · published season values</p></section>${production(pair)}</div>
      ${detailHeading}<div class="ss-stat-contract"><span>${same ? `${escape(pair[0].pos)} · Game Logs season stats` : 'Mixed positions · Data Hub Overview'}</span>${rankGuide}</div>
      ${detailPanels}
      <section class="ss-panel ss-performance" id="ss-section-radar" aria-label="Performance radar"><header class="ss-panel-header"><div>${icon('target')}<h3>Performance radar</h3></div><span class="ss-micro-label">${same ? `${escape(pair[0].pos)} · HEAD TO HEAD` : 'SHARED POSITION METRICS'}</span></header><div class="ss-radar-legend">${pair.map((player, side) => `<span class="ss-side-${side}"><i>${side === 0 ? '●' : '◆'}</i>${escape(comparisonName(player))}</span>`).join('')}<small>OUTWARD = STRONGER RANK</small></div><div class="ss-radar-region">${performanceRadar(pair, model.isStartSit)}</div><p class="ss-radar-note">${same ? 'Game Logs positional metrics' : 'Shared Game Logs metrics · each position retains its rank scale'} · A values above B · dimmed labels trail the other player. Unranked metrics keep their values and leave gaps.</p></section>
      <footer class="ss-data-note">${icon('target')}<p>FPTS & PPG follow your league scoring. Other season metrics, ceiling and consistency follow the published stats. Positional ranks retain Game Logs qualification. <span>— Unavailable &nbsp; · &nbsp; 0 Recorded zero &nbsp; · &nbsp; Dimmed label Trails the other player</span></p></footer></div></div>`;
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

  // Labels use the same recorded scores/statuses and interpolated drawing
  // coordinates as the chart. Unplayed weeks remain text-only designations.
  function scoringLabelsFor(players, mode) {
    const data = trajectoryPlot(players, mode);
    return players.flatMap((player, side) => data.weeks.map((week, index) => ({
      side, index, week, value: data.plotted[side][index], text: data.labels[side][index],
      status: data.series[side][index] === null,
      above: data.plotted[side][index] > data.plotted[1 - side][index]
        || (data.plotted[side][index] === data.plotted[1 - side][index] && side === 0),
    })));
  }
  function scoringLabelMarkup(items) {
    return items.map(item => `<span class="ss-score-label ss-side-${item.side}${item.status ? ' is-status' : ''} ${item.above ? 'is-above' : 'is-below'}" data-ss-score-side="${item.side}" data-ss-score-index="${item.index}">${escape(item.text)}</span>`).join('');
  }
  function sizeTrajectory(chartNode, players, mode) {
    const items = scoringLabelsFor(players, mode), weeks = seriesFor(players, mode).weeks;
    let labelWidth = Math.max(34, ...items.map(item => item.text.length * 5 + 14));
    // Regular Rosters Compare keeps its scrollable label slots sized from the
    // actual CSS chips. Start/Sit fits the full span inside the chart card.
    if (chartNode.appendChild && document.createElement) {
      const probe = document.createElement('div');
      probe.className = 'ss-score-labels is-measuring';
      probe.innerHTML = scoringLabelMarkup(items);
      chartNode.appendChild(probe);
      labelWidth = Math.max(34, ...[...probe.children].map(node => node.getBoundingClientRect().width + 8));
      probe.remove();
    }
    chartNode.style.minWidth = `${Math.max(0, weeks.length - 1) * labelWidth + TIMELINE_GUTTERS.left + TIMELINE_GUTTERS.right}px`;
  }
  // Keep Start/Sit score chips at their week positions. If two chips collide
  // on a narrow or late-season chart, move the later chip by the smallest
  // clear vertical offset within the plot and above the week-label strip.
  function staggerScoringLabels(overlay, nodes) {
    const bounds = overlay.getBoundingClientRect();
    const bottom = bounds.bottom - (START_SIT_TIMELINE_INSETS.bottom - START_SIT_WEEK_LABEL_MARGIN);
    const labels = nodes.filter(node => !node.hidden).map(node => ({ node, box: node.getBoundingClientRect() }));
    labels.sort((a, b) => Number(a.node.dataset.ssScoreIndex) - Number(b.node.dataset.ssScoreIndex));
    const placed = [];
    const gap = 1;
    for (const { node, box } of labels) {
      const neighbors = placed.filter(other => box.left < other.right + gap && box.right > other.left - gap);
      const candidates = [0, ...neighbors.flatMap(other => [other.top - box.bottom - gap, other.bottom - box.top + gap])];
      const direction = node.classList.contains('is-above') ? -1 : 1;
      candidates.sort((a, b) => Math.abs(a) - Math.abs(b) || direction * (b - a));
      const offset = candidates.find(delta => box.top + delta >= bounds.top && box.bottom + delta <= bottom
        && neighbors.every(other => box.bottom + delta <= other.top - gap || box.top + delta >= other.bottom + gap)) ?? 0;
      if (offset) node.style.top = `${Number.parseFloat(node.style.top) + offset}px`;
      placed.push({ left: box.left, right: box.right, top: box.top + offset, bottom: box.bottom + offset });
    }
  }
  // Keep real CSS-styled chips anchored to ECharts' own point coordinates.
  // CSS controls their surface, typography and point gap directly; the chart
  // only supplies position. The overlay never intercepts hover/touch events.
  function renderScoringLabels(chart, players, mode, isStartSit) {
    const chartNode = chart.getDom(), items = scoringLabelsFor(players, mode);
    let overlay = chartNode.querySelector('.ss-score-labels:not(.is-measuring)');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'ss-score-labels';
      overlay.setAttribute('aria-hidden', 'true');
      chartNode.appendChild(overlay);
    }
    overlay.innerHTML = scoringLabelMarkup(items);
    const nodes = [...overlay.children];
    const widths = nodes.map(node => node.getBoundingClientRect().width);
    nodes.forEach((node, index) => {
      const item = items[index], pixel = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [item.index, item.value]);
      if (!pixel?.every(Number.isFinite)) { node.hidden = true; return; }
      const half = widths[index] / 2;
      node.style.left = `${Math.max(half + 1, Math.min(chart.getWidth() - half - 1, pixel[0]))}px`;
      node.style.top = `${pixel[1]}px`;
    });
    if (isStartSit) staggerScoringLabels(overlay, nodes);
  }
  function timelineOption(players, mode, echarts, fitWidth = null) {
    const data = trajectoryPlot(players, mode);
    const palettes = COMPARISON_PALETTES;
    const grid = fitWidth === null ? { top: 24, ...TIMELINE_GUTTERS, bottom: 33 } : { top: 24, ...START_SIT_TIMELINE_INSETS };
    const weekSpacing = (fitWidth - grid.left - grid.right) / Math.max(1, data.weeks.length - 1);
    // Keep every tick through Week 13 even on narrow phones. If a dense
    // timeline needs fewer printed ticks, retain both ends and plot every week.
    const lastIndex = data.weeks.length - 1;
    const interval = fitWidth !== null && weekSpacing < 15
      ? index => index === lastIndex || (index < lastIndex - 1 && index % 2 === 0)
      : 0;
    const weekLabel = fitWidth === null ? { fontSize: 10, margin: 16 }
      : { fontSize: weekSpacing < 18 ? 8 : 10, margin: START_SIT_WEEK_LABEL_MARGIN };
    return {
      animation: false, backgroundColor: 'transparent', textStyle: { fontFamily: 'Google Sans, Arial, sans-serif' },
      // The Start/Sit panel fits its full timeline into the card width. The
      // narrower insets bring axis labels closer while reserving endpoint room.
      grid,
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
      xAxis: { type: 'category', data: data.weeks.map(week => `${fitWidth === null ? 'W' : 'w'}${week}`), boundaryGap: data.weeks.length < 2, axisTick: { show: false }, axisLine: { lineStyle: { color: '#ffffff13' } }, axisLabel: { color: '#8a9db7', interval, ...weekLabel }, splitLine: { show: true, lineStyle: { color: '#b5d3ff09', type: 'dotted' } } },
      yAxis: { type: 'value', scale: false, ...(!data.hasScores ? { min: -1, max: 1 } : {}), splitNumber: 4, axisLabel: { color: '#8a9db7', fontSize: 10 }, splitLine: { lineStyle: { color: '#b5d3ff10', type: 'dashed' } } },
      series: players.map((player, side) => {
        const p = palettes[side];
        const hasGames = data.series[side].some(value => value !== null);
        const points = data.plotted[side].map((value, index) => ({ value,
          ...(data.series[side][index] === null ? { symbolSize: 0 } : {}),
        }));
        // DM keeps its smooth vertical spectrum and two distinct marker shapes.
        return { name: player.name, type: 'line', data: points, connectNulls: true, smooth: .38, smoothMonotone: 'x', showSymbol: true, showAllSymbol: true, symbol: side === 0 ? 'circle' : 'diamond', symbolSize: 5.5, clip: true,
          lineStyle: { width: 2, cap: 'round', join: 'round', opacity: hasGames ? 1 : 0, color: new echarts.graphic.LinearGradient(0, 1, 0, 0, comparisonGradientStops(p)), shadowColor: `rgba(${p.rgb},0.28)`, shadowBlur: 8 },
          itemStyle: { color: p.main, borderColor: '#101626', borderWidth: 1.4 },
          // CSS-styled DOM labels render above the canvas in renderScoringLabels.
          label: { show: false },
          areaStyle: { origin: 'auto', opacity: hasGames ? 1 : 0, color: new echarts.graphic.LinearGradient(0, 0, .2, 1,
            comparisonGradientStops(p).map(stop => ({ offset: 1 - stop.offset, color: gradientRgba(stop.color, .26 * stop.offset) })).reverse()) },
          emphasis: { disabled: true }, animation: false, z: 3 - side };
      }),
    };
  }

  // Each redraw disposes the old ECharts instance and observer. A token prevents
  // a delayed library load from mounting into a closed or superseded modal.
  function disposeComparison() {
    sequence += 1;
    if (mounted) {
      // The HTML score overlay is owned by this chart, including direct
      // disposal before the surrounding modal markup is replaced.
      mounted.chart?.getDom().querySelector('.ss-score-labels')?.remove();
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
    let statPosition = null;
    let activeStatGroupId;
    const paint = (restoreFocus = null) => {
      disposeComparison();
      const token = sequence;
      const pair = ids.map(id => model.players.find(player => player.id === id));
      if (pair.some(player => !player)) return;
      const groups = model.isStartSit ? startSitStatGroups(pair) : [];
      const position = groups.length ? pair[0].pos : null;
      // Swaps and same-position picker changes retain the selected group.
      // Entering a different position starts at its own production panel.
      const activeGroup = (position === statPosition && groups.find(group => group.id === activeStatGroupId)) || groups[0];
      statPosition = position;
      activeStatGroupId = activeGroup?.id;
      model.mount.innerHTML = comparisonMarkup(model, pair, chartMode, groups, activeGroup);
      bindPlayerNames(model.mount, pair, model.onGameLogs);
      model.mount.querySelector('[data-ss-close]').addEventListener('click', model.onClose);
      model.mount.querySelector('[data-ss-swap]').addEventListener('click', () => { ids.reverse(); paint('[data-ss-swap]'); });
      model.mount.querySelectorAll('[data-ss-pick]').forEach(select => select.addEventListener('change', () => {
        const side = Number(select.dataset.ssPick), previous = ids[side];
        ids[side] = select.value;
        if (ids[1 - side] === ids[side]) ids[1 - side] = previous;
        paint(`[data-ss-pick="${side}"]`);
      }));
      const chartNode = model.mount.querySelector('.ss-timeline-chart');
      // The mode toggle, resize observer and font refresh use the same
      // width calculation so Start/Sit stays fitted across every redraw.
      const refreshChart = () => {
        const chart = mounted?.chart;
        if (sequence !== token || !chart || chart.isDisposed()) return;
        if (!model.isStartSit) sizeTrajectory(chartNode, pair, chartMode);
        chart.resize();
        const fitWidth = model.isStartSit ? chart.getWidth() : null;
        chart.setOption(timelineOption(pair, chartMode, window.echarts, fitWidth), true);
        renderScoringLabels(chart, pair, chartMode, model.isStartSit);
      };
      model.mount.querySelectorAll('[data-ss-chart]').forEach(button => button.addEventListener('click', () => {
        chartMode = button.dataset.ssChart;
        model.mount.querySelectorAll('[data-ss-chart]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        refreshChart();
        chartNode.setAttribute('aria-label', `${chartMode} fantasy points for ${pair.map(player => player.name).join(' and ')}`);
      }));
      model.mount.querySelectorAll('[data-ss-section]').forEach(button => button.addEventListener('click', () => {
        model.mount.querySelector(`#ss-section-${button.dataset.ssSection}`)?.scrollIntoView({ behavior: 'instant', block: 'start' });
        model.mount.querySelectorAll('[data-ss-section]').forEach(other => other.classList.toggle('is-active', other === button));
      }));
      const statDock = model.mount.querySelector('.ss-stat-switcher');
      if (statDock) {
        const panel = model.mount.querySelector('#ss-active-stat-panels');
        const scroller = model.mount.querySelector('.ss-dashboard-scroll');
        const buttons = [...statDock.querySelectorAll('[data-ss-stat-tab]')];
        buttons.forEach((button, index) => button.addEventListener('click', () => {
          const group = groups[index];
          if (activeStatGroupId === group.id) return;
          activeStatGroupId = group.id;
          // When the sticky switcher covers the old group's first row, bring
          // the new group's heading into view directly below the switcher.
          const overlap = statDock.getBoundingClientRect().bottom - panel.getBoundingClientRect().top;
          const scrollTop = scroller.scrollTop;
          buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
          panel.setAttribute('aria-labelledby', button.id);
          panel.innerHTML = statSections(pair, group.sections, true);
          if (overlap > 0) scroller.scrollTop = scrollTop - overlap - 8;
          measureStatPlots(model.mount);
        }));
      }
      // Metric definitions open inline on touch/keyboard, keeping abbreviated
      // labels understandable even after the switcher replaces the active rows.
      model.mount.querySelector('.ss-dashboard').addEventListener('click', event => {
        const button = event.target.closest('[data-ss-help]');
        if (!button) return;
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        model.mount.querySelector(`#ss-help-${button.dataset.ssHelp}`).hidden = !open;
      });
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
      statsObserver.observe(model.mount.querySelector('.ss-start-sit-stats, .ss-stat-grid'));
      measureStatPlots(model.mount);
      document.fonts?.ready.then(() => { if (sequence === token) measureStatPlots(model.mount); });
      if (!pair.some(player => player.weekly.length)) {
        chartNode.innerHTML = `<div class="ss-chart-empty">${icon('chart')}<b>No recorded scoring yet</b><span>Season stats remain available below.</span></div>`;
        return;
      }
      loadCharts().then(echarts => {
        if (sequence !== token || !chartNode.isConnected) return;
        const chart = echarts.init(chartNode, null, { renderer: 'canvas', devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2) });
        mounted.chart = chart;
        refreshChart();
        mounted.observer = new ResizeObserver(refreshChart);
        document.fonts?.ready.then(refreshChart);
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
