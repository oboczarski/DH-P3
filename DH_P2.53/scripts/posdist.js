(function () {
  const PAGE_ID = 'research';
  const CSV_URL = '/data/POS-DIST_07-25/POS-DIST_2007-2025.csv';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const DEFAULT_MIN_YEAR = 2014;

  const RANGE_COLORS = {
    '12': { RB: '#00ad87', WR: '#0467c1' },
    '36': { RB: '#00ffc6', WR: '#2c9cff' },
    '60': { RB: '#6afff6', WR: '#6ab7fc' }
  };

  const ICONS = {
    'shield-alert': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 5 12 5-9 5 9 5-12"/><path d="M5 20h14"/></svg>',
    'trending-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
    'trending-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>'
  };

  const state = {
    data: null,
    years: [],
    activePersonnel: '12',
    initialized: false,
    loaded: false,
    yearMin: null,
    yearMax: null,
    resizeTimer: null
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function createSVG(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      const next = text[i + 1];
      if (ch === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        row.push(cell);
        cell = '';
      } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (ch === '\r' && next === '\n') i += 1;
        row.push(cell);
        if (row.some((value) => String(value).trim() !== '')) rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += ch;
      }
    }
    if (cell.length || row.length) {
      row.push(cell);
      if (row.some((value) => String(value).trim() !== '')) rows.push(row);
    }
    if (!rows.length) return [];
    const headers = rows.shift().map((header) => header.trim().replace(/^\uFEFF/, ''));
    return rows.map((values) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = (values[index] ?? '').trim();
      });
      return obj;
    });
  }

  function asNumber(value, fallback = 0) {
    const n = Number(String(value ?? '').replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : fallback;
  }

  function countTop(sortedRows, cutoff) {
    const counts = { WR: 0, RB: 0, QB: 0, TE: 0, gap: 0 };
    sortedRows.slice(0, cutoff).forEach((row) => {
      const pos = String(row.POS || '').trim().toUpperCase();
      if (Object.prototype.hasOwnProperty.call(counts, pos)) counts[pos] += 1;
    });
    counts.gap = counts.WR - counts.RB;
    return counts;
  }

  function buildDistributionData(rows) {
    const byYear = new Map();
    rows.forEach((row) => {
      const year = asNumber(row.YEAR || row.SZN || row.Year, null);
      const rank = asNumber(row['FPTS RK'], null);
      if (!year || !rank) return;
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(row);
    });

    const years = Array.from(byYear.keys()).sort((a, b) => a - b);
    const data = { years, g1: {}, mini: {} };

    years.forEach((year) => {
      const sorted = byYear.get(year).slice().sort((a, b) => {
        const rankA = asNumber(a['FPTS RK'], 999999);
        const rankB = asNumber(b['FPTS RK'], 999999);
        if (rankA !== rankB) return rankA - rankB;
        const fptsA = asNumber(a.FPTS, -999999);
        const fptsB = asNumber(b.FPTS, -999999);
        if (fptsA !== fptsB) return fptsB - fptsA;
        const nameA = String(a.Player || a.PLAYER || '').toLowerCase();
        const nameB = String(b.Player || b.PLAYER || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });

      data.g1[String(year)] = {
        '12': countTop(sorted, 12),
        '36': countTop(sorted, 36),
        '60': countTop(sorted, 60)
      };
      data.mini[String(year)] = {
        cutoffs: [6, 12, 24, 36, 48, 60],
        WR: [6, 12, 24, 36, 48, 60].map((cutoff) => countTop(sorted, cutoff).WR),
        RB: [6, 12, 24, 36, 48, 60].map((cutoff) => countTop(sorted, cutoff).RB)
      };
    });

    return data;
  }

  function smoothPath(points, smoothing = 0.18) {
    if (!points || points.length < 2) return '';
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) * smoothing;
      const cp1y = p1[1] + (p2[1] - p0[1]) * smoothing;
      const cp2x = p2[0] - (p3[0] - p1[0]) * smoothing;
      const cp2y = p2[1] - (p3[1] - p1[1]) * smoothing;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  }

  function setTooltipHandlers(container) {
    const tip = byId('posdist-tooltip');
    if (!tip || !container) return;
    container.querySelectorAll('[data-posdist-tip]').forEach((node) => {
      const show = (event) => {
        tip.innerHTML = node.getAttribute('data-posdist-tip') || '';
        tip.setAttribute('aria-hidden', 'false');
        tip.classList.add('visible');
        const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || window.innerWidth / 2;
        const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || window.innerHeight / 2;
        tip.style.left = `${clientX}px`;
        tip.style.top = `${clientY - 12}px`;
      };
      const hide = () => {
        tip.classList.remove('visible');
        tip.setAttribute('aria-hidden', 'true');
      };
      node.addEventListener('mousemove', show);
      node.addEventListener('focus', show);
      node.addEventListener('mouseleave', hide);
      node.addEventListener('blur', hide);
      node.setAttribute('tabindex', '0');
    });
  }

  function renderMiniYearGrid() {
    const container = byId('posdist-mini-year-grid');
    if (!container || !state.data) return;
    const years = state.years;
    const compact = window.innerWidth < 720;
    const cols = compact ? 2 : 4;
    const panelW = compact ? 206 : 240;
    const panelH = compact ? 128 : 138;
    const gapX = compact ? 10 : 14;
    const gapY = compact ? 10 : 14;
    const rows = Math.ceil(years.length / cols);
    const w = cols * panelW + (cols - 1) * gapX;
    const h = rows * panelH + (rows - 1) * gapY;
    const maxY = 30;
    let svg = `<svg class="posdist-mini-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Mini distribution grid">`;

    years.forEach((year, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const ox = col * (panelW + gapX);
      const oy = row * (panelH + gapY);
      const m = { l: 28, r: 12, t: 25, b: 25 };
      const plotW = panelW - m.l - m.r;
      const plotH = panelH - m.t - m.b;
      const datum = state.data.mini[String(year)];
      const x = (i) => ox + m.l + (i / (datum.cutoffs.length - 1)) * plotW;
      const y = (value) => oy + m.t + plotH - (value / maxY) * plotH;
      const wrPts = datum.WR.map((value, i) => [x(i), y(value)]);
      const rbPts = datum.RB.map((value, i) => [x(i), y(value)]);

      svg += `<rect class="posdist-mini-panel-bg" x="${ox}" y="${oy}" width="${panelW}" height="${panelH}" rx="18"/>`;
      svg += `<text class="posdist-mini-year-label" x="${ox + 14}" y="${oy + 18}">${year}</text>`;
      svg += `<text class="posdist-mini-wr-total" x="${ox + 66}" y="${oy + 18}">WR ${datum.WR[datum.WR.length - 1]}</text>`;
      svg += `<text class="posdist-mini-rb-total" x="${ox + 115}" y="${oy + 18}">RB ${datum.RB[datum.RB.length - 1]}</text>`;
      [0, 15, 30].forEach((value) => {
        svg += `<line class="posdist-mini-gridline" x1="${ox + m.l}" x2="${ox + panelW - m.r}" y1="${y(value)}" y2="${y(value)}"/>`;
      });
      datum.cutoffs.forEach((cutoff, i) => {
        const xx = x(i);
        svg += `<line class="posdist-mini-cutoff-line" x1="${xx}" x2="${xx}" y1="${oy + m.t}" y2="${oy + panelH - m.b}"/>`;
        if ([6, 24, 60].includes(cutoff)) {
          svg += `<text class="posdist-mini-cutoff-label" x="${xx}" y="${oy + panelH - 8}" text-anchor="middle">T${cutoff}</text>`;
        }
      });
      svg += `<path class="posdist-mini-line posdist-mini-line--wr" d="${smoothPath(wrPts, 0.2)}"/>`;
      svg += `<path class="posdist-mini-line posdist-mini-line--rb" d="${smoothPath(rbPts, 0.2)}"/>`;
    });

    container.innerHTML = `${svg}</svg>`;
  }

  function renderG1Lines() {
    const container = byId('posdist-g1-line-chart');
    if (!container || !state.data) return;
    const years = state.years;
    const compact = window.innerWidth < 720;
    const w = 1120;
    const h = compact ? 470 : 430;
    const m = compact ? { l: 42, r: 86, t: 50, b: 58 } : { l: 42, r: 92, t: 36, b: 48 };
    const plotW = w - m.l - m.r;
    const plotH = h - m.t - m.b;
    const x = (year) => m.l + ((year - years[0]) / (years[years.length - 1] - years[0])) * plotW;
    const y = (value) => m.t + plotH - (value / 27) * plotH;
    const labelOffsets = {
      'WR-12': [-3, -14],
      'WR-36': [-3, -12],
      'WR-60': [-3, -12],
      'RB-12': [3, 18],
      'RB-36': [3, 20],
      'RB-60': [3, 20]
    };
    const series = [
      { key: '12', pos: 'WR', label: 'WR T12', className: 'wr12', dash: '' },
      { key: '36', pos: 'WR', label: 'WR T36', className: 'wr36', dash: '8 5' },
      { key: '60', pos: 'WR', label: 'WR T60', className: 'wr60', dash: '2 5' },
      { key: '12', pos: 'RB', label: 'RB T12', className: 'rb12', dash: '' },
      { key: '36', pos: 'RB', label: 'RB T36', className: 'rb36', dash: '8 5' },
      { key: '60', pos: 'RB', label: 'RB T60', className: 'rb60', dash: '2 5' }
    ];
    let svg = `<svg class="posdist-g1-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="G1 line chart with labels">`;
    [0, 5, 10, 15, 20, 25].forEach((value) => {
      svg += `<line class="posdist-g1-gridline" x1="${m.l}" x2="${w - m.r}" y1="${y(value)}" y2="${y(value)}"/>`;
      svg += `<text class="posdist-g1-axis-label" x="${m.l - 8}" y="${y(value) + 4}" text-anchor="end">${value}</text>`;
    });
    years.forEach((year) => {
      const xx = x(year);
      svg += `<line class="posdist-g1-year-line" x1="${xx}" x2="${xx}" y1="${m.t}" y2="${h - m.b}"/>`;
      svg += `<text class="posdist-g1-year-label" x="${xx}" y="${h - 18}" text-anchor="middle">${year}</text>`;
    });
    svg += `<text class="posdist-g1-chart-note" x="${m.l}" y="20">Blue shades = WR · Green shades = RB · Scale max = 27 · All points labeled</text>`;
    series.forEach((item) => {
      const points = years.map((year) => [x(year), y(state.data.g1[String(year)][item.key][item.pos])]);
      const last = points[points.length - 1];
      const dash = item.dash ? `stroke-dasharray="${item.dash}"` : '';
      svg += `<path class="posdist-g1-line posdist-g1-line--${item.className}" d="${smoothPath(points)}" ${dash}/>`;
      points.forEach((point, index) => {
        const value = state.data.g1[String(years[index])][item.key][item.pos];
        const offset = labelOffsets[`${item.pos}-${item.key}`] || [0, -12];
        svg += `<circle class="posdist-g1-point posdist-g1-point--${item.className}" cx="${point[0]}" cy="${point[1]}" r="${compact ? 3.6 : 4.2}" data-posdist-tip="<strong>${years[index]} · ${item.label}</strong><br>${item.pos}: ${value}"/>`;
        svg += `<text class="posdist-g1-value-label posdist-g1-value-label--${item.className}" x="${point[0] + offset[0]}" y="${point[1] + offset[1]}" text-anchor="${item.pos === 'WR' ? 'end' : 'start'}">${value}</text>`;
      });
      svg += `<text class="posdist-g1-series-label posdist-g1-series-label--${item.className}" x="${last[0] + 10}" y="${last[1] + 4}">${item.label}</text>`;
    });
    container.innerHTML = `${svg}</svg>`;
    setTooltipHandlers(container);
  }

  function populateYearControls() {
    const minSelect = byId('posdist-year-min');
    const maxSelect = byId('posdist-year-max');
    if (!minSelect || !maxSelect || !state.years.length) return;
    const latest = state.years[state.years.length - 1];
    state.yearMin = state.years.includes(DEFAULT_MIN_YEAR) ? DEFAULT_MIN_YEAR : state.years[0];
    state.yearMax = latest;
    const optionMarkup = state.years.map((year) => `<option value="${year}">${year}</option>`).join('');
    minSelect.innerHTML = optionMarkup;
    maxSelect.innerHTML = optionMarkup;
    minSelect.value = String(state.yearMin);
    maxSelect.value = String(state.yearMax);
  }

  function selectedComboYears() {
    return state.years.filter((year) => year >= state.yearMin && year <= state.yearMax);
  }

  function clampYearRange(changed) {
    const minSelect = byId('posdist-year-min');
    const maxSelect = byId('posdist-year-max');
    state.yearMin = asNumber(minSelect?.value, state.yearMin);
    state.yearMax = asNumber(maxSelect?.value, state.yearMax);
    if (state.yearMin > state.yearMax) {
      if (changed === 'min') {
        state.yearMax = state.yearMin;
        if (maxSelect) maxSelect.value = String(state.yearMax);
      } else {
        state.yearMin = state.yearMax;
        if (minSelect) minSelect.value = String(state.yearMin);
      }
    }
  }

  function setupYearControls() {
    const minSelect = byId('posdist-year-min');
    const maxSelect = byId('posdist-year-max');
    if (!minSelect || !maxSelect) return;
    minSelect.addEventListener('change', () => {
      clampYearRange('min');
      renderCombo();
    });
    maxSelect.addEventListener('change', () => {
      clampYearRange('max');
      renderCombo();
    });
  }

  function renderCombo() {
    const container = byId('posdist-combo-g1-g2');
    if (!container || !state.data) return;
    const years = selectedComboYears();
    if (!years.length) {
      container.innerHTML = '<p class="posdist-empty-note">No years available for the selected range.</p>';
      return;
    }
    const compact = window.innerWidth < 720;
    const groupW = compact ? 78 : 86;
    const w = 60 + years.length * groupW + 22;
    const h = compact ? 620 : 620;
    const markerTop = 38;
    const markerBottom = compact ? 128 : 132;
    const barTop = compact ? 150 : 150;
    const barBottom = compact ? 508 : 520;
    const barMax = 27;
    const gapValues = years.flatMap((year) => ['12', '36', '60'].map((cutoff) => state.data.g1[String(year)][cutoff].gap));
    const gapMin = Math.min(-10, Math.min(...gapValues) - 1);
    const gapMax = Math.max(12, Math.max(...gapValues) + 1);
    const gapY = (value) => markerTop + (markerBottom - markerTop) - ((value - gapMin) / (gapMax - gapMin)) * (markerBottom - markerTop);
    const gapZero = gapY(0);
    const barY = (value) => barTop + (barBottom - barTop) - (value / barMax) * (barBottom - barTop);
    let svg = `<svg class="posdist-combo-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Combined G1 and G2 enlarged">`;
    [0, 5, 10, 15, 20, 25].forEach((value) => {
      svg += `<line class="posdist-combo-bar-gridline" x1="46" x2="${w - 18}" y1="${barY(value)}" y2="${barY(value)}"/>`;
      svg += `<text class="posdist-combo-axis-label" x="36" y="${barY(value) + 4}" text-anchor="end">${value}</text>`;
    });
    for (let value = Math.ceil(gapMin / 4) * 4; value <= gapMax; value += 4) {
      svg += `<line class="posdist-combo-gap-gridline${value === 0 ? ' posdist-combo-gap-gridline--zero' : ''}" x1="46" x2="${w - 18}" y1="${gapY(value)}" y2="${gapY(value)}"/>`;
      svg += `<text class="posdist-combo-axis-label" x="36" y="${gapY(value) + 4}" text-anchor="end">${value}</text>`;
    }
    svg += `<text class="posdist-combo-chart-note" x="46" y="22">Difference markers above matching count bars · Range ${state.yearMin}-${state.yearMax}</text>`;
    years.forEach((year, yearIndex) => {
      const gx = 46 + yearIndex * groupW + 10;
      ['12', '36', '60'].forEach((cutoff, cutoffIndex) => {
        const cx = gx + cutoffIndex * 20;
        const counts = state.data.g1[String(year)][cutoff];
        const gap = counts.gap;
        const wrColor = RANGE_COLORS[cutoff].WR;
        const rbColor = RANGE_COLORS[cutoff].RB;
        const gapColor = gap >= 0 ? wrColor : rbColor;
        const markerX = cx + 8.5;
        const markerY = gapY(gap);
        const barW = compact ? 7 : 8;
        const wrX = cx;
        const rbX = cx + 9.5;
        const wrH = (barBottom - barTop) * counts.WR / barMax;
        const rbH = (barBottom - barTop) * counts.RB / barMax;
        svg += `<line class="posdist-combo-marker-line" x1="${markerX}" x2="${markerX}" y1="${gapZero}" y2="${markerY}" stroke="${gapColor}"/>`;
        svg += `<circle class="posdist-combo-marker-dot" cx="${markerX}" cy="${markerY}" r="5.2" stroke="${gapColor}" data-posdist-tip="<strong>${year} · Top ${cutoff}</strong><br>WR-RB: ${gap > 0 ? '+' : ''}${gap}"/>`;
        svg += `<text class="posdist-combo-gap-label" x="${markerX}" y="${gap >= 0 ? markerY - 8 : markerY + 15}" text-anchor="middle" fill="${gapColor}">${gap > 0 ? '+' : ''}${gap}</text>`;
        svg += `<rect class="posdist-combo-bar posdist-combo-bar--wr${cutoff}" x="${wrX}" y="${barY(counts.WR)}" width="${barW}" height="${wrH}" rx="4" fill="${wrColor}" data-posdist-tip="<strong>${year} · Top ${cutoff}</strong><br>WR: ${counts.WR}"/>`;
        svg += `<rect class="posdist-combo-bar posdist-combo-bar--rb${cutoff}" x="${rbX}" y="${barY(counts.RB)}" width="${barW}" height="${rbH}" rx="4" fill="${rbColor}" data-posdist-tip="<strong>${year} · Top ${cutoff}</strong><br>RB: ${counts.RB}"/>`;
        svg += `<text class="posdist-combo-cutoff-label" x="${cx + 8.5}" y="${h - 48}" text-anchor="middle">T${cutoff}</text>`;
      });
      svg += `<line class="posdist-combo-year-rule" x1="${gx - 5}" x2="${gx + 58}" y1="${h - 66}" y2="${h - 66}"/>`;
      svg += `<text class="posdist-combo-year-label" x="${gx + 28}" y="${h - 24}" text-anchor="middle">${year}</text>`;
    });
    container.innerHTML = `${svg}</svg>`;
    setTooltipHandlers(container);
  }

  function renderG2ThreeLines() {
    const container = byId('posdist-g2-three-lines');
    if (!container || !state.data) return;
    const years = state.years;
    const compact = window.innerWidth < 720;
    const w = 1120;
    const h = compact ? 430 : 386;
    const m = compact ? { l: 44, r: 82, t: 40, b: 54 } : { l: 44, r: 76, t: 30, b: 44 };
    const plotW = w - m.l - m.r;
    const plotH = h - m.t - m.b;
    const minY = -16;
    const maxY = 6;
    const x = (year) => m.l + ((year - years[0]) / (years[years.length - 1] - years[0])) * plotW;
    const y = (value) => m.t + plotH - ((value - minY) / (maxY - minY)) * plotH;
    const zeroY = y(0);
    const ranges = [
      { key: '12', label: 'T12', dash: '' },
      { key: '36', label: 'T36', dash: '8 6' },
      { key: '60', label: 'T60', dash: '2 6' }
    ];
    let svg = `<svg class="posdist-g2-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="G2 three line chart"><defs><clipPath id="posdist-g2-positive-clip"><rect x="${m.l}" y="${m.t}" width="${plotW}" height="${Math.max(0, zeroY - m.t)}"></rect></clipPath><clipPath id="posdist-g2-negative-clip"><rect x="${m.l}" y="${zeroY}" width="${plotW}" height="${Math.max(0, h - m.b - zeroY)}"></rect></clipPath></defs>`;
    [-16, -12, -8, -4, 0, 2, 4, 6].forEach((value) => {
      svg += `<line class="posdist-g2-gridline${value === 0 ? ' posdist-g2-gridline--zero' : ''}" x1="${m.l}" x2="${w - m.r}" y1="${y(value)}" y2="${y(value)}"/>`;
      svg += `<text class="posdist-g2-axis-label" x="${m.l - 8}" y="${y(value) + 4}" text-anchor="end">${value}</text>`;
    });
    years.forEach((year) => {
      const xx = x(year);
      svg += `<line class="posdist-g2-year-line" x1="${xx}" x2="${xx}" y1="${m.t}" y2="${h - m.b}"/>`;
      svg += `<text class="posdist-g2-year-label" x="${xx}" y="${h - 16}" text-anchor="middle">${year}</text>`;
    });
    ranges.forEach((range) => {
      const rbColor = RANGE_COLORS[range.key].RB;
      const wrColor = RANGE_COLORS[range.key].WR;
      const points = years.map((year) => {
        const value = -state.data.g1[String(year)][range.key].gap;
        return { year, value, xx: x(year), yy: y(value) };
      });
      const d = smoothPath(points.map((point) => [point.xx, point.yy]));
      const dash = range.dash ? `stroke-dasharray="${range.dash}"` : '';
      svg += `<path class="posdist-g2-line posdist-g2-line--rb" d="${d}" stroke="${rbColor}" ${dash} clip-path="url(#posdist-g2-positive-clip)"/>`;
      svg += `<path class="posdist-g2-line posdist-g2-line--wr" d="${d}" stroke="${wrColor}" ${dash} clip-path="url(#posdist-g2-negative-clip)"/>`;
      points.forEach((point) => {
        const color = point.value >= 0 ? rbColor : wrColor;
        const side = point.value < 0 ? 'More WR than RB' : point.value > 0 ? 'More RB than WR' : 'Even';
        svg += `<circle class="posdist-g2-point" cx="${point.xx}" cy="${point.yy}" r="3" stroke="${color}" data-posdist-tip="<strong>${range.label}</strong><br>${point.year}: ${point.value > 0 ? '+' : ''}${point.value}<br>${side}"/>`;
      });
      const last = points[points.length - 1];
      svg += `<text class="posdist-g2-series-label" x="${last.xx + 8}" y="${last.yy + 4}" fill="${last.value >= 0 ? rbColor : wrColor}">${range.label}</text>`;
    });
    svg += `<text class="posdist-g2-chart-note" x="${m.l}" y="18">Negative = WR edge · Positive = RB edge · Rounded spline lines</text></svg>`;
    container.innerHTML = svg;
    setTooltipHandlers(container);
  }

  function replaceIcons() {
    document.querySelectorAll('[data-posdist-icon]').forEach((node) => {
      const name = node.getAttribute('data-posdist-icon');
      node.innerHTML = ICONS[name] || ICONS.shield;
      node.classList.add('posdist-icon--inline');
    });
  }

  function personnelPlayer(className, label, caption) {
    return `<div class="posdist-field-player ${className}"><div class="posdist-player-dot">${label}</div><span>${caption}</span></div>`;
  }

  function linemenMarkup() {
    return `
      <div class="posdist-linemen">
        <div>LT</div><div>LG</div><div>C</div><div>RG</div><div>RT</div>
      </div>
      <div class="posdist-line-of-scrimmage"></div>
    `;
  }

  function updateScopedPersonnelSimulator(personnelType) {
    state.activePersonnel = personnelType;
    document.querySelectorAll('.posdist-simulator-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.personnel === personnelType);
      button.setAttribute('aria-pressed', String(button.dataset.personnel === personnelType));
    });

    const fieldGrid = byId('posdist-tactical-field-grid');
    const formulaText = byId('posdist-shift-formula-display');
    const rbStat = byId('posdist-sim-stat-rb');
    const wrStat = byId('posdist-sim-stat-wr');
    const teStat = byId('posdist-sim-stat-te');
    const qbStat = byId('posdist-sim-stat-qb');
    if (!fieldGrid || !formulaText || !rbStat || !wrStat || !teStat || !qbStat) return;

    // Personnel simulator field: generated markup is scoped to this Research
    // feature and only swaps the offensive alignment nodes inside the field.
    let players = linemenMarkup();
    if (personnelType === '11') {
      players += [
        personnelPlayer('posdist-field-player--qb posdist-field-player--qb-shotgun', 'QB', 'Shotgun'),
        personnelPlayer('posdist-field-player--rb posdist-field-player--rb-offset', 'RB', 'Offset RB'),
        personnelPlayer('posdist-field-player--te posdist-field-player--te-inline-right', 'TE', 'Y-Inline'),
        personnelPlayer('posdist-field-player--wr posdist-field-player--wr-left', 'WR1', 'Split End'),
        personnelPlayer('posdist-field-player--wr posdist-field-player--wr-right', 'WR2', 'Flanker'),
        personnelPlayer('posdist-field-player--wr posdist-field-player--wr-slot', 'WR3', 'Slot Left')
      ].join('');
      formulaText.innerHTML = '<strong class="posdist-text-gold">11 Personnel Layout (1 RB, 1 TE, 3 WR)</strong>: Highly spread targets, squeezed run surface. Historically favored defensive nickel alignments.';
      rbStat.innerHTML = '<span>RB opportunity:</span> <strong class="posdist-text-amber">Volume compromised</strong>';
      wrStat.innerHTML = '<span>WR opportunity:</span> <strong class="posdist-text-green">Max route availability (3 WR)</strong>';
      teStat.innerHTML = '<span>TE role:</span> <strong>Receiving focused</strong>';
      qbStat.innerHTML = '<span>QB protection:</span> <strong class="posdist-text-red">Vulnerable pocket</strong>';
    } else if (personnelType === '12') {
      players += [
        personnelPlayer('posdist-field-player--qb posdist-field-player--qb-under', 'QB', 'Under C'),
        personnelPlayer('posdist-field-player--rb posdist-field-player--rb-deep', 'RB', 'Deep Workhorse'),
        personnelPlayer('posdist-field-player--te posdist-field-player--te-inline-right', 'TE1', 'Y-Inline'),
        personnelPlayer('posdist-field-player--te posdist-field-player--te-inline-left', 'TE2', 'H-Inline'),
        personnelPlayer('posdist-field-player--wr posdist-field-player--wr-left', 'WR1', 'Split End'),
        personnelPlayer('posdist-field-player--wr posdist-field-player--wr-right', 'WR2', 'Flanker')
      ].join('');
      formulaText.innerHTML = '<strong class="posdist-text-indigo">12 Personnel Layout (1 RB, 2 TE, 2 WR)</strong>: Extra blocking surface created. Defense is punished for staying light. WR3 is entirely benched.';
      rbStat.innerHTML = '<span>RB opportunity:</span> <strong class="posdist-text-green">Volume &amp; route expansion ↑</strong>';
      wrStat.innerHTML = '<span>WR opportunity:</span> <strong class="posdist-text-red">WR3 route compressed ↓</strong>';
      teStat.innerHTML = '<span>TE role:</span> <strong class="posdist-text-indigo">Two on-field TEs</strong>';
      qbStat.innerHTML = '<span>QB protection:</span> <strong class="posdist-text-green">Extra inline protection ↗</strong>';
    } else {
      players += [
        personnelPlayer('posdist-field-player--qb posdist-field-player--qb-under', 'QB', 'Under C'),
        personnelPlayer('posdist-field-player--rb posdist-field-player--rb-deep', 'RB', 'Power Back'),
        personnelPlayer('posdist-field-player--te posdist-field-player--te-inline-right', 'TE1', 'Y-Inline'),
        personnelPlayer('posdist-field-player--te posdist-field-player--te-wing-right', 'TE2', 'Wing Right'),
        personnelPlayer('posdist-field-player--te posdist-field-player--te-inline-left', 'TE3', 'Inline Left'),
        personnelPlayer('posdist-field-player--wr posdist-field-player--wr-left', 'WR1', 'Isolated X')
      ].join('');
      formulaText.innerHTML = '<strong class="posdist-text-red">13 Personnel Layout (1 RB, 3 TE, 1 WR)</strong>: Maximum physical blocking structure. Destroys light defensive sets. Complete wide receiver depth compression.';
      rbStat.innerHTML = '<span>RB opportunity:</span> <strong class="posdist-text-green">Peak leverage &amp; spacing ↑↑</strong>';
      wrStat.innerHTML = '<span>WR opportunity:</span> <strong class="posdist-text-red">WR2 &amp; WR3 benched ↓↓</strong>';
      teStat.innerHTML = '<span>TE role:</span> <strong class="posdist-text-indigo">Triple snap expansion</strong>';
      qbStat.innerHTML = '<span>QB protection:</span> <strong class="posdist-text-green">Secure pocket, lower volume</strong>';
    }
    fieldGrid.innerHTML = players;
  }

  function setupSimulator() {
    document.querySelectorAll('.posdist-simulator-button').forEach((button) => {
      button.addEventListener('click', () => updateScopedPersonnelSimulator(button.dataset.personnel || '12'));
    });
    updateScopedPersonnelSimulator(state.activePersonnel);
  }

  function renderAllCharts() {
    if (!state.loaded) return;
    renderMiniYearGrid();
    renderG1Lines();
    renderCombo();
    renderG2ThreeLines();
  }

  function handleVisible() {
    window.requestAnimationFrame(renderAllCharts);
  }

  function handleResize() {
    if (document.body.dataset.page !== PAGE_ID || !byId('posdist-tab-panel')?.classList.contains('active')) return;
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(renderAllCharts, 180);
  }

  async function loadCsv() {
    const note = byId('posdist-source-note');
    try {
      const response = await fetch(CSV_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`CSV request failed: ${response.status}`);
      const csvText = await response.text();
      state.data = buildDistributionData(parseCSV(csvText));
      state.years = state.data.years;
      state.loaded = true;
      populateYearControls();
      renderAllCharts();
    } catch (error) {
      console.error('[posdist] CSV load failed', error);
      if (note) {
        note.classList.add('posdist-source-note--error');
        note.innerHTML = 'CSV load failed. The Positional Analysis tab needs <strong>/data/POS-DIST_07-25/POS-DIST_2007-2025.csv</strong>.';
      }
    }
  }

  function init() {
    if (document.body.dataset.page !== PAGE_ID || state.initialized || !byId('posdist-tab-panel')) return;
    state.initialized = true;
    replaceIcons();
    setupSimulator();
    setupYearControls();
    window.addEventListener('research:posdist-visible', handleVisible);
    window.addEventListener('resize', handleResize);
    // Positional Analysis data source: load only the local CSV and keep all
    // chart derivation inside this research-page module.
    loadCsv();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
