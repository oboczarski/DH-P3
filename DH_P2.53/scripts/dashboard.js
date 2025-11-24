(function() {
// Fantasy Command - Vanilla JS rebuild
// Data model
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

let players = [];
const state = {
  selectedPlayerId: null,
  filter: 'all'
};

// Data Processing
function processDashboardData() {
    // Debug logging
    console.log('Dashboard: Checking state...', { 
        hasState: !!window.state, 
        statsLoaded: window.state?.statsSheetsLoaded, 
        playersLoaded: !!window.state?.players,
        playerCount: window.state?.players ? Object.keys(window.state.players).length : 0,
        seasonStatsCount: window.state?.playerSeasonStats ? Object.keys(window.state.playerSeasonStats).length : 0
    });

    if (!window.state || !window.state.playerSeasonStats || !window.state.players) {
        console.warn('Dashboard: Missing state data');
        return;
    }

    const seasonStats = window.state.playerSeasonStats;
    const sleeperPlayers = window.state.players;
    const processed = [];

    // Helper to parse float safely
    const parse = (v) => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') return parseFloat(v.replace(/,/g, '')) || 0;
        return 0;
    };

    Object.keys(seasonStats).forEach(playerId => {
        const stats = seasonStats[playerId];
        const meta = sleeperPlayers[playerId];
        if (!meta) return;

        // Basic validation - ensure they have points
        const fpts = parse(stats.fpt_ppr);
        
        if (fpts <= 0) return;

        processed.push({
            id: playerId,
            name: `${meta.first_name} ${meta.last_name}`,
            position: meta.position,
            team: meta.team || 'FA',
            totalPoints: fpts,
            ppg: parse(stats.ppg),
            consistency: parse(stats.csty_pct),
            ceiling: parse(stats.ceiling),
            targetShare: parse(stats.ts_per_rr),
            avatarUrl: `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`,
            trend: 'stable'
        });
    });

    console.log(`Dashboard: Processed ${processed.length} players`);
    players = processed.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Select top player by default if none selected
    if (!state.selectedPlayerId && players.length > 0) {
        state.selectedPlayerId = players[0].id;
    }

    // Initial Render
    renderSummary();
    renderCustomSelect();
    setupCustomSelect();
    renderSelectedDetails();
    renderRadar();
    renderBar();
    renderScatter();
    renderTable();
}

// Helpers
const byMetric = (metric, pos) => {
    let pool = players;
    if (pos) pool = pool.filter(p => p.position === pos);
    return [...pool].sort((a, b) => b[metric] - a[metric]);
};
const getTop = (metric, pos) => byMetric(metric, pos)[0];
const getSelected = () => players.find(p => p.id === state.selectedPlayerId) || players[0];
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const formatInitialLast = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstInitial = parts[0]?.[0] ? `${parts[0][0].toUpperCase()}.` : '';
  const last = parts.slice(1).join(' ');
  return `${firstInitial} ${last}`.trim();
};

function calculatePlayerScore(player) {
    if (!player) return 0;
    const score = (player.consistency + (player.ppg / 30 * 100) + player.ceiling) / 3;
    return clamp(Math.round(score), 0, 99);
}

function radarData(player) {
    if (!player) return [];
    const config = RADAR_STATS_CONFIG[player.position];
    if (!config) return [];

    const ranks = window.state.playerSeasonRanks?.[player.id] || {};
    
    return config.stats.map((statKey, i) => {
        const label = config.labels[i];
        let rankKey = statKey;
        if (statKey === 'fpts') rankKey = 'fpt_ppr';
        
        let val = ranks[rankKey];
        
        // Handle missing/string values
        if (val === undefined || val === null) val = config.maxRank;
        if (typeof val === 'string') val = parseFloat(val) || config.maxRank;
        
        // Scaling Logic from app.js
        // rank 1 -> 85, rank 7 -> 73, rank maxRank -> 10
        let scaled;
        if (val <= 1) {
            scaled = 85;
        } else if (val >= config.maxRank) {
            scaled = 10;
        } else if (val <= 7) {
            // Compress ranks 1-7 into the 73-85 range
            scaled = 85 - ((val - 1) / 6) * 12;
        } else {
            // Scale ranks 7-maxRank linearly from 73 to 10
            scaled = 73 - ((val - 7) / (config.maxRank - 7)) * 63;
        }
        
        return { axis: label, value: scaled, rank: val };
    });
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
  if (players.length === 0) return;

  const topPoints = getTop('totalPoints');
  const topConsistencyRB = getTop('consistency', 'RB');
  const topPPG = getTop('ppg');
  const topShare = getTop('targetShare', 'WR');

  const projectedMaxPoints = 450; 

  if (topPoints) {
      setText('total-points-value', topPoints.totalPoints.toFixed(1));
      setText('total-points-name', formatInitialLast(topPoints.name));
      setWidth('total-points-bar', (topPoints.totalPoints / projectedMaxPoints) * 100);
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

  // Top 100 players by FPTS
  const top100 = players.slice(0, 100);

  optionsContainer.innerHTML = top100
    .map(p => `
      <li class="fc-option ${p.id === state.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team">${p.position} - ${p.team}</span>
      </li>
    `)
    .join('');

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
  const fptsRank = data[0]?.rank ? `#${data[0].rank}` : '';
  drawRadarChart('radar-chart', data, fptsRank);
}

function renderBar() {
  const data = ppgBarData(state.filter);
  drawBarChart('bar-chart', data);
}

function renderTable() {
  // The table body ID in index.html is missing, so we need to create it or target the correct element.
  // Looking at index.html, there is no table structure in the dashboard section.
  // We need to inject the table structure if it doesn't exist, or skip rendering if not intended.
  // Assuming the user wants a leaderboard, we should probably add it to the DOM or fix the selector.
  // For now, let's log a warning if not found.
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) {
      console.warn('Dashboard: leaderboard-body element not found');
      return;
  }
  
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
  // Top 24 FPTS players
  const top24 = [...players]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 24);
  drawScatterChart('scatter-chart', top24);
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
function drawRadarChart(containerId, data, centerText) {
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

  // Center Text
  if (centerText) {
      svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(centerText)
        .attr('fill', '#fff')
        .attr('font-size', `${innerRadius * 0.8}px`)
        .attr('font-weight', 'bold')
        .style('text-shadow', '0 2px 10px rgba(0,0,0,0.5)');
  }
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

// Initialization
window.initFantasyDashboard = function() {
    const checkData = () => {
        if (window.state && window.state.statsSheetsLoaded && window.state.players && Object.keys(window.state.players).length > 0) {
            processDashboardData();
            wireEvents();
        } else {
            setTimeout(checkData, 200);
        }
    };
    checkData();
};

// Auto-init if standalone
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.initFantasyDashboard();
} else {
    document.addEventListener('DOMContentLoaded', window.initFantasyDashboard);
}
})();
