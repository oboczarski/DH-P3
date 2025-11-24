(function() {
// === Dashboard Data Layer (sheet-first, no league context) ===

// Working set populated from Google Sheets (STAT_1QB / STAT_SFLX + season stats/ranks)
let players = [];

// Dashboard UI state
const dashState = {
  selectedPlayerId: null,
  filter: 'all',
  currentTab: 'oneQb', // mirrors stats page tabs; default 1QB
  rankCache: {},       // computed FPTS/PPG ranks (overall + positional) from sheets
  seasonStats: {},
  seasonRanks: {},
  ready: false
};

// Helpers
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const toNumber = (value, { allowFloat = true } = {}) => {
  if (value === null || value === undefined) return null;
  let source = value;
  if (typeof source === 'string') source = source.replace(/,/g, '');
  const numeric = allowFloat ? parseFloat(source) : parseInt(source, 10);
  return Number.isNaN(numeric) ? null : numeric;
};
const formatInitialLast = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstInitial = parts[0]?.[0] ? `${parts[0][0].toUpperCase()}.` : '';
  const last = parts.slice(1).join(' ');
  return `${firstInitial} ${last}`.trim();
};
const getSelected = () => players.find(p => p.id === dashState.selectedPlayerId) || players[0];

// --- Sheet-driven rank cache (FPTS/PPG overall + positional) ---
function buildRankCacheFromSeasonStats(seasonStats) {
  const entries = [];
  Object.entries(seasonStats || {}).forEach(([playerId, stats]) => {
    const fpts = toNumber(stats.fpts_ppr);
    const games = toNumber(stats.games_played, { allowFloat: false }) || 0;
    const pos = (stats.pos || '').toUpperCase();
    if (!Number.isFinite(fpts) || fpts <= 0 || !pos) return;
    const ppg = games > 0 ? fpts / games : null;
    entries.push({ playerId, fpts, games, ppg, pos });
  });

  const cache = {};
  // Overall ranks by FPTS
  entries.slice().sort((a, b) => b.fpts - a.fpts).forEach((entry, idx) => {
    cache[entry.playerId] = cache[entry.playerId] || {};
    cache[entry.playerId].overallRank = idx + 1;
    cache[entry.playerId].pos = entry.pos;
  });
  // Overall ranks by PPG (only players with games >0)
  entries
    .filter(e => Number.isFinite(e.ppg) && e.ppg > 0)
    .sort((a, b) => b.ppg - a.ppg)
    .forEach((entry, idx) => {
      cache[entry.playerId] = cache[entry.playerId] || {};
      cache[entry.playerId].ppgOverallRank = idx + 1;
    });

  // Positional ranks
  const grouped = entries.reduce((acc, e) => {
    acc[e.pos] = acc[e.pos] || [];
    acc[e.pos].push(e);
    return acc;
  }, {});

  Object.values(grouped).forEach(group => {
    group.slice().sort((a, b) => b.fpts - a.fpts).forEach((entry, idx) => {
      cache[entry.playerId] = cache[entry.playerId] || {};
      cache[entry.playerId].posRank = idx + 1;
    });
    group
      .filter(e => Number.isFinite(e.ppg) && e.ppg > 0)
      .sort((a, b) => b.ppg - a.ppg)
      .forEach((entry, idx) => {
        cache[entry.playerId] = cache[entry.playerId] || {};
        cache[entry.playerId].ppgPosRank = idx + 1;
      });
  });

  return cache;
}

// --- Sheet value helpers ---
function getPlayerName(playerId) {
  const meta = (typeof window !== 'undefined' ? window.state : dashState)?.players?.[playerId];
  if (meta) {
    const first = (meta.first_name || '').trim();
    const last = (meta.last_name || '').trim();
    const name = `${first} ${last}`.trim();
    return name || playerId;
  }
  return playerId;
}

function getPlayerTeam(playerId) {
  const meta = (typeof window !== 'undefined' ? window.state : dashState)?.players?.[playerId];
  return (meta?.team || 'FA').toUpperCase();
}

function safeValue(stats, key) {
  const v = stats?.[key];
  const num = toNumber(v);
  return Number.isFinite(num) ? num : null;
}

// Map stat keys used in radar / cards to season stat keys if different
const STAT_KEY_OVERRIDES = {
  fpts: 'fpts_ppr',
  ts_per_rr: 'ts_per_rr',
  csty_pct: 'csty_pct',
  ceiling: 'cl'
};

// --- Lightweight CSV parser & stat-sheet loader (mirrors stats page) ---
function parseCsv(text) {
  const lines = (text || '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };
  const parseLine = (line) => {
    const out = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; continue; }
        if (ch === '"') { inQ = false; continue; }
        cur += ch;
      } else {
        if (ch === '"') { inQ = true; continue; }
        if (ch === ',') { out.push(cur.trim()); cur = ''; continue; }
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  };
  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

const STAT_HEADER_ALIASES = new Map([
  ['PLAYER NAME', 'PLAYER'],
  ['POS RK', 'POS | RK'],
  ['POS·RK', 'POS | RK'],
  ['POS_RK', 'POS | RK'],
  ['FPTS_PPR', 'FPTS'],
  ['FPT_PPR', 'FPTS'],
  ['YDS(T)', 'YDS(t)'],
  ['YPG(T)', 'YPG(t)'],
  ['IMP/OPP', 'IMP/OPP']
]);

function normalizeStatHeaders(rawHeaders) {
  return rawHeaders.map(h => STAT_HEADER_ALIASES.get(h) || h);
}

async function fetchStatSheet(tabKey = 'oneQb') {
  const sheetId = typeof window !== 'undefined' ? window.PLAYER_STATS_SHEET_ID : null;
  if (!sheetId) return [];
  const sheetName = tabKey === 'sflx' ? 'STAT_SFLX' : 'STAT_1QB';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to fetch ${sheetName}`);
  const csvText = await res.text();
  const { headers, rows } = parseCsv(csvText);
  const normalizedHeaders = normalizeStatHeaders(headers);
  const data = [];
  rows.forEach(cols => {
    const row = {};
    normalizedHeaders.forEach((h, idx) => { row[h] = cols[idx]; });
    data.push(row);
  });
  return data;
}

function buildRankCacheFromStatRows(rows) {
  const entries = rows.map(r => {
    const playerId = (r.SLPR_ID || '').trim();
    const pos = (r.POS || '').trim().toUpperCase();
    const fpts = toNumber(r.FPTS);
    const ppg = toNumber(r.PPG);
    return { playerId, pos, fpts, ppg };
  }).filter(e => e.playerId && e.pos && Number.isFinite(e.fpts));

  const cache = {};
  const byFpts = entries.slice().sort((a, b) => (b.fpts || 0) - (a.fpts || 0));
  byFpts.forEach((e, idx) => {
    cache[e.playerId] = cache[e.playerId] || {};
    cache[e.playerId].overallRank = idx + 1;
  });
  const byPpg = entries.filter(e => Number.isFinite(e.ppg)).slice().sort((a, b) => (b.ppg || 0) - (a.ppg || 0));
  byPpg.forEach((e, idx) => {
    cache[e.playerId] = cache[e.playerId] || {};
    cache[e.playerId].ppgOverallRank = idx + 1;
  });
  const grouped = entries.reduce((acc, e) => {
    acc[e.pos] = acc[e.pos] || [];
    acc[e.pos].push(e);
    return acc;
  }, {});
  Object.values(grouped).forEach(group => {
    group.slice().sort((a, b) => (b.fpts || 0) - (a.fpts || 0)).forEach((e, idx) => {
      cache[e.playerId] = cache[e.playerId] || {};
      cache[e.playerId].posRank = idx + 1;
    });
    group.filter(e => Number.isFinite(e.ppg)).slice().sort((a, b) => (b.ppg || 0) - (a.ppg || 0)).forEach((e, idx) => {
      cache[e.playerId] = cache[e.playerId] || {};
      cache[e.playerId].ppgPosRank = idx + 1;
    });
  });
  return cache;
}

// --- Data loading ---
async function loadDashboardData() {
  // show global loading overlay if available
  const loading = document.getElementById('loading');
  loading?.classList.remove('hidden');
  try {
    // Ensure Sleeper players and sheet stats are loaded
    if (typeof fetchSleeperPlayers === 'function' && (!window.state?.players || Object.keys(window.state.players).length === 0)) {
      await fetchSleeperPlayers();
    }
    if (typeof fetchPlayerStatsSheets === 'function' && !window.state?.statsSheetsLoaded) {
      await fetchPlayerStatsSheets();
    }

    // Fetch STAT tab data (same source as stats page)
    const statRows = await fetchStatSheet(dashState.currentTab);
    const statRowById = new Map();
    statRows.forEach(r => {
      const id = (r.SLPR_ID || '').trim();
      if (id) statRowById.set(id, r);
    });
    dashState.rankCache = statRows.length ? buildRankCacheFromStatRows(statRows) : buildRankCacheFromSeasonStats(window.state?.playerSeasonStats || {});

    dashState.seasonStats = window.state?.playerSeasonStats || {};
    dashState.seasonRanks = window.state?.playerSeasonRanks || {};

    // Build player list from season stats (sheet only, no league data)
    const built = [];
    Object.entries(dashState.seasonStats).forEach(([playerId, stats]) => {
      const pos = (stats.pos || '').toUpperCase();
      const statRow = statRowById.get(playerId) || {};
      const rowPos = (statRow.POS || '').trim().toUpperCase();
      const usePos = ['QB','RB','WR','TE'].includes(rowPos) ? rowPos : pos;
      if (!['QB', 'RB', 'WR', 'TE'].includes(usePos)) return;

      // Prefer STAT sheet values for FPTS/PPG
      const fptsStat = toNumber(statRow.FPTS);
      const ppgStat = toNumber(statRow.PPG);
      const gamesStat = toNumber(statRow.G, { allowFloat: false });

      const fptsSeason = safeValue(stats, STAT_KEY_OVERRIDES.fpts);
      const gamesSeason = toNumber(stats.games_played, { allowFloat: false });

      const fpts = Number.isFinite(fptsStat) ? fptsStat : (fptsSeason || 0);
      const games = Number.isFinite(gamesStat) ? gamesStat : (gamesSeason || 0);
      const ppg = Number.isFinite(ppgStat)
        ? ppgStat
        : (games > 0 ? fpts / games : null);

      const playerRanks = dashState.rankCache[playerId] || {};
      const statRanks = dashState.seasonRanks[playerId] || {};

      const player = {
        id: playerId,
        name: getPlayerName(playerId),
        position: usePos,
        team: getPlayerTeam(playerId),
        totalPoints: fpts,
        ppg: ppg || 0,
        gamesPlayed: games,
        csty: (() => {
          const val = safeValue(stats, STAT_KEY_OVERRIDES.csty_pct);
          if (val === null) return null;
          return val <= 1 ? val * 100 : val;
        })(),
        consistency: (() => {
          const val = safeValue(stats, STAT_KEY_OVERRIDES.csty_pct);
          if (val === null) return null;
          return val <= 1 ? val * 100 : val;
        })(), // legacy naming for charts
        ceiling: safeValue(stats, STAT_KEY_OVERRIDES.ceiling),
        ts: (() => {
          const val = safeValue(stats, STAT_KEY_OVERRIDES.ts_per_rr);
          if (val === null) return null;
          return val <= 1 ? val * 100 : val; // normalize if stored as fraction
        })(),
        avatarUrl: `https://cdn.sleeperscdn.com/images/players/${playerId}.jpg`,
        trend: 'stable',
        stats: {
          fpts: fpts,
          ppg: ppg,
          games_played: games,
          pass_rtg: safeValue(stats, 'pass_rtg'),
          cmp_pct: safeValue(stats, 'cmp_pct'),
          pa_ypg: safeValue(stats, 'pa_ypg'),
          ttt: safeValue(stats, 'ttt'),
          yds_total: safeValue(stats, 'yds_total'),
          imp_per_g: safeValue(stats, 'imp_per_g'),
          imp: safeValue(stats, 'imp'),
          snp_pct: safeValue(stats, 'snp_pct'),
          ypc: safeValue(stats, 'ypc'),
          rec_tgt: safeValue(stats, 'rec_tgt'),
          mtf_per_att: safeValue(stats, 'mtf_per_att'),
          yco_per_att: safeValue(stats, 'yco_per_att'),
          rec: safeValue(stats, 'rec'),
          rec_ypg: safeValue(stats, 'rec_ypg'),
          ts_per_rr: safeValue(stats, 'ts_per_rr'),
          yprr: safeValue(stats, 'yprr'),
          first_down_rec_rate: safeValue(stats, 'first_down_rec_rate'),
          imp_per_g_wrte: safeValue(stats, 'imp_per_g'),
          ceiling: safeValue(stats, 'cl'),
          pass_yd: safeValue(stats, 'pass_yd')
        },
        ranks: {
          posRank: playerRanks.posRank || null,
          ppgPosRank: playerRanks.ppgPosRank || null,
          overallRank: playerRanks.overallRank || null,
          ppgOverallRank: playerRanks.ppgOverallRank || null
        },
        statRanks: statRanks
      };

      built.push(player);
    });

    players = built
      .filter(p => Number.isFinite(p.totalPoints) && p.totalPoints > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    // Default selection: highest FPTS
    dashState.selectedPlayerId = players[0]?.id || null;
    dashState.ready = true;
  } catch (err) {
    console.error('Dashboard data load failed', err);
  } finally {
    loading?.classList.add('hidden');
  }
}

function calculatePlayerScore(player) {
  const consistency = Number.isFinite(player.csty) ? player.csty : 0;
  const ppg = Number.isFinite(player.ppg) ? player.ppg : 0;
  const ceiling = Number.isFinite(player.ceiling) ? player.ceiling : 0;
  const score = (consistency + ppg * 3 + ceiling) / 3;
  return clamp(Math.round(score), 0, 99);
}

// Map position to radar config used in app.js
const RADAR_STATS_CONFIG = {
  QB: {
    stats: ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'pa_ypg', 'ttt', 'yds_total', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'paRTG', 'CMP%', 'paYPG', 'TTT', 'YDS(t)', 'IMP/G'],
    maxRank: 36
  },
  RB: {
    stats: ['fpts', 'ppg', 'yds_total', 'snp_pct', 'ypc', 'rec_tgt', 'mtf_per_att', 'yco_per_att'],
    labels: ['FPTS', 'PPG', 'YDS(t)', 'SNP%', 'YPC', 'TGT', 'MTF/A', 'YCO/A'],
    maxRank: 48
  },
  WR: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 72
  },
  TE: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 24
  }
};

function buildRadarDataset(player) {
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return [];
  return cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    let statValue = player.stats[statKey];

    // Derived fallbacks for missing sheet fields
    if ((statKey === 'imp_per_g' || statKey === 'imp_per_g_wrte') && (statValue === null || statValue === undefined)) {
      const imp = player.stats.imp || player.stats.imp_per_g_wrte;
      if (Number.isFinite(imp) && player.gamesPlayed > 0) {
        statValue = imp / player.gamesPlayed;
      }
    }
    if (statKey === 'pa_ypg' && (statValue === null || statValue === undefined)) {
      if (Number.isFinite(player.stats.pass_yd) && player.gamesPlayed > 0) {
        statValue = player.stats.pass_yd / player.gamesPlayed;
      }
    }

    let rank = null;
    if (statKey === 'fpts') rank = player.ranks.posRank;
    else if (statKey === 'ppg') rank = player.ranks.ppgPosRank;
    else rank = player.statRanks?.[statKey] ?? null;

    const maxRank = cfg.maxRank;
    const fill = Number.isFinite(rank)
      ? clamp(((maxRank - rank + 1) / maxRank) * 100, 0, 100)
      : 8; // small sliver when missing

    return { axis: label, value: fill, rawValue: statValue, rank };
  });
}

function ppgBarData(filter) {
  return [...players]
    .filter(p => Number.isFinite(p.ppg) && p.ppg > 0)
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.ppg - a.ppg)
    .slice(0, 10)
    .map(p => ({ label: p.name.split(' ').pop() || p.name, value: p.ppg }));
}

// Rendering functions
function renderSummary() {
  if (!players.length) return;
  const topPoints = [...players].sort((a, b) => b.totalPoints - a.totalPoints)[0];
  const topPPG = [...players]
    .filter(p => Number.isFinite(p.ppg) && p.ppg > 0)
    .sort((a, b) => b.ppg - a.ppg)[0];
  const topConsistencyRB = [...players]
    .filter(p => p.position === 'RB' && Number.isFinite(p.csty))
    .sort((a, b) => b.csty - a.csty)[0];
  const topTSWR = [...players]
    .filter(p => p.position === 'WR' && Number.isFinite(p.ts))
    .sort((a, b) => b.ts - a.ts)[0];

  const projectedMaxPoints = Math.max(450, topPoints?.totalPoints || 0);

  if (topPoints) {
    setText('total-points-value', topPoints.totalPoints.toFixed(1));
    setText('total-points-name', formatInitialLast(topPoints.name));
    setWidth('total-points-bar', (topPoints.totalPoints / projectedMaxPoints) * 100);
  }

  if (topConsistencyRB) {
    setText('consistency-value', `${topConsistencyRB.csty.toFixed(1)}%`);
    setText('consistency-name', formatInitialLast(topConsistencyRB.name));
    setWidth('consistency-bar', topConsistencyRB.csty);
  }

  if (topPPG) {
    setText('ppg-value', topPPG.ppg.toFixed(1));
    setText('ppg-name', topPPG.name);
  }

  if (topTSWR) {
    setText('share-value', `${topTSWR.ts.toFixed(1)}%`);
    setText('share-name', topTSWR.name);
  }
}

function renderCustomSelect() {
  const optionsContainer = document.getElementById('player-select-options');
  const label = document.getElementById('player-select-label');
  if (!optionsContainer) return;

  const optionsList = players.slice(0, 100); // already sorted by FPTS

  // Populate options
  optionsContainer.innerHTML = optionsList
    .map(p => `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team">${p.position} - ${p.team}</span>
      </li>
    `)
    .join('');

  // Update label
  const selected = getSelected();
  if (label && selected) {
    label.textContent = selected.name;
  }
}

function setupCustomSelect() {
  const container = document.getElementById('player-select-container');
  const trigger = document.getElementById('player-select-trigger');
  const dropdown = document.getElementById('player-select-dropdown');
  const searchInput = document.getElementById('player-select-search');
  const optionsContainer = document.getElementById('player-select-options');

  if (!container || !trigger || !dropdown || !searchInput || !optionsContainer) return;

  // Toggle Dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = container.classList.contains('is-open');
    
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeDropdown();
    }
  });

  // Search Filter
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const options = optionsContainer.querySelectorAll('.fc-option');
    
    options.forEach(opt => {
      const text = opt.textContent.toLowerCase();
      if (text.includes(term)) {
        opt.style.display = 'flex';
      } else {
        opt.style.display = 'none';
      }
    });
  });

  // Option Selection
  optionsContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.fc-option');
    if (!option) return;

    const value = option.dataset.value;
    if (value) {
      dashState.selectedPlayerId = value;
      
      // Update UI
      renderCustomSelect(); // Re-renders options to update selected state
      renderSelectedDetails();
      renderRadar();
      
      closeDropdown();
    }
  });

  function openDropdown() {
    container.classList.add('is-open');
    trigger.classList.add('is-open');
    searchInput.value = ''; // Clear search
    searchInput.focus();
    
    // Reset options visibility
    const options = optionsContainer.querySelectorAll('.fc-option');
    options.forEach(opt => opt.style.display = 'flex');
  }

  function closeDropdown() {
    container.classList.remove('is-open');
    trigger.classList.remove('is-open');
  }
}

function renderSelectedDetails() {
  const player = getSelected();
  // Removed avatar/name/meta updates for the deleted block
  setText('rating-value', calculatePlayerScore(player));
  const posRankText = Number.isFinite(player.ranks?.posRank) ? `#${player.ranks.posRank}` : 'NA';
  setText('rating-meta', `${player.position} · ${posRankText} // ${player.team}`);
}

function renderRadar() {
  const player = getSelected();
  const data = buildRadarDataset(player);
  drawRadarChart('radar-chart', data);
}

function renderBar() {
  const data = ppgBarData(dashState.filter);
  if (!data.length) return;
  drawBarChart('bar-chart', data);
}

function renderTable() {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;
  
  const rows = [...players]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((p, i) => {
      const posClass =
        p.position === 'WR' ? 'fc-pos-wr' :
        p.position === 'RB' ? 'fc-pos-rb' :
        p.position === 'QB' ? 'fc-pos-qb' :
        'fc-pos-te';

      const trendIcon = trendSvg(p.trend);

      return `
        <tr class="fc-tr">
          <td class="fc-td fc-td-rank">#${i + 1}</td>
          <td class="fc-td">
            <div class="fc-td-player">
              <img src="${p.avatarUrl}" class="fc-avatar-sm" alt="">
              <div>
                <div class="fc-player-name">${p.name}</div>
                <div class="fc-player-team">${p.team}</div>
              </div>
            </div>
          </td>
          <td class="fc-td fc-text-center">
            <span class="fc-pos-badge ${posClass}">${p.position}</span>
          </td>
          <td class="fc-td fc-text-right fc-td-val">${p.totalPoints.toFixed(1)}</td>
          <td class="fc-td fc-text-right fc-td-sub">${p.ppg.toFixed(1)}</td>
          <td class="fc-td fc-text-right fc-td-sub">${p.ceiling}</td>
          <td class="fc-td fc-text-center">${trendIcon}</td>
        </tr>
      `;
    })
    .join('');

  tbody.innerHTML = rows;
}

function renderScatter() {
  const topByFpts = [...players]
    .filter(p => Number.isFinite(p.totalPoints))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const scatterPool = [];
  for (const p of topByFpts) {
    if (Number.isFinite(p.csty) && Number.isFinite(p.ceiling)) {
      scatterPool.push(p);
    }
    if (scatterPool.length >= 24) break;
  }
  drawScatterChart('scatter-chart', scatterPool);
}

// Event wiring
function wireEvents() {
  // Old select listener removed

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

  window.addEventListener('resize', debounce(() => {
    renderRadar();
    renderBar();
    renderScatter();
  }, 200));
}

function updateFilterButtons() {
  document.querySelectorAll('#filter-buttons button').forEach(btn => {
    const active = btn.dataset.filter === dashState.filter;
    btn.classList.toggle('fc-filter-btn--active', active);
  });
}

// Small utilities
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${clamp(pct, 0, 100)}%`;
}

function debounce(fn, delay = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function trendSvg(trend) {
  if (trend === 'up') {
    return '<span style="color: var(--color-emerald-light); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span>';
  }
  if (trend === 'down') {
    return '<span style="color: var(--color-red); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></span>';
  }
  return '<span style="color: var(--text-muted); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path></svg></span>';
}

// D3 radar
function drawRadarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';

  const rect = container.getBoundingClientRect();
  const width = rect.width || 360;
  const height = rect.height || 360;
  const size = Math.min(width, height);

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  const numRings = data.length;
  // Use proportional padding instead of fixed 30px
  const maxRadius = size / 2 * 0.95; 
  const innerRadius = size * 0.12; // Proportional inner hole
  const ringWidth = (maxRadius - innerRadius) / numRings;
  const gap = size * 0.01; // Proportional gap
  const colors = ['#ef4444', '#f97316', '#eab308', '#22d3ee', '#8b5cf6', '#10b981', '#ec4899', '#a855f7'];
  const fontSize = Math.max(8, size * 0.025); 
  const isMobile = window.innerWidth < 768;

  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];

    const bgArc = d3.arc()
      .innerRadius(rInner)
      .outerRadius(rOuter)
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .cornerRadius(ringWidth / 2);

    svg.append('path')
      .attr('d', bgArc)
      .attr('fill', color)
      .attr('opacity', 0.1);

    const endAngle = (d.value / 100) * 2 * Math.PI;

    const fgArc = d3.arc()
      .innerRadius(rInner)
      .outerRadius(rOuter)
      .startAngle(0)
      .endAngle(endAngle)
      .cornerRadius(ringWidth / 2);

    svg.append('path')
      .attr('fill', color)
      .attr('d', fgArc)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attrTween('d', function() {
        const interpolate = d3.interpolate(0, endAngle);
        return function(t) {
          const arcFn = d3.arc()
            .innerRadius(rInner)
            .outerRadius(rOuter)
            .startAngle(0)
            .endAngle(interpolate(t))
            .cornerRadius(ringWidth / 2);
          return arcFn();
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

// D3 bar chart
function drawBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;

  // Proportional margins
  const margin = { 
    top: height * 0.12, 
    right: width * 0.03, 
    bottom: height * 0.12, 
    left: width * 0.03 
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const defs = svg.append('defs');
  const filter = defs.append('filter')
    .attr('id', 'neon-glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');

  filter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
    .attr('result', 'coloredBlur');

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .range([0, innerWidth])
    .domain(data.map(d => d.label))
    .paddingInner(0.6)
    .paddingOuter(0.05);

  const maxValue = d3.max(data, d => d.value) || 0;
  const y = d3.scaleLinear()
    .range([innerHeight, 0])
    .domain([0, maxValue * 1.15]);

  const colorScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range(['#06b6d4', '#a855f7'])
    .interpolate(d3.interpolateRgb);

  const uid = Date.now();

  data.forEach((d, i) => {
    const color = colorScale(i);
    const gradId = `bar-grad-${uid}-${i}`;
    const grad = defs.append('linearGradient')
      .attr('id', gradId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.5);
    grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.1);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);
  });

  const barGroups = g.selectAll('.bar-group')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-group');

  const barWidth = x.bandwidth();
  const radius = barWidth / 2;
  
  // Proportional stroke widths
  const isMobile = window.innerWidth < 768;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  const fontSizeVal = Math.max(8, width * 0.02);
  const fontSizeAxis = isMobile ? 5 : Math.max(8, width * 0.015);

  barGroups.append('rect')
    .attr('x', d => x(d.label))
    .attr('y', innerHeight)
    .attr('width', barWidth)
    .attr('height', 0)
    .attr('rx', radius)
    .attr('ry', radius)
    .attr('fill', 'none')
    .attr('stroke', (d, i) => colorScale(i))
    .attr('stroke-width', strokeGlow)
    .attr('stroke-opacity', 0.3)
    .style('filter', 'url(#neon-glow)')
    .transition()
    .duration(1000)
    .delay((d, i) => i * 50)
    .ease(d3.easeCubicOut)
    .attr('y', d => y(d.value))
    .attr('height', d => innerHeight - y(d.value));

  barGroups.append('rect')
    .attr('x', d => x(d.label))
    .attr('y', innerHeight)
    .attr('width', barWidth)
    .attr('height', 0)
    .attr('rx', radius)
    .attr('ry', radius)
    .attr('fill', (d, i) => `url(#bar-grad-${uid}-${i})`)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 50)
    .ease(d3.easeCubicOut)
    .attr('y', d => y(d.value))
    .attr('height', d => innerHeight - y(d.value));

  barGroups.append('rect')
    .attr('x', d => x(d.label))
    .attr('y', innerHeight)
    .attr('width', barWidth)
    .attr('height', 0)
    .attr('rx', radius)
    .attr('ry', radius)
    .attr('fill', 'none')
    .attr('stroke', (d, i) => colorScale(i))
    .attr('stroke-width', strokeMain)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 50)
    .ease(d3.easeCubicOut)
    .attr('y', d => y(d.value))
    .attr('height', d => innerHeight - y(d.value));

  barGroups.append('text')
    .text(d => d.value.toFixed(1))
    .attr('x', d => x(d.label) + barWidth / 2)
    .attr('y', innerHeight)
    .attr('text-anchor', 'middle')
    .attr('fill', (d, i) => colorScale(i))
    .attr('font-size', `${fontSizeVal}px`)
    .attr('font-weight', '700')
    .style('text-shadow', '0 0 10px rgba(0,0,0,1)')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 50 + 400)
    .attr('y', d => y(d.value) - (isMobile ? height * 0.05 : height * 0.02))
    .style('opacity', 1);

  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .style('text-anchor', 'middle')
    .style('fill', '#94a3b8')
    .style('font-size', `${fontSizeAxis}px`)
    .style('font-weight', '500')
    .attr('dy', '1.5em');

  g.select('.domain').remove();
}

// D3 Scatter Chart
function drawScatterChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';

  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;

  const margin = { 
    top: isMobile ? 10 : height * 0.02, // Very small top margin
    right: width * 0.05, 
    bottom: isMobile ? 40 : height * 0.1, // Fixed bottom for mobile
    left: isMobile ? 40 : width * 0.06 // Fixed left for mobile (reduced from previous calculation)
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const xDomain = d3.extent(data, d => d.consistency).map((v, i, arr) => (
    i === 0 ? Math.max(0, v - 5) : Math.min(100, v + 5)
  ));
  const yDomain = d3.extent(data, d => d.ceiling).map((v, i, arr) => (
    i === 0 ? Math.max(0, v - 5) : Math.min(100, v + 5)
  ));

  const x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0]);

  // Grid
  const xAxisGrid = d3.axisBottom(x).tickSize(-innerHeight).tickFormat('').ticks(5);
  const yAxisGrid = d3.axisLeft(y).tickSize(-innerWidth).tickFormat('').ticks(5);

  g.append('g')
    .attr('class', 'scatter-grid')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxisGrid);

  g.append('g')
    .attr('class', 'scatter-grid')
    .call(yAxisGrid);

  // Axes
  g.append('g')
    .attr('class', 'scatter-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5))
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  g.append('g')
    .attr('class', 'scatter-axis')
    .call(d3.axisLeft(y).ticks(5))
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  // Axis Labels
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + (isMobile ? 35 : margin.bottom - 5)) // Fixed offset for mobile
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px') // Bigger on desktop
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CONSISTENCY');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', isMobile ? -30 : -margin.left + 20) // Fixed offset for mobile (closer to axis), adjusted desktop
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px') // Bigger on desktop
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CEILING');

  // Color Mapping
  const colorMap = {
    'QB': '#f472b6', // Pink
    'RB': '#4ade80', // Emerald
    'WR': '#22d3ee', // Cyan
    'TE': '#fb923c'  // Orange
  };

  // Dots
  g.selectAll('.scatter-dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`)
    .attr('cx', d => x(d.consistency))
    .attr('cy', d => y(d.ceiling))
    .attr('r', 0)
    // fill is handled by CSS
    .transition()
    .duration(1000)
    .delay((d, i) => i * 30)
    .ease(d3.easeBackOut)
    .attr('r', isMobile ? 3.5 : 7); // Responsive radius: smaller on mobile, bigger on desktop

  // Labels with collision avoidance
  const labels = g.selectAll('.scatter-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'scatter-label')
    .attr('x', d => x(d.consistency))
    .attr('y', d => y(d.ceiling))
    .text(d => {
      const parts = d.name.split(' ');
      return `${parts[0][0]}. ${parts[parts.length - 1]}`;
    })
    .attr('opacity', 0);

  // Simple force simulation for label placement
  const simulation = d3.forceSimulation(data)
    .force('x', d3.forceX(d => x(d.consistency)).strength(1))
    .force('y', d3.forceY(d => y(d.ceiling)).strength(1))
    .force('collide', d3.forceCollide(12)) // Radius of collision
    .stop();

  // Run simulation manually for a few ticks to settle
  for (let i = 0; i < 30; ++i) simulation.tick();

  labels
    .transition()
    .duration(1000)
    .delay((d, i) => i * 30 + 500)
    .attr('x', d => d.x) // Use simulated positions if we bound data to simulation, but here we didn't bind directly to DOM elements yet.
    // Actually, d3.forceSimulation modifies the data objects directly adding x, y, vx, vy.
    // But wait, I passed `data` to simulation. So `d.x` and `d.y` on the data object are updated.
    // However, the initial x/y in simulation needs to be set.
    // Let's re-do the simulation setup correctly.
    .attr('opacity', 1);
    
    // Correct simulation usage:
    // We need separate nodes for labels so we don't move the dots.
    const labelNodes = data.map(d => ({
      ...d,
      fx: x(d.consistency), // Anchor to the dot
      fy: y(d.ceiling),
      x: x(d.consistency),
      y: y(d.ceiling)
    }));
    
    // Actually, we want labels to be NEAR dots but not overlapping EACH OTHER.
    // Anchoring them exactly (fx, fy) defeats collision.
    // We want a force that pulls them to the dot, but collision pushes them away.
    
    const sim = d3.forceSimulation(labelNodes)
      .force('anchorX', d3.forceX(d => x(d.consistency)).strength(3))
      .force('anchorY', d3.forceY(d => y(d.ceiling) - 10).strength(3)) // Target slightly above
      .force('collide', d3.forceCollide(14))
      .stop();

    for (let i = 0; i < 60; ++i) sim.tick();

    labels
      .attr('x', (d, i) => labelNodes[i].x)
      .attr('y', (d, i) => labelNodes[i].y);
}

// Initialize
window.initFantasyDashboard = async function() {
  if (dashState.ready) return;
  await loadDashboardData();
  if (!players.length) return;

  renderSummary();
  renderCustomSelect();
  setupCustomSelect();
  renderSelectedDetails();
  renderRadar();
  renderBar();
  renderScatter();
  updateFilterButtons();
  wireEvents();
};

document.addEventListener('DOMContentLoaded', () => {
  window.initFantasyDashboard();
});
})();
