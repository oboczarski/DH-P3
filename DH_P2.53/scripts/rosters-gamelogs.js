/* Rosters-only Game Logs presentation.
 * Runs after app.js: the existing Rosters loaders retain season/scoring state,
 * while these page-local render adapters own the remaining visual differences.
 * Nothing here imports, fetches, or calls a DataHub module or stylesheet.
 */
(() => {
  if (document.body.dataset.page !== 'rosters') return;
  const modal = document.getElementById('game-logs-modal');
  if (!modal) return;

const stat = (abbr, name, aliases = [], note = "", tooltip = name) => ({ abbr, name, aliases, note, tooltip });

const ROSTERS_GAMELOG_STAT_SECTIONS = [
  { id: "general", label: "General", tone: "general", items: [
    stat("PLAYER", "Player Name"),
    stat("POS", "Position"),
    stat("TM", "Team"),
    stat("AGE", "Player Age"),
    stat("RK", "Overall Rank"),
    stat("G / Gs", "Games Played", ["G", "Gs", "GM_P", "games_played"]),
    stat("SNP%", "Snap Share", ["snp_pct"]),
    stat("YDS(t) / tYDS", "Total Yards", ["YDS(t)", "tYDS", "ttlYDS", "yds_total"]),
    stat("YPG(t)", "Total Yards per Game", ["ypg"]),
    stat("tTD", "Total Touchdowns", ["ttlTD"]),
    stat("OPP", "Opportunities", ["opp"], "Pass Attempts + carries + targets.",
      "Opportunities (paATT + CAR + TGT)"),
    // IMP header tooltip uses the requested shorthand; the key keeps its definition.
    stat("IMP", "Impact Plays", ["imp"], "First downs + touchdowns.", "Impact Plays (Total TD +1D)"),
    stat("IMP/G", "Impact Plays per Game", ["imp_per_g"], "",
      "Impact Plays per Game (Avg. # 1Ds + TDs per Game)"),
    stat("IMP/OPP", "Impact Plays per Opportunity", ["imp_per_opp"],
      "% of Pass Attempts, Rushes and Targets resulting in 1D or TD",
      "Impact Plays per Opportunity (% OPP resulting in 1D or TD)"),
    stat("FUM", "Fumbles Lost", ["fum"]),
    stat("SZN", "Season"),
    stat("WK · VS", "Week & Opponent", ["week"]),
  ] },
  { id: "fantasy", label: "Fantasy", tone: "fantasy", items: [
    stat("FPTS", "Fantasy Points", ["fpts", "FPTS_VALUE"], "PPR scoring."),
    stat("PPG", "Fantasy Points per Game", ["ppg", "PPG_VALUE"]),
    stat("FPOE", "Fantasy Points Over Expected", ["fpoe"]),
    stat("PROJ", "Projected Fantasy Points", ["proj"]),
    stat("CSTY%", "Consistency Rate", ["csty_pct"], "Share of games reaching the position’s scoring threshold."),
    stat("CL", "Ceiling", ["ceiling"], "AVG of Top 3 Games"),
    stat("FPTS POS·RK", "Fantasy Points Positional Rank", ["FPTS_POS_RK"]),
    stat("FPTS OVR·RK", "Fantasy Points Overall Rank", ["FPTS_OVR_RK"]),
    stat("PPG POS·RK", "Points per Game Positional Rank", ["PPG_POS_RK"]),
    stat("PPG OVR·RK", "Points per Game Overall Rank", ["PPG_OVR_RK"]),
  ] },
  { id: "passing", label: "Passing", tone: "passing", items: [
    stat("paATT", "Passing Attempts", ["pass_att"]),
    stat("CMP", "Completions", ["pass_cmp"]),
    stat("CMP%", "Completion Percentage", ["cmp_pct", "CMP PCT"]),
    stat("paYDS", "Passing Yards", ["pass_yd"]),
    stat("paYPG", "Passing Yards per Game", ["pa_ypg"]),
    stat("paTD", "Passing Touchdowns", ["pass_td"]),
    stat("pa1D", "Passing First Downs", ["pass_fd"]),
    stat("paRTG", "Passer Rating", ["pass_rtg"]),
    stat("YPA", "Passing Yards per Attempt"),
    stat("pIMP", "Passing Impact Plays", ["pass_imp"], "Passing first downs + passing touchdowns"),
    stat("pIMP/A / pIMP/ATT", "Passing Impact Plays per Attempt", ["pIMP/A", "pIMP/ATT", "pass_imp_per_att"],
      "% of Pass Attempts Resulting in 1D or TD", "Pass Impact Plays per Attempt (% Passes for 1D or TD)"),
    stat("INT", "Interceptions", ["pass_int"]),
    stat("SAC", "Sacks Taken", ["pass_sack"]),
    stat("EPA", "Expected Points Added", ["epa"]),
    stat("EPA/DB", "Expected Points Added per Dropback", ["epa_per_db"]),
    stat("CPOE", "Completion Percentage Over Expected", ["cpoe"]),
    stat("DB", "Dropbacks", ["dropbacks"]),
    stat("TTT", "Time to Throw", ["ttt"], "Seconds."),
    stat("PRS%", "Pressure Rate", ["prs_pct"]),
    stat("BLTZ%", "Blitz Rate", ["blitz_pct"]),
    stat("DP%", "Deep Pass Rate", ["dp_pct"]),
    stat("TmPa%", "Team Passing Share", ["team_pass_pct"]),
  ] },
  { id: "rushing", label: "Rushing", tone: "rushing", items: [
    stat("CAR", "Carries", ["rush_att"]),
    // Added RB Stats columns share the existing page glossary/header tooltips.
    stat("CAR/G", "Carries per Game", ["car_per_g"]),
    stat("ruYDS", "Rushing Yards", ["rush_yd"]),
    stat("ruYPG", "Rushing Yards per Game", ["ru_ypg"]),
    stat("ruTD", "Rushing Touchdowns", ["rush_td"]),
    stat("ru1D", "Rushing First Downs", ["rush_fd"]),
    // Impact definitions belong in their stat-family key sections; they add
    // reference text through the existing glossary renderer, not table columns.
    stat("ruIMP", "Rushing Impact Plays", [], "Rushing first downs + rushing touchdowns"),
    stat("YPC", "Yards per Carry", ["ypc"]),
    stat("MTF", "Missed Tackles Forced", ["mtf"]),
    stat("MTF/A", "Missed Tackles Forced per Attempt", ["mtf_per_att"]),
    stat("YBC", "Yards Before Contact", ["rush_ybc"]),
    stat("YBC/A", "Yards Before Contact per Attempt", ["ybc_per_att"]),
    stat("YCO", "Yards After Contact", ["rush_yac"]),
    stat("YCO/A", "Yards After Contact per Attempt", ["yco_per_att"]),
    stat("ELU", "Elusiveness Rating", ["elu"]),
    stat("EXPLSV%", "Explosive Rush Rate", ["ExplRu%", "expl_ru_pct"], "Share of carries gaining 10+ yards."),
    stat("RYOE", "Rushing Yards Over Expected", ["ryoe"]),
    stat("RYOE/A", "Rushing Yards Over Expected per Attempt", ["ryoe_per_att"]),
    stat("RZ·Att", "Red Zone Rushing Attempts", ["RZ Att", "rz_att"]),
    stat("GL·Att", "Goal Line Rushing Attempts", ["GL Att", "gl_att"]),
  ] },
  { id: "receiving", label: "Receiving", tone: "receiving", items: [
    stat("TGT", "Targets", ["rec_tgt"]),
    stat("TGT/G", "Targets per Game", ["tgt_per_g"]),
    stat("REC", "Receptions", ["rec"]),
    // Rosters retains its own definition for the added Season/Career rate.
    stat("REC/G", "Receptions per Game", ["rec_per_g"]),
    stat("recYDS", "Receiving Yards", ["rec_yd"]),
    stat("recYPG", "Receiving Yards per Game", ["rec_ypg"]),
    // Rosters keeps its own RB receiving help rather than importing DataHub's
    // glossary; these aliases cover the 2026 Season and weekly modal labels.
    stat("recYMS", "Receiving Yard Market Share", ["rec_yms"], "Percentage of team receiving yards."),
    // Rosters' independent help covers the current WR/TE additions.
    stat("recTMS", "Receiving Touchdown Market Share", ["rec_tms"], "Percentage of team receiving touchdowns."),
    stat("recTD", "Receiving Touchdowns", ["rec_td"]),
    stat("rec1D", "Receiving First Downs", ["rec_fd"]),
    stat("recIMP", "Receiving Impact Plays", [], "Receiving first downs + receiving touchdowns"),
    stat("RR", "Routes Run", ["rr"]),
    stat("RZ Tgt", "Red Zone Targets", ["rz_tgt"]),
    stat("10+ Tgt", "10+ Yard Targets", ["tgt_10_plus"]),
    stat("TS%", "Target Share", ["ts_per_rr"]),
    stat("TPRR", "Targets per Route Run", ["tprr"]),
    stat("TGT%", "Target Rate"),
    stat("YPR", "Yards per Reception", ["ypr"]),
    stat("YPRR", "Yards per Route Run", ["yprr"]),
    stat("1DRR", "First Downs per Route Run", ["first_down_rec_rate"]),
    stat("IMP/RR", "Impact Plays per Route Run"),
    stat("YAC", "Yards After Catch", ["rec_yar"]),
    stat("YACR", "Yards After Catch per Reception", ["rec_yacr"]),
    stat("AY", "Air Yards"),
    stat("AY%", "Air Yards Share", ["ay_pct"]),
    stat("AY/Tgt", "Air Yards per Target", ["ay_per_tgt"]),
    stat("tgtQBR", "Passer Rating When Targeted"),
    stat("CTST%", "Contested Catch Rate"),
    stat("DROP%", "Drop Rate"),
  ] },
];

const ROSTERS_GAMELOG_KEY_SECTIONS = [
  {
    id: "fantasy",
    label: "Fantasy",
    tone: "all",
    items: [
      { abbr: "FPOE", desc: "Fantasy Points Over Expected" },
      { abbr: "FPTS", desc: "Fantasy Points (PPR)" },
      { abbr: "PPG", desc: "Points Per Game" },
    ],
  },
  {
    id: "passing",
    label: "Passing",
    tone: "passing",
    items: [
      { abbr: "CMP", desc: "Completions" },
      { abbr: "CMP%", desc: "Completion Percentage" },
      { abbr: "CPOE", desc: "Completion Percentage Over Expected" },
      { abbr: "EPA/DB", desc: "Expected Points Added per Dropback" },
      { abbr: "INT", desc: "Interceptions" },
      { abbr: "pa1D", desc: "Passing First Downs" },
      { abbr: "paATT", desc: "Passing Attempts" },
      { abbr: "paRTG", desc: "Passer Rating" },
      { abbr: "paTD", desc: "Passing Touchdowns" },
      { abbr: "paYDS", desc: "Passing Yards" },
      { abbr: "pIMP", desc: "Passing Impact Plays" },
      { abbr: "pIMP/A", desc: "Passing Impact per Attempt" },
      { abbr: "PRS%", desc: "Pressure Rate" },
      { abbr: "SAC", desc: "Sacks Taken" },
      { abbr: "TTT", desc: "Time to Throw" },
    ],
  },
  {
    id: "rushing",
    label: "Rushing",
    tone: "rushing",
    items: [
      { abbr: "CAR", desc: "Carries" },
      { abbr: "ELU", desc: "Elusiveness Rating" },
      { abbr: "EXPLSV%", desc: "Explosive Rush Rate" },
      { abbr: "MTF", desc: "Missed Tackles Forced" },
      { abbr: "MTF/A", desc: "Missed Tackles per Attempt" },
      { abbr: "ru1D", desc: "Rushing First Downs" },
      { abbr: "ruTD", desc: "Rushing Touchdowns" },
      { abbr: "ruYDS", desc: "Rushing Yards" },
      { abbr: "YCO", desc: "Yards After Contact" },
      { abbr: "YCO/A", desc: "Yards After Contact per Attempt" },
      { abbr: "YPC", desc: "Yards per Carry" },
    ],
  },
  {
    id: "receiving",
    label: "Receiving",
    tone: "receiving",
    items: [
      { abbr: "1DRR", desc: "First Downs per Route Run" },
      // WR/TE additions also appear in the modal's full stat key.
      { abbr: "10+ Tgt", desc: "10+ Yard Targets" },
      { abbr: "AY%", desc: "Air Yards Share" },
      { abbr: "AY/Tgt", desc: "Air Yards per Target" },
      { abbr: "REC", desc: "Receptions" },
      { abbr: "REC/G", desc: "Receptions per Game" },
      { abbr: "rec1D", desc: "Receiving First Downs" },
      { abbr: "recTD", desc: "Receiving Touchdowns" },
      { abbr: "recYDS", desc: "Receiving Yards" },
      // Explain the expanded RB receiving columns in Rosters' own modal key.
      { abbr: "recYPG", desc: "Receiving Yards per Game" },
      { abbr: "recYMS", desc: "Receiving Yard Market Share" },
      { abbr: "recTMS", desc: "Receiving Touchdown Market Share" },
      { abbr: "RR", desc: "Routes Run" },
      { abbr: "RZ Tgt", desc: "Red Zone Targets" },
      { abbr: "TGT", desc: "Targets" },
      { abbr: "TGT/G", desc: "Targets per Game" },
      { abbr: "TPRR", desc: "Targets per Route Run" },
      { abbr: "TS%", desc: "Target Share" },
      { abbr: "YAC", desc: "Yards After Catch" },
      { abbr: "YACR", desc: "Yards After Catch per Reception" },
      { abbr: "YPR", desc: "Yards per Reception" },
      { abbr: "YPRR", desc: "Yards per Route Run" },
    ],
  },
  {
    id: "general",
    label: "General",
    tone: "all",
    items: [
      { abbr: "ADP", desc: "Average Draft Position" },
      { abbr: "AGE", desc: "Player Age" },
          { abbr: "CL", desc: "Ceiling · AVG of Top 3 Games" },
      { abbr: "CSTY%", desc: "Consistency Rate" },
      { abbr: "FUM", desc: "Fumbles Lost" },
      { abbr: "G", desc: "Games Played" },
      { abbr: "IMP", desc: "Impact Plays" },
      { abbr: "IMP/G", desc: "Impact Plays per Game" },
      { abbr: "IMP/OPP", desc: "Impact per Opportunity" },
      { abbr: "POS", desc: "Position" },
      { abbr: "POS·ADP", desc: "Positional ADP" },
      { abbr: "RK", desc: "Overall Rank" },
      { abbr: "SNP%", desc: "Snap Share" },
      { abbr: "TM", desc: "Team" },
      { abbr: "VALUE", desc: "Trade Value" },
      { abbr: "YDS(t)", desc: "Total Yards" },
      { abbr: "YPG(t)", desc: "Yards per Game (Total)" },
    ],
  },
];

  // Stat help is delegated within this modal so rebuilt weekly/Season/Career
  // content receives the same precise labels, including repeated Career YDS/TD.
  const definitions = new Map();
  ROSTERS_GAMELOG_STAT_SECTIONS.forEach(section => section.items.forEach(item => {
    [item.abbr, ...item.aliases].forEach(key => definitions.set(key, item));
  }));
  const setStatHelp = (element, key) => {
    const definition = definitions.get(key);
    if (element && definition) element.dataset.rostersStatName = definition.tooltip;
  };
  const seasonIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('rosters-modal-icon', 'gamelogs-szn-title-icon');
    svg.innerHTML = '<path d="M3 3v18h18"></path><path d="M7 16v-4"></path><path d="M12 16V8"></path><path d="M17 16v-7"></path>';
    return svg;
  };
  const decorateStatLabels = () => {
    modal.querySelectorAll('.game-logs-table th, .gamelogs-szn-label').forEach(element => {
      setStatHelp(element, element.textContent.trim());
    });
  };

  // Weekly table geometry is part of this page's presentation: assign the
  // reference widths to all three tables together, independent of TanStack's
  // default minimum size. Header/body/footer remain in one horizontal scroller.
  const ROSTERS_GAMELOG_COLUMN_WIDTHS = {
    week: 56,
    proj: 32,
    snp_pct: 44,
    ts_per_rr: 38,
    first_down_rec_rate: 30,
    yds_total: 37,
    rush_att: 34,
    rush_td: 35,
    rush_yd: 44,
    rec_tgt: 41,
    rec: 36,
    rec_yd: 38,
    rec_td: 44,
    ypr: 40,
    yprr: 42,
    // Match the renderer's compact widths for current receiving additions.
    tprr: 44,
    rec_yacr: 44,
    rz_tgt: 54,
    tgt_10_plus: 60,
    ay_pct: 44,
    rec_yms: 58,
    rec_tms: 58,
    ryoe_per_att: 56,
    rz_att: 50,
    gl_att: 50,
    expl_ru_pct: 58,
    imp_per_g: 45,
    pass_rtg: 48,
    pass_yd: 40,
    pass_td: 36,
    pass_att: 38,
    pass_cmp: 38,
    pass_imp_per_att: 44,
    epa: 42,
    blitz_pct: 48,
    dropbacks: 38,
    team_pass_pct: 52,
    prs_pct: 42,
    ttt: 38,
    yco_per_att: 44,
    ypc: 40,
    mtf_per_att: 44,
    fpts: 45,
    ktc: 80,
    pass_fd: 36,
    pass_imp: 36,
    pass_int: 34,
    pass_sack: 34,
    rush_fd: 36,
    mtf: 36,
    elu: 36,
    rush_yac: 36,
    rec_fd: 36,
    rec_yar: 36,
    rr: 36,
    imp: 36,
    fum: 36,
    fpoe: 36,
    ypg: 36,
    pa_ypg: 36,
    ru_ypg: 36,
    rec_ypg: 36,
  };
  const decorateWeeklyTable = () => {
    const headers = [...modal.querySelectorAll('.game-logs-table-header th')];
    if (!headers.length) return;
    const labels = buildStatLabels();
    const keysByLabel = new Map(Object.entries(labels).map(([key, label]) => [label, key]));
    keysByLabel.set('RZ·Att', 'rz_att');
    keysByLabel.set('GL·Att', 'gl_att');
    const keys = headers.map((header, index) => index === 0 ? 'week' : keysByLabel.get(header.textContent.trim()));
    // The current WR/TE schema includes 10+ Tgt and three-decimal 1DRR.
    // Preserve its extra rate width across header/body/footer decoration.
    const isExpandedReceivingTable = keys.includes('tgt_10_plus');
    const sizes = keys.map(key => key === 'first_down_rec_rate' && isExpandedReceivingTable
      ? 44 : ROSTERS_GAMELOG_COLUMN_WIDTHS[key] || 54);
    modal.querySelectorAll('.game-logs-table').forEach(table => {
      const total = `${sizes.reduce((sum, size) => sum + size, 0)}px`;
      table.style.width = total;
      table.style.minWidth = total;
      table.querySelectorAll('colgroup col').forEach((col, index) => { col.style.width = `${sizes[index]}px`; });
      table.querySelectorAll('tr').forEach(row => {
        if (row.children.length !== headers.length) return;
        [...row.children].forEach((cell, index) => {
          const width = `${sizes[index]}px`;
          Object.assign(cell.style, { width, minWidth: width, maxWidth: width });
          if (cell.tagName === 'TH') setStatHelp(cell, keys[index]);
        });
      });
    });
    // Opponent ranks use true ordinal suffixes (1st/2nd/3rd/11th), matching
    // the reference tags without changing the rank or matchup data.
    modal.querySelectorAll('.gamelog-week-tag-rank').forEach(element => {
      const number = Number(element.querySelector('.gamelog-week-tag-rank-number')?.textContent);
      const suffix = element.querySelector('.gamelog-week-tag-rank-suffix');
      if (suffix && Number.isFinite(number) && number > 0) suffix.textContent = ordinalSuffix(number).slice(String(number).length);
    });
  };

  // Year selection applies to GameLog/Season. Career has its own full history,
  // so its year capsule is quiet and cannot open a misleading year menu.
  const syncYearControl = () => {
    const toggle = modal.querySelector('#gamelogsSeasonToggle');
    if (!toggle) return;
    const yearBacked = state.currentGameLogsView !== 'career';
    toggle.classList.toggle('is-active', yearBacked);
    toggle.classList.toggle('is-disabled', !yearBacked);
    toggle.setAttribute('aria-disabled', String(!yearBacked));
    if (!yearBacked) closeGameLogsSeasonMenu();
  };
  const originalSetView = window.setGameLogsModalView;
  window.setGameLogsModalView = function(view) {
    const result = originalSetView(view);
    syncYearControl();
    hideTooltip();
    return result;
  };
  const originalToggleSeasonMenu = window.toggleGameLogsSeasonMenu;
  window.toggleGameLogsSeasonMenu = function() {
    if (state.currentGameLogsView === 'career') return;
    return originalToggleSeasonMenu();
  };

  // These adapters run as part of each render, including asynchronous season
  // changes; stale responses keep the shared request guard and never decorate
  // a newer player's content. Existing values/ranks/scoring are preserved.
  const originalSeasonRender = window.renderGameLogsSeasonStatsView;
  window.renderGameLogsSeasonStatsView = function(options) {
    const result = originalSeasonRender(options);
    options?.container?.querySelector('.gamelogs-szn-title-icon')?.replaceWith(seasonIcon());
    decorateStatLabels();
    // The Season container is initially detached during the weekly render.
    options?.container?.querySelectorAll('.gamelogs-szn-label').forEach(element => setStatHelp(element, element.textContent.trim()));
    return result;
  };
  const originalCareerRender = window.renderGameLogsCareerStatsView;
  window.renderGameLogsCareerStatsView = async function(options) {
    await originalCareerRender(options);
    if (!options?.container?.isConnected) return;
    const sections = getCareerDisplaySections(getCareerSectionsForPosition(options.player?.pos));
    for (const [selector, isFrozen] of [['.career-stats-frozen-pane', true], ['.career-stats-scroll-pane', false]]) {
      const keys = sections.filter(section => (section.id === 'season') === isFrozen).flatMap(section => section.stats);
      options.container.querySelectorAll(`${selector} .career-stats-header`).forEach((element, index) => setStatHelp(element, keys[index]));
    }
  };
  const originalGameLogsRender = window.renderGameLogs;
  window.renderGameLogs = async function(...args) {
    await originalGameLogsRender(...args);
    const requestSeq = args[3];
    if (Number.isFinite(requestSeq) && requestSeq !== gameLogsModalRequestSeq) return;
    decorateStatLabels();
    decorateWeeklyTable();
    decorateVitals(modal.querySelector('#modal-player-vitals'), args[1]?.pos);
    syncYearControl();
  };

  // Game Logs uses the reference's three-color vitals scale. Read the already
  // rendered values; the roster cards keep their existing position-specific
  // scale and neither the player data nor its formatting changes.
  function decorateVitals(container, position) {
    const pos = String(position || '').trim().toUpperCase();
    container?.querySelectorAll('.player-vitals__item').forEach(item => {
      const label = item.querySelector('.player-vitals__label')?.textContent;
      const value = item.querySelector('.player-vitals__value');
      if (!value || !['AGE', 'HEIGHT', 'WEIGHT'].includes(label)) return;
      const raw = value.textContent.trim();
      let color = '';
      if (label === 'AGE') {
        const age = Number.parseFloat(raw);
        if (Number.isFinite(age)) {
          if (pos === 'RB') color = age <= 24 ? '#96f2ceb9' : age < 28 ? '#84b8fbff' : '#f7a3ebdf';
          else if (pos === 'WR' || pos === 'TE') color = age < 26 ? '#96f2ceb9' : age < 30 ? '#84b8fbff' : '#f7a3ebdf';
          else if (pos === 'QB') color = age < 29 ? '#96f2ceb9' : age < 36 ? '#84b8fbff' : '#f7a3ebdf';
        }
      } else if (label === 'HEIGHT') {
        const match = raw.match(/(\d+)'(\d+)/);
        if (match) color = Number(match[1]) * 12 + Number(match[2]) >= 72 ? '#96f2ceb9' : '#84b8fbff';
      } else {
        const weight = Number.parseInt(raw, 10);
        if (Number.isFinite(weight)) color = weight >= 210 ? '#96f2ceb9' : '#84b8fbff';
      }
      value.style.color = color;
    });
  }
  const originalOwnershipRender = window.renderOwnershipInGameLogsPane;
  window.renderOwnershipInGameLogsPane = function(playerId) {
    const result = originalOwnershipRender(playerId);
    decorateVitals(modal.querySelector('#glOwnershipPlayerVitals'), getOwnershipModalPlayerSummary(playerId)?.pos);
    // Keep Ownership's vitals capsule aligned with its three summary chips,
    // matching the Player Data header at either responsive size.
    const vitals = modal.querySelector('#glOwnershipPlayerVitals .player-vitals--modal');
    const width = modal.querySelector('#glOwnershipSummaryChips')?.offsetWidth;
    if (vitals && width > 0) vitals.style.width = `${width}px`;
    return result;
  };

  // Rosters Performance mirrors the same-position comparison stat order,
  // with its own renderer/formatting. Shared Stats-page radars stay unchanged.
  const ROSTERS_RADAR_STATS_CONFIG = {
  QB: {
    stats: ["fpts", "ppg", "cmp_pct", "pass_rtg", "epa_per_db", "cpoe", "ttt", "pass_yd", "rush_yd", "imp", "team_pass_pct", "csty_pct", "ceiling"],
    labels: ["FPTS", "PPG", "CMP%", "paRTG", "EPA/DB", "CPOE", "TTT", "paYDS", "ruYDS", "IMP(TD+1D)", "TmPa%", "CSTY%", "CL"],
    maxRank: 36,
  },
  RB: {
    stats: ["fpts", "ppg", "snp_pct", "ypc", "mtf_per_att", "yco_per_att", "expl_ru_pct", "ts_per_rr", "yprr", "imp", "yds_total", "csty_pct", "ceiling"],
    labels: ["FPTS", "PPG", "SNP%", "YPC", "MTF/A", "YCO/A", "EXPLSV%", "TS%", "YPRR", "IMP(TD+1D)", "YDS(t)", "CSTY%", "CL"],
    maxRank: 48,
  },
  WR: {
    stats: ["fpts", "ppg", "yds_total", "imp", "rec_tgt", "ts_per_rr", "rec", "yprr", "rec_yar", "rec_yms", "csty_pct", "ceiling"],
    labels: ["FPTS", "PPG", "YDS(t)", "IMP(TD+1D)", "TGT", "TS%", "REC", "YPRR", "YAC", "recYMS", "CSTY%", "CL"],
    maxRank: 72,
  },
  TE: {
    stats: ["fpts", "ppg", "yds_total", "imp", "rec_tgt", "ts_per_rr", "rec", "yprr", "rec_yar", "rec_yms", "csty_pct", "ceiling"],
    labels: ["FPTS", "PPG", "YDS(t)", "IMP(TD+1D)", "TGT", "TS%", "REC", "YPRR", "YAC", "recYMS", "CSTY%", "CL"],
    maxRank: 24,
  },
};

function formatRostersRadarStatValue(statKey, value) {
  // Performance axes retain whole-number totals and the source's percentage
  // units; the precision matches the comparison Season radar for every stat.
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return typeof value === "string" ? value : "N/A";
  if (["cmp_pct", "snp_pct", "ts_per_rr", "prs_pct", "csty_pct", "rec_yms", "team_pass_pct"].includes(statKey)) return `${numericValue.toFixed(1)}%`;
  if (statKey === "expl_ru_pct") return `${numericValue.toFixed(2)}%`;
  if (statKey === "cpoe") return `${numericValue > 0 ? "+" : ""}${numericValue.toFixed(1)}%`;
  if (statKey === "epa_per_db") return `${numericValue > 0 ? "+" : ""}${numericValue.toFixed(2)}`;
  if (["fpts", "ppg", "pass_rtg", "rec_ypg", "ceiling"].includes(statKey)) return numericValue.toFixed(1);
  if (["rec", "rec_tgt", "yds_total", "imp", "pass_yd", "rush_yd", "rec_yar"].includes(statKey)) return String(Math.round(numericValue));
  return numericValue.toFixed(2);
}

const rostersPlayerRadarLabelPlugin = {
  id: "rostersPlayerRadarLabels",
  afterDatasetsDraw(chart, args, options) {
    const dataset = chart.data.datasets[0];
    const scale = chart.scales?.r;
    if (!dataset?.data || !scale) return;
    const { ctx } = chart;
    // Below 320 canvas pixels, smaller ranks and a capped offset prevent
    // the 13-axis rank suffixes from touching the outside stat/value groups.
    const compact = chart.width < 320;
    const fontSize = compact ? 9 : chart.width < 420 ? 11 : 12;
    ctx.save();
    ctx.font = `${fontSize}px "Product Sans", "Google Sans", sans-serif`;
    ctx.textBaseline = "middle";
    dataset.data.forEach((value, index) => {
      const angle = -Math.PI / 2 + Math.PI * 2 * index / dataset.data.length;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      // Dense 12/13-axis Performance ranks follow the axis angle, rather
      // than the original eight-axis offsets. A minimum radius clears the
      // center when several stats have unavailable or low positional ranks.
      const offset = sin < -0.3 ? 8 : (sin > 0.3 && Math.abs(cos) > 0.3 ? 13 : 15);
      const rankRadius = Math.max(compact ? 34 : 40, scale.getDistanceFromCenterForValue(value) + offset);
      const radius = compact ? Math.min(scale.drawingArea * 0.95, rankRadius) : rankRadius;
      const x = scale.xCenter + cos * radius, y = scale.yCenter + sin * radius;
      const rank = dataset.rawRanks?.[index];
      ctx.fillStyle = getConditionalColorByRank(rank, dataset.position);
      const number = Number.isFinite(rank) ? String(Math.round(rank)) : "NA";
      const suffix = Number.isFinite(rank) ? ordinalSuffix(Math.round(rank)).replace(/^\d+/, "") : "";
      ctx.font = `${fontSize}px "Product Sans", "Google Sans", sans-serif`;
      const numberWidth = ctx.measureText(number).width;
      ctx.font = `${fontSize * 0.7}px "Product Sans", "Google Sans", sans-serif`;
      const suffixWidth = suffix ? ctx.measureText(suffix).width + 1 : 0;
      const width = numberWidth + suffixWidth;
      const left = x - width / 2;
      ctx.textAlign = "left";
      ctx.font = `${fontSize}px "Product Sans", "Google Sans", sans-serif`;
      ctx.fillText(number, left, y);
      ctx.font = `${fontSize * 0.7}px "Product Sans", "Google Sans", sans-serif`;
      if (suffix) ctx.fillText(suffix, left + numberWidth + 1, y - 2);
    });
    ctx.restore();
  },
};

const rostersPlayerRadarAxisLabelsPlugin = {
  id: "rostersPlayerRadarAxisLabels",
  afterDraw(chart, args, options) {
    const scale = chart.scales?.r;
    const dataset = chart.data.datasets[0];
    if (!scale || !dataset) return;
    const { ctx } = chart;
    const narrow = chart.width < 420;
    const compact = chart.width < 320;
    const labelSize = compact ? 10 : narrow ? 11 : 12;
    const valueSize = compact ? 9 : narrow ? 10 : 11;
    const labelFont = `500 ${labelSize}px "Product Sans", "Google Sans", sans-serif`;
    const noteFont = `300 ${labelSize * 0.85}px "Product Sans", "Google Sans", sans-serif`;
    ctx.save();
    chart.data.labels.forEach((label, index) => {
      const angle = -Math.PI / 2 + Math.PI * 2 * index / chart.data.labels.length;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      // Performance labels use outward alignment by angle, keeping adjacent
      // bottom axes separate even on narrow phones. The lower groups move
      // inward slightly to reserve space for the value's second line.
      const radius = scale.drawingArea + (narrow ? 12 : 16)
        + ((sin < 0 ? 2 : -3) + (compact ? 4 : 0)) * Math.pow(Math.abs(sin), 4);
      const x = scale.xCenter + cos * radius, y = scale.yCenter + sin * radius;
      const align = cos > 0.18 ? "left" : cos < -0.18 ? "right" : "center";
      const statKey = dataset.statKeys[index];
      ctx.font = labelFont;
      ctx.textAlign = align;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#EAEBF0";
      if (statKey === "imp") {
        // Draw IMP and its parenthetical explanation independently so the
        // requested TD+1D suffix is visibly lighter without widening the axis.
        const mainWidth = ctx.measureText("IMP").width;
        ctx.font = noteFont;
        const noteWidth = ctx.measureText("(TD+1D)").width;
        const width = mainWidth + noteWidth;
        const left = align === "right" ? x - width : align === "center" ? x - width / 2 : x;
        ctx.textAlign = "left";
        ctx.font = labelFont;
        ctx.fillText("IMP", left, y);
        ctx.font = noteFont;
        ctx.fillText("(TD+1D)", left + mainWidth, y);
      } else {
        ctx.fillText(label, x, y);
      }
      ctx.textAlign = align;
      ctx.textBaseline = "top";
      ctx.font = `${valueSize}px "Product Sans", "Google Sans", sans-serif`;
      ctx.fillStyle = getConditionalColorByRank(dataset.rawRanks[index], dataset.position);
      ctx.fillText(`• ${formatRostersRadarStatValue(statKey, dataset.statValues[index])} •`, x, y + 3);
    });
    ctx.restore();
  },
};

window.renderPlayerRadarChart = function(playerId, position) {
  const container = modal.querySelector(".radar-chart-content");
  if (!container) return;

  container._chartInstance?.destroy();
  container._chartInstance = null;
  container.innerHTML = "";
  const radarData = getPlayerRadarData(playerId, position, ROSTERS_RADAR_STATS_CONFIG[position]);
  if (!radarData || !window.Chart) {
    container.innerHTML = '<p class="no-data-message">No radar data available for this position.</p>';
    return;
  }

  // Newly displayed source-backed season metrics bypass weekly footer sums.
  const seasonTotals = state.playerSeasonStats?.[playerId] || {};
  const sourceStatKeys = ["imp", "pass_yd", "rush_yd", "rec_yar", "rec_yms", "team_pass_pct", "csty_pct", "ceiling", "yprr", "expl_ru_pct"];
  radarData.statValues = radarData.statKeys.map((key, index) => sourceStatKeys.includes(key)
    ? (seasonTotals[key] ?? null) : radarData.statValues[index]);

  const canvas = document.createElement("canvas");
  canvas.id = "player-radar-canvas";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  // Reserve room for both outside text lines at every canvas width. Chart.js
  // recalculates its radius on resize; label placement uses actual chart size.
  const radarLayoutPadding = { top: 34, bottom: 36, left: 76, right: 76 };
  const scaleMax = 100;

  container._chartInstance = new window.Chart(ctx, {
    type: "radar",
    data: {
      labels: radarData.labels,
      datasets: [{
        label: "Player Rank",
        data: radarData.ranks,
        rawRanks: radarData.rawRanks,
        statValues: radarData.statValues,
        statKeys: radarData.statKeys,
        position,
        fill: true,
        backgroundColor: "rgba(83, 0, 255, 0.33)",
        borderColor: "#6700ff",
        borderWidth: 2,
        pointBackgroundColor: "#6300ff",
        pointBorderColor: "#0D0E1B",
        pointRadius: 4.5,
        analyzerLabels: true,
        order: 2,
      }],
    },
    options: {
      responsive: true,
      // Very narrow canvases need less side padding as their label fonts shrink;
      // update it on resize too, so rotating a phone keeps the axes fitted.
      onResize(chart, size) {
        const sidePadding = size.width < 320 ? 66 : 76;
        chart.options.layout.padding.left = sidePadding;
        chart.options.layout.padding.right = sidePadding;
      },
      maintainAspectRatio: false,
      events: [],
      layout: {
        padding: radarLayoutPadding,
      },
      elements: {
        line: { tension: 0.4 },
      },
      scales: {
        r: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: scaleMax,
          max: scaleMax,
          grid: { display: false },
          angleLines: { display: false },
          ticks: { display: false },
          pointLabels: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        playerRadarBackground: {
          levels: [
            { ratio: 0.95, fill: "#2c334f62", stroke: "#525a7739", lineWidth: 1 },
            { ratio: 0.75, fill: "#2D345153", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.55, fill: "#2F365250", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.35, fill: "#30375455", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.18, fill: "#31385565", stroke: "#525a7735", lineWidth: 1 },
          ],
        },
        rostersPlayerRadarLabels: {},
        rostersPlayerRadarAxisLabels: {},
      },
    },
    plugins: [playerRadarBackgroundPlugin, rostersPlayerRadarLabelPlugin, rostersPlayerRadarAxisLabelsPlugin],
  });

  const scale = container._chartInstance.scales?.r;
  if (scale) {
    const gradient = ctx.createRadialGradient(scale.xCenter, scale.yCenter, 0, scale.xCenter, scale.yCenter, scale.drawingArea);
    gradient.addColorStop(0, "rgba(121, 0, 245, 0.13)");
    gradient.addColorStop(0.4, "rgba(92, 0, 255, 0.20)");
    gradient.addColorStop(0.78, "rgba(75, 0, 255, 0.34)");
    gradient.addColorStop(1, "rgba(34, 0, 255, 0.91)");
    container._chartInstance.data.datasets[0].backgroundColor = gradient;
    container._chartInstance.update("none");
  }
};

  // Rebuild only the Game Logs Key. Rosters' comparison key and other page
  // help retain their current definitions and markup.
  const keyBody = modal.querySelector('[data-stats-key-body="gamelogs"]');
  if (keyBody) {
    keyBody.replaceChildren();
    const sections = document.createElement('div');
    sections.className = 'stats-key-sections';
    ROSTERS_GAMELOG_KEY_SECTIONS.forEach(section => {
      const card = document.createElement('section');
      card.className = `stats-key-section stats-key-section--${section.tone}`;
      const heading = document.createElement('div');
      heading.className = `stats-key-section-header stats-key-section-header--${section.tone}`;
      heading.textContent = section.label;
      const body = document.createElement('div');
      body.className = 'stats-key-section-body';
      section.items.slice().sort((a, b) => a.abbr.localeCompare(b.abbr, undefined, { numeric: true, sensitivity: 'base' })).forEach(item => {
        const row = document.createElement('div');
        row.className = 'stats-key-item';
        const abbr = document.createElement('span');
        abbr.className = 'stats-key-abbr';
        abbr.textContent = item.abbr;
        const description = document.createElement('span');
        description.className = 'stats-key-desc';
        description.textContent = item.desc;
        row.append(abbr, description);
        body.append(row);
      });
      card.append(heading, body);
      sections.append(card);
    });
    keyBody.append(sections);
  }

  // The help surface lives at body level to clear all frozen panes and scroll
  // containers. It is visible only for desktop mouse/keyboard interactions.
  const tooltip = document.createElement('div');
  tooltip.id = 'rosters-gamelogs-stat-tooltip';
  tooltip.className = 'rosters-gamelogs-stat-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);
  const desktopHover = window.matchMedia('(min-width: 720px) and (hover: hover) and (pointer: fine)');
  let activeHeader = null;
  let showTimer = 0;
  function hideTooltip() {
    window.clearTimeout(showTimer);
    if (activeHeader) {
      const ids = (activeHeader.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== tooltip.id);
      if (ids.length) activeHeader.setAttribute('aria-describedby', ids.join(' '));
      else activeHeader.removeAttribute('aria-describedby');
    }
    activeHeader = null;
    tooltip.hidden = true;
  }
  const showTooltip = header => {
    if (!desktopHover.matches || modal.classList.contains('hidden')) return;
    hideTooltip();
    activeHeader = header;
    showTimer = window.setTimeout(() => {
      if (!header.isConnected || modal.classList.contains('hidden')) return hideTooltip();
      tooltip.textContent = header.dataset.rostersStatName;
      tooltip.hidden = false;
      const rect = header.getBoundingClientRect();
      const tip = tooltip.getBoundingClientRect();
      const left = Math.max(12, Math.min(rect.left + rect.width / 2 - tip.width / 2, window.innerWidth - tip.width - 12));
      const top = rect.top >= tip.height + 20 ? rect.top - tip.height - 10 : rect.bottom + 10;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.min(top, window.innerHeight - tip.height - 12)}px`;
      const ids = new Set((header.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      ids.add(tooltip.id);
      header.setAttribute('aria-describedby', [...ids].join(' '));
    }, 180);
  };
  const findHeader = target => target?.closest?.('[data-rosters-stat-name]');
  modal.addEventListener('pointerover', event => {
    const header = findHeader(event.target);
    if (event.pointerType !== 'touch' && header && !header.contains(event.relatedTarget)) showTooltip(header);
  });
  modal.addEventListener('pointerout', event => {
    const header = findHeader(event.target);
    if (header === activeHeader && !header?.contains(event.relatedTarget)) hideTooltip();
  });
  modal.addEventListener('focusin', event => { const header = findHeader(event.target); if (header) showTooltip(header); });
  modal.addEventListener('focusout', event => { if (findHeader(event.target) === activeHeader) hideTooltip(); });
  document.addEventListener('scroll', hideTooltip, true);
  document.addEventListener('click', hideTooltip);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hideTooltip(); });
  window.addEventListener('resize', hideTooltip);
  desktopHover.addEventListener('change', hideTooltip);
  syncYearControl();
})();
