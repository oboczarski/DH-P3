(function () {
  if (typeof document === 'undefined') return;
  const root = document.body;
  if (!root || root.dataset.page !== 'stats') return;
  const TAB_CONFIG = {
    oneQb: { sheet: 'STAT_1QB', headingSelector: '[data-tab-heading="oneQb"]' },
    sflx: { sheet: 'STAT_SFLX', headingSelector: '[data-tab-heading="sflx"]' }
  };
  const HEADER_ALIASES = new Map([
    ['PLAYER NAME', 'PLAYER'],
    ['POS RK', 'POS | RK'],
    ['POS·RK', 'POS | RK'],
    ['POS_RK', 'POS | RK'],
    ['TEAM', 'TM'],
    ['FPTS_PPR', 'FPTS'],
    ['FPT_PPR', 'FPTS'],
    ['YDS(T)', 'YDS(t)'],
    ['YPG(T)', 'YPG(t)'],
    ['IMP/OPP', 'IMP/OPP']
  ]);
  const COLUMN_SETS = {
    default: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'YDS(t)', 'YPG(t)', 'OPP', 'IMP', 'IMP/OPP', 'CSTY%', 'CL'],
    QB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'paRTG', 'paYDS', 'paTD', 'CMP%', 'paATT', 'CMP', 'YDS(t)', 'paYPG', 'ruYDS', 'ruTD', 'pa1D', 'IMP/G', 'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    RB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'CAR', 'ruYDS', 'YPC', 'ruTD', 'REC', 'recYDS', 'TGT', 'YDS(t)', 'ruYPG', 'ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D', 'recTD', 'rec1D', 'YAC', 'IMP/G', 'FUM', 'FPOE', 'CSTY%', 'CL'],
    WR: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM', 'CSTY%', 'CL'],
    TE: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM', 'CSTY%', 'CL']
  };
  const COLUMN_CATEGORY = {
    'FPTS': 'all',
    'PPG': 'all',
    'VALUE': 'all',
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
    'paRTG': 'passing',
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
    'CAR': 'rushing',
    'YPC': 'rushing',
    'ELU': 'rushing',
    'MTF/A': 'rushing',
    'YCO/A': 'rushing',
    'MTF': 'rushing',
    'YCO': 'rushing',
    'FPOE': 'all',
    'FUM': 'all',
    'CSTY%': 'all',
    'CL': 'all'
  };
  const INTEGER_COLUMNS = new Set([
    'RK', 'G', 'VALUE', 'YDS(t)', 'OPP', 'IMP', 'paYDS', 'paTD', 'paATT', 'CMP', 'pa1D', 'ruYDS', 'ruTD',
    'CAR', 'SAC', 'INT', 'FUM', 'REC', 'TGT', 'ru1D', 'recTD', 'rec1D', 'YAC', 'RR', 'MTF', 'YCO'
  ]);
  const DECIMAL_PRECISION = new Map([
    ['AGE', 1],
    ['YPG(t)', 1],
    ['paYPG', 1],
    ['ruYPG', 1],
    ['recYPG', 1],
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
    ['1DRR', 2],
    ['CL', 1]
  ]);
  const PERCENT_PRECISION = new Map([
    ['SNP%', 1],
    ['PRS%', 1],
    ['CMP%', 1],
    ['TS%', 1],
    ['CSTY%', 1]
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
  
  // Column width configuration (explicit pixel values for perfect alignment)
  const STATS_COLUMN_WIDTHS = {
    'RK': 44,
    'PLAYER': 96,  // Reduced by half from 192
    'POS': 52,
    'TM': 52,
    'AGE': 52,
    'G': 52,
    'FPTS': 76,
    'PPG': 76,
    'VALUE': 76,
    'SNP%': 76,
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
    'YCO': 76,
    'ru1D': 64,
    'recTD': 64,
    'rec1D': 64,
    'YAC': 76,
    'IMP/G': 76,
    'FUM': 64,
    'FPOE': 76,
    'CSTY%': 90,
    'CL': 64,
    'paRTG': 76,
    'paYDS': 76,
    'paTD': 64,
    'CMP%': 76,
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
    'YPR': 64,
    'RR': 64,
    'OPP': 64,
    'IMP': 64,
    'IMP/OPP': 76
  };
  
  const DEFAULT_COLUMN_WIDTH = 76;
  
  function getColumnWidth(columnKey) {
    const baseWidth = STATS_COLUMN_WIDTHS[columnKey] || DEFAULT_COLUMN_WIDTH;
    // Scale down by 25% on mobile (600px and below)
    const isMobile = window.innerWidth <= 600;
    return isMobile ? Math.round(baseWidth * 0.75) : baseWidth;
  }
  
  const statsState = {
    currentTab: 'oneQb',
    activePosition: 'ALL',
    rookieOnly: false,
    searchTerm: '',
    sort: { column: null, direction: 0 },
    datasets: new Map(),
    headerLabels: new Map(),
    availableColumns: new Map(),
    rankCache: null,
    lastRenderedRows: []
  };
  const dom = {
    tabButtons: Array.from(document.querySelectorAll('.stats-tab-button')),
    tabHeadings: Array.from(document.querySelectorAll('.stats-tab-heading')),
    tableWrappers: Array.from(document.querySelectorAll('.stats-table-wrapper')),
    loading: document.getElementById('statsLoading'),
    emptyState: document.getElementById('statsEmptyState'),
    searchInput: document.getElementById('statsSearchInput'),
    searchClear: document.getElementById('statsSearchClear'),
    filterGroup: document.getElementById('statsFilterGroup'),
    rookieButton: document.querySelector('.stats-rookie-btn'),
    secondaryFilterGroup: document.getElementById('statsSecondaryFilterGroup'),
    leagueChip: document.getElementById('statsLeagueContext')
  };
  const gameLogDom = {
    modal: document.getElementById('game-logs-modal'),
    closeBtn: document.querySelector('#game-logs-modal .modal-close-btn'),
    overlay: document.querySelector('#game-logs-modal .modal-overlay'),
    infoBtn: document.querySelector('#game-logs-modal .modal-info-btn'),
    keyPanel: document.getElementById('stats-key-container'),
    radarPanel: document.getElementById('radar-chart-container'),
    newsPanel: document.getElementById('news-container')
  };
  if (dom.leagueChip) {
    dom.leagueChip.textContent = 'DH DATA HUB';
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
      const displayLabel = raw || canonical;
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
    const team = (row.TM || '').toUpperCase() || (state.players?.[playerId]?.team || 'FA');
    const rank = toNumber(row.RK, { allowFloat: false }) ?? Infinity;
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
    
    // Stats page ONLY uses Google Sheets data for FPTS/PPG - no league-specific calculations
    const fpts = toNumber(row.FPTS);
    const ppg = toNumber(row.PPG);
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
    if (!statsState.activePosition || statsState.activePosition === 'ALL') return COLUMN_SETS.default;
    if (statsState.activePosition === 'QB') return COLUMN_SETS.QB;
    if (statsState.activePosition === 'RB') return COLUMN_SETS.RB;
    if (statsState.activePosition === 'Receiving') return COLUMN_SETS.WR; // Use WR set for Receiving
    if (statsState.activePosition === 'TE') return COLUMN_SETS.TE;
    return COLUMN_SETS.default;
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
        if (meta.pos !== 'WR' && meta.pos !== 'TE') return false;
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
    if (sortColumn && statsState.sort.direction !== 0) {
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
    const numericColumns = new Set([
      'RK', 'AGE', 'G', 'FPTS', 'PPG', 'VALUE', 'YDS(t)', 'YPG(t)', 'IMP', 'IMP/OPP', 'paRTG', 'paYDS', 'paTD', 'CMP%', 'paATT', 'CMP', 'paYPG', 'ruYDS', 'ruTD', 'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM', 'FPOE', 'SNP%', 'REC', 'TGT', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D', 'recTD', 'rec1D', 'YAC', 'ELU', 'ruYPG', 'YPRR', '1DRR', 'recYPG', 'YPR', 'RR', 'CSTY%', 'CL'
    ]);
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
    if (numericColumns.has(column)) {
      const numA = toNumber(aRaw);
      const numB = toNumber(bRaw);
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
  function formatCellValue(column, entry) {
    const { row, meta } = entry;
    if (column === 'PLAYER') {
      if (statsState.activePosition === 'RDP' || meta.pos === 'RDP') {
        return meta.fullName || meta.name || '';
      }
      return meta.displayName || row[column] || meta.name || '';
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
      const rank = entry.meta.currentRank;
      if (rank === null || rank === undefined) return '';
      return formatInteger(rank);
    }
    const raw = row[column];
    const formatted = formatSheetCellValue(column, raw);
    if (formatted !== '') return formatted;
    if (raw === undefined || raw === null) return '';
    return raw;
  }
  function applySortIndicator(target) {
    if (statsState.sort.direction === 1) {
      target.classList.add('stats-sort-asc');
    } else if (statsState.sort.direction === 2) {
      target.classList.add('stats-sort-desc');
    }
  }
  
  function renderTable() {
    // Note: We use manual rendering for frozen columns, so TanStack Table is optional
    // Keeping the check for potential future use, but not required for current implementation

    const dataset = getActiveDataset();
    const baseColumnSet = getColumnSet();
    const availableColumns = statsState.availableColumns.get(statsState.currentTab);
    const columnSet = baseColumnSet.filter((column, index) => {
      if (index < 3) return true; // Always show first 3 columns
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
      if (entry.meta.pos !== 'RDP') {
        entry.meta.currentRank = index + 1;
      } else {
        entry.meta.currentRank = null;
      }
    });
    
    statsState.lastRenderedRows = sortedRows;

    // --- Data Transformation for TanStack Table ---
    const createTextDescriptor = (text, style) => ({
      render: (td) => {
        td.textContent = text;
        if (style) Object.assign(td.style, style);
      }
    });

    const tableRows = sortedRows.map((entry, entryIndex) => {
      const rowData = {};
      for (const column of columnSet) {
        const textValue = formatCellValue(column, entry);
        if (column === 'PLAYER') {
          rowData[column] = {
            render: (td) => {
              td.classList.add('stats-player-cell');
              const button = document.createElement('button');
              button.type = 'button';
              button.className = 'stats-player-btn';
              button.dataset.playerId = entry.meta.playerId;
              button.dataset.entryIndex = entryIndex;
              button.textContent = textValue;
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
              span.textContent = textValue;
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
                const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
                td.innerHTML = (teamKey && teamKey !== 'FA')
                  ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20" loading="lazy" decoding="async">`
                  : `<span class="stats-team-chip" style="${entry.meta.teamStyle}">${textValue}</span>`;
              }
            }
          };
        } else {
          rowData[column] = createTextDescriptor(textValue);
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
    const wrapper = dom.tableWrappers.find((el) => el.dataset.tabPanel === statsState.currentTab);
    const otherWrappers = dom.tableWrappers.filter((el) => el !== wrapper);
    wrapper.classList.remove('hidden');
    otherWrappers.forEach((el) => el.classList.add('hidden'));

    // Preserve caption if it exists, then clear existing content
    const existingCaption = wrapper.querySelector('caption');
    wrapper.innerHTML = '';

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
    // Ensure header table has same width as body table for proper alignment
    scrollableHeaderTable.style.width = `${scrollableWidth}px`;
    scrollableHeaderTable.style.minWidth = `${scrollableWidth}px`;
    const scrollableHeaderThead = document.createElement('thead');
    scrollableHeaderTable.appendChild(scrollableHeaderThead);
    scrollableHeader.appendChild(scrollableHeaderTable);
    
    hScrollContainer.appendChild(scrollableHeader);
    // Don't add scrollableBodyWrapper to hScrollContainer - it's only for reference
    
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
    
    // Scrollable body (columns 4+) - inside vertical scroll, with margin for frozen columns
    const scrollableBody = document.createElement('div');
    scrollableBody.className = 'stats-scrollable-body';
    const scrollableBodyTable = createSectionTable(scrollableColumns, scrollableColumnSizes);
    scrollableBodyTable.style.width = `${scrollableWidth}px`;
    scrollableBodyTable.style.minWidth = `${scrollableWidth}px`;
    const scrollableBodyTbody = document.createElement('tbody');
    scrollableBodyTable.appendChild(scrollableBodyTbody);
    scrollableBody.appendChild(scrollableBodyTable);
    
    // Assemble structure:
    // - frozenBody should be positioned relative to container (not inside scroll containers)
    // - vScrollContent contains scrollableBody
    vScrollContent.appendChild(scrollableBody);
    vScrollContainer.appendChild(vScrollContent);
    
    hScrollContainer.appendChild(scrollableHeader);
    hScrollContainer.appendChild(vScrollContainer);
    
    // Add frozen body to container (not inside scroll containers) so it can align with frozen corner
    container.appendChild(frozenCorner);
    container.appendChild(frozenBody); // Add frozen body to container so it's positioned relative to container
    container.appendChild(hScrollContainer);
    wrapper.appendChild(container);

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

    // Debug: Log column splits
    console.log('Column split:', {
      totalColumns: columnSet.length,
      columnSet: columnSet,
      frozenColumns: frozenColumns,
      scrollableColumns: scrollableColumns,
      frozenColumnSizes: frozenColumnSizes,
      scrollableColumnSizes: scrollableColumnSizes,
      frozenWidth,
      scrollableWidth,
      sizesMatch: frozenColumnSizes.length === frozenColumns.length && scrollableColumnSizes.length === scrollableColumns.length
    });
    
    // Validate column splits
    if (frozenColumnSizes.length !== frozenColumns.length) {
      console.error('Mismatch: frozenColumnSizes.length !== frozenColumns.length', {
        frozenColumnSizes: frozenColumnSizes.length,
        frozenColumns: frozenColumns.length
      });
    }
    if (scrollableColumnSizes.length !== scrollableColumns.length) {
      console.error('Mismatch: scrollableColumnSizes.length !== scrollableColumns.length', {
        scrollableColumnSizes: scrollableColumnSizes.length,
        scrollableColumns: scrollableColumns.length
      });
    }
    
    // Render frozen corner header (first 3 columns)
    renderHeaderCells(frozenCornerThead, frozenColumns, frozenColumnSizes, null);
    
    // Render scrollable header (columns 4+)
    renderHeaderCells(scrollableHeaderThead, scrollableColumns, scrollableColumnSizes, null);

    // Render frozen body rows (first 3 columns)
    renderBodyRows(frozenBodyTbody, frozenColumns, frozenColumnSizes, null, tableRows);

    // Render scrollable body rows (columns 4+)
    renderBodyRows(scrollableBodyTbody, scrollableColumns, scrollableColumnSizes, null, tableRows);
    
    // Debug: Verify rendered columns
    console.log('Frozen body rows:', frozenBodyTbody.rows.length, 'Scrollable body rows:', scrollableBodyTbody.rows.length);
    if (frozenBodyTbody.rows.length > 0) {
      const frozenRow = frozenBodyTbody.rows[0];
      console.log('Frozen body first row:', {
        cells: frozenRow.cells.length,
        expected: frozenColumns.length,
        columnNames: frozenColumns,
        cellContents: Array.from(frozenRow.cells).map((c, i) => ({ index: i, col: frozenColumns[i], content: c.textContent.trim().substring(0, 20) }))
      });
    }
    if (scrollableBodyTbody.rows.length > 0) {
      const scrollableRow = scrollableBodyTbody.rows[0];
      console.log('Scrollable body first row:', {
        cells: scrollableRow.cells.length,
        expected: scrollableColumns.length,
        columnNames: scrollableColumns,
        cellContents: Array.from(scrollableRow.cells).map((c, i) => ({ index: i, col: scrollableColumns[i], content: c.textContent.trim().substring(0, 20) }))
      });
      // Also check if rowData has the expected columns
      if (tableRows.length > 0) {
        const firstRowData = tableRows[0];
        console.log('First rowData keys:', Object.keys(firstRowData));
        console.log('Expected scrollable columns in rowData:', scrollableColumns.map(col => ({ col, exists: col in firstRowData, value: firstRowData[col] ? 'exists' : 'missing' })));
      }
    }

    // Calculate table widths
    if (Number.isFinite(frozenWidth) && frozenWidth > 0) {
      frozenCornerTable.style.width = `${frozenWidth}px`;
      frozenCornerTable.style.minWidth = `${frozenWidth}px`;
      frozenBodyTable.style.width = `${frozenWidth}px`;
      frozenBodyTable.style.minWidth = `${frozenWidth}px`;
    }
    
    // Set explicit widths for scrollable tables - MUST equal sum of all column widths for table-layout: fixed
    // This ensures ALL columns render, even if table is wider than viewport (enables horizontal scrolling)
    if (Number.isFinite(scrollableWidth) && scrollableWidth > 0) {
      // With table-layout: fixed, table width MUST equal sum of column widths for all columns to render
      scrollableHeaderTable.style.width = `${scrollableWidth}px`;
      scrollableHeaderTable.style.minWidth = `${scrollableWidth}px`;
      scrollableBodyTable.style.width = `${scrollableWidth}px`;
      scrollableBodyTable.style.minWidth = `${scrollableWidth}px`;
      // Ensure containers allow full width (don't constrain tables)
      scrollableHeader.style.minWidth = `${scrollableWidth}px`;
      scrollableBody.style.minWidth = `${scrollableWidth}px`;
      
      console.log('Table widths set:', {
        scrollableWidth,
        scrollableColumns: scrollableColumns.length,
        scrollableColumnSizes: scrollableColumnSizes,
        calculatedWidth: scrollableColumnSizes.reduce((sum, size) => sum + (size || 0), 0),
        headerTableStyleWidth: scrollableHeaderTable.style.width,
        bodyTableStyleWidth: scrollableBodyTable.style.width
      });
    }
    
    // Get header height for positioning
    const getHeaderHeight = () => {
      return scrollableHeader.offsetHeight || frozenCorner.offsetHeight || 50;
    };

    // Set header heights to match
    setTimeout(() => {
      const headerHeight = getHeaderHeight();
      if (headerHeight > 0) {
        frozenCorner.style.height = `${headerHeight}px`;
        scrollableHeader.style.height = `${headerHeight}px`;
      }
    }, 0);

    // Scroll synchronization
    let isSyncingHorizontal = false;
    
    // Calculate content height and position frozen body below header
    const updateContentHeight = () => {
      const headerHeight = getHeaderHeight();
      const scrollableBodyHeight = scrollableBodyTable.offsetHeight;
      const frozenBodyHeight = frozenBodyTable.offsetHeight;
      const maxHeight = Math.max(scrollableBodyHeight, frozenBodyHeight);
      
      // Set explicit heights and position frozen body below header
      if (maxHeight > 0 && headerHeight > 0) {
        // Position frozen body below frozen corner header
        frozenBody.style.top = `${headerHeight}px`;
        frozenBody.style.height = `calc(100% - ${headerHeight}px)`;
        frozenBody.style.maxHeight = `calc(100% - ${headerHeight}px)`;
        vScrollContent.style.minHeight = `${maxHeight}px`;
      }
    };
    
    // Sync vertical scrolling between frozen body and scrollable body
    let isSyncingVertical = false;
    vScrollContainer.addEventListener('scroll', () => {
      if (!isSyncingVertical) {
        isSyncingVertical = true;
        frozenBody.scrollTop = vScrollContainer.scrollTop;
        isSyncingVertical = false;
      }
    });
    
    frozenBody.addEventListener('scroll', () => {
      if (!isSyncingVertical) {
        isSyncingVertical = true;
        vScrollContainer.scrollTop = frozenBody.scrollTop;
        isSyncingVertical = false;
      }
    });
    
    // Update height after rendering
    setTimeout(updateContentHeight, 0);
    
    // Also update on window resize
    window.addEventListener('resize', updateContentHeight);
    
    // Route horizontal wheel/trackpad gestures to horizontal scroll container
    vScrollContainer.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        hScrollContainer.scrollLeft += e.deltaX !== 0 ? e.deltaX : e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
    
    // Also handle horizontal scroll on frozen body
    frozenBody.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        hScrollContainer.scrollLeft += e.deltaX !== 0 ? e.deltaX : e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
    
    // Initialize scroll positions
    hScrollContainer.scrollLeft = 0;
    vScrollContainer.scrollTop = 0;

    // Empty state handling
    dom.emptyState.classList.toggle('hidden', sortedRows.length > 0);
  }
  function openGameLogs(entry) {
    if (typeof handlePlayerNameClick !== 'function') return;
    const { meta } = entry;
    const valuations = state.isSuperflex ? state.sflxData?.[meta.playerId] : state.oneQbData?.[meta.playerId];
    
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
      ktc: valuations?.ktc || entry.meta.value || 0,
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
      gameLogDom.newsPanel?.classList.add('hidden');
      
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
      gameLogDom.closeBtn?.addEventListener('click', performModalClose);
      gameLogDom.overlay?.addEventListener('click', performModalClose);
      
      // Panel toggle buttons with tab-like behavior
      const modalInfoBtns = document.querySelectorAll('#game-logs-modal .modal-info-btn');
      modalInfoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetPanel = btn.getAttribute('data-panel');
          const overlayContainers = {
            'stats-key': gameLogDom.keyPanel,
            'radar-chart': gameLogDom.radarPanel,
            'news': gameLogDom.newsPanel
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
          
          // For overlay panels (stats-key, radar-chart, news)
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
    statsState.sort = { column: null, direction: 0 };
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
      statsState.sort = { column, direction: 2 }; // Start with descending
    } else {
      // Cycle: 2 (desc) -> 1 (asc) -> 0 (none)
      if (statsState.sort.direction === 2) {
        statsState.sort.direction = 1;
      } else if (statsState.sort.direction === 1) {
        statsState.sort.direction = 0;
        statsState.sort.column = null;
      } else {
        // This case should ideally not be hit if starting from a sorted state, but as a fallback:
        statsState.sort.direction = 2;
      }
    }
    renderTable();
  }
  function handleSearchInput(event) {
    const term = event.target.value || '';
    statsState.searchTerm = term.trim().toLowerCase();
    dom.searchClear.classList.toggle('visible', term.length > 0);
    renderTable();
  }
  function clearSearch() {
    dom.searchInput.value = '';
    statsState.searchTerm = '';
    dom.searchClear.classList.remove('visible');
    renderTable();
    dom.searchInput.focus();
  }
  function handleFilterClick(event) {
    const button = event.target.closest('.stats-filter-btn[data-position]') || event.target.closest('.stats-filter-btn-secondary[data-position]');
    if (!button || button.classList.contains('stats-rookie-btn')) return;
    const position = button.dataset.position;
    // Prevent de-selecting the active filter if it's a main filter
    if (button.classList.contains('stats-filter-btn') && statsState.activePosition === position) return;
    if (position === 'RDP') {
      // Toggle logic for RDP
      statsState.activePosition = statsState.activePosition === 'RDP' ? 'ALL' : 'RDP';
    } else {
      statsState.activePosition = position;
    }
    statsState.sort = { column: null, direction: 0 }; // Reset sort when changing filter
    // Update main filters
    dom.filterGroup.querySelectorAll('.stats-filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.position === statsState.activePosition);
    });
    // Update secondary RDP filter
    const rdpButton = dom.secondaryFilterGroup.querySelector('[data-position="RDP"]');
    if (rdpButton) {
      rdpButton.classList.toggle('active', statsState.activePosition === 'RDP');
    }
    renderTable();
  }
  function toggleRookieFilter() {
    statsState.rookieOnly = !statsState.rookieOnly;
    dom.rookieButton.classList.toggle('active', statsState.rookieOnly);
    statsState.sort = { column: null, direction: 0 };
    renderTable();
  }
  function toggleInlineLoading(show) {
    if (!dom.loading) return;
    dom.loading.classList.toggle('hidden', !show);
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
  async function fetchSheetCsv(sheetName) {
    const sheetId = typeof PLAYER_STATS_SHEET_ID !== 'undefined'
      ? PLAYER_STATS_SHEET_ID
      : '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
    return response.text();
  }
  async function loadTabData(tabKey) {
    const tab = TAB_CONFIG[tabKey];
    if (!tab) return;
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
      setLoading(true, 'Loading stats...');
    } catch (e) {
      // silent – setLoading may not be available yet
    }
    toggleInlineLoading(true);
    try {
      await ensureLeagueContext();
      if (typeof fetchSleeperPlayers === 'function') {
        await fetchSleeperPlayers();
      }
      // Don't await - weekly stats now load in background after page renders
      await loadAllTabs();
      
      // Build rank cache for the initial tab
      const initialDataset = statsState.datasets.get(statsState.currentTab);
      if (initialDataset) {
        statsState.rankCache = buildStatsPageRankCache(initialDataset);
      }
      
      // Set initial active filter buttons
      dom.filterGroup.querySelectorAll('.stats-filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.position === statsState.activePosition);
      });
      const rdpButton = dom.secondaryFilterGroup.querySelector('[data-position="RDP"]');
      if (rdpButton) {
        rdpButton.classList.toggle('active', statsState.activePosition === 'RDP');
      }
      dom.rookieButton.classList.toggle('active', statsState.rookieOnly);
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
  initialise();
})();
