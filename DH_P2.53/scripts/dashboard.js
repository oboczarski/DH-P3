(function() {
// Minimal, manual-data dashboard (no remote fetching). Update MANUAL_PLAYERS twice weekly.

// === Manual data entry ===
// Fill in players with sheet-sourced numbers you curate. Provide ranks alongside values.
// Required fields per player:
//   id: string (unique), name: string, position: 'QB'|'RB'|'WR'|'TE', team: string
//   stats: { fpts, ppg, csty, ts, ceiling, yds_total, snp_pct, ypc, rec_tgt, mtf_per_att, yco_per_att, rec, rec_ypg, ts_per_rr, yprr, first_down_rec_rate, imp_per_g, pass_rtg, cmp_pct, pa_ypg, ttt }
//   ranks: { posRank, ppgPosRank, overallRank, ppgOverallRank }  // positional FPTS rank is posRank
// Optional: avatarUrl, trend ('up'|'down'|'stable')
const MANUAL_PLAYERS = [
  // Example skeleton (replace with real data)
  // {
  //   id: '1234',
  //   name: 'Example Player',
  //   position: 'WR',
  //   team: 'TEAM',
  //   stats: {
  //     fpts: 320.5,
  //     ppg: 20.0,
  //     csty: 72.5,
  //     ts: 30.1,
  //     ceiling: 38.4,
  //     yds_total: 1500,
  //     snp_pct: 86.0,
  //     ypc: 4.5,
  //     rec_tgt: 160,
  //     mtf_per_att: 0.18,
  //     yco_per_att: 2.3,
  //     rec: 110,
  //     rec_ypg: 95.0,
  //     ts_per_rr: 28.0,
  //     yprr: 2.8,
  //     first_down_rec_rate: 0.42,
  //     imp_per_g: 5.4,
  //     pass_rtg: null,
  //     cmp_pct: null,
  //     pa_ypg: null,
  //     ttt: null
  //   },
  //   ranks: { posRank: 1, ppgPosRank: 1, overallRank: 1, ppgOverallRank: 1 },
  //   avatarUrl: '',
  //   trend: 'up'
  // }
];

// === State ===
let players = [];
const dashState = { selectedPlayerId: null, filter: 'all' };

// === Helpers ===
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const formatInitialLast = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstInitial = parts[0]?.[0] ? `${parts[0][0].toUpperCase()}.` : '';
  const last = parts.slice(1).join(' ');
  return `${firstInitial} ${last}`.trim();
};
const getSelected = () => players.find(p => p.id === dashState.selectedPlayerId) || players[0];

// Radar config mirrors stats/radar ordering
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

// Build radar dataset using provided ranks; fill scales to rank (1 = 100%)
function buildRadarDataset(player) {
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return [];
  return cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    const statValue = player.stats?.[statKey];
    let rank = null;
    if (statKey === 'fpts') rank = player.ranks?.posRank;
    else if (statKey === 'ppg') rank = player.ranks?.ppgPosRank;
    else rank = player.statRanks?.[statKey] ?? null;
    const maxRank = cfg.maxRank;
    const fill = Number.isFinite(rank)
      ? clamp(((maxRank - rank + 1) / maxRank) * 100, 0, 100)
      : 8;
    return { axis: label, value: fill, rawValue: statValue, rank };
  });
}

// Charts data builders
function ppgBarData(filter) {
  return [...players]
    .filter(p => Number.isFinite(p.stats?.ppg) && p.stats.ppg > 0)
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, 10)
    .map(p => ({ label: p.name.split(' ').pop() || p.name, value: p.stats.ppg }));
}

// Rendering
function renderSummary() {
  if (!players.length) return;
  const topFpts = [...players].sort((a, b) => (b.stats.fpts || 0) - (a.stats.fpts || 0))[0];
  const topPPG = [...players]
    .filter(p => Number.isFinite(p.stats.ppg) && p.stats.ppg > 0)
    .sort((a, b) => b.stats.ppg - a.stats.ppg)[0];
  const topCstyRB = [...players]
    .filter(p => p.position === 'RB' && Number.isFinite(p.stats.csty))
    .sort((a, b) => b.stats.csty - a.stats.csty)[0];
  const topTSWR = [...players]
    .filter(p => p.position === 'WR' && Number.isFinite(p.stats.ts))
    .sort((a, b) => b.stats.ts - a.stats.ts)[0];

  const projectedMax = Math.max(450, topFpts?.stats.fpts || 0);

  if (topFpts) {
    setText('total-points-value', topFpts.stats.fpts.toFixed(1));
    setText('total-points-name', formatInitialLast(topFpts.name));
    setWidth('total-points-bar', (topFpts.stats.fpts / projectedMax) * 100);
  }
  if (topCstyRB) {
    setText('consistency-value', `${topCstyRB.stats.csty.toFixed(1)}%`);
    setText('consistency-name', formatInitialLast(topCstyRB.name));
    setWidth('consistency-bar', topCstyRB.stats.csty);
  }
  if (topPPG) {
    setText('ppg-value', topPPG.stats.ppg.toFixed(1));
    setText('ppg-name', topPPG.name);
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
    .map(p => `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team">${p.position} - ${p.team}</span>
      </li>
    `)
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
      optionsContainer.querySelectorAll('.fc-option').forEach(opt => opt.style.display = 'flex');
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeDropdown();
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    optionsContainer.querySelectorAll('.fc-option').forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
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
  const posRankText = Number.isFinite(player.ranks?.posRank) ? player.ranks.posRank : 'NA';
  setText('rating-label-top', 'POS RK');
  setText('rating-value', posRankText);
  setText('rating-meta', '');
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

function renderScatter() {
  const topByFpts = [...players]
    .filter(p => Number.isFinite(p.stats?.fpts))
    .sort((a, b) => b.stats.fpts - a.stats.fpts);
  const scatterPool = [];
  for (const p of topByFpts) {
    if (Number.isFinite(p.stats.csty) && Number.isFinite(p.stats.ceiling)) scatterPool.push(p);
    if (scatterPool.length >= 24) break;
  }
  if (!scatterPool.length) return;
  drawScatterChart('scatter-chart', scatterPool);
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
  const gap = size * 0.01;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22d3ee', '#8b5cf6', '#10b981', '#ec4899', '#a855f7'];
  const fontSize = Math.max(8, size * 0.025);
  const isMobile = window.innerWidth < 768;
  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];
    const bgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(2 * Math.PI).cornerRadius(ringWidth / 2);
    svg.append('path').attr('d', bgArc).attr('fill', color).attr('opacity', 0.1);
    const endAngle = (d.value / 100) * 2 * Math.PI;
    const fgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(endAngle).cornerRadius(ringWidth / 2);
    svg.append('path').attr('fill', color).attr('d', fgArc).transition().duration(1200).ease(d3.easeCubicOut).attrTween('d', function() {
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
  const margin = { top: height * 0.12, right: width * 0.03, bottom: height * 0.12, left: width * 0.03 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const defs = svg.append('defs');
  const filter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const x = d3.scaleBand().range([0, innerWidth]).domain(data.map(d => d.label)).paddingInner(0.6).paddingOuter(0.05);
  const maxValue = d3.max(data, d => d.value) || 0;
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, maxValue * 1.15]);
  const colorScale = d3.scaleLinear().domain([0, data.length - 1]).range(['#06b6d4', '#a855f7']).interpolate(d3.interpolateRgb);
  const uid = Date.now();
  data.forEach((d, i) => {
    const color = colorScale(i);
    const gradId = `bar-grad-${uid}-${i}`;
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.5);
    grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.1);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);
  });
  const barGroups = g.selectAll('.bar-group').data(data).enter().append('g').attr('class', 'bar-group');
  const barWidth = x.bandwidth();
  const radius = barWidth / 2;
  const isMobile = window.innerWidth < 768;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  const fontSizeVal = Math.max(8, width * 0.02);
  const fontSizeAxis = isMobile ? 5 : Math.max(8, width * 0.015);
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeGlow).attr('stroke-opacity', 0.3).style('filter', 'url(#neon-glow)').transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', (d, i) => `url(#bar-grad-${uid}-${i})`).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeMain).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('text').text(d => d.value.toFixed(1)).attr('x', d => x(d.label) + barWidth / 2).attr('y', innerHeight).attr('text-anchor', 'middle').attr('fill', (d, i) => colorScale(i)).attr('font-size', `${fontSizeVal}px`).attr('font-weight', '700').style('text-shadow', '0 0 10px rgba(0,0,0,1)').style('opacity', 0).transition().duration(1000).delay((d, i) => i * 50 + 400).attr('y', d => y(d.value) - (isMobile ? height * 0.05 : height * 0.02)).style('opacity', 1);
  g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSize(0)).selectAll('text').style('text-anchor', 'middle').style('fill', '#94a3b8').style('font-size', `${fontSizeAxis}px`).style('font-weight', '500').attr('dy', '1.5em');
  g.select('.domain').remove();
}

function drawScatterChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;
  const margin = { top: isMobile ? 10 : height * 0.02, right: width * 0.05, bottom: isMobile ? 40 : height * 0.1, left: isMobile ? 40 : width * 0.06 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const yDomain = [23, 42];
  const xDomain = d3.extent(data, d => d.stats.csty).map((v, i) => (i === 0 ? Math.max(0, v - 5) : Math.min(100, v + 5)));
  const x = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
  const y = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);
  const xAxisGrid = d3.axisBottom(x).tickSize(-innerHeight).tickFormat('').ticks(5);
  const yAxisGrid = d3.axisLeft(y).tickValues([25, 30, 35, 40]).tickSize(-innerWidth).tickFormat('');
  g.append('g').attr('class', 'scatter-grid').attr('transform', `translate(0,${innerHeight})`).call(xAxisGrid);
  g.append('g').attr('class', 'scatter-grid').call(yAxisGrid);
  g.append('g').attr('class', 'scatter-axis').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5)).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('g').attr('class', 'scatter-axis').call(d3.axisLeft(y).tickValues([25, 30, 35, 40])).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('text').attr('x', innerWidth / 2).attr('y', innerHeight + (isMobile ? 35 : margin.bottom - 5)).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight', 'bold').attr('letter-spacing', '0.1em').text('CONSISTENCY');
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -innerHeight / 2).attr('y', isMobile ? -30 : -margin.left + 20).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight', 'bold').attr('letter-spacing', '0.1em').text('CEILING');
  g.selectAll('.scatter-dot').data(data).enter().append('circle').attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`).attr('cx', d => x(d.stats.csty)).attr('cy', d => y(d.stats.ceiling)).attr('r', 0).transition().duration(1000).delay((d, i) => i * 30).ease(d3.easeBackOut).attr('r', isMobile ? 3.5 : 7);
  const labels = g.selectAll('.scatter-label').data(data).enter().append('text').attr('class', 'scatter-label').attr('x', d => x(d.stats.csty)).attr('y', d => y(d.stats.ceiling)).text(d => {
    const parts = d.name.split(' '); return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  }).attr('opacity', 0);
  const labelNodes = data.map(d => ({ ...d, fx: x(d.stats.csty), fy: y(d.stats.ceiling), x: x(d.stats.csty), y: y(d.stats.ceiling) }));
  const sim = d3.forceSimulation(labelNodes)
    .force('anchorX', d3.forceX(d => x(d.stats.csty)).strength(3))
    .force('anchorY', d3.forceY(d => y(d.stats.ceiling) - 10).strength(3))
    .force('collide', d3.forceCollide(14))
    .stop();
  for (let i = 0; i < 60; ++i) sim.tick();
  labels.transition().duration(1000).delay((d, i) => i * 30 + 500).attr('x', (d, i) => labelNodes[i].x).attr('y', (d, i) => labelNodes[i].y).attr('opacity', 1);
}

// Initialize
window.initFantasyDashboard = function() {
  players = MANUAL_PLAYERS.slice();
  if (!players.length) return;
  dashState.selectedPlayerId = players[0].id;
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
