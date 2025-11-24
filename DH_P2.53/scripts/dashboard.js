// Fantasy Command - Vanilla JS rebuild
// Data model
const defaultPlayers = [
  { id: '1', name: 'Justin Jefferson', position: 'WR', team: 'MIN', totalPoints: 342.5, ppg: 22.4, consistency: 92, ceiling: 45, floor: 12, targetShare: 29.5, redZone: 95, burst: 80, clutch: 88, avatarUrl: 'https://picsum.photos/seed/jefferson/100/100', trend: 'up' },
  { id: '2', name: 'Christian McCaffrey', position: 'RB', team: 'SF', totalPoints: 380.2, ppg: 24.8, consistency: 95, ceiling: 50, floor: 15, targetShare: 18.2, redZone: 90, burst: 78, clutch: 96, avatarUrl: 'https://picsum.photos/seed/cmc/100/100', trend: 'stable' },
  { id: '3', name: 'Tyreek Hill', position: 'WR', team: 'MIA', totalPoints: 310.8, ppg: 20.1, consistency: 78, ceiling: 60, floor: 5, targetShare: 28.0, redZone: 60, burst: 99, clutch: 70, avatarUrl: 'https://picsum.photos/seed/tyreek/100/100', trend: 'down' },
  { id: '4', name: 'Josh Allen', position: 'QB', team: 'BUF', totalPoints: 402.1, ppg: 25.3, consistency: 85, ceiling: 46, floor: 16, targetShare: 0, redZone: 82, burst: 76, clutch: 92, avatarUrl: 'https://picsum.photos/seed/allen/100/100', trend: 'up' },
  { id: '5', name: 'Travis Kelce', position: 'TE', team: 'KC', totalPoints: 210.4, ppg: 14.5, consistency: 92, ceiling: 28, floor: 7, targetShare: 24.0, redZone: 97, burst: 62, clutch: 95, avatarUrl: 'https://picsum.photos/seed/kelce/100/100', trend: 'stable' },
  { id: '6', name: 'CeeDee Lamb', position: 'WR', team: 'DAL', totalPoints: 335.9, ppg: 21.5, consistency: 87, ceiling: 40, floor: 10, targetShare: 27.0, redZone: 70, burst: 88, clutch: 82, avatarUrl: 'https://picsum.photos/seed/lamb/100/100', trend: 'up' },
  { id: '7', name: 'Lamar Jackson', position: 'QB', team: 'BAL', totalPoints: 360.5, ppg: 23.1, consistency: 80, ceiling: 50, floor: 12, targetShare: 0, redZone: 68, burst: 95, clutch: 78, avatarUrl: 'https://picsum.photos/seed/lamar/100/100', trend: 'up' },
  { id: '8', name: 'Bijan Robinson', position: 'RB', team: 'ATL', totalPoints: 245.3, ppg: 16.2, consistency: 70, ceiling: 32, floor: 5, targetShare: 12.0, redZone: 44, burst: 86, clutch: 60, avatarUrl: 'https://picsum.photos/seed/bijan/100/100', trend: 'down' },
  { id: '9', name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', totalPoints: 298.4, ppg: 19.9, consistency: 90, ceiling: 35, floor: 11, targetShare: 30.2, redZone: 72, burst: 68, clutch: 85, avatarUrl: 'https://picsum.photos/seed/amonra/100/100', trend: 'stable' },
  { id: '10', name: 'Saquon Barkley', position: 'RB', team: 'NYG', totalPoints: 270.1, ppg: 17.6, consistency: 76, ceiling: 45, floor: 8, targetShare: 15.0, redZone: 55, burst: 92, clutch: 74, avatarUrl: 'https://picsum.photos/seed/saquon/100/100', trend: 'up' },
  { id: '11', name: 'Garrett Wilson', position: 'WR', team: 'NYJ', totalPoints: 240.4, ppg: 15.0, consistency: 68, ceiling: 28, floor: 4, targetShare: 33.0, redZone: 35, burst: 80, clutch: 58, avatarUrl: 'https://picsum.photos/seed/garrettwilson/100/100', trend: 'down' },
  { id: '12', name: 'Anthony Richardson', position: 'QB', team: 'IND', totalPoints: 255.0, ppg: 19.0, consistency: 60, ceiling: 55, floor: 6, targetShare: 0, redZone: 65, burst: 98, clutch: 50, avatarUrl: 'https://picsum.photos/seed/richardson/100/100', trend: 'stable' },
  // New Players for Scatter Plot
  { id: '13', name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', totalPoints: 305.2, ppg: 18.5, consistency: 75, ceiling: 55, floor: 3, targetShare: 26.0, redZone: 65, burst: 94, clutch: 75, avatarUrl: 'https://picsum.photos/seed/chase/100/100', trend: 'up' },
  { id: '14', name: 'Breece Hall', position: 'RB', team: 'NYJ', totalPoints: 260.5, ppg: 16.8, consistency: 82, ceiling: 40, floor: 8, targetShare: 14.0, redZone: 50, burst: 88, clutch: 65, avatarUrl: 'https://picsum.photos/seed/breece/100/100', trend: 'up' },
  { id: '15', name: 'Jalen Hurts', position: 'QB', team: 'PHI', totalPoints: 385.0, ppg: 24.2, consistency: 88, ceiling: 45, floor: 18, targetShare: 0, redZone: 95, burst: 70, clutch: 90, avatarUrl: 'https://picsum.photos/seed/hurts/100/100', trend: 'stable' },
  { id: '16', name: 'Mark Andrews', position: 'TE', team: 'BAL', totalPoints: 195.0, ppg: 13.5, consistency: 85, ceiling: 25, floor: 5, targetShare: 22.0, redZone: 88, burst: 55, clutch: 80, avatarUrl: 'https://picsum.photos/seed/andrews/100/100', trend: 'down' },
  { id: '17', name: 'Davante Adams', position: 'WR', team: 'LV', totalPoints: 280.0, ppg: 17.5, consistency: 80, ceiling: 38, floor: 6, targetShare: 32.0, redZone: 75, burst: 60, clutch: 85, avatarUrl: 'https://picsum.photos/seed/adams/100/100', trend: 'down' },
  { id: '18', name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', totalPoints: 230.0, ppg: 15.5, consistency: 65, ceiling: 42, floor: 4, targetShare: 16.0, redZone: 45, burst: 95, clutch: 55, avatarUrl: 'https://picsum.photos/seed/gibbs/100/100', trend: 'up' },
  { id: '19', name: 'Patrick Mahomes', position: 'QB', team: 'KC', totalPoints: 370.0, ppg: 23.5, consistency: 90, ceiling: 40, floor: 15, targetShare: 0, redZone: 85, burst: 65, clutch: 98, avatarUrl: 'https://picsum.photos/seed/mahomes/100/100', trend: 'stable' },
  { id: '20', name: 'Sam LaPorta', position: 'TE', team: 'DET', totalPoints: 185.0, ppg: 12.8, consistency: 78, ceiling: 26, floor: 4, targetShare: 18.0, redZone: 70, burst: 68, clutch: 72, avatarUrl: 'https://picsum.photos/seed/laporta/100/100', trend: 'up' },
  { id: '21', name: 'Puka Nacua', position: 'WR', team: 'LAR', totalPoints: 275.0, ppg: 17.2, consistency: 84, ceiling: 32, floor: 8, targetShare: 28.0, redZone: 55, burst: 72, clutch: 78, avatarUrl: 'https://picsum.photos/seed/puka/100/100', trend: 'stable' },
  { id: '22', name: 'Kyren Williams', position: 'RB', team: 'LAR', totalPoints: 250.0, ppg: 19.5, consistency: 86, ceiling: 35, floor: 10, targetShare: 12.0, redZone: 85, burst: 65, clutch: 82, avatarUrl: 'https://picsum.photos/seed/kyren/100/100', trend: 'up' },
  { id: '23', name: 'CJ Stroud', position: 'QB', team: 'HOU', totalPoints: 340.0, ppg: 21.0, consistency: 82, ceiling: 42, floor: 12, targetShare: 0, redZone: 60, burst: 85, clutch: 88, avatarUrl: 'https://picsum.photos/seed/stroud/100/100', trend: 'up' },
  { id: '24', name: 'George Kittle', position: 'TE', team: 'SF', totalPoints: 190.0, ppg: 13.0, consistency: 72, ceiling: 35, floor: 2, targetShare: 19.0, redZone: 65, burst: 82, clutch: 85, avatarUrl: 'https://picsum.photos/seed/kittle/100/100', trend: 'down' }
];

let players = [];
const state = {
  selectedPlayerId: null,
  filter: 'all'
};

// Helpers
const byMetric = metric => [...players].sort((a, b) => b[metric] - a[metric]);
const getTop = metric => byMetric(metric)[0];
const getSelected = () => players.find(p => p.id === state.selectedPlayerId) || players[0];
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

function calculatePlayerScore(player) {
  const score = (player.consistency + player.ppg * 3 + player.ceiling) / 3;
  return clamp(Math.round(score), 0, 99);
}

function radarData(player) {
  // Mock data generation for missing metrics based on player quality
  const seed = player.ppg + player.consistency;
  const rec = Math.min(100, (player.ppg * 3.5)); 
  const recYpg = Math.min(100, (player.ppg * 4));
  const yprr = Math.min(100, (player.consistency * 0.9));
  const firstDrr = Math.min(100, (player.ceiling * 1.5));
  const impG = Math.min(100, (player.ppg * 3 + 10));

  return [
    { axis: 'FPTS', value: Math.min(100, (player.totalPoints / 400) * 100) },
    { axis: 'PPG', value: Math.min(100, (player.ppg / 30) * 100) },
    { axis: 'REC', value: rec },
    { axis: 'recYPG', value: recYpg },
    { axis: 'TS %', value: Math.min(100, (player.targetShare / 40) * 100) },
    { axis: 'YPRR', value: yprr },
    { axis: '1DRR', value: firstDrr },
    { axis: 'IMP/G', value: impG }
  ];
}

function ppgBarData(filter) {
  return [...players]
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.ppg - a.ppg)
    .slice(0, 10)
    .map(p => ({ label: p.name.split(' ').pop() || p.name, value: p.ppg }));
}

// Rendering functions
function renderSummary() {
  const topPoints = getTop('totalPoints');
  const topConsistencyRB = [...players]
    .filter(p => p.position === 'RB')
    .sort((a, b) => b.consistency - a.consistency)[0] || getTop('consistency');
  const topPPG = getTop('ppg');
  const topShare = getTop('targetShare');

  const projectedMaxPoints = 450; // visual scale only

  setText('total-points-value', topPoints.totalPoints.toFixed(1));
  setText('total-points-name', topPoints.name);
  setWidth('total-points-bar', (topPoints.totalPoints / projectedMaxPoints) * 100);

  setText('consistency-value', `${topConsistencyRB.consistency}%`);
  setText('consistency-name', topConsistencyRB.name);
  setWidth('consistency-bar', topConsistencyRB.consistency);

  setText('ppg-value', topPPG.ppg.toFixed(1));
  setText('ppg-name', topPPG.name);

  setText('share-value', `${topShare.targetShare}%`);
  setText('share-name', topShare.name);
}

function renderCustomSelect() {
  const optionsContainer = document.getElementById('player-select-options');
  const label = document.getElementById('player-select-label');
  if (!optionsContainer) return;

  // Populate options
  optionsContainer.innerHTML = players
    .map(p => `
      <li class="fc-option ${p.id === state.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
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
      state.selectedPlayerId = value;
      
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
  setText('rating-meta', `${player.position} // ${player.team}`);
}

function renderRadar() {
  const data = radarData(getSelected());
  drawRadarChart('radar-chart', data);
}

function renderBar() {
  const data = ppgBarData(state.filter);
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
  drawScatterChart('scatter-chart', players);
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
      state.filter = filter;
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
    const active = btn.dataset.filter === state.filter;
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
  if (!container) return;
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
    .padding(0.45);

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
  const fontSizeVal = Math.max(8, width * 0.025);
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
  if (!container) return;
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
  const x = d3.scaleLinear()
    .domain([50, 100]) // Consistency range
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([20, 70]) // Ceiling range
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
window.initFantasyDashboard = function(data) {
  players = data || defaultPlayers;
  state.selectedPlayerId = players[0].id;
  
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
