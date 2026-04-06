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
  const PRIMARY_TITLES = {
    oneQb: '1QB ADP, TRADE VALUES & 2025 STATS',
    sflx: 'SFLX ADP, TRADE VALUES & 2025 STATS'
  };
  const CATEGORY_LABELS = {
    ALL: 'Overview (ALL)',
    QB: 'Passing (QB)',
    RB: 'Rushing (RB)',
    Receiving: 'Receiving (W/T)',
    RDP: 'Pick Values',
    Rookies: 'Rookies'
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
    QB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'paYDS', 'paTD', 'CMP%', 'paATT', 'paRTG', 'EPA/DB', 'CPOE', 'CMP', 'YDS(t)', 'paYPG', 'pa1D', 'IMP/G', 'pIMP', 'pIMP/A', 'TTT', 'PRS%', 'SAC', 'INT', 'ruYDS', 'ruTD', 'CAR', 'YPC', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    RB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'SNP%', 'YPC', 'ruYPG', 'IMP/G', 'CAR', 'ruYDS', 'ruTD', 'ru1D', 'YDS(t)', 'FUM', 'REC', 'recYDS', 'recTD', 'rec1D', 'YAC', 'TGT', 'ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'RYOE', 'EXPLSV%', 'FPOE', 'CSTY%', 'CL'],
    WR: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'AY%', 'YAC', 'YPR', 'IMP/G', 'RR', 'YDS(t)', 'RZ Tgt', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    TE: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'AY%', 'YAC', 'YPR', 'IMP/G', 'RR', 'YDS(t)', 'RZ Tgt', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    RDP: ['RK', 'PLAYER', 'POS', 'YEAR', 'RANGE', 'ROUND', 'VALUE']
  };
  const FROZEN_GROUP = [{ label: 'GENERAL', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', columns: ['RK', 'PLAYER', 'POS'] }];
  const COLUMN_GROUPS = {
    default: [
      { label: 'INFO', icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>', columns: ['TM', 'AGE'] },
      { label: 'FANTASY', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', columns: ['FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP'] },
      { label: 'OVERVIEW STATS', icon: 'M18 20V10M12 20V4M6 20v-6', columns: ['G', 'SNP%', 'YDS(t)', 'YPG(t)', 'OPP', 'IMP', 'IMP/OPP', 'CSTY%', 'CL'] }
    ],
    QB: [
      { label: 'INFO', icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>', columns: ['TM', 'AGE', 'G'] },
      { label: 'FANTASY', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', columns: ['FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP'] },
      { label: 'PASSING', icon: '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>', columns: ['paYDS', 'paTD', 'CMP%', 'paATT', 'paRTG', 'EPA/DB', 'CPOE', 'CMP', 'YDS(t)', 'paYPG', 'pa1D', 'IMP/G', 'pIMP', 'pIMP/A', 'TTT', 'PRS%', 'SAC', 'INT'] },
      { label: 'RUSHING', icon: 'M13 10V3L4 14h7v7l9-11h-7z', columns: ['ruYDS', 'ruTD', 'CAR', 'YPC', 'FUM'] },
      { label: 'CEILING & CONSISTENCY', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', columns: ['FPOE', 'CSTY%', 'CL'] }
    ],
    RB: [
      { label: 'INFO', icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>', columns: ['TM', 'AGE', 'G'] },
      { label: 'FANTASY', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', columns: ['FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP'] },
      { label: 'RUSHING EFFICIENCY', icon: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z', columns: ['SNP%', 'YPC', 'ruYPG', 'IMP/G'] },
      { label: 'RUSHING PRODUCTION', icon: 'M22 7 12 17 7 12 2 17', columns: ['CAR', 'ruYDS', 'ruTD', 'ru1D', 'YDS(t)', 'FUM'] },
      { label: 'RECEIVING', icon: '<g transform="rotate(-90 12 12)"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></g>', columns: ['REC', 'recYDS', 'recTD', 'rec1D', 'YAC', 'TGT'] },
      { label: 'ADVANCED RUSHING', icon: '<path d="m10.586 5.414-5.172 5.172"/><path d="m18.586 13.414-5.172 5.172"/><path d="M6 12h12"/><circle cx="12" cy="20" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="4" cy="12" r="2"/>', columns: ['ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'RYOE', 'EXPLSV%'] },
      { label: 'CEILING & CONSISTENCY', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', columns: ['FPOE', 'CSTY%', 'CL'] }
    ],
    WR: [
      { label: 'INFO', icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>', columns: ['TM', 'AGE', 'G'] },
      { label: 'FANTASY', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', columns: ['FPTS', 'PPG', 'VALUE', 'ADP', 'POS·ADP'] },
      { label: 'RECEIVING', icon: '<g transform="rotate(-90 12 12)"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></g>', columns: ['SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'AY%', 'YAC', 'YPR', 'IMP/G', 'RR', 'YDS(t)', 'RZ Tgt'] },
      { label: 'RUSHING', icon: 'M13 10V3L4 14h7v7l9-11h-7z', columns: ['CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM'] },
      { label: 'CEILING & CONSISTENCY', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', columns: ['FPOE', 'CSTY%', 'CL'] }
    ],
    RDP: [
      { label: 'PICK DETAILS', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', columns: ['YEAR', 'RANGE', 'ROUND'] },
      { label: 'MARKET VALUE', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', columns: ['VALUE'] }
    ]
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
    // Performance optimization state
    needsFullRebuild: true,
    currentContainer: null,
    scrollPositions: { horizontal: 0, vertical: 0 }
  };
  const dom = {
    tabButtons: Array.from(document.querySelectorAll('.stats-tab-button')),
    // The rebuilt DataHub shell uses a single live table panel instead of one wrapper per tab,
    // and it no longer renders legacy tab-heading nodes inside the hero copy.
    tabHeadings: Array.from(document.querySelectorAll('[data-tab-heading]')),
    tableWrappers: Array.from(document.querySelectorAll('.stats-table-wrapper')),
    tableWrapper: document.querySelector('.stats-table-wrapper'),
    grid: document.getElementById('playerGrid'),
    loading: document.getElementById('statsGridOverlay'),
    loadingTitle: document.getElementById('statsGridOverlayTitle'),
    loadingDescription: document.getElementById('statsGridOverlayDescription'),
    emptyState: document.getElementById('statsEmptyState'),
    searchInput: document.getElementById('statsSearchInput'),
    searchClear: document.getElementById('statsSearchClear'),
    filterGroup: document.getElementById('statsFilterGroup'),
    rookieButton: document.querySelector('.stats-rookie-btn'),
    secondaryFilterGroup: document.getElementById('statsSecondaryFilterGroup'),
    leagueChip: document.getElementById('statsLeagueContext'),
    mainTitle: document.getElementById('statsMainTitle'),
    activeViewLabel: document.getElementById('statsActiveViewLabel'),
    rowCount: document.getElementById('statsRowCount'),
    receivingFilterWrapper: document.querySelector('.stats-filter-with-subfilters'),
    receivingButton: document.querySelector('.stats-filter-btn-receiving')
  };
  // Allow forcing the inline stats-table loader via DevTools, similar to the global `setLoading()` helper.
  // Usage (Stats page only):
  //   setLoading(true);
  //   setLoading(false);
  let statsLoadingLocked = false;
  let statsLoadingDefaultText = null;
  function setStatsLoading(isLoading, message) {
    if (!dom.loading) return;
    const textEl = dom.loadingDescription;
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
  dom.receivingSubfilters = document.querySelector('.stats-receiving-expanded');
  dom.receivingSubfilterButtons = dom.receivingSubfilters
    ? Array.from(dom.receivingSubfilters.querySelectorAll('.stats-receiving-subfilter'))
    : [];
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
      const key = btn.dataset.subfilter;
      const isActive = !!statsState.receivingSubfilters[key];
      btn.classList.toggle('active', isActive);
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
    if (!dom.receivingFilterWrapper) return;
    dom.receivingFilterWrapper.classList.toggle('subfilters-visible', visible);
    if (dom.receivingSubfilters) {
      dom.receivingSubfilters.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }
    if (dom.receivingButton) {
      dom.receivingButton.setAttribute('aria-pressed', visible ? 'true' : 'false');
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
  
	  // Helper to save scroll positions before re-render
	  function saveScrollPositions() {
	    if (!statsState.currentContainer) return;
	    const vScroll = statsState.currentContainer.querySelector('.stats-vscroll-container');
	    const scrollableHeader = statsState.currentContainer.querySelector('.stats-scrollable-header');
	    statsState.scrollPositions.horizontal = scrollableHeader?.scrollLeft || 0;
	    if (vScroll) {
	      statsState.scrollPositions.vertical = vScroll.scrollTop || 0;
	    }
	  }
  
  // Helper to restore scroll positions after re-render
		  function restoreScrollPositions() {
		    if (!statsState.currentContainer) return;
		    requestAnimationFrame(() => {
		      const hScroll = statsState.currentContainer.querySelector('.stats-hscroll-container');
		      const vScroll = statsState.currentContainer.querySelector('.stats-vscroll-container');
		      const scrollableHeader = hScroll?.querySelector('.stats-scrollable-header');
		      const overlayInner = statsState.currentContainer.querySelector('.stats-scrollable-body-overlay-inner');
		      
		      if (scrollableHeader) scrollableHeader.scrollLeft = statsState.scrollPositions.horizontal || 0;
		      if (overlayInner) overlayInner.style.transform = `translate3d(-${statsState.scrollPositions.horizontal || 0}px, 0, 0)`;
		      if (vScroll && statsState.scrollPositions.vertical > 0) {
		        vScroll.scrollTop = statsState.scrollPositions.vertical;
		      }
		    });
		  }
  
  // Fast row update - only re-renders tbody rows without touching structure
  function updateTableRows() {
    if (!statsState.currentContainer) {
      // No container yet, do full render
      renderTable();
      return;
    }
    
    const dataset = getActiveDataset();
    const baseColumnSet = getColumnSet();
    const availableColumns = statsState.availableColumns.get(statsState.currentTab);
    const columnSet = baseColumnSet.filter((column, index) => {
      if (index < 3) return true;
      if (statsState.activePosition === 'RDP' && ['YEAR', 'RANGE', 'ROUND'].includes(column)) return true;
      if (!availableColumns) return true;
      return availableColumns.has(column);
    });

    const filtered = dataset.filter(passesFilters);
    const sortColumn = statsState.sort.column && columnSet.includes(statsState.sort.column)
      ? statsState.sort.column
      : 'RK';

    const hasOnlyPicks = filtered.length > 0 && filtered.every((entry) => entry.meta.pos === 'RDP');
    const sortCollection = (collection) => {
      if (!collection.length) return [];
      if (statsState.sort.direction === 0 || !statsState.sort.column) {
        return [...collection].sort((a, b) => (a.meta.rank ?? Infinity) - (b.meta.rank ?? Infinity));
      }
      return getSortedRows(collection, sortColumn);
    };

    let sortedRows;
    if (statsState.activePosition === 'RDP' || hasOnlyPicks) {
      sortedRows = [...filtered];
    } else {
      const playerRows = [];
      const pickRows = [];
      filtered.forEach((entry) => {
        if (entry.meta.pos === 'RDP') {
          pickRows.push(entry);
        } else {
          playerRows.push(entry);
        }
      });
      const sortedPlayers = sortCollection(playerRows);
      sortedRows = [...sortedPlayers, ...pickRows];
    }

    sortedRows.forEach((entry, index) => {
      // In RDP mode, give picks proper ranks; otherwise only rank non-RDP entries
      if (statsState.activePosition === 'RDP') {
        entry.meta.currentRank = index + 1;
      } else if (entry.meta.pos !== 'RDP') {
        entry.meta.currentRank = index + 1;
      } else {
        entry.meta.currentRank = null;
      }
    });
    
    statsState.lastRenderedRows = sortedRows;

	    const createTextDescriptor = (textOrDescriptor, style) => ({
	      render: (td) => {
	        const descriptor = typeof textOrDescriptor === 'object' && textOrDescriptor !== null
	          ? textOrDescriptor
	          : { text: textOrDescriptor, asterisk: false };
        td.textContent = descriptor.text ?? '';
        if (descriptor.asterisk) {
          const star = document.createElement('span');
          star.className = 'stats-eff-asterisk';
          star.textContent = '✼';
          td.appendChild(star);
        }
	        if (style) Object.assign(td.style, style);
	      }
	    });

	    // Always include FPTS/PPG for rank-based coloring, even in position-specific filter views.
	    const overviewRankColumns = (!statsState.activePosition || statsState.activePosition === 'ALL')
	      ? columnSet.filter((col) => OVERVIEW_RANKED_STAT_COLUMN_SET.has(col))
	      : columnSet.filter((col) => ALWAYS_RANKED_COLUMNS.has(col));
	    const overviewRankColors = overviewRankColumns.length
	      ? buildOverviewRankColorCache(filtered, overviewRankColumns)
	      : null;

	    const tableRows = sortedRows.map((entry, entryIndex) => {
	      const rowData = {};
	      for (const column of columnSet) {
	        const textValue = formatCellValue(column, entry);
	        const displayValue = annotateEfficiencyValue(column, entry, textValue);
	        if (column === 'PLAYER') {
	          rowData[column] = {
	            render: (td) => {
	              td.classList.add('stats-player-cell');
	              const isPickRow = entry.meta.pos === 'RDP' || !entry.meta.playerId;
	              if (isPickRow) {
	                td.textContent = displayValue.text ?? displayValue;
	                if (displayValue.asterisk) {
	                  const star = document.createElement('span');
	                  star.className = 'stats-eff-asterisk';
	                  star.textContent = '*';
	                  td.appendChild(star);
	                }
	                return;
	              }
	              const button = document.createElement('button');
	              button.type = 'button';
	              button.className = 'stats-player-btn';
	              button.dataset.playerId = entry.meta.playerId;
	              button.dataset.entryIndex = entryIndex;
              button.textContent = displayValue.text ?? displayValue;
              if (displayValue.asterisk) {
                const star = document.createElement('span');
                star.className = 'stats-eff-asterisk';
                star.textContent = '*';
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
                const posTag = document.createElement('span');
                posTag.className = `player-tag modal-pos-tag ${pos}`;
                posTag.textContent = pos;
                td.appendChild(posTag);
              } else {
                td.textContent = '';
              }
            }
          };
        } else if (column === 'VALUE') {
          rowData[column] = {
            render: (td) => {
              const span = document.createElement('span');
              span.className = 'stats-value-chip';
              span.style.cssText = entry.meta.valueStyle;
              span.textContent = displayValue.text ?? displayValue;
              if (displayValue.asterisk) {
                const star = document.createElement('span');
                star.className = 'stats-eff-asterisk';
                star.textContent = '*';
                span.appendChild(star);
              }
              td.appendChild(span);
            }
          };
	        } else if (column === 'TM') {
	          rowData[column] = {
	            render: (td) => {
	              if (entry.meta.pos === 'RDP') {
	                td.innerHTML = `<span style="color: var(--color-text-secondary);">RDP</span>`;
              } else {
                const teamKey = (textValue || 'FA').toUpperCase();
                const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
                const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
                const src = `../assets/NFL_logos_svg/${normalizedKey}.svg`;
                td.innerHTML = (teamKey && teamKey !== 'FA')
                  ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20">`
                  : `<span class="stats-team-chip" style="${entry.meta.teamStyle}">${displayValue.text ?? displayValue}</span>`;
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

    const FROZEN_COLUMN_COUNT = 3;
    const frozenColumns = columnSet.slice(0, FROZEN_COLUMN_COUNT);
    const scrollableColumns = columnSet.slice(FROZEN_COLUMN_COUNT);

    const applyCellDescriptor = (td, descriptor) => {
      td.textContent = '';
      td.innerHTML = '';
      if (!descriptor) return;
      if (typeof descriptor.render === 'function') {
        descriptor.render(td);
      } else {
        td.textContent = String(descriptor);
      }
    };

    const renderBodyRows = (tbody, cols, rowsData) => {
      tbody.innerHTML = ''; // Clear existing rows
      rowsData.forEach((rowData) => {
        const tr = document.createElement('tr');
        cols.forEach((col) => {
          const td = document.createElement('td');
          td.dataset.col = col;
          const descriptor = rowData[col];
          applyCellDescriptor(td, descriptor);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    };

    // Update both frozen and scrollable tbody sections
    const frozenBodyTbody = statsState.currentContainer.querySelector('.stats-frozen-body tbody');
    const scrollableBodyTbody = statsState.currentContainer.querySelector('.stats-scrollable-body-overlay tbody');

    if (frozenBodyTbody) {
      renderBodyRows(frozenBodyTbody, frozenColumns, tableRows);
    }
    if (scrollableBodyTbody) {
      renderBodyRows(scrollableBodyTbody, scrollableColumns, tableRows);
    }

    // Update sort indicators in headers
    const allHeaders = statsState.currentContainer.querySelectorAll('th[data-column-key]');
    allHeaders.forEach(th => {
      th.classList.remove('stats-sort-asc', 'stats-sort-desc', 'stats-sort-low-better');
      if (th.dataset.columnKey === statsState.sort.column) {
        applySortIndicator(th);
      }
    });

    // Update content height
    const vScrollContainer = statsState.currentContainer.querySelector('.stats-vscroll-container');
    const frozenBody = statsState.currentContainer.querySelector('.stats-frozen-body');
    const scrollableBodyOverlay = statsState.currentContainer.querySelector('.stats-scrollable-body-overlay');
    const vScrollContent = statsState.currentContainer.querySelector('.stats-vscroll-content');
    
    if (frozenBodyTbody && scrollableBodyTbody && frozenBody && scrollableBodyOverlay && vScrollContent) {
      const frozenBodyTable = frozenBodyTbody.closest('table');
      const scrollableBodyOverlayTable = scrollableBodyTbody.closest('table');
      const scrollableBodyHeight = scrollableBodyOverlayTable?.offsetHeight || 0;
      const frozenBodyHeight = frozenBodyTable?.offsetHeight || 0;
      const maxHeight = Math.max(scrollableBodyHeight, frozenBodyHeight);
      if (maxHeight > 0) {
        frozenBody.style.height = `${maxHeight}px`;
        scrollableBodyOverlay.style.height = `${maxHeight}px`;
        vScrollContent.style.minHeight = `${maxHeight}px`;
      }
    }

    // Handle empty state
    dom.emptyState.classList.toggle('hidden', sortedRows.length > 0);
  }
  
  function renderTable() {
    // If we don't need a full rebuild and have a container, just update rows
    if (!statsState.needsFullRebuild && statsState.currentContainer) {
      updateTableRows();
      return;
    }
    
    // Save scroll positions before full re-render
    saveScrollPositions();

    // Note: We use manual rendering for frozen columns, so TanStack Table is optional
    // Keeping the check for potential future use, but not required for current implementation

    const dataset = getActiveDataset();
    const baseColumnSet = getColumnSet();
    const availableColumns = statsState.availableColumns.get(statsState.currentTab);
    const columnSet = baseColumnSet.filter((column, index) => {
      if (index < 3) return true; // Always show first 3 columns
      if (statsState.activePosition === 'RDP' && ['YEAR', 'RANGE', 'ROUND'].includes(column)) return true;
      if (!availableColumns) return true;
      return availableColumns.has(column);
    });

    const headerLabels = statsState.headerLabels.get(statsState.currentTab) || new Map();
    const filtered = dataset.filter(passesFilters);
    const sortColumn = statsState.sort.column && columnSet.includes(statsState.sort.column)
      ? statsState.sort.column
      : 'RK';

    const hasOnlyPicks = filtered.length > 0 && filtered.every((entry) => entry.meta.pos === 'RDP');
    const sortCollection = (collection) => {
      if (!collection.length) return [];
      if (statsState.sort.direction === 0 || !statsState.sort.column) {
        return [...collection].sort((a, b) => (a.meta.rank ?? Infinity) - (b.meta.rank ?? Infinity));
      }
      return getSortedRows(collection, sortColumn);
    };

    let sortedRows;
    if (statsState.activePosition === 'RDP' || hasOnlyPicks) {
      sortedRows = [...filtered];
    } else {
      const playerRows = [];
      const pickRows = [];
      filtered.forEach((entry) => {
        if (entry.meta.pos === 'RDP') {
          pickRows.push(entry);
        } else {
          playerRows.push(entry);
        }
      });
      const sortedPlayers = sortCollection(playerRows);
      sortedRows = [...sortedPlayers, ...pickRows];
    }

    sortedRows.forEach((entry, index) => {
      // In RDP mode, give picks proper ranks; otherwise only rank non-RDP entries
      if (statsState.activePosition === 'RDP') {
        entry.meta.currentRank = index + 1;
      } else if (entry.meta.pos !== 'RDP') {
        entry.meta.currentRank = index + 1;
      } else {
        entry.meta.currentRank = null;
      }
    });
    
    statsState.lastRenderedRows = sortedRows;

    // --- Data Transformation for TanStack Table ---
	    const createTextDescriptor = (textOrDescriptor, style) => ({
	      render: (td) => {
	        const descriptor = typeof textOrDescriptor === 'object' && textOrDescriptor !== null
	          ? textOrDescriptor
	          : { text: textOrDescriptor, asterisk: false };
        td.textContent = descriptor.text ?? '';
        if (descriptor.asterisk) {
          const star = document.createElement('span');
          star.className = 'stats-eff-asterisk';
          star.textContent = '*';
          td.appendChild(star);
        }
	        if (style) Object.assign(td.style, style);
	      }
	    });

	    // Always include FPTS/PPG for rank-based coloring, even in position-specific filter views.
	    const overviewRankColumns = (!statsState.activePosition || statsState.activePosition === 'ALL')
	      ? columnSet.filter((col) => OVERVIEW_RANKED_STAT_COLUMN_SET.has(col))
	      : columnSet.filter((col) => ALWAYS_RANKED_COLUMNS.has(col));
	    const overviewRankColors = overviewRankColumns.length
	      ? buildOverviewRankColorCache(filtered, overviewRankColumns)
	      : null;

	    const tableRows = sortedRows.map((entry, entryIndex) => {
	      const rowData = {};
	      for (const column of columnSet) {
	        const textValue = formatCellValue(column, entry);
	        const displayValue = annotateEfficiencyValue(column, entry, textValue);
	        if (column === 'PLAYER') {
	          rowData[column] = {
	            render: (td) => {
	              td.classList.add('stats-player-cell');
	              const isPickRow = entry.meta.pos === 'RDP' || !entry.meta.playerId;
	              if (isPickRow) {
	                td.textContent = displayValue.text ?? displayValue;
	                if (displayValue.asterisk) {
	                  const star = document.createElement('span');
	                  star.className = 'stats-eff-asterisk';
	                  star.textContent = '*';
	                  td.appendChild(star);
	                }
	                return;
	              }
	              const button = document.createElement('button');
	              button.type = 'button';
	              button.className = 'stats-player-btn';
	              button.dataset.playerId = entry.meta.playerId;
	              button.dataset.entryIndex = entryIndex;
              button.textContent = displayValue.text ?? displayValue;
              if (displayValue.asterisk) {
                const star = document.createElement('span');
                star.className = 'stats-eff-asterisk';
                star.textContent = '*';
                button.appendChild(star);
              }
              td.appendChild(button);
            }
          };
        } else if (column === 'POS') {
          // POS column - render as styled tag
          const pos = (textValue || entry.meta.pos || '').trim().toUpperCase();
          rowData[column] = {
            render: (td) => {
              if (pos) {
                const posTag = document.createElement('span');
                posTag.className = `player-tag modal-pos-tag ${pos}`;
                posTag.textContent = pos;
                td.appendChild(posTag);
              } else {
                td.textContent = '';
              }
            }
          };
        } else if (column === 'VALUE') {
          rowData[column] = {
            render: (td) => {
              const span = document.createElement('span');
              span.className = 'stats-value-chip';
              span.style.cssText = entry.meta.valueStyle;
              span.textContent = displayValue.text ?? displayValue;
              if (displayValue.asterisk) {
                const star = document.createElement('span');
                star.className = 'stats-eff-asterisk';
                star.textContent = '*';
                span.appendChild(star);
              }
              td.appendChild(span);
            }
          };
	        } else if (column === 'TM') {
	          rowData[column] = {
	            render: (td) => {
	              if (entry.meta.pos === 'RDP') {
	                td.innerHTML = `<span style="color: var(--color-text-secondary);">RDP</span>`;
              } else {
                const teamKey = (textValue || 'FA').toUpperCase();
                const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
                const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
                const src = `../assets/NFL_logos_svg/${normalizedKey}.svg`;
                td.innerHTML = (teamKey && teamKey !== 'FA')
                  ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20">`
                  : `<span class="stats-team-chip" style="${entry.meta.teamStyle}">${displayValue.text ?? displayValue}</span>`;
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

    const columns = columnSet.map(column => ({
      id: column,
      accessorKey: column,
      header: () => headerLabels.get(column) || column,
      size: getColumnWidth(column),
    }));

    // Calculate column sizes
    let columnSizes = columns.map(col => Number.isFinite(col.size) ? col.size : DEFAULT_COLUMN_WIDTH);
    
    // Split columns into frozen (first 3) and scrollable (rest)
    const FROZEN_COLUMN_COUNT = 3;
    const frozenColumns = columnSet.slice(0, FROZEN_COLUMN_COUNT);
    const scrollableColumns = columnSet.slice(FROZEN_COLUMN_COUNT);
    const frozenColumnSizes = columnSizes.slice(0, FROZEN_COLUMN_COUNT);
    const scrollableColumnSizes = columnSizes.slice(FROZEN_COLUMN_COUNT);
    const frozenWidth = frozenColumnSizes.reduce((sum, size) => sum + size, 0);
    const scrollableWidth = scrollableColumnSizes.reduce((sum, size) => sum + size, 0);
    
    // Note: We use manual rendering for frozen/scrollable split columns
    // TanStack Table doesn't handle split column sets well, so we render manually

    // --- Frozen Columns Pattern: Separate Frozen and Scrollable Sections ---
    // The new Stats shell keeps a single active table wrapper and swaps datasets in place,
    // so fall back to that wrapper when the legacy per-tab panels are not present.
    const wrapper = dom.tableWrappers.find((el) => el.dataset.tabPanel === statsState.currentTab)
      || dom.tableWrapper
      || dom.tableWrappers[0];
    if (!wrapper) {
      console.warn('Stats table wrapper missing; skipping render until the shell is available.');
      return;
    }
    const otherWrappers = dom.tableWrappers.filter((el) => el !== wrapper);
    wrapper.classList.remove('hidden');
    otherWrappers.forEach((el) => el.classList.add('hidden'));

    // Preserve caption if it exists
    const existingCaption = wrapper.querySelector('caption');
    const previousContainer = wrapper.querySelector('.stats-table-container');
    const placeholderTable = !previousContainer ? wrapper.querySelector('table.stats-table') : null;

    if (placeholderTable) {
      placeholderTable.remove();
    }

    // Helper to create a table with colgroup for specific columns
    const createSectionTable = (cols, sizes) => {
      const table = document.createElement('table');
      table.className = 'stats-table';
      const colgroup = document.createElement('colgroup');
      sizes.forEach(size => {
        const col = document.createElement('col');
        col.style.width = `${size}px`;
        colgroup.appendChild(col);
      });
      table.appendChild(colgroup);
      return table;
    };

    // Create main container structure
    const container = document.createElement('div');
    container.className = 'stats-table-container';
    container.style.setProperty('--frozen-width', `${frozenWidth}px`);
    
    // Create frozen corner (first 3 header columns)
    const frozenCorner = document.createElement('div');
    frozenCorner.className = 'stats-frozen-corner';
    const frozenCornerTable = createSectionTable(frozenColumns, frozenColumnSizes);
    if (existingCaption) {
      const caption = existingCaption.cloneNode(true);
      frozenCornerTable.appendChild(caption);
    }
    const frozenCornerThead = document.createElement('thead');
    frozenCornerTable.appendChild(frozenCornerThead);
    frozenCorner.appendChild(frozenCornerTable);
    
	    // Create horizontal scroll container (scrollable header + body)
	    const hScrollContainer = document.createElement('div');
	    hScrollContainer.className = 'stats-hscroll-container';
	    
	    // Scrollable header (columns 4+)
	    const scrollableHeader = document.createElement('div');
	    scrollableHeader.className = 'stats-scrollable-header';
    const scrollableHeaderTable = createSectionTable(scrollableColumns, scrollableColumnSizes);
    const scrollableHeaderThead = document.createElement('thead');
	    scrollableHeaderTable.appendChild(scrollableHeaderThead);
	    scrollableHeader.appendChild(scrollableHeaderTable);
	    
	    hScrollContainer.appendChild(scrollableHeader);
	    
	    // Create vertical scroll container (frozen body + scrollable body overlay)
	    const vScrollContainer = document.createElement('div');
	    vScrollContainer.className = 'stats-vscroll-container';
    
    // Frozen body (first 3 body columns) - direct child of container for proper positioning
    const frozenBody = document.createElement('div');
    frozenBody.className = 'stats-frozen-body';
    const frozenBodyTable = createSectionTable(frozenColumns, frozenColumnSizes);
    const frozenBodyTbody = document.createElement('tbody');
    frozenBodyTable.appendChild(frozenBodyTbody);
    frozenBody.appendChild(frozenBodyTable);
    
    // Content wrapper for scrollable content only
    const vScrollContent = document.createElement('div');
    vScrollContent.className = 'stats-vscroll-content';
    
		    // Scrollable body overlay (same content as scrollableBodyWrapper, positioned absolutely)
		    const scrollableBodyOverlay = document.createElement('div');
		    scrollableBodyOverlay.className = 'stats-scrollable-body-overlay';
			    // Inner wrapper that will be transformed for horizontal scrolling (keeps overlay itself fixed).
			    const scrollableBodyOverlayInner = document.createElement('div');
			    scrollableBodyOverlayInner.className = 'stats-scrollable-body-overlay-inner';
			    // Ensure we start on a composited transform to avoid a "first horizontal scroll" jerk on iOS.
			    scrollableBodyOverlayInner.style.transform = 'translate3d(0, 0, 0)';
			    const scrollableBodyOverlayTable = createSectionTable(scrollableColumns, scrollableColumnSizes);
			    const scrollableBodyOverlayTbody = document.createElement('tbody');
			    scrollableBodyOverlayTable.appendChild(scrollableBodyOverlayTbody);
		    scrollableBodyOverlayInner.appendChild(scrollableBodyOverlayTable);
		    scrollableBodyOverlay.appendChild(scrollableBodyOverlayInner);
	    
	    // Append frozen body directly to container, scrollable content to wrapper
	    vScrollContainer.appendChild(frozenBody);
	    vScrollContent.appendChild(scrollableBodyOverlay);
	    vScrollContainer.appendChild(vScrollContent);

	    // Apply cell descriptor helper
	    const applyCellDescriptor = (td, descriptor) => {
	      td.textContent = '';
      td.innerHTML = '';
      if (!descriptor) return;
      if (typeof descriptor.render === 'function') {
        descriptor.render(td);
      } else {
        td.textContent = String(descriptor); // Fallback for plain values
      }
    };

    // Helper to render header cells
    const renderHeaderCells = (thead, cols, sizes, tableInst) => {
      // Always use manual rendering for split columns (TanStack Table has issues with split column sets)
        const tr = document.createElement('tr');
      cols.forEach((col, idx) => {
          const th = document.createElement('th');
        const label = headerLabels.get(col) || col;
        th.textContent = label || '';
        th.dataset.columnKey = col;
        const w = sizes[idx] || DEFAULT_COLUMN_WIDTH;
        th.style.width = `${w}px`;
        th.style.minWidth = `${w}px`;
        th.style.maxWidth = `${w}px`;
        
        // Apply header color classes
        const columnCategory = getColumnCategory(col);
        if (columnCategory === 'all') {
          th.classList.add('stats-header-all');
        } else if (columnCategory === 'passing') {
          th.classList.add('stats-header-passing');
        } else if (columnCategory === 'rushing') {
          th.classList.add('stats-header-rushing');
        } else if (columnCategory === 'receiving') {
          th.classList.add('stats-header-receiving');
        }
        
        // Apply sort indicator
        if (statsState.sort.column === col) {
          applySortIndicator(th);
        }
        
        tr.appendChild(th);
      });
      thead.appendChild(tr);
    };

    // Helper to render body rows
    const renderBodyRows = (tbody, cols, sizes, tableInst, rowsData) => {
      // Always use manual rendering for split columns (TanStack Table has issues with split column sets)
      rowsData.forEach((rowData, idx) => {
        const tr = document.createElement('tr');
        cols.forEach((col, cIdx) => {
          const td = document.createElement('td');
          td.dataset.col = col;
          // Get the descriptor for this column from the full row data
          const descriptor = rowData[col];
          // Apply the descriptor (which handles POS tags, player buttons, value chips, etc.)
          applyCellDescriptor(td, descriptor);
          
          const w = sizes[cIdx] || DEFAULT_COLUMN_WIDTH;
          td.style.width = `${w}px`;
          td.style.minWidth = `${w}px`;
          td.style.maxWidth = `${w}px`;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    };

    // Render frozen corner header (first 3 columns)
    renderHeaderCells(frozenCornerThead, frozenColumns, frozenColumnSizes, null);
    
    // Render scrollable header (columns 4+)
    renderHeaderCells(scrollableHeaderThead, scrollableColumns, scrollableColumnSizes, null);

	    // Render frozen body rows (first 3 columns)
	    renderBodyRows(frozenBodyTbody, frozenColumns, frozenColumnSizes, null, tableRows);

	    // Render scrollable body rows (columns 4+)
	    renderBodyRows(scrollableBodyOverlayTbody, scrollableColumns, scrollableColumnSizes, null, tableRows);

	    // Calculate table widths
	    if (Number.isFinite(frozenWidth) && frozenWidth > 0) {
      frozenCornerTable.style.width = `${frozenWidth}px`;
      frozenCornerTable.style.minWidth = `${frozenWidth}px`;
      frozenBodyTable.style.width = `${frozenWidth}px`;
      frozenBodyTable.style.minWidth = `${frozenWidth}px`;
    }
	    
	    if (Number.isFinite(scrollableWidth) && scrollableWidth > 0) {
	      scrollableHeaderTable.style.width = `${scrollableWidth}px`;
	      scrollableHeaderTable.style.minWidth = `${scrollableWidth}px`;
	      scrollableBodyOverlayTable.style.width = `${scrollableWidth}px`;
	      scrollableBodyOverlayTable.style.minWidth = `${scrollableWidth}px`;
	    }
    
    // Get header height for positioning vertical scroll container
    const getHeaderHeight = () => {
      return scrollableHeader.offsetHeight || frozenCorner.offsetHeight || 50;
    };

    // Assemble the structure
    container.appendChild(frozenCorner);
    container.appendChild(hScrollContainer);
    container.appendChild(vScrollContainer);

	    const applyHeaderMetrics = () => {
	      const headerHeight = getHeaderHeight();
	      if (!headerHeight) return false;
	      frozenCorner.style.height = `${headerHeight}px`;
	      scrollableHeader.style.height = `${headerHeight}px`;
	      vScrollContainer.style.top = `${headerHeight}px`;
	      vScrollContainer.style.height = `calc(100% - ${headerHeight}px)`;
	      frozenBody.style.top = '0';
	      return true;
	    };
	    
		    const updateContentHeight = () => {
		      const scrollableBodyHeight = scrollableBodyOverlayTable.offsetHeight;
		      const frozenBodyHeight = frozenBodyTable.offsetHeight;
		      const maxHeight = Math.max(scrollableBodyHeight, frozenBodyHeight);
	      if (maxHeight > 0) {
	        frozenBody.style.height = `${maxHeight}px`;
	        scrollableBodyOverlay.style.height = `${maxHeight}px`;
	        vScrollContent.style.minHeight = `${maxHeight}px`;
	      }
	    };

	    // iOS Safari can fire resize events repeatedly while scrolling (URL bar show/hide),
	    // which forces expensive layout reads. Only recompute when the viewport width changes.
	    let lastResizeWidth = window.innerWidth;
	    let resizeFrame = null;
		    const handleResize = () => {
		      const nextWidth = window.innerWidth;
		      if (nextWidth === lastResizeWidth) return;
		      lastResizeWidth = nextWidth;
		      if (resizeFrame) cancelAnimationFrame(resizeFrame);
		      resizeFrame = requestAnimationFrame(() => {
		        resizeFrame = null;
		        applyHeaderMetrics();
		        updateContentHeight();
		      });
		    };

	    const mountContainer = () => {
	      if (!applyHeaderMetrics()) {
	        requestAnimationFrame(applyHeaderMetrics);
	      }
	      if (scrollableBodyOverlayTable.offsetHeight === 0) {
	        requestAnimationFrame(updateContentHeight);
	      } else {
	        updateContentHeight();
	      }
		      window.addEventListener('resize', handleResize);
		      container._teardown = () => {
		        window.removeEventListener('resize', handleResize);
		        if (resizeFrame) cancelAnimationFrame(resizeFrame);
	      };
	    };

    if (previousContainer) {
      container.classList.add('incoming');
      previousContainer.classList.add('outgoing');
      wrapper.appendChild(container);
      mountContainer();
      requestAnimationFrame(() => {
        previousContainer._teardown?.();
        previousContainer.remove();
        container.classList.remove('incoming');
        // Store reference to current container
        statsState.currentContainer = container;
        statsState.needsFullRebuild = false;
        restoreScrollPositions();
      });
    } else {
      wrapper.appendChild(container);
      mountContainer();
      // Store reference to current container
      statsState.currentContainer = container;
      statsState.needsFullRebuild = false;
      restoreScrollPositions();
    }

			    // Scroll synchronization
			    // Single source of truth: the header is the only horizontal scroller.
			    // The body overlay content is translated to match immediately (no body-native horizontal scroll).
				    const overlayInner = scrollableBodyOverlayInner;
				    let pendingOverlayScrollLeft = 0;
				    let overlaySyncFrame = null;
				    let ignoreHeaderScrollEvent = false;
				    let ignoreHeaderScrollResetFrame = null;
			
			    const syncOverlayInner = (scrollLeft) => {
			      if (!overlayInner) return;
			      // translate3d helps iOS keep this on the compositor for smoother scroll.
			      overlayInner.style.transform = `translate3d(-${scrollLeft}px, 0, 0)`;
			    };
			
				    // Temporarily promote the overlay during active horizontal scroll to reduce jitter.
				    let hScrollActiveTimer = null;
				    let hScrollActiveUntil = 0;
				    const markHScrollingActive = () => {
				      hScrollActiveUntil = performance.now() + 160;
				      container.classList.add('stats-is-hscrolling');
				      if (hScrollActiveTimer) return;
				
				      const tick = () => {
				        const remaining = hScrollActiveUntil - performance.now();
				        if (remaining <= 0) {
				          container.classList.remove('stats-is-hscrolling');
				          hScrollActiveTimer = null;
				          return;
				        }
				        hScrollActiveTimer = setTimeout(tick, Math.min(remaining, 160));
				      };
				
				      hScrollActiveTimer = setTimeout(tick, 160);
				    };
			
			    const scheduleOverlaySync = () => {
			      if (!overlayInner || overlaySyncFrame) return;
			      markHScrollingActive();
			      overlaySyncFrame = requestAnimationFrame(() => {
			        overlaySyncFrame = null;
			        syncOverlayInner(pendingOverlayScrollLeft);
			      });
			    };
			
				    scrollableHeader.addEventListener('scroll', () => {
				      if (ignoreHeaderScrollEvent) return;
				      pendingOverlayScrollLeft = scrollableHeader.scrollLeft;
				      // Apply immediately once per frame to reduce perceived lag when users drag the header itself,
				      // while still batching the final sync to rAF to avoid over-updating transforms.
				      if (!overlaySyncFrame) {
				        syncOverlayInner(pendingOverlayScrollLeft);
				      }
				      markHScrollingActive();
				      scheduleOverlaySync();
				    });
			
				    if (typeof container._teardown === 'function') {
				      const previousTeardown = container._teardown;
				      container._teardown = () => {
				        previousTeardown();
				        if (ignoreHeaderScrollResetFrame) {
				          cancelAnimationFrame(ignoreHeaderScrollResetFrame);
				          ignoreHeaderScrollResetFrame = null;
				        }
				        if (hScrollActiveTimer) {
				          clearTimeout(hScrollActiveTimer);
				          hScrollActiveTimer = null;
				        }
			        if (overlaySyncFrame) {
			          cancelAnimationFrame(overlaySyncFrame);
			          overlaySyncFrame = null;
			        }
			      };
			    }
			
					    const setHorizontalScrollLeft = (nextScrollLeft, beforeScrollLeft = scrollableHeader.scrollLeft) => {
					      // Suppress the header's scroll event that fires due to this programmatic scrollLeft update,
					      // otherwise we double-sync (and jitter) on iOS during touch-driven scrolling.
					      ignoreHeaderScrollEvent = true;
				      if (!ignoreHeaderScrollResetFrame) {
				        ignoreHeaderScrollResetFrame = requestAnimationFrame(() => {
				          ignoreHeaderScrollEvent = false;
				          ignoreHeaderScrollResetFrame = null;
				        });
				      }
					      scrollableHeader.scrollLeft = nextScrollLeft;
					      const applied = scrollableHeader.scrollLeft;
					      if (applied !== beforeScrollLeft) {
					        pendingOverlayScrollLeft = applied;
					        syncOverlayInner(applied);
					        markHScrollingActive();
					      }
					      return applied;
					    };
			
				    const applyImmediateSync = (deltaX) => {
				      const before = scrollableHeader.scrollLeft;
				      const after = setHorizontalScrollLeft(before - deltaX, before);
				      return after !== before;
				    };
		    
			    // Route horizontal wheel/trackpad gestures to horizontal scroll container (header)
				    vScrollContainer.addEventListener('wheel', (e) => {
				      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
				        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
				        const before = scrollableHeader.scrollLeft;
				        setHorizontalScrollLeft(before + delta, before);
				        e.preventDefault();
				      }
				    }, { passive: false });
		    
			    // Also handle horizontal scroll on frozen body and overlay
				    frozenBody.addEventListener('wheel', (e) => {
				      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
				        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
				        const before = scrollableHeader.scrollLeft;
				        setHorizontalScrollLeft(before + delta, before);
				        e.preventDefault();
				      }
				    }, { passive: false });
		    
				    scrollableBodyOverlay.addEventListener('wheel', (e) => {
				      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
				        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
				        const before = scrollableHeader.scrollLeft;
				        setHorizontalScrollLeft(before + delta, before);
				        e.preventDefault();
				      }
				    }, { passive: false });
			
			    // Touch gesture support so mobile users can drag anywhere on the body/frozen section
					    const attachTouchScroller = (surface, onHorizontalScroll) => {
					      if (!surface) return;
			
			      let touchActive = false;
			      let isHorizontal = null;
			      let touchStartX = 0;
			      let touchStartY = 0;
			      let lastTouchX = 0;
			      let lastTimestamp = 0;
			
			      // Match iOS scroll momentum more closely:
			      // UIScrollViewDecelerationRateNormal = 0.998, UIScrollViewDecelerationRateFast = 0.99
			      // (per ms multiplier; we apply `rate^elapsedMs` each frame)
			      // Source: grep.app search results for UIScrollViewDecelerationRateNormal.
			      const DECELERATION_RATE = 0.998;
				      const VELOCITY_HISTORY_LIMIT = 6;
				      const velocitySamples = [];
				      let lastVelocitySign = 0;
				      let momentumFrame = null;
				      const H_THRESHOLD = 1;
				      const DIRECTION_LOCK_RATIO = 1.1;
			      const MOMENTUM_START_VELOCITY = 0.08; // px/ms (80px/s) - avoids "drift" after slow drags
			      const MOMENTUM_STOP_VELOCITY = 0.015; // px/ms
			      const MIN_VELOCITY_SAMPLE_MS = 8;
			
			      const cancelMomentum = () => {
			        if (momentumFrame) {
			          cancelAnimationFrame(momentumFrame);
			          momentumFrame = null;
			        }
			      };
			
				      const startMomentum = (initialVelocity) => {
				        cancelMomentum();
				        if (!Number.isFinite(initialVelocity) || Math.abs(initialVelocity) < MOMENTUM_START_VELOCITY) return;
				        let velocity = initialVelocity;
				        let prev = performance.now();
				        const MAX_ELAPSED_MS = 64;
				        const STEP_MAX_MS = 16;
				
				        const step = (now) => {
				          const elapsed = Math.min(now - prev, MAX_ELAPSED_MS);
				          prev = now;
				
				          // Sub-step long frames so decay is integrated over time (avoids "jerk" on dropped frames).
				          let remaining = elapsed;
				          while (remaining > 0) {
				            const dt = Math.min(remaining, STEP_MAX_MS);
				            const delta = velocity * dt;
				            if (delta !== 0 && typeof onHorizontalScroll === 'function') {
				              const moved = onHorizontalScroll(delta);
				              if (moved === false) {
				                momentumFrame = null;
				                return;
				              }
				            } else if (delta !== 0) {
				              scrollableHeader.scrollLeft -= delta;
				            }
				
				            // Exponential decay: v(t+dt) = v(t) * rate^dt
				            const attenuation = Math.pow(DECELERATION_RATE, dt);
				            velocity *= attenuation;
				            remaining -= dt;
				            if (Math.abs(velocity) <= MOMENTUM_STOP_VELOCITY) break;
				          }
				          if (Math.abs(velocity) > MOMENTUM_STOP_VELOCITY) {
				            momentumFrame = requestAnimationFrame(step);
				          } else {
			            momentumFrame = null;
			          }
			        };
			
			        momentumFrame = requestAnimationFrame(step);
			      };
			
				      surface.addEventListener('touchstart', (event) => {
				        if (event.touches.length !== 1) return;
				        const touch = event.touches[0];
				        cancelMomentum();
				        touchActive = true;
				        isHorizontal = null;
				        touchStartX = touch.clientX;
				        touchStartY = touch.clientY;
				        lastTouchX = touch.clientX;
				        lastTimestamp = event.timeStamp;
				        velocitySamples.length = 0;
				        lastVelocitySign = 0;
				      }, { passive: true });
			
			      surface.addEventListener('touchmove', (event) => {
			        if (!touchActive || event.touches.length !== 1) return;
			        const touch = event.touches[0];
			        const deltaXFromStart = touch.clientX - touchStartX;
			        const deltaYFromStart = touch.clientY - touchStartY;
			        const deltaX = touch.clientX - lastTouchX;
			        const elapsed = event.timeStamp - lastTimestamp;
			
				        if (isHorizontal === null) {
				          const absX = Math.abs(deltaXFromStart);
				          const absY = Math.abs(deltaYFromStart);
				          if (absX > H_THRESHOLD && absX > absY * DIRECTION_LOCK_RATIO) {
				            isHorizontal = true;
				            markHScrollingActive();
				          } else if (absY > H_THRESHOLD && absY > absX * DIRECTION_LOCK_RATIO) {
				            isHorizontal = false;
				          }
				        }
			
				        if (isHorizontal) {
				          event.preventDefault();
				          if (elapsed >= MIN_VELOCITY_SAMPLE_MS) {
				            const instantaneousVelocity = deltaX / elapsed;
				            const sign = Math.sign(instantaneousVelocity);
				            if (sign !== 0 && lastVelocitySign !== 0 && sign !== lastVelocitySign) {
				              // Fast direction changes should favor the newest direction to avoid twitchy momentum.
				              velocitySamples.length = 0;
				            }
				            if (sign !== 0) lastVelocitySign = sign;
				            velocitySamples.push(instantaneousVelocity);
				            if (velocitySamples.length > VELOCITY_HISTORY_LIMIT) {
				              velocitySamples.shift();
				            }
				          }
				          if (deltaX !== 0) {
				            if (typeof onHorizontalScroll === 'function') {
				              const moved = onHorizontalScroll(deltaX);
				              if (moved === false) {
				                velocitySamples.length = 0;
				                lastVelocitySign = 0;
				              }
				            } else {
				              scrollableHeader.scrollLeft -= deltaX;
				            }
				          }
				        }
			
			        // Always advance the baseline so horizontal locking doesn't "jump" when it kicks in.
			        lastTouchX = touch.clientX;
			        lastTimestamp = event.timeStamp;
			      }, { passive: false });
			
				      const resetTouchState = () => {
				        touchActive = false;
				        isHorizontal = null;
				        if (velocitySamples.length >= 2 && typeof onHorizontalScroll === 'function') {
			          let weightedSum = 0;
			          let weightTotal = 0;
			          for (let i = 0; i < velocitySamples.length; i++) {
			            const weight = i + 1; // favor most-recent samples to reduce "extra scroll" on lift
			            weightedSum += velocitySamples[i] * weight;
			            weightTotal += weight;
			          }
				          const averagedVelocity = weightTotal ? (weightedSum / weightTotal) : 0;
				          startMomentum(averagedVelocity);
				        }
				        velocitySamples.length = 0;
				        lastVelocitySign = 0;
				      };
			
			      surface.addEventListener('touchend', resetTouchState, { passive: true });
			      surface.addEventListener('touchcancel', resetTouchState, { passive: true });
			    };
			
			    attachTouchScroller(scrollableBodyOverlay, applyImmediateSync);
			    attachTouchScroller(frozenBody, applyImmediateSync);
		    
		    // Initialize scroll positions
		    setHorizontalScrollLeft(0);
		    vScrollContainer.scrollTop = 0;

		    // Empty state handling
		    dom.emptyState.classList.toggle('hidden', sortedRows.length > 0);
		  }
  // DataHub table icons: these cover the default/overview experience and the
  // most common stat columns so the rebuilt split-table header visually matches
  // the reference shell without depending on any external icon runtime.
  const COLUMN_ICONS = {
    'RK': 'M4 6h16M4 12h8M4 18h4',
    'PLAYER': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'POS': 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
    'TM': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
    'AGE': 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    'G': 'M22 12h-4l-3 9L9 3l-3 9H2',
    'FPTS': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    'PPG': 'M22 7 12 17 7 12 2 17',
    'VALUE': 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    'ADP': 'M18 20V10M12 20V4M6 20v-6',
    'POS·ADP': 'M3 6h18M7 12h10M11 18h2',
    'SNP%': 'M22 12h-4l-3 9L9 3l-3 9H2',
    'YDS(t)': 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
    'YPG(t)': 'M18 20V10M12 20V4M6 20v-6',
    'OPP': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    'IMP': 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
    'IMP/OPP': 'M12 2v20M2 12h20',
    'CSTY%': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
    'CL': 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z'
  };
  const STATS_PLAIN_COLUMNS = new Set(['PLAYER', 'POS', 'TM', 'AGE', 'G', 'YEAR', 'RANGE', 'ROUND']);

  let statsRowResizeObserver = null;

  // The rebuilt DataHub grid uses a single scroll pane for both axes; preserve
  // the user's scroll position across sorts and filter changes so the table
  // feels stable while data updates underneath the shell.
  function saveScrollPositions() {
    if (!statsState.currentContainer) return;
    const scrollPane = statsState.currentContainer.querySelector('.table-pane--scroll');
    statsState.scrollPositions.horizontal = scrollPane?.scrollLeft || 0;
    statsState.scrollPositions.vertical = scrollPane?.scrollTop || 0;
  }

  function restoreScrollPositions(scrollPane, frozenPane) {
    requestAnimationFrame(() => {
      if (!scrollPane) return;
      scrollPane.scrollLeft = statsState.scrollPositions.horizontal || 0;
      scrollPane.scrollTop = statsState.scrollPositions.vertical || 0;
      if (frozenPane) {
        frozenPane.scrollTop = scrollPane.scrollTop;
      }
    });
  }

  // The reference table renderer rebuilds the frame as a whole so header groups,
  // sticky offsets, and frozen/scroll row syncing stay correct on every update.
  function updateTableRows() {
    statsState.needsFullRebuild = true;
    renderTable();
  }

  function getActiveColumnGroups(columnSet) {
    const sourceGroups = statsState.activePosition === 'RDP'
      ? COLUMN_GROUPS.RDP
      : (!statsState.activePosition || statsState.activePosition === 'ALL')
        ? COLUMN_GROUPS.default
        : statsState.activePosition === 'QB'
          ? COLUMN_GROUPS.QB
          : statsState.activePosition === 'RB'
            ? COLUMN_GROUPS.RB
            : statsState.activePosition === 'Receiving'
              ? COLUMN_GROUPS.WR
              : statsState.activePosition === 'TE'
                ? COLUMN_GROUPS.TE
                : COLUMN_GROUPS.default;

    const frozenGroups = FROZEN_GROUP
      .map((group) => ({ ...group, columns: group.columns.filter((column) => columnSet.includes(column)) }))
      .filter((group) => group.columns.length);

    const scrollGroups = (sourceGroups || [])
      .map((group) => ({ ...group, columns: group.columns.filter((column) => columnSet.includes(column)) }))
      .filter((group) => group.columns.length);

    return { frozenGroups, scrollGroups };
  }

  function buildColumnLayout(columnNames) {
    let totalWidth = 0;
    const columns = columnNames.map((name, index) => {
      const width = getColumnWidth(name);
      totalWidth += width;
      return { name, index, width };
    });
    return { columns, totalWidth };
  }

  function getRenderedTableState() {
    const dataset = getActiveDataset();
    const baseColumnSet = getColumnSet();
    const availableColumns = statsState.availableColumns.get(statsState.currentTab);
    const headerLabels = statsState.headerLabels.get(statsState.currentTab) || new Map();
    const columnSet = baseColumnSet.filter((column, index) => {
      if (index < 3) return true;
      if (statsState.activePosition === 'RDP' && ['YEAR', 'RANGE', 'ROUND'].includes(column)) return true;
      if (!availableColumns) return true;
      return availableColumns.has(column);
    });

    const filtered = dataset.filter(passesFilters);
    const sortColumn = statsState.sort.column && columnSet.includes(statsState.sort.column)
      ? statsState.sort.column
      : 'RK';
    const hasOnlyPicks = filtered.length > 0 && filtered.every((entry) => entry.meta.pos === 'RDP');
    const sortCollection = (collection) => {
      if (!collection.length) return [];
      if (statsState.sort.direction === 0 || !statsState.sort.column) {
        return [...collection].sort((a, b) => (a.meta.rank ?? Infinity) - (b.meta.rank ?? Infinity));
      }
      return getSortedRows(collection, sortColumn);
    };

    let sortedRows;
    if (statsState.activePosition === 'RDP' || hasOnlyPicks) {
      sortedRows = [...filtered];
    } else {
      const playerRows = [];
      const pickRows = [];
      filtered.forEach((entry) => {
        if (entry.meta.pos === 'RDP') {
          pickRows.push(entry);
        } else {
          playerRows.push(entry);
        }
      });
      const sortedPlayers = sortCollection(playerRows);
      sortedRows = [...sortedPlayers, ...pickRows];
    }

    sortedRows.forEach((entry, index) => {
      if (statsState.activePosition === 'RDP') {
        entry.meta.currentRank = index + 1;
      } else if (entry.meta.pos !== 'RDP') {
        entry.meta.currentRank = index + 1;
      } else {
        entry.meta.currentRank = null;
      }
    });

    statsState.lastRenderedRows = sortedRows;

    const overviewRankColumns = (!statsState.activePosition || statsState.activePosition === 'ALL')
      ? columnSet.filter((col) => OVERVIEW_RANKED_STAT_COLUMN_SET.has(col))
      : columnSet.filter((col) => ALWAYS_RANKED_COLUMNS.has(col));
    const overviewRankColors = overviewRankColumns.length
      ? buildOverviewRankColorCache(filtered, overviewRankColumns)
      : null;

    return {
      headerLabels,
      columnSet,
      sortedRows,
      overviewRankColors
    };
  }

  function buildGroupHeaderRow(groups) {
    const tr = document.createElement('tr');
    groups.forEach((group) => {
      const th = document.createElement('th');
      th.className = 'stats-table__group-header-cell';
      th.colSpan = group.columns.length;
      const inner = document.createElement('div');
      inner.className = 'stats-table__group-header-inner';

      if (group.icon) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.classList.add('stats-table__group-header-icon');
        if (group.icon.startsWith('<')) {
          svg.innerHTML = group.icon;
        } else {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', group.icon);
          svg.append(path);
        }
        inner.append(svg);
      }

      const label = document.createElement('span');
      label.textContent = group.label;
      inner.append(label);
      th.append(inner);
      tr.append(th);
    });
    return tr;
  }

  function applySortStateForColumn(columnName, columnSet) {
    if (statsState.activePosition === 'RDP') return false;
    const dataset = getActiveDataset();
    const visibleRows = dataset.filter(passesFilters);
    if (visibleRows.length && visibleRows.every((entry) => entry.meta.pos === 'RDP')) return false;
    if (!columnName || !columnSet.includes(columnName)) return false;

    if (statsState.sort.column !== columnName) {
      const startDir = LOWER_IS_BETTER_COLUMNS.has(columnName) ? 1 : 2;
      statsState.sort = { column: columnName, direction: startDir };
      return true;
    }

    if (statsState.sort.direction === 2) {
      if (LOWER_IS_BETTER_COLUMNS.has(columnName)) {
        statsState.sort.direction = 0;
        statsState.sort.column = null;
      } else {
        statsState.sort.direction = 1;
      }
    } else if (statsState.sort.direction === 1) {
      if (LOWER_IS_BETTER_COLUMNS.has(columnName)) {
        statsState.sort.direction = 2;
      } else {
        statsState.sort.direction = 0;
        statsState.sort.column = null;
      }
    } else {
      statsState.sort.direction = 0;
      statsState.sort.column = null;
    }

    return true;
  }

  function getHeaderAriaSort(columnName) {
    if (statsState.sort.column !== columnName || statsState.sort.direction === 0) {
      return 'none';
    }
    return statsState.sort.direction === 1 ? 'ascending' : 'descending';
  }

  function getHeaderSortIndicator(columnName) {
    if (statsState.sort.column !== columnName || statsState.sort.direction === 0) {
      return '↕';
    }
    return statsState.sort.direction === 1 ? '▲' : '▼';
  }

  function createHeaderCell(column, columnSet, headerLabels) {
    const th = document.createElement('th');
    th.className = 'stats-table__header-cell';
    th.scope = 'col';
    th.dataset.columnKey = column.name;
    th.style.setProperty('--column-width', `${column.width}px`);
    th.style.width = `${column.width}px`;
    th.style.minWidth = `${column.width}px`;
    th.style.maxWidth = `${column.width}px`;
    th.setAttribute('aria-sort', getHeaderAriaSort(column.name));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'stats-table__head-button';
    button.setAttribute('aria-label', `Sort by ${headerLabels.get(column.name) || column.name}`);
    button.addEventListener('click', () => {
      if (applySortStateForColumn(column.name, columnSet)) {
        renderTable();
      }
    });

    const iconPath = COLUMN_ICONS[column.name];
    if (iconPath) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.classList.add('stats-table__head-icon');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', iconPath);
      svg.append(path);
      button.append(svg);
    }

    const label = document.createElement('span');
    label.className = 'stats-table__head-label';
    label.textContent = headerLabels.get(column.name) || column.name;

    const indicator = document.createElement('span');
    indicator.className = 'stats-table__sort-indicator';
    indicator.textContent = getHeaderSortIndicator(column.name);
    indicator.setAttribute('aria-hidden', 'true');
    if (statsState.sort.column === column.name && statsState.sort.direction !== 0) {
      indicator.classList.add('is-active');
    }

    button.append(label, indicator);
    th.append(button);
    return th;
  }

  function appendEfficiencyAsterisk(target) {
    const star = document.createElement('span');
    star.className = 'stats-eff-asterisk';
    star.textContent = '✼';
    target.append(star);
  }

  function createBodyCell(entry, rowIndex, column, overviewRankColors) {
    const td = document.createElement('td');
    td.className = 'stats-table__body-cell';
    td.dataset.col = column.name;
    td.style.setProperty('--column-width', `${column.width}px`);
    td.style.width = `${column.width}px`;
    td.style.minWidth = `${column.width}px`;
    td.style.maxWidth = `${column.width}px`;

    const content = document.createElement('div');
    content.className = 'stats-table__cell-content';
    const textValue = formatCellValue(column.name, entry);
    const displayValue = annotateEfficiencyValue(column.name, entry, textValue);
    const displayText = displayValue.text ?? displayValue;
    const isPickRow = entry.meta.pos === 'RDP' || !entry.meta.playerId;

    if (column.name === 'PLAYER') {
      td.classList.add('player-cell', 'plain-cell');
      if (isPickRow) {
        content.textContent = displayText || '';
        if (displayValue.asterisk) appendEfficiencyAsterisk(content);
      } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'stats-player-btn';
        button.dataset.playerId = entry.meta.playerId;
        button.dataset.entryIndex = rowIndex;
        button.textContent = displayText || '';
        if (displayValue.asterisk) appendEfficiencyAsterisk(button);
        content.append(button);
      }
    } else if (column.name === 'POS') {
      td.classList.add('center-cell', 'plain-cell');
      const pos = (displayText || entry.meta.pos || '').trim().toUpperCase();
      if (pos) {
        const posTag = document.createElement('span');
        posTag.className = `player-tag modal-pos-tag ${pos}`;
        posTag.textContent = pos;
        content.append(posTag);
      }
    } else if (column.name === 'TM') {
      td.classList.add('center-cell', 'plain-cell');
      if (entry.meta.pos === 'RDP') {
        content.textContent = 'RDP';
      } else {
        const teamKey = (displayText || 'FA').toUpperCase();
        const src = getTeamLogoSrc(teamKey);
        if (src && teamKey !== 'FA') {
          const img = document.createElement('img');
          img.className = 'team-logo glow';
          img.src = src;
          img.alt = teamKey;
          img.width = 20;
          img.height = 20;
          content.append(img);
        } else {
          const chip = document.createElement('span');
          chip.className = 'stats-team-chip';
          chip.style.cssText = entry.meta.teamStyle;
          chip.textContent = displayText || '';
          content.append(chip);
        }
      }
    } else if (column.name === 'VALUE') {
      td.classList.add('center-cell', 'formatted-cell');
      const chip = document.createElement('span');
      chip.className = 'stats-value-chip';
      chip.style.cssText = entry.meta.valueStyle;
      chip.textContent = displayText || '';
      if (displayValue.asterisk) appendEfficiencyAsterisk(chip);
      content.append(chip);
    } else if (column.name === 'FPTS' && !isPickRow && displayText && displayText !== 'NA') {
      td.classList.add('center-cell', 'formatted-cell');
      const chip = document.createElement('span');
      chip.className = 'stats-table__fpts-chip stats-table__fpts-chip--tier-2';
      chip.textContent = displayText;
      const style = getConditionalCellStyle(column.name, entry, overviewRankColors);
      if (style) Object.assign(chip.style, style);
      if (displayValue.asterisk) appendEfficiencyAsterisk(chip);
      content.append(chip);
    } else {
      td.classList.add('center-cell', STATS_PLAIN_COLUMNS.has(column.name) ? 'plain-cell' : 'formatted-cell');
      content.textContent = displayText || '';
      const style = getConditionalCellStyle(column.name, entry, overviewRankColors);
      if (style) Object.assign(content.style, style);
      if (displayValue.asterisk) appendEfficiencyAsterisk(content);
      if (!displayText || displayText === 'NA') {
        td.classList.add('na-cell');
      }
    }

    td.append(content);
    return td;
  }

  function buildTable(columns, totalWidth, groups, paneType, renderState) {
    const table = document.createElement('table');
    table.className = 'stats-table';
    table.dataset.pane = paneType;
    table.style.setProperty('--table-width', `${totalWidth}px`);
    table.style.width = `${totalWidth}px`;
    table.style.minWidth = `${totalWidth}px`;

    const colgroup = document.createElement('colgroup');
    columns.forEach((column) => {
      const col = document.createElement('col');
      col.style.width = `${column.width}px`;
      col.style.minWidth = `${column.width}px`;
      col.style.maxWidth = `${column.width}px`;
      colgroup.append(col);
    });
    table.append(colgroup);

    const thead = document.createElement('thead');
    thead.append(buildGroupHeaderRow(groups));
    const columnRow = document.createElement('tr');
    columns.forEach((column) => {
      columnRow.append(createHeaderCell(column, renderState.columnSet, renderState.headerLabels));
    });
    thead.append(columnRow);
    table.append(thead);

    const tbody = document.createElement('tbody');
    if (paneType === 'scroll' && !renderState.sortedRows.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.className = 'stats-table__empty-cell';
      td.colSpan = columns.length;
      td.textContent = 'No players match the current view.';
      tr.append(td);
      tbody.append(tr);
    } else {
      renderState.sortedRows.forEach((entry, rowIndex) => {
        const tr = document.createElement('tr');
        tr.dataset.rowIndex = String(rowIndex);
        columns.forEach((column) => {
          tr.append(createBodyCell(entry, rowIndex, column, renderState.overviewRankColors));
        });
        tbody.append(tr);
      });
    }
    table.append(tbody);
    return table;
  }

  function attachHoverSync(frozenRows, scrollRows) {
    const len = Math.min(frozenRows.length, scrollRows.length);
    for (let i = 0; i < len; i += 1) {
      const frozenRow = frozenRows[i];
      const scrollRow = scrollRows[i];
      [frozenRow, scrollRow].forEach((row) => {
        row.addEventListener('mouseenter', () => {
          frozenRow.classList.add('is-hovered');
          scrollRow.classList.add('is-hovered');
        });
        row.addEventListener('mouseleave', () => {
          frozenRow.classList.remove('is-hovered');
          scrollRow.classList.remove('is-hovered');
        });
      });
    }
  }

  function syncRowHeights(frozenTable, scrollTable) {
    const frozenHeadRows = frozenTable.tHead ? Array.from(frozenTable.tHead.rows) : [];
    const scrollHeadRows = scrollTable.tHead ? Array.from(scrollTable.tHead.rows) : [];
    const headerLen = Math.min(frozenHeadRows.length, scrollHeadRows.length);
    for (let i = 0; i < headerLen; i += 1) {
      const height = Math.max(frozenHeadRows[i].offsetHeight, scrollHeadRows[i].offsetHeight);
      frozenHeadRows[i].style.height = `${height}px`;
      scrollHeadRows[i].style.height = `${height}px`;
    }

    const frozenRows = frozenTable.tBodies[0] ? Array.from(frozenTable.tBodies[0].rows) : [];
    const scrollRows = scrollTable.tBodies[0] ? Array.from(scrollTable.tBodies[0].rows) : [];
    const len = Math.max(frozenRows.length, scrollRows.length);
    for (let i = 0; i < len; i += 1) {
      const frozenRow = frozenRows[i];
      const scrollRow = scrollRows[i];
      if (!frozenRow || !scrollRow) continue;
      frozenRow.style.height = '';
      scrollRow.style.height = '';
      const height = Math.max(frozenRow.offsetHeight, scrollRow.offsetHeight);
      frozenRow.style.height = `${height}px`;
      scrollRow.style.height = `${height}px`;
    }

    attachHoverSync(frozenRows, scrollRows);
  }

  function observeRowResize(frozenTable, scrollTable) {
    if (typeof ResizeObserver === 'undefined') return;
    if (statsRowResizeObserver) {
      statsRowResizeObserver.disconnect();
    }
    let frame = 0;
    statsRowResizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => syncRowHeights(frozenTable, scrollTable));
    });
    if (scrollTable.tBodies[0]) {
      statsRowResizeObserver.observe(scrollTable.tBodies[0]);
    }
  }

  function attachFrozenPaneScrollProxy(frozenPane, scrollPane) {
    let lastTouchY = 0;

    frozenPane.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const previousScrollTop = scrollPane.scrollTop;
      scrollPane.scrollTop += event.deltaY;
      if (scrollPane.scrollTop !== previousScrollTop) {
        event.preventDefault();
      }
    }, { passive: false });

    frozenPane.addEventListener('touchstart', (event) => {
      lastTouchY = event.touches[0]?.clientY ?? 0;
    }, { passive: true });

    frozenPane.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const deltaY = lastTouchY - touch.clientY;
      lastTouchY = touch.clientY;
      if (Math.abs(deltaY) < 0.5) return;
      const previousScrollTop = scrollPane.scrollTop;
      const maxScrollTop = scrollPane.scrollHeight - scrollPane.clientHeight;
      const nextScrollTop = Math.max(0, Math.min(maxScrollTop, previousScrollTop + deltaY));
      if (nextScrollTop !== previousScrollTop) {
        scrollPane.scrollTop = nextScrollTop;
        event.preventDefault();
      }
    }, { passive: false });
  }

  function renderTable() {
    if (!dom.grid) return;

    saveScrollPositions();

    const renderState = getRenderedTableState();
    const frozenNames = renderState.columnSet.slice(0, 3);
    const scrollNames = renderState.columnSet.slice(3);
    const { frozenGroups, scrollGroups } = getActiveColumnGroups(renderState.columnSet);
    const { columns: frozenColumns, totalWidth: frozenWidth } = buildColumnLayout(frozenNames);
    const { columns: scrollColumns, totalWidth: scrollWidth } = buildColumnLayout(scrollNames);

    const frozenTable = buildTable(frozenColumns, frozenWidth, frozenGroups, 'frozen', renderState);
    const scrollTable = buildTable(scrollColumns, scrollWidth, scrollGroups, 'scroll', renderState);

    const frozenPane = document.createElement('div');
    frozenPane.className = 'table-pane table-pane--frozen';
    frozenPane.append(frozenTable);

    const scrollPane = document.createElement('div');
    scrollPane.className = 'table-pane table-pane--scroll';
    scrollPane.append(scrollTable);

    const frame = document.createElement('div');
    frame.className = 'table-frame';
    frame.append(frozenPane, scrollPane);

    dom.grid.replaceChildren(frame);
    statsState.currentContainer = frame;
    statsState.needsFullRebuild = false;

    scrollPane.addEventListener('scroll', () => {
      if (frozenPane.scrollTop !== scrollPane.scrollTop) {
        frozenPane.scrollTop = scrollPane.scrollTop;
      }
    });

    attachFrozenPaneScrollProxy(frozenPane, scrollPane);

    let touchStartX = 0;
    scrollPane.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
    }, { passive: true });
    scrollPane.addEventListener('touchmove', (event) => {
      if (scrollPane.scrollLeft === 0 && event.touches[0]?.clientX > touchStartX) {
        event.preventDefault();
      }
    }, { passive: false });

    requestAnimationFrame(() => {
      syncRowHeights(frozenTable, scrollTable);
      observeRowResize(frozenTable, scrollTable);
      restoreScrollPositions(scrollPane, frozenPane);
    });

    if (dom.activeViewLabel) {
      const activeLabel = CATEGORY_LABELS[statsState.activePosition] || CATEGORY_LABELS.ALL;
      dom.activeViewLabel.textContent = statsState.rookieOnly && statsState.activePosition !== 'RDP'
        ? `${activeLabel} • Rookies`
        : activeLabel;
    }

    if (dom.rowCount) {
      const count = renderState.sortedRows.length;
      dom.rowCount.textContent = `${count} row${count === 1 ? '' : 's'}`;
    }

    dom.emptyState.classList.toggle('hidden', renderState.sortedRows.length > 0);
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
    if (statsState.currentTab === tabKey) return;
    statsState.currentTab = tabKey;
    statsState.sort = { column: 'FPTS', direction: 2 };
    statsState.needsFullRebuild = true; // Tab change requires full rebuild
    
    // Untoggle Pick Values (RDP) when switching tabs
    if (statsState.activePosition === 'RDP') {
      statsState.activePosition = 'ALL';
      // Update filter button states
      dom.filterGroup.querySelectorAll('.stats-filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.position === 'ALL');
      });
      // Update RDP button state
      const rdpButton = document.getElementById('statsSecondaryFilterGroup');
      if (rdpButton) {
        rdpButton.classList.remove('active');
      }
    }
    dom.tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabKey;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    dom.tabHeadings.forEach((heading) => {
      const isActive = heading.dataset.tabHeading === tabKey;
      heading.classList.toggle('hidden', !isActive);
    });
    if (!statsState.datasets.has(tabKey)) {
      toggleInlineLoading(true);
      loadTabData(tabKey).then(() => {
        // Build rank cache after data loads
        const dataset = statsState.datasets.get(tabKey);
        if (dataset) {
          statsState.rankCache = buildStatsPageRankCache(dataset);
        }
        toggleInlineLoading(false);
        renderTable();
      }).catch(() => toggleInlineLoading(false));
    } else {
      // Rebuild rank cache when switching to already-loaded tab
      const dataset = statsState.datasets.get(tabKey);
      if (dataset) {
        statsState.rankCache = buildStatsPageRankCache(dataset);
      }
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
    dom.searchClear.classList.toggle('visible', term.length > 0);
    
    // Debounce search to avoid re-rendering on every keystroke
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    searchDebounceTimer = setTimeout(() => {
      statsState.searchTerm = term.trim().toLowerCase();
      // Search changes filter, needs full rebuild
      statsState.needsFullRebuild = true;
      renderTable();
      searchDebounceTimer = null;
    }, 200); // 200ms debounce
  }
  function clearSearch() {
    // Clear any pending search debounce
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = null;
    }
    dom.searchInput.value = '';
    statsState.searchTerm = '';
    dom.searchClear.classList.remove('visible');
    statsState.needsFullRebuild = true;
    renderTable();
    dom.searchInput.focus();
  }
  function handleFilterClick(event) {
    const button = event.target.closest('.stats-filter-btn[data-position]') || event.target.closest('.stats-filter-btn-secondary[data-position]');
    if (!button || button.classList.contains('stats-rookie-btn')) return;
    const position = button.dataset.position;
    const prevPosition = statsState.activePosition;
    
    // Prevent re-render if clicking already active main filter
    if (button.classList.contains('stats-filter-btn') && statsState.activePosition === position) return;
    
    if (position === 'RDP') {
      // Toggle logic for RDP
      const newPosition = statsState.activePosition === 'RDP' ? 'ALL' : 'RDP';
      if (newPosition === prevPosition) return; // No change
      statsState.activePosition = newPosition;
    } else {
      if (position === prevPosition) return; // No change
      statsState.activePosition = position;
    }
    
    statsState.sort = statsState.activePosition === 'RDP'
      ? { column: null, direction: 0 }
      : { column: 'FPTS', direction: 2 }; // Reset sort when changing filter
    // Update main filters
    dom.filterGroup.querySelectorAll('.stats-filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.position === statsState.activePosition);
    });
    // Update secondary RDP filter (dom.secondaryFilterGroup IS the RDP button)
    if (dom.secondaryFilterGroup) {
      dom.secondaryFilterGroup.classList.toggle('active', statsState.activePosition === 'RDP');
    }
    syncReceivingSubfilterUi({ ensureReset: statsState.activePosition === 'Receiving' && prevPosition !== 'Receiving' });
    // Filter changes require full rebuild (different column set)
    statsState.needsFullRebuild = true;
    renderTable();
  }
  function handleReceivingSubfilterClick(event) {
    const btn = event.target.closest('.stats-receiving-subfilter');
    if (!btn) return;
    event.stopPropagation();
    if (statsState.activePosition !== 'Receiving') return;
    const key = btn.dataset.subfilter;
    if (!key || !RECEIVING_SUBFILTERS.includes(key)) return;
    const isActive = !!statsState.receivingSubfilters[key];
    if (isActive) {
      const activeCount = RECEIVING_SUBFILTERS.reduce((count, subKey) => (
        statsState.receivingSubfilters[subKey] ? count + 1 : count
      ), 0);
      if (activeCount <= 1) {
        return; // always keep at least one subfilter active
      }
    }
    statsState.receivingSubfilters[key] = !isActive;
    updateReceivingSubfilterButtons();
    // Subfilter changes data but not structure, use fast update
    updateTableRows();
  }
  function toggleRookieFilter() {
    statsState.rookieOnly = !statsState.rookieOnly;
    dom.rookieButton.classList.toggle('active', statsState.rookieOnly);
    statsState.sort = statsState.activePosition === 'RDP'
      ? { column: null, direction: 0 }
      : { column: 'FPTS', direction: 2 };
    // Rookie filter changes data, use fast update
    updateTableRows();
  }
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
    try {
      setLoading(true);
    } catch (e) {
      // silent – setLoading may not be available yet
    }
    toggleInlineLoading(true);
    try {
      await ensureLeagueContext();
      if (typeof fetchSleeperPlayers === 'function') {
        await fetchSleeperPlayers();
      }
      // Ensure KTC + pick values workbook is loaded (used for VALUE/RK + RDP rows).
      if (typeof fetchDataFromGoogleSheet === 'function') {
        await fetchDataFromGoogleSheet();
      }
      // Fetch ADP data from ADP_2026 tab (same workbook as KTC values).
      await fetchAdpData();
      // Don't await - weekly stats now load in background after page renders
      await loadAllTabs();
      scheduleTeamLogoPreload();
      
      // Build rank cache for the initial tab
      const initialDataset = statsState.datasets.get(statsState.currentTab);
      if (initialDataset) {
        statsState.rankCache = buildStatsPageRankCache(initialDataset);
      }
      
      // Set initial active filter buttons
      dom.filterGroup.querySelectorAll('.stats-filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.position === statsState.activePosition);
      });
      // dom.secondaryFilterGroup IS the RDP button
      if (dom.secondaryFilterGroup) {
        dom.secondaryFilterGroup.classList.toggle('active', statsState.activePosition === 'RDP');
      }
      dom.rookieButton.classList.toggle('active', statsState.rookieOnly);
      syncReceivingSubfilterUi();
      statsState.needsFullRebuild = true; // Initial render needs full rebuild
      renderTable();
      wireGameLogControls();
      
      // Start loading weekly stats in background (non-blocking)
      if (typeof fetchPlayerStatsSheets === 'function') {
        fetchPlayerStatsSheets().catch(err => {
          console.warn('Background load of weekly stats failed:', err);
        });
      }
    } catch (error) {
      console.error('Failed to initialise stats page:', error);
      if (dom.emptyState) {
        dom.emptyState.textContent = 'Unable to load stats data at this time.';
        dom.emptyState.classList.remove('hidden');
      }
    } finally {
      toggleInlineLoading(false);
      try {
        setLoading(false);
      } catch (e) {
        // ignore
      }
    }
  }
  dom.tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => toggleTab(btn.dataset.tab));
  });
  dom.searchInput.addEventListener('input', handleSearchInput);
  dom.searchClear.addEventListener('click', clearSearch);
  dom.filterGroup.addEventListener('click', handleFilterClick);
  dom.secondaryFilterGroup.addEventListener('click', handleFilterClick);
  dom.rookieButton.addEventListener('click', toggleRookieFilter);
  dom.receivingSubfilters?.addEventListener('click', handleReceivingSubfilterClick);
  
  // Stats Key Popup handlers
  const statsKeyButton = document.getElementById('statsKeyButton');
  const statsKeyPopup = document.getElementById('statsKeyPopup');
  const statsKeyPopupClose = document.getElementById('statsKeyPopupClose');
  
  if (statsKeyButton && statsKeyPopup && statsKeyPopupClose) {
    statsKeyButton.addEventListener('click', () => {
      statsKeyPopup.classList.add('visible');
    });
    
    statsKeyPopupClose.addEventListener('click', () => {
      statsKeyPopup.classList.remove('visible');
    });
    
    // Close on overlay click
    statsKeyPopup.addEventListener('click', (e) => {
      if (e.target === statsKeyPopup) {
        statsKeyPopup.classList.remove('visible');
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && statsKeyPopup.classList.contains('visible')) {
        statsKeyPopup.classList.remove('visible');
      }
    });
  }
  
  // Use event delegation on wrapper to handle clicks from both header and body tables
  dom.tableWrappers.forEach((wrapper) => {
    wrapper.addEventListener('click', (event) => {
      const th = event.target.closest('th[data-column-key]');
      if (th) {
        handleSortClick(event);
        return;
      }

      const btn = event.target.closest('.stats-player-btn');
      if (btn) {
        const entryIndex = parseInt(btn.dataset.entryIndex, 10);
        const entry = statsState.lastRenderedRows[entryIndex];
        if (entry) {
          openGameLogs(entry);
        }
      }
    });
  });
  syncReceivingSubfilterUi();
  initialise();
})();
