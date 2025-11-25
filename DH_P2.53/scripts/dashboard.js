(function() {
// ---- Manual dashboard config (edit twice weekly) ----
const MANUAL_PLAYERS = [
  { id: '1',  name: 'Justin Jefferson',      position: 'WR', team: 'MIN', totalPoints: 342.5, ppg: 22.4, consistency: 92, ceiling: 45, targetShare: 29.5, redZone: 95, burst: 80, clutch: 88, avatarUrl: 'https://picsum.photos/seed/jefferson/100/100', trend: 'up' },
  { id: '2',  name: 'Christian McCaffrey',   position: 'RB', team: 'SF',  totalPoints: 380.2, ppg: 24.8, consistency: 95, ceiling: 50, targetShare: 18.2, redZone: 90, burst: 78, clutch: 96, avatarUrl: 'https://picsum.photos/seed/cmc/100/100', trend: 'stable' },
  { id: '3',  name: 'Tyreek Hill',           position: 'WR', team: 'MIA', totalPoints: 310.8, ppg: 20.1, consistency: 78, ceiling: 60, targetShare: 28.0, redZone: 60, burst: 99, clutch: 70, avatarUrl: 'https://picsum.photos/seed/tyreek/100/100', trend: 'down' },
  { id: '4',  name: 'Josh Allen',            position: 'QB', team: 'BUF', totalPoints: 402.1, ppg: 25.3, consistency: 85, ceiling: 46, targetShare: 0,    redZone: 82, burst: 76, clutch: 92, avatarUrl: 'https://picsum.photos/seed/allen/100/100', trend: 'up' },
  { id: '5',  name: 'Travis Kelce',          position: 'TE', team: 'KC',  totalPoints: 210.4, ppg: 14.5, consistency: 92, ceiling: 28, targetShare: 24.0, redZone: 97, burst: 62, clutch: 95, avatarUrl: 'https://picsum.photos/seed/kelce/100/100', trend: 'stable' },
  { id: '6',  name: 'CeeDee Lamb',           position: 'WR', team: 'DAL', totalPoints: 335.9, ppg: 21.5, consistency: 87, ceiling: 40, targetShare: 27.0, redZone: 70, burst: 88, clutch: 82, avatarUrl: 'https://picsum.photos/seed/lamb/100/100', trend: 'up' },
  { id: '7',  name: 'Lamar Jackson',         position: 'QB', team: 'BAL', totalPoints: 360.5, ppg: 23.1, consistency: 80, ceiling: 50, targetShare: 0,    redZone: 68, burst: 95, clutch: 78, avatarUrl: 'https://picsum.photos/seed/lamar/100/100', trend: 'up' },
  { id: '8',  name: 'Bijan Robinson',        position: 'RB', team: 'ATL', totalPoints: 245.3, ppg: 16.2, consistency: 70, ceiling: 32, targetShare: 12.0, redZone: 44, burst: 86, clutch: 60, avatarUrl: 'https://picsum.photos/seed/bijan/100/100', trend: 'down' },
  { id: '9',  name: 'Amon-Ra St. Brown',     position: 'WR', team: 'DET', totalPoints: 298.4, ppg: 19.9, consistency: 90, ceiling: 35, targetShare: 30.2, redZone: 72, burst: 68, clutch: 85, avatarUrl: 'https://picsum.photos/seed/amonra/100/100', trend: 'stable' },
  { id: '10', name: 'Saquon Barkley',        position: 'RB', team: 'NYG', totalPoints: 270.1, ppg: 17.6, consistency: 76, ceiling: 45, targetShare: 15.0, redZone: 55, burst: 92, clutch: 74, avatarUrl: 'https://picsum.photos/seed/saquon/100/100', trend: 'up' },
  { id: '11', name: 'Garrett Wilson',        position: 'WR', team: 'NYJ', totalPoints: 240.4, ppg: 15.0, consistency: 68, ceiling: 28, targetShare: 33.0, redZone: 35, burst: 80, clutch: 58, avatarUrl: 'https://picsum.photos/seed/garrettwilson/100/100', trend: 'down' },
  { id: '12', name: 'Jalen Hurts',           position: 'QB', team: 'PHI', totalPoints: 385.0, ppg: 24.2, consistency: 88, ceiling: 45, targetShare: 0,    redZone: 95, burst: 70, clutch: 90, avatarUrl: 'https://picsum.photos/seed/hurts/100/100', trend: 'stable' },
  { id: '13', name: 'Davante Adams',         position: 'WR', team: 'LV',  totalPoints: 280.0, ppg: 17.5, consistency: 80, ceiling: 38, targetShare: 32.0, redZone: 75, burst: 60, clutch: 85, avatarUrl: 'https://picsum.photos/seed/adams/100/100', trend: 'down' },
  { id: '14', name: 'Jahmyr Gibbs',          position: 'RB', team: 'DET', totalPoints: 230.0, ppg: 15.5, consistency: 65, ceiling: 42, targetShare: 16.0, redZone: 45, burst: 95, clutch: 55, avatarUrl: 'https://picsum.photos/seed/gibbs/100/100', trend: 'up' },
  { id: '15', name: 'Sam LaPorta',           position: 'TE', team: 'DET', totalPoints: 185.0, ppg: 12.8, consistency: 78, ceiling: 26, targetShare: 18.0, redZone: 70, burst: 68, clutch: 72, avatarUrl: 'https://picsum.photos/seed/laporta/100/100', trend: 'up' }
];

let players = [];
const state = { selectedPlayerId: null, filter: 'all' };

// ---- Helpers ----
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const formatInitialLast = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${(parts[0][0] || '').toUpperCase()}. ${parts.slice(1).join(' ')}`.trim();
};
const byMetric = (metric, pos) => {
  const pool = pos ? players.filter(p => p.position === pos) : players;
  return [...pool].sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
};
const getTop = (metric, pos) => byMetric(metric, pos)[0];
const calculatePlayerScore = (p) => {
  if (!p) return 0;
  return clamp(Math.round((p.consistency + (p.ppg / 30 * 100) + p.ceiling) / 3), 0, 99);
};
const ppgBarData = (filter) => {
  return [...players]
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.ppg - a.ppg)
    .slice(0, 10)
    .map(p => ({ label: p.name.split(' ').pop() || p.name, value: p.ppg }));
};

// ---- Renderers ----
function renderSummary() {
  const topPoints = getTop('totalPoints');
  const topConsistencyRB = getTop('consistency', 'RB') || getTop('consistency');
  const topPPG = getTop('ppg');
  const topShare = getTop('targetShare', 'WR') || getTop('targetShare');

  if (topPoints) {
    setText('total-points-value', topPoints.totalPoints.toFixed(1));
    setText('total-points-name', formatInitialLast(topPoints.name));
    setWidth('total-points-bar', (topPoints.totalPoints / 450) * 100);
  }
  if (topConsistencyRB) {
    setText('consistency-value', `${topConsistencyRB.consistency.toFixed(1)}%`);
    setText('consistency-name', formatInitialLast(topConsistencyRB.name));
    setWidth('consistency-bar', topConsistencyRB.consistency);
  }
  if (topPPG) {
    setText('ppg-value', topPPG.ppg.toFixed(1));
    setText('ppg-name', topPPG.name);
  }
  if (topShare) {
    setText('share-value', `${topShare.targetShare.toFixed(1)}%`);
    setText('share-name', topShare.name);
  }
}

function renderCustomSelect() {
  const optionsContainer = document.getElementById('player-select-options');
  const label = document.getElementById('player-select-label');
  if (!optionsContainer) return;

  optionsContainer.innerHTML = players
    .map(p => `
      <li class="fc-option ${p.id === state.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team">${p.position} - ${p.team}</span>
      </li>
    `)
    .join('') || '<li class="fc-option is-selected">No players</li>';

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
    searchInput.value = '';
    const opts = optionsContainer.querySelectorAll('.fc-option');
    opts.forEach(opt => opt.style.display = 'flex');
    if (container.classList.contains('is-open')) searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove('is-open');
      trigger.classList.remove('is-open');
    }
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
    state.selectedPlayerId = option.dataset.value;
    renderCustomSelect();
    renderSelectedDetails();
    renderRadar();
  });
}

function renderSelectedDetails() {
  const player = getSelected();
  setText('rating-value', calculatePlayerScore(player));
  setText('rating-meta', player ? `${player.position} // ${player.team}` : '');
}

function renderRadar() {
  const player = getSelected();
  const data = radarData(player);
  drawRadarChart('radar-chart', data, player ? player.position : '');
}

function radarData(player) {
  if (!player) return [];
  const maxFpts = Math.max(...players.map(p => p.totalPoints || 0), 1);
  const maxPPG = Math.max(...players.map(p => p.ppg || 0), 1);
  const maxCons = Math.max(...players.map(p => p.consistency || 0), 1);
  const maxCeil = Math.max(...players.map(p => p.ceiling || 0), 1);
  const maxTs = Math.max(...players.map(p => p.targetShare || 0), 1);
  return [
    { axis: 'FPTS', value: clamp((player.totalPoints / maxFpts) * 100, 0, 100) },
    { axis: 'PPG',  value: clamp((player.ppg / maxPPG) * 100, 0, 100) },
    { axis: 'CSTY', value: clamp((player.consistency / maxCons) * 100, 0, 100) },
    { axis: 'CEIL', value: clamp((player.ceiling / maxCeil) * 100, 0, 100) },
    { axis: 'TS%',  value: clamp((player.targetShare / maxTs) * 100, 0, 100) },
    { axis: 'RZ',   value: clamp((player.redZone || 0), 0, 100) },
    { axis: 'BUR',  value: clamp((player.burst || 0), 0, 100) },
    { axis: 'CLUT', value: clamp((player.clutch || 0), 0, 100) }
  ];
}

function renderBar() {
  const data = ppgBarData(state.filter);
  if (data.length) drawBarChart('bar-chart', data);
}

function renderScatter() {
  if (!players.length) return;
  const top24 = [...players].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 24);
  drawScatterChart('scatter-chart', top24);
}

// ---- Events ----
function wireEvents() {
  const filterBtns = document.getElementById('filter-buttons');
  if (filterBtns) {
    filterBtns.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      state.filter = btn.dataset.filter || 'all';
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
    btn.classList.toggle('fc-filter-btn--active', btn.dataset.filter === state.filter);
  });
}

// ---- Utilities ----
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function setWidth(id, pct) { const el = document.getElementById(id); if (el) el.style.width = `${clamp(pct, 0, 100)}%`; }
function debounce(fn, delay = 150) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; }
function trendSvg(trend) {
  if (trend === 'up') return '<span style="color: var(--color-emerald-light); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span>';
  if (trend === 'down') return '<span style="color: var(--color-red); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></span>';
  return '<span style="color: var(--text-muted); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path></svg></span>';
}

// ---- D3 Charts (compact) ----
function drawRadarChart(containerId, data, centerText) {
  const container = document.getElementById(containerId);
  if (!container || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width || 360, rect.height || 360);
  const svg = d3.select(container).append('svg').attr('width', size).attr('height', size).append('g').attr('transform', `translate(${size/2},${size/2})`);
  const maxRadius = size * 0.45;
  const inner = size * 0.12;
  const ring = (maxRadius - inner) / data.length;
  const gap = size * 0.01;
  const colors = ['#ef4444','#f97316','#eab308','#22d3ee','#8b5cf6','#10b981','#ec4899','#a855f7'];
  const isMobile = window.innerWidth < 768;
  const fontSize = Math.max(8, size * 0.025);

  data.forEach((d, i) => {
    const rIn = inner + i * ring + gap;
    const rOut = inner + (i + 1) * ring;
    const color = colors[i % colors.length];
    svg.append('path').attr('d', d3.arc().innerRadius(rIn).outerRadius(rOut).startAngle(0).endAngle(2*Math.PI).cornerRadius(ring/2)).attr('fill', color).attr('opacity', 0.1);
    const end = (d.value / 100) * 2 * Math.PI;
    svg.append('path').attr('fill', color).attr('d', d3.arc().innerRadius(rIn).outerRadius(rOut).startAngle(0).endAngle(end).cornerRadius(ring/2)).transition().duration(900).ease(d3.easeCubicOut).attrTween('d', () => {
      const interp = d3.interpolate(0, end);
      return t => d3.arc().innerRadius(rIn).outerRadius(rOut).startAngle(0).endAngle(interp(t)).cornerRadius(ring/2)();
    });
    if (!isMobile) {
      svg.append('text').attr('x', 5).attr('y', -(rIn + (ring - gap)/2)).attr('dy','0.35em').text(d.axis.toUpperCase()).attr('fill','#fff').attr('font-size', `${fontSize}px`).attr('font-weight','bold').attr('opacity',0.8);
    }
  });

  if (centerText) svg.append('text').attr('text-anchor','middle').attr('dy','0.35em').text(centerText).attr('fill','#fff').attr('font-size', `${inner*0.8}px`).attr('font-weight','bold').style('text-shadow','0 2px 10px rgba(0,0,0,0.5)');
}

function drawBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const m = { top: height*0.12, right: width*0.03, bottom: height*0.12, left: width*0.03 };
  const innerW = width - m.left - m.right;
  const innerH = height - m.top - m.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);
  const x = d3.scaleBand().range([0, innerW]).domain(data.map(d => d.label)).paddingInner(0.6).paddingOuter(0.05);
  const y = d3.scaleLinear().range([innerH, 0]).domain([0, (d3.max(data, d => d.value) || 0) * 1.15]);
  const color = d3.scaleLinear().domain([0, data.length-1]).range(['#06b6d4','#a855f7']).interpolate(d3.interpolateRgb);
  const barW = x.bandwidth();
  const radius = barW/2;
  const isMobile = window.innerWidth < 768;
  const fontVal = Math.max(8, width*0.02);
  const fontAxis = isMobile ? 5 : Math.max(8, width*0.015);

  const bars = g.selectAll('.bar').data(data).enter().append('g').attr('class','bar');
  bars.append('rect').attr('x', d => x(d.label)).attr('y', innerH).attr('width', barW).attr('height',0).attr('rx', radius).attr('ry', radius).attr('fill', (d,i) => color(i)).attr('opacity',0.6)
    .transition().duration(900).delay((d,i)=>i*40).attr('y', d => y(d.value)).attr('height', d => innerH - y(d.value));
  bars.append('text').text(d => d.value.toFixed(1)).attr('x', d => x(d.label)+barW/2).attr('y', innerH).attr('text-anchor','middle').attr('fill',(d,i)=>color(i)).attr('font-size', `${fontVal}px`).attr('font-weight','700').style('text-shadow','0 0 10px rgba(0,0,0,1)').style('opacity',0)
    .transition().duration(900).delay((d,i)=>i*40+300).attr('y', d => y(d.value) - (isMobile ? height*0.05 : height*0.02)).style('opacity',1);

  g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).tickSize(0)).selectAll('text').style('fill','#94a3b8').style('font-size', `${fontAxis}px`).style('font-weight','500').attr('dy','1.5em');
  g.select('.domain').remove();
}

function drawScatterChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;
  const m = { top: isMobile ? 10 : height*0.02, right: width*0.05, bottom: isMobile ? 40 : height*0.1, left: isMobile ? 40 : width*0.06 };
  const innerW = width - m.left - m.right;
  const innerH = height - m.top - m.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);
  const x = d3.scaleLinear().domain([50,100]).range([0, innerW]);
  const y = d3.scaleLinear().domain([20,70]).range([innerH,0]);
  const colorMap = { QB:'#f472b6', RB:'#4ade80', WR:'#22d3ee', TE:'#fb923c' };

  g.append('g').attr('class','scatter-grid').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).tickSize(-innerH).tickFormat(''));
  g.append('g').attr('class','scatter-grid').call(d3.axisLeft(y).tickSize(-innerW).tickFormat(''));
  g.append('g').attr('class','scatter-axis').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(5)).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('g').attr('class','scatter-axis').call(d3.axisLeft(y).ticks(5)).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('text').attr('x', innerW/2).attr('y', innerH + (isMobile ? 35 : m.bottom-5)).attr('text-anchor','middle').attr('fill','#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight','bold').attr('letter-spacing','0.1em').text('CONSISTENCY');
  g.append('text').attr('transform','rotate(-90)').attr('x', -innerH/2).attr('y', isMobile ? -30 : -m.left + 20).attr('text-anchor','middle').attr('fill','#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight','bold').attr('letter-spacing','0.1em').text('CEILING');

  g.selectAll('.scatter-dot').data(data).enter().append('circle').attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`).attr('cx', d => x(d.consistency)).attr('cy', d => y(d.ceiling)).attr('r',0).attr('fill', d => colorMap[d.position] || '#a855f7')
    .transition().duration(900).delay((d,i)=>i*25).ease(d3.easeBackOut).attr('r', isMobile ? 3.5 : 7);

  const labels = g.selectAll('.scatter-label').data(data).enter().append('text').attr('class','scatter-label').attr('x', d => x(d.consistency)).attr('y', d => y(d.ceiling)).text(d => {
    const parts = d.name.split(' '); return `${parts[0][0]}. ${parts[parts.length-1]}`; }).attr('opacity',0).style('fill','#fff').style('font-size', isMobile ? '8px' : '10px').style('font-weight','600');

  labels.transition().duration(900).delay((d,i)=>i*25+300).attr('opacity',1).attr('y', d => y(d.ceiling) - 10);
}

// ---- Init ----
function initFantasyDashboard() {
  players = MANUAL_PLAYERS.slice();
  if (!players.length) return;
  state.selectedPlayerId = state.selectedPlayerId || players[0].id;
  renderSummary();
  renderCustomSelect();
  setupCustomSelect();
  renderSelectedDetails();
  renderRadar();
  renderBar();
  renderScatter();
  wireEvents();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initFantasyDashboard();
} else {
  document.addEventListener('DOMContentLoaded', initFantasyDashboard);
}

window.initFantasyDashboard = initFantasyDashboard;
})();
