(function() {
// Dashboard season data is loaded independently from the maintained 2026 season CSV.
// === State ===
let players = [];
let scatterAll = [];
let dashboardData;
let dashboardLayout;
let dashboardInitPromise;
let scatterTooltipCleanup;
const dashState = { selectedPlayerId: null, filter: 'all', scatterFilter: 'ALL' };

// === Helpers ===
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const getSelected = () => players.find(p => p.id === dashState.selectedPlayerId) || players[0];

const RADAR_STATS_CONFIG = {
  QB: {
    stats: ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'yds_total', 'ttt', 'epa_db', 'cpoe'],
    labels: ['FPTS', 'PPG', 'paRTG', 'CMP%', 'YDS(t)', 'TTT', 'EPA/DB', 'CPOE'],
    maxRank: 36,
    invert: new Set(['ttt'])
  },
  RB: {
    stats: ['fpts', 'ppg', 'yds_total', 'snp_pct', 'ypc', 'rec_tgt', 'mtf_per_att', 'yco_per_att'],
    labels: ['FPTS', 'PPG', 'YDS(t)', 'SNP%', 'YPC', 'TGT', 'MTF/A', 'YCO/A'],
    maxRank: 48,
    invert: new Set()
  },
  WR: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 72,
    invert: new Set()
  },
  TE: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 24,
    invert: new Set()
  }
};

// Position-specific palettes: pick 1-4 to compare distinct schemes.
const RADAR_THEME_VARIANT = 1; // 1-4
// Custom ring mids (exact colors per ring, inner -> outer)
const QB_CUSTOM_RING_MIDS = ['#ff0aa5ff', '#fe26f7ff', '#d747ffff', '#a74effff', '#7866FF', '#4D79FF', '#00a9f1ff', '#00DDFA'];
const RB_CUSTOM_RING_MIDS = ['#e8d058ff', '#FFB847', '#FF916B', '#FF6B6B', '#f94d95ff', '#CE34F9', '#8F33FF', '#7B5CFF'];
const WR_CUSTOM_RING_MIDS = ['#00FF99', '#3ffdbeff', '#69D6FF', '#52ACF8', '#5882D6', '#6053D5', '#5F03DF', '#3A0CA3'];
const TE_CUSTOM_RING_MIDS = ['#00FF99', '#00FFCC', '#0099FF', '#0066ffff', '#4c00ffff', '#5D00FF', '#8F00FF', '#D200FF'];
const RADAR_THEME_VARIANTS = [
  {
    name: 'Nocturne',
    anchors: {
      QB: ['#101A3A', '#2C5BFF', '#00C9FF', '#D8F6FF'],
      RB: ['#2A0500', '#8A1A00', '#FF4D1A', '#FFB347'],
      WR: ['#052A18', '#00A86B', '#2BFF88', '#C7FF2E'],
      TE: ['#250530', '#6B1FA8', '#D62BFF', '#FF6B98']
    }
  },
  {
    name: 'Desert-Glass',
    anchors: {
      QB: ['#0B1E2D', '#0D5D8F', '#46C2FF', '#E6FFFF'],
      RB: ['#2B140A', '#7A3A20', '#FF8A2A', '#FFE08A'],
      WR: ['#042A2E', '#007C88', '#00E6C3', '#B9FFF1'],
      TE: ['#2A001E', '#7A003E', '#C026D3', '#FFC1D6']
    }
  },
  {
    name: 'Circuit-Bloom',
    anchors: {
      QB: ['#190B3A', '#4B2BFF', '#00B2FF', '#9AE6FF'],
      RB: ['#2E1000', '#B12C00', '#FF6A00', '#FFE66D'],
      WR: ['#003B1E', '#00C26E', '#7CFF00', '#F2FF7A'],
      TE: ['#1E0B2E', '#5D1E9C', '#FF2D9A', '#FF7A8A']
    }
  },
  {
    name: 'Polar-Ember',
    anchors: {
      QB: ['#0C1020', '#1A2CFF', '#00D6FF', '#DFF6FF'],
      RB: ['#1B0B0B', '#C1123A', '#FF7A00', '#FFD1A6'],
      WR: ['#022E2A', '#00B37E', '#4CFF8F', '#D7FF6A'],
      TE: ['#220C2E', '#9C27B0', '#FF2D9A', '#FF6B98']
    }
  }
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const hexToRgb = (hex) => {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length !== 6) return { r: 255, g: 255, b: 255 };
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
};
const rgbToHex = (r, g, b) => {
  const toHex = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
const mixHex = (a, b, t) => {
  const ta = clamp01(t);
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  const r = c1.r + (c2.r - c1.r) * ta;
  const g = c1.g + (c2.g - c1.g) * ta;
  const bch = c1.b + (c2.b - c1.b) * ta;
  return rgbToHex(r, g, bch);
};
const hexToRgba = (hex, alpha) => {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
};
const lerpColor = (a, b, t) => mixHex(a, b, t);

const buildPaletteFromAnchors = (anchors, count = 8) => {
  const steps = Math.max(1, count);
  const segments = Math.max(1, anchors.length - 1);
  const mids = [];
  for (let i = 0; i < steps; i += 1) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const seg = Math.min(segments - 1, Math.floor(t * segments));
    const localT = (t - seg / segments) * segments;
    const mid = lerpColor(anchors[seg], anchors[seg + 1], localT);
    mids.push(mid);
  }
  return mids.map((mid, idx) => {
    const start = mixHex(mid, '#FFFFFF', 0.35);
    const end = mixHex(mid, '#000000', 0.28);
    return { name: `ring-${idx + 1}`, stops: [start, mid, end] };
  });
};

const buildPaletteFromMids = (mids) => (
  mids.map((mid, idx) => {
    const start = mixHex(mid, '#FFFFFF', 0.35);
    const end = mixHex(mid, '#000000', 0.28);
    return { name: `ring-${idx + 1}`, stops: [start, mid, end] };
  })
);

const buildThemePalettes = (anchorsByPos) => ({
  QB: buildPaletteFromAnchors(anchorsByPos.QB),
  RB: buildPaletteFromAnchors(anchorsByPos.RB),
  WR: buildPaletteFromAnchors(anchorsByPos.WR),
  TE: buildPaletteFromAnchors(anchorsByPos.TE)
});

const themeIndex = Math.min(Math.max(RADAR_THEME_VARIANT - 1, 0), RADAR_THEME_VARIANTS.length - 1);
const ACTIVE_RADAR_THEME = RADAR_THEME_VARIANTS[themeIndex];
const RADAR_PALETTES = buildThemePalettes(ACTIVE_RADAR_THEME.anchors);
if (QB_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.QB = buildPaletteFromMids(QB_CUSTOM_RING_MIDS);
}
if (RB_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.RB = buildPaletteFromMids(RB_CUSTOM_RING_MIDS);
}
if (WR_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.WR = buildPaletteFromMids(WR_CUSTOM_RING_MIDS);
}
if (TE_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.TE = buildPaletteFromMids(TE_CUSTOM_RING_MIDS);
}

const getRadarPalette = (pos) => RADAR_PALETTES[pos] || RADAR_PALETTES.QB;
const getRadarRingColors = (palette) => palette.map(gradient => gradient.stops[1] || gradient.stops[0]);
let activeRadarPalette = getRadarPalette('QB');
let activeRadarColors = getRadarRingColors(activeRadarPalette);

function applyRadarLegendPalette(palette) {
  const dots = document.querySelectorAll('.fc-legend .fc-dot');
  if (!dots.length) return;
  dots.forEach((dot, idx) => {
    const gradient = palette[idx % palette.length];
    const start = gradient.stops[0];
    const mid = gradient.stops[1] || gradient.stops[0];
    const end = gradient.stops[2] || gradient.stops[1] || gradient.stops[0];
    dot.style.backgroundColor = mid;
    dot.style.backgroundImage = `linear-gradient(135deg, ${start}, ${mid} 55%, ${end})`;
    dot.style.boxShadow = `0 0 3px ${hexToRgba(mid, 0.18)}`;
  });
}

function setRadarPalette(pos) {
  activeRadarPalette = getRadarPalette(pos);
  activeRadarColors = getRadarRingColors(activeRadarPalette);
  applyRadarLegendPalette(activeRadarPalette);
}

// Utility helpers
const formatPct1 = (n) => Number.isFinite(n) ? `${n.toFixed(1)}%` : 'NA';
const formatNum1 = (n) => Number.isFinite(n) ? n.toFixed(1) : 'NA';
const ordinal = (n) => {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return Number.isFinite(n) ? `${n}${s[(v-20)%10]||s[v]||s[0]}` : 'NA';
};
const ordinalParts = (n) => {
  if (!Number.isFinite(n)) return { num: 'NA', suffix: '' };
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  const suffix = s[(v-20)%10] || s[v] || s[0];
  return { num: `${Math.trunc(n)}`, suffix };
};
const rankColor = (rank) => {
  if (!Number.isFinite(rank)) return '#9ca3af';
  if (rank <= 3) return '#76ffc3';         // bright green
  if (rank <= 6) return '#3EACD1';          // cyan for elite
  if (rank <= 10) return '#728cff';          // purple for very good
  return '#A27FF0';                         // red for lower
};

const getRadarRankColor = (rank) => {
  if (!Number.isFinite(rank)) return '#9ca3af';
  if (rank <= 3) return '#76FFC3';
  if (rank <= 12) return '#3EACD1';
  if (rank <= 18) return '#728CFF';
  if (rank <= 24) return '#A27FF0';
  if (rank <= 36) return '#FF6FE1';
  return '#FF2EB2';
};

function computePositionalRanks(players) {
  const byPos = { QB: [], RB: [], WR: [], TE: [] };
  players.forEach(p => { if (byPos[p.position]) byPos[p.position].push(p); });

  // Common ranks for FPTS/PPG
  ['fpts','ppg'].forEach(stat => {
    Object.values(byPos).forEach(list => {
      // Home PPG ranks share the recorded-game minimum used by its leader charts.
      const eligible = list.filter(p => Number.isFinite(p.stats[stat]) && p.stats[stat] > 0 && (stat !== 'ppg' || p.games >= 3))
        .sort((a,b) => b.stats[stat] - a.stats[stat]);
      eligible.forEach((p, idx) => {
        if (stat === 'fpts') p.ranks.posRank = idx + 1;
        else p.ranks.ppgPosRank = idx + 1;
      });
    });
  });

  const EFF_THRESH = 40; // 40% snap share
  const statConfig = {
    QB: [ ['pass_rtg', false], ['cmp_pct', false], ['epa_db', false], ['ttt', true], ['yds_total', false], ['cpoe', false], ['cl', false], ['csty', false] ],
    RB: [ ['yds_total', false], ['snp_pct', false], ['ypc', false], ['rec_tgt', false], ['mtf_per_att', false], ['yco_per_att', false], ['cl', false], ['csty', false] ],
    WR: [ ['rec', false], ['rec_ypg', false], ['ts_per_rr', false], ['yprr', false], ['first_down_rec_rate', false], ['imp_per_g', false], ['cl', false], ['csty', false] ],
    TE: [ ['rec', false], ['rec_ypg', false], ['ts_per_rr', false], ['yprr', false], ['first_down_rec_rate', false], ['imp_per_g', false], ['cl', false], ['csty', false] ]
  };

  Object.entries(statConfig).forEach(([pos, stats]) => {
    const list = byPos[pos] || [];
    stats.forEach(([key, invert]) => {
      const eligible = list.filter(p => {
        const v = p.stats[key];
        if (!Number.isFinite(v)) return false;
        if ((pos === 'RB' || pos === 'WR' || pos === 'TE') && (!Number.isFinite(p.stats.snp_pct) || p.stats.snp_pct < EFF_THRESH)) return false;
        return true;
      });
      eligible.sort((a,b) => invert ? a.stats[key] - b.stats[key] : b.stats[key] - a.stats[key]);
      eligible.forEach((p, idx) => {
        p.statRanks[key] = idx + 1;
      });
    });
  });
}

// Build radar dataset using provided ranks; fill scales to rank (1 = 100%)
function buildRadarDataset(player) {
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return [];
  return cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    let rank = null;
    if (statKey === 'fpts') rank = player.ranks?.posRank;
    else if (statKey === 'ppg') rank = player.ranks?.ppgPosRank;
    else rank = player.statRanks?.[statKey] ?? null;
    const maxRank = cfg.maxRank;
    const fill = Number.isFinite(rank)
      ? clamp(((maxRank - rank + 1) / maxRank) * 100, 0, 100)
      : 8;
    return { axis: label, value: fill, rawValue: player.stats?.[statKey], rank };
  });
}

// Charts data builders
function ppgBarData(filter) {
  // Mobile: top 5 leaders to save space; Desktop: top 8
  const count = window.innerWidth < 768 ? 5 : 8;
  return [...players]
    .filter(p => p.games >= 3 && Number.isFinite(p.stats?.ppg) && p.stats.ppg > 0)
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, count)
    .map(p => ({ label: p.name, value: p.stats.ppg }));
}

// Rendering
function renderSummary() {
  if (!players.length) return;
  // Each summary leader must qualify for DataHub's default positional ranks;
  // a high metric or inclusion in the top-100 picker does not bypass that gate.
  const { topFpts, topEPAQB, topCstyRB, topTSWR } = dashboardData.selectSummaryLeaders(players);

  const projectedMax = Math.max(450, topFpts?.stats.fpts || 0);

  if (topFpts) {
    setText('total-points-value', topFpts.stats.fpts.toFixed(1));
    setText('total-points-name', topFpts.name);
    setWidth('total-points-bar', (topFpts.stats.fpts / projectedMax) * 100);
  }
  if (topCstyRB) {
    setText('consistency-value', `${topCstyRB.stats.csty.toFixed(1)}%`);
    setText('consistency-name', topCstyRB.name);
    setWidth('consistency-bar', topCstyRB.stats.csty);
  } else {
    setText('consistency-value', '—');
    setText('consistency-name', 'No qualified RB at 100%');
    setWidth('consistency-bar', 0);
  }
  if (topEPAQB) {
    const epa = topEPAQB.stats.epa_db;
    setText('ppg-value', `${epa > 0 ? '+' : ''}${epa.toFixed(2)}`);
    setText('ppg-name', topEPAQB.name);
  }
  if (topTSWR) {
    setText('share-value', `${topTSWR.stats.ts.toFixed(1)}%`);
    setText('share-name', topTSWR.name);
  }
}

function renderCustomSelect() {
  const optionsContainer = document.getElementById('player-select-options');
  const label = document.getElementById('player-select-label');
  if (!optionsContainer) return;
  const optionsList = players.slice(0, 100);
  optionsContainer.innerHTML = optionsList
    // Performance Map selector options are rendered in descending FPTS order,
    // so the rank column is a simple 1..100 index tied to this existing order.
    .map((p, index) => {
      const posClass = `fc-option-pos fc-option-pos-${p.position.toLowerCase()}`;
      const rank = index + 1;
      return `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span class="fc-option-rank">${rank}</span>
        <span class="fc-option-name">${p.name}</span>
        <span class="fc-option-team"><span class="${posClass}">${p.position}</span> • ${p.team}</span>
      </li>
    `;
    })
    .join('');
  const selected = getSelected();
  if (label && selected) label.textContent = selected.name;
}

function setupCustomSelect() {
  const container = document.getElementById('player-select-container');
  const trigger = document.getElementById('player-select-trigger');
  const dropdown = document.getElementById('player-select-dropdown');
  const searchInput = document.getElementById('player-select-search');
  const optionsContainer = document.getElementById('player-select-options');
  if (!container || !trigger || !dropdown || !searchInput || !optionsContainer) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.toggle('is-open');
    trigger.classList.toggle('is-open');
    if (container.classList.contains('is-open')) {
      searchInput.value = '';
      searchInput.focus();
      // Performance Map custom select options use a 3-column grid (rank, name, team),
      // so re-show rows as grid to preserve left-aligned name layout.
      optionsContainer.querySelectorAll('.fc-option').forEach(opt => opt.style.display = 'grid');
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeDropdown();
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    optionsContainer.querySelectorAll('.fc-option').forEach(opt => {
      // Keep visible matches in grid mode so column alignment remains consistent.
      opt.style.display = opt.textContent.toLowerCase().includes(term) ? 'grid' : 'none';
    });
  });

  optionsContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.fc-option');
    if (!option) return;
    dashState.selectedPlayerId = option.dataset.value;
    renderCustomSelect();
    renderSelectedDetails();
    renderRadar();
    closeDropdown();
  });

  function closeDropdown() {
    container.classList.remove('is-open');
    trigger.classList.remove('is-open');
  }
}

function renderSelectedDetails() {
  const player = getSelected();
  const posRank = player.ranks?.posRank;
  const { num, suffix } = ordinalParts(posRank);
  setText('rating-label-top', 'FPTS');
  setHTML('rating-value', `${num}<span class="fc-radar-suffix">${suffix}</span>`);
  setText('rating-meta', 'POS•RK');
}

function renderRadar() {
  const player = getSelected();
  const data = buildRadarDataset(player);
  setRadarPalette(player.position);
  updateLegendForPosition(player.position);
  drawRadarChart('radar-chart', data);
}

function renderBar() {
  const data = ppgBarData(dashState.filter);
  if (!data.length) return;
  drawBarChart('bar-chart', data);
}

// Update legend labels to match selected position's radar rings
function updateLegendForPosition(pos) {
  const cfg = RADAR_STATS_CONFIG[pos];
  if (!cfg) return;
  const labels = cfg.labels;
  const legendItems = document.querySelectorAll('.fc-legend .fc-legend-item');
  legendItems.forEach((item, idx) => {
    const full = item.querySelector('.fc-legend-full');
    const abbr = item.querySelector('.fc-legend-abbr');
    const label = labels[idx] || '';
    if (full) full.textContent = label;
    if (abbr) abbr.textContent = label;
  });
}

function renderScatter() {
  scatterAll = dashboardData.selectScatterPlayers(players);
  return applyScatterFilter(dashState.scatterFilter);
}

function applyScatterFilter(pos) {
  const selected = pos && pos !== 'ALL' ? pos : 'ALL';
  dashState.scatterFilter = selected;
  const filtered = selected === 'ALL' ? scatterAll : scatterAll.filter(p => p.position === selected);
  const ready = drawScatterChart('scatter-chart', filtered);
  updateScatterLegend(selected);
  return ready;
}

// Event wiring
function wireEvents() {
  const filterBtns = document.getElementById('filter-buttons');
  if (filterBtns) {
    filterBtns.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const filter = btn.dataset.filter;
      if (!filter) return;
      dashState.filter = filter;
      updateFilterButtons();
      renderBar();
    });
  }

  // Radar Center Click
  const radarCenter = document.querySelector('.fc-radar-center');
  if (radarCenter) {
    radarCenter.addEventListener('click', openRadarModal);
  }

  // Modal Events
  const modal = document.getElementById('radar-modal');
  const closeBtn = modal?.querySelector('.fc-modal-close');
  const overlay = modal?.querySelector('.fc-modal-overlay');

  if (closeBtn) closeBtn.addEventListener('click', closeRadarModal);
  if (overlay) overlay.addEventListener('click', closeRadarModal);
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-visible')) {
      closeRadarModal();
    }
  });

  window.addEventListener('resize', debounce(() => {
    renderRadar();
    renderBar();
    renderScatter();
  }, 200));

  wireScatterLegend();
}

function wireScatterLegend() {
  const legend = document.querySelector('.fc-scatter-legend');
  if (!legend) return;
  legend.addEventListener('click', e => {
    const item = e.target.closest('.fc-legend-item');
    if (!item || !legend.contains(item)) return;
    const pos = item.dataset.pos;
    if (!pos) return;
    const next = dashState.scatterFilter === pos ? 'ALL' : pos;
    applyScatterFilter(next);
  });
}

function updateScatterLegend(activePos) {
  const legend = document.querySelector('.fc-scatter-legend');
  if (!legend) return;
  legend.classList.toggle('has-filter', activePos !== 'ALL');
  legend.querySelectorAll('.fc-legend-item').forEach(item => {
    const pos = item.dataset.pos;
    const isActive = activePos !== 'ALL' && pos === activePos;
    item.classList.toggle('is-active', isActive);
  });
}

function openRadarModal() {
  const player = getSelected();
  if (!player) return;

  const modal = document.getElementById('radar-modal');
  const title = document.getElementById('radar-modal-title');
  const body = document.getElementById('radar-modal-body');
  
  if (!modal || !title || !body) return;

  // Center modal horizontally over the radar chart
  const radarPanel = document.querySelector('.fc-radar-panel');
  if (radarPanel) {
    const rect = radarPanel.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    // Calculate center of radar panel (page-relative)
    const centerX = rect.left + scrollX + (rect.width / 2);
    modal.style.left = centerX + 'px';
  }

  title.innerHTML = `
    <div class="fc-modal-title-row">
      <span class="fc-modal-player-name">${player.name}</span>
      <div class="fc-modal-pos-tag ${player.position}">${player.position}</div>
    </div>
  `;
  
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return;

  // Ring colors matching the radial bar graph
  const ringColors = activeRadarColors;

  // Number formatting config per stat key
  const formatConfig = {
    // General stats
    fpts: { decimals: 1, percent: false },
    ppg: { decimals: 1, percent: false },
    csty: { decimals: 1, percent: true },
    cl: { decimals: 1, percent: false },
    ts: { decimals: 1, percent: true },
    epa_db: { decimals: 2, percent: false },
    cpoe: { decimals: 1, percent: true },
    pa_ypg: { decimals: 1, percent: false },
    pass_rtg: { decimals: 1, percent: false },
    cmp_pct: { decimals: 1, percent: true },
    ttt: { decimals: 2, percent: false },
    yds_total: { decimals: 0, percent: false },
    imp_per_g: { decimals: 1, percent: false },
    snp_pct: { decimals: 1, percent: true },
    ypc: { decimals: 2, percent: false },
    rec_tgt: { decimals: 0, percent: false },
    rec: { decimals: 0, percent: false },
    mtf_per_att: { decimals: 3, percent: false },
    yco_per_att: { decimals: 2, percent: false },
    rec_ypg: { decimals: 1, percent: false },
    yprr: { decimals: 2, percent: false },
    first_down_rec_rate: { decimals: 3, percent: false },
    ts_per_rr: { decimals: 1, percent: true }
  };

  const statsHtml = cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    let val = player.stats[statKey];
    let rank = null;
    
    // Determine rank based on stat key logic from buildRadarDataset
    if (statKey === 'fpts') rank = player.ranks?.posRank;
    else if (statKey === 'ppg') rank = player.ranks?.ppgPosRank;
    else rank = player.statRanks?.[statKey];

    // Format value based on config
    let displayVal = 'NA';
    if (Number.isFinite(val)) {
      const fmt = formatConfig[statKey] || { decimals: 1, percent: false };
      if (fmt.percent) {
        displayVal = val.toFixed(fmt.decimals) + '%';
      } else {
        displayVal = val.toFixed(fmt.decimals);
      }
      if ((statKey === 'epa_db' || statKey === 'cpoe') && val > 0) {
        displayVal = `+${displayVal}`;
      }
    }

    const rankTxt = Number.isFinite(rank) ? ordinal(rank) : '-';
    const rColor = getRadarRankColor(rank);
    const dotColor = ringColors[idx % ringColors.length];

    return `
      <div class="fc-stat-row">
        <span class="fc-stat-label"><span class="fc-stat-dot" style="background-color: ${dotColor};"></span>${label}</span>
        <div class="fc-stat-values">
          <span class="fc-stat-val" style="color: ${rColor};">${displayVal}</span>
          <span class="fc-stat-rank" style="color: ${rColor}; border: 1px solid ${rColor}40;">${rankTxt}</span>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = statsHtml;
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
}

function closeRadarModal() {
  const modal = document.getElementById('radar-modal');
  if (modal) {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function updateFilterButtons() {
  // Dashboard PPG leaders filter rail:
  // - targets the bar-chart position pills only,
  // - keeps the seeded "All" default and the live filter selection in sync,
  // - and mirrors the active state into aria-pressed for the dashboard-only glass buttons.
  document.querySelectorAll('#filter-buttons button').forEach(btn => {
    const active = btn.dataset.filter === dashState.filter;
    btn.classList.toggle('active', active);
    btn.classList.toggle('fc-filter-btn--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

// Small utilities
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}
function setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${clamp(pct, 0, 100)}%`;
}
function debounce(fn, delay = 150) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
function trendSvg(trend) {
  if (trend === 'up') return '<span style="color: var(--color-emerald-light); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span>';
  if (trend === 'down') return '<span style="color: var(--color-red); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></span>';
  return '<span style="color: var(--text-muted); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path></svg></span>';
}

// D3 radar, bar, scatter (unchanged visuals)
function drawRadarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 360;
  const height = rect.height || 360;
  const size = Math.min(width, height);
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', `translate(${width / 2},${height / 2})`);
  const numRings = data.length;
  const maxRadius = size / 2 * 0.95;
  const innerRadius = size * 0.12;
  const ringWidth = (maxRadius - innerRadius) / numRings;
  const gap = size * (window.innerWidth < 768 ? 0.009 : 0.005);
  const palette = activeRadarPalette;
  const colors = activeRadarColors;
  const fontSize = Math.max(8, size * 0.025);
  const isMobile = window.innerWidth < 768;
  const strokeWidth = Math.max(1, ringWidth * 0.08);
  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];
    const bgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(2 * Math.PI).cornerRadius(ringWidth / 2);
    svg.append('path')
      .attr('d', bgArc)
      .attr('fill', color)
      .attr('opacity', 0.12);
    const maxFill = 0.97;
    const endAngle = (d.value / 100) * 2 * Math.PI * maxFill;
    const fgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(endAngle).cornerRadius(ringWidth / 2);
    svg.append('path')
      .attr('fill', color)
      .attr('fill-opacity', 0.95)
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-opacity', 0.6)
      .attr('d', fgArc)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attrTween('d', function() {
        const interpolate = d3.interpolate(0, endAngle);
        return function(t) {
          return d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(interpolate(t)).cornerRadius(ringWidth / 2)();
        };
      });
    if (!isMobile) {
      svg.append('text')
        .attr('x', 5)
        .attr('y', -(rInner + (ringWidth - gap) / 2))
        .attr('dy', '0.35em')
        .text(d.axis.substring(0, 3).toUpperCase())
        .attr('fill', '#fff')
        .attr('font-size', `${fontSize}px`)
        .attr('font-weight', 'bold')
        .attr('opacity', 0.8)
        .style('pointer-events', 'none');
    }
  });
}

function drawBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;
  // PPG Leaders bar chart palette:
  // Mobile (5 bars): original neon gradient stops — untouched
  // Desktop (8 bars): use the QB radial ring colors (QB_CUSTOM_RING_MIDS) so each bar
  //   matches the corresponding ring color from the QB Performance Map radar chart.
  //   Each mid color is used for the stroke/label; fill gradient uses the same
  //   start/end derivation as buildPaletteFromMids (mixHex white 35% / black 28%).
  const barPaletteMobile = ['#13dcff', '#2077ed', '#4d39fc', '#701fe3', '#a633f7'];
  // QB ring mid colors (outer → inner, reversed from QB_CUSTOM_RING_MIDS) — cyan end first
  // (trailing 'ff' alpha stripped to 6-char hex so mixHex parses correctly)
  const barPaletteDesktopMids = ['#00DDFA', '#00a9f1', '#4D79FF', '#7866FF', '#a74eff', '#d747ff', '#fe26f7', '#ff0aa5'];
  // Build per-bar gradient stop objects the same way buildPaletteFromMids does,
  // so the fill gradient mirrors the radar ring gradient appearance
  const barPaletteDesktop = barPaletteDesktopMids.map(mid => ({
    mid,
    start: mixHex(mid, '#FFFFFF', 0.35), // 35% lighter — tops of bars
    end: mixHex(mid, '#000000', 0.28)    // 28% darker  — bottoms of bars
  }));
  const barPalette = isMobile ? barPaletteMobile : barPaletteDesktopMids;
  // Reduced top margin to move bars up, increased bottom for angled labels on mobile
  const margin = { top: height * 0.06, right: width * 0.03, bottom: isMobile ? height * 0.15 : height * 0.10, left: width * 0.03 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'scatter-svg');
  const defs = svg.append('defs');
  const filter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  filter.append('feGaussianBlur').attr('stdDeviation', '1.5').attr('result', 'coloredBlur'); // Reduced from 3 — tighter, less diffuse glow on bar outlines
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  // Mobile: tighter bar gap to fit narrower panel; Desktop: original spacing
  const x = d3.scaleBand().range([0, innerWidth]).domain(data.map(d => d.label)).paddingInner(isMobile ? 0.5 : 0.6).paddingOuter(0.05);
  const maxValue = d3.max(data, d => d.value) || 0;
  // Reduced headroom above bars (1.02 instead of 1.05)
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, maxValue * 1.02]);
  const colorScale = d3.scaleOrdinal()
    .domain(data.map((_, i) => i))
    .range(barPalette);
  const uid = Date.now();
  data.forEach((d, i) => {
    const gradId = `bar-grad-${uid}-${i}`;
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    if (isMobile) {
      // Mobile: original flat-color gradient (unchanged)
      const color = barPalette[i % barPalette.length];
      grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.44);
      grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.07);
      grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.015);
    } else {
      // Desktop: use TE ring gradient stops (start → mid → end) matching radar ring appearance
      const { start, mid, end } = barPaletteDesktop[i % barPaletteDesktop.length];
      grad.append('stop').attr('offset', '0%').attr('stop-color', start).attr('stop-opacity', 0.52);
      grad.append('stop').attr('offset', '55%').attr('stop-color', mid).attr('stop-opacity', 0.18);
      grad.append('stop').attr('offset', '100%').attr('stop-color', end).attr('stop-opacity', 0.06);
    }
  });
  const barGroups = g.selectAll('.bar-group').data(data).enter().append('g').attr('class', 'bar-group');
  const barWidth = x.bandwidth();
  const radius = barWidth / 2;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  // Font sizes — mobile: slightly larger data labels & player names
  const fontSizeVal = isMobile ? Math.max(8.5, width * 0.022) : Math.max(14, width * 0.024);
  const fontSizeAxis = isMobile ? Math.max(7, width * 0.021) : Math.max(11, width * 0.02);
  
  // Helper to format player name: First initial + truncated last name (max 9 chars)
  function formatBarLabel(fullName) {
    const parts = fullName.split(' ');
    const firstInitial = parts[0]?.[0] ? `${parts[0][0]}.` : '';
    let lastName = parts.slice(1).join(' ');
    // Truncate last name to 9 characters max (including hyphens/spaces)
    if (lastName.length > 9) {
      lastName = lastName.substring(0, 9);
    }
    return `${firstInitial} ${lastName}`.trim();
  }
  
  // Outer glow rect
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeGlow).attr('stroke-opacity', 0.18).style('filter', 'url(#neon-glow)') // opacity reduced from 0.3 for tighter outline.transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  // Gradient fill rect
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', (d, i) => `url(#bar-grad-${uid}-${i})`).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  // Main stroke rect
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeMain).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  
  // Data labels ABOVE the bars (original position)
  barGroups.append('text').text(d => d.value.toFixed(1)).attr('x', d => x(d.label) + barWidth / 2).attr('y', innerHeight).attr('text-anchor', 'middle').attr('fill', (d, i) => colorScale(i)).attr('font-size', `${fontSizeVal}px`).attr('font-weight', '700').style('text-shadow', '0 0 10px rgba(0,0,0,1)').style('opacity', 0).transition().duration(1000).delay((d, i) => i * 50 + 400).attr('y', d => y(d.value) - (isMobile ? height * 0.02 : height * 0.02)).style('opacity', 1);
  
  // X-axis with formatted names at bottom
  const xAxis = g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSize(0).tickFormat((d, i) => formatBarLabel(d)));
  xAxis.selectAll('text')
    .style('text-anchor', isMobile ? 'end' : 'middle')
    .style('fill', (d, i) => colorScale(i))
    .style('font-size', `${fontSizeAxis}px`)
    .style('font-weight', '600')
    .attr('dx', isMobile ? '1.1em' : '0')
    .attr('dy', isMobile ? '1.1em' : '1.5em')
    .attr('transform', isMobile ? 'rotate(-45)' : 'rotate(0)');
  g.select('.domain').remove();
}

function drawScatterChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  // Dashboard position changes and resizes replace one tooltip/listener together.
  scatterTooltipCleanup?.();
  container.innerHTML = '';
  if (!data?.length) {
    container.textContent = 'No recorded consistency and ceiling data available.';
    return;
  }
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth <= 768;
  // Dashboard scatter sizing follows its page-local CSS at each breakpoint.
  const margin = {
    top: isMobile ? 10 : height * 0.02,
    // Home scatter: reduce the outer right gutter together with the 102% domain.
    right: width * 0.01,
    bottom: isMobile ? 30 : height * 0.085,
    left: isMobile ? 30 : width * 0.055
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  
  // Add SVG filter definitions for iOS-compatible glow effects
  const defs = svg.append('defs');
  const glowColors = {
    qb: { color: '#ec4899', id: 'glow-qb' },
    rb: { color: '#10b981', id: 'glow-rb' },
    wr: { color: '#06b6d4', id: 'glow-wr' },
    te: { color: '#f97316', id: 'glow-te' }
  };
  Object.values(glowColors).forEach(({ color, id }) => {
    const filter = defs.append('filter')
      .attr('id', id)
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    filter.append('feDropShadow')
      .attr('dx', 0).attr('dy', 0)
      .attr('stdDeviation', 3)
      .attr('flood-color', color)
      .attr('flood-opacity', 0.8);
  });
  
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'scatter-tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
  // Fit the complete top-eight pool and keep those same axes under position
  // filters. Bounds are already rounded; .nice() would move 40%/15 back to 30%/10.
  const bounds = dashboardData.getScatterBounds(scatterAll);
  const x = d3.scaleLinear().domain(bounds.x).range([0, innerWidth]);
  const y = d3.scaleLinear().domain(bounds.y).range([innerHeight, 0]);
  const xDomain = x.domain();
  const xTicks = x.ticks(6).filter(value => value >= 0 && value <= 100);
  if (xDomain[0] <= 100 && xDomain[1] >= 100 && !xTicks.includes(100)) xTicks.push(100);
  const yTicks = y.ticks(5);
  const yAxisGrid = d3.axisLeft(y).tickValues(yTicks).tickSize(-innerWidth).tickFormat('');
  g.append('g')
  .attr('class', 'scatter-grid')
  .call(yAxisGrid);

  const xAxis = d3.axisBottom(x)
    .tickValues(xTicks)
    .tickFormat(d => `${d}%`)
    .tickSize(0)
    .tickPadding(isMobile ? 6 : 8);
  const yAxis = d3.axisLeft(y)
    .tickValues(yTicks)
    .tickSize(0)
    .tickPadding(isMobile ? 6 : 8);

  const xAxisText = g.append('g')
    .attr('class', 'scatter-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  xAxisText.filter(d => d === 100)
    .attr('dx', isMobile ? '0.35em' : '0.3em');

  g.append('g')
    .attr('class', 'scatter-axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  const xLabelOffset = isMobile ? margin.bottom - 4 : margin.bottom - 1; // mobile: pull title up slightly; desktop unchanged
  const yLabelOffset = isMobile ? -(margin.left - 6) : -(margin.left - 14);

  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + xLabelOffset)
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px')
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CONSISTENCY % (CSTY %)');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', yLabelOffset)
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px')
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CEILING (CL)');
  
  // Desktop dots are intentionally a bit larger for readability.
  const dotRadius = isMobile ? 4.8 : 7.6;
  // Minimum distance between dot centers to avoid overlap (slightly stronger than before)
  const minDistance = dotRadius * 3;
  
  // Get initial positions for all dots
  const dotPositions = data.map((d, i) => ({
    index: i,
    cx: x(clamp(d.stats.csty, xDomain[0], xDomain[1])),
    cy: y(d.stats.ceiling),
    originalX: x(clamp(d.stats.csty, xDomain[0], xDomain[1])),
    originalY: y(d.stats.ceiling)
  }));
  
  // Collision detection and resolution - run multiple passes to separate overlapping dots
  const maxIterations = 25;
  for (let iter = 0; iter < maxIterations; iter++) {
    let moved = false;
    for (let i = 0; i < dotPositions.length; i++) {
      for (let j = i + 1; j < dotPositions.length; j++) {
        const dx = dotPositions[j].cx - dotPositions[i].cx;
        const dy = dotPositions[j].cy - dotPositions[i].cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance && distance > 0) {
          // Dots are overlapping - push them apart
          const overlap = minDistance - distance;
          const pushX = (dx / distance) * (overlap / 2);
          const pushY = (dy / distance) * (overlap / 2);
          
          dotPositions[i].cx -= pushX;
          dotPositions[i].cy -= pushY;
          dotPositions[j].cx += pushX;
          dotPositions[j].cy += pushY;
          moved = true;
        } else if (distance === 0) {
          // Exact same position - offset in a random direction
          const angle = ((i * 37 + j * 17) % 360) * (Math.PI / 180);
          dotPositions[i].cx -= Math.cos(angle) * (minDistance / 2);
          dotPositions[i].cy -= Math.sin(angle) * (minDistance / 2);
          dotPositions[j].cx += Math.cos(angle) * (minDistance / 2);
          dotPositions[j].cy += Math.sin(angle) * (minDistance / 2);
          moved = true;
        }

        // Keep dots within the plot bounds so collision resolution doesn't push them off-chart
        dotPositions[i].cx = clamp(dotPositions[i].cx, 0, innerWidth);
        dotPositions[i].cy = clamp(dotPositions[i].cy, 0, innerHeight);
        dotPositions[j].cx = clamp(dotPositions[j].cx, 0, innerWidth);
        dotPositions[j].cy = clamp(dotPositions[j].cy, 0, innerHeight);
      }
    }
    if (!moved) break; // No more overlaps
  }
  
  const circles = g.selectAll('.scatter-dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`)
    .attr('filter', d => `url(#glow-${d.position.toLowerCase()})`)
    .attr('cx', (d, i) => dotPositions[i].cx)
    .attr('cy', (d, i) => dotPositions[i].cy)
    .attr('r', 0)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 30)
    .ease(d3.easeBackOut)
    .attr('r', dotRadius)
    .selection();

  let activeTooltipId = null;

  function showTooltip(event, d) {
    // The dashboard tooltip is fixed to the viewport, including when the taller
    // chart is scrolled into view on a phone; use matching client coordinates.
    const clientX = (event.touches ? event.touches[0].clientX : event.clientX);
    const clientY = (event.touches ? event.touches[0].clientY : event.clientY);
    const clRank = d.statRanks?.cl;
    const cstyRank = d.statRanks?.csty;
    const clRankTxt = Number.isFinite(clRank) ? ordinal(clRank) : 'NA';
    const cstyRankTxt = Number.isFinite(cstyRank) ? ordinal(cstyRank) : 'NA';
    const clColor = rankColor(clRank);
    const cstyColor = rankColor(cstyRank);
    tooltip.innerHTML = `
      <div><strong>${d.name}</strong> • ${d.position}</div>
      <div><strong class="scatter-tooltip-label">CL:</strong> <span style="color:${clColor}">${formatNum1(d.stats.ceiling)}</span> &middot; | &middot; <span style="color:${clColor}">${clRankTxt} (${d.position})</span></div>
      <div><strong class="scatter-tooltip-label">CSTY%:</strong> <span style="color:${cstyColor}">${formatPct1(d.stats.csty)}</span> &middot; | &middot; <span style="color:${cstyColor}">${cstyRankTxt} (${d.position})</span></div>
    `;
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.style.display = 'block';
    const ttWidth = tooltip.offsetWidth || 180;
    const ttHeight = tooltip.offsetHeight || 80;
    let left = clientX + 12;
    if (left + ttWidth > window.innerWidth - 8) {
      left = clientX - ttWidth - 12;
      if (left < 8) left = 8;
    }
    let top = clientY - ttHeight - 12;
    if (top < 8) top = clientY + 12;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.display = 'block';
    activeTooltipId = d.id;
  }
  function hideTooltip() { tooltip.style.display = 'none'; activeTooltipId = null; }

  circles.on('mouseenter', function(event,d){ if (!isMobile) showTooltip(event,d); })
         .on('mousemove', function(event,d){ if (!isMobile) showTooltip(event,d); })
         .on('mouseleave', function(){ if (!isMobile) hideTooltip(); })
         .on('click touchstart', function(event,d){
            if (!isMobile) return;
            event.preventDefault();
            // always show on tap; if same dot tapped again, toggle off
            if (activeTooltipId === d.id) {
              hideTooltip();
              return;
            }
            hideTooltip();
            showTooltip(event,d);
          });

  const dismissTooltip = (e) => {
      const target = e.target;
      const isDot = target.closest && target.closest('.scatter-dot');
      const isTooltip = target.closest && target.closest('.scatter-tooltip');
      if (!isDot && !isTooltip) hideTooltip();
  };
  if (isMobile) document.addEventListener('touchstart', dismissTooltip, { passive: true });
  scatterTooltipCleanup = () => {
    tooltip.remove();
    document.removeEventListener('touchstart', dismissTooltip);
  };
  // Home scatter names stay beside their points. Small, opposite bumps check
  // neighboring free space too, within the same 4px mobile / 6px desktop caps.
  const labelDx = isMobile ? -2 : 3;
  const labelDy = isMobile ? 2 : 1;
  const labels = g.selectAll('.scatter-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'scatter-label')
    // Labels near the right edge grow leftward so 100% players remain readable.
    .attr('text-anchor', (d, i) => dotPositions[i].cx > innerWidth * 0.8 ? 'end' : 'start')
    .attr('x', (d, i) => dotPositions[i].cx + (dotPositions[i].cx > innerWidth * 0.8 ? -Math.abs(labelDx) : labelDx))
    .attr('y', (d, i) => dotPositions[i].cy + labelDy)
    .text(d => dashboardLayout.formatScatterName(d.name))
    .attr('opacity', 0);

  const textBoxes = labels.nodes().map(node => {
    const box = node.getBBox();
    const anchor = node.getAttribute('text-anchor');
    const alternateX = anchor === 'start' ? box.x - box.width : box.x + box.width;
    return { x: box.x, y: box.y, width: box.width, height: box.height,
      anchor, alternateX: alternateX >= 0 && alternateX + box.width <= innerWidth ? alternateX : undefined,
      baseline: Number(node.getAttribute('y')) };
  });
  const labelLayout = dashboardLayout.arrangeScatterLabels(textBoxes, innerHeight, 1, isMobile ? 4 : 6);
  // Keep the text attached to the same point when its usual side is blocked;
  // offer the open side before pushing either name into another neighbor.
  labels.attr('text-anchor', (d, i) => labelLayout[i].x === textBoxes[i].x ? textBoxes[i].anchor
    : textBoxes[i].anchor === 'start' ? 'end' : 'start')
    .attr('y', (d, i) => textBoxes[i].baseline + labelLayout[i].top - textBoxes[i].y);

  if (isMobile) {
    labels.on('click touchstart', function(event,d){
      if (activeTooltipId === d.id) {
        hideTooltip();
        return;
      }
      hideTooltip();
      showTooltip(event,d);
    });
  }
  return labels.transition()
    .duration(900)
    .delay((d, i) => i * 25 + 450)
    .attr('opacity', 1).end().catch(() => {});
}

// Dashboard header branding: keep the home-page logo visible when the app is opened
// from a sister app or restored from a mobile webview/pageshow state. The helper
// validates the header logo image and re-requests it once if the first paint stalls.
function stabilizeDashboardBrandLogo() {
  const brandLogo = document.getElementById('dashboardBrandLogo');
  if (!(brandLogo instanceof HTMLImageElement)) return;

  // Dashboard header branding: resolve the retry URL from the same app-relative path
  // used in the markup so the logo still loads when this app is served from a subfolder.
  const configuredLogoPath = brandLogo.dataset.logoSrc || brandLogo.getAttribute('src') || 'assets/welcome/welcome-logo-256.png';
  const baseLogoUrl = new URL(configuredLogoPath, document.baseURI).href;
  let recoveryAttempted = false;

  const markLogoReady = () => {
    if (brandLogo.naturalWidth > 0) {
      brandLogo.removeAttribute('data-logo-recovering');
    }
  };

  const recoverBrandLogo = () => {
    if (recoveryAttempted || brandLogo.naturalWidth > 0) return;
    recoveryAttempted = true;
    brandLogo.setAttribute('data-logo-recovering', 'true');
    brandLogo.src = `${baseLogoUrl}?v=${Date.now()}`;
  };

  const validateBrandLogo = () => {
    if (brandLogo.complete && brandLogo.naturalWidth > 0) {
      markLogoReady();
      return;
    }
    window.setTimeout(() => {
      if (brandLogo.complete && brandLogo.naturalWidth > 0) {
        markLogoReady();
        return;
      }
      recoverBrandLogo();
    }, 180);
  };

  brandLogo.loading = 'eager';
  brandLogo.decoding = 'async';
  try {
    brandLogo.fetchPriority = 'high';
  } catch (e) {
    // Ignore browsers that do not expose fetchPriority as a writable property.
  }

  if (!brandLogo.getAttribute('src')) {
    brandLogo.src = baseLogoUrl;
  }

  brandLogo.addEventListener('load', markLogoReady);
  brandLogo.addEventListener('error', recoverBrandLogo);
  window.addEventListener('pageshow', validateBrandLogo);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      validateBrandLogo();
    }
  });

  if (typeof brandLogo.decode === 'function') {
    brandLogo.decode().then(markLogoReady).catch(() => {
      validateBrandLogo();
    });
  } else {
    validateBrandLogo();
  }
}

// Home menu: support external destinations (Trophy Room / Matchups) without impacting shared app.js navigation.
// This file loads before deferred `app.js`, so we can intercept clicks and stop the default handler for these items.
(() => {
  const homeMenu = document.getElementById('homeMenu');
  if (!homeMenu) return;

  const homeMenuToggle = document.getElementById('homeMenuToggle');
  const TROPHY_ROOM_HOST = 'trophyroom.dynastyhub.pro';
  const buildTrophyRoomUserUrl = (parsedUrl, username) => {
    // Dashboard Trophy Room menu: keep users on the new production subdomain and open their clean profile route.
    parsedUrl.pathname = `/user/${encodeURIComponent(username)}`;
    parsedUrl.search = '';
    parsedUrl.hash = '';
    return parsedUrl.toString();
  };
  const readStoredUsername = () => {
    const input = document.getElementById('usernameInput');
    const inputValue = typeof input?.value === 'string' ? input.value.trim() : '';
    if (inputValue) return inputValue;
    try {
      return (localStorage.getItem('sleeper_username') || '').trim();
    } catch (e) {
      return '';
    }
  };
  const buildExternalUrl = (rawUrl) => {
    if (typeof window.__dhBuildExternalUrl === 'function') {
      return window.__dhBuildExternalUrl(rawUrl);
    }
    if (!rawUrl) return rawUrl;
    let parsed;
    try {
      parsed = new URL(rawUrl, window.location.origin);
    } catch (e) {
      return rawUrl;
    }
    if (parsed.hostname !== TROPHY_ROOM_HOST) return rawUrl;
    const username = readStoredUsername();
    if (!username) return rawUrl;
    return buildTrophyRoomUserUrl(parsed, username);
  };
  const closeHomeMenu = () => {
    if (!homeMenu.classList.contains('hidden')) {
      homeMenu.classList.add('hidden');
    }
    homeMenu.setAttribute('aria-hidden', 'true');
    homeMenuToggle?.setAttribute('aria-expanded', 'false');
  };

  homeMenu.querySelectorAll('.home-menu-item[data-url]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const url = btn.dataset.url;
      if (!url) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      closeHomeMenu();

      const destination = buildExternalUrl(url);
      window.location.href = destination;
    });
  });
})();

// Home boot stages represent actual work, without a fabricated percentage or
// a minimum display timer. Release the page on either readiness or failure.
function setDashboardBootPhase(phase, message) {
  const boot = document.getElementById('dashboard-boot');
  if (!boot) return;
  boot.dataset.phase = String(phase);
  setText('dashboard-boot-status', message);
  boot.querySelectorAll('[data-boot-step]').forEach(step => {
    const index = Number(step.dataset.bootStep);
    step.dataset.state = index < phase ? 'complete' : index === phase ? 'current' : 'pending';
  });
}

async function dismissDashboardBoot() {
  const boot = document.getElementById('dashboard-boot');
  if (boot && !boot.hidden && typeof boot.animate === 'function') {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await boot.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: reducedMotion ? 0 : 360, easing: 'ease-out', fill: 'forwards'
    }).finished.catch(() => {});
  }
  if (boot) boot.hidden = true;
  document.body.removeAttribute('data-dashboard-loading');
  document.getElementById('content')?.removeAttribute('inert');
  document.getElementById('legalFootnote')?.removeAttribute('inert');
}

// Initialize the home dashboard once from its CSV; failures stay explicit and never
// fall back to the retired 2025 snapshot or another page's loaded stats/state.
window.initFantasyDashboard = function() {
  if (dashboardInitPromise) return dashboardInitPromise;
  dashboardInitPromise = initializeDashboard();
  return dashboardInitPromise;
};

async function initializeDashboard() {
  const status = document.getElementById('dashboard-data-status');
  document.getElementById('fc-dashboard-root')?.setAttribute('aria-busy', 'true');
  try {
    setDashboardBootPhase(0, 'Connecting to the 2026 season');
    [dashboardData, dashboardLayout] = await Promise.all([
      import('./dashboard-data.js?v=DH3.70-local-2026-season'),
      import('./dashboard-scatter-layout.js?v=DH3.61j-scatter-neighbor-clearance')
    ]);
    players = await dashboardData.loadDashboardPlayers();
    setDashboardBootPhase(1, 'Finding the league leaders');
    computePositionalRanks(players);
    dashState.selectedPlayerId = players[0].id;
    // Begin with unavailable values so absent source metrics never look like zero.
    ['total-points-value', 'ppg-value', 'consistency-value', 'share-value'].forEach(id => setText(id, '—'));
    ['total-points-name', 'ppg-name', 'consistency-name', 'share-name'].forEach(id => setText(id, 'Unavailable'));
    renderSummary();
    renderCustomSelect();
    setupCustomSelect();
    renderSelectedDetails();
    // Wait for the font metrics before measuring scatter names; the boot screen
    // stays visible while the real data and chart preparation are underway.
    if (document.fonts) await document.fonts.ready;
    setDashboardBootPhase(2, 'Bringing your dashboard into focus');
    renderRadar();
    renderBar();
    const scatterReady = renderScatter();
    updateFilterButtons();
    wireEvents();
    await scatterReady;
    setDashboardBootPhase(3, 'Dashboard ready');
    if (status) status.hidden = true;
  } catch (error) {
    console.error('Home dashboard season data could not load.', error);
    if (status) status.textContent = '2026 season stats are unavailable. Refresh to try again.';
    ['total-points-value', 'ppg-value', 'consistency-value', 'share-value'].forEach(id => setText(id, '—'));
    ['total-points-name', 'ppg-name', 'consistency-name', 'share-name'].forEach(id => setText(id, 'Unavailable'));
  } finally {
    document.getElementById('fc-dashboard-root')?.setAttribute('aria-busy', 'false');
    await dismissDashboardBoot();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  stabilizeDashboardBrandLogo();
  window.initFantasyDashboard();
});
})();
