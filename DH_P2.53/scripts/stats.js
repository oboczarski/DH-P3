(function () {
  if (typeof document === 'undefined') return;
  const root = document.body;
  if (!root || root.dataset.page !== 'stats') return;
  // === Stats page: data sources (PF-02) ===
  // Table (this file):
  // - Base season totals: `../data/NFL-2025_Stats/SZN.csv` (shipped with the app)
  // - Trade VALUE + pick values (RDP): KTC workbook tabs `KTC_1QB` / `KTC_SFLX` loaded by `fetchDataFromGoogleSheet()` in `app.js`
  // - Rollback: `?statsTableSource=sheets` will use legacy `STAT_1QB` / `STAT_SFLX` Google Sheets for the main table.
  //
  // Game Logs modal (shared, in `app.js`):
  // - Weekly/season detail stats are still loaded via the existing `fetchPlayerStatsSheets()` pipeline.
  // - League-specific FPTS/PPG/rank logic is untouched (critical for Rosters page).
  const TAB_CONFIG = {
    oneQb: { sheet: 'STAT_1QB', headingSelector: '[data-tab-heading="oneQb"]' },
    sflx: { sheet: 'STAT_SFLX', headingSelector: '[data-tab-heading="sflx"]' }
  };
  const HEADER_ALIASES = new Map([
    ['PLAYER NAME', 'PLAYER'],
    // Season totals CSV uses `NM` for player name; treat it as PLAYER.
    ['NM', 'PLAYER'],
    ['POS RK', 'POS | RK'],
    ['POS·RK', 'POS | RK'],
    ['POS_RK', 'POS | RK'],
    ['TEAM', 'TM'],
    ['FPTS_PPR', 'FPTS'],
    ['FPT_PPR', 'FPTS'],
    // Season totals CSV uses `GM_P` for games played; treat it as `G` for the table.
    ['GM_P', 'G'],
    ['CMP PCT', 'CMP%'],
    // Stats page table: normalize both old and new explosive-rush headers to the new EXPLSV% label.
    ['ExplRu%', 'EXPLSV%'],
    ['YDS(T)', 'YDS(t)'],
    ['YPG(T)', 'YPG(t)'],
    ['IMP/OPP', 'IMP/OPP']
  ]);
  const COLUMN_SETS = {
    default: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'G', 'SNP%', 'YDS(t)', 'YPG(t)', 'OPP', 'IMP', 'IMP/OPP', 'CSTY%', 'CL'],
    QB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'paYDS', 'paTD', 'CMP%', 'paATT', 'paRTG', 'EPA/DB', 'CPOE', 'CMP', 'YDS(t)', 'paYPG', 'ruYDS', 'ruTD', 'pa1D', 'IMP/G', 'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    // RB rushing view: keep EXPLSV% with the other rushing-efficiency columns, immediately after YCO.
    RB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'SNP%', 'CAR', 'ruYDS', 'YPC', 'ruTD', 'REC', 'recYDS', 'TGT', 'YDS(t)', 'ruYPG', 'ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'EXPLSV%', 'ru1D', 'RYOE', 'recTD', 'rec1D', 'YAC', 'IMP/G', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    // Receiving filters (WR/TE): keep red-zone targets directly after total yards for quick usage context.
    WR: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'AY%', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'RZ Tgt', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM', 'CSTY%', 'CL'],
    TE: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'AY%', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'RZ Tgt', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM', 'CSTY%', 'CL'],
    RDP: ['RK', 'YEAR', 'RANGE', 'ROUND', 'VALUE', 'POS', 'AGE', 'TM', 'G', 'FPTS', 'PPG']
  };
  const COLUMN_CATEGORY = {
    'FPTS': 'all',
    'PPG': 'all',
    'VALUE': 'all',
    'ADP': 'all',
    'POS·ADP': 'all',
    'YDS(t)': 'all',
    'YPG(t)': 'all',
    'OPP': 'all',
    'IMP': 'all',
    'IMP/OPP': 'all',
    'RK': 'all',
    'PLAYER': 'all',
    'POS': 'all',
    'TM': 'all',
    'AGE': 'all',
    'G': 'all',
    'SNP%': 'all',
    'TGT': 'receiving',
    'REC': 'receiving',
    'TS%': 'receiving',
    'recYDS': 'receiving',
    'recTD': 'receiving',
    'YPRR': 'receiving',
    'rec1D': 'receiving',
    '1DRR': 'receiving',
    'recYPG': 'receiving',
    'YAC': 'receiving',
    'YPR': 'receiving',
    'RR': 'receiving',
    'RZ Tgt': 'receiving',
    'paRTG': 'passing',
    'EPA/DB': 'passing',
    'CPOE': 'passing',
    'paYDS': 'passing',
    'paTD': 'passing',
    'CMP%': 'passing',
    'paATT': 'passing',
    'CMP': 'passing',
    'pa1D': 'passing',
    'paYPG': 'passing',
    'pIMP': 'passing',
    'pIMP/A': 'passing',
    'TTT': 'passing',
    'PRS%': 'passing',
    'SAC': 'passing',
    'INT': 'passing',
    'ruYDS': 'rushing',
    'ruTD': 'rushing',
    'ruYPG': 'rushing',
    'ru1D': 'rushing',
    'RYOE': 'rushing',
    'CAR': 'rushing',
    'YPC': 'rushing',
    'ELU': 'rushing',
    'MTF/A': 'rushing',
    'YCO/A': 'rushing',
    'MTF': 'rushing',
    'YCO': 'rushing',
    'EXPLSV%': 'rushing',
    'AY%': 'receiving',
    'FPOE': 'all',
    'FUM': 'all',
    'CSTY%': 'all',
    'CL': 'all'
  };
  const INTEGER_COLUMNS = new Set([
    'RK', 'G', 'VALUE', 'YDS(t)', 'OPP', 'IMP', 'paYDS', 'paTD', 'paATT', 'CMP', 'pa1D', 'ruYDS', 'ruTD',
    'CAR', 'SAC', 'INT', 'FUM', 'REC', 'TGT', 'ru1D', 'recTD', 'rec1D', 'YAC', 'RR', 'RZ Tgt', 'MTF', 'YCO'
  ]);
  const DECIMAL_PRECISION = new Map([
    ['AGE', 1],
    ['YPG(t)', 1],
    ['paYPG', 1],
    ['ruYPG', 1],
    ['recYPG', 1],
    ['RYOE', 1],
    ['IMP/G', 2],
    ['IMP/OPP', 2],
    ['pIMP', 1],
    ['pIMP/A', 2],
    ['YPC', 2],
    ['YPR', 2],
    ['YPRR', 2],
    ['ELU', 2],
    ['MTF/A', 2],
    ['YCO/A', 2],
    ['TTT', 2],
    ['FPOE', 1],
    ['paRTG', 1],
    ['EPA/DB', 2],
    ['1DRR', 2],
    ['CL', 1],
    ['ADP', 1],
    ['POS·ADP', 1]
  ]);
  const PERCENT_PRECISION = new Map([
    ['SNP%', 1],
    ['PRS%', 1],
    ['CMP%', 1],
    ['TS%', 1],
    ['CSTY%', 1],
    ['CPOE', 1],
    ['AY%', 1],
    ['EXPLSV%', 1]
  ]);
  const VALUE_COLOR_SCALE = [
    { value: 9000, color: '#00EEB6' },
    { value: 8000, color: '#14D7CB' },
    { value: 7000, color: '#0599AA' },
    { value: 6000, color: '#03a8ce' },
    { value: 5500, color: '#0690DC' },
    { value: 5000, color: '#066CDC' },
    { value: 4500, color: '#1350fd' },
    { value: 4000, color: '#5e41ff' },
    { value: 3750, color: '#7158ff' },
    { value: 3500, color: '#964eff' },
    { value: 3250, color: '#9200ff' },
    { value: 3000, color: '#b70fff' },
    { value: 2750, color: '#ba00cc' },
    { value: 2500, color: '#e800ff' },
    { value: 2250, color: '#db00af' },
    { value: 2000, color: '#c70097' },
    { value: 0, color: '#FF0080' }
  ];
  const RK_COLOR_SCALE = [
    { value: 12, color: '#00EEB6' },
    { value: 24, color: '#14D7CB' },
    { value: 36, color: '#0599AA' },
    { value: 48, color: '#03a8ce' },
    { value: 60, color: '#0690DC' },
    { value: 72, color: '#066CDC' },
    { value: 84, color: '#1350fd' },
    { value: 96, color: '#5e41ff' },
    { value: 108, color: '#7158ff' },
    { value: 120, color: '#964eff' },
    { value: 144, color: '#9200ff' },
    { value: 168, color: '#b70fff' },
    { value: 192, color: '#ba00cc' },
    { value: 216, color: '#e800ff' },
    { value: 240, color: '#db00af' },
    { value: 280, color: '#c70097' },
    { value: 500, color: '#FF0080' }
  ];

  // Conditional formatting scales
  const CSTY_COLOR_SCALE = [
    { value: 80, color: '#00ffc4c0' },
    { value: 70, color: '#7dd1ffc0' },
    { value: 60, color: '#48a6ffc0' },
    { value: 50, color: '#957cffc0' },
    { value: 40, color: '#a642ffc0' },
    { value: 30, color: '#ff6fe1c0' },
    { value: -Infinity, color: '#ff0080c0' }
  ];

  const CL_COLOR_SCALE = [
    { value: 30, color: '#00ffc4' },
    { value: 25, color: '#48a6ff' },
    { value: 20, color: '#957cff' },
    { value: 16, color: '#ff6fe1' },
    { value: -Infinity, color: '#ff0080' }
  ];

  const OVERVIEW_RANKED_STAT_COLUMN_SET = new Set([
    'FPTS',
    'PPG',
    'SNP%',
    'YDS(t)',
    'YPG(t)',
    'OPP',
    'IMP',
    'IMP/OPP'
  ]);

  const OVERVIEW_RANK_COLOR_SCALE = [
    { value: 12, color: '#00ffc4ba' },
    { value: 24, color: '#85fff3ba' },
    { value: 36, color: '#7dd1ffba' },
    { value: 48, color: '#48a6ffba' },
    { value: 60, color: '#957cffba' },
    { value: 72, color: '#a642ffba' },
    { value: 84, color: '#cf60ffba' },
    { value: 96, color: '#ff6fe1ba' },
    { value: 108, color: '#ff2eb2ba' },
    { value: Infinity, color: '#ff0080ba' }
  ];

  // FPTS and PPG should always receive rank-based coloring, even outside the overview/ALL filter.
  const ALWAYS_RANKED_COLUMNS = new Set(['FPTS', 'PPG']);

  const AGE_CONDITIONAL_COLOR_SCALES = {
    wrTe: [
      { value: 22.5, color: '#00ffc4' }, { value: 25, color: '#85fff3' },
      { value: 26, color: '#56dfe8' }, { value: 27, color: '#7dd1ff' },
      { value: 29, color: '#89a3ff' }, { value: 30, color: '#957cff' },
      { value: 31, color: '#a642ff' }, { value: 32, color: '#cf60ff' },
      { value: 33, color: '#ff6fe1' }
    ],
    rb: [
      { value: 22.5, color: '#00ffc4' }, { value: 24, color: '#85fff3' },
      { value: 25, color: '#56dfe8' }, { value: 26, color: '#7dd1ff' },
      { value: 27, color: '#89a3ff' }, { value: 28, color: '#957cff' },
      { value: 29, color: '#a642ff' }, { value: 30, color: '#cf60ff' },
      { value: 31, color: '#ff6fe1' }
    ],
    qb: [
      { value: 25.5, color: '#00ffc4' }, { value: 28, color: '#85fff3' },
      { value: 29, color: '#7dd1ff' }, { value: 31, color: '#48a6ff' },
      { value: 33, color: '#957cff' }, { value: 36, color: '#a642ff' },
      { value: 40, color: '#cf60ff' }, { value: 44, color: '#ff6fe1' }
    ]
  };
  
  // Column width configuration (explicit pixel values for perfect alignment)
  const STATS_COLUMN_WIDTHS = {
    'RK': 44,
    'PLAYER': 96,  // Reduced by half from 192
    'POS': 52,
    'TM': 52,
    'AGE': 52,
    'G': 42,
    'FPTS': 66,
    'PPG': 50,
    'VALUE': 76,
    'ADP': 64,
    'POS·ADP': 78,
    'SNP%': 74,
    'CAR': 64,
    'ruYDS': 76,
    'YPC': 64,
    'ruTD': 64,
    'REC': 64,
    'recYDS': 76,
    'TGT': 64,
    'YDS(t)': 76,
    'YPG(t)': 76,
    'ruYPG': 76,
    'ELU': 64,
    'MTF/A': 76,
    'YCO/A': 76,
    'MTF': 64,
    'YCO': 64,
    'EXPLSV%': 86,
    'ru1D': 64,
    'RYOE': 76,
    'recTD': 64,
    'rec1D': 64,
    'YAC': 76,
    'IMP/G': 76,
    'FUM': 64,
    'FPOE': 76,
    'CSTY%': 90,
    'CL': 64,
    'paRTG': 76,
    'EPA/DB': 76,
    'CPOE': 76,
    'paYDS': 76,
    'paTD': 64,
    'CMP%': 64,
    'paATT': 64,
    'CMP': 64,
    'pa1D': 64,
    'paYPG': 76,
    'pIMP': 76,
    'pIMP/A': 76,
    'TTT': 64,
    'PRS%': 76,
    'SAC': 64,
    'INT': 64,
    'TS%': 64,
    'YPRR': 76,
    '1DRR': 64,
    'recYPG': 76,
    'AY%': 63,
    'YPR': 63,
    'RR': 62,
    'RZ Tgt': 64,
    'OPP': 62,
    'IMP': 62,
    'IMP/OPP': 76,
    'YEAR': 64,
    'RANGE': 72,
    'ROUND': 72
  };
  
  const DEFAULT_COLUMN_WIDTH = 76;
  // Columns we want to always treat as numeric for sorting
  const NUMERIC_SORT_COLUMNS = new Set([
    'RK', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'YDS(t)', 'YPG(t)', 'IMP', 'IMP/OPP',
    'paRTG', 'paYDS', 'paTD', 'CMP%', 'paATT', 'CMP', 'paYPG', 'ruYDS', 'ruTD',
    'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM', 'FPOE',
    'SNP%', 'REC', 'TGT', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D', 'recTD', 'rec1D',
    'YAC', 'ELU', 'ruYPG', 'YPRR', '1DRR', 'recYPG', 'YPR', 'RR', 'RZ Tgt', 'EXPLSV%', 'CSTY%', 'CL',
    'TS%', 'OPP', 'recYDS', 'pIMP/G', 'ruIMP/G', 'IMP/G', 'CPOE', 'EPA/DB', 'RYOE', 'AY%'
  ]);

  // Efficiency columns (plus any header containing '/' or '%')
  const EFFICIENCY_COLUMNS = new Set([
    'PPG', 'CSTY%', 'CL', 'SNP%', 'IMP/OPP', 'pIMP/A', 'IMP/G', 'pIMP/G', 'ruIMP/G',
    'CMP%', 'paRTG', 'PRS%', 'TTT', 'ELU','MTF/A', 'YCO/A', 'YPC', 'ruYPG', 'recYPG', 'paYPG',
    'YPG', 'YPG(t)', 'TS%', 'YPRR', '1DRR', 'YPR', 'YAC', 'CPOE', 'EPA/DB', 'AY%', 'EXPLSV%'
  ]);
  
  // Stats table sort semantics: these columns treat lower values as better, so the
  // first tap sorts low-to-high and the header swaps to the low-better icon pair.
  const LOWER_IS_BETTER_COLUMNS = new Set(['ADP', 'POS·ADP', 'AGE', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM']);

  const MOBILE_BREAKPOINT = 600;
  const MOBILE_WIDTH_SCALE_BASE = 0.75; // keep existing sizing for key columns on mobile
  const MOBILE_WIDTH_SCALE_REDUCED = 0.7; // slightly tighter for most columns on mobile
  const DESKTOP_WIDTH_SCALE_REDUCED = 0.92; // slightly tighter for most columns on desktop
  const NO_WIDTH_REDUCTION_COLUMNS = new Set(['RK', 'PLAYER', 'POS', 'TM', 'AGE']);
  // Stats table frozen columns: give PLAYER and POS a little more desktop room
  // without changing the tighter mobile widths used on phones.
  const DESKTOP_COLUMN_WIDTH_OVERRIDES = new Map([
    ['PLAYER', 122],
    ['POS', 56]
  ]);

  function getColumnWidth(columnKey) {
    const baseWidth = STATS_COLUMN_WIDTHS[columnKey] || DEFAULT_COLUMN_WIDTH;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const desktopBaseWidth = isMobile
      ? baseWidth
      : (DESKTOP_COLUMN_WIDTH_OVERRIDES.get(columnKey) ?? baseWidth);

    // Keep Pick Values (RDP) column widths exactly as-is.
    if (statsState.activePosition === 'RDP') {
      return isMobile ? Math.round(baseWidth * MOBILE_WIDTH_SCALE_BASE) : desktopBaseWidth;
    }

    if (isMobile) {
      const scale = NO_WIDTH_REDUCTION_COLUMNS.has(columnKey)
        ? MOBILE_WIDTH_SCALE_BASE
        : MOBILE_WIDTH_SCALE_REDUCED;
      return Math.round(baseWidth * scale);
    }

    if (NO_WIDTH_REDUCTION_COLUMNS.has(columnKey)) return desktopBaseWidth;
    return Math.round(desktopBaseWidth * DESKTOP_WIDTH_SCALE_REDUCED);
  }
  
  const RECEIVING_SUBFILTERS = ['WR', 'TE'];

  // Maps the new data-category attribute values to the internal activePosition values.
  const CATEGORY_TO_POSITION = {
    overview:  'ALL',
    passing:   'QB',
    rushing:   'RB',
    receiving: 'Receiving',
    rdp:       'RDP'
  };
  // Reverse map for syncUiState (activePosition → data-category).
  const POSITION_TO_CATEGORY = {
    ALL:       'overview',
    QB:        'passing',
    RB:        'rushing',
    Receiving: 'receiving',
    RDP:       'rdp'
  };

  // Column group definitions for the group-header row in the two-pane table.
  // Each entry gives a display label and the set of columns it spans.
  const STATS_COLUMN_GROUPS = {
    overview: [
      { label: 'INFO',           columns: ['TM','AGE','G'] },
      { label: 'FANTASY',        columns: ['FPTS','PPG','VALUE','ADP','POS·ADP'] },
      { label: 'OVERVIEW STATS', columns: ['SNP%','YDS(t)','YPG(t)','OPP','IMP','IMP/OPP','CSTY%','CL'] }
    ],
    passing: [
      { label: 'INFO',          columns: ['TM','AGE','G'] },
      { label: 'FANTASY',       columns: ['FPTS','PPG','VALUE','ADP','POS·ADP'] },
      { label: 'PASSING',       columns: ['paYDS','paTD','CMP%','paATT','paRTG','EPA/DB','CPOE','CMP','YDS(t)','paYPG'] },
      { label: 'IMPACT',        columns: ['pIMP','pIMP/A','IMP/G'] },
      { label: 'RUSHING',       columns: ['CAR','ruYDS','ruTD','YPC'] },
      { label: 'PRESSURE',      columns: ['TTT','PRS%','SAC','INT'] },
      { label: 'ADVANCED',      columns: ['pa1D','ru1D','FUM','FPOE','CSTY%','CL'] }
    ],
    rushing: [
      { label: 'INFO',          columns: ['TM','AGE','G'] },
      { label: 'FANTASY',       columns: ['FPTS','PPG','VALUE','ADP','POS·ADP'] },
      { label: 'USAGE',         columns: ['SNP%','CAR'] },
      { label: 'RUSHING',       columns: ['ruYDS','YPC','ruTD','YDS(t)','ruYPG'] },
      { label: 'RECEIVING',     columns: ['REC','recYDS','TGT'] },
      { label: 'EFFICIENCY',    columns: ['ELU','MTF/A','YCO/A','MTF','YCO','EXPLSV%'] },
      { label: 'ADVANCED',      columns: ['ru1D','RYOE','recTD','rec1D','YAC','IMP/G','FUM','FPOE','CSTY%','CL'] }
    ],
    receiving: [
      { label: 'INFO',          columns: ['TM','AGE','G'] },
      { label: 'FANTASY',       columns: ['FPTS','PPG','VALUE','ADP','POS·ADP'] },
      { label: 'USAGE',         columns: ['SNP%','TGT','REC','TS%'] },
      { label: 'RECEIVING',     columns: ['recYDS','recTD','YPRR','rec1D','1DRR','recYPG'] },
      { label: 'EFFICIENCY',    columns: ['AY%','YAC','YPR','IMP/G','RR','FPOE'] },
      { label: 'ADVANCED',      columns: ['YDS(t)','RZ Tgt','CAR','ruYDS','ruTD','YPC','FUM','CSTY%','CL'] }
    ]
  };
  // Frozen pane always shows the GENERAL group (RK / PLAYER / POS).
  const STATS_FROZEN_GROUP = [{ label: 'GENERAL', columns: ['RK','PLAYER','POS'] }];

  const statsState = {
    currentTab: 'oneQb',
    activePosition: 'ALL',
    rookieOnly: false,
    searchTerm: '',
    sort: { column: 'FPTS', direction: 2 },
    datasets: new Map(),
    headerLabels: new Map(),
    availableColumns: new Map(),
    rankCache: null,
    lastRenderedRows: [],
    receivingSubfilters: {
      WR: true,
      TE: true
    },
    // Two-pane table references (set by renderTable, used by updateTableRows)
    needsFullRebuild: true,
    currentFrozenTbody: null,
    currentScrollTbody: null,
    currentScrollPane:  null,
    currentFrozenPane:  null
  };

  // DOM anchors — mapped to the new stats.html element IDs.
  const dom = {
    // Legacy loading spinner (still present in new HTML)
    loading:              document.getElementById('statsLoading'),
    // Primary tab buttons (1-QB / SFLX) — live inside .top-tabs
    primaryTabButtons:    Array.from(document.querySelectorAll('[data-primary-tab]')),
    // Category chips — OVERVIEW / PASSING / RUSHING / RECEIVING
    categoryButtons:      Array.from(document.querySelectorAll('.category-chip[data-category]')),
    // PICK VALUES pill
    rdpButton:            document.querySelector('[data-category="rdp"]'),
    // Rookies mini-chip
    rookieChip:           document.querySelector('[data-category="rookies"]'),
    // Receiving sub-filter panel + individual buttons
    receivingSubfilters:  document.getElementById('receiving-subfilters'),
    receivingSubfilterButtons: Array.from(document.querySelectorAll('[data-receiving-filter]')),
    // Search input
    searchInput:          document.getElementById('player-search'),
    // Two-pane table container
    gridContainer:        document.getElementById('player-grid'),
    // Grid overlay (loading / empty state)
    gridOverlay:          document.getElementById('grid-overlay'),
    overlayTitle:         document.getElementById('overlay-title'),
    overlayBody:          document.getElementById('overlay-description'),
    overlayActions:       document.getElementById('overlay-actions'),
    // Meta labels
    rowCount:             document.getElementById('row-count'),
    activeViewLabel:      document.getElementById('active-view-label')
  };
  // Allow forcing the inline stats-table loader via DevTools, similar to the global `setLoading()` helper.
  // Usage (Stats page only):
  //   setLoading(true);
  //   setLoading(false);
  let statsLoadingLocked = false;
  let statsLoadingDefaultText = null;
  function setStatsLoading(isLoading, message) {
    if (!dom.loading) return;
    const textEl = dom.loading.querySelector('.stats-loading-text');
    if (statsLoadingDefaultText === null && textEl) {
      statsLoadingDefaultText = textEl.textContent || '';
    }
    statsLoadingLocked = !!isLoading;
    if (statsLoadingLocked && typeof message === 'string' && message.trim()) {
      if (textEl) textEl.textContent = message;
    } else if (!statsLoadingLocked && textEl && statsLoadingDefaultText !== null) {
      textEl.textContent = statsLoadingDefaultText;
    }
    toggleInlineLoading(!!isLoading);
  }
  try {
    window.setStatsLoading = setStatsLoading;
  } catch (e) {
    // ignore – window may not be writable in some environments
  }

  // Stats page: when the inline loader is rendered as a fixed overlay (mobile),
  // keep it pinned below the sticky navigation header by updating `--stats-loading-top`.
  function updateStatsLoadingViewportTop() {
    try {
      const header = document.getElementById('header-container');
      if (!header) return;
      const rect = header.getBoundingClientRect();
      const top = Math.max(0, Math.ceil(rect.bottom));
      const target = document.body || document.documentElement;
      target.style.setProperty('--stats-loading-top', `${top}px`);
    } catch (e) {
      // ignore
    }
  }
  updateStatsLoadingViewportTop();
  try {
    window.addEventListener('resize', updateStatsLoadingViewportTop, { passive: true });
    window.addEventListener('orientationchange', updateStatsLoadingViewportTop, { passive: true });
    if (typeof ResizeObserver === 'function') {
      const header = document.getElementById('header-container');
      if (header) {
        const ro = new ResizeObserver(() => updateStatsLoadingViewportTop());
        ro.observe(header);
      }
    }
  } catch (e) {
    // ignore
  }
  const gameLogDom = {
    modal: document.getElementById('game-logs-modal'),
    overlay: document.querySelector('#game-logs-modal .modal-overlay'),
    infoBtn: document.querySelector('#game-logs-modal .modal-info-btn'),
    keyPanel: document.getElementById('stats-key-container'),
    radarPanel: document.getElementById('radar-chart-container'),
    consistencyPanel: document.getElementById('consistency-container')
  };
  if (dom.leagueChip) {
    dom.leagueChip.textContent = 'DH DATA HUB \u2013 ADVANCED ANALYTICS';
  }
  const TEAM_TAG_STYLES = (() => {
    // fallback palette similar to reference
    const defaultStyle = 'background: rgba(255,255,255,0.08); color: #ffffff;';
    if (typeof TEAM_COLORS === 'undefined') {
      return () => defaultStyle;
    }
    return (team) => {
      const upper = (team || '').toUpperCase();
      if (!upper || !TEAM_COLORS[upper]) return defaultStyle;
      const color = TEAM_COLORS[upper];
      return `background-color: #e8eaed; color: ${color}; font-weight: 600;`;
    };
  })();
  const params = new URLSearchParams(window.location.search);

  const TEAM_LOGO_KEY_MAP = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };
  function getTeamLogoSrc(teamKey) {
    const upper = (teamKey || '').toString().trim().toUpperCase();
    if (!upper || upper === 'FA' || upper === 'RDP') return null;
    const normalizedKey = TEAM_LOGO_KEY_MAP[upper] || upper.toLowerCase();
    return `../assets/NFL_logos_svg/${normalizedKey}.svg`;
  }

  function preloadTeamLogosFromDatasets() {
    try {
      if (typeof Image === 'undefined') return;
      const srcs = new Set();
      for (const dataset of statsState.datasets.values()) {
        dataset.forEach((entry) => {
          if (!entry || entry.meta?.pos === 'RDP') return;
          const src = getTeamLogoSrc(entry.meta?.team || entry.row?.TM);
          if (src) srcs.add(src);
        });
      }
      srcs.forEach((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
      });
    } catch (e) {
      // ignore – purely a performance enhancement
    }
  }

  function scheduleTeamLogoPreload() {
    try {
      preloadTeamLogosFromDatasets();
    } catch (e) {
      // ignore
    }
  }

  function updateReceivingSubfilterButtons() {
    if (!dom.receivingSubfilterButtons) return;
    dom.receivingSubfilterButtons.forEach((btn) => {
      // New HTML uses data-receiving-filter; old used data-subfilter — handle both.
      const key = btn.dataset.receivingFilter || btn.dataset.subfilter;
      const isActive = !!statsState.receivingSubfilters[key];
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }
  function resetReceivingSubfilters() {
    RECEIVING_SUBFILTERS.forEach((key) => {
      statsState.receivingSubfilters[key] = true;
    });
    updateReceivingSubfilterButtons();
  }
  function setReceivingSubfiltersVisible(visible) {
    // Show/hide the receiving-subfilters panel using the HTML `hidden` attribute.
    if (dom.receivingSubfilters) {
      dom.receivingSubfilters.hidden = !visible;
    }
  }
  function syncReceivingSubfilterUi({ ensureReset = false } = {}) {
    const isReceivingActive = statsState.activePosition === 'Receiving';
    if (isReceivingActive && ensureReset) {
      resetReceivingSubfilters();
    } else {
      updateReceivingSubfilterButtons();
    }
    setReceivingSubfiltersVisible(isReceivingActive);
  }
  function formatInteger(value) {
    if (!Number.isFinite(value)) return '';
    return Math.round(value).toString();
  }
  function formatDecimal(value, decimals) {
    if (!Number.isFinite(value)) return '';
    const fixed = value.toFixed(decimals);
    return fixed;
  }
  function formatPercentageValue(value, decimals = 1) {
    if (!Number.isFinite(value)) return '';
    const fixed = value.toFixed(decimals);
    return `${fixed}%`;
  }
  function formatSheetCellValue(column, rawValue) {
    if (rawValue === undefined || rawValue === null) return '';
    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      if (trimmed === '') return '';
      const upper = trimmed.toUpperCase();
      if (upper === 'NA' || upper === 'N/A') return trimmed;
      if (trimmed.includes('%')) return trimmed;
      if (/[^0-9.,\-]/.test(trimmed)) return trimmed;
    }
    const numeric = toNumber(rawValue);
    if (numeric === null) {
      return typeof rawValue === 'string' ? rawValue : '';
    }
    if (PERCENT_PRECISION.has(column)) {
      const decimals = PERCENT_PRECISION.get(column) ?? 1;
      const scaled = Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
      return formatPercentageValue(scaled, decimals);
    }
    if (INTEGER_COLUMNS.has(column)) {
      return formatInteger(numeric);
    }
    if (DECIMAL_PRECISION.has(column)) {
      const decimals = DECIMAL_PRECISION.get(column) ?? 2;
      return formatDecimal(numeric, decimals);
    }
    return typeof rawValue === 'string' ? rawValue : `${numeric}`;
  }
  function parseCsv(text) {
    const lines = (text || '').split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { headers: [], rows: [], headerDisplay: new Map() };
    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (inQuotes) {
          if (char === '"') {
            if (line[i + 1] === '"') {
              current += '"';
              i += 1;
            } else {
              inQuotes = false;
            }
          } else {
            current += char;
          }
        } else if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };
    const rawHeaders = parseLine(lines[0]);
    const headerDisplay = new Map();
    const headers = rawHeaders.map((raw) => {
      const canonical = HEADER_ALIASES.get(raw) || raw;
      const displayLabel = canonical;
      if (!headerDisplay.has(canonical)) {
        headerDisplay.set(canonical, displayLabel);
      }
      return canonical;
    });
    const rows = lines.slice(1).map(parseLine);
    return { headers, rows, headerDisplay };
  }
  function toNumber(value, { allowFloat = true } = {}) {
    if (value === null || value === undefined) return null;
    let source = value;
    if (typeof source === 'string') {
      source = source.replace(/,/g, '');
    }
    const numeric = allowFloat ? parseFloat(source) : parseInt(source, 10);
    return Number.isNaN(numeric) ? null : numeric;
  }
  function getFullName(playerId, fallback = '') {
    const source = state.players?.[playerId];
    if (source) {
      const first = (source.first_name || '').trim();
      const last = (source.last_name || '').trim();
      const combined = `${first} ${last}`.trim();
      return combined || fallback;
    }
    return fallback;
  }

  function isEfficiencyColumn(column) {
    if (!column) return false;
    if (EFFICIENCY_COLUMNS.has(column)) return true;
    return column.includes('%') || column.includes('/');
  }

  function isNumericColumn(column) {
    if (!column) return false;
    if (NUMERIC_SORT_COLUMNS.has(column)) return true;
    return column.includes('%') || column.includes('/');
  }

  function getNumericSortValue(entry, column) {
    if (!column) return null;
    if (column === 'FPTS') return Number.isFinite(entry.meta.fpts) ? entry.meta.fpts : toNumber(entry.row[column]);
    if (column === 'PPG') return Number.isFinite(entry.meta.ppg) ? entry.meta.ppg : toNumber(entry.row[column]);
    if (column === 'VALUE') return Number.isFinite(entry.meta.value) ? entry.meta.value : toNumber(entry.row[column]);
    if (column === 'AGE') return Number.isFinite(entry.meta.age) ? entry.meta.age : toNumber(entry.row[column]);
    if (column === 'RK') return Number.isFinite(entry.meta.rank) ? entry.meta.rank : toNumber(entry.row[column], { allowFloat: false });
    return toNumber(entry.row[column]);
  }

  function hasSortableValue(entry, column) {
    if (!column) return true;
    const raw = entry.row[column];

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) {
        const numeric = getNumericSortValue(entry, column);
        return Number.isFinite(numeric);
      }
      const upper = trimmed.toUpperCase();
      if (upper === 'NA' || upper === 'N/A') return false;
    }

    if (raw === undefined || raw === null || raw === '') {
      const numeric = getNumericSortValue(entry, column);
      return Number.isFinite(numeric);
    }

    if (!isNumericColumn(column)) return true; // non-numeric columns just need a non-empty value

    const numeric = getNumericSortValue(entry, column);
    return Number.isFinite(numeric);
  }

  function shouldAnnotateEfficiency(entry, column) {
    if (!column || statsState.sort.direction === 0) return false;
    if (column !== statsState.sort.column) return false;
    if (!isEfficiencyColumn(column)) return false;
    const snap = getNumericSortValue(entry, 'SNP%');
    const games = getNumericSortValue(entry, 'G');
    // Stats table cell annotation for active efficiency sorts:
    // show an asterisk when a row is below the stronger "confidence" bar
    // (different from the eligibility filter cutoffs used for sorting).
    return (Number.isFinite(snap) && snap < 45) || (Number.isFinite(games) && games < 7);
  }

  function annotateEfficiencyValue(column, entry, value) {
    const baseText = value === undefined || value === null ? '' : value;
    if (!shouldAnnotateEfficiency(entry, column)) {
      return { text: baseText, asterisk: false };
    }
    return { text: baseText, asterisk: true };
  }
  function formatDisplayName(playerId, fallback = '') {
    const source = state.players?.[playerId];
    let first = '';
    let last = '';
    if (source) {
      first = (source.first_name || '').trim();
      last = (source.last_name || '').trim();
    } else if (fallback) {
      const parts = fallback.trim().split(/\s+/);
      if (parts.length === 1) {
        last = parts[0];
      } else {
        first = parts.shift() || '';
        last = parts.pop() || '';
      }
    }
    if (!last && fallback) {
      const parts = fallback.trim().split(/\s+/);
      last = parts.pop() || '';
      if (!first && parts.length) first = parts.shift() || '';
    }
    let truncatedLast = last || fallback.trim();
    if (truncatedLast && truncatedLast.length > 9) {
      truncatedLast = `${truncatedLast.slice(0, 9)}..`;
    }
    const initial = first ? `${first.charAt(0).toUpperCase()}.` : '';
    if (initial && truncatedLast) return `${initial} ${truncatedLast}`;
    if (truncatedLast) return truncatedLast;
    if (fallback) return fallback.length > 10 ? `${fallback.slice(0, 10)}…` : fallback;
    return 'Unknown';
  }
  function getValueStyle(valueNumeric) {
    if (!Number.isFinite(valueNumeric) || valueNumeric <= 0) {
      return 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary);';
    }
    for (const tier of VALUE_COLOR_SCALE) {
      if (valueNumeric >= tier.value) {
        return `background:${tier.color}; color:${valueNumeric >= 3750 ? '#051026' : '#000'};`;
      }
    }
    return 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary);';
  }
  function getRankColorValue(rank) {
    if (!Number.isFinite(rank) || rank <= 0) return 'var(--color-text-secondary)';
    for (const tier of RK_COLOR_SCALE) {
      if (rank <= tier.value) return tier.color;
    }
    return RK_COLOR_SCALE[RK_COLOR_SCALE.length - 1].color;
  }
  function normalizeHeadersRow(headers, rowValues) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = rowValues[index] !== undefined ? rowValues[index] : '';
    });
    return row;
  }
  function derivePosRankText(row, pos) {
    const raw = row['POS | RK'];
    if (raw && raw.includes('|')) {
      const [p, rk] = raw.split('|').map((part) => part.trim());
      return `${p || pos}·${rk || 'NA'}`;
    }
    if (row['POS | RK']) {
      return row['POS | RK'].replace('|', '·');
    }
    if (row['POS RK']) {
      return row['POS RK'].replace('|', '·');
    }
    return pos ? `${pos}·NA` : 'NA';
  }
  function buildRow(row) {
    const playerId = row.SLPR_ID || row.slpr_id || '';
    const name = row.PLAYER || row['PLAYER NAME'] || '';
    const pos = (row.POS || '').toUpperCase();
    // Stats page team source of truth:
    // keep table rows aligned to the `SZN.csv` team value instead of falling back to
    // other player sources that can drift from the shipped season totals file.
    const team = (row.TM || '').toUpperCase() || 'FA';
    const rank = toNumber(row.RK, { allowFloat: false });
    const age = toNumber(row.AGE) ?? 0;
    const gmPlayed = toNumber(row.G, { allowFloat: false });
    const rookieYear = toNumber(row.RY, { allowFloat: false });
    const exp = toNumber(row.EXP, { allowFloat: false });
    const tier = toNumber(row.TIER, { allowFloat: false });
    const trend = toNumber(row.TREND);
    const value = toNumber(row.VALUE);
    const posRankText = derivePosRankText(row, pos);
    const fullName = getFullName(playerId, name);
    const displayName = formatDisplayName(playerId, name);
    
    // Stats page uses season totals (SZN.csv) for stats + computes PPG (no league-specific calculations).
    const fpts = toNumber(row.FPTS);
    const ppg = toNumber(row.PPG);
    const adp = toNumber(row.ADP);
    const posAdp = toNumber(row['POS·ADP']);
    const fptsPosRank = null; // Not used on stats page
    const ppgPosRank = null; // Not used on stats page
    // Cache style calculations
    if (!row._cachedStyles) {
      row._cachedStyles = {
        valueStyle: getValueStyle(value),
        rkColor: getRankColorValue(rank),
        ageColor: typeof getAgeColorForRoster === 'function' ? (getAgeColorForRoster(pos, age) || 'inherit') : 'inherit',
        fptsColor: 'inherit', // Stats page doesn't use conditional rank coloring
        ppgColor: 'inherit', // Stats page doesn't use conditional rank coloring
        teamStyle: TEAM_TAG_STYLES(team)
      };
    }
    return {
      row,
      meta: {
        playerId,
        name,
        fullName,
        displayName,
        pos,
        team,
        rank,
        age,
        gmPlayed,
        rookieYear,
        exp,
        tier,
        trend,
        value,
        fpts,
        ppg,
        adp,
        posAdp,
        fptsPosRank,
        ppgPosRank,
        posRankText,
        valueStyle: row._cachedStyles.valueStyle,
        rkColor: row._cachedStyles.rkColor,
        ageColor: row._cachedStyles.ageColor,
        fptsColor: row._cachedStyles.fptsColor,
        ppgColor: row._cachedStyles.ppgColor,
        teamStyle: row._cachedStyles.teamStyle
      }
    };
  }
  function buildStatsPageRankCache(dataset) {
    // Build rank cache for FPTS and PPG rankings
    const cache = {};
    
    // Filter to players with actual stats
    const playersWithStats = dataset.filter(entry => {
      return entry.meta.fpts !== null && entry.meta.fpts > 0 && entry.meta.pos !== 'RDP';
    });
    
    if (playersWithStats.length === 0) return cache;
    
    // Calculate FPTS overall ranks
    const fptsSorted = [...playersWithStats].sort((a, b) => (b.meta.fpts || 0) - (a.meta.fpts || 0));
    fptsSorted.forEach((entry, index) => {
      if (!cache[entry.meta.playerId]) cache[entry.meta.playerId] = {};
      cache[entry.meta.playerId].overallRank = index + 1;
    });
    
    // Calculate PPG overall ranks
    const ppgSorted = [...playersWithStats].sort((a, b) => (b.meta.ppg || 0) - (a.meta.ppg || 0));
    ppgSorted.forEach((entry, index) => {
      if (!cache[entry.meta.playerId]) cache[entry.meta.playerId] = {};
      cache[entry.meta.playerId].ppgOverallRank = index + 1;
    });
    
    // Group by position for positional ranks
    const positionGroups = new Map();
    playersWithStats.forEach(entry => {
      const pos = entry.meta.pos;
      if (!pos) return;
      if (!positionGroups.has(pos)) positionGroups.set(pos, []);
      positionGroups.get(pos).push(entry);
    });
    
    // Calculate position ranks for FPTS and PPG
    positionGroups.forEach((players, pos) => {
      // FPTS position ranks
      const fptsByPos = [...players].sort((a, b) => (b.meta.fpts || 0) - (a.meta.fpts || 0));
      fptsByPos.forEach((entry, index) => {
        cache[entry.meta.playerId].posRank = index + 1;
      });
      
      // PPG position ranks
      const ppgByPos = [...players].sort((a, b) => (b.meta.ppg || 0) - (a.meta.ppg || 0));
      ppgByPos.forEach((entry, index) => {
        cache[entry.meta.playerId].ppgPosRank = index + 1;
      });
    });
    
    return cache;
  }
  function getColumnSet() {
    if (statsState.activePosition === 'RDP') return COLUMN_SETS.RDP;
    if (!statsState.activePosition || statsState.activePosition === 'ALL') return COLUMN_SETS.default;
    if (statsState.activePosition === 'QB') return COLUMN_SETS.QB;
    if (statsState.activePosition === 'RB') return COLUMN_SETS.RB;
    if (statsState.activePosition === 'Receiving') return COLUMN_SETS.WR; // Use WR set for Receiving
    if (statsState.activePosition === 'TE') return COLUMN_SETS.TE;
    return COLUMN_SETS.default;
  }
  
  // Parse pick name like "2026 Late 4th" into {year, range, round}
  function parsePickName(pickName) {
    if (!pickName || typeof pickName !== 'string') {
      return { year: '', range: '', round: '' };
    }
    const parts = pickName.trim().split(/\s+/);
    let year = '';
    let range = '';
    let round = '';
    
    // First part is usually the year (4 digits)
    if (parts[0] && /^\d{4}$/.test(parts[0])) {
      year = parts[0];
      parts.shift();
    }
    
    // Last part is usually the round (1st, 2nd, 3rd, 4th, etc.)
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      if (/^\d+(st|nd|rd|th)$/i.test(lastPart)) {
        round = lastPart;
        parts.pop();
      }
    }
    
    // Everything in between is the range (Early, Mid, Late, etc.)
    if (parts.length > 0) {
      range = parts.join(' ');
    }
    
    return { year, range, round };
  }
  function getColumnCategory(column) {
    return COLUMN_CATEGORY[column] || 'all';
  }
  function getActiveDataset() {
    return statsState.datasets.get(statsState.currentTab) || [];
  }
  function passesFilters(entry) {
    const { meta, row } = entry;
    // Positional Filtering
    if (statsState.activePosition && statsState.activePosition !== 'ALL') {
      if (statsState.activePosition === 'Receiving') {
        const allowedPositions = RECEIVING_SUBFILTERS.filter((key) => statsState.receivingSubfilters[key]);
        if (!allowedPositions.length) return false;
        if (!allowedPositions.includes(meta.pos)) return false;
      } else if (meta.pos !== statsState.activePosition) {
        return false;
      }
    }
    // Rookie Filtering
    if (statsState.rookieOnly) {
      const targetYear = Number(state.currentNflSeason) || new Date().getFullYear();
      if (meta.rookieYear !== targetYear) return false;
    }
    // Search Term Filtering
    if (statsState.searchTerm) {
      const needle = statsState.searchTerm.toLowerCase();
      const haystack = `${meta.name || ''} ${meta.fullName || ''} ${meta.displayName || ''}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    // RDP (Rookie Draft Pick) Filtering
    if (statsState.activePosition === 'RDP' && meta.pos !== 'RDP') return false;
    // Conditional filtering based on active sort
    const sortColumn = statsState.sort.column;
    const sortActive = sortColumn && statsState.sort.direction !== 0;
    if (sortActive) {
      // Exclude rows with missing/empty/NA values for the active sort column
      if (!hasSortableValue(entry, sortColumn)) return false;

      // Efficiency stat thresholds
      if (isEfficiencyColumn(sortColumn)) {
        const snapPct = getNumericSortValue(entry, 'SNP%');
        const games = getNumericSortValue(entry, 'G');
        if (!Number.isFinite(snapPct) || snapPct < 40) return false;
        if (!Number.isFinite(games) || games < 4) return false;
      }

      const statCategory = getColumnCategory(sortColumn);
      // Passing filter: paATT >= 36
      if (statsState.activePosition === 'QB' && statCategory === 'passing') {
        const passAttempts = toNumber(row.paATT, { allowFloat: false });
        if (passAttempts === null || passAttempts < 36) return false;
      }
      // Rushing filter: SNP% >= 35%
      if (statsState.activePosition === 'RB' && statCategory === 'rushing') {
        const snapPct = toNumber(row['SNP%']);
        if (snapPct === null || snapPct < 35) return false;
      }
      // Receiving filter: SNP% >= 35%
      if (statsState.activePosition === 'Receiving' && statCategory === 'receiving') {
        const snapPct = toNumber(row['SNP%']);
        if (snapPct === null || snapPct < 35) return false;
      }
    }
    return true;
  }
  function compareValues(a, b, column) {
    const aRaw = a.row[column];
    const bRaw = b.row[column];
    if (column === 'FPTS') {
      return (a.meta.fpts ?? -Infinity) - (b.meta.fpts ?? -Infinity);
    }
    if (column === 'PPG') {
      return (a.meta.ppg ?? -Infinity) - (b.meta.ppg ?? -Infinity);
    }
    if (column === 'VALUE') {
      return (a.meta.value ?? -Infinity) - (b.meta.value ?? -Infinity);
    }
    if (column === 'AGE') {
      return (a.meta.age ?? -Infinity) - (b.meta.age ?? -Infinity);
    }
    if (isNumericColumn(column)) {
      const numA = getNumericSortValue(a, column);
      const numB = getNumericSortValue(b, column);
      if (numA === null && numB === null) return 0;
      if (numA === null) return -1;
      if (numB === null) return 1;
      return numA - numB;
    }
    const strA = (aRaw || '').toString().toLowerCase();
    const strB = (bRaw || '').toString().toLowerCase();
    return strA.localeCompare(strB);
  }
  function getSortedRows(rows, column) {
    const direction = statsState.sort.direction === 2 ? -1 : 1;
    const sorted = [...rows];
    sorted.sort((a, b) => {
      const result = compareValues(a, b, column);
      if (result === 0) return 0;
      return direction * (result > 0 ? 1 : -1);
    });
    return sorted;
  }

  function normalizePercentValue(value) {
    if (!Number.isFinite(value)) return null;
    // Sheet data may already be 0-100 or 0-1; treat <= 1 as a fraction.
    if (value > 0 && value <= 1) return value * 100;
    return value;
  }

  function getColorForThreshold(scale, value) {
    if (!Array.isArray(scale) || !Number.isFinite(value)) return null;
    for (const tier of scale) {
      if (value >= tier.value) return tier.color;
    }
    return null;
  }

  function getOverviewRankColorValue(rank) {
    if (!Number.isFinite(rank) || rank <= 0) return null;
    for (const tier of OVERVIEW_RANK_COLOR_SCALE) {
      if (rank <= tier.value) return tier.color;
    }
    return OVERVIEW_RANK_COLOR_SCALE[OVERVIEW_RANK_COLOR_SCALE.length - 1]?.color || null;
  }

  function getAgeScaleForPos(pos) {
    const upper = (pos || '').toUpperCase();
    if (upper === 'QB') return AGE_CONDITIONAL_COLOR_SCALES.qb;
    if (upper === 'RB') return AGE_CONDITIONAL_COLOR_SCALES.rb;
    if (upper === 'WR' || upper === 'TE') return AGE_CONDITIONAL_COLOR_SCALES.wrTe;
    return null;
  }

  function getPositionalAgeColor(pos, age) {
    if (!Number.isFinite(age) || age <= 0) return null;
    const scale = getAgeScaleForPos(pos);
    if (!scale || !scale.length) return null;
    for (const tier of scale) {
      if (age <= tier.value) return tier.color;
    }
    return scale[scale.length - 1].color;
  }

  function buildOverviewRankColorCache(entries, columnsToRank) {
    const result = new Map();
    if (!Array.isArray(entries) || !Array.isArray(columnsToRank) || !columnsToRank.length) return result;

    const players = entries.filter((entry) => entry?.meta?.pos !== 'RDP' && entry?.meta?.playerId);

    columnsToRank.forEach((column) => {
      const eligible = players.filter((entry) => {
        if (!hasSortableValue(entry, column)) return false;
        if (isEfficiencyColumn(column)) {
          const snapPct = getNumericSortValue(entry, 'SNP%');
          const games = getNumericSortValue(entry, 'G');
          // Keep overview rank-color eligibility aligned with efficiency sort eligibility.
          // If these cutoffs change in `passesFilters`, update this block too.
          if (!Number.isFinite(snapPct) || snapPct < 40) return false;
          if (!Number.isFinite(games) || games < 4) return false;
        }
        return true;
      });

      eligible.sort((a, b) => compareValues(b, a, column));

      const columnMap = new Map();
      eligible.forEach((entry, index) => {
        const color = getOverviewRankColorValue(index + 1);
        if (color) {
          columnMap.set(entry.meta.playerId, color);
        }
      });

      result.set(column, columnMap);
    });

    return result;
  }

  function getConditionalCellStyle(column, entry, overviewRankColors) {
    if (!column || !entry) return null;
    if (entry?.meta?.pos === 'RDP') return null;

    if (column === 'CSTY%') {
      const raw = getNumericSortValue(entry, column);
      const pct = normalizePercentValue(raw);
      const color = Number.isFinite(pct) ? getColorForThreshold(CSTY_COLOR_SCALE, pct) : null;
      return color ? { color } : null;
    }

    if (column === 'CL') {
      const value = getNumericSortValue(entry, column);
      const color = Number.isFinite(value) ? getColorForThreshold(CL_COLOR_SCALE, value) : null;
      return color ? { color } : null;
    }

    if (column === 'AGE') {
      const age = getNumericSortValue(entry, column);
      const color = getPositionalAgeColor(entry.meta.pos, age);
      return color ? { color } : null;
    }

    // ADP column — uses RK_COLOR_SCALE directly against the ADP numeric value (lower = better = green).
    if (column === 'ADP') {
      const adp = entry.meta.adp;
      if (!Number.isFinite(adp) || adp <= 0) return null;
      const color = getRankColorValue(adp);
      return color ? { color } : null;
    }

    // POS·ADP column — uses OVERVIEW_RANK_COLOR_SCALE directly against the positional ADP value (lower = better).
    if (column === 'POS·ADP') {
      const posAdp = entry.meta.posAdp;
      if (!Number.isFinite(posAdp) || posAdp <= 0) return null;
      const color = getOverviewRankColorValue(posAdp);
      return color ? { color } : null;
    }

    // Overview rank-based coloring for stat columns (ALL filter view).
    const isOverview = !statsState.activePosition || statsState.activePosition === 'ALL';
    if (overviewRankColors && (isOverview ? OVERVIEW_RANKED_STAT_COLUMN_SET.has(column) : ALWAYS_RANKED_COLUMNS.has(column))) {
      const playerId = entry.meta.playerId;
      const color = playerId ? overviewRankColors.get(column)?.get(playerId) : null;
      return color ? { color } : null;
    }

    return null;
  }

  // === New two-pane table helpers ===

  // Show and hide the #grid-overlay element (loading / error state).
  function showGridOverlay({ title, body, showActions } = {}) {
    if (!dom.gridOverlay) return;
    if (dom.overlayTitle && title) dom.overlayTitle.textContent = title;
    if (dom.overlayBody && body) dom.overlayBody.textContent = body;
    if (dom.overlayActions) dom.overlayActions.hidden = !showActions;
    dom.gridOverlay.classList.remove('is-hidden');
  }
  function hideGridOverlay() {
    if (dom.gridOverlay) dom.gridOverlay.classList.add('is-hidden');
  }

  // Update the meta row-count label in .grid-shell__meta.
  function updateRowCount(count) {
    if (dom.rowCount) {
      dom.rowCount.textContent = `${count} player${count !== 1 ? 's' : ''}`;
    }
  }

  // Sync the active-view label and all UI button states to the current statsState.
  function syncUiState() {
    // Primary tabs (1-QB / SFLX)
    dom.primaryTabButtons.forEach(btn => {
      const isActive = btn.dataset.primaryTab === (statsState.currentTab === 'sflx' ? 'SFLX' : '1-QB');
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Category chips (overview / passing / rushing / receiving)
    const activeCategory = POSITION_TO_CATEGORY[statsState.activePosition] || 'overview';
    dom.categoryButtons.forEach(btn => {
      const isActive = btn.dataset.category === activeCategory;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // PICK VALUES pill (rdp)
    if (dom.rdpButton) {
      dom.rdpButton.classList.toggle('is-active', statsState.activePosition === 'RDP');
    }

    // Rookies mini-chip
    if (dom.rookieChip) {
      dom.rookieChip.classList.toggle('is-active', statsState.rookieOnly);
      dom.rookieChip.setAttribute('aria-pressed', statsState.rookieOnly ? 'true' : 'false');
    }

    // Receiving subfilters visibility
    setReceivingSubfiltersVisible(statsState.activePosition === 'Receiving');
    updateReceivingSubfilterButtons();

    // Active-view label
    const VIEW_LABELS = {
      ALL:       'OVERVIEW (ALL)',
      QB:        'PASSING (QB)',
      RB:        'RUSHING (RB)',
      Receiving: 'RECEIVING (W/T)',
      RDP:       'PICK VALUES'
    };
    if (dom.activeViewLabel) {
      dom.activeViewLabel.textContent = VIEW_LABELS[statsState.activePosition] || 'OVERVIEW (ALL)';
    }
  }

  // After a full render, sync tbody row heights across the two panes using ResizeObserver.
  // This ensures frozen and scroll rows are always the same height.
  function syncStatsPaneHeights(frozenTable, scrollTable) {
    if (!frozenTable || !scrollTable) return;
    const frozenRows  = Array.from(frozenTable.querySelectorAll('tbody tr'));
    const scrollRows  = Array.from(scrollTable.querySelectorAll('tbody tr'));
    const len = Math.min(frozenRows.length, scrollRows.length);
    for (let i = 0; i < len; i++) {
      const maxH = Math.max(frozenRows[i].offsetHeight, scrollRows[i].offsetHeight);
      if (maxH > 0) {
        frozenRows[i].style.height  = `${maxH}px`;
        scrollRows[i].style.height  = `${maxH}px`;
      }
    }
  }

  // Build a group-header <tr> whose cells span the columns in each group.
  function buildStatsGroupHeaderRow(columns, groups) {
    const tr = document.createElement('tr');
    const colToGroup = new Map();
    groups.forEach(g => g.columns.forEach(c => colToGroup.set(c, g.label)));

    let i = 0;
    while (i < columns.length) {
      const label = colToGroup.get(columns[i]) || null;
      let span = 1;
      while (i + span < columns.length && colToGroup.get(columns[i + span]) === label) span++;
      const th = document.createElement('th');
      th.className = 'stats-table__group-header-cell';
      th.colSpan = span;
      if (label) th.textContent = label;
      tr.appendChild(th);
      i += span;
    }
    return tr;
  }

  // Build a complete <table> for one pane (frozen or scroll).
  function buildPaneTable(columns, groups, tableRows, headerLabels) {
    const table = document.createElement('table');
    table.className = 'stats-table';

    // colgroup
    const colgroup = document.createElement('colgroup');
    columns.forEach(col => {
      const c = document.createElement('col');
      c.style.width = `${getColumnWidth(col)}px`;
      colgroup.appendChild(c);
    });
    table.appendChild(colgroup);

    // thead: group header row + column header row
    const thead = document.createElement('thead');
    thead.appendChild(buildStatsGroupHeaderRow(columns, groups));

    const colRow = document.createElement('tr');
    columns.forEach(col => {
      const th = document.createElement('th');
      th.dataset.columnKey = col;
      const w = getColumnWidth(col);
      th.style.width = `${w}px`;
      th.style.minWidth = `${w}px`;
      // Sort button label
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stats-sort-btn';
      btn.textContent = headerLabels.get(col) || col;
      th.appendChild(btn);
      if (statsState.sort.column === col) applySortIndicator(th);
      colRow.appendChild(th);
    });
    thead.appendChild(colRow);
    table.appendChild(thead);

    // tbody
    const tbody = document.createElement('tbody');
    buildBodyRowsInTbody(tbody, columns, tableRows);
    table.appendChild(tbody);
    return table;
  }

  // Render (or re-render) body rows into a given <tbody>.
  // tableRows is the array of { [column]: descriptor } objects built by renderTable.
  function buildBodyRowsInTbody(tbody, columns, tableRows) {
    tbody.innerHTML = '';
    tableRows.forEach(rowData => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        td.dataset.col = col;
        const descriptor = rowData[col];
        if (!descriptor) {
          td.textContent = '';
        } else if (typeof descriptor.render === 'function') {
          descriptor.render(td);
        } else {
          td.textContent = String(descriptor);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function formatCellValue(column, entry) {
    const { row, meta } = entry;
    if (column === 'PLAYER') {
      if (statsState.activePosition === 'RDP' || meta.pos === 'RDP') {
        return meta.fullName || meta.name || '';
      }
      // Stats table player-name label:
      // use the full player name on desktop where the frozen column has room,
      // but keep the abbreviated display name on mobile to protect narrow layouts.
      const useDesktopFullName = typeof window !== 'undefined' && window.innerWidth > MOBILE_BREAKPOINT;
      if (useDesktopFullName && meta.fullName) {
        return meta.fullName;
      }
      return meta.displayName || meta.fullName || row[column] || meta.name || '';
    }
    if (column === 'POS') return row[column] || meta.pos || '';
    if (column === 'TM') return row[column] || meta.team || 'FA';
    if (column === 'FPTS') {
      if (meta.fpts === null || Number.isNaN(meta.fpts)) return 'NA';
      return meta.fpts.toFixed(1);
    }
    if (column === 'PPG') {
      if (meta.ppg === null || Number.isNaN(meta.ppg)) return 'NA';
      return meta.ppg.toFixed(1);
    }
    // ADP columns — show one decimal, blank when absent.
    if (column === 'ADP') {
      if (meta.adp === null || !Number.isFinite(meta.adp)) return '';
      return meta.adp.toFixed(1);
    }
    if (column === 'POS·ADP') {
      if (meta.posAdp === null || !Number.isFinite(meta.posAdp)) return '';
      return meta.posAdp.toFixed(1);
    }
    if (column === 'VALUE') {
      const rawValue = row[column];
      const formatted = formatSheetCellValue(column, rawValue);
      if (formatted !== '') return formatted;
      if (Number.isFinite(meta.value)) return formatInteger(meta.value);
      return '';
    }
    if (column === 'AGE') {
      const formatted = formatSheetCellValue(column, row[column]);
      if (formatted !== '') return formatted;
      if (!Number.isFinite(meta.age) || meta.age <= 0) return '';
      return formatDecimal(meta.age, 1);
    }
    if (column === 'RK') {
      // Displayed RK is the row rank in the *current* filtered/sorted view.
      // (Underlying `row.RK` is still populated from the KTC workbook and used as the baseline order when sorting is cleared.)
      const rank = entry.meta.currentRank;
      if (rank === null || rank === undefined) return '';
      return formatInteger(rank);
    }
    // Handle pick-specific columns (YEAR, RANGE, ROUND)
    if (column === 'YEAR' || column === 'RANGE' || column === 'ROUND') {
      const pickName = meta.fullName || meta.name || '';
      const parsed = parsePickName(pickName);
      return parsed[column.toLowerCase()] || '';
    }
    const raw = row[column];
    const formatted = formatSheetCellValue(column, raw);
    if (formatted !== '') return formatted;
    if (raw === undefined || raw === null) return '';
    return raw;
  }
  function applySortIndicator(target) {
    if (!target) return;
    target.classList.remove('stats-sort-asc', 'stats-sort-desc', 'stats-sort-low-better');
    // Clean up any previously injected icons from older builds.
    target.querySelector('.stats-sort-icon')?.remove();

    // Stats table header icons need to distinguish high-better columns from
    // low-better columns like AGE/ADP so the active cue matches the sort intent.
    const usesLowBetterIcons = !!statsState.sort.column && LOWER_IS_BETTER_COLUMNS.has(statsState.sort.column);
    target.classList.toggle('stats-sort-low-better', usesLowBetterIcons);

    if (statsState.sort.direction === 1) {
      target.classList.add('stats-sort-asc');
    } else if (statsState.sort.direction === 2) {
      target.classList.add('stats-sort-desc');
    }
  }
  
  // updateTableRows: triggers a full re-render (delegates to renderTable).
  // Column structure doesn't change on sort/filter so this is always safe.
  function updateTableRows() {
    statsState.needsFullRebuild = true;
    renderTable();
  }
  
  function renderTable() {
    // === Data preparation: filter, sort, and assign current display ranks ===
    const dataset        = getActiveDataset();
    const availableColumns = statsState.availableColumns.get(statsState.currentTab);
    const baseColumnSet  = getColumnSet();
    const columnSet      = baseColumnSet.filter((col, idx) => {
      if (idx < 3) return true; // always keep frozen columns (RK / PLAYER / POS)
      if (statsState.activePosition === 'RDP' && ['YEAR','RANGE','ROUND'].includes(col)) return true;
      if (!availableColumns) return true;
      return availableColumns.has(col);
    });

    const headerLabels  = statsState.headerLabels.get(statsState.currentTab) || new Map();
    const filtered      = dataset.filter(passesFilters);
    const sortColumn    = (statsState.sort.column && columnSet.includes(statsState.sort.column))
                          ? statsState.sort.column : null;
    const hasOnlyPicks  = filtered.length > 0 && filtered.every(e => e.meta.pos === 'RDP');

    const sortCollection = coll => {
      if (!coll.length) return [];
      if (statsState.sort.direction === 0 || !statsState.sort.column) {
        return [...coll].sort((a, b) => (a.meta.rank ?? Infinity) - (b.meta.rank ?? Infinity));
      }
      return getSortedRows(coll, sortColumn || 'RK');
    };

    let sortedRows;
    if (statsState.activePosition === 'RDP' || hasOnlyPicks) {
      sortedRows = [...filtered];
    } else {
      const playerRows = [], pickRows = [];
      filtered.forEach(e => (e.meta.pos === 'RDP' ? pickRows : playerRows).push(e));
      sortedRows = [...sortCollection(playerRows), ...pickRows];
    }

    sortedRows.forEach((entry, idx) => {
      if (statsState.activePosition === 'RDP')  entry.meta.currentRank = idx + 1;
      else if (entry.meta.pos !== 'RDP')         entry.meta.currentRank = idx + 1;
      else                                        entry.meta.currentRank = null;
    });
    statsState.lastRenderedRows = sortedRows;

    // === Build per-cell descriptors (formatted values + category-specific coloring) ===
    const overviewRankColumns = (!statsState.activePosition || statsState.activePosition === 'ALL')
      ? columnSet.filter(col => OVERVIEW_RANKED_STAT_COLUMN_SET.has(col))
      : columnSet.filter(col => ALWAYS_RANKED_COLUMNS.has(col));
    const overviewRankColors = overviewRankColumns.length
      ? buildOverviewRankColorCache(filtered, overviewRankColumns) : null;

    // Helper: create a descriptor that applies inline style and handles the efficiency asterisk.
    const createTextDescriptor = (textOrDescriptor, style) => ({
      render: (td) => {
        const d = (typeof textOrDescriptor === 'object' && textOrDescriptor !== null)
          ? textOrDescriptor : { text: textOrDescriptor, asterisk: false };
        td.textContent = d.text ?? '';
        if (d.asterisk) {
          const star = document.createElement('span');
          star.className = 'stats-eff-asterisk';
          star.textContent = '\u273c'; // ✼
          td.appendChild(star);
        }
        if (style) Object.assign(td.style, style);
      }
    });

    // One descriptor object per (row, column) combination.
    const tableRows = sortedRows.map((entry, entryIndex) => {
      const rowData = {};
      for (const column of columnSet) {
        const textValue    = formatCellValue(column, entry);
        const displayValue = annotateEfficiencyValue(column, entry, textValue);
        const dText        = typeof displayValue === 'object' ? (displayValue.text ?? '') : displayValue;
        const dAsterisk    = typeof displayValue === 'object' ? !!displayValue.asterisk : false;

        if (column === 'PLAYER') {
          rowData[column] = {
            render: (td) => {
              td.classList.add('stats-player-cell');
              const isPickRow = entry.meta.pos === 'RDP' || !entry.meta.playerId;
              if (isPickRow) { td.textContent = dText; return; }
              // Player button wires into the shared game-logs modal via openGameLogs().
              const button = document.createElement('button');
              button.type = 'button';
              button.className = 'stats-player-btn';
              button.dataset.playerId   = entry.meta.playerId;
              button.dataset.entryIndex = entryIndex;
              button.textContent = dText;
              if (dAsterisk) {
                const star = document.createElement('span');
                star.className = 'stats-eff-asterisk';
                star.textContent = '\u273c';
                button.appendChild(star);
              }
              td.appendChild(button);
            }
          };
        } else if (column === 'POS') {
          const pos = (textValue || entry.meta.pos || '').trim().toUpperCase();
          rowData[column] = {
            render: (td) => {
              if (pos) {
                const tag = document.createElement('span');
                tag.className = `player-tag modal-pos-tag ${pos}`;
                tag.textContent = pos;
                td.appendChild(tag);
              }
            }
          };
        } else if (column === 'VALUE') {
          rowData[column] = {
            render: (td) => {
              const chip = document.createElement('span');
              chip.className = 'stats-value-chip';
              chip.style.cssText = entry.meta.valueStyle;
              chip.textContent = dText;
              if (dAsterisk) {
                const star = document.createElement('span');
                star.className = 'stats-eff-asterisk';
                star.textContent = '\u273c';
                chip.appendChild(star);
              }
              td.appendChild(chip);
            }
          };
        } else if (column === 'TM') {
          rowData[column] = {
            render: (td) => {
              if (entry.meta.pos === 'RDP') {
                td.innerHTML = '<span style="color:var(--color-text-secondary)">RDP</span>';
              } else {
                const teamKey = (textValue || 'FA').toUpperCase();
                const logoKeyMap = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };
                const nk  = logoKeyMap[teamKey] || teamKey.toLowerCase();
                const src = `../assets/NFL_logos_svg/${nk}.svg`;
                td.innerHTML = (teamKey && teamKey !== 'FA')
                  ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20">`
                  : `<span class="stats-team-chip" style="${entry.meta.teamStyle}">${dText}</span>`;
              }
            }
          };
        } else {
          const style = getConditionalCellStyle(column, entry, overviewRankColors);
          rowData[column] = createTextDescriptor(displayValue, style);
        }
      }
      return rowData;
    });

    // === Two-pane DOM build ===
    // Target structure inside #player-grid:
    //   div.table-frame
    //     div.table-pane--frozen   (RK / PLAYER / POS)
    //       table.stats-table  (colgroup + thead[group-row + col-row] + tbody)
    //     div.table-pane--scroll   (remaining columns, horizontally scrollable)
    //       table.stats-table  (colgroup + thead[group-row + col-row] + tbody)
    const FROZEN_COUNT   = 3;
    const frozenCols     = columnSet.slice(0, FROZEN_COUNT);
    const scrollCols     = columnSet.slice(FROZEN_COUNT);
    const activeCategory = POSITION_TO_CATEGORY[statsState.activePosition] || 'overview';
    const scrollGroups   = STATS_COLUMN_GROUPS[activeCategory] || [];

    const frozenTable = buildPaneTable(frozenCols, STATS_FROZEN_GROUP, tableRows, headerLabels);
    const scrollTable = buildPaneTable(scrollCols, scrollGroups,       tableRows, headerLabels);

    const frozenPane = document.createElement('div');
    frozenPane.className = 'table-pane--frozen';
    frozenPane.appendChild(frozenTable);

    const scrollPane = document.createElement('div');
    scrollPane.className = 'table-pane--scroll';
    scrollPane.appendChild(scrollTable);

    // Vertical scroll sync: scrolling the scroll pane mirrors the frozen pane.
    scrollPane.addEventListener('scroll', () => {
      frozenPane.scrollTop = scrollPane.scrollTop;
    }, { passive: true });

    const frame = document.createElement('div');
    frame.className = 'table-frame';
    frame.appendChild(frozenPane);
    frame.appendChild(scrollPane);

    // Mount into the #player-grid container.
    if (dom.gridContainer) {
      dom.gridContainer.replaceChildren(frame);
    }

    // Persist tbody references (not used for partial updates, but available if needed).
    statsState.currentFrozenTbody = frozenTable.querySelector('tbody');
    statsState.currentScrollTbody = scrollTable.querySelector('tbody');
    statsState.currentScrollPane  = scrollPane;
    statsState.currentFrozenPane  = frozenPane;
    statsState.needsFullRebuild   = false;

    // Refresh meta labels and all button active states.
    updateRowCount(sortedRows.length);
    syncUiState();
    hideGridOverlay();

    // Sync cross-pane row heights after the browser has done layout.
    requestAnimationFrame(() => syncStatsPaneHeights(frozenTable, scrollTable));
  }
  function openGameLogs(entry) {
    if (typeof handlePlayerNameClick !== 'function') return;
    const { meta } = entry;
    // Picks (RDP) have no player game logs.
    if (!meta?.playerId || meta.pos === 'RDP') return;
    // Stats tabs represent value context (1QB vs SFLX). Use the active tab's KTC dataset here.
    const ktcDataset = statsState.currentTab === 'sflx' ? state.sflxData : state.oneQbData;
    const valuations = ktcDataset?.[meta.playerId];
    
    // Get calculated ranks from cache
    const ranks = statsState.rankCache?.[meta.playerId] || {};
    
    if (typeof state === 'object') {
      state.isGameLogModalOpenFromComparison = false;
      // Set flag to tell app.js to use sheet data instead of matchup data
      state.isGameLogFromStatsPage = true;
      
      // Pass season stats data AND calculated ranks to app.js for game logs display
      state.statsPagePlayerData = {
        fpts: meta.fpts,
        ppg: meta.ppg,
        gamesPlayed: meta.gmPlayed,
        // Stats page game logs modal source of truth:
        // preserve the `SZN.csv` team/position so app.js can ignore external team fallbacks.
        team: meta.team,
        pos: meta.pos,
        posRank: ranks.posRank || null,
        overallRank: ranks.overallRank || null,
        ppgPosRank: ranks.ppgPosRank || null,
        ppgOverallRank: ranks.ppgOverallRank || null
      };
    }
    
    // Ensure weekly stats are loaded before opening game logs
    // If still loading, handlePlayerNameClick will show loading state
    if (typeof state !== 'undefined' && !state.statsSheetsLoaded && typeof fetchPlayerStatsSheets === 'function') {
      // Trigger load if not already started, but don't block - handlePlayerNameClick handles this
      fetchPlayerStatsSheets().catch(err => console.warn('Failed to load weekly stats:', err));
    }
    
    const player = {
      id: meta.playerId,
      name: meta.name,
      pos: meta.pos,
      team: meta.team,
      ktc: valuations?.ktc ?? entry.meta.value ?? 0,
      posRank: meta.posRankText,
      overallRank: meta.rank
    };
    handlePlayerNameClick(player);
  }
  let escapeKeyBound = false;
  function performModalClose() {
    if (typeof closeModal === 'function') {
      closeModal();
    } else if (gameLogDom.modal) {
      gameLogDom.modal.classList.add('hidden');
      
      // Hide all overlay panels
      gameLogDom.keyPanel?.classList.add('hidden');
      gameLogDom.radarPanel?.classList.add('hidden');
      gameLogDom.consistencyPanel?.classList.add('hidden');
      
      // Reset to game-logs active state
      const modalInfoBtns = document.querySelectorAll('#game-logs-modal .modal-info-btn');
      modalInfoBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-panel') === 'game-logs') {
          btn.classList.add('active');
        }
      });
    }
    
    if (typeof state === 'object') {
      state.isGameLogModalOpenFromComparison = false;
      state.isGameLogFromStatsPage = false;
      state.statsPagePlayerData = null;
      state.currentGameLogsPlayer = null;
    }
  }
  function wireGameLogControls() {
    if (!gameLogDom.modal) return;
    
    if (!gameLogDom.modal.dataset.statsWired) {
      // Stats page Game Logs modal: delegate close clicks so the same close handler
      // works for both the default Game Logs pane and the inline Ownership pane.
      gameLogDom.modal.addEventListener('click', (event) => {
        if (event.target?.closest?.('.modal-close-btn')) {
          performModalClose();
        }
      });
      gameLogDom.overlay?.addEventListener('click', performModalClose);
      
      // Panel toggle buttons with tab-like behavior
      const modalInfoBtns = document.querySelectorAll('#game-logs-modal .modal-info-btn');
      modalInfoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
      const targetPanel = btn.getAttribute('data-panel');
      const overlayContainers = {
        'stats-key': gameLogDom.keyPanel,
        'radar-chart': gameLogDom.radarPanel,
        'consistency': gameLogDom.consistencyPanel
      };
          
          // Special handling for game-logs - can't be toggled off
          if (targetPanel === 'game-logs') {
            // Hide all overlay panels to show game logs underneath
            Object.values(overlayContainers).forEach(container => {
              if (container) container.classList.add('hidden');
            });
            
            // Update button active states
            modalInfoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            return;
          }
          
          // Check if the clicked overlay panel is currently visible
          const isCurrentlyVisible = overlayContainers[targetPanel] && 
                                     !overlayContainers[targetPanel].classList.contains('hidden');
          
          // For overlay panels (stats-key, radar-chart, consistency)
          if (isCurrentlyVisible) {
            // Toggling off - return to game-logs view
            overlayContainers[targetPanel].classList.add('hidden');
            
            // Update button active states - activate game-logs
            modalInfoBtns.forEach(b => {
              b.classList.remove('active');
              if (b.getAttribute('data-panel') === 'game-logs') {
                b.classList.add('active');
              }
            });
          } else {
            // Opening a new overlay panel - hide other overlays first
            Object.values(overlayContainers).forEach(container => {
              if (container) container.classList.add('hidden');
            });
            
            // Show the target overlay panel
            overlayContainers[targetPanel].classList.remove('hidden');
            
            // Update button active states
            modalInfoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // If opening radar chart panel, render chart
            if (targetPanel === 'radar-chart' && typeof renderPlayerRadarChart === 'function') {
              const player = state.currentGameLogsPlayer;
              if (player && player.pos) {
                renderPlayerRadarChart(player.id, player.pos);
              }
            }
            // If opening consistency panel, render chart
            if (targetPanel === 'consistency' && typeof renderConsistencyChart === 'function') {
              renderConsistencyChart();
            }
          }
        });
      });
      
      gameLogDom.modal.dataset.statsWired = '1';
    }
    
    if (!escapeKeyBound) {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && gameLogDom.modal && !gameLogDom.modal.classList.contains('hidden')) {
          performModalClose();
        }
      });
      escapeKeyBound = true;
    }
  }
  function toggleTab(tabKey) {
    // tabKey is 'oneQb' or 'sflx'; map to primary-tab button values '1-QB' / 'SFLX'.
    const tabBtnValue = tabKey === 'sflx' ? 'SFLX' : '1-QB';
    if (statsState.currentTab === tabKey) return;
    statsState.currentTab = tabKey;
    statsState.sort = { column: 'FPTS', direction: 2 };
    statsState.needsFullRebuild = true;

    // Untoggle Pick Values (RDP) when switching tabs.
    if (statsState.activePosition === 'RDP') {
      statsState.activePosition = 'ALL';
    }

    // Update primary-tab button active states.
    dom.primaryTabButtons.forEach(btn => {
      const isActive = btn.dataset.primaryTab === tabBtnValue;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (!statsState.datasets.has(tabKey)) {
      toggleInlineLoading(true);
      loadTabData(tabKey).then(() => {
        const dataset = statsState.datasets.get(tabKey);
        if (dataset) statsState.rankCache = buildStatsPageRankCache(dataset);
        toggleInlineLoading(false);
        renderTable();
      }).catch(() => toggleInlineLoading(false));
    } else {
      const dataset = statsState.datasets.get(tabKey);
      if (dataset) statsState.rankCache = buildStatsPageRankCache(dataset);
      renderTable();
    }
  }
  function handleSortClick(event) {
    if (statsState.activePosition === 'RDP') return;
    const dataset = getActiveDataset();
    const visibleRows = dataset.filter(passesFilters);
    if (visibleRows.length && visibleRows.every((entry) => entry.meta.pos === 'RDP')) return;
    const th = event.target.closest('th[data-column-key]');
    if (!th) return;
    const column = th.dataset.columnKey;
    if (!column) return;
    const columnSet = getColumnSet();
    if (!columnSet.includes(column)) return;
    if (statsState.sort.column !== column) {
      // Lower-is-better columns sort ascending first; every other column keeps the
      // existing descending-first behavior where larger numbers are treated as better.
      const startDir = LOWER_IS_BETTER_COLUMNS.has(column) ? 1 : 2;
      statsState.sort = { column, direction: startDir };
    } else {
      // Cycle: start -> opposite -> reset (always 3rd click = reset).
      // Normal columns: desc(2) -> asc(1) -> reset(0)
      // Lower-is-better columns: asc(1) -> desc(2) -> reset(0)
      if (statsState.sort.direction === 2) {
        if (LOWER_IS_BETTER_COLUMNS.has(column)) {
          // Lower-is-better columns reset on the 3rd tap after showing both directions.
          statsState.sort.direction = 0;
          statsState.sort.column = null;
        } else {
          statsState.sort.direction = 1;
        }
      } else if (statsState.sort.direction === 1) {
        if (LOWER_IS_BETTER_COLUMNS.has(column)) {
          statsState.sort.direction = 2;
        } else {
          statsState.sort.direction = 0;
          statsState.sort.column = null;
        }
      } else {
        statsState.sort.direction = 0;
        statsState.sort.column = null;
      }
    }
    // Use fast row update instead of full re-render
    updateTableRows();
  }
  
  let searchDebounceTimer = null;
  function handleSearchInput(event) {
    const term = event.target.value || '';
    // Debounce to avoid re-rendering on every keystroke.
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      statsState.searchTerm = term.trim().toLowerCase();
      statsState.needsFullRebuild = true;
      renderTable();
      searchDebounceTimer = null;
    }, 200);
  }
  function clearSearch() {
    if (searchDebounceTimer) { clearTimeout(searchDebounceTimer); searchDebounceTimer = null; }
    if (dom.searchInput) dom.searchInput.value = '';
    statsState.searchTerm = '';
    statsState.needsFullRebuild = true;
    renderTable();
    if (dom.searchInput) dom.searchInput.focus();
  }
  function handleFilterClick(event) {
    // Handles clicks on category chips (data-category) and the PICK VALUES pill.
    // Maps data-category → internal activePosition value via CATEGORY_TO_POSITION.
    const chip = event.target.closest('[data-category]');
    if (!chip) return;
    const category = chip.dataset.category;
    if (!category) return;

    // Rookies chip is handled separately by handleRookieClick — skip here.
    if (category === 'rookies') return;

    const newPosition = CATEGORY_TO_POSITION[category] || 'ALL';
    const prevPosition = statsState.activePosition;

    // RDP toggle: clicking again while active deactivates it.
    if (category === 'rdp') {
      statsState.activePosition = (prevPosition === 'RDP') ? 'ALL' : 'RDP';
    } else {
      if (newPosition === prevPosition) return; // already active — no change
      statsState.activePosition = newPosition;
    }

    statsState.sort = statsState.activePosition === 'RDP'
      ? { column: null, direction: 0 }
      : { column: 'FPTS', direction: 2 };

    syncReceivingSubfilterUi({
      ensureReset: statsState.activePosition === 'Receiving' && prevPosition !== 'Receiving'
    });
    statsState.needsFullRebuild = true;
    renderTable();
  }
  function handleReceivingSubfilterClick(event) {
    // Uses data-receiving-filter (new HTML) with dataset.subfilter as fallback.
    const btn = event.target.closest('[data-receiving-filter]');
    if (!btn) return;
    event.stopPropagation();
    if (statsState.activePosition !== 'Receiving') return;
    const key = btn.dataset.receivingFilter || btn.dataset.subfilter;
    if (!key || !RECEIVING_SUBFILTERS.includes(key)) return;
    const isActive = !!statsState.receivingSubfilters[key];
    if (isActive) {
      const activeCount = RECEIVING_SUBFILTERS.reduce(
        (count, k) => (statsState.receivingSubfilters[k] ? count + 1 : count), 0
      );
      if (activeCount <= 1) return; // always keep at least one subfilter active
    }
    statsState.receivingSubfilters[key] = !isActive;
    updateReceivingSubfilterButtons();
    updateTableRows();
  }
  function handleRookieClick() {
    statsState.rookieOnly = !statsState.rookieOnly;
    if (dom.rookieChip) {
      dom.rookieChip.classList.toggle('is-active', statsState.rookieOnly);
      dom.rookieChip.setAttribute('aria-pressed', statsState.rookieOnly ? 'true' : 'false');
    }
    statsState.sort = statsState.activePosition === 'RDP'
      ? { column: null, direction: 0 }
      : { column: 'FPTS', direction: 2 };
    updateTableRows();
  }
  function toggleRookieFilter() { handleRookieClick(); }
  function toggleInlineLoading(show) {
    if (!dom.loading) return;
    dom.loading.classList.toggle('hidden', !(show || statsLoadingLocked));
  }
  async function ensureLeagueContext() {
    const username = params.get('username');
    const leagueId = params.get('leagueId');
    if (!username) return;
    try {
      await fetchAndSetUser(username);
      const leagues = await fetchUserLeagues(state.userId);
      state.leagues = leagues;
      let targetLeague = leagues.find((l) => l.league_id === leagueId);
      if (!targetLeague) {
        targetLeague = leagues[0];
      }
      if (targetLeague) {
        state.currentLeagueId = targetLeague.league_id;
        const rosterPositions = targetLeague.roster_positions || [];
        const superflexSlots = rosterPositions.filter((p) => p === 'SUPER_FLEX').length;
        const qbSlots = rosterPositions.filter((p) => p === 'QB').length;
        state.isSuperflex = (superflexSlots > 0) || (qbSlots > 1);
      }
      if (dom.leagueChip) {
        dom.leagueChip.textContent = 'DH DATA HUB – ADVANCED ANALYTICS';
      }
    } catch (error) {
      if (dom.leagueChip) {
        dom.leagueChip.textContent = 'DH DATA HUB – ADVANCED ANALYTICS';
      }
      console.warn('Unable to resolve league context for stats page:', error);
    }
  }
  // === Stats table data source ===
  // Stats page table now uses season totals from the shipped CSV:
  // `DH_P2.53/data/NFL-2025_Stats/SZN.csv`
  // Trade VALUE + RK + RDP (pick values) are sourced from the same KTC workbook as the Rosters player cards:
  // `KTC_1QB` / `KTC_SFLX` loaded by `fetchDataFromGoogleSheet()` in `app.js`.
  // Join keys:
  // - Players: `SLPR_ID` (SZN.csv) ↔ `SLPR_ID` (KTC sheets)
  // - Picks: keyed by `PLAYER NAME` in the KTC sheets with `POS = RDP` (no `SLPR_ID`)
  const STATS_TABLE_SOURCE_QUERY_PARAM = 'statsTableSource';
  const STATS_SEASON_CSV_URL = new URL('../data/NFL-2025_Stats/SZN.csv', window.location.href).toString();
  let seasonCsvTextPromise = null;
  let seasonBasePromise = null;

  function shouldUseStatsGoogleSheets() {
    // Kept for quick rollback/testing: `?statsTableSource=sheets`
    try {
      const raw = (params.get(STATS_TABLE_SOURCE_QUERY_PARAM) || '').trim().toLowerCase();
      return raw === 'sheets' || raw === 'sheet' || raw === 'google';
    } catch (e) {
      return false;
    }
  }

  function getKtcDatasetForTab(tabKey) {
    // Tabs represent value context (1QB vs SFLX) — not different stat seasons.
    return tabKey === 'sflx' ? state.sflxData : state.oneQbData;
  }

  async function fetchSheetCsv(sheetName) {
    // Legacy source (no longer used by default).
    const sheetId = typeof PLAYER_STATS_SHEET_ID !== 'undefined'
      ? PLAYER_STATS_SHEET_ID
      : '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
    return response.text();
  }

  async function fetchSeasonCsvText() {
    if (seasonCsvTextPromise) return seasonCsvTextPromise;
    seasonCsvTextPromise = fetch(STATS_SEASON_CSV_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch SZN.csv: ${response.status}`);
        return response.text();
      })
      .finally(() => {
        seasonCsvTextPromise = null;
      });
    return seasonCsvTextPromise;
  }

  async function loadSeasonBase() {
    if (seasonBasePromise) return seasonBasePromise;
    seasonBasePromise = (async () => {
      const csv = await fetchSeasonCsvText();
      const { headers, rows, headerDisplay } = parseCsv(csv);
      const parsedRows = rows.map((values) => normalizeHeadersRow(headers, values));
      return { headers, parsedRows, headerDisplay };
    })().catch((err) => {
      seasonBasePromise = null;
      throw err;
    });
    return seasonBasePromise;
  }

  // --- ADP data from the ADP_2026 tab in the same KTC workbook ---
  // Fetched once, stored in a module-scoped cache keyed by SLPR_ID.
  // Each entry: { sflxAdp, pprAdp, posAdp, posSfAdp }
  let adpDataCache = null;
  let adpFetchPromise = null;

  async function fetchAdpData() {
    if (adpDataCache) return adpDataCache;
    if (adpFetchPromise) return adpFetchPromise;
    adpFetchPromise = (async () => {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('ADP_2026')}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`ADP_2026 fetch failed: ${res.status}`);
        const csv = await res.text();
        const { headers, rows } = parseCsv(csv);
        const idx = (name) => headers.indexOf(name);
        const map = {};
        rows.forEach((cols) => {
          const id = (cols[idx('SLPR_ID')] || '').trim();
          if (!id) return;
          const toF = (v) => { const n = parseFloat(v); return Number.isNaN(n) ? null : n; };
          map[id] = {
            sflxAdp: toF(cols[idx('SFLX_ADP')]),
            pprAdp: toF(cols[idx('PPR_ADP')]),
            posAdp: toF(cols[idx('POS_ADP')]),
            posSfAdp: toF(cols[idx('P-SF_ADP')])
          };
        });
        adpDataCache = map;
        return map;
      } catch (e) {
        console.error('Failed to fetch ADP_2026 data:', e);
        adpDataCache = {};
        return adpDataCache;
      } finally {
        adpFetchPromise = null;
      }
    })();
    return adpFetchPromise;
  }

  function computePpg({ fpts, games }) {
    if (!Number.isFinite(fpts)) return null;
    if (!Number.isFinite(games) || games <= 0) return null;
    return fpts / games;
  }

  function buildRdpRowsFromKtcDataset(ktcDataset) {
    const out = [];
    const entries = ktcDataset && typeof ktcDataset === 'object'
      ? Object.entries(ktcDataset)
      : [];
    entries.forEach(([key, value]) => {
      if (!value || value.pos !== 'RDP') return;
      out.push({
        // No SLPR_ID for picks; the table derives YEAR/RANGE/ROUND from the name.
        PLAYER: key,
        POS: 'RDP',
        VALUE: value.ktc ?? '',
        RK: value.overallRank ?? '',
        AGE: value.age ?? '',
        TM: value.team ?? '',
        G: '',
        FPTS: '',
        PPG: ''
      });
    });
    // Stable, human-friendly ordering for picks: year asc, round asc, range asc.
    out.sort((a, b) => {
      const pa = parsePickName(a.PLAYER);
      const pb = parsePickName(b.PLAYER);
      const ya = parseInt(pa.year || '', 10);
      const yb = parseInt(pb.year || '', 10);
      if (Number.isFinite(ya) && Number.isFinite(yb) && ya !== yb) return ya - yb;
      const ra = pa.round || '';
      const rb = pb.round || '';
      if (ra !== rb) return ra.localeCompare(rb);
      return (pa.range || '').localeCompare(pb.range || '');
    });
    return out;
  }
  async function loadTabData(tabKey) {
    const tab = TAB_CONFIG[tabKey];
    if (!tab) return;
    const ktcDataset = getKtcDatasetForTab(tabKey);

    // Default source: local season totals CSV.
    if (!shouldUseStatsGoogleSheets()) {
      const { headers, parsedRows, headerDisplay } = await loadSeasonBase();
      const available = new Set(headers);
      // Computed / externally-sourced columns that the table expects.
      ['RK', 'VALUE', 'PPG', 'ADP', 'POS·ADP'].forEach((col) => available.add(col));
      // RDP view columns are derived from the pick name, but keep them as "available" for clarity.
      ['YEAR', 'RANGE', 'ROUND'].forEach((col) => available.add(col));

      // ADP data from ADP_2026 sheet (tab-aware mapping).
      const adpMap = adpDataCache || {};

      const augmentedRows = parsedRows.map((row) => {
        const nextRow = { ...row };
        const playerId = nextRow.SLPR_ID || nextRow.slpr_id || '';
        const ktc = playerId ? ktcDataset?.[playerId] : null;

        // Trade value context (from KTC workbook).
        if (ktc) {
          nextRow.VALUE = ktc.ktc ?? nextRow.VALUE ?? '';
          nextRow.RK = ktc.overallRank ?? nextRow.RK ?? '';
          nextRow['POS | RK'] = ktc.posRank ?? nextRow['POS | RK'] ?? '';
          nextRow.RY = ktc.rookieYear ?? nextRow.RY ?? '';
          nextRow.EXP = ktc.exp ?? nextRow.EXP ?? '';
          nextRow.TIER = ktc.tier ?? nextRow.TIER ?? '';
          nextRow.TREND = ktc.trend ?? nextRow.TREND ?? '';
        } else {
          if (nextRow.VALUE === undefined) nextRow.VALUE = '';
          if (nextRow.RK === undefined) nextRow.RK = '';
        }

        // ADP values from ADP_2026 sheet (tab-aware: 1QB uses PPR_ADP / POS_ADP, SFLX uses SFLX_ADP / POS_SF-ADP).
        const adpEntry = playerId ? adpMap[playerId] : null;
        if (adpEntry) {
          nextRow.ADP = tabKey === 'sflx' ? adpEntry.sflxAdp : adpEntry.pprAdp;
          nextRow['POS\u00b7ADP'] = tabKey === 'sflx' ? adpEntry.posSfAdp : adpEntry.posAdp;
        } else {
          nextRow.ADP = null;
          nextRow['POS\u00b7ADP'] = null;
        }

        // PPG is not present in SZN.csv; compute it from FPTS and G.
        const fpts = toNumber(nextRow.FPTS);
        const games = toNumber(nextRow.G, { allowFloat: false });
        const ppg = computePpg({ fpts, games });
        nextRow.PPG = Number.isFinite(ppg) ? ppg.toFixed(2) : '';

        return nextRow;
      });

      // Append pick rows (RDP) sourced from the same KTC workbook.
      const rdpRows = buildRdpRowsFromKtcDataset(ktcDataset);
      const enriched = [...augmentedRows, ...rdpRows].map(buildRow);

      const labels = new Map(headerDisplay);
      ['RK', 'VALUE', 'PPG', 'G', 'FPTS', 'PLAYER'].forEach((col) => {
        if (!labels.has(col)) labels.set(col, col);
      });
      // ADP column labels
      labels.set('ADP', 'ADP');
      labels.set('POS·ADP', 'POS·ADP');

      statsState.datasets.set(tabKey, enriched);
      statsState.headerLabels.set(tabKey, labels);
      statsState.availableColumns.set(tabKey, available);
      return;
    }

    // Rollback path: Google Sheets STAT_1QB / STAT_SFLX.
    const csv = await fetchSheetCsv(tab.sheet);
    const { headers, rows, headerDisplay } = parseCsv(csv);
    const parsedRows = rows.map((values) => normalizeHeadersRow(headers, values));
    const enriched = parsedRows.map(buildRow);
    statsState.datasets.set(tabKey, enriched);
    statsState.headerLabels.set(tabKey, new Map(headerDisplay));
    statsState.availableColumns.set(tabKey, new Set(headers));
  }
  async function loadAllTabs() {
    await Promise.all(Object.keys(TAB_CONFIG).map(loadTabData));
  }
  async function initialise() {
    // Show overlay while data loads.
    showGridOverlay({ title: 'Preparing Stats Data', body: 'Loading season data…', showActions: false });
    toggleInlineLoading(true);
    try {
      await ensureLeagueContext();
      if (typeof fetchSleeperPlayers === 'function') await fetchSleeperPlayers();
      // KTC workbook provides VALUE and pick (RDP) rows.
      if (typeof fetchDataFromGoogleSheet === 'function') await fetchDataFromGoogleSheet();
      await fetchAdpData();
      await loadAllTabs();
      scheduleTeamLogoPreload();

      const initialDataset = statsState.datasets.get(statsState.currentTab);
      if (initialDataset) statsState.rankCache = buildStatsPageRankCache(initialDataset);

      syncReceivingSubfilterUi();
      statsState.needsFullRebuild = true;
      renderTable();         // hides overlay, calls syncUiState
      wireGameLogControls();

      if (typeof fetchPlayerStatsSheets === 'function') {
        fetchPlayerStatsSheets().catch(err => console.warn('Background weekly stats load failed:', err));
      }
    } catch (error) {
      console.error('Failed to initialise stats page:', error);
      showGridOverlay({ title: 'Error Loading Stats', body: 'Unable to load stats data at this time.', showActions: false });
    } finally {
      toggleInlineLoading(false);
      try { setLoading(false); } catch (_) { /* ignore */ }
    }
  }

  // ── Primary tab buttons (1-QB / SFLX) ─────────────────────────────────────
  dom.primaryTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleTab(btn.dataset.primaryTab === 'SFLX' ? 'sflx' : 'oneQb');
    });
  });

  // ── Category chips + PICK VALUES pill ─────────────────────────────────────
  dom.categoryButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));
  if (dom.rdpButton) dom.rdpButton.addEventListener('click', handleFilterClick);

  // ── Rookies chip ──────────────────────────────────────────────────────────
  if (dom.rookieChip) dom.rookieChip.addEventListener('click', handleRookieClick);

  // ── Receiving subfilters ──────────────────────────────────────────────────
  if (dom.receivingSubfilters) {
    dom.receivingSubfilters.addEventListener('click', handleReceivingSubfilterClick);
  }

  // ── Search input ──────────────────────────────────────────────────────────
  if (dom.searchInput) dom.searchInput.addEventListener('input', handleSearchInput);

  // ── Table interaction: sort + player row click (event delegation) ─────────
  if (dom.gridContainer) {
    dom.gridContainer.addEventListener('click', event => {
      const th = event.target.closest('th[data-column-key]');
      if (th) { handleSortClick(event); return; }
      const btn = event.target.closest('.stats-player-btn');
      if (btn) {
        const idx   = parseInt(btn.dataset.entryIndex, 10);
        const entry = statsState.lastRenderedRows[idx];
        if (entry) openGameLogs(entry);
      }
    });
  }

  // ── Stats Key Popup ───────────────────────────────────────────────────────
  const statsKeyButton   = document.getElementById('statsKeyButton');
  const statsKeyPopup    = document.getElementById('statsKeyPopup');
  const statsKeyPopupClose = document.getElementById('statsKeyPopupClose');

  if (statsKeyButton && statsKeyPopup && statsKeyPopupClose) {
    statsKeyButton.addEventListener('click', () => statsKeyPopup.classList.add('visible'));
    statsKeyPopupClose.addEventListener('click', () => statsKeyPopup.classList.remove('visible'));
    statsKeyPopup.addEventListener('click', e => {
      if (e.target === statsKeyPopup) statsKeyPopup.classList.remove('visible');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && statsKeyPopup.classList.contains('visible')) {
        statsKeyPopup.classList.remove('visible');
      }
    });
  }

  initialise();
})();

