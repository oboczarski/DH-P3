/* Rosters Start/Sit presentation only. The existing roster loaders supply every
 * value; this module owns the selection deck, comparison model and static charts.
 * It never imports DataHub/Matchups state or fetches a second stats source. */

export const OVERVIEW_COMPARISON_SECTIONS = Object.freeze([
  { id: 'fantasy', label: 'Fantasy', tone: 'fantasy', stats: ['fpts', 'ppg'] },
  { id: 'overview', label: 'Overview stats', tone: 'general', stats: ['games_played', 'snp_pct', 'yds_total', 'ypg', 'td_total', 'opp', 'imp', 'imp_per_opp', 'tds_pct'] },
  { id: 'ceiling', label: 'Ceiling & consistency', tone: 'efficiency', stats: ['fpoe', 'csty_pct', 'ceiling'] },
]);

const STAT_INFO = {
  fpts: ['FPTS', 'Fantasy points'], ppg: ['PPG', 'Fantasy points per game'],
  games_played: ['G', 'Games played'], snp_pct: ['SNP%', 'Snap share'],
  yds_total: ['YDS(t)', 'Total yards'], ypg: ['YPG(t)', 'Total yards per game'],
  td_total: ['TD(t)', 'Total touchdowns'], opp: ['OPP', 'Opportunities'],
  imp: ['IMP', 'Impact plays'], imp_per_opp: ['IMP/OPP', 'Impact plays per opportunity'],
  tds_pct: ['TDS%', 'Team touchdown share'], fpoe: ['FPOE', 'Fantasy points over expected'],
  csty_pct: ['CSTY%', 'Consistency rate'], ceiling: ['CL', 'Average of top three games'],
  pass_att: ['paATT', 'Passing attempts'], pass_cmp: ['CMP', 'Completions'],
  pass_yd: ['paYDS', 'Passing yards'], pass_td: ['paTD', 'Passing touchdowns'],
  pass_fd: ['pa1D', 'Passing first downs'], pass_imp: ['pIMP', 'Passing impact plays'],
  pass_sack: ['SAC', 'Sacks taken'], pass_int: ['INT', 'Interceptions'],
  epa: ['EPA', 'Expected points added'], dropbacks: ['DB', 'Dropbacks'],
  epa_per_db: ['EPA/DB', 'Expected points added per dropback'],
  cpoe: ['CPOE', 'Completion percentage over expected'], pass_rtg: ['paRTG', 'Passer rating'],
  cmp_pct: ['CMP%', 'Completion percentage'], pass_imp_per_att: ['pIMP/A', 'Passing impact per attempt'],
  ttt: ['TTT', 'Time to throw'], prs_pct: ['PRS%', 'Pressure rate'],
  blitz_pct: ['BLTZ%', 'Blitz rate'], dp_pct: ['DP%', 'Deep pass rate'],
  pa_ypg: ['paYPG', 'Passing yards per game'], team_pass_pct: ['TmPa%', 'Team pass rate'],
  rush_att: ['CAR', 'Carries'], rush_yd: ['ruYDS', 'Rushing yards'],
  rush_td: ['ruTD', 'Rushing touchdowns'], rush_fd: ['ru1D', 'Rushing first downs'],
  rush_yac: ['YCO', 'Yards after contact'], rush_ybc: ['YBC', 'Yards before contact'],
  mtf: ['MTF', 'Missed tackles forced'], rz_att: ['RZ Att', 'Red zone carries'],
  gl_att: ['GL Att', 'Goal line carries'], ypc: ['YPC', 'Yards per carry'],
  elu: ['ELU', 'Elusiveness rating'], mtf_per_att: ['MTF/A', 'Missed tackles per attempt'],
  yco_per_att: ['YCO/A', 'Yards after contact per attempt'],
  ybc_per_att: ['YBC/A', 'Yards before contact per attempt'],
  expl_ru_pct: ['EXPLSV%', 'Explosive rush rate'], ryoe: ['RYOE', 'Rushing yards over expected'],
  ryoe_per_att: ['RYOE/A', 'Rushing yards over expected per attempt'],
  ru_ypg: ['ruYPG', 'Rushing yards per game'], car_per_g: ['CAR/G', 'Carries per game'],
  rec_tgt: ['TGT', 'Targets'], rec: ['REC', 'Receptions'], rec_yd: ['recYDS', 'Receiving yards'],
  rec_td: ['recTD', 'Receiving touchdowns'], rec_fd: ['rec1D', 'Receiving first downs'],
  rec_yar: ['YAC', 'Yards after catch'], rr: ['RR', 'Routes run'],
  rz_tgt: ['RZ Tgt', 'Red zone targets'], tgt_10_plus: ['10+ Tgt', 'Targets of ten or more air yards'],
  ts_per_rr: ['TS%', 'Target share'], yprr: ['YPRR', 'Yards per route run'],
  tprr: ['TPRR', 'Targets per route run'], tgt_per_g: ['TGT/G', 'Targets per game'],
  rec_yacr: ['YACR', 'Yards after catch per reception'],
  first_down_rec_rate: ['1DRR', 'First downs per route run'],
  ypr: ['YPR', 'Yards per reception'], rec_ypg: ['recYPG', 'Receiving yards per game'],
  rec_per_g: ['REC/G', 'Receptions per game'], ay_pct: ['AY%', 'Air yards share'],
  ay_per_tgt: ['AY/Tgt', 'Air yards per target'], rec_yms: ['recYS%', 'Receiving yards share'],
  rec_tms: ['recTDS%', 'Receiving touchdowns share'], fum: ['FUM', 'Fumbles lost'],
  imp_per_g: ['IMP/G', 'Impact plays per game'],
};
const LOWER_BETTER = new Set(['pass_int', 'pass_sack', 'fum']);
// Timing and defensive pressure describe the player's environment. Compare
// their values without implying that one passing style is inherently better.
const CONTEXT_ONLY = new Set(['games_played', 'ttt', 'prs_pct', 'blitz_pct', 'team_pass_pct', 'dp_pct']);
const COLORS = ['#72e7eb', '#be9cff'];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

// Parse only complete numeric cells. Empty cells, statuses and NA never become
// zero; legitimate zero and negative results participate in the same chart scale.
export function numericCell(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(/,/g, '').replace(/%$/, '');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : null;
}

export function statScale(left, right) {
  const values = [left, right].map(numericCell);
  const max = Math.max(...values.map(value => Math.abs(value ?? 0)), 0);
  const signed = values.some(value => value !== null && value < 0);
  const widths = values.map(value => value === null || max === 0 ? 0 : Math.abs(value) / max * (signed ? 50 : 100));
  let winner = null;
  if (values.every(value => value !== null) && values[0] !== values[1]) winner = values[0] > values[1] ? 0 : 1;
  return { values, max, signed, widths, winner, tied: values.every(value => value !== null) && values[0] === values[1] };
}

// Mixed positions mirror DataHub's default Overview schema, including its info
// columns in the identity cards. Matching positions receive the actual Game Logs
// section definitions from app.js; there is no second, shorter positional list.
export function createComparisonModel(players, { season, sections, labels = {} }) {
  if (players.length !== 2) throw new Error('Player comparison requires two players.');
  const samePosition = players[0].pos === players[1].pos;
  const used = new Set();
  const schema = [...(samePosition ? sections : OVERVIEW_COMPARISON_SECTIONS)];
  // Games and the modal's consistency/ceiling summary complement its full
  // positional Season list. Overview already includes these exact columns.
  if (samePosition) {
    const existing = new Set(schema.flatMap(section => section.stats));
    const extras = ['games_played', 'csty_pct', 'ceiling'].filter(key => !existing.has(key));
    if (extras.length) schema.push({ id: 'stability', label: 'Availability & ceiling', tone: 'efficiency', stats: extras });
  }
  const groups = schema.map(section => ({
    ...section,
    rows: section.stats.filter(key => !used.has(key) && used.add(key)).map(key => {
      const [label, description] = STAT_INFO[key] || [labels[key] || key, labels[key] || key];
      const cells = players.map(player => {
        const datum = player.metrics[key] || {};
        const value = numericCell(datum.value);
        return { value, display: value === null ? '—' : datum.display || String(value), rank: numericCell(datum.rank) };
      });
      const scale = statScale(cells[0].value, cells[1].value);
      const direction = LOWER_BETTER.has(key) ? 'lower' : CONTEXT_ONLY.has(key) ? 'context' : 'higher';
      const winner = direction === 'context' ? null : scale.winner === null ? null : direction === 'lower' ? 1 - scale.winner : scale.winner;
      return { key, label: labels[key] || label, description, cells, scale, winner, direction };
    }),
  })).filter(group => group.rows.length);
  return { players, season, samePosition, groups, metricCount: groups.reduce((sum, group) => sum + group.rows.length, 0) };
}

function icon(name) {
  const paths = {
    orbit: '<ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-35 12 12)"/><circle cx="12" cy="12" r="3"/><path d="M20 4v4m-2-2h4"/>',
    compare: '<path d="M3 6h18M3 18h18M7 3 3 6l4 3m10 6 4 3-4 3"/><path d="M9 12h6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    clear: '<path d="m9 3-6 9 9 9h9M7 15l8-11 6 6-8 11"/>',
    chart: '<path d="M3 20h18M5 16l4-7 5 3 5-8"/><circle cx="9" cy="9" r="1"/><circle cx="14" cy="12" r="1"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9l10-6Zm-9 11 9 5 9-5m-18 5 9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.chart}</svg>`;
}

function teamLogo(team) {
  const code = String(team || '').toUpperCase();
  // Asset filenames are uppercase on the production host's case-sensitive
  // filesystem. Normalize aliases without depending on macOS path behavior.
  const key = ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[code] || code;
  if (!/^(ARI|ATL|BAL|BUF|CAR|CHI|CIN|CLE|DAL|DEN|DET|GB|HOU|IND|JAX|KC|LAC|LAR|LV|MIA|MIN|NE|NO|NYG|NYJ|PHI|PIT|SEA|SF|TB|TEN|WAS)$/.test(key)) return '<span class="ss-fa">FA</span>';
  return `<img src="../assets/NFL_logos_svg/${key}.svg" alt="${esc(code)}" width="30" height="30" decoding="async">`;
}
const fmt = (value, digits = 1) => {
  const numeric = numericCell(value);
  return numeric === null ? '—' : numeric.toFixed(digits);
};
const signed = (value, digits = 1) => {
  const numeric = numericCell(value);
  return numeric === null ? '—' : `${numeric > 0 ? '+' : ''}${numeric.toFixed(digits)}`;
};
function projectionText(selection) {
  const value = numericCell(selection.projection);
  if (value !== null) return value.toFixed(1);
  const status = String(selection.projectionDisplay || '').trim();
  return !status || /^(?:NA|N\/A)$/i.test(status) ? '—' : status;
}

function projectionBridge(selection, index, domain) {
  const ppg = numericCell(selection.ppg);
  const projection = numericCell(selection.projection);
  if (ppg === null || projection === null) return '';
  const min = domain.min;
  const max = domain.max;
  const x = value => 9 + (value - min) / (max - min) * 182;
  return `<svg class="ss-projection-bridge" viewBox="0 0 200 20" role="img" aria-label="Season average ${fmt(ppg)} points; projection ${fmt(projection)} points">
    <defs><linearGradient id="ss-bridge-${index}"><stop stop-color="${COLORS[index % 2]}" stop-opacity=".12"/><stop offset=".48" stop-color="${COLORS[index % 2]}" stop-opacity=".75"/><stop offset="1" stop-color="#eafcff"/></linearGradient></defs>
    <path d="M9 10h182" stroke="#b2c8ec" stroke-opacity=".12"/>
    ${[9, 54, 100, 145, 191].map(point => `<path d="M${point} 7v6" stroke="#b2c8ec" stroke-opacity=".14"/>`).join('')}
    <path d="M${x(ppg)} 10H${x(projection)}" stroke="url(#ss-bridge-${index})" stroke-width="3"/>
    <circle cx="${x(ppg)}" cy="10" r="3" fill="#101b2b" stroke="${COLORS[index % 2]}"/>
    <circle cx="${x(projection)}" cy="10" r="3.5" fill="${COLORS[index % 2]}" stroke="#e9fbff" stroke-width=".8"/>
  </svg>`;
}

function matchupMarkup(selection, metric, status, rankColor) {
  const opponent = metric?.team || String(selection.matchup?.opponent || '').replace(/^(?:@|vs\.?)\s*/i, '').toUpperCase();
  const pos = metric?.pos || selection.basePos || selection.pos;
  if (selection.matchup?.isBye || opponent === 'BYE') return '<div class="ss-matchup-unavailable">BYE · No opponent this week</div>';
  if (!metric) return `<div class="ss-matchup-unavailable">${opponent ? `${esc(opponent)} vs. ${esc(pos)} · ` : ''}${status === 'loading' ? 'Loading matchup data…' : 'Matchup data unavailable'}</div>`;
  const range = value => numericCell(value) === null ? '—' : `${esc(value)}<small>/32</small>`;
  const rankStyle = rank => {
    const color = rankColor?.(rank);
    return /^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(color || '') ? ` style="color:${color}"` : '';
  };
  return `<div class="ss-matchup-heading"><span>${teamLogo(opponent)} ${esc(opponent)} <small>vs. ${esc(pos)}</small></span><button type="button" data-start-sit-matchup-id="${esc(selection.id)}" class="ss-breakdown" aria-haspopup="dialog" aria-label="Matchup Breakdown for ${esc(selection.label)}">Breakdown ${icon('arrow')}</button></div>
    <div class="ss-matchup-metrics">
      <div title="Fantasy points allowed per game"><small>FPA/G</small><strong${rankStyle(metric.actualRank)}>${fmt(metric.actual?.avg)}</strong></div>
      <div title="Expected fantasy points allowed per game"><small>Expected/G</small><strong${rankStyle(metric.expectedRank)}>${fmt(metric.expectedAvg)}</strong></div>
      <div title="Published SOS rank: 1 easiest schedule already faced, 32 toughest"><small>SOS Rk.</small><strong${rankStyle(metric.sosRank)}>${range(metric.sosRank)}</strong></div>
      <div title="Actual minus expected points allowed per game"><small>vs Expected</small><strong class="${metric.deltaPerGame > 0 ? 'ss-easy' : metric.deltaPerGame < 0 ? 'ss-tough' : ''}">${signed(metric.deltaPerGame, 2)}</strong></div>
    </div>`;
}

// Replace only the floating Start/Sit preview, never the selectable roster
// cards above it. The same deck supports two through six actual selections.
export function previewMarkup({ selections, week, metricFor, matchupStatus, rankColor }) {
  const slots = Array.from({ length: Math.max(2, selections.length) }, (_, index) => selections[index] || null);
  // Every mini chart uses the same point domain across the selection deck.
  // A longer bridge therefore represents the same difference for every player.
  const points = selections.flatMap(selection => [numericCell(selection.ppg), numericCell(selection.projection)]).filter(value => value !== null);
  const projectionDomain = { min: Math.min(0, ...points), max: Math.max(1, ...points) };
  return `<div class="trade-container start-sit-container ss-preview">
    <div class="trade-header ss-preview-header">
      <div class="ss-preview-title">${icon('orbit')}<div><span>START / SIT</span><small>${week ? `WEEK ${week}` : 'YOUR LINEUP'} <b>·</b> ${selections.length}/6 selected</small></div></div>
      <div class="ss-preview-actions"><button id="clearTradeButton" type="button" aria-label="Clear selected players" ${selections.length ? '' : 'disabled'}>${icon('clear')}</button><button id="collapseTradeButton" type="button" aria-label="Collapse Start/Sit preview">${icon('chevron')}</button><button id="closeTradeButton" type="button" aria-label="Close Start/Sit">${icon('close')}</button></div>
    </div>
    <div class="trade-body ss-preview-body"><div class="ss-preview-deck">${slots.map((selection, index) => {
      if (!selection) return `<div class="ss-preview-slot ss-side-${index % 2} ss-slot-empty"><span class="ss-slot-index">0${index + 1}</span><div class="ss-empty-orbit">${icon('target')}</div><strong>Select a player</strong><small>Tap a roster card to add<br>your ${index ? 'second' : 'first'} option</small></div>`;
      const metric = metricFor(selection);
      const projection = numericCell(selection.projection);
      const projectionDisplay = projectionText(selection);
      const rank = numericCell(selection.ppgPosRank);
      return `<article class="ss-preview-slot ss-side-${index % 2}">
        <div class="ss-slot-heading"><span class="ss-slot-index">0${index + 1}</span><span class="ss-position">${esc(selection.basePos || selection.pos)}</span><span class="ss-slot-logo">${teamLogo(selection.team)}</span><button type="button" data-ss-remove="${esc(selection.id)}" aria-label="Remove ${esc(selection.label)}">${icon('close')}</button></div>
        <div class="ss-slot-name" title="${esc(selection.label)}">${esc(selection.label)}</div>
        <div class="ss-projection"><div><small>${week ? `WK ${week} ` : ''}PROJECTION</small><strong>${esc(projectionDisplay)}${projection === null ? '' : '<small>pts</small>'}</strong></div><div class="ss-baseline"><small>SEASON PPG</small><strong>${fmt(selection.ppg)}</strong><span>${esc(selection.basePos || selection.pos)}${rank === null ? ' · —' : ` · ${rank}`}</span></div></div>
        ${projectionBridge(selection, index, projectionDomain)}
        ${projection !== null && numericCell(selection.ppg) !== null ? '<div class="ss-bridge-caption"><span>○ Season avg.</span><span>● Projection</span></div>' : ''}
        <div class="ss-opponent-strip"><span>${esc(selection.matchup?.opponent || 'Opponent unavailable')}</span><small>${metric?.actualRank ? `Matchup · ${metric.actualRank}/32` : 'Matchup · —'}</small></div>
        ${matchupMarkup(selection, metric, matchupStatus, rankColor)}
      </article>`;
    }).join('')}</div></div>
    <div class="ss-preview-footer"><span>${selections.length < 2 ? 'Select two players to explore every angle.' : 'Season stats. Scoring trends. Side by side.'}</span><button id="comparePlayersButton" type="button" class="ss-compare-button ${selections.length >= 2 ? 'enabled' : ''}" ${selections.length >= 2 ? '' : 'disabled'}>${icon('compare')}<span>Compare</span>${icon('arrow')}</button></div>
    ${selections.some(selection => metricFor(selection)) ? '<div class="trade-footnote ss-preview-note">FPA = Fantasy Points Allowed · SOS: 1 easiest, 32 toughest</div>' : ''}
  </div><button id="showTradeButton" type="button">${icon('orbit')}<span>Start/Sit${week ? ` · WK ${week}` : ''}</span>${icon('chevron')}</button>`;
}

function metricDisplay(player, key, digits = 1) {
  const cell = player.metrics[key];
  return cell?.value === null || cell?.value === undefined ? '—' : cell.display || fmt(cell.value, digits);
}

function identityMarkup(player, index) {
  const ppg = player.metrics.ppg;
  const fpts = player.metrics.fpts;
  const projection = player.selection;
  return `<article class="ss-identity ss-side-${index}">
    <div class="ss-identity-top"><span class="ss-player-number">PLAYER 0${index + 1}</span><span class="ss-position">${esc(player.pos)}</span><span class="ss-identity-team">${teamLogo(player.team)}<span>${esc(player.team)}</span></span></div>
    <button type="button" class="ss-player-name" data-ss-player="${esc(player.id)}" aria-label="Open ${esc(player.name)} Game Logs">${esc(player.name)}${icon('arrow')}</button>
    <div class="ss-player-info"><span>AGE <b>${esc(player.age || '—')}</b></span><span>G <b>${metricDisplay(player, 'games_played', 0)}</b></span><span>RK <b>${numericCell(player.overallRank) > 0 ? `#${esc(player.overallRank)}` : '—'}</b></span></div>
    <div class="ss-identity-numbers"><div><small>POINTS / GAME</small><strong>${metricDisplay(player, 'ppg')}</strong><span>${ppg?.rank > 0 ? `${esc(player.pos)} #${ppg.rank}` : 'Unranked'}</span></div><div><small>SEASON FPTS</small><strong>${metricDisplay(player, 'fpts')}</strong><span>${fpts?.rank > 0 ? `${esc(player.pos)} #${fpts.rank}` : 'Unranked'}</span></div></div>
    ${projection ? `<div class="ss-identity-projection"><span>${projection.week ? `WK ${projection.week}` : 'UPCOMING'} PROJ</span><strong>${esc(projectionText(projection))}</strong><small>${esc(projection.matchup?.opponent || 'Opponent unavailable')}</small></div>` : ''}
  </article>`;
}

function rowMarkup(row) {
  const { cells, scale, key, label, description, direction, winner } = row;
  const delta = cells.every(cell => cell.value !== null) ? Math.abs(cells[0].value - cells[1].value) : null;
  // Small source ratios must never display a false zero difference. Keep
  // normal deltas compact and retain significant digits below 0.001.
  const compactDelta = delta === null ? null : Number(delta.toFixed(3)) || Number(delta.toPrecision(3));
  const deltaText = delta === null ? 'Unavailable' : scale.tied ? 'Equal' : `Δ ${compactDelta}${cells[0].display.endsWith('%') ? ' pp' : ''}`;
  return `<div class="ss-stat-row" data-stat-key="${esc(key)}" role="row">
    <div class="ss-stat-values">${cells.map((cell, index) => `<div class="ss-stat-value ss-side-${index} ${winner === index ? 'ss-leading' : ''} ${cell.value === null ? 'ss-missing' : ''}" role="cell"><strong>${esc(cell.display)}</strong><small>${cell.rank > 0 ? `#${cell.rank} ${direction === 'context' ? '' : 'POS'}` : '—'}</small></div>${index === 0 ? `<div class="ss-stat-label" role="rowheader" title="${esc(description)}${direction === 'lower' ? ' · Lower is better' : ''}"><span>${esc(label)}${direction === 'lower' ? '<i aria-label="Lower is better">↓</i>' : ''}</span><small>${esc(deltaText)}</small></div>` : ''}`).join('')}</div>
    <div class="ss-stat-plots${scale.signed ? ' ss-signed-plots' : ''}" aria-hidden="true">${cells.map((cell, index) => {
      const width = scale.widths[index];
      const left = scale.signed ? (cell.value < 0 ? 50 - width : 50) : 0;
      return `<div class="ss-stat-track ss-side-${index} ${scale.signed ? 'ss-signed-track' : ''} ${index === 0 && !scale.signed ? 'ss-mirrored-track' : ''}"><span style="left:${left}%;width:${width}%"></span>${cell.value === null ? '<i>NO DATA</i>' : ''}</div>`;
    }).join('')}</div>
    <div class="ss-stat-definition">${esc(description)}${direction === 'lower' ? ' · Lower is better' : ''}</div>
  </div>`;
}

export function comparisonMarkup(model, { selections = [], chartMode = 'weekly', showDefinitions = false } = {}) {
  const { players, samePosition, season, groups } = model;
  const legend = `<div class="ss-chart-legend">${players.map((player, index) => `<span class="ss-side-${index}"><i></i>${esc(player.shortName || player.name)}</span>`).join('')}</div>`;
  return `<div class="ss-dashboard${showDefinitions ? ' ss-show-definitions' : ''}">
    <div class="ss-context-bar"><span>${icon('layers')}${esc(season)} SEASON</span><span>${samePosition ? `${esc(players[0].pos)} · POSITIONAL VIEW` : 'ALL · OVERVIEW VIEW'}</span><span>${model.metricCount} METRICS</span></div>
    ${selections.length > 2 ? `<div class="ss-pair-picker"><span>Compare pair</span>${players.map((player, side) => `<label class="ss-side-${side}"><span>0${side + 1}</span><select data-ss-pair="${side}" aria-label="Player ${side + 1} to compare">${selections.map(selection => `<option value="${esc(selection.id)}" ${selection.id === player.id ? 'selected' : ''} ${selection.id === players[1 - side].id ? 'disabled' : ''}>${esc(selection.label)}</option>`).join('')}</select>${icon('chevron')}</label>`).join('')}</div>` : ''}
    <div class="ss-identities">${players.map(identityMarkup).join('')}<span class="ss-versus" aria-hidden="true">VS</span></div>
    <div class="ss-chart-grid">
      <section class="ss-panel ss-trajectory"><div class="ss-section-heading"><div><span class="ss-eyebrow">THE SEASON IN MOTION</span><h4>${icon('chart')}Scoring trajectory</h4></div><div class="ss-chart-switch" aria-label="Scoring chart view"><button type="button" data-ss-chart-mode="weekly" aria-pressed="${chartMode === 'weekly'}">Weekly</button><button type="button" data-ss-chart-mode="cumulative" aria-pressed="${chartMode === 'cumulative'}">Cumulative</button></div></div>${legend}<div class="ss-chart ss-weekly-chart" data-ss-chart="weekly" role="img" aria-label="${chartMode === 'cumulative' ? 'Cumulative' : 'Weekly'} fantasy scoring. Recorded weekly values are available in the table below."></div><div class="ss-chart-caption"><span>FPTS · league scoring</span><span>Gaps = no recorded result</span></div><details class="ss-weekly-values"><summary>Weekly values ${icon('chevron')}</summary><div data-ss-weekly-table></div></details></section>
      <section class="ss-panel ss-signature"><div class="ss-section-heading"><div><span class="ss-eyebrow">A DIFFERENT PERSPECTIVE</span><h4>${icon('target')}Season signature</h4></div><span class="ss-chart-label">PAIR SCALE</span></div><div class="ss-chart ss-profile-chart" data-ss-chart="profile" role="img" aria-label="Six season metrics scaled independently against the higher value in this pair; not a percentile or a player rating."></div><div class="ss-profile-readouts" data-ss-profile-values></div><p class="ss-profile-caption">Each axis: higher value in this pair = 100.<br>Shape shows relative values, not a rating.</p></section>
    </div>
    <div class="ss-breakdown-heading"><div><span class="ss-eyebrow">THE COMPLETE PICTURE</span><h4>Season stat comparison</h4></div><button type="button" class="ss-definitions-toggle" data-ss-definitions aria-pressed="${showDefinitions}">Definitions</button></div>
    <nav class="ss-section-nav" aria-label="Comparison stat sections">${groups.map((group, index) => `<button type="button" data-ss-jump="ss-section-${index}">${esc(group.label.replace(/ production| efficiency/ig, match => match.toLowerCase() === ' production' ? ' · volume' : ' · rates'))}<span>${group.rows.length}</span></button>`).join('')}</nav>
    <div class="ss-stat-guide"><span class="ss-side-0"><i></i>${esc(players[0].shortName || players[0].name)}</span><span>Value <b>·</b> positional rank</span><span class="ss-side-1">${esc(players[1].shortName || players[1].name)}<i></i></span></div>
    <div class="ss-stat-sections">${groups.map((group, index) => `<details class="ss-panel ss-stat-section ss-tone-${esc(group.tone || 'general')}" id="ss-section-${index}" open><summary><span class="ss-section-index">${String(index + 1).padStart(2, '0')}</span><span>${esc(group.label)}</span><small>${group.rows.length} stats</small>${icon('chevron')}</summary><div role="table" aria-label="${esc(group.label)} comparison"><div class="ss-sr-only" role="row"><span role="columnheader">${esc(players[0].name)}</span><span role="columnheader">Statistic and difference</span><span role="columnheader">${esc(players[1].name)}</span></div>${group.rows.map(rowMarkup).join('')}</div></details>`).join('')}</div>
    <div class="ss-method-note">${icon('orbit')}<div><strong>${samePosition ? 'Full positional Season view' : 'DataHub Overview stat set'}</strong><p>FPTS / PPG use your league scoring. Other values follow the selected season’s Game Logs source. Bar lengths compare this pair on the same scale; signed stats share a zero line. A lit value marks the higher value, or the lower value for ↓ stats. Missing values stay —. Ranks retain the Game Logs qualification rules.</p></div></div>
  </div>`;
}

let chartLibraryPromise;
export function loadDashboardCharts() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Charts require a browser.'));
  if (window.echarts) return Promise.resolve(window.echarts);
  if (!chartLibraryPromise) chartLibraryPromise = new Promise((resolve, reject) => {
    // Reuse the pinned local ECharts distribution, independent of LeagueHub's
    // runtime. Both dashboards may load at once without replacing global state.
    const script = document.createElement('script');
    script.src = new URL('./vendor/echarts-6.0.0.min.js', import.meta.url).href;
    script.onload = () => {
      if (window.echarts) resolve(window.echarts);
      else { script.remove(); chartLibraryPromise = null; reject(new Error('Chart renderer unavailable.')); }
    };
    script.onerror = () => { script.remove(); chartLibraryPromise = null; reject(new Error('Chart renderer could not load.')); };
    document.head.appendChild(script);
  });
  return chartLibraryPromise;
}

const linear = stops => ({ type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: stops.map(([offset, color]) => ({ offset, color })) });
const lineGradient = index => linear(index ? [[0, '#f0d6ff'], [.35, '#c4a6ff'], [.7, '#9d81f6'], [1, '#7d72dc']] : [[0, '#dbfffa'], [.32, '#90f6e5'], [.65, '#5bd4e3'], [1, '#4ca3d4']]);
const areaGradient = index => linear(index ? [[0, '#ac87ff42'], [.32, '#9d72fc26'], [.72, '#865af20e'], [1, '#7641ca00']] : [[0, '#68ecd73b'], [.3, '#43caca25'], [.68, '#369acd0d'], [1, '#2259ad00']]);

// Only completed CSV-backed weeks reach this function. Null results stay gaps
// in both line modes; cumulative means the sum of recorded scores to that week.
export function weeklyChartOption(model, mode = 'weekly') {
  const weeks = [...new Set(model.players.flatMap(player => player.weekly.map(row => row.week)))].sort((a, b) => a - b);
  const data = model.players.map(player => {
    const byWeek = new Map(player.weekly.map(row => [row.week, row.points]));
    let cumulative = 0;
    return weeks.map(week => {
      const value = numericCell(byWeek.get(week));
      if (value === null) return null;
      cumulative += value;
      return mode === 'cumulative' ? cumulative : value;
    });
  });
  return {
    animation: false, backgroundColor: 'transparent', color: COLORS,
    aria: { enabled: true }, textStyle: { fontFamily: '"Google Sans", "Product Sans", sans-serif' },
    grid: { left: 35, right: 16, top: 16, bottom: 28 },
    tooltip: { trigger: 'axis', confine: true, transitionDuration: 0, showDelay: 0, hideDelay: 0, backgroundColor: '#0a1226f5', borderColor: '#7388b94a', padding: [10, 12], textStyle: { color: '#e6efff', fontSize: 11 },
      extraCssText: 'border-radius:10px;box-shadow:0 10px 28px #02061080,inset 0 1px 0 #dafaff0d;backdrop-filter:blur(12px);background-image:linear-gradient(135deg,#172b3c77,#11192d55 50%,#2b234e55);font-variant-numeric:tabular-nums;',
      axisPointer: { type: 'line', animation: false, lineStyle: { color: '#a4b8e750', type: 'dashed' } },
      formatter: items => `<b>${esc(items[0]?.axisValue || '')}</b>${items.map(item => `<div style="margin-top:5px;color:${COLORS[item.seriesIndex]}">${esc(item.seriesName)} <b>${numericCell(item.value) === null ? '—' : fmt(item.value)} pts</b></div>`).join('')}` },
    xAxis: { type: 'category', data: weeks.map(week => `W${week}`), boundaryGap: weeks.length < 2, axisLine: { lineStyle: { color: '#8099c01e' } }, axisTick: { show: false }, axisLabel: { color: '#7f94b2', fontSize: 10, margin: 11, hideOverlap: true } },
    yAxis: { type: 'value', min: value => Math.min(0, Math.floor(value.min / 5) * 5), splitNumber: 4, axisLabel: { color: '#7f94b2', fontSize: 10 }, splitLine: { lineStyle: { color: '#8cafd610', type: 'dashed' } } },
    series: model.players.map((player, index) => ({ name: player.name, type: 'line', data: data[index], connectNulls: false, smooth: false,
      symbol: index ? 'diamond' : 'circle', symbolSize: 6, showSymbol: true,
      lineStyle: { width: 2.2, color: lineGradient(index), shadowColor: index ? '#b19bff45' : '#70e4e540', shadowBlur: 7 },
      itemStyle: { color: COLORS[index], borderColor: '#0e1a2b', borderWidth: 1.5 }, areaStyle: { color: areaGradient(index), origin: 0 },
      emphasis: { disabled: true }, animation: false, z: 3 - index,
    })),
  };
}

export function profileMetrics(model) {
  const preferred = model.samePosition ? ({
    QB: ['ppg', 'pa_ypg', 'cmp_pct', 'rush_yd', 'imp_per_g', 'ceiling'],
    RB: ['ppg', 'car_per_g', 'ypc', 'tgt_per_g', 'yprr', 'ceiling'],
    WR: ['ppg', 'tgt_per_g', 'yprr', 'ts_per_rr', 'rec_ypg', 'ceiling'],
    TE: ['ppg', 'tgt_per_g', 'yprr', 'ts_per_rr', 'rec_ypg', 'ceiling'],
  })[model.players[0].pos] : ['ppg', 'snp_pct', 'yds_total', 'imp', 'csty_pct', 'ceiling'];
  // The mixed-position radar follows the same Overview contract as the full
  // stat table, even when one of its preferred six axes is unavailable.
  const fallback = model.samePosition
    ? ['fpts', 'yds_total', 'snp_pct', 'imp_per_g', 'csty_pct', 'ceiling']
    : ['fpts', 'opp', 'ypg', 'td_total', 'tds_pct', 'imp_per_opp'];
  return [...new Set([...(preferred || fallback), ...fallback])].filter(key => model.players.every(player => numericCell(player.metrics[key]?.value) !== null && player.metrics[key].value >= 0)
    && model.players.some(player => player.metrics[key].value > 0)).slice(0, 6);
}

export function profileChartOption(model, keys = profileMetrics(model)) {
  return {
    animation: false, color: COLORS, backgroundColor: 'transparent', aria: { enabled: true },
    radar: { center: ['50%', '50%'], radius: '65%', splitNumber: 4,
      indicator: keys.map(key => ({ name: STAT_INFO[key]?.[0] || key, max: 100 })),
      axisName: { color: '#b0c0d8', fontSize: 10, fontFamily: '"Google Sans", sans-serif' }, axisNameGap: 9,
      splitArea: { areaStyle: { color: ['#7f96c506', '#7f96c50b', '#7f96c50f', '#7f96c513'] } },
      axisLine: { lineStyle: { color: '#8399c021' } }, splitLine: { lineStyle: { color: '#8399c02a', width: .7 } },
    },
    series: [{ type: 'radar', animation: false, emphasis: { disabled: true }, data: model.players.map((player, index) => ({
      name: player.name, value: keys.map(key => player.metrics[key].value / Math.max(...model.players.map(item => item.metrics[key].value)) * 100),
      symbol: index ? 'diamond' : 'circle', symbolSize: 4,
      lineStyle: { width: 1.8, color: lineGradient(index), shadowColor: `${COLORS[index]}35`, shadowBlur: 6 },
      itemStyle: { color: COLORS[index], borderColor: '#f0fbff', borderWidth: .5 }, areaStyle: { color: areaGradient(index), opacity: .9 },
    })) }],
  };
}

function weeklyTable(model) {
  const weeks = [...new Set(model.players.flatMap(player => player.weekly.map(row => row.week)))].sort((a, b) => a - b);
  return `<table><caption>Recorded weekly fantasy points · league scoring</caption><thead><tr><th scope="col">WK</th>${model.players.map(player => `<th scope="col">${esc(player.shortName || player.name)}</th>`).join('')}</tr></thead><tbody>${weeks.map(week => `<tr><th scope="row">${week}</th>${model.players.map(player => `<td>${fmt(player.weekly.find(row => row.week === week)?.points)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

// One lifecycle per open comparison: resize charts with their actual containers,
// cancel stale library loads and dispose every renderer/listener on close/re-pair.
export function mountComparison(root, model, callbacks = {}) {
  let destroyed = false;
  let chartMode = root.querySelector('[data-ss-chart-mode][aria-pressed="true"]')?.dataset.ssChartMode || 'weekly';
  let weeklyChart, profileChart, resizeObserver;
  const weeklyHost = root.querySelector('[data-ss-chart="weekly"]');
  const profileHost = root.querySelector('[data-ss-chart="profile"]');
  const keys = profileMetrics(model);
  const listener = event => {
    const playerButton = event.target.closest('[data-ss-player]');
    if (playerButton) callbacks.onPlayer?.(playerButton.dataset.ssPlayer);
    const modeButton = event.target.closest('[data-ss-chart-mode]');
    if (modeButton) {
      // Retain an early selection while the lazy chart renderer is loading.
      chartMode = modeButton.dataset.ssChartMode;
      root.querySelectorAll('[data-ss-chart-mode]').forEach(button => button.setAttribute('aria-pressed', String(button === modeButton)));
      weeklyHost.setAttribute('aria-label', `${chartMode === 'cumulative' ? 'Cumulative' : 'Weekly'} fantasy scoring. Recorded weekly values are available in the table below.`);
      weeklyChart?.setOption(weeklyChartOption(model, chartMode), true);
    }
    const definitions = event.target.closest('[data-ss-definitions]');
    if (definitions) {
      const active = root.classList.toggle('ss-show-definitions');
      definitions.setAttribute('aria-pressed', String(active));
    }
    const jump = event.target.closest('[data-ss-jump]');
    if (jump) {
      const target = root.querySelector(`#${jump.dataset.ssJump}`);
      if (target) { target.open = true; target.scrollIntoView({ behavior: 'auto', block: 'start' }); }
    }
  };
  const change = event => {
    if (event.target.matches('[data-ss-pair]')) callbacks.onPair?.(Number(event.target.dataset.ssPair), event.target.value);
  };
  root.addEventListener('click', listener);
  root.addEventListener('change', change);
  root.querySelector('[data-ss-weekly-table]').innerHTML = weeklyTable(model);
  root.querySelector('[data-ss-profile-values]').innerHTML = keys.map(key => `<div><span>${esc(STAT_INFO[key]?.[0] || key)}</span>${model.players.map((player, index) => `<strong class="ss-side-${index}">${esc(metricDisplay(player, key))}</strong>`).join('')}</div>`).join('');
  const hasWeekly = model.players.some(player => player.weekly.some(row => numericCell(row.points) !== null));
  profileHost.setAttribute('aria-label', `${keys.length} shared season metrics scaled independently against the higher value in this pair; not a percentile or a player rating. Exact values are shown alongside the chart.`);
  if (!hasWeekly) root.querySelectorAll('[data-ss-chart-mode]').forEach(button => { button.disabled = true; });
  if (!hasWeekly) weeklyHost.innerHTML = '<div class="ss-chart-empty">No recorded weekly results for this pair.</div>';
  if (keys.length < 3) profileHost.innerHTML = '<div class="ss-chart-empty">At least three shared season metrics are needed for a profile.</div>';
  if (hasWeekly || keys.length >= 3) loadDashboardCharts().then(echarts => {
    if (destroyed || !root.isConnected) return;
    if (hasWeekly) { weeklyChart = echarts.init(weeklyHost, null, { renderer: 'canvas' }); weeklyChart.setOption(weeklyChartOption(model, chartMode)); }
    if (keys.length >= 3) { profileChart = echarts.init(profileHost, null, { renderer: 'canvas' }); profileChart.setOption(profileChartOption(model, keys)); }
    resizeObserver = new ResizeObserver(() => {
      if (destroyed) return;
      weeklyChart?.resize({ animation: { duration: 0 } }); profileChart?.resize({ animation: { duration: 0 } });
    });
    resizeObserver.observe(weeklyHost); resizeObserver.observe(profileHost);
  }).catch(error => {
    if (destroyed) return;
    resizeObserver?.disconnect(); weeklyChart?.dispose(); profileChart?.dispose();
    weeklyChart = profileChart = null;
    console.warn('Rosters comparison chart unavailable.', error);
    [weeklyHost, profileHost].forEach(host => { host.innerHTML = '<div class="ss-chart-empty">Chart unavailable. Exact values are shown below.</div>'; });
  });
  return () => {
    if (destroyed) return;
    destroyed = true;
    resizeObserver?.disconnect(); weeklyChart?.dispose(); profileChart?.dispose();
    weeklyChart = profileChart = null;
    root.removeEventListener('click', listener); root.removeEventListener('change', change);
  };
}
